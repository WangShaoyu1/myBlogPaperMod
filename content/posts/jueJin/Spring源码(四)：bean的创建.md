---
author: "好看的HK"
title: "Spring源码(四)：bean的创建"
date: 2024-08-05
description: "本节紧接上一篇，深入讨论一个标准bean在Spring中究竟是如何生成&销毁的（重点关注Spring对bean的构造方法、注入字段、各种扩展方法的处理，以及围绕整个bean的全生命周期，Spring留"
tags: ["后端","Java"]
ShowReadingTime: "阅读28分钟"
weight: 806
---
本节紧接上一篇，深入讨论一个标准bean在Spring中究竟是如何生成&销毁的（重点关注Spring对bean的构造方法、注入字段、各种扩展方法的处理，以及围绕整个bean的全生命周期，Spring留了那些扩展点给用户实现）。

一、创建bean
--------

介绍了循环依赖以及Spring中循环依赖的处理方式后，我们继续之前的内容。当经历过**resolveBeforeInstantiation**方法后，程序有两个选择，如果创建了代理或者或重写InstantiationAwareBeanPostProcessor的postProcessBeforeInstantiation方法并在postProcessBeforeInstantiation方法中改变了bean，则直接返回就可以了，否则需要进行bean的创建。而这一常规bean的创建就是在doCreateBean中完成的。代码如下

java

 代码解读

复制代码

`protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final Object[] args) {     // Instantiate the bean.     BeanWrapper instanceWrapper = null;     if (mbd.isSingleton()) {         instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);     }     if (instanceWrapper == null) {         // 根据指定的bean使用对应的策略创建新的实例：如工厂方法、构造方法自动注入、简单初始化         instanceWrapper = createBeanInstance(beanName, mbd, args);     }     final Object bean = (instanceWrapper != null ? instanceWrapper.getWrappedInstance() : null);     Class<?> beanType = (instanceWrapper != null ? instanceWrapper.getWrappedClass() : null); ​     // Allow post-processors to modify the merged bean definition.     synchronized (mbd.postProcessingLock) {         if (!mbd.postProcessed) {             applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);             mbd.postProcessed = true;         }     } ​     // 是否需要提早曝光：单例且允许循环依赖且当前bean正在创建中，检查循环依赖     boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&             isSingletonCurrentlyInCreation(beanName));     if (earlySingletonExposure) {         if (logger.isDebugEnabled()) {             logger.debug("Eagerly caching bean '" + beanName +                     "' to allow for resolving potential circular references");         }         // 为了避免后期循环依赖，可以在bean初始化完成之前将创建创建实例的ObjectFactory加入工厂         addSingletonFactory(beanName, new ObjectFactory<Object>() {             public Object getObject() throws BeansException {                 // 对bean再一次依赖引用                 // 其中我们熟知的AOP就是在这里将advice动态织入bean中，若没有则无需处理直接返回                 return getEarlyBeanReference(beanName, mbd, bean);             }         });     } ​     // Initialize the bean instance.     Object exposedObject = bean;     try {         // 对bean进行填充，将各个属性值注入，其中，可能存在依赖于其他bean的属性，则会递归初始化依赖bean         populateBean(beanName, mbd, instanceWrapper);         if (exposedObject != null) {             // 调用初始化方法，比如init-method             exposedObject = initializeBean(beanName, exposedObject, mbd);         }     }     catch (Throwable ex) {         if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {             throw (BeanCreationException) ex;         }         else {             throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);         }     } ​     if (earlySingletonExposure) {         Object earlySingletonReference = getSingleton(beanName, false);         // earlySingletonExposure只有当检测导游循环依赖的情况才不为空         if (earlySingletonReference != null) {             // 如果exposedObject没有在初始化方法中被改变，也就是没有被增强             if (exposedObject == bean) {                 exposedObject = earlySingletonReference;             }             else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {                 String[] dependentBeans = getDependentBeans(beanName);                 Set<String> actualDependentBeans = new LinkedHashSet<String>(dependentBeans.length);                 for (String dependentBean : dependentBeans) {                     // 检查依赖                     if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {                         actualDependentBeans.add(dependentBean);                     }                 }                 // 因为bean创建后其所依赖的bean一定是已经创建完成的                 // actualDependentBeans不为空则标示当前bean创建后其依赖的bean却没有全部创建完，也就是存在循环依赖                 if (!actualDependentBeans.isEmpty()) {                     throw new BeanCurrentlyInCreationException(beanName,                             "Bean with name '" + beanName + "' has been injected into other beans [" +                             StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +                             "] in its raw version as part of a circular reference, but has eventually been " +                             "wrapped. This means that said other beans do not use the final version of the " +                             "bean. This is often the result of over-eager type matching - consider using " +                             "'getBeanNamesOfType' with the 'allowEagerInit' flag turned off, for example.");                 }             }         }     } ​     // Register bean as disposable.     try {         // 根据scope注册bean          registerDisposableBeanIfNecessary(beanName, bean, mbd);     }     catch (BeanDefinitionValidationException ex) {         throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);     } ​     return exposedObject; }`

尽管日志与异常的内容非常重要，但是在阅读源码的时候似乎大部分人都会直接忽略。在此不深入探讨日志及异常的设计，我们看看整个方法的概要思路：

*   如果是单例则需要先清除缓存。
*   实例化bean，将BeanDefinition转换为BeanWrapper。

转换是一个复杂的过程，但是我们可以概括大致的功能，如下所示：

1.如果存在工厂方法则使用工厂方法进行初始化。

2.一个类有多个构造方法，每个构造方法都有不同的参数，所以需要根据参数锁定构造方法并进行初始化。

3.如果不存在工厂方法也不存在带有参数的构造方法，则使用默认的构造方法进行bean的实例化。

*   MergedBeanDefinitionPostProcessor的应用。

bean合并后的处理，Autowire注解正是通过此方法实现诸如类型的预解析。

*   依赖处理。

在Spring中会有循环依赖的情况，例如当A中含有B的属性，而B中又含有A的属性时就会构成一个循环依赖，此时如果A和B都是单例，那么在Spring中处理的方式就是当创建B的时候，涉及自动注入A的步骤时，并不是直接再次创建A，而是通过方法缓存中的ObjectFactory来创建实例，这样就解决了循环依赖的情况。

*   属性填充。将所有属性填充至bean的实例中。
*   循环依赖检查。

之前有提到过，在Spring中解决循环依赖只对单例有效，而对于prototype和bean，Spring没有好的解决办法，唯一要做的就是抛出异常。在这个步骤里面会检测已经加载的bean是否已经出现循环依赖，并判断是否需要抛出异常。

*   注册DisposableBean。

如果配置了destroy-method，这里需要注册以便于在销毁的时候调用。

*   完成创建并返回。

可以看到上面的步骤非常的繁琐，每一个步骤都使用了大量代码来完成其功能，最复杂也是最难理解的当属循环依赖的处理，在真正进入doCreateBean前我们有必要了解下循环依赖。

二、创建bean的实例
-----------

当我们了解了循环依赖以后就可以深入分析创建bean的每个步骤了，首先我们从createBeanInstance开始。代码如下

java

 代码解读

复制代码

`protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, Object[] args) {     // Make sure bean class is actually resolved at this point.     Class<?> beanClass = resolveBeanClass(mbd, beanName); ​     if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) && !mbd.isNonPublicAccessAllowed()) {         throw new BeanCreationException(mbd.getResourceDescription(), beanName,                 "Bean class isn't public, and non-public access not allowed: " + beanClass.getName());     }     // 如果工厂方法不为空则使用工厂方法初始化策略     if (mbd.getFactoryMethodName() != null)  {         return instantiateUsingFactoryMethod(beanName, mbd, args);     } ​     // Shortcut when re-creating the same bean...     boolean resolved = false;     boolean autowireNecessary = false;     if (args == null) {         synchronized (mbd.constructorArgumentLock) {             // 一个类有多个构造方法，每个构造方法都有不同的参数，所以调用前需要先根据参数锁定目标构造方法             if (mbd.resolvedConstructorOrFactoryMethod != null) {                 resolved = true;                 autowireNecessary = mbd.constructorArgumentsResolved;             }         }     }     // 如果已经解析过则使用解析好的构造方法不需要再次锁定     if (resolved) {         if (autowireNecessary) {             // 构造方法自动注入             return autowireConstructor(beanName, mbd, null, null);         }         else {             // 使用默认构造方法             return instantiateBean(beanName, mbd);         }     } ​     // 需要根据参数解析构造方法     Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(beanClass, beanName);     if (ctors != null ||             mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_CONSTRUCTOR ||             mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args))  {         // 构造方法自动注入         return autowireConstructor(beanName, mbd, ctors, args);     } ​     // No special handling: simply use no-arg constructor.     return instantiateBean(beanName, mbd); }`

虽然代码中实例化的细节非常复杂，但是在CreateBean方法中我们还是可以清晰地看到实例化的逻辑的。

*   如果在RootBeanDefinition中存在factoryMethodName属性，或者说在配置文件中配置了factory-method，那么Spring会尝试使用 **instantiateUsingFactoryMethod(beanName, mbd, args)** 方法根据RootBeanDefinition中的配置生成bean的实例。
*   解析构造方法并进行构造方法的实例化。因为一个bean对应的类中可能会有多个构造方法，而每个构造方法的参数不同，Spring在根据参数及类型去判断最终会使用哪个构造方法进行实例化。但是，判断的过程时比较消耗性能的步骤，所以采用缓存机制，如果已经解析过则不需要重复解析而是直接从RootBeanDefinition中的属性 **resolvedConstructorOrFactoryMethod** 缓存的值去取，否则需要再次解析，并将解析的结果添加至RootBeanDefinition中的属性resolvedConstructorOrFactoryMethod中。

### 1、autowireConstructor

对于实例的创建Spring分为了两种情况，一种是通用的实例化，另一种是带有参数的实例化。带有参数的实例化过程相当复杂，因为存在不确定性，所以在判断对应参数上做了大量工作。代码如下

java

 代码解读

复制代码

`public BeanWrapper autowireConstructor(         final String beanName, final RootBeanDefinition mbd, Constructor<?>[] chosenCtors, final Object[] explicitArgs) { ​     BeanWrapperImpl bw = new BeanWrapperImpl();     this.beanFactory.initBeanWrapper(bw); ​     Constructor<?> constructorToUse = null;     ArgumentsHolder argsHolderToUse = null;     Object[] argsToUse = null;     // explicitArgs通过getBean方法传入     // 如果getBean方法调用的时候指定方法参数那么直接使用     if (explicitArgs != null) {         argsToUse = explicitArgs;     }     else {         // 如果没有指定，则尝试从配置文件中读取         Object[] argsToResolve = null;         // 尝试从缓存中读取         synchronized (mbd.constructorArgumentLock) {             constructorToUse = (Constructor<?>) mbd.resolvedConstructorOrFactoryMethod;             if (constructorToUse != null && mbd.constructorArgumentsResolved) {                 // Found a cached constructor...                 argsToUse = mbd.resolvedConstructorArguments;                 if (argsToUse == null) {                     // 配置的构造方法参数                     argsToResolve = mbd.preparedConstructorArguments;                 }             }         }         // 如果缓存中存在         if (argsToResolve != null) {             // 解析参数类型，如给定方法的构造为为A(int, int)，则通过此方法后就会把配置中的“1”,"1"转换为1,1             // 缓存中的值可能是原始值也可能是最终值             argsToUse = resolvePreparedArguments(beanName, mbd, bw, constructorToUse, argsToResolve);         }     }     // 没有被缓存     if (constructorToUse == null) {         // Need to resolve the constructor.         boolean autowiring = (chosenCtors != null ||                 mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_CONSTRUCTOR);         ConstructorArgumentValues resolvedValues = null; ​         int minNrOfArgs;         if (explicitArgs != null) {             minNrOfArgs = explicitArgs.length;         }         else {             // 提取配置文件总的配置的构造方法参数             ConstructorArgumentValues cargs = mbd.getConstructorArgumentValues();             // 用于承载解析后的构造方法参数的值             resolvedValues = new ConstructorArgumentValues();             // 能解析到的参数个数             minNrOfArgs = resolveConstructorArguments(beanName, mbd, bw, cargs, resolvedValues);         } ​         // Take specified constructors, if any.         Constructor<?>[] candidates = chosenCtors;         if (candidates == null) {             Class<?> beanClass = mbd.getBeanClass();             try {                 candidates = (mbd.isNonPublicAccessAllowed() ?                         beanClass.getDeclaredConstructors() : beanClass.getConstructors());             }             catch (Throwable ex) {                 throw new BeanCreationException(mbd.getResourceDescription(), beanName,                         "Resolution of declared constructors on bean Class [" + beanClass.getName() +                         "] from ClassLoader [" + beanClass.getClassLoader() + "] failed", ex);             }         }         // 排序给定的构造方法，public构造方法优先参数数量降序、非public构造方法参数数量降序         AutowireUtils.sortConstructors(candidates);         int minTypeDiffWeight = Integer.MAX_VALUE;         Set<Constructor<?>> ambiguousConstructors = null;         List<Exception> causes = null; ​         for (int i = 0; i < candidates.length; i++) {             Constructor<?> candidate = candidates[i];             Class<?>[] paramTypes = candidate.getParameterTypes(); ​             if (constructorToUse != null && argsToUse.length > paramTypes.length) {                 // 如果已经找到选用的构造方法或者需要的参数个数小于当前的构造方法参数个数则终止，因为已经按照参数个数降序排列了                 break;             }             if (paramTypes.length < minNrOfArgs) {                 // 参数个数不相等                 continue;             } ​             ArgumentsHolder argsHolder;             if (resolvedValues != null) {                 // 有参数则根据值构造对应参数类型的参数                 try {                                       String[] paramNames = null;                     if (constructorPropertiesAnnotationAvailable) {                         // 注释上获取参数名称                         paramNames = ConstructorPropertiesChecker.evaluate(candidate, paramTypes.length);                     }                     if (paramNames == null) {                         // 获取参数名称探索器                         ParameterNameDiscoverer pnd = this.beanFactory.getParameterNameDiscoverer();                         if (pnd != null) {                             // 获取指定构造方法的参数名称                             paramNames = pnd.getParameterNames(candidate);                         }                     }                     // 根据名称和数据类型创建参数持有者                     argsHolder = createArgumentArray(                             beanName, mbd, resolvedValues, bw, paramTypes, paramNames, candidate, autowiring);                 }                 catch (UnsatisfiedDependencyException ex) {                     if (this.beanFactory.logger.isTraceEnabled()) {                         this.beanFactory.logger.trace(                                 "Ignoring constructor [" + candidate + "] of bean '" + beanName + "': " + ex);                     }                     if (i == candidates.length - 1 && constructorToUse == null) {                         if (causes != null) {                             for (Exception cause : causes) {                                 this.beanFactory.onSuppressedException(cause);                             }                         }                         throw ex;                     }                     else {                         // Swallow and try next constructor.                         if (causes == null) {                             causes = new LinkedList<Exception>();                         }                         causes.add(ex);                         continue;                     }                 }             }             else {                 // Explicit arguments given -> arguments length must match exactly.                 if (paramTypes.length != explicitArgs.length) {                     continue;                 }                 // 构造方法没有参数的情况                 argsHolder = new ArgumentsHolder(explicitArgs);             }             // 探测是否有不确定性的构造方法存在，例如不同构造方法的参数可能为父子关系             int typeDiffWeight = (mbd.isLenientConstructorResolution() ?                     argsHolder.getTypeDifferenceWeight(paramTypes) : argsHolder.getAssignabilityWeight(paramTypes));             // Choose this constructor if it represents the closest match.             // 如果它代表着当前最接近的匹配则选择作为构造方法             if (typeDiffWeight < minTypeDiffWeight) {                 constructorToUse = candidate;                 argsHolderToUse = argsHolder;                 argsToUse = argsHolder.arguments;                 minTypeDiffWeight = typeDiffWeight;                 ambiguousConstructors = null;             }             else if (constructorToUse != null && typeDiffWeight == minTypeDiffWeight) {                 if (ambiguousConstructors == null) {                     ambiguousConstructors = new LinkedHashSet<Constructor<?>>();                     ambiguousConstructors.add(constructorToUse);                 }                 ambiguousConstructors.add(candidate);             }         } ​         if (constructorToUse == null) {             // 将解析的构造方法加入缓存             throw new BeanCreationException(mbd.getResourceDescription(), beanName,                     "Could not resolve matching constructor " +                     "(hint: specify index/type/name arguments for simple parameters to avoid type ambiguities)");         }         else if (ambiguousConstructors != null && !mbd.isLenientConstructorResolution()) {             throw new BeanCreationException(mbd.getResourceDescription(), beanName,                     "Ambiguous constructor matches found in bean '" + beanName + "' " +                     "(hint: specify index/type/name arguments for simple parameters to avoid type ambiguities): " +                     ambiguousConstructors);         } ​         if (explicitArgs == null) {             argsHolderToUse.storeCache(mbd, constructorToUse);         }     } ​     try {         Object beanInstance; ​         if (System.getSecurityManager() != null) {             final Constructor<?> ctorToUse = constructorToUse;             final Object[] argumentsToUse = argsToUse;             beanInstance = AccessController.doPrivileged(new PrivilegedAction<Object>() {                 public Object run() {                     return beanFactory.getInstantiationStrategy().instantiate(                             mbd, beanName, beanFactory, ctorToUse, argumentsToUse);                 }             }, beanFactory.getAccessControlContext());         }         else {             beanInstance = this.beanFactory.getInstantiationStrategy().instantiate(                     mbd, beanName, this.beanFactory, constructorToUse, argsToUse);         }         // 将构建的实例加入BeanWrapper中         bw.setWrappedInstance(beanInstance);         return bw;     }     catch (Throwable ex) {         throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Instantiation of bean failed", ex);     } }`

逻辑很复杂，方法代码量很大，感觉这个方法的写法完全不符合Spring一贯的风格。我们总览一下整个方法，其实现的功能考虑了以下几个方面。

#### 1、构造方法参数的确定

*   根据explicitArgs参数判断

如果传入的参数explicitArgs不为空，那么可以直接确定参数，因为explicitArgs参数是在调用bean时用户指定的，在BeanFactory类中存在这样的方法

java

 代码解读

复制代码

`Object getBean(String name, Object... args) throws BeanException`

在获取bean的时候，用户不但可以指定bean的名称还可以指定bean所对应类的构造方法或工厂方法的方法参数，主要是用于静态工厂方法的调用，而这里时需要给定完全匹配的参数，所以，便可以判断，如果传入参数explicitArgs不为空，则可以确定构造方法参数就是它。

*   缓存中获取

除此之外，确定参数的办法就是如果之前分析过，也就是说构造方法参数已经记录在缓存中，那么便可以直接拿来使用。而且，这里要提到的是，在缓存中缓存的可能是参数的最终类型也可能是参数的初始类型，例如：构造方法参数要求是int类型，但是原始的参数值可能是String类型的”1“，那么即使在缓存中得到了参数，也需要类型转换器的过滤以确保参数类型与对应的构造方法参数类型完全对应。

*   配置文件获取

如果不能从传入的参数explicitArgs确定构造方法的参数也无法在缓存中得到相关信息，那么只能开始新一轮的分析了。

分析从获取配置文件中的构造方法信息开始，经过之前的分析，我们知道，Spring中配置文件中的信息经过转换都会通过BeanDefinition实例承载，也就是参数mdb中包含，那么可以通过调用mbd.getConstructorArgumentValues()来获取配置的构造方法信息。有了配置中的信息便可以获取对应的参数值信息了，获取参数值的信息包括直接指定值，如：直接指定构造方法中某个值为原始类型String类型，或者是一个对其他bean的引用，而这一处理委托给resolveConstructorArguments方法，并返回能解析到的参数的个数。

#### 2、构造方法的确定

经过了第一步后已经确定了构造方法的参数，接下来的任务就是根据构造方法参数在所有构造方法中锁定对应的构造方法，而匹配的方法就是根据参数个数匹配，所以在匹配之前需要先对构造方法按照public构造方法优先参数数量降序、非public构造方法参数数量降序。这样可以在遍历的情况下迅速判断排在后面的构造方法参数是否符合条件。

由于在配置文件中并不是唯一限制使用参数位置索引的方式去创建，同样还支持指定参数名称进行设定参数值的情况，如`<constructor-arg name = "aa">`，那么这种情况就需要首先确定构造方法中的参数名称。

获取参数名称可以有两种方法，一种是通过注解的方法直接获取，另一种就是使用Spring中提供的工具类ParameterNameDiscoverer来获取。构造方法、参数名称、参数类型、参数值都确定后就可以锁定构造方法以及转换对应的参数类型了。

#### 3、根据确定的构造方法转换对应的参数类型

主要是使用Spring中提供的类型转换器或者用户提供的自定义类型转换器进行转换。

#### 4、构造方法不确定的验证

当然，有时候即使构造方法、参数名称、参数类型、参数值都确定后也不一定会直接锁定构造方法，不同的构造方法的参数为父子关系，所以Spring在最后又做了一次验证。

#### 5、根据实例化策略以及得到的构造方法及构造参数实例化bean

后面还会有进一步讲解。

### 2、instantiateBean

经历了带有参数的构造方法的实例构造，相信你会非常轻松愉快地理解不带参数的构造方法的实例化过程。

java

 代码解读

复制代码

`protected BeanWrapper instantiateBean(final String beanName, final RootBeanDefinition mbd) {     try {         Object beanInstance;         final BeanFactory parent = this;         if (System.getSecurityManager() != null) {             beanInstance = AccessController.doPrivileged(new PrivilegedAction<Object>() {                 public Object run() {                     return getInstantiationStrategy().instantiate(mbd, beanName, parent);                 }             }, getAccessControlContext());         }         else {             beanInstance = getInstantiationStrategy().instantiate(mbd, beanName, parent);         }         BeanWrapper bw = new BeanWrapperImpl(beanInstance);         initBeanWrapper(bw);         return bw;     }     catch (Throwable ex) {         throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Instantiation of bean failed", ex);     } }`

你会发现，此方法并没有什么实质性的逻辑，带有参数的实例构造中，Spring把精力都放在了构造方法以及参数的匹配上了，所以如果没有参数的话那将是非常简单的事情，直接调用实例化策略进行实例化就可以了。

### 3、实例化策略

实例化过程中反复提到过实例化策略，那这又是做什么用的呢？其实，经过前面的分析，我们已经得到了足以实例化的所以相关信息，完全可以使用最简单的反射方法直接反射构造实例对象，但是Spring却没有这么做。我们先来看下**SimpleInstantiationStrategy**类。

java

 代码解读

复制代码

`public Object instantiate(RootBeanDefinition beanDefinition, String beanName, BeanFactory owner) {     // 如果有需要覆盖或者动态替换的方法，则需要使用cglib进行动态代理，因为可以在创建代理的同时将动态方法织入类中     // 如果不需要动态改变方法，为了方便直接反射就可以了     if (beanDefinition.getMethodOverrides().isEmpty()) {         Constructor<?> constructorToUse;         synchronized (beanDefinition.constructorArgumentLock) {             constructorToUse = (Constructor<?>) beanDefinition.resolvedConstructorOrFactoryMethod;             if (constructorToUse == null) {                 final Class<?> clazz = beanDefinition.getBeanClass();                 if (clazz.isInterface()) {                     throw new BeanInstantiationException(clazz, "Specified class is an interface");                 }                 try {                     if (System.getSecurityManager() != null) {                         constructorToUse = AccessController.doPrivileged(new PrivilegedExceptionAction<Constructor>() {                             public Constructor<?> run() throws Exception {                                 return clazz.getDeclaredConstructor((Class[]) null);                             }                         });                     }                     else {                         constructorToUse =  clazz.getDeclaredConstructor((Class[]) null);                     }                     beanDefinition.resolvedConstructorOrFactoryMethod = constructorToUse;                 }                 catch (Exception ex) {                     throw new BeanInstantiationException(clazz, "No default constructor found", ex);                 }             }         }         return BeanUtils.instantiateClass(constructorToUse);     }     else {         // Must generate CGLIB subclass.         return instantiateWithMethodInjection(beanDefinition, beanName, owner);     } } ​ public Object instantiate(Constructor<?> ctor, Object[] args) {     Enhancer enhancer = new Enhancer();     enhancer.setSuperclass(this.beanDefinition.getBeanClass());     enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);     enhancer.setCallbackFilter(new CallbackFilterImpl());     enhancer.setCallbacks(new Callback[] {             NoOp.INSTANCE,             new LookupOverrideMethodInterceptor(),             new ReplaceOverrideMethodInterceptor()     }); ​     return (ctor != null ? enhancer.create(ctor.getParameterTypes(), args) : enhancer.create()); }`

看了上面两个方法后似乎我们已经感受到了Spring的良苦用心以及为了方便地使用Spring而做了大量的工作。程序中，首先判断如果beanDefinition.getMethodOverrides().isEmpty()为空也就是用户没有使用replace或则lookup的配置方法，那么直接使用反射的方式，简单快捷，但是如果使用了这两个特性，再直接使用反射的方式创建实例就不妥了，因为需要将这两个配置提供的功能切入类中，所以就必须使用动态代理的方式将包含两个特性所对应的逻辑的拦截增强器设置进去，这样才可以保证在调用方法的时候会被相应的拦截器增强，返回值为包含拦截器的代理实例。

三、记录创建bean的ObjectFactory
------------------------

在doCreateBean方法中有这样一段代码

java

 代码解读

复制代码

`boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&         isSingletonCurrentlyInCreation(beanName)); if (earlySingletonExposure) {     if (logger.isDebugEnabled()) {         logger.debug("Eagerly caching bean '" + beanName +                 "' to allow for resolving potential circular references");     }     // 为避免后期循环依赖，可以在bean初始化完成前将创建实例的ObjectFactory加入工厂     addSingletonFactory(beanName, new ObjectFactory<Object>() {         public Object getObject() throws BeansException {             return getEarlyBeanReference(beanName, mbd, bean);         }     }); }`

这段代码也不是很复杂，但是很多人不是太理解这段代码的作用，而且，这段代码仅从从方法中去理解也很难弄懂其中的含义，我们需要从全局的角度去思考Spring的依赖解决办法。

*   earlySingletonExposure：从字面的意思理解就是提早曝光的单例，我们暂不定义它的学名叫什么，我们感兴趣的是有哪些条件影响这个值。
*   mbd.isSingleton()：没有太多可以解释的，此RootBeanDefinition代表的是否是单例。
*   this.allowCircularReferences：是否允许循环依赖，很抱歉，并没有找到在配置文件中如何配置，但是在AbstractRefreshableApplicationContext中提供了设置方法，可以通过硬编码的方式进行设置或者可以通过自定义命令空间进行配置，其中硬编码的方式代码如下：

java

 代码解读

复制代码

`ClassPathXmlApplication context = new ClassPathXmlApplicationContext("xx.xml"); bf.setAllowBeanDefinitionOverriding(false);`

*   isSingletonCurrentlyInCreation(beanName)：该bean是否在创建中。在Spring中，会有个专门的属性默认为**DefaultSingletonBeanRegistry**的**singletonsCurrentlyInCreation**来记录bean的加载状态，在bean开始创建前会将beanName记录在属性中，在bean创建结束后会将beanName从属性中移除。那么我们跟随代码一路走来可以对这个记录并没有多少印象，这个状态是在哪里记录的呢？不同scope的记录位置并不一样，我们以singleton为例，在singleton下记录属性的方法是在**DefaultSingletonBeanRegistry**类中，代码如下

typescript

 代码解读

复制代码

`protected void beforeSingletonCreation(String beanName) {     if (!this.inCreationCheckExclusions.containsKey(beanName) &&             this.singletonsCurrentlyInCreation.put(beanName, Boolean.TRUE) != null) {         throw new BeanCurrentlyInCreationException(beanName);     } } ​ protected void afterSingletonCreation(String beanName) {     if (!this.inCreationCheckExclusions.containsKey(beanName) &&             !this.singletonsCurrentlyInCreation.remove(beanName)) {         throw new IllegalStateException("Singleton '" + beanName + "' isn't currently in creation");     } }`

经过以上分析我们了解变量earlySingletonExposure是否是单例、是否允许循环依赖、是否对应的bean正在创建的条件的综合。当这三个条件都满足时会执行addSingletonFactory操作，那么加入SingletonFactory的作用是什么呢？又是在什么时候调用呢？

我们看下getEarlyBeanReference方法。

java

 代码解读

复制代码

`protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {     Object exposedObject = bean;     if (bean != null && !mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {         for (BeanPostProcessor bp : getBeanPostProcessors()) {             if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {                 SmartInstantiationAwareBeanPostProcessor ibp = (SmartInstantiationAwareBeanPostProcessor) bp;                 exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);                 if (exposedObject == null) {                     return null;                 }             }         }     }     return exposedObject; }`

在getEarlyBeanReference方法中并没有太多的逻辑处理，或者说除了后处理器的调用外并没有别的处理工作，根据以上分析，基本可以理清Spring处理循环依赖的解决办法，在B中创建依赖A时通过ObjectFactory提供的实例化方法来判断A中的属性填充，使B中持有的A仅仅是刚刚初始化并没有填充任何属性的A，而初始化A的步骤还是在最开始创建A的时候进行的，但是因为A与B中的A表示属性的地址是一样的，所以在A中创建好的属性填充自然可以通过B中的A获取，这样就解决了循环依赖的问题。

四、属性注入
------

在了解循环依赖的时候，我们曾反复提到了**populateBean**这个方法，也多少了解了这个方法的主要功能就是属性填充，那么究竟是如何实现填充的呢？我们看下代码

java

 代码解读

复制代码

`protected void populateBean(String beanName, RootBeanDefinition mbd, BeanWrapper bw) {     PropertyValues pvs = mbd.getPropertyValues(); ​     if (bw == null) {         if (!pvs.isEmpty()) {             throw new BeanCreationException(                     mbd.getResourceDescription(), beanName, "Cannot apply property values to null instance");         }         else {             return;         }     } ​     boolean continueWithPropertyPopulation = true; ​     if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {         for (BeanPostProcessor bp : getBeanPostProcessors()) {             if (bp instanceof InstantiationAwareBeanPostProcessor) {                 InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor) bp;                 if (!ibp.postProcessAfterInstantiation(bw.getWrappedInstance(), beanName)) {                     continueWithPropertyPopulation = false;                     break;                 }             }         }     }     // 如果后处理器发出停止填充命令则终止后续的执行     if (!continueWithPropertyPopulation) {         return;     } ​     if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_NAME ||             mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_TYPE) {         MutablePropertyValues newPvs = new MutablePropertyValues(pvs); ​         // Add property values based on autowire by name if applicable.         // 根据名称自动注入         if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_NAME) {             autowireByName(beanName, mbd, bw, newPvs);         } ​         // Add property values based on autowire by type if applicable.         // 根据类型自动注入         if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_TYPE) {             autowireByType(beanName, mbd, bw, newPvs);         } ​         pvs = newPvs;     }     // 后处理器已经初始化     boolean hasInstAwareBpps = hasInstantiationAwareBeanPostProcessors();     // 需要依赖检查     boolean needsDepCheck = (mbd.getDependencyCheck() != RootBeanDefinition.DEPENDENCY_CHECK_NONE); ​     if (hasInstAwareBpps || needsDepCheck) {         PropertyDescriptor[] filteredPds = filterPropertyDescriptorsForDependencyCheck(bw, mbd.allowCaching);         if (hasInstAwareBpps) {             for (BeanPostProcessor bp : getBeanPostProcessors()) {                 if (bp instanceof InstantiationAwareBeanPostProcessor) {                     InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor) bp;                     // 对所有需要依赖检查的属性进行后处理                     pvs = ibp.postProcessPropertyValues(pvs, filteredPds, bw.getWrappedInstance(), beanName);                     if (pvs == null) {                         return;                     }                 }             }         }         if (needsDepCheck) {             // 依赖检查，对应depends-on属性，3.0已经弃用此属性             checkDependencies(beanName, mbd, filteredPds, pvs);         }     }     // 将属性应用到bean中     applyPropertyValues(beanName, mbd, bw, pvs); }`

在populateBean方法中提供了这样的处理流程：

*   InstantiationAwareBeanPostProcessors处理器的postProcessAfterInstantiation方法的应用，此方法可以控制程序是否继续进行属性填充。
*   根据注入类型（byName/byType），提取依赖的bean，并统一存入PropertyValues中。
*   应用InstantiationAwareBeanPostProcessors处理器的postProcessValues方法，对属性获取完毕填充前对属性的再次处理，典型应用就是RequiredAnnotationBeanPostProcessor类中对属性的验证。
*   将所有PropertyValues中的属性填充至BeanWrapper中

在上面的步骤中有几个地方是我们比较感兴趣的，他们分别是依赖注入（autowireByName/autowireByType）以及属性填充，那么，接下来进一步分析这几个功能的实现细节。

### 1、autowireByName

上文提到根据注入类型（byName/byType），提取依赖的bean，并统一存入PropertyValues中，那么我们首先了解下byName功能是如何实现的。

java

 代码解读

复制代码

`protected void autowireByName(         String beanName, AbstractBeanDefinition mbd, BeanWrapper bw, MutablePropertyValues pvs) {     // 寻找bw中需要依赖注入的属性     String[] propertyNames = unsatisfiedNonSimpleProperties(mbd, bw);     for (String propertyName : propertyNames) {         if (containsBean(propertyName)) {             // 递归初始化相关的bean             Object bean = getBean(propertyName);             pvs.add(propertyName, bean);             // 注册依赖             registerDependentBean(propertyName, beanName);             if (logger.isDebugEnabled()) {                 logger.debug("Added autowiring by name from bean name '" + beanName +                         "' via property '" + propertyName + "' to bean named '" + propertyName + "'");             }         }         else {             if (logger.isTraceEnabled()) {                 logger.trace("Not autowiring property '" + propertyName + "' of bean '" + beanName +                         "' by name: no matching bean found");             }         }     } }`

### 2、autowireByType

autowireByType与autowireByName对于我们理解与使用来说复杂程度都很相似，但是其实现的功能的复杂度却完全不一样。代码如下

java

 代码解读

复制代码

`protected void autowireByType(         String beanName, AbstractBeanDefinition mbd, BeanWrapper bw, MutablePropertyValues pvs) { ​     TypeConverter converter = getCustomTypeConverter();     if (converter == null) {         converter = bw;     } ​     Set<String> autowiredBeanNames = new LinkedHashSet<String>(4);     // 寻找bw中需要依赖注入的属性     String[] propertyNames = unsatisfiedNonSimpleProperties(mbd, bw);     for (String propertyName : propertyNames) {         try {             PropertyDescriptor pd = bw.getPropertyDescriptor(propertyName);             // 忽略Object             if (!Object.class.equals(pd.getPropertyType())) {                 // 探测指定属性的set方法                 MethodParameter methodParam = BeanUtils.getWriteMethodParameter(pd);                 boolean eager = !PriorityOrdered.class.isAssignableFrom(bw.getWrappedClass());                 DependencyDescriptor desc = new AutowireByTypeDependencyDescriptor(methodParam, eager);                 // 解析指定beanName属性所匹配的值，并把解析到的属性名称存储在autowiredName中                 // 当属性中存在多个bean时，如@Autowired private List<A> aList将会找到                 Object autowiredArgument = resolveDependency(desc, beanName, autowiredBeanNames, converter);                 if (autowiredArgument != null) {                     pvs.add(propertyName, autowiredArgument);                 }                 for (String autowiredBeanName : autowiredBeanNames) {                     registerDependentBean(autowiredBeanName, beanName);                     if (logger.isDebugEnabled()) {                         logger.debug("Autowiring by type from bean name '" + beanName + "' via property '" +                                 propertyName + "' to bean named '" + autowiredBeanName + "'");                     }                 }                 autowiredBeanNames.clear();             }         }         catch (BeansException ex) {             throw new UnsatisfiedDependencyException(mbd.getResourceDescription(), beanName, propertyName, ex);         }     } }`

实现根据名称自动匹配的第一步就是寻找bw中需要依赖注入的属性，同样对于根据类型自动匹配的实现来讲第一步就是寻找bw中需要依赖注入的属性，然后遍历这些属性并寻找类型匹配的bean，其中最复杂的就是寻找类型匹配的bean。同时，Spring中提供了对集合的类型注入的支持，如使用注解的方式：

java

 代码解读

复制代码

`@Autowired private List<Test> tests;`

Spring将会把所有与Test匹配的类型找出来并注入到test属性中，正是由于这一因素，所以在autowireByType方法中，新建了局部遍历autowiredBeanNames，用于存储所有依赖的bean，如果只是对非集合类的属性注入来说，此属性并无用处。

对于寻找类型匹配的逻辑实现封装在DeFaultListableBeanFacotry中，代码如下

java

 代码解读

复制代码

`public Object resolveDependency(DependencyDescriptor descriptor, String beanName,         Set<String> autowiredBeanNames, TypeConverter typeConverter) throws BeansException { ​     descriptor.initParameterNameDiscovery(getParameterNameDiscoverer());     if (descriptor.getDependencyType().equals(ObjectFactory.class)) {         // ObjectFactory类注入的特殊处理         return new DependencyObjectFactory(descriptor, beanName);     }     else if (descriptor.getDependencyType().equals(javaxInjectProviderClass)) {         // javaxInjectProviderClass类注入的特殊处理         return new DependencyProviderFactory().createDependencyProvider(descriptor, beanName);     }     else {         // 通用处理逻辑         return doResolveDependency(descriptor, descriptor.getDependencyType(), beanName, autowiredBeanNames, typeConverter);     } } ​ protected Object doResolveDependency(DependencyDescriptor descriptor, Class<?> type, String beanName,         Set<String> autowiredBeanNames, TypeConverter typeConverter) throws BeansException {     // 用于支持Spring中新增的注解@Value     Object value = getAutowireCandidateResolver().getSuggestedValue(descriptor);     if (value != null) {         if (value instanceof String) {             String strVal = resolveEmbeddedValue((String) value);             BeanDefinition bd = (beanName != null && containsBean(beanName) ? getMergedBeanDefinition(beanName) : null);             value = evaluateBeanDefinitionString(strVal, bd);         }         TypeConverter converter = (typeConverter != null ? typeConverter : getTypeConverter());         return (descriptor.getField() != null ?                 converter.convertIfNecessary(value, type, descriptor.getField()) :                 converter.convertIfNecessary(value, type, descriptor.getMethodParameter()));     }        // 如果解析器没有成功解析，则需要考虑各种情况     // 属性是数组类型     if (type.isArray()) {         Class<?> componentType = type.getComponentType();         // 根据属性类型找到beanFactory中所有类型的bean         // 返回值的构成为：key=匹配的beanName，value=beanName对应的实例化后的bean         Map<String, Object> matchingBeans = findAutowireCandidates(beanName, componentType, descriptor);         if (matchingBeans.isEmpty()) {             if (descriptor.isRequired()) {                 raiseNoSuchBeanDefinitionException(componentType, "array of " + componentType.getName(), descriptor);             }             return null;         }         if (autowiredBeanNames != null) {             autowiredBeanNames.addAll(matchingBeans.keySet());         }         TypeConverter converter = (typeConverter != null ? typeConverter : getTypeConverter());         // 通过转换器将bean的值转换为对应的type类型         return converter.convertIfNecessary(matchingBeans.values(), type);     }     // 属性是Collection类型     else if (Collection.class.isAssignableFrom(type) && type.isInterface()) {         Class<?> elementType = descriptor.getCollectionType();         if (elementType == null) {             if (descriptor.isRequired()) {                 throw new FatalBeanException("No element type declared for collection [" + type.getName() + "]");             }             return null;         }         Map<String, Object> matchingBeans = findAutowireCandidates(beanName, elementType, descriptor);         if (matchingBeans.isEmpty()) {             if (descriptor.isRequired()) {                 raiseNoSuchBeanDefinitionException(elementType, "collection of " + elementType.getName(), descriptor);             }             return null;         }         if (autowiredBeanNames != null) {             autowiredBeanNames.addAll(matchingBeans.keySet());         }         TypeConverter converter = (typeConverter != null ? typeConverter : getTypeConverter());         return converter.convertIfNecessary(matchingBeans.values(), type);     }     // 属性是Map类型     else if (Map.class.isAssignableFrom(type) && type.isInterface()) {         Class<?> keyType = descriptor.getMapKeyType();         if (keyType == null || !String.class.isAssignableFrom(keyType)) {             if (descriptor.isRequired()) {                 throw new FatalBeanException("Key type [" + keyType + "] of map [" + type.getName() +                         "] must be assignable to [java.lang.String]");             }             return null;         }         Class<?> valueType = descriptor.getMapValueType();         if (valueType == null) {             if (descriptor.isRequired()) {                 throw new FatalBeanException("No value type declared for map [" + type.getName() + "]");             }             return null;         }         Map<String, Object> matchingBeans = findAutowireCandidates(beanName, valueType, descriptor);         if (matchingBeans.isEmpty()) {             if (descriptor.isRequired()) {                 raiseNoSuchBeanDefinitionException(valueType, "map with value type " + valueType.getName(), descriptor);             }             return null;         }         if (autowiredBeanNames != null) {             autowiredBeanNames.addAll(matchingBeans.keySet());         }         return matchingBeans;     }     else {         Map<String, Object> matchingBeans = findAutowireCandidates(beanName, type, descriptor);         if (matchingBeans.isEmpty()) {              if (descriptor.isRequired()) {                 raiseNoSuchBeanDefinitionException(type, "", descriptor);             }             return null;         }         if (matchingBeans.size() > 1) {             String primaryBeanName = determinePrimaryCandidate(matchingBeans, descriptor);             if (primaryBeanName == null) {                 throw new NoUniqueBeanDefinitionException(type, matchingBeans.keySet());             }             if (autowiredBeanNames != null) {                 autowiredBeanNames.add(primaryBeanName);             }             return matchingBeans.get(primaryBeanName);         }         // We have exactly one match.         // 已经可以确定只有一个匹配项         Map.Entry<String, Object> entry = matchingBeans.entrySet().iterator().next();         if (autowiredBeanNames != null) {             autowiredBeanNames.add(entry.getKey());         }         return entry.getValue();     } }`   

寻找类型的匹配执行顺序时，首先尝试使用解析器进行解析，如果解析器没有成功解析，那么可能是使用默认的解析器没有做任何的处理，或者是使用了自定义的解析器，但是对于集合等类型来说并不在解析范围之内，所以再次对不同类型进行情况的处理，虽说对于不同类型处理方式不一致，但是大致的思路还是很相似的，所以方法中只对数组类型进行了详细地注释。

### 3、applyPropertyValues

程序运行到这里，已经完成了对所有注入属性的获取，但是获取的属性是以PropertyValues形式存在的，还并没有应用到已经实例化的bean中，这一工作是在applyPropertyValues中。代码如下

java

 代码解读

复制代码

`protected void applyPropertyValues(String beanName, BeanDefinition mbd, BeanWrapper bw, PropertyValues pvs) {     if (pvs == null || pvs.isEmpty()) {         return;     } ​     MutablePropertyValues mpvs = null;     List<PropertyValue> original; ​     if (System.getSecurityManager() != null) {         if (bw instanceof BeanWrapperImpl) {             ((BeanWrapperImpl) bw).setSecurityContext(getAccessControlContext());         }     } ​     if (pvs instanceof MutablePropertyValues) {         mpvs = (MutablePropertyValues) pvs;         // 如果mpvs中的值已经被转换为对应的类型那么可以直接设置到beanwapper中         if (mpvs.isConverted()) {             try {                 bw.setPropertyValues(mpvs);                 return;             }             catch (BeansException ex) {                 throw new BeanCreationException(                         mbd.getResourceDescription(), beanName, "Error setting property values", ex);             }         }         original = mpvs.getPropertyValueList();     }     else {         // 如果psv并不是使用MutablePropertyValues封装的类型，那么直接使用原始的属性获取方法         original = Arrays.asList(pvs.getPropertyValues());     } ​     TypeConverter converter = getCustomTypeConverter();     if (converter == null) {         converter = bw;     }     // 获取对应的解析器     BeanDefinitionValueResolver valueResolver = new BeanDefinitionValueResolver(this, beanName, mbd, converter); ​     // Create a deep copy, resolving any references for values.     List<PropertyValue> deepCopy = new ArrayList<PropertyValue>(original.size());     boolean resolveNecessary = false;     // 遍历属性，将属性转换为对应类的对应属性的类型     for (PropertyValue pv : original) {         if (pv.isConverted()) {             deepCopy.add(pv);         }         else {             String propertyName = pv.getName();             Object originalValue = pv.getValue();             Object resolvedValue = valueResolver.resolveValueIfNecessary(pv, originalValue);             Object convertedValue = resolvedValue;             boolean convertible = bw.isWritableProperty(propertyName) &&                     !PropertyAccessorUtils.isNestedOrIndexedProperty(propertyName);             if (convertible) {                 convertedValue = convertForProperty(resolvedValue, propertyName, bw, converter);             }             // Possibly store converted value in merged bean definition,             // in order to avoid re-conversion for every created bean instance.             if (resolvedValue == originalValue) {                 if (convertible) {                     pv.setConvertedValue(convertedValue);                 }                 deepCopy.add(pv);             }             else if (convertible && originalValue instanceof TypedStringValue &&                     !((TypedStringValue) originalValue).isDynamic() &&                     !(convertedValue instanceof Collection || ObjectUtils.isArray(convertedValue))) {                 pv.setConvertedValue(convertedValue);                 deepCopy.add(pv);             }             else {                 resolveNecessary = true;                 deepCopy.add(new PropertyValue(pv, convertedValue));             }         }     }     if (mpvs != null && !resolveNecessary) {         mpvs.setConverted();     } ​     // Set our (possibly massaged) deep copy.     try {         bw.setPropertyValues(new MutablePropertyValues(deepCopy));     }     catch (BeansException ex) {         throw new BeanCreationException(                 mbd.getResourceDescription(), beanName, "Error setting property values", ex);     } }`

五、初始化bean
---------

大家应该记得在bean配置时有一个init-method的属性，这个属性的作用是在bean实例化前调用的init-method指定的方法来根据用户业务进行相应的实例化。我们现在就已经进入这个方法了，首先看一下这个方法的执行位置，Spring中程序已经执行过bean的初始化，并且进行了属性的填充，而就在这时将会调用用户设定的初始化方法。

java

 代码解读

复制代码

`protected Object initializeBean(final String beanName, final Object bean, RootBeanDefinition mbd) {     if (System.getSecurityManager() != null) {         AccessController.doPrivileged(new PrivilegedAction<Object>() {             public Object run() {                 invokeAwareMethods(beanName, bean);                 return null;             }         }, getAccessControlContext());     }     else {         // 对特殊的bean处理：Aware、BeanClassLoaderAware、BeanFactoryAware         invokeAwareMethods(beanName, bean);     } ​     Object wrappedBean = bean;     if (mbd == null || !mbd.isSynthetic()) {         // 应用后处理器         wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);     } ​     try {         // 激活用户自定义的init方法         invokeInitMethods(beanName, wrappedBean, mbd);     }     catch (Throwable ex) {         throw new BeanCreationException(                 (mbd != null ? mbd.getResourceDescription() : null),                 beanName, "Invocation of init method failed", ex);     } ​     if (mbd == null || !mbd.isSynthetic()) {         // 应用后处理器         wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);     }     return wrappedBean; }`

虽然说此方法的主要目的是进行客户设定的初始化方法的调用，但是除此之外还有写其他必要的工作。

### 1、激活Aware方法

在分析其原理时，我们先了解一下Aware的使用。Spring中提供了一些Aware的接口，例如BeanFactoryAware、ApplicationContextAware、ResourceLoaderAware、ServletContextAware等，实现这些Aware的接口的bean在被初始化之后，可以取得一些相应的资源。例如实现BeanFactoryAware的bean在初始化后，Spring容器将会注入BeanFactory的实例，而实现ApplicationContextAware的bean，在bean被初始化后，将会被注入ApplicationContext的实例等。

java

 代码解读

复制代码

`private void invokeAwareMethods(final String beanName, final Object bean) {     if (bean instanceof Aware) {         if (bean instanceof BeanNameAware) {             ((BeanNameAware) bean).setBeanName(beanName);         }         if (bean instanceof BeanClassLoaderAware) {             ((BeanClassLoaderAware) bean).setBeanClassLoader(getBeanClassLoader());         }         if (bean instanceof BeanFactoryAware) {             ((BeanFactoryAware) bean).setBeanFactory(AbstractAutowireCapableBeanFactory.this);         }     } }`

### 2、处理器的应用

BeanPostProcessor相信大家都不陌生，这是Spring中开放式架构中一个必不可少的亮点，给用户充足的权限去更改或扩展Spring，而除了BeanPostProcessor外还有很多其他的PostProcessor，当然大部分都是以此为基础，继承自BeanPostProcessor。BeanPostProcessor的使用位置就是这里，在调用客户自定义初始化方法前以及调用自定义初始化方法后分别会调用BeanPostProcessor的postProcessBeforeInitialization和postProccessAfterInitialization方法，使用户可以根据自己的业务需求进行响应的处理。

java

 代码解读

复制代码

`​ public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)         throws BeansException { ​     Object result = existingBean;     for (BeanPostProcessor beanProcessor : getBeanPostProcessors()) {         result = beanProcessor.postProcessBeforeInitialization(result, beanName);         if (result == null) {             return result;         }     }     return result; } ​ public Object applyBeanPostProcessorsAfterInitialization(Object existingBean, String beanName)         throws BeansException { ​     Object result = existingBean;     for (BeanPostProcessor beanProcessor : getBeanPostProcessors()) {         result = beanProcessor.postProcessAfterInitialization(result, beanName);         if (result == null) {             return result;         }     }     return result; }`

### 3、激活自定义的init方法

客户定制的初始化方法除了我们熟知的使用配置init-method外，还有使自定义的bean实现InitializingBean接口，并在afterPropertiesSet中实现自己的初始化业务逻辑。

init-method与afterPropertiesSet都是在初始化bean时执行，执行顺序是afterPropertiesSet先执行，而init-method后执行。

在invokeiniMethods方法中就实现了这两个步骤的初始化方法调用。代码如下

java

 代码解读

复制代码

`// 这是一条广告！！！ // 微信关注公众号：好看的HK，第一时间掌握最新动态！ protected void invokeInitMethods(String beanName, final Object bean, RootBeanDefinition mbd)         throws Throwable {     // 首先检查是否是InitializingBean，如果是的话需要调用afterPropertiesSet方法     boolean isInitializingBean = (bean instanceof InitializingBean);     if (isInitializingBean && (mbd == null || !mbd.isExternallyManagedInitMethod("afterPropertiesSet"))) {         if (logger.isDebugEnabled()) {             logger.debug("Invoking afterPropertiesSet() on bean with name '" + beanName + "'");         }         if (System.getSecurityManager() != null) {             try {                 AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {                     public Object run() throws Exception {                         ((InitializingBean) bean).afterPropertiesSet();                         return null;                     }                 }, getAccessControlContext());             }             catch (PrivilegedActionException pae) {                 throw pae.getException();             }         }         else {             // 属性初始化后的处理             ((InitializingBean) bean).afterPropertiesSet();         }     } ​     if (mbd != null) {         String initMethodName = mbd.getInitMethodName();         if (initMethodName != null && !(isInitializingBean && "afterPropertiesSet".equals(initMethodName)) &&                 !mbd.isExternallyManagedInitMethod(initMethodName)) {             // 调用自定义初始化方法             invokeCustomInitMethod(beanName, bean, mbd);         }     } }`

六、注册DisposableBean
------------------

Spring不但提供了对于初始化方法的扩展入口，同样也提供了销毁方法的扩展入口，对于销毁方法的扩展，除了我们熟知的配置属性destroy-method方法外，用户还可以注册后处理器DestructionAwareBeanProcessor来统一处理bean的销毁方法，代码如下

java

 代码解读

复制代码

`protected void registerDisposableBeanIfNecessary(String beanName, Object bean, RootBeanDefinition mbd) {     AccessControlContext acc = (System.getSecurityManager() != null ? getAccessControlContext() : null);     if (!mbd.isPrototype() && requiresDestruction(bean, mbd)) {         if (mbd.isSingleton()) {             // Register a DisposableBean implementation that performs all destruction             // work for the given bean: DestructionAwareBeanPostProcessors,             // DisposableBean interface, custom destroy method.             registerDisposableBean(beanName,                     new DisposableBeanAdapter(bean, beanName, mbd, getBeanPostProcessors(), acc));         }         else {             // A bean with a custom scope...             Scope scope = this.scopes.get(mbd.getScope());             if (scope == null) {                 throw new IllegalStateException("No Scope registered for scope '" + mbd.getScope() + "'");             }             scope.registerDestructionCallback(beanName,                     new DisposableBeanAdapter(bean, beanName, mbd, getBeanPostProcessors(), acc));         }     } }`