---
author: "ok玉儿"
title: "Electron开发-从推门到进门"
date: 2022-12-11
description: "一、Electron的介绍Electron是利用web前端技术进行桌面应用开发的一套框架。是由github开发的开源框架，允许开发者使用Web技术构建跨平台的桌面应用，它的基本结构：El"
tags: ["前端"]
ShowReadingTime: "阅读14分钟"
weight: 398
---
### 一、Electron 的介绍

Electron是利用web前端技术进行桌面应用开发的一套框架。是由 github 开发的开源框架，允许开发者使用 Web 技术构建跨平台的桌面应用，它的基本结构：

`Electron = Chromium + Node.js + Native API`

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cc70b23e0644b75a4a6758bc1c5ac9a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   Chromium：为 Electron 提供了强大的 UI 能力，可以不考虑兼容性的情况下，利用强大的 Web 生态来开发界面。
*   Node.js ：让 Electron 有了底层的操作能力，比如文件的读写，甚至是集成 C++ 等等操作，并可以使用大量开源的npm包来完成开发需求。
*   Native API ： Native API 让 Electron 有了跨平台和桌面端的原生能力，比如说它有统一的原生界面，窗口、托盘这些。

通过三者的巧妙组合，我们开发应用变的十分高效。

若想开发一个兼容多平台的桌面应用，以往常用的技术框架有wxWidgets、GTK、QT等，这些框架受语言限制，且学习成本较高，效率有限。目前一些基于前端技术的hybrid框架很流行，且已经在多个领域得到了广泛的应用和验证，比如利用前端技术+相应的打包工具可开发适配多平台的应用（PC、微信公众号、小程序、Android、IOS等）。Electron就是这样一款框架，为前端技术人员利用web前端技术开发桌面应用带来了可能，开发人员可利用已经掌握的前端技术如Html、CSS、JavaScript，以及结合一些前端技术框架：Vue、Angular、React、webpack，加之浏览器渲染引擎、Electron封装的系统API快速实现一款桌面应用的开发，Electron做了大部分复杂的工作，开发人员只需要专注在核心业务和前端技术本身。同时，通过一定的优化，Electron可以做到很好的体验。

目前有不少知名桌面应用采用Electron开发，如：开发人员熟知的Visual Studio Code、MongoDB桌面版管理工具、Skype桌面版、WhatsApp桌面版、HTTP网络测试工具Postman等。所以前端开发者不用担心案例问题。

### 二、Electron开发桌面程序需要用到的前端技术

Electron是基于Chromium和Node.js实现的，所以开发人员所需要使用到的前端技术主要包括以下方面：

1、Html、CSS、JavaScript（能用ES6开发最好不过，基本前沿的语法它都支持，没有兼容性负担）

2、前端开发工具Vue、Angular、React等的一种（你也可以用纯html和js开发，也是没有问题）

3、其他网络、缓存、通讯等前端技术

### 三、当然Electron也有不足之处，主要是：

1.打包体积大

一个小应用打包下来可能就需要几十兆，不过目前磁盘存储已经不是什么大问题，随着网路环境越来越好，磁盘容积也越来越大，这个问题给用户带来的负担越来越不明显，几乎可以忽略。

2.开发具有一定的复杂度

除需要掌握必要的前端知识外，Electron开发仍需要了解跨进程通信的一些知识点，进程上的一些问题往往还是容易给开发者带来一定的困惑，如果你单纯的只是用它作为一个载体(壳)，那基本没有啥学习成本，10分钟就可以做好一个应用，如果你的应用更倾向于qq、微信那样的客户端，这个就有一定的学习成本，但是通过系统学习还是容易攻克的。

3.版本更新快

因为是基于Chromium的，所以Electron跟随Chromium的版本发布节奏，版本迭代较快，这可能会导致一些兼容问题，但幸运的是目前Electron的核心功能一直都算是很稳定的。至少常用的api基本没有变过，我用2018年写的程序，安装最新的electron版本，基本不用怎么修改就可以跑起来，前提是你需要关注官网，一些即将废弃和试验的api都尽可能少的使用，好处是新特性会更快使用到项目当中

4.安全问题

Electron提供给了开发人员足够的便利，同时也有一些具有风险的开关，开发者需要在开发中妥善处理，避免对应用客户带来安全隐患，开发人员需要关注安全问题。

5.性能问题。

Electron 本身是多进程、多线程的框架，但 JavaScript 是单线程运行的，如果产品的需求中有大量CPU 消耗性的需求，那么不应该在 Electron 内使用 JavaScript 来实现这些需求，而应该使用 Node.js 的原生模块来实现这些需求。与其说这是一个 Electron 的不足，不如说这是 JavaScript 的不足。

除了以上这些问题外，Electron 还不支持老版本的 Windows 操作系统，比如 Windows XP，在中国还有一些用户是使用 Windows XP 的，开发者如果需要面向这些用户，应该考虑使用其他技术方案了。

### 四、优点

1.  Electron 开发效率高
    

相较于基于 C++ 库开发桌面软件来说，基于 Electron 开发更容易上手且开发效率更高。  
由于 JavaScript 语言是一门解释执行的语言，所以 C++ 语言固有的各种问题都不再是问题。  
比如：

*   C++ 没有垃圾回收机制，开发人员要小心翼翼地控制内存，以免造成内存泄漏；
    
*   C++ 语言特性繁多且复杂，学习难度曲线陡峭，需要针对不同平台进行编译，应用分发困难。
    

1.  Electron 执行效率高
    

在执行效率上，如果前端代码写得足够优秀，Electron 应用完全可以做出与 C++ 应用相媲美的用户体验，Visual Studio Code 就是先例。

另外，Node.js 本身也可以很方便地调用 C++ 扩展，Electron 应用内又包含 Node.js 环境，对于一些音视频编解码或图形图像处理需求，可以使用 Node.js 的 C++ 扩展来完成。

1.  无需考虑兼容性问题
    

在完成 Web 前端开发工作时，开发者需要考虑很多浏览器兼容的问题，比如：用户是否使用了低版本的 IE 浏览器，是否可以在样式表内使用 Flexbox（弹性盒模型）等。这些问题最终会导致前端开发者束手束脚，写出一些丑陋的兼容代码以保证自己的应用能在所有终端表现正常。

但由于 Electron 内置了 Chromium 浏览器，该浏览器对标准支持非常好，甚至支持一些尚未通过的标准，所以基于 Electron 开发应用不会遇到兼容问题。

1.  基于 JavaScript 生态
    

随着 Web 应用大行其道，Web 前端开发领域的技术生态足够繁荣。Electron 可以使用几乎所有的 Web 前端生态领域及 Node.js 生态领域的组件和技术方案。截至本文发布时，发布到 [npmjs.com](https://link.juejin.cn?target=http%3A%2F%2Fnpmjs.com "http://npmjs.com") 平台上的模块已经超过 90 万个，覆盖领域广，优秀模块繁多且使用非常简单方便。

1.  Electron 可以使用操作系统接口
    

Web 前端受限访问的文件系统、系统托盘、系统通知等，在 Electron 技术体系下均有 API 供开发者自由使用。

2.Electron安装
------------

### 一、开发前准备

在使用 Electron 开发应用之前，要先安装 Electron，而 Electron 需要依赖 Node.js，因此在安装之前，要先安装 Node.js。Node.js 允许使用 JavaScript 开发服务端以及命令行程序，读者可以到 [Node.js 的官网](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fen%2F "https://nodejs.org/en/")下载最新版本的安装程序。

Node.js 是跨平台的，建议读者下载长期维护版本（LTS），然后双击安装程序开始安装即可。

### 二、安装

1.安装完 Node.js 后，进入终端（Windows 下是命令提示符窗口）

`node -v` vx.x.x v16.16.0 我的版本是16.16.0

备注：如果执行这个命令不报错，出来版本号，说明安装没有问题，下面也一样，最好安装14.x.x以后的版本

2.node安装好没有问题，然后再运行如下命令安装 Electron。

arduino

 代码解读

复制代码

`// 全局安装 npm install -g electron // 项目安装（推荐） npm install electron -D`

3.安装完 Electron 后，可以输入下面的命令查看 Electron 版本。

`electron -v`

**坑**：在国内安装electron有时候会无法安装，原因是镜像地址被\*\*了，所以更换镜像地址就好了，更换方法：

如果你是全局安装electron，找到 C:\\Users\\admin （该目录就是登录用户主目录）创建 .npmrc 文件，不要把点少了，然后写入

ini

 代码解读

复制代码

`electron_mirror=https://npm.taobao.org/mirrors/electron/ phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/`

如果electron安装在项目目录下那就该文件放置项目目录下

如果你的项目从a电脑拷贝到b电脑，但是b电脑没有网络，可以使用以下方式

把a电脑上面找到对应的文件，放置对应位置就可以了，在打包时会用到

makefile

 代码解读

复制代码

`下载 electron-v9.0.2-win32-x64.zip 放在下面目录 C:\Users\Administrator\AppData\Local\electron\Cache 下载 winCodeSign-2.6.0.7z 放在下面目录 C:\Users\Administrator\AppData\Local\electron-builder\Cache\winCodeSign 下载 nsis-3.0.4.1.7z 放在下面目录 C:\Users\Administrator\AppData\Local\electron-builder\Cache\nsis`

### 三、基本概念

### 主进程

在 Electron 里，运行 package.json 里 main 脚本的进程被称为**主进程**。在主进程运行的脚本可以以创建 web 页面的形式展示 GUI。

### 渲染进程

由于 Electron 使用 Chromium 来展示页面，所以 Chromium 的多进程结构也被充分利用。每个 Electron 的页面都在运行着自己的进程，这样的进程我们称之为**渲染进程**。

在一般浏览器中，网页通常会在沙盒环境下运行，并且不允许访问原生资源。然而，Electron 用户拥有在网页中调用 io.js 的 APIs 的能力，可以与**底层操作系统直接交互**。**(重点)**

### 主进程与渲染进程的区别

主进程使用 BrowserWindow 实例创建网页。每个 BrowserWindow 实例都在自己的渲染进程里运行着一个网页。当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有页面和与之对应的渲染进程。每个渲染进程都是相互独立的，并且只关心他们自己的网页。

由于在网页里管理原生 GUI 资源是非常危险而且容易造成资源泄露，所以在网页面调用 GUI 相关的 APIs 是不被允许的。如果你想在网页里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。在 Electron，我们提供用于在主进程与渲染进程之间通讯的 ipc 模块，后面会讲到。

3.Electron开发第一个应用
-----------------

大体上，一个 Electron 应用的目录结构如下：

css

 代码解读

复制代码

`your-app/ ├── package.json ├── main.js └── index.html`

package.json的格式和 Node 的完全一致，并且那个被 main 字段声明的脚本文件是你的应用的启动脚本，它运行在主进程上。你应用里的 package.json 看起来应该像：

json

 代码解读

复制代码

`{     "name"    : "your-app",     "version" : "0.1.0",     "main"    : "main.js" }`

**注意**：如果 main 字段没有在 package.json 声明，Electron会优先加载 index.js。

main.js 应该用于创建窗口和处理系统事件，一个典型的例子如下：

javascript

 代码解读

复制代码

`// 控制应用生命周期的模块。 var app = require('electron').app; // 创建原生浏览器窗口的模块 var BrowserWindow = require('electron').BrowserWindow;   // 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC， // window 会被自动地关闭 var mainWindow = null; // 当所有窗口被关闭了，退出。 app.on('window-all-closed', function() {   // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前   // 应用会保持活动状态   if (process.platform != 'darwin') {     app.quit();   } }); // 当 Electron 完成了初始化并且准备创建浏览器窗口的时候 // 这个方法就被调用 app.on('ready', function() {   // 创建浏览器窗口。   mainWindow = new BrowserWindow({width: 800, height: 600});   // 加载应用的 index.html   mainWindow.loadURL('file://' + __dirname + '/index.html');   // 打开开发工具   mainWindow.openDevTools();   // 当 window 被关闭，这个事件会被触发   mainWindow.on('closed', function() {     // 取消引用 window 对象，如果你的应用支持多窗口的话，     // 通常会把多个 window 对象存放在一个数组里面，     // 但这次不是。     mainWindow = null;   }); });`

最后，你想展示的 index.html ：

xml

 代码解读

复制代码

`<!DOCTYPE html> <html>   <head>     <title>Hello World!</title>   </head>   <body>     <h1>Hello World!</h1>     We are using io.js <script>document.write(process.version)</script>     and Electron <script>document.write(process.versions['electron'])</script>.   </body> </html>`

### 运行你的应用

一旦你创建了最初的 main.js， index.html 和 package.json 这几个文件，你可能会想尝试在本地运行并测试，看看是不是和期望的那样正常运行。

如果你已经用 npm 全局安装了 electron 

在你的应用目录底下运行

`electron .`

如果运行成功你就可以看到以下效果

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f99ca5eebed4226ba2dcbee5ca5ba2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果看到以上界面，离你开发一个客户端还差50%了。摸摸自己的头，真腻害，自己鼓励自己一次，我还是行滴......

4.Electron打包第一个应用
-----------------

### 一、Electron 目前常用的有两种打包工具：electron-builder 和 electron-packager。

1.electron-builder的安装（推荐使用）

arduino

 代码解读

复制代码

`// 全局安装 npm install -g electron-builder // 项目安装 npm install electron-builder -D`

2.electron-packager的安装（这里就不展开讲了，有兴趣的可以自己查阅资料使用）

arduino

 代码解读

复制代码

`// 全局安装 npm install -g electron-packager // 项目安装（推荐） npm install electron-packager -D`

### 二、打包配置(electron-builder)

json

 代码解读

复制代码

`{     "name": "your-app",     "version": "0.1.0",     "main": "main.js",     "scripts": {         "start": "electron .",         "build": "electron-builder"     },     "devDependencies": {         "electron-builder": "^23.6.0",         "electron": "^21.3.1"     },     "build": {         "productName": "my-electron",         "appId": "com.example.app",         "copyright": "my-electron",         "directories": {             "output": "dist"         }     } }`

1.运行以下命令

`npm run build`

ini

 代码解读

复制代码

`• electron-builder  version=23.6.0 os=10.0.19045 • loaded configuration  file=package.json ("build" field) • description is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json • author is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json • writing effective config  file=dist\builder-effective-config.yaml • packaging       platform=win32 arch=x64 electron=21.3.1 appOutDir=dist\win-unpacked • downloading     url=https://npm.taobao.org/mirrors/electron/21.3.1/electron-v21.3.1-win32-x64.zip size=96 MB parts=8 • downloaded      url=https://npm.taobao.org/mirrors/electron/21.3.1/electron-v21.3.1-win32-x64.zip duration=13.116s • default Electron icon is used  reason=application icon is not set • building        target=nsis file=dist\my-electron Setup 0.1.0.exe archs=x64 oneClick=true perMachine=false • building block map  blockMapFile=dist\my-electron Setup 0.1.0.exe.blockmap`

**坑1**：如果报下面错误，说明你没有项目中安装electron，因为打包是安装在项目的，所以在项目底下在安装以下electron就可以了，如果不会直接拷贝上面打包配置的信息 npm install 后再执行npm run build

ini

 代码解读

复制代码

`• electron-builder  version=23.6.0 os=10.0.19045 • loaded configuration  file=package.json ("build" field) • description is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json • author is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json ⨯ Cannot compute electron version from installed node modules - none of the possible electron modules are installed. See https://github.com/electron-userland/electron-builder/issues/3984#issuecomment-504968246`

\*\*坑2：\*\*如果报下面错误，意思你把开发依赖安装到生产依赖了，所以你把electron放置在devDependencies中，如果不会直接拷贝上面打包配置的信息 执行npm run build

kotlin

 代码解读

复制代码

`• electron-builder  version=23.6.0 os=10.0.19045 • loaded configuration  file=package.json ("build" field) • description is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json • author is missed in the package.json  appPackageFile=C:\Users\56531\Desktop\your-app\package.json ⨯ Package "electron" is only allowed in "devDependencies". Please remove it from the "dependencies" section in your package.json.`

> 如果不出意外，从开发到打包第一个应用就完结了！撒花....，要开发类似qq，微信那样的客户端么，别急，接下来的教程教你开发

我们实现的应用渲染进程使用vue开发，如果你使用其他框架，自行查阅资料，原理基本一致，下面介绍在常见的vue作为渲染进程，引入electron的几种方案，根据自己情况对应选择，没有好和不好的，只有更适合自己的，适合的才是最好的。

### 方案一：直接引入(适合老项目，不依赖前端框架)

优点：侵入少，灵活更像一个定制化的浏览器；上面的小应用就是这种

缺点：因渲染页项目质量评判最后生成的应用的质量，开发时主进程和渲染进程调试不方便，可以借助第三方工具也是可以弥补的

### 方案二：使用vue-cli-plugin-electron-builder插件

优点：侵入适中，对原有项目改造小

缺点：配置略显麻烦，额......好像也没啥其他缺点了

### 方案三：使用electron-vue脚手架

优点：配置简单，调试热更新，比较快捷，适合练手，沉浸式electron开发

缺点：内置框架和库比较旧，官方好像停更很久了，需自己升级最新版本，升级对新手不友好

### 方案四：自己搭建脚手架

优点：灵活，按需安装和配置，自主性强，可控性强

缺点：上手比较有难度，对新手不友好

**温馨提示：作为新手，如果你对构建工具不太熟悉，不建议自己搭建脚手架来开发，因为这样会加重你的开发负担，如果中间出现问题，你可能很难排查到，到底是你构建工具的配置有问题还是electron带来的问题，这样你就会一直徘徊不前，失去开发兴趣，学习一门语言或者一个工具，先从浅再到深去探索，这样才有成就感，保持愉快的心情，才能一往无前。**