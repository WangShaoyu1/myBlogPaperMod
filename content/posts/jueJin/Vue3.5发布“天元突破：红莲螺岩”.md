---
author: "前端博尔特"
title: "Vue3.5发布“天元突破：红莲螺岩”"
date: 2024-09-04
description: "在Vue3.5的发布文档中提到这一标题，是可能与版本的命名灵感相关。反应系统优化在3.5中，Vue的反应系统经历了另一次重大重构，在行为没有变化的情况下实现"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 738
---
> “天元突破：红莲螺岩”是日本的一部动画作品，英文名为“Gurren Lagann”。它是一部科幻机甲动画，讲述了年轻人们对抗压迫与命运的故事，探讨了自由、勇气和激励人心的主题。这部作品以其独特的风格和热血的剧情受到了广泛的好评。在 Vue 3.5 的发布文档中提到这一标题，是可能与版本的命名灵感相关。具体的意思可以参考相关的动画或文化资料。

**让我们来阅读下面的新特性！**

反应系统优化
------

在 3.5 中，Vue 的反应系统经历了另一次重大重构，在行为没有变化的情况下实现了更好的性能和显著改善的内存使用率（**\-56%** ）。重构还解决了 SSR 期间计算值挂起导致的过时计算值和内存问题。

此外，3.5 还优化了大型、深度反应阵列的反应性跟踪，在某些情况下可使此类操作速度提高 10 倍。

响应式 Props 解构
------------

**反应性 Props 解构**在 3.5 中已稳定下来。现在该功能默认启用，从调用`defineProps`中解构的变量`<script setup>`现在具有反应性。值得注意的是，此功能通过利用 JavaScript 的原生默认值语法，大大简化了使用默认值声明 props 的过程：

**前**

typescript

 代码解读

复制代码

`const props = withDefaults(   defineProps<{     count?: number     msg?: string   }>(),   {     count: 0,     msg: 'hello'   } )`

**后**

typescript

 代码解读

复制代码

`const { count = 0, msg = 'hello' } = defineProps<{   count?: number   message?: string }>()`

对解构变量（例如`count`）的访问会被编译器自动编译成`props.count`，因此访问时会对其进行跟踪。与 类似`props.count`，在保留响应性的同时，监视解构的 prop 变量或将其传递到可组合变量需要将其包装在 getter 中：

scss

 代码解读

复制代码

``watch(count /* ... */) //    ^ results in compile-time error watch(() => count /* ... */) //    ^ wrap in a getter, works as expected // composables should normalize the input with `toValue()` useDynamicCount(() => count)``

对于那些希望更好地区分解构 props 与普通变量的用户，`@vue/language-tools`2.1 版本提供了一个可选设置来为他们启用嵌入提示：

![解构道具的镶嵌提示](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5c29e5014c3a473690056b118885db30~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y2a5bCU54m5:q75.awebp?rk3s=f64ab15b&x-expires=1727404189&x-signature=eKymdd3y7TUxPzfg8Tt3F1aoLCc%3D)

细节：

*   请参阅[文档](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fcomponents%2Fprops.html%23reactive-props-destructure "https://vuejs.org/guide/components/props.html#reactive-props-destructure")以了解使用方法和注意事项。
*   请参阅[RFC#502](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Frfcs%2Fdiscussions%2F502 "https://github.com/vuejs/rfcs/discussions/502")了解此功能背后的历史和设计原理。

SSR 改进
------

3.5 为服务器端渲染（SSR）带来了一些长期要求的改进。

### 懒惰补水[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23lazy-hydration "https://blog.vuejs.org/posts/vue-3-5#lazy-hydration")

`hydrate`异步组件现在可以通过 API选项指定策略来​​控制何时进行水合`defineAsyncComponent()`。例如，仅在组件可见时进行水合：

javascript

 代码解读

复制代码

`import { defineAsyncComponent, hydrateOnVisible } from 'vue' const AsyncComp = defineAsyncComponent({   loader: () => import('./Comp.vue'),   hydrate: hydrateOnVisible() })`

核心 API 有意设计得较低级别，而 Nuxt 团队已在此特性的基础上构建了更高级别的语法糖。

**详细信息：[PR#11458](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11458 "https://github.com/vuejs/core/pull/11458")**

### `useId()`[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23useid "https://blog.vuejs.org/posts/vue-3-5#useid")

`useId()`是一个 API，可用于生成每个应用程序唯一的 ID，这些 ID 可确保在服务器和客户端渲染过程中保持稳定。它们可用于生成表单元素和可访问性属性的 ID，并可在 SSR 应用程序中使用，而不会导致水合不匹配：

xml

 代码解读

复制代码

`<script setup> import { useId } from 'vue' const id = useId() </script> <template>   <form>     <label :for="id">Name:</label>     <input :id="id" type="text" />   </form> </template>`

**详细信息：[PR#11404](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11404 "https://github.com/vuejs/core/pull/11404")**

### `data-allow-mismatch`[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23data-allow-mismatch "https://blog.vuejs.org/posts/vue-3-5#data-allow-mismatch")

如果客户端值不可避免地与服务器对应值不同（例如日期），我们现在可以使用`data-allow-mismatch`属性来抑制由此产生的水合不匹配警告：

css

 代码解读

复制代码

`<span data-allow-mismatch>{{ data.toLocaleString() }}</span>`

您还可以通过为属性提供值来限制允许的不匹配类型，可能的值包括`text`、`children`、`class`、`style`和`attribute`。

自定义元素改进
-------

3.5 修复了许多与 API 相关的长期存在的问题`defineCustomElement()`，并添加了许多使用 Vue 创作自定义元素的新功能：

*   通过选项支持自定义元素的应用程序配置`configureApp`。
*   添加`useHost()`、`useShadowRoot()`和`this.$host`API，用于访问自定义元素的宿主元素和影子根。
*   通过传递支持安装没有 Shadow DOM 的自定义元素`shadowRoot: false`。
*   支持提供一个`nonce`选项，该选项将附加到`<style>`自定义元素注入的标签上。

`defineCustomElement`这些新的仅自定义元素选项可以通过第二个参数传递：

vue

 代码解读

复制代码

`import MyElement from './MyElement.ce.vue' defineCustomElements(MyElement, {   shadowRoot: false,   nonce: 'xxx',   configureApp(app) {     app.config.errorHandler = ...   } })`

其他显著特点
------

### `useTemplateRef()`[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23usetemplateref "https://blog.vuejs.org/posts/vue-3-5#usetemplateref")

3.5 引入了一种通过API 获取[模板引用](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fessentials%2Ftemplate-refs.html "https://vuejs.org/guide/essentials/template-refs.html")的新方法`useTemplateRef()`：

xml

 代码解读

复制代码

`<script setup> import { useTemplateRef } from 'vue' const inputRef = useTemplateRef('input') </script> <template>   <input ref="input"> </template>`

在 3.5 之前，我们建议使用变量名与静态`ref`属性匹配的普通引用。旧方法要求`ref`属性可由编译器分析，因此仅限于静态`ref`属性。相比之下，`useTemplateRef()`通过运行时字符串 ID 匹配引用，因此支持将动态引用绑定到不断变化的 ID。

`@vue/language-tools`2.1 还实现了[对新语法的特殊支持](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Flanguage-tools%2Fpull%2F4644 "https://github.com/vuejs/language-tools/pull/4644")`useTemplateRef()`，因此在使用时您将根据`ref`模板中存在的属性获得自动完成和警告：

![解构道具的镶嵌提示](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0e886848c097402e92327752462a8aa8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y2a5bCU54m5:q75.awebp?rk3s=f64ab15b&x-expires=1727404189&x-signature=uNdZDyz%2BCu0To2p4Q1V7DRutHKI%3D)

### 延迟传送[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23deferred-teleport "https://blog.vuejs.org/posts/vue-3-5#deferred-teleport")

内置`<Teleport>`组件的一个已知限制是，其目标元素必须在传送组件挂载时存在。这阻止用户在传送后将内容传送到 Vue 渲染的其他元素。

在 3.5 中，我们引入了一个在当前渲染周期之后挂载它的`defer`prop `<Teleport>`，因此现在可以正常工作：

ini

 代码解读

复制代码

`<Teleport defer target="#container">...</Teleport> <div id="container"></div>`

此行为需要`defer`prop，因为默认行为需要向后兼容。

**详细信息：[PR#11387](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fissues%2F11387 "https://github.com/vuejs/core/issues/11387")**

### `onWatcherCleanup()`[​](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5%23onwatchercleanup "https://blog.vuejs.org/posts/vue-3-5#onwatchercleanup")

3.5 引入了一个全局导入的 API，[`onWatcherCleanup()`](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fapi%2Freactivity-core%23onwatchercleanup "https://vuejs.org/api/reactivity-core#onwatchercleanup")用于在观察者中注册清理回调：

javascript

 代码解读

复制代码

``import { watch, onWatcherCleanup } from 'vue' watch(id, (newId) => {   const controller = new AbortController()   fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {     // callback logic   })   onWatcherCleanup(() => {     // abort stale request     controller.abort()   }) })``

Vue 3.5 带来了许多令人兴奋的新特性和优化，为开发者提供了更强大、更高效的工具。