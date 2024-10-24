---
author: ""
title: "掘力计划第 20 期：Flutter 动态方案 Fair 原理与实践"
date: 2023-07-31
description: "回放链接：httpslivejuejincn4354jpowermeetup20 在掘力计划系列活动第20场 58 集团-房产事业部跨端技术负责人、移动端架构师孙哲为我们分享 Flutt"
tags: ["Flutter","Android","iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:20,views:1693,"
---
回放链接：[live.juejin.cn/4354/jpower…](https://live.juejin.cn/4354/jpowermeetup20?ch=hf "https://live.juejin.cn/4354/jpowermeetup20?ch=hf")

**本场沙龙系列文章：**

[Topic1:掘力计划第 20 期：崔红保-跨端框架性能优化实践](https://juejin.cn/post/7261897250648866853 "https://juejin.cn/post/7261897250648866853") 

[Topic3:掘力计划第 20 期： Pake —— 利用 Rust 轻松构建跨端轻量级应用](https://juejin.cn/post/7261897250648932389 "https://juejin.cn/post/7261897250648932389")

[Topic4:掘力计划第 20 期：Flutter 混合开发的混乱之治](https://juejin.cn/post/7261889424451469372 "https://juejin.cn/post/7261889424451469372")

在掘力计划系列活动第20场 58 集团-房产事业部跨端技术负责人、移动端架构师孙哲为我们分享 Flutter 动态方案 Fair 原理与实践。

![](/images/jueJin/c0ce5e8882ed4d9.png)

摘要
--

跨平台技术对整体大前端的研发效率提升明显，58 集团对跨平台方案同样有着强烈诉求。Flutter 相较于其它跨端技术，在渲染效率和多端适配度上有非常大的优势，但其无法实现动态化更新，使得 Flutter 的发版成本较高。基于此背景，58 技术委员会推出了 Flutter 动态化开源项目—Fair。本次分享将对 Fair 进行一些介绍，讲解 Fair 是如何实现 Flutter 动态化以及使用 Fair 的一些最佳实践。

![](/images/jueJin/b8c3027d6f3b445.png)

1 Fair 背景介绍
-----------

近年来，跨平台技术的迅速发展为移动端开发带来了革命性的变化。以 React Native 和 Flutter 为代表的跨平台技术，极大地提升了前端开发者的工作效率。

58 同城作为房产行业的龙头企业，其技术部门也在积极探索跨平台技术的应用。经过调研和实践，58 选择了 Flutter 作为主要的跨平台开发方案。相较于 React Native 等方案，Flutter 在性能和适配性方面更占优势。

但是，Flutter 也存在一些短板。其中最主要的就是无法实现动态化更新。这导致每次功能修改都需要重新构建发布，大大增加了发布成本。

为了解决这一痛点，58 技术委员会推出了开源项目 Fair，通过一系列工具链实现了 Flutter 页面的动态化。

2 Fair 实现原理浅析
-------------

### 2.1 架构设计

Fair 整体设计原则是要打造一个还是 Flutter 技术栈的、可通过市场审核的热更新方案。所以整体架构设计，是将 Dart 源文件转译成 DSL 通过下发 JSON 和 JS 来分别实现布局动态化和逻辑动态化。

![](/images/jueJin/a4e9f932d8a74b4.png)

Fair 架构图

因此 Fair 的动态化方案就包含以下三个方面：

*   布局动态化
*   逻辑动态化
*   动态内容通信

布局动态化通过自定义 DSL 语法，将 Flutter 页面描述为可解析的 JSON 格式，然后在运行时动态加载解析，重建页面布局。

逻辑动态化则是通过自定义的 Dart 转 JS 的编译工具，将 Dart 中的业务逻辑抽取出来，编译为 JS 格式，与页面交互。

动态内容通信是通过 FFI 和 method channel 搭建的 JSBridge，在 Dart 端与 JS 端建立了桥梁，让两端可以相互调用对方的方法。

### 2.2 布局动态化实现

![](/images/jueJin/588892c21f03463.png)

布局动态化的实现主要分为三个步骤：

1.  使用 Analyzer 库解析 Dart 代码生成抽象语法树 AST
2.  遍历 AST，生成自定义的 JSON DSL 格式描述页面结构
3.  运行时通过反射调用 flutter 组件构建页面

具体来说，Fair 会解析 Dart 代码，生成包含组件信息的 AST。然后根据 AST 生成 JSON 格式的 DSL，比如：

```json
    {
    "className": "Center"，
        "na": {
        "child":"%(_buildText)"
        },
            "methodMap": {
                "buildText": {
                "className": "Text",
                    "pa" : [
                    "Hello World"
                ]
            }
        }
    }
```

该 JSON 描述了一个 Center widget，child 属性为一个 Text widget。

运行时，Fair 通过 className 映射组件构造函数，通过反射调用该构造函数即可动态构建页面布局。

再通过 **Function.apply（）** 方法动态运行映射出的方法返回 widget。

详细解析可以查看：[布局 DSL 生成原理](https://juejin.cn/post/7171763721990045726 "https://juejin.cn/post/7171763721990045726")

### 2.3 逻辑动态化实现

逻辑动态化同样分三步：

1.  分析 Dart 代码，提取业务逻辑部分
2.  自定义 Dart 转 JS 的编译器，生成 JS 文件
3.  页面通过 JsChannel 与 JS 运行环境通信

Fair 会解析 Dart 代码，提取所有的变量，方法等作为业务逻辑。然后通过自定义的编译器，将这些逻辑转换成 JS。

举个例子：

![](/images/jueJin/4644489629d2446.png)

Fair 中的 MVVM 依赖于 Flutter 原生模式，如上图所示，JS 域的数据同步给 Dart 域，只需要在 JS 侧调用熟悉的 setState 即可。当然这部分对使用 Fair 框架的开发者是无感知的，编译工具帮我们完成了相关的转换。原生代码和生成的 JS 代码，对比如下：

```javascript
    _incrementCounter: function _incrementCounter() {const __thiz__ = this;with (__thiz__) {setState('#FairKey#', function dummy() {
    _counter++;});}},
``````scss
    void _incrementCounter() {
        setState(() {
        _counter++;
        });
    }
```

大家可以看到，除了 JS 简化访问域的 with 和通信目标对象需要的 FairKey，其他代码差别并不大。

详细解析可以查看：[Fair 逻辑动态化架构设计与实现](https://juejin.cn/post/7167277654427582500 "https://juejin.cn/post/7167277654427582500")

### 2.4 动态内容通讯

![](/images/jueJin/eb1fea39bd4b421.png)

js 与布局文件的通信，本质上就是 js 与 dart 之间的通信，因为两者都是以 native 平台做依托，所以需要 native 作为消息的转发器，负责消息的分发。

对于 dart 与 native 之间的通信，我们使用的是官方提供的 message-channel 与 dart:FFI。message-channel 主要有、BasicMessageChannel、MethodChannel、EventChannel，该通道主要用于异步通信，dart:FFI 是官方提供的直接调用 native c/c++代码的工具，主要用于同步通信。

对于 native 与 js 之间的通信，我们则可以用注入方法的形式建立联系，native 侧注入本地方法，那么 js 则可以调用该方法发送消息并获取结果值，而如果是 js 提供本地方法， 那 native 侧可以执行 js 中的方法获取 js 发送的结果。

详细解析可以查看：[Fair 逻辑动态化通信实现](https://juejin.cn/post/7167278346076684302 "https://juejin.cn/post/7167278346076684302")

3 Fair 生态建设
-----------

为了更好地帮助开发者使用 Fair 实现 Flutter 动态化，Fair 项目组还开发了一系列辅助工具。

### 3.1 构建工具

提供了命令行工具，在 Flutter 项目中通过简单配置即可生成动态化代码。

只需三步即可构建 Flutter 动态化工程

##### 获取 faircli

```csharp
dart pub global activate faircli
```

##### 创建动态化工程

```lua
faircli create -n dynamic_project_name
```

dynamic\_project\_name: 动态化工程名

##### 创建载体工程

```lua
faircli create -k carrier -n carrier_project_name
```

carrier\_project\_name: 载体工程名

### 3.2 模板插件

![](/images/jueJin/d20a05d7cb5047f.png)

下载 Fair 模板插件，可以通过 idea 直接选择模板页面进行二次开发。

![](/images/jueJin/a444e23d3ede45a.png)

### 3.3 热更新平台

提供了开源的远程更新平台，可以在构建后自动上传编译产物，进行云端更新。

![](/images/jueJin/b7dd9a22b9054c7.png)

热更新平台所有代码也已开源，全部使用 dart 进行开发，具体原理实现可推荐阅读：[Flutter + Dart 三端一体化动态化平台实践](https://juejin.cn/post/7137183955148603428 "https://juejin.cn/post/7137183955148603428")

4 Fair 落地实践
-----------

Fair 目前在 58 同城内部已经有 10 多个 App 使用，覆盖不同的业务场景。无论是整页动态化还是卡片动态化都可以完美支持。

同时还开源了组件库，提供常用的列表、导航等组件的动态化实现，降低开发成本。

动态化后的页面和原生页面没有明显区别。

![](/images/jueJin/9016e9284f774bd.png)

在性能方面，Fair 对性能影响很小，接入前后平均帧率无影响。由于解析和引擎的影响，内存和启动时间方面会略有增加，但在可接受范围内。

![](/images/jueJin/58406d75f6df4ce.png)

具体使用和实践可参考：[Flutter 热更新 Fair 真。体验](https://juejin.cn/post/7228967938473394213 "https://juejin.cn/post/7228967938473394213")

5 总结与规划
-------

Fair 为 Flutter 提供了动态化能力，可以极大降低 Flutter 的发布成本。同时还提供了一整套从开发到发布的解决方案。

未来计划会继续完善组件库，增加对 Flutter 状态管理框架的支持，让 Fair 更加简单、稳定。

欢迎大家使用 Fair，也欢迎大家为我们点亮 star Github 地址：**[github.com/wuba/fair](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwuba%2Ffair "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwuba%2Ffair")** Fair 官网：**[fair.58.com](https://link.juejin.cn/?target=https%3A%2F%2Ffair.58.com%2F "https://link.juejin.cn/?target=https%3A%2F%2Ffair.58.com%2F")**

关于掘力计划
======

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。

关于掘力计划
======

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。