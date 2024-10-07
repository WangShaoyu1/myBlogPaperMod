---
author: "半点橘色"
title: "Flutter图片与文件选择器"
date: 2023-01-28
description: "春节已过，今天是开工的第一天。我已经一个多星期没碰过电脑了，今日上班，打开电脑的第一件事就是想着写点什么。反正大家都还沉浸在节后的喜悦中，还没进入工作状态，与其浪费时间，不如做些更有意义的事"
tags: ["Flutter","前端","Android"]
ShowReadingTime: "阅读2分钟"
weight: 413
---
春节已过，今天是开工的第一天。我已经一个多星期没碰过电脑了，今日上班，打开电脑的第一件事就是想着写点什么。反正大家都还沉浸在节后的喜悦中，还没进入工作状态，与其浪费时间，不如做些更有意义的事情。

今天就跟大家简单分享一下Flutter开发过程中经常会用到的图片和文件选择器。

### 一、image\_picker

一个适用于iOS和Android的Flutter插件，能够从图像库中选取图片、视频，还能够调用相机拍摄新的照片。

该插件由Flutter官方提供，github的Star高达16.7k，算是比较成熟且流行的插件了。

#### 1、安装

csharp

 代码解读

复制代码

`flutter pub add image_picker`

或者

dart

 代码解读

复制代码

`/// pubspec.yaml文件添加依赖，并在执行flutter pub get命令 dependencies   image_picker: ^0.8.6+1`

#### 2、使用

dart

 代码解读

复制代码

`import 'package:image_picker/image_picker.dart'; /// 图片选取 Future<void> getImage() async {     final XFile? file = await ImagePicker().pickImage(       source: ImageSource.gallery, // 图库选择       maxWidth: 1000.0, // 设置图片最大宽度，间接压缩了图片的体积     );          /// 选取图片失败file为null，要注意判断下。     /// 获取图片路径后可以上传到服务器上     print('${file?.path}'); } /// 视频选取 Future<void> getImage() async {     final XFile? file = await ImagePicker().pickVideo(       source: ImageSource.camera, // 调用相机拍摄     );     print('${file?.path}'); }`

在项目中，调用getImage方法就会打开图片选择器。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34804658ad1b4f658fe782c8e10dc440~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b73658df989b4a7aacf47dd6bd4c59a6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 3、属性

*   source

图片来源，ImageSource.gallery图片库中选择，ImageSource.camera调用相机拍摄新图片。

*   maxWidth

图片的最大宽度，source为ImageSource.camera时有用，等于间接的压缩了图片的体积。如果不设置，以目前手机的相机性能，动不动就拍出了4、5M的照片，对于app来说，图片上传到服务端，将会很慢，建议设置此属性。

#### 4、注意

iOS端如果出现闪退并且控制台报出：

> The app's Info.plist must contain an NSPhotoLibraryAddUsageDescription key with a string value explaining to the user how the app uses this data.

那么，需要打开Xcode在Info.plist配置隐私提示语。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c677897562944b0fa6a12ffbc2c5f297~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 二、flutter\_document\_picker

文档选择器，image\_picker只能选择图片和视频，如果要选择PDF，word文档、excel表格等就没办法了。这个时候可以使用flutter\_document\_picker插件，直接选取手机中的文件。

#### 1、安装

csharp

 代码解读

复制代码

`flutter pub add flutter_document_picker`

或者

dart

 代码解读

复制代码

`/// pubspec.yaml文件添加依赖，并在执行flutter pub get命令 dependencies   flutter_document_picker: ^5.1.0`

#### 2、使用

dart

 代码解读

复制代码

`import 'package:image_picker/image_picker.dart'; /// 图片选取 Future<void> getDocument() async {     FlutterDocumentPickerParams? params = FlutterDocumentPickerParams(         // 允许选取的文件拓展类型，不加此属性则默认支持所有类型         allowedFileExtensions: ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'jpeg'],     );     String? path = await FlutterDocumentPicker.openDocument(       params: params,     );     print('$path'); }`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/665da56bdbfc47a496e0829b35813329~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 总结

image\_picker插件用于图片选取，而flutter\_document\_picker则用于文件选择，在日常开发中都是很常用的。在iOS中使用要注意隐私权限的配置，不然就会闪退。如果想了解更多的参数属性，可以查看官方文档：

[image\_picker document](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fflutter%2Fplugins%2Ftree%2Fmain%2Fpackages%2Fimage_picker%2Fimage_picker "https://github.com/flutter/plugins/tree/main/packages/image_picker/image_picker")

[flutter\_document\_picker document](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsidlatau%2Fflutter_document_picker "https://github.com/sidlatau/flutter_document_picker")