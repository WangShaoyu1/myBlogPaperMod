---
author: "DebugUsery"
title: "在Swift中创建可缩放的图像视图"
date: 2021-11-04
description: "在你的iOS应用中添加捏合变焦功能的分步指南照片：MarkusWinkleronUnsplash没有什么比完美的图片更能让你的应用程序熠熠生辉，但如果你想让你的应用程序用户真正参与并与图片互动呢"
tags: ["iOS"]
ShowReadingTime: "阅读4分钟"
weight: 859
---
#### 在你的iOS应用中添加捏合变焦功能的分步指南

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/560f50bee95143a7aa54acac9e6a81a4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

照片：[Markus Winkler](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2F%40markuswinkler%3Futm_source%3Dmedium%26utm_medium%3Dreferral "https://unsplash.com/@markuswinkler?utm_source=medium&utm_medium=referral")on[Unsplash](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%3Futm_source%3Dmedium%26utm_medium%3Dreferral "https://unsplash.com?utm_source=medium&utm_medium=referral")

没有什么比完美的图片更能让你的应用程序熠熠生辉，但如果你想让你的应用程序用户真正参与并与图片互动呢？也许他们想放大、平移、掌握这些图像？

在本教程中，我们将建立一个可缩放、可平移的图像视图来实现这一功能。

### 计划

他们说，一张图片胜过千言万语--但它不一定要花上一千行代码！对于我们的可缩放图像视图，我们要做的是让它成为一个可缩放的视图。对于我们的可缩放图像视图，我们将利用UIScrollView的缩放和平移功能。基本上，我们将在UIScrollView中嵌套一个包含图片的UIImageView，它将处理所有我们扔给它的缩放、平移（和点击！）手势。

### 创建一个PanZoomImageView

让我们先创建一个PanZoomImageView类，它子类于UIScrollView。我们将用一个UIImageView来初始化这个类，它将被添加为一个子视图。我们希望能够以编程方式和通过Interface Builder使用PanZoomImageView，所以让我们处理不同的初始化器，并创建一个通用的init。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2Fafad375fbed8b3fb13fbe8cb5f63362f%2Fhref "https://medium.com/media/afad375fbed8b3fb13fbe8cb5f63362f/href")[medium.com/media/afad3…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2Fafad375fbed8b3fb13fbe8cb5f63362f%2Fhref "https://medium.com/media/afad375fbed8b3fb13fbe8cb5f63362f/href")

在commonInit()中，我们将图像视图居中，并设置它的高度和宽度，而不是把它固定在父视图上。这样一来，滚动视图就会从图像视图中获得其内容大小。

### 设置滚动视图

我们需要实际设置我们的滚动视图，使其可缩放和可平移。这包括设置最小和最大的缩放级别，以及指定用户放大时使用的UIView（在我们的例子中，它将是图像视图）。让我们来设置滚动视图（为清晰起见，添加一些注释）。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F463046f3598556e53a240dd7618a9121%2Fhref "https://medium.com/media/463046f3598556e53a240dd7618a9121/href")[medium.com/media/46304…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F463046f3598556e53a240dd7618a9121%2Fhref "https://medium.com/media/463046f3598556e53a240dd7618a9121/href")

在这里，我们设置最小和最大的缩放级别，确保滚动指示器被隐藏（我们不希望它们破坏我们美丽的图像！），然后我们设置PanZoomImageView类作为滚动视图的委托。Xcode可能会开始抱怨，因为PanZoomImageView还不符合UIScrollViewDelegate--让我们接下来做这个。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F56e8697b1e8c7e7704e73fa9a1bae1b1%2Fhref "https://medium.com/media/56e8697b1e8c7e7704e73fa9a1bae1b1/href")[medium.com/media/56e86…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F56e8697b1e8c7e7704e73fa9a1bae1b1%2Fhref "https://medium.com/media/56e8697b1e8c7e7704e73fa9a1bae1b1/href")

这很简单--我们想让我们的图像成为缩放和平移时显示的视图，所以我们只是返回我们的imageView。

### 设置我们的图像

很好！我们有了一个UIIm我们已经有了一个嵌套在UIScrollView中的UIImageView，一切都应该是可滚动和可平移的。但是我们如何设置我们的图像呢？我们将通过在我们的类中添加imageName字符串，并在字符串改变时更新UIImageView来实现。我们还将把imageName标记为@IBInspectable，这样就可以通过Interface Builder来设置它。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F706de80f69e34eb9c840a34b6beeef50%2Fhref "https://medium.com/media/706de80f69e34eb9c840a34b6beeef50/href")[medium.com/media/706de…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F706de80f69e34eb9c840a34b6beeef50%2Fhref "https://medium.com/media/706de80f69e34eb9c840a34b6beeef50/href")

好了，我想我们已经准备好使用我们的新类了!打开Main.storyboard，添加一个视图，以你喜欢的方式把它固定在父视图上。接下来，选择该视图，导航到身份检查器，并将该类设置为PanZoomImageView。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/342bc7f20db34e669f35d2e8db796603~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

导航到属性检查器，你应该看到 "图像名称 "属性（这代表我们设置为@IBInspectable的imageName字符串！）。在这里输入你想嵌套在视图中的图片名称。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34702bb5477e4025aaa0b6c9593cd27b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

是时候建立和运行了!一切顺利的话，你应该看到类似下面的东西。试试平移和缩放（如果你使用的是模拟器，按住 "option "键）--你会对你的图像有一个全新的视角

![](https://cdn-images-1.medium.com/max/440/0*DHUZNzHuFLMLA8au.gif)

### 以编程方式初始化视图

在使用界面生成器时，这很好--但如果你想以编程方式初始化视图呢？让我们给我们的类添加另一个初始化器，这样我们就可以在代码中设置图像名称。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F074d43ad77f0b6ce6f6f7d216fe5ead5%2Fhref "https://medium.com/media/074d43ad77f0b6ce6f6f7d216fe5ead5/href")[medium.com/media/074d4…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F074d43ad77f0b6ce6f6f7d216fe5ead5%2Fhref "https://medium.com/media/074d43ad77f0b6ce6f6f7d216fe5ead5/href")

就这样了!现在我们可以像这样通过图片名称以编程方式初始化我们的视图了。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F46facddb13544345d7ce85593ada1417%2Fhref "https://medium.com/media/46facddb13544345d7ce85593ada1417/href")[medium.com/media/46fac…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F46facddb13544345d7ce85593ada1417%2Fhref "https://medium.com/media/46facddb13544345d7ce85593ada1417/href")

让我们来看看我们的类的整体情况。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F825ab71a6e33743ffea9fc00565713bb%2Fhref "https://medium.com/media/825ab71a6e33743ffea9fc00565713bb/href")[medium.com/media/825ab…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F825ab71a6e33743ffea9fc00565713bb%2Fhref "https://medium.com/media/825ab71a6e33743ffea9fc00565713bb/href")

### 双击手势（可选

可缩放视图的一个常见功能是双击放大和缩小的能力。这对我们的类来说是一个相对简单的补充，所以接下来让我们来添加这个功能。我们将创建一个UITapGestureRecognizer，当用户双击时，用它来改变滚动视图的缩放比例。

[](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F8d8843bc0211e4a0d66c3dfb2c064af5%2Fhref "https://medium.com/media/8d8843bc0211e4a0d66c3dfb2c064af5/href")[medium.com/media/8d884…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmedia%2F8d8843bc0211e4a0d66c3dfb2c064af5%2Fhref "https://medium.com/media/8d8843bc0211e4a0d66c3dfb2c064af5/href")

就是这样！我们现在可以通过双击来缩放。我们现在可以通过双击来放大/缩小我们的图片了。

![](https://cdn-images-1.medium.com/max/440/0*J4ep8W6esuKB6hB1.gif)

### 最后的思考

这是一个伟大的可重复使用的类，只要你想让图片变大，你就可以把它拿出来。添加这种额外的功能可以真正帮助人们参与到你的应用程序中显示的图片中，而且通常是用户所期望和要求的功能。

这也不仅仅适用于图片视图--如果你想让UIView可缩放，你可以采取同样的方法，用UIView而不是图片名称初始化你的类。可以尝试一下！