---
author: "Augus"
title: "CSS响应式布局之REM（二）"
date: 2021-10-28
description: "上一章我们说了REM的两个插件，一个是`lib-flexible`解决一些自适应问题，一个是`postcss-plugin-px2rem`可以把px转换为rem。今天我们就来说一下如何配置REM。"
tags: ["CSS","SCSS"]
ShowReadingTime: "阅读1分钟"
weight: 347
---
小知识，大挑战！本文正在参与“[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")”创作活动。

前言
==

上一章我们说了REM的两个插件，一个是`lib-flexible`解决一些自适应问题，一个是`postcss-plugin-px2rem`可以把px转换为rem。

今天我们就来说一下如何配置REM。

配置REM
=====

*   首先我们想要配置REM，首先就要明白他是根据根节点`<html>`字体宽度作为参照的，所以我们要做的就是动态修改不同分辨率下的根节点`<html>`字体宽度。
    
*   其中我们还要理解一个概念，屏幕分辨率。
    

屏幕分辨率
-----

> 屏幕分辨率：指横纵向上的像素点数，单位是`px`。屏幕分辨率越高，显示的画面就越细腻。反之，显示的画面就比较模糊。这也就是为什么需要在，分辨率较低的环境下，我们需要作相应的适配了。

而`rem`是一个相对单位，最后还是由浏览器具体根据根元素的字体大小转换为相应`px`。

实现代码
----

针对需要需要适配的环境，我们可以会通过JS依根据屏幕宽度与设计图宽度的比例动态设置`<html>`的`font-size`，以`rem`为长度单位声明所有节点的几何属性，这样就能做到大部分移动设备的页面兼容，兼容出入比较大的地方在特殊处理就可以了。

ini

 代码解读

复制代码

`function AutoResponse(width = 1920) {   const target = document.documentElement;   if (target.clientWidth >= 1920) {     target.style.fontSize = "100px";   } else {     target.style.fontSize = target.clientWidth / width * 100 + "px";   } } AutoResponse();`

> 需要注意的是：还需在`<html>`中声明以下代码，阻止用户缩放屏幕。

ini

 代码解读

复制代码

`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1">`

好，今天就到这里了，今天努力的你依然是最棒的。Bye Bye！！！