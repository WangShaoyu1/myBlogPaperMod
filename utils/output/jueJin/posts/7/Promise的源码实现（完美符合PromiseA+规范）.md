---
author: "无名之苝"
title: "Promise的源码实现（完美符合PromiseA+规范）"
date: 2019-03-13
description: "Promise是前端面试中的高频问题，我作为面试官的时候，问Promise的概率超过90%，据我所知，大多数公司，都会问一些关于Promise的问题。如果你能根据PromiseA+的规范，写出符合规范的源码，那么我想，对于面试中的Promise相关的问题，都能够给出比较完美的答…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:238,comments:0,collects:329,views:24749,"
---
Promise是前端面试中的高频问题，我作为面试官的时候，问Promise的概率超过90%，据我所知，大多数公司，都会问一些关于Promise的问题。如果你能根据PromiseA+的规范，写出符合规范的源码，那么我想，对于面试中的Promise相关的问题，都能够给出比较完美的答案。

我的建议是，对照规范多写几次实现，也许第一遍的时候，是改了多次，才能通过测试，那么需要反复的写，我已经将Promise的源码实现写了不下七遍。

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

Promise的源码实现
------------

```
/**
* 1. new Promise时，需要传递一个 executor 执行器，执行器立刻执行
* 2. executor 接受两个参数，分别是 resolve 和 reject
* 3. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
* 4. promise 的状态一旦确认，就不会再改变
* 5. promise 都有 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled,
*      和 promise 失败的回调 onRejected
* 6. 如果调用 then 时，promise已经成功，则执行 onFulfilled，并将promise的值作为参数传递进去。
*      如果promise已经失败，那么执行 onRejected, 并将 promise 失败的原因作为参数传递进去。
*      如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次将对应的函数执行(发布订阅)
* 7. then 的参数 onFulfilled 和 onRejected 可以缺省
* 8. promise 可以then多次，promise 的then 方法返回一个 promise
* 9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调(onFulfilled)
* 10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
* 11.如果 then 返回的是一个promise，那么会等这个promise执行完，promise如果成功，
*   就走下一个then的成功，如果失败，就走下一个then的失败
*/

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
    function Promise(executor) {
    let self = this;
    self.status = PENDING;
    self.onFulfilled = [];//成功的回调
    self.onRejected = []; //失败的回调
    //PromiseA+ 2.1
        function resolve(value) {
            if (self.status === PENDING) {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilled.forEach(fn => fn());//PromiseA+ 2.2.6.1
        }
    }
    
        function reject(reason) {
            if (self.status === PENDING) {
            self.status = REJECTED;
            self.reason = reason;
            self.onRejected.forEach(fn => fn());//PromiseA+ 2.2.6.2
        }
    }
    
        try {
        executor(resolve, reject);
            } catch (e) {
            reject(e);
        }
    }
    
        Promise.prototype.then = function (onFulfilled, onRejected) {
        //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        let self = this;
        //PromiseA+ 2.2.7
            let promise2 = new Promise((resolve, reject) => {
                if (self.status === FULFILLED) {
                //PromiseA+ 2.2.2
                //PromiseA+ 2.2.4 --- setTimeout
                    setTimeout(() => {
                        try {
                        //PromiseA+ 2.2.7.1
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                            } catch (e) {
                            //PromiseA+ 2.2.7.2
                            reject(e);
                        }
                        });
                            } else if (self.status === REJECTED) {
                            //PromiseA+ 2.2.3
                                setTimeout(() => {
                                    try {
                                    let x = onRejected(self.reason);
                                    resolvePromise(promise2, x, resolve, reject);
                                        } catch (e) {
                                        reject(e);
                                    }
                                    });
                                        } else if (self.status === PENDING) {
                                            self.onFulfilled.push(() => {
                                                setTimeout(() => {
                                                    try {
                                                    let x = onFulfilled(self.value);
                                                    resolvePromise(promise2, x, resolve, reject);
                                                        } catch (e) {
                                                        reject(e);
                                                    }
                                                    });
                                                    });
                                                        self.onRejected.push(() => {
                                                            setTimeout(() => {
                                                                try {
                                                                let x = onRejected(self.reason);
                                                                resolvePromise(promise2, x, resolve, reject);
                                                                    } catch (e) {
                                                                    reject(e);
                                                                }
                                                                });
                                                                });
                                                            }
                                                            });
                                                            return promise2;
                                                        }
                                                        
                                                            function resolvePromise(promise2, x, resolve, reject) {
                                                            let self = this;
                                                            //PromiseA+ 2.3.1
                                                                if (promise2 === x) {
                                                                reject(new TypeError('Chaining cycle'));
                                                            }
                                                                if (x && typeof x === 'object' || typeof x === 'function') {
                                                                let used; //PromiseA+2.3.3.3.3 只能调用一次
                                                                    try {
                                                                    let then = x.then;
                                                                        if (typeof then === 'function') {
                                                                        //PromiseA+2.3.3
                                                                            then.call(x, (y) => {
                                                                            //PromiseA+2.3.3.1
                                                                            if (used) return;
                                                                            used = true;
                                                                            resolvePromise(promise2, y, resolve, reject);
                                                                                }, (r) => {
                                                                                //PromiseA+2.3.3.2
                                                                                if (used) return;
                                                                                used = true;
                                                                                reject(r);
                                                                                });
                                                                                
                                                                                    }else{
                                                                                    //PromiseA+2.3.3.4
                                                                                    if (used) return;
                                                                                    used = true;
                                                                                    resolve(x);
                                                                                }
                                                                                    } catch (e) {
                                                                                    //PromiseA+ 2.3.3.2
                                                                                    if (used) return;
                                                                                    used = true;
                                                                                    reject(e);
                                                                                }
                                                                                    } else {
                                                                                    //PromiseA+ 2.3.3.4
                                                                                    resolve(x);
                                                                                }
                                                                            }
                                                                            
                                                                            module.exports = Promise;
                                                                            
```

有专门的测试脚本可以测试所编写的代码是否符合PromiseA+的规范。

首先，在promise实现的代码中，增加以下代码:

```

    Promise.defer = Promise.deferred = function () {
    let dfd = {};
        dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
        });
        return dfd;
    }
```

安装测试脚本:

```
npm install -g promises-aplus-tests
```

如果当前的promise源码的文件名为promise.js

那么在对应的目录执行以下命令:

```
promises-aplus-tests promise.js
```

promises-aplus-tests中共有872条测试用例。以上代码，可以完美通过所有用例。

**对上面的代码实现做一点简要说明(其它一些内容注释中已经写得很清楚):**

1.  onFulfilled 和 onFulfilled的调用需要放在setTimeout，因为规范中表示: onFulfilled or onRejected must not be called until the execution context stack contains only platform code。使用setTimeout只是模拟异步，原生Promise并非是这样实现的。
    
2.  在 resolvePromise 的函数中，为何需要usedd这个flag,同样是因为规范中明确表示: If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored. 因此我们需要这样的flag来确保只会执行一次。
    
3.  self.onFulfilled 和 self.onRejected 中存储了成功的回调和失败的回调，根据规范2.6显示，当promise从pending态改变的时候，需要按照顺序去指定then对应的回调。
    

PromiseA+的规范(翻译版)
-----------------

PS: 下面是我翻译的规范，供参考

> 术语

1.  promise 是一个有then方法的对象或者是函数，行为遵循本规范
2.  thenable 是一个有then方法的对象或者是函数
3.  value 是promise状态成功时的值，包括 undefined/thenable或者是 promise
4.  exception 是一个使用throw抛出的异常值
5.  reason 是promise状态失败时的值

> 要求

#### 2.1 Promise States

Promise 必须处于以下三个状态之一: pending, fulfilled 或者是 rejected

##### 2.1.1 如果promise在pending状态

```accesslog
2.1.1.1 可以变成 fulfilled 或者是 rejected
```

##### 2.1.2 如果promise在fulfilled状态

```accesslog
2.1.2.1 不会变成其它状态

2.1.2.2 必须有一个value值
```

##### 2.1.3 如果promise在rejected状态

```accesslog
2.1.3.1 不会变成其它状态

2.1.3.2 必须有一个promise被reject的reason
```

概括即是:promise的状态只能从pending变成fulfilled，或者从pending变成rejected.promise成功，有成功的value.promise失败的话，有失败的原因

#### 2.2 then方法

promise必须提供一个then方法，来访问最终的结果

promise的then方法接收两个参数

```
promise.then(onFulfilled, onRejected)
```

##### 2.2.1 onFulfilled 和 onRejected 都是可选参数

```accesslog
2.2.1.1 onFulfilled 必须是函数类型

2.2.1.2 onRejected 必须是函数类型
```

##### 2.2.2 如果 onFulfilled 是函数:

```accesslog
2.2.2.1 必须在promise变成 fulfilled 时，调用 onFulfilled，参数是promise的value
2.2.2.2 在promise的状态不是 fulfilled 之前，不能调用
2.2.2.3 onFulfilled 只能被调用一次
```

##### 2.2.3 如果 onRejected 是函数:

```accesslog
2.2.3.1 必须在promise变成 rejected 时，调用 onRejected，参数是promise的reason
2.2.3.2 在promise的状态不是 rejected 之前，不能调用
2.2.3.3 onRejected 只能被调用一次
```

##### 2.2.4 onFulfilled 和 onRejected 应该是微任务

##### 2.2.5 onFulfilled 和 onRejected 必须作为函数被调用

##### 2.2.6 then方法可能被多次调用

```accesslog
2.2.6.1 如果promise变成了 fulfilled态，所有的onFulfilled回调都需要按照then的顺序执行
2.2.6.2 如果promise变成了 rejected态，所有的onRejected回调都需要按照then的顺序执行
```

##### 2.2.7 then必须返回一个promise

```
promise2 = promise1.then(onFulfilled, onRejected);
``````accesslog
2.2.7.1 onFulfilled 或 onRejected 执行的结果为x,调用 resolvePromise
2.2.7.2 如果 onFulfilled 或者 onRejected 执行时抛出异常e,promise2需要被reject
2.2.7.3 如果 onFulfilled 不是一个函数，promise2 以promise1的值fulfilled
2.2.7.4 如果 onRejected 不是一个函数，promise2 以promise1的reason rejected
```

#### 2.3 resolvePromise

resolvePromise(promise2, x, resolve, reject)

##### 2.3.1 如果 promise2 和 x 相等，那么 reject promise with a TypeError

##### 2.3.2 如果 x 是一个 promsie

```accesslog
2.3.2.1 如果x是pending态，那么promise必须要在pending,直到 x 变成 fulfilled or rejected.
2.3.2.2 如果 x 被 fulfilled, fulfill promise with the same value.
2.3.2.3 如果 x 被 rejected, reject promise with the same reason.
```

##### 2.3.3 如果 x 是一个 object 或者 是一个 function

```accesslog
2.3.3.1 let then = x.then.
2.3.3.2 如果 x.then 这步出错，那么 reject promise with e as the reason..
2.3.3.3 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
2.3.3.3.1 resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
2.3.3.3.2 rejectPromise 的 入参是 r, reject promise with r.
2.3.3.3.3 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
2.3.3.3.4 如果调用then抛出异常e
2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
2.3.3.3.4.3 否则，reject promise with e as the reason
2.3.3.4 如果 then 不是一个function. fulfill promise with x.
```

##### 2.3.4 如果 x 不是一个 object 或者 function，fulfill promise with x.

Promise的其他方法
------------

虽然上述的promise源码已经符合PromiseA+的规范，但是原生的Promise还提供了一些其他方法，如:

1.  Promise.resolve()
2.  Promise.reject()
3.  Promise.prototype.catch()
4.  Promise.prototype.finally()
5.  Promise.all()
6.  Promise.race()

下面具体说一下每个方法的实现:

> ### Promise.resolve

Promise.resolve(value) 返回一个以给定值解析后的Promise 对象.

1.  如果 value 是个 thenable 对象，返回的promise会“跟随”这个thenable的对象，采用它的最终状态
2.  如果传入的value本身就是promise对象，那么Promise.resolve将不做任何修改、原封不动地返回这个promise对象。
3.  其他情况，直接返回以该值为成功状态的promise对象。

```
    Promise.resolve = function (param) {
        if (param instanceof Promise) {
        return param;
    }
        return new Promise((resolve, reject) => {
            if (param && typeof param === 'object' && typeof param.then === 'function') {
                setTimeout(() => {
                param.then(resolve, reject);
                });
                    } else {
                    resolve(param);
                }
                });
            }
```

thenable对象的执行加 setTimeout的原因是根据原生Promise对象执行的结果推断的，如下的测试代码，原生的执行结果为: 20 400 30;为了同样的执行顺序，增加了setTimeout延时。

测试代码:

```
let p = Promise.resolve(20);
    p.then((data) => {
    console.log(data);
    });
    
    
        let p2 = Promise.resolve({
            then: function(resolve, reject) {
            resolve(30);
        }
        });
        
            p2.then((data)=> {
            console.log(data)
            });
            
                let p3 = Promise.resolve(new Promise((resolve, reject) => {
                resolve(400)
                }));
                    p3.then((data) => {
                    console.log(data)
                    });
```

> ### Promise.reject

Promise.reject方法和Promise.resolve不同，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。

```
    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => {
        reject(reason);
        });
    }
```

> ### Promise.prototype.catch

Promise.prototype.catch 用于指定出错时的回调，是特殊的then方法，catch之后，可以继续 .then

```
    Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
```

> ### Promise.prototype.finally

不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then.

```
    Promise.prototype.finally = function (callback) {
        return this.then((value) => {
            return Promise.resolve(callback()).then(() => {
            return value;
            });
                }, (err) => {
                    return Promise.resolve(callback()).then(() => {
                    throw err;
                    });
                    });
                }
```

> ### Promise.all

Promise.all(promises) 返回一个promise对象

1.  如果传入的参数是一个空的可迭代对象，那么此promise对象回调完成(resolve),只有此情况，是同步执行的，其它都是异步返回的。
2.  如果传入的参数不包含任何 promise，则返回一个异步完成.
3.  promises 中所有的promise都promise都“完成”时或参数中不包含 promise 时回调完成。
4.  如果参数中有一个promise失败，那么Promise.all返回的promise对象失败
5.  在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组

```
    Promise.all = function (promises) {
    promises = Array.from(promises);//将可迭代对象转换为数组
        return new Promise((resolve, reject) => {
        let index = 0;
        let result = [];
            if (promises.length === 0) {
            resolve(result);
                } else {
                    function processValue(i, data) {
                    result[i] = data;
                        if (++index === promises.length) {
                        resolve(result);
                    }
                }
                    for (let i = 0; i < promises.length; i++) {
                    //promises[i] 可能是普通值
                        Promise.resolve(promises[i]).then((data) => {
                        processValue(i, data);
                            }, (err) => {
                            reject(err);
                            return;
                            });
                        }
                    }
                    });
                }
```

测试代码:

```
    var promise1 = new Promise((resolve, reject) => {
    resolve(3);
    })
    var promise2 = 42;
        var promise3 = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100, 'foo');
        });
        
            Promise.all([promise1, promise2, promise3]).then(function(values) {
        console.log(values); //[3, 42, 'foo']
            },(err)=>{
            console.log(err)
            });
            
            var p = Promise.all([]); // will be immediately resolved
            var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
            console.log(p);
            console.log(p2)
                setTimeout(function(){
                console.log('the stack is now empty');
                console.log(p2);
                });
```

> ### Promise.race

Promise.race函数返回一个 Promise，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。

如果传的参数数组是空，则返回的 promise 将永远等待。

如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。

```
    Promise.race = function (promises) {
    promises = Array.from(promises);//将可迭代对象转换为数组
        return new Promise((resolve, reject) => {
            if (promises.length === 0) {
            return;
                } else {
                    for (let i = 0; i < promises.length; i++) {
                        Promise.resolve(promises[i]).then((data) => {
                        resolve(data);
                        return;
                            }, (err) => {
                            reject(err);
                            return;
                            });
                        }
                    }
                    });
                }
```

测试代码:

```
    Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    undefined,
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
        ]).then((data) => {
        console.log('success ', data);
            }, (err) => {
            console.log('err ',err);
            });
            
                Promise.race([
                new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
                new Promise((resolve, reject) => { setTimeout(() => { resolve(200) }, 200) }),
                new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
                    ]).then((data) => {
                    console.log(data);
                        }, (err) => {
                        console.log(err);
                        });
```

### 感谢指出，增加参考链接

*   [Promise A+ 规范](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com%2F "https://promisesaplus.com/")
*   ES6 Promise的文档([es6.ruanyifeng.com/#docs/promi…](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fpromise "http://es6.ruanyifeng.com/#docs/promise"))
*   Promise MDN 文档([developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise"))

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)