---
author: "Sunshine_Lin"
title: "看了就会，手写Promise原理，最通俗易懂的版本！！！"
date: 2021-08-10
description: "前言 大家好，我是林三心，相信大家在日常开发中都用过Promise，我一直有个梦想，就是以最通俗的话，讲最复杂的知识，所以我把通俗易懂放在了首位，今天就带大家手写实现以下Promise吧，相信大家一看"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:1600,comments:0,collects:2700,views:78655,"
---
前言
--

大家好，我是林三心，相信大家在日常开发中都用过**Promise**，我一直有个梦想，就是**以最通俗的话，讲最复杂的知识**，所以我把**通俗易懂**放在了首位，今天就带大家手写实现以下**Promise吧**，相信大家一看就懂。

![image.png](/images/jueJin/032d1f70ba34471.png)

resolve和reject
--------------

咱们来看一段Promise的代码：

```js
    let p1 = new Promise((resolve, reject) => {
    resolve('成功')
    reject('失败')
    })
    console.log('p1', p1)
    
        let p2 = new Promise((resolve, reject) => {
        reject('失败')
        resolve('成功')
        })
        console.log('p2', p2)
        
            let p3 = new Promise((resolve, reject) => {
            throw('报错')
            })
            console.log('p3', p3)
            
```

那么会输出什么呢？请看：

![截屏2021-08-01 上午11.53.33.png](/images/jueJin/db87e7956fa2465.png)

这里暴露出了四个知识点：

*   1、执行了`resolve`，Promise状态会变成`fulfilled`
*   2、执行了`reject`，Promise状态会变成`rejected`
*   3、Promise只以`第一次为准`，第一次成功就`永久`为`fulfilled`，第一次失败就永远状态为`rejected`
*   4、Promise中有`throw`的话，就相当于执行了`reject` 那么咱们就把这四个知识点一步步实现吧！！！

### 1、实现resolve与reject

大家要注意：Promise的初始状态是`pending`

这里很重要的一步是`resolve和reject的绑定this`，为什么要绑定`this`呢？这是为了resolve和reject的`this指向`永远指向当前的`MyPromise实例`，防止随着函数执行环境的改变而改变

```js
    class MyPromise {
    // 构造方法
        constructor(executor) {
        
        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
        // 执行传进来的函数
        executor(this.resolve, this.reject)
    }
    
        initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }
    
        initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
    }
    
        resolve(value) {
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }
    
        reject(reason) {
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }
}
```

咱们来测试一下代码吧：

```js
    const test1 = new MyPromise((resolve, reject) => {
    resolve('成功')
    })
console.log(test1) // MyPromise { PromiseState: 'fulfilled', PromiseResult: '成功' }

    const test2 = new MyPromise((resolve, reject) => {
    reject('失败')
    })
console.log(test2) // MyPromise { PromiseState: 'rejected', PromiseResult: '失败' }
```

### 2\. 状态不可变

其实上面的代码是有问题的，什么问题呢？看看：

```js
    const test1 = new MyPromise((resolve, reject) => {
    resolve('成功')
    reject('失败')
    })
console.log(test1) // MyPromise { PromiseState: 'rejected', PromiseResult: '失败' }
```

正确的应该是状态为`fulfilled`，结果是`成功`，这里明显没有`以第一次为准`

之前说了，Promise只以`第一次为准`，第一次成功就`永久`为`fulfilled`，第一次失败就永远状态为`rejected`，具体是什么流程呢？我给大家画了一张图：

Promise有三种状态：

*   `pending`：等待中，是初始状态
*   `fulfilled`：成功状态
*   `rejected`：失败状态

一旦状态从`pending`变为`fulfilled或者rejected`，那么此Promise实例的状态就定死了。 ![截屏2021-08-01 下午12.33.10.png](/images/jueJin/2c9636d819ef4bc.png)

其实实现起来也很容易，加个判断条件就行：

```js
    resolve(value) {
    // state是不可变的
    +        if (this.PromiseState !== 'pending') return
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = 'fulfilled'
    // 终值为传进来的值
    this.PromiseResult = value
}

    reject(reason) {
    // state是不可变的
    +        if (this.PromiseState !== 'pending') return
    // 如果执行reject，状态变为rejected
    this.PromiseState = 'rejected'
    // 终值为传进来的reason
    this.PromiseResult = reason
}
```

再来看看效果：

```js
    const test1 = new MyPromise((resolve, reject) => {
    // 只以第一次为准
    resolve('成功')
    reject('失败')
    })
console.log(test1) // MyPromise { PromiseState: 'fulfilled', PromiseResult: '成功' }
```

### 3\. throw

![截屏2021-08-01 下午12.57.17.png](/images/jueJin/fa2e17b24a124da.png)

Promise中有`throw`的话，就相当于执行了`reject`。这就要使用`try catch`了

```js
    +        try {
    // 执行传进来的函数
    executor(this.resolve, this.reject)
        +        } catch (e) {
        // 捕捉到错误直接执行reject
        +            this.reject(e)
    +        }
```

咱们来看看效果：

```js
    const test3 = new MyPromise((resolve, reject) => {
    throw('失败')
    })
console.log(test3) // MyPromise { PromiseState: 'rejected', PromiseResult: '失败' }
```

then
----

咱们平时使用then方法是这么用的：

```js
// 马上输出 ”成功“
    const p1 = new Promise((resolve, reject) => {
    resolve('成功')
    }).then(res => console.log(res), err => console.log(err))
    
    // 1秒后输出 ”失败“
        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => {
            reject('失败')
            }, 1000)
            }).then(res => console.log(res), err => console.log(err))
            
            // 链式调用 输出 200
                const p3 = new Promise((resolve, reject) => {
                resolve(100)
                }).then(res => 2 * res, err => console.log(err))
                .then(res => console.log(res), err => console.log(err))
```

可以总结出这几个知识点：

*   then接收两个回调，一个是`成功回调`，一个是`失败回调`
*   当Promise状态为`fulfilled`执行`成功回调`，为`rejected`执行`失败回调`
*   如resolve或reject在定时器里，`则定时器结束后再执行then`
*   then支持`链式调用`，下一次then执行`受上一次then返回值的影响`

下面咱们就一步一步地去实现他吧

### 1\. 实现then

```js
    then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected
    
    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    if (this.PromiseState === 'fulfilled') {
    // 如果当前为成功状态，执行第一个回调
    onFulfilled(this.PromiseResult)
        } else if (this.PromiseState === 'rejected') {
        // 如果当前为失败状态，执行第二哥回调
        onRejected(this.PromiseResult)
    }
    
}
```

咱们来看看效果：

```js
// 输出 ”成功“
    const test = new MyPromise((resolve, reject) => {
    resolve('成功')
    }).then(res => console.log(res), err => console.log(err))
```

### 2\. 定时器情况

上面我们已经实现了`then`的基本功能。那如果是`定时器`情况呢？

还是那个代码，怎么才能保证，1秒后才执行then里的失败回调呢？

```js
// 1秒后输出 ”成功“
    const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
        reject('失败')
        }, 1000)
        }).then(res => console.log(res), err => console.log(err))
```

我们不能确保1秒后才执行then函数，但是我们可以保证1秒后再执行then里的回调，可能这里大家有点懵逼，我同样用一张图给大家讲讲吧：

![截屏2021-08-01 下午9.05.24.png](/images/jueJin/6ba5a2544b11445.png)

也就是在这1秒时间内，我们可以先把then里的两个回调保存起来，然后等到1秒过后，执行了resolve或者reject，咱们再去判断状态，并且判断要去执行刚刚保存的两个回调中的哪一个回调。

那么问题来了，我们怎么知道当前1秒还没走完甚至还没开始走呢？其实很好判断，只要状态是`pending`，那就证明定时器还没跑完，因为如果定时器跑完的话，那状态肯定就不是`pending`，而是`fulfilled或者rejected`

那是用什么来保存这些回调呢？建议使用`数组`，因为一个promise实例可能会`多次then`，用数组就一个一个保存了

```js
    initValue() {
    // 初始化值
    this.PromiseResult = null // 终值
    this.PromiseState = 'pending' // 状态
    +        this.onFulfilledCallbacks = [] // 保存成功回调
    +        this.onRejectedCallbacks = [] // 保存失败回调
}

    resolve(value) {
    // state是不可变的
    if (this.PromiseState !== 'pending') return
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = 'fulfilled'
    // 终值为传进来的值
    this.PromiseResult = value
    // 执行保存的成功回调
        +        while (this.onFulfilledCallbacks.length) {
        +            this.onFulfilledCallbacks.shift()(this.PromiseResult)
    +        }
}

    reject(reason) {
    // state是不可变的
    if (this.PromiseState !== 'pending') return
    // 如果执行reject，状态变为rejected
    this.PromiseState = 'rejected'
    // 终值为传进来的reason
    this.PromiseResult = reason
    // 执行保存的失败回调
        +        while (this.onRejectedCallbacks.length) {
        +            this.onRejectedCallbacks.shift()(this.PromiseResult)
    +        }
}

    then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected
    
    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    if (this.PromiseState === 'fulfilled') {
    // 如果当前为成功状态，执行第一个回调
    onFulfilled(this.PromiseResult)
        } else if (this.PromiseState === 'rejected') {
        // 如果当前为失败状态，执行第二哥回调
        onRejected(this.PromiseResult)
            +        } else if (this.PromiseState === 'pending') {
            +            // 如果状态为待定状态，暂时保存两个回调
            +            this.onFulfilledCallbacks.push(onFulfilled.bind(this))
            +            this.onRejectedCallbacks.push(onRejected.bind(this))
        +        }
        
    }
    
```

加完上面的代码，咱们来看看定时器的效果吧：

```js
    const test2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
        resolve('成功') // 1秒后输出 成功
        // resolve('成功') // 1秒后输出 失败
        }, 1000)
        }).then(res => console.log(res), err => console.log(err))
```

### 3\. 链式调用

then支持`链式调用`，下一次then执行`受上一次then返回值的影响`，给大家举个例子：

```js
// 链式调用 输出 200
    const p3 = new Promise((resolve, reject) => {
    resolve(100)
    }).then(res => 2 * res, err => console.log(err))
    .then(res => console.log(res), err => console.log(err))
    
    // 链式调用 输出300
        const p4 = new Promise((resolve, reject) => {
        resolve(100)
        }).then(res => new Promise((resolve, reject) => resolve(3 * res)), err => console.log(err))
        .then(res => console.log(res), err => console.log(err))
```

从上方例子，我们可以获取到几个知识点：

*   1、then方法本身会返回一个新的Promise对象
*   2、如果返回值是promise对象，返回值为成功，新promise就是成功
*   3、如果返回值是promise对象，返回值为失败，新promise就是失败
*   4、如果返回值非promise对象，新promise对象就是成功，值为此返回值

咱们知道then是Promise上的方法，那如何实现then完还能再then呢？很简单，then执行后返回一个`Promise对象`就行了，就能保证then完还能继续执行then：

![截屏2021-08-01 下午9.06.02.png](/images/jueJin/62a3c3afcf0a426.png)

代码实现：

```js
    then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected
    
    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }


    var thenPromise = new MyPromise((resolve, reject) => {
    
        const resolvePromise = cb => {
            try {
            const x = cb(this.PromiseResult)
                if (x === thenPromise) {
                // 不能返回自身哦
                throw new Error('不能返回自身。。。')
            }
                if (x instanceof MyPromise) {
                // 如果返回值是Promise
                // 如果返回值是promise对象，返回值为成功，新promise就是成功
                // 如果返回值是promise对象，返回值为失败，新promise就是失败
                // 谁知道返回的promise是失败成功？只有then知道
                x.then(resolve, reject)
                    } else {
                    // 非Promise就直接成功
                    resolve(x)
                }
                    } catch (err) {
                    // 处理报错
                    reject(err)
                    throw new Error(err)
                }
            }
            
                if (this.PromiseState === 'fulfilled') {
                // 如果当前为成功状态，执行第一个回调
                resolvePromise(onFulfilled)
                    } else if (this.PromiseState === 'rejected') {
                    // 如果当前为失败状态，执行第二个回调
                    resolvePromise(onRejected)
                        } else if (this.PromiseState === 'pending') {
                        // 如果状态为待定状态，暂时保存两个回调
                        // 如果状态为待定状态，暂时保存两个回调
                        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
                    }
                    })
                    
                    // 返回这个包装的Promise
                    return thenPromise
                    
                }
```

现在大家可以试试效果怎么样了，大家要**边敲边试**哦：

```js
    const test3 = new Promise((resolve, reject) => {
    resolve(100) // 输出 状态：成功 值： 200
    // reject(100) // 输出 状态：成功 值：300
    }).then(res => 2 * res, err => 3 * err)
    .then(res => console.log('成功', res), err => console.log('失败', err))
    
    
        const test4 = new Promise((resolve, reject) => {
        resolve(100) // 输出 状态：失败 值：200
        // reject(100) // 输出 状态：成功 值：300
        // 这里可没搞反哦。真的搞懂了，就知道了为啥这里是反的
        }).then(res => new Promise((resolve, reject) => reject(2 * res)), err => new Promise((resolve, reject) => resolve(3 * err)))
        .then(res => console.log('成功', res), err => console.log('失败', err))
```

### 4\. 微任务

看过`js执行机制`的兄弟都知道，then方法是`微任务`，啥叫微任务呢？其实不知道也不要紧，我通过下面例子让你知道：

```js
    const p = new Promise((resolve, reject) => {
    resolve(1)
    }).then(res => console.log(res), err => console.log(err))
    
    console.log(2)
    
    输出顺序是 2 1
```

为啥不是 1 2 呢？因为then是个微任务啊。。。同样，我们也要给我们的MyPromise加上这个特性(我这里使用定时器，大家别介意哈)

只需要让`resolvePromise函数`异步执行就可以了

```js
    const resolvePromise = cb => {
        setTimeout(() => {
            try {
            const x = cb(this.PromiseResult)
                if (x === thenPromise) {
                // 不能返回自身哦
                throw new Error('不能返回自身。。。')
            }
                if (x instanceof MyPromise) {
                // 如果返回值是Promise
                // 如果返回值是promise对象，返回值为成功，新promise就是成功
                // 如果返回值是promise对象，返回值为失败，新promise就是失败
                // 谁知道返回的promise是失败成功？只有then知道
                x.then(resolve, reject)
                    } else {
                    // 非Promise就直接成功
                    resolve(x)
                }
                    } catch (err) {
                    // 处理报错
                    reject(err)
                    throw new Error(err)
                }
                })
            }
```

看看效果：

```js
    const test4 = new MyPromise((resolve, reject) => {
    resolve(1)
    }).then(res => console.log(res), err => console.log(err))
    
    console.log(2)
    
    输出顺序 2 1
    
```

其他方法
----

这些方法都比较简单，我就不太过详细地讲了，大家也可以借这个机会，自己摸索，巩固这篇文章的知识。

### all

*   接收一个Promise数组，数组中如有非Promise项，则此项当做成功
*   如果所有Promise都成功，则返回成功结果数组
*   如果有一个Promise失败，则返回这个失败结果

```js
    static all(promises) {
const result = []
let count = 0
    return new MyPromise((resolve, reject) => {
        const addData = (index, value) => {
        result[index] = value
        count++
        if (count === promises.length) resolve(result)
    }
        promises.forEach((promise, index) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                addData(index, res)
                }, err => reject(err))
                    } else {
                    addData(index, promise)
                }
                })
                })
            }
```

### race

*   接收一个Promise数组，数组中如有非Promise项，则此项当做成功
*   哪个Promise最快得到结果，就返回那个结果，无论成功失败

```js
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach(promise => {
                if (promise instanceof MyPromise) {
                    promise.then(res => {
                    resolve(res)
                        }, err => {
                        reject(err)
                        })
                            } else {
                            resolve(promise)
                        }
                        })
                        })
                    }
```

### allSettled

*   接收一个Promise数组，数组中如有非Promise项，则此项当做成功
*   把每一个Promise的结果，集合成数组，返回

```js
    static allSettled(promises) {
        return new Promise((resolve, reject) => {
    const res = []
    let count = 0
        const addData = (status, value, i) => {
            res[i] = {
            status,
            value
        }
        count++
            if (count === promises.length) {
            resolve(res)
        }
    }
        promises.forEach((promise, i) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                addData('fulfilled', res, i)
                    }, err => {
                    addData('rejected', err, i)
                    })
                        } else {
                        addData('fulfilled', promise, i)
                    }
                    })
                    })
                }
```

### any

any与all相反

*   接收一个Promise数组，数组中如有非Promise项，则此项当做成功
*   如果有一个Promise成功，则返回这个成功结果
*   如果所有Promise都失败，则报错

```js
    static any(promises) {
        return new Promise((resolve, reject) => {
        let count = 0
            promises.forEach((promise) => {
                promise.then(val => {
                resolve(val)
                    }, err => {
                    count++
                        if (count === promises.length) {
                        reject(new AggregateError('All promises were rejected'))
                    }
                    })
                    })
                    })
                }
            }
```

### 结语

再也不怕面试官问你Promise原理啦哈哈哈哈😁

如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。

**如果你想一起学习前端或者摸鱼，那你可以加我，加入我的摸鱼学习群，点击这里** ---> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

**如果你是有其他目的的，别加我，我不想跟你交朋友，我只想简简单单学习前端，不想搞一些有的没的！！！**