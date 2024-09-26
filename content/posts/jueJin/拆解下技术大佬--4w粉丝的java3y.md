---
author: "程序员芋仔"
title: "拆解下技术大佬--4w粉丝的java3y"
date: 2024-09-05
description: "今天这篇文章，主要拆解一下Java3y在掘金上的文章，试图看看这位拥有4w粉丝的大佬的成长轨迹和发文规律。"
tags: ["前端","后端","面试"]
ShowReadingTime: "阅读5分钟"
weight: 674
---
越是贪图圆满，越是搜不干净 --- 黑神话悟空

大家好，我是程序员芋仔，今天这篇文章，主要拆解一下[Java3y](https://juejin.cn/user/3438928101642958 "https://juejin.cn/user/3438928101642958")在掘金上的文章，试图看看这位拥有4w粉丝的大佬的成长轨迹和发文规律。

![敖丙的邀约](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2d876f46116041d1b39be18d8e9a991a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=QptJKUvTLnIkV1LrIM%2Fnl%2BRBNNc%3D)

概况
--

Java3y，2018-01-30 加入掘金。共计发表 321篇文章，4w+粉丝，点赞量更是达到 27,258，阅读量高达 220w。单从粉丝量和点赞数上可以说，和上一篇的[鱼皮](https://juejin.cn/post/7410293401365692450 "https://juejin.cn/post/7410293401365692450")都不是一个 Level 的。

![Java3y 掘金概况](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2af9a51dd9a14bce8220ac0e1ca4ee9f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=GZpQT2eZ%2BLASZ%2BY5jDUpw%2BUMLxc%3D)

高赞文章数据分析
--------

![前100点赞文章](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0e5ec029c68e464eaa64cb4bdde7cb0f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=yTNHhw%2BaFgJbW%2BConhDbjM3qqNo%3D)

文章比较多，所以只输出了前100篇的数据。

根据二八法则计算了一下，大概如下：

![二八法则](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b2438d58dd5b4e1780198482e5a33455~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=blgckzbX8489vSNUxMWR0Uruhy0%3D)

基本上也就是 前100篇的文章，贡献了百分之八十的点赞和收藏。

字数分布如下：

![前100篇字数分布](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5da1dc76db4f4eae8cdd6d1985f026c1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=P8EfFfND0IdhUV2itZdH2TY6Kno%3D)

基本也是集中在 2000 - 4000字。

时间线分析
-----

前100篇文章时间分布如下：

![前100篇时间分布](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3dadf7ada2d448d3b10d442a2d0f3aa1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=SYXLpV7gP5OHD3skJmhc1FrTjhc%3D)

放宽到所有文章，分布如下：

![所有文章时间分布](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3f2b72d7fd4c4828b0c35cdbd8418e48~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=CZFMoXAobPtyw624QL1L45MPBVI%3D)

总结一下，大致分成这么几个阶段：

1.  2018，高产高质，181篇文章，三分之一都是高赞文章
2.  2019-2021，产量下滑到不到50篇，但是质量依旧
3.  2022, 2023，产量下滑到个位数，点赞均值依旧可观
4.  2024，产量回升，但是无人问津，点赞均值落到了个位数，下滑异常明显。

ps：再贴一个点赞率的数据，前 100篇文章中，点赞率基本高于 1%，可见质量确实不错。甚至有 4%，5% 点赞率的文章，可谓是超高质量了。

![点赞率分析](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/36240497afbd464d883f009fb945b874~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=HwQZ9pwNnoxztDVreoLQzU%2BKk%2BE%3D)

文章内容分析
------

该博主时间线明显，所以对前100篇按照时间线进行划分：如下：

### 2018

共计 55 篇：

![2018文章数据](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/12f71b34d35847bf850f41bf0e7fe2b2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=0SfRTIZbaX1FK3NbYZQ5Bmqsljg%3D)

可以看到，这些文章基本以知识点讲解为主。

标题可以归为：

1.  xxxx 就是这么简单：讲透一个知识点为主
2.  xxx 面试题，算法题：以讲解面试题为主
3.  xxx 入门，外行人都能看懂：大白话讲知识点
4.  xxxx "观后感": 学习记录

基本都以知识点，面试讲解为主，非常吃香。

### 2019 - 2021

![2019-2021文章](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e32538dec0dd49b9be38568bab55d2ca~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=Sw8vtFs8Ou84JwV7KmGq2MC6ym0%3D)

按照标题可以归纳为：

1.  什么是 xxx，扫盲 xxx，最全最通俗易懂的的 xx 入门，一文带你入门 xxx：还是以讲解一个知识点为主，入门为主
2.  在工作中常用的 xxx：就几篇，主打学习资料整理
3.  面试官问我： xxxx： 主打面试题讲解
4.  个人成长：就几篇，单独列出来分析

#### 个人成长

1.  裸辞，自由职业，再就业，133赞
2.  毕业半年，买了一台MacBook Pro，110赞
3.  🔥如何写一篇技术博客，谈谈我的看法，64赞

整体还是以技术科普+面试讲解为主，很吃香，在此期间个人成长的分享也非常高质。

### 2022-2024

文章数量很少，就全部拉出来了：

![文章滑坡](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dcb3eea973a644409861695e9f3c8fa0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=IoRlhIpj4DTtz%2Fv291VGqPlu%2F5U%3D)

可以分为几类：

#### 个人成长

1.  毕业四年，随笔：36点赞
2.  分享一些我技术成长的感悟：27点赞
3.  2017年，我成为了技术博主：3点赞
4.  还有一些 2024 年发出来的不太技术的文章，阅读点赞都非常非常低。

这部分文章，点赞阅读都很低，即便是 4w 粉丝，也无济于事。

#### 个人项目

消息推送平台终于要迎来第一版啦！2023年5月份的项目，开源项目，也是该博主付费的主要项目。53赞。这个系统应该是从 2020年底有的苗头，估计也和他的工作内容有关，2021-2023，打磨的时间还是比较久的。

![项目提交记录](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1612c752c0b74d38b52ba74aea29d3d7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=ygXA6cEZbXhTt%2FS4f4gH1B1zMMg%3D)

#### 技术文章

1.  我不写单元测试，被批了。316赞
2.  Java如何实现去重？这是在炫技吗？。146赞
3.  笑死，面试官又问我SpringBoot自动配置原理。94赞
4.  如何吃透一个Java项目？77赞

技术文章也还算受欢迎，更多的偏向面，但是个人成长和个人项目，以及 2024 的一些文章，都不太理想。

### 小结

技术科普文章，面试文章，都非常受欢迎，但是也集中在 2018-2021年。

之后2022-2024，这个博主基本归于平淡期，在掘金上文章产出偏少，除了技术类文章，其他类型文章数据都不太理想。

最后
--

从数据来看，知识点讲解类，面试官系列，入门系列都非常受欢迎，但是这样的文章也和时间节点有关系，博主主要集中在 2018-2021年。而后 2022, 2023 的技术讲解，则以面为主，会相对受欢迎一点，但是这样的文章，量不会太多。除此之外个人成长类，或者杂谈类，这位博主的文章在掘金上并不受待见，4w粉丝，这部分文章数据可以说是另一个极端了。到如今2024年，在掘金这个平台上，基本泯然众人。

而他的一个技术成长路径，其实根据博主个人成长类的文章，串起来，基本就能看个大概。这里我再多说就有点不礼貌了。感兴趣的读者可以自行串联分析。

最后，也不得不感叹一下，最强生产力是什么----是大学生。

也给 java3y 送一首诗吧：

![叹java3y](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e1518b94299142ef88a89ba18159b712~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY6IqL5LuU:q75.awebp?rk3s=f64ab15b&x-expires=1727336152&x-signature=Xxr2%2BO2kStL96%2Byo1bJIFawhspU%3D)

仅供娱乐，切勿当真！

ps: 听说敖丙和 Java3y 是 cp？有懂的吗？