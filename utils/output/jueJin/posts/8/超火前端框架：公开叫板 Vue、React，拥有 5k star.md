---
author: "Sunshine_Lin"
title: "超火前端框架：公开叫板 Vue、React，拥有 5k star"
date: 2024-04-20
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ Nuejs 最近有一个很火的前端新框架，github 上已经有 5k 的star，这势头是真的猛 我"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:2,views:407,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

Nuejs
-----

最近有一个很火的前端新框架，github 上已经有 5k 的star，这势头是真的猛

![](/images/jueJin/b32094648b8847d.png)

![](/images/jueJin/71c96eb35f044e5.png)

我看了一下，这个 Nuejs 框架大体上有几个主要的特点：

*   体积非常的小巧，只有 `2.3k minzipped`
*   代码量比较少，比较容易上手，代码`少了十倍`
*   与`Vue.js、React.js`或 Svelte 不同，它没有`hooks、effects、props、portals`等特殊抽象概念。只需掌握 `HTML、CSS 和 JavaScript` 基础知识你就可以试着去使用它了。

![](/images/jueJin/9c991deace5c48e.png)

非常的小巧
-----

刚刚说了，**Nuejs** 与`Vue.js、React.js`或 Svelte 不同，它没有`hooks、effects、props、portals`等特殊抽象概念。只需掌握 `HTML、CSS 和 JavaScript` 基础知识你就可以试着去使用它了

所以它少了大部分的代码，整体体积只有`2.3k minzipped`，大大缩小了项目的体积。

**Nuejs** 是通过 HTML 模板语法来编写界面的。如果 React、Vue 是 “纯JavaScript”，那么 **Nuejs** 可以说是 “纯HTML”

![](/images/jueJin/3bc33c6b46a345c.png)

Nuejs 生态？
---------

作者打算将 **Nuejs** 成为一个生态系统的核心，后续计划还会包括：

*   **Nue CSS：** 用来代替 CSS-in-JS、Tailwind 和 SASS
*   **Nue MVC：** 用来构建单页应用
*   **Nue UI：** 一个组件库，用来快速编写页面
*   **Nuemark：** 一个 markdown 的库，用来编写漂亮的 md 内容
*   **Nuekit：** 用于用更少的代码构建网站和web应用。

作者觉得，如果这个 Nuejs 生态全部搭建起来，那么 Nuejs 将可能代替 Vite、Next.js 和 Astro 这些热门的前端框架库

简单看看，不必学习
---------

其实这个框架我们现阶段完全可以不用学习，了解一下就好了

我们可以看看这个前端框架长什么样子，我们先用 git 把这个项目给拷贝下来

```bash
git clone https://github.com/nuejs/create-nue.git
```

在 vscode 中可以安装一下 Nuejs 的插件，这样的话 .nue 文件里的内容才会有高亮

![](/images/jueJin/25f67503934b42d.png)

我们可以看一下 **simple-app** 中的代码，可以看出个大概

![](/images/jueJin/98e44ecd35894ce.png)

先看看 index.html

![](/images/jueJin/838ad8e8c1e847f.png)

再看看 app.nue

![](/images/jueJin/c217e39682a2417.png)

我看了一下，整个文件就像是在写 HTML 一样，通过注释可以看出，还可以在路由跳转的时候去执行一些操作

每一个文件最外层的标签上都有 @name，应该是通过这个来给这个组件命名

![](/images/jueJin/0453242dc65b457.png)

![](/images/jueJin/cad437834279463.png)

然后可以通过路由回调中的`mountChild`去加载对应名称的组件页面，并且在跳转的时候可以进行传参

![](/images/jueJin/40b0fb4c9ab7417.png)

并且在跳转目标组件中，可以通过`constructor`进行接收参数

![](/images/jueJin/50b2c2b7c6ca40f.png)

并且可以看到，组件传参跟 Vue 很像

![](/images/jueJin/edd1f8d720ce489.png)

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