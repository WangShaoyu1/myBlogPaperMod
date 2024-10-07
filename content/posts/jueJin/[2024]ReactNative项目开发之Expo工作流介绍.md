---
author: "无尽意"
title: "[2024]ReactNative项目开发之Expo工作流介绍"
date: 2024-04-11
description: "Expo工作流下ReactNative项目构建方式的介绍和对比、第三方库的引入方式、原生模块开发等的介绍。"
tags: ["前端"]
ShowReadingTime: "阅读6分钟"
weight: 902
---
最近在学习使用 Expo 工作流来开发 React Native 项目，网上的教程大多过时了，于是读了一遍 Expo 官网的文档，下面是对目前（_Expo SDK 50_） React Native 项目构建方式的介绍和对比、第三方库的引入方式、原生模块开发等的介绍。

构建方式
----

目前 React Native 项目的构建存在三种形式：

*   bare React Native project
*   Expo managed project
*   Expo development builds

bare React Native project
-------------------------

bare React Native project 就是用 React Native CLI 创建的项目。

shell

 代码解读

复制代码

`npx react-native@latest init AwesomeProject`

Expo managed project
--------------------

[React Native 官方文档](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fenvironment-setup "https://reactnative.dev/docs/environment-setup") 还提到了另一种创建项目的方式：

shell

 代码解读

复制代码

`npx create-expo-app AwesomeProject`

这时项目就是由 Expo CLI 创建的，叫做 Expo managed project。

Expo managed project 最典型的特征就是**项目根目录下没有 ios 和 android 文件夹**。

在这种形式下，项目可以直接运行在 Expo Go 中。Expo Go 是一个 App，在你启动项目（`npx expo start`）后，会被安装在电脑的 ios 和 android 模拟器中对项目进行调试。你也可以在真机中下载安装 Expo Go，当设备和电脑在同一个网络环境下时，修改项目代码，真机中的应用也会自动刷新。

### 优缺点

**优点**：

*   快速上手，环境配置友好，开发调试方便（_在 windows 系统下也能调试 ios_）
*   使用 Expo SDK 无需关心原生配置

**缺点**：

*   不支持需要原生配置的第三方库（_不在 Expo SDK 内的_）
*   不支持集成原生代码

development builds
------------------

前面说到，Expo managed project 不支持需要原生配置的第三方库。

举个例子，你想要解压缩一个 zip 文件，但是在 Expo SDK 里找不到支持的库。于是你找到一个第三方库 [react-native-zip-archive](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmockingbot%2Freact-native-zip-archive "https://github.com/mockingbot/react-native-zip-archive")，库的 README 提示你除了 `npm install` 外，还需要 `cd ./ios && pod install`，这个时候就涉及原生配置了，需要将 Expo managed project 构建成 development builds。

在 development builds 下，你可以**安装任何 React Native 第三方库，修改任何项目配置，或者集成你自己的原生模块代码**。

### 构建过程

构建过程很简单，不需要有任何心智负担。

下面介绍使用**本地应用构建**的方式将 Expo managed project 转换成 development builds（_你也可以使用 Expo 提供的云端付费构建服务 EAS Build [Create your first build](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fbuild%2Fsetup%2F "https://docs.expo.dev/build/setup/")_）：

1.  你有 macOS 电脑并且已经配置好了环境，参照：[Local app development - Expo Documentation](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fguides%2Flocal-app-development%2F "https://docs.expo.dev/guides/local-app-development/")
    
2.  接下来安装 `expo-dev-client`：
    

shell

 代码解读

复制代码

`npx expo install expo-dev-client`

3.  然后在项目入口 `App.{js|tsx}` 或 `app/_layout.tsx` 中引入 `expo-dev-client`。它的作用是为项目开发调试提供支持。

tsx

 代码解读

复制代码

`import "expo-dev-client";`

4.  开始转换

shell

 代码解读

复制代码

`npx expo prebuild`

这个过程需要几十分钟，最后会在项目根目录下生成 ios 和 android 文件夹。

5.  使用本地应用编译启动项目（_可以写入 `package.json` 的脚本中方便下次启动_）

shell

 代码解读

复制代码

`npx expo run:ios npx expo run:android`

**注意**：你可以选择跳过 `npx expo prebuild` 直接运行 `npx expo run:[ios|android]`，它检测到当前项目没有 ios 或 android 目录后会自动进行 prebuild，两者的效果是一样的。

### 修改原生文件注意事项

在后面的开发中，如果你**手动修改**了 ios 和 android 目录下的文件，你将**无法安全运行** `npx expo prebuild`，因为这会覆盖掉你的改动。这也就意味着以后你将手动管理原生配置，尽量避免这么做。（_详情见 ：[Add custom native code - Expo Documentation](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fworkflow%2Fcustomizing%2F%23manage-custom-native-projects "https://docs.expo.dev/workflow/customizing/#manage-custom-native-projects")_）

### 安装第三方库

对于大部分第三方库，比如上面提到的 [react-native-zip-archive](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmockingbot%2Freact-native-zip-archive "https://github.com/mockingbot/react-native-zip-archive")，需要在 `npm install` 之后运行 `pod install` 去安装原生依赖。但是在使用 Expo CLI 创建的项目中，因为 [Autolinking](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fmodules%2Fautolinking%2F "https://docs.expo.dev/modules/autolinking/") 的存在，你无需手动去安装原生依赖，只需要安装完 node 依赖后 `prebuild` 就可以了。

对于少部分第三方库，可能还需要修改 ios 和 android 目录下的一些静态配置（_比如 AndroidManifest.xml 、Info.plist_），你需要使用 Expo [config plugin](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fconfig-plugins%2Fintroduction%2F "https://docs.expo.dev/config-plugins/introduction/")。它可以理解为在 `prebuild` 过程中去自定义一些原生文件的改动，这样一来就可以再次安全地 `prebuild` 了。

### 集成原生代码

有时候第三方库也无法满足你的要求，这个时候你就需要编写原生代码去调用平台 API 实现自己的功能。

[Expo Modules](https://link.juejin.cn?target=https%3A%2F%2Fdocs.expo.dev%2Fmodules%2Foverview%2F "https://docs.expo.dev/modules/overview/") 可让你使用 **Swift** 和 **Kotlin** 以自然的方式编写原生代码，减少模版代码，并且保持平台表现一致。它提供了一组 API 和实用工具，可改善为 Expo 和 React Native 开发原生模块的过程并扩展你的应用功能。

React Native 0.68 推出的 [新架构](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fthe-new-architecture%2Flanding-page "https://reactnative.dev/docs/the-new-architecture/landing-page") ：原生模块的编写需要适配两个新系统： [Turbo Modules](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fthe-new-architecture%2Fpillars-turbomodules "https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules") 和 [Fabric](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Farchitecture%2Ffabric-renderer "https://reactnative.dev/architecture/fabric-renderer") ，并且常常需要编写一些 C++ 代码，这带来了更多开发和调试上的困难。

Expo Modules 的开发默认支持新架构，并且 Expo Modules API 的设计考虑到了上面提到的问题，它的目标是使其与渲染器无关，这样模块就不需要知道应用程序是否在新架构上运行，从而大大降低了原生模块开发人员的成本。

还有一点， Expo Modules 不会破坏 `prebuild` 的安全性。

### 对比 Expo managed project

**优点**：

*   支持安装任何第三方库
*   支持原生代码集成
*   支持修改任何项目配置

**缺点**：

*   本地应用构建需要 macOS 电脑

### 对比 bare React Native project

Expo development builds 和 bare React Native project 没有本质上的区别，你完全可以在用 React Native CLI 创建的项目中通过安装 Expo 相关的工具库来达到一样的效果，但是配置过程很麻烦，不如一开始就用 Expo CLI 初始化项目了。并且 Expo SDK 中提供的库完全可以在 Bare React Native project 中使用。

使用 Expo 工作流的好处是很明显的，它代替你去手动管理原生文件，让你专注业务逻辑开发，并且提供了有着良好维护的 SDK 去调用平台功能。对于初学者来说可以无脑用 Expo 创建一个项目。

一些踩坑
----

*   使用 pnpm 包管理器无法启动项目：[byCedric/expo-monorepo-example: Fast pnpm monorepo for cross-platform apps built with Expo / React Native and React.](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FbyCedric%2Fexpo-monorepo-example%23pnpm-workarounds "https://github.com/byCedric/expo-monorepo-example#pnpm-workarounds")
*   后续遇到了再更新...

总结
--

*   2024 年了，可以选择 Expo CLI 来创建项目了
*   只使用 Expo SDK 无法满足需求时随时可以把项目转为 development builds
*   development builds 和 bare React Native project 没有本质上的区别
*   Expo 工作流带来了更多开发、配置和调试上的便利
*   development builds 下尽量避免手动修改原生目录下的文件，而是通过 Expo config plugin 去配置
*   原生模块代码的开发考虑使用 Expo Modules