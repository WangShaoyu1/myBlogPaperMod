---
author: "Java3y"
title: "最近学到的ABTest知识"
date: 2019-10-30
description: "如果之前看过我文章的同学就知道我在工作中搞的是推送系统，之前写过一篇 带你了解什么是Push消息推送，里面也提到了我们或许可以做ABTest，最终提高推送消息的点击率。 那什么是ABTest呢？这篇文章带你们入门一下。 比如我写了一篇关于ABTest的文章，我希望这篇文章的阅读…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:28,views:4662,"
---
前言
--

> 只有光头才能变强。

> 文本已收录至我的GitHub仓库，欢迎Star：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

如果之前看过我文章的同学就知道我在工作中搞的是推送系统，之前写过一篇 [带你了解什么是Push消息推送](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485591%26idx%3D1%26sn%3D0c7da1e2adf80a635f7822a7defc18c5%26chksm%3Debd74996dca0c080e28cf92e789b6ae660ae8fa986fda7e8d18682bb90d9ec0037a2ade29595%26token%3D1948873548%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247485591&idx=1&sn=0c7da1e2adf80a635f7822a7defc18c5&chksm=ebd74996dca0c080e28cf92e789b6ae660ae8fa986fda7e8d18682bb90d9ec0037a2ade29595&token=1948873548&lang=zh_CN#rd")，里面也提到了我们或许可以做**ABTest**，最终提高推送消息的点击率。

那什么是ABTest呢？这篇文章带你们**入门**一下。

一、ABTest的介绍
-----------

比如我写了一篇关于ABTest的文章，我希望这篇文章的阅读量能上2500，但是我没想好标题叫什么比较合适。一条推文的标题非常能影响到阅读量，于是我想了几个的标题：

*   最近我学到的AbTest知识
*   AbTest入门

而我不知道哪个标题效果会更好一些，于是我做了这么一个尝试：

1.  《最近我学到的AbTest知识》这个标题推送给10%的用户
2.  《AbTest入门》这个标题推送给10%的用户
3.  过一段时间后，我看一下效果，哪个标题的阅读量更高，我就将效果高的标题推送给剩余80%的用户

![ABTest过程](/images/jueJin/16de29e8b109db6.png)

要注意的是：在推送的文章的时候，**除了标题不同，其他因素都需要相同**（不能被别的因素给干扰），这样看数据的时候才有说服力。

### 1.1为什么要做ABTest？

做ABTest的原因其实很简单，我们在做业务的时候会有各种各样的想法，比如说：

*   “我觉得在文案上加入emoji表情，这个推送的消息的点击率肯定高”
*   “我觉得这个按钮/图片换成别的颜色，转化率肯定会提高”
*   “我觉得首页就应该设计成这样，还有图墙应该是这样这样..“
*   .....

但是，并**不是所有的想法都是正确**的，很可能因为你的想法把首页的样式改掉，用户不喜欢，就影响到了`GMV`等等等....

一个好的产品都是迭代出来的，而我们很可能不清楚这次的迭代**最终**是好是坏（至少我们是觉得迭代对用户是好的，是有帮助的，对公司的转化也是好的），**但是**我们的用户未必就买账。

于是，为了**降低试错成本**，我们就做ABTest。一个功能做出来，我们只放**小流量**看下效果，如果效果比原来的功能差，那很可能我们这个想法没有达到预期。如果小流量效果比预期要好，再逐步加大流量，直至全量。

二、怎么做ABTest？
------------

从上面的案例，其实我们大概知道，ABTest最主要做的就是一个**分流**的事

*   将10%流量分给用户群体A
*   将10%流量分给用户群体A

![分流](/images/jueJin/16de36b9b4f4788.png)

我们需要保证的是：**一个用户再次请求进来，用户看到的结果是一样的**

比如说，我访问了Java3y，他的简介是：“一个坚持原创的Java技术公众号“。而一个小时后，我再访问了他一次，他的简介是：“一个干货满满的技术号“。而一个小时过后，我又访问了他一次，他的简介是：“一个坚持原创的Java技术公众号“。

![简介](/images/jueJin/16de371734d0d63.png)

这是不合理的，理应上用户在一段时间内，看到的内容是相同的，不然就给用户带来一种错乱感。

OK，于是一般可以这样做：

*   对用户ID(设备ID/CookieId/userId/openId)取hash值，每次Hash的结果都是相同的。
*   直接取用户ID的某一位

现在看起来，ABTest好像就是一个**分流**的东西，只是取了个高大尚的名字叫做ABTest。

### 2.1 ABTest更多的内容

假如我做了一个UI层面上的ABTest，占用全站的流量80%，现在我还想做搜索结果的ABTest怎么办？只能用剩下的20%了？那我的流量不够用啊（我可能要做各种实验的呢）。UI层面上的ABTest和搜索结果的ABTest能不能同时进行啊？

答案是可以的。因为UI层面和搜索结果(算法优化)的**业务关联性是很低**的。如果要做“**同一份流量**同时做UI层面上和搜索结果的ABTest”，那要保证“**在UI层面做的ABTest不能影响到搜索结果的ABTest**”

*   业界应用最多的，是**可重叠分层分桶**方法
*   层与层之间的流量互不干扰，这就是很多文章所讲的**正交**(**流量在每一层都会被重新打散**)

![来源：https://www.infoq.cn/article/BuP18dsaPyAg-hflDxPf](/images/jueJin/16dee7903941449.png)

我们就可以这样干：通过 Hash(userId, LayerId) % 1000 类似的办法来实现

*   **每一层的实验不管有多少个，对其他层的影响都是均匀的**

> 我的理解：
> 
> 为了实现UI/算法/广告 这些业务上没什么关联的，**能够使用同一份流量**做ABTest测试，所以分了层。流量经过每一层都需要将流量重新打散(正交)----每层实验后，不会影响到下一层的实验
> 
> 如果业务关联强的应该放在同一层，**同一层多个实验是互斥的**（比如 一个按钮颜色改为绿色作为一个实验，一个按钮的样式改成大拇指作为一个实验。这两个实验的流量是要互斥的（不然你咋知道用户是因为你的按钮颜色还是样式而点击）

![示意图](/images/jueJin/16df373d9226d77.png)

最后
--

一个完整的ABTest系统，不单单只做分流，还会给用户(我们程序员)提供一个方便可配置的后台系统，做完实验提供数据报表展示等等等~

> 微信公众号不支持外链，在后台回复“**AB**”得到更多的ABTest资料

参考资料：

*   [oldj.net/blog/tag/a-…](https://link.juejin.cn?target=https%3A%2F%2Foldj.net%2Fblog%2Ftag%2Fa-b%25E6%25B5%258B%25E8%25AF%2595%2F "https://oldj.net/blog/tag/a-b%E6%B5%8B%E8%AF%95/")
*   [www.infoq.cn/article/BuP…](https://link.juejin.cn?target=https%3A%2F%2Fwww.infoq.cn%2Farticle%2FBuP18dsaPyAg-hflDxPf "https://www.infoq.cn/article/BuP18dsaPyAg-hflDxPf")
*   [www.jianshu.com/p/de8d9f0b1…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fde8d9f0b14f4 "https://www.jianshu.com/p/de8d9f0b14f4")
*   [liyaoli.com/2018-04-29/…](https://link.juejin.cn?target=https%3A%2F%2Fliyaoli.com%2F2018-04-29%2Fabout-ab-test-and-gated-launch.html "https://liyaoli.com/2018-04-29/about-ab-test-and-gated-launch.html")
*   [zhuanlan.zhihu.com/p/25319221](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F25319221 "https://zhuanlan.zhihu.com/p/25319221")
*   [zhuanlan.zhihu.com/p/52424409](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F52424409 "https://zhuanlan.zhihu.com/p/52424409")
*   [qiankunli.github.io/2018/06/27/…](https://link.juejin.cn?target=https%3A%2F%2Fqiankunli.github.io%2F2018%2F06%2F27%2Fabtest.html "https://qiankunli.github.io/2018/06/27/abtest.html")

> 乐于输出**干货**的Java技术公众号：**Java3y**。公众号内**有200多篇原创**技术文章、海量视频资源、精美脑图，**关注即可获取！**

![转发到朋友圈是对我最大的支持！](/images/jueJin/16e1a5432710b02.png)

觉得我的文章写得不错，点**赞**！

**近期推荐：**[最低价购买云服务器+搭建教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FMQqasjPs4Y-OCjQLuFj4ew "https://mp.weixin.qq.com/s/MQqasjPs4Y-OCjQLuFj4ew")