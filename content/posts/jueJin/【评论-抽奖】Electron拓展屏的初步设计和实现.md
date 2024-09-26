---
author: "编程三昧"
title: "【评论-抽奖】Electron拓展屏的初步设计和实现"
date: 2021-09-09
description: "这次的活动是作者可以获得两枚掘金徽章，在评论区通过抽奖的方式将这两枚徽章送给积极参与互动的朋友，这也算是借花献佛了(￣▽￣)~*。"
tags: ["Electron","JavaScript","设计"]
ShowReadingTime: "阅读6分钟"
weight: 639
---
在参加完8月更文的活动后，感觉整个人都被掏空了，本来打算好好的休养生息一波的，结果申请的掘金周边礼物活动竟然通过了，这真是“人在家中坐，喜从天上来”。

很荣幸能成为首批名额中的一员，感谢社区的大力支持！

这次的活动是作者可以获得两枚掘金徽章，在评论区通过抽奖的方式将这两枚徽章送给积极参与互动的朋友，这也算是借花献佛了 (￣▽￣)~\*。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fbe377028ed416d821029bff79372b0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

所以，看完文章的你千万别忘了在评论区留下你的真知灼见，说不定中奖的那个人就是你哦！

前言
--

我辈码猿，不是在做需求就是在接需求，让人不得不感慨一下：需求复需求，需求何其多！

这不，本来之前开发出的 Electron 客户端，基本可以满足项目需求了，自以为可以好好放松一下了，谁知客户又给整出了幺蛾子——需要支持拓展屏。

需求分析
----

所谓的拓展屏，相当于是从主屏窗口复制出一个窗口，显示在主屏幕之外的其他显示器上，并且这些分屏窗口除了一些控制功能（登录、登出、分屏、切换服务等）外，其余功能都和主屏窗口相同。

因为我们的 Electron 客户端的作用是提供一个壳子，里面的加载的是其他服务提供的页面，所以这里需要考虑的就只有窗口控制了，相对来说比较简单。

要点枚举
----

### 获取所有屏幕信息

程序一启动，首先获取屏幕个数及其属性：

js

 代码解读

复制代码

`const { screen } = require("electron"); // 存储所有连接的显示器的信息 let displaysMap = new Map(); function getAllDisplays() {     const allDisplays = screen.getAllDisplays();     for (let i = 0; i < allDisplays.length; i++) {         const display = allDisplays[i];         displaysMap.set(display.id, display);     } } function getBrowserOptsByDisplay(display) {     const { bounds, workAreaSize } = display;     const { x, y } = bounds;     const { width, height } = workAreaSize;     let isPrimary = false;     if (display.id === screen.getPrimaryDisplay().id) {         isPrimary = true;     }     return { x, y, width, height, isPrimary }; } function getBrowserOpts() {     let opts = [];     const displays = displaysMap.values();     for (const display of displays) {         opts.push(getBrowserOptsByDisplay(display));     }     return opts; } screen.on("display-added", (event, newDisplay) => {     displaysMap.set(newDisplay.id, newDisplay);     // 创建窗口的逻辑等 }); screen.on("display-removed", (event, oldDisplay) => {     displaysMap.delete(oldDisplay.id);     // 移除窗口的逻辑 });`

这里需要注意的是，主屏幕一般默认是 allDisplays 的第一个，但是也有例外，取决于显示器的接入的方式。我们可通过 `screen.getPrimaryDisplay()` 来获取主屏对象。

### 根据屏幕创建窗口

根据屏幕属性（主要是位置和尺寸）创建各自对应的的窗口，我们将窗口的设置成默认占满整个屏幕：

js

 代码解读

复制代码

`const { BrowserWindow } = require("electron"); const path = require("path"); let windowsMap = new Map(); // 记录主窗口的id let masterWindowId = 0; function createWindowByOpts(opts) {     const customOpts = Object.assign(         {             title: "窗口标题",             show: false,             icon: path.join(process.cwd(), "./static/icon/icon.png"),             webPreferences: {                 preload: path.join(__dirname, "./src/preload.js"),                 nodeIntegration: true,                 webSecurity: false             }         },         opts     );     let win = new BrowserWindow(customOpts);     if (opts.isMaster) {         masterWindowId = win.id;         win.once("ready-to-show", () => {             win.show();         });     }     windowsMap.set(win.id, win); } function createWindows() {     const allOpts = getBrowserOpts();     for (const opts of allOpts) {         createWindowByOpts(opts);     } }`

可能有人会有疑问，直接最大化就好了，为什么还要给窗口设置尺寸呢？如果不设置尺寸的话，当窗口退出全屏之后，其大小为默认值 `800 * 800`，用户体验不太好。

### 将屏幕信息传给渲染进程

因为要通过点击进行分屏，所以渲染进程需要知道总共有几个屏幕。这里将所有屏幕的信息传给渲染进程：

js

 代码解读

复制代码

`function sendAllScreensInfoToRender() {     const masterWindow = windowsMap.get(masterWindowId);     if (!masterWindow) {         return false;     }     masterWindow.webContents.send("all-screens-info", displaysMap.values); }`

因为分屏操作只能在主屏窗口上进行，所以，这里只需要给主屏幕对应的渲染进程发送信息即可。

### 将窗体信息发送至渲染进程

我们可以将窗口的一些关键信息发送至它对应的渲染进程，以减少通信次数：

js

 代码解读

复制代码

`function sendKeyInfoToRender(win) {     const windowId = win.id;     const isMaster = win.id === masterWindowId;     const webContentsId = win.webContents.id;     win.webContents.send("window-key-info", {windowId, isMaster, webContentsId}); }`

### 分屏免登录

可执行分屏的前提应该是主屏已经成功登录，为了方便用户，分出去的窗口需要免登录，一打开显示的应该和主屏窗口当前的显示一致。

为了实现免登录功能，主窗口在分屏操作时，需要将自己的登录名称和密码传给分屏窗口，分屏根据用户名和密码执行一次静默登录。

### 分屏和主屏区分

由于涉及到授权名额的限制，一个主窗口占用一个名额，分屏不占用授权名额，因此需要对主屏和分屏进行区分。

在登录和登出参数中增加一个属性 `is_master`，值类型为 bool，表示是否是主屏窗口的请求。后台在接收到登录请求后进行判断：

*   如果 is\_master 为 true，则分配一个授权
*   否则，不作任何授权占用操作

登出请求也是同样处理。

### 分屏隐藏则断开连接

因为页面上的数据都是通过 WS 连接推送上来的，所以每个窗口都需要建立一个 WS 连接。

一开始的时候，我在创建窗口的时候就将页面加载过来了，不管这个窗口有没有显示，这有点浪费性能。

现在的处理方案是：

*   如果执行了分屏操作，则给对应的窗口加载页面并显示
*   如果关闭了分屏窗口，则给它加载一个空白页面文件，以此断开 WS 连接和渲染消耗

### 卸载窗体内容时发送登出请求

在页面刷新或者关闭时，都会执行登出操作：

js

 代码解读

复制代码

`window.on("beforeunload", function () {     const data = {username, userhandle, is_master};     const path = "https://localhost:9001";     window.navigator.sendBeacon(path, JSON.stringify(data)); })`

给窗体加载空白页面也可触发窗体卸载事件。

TODO
----

分屏的初步功能已经实现，后续还需要做的优化有以下几个方面。

### 切换服务后的分屏显示

目前的实现是，每次切换服务后都隐藏所有分屏窗口，需要再次手动点击分屏才可加载显示。后续的优化方案是：

*   记录正在显示的窗口id
*   切换服务时隐藏所有分屏窗口
*   服务切换成功后，根据记录将之前已经显示的窗口重新加载显示

### 主屏关闭或者移除后的处理

目前对主屏的关闭和移除未做任何处理，后续计划在主屏关闭或者移除后，将主屏窗口移动到某个分屏上。

### 窗口间通信优化

目前采用的方案是将主进程当做消息中转站，后续计划使用 poseMessage API 在窗口间直接通信。

总结
--

以上就是 Electron 客户端拓展屏的实现思路和方案，如果你有更好的实现方式，欢迎评论区留言探讨哦！

抽奖方式
----

本次活动的抽奖我会采用随机抽取方式，保证公平，所以人人都有机会！

抽奖时间：9月12日 22:00（之后参与评论的朋友将无法参与抽奖）

抽奖方式：随机抽取（代码执行）

心动不如行动，请在评论区为自己争取一份机会哦！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/281f22ece19f470dbb577d0699fd60ee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

~

~本文完，感谢阅读！

~

> 学习有趣的知识，结识有趣的朋友，塑造有趣的灵魂！
> 
> 大家好，我是〖[编程三昧](https://juejin.cn/user/2893570333750744/posts "https://juejin.cn/user/2893570333750744/posts")〗的作者 **隐逸王**，我的公众号是『[编程三昧](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyinyiwang%2FblogImages%2Fraw%2Fmaster%2Fimages%2F20210604%2520%2F19-26-03-txvEvM.png "https://gitee.com/yinyiwang/blogImages/raw/master/images/20210604%20/19-26-03-txvEvM.png")』，欢迎关注，希望大家多多指教！
> 
> 你来，怀揣期望，我有墨香相迎！ 你归，无论得失，唯以余韵相赠！
> 
> 知识与技能并重，内力和外功兼修，理论和实践两手都要抓、两手都要硬！