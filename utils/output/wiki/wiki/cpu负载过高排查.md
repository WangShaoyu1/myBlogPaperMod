---
author: "王宇"
title: "cpu负载过高排查"
date: 四月24,2023
description: "十一、项目资源"
tags: ["十一、项目资源"]
ShowReadingTime: "12s"
weight: 85
---
先top定位进程，查看哪个进程使用cpu过高

使用下面命令定位线程

ps -Tp 进程id -o PID,TID,S,TTY,TIME,CMD -k -TIME

  

![](/download/attachments/101814597/image2023-4-24_9-22-40.png?version=1&modificationDate=1682299360603&api=v2)

![](/download/attachments/101814597/image2023-4-24_9-22-51.png?version=1&modificationDate=1682299371695&api=v2)

![](/download/attachments/101814597/image2023-4-24_9-23-3.png?version=1&modificationDate=1682299383977&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)