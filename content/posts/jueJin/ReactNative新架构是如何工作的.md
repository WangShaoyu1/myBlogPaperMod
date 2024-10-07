---
author: "xiangzhihong"
title: "ReactNative新架构是如何工作的"
date: 2021-12-26
description: "目前ReactNative新架构所依赖的React18已经发了beta版，ReactNative新架构面向生态库和核心开发者的文档也正式发布，ReactNative团队成员K"
tags: ["前端","ReactNative"]
ShowReadingTime: "阅读20分钟"
weight: 614
---
目前 React Native 新架构所依赖的 React 18 已经发了 beta 版，React Native 新架构面向生态库和核心开发者的文档也正式发布，React Native 团队成员 Kevin Gozali 也在最近一次访谈中谈到新架构离正式发版还差最后一步延迟初始化，而最后一步工作大约会在 2022 年上半年完成。种种迹象表明，React Native 新架构真的要来了。

前面，RN官方宣布：[Hermes将成为React Native默认的JS引擎](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fxiangzhihong8%2Farticle%2Fdetails%2F121061679%3Fops_request_misc%3D%25257B%252522request%25255Fid%252522%25253A%252522164051242216780274117564%252522%25252C%252522scm%252522%25253A%25252220140713.130102334.pc%25255Fblog.%252522%25257D%26request_id%3D164051242216780274117564%26biz_id%3D0%26utm_medium%3Ddistribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-2-121061679.nonecase%26utm_term%3Dreact%2520native%26spm%3D1018.2226.3001.4450 "https://blog.csdn.net/xiangzhihong8/article/details/121061679?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522164051242216780274117564%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=164051242216780274117564&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-2-121061679.nonecase&utm_term=react%20native&spm=1018.2226.3001.4450")。在文章中，我们简单的介绍了即将发布的新渲染器 Fabric，那么我们重点来认识下这个新的渲染器 Fabric 。

一、Fabric
========

1.1 基本概念
--------

Fabric 是 React Native 新架构的渲染系统，是从老架构的渲染系统演变而来的。核心原理是在 C++ 层统一更多的渲染逻辑，提升与宿主平台（host platforms）互操作性，即能够在 UI 线程上同步调用JavaScript代码，渲染效率得到明显的提高。Fabric研发始于 2018 年，Facebook 内部的很多React Native 应用使用的就是新的渲染器Fabric。

在简介新渲染器（new renderer）之前，我们先介绍几个单词和概念：

*   **宿主平台（Host platform）**：React Native 嵌入的平台，比如 Android、iOS、Windows、macOS。
*   **Fabric 渲染器（Fabric Renderer）**：React Native 执行的 React 框架代码，和 React 在 Web 中执行代码是同一份。但是，React Native 渲染的是通用平台视图（宿主视图）而不是 DOM 节点（可以认为 DOM 是 Web 的宿主视图）。

在更换了底层的渲染流程之后，Fabric 渲染器使得渲染宿主视图变得可行。Fabric 让 React 与各个平台直接通信并管理其宿主视图实例。Fabric 渲染器存在于 JavaScript 中，并且它调用的是由 C++ 代码暴露的接口。

1.2 新渲染器的初衷
-----------

开发新的渲染架构的初衷是为了更好的提升用户体验，而这种新体验是在老架构上是不可能实现的。主要体现为：

*   提升宿主视图（host views）和 React 视图（React views）的互操作性，渲染器必须有能力同步地测量和渲染 React 界面。在老架构中，React Native 布局是异步的，这导致在宿主视图中渲染嵌套的 React Native 视图，会有布局“抖动”的问题。
*   借助多优先级和同步事件的能力，渲染器可以提高用户交互的优先级，来确保他们的操作得到及时的处理。
*   React Suspense 的集成，允许开发者在 React 中更合理的组织请求数据代码。
*   允许开发者在 React Native 使用 React Concurrent 中断渲染功能。
*   更容易的实现 React Native 的服务端渲染。

除此之外，新的Fabric渲染器在代码质量、性能、可扩展性方面也是有了质的飞升。

*   **类型安全**：代码生成工具（code generation）确保了 JS 和宿主平台两方面的类型安全。代码生成工具使用 JavaScript 组件声明作为唯一事实源，生成 C++ 结构体来持有 props 属性。不会因为 JavaScript 和宿主组件 props 属性不匹配而出现构建错误。
*   **共享 C++ core**：渲染器是用 C++ 实现的，其核心 core 在平台之间是共享的。这增加了一致性并且使得新的平台能够更容易采用 React Native。（译注：例如 VR 新平台）
*   **更好的宿主平台互操作性**：当宿主组件集成到 React Native 时，同步和线程安全的布局计算提升了用户体验（译注：没有异步的【抖动】）。
*   **性能提升**：新的渲染系统的实现是跨平台的，每个平台都从那些原本只在某个特定平台的实现的性能优化中得到了更好的用户体验。比如拍平视图层级，原本只是 Android 上的性能优化方案，现在 Android 和 iOS 都直接有了。
*   **一致性**：新的渲染系统的实现是跨平台的，不同平台之间更容易保持一致。
*   **更快的启动速度**：默认情况下，宿主组件的初始化是懒执行的。
*   **JS 和宿主平台之间的数据序列化更少**：React 使用序列化 JSON 在 JavaScript 和宿主平台之间传递数据。新的渲染器用 JSI（JavaScript Interface）直接获取 JavaScript 数据。

二、渲染流程
======

2.1 渲染流程
--------

React Native 渲染器通过一系列加工处理，将 React 代码渲染到宿主平台。这一系列加工处理就是渲染流水线（pipeline），它的作用是初始化渲染和 UI 状态更新。接下来，我们重点介绍一下React Native 渲染流水线，及其在各种场景中的不同之处。

渲染流水线可大致分为三个阶段：

*   **渲染**：在 JavaScript 中，React 执行那些产品逻辑代码创建 React 元素树（React Element Trees）。然后在 C++ 中，用 React 元素树创建 React 影子树（React Shadow Tree）。
*   **提交**：在 React 影子树完全创建后，渲染器会触发一次提交。这会将 React 元素树和新创建的 React 影子树的提升为“下一棵要挂载的树”。这个过程中也包括了布局信息计算。
*   **挂载**：React 影子树有了布局计算结果后，它会被转化为一个宿主视图树（Host View Tree）。

这里有几个名词需要解释下：

#### React元素树

React 元素树是通过 JavaScript 中的 React 创建的，该树由一系类 React 元素组成。一个 React 元素就是一个普通的 JavaScript 对象，它描述了需要在屏幕中展示的内容。一个元素包括属性 props、样式 styles、子元素 children。React 元素分为两类：React 复合组件实例（React Composite Components）和 React 宿主组件（React Host Components）实例，并且它只存在于 JavaScript 中。

#### React 影子树

React 影子树是通过 Fabric 渲染器创建的，树由一系列 React 影子节点组成。一个 React 影子节点是一个对象，代表一个已经挂载的 React 宿主组件，其包含的属性 props 来自 JavaScript。它也包括布局信息，比如坐标系 x、y，宽高 width、height。在新渲染器 Fabric 中，React 影子节点对象只存在于 C++ 中。而在老架构中，它存在于手机运行时的堆栈中，比如 Android 的 JVM。

#### 宿主视图树

宿主视图树就是一系列的宿主视图，宿主平台有 Android 平台、iOS 平台等等。在 Android 上，宿主视图就是 android.view.ViewGroup实例、 android.widget.TextView实例等等。宿主视图就像积木一样地构成了宿主视图树。每个宿主视图的大小和坐标位置基于的是 LayoutMetrics，而 LayoutMetrics是通过React Native得布局引擎 Yoga 计算出来的。宿主视图的样式和内容信息，是从 React 影子树中得到的。

React Native渲染流水线的各个阶段可能发生在不同的线程中，参考线程模型部分。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0357bf631e794bf0a96706ebedd5e765~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 在React Native中，涉及渲染的操作通常有三种：

*   初始化渲染
*   React 状态更新
*   React Native 渲染器的状态更新

2.2 初始化渲染
---------

### 2.2.1 渲染阶段

假如，有下面一个组件需要执行渲染：

javascript

 代码解读

复制代码

`function MyComponent() {   return (     <View>       <Text>Hello, World</Text>     </View>   ); }`

在上面的例子中，`<MyComponent />`最终会被React 简化为最基础的React 宿主元素。每一次递归地调用函数组件 MyComponet ，或类组件的 render 方法，直至所有的组件都被调用过。最终，得到一棵 React 宿主组件的 React 元素树。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/408985f7670142f5a8b50f053134e392~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 在这里，有几个重要的名词需要解释下“

*   **React 组件**：React 组件就是 JavaScript 函数或者类，描述如何创建 React 元素。
*   **React 复合组件**：React 组件的 render 方法中，包括其他 React 复合组件和 React 宿主组件。（译注：复合组件就是开发者声明的组件）
*   **React 宿主组件**：React 组件的视图是通过宿主视图，比如 `<View>`、`<Text>`实现的。在 Web 中，ReactDOM 的宿主组件就是 `<p>`标签、`<div>`标签代表的组件。

在元素简化的过程中，每调用一个 React 元素，渲染器同时会同步地创建 React 影子节点。这个过程只发生在 React 宿主组件上，不会发生在 React 复合组件上。比如，一个 `<View>`会创建一个 ViewShadowNode 对象，一个`<Text>`会创建一个TextShadowNode对象。而我们开发的组件，由于不是基础组件，因此没有直接的React 影子节点与之对应，所以`<MyComponent>`并没有直接对应的 React 影子节点。

在 React 为两个 React 元素节点创建一对父子关系的同时，渲染器也会为对应的 React 影子节点创建一样的父子关系。上面代码，各个渲染阶段的产物如下图所示。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f46a9b4e07847c5b77fed0650160796~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 2.2.2 提交阶段

在 React 影子树创建完成后，渲染器触发了一次 React 元素树的提交。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6aacdfb6bf64cb6ba26d06ddf4669f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 提交阶段（Commit Phase）由两个操作组成：布局计算和树提升。

#### 布局计算

这一步会计算每个 React 影子节点的位置和大小。在 React Native 中，每一个 React 影子节点的布局都是通过 Yoga 布局引擎来计算的。实际的计算需要考虑每一个 React 影子节点的样式，该样式来自于 JavaScript 中的 React 元素。计算还需要考虑 React 影子树的根节点的布局约束，这决定了最终节点能够拥有多少可用空间。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6398d4e98d44457cbe6c5fbe1dac15a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 树提升

从新树到下一棵树（Tree Promotion，New Tree → Next Tree），这一步会将新的 React 影子树提升为要挂载的下一棵树。这次提升代表着新树拥有了所有要挂载的信息，并且能够代表 React 元素树的最新状态，下一棵树会在 UI 线程下一个“tick”进行挂载（译注：tick 是 CUP 的最小时间单元）。

并且，绝大多数布局计算都是 C++ 中执行，只有某些组件，比如 Text、TextInput 组件等的布局计算是在宿主平台执行的。文字的大小和位置在每个宿主平台都是特别的，需要在宿主平台层进行计算。为此，Yoga 布局引擎调用了宿主平台的函数来计算这些组件的布局。

### 2.2.3 挂载阶段

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0327995327614437803177adbece24c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 挂载阶段（Mount Phase）会将已经包含布局计算数据的 React 影子树，转换为以像素形式渲染在屏幕中的宿主视图树。

站在更高的抽象层次上，React Native 渲染器为每个 React 影子节点创建了对应的宿主视图，并且将它们挂载在屏幕上。在上面的例子中，渲染器为`<View>` 创建了android.view.ViewGroup 实例，为 `<Text>` 创建了文字内容为“Hello World”的 android.widget.TextView实例 。iOS 也是类似的，创建了一个 UIView 并调用 NSLayoutManager 创建文本。然后会为宿主视图配置来自 React 影子节点上的属性，这些宿主视图的大小位置都是通过计算好的布局信息配置的。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab32efe3854441a483c1791a527ae893~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 挂载阶段又细分为三个步骤：

*   **树对比**： 这个步骤完全用的是 C++ 计算的，会对比“已经渲染的树”和”下一棵树”之间的元素差异。计算的结果是一系列宿主平台上的原子变更操作，比如 createView, updateView, removeView, deleteView 等等。在这个步骤中，还会将 React 影子树重构，来避免不必要的宿主视图创建。
    
*   **树提升，从下一棵树到已渲染树**： 在这个步骤中，会自动将“下一棵树”提升为“先前渲染的树”，因此在下一个挂载阶段，树的对比计算用的是正确的树。
    
*   **视图挂载**： 这个步骤会在对应的原生视图上执行原子变更操作，该步骤是发生在原生平台的 UI 线程的。
    

同时，挂载阶段的所有操作都是在 UI 线程同步执行的。如果提交阶段是在后台线程执行，那么在挂载阶段会在 UI 线程的下一个“tick”执行。另外，如果提交阶段是在 UI 线程执行的，那么挂载阶段也是在 UI 线程执行。挂载阶段的调度和执行很大程度取决于宿主平台。例如，当前 Android 和 iOS 挂载层的渲染架构是不一样的。

2.3 React 状态更新
--------------

接下来，我们继续看 React 状态更新时，渲染流水线的各个阶段的情况。假设，在初始化渲染时渲染的是如下组件。

javascript

 代码解读

复制代码

`function MyComponent() {   return (     <View>       <View         style={{ backgroundColor: 'red', height: 20, width: 20 }}       />       <View         style={{ backgroundColor: 'blue', height: 20, width: 20 }}       />     </View>   ); }`

通过初始化渲染部分学的知识，我们可以得到如下的三棵树： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b9500b4eec2471785d82416270f1d59~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 可以看到，节点 3 对应的宿主视图背景是 红的，而 节点 4 对应的宿主视图背景是 蓝的。假设 JavaScript 的产品逻辑是，将第一个内嵌的的背景颜色由红色改为黄色。新的 React 元素树看起来大概是这样的。

arduino

 代码解读

复制代码

`<View>   <View     style={{ backgroundColor: 'yellow', height: 20, width: 20 }}   />   <View     style={{ backgroundColor: 'blue', height: 20, width: 20 }}   /> </View>`

此时，我们或许会有一个疑问：React Native 是如何处理这个更新的呢？

从概念上讲，当发生状态更新时，为了更新已经挂载的宿主视图，渲染器需要直接更新 React 元素树。但是为了线程的安全，React 元素树和 React 影子树都必须是不可变的（immutable）。这意味着 React 并不能直接改变当前的 React 元素树和 React 影子树，而是必须为每棵树创建一个包含新属性、新样式和新子节点的新副本。

### 2.3.1 渲染阶段

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc57e8a47a5440a893899ce06e7eff88~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) React 要创建了一个包含新状态的新的 React 元素树，它就要复制所有变更的 React 元素和 React 影子节点。复制后，再提交新的 React 元素树。

React Native 渲染器利用结构共享的方式，将不可变特性的开销变得最小。为了更新 React 元素的新状态，从该元素到根元素路径上的所有元素都需要复制。但 React 只会复制有新属性、新样式或新子元素的 React 元素，任何没有因状态更新发生变动的 React 元素都不会复制，而是由新树和旧树共享。

在上面的例子中，React 创建新树使用了下面这些操作：

1.  CloneNode(Node 3, {backgroundColor: 'yellow'}) → Node 3'
2.  CloneNode(Node 2) → Node 2'
3.  AppendChild(Node 2', Node 3')
4.  AppendChild(Node 2', Node 4)
5.  CloneNode(Node 1) → Node 1'
6.  AppendChild(Node 1', Node 2')

操作完成后，节点 1'（Node 1'） 就是新的 React 元素树的根节点，我们用 T 代表“先前渲染的树”，用 T' 代表“新树”。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a741b22c8ca46afb6f9747393766d16~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 注意，节点 4 在 T and T' 之间是共享的。结构共享提升了性能并减少了内存的使用。

### 2.3.2 提交阶段

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ccd7f3d72c54f909814135fbe0d7510~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 在 React 创建完新的 React 元素树和 React 影子树后，需要提交它们，也会涉及以下几个步骤：

*   **布局计算**： 状态更新时的布局计算，和初始化渲染的布局计算类似。一个重要的不同之处是布局计算可能会导致共享的 React 影子节点被复制。这是因为，如果共享的 React 影子节点的父节点引起了布局改变，共享的 React 影子节点的布局也可能发生改变。
*   **树提升**: 和初始化渲染的树提升类似。
*   **树对比**： 这个步骤会计算“先前渲染的树”（T）和“下一棵树”（T'）的区别。计算的结果是原生视图的变更操作。

在上面的例子中，这些操作包括：UpdateView(**'Node 3'**, {backgroundColor: 'yellow'})

### 2.3.3 挂载阶段

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a40d4a99c23e4c60a6d3b2a197db60d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   **树提升**：在这个步骤中，会自动将“下一棵树”提升为“先前渲染的树”，因此在下一个挂载阶段，树的对比计算用的是正确的树。
*   **视图挂载**：这个步骤会在对应的原生视图上执行原子变更操作。在上面的例子中，只有 视图 3（View 3） 的背景颜色会更新，变为黄色。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d517b1d400e4545b6f0953c30439c34~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2.4 渲染器状态更新
-----------

对于影子树中的大多数信息而言，React 是唯一所有方也是唯一事实源。并且所有来源于 React 的数据都是单向流动的。

但有一个例外。这个例外是一种非常重要的机制：C++ 组件可以拥有状态，且该状态可以不直接暴露给 JavaScript，这时候 JavaScript （或 React）就不是唯一事实源了。通常，只有复杂的宿主组件才会用到 C++ 状态，绝大多数宿主组件都不需要此功能。

例如，ScrollView 使用这种机制让渲染器知道当前的偏移量是多少。偏移量的更新是宿主平台的触发，具体地说是 ScrollView 组件。这些偏移量信息在 React Native 的 measure 等 API 中有用到。因为偏移量数据是由 C++ 状态持有的，所以源于宿主平台更新，不影响 React 元素树。

从概念上讲，C++ 状态更新类似于我们前面提到的 React 状态更新，但有两点不同：

*   因为不涉及 React，所以跳过了“渲染阶段”（Render phase）。
*   更新可以源自和发生在任何线程，包括主线程。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d2c2619fedf4ba8b779960fb3786304~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 提交阶段（Commit Phase）：在执行 C++ 状态更新时，会有一段代码把影子节点 （N） 的 C++ 状态设置为值 S。React Native 渲染器会反复尝试获取 N 的最新提交版本，并使用新状态 S 复制它 ，并将新的影子节点 N' 提交给影子树。如果 React 在此期间执行了另一次提交，或者其他 C++ 状态有了更新，本次 C++ 状态提交失败。这时渲染器将多次重试 C++ 状态更新，直到提交成功，这可以防止真实源的冲突和竞争。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cdce1f53ee34db78a3ca4a011aad45a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 挂载阶段（Mount Phase）实际上与 React 状态更新的挂载阶段相同。渲染器仍然需要重新计算布局、执行树对比等操作。

三、跨平台实现
=======

在上一代 React Native 渲染器中，React 影子树、布局逻辑、视图拍平算法是在各个平台单独实现的。当前的渲染器的设计上采用的是跨平台的解决方案，共享了核心的 C++ 实现。而Fabric渲染器直接使用 C++ core 渲染实现了跨平台共享。

使用 C++ 作为核心渲染系统有以下几个优点。

*   单一实现降低了开发和维护成本。
*   提升了创建 React 影子树的性能，同时在 Android 上，也因为不再使用 JNI for Yoga，降低了 Yoga 渲染引擎的开销，布局计算的性能也有所提升。
*   每个 React 影子节点在 C++ 中占用的内存，比在 Kotlin 或 Swift 中占用的要小。

同时，React Native 团队还使用了强制不可变的 C++ 特性，来确保并发访问时共享资源即便不加锁保护，也不会有问题。但在 Android 端还有两种例外，渲染器依然会有 JNI 的开销：

*   复杂视图，比如 Text、TextInput 等，依然会使用 JNI 来传输属性 props。
*   在挂载阶段依然会使用 JNI 来发送变更操作。

React Native 团队在探索使用 ByteBuffer 序列化数据这种新的机制，来替换 ReadableMap，减少 JNI 的开销，目标是将 JNI 的开销减少 35~50%。

渲染器提供了 C++ 与两边通信的 API：

*   与 React 通信
*   与宿主平台通信

关于 React 与渲染器的通信，包括 渲染（render） React 树和监听 事件（event），比如 onLayout、onKeyPress、touch 等。而React Native 渲染器与宿主平台的通信，包括在屏幕上 挂载（mount） 宿主视图，包括 create、insert、update、delete 宿主视图，和监听用户在宿主平台产生的 事件（event）。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cf908b940714fe1a91f663b8719385b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

四、视图拍平
======

视图拍平（View Flattening）是 React Native 渲染器避免布局嵌套太深的优化手段。React API 在设计上希望通过组合的方式，实现组件声明和重用，这为更简单的开发提供了一个很好的模型。但是在实现中，API 的这些特性会导致一些 React 元素会嵌套地很深，而其中大部分 React 元素节点只会影响视图布局，并不会在屏幕中渲染任何内容。这就是所谓的 “只参与布局” 类型节点。

从概念上讲，React 元素树的节点数量和屏幕上的视图数量应该是 1:1 的关系。但是，渲染一个很深的“只参与布局”的 React 元素会导致性能变慢。假如，有一个应用，应用中拥有外边距 ContainerComponent的容器组件，容器组件的子组件是 TitleComponent 标题组件，标题组件包括一个图片和一行文字。React 代码示例如下：

javascript

 代码解读

复制代码

`function MyComponent() {   return (     <View>                          // ReactAppComponent       <View style={{margin: 10}} /> // ContainerComponent         <View style={{margin: 10}}> // TitleComponent           <Image {...} />           <Text {...}>This is a title</Text>         </View>       </View>     </View>   ); }`

React Native 在渲染时，会生成以下三棵树： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53018049b9284cb68d84ae4980f963d6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 在视图 2 和视图 3 是“只参与布局”的视图，因为它们在屏幕上渲染只是为了提供 10 像素的外边距。

为了提升 React 元素树中“只参与布局”类型的性能，渲染器实现了一种视图拍平的机制来合并或拍平这类节点，减少屏幕中宿主视图的层级深度。该算法考虑到了如下属性，比如 margin、padding、backgroundColor和opacity等等。

视图拍平算法是渲染器的对比（diffing）阶段的一部分，这样设计的好处是我们不需要额外的 CUP 耗时，来拍平 React 元素树中“只参与布局”的视图。此外，作为 C++ 核心的一部分，视图拍平算法默认是全平台共用的。

在前面的例子中，视图 2 和视图 3 会作为“对比算法”（diffing algorithm）的一部分被拍平，而它们的样式结果会被合并到视图 1 中。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/284bd7fb17574692a81df77f5356412f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 不过，虽然这种优化让渲染器少创建和渲染两个宿主视图，但从用户的角度看屏幕内容没有任何区别。

五、线程模型
======

React Native 渲染器是线程安全的。从更高的视角看，在框架内部线程安全是通过不可变的数据结果保障的，其使用的是 C++ 的 const correctness 特性。这意味着，在渲染器中 React 的每次更新都会重新创建或复制新对象，而不是更新原有的数据结构。这是框架把线程安全和同步 API 暴露给 React 的前提。

在React Native中，渲染器使用三个不同的线程：

*   **UI 线程**：唯一可以操作宿主视图的线程。
*   **JavaScript 线程**：这是执行 React 渲染阶段的地方。
*   **后台线程**：专门用于布局的线程。

下图描述了React Native渲染的完整流程： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09e5db670ba54b2daea3a692be143177~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

5.1 渲染场景
--------

#### 在后台线程中渲染

这是最常见的场景，大多数的渲染流水线发生在 JavaScript 线程和后台线程。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39d6f85bc1094791aa3ed09a084cc057~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 在主线程中渲染

当 UI 线程上有高优先级事件时，渲染器能够在 UI 线程上同步执行所有渲染流水线。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c7bfe77ac634d47aa7ddd1c257e54ae~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 默认或连续事件中断

在这个场景中，UI 线程的低优先级事件中断了渲染步骤。React 和 React Native 渲染器能够中断渲染步骤，并把它的状态和一个在 UI 线程执行的低优先级事件合并。在这个例子中渲染过程会继续在后台线程中执行。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6750655ac1a8450c9f920b7d14ffdb7e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 不相干的事件中断

渲染步骤是可中断的。在这个场景中， UI 线程的高优先级事件中断了渲染步骤。React 和渲染器是能够打断渲染步骤的，并把它的状态和 UI 线程执行的高优先级事件合并。在 UI 线程渲染步骤是同步执行的。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c85bc464bb44423d88262f927cd486d5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 来自 JavaScript 线程的后台线程批量更新

在后台线程将更新分派给 UI 线程之前，它会检查是否有新的更新来自 JavaScript。这样，当渲染器知道新的状态要到来时，它就不会直接渲染旧的状态。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6e5089ddd07434082fd1246256499cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### C++ 状态更新

更新来自 UI 线程，并会跳过渲染步骤。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04a55f2f621d482997696e9d8a7a7a00~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)