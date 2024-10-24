---
author: "Sunshine_Lin"
title: "7张图，从零实现一个简易版Vue-Router，太通俗易懂了！"
date: 2021-09-27
description: "前言 大家好，我是林三心，用最通俗易懂的话，讲最难的知识点，相信大家在Vue项目中肯定都用过Vue-router，也就是路由。所以本文章我就不过多讲解vue-router的基本讲解了，我也不给你们讲解"
tags: ["前端","JavaScript","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:323,comments:0,collects:380,views:16321,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话，讲最难的知识点**，相信大家在Vue项目中肯定都用过`Vue-router`，也就是路由。所以本文章我就不过多讲解`vue-router`的基本讲解了，我也不给你们讲解`vue-router`的源码，我就带大家**从零开始，实现一个vue-router**吧！！！

路由基本使用方法
--------

平时咱们vue-router其实都用很多了，基本每个项目都会用它，因为Vue是单页面应用，可以通过路由来实现切换组件，达到切换页面的效果。咱们平时都是这么用的，其实分为3步

*   1、引入`vue-router`，并使用`Vue.use(VueRouter)`
*   2、定义路由数组，并将数组传入`VueRouter实例`，并将实例暴露出去
*   3、将`VueRouter`实例引入到main.js，并注册到根Vue实例上

```js
// src/router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home.vue'
import hello from '../components/hello.vue'
import homeChild1 from '../components/home-child1.vue'
import homeChild2 from '../components/home-child2.vue'

Vue.use(VueRouter) // 第一步

    const routes = [
        {
        path: '/home',
        component: home,
            children: [
                {
                path: 'child1',
                component: homeChild1
                },
                    {
                    path: 'child2',
                    component: homeChild2
                }
            ]
            },
                {
                path: '/hello',
                component: hello,
                    children: [
                        {
                        path: 'child1',
                        component: helloChild1
                        },
                            {
                            path: 'child2',
                            component: helloChild2
                        }
                    ]
                    },
                ]
                
                    export default new VueRouter({
                    routes // 第二步
                    })
                    
                    // src/main.js
                    import router from './router'
                    
                        new Vue({
                        router,  // 第三步
                        render: h => h(App)
                        }).$mount('#app')
                        
```

`router-view和router-link`的分布

```js
// src/App.vue

<template>
<div id="app">
<router-link to="/home">home的link</router-link>
<span style="margin: 0 10px">|</span>
<router-link to="/hello">hello的link</router-link>
<router-view></router-view>
</div>
</template>

// src/components/home.vue

<template>
<div style="background: green">
<div>home的内容哦嘿嘿</div>
<router-link to="/home/child1">home儿子1</router-link>
<span style="margin: 0 10px">|</span>
<router-link to="/home/child2">home儿子2</router-link>
<router-view></router-view>
</div>
</template>

// src/components/hello.vue

<template>
<div style="background: orange">
<div>hello的内容哦嘿嘿</div>
<router-link to="/hello/child1">hello儿子1</router-link>
<span style="margin: 0 10px">|</span>
<router-link to="/hello/child2">hello儿子2</router-link>
<router-view></router-view>
</div>
</template>

// src/components/home-child1.vue 另外三个子组件大同小异，区别在于文本以及背景颜色不一样,就不写出来了
<template>
<div style="background: yellow">我是home的1儿子home-child1</div>
</template>
```

经过上面这3步，咱们能实现什么效果呢？

*   1、在网址处输入对应path，就会展示对应组件
*   2、可以在任何用到的组件里访问到`$router和$router`，并使用其身上的方法或属性
*   3、可以使用`route-link`组件进行路径跳转
*   4、可以使用`router-view`组件进行路由对应内容展示

![截屏2021-09-25 下午3.46.32.png](/images/jueJin/dd92ab7907f1488.png)

以下是达到的效果动图

![router2.gif](/images/jueJin/361e1a021c1e42b.png)

开搞！！！
-----

### VueRouter类

在src文件夹中，创建一个`my-router.js`

VueRouter类的options参数，其实就是`new VueRouter(options)`时传入的这个参数对象，而`install`是一个方法，并且必须使`VueRouter类`拥有这个方法，为什么呢？咱们下面会讲的。

```js
// src/my-router.js

    class VueRouter {
constructor(options) {}
init(app) {}
}

VueRouter.install = (Vue) => {}

export default VueRouter
```

### install方法

为什么必须定义一个`install`方法，并且把他赋予`VueRouter`呢？其实这跟`Vue.use`方法有关，大家还记得Vue是怎么使用VueRouter的吗？

```js
import VueRouter from 'vue-router'

Vue.use(VueRouter) // 第一步

export default new VueRouter({ // 传入的options
routes // 第二步
})

import router from './router'

    new Vue({
    router,  // 第三步
    render: h => h(App)
    }).$mount('#app')
```

其实第二步和第三步很清楚，就是实例一个VueRouter对象，并且将这个VueRouter对象挂到根组件App上，那问题来了，第一步的Vue.use(VueRouter)是干什么用的呢？其实`Vue.use(XXX)`，就是执行`XXX`上的`install`方法，也就是**Vue.use(VueRouter) === VueRouter.install()**，但是到了这，咱们是知道了`install`会执行，但是还是不知道`install`执行了是干嘛的，有什么用？

咱们知道VueRouter对象是被挂到根组件App上了，所以App是能直接使用VueRouter对象上的方法的，但是，咱们知道，咱们肯定是想`每一个用到的组件`都能使用VueRouter的方法，比如`this.$router.push`，但是现在只有App能用这些方法，咋办呢？咋才能每个组件都能使用呢？这时`install`方法派上用场了，咱们先说说实现思路，再写代码哈。

![截屏2021-09-25 下午10.20.09.png](/images/jueJin/d0afc9fbc00948b.png)

知识点：`Vue.use(XXX)`时，会执行XXX的install方法，并将`Vue`当做`参数`传入`install`方法

```js
// src/my-router.js

let _Vue
    VueRouter.install = (Vue) => {
    _Vue = Vue
    // 使用Vue.mixin混入每一个组件
        Vue.mixin({
        // 在每一个组件的beforeCreate生命周期去执行
            beforeCreate() {
            if (this.$options.router) { // 如果是根组件
            // this 是 根组件本身
            this._routerRoot = this
            
            // this.$options.router就是挂在根组件上的VueRouter实例
            this.$router = this.$options.router
            
            // 执行VueRouter实例上的init方法，初始化
            this.$router.init(this)
                } else {
                // 非根组件，也要把父组件的_routerRoot保存到自身身上
                this._routerRoot = this.$parent && this.$parent._routerRoot
                // 子组件也要挂上$router
                this.$router = this._routerRoot.$router
            }
        }
        })
    }
```

### createRouteMap方法

这个方法是干嘛的呢？顾名思义，就是将传进来的`routes数组`转成一个`Map结构`的数据结构，key是path，value是对应的组件信息，至于为什么要转换呢？这个咱们下面会讲。咱们先实现转换。

![截屏2021-09-25 下午10.47.42.png](/images/jueJin/8629df56b078433.png)

```js
// src/my-router.js

    function createRouteMap(routes) {
    
const pathList = []
const pathMap = {}

// 对传进来的routes数组进行遍历处理
    routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap)
    })
    
    console.log(pathList)
// ["/home", "/home/child1", "/home/child2", "/hello", "/hello/child1"]
console.log(pathMap)
    // {
    //     /hello: {path: xxx, component: xxx, parent: xxx },
    //     /hello/child1: {path: xxx, component: xxx, parent: xxx },
    //     /hello/child2: {path: xxx, component: xxx, parent: xxx },
    //     /home: {path: xxx, component: xxx, parent: xxx },
//     /home/child1: {path: xxx, component: xxx, parent: xxx }
// }


// 将pathList与pathMap返回
    return {
    pathList,
    pathMap
}
}

    function addRouteRecord(route, pathList, pathMap, parent) {
    const path = parent ? `${parent.path}/${route.path}` : route.path
    const { component, children = null } = route
        const record = {
        path,
        component,
        parent
    }
        if (!pathMap[path]) {
        pathList.push(path)
        pathMap[path] = record
    }
        if (children) {
        // 如果有children，则递归执行addRouteRecord
        children.forEach(child => addRouteRecord(child, pathList, pathMap, record))
    }
}

export default createRouteMap
```

### 路由模式

路由有三种模式

*   1、`hash模式`，最常用的模式
*   2、`history模式`，需要后端配合的模式
*   3、`abstract模式`，非浏览器环境的模式

而且模式怎么设置呢？是这么设置的，通过options的`mode`字段传进去

```js
    export default new VueRouter({
    mode: 'hash' // 设置模式
    routes
    })
```

而如果不传的话，默认是`hash模式`，也是我们平时开发中用的最多的模式，所以本章节就只实现`hash模式`

```js
// src/my-router.js

import HashHistory from "./hashHistory"

    class VueRouter {
        constructor(options) {
        
        this.options = options
        
        // 如果不传mode，默认为hash
        this.mode = options.mode || 'hash'
        
        // 判断模式是哪种
            switch (this.mode) {
            case 'hash':
            this.history = new HashHistory(this)
            break
            case 'history':
            // this.history = new HTML5History(this, options.base)
            break
            case 'abstract':
            
        }
    }
init(app) { }
}
```

### HashHistory

在src文件夹下创建`hashHistory.js`

其实hash模式的原理就是，监听浏览器url中hash值的变化，并切换对应的组件

```js
    class HashHistory {
        constructor(router) {
        
        // 将传进来的VueRouter实例保存
        this.router = router
        
        // 如果url没有 # ，自动填充 /#/
        ensureSlash()
        
        // 监听hash变化
        this.setupHashLister()
    }
    // 监听hash的变化
        setupHashLister() {
            window.addEventListener('hashchange', () => {
            // 传入当前url的hash，并触发跳转
            this.transitionTo(window.location.hash.slice(1))
            })
        }
        
        // 跳转路由时触发的函数
            transitionTo(location) {
            console.log(location) // 每次hash变化都会触发，可以自己在浏览器修改试试
            // 比如 http://localhost:8080/#/home/child1 最新hash就是 /home/child1
        }
    }
    
    // 如果浏览器url上没有#，则自动补充/#/
        function ensureSlash() {
            if (window.location.hash) {
            return
        }
        window.location.hash = '/'
    }
    
    // 这个先不讲，后面会用到
        function createRoute(record, location) {
    const res = []
        if (record) {
            while (record) {
            res.unshift(record)
            record = record.parent
        }
    }
        return {
        ...location,
        matched: res
    }
}
export default HashHistory
```

### createMmatcher方法

上面讲了，每次hash修改，都能获取到最新的hash值，但是这不是咱们的最终目的，咱们最终目的是根据hash变化渲染不同的组件页面，那怎么办呢？

还记得之前`createRouteMap`方法吗？咱们将`routes数组`转成了`Map`数据结构，有了那个Map，咱们就可以根据hash值去获取对应的组件并进行渲染

![截屏2021-09-26 下午9.26.44.png](/images/jueJin/938e049341e8426.png)

但是这样真的可以吗？其实是不行的，如果按照上面的方法，当hash为`/home/child1`时，只会渲染`home-child1.vue`这一个组件，但这样肯定是不行的，当hash为`/home/child1`时，肯定是渲染`home.vue`和`home-child1.vue`这两个组件

![截屏2021-09-26 下午9.30.57.png](/images/jueJin/7d694db4799f4dc.png)

所以咱们得写一个方法，来查找hash对应哪些组件，这个方法就是`createMmatcher`

```js
// src/my-router.js

    class VueRouter {
    
    // ....原先代码
    
    // 根据hash变化获取对应的所有组件
        createMathcer(location) {
        
        // 获取 pathMap
        const { pathMap } = createRouteMap(this.options.routes)
        
    const record = pathMap[location]
        const local = {
        path: location
    }
        if (record) {
        return createRoute(record, local)
    }
    return createRoute(null, local)
}
}

// ...原先代码

    function createRoute(record, location) {
const res = []
    if (record) {
        while (record) {
        res.unshift(record)
        record = record.parent
    }
}
    return {
    ...location,
    matched: res
}
}
``````js
// src/hashHistory.js

    class HashHistory {
    
    // ...原先代码
    
    // 跳转路由时触发的函数
        transitionTo(location) {
        console.log(location)
        
        // 找出所有对应组件，router是VueRouter实例，createMathcer在其身上
        let route = this.router.createMathcer(location)
        
        console.log(route)
    }
}
```

![截屏2021-09-26 下午9.51.01.png](/images/jueJin/8ca738d16f894c3.png)

这只是保证了`hash变化`的时候能找出对应的所有组件来，但是有一点我们忽略了，那就是我们如果手动刷新页面的话，是不会触发`hashchange`事件的，也就是找不出组件来，那咋办呢？刷新页面肯定会使路由重新初始化，咱们只需要在`初始化函数init`上一开始执行一次原地跳转就行。

```js
// src/my-router.js

    class VueRouter {
    
    // ...原先代码
    
        init(app) {
        // 初始化时执行一次，保证刷新能渲染
        this.history.transitionTo(window.location.hash.slice(1))
    }
    
    // ...原先代码
}
```

### 响应式的hash改变

上面咱们实现了根据`hash值`找出所有需要渲染的组件，但最后的渲染环节却还没实现，不过不急，实现渲染之前，咱们先把一件事给完成了，那就是要让`hash值改变`这件事变成一件`响应式的事`，为什么呢？咱们刚刚每次hash变化是能拿到最新的`组件合集`，但是没用啊，Vue的组件重新渲染只能通过某个数据的响应式变化来触发。所以咱们得搞个变量来保存这个`组件合集`，并且这个变量需要是响应式的才行，这个变量就是`$route`，注意要跟`$router`区别开来哦！！！但是这个`$route`需要用两个中介变量来获取，分别是`current和_route`

> 这里可能会有点绕，还望大家有点耐心。我已经把复杂的代码最简单化展示了。

```js
// src/hashHistory.js

    class HashHistory {
        constructor(router) {
        
        // ...原先代码
        
        // 一开始给current赋值初始值
            this.current = createRoute(null, {
            path: '/'
            })
            
        }
        
        // ...原先代码
        
        // 跳转路由时触发的函数
            transitionTo(location) {
            // ...原先代码
            
            // hash更新时给current赋真实值
            this.current = route
        }
        // 监听回调
            listen(cb) {
            this.cb = cb
        }
    }
``````js
// src/my-router.js

    class VueRouter {
    
    // ...原先代码
    
        init(app) {
        // 把回调传进去，确保每次current更改都能顺便更改_route触发响应式
        this.history.listen((route) => app._route = route)
        
        // 初始化时执行一次，保证刷新能渲染
        this.history.transitionTo(window.location.hash.slice(1))
    }
    
    // ...原先代码
}

    VueRouter.install = (Vue) => {
    _Vue = Vue
    // 使用Vue.mixin混入每一个组件
        Vue.mixin({
        // 在每一个组件的beforeCreate生命周期去执行
            beforeCreate() {
            if (this.$options.router) { // 如果是根组件
            
            // ...原先代码
            
            // 相当于存在_routerRoot上，并且调用Vue的defineReactive方法进行响应式处理
            Vue.util.defineReactive(this, '_route', this.$router.history.current)
                } else {
                // ...原先代码
            }
            
            
        }
        })
        
        // 访问$route相当于访问_route
            Object.defineProperty(Vue.prototype, '$route', {
                get() {
                return this._routerRoot._route
            }
            })
        }
```

### router-view组件渲染

其实组件渲染关键在于`<router-view>`组件，咱们可以自己实现一个`<my-view>`

在`src`下创建`view.js`，老规矩，先说说思路，再实现代码

![截屏2021-09-26 下午11.07.10.png](/images/jueJin/208c17b9ca934d5.png)

```js
// src/view.js

    const myView = {
    functional: true,
        render(h, { parent, data }) {
        const { matched } = parent.$route
        
        data.routerView = true // 标识此组件为router-view
        let depth = 0 // 深度索引
        
            while(parent) {
            // 如果有父组件且父组件为router-view 说明索引需要加1
                if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
    const record = matched[depth]
    
        if (!record) {
        return h()
    }
    
    const component = record.component
    
    // 使用render的h函数进行渲染组件
    return h(component, data)
    
}
}
export default myView
```

### router-link跳转

其实他的本质就是个a标签而已

在`src`下创建`link.js`

```js
    const myLink = {
        props: {
            to: {
            type: String,
            required: true,
            },
            },
            // 渲染
                render(h) {
                
                // 使用render的h函数渲染
                return h(
                // 标签名
                'a',
                // 标签属性
                    {
                        domProps: {
                        href: '#' + this.to,
                        },
                        },
                        // 插槽内容
                    [this.$slots.default]
                    )
                    },
                }
                
                export default myLink
```

### 最终效果

最后把router/index.js里的引入改一下

```js
import VueRouter from '../Router-source/index2'
```

然后把所有`router-view和router-link`全都替换成`my-view和my-link`

效果

![router2.gif](/images/jueJin/d2b2ea1b044546c.png)

结语
--

如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者可以加入我的摸鱼群 想进学习群，摸鱼群，请点击这里[摸鱼](https://juejin.cn/pin/6969565162885873701 "https://juejin.cn/pin/6969565162885873701")，我会定时直播模拟面试，答疑解惑

![image.png](/images/jueJin/53480cd479cc4a3.png)

完整代码
----

**/src/my-router.js**

```js
import HashHistory from "./hashHistory"
    class VueRouter {
        constructor(options) {
        
        this.options = options
        
        // 如果不传mode，默认为hash
        this.mode = options.mode || 'hash'
        
        // 判断模式是哪种
            switch (this.mode) {
            case 'hash':
            this.history = new HashHistory(this)
            break
            case 'history':
            // this.history = new HTML5History(this, options.base)
            break
            case 'abstract':
            
        }
    }
        init(app) {
        this.history.listen((route) => app._route = route)
        
        // 初始化时执行一次，保证刷新能渲染
        this.history.transitionTo(window.location.hash.slice(1))
    }
    
    // 根据hash变化获取对应的所有组件
        createMathcer(location) {
        const { pathMap } = createRouteMap(this.options.routes)
        
    const record = pathMap[location]
        const local = {
        path: location
    }
        if (record) {
        return createRoute(record, local)
    }
    return createRoute(null, local)
}
}

let _Vue
    VueRouter.install = (Vue) => {
    _Vue = Vue
    // 使用Vue.mixin混入每一个组件
        Vue.mixin({
        // 在每一个组件的beforeCreate生命周期去执行
            beforeCreate() {
            if (this.$options.router) { // 如果是根组件
            // this 是 根组件本身
            this._routerRoot = this
            
            // this.$options.router就是挂在根组件上的VueRouter实例
            this.$router = this.$options.router
            
            // 执行VueRouter实例上的init方法，初始化
            this.$router.init(this)
            
            // 相当于存在_routerRoot上，并且调用Vue的defineReactive方法进行响应式处理
            Vue.util.defineReactive(this, '_route', this.$router.history.current)
                } else {
                // 非根组件，也要把父组件的_routerRoot保存到自身身上
                this._routerRoot = this.$parent && this.$parent._routerRoot
                // 子组件也要挂上$router
                this.$router = this._routerRoot.$router
            }
        }
        })
            Object.defineProperty(Vue.prototype, '$route', {
                get() {
                return this._routerRoot._route
            }
            })
        }
        
            function createRouteMap(routes) {
            
        const pathList = []
    const pathMap = {}
    
    // 对传进来的routes数组进行遍历处理
        routes.forEach(route => {
        addRouteRecord(route, pathList, pathMap)
        })
        
        console.log(pathList)
    // ["/home", "/home/child1", "/home/child2", "/hello", "/hello/child1"]
    console.log(pathMap)
        // {
        //     /hello: {path: xxx, component: xxx, parent: xxx },
        //     /hello/child1: {path: xxx, component: xxx, parent: xxx },
        //     /hello/child2: {path: xxx, component: xxx, parent: xxx },
        //     /home: {path: xxx, component: xxx, parent: xxx },
    //     /home/child1: {path: xxx, component: xxx, parent: xxx }
// }


// 将pathList与pathMap返回
    return {
    pathList,
    pathMap
}
}

    function addRouteRecord(route, pathList, pathMap, parent) {
    // 拼接path
    const path = parent ? `${parent.path}/${route.path}` : route.path
    const { component, children = null } = route
        const record = {
        path,
        component,
        parent
    }
        if (!pathMap[path]) {
        pathList.push(path)
        pathMap[path] = record
    }
        if (children) {
        // 如果有children，则递归执行addRouteRecord
        children.forEach(child => addRouteRecord(child, pathList, pathMap, record))
    }
}

    function createRoute(record, location) {
const res = []
    if (record) {
        while (record) {
        res.unshift(record)
        record = record.parent
    }
}
    return {
    ...location,
    matched: res
}
}
export default VueRouter
```

**src/hashHistory.js**

```js
    class HashHistory {
        constructor(router) {
        
        // 将传进来的VueRouter实例保存
        this.router = router
        
        // 一开始给current赋值初始值
            this.current = createRoute(null, {
            path: '/'
            })
            
            // 如果url没有 # ，自动填充 /#/
            ensureSlash()
            
            // 监听hash变化
            this.setupHashLister()
        }
        // 监听hash的变化
            setupHashLister() {
                window.addEventListener('hashchange', () => {
                // 传入当前url的hash
                this.transitionTo(window.location.hash.slice(1))
                })
            }
            
            // 跳转路由时触发的函数
                transitionTo(location) {
                console.log(location)
                
                // 找出所有对应组件
                let route = this.router.createMathcer(location)
                
                console.log(route)
                
                // hash更新时给current赋真实值
                this.current = route
                // 同时更新_route
                this.cb && this.cb(route)
            }
            // 监听回调
                listen(cb) {
                this.cb = cb
            }
        }
        
        // 如果浏览器url上没有#，则自动补充/#/
            function ensureSlash() {
                if (window.location.hash) {
                return
            }
            window.location.hash = '/'
        }
        
            export function createRoute(record, location) {
        const res = []
            if (record) {
                while (record) {
                res.unshift(record)
                record = record.parent
            }
        }
            return {
            ...location,
            matched: res
        }
    }
    
    export default HashHistory
```

**src/view.js**

```js
    const myView = {
    functional: true,
        render(h, { parent, data }) {
        const { matched } = parent.$route
        
        data.routerView = true // 标识此组件为router-view
        let depth = 0 // 深度索引
        
            while(parent) {
            // 如果有父组件且父组件为router-view 说明索引需要加1
                if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
    const record = matched[depth]
    
        if (!record) {
        return h()
    }
    
    const component = record.component
    
    // 使用render的h函数进行渲染组件
    return h(component, data)
    
}
}
export default myView
```

**src/link.js**

```js
    const myLink = {
        props: {
            to: {
            type: String,
            required: true,
            },
            },
            // 渲染
                render(h) {
                
                // 使用render的h函数渲染
                return h(
                // 标签名
                'a',
                // 标签属性
                    {
                        domProps: {
                        href: '#' + this.to,
                        },
                        },
                        // 插槽内容
                    [this.$slots.default]
                    )
                    },
                }
                
                export default myLink
                
```