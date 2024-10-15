---
author: "王宇"
title: "linux界面开发X11和Wayland"
date: 一月10,2024
description: "任鹏"
tags: ["任鹏"]
ShowReadingTime: "12s"
weight: 337
---
![](/download/attachments/114681605/693b0f38e0eedfae1b233f276fb7aad120151217141926.gif?version=1&modificationDate=1704875954396&api=v2)

X11和Wayland都是Linux桌面环境中的显示服务器协议，用于管理窗口和应用程序的图形显示。但是，它们在实现和功能方面有所不同。

X11是一个传统的显示服务器协议，已经存在很长时间。它是Linux系统中最常用的显示服务器协议，支持多个平台和多个设备。X11使用客户端-服务器模型，其中应用程序（客户端）通过X11服务器与显示设备（服务器）通信。X11通过网络传输图形和事件，使得应用程序可以在本地和远程设备上运行。X11还提供了丰富的自定义选项和插件，可以在桌面环境中进行广泛的定制和扩展。

Wayland是一个相对较新的显示服务器协议，旨在替代X11。Wayland更加现代化和轻量级，提供了更好的性能和安全性。Wayland使用一个简单的客户端-服务器模型，其中应用程序（客户端）直接与显示设备（服务器）通信。这意味着Wayland可以更好地处理窗口管理和图形渲染，减少延迟和卡顿。Wayland还提供了更好的安全性，因为应用程序只能访问它们需要的图形资源，而不是整个屏幕。

  

具体选择哪个协议取决于您的需求和偏好，以及您的Linux发行版和桌面环境是否支持它们。

查看您当前是 Xorg(X11) 还是 Wayland
---------------------------

Terminal 中 运行下列命令

    echo $XDG_SESSION_TYPE

或者

打开“系统设置”，左边找到“关于本系统”

查看图形平台后面的字符串即可！

![](/download/thumbnails/114681605/image2024-1-10_14-45-59.png?version=1&modificationDate=1704869159560&api=v2)

  
  

![](https://pic4.zhimg.com/80/v2-47d1fc69bb67a5c739aebda4ab8fa19f_720w.webp)

  

参考资料：

[https://baijiahao.baidu.com/s?id=1771326892160920085&wfr=spider&for=pc](https://baijiahao.baidu.com/s?id=1771326892160920085&wfr=spider&for=pc)

[https://zhuanlan.zhihu.com/p/669108195](https://zhuanlan.zhihu.com/p/669108195)

[http://www.wowotech.net/graphic\_subsystem/graphic\_subsystem\_overview.html](http://www.wowotech.net/graphic_subsystem/graphic_subsystem_overview.html)

[http://www.wowotech.net/linux\_kenrel/dri\_overview.html](http://www.wowotech.net/linux_kenrel/dri_overview.html)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)