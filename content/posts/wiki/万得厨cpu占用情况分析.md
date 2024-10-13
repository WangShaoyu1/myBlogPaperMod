---
author: "王宇"
title: "万得厨cpu占用情况分析"
date: 三月10,2023
description: "七、测试"
tags: ["七、测试"]
ShowReadingTime: "12s"
weight: 165
---
一、背景
----

  
当我们设备开启持续保存录音文件时，因为当前逻辑没有对存储语音做拆分或者定时删除逻辑，现在是往一个文件夹里面不断写入音频，当音频文件达到一定的大小（如十几G），设备就会明显的出现卡顿，语音唤醒比较慢，严重界面会报应用奔溃，已经影响到设备的正常使用。

二、排查分析
------

  
1.通过连接设备查看设备资源使用情况

![](https://static.dingtalk.com/media/lQLPJxrxdNUGHjzNBA_NB4CwJnoiFnO9OzgEA-aoewBVAA_1920_1039.png)

![](/download/attachments/97889668/image2023-3-10_10-20-2.png?version=1&modificationDate=1678414802601&api=v2)

同时结合软硬件工程师的分析，并不是因为内存暂用比较高导致，现0.9g，我设备是8g运行内存，最终定位原因是cpu快被占满，当音频文件很大时不断的写入会消耗非常的io性能，导致设备卡顿。  
  
结合以上分析，我们把储存的音频文件删除后，重启应用，设备运营正常，语音唤醒功能也正常了，设备没有出现卡顿的情况。此时连接设备查看资源消耗情况，发现消耗资源还是相对比较高，前三大头是我们应用和渲染动画和语音播放，如下图  
![](/download/attachments/97889668/image2023-3-10_10-29-18.png?version=1&modificationDate=1678415358354&api=v2)  
  
基于以上的分析，我们又尝试了在设备上单独安装虚拟人demo，把我们的应用卸载，再次连接设备排查资源消耗情况，发现单独虚拟人demo占用消耗的资源也不少，前面三大头是虚拟人和渲染动画和语音播放，如下图

  
![](/download/attachments/97889668/image2023-3-10_10-33-26.png?version=1&modificationDate=1678415606482&api=v2)

三、总结
----

  
基于以上分析情况，虚拟人接入到设备rk3568板子还是比较大的挑战，后续板子会升级选择性能更好的，但是虚拟人这块也需要优化，减少资源的占用，减少对整个设备负载。  
  
关于虚拟人占用资源较大的问题，已经发给第三方分析，等待他们回复。  
  
  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)