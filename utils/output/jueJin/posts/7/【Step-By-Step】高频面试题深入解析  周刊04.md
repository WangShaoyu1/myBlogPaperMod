---
author: "无名之苝"
title: "【Step-By-Step】高频面试题深入解析  周刊04"
date: 2019-06-17
description: "15 什么是闭包？闭包的作用是什么？ 闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包最常用的方式就是在一个函数内部创建另一个函数。 闭包使得函数可以继续访问定义时的词法作用域。拜 fn 所赐，在 foo() 执行后，foo 内部作用域不会被销毁。 无论通过何种手段将…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:118,comments:0,collects:130,views:7469,"
---
> 本周面试题一览:

*   什么是闭包？闭包的作用是什么？
*   实现 Promise.all 方法
*   异步加载 js 脚本的方法有哪些？
*   请实现一个 flattenDeep 函数，把嵌套的数组扁平化
*   可迭代对象有什么特点？

### 15\. 什么是闭包？闭包的作用是什么？

#### 什么是闭包？

闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包最常用的方式就是在一个函数内部创建另一个函数。

#### 创建一个闭包

```
    function foo() {
    var a = 2;
        return function fn() {
        console.log(a);
    }
}
let func = foo();
func(); //输出2
```

闭包使得函数可以继续访问定义时的词法作用域。拜 fn 所赐，在 foo() 执行后，foo 内部作用域不会被销毁。

无论通过何种手段将内部函数传递到所在的词法作用域之外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。如:

```
    function foo() {
    var a = 2;
        function inner() {
        console.log(a);
    }
    outer(inner);
}
    function outer(fn){
    fn(); //闭包
}
foo();
```

#### 闭包的作用

1.  能够访问函数定义时所在的词法作用域(阻止其被回收)。
    
2.  私有化变量
    

```
    function base() {
    let x = 10; //私有变量
        return {
            getX: function() {
            return x;
        }
    }
}
let obj = base();
console.log(obj.getX()); //10
```

3.  模拟块级作用域

```
var a = [];
    for (var i = 0; i < 10; i++) {
        a[i] = (function(j){
            return function () {
            console.log(j);
        }
        })(i);
    }
    a[6](); // 6
```

4.  创建模块

```
    function coolModule() {
    let name = 'Yvette';
    let age = 20;
        function sayName() {
        console.log(name);
    }
        function sayAge() {
        console.log(age);
    }
        return {
        sayName,
        sayAge
    }
}
let info = coolModule();
info.sayName(); //'Yvette'
```

模块模式具有两个必备的条件(来自《你不知道的JavaScript》)

*   必须有外部的封闭函数，该函数必须至少被调用一次(每次调用都会创建一个新的模块实例)
*   封闭函数必须返回至少**一个**内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。

#### 闭包的缺点

闭包会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏

### 16\. 实现 Promise.all 方法

在实现 Promise.all 方法之前，我们首先要知道 Promise.all 的功能和特点，因为在清楚了 Promise.all 功能和特点的情况下，我们才能进一步去写实现。

#### Promise.all 功能

`Promise.all(iterable)` 返回一个新的 Promise 实例。此实例在 `iterable` 参数内所有的 `promise` 都 `fulfilled` 或者参数中不包含 `promise` 时，状态变成 `fulfilled`；如果参数中 `promise` 有一个失败`rejected`，此实例回调失败，失败原因的是第一个失败 `promise` 的返回结果。

```
let p = Promise.all([p1, p2, p3]);
```

p的状态由 p1,p2,p3决定，分成以下；两种情况：

（1）只有p1、p2、p3的状态都变成 `fulfilled`，p的状态才会变成 `fulfilled`，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被 `rejected`，p的状态就变成 `rejected`，此时第一个被reject的实例的返回值，会传递给p的回调函数。

#### Promise.all 的特点

> Promise.all 的返回值是一个 promise 实例

*   如果传入的参数为空的可迭代对象，`Promise.all` 会 **同步** 返回一个已完成状态的 `promise`
*   如果传入的参数中不包含任何 promise,`Promise.all` 会 **异步** 返回一个已完成状态的 `promise`
*   其它情况下，`Promise.all` 返回一个 **处理中（pending）** 状态的 `promise`.

> Promise.all 返回的 promise 的状态

*   如果传入的参数中的 promise 都变成完成状态，`Promise.all` 返回的 `promise` 异步地变为完成。
*   如果传入的参数中，有一个 `promise` 失败，`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，而不管其它 `promise` 是否完成
*   在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组

#### Promise.all 实现

> 仅考虑传入的参数是数组的情况

```
/** 仅考虑 promises 传入的是数组的情况时 */
    Promise.all = function (promises) {
        return new Promise((resolve, reject) => {
            if (promises.length === 0) {
            resolve([]);
                } else {
                let result = [];
                let index = 0;
                    for (let i = 0;  i < promises.length; i++ ) {
                    //考虑到 i 可能是 thenable 对象也可能是普通值
                        Promise.resolve(promises[i]).then(data => {
                        result[i] = data;
                            if (++index === promises.length) {
                            //所有的 promises 状态都是 fulfilled，promise.all返回的实例才变成 fulfilled 态
                            resolve(result);
                        }
                            }, err => {
                            reject(err);
                            return;
                            });
                        }
                    }
                    });
                }
```

可使用 MDN 上的代码进行测试

> 考虑 iterable 对象

```
    Promise.all = function (promises) {
    /** promises 是一个可迭代对象，省略对参数类型的判断 */
        return new Promise((resolve, reject) => {
            if (promises.length === 0) {
            //如果传入的参数是空的可迭代对象
            return resolve([]);
                } else {
                let result = [];
                let index = 0;
                let j = 0;
                    for (let value of promises) {
                        (function (i) {
                            Promise.resolve(value).then(data => {
                            result[i] = data; //保证顺序
                            index++;
                                if (index === j) {
                                //此时的j是length.
                                resolve(result);
                            }
                                }, err => {
                                //某个promise失败
                                reject(err);
                                return;
                                });
                                })(j)
                                j++; //length
                            }
                        }
                        });
                    }
```

测试代码:

```
    let p2 = Promise.all({
    a: 1,
        [Symbol.iterator]() {
        let index = 0;
            return {
                next() {
                index++;
                    if (index == 1) {
                        return {
                            value: new Promise((resolve, reject) => {
                            setTimeout(resolve, 100, 'foo');
                            }), done: false
                        }
                            } else if (index == 2) {
                                return {
                                    value: new Promise((resolve, reject) => {
                                    resolve(222);
                                    }), done: false
                                }
                                    } else if(index === 3) {
                                        return {
                                        value: 3, done: false
                                    }
                                        }else {
                                    return { done: true }
                                }
                                
                            }
                        }
                        
                    }
                    });
                        setTimeout(() => {
                        console.log(p2)
                        }, 200);
```

### 17\. 异步加载 js 脚本的方法有哪些？

#### `<script>` 标签中增加 `async`(html5) 或者 `defer`(html4) 属性,脚本就会异步加载。

```
<script src="../XXX.js" defer></script>
```

`defer` 和 `async` 的区别在于：

*   `defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），在window.onload 之前执行；
*   `async` 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
*   如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载
*   多个 `async` 脚本不能保证加载顺序

#### 动态创建 `script` 标签

动态创建的 `script` ，设置 `src` 并不会开始下载，而是要添加到文档中，JS文件才会开始下载。

```
let script = document.createElement('script');
script.src = 'XXX.js';
// 添加到html文件中才会开始下载
document.body.append(script);
```

#### XHR 异步加载JS

```
let xhr = new XMLHttpRequest();
xhr.open("get", "js/xxx.js",true);
xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        eval(xhr.responseText);
    }
}
```

### 18\. 请实现一个 flattenDeep 函数，把嵌套的数组扁平化

#### 利用 Array.prototype.flat

ES6 为数组实例新增了 `flat` 方法，用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数组没有影响。

`flat` 默认只会 “拉平” 一层，如果想要 “拉平” 多层的嵌套数组，需要给 `flat` 传递一个整数，表示想要拉平的层数。

```
    function flattenDeep(arr, deepLength) {
    return arr.flat(deepLength);
}
console.log(flattenDeep([1, [2, [3, [4]], 5]], 3));
```

当传递的整数大于数组嵌套的层数时，会将数组拉平为一维数组，JS能表示的最大数字为 `Math.pow(2, 53) - 1`，因此我们可以这样定义 `flattenDeep` 函数

```
    function flattenDeep(arr) {
    //当然，大多时候我们并不会有这么多层级的嵌套
    return arr.flat(Math.pow(2,53) - 1);
}
console.log(flattenDeep([1, [2, [3, [4]], 5]]));
```

#### 利用 reduce 和 concat

```
    function flattenDeep(arr){
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}
console.log(flattenDeep([1, [2, [3, [4]], 5]]));
```

#### 使用 stack 无限反嵌套多层嵌套数组

```
    function flattenDeep(input) {
    const stack = [...input];
    const res = [];
        while (stack.length) {
        // 使用 pop 从 stack 中取出并移除值
        const next = stack.pop();
            if (Array.isArray(next)) {
            // 使用 push 送回内层数组中的元素，不会改动原始输入 original input
            stack.push(...next);
                } else {
                res.push(next);
            }
        }
        // 使用 reverse 恢复原数组的顺序
        return res.reverse();
    }
    console.log(flattenDeep([1, [2, [3, [4]], 5]]));
```

### 19\. 可迭代对象有什么特点

ES6 规定，默认的 `Iterator` 接口部署在数据结构的 `Symbol.iterator` 属性，换个角度，也可以认为，一个数据结构只要具有 `Symbol.iterator` 属性(`Symbol.iterator` 方法对应的是遍历器生成函数，返回的是一个遍历器对象)，那么就可以其认为是可迭代的。

#### 可迭代对象的特点

*   具有 `Symbol.iterator` 属性，`Symbol.iterator()` 返回的是一个遍历器对象
*   可以使用 `for ... of` 进行循环

```
let arry = [1, 2, 3, 4];
let iter = arry[Symbol.iterator]();
console.log(iter.next()); //{ value: 1, done: false }
console.log(iter.next()); //{ value: 2, done: false }
console.log(iter.next()); //{ value: 3, done: false }
```

#### 原生具有 `Iterator` 接口的数据结构：

*   Array
*   Map
*   Set
*   String
*   TypedArray
*   函数的 arguments 对象
*   NodeList 对象

#### 自定义一个可迭代对象

上面我们说，一个对象只有具有正确的 `Symbol.iterator` 属性，那么其就是可迭代的，因此，我们可以通过给对象新增 `Symbol.iterator` 使其可迭代。

```
    let obj = {
    name: "Yvette",
    age: 18,
    job: 'engineer',
        *[Symbol.iterator]() {
        const self = this;
        const keys = Object.keys(self);
            for (let index = 0; index < keys.length; index++) {
            yield self[keys[index]];//yield表达式仅能使用在 Generator 函数中
        }
    }
    };
    
        for (var key of obj) {
        console.log(key); //Yvette 18 engineer
    }
```

### 参考文章：

\[1\] [MDN Promise.all](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise%2Fall "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all")

\[2\] [Promise](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fpromise%23Promise-all "http://es6.ruanyifeng.com/#docs/promise#Promise-all")

\[3\] [Iterator](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fiterator "http://es6.ruanyifeng.com/#docs/iterator")

谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。 [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)