---
author: "前端之虎陈随易"
title: "陈随易：Node.jsv22更新记录"
date: 2024-04-25
description: "大家好，我是前端之虎陈随易。目前是：农村程序员(自2020年离职至今都在农村待着)独立开发者(有多个已经在盈利中的产品)自由职业者(睡到自然醒，困就马上睡)个人创业者(注册了自己"
tags: ["前端","JavaScript","Node.js"]
ShowReadingTime: "阅读3分钟"
weight: 239
---
大家好，我是前端之虎陈随易。

目前是：

*   农村程序员 (自 `2020` 年离职至今都在农村待着)
*   独立开发者 (有多个已经在盈利中的产品)
*   自由职业者 (睡到自然醒，困就马上睡)
*   个人创业者 (注册了自己的公司，为产品服务)
*   自驾爱好者 (经常自驾，边看风景边敲码)
*   小说写作者 (抽空码字中)
*   开源推进者 (自 `2019` 年持续开源至今)

欢迎跟我交朋友：

*   公众号：`陈随易`
*   个人网站：[chensuiyi.me](https://link.juejin.cn?target=https%3A%2F%2Fchensuiyi.me "https://chensuiyi.me")

让我们一起积极向上，为自己而努力奋斗！

正文
--

2024年04月25日，Node.js v22 版本正式发布了，让我们来看看这个版本的更新内容吧~

ESM：放弃对导入断言的支持
--------------

用过 assets 没？它的写法是这样的。

javascript

 代码解读

复制代码

`import data from './data.json' assert { type: 'json' };`

使用 asset 来指定导入资源的类型。

那么在 CommonJS 时代，导入 js 和导入 json 都不用特意区分的。

javascript

 代码解读

复制代码

`const data = require('./data.json');`

本次的 Node.js v22 版本发布后，asset 被废弃了。

那么我要使用 import 导入 json 文件，该怎么做呢？

其实很简单，把 assets 换成 with 即可。

javascript

 代码解读

复制代码

`import data from './data.json' with { type: 'json' };`

Chrome 浏览器也将会在 v126 版本，讲 asset 语法移除，请大家注意，根据自身情况调整。

内置测试框架被标记为稳定
------------

用一个图来说明下。

![picture 0](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eea63847bad74a0182b0701ad6303ddc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=900&h=793&s=426077&e=png&b=282924)

图片来源：`@liran_tal`

也就是说，v22 版本以前，你要做测试用例时需要安装红色部分的一大堆依赖。

这个版本以后，红色部分都可以删掉了，只需要图中 3 行绿色代码即可。

不得不说，Node.js 真是越来越好用了。

### 默认启用 WebSocket 客户端

v22 以前的版本

javascript

 代码解读

复制代码

`console.log(WebSocket);`

得到：

bash

 代码解读

复制代码

`console.log(WebSocket);             ^ ReferenceError: WebSocket is not defined     at file:///D:/codes/yicode.tech/labs/test.js:1:13     at ModuleJob.run (node:internal/modules/esm/module_job:222:25)     at async ModuleLoader.import (node:internal/modules/esm/loader:323:24)     at async loadESM (node:internal/process/esm_loader:28:7)     at async handleMainPromise (node:internal/modules/run_main:113:12) Node.js v20.12.1`

v22 版本以后，得到：

bash

 代码解读

复制代码

`[class WebSocket extends EventTarget] {   CONNECTING: 0,   OPEN: 1,   CLOSING: 2,   CLOSED: 3 }`

require 可以导入 esm 模块了
--------------------

官方的 ESM 规范发布以来，以前的语法 require 导入 esm 包的问题一直处于争论中。

那么 v22 版本后，这个问题已经解决了一部分，现在可以使用 require 去导入 esm 模块了。

esm 文件：

javascript

 代码解读

复制代码

`// point.mjs export function distance(a, b) {     return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; } class Point {     constructor(x, y) {         this.x = x;         this.y = y;     } } export default Point;`

require 导入 esm 文件：

javascript

 代码解读

复制代码

`// main.js const required = require('./point.mjs'); // [Module: null prototype] { //   default: [class Point], //   distance: [Function: distance] // } console.log(required); (async () => {     const imported = await import('./point.mjs');     console.log(imported === required); // true })();`

fs 新增 glob 和 globSync 方法
------------------------

难道是跟 Bun 学的？

在 v22 版本以前，我们要获取某个目录所有以 `.js` 结尾的文件，那么我们要么获取全部文件，然后遍历过滤。

要么使用第三方库，比如 `fast-glob` 处理。

那么在 v22 版本以后，可以直接使用 `fs.glob` 或 `fs.globSync` 来实现这个功能了。

javascript

 代码解读

复制代码

`import { glob } from 'node:fs/promises'; for await (const entry of glob('**/*.js')) {     console.log(entry); }`

Node.js 的一小步，好用了一大截。

随易总结
----

Node.js v22 版本的更新，真的是下血本了。

几个重要的，实验性的功能都标记为稳定版了。

期待 Node.js 越来越好。