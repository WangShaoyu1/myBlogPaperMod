---
author: "brzhang"
title: "Flutter卡顿优化锦辑"
date: 2020-03-02
description: "首先，在做性能调优之前，我们应该对flutter相关基础知识有一定的了解，不然我们无从做起，首先，我们要了解flutter是干嘛的--Flutter是谷歌2018年发布的跨平台移动UI框架。他是直接调用Skia框架，而其他框架需要借助现有的原始框架来转一下，在才开始去调用S…"
tags: ["Flutter"]
ShowReadingTime: "阅读6分钟"
weight: 756
---
[原文链接](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1591997%3Fs%3Doriginal-sharing "https://cloud.tencent.com/developer/article/1591997?s=original-sharing")

Flutter卡顿优化必备基础知识
=================

首先，在做性能调优之前，我们应该对flutter相关基础知识有一定的了解，不然我们无从做起，首先，我们要了解flutter是干嘛的--**Flutter 是谷歌2018年发布的跨平台移动UI框架**。

然后，他相对于其他跨平台开发框架来说，是**高效**的，至于他为什么高效，原因是因为：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06747b16e78~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

他是直接调用Skia框架，而其他框架需要借助现有的原始框架来转一下，在才开始去调用Skia框架，这一来二去，肯定就有所消耗，这是其一，然后，我们还需要知道flutter的四个线程。

四个线程
----

分别是：

### 平台线程

该平台的主线程。插件代码在这里运行。更多信息请参阅：iOS 的程序 ([UIKit](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fuikit "https://developer.apple.com/documentation/uikit")) 文档，或者 Android 的主线程 ([MainThread](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fandroid%2Fsupport%2Fannotation%2FMainThread "https://developer.android.google.cn/reference/android/support/annotation/MainThread")) 文档。性能图层并不会展示该线程。

### DartUI 线程

UI 线程在 Dart VM 执行 Dart 代码。该线程包括开发者写下的代码和 Flutter 框架根据应用行为生成的代码。当应用创建和展示场景的时候，UI 线程首先建立一个 **图层树(layer tree)** ，一个包含设备无关的渲染命令的轻量对象，并将图层树发送到 [GPU](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fproduct%2Fgpu%3Ffrom%3D10908 "https://cloud.tencent.com/product/gpu?from=10908") 线程来渲染到设备上。**不要阻塞这个线程**！在性能图层的最低栏展示该线程。

### GPU 线程

GPU 线程取回图层树并通知 GPU 渲染。尽管无法直接与 GPU 线程或其数据通信，**但如果该线程变慢，一定是开发者 Dart 代码中的某处导致的**。图形库 Skia 在该线程运行，有时也被叫做**光栅器 (rasterizer) 线程**。在性能图层的最顶栏显示该线程。

### I/O 线程

可能阻塞 UI 或者 GPU 线程的耗时任务（大多数情况下是 I/O）。该线程并不会在性能图层中展示。

**所以，我们做性能优化，关心DartUI，关心GPU两个线程**，掉不掉帧，卡不卡的关键，就看这两位了，而且在99%情况下，作为Flutter开发人员，我们我们基本上解决好，DartUI线程上的问题，就==解决了渲染性能问题。

三棵树
---

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06745b0e57b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

*   **Widget**是为Element描述需要的**配置**， 负责创建Element，决定Element是否需要更新。Flutter Framework通过差分算法比对Widget树前后的变化，决定Element的State是否改变。当重建Widget树后并未发生改变， 则Element不会触发重绘，则就是Widget树的重建并不一定会触发Element树的重建。
*   **Element**表示Widget配置树的特定位置的一个实例，同时持有Widget和RenderObject，负责管理Widget配置和RenderObject渲染。Element状态由Flutter Framework管理， 开发人员只需更改Widget即可。
*   **RenderObject**表示渲染树的一个对象，负责真正的渲染工作，比如测量大小、位置、绘制等都由RenderObject完成。

为了更加直观的表示3个树的从生到死，我不得不抛出下面这幅图来

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06745da3682~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

然后，我们经常在做性能调优的时候，会用到timeline工具，你会看到这样一幅图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b067486ef35a~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

现在串起来了吗，**4个线程**，**build---layout---paint三个阶段**是不是都一目了然，各发生在什么地方，什么阶段，谁先谁后。

**所以，我们说 要解决卡顿掉帧的问题，就是要解决build,layout,paint这三个阶段各函数执行耗时的问题。**

具体如何做性能优化
=========

首先，我们配置下环境，这里我配置这个变量`debugProfileBuildsEnabled=true`不然，我不知道build他具体做了些啥，观望台默认不会告诉我。一般来说，放在main函数中，在runApp之前开启即可，比如我是这么干的：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06748fa5328~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

这里面有一些其他需要用到的开关，可以在数据不足的时候开启，这样我们参考的数据多些，优化的参考点就明确些。

然后，我们执行 flutter run --profile ,请记住，我们需要在profile模式来性能调优，debug模式因为在渲染过程中记录了很多分析数据且加上支持热重载的特性是损失了很多性能为代价的，profile模式更加接近release模式性能。

然后跑起来了，会出现一个链接：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06748d561db~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

点一下就去了观望台了，当然，你也可以使用devTools，貌似后面会取代观望台。devTools的启动姿势是：

 代码解读

复制代码

`flutter pub global activate devtools devTools`

先安装，然后在直接运行即可：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06776da430d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

点击这个链接，会弹出一个网页来，让你输入url，这个url就是我们那个观望台的url，因此你似乎秒懂了，然来，devTools是在观望台的基础至上做的一个分析工具，所以，Google一定是觉得观望台不大友好了，然而，遗憾的是，devTools并不是特别全面，因为现在还是preview阶段嘛，一切都会好起来的。

### 好的，假如，我们的app有性能问题，我们就会打开观望台，然后打开timeLine，点击Flutter Develop，然后在你觉得有问题的页面多操作记下，然后点击右上角Refresh按钮，就会出现：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06777083c57~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

通常来说，很容易发现有问题的地方，明显那个会比**较宽比较长**的地方就比较可以，这种一遍就可以定位页面加载比较慢了，然后我们点击向下箭头，把他放大点看看

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b06777a104fb~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

大概就看到了，偶，然后，我们点击选择，在选择一个范围看看统计效果：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b0677c321f07~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

这时候，我们就发现问题了，然后这个也加载了这么多个TipCacheNetWorkImage，然后每个大概要2ms，然后我这个是一个列表页：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b0677a015675~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

所以，一共就有8个这样的控件要渲染，而他，就占用`8 *2.188 &gt; 16ms`，因此我们找到了优化点，解决这个就可以加速渲染了，这里只是举例找到存在性能瓶颈的地方，具体相关函数耗时的优化，相信大家都懂的，这就是算法相关的问题了。

然后就是几点代码建议
==========

1、尽量将setState放在叶子节点，好处是build时影响范围极小，简称**局部刷新**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709b0678fa7ea1d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

2、能不用 [`Opacity`](https://link.juejin.cn?target=https%3A%2F%2Fapi.flutter-io.cn%2Fflutter%2Fwidgets%2FOpacity-class.html "https://api.flutter-io.cn/flutter/widgets/Opacity-class.html") Widget，就尽量不要用，因为这货会粗发GPU一个saveLayer的指令，做Skia的大神说，这个指令相当耗时。

3、使用ListView.builder()而不是直接使用ListView()来构建列表。

4、对于频繁更新的控件（比如倒计时，秒表），使用RepaintBoundary隔离它，让他在一个独立的paint区域。

5、使用const来修饰永远不需要变更的控件。

6、优先使用StateLessWidget，而不是全部用StateFulWidget

7、使用Visibility控件替换if/else，有些小伙伴喜欢else时return一个 占位控件，须不知，这种效率是没有Visibility高效的。

**参考资料**

[调试 Flutter 应用 - Flutter 中文文档 - Flutter 社区中文资源](https://link.juejin.cn?target=https%3A%2F%2Fflutter.cn%2Fdocs%2Ftesting%2Fdebugging "https://flutter.cn/docs/testing/debugging")

[zhuanlan.zhihu.com/p/88478737](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F88478737 "https://zhuanlan.zhihu.com/p/88478737")

[files.flutter-io.cn/events/gdd2…](https://link.juejin.cn?target=https%3A%2F%2Ffiles.flutter-io.cn%2Fevents%2Fgdd2018%2FProfiling_your_Flutter_Apps.pdf "https://files.flutter-io.cn/events/gdd2018/Profiling_your_Flutter_Apps.pdf")

[Flutter 应用性能优化最佳实践 - Flutter 中文文档 - Flutter 社区中文资源](https://link.juejin.cn?target=https%3A%2F%2Fflutter.cn%2Fdocs%2Ftesting%2Fbest-practices "https://flutter.cn/docs/testing/best-practices")

[mrale.ph/dartvm/](https://link.juejin.cn?target=https%3A%2F%2Fmrale.ph%2Fdartvm%2F "https://mrale.ph/dartvm/")

[medium.com/flutter/man…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fflutter%2Fmanaging-visibility-in-flutter-f558588adefe "https://medium.com/flutter/managing-visibility-in-flutter-f558588adefe")