---
author: "王宇"
title: "docker命令2"
date: 六月15,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 257
---
  

docker container ls
===================

**列出当前正在运行的Docker容器**

### 基本语法

docker container ls \[OPTIONS\] 

或者docker ps \[OPTIONS\]

### 选项（OPTIONS）

该命令支持多个选项，用于定制输出或过滤结果。以下是一些常用的选项：

*   `-a`, `--all`: 显示所有容器（包括已停止的容器）。默认情况下，只显示正在运行的容器。
*   `-q`, `--quiet`: 仅显示容器ID，不显示其他详细信息。这在你需要快速获取容器ID列表时非常有用。
*   `--no-trunc`: 不截断输出，显示完整的容器ID和命令等信息。
*   `--format`: 使用Go模板语言格式化输出。这是一个高级选项，允许你自定义输出的格式。
*   `--filter` 或 `-f`: 根据提供的条件过滤输出。例如，你可以使用此选项来查找具有特定名称、标签或状态的容器。
*   `--size`: 显示容器的文件大小。
*   `--latest`: 仅显示最近创建的容器（包括所有状态）。
*   `--last`: 显示最近创建的n个容器（包括所有状态）。
*   `--since`: 显示自某个timestamp之后的创建或状态更改的容器，或显示自某个容器的创建之后的容器（包括所有状态）。
*   `--before`: 显示自某个timestamp之前的创建或状态更改的容器，或显示到某个容器的创建之前的容器（包括所有状态）。

  

输出如下

CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES  
dcc3765dc089 [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.1.25-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.1.25-arm64v8) "./yingzi\_vdh" 19 minutes ago Up 19 minutes AvatarModule  
ccfa6cbec0ed [acrembeddedfttdeveastus2001.azurecr.io/samplemodule:0.0.15-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/samplemodule:0.0.15-arm64v8) "./sample" 38 minutes ago Up 38 minutes SampleModule  
89418a0596dd [mcr.microsoft.com/azureiotedge-hub:1.4](http://mcr.microsoft.com/azureiotedge-hub:1.4) "/bin/sh -c 'echo \\"$…" 2 days ago Up 12 hours 0.0.0.0:443->443/tcp, :::443->443/tcp, 0.0.0.0:5671->5671/tcp, :::5671->5671/tcp, 0.0.0.0:8883->8883/tcp, :::8883->8883/tcp, 1883/tcp edgeHub  
921031443b10 [mcr.microsoft.com/azureiotedge-agent:1.4](http://mcr.microsoft.com/azureiotedge-agent:1.4) "/bin/sh -c 'exec /a…" 2 days ago Up 12 hours

  

字段及其说明：

1.  **CONTAINER ID**:
    *   容器的唯一标识符。这是一个长字符串，通常用于在Docker命令中指定特定的容器。
2.  **IMAGE**:
    *   容器基于的Docker镜像名称。这表示容器是从哪个镜像创建的。
3.  **COMMAND**:
    *   容器启动时执行的命令。这通常是镜像中定义的默认命令，或者在运行`docker run`时指定的命令。
4.  **CREATED**:
    *   容器创建的时间。这表示容器从何时开始存在，而不是它何时开始运行。
5.  **STATUS**:
    *   容器的当前状态。常见的状态包括“Up”（正在运行）、“Exited”（已退出）等。如果容器正在运行，该字段通常还会显示容器已经运行了多长时间。
6.  **PORTS**:
    *   容器暴露的端口和映射到宿主机的端口。这显示了哪些网络端口被容器使用，以及它们是如何映射到宿主机上的。
7.  **NAMES**:
    *   容器的名称。Docker为每个容器分配一个唯一的名称，这个名称可以用于在Docker命令中引用容器。如果运行`docker run`时指定了`--name`选项，那么该名称将出现在这里。否则，Docker会生成一个随机名称。

  

docker run 创建并启动新容器的命令
======================

### 1 命令格式

`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

  

### 2 常用选项(OPTIONS)

  

*   **\-d, --detach=false**: 在后台运行容器，并返回容器ID。
*   **\-i, --interactive=false**: 保持STDIN开放，即使没有附加到容器，也允许进行交互。
*   **\-t, --tty=false**: 分配一个伪终端，常用于使容器像交互式shell一样运行。
*   **\-u, --user=""**: 指定运行容器的用户名或UID及组或GID。
*   **\-a, --attach=\[\]**: 连接到容器的STDIN、STDOUT或STDERR。
*   **\-w, --workdir=""**: 设置容器内部的工作目录。
*   **\-c, --cpu-shares=0**: 设置CPU权重，用于在CPU密集型任务中分配更多的CPU时间。
*   **\-e, --env=\[\]**: 设置环境变量，可以多次使用此标志来设置多个环境变量。
*   **\-m, --memory=""**: 设置容器的内存使用上限。
*   **\-P, --publish-all=false**: 将容器的所有暴露端口映射到宿主机的随机端口。
*   **\-p, --publish=\[\]**: 将容器的端口映射到宿主机上的端口，格式为`hostPort:containerPort`。
*   **\-h, --hostname=""**: 设置容器的主机名。
*   **\-v, --volume=\[\]**: 挂载卷，使宿主机和容器之间可以共享文件系统。
*   **\--volumes-from=\[\]**: 从另一个容器挂载卷。
*   **\--cap-add=\[\]** 和 **\--cap-drop=\[\]**: 添加或删除Linux功能。
*   **\--cidfile=""**: 将容器ID写入指定文件。
*   **\--cpuset=""**: 设置容器可以使用的CPU。
*   **\--device=\[\]**: 添加主机设备到容器。
*   **\--dns=\[\]**: 设置容器的DNS服务器。
*   **\--dns-search=\[\]**: 设置容器的DNS搜索域。
*   **\--entrypoint=""**: 覆盖镜像默认的入口点。
*   **\--env-file=\[\]**: 从文件读取环境变量。

  

### 3\. 镜像 (IMAGE)

  

`IMAGE`是要运行的Docker镜像的名称。Docker会从本地镜像存储或Docker Hub等注册中心获取该镜像。

  

### 4\. 命令 (COMMAND) 和参数 (ARG)

  

`[COMMAND]`是容器启动后要执行的命令，`[ARG...]`是该命令的参数。如果镜像中定义了默认的命令（如CMD指令在Dockerfile中定义），则可以省略此部分。

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)