---
author: "字节跳动技术团队"
title: "一文吃透 React 和 Vue 的多节点 diff 原理"
date: 2022-11-01
description: "虚拟 DOM 虚拟 DOM 节点是一个 JS 对象，用这个 JS 对象可以表示 DOM 节点、组件节点等。有了虚拟 DOM，能提高整体研发体验和效率，同时也能解决跨平台问题。"
tags: ["React.js","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:255,comments:0,collects:502,views:19216,"
---
> 我们来自字节跳动飞书商业应用研发部(Lark Business Applications)，目前我们在北京、深圳、上海、武汉、杭州、成都、广州、三亚都设立了办公区域。我们关注的产品领域主要在企业经验管理软件上，包括飞书 OKR、飞书绩效、飞书招聘、飞书人事等 HCM 领域系统，也包括飞书审批、OA、法务、财务、采购、差旅与报销等系统。欢迎各位加入我们。

> 本文作者：LBA 曾昱

> tips：本文各章节的内容有先后顺序之分，跳跃阅读可能影响理解。

前置知识：虚拟 DOM
===========

虚拟 DOM 节点是一个 JS 对象，用这个 JS 对象可以表示 DOM 节点、组件节点等，创建一个虚拟 DOM 节点比创建一个 DOM 节点的代价要小很多。有了虚拟 DOM，能提高我们的研发体验和效率，同时也能解决跨平台的问题。

在 Vue 中，通常用 VNode 指代一个虚拟 DOM 节点，我们最终会根据 VNode 生成 DOM 节点。

在 React 中，通过 React.createElement 也能生成一个虚拟 DOM 节点（ReactElement）。在 React15 及以前，采用了递归的方式创建虚拟 DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。React16 将递归的无法中断的更新重构为异步的可中断更新，推出了新的 Fiber 架构。

原本的 ReactElement 只有 children，在中断恢复时，无法找到其兄弟节点和父节点，无法从断点处继续完成渲染工作。而 fiber 节点上能访问到父节点、子节点、兄弟节点，所以即使渲染被打断了，也可以恢复查找未处理的节点。因此，React 需要先生成 ReactElement，再生成 fiber，最后才将变更映射到真实 DOM 节点。这一点和 Vue 有很大不同。

React 采用了双缓存的技术，在 React 中最多会存在两颗 fiber 树，当前屏幕上显示内容对应的 fiber 树称为 current fiber 树，正在内存中构建的 fiber 树称为 workInProgress fiber 树。当 workInProgress fiber 树构建并渲染到页面上后，应用根节点的 current 指针指向 workInProgress Fiber 树，此时workInProgress Fiber 树就变为 current Fiber 树。

假设我们有这样一段代码：

```javascript
    const App = () => {
    const [count, setCount] = React.useState(0)
    return <div onClick={() => setCount(n => n + 1)}>{count}</div>
}

ReactDOM
.createRoot(document.getElementById('root'))
.render(<App />)
```

那么，对应的 fiber 树会经历如下图所示的变化过程：

![UML 图.jpg](/images/jueJin/5ccc58df2715410.png)

React 的更新会经历两个阶段：render 阶段 和 commit 阶段。render 阶段是可中断的，commit 阶段是不可中断的。

render 阶段会生成 fiber 树，所谓的 diff 就会发生在这个阶段。React 通过深度优先遍历来生成 fiber 树，整个过程与递归是类似的，因此生成 fiber 树的过程又可以分为「递」阶段和「归」阶段。

commit 阶段主要执行各种 DOM 操作、生命周期钩子、某些 hook 等。

因此，diff 阶段不会直接变更 DOM，而是留到 commit 阶段再做变更。

Vue 与 React 不同，它通过递归的形式生成整个虚拟 DOM 树，在 diff 的同时会对 DOM 做变更。

React 18：简单 diff
================

React 每次更新时，会将新的 ReactElement（即 React.createElement() 的返回值）与旧的 fiber 树作对比，比较出它们的差异后，构建出新的 fiber 树，因此**多节点的** **diff** **实际上是用 fiber（旧子节点）和 ReactElement 数组（新子节点）进行对比**。

第一轮遍历
-----

React 团队发现，在实际的场景中，更新节点的情况要大于新增和删除节点的情况，因此第一轮遍历会先尝试更新子节点。

遍历逻辑如下：

*   从前到后遍历新旧子节点
    
    *   如果新旧子节点的 key 和 type（节点类型，如 div、p、span、函数组件名）都相同，则根据旧 fiber 和 新 ReactElement 的 props 生成新子节点 fiber。
    *   如果新旧子节点的 key 相同，但 type 不同，将根据新 ReactElement 生成新 fiber，旧 fiber 将被添加到它的父级 fiber 的 deletions 数组中，后续将被移除。
    *   如果新旧子节点的 key 和 type 都不相同，结束遍历。

![UML 图 (1).jpg](/images/jueJin/72f401ece31e418.png)

第二轮遍历
-----

如果第一轮遍历被提前终止了，意味着还有新 ReactElement 或 旧 fiber 还未被遍历。因此会有第二轮遍历去处理以下三种情况：

1.  只剩旧子节点

2.  只剩新子节点

3.  新旧子节点都有剩。

下图分别展示了这三种情况：

![UML 图 (2).jpg](/images/jueJin/84d81f81ddf54fe.png)

### 只剩旧子节点

只剩下旧子节点的处理方法很简单，只需要将剩余的旧 fiber 放到父 fiber 的 deletions 数组中，这些旧 fiber 对应的 DOM 节点将会在 commit 阶段被移除。

![UML 图 (3).jpg](/images/jueJin/9ed4b64494db48e.png)

### 只剩新子节点

对于剩余的新子节点，先创建新的 fiber 节点，然后打上 Placement 标记，我们将在遍历 fiber 树的「归」阶段生成这些新 fiber 对应的 DOM 节点。

![UML 图 (4).jpg](/images/jueJin/d97dac1167024d3.png)

### 新旧子节点都有剩

这种情况下，需要一个快速的方法帮助我们快速找到某个 ReactElement 在上一次渲染时生成的 fiber 节点。因此，我们需要一个 existingChildren Map，这个 Map 保存了旧 fiber 的 key 到 旧 fiber 的映射关系，我们可以通过新的 ReactElement 的 key 快速在这个 Map 中找到对应的旧 fiber，如果能找到，则能复用旧 fiber 以生成新 fiber；如果找不到，证明要生成新的 fiber，并打上一个 Placement 标志，以便于在 commit 阶段插入该 fiber 对应的 DOM 节点。

我们还需要找到哪些节点的位置发生了变化。

假设我们有 a、b、c、d 四个节点，它们的位置索引是 0、1、2、3，是一个递增的序列。在更新后，它们顺序发生了变化，变成了 a、c、b、d，那么它们的位置索引变为 0、2、1、3（继续沿用旧的位置索引），不再是一个递增的序列，因为索引 1 移到了 2 的后面（即 b 原本在 c 前面，更新后被移到了 c 后面），破坏了递增的规律。因此，只需要找到那些破坏了索引递增规律的节点，就知道哪些节点的位置发生了变化。那具体要怎么做呢？

其实，旧 fiber 上有 index 属性，index 属性记录了在上一次渲染时该 fiber 所在的位置索引。现在，我们暂且叫这个旧 fiber 上的 index 属性为 oldIndex，把遍历新子节点过程中访问过的最大 oldIndex 叫为 lastPlacedIndex，那么，只要当前新子节点有对应的旧 fiber，且 oldIndex < lastPlacedIndex，就可以认为该新子节点对应的 DOM 节点需要往后移动，并打上一个 Placement 标志，以便于在 commit 阶段识别出这个需要移动 DOM 节点的 fiber。

遍历逻辑如下：

*   遍历未处理的旧子节点，生成 existingChildren Map

*   从前到后遍历新子节点
    
    *   如果能在 existingChildren Map 中找到对应的旧 fiber，根据旧 fiber 生成新 fiber；如果不能，生成新 fiber，并打上 Placement 标志
        
    *   从 existingChildren Map 中删除已处理的节点
        
    *   如果新子节点有对应的旧 fiber
        
        *   当 oldIndex < lastPlacedIndex 时，给新 fiber 打上 Placement 标志；否则，令 lastPlacedIndex = newIndex
    *   如果新子节点没有对应的旧 fiber，创建一个新 fiber 并 打上 Placement 标志
        

*   遍历 existingChildren Map，将 Map 中所有节点添加到父节点的 deletions 数组中

![UML 图 (5).jpg](/images/jueJin/3f287eb10bb94c4.png)

DOM 变更
------

DOM 元素类型的 fiber 节点上存有对 DOM 节点的引用，因此在 commit 阶段，深度优先遍历每个新 fiber 节点，对 fiber 节点对应的 DOM 节点做以下变更：

1.  删除 deletions 数组中 fiber 对应的 DOM 节点

2.  如有 Placement 标志，**将节点移动到往后第一个没有 Placement 标记的** **fiber** **的** **DOM** **节点之前**。

3.  更新节点。以 DOM 节点为例，在生成 fiber 树的「归」阶段，会找出属性的变更集，在 commit 阶段更新属性。由于更新节点的实现不是本文的重点，在此不做进一步的探讨，感兴趣的同学可以找相关源码或文章进行学习。

![UML 图 (6).jpg](/images/jueJin/7044fc48726b493.png)

Bad Case
--------

在处理节点往前移的情况，React 的 diff 算法表现得就不太好了。以下图为例，节点 a、b、c、d 变为了 d、a、b、c，如果我们手动处理这种位置变化，只需要一步：将 d 节点移动到 a 前面。但 React 实际上的做法有三步：将 a、b、c 三个节点依次插入到 d 节点后面。

这是因为遍历完 d 节点后，lastPlacedIndex 变成了 3，再去遍历 a、b、c、d 时，oldIndex 一定小于 lastPlacedIndex 了。

![UML 图 (7).jpg](/images/jueJin/71569a9e6e8045b.png)

因此，实际编写代码时，应该尽量避免节点往前移动的操作。

为什么不用双端 diff
------------

既然 React 对节点往前移动的情况处理得不好，是不是可以在每次遍历的时候，都尝试和旧子节点中最后一个未处理节点做对比，看看能不能匹配上。实际上，Vue2 的 diff 就是这么做的。现在让我们来快速看一下 Vue2 使用的双端 diff 算法。

### 双端 diff (参考 Vue2 的实现)

注意：Vue 2 的双端 diff 是旧的一组 VNode（旧子节点）和新的一组 VNode（新子节点）进行对比。

#### 第一轮遍历

所谓的「双端」，表示在新旧子节点的数组中，各用两个指针指向头尾节点，在遍历过程中，头尾指针不断靠拢。因此，用 newStartIndex 和 newEndIndex 分别指向新子节点中未处理节点的头尾节点，用 oldStartIndex 和 oldEndIndex 分别指向旧子节点中未处理节点的头尾节点。

现在，我们用「新前」表示新子节点中未处理节点的第一个节点；用「新后」表示新子节点中未处理节点的最后一个节点；「旧前」表示旧子节点中未处理节点的第一个节点；用「旧后」表示旧子节点中未处理节点的最后一个节点。

每遍历到一个节点，就尝试进行双端比较：「新前 vs 旧前」、「新后 vs 旧后」、「新后 vs 旧前」、「新前 vs 旧后」，如果匹配成功，更新双端的指针。比如，新旧子节点通过「新前 vs 旧后」匹配成功，那么 newStartIndex += 1，oldEndIndex -= 1。

如果新旧子节点通过「新后 vs 旧前」匹配成功，还需要将「旧前」对应的 DOM 节点插入到「旧后」对应的 DOM 节点之前。如果新旧子节点通过「新前 vs 旧后」匹配成功，还需要将「旧后」对应的 DOM 节点插入到「旧前」对应的 DOM 节点之前。

如果通过双端比较都没法找到匹配的节点，就需要一个像 React existingChildren Map 的 Map 对象了，在 Vue2 的 diff 中，这个 Map 名字叫做 oldKeyToIdx Map。通过这个 Map，遍历时就可以尝试根据新子节点的 key 去找 oldIndex，查找结果会有两种：

*   找到 oldIndex，即新旧子节点中有相同 key 的节点。
    
    *   如果 VNode 的 type 是相同的，将旧子节点对应的 DOM 节点插入到「旧前」对应的 DOM 节点之前。
    *   如果 VNode 的 type 是不同的，创建一个新的 DOM 节点，并插入到「旧前」对应的 DOM 节点之前。

*   没找 oldIndex，需要根据新子节点（VNode）创建 DOM 元素，并插入到「旧前」对应的 DOM 节点之前。
    

如果你是第一次接触这个算法，可能会觉得复杂。简单来说，第一轮遍历会先尝试比较新旧子节点的双端节点，如果匹配不成功，再尝试在旧子节中找到对应的节点。至于 DOM 节点的移动，需要记住只能移动到「旧前」之前或「旧后」之后。如果更新后节点位置被调到前面了，移动时就需要移到「旧前」之前；如果更新后节点位置被调到后面了，移动时就需要移到「旧后」之后。

#### 第二轮遍历

*   如果第一轮遍历后，只剩下新子节点（oldStartIndex > oldEndIndex），则根据剩余的新子节点（VNode）创建 DOM 节点，并依次插入到父级 DOM 节点最后。

*   如果第一轮遍历后，只剩下旧子节点（newStartIndex > newEndIndex），则将剩余旧子节点对应的 DOM 节点依次从父级 DOM 节点中删除。
    

需要注意的是，Vue 在 diff 的过程中，会直接进行节点的更新/新建/删除操作，这点和 React 是不同的。

下图展示了 Vue 2 双端 diff 的一些例子，帮助大家更好地消化理解该算法：

![UML 图 (8).jpg](/images/jueJin/c45e7a6ad91b49f.png)

### 官方解释

React 在源码注释中解释了为什么不使用双端 diff，原文如下：

This algorithm can't optimize by searching from boths ends since we don't have backpointers on fibers. I'm trying to see how far we can get with that model. If it ends up not being worth the tradeoffs, we can add it later.

Even with a two ended optimization, we'd want to optimize for the case where there are few changes and brute force the comparison instead of going for the Map. It'd like to explore hitting that path first in forward-only mode and only go for the Map once we notice that we need lots of look ahead. This doesn't handle reversal as well as two ended search but that's unusual. Besides, for the two ended optimization to work on Iterables, we'd need to copy the whole set.

In this first iteration, we'll just live with hitting the bad case (adding everything to a Map) in for every insert/move.

结合目前的实现和自己的理解，简单地总结 React 不使用双端 diff 的原因：由于双端 diff 需要向前查找节点，但每个 fiber 节点上都没有反向指针，即前一个 fiber 通过 sibling 属性指向后一个 fiber，只能从前往后遍历，而不能反过来（你可以在上文的各个示例图中看到这种实现），因此该算法无法通过双端搜索来进行优化。React 想看下现在用这种方式能走多远，如果这种方式不理想，以后再考虑实现双端 diff。React 认为对于列表反转和需要进行双端搜索的场景是少见的，所以在这一版的实现中，先不对 bad case 做额外的优化。（若理解有误，欢迎指出～）

Vue 3：快速 diff
=============

为什么要用快速 diff
------------

快速 diff 算法最早应用于 [ivi](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flocalvoid%2Fivi "https://github.com/localvoid/ivi") 和 [inferno](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Finfernojs%2Finferno "https://github.com/infernojs/inferno") 框架，可以从下图看到其性能要优于 Vue2 的双端 diff 性能（图来自 [js-framework-benchmark](https://link.juejin.cn?target=https%3A%2F%2Fkrausest.github.io%2Fjs-framework-benchmark%2F2020%2Ftable_chrome_87.0.4280.66.html "https://krausest.github.io/js-framework-benchmark/2020/table_chrome_87.0.4280.66.html")）。

![](/images/jueJin/e8682bba97d0498.png)

因此，Vue3 也使用了快速 diff 算法。

**注意：** **Vue** **3 多节点的** **diff** **是旧的一组 VNode（旧子节点）和新的一组 VNode（新子节点）进行对比**。

第一轮遍历
-----

先从新旧子节点的头部节点开始，一个一个进行对比，直到遇到不相同的节点，再从新旧子节点的尾部节点开始，一个一个进行对比，直到遇到不相同的节点。

![UML 图 (9).jpg](/images/jueJin/8985f95f59dd4ef.png)

第二轮遍历
-----

如果第一轮遍历结束之后还有新子节点或旧子节点未被处理，那么会有三种情况：

1.  只剩新子节点

2.  只剩旧子节点

3.  新旧子节点都有剩
    

### 只剩新子节点

对于剩余的新子节点，依次创建对应的 DOM 节点，并插入到尾部已处理节点之前。

![UML 图 (10).jpg](/images/jueJin/af7e3ca002e04e1.png)

### 只剩旧子节点

对于剩余的旧子节点，依次从父级 DOM 节点中删除对应的 DOM 节点。

![UML 图 (11).jpg](/images/jueJin/ac8c2b3d4cdf442.png)

### 新旧子节点都有剩

这种情况下有可能有节点需要移动，在介绍 React diff 算法的时候，我们提到过，假设旧子节点的位置索引序列是递增序列，使用新子节点在旧子节点中的位置索引组合成一个位置索引序列，如果这个序列是非递增序列，那么就肯定存在节点移动的情况。进一步思考，可以发现新的位置索引序列中的最大递增子序列是不需要移动的，其余索引对应的节点才需要移动。

因此，需要引入求解最长递增子序列的算法。

#### 求解最长递增子序列：**贪心 + 二分查找**

[Leetcode 300](https://link.juejin.cn?target=https%3A%2F%2Fleetcode.cn%2Fproblems%2Flongest-increasing-subsequence%2F "https://leetcode.cn/problems/longest-increasing-subsequence/") 是一道求解最长递增子序列长度的算法题，我们可以从这道题目入手。先来看看原题：

```ini
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，
[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

示例 1：
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
```

考虑一个简单的贪心，如果我们要使上升子序列尽可能的长，则我们需要让序列上升得尽可能慢，因此我们希望每次在上升子序列最后加上的那个数尽可能的小。

基于上面的贪心思路，我们维护一个数组 d\[i\]，表示长度为 i 的最长上升子序列的末尾元素的最小值。

用 len 记录目前最长上升子序列的长度，起始时 len 为 1，d\[1\] = nums\[0\]。

整个算法流程为：

*   设当前已求出的最长递增子序列的长度为 len（初始时为 1），从前往后遍历数组 nums，在遍历到 nums\[i\] 时：
    
    *   如果 nums\[i\] > d\[len\]，则直接加入到 d 数组末尾，并更新 len = len + 1
        
    *   否则，在 d 数组中进行二分查找，找到第一个比 nums\[i\] 小的数 d\[k\]，并更新 d\[k + 1\] = nums\[i\]
        

下图展示了整个求解过程（图来自 [Longest\_increasing\_subsequence](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLongest_increasing_subsequence "https://en.wikipedia.org/wiki/Longest_increasing_subsequence")）：

![](/images/jueJin/559157d186fc43a.png)

当然，实际中 Vue 3 中用到的方法要更复杂（[点击此处访问源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fblob%2Fv3.2.37%2Fpackages%2Fruntime-core%2Fsrc%2Frenderer.ts%23L2410 "https://github.com/vuejs/core/blob/v3.2.37/packages/runtime-core/src/renderer.ts#L2410")），因为 Vue 3 需要算出准确的最长递增子序列，而不仅仅是序列的长度。

具体的处理流程可不止求解最长递增子序列，现在让我们通过一个例子来理解处理流程吧！

旧子节点

```xml
<div>
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
<div key="d">d</div>
<div key="f">f</div>
<div key="e">e</div>
</div>
```

新子节点

```xml
<div>
<div key="a">a</div>
<div key="c">c</div>
<div key="d">d</div>
<div key="b">b</div>
<div key="g">g</div>
<div key="e">e</div>
</div>
```

要求解最长递增子序列我们就先需要一个数组 newIndexToOldIndexMap（虽然源码中叫 Map，但它实际上是一个数组），这个数组表示新的一组子节点中的节点在旧的一组子节点中的位置索引。这个数组中的 0 值表示对应位置索引的新子节点在旧的一组子节点中不存在匹配的节点，证明需要挂载新的 DOM 节点。因此，只要新子节点在旧的一组子节点中能找到匹配的节点，在记录位置索引到 newIndexToOldIndexMap 前，都需要将位置索引做加 1 处理。

为了构造这个 newIndexToOldIndexMap 数组，需要遍历未处理的旧子节点，遍历过程主要做以下事情：

1.  填充 newIndexToOldIndexMap 数组。

2.  确定是否存在需要移动的节点。这个结果将用于判断是否需要求解最长递增子序列，在没有节点移动的情况下，能降低时间复杂度。判断方法本质上和 React 是类似的实现原理，Vue 3 将访问过的最大 newIndex（旧子节点在新的一组子节点中的位置索引）记录到一个叫 maxNewIndexSoFar 的变量中，如果当前 newIndex < maxNewIndexSoFar，证明存在需要移动的节点。

3.  更新那些能找到对应新子节点的旧子节点。

4.  卸载那些找不到对应新子节点的旧子节点。

![1101-1.jpg](/images/jueJin/8cc0ca3ac56c4bc.png)

遍历完旧子节点后，数组 newIndexToOldIndexMap 为：\[2, 3, 1, 0\]，尽管最长递增子序列是 \[2, 3\]，但我们需要知道哪些位置的节点是不需要移动的，所以得到这样一个叫 increasingNewIndexSequence 的数组：\[0, 1\]，表示第一和第二个节点是不需要移动的。

接下来从后往前遍历新子节点（假设 i 为当前遍历节点的位置索引）：

*   如果 newIndexToOldIndexMap\[i\] 为 0，需要新建 DOM 节点，插入到右边新子节点（VNode）的 DOM 节点之前。

*   如果 increasingNewIndexSequence 数组里不包含 i，证明这个新子节点不在最长递增子序列中，需要将它对应的 DOM 节点需要插入到右边新子节点的 DOM 节点之前。

*   如果 increasingNewIndexSequence 数组里包含 i，证明当前新子节点对应的 DOM 节点不需要移动。

注意，遍历新子节点时不再需要更新节点，因为在遍历旧子节点时已经更新过了。

![UML 图 (12).jpg](/images/jueJin/5712293272e342d.png)

参考
==

*   [React 技术揭秘](https://link.juejin.cn?target=https%3A%2F%2Freact.iamkasong.com%2F "https://react.iamkasong.com/")
*   [React源码揭秘3 Diff算法详解](https://juejin.cn/post/6844904167472005134 "https://juejin.cn/post/6844904167472005134")
*   [维基百科 Longest increasing subsequence](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLongest_increasing_subsequence "https://en.wikipedia.org/wiki/Longest_increasing_subsequence")
*   [最长上升子序列 力扣官方题解](https://link.juejin.cn?target=https%3A%2F%2Fleetcode.cn%2Fproblems%2Flongest-increasing-subsequence%2Fsolution%2Fzui-chang-shang-sheng-zi-xu-lie-by-leetcode-soluti%2F "https://leetcode.cn/problems/longest-increasing-subsequence/solution/zui-chang-shang-sheng-zi-xu-lie-by-leetcode-soluti/")

**加入我们**
--------

扫码发现职位&投递简历

![](/images/jueJin/f8b629a2ca1b4fb.png)

官网投递：[job.toutiao.com/s/FyL7DRg](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg "https://job.toutiao.com/s/FyL7DRg")

> 欢迎大家关注[**飞书技术**](https://juejin.cn/user/712139266595784 "https://juejin.cn/user/712139266595784")，每周定期更新飞书技术团队技术干货内容，想看什么内容，欢迎大家评论区留言~