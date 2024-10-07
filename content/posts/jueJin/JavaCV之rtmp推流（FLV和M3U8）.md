---
author: "程序员白梦"
title: "JavaCV之rtmp推流（FLV和M3U8）"
date: 2023-12-11
description: "FFmpeg是一款开源的多媒体处理工具集，它包含了一系列用于处理音频、视频、字幕等多媒体数据的库和工具。JavaCV集成了FFmpeg库，使得Java开发者可以使用FFmpeg的功能。"
tags: ["Java"]
ShowReadingTime: "阅读6分钟"
weight: 277
---
JavaCV与FFmpeg
-------------

FFmpeg是一款开源的多媒体处理工具集，它包含了一系列用于处理音频、视频、字幕等多媒体数据的库和工具。  
JavaCV集成了FFmpeg库，使得Java开发者可以使用FFmpeg的功能，比如视频解码、编码、格式转换等。 除了FFmpeg，Javacv封装了以下库：

1.  **OpenCV：** JavaCV封装了OpenCV（Open Source Computer Vision Library），这是一个广泛用于计算机视觉应用的开源库。
2.  **FlyCapture：** 用于 Point Grey 系列相机的库。
3.  **ARToolKit：** 一个增强现实（Augmented Reality）库，用于跟踪相机图像中的标记。
4.  **JavaCpp：** 这是JavaCV的底层库，用于在Java中调用C++代码，是整个JavaCV项目的基础。
5.  **Libdc1394：** 用于相机和摄像机的库。
6.  **JavaCV Presets：** 提供了一系列预设，将原生的C/C++函数封装为Java接口，简化了在Java中调用这些功能的过程。

准备
--

### 1、引入maven包

xml

 代码解读

复制代码

`<dependency>  <groupId>org.bytedeco</groupId>  <artifactId>javacv-platform</artifactId>  <version>1.5.6</version>  </dependency>`

### 2、类与方法说明

`FFmpegFrameGrabber` 和 `FFmpegFrameRecorder` 是 JavaCV 中用于处理视频的两个关键类，分别用于抓取视频帧和录制视频帧，底层使用了 FFmpeg 库。  
我们可以使用 `FFmpegFrameGrabber` 打开视频文件，获取视频信息，然后不断地从视频中获取帧。  
`FFmpegFrameRecorder`则从输入视频中抓取帧，进行解码后，将每一帧写入输出视频文件。  
`FFmpegFrameGrabber` 与 `FFmpegFrameGrabber` 配合使用，可以实现从视频源中抓取帧并将帧写入视频文件的完整流程。

### 2、推流流程

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27ee9c623fa0437180df0b7b186c7fd7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=879&h=796&s=71036&e=png&b=fdfdfd)

### 3、Nginx搭建rtmp服务器

（1）下载带有rtmp模块的nginx（Gryphon） [nginx-win.ecsds.eu/download/](https://link.juejin.cn?target=http%3A%2F%2Fnginx-win.ecsds.eu%2Fdownload%2F "http://nginx-win.ecsds.eu/download/")  
（2）在nginx中的conf文件夹配置rtmp。nginx-win.conf增加如下代码：

ini

 代码解读

复制代码

`rtmp {     server {         listen 1935;         application flv-live{         live on;         record off;         allow play all;         }     } }`

添加后，cmd跳转到nginx目录，执行命令 `nginx.exe -c conf/nginx-win.conf` 即可

FLV直播和HLS直播
-----------

### FLV（Flash Video）直播：

1.  **传输协议：** FLV 使用 RTMP（Real-Time Messaging Protocol）作为传输协议。RTMP 是一种实时通信协议，通常用于传输音频、视频和数据。
2.  **实时性：** FLV 提供较低的延迟，通常在数秒到十几秒之间，适用于需要更快实时性的应用场景。
3.  **支持性：** FLV 需要 Flash 播放器来播放，而在现代浏览器和设备中，对 Flash 的支持逐渐减少。这导致了使用 FLV 的限制。

### HLS（HTTP Live Streaming）直播：

1.  **传输协议：** HLS 使用 HTTP 协议，这使得它更容易穿越防火墙和代理服务器。它通常基于标准的 HTTP 80/443 端口，因此更容易被防火墙允许。
2.  **实时性：** 相对于 FLV，HLS 通常有更高的延迟，通常在 10 到 30 秒之间。这使得它不太适合需要极低延迟的实时应用。
3.  **支持性：** HLS 更广泛地支持各种设备和浏览器，因为它基于标准的 HTTP 和 HTML5 规范，无需专门的插件或播放器。
4.  **自适应比特率：** HLS 提供了自适应比特率功能，可以根据用户的网络情况自动调整视频质量，提供更好的观看体验。

选择 FLV 还是 HLS 取决于你的具体需求。如果需要较低的延迟，并且可以接受使用 Flash 播放器的限制，那么 FLV 可能是一个合适的选择。如果需要更广泛的设备和浏览器支持，并且可以接受稍高的延迟，那么 HLS 可能更适合。在实际应用中，有时候也会结合两者，使用不同的协议来满足不同的需求。

实现Flv推流
-------

拿一个h264格式的mov视频来演示，先将mov转为flv并且进行推流。

java

 代码解读

复制代码

`import org.bytedeco.ffmpeg.global.avcodec; import org.bytedeco.ffmpeg.global.avutil; import org.bytedeco.javacv.*; public class RtmpFlv {     private static final String outputUrl = "rtmp://localhost:1935/flv-live/test";     private static final String inputUrl = "D:\视频.mov";     public static void main(String[] args) throws FrameGrabber.Exception, FrameRecorder.Exception, InterruptedException {         //设置FFmpeg日志级别         avutil.av_log_set_level(avutil.AV_LOG_INFO);         FFmpegLogCallback.set();         //以文件路径的方式传入视频，当然也支持以流的方式传入         FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputUrl);         //开始捕获视频流         grabber.start();         //用于将捕获到的视频流转换为输出URL的mp4格式。         FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputUrl, grabber.getImageWidth(), grabber.getImageHeight());         recorder.setFormat("flv");         recorder.setVideoBitrate(grabber.getVideoBitrate()); // 设置视频比特率         recorder.setFrameRate(grabber.getVideoFrameRate()); // 设置帧率         recorder.setGopSize((int) grabber.getVideoFrameRate()); // 设置关键帧间隔         // CRF 是一种用于控制视频/音频质量的参数，它允许在保持目标质量的同时动态地调整比特率。较低的CRF值表示更高的质量，但也可能导致较大的文件大小         recorder.setAudioOption("crf", "23");         Frame frame;         //设置音频编码为AAC         if (grabber.getAudioChannels() > 0) {             recorder.setAudioChannels(grabber.getAudioChannels());             recorder.setAudioBitrate(grabber.getAudioBitrate());             recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);         }         recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);         //将解码后的帧记录到输出文件中         //recorder.start通常用于处理已经解码成图像的视频数据         recorder.start();         while ((frame = grabber.grab()) != null) {             recorder.record(frame);         }         recorder.close();         grabber.close();     } }`

运行后，打开vlc软件，点击`媒体-》打开串流网络` ,输入`rtmp://localhost:1935/flv-live/test` 进行播放

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b74282ff95e54bc8a2bfc9c0626b336b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=675&h=514&s=32606&e=png&b=f7f7f7)

实现M3U8推流
--------

代码和上面的大同小异，将一个H264的mp4视频转为hls，利用http播放m3u8文件。

java

 代码解读

复制代码

`import org.bytedeco.ffmpeg.avformat.AVFormatContext; import org.bytedeco.ffmpeg.global.avcodec; import org.bytedeco.ffmpeg.global.avutil; import org.bytedeco.javacv.*; public class RtmpM3U8 {     private static final String outputUrl = "D:\nginx_rtmp\html\test.m3u8";     private static final String inputUrl = "D:\视频.mp4";     public static void main(String[] args) throws FrameGrabber.Exception, FrameRecorder.Exception {         //设置FFmpeg日志级别         avutil.av_log_set_level(avutil.AV_LOG_ERROR);         FFmpegLogCallback.set();         //以文件路径的方式传入视频，当然也支持以流的方式传入         FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputUrl);         //开始捕获视频流         grabber.start();         AVFormatContext avFormatContext = grabber.getFormatContext();         //获取视频时长         //long duration = avFormatContext.duration();         //检查文件是否媒体流(视频流、音频流)         if (avFormatContext.nb_streams() == 0) {             //表明没有媒体流             return;         }         //用于将捕获到的视频流转换为输出URL的mp4格式。         FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputUrl, grabber.getImageWidth(), grabber.getImageHeight(),grabber.getAudioChannels());         recorder.setFormat("hls");         recorder.setVideoBitrate(grabber.getVideoBitrate()); // 设置视频比特率         recorder.setFrameRate(grabber.getVideoFrameRate()); // 设置帧率         recorder.setGopSize((int) grabber.getVideoFrameRate()); // 设置关键帧间隔         // 设置HLS切片参数         //将每个切片时长设置为10秒         recorder.setOption("hls_time", "15");         //设置切片数大小         recorder.setOption("hls_list_size", "20");         //设置切片循环次数为50         recorder.setOption("hls_wrap", "20");         //每次切片完成后，都会删除之前的切片文件。如果不设置或设置为其他值，则不会删除之前的切片文件。         recorder.setOption("hls_flags", "delete_segments");         //在使用 H.264 编码时，通常要求输入的像素格式为 YUV420P。如果输入的像素格式不匹配，就可能导致 avcodec_send_frame() 错误         recorder.setPixelFormat(avutil.AV_PIX_FMT_YUV420P);         //CRF 是一种用于控制视频/音频质量的参数，它允许在保持目标质量的同时动态地调整比特率。较低的CRF值表示更高的质量，但也可能导致较大的文件大小         recorder.setAudioOption("crf", "23");         Frame frame;         //设置音频编码为AAC         if (grabber.getAudioChannels() > 0) {             recorder.setAudioChannels(grabber.getAudioChannels());             recorder.setAudioBitrate(grabber.getAudioBitrate());             recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);         }         recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);         //设置音频编码为AAC         if (grabber.getAudioChannels() > 0) {             recorder.setAudioChannels(grabber.getAudioChannels());             recorder.setAudioBitrate(grabber.getAudioBitrate());             recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);         }         //将解码后的帧记录到输出文件中         //recorder.start通常用于处理已经解码成图像的视频数据         recorder.start();         while ((frame = grabber.grab()) != null) {             recorder.record(frame);         }         recorder.close();         grabber.close();              } }`

开始推流后，会在D:\\nginx\_rtmp\\html\\生成m3u8和ts文件,我们只需要播放m3u8文件即可。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da53fc3a20994d37a5ffeac09b1f0adc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=175&h=259&s=4544&e=png&b=191919)

打开vlc软件，点击`媒体-》打开串流网络` ,输入`http://localhost:8080/test.m3u8` 进行播放

优化TODO
------

后继利用高性能网络框架netty进行直播多路复用，避免视频重复解码推流，详情关注最新文章！