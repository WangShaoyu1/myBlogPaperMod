---
author: ""
title: "掘力计划22期-基于 WebAssembly 打造一个纯浏览器上的POSIX 运行环境"
date: 2023-08-24
description: "8月19日，在掘力计划系列第22场《聊聊前端工程化实践和未来》活动中，来自阿里的刘睿老师受邀进行了一场主题为《基于 WebAssembly 打造一个纯浏览器上的POSIX 运行环境》的技术分享。 刘睿"
tags: ["前端","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:13,comments:1,collects:15,views:1688,"
---
8月19日，在掘力计划系列第22场《聊聊前端工程化实践和未来》活动中，来自阿里的刘睿老师受邀进行了一场主题为《基于 WebAssembly 打造一个纯浏览器上的POSIX 运行环境》的技术分享。

![](/images/jueJin/1019e9738a5548f.png)

刘睿老师是一位拥有8年互联网工作经验的专业人士，他目前就职于阿里巴巴TRE工程基础服务团队，主要从事于中后台、内部工具产品的应用层开发，在领域内有着丰富的实践经验和深厚的技术功底。

这次刘老师结合自身在WebAssembly领域的研究与探索，通过介绍阿里内部开发的WebIDE产品WebC与目前市面上类似产品讲述了WebAssembly在构建纯前端POSIX运行环境方面的应用没，以及与之相关的技术和实现方式。

背景
--

在 2021 年 Google I/O 大会上，StackBlitz 正式推出了与 Next.js 以及 Google Chrome 团队合作开发的一项基于 WebAssembly 的新技术，名为 [WebContainers](https://link.juejin.cn?target=https%3A%2F%2Fwebcontainers.io%2F "https://webcontainers.io/") 。

基于 WebContainers （以及开源的 VS Code Web），StackBlitz 构建了全新的在线 IDE 产品 CodeFlow。

![](/images/jueJin/1bd486f3fd95438.png)

刘睿老师提到在阿里内部也存在云端研发场景的用户诉求存在，因此从去年开始就在着手打造类 “WebContainers” 相关的产品，面向云研发用户提供高效运行 Node.js 、bash、git、 Core Utils等终端能力。

WebContainers 的优势相比于WebIDE无容器、WebIDE Docker的方案更加的轻量且无额外成本，功能相对完善。因此，伴随着WebContainers技术的出现，基于WebContainers的WebIDE体验普遍获得了明显的体验提升。

> 在下文中，我们将WebAssembly和WebContainers分别简称为WASM和WebC，以便更加简洁和方便地提及它们。

WebC 实现方式
---------

类比本地而言，WebC 更像是一个运行在浏览器上的操作系统。不同之处在于Wasm 跟 WebC 有两层关系：

1.  WebC 本身使用 Wasm 实现。
2.  .wasm 是 WebC 中的可执行文件格式，就好比 ELF 之于 \*nix、PE 之于 Windows、Mach-O 之于 macOS。

如下图所示：

![](/images/jueJin/d2ece77c975d43d.png)

### 数据传递

浏览器 Worker 间传递数据通常存在三种方式：

*   ArrayBuffer + MessageChannel (COPY)
*   ArrayBuffer + MessageChannel + transferable (MOVE)
*   SharedArrayBuffer + Atomics

虽然 ShardArrayBuffer 因为安全问题被浏览器默认关闭，但是ShardArrayBuffer +Atomics方案依然是目前比较好的数据传递方式选项。其原因主要是因为 WebC 大量核心逻辑(文件系统、进程管理、管道、TTY/PTY等)由 C++实现，而在 Wasm 中调用诸如 PostMessage等 Web API需要JS 做大量胶水工作。

![](/images/jueJin/a80cb1be72b84c0.png)

从 WebC 多进程深⼊ Wasm
-----------------

类⽐本地，WebC 更像是⼀个运⾏在浏览器上的操作系统，WebC 本身也是使⽤ Wasm 实现的。

![](/images/jueJin/9d96a81c1f66405.png)

### WebC 共享内存设计 & Wasm 类型

WebC在设计上选择了SharedArrayBuffer+Atomics的方案进行不同进程间的数据传递。相比消息通道的传递方式,这种基于共享内存的设计可以避免大量的数据拷贝开销。Wasm中的SharedArrayBuffer和Atomics可在多线程/进程间高效安全地进行数据交换。这也更契合WebC的场景,大量核心逻辑由C++编写,消息通道方式将带来更多JS胶水层的额外性能损耗。

![](/images/jueJin/07bdbc4571bb422.png)

### 内存隔离问题 & Wasm 内存和变量

WebC需要在不同的进程间进行内存隔离。Wasm中的内存布局包括Global、Local和Linear Memory三个部分。其中Global区域可以用于实现数据的逻辑隔离。WebC就是通过控制Wasm的内存布局,为每个进程预留独立的Global内存空间,从而实现了进程间内存的隔离。这展示了Wasm内存模型的灵活性和隔离特性在构建安全的运行环境方面的应用价值。

![](/images/jueJin/b6bc418924524f2.png)

![](/images/jueJin/cabe6114c5b54a4.png)

### Fork 函数 & Wasm Call 和 Stack-Switching

“fork”函数可以通过保存和恢复程序计数器来实现进程的创建。但是在Wasm中,函数的调用对开发者是不透明的。Wasm中的调用无法保存和恢复调用现场。这也导致了Wasm目前无法调用异步JS接口的问题。Stack-Switching提案将通过“栈切换”功能实现类似于fork的上下文切换效果。这为Wasm带来了实现类似fork的能力。

![](/images/jueJin/f1d79c734ce4431.png)

### WebC “系统调⽤”& Wasm Linking

WebC 并没有真正的系统调⽤，但是依然存在程序访问系统接⼝的过程。⽬前 Wasm Module 之间是⽆法直接 link 的，⽐如在前端，我们必须使⽤ JS 作为胶⽔层。解决这个问题的 Wasm Module Linking Proposal 也被合⼊ Component Model Proposal(阶段1)。

![](/images/jueJin/1ee6c2d2fa1c497.png)

### Pipe & Wasm 编程

以下示例展示了Wasm提供底层内存访问和计算的优势,可进行更高效的位操作和内存管理。

![](/images/jueJin/7020eca18fed4d2.png)

![](/images/jueJin/f5d58c98e81d462.png)

![](/images/jueJin/c0890b0b08e44a8.png)

对 Wasm 未来的一点小期待
---------------

刘睿老师提到说现在的 Wasm 并没有像期待的那样给前端带来革新，根据Results for js web frameworks benchmark得出的调研结果来看目前基于 Wasm 的前端框架性能普遍上不如 JS 框架。

![](/images/jueJin/542cba83607b486.png)

或许是由于WASM本身功能的缺陷导致需要大量胶水层产生来修补才能够很好的进行工作，当 Component Model，Stack-Switching, GC 这些 proposals 落地之后，Wasm 在前端的应用可以完全摆脱对 JS 的依赖以及胶水层产生的性能损失，基于 Wasm 的前端框架可以充分发挥自己的性能优势。

如下图所示：

![](/images/jueJin/44a4747f43894d5.png)

总结
--

WebC产品展示了Wasm构建浏览器运行环境的可能性。但要发挥Wasm性能优势,仍需不断迭代和优化。本文对其实现原理和应用场景进行了一定分析,希望对相关领域的探索提供一定借鉴和启发。

### 参考资料

[krausest.github.io/js-framewor…](https://link.juejin.cn?target=https%3A%2F%2Fkrausest.github.io%2Fjs-framework-benchmark%2F2023%2Ftable_chrome_116.0.5845.82.html "https://krausest.github.io/js-framework-benchmark/2023/table_chrome_116.0.5845.82.html")

[webcontainers.io/](https://link.juejin.cn?target=https%3A%2F%2Fwebcontainers.io%2F "https://webcontainers.io/")

关于掘力计划
------

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。