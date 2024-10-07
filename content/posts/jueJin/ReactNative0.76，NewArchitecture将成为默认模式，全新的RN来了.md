---
author: "恋猫de小郭"
title: "ReactNative0.76，NewArchitecture将成为默认模式，全新的RN来了"
date: 2024-09-09
description: "关于ReactNative的NewArchitecture概念，最早应该是从2018年RN团队决定重写大量底层实现开始，因为那时候ReactNative面临各种结构问题和性能"
tags: ["前端","Android","ReactNative"]
ShowReadingTime: "阅读11分钟"
weight: 666
---
关于 React Native 的 New Architecture 概念，最早应该是从 [2018 年 RN 团队决定重写大量底层实现](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Fnews%2F97129%2Fstate-of-react-native-2018 "https://www.oschina.net/news/97129/state-of-react-native-2018")开始，因为那时候 React Native 面临各种结构问题和性能瓶颈，最终迫使 RN 团队开始进行重构。

而从 [React Native 0.68](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fblog%2F2022%2F03%2F30%2Fversion-068%23opting-in-to-the-new-architecture "https://reactnative.dev/blog/2022/03/30/version-068#opting-in-to-the-new-architecture") 开始，New Architecture 被作为实验性选择加入项目，之后 2022 年 RN 团队正式发布了 JSI、Fabric、 Turbo Modules、Codegen 的 New Architecture，同时发布的还有 Hermes JS 引擎，在同年 [React Native 0.70 版本发布的时候，Hermes 成为了 RN 的默认 Engine](https://juejin.cn/post/7140474062211383333 "https://juejin.cn/post/7140474062211383333") 。

**但是由于新架构的重构导致了大量的 break change** ，所以在此之后 RN 团队开始努力推进和解决各种社区新框架问题，而直到 2024 年，新框架模式在 React Native 已经过大规模验证，并为 Meta 的生产应用提供了大量支持，**所以从 0.76 开始，整套 New Architecture 实现将成为 React Native 的默认配置**。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8f9a39f22f704446a25403519c10bc1a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=Gb%2FAZLnRUqU4AlduVoNFesjJDFI%3D)

> **虽然这么多年过去 RN 还是没有发布 1.0 这个梗依旧**，但是 RN 确确实实已经“脱胎换骨”，可以说 0.7x 和 0.6x 几乎都快不是一个项目。

正如 RN 团队所说：**2024 年是向所有 React Native 用户推出新架构的一年，事实上这也证明了，一个项目只要发展时间够长，用户基数够大，最终都会通过重新自研某些能力来解决问题，RN 是这样，Flutter 也是这样**。

前情提要
====

在 RN 上最早 New Architecture 主要围绕四个核心和一个引擎来展开：JSI（JavaScript Interface）、Fabric 、Turbo Modules、CodeGen 和 Hermes Engine，这里我们简单回顾一下他们的作用。

JSI
---

JSI 属于 JavaScript 接口，它是一个统一的轻量级通用 API，理论上适用于任何 JavaScript 虚拟机，并且它采用 C++ 实现，让 JS 可以使用它直接执行或者调用 Native 代码，所以它的作用就是让 JavaScript 接口与 Engine 分离。

> 所以 JSI 的出现让 RN 可以切换 JS 引擎，比如 `Chakra`、`v8`、`Hermes` ，同时允许 JS 和 Native 线程之间的同步相互执行，

JSI 作为接口，**它允许 JS 保存对 C++ 对象的引用**，反之亦然，例如使用内存引用时，可以直接调用方法而无需序列化成本，例如在实时处理帧数据时，JSI 可以轻松处理更大的帧速率数据，**所以 JSI 将最大限度地减少 JS 和原生内存之间的开销**。

Fabric
------

**简单理解它就是 RN 在 UI 层的重新实现**，类似取代了原本的 UI Manager，主要是为了以充分利用 React 的并发渲染能力，特别是现在的新架构支持 React 18 及更高版本中提供的并发渲染功能。

而得益于前面的 JSI， JS 可以直接调用 Native 方法，其实就包括了 UI 方法，所以 JS 和 UI 线程可以同步执行从而提高列表、跳转、手势处理等的性能。

> 在此之前，JS 和 UI 线程不同步，因此在某些情况下 App 可能会因为丢帧而显得卡顿

Turbo Modules
-------------

在之前的架构中 JS 使用的所有 Native Modules（例如蓝牙、地理位置、文件存储等）都必须在应用打开之前进行初始化，这意味着即使用户不需要某些模块，但是它仍然必须在启动时进行初始化。

Turbo Modules 基本上是对这些旧的 Native 模块的增强，现在 JS 将能够持有这些模块的引用，所以 JS 代码可以仅在需要时才加载对应模块，这样可以将显着缩短 RN 应用的启动时间。

Codegen
-------

**Codegen 主要是用于保证 JS 代码和 C++ 的 JSI 可以正常通信的静态类型检查器**，通过使用类型化的 JS 作为参考来源，CodeGen 将定义可以被 Turbo 模块和 Fabric 使用的接口，另外 Codegen 会在构建时生成 Native 代码，减少运行时的开支。

Hermes
------

Hermes 是 RN 研发的全新 JS 引擎，而之所以有 Hermes ，是因为它是专为资源受限的设备而设计的存在，并针对启动、应用大小和内存消耗进行了相应优化，Hermes 和其他 JS 引擎之间的一个关键区别是：**它能够提前将 JavaScript 源代码编译为字节码**。

Hermes 支持提前执行编译的能力，意味着启用了 Hermes 的 React Native 应用会带有预编译的优化字节码，而不是纯 JavaScript 源代码。

Hermes 的存在大大减少了为用户启动的时间，官方曾表示启用 Hermes 通常会将产品的 TTI 指标缩短近一半。

此外 Hermes 还优化了 GC 实现， 采用了 [Hades](https://link.juejin.cn?target=https%3A%2F%2Fhermesengine.dev%2Fdocs%2Fhades "https://hermesengine.dev/docs/hades") 的全新并发 GC，在 64 位设备上，Hades 在 p99.9 处仅暂停 48 毫秒，比默认的 GenGC 快 34 倍，**这也为 React Fiber 启用并发渲染，通过将渲染工作拆分为块来避免调度长 JavaScript 任务提供了良好基础支持**。

Interop Layers
==============

所以可以看到，基于 Hermes 引擎的加持，配合 JSI、Fabric 、Turbo Modules、CodeGen 的实现， React Native 像是换了「五脏六腑」，**但是这也给它的老旧适配带来了挑战**。

随着新架构的推出，社区适配成了它推进的最大阻力，这也是为什么 New Architecture 在 2022 发布之后“落地放缓”的原因，而对于 RN 团队给出的答案是：**Interop Layers** 。

> 我的项目也基本停滞在 New Architecture 之前。

在互操作层( Interop Layers )出现之前，当你尝试在新架构上使用 Legacy Component 时，你会看到如下内容：

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/df95805f41584a36880fee4895dc328a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=Q%2FjZU4nXlEd4XBaycxMabzZJQPw%3D)

而 React Native 在 0.72 添加了互操作层(Interop Layers)，**它的作用是让老旧项目「无需调整」即可运行到 New Architecture**，而 React Native 0.74 默认启用：

> Interop layer 在 New Architecture 里会重用旧版的原生组件，它属于一个平台层，允许开发者将旧组件注册到 New Renderer（Fabric）里，并将旧函数调用（例如特定属性的 setter）映射到 New Renderer 中的等效 updateProps 函数。

对于新架构，兼容升级最大的成本就是将原生组件迁移到 New Renderer ，因为需要大量时间，并且通常无法自动化，因为范式完全不同，所以现在 Interop layer 实际上是作为一个 wrapper 存在，从而允许旧组件与 New Renderer 一起使用，例如：

> 在后台，每当 prop 更新或发送命令时，它都会转发到 New Renderer 的 UIManager ，UIManager 会将消息发送到 wrapper ， wrapper 会“小心地”将其转换为传统架构可以理解的格式，并让传统组件处理它，然后它将消息反向传递到 JS，从而更新 UI。

现在互操作层这个 wrapper 会帮助大家解决大部分问题，**虽然它并不是完全兼容**，而对于 RN 团队的目标来说，它也不是为了 100% 兼容而存在，它更多是为了过渡适配而存在，可以看到，现在在官方统计里，**1465 个 package 里已经有 851 支持新架构，所以 0.76 default 也可以说归功于 Interop Layers** 。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3b81d8b166674a41887865f711c55320~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=PB%2BGc7rB9wJ8UMewDYLxSx%2FHQpA%3D)

Bridgeless Mode
===============

Bridgeless Mode 是在 0.73 被引入，然后 React Native 0.74 默认启用，这也新架构的一个关键功能，在新架构之前，React Native 需要桥(bridge)用于 JS 和原生之间进行通信。

> 桥相当于是一个消息队列，会被用于渲染视图、调用本机可调用对象或注册事件处理程序等指令，而桥的存在限制了 React Native 的异步设计、消息批处理和序列化成本。

New Architecture 的很大一部分工作是消除 React Native 对 bridge 的依赖，例如：

*   TurboModules 将本地调用移出了桥接
*   Fabric 将组件渲染从 Bridge 移除

而 Bridgeless Mode 下，会将剩下的 React Native 运行时内容，如错误处理、全局事件发射器、计时器等从桥接中移出，并且不再初始化桥接，**也就是 React Native 0.74 将不在有桥接调用的存在**。

> 而由于完全移除了 bridge，所以这个 break change 同样需要 Interop Layers 这个 Wrapper 来充当旧版的兼容实现。

通过 Interop Layers ，大多数注册到 React Native 的遗留模块将受到新的原生模块系统 （TurboModules） 的支持。

此外，**Bridgeless Mode 使用 Static ViewConfig 优化了组件渲染**，ViewConfig 会告诉 React 原生组件支持哪些 props 和事件。

> 以前 ViewConfig 是在运行时通过分析原生组件的 ViewManager 生成的，而现在使用 Static ViewConfigs，RN 可以通过分析原生组件的 Flow 或 TypeScript spec 文件，将这项工作转移到构建时完成，如果原生组件没有 spec 文件，那么 Bridgeless 将回退到运行时 ViewConfig 生成。

Suspense & Transitions
======================

一直以来，React Native 会执行与 React for web 相同的 React 框架代码，但是 React Native 需要渲染为通用平台视图（Native 视图）而不是 DOM 节点，这在新架构之前让 RN 很难发挥出 React 的“全力”。

而随着 Fabric 的实现，RN 渲染到 Native 视图是通过 Fabric Renderer 实现，Fabric 允许 React 与每个平台通信并管理其 Native 视图实例，核心原则是在 C++ 中统一更多的渲染逻辑，提高与 Native 平台的可互操作能力。

所以新框架下“同步调用”的能力，让渲染器能够同步测量和渲染 React ，这也让 React 本身的一些概念可以被运用到 RN 上，例如：

*   与 React Suspense 集成，可以在 React 应用中更直观地设计数据获取
*   在 React Native 上启用 React 并发功能，如 Transitions

> 这也是新框架的优势，新架构支持 React 18 及更高版本中提供的并发渲染和功能，现在开发者可以在 React Native 代码中使用 Suspense 等功能来获取数据，从而进一步让 Web 和原生 React 开发之间的代码库和概念保持一致。

也就是使用 New Architecture，开发者即可获得 React 18 渲染器的自动批处理，同时并发渲染器还带来了开箱即用的改进，这减少了 React 中的重新渲染。

例如在官方示例中，通过滑块指定要渲染的图块数，将滑块从 0 拖动到 1000 将触发一系列快速的状态更新和重新渲染：

> 在使用相同代码时，可以直观地注意到新架构的渲染器提供了更流畅的 UI，中间 UI 更新较少，来自 Native 事件处理程序的状态更新（如顶部 Slider ）现在是批处理的模式。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8f1520bb3bfc4760b304efa7bf743ebc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=ZubUQ8O8VbOwPBtPJIeHP3dmXZ8%3D)

同时使用新的并发功能（如 Transitions）可以定义 UI 更新的优先级，例如将更新标记为较低优先级，告诉 React 它可以 “中断” 渲染更新以处理更高优先级的更新，以确保在重要的地方提供响应式用户体验。

例如使用 `startTransition` 配置可以中断红色方块的渲染，同时 `startTransition` 还提供了一个 `isPending` 标志来告诉过渡何时完成。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c0452719eb95405997d17d684a0e1b1f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=rUFGWGcJAj%2BWzXyh8UkTcaVcoPI%3D)

> 你会注意到，随着 transition 中的频繁更新，React 渲染的中间状态更少，因为它会在 state 过时后立即退出渲染，相比之下，如果没 transition ，则会渲染更多的中间状态。

DevTools
========

同时随着 0.76 宣布的还有 React Native DevTools，这是为了下一代重写的 React Native 调试器堆栈，它其实从 0.73 就开始存在相应支持。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fd9dd8b95d7542e2ae2c20dd4efd3bf9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=AwKSfeHtnyfhk%2Fnlar2LgxQIxjM%3D)

例如 React Native 0.73 附带的一键调试流程 ，**只需在终端中按 J 即可完成调试**，而在 0.76 中它默认可用：

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/48739cd882fd49d1bb7d3ba5c7db6da5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=n0tOOxXBhX8eDRHvm%2B3i2z3lJSk%3D)

未来
==

可以看到 React Native 的内在已经变得“面目全非”，可以说的是，虽然 RN 当时那一步踩的很大，甚至扯着🥚，但是两年过去终于是开始缓过来了，正如开头官方所说：**2024 年是向所有 React Native 用户推出新架构的一年** 。

同时 New Architecture 还在解锁其他新功能，例如 Web 对齐是也是 Meta 的一个积极探索领域，这也是 RN 开发多年的官方期盼，需要解决的例如：

*   [事件循环模型的更新](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freact-native-community%2Fdiscussions-and-proposals%2Fblob%2Fmain%2Fproposals%2F0744-well-defined-event-loop.md "https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0744-well-defined-event-loop.md")
*   [APIs 节点和布局 API](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freact-native-community%2Fdiscussions-and-proposals%2Fblob%2Fmain%2Fproposals%2F0607-dom-traversal-and-layout-apis.md "https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0607-dom-traversal-and-layout-apis.md")
*   [样式和布局一致性](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fyoga%2Freleases%2Ftag%2Fv2.0.0 "https://github.com/facebook/yoga/releases/tag/v2.0.0")

虽然已经许久没跟进 React Native ，但是还是很开心 RN 能够持续迭代推进新的能力，这样代表着项目具备旺盛的生命力，同时 RN 在鸿蒙 Next 适配上，类似 Flutter 也有 Software Mansion 和华为的同步社区支持，所以至少现在看来，RN 的未来依然可观。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/131af1f5622e4f6f97d54a452ddb9a8e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oGL54yrZGXlsI_pg60=:q75.awebp?rk3s=f64ab15b&x-expires=1727651044&x-signature=eqyGCf77q0xW05yPYpNlJLs2Gbo%3D)

> 更多资料可查阅： [github.com/reactwg/rea…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freactwg%2Freact-native-new-architecture "https://github.com/reactwg/react-native-new-architecture")