---
author: "王宇"
title: "Electron在win10打包linux应用之路"
date: 四月03,2024
description: "Electron"
tags: ["Electron"]
ShowReadingTime: "12s"
weight: 527
---
  

  

迁移其他盘区，出意外

![](/download/attachments/122522841/image2024-3-21_10-42-28.png?version=1&modificationDate=1710988948578&api=v2)

[https://github.com/microsoft/WSL/issues/5393](https://github.com/microsoft/WSL/issues/5393)

下载这玩意，下载后找运维开个权限来安装

  

![](/download/attachments/122522841/image2024-3-21_11-15-35.png?version=1&modificationDate=1710990935915&api=v2)

  

继续gg

  

![](/download/attachments/122522841/image2024-3-21_11-14-59.png?version=1&modificationDate=1710990899652&api=v2)

  

[https://github.com/microsoft/WSL/issues/10288](https://github.com/microsoft/WSL/issues/10288)  
[https://github.com/microsoft/WSL/issues/4800](https://github.com/microsoft/WSL/issues/4800)

  

  

于是重装wsl

![](/download/attachments/122522841/image2024-3-22_15-21-39.png?version=1&modificationDate=1711092100438&api=v2)

  

找运维，说可能是wsl2不支持，得切回wsl

[https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)

[https://blog.csdn.net/2301\_77554343/article/details/134137031](https://blog.csdn.net/2301_77554343/article/details/134137031)

  

后来安装成功，也成功打包，但wsl1不支持gui应用

  

那打好直接放到炉子里吧，发现执行不了

![](/download/attachments/122522841/image2024-3-27_15-18-52.png?version=1&modificationDate=1711523932669&api=v2)

  

查下electron-builder官方

[https://www.electron.build/api/electron-builder#module\_electron-builder](https://www.electron.build/api/electron-builder#module_electron-builder)

加个打包配置

![](/download/attachments/122522841/image2024-3-27_16-1-13.png?version=1&modificationDate=1711526473385&api=v2)

  

报错，也许是网络问题

![](/download/attachments/122522841/image2024-3-27_16-2-44.png?version=1&modificationDate=1711526565082&api=v2)

  

切换一个网络，继续报错，叫我安装snapcaraft?

![](/download/attachments/122522841/image2024-3-27_16-3-33.png?version=1&modificationDate=1711526613732&api=v2)

  

然而电脑只能装wsl1

![](/download/attachments/122522841/image2024-3-27_16-4-6.png?version=1&modificationDate=1711526646104&api=v2)

  

  

革命尚未成功，下一步安装虚拟机

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)