---
author: "王宇"
title: "electron做一个mp4转m3u8的应用"
date: 四月03,2024
description: "Electron"
tags: ["Electron"]
ShowReadingTime: "12s"
weight: 524
---
背景：
===

直接播放mp4格式的视频太卡，体积也很大。而M3U8 通常用于流媒体服务，如在线视频平台，它将视频分割成多个小块，以便在播放时逐步加载，实现实时播放和自适应比特率

  

electron进程通信
============

![eproc](https://cn.electron-vite.org/electron-processes.png)

  

1.electron一些内置api
=================

clipboard
---------

  

dialog
------

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)