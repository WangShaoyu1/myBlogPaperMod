---
author: "恋猫de小郭"
title: "Flutter之ftcon24usa大会，创始人分享Flutter十年发展史，一闪而过的鸿蒙身影"
date: 2024-09-24
description: "之前一直关注Fluttercon的相关活动，正如Flutter3.24发布时所说，继Fluttercon欧洲之后，近日Fluttercon2024USA在纽约如期举行，大会带来了"
tags: ["前端","Flutter","Android"]
ShowReadingTime: "阅读6分钟"
weight: 805
---
之前一直关注 Fluttercon 的相关活动，正如 [Flutter 3.24 发布](https://juejin.cn/post/7399952146236571685#heading-20 "https://juejin.cn/post/7399952146236571685#heading-20")时所说，继 Fluttercon 欧洲之后，近日 Fluttercon 2024 USA 在纽约如期举行，**大会带来了一些有趣消息和 Flutter 发展历程，本次也是通过 X 和 [OpenWebF 创始人](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F721711295 "https://zhuanlan.zhihu.com/p/721711295")的分享综合了解到最新资讯**。

> 大家也可以关注 OpenWebF 大佬董天成亲临的相关内容：[zhuanlan.zhihu.com/p/721711295](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F721711295 "https://zhuanlan.zhihu.com/p/721711295")

Eric 和 Flutter 十周年
------------------

提到 Flutter 就总是不得不提及 Eric ，几乎每个重要的大会都能看到他的身影，Eric 作为 Flutter 前创始人，虽然已经离开了 Flutter 团队，但是他从 Google 离职并创立了 Shorebird 让他依然活跃在 Flutter 社区，本次 Eric 也是带来了 「Flutter 10 年的主题」。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/284cb833533d46099433ef4d5d43db3e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=dXGo3lQ7AHSR73eE4k495gWhNMY%3D)

Flutter 项目其实从成立到现在已经过去 10 年，最早项目代号是 “Sky” ，而 Flutter 最早诞生于 Google 内部的 Chrome 团队，**早期定位其实是一个「前端项目」**，本身是为了探索更优秀的 Web 渲染技术而存在，所以起初 Flutter 的创始人和整个团队几乎都是来自 Web。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/02ceb37195b94dab9c17b02fae4991d1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=QPsMq5SvBkL2v%2FJc32xgWHhUXmw%3D)

当时 Eric 团队在把一些乱七八糟的 Web 规范去掉后，在一些内部基准测试的性能居然能提升 20 倍，因此 Google 内部就开始立项，而后随着项目的推进，正如大家现在看到的，技术路线逐步调整，例如将原本的 JavaScript 替换为 Dart，之后就是熟悉的 Flutter 开始出现。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f8663aec2a354d7a86f9c0ffd4a86d83~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=Bxw7muiQstoXuIl7oNNMwsIY%2B3k%3D)

虽然大家应该都是在 2017 或者 2018 年才通过开源了解到 Flutter ，但是其实 2016 年作为内部应用，Flutter 其实已经开始出现在 Google 的公开分享里面，另外 Eric 的 [Sky Demo](https://link.juejin.cn?target=https%3A%2F%2Fapkcombo.com%2Fsky-demo%2Forg.domokit.sky.demo%2F "https://apkcombo.com/sky-demo/org.domokit.sky.demo/") App 在 2015 年就公开发布过，当时的 engine 还叫做 domokit/sky\_engine/ 。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5c725e63ab7941e4b79b4c1fb1ad958e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=LOmCcuNlQ5S5l4mt%2Bc0iacNTW9g%3D)

在此之后 Flutter 开启了商业合作，在商业项目取得阶段性成果之后，Flutter 发布了第一个 Beta 版本，而此时的 Flutter 生态已经「初具规模」。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d418fc4ba4ac436abcdd94bf9bd0c165~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=%2BMItVm5hCzh5pKstzWgCi7%2BH9ek%3D)

自此 Flutter 引来了快速发展的时期，越来越多的平台和项目接入 Flutter ，Flutter 也开始支持更多的平台，而在当时，Flutter 对于大多数商业项目来说，还是一个冒险的尝试：

> Flutter wasn’t the safe choice, it was the adventurous choice, the weird choice, the high-tech choice.
> 
> Beta to 2.0 was not really about business. It was about making it work.

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/aed66f55aa2c4b13aecf5e09dfe876ce~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=S7LlalOMOGKxq1WooyMs70IpP2k%3D)

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/09d9091b81d941acba89ed578273892d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=jBN%2FeVbapmcrWPzMF2Y4fNrdw2Q%3D)

而十年后的今天，在 2024 年，Flutter 已经取得了不错的成就和地位，虽然问题依然还有，但是在各个方便都已经开始走向成熟，不管是谷歌内部的 App，还是全球各大企业的产品，都可以看到 Flutter 得身影。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2cc9fcae0f4e4712a886f249f9225a1b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=fbBgn9bwCodV%2BElDDz%2FPv9hiI5Y%3D)

而在商业化领域，Flutter 目前也探索和合作出不少机会，可以看到覆盖了涉及各个领域基于 Dart 和 Flutter 的技术产品，不过这里 Eirc 分享了一个观点，来自董天成大佬的转述：

> **大公司其实并不在意你使用什么技术，他们更关心的是你是否能够解决问题，以及所选技术的成本和收益是否划算**。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a0ffd90f5ca744918e0c4fa31e7826f4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=eURCAd8OSN9AY1YvT20wj81xTcc%3D)

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3d0d7755bb064814ae5638422a33b687~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=l40V4x7qVjQhUSwmCWAZkfL%2BfJA%3D)

这里插一个题外内容，同样是 ftcon24usa 大会分享，来自马萨诸塞州剑桥飞利浦研究中心案例，Flutter 帮助飞利浦在医疗领域快速发展，因为 Flutter 可以快速支持多端设备的发布，并且 FFI 的支持可以让现有的 C/C++ 代码库和已有的技术能力方面得到重复利用，这也体现了企业选择的理由：**在当下这个阶段这项技术是否解决问题或者提高效率**？

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/369ce41d93364d0291633b6ccd7ff7ea~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=Cll8pE4QwGuH9Q3D7ns3Xe3AuLM%3D)

所以，作为技术人员，选择技术更多要基于商业角度来思考问题，**技术牛不牛逼不是核心，重要的是技术能给业务带来什么？是否够以更低的成本解决关键的问题**？

> Eric：例如用户从来不关系 App 是不是 Flutter 做的，他们只关心 App 是否美观、体验是否流畅，而公司是否选择 Flutter ，取决于它能够有效地提高开发效率，降低开发和维护成本。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/01f7247d43fa46878c1ce4a0e55c4fcb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=F913EvAfEuMPatfOHA7veKfwnfE%3D)

商业项目从来不是秀技术地方，商业项目只关心你是否解决了用户的问题，写代码和构建 App 只是手段，并不是目的，**你学习技术的目的，也只是为了能通过解决问题而表现你的价值**。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/edd1a5752871498ab80deca874cbb1fe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=RTcm49vPS2JM%2BfZWBAhwXZODIMQ%3D)

> **所以从我个人出发，我一直觉得程序员并不是局限于某个框架的工具人，只是现在的工作把你标签化，而你应该让自己的技能不局限于某个技术**。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7a3f56dd05d143258ed5460cb4b4ee0a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=tyLULflVbJUsL7rDmcULvdyd4Kg%3D)

而对于未来，Flutter 可能会进一步扩展平台支持，涵盖更多设备和操作系统，而在一些 PC 设备上，例如 Ubuntu 上 Flutter 已经成为默认的首选 UI 开发方案。

**另外，难得在 Flutter 的大会上看到 HarmonyOS 的身影，虽然只是被作为 Android 的分支出现，估计 Eric 还不清楚 HarmonyOS Next 将完全剥离 AOSP 和 JVM ，不过如果现在国内的鸿蒙 Flutter 社区办最终能合并到官服 repo 那就再好不过了**。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/36e3508ba36842c585cdc352afbcd915~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727758988&x-signature=8Sv1yAcTRmjHJyJ%2FWUz%2BM9qe2Ew%3D)

> 例如几个月前，[LG 选择 Flutter 来增强其智能电视操作系统 webOS](https://juejin.cn/post/7392134036845953050 "https://juejin.cn/post/7392134036845953050") ，也体现了 Flutter 在兼容其他平台的可能。

其他
--

通过董天成大佬的分享，结合已有信息，可以大概知道，未来 Flutter 的步伐还有：

*   宏编程支持的落地
*   Pub workspace 的完善，计划应该是在 Dart 3.6 ，主要是支持同一个仓库下有多个 Dart/Flutter 包的场景，在 monorepo 中实现多个相邻包的共享解析
*   有计划改进 Flutter for Web 的 SEO 支持，不过尚无具体时间
*   Desktop 的多窗口支持还会推迟，目前只有 MacOS 的 PlatformView 和 WebView 的到了初步支持
*   Swift Package Manager 支持和 Dart Native 与 Swift / Kotlin 的支持交互优化
*   ····

最后
--

Fluttercon 作为 Google 开发者专家和 Flutter 专家相关的深入技术讲座和研讨会，在此之前在欧洲也举办了首届 Flutter 和 Dart 生态系统峰会，关注了 eu 和 usa 两场峰会，可以感受到 Fluttercon 的研论和小组方式确实很好的拉近了官方和开发者的距离。

本次分享里还是 Eric 的 Flutter 十年最让人印象深刻，不知不觉 Flutter 已经走过了十年，希望下一个十年能带来更多的可能。

参考资料
----

*   [zhuanlan.zhihu.com/p/721711295](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F721711295 "https://zhuanlan.zhihu.com/p/721711295")
*   [docs.google.com/presentatio…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.google.com%2Fpresentation%2Fd%2F13_a8Suyoe-Vbgvt6jZdTz-Tc7fNR2z9lcd-QxsnTw38%2Fedit%23slide%3Did.g2fe6a5dd671_0_61 "https://docs.google.com/presentation/d/13_a8Suyoe-Vbgvt6jZdTz-Tc7fNR2z9lcd-QxsnTw38/edit#slide=id.g2fe6a5dd671_0_61")
*   [docs.google.com/presentatio…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.google.com%2Fpresentation%2Fd%2F1B0dk1GtNXpaqta-LEUqYaoTv99uxt03YFMD95YHp7C8%2Fedit%23slide%3Did.p "https://docs.google.com/presentation/d/1B0dk1GtNXpaqta-LEUqYaoTv99uxt03YFMD95YHp7C8/edit#slide=id.p")