---
author: "职场007"
title: "Android手机投屏方案实现方式对比"
date: 2024-09-28
description: "今天的主要内容是介绍实现投屏的各种技术方式，主要介绍Miracast、scrcpy、以及Googlecast的实现方式以及优缺点局限性。"
tags: ["Android"]
ShowReadingTime: "阅读11分钟"
weight: 848
---
1.概述
----

手机投屏是目前市场上常见的一个功能，在车机娱乐场景，辅助驾驶场景比如苹果的carplay,VR 场景都很常见，目前市场上的投屏分为三类： **第一类:** 镜像模式，直接把手机上整个界面原封不动进行投射。这类投屏通常是对手机进行录屏，然后编码成视频流数据的方式给到接受端，接收端再解码播放，以此完成投屏功能。比如AirPlay的镜像模式、MiraCast、乐播投屏等； **第二类:** 推送模式，播视频的场景比较常见。即A把一个视频链接传给B，B自己进行播放，后学A可以传输一些简单控制指令。比如DLNA协议等； **第三类：** 基于特殊协议投射部分应用或部分功能，车载领域居多。比如苹果的CarPlay、华为HiCar、百度CarLife等。

> 这里还有一种投屏方式比较新颖，将手机上的画面投到车机上，然后手机上可以操作自己的功能，车机上也可以操作手机的功能，而且两者互不干涉，具体可以参考蔚来手机和车机的投屏：[蔚来手机的投屏视频](https://link.juejin.cn?target=https%3A%2F%2Fmbd.baidu.com%2Fnewspage%2Fdata%2Fvideolanding%3Fnid%3Dsv_4539233790752174062%26sourceFrom%3Dqmj "https://mbd.baidu.com/newspage/data/videolanding?nid=sv_4539233790752174062&sourceFrom=qmj") 今天的主要内容是介绍实现投屏的各种技术方式，主要介绍Miracast、scrcpy、以及Google cast的实现方式以及优缺点局限性。

2.术语解释
------

### 2.1 miracast

Miracast是一种以WiFi直连为基础的无线显示标准，它允许用户通过无线方式分享视频画面。这种技术支持用户将智能手机、平板电脑、笔记本电脑等设备上的内容投射到大屏幕电视或其他显示设备上，而无需使用线缆连接。

### 2.2 scrcpy

Scrcpy是一种开源的命令行工具，允许用户通过USB数据线或Android ADB（Android调试桥）来控制他们的Android设备，包括手机和平板电脑。使用Scrcpy，用户可以在电脑上实时查看和控制他们的Android设备，就像使用一个远程屏幕一样。 2.3 DLNA投屏 DLNA投屏是一种通过网络将多媒体内容从一台设备传输到另一台设备的技术。它允许用户将智能手机、平板电脑或电脑上的视频、音频和图片等内容投射到支持DLNA的电视、音响系统或其他显示设备上。DLNA投屏基于设备之间的WiFi连接，无需额外的物理连接或设置，使用户能够轻松地将手机上的媒体内容投屏到大屏幕上并实现双向控制。

### 2.4 Wifi Direct

WiFi Direct是一种允许设备通过WiFi直接相互连接的技术，无需通过路由器或中继点。这种技术使得设备之间的连接更加直接和便捷，常用于文件共享、打印服务和Miracast投屏等场景。

### 2.5 app\_process

是Android原生的一个可执行程序，位于/system/bin目录下，zygote进程便是由这个执行文件启动的。

3.技术实现对比
--------

### 3.1 Miracast

#### 3.1.1 Miracast介绍

Miracast是一种无线技术，用于将屏幕无线连接到我们的计算机。它是由WiFi联盟制定，以WiFi-Direct、IEEE802.11为无线传输标准，允许手机向电视或其他接收设备进行无线投送视频、图片。和Miracast类似的投屏协议，还有Airplay、DLNA、chromecast等，Miracast是点对点网络，用于类似蓝牙的方式（比蓝牙更高效）无线发送由Wi-Fi Direct连接组成的截屏视频。大多数最新一代的设备（例如笔记本电脑、智能电视和智能手机）都可以支持该技术，Miracast还支持高达1080p（全高清）的分辨率和5.1环绕声。它还支持4k分辨率。通过无线连接，视频数据以H.264格式发送，这是当今最常见的高清视频编码标准。Miracast在诞生之初就以跨平台标准而设计，这意味着它能在多种平台间使用。

#### 3.1.2 Miracast原理

Miracast基于WiFi P2P，或TDLS，或Infrastructure进行设备发现，位于OSI模型的数据链路层。而媒体传输控制使用RTSP协议，还有远程I2C数据读写、UIBC用户输入反向信道、HDCP高带宽内容保护等，位于OSI模型的TCP/IP传输控制层与网络层。其中，由音视频数据封装成PES包，经过HDCP内容保护，再封装成TS包，接着封装成RTP包，使用RTSP协议发送。如下图所示 ![在这里插入图片描述](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2fd1372280414e3b918adbfdd09fdb2f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IGM5Zy6MDA3:q75.awebp?rk3s=f64ab15b&x-expires=1728118869&x-signature=U%2Fosf7AkEdcCb2t5v0suWj2uytc%3D)

#### 3.1.3 Miracast优缺点分析

优点：投屏画质清晰，兼容性好。Android手机集成了Mircast投屏，如果想要二次开发可以从AOSP源码中找到对应的实现，网上的开发文档多 缺点： Miracast正常工作时，Wi-Fi工作在P2P模式，源端与接收端建立一对一的联接。也即当一个设备与一个接收端建立连接后，其它设备不可见该接收端，也就不能投屏。只有当该设备退出连接后，其它设备才能投屏。所以无法实现抢占功能。Miracast底层封装了UDP传输协议，没有严谨的问答机制。所以在实际使用过程中，当遇到干扰时，容易造成丢帧花屏现象。而传输过程中，一旦出现花屏，给客人的感觉就非常糟糕，现在市面上，哪些无线投屏设备之所以经常出现花屏、马赛克就是这个原因。另外，Miracast是操作系统供应商提供，一般都是在安卓系统上使用，但是安卓协议导致手机投屏没有声音，所以大多数用户在安卓手机无线投屏的时候，需要开启蓝牙，以便于把声音投屏过去。如果我们需要使用Mircast,需要对ROM进行二次开发。下面是一个投屏技术公司的关于Miracast的技术文档，描述了目前Mircast存在的问题。[Mircast目前存在的问题](https://link.juejin.cn?target=https%3A%2F%2Fwww.bijienetworks.com%2Fnews%2Ftechnology-blog%2Fmiracast-solution "https://www.bijienetworks.com/news/technology-blog/miracast-solution") 若要实现双向控制，需要加一个控制的通道和事件转换和注入

### 3.2 Scrcpy

#### 3.2.1 scrcpy 介绍

scrcpy通过adb调试的方式来将手机屏幕投到电脑上，并可以通过电脑控制Android设备。它可以通过USB连接，也可以通过Wifi连接（类似于隔空投屏),使用adb的无线连接后投屏，而且不需要任何root权限，不需要在手机里安装任何程序。scrcpy同时适用于GNU / Linux，Windows和macOS。Scrcpy 显示的每帧画面的大小达到1920x1080或者更高，帧率在30～60fps,延迟很低（大约35~70ms),启动快，第一帧画面显示出来的时间大约为1秒，并且不需要安装任何apk。并且代码完全开源，源码地址：[github.com/Genymobile/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGenymobile%2Fscrcpy.git "https://github.com/Genymobile/scrcpy.git")

#### 3.2.2 scrcpy的实现原理

Scrcpy的基本原理是通过ADB（Android Debug Bridge）将电脑和手机连接到一起后，推送一个jar文件到手机/data/local/tmp的目录下，然后通过adb shell 执行app\_process 程序将jar文件运行起来，这个jar文件相当于是手机上运行的一个服务器，它的作用是处理来自电脑端的的数据请求。它的免root原理主要基于两个关键点：

1.  利用AIDL (Android Interface Definition Language)：Scrcpy通过ADB（Android Debug Bridge）连接手机，AIDL允许非系统应用（如scrcpy）与系统服务交互。尽管root可以访问更多的底层功能，但是像显示屏幕这样的操作通常是安全的，并且无需获得root权限。
2.  屏幕录制协议：Scrcpy设计了一个简单的UDP（User Datagram Protocol）服务器，在手机上运行，这个服务器只处理来自客户端（如电脑上的scrcpy软件）的数据请求，而不是系统级别的控制命令。这种方式避免了直接修改系统的文件系统或设置。 简单总结scrcpy的原理就是电脑端和手机端建立连接后通过3个socke通道分别传输音频，录频，控制信号去实现手机和电脑的数据共享，录屏和音频都可以通过aidl和系统的服务交互拿到对应的显示屏ID然后创建虚拟屏录制，然后再编码给到客户端(电脑端)解码显示。控制指令通过socket传输到手机端后，通过手机端的服务(shell 通过app\_process启动的那个程序) 反射调用Android的事件注入接口实现的。下面是scrcpy的源码中关于事件注入的部分。 ![在这里插入图片描述](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4a19eff4242e4051899662cb5fbb103e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IGM5Zy6MDA3:q75.awebp?rk3s=f64ab15b&x-expires=1728118869&x-signature=pWgvpghHYkY37KMPSwLPKtXoCwM%3D)

#### 3.2.3 scrcpy的优缺点分析

优点：Scrcpy的优点是显示的画质好，延迟低(大约3570ms)，帧率3060fps，非常流畅,而且代码完全开源并有很详细的文档，并且不需要安装任何apk和root权限。能自定义控制的行为，比如显示音频和视频，只播放音频，只显示视频，只投屏(不接受电脑端的控制，类似于投屏中的镜像) 缺点：需要用户打开开发者模式中的USB调试模式，否则很多的操作都无法进行了。这点会导致产品无法用于正式的生产环境中，因为用户一般都不会打开开发者选项中的USB调试模式。如果通过修改源码的方式，则无法实现事件注入的功能，因为事件注入需要依赖adb shell。

### 3.3 Google cast

#### 3.3.1 Google cast 介绍

Google Cast类似于DLNA，AirPlayer，Miracast，就是一种投屏技术。Google Cast的作用在于把小屏幕（诸如手机、平板、笔记本）的内容通过无线（WIFI）方式发送到大屏设备（google TV、chromeCast）进行播放。Google Cast所做的便在于基于不同的平台提供提供为应用开支这种功能的SDK，这些平台即有发送端的也有接收端的，发送端的有IOS、android、chrome浏览器，接收端的有google TV, chromeCast等，可以说这一套解决方案是比较大而全的（就其涵盖的平台）。

#### 3.3.2 Google cast 的实现原理

发送端 app（sender app）使用 SDK，将需要播放的媒体的信息发送到 Google 的服务器，服务器再通知接收端播放（所以发送端和接收端必须都可以访问 Google 的服务器才行）。接收端运行的是一个浏览器，它会根据发送端的app ID和媒体信息，去载入对应的一个网页，这个网页（receiver app）也是由发送端 app 的开发者提供的，的将会负责播放相应的媒体内容。即使接收端是 Chromecast Audio 之类只能播放音频的硬件，这个网页也是会载入并渲染的。Google Cast 和 DLNA 或者苹果的 AirPlay 不同之处，一是依赖 Google 的服务器，也就是说必须连接到 Internet 才可以用，如果只有一个局域网是不行的。二是前两个的接收端播放器接收端本身提供的，开发者只需要提供要播放的内容就可以，但是 Google Cast 则是需要提供自己的receiver app，这样的好处是开发者可以高度定制（比如可以定制UI，或者加入弹幕、歌词滚动、音乐可视化之类复杂功能），虽然接收端往往运行的并不是Android这样的开放操作系统，但是因为receiver app的本质是网页，所以开发难度并不高。

#### 3.3.3 优缺点分析

优点：就是高度可定制，有官方成熟的SDK可接入，从宣传视频中看到手机可以投屏到大屏后，然后就可以随意操作其他应用而不会影响到大屏的显示内容了。 缺点：平台依赖性强，必须可以访问Google服务器，而由于国情的原因，必须可访问Google服务器这个缺点就可以宣告这个方案不合适了

总结
--

本文主要介绍了各种Android手机投屏的实现方式以及优缺点，手机投屏经常会涉及到投屏端和接收端端相互操作以及音频的播放。所以在建立了投屏需要建立好几个连接通道，分别传输音频、控制指令和录屏的视频流。scrcpy就是这样实现的，如果我们能获取到权限，目前决定scrcpy是最好的投屏实现方式。由于没有权限，现在的大多数控制都是通过Android手机的无障碍模式实现的。这就是我对手机投屏的一些调研总结，希望能帮到有需要的读者