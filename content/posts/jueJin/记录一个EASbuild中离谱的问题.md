---
author: "ZQDesigned"
title: "记录一个EASbuild中离谱的问题"
date: 2024-05-19
description: "这是一个由eas和Xcode共同导演的异常问题，兜得我团团转。不保证所呈现内容完全正确，仅为本人的主观分析和观点，如有错误还请批评指正～"
tags: ["客户端","ReactNative","iOS"]
ShowReadingTime: "阅读10分钟"
weight: 900
---
前言
--

先给不熟悉 Expo 的同学普及一下 Expo 这个东西吧，避免看着看着发蒙。

Expo 是一个用于构建 React Native 应用的开源平台，提供了一整套工具和服务，使开发者能够更轻松地创建、部署和管理移动应用。

### 1\. **基础概念**

*   **React Native**: 一个由 Facebook 开发的框架，允许使用 JavaScript 和 React 来构建跨平台的移动应用（iOS 和 Android）。
*   **Expo**: 一个增强 React Native 开发体验的框架，提供了一整套工具和服务，包括开发环境、构建工具、发布和更新服务。

### 2\. **核心组件**

1.  **Expo CLI**: 命令行工具，用于创建和管理 Expo 项目。提供了快速启动、运行和打包应用的功能。
2.  **Expo Go**: 一个移动应用，可以在 iOS 和 Android 上安装。它允许开发者在设备上运行他们的应用，而无需每次都重新编译整个应用。
3.  **Expo SDK**: 提供了一系列 API 和原生模块，例如相机、传感器、位置服务等，使得开发者无需编写原生代码即可使用设备的原生功能。

### 3\. **主要功能和特性**

1.  **即刻预览**: 使用 Expo Go 应用，可以实时预览和调试应用，无需等待漫长的构建过程。
2.  **跨平台支持**: 一次编写代码，应用可以同时运行在 iOS 和 Android 平台上，减少了开发时间和维护成本。
3.  **丰富的组件和 API**: Expo SDK 包含大量的预构建组件和 API，如图像处理、媒体播放、位置服务、传感器数据获取等。
4.  **OTA 更新**: 支持 Over-the-Air（OTA）更新，开发者可以在不经过应用商店审核的情况下直接推送更新到用户设备。（当然，不推荐你这么做，有大功能更新的时候还是要老老实实发新版本去过审核的，不然小心处罚^\_^）
5.  **构建服务**: 提供了云端构建服务，开发者可以将应用打包成 APK 和 IPA 文件，无需配置本地构建环境。
6.  **应用发布**: 与 App Store 和 Google Play 集成，简化了应用发布和管理的流程。

### 4\. **工作流程**

1.  **创建项目**: 使用 Expo CLI 创建一个新的项目：
    
    bash
    
     代码解读
    
    复制代码
    
    `expo init my-new-project`
    
2.  **开发和调试**: 使用 Expo CLI 启动开发服务器，并在 Expo Go 应用中扫描 QR 码以预览应用：
    
    bash
    
     代码解读
    
    复制代码
    
    `expo start`
    
3.  **构建应用**: 使用 Expo 的云端构建服务将应用打包：
    
    bash
    
     代码解读
    
    复制代码
    
    `expo build:android expo build:ios`
    
4.  **发布更新**: 使用 OTA 更新功能发布新的版本：
    
    bash
    
     代码解读
    
    复制代码
    
    `expo publish`
    

### 5\. **优势和劣势**

#### 优势：

*   **快速开发**: 即时预览和调试功能加速了开发流程。
*   **简化构建**: 无需复杂的本地构建环境配置，云端构建服务非常方便。
*   **丰富的资源**: 提供了大量的 API 和组件，减少了对原生代码的需求。
*   **持续更新**: OTA 更新功能允许快速发布和修复应用问题。

#### 劣势：

*   **限制性**: 虽然 Expo 提供了丰富的功能，但在某些高级场景下，可能需要“脱离” Expo（即 eject）以获得更高的自定义能力。
*   **依赖性**: 强依赖于 Expo 的生态系统，如果需要使用不在 Expo SDK 内的第三方原生模块，可能会遇到挑战。

### 6\. **常见问题**

1.  **什么是“脱离” Expo？** “脱离” Expo（eject）是指从标准的 Expo 工作流中移除，以获得完全的原生代码访问权限。这个操作在需要使用不受支持的原生模块时可能是必要的。
    
    bash
    
     代码解读
    
    复制代码
    
    `expo eject`
    
2.  **Expo 支持的最大应用规模？** 对于大多数应用来说，Expo 足以应对。但对于非常复杂的应用，特别是那些需要深度定制或高性能优化的，可能需要脱离 Expo 来满足需求。
    

接下来再介绍一下由 expo 官方提供的 eas。

EAS（Expo Application Services）和 EAS CLI 是 Expo 生态系统中的重要组件，专门用于增强应用的构建、提交和更新流程。

### 1\. **EAS（Expo Application Services）**

EAS 是 Expo 提供的一系列云服务，旨在简化和优化移动应用的构建、提交和更新。EAS 主要包括以下几个部分：

1.  **EAS Build**: 一个云端构建服务，使开发者能够在不配置本地构建环境的情况下构建应用的 iOS 和 Android 包。它支持自定义构建配置和缓存，加快了构建速度和效率。
2.  **EAS Submit**: 一个自动化提交服务，帮助开发者将构建的应用包提交到 App Store 和 Google Play。它处理了提交过程中的复杂步骤，减少了手动操作。
3.  **EAS Update**: 一个 OTA（Over-the-Air）更新服务，允许开发者在不经过应用商店审核的情况下，直接将应用更新推送给用户。这对于快速修复问题和发布新功能非常有用。

### 2\. **EAS CLI**

EAS CLI 是一个命令行工具，专门用于与 EAS 服务交互。它简化了构建、提交和更新的流程。以下是 EAS CLI 的一些常见命令和功能：

1.  **安装 EAS CLI**
    
    bash
    
     代码解读
    
    复制代码
    
    `npm install -g eas-cli`
    
2.  **登录到 Expo 账户** 使用 EAS CLI 之前，需要登录到你的 Expo 账户：
    
    bash
    
     代码解读
    
    复制代码
    
    `eas login`
    
3.  **初始化 EAS 项目** 初始化项目以使用 EAS：
    
    bash
    
     代码解读
    
    复制代码
    
    `eas init`
    
4.  **构建应用（EAS Build）** 创建并提交构建任务：
    
    bash
    
     代码解读
    
    复制代码
    
    `eas build --platform ios eas build --platform android`
    
    这会启动一个云端构建过程，并返回构建的状态和结果。
    
5.  **提交应用（EAS Submit）** 将构建的应用包提交到应用商店：
    
    bash
    
     代码解读
    
    复制代码
    
    `eas submit --platform ios --path ./path-to-your-ios-build.ipa eas submit --platform android --path ./path-to-your-android-build.apk`
    
6.  **发布更新（EAS Update）** 使用 OTA 更新功能发布新版本：
    
    bash
    
     代码解读
    
    复制代码
    
    `eas update --branch production`
    

### 3\. **EAS 的优势**

1.  **无缝集成**: EAS 与 Expo 的其他工具和服务无缝集成，提供了一体化的开发体验。
2.  **自动化流程**: 极大简化了应用的构建、提交和更新过程，减少了手动操作和可能的错误。
3.  **可扩展性**: 支持自定义构建配置和插件，使得开发者能够根据需要调整构建过程。
4.  **快速迭代**: EAS Update 允许开发者快速推送和回滚更新，提高了应用的响应速度和灵活性。

### 4\. **常见问题**

1.  **EAS 是否适合所有应用？** 对于大多数中小型应用，EAS 提供了极大的便利和效率。然而，对于非常复杂或需要特定原生模块的应用，可能需要更多的自定义配置，甚至脱离 Expo 的标准工作流。
    
2.  **EAS 的费用问题** EAS 提供了免费和付费的服务层级，具体费用和服务内容可以在 Expo 的官方网站上查看。免费层级足以满足许多开发者的基本需求，但高级功能可能需要订阅付费服务。
    

进入正题
----

对于使用过 eas 进行 app 发布构建的同学，应该很熟悉，在通过 eas build 功能针对 iOS 平台进行构建的时候，往往是如下流程：

*   询问是否登录 Apple Developer Account（这里我们默认登录来推动后文）
*   检查账户各种权限，比如所属组织，是否有 app 对应的 Bundle Identifier 的权限
*   检查 expo.dev 上是否存有该 app 的 Credential（这里我们先假设没有）
*   询问是否创建证书（**大的要来了**）
*   询问是否创建 Provisioning Profile
*   万事俱备，开始构建打包

看起来步骤没什么问题，对吧，做过客户端的同学应该知道构建原生 app 也是类似的流程。

那么问题会出在哪里呢？

当我们在创建一个苹果开发者证书用于在 iOS 平台发行软件时，一般有下面两种证书可供选择，第一个红框内的证书类型一般可以用于在 Apple 的各种平台上发行软件，第二个红框内的证书类型仅能用于在 iOS 平台及其类似物上发行软件。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/927e7755331843cb8c8e05dddf632680~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2580&h=1790&s=353769&e=png&b=fefefe)

如果你直接让 eas 去创建新的证书的话，他会选择第二个方框内的证书，而不是第一种。（可能是为了避免过多占用通用证书的数额？）问题就此产生了。

如果你在创建证书这一步，全部采用了让 eas 自动处理的方案，那么你无论如何都会卡在\[RUN\_FASTLANE\]这一步。

日志大概是这样的：

plaintext

 代码解读

复制代码

``[RUN_FASTLANE] $ set -o pipefail && xcodebuild -workspace ./app.xcworkspace -scheme app -configuration Release -destination 'generic/platform=iOS' -archivePath /Users/zouquan/Library/Developer/Xcode/Archives/2024-05-18/app\ 2024-05-18\ 00.28.34.xcarchive archive | tee /var/folders/3f/ztqbb65x59g574k08xpxmlvm0000gn/T/eas-build-local-nodejs/6fe42fec-e19c-456e-8da6-b575d4d1aa96/logs/app-app.log > /dev/null  [RUN_FASTLANE] ▸ ** ARCHIVE FAILED **  [RUN_FASTLANE] ** ARCHIVE FAILED **  [RUN_FASTLANE] Exit status: 65  [RUN_FASTLANE]  [RUN_FASTLANE] +---------------------------------------+  [RUN_FASTLANE] | Build environment |  [RUN_FASTLANE] +-------------+-------------------------+  [RUN_FASTLANE] | xcode_path | /Applications/Xcode.app |  [RUN_FASTLANE] | gym_version | 2.220.0 |  [RUN_FASTLANE] | sdk | iPhoneOS17.4.sdk |  [RUN_FASTLANE] +-------------+-------------------------+  [RUN_FASTLANE] Looks like fastlane ran into a build/archive error with your project  [RUN_FASTLANE] It's hard to tell what's causing the error, so we wrote some guides on how  [RUN_FASTLANE] to troubleshoot build and signing issues: https://docs.fastlane.tools/codesigning/getting-started/  [RUN_FASTLANE] Before submitting an issue on GitHub, please follow the guide above and make  [RUN_FASTLANE] sure your project is set up correctly.  [RUN_FASTLANE] fastlane uses `xcodebuild` commands to generate your binary, you can see the  [RUN_FASTLANE] the full commands printed out in yellow in the above log.  [RUN_FASTLANE] Make sure to inspect the output above, as usually you'll find more error information there  [RUN_FASTLANE]  [RUN_FASTLANE] [!] Error building the application - see the log above``

FastLane 我在这里不赘述，因为对正文没有帮助，你只需要知道 eas 使用它来为 iOS 原生项目注入证书配置然后构建就可以了。

我们先看第一行命令，这是一个管道指令，前面的 `set -o pipefail` 命令表示管道指令中有任何一个退出码不为 `0` ，最后的退出码都不为 `0` 。

也就是说，打包中存在了问题。其实直到这里我都没有怀疑是 eas 生成的证书配置存在问题，甚至还尝试了诸如重启电脑、重新配置 Xcode CLI 、重装 Xcode 等等的操作。（其实还是因为 expo 开发的时候默认是不启用原生项目的，我也一直没打开原生项目去看）

因为我是做客户端出身的，做跨端时如果构建存在问题了，只要不是日志明确指示是跨端的业务代码存在清晰问题，我都会有事没事就想着去看看原生项目会不会存在问题。经过查阅官方文档，我得知可以通过如下命令来在项目中启用原生项目文件夹：

bash

 代码解读

复制代码

`npx expo prebuild`

熟练的打开原生项目，点到每个标签页查看配置。这时候我发现 Release 里面的签名配置没有填，于是我在 Apple Developer Portial 上下载了这个项目当时生成的 Provisioning Profile ，导入了进去。这次，终于发现了问题：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44765d0097f14b30b821e3062aa5f073~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1404&h=794&s=113640&e=png&b=fbfbfb)

写这篇文章的时候我已经解决了这个问题，当时在 Apple Developer Portial 上面是可以看到这个 Profile 是正确的绑定了由 eas 自动生成的 iOS Distribution 类型的证书的。一开始我以为只是单纯的 eas 在执行自动生成的操作时出现了 bug，于是我手动弄了一个绑定到这张证书上的 Provisioning Profile。嘿，您猜怎么着？还是寄了！至此，正式破案，这是一个 eas 和 Xcode 共同导演的异常问题。 eas 出于节约证书资源的目的，创建了 iOS Distribution 类型的证书，结果 Xcode 不接受这个类型的证书（我也不清楚是不是有我本地环境的问题，先这样写，以后发现了再改），最终导致了问题出现。

最终我改用了 Apple Distribution 类型的证书，就一切正常了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8345480f172e4d7697b17afcd9595b14~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1180&h=250&s=33345&e=png&b=f8f8f8)

我也不知道是不是新版本的 Xcode 有所调整，这个问题之前是没有的，但是最近的新版本会存在。

附上有关版本信息：

*   eas-cli/9.0.7 darwin-arm64 node-v20.11.1
*   Xcode Version 15.3 (15E204a)
*   macOS Sonoma 14.5