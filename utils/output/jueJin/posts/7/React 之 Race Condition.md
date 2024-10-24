---
author: "冴羽"
title: "React 之 Race Condition"
date: 2022-11-07
description: "Race Condition，中文译为竞态条件，旨在描述一个系统或者进程的输出，依赖于不受控制事件的出现顺序或者出现时机。 举个简单的例子： 你可能想，JavaScript 是单线程，怎么可"
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:57,comments:7,collects:46,views:3896,"
---
本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

竞态条件
----

Race Condition，中文译为**竞态条件**，旨在描述一个系统或者进程的输出，依赖于不受控制事件的出现顺序或者出现时机。

举个简单的例子：

```javascript
if (x == 5) // The "Check"
    {
    y = x * 2; // The "Act"
    
    // 如果其他的线程在 "if (x == 5)" and "y = x * 2" 执行之间更改了 x 的值
    // y 就可能不等于 10.
}
```

你可能想，JavaScript 是单线程，怎么可能出现这个问题？

React 与竞态条件
-----------

确实如此，但前端有异步渲染，所以竞态条件依然有可能出现，我们举个 React 中常见的例子。

这是一个非常典型的数据获取代码：

```javascript
    class Article extends Component {
        state = {
        article: null
        };
            componentDidMount() {
            this.fetchData(this.props.id);
        }
            async fetchData(id) {
            const article = await API.fetchArticle(id);
            this.setState({ article });
        }
        // ...
    }
```

看起来没什么问题，但这段代码还没有实现数据更新，我们再改一下：

```javascript
    class Article extends Component {
        state = {
        article: null
        };
            componentDidMount() {
            this.fetchData(this.props.id);
        }
            componentDidUpdate(prevProps) {
                if (prevProps.id !== this.props.id) {
                this.fetchData(this.props.id);
            }
        }
            async fetchData(id) {
            const article = await API.fetchArticle(id);
            this.setState({ article });
        }
        // ...
    }
    
```

当组件传入新的 `id` 时，我们根据新的 `id` 请求数据，然后 `setState` 最新获取的数据。

这时就可能出现竞态条件，比如用户选完立刻点击下一页，我们请求 `id` 为 1 的数据，紧接着请求 `id` 为 2 的数据，但因为网络或者接口处理等原因，`id`为 2 的接口提前返回，便会先展示 `id` 为 2 的数据，再展示 `id` 为 1 的数据，这就导致了错误。

我们可以想想遇到这种问题的场景，比如类似于百度的搜索功能，切换 tab 等场景，虽然我们也可以使用诸如 debounce 的方式来缓解，但效果还是会差点，比如使用 debounce，用户在输入搜索词的时候，展示内容会长期处于空白状态，对于用户体验而言，我们可以做的更好。

那么我们该如何解决呢？一种是在切换的时候取消请求，还有一种是借助一个布尔值来判断是否需要更新，比如这样：

```javascript
    function Article({ id }) {
    const [article, setArticle] = useState(null);
    
        useEffect(() => {
        let didCancel = false;
        
            async function fetchData() {
            const article = await API.fetchArticle(id);
            // 如果 didCancel 为 true 说明用户已经取消了
                if (!didCancel) {
                setArticle(article);
            }
        }
        
        fetchData();
        
        // 执行下一个 effect 之前会执行
            return () => {
            didCancel = true;
            };
            }, [id]);
            
            // ...
        }
```

当然你也可以用 ahooks 中的 `useRequest`，它的内部有一个 ref 变量记录最新的 promise，也可以解决 Race Condition 的问题：

```jsx
    function Article({ id }) {
        const { data, loading, error} = useRequest(() => fetchArticle(id), {
    refreshDeps: [id]
    });
    
    // ...
}
```

效果演示
----

### 问题复现

为了方便大家自己测试这个问题，我们提供相对完整的代码。以 [《Avoiding Race Conditions when Fetching Data with React Hooks》](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fhackernoon%2Favoiding-race-conditions-when-fetching-data-with-react-hooks-220d6fd0f663 "https://medium.com/hackernoon/avoiding-race-conditions-when-fetching-data-with-react-hooks-220d6fd0f663")中的例子为例，出现 Race Condition 问题的代码如下：

```jsx
    const fakeFetch = person => {
        return new Promise(res => {
        setTimeout(() => res(`${person}'s data`), Math.random() * 5000);
        });
        };
        
            const App = () => {
            
            const [data, setData] = useState('');
            const [loading, setLoading] = useState(false);
            const [person, setPerson] = useState(null);
            
                useEffect(() => {
                
                setLoading(true);
                
                    fakeFetch(person).then(data => {
                    setData(data);
                    setLoading(false);
                    });
                    
                    }, [person]);
                    
                        const handleClick = (name) => () => {
                        setPerson(name)
                    }
                    
                    return (
                    <Fragment>
                    <button onClick={handleClick('Nick')}>Nick's Profile</button>
                    <button onClick={handleClick('Deb')}>Deb's Profile</button>
                    <button onClick={handleClick('Joe')}>Joe's Profile</button>
                    {person && (
                    <Fragment>
                    <h1>{person}</h1>
                    <p>{loading ? 'Loading...' : data}</p>
                    </Fragment>
                )}
                </Fragment>
                );
                };
```

我们实现了一个 `fakeFetch`函数，用于模拟接口的返回，具体返回的时间为 `Math.random() * 5000)`，用于模拟数据的随机返回。

实现效果如下：

![race-condition.gif](/images/jueJin/f764c602b3234dd.png)

从效果图中可以看到，我们按顺序点击了 `Nick`、`Deb`、`Joe`，理想情况下，结果应该显示 `Joe's Data`，但最终显示的数据为最后返回的 `Nick's Data`。

### 布尔值解决

现在，我们尝试用一个 `canceled` 布尔值解决：

```jsx
    const App = () => {
    
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [person, setPerson] = useState(null);
    
        useEffect(() => {
        
        let canceled = false;
        setLoading(true);
        
            fakeFetch(person).then(data => {
                if (!canceled) {
                setData(data);
                setLoading(false);
            }
            });
            
            return () => (canceled = true);
            
            }, [person]);
            
            return (
            <Fragment>
            <button onClick={() => setPerson('Nick')}>Nick's Profile</button>
            <button onClick={() => setPerson('Deb')}>Deb's Profile</button>
            <button onClick={() => setPerson('Joe')}>Joe's Profile</button>
            {person && (
            <Fragment>
            <h1>{person}</h1>
            <p>{loading ? 'Loading...' : data}</p>
            </Fragment>
        )}
        </Fragment>
        );
        };
```

实现效果如下：

![2.gif](/images/jueJin/fa914a3e1b62467.png)

即便接口没有按照顺序返回，依然不影响最终显示的数据。

### useRequest 解决

我们也可以借助 [ahooks](https://link.juejin.cn?target=https%3A%2F%2Fahooks.js.org%2Fzh-CN%2Fhooks%2Fuse-request%2Fbasic "https://ahooks.js.org/zh-CN/hooks/use-request/basic") 的 `useRequest` 方法，修改后的代码如下：

```jsx
    const App2 = () => {
    const [person, setPerson] = useState('Nick');
    
        const { data, loading} = useRequest(() => fakeFetch(person), {
        refreshDeps: [person],
        });
        
            const handleClick = (name) => () => {
            setPerson(name)
        }
        
        return (
        <Fragment>
        <button onClick={handleClick('Nick')}>Nick's Profile</button>
        <button onClick={handleClick('Deb')}>Deb's Profile</button>
        <button onClick={() => setPerson('Joe')}>Joe's Profile</button>
        
        {person && (
        <Fragment>
        <h1>{person}</h1>
        <p>{loading ? 'Loading...' : data}</p>
        </Fragment>
    )}
    </Fragment>
    );
    };
```

代码效果如上，就不重复录制了。

考虑到部分同学可能会对 `useRequest` 的使用感到困惑，我们简单介绍一下 `useRequest`的使用：

`useRequest` 的第一个参数是一个异步函数，在组件初次加载时，会自动触发该函数执行。同时自动管理该异步函数的 `loading` 、 `data` 、 `error` 等状态。

`useRequest` 同样提供了一个 `options.refreshDeps` 参数，当它的值变化后，会重新触发请求。

```jsx
const [userId, setUserId] = useState('1');

    const { data, run } = useRequest(() => getUserSchool(userId), {
    refreshDeps: [userId],
    });
```

上面的示例代码，useRequest 会在初始化和 userId 变化时，触发函数执行。与下面代码实现功能完全一致：

```jsx
const [userId, setUserId] = useState('1');

const { data, refresh } = useRequest(() => getUserSchool(userId));

    useEffect(() => {
    refresh();
    }, [userId]);
```

Suspense
--------

这篇之所以讲 Race Condition，主要还是为了引入讲解 Suspense，借助 Suspense，我们同样可以解决 Race Condition：

```jsx
// 实现参考的 React 官方示例：https://codesandbox.io/s/infallible-feather-xjtbu
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

而关于 Suspense 的具体讲解，详见下篇[《React 之 Suspense》](https://juejin.cn/post/7163934860694781989 "https://juejin.cn/post/7163934860694781989")

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。