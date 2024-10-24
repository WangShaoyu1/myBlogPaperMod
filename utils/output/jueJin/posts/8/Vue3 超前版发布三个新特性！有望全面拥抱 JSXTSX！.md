---
author: "Sunshine_Lin"
title: "Vue3 超前版发布三个新特性！有望全面拥抱 JSXTSX！"
date: 2024-04-17
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 拥抱 JSXTSX？ 我们都知道 Vue 一直主流是使用 template 模板来进行页面的编写 "
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:137,comments:107,collects:108,views:17565,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

拥抱 JSX/TSX？
-----------

我们都知道 Vue 一直主流是使用 template 模板来进行页面的编写

而就在最近，Vue3 的超前项目 **Vue Macros** 中，发布了 `defineRender、setupComponent、setupSFC` 这些新的 API，这代表了，以后 Vue3 有可能可以全面拥抱 JSX/TSX 了！！

说这个新 API 之前，我们先来说说什么是 **Vue Macros**

Vue Macros
----------

Vue Macros 是由 Vue 团队成员维护的一个 **超前版 Vue**

许多 Vue3 的新 API 都是在这个项目中孵化出来的，比如 Vue3.4 的：

*   `defineOptions`
*   `defineModel`

所以从 Vue Macros 这个项目，也可以预见到 Vue3 未来可能会发布的新 API 和新特性

![](/images/jueJin/bb872ef964ab464.png)

Vue Macros 中很多功能都是**超前功能**，在 Vue3 正式版中并没有这些功能，如果想要体验这些超前功能，需要安装对应的插件

```bash
npm i -D unplugin-vue-macros
```

并在 vite.config.ts 中配置这个插件

![](/images/jueJin/86fcea4e4d1f4a6.png)

回顾 Vue3 现有渲染方式
--------------

### template

我们在开发 Vue 时，在很多情况下，都会使用 template 来编写页面

![](/images/jueJin/f7a4735bf3894c1.png)

### h 函数

但是在编写一些比较灵活且基础的组件（比如组件库）时，使用 template 来编写比较费劲，所以有些时候也会使用 `h` 函数来编写

![](/images/jueJin/39310c7bed17490.png)

但是可以看到，虽然 h 函数更加贴近 JavaScript，更加灵活，但是当层级太多时，写起来也是非常的不方便~

### @vitejs/plugin-vue-jsx

所以 Vue3 在之前推出了 `@vitejs/plugin-vue-jsx` 这个插件，目的就是为了开发者能在 Vue3 项目中去使用 JSX/TSX

```bash
pnpm i @vitejs/plugin-vue-jsx
```

![](/images/jueJin/6527c698927a4cd.png)

![](/images/jueJin/63dbfd1dd3f849b.png)

拥抱 JSX/TSX！！！
-------------

### defineRender

**defineRender** 是 Vue 超前项目 **Vue Macros** 中推出的一个新的 API，它很有大可能会在未来的 Vue3 正式版中推出

我们可以通过安装 **Vue Macros** 的插件来体验这一超前功能

![](/images/jueJin/d73504b220c641a.png)

### setupComponent

setupComponent 让 Vue3 越来越像 React 了！！！在超前项目中，推出了 defineSetupComponent 这个 API ，让你可以使用 JSX 去编写一个组件

![](/images/jueJin/e5f733704b3f4ae.png)

![](/images/jueJin/86772af48413486.png)

### setupSFC

setupSFC 的模式下，无需在包裹 defineSetupComponent 这个函数了，甚至可以直接写在 tsx 文件中，来编写一个 SFC

![](/images/jueJin/351d00f928c64c2.png)

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