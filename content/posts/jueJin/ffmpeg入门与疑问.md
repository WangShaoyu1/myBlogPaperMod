---
author: "音视频萌新"
title: "ffmpeg入门与疑问"
date: 2023-04-23
description: "ffmpeg简介FFmpeg是一款免费的、开源的跨平台音视频处理工具，旨在提供高质量、高速度的多媒体处理功能，FFmpeg设计以流式处理音视频。FFmpeg目前已成为业界公认的最强大、最全"
tags: ["前端","FFmpeg"]
ShowReadingTime: "阅读10分钟"
weight: 325
---
ffmpeg 简介
---------

FFmpeg 是一款免费的、开源的跨平台音视频处理工具，旨在提供高质量、高速度的多媒体处理功能，FFmpeg 设计以流式处理音视频。

FFmpeg 目前已成为业界公认的最强大、最全面的音视频处理工具之一，得到了广泛的应用。绝大多数的音视频相关应用和工具库，都直接或间接地引用了 FFmpeg。

FFmpeg 的开发始于2000年，最初由法国程序员 Fabrice Bellard 发起，后来有越来越多的开源贡献者参与。目前 FFmpeg 由一支由多名开发者组成的团队维护和开发。

ffmpeg 作者和团队
------------

Fabrice Bellard 是一位法国著名的计算机程序员，因创立FFmpeg、QEMU等项目而闻名业内。

他的个人介绍网站是 [bellard.org/。](https://link.juejin.cn?target=https%3A%2F%2Fbellard.org%2F%25E3%2580%2582 "https://bellard.org/%E3%80%82")

其中列举了他创建的多个项目。他兴趣广泛，涉足多个不同的领域，可以称为一位真正的编程大师。

ffmpeg 项目的分裂与合并
---------------

在2011年，FFmpeg项目发生了内部分歧，一些开发者选择离开FFmpeg项目并创建Libav项目。由于代码库的相似性以及两个项目之间的竞争，许多涉足音视频处理领域的人会对这两个项目感到困惑。

两个项目的差异导致社区对Libav的认可度降低，并且导致许多用户回到FFmpeg。

在2019年，Libav项目宣布正式终止开发和支持，并建议所有用户转向FFmpeg。

在分裂后的几年中，两个项目的代码已经发生了较大的差异，各自发展出了独立的特性和架构。因此，合并之后也加剧了 ffmpeg 的新旧版本差异。

ffmpeg 的功能与命令示例
---------------

shell

 代码解读

复制代码

`# 从视频中导出音频 ffmpeg -i input.mp4 output.mp3 # 截取音频片段 ffmpeg -i input.mp3 -ss 04:10 -t 16 output.mp3 # 截取视频片段 ffmpeg -i input.mp4 -ss 04:10 -t 16 -c copy -avoid_negative_ts make_zero output.mp4 # 将两个 flv 文件合并 ffmpeg -f concat -i input.txt -c copy xj.flv ## input.txt 中的内容 file 'xj1.flv' file 'xj2.flv' # 将本地视频以 rtmp 协议推流 ffmpeg -re -i ./demo.mp4 -c copy -f flv rtmp://publish.com/live/demo123456 # 将在线 flv 流保存到本地 ffmpeg -i http://demo.com/input.flv -c copy dump.flv # 在左上角0,0点添加水印 ffmpeg -y -i tmp.mp4 -i green.png -filter_complex 'overlay=x=0:y=0' output.mp4 # 使用华文行楷字体，64字号，红色字，在右上角写水印文字，main_w-text_w-10 就是视频宽度减文字宽度再减 10 ffmpeg -y -i source.mp4 -vf "drawtext=fontfile=STXINGKA.ttf: text='水印文字':x=main_w-text_w-10:y=10:fontsize=64:fontcolor=red:shadowy=2" output.mp4 # 将图片转为视频 ffmpeg -loop 1 -f image2 -i test2.png -vcodec libx264 -r 30 -t 3 test2.mp4 # 替换视频中的音频轨 ffmpeg -i input.mp4 -i trll.mp3 -map 0:v -map 1:a -c:v copy -shortest -y output.mp4 # 绿幕抠像后合并 ffmpeg -i jmfst.mp4 -i greentiger.mp4 -shortest -filter_complex "[1:v]chromakey=0x16ff0a:0.1:0.0[ckout];[0:v][ckout]overlay[out]" -map "[out]" -y output.mp4 # 基于 mask 抠像后合并 ffmpeg -i video.mp4 -i matte.mp4 -i background.mp4 -filter_complex '[1][0]scale2ref[mask][main];[main][mask]alphamerge[vid];[2:v][vid]overlay[out]' -map [out] complete.mp4`

ffmpeg 命令行参数的版本差异
-----------------

我们在网上查询如何使用 FFmpeg 命令行的时候，可能会发现同样的效果可能有不同的写法。

比如我们常见的 `-c:v copy -c:a copy` 中，-c:v 和 -c:a 都是新版本的写法，其对应的旧版本写法是 -vcodec 和 -acodec。

类似的新旧版本参数差异还有很多，例如：

*   `-frames:v` 和 `-vframes`：都表示要处理的视频帧数。`-frames:v`为新版写法，`-vframes`为旧版写法。
*   `-frames:a` 和 `-aframes`：都表示要处理的音频帧数。`-frames:a`为新版写法，`-aframes`为旧版写法。
*   `-ar` 和 `-sample_rate`：都用于设置音频采样率（即每秒钟采样次数）。`-ar`为新版写法，`-sample_rate`为旧版写法。
*   `-ac` 和 `-channels`：都用于设置音频通道数。`-ac`为新版写法，`-channels`为旧版写法。
*   `-f` 和 `-format`：都用于指定输出文件格式。`-f`为新版写法，`-format`为旧版写法。
*   `-t` 和 `-time_limit`：都用于设置处理时长限制。`-t`为新版写法，`-time_limit`为旧版写法。

虽然新旧版本的命令行参数选项存在差异，但它们的用途和作用都是相同的。若使用的是最新版的FFmpeg，建议尽可能使用新版写法以便保持兼容性。因为无法保证将来 FFmpeg 不会删除旧版本的参数。

ffmpeg 过滤器
----------

ffmpeg 过滤器官方文档 [ffmpeg.org/ffmpeg-filt…](https://link.juejin.cn?target=https%3A%2F%2Fffmpeg.org%2Fffmpeg-filters.html%25E3%2580%2582 "https://ffmpeg.org/ffmpeg-filters.html%E3%80%82") 使用 `ffmpeg -filters` 可以查看支持的所有滤镜。

ffmpeg 本身内置了大量的过滤器，一百多个音频过滤器和两百多个视频过滤器，还有各种第三方过滤器。

在FFmpeg中，filter可以理解为一种数据处理管道的概念。类似于Unix/Linux上的管道（pipe），它把输入的数据流经过一个或多个数据处理器（filter）进行转换和修改，最终生成指定的输出数据流。

FFmpeg中的filter主要用来对音视频媒体流进行处理和修改，可以实现许多常见的操作，如裁剪、旋转、缩放、文本叠加等。通过将多个不同的filter串联起来，就可以构建出复杂的数据处理流程，以实现更高级、更具体化的功能需求。

与Unix/Linux上的管道类似，在FFmpeg中，filter的基本工作原理是输入数据块被送入第一个filter，经过该filter的处理后产生输出，然后该输出作为下一个filter的输入继续处理，直到最后一个filter结束，输出被写入目标文件或者传递给其他数据处理器。这样形成了一条数据流水线，其中每个filter都代表着一种特定的数据处理操作。

总之，虽然FFmpeg中的filter不是严格意义上的管道，但可以认为其与管道具有很多类似的概念和实现方式，都是基于输入/输出的组合操作模型，可以方便地完成数据处理任务。

### \-vf 和 -filter\_complex 的区别

在FFmpeg中，`-vf`和`-filter_complex`都用来指定图像/视频处理过程中应用的filter，但它们之间存在着一些区别。

首先，`-vf`是简单filter链的缩写，只能够串接多个简单的、线性的video filters。这些filters会按顺序依次执行，并且每个filter只有一个输入和一个输出。例如：

css

 代码解读

复制代码

`ffmpeg -i input.mp4 -vf scale=1280:720,rotate=90,crop=1200:600:40:20 output.mp4`

上述命令中的`-vf`选项就串联了三个简单的filter，分别是scale（缩放）、rotate（旋转）和crop（裁剪），这些filter在处理时只能进行简单的线性操作，不能够实现较为复杂的操作需求。

而`-filter_complex`则更为强大，可以支持复杂的、非线性的filter图形结构。`-filter_complex`选项中的各个filter之间可以进行连接和交互，并且可以实现图像/视频的合成、拼接、混音等复杂操作。例如：

css

 代码解读

复制代码

`ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v]scale=640:360[v0];[1:v]scale=1280:720[v1];[v0][v1]overlay=40:20" output.mp4`

上述命令中的`-filter_complex`选项构建了一个复杂的filter图形结构，分别对两个输入视频进行了缩放操作，并使用overlay filter将两个视频拼接到一起。在这个过程中，各个filter之间可以随意交互和连接，从而实现了复杂的数据处理需求。

总之，`-vf`适用于简单的、线性的filter操作场景，而`-filter_complex`则更为强大灵活，适用于复杂的、非线性的filter操作场景。

### ffmpeg 过滤器中的 filterchain 和 filtergraph

ffmpeg过滤器中，filterchain 和 filtergraph 都是指在处理多个过滤器时的不同方式。

*   Filterchain是一种简单的线性排列过滤器的方法。它使用逗号将多个过滤器连接起来，例如：\[in\] filter1, filter2, filter3 \[out\]。图像或视频帧从输入（in）开始，依次通过每个过滤器，最终输出到输出（out）。Filterchain不能完成复杂的拓扑结构，无法实现多路输入流和多路输出流之间的交叉互联。
    
*   Filtergraph则更为灵活、强大，可以实现各种过滤器拓扑结构。它使用图形化的方式来描述所有过滤器之间的关系，对于复杂的媒体信息处理任务非常有效。在filtergraph中，以分号分隔的不同过滤器称为“ 点”，通过这些点之间的连线来表示它们之间的处理关系。一个filtergraph包含一个或多个输入端口和一个或多个输出端口，任何输入都可以送到任何过滤器进行处理，并且被处理后的结果也可以发往任何输出端口。
    

总的来说，filterchain和filtergraph都是ffmpeg过滤器语法中连接和组合多个过滤器的方式，而filtergraph可以处理更加复杂的拓扑结构，实现多路输入流和多路输出流之间的交叉互联，并且能够以更加直观、灵活的方式来描述所有过滤器之间的关系。

ffmpeg 流式处理和命令参数顺序
------------------

在FFmpeg中，通过管道（pipe）的方式，可以将一个命令的输出作为另一个命令的输入，从而实现对音视频数据的无缝处理。

在 FFmpeg 命令中，参数分为全局选项、输入文件选项和输出文件选项。全局选项对所有输入/输出文件都有效；输入文件选项仅影响特定的输入文件；输出文件选项则仅影响特定的输出文件。

一般情况下，全局选项应该放在最前面，紧跟着是输入文件选项，然后是输入文件 `-i` 参数，最后是输出文件选项和输出文件名。

### \-ss 参数与 -i 参数前与在 -i 参数后的差异

参考 [Seeking – FFmpeg](https://link.juejin.cn?target=https%3A%2F%2Ftrac.ffmpeg.org%2Fwiki%2FSeeking "https://trac.ffmpeg.org/wiki/Seeking")

当 `-ss` 参数放在 `-i` 前面时，FFmpeg 将在输入文件还没有被解码器解码之前尝试跳转到指定位置，这可能会导致精度误差，但是处理速度更快。

相反，当 `-ss` 放在 `-i` 后面时，FFmpeg 将首先解码输入文件，然后再跳转到指定的时间戳，这种方式可以提高跳转时间戳的精确性和准确性，因为此时 FFmpeg 已经知道了整个视频的帧率、关键帧等信息，但是处理时间会变得更长。

以生成视频缩略图为例。

ffmpeg 和 ffprobe 的区别
--------------------

FFmpeg 和 ffprobe 是由 FFmpeg 多媒体框架提供的两个独立工具，它们分别用于处理和分析媒体文件。下面是这两个工具之间的简要区别：

*   FFmpeg主要用于音频和视频处理。它可以执行许多操作，如转换格式、编码、解码、剪辑、过滤、复制等等。使用FFmpeg，您可以编写各种音频和视频处理任务的自定义脚本。
    
*   ffprobe是一种分析工具，用于检查媒体文件的元数据和技术详细信息。它可以提供有关视频、音频和字幕流的详细信息，例如编解码器、分辨率、帧率、比特率、采样率和持续时间等。您可以使用ffprobe来检查媒体文件的属性和是否符合要求，以及构建自定义媒体工作流程。
    

因此，FFmpeg和ffprobe的应用场景不同。如果您需要编辑、转换或处理音频或视频文件，可以使用FFmpeg。如果您需要检查媒体文件的详细信息或元数据（例如容器格式、编解码器、时基等），则需要使用ffprobe。