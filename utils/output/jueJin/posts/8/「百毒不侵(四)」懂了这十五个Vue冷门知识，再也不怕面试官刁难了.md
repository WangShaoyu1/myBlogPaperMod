---
author: "Sunshine_Lin"
title: "「百毒不侵(四)」懂了这十五个Vue冷门知识，再也不怕面试官刁难了"
date: 2021-06-04
description: "前言 现在的前端市场，已经不能跟几年前的比了，几年前前端面试只要懂jq就行，但是现在的前端面试已经发展到源码级别了。。大家都很无奈，但是大家也都改变不了，所以我们既然改变不了它那就得去适应它，提升自己"
tags: ["面试","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:248,comments:37,collects:299,views:10271,"
---
前言
--

现在的前端市场，已经不能跟几年前的比了，几年前前端面试只要懂jq就行，但是现在的前端面试已经发展到源码级别了。。大家都很无奈，但是大家也都改变不了，所以我们`既然改变不了它那就得去适应它，提升自己，机会是留给有准备的人。`前几天跟一个朋友聊了一会，发现他许多主流的vue知识都倒背如流，但就是问起某些非主流的冷门Vue知识时，他大部门都回答不上来。所以我今天整理了十五个Vue的冷门知识，当然我也希望这只是我个人的冷门知识，毕竟我还是希望每一个同学都是大神哈哈哈！！！

> 如果您喜欢我的文章，就请您帮我点个赞吧，谢谢您！！！

1\. 如果子组件改变props里的数据会发生什么
-------------------------

### 1.1 改变的props数据是基本类型

> 如果修改的是基本类型，则会报错

```js
    props: {
    num: Number,
}
    created() {
    this.num = 999
}
```

![0458e2ff1538ee85d42953cec9a94ca.png](/images/jueJin/047859eda3bf47a.png)

### 1.2 改变的props数据是引用类型

```js
    props: {
        item: {
        default: () => {},
    }
}
    created() {
    // 不报错，并且父级数据会跟着变
    this.item.name = 'sanxin';
    
    // 会报错，跟基础类型报错一样
    this.item = 'sss'
    },
```

2\. props怎么自定义验证
----------------

```js
    props: {
        num: {
        default: 1,
            validator: function (value) {
            // 返回值为true则验证不通过，报错
                return [
                1, 2, 3, 4, 5
                ].indexOf(value) !== -1
            }
        }
    }
```

3\. watch的immediate属性有什么用？
--------------------------

> 比如平时created时要请求一次数据，并且当搜索值改变，也要请求数据，我们会这么写：

```js
    created(){
    this.getList()
    },
        watch: {
            searchInputValue(){
            this.getList()
        }
    }
```

> 使用`immediate`完全可以这么写，当它为`true`时，会初始执行一次

```js
    watch: {
        searchInputValue:{
        handler: 'getList',
        immediate: true
    }
}
```

4\. watch监听一个对象时，如何排除某些属性的监听
----------------------------

> 下面代码是，params发生改变就重新请求数据，无论是a，b，c，d属性改变

```js
    data() {
        return {
            params: {
            a: 1,
            b: 2,
            c: 3,
            d: 4
            },
            };
            },
                watch: {
                    params: {
                    deep: true,
                        handler() {
                        this.getList;
                        },
                        },
                    }
```

> 但是如果我只想要a，b改变时重新请求，c，d改变时不重新请求呢？

```js
    mounted() {
    Object.keys(this.params)
    .filter((_) => !["c", "d"].includes(_)) // 排除对c，d属性的监听
        .forEach((_) => {
            this.$watch((vm) => vm.params[_], handler, {
            deep: true,
            });
            });
            },
                data() {
                    return {
                        params: {
                        a: 1,
                        b: 2,
                        c: 3,
                        d: 4
                        },
                        };
                        },
                            watch: {
                                params: {
                                deep: true,
                                    handler() {
                                    this.getList;
                                    },
                                    },
                                }
```

5\. 审查元素时发现data-v-xxxxx，这是啥？
----------------------------

![image.png](/images/jueJin/ff63f90f2d924ff.png)

> 这是在标记vue文件中css时使用scoped标记产生的，因为要保证各文件中的css不相互影响，给每个component都做了唯一的标记，所以每引入一个component就会出现一个新的'data-v-xxx'标记

6\. computed如何实现传参？
-------------------

```js
// html
<div>{{ total(3) }}

// js
    computed: {
        total() {
            return function(n) {
            return n * this.num
        }
        },
    }
    
```

7\. vue的hook的使用
---------------

### 7.1 同一组件中使用

> 这是我们常用的使用定时器的方式

```js
    export default{
        data(){
        timer:null
        },
            mounted(){
                this.timer = setInterval(()=>{
                //具体执行内容
                console.log('1');
                },1000);
            }
                beforeDestory(){
                clearInterval(this.timer);
                this.timer = null;
            }
        }
```

> 上面做法不好的地方在于：得全局多定义一个timer变量，可以使用hook这么做：

```js
    export default{
        methods:{
            fn(){
                const timer = setInterval(()=>{
                //具体执行代码
                console.log('1');
                },1000);
                    this.$once('hook:beforeDestroy',()=>{
                    clearInterval(timer);
                    timer = null;
                    })
                }
            }
        }
```

### 7.2 父子组件使用

> 如果子组件需要在mounted时触发父组件的某一个函数，平时都会这么写：

```js
//父组件
<rl-child @childMounted="childMountedHandle"
/>
    method () {
        childMountedHandle() {
        // do something...
    }
    },
    
    // 子组件
        mounted () {
        this.$emit('childMounted')
        },
```

> 使用hook的话可以更方便：

```js
//父组件
<rl-child @hook:mounted="childMountedHandle"
/>
    method () {
        childMountedHandle() {
        // do something...
    }
    },
```

8\. provide和inject是响应式的吗？
-------------------------

```js
// 祖先组件
    provide(){
        return {
        // keyName: { name: this.name }, // value 是对象才能实现响应式，也就是引用类型
    keyName: this.changeValue // 通过函数的方式也可以[注意，这里是把函数作为value，而不是this.changeValue()]
    // keyName: 'test' value 如果是基本类型，就无法实现响应式
}
},
    data(){
        return {
        name:'张三'
    }
    },
        methods: {
            changeValue(){
            this.name = '改变后的名字-李四'
        }
    }
    
    // 后代组件
inject:['keyName']
    create(){
    console.log(this.keyName) // 改变后的名字-李四
}
```

9.Vue的el属性和$mount优先级？
---------------------

> 比如下面这种情况，Vue会渲染到哪个节点上

```js
    new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
    }).$mount('#ggg')
```

> 这是官方的一张图，可以看出`el`和`$mount`同时存在时，`el优先级` > `$mount`

![image.png](/images/jueJin/da6331091cb1454.png)

10\. 动态指令和参数使用过吗？
-----------------

```js
<template>
...
<aButton @[someEvent]="handleSomeEvent()" :[someProps]="1000" />...
</template>
<script>
...
    data(){
        return{
        ...
        someEvent: someCondition ? "click" : "dbclick",
        someProps: someCondition ? "num" : "price"
    }
    },
        methods: {
            handleSomeEvent(){
            // handle some event
        }
    }
    </script>
```

11\. 相同的路由组件如何重新渲染？
-------------------

> 开发人员经常遇到的情况是，多个路由解析为同一个Vue组件。问题是，Vue出于性能原因，默认情况下共享组件将不会重新渲染，如果你尝试在使用相同组件的路由之间进行切换，则不会发生任何变化。

```js
    const routes = [
        {
        path: "/a",
        component: MyComponent
        },
            {
            path: "/b",
            component: MyComponent
            },
            ];
```

> 如果依然想重新渲染，怎么办呢？可以使用`key`

```js
<template>
<router-view :key="$route.path"></router-view>
</template>
```

12\. 自定义v-model
---------------

> 默认情况下，v-model 是 @input 事件侦听器和 :value 属性上的语法糖。但是，你可以在你的Vue组件中指定一个模型属性来定义使用什么事件和value属性——非常棒！

```js
    export default: {
        model: {
        event: 'change',
        prop: 'checked'
    }
}
```

13\. 如何将获取data中某一个数据的初始状态？
--------------------------

> 在开发中，有时候需要拿初始状态去计算。例如

```js
    data() {
        return {
        num: 10
        },
            mounted() {
            this.num = 1000
            },
                methods: {
                    howMuch() {
                    // 计算出num增加了多少，那就是1000 - 初始值
                    // 可以通过this.$options.data().xxx来获取初始值
                    console.log(1000 - this.$options.data().num)
                }
            }
```

14.为什么不建议v-for和v-if同时存在
-----------------------

```js
<div v-for="item in [1, 2, 3, 4, 5, 6, 7]" v-if="item !== 3">
{{item}}
</div>
```

> 上面的写法是v-for和v-if同时存在，会先把7个元素都遍历出来，然后再一个个判断是否为3，并把3给隐藏掉，这样的坏处就是，渲染了无用的3节点，增加无用的dom操作，建议使用computed来解决这个问题：

```js
<div v-for="item in list">
{{item}}
</div>

    computed() {
        list() {
        return [1, 2, 3, 4, 5, 6, 7].filter(item => item !== 3)
    }
}
```

15.计算变量时，methods和computed哪个好？
-----------------------------

```js
<div>
<div>{{howMuch1()}}</div>
<div>{{howMuch2()}}</div>
<div>{{index}}</div>
</div>

    data: () {
        return {
        index: 0
    }
}
    methods: {
        howMuch1() {
        return this.num + this.price
    }
}
    computed() {
        howMuch2() {
        return this.num + this.price
    }
}
```

> `computed`会好一些，因为computed会有`缓存`。例如index由0变成1，那么会触发视图更新，这时候methods会重新执行一次，而computed不会，因为computed依赖的两个变量num和price都没变。

结语
--

主流知识固然重要，但是一些不常见的冷门知识也是需要知道的。

> 如果您觉得学到了东西，请您点个赞吧！谢谢您！！如果您想学习Vue源码相关知识，可以阅读我的源码系列文章
> 
> *   [你想知道Vuex的实现原理吗？](https://juejin.cn/post/6952473110377414686 "https://juejin.cn/post/6952473110377414686")
> *   [你真的知道插槽Slot是怎么“插”的吗？](https://juejin.cn/post/6949848530781470733 "https://juejin.cn/post/6949848530781470733")
> *   [「Vue源码学习(一)」你不知道的-数据响应式原理](https://juejin.cn/post/6968732684247892005 "https://juejin.cn/post/6968732684247892005")
> *   [「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")

学习群
---

请点击 [链接](https://juejin.cn/pin/6969565162885873701 "https://juejin.cn/pin/6969565162885873701")