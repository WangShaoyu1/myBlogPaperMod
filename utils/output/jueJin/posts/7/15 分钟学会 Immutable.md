---
author: "政采云技术"
title: "15 分钟学会 Immutable"
date: 2021-06-23
description: "1 什么是 Immutable ？ Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。"
tags: ["前端","Immutable.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:256,comments:0,collects:252,views:15466,"
---
![](/images/jueJin/9d017cd8ccea49f.png)

> 这是第 104 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[15 分钟学会 Immutable](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Flearn-about-immutable "https://zoo.team/article/learn-about-immutable")

![玄曦.png](/images/jueJin/b218f62dabdd471.png)

1\. 什么是 Immutable ？
-------------------

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。主要原理是采用了 Persistent Data Structure（持久化数据结构)，就是当每次修改后我们都会得到一个新的版本，且旧版本可以完好保留，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），就是对于本次操作没有修改的部分，我们可以直接把相应的旧的节点拷贝过去，这其实就是结构共享。

2\. Immutable 有什么优点？
--------------------

#### 2.1 降低复杂度，避免副作用

在 Javascript 中，对象都是引用类型，在按引用传递数据的场景中，会存在多个变量指向同一个内存地址的情况，这样会引发不可控的副作用，如下代码所示：

```javascript
let obj1 = { name: '张三' };
let obj2 = obj1;
obj2.name = '李四';

console.log(obj1.name); // 李四
```

使用 Immutable 后：

```javascript
import { Map } from 'immutable';
let obj1 = Map({ name: '张三'});
let obj2 = obj1;
obj2.set({name:'李四'});
console.log(obj1.get('name'));  // 张三
```

当我们使用 Immutable 降低了 Javascript 对象 带来的复杂度的问题，使我们状态变成可预测的。

#### 2.2 节省内存

Immutable 采用了结构共享机制，所以会尽量复用内存。

```javascript
import { Map } from 'immutable';
    let obj1 = Map({
    name: 'zcy',
    filter: Map({age:6})
    });
    let obj2 = obj1.set('name','zcygov');
    console.log(obj1.get('filter') === obj2.get('filter')); // true
    // 上面 obj1 和 obj2 共享了没有变化的 filter 属性
```

#### 2.3 方便回溯

Immutable 每次修改都会创建一个新对象，且对象不变，那么变更的记录就能够被保存下来，应用的状态变得可控、可追溯，方便撤销和重做功能的实现，请看下面代码示例：

```javascript
import { Map } from 'immutable';
let historyIndex = 0;
let history = [Map({ name: 'zcy' })];
    function operation(fn) {
    history = history.slice(0, historyIndex + 1);
    let newVersion = fn(history[historyIndex]);
    // 将新版本追加到历史列表中
    history.push(newVersion);
    // 记录索引，historyIndex 决定我们是否有撤销和重做
    historyIndex++;
}
    function changeHeight(height) {
        operation(function(data) {
        return data.set('height', height);
        });
    }
    // 判断是否有重做
    let hasRedo = historyIndex !== history.length - 1;
    // 判断是否有撤销
    let hasUndo = historyIndex !== 0;
```

#### 2.4 函数式编程

Immutable 本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发。因为只要输入一致，输出必然一致，这样开发的组件更易于调试和组装。

#### 2.5 丰富的 API

Immutable 实现了一套完整的 Persistent Data Structure，提供了很多易用的数据类型。像`Collection`、`List`、`Map`、`Set`、`Record`、`Seq`，以及一系列操作它们的方法，包括 sort，filter，数据分组，reverse，flatten 以及创建子集等方法，具体 API 请参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fimmutable-js.github.io%2Fimmutable-js%2Fdocs%2F%23%2F%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://immutable-js.github.io/immutable-js/docs/#/?fileGuid=tCVw8Y6Cv8J3KYHw")

3\. 在 react 中如何使用 Immutable
---------------------------

我们都知道在 React 父组件更新会引起子组件重新 render，当我们传入组件的 props 和 state 只有一层时，我们可以直接使用 [React.PureComponent](https://link.juejin.cn?target=https%3A%2F%2Ffacebook.github.io%2Freact%2Fdocs%2Freact-api.html%23react.purecomponent%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://facebook.github.io/react/docs/react-api.html#react.purecomponent?fileGuid=tCVw8Y6Cv8J3KYHw")，它会自动帮我们进行浅比较，从而控制 shouldComponentUpdate 的返回值。

但是，当传入 props 或 state 不止一层，或者传入的是 Array 和 Object 类型时，浅比较就失效了。当然我们也可以在 `shouldComponentUpdate()` 中使用使用 `deepCopy` 和 `deepCompare` 来避免不必要的 `render()` ，但 `deepCopy` 和 `deepCompare` 一般都是非常耗性能的。这个时候我们就需要 `Immutable` 。

以下示例通过浅比较的方式来优化：

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
    class Counter extends Component {
state = { counter: { number: 0 } }
    handleClick = () => {
    let amount = this.amount.value ? Number(this.amount.value) : 0;
    this.state.counter.number = this.state.counter.number + amount;
    this.setState(this.state);
}
// 通过浅比较判断是否需要刷新组件
// 浅比较要求每次修改的时候都通过深度克隆每次都产生一个新对象
    shouldComponentUpdate(nextProps, nextState) {
        for (const key in nextState) {
            if (this.State[key] !== nextState[key]) {
            return true;
        }
    }
    return false;
}
}
    render() {
    console.log('render');
    return (
    <div>
    <p>{this.state.number}</p>
    <input ref={input => this.amount = input} />
    <button onClick={this.handleClick}>+</button>
    </div>
    )
}
}
ReactDOM.render(
<Caculator />,
document.getElementById('root')
)
```

也可以通过深度比较的方式判断两个状态的值是否相等这样做的话性能非常低。

```javascript
    shouldComponentUpdate(nextProps, prevState) {
    // 通过 lodash 中 isEqual 深度比较方法判断两个值是否相同
    return !_.isEqual(prevState, this.state);
}
```

Immutable 则提供了简洁高效的判断数据是否变化的方法，只需 `===` 和 `is` 比较就能知道是否需要执行 `render()` ，而这个操作几乎 0 成本，所以可以极大提高性能。修改后的 `shouldComponentUpdate` 是这样的：

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { is, Map } from 'immutable';
    class Caculator extends Component {
        state = {
        counter: Map({ number: 0 })
    }
        handleClick = () => {
        let amount = this.amount.value ? Number(this.amount.value) : 0;
        let counter = this.state.counter.update('number', val => val + amount);
        this.setState({counter});
    }
        shouldComponentUpdate(nextProps = {}, nextState = {}) {
            if (Object.keys(this.state).length !== Object.keys(nextState).length) {
            return true;
        }
        // 使用 immutable.is 来进行两个对象的比较
            for (const key in nextState) {
                if (!is(this.state[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
        render() {
        return (
        <div>
        <p>{this.state.counter.get('number')}</p>
        <input ref={input => this.amount = input} />
        <button onClick={this.handleClick}>+</button>
        </div>
        )
    }
}
ReactDOM.render(
<Caculator />,
document.getElementById('root')
)
```

`Immutable.is` 比较的是两个对象的 `hashCode` 或 `valueOf`（对于 JavaScript 对象）。由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 `hashCode` 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。 使用 Immutable 后，如下图，当红色节点的 state 变化后，不会再渲染树中的所有节点，而是只渲染图中绿色的部分：

![](/images/jueJin/f0bac2beb9724e7.png)

(图片引用自：[Immutable 详解及 React 中实践](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcamsong%2Fblog%2Fissues%2F3%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://github.com/camsong/blog/issues/3?fileGuid=tCVw8Y6Cv8J3KYHw"))

所以使用 `Immutable.is` 可以减少 React 重复渲染，提高性能。

4\. Immutable 结合 Redux 使用
-------------------------

下面是 Immutable 结合 Redux 使用的一个数值累加小示例：

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import immutable, { is, Map } from 'immutable';
import PureComponent from './PureComponent';
const ADD = 'ADD';
// 初始化数据时，使用 Map 保证数据不会被轻易修改
const initState = Map({ number: 0 });
    function counter(state = initState, action) {
        switch (action.type) {
        case ADD:
        // 返回数据时采用 update 更新对象数据
        return state.update('number', (value) => value + action.payload);
        default:
        return state
    }
}
const store = createStore(counter);
    class Caculator extends PureComponent {
        render() {
        return (
        <div>
        <p>{this.props.number}</p>
        <input ref={input => this.amount = input} />
        <button onClick={() => this.props.add(this.amount.value ? Number(this.amount.value) : 0)}>+</button>
        </div>
        )
    }
}
    let actions = {
        add(payload) {
    return { type: ADD, payload }
}
}
const ConnectedCaculator = connect(
state => ({ number: state.get('number') }),
actions
)(Caculator)
ReactDOM.render(
<Provider store={store}><ConnectedCaculator /></Provider>,
document.getElementById('root')
)
```

但由于 Redux 中内置的 `combineReducers` 和 reducer 中的 `initialState` 都为原生的 Object 对象，所以不能和 Immutable 原生搭配使用，当然我们可以通过重写 `combineReducers` 的方式达到兼容效果，如下代码所示：

```javascript
// 重写 redux 中的 combineReducers
    function combineReducers(reducers) {
    // initialState 初始化为一个 Immutable Map对象
        return function (state = Map(), action) {
        let newState = Map();
            for (let key in reducers) {
            newState = newState.set(key, reducers[key](state.get(key), action));
        }
        return newState;
    }
}
    let reducers = combineReducers({
    counter
    });
    const ConnectedCaculator = connect(
        state => {
        return ({ number: state.getIn(['counter', 'number']) })
        },
        actions
        )(Caculator)
```

也可以通过引入 [redux-immutable](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgajus%2Fredux-immutable%23readme%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://github.com/gajus/redux-immutable#readme?fileGuid=tCVw8Y6Cv8J3KYHw") 中间件的方式实现 redux 与 Immutable 的搭配使用，对于使用 Redux 的应用程序来说，你的整个 state tree 应该是 Immutable.JS 对象，根本不需要使用普通的 JavaScript 对象。

5.使用 Immutable 需要注意的点
---------------------

*   不要混合普通的 JS 对象和 Immutable 对象 （不要把 Imuutable 对象作为Js对象的属性，或者反过来）。
*   把整颗 Reudx 的 state 树作为 Immutable 对象。
*   除了展示组件以外，其他地方都应该使用 Immutable 对象（提高效率，而展示组件是纯组件，不应该使用） 。
*   少用 toJS 方法（这个方法操作非常耗性能，它会深度遍历数据转换成JS对象）。
*   你的 Selector 应该永远返回 Immutable 对象 （即 mapStateToProps，因为 react-redux 中是通过浅比较来决定是否 re-redering，而使用 toJs 的话，每次都会返回一个新对象，即引用不同）。

6.总结
----

实际情况中有很多方法可以优化我们的 React 应用，例如延迟加载组件，使用 serviceWorks 缓存应用状态，使用 SSR 等，但在考虑优化之前，最好先理解 React 组件的工作原理，了解 Diff 算法，明白这些概念之后才能更好的针对性的去优化我们的应用。

文章中如有不对的地方，欢迎指正。

### 参考链接：

[Immutable 详解及 React 中实践](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcamsong%2Fblog%2Fissues%2F3%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://github.com/camsong/blog/issues/3?fileGuid=tCVw8Y6Cv8J3KYHw")

[Immutable Data Structures and JavaScript](https://link.juejin.cn?target=https%3A%2F%2Farchive.jlongster.com%2FUsing-Immutable-Data-Structures-in-JavaScript%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://archive.jlongster.com/Using-Immutable-Data-Structures-in-JavaScript?fileGuid=tCVw8Y6Cv8J3KYHw")

[Immutable官方文档](https://link.juejin.cn?target=https%3A%2F%2Fimmutable-js.github.io%2Fimmutable-js%2Fdocs%2F%23%2F%3FfileGuid%3DtCVw8Y6Cv8J3KYHw "https://immutable-js.github.io/immutable-js/docs/#/?fileGuid=tCVw8Y6Cv8J3KYHw")

推荐阅读
----

[通过自定义Vue指令实现前端曝光埋点](https://juejin.cn/post/6945624014643855367 "https://juejin.cn/post/6945624014643855367")

[我在工作中是如何使用 git 的](https://juejin.cn/post/6974184935804534815 "https://juejin.cn/post/6974184935804534815")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/88372cdf69f7430.png)