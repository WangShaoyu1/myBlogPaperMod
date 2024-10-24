---
author: "无名之苝"
title: "【Step-By-Step】高频面试题深入解析  周刊05"
date: 2019-06-24
description: "20 实现 Promiserace 方法 在实现 Promiserace 方法之前，我们首先要知道 Promiserace 的功能和特点，因为在清楚了 Promiserace 功能和特点的情况下，我们才能进一步去写实现。 Promiserace(iterable) …"
tags: ["JavaScript","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:108,comments:0,collects:134,views:6722,"
---
> 本周面试题一览:

*   实现 Promise.race 方法
*   JSONP 原理及简单实现
*   实现一个数组去重的方法
*   清除浮动的方法有哪些
*   编写一个通用的柯里化函数 currying

![](/images/jueJin/169fc27e0fdf4d0.png)

**更多优质文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 20\. 实现 Promise.race 方法

在实现 `Promise.race` 方法之前，我们首先要知道 `Promise.race` 的功能和特点，因为在清楚了 `Promise.race` 功能和特点的情况下，我们才能进一步去写实现。

#### Promise.race 功能

`Promise.race(iterable)` 返回一个 promise，一旦 `iterable` 中的一个 `promise` 状态是 `fulfilled` / `rejected` ，那么 `Promise.race` 返回的 `promise` 状态是 `fulfilled` / `rejected`.

```
let p = Promise.race([p1, p2, p3]);
```

只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 p 的回调函数。

#### Promise.race 的特点

> Promise.race 的返回值是一个 promise 实例

*   如果传入的参数为空的可迭代对象，那么 `Promise.race` 返回的 `promise` 永远是 `pending` 态
*   如果传入的参数中不包含任何 `promise`，`Promise.race` 会返回一个处理中（pending）的 `promise`
*   如果 `iterable` 包含一个或多个非 `promise` 值或已经解决的promise，则 `Promise.race` 将解析为 `iterable` 中找到的第一个值。

#### Promise.race 的实现

```
    Promise.race = function (promises) {
    //promises传入的是可迭代对象(省略参数合法性判断)
    promises = Array.from(promises);//将可迭代对象转换为数组
        return new Promise((resolve, reject) => {
            if (promises.length === 0) {
            //空的可迭代对象;
            //用于在pending态
                } else {
                    for (let i = 0; i < promises.length; i++) {
                        Promise.resolve(promises[i]).then((data) => {
                        resolve(data);
                            }).catch((reason) => {
                            reject(reason);
                            })
                        }
                    }
                    });
                }
```

### 21\. JSONP原理及简单实现

尽管浏览器有同源策略，但是 `<script>` 标签的 `src` 属性不会被同源策略所约束，可以获取任意服务器上的脚本并执行。`jsonp` 通过插入 `script` 标签的方式来实现跨域，参数只能通过 `url` 传入，仅能支持 `get` 请求。

#### 实现原理:

*   Step1: 创建 callback 方法
*   Step2: 插入 script 标签
*   Step3: 后台接受到请求，解析前端传过去的 callback 方法，返回该方法的调用，并且数据作为参数传入该方法
*   Step4: 前端执行服务端返回的方法调用

#### jsonp源码实现

```
    function jsonp({url, params, callback}) {
        return new Promise((resolve, reject) => {
        //创建script标签
        let script = document.createElement('script');
        //将回调函数挂在 window 上
            window[callback] = function(data) {
            resolve(data);
            //代码执行后，删除插入的script标签
            document.body.removeChild(script);
        }
        //回调函数加在请求地址上
        params = {...params, callback} //wb=b&callback=show
        let arrs = [];
            for(let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        script.src = `${url}?${arrs.join('&')}`;
        document.body.appendChild(script);
        });
    }
```

使用:

```
    function show(data) {
    console.log(data);
}
    jsonp({
    url: 'http://localhost:3000/show',
        params: {
        //code
        },
        callback: 'show'
            }).then(data => {
            console.log(data);
            });
```

服务端代码(node):

```
//express启动一个后台服务
let express = require('express');
let app = express();

    app.get('/show', (req, res) => {
    let {callback} = req.query; //获取传来的callback函数名，callback是key
    res.send(`${callback}('Hello!')`);
    });
    app.listen(3000);
```

### 22\. 实现一个数组去重的方法

#### 法1: 利用ES6新增数据类型 `Set`

`Set`类似于数组，但是成员的值都是唯一的，没有重复的值。

```
    function uniq(arry) {
    return [...new Set(arry)];
}
```

#### 法2: 利用 `indexOf`

```
    function uniq(arry) {
    var result = [];
        for (var i = 0; i < arry.length; i++) {
            if (result.indexOf(arry[i]) === -1) {
            //如 result 中没有 arry[i],则添加到数组中
            result.push(arry[i])
        }
    }
    return result;
}
```

#### 法3: 利用 `includes`

```
    function uniq(arry) {
    var result = [];
        for (var i = 0; i < arry.length; i++) {
            if (!result.includes(arry[i])) {
            //如 result 中没有 arry[i],则添加到数组中
            result.push(arry[i])
        }
    }
    return result;
}
```

#### 法4：利用 `reduce`

```
    function uniq(arry) {
    return arry.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}
```

#### 法5：利用 `Map`

```
    function uniq(arry) {
    let map = new Map();
    let result = new Array();
        for (let i = 0; i < arry.length; i++) {
            if (map.has(arry[i])) {
            map.set(arry[i], true);
                } else {
                map.set(arry[i], false);
                result.push(arry[i]);
            }
        }
        return result;
    }
```

### 23\. 清除浮动的方法有哪些？

> 当容器的高度为auto，且容器的内容中有浮动（float为left或right）的元素，在这种情况下，容器的高度不能自动伸长以适应内容的高度，使得内容溢出到容器外面而影响（甚至破坏）布局的现象。这个现象叫浮动溢出，为了防止这个现象的出现而进行的CSS处理，就叫CSS清除浮动。

```
<style>
    .inner {
    width: 100px;
    height: 100px;
    float: left;
}
</style>
<div class='outer'>
<div class='inner'></div>
<div class='inner'></div>
<div class='inner'></div>
</div>
```

#### 1\. 利用 `clear` 属性

在 `<div class='outer'>` 内创建一个空元素，对其设置 `clear: both;` 的样式。

*   优点：简单，代码少，浏览器兼容性好。
*   缺点：需要添加大量无语义的html元素，代码不够优雅，后期不容易维护。

#### 2\. 利用 `clear` 属性 + 伪元素

```
    .outer:after{
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
}
```

IE8以上和非IE浏览器才支持:after，如果想要支持IE6、7，需要给 `outer` 元素，设置样式 `zoom: 1`;

#### 3\. 利用 BFC 布局规则

根据 BFC 的规则，计算 BFC 的高度时，浮动元素也参与计算。因此清除浮动，只需要触发一个BFC即可。

> 可以使用以下方法来触发BFC

*   position 为 absolute 或 fixed
*   overflow 不为 visible 的块元素
*   display 为 inline-block, table-cell, table-caption

如：

```
    .outer {
    overflow: hidden;
}
```

注意使用 `display: inline-block` 会产生间隙。

### 24\. 编写一个通用的柯里化函数 currying

在开始之前，我们首先需要搞清楚函数柯里化的概念。

函数柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```
const currying = (fn, ...args) =>
args.length < fn.length
//参数长度不足时，重新柯里化该函数，等待接受新参数
? (...arguments) => currying(fn, ...args, ...arguments)
//参数长度满足时，执行函数
: fn(...args);
``````
    function sumFn(a, b, c) {
    return a + b + c;
}
var sum = currying(sumFn);
console.log(sum(2)(3)(5));//10
console.log(sum(2, 3, 5));//10
console.log(sum(2)(3, 5));//10
console.log(sum(2, 3)(5));//10
```

> 函数柯里化的主要作用：

*   参数复用
*   提前返回 – 返回接受余下的参数且返回结果的新函数
*   延迟执行 – 返回新函数，等待执行

### 参考文章：

\[1\] [CSS-清除浮动](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000004865198 "https://segmentfault.com/a/1190000004865198")

\[2\] [详解JS函数柯里化](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F2975c25e4d71 "https://www.jianshu.com/p/2975c25e4d71")

\[3\] [JavaScript数组去重](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000016418021%3Futm_source%3Dtag-newest "https://segmentfault.com/a/1190000016418021?utm_source=tag-newest")

谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。 [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)