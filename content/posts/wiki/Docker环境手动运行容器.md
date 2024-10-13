---
author: "王宇"
title: "Docker环境手动运行容器"
date: 六月27,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 280
---
1\. 编译和推送到云端
============

首先拉取代码，进入项目目录下运行脚本 image\_build\_and\_push.sh

[?](#)

1

2

3

`# 进入目录/home/Onanouser/ftt-em-edge/modules/AvatarModule/`

`# 参数说明： 参数1为Tag中 0.0.$VERSION-arm64v8 中的$VERSION，生成镜像为acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.1-arm64v8`

`.``/image_build_and_push``.sh 1`

如下为脚本

[?](#)

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

`#!/bin/bash`

`# 检查是否提供了版本号参数`

`if` `[ -z` `"$1"` `];` `then`

    `echo` `"Usage: $0 <version>"`

    `exit` `1`

`fi`

`# 设置变量`

`DOCKERFILE_PATH=``"/home/Onanouser/ftt-em-edge/modules/AvatarModule/Dockerfile.arm64v8"`

`VERSION=$1`

`TAG=``"0.0.$VERSION-arm64v8"`

`IMAGE_NAME=``"acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:$TAG"`

`BUILD_CONTEXT=``"/home/Onanouser/ftt-em-edge/modules/AvatarModule"`

`# 构建Docker镜像`

`echo` `"Building Docker image : $IMAGE_NAME"`

`sudo` `docker build --``rm` `-f` `"$DOCKERFILE_PATH"` `-t` `"$IMAGE_NAME"` `"$BUILD_CONTEXT"`

`if` `[ $? -``ne` `0 ];` `then`

    `echo` `"Docker build failed. Exiting."`

    `exit` `1`

`fi`

`# 推送Docker镜像`

`echo` `"Pushing Docker image : $IMAGE_NAME"`

`sudo` `docker push` `"$IMAGE_NAME"`

`if` `[ $? -``ne` `0 ];` `then`

    `echo` `"Docker push failed. Exiting."`

    `exit` `1`

`fi`

`echo` `"Docker image built and pushed successfully : $IMAGE_NAME"`

  

2\. 本地测试运行
==========

运行脚本rundocker.sh

[?](#)

1

2

3

`# 进入目录/home/Onanouser/ftt-em-edge/modules/AvatarModule/`

`# 参数说明： 参数1为Tag中 0.0.$VERSION-arm64v8 中的$VERSION，运行的镜像为acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.1-arm64v8`

`.``/rundocker``.sh 1`

如下的脚本内容

[?](#)

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

`#!/bin/bash`

`# 设置要使用的版本号`

`VERSION=``"$1"`

`# 检查参数是否为空`

`if` `[ -z` `"$VERSION"` `];` `then`

    `echo` `"Usage: $0 <version>"`

    `exit` `1`

`fi`

`export` `DISPLAY=:0`

`xhost +`

`# 执行 Docker run 命令`

`sudo` `docker run --gpus all \`

    `--device` `/dev/snd``:``/dev/snd` `\`

    `--device` `/dev/video0``:``/dev/video0` `\`

    `-``v` `/run/user/1000/pulse``:``/run/user/1000/pulse` `\`

    `-``v` `/tmp/``.X11-unix:``/tmp/``.X11-unix \`

    `-``v` `/usr/share/alsa/alsa``.conf:``/usr/share/alsa/alsa``.conf \`

    `-``v` `/etc/asound``.conf:``/etc/asound``.conf \`

    `-``v` `~/.config``/pulse/cookie``:``/root/``.config``/pulse/cookie` `\`

    `-e PULSE_SERVER=unix:``/run/user/1000/pulse/native` `\`

    `-e DISPLAY=$DISPLAY \`

    `--privileged -it \`

    `acrembeddedfttdeveastus2001.azurecr.io``/avatarmodule``:0.0.$VERSION-arm64v8`

对于运行脚本做出解释

`docker run` 命令的详细解释：

[?](#)

`sudo` `docker run --gpus all \`

   `--device` `/dev/snd``:``/dev/snd` `\`

   `--device` `/dev/video0``:``/dev/video0` `\`

   `-``v` `/run/user/1000/pulse``:``/run/user/1000/pulse` `\`

   `-``v` `/tmp/``.X11-unix:``/tmp/``.X11-unix \`

   `-``v` `/usr/share/alsa/alsa``.conf:``/usr/share/alsa/alsa``.conf \`

   `-``v` `/etc/asound``.conf:``/etc/asound``.conf \`

   `-``v` `~/.config``/pulse/cookie``:``/root/``.config``/pulse/cookie` `\`

   `-e PULSE_SERVER=unix:``/run/user/1000/pulse/native` `\`

   `-e DISPLAY=$DISPLAY \`

   `--privileged -it \`

   `acrembeddedfttdeveastus2001.azurecr.io``/avatarmodule``:0.0.$VERSION-arm64v8`

1.  `sudo docker run --gpus all`：以超级用户身份运行Docker容器，并使用主机的所有GPU。
    
2.  `--device /dev/snd:/dev/snd`：将主机的音频设备 `/dev/snd` 映射到容器内的相同路径，使容器能够访问主机的音频设备。
    
3.  `--device /dev/video0:/dev/video0`：将主机的第一个视频设备 `/dev/video0` 映射到容器内的相同路径，使容器能够访问主机的摄像头设备。
    
4.  `-v /run/user/1000/pulse:/run/user/1000/pulse`：将主机的 `/run/user/1000/pulse` 目录挂载到容器内的相同路径，以使容器能够与主机的PulseAudio服务器通信。
    
5.  `-v /tmp/.X11-unix:/tmp/.X11-unix`：将主机的X11 Unix套接字挂载到容器内，以使容器能够使用主机的显示服务器，支持图形界面应用的显示。
    
6.  `-v /usr/share/alsa/alsa.conf:/usr/share/alsa/alsa.conf`：将主机的ALSA配置文件挂载到容器内的相同路径，以使容器能够使用主机的ALSA配置。
    
7.  `-v /etc/asound.conf:/etc/asound.conf`：将主机的 `asound.conf` 文件挂载到容器内的相同路径，以使容器能够使用主机的音频配置。
    
8.  `-v ~/.config/pulse/cookie:/root/.config/pulse/cookie`：将主机用户的PulseAudio cookie文件挂载到容器内的相同路径，使容器内的PulseAudio客户端能够验证并连接到主机的PulseAudio服务器。
    
9.  `-e PULSE_SERVER=unix:/run/user/1000/pulse/native`：设置环境变量 `PULSE_SERVER`，指定PulseAudio服务器的地址，以使容器内的应用程序能够连接到主机的PulseAudio服务器。
    
10.  `-e DISPLAY=$DISPLAY`：设置环境变量 `DISPLAY`，以使容器内的应用程序能够使用主机的显示服务器。
    
11.  `--privileged`：以特权模式运行容器，允许容器访问主机的所有设备。这个选项赋予容器更多的权限，类似于主机上的root权限。
    
12.  `-it`：`-i` 保持标准输入打开，`-t` 分配一个伪终端，这两个选项通常用于交互式终端。
    
13.  `acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.$VERSION-arm64v8`：这是要运行的Docker镜像的名称和标签。在这里，镜像存储在Azure容器注册表中，标签为 `0.0.$VERSION-arm64v8`，其中 `$VERSION` 是一个版本变量。
    

在Azure IoT Edge部署时， -v 参数添加到容器创建选项的Binds中，-e参数添加到环境设置中；

请确保使用之前提到的脚本命令启动容器，以确保音频设备和PulseAudio配置正确传递;

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)