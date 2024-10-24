---
author: "冴羽"
title: "React 之 Refs 的使用和 forwardRef 的源码解读"
date: 2022-11-03
description: "React 提供了 Refs，帮助我们访问 DOM 节点或在 render 方法中创建的 React 元素。 React 提供了三种使用 Ref 的方式："
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:72,comments:0,collects:60,views:5014,"
---
本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

三种使用方式
------

React 提供了 Refs，帮助我们访问 DOM 节点或在 render 方法中创建的 React 元素。

React 提供了三种使用 Ref 的方式：

### 1\. String Refs

```javascript
    class App extends React.Component {
        constructor(props) {
        super(props)
    }
        componentDidMount() {
            setTimeout(() => {
            // 2. 通过 this.refs.xxx 获取 DOM 节点
            this.refs.textInput.value = 'new value'
            }, 2000)
        }
            render() {
            // 1. ref 直接传入一个字符串
            return (
            <div>
            <input ref="textInput" value='value' />
            </div>
            )
        }
    }
    
    root.render(<App />);
```

### 2\. 回调 Refs

```javascript
    class App extends React.Component {
        constructor(props) {
        super(props)
    }
        componentDidMount() {
            setTimeout(() => {
            // 2. 通过实例属性获取 DOM 节点
            this.textInput.value = 'new value'
            }, 2000)
        }
            render() {
            // 1. ref 传入一个回调函数
            // 该函数中接受 React 组件实例或 DOM 元素作为参数
            // 我们通常会将其存储到具体的实例属性（this.textInput）
            return (
            <div>
                <input ref={(element) => {
                this.textInput = element;
                }} value='value' />
                </div>
                )
            }
        }
        
        root.render(<App />);
```

### 3\. createRef

```javascript
    class App extends React.Component {
        constructor(props) {
        super(props)
        // 1. 使用 createRef 创建 Refs
        // 并将 Refs 分配给实例属性 textInputRef，以便在整个组件中引用
        this.textInputRef = React.createRef();
    }
        componentDidMount() {
            setTimeout(() => {
            // 3. 通过 Refs 的 current 属性进行引用
            this.textInputRef.current.value = 'new value'
            }, 2000)
        }
            render() {
            // 2. 通过 ref 属性附加到 React 元素
            return (
            <div>
            <input ref={this.textInputRef} value='value' />
            </div>
            )
        }
    }
```

这是最被推荐使用的方式。

两种使用目的
------

Refs 除了用于获取具体的 DOM 节点外，也可以获取 Class 组件的实例，当获取到实例后，可以调用其中的方法，从而强制执行，比如动画之类的效果。

我们举一个获取组件实例的例子：

```javascript
    class Input extends React.Component {
        constructor(props) {
        super(props)
        this.textInputRef = React.createRef();
    }
        handleFocus() {
        this.textInputRef.current.focus();
    }
        render() {
        return <input ref={this.textInputRef} value='value' />
    }
}

    class App extends React.Component {
        constructor(props) {
        super(props)
        this.inputRef = React.createRef();
    }
        componentDidMount() {
            setTimeout(() => {
            this.inputRef.current.handleFocus()
            }, 2000)
        }
            render() {
            return (
            <div>
            <Input ref={this.inputRef} value='value' />
            </div>
            )
        }
    }
```

在这个例子中，我们通过 `this.inputRef.current` 获取到 Input 组件的实例，并调用了实例的 handleFocus 方法，在这个方法中，又通过 Refs 获取到具体的 DOM 元素，执行了 focus 原生方法。

forwardRef
----------

注意在这个例子中，我们的 Input 组件使用的是类组件，Input 组件可以改为使用函数组件吗？

答案是不可以，我们不能在函数组件上使用 ref 属性，因为函数组件没有实例。

如果我们强行使用，React 会报错并提示我们用 forwardRef：

```javascript
    function Input() {
    return <input value='value' />
}

    class App extends React.Component {
        constructor(props) {
        super(props)
        this.inputRef = React.createRef();
    }
        render() {
        return (
        <div>
        <Input ref={this.inputRef} value='value' />
        </div>
        )
    }
}
```

![image.png](/images/jueJin/bbd87f597dd04a8.png)

但是呢，对于“获取组件实例，调用实例方法”这个需求，即使使用 forwardRef 也做不到，借助 forwardRef 后，我们也就是跟类组件一样，可以在组件上使用 ref 属性，然后将 ref 绑定到具体的 DOM 元素或者 class 组件上，也就是我们常说的 Refs 转发。

Refs 转发
-------

有的时候，我们开发一个组件，这个组件需要对组件使用者提供一个 ref 属性，用于让组件使用者获取具体的 DOM 元素，我们就需要进行 Refs 转发，我们通常的做法是：

```javascript
// 类组件
    class Child extends React.Component {
        render() {
        const {inputRef, ...rest} = this.props;
        // 3. 这里将 props 中的 inputRef 赋给 DOM 元素的 ref
        return <input ref={inputRef} {...rest} placeholder="value" />
    }
}
// 函数组件
    function Child(props) {
    const {inputRef, ...rest} = props;
    // 3. 这里将 props 中的 inputRef 赋给 DOM 元素的 ref
    return <input ref={inputRef} {...rest} placeholder="value" />
}

    class Parent extends React.Component {
        constructor(props) {
        super(props)
        // 1. 创建 refs
        this.inputRef = React.createRef();
    }
        componentDidMount() {
            setTimeout(() => {
            // 4. 使用 this.inputRef.current 获取子组件中渲染的 DOM 节点
            this.inputRef.current.value = 'new value'
            }, 2000)
        }
            render() {
            // 2. 因为 ref 属性不能通过 this.props 获取，所以这里换了一个属性名
            return <Child inputRef={this.inputRef} />
        }
    }
```

React 提供了 forwardRef 这个 API，我们直接看使用示例：

```javascript
// 3. 子组件通过 forwardRef 获取 ref，并通过 ref 属性绑定 React 元素
const Child = forwardRef((props, ref) => (
<input ref={ref} placeholder="value" />
));

    class Parent extends React.Component {
        constructor(props) {
        super(props)
        // 1. 创建 refs
        this.inputRef = React.createRef();
    }
        componentDidMount() {
            setTimeout(() => {
            // 4. 使用 this.inputRef.current 获取子组件中渲染的 DOM 节点
            this.inputRef.current.value = 'new value'
            }, 2000)
        }
            render() {
            // 2. 传给子组件的 ref 属性
            return <Child ref={this.inputRef} />
        }
    }
```

尤其是在我们编写高阶组件的时候，往往要实现 refs 转发。我们知道，一个高阶组件，会接受一个组件，返回一个包裹后的新组件，从而实现某种功能的增强。

但也正是如此，我们添加 ref，获取的会是包裹后的新组件的实例，而非被包裹的组件实例，这就可能会导致一些问题。

createRef 源码
------------

现在我们看下 `createRef` 的源码，[源码的位置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fmain%2Fpackages%2Freact%2Fsrc%2FReactCreateRef.js "https://github.com/facebook/react/blob/main/packages/react/src/ReactCreateRef.js")在 `/packages/react/src/ReactCreateRef.js`，代码其实很简单，就只是返回了一个具有 current 属性的对象：

```javascript
// 简化后
    export function createRef() {
        const refObject = {
        current: null,
        };
        return refObject;
    }
```

在渲染的过程中，`refObject.current` 会被赋予具体的值。

forwardRef 源码
-------------

那 forwardRef 源码呢？[源码的位置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fmain%2Fpackages%2Freact%2Fsrc%2FReactForwardRef.js "https://github.com/facebook/react/blob/main/packages/react/src/ReactForwardRef.js")在 `/packages/react/src/ReactForwardRef.js`，代码也很简单：

```javascript
// 简化后
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');

    export function forwardRef(render) {
        const elementType = {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render,
        };
        
        return elementType;
    }
```

但是要注意这里的 `$$typeof`，尽管这里是 `REACT_FORWARD_REF_TYPE`，但最终创建的 React 元素的 `$$typeof` 依然为 `REACT_ELEMENT_TYPE`。

关于 `createElement` 的源码分析参考 [《React 之 createElement 源码解读》](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")，我们这里简单分析一下，以 `InputComponent` 为例：

```javascript
// 使用 forwardRef
const InputComponent = forwardRef(({value}, ref) => (
<input ref={ref} className="FancyButton" value={value} />
));

// 根据 forwardRef 的源码，最终返回的对象格式为：
    const InputComponent = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
}

// 使用组件
const result = <InputComponent />

// Bable 将其转译为：
const result = React.createElement(InputComponent, null);

// 最终返回的对象为：
    const result = {
    $$typeof: REACT_ELEMENT_TYPE,
        type: {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render,
    }
}
```

我们尝试着打印一下最终返回的对象，确实也是这样的结构：

![image.png](/images/jueJin/810744b5369b4dd.png)

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。