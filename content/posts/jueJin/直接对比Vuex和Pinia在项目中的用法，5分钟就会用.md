---
author: "天天鸭"
title: "直接对比Vuex和Pinia在项目中的用法，5分钟就会用"
date: 2024-04-08
description: "横向对比vuex和pinia状态管理的用法差异。所以我将会从安装->使用->修改状态，每一步进行横向对比学习，这样会更加通俗易懂。"
tags: ["Vuex","Vue.js","JavaScript"]
ShowReadingTime: "阅读4分钟"
weight: 764
---
前言：
===

我相信看这编文章的大部分都是会vuex和pinia其中一个状态管理的，想对比学习另一个。所以我将会从安装->使用->修改状态，每一步进行横向对比学习，这样会更加通俗易懂。如果有某一天忘记了某个地方的写法回头查看一下也起到了笔记的作用。

一、pinia详细用法
===========

（1）安装pinia
----------

csharp

 代码解读

复制代码

`yarn add pinia     或者 npm npm install pinia`

（2）创建状态仓库
---------

> *   先得知道 pinia 是用 `defineStore()` 定义的，它的第一个参数要求是一个**独一无二的**名字
> *   `defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象。

pinia传入Option对象的核心概念包括：

> state: 用来定义一些变量  
> getters: 类似于计算属性  
> actions：里面是一些方法，在里面可以请求接口操作  

javascript

 代码解读

复制代码

`import {defineStore} from 'pinia' const useUser = defineStore("user",{     state:() => ({  // 用来定义一些变量         mycount: 1,     }),          getters: { // 类似于计算属性         double: (state) => state.mycount * 2,     },     actions: {  // 里面是一些方法，在里面可以请求接口操作         increment() {              this.mycount++          },         async registerUser(login, password) {  // 异步操作             await api.post({ login, password })         }     } }) export default useUser`

（3）项目在main.js文件中引入并注册使用
-----------------------

在main.js中引用，挂载为全局对象

javascript

 代码解读

复制代码

`import { createPinia } from "pinia"; const pinia = createPinia() app.use(pinia)`

（4）获取pinia的变量
-------------

> 引入后直接使用即可，对比vuex会方便很多

xml

 代码解读

复制代码

`<template>   <div>       看看state中的值：{{useUser.mycount}}       使用getters里面的计算属性： {{ useUser.double }}   </div> </template> <script setup> // 需要引入刚刚创建的store import useUser from '@/stores/index' // 得调用一下 const useUser = useUser() </script>`

> 注意： 不能对 useUser 进行解构否则会失去响应式， 但官方提供了storeToRefs这个方法用来解构，如下所示：

scss

 代码解读

复制代码

`// 用官方提供storeToRefs解构 const {mycount} = storeToRefs(useUser)`

（5）更新变量
-------

> 方法一： pinia可以直接修改state里面的变量，这是和vuex区别最大的地方，也是使的pinia使用起来更加灵活方便

xml

 代码解读

复制代码

`<template>   <div>       看看pinia的值：{{useUser.mycount}}       <button @click="update">修改pinia数据</button>   </div> </template> <script setup> import useUser from '@/stores/index' const useUser = useUser() // 直接就能修改 function update(){      useUser.mycount++ }`

缺点： 如果一次修改很多个不方便

> 方法二： $patch函数修改

php

 代码解读

复制代码

`function update(){     // 一次性修改多个状态     useUser.$patch({         name:"天天鸭",         age:20     }) }`

二、vuex详细用法
==========

（1）安装vuex
---------

sql

 代码解读

复制代码

`npm install vuex@next --save 或者 yarn add vuex@next --save`

（2）创建状态仓库
---------

vuex的核心概念包括：

> state: 用来定义一些变量  
> getters: 类似于计算属性  
> mutations: 是用来触发事件(必须是同步函数)，通过这个事件修改state里面的变量  
> Actions：用于提交mutations，可以包含任意异步操作, 在里面可以请求接口操作  
> Modules：将store分割成模块，每个模块拥有自己的state、getters、mutations和actions。  

创建一个store文件夹，里面创建index.js文件

javascript

 代码解读

复制代码

`import Vue from "vue" import Vuex from "vuex"   Vue.use(Vuex);   export default new Vuex.Store({     state:{  // 用来定义一些变量         userName: "",         count: 1,     },          getters: {  // 类似于计算属性         doneTodos (state) {           return state.count*2         }       },     mutations:{ // 是用来触发事件, 修改userName         saveName(state,userName){             state.userName = userName;         },     },          actions: {  // 用于提交mutations，可以包含任意异步操作，, 在里面可以请求接口操作         increment (context) {           context.commit('saveName')         }     } })`

（3）项目在main.js文件中引入并注册使用
-----------------------

javascript

 代码解读

复制代码

  `import store from './store/index';   new Vue({       el: '#app',       router,       store,       render: h => h(App)   });`

（4）获取vuex的变量
------------

例如在项目某个地方获取用户名称

方法一： 语法是 this.$store.state.变量名

kotlin

 代码解读

复制代码

  `this.$store.state.userName      //获取里面getters的内容  this.$store.getters.doneTodos`

方法二：可以用计算属性解构出来，能直接使用this.userName

kotlin

 代码解读

复制代码

`import { mapGetters } from 'vuex'  computed:{    ...mapGetters(['userName']),    doneTodosCount () {   //  //获取里面getters的内容      return this.$store.getters.doneTodos    }  },`

（5）更新变量
-------

即我想修改vuex中的一个变量,

方法一：语法this.$store.commit(触发的方法, 修改成什么内容)

javascript

 代码解读

复制代码

`methods:{     myclick(){         this.$store.commit('saveName', this.newName)     } }`

方法二：解构出来用

css

 代码解读

复制代码

  `methods: {       ...mapActions(['saveName'])   }   this.saveName()`

三、小结
====

如果你认真看完全部内容，你会发现pinia比vuex更加简洁更加灵活，甚至能直接修改state里面的变量，但其实并不是简单就绝对更好，我个人认为总的来说，认识vuex适合于大型项目或需要复杂状态管理的场景，而pinia则更适合于中小型项目或对状态管理需求不是很复杂的情况。选择使用哪个取决于项目的具体需求和开发团队的偏好。

> 纯用法上最主要差异：
> 
> （1）pinia能直接使用state,并且能直接修改；vuex要通过mutation去修改
> 
> （2）pinia处理方法只有action,不区分同步异步；vuex在mutation处理同步，在action处理异步
> 
> （3）pinia没有modules嵌套结构，是一个平面的结构，可创建不同的 Store