---
author: "王宇"
title: "AzureIoTEdge编译和部署相关，初代文档"
date: 六月27,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 276
---
项目编译与部署文档
---------

### 目录

1.  [项目编译部分](#项目编译部分)
    *   [云端编译](#云端编译)
    *   [本地编译](#本地编译)
        *   [环境准备](#环境准备)
        *   [编译操作](#编译操作)
2.  [部署部分](#部署部分)
    *   [Azure IoT Edge 设备在部署前需要预装的软件](#azure-iot-edge-设备在部署前需要预装的软件)
    *   [安装 Docker](#安装-docker)
    *   [安装 Azure IoT Edge Runtime](#安装-azure-iot-edge-runtime)
    *   [配置 IoT Edge](#配置-iot-edge)
    *   [验证安装和配置](#验证安装和配置)

* * *

项目编译部分
------

项目的编译目前可以采用两种方式：云端编译和本地编译。

### 云端编译

将项目代码提交到代码仓库，云端自动编译并生成镜像。

**优点**：便捷，由云端完成。  
**缺点**：代码编译速度慢，不适合调试，目前未找到云端调试方式。

#### 提交代码前的前序工作

如果涉及基础镜像的修改，则修改虚拟人模块所使用基础镜像的 `Dockerfile.arm64v9`。默认为 `Dockerfile.arm64v8`，无需修改。

**基础镜像**：

[?](#)

`FROM acrembeddedfttdeveastus2001.azurecr.io/base/arm64v8_ubuntu_22.``04``:v1 AS base`

此基础镜像包含众多库文件，无需在 Dockerfile 中编写过多库文件下载命令。

### 本地编译

在本地编译并生成镜像文件。

**优点**：编译速度快，便于程序调试。  
**缺点**：第一次拉取需要的环境和编译环境耗时。

#### 环境准备

在进行本地编译之前，需要准备以下环境：

1.  **安装 Docker**：请参阅 [Docker 官方文档](https://docs.docker.com/get-docker/) 以获取安装步骤。
2.  **安装必要的库**：在终端中运行以下命令：
    
    [?](#)
    
    `sudo apt update`
    
    `sudo apt install -y curl libasound2 libspdlog-dev libboost-all-dev libzmq3-dev libczmq-dev libc++-dev libc++abi-dev`
    
3.  **安装编译工具**：确保你有 `g++` 和其他必要的编译工具：
    
    [?](#)
    
    `sudo apt install -y build-essential`
    
4.  **安装 QT 5.14.2**：请参阅 [Qt 官方文档](https://doc.qt.io/qt-5/gettingstarted.html) 以获取安装步骤。

#### 编译操作

1.  **打开项目代码**：
    
    *   使用 VS Code 打开项目代码。
    *   安装以下 VS Code 插件：Azure IoT Edge、Azure IoT Hub、Azure Account。
2.  **编译项目**：
    
    *   在 VS Code 中，右键点击 `deployment.template.json` 文件，选择 `Build IoT Edge Solution`，等待编译完成。第一次编译时可能会因镜像文件和库文件的下载而耗时较长。

**提示**：如果在本地编译时遇到网络问题，导致 Docker 镜像拉取困难，可以尝试开启 VPN 后重新编译。

部署部分
----

### Azure IoT Edge 设备在部署前需要预装的软件

在部署前，确保 Edge 设备预装以下软件：

软件

作用

命令

备注

软件

作用

命令

备注

Docker

提供 Edge 运行环境，模块以容器方式运行

`docker --version`

Docker 版本 26.1.3

Azure IoT Edge Runtime

设备运行 IoT Edge 模块所需的核心组件

`iotedge list`

NVIDIA 驱动

Edge 模块开启 GPU 加速依赖驱动

`nvidia-smi`

Ubuntu 22.04 上安装 NVIDIA-SMI 540.3.0 CUDA Version: 12.2

### 安装 Docker

Azure IoT Edge 依赖于 Docker 运行时环境。首先，确保在设备上安装 Docker。详细步骤请参阅 [Docker 官方文档](https://docs.docker.com/get-docker/)。

### 安装 Azure IoT Edge Runtime

Azure IoT Edge Runtime 是在设备上运行 IoT Edge 模块所需的核心组件。

#### 安装步骤

1.  配置 Microsoft 包存储库：
    
    [?](#)
    
    `curl https:``//packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -`
    
    `sudo add-apt-repository` `"deb [arch=arm64] [https://packages.microsoft.com/ubuntu/20.04/prod](https://packages.microsoft.com/ubuntu/20.04/prod) $(lsb_release -cs) main"`
    
    `sudo apt-get update`
    
    `sudo apt-get install aziot-edge`
    

### 配置 IoT Edge

安装完成后，需要配置 IoT Edge 以便其能够与 Azure IoT 中心进行通信。

#### 配置步骤

1.  编辑配置文件：
    
    [?](#)
    
    `sudo nano /etc/aziot/config.toml`
    
2.  在配置文件中，设置设备连接字符串：
    
    [?](#)
    
    `[provisioning]`
    
    `source =` `"manual"`
    
    `connection_string =` `"HostName=<your-iothub-hostname>;DeviceId=<your-device-id>;SharedAccessKey=<your-shared-access-key>"`
    
3.  将 `<your-iothub-hostname>`、`<your-device-id>` 和 `<your-shared-access-key>` 替换为从 Azure IoT 中心获取的实际值。
4.  保存并关闭配置文件。
    
5.  应用配置更改并启动 IoT Edge：
    
    [?](#)
    
    `sudo iotedge config apply`
    

### 验证安装和配置

确保 IoT Edge 正确安装并配置，可以使用以下命令验证：

1.  查看 IoT Edge 状态：
    
    [?](#)
    
    `sudo iotedge system status`
    
2.  列出已部署的模块：
    
    [?](#)
    
    `sudo iotedge list`
    

通过以上步骤，你可以准备好设备以便部署 Azure IoT Edge。确保所有安装和配置正确无误，以便设备能够顺利运行 IoT Edge 模块。

* * *

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)