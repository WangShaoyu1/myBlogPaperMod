---
author: "Java3y"
title: "面试官：Java从编译到执行，发生了什么？"
date: 2021-10-18
description: "面试官：今天从基础先问起吧，你是怎么理解Java是一门「跨平台」的语言，也就是「一次编译，到处运行的」？ 候选者：很好理解啊，因为我们有JVM。 候选者：Java源代码会被编译为class文件，cla"
tags: ["后端","面试","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:117,comments:0,collects:113,views:12430,"
---
**面试官**：今天从基础先问起吧，**你是怎么理解Java是一门「跨平台」的语言，也就是「一次编译，到处运行的」？**

**候选者**：很好理解啊，因为我们有JVM。

**候选者**：Java源代码会被编译为class文件，class文件是运行在JVM之上的。

**候选者**：当我们日常开发安装JDK的时候，可以发现JDK是分「不同的操作系统」，JDK里是包含JVM的，所以Java依赖着JVM实现了『跨平台』

**候选者**：JVM是面向操作系统的，它负责把Class字节码解释成系统所能识别的指令并执行，同时也负责程序运行时内存的管理。

[![](/images/jueJin/d6cb6f45768840f.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvfp8dj33j60ts0l2acd02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvfp8dj33j60ts0l2acd02.jpg")

**面试官**：**那要不你来聊聊从源码文件(.java)到代码执行的过程呗？**

**候选者**：嗯，没问题的

**候选者**：简单总结的话，我认为就4个步骤：编译->加载->解释->执行

**候选者**：编译：将源码文件编译成JVM可以解释的class文件。

**候选者**：编译过程会对源代码程序做 「语法分析」「语义分析」「注解处理」等等处理，最后才生成字节码文件。

**候选者**：比如对泛型的擦除和我们经常用的Lombok就是在编译阶段干的。

[![](/images/jueJin/ec93f40c60064ca.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvgejjhuhj61dy0bidhj02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvgejjhuhj61dy0bidhj02.jpg")

**候选者**：加载：将编译后的class文件加载到JVM中。

**候选者**：在加载阶段又可以细化几个步骤：装载->连接->初始化

**候选者**：下面我对这些步骤又细说下哈。

[![](/images/jueJin/b67acc0f954442d.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvgfbauimj613q0ciab802.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvgfbauimj613q0ciab802.jpg")

**候选者**：【装载时机】为了节省内存的开销，并不会一次性把所有的类都装载至JVM，而是等到「有需要」的时候才进行装载（比如new和反射等等）

**候选者**：【装载发生】class文件是通过「类加载器」装载到jvm中的，为了防止内存中出现多份同样的字节码，使用了双亲委派机制（它不会自己去尝试加载这个类，而是把请求委托给父加载器去完成，依次向上）

**候选者**：【装载规则】JDK 中的本地方法类一般由根加载器（Bootstrp loader）装载，JDK 中内部实现的扩展类一般由扩展加载器（ExtClassLoader ）实现装载，而程序中的类文件则由系统加载器（AppClassLoader ）实现装载。

**候选者**：装载这个阶段它做的事情可以总结为：查找并加载类的二进制数据，在JVM「堆」中创建一个java.lang.Class类的对象，并将类相关的信息存储在JVM「方法区」中

**面试官**：嗯…

**候选者**：通过「装载」这个步骤后，现在已经把class文件装载到JVM中了，并创建出对应的Class对象以及类信息存储至方法区了。

**候选者**：「连接」这个阶段它做的事情可以总结为：对class的信息进行验证、为「类变量」分配内存空间并对其赋默认值。

**候选者**：连接又可以细化为几个步骤：验证->准备->解析

**候选者**：1. 验证：验证类是否符合 Java 规范和 JVM 规范

**候选者**：2. 准备：为类的静态变量分配内存，初始化为系统的初始值

**候选者**：3. 解析：将符号引用转为直接引用的过程

**面试官**：嗯…

**候选者**：通过「连接」这个步骤后，现在已经对class信息做校验并分配了内存空间和默认值了。

**候选者**：接下来就是「初始化」阶段了，这个阶段可以总结为：为类的静态变量赋予正确的初始值。

**候选者**：过程大概就是收集class的静态变量、静态代码块、静态方法至()方法，随后从上往下开始执行。

**候选者**：如果「实例化对象」则会调用方法对实例变量进行初始化，并执行对应的构造方法内的代码。

[![](/images/jueJin/d5c12977d3b7435.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvgkt95zyj61ig0r0q9f02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvgkt95zyj61ig0r0q9f02.jpg")

**候选者**：扯了这么多，现在其实才完成至(编译->加载->解释->执行)中的加载阶段，下面就来说下【解释阶段】做了什么

**候选者**：初始化完成之后，当我们尝试执行一个类的方法时，会找到对应方法的字节码的信息，然后解释器会把字节码信息解释成系统能识别的指令码。

**候选者**：「解释」这个阶段它做的事情可以总结为：把字节码转换为操作系统识别的指令

**候选者**：在解释阶段会有两种方式把字节码信息解释成机器指令码，一个是字节码解释器、一个是即时编译器(JIT)。

[![](/images/jueJin/5114991410754bd.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvgm6zg5nj60u80begme02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvgm6zg5nj60u80begme02.jpg")

**候选者**：JVM会对「热点代码」做编译，非热点代码直接进行解释。当JVM发现某个方法或代码块的运行特别频繁的时候，就有可能把这部分代码认定为「热点代码」

**候选者**：使用「热点探测」来检测是否为热点代码。「热点探测」一般有两种方式，计数器和抽样。HotSpot使用的是「计数器」的方式进行探测，为每个方法准备了两类计数器：方法调用计数器和回边计数器

**候选者**：这两个计数器都有一个确定的阈值，当计数器超过阈值溢出了，就会触发JIT编译。

**候选者**：即时编译器把热点方法的指令码保存起来，下次执行的时候就无需重复的进行解释，直接执行缓存的机器语言

**面试官**：嗯…

**候选者**：解释阶段结束后，最后就到了执行阶段。

**候选者**：「执行」这个阶段它做的事情可以总结为：操作系统把解释器解析出来的指令码，调用系统的硬件执行最终的程序指令。

**候选者**：上面就是我对从源码文件(.java)到代码执行的过程的理解了。

**面试官**：嗯…我还想问下你刚才提到的双亲委派模型…

**候选者**：下次一定！

[![](/images/jueJin/855e276e48f842f.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1grx29rcwc5j30zq0gl0yt.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1grx29rcwc5j30zq0gl0yt.jpg")

本文总结：

*   Java跨平台因为有JVM屏蔽了底层操作系统
    
*   Java源码到执行的过程，从JVM的角度看可以总结为四个步骤：编译->加载->解释->执行
    
    *   「编译」经过 语法分析、语义分析、注解处理 最后才生成会class文件
    *   「加载」又可以细分步骤为：装载->连接->初始化。装载则把class文件装载至JVM，连接则校验class信息、分配内存空间及赋默认值，初始化则为变量赋值为正确的初始值。连接里又可以细化为：验证、准备、解析
    *   「解释」则是把字节码转换成操作系统可识别的执行指令，在JVM中会有字节码解释器和即时编译器。在解释时会对代码进行分析，查看是否为「热点代码」，如果为「热点代码」则触发JIT编译，下次执行时就无需重复进行解释，提高解释速度
    *   「执行」调用系统的硬件执行最终的程序指令

[![](/images/jueJin/9d9faaabef5c4bf.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtm7zd6s2aj61400miabg02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtm7zd6s2aj61400miabg02.jpg")

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试，对线面试官系列持续更新中！

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**