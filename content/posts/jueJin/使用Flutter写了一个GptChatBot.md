---
author: "brzhang"
title: "使用Flutter写了一个GptChatBot"
date: 2023-03-25
description: "基于一个flutter脚手架,开发的一款支持全平台打包的可以和ChatGPT聊天的App！支持stream方式返回，相应速度极快！"
tags: ["ChatGPT","GPT","Flutter"]
ShowReadingTime: "阅读1分钟"
weight: 885
---
[![](https://github.com/bravekingzhang/flutter_chat_box/raw/main/artificial/20230324_203035.gif)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_chat_box%2Fblob%2Fmain%2Fartificial%2F20230324_203035.gif "https://github.com/bravekingzhang/flutter_chat_box/blob/main/artificial/20230324_203035.gif")

基于一个flutter脚手架 [github.com/bravekingzh…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_template_mason "https://github.com/bravekingzhang/flutter_template_mason") ，开发的一款可以和ChatGPT聊天的App！支持桌面和移动端，做了一个简单的屏幕适配。

ui 结构上参考 项目 [github.com/Bin-Huang/c…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FBin-Huang%2Fchatbox "https://github.com/Bin-Huang/chatbox")

**全平台支持**

*   macOS✅
*   Linux✅
*   Windows✅
*   Android✅
*   iOS✅

项目中提供macOS打包版本，

本地开发
====

1.  git clone [github.com/bravekingzh…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter%255C_chat%255C_box.git "https://github.com/bravekingzhang/flutter%5C_chat%5C_box.git")
2.  flutter pub get
3.  flutter build macos/linux/windows/android/ios

特性展示
====

*   支持代码着色
*   使用stream 流式 API 请求，响应比较快
*   清爽的UI

[![](https://github.com/bravekingzhang/flutter_chat_box/raw/main/artificial/WechatIMG249.jpeg)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_chat_box%2Fblob%2Fmain%2Fartificial%2FWechatIMG249.jpeg "https://github.com/bravekingzhang/flutter_chat_box/blob/main/artificial/WechatIMG249.jpeg")

[![](https://github.com/bravekingzhang/flutter_chat_box/raw/main/artificial/WechatIMG250.jpeg)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_chat_box%2Fblob%2Fmain%2Fartificial%2FWechatIMG250.jpeg "https://github.com/bravekingzhang/flutter_chat_box/blob/main/artificial/WechatIMG250.jpeg")

[![](https://github.com/bravekingzhang/flutter_chat_box/raw/main/artificial/WechatIMG251.jpeg)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_chat_box%2Fblob%2Fmain%2Fartificial%2FWechatIMG251.jpeg "https://github.com/bravekingzhang/flutter_chat_box/blob/main/artificial/WechatIMG251.jpeg")

Mobile support
==============

[![](https://github.com/bravekingzhang/flutter_chat_box/raw/main/artificial/mobile.png)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbravekingzhang%2Fflutter_chat_box%2Fblob%2Fmain%2Fartificial%2Fmobile.png "https://github.com/bravekingzhang/flutter_chat_box/blob/main/artificial/mobile.png")

支持特性
====

*   多语言支持
*   单元测试
*   组件测试
*   优秀的全局数据管理方式 flutter\_bloc
*   flutter\_bloc\_test
*   主题切换
*   统一的路由管理