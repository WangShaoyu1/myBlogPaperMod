---
author: "Sunshine_Lin"
title: "网易面试官：请你实现一下JS重载？可不是TS重载哦！"
date: 2021-11-17
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。今天给大家讲一道题，是一道网易的面试题 一位同学：“如何实现JS重载？” 我：“JS有重载吗？不是TS"
tags: ["前端","JavaScript","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:142,comments:28,collects:109,views:8151,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。今天给大家讲一道题，是一道网易的面试题

*   一位同学：“如何实现JS重载？”
*   我：“JS有重载吗？不是TS才有吗?”
*   一位同学：“有的，这是网易一道面试题”
*   我：“好吧我想想哈！”

![image.png](/images/jueJin/f1944638eb114c9.png)

什么是重载
-----

我第一次看到`重载`这个词还是在以前学习`Java`的时候，我一直觉得`JavaScript`是没有重载的，直到`TypeScript`的出现，所以我一直觉得`JavaScript`没有重载，`TypeScript`才有，但是现在看来我是错的。

我理解的重载是：同样的函数，不同样的参数个数，执行不同的代码，比如：

```js
/*
* 重载
*/
    function fn(name) {
    console.log(`我是${name}`)
}

    function fn(name, age) {
    console.log(`我是${name},今年${age}岁`)
}

    function fn(name, age, sport) {
    console.log(`我是${name},今年${age}岁,喜欢运动是${sport}`)
}

/*
* 理想结果
*/
fn('林三心') // 我是林三心
fn('林三心', 18) // 我是林三心，今年18岁
fn('林三心', 18, '打篮球') // 我是林三心，今年18岁，喜欢运动是打篮球
```

但是直接在`JavaScript`中这么写，肯定是不行的，咱们来看看上面代码的实际执行结果，可以看到，最后一个`fn`的定义，把前面两个都给覆盖了，所以没有实现`重载`的效果

```js
我是林三心,今年undefined岁,喜欢运动是undefined
我是林三心,今年18岁,喜欢运动是undefined
我是林三心,今年18岁,喜欢运动是打篮球
```

我的做法
----

其实，想要实现理想的`重载`效果，我还是有办法的，我可以只写一个`fn`函数，并在这个函数中判断`arguments`类数组的长度，执行不同的代码，就可以完成`重载`的效果

```js
    function fn() {
        switch (arguments.length) {
        case 1:
        var [name] = arguments
        console.log(`我是${name}`)
        break;
        case 2:
        var [name, age] = arguments
        console.log(`我是${name},今年${age}岁`)
        break;
        case 3:
        var [name, age, sport] = arguments
        console.log(`我是${name},今年${age}岁,喜欢运动是${sport}`)
        break;
    }
}

/*
* 实现效果
*/
fn('林三心') // 我是林三心
fn('林三心', 18) // 我是林三心，今年18岁
fn('林三心', 18, '打篮球') // 我是林三心，今年18岁，喜欢运动是打篮球
```

但是那位同学说，网易的面试官好像觉得这么实现可以是可以，但是还有没有更好的实现方法，我就懵逼了。

高端做法
----

![image.png](/images/jueJin/0629dc519b394d4.png)

经过了我的一通网上查找资料，发现了一种比较高端的做法，可以利用`闭包`来实现`重载`的效果。这个方法在JQuery之父John Resig写的《secrets of the JavaScript ninja》中，这种方法充分的利用了`闭包`的特性！

```js
    function addMethod(object, name, fn) {
    var old = object[name]; //把前一次添加的方法存在一个临时变量old里面
    object[name] = function () { // 重写了object[name]的方法
    // 如果调用object[name]方法时，传入的参数个数跟预期的一致，则直接调用
        if (fn.length === arguments.length) {
        return fn.apply(this, arguments);
        // 否则，判断old是否是函数，如果是，就调用old
            } else if (typeof old === "function") {
            return old.apply(this, arguments);
        }
    }
}

addMethod(window, 'fn', (name) => console.log(`我是${name}`))
addMethod(window, 'fn', (name, age) => console.log(`我是${name},今年${age}岁`))
addMethod(window, 'fn', (name, age, sport) => console.log(`我是${name},今年${age}岁,喜欢运动是${sport}`))

/*
* 实现效果
*/

window.fn('林三心') // 我是林三心
window.fn('林三心', 18) // 我是林三心，今年18岁
window.fn('林三心', 18, '打篮球') // 我是林三心，今年18岁，喜欢运动是打篮球
```

参考资料
----

*   [浅谈JavaScript函数重载](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fyugege%2Fp%2F5539020.html "https://www.cnblogs.com/yugege/p/5539020.html")

结语
--

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645