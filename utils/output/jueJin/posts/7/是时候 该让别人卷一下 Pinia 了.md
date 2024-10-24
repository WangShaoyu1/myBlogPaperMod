---
author: "Gaby"
title: "是时候 该让别人卷一下 Pinia 了"
date: 2022-05-28
description: "Pinia是一个全新的Vue状态管理库，由 Vuejs团队中成员所开发的，因此也被认为是下一代的 Vuex。同时是 vue 作者尤雨溪强势推荐的 vue3 状态管理工具"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:41,views:4001,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第1天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

pinia 简介
--------

Pinia（发音为`/piːnjʌ/`，类似英语中的'peenya'）是最接近`piña`（西班牙语中的_菠萝_）的词.Pinia是一个全新的Vue状态管理库，它允许您跨组件/页面共享数据状态。由 Vue.js团队中成员所开发的，因此也被认为是下一代的 Vuex。同时是 vue 作者尤雨溪强势推荐的 vue3 状态管理工具.

pinia文档：[pinia.vuejs.org/](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fintroduction.html "https://pinia.vuejs.org/introduction.html")

截止发稿时(2022-05-28)，Pinia 的版本为 `^2.0.14`

Pinia 的优点
---------

*   更简单的写法，代码更清晰简洁，支持 `composition api` 和 `options api` 语法；
*   完善的 `TypeScript` 支持，无需创建自定义复杂的包装类型来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断，与在 Vuex 中添加 TypeScript 相比，添加 TypeScript 更容易；
*   极其轻巧（体积约 1KB）；
*   store 的 action 被调度为常规的函数调用，而不是使用 dispatch 方法，这在 Vuex 中很常见；
*   支持多个Store，Pinia 不支持嵌套存储。相反，它允许你根据需要创建 store。但是，store 仍然可以通过在另一个 store 中导入和使用 store 来隐式嵌套；
*   开发工具的支持，支持 Vue devtools、SSR 和 webpack 代码拆分；
*   支持热更新. 可以在不重新加载页面的情况下修改您的 store，在开发时保持任何现有状态；
*   支持服务器端渲染；
*   插件：支持使用插件扩展 Pinia 功能；

与 Vuex 的比较
----------

官网原文 [与 Vuex 3.x/4.x 的比较](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fintroduction.html%23comparison-with-vuex "https://pinia.vuejs.org/introduction.html#comparison-with-vuex")

Pinia 最初是为了探索 Vuex 的下一次迭代会是什么样子，结合了 Vuex 5 核心团队讨论中的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，并决定实现它取而代之的是新的建议。

与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的仪式，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。

什么情况下用
------

使用 Pinia 进行数据存储，本质上就是全局变量，是包含可以在整个应用程序中访问的数据。这包括在许多地方使用的数据，例如在导航栏中显示的用户信息，以及需要通过页面保存的数据，例如非常复杂的多步骤表单。**在有必要切必须使用全局变量进行处理的时候才使用，并不是所有的数据都要存储进来。**

你应该避免在存储中包含可能托管在组件中的本地数据，例如页面本地元素的可见性。并非所有应用程序都需要访问全局状态，但如果您需要一个，Pania 将使您的生活更轻松。

事物都具备两面性，对于数据状态中的数据，可以在整个程序中都能访问并修改，这极大的增加了代码的耦合程度（`耦合度高`），这就给后期维护带来了一定的成本，**滥用势必会造成性能以及后期维护的困难**。

所以在使用的时候要注重代码质量、业务耦合度、后期维护等多方面。但也不能断章取义的一棒子打死说这种方案不可取，并**坚决反对**使用Vuex和Pinia这些东西。库本身没有好坏的，只有是否用对环境，用对时机，这个就仁者见仁智者见智了。

Pinia 的使用
---------

### 安装

```js
yarn add pinia
// or
pnpm add pinia
// or
npm install pinia
```

### 创建并使用

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.vue'

createApp(App).use(createPinia()).mount('#app')
```

如果您使用的是 Vue 2，您还需要安装一个插件并`pinia`在应用程序的根目录注入创建的插件：

```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

    new Vue({
    el: '#app',
    // other options...
    // ...
    // note the same `pinia` instance can be used across multiple Vue apps on
    // the same page
    pinia,
    })
```

在 Vue 2 中，Pinia 使用与 Vuex 一样的接口（因此不能与它一起使用）。但在 Vue 3 中可以共用，但一般情况下选择一种即可。

### 定义 store

我们需要知道存储是使用定义的`defineStore()`，并且它需要一个**唯一的**名称，作为第一个参数传递。这个是_名称_，也称为_id_，是必要的且在程序中是唯一的，Pania 使用它来将 store 连接到 devtools。将返回的函数命名为_use..._ 是组合API之间的约定，以符合使用习惯。

一个 store（如 Pinia）是一个实体，它持有未绑定到您的组件树的状态和业务逻辑。换句话说，**它托管全局状态**。它有点像一个始终存在并且每个人都可以读取和写入的组件。它包含**三个概念**，[状态](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fcore-concepts%2Fstate.html "https://pinia.vuejs.org/core-concepts/state.html")、[getter](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fcore-concepts%2Fgetters.html "https://pinia.vuejs.org/core-concepts/getters.html")和[动作](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fcore-concepts%2Factions.html "https://pinia.vuejs.org/core-concepts/actions.html")，并且可以安全地假设这些概念等同于`data`,`computed`和`methods`在组件中。

```js
// stores/counter.js
import { defineStore } from 'pinia'

// the first argument is a unique id of the store across your application
    export const useCounterStore = defineStore('counter', {
        // state: () => {
    //     return { count: 0 }
    // },
    // could also be defined as
        state: () => ({
        count: 0
        }),
        // Store 状态的计算属性
            getters: {
            double: (state) => state.count * 2,
            },
                actions: {
                    increment() {
                    this.count++
                    },
                    // action 可以进行异步操作，在它们内部进行任何API调用及其他操作
                        async registerUser(login, password) {
                            try {
                            this.userData = await api.post({ login, password })
                            showTooltip(`Welcome back ${this.userData.name}!`)
                                } catch (error) {
                                showTooltip(error)
                                // let the form component display the error
                                return error
                            }
                            },
                            })
```

### 使用

除了正常的使用方法外，注意下 `storeToRefs` 的使用. 这里通过实例介绍下，获取状态、访问状态、修改状态。除了直接用 改变 store 之外`store.counter++`，您还可以调用该`$patch`方法。`state`它允许您对部分对象同时应用多个更改。

```js
<script setup>
// 引入 Pinia 及 store 文件
import {storeToRefs} from  'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// 如果直接从pinia中解构数据，会丢失响应式
// const { count, double } = store

// 使用storeToRefs可以保证解构出来的数据也是响应式的
const { count, double } = storeToRefs(store)

// 通过 counter 直接可以访问里面的状态 也可以直接使用结构出来的数据
console.log(store.count, count)


// increment action 可以被直接结构出来
const { increment } = store

// 改变数据状态 count
    const addPiniaCount = ()=>{
    // 直接操作属性值
    // store.count++
    
    // 使用 autocompletion ✨
    // store.$patch({ count: counter.count + 1 })
    
    // 或者使用 action 来代替
    store.increment()
    // increment()
}
</script>

<template>
<div>
<p>
Pinia: count is: {{ store.count }}, double:{{double}}
</p>
<button size="mini" @click="addPiniaCount">+</button>
</div>
</template>
```

useMainStore实例化后的，我们就可以在 store 上访问 state、getters、actions 等

pinia中没有mutations。

更换`state`[#](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fcore-concepts%2Fstate.html%23replacing-the-state "https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state")
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

`$state`您可以通过将商店的属性设置为新对象来替换 store 的整个状态：

```js
store.$state = { counter: 520, name: 'Pinia' }
```

### 重置状态

您可以通过调用的方法将状态 _初始化_ store 的值：`$reset()`

```js
const store = useStore()

store.$reset()
```

### 订阅状态

通过 store.$subscribe() 的方法，该方法的第一个参数接受一个回调函数，该函数可以在 state 变化时触发

store.$subscribe() 的方法的第二个参数options对象，是各种配置参数，包括 detached 属性，其值是一个布尔值，默认是 false， 正常情况下，当 订阅所在的组件被卸载时，订阅将被停止删除，如果设置detached值为 true 时，即使所在组件被卸载，订阅依然可以生效。

默认情况下，state subscriptions 绑定到添加它们的组件，当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 { detached: true } 作为第二个参数传递给 detach 当前组件的 state subscription

```js
<script setup>
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

    const subscribe = store.$subscribe((mutation, state) => {
    console.log(mutation);
    // import { MutationType } from 'pinia'
    mutation.type // mutation 触发类型 'direct' | 'patch object' | 'patch function'
    // same as store.$id
    mutation.storeId // 'store'
    // only available with mutation.type === 'patch object'
    mutation.payload // patch object passed to cartStore.$patch()
    
    // state 就是 store 的状态
    console.log(state);
    })
    
    // 调用mainStore.$subscribe返回的值（即上方示例的 subscribe 变量）可以停止订阅
    subscribe()
    </script>
```

Action 订阅操作
-----------

可以使用观察的结果`store.$onAction()`。传递给它的这些活动`after`允许您在操作之前自行执行。承诺处理功能。以类似的解决方式，对于`onError`操作方式抛出或拒绝时执行功能。在运行时监视错误很有用，类似于[Vue 文档中的这个技巧](https://link.juejin.cn?target=https%3A%2F%2Fv3.vuejs.org%2Fguide%2Ftooling%2Fdeployment.html%23tracking-runtime-errors "https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors")。

可在 vue setup 中直接使用

```js
const unsubscribe = mainStore.$onAction(
    ({
    name, // action 的名称
    store, // store 实例, 这里指 `mainStore`
    args, // action 函数参数数组
    after, // 钩子函数，在action函数执行完成返回或者resolves后执行
    onError, // 钩子函数，在action函数报错或者rejects后执行
        }) => {
        // a shared variable for this specific action call
        const startTime = Date.now()
        // this will trigger before an action on `store` is executed
        console.log(`Start "${name}" with params [${args.join(', ')}].`)
        
        // this will trigger if the action succeeds and after it has fully run.
        // it waits for any returned promised
            after((result) => {
            console.log(
                `Finished "${name}" after ${
                Date.now() - startTime
                }ms.\nResult: ${result}.`
                )
                })
                
                // this will trigger if the action throws or returns a promise that rejects
                    onError((error) => {
                    console.warn(
                    `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
                    )
                    })
                }
                )
                
                // 移除监听
                unsubscribe()
```

路由中使用
-----

```js
import { createRouter } from 'vue-router'
import useMainStore from '@/store/main'
    const router = createRouter({
    // ...
    })
    
    // 报错
    const mainStore = useMainStore()
    
        router.beforeEach((to) => {
        // 正常使用
        const mainStore = useMainStore()
        })
```

store之间的相互调用
------------

在store中也可以访问其他store

```js
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

    export const useMainStore = defineStore('main', {
        getters: {
            users(state) {
            const userStore = useUserStore()
            return userStore.data + state.data
            },
            },
                actions: {
                    async getUserInfo() {
                    const userStore = useUserStore()
                        if (userStore.userInfo) {
                        ...
                    }
                    },
                    },
                    })
```

数据持久化
-----

这里采用持久化的插件是 `pinia-plugin-persist` [文档地址](https://link.juejin.cn?target=https%3A%2F%2Fseb-l.github.io%2Fpinia-plugin-persist%2F "https://seb-l.github.io/pinia-plugin-persist/")，有能力的小伙伴也可以自己写个简单的使用。

### 安装

```js
yarn add pinia-plugin-persist -D
// 或者
npm install pinia-plugin-persist --save -dev
```

### 配置

```js
import Vue, { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'

// 数据状态管理
const pinia = createPinia()
// 数据状态持久化
pinia.use(piniaPersist)

const app = createApp(App)
app.use(pinia).mount('#app')
```

### 使用

```js
// stores/counter.js
import { defineStore } from 'pinia'

    export const useCounterStore = defineStore('counter', {
        state: () => ({
        count: 0
        }),
            actions: {
                increment() {
                this.count++
                },
                },
                // 开启持久化
                    persist: {
                    enabled: true, // 启用
                        strategies: [
                        // 可以在 strategies 里自定义 key 值
                        // storage 可选localStorage或sessionStorage
                        // paths 给指定数据持久化 不指定则存储全部 只能存储 state 中定义的属性
                            {
                            key: 'pinia-counter',
                            storage: localStorage,
                        paths: ['count']
                    }
                ]
            }
            })
```

当你通过action里面的异步方法,对state里面的数据进行操作完成后,不要立即切换路由,否则数据可能存不到本地,稍等一会再切。

总结
--

总得来说，Pinia 就是 Vuex 的替代版，如何用，什么场景下用，还需要多考虑，不要盲目跟风随处可见，有的放矢，才能更好的提高代码的质量、提升性能、解耦组件。

以上就是关于 Pinia.js 用法的一些介绍，Pinia.js 的内容还远不止这些，更多内容及使用有待大家自己探索。

还有就是大家仔细阅读官方文档，多去写写实例来帮助自己更好的理解。只有理解了才能在使用的时候得心应手,此处只是抛砖引玉。当然有余力的小伙伴也可以阅读下源码。