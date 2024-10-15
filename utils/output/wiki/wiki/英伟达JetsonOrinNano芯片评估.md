---
author: "王宇"
title: "英伟达JetsonOrinNano芯片评估"
date: 十月09,2023
description: "99、其他"
tags: ["99、其他"]
ShowReadingTime: "12s"
weight: 110
---
*   1[1\. 概述](#id-英伟达JetsonOrinNano芯片评估-概述)
*   2[2\. jetson路线图](#id-英伟达JetsonOrinNano芯片评估-jetson路线图)
    *   2.1[2.1. 硬件路线图](#id-英伟达JetsonOrinNano芯片评估-硬件路线图)
    *   2.2[2.2. 软件路线图](#id-英伟达JetsonOrinNano芯片评估-软件路线图)
    *   2.3[2.3. Jetson软件架构](#id-英伟达JetsonOrinNano芯片评估-Jetson软件架构)
*   3[3\. JetPack SDK](#id-英伟达JetsonOrinNano芯片评估-JetPackSDK)
*   4[4\. 虚拟人](#id-英伟达JetsonOrinNano芯片评估-虚拟人)
*   5[5\. 结论](#id-英伟达JetsonOrinNano芯片评估-结论)
    *   5.1[5.1. 技术可行性](#id-英伟达JetsonOrinNano芯片评估-技术可行性)
    *   5.2[5.2. 补充说明](#id-英伟达JetsonOrinNano芯片评估-补充说明)

本文将从硬件、操作系统、应用开发（开发工具、框架、开发者社区）、编程语言等维度进行分析。

1\. 概述
======

jetson是边缘人工智能平台，专业开发人员使用 NVIDIA® Jetson™来创建跨所有行业的突破性人工智能产品，学生和爱好者则使用 NVIDIA® Jetson™ 进行实践人工智能学习和制作令人惊叹的项目。有点类似树莓派。Jetson 平台包括小型、节能的开发套件和生产模块，可为 NVIDIA CUDA-X™ 软件堆栈提供高性能加速。（NVIDIA CUDA-X依托 NVIDIA CUDA® 而构建，是多种库、工具和技术的集合；与仅使用 CPU 的替代产品相比，CUDA-X 可为人工智能 (AI)、高性能计算 (HPC) 等多个应用领域带来显著提高的性能。包含数学库、 并行算法、图像和视频库、 通信库、深度学习、合作伙伴库）。

Jetson分为开发者套件和生产模块。开发者套件根据配置又分为Jetson AGX Orin 开发者套件、Jetson Orin Nano 开发者套件、Jetson Nano 开发套件。生产模块分为Jetson AGX Orin Series、 Jetson Orin NX Series、 Jetson Orin Nano Series、 Jetson AGX Xavier Series、 Jetson Xavier NX Series、 Jetson TX2 Series。

Jetson Nano 是一款功能强大的小型计算机，专为支持入门级边缘 AI 应用程序和设备而设计。

NVIDIA JetPack™ SDK是一个软件开发库。完善的 NVIDIA JetPack™ SDK 包含用于深度学习、计算机视觉、图形、多媒体等方面的加速库。

生态例如**NVIDIA® Vision Programming Interface (VPI)** 是一个软件类库。提供了python和c的api接入。

jetson是平台，Jetson Nano 是开发套件，JetPack™ SDK是开发sdk。

[https://developer.nvidia.com/embedded-computing](https://developer.nvidia.com/embedded-computing)

2\. jetson路线图
=============

通过路线图看jetson的历史和发展方向。

![](https://developer.download.nvidia.com/embedded/images/jetson_roadmap/Jetson-Orin_roadmap-2023-08-11.png)

2.1. 硬件路线图
----------

![](https://developer.download.nvidia.cn/embedded/images/jetson_roadmap/Jetson_modules-Commercial_roadmap-2023-08-11.png)

2.2. 软件路线图
----------

![](https://developer.download.nvidia.com/embedded/images/jetson_roadmap/Jetson-JetPack_SW_Roadmap-2023-08-11.png)

通过jetpack提供的是基于linux的开发的。jetpack5是以linux5.10的内核的Ubuntu20.04为基础的。jetpack6是以linux5.15的内核开发的Ubuntu22.04为基础的。

2.3. Jetson软件架构
---------------

![](https://developer.nvidia.com/sites/default/files/akamai/embedded/images/SW_slide_2022-03-14.jpg)

3\. JetPack SDK
===============

NVIDIA JetPack SDK 是用于构建端到端加速 AI 应用程序的最全面的解决方案。JetPack 为 Nvidia Jetson 模块上的硬件加速 AI 边缘开发提供了完整的开发环境。

JetPack 包括带有引导加载程序的[Jetson Linux](https://developer.nvidia.com/embedded/jetson-linux)、Linux 内核、Ubuntu 桌面环境以及用于加速 GPU 计算、多媒体、图形和计算机视觉的一整套库。它还包括适用于主机和开发套件的示例、文档和开发工具，并支持更高级别的 SDK，例如用于流视频分析的 DeepStream、用于机器人技术的 Isaac 和用于对话式 AI 的 Riva。

etPack 为您的 AI 应用程序实现端到端加速，其中 NVIDIA TensorRT 和 cuDNN 用于加速 AI 推理，CUDA 用于加速通用计算，VPI 用于加速计算机视觉和图像处理，Jetson Linux API 用于加速多媒体，libArgus 和 V4l2 用于加速多媒体处理。加速相机处理。

JetPack 中还包含 NVIDIA 容器运行时，支持边缘的云原生技术和工作流程。通过容器化您的 AI 应用程序并使用云原生技术大规模管理它们，改变您开发和部署软件的体验。

[https://developer.nvidia.com/embedded/jetpack](https://developer.nvidia.com/embedded/jetpack)

4\. 虚拟人
=======

虚拟人主要分为两部分，一部分是语音模块sdk（主要功能是asr）和杭州虚拟人sdk（内置tts，tts走的是webapi，没有平台的限制。）

语音模块asr

科大讯飞需要提交商务合同定制。微软的支持的比较丰富，语言和平台。[https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/speech-sdk](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/speech-sdk)

目前杭州虚拟人公司提供Android、H5、IOS、macOS、win五种客户端，Linux需要商务定制。

Linux进行桌面开发，

1、生态封闭，大部分应用都需要定制开发，不能直接使用。特斯拉的车机系统是自主开发的，该系统比较封闭，无法下载外界的APP，也无法扩展应用。国内的厂商基本都是基于安卓，生态合作伙伴多，项目交付经验丰富。如果没有量的话，合作伙伴也不可能在上面投入很多资源。

2、开发人才比较少，会增加开发成本和招聘难度。开发框架和社区比较少，遇到问题很少找到资料，会增加开发周期。

5\. 结论
======

5.1. 技术可行性
----------

经过调测，语音模块、虚拟人模块，在技术上都可以基于英伟达Jetson Orin Nano芯片进行开发，技术上可行。

5.2. 补充说明
---------

应用新的英伟达芯片，第三方合作公司–科大讯飞、虚拟人公司，需要基于Ubuntu为我们定制SDK，涉及到一些定制费用与开发周期；

**定制费用方面**，其中：

*   科大讯飞sdk需要定制，一次性定制打包费用大约4w。
*   杭州虚拟人公司定制费用monica正在谈判。

**开发周期方面**，其中：

*   研发上由于在Ubuntu上进行桌面开发，开发人才比较少，会增加开发成本和招聘难度。（如果交给国外专业团队直接做集成，会大幅度减少难度）
*   开发框架和社区比较少，遇到问题很少找到资料，会增加开发周期。

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)