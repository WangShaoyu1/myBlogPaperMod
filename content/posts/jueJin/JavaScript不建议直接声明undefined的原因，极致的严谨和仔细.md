---
author: "天天鸭"
title: "JavaScript不建议直接声明undefined的原因，极致的严谨和仔细"
date: 2024-04-05
description: "很多人写JavaScript代码时习惯用vara=undefined这种写法，其实这种写法在特定条件下会有漏洞。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读2分钟"
weight: 731
---
前言：
---

很多人写JavaScript代码时习惯用var a = undefined 这种写法，其实这种写在某种情况下会产生意想不到的bug，又或者说undefined本身就是JavaScript的一个bug?? 为什么这么说呢， 因为undefined它应该是关健字才合理的，但undefined在JavaScript里面压根就不是关健字，它是window的一个属性即window.undefined, 没想到吧。

为什么发现这个冷门知识点？？
--------------

因为最近在拜读一些包的底层源码时，发现有一种很有意思的写法我不太理解var a = void 0; 然后我就去各方查资料，发现这种写法有两个好处，1、是能降低文件大小，2、秉承犀牛书的观点，任何时候都不主动声明undefined。

任何时候都不主动声明undefined的原因
----------------------

> 前面说到了undefined在JavaScript里面压根就不是关健字，而是一个属性，在控制台window.undefined就知道了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75dda52f8a23426983c323bcde9a8f3f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=593&h=90&s=5456&e=png&b=ffffff)

> 但它是一个只读属性，我们是无法对undefined重新赋值的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7240a5e19c144151ae3eb2a9fd5c97f6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=584&h=183&s=11200&e=png&b=ffffff)

> 虽然是只读属性，但是在特定条件下还是会出现bug，如下所示

javascript

 代码解读

复制代码

`function test() {     var undefined = '我是test';      var a = undefined;     console.log(a) } test()   // '我是test'`

看出来问题了不，var a = undefined 但 这里的undefined是方法内部的undefined而不是window的，所以拿到的是'我是test'， 虽然理论上不会出现这种场景，但这确实就是一个漏洞了。

推荐写法
----

犀牛书的观点，用null表示空，但用 var a = void 0 这种写法也行。void后面不一定就是写0，因为void 表达式最终会返回一个undefined，如下所示。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c31ae920c98443e8f550849924e7a6c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=609&h=180&s=8447&e=png&b=ffffff)

> 注意：void是会执行右边的语句然后返回undefined。所以如果右边语句有副作用的话还是能看到不一样的，所以用一个无副作用的0

总结：
---

一个很有意思的小知识点，感觉有朝一日面试时能说出来挺有意思的，单纯是分享一下互相学习。