---
author: "Sunshine_Lin"
title: "你说你会Promise？那你解决一下项目中的这五个难题？"
date: 2021-11-22
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心，众所周知哈，Promise在咱们的开发中是相当的重要，我觉得对于Promise的使用等级，可以分为三个"
tags: ["前端","JavaScript","Promise中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:243,comments:21,collects:346,views:14309,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心，众所周知哈，`Promise`在咱们的开发中是相当的重要，我觉得对于`Promise`的使用等级，可以分为三个等级

*   1、掌握`Promise`的基本使用
*   2、掌握`Promise`的基本原理
*   3、在项目中能灵活运用`Promise`解决一些问题

第一点的话，其实就是能掌握`Promise`的一些基本使用方法以及一些方法，如`then、catch、all、race、finally、allSettled、any、resolve`等等

第二点的话，就是要能简单实现一下`Promise`的原理，这能使我们对`Promise`的那些常用方法有更好的理解

第三点的话，就是要能灵活`Promise`解决咱们开发中的一些问题，今天我就给大家说一下我用`Promise`在项目开发中解决了什么问题吧！

接口请求超时
------

顾名思义，就是给定一个时间，如果接口请求超过这个时间的话就报错

### 1、自己实现

实现思路就是：`接口请求`和`延时函数`赛跑，并使用一个`Promise`包着，由于`Promise`的状态是不可逆的，所以如果`接口请求`先跑完则说明`未超时`且`Promise`的状态是`fulfilled`，反之，`延时函数`先跑完则说明`超时了`且`Promise`的状态是`rejetced`，最后根据`Promise`的状态来判断有无超时

![截屏2021-11-22 下午9.58.49.png](/images/jueJin/c11a58204a02441.png)

```js
/**
* 模拟延时
* @param {number} delay 延迟时间
* @returns {Promise<any>}
*/
    function sleep(delay) {
        return new Promise((_, reject) => {
        setTimeout(() => reject('超时喽'), delay)
        })
    }
    
    /**
    * 模拟请求
    */
        function request() {
        // 假设请求需要 1s
            return new Promise(resolve => {
            setTimeout(() => resolve('成功喽'), 1000)
            })
        }
        
        /**
        * 判断是否超时
        * @param {() => Promise<any>} requestFn 请求函数
        * @param {number} delay 延迟时长
    * @returns {Promise<any>}
    */
        function timeoutPromise(requestFn, delay) {
            return new Promise((resolve, reject) => {
        const promises = [requestFn(), sleep(delay)]
            for (const promise of promises) {
            // 超时则执行失败，不超时则执行成功
            promise.then(res => resolve(res), err => reject(err))
        }
        })
    }
```

### 2、Promise.race

其实`timeoutPromise`中的代码可以使用`Promise.race`来代替，是同样的效果

```js
    function timeoutPromise(requestFn, delay) {
    // 如果先返回的是延迟Promise则说明超时了
    return Promise.race([requestFn(), sleep(delay)])
}
```

### 3、测试

```js
// 超时
timeoutPromise(request, 500).catch(err => console.log(err)) // 超时喽

// 不超时
timeoutPromise(request, 2000).then(res => console.log(res)) // 成功喽
```

转盘抽奖
----

我们平时在转盘抽奖时，一般都是开始转动的同时也发起接口请求，所以有两种可能

*   1、转盘转完，接口还没请求回来，这是不正常的
    
*   2、转盘转完前，接口就请求完毕，这是正常的，但是需要保证`请求回调`跟`转盘转完回调`同时执行
    

### 1、转盘转完，接口还没请求回来

主要问题就是，怎么判断`接口请求时间`是否超过`转盘转完所需时间`，咱们其实可以用到上一个知识点`接口请求超时`，都是一样的道理。如果`转盘转完所需时间`是`2500ms`，那咱们可以限定`接口请求`需要提前`1000ms`请求回来，也就是`接口请求`的超时时间为`2500ms - 1000ms = 1500ms`

```js
/**
* 模拟延时
* @param {number} delay 延迟时间
* @returns {Promise<any>}
*/
    function sleep(delay) {
        return new Promise((_, reject) => {
        setTimeout(() => reject('超时喽'), delay)
        })
    }
    
    /**
    * 模拟请求
    */
        function request() {
            return new Promise(resolve => {
            setTimeout(() => resolve('成功喽'), 1000)
            })
        }
        
        /**
        * 判断是否超时
        * @param {() => Promise<any>} requestFn 请求函数
        * @param {number} delay 延迟时长
    * @returns {Promise<any>}
    */
        function timeoutPromise(requestFn, delay) {
        return Promise.race([requestFn(), sleep(delay)])
    }
```

### 2、转盘转完前，接口就请求完毕

咱们确保了`接口请求`可以在`转盘转完`之前请求回来，但是还有一个问题，就是需要保证`请求回调`跟`转盘转完回调`同时执行，因为虽然`接口请求`请求回来的时候，转盘还在转着，咱们需要等转盘转完时，再一起执行这两个回调

听到这个描述，相信很多同学就会想到`Promise.all`这个方法

```js
// ...上面代码

/**
* 模拟转盘旋转到停止的延时
* @param {number} delay 延迟时间
* @returns {Promise<any>}
*/
    function turntableSleep(delay) {
        return new Promise(resolve => {
        setTimeout(() => resolve('停止转动喽'), delay)
        })
    }
    
    /**
    * 判断是否超时
    * @param {() => Promise<any>} requestFn 请求函数
    * @param {number} turntableDelay 转盘转多久
    * @param {number} delay 请求超时时长
* @returns {Promise<any>}
*/

    function zhuanpanPromise(requsetFn, turntableDelay, delay) {
    return Promise.all([timeoutPromise(requsetFn, delay), turntableSleep(turntableDelay)])
}

```

### 3、测试

```js
// 不超时，且先于转盘停止前请求回数据
zhuanpanPromise(request, 2500, 1500).then(res => console.log(res), err => console.log(err))
```

控制并发的Promise的调度器
----------------

想象一下，有一天你突然一次性发了10个请求，但是这样的话并发量是很大的，能不能控制一下，就是一次只发2个请求，某一个请求完了，就让第3个补上，又请求完了，让第4个补上，以此类推，让最高并发量变成可控的

```js
addTask(1000,"1");
addTask(500,"2");
addTask(300,"3");
addTask(400,"4");
的输出顺序是：2 3 1 4

整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4

```

### 实现

```js
    class Scheduler {
        constructor(limit) {
    this.queue = []
    this.limit = limit
    this.count = 0
}


    add(time, order) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                console.log(order)
                resolve()
                }, time)
                })
            }
            this.queue.push(promiseCreator)
        }
        
            taskStart() {
                for(let i = 0; i < this.limit; i++) {
                this.request()
            }
        }
        
            request() {
            if (!this.queue.length || this.count >= this.limit) return
            this.count++
                this.queue.shift()().then(() => {
                this.count--
                this.request()
                })
            }
        }
```

### 测试

```js
// 测试
const scheduler = new Scheduler(2);
    const addTask = (time, order) => {
    scheduler.add(time, order);
    };
    addTask(1000, "1");
    addTask(500, "2");
    addTask(300, "3");
    addTask(400, "4");
    scheduler.taskStart();
```

取消重复请求
------

举个例子，咱们在做表单提交时，为了防止多次重复的提交，肯定会给按钮的点击事件加上`防抖措施`，这确实是有效地避免了多次点击造成的重复请求，但是其实还是有弊端的

众所周知，为了用户更好地体验，`防抖`的延时是不能太长的，一般在我的项目中都是`300ms`，但是这只能管到`请求时间 < 300ms`的接口请求，如果有一个接口请求需要`2000ms`，那么此时`防抖`也做不到完全限制`重复请求`，所以咱们需要额外做一下`取消重复请求`的处理

### 实现

实现思路：简单说就是，利用`Promise.race`方法，给每一次请求的身边安装一颗雷，如果第一次请求后，又接了第二次重复请求，那么就执行第一次请求身边的雷，把第一次请求给炸掉，以此类推。

```js
    class CancelablePromise {
        constructor() {
        this.pendingPromise = null
        this.reject = null
    }
    
        request(requestFn) {
            if (this.pendingPromise) {
            this.cancel('取消重复请求')
        }
        
        const promise = new Promise((_, reject) => (this.reject = reject))
        this.pendingPromise = Promise.race([requestFn(), promise])
        return this.pendingPromise
    }
    
        cancel(reason) {
        this.reject(reason)
        this.pendingPromise = null
    }
}

    function request(delay) {
    return () =>
        new Promise(resolve => {
            setTimeout(() => {
            resolve('最后赢家是我')
            }, delay)
            })
        }
```

### 测试

```js
const cancelPromise = new CancelablePromise()

// 模拟频繁请求5次
    for (let i = 0; i < 5; i++) {
    cancelPromise
    .request(request(2000))
    .then((res) => console.log(res)) // 最后一个 最后赢家是我
    .catch((err) => console.error(err)); // 前四个 取消重复请求
}
```

全局请求loading
-----------

比如一个页面中，或者多个组件中都需要请求并且展示`loading状态`，此时我们不想要每个页面或者组件都写一遍`loading`，那我们可以统一管理`loading`，`loading`有两种情况

*   1、全局只要有一个接口还在请求中，就展示`loading`
*   2、全局所有接口都不在请求中，就隐藏`loading`

那我们怎么才能知道全局接口的请求状态呢？其实咱们可以利用`Promise`，只要某个`接口请求Promise`的状态不是`pending`那就说明他请求完成了，无论请求成功或者失败，既然是无论成功失败，那咱们就会想到`Promise.prototype.finally`这个方法

### 实现

```js
    class PromiseManager {
        constructor() {
        this.pendingPromise = new Set()
        this.loading = false
    }
    
        generateKey() {
        return `${new Date().getTime()}-${parseInt(Math.random() * 1000)}`
    }
    
        push(...requestFns) {
            for (const requestFn of requestFns) {
            const key = this.generateKey()
            this.pendingPromise.add(key)
                requestFn().finally(() => {
                this.pendingPromise.delete(key)
                this.loading = this.pendingPromise.size !== 0
                })
            }
        }
    }
```

### 测试

```js
// 模拟请求
    function request(delay) {
        return () => {
            return new Promise(resolve => {
            setTimeout(() => resolve('成功喽'), delay)
            })
        }
    }
    
    const manager = new PromiseManager()
    
    manager.push(request(1000), request(2000), request(800), request(2000), request(1500))
    
        const timer = setInterval(() => {
        // 轮询查看loading状态
        console.log(manager.loading)
        }, 300)
```

参考
--

*   [Promise技术点-面试实战版](https://juejin.cn/post/6993296099331014669 "https://juejin.cn/post/6993296099331014669")

结语
--

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645

![image.png](/images/jueJin/20404bbc01f6444.png)