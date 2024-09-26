---
author: "Kaciras"
title: "Vue3.5新特性盘点+使用感受"
date: 2024-09-05
description: "前天Vue出3.5了，我也第一时间试了试新功能，总结一下就是小优化而已，还是更期待接下来的Vapor和Suspence。"
tags: ["Vue.js"]
ShowReadingTime: "阅读6分钟"
weight: 1004
---
前天 Vue 出 3.5 了，[新增了一些功能](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23ssr-improvements "https://blog.vuejs.org/posts/vue-3-5#ssr-improvements")（[完整的 ChangeLog](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fblob%2Fmain%2FCHANGELOG.md%23350-2024-09-03 "https://github.com/vuejs/core/blob/main/CHANGELOG.md#350-2024-09-03")），来看看都有什么吧。

原文 [blog.kaciras.com/article/41/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.kaciras.com%2Farticle%2F41%2Fvue-3-5-new-features "https://blog.kaciras.com/article/41/vue-3-5-new-features")

Reactive Props Destructure
--------------------------

这次更新的吸引力没有 3.4 那么大，首先最大的更新就是这个 props 解构了，这是一个编译器特性，能够追踪 props 结构出来的变量，然后把用到的地方自动添加 `props.` 前缀。

javascript

 代码解读

复制代码

`const { count = 0, msg = 'hello' } = defineProps<{   count?: number   message?: string }>() function handle() {     doSomething(count); }`

上面的代码等价于：

javascript

 代码解读

复制代码

`const props = withDefaults(defineProps<{ 	count?: number; 	message?: string; }>(), { 	count: 0, 	msg: "hello", }); function handle() { 	doSomething(props.count); }`

这个语法糖看似挺有用的，但细想一下就是个鸡肋。首先已经有 `toRefs` 可以将 props 转成一堆 ref，这次的新写法只是省了几个 `props.`，外加少创建几个 ref 对象而已，性能也没啥区别。

其次如果组件大一点，那么 `setup` 里头的变量和函数会相当多，**这解构又把一堆变量从 props 命名空间拿到了顶层，搞得名字更混乱了，想必大家都知道给变量起名字是多烦人的事情。**

最后该语法糖并不能满足所有的场景，在 Vue 的公告里也有提到这样的代码：

javascript

 代码解读

复制代码

`const { count = 0 } = defineProps<{ count?: number }>() // 这么写会编译错误。 watch(count /* ... */) // 实际上需要这么做。 watch(() => count /* ... */)`

这就有点违反直觉了，要知道用 `toRefs` 解构 props 的话是可以直接监视解构出来的 ref。之所以这样是因为它会编译为 `watch(props.count, ...)` 而 `props.count`是取出来的值而不是响应对象，无法监听。

useId
-----

新的 `useId` 函数返回一个实例级别的唯一 ID，这东西的感觉还是 SSR 才用得到，因为一般客户端只创建一个 Vue 实例，想要唯一 ID 的话都是整个全局整数然后每次取完加一。

**而服务端渲染的话就会多次创建实例，如果使用全局变量则每次渲染都是不同的值，可能造成混合失败、以及缓存失效，而 `useId` 则可以避免此问题。**

data-allow-mismatch
-------------------

加上了该属性的元素在客户端混合时能忽略与 SSR 不一致的内容，直接用客户端渲染的结果覆盖。

**说到 SSR 中的不一致内容，我遇到的都是时间相关的**，因为 HTTP 请求头中没有客户端的时间信息，后端取不到，最终渲染的结果跟客户端的就不一致。在[本站的文章页](https://link.juejin.cn?target=https%3A%2F%2Fblog.kaciras.com%2Flist%2F0 "https://blog.kaciras.com/list/0")就有这个问题：

![DOM 不匹配.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ec9f35984f6e42e4a63d9e20c2a699f9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgS2FjaXJhcw==:q75.awebp?rk3s=f64ab15b&x-expires=1727933884&x-signature=zCTiYBAquS1vgpgOpTCt7zKxNvk%3D)

这是因为文章右下角有个时间要格式化，而服务端无法得知客户端的时区，导致渲染结果不同，这并不是什么大问题，但有个错误看着总是难受。而新版可以在元素上设置 `data-allow-mismatch` 来忽略该错误。

html

 代码解读

复制代码

`<time 	data-allow-mismatch 	:datetime='date.toISOString()' > 	{{ data.toLocaleString() }} </time>`

虽然这个属性只跟 Vue 有关，但却会渲染到 HTML 上，成为一个多余的东西，有代码洁癖的我看着是真不爽。

onWatcherCleanup
----------------

以往要对 `watch` 函数加清理过程可以这样写，比如取消未完成的请求：

javascript

 代码解读

复制代码

``import { watch, onBeforeUnmount } from "vue"; let controller = new AbortController(); watch(xxx, (newId) => { 	controller.abort(); // 取消上一次可能没完成的请求。 	controller = new AbortController(); 	fetch(`/api/${newId}`, { signal: controller.signal }); }); // 组件卸载前也要记得清理。 onBeforeUnmount(() => controller.abort());``

这样写的问题是清理函数要写两遍，而且还要把`controller`放到顶层。有了新的 API 之后就可以这样了：

javascript

 代码解读

复制代码

``import { watch, onWatcherCleanup } from "vue"; watch(xxx, (newId) => { 	const controller = new AbortController(); 	// 直接指定清理函数。 	onWatcherCleanup(() => controller.abort()); 	fetch(`/api/${newId}`, { signal: controller.signal }); });``

### 跟 `onCleanup` 的区别？

除此之外，`watch` 处理函数的最后一个参数可以接受一个回调，在清理时调用，这跟本次的新 API 功能是一样的，那么为什么还要加这个新函数呢？

我能想到的区别是解耦，就像 Composite API 和传统的选项 API 一样，新的写法支持将清理逻辑封装成可复用的函数，并同时注册多个清理函数。

Watch 返回值增强
-----------

记得 VueUse 里的很多函数返回的值都有暂停和恢复等方法，可以更细致的控制作用范围，此处更新中 Vue 自带的 `watch` 也支持这样做了。

typescript

 代码解读

复制代码

`// 原先 watch 只返回一个停止函数。 export type WatchStopHandle = () => void; // 现在有更多的方法， export interface WatchHandle extends WatchStopHandle {     pause: () => void;     resume: () => void;     stop: () => void; }`

在以前要暂停监视一段时间的话，要么取消然后再重新监视，要么搞个变量来跳过处理，不管怎样都要自己封一下，没法跟三方库组合。新版规范了暂停的接口，解决了这个问题。

Deferred Teleport
-----------------

`<Teleport>` 元素默认在挂载的时候就要拿到目标元素，这意味着如果挂载目标是它后面的元素，那渲染到它时还不存在，导致出错。新的 `defer` 属性指定 `<Teleport>` 在渲染完成后再去找目标元素，解决了这个问题。

javascript

 代码解读

复制代码

`<Teleport defer target="#container">...</Teleport> <div id="container">后渲染的元素也能挂载到</div>`

这功能我倒没用着，大部分情况用 `<Teleport>` 应该都是挂到全局节点，往组件里挂复杂度就高了不少。

useTemplateRef
--------------

本次更新的第二大功能非 `useTemplateRef` 莫属，简单来说该函数创建专门用于模版引用的 ref，可以动态决定元素绑到哪个 ref 上：

vue

 代码解读

复制代码

`<template> 	<input type='text' :ref='refTarget' />   <button @click="switchRef">切换</button> </template> <script setup lang="ts"> import { useTemplateRef, shallowRef } from "vue"; const refTarget = shallowRef("foo"); const fooEl = useTemplateRef<HTMLInputElement>("foo"); const barEl = useTemplateRef<HTMLInputElement>("bar"); function switchRef() {   refTarget.value = refTarget.value === "foo" ? "bar" : "foo"; } </script>`

[用法演示（掘金没法传视频）](https://link.juejin.cn?target=https%3A%2F%2Fblog.kaciras.com%2Fvideo%2FJ51cnDRYAbO5QStPUuCL.mp4%3Fvw%3D1920%26vh%3D888 "https://blog.kaciras.com/video/J51cnDRYAbO5QStPUuCL.mp4?vw=1920&vh=888")

像这样就能通过响应状态来决定`<input>`的 ref 是哪个，以前想实现同样的功能很是麻烦。

异步组件的 Hydrate 策略
----------------

异步组件新增了一个 `hydrate` 属性，设为 `hydrateOnVisible` 使其仅在元素可见时才混合：

javascript

 代码解读

复制代码

`import { defineAsyncComponent, hydrateOnVisible } from 'vue' const AsyncComp = defineAsyncComponent({   loader: () => import('./Comp.vue'),   hydrate: hydrateOnVisible(/* 选项 */),   // 也可以选择在空闲的时候混合。   // hydrate: hydrateOnIdle(/* timeout */),   // 在有交互时混合。   // hydrate: hydrateOnInteraction('click'),   // 满足媒体查询时混合   // hydrate: hydrateOnMediaQuery('(max-width:500px)') })`

这个 API 比较底层，我的项目里没有适用的场景，但可以解决一些性能问题。

@vue/reactivity 导出 watch 函数
---------------------------

众所周知 Vue 3 把响应式的部分单独搞成了一个库`@vue/reactivity`，这样任何人都能够用它来构建自己的框架，该库包含`ref`、`reactivea`以及相关的辅助函数，但唯独缺了`watch`。

从设计上看，`watch`用于监听响应对象，与 Vue 是无关的，它工作在更底层所以应当由`@vue/reactivity`导出。但实际上在 3.5 以前它却放在`@vue/runtime-core`里，这次终于给挪过来了。

watch 指定深度
----------

`WatchOptions` 的 `deep` 参数现在支持设为整数，用来指定监听的深度。

javascript

 代码解读

复制代码

`const state = reactive({   a: {     b: {       c: {         d: {           e: 1         }       }     }   } }) watch(state, () => {     console.log('state changed')   },   { flush: 'sync', deep: 2 } ) state.a.b = { c: { d: { e: 2 } } } // 更改第二层的属性触发监听。 state.a.b.c = { d: { e: 3 } } // 更改第三层不触发。`

优化
--

本次优化据称降低了 56% 的内存占用，部分场景能达到 10 倍的性能提升，灵感来源于 Preact Signals 的链表实现。光凭这一点就该升级了，毕竟优化是白嫖的。

类型上也有写调整，比如 [computed 支持 getter 和 setter 设为不同的类型](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11472 "https://github.com/vuejs/core/pull/11472")。

更新里还修复了 Custom Elements 的一堆问题，我没用到所以就不评价了。

总结：小打小闹
-------

这次的更新都是些小优化，没什么杀手级的特性，比起这些，我更期待的 Vapor、Suspense 也不知道今年能不能稳定。但毕竟没有 Breaking Change，升级还是无压力的。