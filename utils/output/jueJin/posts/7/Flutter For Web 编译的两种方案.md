---
author: "政采云技术"
title: "Flutter For Web 编译的两种方案"
date: 2022-01-19
description: "前言 要问现在最火的移动端的框架是什么，每个人心中自有自己的答案。不过就笔者人而言，前端开发所做的更多是在显卡上绘制每一个像素的艺术。从这一出发点来看，Flutter 基于浏览器上的 DOM 树、安卓"
tags: ["前端","JavaScript","Dart中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:52,comments:0,collects:35,views:5581,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![心火.png](/images/jueJin/321a5db4a0d5433.png)

> 这是第 131 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[Flutter For Web 编译的两种方案](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fflutter-web "https://zoo.team/article/flutter-web")

前言
==

要问现在最火的移动端的框架是什么，每个人心中自有自己的答案。不过就笔者人而言，前端开发所做的更多是在显卡上绘制每一个像素的艺术。从这一出发点来看，Flutter 基于浏览器上的 DOM 树、安卓的 View、IOS 的 UIVeiw，从底层的自建渲染引擎来构建我们的应用 UI，并提供相关接口。目前 Flutter 关注度还是比较高的，Flutter 的热度已经超越⽼牌跨平台框架 React Native。不过吹捧了那么多，可能就会有小伙伴们要问了，Flutter 到底是个什么东西。接下来我们就一起来认识它。

Flutter 原理简介
============

Flutter 是由 Google 推出的开源的高性能跨平台框架，一个 2D 渲染引擎。在 Flutter中，Widget 是 Flutter 用户界面的基本构成单元，可以说一切皆 Widget。下面来看下 Flutter 框架的整体结构组成。

Flutter 框架的设计如下所示：

![](/images/jueJin/fa254afd5e14434.png)

​ Flutter 框架是一个分层的结构，每个层都建立在前一层之上。

*   **Framework**（框架层）：这是一个纯 Dart 实现的 SDK；
    
    【Foundation】在最底层，主要定义给其他层使用的底层工具类和方法。
    
    【Animation】是动画相关的类。
    
    【Painting】封装了 Flutter Engine 提供的绘制接口，例如绘制缩放图像、插值生成阴影、绘制盒模型边框等。
    
    【Gesture】提供处理手势识别和交互的功能。
    
    【Rendering】是框架中的渲染库。
    
    【Widgets 】是 Flutter 提供的的一套基础组件库。Material 和 Cupertino 是两种视觉风格的组件库。
    

*   **Engine（**引擎层**）**：是 Flutter 的核心，这是一个纯 C++ 实现的 SDK，其中包括了 Skia 引擎、Dart 运行时、文字排版引擎等。在代码调用 dart:ui 库时，调用最终会走到 Engine 层，然后实现真正的绘制逻辑。
*   **Embedder（嵌入层**）：主要是将 Flutter 引擎 “安装” 到特定平台上，做好这一层的适配 Flutter 基本可以嵌入到任何平台上去。

Flutter 在移动端的实践中，目前来说已经有很成熟的业界方案了，但是 Flutter 在 web 的环境里面的应用还是有所欠缺的。今天我们先来研究下 Flutter 构建 web 程序的相关技术栈。

用于 Web 支持的两个方案
==============

其实，最早在 2018 Flutter 1.0 的时候，Flutter 的产品经理 Tim Sneath 就推出了 Flutter Web。Flutter Web 想在单代码库的情况下，让 Flutter 应用拥有 Web 支持。开发者可以使用 Dart 编写应用并部署到任意的 Web 服务器上，或嵌入到浏览器中。甚至其他的 IOS、安卓、windows 设备，开发者都可以使用 Flutter 所具有的特性，也不需要特殊的浏览器插件支持。在 Flutter Web 的设计之初，主要考虑了两个方案用于 Web 支持:

1.  **HTML + CSS + Canvas**
2.  **CSS Paint API** ([zhuanlan.zhihu.com/p/39931190](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F39931190 "https://zhuanlan.zhihu.com/p/39931190")) **优缺点：**

方案 1：具有最好的兼容性，它优先考虑 HTML + CSS 表达，当 HTML + CSS 无法表达图片的时候，会使用 Canvas 来绘制。但 2D Canvas 在浏览器中是位图表示，会造成像素化下的性能问题。

方案 2： 是新的 Web API , 属于 [CSS Houdini](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FGuide%2FHoudini "https://developer.mozilla.org/zh-CN/docs/Web/Guide/Houdini") [](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FGuide%2FHoudini "https://developer.mozilla.org/zh-CN/docs/Web/Guide/Houdini")的组成部分。CSS Houdini 提供了一组可以直接访问 CSS 对象模型的 API ，使得开发者可以去书写代码并被浏览器作为 CSS 加以解析，这样在无需等待浏览器原生的支持下，创造了新的 CSS 特性。它的绘制并非由核心 JavaScript 完成，而是类似 Web Worker 的机制。但目前 CSS Paint API 不支持文本，此外各家厂商对其支持也并不统一。

Flutter for Web 的两种编译器
======================

Flutter 官方给我们提供了 dart2js 和 dartdevc 两个编译器，我们不仅可以将代码直接运行在 chrome 浏览器，也可以将 Flutter 代码编译为 js 文件部署在服务端。

1、dart2js 编译器
-------------

我们在调用 `flutter run build` 命令后会将项目的 main.dart 传入编译流程，最终输出的是构建产物中的 `.dill` 文件 。这个 `.dill` 文件很关键，笔者的理解是一种包含了 dart 程序的抽象语法树生成的 [AST](https://link.juejin.cn?target=http%3A%2F%2Fcaibaojian.com%2Fast.html "http://caibaojian.com/ast.html") 文件，能运行在所有的操作系统和 CPU 架构上。

在构建过程中 Flutter\_tools 首先会将传入的参数进行组装，然后调用 `dart2jsSnapshot`。进行 dart 文件编译，生成 Weget 树的二进制文件的 `.dill` 文件，这个代码的位置在 `dart-sdk/html/dart2js/html_dart2js.dart` 路径下（对应版本：Flutter 2.5.3 Tools • Dart 2.14.4）。

`dart2jsSnapshot` 是一个专门为 web 平台转换做的解释器，类似于 Flutter Web\_sdk。只不过 Flutter Web\_sdk 的源码更多的是在调试时候做 debugger，效率很低。在 build 的时候，显然利用快照的方式比较合理。

dart2js 编译流程：

![](/images/jueJin/849eb396a9b845e.png)

dart2js 调用的快照文件示例图：

![](/images/jueJin/66a5c640b84c4f1.png)

### 如何生成 web 端代码

具体执行看这里：[dart.dev/tools/dart2…](https://link.juejin.cn?target=https%3A%2F%2Fdart.dev%2Ftools%2Fdart2js "https://dart.dev/tools/dart2js")

我们再来看下 build 之后的生成目录：

![](/images/jueJin/eaafed6d08384ee.png)

通过上面的介绍，我们知道整个转换流程中承上启下的关键产物就是 `.dill` 文件。那么他是如何通过代码生成的呢？

我们，首先通过 [Flutter\_tools](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fflutter%2Fflutter%2Ftree%2Fmaster%2Fpackages%2Fflutter_tools "https://github.com/flutter/flutter/tree/master/packages/flutter_tools") 调用到 `dart2jsSnapshot` 文件。调用的参数如下：

```javascript
--libraries-spec=/Users/beike/Flutter/bin/cache/Flutter Web_sdk/libraries.json
--native-null-assertions
-Ddart.vm.product=true
-DFlutter Web_AUTO_DETECT=true
--no-source-maps // 是否生成sourcemap的选项；
-O1
-o
--cfe-only // 代表只完成前端编译，生成kernel文件后就不继续下面的后端编译流程。
/Users/beike/path_to_js/main.dart.js
/Users/beike/path_to_dill/app.dill
```

其中 O1 代表优化等级，dart2js 支持 O0 - O4 共 5 种优化，O4 的优化程度最高。通过优化可以减少产物的大小并且优化代码的性能。

Dart2js 的后端编译主要包括以下代码:

1.  首先，编译器会将传入的 `.dill` 通过 BinaryBuilder 加载到 Component 中并存储在 KernelResult 中；

```javascript
KernelResult result = await kernelLoader.load(uri);
```

2.  `computeClosedWorld()` 方法会将第一步解析出来的所有 Library 解析成 JsClosedWorld。

```javascript
JsClosedWorld closedWorld = selfTask.measureSubtask("computeClosedWorld", () => computeClosedWorld(rootLibraryUri, libraries));
```

​ JsClosedWorld 代表了通过 closed-world 语义编译之后的代码。它的结构如下：

```javascript
    class JsClosedWorld implements JClosedWorld {
    static const String tag = 'closed-world';
    @override final NativeData nativeData;
    @override final InterceptorData interceptorData;
    @override final BackendUsage backendUsage;
    @override final NoSuchMethodData noSuchMethodData;
    FunctionSet _allFunctions;
    final Map<classentity, Set> mixinUses;
    Map<classentity, List> _liveMixinUses;
    final Map<classentity, Set> typesImplementedBySubclasses;
    final Map<classentity, Map> _subtypeCoveredByCache = <classentity, Map>{};
    // TODO(johnniwinther): Can this be derived from [ClassSet]s?
    final Set implementedClasses;
    final Set liveInstanceMembers;
    // Members that are written either directly or through a setter selector.
    final Set assignedInstanceMembers;
    @override final Set liveNativeClasses;
    @override final Set processedMembers;
    ...
}
```

3.  然后，使用 `JsClosedWorld()` 方法进行代码优化，包括下面代码中的 `performGlobalTypeInference()` 方法。

```javascript
GlobalTypeInferenceResults globalInferenceResults = performGlobalTypeInference(closedWorld);
```

4.  最终，`generateJavaScriptCode()` 方法会将上边返回的结果通过 JSBuilder 生成最终的 js AST 也就是 `.dill` 文件。

```javascript
generateJavaScriptCode(globalInferenceResults);
```

2、dartdevc 编译器
--------------

在 dartdevc 我们不仅可以将代码直接运行在 chrome 浏览器，也可以将 flutter 代码编译为 js 文件部署在服务端。如果代码运行在 chrome 浏览器，flutter\_tools 会使用 dartdevc 编译器进行编，如下图：

![](/images/jueJin/8cbc4d7f8988450.png)

dartdevc 是支持增量编译的，开发者可以像调试 Flutter Mobile 代码一样使用 hot reload 来提升调试效率。Flutter for Web 调试也是非常方便的，编译后的代码是默认支持 source map ，当运行在 web 浏览器时，开发者是不用关心生成的 js 代码是怎样的。

好了，接下来我们从一个简单的[案例](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fsuckson%2Fflutter-web-test "https://gitee.com/suckson/flutter-web-test")入手，看看 Flutter，是如何一步一步将 web 转换为我们的 js，并在浏览器中使用和绘制出一个页面。

关键代码部分：

```dart
    Widget build(BuildContext context) {
    return Scaffold(
    appBar: AppBar(
    title: Text(widget.title, style: TextStyle(color: Colors.white),),
    ),
    body: Center(
    child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
        Container(
        width: 250,
        height: 250,
        color: Colors.orange,
        child: Center(
        child: Text("6", style: TextStyle(fontSize: 200.0, color: Colors.green, fontWeight: FontWeight.bold),),
        ),
        )
        ],
        ),
        ), // This trailing comma makes auto-formatting nicer for build methods.
        );
    }
``````dart
    abstract class c {
    void drawRect(Rect rect, Paint paint);
}
    html.HtmlElement_drawRect(ui.Offset p, SurfacePaintData paint) {
[省略部分代码]
Element = _drawRect(paint); // 绘制，
[省略部分代码]
final String cssTransform = float64ListToCssTransform(
transformWithOffset(_canvasPool.currentTransform, p).storage);
imgElement.style
..transformOrigin = '0 0 0' ..transform = cssTransform
..removeProperty('width')
..removeProperty('height');
rootElement.append(imgElement);
_children.add(imgElement); return imgElement;
}
```

当调度任务调用到 drawRect() 方法之后，drawRect() 方法中会创建 canvas 元素，并且将 dart 的绘制逻辑重新实现一遍，最终将 Element 添加到 rootElement，也就是当前的 flt-canvas 元素中。生成的 html 如下：

![](/images/jueJin/97adf17693a54ca.png)

Flutter 总结展望
============

dart2js 和 dartdevc 本质上是一件事情，但这两种编译器是应用在不同场景。在开发应用程序时选择 dartdevc，它支持增量编译，因此你可以快速查看编辑结果。在构建要部署的应用程序时，选用 dart2js，它使用摇树等技术来生成优化的且精简的代码。

dart2js 提供了更快的编译时间，并且编译后的运行效果与之前相比更加一致、完整，更重要的是，输出的代码更加整洁。Dart 团队正在努力使 dart2js 编译后的代码比手写 JS 更快地运行。

通过以上的简单分析，我们发现通过 Flutter 的编译，重写了大量的绘制的 Class，这对于前端开发来说可能提供了一个新的思路。当然本次有些地方还是很粗略的分析。只是初步介绍了 Flutter 打包构建流程，并没有给出完整的思路。后面会继续努力，将在后续的文章中与大家分享。希望随着 Flutter 社区方案的愈加完善，利用 Flutter 技术栈上线的 web 产品也会越来越多。

引用
==

1.  [Flutter渲染原理解析](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F135969091 "https://zhuanlan.zhihu.com/p/135969091")
2.  [CSS Paint API](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F39931190 "https://zhuanlan.zhihu.com/p/39931190")
3.  [如何评价 Flutter for Web？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F323439136%2Fanswer%2F850516697%3Fivk_sa%3D1024320u "https://www.zhihu.com/question/323439136/answer/850516697?ivk_sa=1024320u")
4.  [Dart](https://link.juejin.cn?target=https%3A%2F%2Fdart.dev%2Fget-dart "https://dart.dev/get-dart")

推荐阅读
----

[在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261 "https://juejin.cn/post/7026119446162997261")

[浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 60 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)