---
author: "iofod"
title: "iofod支持生成Electron桌面应用"
date: 2022-10-28
description: "前言Electron让前端使用HTML+CSS+JavaScript三驾马车就能构建美轮美奂的桌面应用，上手不可不谓简单，开发流程大大缩短..."
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 400
---
前言
--

Electron 让前端使用 HTML + CSS + JavaScript 三驾马车就能构建美轮美奂的桌面应用，上手不可不谓简单，开发流程大大缩短。这些优势让我们在众多跨平台桌面开发框架中选择了 Electron，iofod-cli 近期发布了 v1.3.0 版本，IFstruct 解析器新增对 Electron 工程的支持，助力开发者快速构建 Windows / MacOS 桌面应用。

框架选择
----

Flutter 3.x 版本宣称对 windows / MacOS 等桌面应用达到了稳定支持，但实际上很多内容都是缺少的，比如消息 Toast，Webview，视频组件等都是不可用的，这一定程度上限制了 Flutter （短期内）在桌面领域的应用范围，iofod 解析器 v1.3.0 之前的版本是通过 Flutter 来支持桌面应用的，同样避免不了这些问题。

长期来看 Flutter 跨平台的理念是先进的，只是现阶段在桌面应用开发上还不太成熟，达不到生产可用的标准。所幸 iofod 的布局系统和原子组件的设计能兼容主流的布局系统，不受制于特定技术栈，但为了复用现有生态，减少开发者的心智成本，我们优先选择类 Web 的技术栈，更青睐代码以 TS 或 JS 为主的框架，因此我们在众多桌面跨平台框架中寻觅时，对 Electron 一见如故。

![electron.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ebd3d22e4404ec98bb1ef7d763f5556~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

诚如官网所述：

> 比你想象的更简单

iofod 编辑器部分的三十多万行代码，从接入 Electron 到生成支持 Window 桌面程序文件全程不过30分钟，同样地，我们在 iofod 解析器 PCWeb 模板的基础上，稍作改造就将 Electron 模板搞定了！

基本使用
----

我们这里以 iofod 官网项目来演示下 Electron 工程的生成和使用。首先，请将 iofod-cli 升级到 v1.3.0 版本：

![npm.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1baedb3a22f4a30976ca4554e52dc84~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

终端执行命令，选择 Electron 模板：

![code1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41ebe58d5dac473cb04e5655e083d5b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以看到本地目录已经生成好的 Electron 工程：

![demo1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b47efa2af14f588e70b6654ed3b252~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

进入工程目录，安装好 npm 依赖后，开启监听 iofod 编辑器项目数据：

![code2.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c86c55abf8194e0d87ce2f373de97f0e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在 iofod 编辑器里通过 IFstruct 同步拓展将项目数据同步到工程：

![demo2.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/329e2bd1310b4964be715f931dd48767~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

执行开发模式命令：

bash

 代码解读

复制代码

`yarn dev`

预览项目效果如下：

![demo3.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a59d4d0778408b92b486e003b4ece9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

当然，桌面应用相比 Web 增加了大量调用系统原生能力的接口，不再受限于浏览器，请小伙伴们自行前往 Electron 官网获取进阶内容。

结语
--

我们将一如既往持续关注 Flutter 这一新势力，将其作为未来跨平台开发的第一选择，同时全面拥抱 Electron 作为 iofod 开发桌面应用的基础设施，听取开发者心声，打造更为愉悦的应用开发体验。

如果使用过程有任何问题，可以公众号搜索【iofod】或【数字围猎】，点【联系我们】可在线提问，或者添加小助手微信：iofod\_beta 进群交流。

* * *

相关链接：

*   [iofod - 为攻城师们打造的低代码平台](https://juejin.cn/post/7129401262566539301 "https://juejin.cn/post/7129401262566539301")
*   [iofod 官网](https://link.juejin.cn?target=https%3A%2F%2Fwww.iofod.cn%2F "https://www.iofod.cn/")
*   [Electron 官网](https://link.juejin.cn?target=https%3A%2F%2Fwww.electronjs.org%2Fzh%2Fdocs%2Flatest%2F "https://www.electronjs.org/zh/docs/latest/")
*   [awesome-electron](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Fawesome-electron "https://github.com/sindresorhus/awesome-electron")