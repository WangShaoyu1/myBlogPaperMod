---
author: "敖丙"
title: "Spring容器启动流程（源码解读）"
date: 2020-12-16
description: "Spring Framework 是 Java 语言中影响最为深远的框架之一，其中的 IOC 和 AOP 两个经典思想更是一直被程序员津津乐道，后面推出的 Spring Boot、Spring Cloud 系列也是在其基础之上开发，要想搞明白 Spring 全家桶系列，必须脚踏…"
tags: ["Java","Spring中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:199,comments:0,collects:411,views:25796,"
---
> 有情怀，有干货，微信搜索【**三太子敖丙**】关注这个不一样的程序员。
> 
> 本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已收录，有一线大厂面试完整考点、资料以及我的系列文章。

前言
--

Spring Framework 是 Java 语言中影响最为深远的框架之一，其中的 IOC 和 AOP 两个经典思想更是一直被程序员津津乐道，后面推出的 Spring Boot、Spring Cloud 系列也是在其基础之上开发，要想搞明白 Spring 全家桶系列，必须脚踏实地的从 Spring Framework 学习起。

本篇文章是 Spring Framework 源码解析系列的第一篇，主要是从代码层面对 Spring 框架的启动做一个完整解析，这里的思想都是笔者根据自己使用 Spring 的经验和对 Spring 的了解综合而成，以下内容谨代表个人看法，若有疑问请不吝赐教。

另外提醒一下，本篇文章是基于 5.1.6.RELEASE 版本的代码进行分析，入口代码也是采用官方推荐的 java-config 技术，而非 xml。

源码解析
----

考虑到直接看源码是一个非常枯燥无味的过程，而且 Spring 的代码设计非常优秀规范，这会导致在翻开源码时，类与类之间的跳跃会非常频繁，不熟悉的同学可能直接晕菜，所以每一个重要流程前我都会先准备一个流程图，建议大家先通过流程图了解一下整体步骤，然后再对代码硬撸，这样能够降低不少难度。

相信每一个使用过 Spring 技术的同学都知道 Spring 在初始化过程中有一个非常重要的步骤，即 Spring 容器的刷新，这个步骤固然重要，但是刷新前的初始化流程也非常重要。本篇文章将整个启动过程分为了两个部分，即容器的初始化与刷新，下面正式开始。

### 初始化流程

**流程分析**

因为是基于 java-config 技术分析源码，所以这里的入口是 `AnnotationConfigApplicationContext` ，如果是使用 xml 分析，那么入口即为 `ClassPathXmlApplicationContext` ，它们俩的共同特征便是都继承了 `AbstractApplicationContext` 类，而大名鼎鼎的 `refresh` 方法便是在这个类中定义的，现在就不剧透了，我们接着分析 `AnnotationConfigApplicationContext` 类，可以绘制成如下流程图：

![](/images/jueJin/0eba47985d174f6.png)

看完流程图，我们应该思考一下：如果让你去设计一个 IOC 容器，你会怎么做？首先我肯定会提供一个入口（`AnnotationConfigApplicationContext` ）给用户使用，然后需要去初始化一系列的工具组件：

①：如果我想生成 bean 对象，那么就需要一个 beanFactory 工厂（`DefaultListableBeanFactory`）；

②：如果我想对加了特定注解（如 `@Service`、`@Repository`）的类进行读取转化成 `BeanDefinition` 对象（`BeanDefinition` 是 Spring 中极其重要的一个概念，它存储了 bean 对象的所有特征信息，如是否单例，是否懒加载，factoryBeanName 等），那么就需要一个注解配置读取器（`AnnotatedBeanDefinitionReader`）；

③：如果我想对用户指定的包目录进行扫描查找 bean 对象，那么还需要一个路径扫描器（`ClassPathBeanDefinitionScanner`）。

通过上面的思考，是不是上面的图理解起来就轻而易举呢？

ps：图中的黄色备注可以不看，只是在这里明确展示出来 Spring 的部分内置组件是何时何地添加到容器中的，关于组件的作用在后面的系列文章中会详细分析。

**核心代码剖析**

考虑到要是对所有代码都进行解析，那么文章篇幅会过长，因此这里只对核心内容进行源码层面的分析，凡是图中标注了 ①、②、③等字样的步骤，都可以理解为是一个比较重要的步骤，下面开始进行详细分析。

**org.springframework.context.annotation.AnnotationConfigUtils#registerAnnotationConfigProcessors**

根据上图分析，代码运行到这里时候，Spring 容器已经构造完毕，那么就可以为容器添加一些内置组件了，其中最主要的组件便是 `ConfigurationClassPostProcessor` 和 `AutowiredAnnotationBeanPostProcessor` ，前者是一个 beanFactory 后置处理器，用来完成 bean 的扫描与注入工作，后者是一个 bean 后置处理器，用来完成 `@AutoWired` 自动注入。

![](/images/jueJin/893ed3d4c98c4bb.png)

**org.springframework.context.annotation.AnnotatedBeanDefinitionReader#doRegisterBean**

这个步骤主要是用来解析用户传入的 Spring 配置类，其实也是解析成一个 `BeanDefinition` 然后注册到容器中，没有什么好说的。

```java
<T> void doRegisterBean(Class<T> annotatedClass, @Nullable Supplier<T> instanceSupplier, @Nullable String name,
    @Nullable Class<? extends Annotation>[] qualifiers, BeanDefinitionCustomizer... definitionCustomizers) {
    // 解析传入的配置类，实际上这个方法既可以解析配置类，也可以解析 Spring bean 对象
    AnnotatedGenericBeanDefinition abd = new AnnotatedGenericBeanDefinition(annotatedClass);
    // 判断是否需要跳过，判断依据是此类上有没有 @Conditional 注解
        if (this.conditionEvaluator.shouldSkip(abd.getMetadata())) {
        return;
    }
    
    abd.setInstanceSupplier(instanceSupplier);
    ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(abd);
    abd.setScope(scopeMetadata.getScopeName());
    String beanName = (name != null ? name : this.beanNameGenerator.generateBeanName(abd, this.registry));
    // 处理类上的通用注解
    AnnotationConfigUtils.processCommonDefinitionAnnotations(abd);
        if (qualifiers != null) {
            for (Class<? extends Annotation> qualifier : qualifiers) {
                if (Primary.class == qualifier) {
                abd.setPrimary(true);
            }
                else if (Lazy.class == qualifier) {
                abd.setLazyInit(true);
            }
                else {
                abd.addQualifier(new AutowireCandidateQualifier(qualifier));
            }
        }
    }
    // 封装成一个 BeanDefinitionHolder
        for (BeanDefinitionCustomizer customizer : definitionCustomizers) {
        customizer.customize(abd);
    }
    BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(abd, beanName);
    // 处理 scopedProxyMode
    definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
    
    // 把 BeanDefinitionHolder 注册到 registry
    BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, this.registry);
}
```

### 刷新流程

**流程分析**

下面这一段代码则是 Spring 中最为重要的一个步骤：容器刷新，同样先看图再分析。

![](/images/jueJin/20bd021b8b2a4bd.png)

看完流程图，我们也先思考一下：在 3.1 中我们知道了如何去初始化一个 IOC 容器，那么接下来就是让这个 IOC 容器真正起作用的时候了：即先扫描出要放入容器的 bean，将其包装成 `BeanDefinition` 对象，然后通过反射创建 bean，并完成赋值操作，这个就是 IOC 容器最简单的功能了。但是看完上图，明显 Spring 的初始化过程比这个多的多，下面我们就详细分析一下这样设计的意图：

如果用户想在扫描完 bean 之后做一些自定义的操作：假设容器中包含了 a 和 b，那么就动态向容器中注入 c，不满足就注入 d，这种骚操作 Spring 也是支持的，得益于它提供的 `BeanFactoryPostProcessor` 后置处理器，对应的是上图中的 `invokeBeanFactoryPostProcessors` 操作。

如果用户还想在 bean 的初始化前后做一些操作呢？比如生成代理对象，修改对象属性等，Spring 为我们提供了 `BeanPostProcessor` 后置处理器，实际上 Spring 容器中的大多数功能都是通过 Bean 后置处理器完成的，Spring 也是给我们提供了添加入口，对应的是上图中的 `registerBeanPostProcessors` 操作。

整个容器创建过程中，如果用户想监听容器启动、刷新等事件，根据这些事件做一些自定义的操作呢？Spring 也早已为我们考虑到了，提供了添加监听器接口和容器事件通知接口，对应的是上图中的 `registerListeners` 操作。

此时再看上图，是不是就觉得简单很多呢，下面就一些重要代码进行分析。

**核心代码剖析**

**org.springframework.context.support.AbstractApplicationContext#refresh**

这个方法是对上图中的具体代码实现，可划分为12个步骤，其中比较重要的步骤下面会有详细说明。

在这里，我们需要记住：Spring 中的每一个容器都会调用 refresh 方法进行刷新，无论是 Spring 的父子容器，还是 Spring Cloud Feign 中的 feign 隔离容器，每一个容器都会调用这个方法完成初始化。

```java
    public void refresh() throws BeansException, IllegalStateException {
        synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        // 1. 刷新前的预处理
        prepareRefresh();
        
        // Tell the subclass to refresh the internal bean factory.
        // 2. 获取 beanFactory，即前面创建的【DefaultListableBeanFactory】
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        
        // Prepare the bean factory for use in this context.
        // 3. 预处理 beanFactory，向容器中添加一些组件
        prepareBeanFactory(beanFactory);
        
            try {
            // Allows post-processing of the bean factory in context subclasses.
            // 4. 子类通过重写这个方法可以在 BeanFactory 创建并与准备完成以后做进一步的设置
            postProcessBeanFactory(beanFactory);
            
            // Invoke factory processors registered as beans in the context.
            // 5. 执行 BeanFactoryPostProcessor 方法，beanFactory 后置处理器
            invokeBeanFactoryPostProcessors(beanFactory);
            
            // Register bean processors that intercept bean creation.
            // 6. 注册 BeanPostProcessors，bean 后置处理器
            registerBeanPostProcessors(beanFactory);
            
            // Initialize message source for this context.
            // 7. 初始化 MessageSource 组件（做国际化功能；消息绑定，消息解析）
            initMessageSource();
            
            // Initialize event multicaster for this context.
            // 8. 初始化事件派发器，在注册监听器时会用到
            initApplicationEventMulticaster();
            
            // Initialize other special beans in specific context subclasses.
            // 9. 留给子容器（子类），子类重写这个方法，在容器刷新的时候可以自定义逻辑，web 场景下会使用
            onRefresh();
            
            // Check for listener beans and register them.
            // 10. 注册监听器，派发之前步骤产生的一些事件（可能没有）
            registerListeners();
            
            // Instantiate all remaining (non-lazy-init) singletons.
            // 11. 初始化所有的非单实例 bean
            finishBeanFactoryInitialization(beanFactory);
            
            // Last step: publish corresponding event.
            // 12. 发布容器刷新完成事件
            finishRefresh();
        }
        
        ...
        
    }
}
```

**org.springframework.context.support.AbstractApplicationContext#prepareBeanFactory**

顾名思义，这个接口是为 beanFactory 工厂添加一些内置组件，预处理过程。

```java
    protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // Tell the internal bean factory to use the context's class loader etc.
    // 设置 classLoader
    beanFactory.setBeanClassLoader(getClassLoader());
    //设置 bean 表达式解析器
    beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
    beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));
    
    // Configure the bean factory with context callbacks.
    // 添加一个 BeanPostProcessor【ApplicationContextAwareProcessor】
    beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
    
    // 设置忽略自动装配的接口，即不能通过注解自动注入
    beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
    beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
    beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
    beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);
    
    // BeanFactory interface not registered as resolvable type in a plain factory.
    // MessageSource registered (and found for autowiring) as a bean.
    // 注册可以解析的自动装配类，即可以在任意组件中通过注解自动注入
    beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
    beanFactory.registerResolvableDependency(ResourceLoader.class, this);
    beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
    beanFactory.registerResolvableDependency(ApplicationContext.class, this);
    
    // Register early post-processor for detecting inner beans as ApplicationListeners.
    // 添加一个 BeanPostProcessor【ApplicationListenerDetector】
    beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));
    
    // Detect a LoadTimeWeaver and prepare for weaving, if found.
    // 添加编译时的 AspectJ
        if (beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
        beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
        // Set a temporary ClassLoader for type matching.
        beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
    }
    
    // Register default environment beans.
    // 注册 environment 组件，类型是【ConfigurableEnvironment】
        if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
    }
    // 注册 systemProperties 组件，类型是【Map<String, Object>】
        if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());
    }
    // 注册 systemEnvironment 组件，类型是【Map<String, Object>】
        if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());
    }
}
```

**org.springframework.context.support.PostProcessorRegistrationDelegate#invokeBeanFactoryPostProcessors**

前文我们说过，Spring 在扫描完所有的 bean 转成 `BeanDefinition` 时候，我们是可以做一些自定义操作的，这得益于 Spring 为我们提供的 `BeanFactoryPostProcessor` 接口。

其中 `BeanFactoryPostProcessor` 又有一个子接口 `BeanDefinitionRegistryPostProcessor` ，前者会把 `ConfigurableListableBeanFactory` 暴露给我们使用，后者会把 `BeanDefinitionRegistry` 注册器暴露给我们使用，一旦获取到注册器，我们就可以按需注入了，例如搞定这种需求：假设容器中包含了 a 和 b，那么就动态向容器中注入 c，不满足就注入 d。

熟悉 Spring 的同学都知道，Spring 中的同类型组件是允许我们控制顺序的，比如在 AOP 中我们常用的 `@Order` 注解，这里的 `BeanFactoryPostProcessor` 接口当然也是提供了顺序，最先被执行的是实现了 `PriorityOrdered` 接口的实现类，然后再到实现了 `Ordered` 接口的实现类，最后就是剩下来的常规 `BeanFactoryPostProcessor` 类。

![](/images/jueJin/116f78859707444.png)

此时再看上图，是不是发现和喝水一般简单，首先会回调 `postProcessBeanDefinitionRegistry()` 方法，然后再回调 `postProcessBeanFactory()` 方法，最后注意顺序即可，下面一起看看具体的代码实现吧。

```java
public static void invokeBeanFactoryPostProcessors(
    ConfigurableListableBeanFactory beanFactory, List<BeanFactoryPostProcessor> beanFactoryPostProcessors) {
    // beanFactoryPostProcessors 这个参数是指用户通过 AnnotationConfigApplicationContext.addBeanFactoryPostProcessor() 方法手动传入的 BeanFactoryPostProcessor，没有交给 spring 管理
    // Invoke BeanDefinitionRegistryPostProcessors first, if any.
    // 代表执行过的 BeanDefinitionRegistryPostProcessor
    Set<String> processedBeans = new HashSet<>();
    
        if (beanFactory instanceof BeanDefinitionRegistry) {
        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;
        // 常规后置处理器集合，即实现了 BeanFactoryPostProcessor 接口
        List<BeanFactoryPostProcessor> regularPostProcessors = new ArrayList<>();
        // 注册后置处理器集合，即实现了 BeanDefinitionRegistryPostProcessor 接口
        List<BeanDefinitionRegistryPostProcessor> registryProcessors = new ArrayList<>();
        // 处理自定义的 beanFactoryPostProcessors（指调用 context.addBeanFactoryPostProcessor() 方法），一般这里都没有
            for (BeanFactoryPostProcessor postProcessor : beanFactoryPostProcessors) {
                if (postProcessor instanceof BeanDefinitionRegistryPostProcessor) {
                BeanDefinitionRegistryPostProcessor registryProcessor =
                (BeanDefinitionRegistryPostProcessor) postProcessor;
                // 调用 postProcessBeanDefinitionRegistry 方法
                registryProcessor.postProcessBeanDefinitionRegistry(registry);
                registryProcessors.add(registryProcessor);
            }
                else {
                regularPostProcessors.add(postProcessor);
            }
        }
        
        // Do not initialize FactoryBeans here: We need to leave all regular beans
        // uninitialized to let the bean factory post-processors apply to them!
        // Separate between BeanDefinitionRegistryPostProcessors that implement
        // PriorityOrdered, Ordered, and the rest.
        // 定义一个变量 currentRegistryProcessors，表示当前要处理的 BeanFactoryPostProcessors
        List<BeanDefinitionRegistryPostProcessor> currentRegistryProcessors = new ArrayList<>();
        
        // First, invoke the BeanDefinitionRegistryPostProcessors that implement PriorityOrdered.
        // 首先，从容器中查找实现了 PriorityOrdered 接口的 BeanDefinitionRegistryPostProcessor 类型，这里只会查找出一个【ConfigurationClassPostProcessor】
        String[] postProcessorNames =
        beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
            for (String ppName : postProcessorNames) {
            // 判断是否实现了 PriorityOrdered 接口
                if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
                // 添加到 currentRegistryProcessors
                currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                // 添加到 processedBeans，表示已经处理过这个类了
                processedBeans.add(ppName);
            }
        }
        // 设置排列顺序
        sortPostProcessors(currentRegistryProcessors, beanFactory);
        // 添加到 registry 中
        registryProcessors.addAll(currentRegistryProcessors);
        // 执行 [postProcessBeanDefinitionRegistry] 回调方法
        invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
        // 将 currentRegistryProcessors 变量清空，下面会继续用到
        currentRegistryProcessors.clear();
        
        // Next, invoke the BeanDefinitionRegistryPostProcessors that implement Ordered.
        // 接下来，从容器中查找实现了 Ordered 接口的 BeanDefinitionRegistryPostProcessors 类型，这里可能会查找出多个
        // 因为【ConfigurationClassPostProcessor】已经完成了 postProcessBeanDefinitionRegistry() 方法，已经向容器中完成扫描工作，所以容器会有很多个组件
        postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
            for (String ppName : postProcessorNames) {
            // 判断 processedBeans 是否处理过这个类，且是否实现 Ordered 接口
                if (!processedBeans.contains(ppName) && beanFactory.isTypeMatch(ppName, Ordered.class)) {
                currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                processedBeans.add(ppName);
            }
        }
        // 设置排列顺序
        sortPostProcessors(currentRegistryProcessors, beanFactory);
        // 添加到 registry 中
        registryProcessors.addAll(currentRegistryProcessors);
        // 执行 [postProcessBeanDefinitionRegistry] 回调方法
        invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
        // 将 currentRegistryProcessors 变量清空，下面会继续用到
        currentRegistryProcessors.clear();
        
        // Finally, invoke all other BeanDefinitionRegistryPostProcessors until no further ones appear.
        // 最后，从容器中查找剩余所有常规的 BeanDefinitionRegistryPostProcessors 类型
        boolean reiterate = true;
            while (reiterate) {
            reiterate = false;
            // 根据类型从容器中查找
            postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
                for (String ppName : postProcessorNames) {
                // 判断 processedBeans 是否处理过这个类
                    if (!processedBeans.contains(ppName)) {
                    // 添加到 currentRegistryProcessors
                    currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                    // 添加到 processedBeans，表示已经处理过这个类了
                    processedBeans.add(ppName);
                    // 将标识设置为 true，继续循环查找，可能随时因为防止下面调用了 invokeBeanDefinitionRegistryPostProcessors() 方法引入新的后置处理器
                    reiterate = true;
                }
            }
            // 设置排列顺序
            sortPostProcessors(currentRegistryProcessors, beanFactory);
            // 添加到 registry 中
            registryProcessors.addAll(currentRegistryProcessors);
            // 执行 [postProcessBeanDefinitionRegistry] 回调方法
            invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
            // 将 currentRegistryProcessors 变量清空，因为下一次循环可能会用到
            currentRegistryProcessors.clear();
        }
        
        // Now, invoke the postProcessBeanFactory callback of all processors handled so far.
        // 现在执行 registryProcessors 的 [postProcessBeanFactory] 回调方法
        invokeBeanFactoryPostProcessors(registryProcessors, beanFactory);
        // 执行 regularPostProcessors 的 [postProcessBeanFactory] 回调方法，也包含用户手动调用 addBeanFactoryPostProcessor() 方法添加的 BeanFactoryPostProcessor
        invokeBeanFactoryPostProcessors(regularPostProcessors, beanFactory);
    }
    
        else {
        // Invoke factory processors registered with the context instance.
        invokeBeanFactoryPostProcessors(beanFactoryPostProcessors, beanFactory);
    }
    
    // Do not initialize FactoryBeans here: We need to leave all regular beans
    // uninitialized to let the bean factory post-processors apply to them!
    // 从容器中查找实现了 BeanFactoryPostProcessor 接口的类
    String[] postProcessorNames =
    beanFactory.getBeanNamesForType(BeanFactoryPostProcessor.class, true, false);
    
    // Separate between BeanFactoryPostProcessors that implement PriorityOrdered,
    // Ordered, and the rest.
    // 表示实现了 PriorityOrdered 接口的 BeanFactoryPostProcessor
    List<BeanFactoryPostProcessor> priorityOrderedPostProcessors = new ArrayList<>();
    // 表示实现了 Ordered 接口的 BeanFactoryPostProcessor
    List<String> orderedPostProcessorNames = new ArrayList<>();
    // 表示剩下来的常规的 BeanFactoryPostProcessors
    List<String> nonOrderedPostProcessorNames = new ArrayList<>();
        for (String ppName : postProcessorNames) {
        // 判断是否已经处理过，因为 postProcessorNames 其实包含了上面步骤处理过的 BeanDefinitionRegistry 类型
            if (processedBeans.contains(ppName)) {
            // skip - already processed in first phase above
        }
        // 判断是否实现了 PriorityOrdered 接口
            else if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
            priorityOrderedPostProcessors.add(beanFactory.getBean(ppName, BeanFactoryPostProcessor.class));
        }
        // 判断是否实现了 Ordered 接口
            else if (beanFactory.isTypeMatch(ppName, Ordered.class)) {
            orderedPostProcessorNames.add(ppName);
        }
        // 剩下所有常规的
            else {
            nonOrderedPostProcessorNames.add(ppName);
        }
    }
    
    // First, invoke the BeanFactoryPostProcessors that implement PriorityOrdered.
    // 先将 priorityOrderedPostProcessors 集合排序
    sortPostProcessors(priorityOrderedPostProcessors, beanFactory);
    // 执行 priorityOrderedPostProcessors 的 [postProcessBeanFactory] 回调方法
    invokeBeanFactoryPostProcessors(priorityOrderedPostProcessors, beanFactory);
    
    // Next, invoke the BeanFactoryPostProcessors that implement Ordered.
    // 接下来，把 orderedPostProcessorNames 转成 orderedPostProcessors 集合
    List<BeanFactoryPostProcessor> orderedPostProcessors = new ArrayList<>();
        for (String postProcessorName : orderedPostProcessorNames) {
        orderedPostProcessors.add(beanFactory.getBean(postProcessorName, BeanFactoryPostProcessor.class));
    }
    // 将 orderedPostProcessors 集合排序
    sortPostProcessors(orderedPostProcessors, beanFactory);
    // 执行 orderedPostProcessors 的 [postProcessBeanFactory] 回调方法
    invokeBeanFactoryPostProcessors(orderedPostProcessors, beanFactory);
    
    // Finally, invoke all other BeanFactoryPostProcessors.
    // 最后把 nonOrderedPostProcessorNames 转成 nonOrderedPostProcessors 集合，这里只有一个，myBeanFactoryPostProcessor
    List<BeanFactoryPostProcessor> nonOrderedPostProcessors = new ArrayList<>();
        for (String postProcessorName : nonOrderedPostProcessorNames) {
        nonOrderedPostProcessors.add(beanFactory.getBean(postProcessorName, BeanFactoryPostProcessor.class));
    }
    // 执行 nonOrderedPostProcessors 的 [postProcessBeanFactory] 回调方法
    invokeBeanFactoryPostProcessors(nonOrderedPostProcessors, beanFactory);
    
    // Clear cached merged bean definitions since the post-processors might have
    // modified the original metadata, e.g. replacing placeholders in values...
    // 清除缓存
    beanFactory.clearMetadataCache();
}
```

**org.springframework.context.support.PostProcessorRegistrationDelegate#registerBeanPostProcessors**

这一步是向容器中注入 `BeanPostProcessor` ，注意这里仅仅是向容器中注入而非使用。参考上面的步骤和下面的代码，读者自行分析即可，应该不是很困难。

关于 `BeanPostProcessor` ，它的作用在后续 Spring 创建 bean 流程文章里我会详细分析一下，当然不可能分析全部的 `BeanPostProcessor` 组件，那样可能得写好几篇续文，这里我们只需要简单明白这个组件会干预 Spring 初始化 bean 的流程，从而完成代理、自动注入、循环依赖等各种功能。

```java
public static void registerBeanPostProcessors(
    ConfigurableListableBeanFactory beanFactory, AbstractApplicationContext applicationContext) {
    
    // 从容器中获取 BeanPostProcessor 类型
    String[] postProcessorNames = beanFactory.getBeanNamesForType(BeanPostProcessor.class, true, false);
    
    // Register BeanPostProcessorChecker that logs an info message when
    // a bean is created during BeanPostProcessor instantiation, i.e. when
    // a bean is not eligible for getting processed by all BeanPostProcessors.
    int beanProcessorTargetCount = beanFactory.getBeanPostProcessorCount() + 1 + postProcessorNames.length;
    // 向容器中添加【BeanPostProcessorChecker】，主要是用来检查是不是有 bean 已经初始化完成了，
    // 如果没有执行所有的 beanPostProcessor（用数量来判断），如果有就会打印一行 info 日志
    beanFactory.addBeanPostProcessor(new BeanPostProcessorChecker(beanFactory, beanProcessorTargetCount));
    
    // Separate between BeanPostProcessors that implement PriorityOrdered,
    // Ordered, and the rest.
    // 存放实现了 PriorityOrdered 接口的 BeanPostProcessor
    List<BeanPostProcessor> priorityOrderedPostProcessors = new ArrayList<>();
    // 存放 MergedBeanDefinitionPostProcessor 类型的 BeanPostProcessor
    List<BeanPostProcessor> internalPostProcessors = new ArrayList<>();
    // 存放实现了 Ordered 接口的 BeanPostProcessor 的 name
    List<String> orderedPostProcessorNames = new ArrayList<>();
    // 存放剩下来普通的 BeanPostProcessor 的 name
    List<String> nonOrderedPostProcessorNames = new ArrayList<>();
    // 从 beanFactory 中查找 postProcessorNames 里的 bean，然后放到对应的集合中
        for (String ppName : postProcessorNames) {
        // 判断有无实现 PriorityOrdered 接口
            if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
            BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
            priorityOrderedPostProcessors.add(pp);
            // 如果实现了 PriorityOrdered 接口，且属于 MergedBeanDefinitionPostProcessor
                if (pp instanceof MergedBeanDefinitionPostProcessor) {
                // 把 MergedBeanDefinitionPostProcessor 类型的添加到 internalPostProcessors 集合中
                internalPostProcessors.add(pp);
            }
        }
            else if (beanFactory.isTypeMatch(ppName, Ordered.class)) {
            orderedPostProcessorNames.add(ppName);
        }
            else {
            nonOrderedPostProcessorNames.add(ppName);
        }
    }
    
    // First, register the BeanPostProcessors that implement PriorityOrdered.
    // 给 priorityOrderedPostProcessors 排序
    sortPostProcessors(priorityOrderedPostProcessors, beanFactory);
    // 先注册实现了 PriorityOrdered 接口的 beanPostProcessor
    registerBeanPostProcessors(beanFactory, priorityOrderedPostProcessors);
    
    // Next, register the BeanPostProcessors that implement Ordered.
    // 从 beanFactory 中查找 orderedPostProcessorNames 里的 bean，然后放到对应的集合中
    List<BeanPostProcessor> orderedPostProcessors = new ArrayList<>();
        for (String ppName : orderedPostProcessorNames) {
        BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
        orderedPostProcessors.add(pp);
            if (pp instanceof MergedBeanDefinitionPostProcessor) {
            internalPostProcessors.add(pp);
        }
    }
    // 给 orderedPostProcessors 排序
    sortPostProcessors(orderedPostProcessors, beanFactory);
    // 再注册实现了 Ordered 接口的 beanPostProcessor
    registerBeanPostProcessors(beanFactory, orderedPostProcessors);
    
    // Now, register all regular BeanPostProcessors.
    List<BeanPostProcessor> nonOrderedPostProcessors = new ArrayList<>();
        for (String ppName : nonOrderedPostProcessorNames) {
        BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
        nonOrderedPostProcessors.add(pp);
            if (pp instanceof MergedBeanDefinitionPostProcessor) {
            internalPostProcessors.add(pp);
        }
    }
    // 再注册常规的 beanPostProcessor
    registerBeanPostProcessors(beanFactory, nonOrderedPostProcessors);
    
    // Finally, re-register all internal BeanPostProcessors.
    // 排序 MergedBeanDefinitionPostProcessor 这种类型的 beanPostProcessor
    sortPostProcessors(internalPostProcessors, beanFactory);
    // 最后注册 MergedBeanDefinitionPostProcessor 类型的 beanPostProcessor
    registerBeanPostProcessors(beanFactory, internalPostProcessors);
    
    // Re-register post-processor for detecting inner beans as ApplicationListeners,
    // moving it to the end of the processor chain (for picking up proxies etc).
    // 给容器中添加【ApplicationListenerDetector】 beanPostProcessor，判断是不是监听器，如果是就把 bean 放到容器中保存起来
    // 此时容器中默认会有 6 个内置的 beanPostProcessor
// 0 = {ApplicationContextAwareProcessor@1632}
//	1 = {ConfigurationClassPostProcessor$ImportAwareBeanPostProcessor@1633}
//	2 = {PostProcessorRegistrationDelegate$BeanPostProcessorChecker@1634}
//	3 = {CommonAnnotationBeanPostProcessor@1635}
//	4 = {AutowiredAnnotationBeanPostProcessor@1636}
//	5 = {ApplicationListenerDetector@1637}
beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(applicationContext));
}
```

**org.springframework.context.support.AbstractApplicationContext#initApplicationEventMulticaster**

前文我们说到，在整个容器创建过程中，Spring 会发布很多容器事件，如容器启动、刷新、关闭等，这个功能的实现得益于这里的 `ApplicationEventMulticaster` 广播器组件，通过它来派发事件通知。

在这里 Spring 也为我们提供了扩展，`SimpleApplicationEventMulticaster` 默认是同步的，如果我们想改成异步的，只需要在容器里自定义一个 name 为 applicationEventMulticaster 的容器即可，类似的思想在后续的 Spring Boot 中会有更多的体现，这里不再赘述。

```java
    protected void initApplicationEventMulticaster() {
    // 获取 beanFactory
    ConfigurableListableBeanFactory beanFactory = getBeanFactory();
    // 看看容器中是否有自定义的 applicationEventMulticaster
        if (beanFactory.containsLocalBean(APPLICATION_EVENT_MULTICASTER_BEAN_NAME)) {
        // 有就从容器中获取赋值
        this.applicationEventMulticaster =
        beanFactory.getBean(APPLICATION_EVENT_MULTICASTER_BEAN_NAME, ApplicationEventMulticaster.class);
            if (logger.isTraceEnabled()) {
            logger.trace("Using ApplicationEventMulticaster [" + this.applicationEventMulticaster + "]");
        }
    }
        else {
        // 没有，就创建一个 SimpleApplicationEventMulticaster
        this.applicationEventMulticaster = new SimpleApplicationEventMulticaster(beanFactory);
        // 将创建的 ApplicationEventMulticaster 添加到 BeanFactory 中， 其他组件就可以自动注入了
        beanFactory.registerSingleton(APPLICATION_EVENT_MULTICASTER_BEAN_NAME, this.applicationEventMulticaster);
            if (logger.isTraceEnabled()) {
            logger.trace("No '" + APPLICATION_EVENT_MULTICASTER_BEAN_NAME + "' bean, using " +
            "[" + this.applicationEventMulticaster.getClass().getSimpleName() + "]");
        }
    }
}
```

**org.springframework.context.support.AbstractApplicationContext#registerListeners**

如果用户想监听容器事件，那么就必须按照规范实现 `ApplicationListener` 接口并放入到容器中，在这里会被 Spring 扫描到，添加到 `ApplicationEventMulticaster` 广播器里，以后就可以发布事件通知，对应的 Listener 就会收到消息进行处理。

```java
    protected void registerListeners() {
    // Register statically specified listeners first.
    // 获取之前步骤中保存的 ApplicationListener
        for (ApplicationListener<?> listener : getApplicationListeners()) {
        // getApplicationEventMulticaster() 就是获取之前步骤初始化的 applicationEventMulticaster
        getApplicationEventMulticaster().addApplicationListener(listener);
    }
    
    // Do not initialize FactoryBeans here: We need to leave all regular beans
    // uninitialized to let post-processors apply to them!
    // 从容器中获取所有的 ApplicationListener
    String[] listenerBeanNames = getBeanNamesForType(ApplicationListener.class, true, false);
        for (String listenerBeanName : listenerBeanNames) {
        getApplicationEventMulticaster().addApplicationListenerBean(listenerBeanName);
    }
    
    // Publish early application events now that we finally have a multicaster...
    // 派发之前步骤产生的 application events
    Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents;
    this.earlyApplicationEvents = null;
        if (earlyEventsToProcess != null) {
            for (ApplicationEvent earlyEvent : earlyEventsToProcess) {
            getApplicationEventMulticaster().multicastEvent(earlyEvent);
        }
    }
}
```

**org.springframework.beans.factory.support.DefaultListableBeanFactory#preInstantiateSingletons**

在上面的步骤中，Spring 的大多数组件都已经初始化完毕了，剩下来的这个步骤就是初始化所有剩余的单实例 bean，在 Spring 中初始化一个 bean 对象是非常复杂的，如循环依赖、bean 后置处理器运用、aop 代理等，这些内容都不在此展开赘述了，后面的系列文章会具体探究，这里我们只需要明白 Spring 是通过这个方法把容器中的 bean 都初始化完毕即可。

```java
    public void preInstantiateSingletons() throws BeansException {
        if (logger.isTraceEnabled()) {
        logger.trace("Pre-instantiating singletons in " + this);
    }
    
    // Iterate over a copy to allow for init methods which in turn register new bean definitions.
    // While this may not be part of the regular factory bootstrap, it does otherwise work fine.
    // 获取容器中的所有 beanDefinitionName
    List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);
    
    // Trigger initialization of all non-lazy singleton beans...
    // 循环进行初始化和创建对象
        for (String beanName : beanNames) {
        // 获取 RootBeanDefinition，它表示自己的 BeanDefinition 和可能存在父类的 BeanDefinition 合并后的对象
        RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
        // 如果是非抽象的，且单实例，非懒加载
            if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
            // 如果是 factoryBean，利用下面这种方法创建对象
                if (isFactoryBean(beanName)) {
                // 如果是 factoryBean，则 加上 &，先创建工厂 bean
                Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
                    if (bean instanceof FactoryBean) {
                    final FactoryBean<?> factory = (FactoryBean<?>) bean;
                    boolean isEagerInit;
                        if (System.getSecurityManager() != null && factory instanceof SmartFactoryBean) {
                        isEagerInit = AccessController.doPrivileged((PrivilegedAction<Boolean>)
                        ((SmartFactoryBean<?>) factory)::isEagerInit,
                        getAccessControlContext());
                    }
                        else {
                        isEagerInit = (factory instanceof SmartFactoryBean &&
                        ((SmartFactoryBean<?>) factory).isEagerInit());
                    }
                        if (isEagerInit) {
                        getBean(beanName);
                    }
                }
            }
                else {
                // 不是工厂 bean，用这种方法创建对象
                getBean(beanName);
            }
        }
    }
    
    // Trigger post-initialization callback for all applicable beans...
        for (String beanName : beanNames) {
        Object singletonInstance = getSingleton(beanName);
        // 检查所有的 bean 是否是 SmartInitializingSingleton 接口
            if (singletonInstance instanceof SmartInitializingSingleton) {
            final SmartInitializingSingleton smartSingleton = (SmartInitializingSingleton) singletonInstance;
                if (System.getSecurityManager() != null) {
                    AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
                    smartSingleton.afterSingletonsInstantiated();
                    return null;
                    }, getAccessControlContext());
                }
                    else {
                    // 回调 afterSingletonsInstantiated() 方法，可以在回调中做一些事情
                    smartSingleton.afterSingletonsInstantiated();
                }
            }
        }
    }
```

**org.springframework.context.support.AbstractApplicationContext#finishRefresh**

整个容器初始化完毕之后，会在这里进行一些扫尾工作，如清理缓存，初始化生命周期处理器，发布容器刷新事件等。

```java
    protected void finishRefresh() {
    // Clear context-level resource caches (such as ASM metadata from scanning).
    // 清理缓存
    clearResourceCaches();
    
    // Initialize lifecycle processor for this context.
    // 初始化和生命周期有关的后置处理器
    initLifecycleProcessor();
    
    // Propagate refresh to lifecycle processor first.
    // 拿到前面定义的生命周期处理器【LifecycleProcessor】回调 onRefresh() 方法
    getLifecycleProcessor().onRefresh();
    
    // Publish the final event.
    // 发布容器刷新完成事件
    publishEvent(new ContextRefreshedEvent(this));
    
    // Participate in LiveBeansView MBean, if active.
    LiveBeansView.registerApplicationContext(this);
}
```

我是敖丙，**你知道的越多，你不知道的越多**，感谢各位人才的：**点赞**、**收藏**和**评论**，我们下期见！

* * *

> 文章持续更新，可以微信搜一搜「 **三太子敖丙** 」第一时间阅读，回复【**资料**】有我准备的一线大厂面试资料和简历模板，本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已经收录，有大厂面试完整考点，欢迎Star。