---
author: "Java3y"
title: "稳了！我准备了1个晚上的CMS垃圾收集器"
date: 2021-11-09
description: "面试官：今天还是来聊聊CMS垃圾收集器呗？ 候选者：嗯啊… 候选者：如果用Seria和Parallel系列的垃圾收集器：在垃圾回收的时，用户线程都会完全停止，直至垃圾回收结束！ 候选者：CMS的全称："
tags: ["后端","Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:41,comments:3,collects:63,views:7689,"
---
**面试官**：**今天还是来聊聊CMS垃圾收集器呗？**

**候选者**：嗯啊…

**候选者**：如果用Seria和Parallel系列的垃圾收集器：在垃圾回收的时，用户线程都会完全停止，直至垃圾回收结束！

[![](/images/jueJin/6050a2103a01429.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsl6dczaygj30qi0tmdip.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsl6dczaygj30qi0tmdip.jpg")**候选者**：CMS的全称：Concurrent Mark Sweep，翻译过来是「并发标记清除」

**候选者**：用CMS对比上面的垃圾收集器(Seria和Parallel和parNew)：它最大的不同点就是「并发」：在GC线程工作的时候，用户线程「不会完全停止」，用户线程在「部分场景下」与GC线程一起并发执行。

**候选者**：但是，要理解的是，无论是什么垃圾收集器，Stop The World是一定无法避免的！

**候选者**：CMS只是在「部分」的GC场景下可以让GC线程与用户线程并发执行

**候选者**：CMS的设计目标是为了避免「老年代 GC」出现「长时间」的卡顿（Stop The World）

[![](/images/jueJin/20be63b78ea244d.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtvor6oo8dj60re06gwfk02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtvor6oo8dj60re06gwfk02.jpg")

**面试官**：**那你清楚CMS的工作流程吗？**

**候选者**：只了解一点点，不能多了。

**候选者**：CMS可以简单分为5个步骤：初始标记、并发标记、并发预清理、重新标记以及并发清除

**候选者**：从步骤就不难看出，CMS主要是实现了「标记清除」垃圾回收算法

**面试官**：嗯…是的

**候选者**：我就从「初始标记」来开始吧

**候选者**：「初始标记」会标记GCRoots「直接关联」的对象以及「年轻代」指向「老年代」的对象

**候选者**：「初始标记」这个过程是会发生Stop The World的。但这个阶段的速度算是很快的，因为没有「向下追溯」（只标记一层）

[![](/images/jueJin/f72d37274f2d487.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsm40eftqoj31ec0oi7cv.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsm40eftqoj31ec0oi7cv.jpg")

**候选者**：在「初始标记」完了之后，就进入了「并发标记」阶段啦

**候选者**：「并发标记」这个过程是不会停止用户线程的（不会发生 Stop The World）。这一阶段主要是从GC Roots向下「追溯」，标记所有可达的对象。

**候选者**：「并发标记」在GC的角度而言，是比较耗费时间的（需要追溯）

[![](/images/jueJin/a50ecdea4efe46a.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsm40366ztj31f00o8k0g.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsm40366ztj31f00o8k0g.jpg")

**候选者**：「并发标记」这个阶段完成之后，就到了「并发预处理」阶段啦

**候选者**：「并发预处理」这个阶段主要想干的事情：希望能减少下一个阶段「重新标记」所消耗的时间

**候选者**：因为下一个阶段「重新标记」是需要Stop The World的

**面试官**：嗯…

**候选者**：「并发标记」这个阶段由于用户线程是没有被挂起的，所以对象是有可能发生变化的

**候选者**： 可能有些对象，从新生代晋升到了老年代。可能有些对象，直接分配到了老年代（大对象）。可能老年代或者新生代的对象引用发生了变化…

**面试官**：**那这个问题，怎么解决呢？**

**候选者**：针对老年代的对象，其实还是可以借助类card table的存储（将老年代对象发生变化所对应的卡页标记为dirty）

**候选者**：所以「并发预处理」这个阶段会扫描可能由于「并发标记」时导致老年代发生变化的对象，会再扫描一遍标记为dirty的卡页

**面试官**：嗯…

**候选者**：对于新生代的对象，我们还是得遍历新生代来看看在「并发标记」过程中有没有对象引用了老年代..

**候选者**：不过JVM里给我们提供了很多「参数」，有可能在这个过程中会触发一次 minor GC（触发了minor GC 是意味着就可以更少地遍历新生代的对象）

[![](/images/jueJin/8fb44ec1721b4d9.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsm4es0t9vj31m00r0tjy.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsm4es0t9vj31m00r0tjy.jpg")

**候选者**：「并发预处理」这个阶段阶段结束后，就到了「重新标记」阶段

**候选者**：「重新标记」阶段会Stop The World，这个过程的停顿时间其实很大程度上取决于上面「并发预处理」阶段（可以发现，这是一个追赶的过程：一边在标记存活对象，一边用户线程在执行产生垃圾）

[![](/images/jueJin/c4ae1b4231d444d.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsm4mglbrcj31ls0py47v.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsm4mglbrcj31ls0py47v.jpg")

**候选者**：最后就是「并发清除」阶段，不会Stop The World

**候选者**：一边用户线程在执行，一边GC线程在回收不可达的对象

**候选者**：这个过程，还是有可能用户线程在不断产生垃圾，但只能留到下一次GC 进行处理了，产生的这些垃圾被叫做“浮动垃圾”

**候选者**：完了以后会重置 CMS 算法相关的内部数据，为下一次 GC 循环做准备

[![](/images/jueJin/7fc8672a3229474.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsm4pj0fc6j31n40re13a.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsm4pj0fc6j31n40re13a.jpg")

**面试官**：嗯，CMS的回收过程，我了解了

**面试官**：**听下来，其实就是把垃圾回收的过程给”细分”了，然后在某些阶段可以不停止用户线程，一边回收垃圾，一边处理请求，来减少每次垃圾回收时 Stop The World的时间**

**面试官**：当然啦，中间也做了很多的优化（dirty card标记、可能中途触发minor gc等等，在我理解下，这些应该都提供了CMS的相关参数配置）

**面试官**：**不过，我看现在很多企业都在用G1了，那你觉得CMS有什么缺点呢？**

**候选者**：1.空间需要预留：CMS垃圾收集器可以一边回收垃圾，一边处理用户线程，那需要在这个过程中保证有充足的内存空间供用户使用。

**候选者**：如果CMS运行过程中预留的空间不够用了，会报错（Concurrent Mode Failure），这时会启动 Serial Old垃圾收集器进行老年代的垃圾回收，会导致停顿的时间很长。

**候选者**：显然啦，空间预留多少，肯定是有参数配置的

**候选者**：2. 内存碎片问题：CMS本质上是实现了「标记清除算法」的收集器（从过程就可以看得出），这会意味着会产生内存碎片

**候选者**：由于碎片太多，又可能会导致内存空间不足所触发full GC，CMS一般会在触发full GC这个过程对碎片进行整理

**候选者**：整理涉及到「移动」/「标记」，那这个过程肯定会Stop The World的，如果内存足够大（意味着可能装载的对象足够多），那这个过程卡顿也是需要一定的时间的。

**面试官**：嗯…

[![](/images/jueJin/96b6d1ad10c84bf.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtysjs3tzoj60nm076q3e02.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtysjs3tzoj60nm076q3e02.jpg")

**候选者**：使用CMS的弊端好像就是一个死循环：

**候选者**：1. 内存碎片过多，导致空间利用率减低。

**候选者**：2. 空间本身就需要预留给用户线程使用，现在碎片内存又加剧了空间的问题，导致有可能垃圾收集器降级为Serial Old，卡顿时间更长。

**候选者**：3. 要处理内存碎片的问题（整理），同样会卡顿

**候选者**：不过，技术实现就是一种trade-off（权衡），不可能你把所有的事情都做得很完美

**候选者**：了解这个过程，是非常有趣的

**面试官**：那G1垃圾收集器你了解吗

**候选者**：只了解一点点，不能多了

**候选者**：不过，留到下次吧，先让你消化下，不然怕你顶不住了。

**本文总结**：

*   **CMS垃圾回收器设计目的**：为了避免「老年代 GC」出现「长时间」的卡顿（Stop The World）
*   **CMS垃圾回收器回收过程**：初始标记、并发标记、并发预处理、重新标记和并发清除。初始标记以及重新标记这两个阶段会Stop The World
*   **CMS垃圾回收器的弊端**：会产生内存碎片&&需要空间预留：停顿时间是不可预知的

[![](/images/jueJin/cab17265798a4db.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gsmdclmzxyj30u01y8k8q.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gsmdclmzxyj30u01y8k8q.jpg")

[![](/images/jueJin/127a25767665477.png)](https://link.juejin.cn?target=https%3A%2F%2Ftva1.sinaimg.cn%2Flarge%2F008i3skNgy1gtnap1q52rj61400mitb602.jpg "https://tva1.sinaimg.cn/large/008i3skNgy1gtnap1q52rj61400mitb602.jpg")

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试，对线面试官系列持续更新中！

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**