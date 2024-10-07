---
author: "扫地盲僧"
title: "《高阶前端指北》之短小而精悍的现代TS工具库"
date: 2022-08-12
description: "为了能够让`Fastool`得到更好的维护，我们特意为其加持了一些能力：-✅完整的TypeScript定义-✅适用于现代ES6规范-✅涵盖多数开发所需的方法-✅支持动态插件库"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读2分钟"
weight: 926
---
携手创作，共同成长！这是我参与「掘金日新计划 · 8 月更文挑战」的第8天，[点击查看活动详情](https://juejin.cn/post/7123120819437322247 "https://juejin.cn/post/7123120819437322247")

前段时间练手`TypeScript`，把业务中的JS工具全部改写了一遍，剔除一些涉及业务功能的方法。后来越写越感觉上瘾，越写想写的东西越多，大家都知道越多越不好，越轻量越受欢迎。于是，又又又重新折腾了一遍。

Fastool
=======

一个短小而精悍的现代JavaScript使用工具库，它涉及了开发过程中常用到的基操，非常符合高阶前端的风格。

![fastool.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd4981090574ee4bedba33fdc15e7f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

为了能够让`Fastool`得到更好的维护，我们特意为其加持了一些能力：

*   ✅ 完整的TypeScript定义
*   ✅ 适用于现代ES6规范
*   ✅ 涵盖多数开发所需的方法
*   ✅ 支持动态插件库，随时拓展
*   ✅ 采用Vitepress部署文档
*   ✅ 支持按需引入，支持多种规范(umd/esm/cjs等)
*   ✅ 更多能力等你挖掘....

使用
==

> 如果你不想在项目中引入太多依赖，而又想使用某一个方法 那么可以复制文档中的源码，在你的项目中引入

import
------

bash

 代码解读

复制代码

`# pnpm 🔥 pnpm add fastool # npm npm install fastool # yarn yarn add fastool`

CDN源
----

**jsdelivr** [cdn.jsdelivr.net/npm/fastool](https://link.juejin.cn?target=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Ffastool "https://cdn.jsdelivr.net/npm/fastool")

**unpkg** [unpkg.com/fastool](https://link.juejin.cn?target=https%3A%2F%2Funpkg.com%2Ffastool "https://unpkg.com/fastool")

文档地址
====

> 特意定制了nextUI的主题,是不是颜值在线？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1220c7e379a4406c984e3b13c04888f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)  
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc4d801d503473996b2dd0aee68df88~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

[文档介绍](https://link.juejin.cn?target=https%3A%2F%2Ftobe-fe-dalao.github.io%2Ffastool%2Fguide%2F "https://tobe-fe-dalao.github.io/fastool/guide/")  | [仓库地址](https://link.juejin.cn?target=https%3A%2F%2Ftobe-fe-dalao.github.io%2Ffastool%2F "https://tobe-fe-dalao.github.io/fastool/") | [npm地址](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ffastool "https://www.npmjs.com/package/fastool")

我想参与
====

> 为了收集更多优秀实用函数，我们希望更多的人加入进来，你可以短短几分钟的时间就可以贡献你的代码

注释即文档
-----

为了最大化降低维护成本，我们统一实用标准的注释作为文档

typescript

 代码解读

复制代码

`/**  * @func isBrowser  * @return {boolean}  * @desc 检测代码是否运行在浏览器环境  * @example if (isBrowser()) {...}  */`

完整例子
----

typescript

 代码解读

复制代码

`/**  * @func smoothScroll  * @param {number} top 滚动到的位置  * @param {number} duration 滚动的时间  * @returns {void}  * @desc 📝 平滑滚动到指定位置  * @example smoothScroll(0, 1000); */ export const smoothScroll = (to: number, duration: number = 300): void => {   const start = document?.documentElement?.scrollTop ?? document?.body?.scrollTop;   const change = to - start;   const startDate = +new Date();   const tick = (): void => {     const now = +new Date();     const val = Math.min(1, (now - startDate) / duration);     window.scrollTo(0, start + change * val);     if (val < 1) {       window.requestAnimationFrame(tick);     }   }   window.requestAnimationFrame(tick); }`

基于canvas的处理只写了一部分，欢迎大家补充

typescript

 代码解读

复制代码

``/**  * @func getImageBase64Url  * @param {HTMLImageElement} image  * @returns {string}  * @desc 获取图片base64Url  * @example getImageBase64Url(image)  */ export function getImageBase64Url(image: HTMLImageElement): string {   const canvas = document.createElement('canvas');   canvas.width = image.width;   canvas.height = image.height;   const ctx = canvas.getContext('2d');   ctx?.drawImage(image, 0, 0, image.width, image.height);   const suffix = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();   return canvas.toDataURL(`image/${suffix || 'png'}`, 1); }``

维护者
===

这个项目需要感谢的参与者：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9de786c279d0468d8b9c5efe850756ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

总结
==

恭喜你，忍住了枯燥，耐住了无聊，学完了本节课。 闲着没事的朋友可以我，**点个赞**，**评个论**，**收个藏**，**关个注**。  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c77afd4d309c48129d01604457f2b05a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)   
手绘图，手打字，纯原创，摘自未发布的书籍：《高阶前端指北》，转载请获得本人同意。