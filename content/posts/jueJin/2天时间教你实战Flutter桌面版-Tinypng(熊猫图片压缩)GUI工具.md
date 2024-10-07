---
author: "jerryfans"
title: "2天时间教你实战Flutter桌面版-Tinypng(熊猫图片压缩)GUI工具"
date: 2022-01-07
description: "前言Tinypng是一个在设计和技术界十分流行的图片压缩网站，但是它只有网页版，没有GUI。目前的版本只打包了macos版本，window版本我有空找个机子再调试下，理论上无需太多改动。"
tags: ["Flutter","iOS","前端"]
ShowReadingTime: "阅读3分钟"
weight: 851
---
### 前言

[Tinypng](https://link.juejin.cn?target=https%3A%2F%2Ftinypng.com "https://tinypng.com")是一个在设计和技术界十分流行的图片压缩网站，但是它只有网页版，没有GUI。幸好的是它支持通过apikey直接运行api接口压缩图片，虽然业内已经有很多版本的GUI，Window，Mac都有，但是这几天学习Flutter Deskstop，正好可以用来实战。目前的版本已打包了macos版本及window版本。

### 代码过程

#### 实现选择文件

选择文件这块的实现，由于我本身是做iOS开发的，macOS原生开发其实也大同小异，但是为了兼容多端，我也懒得一个个写插件了，搜了下现成支持deskstop的插件发现[file\_picker](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Ffile_picker "https://pub.dev/packages/file_picker")这个插件完美支持我的想法，不管是window，mac，还是linux通通都支持。目前只支持选择jpg，png的文件，貌似webp和h265都是支持的，后期我可以加上。

scss

 代码解读

复制代码

`void _pickFiles() async { if (await controller.checkHaveApiKey() == false) { _showSettingBottomSheet(); showToast("Please enter your TinyPNG Apikey", textPadding: EdgeInsets.all(15)); return; } FilePickerResult? result = await FilePicker.platform.pickFiles(allowMultiple: true); if (result != null) { List<File> files = result.paths.map((path) => File(path ?? "")).toList(); List<File> chooseFiles = []; files.forEach((element) { if (element.path.toLowerCase().endsWith("jpg") || element.path.toLowerCase().endsWith("jpeg") || element.path.toLowerCase().endsWith("png")) { chooseFiles.add(element); } else { showToast('invalid image file', textPadding: EdgeInsets.all(15)); print("invalid image file : ${element.path}"); } }); if (chooseFiles.isNotEmpty) { controller.refreshWithFileList(chooseFiles); } } else { showToast("Cancel Pick files", textPadding: EdgeInsets.all(15)); } }`

#### 实现打开目录或者打开网址

这块一开始想了很久，iOS端是要通过urlLaunch跳转的，搜了下pub很多现场的库都只支持iOS和安卓对桌面不是很友好。突然灵机一动Swift脚本可以通过Process类直接运行terminal命令，dart是否有相关api支持？如果有的话打开目录 只需要一行命令 open xxx, 打开网址只需要open xxx.com。答案是显而易见的，dart也封装了 Proccess类，代码如下。

arduino

 代码解读

复制代码

`//打开图片压缩后目录 Process.run("open", [savePath]); //打开跳转网址 Process.run("open", ["https://tinypng.com/developers"]);`

#### 实现上传原图文件到Tiny

这个没啥好说，看看http规则，直接撸代码即可。

ini

 代码解读

复制代码

`Future<TinyImageInfo?> uploadOriginImage({required Uint8List? buffer}) async { SharedPreferences prefs = await SharedPreferences.getInstance(); var apiKey = prefs.getString(KApiKey); if (apiKey == null || apiKey.length == 0) { return null; } var url = "api.tinify.com"; Uri uri = Uri.https(url, "/shrink"); var auth = "api:$apiKey"; var authData = base64Encode(utf8.encode(auth)); var authorizationHeader = "Basic " + authData; var headers = { "Accept": "application/json", "Authorization": authorizationHeader, }; try { var response = await http.post(uri, headers: headers, body: buffer); if (response.statusCode != 201) { print("fail code is ${response.statusCode}"); return null; } else { var json = jsonDecode(utf8.decode(response.bodyBytes)); var jsonString = jsonEncode(json); print("success json $jsonString"); return TinyImageInfo.fromJson(json); } } catch (e) { print("catch upload error $e"); return null; } }`

#### 实现下载压缩后图片到自己目录

TinyPng上传原图成功而且压缩处理完成后会返回这样一串Json

{"input":{"size":84736,"type":"image/webp"},"output":{"size":68282,"type":"image/webp","width":658,"height":1009,"ratio":0.8058,"url":"[api.tinify.com/output/avxq…](https://link.juejin.cn?target=https%3A%2F%2Fapi.tinify.com%2Foutput%2Favxq4rhjha1apfra92pzfnrcj2n0zdbx%2522%257D%257D "https://api.tinify.com/output/avxq4rhjha1apfra92pzfnrcj2n0zdbx%22%7D%7D")

里面包含了压缩率，原图size,压缩后size,压缩后输出地址等等。有了这个json我们自然就能构建我们的UI了。

dart

 代码解读

复制代码

`Future<bool> downloadOutputImage(TinyImageInfo imageInfo, String savePath, {Function(int count, int total)? onReceiveProgress}) async { String? url = imageInfo.output?.url; String? type = imageInfo.output?.type; if (url == null || type == null) { return false; } Uri uri = Uri.parse(url); var dio = Dio(); try { var rsp = await dio.downloadUri( uri, savePath, options: Options( headers: {"Accept": type, "Content-Type": "application/json"}, ), onReceiveProgress: (count, total) { onReceiveProgress?.call(count, total); }, ); return rsp.statusCode == 200; } catch (e) { return false; } }`

#### Mac应用权限问题

要配置一下这几个权限，不然应用会各种权限报错。

xml

 代码解读

复制代码

`<key>com.apple.security.app-sandbox</key> <false/> <key>com.apple.security.cs.allow-jit</key> <true/> <key>com.apple.security.network.server</key> <true/> <key>com.apple.security.network.client</key> <true/> <key>com.apple.security.files.user-selected.read-write</key>`

#### 状态管理

我用了目前比较流行的Gex状态管理，只需要监听几个属性即可。

ini

 代码解读

复制代码

`final PathProviderPlatform provider = PathProviderUtil.provider(); var taskList = <TinyImageInfoItemViewModel>[].obs; var savePath = "".obs; var apiKey = "".obs; var taskCount = 0.obs; var saveKb = 0.0.obs;`

#### 用到的三方库

*   [http](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fhttp "https://pub.dev/packages/http")
    
*   [dio](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fdio "https://pub.dev/packages/dio")
    
*   [file\_picker](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Ffile_picker "https://pub.dev/packages/file_picker")
    
*   [path\_provider](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fpath_provider "https://pub.dev/packages/path_provider")
    
*   [path\_provider\_macos](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fpath_provider_macos "https://pub.dev/packages/path_provider_macos")
    
*   [get](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fget "https://pub.dev/packages/get")
    
*   [oktoast](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Foktoast "https://pub.dev/packages/oktoast")
    
*   [shared\_preferences](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fshared_preferences "https://pub.dev/packages/shared_preferences")
    

#### 项目地址

此项目完全开源，想学习的小伙伴可以去GitHub查看，有帮助到你们的麻烦给个Star哈。此项目基于Flutter 2.2.3开发，理论上是兼容更高的版本。（没有实测）

[github.com/JerryFans/T…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJerryFans%2FTinyPNG4Flutter "https://github.com/JerryFans/TinyPNG4Flutter")

#### 安装包

不想编译的可以直接用安装包

MacOS

[dmg安装包](https://link.juejin.cn?target=http%3A%2F%2Fimage.jerryfans.com%2FpictureCompresser.dmg "http://image.jerryfans.com/pictureCompresser.dmg")

[pkg安装包](https://link.juejin.cn?target=http%3A%2F%2Fimage.jerryfans.com%2FpictureCompresser.pkg "http://image.jerryfans.com/pictureCompresser.pkg")

Windows

[安装包](https://link.juejin.cn?target=http%3A%2F%2Fimage.jerryfans.com%2FtinyPngToolForWindows.zip "http://image.jerryfans.com/tinyPngToolForWindows.zip")

#### 未来

1、window版本打包 ☑️

2、linux版本？ （貌似用的群体不多吧）

3、mac版本支持文件拖拽过去（看了mac AppKit文档，这个其实不是很难，只需要做个插件就行，未来会做好并开源) ☑️ 最新版已支持请看我这篇文章->[你们要的Flutter桌面版拖动复制文件插件开源啦](https://juejin.cn/post/7052723837363814437 "https://juejin.cn/post/7052723837363814437")

4、上架AppStore提供给麻瓜用