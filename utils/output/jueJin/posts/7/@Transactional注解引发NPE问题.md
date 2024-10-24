---
author: "政采云技术"
title: "@Transactional注解引发NPE问题"
date: 2024-05-30
description: "@Transactional注解引发NPE问题 我们都知道，@Transactional 是一个用于声明式事务管理的注解，在Spring框架中被广泛使用。"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:6,views:2704,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![小中.png](/images/jueJin/e61035362ff74ef.png)

@Transactional注解引发NPE问题
=======================

我们都知道，`@Transactional` 是一个用于声明式事务管理的注解，在Spring框架中被广泛使用。其实现原理主要依赖于Spring AOP（面向切面编程）和事务管理器（如DataSourceTransactionManager）。

其中，因为Spring默认使用了`CGLIB`来实现运行期动态创建Proxy,如果我们没能深入理解其运行原理和实现机制，就极有可能遇到各种诡异的问题。

##遇到的问题 （**PS:以下代码为模拟实际问题的示例代码**）

有一个UserService的bean:

```typescript
@Service
    public class UserService  {
    ​
    @Autowired
    private Man man;
    
    @Autowired
    private Women women;
    ​
        public  void doSomething() {
        man.eat();
        women.eat();
    }
    ​
        public final void manDoSomething() {
        man.eat();
        System.out.println("manDoSomething");
    }
}
```

还有个调用方：

```less
@RestController
@RequestMapping("/test")
    public class TestController {
    ​
    @Autowired
    UserService userService;
    ​
    @GetMapping("/1")
    @ResponseBody
        public void t1(){
        //System.out.println(test.getClass().getName());
        userService. manDoSomething();
    }
    ​
}
```

调用`/test/1`,输出`manDoSomething`，一切正常，下一步，给`UserService.doSomething`加上`@Transactional`事务注解，不出意外，会得到一个NPE.

仔细跟踪代码，会发现null出现在`man.eat()`这一行代码：

```java
@Service
    public class UserService  {
    ​
    @Autowired
    private Man man;
    
    @Autowired
    private Women women;
    
    @Transactional(rollbackFor = Exception.class)
        public  void doSomething() {
        man.eat();
        women.eat();
    }
    ​
        public final void manDoSomething() {
        man.eat();//null
        System.out.println("manDoSomething");
    }
}
```

##什么情况？

为什么加了注解就报NPE，去了就一切正常？明明加的是其他方法，不是我调用的方法呀！为了解决这个诡异的问题，本地使用idea的debug调试发现正常的代码调用,马上发现了问题点.

##排查过程

正常代码调用的断点截图：

![](/images/jueJin/99e936d6111340b.png)

异常代码调用的断点截图：

![](/images/jueJin/53cfb466760746d.png)

可以看到，正常截图就是正常的bean对象，而异常截图的对象名字贼长：`xxx.UserService$$EnhancerBySpringCGLIB$$99335a37@9638`，同时注入的`man`对象为空。显而易见，从名字可以看出这个是个通过cglib代理生成的代理对象，直觉告诉我问题大概率就是这个引起的。

由于笔者项目用的是springboot框架，我们都知道，springboot默认是开启aop代理的，并且如果不是目标类是接口或者代理类，默认是使用的是CGLIB。在Spring ioc容器初始化的过程中，会根据aop配置给需要动态代理的类生成代理对象。而加了事务注解的类就是需要动态代理的类,所以这里调用的是代理类现象是正常的。

但是调用代理类就报NPE异常却需要排查，由于idea无法看到动态生成的代理类源码，于是通过阿尔萨斯得到了源码（只截取关键代码）：

![](/images/jueJin/3d88025c1aec45a.png)

```swift
    public class UserService$$EnhancerBySpringCGLIB$$2a805f5d extends UserService implements SpringProxy, Advised,Factory {
        public final void doSomething() {
        MethodInterceptor methodInterceptor = this.CGLIB$CALLBACK_0;
            if (methodInterceptor == null) {
            UserService$$EnhancerBySpringCGLIB$$2a805f5d.CGLIB$BIND_CALLBACKS(this);
            methodInterceptor = this.CGLIB$CALLBACK_0;
        }
            if (methodInterceptor != null) {
            Object object = methodInterceptor.intercept(this, CGLIB$doSomething$0$Method, CGLIB$emptyArgs, CGLIB$doSomething$0$Proxy);
            return;
        }
        super.doSomething();
    }
    ​
        final void CGLIB$doSomething$0() {
        super.doSomething();
    }
}
```

众所周知，CGLIB代理是通过继承被代理类，生成被代理子类来实现动态代理的。从上面源码也可以看到，代理类的确继承了`UserService`，重写了`doSomething`方法，而由于`manDoSomething`为`final`关键字，所有无法被子类覆盖。

但是为什么代理类继承的属性为空呢？这些属性都在父类的构造方法里，继承父类构建的子类理论上也需要调用父类的构造方法，子类应该都有这些属性的。

为了解决这个问题，我们需要深入了解Spring使用CGLIB生成Proxy的原理方式，看下源码中生成代理对象有什么不同。

springboot aop配置类`AopAutoConfiguration`，入口是`@EnableAspectJAutoProxy`的import。

![](/images/jueJin/26ccab80b5d1433.png)

从以上截图也看出默认是Cglib代理，如果要修改，可以修改proxy-target-class=false配置。由于aop流程过长，具体就不展开了，有兴趣可以看源码。以下是aop的关键流程图：

![](/images/jueJin/0b164137193b43d.png)

**蓝色部分 (后置处理器注入)**

@EnableAspectJAutoProxy开启AOP

> ·其中包括了@Import（AspectJAutoProxyRegistrar.class），Spring会将@Import注解导入的类导入容器中，AspectJAutoProxyRegistrar作用就是进行Bean组件的注册。其调用registerBeanDefinitions最终将AnnotationAwareAspectJAutoProxyCreator注册到容器中。而AnnotationAwareAspectJAutoProxyCreator继承了AbstractAutoProxyCreator，AbstractAutoProxyCreator是一个BeanPostProcessor。至此，与AOP相关的处理器注册完成。

**绿色部分 (初始化Bean)**

> 这部分是简略版的IOC初始化流程 切点对应的代理对象这时候就会被创建 主要是在initializeBean时，执行了applyBeanPostProcessorsAfterlnitialization 即调用对应BeanPosiProcessor的postProcessAfterlnitialization方法，与AOP相关的BeanPostProcessor就是黄色部分注入的AbstractAutoProxyCreator

**红色部分 (生成代理对象)**

> 在AbstractAutoProxyCreator的postProcessAfterlnitialization方法中 会先通过getAdvicesAndAdvisorsForBean获取Bean对应的Advice 这里的Advice就是在Spring扫描定义好的@Asped切面类时保存好的，将相关的advice作为参数，传到createProxy方法中，这一步通过CGlib为Bean生成一个代理对象，并且其中保存了advice

所以问题的关键就是`createProxy`方法源码：

```less
protected Object createProxy(Class<?> beanClass, @Nullable String beanName,
    @Nullable Object[] specificInterceptors, TargetSource targetSource) {
    ​
        if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
        AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory) this.beanFactory, beanName, beanClass);
    }
    //创建代理工厂
    ProxyFactory proxyFactory = new ProxyFactory();
    proxyFactory.copyFrom(this);
    
    //代理方式选择 cglib  or  jdk代理
        if (!proxyFactory.isProxyTargetClass()) {
            if (shouldProxyTargetClass(beanClass, beanName)) {
            proxyFactory.setProxyTargetClass(true);
        }
            else {
            evaluateProxyInterfaces(beanClass, proxyFactory);
        }
    }
    //设置切面逻辑属性
    Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);
    proxyFactory.addAdvisors(advisors);
    proxyFactory.setTargetSource(targetSource);
    customizeProxyFactory(proxyFactory);
    ​
    proxyFactory.setFrozen(this.freezeProxy);
        if (advisorsPreFiltered()) {
        proxyFactory.setPreFiltered(true);
    }
    //生成代理类
    return proxyFactory.getProxy(getProxyClassLoader());
}
```

可以看到，在生成代理类之前，主要做了两件事：

①判断使用Jdk代理还是Cglib代理；

②设置相关的属性。这里我们继续看最后的getProxy()方法：

```less
    public Object getProxy(@Nullable ClassLoader classLoader) {
    return createAopProxy().getProxy(classLoader);
}
```

上面的createAopProxy()方法可以理解为一个工厂方法，返回值是一个AopProxy类型的对象，其内部根据具体的条件生成相应的子类对象，即JdkDynamicAopProxy和ObjenesisCglibAopProxy。所以真正的逻辑在后面，即调用AopProxy.getProxy()方法获取代理过的对象：

```typescript
    public Object getProxy(@Nullable ClassLoader classLoader) {
        if (logger.isTraceEnabled()) {
        logger.trace("Creating CGLIB proxy: " + this.advised.getTargetSource());
    }
    ​
        try {
        -----------省略部分代码----------------------
        // 创建Enhancer对象，并且设置ClassLoder
        Enhancer enhancer = createEnhancer();
            if (classLoader != null) {
            enhancer.setClassLoader(classLoader);
            if (classLoader instanceof SmartClassLoader &&
                ((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {
                enhancer.setUseCache(false);
            }
        }
        //设置要生成的代理类属性，比如继承父类即被代理类,实现SpringProxy,Advised,Factory
        enhancer.setSuperclass(proxySuperClass);
        enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
        enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
        enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));
        -----------省略部分代码----------------------
        ​
        // 真正生成代理对象
        return createProxyClassAndInstance(enhancer, callbacks);
    }
        catch (CodeGenerationException | IllegalArgumentException ex) {
        throw new AopConfigException("Could not generate CGLIB subclass of " + this.advised.getTargetClass() +
        ": Common causes of this problem include using a final class or a non-visible class",
        ex);
    }
        catch (Throwable ex) {
        // TargetSource.getTarget() failed
        throw new AopConfigException("Unexpected AOP exception", ex);
    }
}
```

可以看到，这里的getProxy()方法里主要逻辑就是得到Enhancer，塞入一些必须属性，同时调用真正生成代理对象的方法createProxyClassAndInstance：

```kotlin
    protected Object createProxyClassAndInstance(Enhancer enhancer, Callback[] callbacks) {
    Class<?> proxyClass = enhancer.createClass();
    Object proxyInstance = null;
    ​
        if (objenesis.isWorthTrying()) {
            try {
            //关键看这里，使用的是Objenesis来创建
            proxyInstance = objenesis.newInstance(proxyClass, enhancer.getUseCache());
        }
            catch (Throwable ex) {
            logger.debug("Unable to instantiate proxy using Objenesis, " +
            "falling back to regular proxy construction", ex);
        }
    }
    ​
        if (proxyInstance == null) {
        // Regular instantiation via default constructor...
            try {
            Constructor<?> ctor = (this.constructorArgs != null ?
            proxyClass.getDeclaredConstructor(this.constructorArgTypes) :
            proxyClass.getDeclaredConstructor());
            ReflectionUtils.makeAccessible(ctor);
            proxyInstance = (this.constructorArgs != null ?
            ctor.newInstance(this.constructorArgs) : ctor.newInstance());
        }
            catch (Throwable ex) {
            throw new AopConfigException("Unable to instantiate proxy using Objenesis, " +
            "and regular proxy instantiation via default constructor fails as well", ex);
        }
    }
    ​
    ((Factory) proxyInstance).setCallbacks(callbacks);
    return proxyInstance;
}
```

可以看到，它并没有直接使用`Enhancer`生成代理对象，而是使用`Enhancer + Obienesis`的方式。

`Enhancer` 是Cglib提供出来的一个类的增强器，允许为非接口类型创建一个java代理，底层是使用了字节码处理器ASM。

`Obienesis`是一个小的Java库，它有一个用途:实例化一个特定类的新对象.相比较通过`Class.newInstance()`动态实例化java类，它可以绕过构造器需要参数、构造器会抛出异常的等限制实例化java类，一般用于：

*   序列化，远程调用和持久化-对象需要被实例化并恢复到特定的状态，而不需要调用代码
*   代理、 AOP 库和 mock 对象-类可以被子类继承而子类不用担心父类的构造器
*   容器框架-对象可以以非标准的方式动态地实例化

以下是一个简单使用demo:

**1.定义一个用来实例化的类，不包含默认构造器**

```typescript
    public class ObjenesisTest {
    private String a;
    ​
        public ObjenesisTest(String a) {
        this.a = a;
    }
    ​
    @Override
        public String toString() {
        return "ObjenesisTest{" +
        "a='" + a + ''' +
        '}';
    }
}

```

**2.使用Objenesis实例化对象**

```ini
    public static void main(String[] args) {
    //正常方法实例化
        try {
        Class<?> objenesisTest = Class.forName("xxx.ObjenesisTest");
        System.out.println(objenesisTest.newInstance());
            } catch (Exception e) {
            e.printStackTrace();
        }
        //通过Objenesis
        Objenesis ob=new ObjenesisStd();
        ObjectInstantiator<ObjenesisTest> instantiatorOf = ob.getInstantiatorOf(ObjenesisTest.class);
        System.out.println(instantiatorOf.newInstance());
    }
}
```

**正常方法实例化执行报错：**

`Caused by: java.lang.NoSuchMethodException: xxx.ObjenesisTest.<init>()` **通过Objenesis执行输出结果:**

`ObjenesisTest{a='null'}`

问题找到了，使用Obienesis在构建生成代理对象的时候不会执行委托类的构造方法,会绕过父类构造直接产生代理类(子类)对象。 所以父类public成员属性也没有被初始化,如果想当然的直接使用被注入对象的属性，则会报NPE。

而我们正常情况为什么没有发生问题呢，原因是一般我们都是直接调用代理对象覆写的方法，而不是直接使用其中的属性。调用代理方法，则代理类处理完切面任务后会进入真正的对象，而真正的对象里的各个属性是有值的。

##### 总结

1.需要代理的类（使用aop、包含事务方法）的方法不要使用final关键字

2.不要使用直接访问代理对象的属性变量

推荐阅读
----

[Kubernetes Informer基本原理](https://juejin.cn/post/7329573723894612019 "https://juejin.cn/post/7329573723894612019")

[JDK17 与 JDK11 特性差异浅谈](https://juejin.cn/post/7327725018686980106 "https://juejin.cn/post/7327725018686980106")

[业务分析师眼中的数据中台](https://juejin.cn/post/7327353536404275226 "https://juejin.cn/post/7327353536404275226")

[政采云大数据权限系统设计和实现](https://juejin.cn/post/7326979270881902642 "https://juejin.cn/post/7326979270881902642")

[JDK11 与 JDK8 特性差异浅谈](https://juejin.cn/post/7325132087282974747 "https://juejin.cn/post/7325132087282974747")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)