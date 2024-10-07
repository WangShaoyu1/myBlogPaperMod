---
author: "岛上码农"
title: "Flutter入门与实战（七）：使用cached_network_image优化图片加载体验"
date: 2021-05-27
description: "在Flutter中，cached_image_network即提供了缓存网络图片功能，同时还提供了丰富的加载过程指示，可以大幅提升图片加载过程的体验和降低服务器资源占用。"
tags: ["Flutter","前端"]
ShowReadingTime: "阅读2分钟"
weight: 893
---
> 在 App 中会经常遇到需要从后台拉取图片的场景，这一方面会给服务器带来网络带宽消耗，另一方面加载图片的等待过程也会影响用户体验。因此，往往会在 App 端对图片做缓存机制，以避免同一张图片反复发起请求。在 Flutter 中，cached\_network\_image 即提供了缓存网络图片功能，同时还提供了丰富的加载过程指示。

上一篇[Flutter 入门与实战（六）：给列表增加下拉刷新和上滑加载更多功能](https://juejin.cn/post/6966225049783762980 "https://juejin.cn/post/6966225049783762980")，我们使用了列表，其中列表中有从网络下载图片。直接使用 Flutter 自带的 Image.network 下载图片一是无法缓存，二是体验不够好。熟悉 iOS 的肯定知道 SDWebImage，即 Objective-C 上用得最广泛的图片缓存开源组件。与 SDWebImage 类似，Flutter 的 `cached_network_image` 插件也实现了这样的功能。`cached_network_image` 使用十分简单，首先在 pubspec.yaml 中添加依赖：

yaml

 代码解读

复制代码

`dependencies:   flutter:     sdk: flutter   # ...其他依赖   cached_network_image: ^3.0.0`

之后在需要使用 `cached_network_image` 的地方引入源码：

dart

 代码解读

复制代码

`import 'package:cached_network_image/cached_network_image.dart';`

最后在需要加载网络图片的地方使用`cached_network_image` 替代原有的图片加载方式（如 Image.network）：

dart

 代码解读

复制代码

`CachedNetworkImage(imageUrl: "http://via.placeholder.com/350x150"),`

以上是 `cached_network_image` 最简单的用法，当然为了用户体验更好，推荐是使用占位图或加载指示器的方式提示用户图片正在加载。

#### 使用占位图

`CachedNetworkImage` 提供了占位图和加载失败后的错误指示的方法用于静态指示。我们分别准备 image-default.png 和 image-failed.png 文件表示默认占位图和加载失败后的占位图，然后用 `CachedNetworkImage` 构造方法的 `placeholder` 和 `errorWidget` 来使用占位图，如下所示：

dart

 代码解读

复制代码

`Widget _imageWrapper(String imageUrl) {     return SizedBox(       width: 150,       height: ITEM_HEIGHT,       child: CachedNetworkImage(         imageUrl: imageUrl,         placeholder: (context, url) => Image.asset('images/image-default.png'),         errorWidget: (context, url, error) =>            Image.asset('images/image-failed.png'),       ),     );   } }`

#### 使用进度加载指示

也可以使用进度加载指示器来指示加载进度，加载进度指示支持原型进度和线型进度。这种对于大图预览时会更为常用，代码如下所示，其中`LinearProgressIndicator`是线型指示器，`CircularProgressIndicator` 是圆形指示器：

dart

 代码解读

复制代码

`Widget _imageWrapper(String imageUrl) {     return SizedBox(       width: 150,       height: ITEM_HEIGHT,       child: CachedNetworkImage(         imageUrl: imageUrl,         progressIndicatorBuilder: (context, url, downloadProgress) =>             LinearProgressIndicator(value: downloadProgress.progress),         errorWidget: (context, url, error) =>             Image.asset('images/image-failed.png'),       ),     );   }`

#### 效果

效果如下图所示，下拉刷新后，可以先看到占位图，然后逐渐过渡到加载成功的图片。如果修改链接为一个非法链接或资源不存在的链接，则会显示图片加载失败的占位图。这种体验相比空白没有任何指示的 Image.network好很多。

![效果图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28369647b0804bb2af2643f9ef4b6c1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)