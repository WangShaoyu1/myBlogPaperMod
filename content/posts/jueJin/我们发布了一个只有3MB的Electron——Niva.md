---
author: "brambles"
title: "我们发布了一个只有3MB的Electron——Niva"
date: 2023-05-17
description: "背景从Electron2013年随着Atom编辑器一起面世开始到现在经过了十年，Electron凭借其跨平台、简化开发、强大的扩展性和利用了前端和Node.js丰富的生态系统等优势"
tags: ["前端","Electron","JavaScript"]
ShowReadingTime: "阅读8分钟"
weight: 408
---
背景
--

从 [Electron](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.electronjs.org%2F "https://link.zhihu.com/?target=https%3A//www.electronjs.org/") 2013 年随着 Atom 编辑器一起面世开始到现在经过了十年， Electron 凭借其跨平台、简化开发、强大的扩展性和利用了前端和 Node.js 丰富的生态系统等优势，一举成为了最流行的跨端桌面应用开发框架。虽然 Electron 能力强大且便捷，但是也因其庞大的体积深受诟病。尤其是使用 Electron 开发的应用越来越多的今天，随便一个功能简单的应用都带着 100M+ 的庞大体积，所以也常常被吐槽成「电子垃圾」。

既然 Electron 没办法尽善尽美，那么一定会有后来者和竞争者来挑战 Electron 的地位，比如 [Tauri](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Ftauri.app%2F "https://link.zhihu.com/?target=https%3A//tauri.app/")。Tauri 也是一个跨平台桌面应用框架，由于 Tauri 并没有带 Node.js runtime 以及使用了系统 Native Webview，所以能让使用 Tauri 构建出来的应用非常小。一个 Hello world 程序仅只有 6MB 左右。

但是不同的是 Tauri 需要开发者使用 Rust 来开发应用，用前端技术来开发 UI。所以 Tauri 的定位更多是面向 Rust 开发者提供跨端桌面应用的解决方案，而对于普通不熟悉 Rust 的前端开发者来说，Rust 上手难度过高、生态也没有 Electron 丰富，并且由于 Rust 作为一个相对底层的语言需要开发者自行兼容多平台系统调用等问题。这些问题让 Tauri 一直处于不温不火的状态。

Electron 功能强大生态丰富，却及其庞大和臃肿，如果项目本身功能简单则会显得非常不划算。而 Tauri 虽看上去精简轻量，但对于普通前端开发者还是过于不友好。那没有已没有可能在这中间找到一个折中呢？那么接下来有请我们的主角 Niva。

Niva 简介
-------

Niva 同样也是一个跨端桌面应用开发框架，旨在用最简单的方式让前端快速用纯前端技术快速构建自己的跨端桌面应用。使用 Niva 不需要额外学习类似 Electron 、Node.js 或者 Rust 等额外的新知识，只需要会纯粹的前端技术就能开发桌面应用。

Niva 具备超轻量、极易用、图形化和跨平台四大亮点：

*   超轻量 —— 构建出来的可执行文件最小只有 3MB+。
*   极易用 —— 仅使用纯前端技术开发应用，甚至可以不需要学习 Node.js。
*   图形化 —— 提供图形化开发者工具，构建调试一键完成，告别黑框框。
*   跨平台 —— 无需额外配置和代码，即可构建出跨平台代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88512388479d4b76a6fdd780b4d3346b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Niva 的亮点

Niva 提供带有图形界面的开发者工具，一键导入现有前端项目、一键调试、一键构建成，所有操作一键完成，告别黑框框：

*   [从 Vue 项目中导入 | Niva](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fbramblex.github.io%2Fniva%2Fdocs%2Ftutorial%2Fimport-project-from-vue "https://link.zhihu.com/?target=https%3A//bramblex.github.io/niva/docs/tutorial/import-project-from-vue")
*   [从 React 项目中导入 | Niva](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fbramblex.github.io%2Fniva%2Fdocs%2Ftutorial%2Fimport-project-from-react "https://link.zhihu.com/?target=https%3A//bramblex.github.io/niva/docs/tutorial/import-project-from-react")

![动图封面](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79e2e466d5ba42a4a72186caaf928d1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

项目拖入构建一气呵成

Niva 也拥有丰富的系统 API，直接注入窗口 Webview，可以直接从前端代码中调用系统能力。同时 Niva 也为这些 API 提供了完善的文档。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b8906a9c23b47829b3b75f31ec57f5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Niva API 文档

*   Niva 官网 & 文档：[Niva - 轻松构建超轻量级跨平台应用，Niva 让开发变得简单！ | Niva](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fbramblex.github.io%2Fniva%2F "https://link.zhihu.com/?target=https%3A//bramblex.github.io/niva/")
*   Niva Github：[github.com/bramblex/ni…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Fbramblex%2Fniva "https://link.zhihu.com/?target=https%3A//github.com/bramblex/niva")

Niva 的目标
--------

虽然我们在标题中直接将 Niva 跟 Electron 对标，但需要承认 Niva 跟 Electron 实际上完全不同。对标 Electron 的目的一是利用 Electron 培养出来的认知来跟大家说明 Niva 做的事情大概的轮廓，二是当一回标题党博眼球蹭点流量。所以我们也在这里讲清楚 Niva 与 Electron 和 Tauri 等到底有什么不同。

要讲清楚各个跨端之间有什么不同，我们先从 Electron 、Tauri 和 Niva 的架构讲起。我们可以简单将这几个框架的架构简化成「前端」和「后端」两部分，前端负责绘制窗口和 UI，后端负责后台运行的逻辑，如下图所示。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/159f59bbcd384baf91a458295781299a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

不同框架的架构

首先是 Electron，它的前端使用的是 Chromium，后端使用的是 NodeJS。Electron 的优势和劣势很大程度上就来自于 Chromium 和 NodeJS，我们常说 Electron 庞大，是因为 Chromium 和 NodeJS 体积本身就非常庞大，而内置了 Chromium 和 NodeJS 的 Electron 那自然也非常强大。但是另一面，Chromium 还是 NodeJS 都功能强大并且生态丰富，并且经过长期的迭代与大量的验证，兼容性和稳定性都非常好，而这一切的优点同样也被 Electron 继承了下来。

接下来是 Tauri，前端使用的是系统原生 Webview，比如在 Windows 上使用 Webview2（Edge 浏览器自带的 Webview 组件）、在 MacOS 上使用 Safari 等等。Tauri 后端使用的是 Rust。因为 Tauri 使用了系统原生 Webview，所以不需要带上庞大的 Chromium，同时后端也应用了一个不需要带庞大 Runtime 的编程语言，所以能将构建的应用降低一个数量级，一个 Hello world 应用仅有 6M+。

作为代价， Tauri 前端的兼容性和稳定性远不如 Electron 的 Chromium。用 Tauri 构建的应用在除了因为不同平台 Webview 不同而需要开发者自行进行兼容，当然作为一个合格的前端开发者来说兼容不同平台的浏览器算是基本工，但是最致命的是 Windows 的 Webview2 尚不成熟，在低版本的 Windows7 上面会出现白屏等恶性 bug。当然随着 Windows 11 的推广和大家电脑更新换代这个问题会慢慢变好，但这个问题本身是无法忽视的。Tauri 第二个问题则是 Rust，Rust 作为一个偏底层的语言短期内前端开发者很难掌握，并且因为底层所以很多时候要跟具体的操作系统打交道，手动处理不同系统的兼容性问题，这远超一个前端开发者的能力范围。

讲完了 Electron 和 Tauri 我们来总结一下：

*   Electron 使用 Chromium 和 NodeJS，面向的是有 NodeJS 基础有工程化能力的前端开发者和团队，适合做对稳定性兼容性有要求，但对体积无要求的较为重量级的应用。
*   Tauri 使用系统 Webview 和 Rust，面相的是有 Rust 和跨端基础的团队，更适合给 Rust 项目做 UI。

那么 Niva 呢？Niva 正如上图所示，Niva 也使用了系统的 Webview 作为前端，甚至直接使用了 Tauri 的跨端 Webview wry（[github.com/tauri-apps/…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Ftauri-apps%2Fwry "https://link.zhihu.com/?target=https%3A//github.com/tauri-apps/wry")），但与 Tauri 不一样的是 Niva 并没有后端，而是将所有的逻辑和 API 全部放在前端 Webview 里面进行实现，不需要开发者直接 Rust。如果需要有后台的逻辑的话，Niva 可以直接将主窗口隐藏起来作为后端使用，就想很多小程序架构一样。并且后续版本的 Niva 会增加 Miniblink（[Miniblink - 免费小巧开源的浏览器控件](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fminiblink.net%2F "https://link.zhihu.com/?target=https%3A//miniblink.net/")） 作为 Niva 可选地 Webview，用于解决低版本 Windows7 的兼容性问题，作为代价就是增加一部分 Miniblink 的体积。

所以 Niva 的目标与 Electron 和 Tauri 都不同，Niva 有两个目标：

1.  Niva 目标成为面向的有前端基础甚至是仅有前端基础的开发者，用于快速构建轻量应用的跨端应用框架。
    
2.  Niva 目标成为其他任意编程语言或者 Runtime 用来实现跨端 UI 的一个解决方案。Niva 没有后端，但是任何编程语言都可以通过调用 Niva 的可执行文件来显示自己想想要的 UI。
    

Niva 接下来要做什么
------------

目前 Niva 的功能以及基本能用，我们用 Niva 开发的第一个应用就是我们的 Niva Devtools 开发者工具，甚至我们的实现了 Niva Devtools 的自举，用 Niva Devtools 构建出了 Niva Devtools（套娃）。现在发布的版本是 v0.9.9，可以理解为一个 Beta 的版本，我们希望补全部分功能，并经过充分测试以后修复 bug 以后发布 v1.0.0 的稳定版本。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c8093b90504347bd4a204ff290f129~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Niva Devtools 本身也使用 Niva 进行开发

然而为了达到我们的目标，依然还有很多事情需要做，我们规划将有两个里程碑：

*   V1.0.0 版本
*   *   提供 Niva Devtools 的 CLI 版本，让 Niva 的的构建工作能跟 CI / CD 结合。
    *   提供流式 io API，尤其提供流式的 stdin / stdout 操作，用于跟其他程序之间的项目配合。同时 Niva 也需要支持通过 stdin / stdout 跟 Webview 进行通讯和交互。
*   V2.0.0 版本
*   *   会增加 Miniblink 作为可选的 Webview，用于提供低版本 Windows7 的兼容。
        

在后续的版本还会有对 Linux 平台的支持，考虑增加一个可选的 quickjs 作为后端等等，但还没具体想好放在哪个版本实现。

联系我们
----

最后，如果对项目有兴趣，或者在使用中遇到问题，也欢迎加我 wx：bramblesX 加入讨论群~