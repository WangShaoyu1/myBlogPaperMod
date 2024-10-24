---
author: ""
title: "掘力计划第 20 期：恋猫的小郭-Flutter 混合开发的混乱之治"
date: 2023-07-31
description: "掘力计划第 20 期：Flutter 混合开发的混乱之治 回放链接：httpslivejuejincn4354jpowermeetup20 在掘力计划系列活动第20场，《Flutter "
tags: ["Flutter","Dart","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:17,comments:4,collects:9,views:1924,"
---
掘力计划第 20 期：Flutter 混合开发的混乱之治
============================

回放链接：[live.juejin.cn/4354/jpower…](https://live.juejin.cn/4354/jpowermeetup20?ch=hf "https://live.juejin.cn/4354/jpowermeetup20?ch=hf")

**本场沙龙系列文章：**

[Topic1:掘力计划第 20 期：崔红保-跨端框架性能优化实践](https://juejin.cn/post/7261897250648866853 "https://juejin.cn/post/7261897250648866853") 

[Topic2:掘力计划第 20 期：Flutter 动态方案 Fair 原理与实践](https://juejin.cn/post/7261885938086412325 "https://juejin.cn/post/7261885938086412325")

[Topic3:掘力计划第 20 期： Pake —— 利用 Rust 轻松构建跨端轻量级应用](https://juejin.cn/post/7261897250648932389 "https://juejin.cn/post/7261897250648932389")

在掘力计划系列活动第20场，《Flutter 开发实战详解》作者，掘金优秀作者，Github GSY 系列目负责人恋猫的小郭分享了Flutter 混合开发的混乱之治。

![](/images/jueJin/ac455c211aa64ac.png)

![](/images/jueJin/0b61582463034e4.png)

Flutter 基于自研的 Skia 引擎实现了跨平台高性能渲染，但其独立的渲染层带来了与 Android 混合开发的技术挑战。经过几年的演进，Android 目前提供了多种混合渲染方案，但都无法完美解决问题，且共存于 Flutter API 中，增加了复杂性。本文将深入解析 Flutter Android 混合开发面临的困境，以及开发者应对策略。

Flutter 独立的渲染机制
---------------

![](/images/jueJin/41337e3d1f8d425.png)

Flutter 能够跨平台高性能渲染的关键在于其自研的 Skia 图形渲染引擎。Skia 通过自身的 renderers、GPU 线程等直接与 GPU 层进行交互，实现绘图功能。这使得 Flutter 的渲染层可以独立于 Android 的原生 UI 线程之外。

这种独立的渲染机制给 Flutter 带来很大优势，不依赖原生视图层即可实现高效的跨平台渲染。但是同时也导致了 Flutter 要与原生视图进行混合开发时的困难。

如果用一个简单的类比，Flutter 更像是一个游戏引擎。想要往 Unity 这类游戏引擎中插入原生 Android 视图，就像往 HTML 中直接嵌入一个 Canvas 元素一样困难。这需要游戏引擎提供针对性的接口与机制，将不同的 UI 系统进行「适配」。

![](/images/jueJin/663665ab94e14aa.png)

针对这个问题，Android 和 Flutter 社区也经历了多年的探索，提供了一系列的混合渲染方案。

Android 混合渲染方案演进
----------------

Android 在支持 Flutter 混合开发时，经历了多种技术方案的演进过程。现阶段主要存在以下三种混合渲染技术：

### VD 模式

![](/images/jueJin/298070738cdb468.png)

VD 全称 Virtual Display，表示利用虚拟显示的方式进行混合渲染。其关键是采用 VirtualDisplay 将原生视图渲染到一个内存缓冲区中，得到相应的渲染纹理。

Flutter 通过特定的 API 调用，可以获取这个渲染纹理，并集成到自身的 Scene 中进行统一渲染。

VD 最大的 特点就是渲染的控件其实不是真实存在屏幕位置，而是在内存，所以容易有触摸和键盘问题。

### HC 模式

![](/images/jueJin/c7451a4d292b404.png)

HC 全称 Hybrid Composition。它的思路是直接将原生视图通过 Add View 的方式添加到 Flutter 的 View 层次中，进行物理层面的视图混合。

![](/images/jueJin/510d467d769b431.png)

这种直接混合模式可以保存原生视图的用户交互，并且可与 Flutter 视图自由叠加。但是由于需要跨线程同步渲染，可能会引入一定的性能开销。

### TLHC 模式

![](/images/jueJin/da65a0e13eca44b.png)

TLHC 即 Texture Layer Hybrid Composition。这是 Android 团队後期提出的方案，试图结合 VD 和 HC 两种模式的优点。

TLHC 会通过 hook 原生视图的 onDraw 方法，将其渲染输出重定向到内存中，再提供给 Flutter 作为纹理。这样既避免了线程同步，也可以像 HC 那样自由布局。

但是 TLHC 不支持 SurfaceView 等基于独立 Surface 的视图类型。对于一些依赖 SurfaceView 的逻辑，如地图或视频播放，TLHC 存在兼容性问题。

共存的模式带来的困境
----------

经过几年的演进，Flutter 现在已经可以通过上述三种模式支持 Android 混合开发了。但它们都存在自身的优劣势，无法解决所有的问题场景。

![](/images/jueJin/26cb7a47416245f.png)

更重要的是，这三种模式现在同时存在于 Flutter 的 API 中，可以被开发者同时使用：

```scss
// VD模式
initAndroidVew()

// HC模式
initSurfaceAndroidView()

// TLHC模式
initAndroidView()
```

这其实带来了很大的复杂性。首先，开发者需要自行理解不同模式的适用场景，进行正确的调用。

其次，随着 Flutter 版本的演进，默认的模式也在变化。例如在早期只有 VD，到 1.2 提供 HC，3.0 又引入 TLHC。这意味着在版本升级后，你的混合视图可能会在不知情的情况下发生渲染模式变化，导致问题。

再者，TLHC 存在对 SurfaceView 的兼容性问题。就算默认使用 TLHC，后续引入 SurfaceView 也可能触发问题。

![](/images/jueJin/b32658e85e964a0.png)

除此之外，不同模式的性能开销也存在差异。HC 和 TLHC 的额外渲染消耗需要评估。模式切换也可能影响渲染性能。

综上所述，困扰 Flutter Android 混合开发的主要问题在于：

*   存在多种共存的渲染模式，各有特性，选择复杂
*   模式之间兼容性存在，可能引入难以察觉的问题
*   性能开销和稳定性难以保证

这已经成为困扰 Flutter 混合渲染的主要困境。

开发者应对策略
-------

面对复杂的混合渲染困境，Flutter 开发者也形成了一些应对策略：

1.  优先使用 TLHC 模式，能覆盖更多场景
2.  调用时详细指定模式，不要依赖默认值
3.  注意版本变更带来的潜在问题
4.  留意是否引入了 SurfaceView 等不兼容场景
5.  评估不同模式的性能开销区别
6.  通过自身封装控制模式变更范围
7.  提前测试不同模式的兼容性

当然，这需要开发者对不同混合渲染模式有足够的理解，才能做出正确的技术选型。实际使用中也需要关注模式带来的兼容性风险，建立健壮的自测方案。

未来 Flutter 混合渲染模式是否还会继续增多也需要持续跟进。理想情况下，如果能够演进出一个统一的混合解决方案，将大大简化 Android 平台的混合开发。

总结
--

Flutter 基于 Skia 的独立渲染机制，给其在 Android 平台的混合开发带来了挑战。经过几年探索，Android 形成了多种混合渲染方案。但都无法完美解决问题，它们的共存也增加了复杂性。

开发者需要深入理解不同模式，并有针对性地进行场景选择和风险评估。未来仍需要社区持续努力，简化这一关键的技术难题，以进一步发挥 Flutter 的跨平台优势。

关于掘力计划
======

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。