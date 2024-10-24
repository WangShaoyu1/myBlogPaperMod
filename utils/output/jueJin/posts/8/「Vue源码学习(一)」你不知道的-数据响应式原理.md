---
author: "Sunshine_Lin"
title: "「Vue源码学习(一)」你不知道的-数据响应式原理"
date: 2021-06-01
description: "前言 当今的前端面试，越来越注重源码这一块了。而且就算没有面试，我想，每一个vue的使用者，在使用了一段时间的vue框架之后，也应该自觉去思考，这个框架是怎么实现的，他怎么就能这么方便呢？当然，这也不"
tags: ["源码中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:224,comments:23,collects:188,views:14149,"
---
前言
--

当今的前端面试，越来越注重源码这一块了。而且就算没有面试，我想，每一个vue的使用者，在使用了一段时间的vue框架之后，也应该自觉去思考，这个框架是怎么实现的，他怎么就能这么方便呢？当然，这也不是必须的，其实看源码，可能就是一个兴趣爱好吧。。从今天开始，本菜鸟将稳定更新`vue源码分析系列`的文章，如果你们觉得我的文章不错，请给我一个小赞，嘻嘻。

代码
--

### 1.目录

![image.png](/images/jueJin/5c89cc122afe435.png)

### 2.new一个Vue的实例

> 想要使用vue，肯定要先new一个Vue实例，参数是一个对象，我们称之为`options`

```js
// index.js
// 实例一个Vue对象
    let vue = new Vue({
    props: {},
        data() {
            return {
            a: 1,
            b: [1],
        c: { d: 1 }
    }
    },
    watch: {},
render: () => {}
})
```

### 3.对options对象的初始化

> 传进来的options对象，需要对数据进行初始化

```js
// index.js
const { initMixin } = require('./init')

    function Vue(options) {
    // 初始化传进来的options配置
    this._init(options)
}

// 配置Vue构造函数的_init方法
// 这么做有利于代码分割
initMixin(Vue)
// 实例一个Vue对象
    let vue = new Vue({
    props: {},
        data() {
            return {
            a: 1,
            b: [1],
        c: { d: 1 }
    }
    },
    watch: {},
render: () => {}
})
```

> 将初始化函数`_init`挂到`Vue`的原型上

```js
// init.js
const { initState } = require('./state')

    function initMixin(Vue) {
    // 在Vue的原型上挂载_init函数
        Vue.prototype._init = function (options) {
        // vm变量赋值为Vue实例
        const vm = this
        
        // 将传进来的options对象赋值给vm上的$options变量
        vm.$options = options
        
        // 执行初始化状态函数
        initState(vm)
    }
}

    module.exports = {
    initMixin: initMixin
}
```

> *   initState：总初始化函数，初始化`props，data，watch，methods，computed`等
> *   initData：初始化`data`的函数
> *   proxy：代理函数，主要作用是this.data.xxx的读写可以直接this.xxx实现，少去中间的data

```js
const { observe } = require('./observer/index')

    function initState(vm) {
    
    // 获取vm上的$options对象，也就是options配置对象
    const opts = vm.$options
        if (opts.props) {
        initProps(vm)
    }
        if (opts.methods) {
        initMethods(vm)
    }
        if (opts.data) {
        // 如有有options里有data，则初始化data
        initData(vm)
    }
        if (opts.computed) {
        initComputed(vm)
    }
        if (opts.watch) {
        initWatch(vm)
    }
}

// 初始化data的函数
    function initData(vm) {
    // 获取options对象里的data
    let data = vm.$options.data
    
    // 判断data是否为函数，是函数就执行（注意this指向vm），否则就直接赋值给vm上的_data
    // 这里建议data应为一个函数，return 一个 {}，这样做的好处是防止组件的变量污染
data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

// 为data上的每个数据都进行代理
// 这样做的好处就是，this.data.a可以直接this.a就可以访问了
    for (let key in data) {
    proxy(vm, '_data', key)
}


// 对data里的数据进行响应式处理
// 重头戏
observe(data)
}

// 数据代理
    function proxy(object, sourceData, key) {
        Object.defineProperty(object, key, {
        // 比如本来需要this.data.a才能获取到a的数据
        // 这么做之后，this.a就可以获取到a的数据了
            get() {
        return object[sourceData][key]
        },
        // 比如本来需要this.data.a = 1才能修改a的数据
        // 这么做之后，this.a = 1就能修改a的数据了
            set(newVal) {
            object[sourceData][key] = newVal
        }
        })
    }
    
module.exports = { initState: initState }
```

### 4.响应式处理

> *   Observer：观察者对象，对`对象或数组`进行响应式处理的地方
> *   defineReactive：拦截对象上每一个`key`的`get与set函数`的地方
> *   observe：响应式处理的入口

> 流程大概是这样：observe -> Observer -> defineReactive -> observe -> Observer -> defineReactive 递归

```js
const { arrayMethods } = require('./array')

// 观察者对象，使用es6的class来构建会比较方便
    class Observer {
        constructor(value) {
        // 给传进来的value对象或者数组设置一个__ob__对象
        // 这个__ob__对象大有用处，如果value上有这个__ob__，则说明value已经做了响应式处理
            Object.defineProperty(value, '__ob__', {
            value: this, // 值为this，也就是new出来的Observer实例
            enumerable: false, // 不可被枚举
            writable: true, // 可用赋值运算符改写__ob__
            configurable: true // 可改写可删除
            })
            
            // 判断value是函数还是对象
                if(Array.isArray(value)) {
                // 如果是数组的话就修改数组的原型
                value.__proto__ = arrayMethods
                // 对数组进行响应式处理
                this.observeArray(value)
                    } else {
                    // 如果是对象，则执行walk函数对对象进行响应式处理
                    this.walk(value)
                }
            }
            
                walk(data) {
                // 获取data对象的所有key
                let keys = Object.keys(data)
                // 遍历所有key，对每个key的值进行响应式处理
                    for(let i = 0; i < keys.length; i++) {
                const key = keys[i]
            const value = data[key]
            // 传入data对象，key，以及value
            defineReactive(data, key, value)
        }
    }
    
        observeArray(items) {
        // 遍历传进来的数组，对数组的每一个元素进行响应式处理
            for(let i = 0; i < items.length; i++) {
            observe(items[i])
        }
    }
}

    function defineReactive(data, key, value) {
    // 递归重要步骤
    // 因为对象里可能有对象或者数组，所以需要递归
    observe(value)
    
    
    // 核心
    // 拦截对象里每个key的get和set属性，进行读写监听
    // 从而实现了读写都能捕捉到，响应式的底层原理
        Object.defineProperty(data, key, {
            get() {
            console.log('获取值')
            return value
            },
                set(newVal) {
                if (newVal === value) return
                console.log('设置值')
                value = newVal
            }
            })
        }
        
        
            function observe(value) {
            // 如果传进来的是对象或者数组，则进行响应式处理
                if (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
                return new Observer(value)
            }
        }
        
            module.exports = {
            observe: observe
        }
```

### 5.为什么对象和数组要分开处理呢：

> *   `对象`的属性通常比较少，对每一个属性都劫持`set和get`，并不会消耗很多性能
> *   `数组`有可能有成千上万个元素，如果每一个元素都劫持`set和get`，无疑消耗太多性能了
> *   所以`对象`通过`defineProperty`进行正常的劫持`set和get`
> *   `数组`则通过`修改数组原型上的部分方法`，来实现`修改数组触发响应式`

### 6.遗留下的问题：

> *   对象新增属性时没有劫持到`set函数`，所以新增属性无法触发响应式
> *   数组修改只能通过改写的方法，无法直接arr\[index\] = xxx 进行修改，也无法通过length属性进行修改

### 7.Vue官方提供的解决方案

> Vue官方提供了`$set`的方法解决了以上问题，使用方法是`this.$set(obj, key, value)`

### 8.流程图

![image.png](/images/jueJin/8f0696bfaf9e417.png)

结语
--

本文仅实现数据修改响应的功能，后续会讲视图更新，请关注我哦。 下一讲[「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")

> 如果你从本文中学到了点啥，那就请给我点赞吧，谢谢您！！！

参考文章
----

[鲨鱼哥-手写 Vue2.0 源码（一）-响应式数据原理](https://juejin.cn/post/6935344605424517128 "https://juejin.cn/post/6935344605424517128")

加我拉你进学习群
--------

微信号：