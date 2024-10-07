---
author: "AI浩"
title: "Windows安装ffmpeg，使用ffmpeg从视频中的抽取图像"
date: 2021-09-28
description: "FFmpeg是领先的多媒体框架，能够解码、编码、转码、混合、解密、流媒体、过滤和播放人类和机器创造的几乎所有东西。它支持最晦涩的古老格式，直到最尖端的格式。无论它们是由某个标准委员会、社区还是公司设计的。它还具有高度的便携性。FFmpeg可以在Linux、MacOSX、..."
tags: ["人工智能"]
ShowReadingTime: "阅读2分钟"
weight: 281
---
**软件简介**

FFmpeg 是领先的多媒体框架，能够解码、编码、转码、混合、解密、流媒体、过滤和播放人类和机器创造的几乎所有东西。它支持最晦涩的古老格式，直到最尖端的格式。无论它们是由某个标准委员会、社区还是公司设计的。它还具有高度的便携性。

FFmpeg 可以在 Linux、Mac OS X、Microsoft Windows、BSDs、Solaris 等各种构建环境、机器架构和配置下编译、运行，并通过测试基础设施 FATE。

它包含了 libavcodec、libavutil、libavformat、libavfilter、libavdevice、libswscale 和 libswresample，可以被应用程序使用。还有 ffmpeg、ffplay 和 ffprobe，可以被终端用户用于转码和播放。

**安装**
------

首先登陆官网

[www.ffmpeg.org/download.ht…](https://link.juejin.cn?target=http%3A%2F%2Fwww.ffmpeg.org%2Fdownload.html "http://www.ffmpeg.org/download.html")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea6d4f711f5241309d99f0943b8defe0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

选择中间的Window版本，然后看到有两个，想讲讲第一个键接。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f22ee7a3e6814f10acc00c0cd1b721cf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

选择第一个链接，跳转到下载页面如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44b7e3d555324d829478be347cd07c49~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

在页面中，选择release-full.7z下载。

再说说第二个链接。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d96531b8770e4c9ead7d5963cd0a2ae6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

点击后会跳转到github上面。如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1df2ef5d23474a549be97137d4d22655~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

选择win64的gpl版本。然后下载下来

**添加系统环境变量**

C:\\ffmpeg-4.4-full\_build\\ffmpeg-4.4-full\_build\\bin，将该bin目录添加到系统环境变量中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0a98344260479bb0005b4d2f062ef5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

在PowerShell中输入：ffmpeg –version

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16126b5bf7ea4dfc85e936eadd8535d6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

出现上面的信息，则配置成功。

抽取图像常用的命令
---------

arduino

 代码解读

复制代码

`ffmpeg -i 1.mp4 -r 1 image-%3d.jpg`

*   \-i 视频文件
*   \-r 1，每秒导出的图片帧数
*   image-%3d.jpeg 输出图片，3d表示图片编号3位数，%03d可以补零

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a8a19d0e0954bdb9851c388e4ab7be8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

arduino

 代码解读

复制代码

`ffmpeg -i 1.mp4 -r 30 -t 4 image-%3d.jpg`

*   \-t，表示取t秒时间的帧

arduino

 代码解读

复制代码

`ffmpeg -i 1.mp4 -r 30 -ss 00:00:20 image-%3d.jpg`

\-ss，表示截取帧初始时间

arduino

 代码解读

复制代码

`ffmpeg -i test.mp4 -r 30 -ss 00:00:20 -vframes 10 image-%3d.jpg`

\-vframes，表示截取多少帧

生成更清晰无压缩的图片方式：

ini

 代码解读

复制代码

`ffmpeg -i 1.mp4 -f image2 -vf fps=1/5 -qscale:v 2 img%04d.jpg`

\-i: 视频路径

\-f: 图片格式

fps=1/5: 每5s取1帧

img%04d.jpg: 生成的图片命名格式