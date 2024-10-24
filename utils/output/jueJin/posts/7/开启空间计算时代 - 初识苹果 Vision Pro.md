---
author: "网易云音乐技术团队"
title: "开启空间计算时代 - 初识苹果 Vision Pro"
date: 2024-02-02
description: "本文主要介绍苹果最新发布的Vision Pro。基于云音乐应用本身的特性，给出的一些想法和可供参考的探索方向。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读21分钟"
weight: 1
selfDefined:"likes:34,comments:5,collects:15,views:8661,"
---
> 本文作者：徐凯斌、王维恒

![](/images/jueJin/30d4a1252d9747a.png)

本文预览
----

1、苹果首款头显设备 Vision Pro 的背景和基础概念介绍，走入空间计算时代；

2、详细解读设备的硬件组成和空间设计的四个原则，揭示其独特之处；

3、展示「云音乐」App 在模拟器和真机上的运行情况；

4、苹果上海 Vision Pro 开发者实验室体验真机，行业内早期真机体验分享；

5、「云音乐」App 的落地畅想；

背景
--

![](/images/jueJin/4fa818a94c9c45e.png)

苹果于 WWDC23 发布了首款头显 Vision Pro，一台搭载了全球首创的空间操作系统 VisionOS 的革命性的空间计算设备，具备多个摄像头，用户用手势、眼睛或者语音就可操作控制，可以用来工作、娱乐、沟通的新一代电子产品。2023 年 7 月，苹果正式开放 Vision Pro 头显开发套件的申请通道，以借出设备的形式为开发者提供服务，并在 2024 年 2 月 2 日在美国正式上市。笔者收到上海 Apple Vision Pro 开发者实验室的邀请，线下体验了 Vision Pro 设备，并适配运行了「网易云音乐」应用。

功能解读
----

### 全方位的沉浸式体验

Apple Vision Pro 提供了一幅无边的空间画布，供开发者探索、试验和畅玩，让大家可以自由地尽情重新构想 3D 体验。用户可以在与周围环境保持联系的同时与不同的 App 进行交互，也可以完全沉浸在 App 创造的世界中。用户体验将十分的流畅：首先创建一个窗口，引入 3D 内容，转换为能够完全令人沉浸其中的场景，然后回到其他开发工作之中。

选择权在你手上，一切要从 VisionOS 中的空间计算构建块开始。

![](/images/jueJin/94a5ea23c137401.png)

Apple Vision Pro 官方介绍影片中文版请见 [链接](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Rs4y1i7MD%2F "https://www.bilibili.com/video/BV1Rs4y1i7MD/")。

#### 窗口（Windows）

你可以在 VisionOS App 中创建一个或多个窗口。它们使用 SwiftUI 构建，并包含传统的视图和控件（平面化的展示），开发者可以通过添加 3D 内容来添加深度，以丰富用户的体验。

![](/images/jueJin/03fd991efb97483.png)

#### 空间容器（Volumes）

使用 3D 空间容器为 App 添加深度。空间容器是 SwiftUI 场景，可以使用 RealityKit 或 Unity 展示 3D 内容，从而打造可在共享空间或 App 的全空间中从任意角度查看的体验。

![](/images/jueJin/21707dcf3bec47e.png)

#### 空间（Spaces）

默认情况下，App 启动时会进入共享空间（Shared Space），在其中这些 App 并排展示，就像 Mac 桌面上的多个 App 一样。App 可以使用窗口和空间容器来显示内容，用户可以根据需要调整这些元素的位置。为了打造更能令人沉浸其中的体验，App 可以打开一个专用的全空间（Full Space），在其中只显示这个 App 的内容。在全空间中，App 可以使用窗口和空间容器创建无边界的 3D 内容，打开通往一个不同世界的入口，甚至可以让用户完全沉浸在某个环境中。

![](/images/jueJin/a72a020d79b24c8.png)

### 概念解读

**AR（增强现实）**：眼睛镜片是透明的，可以直接看到外部真实世界；

*   通过数字元素叠加来呈现现实世界（物理世界）的视图。

**MR（混合现实）**：既可以看到外部真实世界，也可以看到纯虚拟世界，偏向硬件的描述；

*   完全沉浸式的数字环境。

**VR（虚拟现实**）：眼睛镜片不是透明的，不可以直接看到外部真实世界；

*   现实世界（物理世界）的视图，具有数字元素的叠加，其中物理元素和数字元素可以交互。

**XR（扩展现实）**：AR + MR + VR 都属于 XR；和 MR 相比较，为偏向软件的描述，也可称 XR SDK；

*   一个涵盖所有这些不同技术的总称，包括 AR、MR 和 VR。

![](/images/jueJin/3f6375b4e0f345b.png)

#### 共享模式（Shared Space）- AR

也称为透视模式（Passthrough）。光照完全由系统托管，系统会自动探测环境光照信息和应用做融合。3D 内容都使用苹果自研的 RealityKit 引擎渲染。所以该模式下 Unity 的原始资产均需要被转换为 Realitykit 支持的资产。Unity 官方提供了配套工具可以方便的完成转换：PolySpatial。

#### 全沉浸模式（Full Space）- VR

光照系统由场景决定，可按需定制。在此模式下，其它引擎不能使用系统的 2D UI，因为需要引擎支持系统窗口这种特殊材质。3D 场景直接使用 Unity 引擎渲染（无需资产翻译）。

#### 总结

Vision Pro 实际支持 AR、VR、MR ，也可以简单的理解为是一台 支持 XR 的 MR 设备。

### 硬件组成部分

#### 正面

![](/images/jueJin/15261c8830f24fc.png)

一片独特的三维成型玻璃与铝合金框架，轻轻弯曲以包裹脸部。可在外置屏幕上模拟用户眼部画面。这块弧形屏幕，传感器收集到的用户眼部画面实时渲染出实景一般的图像呈现在屏幕上，让人有看穿屏幕的错觉。苹果将其称为 EyeSight。

![](/images/jueJin/cdd10450589a40a.png)

#### 相机和传感器

![](/images/jueJin/4266b06a39ea42d.png)

一系列先进的摄像头和传感器协同工作，清楚地看到世界、了解周边环境并检测手部输入。一对高分辨率摄像头每秒向显示器传输超过 **10 亿像素**，因此您可以清楚地看到周围的世界。该系统还有助于提供**精确的头部和手部跟踪**以及**实时 3D 映射**，同时从各种位置理解您的手势。

#### 音频带

![](/images/jueJin/4f9a5cfcb3ee43d.png)

扬声器靠近耳朵，提供与真实世界的声音无缝融合的丰富**空间音频**。

#### 头带

![](/images/jueJin/d1b6ec6da47d463.png)

头带提供缓冲、透气性和弹性。通过旋钮根据自己的头部精确调整 Vision Pro；头带采用 3D 针织，形成独特的罗纹结构，提供缓冲、透气性和弹性。

#### 显示器

![](/images/jueJin/b2bad4088bdd424.png)

一对定制的微型 OLED 显示器为**每只眼睛提供比 4K 电视更多的像素**，定制的微型 OLED 显示系统具有 2300 万像素，提供令人惊叹的分辨率和色彩。专门设计的三元素镜头营造出无处不在的显示屏感觉。

#### 遮光罩

![](/images/jueJin/07177b5c84844a9.png)

磁吸式遮光罩轻柔地贴合脸部，提供精确贴合，同时阻挡杂散光。

#### 表冠旋钮

![](/images/jueJin/042281ba6fec4da.png)

按下数码表冠调出主视图，然后转动它来控制使用环境时的沉浸感。就能从以假乱真的**外部世界（AR）切换到沉浸的虚拟空间（VR）**。

![](/images/jueJin/409fa7ffa4a04cc.png)

#### 顶部按钮

![](/images/jueJin/b275993504b84a9.png)

按下顶部按钮即可即时拍摄空间视频和空间照片。

#### 针对近视的镜片

![](/images/jueJin/64dfee02e80b460.png)

蔡司光学插拔式镜片可根据视力进行定制，磁性附着在镜片上以实现精确观察和眼动追踪。

#### 外接电池

![](/images/jueJin/76efecb4f1db4a8.png)

外接电池支持长达 2 小时的使用，连接电源时，支持全天使用。另一侧则是类似的旋转接口的开发专用接口。

#### 整体结构

![](/images/jueJin/37092cdb3765487.png)

铝壳电池可以放入口袋中作为便携式电源。它使用编织电缆进行连接，常规使用续航可达 2-3 小时。

### 更多组成部分

#### 眼动追踪

![](/images/jueJin/23bc183650ef4f6.png)

由LED和红外摄像头组成的高性能眼动追踪系统将不可见光图案投射到每只眼睛上。这个先进的系统提供超精确的输入，无需您握住任何控制器，因此您只需看一下就可以准确地选择元素。Vision Pro可以在**用户实际点击之前预测他们的点击操作**。因为在用户准备点击之前，瞳孔的反应已经显示出大脑的“点击”动作了。一旦大脑的动作被发现，即可被设备识别。

![](/images/jueJin/885a5f6ff85c496.png)

#### 双芯片

![](/images/jueJin/505e96cfce8742e.png)

M2 芯片同时运行 VisionOS，执行先进的计算机视觉算法；R1 芯片专门用于处理来自摄像头、传感器和麦克风的输入，并在 **12 毫秒**内将图像流式传输到显示器（比眨眼速度还要快 **8 倍**）。

#### 总结

Vision Pro 中放入了 **2** 块芯片、**5** 个传感器（包括 **2** 个景深相机）、 **6** 个麦克风、**8** 个高清摄像头、**4** 个红外摄像头、**1** 个激光雷达和 **1** 圈 LED，整个头显重量达到 **450 克**，成为限制用户使用时长的一个重要因素。

设计原则
----

Apple VisionOS 搭载全新的 3D 界面，让数字内容看起来、感觉上就像在用户的真实世界存在，透过自然光线和阴影的变化来帮助用户理解比例与距离。Apple Vision Pro 和 VisionOS 既强大又独特的功能，来设计全新的 App 并为空间计算重塑现有 App 的体验。

### 基本空间设计原则（空间）

[developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2023%2F10072%2F "https://developer.apple.com/videos/play/wwdc2023/10072/")

Spatial design 是 VisionOS 的设计基础，它为用户创造了全新的、完整的基于空间的操作体验，同时保持了和 iPhone 相似的基本操作习惯，保持了苹果产品一贯的简单易用。

![](/images/jueJin/58fe566d4bde456.png)

![](/images/jueJin/5e77a821776c466.png)

这是关于空间设计原则的讲座，由 Apple Design 团队的 Nathan Gitter 和 Amy DeDonato 主讲。以下是主要内容的总结：

*   **设计空间操作系统**：这种操作系统可以将周围的世界变成无限的画布，用于创建新的应用程序和游戏。通过深度、规模、自然输入和空间音频，可以创造出以前无法实现的体验。
*   **保持应用程序的熟悉性**：尽管有许多新的可能性，但仍需要与用户熟悉的元素保持平衡。例如，侧边栏、标签和搜索字段等常见元素可以帮助用户找到他们正在寻找的音乐。
*   **人性化设计**：设计应考虑用户的视野和可能的移动方式。例如，将最重要的内容放在中心，使用景观布局，以及考虑人的舒适姿势等。
*   **利用空间和尺度**：设计应充分利用空间，并使用深度和规模来优化体验。例如，将窗口设计得足够大，以适应人们的视野，但又足够小，以避免阻挡过多的视线。
*   **创造沉浸式体验**：沉浸式体验可以超越窗口，改变周围的世界。这种体验可以根据用户在体验中的位置，流畅地在不同的沉浸状态之间过渡。
*   **保持平台的真实性**：最好的应用程序是丰富的、沉浸式的体验，利用了人们的空间。应用程序不应该是快速跳入一分钟的事情，而应该是值得、引人入胜、独特的体验。

**总的来说，这个讲座强调了在设计空间应用程序时，需要考虑的一些关键原则，包括****保持熟悉性、以人为中心的设计、利用空间和尺度、创造沉浸式体验，以及保持平台的真实性****。**

### 空间用户界面设计原则（空间 UI）

[developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2023%2F10076%2F "https://developer.apple.com/videos/play/wwdc2023/10076/")

了解如何为空间计算应用程序设计出色的界面。基于屏幕的知识如何轻松转化为为 VisionOS 创造出色的体验。探索 UI 组件、材料和排版指南，了解如何设计熟悉、清晰且易于使用的体验。

![](/images/jueJin/88289ee15e204f9.png)

![](/images/jueJin/f2c92c899e9c462.png)

内容主要是介绍如何设计空间用户界面：

*   Miquel Estany Rodriguez 和 Lorena Pazmino，来自 Apple Design 团队的两位成员，介绍了如何设计空间用户界面。他们构建了一种视觉语言，既保持了与现有平台的一致性和熟悉感，又发展了某些元素以适应沉浸式和空间体验。
    
*   首先讨论了**创建应用图标和界面的 UI 基础和设计原则**，这些图标和界面在环境中清晰可见且易于使用。然后，他们讨论了如何创建既符合人体工程学又易于定位的布局的关键概念和最佳实践。最后，他们展示了如何将应用从屏幕转换到空间，详细介绍了所有系统组件，其中一些你熟悉，一些则完全是新的。
    
*   详细解释了**如何设计出色的图标，如何使用材料，以及如何优化 3D 内容的视觉质量和性能**。它提供了一些关于如何创建 3D 效果，如何预览 3D 模型，以及如何使用新工具如 Reality Composer Pro 和 RealityKit Treace 来检查和优化内容的建议。
    
*   还详细讨论了如何使用空间输入设计，**如何设置应用的核心结构，如何使用窗口、标签栏和侧边栏，以及如何使用新的内容呈现方式**。最后，探讨了模态性，包括菜单、弹出窗口和表单。
    

总的来说，这是一个非常详细的空间用户界面设计指南，为设计师和开发者提供了一系列的工具和技巧来创建和优化他们的空间体验。

### 沉浸式声音设计原则（空间音频）

[developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2023%2F10271 "https://developer.apple.com/videos/play/wwdc2023/10271")

了解如何使用声音来增强 VisionOS 应用程序和游戏的体验。了解 Apple 设计师如何选择声音并构建音景来打造质感十足的沉浸式体验。我们将分享当您在空间上放置音频提示、改变重复的声音以及在应用程序中构建声音愉悦的时刻时，如何通过声音丰富应用程序中的基本交互。

![](/images/jueJin/d7f1a491b61b4ed.png)

![](/images/jueJin/ab8575c04bf84a7.png)

这是关于探索沉浸式声音设计的讲座，由设计团队的 Danielle Price 主讲。以下是主要内容的总结：

*   **空间音频的应用**：我们经常使用空间音频来导航世界，例如通过声音的方向和音量来定位 iPhone 的位置。
*   **空间音频的工作原理**：设备可以适应不同的空间，并添加你的空间的混响，使事物听起来像是真的在房间里。空间音频源会根据它们的位置，听起来像是更近或更远。
*   **设计 UI 和沉浸式应用的声音**：通过为每个交互添加微妙的声音，我们可以帮助用户产生熟悉感和信心。例如，虛拟键盘的每个按键都来自键盘前方的位置。
*   **设计 UI 声音**：我们希望 UI 的声音与系统的其他声音相匹配，同时突出深度感。好的 UI 声音应该是微妙的，提供足够的反馈以提供帮助。
*   **使用声音设计更沉浸式的体验**：例如，我们的环境，Mount Hood，是系统中的全面沉浸式体验。每个地方都有明暗两个版本，都有匹配的真实空问声音景观。
*   **设计、录制和混合这些体验的声音**：我们可以自由地创造和策划最好的现实，使应用程序的声音以最好的方式补充其视觉效果。
*   **创建现实声音景观**：我们使用了不同的麦克风来录制环境音，以捕捉一个地方周围的空气声音。然后，我们使用高灵敏度的定向麦克风来捕捉我们正在寻找的特定声音。
*   **在环境中放置音频对象**：我们可以从真实生活经验中获取灵感。当我们走出去时，许多不同类型的动物会从不同的位置发出声音，它们都层叠在一起形成一个声音景观。我们的任务是以正确的距离和位置重新创建这个声音。

总的来说，这个讲座强调了在设计沉浸式声音体验时，需要考虑的一些关键原则，包括空间音频的应用，设计 UI 和沉浸式应用的声音，设计 UI 声音，使用声音设计更沉浸式的体验，设计、录制和混合这些体验的声音，以及在环境中放置音频对象。

### 空间输入设计原则（空间交互 - 全新的输入系统）

[developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2023%2F10073%2F "https://developer.apple.com/videos/play/wwdc2023/10073/")

了解如何为眼睛和手设计出色的交互。我们将分享空间输入的设计原则，探索输入法的最佳实践，并帮助您创造舒适、直观和令人满意的空间体验。

![](/images/jueJin/f34f6e771b5d4ce.png)

![](/images/jueJin/1ed8f044277c471.png)

上述内容主要是关于在数字界面交互中手势和眼睛的作用。以下是主要的要点：

*   **手势交互**：手势是主要的交互方式，可以通过捏、拖动等操作进行交互。UI 反馈应继续手部的运动，以增强交互的连贯性。在设计交互时，应使用用户熟悉的模式，并确保手势的响应符合用户的预期。
*   **自定义手势**：对于无法用标准手势表达的行为，可以定义自定义手势。自定义手势应易于理解和执行，与系统集合的标准手势明显不同，且用户能够在不感到疲芳的情況下连续重复。
*   **眼部定向**：眼部定向与手势相结合，可以创建精确和满意的交互。这使得交互更精细和满足。
*   **直接触摸**：我们支持使用指尖直接触摸和交互。在设计直接交互时，我们要考虑到长时间悬空的手会感到疲劳，因此需要提供充分的反馈以弥补缺失的感官信息。
*   **音频的作用**：音频在连接输入与虛拟内容方面起到特殊的作用。
*   **设计的原则**：使用与系统一致的手势语言，仅在无法使用标准集合实现期望行为时引入自定义手势，寻找使用眼睛作为意图信号的方式来改进交互，只有在直接交互是体验的核心时才使用它，并提供丰富的反馈以弥补缺失的感官信息。

总的来说，这段内容强调了眼部和手部在空间交互设计中的重要性，突出了舒适性和人体工程学的重要性，并提倡设计者和开发者在设计交互体验时考虑舒适性和可访问性。

MR 核心技术（透视技术）
-------------

头带显示器自身具有显示虚拟世界的能力，如何同时在用户的视野中呈现现实世界与虚拟世界是实现 MR 体验的关键。下面是 MR 体验的两种不同方案，旨在解决如何将现实世界显示在用户视野中的问题。

### VST（视频透视 - Video See Through）

![](/images/jueJin/d5cf8f65cad8495.png)

以 [Apple Vision Pro](https://link.juejin.cn?target=https%3A%2F%2Fwww.apple.com%2Fapple-vision-pro%2F "https://www.apple.com/apple-vision-pro/")、[Meta Quest-3](https://link.juejin.cn?target=https%3A%2F%2Fwww.meta.com%2Fquest%2Fquest-3%2F "https://www.meta.com/quest/quest-3/") 等为代表。它利用摄像头等传感器，捕捉真实世界的影像，然后投射到屏幕上，看到的内容都是虚拟重建的。优点是可以构建一个更加虚拟的世界，效果更加梦幻。但是这也意味着对硬件、光线要求更高。如Vision Pro 采用多摄像头、双芯片方案，也进一步拉高了头显重量和成本价格。

_实际体验效果请参考文档下方的 Vision Pro 真机体验章节。_

VR 行业常用每 1° 视野中像素点（角分辨率，PPD）综合评判头戴设备的显示效果，达到人眼的效果需要到 60。现在的设备普遍只有 20 左右，而 Vision Pro 做到了 40。

![](/images/jueJin/8abd44b886914ef.png)

### OST（光学透视 - Optic See Through）

![](/images/jueJin/feb6d9973679402.png)

代表产品有 [Microsoft Hololens-2](https://link.juejin.cn?target=https%3A%2F%2Fwww.microsoft.com%2Fzh-cn%2Fhololens%2F "https://www.microsoft.com/zh-cn/hololens/")、[Rokid Max Pro](https://link.juejin.cn?target=https%3A%2F%2Farstudio.rokid.com%2F "https://arstudio.rokid.com/") 等。它可以通过一层玻璃，让人看到的永远是真实世界，在此基础上构建虚拟物品，可以和现实世界产生交互。它的优点是能让人感受真实的世界，眼镜形式更加轻便。但在目前底层硬件技术的制约下，也势必需要牺牲性能、续航和散热。而且还需要不断在性能和重量之间做取舍。

![](/images/jueJin/be8a59be47624b7.png)

### 总结

OST 被称为真正的 AR，OST 或是未来主要透视解决方案，但当前 VST 的诸多优点使其成为当前的主流方案。AR 眼镜的透视主要采用 OST 方案，AR 眼镜的轻便性或使其成为未来主流 XR 产品形态，相应 OST 也有望成为下一代主流透视技术方案，而 VST 则更适合于当前主流 VR 产品形态。OST 在亮度、真实世界分辨率、延迟、焦平面（影响晕眩感）有显著的优势，而 VST 则在遮挡效果、FOV、虚实匹配、配准、亮度匹配等方面更为成熟。从实机成像效果看，受制于目前光学技术瓶颈，OST 在色彩表现与虚实融合等性能指标上劣势较为明显，VST 虽然无法完全还原现实世界， 但虚实合成后的显示效果仍具有较大优势。

下面是 VST 和 OST 的各项指标的对比：

**VST**

**OST**

亮度

**100-600** 尼特

**6600** 尼特+

真实世界分辨率

单眼 **2k-4k**

单眼 **24K+**

延迟

**有延迟**

现实世界**无延迟**，虚拟世界有延迟

焦平面

**1** 个焦平面

**无数**个焦平面，可防止幅辏冲突和眩晕

遮挡效果

**合理**遮挡

虚拟对现实**不完全**遮挡

FOV

主流在 **90-120°** 之间

主流在 **30-70°** 左右

虚实匹配

虚实匹配**一致**

虚实匹配**不佳**

配准信息

**更易**配准

**仅靠**头部追踪器匹配

亮度匹配控制

虚实亮度**易**匹配

虚实亮度**难**匹配

### 隐私和安全保护

Optic ID 是一个全新的安全认证系统，通过分析在各种非可见 LED 光下的用户虹膜，并将其与存储在安全隔区的用户注册 Optic ID 比对以迅速解锁 Apple Vision Pro。用户的 Optic ID 信息完全加密存储在设备上，不会储存在 Apple 服务器上，也无法被任何 app 所访问。

用户在使用 Apple Vision Pro 时的浏览内容和眼睛追踪信息均不会与 Apple、第三方 app 或网站分享。除此之外，来自相机和其他传感器的信息均直接在设备端处理，所以 app 不需要看见用户的周围环境来提供空间体验。EyeSight 也包含一个视觉指示灯，让周围的人知道用户正在拍摄空间照片或空间视频。

真机体验说明
------

### 模拟器体验

![](/images/jueJin/c62eb5b4443d48b.png)

### 真机体验

和下面的视频基本体验一致：

![](/images/jueJin/866f9f9f68f84a9.png)

### 使用流程和支持的手势操作

![](/images/jueJin/a4651d2434df4fb.png)

云音乐畅想
-----

借助 VisionPro 设备的无限画布的特性，不同类型的应用可以有不同的 VR 落地方向，如电商应用，可能会去探索沉浸式的 VR 购物体验，让用户在接近真实世界的环境下挑选合适尺码的衣服。下面是基于云音乐应用本身的特性，给出的一些想法和可供参考的探索方向（和实际是否落地无关）。

### 黑胶唱片店

首页/个人资产 — 黑胶唱片墙：可以不断切换风格以及动画内容进行展示。

![](/images/jueJin/5515633d44be4a6.png)

Minibar — 黑胶唱片机：支持播控、切换歌曲、红心等，支持独立窗口 pin 在任意位置（同一应用多开）。

![](/images/jueJin/ddc6ecf9966841f.png)

数码黑胶专辑拟物/装饰播放器样式等会员权益也可以在 VR 中展示出来。

### VR - 打碟台/多人歌房（派对房）

直接触摸黑胶进行打碟、调音器、混合器、remix 的合成器。

![](/images/jueJin/579248dac08b42d.png)

### 氛围空间（Environment Space）

利用 Environment 将音乐与视频画面结合，如 VR 旅行、冥想等场景，参考[示例](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1oc411W74H "https://www.bilibili.com/video/BV1oc411W74H")。

![image](/images/jueJin/0a4967e1ec204d3.png)

### VR 一起听、演唱会

支持虚拟人像进行内容透传，打造两人一起听的沉浸式体验。

![](/images/jueJin/4d54402f039244d.png)

举办个人演唱会（个人录音棚），各种现实世界中的乐器都能虚拟化出来。

![](/images/jueJin/66cff4735f2c4d8.png)

参考链接
----

[developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fvisionos%2Fbringing-your-app-to-visionos "https://developer.apple.com/documentation/visionos/bringing-your-app-to-visionos")

[developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fvisionos%2Fmaking-your-app-compatible-with-visionos "https://developer.apple.com/documentation/visionos/making-your-app-compatible-with-visionos")

[developer.apple.com/visionos/co…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvisionos%2Fcompatibility-evaluations%2F "https://developer.apple.com/visionos/compatibility-evaluations/")

[vrtuoluo.cn/536959.html](https://link.juejin.cn?target=https%3A%2F%2Fvrtuoluo.cn%2F536959.html "https://vrtuoluo.cn/536959.html")

[developer.apple.com/cn/visionos…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fcn%2Fvisionos%2F "https://developer.apple.com/cn/visionos/")

[developer.apple.com/cn/visionos…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fcn%2Fvisionos%2Fplanning%2F "https://developer.apple.com/cn/visionos/planning/")

[www.apple.com.cn/newsroom/20…](https://link.juejin.cn?target=https%3A%2F%2Fwww.apple.com.cn%2Fnewsroom%2F2023%2F06%2Fintroducing-apple-vision-pro%2F "https://www.apple.com.cn/newsroom/2023/06/introducing-apple-vision-pro/")

[pdf.dfcfw.com/pdf/H3\_AP20…](https://link.juejin.cn?target=https%3A%2F%2Fpdf.dfcfw.com%2Fpdf%2FH3_AP202307141592272523_1.pdf%3F1689343173000.pdf "https://pdf.dfcfw.com/pdf/H3_AP202307141592272523_1.pdf?1689343173000.pdf")

[mdpi-res.com/d\_attachmen…](https://link.juejin.cn?target=https%3A%2F%2Fmdpi-res.com%2Fd_attachment%2Fsensors%2Fsensors-22-07709%2Farticle_deploy%2Fsensors-22-07709.pdf "https://mdpi-res.com/d_attachment/sensors/sensors-22-07709/article_deploy/sensors-22-07709.pdf")

[niteeshyadav.com/blog/unders…](https://link.juejin.cn?target=https%3A%2F%2Fniteeshyadav.com%2Fblog%2Funderstanding-display-techniques-in-augmented-reality-7485%2F "https://niteeshyadav.com/blog/understanding-display-techniques-in-augmented-reality-7485/")

最后
--

![](/images/jueJin/8bff91a86dda428.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")