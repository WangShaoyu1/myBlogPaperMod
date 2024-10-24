---
author: ""
title: "Web 视频播放的那些事儿"
date: 2020-04-08
description: "对于视频的在线播放，按视频内容的实时性可以分为点播（VOD）和直播（Live Streaming）。现如今在 Web 环境下需要进行视频播放时，通常可以使用 video 标签，通过它将视频播放的各个环节都托管给浏览器。 视频的在线播放，站在视频消费者这一侧来看，主要的技术环节在…"
tags: ["HTML中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读27分钟"
weight: 1
selfDefined:"likes:247,comments:0,collects:268,views:14816,"
---
> 图片来源：[ultimatewebsitedesign.co.uk](https://link.juejin.cn?target=https%3A%2F%2Fultimatewebsitedesign.co.uk "https://ultimatewebsitedesign.co.uk")

> 本文作者：[hsy](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhsiaosiyuan0 "https://github.com/hsiaosiyuan0")

背景
--

对于视频的在线播放，按视频内容的实时性可以分为点播（VOD）和直播（Live Streaming）。现如今在 Web 环境下需要进行视频播放时，通常可以使用 video 标签，通过它将视频播放的各个环节都托管给浏览器。

视频的在线播放，站在视频消费者这一侧来看，主要的技术环节在于视频的解码、显示效率，以及视频数据的传输效率。Web 标准中通过 video 标签，将这两个环节进行解耦，开发者不必关心视频数据的解码、显示环节，而在数据加载环节进行一些扩展。

在点播的场景下，视频的生产者已经预先准备好了视频的数据内容，站在视频消费者这一侧的开发者只需要指定 video 标签 src 属性为对应的资源地址即可。但是在一些复杂的需求中，比如需要细致地控制视频数据的预加载时机和数据量，那么则需要对视频的一些规格参数以及相关的技术点做进一步的了解。

本文将对视频点播场景下，对数据加载环节进行拓展所需了解的技术内容做简单的介绍。

视频文件的参数
-------

视频文件有一些常见的规格参数，它们作为视频相关技术内容的起点，简单地了解它们有助于更快的理解在此之上的内容。

### 视频的产生

起初视频的来源都是自然界中的事物对光的反射，被图像采集设备按一定的频率采集后进行保存，在需要观看的时候，将保存的内容按一定的频率进行播放。这个大致的流程一直延续至今，只不过由于数字技术的成熟，视频的内容也可以直接通过软件编辑生成。

![](/images/jueJin/17153ee6979713f.png)

人类可以识别的光谱和光线变化的频率都具有一定的范围，低于或者高于这个范围的变化都无法被绝大部分人所感知。因此在保存以及播放视频的时候，需要结合人的感官体验以及软硬件资源的限制对视频的各个参数做相应的调整。

### 帧率 Frame-rate

视频的播放原理类似幻灯片的快速切换。

![](/images/jueJin/17153ee6998b762.png)

每一次切换显示的画面，称之为一帧（Frame）。而帧率则表示每秒切换的帧数，因此它的单位是 FPS（Frames Per Second）。帧率并不和视频的清晰度直接相关，但它却也是影响感官体验的重要因素。

人类对画面的切换频率的感知度有一个范围，一般 60FPS 左右是一个比较合适的范围。但这并不是绝对的，在需要记录一个变化须臾之间的镜头时，准备足够的帧数才能捕捉到细微的变化；当拍摄一个缓慢的镜头推进的效果时，帧率并不需要太高，分辨率会起到更高的作用。

帧率的选取除了需要结合播放内容，还需要结合显示设备的刷新频率，否则选取了过高的帧率而显示设备不支持的话，多余的帧也只会被丢弃。

### 分辨率 Resolution

在视频播放时，显示到屏幕上的每一帧包含的像素数量是一致的。像素是显示设备上发光原件的最小单位，最终呈现的画面是由若干个像素组合起来所展示的。

分辨率表示视频每一帧包含的像素，以 `水平方向的像素数量 × 垂直方向的像素数量` 来表示，比如 `720p = 1280 × 720` 就是一个比较常见分辨率。

这里的 `p` 表示的是逐行扫描（Progressive Scanning），与之对应的是 `i` 表示的是隔行扫描（Interlaced Scanning），见下图

![](/images/jueJin/17153ee69a7987d.png)

最左边一列是逐行扫描，中间一列是隔行扫描。可见隔行扫描会丢失一些画面信息，相反的会更快地收集画面，画面的像素信息即文件大小相较逐行扫描也会偏小。

当视频的分辨率低于显示设备的分辨率时，设备上的像素点多于视频显示所需的像素点，这时就会用上各式的补间算法（Interpolation Algorithm）来为显示设备上那些未被利用的像素点生成色值信息，以完全点亮显示设备的所有像素点，否则将会导致屏幕上出现黑点。

关于补间算法，这里有一小段视频可以作为参考 [Resizing Images](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAqscP7rc8_M "https://www.youtube.com/watch?v=AqscP7rc8_M")。

因为那些像素上的信息是算法生成的，所以当视频的分辨率明显小于显示设备的分辨率时，这样的像素点就会变得过多，从而导致感官上的清晰度下降。而如果视频的清晰度超过设备的分辨率上限，则多出的信息会被丢去，因此也不会呈现更好的效果。

所以视频分辨率的选择，需要同时结合显示设备的分辨率。

### 比特率 Bitrate

比特率的单位是 `bit/s`，表示视频每秒长度中包含的比特数。

![](/images/jueJin/17153ee69a2f9b4.png)

目前的视频的画面采集设备可以收集非常大量的像素信息，视频的作者为了方便对视频进行分发，需要将原始视频进行压缩转码。

比特率的大小，受到单位时间内的视频文件的体积所影响，而影响视频文件的体积的因素为：原始视频内容、转码选取的分辨率、帧率以及转码所采用的编码方案（Codec）。

因此比特率并不是一个和视频清晰度直接关联的参数。

如果采用的是离线播放的话，那么比特率将不是一个重要的参数。而如果采用在线点播的方式观看视频时，视频的比特率则成了必须要考量的重要指标。

比特率表示为了显示一秒的画面所需传输的比特数。它可以方便的和带宽做比较。在线点播时，需要保证在有限的带宽条件下，每秒传输尽可能多的比特，这些比特需要保证画面的传递不会出现问题。

### 视频格式

因为计算机只能按照既定的程序逻辑来执行，所以视频数据需要按预先制定好的格式进行整理后才能保存设备上。在格式的制定中，主要保存两类信息：

1.  视频元数据
2.  视频主体数据

元数据包含对主体数据的一些描述信息，比如会记录视频的大小、分辨率、音频和视频的编码方案等。

视频元数据和主体数据如何组合到一起进行保存，需要容器格式来指定，常见的容器格式包括 MP4、AVI 等。对于视频来说一般会选择 MP4 作为容器格式，因为它被各个系统和设备广泛支持。

针对视频主体数据，则需要另外的参数来指定，通常称之为编码方案。不同的编码方案会视频文件的体积和最终的播放效果之间做取舍。

视频数据分段加载
--------

上文已经简单介绍了一些视频相关的参数。在点播场景下，视频的生产者已经完成了视频的生产工作，视频内容采用某一种编码方案进行编码，并和其他一些信息一起，以某个容器格式进行保存。站在视频消费者角度，为了尽快地能够观看到视频的内容，肯定不能采用加载完整个视频数据后才进行播放的形式，因此从技术上必须支持对视频数据进行分段地加载以及解码播放。

文章的开头已经提到，Web 标准中已经将解码播放和数据加载的环节进行了解耦，因此作为开发者只需要实现对视频数据的分段加载。

在具体了解分段加载的技术细节之前，可以通过一个简单的例子来感受整个分段加载的流程。

### 以 HLS 为例的演示

这个例子将以 HLS 协议进行展开。HLS 协议只是众多视频数据分段加载协议中的一种，关于它的一些细节将在下一节进行介绍。先通过运行一个例子来对数据分段加载有一个具体的感受。

通过下面这条命令来启动这个例子，在此之前请确保电脑上已经安装了 [ffmpeg](https://link.juejin.cn?target=https%3A%2F%2Fwww.ffmpeg.org%2F "https://www.ffmpeg.org/") 以及所处网络的通畅：

```
wget -qO- https://gist.githubusercontent.com/hsiaosiyuan0/412a4ca26d00ff7c45318227e7599c3d/raw/de5e3c467800d1f2315e74ba71f0eb6c6760a7a0/hls.sh | bash
```

这段命令会加载并执行一段网络上的[脚本](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fhsiaosiyuan0%2F412a4ca26d00ff7c45318227e7599c3d "https://gist.github.com/hsiaosiyuan0/412a4ca26d00ff7c45318227e7599c3d")。这段脚本将会执行下面的工作：

1.  下载一段网络上的视频
2.  利用 ffmpeg 对这段视频进行压缩和分段处理
3.  生成 m3u8 文件用于对这些分段文件进行描述和索引
4.  生成一个用于演示的 html 文件，在其中将使用 video 标签完成视频点播的功能
5.  通过 [svrx](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsvrxjs%2Fsvrx "https://github.com/svrxjs/svrx") 来启动一个本地的 Web 服务器

如果无法运行这段脚本的话，也可以通过这段 [视频](https://link.juejin.cn?target=https%3A%2F%2Fyoutu.be%2FirTIrQFlaGw "https://youtu.be/irTIrQFlaGw") 或者 [gif](https://link.juejin.cn?target=https%3A%2F%2Fp1.music.126.net%2Fr8QmgFBj2fptiMwI200GwA%3D%3D%2F109951164871649534.gif "https://p1.music.126.net/r8QmgFBj2fptiMwI200GwA==/109951164871649534.gif") 来获得演示的内容。

在演示中可以看到浏览器会对分段的数据进行加载，并且当网络环境变化后，会加载不同清晰度的分段内容。

### HLS（HTTP Live Streaming）协议

HLS 是苹果公司为满足在线点播需求而推出的流媒体播放协议。因为这个协议基于 HTTP 协议，所以可以充分利用现存的针对 HTTP 协议的技术内容和优化措施。

![](/images/jueJin/17153ee69c46e02.png)

通过这个图可以发现，视频录制完成后需要先上传到 Web 服务器进行分段和索引，这期间的消耗会让用户接受到的信息产生一定的滞后。所以虽然之为 Live Streaming，但是它和实时（Realtime）之间还是有一些差距，文章开头提到的 Live Streaming 指的是实时的数据流。

苹果公司不光制定了 HLS 协议的细节，对于协议的实施也给出了一套解决方案，可以从 [About Apple's HTTP Live Streaming Tools](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fhttp_live_streaming%2Fabout_apple_s_http_live_streaming_tools "https://developer.apple.com/documentation/http_live_streaming/about_apple_s_http_live_streaming_tools") 中获得对于这些工具的介绍。由于协议本身是开源的，依然可以使用类似上一节例子中的 ffmpeg 来完成一些相同的工作。

HLS 协议的关键，同时也是数据分段加载的关键在于两部分：

1.  以什么策略对数据进行分段
2.  对分段的结果进行描述和索引

对于分段的策略，通常情况下会选择将视频按照相同的播放时间分割成一个个小段，比如上面的例子中将视频按 10s 来分割每一个段。

而在 HLS 协议中，通过 m3u8 文件来对分段的内容进行描述和索引。就如同上面的例子一样，视频的制作者除了需要将视频进行分段以外，还需要生成对这些分段进行描述的 m3u8 文件，而视频的消费者，只要得到 m3u8 文件，就可以灵活的选择分段的加载形式了。

接下来将通过进一步了解 m3u8 的细节，以了解分段的内容。

### m3u8 文件

[m3u](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FM3U "https://en.wikipedia.org/wiki/M3U") 是一种保存音视频文件播放所需信息的文件格式，m3u8 则是该格式在使用 UTF8 进行编码时的缩写。

m3u8 文件在 HLS 协议中起到 Playlist 的作用，类似音乐播放软件中的“歌单”，不过歌单面向的对象是用户，而 m3u8 则是供播放器选用。

因为是采用的 UTF8 进行的编码，所以可以使用常见的文本编辑器打开它们。下图是上文例子中产生的 m3u8 文件的内容：

![](/images/jueJin/17153ee6bb24c69.png)

完整的 m3u8 格式的说明见 [rfc8216 - HTTP Live Streaming](https://link.juejin.cn?target=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc8216 "https://tools.ietf.org/html/rfc8216")。截图涉及到的相关协议内容为：

*   文件中每行只会存在三种类型的数据：URI、空行、以 `#` 开头的行，空行将和注释一起被解释程序忽略
    
*   协议中规定以 `#` 开头的行可以表示注释或者标签（Tag），紧接着 `#` 的内容为 `EXT`（区分大小写）则表示该行是标签，否则都视为注释，会被解释程序所忽略
    
*   因此第一行 `#EXTM3U` 表示的是标签。该标签用以表示当前文件是对 m3u 格式的扩展，协议规定该标签必须出现在文件开头的第一行
    
*   剩余的以 `#EXT` 开头的行都是标签，它们被 URI 行分隔，用于修饰它们下方的 URI 资源
    
*   某些标签含有值，其值的形式为属性列表（Attribute Lists），属性列表中的属性以半角逗号（,）进行分隔，属性由名称和其值所组成，形式为 `AttributeName=AttributeValue`。因此 `#EXT-X-STREAM-INF` 标签的值即为属性列表
    
*   Playlist 分为两类，其中类似截图中只存在 URI 内容的称之为主播放列表（Master Playlist），主播放列表中的 URI 都表示的是另一种类型，媒体信息播放列表（Media Playlist）的位置。Media Playlist 中具体记录了资源的分段信息：
    
    ![](/images/jueJin/17153ee6c0d8de8.png)
*   `#EXT-X-STREAM-INF` 标签的作用是描述可变流（Variant Stream）的信息。其中的属性含义大都在第一节已经介绍过了。`BANDWIDTH` 表示该流中各个分段的比特率的峰值，另一个常见的 `AVERAGE-BANDWIDTH` 虽然没有出现，但是它表示综合了各个分段的比特率的平均值。客户端会根据这两个属性的值、结合自身当前的带宽来选择合适的流下的下一个分段数据
    

所以在上文的例子中，通过向 video 指定一个包含三个不同分辨率的 Master Playlist，浏览器会根据自身当下的带宽速率，自动的在三个数据流之间进行切换。当前如果没有需要自动切换清晰度的场景，也可以向 video 标签直接指定一个 Media Playlist 来完成对某个特定的分辨率的流的播放。

### Dynamic Adaptive Streaming over HTTP（DASH）

HLS 协议因为是苹果公司推出的，所以可以在苹果公司的设备上得到广泛的支持，在运行于这些设备上的 Safari 浏览器中，video 标签可以直接作为 HLS 协议的客户端来运行。

在那些不支持 HLS 的浏览器环境中，通常可以使用另一种类似的协议，该协议直接由 [MPEG](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMPEG "https://en.wikipedia.org/wiki/MPEG") 组织开发和维护，称之为 MPEG-DASH，MPEG 是一个国际上专门制定视频播放相关协议的组织，因此 DASH 协议相比 HLS 更具广泛性。

作为另一个基于 HTTP 协议的流媒体播放协议，DASH 具有和 HLS 相似的技术细节。例如它通过 Media Presentation Description（mpd）文件提供类似 m3u8 文件的功能。下图是 mpd 文件内容的截图：

![](/images/jueJin/17153ee6c0a0071.png)

DASH 协议并不被主流浏览器厂商直接支持，通常需要借助额外的客户端插件配合，比如接下来将介绍的 MSE 来完成数据的分段加载。在考虑移动端播放的情况下，通常来说选用 HLS 协议能够适配更多的设备，这是因为支持 DASH 的播放的设备通常都可以通过 HLS 插件来对 HLS 协议提供支持，反之则不然。

Media Source Extension
----------------------

MSE，Media Source Extension 是 Web 标准中制定的针对音视频数据加载的接口，Web 应用程序可以通过这个接口实现自己的音视频数据的加载方案。因为 WebRTC 不是针对点播的协议，所以 MSE 成为了点播场景下唯一的音视频数据加载接口。

上文提到的 HLS 和 DASH 协议，在那些不原生支持它们但是支持 MSE 的浏览器中，都可以通过基于 MSE 实现对应的插件来完成相应的支持。

下图是 MSE 目前的兼容性概览，另见 [Caniuse - MediaSource](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%23search%3DMediaSource "https://caniuse.com/#search=MediaSource")：

![](/images/jueJin/17153ee6c3657da.png)

图中指的是 iPadOS，在 iOS 上目前还是不支持的。在安卓设备上总体来说支持度比较高，所以上文提到采用 HLS 协议能够适配更多的设备，在苹果设备上原生支持，在安卓设备上通过基于 MSE 的 HLS 插件来对其进行支持。

MSE 的目的是将音视频的播放和数据加载进行解耦。Web 开发者不必介入或者干预现有的音视频解码和播放控制的行为，只需要通过 [MediaSource](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FMediaSource "https://developer.mozilla.org/en-US/docs/Web/API/MediaSource") 向音视频元素传递播放所需的数据即可，下图可以演示它们之间的关系：

![](/images/jueJin/17153ee6c5b4109.png)

音视频元素只负责对音视频数据进行解码播放，应用自定义音视频数据的加载策略并对数据进行加载，两者之间通过 MediaSource 进行交互。

### AbortController

使用 MSE 是为了自定义音视频数据加载的策略，而数据加载策略中重要的一个功能点在于，为了节约带宽，需要可以终止那些正在进行的已知无用的请求的继续加载。而 [Fetch API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FFetch_API "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API") 里面终止数据加载的功能需要结合 [AbortController](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FAbortController "https://developer.mozilla.org/en-US/docs/Web/API/AbortController") 来使用。

下面是 AbortController 目前的兼容性概览，另见 [Caniuse - AbortController](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%23search%3DAbortController "https://caniuse.com/#search=AbortController")：

![](/images/jueJin/17153ee6cb0b394.png)

除非必要，否则完全不用支持 IE，因此在不考虑 IE 的情况下，它和 MSE 具有相似程度的兼容性，可以将两者结合在一起使用。

在 AbortController 不可用的情况下 [XMLHttpRequest.abort()](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest%2Fabort "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort") 是另个具有较高兼容性的方案。不过 AbortController 对资源可以起到“分组”管理的特性，是 XMLHttpRequest 默认所不具备的。

视频加载速率优化
--------

针对视频加载速率的优化，通常来说有两个方向，分别是「动态切换清晰度」和「视频内容预加载」，接下来将对这两个技术点做简单的介绍。

### 动态切换清晰度

动态切换清晰度指的是在视频播放的过程中，根据设备的当前带宽在不同清晰度的流之间进行切换的功能。

在使用 HLS 协议时，服务端预先将视频进行压缩分段，并提供 m3u8 文件，客户端拿到 m3u8 文件后，根据当前的带宽动态的切换分段的加载。

比如针对同一个视频，准备了三个不同清晰度的流，并分别将视频流分隔为3段：

```
720P --seg11--  --seg12-- --seg13--
480P --seg21--  --seg22-- --seg23--
360P --seg31--  --seg32-- --seg33--
```

最简单的算法下，客户端可以先选择中间分辨率的流 480P 来加载第一段的视频（seg21），根据加载的时长以及 seg21 本身的大小可以得到当前的下载速率，如果低于 480P 正常播放所需的带宽，比如 1500kps，则下一段视频将从满足当前带宽的流中选取，在上面的例子中就是加载 360P 的 seg32。

当然因为带宽是动态变化的，且是一个估算的值，例子中仅通过一个分段就进行切换很大程度上是不合理的，这里只是作为演示。更为实用的算法可以参考 DASH 协议中的 [Adaptive Bit Rate Logic](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FDash-Industry-Forum%2Fdash.js%2Fwiki%2FABR-Logic "https://github.com/Dash-Industry-Forum/dash.js/wiki/ABR-Logic")。

### 视频内容预加载

视频内容预加载顾名思义就是在视频未开始播放前，就预先加载一部分视频内容，这样用户点击播放时，即刻就能获得反馈。

视频内容预加载的算法基于两点进行展开：

1.  对用户即将进行点播的行为的预判
2.  在不阻碍当前播放进度的前提下进行预加载

对于第一点来说，需要结合业务的需求来做具体的调整。

对于第二点来说，最简单的算法可以对正在播放的视频设置一个缓冲区的安全阙值，比如 5s，如果当前正在播放的视频其缓存区中有 5s 的内容尚未被播放，则可以尝试进行下一条视频的预加载。

所以总得来说，预加载依赖于技术上的可行性，具体的策略则需要按照实际的需求来制定。在不支持 MSE 的场景下，可以通过 video 标签的 [preload](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTML%2FElement%2Fvideo%23attr-preload "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload") 属性来开启预加载，不过预加载的时机以及预加载的数据量则都是处于托管的状态。

MSE 和 MP4
---------

上文对 HLS 和 DASH 协议以及 MSE 做了简单的介绍，也对视频加载速率的优化方式做了简单的介绍。在使用 HLS 和 DASH 的情况下，都可以直接选用现有的开源实现来获得客户端的播放支持，比如 [hls.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvideo-dev%2Fhls.js%2F "https://github.com/video-dev/hls.js/") 和 [dash.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FDash-Industry-Forum%2Fdash.js "https://github.com/Dash-Industry-Forum/dash.js")。

使用 HLS 和 DASH 协议都有一个前提条件，就是视频文件需要按照协议的规定以及业务实际所需进行预先分段，换句话说就是需要服务端的配合。

下面将介绍一种在缺乏 HLS 和 DASH 的支持下，利用 HTTP Ranges 和 MP4 容器格式加上 MSE 来完成对视频内容分段加载的可行性。这个形式几乎不需要服务端的额外配合，也可以通过对这个可行性的介绍，进一步了解 MSE 协议以及 MP4 容器格式。

### HTTP Ranges

音视频文件，在点播场景下通常都会通过 CDN 网络加速内容的分发。CDN 网络中的 Web 服务器通常都会支持 [HTTP Range Request](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTTP%2FRange_requests "https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests") 功能。通过这个功能，能够让客户端在预先知道文件内容的情况下，按需取得文件的某一部分。

所以分段加载一段视频数据的能力是 CDN 网络默认就提供的，剩下的只是如何能够让客户端预知一段视频的内容。在 HLS 或者 DASH 协议中，都是通过索引文件 m3u8 或 mpd 来实现的，客户端通过加载这个索引文件就预知了整个视频的分段信息和它们的相对偏移量，因此顺利的完成后续的加载工作。

m3u8 文件的功能，基本可以直接利用 MP4 容器格式来提供，这是因为 MP4 容器格式中定义了一个名为 moov 盒子，它记录了类似分段的信息，关于 MP4 容器格式的细节下一节将会介绍。

moov 根据制作视频的软件不同，有时会处于整个视频文件的末尾，因此为了让客户端播放软件能够尽快地加载到 moov 盒子，CDN 服务提供商都会建议视频提供者先将视频的 moov 信息进行前移后再进行分发。比如 NOS 官网上就有类似的建议，见 [Flash Player点播](https://link.juejin.cn?target=https%3A%2F%2Fm.163yun.com%2Fhelp%2Fdocuments%2F88797339293241344%23Flash%2520Player%25E7%2582%25B9%25E6%2592%25AD "https://m.163yun.com/help/documents/88797339293241344#Flash%20Player%E7%82%B9%E6%92%AD")。

可见在这个方案中，对 MP4 文件格式的了解成了重要的一环，接下来将会简单介绍 MP4 文件格式。

### MP4 容器格式

MP4 是一个容器格式，之所以强调它是一个容器格式，是因为它的作用是将所有用于描述视频的信息进行有组织的统一存放。另一个常常提到的编码格式只是 MP4 容器包含的众多视频信息中的一个。

MP4 格式大致这几个特点：

*   MP4 文件采用二进制进行编码，在格式的制定上采用面向对象（Object Oriented）的设计
*   视频信息按类别进行组织，并归纳到一个个盒子类型（Box Class）中，因此整个 MP4 文件由一个个盒子（Box）构成，每个盒子都是其所对应的盒子类型的实例
*   盒子类型之前存在嵌套的形式，以表示它们之间的包含关系

可以通过 [MP4Box.js](https://link.juejin.cn?target=https%3A%2F%2Fdownload.tsi.telecom-paristech.fr%2Fgpac%2Fmp4box.js%2Ffilereader.html "https://download.tsi.telecom-paristech.fr/gpac/mp4box.js/filereader.html") 提供的在线工具，放入这段[演示视频](https://link.juejin.cn?target=https%3A%2F%2Fwww.dropbox.com%2Fs%2Ffl02xpyhz8693b0%2Fmv.mp%3Fdl%3D1 "https://www.dropbox.com/s/fl02xpyhz8693b0/mv.mp?dl=1")，来查看 MP4 文件的结构信息：

![](/images/jueJin/17153ee6eec3feb.png)

除了在线工具以外，也可以通过 [AtomicParsley](https://link.juejin.cn?target=http%3A%2F%2Fatomicparsley.sourceforge.net%2F "http://atomicparsley.sourceforge.net/") 这个命令行程序快速地得到 MP4 文件的内部盒子结构。

使用下面的命令即可：

```
AtomicParsley 1.mp4 -T
```

上图中，左边 Box Tree View 展示的是文件内包含的盒子，以及这些模块的层级关系，右边则是当前选中的盒子上的属性。

上图中顶层的盒子包括 `ftyp`，`free`，`mdat`，`moov`。`moov` 包含另外一些盒子，以子节点的形式进行展示。`mdat` 盒子中保存的是音视频数据的主体，`moov` 盒子中包含了用于描述这些数据的元信息。

MP4 中众多的盒子类型和它们的从属关系如下图，另见 [ISO/IEC 14496-12](https://link.juejin.cn?target=https%3A%2F%2Fmpeg.chiariglione.org%2Fstandards%2Fmpeg-4%2Fiso-base-media-file-format%2Ftext-isoiec-14496-12-5th-edition "https://mpeg.chiariglione.org/standards/mpeg-4/iso-base-media-file-format/text-isoiec-14496-12-5th-edition")：

![](/images/jueJin/17153ee6f091610.png)

上图表格中的缩进展示了盒子之间的包含关系。moov 盒子中比较重要的盒子就是 `trak` 盒子。MP4 格式中将画面数据和音频数据分开保存，一般来说一段视频将包含一段画面数据和一段音频数据，它们的信息将分别通过两个独立的 trak 盒子来保存。

trak 盒子中主要记录音视频的编码信息，以及对音视频数据块的索引，数据块的主体存放在 mdat 盒子中。

因此只要客户端得到一段视频的 moov 信息，那么就可以按需地加载 mdat 中的音视频数据。

在了解盒子之间的关系之后，可以通过下图来简单的了解盒子的数据结构：

![](/images/jueJin/17153ee6f247c24.png)

盒子的数据整体可以分为 head 和 body 两部分，这样分类虽然不是协议内规定的，但却是一个方便理解的方式。需要注意的是头部中的 `size` 数据，它表示的是整个盒子所占的数据大小。这样的设计使得客户端在快速的在盒子之间进行偏移，并且只选择自己感觉兴趣的部分进行延迟解析。

如果把文件整个看成是一个大的盒子，那么 `ftyp`，`moov` 这些处于顶层的盒子则是它的子节点。盒子在其父级节点中的顺序不被要求是固定的。比如 `ftyp` 在标准中只被要求尽早的出现，而并不是必须放到起始的位置。

正是因为盒子在容器中的顺序是不固定的，客户端软件只能通过不断地请求顶层的盒子来获取到 moov 盒子，可以通过运行一小段程序来具体演示这个过程。这里是演示代码的[源码](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fhsiaosiyuan0%2Fa7b215b53b48b9e66d2e0bad9eb8d1dd "https://gist.github.com/hsiaosiyuan0/a7b215b53b48b9e66d2e0bad9eb8d1dd")，可以通过下面的命令运行该演示程序：

```
deno --allow-net https://gist.githubusercontent.com/hsiaosiyuan0/a7b215b53b48b9e66d2e0bad9eb8d1dd/raw/6bf88be0c81d55f620b1d94d51f5a56b55691007/locate-moov.ts
```

如果不方便运行这段脚本，也可以直接查看这里的[结果演示](https://link.juejin.cn?target=https%3A%2F%2Fp1.music.126.net%2F4EvSPXQyQojvL8K9kG67fg%3D%3D%2F109951164874025501.gif "https://p1.music.126.net/4EvSPXQyQojvL8K9kG67fg==/109951164874025501.gif")。

这段脚本中正是利用了 box 盒子数据结构的特点，从文件的起始位置开始请求第一个8个字节的内容，这也是上文提到的盒子的 head 部分，它们将包含盒子的大小以及盒子的类型，各占4个字节。随后的请求将不断地累加偏移地址以请求接下来紧挨着的盒子，但是每次依然只请求盒子的头部信息，经过几次偏移后，将会得到 moov 盒子的信息。

通过这个例子也可以看出将 moov 信息前置的意义，将有效得减少为了定位 moov 盒子的偏移请求次数。

### MSE-FORMAT-ISOBMFF

到目前为止已经介绍了 MSE，HTTP Ranges 和 MP4 容器格式。通过对 MP4 容器格式的了解，发现它内部的数据其实也是分块存储的，并且分块的信息保存在 moov 盒子中。

那么似乎按照 moov 盒子的分块信息加载分块的数据然后借助 Media Source 就能进行视频的播放了，比如下面的这段代码摘自 [Google Developer - Media Source Extensions](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fweb%2Ffundamentals%2Fmedia%2Fmse%2Fbasics "https://developers.google.com/web/fundamentals/media/mse/basics")，其中最重要的一段代码就是 `appendBuffer` 的调用：

![](/images/jueJin/17153ee6f1c8bc9.png)

应用代码加载了分段的数据，然后调用 `appendBuffer` 将数据通过 Media Source 传递给音视频播放器。

实际上事情要稍微复杂一些，这是因为 MP4 容器格式只是众多容器格式中的一种，而 MSE 作为一个通用的数据接口，它将对接各种容器格式的数据，因此它对外制定了一个通用的数据分段格式。这个分段格式被称为 [MSE-FORMAT-ISOBMFF](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fmse-byte-stream-format-isobmff%2F "https://www.w3.org/TR/mse-byte-stream-format-isobmff/")，它是基于 [ISO base media file format, ISOBMFF](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FISO%2FIEC_base_media_file_format "https://en.wikipedia.org/wiki/ISO/IEC_base_media_file_format") 的修改版。

通常所说的 MP4，即 MPEG-4 Part 14，它和 ISOBMFF 的关系为：

![](/images/jueJin/17153ee6f308e04.png)

可以看到 MP4 是 ISOBMFF 格式的拓展，将包含更多样化的信息。而 MSE-FORMAT-ISOBMFF 是在 ISOBMFF 的基础上引入了分段的概念。

MSE-FORMAT-ISOBMFF 下数据的分段加载形式如下：

![](/images/jueJin/17153ee70065172.png)

上图展示了 MSE-FORMAT-ISOBMFF 中的两个主要分段类型：[initialization segment](https://link.juejin.cn?target=https%3A%2F%2Fw3c.github.io%2Fmedia-source%2Fisobmff-byte-stream-format.html%23iso-init-segments "https://w3c.github.io/media-source/isobmff-byte-stream-format.html#iso-init-segments") 和 [media segment](https://link.juejin.cn?target=https%3A%2F%2Fw3c.github.io%2Fmedia-source%2Fisobmff-byte-stream-format.html%23iso-media-segments "https://w3c.github.io/media-source/isobmff-byte-stream-format.html#iso-media-segments")。这些分段又由一些盒子组成。

因此为了让 MP4 格式的文件可以被 MSE 播放，需要在格式上做类似下面从右往左的转换，整体的流程为：

![](/images/jueJin/17153ee71ab5870.png)

最右边是原本的视频内容，中间虚线部分为开发者自行编写的内容，需要完成对原始视频时间的下载和再组装的任务。

转换的过程并不涉及到对视频数据的转码，只是容器格式的相互转换，但是即使这样整个过程依然十分繁琐，因此借助现有的实现可以方便地完成这个工作。

[mp4box.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgpac%2Fmp4box.js%2F "https://github.com/gpac/mp4box.js/") 就是这样在这方面功能比较丰富的实现。不过虽然功能比较多，但是文档还不是非常丰富，可以参考仓库中的[测试案例](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgpac%2Fmp4box.js%2Ftree%2Fmaster%2Ftest "https://github.com/gpac/mp4box.js/tree/master/test")。

为了方便快速得到一个本地可运行的演示，这里准备了一个[演示项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhsiaosiyuan0%2Ffmp4-demo "https://github.com/hsiaosiyuan0/fmp4-demo")。在演示项目中，通过自定义的 Downloader 来对数据进行加载，加载后的数据将交给 mp4box 进行重新组装，组装完成后再加入到 Media Source 中传递给播放器。如果是要完成预加载的功能，只需要对 Downloader 按业务所需稍加修改就可以了。

结尾
--

本文从视频的常见参数开始，到一种不需要服务端额外配合的点播方式结束，介绍了 Web 环境下的视频点播功能所涉及的一些技术点。因为这方面涉及的内容很多，加上水平和时间的限制，所以暂时只能呈现这些内容。希望它们能起到一些帮助作用，同时也期待大家的宝贵意见和建议。

引用
--

*   [What is video bitrate and why it matters?](https://link.juejin.cn?target=https%3A%2F%2Ffilmora.wondershare.com%2Fvideo-editing-tips%2Fwhat-is-video-bitrate.html "https://filmora.wondershare.com/video-editing-tips/what-is-video-bitrate.html")
*   [What bitrate should I use when encoding my video](https://link.juejin.cn?target=https%3A%2F%2Fwww.ezs3.com%2Fpublic%2FWhat_bitrate_should_I_use_when_encoding_my_video_How_do_I_optimize_my_video_for_the_web.cfm "https://www.ezs3.com/public/What_bitrate_should_I_use_when_encoding_my_video_How_do_I_optimize_my_video_for_the_web.cfm")
*   [What are these 240p, 360p, 480p, 720p, 1080p units for videos](https://link.juejin.cn?target=https%3A%2F%2Fwww.quora.com%2FWhat-are-these-240p-360p-480p-720p-1080p-units-for-videos-Whats-the-basic-idea-behind-it "https://www.quora.com/What-are-these-240p-360p-480p-720p-1080p-units-for-videos-Whats-the-basic-idea-behind-it")
*   [An Introduction to Frame Rates, Video Resolutions, and the Rolling Shutter Effect](https://link.juejin.cn?target=https%3A%2F%2Fwww.borrowlenses.com%2Fblog%2Fintroduction-frame-rates-video-resolutions-rolling-shutter-effect%2F "https://www.borrowlenses.com/blog/introduction-frame-rates-video-resolutions-rolling-shutter-effect/")
*   [MDN - Media Source Extensions API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FMedia_Source_Extensions_API "https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API")
*   [MDN - MediaSource](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FMediaSource "https://developer.mozilla.org/en-US/docs/Web/API/MediaSource")
*   [Google Developers - Media Source Extensions](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fweb%2Ffundamentals%2Fmedia%2Fmse%2Fbasics "https://developers.google.com/web/fundamentals/media/mse/basics")
*   [Apple - HTTP Live Streaming](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fhttp_live_streaming "https://developer.apple.com/documentation/http_live_streaming")
*   [Youtube - Building a Media Player](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DCPFE34ngysU%26list%3DPLNYkxOF6rcID8S0kEBuQwRyev7RgilNZF%26index%3D4 "https://www.youtube.com/watch?v=CPFE34ngysU&list=PLNYkxOF6rcID8S0kEBuQwRyev7RgilNZF&index=4")
*   [The structure of an MPEG-DASH MPD](https://link.juejin.cn?target=https%3A%2F%2Fwww.brendanlong.com%2Fthe-structure-of-an-mpeg-dash-mpd.html "https://www.brendanlong.com/the-structure-of-an-mpeg-dash-mpd.html")
*   [What Is an M3U8 File](https://link.juejin.cn?target=https%3A%2F%2Fwww.lifewire.com%2Fm3u8-file-2621956 "https://www.lifewire.com/m3u8-file-2621956")
*   [MP4 File Format](https://link.juejin.cn?target=https%3A%2F%2Fopenmp4file.com%2Fformat.html "https://openmp4file.com/format.html")
*   [MPEG-4 Part 14](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMPEG-4_Part_14 "https://en.wikipedia.org/wiki/MPEG-4_Part_14")

> 本文发布自 [网易云音乐前端团队](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fx-orpheus "https://github.com/x-orpheus")，文章未经授权禁止任何形式的转载。我们一直在招人，如果你恰好准备换工作，又恰好喜欢云音乐，那就 [加入我们](mailto:grp.music-fe@corp.netease.com "mailto:grp.music-fe@corp.netease.com")！