---
author: "Sunshine_Lin"
title: "Set 迎来史诗级加强，新增 7 个实用方法！"
date: 2024-07-30
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 前几天 JavaScript 正式官宣，发布了 7 个Set的新方法，而且都非常的实用，也是很多前端"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:6,comments:4,collects:6,views:229,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

前几天 JavaScript 正式官宣，发布了 7 个`Set`的新方法，而且都非常的实用，也是很多前端开发者心心念念的方法~

有哪些新的 Set 方法呢？
--------------

总共有 7 个新的方法，分别是：

*   `intersection()` 计算两个 Set 的 **交集**
*   `union()` 计算两个 Set 的 **并集**
*   `difference()` 计算两个 Set 的 **差集**
*   `symmetricDifference()` 取两个 Set 的 **差集** 的 **并集**
*   `isSubsetOf()` 判断 Set 是否是另一个 Set 的 **超集**
*   `isDisjointFrom()` 判断 Set 是否与另一个 Set **无交集**

下面通过几个代码案例给大家讲解~

intersection()
--------------

这个方法用于取两个 Set 的 **交集**

![image.png](/images/jueJin/e1b9baa709f340b.png)

代码示例如下：

![image-1.png](/images/jueJin/4fc07d1419a9414.png)

union()
-------

这个方法用于取两个 Set 的 **并集**

![image-2.png](/images/jueJin/855be84ee0c6462.png)

代码示例如下：

![image-3.png](/images/jueJin/d0ec924f2cb246f.png)

difference()
------------

这个方法用于取两个 Set 的 **差集**

![image-5.png](/images/jueJin/4011d44080534c3.png)

代码示例如下：

![image-7.png](/images/jueJin/f842d62e5fcc43f.png)

symmetricDifference()
---------------------

这个方法用于取两个 Set 的 **差集** 的 **并集**

![image-8.png](/images/jueJin/9b7b69a06ac44bd.png)

代码示例如下：

![image-9.png](/images/jueJin/7e6bdffab96f431.png)

isSubsetOf()
------------

这个方法判断 Set 是否是另一个 Set 的 **子集**，是的话返回 `true`，否则返回`false`

![image-11.png](/images/jueJin/89a8a13f9060428.png)

代码示例如下：

![image-10.png](/images/jueJin/0bba5494b77f4db.png)

isSupersetOf()
--------------

这个方法判断 Set 是否是另一个 Set 的 **超集**，是的话返回 `true`，否则返回`false`

其实跟 `isSubsetOf()` 很相似，只不过前后角色顺序反过来了罢了

![image-11.png](/images/jueJin/15acc4a4aad940f.png)

代码示例如下：

![image-13.png](/images/jueJin/462e4b90221345f.png)

isDisjointFrom()
----------------

这个方法判断 Set 是否与另一个 Set **无交集**，是的话返回 `true`，否则返回`false`

![image-15.png](/images/jueJin/aa42a21603d44eb.png)

代码示例如下：

![image-14.png](/images/jueJin/61b300c6af0a45d.png)

兼容性
---

目前这些方法只能在`Node 22+、Chrome/Edge 122+、Firefox 127+、Safari 17+`中使用

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

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有10000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")