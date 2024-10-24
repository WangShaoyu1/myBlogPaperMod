---
author: "Sunshine_Lin"
title: "95%的人都回答不上来的问题：函数的length是多少？"
date: 2021-09-03
description: "前言 大家好，我是林三心，我今天给大家讲讲function的length，到底是怎么算的。希望大家能从中学到东西，并且可以巩固一下基础。 为什么 为什么我会想到这个知识点呢？因为昨晚，在一个群里，有一"
tags: ["前端","JavaScript","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:325,comments:131,collects:216,views:25694,"
---
前言
--

大家好，我是林三心，我今天给大家讲讲`function`的`length`，到底是怎么算的。希望大家能从中学到东西，并且可以巩固一下基础。

为什么
---

为什么我会想到这个知识点呢？因为昨晚，在一个群里，有一位同学在讨论一道字节跳动的面试题

`123['toString'].length + 123 = ?`

说实话这道题，我一开始也没答出来。其实我是知道，面试官想考`Number`原型上的`toString`方法，但是我卡在了**toString函数的length是多少**这个难题上。所以才有了今天这篇文章

到底是多少？
------

### 形参个数

咱们来看看下面这个例子

```js
function fn1 () {}

function fn2 (name) {}

function fn3 (name, age) {}

console.log(fn1.length) // 0
console.log(fn2.length) // 1
console.log(fn3.length) // 2
```

可以看出，`function`有多少个形参，`length`就是多少。但是事实真是这样吗？继续往下看

### 默认参数

如果有默认参数的话，函数的`length`会是多少呢？

```js
function fn1 (name) {}

function fn2 (name = '林三心') {}

function fn3 (name, age = 22) {}

function fn4 (name, age = 22, gender) {}

function fn5(name = '林三心', age, gender) { }

console.log(fn1.length) // 1
console.log(fn2.length) // 0
console.log(fn3.length) // 1
console.log(fn4.length) // 1
console.log(fn5.length) // 0
```

说明了，`function`的`length`，就是`第一个具有默认值之前的参数个数`

### 剩余参数

在函数的形参中，还有`剩余参数`这个东西，那如果具有`剩余参数`，会是怎么算呢？

```js
function fn1(name, ...args) {}

console.log(fn1.length) // 1
```

可以看出，剩余参数是不算进`length`的计算之中的

总结
--

总结之前，先公布`123['toString'].length + 123 = ?`的答案是`124`

总结就是：`length` 是函数对象的一个属性值，指该函数有多少个必须要传入的参数，即形参的个数。形参的数量不包括剩余`参数个数`，仅包括`第一个具有默认值`之前的参数个数

结语
--

如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。

**如果你想一起学习前端或者摸鱼，那你可以加我，加入我的摸鱼学习群，点击这里** ---> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

**如果你是有其他目的的，别加我，我不想跟你交朋友，我只想简简单单学习前端，不想搞一些有的没的！！！**