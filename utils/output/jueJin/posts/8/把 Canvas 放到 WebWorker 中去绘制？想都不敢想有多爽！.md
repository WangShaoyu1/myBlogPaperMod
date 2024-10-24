---
author: "Sunshine_Lin"
title: "把 Canvas 放到 WebWorker 中去绘制？想都不敢想有多爽！"
date: 2024-08-05
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 最近项目中需要绘制一块画布，大致上样子如下，就是绘制一堆人名在 Canvas 上（实际业务比这个复杂"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:13,views:408,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

最近项目中需要绘制一块画布，大致上样子如下，就是绘制一堆人名在 Canvas 上（实际业务比这个复杂）

![image.png](/images/jueJin/35a8d0d025b044b.png)

大致代码如下

![image-15.png](/images/jueJin/be63a20450bc43f.png)

页面肯定不止只有 Canvas 的逻辑，就比如我在绘制画布后，想去计算 1-100 的数字总和

![image-13.png](/images/jueJin/91def18700134a5.png)

但是最终发现，绘制画布耗费了很多时间，差不多有 1s 的时间，并且堵塞了主进程的代码，导致了我后续的逻辑被堵住了，下图可以看到，我的 computedTotal 结果是在画布绘制完菜执行完的

![image-16.png](/images/jueJin/34c08d925fe0421.png)

所以绘制画布的耗时过长，阻塞了后续的同步代码逻辑，这是不合理的，我们需要做优化

Web Worker？
-----------

我们平时在遇到这类情况的时候，十有八九第一时间都会想到 `Web Worker`

但是问题来了：正常来说，`Web Worker` 中可获取不了 DOM，做不了画布绘制呀

估计会有人想：那我们可以把 Canvas 的 DOM 节点传入 Web Worker 中吗？

可以试试

我们先准备一个 `worker.js` 来存放 Web Worker 的代码

![image-5.png](/images/jueJin/22fea4fb2157495.png)

接着在 index.js 中把 Canvas 的 DOM 节点传过去

![image-4.png](/images/jueJin/d05d9f396c37424.png)

发现会报错，因为 postMessage 传数据的时候会进行深拷贝，而 DOM 节点无法被深拷贝

![image-6.png](/images/jueJin/84bb93bfeb924bb.png)

那么传上下文过去可以吗？也可以试试

![image-8.png](/images/jueJin/d1e9d3f3b057469.png)

可以发现，还是不行

![image-7.png](/images/jueJin/4bc9e407822d4f8.png)

canvas.transferControlToOffscreen
---------------------------------

不得不说 JavaScript 是真的强大，早就为我们准备好了一个 API ，那就是 **transferControlToOffscreen**

![image-9.png](/images/jueJin/36f797f0080c409.png)

有了这个 API ，我们就可以把 Canvas 的 DOM 节点以另一种方式传入 Web Worker 了！！！我们也能在 Web Worker 中去进行 Canvas 的绘制，进而优化主线程的代码执行效率！！

首先改造一下 drawSunshine，现在只需要传入 Canvas DOM，不需要在主线程去做绘制

![image-17.png](/images/jueJin/cc7daf5268c943b.png)

接着我们在 `worker.js` 中去接收 DOM 节点，并进行画布绘制

![image-19.png](/images/jueJin/1a8c07460782485.png)

最终可以看到，Canvas 的绘制并不会阻塞后续逻辑的执行

![image-18.png](/images/jueJin/a6abba4a5f1d4b7.png)

API 兼容性
-------

![image-20.png](/images/jueJin/85d0b43a45bb465.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有10000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")