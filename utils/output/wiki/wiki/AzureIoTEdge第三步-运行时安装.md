---
author: "王宇"
title: "AzureIoTEdge第三步-运行时安装"
date: 六月27,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 273
---
### 安装Docker

[访问Wiki页面,Docker version 26.1.3安装，中科大源](https://wiki.yingzi.com/pages/viewpage.action?pageId=123665774)

### 手动创建 Microsoft 包源文件

1.  打开终端并创建一个新的包源文件：

[?](#)

`sudo` `nano` `/etc/apt/sources``.list.d``/microsoft-prod``.list`

1.  将以下内容粘贴到打开的文件中：

    deb [arch=amd64,arm64,armhf] https://packages.microsoft.com/ubuntu/22.04/prod jammy main
    

1.  保存并退出 nano 编辑器（按 `Ctrl+X`，然后按 `Y`，最后按 `Enter`）。

### 添加 Microsoft 的 GPG 密钥

1.  添加 Microsoft 的 GPG 密钥：

[?](#)

`sudo` `curl https:``//packages``.microsoft.com``/keys/microsoft``.asc |` `sudo` `apt-key add -`

### 更新包列表并安装 IoT Edge

1.  更新包列表：

[?](#)

`sudo` `apt-get update`

1.  安装 Azure IoT Edge 软件包：

[?](#)

`sudo` `apt-get` `install` `aziot-edge`

### 配置和启动 Azure IoT Edge

1.  配置 Azure IoT Edge 设备（替换 `<your-iot-hub-connection-string>` 为你的 IoT Hub 连接字符串）：

[?](#)

`sudo` `iotedge config mp --connection-string` `"<your-iot-hub-connection-string>"`

1.  启动并启用 Azure IoT Edge 服务：

[?](#)

`sudo` `systemctl` `enable` `aziot-edge`

`sudo` `systemctl start aziot-edge`

### 验证安装

1.  检查 Azure IoT Edge 服务状态：

[?](#)

`sudo` `systemctl status aziot-edge`

1.  检查 Azure IoT Edge 设备状态：

[?](#)

`sudo` `iotedge system status`

1.  运行检查命令以验证配置：

[?](#)

`sudo` `iotedge check`

1.  列出已部署的模块：

[?](#)

`sudo` `iotedge list`

这样整理后，你可以更清晰地按顺序执行每个步骤，确保正确安装和配置 Azure IoT Edge。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)