---
author: "刘小灰"
title: "基于vue-router思考🕓实现一个简易版vue-router"
date: 2021-01-18
description: "后来随着做了一个又一个SPA项目,逐渐打消了这种顾虑。下面我们就来研究下单页面的灵魂，路由是怎么个实现逻辑吧。注意看下面的url,会从127.0.0.1/aa.html变成127.0.0.1/a,且页面并未刷新。这也为用来实现前端路由创造了可能。下面我们以vue-route…"
tags: ["vue-router"]
ShowReadingTime: "阅读3分钟"
weight: 718
---
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e533731995e84653b3ef95cc4910a374~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

前言
--

单页面的兴起离不开`前端路由`,记得在小白时期刚接触`SPA单页面应用`这种概念时,我一度怀疑这种技术靠不靠谱,心中充满着很多不解,比如:把所有东西都写在一个页面上难道没有性能问题?如果某个地方报错了那页面是不是就崩了?

后来随着做了一个又一个`SPA`项目,逐渐打消了这种顾虑。下面我们就来研究下单页面的灵魂，`路由`是怎么个实现逻辑吧。

url中#(hash)的含义
--------------

拿 [vue-router](https://link.juejin.cn?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2F "https://router.vuejs.org/zh/")举例,`vue-rouer`有两种工作模式分别是`hash`和`history`,我们先来了解下`#`hash

### 锚点

看到`#`最容易联想到的就是 **锚点** 了 , 就像看 **掘金** 文章一样,可以利用锚点实现点击跳转

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f9841034ea048b5b0a6fd2327583843~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这应该是`#`(hash)最本质的用法了

### 改变`#`不触发网页重载

`#` 还有一个重要特点就是改变`#`后面的内容后并不会导致页面刷新

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/491bc251d87f42c7bb57d31a31d31a59~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

也就是这个特性使得使用`#`实现前端路由成为可能,我们在这里先进行大胆的假设:**hash实现原理就是监听`#`后面内容的变化然后动态渲染出对应的组件**

History Api
-----------

从`hash`来看,我们可以浅浅的得出一个结论,要想实现前端路由,必须要满足 **页面`URL`变化时,页面不能刷新** 这一条件

我们在`History Api`中发现 [pushState](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FHistory%2FpushState "https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState") 似乎也满足这一条件

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24619ebb22284f9c9047a92e684450e8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

下面我们使用代码验证,代码也十分简单,设置一个定时器,一段时间后通过此api改变页面url,看页面是否刷新

html

 代码解读

复制代码

`<!DOCTYPE html> <html lang="en">   <head>     <meta charset="UTF-8" />     <meta name="viewport" content="width=device-width, initial-scale=1.0" />     <title>Document</title>   </head>   <body>     <script>       setTimeout(() => {         history.pushState(null, "", "/a");  // 核心代码       }, 3000);     </script>   </body> </html>`

注意看下面的url,会从`127.0.0.1/aa.html`变成`127.0.0.1/a`,且页面并未刷新。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b4b65ecfccf468694d30bd38e9c7152~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这也为用来实现前端路由创造了可能。下面我们以`vue-router`为例,来学习下`SPA的前端路由`到底是如何实现的。

vue-router工作流程
--------------

### vue插件

我们在使用`vue-router`时需要先`use`一下,可见`vue-router`本质上来说是 [vue插件](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fguide%2Fplugins.html "https://cn.vuejs.org/v2/guide/plugins.html")

js

 代码解读

复制代码

`import Vue from "vue"; import VueRouter from "vue-router"; import Home from "../views/Home.vue"; Vue.use(VueRouter); // 插件使用 const routes = [   {     path: "/",     name: "Home",     component: Home,   },   {     path: "/about",     name: "About",     component: () =>       import(/* webpackChunkName: "about" */ "../views/About.vue"),   }, ]; const router = new VueRouter({   routes, }); export default router;`

既然是插件，我们就先来弄清楚 `vue` 插件的运行机制，先来弄清楚一下几个问题。

*   `vue.use`都干了什么事?
    
    我们可以在`vue2.0`源码中找到答案
    
    js
    
     代码解读
    
    复制代码
    
    `export function initUse(Vue: GlobalAPI) { Vue.use = function (plugin: Function | Object) {   const installedPlugins =     this._installedPlugins || (this._installedPlugins = []);   if (installedPlugins.indexOf(plugin) > -1) {     return this;   }   const args = toArray(arguments, 1);   args.unshift(this); // 第一个参数设置为vue实例   // 核心代码   if (typeof plugin.install === "function") {     plugin.install.apply(plugin, args);   } else if (typeof plugin === "function") {     plugin.apply(null, args);   }   installedPlugins.push(plugin);   return this; }; }`    
    
    `vue.use()` 方法做的最主要的事就是调用插件的`install`方法，然后把`vue`实例传给插件，供插件使用。所以我们在开发插件时必须要暴露出一个`install`方法，供`vue`调用
    
*   为什么`vue-rouer`需要在`main.js`中挂载，而有的插件不需要
    
    我们在使用`vue-router`通常是这样
    
    js
    
     代码解读
    
    复制代码
    
    `//router/index.js import Vue from "vue"; import VueRouter from "vue-router"; Vue.use(VueRouter); // 用过use方法调用vue-router const routes = []; const router = new VueRouter({   routes, }); export default router;`
    
    然后在`main.js`中挂载
    
    js
    
     代码解读
    
    复制代码
    
    `import Vue from "vue"; import App from "./App.vue"; import router from "./router"; Vue.config.productionTip = false; new Vue({  router  // 挂载 }).$mount("#app");`
    

在初次使用`vue-router`时，就有一种疑惑，老子都通过`use`方法调用了，为什么在这里还要挂载？这显然多此一举

但我在`vue`官网看到关于`vue-router`插件介绍时，我感觉这件事并没有这么简单

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eb5d2d164144264a661ff722c37c791~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

再来看看 [vue-router](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-router "https://github.com/vuejs/vue-router") 源码时,发现 **通过全局混入来添加一些组件选项** 的意思就是通过混入的方式拿到`vue-rouer`的配置项

js

 代码解读

复制代码

`// vue-router  src/install.js   Vue.mixin({     beforeCreate () {     //判断是不是根组件       if (isDef(this.$options.router)) {         this._routerRoot = this         this._router = this.$options.router         this._router.init(this)         Vue.util.defineReactive(this, '_route', this._router.history.current) // 设置成响应式数据       } else {         this._routerRoot = (this.$parent && this.$parent._routerRoot) || this       }       registerInstance(this, this)     },     destroyed () {       registerInstance(this)     }   })`

那问题来了, 为什么用混入的方式去拿`vue-router`配置呢?其实也不难理解,我们在使用`vue.use(vueRouter)`的时候,这个时候vue还没有`new`出来,也就是说`vue.use(vueRouter)`要比`new vue()`先执行... 文字描述太难了,还是画图吧

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fdefd2a58254b788533c523c8808875~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 以上逻辑都顺理成章,且从源码中得知vue-router也是这样做的,但是有时候我还是认为在new vue中挂载router 是多余的,我们明明也可以通过参数传过去,例如:

js

 代码解读

复制代码

`import Vue from "vue"; import App from "./App.vue"; import router from "./router"; import VueRouter from "vue-router"; Vue.use(VurRouter,router) // 在main.js中调用use,把router当做第二个参数传过去`

那在vue-router中也可以拿到`vue-rotuer`配置项,如下所示:

js

 代码解读

复制代码

`class VueRouter{} VueRouter.install=(vue,option)=>{}`

那`vue-rotuer`为什么没有这样做呢?欢迎大家在留言讨论

### `vue-router` 运行机制

`vue-router`核心功能就是当`URL`改变时自动渲染对应组件

一图胜过千言万语，我们来总结下`vue-rouer`主工作流程图

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609db441af784d8e949ad88aaa7bee5a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这里可能会牵扯到一些细节,比如:

1.  `<router-view>`及`<router-link>`如何实现;
2.  组件是如何被渲染的;
3.  嵌套路由如何渲染

`<router-view>`及`<router-link>`其实就是在`vue-rotuer`注册的`Vue`全局组件,其中`<router-link>`比较简单,其实就是一个`a`便签,下面我们着重研究下`<router-view>`及嵌套路由如何渲染

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21653e6031284485a263721e73eaac88~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

需要注意的是组件渲染是 **重外到内**，先渲染父组件,如果发现父组件中存在`<router-view>`在去渲染对应的子组件,直到所有组件渲染完成。 渲染是通过`render`函数的`h`方法进行渲染，以下是`vue-rouer`关于`router-view`部分核心代码

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0020296b38f44599a10ecd925bcc2c7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

简易版`vue-rotuer`实现
-----------------

`vue-rotuer`源码虽然不长,但想要完全读懂也并不简单,我把核心代码抽离出来,实现了简易版的vue-router,效果如下所示:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30ba3952746e4e0b9374ae3ab3209bea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

主要实现功能有:

1.  实现根据路由渲染对应组件,并实现嵌套渲染
2.  实现`this.$rouer.push()`方法,其他方法可自由扩展

具体细节实现如下:

`router-link`实现

js

 代码解读

复制代码

``function isActive(location) {   return window.location.hash.slice(1) === location; } export default {   functional: true,   render(h, { props, slots }) {     const active = isActive(props.to) ? "my-vue-router-active" : "";     return h(       "a",       {         attrs: {           href: `#${props.to}`,           class: [`${active}`],         },       },       slots().default[0].text     );   }, };``

`router-view`实现

js

 代码解读

复制代码

`export default {   functional: true,   render(h, { parent, data }) {     let route = parent.$route;     let matched = route.matched;     data.routerView = true;     let deep = 0;     while (parent) {       if (parent.$vnode && parent.$vnode.data.routerView) {         deep++;       }       parent = parent.$parent;     }     let record = matched[deep];     if (!record) {       return h();     }     let component = record.component;     return h(component, data);   }, };`

源码地址: [simple-vue-router](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flyh0371%2Fsimple-vue-router "https://github.com/lyh0371/simple-vue-router")

> 个人项目:基于webpack自动生成路由打包多页面应用 [lyh-pages](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flyh0371%2Flyh-pages "https://github.com/lyh0371/lyh-pages"),欢迎大家 star 哦，万分感谢！

最后
--

如有帮助，欢迎点赞关注哦！😘