---
author: "前端打更人er"
title: "广智别拦我，Vue3.5“天元突破”正式发布了！"
date: 2024-09-04
description: "Vue3.5正式发布机翻译自Vue官方博客代号：天元突破·红莲螺岩这个小版本不包含任何破坏性更改，但包括一些内部改进和实用的新功能。"
tags: ["Vue.js"]
ShowReadingTime: "阅读4分钟"
weight: 737
---
Vue 3.5正式发布
===========

翻译自 [Vue 官方博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5 "https://link.juejin.cn?target=https%3A%2F%2Fblog.vuejs.org%2Fposts%2Fvue-3-5")

今天我们很高兴地宣布Vue 3.5的发布.  
代号：天元突破·红莲螺岩 / Tengen Toppa Gurren Lagann

这个小版本不包含突破性的变化，包括内部改进和有用的新特性。我们将在这篇博文中介绍一些重点内容——要了解完整的变更列表和新功能，请咨询GitHub上的完整变更日志。[请查阅 GitHub 上的完整更新日志](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fblob%2Fmain%2FCHANGELOG.md "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fblob%2Fmain%2FCHANGELOG.md")。

* * *

响应式系统优化
=======

在3.5版本中，Vue的响应性系统经历了另一次重大重构，实现了更好的性能，并在没有行为改变的情况下显著提高了内存使用率(-56%)。重构还解决了过时的计算值和由SSR期间挂起的计算引起的内存问题。此外，3.5还优化了大型深度响应阵列的响应性跟踪，在某些情况下使此类操作速度提高了10倍。

详情：[PR#10397](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F10397 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F10397")，[PR#9511](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F9511 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F9511")

响应式 Props 解构
============

在 3.5 版本中，响应式 Props 解构功能已经稳定下来。该功能现已默认启用，通过在 `<script setup>` 中使用 `defineProps` 调用解构出的变量现在是响应式的。值得注意的是，该功能通过利用 JavaScript 原生的默认值语法，大大简化了带有默认值的 props 声明过程：

**Before**

ts

 代码解读

复制代码

`const props = withDefaults(   defineProps<{     count?: number     msg?: string   }>(),   {     count: 0,     msg: 'hello'   } )`

**After**

ts

 代码解读

复制代码

`const { count = 0, msg = 'hello' } = defineProps<{   count?: number   message?: string }>()`

对解构变量的访问，比如count，会自动编译成props。由编译器计数，以便在访问时跟踪它们。类似于道具。计数，观察解构的prop变量或者在保持反应性的同时将其传递到可组合对象中需要将其包装在getter中

ts

 代码解读

复制代码

``// 导致编译时错误 watch(count /* ... */) // 按预期工作 watch(() => count /* ... */) // composables should normalize the input with `toValue()` useDynamicCount(() => count)``

对于那些更倾向于区分解构后的 props 和普通变量的开发者，`@vue/language-tools` 2.1 已推出了一项可选设置，用于为解构的 props 启用内联提示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b6d668ec9e17435d99be49413bf8ca2a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5omT5pu05Lq6ZXI=:q75.awebp?rk3s=f64ab15b&x-expires=1727320991&x-signature=iiZsQlwCUGgIvbDuqI0uwz8ueuk%3D)

详情：

*   请参阅[文档](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fcomponents%2Fprops.html%23reactive-props-destructure "https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fcomponents%2Fprops.html%23reactive-props-destructure")以了解具体使用方法和注意事项。
*   有关此功能的历史和设计原理，请查看 [RFC#502](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Frfcs%2Fpull%2F502 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Frfcs%2Fpull%2F502")。

SSR 改进
======

3.5对服务器端呈现(SSR)进行了一些长期要求的改进。

懒加载水合
-----

在 Vue 中，Async 组件可以通过 `defineAsyncComponent()` API 的 `hydrate` 选项来指定策略以控制何时进行补水操作。例如，当只希望在组件可见时才对其进行水合物处理，这种方式可以更加精准地控制组件的加载和水合过程，从而提高应用的性能和用户体验。

通过设置特定的补水策略，可以避免在不必要的时候进行水合操作，减少资源的消耗。当组件不可见时，不进行水合处理可以节省内存和计算资源，而在组件变为可见时再进行水合操作，可以确保用户能够及时看到完整的页面内容。

这种精细的控制对于大型应用或者对性能要求较高的场景非常有用，可以根据具体的需求和应用场景来灵活地调整补水策略，以达到最佳的性能和用户体验效果。

js

 代码解读

复制代码

`import { defineAsyncComponent, hydrateOnVisible } from 'vue' const AsyncComp = defineAsyncComponent({   loader: () => import('./Comp.vue'),   hydrate: hydrateOnVisible() })`

核心API故意设计得很底层，而next团队已经在这个特性的基础上构建了高级语法糖。

详情：[PR#11458](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11458 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11458")

useId()
-------

useId()是一个API，可用于生成每个应用程序唯一的id，保证在服务器和客户端呈现中保持稳定。它们可以用来为表单元素和可访问性属性生成id，并且可以在SSR应用程序中使用，而不会导致水合不匹配

html

 代码解读

复制代码

`<script setup> import { useId } from 'vue' const id = useId() </script> <template>   <form>     <label :for="id">Name:</label>     <input :id="id" type="text" />   </form> </template>`

详情：[PR#11404](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11404 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fpull%2F11404")

data-allow-mismatch
-------------------

在客户端值不可避免地与服务器值不同的情况下(例如日期)，我们现在可以用data-allow-mismatch属性来抑制产生的水合不匹配警告

html

 代码解读

复制代码

`<span data-allow-mismatch>{{ data.toLocaleString() }}</span>`

您还可以通过向属性提供一个值来限制允许的不匹配类型，其中可能的值是 `text`、`children`、`class`、`style` 和 `attribute`。

自定义元素改进 / Custom Elements Improvements
======================================

3.5修复了与defineCustomElement() API相关的许多长期存在的问题，并为使用Vue创作自定义元素添加了许多新功能

*   通过 `configureApp` 选项支持自定义元素的应用配置。
*   添加 `useHost()`、`useShadowRoot()` 和 `this.$host` API，用于访问自定义元素的宿主元素和 shadow root。
*   通过传递 `shadowRoot: false`，支持在没有 Shadow DOM 的情况下挂载自定义元素。
*   支持提供 `nonce` 选项，该选项将附加到自定义元素注入的 `<style>` 标签中。

这些新的仅限自定义元素的选项可以通过第二个参数传递给defineCustomElement：

js

 代码解读

复制代码

`import MyElement from './MyElement.ce.vue' defineCustomElements(MyElement, {   shadowRoot: false,   nonce: 'xxx',   configureApp(app) {     app.config.errorHandler = ...   } })`

其他值得注意的功能 / Other Notable Features
==================================

useTemplateRef()
----------------

3.5 引入了一种通过 `useTemplateRef()` API 获取[模板引用](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fessentials%2Ftemplate-refs.html "https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fessentials%2Ftemplate-refs.html")的新方式：

html

 代码解读

复制代码

`<script setup> import { useTemplateRef } from 'vue' const inputRef = useTemplateRef('input') </script> <template>   <input ref="input"> </template>`

在3.5之前，我们建议使用与静态ref属性匹配的普通ref变量名。旧的方法要求编译器可以分析ref属性，因此仅限于静态ref属性。相比之下，useTemplateRef()通过运行时字符串id匹配ref，因此支持动态ref绑定到不断变化的id。

`@vue/language-tools` 2.1 也[为新语法提供了特殊支持](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Flanguage-tools%2Fpull%2F4644 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Flanguage-tools%2Fpull%2F4644")，因此在使用 `useTemplateRef()` 时，会根据模板中 ref 属性的存在提供自动补全和警告提示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a787827f89184b5f85180e626b4f09d9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5omT5pu05Lq6ZXI=:q75.awebp?rk3s=f64ab15b&x-expires=1727320991&x-signature=fXnKdvOBSe22BQKO6dYXPJ4BVJM%3D)

延迟传送 / Deferred Teleport
------------------------

内置组件的一个已知约束是，它的目标元素必须在Teleport组件挂载时存在。这阻止了用户在传送之后将内容传送到Vue呈现的其他元素。

在3.5中，我们为引入了一个延迟道具，它会在当前渲染周期后挂载它，所以现在可以工作了

html

 代码解读

复制代码

`<Teleport defer target="#container">...</Teleport> <div id="container"></div>`

此行为需要defer prop，因为默认行为需要向后兼容。

详情：[PR#11387](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fissues%2F11387 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcore%2Fissues%2F11387")

onWatcherCleanup()
------------------

3.5 引入了一个全局导入的 API `onWatcherCleanup()`，用于在 watchers 中注册清理回调：

js

 代码解读

复制代码

``import { watch, onWatcherCleanup } from 'vue' watch(id, (newId) => {   const controller = new AbortController()   fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {     // callback logic   })   onWatcherCleanup(() => {     // abort stale request     controller.abort()   }) })``

要了解3.5的全面变更和特性列表，请查看[GitHub上的完整变更日志。](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fguide%2Fessentials%2Fwatchers.html%23side-effect-cleanup "https://vuejs.org/guide/essentials/watchers.html#side-effect-cleanup")的说明。

结尾
==

看完了，继续打广智