---
author: "Sunshine_Lin"
title: "asyncawait 你是会用，但是你知道怎么处理错误吗？"
date: 2022-02-14
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 Promise封装请求 大家平时如果使用Promise封装请求，那么当你使用这个请求函数的时候是这样的"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:590,comments:179,collects:866,views:50888,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

Promise封装请求
-----------

大家平时如果使用`Promise`封装请求，那么当你使用这个请求函数的时候是这样的：

```js
// 封装请求函数
    const request = (url, params) => {
        return new Promise((resolve, reject) => {
        // ...do something
        })
    }
    
    // 使用时
        const handleLogin = () => {
        request(
        '/basic/login',
            {
            usename: 'sunshine',
            password: '123456'
        }
            ).then(res => {
            // success do something
                }).catch(err => {
                // fail do something
                })
            }
```

可以看到，当你的请求成功时，会调用`then`方法，当你的请求失败时会调用`catch`方法。

async/await
-----------

`Promise`的出现解决了很多问题，但是如果请求多了且有顺序要求的话，难免又会出现`嵌套`的问题，可读性较差，比如：

```js
    const handleLogin = () => {
    request(
    '/basic/login',
        {
        usename: 'sunshine',
        password: '123456'
    }
        ).then(res => {
        // 登录成功后获取用户信息
        request(
        '/basic/getuserinfo',
        res.id
            ).then(info => {
            this.userInfo = info
            }).catch()
                }).catch(err => {
                // fail do something
                })
```

所以这个时候`async/await`出现了，他的作用是：**用同步的方式执行异步操作**，上面的代码使用`async/await`的话可以改写成：

```js
    const handleLogin = async () => {
        const res = await request('/basic/login', {
        usename: 'sunshine',
        password: '123456'
        })
            const info = await request('/basic/getuserinfo', {
            id: res.id
            })
            this.userInfo = info
        }
```

这样的话代码的可读性比较高，而不会出现刚刚的嵌套问题，但是现在又有一个问题了，Promise有`catch`这个错误回调来保证请求错误后该做什么操作，但是`async/await`该如何捕获错误呢？

await-to-js
-----------

其实已经有一个库`await-to-js`已经帮我们做了这件事，我们可以看看它是怎么做的，它的源码只有`短短十几行`，我们应该读读它的源码，学学它的思想

### 源码很简单

```js
/**
* @param { Promise } 传进去的请求函数
* @param { Object= } errorExt - 拓展错误对象
* @return { Promise } 返回一个Promise
*/
export function to(
promise,
errorExt
    ) {
    return promise
    .then(data => [null, data])
        .catch(err => {
            if (errorExt) {
            const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
    }
    
return [err, undefined]
})
}

export default to
```

> 源码总结：`to`函数返回一个Promise且值是一个数组，数组之中有两个元素，如果索引为`0`的元素不为空值，说明该请求报错，如果索引`0`的元素为空值说明该请求没有报错，也就是成功。

### 使用很简单

我们该怎么去使用这个`to`函数呢？其实很简单，还是刚刚的例子

```js
    const handleLogin = async () => {
        const [resErr, res] = await to(request('/basic/login', {
        usename: 'sunshine',
        password: '123456'
        }))
            if (resErr) {
            // fail do somthing
            return
        }
            const [userErr, info] = await to(request('/basic/getuserinfo', {
            id: res.id
            }))
                if (userErr) {
                // fail do somthing
                return
            }
            this.userInfo = info
        }
```

所以说，偶尔看看一些库的源码，还是能学到东西的！！！

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/0119eba3e67249f.png)