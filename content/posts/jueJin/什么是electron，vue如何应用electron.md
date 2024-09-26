---
author: "大码猴"
title: "什么是electron，vue如何应用electron"
date: 2021-06-18
description: "这里我就搬造官网的一句话：顾名思义就是为了开发桌面应用而生，现如今Electron现已被多个开源应用软件所使用，其中我们熟悉和使用的Atom和VsCode编辑器就是基于Electron实现的。"
tags: ["Electron","前端"]
ShowReadingTime: "阅读4分钟"
weight: 410
---
这里我就搬造官网的一句话：

> Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。

顾名思义就是为了开发桌面应用而生，现如今Electron现已被多个开源应用软件所使用，其中我们熟悉和使用的Atom和VsCode编辑器就是基于Electron实现的。

### 我们为什么要使用electron

以Windows平台为例，大部分人会首先想到使用QT(C++)，WPF(C#) 等语言去开发应用。不可否认的是，这些已经是非常成熟的开发方案了。但是，我们来看下如下两种场景：

*   公司要做个全新的APP，但是技术人员构成大部分都是前端开发
*   公司原本就有在线的web应用，但是想包个壳能在桌面直接打开，同时增加一些与系统交互的功能 对于第一种场景，团队中开发人员对于C++和C#并不熟悉，虽然可以现学，但是整个项目的技术管理和项目管理就会变得不可控。

对于第二种场景，对于应用的业务逻辑要求并不多，只是套一个具有浏览器的运行环境，单独为此配置一个C++、C#开发人员划不来。

对于这两种情况，如果现有的前端开发人员能直接搞定，那就非常完美了。

Electron的诞生提供了这种可能性。它可以帮助前端开发者在不需要学习其他语言和技能的前提下，快速开发跨平台的桌面应用。

### 怎么使用？

接下来我会带领大家熟悉electron的一些基本语法

创建一个文件，并在该文件目录下终端敲 npm init, 并且一直回车得到如下图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce64f056c45440ee82cf5d2740e35693~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

接下来装electron

css

 代码解读

复制代码

`npm install --save-dev electron` 

配置启动命令，并且启动应用

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e50c863a34d3484b85110310ffcb400c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

报错，提示缺少主进程文件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ebb29a7d80482a88c931f4d7849496~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**错误解释**

任何 Electron 应用程序的入口都是 main 文件。 这个文件控制了主进程，它运行在一个完整的Node.js环境中，负责控制您应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程。 执行期间，Electron 将依据应用中 package.json配置下main字段中配置的值查找此文件，您应该已在应用脚手架步骤中配置。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/471a0fac8109402d93bfbb467b2bd750~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

所以我们要初始化这个index文件，在根目录下创建一个index.js文件

然后我们再次执行npm start，就不会有任何的报错。

然后我们在根目录下新增index.html文件，并写入下面内容

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4875715855664dcea1b3990c3c87c6cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后在入口文件中写入electron配置

现在您有了一个页面，将它加载进应用窗口中。 要做到这一点，你需要 两个Electron模块：

*   app 模块，它控制应用程序的事件生命周期。
*   BrowserWindow 模块，它创建和管理应用程序 窗口。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7d3d62102884ab4955f8d308e39d1cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这样我们第一个桌面应用就搭建完成啦

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/138a909fa1ea488a9f82a11d4160613b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**接下来将带领大家在vue中配置electron，过程难度不会太高，只要把上面流程摸清一看变懂**

### 在Vue中如何使用electron

我们在Vue项目中装入一下两个包

css

 代码解读

复制代码

 `npm i electron electron-builder -D`

修改启动命令，并且更改入口文件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69bfb0fb9b3f462796d5e8a768b7a954~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在src目录下新增electron目录，并且在其目录下新增 index 入口文件，写入一下内容

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e00526a7bafa490ea4c624a4b0d6b0f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

具体意思注释上已经写好了，想看更详细，[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Fapi%2Fbrowser-window "https://www.electronjs.org/docs/api/browser-window")

现在我们需要先把web应用跑起来，为了是让electron监听到我们web内容

arduino

 代码解读

复制代码

`npm run dev // 成功之后 npm run dev:exe`

这时候就成功跑起来啦

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/143c86e7d7ad49de82792923b95a6c14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Vue 配置代码

javascript

 代码解读

复制代码

``const { app, BrowserWindow, ipcMain } = require('electron') const path = require('path') global.appDirname = __dirname const winURL = path.resolve(__dirname, '../renderer/index.html') function createWindow() {   const win = new BrowserWindow({     width: 1580,     height: 888,     icon: path.resolve(__dirname, './icon/logo.png'),     frame: false,     show: false,     webPreferences: {       webSecurity: false,       nodeIntegration: true, //  Boolean (可选) - 是否启用Node integration. 默认值为 false.       contextIsolation: false, // Boolean (可选) - 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认值为 false.       webviewTag: true // Boolean (可选) - 是否启用 <webview> tag标签. 默认值为 false.     }   })   if (app.isPackaged) {     win.loadURL(`file://${winURL}`) // 入口html   } else {     win.loadURL('http://localhost:8080') // 指向当前启动的web应用     win.webContents.openDevTools() // 启动调试工具   }   win.on('ready-to-show', () => { win.show() })   return win } app.on('ready', () => {   // eslint-disable-next-line new-cap   const mainWindow = new createWindow()   ipcMain.on('toggle_dev_tools', (event, arg) => { // 开启tool     mainWindow.webContents.toggleDevTools()   }) }) app.on('quit', () => {   app.releaseSingleInstanceLock()// 释放所有的单例锁 })``

> 这是本猴的第一个专栏的第一篇章，刚刚那个Vue electron 配置出来的界面就是，本专栏的重头戏**百度云桌面应用**，这篇张主要是介绍electron，以及electron在Vue中的一些简单的配置，和基本API，本专栏后续将会带领大家走入electron的奇幻世界，认识electron更多的API。本专栏会出前端，跟后端接口两端，敬请期待吧，欢迎大家点赞关注，期待本猴的下次更新哟。