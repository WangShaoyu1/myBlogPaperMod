---
author: "Sunshine_Lin"
title: "Vue 的 style 加了 scoped 也会样式冲突？可怕！"
date: 2024-04-06
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 太细了！ 最近在看一篇微前端的文章的时候，看到了这么一个评论，瞬间引起了我的求知欲，这个评论是这样的"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:33,comments:0,collects:36,views:2141,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

太细了！
----

最近在看一篇微前端的文章的时候，看到了这么一个评论，瞬间引起了我的求知欲，这个评论是这样的

![](/images/jueJin/79c6591f2520455.png)

可能有些人不知道微前端是啥，也不知道 `主应用` 和 `子应用` 是啥，我画一个图给大加简单展示一下吧：

![](/images/jueJin/11a59355c1f8405.png)

在这里再说一下 vue 文件的 `scoped style` 是怎么做到样式隔离的，其实就是 `vue解析器` 在解析 vue 文件的时候，会通过内部的一种计算方法（`怎么算的后面会说`），给每一个 vue 文件的 html 标签加上 `data-v-xxx` 这样的属性，接着通过 `属性选择器` ，来进行样式隔离，也叫样式模块化

![](/images/jueJin/0cb064ef83284cf.png)

![](/images/jueJin/195a4e47e16c4e1.png)

![](/images/jueJin/8560fcc28e5c4b2.png)

回到刚刚那个问题，微前端项目中的 `主项目` 和 `子项目` 由于存在了`相同相对路径`的 vue 文件，导致了两个项目的两个 vue 文件的样式产生了冲突~

所以，我们可以初步知道了，`data-v-xxx`这个属性是根据 `vue文件相对路径`去计算出来的。但这也只是初步而已，具体我们还得去看一下源码才行，这样才能锻炼我们解决问题的能力~

Vue2 和 Vue3 的计算方式大差不差
---------------------

### 简单看源码

先来看看 `Webpack + vue-loader` 对 `Vue2` 是怎么处理的，源码链接：[github.com/vuejs/vue-l…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-loader%2Fblob%2F8357e071c45e77de0889a9feedf2079a327f69d4%2Fsrc%2Findex.ts%23L142 "https://github.com/vuejs/vue-loader/blob/8357e071c45e77de0889a9feedf2079a327f69d4/src/index.ts#L142")

![](/images/jueJin/e5c5ae919bf94c4.png)

再来看看 `vite + @vitejs/plugin-vue` 对于 `Vue3`是怎么处理的，源码链接：[github.com/vitejs/vite…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite-plugin-vue%2Fblob%2Fmain%2Fpackages%2Fplugin-vue%2Fsrc%2Futils%2FdescriptorCache.ts "https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/utils/descriptorCache.ts")

![](/images/jueJin/502b5d5c5aea465.png)

### 开发环境 & 生产环境

其实两种的解析方式大差不差，总结为以下：

*   **开发环境：** 根据`文件的相对路径`进行计算`data-v-xxx`
*   **生产环境：** 根据与文件的`相对路径 + 文件内容`进行计算 `data-v-xxx`

所以可以看出在开发环境和生产环境的时候，都有可能两个 vue 文件的 scoped style 样式发生冲，虽然这只是比较边界的情况~

为什么开发环境不把`文件内容`加入计算呢？我想应该是因为开发阶段文件内容变化的比较频繁，所以如果把`文件内容`加入计算的话，势必会造成构建时间的加长。

如何防样式冲突？
--------

虽然 scoped style 发生样式冲突只是小概率事件，但是我们也得思考一下怎么去避免呢？

掘金有一个大佬，给 Vue 官方提了一个 PR，就是在计算 `data-v-xxx`的时候，加入 `package.json 的 name`进行计算，也就是项目名，这样能防止两个不同项目之间的样式冲突~

大佬牛啊！！！

![](/images/jueJin/ffc161221c194bb.png)

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