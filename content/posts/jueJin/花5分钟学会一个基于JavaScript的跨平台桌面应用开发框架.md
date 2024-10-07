---
author: "一头程序猿"
title: "花5分钟学会一个基于JavaScript的跨平台桌面应用开发框架"
date: 2024-04-11
description: "一款由GitHub开发的开源跨平台桌面应用开发框架，允许开发者利用他们熟悉的Web技术栈——HTML、CSS和JavaScript，来创建原生桌面应用程序"
tags: ["Electron","Node.js"]
ShowReadingTime: "阅读3分钟"
weight: 576
---
### 框架介绍

**Electron** 是一款由 GitHub 开发的开源跨平台桌面应用开发框架，允许开发者利用他们熟悉的 Web 技术栈 —— HTML、CSS 和 JavaScript，来创建原生桌面应用程序。Electron 结合了 Chromium（用于渲染界面）和 Node.js（提供后端功能和文件系统访问等本地能力），使得开发者能够轻松地构建出在 Windows、macOS 和 Linux 上都能无缝运行的高性能桌面应用。

### 典型应用案例

Electron 框架由于其高效便捷性，已被众多知名应用采用，其中包括但不限于：

*   Visual Studio Code（Microsoft开发的开源源代码编辑器）
*   Slack（团队协作通讯工具）
*   Skype（即时通讯工具）
*   Atom（GitHub推出的开源文本编辑器）
*   Twitch Desktop App（Twitch直播平台客户端）
*   Postman（API测试工具）

### 快速上手：安装Electron与Hello World示例

#### 安装 Electron

首先确保您的计算机已安装 Node.js，然后可以通过 npm（Node包管理器）全局安装 Electron CLI 工具：

bash

 代码解读

复制代码

`npm install -g electron`

接下来，创建一个新的项目目录并初始化一个新的 Node.js 项目：

bash

 代码解读

复制代码

`mkdir my-electron-app cd my-electron-app npm init -y`

安装 Electron 到项目的开发依赖中：

bash

 代码解读

复制代码

`npm install --save-dev electron`

#### 创建 Hello World 应用程序

在项目根目录下创建 `main.js` 文件作为主进程入口文件：

javascript

 代码解读

复制代码

`// main.js const { app, BrowserWindow } = require('electron') let mainWindow function createWindow () {   // 创建浏览器窗口   mainWindow = new BrowserWindow({     width: 800,     height: 600,     webPreferences: {       nodeIntegration: true     }   })   // 加载应用的 index.html   mainWindow.loadFile('index.html')   // 当窗口被关闭时，清空引用   mainWindow.on('closed', function () {     mainWindow = null   }) } // Electron 初始化完成并准备创建浏览器窗口时调用 app.whenReady().then(() => {   createWindow()   // 在 macOS 上，当 dock 标签被点击并且没有其他窗口打开时重新激活应用   app.on('activate', function () {     if (BrowserWindow.getAllWindows().length === 0) createWindow()   }) }) // 所有窗口都已关闭时退出应用 app.on('window-all-closed', function () {   // 在 macOS 上，除非用户按下 Cmd + Q 显式退出，否则保持应用活动状态   if (process.platform !== 'darwin') app.quit() }) // 在此文件中你可以包含你应用特定的代码 // 也可以把它们放在另外的文件中然后在这里导入`

创建一个简单的 `index.html` 文件：

html

 代码解读

复制代码

`<!-- index.html --> <!DOCTYPE html> <html> <head>   <meta charset="UTF-8">   <title>Hello World!</title> </head> <body>   <h1>Hello World!</h1> </body> </html>`

启动应用：

bash

 代码解读

复制代码

`npx electron .`

执行上述命令后，会弹出一个桌面应用窗口，如下图所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3dd49636e24c8092662a5d82546825~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=786&h=592&s=19000&e=png&b=ffffff)

### 打包应用

我们使用`electron-forge`将 Electron 应用程序打包为可分发的安装包：

bash

 代码解读

复制代码

`npm install --save-dev @electron-forge/cli npx electron-forge import`

执行上面命令之后会自动在 `package.json` 中添加配置信息：

js

 代码解读

复制代码

`"scripts": {   "start": "electron-forge start",   "package": "electron-forge package",   "make": "electron-forge make" },`

执行打包命令：

bash

 代码解读

复制代码

`npm run make`

会将输出的执行文件保存到项目下的out文件夹：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ceb0bc984474153b7ebf9aa5a5c1cfe~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=409&h=73&s=5050&e=png&b=2b2d30)

*   hellow-world-win32-x64：执行文件，文件夹下有.exe的执行文件，运行此文件会直接打开程序；
*   make：目录下是软件的安装文件

### 避坑指南

*   **安装Electron**：安装Electron时最好使用国内的npm库，比如淘宝。
    
*   **electron: --openssl-legacy-provider is not allowed in NODE\_OPTIONS error Command failed with exit code 9.**：nodejs版本升级，可能时因为nodejs的版本太老，如果遇到这个问题可以尝试使用最新的nodejs版本。