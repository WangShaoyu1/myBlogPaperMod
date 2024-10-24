---
author: "Sunshine_Lin"
title: "无意中发现 Vue3 的小技巧，帮我节省很多代码"
date: 2024-08-19
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 最近在开发 Vue3 项目时偶然发现了一个技巧：组件的事件往下传可以进行叠加！，感觉对大家的开发肯定"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:8,comments:5,collects:3,views:630,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

最近在开发 Vue3 项目时偶然发现了一个技巧：**组件的事件往下传可以进行叠加！**，感觉对大家的开发肯定有帮助，能节省很多代码量！！！我会通过一个小案例来跟大家讲解这个小技巧的好处体现在哪~

场景
--

先来说说我的场景吧，我在项目开发中对一个基础组件 `BasicComp.vue`进行二次封装，总共封装了两层，如下图

![image-1.png](/images/jueJin/ce86cdbe6858484.png)

我先把 `BasicComp.vue` 简单化一下：

![image-2.png](/images/jueJin/e13f5fef5dee4c3.png)

而我想要做的效果是在 `Page.vue、Index.vue`中都能调用`BasicComp.vue`身上的方法`changeShow`去控制`show`变量的改变，比如下面的效果

![register-1.gif](/images/jueJin/2e3e0ba442364ac.png)

实现代码如下：

**SecondComp.vue**

![image-3.png](/images/jueJin/64307be9cb8e42b.png)

**Index.vue**

![image-4.png](/images/jueJin/beab2710636042e.png)

**Page.vue**

![image-5.png](/images/jueJin/934fc51945bc4e7.png)

太麻烦了！
-----

大家也看到了，上面的代码实现非常麻烦，得一层一层利用 `emits` 往上传

但是突然有一天我发现了一个 Vue3 的特性，貌似很多人都没发现，那就是：**组件的事件往下传可以进行叠加！**

什么意思呢？我通过一个小例子来说明，我准备了 祖孙三个组件

**Sunzi.vue**

![image-6.png](/images/jueJin/3ec90826a4e2490.png)

**Erzi.vue**

![image-7.png](/images/jueJin/61157f4b22ab45a.png)

**Yeye.vue**

![image-8.png](/images/jueJin/10a91833afac461.png)

最终结果表现为：

![image-9.png](/images/jueJin/1e16975e366a4ab.png)

我在`Erzi.vue` 中并没有去接收 `Yeye.vue` 传下来的 emits，但是它却能透传到`Sunzi.vue` 中，并且两者叠加

代码优化
----

通过刚刚发现的小特性，我们可以对一开始的代码进行优化

只需要封装一个 Hooks

![image-10.png](/images/jueJin/770b9e72659949b.png)

**Index.vue**

![image-11.png](/images/jueJin/aa0f807a43684cf.png)

**Page.vue**

![image-12.png](/images/jueJin/1dfaed4beb9d418.png)

最终达到想要的结果

![image-9.png](/images/jueJin/190945194e12493.png)

Vben-Admin
----------

Vben-Admin 是一个非常出色的开源 Vue3 项目，它代码中就大量使用了 **事件叠加** 的技巧，尤其是 `Table、Drawer、Modal` 这类可控组件

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