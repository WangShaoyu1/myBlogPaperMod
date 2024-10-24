---
author: "yck"
title: "剖析 React 源码：先热个身"
date: 2019-04-24
description: "我 fork 了一份 1686 版本的代码，并且会为读过的代码加上详细的中文注释。等不及我文章的同学可以先行阅读 我的仓库，并且在阅读本系列文章的时候也请跟着阅读我注释的代码。因为版本不同可能会导致代码不同，并且我不会在文章中贴上大段的代码，只会对部分代码做更详细的解释，其…"
tags: ["React.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:565,comments:84,collects:502,views:21000,"
---
这是我的 React 源码解读课的第一篇文章，首先来说说为啥要写这个系列文章：

*   现在工作中基本都用 React 了，由此想了解下内部原理
*   市面上 Vue 的源码解读数不胜数，但是反观 React 相关的却寥寥无几，也是因为 React 源码难度较高，因此我想来攻克这个难题
*   自己觉得看懂并不一定看懂了，写出来让读者看懂才是真懂了，因此我要把我读懂的东西写出来

这个系列文章预计篇数会超过十篇，**React 版本为 16.8.6**，以下是本系列文章你必须需要注意的地方：

*   这是一门进阶课，如果涉及到你不清楚的内容，请自行谷歌，另外最好具备 React 的开发能力
*   这是一门讲源码的课，只阅读是不大可能真正读懂的，需要辅以 Demo 和 Debug 才能真正理解代码的用途
*   我 fork 了一份 16.8.6 版本的代码，并且会为读过的代码加上详细的中文注释。等不及我文章的同学可以先行阅读 [我的仓库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation")，**并且在阅读本系列文章的时候也请跟着阅读我注释的代码。因为版本不同可能会导致代码不同，并且我不会在文章中贴上大段的代码，只会对部分代码做更详细的解释，其他的代码可以跟着我的注释阅读**
*   阅读源码最先遇到的问题会是不知道该从何开始，我这份代码注释可以帮助大家解决这个问题，你只需要跟着我的 commit 阅读即可
*   不会对任何 DEV 环境下的代码做解读，不会对所有代码进行解读，只会解读核心功能（即使这样也会是一个大工程）
*   最后再提及一遍，**请务必文章和 [代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation") 相结合来看**，为了篇幅考虑我不会将所有的代码都贴上来，我拷贝的累，读者看的也累

这篇文章内容不会很难，先给大家热个身，请大家打开 [我的代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation") 并定位到 react 文件夹下的 src，这个文件夹也就是 React 的入口文件夹了。

![](/images/jueJin/16a4061894281d2.png)

> 开始进入正文前先说下这个系列中我的行文思路：1. 代码尽量通过图片展示，既美观又方便阅读，反正不需要大家复制代码。2. 文章中只会讲我认为重要或者有意思的代码，对于其他代码请自行阅读我的仓库，反正已经注释好代码了。3. 对于流程长的函数调用会使用流程图的方式来总结。4. 不会干巴巴的只讲代码，会结合实际来聊聊这些 API 能帮助我们解决什么问题。

文章相关资料
------

*   [React 16.8.6 源码中文注释](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation")，这个链接是文章的核心，文中的具体代码及代码行数都是依托于这个仓库
*   [render 流程（一）](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F19 "https://github.com/KieSun/Dream/issues/19")
*   [render 流程（二）](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F20 "https://github.com/KieSun/Dream/issues/20")

![](/images/jueJin/16ad8f1f2da96d7.png)

React.createElement
-------------------

大家在写 React 代码的时候肯定写过 JSX，但是为什么一旦使用 JSX 就必须引入 React 呢？

这是因为我们的 JSX 代码会被 Babel 编译为 `React.createElement`，不引入 React 的话就不能使用 `React.createElement` 了。

```
<div id='1'>1</div>
// 上面的 JSX 会被编译成这样
    React.createElement("div", {
    id: "1"
    }, "1")
```

那么我们就先定位到 **ReactElement.js** 文件阅读下 `createElement` 函数的实现

```
export function createElement(type, config, children) {}
```

首先 `createElement` 函数接收三个参数，具体代表着什么相信大家可以通过上面 JSX 编译出来的东西自行理解。

然后是对于 `config` 的一些处理：

![](/images/jueJin/16a4422d931c7a7.png)

这段代码对 `ref` 以及 `key` 做了个验证（对于这种代码就无须阅读内部实现，通过函数名就可以了解它想做的事情），然后遍历 `config` 并把内建的几个属性（比如 `ref` 和 `key`）剔除后丢到 props 对象中。

接下里是一段对于 `children` 的操作

![](/images/jueJin/16a441d7579f382.png)

首先把第二个参数之后的参数取出来，然后判断长度是否大于一。大于一的话就代表有多个 `children`，这时候 `props.children` 会是一个数组，否则的话只是一个对象。**因此我们需要注意在对 `props.children` 进行遍历的时候要注意它是否是数组**，当然你也可以利用 `React.Children` 中的 API，下文中也会对 `React.Children` 中的 API 进行讲解。

最后就是返回了一个 `ReactElement` 对象

![](/images/jueJin/16a442a623b4bbd.png)

内部代码很简单，**核心**就是通过 `?typeof` 来帮助我们识别这是一个 `ReactElement`，后面我们可以看到很多这样类似的类型。另外我们需要注意一点的是：通过 JSX写的 `<APP />` 代表着 `ReactElement`，`APP` 代表着 React Component。

以下是这一小节的流程图内容：

![](/images/jueJin/16a48bfd967b749.png)

ReactBaseClasses
----------------

上文中讲到了 `APP` 代表着 React Component，那么这一小节我们就来阅读组件相关也就是 **ReactBaseClasses.js** 文件下的代码。

其实在阅读这部分源码之前，我以为代码会很复杂，可能包含了很多组件内的逻辑，结果内部代码相当简单。这是因为 React 团队将复杂的逻辑全部丢在了 react-dom 文件夹中，你可以把 react-dom 看成是 React 和 UI 之间的**胶水层**，这层胶水可以兼容很多平台，比如 Web、RN、SSR 等等。

该文件包含两个基本组件，分别为 `Component` 及 `PureComponent`，我们先来阅读 `Component` 这部分的代码。

![](/images/jueJin/16a48e5f3a4924d.png)

构造函数 `Component` 中需要注意的两点分别是 `refs` 和 `updater`，前者会在下文中专门介绍，后者是组件中相当重要的一个属性，我们可以发现 `setState` 和 `forceUpdate` 都是调用了 `updater` 中的方法，但是 `updater` 是 react-dom 中的内容，我们会在之后的文章中学习到这部分的内容。

另外 `ReactNoopUpdateQueue` 也有一个单独的文件，但是内部的代码看不看都无所谓，因为都是用于报警告的。

接下来我们来阅读 `PureComponent` 中的代码，其实这部分的代码基本与 `Component` 一致

![](/images/jueJin/16a48f36c7559a1.png)

`PureComponent` 继承自 `Component`，继承方法使用了很典型的寄生组合式。

另外这两部分代码你可以发现每个组件都有一个 `isXXXX` 属性用来标志自身属于什么组件。

以上就是这部分的代码，接下来的一小节我们将会学习到 `refs` 的一部分内容。

Refs
----

refs 其实有好几种方式可以创建：

*   字符串的方式，但是这种方式已经不推荐使用
*   `ref={el => this.el = el}`
*   `React.createRef`

这一小节我们来学习 `React.createRef` 相关的内容，其余的两种方式不在这篇文章的讨论范围之内，请先定位到 **ReactCreateRef.js** 文件。

![](/images/jueJin/16a4913f5f239ab.png)

内部实现很简单，如果我们想使用 `ref`，只需要取出其中的 `current` 对象即可。

另外对于函数组件来说，是不能使用 `ref` 的，如果你不知道原因的话可以直接阅读 [文档](https://link.juejin.cn?target=https%3A%2F%2Freact.docschina.org%2Fdocs%2Frefs-and-the-dom.html%23refs-%25E4%25B8%258E%25E5%2587%25BD%25E6%2595%25B0%25E5%25BC%258F%25E7%25BB%2584%25E4%25BB%25B6 "https://react.docschina.org/docs/refs-and-the-dom.html#refs-%E4%B8%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6")。

当然在之前也是有取巧的方式的，就是通过 `props` 的方式传递 `ref`，但是现在我们有了新的方式 `forwardRef` 去解决这个问题。

具体代码见 **forwardRef.js** 文件，同样内部代码还是很简单

![](/images/jueJin/16a491bfb86d4cb.png)

这部分代码最重要的就是我们可以在参数中获得 `ref` 了，因此我们如果想在函数组件中使用 `ref` 的话就可以把代码写成这样：

```
const FancyButton = React.forwardRef((props, ref) => (
<button ref={ref} className="FancyButton">
{props.children}
</button>
))
```

ReactChildren
-------------

这一小节会是这篇文章中最复杂的一部分，可能需要自己写个 Demo 并且 Debug 一下才能真正理解源码为什么要这样实现。

首先大家需要定位到 **ReactChildren.js** 文件，这部分代码中我只会介绍关于 `mapChildren` 函数相关的内容，因为这部分代码基本就贯穿了整个文件了。

如果你没有使用过这个 API，可以先自行阅读 [文档](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Freact-api.html%23reactchildren "https://reactjs.org/docs/react-api.html#reactchildren")。

对于 `mapChildren` 这个函数来说，通常会使用在组合组件设计模式上。如果你不清楚什么是组合组件的话，可以看下 Ant-design，它内部大量使用了这种设计模式，比如说 `Radio.Group`、`Radio.Button`，另外这里也有篇 [文档](https://link.juejin.cn?target=https%3A%2F%2Freact-cn.github.io%2Freact%2Fdocs%2Fmultiple-components.html "https://react-cn.github.io/react/docs/multiple-components.html") 介绍了这种设计模式。

我们先来看下这个函数的一些神奇用法

```
React.Children.map(this.props.children, c => [[c, c]])
```

对于上述代码，`map` 也就是 `mapChildren` 函数来说返回值是 `[c, c, c, c]`。不管你第二个参数的函数返回值是几维嵌套数组，`map` 函数都能帮你摊平到一维数组，并且每次遍历后返回的数组中的元素个数代表了同一个节点需要复制几次。

如果文字描述有点难懂的话，就来看代码吧：

```
<div>
<span>1</span>
<span>2</span>
</div>
```

对于上述代码来说，通过 `c => [[c, c]]` 转换以后就变成了

```
<span>1</span>
<span>1</span>
<span>2</span>
<span>2</span>
```

接下里我们进入正题，来看看 `mapChildren` 内部到底是如何实现的。

![](/images/jueJin/16a496a54483e18.png)

这段代码有意思的部分是引入了对象重用池的概念，分别对应 `getPooledTraverseContext` 和 `releaseTraverseContext` 中的代码。当然这个概念的用处其实很简单，就是维护一个大小固定的对象重用池，每次从这个池子里取一个对象去赋值，用完了就将对象上的属性置空然后丢回池子。维护这个池子的用意就是提高性能，毕竟频繁创建销毁一个有很多属性的对象会消耗性能。

接下来我们来学习 `traverseAllChildrenImpl` 中的代码，这部分的代码需要分为两块来讲

![](/images/jueJin/16a4986867d1eba.png)

这部分的代码相对来说简单点，主体就是在判断 `children` 的类型是什么。如果是可以渲染的节点的话，就直接调用 `callback`，另外你还可以发现在判断的过程中，代码中有使用到 `?typeof` 去判断的流程。这里的 `callback` 指的是 `mapSingleChildIntoContext` 函数，这部分的内容会在下文中说到。

![](/images/jueJin/16a498cdbb289d1.png)

这部分的代码首先会判断 `children` 是否为数组。如果为数组的话，就遍历数组并把其中的每个元素都递归调用 `traverseAllChildrenImpl`，也就是说必须是单个可渲染节点才可以执行上半部分代码中的 `callback`。

如果不是数组的话，就看看 `children` 是否可以支持迭代，原理就是通过 `obj[Symbol.iterator]` 的方式去取迭代器，返回值如果是个函数的话就代表支持迭代，然后逻辑就和之前的一样了。

讲完了 `traverseAllChildrenImpl` 函数，我们最后再来阅读下 `mapSingleChildIntoContext` 函数中的实现。

![](/images/jueJin/16a49df3673fa29.png)

`bookKeeping` 就是我们从对象池子里取出来的东西，然后调用 `func` 并且传入节点（此时这个节点肯定是单个节点），此时的 `func` 代表着 `React.mapChildren` 中的第二个参数。

接下来就是判断返回值类型的过程：如果是数组的话，还是回归之前的代码逻辑，注意这里传入的 `func` 是 `c => c`，因为要保证最终结果是被摊平的；如果不是数组的话，判断返回值是否是一个有效的 Element，验证通过的话就 clone 一份并且替换掉 `key`，最后把返回值放入 `result` 中，`result` 其实也就是 `mapChildren` 的返回值。

至此，`mapChildren` 函数相关的内容已经解析完毕，还不怎么清楚的同学可以通过以下的流程图再复习一遍。

![](/images/jueJin/16a4e126963e194.png)

其余内容
----

前面几小节的内容已经把 react 文件夹下大部分有意思的代码都讲完了，其他就剩余了一些边边角角的内容。比如 `memo`、`context`、`hooks`、`lazy`，这部分代码有兴趣的可以直接自行阅读，反正内容都还是很简单的，难的部分都在 react-dom 文件夹中。

其他文章列表
------

*   [render 流程（一）](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F19 "https://github.com/KieSun/Dream/issues/19")

最后
--

阅读源码是一个很枯燥的过程，但是收益也是巨大的。如果你在阅读的过程中有任何的问题，都欢迎你在评论区与我交流，当然你也可以在仓库中提 Issus。

另外写这系列是个很耗时的工程，需要维护代码注释，还得把文章写得尽量让读者看懂，最后还得配上画图，如果你觉得文章看着还行，就请不要吝啬你的点赞。

下一篇文章就会是 Fiber 相关的内容，并且会分成几篇文章来讲解。

最后，觉得内容有帮助可以关注下我的公众号 「前端真好玩」咯，会有很多好东西等着你。

![](/images/jueJin/1678800c654a7f3.png)