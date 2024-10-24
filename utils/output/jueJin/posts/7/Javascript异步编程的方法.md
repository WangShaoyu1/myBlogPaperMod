---
author: "Gaby"
title: "Javascript异步编程的方法"
date: 2021-09-05
description: "你可能知道，Javascript语言的执行环境是单线程（single thread）。 所谓单线程，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:4,views:619,"
---
你可能知道，Javascript语言的执行环境是"单线程"（single thread）。

所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决这个问题，Javascript语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。

"同步模式"就是上一段的模式，后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的；"异步模式"则完全不同，每一个任务有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的。

"异步模式"非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是Ajax操作。在服务器端，"异步模式"甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有http请求，服务器性能会急剧下降，很快就会失去响应。

本文总结了"异步模式"编程的4种方法，理解它们可以让你写出结构更合理、性能更出色、维护更方便的Javascript程序。

### 一、回调函数

这是异步编程最基本的方法。

假定有两个函数f1和f2，后者等待前者的执行结果。

> 　　f1();
> 
> 　　f2();

如果f1是一个很耗时的任务，可以考虑改写f1，把f2写成f1的回调函数。

> 　　function f1(callback){
> 
> 　　　　setTimeout(function () {
> 
> 　　　　　　// f1的任务代码
> 
> 　　　　　　callback();
> 
> 　　　　}, 1000);
> 
> 　　}

执行代码就变成下面这样：

> 　　f1(f2);

采用这种方式，我们把同步操作变成了异步操作，f1不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行。

回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度[耦合](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCoupling_\(computer_programming\) "https://en.wikipedia.org/wiki/Coupling_(computer_programming)")（Coupling），流程会很混乱，而且每个任务只能指定一个回调函数。

二、事件监听
------

另一种思路是采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

还是以f1和f2为例。首先，为f1绑定一个事件（这里采用的jQuery的[写法](https://link.juejin.cn?target=https%3A%2F%2Fapi.jquery.com%2Fon%2F "https://api.jquery.com/on/")）。

> 　　f1.on('done', f2);

上面这行代码的意思是，当f1发生done事件，就执行f2。然后，对f1进行改写：

> 　　function f1(){
> 
> 　　　　setTimeout(function () {
> 
> 　　　　　　// f1的任务代码
> 
> 　　　　　　**f1.trigger('done');**
> 
> 　　　　}, 1000);
> 
> 　　}

f1.trigger('done')表示，执行完成后，立即触发done事件，从而开始执行f2。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以["去耦合"](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDecoupling "https://en.wikipedia.org/wiki/Decoupling")（Decoupling），有利于实现[模块化](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2012%2F10%2Fjavascript_module.html "https://www.ruanyifeng.com/blog/2012/10/javascript_module.html")。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。

### 三、发布/订阅

上一节的"事件"，完全可以理解成"信号"。

我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做["发布/订阅模式"](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPublish-subscribe_pattern "https://en.wikipedia.org/wiki/Publish-subscribe_pattern")（publish-subscribe pattern），又称["观察者模式"](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FObserver_pattern "https://en.wikipedia.org/wiki/Observer_pattern")（observer pattern）。

这个模式有多种[实现](https://link.juejin.cn?target=https%3A%2F%2Fmsdn.microsoft.com%2Fen-us%2Fmagazine%2Fhh201955.aspx "https://msdn.microsoft.com/en-us/magazine/hh201955.aspx")，下面采用的是Ben Alman的[Tiny Pub/Sub](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2F661855 "https://gist.github.com/661855")，这是jQuery的一个插件。

首先，f2向"信号中心"jQuery订阅"done"信号。

> 　　jQuery.subscribe("done", f2);

然后，f1进行如下改写：

> 　　function f1(){
> 
> 　　　　setTimeout(function () {
> 
> 　　　　　　// f1的任务代码
> 
> 　　　　　　**jQuery.publish("done");**
> 
> 　　　　}, 1000);
> 
> 　　}

jQuery.publish("done")的意思是，f1执行完成后，向"信号中心"jQuery发布"done"信号，从而引发f2的执行。

此外，f2完成执行后，也可以取消订阅（unsubscribe）。

> 　　jQuery.unsubscribe("done", f2);

这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

### 四、Promises对象

Promises对象是CommonJS工作组提出的一种规范，目的是为异步编程提供[统一接口](https://link.juejin.cn?target=http%3A%2F%2Fwiki.commonjs.org%2Fwiki%2FPromises%2FA "http://wiki.commonjs.org/wiki/Promises/A")。

简单说，它的思想是，每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数。比如，f1的回调函数f2,可以写成：

> 　　f1().then(f2);

f1要进行如下改写（这里使用的是jQuery的[实现](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2011%2F08%2Fa_detailed_explanation_of_jquery_deferred_object.html "https://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html")）：

> 　　function f1(){
> 
> 　　　　var dfd = $.Deferred();
> 
> 　　　　setTimeout(function () {
> 
> 　　　　　　// f1的任务代码
> 
> 　　　　　　dfd.resolve();
> 
> 　　　　}, 500);
> 
> 　　　　**return dfd.promise;**
> 
> 　　}

这样写的优点在于，回调函数变成了链式写法，程序的流程可以看得很清楚，而且有一整套的[配套方法](https://link.juejin.cn?target=https%3A%2F%2Fapi.jquery.com%2Fcategory%2Fdeferred-object%2F "https://api.jquery.com/category/deferred-object/")，可以实现许多强大的功能。

比如，指定多个回调函数：

> 　　f1().then(f2).then(f3);

再比如，指定发生错误时的回调函数：

> 　　f1().then(f2).fail(f3);

而且，它还有一个前面三种方法都没有的好处：如果一个任务已经完成，再添加回调函数，该回调函数会立即执行。所以，你不用担心是否错过了某个事件或信号。这种方法的缺点就是编写和理解，都相对比较难。

### 五、**async**和**await**

使用**async**和**await**关键词编写异步代码，具有与同步代码相当的结构和简单性，并且摒弃了异步编程的复杂结构。

JavaScript 中的 async/await 是 [AsyncFunction 特性](https://link.juejin.cn?target=https%3A%2F%2Flink.segmentfault.com%2F%3Furl%3Dhttps%253A%252F%252Fdeveloper.mozilla.org%252Fdocs%252FWeb%252FJavaScript%252FReference%252FGlobal_Objects%252FAsyncFunction "https://link.segmentfault.com/?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FAsyncFunction") 中的关键字。目前为止，除了 IE 之外，常用浏览器和 Node (v7.6+) 都已经支持该特性。具体支持情况可以在 [这里](https://link.juejin.cn?target=https%3A%2F%2Flink.segmentfault.com%2F%3Furl%3Dhttps%253A%252F%252Fdeveloper.mozilla.org%252Fen-US%252Fdocs%252FWeb%252FJavaScript%252FReference%252FGlobal_Objects%252FAsyncFunction%2523Browser_compatibility "https://link.segmentfault.com/?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FAsyncFunction%23Browser_compatibility") 查看。

#### async

async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。另外还有语法规定，await 只能出现在 async 函数中。

从[文档](https://link.juejin.cn?target=https%3A%2F%2Flink.segmentfault.com%2F%3Furl%3Dhttps%253A%252F%252Fdeveloper.mozilla.org%252Fdocs%252FWeb%252FJavaScript%252FReference%252FStatements%252Fasync_function "https://link.segmentfault.com/?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FJavaScript%2FReference%2FStatements%2Fasync_function")中也可以得到这个信息。async 函数（包含函数语句、函数表达式、Lambda表达式）会返回一个 Promise 对象，如果在函数中 `return` 一个直接量，async 会把这个直接量通过 `Promise.resolve()` 封装成 Promise 对象。

`Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。

#### await

一般来说，都认为 await 是在等待一个 async 函数完成。不过按[语法说明](https://link.juejin.cn?target=https%3A%2F%2Flink.segmentfault.com%2F%3Furl%3Dhttps%253A%252F%252Fdeveloper.mozilla.org%252Fdocs%252FWeb%252FJavaScript%252FReference%252FOperators%252Fawait "https://link.segmentfault.com/?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2Fawait")，await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。

await 等到了它要等的东西，一个 Promise 对象，或者其它值，然后呢？我不得不先说，`await` 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。

如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。

如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

> 看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。

#### async/await 帮我们做了什么

async/await 的优势在于处理 then 链，单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then 链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它）。

假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用 `setTimeout` 来模拟异步操作：

```js
/**
* 传入参数 n，表示这个函数执行的时间（毫秒）
* 执行的结果是 n + 200，这个值将用于下一步骤
*/
    function takeLongTime(n) {
        return new Promise(resolve => {
        setTimeout(() => resolve(n + 200), n);
        });
    }
    
        function step1(n) {
        console.log(`step1 with ${n}`);
        return takeLongTime(n);
    }
    
        function step2(n) {
        console.log(`step2 with ${n}`);
        return takeLongTime(n);
    }
    
        function step3(n) {
        console.log(`step3 with ${n}`);
        return takeLongTime(n);
    }
```

现在用 Promise 方式来实现这三个步骤的处理

```js
    function doIt() {
    console.time("doIt");
    const time1 = 300;
    step1(time1)
    .then(time2 => step2(time2))
    .then(time3 => step3(time3))
        .then(result => {
        console.log(`result is ${result}`);
        console.timeEnd("doIt");
        });
    }
    
    doIt();
    
    // c:\var\test>node --harmony_async_await .
    // step1 with 300
    // step2 with 500
    // step3 with 700
    // result is 900
    // doIt: 1507.251ms
```

输出结果 `result` 是 `step3()` 的参数 `700 + 200` = `900`。`doIt()` 顺序执行了三个步骤，一共用了 `300 + 500 + 700 = 1500` 毫秒，和 `console.time()/console.timeEnd()` 计算的结果一致。

如果用 async/await 来实现呢，会是这样

```js
    async function doIt() {
    console.time("doIt");
    const time1 = 300;
    const time2 = await step1(time1);
    const time3 = await step2(time2);
    const result = await step3(time3);
    console.log(`result is ${result}`);
    console.timeEnd("doIt");
}

doIt();
```

结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，几乎跟同步代码一样