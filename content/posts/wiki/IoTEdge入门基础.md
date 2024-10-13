---
author: "王宇"
title: "IoTEdge入门基础"
date: 六月27,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 259
---
此文章适用于想要开始使用Azure IoT Edge的用户，提供了详细的安装和配置指导，以及如何利用VS Code插件进行模块部署和管理。

IoT Edge是什么？
============

Azure IoT Edge 是以设备为中心的运行时，可用于部署、运行和监视容器化 Linux 工作负荷。

  

通过将业务逻辑打包到标准容器，生成 IoT Edge 模块映像，并管理部署到每个设备中。简单的讲，就是可以部署镜像到远程模块设备中。

  

安装 IoT Edge
===========

  

ubuntn 22.04 

  

[?](#)

`wget https:``//packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb`

`sudo dpkg -i packages-microsoft-prod.deb`

`rm packages-microsoft-prod.deb`

  

  

安装容器引擎
------

  

Azure IoT Edge 依赖于 [OCI](https://opencontainers.org/) 兼容的容器运行时。 对于生产方案，建议使用 Moby 引擎。 Moby 引擎是官方唯一支持用于 IoT Edge 的容器引擎。 Docker CE/EE 容器映像与 Moby 运行时兼容

[?](#)

`sudo apt-get update; \`

  `sudo apt-get install moby-engine`

  

安装 IoT Edge 运行时
---------------

安装最新版本的 IoT Edge 和 IoT 标识服务包

[?](#)

`sudo apt-get update; \`

   `sudo apt-get install aziot-edge`

使用以下命令通过对称密钥身份验证配置 IoT Edge 设备：

  

[?](#)

`sudo iotedge config mp --connection-string` `'PASTE_DEVICE_CONNECTION_STRING_HERE'`

此 `iotedge config mp` 命令在设备上创建一个配置文件，并在配置文件中输入你的连接字符串

连接字符串 从创建的设备模块属性中查看，如下

  

![](/download/attachments/129176209/image2024-6-27_17-36-36.png?version=1&modificationDate=1719480995231&api=v2)

应用配置更改。

[?](#)

`sudo iotedge config apply`

若要查看配置

[?](#)

`sudo cat /etc/aziot/config.toml`

  

这样部署模块就能部署到当前设备

安装vs code插件
===========

在vs code中安装如下插件

Azure Iot Edge插件

Azure lot Hub 插件

Azure Account插件

在config下面的json文件。右键就可以一键模块部署到设备

  

IoT Edge设备管理和日志查看
=================

**常用命令**

部署并运行模块后，使用以下命令在设备中将其列出：

  

[?](#)

`iotedge list`

  

查看应用模块日志命令，比如我们应用里面std::cout的输出的日志。-f 参数表示可以一直输出

  

[?](#)

`iotedge logs -f moduleName`

  

  

查看系统日志。该日志包含镜像模块的创建容器的启动过程。如果发现部署后，设备上没反应。多半在这里面可以找到原因

[?](#)

`sudo iotedge system logs`

由于控制面板显示的日志有限。有些日志可能看不到。因此可以如下，把日志输出到文件中。在当前log.txt文件里面可以看到全部日志

  

[?](#)

`sudo iotedge system logs > log.txt`

  

重启所有模块

  

[?](#)

`iotedge system restart`

  

参考：

[在 Linux 上使用对称密钥创建 IoT Edge 设备 - Azure IoT Edge | Microsoft Learn](https://learn.microsoft.com/zh-cn/azure/iot-edge/how-to-provision-single-device-linux-symmetric?view=iotedge-1.5&tabs=azure-portal%2Cubuntu#install-iot-edge)

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)