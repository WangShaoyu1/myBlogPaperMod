---
author: "政采云技术"
title: "新一代vue状态管理工具Pinia"
date: 2023-10-18
description: "作为前端开发，你肯定知道状态管理是日常开发很重要的一部分。你肯定也听过许多状态管理工具，今天我们说一下 Vue 系列的新起之秀 Pinia。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:30,comments:4,collects:45,views:5695,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png)

![大喵.png](/images/jueJin/a09dc0627a95483.png)

轻量状态管理工具 Pinia
==============

![D6F5AED0-E6CA-4A0E-AF22-FEDE2F39FE7A.png](/images/jueJin/67b2f6dbb51f434.png)

前言
--

作为前端开发，你肯定知道状态管理是日常开发很重要的一部分。你肯定也听过许多状态管理工具，今天我们说一下 Vue 系列的新起之秀 Pinia。

什么是 Pinia
---------

Pinia 和 Vuex 一样是专门为 Vue 设计的状态管理库，它允许你跨组件或页面共享状态，Api 设计比 Vuex 更简单易学，且同时支持 Vue2.0 和 Vue3.0。

安装
--

```csharp
yarn add pinia
// 或者使用 npm
npm install pinia
```

创建一个 Pinia 实例 (根 Store ) 并将其传递给应用：

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
​
const pinia = createPinia()
const app = createApp(App)
​
app.use(pinia)
app.mount('#app')
```

如何创建 Store
----------

在创建 Store 之前我们先简单描述一下什么是 Store

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它承载着全局状态，每个组件都可以读取和写入它。它有三个概念：State、Getter 和 Action，可以想象成组件中的 `Data`、 `Computed` 和 `Methods`。

创建一个 Store，在 src/stores 创建一个 counter.ts

```javascript
// stores/counter.ts
​
// options 模式
import { defineStore } from 'pinia'
    export const useCounterStore = defineStore('counter', {
        state: () => {
    return { count: 0 }
    },
        actions: {
            increment() {
            this.count++
            },
            },
            })
            ​
            ​
            // Setup 模式
            import { defineStore } from 'pinia'
                export const useCounterStore = defineStore('counter', () => {
                const count = ref(0)
                    function increment() {
                    count.value++
                }
                ​
            return { count, increment }
            })
            ​
```

上述代码就是创建一个 Store，DefineStore 可以随意命名，但最好保持 Use 这种风格，DefineStore 第一个参数是唯一的，不可重复，因为是应用中 Store 的唯一 ID，Pinia 将用 ID 连接 Store 和 Devtools。DefineStore 的第二个参数可以接受 Setup 函数或 Option 对象。

State
-----

State 的使用

```arduino
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
​
</script>
​
<template>
<div class="greetings">
{{counter.count}}
</div>
</template>
```

修改 State

```perl
// 直接修改
counter.count++
// 或者使用 $patch 修改 （可以修改多个属性）
    counter.$patch({
    count: counter.count + 1,
    })
    ​
```

重置 State

```perl
// 通过调用 store 的 $reset() 方法将 state 重置为初始值。
counter.$reset()
```

解构:

```arduino
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
const {count} = counter
</script>
​
<template>
<div class="greetings">
{{counter.count}}
{{count}}
</div>
</template>
​
```

State 也可以使用解构，但是解构会失去响应式，需要 StoreToRefs 避免丢失响应式

```javascript
import { storeToRefs } from 'pinia'
const counter = useCounterStore()
const {count} = storeToRefs(counter)
```

Getter
------

Getter 完全等同于 Store 的 State 的计算属性。写法也类似，可以使用 this 访问整个 Store 的实例，甚至可以访问其他 Store 的 Getter，而且可以和 Vue 一样返回一个函数 接受参数（但是这样 Getter 将不再被缓存，只是个被调用的函数），使用同 State 访问模式一样。

```typescript
import { useOtherStore } from './other-store'

    export const useCounterStore = defineStore('counter', {
        state: () => {
    return { count: 0 }
    },
        getters: {
        // 使用 state 可以自动推到出类型
            doubleCount(state) {
            return state.count * 2
            },
            // 返回类型必须明确设置
                doublePlusOne(): number {
                return this.doubleCount + 1
                },
                //还可以访问其他 getter
                    otherGetter(state) {
                    const otherStore = useOtherStore()
                    return state.count + otherStore.count
                    },
                    },
                        actions: {
                            increment() {
                            this.count++
                            },
                            },
                            })
```

Action
------

Action 相当于组件中的 Methods，类似 Getter，Action 也可通过 this 访问整个 Store 的实例 Action 也可以是异步的，还可以访问其他Store 的 Action。

```javascript
import { useAuthStore } from './user'

    export const useCounterStore = defineStore('counter', {
        state: () => {
            return {
        userInfo: {}
    }
    },
        actions: {
            async fetchUserInfo() {
            const auth = useAuthStore()
                if (auth.isAuthenticated) {
                this.userInfo = await fetchUserInfo()
            }
            },
            },
            })
```

调用

```xml
<script setup>
const store = useCounterStore()
// 将 action 作为 store 的方法进行调用
store.fetchUserInfo()
</script>
<template>
<!-- 即使在模板中也可以 -->
<button @click="store.fetchUserInfo()">点击我</button>
</template>
```

总结
--

以上就是 Pinia 的基本使用。回顾以前使用的 Vuex 是不是 Api 是不是非常简洁，Pinia 抛弃了 Mutation 和 Module，只保留State、Getter 和 Action，而且使用方法和组件中 `Data`、 `Computed` 和 `Methods` 类似，上手零成本。而且支持 ts，极致轻量化代码只有1kb左右。

参考链接
----

[pinia.web3doc.top/](https://link.juejin.cn?target=https%3A%2F%2Fpinia.web3doc.top%2F "https://pinia.web3doc.top/")

推荐阅读
----

[Cola-StateMachine状态机的实战使用](https://juejin.cn/post/7290727062145499175 "https://juejin.cn/post/7290727062145499175")

[Redisson杂谈](https://juejin.cn/post/7288607047573422140 "https://juejin.cn/post/7288607047573422140")

[react-grid-layout 之核心代码分析与实践](https://juejin.cn/post/7288229413036048442 "https://juejin.cn/post/7288229413036048442")

[@Transactional注解使用以及事务失效的场景](https://juejin.cn/post/7283348301252542521 "https://juejin.cn/post/7283348301252542521")

[REDIS 数据结构与对象](https://juejin.cn/post/7283151314023317561 "https://juejin.cn/post/7283151314023317561")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2F "http://zoo.zhengcaiyun.cn/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com") ![底图-v3.png](/images/jueJin/63372e91db394c6.png)