---
author: "王宇"
title: "手机端PTA验收"
date: 四月08,2024
description: "李梦阳"
tags: ["李梦阳"]
ShowReadingTime: "12s"
weight: 353
---
*   1[1\. PTA创建](#id-手机端PTA验收-PTA创建)
*   2[2\. 角色管理](#id-手机端PTA验收-角色管理)
*   3[3\. 同步炉端](#id-手机端PTA验收-同步炉端)

版本号

PRD资源

说明

版本号

PRD资源

说明

1.0.9

[手机端虚拟人PTA\_20240220.rp](/download/attachments/123640205/%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%99%9A%E6%8B%9F%E4%BA%BAPTA_20240220.rp?version=1&modificationDate=1712564127798&api=v2)

该版本主要是做PTA同步到炉端的闭环设计

一些**已知bug但当前版本无法解决**的：

（1）虚拟人加载慢，2分钟中左右

（2）PTA照片未进行合法性检测，部分检测返回了错误的错误码

详情可见文档：[PTA功能验收评估文档](/pages/viewpage.action?pageId=123636753)

1\. PTA创建
=========

该模块需要关注以下几点：

（1）在创建完成之后，会有一个直接同步和手机端浏览的弹窗，需要进行关注点开发对于这一块的实现：

刚生成的3D形象，可以选择直接发布与手机浏览，直接发布则走同步炉端的逻辑，具体可见PRD目录：同步炉端（点击跳转至同步炉端产品说明），如果选择手机浏览，则进入人像模式

![](/download/thumbnails/123640205/image2024-4-8_16-24-27.png?version=1&modificationDate=1712564609825&api=v2)

（2）所同步的炉端需要设备在线，离线设备不可选

![](/download/thumbnails/123640205/image2024-4-8_16-31-57.png?version=1&modificationDate=1712565060121&api=v2)

2\. 角色管理
========

（1）**角色是跟账号走**，无论是手机端还是炉端，如果炉端解绑，则只展示官方角色

![](/download/thumbnails/123640205/image2024-4-8_16-36-58.png?version=1&modificationDate=1712565360916&api=v2)

3\. 同步炉端
========

（1）在这一块需要关注：

*   同步炉端的前提校验：设备在线、设备要绑定用户、只针对2.0家庭版
*   若未绑定炉子/未查找到在线设备，需要设置禁用状态，即不可选
*   最多可进行10个角色的同步，需要理解一点，不是手机端只能同步十次，而是**炉端最多接受10个不同的PTA角色**
*   进行角色删除时，需要进行是否炉端同步删除的弹窗提示，手机端角色删除和炉端角色删除可独立进行，**两端无需同步**

![](/download/thumbnails/123640205/image2024-4-8_16-41-50.png?version=1&modificationDate=1712565652848&api=v2)

  

  

[Filter table data]()[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)