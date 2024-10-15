---
author: "王宇"
title: "docker命令"
date: 六月14,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 259
---
  

**进入docker容器**
==============

sudo docker exec -it 6b4204c03ffa bash

这条命令的作用是进入标识为`6b4204c03ffa`的Docker容器内的bash shell，以便用户可以在容器内执行命令、查看容器内部情况等操作。

  

  

**查看当前正在运行的Docker容器的状态**。  
sudo docker ps
==========================================

  

  

**iotdege list查看镜像运行情况**
========================

NAME STATUS DESCRIPTION Config  
AvatarModule running Up 2 seconds, 294 ms, 635 µs and 113 ns [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8)  
edgeAgent running Up 4 hours [mcr.microsoft.com/azureiotedge-agent:1.4](http://mcr.microsoft.com/azureiotedge-agent:1.4)  
edgeHub running Up 4 hours [mcr.microsoft.com/azureiotedge-hub:1.4](http://mcr.microsoft.com/azureiotedge-hub:1.4)

  

NAME:模块运行名称，

STATUS:运行状态

DESCRIPTION：运行时间

Config：运行镜像

  

**docker build 构建 Docker 镜像**
=============================

  

### 基本语法

  

bash复制代码

  

  

docker build \[OPTIONS\] PATH | URL | -

  

*   `OPTIONS`：用于指定构建镜像时的各种选项。
*   `PATH` | `URL` | `-`：指定构建上下文的路径、Git 仓库的 URL 或 `-` 表示从标准输入中读取 Dockerfile。

  

### 常用选项（OPTIONS）

1.  **\-t, --tag**：为构建的镜像指定名称和标签，格式为 `name:tag` 或 `name`。
    
    *   示例：`docker build -t myapp:v1.0 .`
2.  **\-f, --file**：指定 Dockerfile 的路径或名称。默认为 `PATH/Dockerfile`。
    
    *   示例：`docker build -f /path/to/my/Dockerfile .`
3.  **\--build-arg**：设置构建时的变量，这些变量可以在 Dockerfile 中使用。
    
    *   示例：`docker build --build-arg user=john --build-arg password=secret .`
4.  **\--no-cache**：构建时不使用缓存。默认情况下，Docker 会使用缓存来加速构建过程。
    
    *   示例：`docker build --no-cache .`
5.  **\--pull**：总是尝试从远程仓库拉取最新的基础镜像。
    
    *   示例：`docker build --pull .`
6.  **\--compress**：使用 gzip 压缩构建上下文。
    
    *   示例：`docker build --compress .`
7.  **\--label**：为生成的镜像设置元数据。
    
    *   示例：`docker build --label "com.example.version=1.0" .`
8.  **\--squash**：将 Dockerfile 中的所有操作压缩为一层。注意，这可能导致镜像在多个环境之间无法共享层。
    
    *   示例：`docker build --squash .`
9.  **\--memory** 或 **\-m**：设置 Docker build 命令的内存限制。
    
    *   示例：`docker build --memory 2g .`
10.  **\--network**：设置 RUN 指令在构建期间的网络模式。
    
    *   示例：`docker build --network host .`
11.  **\--quiet, -q**：在构建成功后只输出镜像 ID，不输出其他日志。
    
    *   示例：`docker build -q .`
12.  **\--force-rm**：构建完成后总是删除中间容器。
    
    *   示例：`docker build --force-rm .`
13.  **\--rm**：默认设置。构建成功后删除中间容器
    

  

实例：

docker build --rm -f "/data/project/ftt-em-edge/modules/AvatarModule/Dockerfile.arm64v8" -t [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8) "/data/project/ftt-em-edge/modules/AvatarModule"

  

1.  **docker build**：这是 Docker 的一个基本命令，用于从 Dockerfile 构建 Docker 镜像。
2.  **\--rm**：这个选项告诉 Docker 在构建完成后删除中间容器。中间容器是 Docker 在构建过程中创建的，用于执行 Dockerfile 中的每一行指令。在构建完成后，这些容器通常不再需要，所以使用 `--rm` 选项可以节省磁盘空间。
3.  **\-f "/data/project/ftt-em-edge/modules/AvatarModule/Dockerfile.arm64v8"**：这个选项指定了 Dockerfile 的路径。默认情况下，Docker 会在当前目录或指定的构建上下文目录中查找名为 `Dockerfile` 的文件。但在这里，你指定了一个不同的文件名和路径，即 `/data/project/ftt-em-edge/modules/AvatarModule/Dockerfile.arm64v8`，这表示 Docker 会从这个路径中读取 Dockerfile 来构建镜像。
4.  **\-t [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8)**：这个选项用于为构建的镜像指定一个名称和标签。在这个例子中，镜像的名称是 `[acrembeddedfttdeveastus2001.azurecr.io/avatarmodule](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule)`，标签是 `0.0.47-arm64v8`。这个名称看起来像是 Azure Container Registry (ACR) 的一个镜像仓库路径，意味着这个镜像最终会被推送到 Azure Container Registry 的 `acrembeddedfttdeveastus2001` 仓库中，并且命名为 `avatarmodule`。
5.  **"/data/project/ftt-em-edge/modules/AvatarModule"**：这是构建上下文的路径。构建上下文是 Docker 在构建过程中可以访问的一组文件和目录。在这个例子中，Docker 会将 `/data/project/ftt-em-edge/modules/AvatarModule` 目录（以及其中的所有文件和子目录）发送到 Docker 守护进程，然后 Docker 会根据 Dockerfile 中的指令来构建镜像。

综上所述，这条命令的意思是：从 `/data/project/ftt-em-edge/modules/AvatarModule/Dockerfile.arm64v8` 文件中读取指令，使用 `/data/project/ftt-em-edge/modules/AvatarModule` 目录作为构建上下文，构建一个 Docker 镜像，并将这个镜像命名为 `[acrembeddedfttdeveastus2001.azurecr.io/avatarmodule](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule)`，标签为 `0.0.47-arm64v8`。在构建完成后，删除中间容器以节省磁盘空间。

**docker push 推送**
==================

`docker push` 命令是用于将本地 Docker 镜像推送到远程 Docker 镜像仓库的主要命令之一

docker push \[OPTIONS\] NAME\[:TAG\]

*   `OPTIONS`：可选参数，用于指定推送镜像时的各种选项。
*   `NAME`：要推送的镜像的名称。
*   `TAG`：镜像的标签，用于标识镜像的版本或标识符，是可选的。

### 常用选项（OPTIONS）

1.  **\-a, --all-tags**：推送镜像的所有标签。如果不指定此选项，则只推送具有指定标签的镜像。

  

示例

docker push [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.47-arm64v8)

  

### 使用步骤

1.  **登录到远程仓库**：  
    在推送镜像之前，您需要先使用 `docker login` 命令登录到目标远程仓库。这通常是 Docker Hub 或其他自托管的 Docker 镜像仓库。
    
      
    
    bash复制代码
    
      
    
      
    
    docker login -u 用户名 -p 密码 仓库地址
    
      
    
    例如，登录到 Docker Hub：
    
      
    
    bash复制代码
    
      
    
      
    
    docker login -u your\_username -p your\_password
    
      
    

  

        **2. 推送镜像**：  
一旦登录成功，您就可以使用 `docker push` 命令将本地镜像推送到远程仓库。

  

bash复制代码

  

  

docker push NAME\[:TAG\]

  

例如，推送一个名为 `myimage` 的镜像到 Docker Hub（如果不指定标签，则默认为 `latest`）：

  

获取docker中的文件
============

docker cp [container\_id\_or\_name:/app/AIUI/msc/aiui.log](http://container_id_or_name/app/AIUI/msc/aiui.log) /local/path/aiui.log

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)