---
author: "MacroZheng"
title: "开发者必备Docker命令"
date: 2019-06-17
description: "本文主要讲解Docker环境的安装以及Docker常用命令的使用，掌握这些对Docker环境下应用的部署具有很大帮助。 Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows机器上。使用…"
tags: ["Docker中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:20,views:3344,"
---
摘要
--

本文主要讲解Docker环境的安装以及Docker常用命令的使用，掌握这些对Docker环境下应用的部署具有很大帮助。

Docker 简介
---------

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows机器上。使用Docker可以更方便低打包、测试以及部署应用程序。

Docker 环境安装
-----------

*   安装yum-utils：

```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

*   为yum源添加docker仓库位置：

```
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

*   安装docker:

```
yum install docker-ce
```

*   启动docker:

```
systemctl start docker
```

Docker 镜像常用命令
-------------

### 搜索镜像

```
docker search java
```

![展示图片](/images/jueJin/16b6553970314eb.png)

### 下载镜像

```
docker pull java:8
```

### 如何查找镜像支持的版本

> 由于docker search命令只能查找出是否有该镜像，不能找到该镜像支持的版本，所以我们需要通过docker hub来搜索支持的版本。

*   进入docker hub的官网，地址：[hub.docker.com](https://link.juejin.cn?target=https%3A%2F%2Fhub.docker.com "https://hub.docker.com")
    
*   然后搜索需要的镜像：
    
    ![展示图片](/images/jueJin/16b655397082e60.png)
    
*   查看镜像支持的版本：
    
    ![展示图片](/images/jueJin/16b65539734f354.png)
    
*   进行镜像的下载操作：
    

```
docker pull nginx:1.17.0
```

### 列出镜像

```
docker images
```

![展示图片](/images/jueJin/16b655397c1b8ba.png)

### 删除镜像

*   指定名称删除镜像

```
docker rmi java:8
```

*   指定名称删除镜像（强制）

```
docker rmi -f java:8
```

*   强制删除所有镜像

```
docker rmi -f $(docker images)
```

Docker 容器常用命令
-------------

### 新建并启动容器

```
docker run -p 80:80 --name nginx -d nginx:1.17.0
```

*   \-d选项：表示后台运行
*   \--name选项：指定运行后容器的名字为nginx,之后可以通过名字来操作容器
*   \-p选项：指定端口映射，格式为：hostPort:containerPort

### 列出容器

*   列出运行中的容器：

```
docker ps
```

![展示图片](/images/jueJin/16b65539ab48a4d.png)

*   列出所有容器

```
docker ps -a
```

![展示图片](/images/jueJin/16b65539b361074.png)

### 停止容器

```
# $ContainerName及$ContainerId可以用docker ps命令查询出来
docker stop $ContainerName(或者$ContainerId)
```

比如：

```
docker stop nginx
#或者
docker stop c5f5d5125587
```

### 强制停止容器

```
docker kill $ContainerName(或者$ContainerId)
```

### 启动已停止的容器

```
docker start $ContainerName(或者$ContainerId)
```

### 进入容器

*   先查询出容器的pid：

```
docker inspect --format "{{.State.Pid}}" $ContainerName(或者$ContainerId)
```

*   根据容器的pid进入容器：

```
nsenter --target "$pid" --mount --uts --ipc --net --pid
```

![展示图片](/images/jueJin/16b65539f1674c2.png)

### 删除容器

*   删除指定容器：

```
docker rm $ContainerName(或者$ContainerId)
```

*   强制删除所有容器；

```
docker rm -f $(docker ps -a -q)
```

### 查看容器的日志

```
docker logs $ContainerName(或者$ContainerId)
```

![展示图片](/images/jueJin/16b65539b5d38ad.png)

### 查看容器的IP地址

```
docker inspect --format '{{ .NetworkSettings.IPAddress }}' $ContainerName(或者$ContainerId)
```

![展示图片](/images/jueJin/16b65539f111573.png)

### 同步宿主机时间到容器

```
docker cp /etc/localtime $ContainerName(或者$ContainerId):/etc/
```

### 在宿主机查看docker使用cpu、内存、网络、io情况

*   查看指定容器情况：

```
docker stats $ContainerName(或者$ContainerId)
```

![展示图片](/images/jueJin/16b6553a0001574.png)

*   查看所有容器情况：

```
docker stats -a
```

![展示图片](/images/jueJin/16b6553a0994a84.png)

### 进入Docker容器内部的bash

```
docker exec -it $ContainerName /bin/bash
```

![展示图片](/images/jueJin/16b6553a21eafcd.png)

修改Docker镜像的存放位置
---------------

*   查看Docker镜像的存放位置：

```
docker info | grep "Docker Root Dir"
```

![展示图片](/images/jueJin/16b6553a2889601.png)

*   关闭Docker服务：

```
systemctl stop docker
```

*   移动目录到目标路径：

```
mv /var/lib/docker /mydata/docker
```

*   建立软连接：

```
ln -s /mydata/docker /var/lib/docker
```

![展示图片](/images/jueJin/16b6553a273d413.png)

![展示图片](/images/jueJin/16b6553a35ddb1f.png)

公众号
---

mall项目全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16b5116c9d74a6a.png)