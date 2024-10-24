---
author: "yck"
title: "Promise 你真的用明白了么？"
date: 2020-09-07
description: "文章首发自笔者的 Github。 Promise 关于 API 这块大家应该都能熟练使用，但是和微任务相关的你可能还存在知识盲区。 在开始正文前，我们先把本文涉及到的一些内容提前定个基调。 Promise 中只有涉及到状态变更后才需要被执行的回调才算是微任务，比如说 then、…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:378,comments:64,collects:475,views:22851,"
---
**文章首发自笔者的 [Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F34 "https://github.com/KieSun/Dream/issues/34")。**

Promise 关于 API 这块大家应该都能熟练使用，但是和微任务相关的你可能还存在知识盲区。

前置知识
----

在开始正文前，我们先把本文涉及到的一些内容提前定个基调。

### Promise 哪些 API 涉及了微任务？

Promise 中只有涉及到状态变更后才需要被执行的回调才算是微任务，比如说 `then`、 `catch` 、`finally` ，其他所有的代码执行都是宏任务（同步执行）。

![](/images/jueJin/8b9a9112afb3444.png)

上图中蓝色为同步执行，黄色为异步执行（丢到微任务队列中）。

### 这些微任务何时被加入微任务队列？

这个问题我们根据 ecma 规范来看：

*   如果此时 Promise 状态为 pending，那么成功或失败的回调会分别被加入至 `[[PromiseFulfillReactions]]` 和 `[[PromiseRejectReactions]]` 中。如果你看过手写 Promise 的代码的话，应该能发现有两个数组存储这些回调函数。
    
*   如果此时 Promise 状态为非 pending 时，回调会成为 Promise Jobs，也就是微任务。
    

**了解完以上知识后，正片开始。**

同一个 then，不同的微任务执行
-----------------

初级
--

```JavaScript
Promise.resolve()
    .then(() => {
    console.log("then1");
        Promise.resolve().then(() => {
        console.log("then1-1");
        });
        })
            .then(() => {
            console.log("then2");
            });
```

以上代码大家应该都能得出正确的答案：`then1 → then1-1 → then2`。

虽然 `then` 是同步执行，并且状态也已经变更。但这并不代表每次遇到 `then` 时我们都需要把它的回调丢入微任务队列中，而是等待 `then` 的回调执行完毕后再根据情况执行对应操作。

基于此，我们可以得出第一个结论：**链式调用中，只有前一个 **`then`** 的回调执行完毕后，跟着的 **`then`** 中的回调才会被加入至微任务队列。**

中级
--

大家都知道了 `Promise resolve` 后，跟着的 `then` 中的回调会马上进入微任务队列。

那么以下代码你认为的输出会是什么？

```JavaScript
let p = Promise.resolve();

    p.then(() => {
    console.log("then1");
        Promise.resolve().then(() => {
        console.log("then1-1");
        });
            }).then(() => {
            console.log("then1-2");
            });
            
                p.then(() => {
                console.log("then2");
                });
```

按照一开始的认知我们不难得出 `then2` 会在 `then1-1` 后输出，但是实际情况却是相反的。

基于此我们得出第二个结论：**每个链式调用的开端会首先依次进入微任务队列。**

接下来我们换个写法：

```JavaScript
    let p = Promise.resolve().then(() => {
    console.log("then1");
        Promise.resolve().then(() => {
        console.log("then1-1");
        });
            }).then(() => {
            console.log("then2");
            });
            
                p.then(() => {
                console.log("then3");
                });
```

上述代码其实有个陷阱，`then` 每次都会返回一个新的 Promise，此时的 `p` 已经不是 `Promise.resolve()` 生成的，而是最后一个 `then` 生成的，因此 `then3` 应该是在 `then2` 后打印出来的。

顺便我们也可以把之前得出的结论优化为：**同一个 Promise 的每个链式调用的开端会首先依次进入微任务队列。**

高级
--

以下大家可以猜猜 `then1-2` 会在何时打印出来？

```JavaScript
Promise.resolve()
    .then(() => {
    console.log("then1");
    Promise.resolve()
        .then(() => {
        console.log("then1-1");
        return 1;
        })
            .then(() => {
            console.log("then1-2");
            });
            })
                .then(() => {
                console.log("then2");
                })
                    .then(() => {
                    console.log("then3");
                    })
                        .then(() => {
                        console.log("then4");
                        });
```

这题肯定是简单的，记住第一个结论就能得出答案，以下是解析：

*   第一次 `resolve` 后第一个 `then` 的回调进入微任务队列并执行，打印 `then1`
    
*   第二次 `resolve` 后内部第一个 `then` 的回调进入微任务队列，此时外部第一个 `then` 的回调全部执行完毕，需要将外部的第二个 `then` 回调也插入微任务队列。
    
*   执行微任务，打印 `then1-1` 和 `then2`，然后分别再将之后 `then` 中的回调插入微任务队列
    
*   执行微任务，打印 `then1-2` 和 `then3` ，之后的内容就不一一说明了
    

接下来我们把 `return 1` 修改一下，结果可就大不相同啦：

```JavaScript
Promise.resolve()
    .then(() => {
    console.log("then1");
    Promise.resolve()
        .then(() => {
        console.log("then1-1");
        return Promise.resolve();
        })
            .then(() => {
            console.log("then1-2");
            });
            })
                .then(() => {
                console.log("then2");
                })
                    .then(() => {
                    console.log("then3");
                    })
                        .then(() => {
                        console.log("then4");
                        });
```

当我们 `return Promise.resolve()` 时，你猜猜 `then1-2` 会何时打印了？

**答案是最后一个才被打印出来。**

为什么在 `then` 中分别 `return` 不同的东西，微任务的执行顺序竟有如此大的变化？以下是笔者的解析。

**PS：**`then`\*\* 返回一个新的 Promise，并且会用这个 Promise 去 `resolve` 返回值，这个概念需要大家先了解一下。\*\*

### 根据 Promise A+ 规范

根据规范 [2.3.2](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com%2F%23point-49 "https://promisesaplus.com/#point-49")，如果 `resolve` 了一个 Promise，需要为其加上一个 `then` 并 `resolve`。

```JavaScript
    if (x instanceof MyPromise) {
        if (x.currentState === PENDING) {
            } else {
            x.then(resolve, reject);
        }
        return;
    }
```

上述代码节选自手写 Promise 实现。

那么根据 A+ 规范来说，如果我们在 `then` 中返回了 `Promise.resolve` 的话会多入队一次微任务，但是这个结论还是与实际不符的，因此我们还需要寻找其他权威的文档。

### 根据 ECMA - 262 规范

根据规范 [25.6.1.3.2](https://link.juejin.cn?target=https%3A%2F%2Fwww.ecma-international.org%2Fecma-262%2F%23sec-promise-resolve-functions "https://www.ecma-international.org/ecma-262/#sec-promise-resolve-functions")，当 `Promise resolve` 了一个 Promise 时，会产生一个NewPromiseResolveThenableJob，这是属于 Promise Jobs 中的一种，也就是微任务。

> This Job uses the supplied thenable and its then method to resolve the given promise. This process must take place as a Job to ensure that the evaluation of the then method occurs after evaluation of any surrounding code has completed.

并且该 Jobs 还会调用一次 `then` 函数来 `resolve Promise`，这也就又生成了一次微任务。

这就是为什么会触发两次微任务的来源。

最后
--

文章到这里就完结了，大家有什么疑问都可以在评论区提出。