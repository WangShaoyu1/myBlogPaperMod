---
author: "冴羽"
title: "React 之 Suspense"
date: 2022-11-09
description: "本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！ 在上一篇《React 之 Race Condition》中，我们最后引入了Suspense来解决竞态条件问题"
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:88,comments:10,collects:100,views:5847,"
---
本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

前言
--

在上一篇[《React 之 Race Condition》](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")中，我们最后引入了 Suspense 来解决竞态条件问题，本篇我们来详细讲解一下 Suspense。

Suspense
--------

React 16.6 新增了 `<Suspense>` 组件，让你可以“等待”目标代码加载，并且可以直接指定一个加载的界面（像是个 spinner），让它在用户等待的时候显示。

目前，Suspense 仅支持的使用场景是：通过 `React.lazy` 动态加载组件

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载

// 在 ProfilePage 组件处于加载阶段时显示一个 spinner
<Suspense fallback={<Spinner />}>
<ProfilePage />
</Suspense>
```

执行机制
----

但这并不意味着 Suspense 不可以单独使用，我们可以写个 Suspense 单独使用的例子，不过目前使用起来会有些麻烦，但相信 React 官方会持续优化这个 API。

```jsx
let data, promise;

    function fetchData() {
    if (data) return data;
        promise = new Promise(resolve => {
            setTimeout(() => {
            data = 'data fetched'
            resolve()
            }, 3000)
            })
            throw promise;
        }
        
            function Content() {
            const data = fetchData();
            return <p>{data}</p>
        }
        
            function App() {
            return (
            <Suspense fallback={'loading data'}>
            <Content />
            </Suspense>
            )
        }
```

这是一个非常简单的使用示例，但却可以用来解释 Suspense 的执行机制。

最一开始 `<Content>` 组件会 throw 一个 promise，React 会捕获这个异常，发现是 promise 后，会在这个 promise 上追加一个 then 函数，在 then 函数中执行 Suspense 组件的更新，然后展示 fallback 内容。

等 fetchData 中的 promise resolve 后，会执行追加的 then 函数，触发 Suspense 组件的更新，此时有了 data 数据，因为没有异常，React 会删除 fallback 组件，正常展示 `<Content />` 组件。

实际应用
----

如果我们每个请求都这样去写，代码会很冗余，虽然有 `react-cache` 这个 npm 包，但上次更新已经是 4 年之前了，不过通过查看包源码以及参考 React 官方的示例代码，在实际项目中，我们可以这样去写：

```jsx
// 1. 通用的 wrapPromise 函数
    function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
        r => {
        status = "success";
        result = r;
        },
            e => {
            status = "error";
            result = e;
        }
        );
            return {
                read() {
                    if (status === "pending") {
                    throw suspender;
                        } else if (status === "error") {
                        throw result;
                            } else if (status === "success") {
                            return result;
                        }
                    }
                    };
                }
                
                // 这里我们模拟了请求过程
                    const fakeFetch = () => {
                        return new Promise(res => {
                        setTimeout(() => res('data fetched'), 3000);
                        });
                        };
                        
                        // 2. 在渲染前发起请求
                        const resource = wrapPromise(fakeFetch());
                        
                            function Content() {
                            // 3. 通过 resource.read() 获取接口返回结果
                            const data = resource.read();
                            return <p>{data}</p>
                        }
                        
                            function App() {
                            return (
                            <Suspense fallback={'loading data'}>
                            <Content />
                            </Suspense>
                            )
                        }
```

在这段代码里，我们声明了一个 `wrapPromise` 函数，它接收一个 promise，比如 fetch 请求。函数返回一个带有 read 方法的对象，这是因为封装成方法后，代码可以延迟执行，我们就可以在 Suspense 组件更新的时候再执行方法，从而获取最新的返回结果。

函数内部记录了三种状态，`pending`、`success`、`error`，根据状态返回不同的内容。

你可能会想，如果我们还要根据 id 之类的数据点击请求数据呢？使用 Suspense 该怎么做呢？[React 官方文档](https://link.juejin.cn?target=https%3A%2F%2F17.reactjs.org%2Fdocs%2Fconcurrent-mode-suspense.html "https://17.reactjs.org/docs/concurrent-mode-suspense.html")也给了示例代码：

```jsx
    const fakeFetch = (id) => {
        return new Promise(res => {
        setTimeout(() => res(`${id} data fetched`), 3000);
        });
        };
        
        // 1. 依然是直接请求数据
        const initialResource = wrapPromise(fakeFetch(1));
        
            function Content({resource}) {
            // 3. 通过 resource.read() 获取接口返回结果
            const data = resource.read();
            return <p>{data}</p>
        }
        
            function App() {
            
            // 2. 将 wrapPromise 返回的对象作为 props 传递给组件
            const [resource, setResource] = useState(initialResource);
            
            // 4. 重新请求
                const handleClick = (id) => () => {
                setResource(wrapPromise(fakeFetch(id)));
            }
            
            return (
            <Fragment>
            <button onClick={handleClick(1)}>tab 1</button>
            <button onClick={handleClick(2)}>tab 2</button>
            <Suspense fallback={'loading data'}>
            <Content resource={resource} />
            </Suspense>
            </Fragment>
            )
        }
```

好处：请求前置
-------

使用 Suspense 一个非常大的好处就是请求是一开始就执行的。回想过往的发送请求的时机，我们都是在 compentDidMount 的时候再请求的，React 是先渲染的节点再发送的请求，然而使用 Suspense，我们是先发送请求再渲染的节点，这就带来了体验上的提升。

尤其当请求多个接口的时候，借助 Suspense，我们可以实现接口并行处理以及提早展现，举个例子：

```jsx
    function fetchData(id) {
        return {
        user: wrapPromise(fakeFetchUser(id)),
        posts: wrapPromise(fakeFetchPosts(id))
        };
    }
    
        const fakeFetchUser = (id) => {
            return new Promise(res => {
            setTimeout(() => res(`user ${id} data fetched`), 5000 * Math.random());
            });
            };
            
                const fakeFetchPosts = (id) => {
                    return new Promise(res => {
                    setTimeout(() => res(`posts ${id} data fetched`), 5000 * Math.random());
                    });
                    };
                    
                    const initialResource = fetchData(1);
                    
                        function User({resource}) {
                        const data = resource.user.read();
                        return <p>{data}</p>
                    }
                    
                        function Posts({resource}) {
                        const data = resource.posts.read();
                        return <p>{data}</p>
                    }
                    
                        function App() {
                        
                        const [resource, setResource] = useState(initialResource);
                        
                            const handleClick = (id) => () => {
                            setResource(fetchData(id));
                        }
                        
                        return (
                        <Fragment>
                        <p><button onClick={handleClick(Math.ceil(Math.random() * 10))}>next user</button></p>
                        <Suspense fallback={'loading user'}>
                        <User resource={resource} />
                        <Suspense fallback={'loading posts'}>
                        <Posts resource={resource} />
                        </Suspense>
                        </Suspense>
                        </Fragment>
                        )
                    }
```

在这个示例代码中，user 和 posts 接口是并行请求的，如果 posts 接口提前返回，而 user 接口还未返回，会等到 user 接口返回后，再一起展现，但如果 user 接口提前返回，posts 接口后返回，则会先展示 user 信息，然后显示 loading posts，等 posts 接口返回，再展示 posts 内容。

![suspense.gif](/images/jueJin/586078a79a1a4b5.png)

这听起来好像没什么，但是想想如果我们是以前会怎么做，我们可能会用一个 Promise.all 来实现，但是 Promise.all 的问题就在于必须等待所有接口返回才会执行，而且如果其中有一个 reject 了，都会走向 catch 逻辑。使用 Suspense，我们可以做到更好的展示效果。

好处：解决竞态条件
---------

使用 Suspense 可以有效的解决 Race Conditions（竞态条件） 的问题，关于 Race Conditions 可以参考[《React 之 Race Condition》](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")。

Suspense 之所以能够有效的解决 Race Conditions 问题，就在于传统的实现中，我们需要考虑 setState 的正确时机，执行顺序是：1. 请求数据 2. 数据返回 3. setState 数据

而在 Suspense 中，我们请求后，立刻就设置了 setState，然后就只用等待请求返回，React 执行 Suspense 的再次更新就好了，执行顺序是：1. 请求数据 2. setState 数据 3. 数据返回 4. Suspense 重新渲染，所以大大降低了出错的概率。

```jsx
    const fakeFetch = person => {
        return new Promise(res => {
        setTimeout(() => res(`${person}'s data`), Math.random() * 5000);
        });
        };
        
            function fetchData(userId) {
            return wrapPromise(fakeFetch(userId))
        }
        
        const initialResource = fetchData('Nick');
        
            function User({ resource }) {
            const data = resource.read();
            return <p>{ data }</p>
        }
        
            const App = () => {
            
            const [person, setPerson] = useState('Nick');
            
            const [resource, setResource] = useState(initialResource);
            
                const handleClick = (name) => () => {
                setPerson(name)
                setResource(fetchData(name));
            }
            
            return (
            <Fragment>
            <button onClick={handleClick('Nick')}>Nick's Profile</button>
            <button onClick={handleClick('Deb')}>Deb's Profile</button>
            <button onClick={handleClick('Joe')}>Joe's Profile</button>
            <Fragment>
            <h1>{person}</h1>
            <Suspense fallback={'loading'}>
            <User resource={resource} />
            </Suspense>
            </Fragment>
            </Fragment>
            );
            };
```

错误处理
----

注意我们使用的 wrapPromise 函数：

```javascript
    function wrapPromise(promise) {
    // ...
        return {
            read() {
                if (status === "pending") {
                throw suspender;
                    } else if (status === "error") {
                    throw result;
                        } else if (status === "success") {
                        return result;
                    }
                }
                };
            }
```

当 status 为 error 的时候，会 throw result 出来，如果 throw 是一个 promise，React 可以处理，但如果只是一个 error，React 就处理不了了，这就会导致渲染出现问题，所以我们有必要针对 status 为 error 的情况进行处理，React 官方文档也提供了方法，那就是定义一个错误边界组件：

```jsx
// 定义一个错误边界组件
    class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
        static getDerivedStateFromError(error) {
            return {
            hasError: true,
            error
            };
        }
            render() {
                if (this.state.hasError) {
                return this.props.fallback;
            }
            return this.props.children;
        }
    }
    
        function App() {
        // ...
        return (
        <Fragment>
        <button onClick={handleClick(1)}>tab 1</button>
        <button onClick={handleClick(2)}>tab 2</button>
        <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={'loading data'}>
        <Content resource={resource} />
        </Suspense>
        </ErrorBoundary>
        </Fragment>
        )
    }
```

当 `<Content />` 组件 throw 出 error 的时候，就会被 `<ErrorBoundary />`组件捕获，然后展示 fallback 的内容。

源码
--

那 Suspense 的源码呢？我们[查看 React.js 的源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fmain%2Fpackages%2Freact%2Fsrc%2FReact.js "https://github.com/facebook/react/blob/main/packages/react/src/React.js")：

```javascript
    import {
    REACT_SUSPENSE_TYPE
    } from 'shared/ReactSymbols';
    
        export {
        REACT_SUSPENSE_TYPE as Suspense
        };
```

再看下`shared/ReactSymbols`的源码：

```javascript
export const REACT_SUSPENSE_TYPE: symbol = Symbol.for('react.suspense');
```

所以当我们写一个 Suspense 组件的时候：

```jsx
<Suspense fallback={'loading data'}>
<Content />
</Suspense>

// 被转译为
    React.createElement(Suspense, {
    fallback: 'loading data'
    }, React.createElement(Content, null));
```

createElement 传入的 Suspense 就只是一个常量而已，具体的处理逻辑会在以后的文章中慢慢讲解。

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")
5.  [React 之 Race Condition](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。