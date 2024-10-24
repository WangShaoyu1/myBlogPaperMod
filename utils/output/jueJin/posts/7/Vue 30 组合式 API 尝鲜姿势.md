---
author: "Gaby"
title: "Vue 30 组合式 API 尝鲜姿势"
date: 2021-09-27
description: "如果业务场景并不复杂，可以继续沿用 Options API 方式书写，降低开发及学习成本，如果业务逻辑及应用场景比较复杂， 则使用 Composition API 方式。不是所有场景都适合组合API的"
tags: ["JavaScript","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:4,views:1047,"
---
小知识，大挑战！本文正在参与“[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")”创作活动。

开篇提个醒，来句废话只说一句：码字不易求个**赞👍**，**收藏等于学会**,**点击关注不迷路**，快行动起来吧！🙇‍🙇‍🙇‍。

* * *

适合对 Vue 有一定基础，想要更深入的理解 Vue3 的同学们。

> “你从头读，尽量往下读，直到你一窍不通时，再从头开始，这样坚持往下读，直到你完全读懂为止。”

Vue2与Vue3的对比
------------

*   对TypeScript支持不友好（所有属性都放在了this对象上，难以推倒组件的数据类型）
*   大量的API挂载在Vue对象的原型上，难以实现TreeShaking。
*   架构层面对跨平台dom渲染开发支持不友好
*   CompositionAPI。受ReactHook启发
*   更方便的支持了 jsx
*   Vue 3 的 Template 支持多个根标签，Vue 2 不支持
*   对虚拟DOM进行了重写、对模板的编译进行了优化操作...

可以确定的是 Vue3.0 是兼容 Vue2.x 版本的 也就是说我们再日常工作中 可以在 Vue3 中使用 Vue2.x 的相关语法 但是当你真正开始使用 Vue3 写项目时 你会发现他比 Vue2.x 方便的多

vue 2.0 生命周期对比 3.0 生命周期

2.0 周期名称

3.0 周期名称

说明

beforeCreate

setup

组件创建之前

created

setup

组件创建完成

beforeMount

onBeforeMount

组件挂载之前

mounted

onMounted

组件挂载完成

beforeUpdate

onBeforeUpdate

数据更新，虚拟 DOM 打补丁之前

updated

onUpdated

数据更新，虚拟 DOM 渲染完成

beforeDestroy

onBeforeUnmount

组件销毁之前

Vue 3.0 中引入了一种新的代码编写方式，那就是 Composition API，这是有别于 Vue 2.0 Options API 的一种函数式 API。无需通过指定一长串选项来定义组件，Composition API允许用户像编写函数一样自由地组合逻辑和代码。那么我们接下来就一起来看看 Composition API 是啥东东？

### **什么是 Composition API?**

> 组合式 API：一组低侵入式的、函数式的 API，使得我们能够更灵活地「组合」组件的逻辑

Composition API 将数据、方法、computed、生命周期函数,集中写在一个地方。

我们看一个简单的例子：

```js
<template>
<button @click="increment">
Count is: {{ state.count }}, double is: {{ state.double }}
</button>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

    const state = reactive({
    count: 0,
    double: computed(() => state.count * 2),
    })
    
        function increment() {
        state.count++
    }
    </script>
```

我们先来看下这段代码发生了啥？

```js
import { reactive, computed } from 'vue'
```

Composition API 是以函数的形式展示组件属性，所以第一步就是导入我们需要的函数。在我们的例子中，我们用 `reactive` 创建响应属性，用 `computed` 创建计算属性。在 setup 中引入即会被注册。

```js
// 使用 <script setup lang="ts"> 这种形式，等价于以下形式，但更简洁
    export default {
        setup() {
        // ...
            return {
            state,
            increment,
        }
    }
```

setup() 函数是 vue3 中，专门为组件提供的新属性。它为我们使用 vue3 的 Composition API 新特性提供了统一的入口, setup 函数会在 beforeCreate 、created 之前执行, vue3也是取消了这两个钩子，统一用setup代替, 该函数相当于一个生命周期函数，vue中过去的data，methods，watch等全部都用对应的新增api写在setup()函数中。

作为在组件内使用 Composition API 的入口点，如果 `setup` 返回一个对象，则对象的属性将会被合并到组件模板的渲染上下文，我们就可以在模板里使用对应的属性和方法。

`setup()`作为在组件内使用`Composition API`的入口点。执行时机是在`beforeCreate`和`created`之间,不能使用this获取组件的其他变量，而且不能是异步。`setup`返回的对象和方法，都可以在模版中使用。setup有两个参数,`props`,`context`。

1、创建时机

```kotlin
beforeCreate：表示组件刚刚被创建出来，组件的data和methods还没有初始化好
setup
Created：表示组件刚刚被创建出来，并且组件的data和methods已经初始化好
```

2、setup函数是 Composition API（组合API）的入口

3、在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法再模板中使用

**setup函数的注意点**：

1、由于在执行 setup函数的时候，还没有执行 Created 生命周期方法，所以在 setup 函数中，无法使用 data 和 methods 的变量和方法

2、由于我们不能在 setup函数中使用 data 和 methods，所以 Vue 为了避免我们错误的使用，直接将 setup函数中的this修改成了 undefined

3、setup函数只能是同步的不能是异步的

```js
<script lang="js">
import {toRefs} from 'vue'
    export default {
    name: 'demo',
        props:{
        name: String,
        },
            setup(props, context){
            // 这里需要使用toRefs来进行解构
            // 这里的props与vue2基本一致,当然这里的name也可以直接在template中使用
            const { name }=toRefs(props);
            console.log(name.value);
            // 只能获取到这三个属性,也是不能使用ES6的解构
            // 属性，同vue2的$attrs
            console.log(context.attrs);
            // 插槽
            console.log(context.slots);
            // 事件，同vue2的$emit
            console.log(context.emit);
        }
    }
    </script>
```

用法1:结合ref使用

```js
<template>
<div id="app">
{{name}}
<p>{{age}}</p>
<button @click="plusOne()">+</button>
</div>
</template>

<script>
import {ref} from 'vue'
    export default {
    name:'app',
        data(){
            return {
            name:'北京'
        }
        },
            setup(){
            //名字
            const name =ref('小李')
            //年纪
            const age=ref(18)
            // 方法
                function plusOne(){
                age.value++ //想改变值或获取值 必须.value
            }
            //必须返回 模板中才能使用
                return {
                name,age,plusOne
            }
        }
    }
    </script>
```

用法2：代码分割

Options API 和 Composition API

Options API 约定：

我们需要在 props 里面设置接收参数 在setup中没有this

我们需要在 data 里面设置变量

我们需要在 computed 里面设置计算属性

我们需要在 watch 里面设置监听属性

我们需要在 methods 里面设置事件方法

你会发现 Options APi 都约定了我们该在哪个位置做什么事，这反倒在一定程度上也强制我们进行了代码分割。现在用 Composition API，不再这么约定了，于是乎，代码组织非常灵活，我们的控制代码写在 setup 里面即可。

setup函数提供了两个参数 props和context,重要的是在setup函数里没有了this,在 vue3.0 中，访问他们变成以下形式：this.xxx=》[context.xxx](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttp%253A%2F%2Fcontext.xxx "https://link.zhihu.com/?target=http%3A//context.xxx")

我们没有了 this 上下文，没有了 Options API 的强制代码分离。Composition API 给了我们更加广阔的天地，那么我们更加需要慎重自约起来。

对于复杂的逻辑代码，我们要更加重视起 Composition API 的初心，不要吝啬使用 Composition API 来分离代码，用来切割成各种模块导出。

我们期望是这样的：

```bash
importuseAfrom'./a'
importuseBfrom'./b'
importuseCfrom'./c'
    exportdefault{
        setup (props) {
        let{ a, methodsA } = useA()
        let{ b, methodsB } = useA()
        let{ c, methodsC } = useC()
    return{ a, methodsA, b, methodsB, c, methodsC }
}
}
```

### **为什么要引入 Composition API**

在 Vue2 中我们采用 Options API 来写这个范例

```js
<template>
<button @click="increment">
Count is: {{ count }}, double is: {{ double }}
</button>
</template>

<script>
    export default {
        data() {
            return {
            count: 0
            };
            },
            
                computed: {
                    double() {
                    return this.count * 2;
                }
                },
                
                    methods: {
                        increment() {
                        this.count++;
                    }
                }
                };
                </script>
```

那在 Vue2 中如果我们要复用这个逻辑，我们可以通过诸如 `mixins`、高阶组件或是无渲染组件(通过作用域插槽实现的) 的模式达成。

首先我们来看下 mixins 的方式

```js
import CounterMixin from './mixins/counter'

    export default {
mixins: [CounterMixin]
}
```

`mixins` 存在的问题是

*   渲染上下文中暴露的 property 来源不清晰。例如在阅读一个运用了多个 mixin 的模板时，很难看出某个 property 是从哪一个 mixin 中注入的。\\
    
*   命名空间冲突。mixin 之间的 property 和方法可能有冲突。\\
    

那么我们来看下作用域插槽的方式:

```js
<template>
<Counter v-slot="{ count, increment }">
{{ count }}
<button @click="increment">Increment</button>
</Counter>
</template>
```

有了scoped slots，我们就可以通过v-slot属性准确地知道我们可以访问哪些属性，这样就更容易理解代码了。这种方法的缺点是，我们只能在模板中访问，而且只能在Counter组件作用域中使用。

除此之外，高阶组件和无渲染组件需要额外的有状态的组件实例，从而使得性能有所损耗。

至于我们为什么要用 setup，我想既然同学们要了解 Vue 3，应该对这个大版本要做和已经的事情有一个更全面的认知：

### Vue 3 的任务是：补短板 + 提上限

在今天我们看到的大部分较大的国内互联网公司所提供的 Web 产品中，使用的构建框架都是 React。在公司里有一些内部平台系统为了开发快速简单，选择了容易上手的 Vue，但普遍项目量级都还不算特别大。

**一个令人好奇的，与此相关的问题出现了：为什么大公司不敢用 Vue ？**

据我自己的体验来看，可以分为以下两点，这应该就是 Vue 过去的短板：

1.  **2.x 版本对 TypeScript 的支持是硬伤**，而 TypeScript 对大型项目的保障能力是被普遍认可的，看到 Vue 没法支持，在选择技术栈时很容易放弃它。
2.  **一旦项目体量变大，Vue 的代码会变得更难以维护**，真正在实践中 Options API 虽然在组件层面上，每个内容的职责都很清晰，这是 data，那是 method，但是从跨组件的角度来看就没那么好了，因此 Vue 2 缺少一种真正更好的抽象逻辑的办法，而非将代码搬到独立的 .js 文件里来缩减 SFC 代码行数。

解决这两个问题的思路也很明确，尤大也在很多视频演讲中提到了：

1.  函数是对类型最友好的，输入、输出的类型都是确定的，易推导的。**若要这样做，显然是用 TypeScript 重写一遍 Vue 更好。**
2.  虽然我们的页面内容被划分成了一个个的组件，但是我们思考的逻辑却不应该僵死地被他们框住，不需要在每个组件中罗列他们本身的职责，而是让组件去适配、去载入我们可多处复用的逻辑。Vue 需要为开发者提供一套新的框架内 API，使得程序员们能创造出更容易复用的 “ 业务 API ”。**若要这样做，显然需要一套新的函数式响应式 API，这些东西将成为我们书写业务逻辑的 “原语”**

这些更新内容都在 Vue 3 中完成了，通过一些社区中新的插件对 TypeScript 集成，我们还获得了更好的 DX 体验。

Vue最开始很小，但是现在被广泛应用到不同级别复杂度的业务领域，有些可以基于option API很轻松处理，但是有些不可以。例如下面的场景：

1.  有很多逻辑的大型组件（数百行）
2.  在多个组件可复用的逻辑

对于问题1，你需要把每个逻辑拆分到不同选项，例如，一段逻辑需要一些响应数据，一个计算属性，一些监听属性还有方法。你去了解这段逻辑时，需要不断上下移动阅读，虽然你知道一些属性是什么类型，但是你并不知道他具体的作用。当一个组件包含多个逻辑，情况就更糟糕了。如果用新的API，可以将数据和逻辑组合在一起，最重要的是，你可以`干净的把这些逻辑提取到一个函数，甚至一个单独的文件中。`

总体来说，`vue3`在尽可能的兼容`vue2`的同时，又引入了全新的组合式API的编程方式，这种新的模式有点类似react的思想，解决了之前版本对于业务代码难复用的问题，而且对一个页面来说，不同的功能代码可以更好的去区分，不会有以前各种变量和方法挤在一堆，后期难于维护的问题。加上良好的`ts`支持，很好很强大。  
周边的一些组件`vue Router4.0`, `vuex4.0`也都提供了`vue3`支持。组件库这块，`ant design vue`和`vant`已经支持了`vue3`。

* * *

如果业务场景并不复杂，可以继续沿用 Options API 方式书写，降低开发及学习成本，如果业务逻辑及应用场景比较复杂， 则使用 Composition API 方式。