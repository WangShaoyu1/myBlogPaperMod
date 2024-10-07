---
author: "三好大兄弟"
title: "ReactNative版本升级从0.72到0.75"
date: 2024-08-19
description: "前言从2023年6月22日ReactNative官方发布0.72.0至今，一年多的时间ReactNative官方已经陆续发布了0.73、0.74、0.75"
tags: ["ReactNative","iOS"]
ShowReadingTime: "阅读6分钟"
weight: 700
---
\[配图来自法国画家Martin Jarrie\]

### 前言

从2023年6月22日React Native官方发布0.72.0至今，一年多的时间React Native官方已经陆续发布了0.73、0.74、0.75三个版本，故决定对公司项目做版本升级，以获得更好的性能和稳定性。

我们先看下这三个版本，带来了哪些新功能、新特性：

### React Native 0.73

*   **新的调试器**：增加了新的调试器，弃用旧版flipper调试工具，让调试过程更加高效顺畅。
*   **稳定的符号链接支持:** 简化您的开发工作流程，轻松将文件或目录链接到其他位置。
*   **支持 Android 14:** 确保您的应用适配最新系统，兼容更多用户设备。
*   \*\*全新实验性功能：**无桥模式 (Bridgeless Mode)**，\*\*直接将 JavaScript 代码编译为原生代码，显著提升应用性能并降低内存使用量。
*   **Android 平台默认使用 Kotlin。**

### React Native 0.74

*   **Yoga 3.0**：引入了 Yoga 3.0，增强了布局引擎的性能。
*   **Yarn 3**：初始化新React Native项目时，使用Yarn 3作为默认JavaScript包管理器，取代了之前的经典版Yarn（1.x）。
*   **新架构下的默认无桥接模式**：在启用新架构时，默认采用无桥接模式（Bridgeless），以提高性能和效率。
*   **新架构批量onLayout更新**：在0.74版本中，onLayout回调中的状态更新被批处理，这意味着连续的状态更新将合并成一次渲染提交，从而减少不必要的重新渲染。
*   **最低 SDK 要求提高**：安卓的最低 SDK 版本要求从 Android 5.0（API 21）提高到 Android 6.0（API 23），这有助于减小应用在用户设备上占用的空间，例如新创建的应用体积减少了约13%，节约了约4MB的空间。
*   **弃用 PropTypes**：完全移除了 React Native 内置的 PropTypes，推荐使用 TypeScript 进行类型检查。
*   **移除废弃API**：删除了PropTypes等已弃用API，推荐开发者迁移至TypeScript

### React Native 0.75

*   **Yoga 3.1和布局改进**：支持%值在布局中的应用，如gap、translation等属性，但仅适用于新架构。
*   **新架构稳定化**：修复了一些Bug，提高了稳定性，并在React Native Directory中添加了新架构支持信息，还发布了关于支持新架构中UIManager的文章。
*   **使用框架**：推荐通过框架（如Expo）构建React Native应用，将/template文件夹移至单独的仓库，并计划在2024年12月31日停止使用react-native init命令，同时改进了自动链接的性能。
*   **Touchable在TypeScript中的使用限制**：TouchableOpacity和TouchableHighlights组件不能再用作类型，应使用React.ElementRef或View类型。
*   **其他变更**：包括Android和iOS中一些API的删除、重命名以及功能的迁移等。

由于一个完整的 React Native 项目是由 Android 项目、iOS 项目和 JavaScript 项目组成的，且都打包在一个 npm 包中，所以升级可能会有一些麻烦，大体上就是如下两种升级思路。

### 一，在老项目基础上升级

如果你选择通过在老项目基础上改变package.json中package版本号重新yarn的方式升级，建议你使用React Native官方推荐的升级助手：[Upgrade React Native applications](https://link.juejin.cn?target=http%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Freact-native-community.github.io%2Fupgrade-helper%2F "http://link.zhihu.com/?target=https%3A//react-native-community.github.io/upgrade-helper/")，通过填写app信息，会给出详细的升级方案，你只需要按照提示逐行更改就行。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7cf6d81e93604d658b11bcd8cbb5a36b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiJ5aW95aSn5YWE5byf:q75.awebp?rk3s=f64ab15b&x-expires=1727751254&x-signature=IdMRcpvBWZrH1yV6R%2B2WWanyGFQ%3D)

由于Upgrade Helper给出的改动方案篇幅过长，这里就不全部给出了。大致上重点在于，由于0.73默认使用kotlin、废弃了flipper且新增了新的调试器，需要将iOS podfile和安卓项目配置中关于flipper的部分全部删除，并且将.java文件删除替换为相应kotlin代码的.kt文件，还有一些安卓SDK、Gradle及npm包的升级，只需要按照提示改就行了，主要工作量都在iOS、Android原生项目配置这两块，JavaScript 项目只占很小一部分工作量。这个过程可能并不会一次成功，参考[Upgrading to new versions · React Native](https://link.juejin.cn?target=http%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Freactnative.dev%2Fdocs%2Fupgrading "http://link.zhihu.com/?target=https%3A//reactnative.dev/docs/upgrading")和Upgrade Helper给出的方案，遇到什么问题解决什么问题就好了。

### 二，新建项目升级

以我以往的升级经验来看，在老项目的基础上通过改变package.json中package版本号重新yarn的方式升级，结合Upgrade Helper给出的改动方案，iOS、Android原生项目配置需要改动的东西很多，且很容易出现其他未知错误，通过这种方式升级，弄不好要花费掉一个星期的时间。

所以我选择直接 init 一个新的项目，然后把现有项目的 JS 代码拷贝过来，iOS、Android原生项目配置重新配置一遍的方式手动升级。这样我将在一个干净的React Native 0.75 空项目的基础上添砖加瓦，因为需要在空项目上将原来的iOS、Android原生部分重新配置一遍，看似更麻烦了，实则可以规避掉了很多在老项目基础上升级带来的未知错误，直至代码拷贝完成、升级成功。

值得一提的是，为了确保npm package的版本与React Native 0.75保持同步，我并没有直接将老项目package.json的内容直接拷贝到新项目的package.json中yarn，而是将每一个npm package都yarn add一遍，自动去安装最新的版本。

yarn完成后，安卓项目需要Android Studio重新sync Android Gradle和gradlew --refresh-dependencies刷新依赖，iOS项目需要重新pod install，这些都是必不可少的。

#### 2.1 原生配置报错

（1）运行pod install后，报错：

less

 代码解读

复制代码

`Build target hermes-engine: Command PhaseScriptExecution failed with a nonzero exit code`

此时需要将/Users/xxx/Library/Developer/Xcode/DerivedData/yourapp/Logs/Build/中的.log文件转换成可被阅读的.xcactivitylog文件才能查看到具体的报错，cd到上诉文件夹，运行如下命令：

bash

 代码解读

复制代码

``for LOG in *.xcactivitylog; do  NAME=`basename $LOG $EXT`  gunzip -c -S $EXT "${NAME}${EXT}" > "${NAME}.log" done``

在xcactivitylog中得到具体的报错信息如下：

sql

 代码解读

复制代码

`Build target hermes-engine of project Pods with configuration Release warning: Run script build phase '[CP-User] [Hermes] Replace Hermes for the right configuration, if needed' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'hermes-engine' from project 'Pods') Run script build phase '[CP-User] [Hermes] Replace Hermes for the right configuration, if needed' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. PhaseScriptExecution [CP-User]\ [Hermes]\ Replace\ Hermes\ for\ the\ right\ configuration,\ if\ needed /Library/Developer/Xcode/DerivedData/myProjectName-gzdlehmipieiindfjyfrhhcjupam/Build/Intermediates.noindex/ArchiveIntermediates/myProjectName/IntermediateBuildFilesPath/Pods.build/Release-iphoneos/hermes-engine.build/Script-46EB2E0002C950.sh (in target 'hermes-engine' from project 'Pods') Node found at: /var/folders/d5/f1gffcfx27ngwvmw8v8jdm7m0000gn/T/yarn--1704767526546-0.12516067745295967/node /Library/Developer/Xcode/DerivedData/myProjectName-gzdlehmipieiindfjyfrhhcjupam/Build/Intermediates.noindex/ArchiveIntermediates/myProjectName/IntermediateBuildFilesPath/Pods.build/Release-iphoneos/hermes-engine.build/Script-46EB2E0002C950.sh: line 9: /var/folders/d5/f1gffcfx27ngwvmw8v8jdm7m0000gn/T/yarn--1704767526546-0.12516067745295967/node: No such file or directory Command PhaseScriptExecution failed with a nonzero exit code`

通过查找方案[github.com/facebook/re…](https://link.juejin.cn?target=http%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Ffacebook%2Freact-native%2Fissues%2F42221 "http://link.zhihu.com/?target=https%3A//github.com/facebook/react-native/issues/42221")，采用软链接node到`/usr/local/bin/node`的方式解决了该问题，具体步骤如下：

1，找到真实的node路径

bash

 代码解读

复制代码

`command -v node # in my machine that show => /Users/runner/hostedtoolcache/node/18.20.2/arm64/bin/node`

2，链接node到 `/usr/local/bin/node`.

bash

 代码解读

复制代码

`ln -s /Users/runner/hostedtoolcache/node/18.20.2/arm64/bin/node /usr/local/bin/node`

或者

bash

 代码解读

复制代码

`ln -s $(command -v node) /usr/local/bin/node` 

（2）xcode报错：

lua

 代码解读

复制代码

`Build service could not create build operation: unknown error while handling message: MsgHandlingError(message: "unable to initiate PIF transfer session (operation in progress?)")`

通过重启xcode解决。

#### 2.2 npm package报错

期间也遇到一些npm package相关的报错，列举下一些典型的package报错。

（1）react-native-mmkv报错

如果你的项目中用到了本地存储，推荐使用腾讯推出的react-native-mmkv，经过腾讯的测试效率要比@react-native-async-storage快30倍以上，并且是同步操作，代码十分简洁。

vbnet

 代码解读

复制代码

`Error: Failed to create a new MMKV instance: react-native-mmkv 3.x.x requires TurboModules, but the new architecture is not enabled!* Downgrade to react-native-mmkv 2.x.x if you want to stay on the old architecture.* Enable the new architecture in your app to use react-native-mmkv 3.x.x. (See https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md), js engine: hermes`

看报错得知，这个库需要将new architecture设置为enabled，因为react native哪怕到了最新的0.75版本new architecture也是默认disabled的，此处按照官方文档开启：

[github.com/reactwg/rea…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freactwg%2Freact-native-new-architecture%2Fblob%2Fmain%2Fdocs%2Fenable-apps.md "https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md")

（2）react-native-pdf报错

go

 代码解读

复制代码

`build error: no member named 'enableDoubleTapZoom'` 

说明react-native-pdf对react native的new architecture兼容还有些问题，此处我们可以直接修改react-native-pdf的源码，然后使用patch-package打好补丁, .patch地址如下：

[github.com/user-attach…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fuser-attachments%2Ffiles%2F15570383%2Freact-native-pdf%252B6.7.5.patch "https://github.com/user-attachments/files/15570383/react-native-pdf%2B6.7.5.patch")

至此，React Native从0.72到0.75的版本升级就完成了，总耗时一天时间。