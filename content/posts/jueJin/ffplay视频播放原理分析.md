---
author: "百度Geek说"
title: "ffplay视频播放原理分析"
date: 2022-08-03
description: "本文从整体播放流程出发，介绍了ffplay播放器播放媒体文件的主要流程，不深陷于代码细节。同时，对FFmpeg的一些常用函数有了一些了解，对我们自己手写一个简单的播放器有很大的帮助。"
tags: ["音视频开发"]
ShowReadingTime: "阅读13分钟"
weight: 279
---
![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de624a1e74294c68b77cfc54e0bf289c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

作者 | 赵家祝

FFmpeg 框架由命令行工具和函数库组成， ffplay 是其中的一种命令行工具，提供了播放音视频文件的功能，不仅可以播放本地多媒体文件，还可以播放网络流媒体文件。本文从 ffplay 的整体播放流程出发，借鉴其设计思路，学习如何设计一款简易的播放器。

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09a2ed951db740ddad8e6ccb772b0857~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**一、播放器工作流程**
=============

在学习 ffplay 源码之前，为了方便理解，我们先宏观了解一下播放器在播放媒体文件时的工作流程。

*   **解协议**：媒体文件在网络上传输时，需要经过流媒体协议将媒体数据分段成若干个数据包，这样就可以满足用户一边下载一边观看的需求，而不需要等整个媒体文件都下载完成才能观看。常见的流媒体协议有 RTMP、HTTP、HLS、MPEG-DASH、MSS、HDS 等。由于流媒体协议中不仅仅包含媒体数据，还包含控制播放的信令数据。因此，解协议是移除协议中的信令数据，输出音视频封装格式数据。
    
*   **解封装**：封装格式也叫容器，就是将已经编码压缩好的视频流和音频流按照一定的格式放到一个文件中，常见的封装格式有 MP4、FLV、MPEG2-TS、AVI、MKV、MOV 等。解封装是将封装格式数据中的音频流压缩编码数据和视频流压缩编码数据分离，方便在解码阶段使用不同的解码器解码。
    
*   **解码**：压缩编码数据是在原始数据基础上采用不同的编码压缩得到的数据，而解码阶段就是编码的逆向操作。常见的视频压缩编码标准有 H.264/H.265 、MPEG-2 、AV1 、V8/9 等，音频压缩编码标准有 AAC 、MP3 等。解压后得到的视频图像数据是 YUV 或 RGB ，音频采样数据是 PCM 。
    
*   **音视频同步**：解码后的视频数据和音频数据是独立的，在送给显卡和声卡播放前，需要将视频和音频同步，避免播放进度不一致。
    

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f7f080ed5d24ff982eacd238e873f1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**二、main函数**
============

ffplay 的使用非常简单，以ffplay -i input.mp4 -loop 2为例，表示使用 ffplay 播放器循环播放 input.mp4 文件两遍。执行该命令时，对应的源码在 fftools/ffplay.c 中，程序入口函数是 main 函数 。

> 注：本文 ffplay 源码基于 ffmpeg 4.4。

**2.1 环境初始化**

初始化部分主要调用以下函数：

*   **init\_dynload**：调用SetDllDirectory("")删除 动态链接库（DLL）搜索路径中的当前工作目录，是 Windows 平台下的一种安全预防措施。
    
*   **av\_log\_set\_flag**：设置 log 打印的标记为AV\_LOG\_SKIP\_REPEATED，即跳过重复消息。
    
*   **parse\_loglevel**：解析 log 的级别，会匹配命令中的-loglevel字段。如果命令中添加-report，会将播放日志输出成文件。
    
*   **avdevice\_register\_all**：注册特殊设备的封装库。
    
*   **avformat\_network\_init**：初始化网络资源，可以从网络中拉流。
    
*   **parse\_options**：解析命令行参数，示例中的-i input.mp4和-loop 2就是通过这个函数解析的，支持的选项定义在options静态数组中。解析得到的文件名、文件格式分别保存在全局变量input\_filename和file\_iformat中。
    

**2.2 SDL初始化**

SDL的全称是 Simple DirectMedia Layer，是一个跨平台的多媒体开发库，支持 Linux、Windows、Mac OS等多个平台，实际上是对 DirectX、OpenGL、Xlib再封装，在不同操作系统上提供了相同的函数。ffplay 的播放显示是通过 SDL 实现的。

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb416d2027844e2f9edd7f825370821f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

main 函数中主要调用了以下三个 SDL 函数：

*   **SDL\_Init**：初始化 SDL 库，传入的参数 flags，默认支持视频、音频和定时器，如果命令中配置了-an则禁用音频，配置了-vn则禁用视频。
    
*   **SDL\_CreateWindow**：创建播放视频的窗口，该函数可以指定窗口的位置、大小，默认是 640\*480 大小。
    
*   **SDL\_CreateRenderer**：为指定的窗口创建渲染器上下文，对应的结构体是 SDL\_Render 。我们既可以使用渲染器创建纹理，也可以渲染视图。
    

**2.3 解析媒体流**

stream\_open函数是 ffplay 开始播放流程的起点，该函数传入两个参数，分别是文件名input\_filename和文件格式file\_iformat。下面是函数内部的处理流程：

**（1） 初始化VideoState**：VideoState 是 ffplay 中最大的结构体，所有的视频信息都定义在其中。初始化 VideoState 时，先定义 VideoState 结构体指针类型的局部变量is，分配堆内存。然后初始化结构体中的变量，例如视频流、音频流、字幕流的索引，并赋值函数入参 filename 和 iformat。

**（2）初始化FrameQueue**：FrameQueue 是解码后的 Frame 队列， Frame 是解码后的数据，例如视频解码后是 YUV 或 RGB 数据，音频解码后是 PCM 数据。初始化 FrameQueue 时，会对 VideoState 中的 pictq（视频帧队列）、subpq（字幕帧队列）、sampq（音频帧队列）依次调用frame\_queue\_init函数进行初始化。FrameQueue 内部是通过数组实现了一个先进先出的环形缓冲区，windex 是写指针，被解码线程使用；rindex 是读指针，被播放线程使用。使用环形缓冲区的好处是，缓冲区内的元素被移除后，其它元素不需要移动位置，适用于事先知道缓冲区最大容量的场景。

**（3）初始化PacketQueue**：PacketQueue 是解码前的 Packet 队列，用于保存解封装后的数据。初始化 PacketQueue 时，会对 VideoState 中的 videoq（视频包队列）、audio（音频包队列）、subtitleq（字幕包队列）依次调用packet\_queue\_init函数进行初始化。不同于 FrameQueue ， PacketQueue 采用链表的方式实现队列。由于解码前的包大小不可控，无法明确缓冲区的最大容量，如果使用环形缓冲区，容易触发缓冲区扩容，需要移动缓冲区内的数据。因此，使用链表实现队列更加合适。

**（4）初始化Clock**：Clock 是时钟，在音视频同步阶段，有三种同步方法：视频同步到音频，音频同步到视频，以及音频和视频同步到外部时钟。初始化 Clock 时，会对 VideoState 中的 vidclk（视频时钟）、audclk（音频时钟）、extclk（外部时钟）依次调用init\_clock函数进行初始化。

**（5）限制音量范围**：先限制音量范围在 0~100 之间，然后再根据 SDL 的音量范围作进一步限制。

**（6）设置音视频同步方式**：ffplay 默认采用AV\_SYNC\_AUDIO\_MASTER，即视频同步到音频。

**（7）创建读线程**：调用SDL\_CreateThread创建读线程，同时设置了线程创建成功的回调read\_thread函数以及接收参数is（ stream\_open 函数最开始创建的 VideoState 指针类型的局部变量）。如果线程创建失败，则调用stream\_close做销毁逻辑。

**（8）返回值**：将局部变量is作为函数返回值返回，用于处理下面的各种 SDL 事件。

**2.4 SDL事件处理**

event\_loop函数内部是一个 for 循环，使用 SDL 监听用户的键盘按键事件、鼠标点击事件、窗口事件、退出事件等。

**三、read\_thread函数**
====================

read\_thread函数的作用是从磁盘或者网络中获取流，包括音频流、视频流和字幕流，然后根据可用性创建对应流的解码线程。因此read\_thread所在的线程实际上起到了解协议/解封装的作用。核心处理流程可以分为以下步骤：

**3.1** **创建AVFormatContext**

AVFormatContext 是封装上下文，描述了媒体文件或媒体流的构成和基本信息。avformat\_alloc\_context函数用于分配内存创建 AVFormatContext 对象ic。

拿到 AVFormatContext 对象后，在调用avformat\_open\_input函数打开文件前，需要设置中断回调函数，用于检查是否应该中断 IO 操作。

ini

 代码解读

复制代码

`‍ ic->interrupt_callback.callback = decode_interrupt_cb; ic->interrupt_callback.opaque = is;`

decode\_interrupt\_cb内部返回了一个 VideoState 的 abort\_request 变量，该变量在调用stream\_close函数关闭流时会被置为1。

**3.2 打开输入文件**

在准备好前面的一些赋值操作后，就可以开始根据 filename 打开文件了。avformat\_open\_input函数用于打开一个文件，并对文件进行解析。如果文件是一个网络链接，则发起网络请求，在网络数据返回后解析音频流、视频流相关的数据。

**3.3** **搜索流信息**

搜索流信息使用avformat\_find\_stream\_info函数，该从媒体文件中读取若干个包，然后从其中搜索流相关的信息，最后将搜索到的流信息放到ic->streams指针数组中，数组的大小为ic->nb\_streams。

由于在实际播放过程中，用户可以指定是否禁用音频流、视频流、字幕流。因此在解码要处理的流之前，会判断对应的流是否处于不可用状态，如果是可用状态则调用av\_find\_best\_stream函数查找对应流的索引，并保存在st\_index数组中。

**3.4 设置窗口大小**

如果找到了视频流的索引，则需要渲染视频画面。由于窗体的大小一般使用默认值 640\*480 ，这个值和视频帧真正的大小可能是不相等的。为了正确显示承载视频画面的窗体，需要计算视频帧的宽高比。调用av\_guess\_sample\_aspect\_ration函数猜测帧样本的宽高比，调用set\_default\_window\_size函数重新设置显示窗口的大小和宽高比。

**3.5 创建解码线程**

根据st\_index判断音频流、视频流、字幕流的索引是否找到，如果找到了就依次调用stream\_component\_open创建对应流的解码线程。

**3.6 解封装处理**

接下来是一个 for(;;) 循环：

（1）响应中断停止、暂停/继续、Seek操作；

（2）判断 PacketQueue 队列是否满了，如果满了就休眠10ms，继续循环；

（3）调用av\_read\_frame从码流中读取若干个音频帧或一个视频帧；

（4）从输入文件中读取一个 AVPacket ，判断当前 AVPacket 是否在播放时间范围内，如果是则调用packet\_queue\_put函数，根据类型将其放在音频/视频/字幕的 PacketQueue 中。

**四、stream\_component\_open函数**
===============================

3.5小节讲到，stream\_component\_open函数负责创建不同流的解码线程。那么它是如何创建解码线程的呢？

**4.1** **创建AVCodecContext**

AVCodecContext是编解码器上下文，保存音视频编解码相关的信息。使用avcodec\_alloc\_context3函数分配空间 ，使用avcodec\_free\_context函数释放空间。

**4.2 查找解码器**

根据解码器的id ，调用avcodec\_find\_decoder函数，查找对应的解码器。与之类似的一个函数是avcodec\_find\_encoder，用于查找 FFmpeg 的编码器。两个函数返回的结构体都是 AVCodec 。

如果指定了解码器名称，则需要调用avcodec\_find\_decoder\_by\_name函数查找解码器。

不管是哪种方式查找解码器，如果没有找到解码器，都会抛异常退出流程。

**4.3 解码器初始化**

找到解码器后，需要打开解码器，并对解码器初始化，对应的函数是avcodec\_open2，该函数也支持编码器的初始化。

**4.4 创建解码线程**

判断解码类型，创建不同的解码线程。

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4206a108095942c79e74f5af42f0d604~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

csharp

 代码解读

复制代码

`switch (avctx->codec_type) { case AVMEDIA_TYPE_AUDIO:    // 音频     ...     if ((ret = decoder_init(&is->auddec, avctx, &is->audioq, is->continue_read_thread)) < 0)         goto fail;     ...     if ((ret = decoder_start(&is->auddec, audio_thread, "audio_decoder", is)) < 0)         goto out;     ... case AVMEDIA_TYPE_VIDEO:    // 视频     ...     if ((ret = decoder_init(&is->viddec, avctx, &is->videoq, is->continue_read_thread)) < 0)         goto fail;     if ((ret = decoder_start(&is->viddec, video_thread, "video_decoder", is)) < 0)         goto out;     ... case AVMEDIA_TYPE_SUBTITLE: // 字幕     ...     if ((ret = decoder_init(&is->subdec, avctx, &is->subtitleq, is->continue_read_thread)) < 0)         goto fail;     if ((ret = decoder_start(&is->subdec, subtitle_thread, "subtitle_decoder", is)) < 0)         goto out;     ... }`

线程创建在decoder\_start函数中，依然使用 SDL 创建线程的方式，调用SDL\_CreateThread函数。

**五、video\_thread函数**
=====================

视频解码线程从视频的 PacketQueue 中不断读取 AVPacket ，解码完成后将 AVFrame 放入视频 FrameQueue 。音频的解码实现和视频类似，这里仅介绍视频的解码过程。

**5.1** **创建AVFrame**

AVFrame 描述解码后的原始音频数据或视频数据，通过av\_frame\_alloc函数分配内存，通过av\_frame\_free函数释放内存。

**5.2 视频解码**

开启 for(;;) 循环，不断调用get\_video\_frame函数解码一个视频帧。该函数主要调用了decoder\_decode\_frame函数解码，decoder\_decode\_frame函数对音频、视频、字幕都进行了处理，主要依靠 FFmpeg 的avcodec\_receive\_frame函数获取解码器解码输出的数据。

拿到解码后的视频帧后，会根据音视频同步的方式和命令行的-framedrop选项，判断是否需要丢弃失去同步的视频帧。

*   命令行带-framedrop选项，无论哪种音视频同步机制，都会丢弃失去同步的视频帧。
    
*   命令行带-noframedrop选项，无论哪种音视频同步机制，都不会丢弃失去同步的视频帧。
    
*   命令行不带-framedrop或-noframedrop选项，若音视频同步机制为同步到视频，则不丢弃失去同步的视频帧，否则会丢弃失去同步的视频帧。
    

**5.3** **放入FrameQueue**

调用queue\_picture函数，将 AVFrame 放入 FrameQueue 。该函数内部调用了frame\_queue\_push函数，采用了环形缓冲区的处理方式，对写指针windex累加。

scss

 代码解读

复制代码

`static void frame_queue_push(FrameQueue *f) {     if (++f->windex == f->max_size)         f->windex = 0;     SDL_LockMutex(f->mutex);     f->size++;     SDL_CondSignal(f->cond);     SDL_UnlockMutex(f->mutex); }`

**六、音视频同步**
===========

ffplay 默认采用将视频同步到音频的方式，分以下三种情况：

*   如果视频和音频进度一致，不需要同步；
    
*   如果视频落后音频，则丢弃当前帧直接播放下一帧，人眼感觉跳帧了；
    
*   如果视频超前音频，则重复显示上一帧，等待音频，人眼感觉视频画面停止了，但是有声音在播放；
    

ffplay 视频同步到音频的逻辑在视频播放函数video\_refresh中实现。该函数的调用链是：main()->event\_loop()->refresh\_loop\_wait\_event()->video\_refresh。

**6.1 判断播放完成**

调用frame\_queue\_nb\_remaing函数计算剩余没有显示的帧数是否等于0，如果是，则不需要走剩下的步骤。计算过程比较简单，用 FrameQueue 的 size - rindex\_shown ， size 是 FrameQueue 的大小， rindex\_shown 表示 rindex 指向的节点是否已经显示，如果已经显示则为1，否则为0。

**6.2 **播放序列匹配****

分别调用frame\_queue\_peek\_last和frame\_queue\_peek函数从 FrameQueue 中获取上一帧和当前帧，上一帧是上次已经显示的帧，当前帧是当前待显示的帧。

（1）比较当前帧和当前 PacketQueue 的播放序列serial是否相等：

*   如果不等，重试视频播放的逻辑；
    
*   如果相等，则进入（2）流程判断；
    

> 注：`serial`是用来区分是不是连续的数据，如果发生了 seek ，会开始一个新的播放序列，

（2）比较上一帧和当前帧的播放序列serial是否相等：

*   如果不相等，则将frame\_timer更新为当前时间；
    
*   如果相等，不处理并进入下一流程
    

**6.3 判断是否重复上一帧**

（1）将上一帧lastvp和当前帧vp传入vp\_duration函数，通过vp->pts - lastvp->pts计算上一帧的播放时长。

> 注：`pts`全称是 Presentation Time Stamp ，显示时间戳，表示解码后得到的帧的显示时间。

（2）在compute\_target\_delay函数中，调用get\_clock函数获取视频时钟，调用get\_master\_clock函数获取同步时钟，计算两个时钟的差值，根据差值计算需要 delay 的时间。

（3）如果当前帧播放时刻（is->frame\_timer + delay）大于当前时刻（time），表示当前帧的播放时间还没有到，相当于当前视频超前音频了，则需要将上一帧再播放一遍。

ini

 代码解读

复制代码

`last_duration = vp_duration(is, lastvp, vp); delay = compute_target_delay(last_duration, is); time= av_gettime_relative()/1000000.0; if (time < is->frame_timer + delay) {     *remaining_time = FFMIN(is->frame_timer + delay - time, *remaining_time);     goto display; }`

**6.4 判断是否丢弃未播放的帧**

如果当前队列中的帧数大于1，则需要考虑丢帧，只有一帧的时候不考虑丢帧。

（1）调用frame\_queue\_peek\_next函数获取下一帧（下一个待显示的帧），根据当前帧和下一帧计算当前帧的播放时长，计算过程和6.3相同。

（2）满足以下条件时，开始丢帧：

*   当前播放模式不是步进模式；
    
*   丢帧策略生效：framedrop>0，或者当前音视频同步策略不是音频到视频。
    
*   当前帧vp还没有来得及播放，但是下一帧的播放时刻（is->frame\_timer + duration）已经小于当前系统时刻（time）了。
    

（3）丢帧时，将is->frame\_drops\_late++，并调用frame\_queue\_next函数将上一帧删除，更新 FrameQueue 的读指针 rindex 和 size 。

scss

 代码解读

复制代码

`if (frame_queue_nb_remaining(&is->pictq) > 1) {    Frame *nextvp = frame_queue_peek_next(&is->pictq);    duration = vp_duration(is, vp, nextvp);    if(!is->step && (framedrop>0 || (framedrop && get_master_sync_type(is) != AV_SYNC_VIDEO_MASTER)) && time > is->frame_timer + duration){        is->frame_drops_late++;        frame_queue_next(&is->pictq);        goto retry;    }}`

**七、渲染**
========

ffplay 最终的图像渲染是由 SDL 完成的，在 video\_display 中调用了 SDL\_RenderPresent(render) 函数，其中 render 参数是最开始在 main 函数中创建的。在渲染之前，需要将解码得到的视频帧数据转换为 SDL 支持的图像格式。转换过程在 upload\_texture 函数中实现，细节不在此处分析。

音频类似，如果解码得到的音频不能被 SDL 支持，需要对音频进行重采样，将音频帧格式转换为 SDL 支持的格式。

**八、小结**
========

本文从整体播放流程出发，介绍了 ffplay 播放器播放媒体文件的主要流程，不深陷于代码细节。同时，对 FFmpeg 的一些常用函数有了一些了解，对我们自己手写一个简单的播放器有很大的帮助。

\----------  END  ----------

**推荐阅读【技术加油站】系列**：

[百度工程师眼中的云原生可观测性追踪技术](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247524031%26idx%3D1%26sn%3D2ff36cc5d33744c43c62e741cc6bba98%26chksm%3Dc03eaec3f74927d5bec5caf7aaa544132202733a4d6c4d88d495b90f36d3cd10f5ba0c86e31c%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247524031&idx=1&sn=2ff36cc5d33744c43c62e741cc6bba98&chksm=c03eaec3f74927d5bec5caf7aaa544132202733a4d6c4d88d495b90f36d3cd10f5ba0c86e31c&scene=21#wechat_redirect")

[使用百度开发者工具 4.0 搭建专属的小程序 IDE](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247521904%26idx%3D1%26sn%3Dfcd93d9238ee639ca29e760b5643c6b5%26chksm%3Dc03ea60cf7492f1adf16ebe83b06c64b0d833e73310ff83483c2cd5f4ae1866533ea71311c14%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247521904&idx=1&sn=fcd93d9238ee639ca29e760b5643c6b5&chksm=c03ea60cf7492f1adf16ebe83b06c64b0d833e73310ff83483c2cd5f4ae1866533ea71311c14&scene=21#wechat_redirect")

[百度工程师教你玩转设计模式（观察者模式）](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247521125%26idx%3D1%26sn%3D0bb5fbbd10935d021b33603772485706%26chksm%3Dc03ea319f7492a0f9fc78f73f0dba33607a23adf9893017bb27681e411ecac8550218093658d%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247521125&idx=1&sn=0bb5fbbd10935d021b33603772485706&chksm=c03ea319f7492a0f9fc78f73f0dba33607a23adf9893017bb27681e411ecac8550218093658d&scene=21#wechat_redirect")

[揭秘百度智能测试在测试自动执行领域实践](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247516487%26idx%3D1%26sn%3Dbda8cb37e2e7a03960862a6811b38533%26chksm%3Dc03eb13bf749382df10ff4b105db41a5c56f73d70fa3aaf101f2394e8d393c5d9eec188f4b67%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247516487&idx=1&sn=bda8cb37e2e7a03960862a6811b38533&chksm=c03eb13bf749382df10ff4b105db41a5c56f73d70fa3aaf101f2394e8d393c5d9eec188f4b67&scene=21#wechat_redirect")

[H.265编码原理入门](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247515103%26idx%3D1%26sn%3D13e26ea1837b17959fd2ce2dd70df4ab%26chksm%3Dc03e8ba3f74902b58894600a96bae451e063b9c6694651ac0f9339be00cb182a1cf4d0b3c561%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247515103&idx=1&sn=13e26ea1837b17959fd2ce2dd70df4ab&chksm=c03e8ba3f74902b58894600a96bae451e063b9c6694651ac0f9339be00cb182a1cf4d0b3c561&scene=21#wechat_redirect")

[小程序启动性能优化实践](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg5MjU0NTI5OQ%3D%3D%26mid%3D2247514864%26idx%3D1%26sn%3D23d48664f70a8b42fce5a5fa9412c606%26chksm%3Dc03e8a8cf749039a28d464e347777383250364567cfb04382da488a382a75436d7234922cdcf%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=Mzg5MjU0NTI5OQ==&mid=2247514864&idx=1&sn=23d48664f70a8b42fce5a5fa9412c606&chksm=c03e8a8cf749039a28d464e347777383250364567cfb04382da488a382a75436d7234922cdcf&scene=21#wechat_redirect")

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d31d17b96d74ce59d64e0c53a45ef93~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)