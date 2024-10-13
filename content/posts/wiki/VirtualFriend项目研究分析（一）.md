---
author: "王宇"
title: "VirtualFriend项目研究分析（一）"
date: 十一月23,2023
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 195
---
  这是一个很有意思的项目，GitHub地址为：[VirtualFriend](https://github.com/yakami129/VirtualWife)，其也可以看作是一个基于大模型的AI原生应用，融入了角色VRM模型、声音ASR/TTS、

1\. 从项目结构上分析
============

1.1. Docker相关入口
---------------

入口文件为："start.bat"，代码如下：

**installer/windows/start.bat**

[?](#)

1

2

`@``echo` `off`

`docker-compose -f ..\docker-compose.yaml up -d`

**分析为**：这段代码的作用是在后台启动由 docker-compose.yaml 文件定义的 Docker 容器。通过禁用命令回显，它可以在执行过程中隐藏命令的输出。

*   **@echo off**：这是一个特殊的命令，用于禁止在批处理脚本执行时显示命令本身。它会关闭命令的回显功能，使脚本在运行时不会显示每个命令的输出。
*   **docker-compose -f ..\\docker-compose.yaml up -d**：这是一个 docker-compose 命令，用于启动 Docker 容器。
*   具体来说：

1.  **docker-compose** 是一个命令行工具，用于管理和运行基于 Docker 的多容器应用程序。
2.  **\-f ..\\docker-compose.yaml** 指定了要使用的 Docker Compose 配置文件的路径。在这里，它指定了位于上级目录中的 docker-compose.yaml 文件。
3.  **up** 是 docker-compose 命令的一个子命令，用于构建、创建和启动容器。
4.  **\-d** 参数表示以“后台模式”（detached mode）运行容器，即在后台运行容器而不阻塞命令提示符。

往下分析：

**docker-compose.yaml**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

`version:` `'3'`

`services:`

   `chatbot:`

       `container_name:` `chatbot`

       `image:` `okapi0129/virtualwife-chatbot``:``$``{``CHATBOT_TAG``:``-latest``}`

       `extra_hosts:`

        `-` `"host.docker.internal:host-gateway"`

       `ports:`

        `-` `8000``:``8000`

       `environment:`

         `-` `TZ=$``{``TIMEZONE``}`

       `env_file:`

         `-` `"${ENV_FILE:-.env}"`

       `networks:`

         `-` `virtualwife`

   `chatvrm:`

      `container_name:` `chatvrm`

      `image:` `okapi0129/virtualwife-chatvrm``:``$``{``CHATVRM_TAG``:``-latest``}`

      `environment:`

        `-` `TZ=$``{``TIMEZONE``}` 

      `env_file:`

        `-` `"${ENV_FILE:-.env}"`

      `networks:`

        `-` `virtualwife`

   `gateway:`

     `container_name:` `gateway`

     `image:` `okapi0129/virtualwife-gateway``:``$``{``GATEWAY_TAG``:``-latest``}`

     `restart:` `always`

     `ports:`

       `-` `$``{``NGINX_HTTP_PORT``:``-80``}``:``80`

       `-` `$``{``NGINX_HTTPS_PORT``:``-443``}``:``443`

     `environment:`

       `-` `TZ=$``{``TIMEZONE``}`

     `env_file:`

       `-` `"${ENV_FILE:-.env}"`

     `networks:`

       `-` `virtualwife`

`networks:`

  `virtualwife:`

    `driver:` `bridge`

分析为：创建了三个服务services:chatbot、chatvrm、gateway，每一个服务都有自己的配置。注意，image字段表示的是从公网[https://hub.docker.com/](https://hub.docker.com/)拉取这三个镜像。重点放在domain-chatbot、domain-chatvrm、infrastructure-gateway这3个文件夹中的内容，镜像中的内容，是依据这几个文件夹（外加infrastructure-packaging文件夹）的内容来的。

1.2. domain-chatbot
-------------------

是一个python语言写的后端程序，主要内容有如下：

1.3. domain-chatvrm
-------------------

是一个基于next.js文件写的前端程序

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)