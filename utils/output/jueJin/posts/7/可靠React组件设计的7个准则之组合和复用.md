---
author: "无名之苝"
title: "可靠React组件设计的7个准则之组合和复用"
date: 2019-08-12
description: "原文的篇幅非常长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 组合和复用。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。 组合（com…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:75,comments:12,collects:56,views:5023,"
---
> 翻译：刘小夕
> 
> 原文链接：[dmitripavlutin.com/7-architect…](https://link.juejin.cn?target=https%3A%2F%2Fdmitripavlutin.com%2F7-architectural-attributes-of-a-reliable-react-component%2F "https://dmitripavlutin.com/7-architectural-attributes-of-a-reliable-react-component/")

原文的篇幅**非常**长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 **组合和复用**。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

———————————————我是一条分割线————————————————

组合
--

> 一个组合式组件是由更小的特定组件组合而成的。

组合（composition）是一种通过将各组件联合在一起以创建更大组件的方式。组合是 React 的核心。

幸运的是，组合易于理解。把一组小的片段，联合起来，创建一个更大个儿。

![](/images/jueJin/16c79bed2ea1599.png)

让我们来看一个常见的前端应用组合模式。应用由头部的 `header`、底部的 `footer`、左侧的 `sidebar`，还有中部的有效内容联合而成：

![](/images/jueJin/16c79c233defd7d.png)

```
<div id="root"></div>
``````
    function Application({ children }) {
    return (
    <div className="application box">
    <Label>Application</Label>
{children}
</div>
);
}

    function Header() {
    return (
    <div className="header box">
    <Label>Header</Label>
    </div>
    )
}

    function Footer() {
    return (
    <div className="header box">
    <Label>Footer</Label>
    </div>
    )
}

    function Sidebar({ children }) {
    return (
    <div className="sidebar box">
    <Label>Sidebar</Label>
{children}
</div>
);
}

    function Content({ children }) {
    return (
    <div className="content box">
    <Label>Content</Label>
{children}
</div>
)
}

    function Menu() {
    return (
    <div className="menu box">
    <Label>Menu</Label>
    <div className="description">
    <div className="text shorter" />
    <div className="text" />
    <div className="text shorter" />
    <div className="text shorter" />
    </div>
    </div>
    );
}

    function Article() {
    return (
    <div className="article box">
    <Label>Article</Label>
    <div className="description">
    <div className="text shorter" /> <div className="text longer" />
    <div className="text shorter" /> <div className="text" />
    <div className="text shorter" /> <div className="text" />
    <div className="text" /> <div className="text shorter" />
    <div className="text shorter" /> <div className="text" />
    <div className="text" /> <div className="text shorter" />
    <div className="text shorter" /> <div className="text longer" />
    <div className="text shorter" /> <div className="longer" />
    <div className="text shorter" /> <div className="text" />
    <div className="text" /> <div className="text shorter" />
    <div className="text shorter" /> <div className="text" />
    </div>
    </div>
    );
}

    function Label({ children }) {
    return <div className="label">&lt;{children}&gt;</div>
}

const app = (
<Application>
<Header />
<Sidebar>
<Menu />
</Sidebar>
<Content>
<Article />
</Content>
<Footer />
</Application>
);

ReactDOM.render(app, document.getElementById('root'));
```

应用程序演示了组合如何构建应用程序。这种组织这样组织代码即富于表现力又便于理解。

React 组件的组合是自然而然的。这个库使用了一个声明范式，从而不会抑制组合式的表现力。

`<Application>` 由 `<Header>` 、 `<Sidebar>` `<Content>` 和 `<Footer>` 组成. `<Sidebar>` 有一个 `<Menu>` 组件, `<Content>` 有一个 `<Article>` 组件.

那么组合与单一责任以及封装有什么联系呢？让我们一起看看：

> [单一责任原则](https://juejin.cn/post/6844903908372905998 "https://juejin.cn/post/6844903908372905998")描述了如何将需求拆分为组件，[封装](https://juejin.cn/post/6844903909148852237 "https://juejin.cn/post/6844903909148852237")描述了如何组织这些组件，组合描述了如何将整个系统粘合在一起。

### 组合的好处

#### 单一责任

组合的一个重要方面在于能够从特定的小组件组成复杂组件的能力。这种分而治之的方式帮助了被组合而成的复杂组件也能符合 SRP 原则。

回顾之前的代码片段，`<Application>` 负责渲染 `header` 、`footer` 、`sidebar` 和主体区域。

将此职责分为四个子职责是有意义的，每个子职责由专门的组件实现，分别是`<header>` 、`<sidebar>` 、`<content>` 和 `<footer>`。随后，这些组件被粘合在 `<Application>` 。

现在来看看组合的好处：通过子组件分别实现单一职责的方式，使 `<Application>` 组件也符合单一责任原则。

#### 可重用

组合有可重用的有点，使用组合的组件可以重用公共逻辑，

例如，组件 `<Composed1>` 和 `<Composed2>` 有一些公共代码：

```
const instance1 = (
<Composed1>
/* Specific to Composed1 code... */
/* Common code... */
</Composed1>
);
const instance2 = (
<Composed2>
/* Common code... */
/* Specific to Composed2 code... */
</Composed2>
);
```

代码复制是一个不好的实践(例如更改 `Composed1` 的代码时，也需要去更改`Composed2` 中的代码)，那么如何使组件重用公共代码？

首先，将共同代码封装到一个新组件中，如 `<Common>` 中，然后

首先，在新组件中封装公共代码。其次，`<Composed1>` 和 `<Composed2>` 应该使用组合的方式来包含 `<Common>`组件，以避免代码重复，如下：

```
const instance1 = (
<Composed1>
<Piece1 />
<Common />
</Composed1>
);
const instance2 = (
<Composed2>
<Common />
<Piece2 />
</Composed2>
);
```

可重用的组件符合不重复自己(`Don't repeat yourself`)的原则。这种做法可以节省你的精力和时间，并且在后期，有利于代码维护。

#### 灵活

在 `react` 中，一个组合式的组件通过给子组件传递 `props` 的方式，来控制其子组件。这就带来了灵活性的好处。

例如，有一个组件，它需要根据用户的设备显示信息，使用组合可以灵活地实现这个需求：

```
    function ByDevice({ children: { mobile, other } }) {
    return Utils.isMobile() ? mobile : other;
}

    <ByDevice>{{
    mobile: <div>Mobile detected!</div>,
    other: <div>Not a mobile device</div>
    }}</ByDevice>
```

`<ByDevice>` 组合组件，对于移动设备，显示: `Mobile detected!`; 对于非移动设备，显示 `Not a mobile device"`。

#### 高效

用户界面可组合的层次结构，因此，组件的组合是一种构建用户界面的有效的方式。

注：`DRY` 原则理论上来说是没有问题的，但在实际应用是切忌死搬教条。它只能起指导作用，没有量化标准，否则的话理论上一个程序每一行代码都只能出现一次才行，这是非常荒谬的，其它的原则也是一样，起到的也只是指导性的作用。

复用
--

> 可重用的组件，一次编写多次使用。

想象一下，如果软件开发总是重复造轮子。那么当你编写代码时，不能使用任何已有库或工具。甚至在同一个应用中你都不能使用已经编写过的代码。在这种环境中，是否有可能在合理的时间内编写出一个应用呢？绝无可能。

此时应该到认识重用的重要性，使用已有的库或代码，而不是重复造轮子。

### 应用内的复用

根据“不要重复自己”（`DRY`）原则，每一条知识都必须在系统中具有单一，明确，权威的表示。这个原则建议避免重复。

代码重复增加了复杂性和维护工作，但没有增加显著的价值。逻辑更新迫使您修改应用程序中的所有重复代码。

重复问题可以用可复用组件来解决。一次编写，多次使用。

但是，复用并非毫无成本。只有一个组件符合单一责任原则并且具有合理的封装时，它是可复用的。

符合单一职责原则是必须的：

> 复用一个组件实际上就意味着复用其职责

只有一个职责的组件是最容易复用的。

但是，当一个组件错误地具有多个职责时，它的复用会增加大量的开销。你只想复用一个职责实现，但也会得到不必要的职责实现。比如，你只是想要一个香蕉，但是在你得到一个香蕉的同时，不得不被迫接受所有的丛林。

合理封装的组件。隐藏了内部实现，并且有明确的 `props` ，使得组件可以使用与多种需要复用的场合。

### 复用第三方库

某个工作日，你刚刚收到了为应用增加新特性的任务，在撩起袖子狂敲代码之前，先稍等几分钟。

你要做的工作在很大概率上已经被解决了。由于 `React` 非常流行以及其非常棒的开源社区，先搜索一下是否有已存在的解决方案是明智之举。

查看 [`brillout/awesome-react-components`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbrillout%2Fawesome-react-components "https://github.com/brillout/awesome-react-components") ，它有一个可复用的组件列表。

优秀的第三方库有结构性的影响，并且会推广最佳实践。以我的经验而言，最有影响的当属 `react-router` 和 `redux`。

`react-router` 使用了声明式的路由来构建一个单页应用。使用 `<Route>` 将 `URL` 和组件关联起来。当用户访问匹配的 `URL` 时，路由将渲染相应的组件。

`redux` 和 `react-redux` 引入了单向和可预测的应用状态管理。可以将异步的和非纯的代码（例如 `HTTP` 请求）从组件中提取出来，从而符合单一职责原则并创建出 纯（pure）组件 或 几乎纯（almost-pure）的组件。

> 这里是一份检查清单可以确定第三方库是否值得使用，：

*   文档：检查库是否具备有意义的 `README.md` 文件和详细的文档
*   测试过的：可信赖库的一个显著特征就是有高的测试覆盖率
*   维护：看看库作者创建新特性、修改bug及日常维护的频率

**最后谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)