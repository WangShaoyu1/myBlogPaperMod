---
author: "Sunshine_Lin"
title: "Jquery40发布！下载量依旧是 Vue 的两倍！"
date: 2024-04-28
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 背景 其实在去年，Jquery 就宣布了要发布 4 版本 可以看到，Jquery 在五天前发布了 4"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:115,comments:139,collects:70,views:25204,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

背景
--

其实在去年，Jquery 就宣布了要发布 4 版本

![](/images/jueJin/57a61faa13ca46b.png)

可以看到，Jquery 在五天前发布了 4 版本

![](/images/jueJin/08fca52910e143a.png)

![](/images/jueJin/46f12f49504a4b9.png)

Jquery4.0 更新了啥？
---------------

接下来说一下到底更新了啥？

### 弃用了 1x 和 2x 版本，废弃一些方法

这意味着不再去兼容低版本了，未来 Jquery 将着力于发展新的版本，弃用了一些方法

*   jQuery.cssNumber
*   jQuery.cssProps
*   jQuery.isArray
*   jQuery.parseJSON
*   jQuery.nodeName
*   jQuery.isFunction
*   jQuery.isWindow
*   jQuery.camelCase
*   jQuery.type
*   jQuery.now
*   jQuery.isNumeric
*   jQuery.trim
*   jQuery.fx.interval

### Typescript 重构

看过 Jquery 源码的都知道，以前 Jquery 是用 JavaScript 写的，现在新版本是采用 Typescript 重构的，提高整体代码的可维护性

### 对新特性的支持

jQuery 4.0 将添加对新的 JavaScript 特性的支持，包括：

*   async/await
*   Promise
*   Optional Chaining
*   Nullish Coalescing

### 优化性能

*   优化 DOM 操作
*   改进事件处理
*   优化 Ajax 请求
*   增强兼容性

### 增强兼容性

*   支持 Internet Explorer 11 和更高版本
*   支持 Edge 浏览器
*   支持 Safari 浏览器

FormData 支持

jQuery.ajax 添加了对二进制数据的支持，包括 FormData。

此外，jQuery 4.0 还删除了自动 JSONP 升级、将 jQuery source 迁移至 ES 模块；以及添加了对 Trusted Types 的支持，确保以 TrustedHTML 封装的 HTML 能以不违反 require-trusted-types-for 内容安全策略指令的方式用作 jQuery 操作方法的输入。

由于删除了 Deferreds 和 Callbacks（现在压缩后不到 20k 字节），jQuery 4.0.0 的 slim build 变得更加小巧。

还有人用 Jquery 吗？
--------------

随着现在前端发展的迅速，越来越多人投入了 React、Vue 的怀抱，这意味着越来越少人用 Jquery 了，而且用 Jquery 的基本都是老项目，老项目都是求稳的，所以也不会去升级 Jquery

所以我不太看好 Jquery 后续的发展趋势，虽然曾经它真的帮助了我们很多

虽然如此，现阶段 NPM 上，Jquery 的下载量依旧是 Vue 的两倍

![](/images/jueJin/7d1436c230cd46b.png)

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