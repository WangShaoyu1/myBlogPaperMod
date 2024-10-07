---
author: "法的空间"
title: "Flutter图片全家桶"
date: 2020-04-13
description: "大家好，我是戴着口罩眼镜会起雾的200。不得不说Flutter在UI方面，只要是能想到的效果，你用心都能实现。图片是一个应用中的重要部分，展示，压缩，裁剪，pub三方库应该说是应有尽有。FlutterCandies中也有多个关于图片的库,可以说是比较全面了。增加load…"
tags: ["Flutter"]
ShowReadingTime: "阅读2分钟"
weight: 854
---
大家好，我是戴着口罩眼镜会起雾的200。不得不说Flutter在UI方面，只要是能想到的效果，你用心都能实现。

图片是一个应用中的重要部分，展示，压缩，裁剪，pub三方库应该说是应有尽有。 [FlutterCandies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies "https://github.com/fluttercandies") 中也有多个关于图片的库,可以说是比较全面了。

#### [extended\_image](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fextended_image "https://github.com/fluttercandies/extended_image")

功能最全面的图片展示库，加粗为最近新增功能

主要功能

*   缓存网络图片
*   加载状态(正在加载，完成，失败)
*   拖拽缩放图片
*   图片编辑(裁剪，旋转，翻转)
*   图片预览(跟微信掘金一样)
*   滑动退出效果(跟微信掘金一样)
*   设置圆角，边框
*   **支持进度显示**
*   **图片预览上滑显示详情(跟图虫一样)**

##### 支持进度显示

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e93eba3cc614ddbb818a3a445a41a99~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

增加loadingProgress参数，用于显示进度。

dart

 代码解读

复制代码

             `ExtendedImage.network(               'https://raw.githubusercontent.com/fluttercandies/flutter_candies/master/gif/extended_text/special_text.jpg',               handleLoadingProgress: true,               clearMemoryCacheIfFailed: true,               clearMemoryCacheWhenDispose: true,               cache: false,               loadStateChanged: (ExtendedImageState state) {                 if (state.extendedImageLoadState == LoadState.loading) {                   final loadingProgress = state.loadingProgress;                   final progress = loadingProgress?.expectedTotalBytes != null                       ? loadingProgress.cumulativeBytesLoaded /                           loadingProgress.expectedTotalBytes                       : null;                   return Center(                     child: Column(                       mainAxisAlignment: MainAxisAlignment.center,                       crossAxisAlignment: CrossAxisAlignment.center,                       children: <Widget>[                         SizedBox(                           width: 150.0,                           child: LinearProgressIndicator(                             value: progress,                           ),                         ),                         SizedBox(                           height: 10.0,                         ),                         Text('${((progress ?? 0.0) * 100).toInt()}%'),                       ],                     ),                   );                 }                 return null;               },             ),`

##### 图片预览上滑显示详情(跟图虫一样)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2097626b7d0a406ab769cb528a31388e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

当时在制作图片预览功能的时候，就暴露多了足够的api，提供给用户自定义各种效果， 由于Flutter手势的复杂以及冲突，我特意做了一个Demo提供出来。

至此[pic\_swiper.dart](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fflutter_candies_demo_library%2Fblob%2Fmaster%2Flib%2Fsrc%2Fwidget%2Fpic_swiper.dart "https://github.com/fluttercandies/flutter_candies_demo_library/blob/master/lib/src/widget/pic_swiper.dart")已拥有以下功能:

*   缩放
*   平移
*   上下一页图片
*   拖动退出预览
*   上滑显示详情

#### [extended\_image\_library](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fextended_image_library "https://github.com/fluttercandies/extended_image_library")

为extended\_image的基础库，如果你只需要网络图片缓存功能，你可以只引用这个库

dart

 代码解读

复制代码

    `Image(       image: ExtendedNetworkImageProvider("", cache: true),     );`

*   支持Web，[在线Demo](https://link.juejin.cn?target=https%3A%2F%2Ffluttercandies.github.io%2Fextended_image%2F "https://fluttercandies.github.io/extended_image/")
*   提供获取缓存图片的各种方法
*   方便获取图片的原数据(image的toByteData方法性能不佳)

#### [flutter\_image\_editor](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fflutter_image_editor "https://github.com/fluttercandies/flutter_image_editor")

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aeb7789547c54283a706511af9962fce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

flutter\_image\_editor可以说是低调为[extended\_image](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fextended_image "https://github.com/fluttercandies/extended_image")量身打造的原生插件，支持旋转裁剪翻转，extended\_image负责图片编辑UI，flutter\_image\_editor提供原生裁剪图片数据能力。由于dart [image](https://link.juejin.cn?target=https%3A%2F%2Fpub.flutter-io.cn%2Fpackages%2Fimage "https://pub.flutter-io.cn/packages/image")库在处理图片的效率问题，原生库(期待纯C++库)就有了很大的优势(大图片可以有10倍速度的提升)。

#### [flutter\_wechat\_assets\_picker](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies%2Fflutter_wechat_assets_picker "https://github.com/fluttercandies/flutter_wechat_assets_picker")

出自[Flutter劝退师Alex](https://juejin.cn/user/606586150596360 "https://juejin.cn/user/606586150596360")之手， 是一个对标微信的多选资源选择器，99%接近于原生微信的操作，纯Dart编写，支持选择的同时也支持预览资源。支持如下功能：

*   图片资源支持
*   视频资源支持
*   国际化支持
*   自定义文本支持

[原文章](https://juejin.cn/post/6844904119191207944 "https://juejin.cn/post/6844904119191207944")

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02b3353e8464d45b2e6efc0df4857f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/462de22dca514c828bc0486a859032f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e54eeba891248219a2d74fe250cfbcb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/445858c0339846fb8096b3b5dddc87c8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/428f628f805d43c2a1601903d3bcf8f0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c74f3cde5f546a2bdd6ee0519a6b731~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 结语

如果觉得还差点意思，欢迎提建议，欢迎pr。

欢迎加入[Flutter Candies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies "https://github.com/fluttercandies")，一起生产可爱的Flutter 小糖果(QQ群:181398081)

最最后放上[Flutter Candies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluttercandies "https://github.com/fluttercandies")全家桶，真香。

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4fabc96f7534fe3bae6c2e8685ca7df~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)