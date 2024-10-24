---
author: "Sunshine_Lin"
title: "用30行代码封装一个工具，解决Promise的多并发问题"
date: 2024-06-02
description: "大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 背景 提起控制并发，大家应该不陌生，我们可以先来看看多并发，再去聊聊为什么要去控制它 多并发一般是指"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:36,comments:0,collects:56,views:1800,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/efb6b59d75bc44c.png)

背景
--

提起`控制并发`，大家应该不陌生，我们可以先来看看`多并发`，再去聊聊为什么要去控制它

`多并发`一般是指多个异步操作同时进行，而运行的环境中资源是有限的，短时间内过多的并发，会对所运行的环境造成很大的压力，比如前端的浏览器，后端的服务器，常见的多并发操作有：

*   前端的多个接口同时请求
*   前端多条数据异步处理
*   Nodejs的多个数据操作同时进行
*   Nodejs对多个文件同时进行修改

![](/images/jueJin/8e773b3dc9194bd.png)

正是因为`多并发`会造成压力，所以我们才需要去控制他，降低这个压力~，比如我可以控制最大并发数是 3，这样的话即使有100个并发，我也能保证最多同时并发的最大数量是 3

![](/images/jueJin/3a9cf5e463f94ad.png)

代码实现
----

### 实现思路

大致思路就是，假设现在有 9 个并发，我设置最大并发为 3，那么我将会走下面这些步骤：

*   1、先定好三个坑位
*   2、让前三个并发进去坑位执行
*   3、看哪个坑位并发先执行完，就从剩余的并发中拿一个进去补坑
*   4、一直重复第 3 步，一直到所有并发执行完

![](/images/jueJin/e704daed0cae426.png)

### Promise.all

在进行多并发的时候，我们通常会使用`Promise.all`，但是`Promise.all`并不能控制并发，或者说它本来就没这个能力，我们可以看下面的例子

```js
    const fetchFn = (delay, index) => {
        return new Promise(resolve => {
        console.log(index)
            setTimeout(() => {
            resolve(index)
            }, delay);
            })
        }
        
        
            const promises = [
            fetchFn(1000, 1),
            fetchFn(1000, 2),
            fetchFn(1000, 3),
            fetchFn(1000, 4),
            fetchFn(1000, 5),
            fetchFn(1000, 6)
        ]
        
        Promise.all(promises)
```

最后是同时输出，这说明这几个并发是同时发生的

![](/images/jueJin/7089e2ea6d3e494.png)

所以我们需要做一些改造，让`Promise.all`执行 promises 时支持控制并发，但是我们改造的不应该是`Promise.all`，而是这一个个的`fetchFn`

### 期望效果

```js
    const limitFn = (limit) => {
    // ...coding
}

// 最大并发数 2
const generator = limitFn(2)


    const promises = [
    generator(() => fetchFn(1000, 1)),
    generator(() => fetchFn(1000, 2)),
    generator(() => fetchFn(1000, 3)),
    generator(() => fetchFn(1000, 4)),
    generator(() => fetchFn(1000, 5)),
    generator(() => fetchFn(1000, 6))
]

Promise.all(promises)
```

![](/images/jueJin/cd57c9036fe64e6.png)

### 实现 limitFn

我们需要在函数内部维护两个变量：

*   queue：队列，用来存每一个改造过的并发
*   activeCount： 用来记录正在执行的并发数

并声明函数 generator ，这个函数返回一个 Promise，因为 Promise.all 最好是接收一个 Promise 数组

```js
    const limitFn = (concurrency) => {
    const queue = [];
    let activeCount = 0;
    
    const generator = (fn, ...args) =>
        new Promise((resolve) => {
        enqueue(fn, resolve, ...args);
        });
        
        return generator;
        };
```

接下来我们来实现 `enqueue` 这个函数做两件事：

*   将每一个 fetchFn 放进队列里
*   将坑位里的 fetchFn 先执行

```js
    const enqueue = (fn, resolve, ...args) => {
    queue.push(run.bind(null, fn, resolve, ...args));
    
        if (activeCount < limit && queue.length > 0) {
        queue.shift()();
    }
    };
```

假如我设置最大并发数为 2，那么这一段代码在一开始的时候只会执行 2 次，因为一开始只会有 2 次符合 if 判断，大家可以思考一下为什么~

```js
    if (activeCount < limit && queue.length > 0) {
    queue.shift()(); // 这段代码
}
```

一开始执行 2 次，说明这时候两个坑位已经各自有一个 fetchFn 在执行了

接下来我们实现 `run` 函数，这个函数是用来包装 fetch 的，他完成几件事情：

*   1、将 activeCount++ ，这时候执行中的并发数 +1
*   2、将 fetchFn 执行，并把结果 resolve 出去，说明这个并发执行完了
*   3、将 activeCount--，这时候执行中的并发数 -1
*   4、从 queue 中取一个并发，拿来补坑执行

```js
    const run = async (fn, resolve, ...args) => {
    activeCount++;
    
    const result = (async () => fn(...args))();
    
    
        try {
        const res = await result;
        resolve(res);
    } catch { }
    
    next();
    };
```

其实第 3、4 步，是在 next 函数里面执行的

```js
    const next = () => {
    activeCount--;
    
        if (queue.length > 0) {
        queue.shift()();
    }
    };
```

### 完整代码

```js
    const limitFn = (limit) => {
    const queue = [];
    let activeCount = 0;
    
        const next = () => {
        activeCount--;
        
            if (queue.length > 0) {
            queue.shift()();
        }
        };
        
            const run = async (fn, resolve, ...args) => {
            activeCount++;
            
            const result = (async () => fn(...args))();
            
            
                try {
                const res = await result;
                resolve(res);
            } catch { }
            
            next();
            };
            
                const enqueue = (fn, resolve, ...args) => {
                queue.push(run.bind(null, fn, resolve, ...args));
                
                    if (activeCount < limit && queue.length > 0) {
                    queue.shift()();
                }
                };
                
                const generator = (fn, ...args) =>
                    new Promise((resolve) => {
                    enqueue(fn, resolve, ...args);
                    });
                    
                    return generator;
                    };
```

### 这不是我写的

其实这是一个很出名的库的源码，就是`p-limit`，哈哈，但是重要吗？知识嘛，读懂了，它就是你的，到时跟面试官唠嗑的时候，他哪知道是不是真的是你写的~

![](/images/jueJin/02d49f9fde834da.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")