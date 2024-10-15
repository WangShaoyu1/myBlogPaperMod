---
author: "王宇"
title: "linux万得厨开发文档"
date: 九月19,2024
description: "linux双屏端项目配置"
tags: ["linux双屏端项目配置"]
ShowReadingTime: "12s"
weight: 130
---
  

  

  

下载仓库代码，脚本在如下文档
==============

[虚拟人项目配置和万得厨项目配置脚本](/pages/viewpage.action?pageId=129193548)

  

**其中algocc模块是公共模块代码，不需要单独编译，其他模块编译的时候会引用并且编译它，**

  

公共so库路径
=======

在 ~/work/libs目录下，

配置vs code远程开发。文档如下
==================

[linux桌面 远程开发 vs code配置](/pages/viewpage.action?pageId=134061325)

  

通过ps 命令。查看万得厨各个模块运行情况。
======================

[?]()

`ps -ef | grep shuying`

`root` `3350` `1` `0` `Sep18 ?` `00``:``00``:``01` `/opt/dw223_tmp/shuying_nvidia_dw223_wifimanager`

`yingzi` `3364` `1` `7` `Sep18 ?` `01``:``29``:``48` `/opt/dw223_tmp/shuying_nvidia_dw223_heating_service`

`yingzi` `3394` `1` `0` `Sep18 ?` `00``:``01``:``42` `/opt/dw223_tmp/shuying_nvidia_dw223_multicamera`

`yingzi` `3411` `1` `0` `Sep18 ?` `00``:``00``:``29` `/opt/dw223_tmp/shuying_nvidia_dw223_message_router`

`yingzi` `3424` `1` `0` `Sep18 ?` `00``:``00``:``26` `/opt/dw223_tmp/shuying_nvidia_dw223_cloud_service`

`root` `3469` `1` `0` `Sep18 ?` `00``:``01``:``09` `/opt/dw223_tmp/shuying_nvidia_dw223_otaupdate`

`yingzi` `3486` `1` `5` `Sep18 ?` `01``:``00``:``54` `/opt/dw223_tmp/shuying_nvidia_dw223_oven_capability_service`

  

各个模块说明：

shuying\_nvidia\_dw223\_wifimanager：wifi模块

shuying\_nvidia\_dw223\_heating\_service：加热模块（不需要烹饪功能可以不用安装）

shuying\_nvidia\_dw223\_multicamera：摄像头模块（不需要拍照功能可以不用安装）

shuying\_nvidia\_dw223\_message\_router：消息路由模块（必须需要）

shuying\_nvidia\_dw223\_cloud\_service

shuying\_nvidia\_dw223\_otaupdate：ota升级模块（不需要升级可以不用）

shuying\_nvidia\_dw223\_oven\_capability\_service：公共能力服务模块（必须）

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)