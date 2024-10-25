---
author: "徐小夕"
title: "深度剖析github star数15.1k的开源项目redux-thunk"
date: 2020-08-16
description: "日益忙碌的一周又过去了，是时候开始每周一次的总结复盘了，今天笔者就来剖析一下github中star数15.1k的开源项目redux-thunk。 作为一名React方向的前端工程师，不管是被面试还是面试别人，大部分都会说起redux-thunk的实现原理，因为它非常经典且有用，…"
tags: ["Redux","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:24,comments:0,collects:22,views:2399,"
---
日益忙碌的一周又过去了，是时候开始每周一次的总结复盘了，今天笔者就来剖析一下**github**中**star**数15.1k的开源项目**redux-thunk**。

作为一名**React**方向的前端工程师，不管是被面试还是面试别人，大部分都会说起**redux-thunk**的实现原理，因为它非常经典且有用，而且代码量少的感人，只有短短12行代码，却能解决**React**开发中**同一个函数支持多dispatch**和**异步action**的问题（虽然这完全依赖于redux的**中间件机制**（Middleware））。

接下来笔者将从：

*   Redux的工作机制
*   中间件实现原理
*   redux-thunk源码实现

这三个方面来带大家彻底掌握redux-thunk源码，从而对redux有更深入的了解和应用。如果大家对react-redux-redux-thunk实战感兴趣的，读完之后可以移步笔者的[《彻底掌握redux》之开发一个任务管理平台](https://juejin.cn/post/6844904071933984776 "https://juejin.cn/post/6844904071933984776")

正文
--

在解读Redux-thunk源码之前我们需要先掌握redux的基本工作机制和中间件实现原理，这样才能更好的理解源码背后的奥义。长话短说我们先来看看redux的几个核心api及其作用： ![](/images/jueJin/d0cf434170bb437.png) **redux**解决的真正问题是React组件间的**状态共享**和**状态管理**问题，通过以上的6个核心api我们便能管理复杂的状态，并能监听和追溯状态的改动。机制笔者总结如下： ![](/images/jueJin/5094d0f8a3e4429.png) redux工作机理基本了解之后，我们先看看一个实际的例子：

```js
import actionType from './actionType'

    class Actions {
        static start() {
            return {
            type: actionType.CREATE_TODO_DOING
        }
    }
    
        static ok(data, cb) {
        cb && 'function' === typeof cb && cb(data);
            return {
            type: actionType.CREATE_TODO_SUCCESS,
            payload: data
        }
    }
    
        static fail(data, cb) {
        cb && 'function' === typeof cb && cb(data);
            return {
            type: actionType.CREATE_TODO_FAILURE,
            payload: data
        }
    }
}
```

以上代码我们可以发现我们用了一个统一的**createAction**来创建**action**，在调用时只需要执行Actions.start()即可，我们也知道**action**返回的是一个标准的对象，但我们可以在return之前做一些side effect。这里我们并不能在action中处理异步逻辑，这也是**redux-thunk**的价值之一，即解决异步调用action。

到这一步我们仍然不能直接进入redux-thunk的源码分析，因为我们还是不清楚如何解决上述步骤，因为我们还没有了解redux的中间件机制。

redux中间件机制
----------

说到中间件（middleware），使用过nodejs的人可能会很熟悉，比如说知名的koa中间件，express中间件等，其实中间件笔者的理解是**在某个执行流中的某个环节做一些额外的处理的模块**。实现中间件的机制也很简单， 就是在框架核心执行流中去遍历外部传入的中间件，并依次执行即可，我们先来看看redux中如何使用中间件的：

```js
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

const middlewares = applyMiddleware(middleware1, middleware2);
const store = createStore(reducers, middlewares);
```

所以说**redux-thunk**是被传入**applyMiddleware**方法中作为参数使用的，不难猜到**applyMiddleware**方法中一定有遍历执行参数的逻辑，我们来看看**applyMiddleware**的核心源码：

```js
    export default function applyMiddleware(...middlewares) {
        return function enhancer(createStore) {
            return function enhancedCreateStore(...args) {
            const store = createStore(...args)
                let dispatch = () => {
                thrownewError('此处省略n个字...')
            }
            
                const middlewareAPI = {
                getState: store.getState,
                dispatch: (...args) => dispatch(...args)
            }
            
                const chain = middlewares.map(function(middleware) {
                return middleware(middlewareAPI)
                })
                
                dispatch = compose(...chain)(store.dispatch)
                    return {
                    ...store,
                    dispatch,
                }
            }
        }
    }
```

由上面的源码可知，在chain这段代码里我们发现其存储的是**applyMiddleware方法参数传入getState，dispatch后的调用结果**。接下来在dispatch这段代码中出现了**compose**函数， 熟悉函数式编程的朋友不难猜到其内部肯定是实现批处理chain的函数，并将store.dispatch泵送至其内部。上面源码分析后我们知道每一次执行dispatch时，都会先经过middleware的“洗礼”。

我们再来看看**compose**函数的内部实现：

```js
    export default function compose(...funcs) {
        if (funcs.length === 0) {
        return arg => arg
    }
    
        if (funcs.length === 1) {
    return funcs[0]
}

    return funcs.reduce(function(a, b) {
        return function (...args) {
        return a(b(...args))
    }
    })
}
```

由上面代码可以看出compose最终返回的是一个函数，如果参数大于一时，我们采用reduce将上一个函数返回的结果传给下一个函数参数，以此来实现之间的参数共享和传递，非常经典的设计。

在掌握了redux中间件实现原理之后， 我们再来看redux-thunk源码就非常容易理解了。

redux-thunk源码分析
---------------

我们先看看这个github中star数15.1k的源码长啥子：

```js
    function createThunkMiddleware(extraArgument) {
        return ({ dispatch, getState }) => (next) => (action) => {
            if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
        }
        
        return next(action);
        };
    }
    
    const thunk = createThunkMiddleware();
    thunk.withExtraArgument = createThunkMiddleware;
    
    export default thunk;
```

没错， 这就是**redux-thunk**的全部源码了，是不是很nice～。在上面的介绍中我们了解到redux中间件机制使得我们可以在中间件中拿到必备的**dispatch**, **getState**，并且在执行之前已经调用了两层middleware，此时我们可以解剖一下createThunkMiddleware，在第一次调用createThunkMiddleware是在chain阶段，即上面源码分析的： ![](/images/jueJin/4368817bbc83494.png) 所以这里的next也就是第二次调用时的store.dispatch, 为了实现同一函数内能执行多次dispatch，我们会判断如果action为函数，则执行action本身并把必要参数传递给它，否则则直接触发dispatch，这样我们就实现了支持action为函数并且支持异步多dispatch的功能了，读到这还是非常感叹其设计的优雅和简洁，不经让笔者感叹：**学好函数式，走遍天下都不怕！**

最后笔者准备了一个基于React+redux+redux-thunk的实战项目，github地址：

[github.com/MrXujiang/r…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fredux_OA "https://github.com/MrXujiang/redux_OA")

感兴趣的可以学习参考一下。

最后
--

如果想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。 ![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [Typescript核心知识点总结及项目实战案例分析](https://juejin.cn/post/6857123751205535751 "https://juejin.cn/post/6857123751205535751")
*   [当遇到跨域开发时, 我们如何处理好前后端配置和请求库封装(koa/axios版)](https://juejin.cn/post/6854573220431921160 "https://juejin.cn/post/6854573220431921160")
*   [快速在你的vue/react应用中实现ssr(服务端渲染)](https://juejin.cn/post/6845166890390667271 "https://juejin.cn/post/6845166890390667271")
*   [微前端架构初探以及我的前端技术盘点](https://juejin.cn/post/6844904113445011469 "https://juejin.cn/post/6844904113445011469")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [从零到一教你基于vue开发一个组件库](https://juejin.cn/post/6844904085808742407 "https://juejin.cn/post/6844904085808742407")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")