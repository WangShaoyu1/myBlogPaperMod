---
author: "法的空间"
title: "Flutter什么，微信现在才支持实况图！？"
date: 2024-09-26
description: "最近微信朋友圈可以发实况图，上了热搜！Flutter不是早就支持实况图了吗！？来，一起来看看你想要的实况图小姐姐。"
tags: ["Flutter","Android","iOS"]
ShowReadingTime: "阅读8分钟"
weight: 894
---
### 相关阅读

*   [Flutter 什么功能都有的Image](https://juejin.cn/post/6844903794656952328 "https://juejin.cn/post/6844903794656952328")
*   [Flutter 可以缩放拖拽的图片](https://juejin.cn/post/6844903814324027400 "https://juejin.cn/post/6844903814324027400")
*   [Flutter 仿掘金微信图片滑动退出页面效果](https://juejin.cn/post/6844903860163575815 "https://juejin.cn/post/6844903860163575815")
*   [Flutter 图片裁剪旋转翻转编辑器](https://juejin.cn/post/6844903939670802446 "https://juejin.cn/post/6844903939670802446")
*   [Flutter 图片全家桶](https://juejin.cn/post/6844904122571816968 "https://juejin.cn/post/6844904122571816968")

> 是不是你们最喜欢看的？这是一段有声音的 Gif ，流口水声。

![1726883654762.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d75138da67e743579ff65fe5ca633fd7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=zYVNQhHjyKnfz9CqGO3%2BbaEyZZA%3D)

### 前言

最近`微信朋友圈可以发实况图了`，上了热搜！

![305c789787bb14208d6b402ddf4d0e89.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/316e419694be4376b951e19084af28a4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=Dh9LhNNcDo3jp7d76%2BZbmVPLJbY%3D)

我在想，好家伙， 实况图 (`Live Photo`) `iOS 9.1` 就支持了，现在都 [iOS 18](https://juejin.cn/post/7416166317986562088 "https://juejin.cn/post/7416166317986562088") 了。

![0f615f71644dd9e3f46f8e28229dc91b.jpg](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/81fe9e28091f42e79be8302e3e66c235~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=tFFFXPGNAsZkVAZU%2F1ky4Wa5flg%3D)

我记得 [photo\_manager](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fphoto_manager "https://pub-web.flutter-io.cn/packages/photo_manager") 和 [wechat\_assets\_picker](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fwechat_assets_picker "https://pub-web.flutter-io.cn/packages/wechat_assets_picker") 很早就支持了呀！

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/36348a5f7b52406f8c195dd6bc581e5f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=LRWniWpg1fLhYUm9vLN%2FKXA2dU4%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0641b6b90b5444038d570c164c3e806b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=Mnx4QzcHL9x1nrYENmG6WTgVvOE%3D)

虽然但是，然后需求它又来了。

![IMG_20240920_161542.jpg](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7e1ecfc717c84f46a0b4d9abba98ea30~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=iKkqPJa%2FWgC5CvYohSVaS8VTxtE%3D)

![IMG_20240920_161352.jpg](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/38a7b45d0abd452e80814e3eb3d52844~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=bxCoo0iKfQwbVR8wFJZIkZOYrto%3D)

> 微信都不支持，不要太卷了，年轻人。

### 什么是 实况图 (`Live Photo`)

要编写这种效果，首先我们要了解一下 实况图 (`Live Photo`) 是什么。

首先在手机上面制作一个实况图 (`Live Photo`), 通过隔空投送，发现只有一张 `HEIC` 格式的图片。

[live图片隔空投送到mac上变成HEIC模式… - Apple 社区](https://link.juejin.cn?target=https%3A%2F%2Fdiscussionschinese.apple.com%2Fthread%2F251661787%3FsortBy%3Drank "https://discussionschinese.apple.com/thread/251661787?sortBy=rank")

后来找到另外的方式，就是在 `mac` 上面登录跟你手机相同的账号，从相册应用中找到该图片，从 `File-> Export-> Export Unmodified Original For 1 Photo` 即 `文件-> 导出-> 导出未处理的原片` 。

[objective c - Can I put a live photo into the iOS Simulator? - Stack Overflow](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F37568769%2Fcan-i-put-a-live-photo-into-the-ios-simulator "https://stackoverflow.com/questions/37568769/can-i-put-a-live-photo-into-the-ios-simulator")

![DM_20240921101555_001.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/efd857b615b443b18a84593bca3350ee~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=vVatCRdJSHJ%2F4i0pEpTNaakPhcE%3D)

导出之后，是 `2` 个文件，一个是图片，一个是视频。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/36d79e1cb0c647ce857a36757fb7bdc2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=%2F4%2FeWb0ieX9GRMJAtiXddXbnA8Q%3D)

当然，你也可以直接使用 [photo\_manager](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fphoto_manager "https://pub-web.flutter-io.cn/packages/photo_manager") 读取你手机中的 实况图 (`Live Photo`)。

系统相册的操作是长按实况图 (`Live Photo`) 就会播放; 看了下微信的效果，预览的时候。自动播放，这个时候可以手势进行缩放，播放完毕，回到图片状态，保持缩放状态。说实话，做起来应该不难。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3e87d29927b40f6958c53a4280bd44c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.image)

### 开干

图片手势的原理，是通过监听手势，去影响图片最终的绘制区域。所以说要做到视频(任何 `Widget`)也跟随手势变化，其实只用把手势处理的过程复制一份就好了，然后把结果给视频(任何 `Widget`)，让它绘制到给定区域即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/901cf50cde8a4ccfabb87af03e9ac92d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.image)

#### 原理简读

dart

 代码解读

复制代码

  `Widget _buildVideo(ExtendedImageGestureState? imageGestureState) {     // The image to render into the area rect.     // in demo case, it is the page size.     // and you can also get it from LayoutBuilder base on your case.     final Size size = MediaQuery.of(context).size;     final Rect destinationRect = widget.buildWithImageRect         ? GestureWidgetDelegateFromState.getRectFormState(             Offset.zero & size,             imageGestureState!,           )         : GestureWidgetDelegateFromState.getRectFormState(             Offset.zero & size,             imageGestureState!,             width: _controller.value.size.width,             height: _controller.value.size.height,           );     final ExtendedImageSlidePageState? extendedImageSlidePageState =         imageGestureState.extendedImageSlidePageState;     Widget child = VideoPlayer(_controller);     if (widget.buildWithImageRect) {       final double aspectRatio = widget.state.extendedImageInfo!.image.width /           widget.state.extendedImageInfo!.image.height;       if ((_controller.value.aspectRatio - aspectRatio).abs() > 0.01) {         final Rect widgetDestinationRect =             GestureWidgetDelegateFromState.getRectFormState(           Offset.zero & size,           imageGestureState,           width: _controller.value.size.width,           height: _controller.value.size.height,           copy: true,         );         child = FittedBox(           child: SizedBox(             child: child,             width: widgetDestinationRect.width,             height: widgetDestinationRect.height,           ),           fit: BoxFit.cover,           clipBehavior: Clip.hardEdge,         );       }     }     child = CustomSingleChildLayout(       delegate: GestureWidgetDelegateFromRect(         destinationRect,       ),       child: child,     );     // The same as use CustomSingleChildLayout     // child = Stack(     //   children: <Widget>[     //     Positioned.fromRect(     //       rect: destinationRect,     //       child: child,     //     ),     //   ],     // );     if (extendedImageSlidePageState != null) {       child = imageGestureState               .widget.extendedImageState.imageWidget.heroBuilderForSlidingPage               ?.call(child) ??           child;       if (extendedImageSlidePageState.widget.slideType == SlideType.onlyImage) {         child = Transform.translate(           offset: extendedImageSlidePageState.offset,           child: Transform.scale(             scale: extendedImageSlidePageState.scale,             child: child,           ),         );       }     }     return child;   }`

##### 获取区域

`rect` 即图片占用的区域，例子里面是整个页面，你也可以通过 `LayoutBuilder` 去获取实际的区域

##### 计算出绘制区域

可以根据你自身的需求，如果需要视频(任何 `Widget`)按照自身的宽高来绘制，那么在 `GestureWidgetDelegateFromState.getRectFormState` 方法调用的时候传入实际的宽高。

该方法实现为:

dart

 代码解读

复制代码

  `static Rect getRectFormState(     Rect rect,     ExtendedImageGestureState state, {     double? width,     double? height,     BoxFit? fit,     bool copy = false,   }) {     final GestureDetails? gestureDetails = state.gestureDetails;     if (gestureDetails != null && gestureDetails.slidePageOffset != null) {       rect = rect.shift(-gestureDetails.slidePageOffset!);     }     Rect destinationRect = getDestinationRect(       rect: rect,       inputSize: Size(         width ??             state.widget.extendedImageState.extendedImageInfo!.image.width                 .toDouble(),         height ??             state.widget.extendedImageState.extendedImageInfo!.image.height                 .toDouble(),       ),       fit: fit ?? state.widget.extendedImageState.imageWidget.fit,     );     if (gestureDetails != null) {       GestureDetails gd = gestureDetails;       if (copy) {         gd = gestureDetails.copy();       }       destinationRect = gd.calculateFinalDestinationRect(rect, destinationRect);       if (gd.slidePageOffset != null) {         destinationRect = destinationRect.shift(gd.slidePageOffset!);       }     }     return destinationRect;   } }`

*   初始的绘制区域，首先要移除滑动退出的影响
*   `getDestinationRect` 方法根据绘制的区域大小和图片的大小(或者我们给定的视频(任何 `Widget`)的实际宽高)以及 `BoxFit`，来计算出来应该将视频(任何 `Widget`)绘制到什么区域。
*   `GestureDetails` 根据的缩放值，平移值等参数，计算出来，缩放平移后的视频(任何 `Widget`)绘制区域。
*   还原滑动退出的影响

##### 处理宽高比不近似相等

*   当视频(任何 `Widget`)按照图片的宽高计算的时候，要注意它和图片宽高比。如果近似不相同，并且不做任何处理的话，视频(任何 `Widget`)会被压缩拉伸。

通过下面的方法，我们可以视频(任何 `Widget`)进行 `conver` 操作,使两者显示更自然。

dart

 代码解读

复制代码

        `final Rect widgetDestinationRect =             GestureWidgetDelegateFromState.getRectFormState(           Offset.zero & size,           imageGestureState,           width: _controller.value.size.width,           height: _controller.value.size.height,           copy: true,         );         child = FittedBox(           child: SizedBox(             child: child,             width: widgetDestinationRect.width,             height: widgetDestinationRect.height,           ),           fit: BoxFit.cover,           clipBehavior: Clip.hardEdge,         );`

##### 处理滑动退出情况

*   由于滑动退出可能变形，通过 `heroBuilderForSlidingPage` 进行修正。
*   然后根据 `slideType` 的模式，对手势作用的 `widget` 进行变形。

##### 应用最终绘制位置

最后一步把视频(任何 `Widget`) 绘制到处理之后的最终绘制区域，

当然，这是整个流程看起来很复杂，但是只有你需要自定义，你才需要关注它。

也提供了 `wrapGestureWidget` 方法，可以简单的处理整个过程(除了不同宽高比那部分)

dart

 代码解读

复制代码

  `return imageGestureState!.wrapGestureWidget(     VideoPlayer(_controller),   );`

上面只是怎么将缩放平移作用在视频(任何 `Widget`)的过程，其他细节还包括图片和视频(任何 `Widget`)切换动画，`Live Photo` 标志添加等细节，知道你们不喜欢看，直接给你们代码链接，有疑问的可以留言讨论。

完整代码： [github.com/fluttercand…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fextended_image%2Fblob%2Fmaster%2Fexample%2Flib%2Fpages%2Fcomplex%2Flive_photo_demo.dart "https://github.com/fluttercandies/extended_image/blob/master/example/lib/pages/complex/live_photo_demo.dart")

#### 优化细节

可能有这种需求，在用户做手势的时候或者滑动退出的时候，会根据情况对视频(任何 `Widget`) 特殊处理，比如在用户做手势的时候或者滑动退出的时候，停止视频播放，结束之后再继续播放。

##### 滑动退出中

![1726883654746.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5a0814d0693e468c984a43a0a90cbbd7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=%2BwUjGm%2Bad%2BcKvjZ7BD9h2RNR%2FxM%3D)

可能用户会有需求，滑动退出过程中停止播放。

`ExtendedImageSlidePage` 有 `onSlidingPage` 回调，你可以根据 `ExtendedImageSlidePageState.isSliding` 来判断，当前是否是在滑动退出手势中。

dart

 代码解读

复制代码

      `ExtendedImageSlidePage(         key: slidePagekey,         onSlidingPage: (ExtendedImageSlidePageState state) {           _isSliding.value = state.isSliding;         },       ）`

##### 手势中

![1726883654755.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/976546110ee145d1bc611134069f282d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=MSoXDwPsxFpKmduoMwd6WVRE%2FFE%3D)

可能用户会有需求，手势过程中停止播放。

`GestureConfig` 中有回调 `gestureDetailsIsChanged`， 可以通过该回调知道是否手势正在进行。

dart

 代码解读

复制代码

    `ExtendedImage(       image: image,       fit: _fit,       mode: ExtendedImageMode.gesture,       enableSlideOutPage: true,       initGestureConfigHandler: (ExtendedImageState state) {         return GestureConfig(           inPageView: true,           initialScale: 1.0,           maxScale: 5.0,           animationMaxScale: 6.0,           initialAlignment: InitialAlignment.center,           gestureDetailsIsChanged: (GestureDetails? details) {             _gestureDetailsIsChanging.value = true;             _gestureDetailsChangeCompleted();           },         );       },     );`

但是手势是有动画，而且没有结束的标志，所以我们需要利用 `debounce` 防抖，来判断手势是否结束掉了。意思就是如果 `100 milliseconds` 之后，这个方法不再触发，那么就认为手势已经结束。

dart

 代码解读

复制代码

  `late VoidFunction _gestureDetailsChangeCompleted;   @override   void initState() {     super.initState();     _gestureDetailsChangeCompleted = () {       _gestureDetailsIsChanging.value = false;     }.debounce(const Duration(milliseconds: 100));   }`

手势结束，可能是用户手没有动了，即用户手指还是按压着的，只是没有变化。所以我们需要另外一个变量来优化这一场景。

dart

 代码解读

复制代码

    `Listener(       onPointerDown: (PointerDownEvent event) {         _pointerDown = true;       },       onPointerUp: (PointerUpEvent event) {         _pointerDown = false;         SchedulerBinding.instance.addPostFrameCallback((_) {           continuePlay();         });       },       onPointerCancel: (PointerCancelEvent event) {         _pointerDown = false;         SchedulerBinding.instance.addPostFrameCallback((_) {           continuePlay();         });       },     );`

如果用户手指没有抬起，那我们还是不要继续播放视频。

dart

 代码解读

复制代码

  `Future<void> _onGestureDetailsIsChanged() async {     if (!_showVideo.value) {       return;     }     if (widget.gestureDetailsIsChanging.value) {       await _controller.pause();     } else if (!_pointerDown) {       await continuePlay();     }   }`

### 结语

完整的例子在:

[extended\_image/example/lib/pages/complex/live\_photo\_demo.dart at master · fluttercandies/extended\_image (github.com)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fextended_image%2Fblob%2Fmaster%2Fexample%2Flib%2Fpages%2Fcomplex%2Flive_photo_demo.dart "https://github.com/fluttercandies/extended_image/blob/master/example/lib/pages/complex/live_photo_demo.dart")

[wechat\_assets\_picker](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fwechat_assets_picker "https://pub-web.flutter-io.cn/packages/wechat_assets_picker") 已同步微信实况图效果。

![1727261040094.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/639267486720441baf0d4d7a03d37137~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOV55qE56m66Ze0:q75.awebp?rk3s=f64ab15b&x-expires=1728517012&x-signature=mYiQsa%2BpEEyl9FC%2BcfyA6HQTvu4%3D)

从最开始支持图片的缩放平移，就已经为后续功能铺好路，只要懂得其原理，一切都是水到渠成。

最后想说的是，年轻人还是不要太卷了，如果提前做了，今年的 `kpi` 又怎么完成呢？ `微信怎么可以做？` 和 `微信都不支持！` 同理。

接下来的 `kpi` :

*   [extended\_image](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fextended_image "https://pub-web.flutter-io.cn/packages/extended_image") 和 [extended\_image\_library](https://link.juejin.cn?target=https%3A%2F%2Fpub-web.flutter-io.cn%2Fpackages%2Fextended_image_library "https://pub-web.flutter-io.cn/packages/extended_image_library") 重构整理下代码。
*   还大家的愿，比如任意角度旋转，手势细分更精准等。

> 这只是饼，有可能完成。

爱 `Flutter`，爱`糖果`，欢迎加入[Flutter Candies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies "https://github.com/fluttercandies")，一起生产可爱的Flutter小糖果[![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8afe301bcc2a4fccbdbcee6d05927a8c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.jpg#?w=90&h=22&s=1827&e=png&b=1fa4e6)QQ群:181398081](https://link.juejin.cn?target=https%3A%2F%2Fjq.qq.com%2F%3F_wv%3D1027%26k%3D5bcc0gy "https://jq.qq.com/?_wv=1027&k=5bcc0gy")

最最后放上 [Flutter Candies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies "https://github.com/fluttercandies") 全家桶，真香。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/192cbc5338cc4848af54c629d6865050~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.png#?w=1920&h=1920&s=131155&e=png&a=1&b=5abffa)