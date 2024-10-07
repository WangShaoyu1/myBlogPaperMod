---
author: "不是阿怪的阿怪"
title: "初识React-Native——开发环境搭建、选择和坑点"
date: 2021-07-19
description: "前言（废话）上次搞完小程序，老大说接下来有个项目，可能需要做App。我心想，先是管理后台、接着是H5、再到小程序，这回又搞App。要是这次搞完App那我岂不是也算多端通吃啦！？前端"
tags: ["ReactNative","JavaScript"]
ShowReadingTime: "阅读4分钟"
weight: 921
---
前言 （废话）
-------

上次搞完小程序，老大说接下来有个项目，可能需要做 App 。我心想，先是管理后台、接着是 H5、再到 小程序，这回又搞 App 。要是这次搞完 App 那我岂不是也算多端通吃啦！？前端入职一年一个月，都摸了一遍，咱也算见过世面的人了🤣，你说是吧。顿时干劲十足！

由于团队中没有专职做 Android/IOS 的小伙伴。自然就想到了跨端界的 「三大天王」 —— 「uni-app（内置weex）」、「React-Native」、「Flutter」。看到这三个框架，身体本能是选「uni-app」的，毕竟自己对 Vue 比较熟悉。人都是想偷懒的嘛。当我还在犹豫怎么选的时候，老大直接就拍板了，我们用「React-Native」。老大是搞后端的，之前团队基本都是用 Vue 的，也不知道他选择的原因。后来想想也无所谓，既然都没用过这三个框架开发 APP，反正都是要学，都行。毕竟技多不压身嘛！干就完事！

发现网上关于 「React-Native」的文章有些少，决定把自己的一些踩坑经验分享，也许能帮到大家呢。

下面是三个框架对比的文章，感兴趣可以看一下：

[ask.dcloud.net.cn/article/360…](https://link.juejin.cn?target=https%3A%2F%2Fask.dcloud.net.cn%2Farticle%2F36083 "https://ask.dcloud.net.cn/article/36083")

[www.gushiciku.cn/pl/pA6U](https://link.juejin.cn?target=https%3A%2F%2Fwww.gushiciku.cn%2Fpl%2FpA6U "https://www.gushiciku.cn/pl/pA6U")

开发环境的选择
-------

React Native 开发环境搭建对于没接触过 App 开发的朋友（我自己）来说是比较繁琐。有很多坑点，所以在搞事情之前，请做好心理准备。

开发环境安装教程—— [「官方文档」](https://link.juejin.cn?target=https%3A%2F%2Freactnative.cn%2Fdocs%2Fenvironment-setup "https://reactnative.cn/docs/environment-setup")

### 常规方式

#### Andorid

Windows 和 Mac 都可以安装 Android Studio 进行开发调试

*   安装 Android Studio，并下载SDK、模拟器系统镜像、NDK等配置
*   安装 Java 并配置环境变量
*   安装 Node

#### IOS

只有 Mac 能下载 Xcode。Windows 可以通过 VMware(虚拟机) 安装 Mac OS，再安装Xcode 理论上是可以实现的，本人没有试过，请自行踩坑

[「VMware 安装 Mac OS 教程 」](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F337036027 "https://zhuanlan.zhihu.com/p/337036027")

*   安装 Xcode
*   安装 Watchman （用于实时更新视图）
*   安装 CocoaPods （管理依赖，RN 0.60以上版本需要）
*   安装 Node

### 曲线救国 —— Expo

假如你是 Window 用户要开发 IOS App，又不想装虚拟机这么麻烦， Expo 应该是不错的选择。 你甚至不用搭建 Android 和 IOS 的开发环境 ！调试也很方便，扫一下二维码，然后就可以实时预览你的项目了。

当然 Expo 还有很多功能。例如，热更新、快速发布应用平台「Goolgle Play Store 和 App Store」。Expo 还可以解构成原生的 React Native 项目，然后用 Android Studio 和 Xcode 调试

既然 Expo 那么好为什么不用 Expo 呢？有利必有弊嘛

缺点「以下是笔友了解到的，不一定百分百准确」：

*   Expo 实际上是在 React Native 的基础上封装了一层。很多原生的功能都通过 JavaScript 来实现，这对于前端开发来说是好事，但是有些时候 Expo 提供的原生能力不能满足我们的需求，而 Expo 又不能直接使用原生的code（不会原生code 的我是不是就不用担心了🤣） ，就需要通过 `expo eject` 来解构成原生的 React Native 项目；
*   打包生成的安装包体积比原生的大；
*   部分 React Native 第三方库无法直接使用
*   Expo 热更新的 jsbundle 放在亚马逊的云服务器上的，国内网络环境的原因，可能下载不了或者很慢（听说是这样，其实也不算缺点，毕竟原生 React Native 项目还要自己搭建）

Expo 相关文章「推荐阅读」：

[「Expo 官方文档」](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.io%2F "https://docs.expo.io/")

[「React Native 原生项目 和 Expo 项目的区别」](https://link.juejin.cn?target=https%3A%2F%2Freactnative.maxieewong.com%2Fdocs%2Fintroduction%2Freact-native%2F "https://reactnative.maxieewong.com/docs/introduction/react-native/")

[「Expo 项目开发记录」](https://link.juejin.cn?target=https%3A%2F%2Fithelp.ithome.com.tw%2Fusers%2F20103342%2Fironman%2F1410%3Fpage%3D1 "https://ithelp.ithome.com.tw/users/20103342/ironman/1410?page=1")

生成项目的脚手架
--------

*   react-native-cli 「官方提供」 原汁原味，没啥好说
*   [create-react-native-app](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fexpo%2Fcreate-react-native-app "https://github.com/expo/create-react-native-app") 内置 expo ，不用手动搭建，有多种模板可以选择
*   [expo-cli](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.io%2Fworkflow%2Fexpo-cli%2F "https://docs.expo.io/workflow/expo-cli/") expo 官方提供的脚手架

开发环境安装
------

`本人用的是 Windows 的 Android Studio，Mac 的 Andorid Studio 和 Xcode 请自行踩坑`

文章主要说一下自己碰到的坑。请参考官网文档 —— [「开发环境搭建」](https://link.juejin.cn?target=https%3A%2F%2Freactnative.cn%2Fdocs%2Fgetting-started "https://reactnative.cn/docs/getting-started")

安装准备：

*   自备梯子 (很有依赖需要梯子才能下载)
*   耐心、耐心、耐心

坑点：

1.  Node 版本请下载大于12，小于 12.9 的版本，亲测 `RN 0.59 和 RN 6.1` ，Node 12.11 在运行 `react native start` 时报错；
    
2.  Gradle 下载完依赖之后，运行报错，可以适当调低Gradle插件和Gradle版本，两种方式调整。插件版本是有联系的，[「Gradle插件和Gradle版本对照表」](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fstudio%2Freleases%2Fgradle-plugin%23updating-plugin "https://developer.android.google.cn/studio/releases/gradle-plugin#updating-plugin")
    

*   Android Studio (方式一)

![微信图片_20210719183419.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f2ce80f0080417787ff4c2bbb65e307~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   `android/build.gradle`和 `android/gradle/wrapper/gradle-wrapper.properties`（方式二）

`android/build.gradle`

scss

 代码解读

复制代码

`dependencies { // 这里版本是3.3.1 classpath('com.android.tools.build:gradle:3.3.1') }`

`android/gradle/wrapper/gradle-wrapper.properties`

arduino

 代码解读

复制代码

`//这里版本是4.10.2 distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.2-bin.zip`

3.  Java 请下载 Java 8 ！

持续踩坑中...后面看情况更新。