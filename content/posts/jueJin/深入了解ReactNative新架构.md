---
author: "王负剑王负剑"
title: "深入了解ReactNative新架构"
date: 2023-08-04
description: "深入了解ReactNative新架构ReactNative团队宣布新架构将于2022年推出。点击这里查看他们的完整博客。由于新版本发布在即，现在是个很好的机会去了解它的底层发生了哪些改变，以及"
tags: ["前端","JavaScript","架构"]
ShowReadingTime: "阅读7分钟"
weight: 634
---
深入了解React Native新架构
===================

![main.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0419db5bcbc24e76a59086938bc679c7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

React Native团队宣布新架构将于2022年推出。点击[这里](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fblog%2F2022%2F01%2F21%2Freact-native-h2-2021-recap "https://reactnative.dev/blog/2022/01/21/react-native-h2-2021-recap")查看他们的完整博客。

> “_2022 is going to be the year of the_ **New Architecture in open source**”(2022将会是新架构开源之年)

由于新版本发布在即，现在是个很好的机会去了解它的底层发生了哪些改变，以及这些改变会对我们的React Native App造成什么影响

本文主要介绍这次重构变化最多的地方：

1.  JavaScript Interface(JSI)
2.  Fabric
3.  Turbo Modules
4.  CodeGen

### 当前架构

在学习新架构之前，让我们先回顾下当前的架构。

此次仅列举一些和本文相关的知识点，如果想了解更多关于当前架构的内容，阅读Bianca Dragomir的[这篇文章](https://link.juejin.cn?target=https%3A%2F%2Fbetterprogramming.pub%2Freact-native-under-the-hood-281df5f548f "https://betterprogramming.pub/react-native-under-the-hood-281df5f548f")

### 简而言之：

当我们运行RN应用时，所有的 javascript 代码会被打包到 JS Bundle，Native代码则被单独保存。

RN有以下三个线程：

1.  JS thread：JS引擎使用该线程运行JS Bundle。
2.  Native/UI thread: 运行原生能力(Native Modules)，处理UI渲染，用户手势事件等操作。
3.  shadow thread：在元素渲染之前先计算布局。

JS和Native thread通过bridge进行通信，当通过bridge发送数据时，bridge会将数据排队批处理(优化)，并序列化成JSON，并且该通信只能是异步的。

![current.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/608bb8c437b84e15b989698e9580ce7f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

_重要术语：_

JavaScriptCore：_JavaScript引擎，用于执行JS代码_。

Yoga：_UI引擎，用于计算元素在用户屏幕上展示的位置_。

### 1\. JavaScript Interface (JSI)

当前架构中，JS和Native thread通过bridge实现通信，每次传输数据时，需要先将数据序列化为JSON，接收时，再解析回来。

这意味着JS和Native相互独立。(JS thread无法直接调用Native thread的方法)

另一个需要注意的点是，bridge传输的数据本质上是异步的，在大多数用例中没有问题，但在某些情况下，我们也需要JS和native代码同步执行。

### 举个例子：

当JS thread需要使用原生模块时(如：蓝牙)，需要发送信息给Native thread。首先JS thread会发送一条序列化后的JSON数据给bridge，之后bridge将数据优化后发送给Native thread，Native thread解析JSON数据，最后再运行所需的native代码。

![bridge.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e674e4e9a78433f853289cd25ba1ee3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

1)JS thread 准备data 2)在发送给bridge前将data序列化为JSON 3)在bridge传输的另一端解析data 4)Native thread执行所需native代码

然而，在新架构中，bridge将被_**JavaScript Interface**_替代，这是一个轻量的，通用的层，使用C++编写，JS引擎可以用它直接调用native的方法。

### 什么是通用？

当前的架构使用的是JavaScriptCore引擎，bridge只兼容该引擎。而JSI并非如此，它将JavaScript接口与引擎解耦，这意味着新架构可以使用其他JavaScript引擎，如Chakra，v8，Hermes等，因此它是“通用”的。

### JSI怎么让JavaScript直接调用native方法？

在JSI中，native方法通过C++宿主对象暴露给JavaScript。JavaScript会将这些对象的引用保存下来，并通过这些引用直接调用方法。类似于在web中，JavaScript保存DOM元素对象的引用，并调用其方法。例如：

> _const container = document.createElement(‘div’);_

在这段代码中，JavaScript变量container指向DOM元素的引用，DOM元素则可能是C++初始化的。当我们调用container的任何方法时，container会调用DOM元素内的方法。JSI以类似的方式工作。

与bridge不同，JSI允许JavaScript保存对Native Modules的引用，JavaScript可以通过JSI直接调用这个引用的方法。

![jsi.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50519a24fe784032972a8888ba5cf805~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

1)JavaScript持有native module的引用 1)它通过JavaScript Interface调用native module的方法

总而言之，JSI允许使用其他的JavaScript引擎，并且实现了线程间的互相操作，JavaScript可以在JS thread中直接与native端通信。以后不再需要将data序列化为JSON，同时避免了bridge的堵塞以及异步问题。

JSI的另一个巨大优势是，它是由C++编写的，借助C++，React Native可以在大量的系统中运行，如智能电视、智能手表等。

### 2.Fabric

Fabric是渲染系统，它会取代当前的UI Manager。

为了理解Fabric的优势，我们先看看当前React Native是如何渲染UI的：

app运行时，React执行代码，在JavaScript中创建ReactElementTree，Renderer会基于它在C++中创建ReactShadowTree。

布局引擎根据虚拟树计算UI元素在屏幕上的位置，计算完成后，虚拟树会被转换成由Native Elements组成的HostViewTree。_(例如：ReactNative中的元素在Android和iOS中会分别转换为ViewGroup和UIView)_

![fabric.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6f805530b144f979d4160012814899c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

ReactElementTree (JavaScript) -> ReactShadowTree(C++) -> HostViewTree(Native)

### **这种方式的问题：**

正如我们所知，线程间的通信都通过bridge来实现，这意味着缓慢的传输速率以及非必要的数据复制。

例如：ReactElementTree中的节点，在ReactShadowTree中也是image，但是两份数据必须在两个节点中都复制一份。

并且，由于JS和UI的线程不是同步的，在某些情况下甚至会因为丢帧导致app卡顿。(例如：滚动一个包含大量数据的FlatList)

### Fabric是什么？

根据ReactNative的[官方文档](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Ffabric-renderer "https://reactnative.dev/docs/fabric-renderer")，

> "Fabric is React Native’s new rendering system, a conceptual evolution of the legacy render system"（Fabric是ReactNative新的渲染系统，它的概念从传统渲染系统进化而来）

正如我们在本文中JSI部分所看到的，JSI将native方法直接暴露给JavaScript，这也包括了UI方法，由此使得JS和UI线程能够同步，这会提高列表，导航，手势处理等的性能。

### Fabric会带来什么好处?

在新的渲染系统中，滚动，用户手势等用户交互可以优先在主线程或native线程中同步执行，而其他任务，比如接口请求等会异步执行。

并且，新的Shadow Tree是不可变的，JS和UI线程中共享该tree，以允许来自两端的直接交互。

在当前的架构中，React Native 必须维护两个层次结构/DOM 节点。而新架构中，只需维护shadow tree，并且是线程间共享的，这也将有助于减少内存消耗。

### 3.Turbo Modules

在当前的架构中，所有JavaScript使用的的原生模块(如蓝牙，地理位置，文件存储等)必须在app打开前初始化。这意味着即使用户不需要某个模块，它还是会在启动时被初始化。

Turbo Modules基本上是对老的Native Modules的增强。我们在上文看到的，现在JavaScript可以保留这些模块的引用，这可以让我们的JS按需加载模块，大大提高ReactNative app的启动速度。

### 4.CodeGen

Fabric和Turbo Modules听起来很有前途，但是JavaScript是一门动态语言，而JSI是用C++写的，C++是一门静态语言，因此需要保证两者间的顺利通信。

这就是新架构还包括一个名为CodeGen的静态类型检查器的原因。

CodeGen使用类型确定后的JavaScript来为Turbo Modules和Fabric定义供他们使用的接口元素，并且它会在构建时生成更多的native代码，而非运行时。

### 总结

将所有的变化结合起来，新架构如图所示：

![new.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d4f198235f49d09aa7de23bec33d39~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

主要亮点为：

*   Bridge会被JSI取代
*   可以用其他引擎替代JavaScriptCore
*   所有线程间可以完全互相操作
*   Web式的渲染系统
*   对时间敏感的任务可以同步执行
*   Turbo Modules实现模块懒加载
*   JS端和Native端的静态类型检查

我们可以确信，新架构会给React Native带来强大的提升。