---
author: "Java3y"
title: "【Java】几道让你拿offer的面试题"
date: 2018-08-02
description: "之前在刷博客的时候，发现一些写得比较好的博客都会默默收藏起来。最近在查阅补漏，有的知识点比较重要的，但是在之前的博客中还没有写到，于是趁着闲整理一下。 前阵子在群上看有人在讨论关于Integer的true或者false问题，我本以为我已经懂了这方面的知识点了。但还是做错了，后来…"
tags: ["安全","Java","HTTPS","JVM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:472,comments:5,collects:289,views:9856,"
---
前言
==

> 只有光头才能变强

之前在刷博客的时候，发现一些写得比较好的博客都会默默收藏起来。最近在查阅补漏，有的知识点比较重要的，但是在之前的博客中还没有写到，于是趁着闲整理一下。

文本的知识点：

*   Integer常量池
*   TCP拆包粘包
*   `select、poll、epoll`简单区别
*   jdk1.6以后对Synchronize锁优化
*   Java内存模型

本文**力求简单讲清每个知识点**，希望大家看完能有所收获

一、神奇的Integer
============

前阵子在群上看有人在讨论关于Integer的true或者false问题，我本以为我已经懂了这方面的知识点了。但还是做错了，后来去请教了一下朋友。朋友又给我发了另一张图：

![](/images/jueJin/164f805aad20af0.png)

后来发现这是出自《深入理解Java虚拟机——JVM高级特性与最佳实践(第2版)》中的10.3.2小节中~

```

    public class Main_1 {
        public static void main(String[] args) {
        Integer a = 1;
        Integer b = 2;
        Integer c = 3;
        Integer d = 3;
        Integer e = 321;
        Integer f = 321;
        Long g = 3L;
        System.out.println(c == d);
        System.out.println(e == f);
        System.out.println(c == (a + b));
        System.out.println(c.equals(a + b));
        System.out.println(g == (a + b));
        System.out.println(g.equals(a + b));
        System.out.println(g.equals(a + h));
    }
    
}
```

你们可以先思考一下再往下翻看答案，看看能不能做对。

1.1解题思路
-------

在解这道题之前，相信很多人都已经知道了，在Java中会有一个Integer缓存池，缓存的大小是：`-128~127`

![](/images/jueJin/164f805aad1caff.png)

答案是：

*   true
*   false
*   true
*   true
*   true
*   false
*   true

简单解释一下：

*   使用`==`的情况：
    *   如果比较Integer变量，默认比较的是**地址值**。
    *   Java的Integer维护了从`-128~127`的缓存池
    *   如果比较的某一边有操作表达式(例如a+b)，那么比较的是**具体数值**
*   使用`equals()`的情况：
    *   无论是Integer还是Long中的`equals()`默认比较的是**数值**。
    *   Long的`equals()`方法，JDK的默认实现：**会判断是否是Long类型**
*   注意自动拆箱，自动装箱问题。

![](/images/jueJin/164f805aa922e0b.png)

反编译一下看看：

```

import java.io.PrintStream;

    public class Main_1 {
        public static void main(String[] paramArrayOfString) {
        Integer localInteger1 = Integer.valueOf(1);
        Integer localInteger2 = Integer.valueOf(2);
        Integer localInteger3 = Integer.valueOf(3);
        Integer localInteger4 = Integer.valueOf(3);
        Integer localInteger5 = Integer.valueOf(321);
        Integer localInteger6 = Integer.valueOf(321);
        Long localLong = Long.valueOf(3L);
        
        // 缓存池
        System.out.println(localInteger3 == localInteger4);
        
        // 超出缓存池范围
        System.out.println(localInteger5 == localInteger6);
        
        // 存在a+b数值表达式，比较的是数值
        System.out.println(localInteger3.intValue() == localInteger1.intValue() + localInteger2.intValue());
        
        // equals比较的是数值
        System.out.println(localInteger3.equals(Integer.valueOf(localInteger1.intValue() + localInteger2.intValue())));
        // 存在a+b数值表达式，比较的是数值
        System.out.println(localLong.longValue() == localInteger1.intValue() + localInteger2.intValue());
        // Long的equals()先判断传递进来的是不是Long类型，而a+b自动装箱的是Integer类型
        System.out.println(localLong.equals(Integer.valueOf(localInteger1.intValue() + localInteger2.intValue())));
        
        // ... 最后一句在这里漏掉了，大家应该可以推断出来
    }
}
```

我使用的反编译工具是`jd-gui`，如果还没有试过反编译的同学可以下载来玩玩：

*   [github.com/java-decomp…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjava-decompiler%2Fjd-gui%2Freleases "https://github.com/java-decompiler/jd-gui/releases")

二、Synchronize锁优化手段有哪些
=====================

多线程文章回顾：

*   [ThreadLocal就是这么简单](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484118%26idx%3D1%26sn%3Dda3e4c4cfd0642687c5d7bcef543fe5b%26chksm%3Debd743d7dca0cac19a82c7b29b5b22c4b902e9e53bd785d066b625b4272af2a6598a0cc0f38e%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484118&idx=1&sn=da3e4c4cfd0642687c5d7bcef543fe5b&chksm=ebd743d7dca0cac19a82c7b29b5b22c4b902e9e53bd785d066b625b4272af2a6598a0cc0f38e#rd")
*   [多线程三分钟就可以入个门了！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484186%26idx%3D1%26sn%3D2a7b937e6d3b1623aceac199d3e402f9%26chksm%3Debd7421bdca0cb0d6206db8c7f063c884c3f0b285975c8e896fde424660b4ccb88da1549f32c%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484186&idx=1&sn=2a7b937e6d3b1623aceac199d3e402f9&chksm=ebd7421bdca0cb0d6206db8c7f063c884c3f0b285975c8e896fde424660b4ccb88da1549f32c#rd")
*   [Thread源码剖析](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484190%26idx%3D1%26sn%3Dab7301e393aa7762be9ef80d30c5fb7a%26chksm%3Debd7421fdca0cb09f4a880064a8610416df414ea25284e6d5142ea659e4e7e669632cfed4050%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484190&idx=1&sn=ab7301e393aa7762be9ef80d30c5fb7a&chksm=ebd7421fdca0cb09f4a880064a8610416df414ea25284e6d5142ea659e4e7e669632cfed4050#rd")
*   [多线程基础必要知识点！看了学习多线程事半功倍](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484194%26idx%3D1%26sn%3Ded1241fcba5d3e85b6d900d8667f04f6%26chksm%3Debd74223dca0cb35fe16a267c88ac9e5159825b27c278fb165a8c50d681e1340b73cfd69ae0d%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484194&idx=1&sn=ed1241fcba5d3e85b6d900d8667f04f6&chksm=ebd74223dca0cb35fe16a267c88ac9e5159825b27c278fb165a8c50d681e1340b73cfd69ae0d#rd")
*   [Java锁机制了解一下](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484198%26idx%3D1%26sn%3D4d8e372165bb49987a6243f17153a9b4%26chksm%3Debd74227dca0cb31311886f835092c9360d08a9f0a249ece34d4b1e49a31c9ec773fa66c8acc%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484198&idx=1&sn=4d8e372165bb49987a6243f17153a9b4&chksm=ebd74227dca0cb31311886f835092c9360d08a9f0a249ece34d4b1e49a31c9ec773fa66c8acc#rd")
*   [AQS简简单单过一遍](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484202%26idx%3D1%26sn%3Ddbf9e94d2486ee0baa43e043a2363231%26chksm%3Debd7422bdca0cb3dc0451e09d139b72558b1cfa3593a6bcc1716ae9d1bd443804d194a303985%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484202&idx=1&sn=dbf9e94d2486ee0baa43e043a2363231&chksm=ebd7422bdca0cb3dc0451e09d139b72558b1cfa3593a6bcc1716ae9d1bd443804d194a303985#rd")
*   [Lock锁子类了解一下](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484206%26idx%3D1%26sn%3D9722748c0308b3e56220be1c9d939ad7%26chksm%3Debd7422fdca0cb39ac7825e565ac4e7ed7fd77638da1a931f916d3b6c06ef50beb5c085510bf%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484206&idx=1&sn=9722748c0308b3e56220be1c9d939ad7&chksm=ebd7422fdca0cb39ac7825e565ac4e7ed7fd77638da1a931f916d3b6c06ef50beb5c085510bf#rd")
*   [线程池你真不来了解一下吗？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484214%26idx%3D1%26sn%3D9b5c977e0f8329b2bf4c29d230c678fb%26chksm%3Debd74237dca0cb212f4505935f9905858b9166beddd4603c3d3b5386b5dd8cf240c460a8e7c4%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484214&idx=1&sn=9b5c977e0f8329b2bf4c29d230c678fb&chksm=ebd74237dca0cb212f4505935f9905858b9166beddd4603c3d3b5386b5dd8cf240c460a8e7c4#rd")
*   [多线程之死锁就是这么简单](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484218%26idx%3D1%26sn%3D5e5d7859627ed2c30ee517cb64e0a930%26chksm%3Debd7423bdca0cb2d55528781e9d3d12cfb94bc566946069293d1fad3c788a7e617879ba66b9e%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484218&idx=1&sn=5e5d7859627ed2c30ee517cb64e0a930&chksm=ebd7423bdca0cb2d55528781e9d3d12cfb94bc566946069293d1fad3c788a7e617879ba66b9e#rd")
*   [Java多线程打辅助的三个小伙子](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484296%26idx%3D1%26sn%3D6bc82072500dda2798f567f1442f25ab%26chksm%3Debd74289dca0cb9fece89bedeede895b6058c46289b05b918ef5115b3204fbef2e38ac47d7b3%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484296&idx=1&sn=6bc82072500dda2798f567f1442f25ab&chksm=ebd74289dca0cb9fece89bedeede895b6058c46289b05b918ef5115b3204fbef2e38ac47d7b3#rd")

之前在写多线程文章的时候，简单说了一下synchronized锁在jdk1.6以后会有各种的优化：适应自旋锁，锁消除，锁粗化，轻量级锁，偏向锁。

![](/images/jueJin/164f805aac3f5b0.png)

本以为这些优化是非常难以理解的东西，其实不然~~~简单了解一下还是很好理解的。

2.1适应自旋锁
--------

锁竞争是kernal mode下的，会经过user mode(用户态)到kernal mode(内核态) 的**切换**，是比较花时间的。

**自旋锁**出现的原因是人们发现大多数时候**锁的占用只会持续很短的时间**，甚至低于切换到kernal mode所花的时间，所以在进入kernal mode前让线程等待有限的时间，如果在此时间内能够获取到锁就**避免了很多无谓的时间**，若不能则再进入kernal mode竞争锁。

在JDK 1.6中引入了自适应的自旋锁，说明**自旋的时间不固定，要不要自旋变得越来越聪明**。

自旋锁在JDK1.4.2中就已经引入，只不过默认是关闭的，可以使用`-XX：+UseSpinning`参数来开启，在JDK1.6中就已经改为**默认**开启了。

参考资料：

*   自旋锁和使线程休眠的非自旋锁各有什么适用场景？[www.zhihu.com/question/38…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F38857029%2Fanswer%2F78480263 "https://www.zhihu.com/question/38857029/answer/78480263")

2.2锁消除
------

如果JVM明显检测到某段代码是**线程安全**的(言外之意：无锁也是安全的)，JVM会安全地原有的锁消除掉！

比如说：

```

    public void vectorTest(){
    Vector<String> vector = new Vector<String>();
        for(int i = 0 ; i < 10 ; i++){
        vector.add(i + "");
    }
    
    System.out.println(vector);
}
```

Vector是默认加锁的，但JVM如果发现vector变量仅仅在`vectorTest()`方法中使用，那该vector是线程安全的。JVM会把vector内部加的锁去除，这个优化就叫做：锁消除。

2.3锁粗化
------

默认情况下，总是推荐将**同步块的作用范围限制得尽量小**。

但是如果一系列的连续操作都对**同一个对象反复加锁和解锁**，甚至加锁操作是出现在循环体中的，频繁地进行互斥同步操作也会导致**不必要的性能损耗**。

JVM会将加锁的范围**扩展**(粗化)，这就叫做锁粗化。

2.4轻量级锁
-------

轻量级锁能提升程序同步性能的依据是\*\*“对于绝大部分的锁，在整个同步周期内都是不存在竞争的”\*\*，这是一个经验数据。

*   如果没有竞争，轻量级锁使用**CAS操作避免了使用互斥量的开销**
*   但如果存在锁竞争，除了互斥量的开销外，还额外发生了CAS操作，因此在有竞争的情况下，轻量级锁会比传统的重量级锁更慢。

简单来说：如果发现同步周期内都是**不存在竞争**，JVM会使用**CAS操作来替代操作系统互斥量**。这个优化就被叫做轻量级锁。

2.5偏向锁
------

偏向锁就是在**无竞争的情况下把整个同步都消除掉，连CAS操作都不做了**！

> 偏向锁可以提高**带有同步但无竞争的程序性能**。它同样是一个带有效益权衡（Trade Off）性质的优化，也就是说，它并不一定总是对程序运行有利，如果程序中大多数的锁总是被多个不同的线程访问，那偏向模式就是多余的。在具体问题具体分析的前提下，有时候使用参数`-XX：-UseBiasedLocking`来禁止偏向锁优化反而可以提升性能。

2.6简单总结各种锁优化
------------

*   自适应偏向锁：自旋时间不固定
*   锁消除：如果发现代码是线程安全的，将锁去掉
*   锁粗化：加锁范围过小(重复加锁)，将加锁的范围扩展
*   轻量级锁：在无竞争的情况下**使用CAS操作去消除同步使用的互斥量**
*   偏向锁：在无竞争环境下，把整个同步都消除，CAS也不做。

参考资料：

*   [blog.csdn.net/chenssy/art…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fchenssy%2Farticle%2Fdetails%2F54883355 "https://blog.csdn.net/chenssy/article/details/54883355")

三、TCP粘包，拆包
==========

这是在看wangjingxin大佬面经的时候看到的面试题，之前对TCP粘包，拆包没什么概念，于是就简单去了解一下。

3.1什么是拆包粘包？为什么会出现？
------------------

在进行Java NIO学习时，**可能**会发现：如果客户端**连续不断**的向服务端发送数据包时，服务端接收的数据会出现两个数据包**粘在**一起的情况。

TCP的首部格式：

![](/images/jueJin/164f805aa858b51.png)

*   TCP是**基于字节流的**，虽然应用层和TCP传输层之间的数据交互是大小不等的数据块，但是TCP把这些数据块仅仅看成一连串无结构的字节流，**没有边界**；
*   从TCP的帧结构也可以看出，在TCP的首部**没有表示数据长度的字段**

基于上面两点，在使用TCP传输数据时，才有粘包或者拆包现象发生的可能。

**一个数据包中包含了发送端发送的两个数据包的信息**，这种现象即为粘包

![](/images/jueJin/164f805ae17f069.png)

接收端收到了两个数据包，但是这两个数据包**要么是不完整的，要么就是多出来一块**，这种情况即发生了拆包和粘包

![](/images/jueJin/164f805b95b653d.png)

拆包和粘包的问题导致**接收端在处理的**时候会非常困难(因为无法区分一个**完整的**数据包)

3.2解决拆包和粘包
----------

分包机制一般有两个**通用**的解决方法：

*   1,特殊字符控制
*   2,在包头首都添加数据包的长度

如果使用netty的话，就有专门的编码器和解码器解决拆包和粘包问题了。

> tips:**UDP没有粘包问题**，但是有丢包和乱序。不完整的包是不会有的，收到的都是完全正确的包。传送的数据单位协议是UDP报文或用户数据报，发送的时候既不合并，也不拆分。

参考资料

*   [blog.csdn.net/scythe666/a…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fscythe666%2Farticle%2Fdetails%2F51996268 "https://blog.csdn.net/scythe666/article/details/51996268")\--->TCP粘包，拆包及解决方法
*   [www.ideawu.net/blog/archiv…](https://link.juejin.cn?target=http%3A%2F%2Fwww.ideawu.net%2Fblog%2Farchives%2F993.html "http://www.ideawu.net/blog/archives/993.html")\--->关于TCP粘包和拆包的终极解答

四、select、poll、epoll简单区别
=======================

NIO回顾：

*   [JDK10都发布了，nio你了解多少？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484235%26idx%3D1%26sn%3D4c3b6d13335245d4de1864672ea96256%26chksm%3Debd7424adca0cb5cb26eb51bca6542ab816388cf245d071b74891dd3f598ccd825f8611ca20c%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484235&idx=1&sn=4c3b6d13335245d4de1864672ea96256&chksm=ebd7424adca0cb5cb26eb51bca6542ab816388cf245d071b74891dd3f598ccd825f8611ca20c#rd")

在Linux下它是这样子实现I/O复用模型的：

调用`select/poll/epoll`其中一个函数，传入多个文件描述符，如果有一个文件描述符就绪，则返回，否则阻塞直到超时。

这几个函数是有些区别的，可能有的面试官会问到这三个函数究竟有什么区别：

区别如下图：

![](/images/jueJin/164f805babd0d7b.png)

两句话总结：

*   `select和poll`都需要轮询每个文件描述符，`epoll`基于事件驱动，不用轮询
*   `select和poll`每次都需要拷贝文件描述符，`epoll`不用
*   `select`最大连接数受限，`epoll和poll`最大连接数不受限

> tips:epoll在内核中的实现，用红黑树管理事件块

4.1通俗例子
-------

现在3y在公司里边实习，写完的代码需要给测试测一遍。

`select/poll`情况：

*   开发在写代码，此时测试**挨个问**所有开发者，你写好程序了没有？要测试吗？

`epoll`情况：

*   开发写完代码了，告诉测试：“我写好代码了，你去测测，功能是XXX”。于是测试高高兴兴去找bug了。

其他通俗描述\[1\]：

> 一个酒吧服务员（一个线程），前面趴了一群醉汉，突然一个吼一声“倒酒”（事件），你小跑过去给他倒一杯，然后随他去吧，突然又一个要倒酒，你又过去倒上，就这样一个服务员服务好多人，有时没人喝酒，服务员处于空闲状态，可以干点别的玩玩手机。至于epoll与select，poll的区别在于后两者的场景中醉汉不说话，你要挨个问要不要酒，没时间玩手机了。io多路复用大概就是指这几个醉汉共用一个服务员。

来源：

*   [www.zhihu.com/question/32…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F32163005%2Fanswer%2F55687802 "https://www.zhihu.com/question/32163005/answer/55687802")

其他通俗描述\[2\]：

> 简单举个例子（可能也不是很形象）select/poll饭店服务员（内核）告诉饭店老板（用户程序）：”现在有客人结账“但是这个服务员没人明确告诉老板，哪几桌的客人结帐。老板得自儿一个一个桌子去问：请问是你要结帐？epoll饭店服务员（内核）告诉饭店老板（用户程序）：”1,2,5号客人结账“老板就可以直接去1,2,5号桌收钱了

来源：

*   [www.zhihu.com/question/21…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F21233763%2Fanswer%2F23837166 "https://www.zhihu.com/question/21233763/answer/23837166")

深入了解参考资料：

*   [www.cnblogs.com/Anker/p/326…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2FAnker%2Fp%2F3265058.html "https://www.cnblogs.com/Anker/p/3265058.html")\--->select、poll、epoll之间的区别总结\[整理\]

五、Java内存模型
==========

JVM博文回顾：

*   [JVM如何从入门到放弃的？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484287%26idx%3D1%26sn%3D89b9af9c1fe60ec30bf15ced34abbcce%26chksm%3Debd7427edca0cb6866a94a11d0b9833c496fdf7cc7aeaaa555f4f2be784e2623c528530a0997%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484287&idx=1&sn=89b9af9c1fe60ec30bf15ced34abbcce&chksm=ebd7427edca0cb6866a94a11d0b9833c496fdf7cc7aeaaa555f4f2be784e2623c528530a0997#rd")

之前在写JVM的时候，还一度把**JVM内存结构与Java内存模型**给搞混了~~~还好有热心的网友给我指出来。

JVM内存结构：

![](/images/jueJin/164f805bd434943.png)

Java内存模型：

![](/images/jueJin/164f805bd17b2b0.png)

操作变量时的规则：

*   Java内存模型规定了所有的**变量都存储在主内存**
*   线程的**工作内存**中保存了被该线程使用到的变量的主内存**副本拷贝**
*   线程对变量的所有**操作**（读取、赋值等）都必须在**工作内存中进行**，而不能直接读写主内存中的变量

从**工作内存同步回主内存**实现是通过以下的8种操作来完成：

*   lock（锁定）：作用于主内存的变量，把一个变量标识为一条线程独占状态。
*   unlock（解锁）：作用于主内存变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
*   read（读取）：作用于主内存变量，把一个变量值从主内存传输到线程的工作内存中，以便随后的load动作使用
*   load（载入）：作用于工作内存的变量，它把read操作从主内存中得到的变量值放入工作内存的变量副本中。
*   use（使用）：作用于工作内存的变量，把工作内存中的一个变量值传递给执行引擎，每当虚拟机遇到一个需要使用变量的值的字节码指令时将会执行这个操作。
*   assign（赋值）：作用于工作内存的变量，它把一个从执行引擎接收到的值赋值给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作。
*   store（存储）：作用于工作内存的变量，把工作内存中的一个变量的值传送到主内存中，以便随后的write的操作。
*   write（写入）：作用于主内存的变量，它把store操作从工作内存中一个变量的值传送到主内存的变量中。

Java内存模型是围绕着在并发过程中**如何处理原子性、可见性和有序性**这3个特征来建立的

保证原子性的操作：

*   `read、load、assign、use、store和write`
*   synchronized锁

保证有序性(重排序导致无序)的操作：

*   volatile
*   synchronized锁

保证可见性：

*   volatile
*   synchronized锁
*   final

在上面也说了，有序性可以通过volatile和synchronized锁来保证，但我们一般写程序的时候**不会总是关注代码的有序性**的。其实，我们Java内部中有一个原则，叫做**先行发生原则**(happens-before)

*   “先行发生”（happens-before）原则可以通过：几条**规则**一揽子地解决并发环境下两个操作之间**是否可能存在冲突**的所有问题
*   有了这些规则，并且我们的**操作是在这些规则定义的范围之内**。我们就可以确保，A操作肯定比B操作先发生(不会出现重排序的问题)

“先行发生”（happens-before）原则有下面这么几条：

*   程序次序规则（Program Order Rule）：在一个线程内，按照程序代码顺序，书写在前面的操作先行发生于书写在后面的操作。准确地说，应该是控制流顺序而不是程序代码顺序，因为要考虑分支、循环等结构。
*   管程锁定规则（Monitor Lock Rule）：一个unlock操作先行发生于后面对同一个锁的lock操作。这里必须强调的是同一个锁，而“后面”是指时间上的先后顺序。
*   volatile变量规则（Volatile Variable Rule）：对一个volatile变量的写操作先行发生于后面对这个变量的读操作，这里的“后面”同样是指时间上的先后顺序。线程启动规则（Thread Start Rule）：Thread对象的start（）方法先行发生于此线程的每一个动作。
*   线程终止规则（Thread Termination Rule）：线程中的所有操作都先行发生于对此线程的终止检测，我们可以通过Thread.join（）方法结束、Thread.isAlive（）的返回值等手段检测到线程已经终止执行。
*   线程中断规则（Thread Interruption Rule）：对线程interrupt（）方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过Thread.interrupted（）方法检测到是否有中断发生。
*   对象终结规则（Finalizer Rule）：一个对象的初始化完成（构造函数执行结束）先行发生于它的finalize（）方法的开始。
*   传递性（Transitivity）：如果操作A先行发生于操作B，操作B先行发生于操作C，那就可以得出操作A先行发生于操作C的结论。

参考资料：

*   【深入理解JVM】：Java内存模型JMM：[blog.csdn.net/u011080472/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fu011080472%2Farticle%2Fdetails%2F51337422 "https://blog.csdn.net/u011080472/article/details/51337422")
*   Java的内存模型（1）:[www.cnblogs.com/jian0110/p/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fjian0110%2Fp%2F9351281.html "https://www.cnblogs.com/jian0110/p/9351281.html")

六、最后
====

本文简单整理了一下在学习中做的笔记，还有在网上遇到一些比较重要的知识点(面试题)~希望大家看完能有所收益。

参考资料：

*   《深入理解Java虚拟机——JVM高级特性与最佳实践(第2版)》

如果大家有更好的理解方式或者文章有错误的地方还请大家不吝在评论区留言，大家互相学习交流~~~

> 如果想看更多的**原创**技术文章，欢迎大家关注我的**微信公众号:Java3y**。公众号还有**海量的视频资源**哦，关注即可免费领取。

可能感兴趣的链接：

*   **文章的目录导航(微信公众号端)**：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")
*   **文章的目录导航(PC端)**：[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fpcduan-wen-zhang-dao-hang "http://www.zhongfucheng.bitcron.com/post/shou-ji/pcduan-wen-zhang-dao-hang")
*   **海量精美脑图：**[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fnao-tu-da-quan "http://www.zhongfucheng.bitcron.com/post/shou-ji/nao-tu-da-quan")