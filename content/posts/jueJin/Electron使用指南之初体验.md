---
author: "爱做梦的小子"
title: "Electron使用指南之初体验"
date: 2022-06-27
description: "Electron介绍1、概览想必你已经听说了可以应用electron来构建令人惊叹的桌面应用程序！单纯使用JavaScriptAPI就可以构建Mac,windows或者Linux应用程序"
tags: ["前端"]
ShowReadingTime: "阅读4分钟"
weight: 575
---
Electron 介绍
-----------

### 1、概览

想必你已经听说了可以应用electron来构建令人惊叹的桌面应用程序！

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b12998df6564652b2cb93b7e879c74b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 单纯使用JavaScript API 就可以构建Mac, windows或者Linux应用程序。

长期以来，很多开发语言都保留了生成桌面应用程序的功能，比如C和Java，但是用这些语言来构建应用程序是非常困难的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d187690ca804d4ab884e39672e3cbf9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 当然，近年来，构建本地应用程序变的更加灵活，但您仍然需要为每个操作系统学习不同的语言并使用非常特定的工具进行开发。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bddac85a07a44a5cb1be182b2e3f5524~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 而如今，在Mac，Windows和Linux系统上，应用Electron技术，可以使我们前端开发人员运用现有的知识来解决这个问题了。

我们利用JavaScript，HTML和CSS这些Web技术来构建单个应用程序，然后为Mac windows 和 Linux 编译该应用程序。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f717978f1d4dc3a57e1704dcf047a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 这样，我们就不用为特定的平台维护不同的应用程序了。

此外，我们还可以使用我们喜欢的框架和库来实现这个程序，比如 Vue, React 等前端框架。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43cb3e2556554505965dd81e2677637a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) Electron开发利用的是纯 Web 技术，她基于 Chromium 和 Node.js, 让你可以使用 HTML, CSS 和 JavaScript 构建应用。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4a4b752721545809f067eb1d3bf6431~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) Electron完全开源，她是一个由 GitHub 及众多贡献者组成的活跃社区共同维护的开源项目。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f324ecf81b224e19b4f7804b2cad3360~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Electron完全跨平台，她兼容 Mac、Windows 和 Linux，可以构建出三个平台的应用程序。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79b52d47baca449da8de61d2b2b1f589~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 如果你可以建一个网站，你就可以建一个桌面应用程序。 Electron 是一个使用 JavaScript, HTML 和 CSS 等 Web 技术创建原生程序的框架，它负责比较难搞的部分，你只需把精力放在你的应用的核心上即可。Electron,一定比你想象的更简单！！

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b8c6bf0dc374e8e9467acf6416a1fcb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) Electron 最初为 GitHub 开发 Atom 编辑器, 此后被世界各地的公司采纳。比如Slack, 甚至微软自己的Visual Studio。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78aa8eeb549f448d836d2d066a77c7ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我们先来[搭建一个Electron的运行环境](https://link.juejin.cn?target=https%3A%2F%2Flinks.jianshu.com%2Fgo%3Fto%3Dhttps%253A%252F%252Flink.zhihu.com%252F%253Ftarget%253Dhttps%25253A%252F%252Flurongtao.github.io%252Ffelixbooks-electron%252Fbasics%252F02-%2525E6%252590%2525AD%2525E5%2525BB%2525BAElectron%2525E8%2525BF%252590%2525E8%2525A1%25258C%2525E7%25258E%2525AF%2525E5%2525A2%252583.html "https://links.jianshu.com/go?to=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Flurongtao.github.io%2Ffelixbooks-electron%2Fbasics%2F02-%25E6%2590%25AD%25E5%25BB%25BAElectron%25E8%25BF%2590%25E8%25A1%258C%25E7%258E%25AF%25E5%25A2%2583.html")。

### 2、Electron 原理

在深入学习Eelectron 之前，我们有必要了解一下Electron的应用架构。

Electron 运行在两类进程中，一类是主进程，一类是渲染进程 我们要知道，electron是基于chromium才能工作的，那我们就先简单看下chromium架构：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e852efe0c93d42a089a394bccec1b06e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) chromium运行时有一个Browser Process，以及一个或者多个Renderer Process。Renderer Process 顾名思义负责渲染Web页面。Browser Process则负责管理各个Renderer Process以及其他部分（比如菜单栏，收藏夹等等）。

我们再来看看electron在chromium的基础上做了什么：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb125b7c5d164c87baaa5b339c836101~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   Renderer Process

在electron中，仍然使用Renderer Process渲染页面，也就是说electron app使用Web页面作为UI显示，并且兼容传统的Web页面。不同的是electron app开发者可以可选的配置是否支持Node.js。

*   Main Process

electron对Browser Process改动较大，干脆另起一个名字叫Main Process。Main Process 除了原来chromium的runtime，又添加了Node.js的runtime，main.js便运行在此之上。

electron将Node.js的message loop和chromium联系起来，使得js中可以灵活的控制页面显示，以及和Renderer Process的IPC通信。 进程间通信(IPC,Inter-Process Communication)指至少两个进程或线程间传送数据或信号的一些技术或方法。 当然原生的Node API和第三方的node module同样支持，并且有electron API提供给开发者控制原生菜单和通知等。 有一点需要注意，Browser Process本来没有js运行时，所以还需要依赖V8（当然这是chromium中的V8，不是单独的V8库）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb9a03752d60408cb85d85bc31d8c467~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

总结一下，一个Main Process(主进程），一个或多个Rederer(渲染进程) 构成了Electron的运行架构。 我们姑且把主进程叫Server-side服务端，将rederen process叫客户端。

*   electron 使用 Node.js 原生模块

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b886250ebd8c49a09a54854fee7137d9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) Node.js 原生模块是用 C++ 编写的 Node.js 扩展。C++ 源码通过 node-gyp 编译为 .node 后缀的二进制文件（类似于 .dll 和 .so）。在 Node.js 环境中可以直接用 require() 函数将 .node 文件初始化为动态链接库。一些 npm 包会包含 C++ 扩展，例如： node-ffi、node-iconv、node-usb，但都是源码版本，在安装后需要编译后才能被 Node.js 调用。 Electron 同样也支持 Node 原生模块，但由于和官方的 Node 相比使用了不同的 V8 引擎，如果你想编译原生模块，则需要手动设置 Electron 的 headers 的位置。