---
author: "Sunshine_Lin"
title: "简单说说 tree-shaking 有啥鸟用吧！"
date: 2022-02-08
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 背景 大家平时在查 webpack构建体积优化 ，可能都会查到 tree-shaking 这个东西，很"
tags: ["前端","JavaScript","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:94,comments:19,collects:87,views:8982,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

背景
--

大家平时在查 **webpack构建体积优化** ，可能都会查到 **tree-shaking** 这个东西，很多人看到这个东西，就会把它背下来，用来应付以后面试官可能会问到的情况。

但是，又有多少人去真的了解一下 **tree-shaking** 呢？自己去实践一下看 **tree-shaking** 到底起了哪些作用？对于我们的打包体积的优化又有多少呢？

![](/images/jueJin/6014e2ee792444c.png)

有啥用？
----

`Tree Shaking`中文含义是摇树，在webpack中指的是打包时把无用的代码摇掉，以优化打包结果。

而`webpack5`已经自带了这个功能了，当打包环境为`production`时，默认开启`tree-shaking`功能。

实践
--

### 前置准备

准备两个文件`main.js、util.js`

*   `util.js`

```js
    function a () {
    console.log('a')
}
    function b () {
    console.log('b')
}
    export default {
    a, b
}
```

*   `main.js`

```js
import a from './util'

// 使用a变量，调用文件里面的a函数，不使用b函数
console.log(a.a())
console.log('hello world')

// 不可能执行的代码
    if (false) {
    console.log('haha')
}

// 定义了但是没用的变量
const m = 1
```

### 打包

前面说了`webpack5`在环境`production`下打包的话，默认开启`tree-shaking`，那我们运行`npm run build`进行一下打包，看看打包后的代码长啥样：

```js
(()=>{"use strict";
const o=function(){console.log("a")};
console.log(o())
console.log("hello world")}
)();
```

> 结论：可以看到打包后，把`b函数、不可能执行的代码、定义未用的变量`通通都剔除了，这在一个项目中，能减少很多的代码量，进而减少打包后的文件体积。

sideEffects
-----------

### 副作用

先来讲讲一个东西——`副作用`，是什么东西呢？`副作用`指的是：除了导出成员之外所做的事情，我举个例子，下面的`a.js`是没副作用的，`b.js`是有副作用的：

*   `a.js`

```js
    function console () {
    console.log('console')
}
    export default {
    console
}
```

*   `b.js`

```js
    function console () {
    console.log('console')
}

// 这个就是副作用，会影响全局的数组
Array.prototype.func = () => {}

    export default {
    console
}
```

有无`副作用`的判断，可以决定`tree-shaking`的优化程度，举个例子：

*   我现在引入`a.js`但是我不用他的`console`函数，那么在优化阶段我完全可以不打包`a.js`这个文件。
*   我现在引入`b.js`但是我不用他的`console`函数，但是我不可以不打包`b.js`这个文件，因为他有`副作用`，不能不打包。

### sideEffects的使用

`sideEffects`可以在`package.json`中设置：

```js
// 所有文件都有副作用，全都不可 tree-shaking
    {
    "sideEffects": true
}
// 没有文件有副作用，全都可以 tree-shaking
    {
    "sideEffects": false
}
// 只有这些文件有副作用，
// 所有其他文件都可以 tree-shaking，
// 但会保留这些文件
    {
        "sideEffects": [
        "./src/file1.js",
        "./src/file2.js"
    ]
}
```

### 优化体积

当我把`sideEffects`设置成`true`之后，整个打包体积增加了`100k`，说明默认的`false`还是有用的。。

![](/images/jueJin/6b4ea0bd788547e.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/2d1d43ebae0c47c.png)