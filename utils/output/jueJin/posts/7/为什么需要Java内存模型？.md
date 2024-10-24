---
author: "Java3y"
title: "为什么需要Java内存模型？"
date: 2021-10-14
description: "面试官：今天想跟你聊聊Java内存模型，这块你了解过吗？ 候选者：嗯，我简单说下我的理解吧。那我就从为什么要有Java内存模型开始讲起吧 面试官：开始你的表演吧。 候选者：那我先说下背景吧 候选者：1"
tags: ["后端","Java","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:71,comments:13,collects:72,views:11489,"
---
**面试官**：**今天想跟你聊聊Java内存模型，这块你了解过吗？**

**候选者**：嗯，我简单说下我的理解吧。那我就从为什么要有Java内存模型开始讲起吧

**面试官**：开始你的表演吧。

**候选者**：那我先说下背景吧

**候选者**：1. 现有计算机往往是多核的，每个核心下会有高速缓存。高速缓存的诞生是由于「CPU与内存(主存)的速度存在差异」，L1和L2缓存一般是「每个核心独占」一份的。

**候选者**：2. 为了让CPU提高运算效率，处理器可能会对输入的代码进行「乱序执行」，也就是所谓的「指令重排序」

**候选者**：3. 一次对数值的修改操作往往是非原子性的（比如i++实际上在计算机执行时就会分成多个指令）

**候选者**：在永远单线程下，上面所讲的均不会存在什么问题，因为单线程意味着无并发。并且在单线程下，编译器/runtime/处理器都必须遵守as-if-serial语义，遵守as-if-serial意味着它们不会对「数据依赖关系的操作」做重排序。

[![](/images/jueJin/5bdfdf8a0355404.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtt9cswjnrj6118078my802.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtt9cswjnrj6118078my802.jpg")

**候选者**：CPU为了效率，有了高速缓存、有了指令重排序等等，整块架构都变得复杂了。我们写的程序肯定也想要「充分」利用CPU的资源啊！于是乎，我们使用起了多线程

**候选者**：多线程在意味着并发，并发就意味着我们需要考虑线程安全问题

**候选者**：1. 缓存数据不一致：多个线程同时修改「共享变量」，CPU核心下的高速缓存是「不共享」的，那多个cache与内存之间的数据同步该怎么做？

**候选者**：2. CPU指令重排序在多线程下会导致代码在非预期下执行，最终会导致结果存在错误的情况。

[![](/images/jueJin/55a77fcb4e5d4d8.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtt9ep8aqvj612k0ion1c02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtt9ep8aqvj612k0ion1c02.jpg")

**候选者**：针对于「缓存不一致」问题，CPU也有其解决办法，常被大家所认识的有两种：

**候选者**：1.使用「总线锁」：某个核心在修改数据的过程中，其他核心均无法修改内存中的数据。（类似于独占内存的概念，只要有CPU在修改，那别的CPU就得等待当前CPU释放）

**候选者**：2.缓存一致性协议（MESI协议，其实协议有很多，只是举个大家都可能见过的）。MESI拆开英文是（Modified （修改状态）、Exclusive （独占状态）、Share（共享状态）、Invalid（无效状态））

**候选者**：缓存一致性协议我认为可以理解为「缓存锁」，它针对的是「缓存行」(Cache line) 进行”加锁”，所谓「缓存行」其实就是 高速缓存 存储的最小单位。

[![](/images/jueJin/dd3e5ff7e8724ae.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtui35nzf9j60qk09sdgs02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtui35nzf9j60qk09sdgs02.jpg")

**面试官**：嗯…

**候选者**：MESI协议的原理大概就是：当每个CPU读取共享变量之前，会先识别数据的「对象状态」(是修改、还是共享、还是独占、还是无效)。

**候选者**：如果是独占，说明当前CPU将要得到的变量数据是最新的，没有被其他CPU所同时读取

**候选者**：如果是共享，说明当前CPU将要得到的变量数据还是最新的，有其他的CPU在同时读取，但还没被修改

**候选者**：如果是修改，说明当前CPU正在修改该变量的值，同时会向其他CPU发送该数据状态为invalid(无效)的通知，得到其他CPU响应后（其他CPU将数据状态从共享(share)变成invalid(无效)），会当前CPU将高速缓存的数据写到主存，并把自己的状态从modify(修改)变成exclusive(独占)

**候选者**：如果是无效，说明当前数据是被改过了，需要从主存重新读取最新的数据。

[![](/images/jueJin/64fbb9d1f8ba472.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtuigrk9vvj60qc09qabk02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtuigrk9vvj60qc09qabk02.jpg")

**候选者**：其实MESI协议做的就是判断「对象状态」，根据「对象状态」做不同的策略。关键就在于某个CPU在对数据进行修改时，需要「同步」通知其他CPU，表示这个数据被我修改了，你们不能用了。

**候选者**：比较于「总线锁」，MESI协议的”锁粒度”更小了，性能那肯定会更高咯

**面试官**：**但据我了解，CPU还有优化，你还知道吗？**

**候选者**：嗯，还是了解那么一点点的。

**候选者**：从前面讲到的，可以发现的是：当CPU修改数据时，需要「同步」告诉其他的CPU，等待其他CPU响应接收到invalid(无效)后，它才能将高速缓存数据写到主存。

**候选者**：同步，意味着等待，等待意味着什么都干不了。CPU肯定不乐意啊，所以又优化了一把。

**候选者**：优化思路就是从「同步」变成「异步」。

**候选者**：在修改时会「同步」告诉其他CPU，而现在则把最新修改的值写到「store buffer」中，并通知其他CPU记得要改状态，随后CPU就直接返回干其他事了。等到收到其它CPU发过来的响应消息，再将数据更新到高速缓存中。

**候选者**：其他CPU接收到invalid(无效)通知时，也会把接收到的消息放入「invalid queue」中，只要写到「invalid queue」就会直接返回告诉修改数据的CPU已经将状态置为「invalid」

[![](/images/jueJin/97c826ecf9b94c3.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv3t52ts2j60t20baab202.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv3t52ts2j60t20baab202.jpg")

**候选者**：而异步又会带来新问题：那我现在CPU修改完A值，写到「store buffer」了，CPU就可以干其他事了。那如果该CPU又接收指令需要修改A值，但上一次修改的值还在「store buffer」中呢，没修改至高速缓存呢。

**候选者**：所以CPU在读取的时候，需要去「store buffer」看看存不存在，存在则直接取，不存在才读主存的数据。【Store Forwarding】

**候选者**：好了，解决掉第一个异步带来的问题了。（相同的核心对数据进行读写，由于异步，很可能会导致第二次读取的还是旧值，所以首先读「store buffer」。

**面试官**：**还有其他？**

**候选者**：那当然啊，那「异步化」会导致相同核心读写共享变量有问题，那当然也会导致「不同」核心读写共享变量有问题啊

**候选者**：CPU1修改了A值，已把修改后值写到「store buffer」并通知CPU2对该值进行invalid(无效)操作，而CPU2可能还没收到invalid(无效)通知，就去做了其他的操作，导致CPU2读到的还是旧值。

**候选者**：即便CPU2收到了invalid(无效)通知，但CPU1的值还没写到主存，那CPU2再次向主存读取的时候，还是旧值…

**候选者**：变量之间很多时候是具有「相关性」(a=1;b=0;b=a)，这对于CPU又是无感知的…

**候选者**：总体而言，由于CPU对「缓存一致性协议」进行的异步优化「store buffer」「invalid queue」，很可能导致后面的指令很可能查不到前面指令的执行结果（各个指令的执行顺序非代码执行顺序），这种现象很多时候被称作「CPU乱序执行」

**候选者**：为了解决乱序问题（也可以理解为可见性问题，修改完没有及时同步到其他的CPU），又引出了「内存屏障」的概念。

[![](/images/jueJin/02b82186beab499.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv3twpklaj60po0ekwfw02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv3twpklaj60po0ekwfw02.jpg")

**面试官**：嗯…

**候选者**：「内存屏障」其实就是为了解决「异步优化」导致「CPU乱序执行」/「缓存不及时可见」的问题，那怎么解决的呢？嗯，就是把「异步优化」给”禁用“掉（：

**候选者**：内存屏障可以分为三种类型：写屏障，读屏障以及全能屏障（包含了读写屏障），屏障可以简单理解为：在操作数据的时候，往数据插入一条”特殊的指令”。只要遇到这条指令，那前面的操作都得「完成」。

**候选者**：那写屏障就可以这样理解：CPU当发现写屏障的指令时，会把该指令「之前」存在于「store Buffer」所有写指令刷入高速缓存。

**候选者**：通过这种方式就可以让CPU修改的数据可以马上暴露给其他CPU，达到「写操作」可见性的效果。

**候选者**：那读屏障也是类似的：CPU当发现读屏障的指令时，会把该指令「之前」存在于「invalid queue」所有的指令都处理掉

**候选者**：通过这种方式就可以确保当前CPU的缓存状态是准确的，达到「读操作」一定是读取最新的效果。

[![](/images/jueJin/c3e5103fa60240a.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv3vfcw4kj60ro0dwt9o02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv3vfcw4kj60ro0dwt9o02.jpg")

**候选者**：由于不同CPU架构的缓存体系不一样、缓存一致性协议不一样、重排序的策略不一样、所提供的内存屏障指令也有差异，为了简化Java开发人员的工作。Java封装了一套规范，这套规范就是「Java内存模型」

**候选者**：再详细地说，「Java内存模型」希望 屏蔽各种硬件和操作系统的访问差异，保证了Java程序在各种平台下对内存的访问都能得到一致效果。目的是解决多线程存在的原子性、可见性（缓存一致性）以及有序性问题。

[![](/images/jueJin/5a5b60da1304490.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtv3z24z57j60sq0ew76202.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtv3z24z57j60sq0ew76202.jpg")

**面试官**：**那要不简单聊聊Java内存模型的规范和内容吧？**

**候选者**：不了，怕一聊就是一个下午，下次吧？

**本文总结**：

*   并发问题产生的三大根源是「可见性」「有序性」「原子性」
    
*   可见性：CPU架构下存在高速缓存，每个核心下的L1/L2高速缓存不共享（不可见）
    
*   有序性：主要有三方面可能导致打破
    
    *   编译器优化导致重排序（编译器可以在不改变单线程程序语义的情况下，可以对代码语句顺序进行调整重新排序）
    *   指令集并行重排序（CPU原生就有可能将指令进行重排）
    *   内存系统重排序（CPU架构下很可能有store buffer /invalid queue 缓冲区，这种「异步」很可能会导致指令重排）
*   原子性：Java的一条语句往往需要多条 CPU 指令完成(i++)，由于操作系统的线程切换很可能导致 i++ 操作未完成，其他线程“中途”操作了共享变量 i ，导致最终结果并非我们所期待的。
    
*   在CPU层级下，为了解决「缓存一致性」问题，有相关的“锁”来保证，比如“总线锁”和“缓存锁”。
    
    *   总线锁是锁总线，对共享变量的修改在相同的时刻只允许一个CPU操作。
    *   缓存锁是锁缓存行(cache line)，其中比较出名的是MESI协议，对缓存行标记状态，通过“同步通知”的方式，来实现(缓存行)数据的可见性和有序性
    *   但“同步通知”会影响性能，所以会有内存缓冲区(store buffer/invalid queue)来实现「异步」进而提高CPU的工作效率
    *   引入了内存缓冲区后，又会存在「可见性」和「有序性」的问题，平日大多数情况下是可以享受「异步」带来的好处的，但少数情况下，需要强「可见性」和「有序性」，只能”禁用”缓存的优化。
    *   “禁用”缓存优化在CPU层面下有「内存屏障」，读屏障/写屏障/全能屏障，本质上是插入一条”屏障指令”，使得缓冲区(store buffer/invalid queue)在屏障指令之前的操作均已被处理，进而达到 读写 在CPU层面上是可见和有序的。
*   不同的CPU实现的架构和优化均不一样，Java为了屏蔽硬件和操作系统访问内存的各种差异，提出了「Java内存模型」的规范，保证了Java程序在各种平台下对内存的访问都能得到一致效果
    

[![](/images/jueJin/f9b8249224234fd.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtm73doselj61400miaby02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtm73doselj61400miaby02.jpg")

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试，对线面试官系列持续更新中！

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**