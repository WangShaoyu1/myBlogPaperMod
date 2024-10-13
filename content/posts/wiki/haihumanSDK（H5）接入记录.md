---
author: "王宇"
title: "haihumanSDK（H5）接入记录"
date: 六月21,2023
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 515
---
1.介绍
====

核心即是调用**haihuman.module.js**，同时需要将**haicore\_sdk.wasm**放在项目根目录

2.接入常见项目
========

1.umi react
-----------

  

2.uniapp
--------

### 踩坑点：

有些项目的vite配置用到了新语法糖配置，如

  

![](/download/attachments/105254635/image2023-6-21_17-32-14.png?version=1&modificationDate=1687339934925&api=v2)

这样会影响到有$的地方，刚好**haihuman.module.js**有$这个函数，导致编译时就崩溃

最好弄掉这个配置，或者使用更高级的正则（暂时还未成功）

3.原生js
------

  

  

未完待续

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)