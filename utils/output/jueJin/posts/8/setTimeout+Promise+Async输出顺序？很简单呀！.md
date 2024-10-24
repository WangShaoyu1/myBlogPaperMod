---
author: "Sunshine_Lin"
title: "setTimeout+Promise+Async输出顺序？很简单呀！"
date: 2021-10-07
description: "本文已参与「掘力星计划」，赢取创作大礼包，挑战创作激励金。 前言 大家好，我是林三心，有关于EventLoop的知识点，在平时是考的非常多的，其实也跟我们日常的工作时息息相关的，懂得EventLoop"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:419,comments:31,collects:600,views:20857,"
---
本文已参与「[掘力星计划](https://juejin.cn/post/7012210233804079141/ "https://juejin.cn/post/7012210233804079141/")」，赢取创作大礼包，挑战创作激励金。

前言
--

大家好，我是林三心，有关于`EventLoop`的知识点，在平时是考的非常多的，其实也跟我们日常的工作时息息相关的，懂得`EventLoop`的执行顺序，可以大大帮助我们定位出问题出在哪。其实正常的`EventLoop`顺序是很容易分辨的，但是如果`setTimeout + Promise + async/await`联起手来是非常棘手的。今天我就带大家`过五关斩六将`，征服他们！！！

> 注明：本文不涉及Nodejs执行机制

同步 && 异步
--------

什么是异步，什么是同步，我不多说，我就通过小故事来讲讲吧。

*   `同步`：你打电话去书店订书，老板说我查查，你不挂电话在等待，老板把查到的结果告诉你，这期间你不能做自己的事情
*   `异步`：你打电话去书店订书，老板说我查查，回头告诉你，你把电话挂了，先去做自己的事情

JS执行机制
------

其实不难，JavaScript代码执行机制，我就归结为三句话

*   1、遇到`同步代码`直接执行
*   2、遇到`异步代码`先放一边，并且将他`回调函数`存起来，存的地方叫`事件队列`
*   3、等所有`同步代码`都执行完，再从`事件队列`中把存起来的所有`异步回调函数`拿出来按顺序执行

![截屏2021-10-04 下午8.11.18.png](/images/jueJin/c28a4485bb694c2.png)

请看以下例子

```js
console.log(1) // 同步
    setTimeout(() => {
    console.log(2) // 异步
    }, 2000);
    console.log(3) // 同步
        setTimeout(() => {
        console.log(4) // 异步
        }, 0);
        console.log(5) // 同步
        
        输出 ： 1 3 5 4 2
```

![截屏2021-10-04 下午9.11.39.png](/images/jueJin/a4b1c85d3a564fd.png)

宏任务 && 微任务
----------

前面说了，等所有同步代码都执行完，再从`事件队列`里依次执行所有`异步回调函数`。

其实`事件队列`也是一个小团体，人家也有自己的规则，这就类似于学校管理着许多社团，人家自己社团内部也有人家自己的规矩。

话说回来，为什么`事件队列`里需要有自己的规则呢？要不你先想想为什么学校里的社团里要有自己的规则要分等级，是因为有的人能力强有的人能力弱，所以也就有了等级的高低。其实`事件队列`也一样，`事件队列`是用来存异步回调的，但是异步也分类型啊，异步任务分为`宏任务`和`微任务`，并且**微任务执行时机先于宏任务**

那宏任务和微任务都分别有哪些呢？

### 宏任务

#

浏览器

Node

**I/O**

✅

✅

**setTimeout**

✅

✅

**setInterval**

✅

✅

**setImmediate**

❌

✅

**requestAnimationFrame**

✅

❌

### 微任务

#

浏览器

Node

**Promise.prototype.then catch finally**

✅

✅

**process.nextTick**

❌

✅

**MutationObserver**

✅

❌

### 执行流程

那就来说说整体的执行的流程吧

![截屏2021-10-05 下午4.37.02.png](/images/jueJin/df0c109150d3436.png)

### 例子

大家可以根据我的解题步骤去走，基本90%的题目都是没什么压力的！！！

*   1、标记区分异步和同步
*   2、异步中，标记区分宏任务和微任务
*   3、分轮数，一轮一轮慢慢走

```js
console.log(1) // 同步
    setTimeout(() => {
    console.log(2) // 异步：宏任务
    });
    console.log(3) // 同步
    Promise.resolve().then(()=>{ // 异步：微任务
    console.log(4)
    })
    console.log(5) // 同步
```

第一轮

*   说明：先把同步的执行输出
*   输出：1，3，5
*   产生宏任务：`setTimeout`，产生微任务：`Promise.prototype.then`

第二轮

*   说明：微任务先执行
*   输出：4
*   产生宏任务：无，产生微任务：无
*   剩余宏任务：`setTimeout`，剩余微任务：无

第三轮(结束)

*   说明：执行宏任务
*   输出：2
*   产生宏任务：无，产生微任务：无
*   剩余宏任务：无，剩余微任务：无

第一关
---

想一想我刚刚说的解题思路，大家可以按照那个思路来，这道题也就是分分钟的事情啦

```js
console.log(1)
    setTimeout(() => {
    console.log(2)
        Promise.resolve().then(() => {
        console.log(3)
        })
        });
        console.log(4)
            new Promise((resolve,reject) => {
            console.log(5)
            resolve()
                }).then(() => {
                console.log(6)
                    setTimeout(() => {
                    console.log(7)
                    })
                    })
                    console.log(8)
```

### 第一步：标记

> 注意：Promise的`executor`是同步的哦！！！

```js
console.log(1) // 同步
    setTimeout(() => {
    console.log(2) // 异步：宏任务 setTimeout1
    Promise.resolve().then(() => { // 异步：微任务 then1
    console.log(3)
    })
    });
    console.log(4) // 同步
        new Promise((resolve,reject) => {
        console.log(5) // 同步
        resolve()
        }).then(() => { // 异步：微任务 then2
        console.log(6)
            setTimeout(() => {
            console.log(7) // 异步：宏任务 setTimeout2
            })
            })
            console.log(8) // 同步
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行外层同步输出

1，4，5，8

宏任务：`setTimeout1`  
微任务：`then2`

宏任务：`setTimeout1`  
微任务：`then2`

第二轮

执行微任务`then2`

6

宏任务：`setTimeout2`  
微任务：无

宏任务：`setTimeout1，setTimeout2`  
微任务：无

第三轮

执行宏任务`setTimeout1`

2

宏任务：无  
微任务：`then1`

宏任务：`setTimeout2`  
微任务：`then1`

第四轮

执行微任务`then1`

3

宏任务：无  
微任务：无

宏任务：`setTimeout2`  
微任务：无

第五轮

执行宏任务`setTimeout2`

7

宏任务：无  
微任务：无

宏任务：无  
微任务：无

第二关
---

大家在遇到`Promise.then.then`这种时，如果有点懵逼的同学，可以转换一下，下面会说到

> 注意：`then`方法会自动返回一个新的`Promise`，也就是`return new Promise`，具体的`Promise源码`，大家可以看我这篇[看了就会，手写Promise原理，最通俗易懂的版本](https://juejin.cn/post/6994594642280857630 "https://juejin.cn/post/6994594642280857630")【阅读：1.1w，点赞：430】

```js
    setTimeout(() => {
    console.log(1)
    }, 0)
    console.log(2)
        const p = new Promise((resolve) => {
        console.log(3)
        resolve()
            }).then(() => {
            console.log(4)
                }).then(() => {
                console.log(5)
                })
                console.log(6)
```

### 第一步：标记 + 转换

> 注意：这里的转换，只针对做题时，比较好理解，平时不要这么转换，平时这么转换是不太合适的，是错的

```js
setTimeout(() => { // 异步：宏任务 setTimeout
console.log(1)
}, 0)
console.log(2) // 同步
const p = new Promise((resolve) => { // p 是 then1 执行返回的新 Promise
console.log(3) // 同步
resolve()
}).then(() => { // 异步：微任务 then1
console.log(4)
// 拿着 p 重新 then
p.then(() => { // 异步：微任务 then2
console.log(5)
})
})
console.log(6) // 同步 6
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行同步输出

2，3，6

宏任务：`setTimeout`  
微任务：`then1`

宏任务：`setTimeout`  
微任务：`then1`

第二轮

执行微任务`then1`

4

宏任务：无  
微任务：`then2`

宏任务：`setTimeout`  
微任务：`then2`

第三轮

执行微任务`then2`

5

宏任务：无  
微任务：无

宏任务：`setTimeout`  
微任务：无

第四轮

执行宏任务`setTimeout`

1

宏任务：无  
微任务：无

宏任务：无  
微任务：无

第三关
---

再说一遍：大家在遇到`Promise.then.then`这种时，如果有点懵逼的同学，可以转换一下

> 注意：`then`方法会自动返回一个新的`Promise`，也就是`return new Promise`，具体的`Promise源码`，大家可以看我这篇[看了就会，手写Promise原理，最通俗易懂的版本](https://juejin.cn/post/6994594642280857630 "https://juejin.cn/post/6994594642280857630")【阅读：1.1w，点赞：430】

```js
    new Promise((resolve,reject)=>{
    console.log(1)
    resolve()
        }).then(()=>{
        console.log(2)
            new Promise((resolve,reject)=>{
            console.log(3)
            resolve()
                }).then(()=>{
                console.log(4)
                    }).then(()=>{
                    console.log(5)
                    })
                        }).then(()=>{
                        console.log(6)
                        })
```

### 第一步：标记 + 转换

> 注意：这里的转换，只针对做题时，比较好理解，平时不要这么转换，平时这么转换是不太合适的，是错的

```js
const p1 = new Promise((resolve, reject) => { // p1 是 then1 执行返回的新 Promise
console.log(1) // 同步
resolve()
}).then(() => { // 异步：微任务 then1
console.log(2)
const p2 = new Promise((resolve, reject) => { // p2 是 then2 执行返回的新 Promise
console.log(3) // then1 里的 同步
resolve()
}).then(() => { // 异步：微任务 then2
console.log(4)

// 拿着 p2 重新 then
p2.then(() => { // 异步：微任务 then3
console.log(5)
})
})

// 拿着 p1 重新 then
p1.then(() => { // 异步：微任务 then4
console.log(6)
})
})
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行外层同步输出

1

宏任务：无  
微任务：`then1`

宏任务：无  
微任务：`then1`

第二轮

执行微任务`then1`

2，3

宏任务：无  
微任务：`then2、then4`

宏任务：无  
微任务：`then2、then4`

第三轮

执行微任务`then2，then4`

4，6

宏任务：无  
微任务：`then3`

宏任务：无  
微任务：`then3`

第四轮

执行微任务`then3`

5

宏任务：无  
微任务：无

宏任务：无  
微任务：无

第四关
---

这一关，比上一关多了一个`return`

前面说了，`then`方法会自动返回一个新的`Promise`，相当于`return new Promise`，但是如果你手动写了`return Promise`，那`return`的就是你手动写的这个`Promise`

```js
    new Promise((resolve, reject) => {
    console.log(1)
    resolve()
        }).then(() => {
        console.log(2)
        // 多了个return
            return new Promise((resolve, reject) => {
            console.log(3)
            resolve()
                }).then(() => {
                console.log(4)
                }).then(() => { // 相当于return了这个then的执行返回Promise
                console.log(5)
                })
                    }).then(() => {
                    console.log(6)
                    })
```

### 第一步：标记 + 转换

由于`return`的是`then3`执行返回的`Promise`，所以`then4`其实是`then3Promise.then()`，所以可转换为`then3.then4`

```js
    new Promise((resolve, reject) => {
    console.log(1) // 同步
    resolve()
    }).then(() => { // 异步：微任务 then1
    console.log(2) // then1 中的 同步
        new Promise((resolve, reject) => {
        console.log(3) // then1 中的 同步
        resolve()
        }).then(() => { // 异步：微任务 then2
        console.log(4)
        }).then(() => { // 异步：微任务 then3
        console.log(5)
        }).then(() => { // 异步：微任务 then4
        console.log(6)
        })
        })
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行外层同步输出

1

宏任务：无  
微任务：`then1`

宏任务：无  
微任务：`then1`

第二轮

执行微任务`then1`

2，3

宏任务：无  
微任务：`then2、then3、then4`

宏任务：无  
微任务：`then2、then3、then4`

第三轮

执行微任务`then2、then3、then4`

4，5，6

宏任务：无  
微任务：无

宏任务：无  
微任务：无

第五关
---

```js
    new Promise((resolve, reject) => {
    console.log(1)
    resolve()
        }).then(() => {
        console.log(2)
            new Promise((resolve, reject) => {
            console.log(3)
            resolve()
                }).then(() => {
                console.log(4)
                    }).then(() => {
                    console.log(5)
                    })
                        }).then(() => {
                        console.log(6)
                        })
                            new Promise((resolve, reject) => {
                            console.log(7)
                            resolve()
                                }).then(() => {
                                console.log(8)
                                })
```

### 第一步：标记 + 转换

```js
const p1 = new Promise((resolve, reject) => { // p1 是 then1 执行返回的新 Promise
console.log(1) // 同步
resolve()
}).then(() => { // 异步：微任务 then1
console.log(2)
const p2 = new Promise((resolve, reject) => { // p2 是 then2 执行返回的新 Promise
console.log(3) // then1 里的 同步
resolve()
}).then(() => { // 异步：微任务 then2
console.log(4)

// 拿着 p2 重新 then
p2.then(() => { // 异步：微任务 then3
console.log(5)
})
})

// 拿着 p1 重新 then
p1.then(() => { // 异步：微任务 then4
console.log(6)
})
})

    new Promise((resolve, reject) => {
    console.log(7) // 同步
    resolve()
    }).then(() => {  // 异步：微任务 then5
    console.log(8)
    })
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行外层同步输出

1，7

宏任务：无  
微任务：`then1、then5`

宏任务：无  
微任务：`then1、then5`

第二轮

执行微任务`then1、then5`

2，3，8

宏任务：无  
微任务：`then2、then4`

宏任务：无  
微任务：`then2、then4`

第三轮

执行微任务`then2、then4`

4，6

宏任务：无  
微任务：`then3`

宏任务：无  
微任务：`then3`

第四轮

执行微任务`then3`

5

宏任务：无  
微任务：无

宏任务：无  
微任务：无

第六关
---

其实`async/await`的内部实现原理，是依赖于`Promise.prototype.then`的不断嵌套，它在题中也是可以转换的，下面会讲到。

> 有兴趣的朋友可以看我这篇[7张图，20分钟就能搞定的async/await原理！为什么要拖那么久](https://juejin.cn/post/7007031572238958629 "https://juejin.cn/post/7007031572238958629")【阅读量：1.8w，点赞：571】

```js
    async function async1() {
    console.log(1);
    await async2();
    console.log(2);
}
    async function async2() {
    console.log(3);
}
console.log(4);
    setTimeout(function () {
    console.log(5);
    });
    async1()
        new Promise(function (resolve, reject) {
        console.log(6);
        resolve();
            }).then(function () {
            console.log(7);
            });
            console.log(8);
```

### 第一步：标记 + 转换

> 注意：这里的转换，只针对做题时，比较好理解，平时不要这么转换，平时这么转换是不太合适的

```js
console.log(4); // 同步
    setTimeout(function () {
    console.log(5); // 异步：宏任务 setTimeout
    });
    
    // async1函数可转换成
    console.log(1) // 同步
        new Promise((resolve, reject) => {
        console.log(3) // 同步
        resolve()
        }).then(() => { // 异步：微任务 then1
        console.log(2)
        })
        // async1函数结束
        
            new Promise(function (resolve, reject) {
            console.log(6); // 同步
            resolve();
            }).then(function () { // 异步：微任务 then2
            console.log(7);
            });
            console.log(8); // 同步
```

### 第二步：分轮

轮数

说明

输出

产生

剩余

第一轮

执行同步输出

4，1，3，6，8

宏任务：`setTimeout`  
微任务：`then1、then2`

宏任务：`setTimeout`  
微任务：`then1、then2`

第二轮

执行微任务`then1、then2`

2，7

宏任务：无  
微任务：无

宏任务：`setTimeout`  
微任务：无

第三轮

执行宏任务`setTimeout`

5

宏任务：无  
微任务：`then5`

宏任务：无  
微任务：无

课后作业
----

最后给大家布置两道作业，帮大家巩固一下本文章所学的知识，大家也可以加入我的摸鱼群，进行`答案`的讨论。进群点击这里[进群](https://juejin.cn/pin/6969565162885873701 "https://juejin.cn/pin/6969565162885873701")，目前已有将近`1000人`加入学习，我会定时举办`学习分享，模拟面试`等学习活动，一起学习，共同进步！！！

### 第一题（思考题）

想一想下面这两个有什么区别？

```js
// 第一种
    const p = new Promise((resolve, reject) => {
    resolve()
    }).then(() => console.log(1)).then(() => console.log(2))
    
    // 第二种
        const p = new Promise((resolve, reject) => {
        resolve()
        })
        p.then(() => console.log(1))
        p.then(() => console.log(2))
```

### 第二题（问题不大）

```js
    async function async1() {
    console.log(1);
    await async2();
    console.log(2);
}
    async function async2() {
    console.log(3);
}

    new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve()
        console.log(4)
        }, 1000);
            }).then(() => {
            console.log(5)
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    async1()
                    resolve()
                    console.log(6)
                    }, 1000)
                        }).then(() => {
                        console.log(7)
                            }).then(() => {
                            console.log(8)
                            })
                                }).then(() => {
                                console.log(9)
                                })
                                    new Promise((resolve, reject) => {
                                    console.log(10)
                                        setTimeout(() => {
                                        resolve()
                                        console.log(11)
                                        }, 3000);
                                            }).then(() => {
                                            console.log(12)
                                            })
```

### 第三题（有点难度）

这道题能`一分钟内`做出来的找我领奖，这道题需要具备一定的`Promise原理基础 + async/await原理基础`才能比较轻松的答对，有兴趣的同学可以看我之前写过的文章

*   [看了就会，手写Promise原理，最通俗易懂的版本](https://juejin.cn/post/6994594642280857630 "https://juejin.cn/post/6994594642280857630")【阅读：1.1w，点赞：430】
*   [7张图，20分钟就能搞定的async/await原理！为什么要拖那么久](https://juejin.cn/post/7007031572238958629 "https://juejin.cn/post/7007031572238958629")【阅读量：1.8w，点赞：571】

```js
    async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

    async function async2() {
    console.log('async start')
        return new Promise((resolve, reject) => {
        resolve()
        console.log('async2 promise')
        })
    }
    
    console.log('script start')
        setTimeout(() => {
        console.log('setTimeout')
        }, 0);
        
        async1()
        
            new Promise((resolve) => {
            console.log('promise1')
            resolve()
                }).then(() => {
                console.log('promise2')
                    }).then(() => {
                    console.log('promise3')
                    })
                    console.log('script end')
```

结语
--

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645