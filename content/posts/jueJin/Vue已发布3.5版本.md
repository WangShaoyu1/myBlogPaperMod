---
author: "南城FE"
title: "Vue已发布3.5版本"
date: 2024-09-05
description: "今天我们激动地宣布Vue3.5'TengenToppaGurrenLagann'的发布！"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 1048
---
> 本文翻译自 [Announcing Vue 3.5](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5 "https://blog.vuejs.org/posts/vue-3-5")，作者：Evan You， 略有删改。

今天，我们激动地宣布Vue 3.5 "Tengen Toppa Gurren Lagann" 的发布！

这个版本不包含任何破坏性变更，并且包括了内部改进和有用的新功能。我们将在这篇博客文章中介绍一些亮点变化，要查看完整的变更和新功能列表，请查看GitHub上的完整更新日志。

* * *

*   响应式系统优化
*   响应式属性解构
*   服务端渲染（SSR）改进
    *   异步组件
    *   useId()
    *   data-allow-mismatch
*   自定义元素改进
*   其他改进
    *   useTemplateRef()
    *   延迟Teleport
    *   onWatcherCleanup()

### 响应式系统优化

在3.5版本中，Vue的响应式系统经历了又一次重大重构，实现了更好的性能和显著改善的内存使用（-56%），且没有行为变化。重构还解决了在SSR期间由于悬挂计算值引起的陈旧计算值和内存问题。

此外，3.5还优化了对大型、深度响应式数组的响应式追踪，使得这类操作在某些情况下速度提升了高达10倍。

### 响应式属性解构

**响应式属性解构** 在3.5中已经稳定。随着该功能现在默认启用，从 `<script setup>` 中的 `defineProps` 调用中解构出的变量现在具有响应性。这个功能通过利用JavaScript的原生默认值语法，显著简化了声明带有默认值的属性：

**之前**

ts

 代码解读

复制代码

`const props = withDefaults(   defineProps<{     count?: number     msg?: string   }>(),   {     count: 0,     msg: 'hello'   } )`

**现在**

ts

 代码解读

复制代码

`const { count = 0, msg = 'hello' } = defineProps<{   count?: number   message?: string }>()`

访问解构变量，例如 `count`，会自动编译成 `props.count`，因此它们在访问时会被追踪。类似于 `props.count`，监听解构的属性变量或将其传递给可组合函数时，保留响应性需要使用`getter`包裹它：

js

 代码解读

复制代码

``watch(count /* ... */) //    ^ 编译时错误 watch(() => count /* ... */) //    ^ 用getter包裹，按预期工作 // 可组合函数应该用 `toValue()` 标准化输入 useDynamicCount(() => count)``

对于那些更喜欢更好地区分解构属性和普通变量的人，`@vue/language-tools` 2.1 已经发布了一个可选设置，以启用它们的内联提示：

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0674feaa546848e0ab2ce9422aa8a8a2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5Z-ORkU=:q75.awebp?rk3s=f64ab15b&x-expires=1727918509&x-signature=BZDyF3h3OAAIrXNpUJDjs%2BasDII%3D)

### 服务端渲染（SSR）改进

3.5为服务器端渲染（SSR）带来了一些长期请求的改进。

#### 异步组件

现在异步组件可以通过指定 `defineAsyncComponent()` API 的 `hydrate` 选项来控制它们应该何时加载。例如仅在组件变得可见时加载：

js

 代码解读

复制代码

`import { defineAsyncComponent, hydrateOnVisible } from 'vue' const AsyncComp = defineAsyncComponent({   loader: () => import('./Comp.vue'),   hydrate: hydrateOnVisible() })`

#### `useId()`

`useId()` 是一个API，可以用来生成每个应用程序唯一的ID，这些ID保证在服务器和客户端渲染之间是稳定的。它们可以用来生成表单元素和辅助功能属性的ID，并且可以在SSR应用程序中使用：

js

 代码解读

复制代码

`<script setup> import { useId } from 'vue' const id = useId() </script> <template>   <form>     <label :for="id">Name:</label>     <input :id="id" type="text" />   </form> </template>`

#### `data-allow-mismatch`

在客户端值不可避免地与服务器端值不同的情况下（例如日期），我们现在可以使用 `data-allow-mismatch` 属性来抑制由此产生的不匹配警告：

html

 代码解读

复制代码

`<span data-allow-mismatch>{{ data.toLocaleString() }}</span>`

您还可以通过为属性提供值来限制允许的不匹配类型，可能的值包括 `text`、`children`、`class`、`style` 和 `attribute`。

### 自定义元素改进

3.5修复了与 `defineCustomElement()` API 相关的许多长期问题，并为使用Vue编写自定义元素添加了许多新功能：

*   通过 `configureApp` 选项支持自定义元素的应用程序配置。
*   添加 `useHost()`、`useShadowRoot()` 和 `this.$host` API，用于访问自定义元素的host元素和shadow root。
*   支持通过传递 `shadowRoot: false` 来挂载没有Shadow DOM的自定义元素。
*   支持提供 `nonce` 选项，该选项将附加到自定义元素注入的 `<style>` 标签。

这些新的仅限自定义元素的选项可以通过第二个参数传递给 `defineCustomElement`：

js

 代码解读

复制代码

`import MyElement from './MyElement.ce.vue' defineCustomElements(MyElement, {   shadowRoot: false,   nonce: 'xxx',   configureApp(app) {     app.config.errorHandler = ...   } })`

### 其他改进

#### `useTemplateRef()`

3.5引入了一种通过 `useTemplateRef()` API 获取模板引用的新方法：

html

 代码解读

复制代码

`<script setup> import { useTemplateRef } from 'vue' const inputRef = useTemplateRef('input') </script> <template>   <input ref="input"> </template>`

在3.5之前，我们推荐使用与静态 `ref` 属性名称匹配的普通引用。旧方法要求 `ref` 属性能够被编译器分析，因此仅限于静态 `ref` 属性。相比之下，`useTemplateRef()` 通过运行时字符串ID匹配引用，因此支持将动态引用绑定到变化的ID。

`@vue/language-tools` 2.1 还实现了对新语法的特殊支持，因此当使用 `useTemplateRef()` 时，您将获得基于模板中 `ref` 属性的存在的自动完成和警告：

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/917a6491f8414271a7775badb1239a1a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5Z-ORkU=:q75.awebp?rk3s=f64ab15b&x-expires=1727918509&x-signature=Lw%2Bycym1WwlhGh8EyULGi1kI%2FXM%3D)

#### 延迟Teleport

内置 `<Teleport>` 组件的一个约束是其目标元素必须在传送组件挂载时存在。这阻止了用户将内容传送到Vue渲染的其他元素。

在3.5中，我们为 `<Teleport>` 引入了 `defer` 属性，它将在当前渲染周期后挂载：

html

 代码解读

复制代码

`<Teleport defer target="#container">...</Teleport> <div id="container"></div>`

这种行为需要 `defer` 属性，因为默认行为需要向后兼容。

#### `onWatcherCleanup()`

3.5引入了一个全局API，`onWatcherCleanup()`，用于在观察者中注册清理回调：

js

 代码解读

复制代码

``import { watch, onWatcherCleanup } from 'vue' watch(id, (newId) => {   const controller = new AbortController()   fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {     // 回调逻辑   })   onWatcherCleanup(() => {     // 中止旧请求     controller.abort()   }) })``

* * *

要查看3.5中的变化和功能的完整列表，请查看GitHub上的完整更新日志。

* * *

看完本文如果觉得有用，记得点个赞支持，收藏起来说不定哪天就用上啦～

> 专注前端开发，分享前端相关技术干货，公众号：南城大前端（ID: nanchengfe）