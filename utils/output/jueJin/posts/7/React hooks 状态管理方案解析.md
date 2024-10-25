---
author: ""
title: "React hooks 状态管理方案解析"
date: 2022-02-18
description: "本文从实现「计数器」这个经典场景出发，逐步分析 Hooks时代下，React 状态管理方案的演进过程和背后的实现原理。"
tags: ["React.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:69,comments:4,collects:68,views:5195,"
---
> 本文作者：[EllieSummer](https://link.juejin.cn?target=http%3A%2F%2Fgithub.com%2FEllieSummer "http://github.com/EllieSummer")

React v16.8 之后，Function Component 成为主流，React 状态管理的方案也发生巨大的转变。Redux 一直作为主流的 React 状态管理方案，虽然提供了一套规范的状态管理流程，但却有着让人饱受诟病的问题：概念太多、上手成本高、重复的样板代码、需要结合中间件使用等。

一个真正易用的状态管理工具往往不需要过多复杂的概念。Hooks 诞生之后，代码优雅简洁变成一种趋势。开发者也倾向于用一种小而美、学习成本低的方案来实现状态管理。因此，除了 React local state hooks 之外，社区还孵化了很多状态管理库，如 unstated-next、hox、zustand、jotai 等。

关于状态管理，有个非常经典的场景：实现一个计数器，点击 + 号的时候将数字加一，点击 - 号的时候将数值减一。这几乎是所有状态管理库标配的入门案例。

本文将从实现「计数器」这个经典场景出发，逐步分析 Hooks 时代下，React 状态管理方案的演进过程和背后的实现原理。

React local state hooks
-----------------------

React 提供了一些管理状态的原生 hooks API，简洁易懂，非常好上手。用原生的 hooks 方法就可以很轻松地实现计数器功能，只要通过 `useState` 方法在根组件定义计数器的状态和改变状态的方法，并层层传递给子组件就可以了。

[源码](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Freact-hooks-state-with-usestate-bo1y3 "https://codesandbox.io/s/react-hooks-state-with-usestate-bo1y3")

```js
// timer.js
    const Timer = (props) => {
    const { increment, count, decrement } = props;
    return (
    <>
    <button onClick={decrement}>-</button>
    <span>{count}</span>
    <button onClick={increment}>+</button>
    </>
    );
    };
    
    // app.js
        const App = () => {
        const [count, setCount] = React.useState(0);
        const increment = () => setCount(count + 1);
        const decrement = () => setCount(count - 1);
        
        return <Timer count={count} increment={increment} decrement={decrement} />
    }
```

但是这种方法存在很严重的缺陷。

首先，计数器的业务逻辑和组件耦合严重，需要将逻辑进行抽象分离，保持逻辑与组件的纯粹性。

其次，多组件内共享状态是通过层层传递的方式实现的，带来冗余代码的同时，根组件的状态将会逐渐变成 “庞然大物”。

unstated-next
-------------

React 开发者在设计之初，也考虑到上面提到的两个问题，本身也提供了对应的解决方案。

React Hooks 就是打着「逻辑复用」的口号而诞生的，自定义 hook 可以解决以前在 Class Component 组件内无法灵活共享逻辑的问题。

因此，针对业务逻辑耦合的问题，可以提取一个自定义计数器 hook `useCount` 。

```js
    function useCount() {
    const [count, setCount] = React.useState(0);
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    return { count, increment, decrement };
}
```

为了避免组件间层层传递状态，可以使用 Context 解决方案。Context 提供了在组件之间共享状态的方法，而不必在树的每个层级显式传递一个 prop 。

因此，只需要将状态存储在 StoreContext 中，Provider 下的任意子组件都可以通过`useContext`获取到上下文中的状态。

```js
// timer.js
import StoreContext from './StoreContext';

    const Timer = () => {
    const store = React.useContext(StoreContext);
    // 组件内 render 部分先省略
}

// app.js
    const App = () => {
    const StoreContext = React.createContext();
    const store = useCount();
    
    return <StoreContext.Provider value={store}><Timer /></StoreContext.Provider>
}
```

这样代码看起来清爽了一些。

但是在使用的时候还是免不了要先定义很多 Context，并且在子组件中进行引用，略微有点繁琐。

因此，可以对代码进行进一步的封装，将 Context 定义和引用的步骤抽象成公共的方法 `createContainer`。

![](/images/jueJin/390ebf70a49b671.png)

```js
    function createContainer(useHook) {
    // 定义 context
    const StoreContext = React.createContext();
    
        function useContainer() {
        // 子组件引用 context
        const store = React.useContext(StoreContext);
        return store;
    }
    
        function Provider(props) {
        const store = useHook();
        
        return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    }
    
return { Provider, useContainer }
}
```

createContainer 封装后会返回两个对象 Provider 和 useContainer。 Provider 组件可以传递状态给子组件，子组件可以通过 useContainer 方法获取全局的状态。经过改造，组件内的代码就会变得非常精简。

```js
const Store = createContainer(useCount);

// timer.js
    const Timer = () => {
    const store = Store.useContainer();
    // 组件内 render 部分先省略
}

// app.js
    const App = () => {
    return <Store.Provider><Timer /></Store.Provider>
}
```

这样，一个基本的状态管理方案成型了！体积小，API 简单，可以说是 React 状态管理库的最小集。源码可以见[这里](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Freact-hooks-state-with-unstated-next-etx45 "https://codesandbox.io/s/react-hooks-state-with-unstated-next-etx45")。

这种方案也是状态管理库 [unstated-next](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjamiebuilds%2Funstated-next%2Fblob%2Fmaster%2FREADME-zh-cn.md "https://github.com/jamiebuilds/unstated-next/blob/master/README-zh-cn.md") 的实现原理。

hox
---

先不要高兴得太早。unstated-next 的方案虽好，但也有缺陷的，这也是 React context 广为人诟病的两个问题：

*   Context 需要嵌套 Provider 组件，一旦代码中使用多个 context，将会造成嵌套地狱，组件的可读性和纯粹性会直线降低，从而导致组件重用更加困难。
*   Context 可能会造成不必要的渲染。一旦 context 里的 value 发生改变，任何引用 context 的子组件都会被更新。

那有没有什么方法可以解决上面两个问题呢？答案是肯定的，目前已经有一些自定义状态管理库解决这两个问题了。

从 context 的解决方案里，其实可以得到一些启发。状态管理的流程可以简化成三个模型： Store（存储所有状态）、Hook （抽象公共逻辑，更改状态）、Component（使用状态的组件）。

如果要自定义状态管理库，在脑海中可以先构思下， 这三者之前的关系应该是怎么样的？

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13025055875/731a/c9f6/165e/1109e9e6858bdad5025bfb206584f0b7.png](/images/jueJin/1109e9e6858bdad.png)

*   订阅更新： 初始化执行 Hook 的时候，需要收集哪些 Component 使用了 Store
*   感知变更： Hook 中的行为能够改变 Store 的状态，也要能被 Store 所感知到
*   发布更新： Store 一旦变更，需要驱动所有订阅更新的 Component 更新

只要完成这三步，状态管理基本上就完成了。大致思路有了，下面就可以具体实现了。

### 状态初始化

首先需要初始化 Store 的状态，也就是 Hook 方法执行返回的结果。同时定义一个 API 方法，供子组件获取 Store 的状态。这样状态管理库的模型就搭出来了。

从业务代码使用方法上可以看出，API 简洁的同时，也避免了 Provider 组件嵌套。

```js
// 状态管理库的框架
    function createContainer(hook) {
    const store = hook();
    // 提供给子组件的 API 方法
        function useContainer() {
        const storeRef = useRef(store);
        return storeRef.current;
    }
    return useContainer;
}

// 业务代码使用：API简洁
const useContainer = createContainer(useCount);

    const Timer = () => {
    const store = useContainer();
    // 组件内 render 部分先省略
}
```

### 订阅更新

为了实现 Store 状态更新的时候，能够驱动组件更新。需要定义一个 listeners 集合，在组件初始化的时候往数组添加 listener 回调，订阅状态的更新。

```js
    function createContainer(hook){
    const store = hook();
    
    const listeners = new Set();    // 定义回调集合
    
        function useContainer() {
        const storeRef = useRef(store);
        
            useEffect(() => {
            listeners.add(listener);  // 初始化的时候添加回调，订阅更新
            
            return () =>  listeners.delete(listener) // 组件销毁的时候移除回调
            },[])
            return storeRef.current;
        }
        
        return useContainer;
    }
```

那么当状态更新后，如何驱动组件更新呢？ 这里可以利用 `useReducer` hook 定义一个自增函数，使用 forceUpdate 方法即可让组件重刷。

```js
const [, forceUpdate] = useReducer((c) => c + 1, 0);

    function listener(newStore) {
    forceUpdate();
    storeRef.current = newStore;
}
```

### 感知状态变更

状态变更驱动组件更新的部分已经完成。现在比较重要的问题是，如何感知到状态发生变更了呢？

状态变更是在 useCount Hook 函数内实现的，用的是 React 原生的 `setState` 方法，也只能在 React 组件内执行。因此，很容易想到，如果使用一个函数组件 Executor 引用这个 Hook，那么在这个组件内就可以初始化状态，并感知状态变更了。

考虑到状态管理库的通用性，可以通过 `react-reconciler` 构造一个 react 渲染器来挂载 Executor 组件，这样就可以分别支持 React、ReactNative 等不同框架。

```js
// 构造 react 渲染器
    function render(reactElement: ReactElement) {
    const container = reconciler.createContainer(null, 0, false, null);
    return reconciler.updateContainer(reactElement, container);
}

// react 组件，感知 hook 内状态的变更
    const Executor = (props) => {
    const store = props.hook();
    const mountRef = useRef(false);
    
    // 状态初始化
        if (!mountRef.current) {
        props.onMount(store);
        mountRef.current = true;
    }
    
    // store 一旦变更，就会执行 useEffect 回调
        useEffect(() => {
        props.onUpdate(store); // 一旦状态变更，通知依赖的组件更新
        });
        
        return null;
        };
            function createContainer(hook) {
            let store;
            const onUpdate = () => {};
            
            // 传递hook和更新的回调函数
            render(<Executor hook={hook} onMount={val => store = val}  onUpdate={onUpdate} />);
            
        function useContainer() {}
        return useContainer;
    }
```

### 精确更新

一旦感知到状态变更后，在 onUpdate 回调里可以通知之前订阅过更新的组件重新渲染，也就是遍历 listeners 集合，执行之前添加的更新回调。

```js
    const onUpdate = (store) => {
        for (const listener of listeners) {
        listener(store);
    }
}
```

但是，组件往往可能只依赖了 Store 里的某一个状态，所有组件都更新的操作太粗暴，会带来不必要的更新，需要进行精确的更新渲染。因此，可以在组件的更新回调里判断当前依赖的状态是否变化，从而决定是否触发更新。

```js
// useContainer API 扩展增加依赖属性
const store = useContainer('count'); // 组件仅依赖store.count值

// 更新回调里判断
    function listener(newStore) {
    const newValue = newStore[dep];
    const oldValue = storeRef.current[dep];
    
    // 仅仅在依赖发生变更，才会组件进行更新
        if (compare(newValue, oldValue)) {
        forceUpdate();
    }
    storeRef.current = newStore;
}
```

完成以上的步骤，一个简单又好用的状态管理库就实现啦！源码可以看[这里](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Freact-hooks-state-with-hox-bol6s "https://codesandbox.io/s/react-hooks-state-with-hox-bol6s")。 状态更新的流程如下图所示。

![](/images/jueJin/49cf9d34e35d422.png)

API 简洁，逻辑和 UI 分离，能跨组件传输状态，没有冗余的嵌套组件，并且能实现精确更新。

这也是状态管理库 [hox](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fumijs%2Fhox "https://github.com/umijs/hox") 背后的实现原理。

zustand
-------

关于如何感知状态变更这一节中，因为 useCount 函数中是通过操作 react 原生 hook 方法实现状态变更的，所以我们需要用 Executor 作为中间桥梁来感知状态变更。

但是，这其实是一种委屈求全的方案，不得已将方案复杂化了。试想下，如果变更状态的方法 setState 是由状态管理库自身提供的，那么一旦执行该方法，就可以感知状态变更，并触发后续的比较更新操作，整体流程会简单很多！

![](/images/jueJin/624cbe55bd61a74.png)

```js
// 将改变状态的 setState 方法传递给 hook
// hook内一旦执行该方法，即可感知状态变更，拿到最新的状态
    function useCount(setState) {
    const increment = () => setState((state) => ({ ...state, count: state.count + 1 }));
    const decrement = () => setState((state) => ({ ...state, count: state.count - 1 }));
    return { count: 0, increment, decrement };
}

``````js
    function createContainer(hook) {
    let store;
    
        const setState = (partial) => {
        const nexStore = partial(store);
        // hook中一旦执行 setState 的操作，且状态变更后，将触发 onUpdate 更新
            if(nexStore !== store){
            store = Object.assign({}, store, nexStore);
            onUpdate(store);
        }
        };
        // 将改变状态的方法 setState 传递给hook函数
        store = hook(setState);
    }
    
    const useContainer = createContainer(useCount);
```

这种方案更加高明，让状态管理库的实现更加简洁明了，库的体积也会小不少。源码可见[这里](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Freact-hooks-state-with-zustand-wybll "https://codesandbox.io/s/react-hooks-state-with-zustand-wybll")。

这种方案是 [zustand](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand "https://github.com/pmndrs/zustand") 背后的大致原理。虽然需要开发者先熟悉下对应的写法，但是 API 与 Hooks 类似，学习成本很低，上手容易。

总结
--

本文从实现一个计数器场景出发，阐述了多种状态管理的方案和具体实现。不同状态管理方案产生都有着各自的背景，也有着各自的优劣。

但是自定义状态管理库的设计思想都是差不多的。目前开源社区比较活跃的状态管理库大多是如此，不同点主要是在如何感知状态变更这块做些文章。

看完本文，想必你已经知道如何进行 React Hooks 下的状态管理了，那就赶紧行动吧！

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe (at) corp.netease.com！