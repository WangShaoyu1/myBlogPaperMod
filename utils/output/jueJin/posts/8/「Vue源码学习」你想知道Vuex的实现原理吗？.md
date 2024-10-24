---
author: "Sunshine_Lin"
title: "「Vue源码学习」你想知道Vuex的实现原理吗？"
date: 2021-04-18
description: "什么情况下我应该使用 Vuex？Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此"
tags: ["源码中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:127,comments:0,collects:87,views:9750,"
---
> ![image.png](/images/jueJin/087522b8cee549a.png)

> 大家好我是林三心，`Vuex` 是一个专为 `Vue.js` 应用程序开发的`状态管理模式`。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

![image.png](/images/jueJin/74845abaa4404ee.png)

什么情况下我应该使用 Vuex？
----------------

Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 store 模式 (opens new window)就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：

> Flux 架构就像眼镜：您自会知道什么时候需要它。

回顾 Vuex 的使用
-----------

### 安装

> Yarn

```js
yarn add vuex
```

> NPM

```js
npm install vuex --save
```

> 在一个模块化的打包系统中，您必须显式地通过 Vue.use() 来安装 Vuex：

```JS
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

### 注册store

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

    const store = new Vuex.Store({
        state: {
        count: 0
        },
            mutations: {
                increment (state) {
                state.count++
            }
        }
        })
        
            new Vue({
            el: '#app',
            store // 注册
            })
```

### State

1.  普通使用

```js
    const Counter = {
    template: `<div>{{ count }}</div>`,
        computed: {
            count () {
            return this.$store.state.count
        }
    }
}
```

> 每当 `this.$store.state.count` 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

2.  辅助函数

> 当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

    export default {
    // ...
        computed: mapState({
        // 箭头函数可使代码更简练
        count: state => state.count,
        
        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',
        
        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
            countPlusLocalState (state) {
            return state.count + this.localCount
        }
        })
    }
```

> 当映射的计算属性的名称与 `state` 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

```js
    computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
    ])
```

> 对象展开运算符

```js
    computed: {
    localComputed () { /* ... */ },
    // 使用对象展开运算符将此对象混入到外部对象中
        ...mapState({
        // ...
        })
    }
```

### Getters

1.  普通使用

> Getter 接受 state 作为其第一个参数：

```js
    const store = new Vuex.Store({
        state: {
            todos: [
            { id: 1, text: '...', done: true },
        { id: 2, text: '...', done: false }
    ]
    },
        getters: {
            doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        }
    }
    })
```

> Getter 也可以接受其他 getter 作为第二个参数：

```js
    getters: {
    // ...
        doneTodosCount: (state, getters) => {
        return getters.doneTodos.length
    }
}
```

> 我们可以很容易地在任何组件中使用它：

```js
    computed: {
        doneTodosCount () {
        return this.$store.getters.doneTodosCount
    }
}
```

> 注意，`getter` 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。(同理于`computed`的缓存，后面我会专门出一篇文章讲一讲）

> 你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

```js
    getters: {
    // ...
        getTodoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id)
    }
}
``````js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

2.  辅助函数

> mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：

```js
import { mapGetters } from 'vuex'

    export default {
    // ...
        computed: {
        // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
            // ...
            ])
        }
    }
```

> 如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
    ...mapGetters({
    // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
    doneCount: 'doneTodosCount'
    })
```

### Muations

1.  普通使用

> Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)

```js
    const store = new Vuex.Store({
        state: {
        count: 1
        },
            mutations: {
            increment (state, n) { // n为参数，可设置，可不设置，此参数也称为“载荷”
            // 变更状态
            state.count++
        }
    }
    })
``````js
// 使用
this.$store.commit('increment', 10)
```

2.  辅助函数

```js
import { mapMutations } from 'vuex'

    export default {
    // ...
        methods: {
            ...mapMutations([
            'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
            
            // `mapMutations` 也支持载荷：
            'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
            ]),
                ...mapMutations({
                add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
                })
            }
        }
```

> 在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，mutation 都是同步事务

### Action

> Action 类似于 mutation，不同在于：
> 
> *   Action 提交的是 mutation，而不是直接变更状态。
> *   Action 可以包含任意异步操作。

```js
    const store = new Vuex.Store({
        state: {
        count: 0
        },
            mutations: {
                increment (state) {
                state.count++
            }
            },
                actions: {
                // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
                incrementAsync (context , n) { // 可传“载荷” n
                    setTimeout(() => {
                    context.commit('increment')
                    }, 1000)
                }
            }
            })
``````js
// 执行
// 以载荷形式分发
    store.dispatch('incrementAsync', {
    amount: 10
    })
    
    // 以对象形式分发
        store.dispatch({
        type: 'incrementAsync',
        amount: 10
        })
```

2.  辅助函数

```js
import { mapActions } from 'vuex'

    export default {
    // ...
        methods: {
            ...mapActions([
            'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
            
            // `mapActions` 也支持载荷：
            'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
            ]),
                ...mapActions({
                add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
                })
            }
        }
```

3.  组合Action

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise
    actions: {
        async actionA ({ commit }) {
        commit('gotData', await getData())
        },
            async actionB ({ dispatch, commit }) {
            await dispatch('actionA') // 等待 actionA 完成
            commit('gotOtherData', await getOtherData())
        }
    }
```

### Module

> 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

> 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

```js
    const moduleA = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... },
getters: { ... }
}

    const moduleB = {
    state: () => ({ ... }),
    mutations: { ... },
actions: { ... }
}

    const store = new Vuex.Store({
        modules: {
        a: moduleA,
        b: moduleB
    }
    })
    
    store.state.a // -> moduleA 的状态
    store.state.b // -> moduleB 的状态
```

> 对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。

```js
    const moduleA = {
        state: () => ({
        count: 0
        }),
            mutations: {
                increment (state) {
                // 这里的 `state` 对象是模块的局部状态
                state.count++
            }
            },
            
                getters: {
                    doubleCount (state) {
                    // 这里的 `state` 对象是模块的局部状态
                    return state.count * 2
                }
            }
        }
```

> 同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState：

```js
    const moduleA = {
    // ...
        actions: {
            incrementIfOddOnRootSum ({ state, commit, rootState }) {
                if ((state.count + rootState.count) % 2 === 1) {
                commit('increment')
            }
        }
    }
}
```

> 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

```js
    const moduleA = {
    // ...
        getters: {
            sumWithRootCount (state, getters, rootState) {
            return state.count + rootState.count
        }
    }
}
```

> 模块的 `命名空间` 部分，以后有机会再讲哦

简单原理实现
------

### 讲解

> 看了`Vuex`源码文件，发现确实很多，我这里就讲我们最常用的部分功能的源码吧

> 其实使用过 Vuex 的同学都知道，我们在页面或者组件中都是通过`this.$store.xxx` 来调用的，那么其实，我们只要把你所创建的`store`对象赋值给页面或者组件中的`$store`变量即可

> `Vuex`的原理通俗讲就是：利用了`全局混入Mixin`，将你所创建的`store`对象，混入到每一个`Vue实例`中，那么`全局混入`是什么呢？举个例子：

```js
import Vue from 'vue'
// 全局混入
    Vue.mixin({
        created () {
        console.log('我是林三心')
    }
    })
    
    // 之后创建的Vue实例，都会输出'我是林三心'
        const a = new Vue({
        // 这里什么都没有，却能实现输出'我是林三心'
        })
        // => "我是林三心"
            const b = new Vue({
            // 这里什么都没有，却能实现输出'我是林三心'
            })
            // => "我是林三心"
```

> 上面例子看懂的人，就知道了，同理，把`console.log('我是林三心')`这段代码换成一段能做这件事的代码：把store赋值给实例的`$store`属性，就实现了：

![image.png](/images/jueJin/3503dcec2c4c437.png)

### 代码实现

> 目录

![image.png](/images/jueJin/e493ab68c26a445.png)

1.  vuex.js

```js
// vuex.js
let Vue;

// install方法设置，是因为Vue.use(xxx)会执行xxx的install方法
const install = (v) => { // 参数v负责接收vue实例
Vue = v;
// 全局混入
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.store) {
            // 根页面，直接将身上的store赋值给自己的$store，
            这也解释了为什么使用vuex要先把store放到入口文件main.js里的根Vue实例里
            this.$store = this.$options.store;
                } else {
                // 除了根页面以外，将上级的$store赋值给自己的$store
                this.$store = this.$parent && this.$parent.$store;
            }
            },
            })
        }
        
        // 创建类Store
            class Store {
            constructor(options) { // options接收传入的store对象
                this.vm = new Vue({
                // 确保state是响应式
                    data: {
                    state: options.state
                }
                });
                // getter
                let getters = options.getters || {};
                this.getters = {};
                console.log(Object.keys(this.getters))
                    Object.keys(getters).forEach(getterName => {
                        Object.defineProperty(this.getters, getterName, {
                            get: () => {
                            return getters[getterName](this.state);
                        }
                        })
                        })
                        // mutation
                        let mutations = options.mutations || {};
                        this.mutations = {};
                            Object.keys(mutations).forEach(mutationName => {
                                this.mutations[mutationName] = payload => {
                                mutations[mutationName](this.state, payload);
                            }
                            })
                            // action
                            let actions = options.actions || {};
                            this.actions = {};
                                Object.keys(actions).forEach(actionName => {
                                    this.actions[actionName] = payload => {
                                    actions[actionName](this.state, payload);
                                }
                                })
                            }
                            // 获取state时，直接返回
                                get state() {
                                return this.vm.state;
                            }
                            // commit方法，执行mutations的'name'方法
                                commit(name, payload) {
                                this.mutations[name](payload);
                            }
                            // dispatch方法，执行actions的'name'方法
                                dispatch(name, payload) {
                                this.actions[name](payload);
                            }
                        }
                        
                        // 把install方法和类Store暴露出去
                            export default {
                            install,
                            Store
                        }
```

2.  index.js

```js
// index.js
import Vue from 'vue';
import vuex from './vuex'; // 引入vuex.js暴露出来的对象
Vue.use(vuex); // 会执行vuex对象里的install方法，也就是全局混入mixin

// 实例一个Store类，并暴露出去
    export default new vuex.Store({
        state: {
        num: 1
        },
            getters: {
                getNum(state) {
                return state.num * 2;
            }
            },
                mutations: { in (state, payload) {
                state.num += payload;
                },
                    de(state, payload) {
                    state.num -= payload;
                }
                },
                    actions: { in (state, payload) {
                        setTimeout(() => {
                        state.num += payload;
                        }, 2000)
                    }
                }
                })
```

3.  main.js

```js
// main.js
import Vue from 'vue';
import App from './App.vue'

import store from './store/index'; // 引入刚刚的index.js


    new Vue({
    store, // 把store挂在根实例上
    el: '#app',
        components: {
        App
        },
        template: '<App/>',
        })
```

> 至此，简单实现了vuex的state，mutations，getter，actions。以后有机会会专门写一篇实现mudule的

> vue是不提倡全局混入mixin的，甚至连mixin都不倡导使用，别乱用哦！