---
author: "王宇"
title: "APPUIM+android在电脑实现手机模拟操作及数据收集"
date: 十月11,2023
description: "唐玮"
tags: ["唐玮"]
ShowReadingTime: "12s"
weight: 314
---
  

  

### 连接模拟器/设备

第1步，在模拟器/手机设备中打开“开发者模式”→开启“USB调试”

![](/download/thumbnails/109721889/image2023-10-11_9-36-51.png?version=1&modificationDate=1696988211196&api=v2)

第2步，检查设备连接情况

当出现cannot connect to daemon 即无法开启服务的提示时。这时一般是有其他的软件和abd用了同一个端口。所以可以在电脑环境变量中添加修改port端口的环境变量，以避免无法启动adb server。（参考：[Android 修改adb端口的方法-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1742424)）

![](/download/attachments/109721889/image2023-10-11_9-37-31.png?version=1&modificationDate=1696988251841&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)