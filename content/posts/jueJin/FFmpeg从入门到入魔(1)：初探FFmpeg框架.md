---
author: "无名之辈FTER"
title: "FFmpeg从入门到入魔(1)：初探FFmpeg框架"
date: 2021-11-18
description: "FFmpeg（Fastforwordmpeg，音视频转换器）是一个开源免费跨平台的视频和音频流方案，它提供了录制/音视频编解码、转换以及流"
tags: ["音视频开发"]
ShowReadingTime: "阅读10分钟"
weight: 308
---
#### 1\. FFmpeg介绍与裁剪

###### 1.1 FFmpeg简介

 [FFmpeg](https://link.juejin.cn?target=http%3A%2F%2Fffmpeg.org%2F "http://ffmpeg.org/")（Fast forword mpeg，音视频转换器）是一个开源免费跨平台的视频和音频流方案，它提供了录制/音视频编解码、转换以及流化音视频的完整解决方案。[ffmpeg4.0.2](https://link.juejin.cn?target=https%3A%2F%2Fffmpeg.org%2Freleases%2Fffmpeg-4.0.2.tar.bz2 "https://ffmpeg.org/releases/ffmpeg-4.0.2.tar.bz2")源码目录结构如下： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ebe7b4d7952498e8ad3f37012787854~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 目录说明：  
[FFmpeg](https://link.juejin.cn?target=http%3A%2F%2Fwww.ffmpeg.org%2Fdoxygen%2F2.5%2Findex.html "http://www.ffmpeg.org/doxygen/2.5/index.html")  
|—compat     该目录存放的是兼容文件，以便兼容早期版本  
|—doc      说明文档  
|—ffbuild  
|—`libavcodec`   音视频编解码核心库  
|—`libavdevice`  各种设备的输入输出，比如Video4Linux2, VfW, DShow以及 ALSA  
|—`libavfilter`  滤镜特效处理  
|—`libavformat`  I/O操作和封装格式(muxer/demuxer)处理  
|—`libavswresample` 音频重采样，格式转换和混音  
|—      (1) 重采样：改变音频的采样率，比如从44100HZ降低到8000HZ  
|—      (2)重新矩阵化：改变音频通道数量，比如从立体声道(stereo )变为单身道(mono)  
|—      (3)格式转换：改变音频采样大小，比如将每个样本大小从16bits降低到8bits  
|—`libavutil`   工具库，比如算数运算、字符操作等  
|—`libpostproc`  后期效果处理，如图像的去块效应  
|—`libswscale`   视频像素处理，包括缩放图像尺寸、色彩映射转换、像素颜色空间转换等  
|—presets  
|—tests      测试实例  
|—configure    配置文件，编译ffmpeg时用到

###### 1.2 命令行工具

 FFmpeg框架中还提供了几个用于执行命令行完成音视频数据处理工具，包括ffplay、ffprobe、ffserver，具体解释如下：

*   [ffplay](https://link.juejin.cn?target=http%3A%2F%2Fffmpeg.org%2Fffplay.html "http://ffmpeg.org/ffplay.html") Fast forword play，用ffmpeg实现的播放器
    
*   [ffserver](https://link.juejin.cn?target=http%3A%2F%2Fffmpeg.org%2Fffserver.html "http://ffmpeg.org/ffserver.html") Fast forword server，用ffmpeg实现的rtsp服务器
    
*   [ffprobe](https://link.juejin.cn?target=http%3A%2F%2Fffmpeg.org%2Fffprobe.html "http://ffmpeg.org/ffprobe.html") Fat forword probe，用来输入分析输入流
    

##### 2. FFmpeg架构分析

 在1.1小节中，我们对FFmpeg整体架构进行了简单介绍，阐述了框架中各个模块的功能。本节将在此基础上，重点阐述在利用FFmpeg进行音视频开发中牵涉到的重要步骤，数据结构体以及相关函数。

###### 2.1 FFmpeg处理要点

 总体来说，FFmpeg框架主要的作用在于对多媒体数据进行解协议、解封装、解码以及转码等操作，为了对FFmpeg在视音频中的应用有个更直观理解，下面给出解析rtsp网络流的流程图，该图演示了从打开rtsp流，到最终提取出解码数据或转码的大概过程，如下所示： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e2724c6cf714b4f91d97b22b7c2fe5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 术语解释：

*   `muxer`：视音频复用器(封装器)，即将视频文件、音频文件和字幕文件(如果有的话)合并为某一个视频格式，比如讲a.avi、a.mp3、a.srt合并为mkv格式的视频文件；
*   `demuxer`：视音频分离器(解封装器)，即muxer的逆过程；
*   `transcode`：转码，即将视音频数据从某一种格式转换成另一种格式；
*   [`RTP包`](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fandrexpert%2Farticle%2Fdetails%2F76919535 "https://blog.csdn.net/andrexpert/article/details/76919535")：Real-time Transport Protocol，实时传输协议，是一种基于UDP的网络传输协议，它介于应用层和传输层之间，负责对流媒体数据进行封包并实现媒体流的实时传输；
*   `ES流`：Elementary Streams，即原始流，也称视/音频裸流，是直接从编码器输出的数据流，可为视频数据流(如H.264、MJPEG等)或音频数据流(如AAC等)；
*   `PES流`：Packetized Elementary Streams，分组ES流，PES流是ES流经过PES打包器将ES分组、打包、加入包头信息等处理后形成的数据流，是用来传递ES的一种数据结构。
*   `解协议`：取出网络数据流无关报文信息，以获取真正的视音频数据，常见的协议有rtsp、rtmp、http和mms等；
*   `解封装`：即demuxer，封装格式可以为.mp4/.avi/.flv/.mkv等；
*   `解码`：将编码数据还原成原始内容，比如将H.264解码为YUV、AAC解码为PCM等；

###### 2.1 FFmpeg重要的结构体

 FFmpeg中有很多比较重要的结构体，比如与输入输出(I/O)有关的结构体AVIOContext、URLContext、URLProtocol ，与封装格式有关的结构体AVFormatContext、AVInputFormat、AVOutputFormat，与编解码有关的结构体AVCodec、AVCodecContext，以及与音视频数据有关的结构体AVStream、AVPacket、AVFrame等等。刚开始接触FFmpeg时，个人感觉一时间要理解区分这些结构体还是有点困难的，好在这些结构体当中有个“老大哥”-`AVFormatContext`，AVFormatContext可以说是贯穿整个FFmpeg开发，"犹如神一般的存在"。下面我们就在分析AVFormatContext结构体的基础上，阐述上述结构体的作用与区别。

###### AVFormatContext

 AVFormatContext结构体描述了一个多媒体文件或流的构成和基本信息，是FFmpeg中最为基本的一个结构体，也是其他所有结构的根。其中，成员变量`iformat和oformat`为指向对应的demuxing(解封装)和muxing(封装)指针，变量类型分别为AVInputFormat、AVOutputFormat；`pb`为指向控制底层数据读写的指针，变量类型为AVIOContext；`nb_streams`表示多媒体文件或多媒体流中数据流的个数；`streams`为指向所有流存储的二级指针，变量类型AVStream；`video_codec和audio_codec`分别表示视频和音频编解码器，变量类型为AVCodec等等。AVFormatContext结构体(位于libavformat/avformat.h中)部分源码如下：

c

 代码解读

复制代码

`typedef struct AVFormatContext {     const AVClass *av_class; 	// 输入容器格式 	// 只在调用avformat_open_input()时被设置，且仅限Demuxing     struct AVInputFormat *iformat; 	// 输出容器格式 	// 只在调用avformat_alloc_output_context2()函数时被设置，且仅限封装(Muxing)     struct AVOutputFormat *oformat;     /**      * Format private data. This is an AVOptions-enabled struct      * if and only if iformat/oformat.priv_class is not NULL.      *      * - muxing: set by avformat_write_header()      * - demuxing: set by avformat_open_input()      */     void *priv_data; 	// 输/入输出(I/O)的缓存 	// 说明：解封装(demuxing)：值由avformat_open_input()设置 	// 		 封装(muxing)：  值由avio_open2设置，需在avformat_write_header()之前     AVIOContext *pb; 	// stream info     int ctx_flags; 	// AVFormatContext.streams中数据流的个数 	// 说明：值由avformat_new_stream()设置     unsigned int nb_streams; 	// 文件中所有流stream列表。创建一个新stream，调用avformat_new_stream()函数实现 	// 当调用avformat_free_context()后，streams所占资源被释放 	// 说明：解封装(demuxing)：当调用avformat_open_input()时，streams值被填充 	//   	 封装(muxing)：streams在调用avformat_write_header()之前被用户创建 	//      AVStream **streams; 	// 输入或输出文件名，如输入：rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov 	// 说明：demuxing：当调用avformat_open_input()后被设置 	//		 muxing: 当调用avformat_alloc_output_context2()后被设置，且需要调用avformat_write_header()之前     char filename[1024]; 	// component的第一帧位置，仅限Demuxing时由libavformat设置     int64_t start_time; 	// stream的时长，仅限Demuxing时由libavformat设置     int64_t duration; 	// 总比特率(bit/s)，包括音频、音频     int64_t bit_rate; 	... 	// 视频编解码器ID 	// 说明：Demuxing时由用户设置     enum AVCodecID video_codec_id; 	// 音频编解码器ID 	// 说明：Demuxing时由用户设置     enum AVCodecID audio_codec_id; 	// 字幕(subtitle)编解码器ID 	// 说明：Demuxing时由用户设置     enum AVCodecID subtitle_codec_id; 	 	... 	// 文件元数据，即Metadata 	// 说明：demuxing：当调用avformat_open_input时被设置 	//		 muxing：在调用avformat_write_header()之前被设置 	// 注：当调用avformat_free_context()时metadata的资源被libavformat释放     AVDictionary *metadata; 	// 实时流启动的真实时间     int64_t start_time_realtime; 	 	... 	// 视频编解码器，Demuxing时由用户指定     AVCodec *video_codec; 	// 音频编解码器，Demuxing时由用户指定     AVCodec *audio_codec; 	// 字幕编解码器，Demuxing时由用户指定     AVCodec *subtitle_codec;     // 数据编解码器，Demuxing时由用户指定     AVCodec *data_codec; 	... 	 	// 数据编解码器ID     enum AVCodecID data_codec_id; 	 	... 	 } AVFormatContext`

###### 1\. 复用(muxing)/解复用(demuxing)

(1) AVInputFormat结构体

 AVInputFormat为`解复用/解封装(demuxing)器`对象，它包含了解复用器的相关信息和操作函数，比如name成员变量为指定封装格式的名称，如"aac"、"mov"等；read\_header成员函数为读取封装头部数据；read\_packet成员函数为读取一个AVPacket等等。AVInputFormat结构体(位于libavformat/avformat.h中)部分源码如下：

c

 代码解读

复制代码

`typedef struct AVInputFormat {     // 封装格式名称，如"mp4"、"mov"等     const char *name; 	// 封装格式别称     const char *long_name;     int flags;     const char *extensions;     const struct AVCodecTag * const *codec_tag;     const AVClass *priv_class;      const char *mime_type; 	//      struct AVInputFormat *next;     int raw_codec_id;     // 具体format对应Context的size，如MovContext     int priv_data_size;     int (*read_probe)(AVProbeData *);      // 读取format header，同时初始化AVFormatContext结构      // 若成功，返回0     int (*read_header)(struct AVFormatContext *);     // 读取packet大小数据，并将其存放到pkt指向的内存中     // 若成功，返回0；若失败，返回负数且pkt不会被分配内存     int (*read_packet)(struct AVFormatContext *, AVPacket *pkt);      // 关闭流，但不释放AVFormatContext和AVStreams所占内存      int (*read_close)(struct AVFormatContext *);     /**      * seek相对于流索引中帧的时间戳      * @param stream_index 流index，不能为-1      * @param flags 用于方向，如果么有精确的匹配      * @return >= 0 操作成功      */     int (*read_seek)(struct AVFormatContext *,                      int stream_index, int64_t timestamp, int flags);     /**      * 获取流[stream_index]的下一个时间戳      * @return 时间戳或AV_NOPTS_VALUE(当发生错误时)      */     int64_t (*read_timestamp)(struct AVFormatContext *s, int stream_index,                               int64_t *pos, int64_t pos_limit);      // Start/resume playing -只适用于RTSP     int (*read_play)(struct AVFormatContext *);     // Pause playing - 只适用于RTSP     int (*read_pause)(struct AVFormatContext *); 	// 获取设备列表，详解avdevice_list_devices()      int (*get_device_list)(struct AVFormatContext *s, struct AVDeviceInfoList *device_list);      // 初始化设备功能子模块，详见avdevice_capabilities_create()函数     int (*create_device_capabilities)(struct AVFormatContext *s, struct AVDeviceCapabilitiesQuery *caps);      // 释放设备功能子模块，详见avdevice_capabilities_free()函数     int (*free_device_capabilities)(struct AVFormatContext *s, struct AVDeviceCapabilitiesQuery *caps); } AVInputFormat;`

 通过调用av\_register\_all()函数，FFmpeg所有的解复用器保存在以first\_iformat为头部指针、last\_iformat为尾部指针的链表中。这里以AAC(音频压缩编码格式)解复用器为例，来分析AVInputFormat结构体的初始化流程，相关源码详见libavformat/Aacdec.c:

c

 代码解读

复制代码

`AVInputFormat ff_aac_demuxer = {     .name         = "aac",  // 指定解复用器名称     .long_name    = NULL_IF_CONFIG_SMALL("raw ADTS AAC (Advanced Audio Coding)"),  // 指定AAC对应的文件格式     .read_probe   = adts_aac_probe, // 探测函数     .read_header  = adts_aac_read_header, // 读取头部数据函数     .read_packet  = adts_aac_read_packet, // 读取数据包函数     .flags        = AVFMT_GENERIC_INDEX,	     .extensions   = "aac",	// 后缀     .mime_type    = "audio/aac,audio/aacp,audio/x-aac",     .raw_codec_id = AV_CODEC_ID_AAC,// AAC解码器ID };`

(2) AVOutputFormat结构体

 与AVInputFormat相反，AVOtputFormat为`复用/封装(muxing)器`对象，它包含了复用器的相关信息和操作函数，比如name成员变量为指定封装格式的名称，如"mp4"、"3gp"等；write\_header成员函数为读取封装头部数据；write\_packet成员函数为写入一个AVPacket等等。AVOutputFormat结构体(位于libavformat/avformat.h中)部分源码如下：

c

 代码解读

复制代码

`typedef struct AVOutputFormat { 	// 封装格式名称，如"mp4"     const char *name;     // 文件格式     const char *long_name;     // mime类型     const char *mime_type;     const char *extensions; /**< 逗号分隔的文件扩展名 */     /* output support */     enum AVCodecID audio_codec;    /**< 默认音频codec(编解码器) */     enum AVCodecID video_codec;    /**< 默认视频codec */     enum AVCodecID subtitle_codec; /**< 默认subtitle codec */     /**      * flags可取值：AVFMT_NOFILE, AVFMT_NEEDNUMBER,      * AVFMT_GLOBALHEADER, AVFMT_NOTIMESTAMPS, AVFMT_VARIABLE_FPS,      * AVFMT_NODIMENSIONS, AVFMT_NOSTREAMS, AVFMT_ALLOW_FLUSH,      * AVFMT_TS_NONSTRICT, AVFMT_TS_NEGATIVE      */     int flags;     const struct AVCodecTag * const *codec_tag;     const AVClass *priv_class; ///< AVClass for the private context     struct AVOutputFormat *next;     // private data的大小     int priv_data_size; 	// 写header     int (*write_header)(struct AVFormatContext *);     // 写一个packet。如果flags=AVFMT_ALLOW_FLUSH，pkt可为NULL，以便flush muxer中的缓冲数据     // 返回0，表示缓冲区仍还有数据可flush；返回1，表示缓冲区无可flush得数据      int (*write_packet)(struct AVFormatContext *, AVPacket *pkt);     int (*write_trailer)(struct AVFormatContext *);     // 如果不是YUV420P，目前只支持设置像素格式     int (*interleave_packet)(struct AVFormatContext *, AVPacket *out,                              AVPacket *in, int flush);     // 测试给定的编解码器是否可以存储在这个容器中                           int (*query_codec)(enum AVCodecID id, int std_compliance);     void (*get_output_timestamp)(struct AVFormatContext *s, int stream,                                  int64_t *dts, int64_t *wall);     int (*control_message)(struct AVFormatContext *s, int type,                            void *data, size_t data_size);     // 写未编码的AVFrame帧数据，详见av_write_uncoded_frame()     int (*write_uncoded_frame)(struct AVFormatContext *, int stream_index,                                AVFrame **frame, unsigned flags);     /**      * Returns device list with it properties.      * @see avdevice_list_devices() for more details.      */     int (*get_device_list)(struct AVFormatContext *s, struct AVDeviceInfoList *device_list);     /**      * Initialize device capabilities submodule.      * @see avdevice_capabilities_create() for more details.      */     int (*create_device_capabilities)(struct AVFormatContext *s, struct AVDeviceCapabilitiesQuery *caps);      // 释放设备功能子模块，详见avdevice_capabilities_free()     int (*free_device_capabilities)(struct AVFormatContext *s, struct AVDeviceCapabilitiesQuery *caps);     enum AVCodecID data_codec; /**< default data codec */     /**      * 初始化format. 分配数据内存，设置AVFormatContext或	AVStream参数，与deinit()配合使用，释放分配的内存资源      * 返回0，配置成功；返回1，配置失败。      */     int (*init)(struct AVFormatContext *);     /** 释放init分配的内存资源，无论调用init()是否成功      */     void (*deinit)(struct AVFormatContext *);     /** 检测比特流      * 如果返回0，表示需要检测流的更多packets；返回-1，则不需要      */     int (*check_bitstream)(struct AVFormatContext *, const AVPacket *pkt); } AVOutputFormat;`

 同样，通过调用av\_register\_all()函数，FFmpeg所有的复用器保存在以first\_oformat为头部指针、last\_oformat为尾部指针的链表中。这里以mp4(视频压缩编码格式)复用器为例，来分析AVOutputFormat结构体的初始化流程，相关源码详见libavformat/Movenc.c:

c

 代码解读

复制代码

`AVOutputFormat ff_mp4_muxer = {     .name              = "mp4", //复用器名称     .long_name         = NULL_IF_CONFIG_SMALL("MP4 (MPEG-4 Part 14)"),				//mp4对应的文件格式     .mime_type         = "video/mp4",// MIME类型     .extensions        = "mp4",		 // 文件扩展名     .priv_data_size    = sizeof(MOVMuxContext),     .audio_codec       = AV_CODEC_ID_AAC,// 音频编码器ID     .video_codec       = CONFIG_LIBX264_ENCODER ?                          AV_CODEC_ID_H264 : AV_CODEC_ID_MPEG4,// 视频编码器ID     .init              = mov_init,	// 初始化函数     .write_header      = mov_write_header, // 写入头部     .write_packet      = mov_write_packet, // 写入Packet     .write_trailer     = mov_write_trailer,     .deinit            = mov_free, // 释放资源     .flags             = AVFMT_GLOBALHEADER | AVFMT_ALLOW_FLUSH | AVFMT_TS_NEGATIVE,     .codec_tag         = (const AVCodecTag* const []){ codec_mp4_tags, 0 },     .check_bitstream   = mov_check_bitstream,     .priv_class        = &mp4_muxer_class, };`

###### 2\. 输入/输出(I/O)

(1) AVIOContext结构体

 AVIOContext是FFmpeg管理输入输出(I/O)数据的结构体，它是协议(文件)操作的顶层结构，提供带缓冲的读写操作。有关读写操作和成员变量的含义，可见如下源码中给出的注释示意图：

*   读取数据： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60d3b29331cc4ec697d5dab61676f60f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
*   写入数据： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4f37e314144cb5990dd9a48e64c49d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) AVIOContext结构体位于libavformat/avio.h中，部分源码如下：

c

 代码解读

复制代码

`typedef struct AVIOContext {     const AVClass *av_class;     unsigned char *buffer;  // 数据缓冲区     int buffer_size;        // 缓存的大小     unsigned char *buf_ptr; // 指针指向缓存区的当前位置，可小于buffer+buffer.size     unsigned char *buf_end; // 读取/写入缓存区数据的末尾位置      // 私有指针，关联URLContext结构，作为read/write/seek/...函数参数     // 用于完成对广义输入文件的读写等操作，指向一个URLContext对象     void *opaque;   		     // 读packet数据     int (*read_packet)(void *opaque, uint8_t *buf, int buf_size);     // 写数据到packet     int (*write_packet)(void *opaque, uint8_t *buf, int buf_size);     // 定位     int64_t (*seek)(void *opaque, int64_t offset, int whence);     int64_t pos;      // 当前缓存区域在文件中的位置     int eof_reached;  // 是否到达文件末尾，true表示已经到末尾     int write_flag;   // 是否可写标志，true表示open可写     int max_packet_size; // packet最大尺寸     unsigned long checksum;     unsigned char *checksum_ptr;     unsigned long (*update_checksum)(unsigned long checksum, const uint8_t *buf, unsigned int size);     // 错误代码，0表示没有错误出现     int error;           //网络流媒体协议暂停或恢复播放     int (*read_pause)(void *opaque, int pause);      int64_t (*read_seek)(void *opaque, int stream_index,                          int64_t timestamp, int flags);     // 0表示网络流不可seek     int seekable;     // 写入缓冲区中向后查找之前的最大到达位置，用于跟踪已写入的数据，以便稍后刷新     unsigned char *buf_ptr_max;     // packet最小尺寸     int min_packet_size;     // 以下字段大部分仅限libavformat内部使用或用的不多，这里不作解释     int64_t maxsize;     int direct;     int64_t bytes_read;     int seek_count;     int writeout_count;     int orig_buffer_size;     int short_seek_threshold;     const char *protocol_whitelist;     const char *protocol_blacklist;     int (*write_data_type)(void *opaque, uint8_t *buf, int buf_size,                            enum AVIODataMarkerType type, int64_t time);     int ignore_boundary_point;     enum AVIODataMarkerType current_type;     int64_t last_time;     int (*short_seek_get)(void *opaque);     int64_t written; } AVIOContext;`

 其中，AVIOContext的成员变量opaque指向一个`URLContext`对象，URLContext中是对具体资源文件进行操作的上下文，它包括一个URLProtocol结构体类型的指针变量prot。URLProtocol则是在将资源进行分类的基础上，对某一类资源操作的函数集。URLContext结构体源码如下：

c

 代码解读

复制代码

`typedef struct URLContext {     const AVClass *av_class;        // 关联/指向相应的广义输入文件     const struct URLProtocol *prot;       // 关联具体广义输入文件的句柄，如fd为文件句柄，socket为网络句柄     void *priv_data; 			     char *filename;             // 指定的URL     int flags;     int max_packet_size;             int is_streamed;            // true为流，默认为false     int is_connected;     AVIOInterruptCB interrupt_callback;     int64_t rw_timeout;        // read/write操作超时时间     const char *protocol_whitelist;     const char *protocol_blacklist;     int min_packet_size;         } URLContext;`

(2) URLProtocol结构体

 URLProtocol结构体表示广义的输入文件，是FFmpeg操作I/O的结构，包括文件(file)、网络数据流(tcp、rtp、... )等等，每种协议都对应着一个URLProtocol结构。该结构位于libavformat/url.h文件中，包括open、close、read、write、seek等操作，部分源码如下：

c

 代码解读

复制代码

`typedef struct URLProtocol { 	// 协议名称     const char *name;     int     (*url_open)( URLContext *h, const char *url, int flags);     int     (*url_open2)(URLContext *h, const char *url, int flags, AVDictionary **options);     int     (*url_accept)(URLContext *s, URLContext **c);     int     (*url_handshake)(URLContext *c);     /**      * Read data from the protocol.      */     int     (*url_read)( URLContext *h, unsigned char *buf, int size);     int     (*url_write)(URLContext *h, const unsigned char *buf, int size);     int64_t (*url_seek)( URLContext *h, int64_t pos, int whence);     int     (*url_close)(URLContext *h);     int (*url_read_pause)(URLContext *h, int pause);     int64_t (*url_read_seek)(URLContext *h, int stream_index,                              int64_t timestamp, int flags);     int (*url_get_file_handle)(URLContext *h);     int (*url_get_multi_file_handle)(URLContext *h, int **handles,                                      int *numhandles);     int (*url_get_short_seek)(URLContext *h);     int (*url_shutdown)(URLContext *h, int flags);     int priv_data_size;     const AVClass *priv_data_class;     int flags;     int (*url_check)(URLContext *h, int mask);     int (*url_open_dir)(URLContext *h);     int (*url_read_dir)(URLContext *h, AVIODirEntry **next);     int (*url_close_dir)(URLContext *h);     int (*url_delete)(URLContext *h);     int (*url_move)(URLContext *h_src, URLContext *h_dst);     const char *default_whitelist; } URLProtocol;`

 接下来，这里以HTTP协议为例，阐述URLProtocol结构体的初始化流程，同时也证明了每一种协议(包括文件)相对应一个URLProtocol对象。具体源码如下，位于libavformat/Http.c：

c

 代码解读

复制代码

`const URLProtocol ff_http_protocol = {     .name                = "http",	//协议名称     .url_open2           = http_open, // open操作     .url_accept          = http_accept,//accept操作     .url_handshake       = http_handshake,// 握手操作     .url_read            = http_read,	// 读取数据操作     .url_write           = http_write,	// 写入数据操作     .url_seek            = http_seek,	// seek操作     .url_close           = http_close,	// close操作     .url_get_file_handle = http_get_file_handle,     .url_get_short_seek  = http_get_short_seek,     .url_shutdown        = http_shutdown,     .priv_data_size      = sizeof(HTTPContext),     .priv_data_class     = &http_context_class,     .flags               = URL_PROTOCOL_FLAG_NETWORK,     .default_whitelist   = "http,https,tls,rtp,tcp,udp,crypto,httpproxy" };`

###### 3.编/解码

(1) AVCodec结构体

 AVCodec是与`编解码器(codec)`息息相关的数据结构体，它包含了`与codec相关的属性参数以及编解码操作函数等`，比如name为codec的名称、pix\_fmts为codec的视频帧像素格式等等，每一个codec都对应着一个AVCodec结构体。 AVCodec结构体源码如下：

c

 代码解读

复制代码

`typedef struct AVCodec {     // 编解码器名称     const char *name;     // 描述编解码器的名称     const char *long_name;     // media type     enum AVMediaType type; 	// 该codec的ID     enum AVCodecID id;     int capabilities; 	// 该codec相关的参数     const AVRational *supported_framerates;  	// 该codec支持的像素格式，针对视频帧/图像而言 	const enum AVPixelFormat *pix_fmts;     	// 该codec支持的采样率，针对音频而言 	const int *supported_samplerates;       	// 该codec支持的采样格式，针对音频而言 	const enum AVSampleFormat *sample_fmts;  	// 该codec的通道布局 	const uint64_t *channel_layouts;       	// 解码器支持的低分辨率的最大值 	uint8_t max_lowres;                          const AVClass *priv_class;                  const AVProfile *profiles;                  const char *wrapper_name;     int priv_data_size;     struct AVCodec *next;     int (*init_thread_copy)(AVCodecContext *);     int (*update_thread_context)(AVCodecContext *dst, const AVCodecContext *src);     const AVCodecDefault *defaults;     // 执行avcodec_register()函数被调用，     // 用于初始化codec的静态数据     void (*init_static_data)(struct AVCodec *codec); 	// 初始化     int (*init)(AVCodecContext *);     int (*encode_sub)(AVCodecContext *, uint8_t *buf, int buf_size,                       const struct AVSubtitle *sub);     /**      * 编码操作：将编码后的数据保存到AVPacket      *      * @param      avctx          codec上下文(context)      * @param      avpkt          输出的AVPacket      * @param[in]  frame          AVFrame存储的是要被压缩编码的裸数据      * @param[out] got_packet_ptr 编码器设置为0或1，以指示avpkt中返回的非空包      * @return 0 操作成功      */     int (*encode2)(AVCodecContext *avctx, AVPacket *avpkt, const AVFrame *frame,                    int *got_packet_ptr); 	// 解码操作     int (*decode)(AVCodecContext *, void *outdata, int *outdata_size, AVPacket *avpkt); 	// 关闭codec 	int (*close)(AVCodecContext *);     // Encode API with decoupled packet/frame dataflow.      int (*send_frame)(AVCodecContext *avctx, const AVFrame *frame);     int (*receive_packet)(AVCodecContext *avctx, AVPacket *avpkt);     // Decode API with decoupled packet/frame dataflow.      int (*receive_frame)(AVCodecContext *avctx, AVFrame *frame);     // flush缓冲区，执行seeking操作是被调用     void (*flush)(AVCodecContext *);   	... } AVCodec;`

(2) AVCodecContext结构体

 也许你会发现，对于编解码而言，除了AVCodec这个非常重要的结构体，在AVCodec的成员函数中还有一个出现频率非常高的结构体，可以这么说大部分与编解码有关的函数都需要传入一个结构体参数，这个结构体就是AVCodecContext。AVCodecContext结构体`存储视频流或音频流使用的编解码相关信息，比如codec_type表示编解码器的类型、codec表示采用的编解码器等等`。AVCodecContext结构体源码如下：

c

 代码解读

复制代码

`typedef struct AVCodecContext {     enum AVMediaType codec_type; /* 编解码器的类型（视频，音频...） */     const struct AVCodec  *codec;// 采用的解码器AVCodec（H.264,MPEG2...）     enum AVCodecID     codec_id; /* see AV_CODEC_ID_xxx */     // 比特率(音频和视频的平均比特率)     int64_t bit_rate;     // 压缩编码的等级     int compression_level;      // 针对特定编码器包含的附加信息（例如对于H.264解码器来说，存储SPS，PPS等）     uint8_t *extradata;      int extradata_size;     // 时基     // 根据该参数，可以把PTS转化为实际的时间（单位为秒s）     AVRational time_base;     // 图像宽、高，针对视频而言     int width, height;     // 像素格式，针对视频而言     enum AVPixelFormat pix_fmt; 	// 获取像素格式     enum AVPixelFormat (*get_format)(struct AVCodecContext *s, const enum AVPixelFormat * fmt);     // 非B帧之间的最大B帧数     int max_b_frames;      // I/P帧和B帧之间的qscale因子     float b_quant_factor;      // 采样纵横比     AVRational sample_aspect_ratio;     // 音频一帧采样样本个数     int frame_size;     // 音频通道布局     uint64_t channel_layout;     // 帧率     AVRational framerate; 	... } AVCodecContext;`

###### 4.数据相关结构体

(1) AVStream结构体

 AVStream结构体用于存储`一个视频或音频流信息`，其中，字段nb\_frames表示该流包含多少帧数据、字段duration表示该流的长度、字段index标志是音频流还是视频流等等。

c

 代码解读

复制代码

`typedef struct AVStream { 	// 标志视频流或音频流，存储在AVFormatContext中     int index;    /**< stream index in AVFormatContext */          // 指向该视频/音频流的AVCodecContext 	// @deprecated use the codecpar struct instead     AVCodecContext *codec; 	// 时基。通过该值可以把PTS，DTS转化为真正的时间     AVRational time_base;     // 该视频/音频流的长度     int64_t duration; 	// 该视频/音频流的帧数     int64_t nb_frames;               	// 元数据信息     AVDictionary *metadata; 	// 帧率(对视频来说很重要)     AVRational avg_frame_rate; 	// 附带的图片。比如说一些MP3，AAC音频文件附带的专辑封面     AVPacket attached_pic; 	 	... 	// 与该视频流或音频流相关的Codec参数 	// 由avformat_new_stream()分配、avformat_free_context()释放     AVCodecParameters *codecpar; } AVStream;`

(2) AVPacket结构体

 AVPacket结构体用于存储`压缩编码的视频或音频数据相关信息`，其中，字段stream\_index标志AVPacket所属的是音频流还是视频流。比如对于H.264来说，通常一个AVPacket的data对应着一个NAL，而一个NAL存储着一帧图像。 AVPacket结构体源码如下：

c

 代码解读

复制代码

`typedef struct AVPacket {          AVBufferRef *buf;     /**      * Presentation timestamp in AVStream->time_base units; the time at which      * the decompressed packet will be presented to the user.      */ 	// Presentation timestamp，即显示时间戳     int64_t pts;     /**      * Decompression timestamp in AVStream->time_base units; the time at which      * the packet is decompressed.      */ 	// Decompression timestamp，即解码时间戳     int64_t dts; 	// 压缩编码的视频或音频数据     uint8_t *data; 	// data的大小     int   size; 	// 标志该AVPacket所属的是音频流还是视频流     int   stream_index;     int   flags;     AVPacketSideData *side_data;     int side_data_elems;     /**      * Duration of this packet in AVStream->time_base units, 0 if unknown.      * Equals next_pts - this_pts in presentation order.      */ 	// 该AVPacket的长度     int64_t duration; 	// 该AVPacket在流中的字节位置，-1表示未知     int64_t pos;                            } AVPacket;`

(3) AVFrame结构体

 AVFrame结构体用于存储`解码后的视/音频数据相关信息`，表示一帧数据。如果AVFrame为视频帧数据结构体，字段data数组存储的是一帧图像、字段width、height为图像的宽、高、key\_frame为是否为关键帧标志等等；如果AVFrame为音频数据结构体，字段data数组存储的是音频数据，可包含多帧音频、字段sample\_rate为音频的采样率、字段channels为音频通道数量等等。 AVFrame结构体源码如下：

c

 代码解读

复制代码

`typedef struct AVFrame { 	// 解码后的原始数据(视频-YUV或RGB；音频-PCM) 	// 对于packed格式的数据(如RGB24)，会存储在data[0] 	// 对于plannar格式的数据(如YUV420P)，Y分量存储在data[0]、U分量存储在data[1]、V分量存储在data[2]     uint8_t *data[AV_NUM_DATA_POINTERS]; 	// data一行数据的长度 	// 注意：如果是图像不一定等于图像的宽度，往往大于图像的宽     int linesize[AV_NUM_DATA_POINTERS];     // 视频帧的宽、高     int width, height; 	// 该AVFrame包含几个音频帧     int nb_samples; 	// 解码后原始数据类型，比如YUV420、RGB.. 	// 音频，详见AVSampleFormat 	// 视频，详见AVPixelFormat     int format; 	// 是否为关键帧，对视频来说非常重要 	// 1 -> keyframe, 0-> not     int key_frame;     // 帧类型，比如I帧、B帧、P帧...     enum AVPictureType pict_type;     // 视频帧宽高比，如16:9、4:3...     AVRational sample_aspect_ratio;     // 显示时间戳     int64_t pts; 	// 编码图像帧序号     int coded_picture_number;     // 显示图像帧序号     int display_picture_number;     // 音频采样率     int sample_rate;     // 音频通道layout     uint64_t channel_layout;     // YUV颜色空间类型     enum AVColorSpace colorspace; 	// 元数据     AVDictionary *metadata; 	// 音频通道数量     int channels; 	... } AVFrame;`

 至此，FFmpeg框架中最为重要的结构体，我们基本讲解梳理完毕。最后，再借用[雷神](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fleixiaohua1020 "https://blog.csdn.net/leixiaohua1020")的[FFmpeg关键结构体关系图](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fleixiaohua1020%2Farticle%2Fdetails%2F11693997 "https://blog.csdn.net/leixiaohua1020/article/details/11693997")作为结尾，一是使得本文能够前后呼应，二是向大神致敬！ ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad513499ea884f1aad66f68e7568ddcf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

[Github实战项目：https://github.com/jiangdongguo/FFMPEG4Android](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjiangdongguo%2FFFMPEG4Android "https://github.com/jiangdongguo/FFMPEG4Android")