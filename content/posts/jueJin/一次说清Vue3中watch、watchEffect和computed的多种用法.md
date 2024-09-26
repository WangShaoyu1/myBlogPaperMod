---
author: "天天鸭"
title: "一次说清Vue3中watch、watchEffect和computed的多种用法"
date: 2024-04-17
description: "特意举例子总结一下，方便一看就能明白语法，watch、watchEffect和computed这算是vue里面响应式API的核心了。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读4分钟"
weight: 805
---
前言：
===

watch、watchEffect和computed这算是vue里面响应式API的核心了，特意总结一下当写个笔记，如有那里不对或者需要补充欢迎大佬指点。

一、watch:
========

> 简单说明：侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。但有几种使用方法，下面一一说明。

### 1、watch侦听一个对象里面一个属性：

> 直接侦听对象里面一个属性用法

scss

 代码解读

复制代码

`const state = reactive({ count: 0 }) watch(   () => state.count,   (newCount, oldCount) => {     // 执行逻辑   } )`

### 2、watch侦听一个 ref：

> 对ref侦听时不需要`.value`,直接侦听即可

scss

 代码解读

复制代码

`const count = ref(0) watch(count, (newCount, oldCount) => {    // 执行逻辑 })`

### 3、watch侦听多个来源时：

> 回调函数接受两个数组，分别对应来源数组中的新值和旧值

ini

 代码解读

复制代码

`const num = ref(5) const count = ref(100) watch([num, count], ([newNum, newCount], [oldNum, oldCount]) => {   // 执行逻辑 })`

### 4、watch深度侦听和立即执行等第三个可选的参数

> 简单说明：如果你想让回调在深层级变更时也能触发，例如对象里面的属性

> 例子：如果需要添加深度侦听侦听或者立即执行，直接在后面添加`{ deep: true }`即可。

javascript

 代码解读

复制代码

`const state = reactive({ count: 0 }) watch(   () => state,   (newState, oldState) => {     // 执行逻辑   },   {     deep: true,     // 深侦听    immediate: true,   // 立即执行    once: true,    // 回调函数只会运行一次 3.4+版本   } )`

二、watchEffect：
==============

> `简单说明：`立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行,可传两个参数。
> 
> 第一个参数：就是要运行的副作用函数;
> 
> 第二个参数：是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖
> 
> *   (1)设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行
>     
> *   (2)设置 `flush: 'pre'` ：在组件更新更新前运行，默认为'pre'
>     
> *   (3)设置 `flush: 'sync'`：强制效果始终同步触发。然而，这是低效的，应该很少需要。
>     

### 1、watchEffect常规用法：

> 直接使用，不需要传入任何依赖，并且进入页面立即就会执行。

scss

 代码解读

复制代码

`const count = ref(100) watchEffect(() =>{   console.log(count.value)    })`

> 传入第二个参数改变刷新时机的使用例子

scss

 代码解读

复制代码

`const count = ref(100) watchEffect(   () => {     console.log(count.value)   },   {     flush: 'post'   } )`

### 2、watchEffect停止侦听器：

> `简单说明：`当达到某个条件后不需要侦听了，那么可以用以下方法进行停止。

scss

 代码解读

复制代码

`const stop = watchEffect(() => {}) // 当不再需要此侦听器时: stop()`

### 3、watchEffect副作用清除：

> 简单说明：在开发中我们需要在侦听函数中执行网络请求，但是在网络请求还没有达到的时候如果出现以下两种情况，
> 
> （1）停止了侦听器，
> 
> （2）侦听器/侦听函数被再次执行了。
> 
> 那么上一次的网络请求应该被取消掉，这个时候我们就可以清除上一次的副作用；

**场景一**：如下假设网络请求要3秒完成，但2秒时就调用`stop()`暂停了侦听，所以会执行打印`我是副作用执行了`

javascript

 代码解读

复制代码

`const stop = watchEffect((onInvalidate) => {   const timer = setTimeout(() => {     console.log('网络请求成功~')   }, 3000)   console.log(num.value)   setTimeout(() => {     stop()   }, 2000)   // 当上面的请求还没执行完就stop或者重新执行，就会触发   onInvalidate(() => {     clearTimeout(timer)     console.log('我是副作用执行了')   }) })`

**场景二**：下面侦听打印引用了`num.value`, 所以收集了`num.value`的依赖，当`num.value`变化时副作用函数都会执行一次，打印出来`我是副作用执行了`，并且网络请求会正常请求。

javascript

 代码解读

复制代码

`watchEffect((onInvalidate) => {   const timer = setTimeout(() => {     console.log('网络请求成功~')   }, 3000)   console.log(num.value)   // 当上面的请求还没执行完就stop或者重新执行，就会触发   onInvalidate(() => {     clearTimeout(timer)     console.log('我是副作用执行了')   }) })`

### 补充：

> 1、`watchPostEffect()`：watchEffect() 使用 flush: 'post' 选项时的别名。
> 
> 2、`watchSyncEffect()`：watchEffect() 使用 flush: 'sync' 选项时的别名。

三、computed()计算属性
================

> 简单说明：当想要计算的属性发生变化时，就会重新触发计算，例如：购物车。

### 1、创建一个只读的计算属性 ref：

> 只要当num属性内容变化就会触发重新计算，computedNum会同步更新

xml

 代码解读

复制代码

`<template>   <div>   {{ num }}    // 5   {{ computedNum }}   // 10   </div> </template> <script setup> import { ref } from 'vue' const num = ref(5) const computedNum = computed(() => {   return num.value * 2 }) </script>`

### 2、创建一个可写的计算属性 ref：

> 简单说明：对计算属性读取内容或者写入数据时可以做额外逻辑处理

> 读取内容时：如下所有代码会取到内容是11，因为在get里面+1操作了，如果真实项目可以更多逻辑处理。

xml

 代码解读

复制代码

`<template>   <div>   {{ plusOne }}    // 11   </div> </template> <script setup> import { ref } from 'vue' const count = ref(10) const plusOne = computed({   get: () => count.value + 1,   set: (val) => {     count.value = val - 1   } }) </script>`

> 对计算属性写入内容时：如下`第17行`，对计算属性plusOne赋值1，但打印出来会是0，因为在set里面做了减一操作

xml

 代码解读

复制代码

`<template>   <div>   {{ plusOne }}    // 0   </div> </template> <script setup> import { ref } from 'vue' const count = ref(10) const plusOne = computed({   get: () => count.value + 1,   set: (val) => {     count.value = val - 1   } }) plusOne.value = 1 </script>`

小结：
===

以上总结的各种用法场景在真实项目中应该足够实用了，但是我们要分清什么场景使用watch什么场景使用computed。

> 我建议是：
> 
> 受多个数据影响的用computed, 例如购物车功能；
> 
> 一个数据会影响到其它很多数据的用watch，例如搜索数据功能。