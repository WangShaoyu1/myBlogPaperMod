---
author: "Sunshine_Lin"
title: "比 Nodejs 运行速度快 10 倍！新的 JavaScript 运行时横空出世！"
date: 2024-04-21
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 挑战 Nodejs 的地位？ Nodejs 是一个 JavaScript 的运行环境，大部分前端程序"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:0,views:423,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

挑战 Nodejs 的地位？
--------------

Nodejs 是一个 JavaScript 的运行环境，大部分前端程序员或多或少都接触过 Nodejs

![](/images/jueJin/72f1d190a2664ec.png)

不了解不知道，一了解吓一跳，当我们觉得 Nodejs 是无可替代的时候，其实这几年，出现了很多后起之秀挑战 Nodejs 的王者地位，比如`Deno、Bun`

![](/images/jueJin/030088c050e64ca.png)

![](/images/jueJin/72e3cfd715c34f1.png)

可以说，这些后起之秀都有各自的特点，也都火了一把这也促进了 JavaScript 技术的不断进步这是好事~

比 Nodejs 快 10 倍？
----------------

![](/images/jueJin/7c6a982b08394e3.png)

就在最近，又有一个后起之秀，宣称 JavaScript 运行速度能比 Nodejs 快 10 倍！！！有点离谱啊！

它叫做 **LLRT**，是亚马逊推出的，短短时间内，github 上已经有 6.6k 的 star 了

并且官方放出了 LLRT 和 Nodejs 的速度对比，可以看出速度非常之快

**LLRT - DynamoDB Put, ARM, 128MB:**

![](/images/jueJin/bfcc9926ea2e40a.png)

**Node.js 20 - DynamoDB Put, ARM, 128MB:**

![](/images/jueJin/0950f4269db544a.png)

![](/images/jueJin/c2584efd5371497.png)

### LLRT 介绍

LLRT（低延迟运行时）是一种轻量级的 JavaScript 运行时，旨在满足对快速高效的无服务器应用程序日益增长的需求。与在 AWS Lambda 上运行的其他 JavaScript 运行时相比，LLRT 的启动速度提高了 10 倍以上，总体成本降低了 2 倍

它内置于 Rust 中，利用 QuickJS 作为 JavaScript 引擎，确保高效的内存使用和快速启动。

> LLRT 是一个实验包。它可能会发生变化，仅用于评估目的。

> LLRT 仅支持一小部分 Node.js API。它不是Node.js的替代品，也永远不会是。下面是部分支持的 API 和模块的高级概述。有关更多详细信息，请参阅 API 文档

![](/images/jueJin/b3f6199129f941d.png)

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

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")