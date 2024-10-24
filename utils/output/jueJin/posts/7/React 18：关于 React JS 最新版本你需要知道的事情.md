---
author: "Gaby"
title: "React 18：关于 React JS 最新版本你需要知道的事情"
date: 2021-08-28
description: "期待已久的 React 18 版本终于发布了。它的团队终于公布了 React 18 的 alpha 版本及其计划。在这里了解新功能。"
tags: ["前端","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:4,views:2313,"
---
**这是我参与8月更文挑战的第26天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

* * *

> 期待已久的 React 18 版本终于发布了。它的团队终于公布了 React 18 的 alpha 版本及其计划。在这里了解新功能。

期待已久的 React 18 版本终于发布了。它的团队终于透露了 React 18 的 alpha 版本及其计划，尽管正式发布仍在等待中。这次团队尝试了一些东西并首先发布计划以了解他们的用户反馈，因为React 17的最后一个版本在开发人员中并没有那么受欢迎。

根据[前端框架调查](https://link.juejin.cn?target=https%3A%2F%2F2019.stateofjs.com%2Ffront-end-frameworks%2F "https://2019.stateofjs.com/front-end-frameworks/")，**React JS 在最受欢迎的框架列表中名列前茅**。因此，开发人员社区对该框架的期望更高，因此他们对之前的发布不太满意。

![image.png](/images/jueJin/7a674dc637294e0.png)

所以，这一次 React 18 将大放异彩。对于初学者，该团队正在研究一种新方法。他们召集了一个由专家、图书馆作者、教育工作者和开发人员组成的小组参加一个工作组。最初，它将是一个小团体。

我不是这个版本的一部分，而是在他们的 GitHub 讨论组中关注团队。从那里收集到的信息，我可以说他们这次计划得更好。

React 18 的主要内容将是
----------------

*   一些重要的开箱即用性能改进
*   新的并发功能
*   服务器端渲染区域的基本改进

在这篇文章中，我将解释团队在 React 18 中引入的三个主要特性。所以，和我一起探索 React 18 的特性。

### 1. 并发 

React 18 的中心主题是并发。你知道它的含义吗？我先给你解释一下。

并发是同时执行多个任务的能力。考虑标准 React 应用程序的情况，假设动画在组件中工作，同时用户可以键入或单击 React 的其他组件。

![image.png](/images/jueJin/d492fbe6902d431.png)

在这里，当用户输入和点击按钮时，动画也会在 React 的上下文中呈现。

React 必须处理所有的函数调用、钩子调用和事件回调，其中一些甚至可以同时发生。如果 React 一直在渲染动画帧，用户会认为应用程序卡住了，因为它不会对他们的输入做出反应。

现在，React 在单线程进程上工作，必须合并、重新排序和优先处理这些事件和函数，以便为用户提供最佳和高质量的体验。

为此，React 在内部使用了一个“调度程序”，负责对这些回调进行优先级排序和请求。

在 React 18 之前，用户无法控制这些函数的调用顺序。但是现在，它通过 Transition API 向用户提供了对这个事件循环的一些控制。

### 2. 自动处理

当一组 React 将多个状态更新为一个渲染以提高性能时，称为批处理。

例如，如果您在同一个点击事件中有两个状态更新，React 总是将它们批处理为一次重新渲染。如果您正在运行以下代码，您会注意到每次单击时，React 只执行一次代码渲染，尽管您设置了两次状态：

```js
    function App() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    
        function handleClick() {
        setCount(c => c + 1); // Does not re-render yet
        setFlag(f => !f); // Does not re-render yet
        // React will only re-render once at the end (that's batching!)
    }
    
    return (
    <div>
    <button onClick={handleClick}>Next</button>
    <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
    );
}
```

它有利于性能，因为它避免了不重要的重新渲染。它还可以防止组件呈现仅更新单个状态变量的半完成状态，从而产生错误。您可能会想到餐厅服务员在您选择第一道菜时不会跑到他的厨房，而是等您完成订单。 

不过，React 的批量更新时间并不固定。这是因为 React 过去只在浏览器事件（如点击）期间批量更新，但这里我们在事件已经处理后更新状态（在 fetch 回调中）：

```js
    function App() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    
        function handleClick() {
            fetchSomething().then(() => {
            // React 17 and earlier does NOT batch these because
            // they run *after* the event in a callback, not *during* it
            setCount(c => c + 1); // Causes a re-render
            setFlag(f => !f); // Causes a re-render
            });
        }
        
        return (
        <div>
        <button onClick={handleClick}>Next</button>
        <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
        </div>
        );
    }
```

在自动批处理中（在将您的系统更新到 React 18 之后），无论状态来自何处，它总是会重新渲染一次。

#### 如果您不想批量处理

在这里，您必须使用 Flash 同步来重新渲染组件。

![image.png](/images/jueJin/a1573c965283436.png)

### 3. SSR 支持 Suspense

它是服务器端渲染 (SSR) 逻辑的扩展。在典型的 React SSR 应用程序中，会发生以下步骤：

*   服务器检索必须显示在 UI 上的相关数据
*   服务器将整个应用程序呈现为 HTML 并将其传输到客户端作为响应。
*   客户端下载 JavaScript 包（不包括 HTML）
*   在最后一步，客户端将 javascript 逻辑连接到 HTML（称为 hydration）。

典型的 SSR 应用程序存在一个问题，即必须立即完成整个应用程序的每一步，然后才能开始下一步。 

但是现在，React 18 已经尝试解决这个问题。`<Suspense>` 组件进行了革命性的改进，将应用程序分解为通过上述步骤的更小的独立单元。因此，用户将快速看到应用内容并开始更快地与其进行交互。

### 4. 过渡

Transition API 是 React 18 附带的一个令人难以置信的功能。它允许用户解决大屏幕上频繁更新的问题。例如，在过滤数据列表的输入字段中键入。您必须在状态中求解区域的值以分离数据并控制输入字段值。此代码可能类似于以下代码：

更新输入值和搜索结果：

`setSearchQuery(input);`

每当用户键入任何字符时，我们都会更新输入值并使用新值来查找列表并显示结果。当所有内容都呈现时，它可能会导致页面延迟进行大屏幕更新，从而使其他交互或键入缓慢且无响应。即使您的列表不太长，每次击键时列表项也可能很复杂和变化。在那里你找不到优化渲染的明确方法。

从概念上讲，有两个更新必须发生的问题。第一个是紧急更新，您必须更改输入字段的值，可能还有一些围绕它的 UI。相比之下，第二个是显示搜索结果的不太紧急的更新。

紧急：显示输入的内容：

`setInputValue(input);`

不急：显示结果：

`setSearchQuery(input);`

现在，新的开始转换 API 通过允许将更新标记为

```js
    function App() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    
        function handleClick() {
            fetchSomething().then(() => {
            // React 17 and earlier does NOT batch these because
            // they run *after* the event in a callback, not *during* it
            setCount(c => c + 1); // Causes a re-render
            setFlag(f => !f); // Causes a re-render
            });
        }
        
        return (
        <div>
        <button onClick={handleClick}>Next</button>
        <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
        </div>
        );
    }
```

总结
--

React 17 无法满足开发者社区的需求。重点主要集中在使升级 React 本身变得更容易。React 18 版本将相反。它为开发人员提供了许多功能。 

但是，是的，请记住，最终版本可能会发生变化，因为它是测试版。发布后，大多数功能可能会围绕并发运行。这是个好消息，因为它将帮助开发人员提高应用程序的速度和效率。使用所有这些新工具，他们可以更好地微调其性能。

**祝你好运！**

翻译自 [DZone by Gerrard Cooper](https://link.juejin.cn?target=https%3A%2F%2Fdzone.com%2Farticles%2Freact-18-things-you-need-to-know-about-react-js-la "https://dzone.com/articles/react-18-things-you-need-to-know-about-react-js-la")