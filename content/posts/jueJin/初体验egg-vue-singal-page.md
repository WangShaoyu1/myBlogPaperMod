---
author: "叶知秋水"
title: "初体验egg-vue-singal-page"
date: 2018-03-27
description: "egg在koa框架的基础上进行了封装，并集合了现今热门的vue、react框架，支持服务端渲染，可以说是全端开发的一个优秀实践。关于demo和api，可以在官网自行查看。这里只对本人觉得比较有意思的一些点进行总结。egg为了统一前后端代码的构建，对webpack进行了进一步的…"
tags: ["Vue.js","前端","React.js","服务器"]
ShowReadingTime: "阅读2分钟"
weight: 61
---
egg在koa框架的基础上进行了封装，并集合了现今热门的vue、react框架，支持服务端渲染，可以说是全端开发的一个优秀实践。关于demo和api，可以在[官网](https://link.juejin.cn?target=https%3A%2F%2Feggjs.org%2F "https://eggjs.org/")自行查看。这里只对本人觉得比较有意思的一些点进行总结。

### 打包、构建

egg为了统一前后端代码的构建，对webpack进行了进一步的封装，称之为[easywebpack](https://link.juejin.cn?target=http%3A%2F%2Fhubcarl.github.io%2Feasywebpack%2Fwebpack%2F "http://hubcarl.github.io/easywebpack/webpack/")，内置了一些常用的loader、plugin，简化了站点的基础配置。

 代码解读

复制代码

`module.exports = {     egg: true,     framework: 'vue',     entry: {         include: ['app/web/page'],         exclude: ['app/web/page/[a-z]+/component'],         loader: {             client: 'app/web/framework/vue/entry/client-loader.js',             server: 'app/web/framework/vue/entry/server-loader.js',         }     },     alias: {     },     dll: [],     loaders: {},     plugins: {         serviceworker: true     },     done() {     } };`

其中framework对应其内置的几个打包方案，entry为构建的入口，entry.loader是入口的加载模板，在这里是指'app/web/page'下面所有的vue文件都会使用这个loader进行加载，如果是服务端渲染则使用server-loader，反之为client-loader，这两者有一个关联的纽带store，下面再介绍。在服务端渲染，通常需要数据在渲染的时候就要准备好，这时候可以给vue的视图一个自定义的特殊方法preFetch（你喜欢就好）通过promise来确保数据返回再渲染视图。

vue视图可能在前端渲染，也可能再后端渲染，这里可以说是Vue初始化起点。因此也可以在这里加载一些公共的filter、directive、component等。

### store状态统一

一套代码，支持前后端渲染，区别在于view的渲染交给服务端还是客户端，对于数据最好始终保持一致。那在服务端初始了store里面的一个list之后，如何保证在客户端也能获取到这个list的数据？ 这里主要运用了vuex的这个方法

 代码解读

复制代码

`//替换 store 的根状态，仅用状态合并或时光旅行调试。 replaceState(state: Object)`

egg在服务端渲染后转成html时，会把当前的store.$state对象转成json，插一段script标签到html里，把服务端的state发送到客户端，保存在一个window下的全局变量里，在客户端运行时再把它的值初始化到客户端的store里

 代码解读

复制代码

`if (options.store) {     options.store.replaceState(Object.assign({}, window.__INITIAL_STATE__, options.store.state)); } else if (window.__INITIAL_STATE__) {     options.data = Object.assign(window.__INITIAL_STATE__, options.data && options.data()); }`

### easywebpack内置变量

easywebpack内置了一些全局变量，可以让你在编译的过程中做一些定制需求 http://hubcarl.github.io/easywebpack/webpack/env/

### 灵活的后端服务开发

egg内置了controller、service、router模块，而且都可以拓展基类，活生生的java风格，controller里可以通过ctx变量访问当前的req、rep、config等。定时任务、服务拓展、还有各种配置，基本上满足了服务层的接口开发，再加上无缝的前后端同步渲染，可以说把体验和技术都完美地结合了。

* * *

只是粗浅地介绍了egg的demo体验，有不对的地方还望指正。