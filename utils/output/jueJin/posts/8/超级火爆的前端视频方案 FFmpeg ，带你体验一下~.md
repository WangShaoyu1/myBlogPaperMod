---
author: "Sunshine_Lin"
title: "超级火爆的前端视频方案 FFmpeg ，带你体验一下~"
date: 2024-04-26
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ ffmpeg FFmpeg 是一个开源的、跨平台的多媒体框架，它可以用来录制、转换和流式传输音频和视"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:66,comments:0,collects:87,views:5920,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

![](/images/jueJin/b871032071ed4c1.png)

ffmpeg
------

FFmpeg 是一个开源的、跨平台的多媒体框架，它可以用来录制、转换和流式传输音频和视频。它包括了一系列的库和工具，用于处理多媒体内容，比如 libavcodec（一个编解码库），libavformat（一个音视频容器格式库），libavutil（一个实用库），以及 ffmpeg 命令行工具本身。

FFmpeg 被广泛用于各种应用中，包括视频转换、视频编辑、视频压缩、直播流处理等。它支持多种音视频编解码器和容器格式，因此能够处理几乎所有类型的音视频文件。由于其功能强大和灵活性，FFmpeg 成为了许多视频相关软件和服务的底层技术基础。

很多网页都是用 ffmpeg 来进行视频切片，比如一个视频很大，如果通过一个连接去请求整个视频的话，那势必会导致加载时间过长，严重阻碍了用户观感

所以很多视频网站都会通过视频切片的方式来优化用户观感，就是一部分一部分地去加载出来，这样有利于用户的体验

![](/images/jueJin/d99911ad96d4400.png)

安装 ffmpeg
---------

### 安装包下载

首先到 ffmpeg 的安装网页：[www.gyan.dev/ffmpeg/buil…](https://link.juejin.cn?target=https%3A%2F%2Fwww.gyan.dev%2Fffmpeg%2Fbuilds%2F "https://www.gyan.dev/ffmpeg/builds/")

![](/images/jueJin/59d8c376ab92410.png)

下载解压后将文件夹改名为 `ffmpeg`

![](/images/jueJin/8356d33932d94ee.png)

### 环境变量配置

环境变量配置是为了能在电脑上使用 `ffmpeg` 命令行

![](/images/jueJin/6d3fb3ea0d67430.png)

![](/images/jueJin/0c850d15ce9b485.png)

体验 ffmpeg
---------

先准备一个视频，比如我准备了一个视频，总共 300 多 M

![](/images/jueJin/4db8d8d826a940c.png)

### 视频切片

并在当前的目录下输入以下的命令

```bash
ffmpeg -i jhys.mkv
-c:v libx264
-c:a aac
-hls_time 60
-hls_segment_type mpegts
-hls_list_size 0
-f hls
-max_muxing_queue_size 1024
output.m3u8
```

接着 ffmpeg 会帮你将这个视频进行分片

![](/images/jueJin/ec8088505bf44a1.png)

直到切片步骤执行完毕，我们可以看到视频已经别切成几个片了

![](/images/jueJin/2eb5049d9fe741e.png)

在这个命令中：

*   **\-i input\_video.mp4** 指定了输入视频文件。
*   **\-c:v libx264 -c:a aac** 指定了视频和音频的编解码器。
*   **\-hls\_time 10** 指定了每个 M3U8 片段的时长，单位为秒。在这里，每个片段的时长设置为 10 秒。
*   **\-hls\_segment\_type mpegts** 指定了 M3U8 片段的类型为 MPEG-TS。
*   **\-hls\_list\_size 0** 设置 M3U8 文件中包含的最大片段数。这里设置为 0 表示没有限制。
*   **\-f hls** 指定了输出格式为 HLS。
*   **\-max\_muxing\_queue\_size 1024** 设置了最大复用队列大小，以确保输出不会超过指定大小。
*   最后输出的文件为 **output.m3u8**

### 视频播放

创建一个简单的前端项目

![](/images/jueJin/414dfaca57404ba.png)

![](/images/jueJin/cb4d7b48bde846d.png)

可以看到浏览器会加载所有的视频切片

![](/images/jueJin/46f107220e21461.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")