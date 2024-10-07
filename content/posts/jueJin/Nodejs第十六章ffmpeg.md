---
author: "XiaoYu2002"
title: "Nodejs第十六章ffmpeg"
date: 2024-04-14
description: "Nodejs第十六章ffmpegFFmpeg是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合"
tags: ["前端","JavaScript","Node.js"]
ShowReadingTime: "阅读6分钟"
weight: 291
---
Nodejs 第十六章 ffmpeg
==================

FFmpeg 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。

### 应用场景

*   **视频转码和处理**：可以将视频从一种格式转换成另一种格式，调整视频的分辨率，或者改变其编码质量。
*   **音频转换**：可以提取视频文件中的音频流，或者将音频文件转换成其他格式。
*   **流媒体处理**：FFmpeg 支持从实时的音视频源捕捉数据，处理后实时输出到其他服务器或设备。
*   **视频分析**：可以获取视频的详细信息，包括帧速率、流格式、编解码详情等。

#### 安装

*   地址：[下载 FFmpeg (p2hp.com)](https://link.juejin.cn?target=https%3A%2F%2Fffmpeg.p2hp.com%2Fdownload.html "https://ffmpeg.p2hp.com/download.html")

![image-20240414061415979](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2c7ef13a9654773b5f61cc776b9a0e9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1812&h=1144&s=168541&e=png&b=272727)

*   通过点击能够打开下图中的网站，找到发布版本进行下载压缩包即可

![image-20240414061510188](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c866be0254714013bb694bc45710c65b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1632&h=1046&s=623794&e=png&b=d2d7c4)

*   下载下来解压后，内部结构是这样的

![image-20240414061806828](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c8ba3f97fc24ec6b1d20a3bf09fc465~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=688&h=330&s=20796&e=png&b=1c1b1b)

*   我们先**把这个文件夹移到我们放安装配置的地方**，一般的话，平时配置都在C盘的Program Files文件夹中，像我的Git，Go之类的配置都是放在这里

![image-20240414061955700](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c3061eecbc4145b41baf77bf30c4b3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=745&h=334&s=25101&e=png&b=1c1b1b)

*   下一步则是进行**配置环境变量**
    1.  其中用户变量是当前windows系统用户的
    2.  环境变量里有用户变量和环境变量，这个根据自己个人情况选择。像我windows电脑就一个用户，采用哪个就没什么区别。

![image-20240414062145762](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d97d0e485e114d78aeadf59fb8a2235c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=792&h=150&s=20258&e=png&b=383a3a)

*   我最终选择的是写在用户变量中，选择变量Path，然后将我们FFmpeg的bin目录加进去，这个bin目录就是启动命令所在的目录，在前面章节有讲解到，就不再额外多说

![image-20240414063013009](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/839e7aa857614fb89fe59497aa9a2d0b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1140&h=944&s=139729&e=png&b=f5f3f3)

*   这样就大功告成，将环境变量配置好了，接下来就需要进行验证配置是否成功
    1.  通过win+r输入cmd打开终端
    2.  输入ffmpeg -version，看是否有输出一堆配置信息，如果出现如下信息，则表示配置成功

![image-20240414063305470](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4a048583f854b149aa3572aed0207ea~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1233&h=716&s=536557&e=png&b=282727)

FFmpeg的常用命令参数配置
---------------

*   以表格和代码块的形式将常用的部分进行总结，方便大家进行阅读

参数

描述

`-i`

指定输入文件。用于定义输入源，可以是文件、设备、网络流等。

`-c`

指定编解码器。`-c:v` 指定视频编解码器，`-c:a` 指定音频编解码器。使用 `copy` 表示复制流而不重新编码。

`-b:v`

设置视频比特率。例如 `-b:v 1M` 表示视频比特率为1 Mbps。

`-b:a`

设置音频比特率。例如 `-b:a 128k` 表示音频比特率为128 kbps。

`-s`

设置视频的分辨率。格式为宽x高，例如 `-s 1280x720`。

`-r`

设置帧率。例如 `-r 30` 表示每秒30帧。

`-vn`

禁用视频。用于提取音频或者生成音频文件时不包含视频流。

`-an`

禁用音频。用于提取视频或者生成视频文件时不包含音频流。

`-ar`

设置音频采样率。例如 `-ar 44100` 表示采样率为44.1 kHz。

`-ac`

设置音频通道数。例如 `-ac 2` 表示双声道音频。

`-vf`

应用视频过滤器。用于裁剪、调整大小、**添加水印**等视频处理任务。

`-af`

应用音频过滤器。用于音频效果处理，如音量调整、回声添加等。

`-ss`

指定起始时间。用于截取视频或音频的起始点，例如 `-ss 00:00:10` 从10秒开始。

`-t`

指定持续时间。用于截取视频或音频的持续时间，例如 `-t 10` 表示持续10秒。

`-to`

指定结束时间。与 `-ss` 结合使用，定义视频或音频的结束时间点。

`-fps`

设置输出文件的帧率。通常与视频相关的过滤器一起使用。

bash

 代码解读

复制代码

`# 转换视频格式 ffmpeg -i input.mp4 output.avi # 将 MP4 转换为 AVI # 提取音频 ffmpeg -i video.mp4 -vn audio.mp3 # 从视频文件中提取音频，保存为 MP3 # 转换音频格式 ffmpeg -i input.wav output.mp3 # 将 WAV 音频转换为 MP3 # 调整视频分辨率 ffmpeg -i input.mp4 -s 1280x720 output.mp4 # 将视频分辨率调整为 1280x720 # 压缩视频 ffmpeg -i input.mp4 -b:v 1M -b:a 128k output.mp4 # 设置视频比特率为 1 Mbps，音频比特率为 128 kbps # 从视频中截取一段 ffmpeg -i input.mp4 -ss 00:00:10 -to 00:00:20 -c copy output.mp4 # 截取第 10 秒到第 20 秒的视频片段 # 添加水印 ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=W-w-10:H-h-10" output.mp4 # 将 logo.png 添加为视频的水印 # 提取视频中的帧 ffmpeg -i video.mp4 -vf "fps=1" output%d.png # 每秒提取一帧，保存为 PNG # 生成视频预览 ffmpeg -i input.mp4 -vf "select='isnan(prev_selected_t)+gte(t-prev_selected_t\,10)'" -vsync vfr -frame_pts true preview%d.jpg # 每 10 秒提取一帧生成预览图`

### 案例实操

*   将mp4视频转化为gif动图形式

js

 代码解读

复制代码

`const { execSync } = require("child_process") // 输入mp4版本，输出gif版本 // execSync('ffmpeg -i test.mp4 test.gif') // stdio: "inherit"可以直接在控制台看到执行命令（如 ffmpeg）的输出结果，同时任何错误信息也会直接显示。这在调试或者需要直接查看命令输出的场景非常有用 execSync('ffmpeg -i test.mp4 test.gif', { stdio: "inherit" })`

![image-20240414074029698](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f736ad8e26674813835fe276f65293b7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1298&h=790&s=320608&e=png&b=1e1e1e)

*   通过实际效果，我们可以看到转化是成功的

![image-20240414074505413](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca0d93c9a874ccfb2a93631bc5c8d22~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1764&h=1047&s=110444&e=jpg&b=252323)

*   当然功能其实不止这么一点的，根据上面的总结使用方式，可以看到转化形式是特别繁多的。这个需要看具体的需求
    1.  比如平时如果我们喜欢听音乐，但又只有MV类型的，或者是抖音短视频有些小姐姐唱歌很好听，我们想要拿到音频文件，就可以这样进行转化了
    2.  而我使用的这个案例其实更适合做动图表情包，当然这也是最常用的方式。
    3.  各种功能结合起来做成接口，加上前端页面可视化，就能做成一个工具类的网站了(使用门槛也会大大降低，毕竟直接用代码拼接没有任何提示那确实是使用起来较为难受，还容易出错)
    4.  在各种视频剪辑软件或者网站中，我们往往也是经常看见这些典型功能的
*   剩下的案例就不展示了，跟上面总结是重复的了