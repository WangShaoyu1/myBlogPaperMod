---
author: "天天鸭"
title: "vue超级强大渲染函数h()，各种业务场景都能用到"
date: 2024-08-05
description: "vue的h()有很多功能，在各种业务场景都有它的用处，按照vue官方的介绍，h()渲染函数是用来创建虚拟DOM`节点vnode"
tags: ["Vue.js","JavaScript","前端框架"]
ShowReadingTime: "阅读5分钟"
weight: 733
---
前言
==

按照`vue`官方的介绍，`h()`渲染函数是用来创建虚拟 `DOM` 节点 `vnode`。我们在`vue`项目里面用`HTML`标签构建页面时最终会被转化成`vnode`，而`h()`是直接创建`vnode`，因此`h()`能以一种更灵活的方式在各种各样情景下构建组件的渲染逻辑，并且能带来性能方式的提升。下面介绍如何使用和列出具体的应用场景：

一、 h()渲染函数使用语法
==============

### 如下所示，主要有三个参数，其中第2第3个参数都是可选的

> *   **type**: 要创建的节点类型，可以是`HTML` 标签、组件或函数（函数式组件）。
> *   **props（可选）**: 节点的属性对象，传递的 `prop`。
> *   **children（可选）**: 节点的子节点，可以是字符串、数组或其他 `vnode`。

php

 代码解读

复制代码

`// 语法格式 function h(   type: string | Component,   props?: object | null,   children?: Children | Slot | Slots ): VNode // 基本使用示例 h('div', { id: 'foo' }, 'Hello我是天天鸭!');`

### h 函数的`参数详解`

#### (1)type 参数:

> *   `HTML` 标签: 如果 `type` 是一个字符串，它会被识别解析为一个 `HTML` 标签。
> *   组件: 如果 `type` 是一个对象或函数，那么会被解析为一个 `Vue` 的组件。
> *   异步组件: `type` 还可以是一个返回 `Promise` 的函数， `Promise` 会被解析为组件。

#### (2)props 参数:

> *   `props`是可选参数，用来指定该节点的属性参数。如果传递了 `props`，侧应该是传递一个对象，里面包含传递给节点的属性名和值。
> *   如果传递 `props`，可以传递 `null`。

#### (3)children 参数:

> *   `children`是可选参数，用于指定当前节点的子节点。子节点同理可以是字符串、数组或 `vnode` 对象。
> *   如果子节点是数组，则数组中的每个元素都是该节点的子节点。
> *   如果子节点是一个函数，则该函数会在渲染时被调用，并且其返回值将作为子节点。

二、具体应用示例
========

只看使用语法可能不太好理解什么时候应该使用`h()`函数，下面直接列举出真实项目中的几种适合使用`h()`的业务场景。

（1）动态渲染组件
---------

如下所示，结合`component`实现动态组件，这种算是最常用的业务场景之一了，但很多人在这种情况并不会用`h()`实现些功能。 其实用上`h()`能避免模板编译的开销，在这场景下可以带来性能上的优化，并且处理起来也更灵活。

xml

 代码解读

复制代码

`<template>   <button @click="changeComponent">切换动态组件</button>   <component :is="createComponent()" /> </template> <script setup lang="ts"> import { ref } from 'vue'; import ComponentA from './ComponentA.vue'; import ComponentB from './ComponentB.vue'; const nowComponent = ref('ComponentA'); function changeComponent() {   nowComponent.value = nowComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA'; } const createComponent = () => {   return h(nowComponent.value === 'ComponentA' ? ComponentA : ComponentB); }; </script>`

（2）创建函数式组件
----------

用`h()`创建函数式组件既能独立抽离维护，又不用额外多创建一个`.vue`文件，真的不要太实用了。这种方式非常适合用于简单的 `UI` 组件，可以显著简化代码并且提高性能。

xml

 代码解读

复制代码

`<template>   <FunctionalComponent text="这是函数式组件" @click="handleClick" /> </template> <script setup lang="ts"> import { h, defineEmits } from 'vue'; const FunctionalComponent = (props, context) => {   return h('div', null, [     h('p', null, props.text),     h('button', { onClick: context.emit.bind(context, 'click') }, '点击我')   ]); }; const emit = defineEmits(['click']); function handleClick() {   console.log('handleClick'); } </script>`

如上所示，就是典型的函数式组件使用方法，其中包含了如何在父子组件中与之交互。函数式组件 `FunctionalComponent` 接收 `props` 和 `context` 参数，并使用 `h()` 函数来构建页面。同时再通过 `context.emit` 方法来触发父组件中的事件处理器。

**注意: `props` 用于接收父组件传递过来的属性。`context` 用于访问组件上下文，如 slots插槽和方法事件的。**

（3）渲染动态属性
---------

一个组件或者一个标签如果需要定义一些动态属性，那么用`h()`渲染函数就相当方便了

xml

 代码解读

复制代码

`<template>   <button @click="myVisibility">切换组件显示状态</button>   <component :is="componentWithProps()" /> </template> <script setup lang="ts">   import { ref } from 'vue';   const visible = ref(true);   function myVisibility() {     visible.value = !visible.value;   }   const componentWithProps = () => {     return h('div', { class: { visible: visible.value } }, '我是div');   }; </script>`

如上所示，`h()`函数里面根据 `visible` 的值来决定 `vnode` 是否具有 `visible` 这个类，当点击按钮时实现动态样式。当然了，动态类只是一个例子，其实`h()`里面的各种属性或者说子组件都能动态，灵活性远超用`HTML`实现。

（4）使用插槽
-------

`h()`如果结合函数式组件和插槽来传递内容，能提高使用时的灵活性。

xml

 代码解读

复制代码

`<template>   <SlotComponent>     <template #default>       <p>我是插槽里面</p>     </template>   </SlotComponent> </template> <script setup lang="ts"> import { h } from 'vue'; const SlotComponent = (props, context) => {   return h('div', null, [     h('p', null, '插槽里面:'),     context.slots.default && context.slots.default()   ]); }; </script>`

如上所示，引用 `SlotComponent`组件时，其内部的 `<template>` 标签中的内容会被作为默认插槽的内容传递给 `SlotComponent`组件。并且能通过 `context.slots.default()` 来获取并渲染默认插槽里面的内容。因此当我们封装一个函数式组件，但里面有某一部分是动态的时候，就特别适合这样通过插槽去灵活使用。

**注意: `props` 用于接收父组件传递过来的属性。`context` 用于访问组件上下文，如 slots插槽和方法事件的。**

（5）创建动态标签
---------

如下代码是 `h()` 函数结合动态组件来实现在不同的 `HTML` 标签之间的切换。

xml

 代码解读

复制代码

`<template>   <button @click="changeTag">切换标签</button>   <component :is="createElement()" /> </template> <script setup lang="ts"> import { ref } from 'vue'; const tag = ref('div'); function changeTag() {   tag.value = tag.value === 'div' ? 'section' : 'div'; } const createElement = () => {   return h(tag.value, null, '动态标签'); }; </script>`

如上所示，其实就是根据 `tag` 的值来决定返回哪个 `HTML` 标签的 `VNode`,如果业务逻辑涉及到标签的动态变化时就相当好用，避免使用`v-if`产生大量重复代码。

小结
==

总结下来就会发现，其实`h()`渲染函数适用的应用场景非常多并且用法相当灵活，绝对是`万金油`函数。以上是我总结的几种实用场景，如有哪里写的不对或者有更好的建议欢迎大佬指点一二啊。