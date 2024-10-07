---
author: "黑色的枫"
title: "Vue3+TS+Vite2+Electron16项目梳理"
date: 2021-12-06
description: "1.什么是Electron？Electron是一个跨平台的、基于Web前端技术的桌面GUI应用程序开发框架。2.什么时候使用Electron？1.公司没有专门的桌面应用开发者，而需"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读28分钟"
weight: 378
---
1\. 什么是Electron？
================

Electron 是一个跨平台的、基于 Web 前端技术的桌面 GUI 应用程序开发框架。

2\. 什么时候使用Electron？
===================

1.公司没有专门的桌面应用开发者，而需要前端兼顾来进行开发时，用Electron就是一个不错的选择。

2.一个应用需要同时开发Web端和桌面端的时候，那使用Electron来进行开发就对了。

3.开发一些效率工具，比如API类的工具。

3\. Electron的优势
===============

1.  开源的核心扩展比较容易，加之现在 gyp 已经非常人性化了，使得c++ 和 js 搞基非常容易。
    
2.  界面定制性强，原则上只要是Web能做的他都能做。
    
3.  是目前最廉价的跨平台技术方案，HTML+JS 有大量的前端技术人员储备，而且有海量的现存web UI 库。大多都很靠谱。
    
4.  相对其他跨平台方案（如 QT GTK+ 等），更稳定，bug少， 毕竟只要浏览器外壳跑起来了，里面的问题不会太多 ，当然我也遇到过一些暗坑。
    
5.  方便热更新。下载覆盖完事。当然这是所有脚本共有的优点。
    

4\. Electron的劣势
===============

1.卡，启动慢，这可能是webkit的锅。毕竟一个浏览器要支持的功能确实有点多。

2.除了主进程 你可能还需要启动一些辅助进程来完成工作。而每当你新开一个进程，起步价就是一个nodejs的内存开销。

3.丢帧，这个最严重，可我已习惯了native 的丝滑. mac下感觉还可以 win下有点够呛。

4.打出来的包太大。（很显然，即便是一个空包，也至少包含了一个浏览器的体积），这里我解释一下：

整个包的大小基于就是 Frameworks + Resources 的大小

Frameworks electron核心（大小174M，版本9.0.0）基本没有可以优化的空间

有一个electron-boilerplate包，是精简化的electron，但已经3年没有更新，用的人也不多

Resources app.asar主要是项目打包后的资源和主进程使用的node\_modules，所以优化app.asar为主（win也是）

5\. Electron 把 HTML，CSS 和 JavaScript 组合的程序构建为跨平台桌面应用程序的原理 是什么?
==============================================================

原理为Electron通过将Chromium和Node.js合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的。

6\. electron + vue + ts方案
=========================

这一方案我们有比较成熟的库，Electron-vue。注意，electron需要有python环境，没有的记得提前安装。Python官网：[www.python.org/。](https://link.juejin.cn/?target=https%3A%2F%2Fwww.python.org%2F%25E3%2580%2582 "https://link.juejin.cn/?target=https%3A%2F%2Fwww.python.org%2F%25E3%2580%2582")

首先，全局安装vue-cli:

`npm install -g vue-cli`

然后，进行初始化:

`vue init simulatedgreg/electron-vue vue-electron`

最后安依赖运行：

`cd vue-electron yarn # 或者 npm install yarn run dev # 或者 npm run dev`

运行效果：

![homepage.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd08c8ab53b947098be1ac359c6a1fcb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后，我们分析下目录结构：

![catalogue.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2434f083a60452b833600914d71f70d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以看到src文件夹下有两个文件夹，main和renderer，也就是electron的两个进程。

**在main主进程中：**

index.js就是主进程的进程js

**在renderer渲染进程中：**

assets：放置静态资源，如图片，视频，静态配置

common：放置静态js，如页面需要的公共功能

commponents：放置vue页面

router：放置页面路由

store： 放置公共模块，如vuex

**当我们想在项目里调用electron的api应该怎么操作：**

渲染进程发送数据:

javascript

 代码解读

复制代码

`sendMsg(){     this.$electron.ipcRenderer.send('toMain','我是渲染进程里面的数据')  },`

主进程接收数据:

javascript

 代码解读

复制代码

`var {ipcMain}=require('electron'); ipcMain.on('toMain',(event,data)=>{       console.log(data); });`

**项目里如何使用node：**

javascript

 代码解读

复制代码

`var fs = require('fs'); export default {     data() {         return {             msg: ''         }     },     methods: {         runNode() {             fs.readFile('package.json',(err, data) => {                 if (err) {                     console.log(err);                     return;                 }                 console.log(data.toString());             })         }     } }`

**然后我们加上TS配置：**

src目录下创建vue.sfc.d.ts全局声明文件:

typescript

 代码解读

复制代码

`// 配置ts读取.vue文件 declare module "*.vue"{   import Vue from 'vue'   export default Vue }`

安装TS依赖：

 代码解读

复制代码

`npm install typescript -d npm install ts-loader -d`

在webpack.main.config.js 和 webpack.renderer.config.js加上TS配置：

css

 代码解读

复制代码

`...... module: {     rules: [       {         test: /\.ts$/,         use: {         loader: "ts-loader",         options: {            appendTsSuffixTo: [/\.vue$/],           }         }       }, ......  resolve: {     extensions: ['.ts','.js', '.json', '.node'],   }, ......`

增加了TS配置，就需要把原有js文件改为ts文件。然后我们必须在webpack.renderer.config.js配置一个东西:在whiteListedModules中多加一个vue-property-decorator的选项：

bash

 代码解读

复制代码

`//webpack.renderer.config.js let whiteListedModules = ['vue','vue-property-decorator']`

tsc --init 生成tsconfig.json

json

 代码解读

复制代码

`"strict": false, "experimentalDecorators":true,`

这样，我们就成功的引入了TS。

**网上有成功的案例可以参考：**

tiny-evt：Vite2 + Vue3 + Electron12 + TypeScript git： [github.com/neatfx/tiny…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fneatfx%2Ftiny-evt "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fneatfx%2Ftiny-evt")

因为要集成vite，所以我这边对比了下，选择了脚手架evv：

csharp

 代码解读

复制代码

`npm init evv`

7\. electron + react + ts方案
===========================

**创建react+ts项目：**

sql

 代码解读

复制代码

`npm install -g create-react-app create-react-app electron-react --template typescript cd electron-react npm start`

**安装 react-app-rewired 、 cross-env 和 customize-cra** `npm i -D react-app-rewired cross-env customize-cra` react-app-rewired2.x以后需要安装customize-cra来实现修改webpack配置 安装之后需要修改下package.json中scripts的一些配置，主要是将 start、build、test 命令的react-scripts改成react-app-rewired：

json

 代码解读

复制代码

`/* package.json */ "scripts": {    "start": "react-app-rewired start",    "build": "react-app-rewired build",    "test": "react-app-rewired test", }`

**引入babel-plugin-import：** `npm install babel-plugin-import --save-dev`

**安装 react-app-rewired 、 cross-env 和 customize-cra：** `npm i -D react-app-rewired cross-env customize-cra`

**创建 react-app-rewired 配置文件 config-overrides.js 用于扩展 webpack 配置：**

php

 代码解读

复制代码

`/* config-overrides.js */ const { override, fixBabelImports, } = require("customize-cra"); module.exports = override(   fixBabelImports("import", {     libraryName: "antd", libraryDirectory: "es", style: 'css',   }), );`

**安装 electron 环境并配置入口文件：** `npm i -D electron`

main.js文件放在public下就好。

ini

 代码解读

复制代码

`/* main.js */ const { app, BrowserWindow } = require('electron'); const path = require('path'); let mainWindow = null; const createWindow = () => {   let mainWindow = new BrowserWindow({     width: 800,     height: 600,     webPreferences: {       nodeIntegration: true,     }   });   /**    * loadURL 分为两种情况    *  1.开发环境，指向 react 的开发环境地址    *  2.生产环境，指向 react build 后的 index.html    */   const startUrl =     process.env.NODE_ENV === 'development'       ? 'http://localhost:3000'       :  path.join(__dirname, "/build/index.html");   mainWindow.loadURL(startUrl);   mainWindow.on('closed', function () {     mainWindow = null;   }); }; app.on('ready', createWindow); app.on('window-all-closed', function () {   if (process.platform !== 'darwin') app.quit(); }); app.on('activate', function () {   if (mainWindow === null) createWindow(); });`

**修改下package文件：**

css

 代码解读

复制代码

`/* package.json */ "main": "main.js", "author": "L", "description": "electron-react", "scripts": {     "start": "cross-env BROWSER=none react-app-rewired start",     "start-electron": "cross-env NODE_ENV=development electron .",     "start-electron-prod": "electron ." },`

npm run start-electron

运行即可。

要求引入vite，所以我们需要把webpack替换为vite，经过思考，我选择了wp2vite。

 代码解读

复制代码

`npm install -g wp2vite npm install`

wp2vite是一个和工具，可以一键让使用webpack来进行开发和构建的项目支持使用vite来进行开发和构建(目前只支持vue和react)。

8\. 打包(electron-builder)
========================

electron-vue已经集成好了打包工具，但是还是有很多问题，这里我记录一下：

1.  依赖要用npm或者yarn，不能使用cnpm。
2.  下载依赖后单独下载electron-build依赖，这里要用cnpm，npm和yarn无法下载。
3.  build.js中出现命名重复的问题，有两对tasks，修改其中一对即可。
4.  手动配置安装包，一定要这个路径：C:\\Users\\Administrator\\AppData\\Local\\electron\\Cache，把安装包放在该路径下，安装包名称为electron-v2.0.9-win32-x64.zip，我放到gitlab上了。
5.  手动下载multispinner， npm install multispinner -D，build.js中添加

const Multispinner = require('multispinner')。

下面我们配置下electron-react的打包功能。 `npm i -D electron-builder`

**然后配置一些打包相关的参数：**

kotlin

 代码解读

复制代码

`/* package.json */   "homepage": ".", // 避免css等资源找不到的情况   "scripts": {     "build-electron": "electron-builder"   },   "build": {     // 软件包名     "appId": "com.xxx.xxx",     // 项目名，也是生成的安装文件名     "productName": "L",     // 版权信息     "copyright": "L © 2021",     // 不配置extends为null打包的时候会报错：Application entry file "build/electron.js" does not exist     "extends": null,     "directories": {         // 输出文件路径       "output": "build-electron"     },     "files": [       "./build/**/*",       "./main.js",       "./package.json"     ],     "win": { // win相关配置       "icon": "./favicon_256.ico",       /* 打包生成的启动文件的命名方式 */       "artifactName": "${productName}.${ext}"     },     "nsis": {        // 是否一键安装，不可更改目录等选项，默认为true       "oneClick": false,       // 是否允许权限提升。如果为false，则用户必须使用提升的权限重新启动安装程序。       "allowElevation": true,       // 是否允许更改安装路径       "allowToChangeInstallationDirectory": true,       // 是否创建桌面图标       "createDesktopShortcut": true,       // 创建开始菜单图标       "createStartMenuShortcut": true,       // 安装完成请求运行       "runAfterFinish": true,       // 安装包图标       "installerIcon": "./favicon_256.ico",        //卸载程序图标       "uninstallerIcon": "./favicon_256.ico",       // 安装时头部图标       "installerHeaderIcon": "./build/icons/aaa.ico",       // 桌面图标名称       "shortcutName": "L"     }   },`

在public下新建electron.js文件，内容与main.js文件内容一致，然后将

rust

 代码解读

复制代码

`win.loadURL('http://localhost:3000/');`

修改为

bash

 代码解读

复制代码

``win.loadURL(`file://${__dirname}/index.html`);``

然后将package.json中的"main"项修改为"public/electron.js"，并增加"build"项：

css

 代码解读

复制代码

`"build": {   "appId": "com.example.electron-cra",   "files": [     "build/**/*",     "node_modules/**/*"   ],   "directories":{     "buildResources": "assets"   },   "extraMetadata":{       "main":"build/electron.js"     } }`

npm run build-electron即可。

9\. Electron模块梳理
================

注： 只归纳了一些常用方法，具体可以看： [www.w3cschool.cn/electronman…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3cschool.cn%2Felectronmanual%2Felectronmanual-desktop-capturer.html "https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3cschool.cn%2Felectronmanual%2Felectronmanual-desktop-capturer.html")

9.1 shell
---------

shell 模块提供了集成其他桌面客户端的关联功能.

在用户默认浏览器中打开URL的示例:

ini

 代码解读

复制代码

`var shell = require('shell'); shell.openExternal('https://github.com');`

\*\*9.1.1 shell.showItemInFolder(fullPath)\*\*

打开文件所在文件夹,一般情况下还会选中它。

**9.1.2 shell.openItem(fullPath)**

以默认打开方式打开文件。

**9.1.3 shell.openExternal(url)**

以系统默认设置打开外部协议.(例如,mailto: [somebody@somewhere.io](https://link.juejin.cn/?target=mailto%3Asomebody%40somewhere.io "https://link.juejin.cn/?target=mailto%3Asomebody%40somewhere.io")会打开用户默认的邮件客户端)。

**9.1.4 shell.moveItemToTrash(fullPath)**

删除指定路径文件,并返回此操作的状态值(boolean类型)。

**9.1.5 shell.beep()**

播放 beep 声音（也就是嘟嘟声）。

9.2 screen
----------

screen 模块检索屏幕的 size，显示，鼠标位置等的信息。在 app 模块的ready 事件触发之前不可使用这个模块。

注意: 在渲染进程 / 开发者工具栏, window.screen 是一个预设值的 DOM 属性, 所以这样写 var screen = require('electron').screen 将不会工作。

示例：

ini

 代码解读

复制代码

`const electron = require('electron'); const app = electron.app; const BrowserWindow = electron.BrowserWindow; var mainWindow; app.on('ready', function() {   var electronScreen = electron.screen;   var size = electronScreen.getPrimaryDisplay().workAreaSize;   mainWindow = new BrowserWindow({ width: size.width, height: size.height }); });`

\*\*Display 对象：\*\*

Display 对象表示了物力方式连接系统. 一个伪造的 Display 或许存在于一个无头系统中，或者一个 Display 相当于一个远程的、虚拟的 display.

**screen模块会触发三种事件：** Event: 'display-added'

返回:

event Event newDisplay Object 当添加了 newDisplay 时发出事件

Event: 'display-removed'

返回:

event Event oldDisplay Object 当移出了 oldDisplay 时发出事件

Event: 'display-metrics-changed'

返回:

event Event display Object changedMetrics Array

**9.2.1 screen.getCursorScreenPoint()**

返回当前鼠标的绝对路径 .

screen.getPrimaryDisplay()

返回最主要的 display.

screen.getAllDisplays()

返回一个当前可用的 display 数组.

**9.2.2 screen.getDisplayNearestPoint(point)**

point Object x Integer y Integer

返回离指定点最近的 display.

**9.2.3 screen.getDisplayMatching(rect)**

rect Object x Integer y Integer width Integer height Integer

返回与提供的边界范围最密切相关的 display.

9.3 clipboard
-------------

clipboard 模块提供方法来供复制和粘贴操作。

示例：

ini

 代码解读

复制代码

`const clipboard = require('electron').clipboard; clipboard.writeText('Example String');`

\*\*9.3.1 clipboard.readText(\[type\])\*\*

type String (可选)

以纯文本形式从 clipboard 返回内容

**9.3.2 clipboard.writeText(text\[, type\])**

text String type String (可选)

以纯文本形式向 clipboard 添加内容

**9.3.3 clipboard.readHtml(\[type\])**

type String (可选)

返回 clipboard 中的标记内容

**9.3.4 clipboard.writeHtml(markup\[, type\])**

markup String type String (可选)

向 clipboard 添加 markup(标记) 内容

**9.3.5 clipboard.readImage(\[type\])**

type String (可选)

从 clipboard 中返回 NativeImage(本地图像) 内容

**9.3.6 clipboard.writeImage(image\[, type\])**

image NativeImage type String (可选)

向 clipboard 中写入 image

**9.3.7 clipboard.clear(\[type\])**

type String (可选)

清空 clipboard 内容

9.4 crashReporter
-----------------

crash-reporter 模块开启发送应用崩溃报告。

下面是一个自动提交崩溃报告给服务器的例子 :

php

 代码解读

复制代码

`const crashReporter = require('electron').crashReporter; crashReporter.start({   productName: 'YourName',   companyName: 'YourCompany',   submitURL: 'https://your-domain.com/url-to-submit',   autoSubmit: true });`

\*\*9.4.1 crashReporter.start(options)\*\*

options:

companyName String

submitURL String - 崩溃报告发送的路径，以post方式.

productName String (可选) - 默认为 Electron.

autoSubmit Boolean - 是否自动提交. 默认为 true.

ignoreSystemCrashHandler Boolean - 默认为 false.

extra Object - 一个你可以定义的对象，附带在崩溃报告上一起发送 . 只有字符串属性可以被正确发送，不支持嵌套对象.

注： 只可以在使用其它 crashReporter APIs 之前使用这个方法.

**9.4.2 crashReporter.getLastCrashReport()**

返回最后一个崩溃报告的日期和 ID.如果没有过崩溃报告发送过来，或者还没有开始崩溃报告搜集，将返回 null .

**9.4.3 crashReporter.getUploadedReports()**

返回所有上载的崩溃报告，每个报告包含了上载日期和 ID.

9.5 nativeImage
---------------

在 Electron 中, 对所有创建 images 的 api 来说, 你可以使用文件路径或 nativeImage 实例. 如果使用 null ，将创建一个空的image 对象.

当创建一个 tray(图标) 或设置窗口的图标时候，你可以使用一个字符串的图片路径 :

ini

 代码解读

复制代码

`var appIcon = new Tray('/Users/somebody/images/icon.png'); var window = new BrowserWindow({icon: '/Users/somebody/images/window.png'});`

或者从剪切板中读取图片，它返回的是 nativeImage:

ini

 代码解读

复制代码

`var image = clipboard.readImage(); var appIcon = new Tray(image);`

**支持的格式**

当前支持 PNG 和 JPEG 图片格式. 推荐 PNG ，因为它支持透明和无损压缩.

在 Windows, 你也可以使用 ICO 图标的格式.

**9.5.1 nativeImage.createEmpty()**

创建一个空的 nativeImage 实例.

**9.5.2 nativeImage.createFromPath(path)**

path String

从指定 path 创建一个新的 nativeImage 实例 .

**9.5.3 nativeImage.createFromBuffer(buffer\[, scaleFactor\])**

buffer Buffer scaleFactor Double (可选)

从 buffer 创建一个新的 nativeImage 实例 .默认 scaleFactor 是 1.0.

**9.5.4 nativeImage.createFromDataURL(dataURL)**

dataURL String

从 dataURL 创建一个新的 nativeImage 实例 .

9.6 ipcRenderer
---------------

ipcRenderer 模块是一个 EventEmitter(事件派发器) 类的实例. 它提供了有限的方法，你可以从渲染进程向主进程发送同步或异步消息. 也可以收到主进程的响应.

**9.6.1 ipcRenderer.on(channel, listener)**

channel String listener Function

监听 channel, 当有新消息到达，使用 listener(event, args...) 调用 listener .

**9.6.2 ipcRenderer.once(channel, listener)**

channel String listener Function

为这个事件添加一个一次性 listener 函数.这个 listener 将在下一次有新消息被发送到 channel 的时候被请求调用，之后就被删除了.

**9.6.3 ipcRenderer.removeListener(channel, listener)**

channel String listener Function

从指定的 channel 中的监听者数组删除指定的 listener .

**9.6.4 ipcRenderer.removeAllListeners(\[channel\])**

channel String (optional)

删除所有的监听者，或者删除指定 channel 中的全部.

**9.6.5 ipcRenderer.send(channel\[, arg1\]\[, arg2\]\[, ...\])**

channel String arg (可选)

通过 channel 向主进程发送异步消息，也可以发送任意参数.参数会被JSON序列化，之后就不会包含函数或原型链.

主进程通过使用 ipcMain 模块来监听 channel，从而处理消息.

**9.6.6 ipcRenderer.sendToHost(channel\[, arg1\]\[, arg2\]\[, ...\])**

channel String arg (可选)

类似 ipcRenderer.send ，但是它的事件将发往 host page 的 元素，而不是主进程.

9.7 desktopCapturer
-------------------

desktopCapturer 模块可用来获取可用资源，这个资源可通过 getUserMedia 捕获得到。

php

 代码解读

复制代码

`// 在渲染进程中. var desktopCapturer = require('electron').desktopCapturer; desktopCapturer.getSources({types: ['window', 'screen']}, function(error, sources) {   if (error) throw error;   for (var i = 0; i < sources.length; ++i) {     if (sources[i].name == "Electron") {       navigator.webkitGetUserMedia({         audio: false,         video: {           mandatory: {             chromeMediaSource: 'desktop',             chromeMediaSourceId: sources[i].id,             minWidth: 1280,             maxWidth: 1280,             minHeight: 720,             maxHeight: 720           }         }       }, gotStream, getUserMediaError);       return;     }   } }); function gotStream(stream) {   document.querySelector('video').src = URL.createObjectURL(stream); } function getUserMediaError(e) {   console.log('getUserMediaError'); }`

当调用 navigator.webkitGetUserMedia 时创建一个约束对象，如果使用 desktopCapturer 的资源，必须设置 chromeMediaSource 为 "desktop" ，并且 audio 为 false.

如果你捕获整个桌面的 audio 和 video，你可以设置 chromeMediaSource 为 "screen" ，和 audio 为 true. 当使用这个方法的时候，不可以指定一个 chromeMediaSourceId.

**9.7.1 desktopCapturer.getSources(options, callback)**

options Object types Array - 一个 String 数组，列出了可以捕获的桌面资源类型, 可用类型为 screen 和 window. thumbnailSize Object (可选) - 建议缩略可被缩放的 size, 默认为 {width: 150, height: 150}. callback Function

发起一个请求，获取所有桌面资源，当请求完成的时候使用 callback(error, sources) 调用 callback .

9.8 remote
----------

remote 模块提供了一种在渲染进程（网页）和主进程之间进行进程间通讯（IPC）的简便途径。

Electron中, 与GUI相关的模块（如 dialog, menu 等)只存在于主进程，而不在渲染进程中 。为了能从渲染进程中使用它们，需要用ipc模块来给主进程发送进程间消息。使用 remote 模块，可以调用主进程对象的方法，而无需显式地发送进程间消息，这类似于 Java 的 RMI。

下面是从渲染进程创建一个浏览器窗口的例子：

ini

 代码解读

复制代码

`const remote = require('electron').remote; const BrowserWindow = remote.BrowserWindow; var win = new BrowserWindow({ width: 800, height: 600 }); win.loadURL('https://github.com');`

注意: 反向操作（从主进程访问渲染进程），可以使用webContents.executeJavascript.

**9.8.1 remote.require(module)**

module String

返回在主进程中执行 require(module) 所返回的对象。

**9.8.2 remote.getCurrentWindow()**

返回该网页所属的 BrowserWindow 对象。

**9.8.3 remote.getCurrentWebContents()**

返回该网页的 WebContents 对象

**9.8.4 remote.getGlobal(name)**

name String

返回在主进程中名为 name 的全局变量(即 global\[name\]) 。

**9.8.5 remote.process**

返回主进程中的 process 对象。等同于 remote.getGlobal('process') 但是有缓存。

9.9 webFrame
------------

web-frame 模块允许你自定义如何渲染当前网页 .

示例：放大当前页到 200%.

ini

 代码解读

复制代码

`var webFrame = require('electron').webFrame; webFrame.setZoomFactor(2);`

**9.9.1 webFrame.setZoomFactor(factor)**

factor Number - 缩放参数.

将缩放参数修改为指定的参数值.缩放参数是百分制的，所以 300% = 3.0.

**9.9.2 webFrame.getZoomFactor()**

返回当前缩放参数值.

**9.9.3 webFrame.registerURLSchemeAsSecure(scheme)**

scheme String

注册 scheme 为一个安全的 scheme.

安全的 schemes 不会引发混合内容 warnings.例如, https 和 data 是安全的 schemes ，因为它们不能被活跃网络攻击而失效.

**9.9.4 webFrame.registerURLSchemeAsBypassingCSP(scheme)**

scheme String

忽略当前网页内容的安全策略，直接从 scheme 加载.

**9.9.4 webFrame.executeJavaScript(code\[, userGesture\])**

code String userGesture Boolean (可选) - 默认为 false.

评估页面代码 .

在浏览器窗口中，一些 HTML APIs ，例如 requestFullScreen，只可以通过用户手势来使用.设置userGesture 为 true 可以突破这个限制

9.10 app
--------

app 模块是为了控制整个应用的生命周期设计的。

示例：

最后一个窗口被关闭时退出应用：

ini

 代码解读

复制代码

`var app = require('app'); app.on('window-all-closed', function() {   app.quit(); });`

**事件：'ready'**

当 Electron 完成初始化时被触发。

**事件：'window-all-closed'**

当所有的窗口都被关闭时触发。

这个时间仅在应用还没有退出时才能触发。 如果用户按下了 Cmd + Q， 或者开发者调用了 app.quit() ，Electron 将会先尝试关闭所有的窗口再触发 will-quit 事件， 在这种情况下 window-all-closed 不会被触发。

**事件：'before-quit'**

返回：

event Event

在应用程序开始关闭它的窗口的时候被触发。 调用 event.preventDefault() 将会阻止终止应用程序的默认行为。

**事件：'browser-window-focus'**

返回：

event Event

window BrowserWindow

当一个 BrowserWindow 获得焦点的时候触发。

**事件：'browser-window-created'**

返回：

event Event

window BrowserWindow

当一个 BrowserWindow 被创建的时候触发。

**9.10.1 app.quit()**

试图关掉所有的窗口。before-quit 事件将会最先被触发。如果所有的窗口都被成功关闭了， will-quit事件将会被触发，默认下应用将会被关闭。

这个方法保证了所有的 beforeunload 和 unload 事件处理器被正确执行。假如一个窗口的 beforeunload事件处理器返回 false，那么整个应用可能会取消退出。

**9.10.2 app.hide() OS X**

隐藏所有的应用窗口，不是最小化.

**9.10.3 app.getAppPath()**

返回当前应用所在的文件路径。

**9.10.4 app.clearRecentDocuments() OS X Windows**

清除最近访问的文档列表。

**9.10.5 app.isAeroGlassEnabled() Windows**

如果 DWM composition(Aero Glass) 启用 了，那么这个方法会返回 true，否则是 false。你可以用这个方法来决定是否要开启透明窗口特效，因为如果用户没开启 DWM，那么透明窗 口特效是无效的。

9.11 BrowserWindow
------------------

BrowserWindow

类让你有创建一个浏览器窗口的权力。

ini

 代码解读

复制代码

`// In the main process. const BrowserWindow = require('electron').BrowserWindow; // Or in the renderer process. const BrowserWindow = require('electron').remote.BrowserWindow; var win = new BrowserWindow({ width: 800, height: 600, show: false }); win.on('closed', function() {   win = null; }); win.loadURL('https://github.com'); win.show();`

你也可以不通过chrome创建窗口，使用 Frameless Window(无框窗口) API.

**Event: 'page-title-updated'**

返回:

event Event

当文档改变标题时触发,使用 event.preventDefault() 可以阻止原窗口的标题改变.

**Event: 'close'**

返回:

event Event 在窗口要关闭的时候触发. 它在DOM的 beforeunload and unload 事件之前触发.使用 event.preventDefault() 可以取消这个操作

通常你想通过 beforeunload 处理器来决定是否关闭窗口，但是它也会在窗口重载的时候被触发。在 Electron 中，返回一个空的字符串或 false 可以取消关闭.

**Event: 'unresponsive'**

在界面卡死的时候触发事件.

**Event: 'minimize'**

在窗口最小化的时候触发.

**Event: 'scroll-touch-begin' OS X**

在滚动条事件开始的时候触发.

**BrowserWindow.getAllWindows()**

返回一个所有已经打开了窗口的对象数组.

**BrowserWindow.getFocusedWindow()**

返回应用当前获得焦点窗口,如果没有就返回 null.

使用 new BrowserWindow 创建的实例对象，有如下属性:

less

 代码解读

复制代码

``// In this example `win` is our instance var win = new BrowserWindow({ width: 800, height: 600 });``

win.webContents

这个窗口的 WebContents 对象，所有与界面相关的事件和方法都通过它完成的.

查看 webContents documentation 的方法和事件.

win.id

窗口的唯一id.

**实例方法**

使用 new BrowserWindow 创建的实例对象，有如下方法:

**win.destroy()**

强制关闭窗口, unload and beforeunload 不会触发，并且 close 也不会触发, 但是它保证了 closed 触发.

**win.close()**

尝试关闭窗口，这与用户点击关闭按钮的效果一样. 虽然网页可能会取消关闭，查看 close event.

**win.focus()**

窗口获得焦点.

**win.show()**

展示并且使窗口获得焦点.

**win.hide()**

隐藏窗口.

**win.maximize()**

窗口最大化.

**win.minimize()**

窗口最小化. 在一些os中，它将在dock中显示.

**win.setBounds(options\[, animate\])**

options Object

x Integer

y Integer

width Integer

height Integer

animate Boolean (可选) OS X

重新设置窗口的宽高值，并且移动到指定的 x, y 位置.

**win.getBounds()**

返回一个对象，它包含了窗口的宽，高，x坐标，y坐标.

**win.setSize(width, height\[, animate\])**

width Integer

height Integer

animate Boolean (可选) OS X

重新设置窗口的宽高值.

**win.setContentSize(width, height\[, animate\])**

width Integer

height Integer

animate Boolean (可选) OS X

重新设置窗口客户端的宽高值（例如网页界面）.

**win.center()**

窗口居中.

9.12 webContents
----------------

webContents 是一个 事件发出者.

它负责渲染并控制网页，也是 BrowserWindow 对象的属性.一个使用 webContents 的例子:

ini

 代码解读

复制代码

`const BrowserWindow = require('electron').BrowserWindow; var win = new BrowserWindow({width: 800, height: 1500}); win.loadURL("https://www.w3cschool.cn"); var webContents = win.webContents;`

webContents 对象可发出下列事件:

**Event: 'did-finish-load'**

当导航完成时发出事件，onload 事件也完成.

**Event: 'did-start-loading'**

当 tab 的spinner 开始 spinning的时候.

**Event: 'did-stop-loading'**

当 tab 的spinner 结束 spinning的时候.

**Event: 'new-window'**

返回:

event Event

url String

frameName String

disposition String - 可为 default, foreground-tab, background-tab, new-window 和 other.

options Object - 创建新的 BrowserWindow时使用的参数.

当 page 请求打开指定 url 窗口的时候发出事件.这可以是通过 window.open 或一个外部连接

发出的请求.

[](https://link.juejin.cn/?target=undefined "https://link.juejin.cn/?target=undefined")

默认指定 url 的 BrowserWindow 会被创建.

调用 event.preventDefault() 可以用来阻止打开窗口.

**Event: 'will-navigate'** 返回:

event Event

url String

当用户或 page 想要开始导航的时候发出事件.它可在当 window.location 对象改变或用户点击 page 中的链接的时候发生.

当使用 api(如 webContents.loadURL 和 webContents.back) 以编程方式来启动导航的时候，这个事件将不会发出.

它也不会在页内跳转发生， 例如点击锚链接或更新 window.location.hash.使用 did-navigate-in-page 事件可以达到目的.

调用 event.preventDefault() 可以阻止导航.

**Event: 'did-navigate'**

返回:

event Event

url String

当一个导航结束时候发出事件.

页内跳转时不会发出这个事件，例如点击锚链接或更新 window.location.hash.使用 did-navigate-in-page 事件可以达到目的.

**Event: 'crashed'**

当渲染进程崩溃的时候发出事件.

**Event: 'destroyed'**

当 webContents 被删除的时候发出事件

**Event: 'login'**

返回:

event Event

request Object

method String

url URL

referrer URL

authInfo Object

isProxy Boolean

scheme String

host String

port Integer

realm String

callback Function

当 webContents 想做基本验证的时候发出事件.

使用方法类似 the login event of app.

**实例方法**

webContents 对象有如下的实例方法:

**9.12.1 webContents.loadURL(url\[, options\])**

url URL

options Object (可选)

httpReferrer String - A HTTP Referrer url.

userAgent String - 产生请求的用户代理

extraHeaders String - 以 "\\n" 分隔的额外头

在窗口中加载 url , url 必须包含协议前缀, 比如 http:// 或 file://. 如果加载想要忽略 http 缓存，可以使用 pragma 头来达到目的.

ini

 代码解读

复制代码

`const options = {"extraHeaders" : "pragma: no-cache\n"} webContents.loadURL(url, options)`

**9.12.2 webContents.isLoading()**

返回一个布尔值，标识当前页是否正在加载.

**9.12.3 webContents.isLoading()**

返回一个布尔值，标识当前页是否正在加载.

**9.12.4 webContents.reload()**

重载当前页.

**9.12.5 webContents.reloadIgnoringCache()**

重载当前页，忽略缓存.

**9.12.6 webContents.goBack()**

让浏览器回退到前一个page.

**9.12.7 webContents.goForward()**

让浏览器回前往下一个page.

**9.12.8 webContents.goToIndex(index)**

index Integer

让浏览器回前往指定 index 的page.

**实例属性**

WebContents 对象也有下列属性:

**webContents.session**

返回这个 webContents 使用的 session 对象.

**webContents.hostWebContents**

返回这个 webContents 的父 webContents .

[](https://link.juejin.cn/?target=undefined "https://link.juejin.cn/?target=undefined")

[](https://link.juejin.cn/?target=undefined "https://link.juejin.cn/?target=undefined")

9.13 ipcMain
------------

ipcMain 模块是类 EventEmitter 的实例.当在主进程中使用它的时候，它控制着由渲染进程(web page)发送过来的异步或同步消息.从渲染进程发送过来的消息将触发事件.

**发送消息**

同样也可以从主进程向渲染进程发送消息，查看更多 webContents.send .

发送消息，事件名为 channel.

回应同步消息, 你可以设置 event.returnValue.

回应异步消息, 你可以使用 event.sender.send(...).

一个例子，在主进程和渲染进程之间发送和处理消息:

javascript

 代码解读

复制代码

`// In main process. const ipcMain = require('electron').ipcMain; ipcMain.on('asynchronous-message', function(event, arg) {   console.log(arg);  // prints "ping"   event.sender.send('asynchronous-reply', 'pong'); }); ipcMain.on('synchronous-message', function(event, arg) {   console.log(arg);  // prints "ping"   event.returnValue = 'pong'; }); // In renderer process (web page). const ipcRenderer = require('electron').ipcRenderer; console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong" ipcRenderer.on('asynchronous-reply', function(event, arg) {   console.log(arg); // prints "pong" }); ipcRenderer.send('asynchronous-message', 'ping');`

**监听消息**

ipcMain 模块有如下监听事件方法:

**9.13.1 ipcMain.on(channel, listener)**

channel String

listener Function

监听 channel, 当新消息到达，将通过 listener(event, args...) 调用 listener.

**9.13.2 ipcMain.once(channel, listener)**

channel String

listener Function

为事件添加一个一次性用的listener 函数.这个 listener 只有在下次的消息到达 channel 时被请求调用，之后就被删除了.

**9.13.3 ipcMain.removeListener(channel, listener)**

channel String

listener Function

为特定的 channel 从监听队列中删除特定的 listener 监听者.

**9.13.4 ipcMain.removeAllListeners(\[channel\])**

channel String (可选)

删除所有监听者，或特指的 channel 的所有监听者.

**事件对象**

传递给 callback 的 event 对象有如下方法:

**event.returnValue**

将此设置为在一个同步消息中返回的值.

**event.sender**

返回发送消息的 webContents ，你可以调用 event.sender.send 来回复异步消息

9.14 dialog
-----------

dialog 模块提供了api来展示原生的系统对话框，例如打开文件框，alert框，所以web应用可以给用户带来跟系统应用相同的体验.

对话框例子，展示了选择文件和目录:

ini

 代码解读

复制代码

`var win = ...;  // BrowserWindow in which to show the dialog const dialog = require('electron').dialog; console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}));`

OS X 上的注意事项: 如果你想像sheets一样展示对话框，只需要在browserWindow 参数中提供一个 BrowserWindow 的引用对象.

**9.14.1 dialog.showOpenDialog(\[browserWindow, \]options\[, callback\])**

browserWindow BrowserWindow (可选)

options Object

title String

defaultPath String

filters Array

properties Array - 包含了对话框的特性值, 可以包含 openFile, openDirectory, multiSelections and createDirectory

callback Function (可选)

成功使用这个方法的话，就返回一个可供用户选择的文件路径数组，失败返回 undefined.

filters 当需要限定用户的行为的时候，指定一个文件数组给用户展示或选择. 例如:

css

 代码解读

复制代码

`{   filters: [     { name: 'Images', extensions: ['jpg', 'png', 'gif'] },     { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },     { name: 'Custom File Type', extensions: ['as'] },     { name: 'All Files', extensions: ['*'] }   ] }`

extensions 数组应当只包含扩展名，不应该包含通配符或'.'号 (例如 'png' 正确，但是 '.png' 和 '

.png' 不正确). 展示全部文件的话, 使用 '

' 通配符 (不支持其他通配符).

如果 callback 被调用, 将异步调用 API ，并且结果将用过 callback(filenames) 展示.

注意: 在 Windows 和 Linux ，一个打开的 dialog 不能既是文件选择框又是目录选择框, 所以如果在这些平台上设置 properties 的值为 \['openFile', 'openDirectory'\] , 将展示一个目录选择框.

**9.14.2 dialog.showErrorBox(title, content)**

展示一个传统的包含错误信息的对话框.

在 app 模块触发 ready 事件之前，这个 api 可以被安全调用，通常它被用来在启动的早期阶段报告错误. 在 Linux 上，如果在 app 模块触发 ready 事件之前调用，message 将会被触发显示stderr(输出文件)，并且没有实际GUI 框显示.

9.15 menu
---------

menu 类可以用来创建原生菜单，它可用作应用菜单和 context 菜单.

这个模块是一个主进程的模块，并且可以通过 remote 模块给渲染进程调用.

每个菜单有一个或几个菜单项 menu items，并且每个菜单项可以有子菜单.

下面这个例子是在网页(渲染进程)中通过 remote 模块动态创建的菜单，并且右键显示:

xml

 代码解读

复制代码

`<!-- index.html --> <script> const remote = require('electron').remote; const Menu = remote.Menu; const MenuItem = remote.MenuItem; var menu = new Menu(); menu.append(new MenuItem({ label: 'MenuItem1', click: function() { console.log('item 1 clicked'); } })); menu.append(new MenuItem({ type: 'separator' })); menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true })); window.addEventListener('contextmenu', function (e) {   e.preventDefault();   menu.popup(remote.getCurrentWindow()); }, false); </script>`

**9.15.1 Menu.setApplicationMenu(menu)**

menu Menu

在 OS X 上设置应用菜单 menu . 在windows 和 linux，是为每个窗口都在其顶部设置菜单 menu.

**9.15.2 Menu.sendActionToFirstResponder(action) OS X**

action String

发送 action 给应用的第一个响应器.这个用来模仿 Cocoa 菜单的默认行为，通常你只需要使用 MenuItem的属性 role.

**9.15.3 Menu.buildFromTemplate(template)**

template Array

一般来说，template 只是用来创建 MenuItem 的数组 参数 .

你也可以向 template元素添加其它东西，并且他们会变成已经有的菜单项的属性.

**实例方法**

menu 对象有如下实例方法：

**menu.popup(\[browserWindow, x, y, positioningItem\])**

browserWindow BrowserWindow (可选) - 默认为 null.

x Number (可选) - 默认为 -1.

y Number (必须 如果x设置了) - 默认为 -1.

positioningItem Number (可选) OS X - 在指定坐标鼠标位置下面的菜单项的索引. 默认为 -1. 在 browserWindow 中弹出 context menu .你可以选择性地提供指定的 x, y 来设置菜单应该放在哪里,否则它将默认地放在当前鼠标的位置.

**menu.append(menuItem)**

menuItem MenuItem

添加菜单项.

**menu.insert(pos, menuItem)**

pos Integer

menuItem MenuItem

在指定位置添加菜单项.

**menu.items()**

获取一个菜单项数组.

9.16 protocol
-------------

protocol 模块可以注册一个自定义协议，或者使用一个已经存在的协议.

例子，使用一个与 file:// 功能相似的协议 :

ini

 代码解读

复制代码

`const electron = require('electron'); const app = electron.app; const path = require('path'); app.on('ready', function() {     var protocol = electron.protocol;     protocol.registerFileProtocol('atom', function(request, callback) {       var url = request.url.substr(7);       callback({path: path.normalize(__dirname + '/' + url)});     }, function (error) {       if (error)         console.error('Failed to register protocol')     }); });`

注意: 这个模块只有在 app 模块的 ready 事件触发之后才可使用.

**9.16.1 protocol.registerStandardSchemes(schemes)**

schemes Array - 将一个自定义的方案注册为标准的方案.

一个标准的 scheme 遵循 RFC 3986 的 generic URI syntax 标准. 这包含了 file: 和 filesystem:.

**9.16.2 protocol.registerServiceWorkerSchemes(schemes)**

schemes Array - 将一个自定义的方案注册为处理 service workers.

**9.16.3 protocol.unregisterProtocol(scheme\[, completion\])**

scheme String

completion Function (可选)

注销自定义协议 scheme.

9.17 session
------------

session 模块可以用来创建一个新的 Session 对象.

你也可以通过使用 webContents 的属性 session 来使用一个已有页面的 session ，webContents是BrowserWindow 的属性.

ini

 代码解读

复制代码

`const BrowserWindow = require('electron').BrowserWindow; var win = new BrowserWindow({ width: 800, height: 600 }); win.loadURL("http://github.com"); var ses = win.webContents.session;`

**实例事件**

实例 Session 有以下事件:

**Event: 'will-download'**

event Event

item DownloadItem

webContents WebContents

当 Electron 将要从 webContents 下载 item 时触发.

调用 event.preventDefault() 可以取消下载，并且在进程的下个 tick中，这个 item 也不可用.

javascript

 代码解读

复制代码

`session.defaultSession.on('will-download', function(event, item, webContents) {   event.preventDefault();   require('request')(item.getURL(), function(data) {     require('fs').writeFileSync('/somewhere', data);   }); });`

**实例方法**

**9.17.1 ses.cookies**

cookies 赋予你全力来查询和修改 cookies. 例如:

javascript

 代码解读

复制代码

`// 查询所有 cookies. session.defaultSession.cookies.get({}, function(error, cookies) {   console.log(cookies); }); // 查询与指定 url 相关的所有 cookies. session.defaultSession.cookies.get({ url : "http://www.github.com" }, function(error, cookies) {   console.log(cookies); }); // 设置 cookie; // may overwrite equivalent cookies if they exist. var cookie = { url : "http://www.github.com", name : "dummy_name", value : "dummy" }; session.defaultSession.cookies.set(cookie, function(error) {   if (error)     console.error(error); });`

**9.17.2 ses.cookies.get(filter, callback)**

filter Object

url String (可选) - 与获取 cookies 相关的 url.不设置的话就是从所有 url 获取 cookies .

name String (可选) - 通过 name 过滤 cookies.

domain String (可选) - 获取对应域名或子域名的 cookies .

path String (可选) - 获取对应路径的 cookies .

secure Boolean (可选) - 通过安全性过滤 cookies.

session Boolean (可选) - 过滤掉 session 或 持久的 cookies.

callback Function

发送一个请求，希望获得所有匹配 details 的 cookies, 在完成的时候，将通过 callback(error, cookies) 调用 callback.

cookies是一个 cookie 对象.

cookie Object

name String - cookie 名.

value String - cookie值.

domain String - cookie域名.

hostOnly String - 是否 cookie 是一个 host-only cookie.

path String - cookie路径.

secure Boolean - 是否是安全 cookie.

httpOnly Boolean - 是否只是 HTTP cookie.

session Boolean - cookie 是否是一个 session cookie 或一个带截至日期的持久 cookie .

expirationDate Double (可选)-cookie的截至日期，数值为UNIX纪元以来的秒数. 对session cookies 不提供.

**9.17.3 ses.cookies.set(details, callback)**

details Object

url String - 与获取 cookies 相关的 url.

name String - cookie 名. 忽略默认为空.

value String - cookie 值. 忽略默认为空.

domain String - cookie的域名. 忽略默认为空.

path String - cookie 的路径. 忽略默认为空.

secure Boolean - 是否已经进行了安全性标识. 默认为 false.

session Boolean - 是否已经 HttpOnly 标识. 默认为 false.

expirationDate Double - cookie的截至日期，数值为UNIX纪元以来的秒数. 如果忽略, cookie 变为 session cookie.

callback Function 使用 details 设置 cookie, 完成时使用 callback(error) 掉哟个 callback .

**9.17.4 ses.cookies.remove(url, name, callback)**

url String - 与 cookies 相关的 url.

name String - 需要删除的 cookie 名.

callback Function

删除匹配 url 和 name 的 cookie, 完成时使用 callback()调用callback.

**9.17.5 ses.getCacheSize(callback)**

callback Function

size Integer - 单位 bytes 的缓存 size.

返回 session 的当前缓存 size .

**9.17.6 ses.clearCache(callback)**

callback Function - 操作完成时调用

清空 session 的 HTTP 缓存.

9.18 Tray
---------

用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.

ini

 代码解读

复制代码

`const electron = require('electron'); const app = electron.app; const Menu = electron.Menu; const Tray = electron.Tray; var appIcon = null; app.on('ready', function(){   appIcon = new Tray('/path/to/my/icon');   var contextMenu = Menu.buildFromTemplate([     { label: 'Item1', type: 'radio' },     { label: 'Item2', type: 'radio' },     { label: 'Item3', type: 'radio', checked: true },     { label: 'Item4', type: 'radio' }   ]);   appIcon.setToolTip('This is my application.');   appIcon.setContextMenu(contextMenu); });`

**平台限制:**

在 Linux， 如果支持应用指示器则使用它，否则使用 GtkStatusIcon 代替.

在 Linux ，配置了只有有了应用指示器的支持, 你必须安装 libappindicator1 来让 tray icon 执行.

应用指示器只有在它拥有 context menu 时才会显示.

当在linux 上使用了应用指示器，将忽略点击事件.

在 Linux，为了让单独的 MenuItem 起效，需要再次调用 setContextMenu .例如:

ini

 代码解读

复制代码

`contextMenu.items[2].checked = false; appIcon.setContextMenu(contextMenu);`

如果想在所有平台保持完全相同的行为，不应该依赖点击事件，而是一直将一个 context menu 添加到 tray icon.

**9.18.1 Tray.destroy()**

立刻删除 tray icon.

**9.18.2 Tray.setImage(image)**

image NativeImage

让 image 与 tray icon 关联起来.

**9.18.3 Tray.setPressedImage(image) OS X**

image NativeImage

当在 OS X 上按压 tray icon 的时候， 让 image 与 tray icon 关联起来.

**9.18.4 Tray.setToolTip(toolTip)**

toolTip String

为 tray icon 设置 hover text.

**9.18.5 Tray.setTitle(title) OS X**

title String

在状态栏沿着 tray icon 设置标题.

**9.18.6 Tray.setHighlightMode(highlight) OS X**

highlight Boolean

当 tray icon 被点击的时候，是否设置它的背景色变为高亮(blue).默认为 true.

**9.18.7 Tray.setContextMenu(menu)**

menu Menu

为这个 icon 设置 context menu .

9.19 global-shortcut
--------------------

global-shortcut 模块可以便捷的为您设置(注册/注销)各种自定义操作的快捷键.

使用此模块注册的快捷键是系统全局的(QQ截图那种), 不要在应用模块(app module)响应 ready 消息前使用此模块(注册快捷键).

javascript

 代码解读

复制代码

`var app = require('app'); var globalShortcut = require('electron').globalShortcut; app.on('ready', function() {   // Register a 'ctrl+x' shortcut listener.   var ret = globalShortcut.register('ctrl+x', function() {     console.log('ctrl+x is pressed');   })   if (!ret) {     console.log('registration failed');   }   // Check whether a shortcut is registered.   console.log(globalShortcut.isRegistered('ctrl+x')); }); app.on('will-quit', function() {   // Unregister a shortcut.   globalShortcut.unregister('ctrl+x');   // Unregister all shortcuts.   globalShortcut.unregisterAll(); });`

**9.19.1 globalShortcut.register(accelerator, callback)**

accelerator Accelerator

callback Function

注册 accelerator 快捷键. 当用户按下注册的快捷键时将会调用 callback 函数.

**9.19.2 globalShortcut.isRegistered(accelerator)**

accelerator Accelerator

查询 accelerator 快捷键是否已经被注册过了,将会返回 true(已被注册) 或 false(未注册).

**9.19.3 globalShortcut.unregister(accelerator)**

accelerator Accelerator

注销全局快捷键 accelerator.

**9.19.4 globalShortcut.unregisterAll()**

注销本应用注册的所有全局快捷键.

9.20 contentTracing
-------------------

content-tracing 模块是用来收集由底层的Chromium content 模块 产生的搜索数据. 这个模块不具备web接口，所有需要我们在chrome浏览器中添加 chrome://tracing/ 来加载生成文件从而查看结果.

javascript

 代码解读

复制代码

`const contentTracing = require('electron').contentTracing; const options = {   categoryFilter: '*',   traceOptions: 'record-until-full,enable-sampling' } contentTracing.startRecording(options, function() {   console.log('Tracing started');   setTimeout(function() {     contentTracing.stopRecording('', function(path) {       console.log('Tracing data recorded to ' + path);     });   }, 5000); });`

**9.20.1 contentTracing.getCategories(callback)**

callback Function

获得一组分类组. 分类组可以更改为新的代码路径。

一旦所有的子进程都接受到了getCategories方法请求, 分类组将调用 callback.

**9.20.2 contentTracing.startRecording(options, callback)**

options Object

categoryFilter String

traceOptions String

callback Function

开始向所有进程进行记录.(recording)

一旦收到可以开始记录的请求，记录将会立马启动并且在子进程是异步记录听的. 当所有的子进程都收到 startRecording 请求的时候，callback 将会被调用.

categoryFilter是一个过滤器，它用来控制那些分类组应该被用来查找.过滤器应当有一个可选的 - 前缀来排除匹配的分类组.不允许同一个列表既是包含又是排斥.

**9.20.3 contentTracing.stopRecording(resultFilePath, callback)**

resultFilePath String

callback Function

停止对所有子进程的记录.

子进程通常缓存查找数据，并且仅仅将数据截取和发送给主进程.这有利于在通过 IPC 发送查找数据之前减小查找时的运行开销，这样做很有价值.因此，发送查找数据，我们应当异步通知所有子进程来截取任何待查找的数据.

一旦所有子进程接收到了 stopRecording 请求，将调用 callback ，并且返回一个包含查找数据的文件.

如果 resultFilePath 不为空，那么将把查找数据写入其中，否则写入一个临时文件.实际文件路径如果不为空，则将调用 callback .

9.21 powerSaveBlocker
---------------------

powerSaveBlocker 模块是用来阻止应用系统进入睡眠模式的，因此这允许应用保持系统和屏幕继续工作.

ini

 代码解读

复制代码

`const powerSaveBlocker = require('electron').powerSaveBlocker; var id = powerSaveBlocker.start('prevent-display-sleep'); console.log(powerSaveBlocker.isStarted(id)); powerSaveBlocker.stop(id);`

**9.21.1 powerSaveBlocker.start(type)**

type String - 强行保存阻塞类型.

prevent-app-suspension - 阻止应用挂起. 保持系统活跃，但是允许屏幕不亮. 用例: 下载文件或者播放音频.

prevent-display-sleep- 阻止应用进入休眠. 保持系统和屏幕活跃，屏幕一直亮. 用例: 播放音频.

开始阻止系统进入睡眠模式.返回一个整数，这个整数标识了保持活跃的blocker.

注意: prevent-display-sleep 有更高的优先级 prevent-app-suspension. 只有最高优先级生效. 换句话说, prevent-display-sleep 优先级永远高于 prevent-app-suspension.

例如, A 请求调用了 prevent-app-suspension, B请求调用了 prevent-display-sleep. prevent-display-sleep 将一直工作，直到B停止调用. 在那之后, prevent-app-suspension 才起效.

**9.21.2 powerSaveBlocker.stop(id)**

id Integer - 通过 powerSaveBlocker.start 返回的保持活跃的 blocker id. 让指定blocker 停止活跃.

**9.21.3 powerSaveBlocker.isStarted(id)**

id Integer - 通过 powerSaveBlocker.start 返回的保持活跃的 blocker id. 返回 boolean， 是否对应的 powerSaveBlocker 已经启动.

9.22 powerMonitor
-----------------

power-monitor模块是用来监听能源区改变的.只能在主进程中使用.在 app 模块的 ready 事件触发之后就不能使用这个模块了.

javascript

 代码解读

复制代码

`app.on('ready', function() {   require('electron').powerMonitor.on('suspend', function() {     console.log('The system is going to sleep');   }); });`

**power-monitor 模块可以触发下列事件:**

**Event: 'suspend'**

在系统挂起的时候触发.

**Event: 'resume'**

在系统恢复继续工作的时候触发. Emitted when system is resuming.

**Event: 'on-ac'**

在系统使用交流电的时候触发. Emitted when the system changes to AC power.

**Event: 'on-battery'**

在系统使用电池电源的时候触发. Emitted when system changes to battery power.

9.23 autoUpdater
----------------

这个模块提供了一个到 Squirrel 自动更新框架的接口。

**9.23.1 autoUpdater.setFeedURL(url)**

url String

设置检查更新的 url，并且初始化自动更新。这个 url 一旦设置就无法更改。

**9.23.2 autoUpdater.checkForUpdates()**

向服务端查询现在是否有可用的更新。在调用这个方法之前，必须要先调用 setFeedURL。

**9.23.3 autoUpdater.quitAndInstall()**

在下载完成后，重启当前的应用并且安装更新。这个方法应该仅在 update-downloaded 事件触发后被调用。

10\. 框架选择
=========

通过vue3 + TS + electron16 + vite2 和 react + TS + electron16 + vite2，我们对两条路线有了较为具象的认识，所以接下来要做一个选择，到底选择哪个框架，以及后续的基础建设。

### 10.1 MVVM和MVC

Vue是MVVM，React是MVC。

MVVM(Model-View-ViewModel)是在MVC(Model View Controller)的基础上，VM抽离Controller中展示的业务逻辑，而不是替代Controller，其它视图操作业务等还是应该放在Controller中实现。

也就是说MVVM实现的是业务逻辑组件的重用，使开发更高效，结构更清晰，增加代码的复用性。

可以理解为MVVM是MVC的升级版。

虽然React不算一个完整的MVC框架，可以认为是MVC中的V(View)，但是Vue的MVVM还是更面向未来一些。

### 10.2 数据绑定

vue是双向绑定，react是单向绑定。

单向绑定的优点是相应的可以带来单向数据流，这样做的好处是所有状态变化都可以被记录、跟踪，状态变化通过手动调用通知，源头易追溯，没有“暗箱操作”。同时组件数据只有唯一的入口和出口，使得程序更直观更容易理解，有利于项目的可维护性。

但是Vue虽然是双向绑定，但是也是单向数据流，它的双向绑定只是一个语法糖，想看正经的双向绑定可以去看下Dva。

单向绑定的缺点则是代码量会相应的上升，数据的流转过程变长，从而出现很多类似的重复代码。同时由于对应用状态独立管理的严格要求(单一的全局store)，在处理局部状态较多的场景时(如用户输入交互较多的“富表单型”应用)，会显得冗余。

双向绑定可以在表单交互较多的场景下，会简化大量业务无关的代码。

我认为Vue的设计方案好一些，全局性数据流使用单向，局部性数据流使用双向。

### 10.3 数据更新

**10.3.1 React 更新流程**

React 推崇 Immutable(不可变)，通过重新render去发现和更新自身。

**10.3.2 Vue 更新流程**

Vue通过收集数据依赖去发现更新。

Vue很吸引人的就是它的响应式更新，Vue首次渲染触发data的getter，从而触发依赖收集，为对应的数据创建watcher，当数据发生更改的时候，setter被触发，然后通知各个watcher在下个tick的时候更新数据。

所以说，如果data中某些数据没有在模板template 中使用的话，更新这些数据的时候，是不会触发更新的。这样的设计非常好，没有在模版上用到的变量，当它的值发生变化时，不更新视图，相当于内置了React的shouldComponentUpdate。

**10.3.3 更新比较**

*   **获取数据更新的手段和更新的粒度不一样**

Vue通过**依赖收集**，当数据更新时 ，Vue明确知道是哪些数据更新了，每个组件都有自己的渲渲染watcher，掌管当前组件的视图更新，所以可以精确地更新对应的组件，所以更新的粒度是**组件级别**的。

React会递归地把所有的子组件重新render一下，不管是不是更新的数据，此时，都是新的。然后通过 diff 算法 来决定更新哪部分的视图。所以，React 的更新粒度是一个整体。

*   **对更新数据是否需要渲染页面的处理不一样**

> *   只有依赖收集的数据发生更新，Vue 才会去重新渲染页面
> *   只要数据有更新(setState，useState 等手段触发更新)，都会去重新渲染页面 （可以使用shouldComponentUpdate/ PureComponent 改善)

Vue的文档里有一描述说，Vue是细粒度数据响应机制，所以说数据更新这一块，我认为Vue的设计方案好一些。

### 10.4 性能对比

**借用尤大大的一段话：**

> 模板在性能这块吊打 tsx，在 IDE 支持抹平了的前提下用 tsx 本质上是在为了开发者的偏好牺牲用户体验的性能（性能没遇到瓶颈就无所谓） 这边自己不维护框架的人吐槽吐槽我也能理解，毕竟作为使用者只需要考虑自己爽不爽。作为维护者，Vue 的已有的用户习惯、生态和历史包袱摆在那里，能激进的程度是有限的，Vue 3 的大部分设计都是戴着镣铐跳舞，需要做很多折衷。如果真要激进还不如开个新项目，或者没人用的玩票项目，想怎么设计都可以。 组件泛型的问题也有不少人提出了，这个目前确实不行，但不表示以后不会有。 最后实话实说，所有前端里面像这个问题下面的类型体操运动员们毕竟是少数，绝大部分有 intellisense + 类型校验就满足需求了。真的对类型特别特别较真的用 React 也没什么不好，无非就是性能差点。

**为什么模板性能吊打TSX？**

tsx和vue template其实都是一样的模版语言，tsx最终也会被编译成createElement，模板被编译成render函数，所以本质上两者都有compile-time和runtime，但tsx的特殊性在于它本身是在ts语义下的，过于灵活导致优化无从下手。但是vue的模板得益于自身本来就是DSL，有自己的文法和语义，所以vue在模板的compile-time做了巨多的优化，比如提升不变的vnode，以及blocktree配合patchflag靶向更新，这些优化在最终的runtime上会把性能拉开不少。

> DSL： 一种为**特定领域**设计的，具有**受限表达性**的**编程语言。**

所以说Vue的性能是优于React的。

### 10.5. React Hooks和Vue Hooks

其实 React Hook 的限制非常多，比如官方文档中就专门有一个\*\*章节\*\*介绍它的限制：

1.  不要在循环，条件或嵌套函数中调用 Hook
2.  确保总是在你的 React 函数的最顶层调用他们。
3.  遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。

而 Vue 带来的不同在于：

1.  与 React Hooks 相同级别的逻辑组合功能，但有一些重要的区别。 与 React Hook 不同，setup函数仅被调用一次，这在性能上比较占优。
    
2.  对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数，产生的的 GC 压力较小。
    
3.  不必考虑几乎总是需要 useCallback 的问题，以防止传递函数prop给子组件的引用变化，导致无必要的重新渲染。
    
4.  React Hook 有臭名昭著的闭包陷阱问题，如果用户忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量，这不受此问题的影响。 Vue 的自动依赖关系跟踪确保观察者和计算值始终正确无误。
    
5.  不得不提一句，React Hook 里的「依赖」是需要你去手动声明的，而且官方提供了一个 eslint 插件，这个插件虽然大部分时候挺有用的，但是有时候也特别烦人，需要你手动加一行丑陋的注释去关闭它。
    

我们认可 React Hooks 的创造力，这也是 Vue-Composition-Api 的主要灵感来源。上面提到的问题确实存在于 React Hook 的设计中，我们注意到 Vue 的响应式模型恰好完美的解决了这些问题。

\--- 来自ssh

Vue的组合式API刚出来的时候确实一看好像React Hooks，我也对它的.value进行了吐槽，

但是总体来说还是更偏向于Vue Hooks。

### 10.6 写法

React的思路是all in js，通过js来生成html，所以设计了jsx，还有通过js来操作css，社区的styled-component、jss等，所以说React的写法感觉相对自由一些，逻辑正确老子想怎么写怎么写，对于我来说，我确实更偏向于React的写法。

Vue则是把html，css，js组合到一起，就像 Web 开发多年的传统开发方式一样， vue-loader会解析文件，提取每个语言块用各自的处理方式，vue有单文件组件(SFC)，可以把html、css、js写到一个文件中，html提供了模板引擎来处理。Vue感觉是给你搭了一个框架，告诉你什么地方该写什么东西，你只要按照他的要求向里面填内容就可以了，没有React那么自由，但是上手难度简单了许多。而且因为SFC，一个组件的代码会看起来很长，维护起来很头痛。

然后考虑了下业务环境，我们要做的是多人视频及共享白板，所以对数据更新有比较高的要求，而Vue的dom渲染和数据处理是强于react的，所以最后我们选择的是Vue。

11\. 组件库选择
==========

这边我思考了两个选择，一个是elemenmt-plus,另一个是ant-design-vue。

element-plus是一套为开发者、设计师和产品经理准备的基于 Vue 3 的桌面端组件库，他的针对性很强，vue3和桌面端都比较满足我们的需求。

antd-vue是antd对vue的适配，我之前用过，感觉还可以。

最后选择了针对性比较强的element-plus。

css

 代码解读

复制代码

`npm i element-plus --save`

然后全部引入就可以了。

javascript

 代码解读

复制代码

`import { createApp } from 'vue'; import App from './App.vue'; import ElementPlus from 'element-plus' import 'element-plus/dist/index.css' createApp(App)   .use(ElementPlus)   .mount("#app");`

12\. ESLint 和 prettier
======================

### 12.1 ESLint和TSLint

ESLint是JavaScript代码检查工具，使用ESLint能让我们的代码遵循特定的样式格式。并且检查代码是否符合格式规范。

可能有人听过TSLint，它是为TypeScript为生的。但在2019年，TSLint的团队决定不再继续维护，推荐使用ESLint来替代。主要不维护的原因就是TSLint和ESLint功能一致，有这大量重复的代码，所以不搞了。

以后TypeScript的项目我们去使用ESLint就好了。

### 12.2 配置ESLint

 代码解读

复制代码

`npm install eslint -g`

全局安装ESLint后，插件中安装ESLint。

csharp

 代码解读

复制代码

`eslint --init`

初始化后，在当前目录下生成一个名为.eslintrc.js 的配置文件，可以自己按个人喜好进行配置，[eslint.bootcss.com/docs/rules/…](https://link.juejin.cn/?target=https%3A%2F%2Feslint.bootcss.com%2Fdocs%2Frules%2F%25E3%2580%2582 "https://link.juejin.cn/?target=https%3A%2F%2Feslint.bootcss.com%2Fdocs%2Frules%2F%25E3%2580%2582")

**修改settings.json：**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a2d2a51e93a48e79b81ec7600d90c51~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 12.3 prettier

ESLint 和 Prettier 的区别是什么呢？

eslint（包括其他一些 lint 工具）的主要功能包含代码格式的校验，代码质量的校验。

而 Prettier 只是代码格式的校验（并格式化代码），不会对代码质量进行校验。

css

 代码解读

复制代码

`npm install --save-dev --save-exact prettier`

在根目录下创建`.prettierrc.js`配置文件。

在`.prettierrc.js`中写入以下内容：

java

 代码解读

复制代码

`//此处的规则供参考，其中多半其实都是默认值，可以根据个人习惯改写 module.exports = {   printWidth: 80, //单行长度   tabWidth: 2, //缩进长度   useTabs: false, //使用空格代替tab缩进   semi: true, //句末使用分号   singleQuote: true, //使用单引号   quoteProps: 'as-needed', //仅在必需时为对象的key添加引号   jsxSingleQuote: true, // jsx中使用单引号   trailingComma: 'all', //多行时尽可能打印尾随逗号   bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }   jsxBracketSameLine: true, //多属性html标签的‘>’折行放置   arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x   requirePragma: false, //无需顶部注释即可格式化   insertPragma: false, //在已被preitter格式化的文件顶部加上标注   proseWrap: 'preserve', //不知道怎么翻译   htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感   vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进   endOfLine: 'lf', //结束行形式   embeddedLanguageFormatting: 'auto', //对引用代码进行格式化 };`

13\. 日志模块
=========

我们的实现逻辑是，线上环境打印出错误时隐藏，把错误放在文件中，启动错误日志上传窗口，由用户自行判断该日志是否上传。

ini

 代码解读

复制代码

      `window.onerror = function (message, source, lineno, colno, error) {         exportRaw('报错信息：' + message + '文件位置：' + source, 'error');         return true;       };     const exportRaw = (data, name) => {       let urlObject = window.URL || window.webkitURL || window;       let export_blob = new Blob([data]);       let save_link = document.createElementNS(         'http://www.w3.org/1999/xhtml',         'a',       );       save_link.href = urlObject.createObjectURL(export_blob);       save_link.download = name;       save_link.click();     };`

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b2a5fcf121c42fb80391b1c2ace05d1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

14\. 后续规划(基础建设及性能优化)
====================

项目还在启动阶段，我有很多规划目前比较难以得到实施，比如：

1.  配置ESLint + prettier + yorkie(husky),git hooks
2.  线上报警体统sentry.js
3.  埋点，权限管理等配置
4.  前后端交互方案(swagger/Yapi)
5.  自动发布(jenkins)
6.  内存走查和性能优化

有缘的话会把基础建设步骤和性能参数分析，以及性能优化及具体数据发出