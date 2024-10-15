---
author: "王宇"
title: "杭州虚拟人（sdk裸包）cpu占用验证"
date: 五月10,2023
description: "七、测试"
tags: ["七、测试"]
ShowReadingTime: "12s"
weight: 185
---
杭州公司提供的sdk结论是占用cpu10%-20%

杭州提供apk（裸包）：[app\_sample-debug.apk](/download/attachments/101823762/app_sample-debug.apk?version=1&modificationDate=1683690007122&api=v2)

![](/download/attachments/101823762/image2023-5-10_11-59-39.png?version=1&modificationDate=1683691179527&api=v2)

背景：为了验证杭州公司提供sdk的占用cpu标准，针对以上数据，我们单独进行测试。  
测试机器：172.19.50.40 【KR3568主板】  
测试结论：测试结果与杭州反馈的一致，整个过程cpu都是在40%-70%抖动，但是这是基于4核的，与杭州公司对应起来，换算过来也是在10%—20%。  
测试数据：

![](https://static.dingtalk.com/media/lQLPJv_M6rh7YtLNAkTNBBSwVjfvB3b_bIYEUorWuwAOAQ_1044_580.png)

![](https://static.dingtalk.com/media/lQLPJxS51zY1gtLNAkTNBBSwAD_4xvgn8G4EUorWs0AMAQ_1044_580.png)

![](https://static.dingtalk.com/media/lQLPJw1D5twuQtLNAkTNBBSwsr8mLVURyX8EUorWugAMAA_1044_580.png)

![](https://static.dingtalk.com/media/lQLPJyKLxmpiotLNAkTNBBSwCrbxyUH0YV4EUorWuwAOAA_1044_580.png)

![](https://static.dingtalk.com/media/lQLPJwf4wTN3ItLNAkTNBBSwwPP1UgWcEdMEUorWs0AMAA_1044_580.png)

![](https://static.dingtalk.com/media/lQLPJxhab0yGUtLNAkTNBBSw0X0shiX1b-QEUorWugAMAQ_1044_580.png)  
   
  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)