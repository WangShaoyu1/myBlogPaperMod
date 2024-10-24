---
author: "yck"
title: "Hooks 的性能优化及可能会遇到的坑总结"
date: 2020-03-02
description: "class 组件中性能优化可以通过 shouldComponentUpdate 实现或者继承自 PureComponent，当然后者也是通过 shouldComponentUpdate 去做的，内部对 state 和 props 进行了 shallowEqual。 对于函数组件…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:81,comments:0,collects:79,views:10272,"
---
组件 PureRender
-------------

class 组件中性能优化可以通过 `shouldComponentUpdate` 实现或者继承自 `PureComponent`，当然后者也是通过 `shouldComponentUpdate` 去做的，内部对 `state` 和 `props` 进行了 shallowEqual。

对于函数组件来说并没有这个生命周期可以调用，因此想实现性能优化只能通过 `React.memo(<Component />)` 来做，这种做法和继承 `PureComponent` 的原理一致。

另外如果你的函数组件需要拿到它的 ref，可以使用以下工具函数：

```
    function memoForwardRef<N, P>(comp: RefForwardingComponent<N, P>) {
    return memo(forwardRef<N, P>(comp));
}
```

但是并不是以上做法以后性能就万事大吉了，你还得保证传递的 `props` 以及内部的状态的引用不发生预期之外的变化。

保持局部不变
------

对于函数组件来说，变量的引用是需要重点关注的问题，无论是函数亦或者对象。

```
    const Child = React.memo(({ columns }) => {
    return <Table columns={columns} />
    })
        const Parent = () => {
        const data = [];
        return <Child columns={data} />
    }
```

对于以上组件来说，每次 `Parent` 渲染的时候虽然 `columns` 内容没有变，但是 `columns` 的引用已经变了。当 `props` 传递给 `Child` 的时候，即使使用了 `React.memo` 但是性能优化也失效了。

对于这种情况，可以通过 `useMemo` 将引用存储起来，依赖不变引用也就不变。

```
const data = useMemo(() => [], [])
```

`useMemo` 的场景多是用于值的计算。比如密集型计算场景下你肯定不希望组件重新渲染的时候，依赖项没有变更缺重复执行计算函数得到相同的值。

对于函数来说，如果你想保存它的引用的话可以使用 `useCallback` 来做。

```
    function Counter() {
    const [count, setCount] = useState(0)
    
    
    // 这样写函数，每次重新渲染都会再次创建一个新的函数
        const onIncrement = () => {
        setCount(count => count + 1)
    }
    
        const onIncrement = useCallback(() => {
        setCount(count => count + 1)
        }, [])
        
        return (
        <div>
        <button onClick={onIncrement}>INCREMENT</button>
        <p>{count}</p>
        </div>
        )
    }
```

对于以上代码来说，组件每次渲染的时候使用了 `useCallback` 包裹的 `onIncrement` 函数引用不会改变，这也就意味着不需要频繁创建及销毁函数了。

但是在 `useCallback` 存在依赖的情况下函数引用并不一定按照你的想法正常保持不变，比如如下案例：

```
    function Counter() {
    const [count, setCount] = useState(0)
    
        const onIncrement = useCallback(() => {
        setCount(count => count + 1)
        }, [])
        
            const onLog = useCallback(() => {
            console.log(count)
            }, [count])
            
            return (
            <div>
            <button onClick={onIncrement}>INCREMENT</button>
            <button onClick={onLog}>Log</button>
            <p>{count}</p>
            </div>
            )
        }
```

当 `count` 每次改变造成组件重新渲染的时候，`onLog` 函数都会重新创建一次。两种常规方法可以保持在这种情况下函数引用不被改变。

1.  使用 `useEventCallback`
2.  使用 `useReducer`

```
    function useEventCallback(fn, dependencies) {
        const ref = useRef(() => {
        throw new Error('Cannot call an event handler while rendering.');
        });
        
            useEffect(() => {
            ref.current = fn;
            }, [fn, ...dependencies]);
            
                return useCallback(() => {
                const fn = ref.current;
                return fn();
                }, [ref]);
            }
```

`useEventCallback` 使用了 `ref` 不变的特性，保证回调函数的引用永远不变。另外在 Hooks 中，`dispatch` 也是不变的，所以把依赖 `ref` 改成 `dispatch`，然后在回调中调用 `dispatch` 就是另一种做法了。

性能优化并不是银弹
---------

凡事都有两面性，在引入以上这些性能优化的时候你已经降低了原本的性能，毕竟它们都是有使用代价的，我们可以来阅读下 `useCallback` 及 `useMemo` 的核心源码：

```
    function updateCallback(callback, deps) {
    const hook = updateWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    const prevState = hook.memoizedState;
        if (prevState !== null) {
            if (nextDeps !== null) {
            const prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
            }
        }
    }
    hook.memoizedState = [callback, nextDeps];
    return callback;
}

    function updateMemo(nextCreate, deps) {
    const hook = updateWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    const prevState = hook.memoizedState;
        if (prevState !== null) {
            if (nextDeps !== null) {
            const prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
            }
        }
    }
    const nextValue = nextCreate();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}
```

上述源码实现思路大致是从 fiber 中取出 `memoizedState`，然后对比前后 Deps，对比的实现也采用了 shallowEqual，最后如果有变化的话就重置 `memoizedState`。

可以看出来，本文中讲到的性能优化方案基本都是采用了 shallowEqual 来对比前后差异，所以没必要为了性能优化而优化。

Hooks 的坑
--------

Hooks 的坑 99% 都是闭包引起的，我们通过一个例子来了解下什么情况下会因为闭包导致问题。

```
    function App() {
    const [state, setState] = React.useState(0)
    // 连点三次你觉得答案会是什么？
        const handleClick = () => {
        setState(state + 1)
            setTimeout(() => {
            console.log(state)
            }, 2000)
        }
        
        return (
        <>
        <div>{state}</div>
        <button onClick={handleClick} />
        </>
        )
    }
```

上述代码触发三次 `handleClick` 后你觉得答案会是什么？可能答案与你所想的不大一样，结果是：

0 1 2

因为每次 render 都有一份新的状态，因此上述代码中的 `setTimeout` 使用产生了一个闭包，捕获了每次 render 后的 `state`，也就导致了输出了 0、1、2。

如果你希望输出的内容是最新的 `state` 的话，可以通过 `useRef` 来保存 `state`。前文讲过 `ref` 在组件中只存在一份，无论何时使用它的引用都不会产生变化，因此可以来解决闭包引发的问题。

```
    function App() {
    const [state, setState] = React.useState(0)
    // 用 ref 存一下
    const currentState = React.useRef(state)
    // 每次渲染后更新下值
        useEffect(() => {
        currentState.current = state
        })
        
            const handleClick = () => {
            setState(state + 1)
            // 这样定时器里通过 ref 拿到最新值
                setTimeout(() => {
                console.log(currentState.current)
                }, 2000)
            }
            
            return (
            <>
            <div>{state}</div>
            <button onClick={handleClick} />
            </>
            )
        }
```

其实闭包引发的问题多半是保存了 old 的值，只要想办法拿到最新的值其实基本上就解决问题了。

写在最后
----

如果你觉得我有遗漏什么或者写的不对的，欢迎指出。

我很想听听你的想法，谢谢阅读。

微信扫码关注公众号，订阅更多精彩内容

加笔者微信群聊技术

![](/images/jueJin/16f2e3314a431c2.png)

![](/images/jueJin/16f8d533200452e.png)