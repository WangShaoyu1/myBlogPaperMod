---
author: "goClient1992"
title: "React源码分析(一)Fiber"
date: 2022-12-15
description: "前言本次React源码参考版本为17.0.3。React架构前世今生查阅文档了解到，React@16.x是个分水岭。React@15及之前在16之前，React架构大致可以分为两层：Re"
tags: ["React.js"]
ShowReadingTime: "阅读5分钟"
weight: 676
---
前言
--

本次React源码参考版本为`17.0.3`。

React架构前世今生
-----------

查阅文档了解到， `React@16.x`是个分水岭。

### React@15及之前

在16之前，React架构大致可以分为两层：

*   Reconciler： 主要职责是对比查找更新前后的变化的组件；
*   Renderer： 主要职责是基于变化渲染页面；

但是React团队意识到这样的架构有致命问题： **因为在React15中，组件的更新是基于递归查找实现的，这样一旦开始递归，是没有办法中断的，如果组件层级很深，就会出现性能问题，导致页面卡顿。**

### React@16及之后

为了解决这样的问题，React团队在`React@16`进行了重构，引入了新的架构模型：

*   Reconciler： 主要职责是对比查找更新前后的变化的组件；
*   Renderer： 主要职责是基于变化渲染页面；
*   Scheduler： 主要职责是区分任务优先级，优先执行高优先级的任务；

新的架构在原来的基础上引入了`Scheduler(调度器）`，这个东西是React团队参考浏览器的API：`requestIdleCallback`实现的。它的主要作用就是调度更新任务：

*   一方面可以中断当前任务执行更高优先级的任务；
*   另一方面能判断浏览器空闲时间，在恰当的时间将主动权给到浏览器，保证页面性能；并在浏览器下次空闲时继续之前中断的任务； **这样就将之前的不可中断的同步更新变成了异步可中断更新**，不直接使用浏览器API可能考虑到兼容问题，可能也有别的方面的考量。 下面是新的React架构更新模型：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1354b9dc7977414182d45572d90553b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这个新的架构在进入Renderer之前的流程是可以被中断的，主要有下列两种情况：

*   进入了更高优先级的任务；
*   浏览器在当前帧没有剩余空闲时间了；

Fiber
-----

Fiber简单的理解就是`React15`版本的虚拟DOM。

### Fiber简单理解

如果将新的React架构比作一个公司，Fiber在新的架构里承担的就是这个公司的员工，员工也有等级，老板，部长，基层，每个人有自己的职责，知道自己在哪个节点该做什么工作，并将未完成的工作记住等第二天上班继续完成，从而保证公司的顺利运行。而每个Fiber对应一个`React element`： 假如有这样一段代码：

javascript

 代码解读

复制代码

`function App() {     return (         <div>             <span>牛牛</span>             <span>不怕困难</span>         </div>      ) }`

上面的代码的抽象Fiber树：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3868ec2d83470ca5dc35c8783eebad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 其中的每个方块都是一个Fiber，它们通过`child, return, sibling`连接对方构成一个Fiber树。

### Fiber结构

来看一个Fiber会有哪些属性：

kotlin

 代码解读

复制代码

``function FiberNode(tag, pendingProps, key, mode) {   // Instance   this.tag = tag;   // 组件类型   this.key = key;   // 组件props上的key   this.elementType = null;      // ReactElement.type 组件的dom类型， 比如`div, p`   this.type = null;     // 异步组件resolved之后返回的内容   this.stateNode = null; // 在浏览器环境对应dom节点   this.return = null;       // 指向父节点   this.child = null;        // 孩子节点   this.sibling = null;      // 兄弟节点， 兄弟节点的return指向同一个父节点   this.index = 0;   this.ref = null;          // ref   this.pendingProps = pendingProps;     // 新的props   this.memoizedProps = null;        // 上一次渲染完成的props   this.updateQueue = null;          // 组件产生的update信息会放在这个队列   this.memoizedState = null;        // // 上一次渲染完成的state   this.dependencies = null;   this.mode = mode; // Effects   this.flags = NoFlags;     // 相当于之前的effectTag， 记录side effect类型   this.nextEffect = null;   // 单链表结构， 便于快速查找下一个side effect   this.firstEffect = null;  // fiber中第一个side effect   this.lastEffect = null;   // fiber中最后一个side effect   this.lanes = NoLanes;     // 优先级相关   this.childLanes = NoLanes;  // 优先级相关   this.alternate = null;    // 对应的是current fiber }``

Fiber工作原理
---------

在弄明白Fiber工作原理之前，我们要先明确一个认知：**新的React架构使用了两个Fiber树。**

*   一个Fiber树是当前页面dom的抽象，叫`current`；
*   另一个Fiber树是在内存中执行更新任务dom的抽象，叫`workInProgress`；

这样做是为了方便比对变化组件，并降低创建的成本，尽可能复用现有代码逻辑，从而提高渲染效率。相关参考视频讲解：[进入学习](https://link.juejin.cn?target=https%3A%2F%2Fxiaochen1024.com%2Fseries%2F60b1b600712e370039088e24%2F60b1b636712e370039088e25 "https://xiaochen1024.com/series/60b1b600712e370039088e24/60b1b636712e370039088e25")

### mount

React代码在第一次执行时，因为页面还没有渲染出来，此时是没有`current`树的，只有一个正在构建DOM的`workInProgress`树。

假如我们有这样一段代码：

javascript

 代码解读

复制代码

`function App() {     return (         <div>             <span>牛牛</span>             <span>不怕困难</span>         </div>      ) } ReactDOM.render(<App/>, document.querySelector('#root'));`

基于上面的代码在`mount`会生成这样的Fiber树：

可以看到这个图只是在前面的图上增加了`fiberRoot`和`rootFiber`两个Fiber节点。

*   fiberRoot：整个React应用的根节点；
*   rootFiber： 某个组件树的根节点；（因为我们可能多次使用`React.render()`函数，这样就会有多个rootFiber)

图中此时fiberRoot对应的rootFiber下面还是空的，因为此时是第一次渲染，页面上没有任何东西，当`workInProgress`树构建完成，在`mutation`之后，`layout`之前，fiberRootd的`current`指针会指向`workInProgress`树，把它作为新的`current`树，此时结构会变成这样：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5841f06b739f409fb8967763703a8e44~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这时页面渲染完成了，等待下次触发更新时会从`current`树进行拷贝生成`workInProgress`树，然后比对更新。

### update

如果我们在上面的代码中触发更新，将`牛牛`文本改成了`勇敢牛牛`，React代码就会开始进行任务调度，因为只有这一个任务，会马上执行，会从`current`树的rootFiber进行拷贝生成`workInProgress`树的根节点，在经过向下遍历比对，发现相同的就直接从`current`树上拷贝复用，直到比对到叶子节点的`牛牛`文本变了，这时才会生成新的Fiber（这里只是为了方便解释，其实我这里使用的代码`牛牛`不会生成新的Fiber，因为是纯文本，只会替换父级节点的props)