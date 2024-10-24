---
author: "Gaby"
title: "面试必备 JavaScript Promise 专题"
date: 2021-08-23
description: "Promise是抽象异步处理对象以及对其进行各种操作的组件。 其详细内容在接下来我们还会进行介绍，Promise并不是从JavaScript中发祥的概念。"
tags: ["面试","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:26,comments:0,collects:57,views:5899,"
---
**这是我参与8月更文挑战的第21天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

* * *

### 什么是Promise

Promise是抽象异步处理对象以及对其进行各种操作的组件。 其详细内容在接下来我们还会进行介绍，Promise并不是从JavaScript中发祥的概念。

如果说到基于JavaScript的异步处理，我想大多数都会想到利用回调函数。

```js
// 使用了回调函数的异步处理
    getAsync("fileA.txt", function(error, result){
    if(error){// 取得失败时的处理
    throw error;
}
// 取得成功时的处理
});
//<1> 传给回调函数的参数为(error对象， 执行结果)组合
```

Promise则是把类似的异步处理对象和处理规则进行规范化， 并按照采用统一的接口来编写，而采取规定方法之外的写法都会出错。

```js
//下面是使用了Promise进行异步处理的一个例子
var promise = getAsyncPromise("fileA.txt");
    promise.then(function(result){
    // 获取文件内容成功时的处理
        }).catch(function(error){
        // 获取文件内容失败时的处理
        });
        //<1> 返回promise对象
```

promise的功能是可以将复杂的异步处理轻松地进行模式化， 这也可以说得上是使用promise的理由之一。

### ES6 Promises 的API

在 ES6 Promises中定义的API还不是很多,大致有下面三种类型。

**Constructor**

Promise类似于 `XMLHttpRequest`，从构造函数 `Promise` 来创建一个新建新`promise`对象作为接口。

要想创建一个promise对象、可以使用`new`来调用`Promise`的构造器来进行实例化。

```js
    var promise = new Promise(function(resolve, reject) {
    // 异步处理
    // 处理结束后、调用resolve 或 reject
    });
```

**Instance Method**

对通过new生成的promise对象为了设置其值在 **resolve**(成功) / **reject**(失败)时调用的回调函数 可以使用`promise.then()` 实例方法。

```js
promise.then(onFulfilled, onRejected)
```

*   resolve(成功)时
    
    `onFulfilled` 会被调用
    
*   reject(失败)时
    
    `onRejected` 会被调用
    

`onFulfilled`、`onRejected` 两个都为可选参数。

`promise.then` 成功和失败时都可以使用。 另外在只想对异常进行处理时可以采用 `promise.then(undefined, onRejected)` 这种方式，只指定reject时的回调函数即可。 不过这种情况下 `promise.catch(onRejected)` 应该是个更好的选择。

```js
promise.catch(onRejected)
```

**Static Method**

像 `Promise` 这样的全局对象还拥有一些静态方法。

包括 `Promise.all()` 还有 `Promise.resolve()` 等在内，主要都是一些对Promise进行操作的辅助方法。

### Promise的状态

用`new Promise` 实例化的promise对象有以下三个状态。

*   "has-resolution" - Fulfilled
    
    resolve(成功)时。此时会调用 `onFulfilled`
    
*   "has-rejection" - Rejected
    
    reject(失败)时。此时会调用 `onRejected`
    
*   "unresolved" - Pending
    
    既不是resolve也不是reject的状态。也就是promise对象刚被创建后的初始化状态等
    

### 创建promise对象

```js
    function getURL(URL) {
        return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
            req.onload = function () {
                if (req.status === 200) {
                resolve(req.responseText);
                    } else {
                    reject(new Error(req.statusText));
                }
                };
                    req.onerror = function () {
                    reject(new Error(req.statusText));
                    };
                    req.send();
                    });
                }
                // 运行示例
                var URL = "http://httpbin.org/get";
                    getURL(URL).then(function onFulfilled(value){
                    console.log(value);
                        }).catch(function onRejected(error){
                        console.error(error);
                        });
```

### Promise#then

promise可以写成方法链的形式

```javascript
    aPromise.then(function taskA(value){
    // task A
        }).then(function taskB(vaue){
        // task B
            }).catch(function onRejected(error){
            console.log(error);
            });
```

如果把在 `then` 中注册的每个回调函数称为task的话，那么我们就可以通过Promise方法链方式来编写能以taskA → task B 这种流程进行处理的逻辑了。

*   `then`注册onFulfilled时的回调函数
    
*   `catch`注册onRejected时的回调函数
    

### Promise#catch

实际上 [Promise#catch](https://link.juejin.cn?target=http%3A%2F%2Fliubin.org%2Fpromises-book%2F%23promise.catch "http://liubin.org/promises-book/#promise.catch") 只是 `promise.then(undefined, onRejected);` 方法的一个别名而已。 也就是说，这个方法用来注册当promise对象状态变为Rejected时的回调函数。

### Promise.all

[`Promise.all`](https://link.juejin.cn?target=http%3A%2F%2Fliubin.org%2Fpromises-book%2F%23Promise.all "http://liubin.org/promises-book/#Promise.all") 接收一个 promise对象的数组作为参数，当这个数组里的所有promise对象全部变为resolve或reject状态的时候，它才会去调用 `.then` 方法。

```js
Promise.all([request.comment(), request.people()]);
```

在上面的代码中，`request.comment()` 和 `request.people()` 会同时开始执行，而且每个promise的结果（resolve或reject时传递的参数值），和传递给 [`Promise.all`](https://link.juejin.cn?target=http%3A%2F%2Fliubin.org%2Fpromises-book%2F%23Promise.all "http://liubin.org/promises-book/#Promise.all") 的promise数组的顺序是一致的。

也就是说，这时候 `.then` 得到的promise数组的执行结果的顺序是固定的，即 \[comment, people\]。

* * *