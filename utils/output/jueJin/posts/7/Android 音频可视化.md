---
author: ""
title: "Android 音频可视化"
date: 2020-09-17
description: "音频可视化，顾名思义就是将声音以视觉的方式呈现出来。如何将音频信号绘制出来？如何将声音的变化在视觉上清晰的表现出来，让视觉和听觉上的感受一致？这些在 Android 上如何实现？本文将针对这些问题做出解答，尽量对 Android 上的音频可视化实现做一个全面的介绍。 在这个流程…"
tags: ["数据可视化中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:168,comments:0,collects:176,views:10777,"
---
> 本文作者：熊鋆洋

前言
--

音频可视化，顾名思义就是将声音以视觉的方式呈现出来。如何将音频信号绘制出来？如何将声音的变化在视觉上清晰的表现出来，让视觉和听觉上的感受一致？这些在 Android 上如何实现？本文将针对这些问题做出解答，尽量对 Android 上的音频可视化实现做一个全面的介绍。

傅里叶变换
-----

Android 音频播放的一般流程是：

1.  播放器从本地音频文件或网络加载编码后的音频数据，解码为 pcm 数据写入 `AudioTrack`
2.  `AudioTrack` 将 pcm 数据写入 FIFO
3.  `AudioFlinger` 中的 `MixerThread` 通过 `AudioMixer` 读取 FIFO 中的数据进行混音后写入 HAL 输出设备进行播放

在这个流程中，直接体现音频特征，可用于可视化绘制的是 pcm 数据。但 pcm 表示各采样时间点上音频信号强度，看起来杂乱无章，难以体现听觉感知到的声音变化。pcm 数据仅可用来绘制体现音频信号平均强度变化的可视化动效，其他大部分动效需要使用对 pcm 数据做傅里叶变换后得到的体现各频率点上信号强度变化的频域数据来绘制。

这里简单回顾下傅里叶变换，它将信号从时域转换为频域，一般用于信号频谱分析，确定其成分。转换结果如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

pcm 数据是时间离散的，需要使用离散傅里叶变换（DFT），它将包含 N 个复数的序列 {xn}:\=x0,x1,...,xN−1\\{x\_n\\}:=x\_0, x\_1, ..., x\_{N-1}{xn​}:=x0​,x1​,...,xN−1​ 转换为另一个复数序列 {Xk}:\=X0,X1,...,XN−1\\{X\_k\\}:=X\_0, X\_1, ..., X\_{N-1}{Xk​}:=X0​,X1​,...,XN−1​，计算公式为：

Xk\=∑n\=0N−1xn⋅e−i2πknN\=∑n\=0N−1xn⋅(cos(2πknN)−i⋅sin(2πknN))X\_k=\\sum\_{n=0}^{N-1}x\_n \\cdot e^{-i2 \\pi {kn \\over N}}=\\sum\_{n=0}^{N-1}x\_n \\cdot (cos(2\\pi {kn \\over N})-i \\cdot sin(2\\pi {kn \\over N}))Xk​\=n\=0∑N−1​xn​⋅e−i2πNkn​\=n\=0∑N−1​xn​⋅(cos(2πNkn​)−i⋅sin(2πNkn​))

直接用上面公式计算长度为 N 的序列的 DFT，时间复杂度为 O(N2)O(N^2)O(N2)，速度较慢，实际应用中，一般会使用快速傅里叶变换（FFT），将时间复杂度降为 O(Nlog(N))O(Nlog(N))O(Nlog(N))。

计算公式看起来很复杂，但不懂也不会影响我们实现音频可视化，FFT 的计算可以使用已有的库，不需要自己来实现。但为了从 FFT 的计算结果得到最终用来绘制的数据，有必要了解以下DFT特性：

*   输入全部为实数时，输出结果满足共轭对称性：XN−k\=Xk∗X\_{N-k}=X\_k^\*XN−k​\=Xk∗​，因此一般实现只返回一半结果
*   如原始信号采样率为 fsf\_sfs​，序列长度为 N，输出频率分辨率为 fs/Nf\_s/Nfs​/N，第 k 个点的频率为 kfs/Nkf\_s/Nkfs​/N，可用于查找指定频率范围在结果中对应的位置
*   如一个频率对应输出的实部和虚部为 re 和 im，其模为 M\=re2+im2M=\\sqrt{re^2+im^2}M\=re2+im2​，原始信号振幅为 A\={M/NDC2M/NotherA=\\begin{cases} M/N & DC \\\\ 2M/N & other \\end{cases}A\={M/N2M/N​DCother​，可用于计算分贝和数据缩放

数据源
---

提供播放 pcm 数据的 FFT 计算结果的数据源有两种，一种是 Android 系统提供的 `Visualizer` 类，这种存在兼容性问题，因此我们引入了另一种自己实现的数据源。同时，我们实现了在不修改上层各动效的数据处理和绘制逻辑的基础上切换数据源，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### Android Visualizer

系统 `Visualizer` 提供了方便的 api 来获取播放音频的波形或 FFT 数据，一般使用方式是：

1.  用 audio session ID 创建 `Visualizer`对象，传 0 可获取混音后的可视化数据，传特定播放器或 `AudioTrack` 所使用的 audio session 的 ID，可获取它们所播放音频的可视化数据
2.  调 `setCaptureSize` 方法设置每次获取的数据大小，调 `setDataCaptureListener` 方法设置数据回调并指定获取数据频率（即回调频率）和数据类型（波形或 FFT）
3.  调 `setEnabled` 方法开始获取数据，不再需要时调 `release` 方法释放资源

更详细的 api 信息可查看[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fkotlin%2Fandroid%2Fmedia%2Faudiofx%2FVisualizer "https://developer.android.google.cn/reference/kotlin/android/media/audiofx/Visualizer")。

系统 `Visualizer` 输出的数据大小正比于音量，当音量为 0 时，输出也为 0，可视化效果会随音量变化。

使用系统 `Visualizer` 存在兼容性问题，在有些机型上会导致系统音效失效，如要在所有机型上都能无副作用地展示动效，需要实现自定义 `Visualizer`。

### 自定义 Visualizer

作为跟系统 `Visualizer` 功能一致的数据源，自定义 Visualizer 需具备两个功能：

*   获取 pcm 数据，计算 FFT
*   以指定频率和大小发送 FFT 数据

实现第一个功能首先要获取播放音频的 pcm 数据，这要求使用的播放器能够提供 pcm 数据，我们的播放器是自己实现的，能够满足这个要求。我们对播放器进行了扩展，增加了收集解码后的 pcm 数据计算 FFT 的功能。

由于不同音频采样率不同，而计算 FFT 时采用固定的窗口大小，导致 FFT 计算结果回调频率随播放音频改变，同时指定的数据大小可能跟计算结果的大小不同，因此要实现第二个功能，需要对计算结果做固定频率和采样等处理。

另外，我们的播放器在播放进程中运行，而实际使用 FFT 数据的动效页面运行于主进程中，所以还需要跨进程传输数据。

综上，自定义 Visualizer 的整体流程是：在播放进程 native 层中计算 FFT，通过 JNI 调用，把计算结果回调给Java 层，然后通过 AIDL 把 FFT 数据传递给主进程进行后续的数据处理和发送操作。如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

固定频率需要将可变的 FFT 计算结果回调频率转换为外部设置的 Visualizer 回调频率，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

根据所需数据发送时间间隔和 FFT 回调时间间隔差值的不同，我们采用两种不同的方式。

当时间间隔差值小于等于回调时间间隔时，每 t/Δtt/ \\Delta tt/Δt 次回调丢弃一次数据，其中 t 为 FFT 回调时间间隔，Δt\\Delta tΔt 为时间间隔差值，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

当时间间隔差值大于回调时间间隔时，每 t1/tt1/tt1/t 次回调发送一次数据，其中 t1 为所需数据发送时间间隔，t 为 FFT 回调时间间隔，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

采样就是当外部设置的数据大小小于 FFT 计算结果的数据大小时，对原始 FFT 数据以合适的间隔抽取数据，以满足设置的要求。

为了让自定义 Visualizer 返回数据的取值范围跟系统 `Visualizer` 一致，从而实现数据源无缝切换，我们需要对 FFT 数据进行缩放。这里就需要用到前面提到的模与振幅的计算了，解码所得 pcm 数据的取值范围为 \[-1, 1\]，所以原始信号振幅取值范围为 \[0, 1\]，即 2M/N2M/N2M/N 的取值范围为 \[0, 1\]（绘制时不会用到直流分量，这里不考虑）；而系统 `Visualizer` 返回的 FFT 数据是一个 `byte` 数组，实部和虚部的取值范围为 \[-128, 128\]，模的取值范围为 \[0,128×2\]\[0, 128 \\times \\sqrt2\]\[0,128×2​\]，那么 2M/N×128×22M/N \\times 128 \\times \\sqrt22M/N×128×2​ 的取值范围跟系统 `Visualizer` 输出 FFT 的模的取值范围一致。由于绘制不会用到相位信息，我们可以将用上述方式缩放后的值作为输出 FFT 数据的实部，并把虚部设为 0。

由于数据发送的频率较高，为了避免频繁创建对象导致内存抖动，我们采用对象池来保存数据数组对象，每次从对象池中获取所需大小的数组对象，填充采样数据后加入到队列中等待发送，数据消费完后将数组对象返回到对象池中。

数据处理
----

不同动效的具体数据处理方式不同，忽略细节上的差异，云音乐现有的动效中，除了宇宙尘埃和孤独星球，其他的处理流程基本一致，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

首先根据动效选择的频率范围计算所需的频率数据在 FFT 数组中的索引位置：

fr\=fs/N,start\=⌈MIN/fr⌉,end\=⌊MAX/fr⌋f\_r=f\_s/N, start=\\lceil MIN/f\_r \\rceil, end=\\lfloor MAX/f\_r \\rfloorfr​\=fs​/N,start\=⌈MIN/fr​⌉,end\=⌊MAX/fr​⌋

其中 fsf\_sfs​ 为采样率，N 为 FFT 窗口大小，frf\_rfr​ 为频率分辨率，MIN 为频率范围起始值，MAX 为频率范围结束值。

然后根据动效所需数据点数，对频率范围内的 FFT 数据进行采样或用一个 FFT 数据表示多个数据点。

然后计算分贝：

db\=20log⁡10Mdb=20\\log\_{10}Mdb\=20log10​M

其中 M 为 FFT 数据的模。

然后将分贝转化为高度：

h\=db/MAX\_DB⋅maxHeighth=db/MAX\\\_DB \\cdot maxHeighth\=db/MAX\_DB⋅maxHeight

其中 MAX\_DB 是预设的分贝最大值，maxHeight 是当前动效要求的最大高度。

最后对计算出的高度做数据上的平滑处理。

### 平滑

对最终用来绘制的数据做平滑处理，可以得到更柔和的曲线，达到更好的视觉效果，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

数据平滑算法有很多，我们综合考虑效果和计算复杂度选择了 Savitzky–Golay 滤波法，其计算方式如下，对应的窗口大小分别为5、7 和 9，可以按需选择不同的窗口大小。

Yi\=135(−3yi−2+12yi−1+17yi+12yi+1−3yi+2)Y\_i={1 \\over 35}(-3y\_{i-2}+12y\_{i-1}+17y\_i+12y\_{i+1}-3y\_{i+2})Yi​\=351​(−3yi−2​+12yi−1​+17yi​+12yi+1​−3yi+2​)

Yi\=121(−2yi−3+3yi−2+6yi−1+7yi+6yi+1+3yi+2−2yi+3)Y\_i={1 \\over 21}(-2y\_{i-3}+3y\_{i-2}+6y\_{i-1}+7y\_i+6y\_{i+1}+3y\_{i+2}-2y\_{i+3})Yi​\=211​(−2yi−3​+3yi−2​+6yi−1​+7yi​+6yi+1​+3yi+2​−2yi+3​)

Yi\=1231(−21yi−4+14yi−3+39yi−2+54yi−1+59yi+54yi+1+39yi+2+14yi+3−21yi+4)Y\_i={1 \\over 231}(-21y\_{i-4}+14y\_{i-3}+39y\_{i-2}+54y\_{i-1}+59y\_i+54y\_{i+1}+39y\_{i+2}+14y\_{i+3}-21y\_{i+4})Yi​\=2311​(−21yi−4​+14yi−3​+39yi−2​+54yi−1​+59yi​+54yi+1​+39yi+2​+14yi+3​−21yi+4​)

经过平滑处理后数据的变化如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### BufferQueue

有些动效的数据处理计算比较复杂，为提升并行性，减少主线程耗时，我们借鉴系统图形框架中 BufferQueue 的思想，实现了一个简单的承载动效绘制数据，连接数据处理和绘制的 BufferQueue，其工作过程如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

在使用 `BufferQueue` 的动效绘制类初始化时，根据需要创建一个合适大小的 `BufferQueue`，并启动用于执行数据处理的 `Looper` 线程。

数据处理部分对应 `BufferQueue` 的 `Producer`，当 FFT 数据到来时，通过绑定 `Looper` 线程的 `Handler` 将数据发送到 `Looper` 线程中执行数据处理。数据处理时，首先调用 `Producer` 的 `dequeue` 方法从 `BufferQueue` 中获取空闲的 `Buffer`，然后对 FFT 数据进行处理，生成需要的数据向 `Buffer` 中填充，最后调用 `Producer` 的 `queue` 方法将 `Buffer` 加入到 `BufferQueue` 中的 queued 队列中。

绘制部分对应 `BufferQueue` 的 `Consumer`，调用 `Producer` 的 `queue` 方法时会触发 `ConsumerListener` 的 `onBufferAvailable` 回调，在回调中通过绑定主线程的 `Handler` 切换到主线程消费 `Buffer`。首先调用 `Consumer` 的 `acquire` 方法从 `BufferQueue` 的 `queued` 队列中获取 `Buffer`，然后从 `Buffer` 中取出所需数据来绘制，最后调用 `Consumer` 的 `release` 方法将上次的 `Buffer` 返回给 `BufferQueue`。

绘制
--

绘制部分的主要工作是调用系统 `Canvas` API 将处理后的数据绘制成所需的效果，具体如何使用 API 绘制，随动效的不同而不同，这里不展开介绍。本节将从对绘制来说比较重要的体验和性能方面介绍一些动效绘制的优化经验。

由于 FFT 数据回调的时间间隔大于 16ms，如果只在数据到来时绘制，会产生视觉上的卡顿，为了得到更好的视觉效果，需要在两次回调之间加入过渡帧，以达到渐变的动画效果。实现方式是在两次数据到达的时间间隔内，以上次数据为起点，本次数据为终点，根据当前时间相对于数据到达时间的消逝时间计算当前的高度，不断重复绘制，如下图所示：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

性能优化有两大手段：batch 和 cache，在动效绘制时也可以使用这些手段。对于需要绘制多条线或多个点的动效，应该调用 `drawLines` 或 `drawPoints` 方法进行批处理，而不是循环调用 `drawLine` 或 `drawPoint` 方法，以减少执行时间。

结语
--

本文介绍了 Android 音频可视化涉及的背景知识和实现过程，并提供了一些问题解决方案和优化思路。本文专注于通用方案，不涉及特定动效的具体实现，希望读者能从中受到些许启发，实现自己的酷炫动效。

参考资料
----

*   [傅里叶变换](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFourier_transform "https://en.wikipedia.org/wiki/Fourier_transform")
*   [离散傅里叶变换](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFourier_transform "https://en.wikipedia.org/wiki/Fourier_transform")
*   [快速傅里叶变换](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFast_Fourier_transform "https://en.wikipedia.org/wiki/Fast_Fourier_transform")
*   [数据平滑](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSmoothing "https://en.wikipedia.org/wiki/Smoothing")
*   [Savitzky–Golay 滤波](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSavitzky%25E2%2580%2593Golay_filter "https://en.wikipedia.org/wiki/Savitzky%E2%80%93Golay_filter")
*   [Android BufferQueue](https://link.juejin.cn?target=https%3A%2F%2Fsource.android.google.cn%2Fdevices%2Fgraphics%23bufferqueue "https://source.android.google.cn/devices/graphics#bufferqueue")

> 本文发布自 [网易云音乐大前端团队](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fx-orpheus "https://github.com/x-orpheus")，文章未经授权禁止任何形式的转载。我们常年招收前端、iOS、Android，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！