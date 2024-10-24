---
author: "yck"
title: "剖析 React 源码：组件更新流程（一）"
date: 2019-07-29
description: "这是我的剖析 React 源码的第五篇文章。这篇文章开始将会带着大家学习组件更新过程相关的内容，尽可能的脱离源码来了解原理，降低大家的学习难度。 在另外的两篇文章中你可以学习到如何调和组件及渲染组件的过程。 想必大家都知道大部分情况下多次 setState 不会触发多次渲染，并…"
tags: ["React.js","源码中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:41,comments:0,collects:39,views:4110,"
---
这是我的剖析 React 源码的第五篇文章。这篇文章开始将会带着大家学习组件更新过程相关的内容，尽可能的脱离源码来了解原理，降低大家的学习难度。

文章相关资料
------

*   [React 16.8.6 源码中文注释](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation")，如果你想读源码但是又怕看不懂的话，可以通过我这个仓库来学习
*   [之前的所有文章合集](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues "https://github.com/KieSun/Dream/issues")

组件更新流程中你能学到什么？
--------------

文章分为三部分，在这部分的文章中你可以学习到如下内容：

*   setState 背后的批量更新如何实现
*   Fiber 是什么？有什么用？
*   如何调度任务

在另外的两篇文章中你可以学习到如何调和组件及渲染组件的过程。

setState 背后的批量更新如何实现
--------------------

想必大家都知道大部分情况下多次 `setState` 不会触发多次渲染，并且 `state` 的值也不是实时的，这样的做法能够减少不必要的性能消耗。

```
    handleClick () {
    // 初始化 `count` 为 0
    console.log(this.state.count) // -> 0
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // -> 0
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // -> 0
}
```

那么这个行为是如何实现的呢？答案是批量更新。接下来我们就来学习批量更新是如何实现的。

其实这个背后的原理相当之简单。假如 `handleClick` 是通过点击事件触发的，那么 `handleClick` 其实差不多会被包装成这样：

```
isBatchingUpdates = true
    try {
    handleClick()
        } finally {
        isBatchingUpdates = false
        // 然后去更新
    }
```

在执行 `handleClick` 之前，其实 React 就会默认这次触发事件的过程中如果有 `setState` 的话就应该批量更新。

当我们在 `handleClick` 内部执行 `setState` 时，更新状态的这部分代码首先会被丢进一个队列中等待后续的使用。然后继续处理更新的逻辑，毕竟触发 `setState` 肯定会触发一系列组件更新的流程。但是在这个流程中如果 React 发现需要批量更新 `state` 的话，就会立即中断更新流程。

也就是说，虽然我们在 `handleClick` 中调用了三次 `setState`，但是并不会走完三次的组件更新流程，只是把更新状态的逻辑丢到了一个队列中。当 `handleClick` 执行完毕之后会再执行一次组件更新的流程。

另外组件更新流程其实是有两个截然不同的分支的。一种就是触发更新以后一次完成全部的组件更新流程；另一种是触发更新以后分时间片段完成所有的组件更新，用户体验更好，这种方式被称之为任务调度。如果你想详细了解这一块的内容，可以阅读我之前 [写的文章](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Flearn-react-essence%2Fblob%2Fmaster%2F%25E8%25B0%2583%25E5%25BA%25A6%25E5%258E%259F%25E7%2590%2586.md "https://github.com/KieSun/learn-react-essence/blob/master/%E8%B0%83%E5%BA%A6%E5%8E%9F%E7%90%86.md")。

当然本文也会提及一部分调度相关的内容，毕竟这块也包含在组件更新流程中。但是在学习任务调度之前，我们需要先来学习下 fiber 相关的内容，因为这块内容是 React 实现各种这些新功能的基石。

Fiber 是什么？有什么用？
---------------

在了解 Fiber 之前，我们先来了解下为什么 React 官方要费那么大劲去重构 React。

在 React 15 版本的时候，我们如果有组件需要更新的话，那么就会递归向下遍历整个虚拟 DOM 树来判断需要更新的地方。这种递归的方式弊端在于无法中断，必须更新完所有组件才会停止。这样的弊端会造成如果我们需要更新一些庞大的组件，那么在更新的过程中可能就会长时间阻塞主线程，从而造成用户的交互、动画的更新等等都不能及时响应。

React 的组件更新过程简而言之就是在持续调用函数的一个过程，这样的一个过程会形成一个虚拟的调用栈。假如我们控制这个调用栈的执行，把整个更新任务拆解开来，尽可能地将更新任务放到浏览器空闲的时候去执行，那么就能解决以上的问题。

那么现在是时候介绍 Fiber 了。Fiber 重新实现了 React 的核心算法，带来了杀手锏增量更新功能。它有能力将整个更新任务拆分为一个个小的任务，并且能控制这些任务的执行。

这些功能主要是通过两个核心的技术来实现的：

*   新的数据结构 fiber
*   调度器

### 新的数据结构 fiber

在前文中我们说到了需要拆分更新任务，那么如何把控这个拆分的颗粒度呢？答案是 fiber。

我们可以把每个 fiber 认为是一个工作单元，执行更新任务的整个流程（不包括渲染）就是在反复寻找工作单元并运行它们，这样的方式就实现了拆分任务的功能。

拆分成工作单元的目的就是为了让我们能控制 stack frame（调用栈中的内容），可以随时随地去执行它们。由此使得我们在每运行一个工作单元后都可以按情况继续执行或者中断工作（中断的决定权在于调度算法）。

那么 fiber 这个数据结构到底长什么样呢？现在就让我们来一窥究竟。

fiber 内部其实存储了很多上下文信息，我们可以把它认为是改进版的虚拟 DOM，它同样也对应了组件实例及 DOM 元素。同时 fiber 也会组成 fiber tree，但是它的结构不再是一个树形，而是一个链表的结构。

![](/images/jueJin/16c14ea212e5856.png)

以下是 fiber 中的一些重要属性：

```
    {
    ...
    // 浏览器环境下指 DOM 节点
    stateNode: any,
    
    // 形成列表结构
    return: Fiber | null,
    child: Fiber | null,
    sibling: Fiber | null,
    
    // 更新相关
    pendingProps: any,  // 新的 props
    memoizedProps: any,  // 旧的 props
    // 存储 setState 中的第一个参数
    updateQueue: UpdateQueue<any> | null,
    memoizedState: any, // 旧的 state
    
    // 调度相关
    expirationTime: ExpirationTime,  // 任务过期时间
    
    // 大部分情况下每个 fiber 都有一个替身 fiber
    // 在更新过程中，所有的操作都会在替身上完成，当渲染完成后，
    // 替身会代替本身
    alternate: Fiber | null,
    
    // 先简单认为是更新 DOM 相关的内容
    effectTag: SideEffectTag, // 指这个节点需要进行的 DOM 操作
    // 以下三个属性也会形成一个链表
    nextEffect: Fiber | null, // 下一个需要进行 DOM 操作的节点
    firstEffect: Fiber | null, // 第一个需要进行 DOM 操作的节点
    lastEffect: Fiber | null, // 最后一个需要进行 DOM 操作的节点，同时也可用于恢复任务
    ....
}
```

总的来说，我们可以认为 fiber 就是一个工作单元的数据结构表现，当然它同样也是调用栈中的一个重要组成部分。

> Fiber 和 fiber 不是同一个概念。前者代表新的调和器，后者代表 fiber node，也可以认为是改进后的虚拟 DOM。

### 调度器简介

每次有新的更新任务发生的时候，调度器都会按照策略给这些任务分配一个优先级。比如说动画的更新优先级会高点，离屏元素的更新优先级会低点。

通过这个优先级我们可以获取一个该更新任务必须执行的截止时间，优先级越高那么截止时间就越近，反之亦然。这个截止时间是用来判断该任务是否已经过期，如果过期的话就会马上执行该任务。

然后调度器通过实现 `requestIdleCallback` 函数来做到在浏览器空闲的时候去执行这些更新任务。

这其中的实现原理略微复杂。简单来说，就是通过定时器的方式，来获取每一帧的结束时间。得到每一帧的结束时间以后我们就能判断当下距离结束时间的一个差值。

如果还未到结束时间，那么也就意味着我可以继续执行更新任务；如果已经过了结束时间，那么就意味着当前帧已经没有时间给我执行任务了，必须把执行权交还给浏览器，也就是打断任务的执行。

另外当开始执行更新任务（也就是寻找工作单元并执行的过程）时，如果有新的更新任务进来，那么调度器就会按照两者的优先级大小来进行决策。如果新的任务优先级小，那么当然继续当下的任务；如果新的任务优先级大，那么会打断任务并开始新的任务。

以上就是调度器的原理简介，如果你想了解更多的内容，可以阅读我之前写的文章： [剖析 React 源码：调度原理](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F21 "https://github.com/KieSun/Dream/issues/21")。

小结
--

现在是时候把文章中提及到的内容整合起来了，另外我们假设更新任务必定会触发调度。

当交互事件调用 `setState` 后，会触发批量更新，在整个交互事件回调执行完之前 `state` 都不会发生变更。

回调执行完毕后，开始更新任务，并触发调度。调度器会给这些更新任务一一设置优先级，并且在浏览器空闲的时候去执行他们，当然任务过期除外（会立刻触发更新，不再等待）。

如果在执行更新任务的时候，有新的任务进来，会判断两个任务的优先级高低。假如新任务优先级高，那么打断旧的任务，重新开始，否则继续执行任务。

最后
--

阅读源码是一个很枯燥的过程，但是收益也是巨大的。如果你在阅读的过程中有任何的问题，都欢迎你在评论区与我交流。

另外写这系列是个很耗时的工程，需要维护代码注释，还得把文章写得尽量让读者看懂，最后还得配上画图，如果你觉得文章看着还行，就请不要吝啬你的点赞。

最后，觉得内容有帮助可以关注下我的公众号 「前端真好玩」咯，会有很多好东西等着你。

![](/images/jueJin/1678800c654a7f3.png)