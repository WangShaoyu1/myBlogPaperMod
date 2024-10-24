---
author: "Java3y"
title: "深入浅出Java内存模型"
date: 2021-10-27
description: "面试官：我记得上一次已经问过了为什么要有Java内存模型 面试官：我记得你的最终答案是：Java为了屏蔽硬件和操作系统访问内存的各种差异，提出了「Java内存模型」的规范，保证了Java程序在各种平台"
tags: ["后端","Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:49,comments:3,collects:48,views:7285,"
---
**面试官**：我记得上一次已经问过了为什么要有Java内存模型

**面试官**：我记得你的最终答案是：Java为了屏蔽硬件和操作系统访问内存的各种差异，提出了「Java内存模型」的规范，保证了Java程序在各种平台下对内存的访问都能得到一致效果

**候选者**：嗯，对的

**面试官**：**要不，你今天再来讲讲Java内存模型这里边的内容呗？**

**候选者**：嗯，在讲之前还是得强调下：Java内存模型它是一种「规范」，Java虚拟机会实现这个规范。

**候选者**：Java内存模型主要的内容，我个人觉得有以下几块吧

**候选者**：1. Java内存模型的抽象结构

**候选者**：2. happen-before规则

**候选者**：3.对volatile内存语义的探讨（这块我后面再好好解释）

[![](/images/jueJin/74daf3ca643e4c0.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv440eny7j60ko0iigny02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv440eny7j60ko0iigny02.jpg")

**面试官**：**那要不你就从第一点开始呗？先聊下Java内存模型的抽象结构？**

**候选者**：嗯。Java内存模型定义了：Java线程对内存数据进行交互的规范。

**候选者**：线程之间的「共享变量」存储在「主内存」中，每个线程都有自己私有的「本地内存」，「本地内存」存储了该线程以读/写共享变量的副本。

**候选者**：本地内存是Java内存模型的抽象概念，并不是真实存在的。

**候选者**：顺便画个图吧，看完图就懂了。

[![](/images/jueJin/9ec2067e125c4dd.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs1g0xg9gfj31ju0u0wus.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs1g0xg9gfj31ju0u0wus.jpg")

**候选者**：Java内存模型规定了：线程对变量的所有操作都必须在「本地内存」进行，「不能直接读写主内存」的变量

**候选者**：Java内存模型定义了8种操作来完成「变量如何从主内存到本地内存，以及变量如何从本地内存到主内存」

**候选者**：分别是read/load/use/assign/store/write/lock/unlock操作

**候选者**：看着8个操作很多，对变量的一次读写就涵盖了这些操作了，我再画个图给你讲讲

[![](/images/jueJin/48a82300c5f9479.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gs99k2g1muj315i0u0e3n.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gs99k2g1muj315i0u0e3n.jpg")

**候选者**：懂了吧？无非就是读写用到了各个操作（：

**面试官**：**懂了，很简单，接下来说什么是happen-before吧？**

**候选者**：嗯，好的（：

**候选者**：按我的理解下，happen-before实际上也是一套「规则」。Java内存模型定义了这套规则，目的是为了阐述「操作之间」的内存「可见性」

**候选者**：从上次讲述「指令重排」就提到了，在CPU和编译器层面上都有指令重排的问题。

**候选者**：指令重排虽然是能提高运行的效率，但在并发编程中，我们在兼顾「效率」的前提下，还希望「程序结果」能由我们掌控的。

**候选者**：说白了就是：在某些重要的场景下，这一组操作都不能进行重排序，「前面一个操作的结果对后续操作必须是可见的」。

[![](/images/jueJin/1789e7fed45b4e9.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv46n36m3j60oe0eutbd02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv46n36m3j60oe0eutbd02.jpg")

**面试官**：嗯…

**候选者**：于是，Java内存模型就提出了happen-before这套规则，规则总共有8条

**候选者**：比如传递性、volatile变量规则、程序顺序规则、监视器锁的规则…（具体看规则的含义就好了，这块不难）

**候选者**：只要记住，有了happen-before这些规则。我们写的代码只要在这些规则下，前一个操作的结果对后续操作是可见的，是不会发生重排序的。

**面试官**：我明白你的意思了

**面试官**：**那最后说下volatile？**

**候选者**：嗯，volatile是Java的一个关键字

**候选者**：为什么讲Java内存模型往往就会讲到volatile这个关键字呢，我觉得主要是它的特性：可见性和有序性(禁止重排序)

**候选者**：Java内存模型这个规范，很大程度下就是为了解决可见性和有序性的问题。

[![](/images/jueJin/ab84fb1fad5245e.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv49ms4ubj60mu0a4wfk02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv49ms4ubj60mu0a4wfk02.jpg")

**面试官**：**那你来讲讲它的原理吧，volatile这个关键字是怎么做到可见性和有序性的**

**候选者**：Java内存模型为了实现volatile有序性和可见性，定义了4种内存屏障的「规范」，分别是LoadLoad/LoadStore/StoreLoad/StoreStore

**候选者**：回到volatile上，说白了，就是在volatile「前后」加上「内存屏障」，使得编译器和CPU无法进行重排序，致使有序，并且写volatile变量对其他线程可见。

**候选者**：Java内存模型定义了规范，那Java虚拟机就得实现啊，是不是？

**面试官**：嗯…

**候选者**：之前看过Hotspot虚拟机的实现，在「汇编」层面上实际是通过Lock前缀指令来实现的，而不是各种fence指令（主要原因就是简便。因为大部分平台都支持lock指令，而fence指令是x86平台的）。

**候选者**：lock指令能保证：禁止CPU和编译器的重排序（保证了有序性）、保证CPU写核心的指令可以立即生效且其他核心的缓存数据失效（保证了可见性）。

[![](/images/jueJin/7de6153aa13f4f9.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv4c0yx9wj61lu0h4tcp02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv4c0yx9wj61lu0h4tcp02.jpg")

**面试官**：**那你提到这了，我想问问volatile和MESI协议是啥关系？**

**候选者**：它们没有直接的关联。

**候选者**：Java内存模型关注的是编程语言层面上，它是高维度的抽象。MESI是CPU缓存一致性协议，不同的CPU架构都不一样，可能有的CPU压根就没用MESI协议…

**候选者**：只不过MESI名声大，大家就都拿他来举例子了。而MESI可能只是在「特定的场景下」为实现volatile的可见性/有序性而使用到的一部分罢了（：

**面试官**：嗯…

**候选者**：为了让Java程序员屏蔽上面这些底层知识，快速地入门使用volatile变量

**候选者**：Java内存模型的happen-before规则中就有对volatile变量规则的定义

**候选者**：这条规则的内容其实就是：对一个 volatile 变量的写操作相对于后续对这个 volatile 变量的读操作可见

**候选者**：它通过happen-before规则来规定：只要变量声明了volatile 关键字，写后再读，读必须可见写的值。（可见性、有序性）

**面试官**：嗯…了解了

**本文总结**：

*   **为什么存在Java内存模型**：Java为了屏蔽硬件和操作系统访问内存的各种差异，提出了「Java内存模型」的规范，保证了Java程序在各种平台下对内存的访问都能得到一致效果
*   **Java内存模型抽象结构**：线程之间的「共享变量」存储在「主内存」中，每个线程都有自己私有的「本地内存」，「本地内存」存储了该线程以读/写共享变量的副本。线程对变量的所有操作都必须在「本地内存」进行，而「不能直接读写主内存」的变量
*   **happen-before规则**：Java内存模型规定在某些场景下（一共8条），前面一个操作的结果对后续操作必须是可见的。这8条规则成为happen-before规则
*   **volatile**：volatile是Java的关键字，修饰的变量是可见性且有序的（不会被重排序）。可见性由happen-before规则完成，有序性由Java内存模型定义的「内存屏障」完成，实际HotSpot虚拟机实现Java内存模型规范，汇编底层通过Lock指令来实现。

[![](/images/jueJin/67f6812f0bc84ba.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtm8mnqvn7j61400midi102.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtm8mnqvn7j61400midi102.jpg")

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试，对线面试官系列持续更新中！

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**