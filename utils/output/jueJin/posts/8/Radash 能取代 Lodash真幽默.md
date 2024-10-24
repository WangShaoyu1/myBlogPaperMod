---
author: "Sunshine_Lin"
title: "Radash 能取代 Lodash？？？真幽默"
date: 2024-04-10
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ Radash 取代 Lodash？ 最近 Radash 这个库火的一塌糊涂，这是一个类似于 Loda"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:61,comments:0,collects:61,views:8596,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

Radash 取代 Lodash？
-----------------

最近 Radash 这个库火的一塌糊涂，这是一个类似于 Lodash 的前端工具库，短短时间内在 github 上就拥有 3.4k star

![](/images/jueJin/cdb307e178df444.png)

![](/images/jueJin/ecbf7d2e7e804f0.png)

然后网上就会有一个论调：**Radash 要取代 Lodash 了！！！**

Lodash 存在的问题
------------

自Lodash问世以来，它通过简化对数组、数字、对象、字符串等的操作，极大地便利了JavaScript的使用。然而，随着前端技术的进步，纯函数和函数式编程的概念已深入人心，成为社区的主流。在这样的背景下，Lodash的某些功能显得不够前沿。

Lodash是一个十年前诞生的库，旨在解决当时JavaScript开发者面临的挑战。但随着时间的推移，这些早期问题对现代开发者而言已经不再是难题。尤其是TypeScript的流行，更加剧了对基础库，如Lodash，应提供更精确类型定义的期待

### 过旧的语法

随着JavaScript引入了可选链和空值合并操作符，Lodash库中的许多函数显得不那么必要了。以Lodash的\_.filter函数为例，它曾经非常适用于遍历对象数组并基于属性进行筛选，即便某些对象缺少这些属性也能安全运行。然而，现代JavaScript的新特性已经让这类操作变得更加简单直接。

![](/images/jueJin/7b03b55f3a3b4af.png)

如今，借助可选链操作符，我们能够以更简洁的方式实现相同的功能，而无需依赖任何外部库。

![](/images/jueJin/dc31bb8b2eea4ce.png)

同样，随着 JavaScript 和 TypeScript 的最新进展，传统的函数如 .get、.map 和 \_.size 等已经变得不那么必需了。更重要的是，就性能而言，像可选链这类语言特性的效率远超过了 Lodash 的 \_.get 函数，其速度几乎是后者的两倍。

更新不频繁
-----

Lodash 上一次发版已经是三年前了

![](/images/jueJin/fc7b073de76547a.png)

Radash
------

Radash 的特点是：

*   它是用 Typescript 编写的
*   源码中使用的语法更加的新
*   提供了一些 Lodash 没有的实用方法

### tryit 方法

tryit 方法相当于可以帮你给异步操作加一层 `try catch`，有利于操作的兜底以及错误的捕获

![](/images/jueJin/46eef997310c497.png)

### parallel 方法

parallel 你可以理解为它是 `Promise.all` 的加强版，它不止能帮你做多个异步操作的并发处理，还能帮你控制并发数量

![](/images/jueJin/364fdf4d182e462.png)

### retry 方法

retry 可以帮你做异步操作的失败重试，并且你可以配置重试延迟、重试次数

![](/images/jueJin/5dea5ca812714be.png)

### counting 方法

counting 可以帮你计算符合条件的项的个数

如统计年龄大于30的人数：

![](/images/jueJin/e2da2526af534d2.png)

### range 方法

range 帮你创建一个指定范围内数字的数组

![](/images/jueJin/a2daf1bc60ee4f4.png)

### list 方法

list 方法帮你创建一个包含指定元素的数组，有点类似于 `Array.prototype.fill`

![](/images/jueJin/21a72c42d8c4433.png)

Radash 能取代 Lodash 吗？
--------------------

我觉得短时间内 Radash 肯定取代不了 Lodash！！！

虽然 Radash 提供了很多实用方法，但是其实这些方法并不是项目中不可或缺的。。

虽然 Lodash 比较老，但是 Lodash 提供的方法已经够大部分项目用了

我们来看看周下载量对比，Lodash 是 Radash 的 700 倍！！！

![](/images/jueJin/ba065b986a6f491.png)

![](/images/jueJin/8a77563775f949a.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")