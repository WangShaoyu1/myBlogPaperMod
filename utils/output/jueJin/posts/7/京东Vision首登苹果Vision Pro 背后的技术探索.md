---
author: "京东云开发者"
title: "京东Vision首登苹果Vision Pro 背后的技术探索"
date: 2024-07-11
description: "随着Apple Vision Pro 6月28日在国内正式上市，京东Vision作为国内首批发布的Vision Pro应用与用户见面，基于空间计算技术，提供了一种全新的沉浸式购物体验，本文将为您深入"
tags: ["资讯中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:0,views:244,"
---
随着Apple Vision Pro 6月28日在国内正式上市，京东.Vision作为国内首批发布的Vision Pro应用与用户见面，基于空间计算技术，提供了一种全新的沉浸式购物体验，本文将为您深入介绍京东.Vision背后的技术探索以及特色产品功能。  
去年6月，苹果正式发布首款头显设备Apple Vision Pro，今年6月28号，Apple Vision Pro正式在中国发售。京东.Vision作为首批原生应用登陆Vision Pro平台，首期以家电家居与潮流数码产品作为切入口，未来将逐步拓展至全品类，用户可以在visionOS的App Store搜索“京东.Vision”进行下载和体验。京东.Vision利用Vision Pro的空间计算技术，提供了一种全新的购物方式。用户可直接将心仪的家电家居或潮流数码产品以1:1等比例“拖拽”到自己家中，直接在空间计算环境中真实预览每件物品在空间中的布局和外观。负责京东.Vision开发的京东零售技术团队成员在过去一年持续关注技术发展动向，不断进行产品尝试，本文将系统性地对过程中遇到的技术问题、思考和实践做简单总结，欢迎大家一起讨论交流。 与以往的头显设备相比，Vision Pro有什么不同？

Apple Vision Pro于今年6.28号正式在中国发售。从我们的持续观察来看，**苹果强大的软硬件整体设计能力，使得Vision Pro成为第一款真正意义的空间计算设备，** 与以往的头显设备相较，它带来了明确的技术方向和能力升级：

1.VST(Video See Through)是通过摄像头捕捉真实世界的画面，在头显内屏显示摄像头采集的画面，再实现虚实融合的展示效果。**Vision Pro上将VST延迟降低到12ms，远低于其它产品的50ms以上水平。** 未来很可能会继续引领其他高端设备的技术发展方向，不只是画面的采集和显示，而是采集后同步进行空间场景的数字化建模。

2.**Vision Pro结合眼动追踪，实现了准确度极高的“手眼”控制系统，眼动追踪相比手柄的定位精度更高，手势操作比手柄更加方便。未来发展方向将是“手眼”操控，也会引领其它高端设备的操控方式。**

3.苹果在Vision Pro上提出“空间计算”概念，即先将真实环境全部数字化，在数字化之后的真实3D空间中实现可交互，\*\*提供了更加沉浸式的互动体验。

****京东.Vision背后的技术探索，如何在Vision Pro上做应用开发?****

![图片](/images/jueJin/e8812cacb962482.png)

作为AR/VR技术开发者，我们过往已经在手机端实现了VR全景、AR摆摆看、AR试穿戴、3D展示等产品功能，也在思考Vision Pro上最适合的产品功能。过去一年，我们重点围绕与用户实体环境相关的功能应用进行探索与创新，希望提供给用户相比手机APP跃升式的使用体验。

过程中遇到了诸多挑战：作为苹果第一款空间计算设备，Apple Vision Pro带来了全新的visionOS平台，**开发者需要适应这一平台的特质，理解其提供的无边空间画布式的交互环境。** 其次，在Apple Vision Pro上开发原生3D应用，需要涉及大量对新功能的验证与试错，没有太多现成的范例可供参考。以及，由于visionOS和配套的开发工具仍在不断完善中，某些个性化应用所需的能力尚未提供，这就需要开发者进行自定义功能的扩充，如自定义手势、自定义碰撞效果和自定义组件系统等。

接下来，我们将从首页3D商品和场景展示、环境融合的空间计算应用、自定义着色器和手势等方面详细介绍。

### 3D商品和场景展示

### 作为第一款真正的空间计算设备，Vision Pro提供了3种内容承载容器：Windows、Volumes、Spaces。默认情况下，APP启动时会进入共享空间。为了实现动态可编排的首页，我们采用Windows容器在主界面展示商品内容，并包含可交互的2D、 3D等内容形态，实现实体商品橱窗的3D展示效果。由于Volumes容器对于模型动画的兼容能力有限，我们采用RealityView进行3D模型的装载，实现了在静态首页上的动态模型展示。

![图片](/images/jueJin/3613b0be084145b.png)

![图片](/images/jueJin/f867d0825235457.png)

### 虚实融合的空间计算应用

### **Vision Pro搭载摄像头、激光雷达、环境光等多种传感器，通过多种传感器的组合，以及M2、R1等芯片的强大处理能力，实现了对空间环境的高精度、高鲁棒性定位和地图构建。** 如下图苹果的ARKitScenes环境感知示例。

![图片](/images/jueJin/fa92da21bf044f5.png)

**在空间计算的电商场景中，我们实现了真实空间中的多个虚拟商品摆放问题，来满足用户多品搭配需求。** 首先是商品在真实空间的自由移动、旋转、缩放等空间操作，涉及坐标系变换与仿射变换等技术。在3D 视觉中常用的三个坐标系：图像坐标系、相机坐标系、世界坐标系，它们之间可通过仿射变换、投影变换、刚体变换等方式实现运动。Vision Pro中通常涉及SwiftUI CoordinateSpaceProtocol与RealityCoordinateSpace两个坐标系的转换，转换过程中的世界坐标等参数便由空间计算结果提供。

![图片](/images/jueJin/00f79f4d65a546b.png)  

利用空间计算的环境感知能力实现平面检测和地图建模，结合商品的实际尺寸信息实现虚拟商品与真实空间平面、垂面的吸附、摆放等在实体空间的摆放操作。

![图片](/images/jueJin/123495273c6c4cc.png)

3D环绕与AR摆摆看等典型空间计算应用是将现实世界和虚拟世界融合在一起。在Vision Pro中可以使这个过程更加真实，将虚拟模型的遮挡、碰撞、光影反射等各种属性在现实世界模拟呈现。为了实现碰撞效果，首先需要进行模型与周围环境的碰撞检测，通过定义模型的碰撞形状和属性，并赋予物理属性，如质量、摩擦力和恢复系数，可以实现物理碰撞模拟。常见的碰撞形状包括：矩形，球体，胶囊，凸形状等，为了提升碰撞性能通常使用矩形碰撞形状来进行碰撞检测。碰撞检测示意图如下：

![图片](/images/jueJin/0d8fe6e3b14e4b7.png)

当检测到与实体碰撞后，我们根据已经设置的实体物理属性，实时计算实体在三维空间中的移动速度与位移大小，并更新实体位置。通过模拟碰撞，我们可以实现虚拟模型实体与环境实体，虚拟模型实体与虚拟模型实体之间的碰撞运动，以及虚拟模型实体之间的叠放。

![图片](/images/jueJin/775cf577c39f4fe.png)

解决单个商品在实体空间的摆放之后，进一步实现多品摆放，并使多个虚拟商品可实现真实的碰撞交互，解决了用户体验多件商品搭配效果的需求。为此，我们动态调整虚拟商品的物体属性，允许模型碰撞相交，保证初始化时多个模型在视野中全部可见，之后逐步摆放到合适位置。多品摆放示意图如下：

![图片](/images/jueJin/aa4dcb6bea52411.png)

### 自定义手势识别

Vision Pro利用摄像头和传感器进行手势识别，例如点击，捏合，缩放，旋转等。这是空间计算所能实现的最具沉浸感的方面之一，因为它允许用户通过显示器操控他们看到的数字对象。这种操控方式流畅且最为熟悉。除了苹果官方提供了Tap，Pinch，Zoom，Rotate等基础手势。

![图片](/images/jueJin/0bcbe68cebad47b.png)

我们利用Hand Tracking以及AI深度学习技术扩展了苹果的手势识别功能，让用户可以用更多自定义手势，例如与3D商品进行更精确、流畅的旋转缩放交互。Vision Pro为每只手掌提供25个关键点的数据，其中每个手指有4个关键点，手腕处一个关键点。官方提供6种基础手势，我们在此基础上丰富手势识别功能。通过将关键点信息输入到Rule-based system、DNN、LSTM等模块中，实现动态手势的识别。

![图片](/images/jueJin/fd2e388aa03c4f7.png)

![图片](/images/jueJin/d9a6bb849d0e4cb.png)

### 自定义着色器

依托M2芯片+R1芯片的加持，Vision Pro提供了强大的渲染能力，使得我们可以用自定义着色器实现一些特殊的材质表现和渲染效率优化。比如上文提到的碰撞后的网格特效、商品中的呼吸灯、模型指示器中的UI九宫格等。我们通过Composer Shadergraph实现的UI九宫格，用于指示模型在世界空间中的位置，同时对于不同大小的模型需要保证UI九宫格的4角区域不发生形变，Shadergraph方案以及UI九宫格示意如下所示。

![图片](/images/jueJin/0282cfdda65c4fc.png)

### 空间计算优化

空间计算与传统运算相比，需要计算的数据量提升了一个维度。在处理大量3D数据时，我们采取了多种优化措施来保持高效率的资源应用和流畅的操作体验。例如，根据商品类别动态调整3D模型质量，合理分配面数以控制资源大小。使用Reality Composer Pro工具打包3D场景和资源，实现有效压缩。此外，通过资源预加载、动态加载与释放以及缓存减少IO等操作，提升界面流畅度和降低响应时间。

通过优化技术，我们实现了“3D无界场景”等功能，在一个“无限大”的空间场景中，我们载入了多套高精度模型组，使得用户可以在一个空间内，一站式沉浸浏览。

![图片](/images/jueJin/1fe5a7e89a6342e.png)

**03** 未来探索方向 

Apple Vision Pro作为下一代终端设备，正在引入更多交互方式，提升混合现实的体验效果。京东一直致力于提供多快好省的用户体验，探索更多元、丰富的购物方式。未来我们还将持续打造3D体验和全沉浸式场景体验，引入更多高质量的3D模型与场景、景深视频等资源，逐步补齐3D场景搜索、智能导购、试搭等内容，进一步提升沉浸式体验效果。期待随着技术的不断成熟，一起为用户带来更多新鲜的购物体验。

**04** 参考文献

\[1\] Andrei, Constantin-Octavian. “3D affine coordinate transformations.” (2006).\[2\]A novel hybrid bidirectional unidirectional LSTM network for dynamic hand gesture recognition with Leap Motion\[J\]\[3\]Dynamic Hand Gesture Recognition Based on Short-Term Sampling Neural Networks\[J\]\[4\][www.cnblogs.com/ghjnwk/p/10…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fghjnwk%2Fp%2F10852264.html%255B5%255Dhttps%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGames%2FTechniques%2F3D_collision_detection%255B6%255Dhttps%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Frealitykit%2F%255B7%255Dhttps%3A%2F%2Fgithub.com%2Fapple%2FARKitScenes%255B8%255Dhttps%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Farkit%2Farkit_in_ios%2Fconfiguration_objects%2Funderstanding_world_tracking "https://www.cnblogs.com/ghjnwk/p/10852264.html%5B5%5Dhttps://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection%5B6%5Dhttps://developer.apple.com/documentation/realitykit/%5B7%5Dhttps://github.com/apple/ARKitScenes%5B8%5Dhttps://developer.apple.com/documentation/arkit/arkit_in_ios/configuration_objects/understanding_world_tracking")