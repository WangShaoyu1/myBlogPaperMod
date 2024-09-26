---
author: "独立开发者张张"
title: "TaurivsElectron：真实项目的比较"
date: 2022-09-20
description: "在本文中，我将使用真实世界的应用程序来比较Electron和Tauri：Authme。Authme是一个简单的跨平台双因素身份验证器应用程序，适用于桌面。它不是一个大应用程序，也不是很复杂，"
tags: ["前端框架"]
ShowReadingTime: "阅读6分钟"
weight: 1055
---
> Electron 是目前跨平台桌面软件的首选开发框架，Tauri 则是最近出现的一个替代品，试图解决前者的最大痛点：体积臃肿，资源占用高。 作者特意用 Tauri 写了一个桌面应用。本文是他的使用感受，以及两者的全方位比较。

在本文中，我将使用真实世界的应用程序来比较 Electron 和 Tauri：Authme。 [Authme](https://link.juejin.cn?target=https%3A%2F%2Fauthme.levminer.com%2F "https://authme.levminer.com/") 是一个简单的跨平台双因素身份验证器应用程序，适用于桌面。它不是一个大应用程序，也不是很复杂，非常适合进行一些比较。您可以在 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLevminer%2Fauthme "https://github.com/Levminer/authme") 上查看 Electron 应用程序的源代码，Tauri 应用程序也在 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLevminer%2Fauthme-v4 "https://github.com/Levminer/authme-v4") 上。我的目标是 Tauri 应用程序最终会取代 Electron 应用程序。

Electron应用架构
------------

什么是Electron？

> Electron 是一个使用 JavaScript、HTML 和 CSS 等 Web 技术创建原生应用程序的框架。它负责处理困难的部分，因此您可以专注于应用程序的核心。如果您可以构建网站，则可以构建桌面应用程序。 -electronjs.org

**应用架构**

Electron 应用程序是用普通的 HTML 和 JavaScript 编写的。对于样式，我使用 TailwindCSS 和一些自定义 CSS。

Tauri应用架构
---------

什么是Tauri？

> Tauri是一个框架，用于为所有主要的桌面平台构建微小的、快得惊人的二进制文件。开发者可以整合任何可以编译成HTML、JS和CSS的前端框架来构建他们的用户界面。应用程序的后端是一个rust来源的二进制文件，有一个前端可以交互的API。- Tauri GitHub

**架构**

我的 Tauri 应用程序正在使用更现代的堆栈。构建工具是 Parcel，框架是 Svelte，当然还有 TypeScript 而不是 JavaScript。样式是使用 TailwindCSS 完成的。

比较
--

这不是一个面对面的比较，但应用程序基本上是一样的。

关键点：

1\. 安装包
-------

我们在这里有一个明显的赢家：Tauri。  
Tauri 应用程序安装程序约为 2.5MB（！！！），而 Electron 应用程序安装程序约为 85MB。

全包大小： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/156bf530948b4b338b1d3ae2832cf701~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d0e77adcdf543e5ac037aaf4c9c9102~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Tauri 的一个主要优势是：该应用程序被编译为二进制文件，这意味着您必须是逆向工程专家才能反编译该应用程序。使用 Electron，您可以使用简单的 NPM 命令解压缩应用程序。

如果您的用户拥有 Tauri 使用的 webview 的正确运行时，您只需向他们发送一个可执行文件，他们就不必安装任何东西。

2.启动时间
------

这不是一项科学测试，但运行应用程序并确定启动时间会产生明显的赢家：

*   Tauri: ~ 2 秒
*   Electron: ~ 4 秒

3.性能
----

这又不是科学测试，只是粗略的比较。这些测试来自我的 PC：i5-4570 CPU、16GB RAM、GTX 1660 和 Windows 11  
Tauri (Windows)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d39300076d04835b26af25ad365dbf3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
Electron (Windows)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/844e0d8415e84794af3e69cb970cac5a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

老实说，我对 Tauri 的期望更高，当然它使用的 RAM 更少，但不会太多。让我们看一下 Linux 方面的情况。

**Tauri**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c19fa74cc2af4a43a82281ad811e7ac0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**Electron**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a7948b74fab4f11a1ffdc913c2681b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

哇，这对 Tauri 来说是一个巨大的胜利！

4.应用后端
------

现在，Tauri 的缺点之一出现了（或者说它最大的优点，我想这取决于你）。在您的 Electron 应用程序中，您使用 JavaScript 编写应用程序后端，因为 Electron 使用 Node.js 运行时。另一方面，Tauri 是用 Rust 编写的。现在，如果您了解 Rust，您可能会很高兴，但如果您必须从头开始学习 Rust（像我一样），您将面临一些问题。

你必须用Rust重写你的应用程序的后端，所以我认为这里的赢家是Electron。就目前而言。Tauri的路线图上有其他的后端绑定方式，如Python、C++或Deno。就我个人而言，我很期待Deno的集成，这样我就可以再次用JavaScript/TypeScript来写我的应用后端了。

5.渲染你的应用
--------

Electron 在后台使用 Chromium，因此您的用户在 Windows、Linux 和 macOS 上看到的内容相同。另一方面，Tauri 使用系统 webview：Windows 上的 Edge Webview2 (Chromium)、Linux 上的 WebKitGTK 和 macOS 上的 WebKit。现在不好的部分来了，如果你是一个 Web 开发人员，你知道 Safari（基于 WebKit）总是落后于每个 Web 浏览器。总是有一个错误，你没有从Chrome浏览器中看到，只有你亲爱的Safari用户。同样的问题也存在于Tauri中，而且你不能对它做什么，你必须包括polyfills。在这里，赢家必须是Electron。

我在开发 Tauri 时遇到的一个问题是我的 CSS 包不包含 `-webkit` 前缀，所以我的应用程序的 CSS 有很多错误。

6.安全
----

Tauri 默认情况下非常安全，另一方面，我不能对 Electron 说同样的话。 Tauri 默认内置了许多安全功能。您甚至可以显式启用或禁用某些 API。使用 Electron，您可以完全访问 Node API，因此黑客可以轻松利用非常强大的 Node API。 Tauri 不是这种情况，您必须显式公开 Rust 函数。

7.自动更新
------

在 2022 年发布没有自动更新的应用程序是不行的。如果您的用户必须手动下载每个更新，我认为他们不会高兴。 Electron 和 Tauri 都有一个内置的自动更新程序，但 Tauri 更简单。在Electron中，我想大多数人都使用[electron-updater](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Felectron-updater "https://www.npmjs.com/package/electron-updater")。在Tauri中，你可以使用内置的，缺点是你必须维护自己的更新服务器，或者你可以使用一个简单的[JSON文件](https://link.juejin.cn?target=https%3A%2F%2Ftauri.app%2Fv1%2Fguides%2Fdistribution%2Fupdater%23update-file-json-format "https://tauri.app/v1/guides/distribution/updater#update-file-json-format")，你必须手动更新。Electron更新器从GitHub发布的二进制文件中提取，这要方便得多。

8.开发者经验
-------

在 Tauri 中，您只需安装 Tauri CLI 即可获得整个软件包：热重载、为所有平台构建应用程序、生成应用程序图标。 Electron 没有给你任何东西，只是框架本身。您已经设置了热重载、捆绑您的应用程序等...... Tauri 会为您处理一切。最好的来了：Tauri 与地球上的每个 Web 框架都兼容，它只需要一个 localhost url 或所有捆绑代码所在的文件夹。

总结
--

Electron正在被取代？是的，Tauri要好得多，但它仍然错过了很多。几年后，我相信Tauri团队会赶上Electron的应用。我感到兴奋的是。Deno作为后端，更好的自动更新和iOS/Android支持。

* * *

原文：[www.levminer.com/blog/tauri-…](https://link.juejin.cn?target=https%3A%2F%2Fwww.levminer.com%2Fblog%2Ftauri-vs-electron "https://www.levminer.com/blog/tauri-vs-electron")