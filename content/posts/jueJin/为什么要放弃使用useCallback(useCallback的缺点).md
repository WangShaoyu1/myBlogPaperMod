---
author: "mysteryven"
title: "为什么要放弃使用useCallback(useCallback的缺点)"
date: 2021-10-17
description: "下面是useCallback的基本用法：在上面这段代码中，memoizedCallback会在初始的时候生成一次，在后面的过程中，只有它的依赖a或b变化了才会重新生成。明白了use"
tags: ["前端","React.js"]
ShowReadingTime: "阅读6分钟"
weight: 879
---
下面是 `useCallback` 的基本用法：

js

 代码解读

复制代码

`const memoizedCallback = useCallback(   () => {     doSomething(a, b);   },   [a, b], );`

在上面这段代码中，`memoizedCallback` 会在初始的时候生成一次，在后面的过程中，只有它的依赖 `a` 或 `b` 变化了才会重新生成。

明白了 `useCallback` 的基本用法，我们把使用 `useCallback` 包裹的函数和不使用它包裹的函数放到一块对比一下：

js

 代码解读

复制代码

`function App() {   const method1 = () => {      // ...   }   const  method2 = useCallback(() => {       // 这是一个和 method1 功能一样的方法   }, [props.a, props.b])   return (     <div>       <div onClick={method1}>button</div>       <div onClick={method2}>button</div>     </div>   ) }`

请问一下，在上面的对比之中，是 `method1` 的性能好，还是 `method2` 的性能好呢？

我听到你说话了，当然是 `method2` 呀！

我们的 `App` 函数在每一次更新的时候都会重新执行，由于这个原因，它内部的函数也都会重新生成一次，也就是说，我们的 `method1` 每次都会重新执行生成一遍。

而 `method2` 就不一样了，它是被 useCallback 包裹的返回值，除非依赖变化了，不然它不会重新生成，于是，你可能就会认为 `method2` 那种写法性能更高。

但是事实上呢，我们这么想是有些不正确的。

首先，每次执行函数，都重新生成一下它内部的变量这件事，开销是可以忽略不计的，这一点，官网的 [Hooks FAQ](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-faq.html%23are-hooks-slow-because-of-creating-functions-in-render "https://zh-hans.reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render") 给出了我们相关的结论：

![未命名.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8283b52b6e45bdbae580ddde224d83~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

就算「每次执行组件都重新生成变量」这件事不值得忽略，使用 `useCallback` 也一样每次都会生成新的函数，只不过它生成的地方很隐蔽，只不过它生成了没有使用罢了。现在我们来仔细分析一下这件事。

js

 代码解读

复制代码

`const method1 = () => { } const method2 = useCallback(() => {         /* 一个和 method1 一样的方法 */     },      [props.a, props.b] )`

假设现在处于更新阶段，执行到 `method1`，我们只需要申请并存储好 `method1` 这个变量对应的函数所需要的内存就好了。

但是执行到 `method2` 呢，

1.  首先，我们要额外执行 `useCallback` 函数，
2.  同时，我们也要申请 `useCallbck` 第一个参数对应的函数所需要的内存，这一点的花费就和 `method1` 的开销一样了，就算我们会使用缓存，`useCallback` 第一个参数的内存的开销也是要的。
3.  除此之外，为了能判断 `useCallback` 要不要更新结果，我们还要在内存保存上一次的依赖。
4.  并且，如果我们的 `useCallback` 返回的函数依赖了组件其他的值，由于 JS 中闭包的特性，他们也会一直存在而不被销毁。

js

 代码解读

复制代码

`const list = [...] const method = useCallback(() => {          console.log(list) // list 的引用会一直存在     },  )`

这样看下来，使用 `useCallback`，比起原来没有半点好处。

我们再通过 `useCallback` 的源码确认一遍：

js

 代码解读

复制代码

`function updateCallback<T>(     callback: T, // useCallback 的第一个参数     deps: Array<mixed> | void | null // useCallback 的第二个参数 ): T {   // 取到当前的 useCallback 语句对应的 hook 节点，   const hook = updateWorkInProgressHook();      // 当前的依赖，后面拿来和上一次的依赖进行比较   const nextDeps = deps === undefined ? null : deps;      // 取到上一次缓存的函数   const prevState = hook.memoizedState;   if (prevState !== null) {     // 传了 useCallbck 的第二个参数才走到这里     if (nextDeps !== null) {       const prevDeps: Array<mixed> | null = prevState[1];       // 上一次的依赖和这一次的依赖进行比较，       // 相同就直接返回缓存的结果       if (areHookInputsEqual(nextDeps, prevDeps)) {         return prevState[0];       }     }   }   hook.memoizedState = [callback, nextDeps];   return callback; }`

相信看到这里，就知道为什么不能轻易使用 `useCallbck` 了吧？

不得不说，它的正确使用场景太少了。

有一个很典型的 `useCallbck` 错误使用的场景，说来惭愧，我也这么写过。如果我们按照 [这篇文档](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-rules.html%23eslint-plugin "https://zh-hans.reactjs.org/docs/hooks-rules.html#eslint-plugin") 的说明为我们的项目增加 ESLint 的配置，写类似于下面这段代码的时候会报错：

js

 代码解读

复制代码

`export default function App() {     const [count, setCount] = useState();     const fetchApi = async () => {         await fetch('https://jsonplaceholder.typicode.com/posts/1');         console.log(count);     };     useEffect(() => {         fetchApi();     }, []);     return <div>Hello World</div>; }`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1ea160da8c9411699dfe2df8ddb8f3c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我不知道有多少人遇到过类似的错误。但是我们知道肯定不能把 `fetchApi` 这个函数加到依赖里面去。

对于，这个问题，最简单直接的解决方法就是把函数移动到 `useEffect` 里面。

这样做会让某些人感到不太习惯，特别是刚从 Class 组件过来的同学（文章主题的原因，这一点我们就不展开说了）。事实上， `useEffect` 的设计理念本身就比较推荐我们把它放在内部，我们得尝试着适应它。如果习惯了，其实就会觉得也挺好的。

但是，肯定也有无法放到内部的情况，那就可以采用下面几种方案：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4933673fcf4dd290d644a420f87d09~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

上面的截图出自文档的 [在依赖列表中省略函数是否安全？](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-faq.html%23is-it-safe-to-omit-functions-from-the-list-of-dependencies "https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies")

请你注意一下第三条~ 它也说了，使用 `useCallback` 这种方法其实是万不得已，经过我们前面的分析，你应该也比较清楚了它这么说的原因了吧。

既然 `useCallback` 这么不好，那它什么时候可以用呢？

假设我们有一个叫做 `Counter` 的子组件，初始化渲染的时候消耗非常大：

jsx

 代码解读

复制代码

`<ExpensiveCounter count={count} onClick={handleClick} />`

如果我们不做任何优化，父组件有了任何更新，都会重新渲染 `Counter`。为了避免每次渲染父组件的时候都重新渲染子组件，我们可以使用 `React.memo`：

js

 代码解读

复制代码

`const ExpensiveCounter = React.memo(function Counter(props) {     ... })`

使用 `React.memo` 包裹之后，`Counter` 组件只有在 `props` 发生变化的时候才会重新渲染，我们的 `Counter` 接受两个 `props`：原始值 `count`，函数 `handleClick`。

如果父组件由于其他值的更改而发生了更新，父组件会重新渲染，由于 `handleClick` 是一个对象，每次渲染生成的 `handleClick` 都是新的。

这就会导致，尽管 `Counter` 被 `React.memo` 包裹了一层，但是还是会重新渲染，为了解决这个问题，我们就要这样写 `handleClick` 函数了：

js

 代码解读

复制代码

`const handleClick = useCallback(() => {     // 原来的 handleClick... }, [])`

这样，我们每次传递给 `Counter` 组件的 `handleClick` 都是同一个，我们的 `Counter` 组件只有在 `count` 发生变化的时候才会去渲染，这正是我们想要的，也就起到了很好的优化作用。

上面这个场景或许是 `useCallback` 为数不多的很适合的场景了。但是你在工作中碰到的某个子组件特别耗性能的情况多吗？反正我碰到的不多。

这周本来计划更新一篇解读 React 调度的文章的，但是我也不知道为什么，一点也提起不了干劲，不想看源码，也许下周就有干劲了。

奥，对了，这个周末天气好冷，看到这里的朋友，明天得记得多穿一点。