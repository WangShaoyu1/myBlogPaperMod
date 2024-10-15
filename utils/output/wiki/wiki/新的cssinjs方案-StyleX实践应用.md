---
author: "王宇"
title: "新的cssinjs方案-StyleX实践应用"
date: 二月01,2024
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 559
---
2023年几个虚拟人h5项目的css in js部分都是用styils这个库

* * *

  

背景
==

StyleX 已成为 Meta 公司内的每个 Web 界面样式化组件的首选方案

[https://stylexjs.com/](https://stylexjs.com/)

  

跟其他css in js方案区别
================

如**styled\-components**,为了加个样式，就要写个组件

![](/download/thumbnails/114683726/image2024-2-1_17-3-27.png?version=1&modificationDate=1706778207894&api=v2)

  

而StyleX，直接写js

![](/download/attachments/114683726/image2024-2-1_17-5-1.png?version=1&modificationDate=1706778302060&api=v2)

  

安装使用问题
======

  

vite安装问题

[https://github.com/HorusGoul/vite-plugin-stylex/issues/29](https://github.com/HorusGoul/vite-plugin-stylex/issues/29)

  

JS 核心 api
=========

*   stylex.create()：使用对象的形式 `创建` 静态和动态样式
*   stylex.props(): 使用对象的形式 `设置` React 的 Props 对象
*   stylex.keyframes()： 创建 css 关键帧动画
*   stylex.firstThatWorks()： 定义样式回退方案
*   stylex.defineVars()： 定义变量
*   stylex.createTheme()： 定义主题

  

坑
=

ios低版本不兼容样式

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)