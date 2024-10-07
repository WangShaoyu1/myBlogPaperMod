---
author: "LiDaTou"
title: "关于FFmpeg使用过程中一些问题解决的分享"
date: 2022-06-15
description: "关于FFmpeg使用过程中一些问题解决的分享近期项目开发中使用到了FFmpeg，由于也是第一次使用，所以在这将其中遇到的一些问题及解决办法，在这里进行一个汇总。"
tags: ["FFmpeg"]
ShowReadingTime: "阅读7分钟"
weight: 273
---
关于FFmpeg使用过程中一些问题解决的分享
----------------------

近期项目开发中使用到了**FFmpeg**，由于也是第一次使用，所以在这将其中遇到的一些问题及解决办法，在这里进行一个汇总。 关于FFmpeg的使用方法并不多做解释，自行寻找使用方法：

FFmpeg官网：[ffmpeg.org/](https://link.juejin.cn?target=https%3A%2F%2Fffmpeg.org%2F "https://ffmpeg.org/")

（1）如果通过命令行处理视频则需要从官网下载对应的ffmpeg，并配置环境变量或通过当前目录执行。 （2）若想在项目中使用，只要引用对应jar包既可。但需要注意一点，项目中引用jar在windows和mac环境中可直接运行，但在linux中需要编译对应的so文件。（因为这个问题折腾了一天多）

javascript

 代码解读

复制代码

``2022-06-01 09:35:47 [http-nio-8090-exec-4] ERROR o.a.c.c.C.[.[.[.[dispatcherServlet] - Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Handler dispatch failed; nested exception is java.lang.UnsatisfiedLinkError: no jniavutil in java.library.path] with root cause java.lang.UnsatisfiedLinkError: /root/.javacpp/cache/ffmpeg-5.0-1.5.7-linux-x86_64.jar/org/bytedeco/ffmpeg/linux-x86_64/libjniavutil.so: /lib64/libc.so.6: version `GLIBC_2.14' not found (required by /root/.javacpp/cache/ffmpeg-5.0-1.5.7-linux-x86_64.jar/org/bytedeco/ffmpeg/linux-x86_64/libjniavutil.so)``

下面是解决问题时参考的链接：  
[blog.csdn.net/maoxiang/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fmaoxiang%2Farticle%2Fdetails%2F38388387 "https://blog.csdn.net/maoxiang/article/details/38388387")  
[blog.csdn.net/weixin\_3569…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_35691526%2Farticle%2Fdetails%2F114977856 "https://blog.csdn.net/weixin_35691526/article/details/114977856")  
[stackoverflow.com/questions/6…](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F61866772%2Ffailed-to-execute-goal-org-bytedecojavacpp1-5-3build-javacpp-cppbuild-compil "https://stackoverflow.com/questions/61866772/failed-to-execute-goal-org-bytedecojavacpp1-5-3build-javacpp-cppbuild-compil")

**非常重要：编译so文件时建议配置科学上网，有些依赖下载非常慢，并且会超时**

#### （1）单张图片生成视频

arduino

 代码解读

复制代码

`ffmpeg -loop 1 -r 1 -t 5 -i xxxxx.jpg -c:v h264 -pix_fmt yuv420p out.mp4`

**\-loop 1** 循环。因为就一张图片  
**\-r 1** 帧率。1 是每秒一帧  
**\-t 5** 时长。秒为单位。生成5秒长的视频  
**\-c:v h264** 视频输出的编码格式。 h264是mp4格式常用的编码  
**\-pix\_fmt yux420p** 像素格式。支持的类型可以查看ffmpeg帮助查询

**上面的命令是生成一个5秒长的mp4格式视频文件out.mp4。** 其他参数可根据需要添加。

#### （2）给生成的视频添加空音轨

这个具体看自己的需求。以上面的命令为例子，生成的out.mp4视频是只有视频轨道，没有音频轨道。如果你将视频拖入类似PR这种视频处理软件中，就能看出来。  
那么这种情况，想用ffmpeg从里面提取音频或以此视频进行其他操作可能会有异常。例如用**concat**命令操作两个视频的时候，可能出现下面的问题：

arduino

 代码解读

复制代码

`Stream specifier ':1' in filtergraph description`

这种情况就是因为一个没有音轨的视频拼接一个有音轨的视频的时候出现了这个问题。那么就需要在生成视频文件的时候插入一个空音轨，命令如下：

css

 代码解读

复制代码

`ffmpeg -i xxxx.mp4 -f lavfi -t 5 -i anullsrc=cl=stereo:r=48000 -c:v libx264 -pix_fmt yuv420p out.mp4`

**\-f lavfi** format一个格式，具体并没有弄清楚，可以自己行了解  
**\-t 5** 时长，如果不指定将一直生成视频，如果仅仅是插入一个空音轨，可以比视频短或跟视频长度相等  
**\-i anullsrc=cl=stereo:r=48000** 最主要的就是这个，anullsrc音频空链接，意思是没有输入文件cl是通道布局，r是采样率，具体可查看官网文档

**上面的命令是将xxxx.mp4视频转换成out.mp4并插入一个空音轨**

#### （3）两个视频拼接处的过渡

**xfade**命令实现的过渡效果比较多，也可自定义过渡效果。需要用到一个参数：**\-filter\_complex**

css

 代码解读

复制代码

`ffmpeg -i xxx.mp4 -i yyy.mp4 -filter_complex "xfade=transition=fade:offset=7:duration=0.5" out.mp4`

**transition** 效果，具体可以去查xfade命令  
**offset** 偏移量，可以理解成从第几秒开始，但是好像不能超过第一个视频的长度  
**duration** 持续时间

但是这个命令要求比较苛刻，要求**两个输入必须是恒定的帧速率，并且具有相同的分辨率、像素格式、帧速率和时基**

最厉害的就是这个时基（**timebase**）。对不起，我没弄明白。会出现下面这个问题：

lua

 代码解读

复制代码

`First input link main timebase (1/12800) do not match the corresponding second input link xfade timebase (1/25000)`

解决办法：

css

 代码解读

复制代码

`ffmpeg -i xxx.mp4 -i yyy.mp4 -filter_complex "[0]settb=AVTB[v0];[1]settb=AVTB[v1];[v0][v1]xfade=transition=fade:offset=7:duration=0.5" out.mp4`

**\[0\]/\[1\]** 是输入流的下标，可以这么理解  
**\[v0\]/\[v1\]** 是处理后的流标识  
**settb=AVTB** 设置视频的时基, AVTB是默认时基

就是将两个不同时基的视频设置一个相同的时基，然后再进行xfade操作。

#### （4）concat操作

less

 代码解读

复制代码

`ffmpeg -i xxx.mp4 -i yyy.mp4 -filter_complex "[0:0][0:1][1:0][1:1]concat=n=2:v=1:a=1[v][a]" -map [v] -map[a] out.mp4`

参考链接：[blog.csdn.net/chaijunkun/…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fchaijunkun%2Farticle%2Fdetails%2F116237809 "http://blog.csdn.net/chaijunkun/article/details/116237809")

**n=2** 2个输入流  
**v=1** 每个流中存在一个视频流  
**a=1** 每个流中存在一个音频流

**concat**操作的参数可能比较懵，需要知道视频流中存在的视频通道和音频通道有几个，假如两个视频中，A视频存在2个视频流和一个音频流，B视频中存在1个视频流一个音频流，那么处理时会出现问题。不知有没有办法避免，本人还未找到合适的方法。

**注意：本人使用concat合并视频的结果视频文件中会产生两个视频流一个音频流。** 如果使用这个文件在进行合并时需注意。

在合并时产生的日志中有详细信息，可自行查找：

yaml

 代码解读

复制代码

`Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '/xxx/aaa.mp4':   Metadata:     major_brand     : isom     minor_version   : 512     compatible_brands: isomiso2mp41     encoder         : Lavf59.16.100   Duration: 00:00:03.48, start: 0.000000, bitrate: 748 kb/s   Stream #0:0[0x1](und): Video: mpeg4 (Simple Profile) (mp4v / 0x7634706D), yuv420p, 720x1280 [SAR 1:1 DAR 9:16], 885 kb/s, 30 fps, 30 tbr, 15360 tbn (default)     Metadata:       handler_name    : VideoHandler       vendor_id       : [0][0][0][0]   Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 2 kb/s (default)     Metadata:       handler_name    : SoundHandler       vendor_id       : [0][0][0][0] Input #1, mov,mp4,m4a,3gp,3g2,mj2, from '/xxx/bbb.mp4':   Metadata:     major_brand     : isom     minor_version   : 512     compatible_brands: isomiso2avc1mp41     encoder         : Lavf59.16.100   Duration: 00:00:20.00, start: 0.000000, bitrate: 399 kb/s   Stream #1:0[0x1](und): Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p(progressive), 720x1280, 392 kb/s, 25 fps, 25 tbr, 12800 tbn (default)     Metadata:       handler_name    : VideoHandler       vendor_id       : [0][0][0][0]   Stream #1:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, mono, fltp, 1 kb/s (default)     Metadata:       handler_name    : SoundHandler       vendor_id       : [0][0][0][0]`

#### （4）drawtext字幕

css

 代码解读

复制代码

`./ffmpeg -i test_1.mp4 -filter_complex "drawtext=fontfile=FZYDZHJW.TTF: text='这是一行居中的文字第一行':x=(w-tw)/2:y=((h-text_h)/2)+(text_h-(th/4)): fontsize=55: fontcolor=green" test_drawtext.mp4`

**drawtext** 过滤器名称  
**fontfile** 指定字体文件（font可指定本机存在的字体名称，不用文件）  
**text** 要显示的文本（textfile可指定一个文本文件）  
**x/y** 在视频中的显示位置

其他参数可查询drawtext，其中有些参数可以在过滤器中使用，但不可进行设置值。比如**text\_h、main\_h**等。drawtext绘制的文本未输入文本格式，不会自动换行，需自行调整。可接受"\\n"、"\\t"等。如果需要每行都居中显示，则需要拼接多个drawtext过滤器使用。

#### （5）crop裁剪

ini

 代码解读

复制代码

`crop=w:h:x:y`

**w** 裁剪的宽  
**h** 裁剪的高  
**x** 裁剪的起始x坐标值  
**y** 裁剪的起始y坐标值

如果想单独裁剪图片并没有什么问题，但是想裁剪完成后再**overlay**到某个视频或图片上，可能会出现色差，这个问题是因为输入的图片像素类型不对。图片输入的格式一般是yuvj444p，可从日志中查看。

#### （6）100 buffers queued in out\_0\_2, something may be wrong警告

此警告有点无关痛痒，可以输出最终视频。但在我使用中，出现这个警告会导致两个视频过渡中的效果加不上，找了资料，在命令中加上**fifo**。

css

 代码解读

复制代码

`ffmpeg -i aaa.mp4 -i bbb.mp4 -filter_complex "[0]fifo,settb=AVTB[v0];[1]fifo,settb=AVTB[v1];[v0][v1]xfade=transition=fade:offset=4:duration=0.5" out.mp4`

官网对**fifo** 或 **afifo** 没有过多解释，只有三句话：

vbnet

 代码解读

复制代码

`Buffer input images and send them when they are requested. It is mainly useful when auto-inserted by the libavfilter framework. It does not take parameters.`

以上，就是在使用过程中出现的问题，望可以对各位有所帮助。