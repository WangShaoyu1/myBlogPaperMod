---
author: "Java3y"
title: "面试官问我JVM内存结构，我真的是"
date: 2021-11-02
description: "面试官：今天来聊聊JVM的内存结构吧？ 候选者：嗯，好的 候选者：前几次面试的时候也提到了：class文件会被类加载器装载至JVM中，并且JVM会负责程序「运行时」的「内存管理」 候选者：而JVM的内"
tags: ["后端","Java","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:232,comments:16,collects:377,views:25442,"
---
**面试官**：**今天来聊聊JVM的内存结构吧？**

**候选者**：嗯，好的

**候选者**：前几次面试的时候也提到了：class文件会被类加载器装载至JVM中，并且JVM会负责程序「运行时」的「内存管理」

**候选者**：而JVM的内存结构，往往指的就是JVM定义的「运行时数据区域」

**候选者**：简单来说就分为了5大块：方法区、堆、程序计数器、虚拟机栈、本地方法栈

**候选者**：要值得注意的是：这是JVM「规范」的分区概念，到具体的实现落地，不同的厂商实现可能是有所区别的。

[![](/images/jueJin/e59801ac45a948e.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs784qdq5sj314z0u04dh.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs784qdq5sj314z0u04dh.jpg")

**面试官**：**嗯，顺便讲下你这图上每个区域的内容吧。**

**候选者**：好的，那我就先从「程序计数器」开始讲起吧。

**候选者**：Java是多线程的语言，我们知道假设线程数大于CPU数，就很有可能有「线程切换」现象，切换意味着「中断」和「恢复」，那自然就需要有一块区域来保存「当前线程的执行信息」

**候选者**：所以，程序计数器就是用于记录各个线程执行的字节码的地址（分支、循环、跳转、异常、线程恢复等都依赖于计数器）

**面试官**：好的，理解了。

**候选者**：那接下来我就说下「虚拟机栈」吧

**候选者**：每个线程在创建的时候都会创建一个「虚拟机栈」，每次方法调用都会创建一个「栈帧」。每个「栈帧」会包含几块内容：局部变量表、操作数栈、动态连接和返回地址

[![](/images/jueJin/590d6320e851414.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs790dou0bj30u013x13c.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs790dou0bj30u013x13c.jpg")

**候选者**：了解了「虚拟机栈」的组成后，也不难猜出它的作用了：它保存方法了局部变量、部分变量的计算并参与了方法的调用和返回。

**面试官**：ok，了解了

**候选者**：下面就说下「本地方法栈」吧

**候选者**：本地方法栈跟虚拟机栈的功能类似，虚拟机栈用于管理 Java 函数的调用，而本地方法栈则用于管理本地方法的调用。这里的「本地方法」指的是「非Java方法」，一般本地方法是使用C语言实现的。

**面试官**：嗯…

**候选者**：嗯，说完了「本地方法栈」、「虚拟机栈」和「程序计数器」，哦，下面还有「方法区」和「堆」

**候选者**：那我先说「方法区」吧

**候选者**：前面提到了运行时数据区这个「分区」是JVM的「规范」，具体的落地实现，不同的虚拟机厂商可能是不一样的

**候选者**：所以「方法区」也只是 JVM 中规范的一部分而已。

**候选者**：在HotSpot虚拟机，就会常常提到「永久代」这个词。HotSpot虚拟机在「JDK8前」用「永久代」实现了「方法区」，而很多其他厂商的虚拟机其实是没有「永久代」的概念的。

[![](/images/jueJin/808740250a16483.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvmetbl9kj60r80lyjue02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvmetbl9kj60r80lyjue02.jpg")

**候选者**：我们下面的内容就都用HotSpot虚拟机来说明好了。

**候选者**：在JDK8中，已经用「元空间」来替代了「永久代」作为「方法区」的实现了

**面试官**：嗯…

**候选者**：方法区主要是用来存放已被虚拟机加载的「类相关信息」：包括类信息、常量池

**候选者**：类信息又包括了类的版本、字段、方法、接口和父类等信息。

**候选者**：常量池又可以分「静态常量池」和「运行时常量池」

**候选者**：静态常量池主要存储的是「字面量」以及「符号引用」等信息，静态常量池也包括了我们说的「字符串常量池」。

**候选者**：「运行时常量池」存储的是「类加载」时生成的「直接引用」等信息。

[![](/images/jueJin/3829c959f7f44f5.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvocqs8kij613m07ata002.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvocqs8kij613m07ata002.jpg")

**面试官**：嗯…

**候选者**：又值得注意的是：从「逻辑分区」的角度而言「常量池」是属于「方法区」的

**候选者**：但自从在「JDK7」以后，就已经把「运行时常量池」和「静态常量池」转移到了「堆」内存中进行存储（对于「物理分区」来说「运行时常量池」和「静态常量池』就属于堆）

**面试官**：嗯，这信息量有点多

**面试官**：**我想问下，你说从「JDK8」已经把「方法区」的实现从「永久代」变成「元空间」，有什么区别？**

**候选者**：最主要的区别就是：「元空间」存储不在虚拟机中，而是使用本地内存，JVM 不会再出现方法区的内存溢出，以往「永久代」经常因为内存不够用导致跑出OOM异常。

**候选者**：按JDK8版本，总结起来其实就相当于：「类信息」是存储在「元空间」的（也有人把「类信息」这块叫做「类信息常量池」，主要是叫法不同，意思到位就好）

**候选者**：而「常量池」用JDK7开始，从「物理存储」角度上就在「堆中」，这是没有变化的。

[![](/images/jueJin/3992e3889e2846f.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs7cud2bhaj30qq0qmdki.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs7cud2bhaj30qq0qmdki.jpg")

**面试官**：嗯，我听懂了

**面试官**：**最后来讲讲「堆」这块区域吧**

**候选者**：嗯，「堆」是线程共享的区域，几乎类的实例和数组分配的内存都来自于它

**候选者**：「堆」被划分为「新生代」和「老年代」，「新生代」又被进一步划分为 Eden 和 Survivor 区，最后 Survivor 由 From Survivor 和 To Survivor 组成

**候选者**：不多BB，我也画图吧

[![](/images/jueJin/6f4200709463496.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs7d4xpm39j31i00ootkz.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs7d4xpm39j31i00ootkz.jpg")

**候选者**：将「堆内存」分开了几块区域，主要跟「内存回收」有关（垃圾回收机制）

**面试官**：那垃圾回收这块等下次吧，这个延伸下去又很多东西了

**面试官**：**你要不先讲讲JVM内存结构和Java内存模型有啥区别吧？**

**候选者**：他们俩没有啥直接关联，其实两次面试过后，应该你就有感觉了

**候选者**：Java内存模型是跟「并发」相关的，它是为了屏蔽底层细节而提出的规范，希望在上层(Java层面上)在操作内存时在不同的平台上也有相同的效果

**候选者**：Java内存结构（又称为运行时数据区域），它描述着当我们的class文件加载至虚拟机后，各个分区的「逻辑结构」是如何的，每个分区承担着什么作用。

**面试官**：了解了

**今日总结**：JVM内存结构组成（JVM内存结构又称为「运行时数据区域」。主要有五部分组成：虚拟机栈、本地方法栈、程序计数器、方法区和堆。其中方法区和堆是线程共享的。虚拟机栈、本地方法栈以及程序计数器是线程隔离的）

[![](/images/jueJin/a545535fc403406.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtmds15ixej61400miwgu02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtmds15ixej61400miwgu02.jpg")

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试，对线面试官系列持续更新中！

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**