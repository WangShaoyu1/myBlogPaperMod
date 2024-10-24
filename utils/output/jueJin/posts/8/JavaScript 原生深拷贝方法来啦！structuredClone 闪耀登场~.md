---
author: "Sunshine_Lin"
title: "JavaScript 原生深拷贝方法来啦！structuredClone 闪耀登场~"
date: 2024-05-09
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 原生的深拷贝~ 分享一个 JavaScript 原生的深拷贝方法 structuredClone，其"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:2,views:799,"
---
前言
==

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

原生的深拷贝~
-------

分享一个 JavaScript 原生的深拷贝方法 `structuredClone`，其实这个方法出了很久了，但是存在感一直很低~

![](/images/jueJin/eea017d6e72f4fb.png)

说这个方法前，我们先来讨论一下，常见的**深拷贝**都有哪些方案呢？

JSON.parse & JSON.stringify()
-----------------------------

很多人会用 `JSON.parse(JSON.stringify(obj))`来对对象进行深拷贝操作，但是这个方式缺点太多了

![](/images/jueJin/6ea6518fe016428.png)

![](/images/jueJin/c52b76d506bf45d.png)

可以看到很多数据类型都没有深拷贝成功

数据类型

克隆结果

**number**

✔

**string**

✔

**undefined**

✖

**null**

✔

**boolean**

✔

**object**

✔

**Array**

✔

**Function**

✖

**map**

✖

**Set**

✖

**Date**

✖

**Error**

✖

**Regex**

✖

**Dom节点**

✖

并且在对象具有**环引用**的情况下，这种深拷贝方式会导致报错

![](/images/jueJin/ab9294b013344dc.png)

![](/images/jueJin/e97d257542e246b.png)

lodash.cloneDeep
----------------

lodash 的 `cloneDeep`也是深拷贝的手段之一，且非常完善，能成功拷贝各种数据类型

但是大家要注意使用 lodash 时要使用 `lodash-es`，这样才能做到按需加载，减少不必要的代码体积

![](/images/jueJin/1ca4d617433d414.png)

![](/images/jueJin/e11298187c644a0.png)

数据类型

克隆结果

**number**

✔

**string**

✔

**undefined**

✔

**null**

✔

**boolean**

✔

**object**

✔

**Array**

✔

**Function**

✔

**map**

✔

**Set**

✔

**Date**

✔

**Error**

✔

**Regex**

✔

**Dom节点**

✔

window.structuredClone
----------------------

全局的 `structuredClone()` 方法使用结构化克隆算法将给定的值进行深拷贝

![](/images/jueJin/cd090f639dac454.png)

![](/images/jueJin/0af73151aa00430.png)

当克隆`Function、Dom节点`时，会报错

![](/images/jueJin/61f1c63f7ffc4f7.png)

![](/images/jueJin/e00c902bc1264f7.png)

其他数据类型可以成功拷贝~

![](/images/jueJin/351de7ead83d44c.png)

数据类型

克隆结果

**number**

✔

**string**

✔

**undefined**

✔

**null**

✔

**boolean**

✔

**object**

✔

**Array**

✔

**Function**

✖

**map**

✔

**Set**

✔

**Date**

✔

**Error**

✔

**Regex**

✔

**Dom节点**

✖

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