---
author: "Sunshine_Lin"
title: "「Vue源码学习(四)」立志写一篇人人都看的懂的computed，watch原理"
date: 2021-06-16
description: "前言 朋友们大家好，我是林三心，还是那句话：改变不了，那就适应它，源码的理解在当今前端市场越来越重要了，理解源码，可以使我们在开发中更快地捕捉到问题所在，今天讲到computed，watch的原理，个"
tags: ["Vue.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:219,comments:0,collects:268,views:17107,"
---
前言
--

朋友们大家好，我是林三心，还是那句话：`改变不了，那就适应它`，源码的理解在当今前端市场越来越重要了，理解源码，可以使我们在开发中更快地捕捉到问题所在，今天讲到`computed，watch的原理`，个人建议朋友们先看这个系列的前几篇文章，或许能更好地理解本章内容，当然，我会尽我所能让大家能更好地理解`computed，watch原理`，我尽量讲的通俗易懂一些。你们不要嫌我啰嗦哦。  
😂😂😂  
`「Vue源码学习」`文章：

*   [「Vue源码学习(一)」你不知道的-数据响应式原理](https://juejin.cn/post/6968732684247892005 "https://juejin.cn/post/6968732684247892005")
*   [「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")
*   [「Vue源码学习(三)」你不知道的-初次渲染原理](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044")
*   [「Vue源码学习(四)」立志写一篇人人都看的懂的computed，watch原理](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044")
*   [「Vue源码学习(五)」面试官喜欢问的——Vue常用方法源码解析](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044") 或者对我的其他`vue源码文章`感兴趣的可以看我的这些文章：
*   [一周一个Vue小知识：你想知道Vuex的实现原理吗？](https://juejin.cn/post/6952473110377414686 "https://juejin.cn/post/6952473110377414686")
*   [一周一个Vue小知识：你真的知道插槽Slot是怎么“插”的吗](https://juejin.cn/post/6949848530781470733 "https://juejin.cn/post/6949848530781470733")

预计实现效果
------

![20210615_220340.gif](/images/jueJin/f86711bcd2b3493.png)

知识前提
----

需要懂基本的npm命令，ES6语法，以及webpack基本打包

准备工作
----

### 1.创建一个文件夹

```js
npm init

npm i @babel/core @babel/preset-env babel-loader clean-webpack-plugin html-webpack-plugin webpack webpack-cli webpack-dev-server -D
```

### 2.创建`webpack.config.js`文件

> 目的：配置热更新打包

```js
// webpack.config.js

const path = require('path')
// 引入html-webpack-plugin插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 引入webpack插件
const webpack = require('webpack');
    module.exports = {
    mode: 'development',
    devtool: 'eval',
        devServer: {
        contentBase: './dist',
        open: true,
        hot: true
        },
        entry: './src/index.js',
            output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, '../dist')
            },
                module: {
                    rules: [
                        {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        exclude: /node_modules/
                        },
                    ]
                    },
                        plugins: [
                        new HtmlWebpackPlugin({ // 往dist里塞html并且把bundle搞进去
                        template: './src/index.html'
                        }),
                        new CleanWebpackPlugin(), // 执行时间，在打包之前执行,改变输出文件后，下一次打包可以清除老文件
                        new webpack.HotModuleReplacementPlugin() // 更新后不会刷新，保留后加的数据
                    ]
                }
```

### 3.package命令行修改

```js
    "scripts": {
    "dev": "webpack-dev-server --config ./webpack.config.js"
    },
```

### 4.创建`.babelrc`文件

```js
// .babelrc

    {
"presets":["@babel/preset-env"]
}
```

### 5.创建src文件夹

> 目的：存放本章原理代码

### 6.最终目录

![image.png](/images/jueJin/768f6e3ad98f409.png)

### 7.Vue实例

```js
// src/index.html

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>林三心Vue源码</title>
</head>

<body>
<div id="root"></div>
</body>
</html>
``````js
// src/index.js

import Vue from './init.js'

const root = document.querySelector('#root')
    var vue = new Vue({
        data() {
            return {
            name: '林三心',
            age: 18
        }
        },
            render() {
            root.innerHTML = `${this.name}今年${this.age}岁了
        }
        })
        
        
```

### 8\. 如何调试

```js
npm run dev
然后将index.html在谷歌浏览器里打开（live server）
```

Watcher是什么？Watcher的种类有哪些？
-------------------------

> 大家要注意，这里说的是`Watcher`，要跟vue里使用的`watch`属性区分一下哦

### 1.什么是Watcher呢？

> 举个例子，请看下面代码：

```js
// 例子代码，与本章代码无关

<div>{{name}}</div>

    data() {
        return {
        name: '林三心'
    }
    },
        computed: {
            info () {
            return this.name
        }
        },
            watch: {
                name(newVal) {
                console.log(newVal)
            }
        }
```

上方代码可知，`name`变量被三处地方所依赖，分别是`html里，computed里，watch里`。只要`name`一改变，html里就会重新渲染，computed里就会重新计算，watch里就会重新执行。那么是谁去通知这三个地方`name`修改了呢？那就是`Watcher`了

### 2.Watcher的种类有哪些呢？

上面所说的三处地方就刚刚好代表了三种`Watcher`，分别是：

*   `渲染Watcher`：变量修改时，负责通知HTML里的重新渲染
*   `computed Watcher`：变量修改时，负责通知computed里依赖此变量的computed属性变量的修改
*   `user Watcher`：变量修改时，负责通知watch属性里所对应的变量函数的执行

实现数据响应式
-------

> 任何类型的`Watcher`都是基于`数据响应式`的，也就是说，要想实现`Watcher`，就需要先实现`数据响应式`，而`数据响应式`的原理就是通过`Object.defineProperty`去劫持变量的`get`和`set`属性

> 这里的响应式只做了简单的响应式处理，如果想看详细的，请移步[「Vue源码学习(一)」你不知道的-数据响应式原理](https://juejin.cn/post/6968732684247892005 "https://juejin.cn/post/6968732684247892005")，也就是此系列的第一篇。

### 1.初始化Vue

```js
// src/init.js

import initState from './initState.js'
import initComputed from './initComputed.js'
import initWatch from './initWatch'
import Watcher from './Watcher.js'

    export default function Vue(options) {
    
    // 初始化函数
    this._init(options)
}

    Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
        if (options.data) {
        // 初始化数据
        initState(vm)
    }
}
```

### 2.什么是Dep？

Dep是什么呢？举个例子，还是之前的例子代码：

```js
// 例子代码，与本章代码无关

<div>{{name}}</div>

    data() {
        return {
        name: '林三心'
    }
    },
        computed: {
            info () {
            return this.name
        }
        },
            watch: {
                name(newVal) {
                console.log(newVal)
            }
        }
```

这里`name`变量被三个地方所依赖，三个地方代表了三种`Watcher`，那么`name`会直接自己管这三个`Watcher`吗？答案是不会的，`name`会实例一个Dep，来帮自己管这几个`Wacther`，类似于管家，当`name`更改的时候，会通知dep，而dep则会带着主人的命令去通知这些`Wacther`去完成自己该做的事

### 3.响应式实现

```js
// src/initState.js

import { Dep } from "./Dep"

    export default function initState(vm) {
    let data = vm.$options.data
    
    // data为函数则执行
    // 建议data为函数，防止变量互相污染
data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {}

const keys = Object.keys(data)

let i = keys.length
    while (i--) {
    // 变量代理
    // 这样做的好处就是操作data里的变量时，只需要this.xxx而不用this.data.xxx
    proxy(vm, '_data', keys[i])
}
observe(data)
}

    class Observer {
        constructor(value) {
        this.walk(value)
    }
    
        walk(data) {
        let keys = Object.keys(data)
        // 遍历data的key，并进行响应式判断处理
            for (let i = 0; i < keys.length; i++) {
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}

    function defineReactive(data, key, value) {
    // 每个对象都有自己dep
    const dep = new Dep()
        Object.defineProperty(data, key, {
            get() {
                if (Dep.target) {
                // 如果Dep.target指向某个Watcher，则把此Watcher收入此dep的队列里
                dep.depend()
            }
            return value
            },
                set(newVal) {
                // 设置值时，如果相等则返回
                if (newVal === value) return
                value = newVal
                // 新设置的值也需要响应式判断处理
                observe(newVal)
                
                // 通知dep里的所有Wacther进行传达更新
                dep.notify()
            }
            })
            
            // 递归，因为可能对象里有对象
            observe(value)
        }
        
            function observe(data) {
            // 只有当data为数组或者对象时才进行响应式处理
                if (typeof data === 'object' && data !== null) {
                return new Observer(data)
            }
        }
        
        // 代理函数
            function proxy(vm, source, key) {
                Object.defineProperty(vm, key, {
                    get() {
                return vm[source][key]
                },
                    set(newVal) {
                    return vm[source][key] = newVal
                }
                })
            }
``````js
// src/Dep.js
let dId = 0

    export class Dep {
        constructor() {
        // 每个dep的id都是独一无二的
        this.id = dId++
        // 用来存储Watcher的数组
    this.subs = []
}

    depend() {
        if (Dep.target) {
        // 此时Dep.target指向的是某个Wacther，Wacther也要把此dep给收集起来
        Dep.target.addDep(this)
    }
}

    notify() {
    // 通知subs里的每个Wacther都去通知更新
    const tempSubs = this.subs.slice()
    tempSubs.reverse().forEach(watcher => watcher.update())
}

    addSub(watcher) {
    // 将Watcher收进subs里
    this.subs.push(watcher)
}
}

let stack = []
    export function pushTarget(watcher) {
    // 改变target的指向
    Dep.target = watcher
    stack.push(watcher)
}

    export function popTarget() {
    stack.pop()
Dep.target = stack[stack.length - 1]
}

```

### 4.Watcher为何也要反过来收集Dep？

上面说到了，dep是`name`的管家，他的职责是：`name`更新时，dep会带着主人的命令去通知subs里的`Watcher`去做该做的事，那么，dep收集`Watcher`很合理。那为什么watcher也需要反过来收集dep呢？这是因为computed属性里的变量没有自己的dep，也就是他没有自己的管家，看以下例子：

> 这里先说一个知识点：如果html里不依赖`name`这个变量，那么无论`name`再怎么变，他都`不会主动`去刷新视图，因为html没引用他（说专业点就是：`name`的`dep`里没有`渲染Watcher`），注意，这里说的是`不会主动`，但这并不代表他不会`被动`去更新。什么情况下他会被动去更新呢？那就是computed有依赖他的属性变量。

```js
// 例子代码，与本章代码无关

<div>{{person}}</div>

    computed: {
        person {
        return `名称：${this.name}`
    }
}
```

这里的`person`事依赖于`name`的，但是`person`是没有自己的`dep`的（因为他是computed属性变量），而`name`是有的。好了，继续看，请注意，此例子html里只有`person`的引用没有`name`的引用，所以`name`一改变，按理说虽然`person`跟着变了，但是html不会重新渲染，因为`name`虽然有`dep`，有更新视图的能力，但是奈何人家html不引用他啊！`person`想要自己去更新视图，但他却没这个能力啊，毕竟他没有`dep`这个管家！这个时候`computed Watcher`里收集的`name`的`dep`就派上用场了，可以借助这些`dep`去更新视图，达到更新html里的`person`的效果。具体会在下面computed里实现。

### 5.逻辑有点绕

这里逻辑确实有点绕，因为dep和watcher互相采集，大家在调试过程中可以自己`console.log`一下`dep`的`subs`看看，这样会更能看清逻辑。这里可以看到，`dep`收集`watcher`，而`watcher`也会反过来收集`dep`。 此时输出了两个`dep`，因为有`name`和`age`，一个变量有一个`dep`所以总共两个`dep`，由于这两个变量都被html所依赖，所以每个`dep`的`subs`里都收集了`渲染Watcher`，反过来，`渲染Watcher`也要收集这两个`dep`，如图：

![image.png](/images/jueJin/b3dcb9dbfcb64b0.png)

实现Watcher
---------

```js
// src/Watcher.js

let wid = 0
    class Watcher {
        constructor(vm, exprOrFn, cb, options) {
        this.vm = vm // 把vm挂载到当前的this上
            if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn // 把exprOrFn挂载到当前的this上，这里exprOrFn 等于 vm.$options.render
        }
        this.cb = cb // 把cb挂载到当前的this上
        this.options = options // 把options挂载到当前的this上
        this.id = wid++
        this.value = this.get() // 相当于运行 vm.$options.render()
    }
        get() {
        const vm = this.vm
        let value = this.getter.call(vm, vm) // 把this 指向到vm
        return value
    }
}
```

首次渲染（渲染Watcher）
---------------

上面说过，只要把`render`函数传进`Wacther`，那么此`Watcher`为`渲染Watcher`，`渲染Watcher`的作用是：首次渲染，并且HTML模板所依赖的变量改变时也会重新渲染。

```js
    export default function Vue(options) {
    
    // 初始化函数
    this._init(options)
    
    // 渲染函数
    this.$mount()
}

    Vue.prototype.$mount = function() {
    const vm = this
    // 创建渲染Watcher
    // 这里第二个参数传render函数进去，则此Watcher为渲染Watcher
    // 因为在此例子里render为渲染dom的函数
    new Watcher(vm, vm.$options.render, () => {}, true)
}
```

此时在终端里运行`npm run dev`，并`live server`打开index.html文件，看到以下效果，则证明首次渲染成功：

![image.png](/images/jueJin/af1654bce4324e2.png)

更新数据
----

现在的数据是死的，那我们如何改变呢？

```js
// src/index.html
<body>
<div id="root"></div>
<button id="btn1">改变name</button>
<button id="btn2">改变age</button>
</body>

// src/index.js
const root = document.querySelector('#root')
    var vue = new Vue({
        data() {
            return {
            name: '林三心',
            age: 18
        }
        },
            render() {
            root.innerHTML = `${this.name}今年${this.age}岁了`
        }
        })
        
            document.getElementById('btn1').onclick = () => {
            vue.name = 'sunshine_Lin'
        }
            document.getElementById('btn2').onclick = () => {
            vue.age = 20
        }
```

由本章之前内容代码可知，当data里的变量被改变时，会触发`Object.defineProperty`的`set`属性，直接改变数据层的的数据，但是问题来了，数据是修改了，那视图该怎么更新呢？这时候`dep`就排上用场了，dep会触发`notify`方法，通知`渲染Watcher`去更新视图（此时dep里只有一个`Watcher`，后续会更多），效果如图：

![845bd71610cbe1c567506c62e64b2245 (1).gif](/images/jueJin/cf8bcf86b9a0447.png)

实现computed
----------

### 1.代码实现

修改一下代码：

```js
// src/index.js
const root = document.querySelector('#root')
    var vue = new Vue({
        data() {
            return {
            name: '林三心',
            age: 18
        }
        },
        computed: { // 新增
            info() {
            return this.name + this.age
        }
        
        },
            render() {
            root.innerHTML = `${this.name}今年${this.age}岁了-----${this.info}` // 新增info
        }
        })
``````js
// src/init.js

import initState from './initState.js'
import initComputed from './initComputed.js'

    Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
        if (options.data) {
        // 初始化数据
        initState(vm)
    }
    if (options.computed) { // 新增
    // 初始化computed
    initComputed(vm)
}
}
```

我们需要在这个`initComputed`方法里实现`computed`的逻辑

```js
// src/initComputed.js

import { Dep } from "./Dep"
import Watcher from "./Watcher"

    export default function initComputed(vm) {
    const computed = vm.$options.computed // 拿到computed配置
    const watchers = vm._computedWatchers = Object.create(null) // 给当前的vm挂载_computedWatchers属性，后面会用到
    // 循环computed每个属性
        for (const key in computed) {
    const userDef = computed[key]
    // 判断是函数还是对象
    const getter = typeof userDef === 'function' ? userDef : userDef.get
// 给每一个computed创建一个computed watcher 注意{ lazy: true }
// 然后挂载到vm._computedWatchers对象上
watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    if (!(key in vm)) {
    defineComputed(vm, key, userDef)
}
}
}

```

大家都知道`computed`是有缓存的，所以创建`watcher`的时候，会传一个配置{ lazy: true }，同时也可以区分这是`computed watcher`，然后到`watcher`里面接收到这个对象

```js
// src/Watcher.js


    class Watcher {
        constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
            if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
            if (options) {
            this.lazy = !!options.lazy // 为computed 设计的
                } else {
                this.lazy = false
            }
            this.dirty = this.lazy
            this.cb = cb
            this.options = options
            this.id = wId++
        this.deps = []
        this.depsId = new Set()
        this.value = this.lazy ? undefined : this.get()
    }
    // 省略很多代码
}
```

从上面这句`this.value = this.lazy ? undefined : this.get()`代码可以看到，`computed`创建`watcher`的时候是不会指向`this.get`的。只有在`render`函数里面有才执行。 现在在`render`函数通过`this.info`还不能读取到值，因为我们还没有挂载到vm上面，上面`defineComputed(vm, key, userDef)`这个函数功能就是让`computed`挂载到vm上面。下面我们实现一下。

```js
// src/initComputed.js


    function defineComputed(vm, key, userDef) {
    let getter = null
    // 判断是函数还是对象
        if (typeof userDef === 'function') {
        getter = createComputedGetter(key)
            } else {
            getter = userDef.get
        }
            Object.defineProperty(vm, key, {
            enumerable: true,
            configurable: true,
            get: getter,
            set: function() {} // 又偷懒，先不考虑set情况哈，自己去看源码实现一番也是可以的
            })
        }
        // 创建computed函数
            function createComputedGetter(key) {
                return function computedGetter() {
            const watcher = this._computedWatchers[key]
                if (watcher) {
                if (watcher.dirty) {// 给computed的属性添加订阅watchers
                watcher.evaluate()
            }
            // 把渲染watcher 添加到属性的订阅里面去，这很关键
                if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}
```

由上面代码看出，`watcher`多了`evaluate`和`depend`两个方法，让我们去实现一下吧，以下是此时`Watcher`的完整代码：

```js

import { pushTarget, popTarget } from './Dep'

    class Watcher {
        constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
            if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
            if (options) {
            this.lazy = !!options.lazy // 为computed 设计的
                } else {
                this.lazy = false
            }
            this.dirty = this.lazy
            this.cb = cb
            this.options = options
            this.id = wId++
        this.deps = []
        this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
        this.value = this.lazy ? undefined : this.get()
    }
        get() {
        const vm = this.vm
        pushTarget(this)
        // 执行函数
        let value = this.getter.call(vm, vm)
        popTarget()
        return value
    }
        addDep(dep) {
        let id = dep.id
            if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this);
        }
    }
        update(){
            if (this.lazy) {
            this.dirty = true
                } else {
                this.get()
            }
        }
        // 执行get，并且 this.dirty = false
            evaluate() {
            this.value = this.get()
            this.dirty = false
        }
        // 所有的属性收集当前的watcer
            depend() {
            let i = this.deps.length
                while(i--) {
                this.deps[i].depend()
            }
        }
    }
```

### 2.流程讲解

*   1.首次渲染会执行`render`函数，`render`函数里会读取`info`变量，这个会触发`createComputedGetter(key)`中的`computedGetter(key)`；
*   2.然后会判断`dirty`这个变量，看是否需要重新计算，如需重新计算则执行`watcher.evaluate`
*   3.在`watcher.evaluate`方法中，执行了`this.get`方法，这时候会执行`pushTarget(this)`把当前的`computed watcher` push到`stack`里面去，并且把`Dep.target` 设置成当前的`computed watcher`
*   4.运行`this.getter.call(vm, vm)`，也就是运行了`info() {return this.name + this.age}`这个函数
*   5.执行`info函数`后，函数里会读取`name`和`age`两个变量，那么就会触发两次`Object.defineProperty.get`的方法，那么`name`和`age`两者的dep都会把此`computed Watcher`收集起来
*   6.依赖收集完毕之后执行`popTarget()`，把当前的`computed watcher`从栈清除，返回计算后的值('林三心' + '18')，并且`this.dirty = false`
*   7.`watcher.evaluate()`执行完毕之后，就会判断`Dep.target` 是不是`true`，如果有就代表还有渲染`watcher`，就执行`watcher.depend()`，然后让`watcher`里面的`deps`都收集渲染`watcher`，这就是双向保存的优势。
*   8.此时`name`和`age`都收集了`computed watcher` 和 `渲染watcher`。那么设置`name`的时候都会去更新执行watcher.update()，`age`也同理
*   9.如果是`computed watcher`的话不会重新执行一遍只会把`this.dirty` 设置成 `true`，如果数据变化的时候再执行`watcher.evaluate()`进行`info`更新，没有变化的的话`this.dirty` 就是`false`，不会执行info方法。这就是`computed缓存机制`。 看看此时的效果：

![38980e0ca8c5f6ee438aa4981c01ac21.gif](/images/jueJin/50550f000c2d477.png)

watch的实现
--------

修改一下代码：

```js
// src/index.js

const root = document.querySelector('#root')
    var vue = new Vue({
        data() {
            return {
            name: '林三心',
            age: 18
        }
        },
            computed: {
                info() {
                return this.name + this.age
            }
            
            },
                watch: {
                    name(oldValue, newValue) {
                    console.log('触发watch', oldValue, newValue)
                    },
                        age(oldValue, newValue) {
                        console.log('触发watch', oldValue, newValue)
                    }
                    },
                        render() {
                        root.innerHTML = `${this.name}今年${this.age}岁了-----${this.info}`
                    }
                    })
``````js
// src/init.js

    Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
        if (options.data) {
        // 初始化数据
        initState(vm)
    }
        if (options.computed) {
        // 初始化computed
        initComputed(vm)
    }
        if (options.watch) {
        // 初始化watch
        initWatch(vm)
    }
}
```

实现一下`initWatch`:

```js
// src/initWatch.js

import Watcher from './Watcher'

    export default function initWatch (vm) {
    const watch = vm.$options.watch
        for(let key in watch) {
    const handler = watch[key]
    new Watcher(vm, key, handler, {user: true})
}
}
```

修改一下`Watcher.js`的代码

```js
// src/Watcher.js

let wId = 0
    class Watcher {
        constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
            if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
                } else {
                this.getter = parsePath(exprOrFn) // user watcher
            }
                if (options) {
                this.lazy = !!options.lazy // 为computed 设计的
                this.user = !!options.user // 为user wather设计的
                    } else {
                    this.user = this.lazy = false
                }
                this.dirty = this.lazy
                this.cb = cb
                this.options = options
                this.id = wId++
            this.deps = []
            this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
            this.value = this.lazy ? undefined : this.get()
        }
            get() {
            const vm = this.vm
            pushTarget(this)
            // 执行函数
            let value = this.getter.call(vm, vm)
            popTarget()
            return value
        }
            addDep(dep) {
            let id = dep.id
                if (!this.depsId.has(id)) {
                this.depsId.add(id)
                this.deps.push(dep)
                dep.addSub(this);
            }
        }
            update(){
                if (this.lazy) {
                this.dirty = true
                    } else {
                    this.run()
                }
            }
            // 执行get，并且 this.dirty = false
                evaluate() {
                this.value = this.get()
                this.dirty = false
            }
            // 所有的属性收集当前的watcer
                depend() {
                let i = this.deps.length
                    while(i--) {
                    this.deps[i].depend()
                }
            }
                run () {
                const value = this.get()
                const oldValue = this.value
                this.value = value
                // 执行cb
                    if (this.user) {
                        try{
                        this.cb.call(this.vm, value, oldValue)
                            } catch(error) {
                            console.error(error)
                        }
                            } else {
                            this.cb && this.cb.call(this.vm, oldValue, value)
                        }
                    }
                }
                    function parsePath (path) {
                    const segments = path.split('.')
                        return function (obj) {
                            for (let i = 0; i < segments.length; i++) {
                            if (!obj) return
                        obj = obj[segments[i]]
                    }
                    return obj
                }
            }
```

最后来看看效果：

![6ff71566df6adac8414a885725a61f8c.gif](/images/jueJin/9003b334c6fe4cf.png)

### 结语

加油，各位！！！点赞，点起来