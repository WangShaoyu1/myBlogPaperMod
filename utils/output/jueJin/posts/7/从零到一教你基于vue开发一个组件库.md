---
author: "徐小夕"
title: "从零到一教你基于vue开发一个组件库"
date: 2020-03-09
description: "Vue是一套用于构建用户界面的渐进式框架,目前有越来越多的开发者在学习和使用在笔者写完 从0到1教你搭建前端团队的组件系统 之后很多朋友希望了解一下如何搭建基于vue的组件系统,所以作为这篇文章的补充,本文来总结一下如何搭建基于vue的组件库 一步步搭建一个组件库并发布到n…"
tags: ["Vue.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:335,comments:0,collects:580,views:23267,"
---
![](/images/jueJin/170bebb6f551f65.png)

前言
--

Vue是一套用于构建用户界面的渐进式框架,目前有越来越多的开发者在学习和使用.在笔者写完 [从0到1教你搭建前端团队的组件系统](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936") 之后很多朋友希望了解一下如何搭建基于vue的组件系统,所以作为这篇文章的补充,本文来总结一下如何搭建基于vue的组件库.

虽然笔者有近2年没有从事vue的开发了,但平时一直在关注vue的更新和发展, 笔者一直认为技术团队的组件化之路重点在于基础架构的搭建以及组件化的设计思想,我们完全可以采用不同的框架实现类似的设计,所以**透过现象看本质,思想才是最重要的**.本文主要教大家通过使用vue-cli3 一步步搭建一个组件库并发布到npm上,但笔者认为重点不在于实现搭建组件库的具体方式,而在于设计组件库的思想和取舍.

你将收获
----

*   使用vue-cli3搭建团队的组件库并发布到npm
*   npm发包的常用基础知识

相关资料
----

*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue项目实战经验汇总](https://juejin.cn/user/3808363978429613 "https://juejin.cn/user/3808363978429613")

正文
--

本文假设大家对vue有一定的了解,并熟悉vue-cli3的配置.首先我们在搭建组件库的时候,一定要清楚是否有必要搭建,如果项目是一次性的或者不同项目中不存在可复用的组件,那么搭建组件库是没有必要的,反之如果团队存在多个不同的项目都会使用一致的组件设计规范,那么搭建组件库无疑是不二选择.接下来我们直接开始实现组件库的搭建.

### 1.安装vue-cli3并创建一个项目

首先我们先安装开发必要的工具集,并创建一个项目:

```
yarn global add @vue/cli
// 创建项目
vue create vui
```

我们安装完依赖并进入项目启动服务后vue-cli3会自动给我们展示一个默认页面,关于vue的组件库目录结构,笔者参考element的来组织,大家也可以按照自己团队的风格来设计.首先我们看看原来的目录结构:

![](/images/jueJin/170bef95c27a9ae.png)

我们做如下调整:

![](/images/jueJin/170befc71912326.png)

我们将src重命名为examples, 并添加packages目录,用来存放我们的自定义组件. 但是cli默认会启动src下的服务,如果目录名变了,我们需要手动修改配置,vue-cli3中提供自定义打包配置项目的文件,我们只需要手动创建vue.config.js即可.我们具体修改如下:

```
    module.exports = {
        pages: {
            index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
        },
        // 扩展 webpack 配置，使 packages 加入编译
            chainWebpack: config => {
            config.module
            .rule('js')
            .include
            .add('/packages')
            .end()
            .use('babel')
            .loader('babel-loader')
        }
    }
```

首先修改入口文件地址为examples下的main.js,其次将packages加入打包编译任务中.

### 2.编写组件代码

首先我们拿一个Button组件来示范，这里只实现一个比较简单的组件，如果大家想了解更加详细的组件设计方法和思路，可以参考笔者的组件设计相关的文章。 首先我们先在packages目录下新建一个Button目录，然后src里存放组件的源代码：

```
<template>
<div class="x-button">
<slot></slot>
</div>
</template>

<script>
    export default {
    name: 'x-button',
        props: {
        type: String
    }
}
</script>

<style scoped>
    .x-button {
    display: inline-block;
    padding: 3px 6px;
    background: #000;
    color: #fff;
}
</style>
```

**vue和react组件设计中会大量应用插槽机制，比如vue里的slot标签， react的children等，所以这一块大家可以重点关注一下。** 我们在在Button的index.js里编写如下代码来作为vue的组件安装：

```
// 导入组件，组件必须声明 name
import XButton from './src'

// 为组件提供 install 安装方法，供按需引入
    XButton.install = function (Vue) {
    Vue.component(XButton.name, XButton)
}

// 导出组件
export default XButton
```

Button的组件结构如下：

![](/images/jueJin/170bf9dff0be709.png)

接下来我们在packages的入口文件中导入组件并安装导出：

```
// 导入button组件
import XButton from './Button'

// 组件列表
    const components = [
    XButton
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，那么所有的组件都会被注册
    const install = function (Vue) {
    // 判断是否安装
    if (install.installed) return
    // 遍历注册全局组件
    components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
    if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

    export default {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    // 以下是具体的组件列表
    XButton
}
```

上面的install步骤和导出步骤非常关键，大家需要按照规则配置，这也是vue组件注册的规则之一。详细文档大家可以看vue官网的组件篇。

### 3.测试代码

我们要想看到自己写的组件效果，可以将组件导入到examples目录下的main.js中，其本质就是一个项目的开发目录，我们只需要按照如下方式导入即可：

```
// examples/main.js
import Vue from 'vue'
import App from './App.vue'

// 导入组件库
import xui from '../packages'
// 注册组件库
Vue.use(xui)

Vue.config.productionTip = false

    new Vue({
    render: h => h(App),
    }).$mount('#app')
```

这种方式是全局导入，至于按需导入，完全可以采用element的方式来配置，对于业务组件来说，一般项目中都是使用的到，所以全局导入比较合适，作为UI库来说，按需导入可能更适合。

接下来我们就可以在项目中使用我们的组件了：

```
<template>
<div id="app">
<img alt="Vue logo" src="./assets/logo.png">
<x-button type="primary">button</x-button>
</div>
</template>
<script>
    export default {
    name: 'App',
        components: {
        
    }
}
</script>
<style>
    #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

```

效果如下：

![](/images/jueJin/170bfaefec137f2.png)

大家也可以采用elemnt开发更加美观的说明文档。

### 4.配置package.json文件

作为一个组件库,我们必须按照npm的发包规则来编写我们的package.json, 我们先来解决组件库打包的问题,首先我们需要让脚手架编译我们的组件代码,并输出到指定目录下,我们按照发包规范一般会输出到lib目录下,代码如下:

```
    "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lib": "vue-cli-service build --target lib --name xui --dest lib packages/index.js"
}
```

我们的lib脚本就是用来打包packages的组件代码到lib目录下,文件名为以--name指定的名称前缀开头,我们执行脚本会输出类似如下代码:

![](/images/jueJin/170bf2685585461.png)

其次我们需要编写package文件的description,keywords等,具体介绍如下:

*   description 组件库的描述文本
*   keywords 组件库的关键词
*   license 许可协议
*   repository 组件库关联的git仓库地址
*   homepage 组件库展示的首页地址
*   main 组件库的主入口地址(在使用组件时引入的地址)
*   private 声明组件库的私有性,如果要发布到npm公网上,需删除该属性或者设置为false
*   publishConfig 用来设置npm发布的地址,这个配置作为团队内部的npm服务器来说非常关键,可以设置为私有的npm仓库

还有很多配置具体要看团队的要求和规范,这里就不一一举例了.具体配置源码可参考地址 **[xui](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fxui "https://github.com/MrXujiang/xui")**.

### 5.发布到npm

发布到npm的方法也很简单, 首先我们需要先注册去npm官网注册一个账号, 然后控制台登录即可,最后我们执行npm publish即可.具体流程如下:

```
// 本地编译组件库代码
yarn lib
// 登录
npm login
// 发布
npm publish
// 如果发布失败提示权限问题,请执行以下命令
npm publish --access public
```

发布之后效果如下:

![](/images/jueJin/170bf33bef93dec.png)

之后我们就可以通过如下方式使用了:

```
import vui from '@alex_xu/vui'
import '/@alex_xu/vui/lib/vui.css'
Vue.use(vui)
```

关于npm相关的知识笔者在这里简单提一下,大家可以参考学习.

#### 1\. .npmignore 配置文件

.npmignore配置文件类似于 .gitignore 文件，如果没有 .npmignore，会使用.gitignore来取代他的功能。

#### 2\. npm发包的版本管理

npm的发包遵循语义化版本，一个版本号格式如下：Major.Minor.Patch，每一部分具体介绍如下:

*   Major 表示主版本号，做了不兼容的API修改时需要更新
*   Minor 表示次版本号，做了向下兼容的功能性需求时需要更新
*   Patch 表示修订号, 做了向下兼容的问题修正时需要更新

对应的npm也提供了脚本帮我们实现自动更新版本号，如下：

```
npm version patch
npm version minor
npm version major
```

还有更加深入的知识比如版本的tag化这些,大家感兴趣也可以研究一下. 本文的组件库搭建参考element的目录组织方式,大家也可以直接采用element或者其他开源组件库的脚手架来实现.

最后
--

后期笔者会花大量时间用在输出**node和数据可视化方面**的复盘，对于很多朋友说的希望让笔者多写点面试题，这块笔者之前已经说过了不会再出面试相关的文章了，希望大家**更专注于技术本身的沉淀和积累，注重技术的格局和深度**。笔者时间有限，谢谢各位理解啦～

如果想获取**更多项目完整的源码**, 或者想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [10分钟教你手写8个常用的自定义hooks](https://juejin.cn/post/6844904074433789959 "https://juejin.cn/post/6844904074433789959")
*   [《彻底掌握redux》之开发一个任务管理平台（上）](https://juejin.cn/post/6844904071933984776 "https://juejin.cn/post/6844904071933984776")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")