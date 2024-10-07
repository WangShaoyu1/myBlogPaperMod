---
author: "杰哥的技术杂货铺"
title: "Linux快速安装FFmpeg、ffprobe、ffplay以及在Linux上的使用"
date: 2024-03-24
description: "一、工具简介这些工具都是与多媒体处理和流媒体相关的开源工具，它们都属于FFmpeg多媒体框架。FFmpeg是一个用于处理多媒体内容（音频、视频、图像等）的命令行工具。它可以执行各种各样的操作"
tags: ["后端"]
ShowReadingTime: "阅读7分钟"
weight: 293
---
一、工具简介
======

这些工具都是与多媒体处理和流媒体相关的开源工具，它们都属于 FFmpeg 多媒体框架。

*   FFmpeg

是一个用于处理多媒体内容（音频、视频、图像等）的命令行工具。它可以执行各种各样的操作，包括转码、剪辑、合并、分离、编码、解码等。FFmpeg 是一个功能强大且广泛使用的工具，可以在多种平台上运行。

*   FFplay

是 FFmpeg 提供的一个简单的媒体播放器，它可以播放各种格式的音频和视频文件。FFplay 是基于 FFmpeg 库构建的，它提供了一个轻量级的命令行界面，可用于快速播放多媒体文件，适用于测试和简单的播放任务。

*   FFprobe

是一个用于分析多媒体文件的工具。它提供了详细的信息，包括多媒体文件的编解码器、格式、流信息等。FFprobe 可以帮助用户了解多媒体文件的特性，例如分辨率、帧率、比特率等，这对于诊断和处理多媒体文件非常有用。

*   FFserver

是一个流媒体服务器，可以用于实时转码和分发音频/视频流。它可以接受来自各种来源（如摄像头、音频接口等）的多媒体流，并将其转码为不同的格式和分辨率，然后通过网络分发给客户端。FFserver 可以用于构建自己的流媒体平台，例如音视频直播服务或视频点播服务。

二、CentOS7上安装FFmpeg
==================

在CentOS7 上安装FFmpeg 安装FFmpeg有两种方法，一种是使用源代码构建，一种是使用Nux Dextop存储库使用yum安装，源代码构建相对会麻烦一些麻烦

2.1 方法一：yum安装
-------------

*   1、启用EPEL存储库（如果已启动可以跳过此步骤）

arduino

 代码解读

复制代码

`yum install epel-release`

*   2、安装rpm软件包来启用Nux存储库

ruby

 代码解读

复制代码

`rpm -v --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm`

*   3、安装FFmpeg

 代码解读

复制代码

`yum install ffmpeg ffmpeg-devel`

*   4、测试是否安装成功

 代码解读

复制代码

`ffmpeg -version ffprobe -version`

2.2 方法二：源码安装
------------

*   **1、下载** 源码下载地址：[ffmpeg.org/download.ht…](https://link.juejin.cn?target=https%3A%2F%2Fffmpeg.org%2Fdownload.html%23releases "https://ffmpeg.org/download.html#releases")

> 选择最新版本的xz 压缩包

*   **2、源码解压** 上一步我们下载ffmpeg到我们的windows硬盘了

然后我们上传到我们的linux服务器，我选择了SFTP的方式进行上传

在usr/local下创建ffmpeg文件夹，并进入ffmpeg文件夹下

bash

 代码解读

复制代码

`cd /usr/local/ mkdir ffmpeg cd ffmpeg`

*   **3、解压安装包**

 代码解读

复制代码

`tar -xjvf ffmpeg-4.4.1.tar.xz`

*   **4、编译准备**

bash

 代码解读

复制代码

`yum install gcc              # 安装gcc编译器 yum install yasm         # 安装yasm编译器`

*   **5、安装**

bash

 代码解读

复制代码

`cd ffmpeg-4.4.1 ./configure --enable-shared --prefix=/usr/local/ffmpeg/ffmpeg-4.4.1 make make install` 

*   **6、将lib目录加载到系统库链接**

添加ffmpeg文件，并修改内容

bash

 代码解读

复制代码

`vim /etc/ld.so.conf.d/ffmpeg.conf`

写入内容：

bash

 代码解读

复制代码

`/usr/local/ffmpeg/ffmpeg-4.4.1/lib`

执行：

 代码解读

复制代码

`ldconfig`    

*   **7、检测是否安装成功** 在ffmpeg-4.4.1文件夹里执行：

bash

 代码解读

复制代码

`./ffmpeg -version`

*   **8、添加到全局变量**

修改配置文件：

bash

 代码解读

复制代码

`vim /etc/profile`

在最后一行添加：

ruby

 代码解读

复制代码

`export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/local/lib/pkgconfig:/usr/local/ffmpeg/ffmpeg-4.4.1/lib/pkgconfig export FFMPEG_HOME=/usr/local/ffmpeg/ffmpeg-4.4.1 export PATH=$PATH:$FFMPEG_HOME`

使配置生效：

bash

 代码解读

复制代码

`source /etc/profile`

三、ffprobe 在linux中的用法
====================

ffprobe 是 FFmpeg 套件中的一个工具，用于分析多媒体数据。它可以用来检查多媒体文件（如音频、视频和字幕文件）的格式、编解码器信息、元数据等。在 Linux 中，ffprobe 的基本用法是通过命令行界面进行的。

3.1 显示多媒体文件的基本信息
----------------

这个命令会输出一个 JSON 格式的字符串，包含输入文件（input.mp4）的格式和流信息。

css

 代码解读

复制代码

`ffprobe -v quiet -print_format json -show_format -show_streams input.mp4`

输出信息：

json

 代码解读

复制代码

`{     "streams": [         {             "index": 0,             "codec_name": "h264",             "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",             "profile": "High",             "codec_type": "video",             "codec_time_base": "1/50000",             "codec_tag_string": "avc1",             "codec_tag": "0x31637661",             "width": 1080,             "height": 1920,             "coded_width": 1088,             "coded_height": 1920,             "has_b_frames": 2,             "sample_aspect_ratio": "1:1",             "display_aspect_ratio": "9:16",             "pix_fmt": "yuv420p",             "level": 40,             "color_range": "tv",             "color_space": "bt709",             "chroma_location": "left",             "refs": 4,             "is_avc": "1",             "nal_length_size": "4",             "r_frame_rate": "25/1",             "avg_frame_rate": "25/1",             "time_base": "1/25000",             "start_pts": 0,             "start_time": "0.000000",             "duration_ts": 9471000,             "duration": "378.840000",             "bit_rate": "771385",             "bits_per_raw_sample": "8",             "nb_frames": "9471",             "disposition": {                 "default": 1,                 "dub": 0,                 "original": 0,                 "comment": 0,                 "lyrics": 0,                 "karaoke": 0,                 "forced": 0,                 "hearing_impaired": 0,                 "visual_impaired": 0,                 "clean_effects": 0,                 "attached_pic": 0             },             "tags": {                 "creation_time": "2024-03-04 09:08:06",                 "language": "und"             }         },         {             "index": 1,             "codec_name": "aac",             "codec_long_name": "AAC (Advanced Audio Coding)",             "profile": "LC",             "codec_type": "audio",             "codec_time_base": "1/48000",             "codec_tag_string": "mp4a",             "codec_tag": "0x6134706d",             "sample_fmt": "fltp",             "sample_rate": "48000",             "channels": 2,             "channel_layout": "stereo",             "bits_per_sample": 0,             "r_frame_rate": "0/0",             "avg_frame_rate": "0/0",             "time_base": "1/48000",             "start_pts": 0,             "start_time": "0.000000",             "duration_ts": 18188288,             "duration": "378.922667",             "bit_rate": "128102",             "max_bit_rate": "153976",             "nb_frames": "17762",             "disposition": {                 "default": 1,                 "dub": 0,                 "original": 0,                 "comment": 0,                 "lyrics": 0,                 "karaoke": 0,                 "forced": 0,                 "hearing_impaired": 0,                 "visual_impaired": 0,                 "clean_effects": 0,                 "attached_pic": 0             },             "tags": {                 "creation_time": "2024-03-04 09:07:59",                 "language": "und"             }         }     ],     "format": {         "filename": "input.mp4",         "nb_streams": 2,         "nb_programs": 0,         "format_name": "mov,mp4,m4a,3gp,3g2,mj2",         "format_long_name": "QuickTime / MOV",         "start_time": "0.000000",         "duration": "378.921667",         "size": "42792276",         "bit_rate": "903453",         "probe_score": 100,         "tags": {             "major_brand": "isom",             "minor_version": "1",             "compatible_brands": "isom",             "creation_time": "2024-03-04 09:09:41"         }     } }`

3.2 显示特定流的信息
------------

如果你只对音频流或视频流感兴趣，你可以使用 **\-select\_streams** 选项来指定。例如，显示视频流信息：

arduino

 代码解读

复制代码

`# ffprobe -v quiet -print_format json -show_streams -select_streams v input.mp4`

或者显示音频流信息：

css

 代码解读

复制代码

`ffprobe -v quiet -print_format json -show_streams -select_streams a input.mp3`

以下是返回信息：

json

 代码解读

复制代码

`{     "streams": [         {             "index": 0,             "codec_name": "h264",             "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",             "profile": "High",             "codec_type": "video",             "codec_time_base": "1/50000",             "codec_tag_string": "avc1",             "codec_tag": "0x31637661",             "width": 1080,             "height": 1920,             "coded_width": 1088,             "coded_height": 1920,             "has_b_frames": 2,             "sample_aspect_ratio": "1:1",             "display_aspect_ratio": "9:16",             "pix_fmt": "yuv420p",             "level": 40,             "color_range": "tv",             "color_space": "bt709",             "chroma_location": "left",             "refs": 4,             "is_avc": "1",             "nal_length_size": "4",             "r_frame_rate": "25/1",             "avg_frame_rate": "25/1",             "time_base": "1/25000",             "start_pts": 0,             "start_time": "0.000000",             "duration_ts": 9471000,             "duration": "378.840000",             "bit_rate": "771385",             "bits_per_raw_sample": "8",             "nb_frames": "9471",             "disposition": {                 "default": 1,                 "dub": 0,                 "original": 0,                 "comment": 0,                 "lyrics": 0,                 "karaoke": 0,                 "forced": 0,                 "hearing_impaired": 0,                 "visual_impaired": 0,                 "clean_effects": 0,                 "attached_pic": 0             },             "tags": {                 "creation_time": "2024-03-04 09:08:06",                 "language": "und"             }         }     ] }`

3.3 获取音视频的时长
------------

如果你只想获取视频的时长，可以使用 **\-show\_entries** 选项来指定 **format=duration**，并且设置输出格式为纯文本：

以下是使用ffprobe获取视频时长的基本命令：

lua

 代码解读

复制代码

`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4`

以下是使用ffprobe获取音频时长的基本命令：

lua

 代码解读

复制代码

`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp3`

输出：

 代码解读

复制代码

`378.921667`

在这个命令中：

*   \-v error：设置日志级别为error，以减少输出中的非必要信息。
*   \-show\_entries format=duration：指定要显示的条目为format下的duration，即视频的时长。
*   \-of default=noprint\_wrappers=1:nokey=1：设置输出格式为默认格式，并去除包装器和键名，只输出时长值。
*   input.mp4：替换为你的视频文件名。
*   执行这个命令后，ffprobe会输出视频的时长，以秒为单位。

> 注意：使用以上命令时，确保你已经安装了FFmpeg，并且ffprobe命令在你的系统路径中可用。如果你没有安装FFmpeg，你可以通过包管理器（如apt、yum或pacman）来安装它。