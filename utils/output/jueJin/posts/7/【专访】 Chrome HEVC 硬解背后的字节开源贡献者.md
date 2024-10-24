---
author: "字节跳动技术团队"
title: "【专访】 Chrome HEVC 硬解背后的字节开源贡献者"
date: 2022-10-26
description: "2022 年 10 月 25 日（美国时间）支持 HEVC 硬解功能的 Chrome 107 已正式开始全量推送给所有用户。"
tags: ["Chrome中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读21分钟"
weight: 1
selfDefined:"likes:33,comments:2,collects:17,views:7322,"
---
2022 年 10 月 25 日（美国时间）支持 HEVC 硬解功能的 Chrome 107 已正式开始全量推送给所有用户。10 月 21 日 Chrome 官方在更新日志中做了正式说明。

这个事件的背后离不开一位来自字节的开源贡献者的努力，ByteTech 了解到了相关背景，特意邀请了斯杰同学对整件事的来龙去脉作了梳理，以飨读者。

为什么说 HEVC 很重要
=============

### 我们活在高清时代

HD，蓝光，4K，8K！这些词频频出现在我们生活中，新型手机拍摄的高清视频，在西瓜，抖音，VR 上观看高清视频和直播，家里的高清监控设备 24 小时录制，这些视频内容的存储和分发都离不开视频编码技术，虽然当前已经 2022 年，但是 Web 平台主流的编码技术仍然是落后的 H.264 / MPEG-4 AVC ([zh.wikipedia.org/wiki/H.264/…](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FH.264%2FMPEG-4_AVC "https://zh.wikipedia.org/wiki/H.264/MPEG-4_AVC")) 格式，这种编码方式，假定压制存储 2 个小时的 1080P 视频需要 10 G 左右，而达到同样清晰度的 HEVC 编码只需要 H.264 约一半的体积，那为什么大家不都用更先进的编码技术？

原因是专利之争！HEVC 视频专利错综复杂，不在本文关注重点，但是用户及视频厂商苦之久宜，尤其是作为市场占有率 67% 的 Chrome 浏览器，一直无法在 PC / Android 上支持 HEVC 视频的播放，作为用户需要忍受视频加载卡顿抑或是下载使用专门的客户端。

HEVC 即使有专利费用的各种问题，但是在其优秀的压缩率下，也取得了较多的进展，尤其是在硬件编解码支持度上 ([www.infoq.cn/article/s65…](https://link.juejin.cn?target=https%3A%2F%2Fwww.infoq.cn%2Farticle%2Fs65bfdpwzdfp9cq6wbw6 "https://www.infoq.cn/article/s65bfdpwzdfp9cq6wbw6")) ，是仅次于 H.264 的编码格式。如果应用使用硬解，由于硬件厂商已经对专利付费是不会有专利风险的。

### 预期对行业有什么影响？

Chrome 107 这次支持的硬解是全平台开箱即用的，由于 Chrome 在世界范围 67% 的市场占有率，以及有很多基于 Chromium 的浏览器，今后，网站可以做到 “有效部署” HEVC 视频内容。

**首先是：更低的部署成本。** 对于像 Web 端的西瓜，Bilibili，Netflix 等视频站点来说，包括 CDN 流量费用和转码的费用。HEVC 预期相比 H.264 最多可以节省 50% 的 CDN 流量，对于像直播等场景，也可以减少因为实时转码导致的高额成本和延迟的问题。

**其次是：更好的用户体验。** 使 Web “全平台” + “老机型” 流畅播放 8K、HDR 视频成为可能。以 B 站为例，其流量大头的移动端主推 HEVC，不管是杜比视界，8K，HDR 真彩，这些高级特性都基于 HEVC 实现。在之前，由于 Web 端产品没办法控制浏览器内核，即使有非常厉害的 WasmPlayer 软件，但是原理层面就决定了这种方案解决不了超高清视频 CPU 占用高，HDR 支持差 ([www.oschina.net/news/189974…](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Fnews%2F189974%2Fbilibili-hevc "https://www.oschina.net/news/189974/bilibili-hevc")) 等问题。

有了 Chromium HEVC 硬解支持，视频网站在 HEVC 内容部署上会有巨大的提升。

巨人肩上的探索者
========

### 为何 Chrome 的 HEVC 姗姗来迟

倘若如本文所说，HEVC 如此重要 Google 怎么会意识不到，是不是技术实现太过复杂？大概用脚想了一下答案非也，有部分原因是 Google 在 HEVC 专利之争中没有占据到一席之地，主推 VP9 编码格式，并在 YouTube 中大量使用，以此 “对抗” HEVC，个人猜测 Google 在自身产品中一直把 HEVC 放在低优的战略位置。看 Chrome Release Note 中许多笔者觉得无关紧要的更新，以及众多为支持 Web HEVC 播放折腾坏了的程序员和公司，有一种在巨人肩上随之摇摆的无力感。

> 在生活中我们觉得不合理的事情比比皆是，在这个事情之后，我更意识到了敢想敢做的重要性。

### 探索者是一名 Web 工程师

到此终于要引出我们本文的主角，Chromium HEVC 硬解功能的主要代码贡献者朱思达。

![图片](/images/jueJin/8771262328b94e8.png)

简单介绍一下作者，2020 年毕业于西安电子科技大学，作为 Web 前端入职字节跳动的内容安全团队，负责桌面端开发，目前在飞书技术团队参与框架跨端开发。而笔者当时作为内容安全团队负责人，正好了解整件事情发展，截至 2022 年 10 月，思达在过去的半年多时间，给 Chrome 贡献了 37 个 HEVC 硬解相关的 Commit，提交了 Caniuse ([caniuse.com/?search=hev…](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%3Fsearch%3Dhevc "https://caniuse.com/?search=hevc")) 的修改，并把整个实现过程完整记录了到了 Github ([github.com/StaZhu/enab…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FStaZhu%2Fenable-chromium-hevc-hardware-decoding "https://github.com/StaZhu/enable-chromium-hevc-hardware-decoding")) 中，同时也撰写了非常详尽的技术文档《8K HDR!｜为 Chromium 实现 HEVC 硬解 - 原理/实测指南》 ([zhuanlan.zhihu.com/p/541082191…](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F541082191\)%25E3%2580%2582 "https://zhuanlan.zhihu.com/p/541082191)%E3%80%82")

同样作为技术从业者，觉得这个文章过于硬核，便想到做一个访谈类的文章吧，让更多人了解这件有趣的事情。

思达自述，从业务到开源那些事
==============

### 是在什么时候开始，有做 HEVC 硬解的想法的？

受限于一些众所周知的原因，从 2015 年到 2022 年今年，Chromium 一直不支持 HEVC 这个编码格式，我们有一个桌面端 App 使用 Electron 实现，需要有播放 HEVC 视频的能力。

在 2021 年底的时候，我在其他工区做调研，发现部分同学电脑经常卡顿，CPU 占用达到 100%，快进快退缓慢，体验非常差，叫苦不跌。查验后发现，这部分 1080P 的视频均为 HEVC 编码，由于大部分是直播切片，需要高实时性，无法接受转码，因此一时之间没有办法可以解决卡顿问题（除非换电脑）。

于是我便在网上查资料，发现 H.264 因为是硬解，所以从来没有人觉得卡，而这部分 HEVC 的问题大抵是与软解性能差有关系，同时也发现很多业内同行比如 B 站，有遇到与我们类似的问题，进一步查验发现，PC 平台只有 Edge 支持 HEVC 硬解，Mac 平台只有 Safari 支持 HEVC 硬解。考虑到 Edge 是闭源的，而 Safari 又是基于 Webkit 内核的，开源世界缺乏基于 Chromium 内核的 HEVC 硬解能力，这恶心了所有需要用到这个格式的用户、开发者，因此觉得必须做点什么，让我们的用户使用体验更好，哪怕代码合不进 Chromium，也一定要分享到 Github，帮助用户、开发者解决这个痛点，非常有意义。

### 如何平衡业务，如果做不成功会咋样？

最开始做的时候确实压力比较大，也觉得这个东西不太可能做出来，同时因为我们项目一共大概只有3 ~ 4 个前端做 PC 端（Electron），之前大家没做过媒体相关的开发，也没做过浏览器开发，当时总体看也觉得这个事比较虚。

尽管如此，但是我们项目由于一直使用自定义编译的 Electron，因此在编译浏览器这块有一定经验，同时也因为我的同事斯杰在 19 年时就探索过软解的方案《修改 Chromium 源码，实现 HEVC/H.265 4K 视频播放》([www.infoq.cn/article/s65…](https://link.juejin.cn?target=https%3A%2F%2Fwww.infoq.cn%2Farticle%2Fs65bfdpwzdfp9cq6wbw6 "https://www.infoq.cn/article/s65bfdpwzdfp9cq6wbw6")) ，他和我的另一同事光宇都觉得这个事是有技术挑战的事情，没理由不让这个事做的更极致，非常支持我们去做，于是就准备做了。

在忙完了手头一些事情后，我打算花 2 ~ 4 周时间把它搞出来，如果搞不出来就放弃。所以花了 1 周时间恶补了下 HEVC，音视频相关的基础知识，然后发现工作量非常大，因此准备先尝试点稍微简单但必要的功能，比如给 HTMLMediaElement 扩充了一个几个新的方法《为Chromium实现MediaConfig API - 过程分享》([mp.weixin.qq.com/s/xvz6gJkhp…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fxvz6gJkhpUoBBtNusHMjOg "https://mp.weixin.qq.com/s/xvz6gJkhpUoBBtNusHMjOg")) ，又花了一周，把这个 Feature 做完之后，客户端新版本上线，也拿到了预期的数据。

知道了 HEVC 的数据，下一步就是尝试实现硬解，我和我们组内的另一个还在实习的同事豪爽一起尝试做这个事，豪爽从魔改 FFMPEGVideoDecoder 方向入手，又花了 2 周左右时间，发现这个东西可以调到硬解模块，但是因为浏览器沙箱限制，最终魔改失败。

我觉得我们已经投入的人力虽然暂时没做出来，但是这个过程积累了不少经验，没理由放弃，然后我就打算仿照 macOS H.264 实现硬解的方式实现 HEVC 的硬解，然后又花了 1 个月时间，继续掉头发，阅读 VLC 和 FFMPEG 的源码，参考各种能搜索到的文章，靠着各种线索，最后把 macOS 的硬解搞出来了。

### 功能的开发过程是怎么样的？

首先非常感谢英特尔的 Jianlin Qiu 老哥（注：Windows 平台 HEVC 硬解贡献者）， 我们两个毕竟是属于 “非官方开发者”，也是有很多的摸索和交流，这个过程我也和 Jianlin 学到了很多。

在 2020 年底，Chrome 的 Jeffrey 就已经把 Chrome OS 的 VAAPI 硬解实现好了，因此 H265 Decoder 和 H265 Parser 最初基本都是 Jeffrey 写的，但是一直没默认启用，状态也比较不明朗，没啥人用，没经受过群众的验证，这部分代码就这么放在了 Chromium 仓库大概 1 年半。

刚才也提到，我是在一月份就开始尝试实现 macOS 硬解的，macOS 的搞好了又尝试按照 Edge 插件的方式去实现 Windows 硬解，但是遇到了些大坑没解决。

然后在 2 月份发现 Jianlin 把 D3D11VA 硬解的能力合进去了，Jianlin 算是第一个吃螃蟹的人，作为这次 Windows 平台 HEVC 硬解的开发者，Windows 平台的 H265 Accelerator 代码是他 1 月底提交到 Chromium 的，当时 Media Team 的态度是，这个可以合，但是：代码不能包含在 Chrome 内；默认也不允许启用。没有人知道这个功能到底有没有可能在未来面世，但我都觉得这已经很好了。

毕竟自己编译代码 + 手动启用开关还是可以能用这个功能的，至少未来不用解决冲突了，所以看到 Jianlin 的提交后也有信心了，在 3 月初把手头写好的 macOS 平台的代码也提交了上去，然后就是不断完善，到了 4 月份，这个功能基本能用了，我就在 Github 建了个仓库 ([github.com/StaZhu/enab…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FStaZhu%2Fenable-chromium-hevc-hardware-decoding "https://github.com/StaZhu/enable-chromium-hevc-hardware-decoding")) ，用来做一些注意事项和状态同步的工作，希望帮助到开发者和需要这个功能的用户。

到了 5 月份，得到了个大好消息，允许代码被包含到 Chrome 内了，这里我的猜测是 Media 团队也看到了 2022 年这个格式越来越占据重要作用，众多开发者被逼的无能为力（很多开发者在用 WASM 方案，Chrome 其实也在推 WebCodec 方案，希望把 WASM 的场景替换掉），以及既然我们都把代码实现了，也没什么理由不让他面向大众。另一方面是我们的实现是纯硬解，无软解部分，也就是说没有什么版权风险，毕竟解码能力是操作系统提供的，硬件已经交过专利费了。

虽然默认是禁用的，但是用户可以手动传启动参数启动，因此后面大家在 8 月份用的 104 正式版，测试这个功能都是通过手动传启动参数搞定的。

然后在我们搞完这三个平台后，Chrome 的 Ted 老哥把 Android 的也搞了，因为 Linux 和 Chrome OS 共用的 VAAPI 代码，所以就这么把全平台都支持了。

有了群众基础 + 大量网友（大多数都是真发烧友！）参与测试，提供了很多宝贵的反馈建议，在测试过程也发现了不少小问题，并一一解决了（包括 WebCodec 支持，最初遗漏了这个 API，107 才补上，PS: Jianlin 贡献这块的代码），同时反向解决了 Edge HDR 颜色异常的问题，因此网友也是开发过程的一个主要部分。

整个 8 - 10 月份，我俩基本都是各种为 Windows，macOS 这两个平台搞了一些修修补补的工作，为最终面世去完善，包括如何让检测是否支持硬解，最大分辨率是多少的接口 (navigator.mediaCapabilities) 更准确，如何让 HEVC with Alpha 工作，如何解决 Intel 12 代核显开 HDR 崩溃，如何解决 HDR10 元数据提取不到等问题。

### 遇到的最困难的问题是什么？

最大的困难可能是功能前期的测试阶段的痛苦。为了验证功能的稳定性，我们在内部有一个 200 人左右的群，因为硬解**哪怕有一块逻辑，或字段传错，轻则视频花屏，不能播放，重则 GPU 进程崩溃**，因此在测试前期遇到了部分用户崩溃的问题。

我们就遇到了一个问题，那个视频存在分辨率突变的情况，然后这种情况在初版实现是处理不当的，没有重新创建解码器，最终导致了 GPU 进程崩溃，用户会质疑为什么他们之前用的好好的，现在要切过来当小白鼠，我只能给他们暂时切回旧版，再承诺新版修好，总有种对不起用户的感觉。

还遇到过一个隐藏非常深的 Bug，问题源于对 ref\_pic\_list0, ref\_pic\_list1 这两个字段的理解不正确 ，最终视频解码的具体表现就是花屏，花屏与我们平时的 Debug 逻辑不一样的是，它不会产生任何报错信息，当时是把所有 h265\_parser, h265\_decoder, h265\_accelerator 的逻辑都反复看 N 遍，没有什么好办法，后来一点点对照着 FFMPEG 写好的 D3D11 解码逻辑看（D3D 加速的参数传递是一致的），因为二者的解码逻辑没什么相似之处，字段名也不太一致，这个问题看了连续 3 天，最终解决了这个问题。

在内部实验过程中还发现，对于硬解来说，需要占用一定量的显存，我们在写逻辑时，如果一个 video 标签在结束播放后没有将 src 重置空，直接移除 video 标签，会导致显存不释放，这对于 N 卡来说不会有问题，N 卡有兜底处理，但是到了 I 卡这块，显存用多了会导致 Context Lost，进而使 GPU 进程崩溃，当时一度以为是我们自己的代码写的有问题，结果后来发现是 GPU Driver 边界 Case 处理的问题。

其他的问题，比如我们之前的实现是用 JS 库，可能在一些地方处理的不是很好，因为软解具有比较高的容错能力，所以 JS 库在之前软解版本是没啥问题的，但由于硬解对数据内容的要求更高，类似的问题在初期负责 JS 库开发的同事解决了 3-4 个后，才逐渐稳定，让 JS 库与 Native 硬解磨合本身也是个复杂的过程。

另一个稍微有点痛的点是因为和美国有时差，经常要半夜起来和 Reviewer 解决 Code Review 的问题，改代码。当然也可以拖到第二天再回复，但那样一个 Commit 可能来来回回要 3-7 天才能合入，为了提高效率，经常半夜起床回消息改代码，好在我睡眠质量非常好，Review 完可以很快继续睡着，就这样，这个过程持续了大半年。

### 在实现上自己比较满意的点？

基本不输给 Edge 和 Safari，各项指标和稳定性都达到了预期的水平，并在格式支持上比他们更好。

最终效果上，与 Edge 主要的不同点是不需要装 HEVC 视频扩展插件，因为 Windows 是直接用的系统 D3D11 的能力，而 HEVC 视频扩展（Media Foundation）不是每个人都会装，且在微软官方商店是收费的，很多小白用户各种不会装，具体可以到网上搜索类似的教程，非常多，这个非常不利于视频网站大规模部署 HEVC 视频。另一方面是 HDR 视频的显示，Chrome 相比 Edge 在处理 PQ 和 HLG HDR 时，不管在 SDK 显示器或 HDR 显示器都能很好的进行色调映射。

与 Safari 的不同点可能是比较少的，因为 macOS 的硬解框架就一个 VideoToolbox。在能力上平分秋色，Safari 还支持杜比视界 Profile 5，我们还不支持，但 Safari 目前非常 “挑格式”，很多 mp4 视频无法直接播放，且还不支持 WebCodec API，而 Chromium 已经可以支持的很好了。除此之外，二者都可以很好的以 EDR 方式显示 HDR 视频内容，且都可以支持杜比视界 Profile 8，HEVC with Alpha。

### 这次的版本还有哪些其他有趣的能力？

1.  在 Chrome 107 版本，**支持了 HEVC Rext Profile**，换句话说就是在支持硬解 Rext 的平台：比如使用 Apple Silicion 的 macOS，使用 Intel 11 代及以上核显的 Windows 平台，**使 Web 平台做 HEVC 10Bit 422 剪辑至少已经成为了可能！**
2.  在 Chrome 107 版本，**首次为 WebCodec 支持了 HEVC 8Bit 的解码！** \*\*\*\* 这可以给开发者很多空间去使用 HEVC 硬解做很多灵活的能力。
3.  在 Chrome 108 版本，**支持了 10Bit 以上 HEVC WebCodec 解码**，至此 WebCodec 可用性可以达到与 MSE API 基本一致的程度（尽管目前Canvas HDR 支持的还不够好） 。
4.  在 Chrome 108 版本，**macOS 平台支持了 HEVC with Alpha，** 如果想渲染带透明度图层的视频，之前是只能选择 VP9 with Alpha 的方式，HEVC with Alpha 相比 VP9 with Alpha 有两个主要优势：支持硬解 ，性能更好；支持在 WebCodec API 解码时保留 Alpha 图层，是 WebCodec API 下首个支持保留 Alpha 图层的编码格式（VP9 不支持），对于 Web 动画广告场景，HEVC with Alpha 可能是个好主意。

### Chromium 开发有哪些感受可以分享？

Chromium 成为世界范围最受欢迎的浏览器内核不是没有原因的，这里按我的理解，首先是 Chromium 开源的机制，所有的第三方开发者与 Google Chromium 员工一样，都可以享受良好且稳定的开发体验，比如代码编译，搜索，提交，这是其成功的最主要基石 - 群众基础。当第三方开发者提交 Commit 数大于 10 以后还可以申请成为 Committer，并拥有 CQ Dry Run，Code Review +2 ，Assign Crbug 等其他 Project Member 权利。

然后是完善的版本发布策略，Chromium 以 Milestone xxx 作为版本号，大致上一个月新增一个版本，开发版本与线上版本有大概 1 个半月的代差，也就是说开发者有充足的时间在浏览器面世前解决遗留的 Bug，并以 Cherry Pick 的方式将 Hot Fix 提到 Branch Cut 后的 Milestone 版本上。

其次是完善 + 极其严苛的 Code Review 机制，Chromium 的 Code Review 整体上非常严格，Chromium 开发者大部分都十分严谨，为 Chromium 项目工作 10 年以上的 Google 员工比比皆是，大都经验充分，认真负责，对技术有极致追求，为我 Review 代码的 Dan Sanders, Dale Curtis 都非常认真，且为 Chromium 工作至少 10 年了，他们对 Web Media API 的透彻理解令人震惊。

最后是 Chromium 的测试机制，Chromium 没有 QA，大部分测试均依赖研发自己的写 Unit Test，大家都能很好的遵守其机制，基本上每一块逻辑都有 Unit Test 覆盖，Chromium 每个操作系统的不同版本都有很多 Test Runner，24 小时不间断定时跑测试用例，Chromium 会有 Sheriff ([www.chromium.org/developers/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.chromium.org%2Fdevelopers%2Ftree-sheriffs%2F "https://www.chromium.org/developers/tree-sheriffs/")) 来监控测试用例失败的情况，并及时Revert 掉导致 Unit Test 失败的代码。Chromium 同样要求有 Fuzzer Test 覆盖，以及有很多内存自动监控的测试 Case，会自动创建 Crbug，将有崩溃或性能退化可能的 Commit 通知到开发者，整体看 Chromium 的开发流程非常的完善 + 规范。

### 后面有什么计划？

1.  目前 HEVC with Alpha 平台的实现，使用 RGBA format 渲染，还不是他能达到的最佳性能状态（存在 YUVA 到 RGBA 的转换损耗），因此近期会为他实现 NV12A (NV12 + Alpha)支持，这样大概还能提升 66% 左右的性能，达到与 Safari 一致的性能水平。

2.  继续为 Windows 平台做 HEVC with Alpha 实现，尽管 D3D11 目前的设计实现这个功能可能会比较复杂，但是理论上还是可以依靠调度去做这个事情的。

3.  继续提升 HDR Tone Mapping 的性能，一个是目前 Windows 平台的代码路径还不是 Zero Copy，解码时显存会占用比较多，Zero Copy 支持后 HDR -> SDR 会降低大概 50% 显存占用，再一个是目前 Canvas 绘制 HDR 内容颜色还是存在问题。

4.  背靠 Jianlin 大神，把 macOS WebCodec 编码也搞上去，至少让 WebCodec 在主流 PC 平台 HEVC 编码成为可能。背景：Jianlin 最近一直在做 Windows MF HEVC 硬件编码的工作（目前代码已经合入 M109，Windows 平台编码通过 Chrome Switch 的方式已经可以使用了）。

必须一起做点什么
========

经历并目睹了整件事情，从业务的问题解决，到技术攻关，开源贡献代码，最后在更大范围内给社区带来了便利，这里面个人能力固然非常重要，除此之外也有几个感悟给大家分享。

1.  信心很重要。思达在工作中有很多突破，这些逐步累积起来的信心，在过程中起到了强烈的心理暗示帮助突破一层又一层的困难。在信心之上，是对细节完美追求执着的态度。笔者在这两点上也时常做自我暗示并受益匪浅：在一个劳累的晚上本想偷个懒，但另一个声音告诉自己，你写的啥玩意自己都看不上，优化优化吧，而后者正好是帮助成为更好自己并建立信心的一个途径。
2.  第一性原理。与现状是什么样相比，这个事情理应如何更为重要，我们应该朝着理应如何的这个方向前进，这决定了我们的天花板。笔者团队的客户端小组当初对突破 Chromium 内核实现硬解的方案是非常一致和明确的，所以我们敢顶住业务压力去投入（主要还是思达说了这事可以~）。更为保险的是网上常见的 WASM 软解方案，或许不会有人质疑你的决策，但我觉得在一个错误方向去折腾太无趣。
3.  但行好事，莫问前程。找到方向尽量试试看，失败了也不要紧。尤其对团队的管理者而言。就这件事情，发生在笔者所在的团队，我们不是 Chrome 的 Media Team，不是公司里面视频架构团队，没有资深的视频编解码和 C++ 领域的大神，凭什么就突破了，我觉有一点就是敢做。

从概率上看，大家在日常工作中大部分精力和时间，或疲于应对常态化岗位职责，或处在庞大复杂的系统架构中找不到关键的突破口。类似 HEVC 硬解实现这种跨领域推动的事情还会发生更多，找到认定或感兴趣的方向，及时行动起来，找到更多志同道合的人一起前进，必须可以一起做点什么的。