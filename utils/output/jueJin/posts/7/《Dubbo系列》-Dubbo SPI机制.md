---
author: "敖丙"
title: "《Dubbo系列》-Dubbo SPI机制"
date: 2020-09-14
description: "上一篇 Dubbo 文章敖丙已经带了大家过了一遍整体的架构，也提到了 Dubbo 的成功离不开它采用微内核设计+SPI扩展，使得有特殊需求的接入方可以自定义扩展，做定制的二次开发。 良好的扩展性对于一个框架而言尤其重要，框架顾名思义就是搭好核心架子，给予用户简单便捷的使用，同时…"
tags: ["Java","Dubbo中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:140,comments:0,collects:184,views:14566,"
---
> 点赞再看，养成习惯，微信搜一搜【**三太子敖丙**】关注这个喜欢写情怀的程序员。
> 
> 本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已收录，有一线大厂面试完整考点、资料以及我的系列文章。

前言
--

上一篇 Dubbo 文章敖丙已经带了大家过了一遍整体的架构，也提到了 Dubbo 的成功离不开它**采用微内核设计+SPI扩展**，使得有特殊需求的接入方可以自定义扩展，做定制的二次开发。

良好的扩展性对于一个框架而言尤其重要，框架顾名思义就是**搭好核心架子**，给予用户简单便捷的使用，同时也需要**满足他们定制化的需求**。

Dubbo 就依靠 SPI 机制实现了插件化功能，几乎将所有的功能组件做成基于 SPI 实现，并且默认提供了很多可以直接使用的扩展点，**实现了面向功能进行拆分的对扩展开放的架构**。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

什么是 SPI
=======

首先我们得先知道什么叫 SPI。

SPI (Service Provider Interface)，主要是用来在框架中使用的，最常见和莫过于我们在访问数据库时候用到的`java.sql.Driver`接口了。

你想一下首先市面上的数据库五花八门，不同的数据库底层协议的大不相同，所以首先需要**定制一个接口**，来约束一下这些数据库，使得 Java 语言的使用者在调用数据库的时候可以方便、统一的面向接口编程。

数据库厂商们需要根据接口来开发他们对应的实现，那么问题来了，真正使用的时候到底用哪个实现呢？从哪里找到实现类呢？

这时候 Java SPI 机制就派上用场了，不知道到底用哪个实现类和找不到实现类，我们告诉它不就完事了呗。

**大家都约定好将实现类的配置写在一个地方，然后到时候都去哪个地方查一下不就知道了吗？**

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Java SPI 就是这样做的，约定在 Classpath 下的 META-INF/services/ 目录里创建一个**以服务接口命名的文件**，然后**文件里面记录的是此 jar 包提供的具体实现类的全限定名**。

这样当我们引用了某个 jar 包的时候就可以去找这个 jar 包的 META-INF/services/ 目录，再根据接口名找到文件，然后读取文件里面的内容去进行实现类的加载与实例化。

比如我们看下 MySQL 是怎么做的。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

再来看一下文件里面的内容。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

MySQL 就是这样做的，为了让大家更加深刻的理解我再简单的写一个示例。

Java SPI 示例
===========

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

然后我在 META-INF/services/ 目录下建了个以接口全限定名命名的文件，内容如下

```java
com.demo.spi.NuanNanAobing
com.demo.spi.ShuaiAobing
```

运行之后的结果如下

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Java SPI 源码分析
=============

之前的文章我也提到了 Dubbo 并没有用 Java 实现的 SPI，而是自定义 SPI，那肯定是 Java SPI 有什么不方便的地方或者劣势。

因此丙带着大家先深入了解一下 Java SPI，这样才能知道哪里不好，进而再和 Dubbo SPI 进行对比的时候会更加的清晰其优势。

大家看到源码不要怕，丙已经给大家做了注释，并且逻辑也不难的，**想要变强源码不可或缺**。为了让大家更好的理解，丙在源码分析完了之后还会画个图，帮大家再理一下思路。

从上面我的示例中可以看到`ServiceLoader.load()`其实就是 Java SPI 入口，我们来看看到底做了什么操作。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

我用一句话概括一下，简单的说就是先找当前线程绑定的 ClassLoader，如果没有就用 SystemClassLoader，然后清除一下缓存，再创建一个 LazyIterator。

那现在重点就是 LazyIterator了，从上面代码可以看到我们调用了 hasNext() 来做实例循环，通过 next() 得到一个实例。而 LazyIterator 其实就是 Iterator 的实现类。我们来看看它到底干了啥。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

不管进入 if 分支还是 else 分支，重点都在我框出来的代码，接下来就进入重要时刻了！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

可以看到这个方法其实就是在约定好的地方找到接口对应的文件，然后加载文件并且解析文件里面的内容。

我们再来看一下 nextService()。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

所以就是通过文件里填写的全限定名加载类，并且创建其实例放入缓存之后返回实例。

整体的 Java SPI 的源码解析已经完毕，是不是很简单？就是约定一个目录，根据接口名去那个目录找到文件，文件解析得到实现类的全限定名，然后循环加载实现类和创建其实例。

我再用一张图来带大家过一遍。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

想一下 Java SPI 哪里不好
=================

相信大家一眼就能看出来，Java SPI 在查找扩展实现类的时候遍历 SPI 的配置文件并且**将实现类全部实例化**，假设一个实现类初始化过程比较消耗资源且耗时，但是你的代码里面又用不上它，这就产生了资源的浪费。

所以说 Java SPI 无法按需加载实现类。

Dubbo SPI
=========

因此 Dubbo 就自己实现了一个 SPI，让我们想一下按需加载的话首先你得给个名字，通过名字去文件里面找到对应的实现类全限定名然后加载实例化即可。

Dubbo 就是这样设计的，配置文件里面存放的是键值对，我截一个 Cluster 的配置。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

并且 **Dubbo SPI 除了可以按需加载实现类之外，增加了 IOC 和 AOP 的特性，还有个自适应扩展机制。**

我们先来看一下 Dubbo 对配置文件目录的约定，不同于 Java SPI ，Dubbo 分为了三类目录。

*   META-INF/services/ 目录：该目录下的 SPI 配置文件是为了用来兼容 Java SPI 。
    
*   META-INF/dubbo/ 目录：该目录存放用户自定义的 SPI 配置文件。
    
*   META-INF/dubbo/internal/ 目录：该目录存放 Dubbo 内部使用的 SPI 配置文件。
    

Dubbo SPI 简单实例
==============

用法很是简单，我就拿官网上的例子来展示一下。

首先在 META-INF/dubbo 目录下按接口全限定名建立一个文件，内容如下：

```ini
optimusPrime = org.apache.spi.OptimusPrime
bumblebee = org.apache.spi.Bumblebee
```

然后在接口上标注@SPI 注解，以表明它要用SPI机制，类似下面这个图（我就是拿 Cluster 的图举个例子，和这个示例代码定义的接口不一样）。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

接着通过下面的示例代码即可加载指定的实现类。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

再来看一下运行的结果。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Dubbo 源码分析
==========

> 此次分析的源码版本是 2.6.5

相信通过上面的描述大家已经对 Dubbo SPI 已经有了一定的认识，接下来我们来看看它的实现。

从上面的示例代码我们知道 ExtensionLoader 好像就是重点，它是类似 Java SPI 中 ServiceLoader 的存在。

我们可以看到大致流程就是先通过接口类找到一个 ExtensionLoader ，然后再通过 ExtensionLoader.getExtension(name) 得到指定名字的实现类实例。

我们就先看下 getExtensionLoader() 做了什么。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

很简单，做了一些判断然后从缓存里面找是否已经存在这个类型的 ExtensionLoader ，如果没有就新建一个塞入缓存。最后返回接口类对应的 ExtensionLoader 。

我们再来看一下 getExtension() 方法，从现象我们可以知道这个方法就是从类对应的 ExtensionLoader 中通过名字找到实例化完的实现类。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

可以看到重点就是 createExtension()，我们再来看下这个方法干了啥。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

整体逻辑很清晰，先找实现类，判断缓存是否有实例，没有就反射建个实例，然后执行 set 方法依赖注入。如果有找到包装类的话，再包一层。

到这步为止我先画个图，大家理一理，还是很简单的。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

那么问题来了 getExtensionClasses() 是怎么找的呢？injectExtension() 如何注入的呢（其实我已经说了set方法注入）？为什么需要包装类呢？

getExtensionClasses
-------------------

这个方法进去也是先去缓存中找，如果缓存是空的，那么调用 `loadExtensionClasses`，我们就来看下这个方法。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

而 `loadDirectory`里面就是根据类名和指定的目录，找到文件先获取所有的资源，然后一个一个去加载类，然后再通过`loadClass`去做一下缓存操作。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

可以看到，loadClass 之前已经加载了类，loadClass 只是根据类上面的情况做不同的缓存。分别有 `Adaptive` 、`WrapperClass` 和普通类这三种，普通类又将`Activate`记录了一下。至此对于普通的类来说整个 SPI 过程完结了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

接下来我们分别看不是普通类的几种东西是干啥用的。

Adaptive 注解 - 自适应扩展
-------------------

在进入这个注解分析之前，我们需要知道 Dubbo 的自适应扩展机制。

我们先来看一个场景，首先我们根据配置来进行 SPI 扩展的加载，但是我不想在启动的时候让扩展被加载，我想根据请求时候的参数来动态选择对应的扩展。

怎么做呢？

**Dubbo 通过一个代理机制实现了自适应扩展**，简单的说就是为你想扩展的接口生成一个代理类，可以通过JDK 或者 javassist 编译你生成的代理类代码，然后通过反射创建实例。

这个实例里面的实现会根据本来方法的请求参数得知需要的扩展类，然后通过 `ExtensionLoader.getExtensionLoader(type.class).getExtension(从参数得来的name)`，来获取真正的实例来调用。

我从官网搞了个例子，大家来看下。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

现在大家应该对自适应扩展有了一定的认识了，我们再来看下源码，到底怎么做的。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

这个注解就是自适应扩展相关的注解，可以修饰类和方法上，在修饰类的时候不会生成代理类，因为这个类就是代理类，修饰在方法上的时候会生成代理类。

### Adaptive 注解在类上

比如这个 `ExtensionFactory` 有三个实现类，其中一个实现类就被标注了 Adaptive 注解。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

在 ExtensionLoader 构造的时候就会去通过getAdaptiveExtension 获取指定的扩展类的 ExtensionFactory。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

我们再来看下 `AdaptiveExtensionFactory` 的实现。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

可以看到先缓存了所有实现类，然后在获取的时候通过遍历找到对应的 Extension。

我们再来深入分析一波 getAdaptiveExtension 里面到底干了什么。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

到这里其实已经和上文分析的 `getExtensionClasses`中loadClass 对 Adaptive 特殊缓存相呼应上了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### Adaptive 注解在方法上

注解在方法上则需要动态拼接代码，然后动态生成类，我们以 Protocol 为例子来看一下。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Protocol 没有实现类注释了 Adaptive ，但是接口上有两个方法注解了 Adaptive ，有两个方法没有。

因此它走的逻辑应该应该是 `createAdaptiveExtensionClass`，

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

具体在里面如何生成代码的我就不再深入了，有兴趣的自己去看吧，我就把成品解析一下，就差不多了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

我美化一下给大家看看。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

可以看到会生成包，也会生成 import 语句，类名就是接口加个$Adaptive，并且实现这接口，没有标记 Adaptive 注解的方法调用的话直接抛错。

我们再来看一下标注了注解的方法，我就拿 export 举例。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

就像我前面说的那样，根据请求的参数，即 URL 得到具体要调用的实现类名，然后再调用 `getExtension` 获取。

整个自适应扩展流程如下。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

WrapperClass - AOP
------------------

包装类是因为一个扩展接口可能有多个扩展实现类，而**这些扩展实现类会有一个相同的或者公共的逻辑**，如果每个实现类都写一遍代码就重复了，并且比较不好维护。

因此就搞了个包装类，Dubbo 里帮你自动包装，只需要某个扩展类的构造函数只有一个参数，并且是扩展接口类型，就会被判定为包装类，然后记录下来，用来包装别的实现类。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

简单又巧妙，这就是 AOP 了。

injectExtension - IOC
---------------------

直接看代码，很简单，就是查找 set 方法，根据参数找到依赖对象则注入。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

这就是 IOC。

Activate 注解
-----------

这个注解我就简单的说下，拿 Filter 举例，Filter 有很多实现类，在某些场景下需要其中的几个实现类，而某些场景下需要另外几个，而 Activate 注解就是标记这个用的。

它有三个属性，group 表示修饰在哪个端，是 provider 还是 consumer，value 表示在 URL参数中出现才会被激活，order 表示实现类的顺序。

总结
==

先放个上述过程完整的图。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

然后我们再来总结一下，今天丙先带大家了解了下什么是 SPI，写了个简单示例，并且进行了 Java SPI 源码分析。

得知了 Java SPI 会一次加载和实例化所有的实现类。

而 Dubbo SPI 则自己实现了 SPI，可以通过名字实例化指定的实现类，并且实现了 IOC 、AOP 与 自适应扩展 SPI 。

整体而言不是很难，也不会很绕，大家看了文章之后如果自己再过一遍收获会更大。

我是敖丙，你知道的越多，你不知道的越多，我们下期见！

**人才**们的 **【三连】** 就是敖丙创作的最大动力，如果本篇博客有任何错误和建议，欢迎人才们留言！

* * *

> 文章持续更新，可以微信搜一搜「 **三太子敖丙** 」第一时间阅读，回复【**资料**】有我准备的一线大厂面试资料和简历模板，本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已经收录，有大厂面试完整考点，欢迎Star。