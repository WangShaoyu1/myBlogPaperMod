---
author: "无名之苝"
title: "可靠React组件设计的7个准则之封装"
date: 2019-08-09
description: "原文的篇幅非常长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 封装。因本人水平有限，文中部分翻译可能不够准确，如果您有更好的想法，欢迎在评论区指出。 耦合是决定组件…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:201,comments:0,collects:200,views:10124,"
---
> 翻译：刘小夕
> 
> 原文链接：[dmitripavlutin.com/7-architect…](https://link.juejin.cn?target=https%3A%2F%2Fdmitripavlutin.com%2F7-architectural-attributes-of-a-reliable-react-component%2F "https://dmitripavlutin.com/7-architectural-attributes-of-a-reliable-react-component/")

原文的篇幅**非常**长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 **`封装`**。因本人水平有限，文中部分翻译可能不够准确，如果您有更好的想法，欢迎在评论区指出。

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

———————————————我是一条分割线————————————————

### 封装

> 一个封装组件提供 `props` 控制其行为而不是暴露其内部结构。

耦合是决定组件之间依赖程度的系统特性。根据组件的依赖程度，可区分两种耦合类型：

*   当应用程序组件对其他组件知之甚少或一无所知时，就会发生松耦合。
    
*   当应用程序组件知道彼此的许多详细信息时，就会发生紧耦合。
    

松耦合是我们设计应用结构和组件之间关系的目标。

> 松耦合应用(封装组件)

![](/images/jueJin/16c71a6bb92d161.png)

**松耦合**会带来以下好处：

*   可以在不影响应用其它部分的情况下对某一块进行修改。、
*   任何组件都可以替换为另一种实现
*   在整个应用程序中实现组件复用，从而避免重复代码
*   独立组件更容易测试，增加了测试覆盖率

相反，紧耦合的系统会失去上面描述的好处。主要缺点是很难修改高度依赖于其他组件的组件。即使是一处修改，也可能导致一系列的依赖组件需要修改。

> 紧耦合应用(组件无封装)

![](/images/jueJin/16c71c937e878e2.png)

**封装** 或 **信息隐藏** 是如何设计组件的基本原则，也是松耦合的关键。

#### 信息隐藏

封装良好的组件隐藏其内部结构，并提供一组属性来控制其行为。

隐藏内部结构是必要的。其他组件没必要知道或也不依赖组件的内部结构或实现细节。

`React` 组件可能是函数组件或类组件、定义实例方法、设置 `ref`、拥有 `state` 或使用生命周期方法。这些实现细节被封装在组件内部，其他组件不应该知道这些细节。

隐藏内部结构的组件彼此之间的依赖性较小，而降低依赖度会带来松耦合的好处。

#### 通信

细节隐藏是隔离组件的关键。此时，你需要一种组件通信的方法：`props`。`porps` 是组件的输入。

建议 `prop` 的类型为基本数据（例如，`string` 、 `number` 、`boolean`）：

```
<Message text="Hello world!" modal={false} />;
```

必要时，使用复杂的数据结构，如对象或数组：

```
<MoviesList items={['Batman Begins', 'Blade Runner']} />
```

`prop` 可以是一个事件处理函数和异步函数：

```
<input type="text" onChange={handleChange} />
```

`prop` 甚至可以是一个组件构造函数。组件可以处理其他组件的实例化：

```
    function If({ component: Component, condition }) {
    return condition ? <Component /> : null;
}
<If condition={false} component={LazyComponent} />
```

为了避免破坏封装，请注意通过 `props` 传递的内容。给子组件设置 `props` 的父组件不应该暴露其内部结构的任何细节。例如，使用 `props` 传输整个组件实例或 `refs` 都是一个不好的做法。

访问全局变量同样也会对封装产生负面影响。

#### 案例研究：封装修复

组件的实例和状态对象是封装在组件内部的实现细节。因此，将状态管理的父组件实例传递给子组件会破坏封装。

我们来研究一下这种情况。

一个简单的应用程序显示一个数字和两个按钮。第一个按钮增加数值，第二个按钮减少数值：

![](/images/jueJin/16c7ea224ea14f3.png)

```
    class App extends React.Component {
        constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    
        render() {
        return (
        <div className="app">
        <span className="number">{this.state.number}</span>
        <Controls parent={this} />
        </div>
        );
    }
}

    class Controls extends React.Component {
        render() {
        return (
        <div className="controls">
        <button onClick={() => this.updateNumber(+1)}>
        Increase
        </button>
        <button onClick={() => this.updateNumber(-1)}>
        Decrease
        </button>
        </div>
        );
    }
    
        updateNumber(toAdd) {
            this.props.parent.setState(prevState => ({
            number: prevState.number + toAdd
            }));
        }
    }
    
    ReactDOM.render(<App />, document.getElementById('root'));
    
```

`<Controls>` 负责渲染按钮，并为其设置事件处理函数，当用户点击按钮时，父组件的状态将会被更新：`number` 加1或者减1(`(`updateNumber()方法\`)

```
// 问题: 使用父组件的内部结构
    class Controls extends Component {
        render() {
        return (
        <div className="controls">
        <button onClick={() => this.updateNumber(+1)}>
        Increase
        </button>
        <button onClick={() => this.updateNumber(-1)}>
        Decrease
        </button>
        </div>
        );
    }
    
        updateNumber(toAdd) {
            this.props.parent.setState(prevState => ({
            number: prevState.number + toAdd
            }));
        }
    }
```

当前的实现有什么问题？

*   第一个问题是： `<App>` 的封装被破坏，因为它的内部结构在应用中传递。`<App>` 错误地允许 `<Controls>` 直接去修改其 `state`。
    
*   第二个问题是: 子组件 `Controls` 知道了太多父组件 `<App>` 的内部细节，它可以访问父组件的实例，知道父组件是一个有状态组件，知道父组件的 `state` 对象的细节(知道 `number` 是父组件 `state` 的属性)，并且知道怎么去更新父组件的 `state`.
    

这样就会导致： `<Controls>` 将很难测试和重用。对 `<App>` 结构的细微修改会导致需要对 `<Controls>` 进行修改（对于更大的应用程序，也会导致类似耦合的组件需要修改）。

**解决方案**是设计一个方便的通信接口，考虑到松耦合和封装。让我们改进两个组件的结构和属性，以便恢复封装。

只有组件本身应该知道它的状态结构。`<App>` 的状态管理应该从 `<Controls>`（`updateNumber()`方法）移到正确的位置：即 `<App>` 组件中。

`<App>` 被修改为 `<Controls>` 设置属性 `onIncrease` 和 `onDecrease`。这些是更新 `<App>` 状态的回调函数:

```
// 解决: 恢复封装
    class App extends Component {
        constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    
        render() {
        return (
        <div className="app">
        <span className="number">{this.state.number}</span>
        <Controls
    onIncrease={() => this.updateNumber(+1)}
onDecrease={() => this.updateNumber(-1)}
/>
</div>
);
}

    updateNumber(toAdd) {
        this.setState(prevState => ({
        number: prevState.number + toAdd
        }));
    }
}

```

现在，`<Controls>` 接收用于增加和减少数值的回调，注意解耦和封装恢复时：`<Controls>` 不再需要访问父组件实例。也不会直接去修改父组件的状态。

而且，`<Controls>` 被修改为了一个函数式组件:

```
// 解决方案: 使用回调函数去更新父组件的状态
    function Controls({ onIncrease, onDecrease }) {
    return (
    <div className="controls">
    <button onClick={onIncrease}>Increase</button>
    <button onClick={onDecrease}>Decrease</button>
    </div>
    );
}
```

`<App>` 组件的封装已经恢复，状态由其本身管理，也应该如此。

此外，`<Controls>` 不在依赖 `<App>` 的实现细节，`onIncrease` 和 `onDecrease` 在按钮被点击的时候调用，`<Controls>` 不知道(也不应该知道)这些回调的内部实现。

`<Controls>` 组件的可重用性和可测试性显著增加。

`<Controls>` 的复用变得很容易，因为它除了需要回调，没有其它依赖。测试也变得简单，只需验证单击按钮时，回调是否执行。

**最后谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)