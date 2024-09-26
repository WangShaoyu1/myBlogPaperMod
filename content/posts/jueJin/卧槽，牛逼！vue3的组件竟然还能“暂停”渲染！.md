---
author: "前端欧阳"
title: "卧槽，牛逼！vue3的组件竟然还能“暂停”渲染！"
date: 2024-08-18
description: "有没有一种完美的方案，从服务端获取数据的逻辑放在子组件中，并且在获取数据的期间让子组件“暂停”一下，先不去渲染，等到数据请求完成后再第一次去渲染子组件呢？"
tags: ["前端","Vue.js","JavaScript"]
ShowReadingTime: "阅读9分钟"
weight: 802
---
前言
==

有的时候我们想要`从服务端拿到数据后`再去渲染一个组件，为了实现这个效果我们目前有几种实现方式：

*   将数据请求放到父组件去做，并且使用`v-if`控制拿到子组件后才去渲染子组件，然后将数据从父组件通过`props`传给子组件。
    
*   在子组件的`onMounted`中请求数据，并且使用`v-if`在子组件的`template`最外层进行控制，只有拿到数据后才渲染子组件中的内容。
    

上面这两种方案都有各自的缺点，不够完美。最理想的方案是将从服务端获取数据的逻辑放在子组件中，并且在获取数据的期间让子组件`“暂停”`一下，先不去渲染，等到数据请求完成后再第一次去渲染子组件。

[加入欧阳的高质量vue源码交流群、欧阳平时写文章参考的多本vue源码电子书](https://link.juejin.cn?target=https%3A%2F%2Fvue-compiler.iamouyang.cn%2Fguide%2Fcontact.html "https://vue-compiler.iamouyang.cn/guide/contact.html")

完美的解决方案
=======

第一种方法的缺点是：子组件虽然拿到数据后才开始渲染，但是数据请求的逻辑却放到了父组件上面，我们期望所有的逻辑都封装在子组件内部。

第二种方法的缺点是：实际上是初始化时就渲染了一次子组件，此时我们还没从服务端拿到数据。所以不得不使用`v-if`在`template`的最外层控制，此时不渲染子组件中的内容。当从服务端拿到数据后再第二次渲染子组件，此时才将子组件中的内容渲染到页面上。`这种方法明显子组件渲染了2次。`

**那么有没有一种完美的方案，从服务端获取数据的逻辑放在子组件中，并且在获取数据的期间让子组件`“暂停”`一下，先不去渲染，等到数据请求完成后再第一次去渲染子组件呢？**

答案是：当然可以，vue3的`Suspense组件`+`在setup顶层使用await获取数据`就能完美的实现这个需求！！！

两个不完美的例子
========

为了让你更直观的看到完美方案的牛逼，我们先来看看前面讲的两个不够完美的例子。

父组件中请求数据的例子
-----------

下面这个是父组件中请求数据的例子，父组件的代码如下：

javascript

 代码解读

复制代码

`<template>   <ChildDemo v-if="user" :user="user" />   <div v-else>     <p>loading...</p>   </div> </template> <script setup lang="ts"> import { ref, onMounted } from "vue"; import ChildDemo from "./Child.vue"; const user = ref(null); async function fetchUser() {   return new Promise((resolve) => {     setTimeout(() => {       resolve({         name: "张三",         phone: "13800138000",       });     }, 2000);   }); } onMounted(async () => {   user.value = await fetchUser(); }); </script>`

子组件的代码如下：

javascript

 代码解读

复制代码

`<template>   <div>     <p>用户名：{{ user.name }}</p>     <p>手机号：{{ user.phone }}</p>   </div> </template> <script setup lang="ts"> const props = defineProps(["user"]); </script>`

这种方案我们将从服务端获取`user`的逻辑全部放到了父组件中，并且使用`props`将`user`传递给子组件，并且在从服务端获取数据的期间显示一个loading的文案。

这样虽然实现了我们的需求但是将子组件获取`user`的逻辑放到了父组件中，我们期望将这些逻辑全部封装在子组件中，所以这个方案并不完美。

子组件在onMounted中请求数据的例子
---------------------

我们来看看第二种方案，父组件代码代码如下：

javascript

 代码解读

复制代码

`<template>   <ChildDemo /> </template> <script setup lang="ts"> import ChildDemo from "./Child.vue"; </script>`

子组件代码如下：

javascript

 代码解读

复制代码

`<template>   <div v-if="user">     <p>用户名：{{ user.name }}</p>     <p>手机号：{{ user.phone }}</p>   </div>   <div v-else>     <p>loading...</p>   </div> </template> <script setup lang="ts"> import { ref, onMounted } from "vue"; const user = ref(null); async function fetchUser() {   // 使用setTimeout模拟从服务端获取数据   return new Promise((resolve) => {     setTimeout(() => {       resolve({         name: "张三",         phone: "13800138000",       });     }, 2000);   }); } onMounted(async () => {   user.value = await fetchUser(); }); </script>`

我们将数据请求放在了`onMounted`中，初始化时会去第一次渲染子组件。此时`user`的值还是`null`，所以我们不得不在`template`的最外层使用`v-if="user"`控制此时不显示子组件的内容，在`v-else`中去渲染loading文案。

当从服务端拿到数据后给响应式变量`user`重新赋值，会触发页面重新渲染，此时会进行第二次渲染才将子组件的内容渲染到页面上。

从上面可以看到这种方案子组件明显渲染了两次，并且我们还将loading的显示逻辑写在子组件的内部，增加了子组件代码的复杂度。所以这种方案也并不完美。

最完美的方案就是在`fetchUser`期间让子组件`“暂停”渲染`，`fallback`去渲染一个loading页面。并且这个loading的显示逻辑不需要封装在子组件中，在`“暂停”渲染`期间`自动`就能显示出来。等到从服务端请求数据完成后才开始渲染子组件，并且自动的卸载掉loading页面。

Suspense + await实现完美的例子
=======================

下面这个是官网对`Suspense`的介绍：

> `<Suspense>` 是一个内置组件，用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态。

上面的意思是`Suspense`组件能够监听下面的异步子组件，在等待异步子组件完成渲染之前，可以去渲染一个loading的页面。

`Suspense`组件支持两个插槽：`#default` 和 `#fallback`。如果`#default`插槽中有异步组件，那么就会先去渲染 `#fallback`中的内容，等到异步组件加载完成后就会将`#fallback`中的内容给干掉，改为将异步组件的内容渲染到页面上。

如果我们的子组件是一个异步组件，那么`Suspense`不就可以帮我们实现想要的功能吖。

`Suspense`可以在异步子组件的加载过程中使用 `#fallback`插槽自动帮我们渲染一个加载中的loading，等到异步子组件加载完成后才会第一次去渲染子组件中的内容。

那么现在的问题是如何将我们的子组件变成异步子组件？

这个问题的答案其实vue官网就已经告诉我们了，如果一个组件的`<script setup>`顶层使用了`await`，那么这个组件就会变成一个异步组件。我们接下来只需要在子组件的顶层使用await去请求服务端数据就可以啦。

完美方案的父组件
--------

下面这个是使用`Suspense`改造后的父组件代码，如下：

javascript

 代码解读

复制代码

`<template>   <Suspense>     <AsyncChildDemo />     <template #fallback>loading...</template>   </Suspense> </template> <script setup lang="ts"> import AsyncChildDemo from "./AsyncChild.vue"; </script>`

在父组件中使用了`Suspense`组件，给这个组件传了2个插槽。`#default`插槽为异步子组件`AsyncChildDemo`，默认插槽可以不用给元素上面添加`#default`。

并且使用了`#fallback`插槽，在异步子组件加载过程中会暂时先不去渲染异步子组件`AsyncChildDemo`。改为先渲染`#fallback`插槽中的loading，等到异步子组件加载完成后会自动将loading替换为子组件中的内容。

完美方案的子组件
--------

下面这个是使用了`await`改造后的子组件代码，如下：

javascript

 代码解读

复制代码

`<template>   <div>     <p>用户名：{{ user.name }}</p>     <p>手机号：{{ user.phone }}</p>   </div> </template> <script setup lang="ts"> import { ref } from "vue"; const user = ref(null); user.value = await fetchUser(); async function fetchUser() {   // 使用setTimeout模拟从服务端获取数据   return new Promise((resolve) => {     setTimeout(() => {       resolve({         name: "张三",         phone: "13800138000",       });     }, 2000);   }); } </script>`

我们在`<script setup>`顶层中使用了`await`，然后将`await`拿到的值赋值给`user`变量。在顶层使用了`await`后子组件就变成了一个异步组件，等到`await fetchUser()`执行完了后，也就是从服务端拿到了数据后，子组件才算是加载完成了。

并且由于我们在父组件中使用了`Suspense`，所以在子组件加载完成之前，也就是从服务端拿到数据之前，都不会去渲染子组件（相当于“暂停”渲染子组件）。而是去渲染`#fallback`插槽中的loading，等到从服务端拿到数据之后异步子组件才算是加载完成了。此时才会第一次去渲染子组件，并且将loading替换为子组件渲染的内容。

因为第一次渲染子组件时已经从服务端拿到了`user`的值，此时`user`已经不是`null`了，所以我们可以不用在template的最上层使用`v-if="user"`，尽管在template中有去读`user.name`。

经过`父组件Suspense + 子组件顶层await`的改造后，在渲染父组件的`Suspense`时发现他的子组件有异步组件，就会“暂停”渲染子组件，改为自动渲染loading组件。

子组件在`setup`顶层使用`await`等待从服务端请求数据，当从服务端拿到了数据后此时子组件才算是加载完成，此时才会进行第一次渲染，并且自动将loading中的内容替换为子组件中渲染的内容。

并且在`Suspense`中还支持多个异步子组件分别从服务端获取数据，等这几个异步子组件都从服务端获取到数据后才会自动的将loading替换为这几个异步子组件渲染的内容。

还有就是`Suspense`组件目前依然还是`实验性`的功能，生产环境使用需要谨慎。

简单看看`Suspense`如何实现“暂停”渲染？
=========================

`Suspense`在渲染子组件时，发现子组件是一个异步组件就不会立即执行异步子组件的render函数。而是会加一个名为`deps`的标记，标明当前默认子组件是一个异步组件，`暂停渲染`异步子组件。

由于异步子组件是一个`Promise`，所以可以在加载异步子组件的`Promise`后添加`.then()`方法，在`.then()`方法中才会去继续渲染异步子组件。

目前异步子组件已经暂停渲染了，接着就是会去读取`deps`标记。如果`deps`标记为`true`，说明异步子组件暂停渲染了，此时就会去将`fallback`插槽中的loading组件渲染到页面上。

当异步子组件加载完成后就会触发`Promise`的`.then()`方法，从而`继续渲染`异步子组件。在`.then()`方法中会去执行异步子组件的render函数去生成虚拟DOM，然后根据虚拟DOM生成真实DOM。最后就是将原本页面上渲染的`fallback`插槽中的内容替换为异步组件生成的真实DOM中的内容。

下面这个是我画的流程图（**流程图后面还有文末总结**）： ![full-progress](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a9239aff6355420d9eef442867363129~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qyn6Ziz:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjg4NTU1OTg4ODY1NDY2NCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724802597&x-orig-sign=I3Co%2F2wzClFAJGQQIrYdzV5OJYc%3D)

总结
==

这篇文章我们讲了有的场景需要`从服务端拿到数据后`再去渲染一个组件，此时我们就可以使用`父组件Suspense + 子组件顶层await`的完美方案。

在渲染父组件的`Suspense`组件时发现他的子组件有异步组件，就会“暂停”渲染子组件，改为自动渲染loading组件。

子组件在`setup`顶层使用`await`等待从服务端请求数据，当从服务端拿到了数据后此时子组件才算是加载完成，此时才会进行第一次渲染，并且自动将loading中的内容替换为子组件中渲染的内容。

并且在`Suspense`中还支持多个异步子组件分别从服务端获取数据，等这几个异步子组件都从服务端获取到数据后才会自动的将loading替换为这几个异步子组件渲染的内容。

可以理解为v-if的实现是手动挡，Suspense是自动挡。

最后就是`Suspense`组件目前依然还是`实验性`的功能，生产环境使用需要谨慎。

最后推荐一下欧阳自己写的开源电子书[vue3编译原理揭秘](https://link.juejin.cn?target=https%3A%2F%2Fvue-compiler.iamouyang.cn%2F "https://vue-compiler.iamouyang.cn/")，看完这本书可以让你对vue编译的认知有质的提升，并且这本书初、中级前端能看懂。`完全免费，只求一个star。`