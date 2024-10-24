---
author: "Gaby"
title: "说一说 Fiber"
date: 2021-08-30
description: "虚拟DOM 在 React 中有个正式的称呼——Fiber。在之后的学习中，我们会逐渐用`Fiber`来取代 React16虚拟DOM 这一称呼。"
tags: ["前端","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:25,comments:1,collects:42,views:4725,"
---
* * *

**这是我参与8月更文挑战的第28天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

**虚拟DOM**在`React`中有个正式的称呼——`Fiber`。在之后的学习中，我们会逐渐用`Fiber`来取代**React16虚拟DOM**这一称呼。

接下来让我们了解下`Fiber`因何而来？他的作用是什么？

Fiber的起源
--------

> 最早的`Fiber`官方解释来源于[2016年React团队成员Acdlite的一篇介绍 (opens new window)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Facdlite%2Freact-fiber-architecture "https://github.com/acdlite/react-fiber-architecture")。

在`React15`及以前，`Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，`React16`将**递归的无法中断的更新**重构为**异步的可中断更新**，由于曾经用于递归的**虚拟DOM**数据结构已经无法满足需要。于是，全新的`Fiber`架构应运而生。

Fiber的含义
--------

`Fiber`包含三层含义：

1.  作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。
2.  作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3.  作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

Fiber的结构
--------

你可以从这里看到[Fiber节点的属性定义 (opens new window)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2F1fb18e22ae66fdb1dc127347e169e73948778e5a%2Fpackages%2Freact-reconciler%2Fsrc%2FReactFiber.new.js%23L117 "https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117")。虽然属性很多，但我们可以按三层含义将他们分类来看

```js
function FiberNode(
tag: WorkTag,
pendingProps: mixed,
key: null | string,
mode: TypeOfMode,
    ) {
    // 作为静态数据结构的属性
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    
    // 用于连接其他Fiber节点形成Fiber树
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    
    this.ref = null;
    
    // 作为动态的工作单元的属性
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;
    
    this.mode = mode;
    
    this.effectTag = NoEffect;
    this.nextEffect = null;
    
    this.firstEffect = null;
    this.lastEffect = null;
    
    // 调度优先级相关
    this.lanes = NoLanes;
    this.childLanes = NoLanes;
    
    // 指向该fiber在另一次更新时对应的fiber
    this.alternate = null;
}
```

### 作为架构来说

每个Fiber节点有个对应的`React element`，多个`Fiber节点`是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

举个例子，如下的组件结构：

```js
    function App() {
    return (
    <div>
    i am
    <span>KaSong</span>
    </div>
    )
}
```

对应的`Fiber树`结构：

![image.png](/images/jueJin/7adecf71735e442.png)

> 这里需要提一下，为什么父级指针叫做`return`而不是`parent`或者`father`呢？因为作为一个工作单元，`return`指节点执行完`completeWork` 后会返回的下一个节点。子`Fiber节点`及其兄弟节点完成工作后会返回其父级节点，所以用`return`指代父级节点。

### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

### 作为动态的工作单元

作为动态的工作单元，`Fiber`中如下参数保存了本次更新相关的信息，我们会在后续的更新流程中使用到具体属性时再详细介绍

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```ini
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

注意

在2020年5月，调度优先级策略经历了比较大的重构。以`expirationTime`属性为代表的优先级模型被`lane`取代。详见[这个PR(opens new window)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fpull%2F18796 "https://github.com/facebook/react/pull/18796")

总结
--

本节我们了解了`Fiber`的起源与架构，其中`Fiber节点`可以构成`Fiber树`。那么`Fiber树`和页面呈现的`DOM树`有什么关系，`React`又是如何更新`DOM`的呢？

参考资料
----

[Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1it411p7v6%3Ffrom%3Dsearch%26seid%3D3508901752524570226 "https://www.bilibili.com/video/BV1it411p7v6?from=search&seid=3508901752524570226")