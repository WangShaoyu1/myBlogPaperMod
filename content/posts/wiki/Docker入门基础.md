---
author: "王宇"
title: "Docker入门基础"
date: 六月25,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 279
---
1\. Docker是什么
=============

Docker是基于Go语言实现的**开源容器项目**。它诞生于2013年年初，最初发起者是dotCloud公司。Docker自开源后受到业界广泛的关注和参与，目前已有80多个相关开源组件项目（包括Containerd、Moby、Swarm等），逐渐形成了围绕Docker容器的完整的生态体系。

dotCloud公司也随之快速发展壮大，在2013年年底直接改名为Docker Inc，并专注于Docker相关技术和产品的开发，目前已经成为全球最大的Docker容器服务提供商。

2\. What——什么是容器
===============

  

容器是一种轻量级、可移植、自包含的软件打包技术，使应用程序可以在几乎任何地方以相同的方式运行。开发人员在自己笔记本上创建并测试好的容器，无须任何修改就能够在生产系统的虚拟机、物理服务器或公有云主机上运行。

容器使软件应用程序与操作系统脱钩，从而为用户提供了一个干净而最小的Linux环境，同时在一个或多个隔离的“容器”中运行其他所有内容。容器的目的是启动一组有限的应用程序或服务（通常称为微服务），并使它们在独立的沙盒环境中运行。

3\. Why——为什么需要容器
================

在云时代，开发者创建的应用必须要能很方便地在网络上传播，也就是说应用必须脱离底层物理硬件的限制；同时必须是“任何时间任何地点”可获取的。因此，开发者们需要一种新型的创建分布式应用程序的方式，快速分发和部署，而这正是Docker容器所能够提供的最大优势。

举个简单的例子，假设用户试图基于最常见的LAMP（Linux+Apache+MySQL+PHP）组合来构建网站。按照传统的做法，首先需要安装Apache、MySQL和PHP以及它们各自运行所依赖的环境；之后分别对它们进行配置（包括创建合适的用户、配置参数等）

更为可怕的是，一旦需要服务器迁移（例如从亚马逊云迁移到其他云），往往需要对每个应用都进行重新部署和调试。这些琐碎而无趣的“体力活”，极大地降低了用户的工作效率。究其根源，是**这些应用直接运行在底层操作系统上，无法保证同一份应用在不同的环境中行为一致**。

**使用容器技术将应用程序及其所有依赖关系打包到一个独立的运行环境中，形成一个可移植的容器。容器化使得应用程序在不同的环境中具备一致的运行行为，并且可以快速部署和扩展。**

![](/download/attachments/129174530/image2024-6-25_17-21-18.png?version=1&modificationDate=1719307278734&api=v2)

  

容器和虚拟机有什么区别？

传统来看，虚拟化既可以通过硬件模拟来实现，也可以通过操作系统软件来实现。而容器技术则更为优雅，它充分利用了操作系统本身已有的机制和特性，可以实现远超传统虚拟机的轻量级虚拟化。

  

![](/download/attachments/129174530/image2024-6-25_17-10-8.png?version=1&modificationDate=1719306608334&api=v2)

4\. How——容器是如何工作的
=================

  

1\. Docker架构Docker的核心组件包括：

● **Docker客户端：Client**

● **Docker服务器：Docker daemon**

● **Docker镜像：Image**

● **Registry：镜像仓库**

● **Docker容器：Container**

  

Docker架构如图

![](/download/attachments/129174530/image2024-6-25_16-39-33.png?version=1&modificationDate=1719304774067&api=v2)

  

Docker采用的是Client/Server架构。客户端向服务器发送请求，服务器负责构建、运行和分发容器。客户端和服务器可以运行在同一个Host上，客户端也可以通过socket或REST API与远程的服务器通信。

4.1. Docker客户端
--------------

`Docker Client`是和`Docker Daemon`建立通信的客户端

最常用的Docker客户端是docker命令。通过docker我们可以方便地在Host上构建和运行容器。

docker支持很多操作

![](/download/attachments/129174530/image2024-6-25_16-42-36.png?version=1&modificationDate=1719304956760&api=v2)

  

4.2. Docker服务器
--------------

Docker daemon是服务器组件，以Linux后台服务的方式运行。

Docker daemon运行在Docker host上，负责创建、运行、监控容器，构建、存储镜像。默认配置下，Docker daemon只能响应来自本地Host的客户端请求。如果要允许远程客户端请求，需要在配置文件中打开TCP监听

4.3. Docker镜像
-------------

**Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。** 镜像不包含任何动态数据，其内容在构建之后也不会被改变。

可将Docker镜像看成只读模板，通过它可以创建Docker容器。例如某个镜像可能包含一个Ubuntu操作系统、一个Apache HTTP Server以及用户开发的Web应用。

镜像有多种生成方法：（1）从无到有开始创建镜像；（2）下载并使用别人创建好的现成的镜像；（3）在现有镜像上创建新的镜像。

  

4.4. Docker容器
-------------

Docker容器就是Docker镜像的运行实例。用户可以通过命令行启动、停止、移动或删除容器。可以这么认为，对于应用软件，镜像是软件生命周期的构建和打包阶段，而容器则是启动和运行阶段。

  

4.5. Registry
-------------

Registry是存放Docker镜像的仓库，Registry分私有和公有两种。Docker Hub（[https://hub.docker.com/）](https://hub.docker.com/）是默认的Registry，由Docker公司维护，上面有数以万计的镜像，用户可以自由下载和使用。出于对速度或安全的考虑，用户也可以创建自己的私有Registry。后面我们会学习如何搭建私有Registry。docker)是默认的Registry，由Docker公司维护，上面有数以万计的镜像，用户可以自由下载和使用。出于对速度或安全的考虑，用户也可以创建自己的私有Registry。

docker pull命令可以从Registry下载镜像。

docker run命令则是先下载镜像（如果本地没有），然后再启动容器。

  

  

4.6. 容器的创建过程
------------

![](/download/attachments/129174530/image2024-6-25_17-33-56.png?version=1&modificationDate=1719308036535&api=v2)

![](/download/attachments/129174530/image2024-6-25_17-34-9.png?version=1&modificationDate=1719308050023&api=v2)![](/download/attachments/129174530/image2024-6-25_17-36-19.png?version=1&modificationDate=1719308179372&api=v2)

  

*   Docker容器是从镜像（Image）创建而来。镜像是一个只读的模板，包含了运行应用程序所需的文件系统和运行时配置。
    
*   在创建容器时，Docker会使用镜像作为基础，并在其上创建一个可写的容器层。这个容器层允许应用程序在容器内进行文件的读写操作。
    
*   容器创建过程中，Docker会根据镜像的定义设置容器的配置参数，例如环境变量、网络设置和卷挂载等。
    
*   一旦容器创建完成，Docker会在其内部启动应用程序，并为其分配资源。
    

  
  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)