---
author: "chavesgu"
title: "Flutter相册选择image_picker"
date: 2020-10-23
description: "flutter相册选择图片视频，在app应用中，用到媒体文件的场景还是很多的，在使用率很高的社交软件微信中，"
tags: ["Flutter"]
ShowReadingTime: "阅读2分钟"
weight: 834
---
在app应用中，用到媒体文件的场景还是很多的，在使用率很高的社交软件微信中，相信大家在聊天窗口中经常会发送手机相册中的图片和视频，大家对微信的图片视频选择工具也形成视觉习惯，那么下面我会分享如何在自己的flutter应用中实现它。

**flutter插件地址: [images\_picker](https://link.juejin.cn?target=https%3A%2F%2Fpub.flutter-io.cn%2Fpackages%2Fimages_picker "https://pub.flutter-io.cn/packages/images_picker")**

### 功能支持

1.  打开相册选择单个或多个图片视频
2.  使用相机拍照或拍摄视频
3.  按自定义比例裁剪选择的图片
4.  压缩选择的图片
5.  部分国际化

### 引入插件和客户端权限配置

1.  将插件引入`pubspec.yaml`

yaml

 代码解读

复制代码

`dependencies:   images_picker: ^0.0.4`

2.  android配置`AndroidManifest.xml`

xml

 代码解读

复制代码

`<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" /> <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" /> <uses-permission android:name="android.permission.CAMERA" /> <uses-permission android:name="android.permission.RECORD_AUDIO" />`

3.  ios配置`info.list`

vbnet

 代码解读

复制代码

`<key>NSCameraUsageDescription</key> <string>告诉用户你使用相机的目的</string> <key>NSMicrophoneUsageDescription</key> <string>告诉用户你使用麦克风的目的</string> <key>NSPhotoLibraryUsageDescription</key> <string>告诉用户你使用相册的目的</string>`

!

 代码解读

复制代码

`不配置权限会导致无法成功编译`

### 使用方法

1.在需要使用的页面import

dart

 代码解读

复制代码

`import "package:images_picker/images_picker.dart";`

2.调用api

*   打开相册选择图片

dart

 代码解读

复制代码

`Future getImage() async {     List<Media> res = await ImagesPicker.pick(       count: 3, // 最大可选择数量       pickType: PickType.image, // 选择媒体类型，默认图片     ); }`

> Media是内部定义的类，包含3个属性  
> String thumbPath // 媒体文件的缩略图  
> String path // 媒体文件的本地路径  
> double size // 文件大小kb

*   打开相机拍照

dart

 代码解读

复制代码

`ImagesPicker.openCamera(   pickType: PickType.video, // 拍摄视频   maxTime: 15, // 最大拍摄时间,秒 );`

*   增加选择图片后的裁剪

dart

 代码解读

复制代码

`ImagesPicker.pick(   // ...   // when cropOpt isn't null, crop is enabled   cropOpt: CropOption(     aspectRatio: CropAspectRatio.custom,     cropType: CropType.circle, // currently for android   ), );`

*   增加选择图片后的压缩

dart

 代码解读

复制代码

`ImagesPicker.pick(   // ...   // when maxSize/quality isn't null, compress is enabled   quality: 0.8, // only for android   maxSize: 500, // only for ios (kb) );`

*   所有参数解析

java

 代码解读

复制代码

`// for pick int count = 1, 最大选择数量 PickType pickType = PickType.all, 选择媒体类型 bool gif = true, 是否支持gif CropOption cropOpt, 裁剪配置 int maxSize, double quality, // for camera PickType pickType = PickType.image, int maxTime = 15, CropOption cropOpt, int maxSize, double quality,`

3.  上传媒体文件至服务器示例

dart

 代码解读

复制代码

`String fileName = file.path.split('/').last; FormData formData = FormData.fromMap({   "file": await MultipartFile.fromFile(file.path, filename: fileName), }); Response res = await api.post("/upload", data: formData);`

> 此处示例使用了http请求库[dio](https://link.juejin.cn?target=https%3A%2F%2Fpub.flutter-io.cn%2Fpackages%2Fdio "https://pub.flutter-io.cn/packages/dio")

**欢迎star和issue**

[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fchavesgu%2Fimages_picker "https://github.com/chavesgu/images_picker")