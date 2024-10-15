---
author: "王宇"
title: "客户端播放A+资源流程"
date: 八月18,2023
description: "虚拟人相关"
tags: ["虚拟人相关"]
ShowReadingTime: "12s"
weight: 100
---
不了解A+资源的同学先看 [FTT平台上A+资源的操作流程](https://wiki.yingzi.com/pages/viewpage.action?pageId=105281511&src=contextnavpagetreemode)

  

*   1[1\. 客户端播放A+资源分为两种：]()
    *   1.1[1.1. 播放离线A+资源](#id-客户端播放A+资源流程-播放离线A+资源)
    *   1.2[1.2. 播放在线的A+资源](#id-客户端播放A+资源流程-播放在线的A+资源)
*   2[2\. 离线A+应用场景](#id-客户端播放A+资源流程-离线A+应用场景)
    *   2.1[2.1. 需要离线/无网状态下播报虚拟人的动效](#id-客户端播放A+资源流程-需要离线/无网状态下播报虚拟人的动效)
    *   2.2[2.2. 角色属性，寒暄话术，FAQ，兜底这类配置了A+资源的（默认是没配置）](#id-客户端播放A+资源流程-角色属性，寒暄话术，FAQ，兜底这类配置了A+资源的（默认是没配置）)
*   3[3\. 在线A+应用场景](#id-客户端播放A+资源流程-在线A+应用场景)
*   4[4\. 客户端交互的整个流程](#id-客户端播放A+资源流程-客户端交互的整个流程)

1\. 客户端播放A+资源分为两种：
==================

1.1. 播放离线A+资源
-------------

离线的A+资源需要下载到本地才能播报

![](/download/attachments/105281804/%E7%A6%BB%E7%BA%BF.png?version=2&modificationDate=1692347406642&api=v2)

1.2. 播放在线的A+资源
--------------

![](/download/thumbnails/105281804/%E5%9C%A8%E7%BA%BF.png?version=1&modificationDate=1692347326748&api=v2)

  

2\. 离线A+应用场景
============

2.1. 需要离线/无网状态下播报虚拟人的动效
-----------------------

常见的场景：小万的唤醒应答词，开始烹饪，暂停烹饪，断网提示等，这类要把A+的id写死在代码里面

2.2. 角色属性，寒暄话术，FAQ，兜底这类配置了A+资源的（默认是没配置）
---------------------------------------

![](/download/attachments/105281804/image2023-8-18_16-37-41.png?version=1&modificationDate=1692347861800&api=v2)

  

3\. 在线A+应用场景
============

适合于所有需要线上播报的场景，只要FTT平台上存在该A+资源都可以播报。

  

4\. 客户端交互的整个流程
==============

![](/download/attachments/105281804/app.png?version=1&modificationDate=1692348838288&api=v2)

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)