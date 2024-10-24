---
author: ""
title: "“混合双打”之如何在 Class Components 中使用 React Hooks"
date: 2020-11-25
description: "React 在 v1680 版本中推出了 Hook，作为纯函数组件的增强，给函数组件带来了状态、上下文等等；之前一篇关于 React Hooks 的文章介绍了如何使用一些官方钩子和如何自建钩子，如果想要了解这些内容的同学可以点击这里。 本文不会再介绍上文中已提到的部分钩子的…"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:32,comments:0,collects:13,views:1527,"
---
![](/images/jueJin/a11a341907ba400.png)

> 这是第 78 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[“混合双打”之如何在 Class Components 中使用 React Hooks](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Freact-hooks-in-class-component "https://zoo.team/article/react-hooks-in-class-component")

![](/images/jueJin/bad0d32faefa4f9.png)

前情提要
----

React 在 v16.8.0 版本中推出了 Hook，作为纯函数组件的增强，给函数组件带来了状态、上下文等等；之前一篇关于 React Hooks 的文章介绍了如何使用一些官方钩子和如何自建钩子，如果想要了解这些内容的同学可以点击[这里](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Farticle%2Freact-hooks "https://www.zoo.team/article/react-hooks")。

本文不会再介绍上文中已提到的部分钩子的基础使用，而是主要着眼解决一些实际开发中的场景。

现状
--

Class Component 内部复杂的生命周期函数使得我们组件内部的 `componentDidMount` 越来越复杂和臃肿，独立组件动辄上千行代码；组件嵌套层级越来越深，组件之间的状态复用也变得非常困难。

Hook 无疑是可选的，他不会对现有项目造成任何冲击和破坏，社区对于它的优势也有过很多讨论；不过目前官方也没有计划移除 Class，而是推荐渐进式的去使用 Hook，在一些新增的组件中优先选用 Hook。那么我们想要在原有以 Class Component 为主的项目中开始使用 Hook，与原有的 Class Component 必然会产生交互，是不是需要将这些 Class Component 重写为 Hook 呢？

将部分复杂的 Class Component 逐步重写为 Hook 应该排在项目迭代的中长期计划中，如果想要在一个迭代中进行大量改造，带来的巨大成本和副作用也是无法估量的。

那么短期内我们就绕不开 Hook 与 Class 组件的混合使用。

解决方案
----

先简单介绍一下两种组件的基本写法：

Class Components：类组件的写法

```javascript
    export default class ShowHook extends Component {
    return (
    <h1>Hello Hook!</h1>
    );
}
```

Function Components：Hook 组件的写法

```javascript
    function ShowHook (props){
    return (
    <h1>Hello Hook!</h1>
    );
}
```

混合使用就难以避免的需要进行通信和参数传递，下面我用一个简单的处理模块显示隐藏的功能组件 `ShowHook` 作为一个例子，介绍三种是比较常见混合使用的方式，先来看一下效果：

![](/images/jueJin/b289d83f609a449.png)

### 1.Render props

Render props 中来自父组件的 props children 是一个 `Function`，我们可以将子组件的内部变量通过函数传递至父组件，达到通信的目的。

```javascript
// 子组件 SayHello.js
import React, { useState } from 'react';
    function sayHello({ children }) {
    const [visible, changeVisible] = useState(false);
    const jsx = visible && (
    <h1 onClick={() => changeVisible(false)}> Hello Hook! </h1>
    );
    return children({ changeVisible, jsx });
}
export default sayHello;
```

父组件获取到 `changeVisible` 方法之后就能方便的控制 `visible` 的状态。

```javascript
// 父组件 ShowHook.js
import React, { Component, Fragment } from 'react';
import SayHello from '../components/SayHello';
    export default class ShowHook extends Component {
        render() {
        return (
        <SayHello>
            {({ changeVisible, jsx }) => {
            return (
            <>
            <button onClick={() => changeVisible(true)}>
            showChild
            </button>
        {jsx}
        </>
        );
    }}
    </SayHello>
    );
}
}
```

`props.children` 常用的类型是字符串、对象甚至数组；但其实我们也可以传入一个函数，只要最终能返回出DOM 树即可；Render props 是将 Render 部分抽离出来作为函数传入子组件；它主要的作用是将 state 部分抽成组件，实现 state 的复用。

```javascript
// 封装子组件
    function Mouse (props) {
    const [position, setPosition] = useState({x: 0,y: 0});
        const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY })
    }
    return (
    <div onMouseMove={handleMouseMove}>
{this.props.children(position)}
</div>
)
}
// 使用场景 1：图片位置跟随鼠标
    class Cat1 extends React.Component {
        render() {
        return (
        <Mouse>
        {(position) =>
        <img src="/cat.jpg"
    style={{ position: 'absolute', left: position.x, top: position.y }}
    />
}
</Mouse>
)
}
}
// 使用场景 2：页面展示鼠标坐标
    class Cat2 extends React.Component {
        render() {
        return (
        <Mouse>
        {(position) =>
        <h1>x: {position.x} y: {position.y}</h1>
    }
    </Mouse>
    )
}
}
```

上面使用了 React 官方文档中的例子进行改写，具体效果如下： 场景 1：

![](/images/jueJin/f6798428a09a47c.png)

场景 2：

![](/images/jueJin/cafeca7b9c6b4af.png)

### 2.使用 HOC

HOC (Higher-Order Components) 是另一种提高代码复用率的常见技巧，它接收一个组件作为参数，最终返回出一个新的组件。

下面的方法使得 `button` 控制任意组件显示隐藏的功能被封装为高阶组件，得以复用，并且 `setVisible` 方法也能被传递到 `Class Component` 中。

```javascript
// 高阶组件 SayHello.js
import React, { useState, Fragment } from 'react';
    const sayHello = (Component) => {
        return (props) => {
        const [visible, setVisible] = useState(false);
        return (
        <Fragment>
        <button onClick={() => setVisible(true)}>
        showChild
        </button>
    {visible && <Component changeVisible={setVisible} visible={visible} />}
    </Fragment>
    );
    };
    };
    export default sayHello;
```

在外部 Class Component 中我们可以定制受内部显示/隐藏控制的组件，并且使用高阶组件中向外传递的 props 。

```javascript
// ShowHook.js
import React, { Component } from 'react';
import SayHello from '../components/SayHello';
    class ShowHook extends Component {
        render() {
        const { changeVisible } = this.props;
        return (
        <h1 onClick={() => changeVisible(false)}> Hello Hook! </h1>
        );
    }
}
export default SayHello(ShowHook);
```

HOC 在实际使用中是将一些副作用函数、公用方法作为组件抽取出来，从而提升复用率；我们可以把父组件的 `render` 部分改为一个弹窗，或任意内容使得子组件得到复用，例如：

```javascript
// 复用高阶组件 SayHello
import React, { Component } from 'react';
import SayHello from '../components/SayHello';
import { Modal } from 'antd';
    class ShowModal extends Component {
        render() {
        const { changeVisible, visible } = this.props;
        return (
        <Modal
        title="Basic Modal"
    visible={visible}
onOk={() => changeVisible(false)}
onCancel={() => changeVisible(false)}
>
<p>Some contents...</p>
<p>Some contents...</p>
<p>Some contents...</p>
</Modal>
);
}
}
export default SayHello(ShowHook);
```

这样就可以轻松的控制弹窗的显示隐藏；实际效果如下：

![](/images/jueJin/76c919c0bc3146a.png)

### 3.useImperativeHandle & Refs 转发 (React.forwardRef)

Ref 转发是一项将 [Ref](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Frefs-and-the-dom.html "https://zh-hans.reactjs.org/docs/refs-and-the-dom.html") 自动地通过组件传递到其一子组件的技巧。对于大多数应用中的组件来说，这通常不是必需的，但其对某些组件，尤其是可重用的组件库是很有用的。

它可以将子组件的方法暴露给父组件使用。

```javascript
// 父组件 ShowHook.js
import React, { Component } from 'react';
import SayHello from './SayHello';
    export default class ShowHook extends Component {
        showChild = () => {
        console.log(this.child);
        //可以看到 changeVisible 方法被挂载到了 this.child 下
    // {changeVisible: f()}
    this.child.changeVisible(true);
}
// 将子组件暴露出来的对象挂载到 child
    onRef = (ref) => {
    this.child = ref;
}
    render()  {
    return (
    <React.Fragment>
    <button onClick={this.showChild}>showChild</butotn>
    <SayHello
ref={this.onRef}
/>
</React.Fragment>
);
}
}
// 子组件 SayHello.js
import React, { useState, useImperativeHandle, forwardRef } from 'react';
    function SayHello(props, ref) {
    const [visible, changeVisible] = useState(false);
    // 暴露的子组件方法，给父组件调用
        useImperativeHandle(ref, () => {
            return {
            changeVisible,
            };
            });
            return visible && (
            <h1 onClick={() => changeVisible(false)}> Hello Hook! </h1>
            );
        }
        export default forwardRef(SayHello);
```

上面例子中封装了一个子组件，任意一个使用了该子组件的地方都可以控制它的状态。

结束语
---

目前 Hooks 尚不具备完整的 Class Component 的功能，一些不常用的生命周期函数尚不支持，例如：`getSnapshotBeforeUpdate`, `getDerivedStateFromError` 以及 `componentDidCatch`，但官方已将他们 排入计划内，相信不久之后就会得到支持；未来 Hooks 可能将成为 React Components 的首选，在现阶段就让我们愉快的混合使用吧。

参考文章
----

[How to Use React Hooks in Class Components](https://link.juejin.cn?target=https%3A%2F%2Finfinum.com%2Fthe-capsized-eight%2Fhow-to-use-react-hooks-in-class-components "https://infinum.com/the-capsized-eight/how-to-use-react-hooks-in-class-components")

[React拾遗：Render Props及其使用场景](https://juejin.cn/post/6844903624691154952 "https://juejin.cn/post/6844903624691154952")

[Hooks FAQ](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fhooks-faq.html "https://reactjs.org/docs/hooks-faq.html")

推荐阅读
----

[如何从 0 到 1 搭建性能检测系统](https://juejin.cn/post/6887580440803311630 "https://juejin.cn/post/6887580440803311630")

[结合阿里云 FC 谈谈我对 FaaS 的理解](https://juejin.cn/post/6892728697082609672 "https://juejin.cn/post/6892728697082609672")

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/9731edcd18814d5.png)