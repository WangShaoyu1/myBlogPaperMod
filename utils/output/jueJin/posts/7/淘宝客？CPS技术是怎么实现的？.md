---
author: "Java3y"
title: "淘宝客？CPS技术是怎么实现的？"
date: 2020-11-17
description: "今天来给大家科普下「分佣」是大多数怎么做的，这篇文章非常适合新手观看，应该可以学到不少的“常识”。 前几天可以发现三歪推了几天的服务器，一方面是的确便宜（75块一年去哪里找呢），一方面三歪会从中抽取点服务器的佣金（赚点吃饭钱💰 不香吗）。 这也没啥好隐瞒的，好的东西分享给大家…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:8,comments:3,collects:7,views:2145,"
---
前言
--

> 微信搜【**Java3y**】关注这个有梦想的男人，点赞关注是对我最大的支持！
> 
> **文本已收录至我的GitHub**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")，有300多篇原创文章，最近在**连载面试和项目**系列！

今天来给大家科普下「分佣」是大多数怎么做的，这篇文章非常适合**新手观看**，应该可以学到不少的“常识”。

前几天可以发现三歪推了几天的服务器，一方面是的确便宜（75块一年去哪里找呢），一方面三歪会从中抽取点服务器的佣金（赚点吃饭钱💰 不香吗）。

这也没啥好隐瞒的，好的东西分享给大家，你买到了实惠的东西，我再从中收取部分的利益，达到了双赢。

**根据订单成交额获取一定的受益**：从广告专业的角度叫做`CPS`

回到现实生活中，比如你买了车，销售会有提成吧？比如你买了房，销售也会有提成吧？

如果想对广告有个基本的了解，可以先看看我上一篇的广告科普文，里边也提到了`CPS`的概念：[广告基础入门](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247493170%26idx%3D1%26sn%3D3b6c1f663673a69bf7f9e32b49fb9bb4%26chksm%3Debd4a733dca32e25f357bb6646438a79b0c704b0b169557c0ef53f9646b813fd0ec60648138b%26token%3D1427971912%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247493170&idx=1&sn=3b6c1f663673a69bf7f9e32b49fb9bb4&chksm=ebd4a733dca32e25f357bb6646438a79b0c704b0b169557c0ef53f9646b813fd0ec60648138b&token=1427971912&lang=zh_CN#rd")

那我们要不来**猜一下**这个`CPS`（分佣/返现）的功能是怎么实现的？如果猜错了，大佬出来打我脸，那那那那....就算了呗。

不多BB，我们开始吧。

Cost Per Sale
-------------

我要在**线上**卖某件商品，卖出去后我得能拿到提成，这功能必然有一套完整的系统在背后支撑着。

但不管怎么样，我买东西也好，推广卖东西也好，我肯定是**这件商品所归属的平台用户**

所以说，我肯定有我需要推广云服务器的账号。

![](/images/jueJin/a33543a84eec4eb.png)

> 画外音：无论是买家还是推广者，在平台的眼里我们都是**用户**。可能推广者就多了个标记位来**标识**这个用户是推广人，卖了服务器需要给他返现。

成为了推广者之后，那么三歪就可以进行推广了。所需要的东西实际不多，一个**链接**足以：

[www.aliyun.com/1111/pintua…](https://link.juejin.cn?target=https%3A%2F%2Fwww.aliyun.com%2F1111%2Fpintuan-share%3FptCode%3DMTk2NjQwOTYyMDkyNzI4MXx8MTE0fDE%253D%26userCode%3Dpfn5xpli "https://www.aliyun.com/1111/pintuan-share?ptCode=MTk2NjQwOTYyMDkyNzI4MXx8MTE0fDE%3D&userCode=pfn5xpli")

链接由两部分组成：

*   [www.aliyun.com/1111/pintua…](https://link.juejin.cn?target=https%3A%2F%2Fwww.aliyun.com%2F1111%2Fpintuan-share "https://www.aliyun.com/1111/pintuan-share")（核心信息）
*   `ptCode=MTk2NjQwOTYyMDkyNzI4MXx8MTE0fDE%3D&userCode=pfn5xpli`（参数）

如果你打开链接之后，可以发现的是：我购买服务器只要「核心信息：https://www.aliyun.com/1111/pintuan-share」就足够了。

那参数有什么用呢？**关联用户**

三歪在推广卖服务器，敖丙在推广卖服务器，你们也在推广卖服务器，那平台是怎么知道三歪卖了多少台呢？那不可能三歪说卖了10台，平台就给三歪10台的服务器佣金吧？总得有个准确的计算方法的吧。

这里靠的就是**链接后带的参数**。从我“专业”的角度来看，链接后带有两个参数，分别是`ptCode`和`userCode`。嗯，一看就是`ptCode`绑定了拼团的信息，`userCode`判定的用户的信息（这里的用户，肯定是指三歪的啦）

再从我“专业”的角度来看参数值：`MTk2NjQwOTYyMDkyNzI4MXx8MTE0fDE%3D`和`pfn5xpli` 。嗯，看不懂，跳过。（能看懂就有鬼了，我又不是对应的开发）

OK，我们现在知道链接是带了「私货」的，那回到最重要的问题上：**平台是怎么识别到这个用户是从三歪那里来的呢？链接是有参数，那具体是怎么做的呢**？

### Cookie

第一我们能想到的可能是`Cookie`，只要在用户点击这个链接的时候，我们给这个用户颁发`Cookie`，那该用户对该域名的所有交互，都会带上`Cookie` （包括下单）。

![](/images/jueJin/e94326514334408.png)

那么，只要下单的时候，**交易的同学**把Cookie的信息写到订单消息报上，那**广告的同学**就能通过订单消息报的内容**追踪**到该下单用户是从哪个推广者所带来的。

![](/images/jueJin/5b23e9bd0551451.png)

> 画外音:较大的公司，交易和广告是分开的。广告需要监听**交易的消息报**来完成自己的业务逻辑

### Trace

除了`Cookie`的方式来追踪，还有什么办法吗？有的，也可以使用**链路追踪**的方式。

所谓的链路追踪，从本质上来讲，就是用户点击链接的时候，把**点击用户以及链接的参数**（推广者）存储起来。

![](/images/jueJin/583aff0a2c9a4cf.png)

要知道的是，你在平台上的**每一次点击**都会被记录下来（点击pv就是这么来的）

点击的数据，一般会产生一个点击的消息报`topic`，谁要点击的数据就谁去消费这个`topic`就好了。

![](/images/jueJin/c7fca95070dd403.png)

每个业务（广告、商品、算法等等）都可以消费点击消息报，得到的都是平台所有的点击，然后会过滤掉不需要的点击。

比如CPS业务只会取链接带有`userCode`的点击，然后对这些「想要」的点击做业务的规则。常见的就是判断点击链接的用户是否为「新用户」

有好多同学可能在买服务器的时候发现只有新用户才会便宜，老用户都不会有特别大的优惠。于是都会调侃说一句：老用户不如狗。

道理也很简单：如果你已经是老用户了，那要不要续费，要不要继续购买是从商品本身的性价比来考量的（该买的还是会买，不买就自然会流失）。而如果你是新用户，**可能你之前甚至没听过这个平台**，可以通过足够多的优惠下单来让你成为平台的用户（把新客留在平台，可能会创造出更多的价值，这是平台愿意去付出的成本）

当然了，大多数平台也会持续保证自己的竞争力来尽可能留住**所有的用户**。

从用户听过你的平台，到用户下载你的APP，再到用户注册APP，最后到用户从APP购买商品，这是一个**漏斗**。从广告的角度而言，每个环节都会对应一个市场价，现在以`CPS`的方式可以让这个流程一整套直接走完，所以平台会以大的优惠力度给予新人，希望能得到转化，平台得到新的血液。

![](/images/jueJin/83b972cf1cde465.png)

所以广告侧会只会筛选出点击事件里自己需要的部分，经过一系列的规则（可能是新用户，可能是各种的校验），然后会将信息单独存储到某个地方（可以是`HBase`，可以是`DB`，也可以是`缓存`，就看你怎么考量了）。

![](/images/jueJin/52d34548081c4df.png)

一般来说，`HBase`或带过期时间的存储还是比较方便好用的，因为从业务上都会有一个**关联时间**（有可能是30天，有可能是60天，也有可能是1天），存储到`HBase`相对应的列簇，可以设置过期时间，就不用手动去删除了。

等到用户真正下单购买的时候，广告侧还是监听交易的消息报，只不过这一次是去存储的地方找相应的记录，只要找到了，就把这个订单归给推广者。

![](/images/jueJin/2c53f2fd2338451.png)

### QA

> Q:有的同学就想问了：如果三歪你是推广者，我也是推广者，现在有个叫「敖丙」的进来都点了我们俩的链接，他最后购买了，那那这算是谁推广的？

**这具体看平台的规则**。

有的平台会以**最后一次**来判定这个订单属于哪个推广者。比如说，敖丙先点了你的链接，没买，然后点了我的链接，买了。最后敖丙下单的时候，发现我是最后一次点的，所以订单算我的。

也有的平台会有「保护期」的概念。比如说，敖丙点了我的链接，然后敖丙已经跟我关联起来了，他再点你的链接，由于保护期范围内生效，所以他不会跟你关联。所以，敖丙在这段时间内下单，都是算我的。

> 补充

不同的平台会有不同的规则，最后`CPS`的业务逻辑都会变得相对复杂。

![](/images/jueJin/c52236bfa202415.png)

上面我所讲到的是一个最最最基本的`CPS`流程，主要由`链接`开始（CPS必须要带关键的参数）。主要的实现，要么就把关联的信息存到用户（Cookie），要么就是把关联信息在用户点击的时候就存储（关键位置追踪）。

实际上需要考虑的问题也会更多，因为`CPS` 还是跟钱💰相关的，期间不能出错。

就比如说：”广告侧消费订单消息报的时候，突然挂了，怎么办？“

是不是需要做`at least one` + `幂等` 来让订单的数据不会丢以及不会重复....

想不想了解更多？**来个点赞和关注转发呗**，后面会继续分享的哟

#### 涵盖Java后端所有知识点的开源项目，已有10K+ star！内含1000+页原创电子书！！！

*   [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")
*   [Gitee访问更快](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzhongfucheng%2FJava3y "https://gitee.com/zhongfucheng/Java3y")

PDF文档的内容**均为手打**，有任何的不懂都可以直接**来问我**

![](/images/jueJin/527ebf04b2da415.png)