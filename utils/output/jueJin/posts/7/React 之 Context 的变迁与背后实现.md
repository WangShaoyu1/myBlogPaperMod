---
author: "冴羽"
title: "React 之 Context 的变迁与背后实现"
date: 2022-11-04
description: "本篇我们讲 Context，Context 可以实现跨组件传递数据，大部分的时候并无需要，但有的时候，比如用户设置 了 UI 主题、地区偏好，如果从顶层一层层往下传反而有些麻烦，不如直接借助"
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:52,comments:16,collects:22,views:2963,"
---
本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

Context
-------

本篇我们讲 Context，Context 可以实现跨组件传递数据，大部分的时候并无需要，但有的时候，比如用户设置 了 UI 主题、地区偏好，如果从顶层一层层往下传反而有些麻烦，不如直接借助 Context 实现数据传递。

老的 Context API
--------------

### 基础示例

在讲最新的 API 前，我们先回顾下老的 Context API：

```jsx
    class Child extends React.Component {
        render() {
        // 4. 这里使用 this.context.value 获取
        return <p>{this.context.value}</p>
    }
}

// 3. 子组件添加 contextTypes 静态属性
    Child.contextTypes = {
    value: PropTypes.string
    };
    
        class Parent extends React.Component {
        
            state = {
            value: 'foo'
        }
        
        // 1. 当 state 或者 props 改变的时候，getChildContext 函数就会被调用
            getChildContext() {
        return {value: this.state.value}
    }
    
        render() {
        return (
        <div>
        <Child />
        </div>
        )
    }
}

// 2. 父组件添加 childContextTypes 静态属性
    Parent.childContextTypes = {
    value: PropTypes.string
    };
```

### context 中断问题

对于这个 API，React 官方并不建议使用，对于可能会出现的问题，React 文档给出的介绍为：

> 问题是，如果组件提供的一个 context 发生了变化，而中间父组件的 shouldComponentUpdate 返回 false，那么使用到该值的后代组件不会进行更新。使用了 context 的组件则完全失控，所以基本上没有办法能够可靠的更新 context。

对于这个问题，我们写个示例代码：

```jsx
// 1. Child 组件使用 PureComponent
    class Child extends React.Component {
        render() {
        return <GrandChild />
    }
}

    class GrandChild extends React.Component {
        render() {
        return <p>{this.context.theme}</p>
    }
}

    GrandChild.contextTypes = {
    theme: PropTypes.string
    };
    
        class Parent extends React.Component {
        
            state = {
            theme: 'red'
        }
        
            getChildContext() {
        return {theme: this.state.theme}
    }
    
        render() {
        return (
            <div onClick={() => {
                this.setState({
                theme: 'blue'
                })
                }}>
                <Child />
                <Child />
                </div>
                )
            }
        }
        
            Parent.childContextTypes = {
            theme: PropTypes.string
            };
```

在这个示例代码中，当点击文字 `red` 的时候，文字并不会修改为 `blue`，如果我们把 Child 改为 `extends Component`，则能正常修改

这说明当中间组件的 `shouldComponentUpdate` 为 `false` 时，会中断 Context 的传递。

PureComponent 的存在是为了减少不必要的渲染，但我们又想 Context 能正常传递，哪有办法可以解决吗？

既然 PureComponent 的存在导致了 Context 无法再更新，那就干脆不更新了，Context 不更新，GrandChild 就无法更新吗？

### 解决方案

方法当然是有的：

```jsx
// 1. 建立一个订阅发布器，当然你也可以称呼它为依赖注入系统（dependency injection system），简称 DI
    class Theme {
        constructor(value) {
        this.value = value
    this.subscriptions = []
}

    setValue(value) {
    this.value = value
    this.subscriptions.forEach(f => f())
}

    subscribe(f) {
    this.subscriptions.push(f)
}
}


    class Child extends React.PureComponent {
        render() {
        return <GrandChild />
    }
}


    class GrandChild extends React.Component {
        componentDidMount() {
        // 4. GrandChild 获取 store 后，进行订阅
        this.context.theme.subscribe(() => this.forceUpdate())
    }
    
    // 5. GrandChild 从 store 中获取所需要的值
        render() {
        return <p>{this.context.theme.value}</p>
    }
}

    GrandChild.contextTypes = {
    theme: PropTypes.object
    };
    
        class Parent extends React.Component {
            constructor(p, c) {
            super(p, c)
            // 2. 我们实例化一个 store（想想 redux 的 store），并存到实例属性中
            this.theme = new Theme('blue')
        }
        
        // 3. 通过 context 传递给 GrandChild 组件
            getChildContext() {
        return {theme: this.theme}
    }
    
        render() {
        // 6. 通过 store 进行发布
        return (
            <div onClick={() => {
            this.theme.setValue('red')
            }}>
            <Child />
            <Child />
            </div>
            )
        }
    }
    
        Parent.childContextTypes = {
        theme: PropTypes.object
        };
```

为了管理我们的 theme ，我们建立了一个依赖注入系统（DI），并通过 Context 向下传递 store，需要用到 store 数据的组件进行订阅，传入一个 forceUpdate 函数，当 store 进行发布的时候，依赖 theme 的各个组件执行 forceUpdate，由此实现了在 Context 不更新的情况下实现了各个依赖组件的更新。

你可能也发现了，这有了一点 react-redux 的味道。

当然我们也可以借助 Mobx 来实现并简化代码，具体的实现可以参考 Michel Weststrate（Mobx 的作者） 的 [How to safely use React context](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2F%40mweststrate%2Fhow-to-safely-use-react-context-b7e343eff076 "https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076")

新的 Context API
--------------

### 基础示例

想必大家都或多或少的用过，我们直接上示例代码：

```jsx
// 1. 创建 Provider 和 Consumer
const {Provider, Consumer} = React.createContext('dark');

    class Child extends React.Component {
    // 3. Consumer 组件接收一个函数作为子元素。这个函数接收当前的 context 值，并返回一个 React 节点。
        render() {
        return (
        <Consumer>
        {(theme) => (
        <button>
    {theme}
    </button>
)}
</Consumer>
)
}
}

    class Parent extends React.Component {
    
        state = {
        theme: 'dark',
        };
        
            componentDidMount() {
                setTimeout(() => {
                    this.setState({
                    theme: 'light'
                    })
                    }, 2000)
                }
                
                
                    render() {
                    // 2. 通过 Provider 的 value 传递值
                    return (
                    <Provider value={this.state.theme}>
                    <Child />
                    </Provider>
                    )
                }
            }
```

当 Provider 的 value 值发生变化时，它内部的所有 consumer 组件都会重新渲染。

> 新 API 的好处就在于从 Provider 到其内部 consumer 组件（包括 .contextType 和 useContext）的传播不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

### 模拟实现

那么 createContext 是怎么实现的呢？我们先不看源码，根据前面的订阅发布器的经验，我们自己其实就可以写出一个 createContext 来，我们写一个试试：

```jsx
    class Store {
        constructor() {
    this.subscriptions = []
}

    publish(value) {
    this.subscriptions.forEach(f => f(value))
}

    subscribe(f) {
    this.subscriptions.push(f)
}
}

    function createContext(defaultValue) {
    const store = new Store();
    
    // Provider
        class Provider extends React.PureComponent {
            componentDidUpdate() {
            store.publish(this.props.value);
        }
        
            componentDidMount() {
            store.publish(this.props.value);
        }
        
            render() {
            return this.props.children;
        }
    }
    
    // Consumer
        class Consumer extends React.PureComponent {
            constructor(props) {
            super(props);
                this.state = {
                value: defaultValue
                };
                
                    store.subscribe(value => {
                        this.setState({
                        value
                        });
                        });
                    }
                    
                        render() {
                        return this.props.children(this.state.value);
                    }
                }
                
                    return {
                    Provider,
                    Consumer
                    };
                }
```

用我们写的 createContext 替换 React.createContext 方法，你会发现，同样可以运行。

它其实跟解决老 Context API 问题的方法是一样的，只不过是做了一层封装。Consumer 组件构建的时候进行订阅，当 Provider 有更新的时候进行发布，这样就跳过了 PureComponent 的限制，实现 Consumer 组件的更新。

### createContext 源码

现在我们去看看真的 createContext 源码，[源码位置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fmain%2Fpackages%2Freact%2Fsrc%2FReactContext.js "https://github.com/facebook/react/blob/main/packages/react/src/ReactContext.js")在 `packages/react/src/ReactContext.js`，简化后的代码如下：

```javascript
import {REACT_PROVIDER_TYPE, REACT_CONTEXT_TYPE} from 'shared/ReactSymbols';

    export function createContext(defaultValue) {
        const context = {
        $$typeof: REACT_CONTEXT_TYPE,
        // As a workaround to support multiple concurrent renderers, we categorize
        // some renderers as primary and others as secondary. We only expect
        // there to be two concurrent renderers at most: React Native (primary) and
        // Fabric (secondary); React DOM (primary) and React ART (secondary).
        // Secondary renderers store their context values on separate fields.
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        // Used to track how many concurrent renderers this context currently
        // supports within in a single renderer. Such as parallel server rendering.
        _threadCount: 0,
        // These are circular
        Provider: null,
        Consumer: null,
        
        // Add these to use same hidden class in VM as ServerContext
        _defaultValue: null,
        _globalName: null,
        };
        
            context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context,
            };
            
            context.Consumer = context;
            
            
            return context;
        }
```

你会发现，如同之前的文章中涉及的源码一样，React 的 createContext 就只是返回了一个数据对象，但没有关系，以后的文章中会慢慢解析实现过程。

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。