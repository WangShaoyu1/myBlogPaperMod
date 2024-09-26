---
author: "天天鸭"
title: "Vue内置指令v-once、v-memo和v-pre提升性能？"
date: 2024-08-27
description: "Vue的内置指令估计大家都用过不少，例如v-for、v-if之类的就是最常用的内置指令，但今天给大家介绍几个平时用的比较少的内置指令。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 744
---
前言
--

`Vue`的内置指令估计大家都用过不少，例如`v-for`、`v-if`之类的就是最常用的内置指令，但今天给大家介绍几个平时用的比较少的内置指令。毕竟这几个`Vue`内置指令可用可不用，不用的时候系统正常跑，但在对的地方用了却能提升系统性能，下面将结合示例进行详细说明。

一、v-once
--------

**作用**：在标签上使用`v-once`能使元素或者表达式只渲染一次。首次渲染之后，后面数据再发生变化时使用了`v-once`的地方都不会更新，因此用在数据不需要变化的地方就能进行性能优化。

**`v-once`指令实现原理：** `Vue`组件初始化时会标记上`v-once`，首次渲染会正常执行，后续再次渲染时如果看到有`v-once`标记则跳过二次渲染。

**示例代码**： 直接作用在标签上，可以是普通标签也可以是图片标签，当`2S`后数据变化时标签上的值不会重新渲染更新。

xml

 代码解读

复制代码

`<template>   <div>     <span v-once>{{ message }}</span>     <img v-once :src="imageUrl"></img>   </div> </template> <script setup> import { ref } from 'vue'; let message = ref('Vue指令!'); let imageSrc = ref('/path/my/image.jpg'); setTimeout(() => {   message.value = '修改内容!';   imageUrl.value = '/new/path/my/images.jpg'; }, 2000); </script>`

**注意：** 作用`v-once`会使属性失去响应式，要确保这个地方不需要响应式更新才能使用，否则会导致数据和页面视图对不上。

二、v-pre
-------

**作用：** 在标签上使用`v-pre`后，`Vue`编译器会自动跳过这个元素的编译。使用此内置指令后会被视为静态内容。

**`v-pre`指令实现原理：** `Vue`初次编译时如果看到有`v-pre`标记，那么跳过这部分的编译，直接当成原始的`HTML`插入到`DOM`中。

**示例代码**： 常规文本会正常编译成`您好！`，但使用了`v-pre`后会跳过编译原样输出`{{ message }}`。

xml

 代码解读

复制代码

`<template>   <div>     <h2>常规: {{ message }}</h2>     <h2 v-pre>使用v-pre后: {{ message }}</h2>   </div> </template> <script setup> import { ref } from 'vue'; let message = ref('您好!'); </script>`

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9527a37afeb8489eb371627eeda91852~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727784649&x-signature=22BXf%2F2pZ6QLndykEU1Fcks4a8Q%3D)

**注意：** 要区分`v-pre`和`v-once`的区别，`v-once`用于只渲染一次，而`v-pre`是直接跳过编译。

> 这个指令可能很多人没想到应用场景有那些，其实最常见的用途就是要在页面上显示`Vue`代码，如果不用`v-pre`就会被编译。如下所示使用`v-pre`场景效果。

xml

 代码解读

复制代码

`<template>   <div>     <pre v-pre>       &lt;template&gt;         &lt;p&gt;{{ message }}&lt;/p&gt;       &lt;/template&gt;       &lt;script setup&gt;       import { ref } from 'vue';       const message = ref('Hello Vue!');       &lt;/script&gt;     </pre>   </div> </template> <script setup> import { ref } from 'vue'; let message = ref('您好!'); </script>`

**页面上展示：** 代码原始显示不会被编译。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/35a7e634a25149e292da88aaebf2552e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727784649&x-signature=TP7X33Q05nqaNPGZ84RGGf7Q9vQ%3D)

三、v-memo（支持3.2+版本）
------------------

**作用：** 主要用于优化组件的渲染方面性能，能控制达到某个条件才重新当堂组件，否则不重新渲染。`v-memo` 会缓存 `DOM`，只有当指定的数据发生变化时才会重新渲染，从而减少渲染次数提升性能。

**`v-memo` 指令实现原理：** `Vue`初始化组件时会识别是否有`v-memo`标记，如果有就把这部分`vnode`缓存起来，当数据变化时会对比依赖是否变化，变化再重新渲染。

**示例代码：** 用`v-memo` 绑定了`arr`，那么当`arr`的值变化才会重新渲染，否则不会重新渲染。

xml

 代码解读

复制代码

`<template>   <div>     <ul v-memo="arr">       <li v-for="(item, index) in arr" :key="index">         {{ item.text }}       </li>     </ul>   </div> </template> <script setup> import { ref } from 'vue'; let arr = ref([   { text: '内容1' },   { text: '内容2' },   { text: '内容3' } ]); setInterval(() => {   arr.value[1].text = '修改2'; }, 2000); </script>`

**注意：** 用`v-memo`来指定触发渲染的条件，但只建议在长列表或者说复杂的渲染结构才使用。

小结
--

总结了几个比较冷门的`Vue`内置指令，平时用的不多，但用对了地方却能明显提升性能。如果那里写的不对或者有好建议欢迎大佬指出啊。