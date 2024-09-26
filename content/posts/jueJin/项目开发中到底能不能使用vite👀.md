---
author: "刘小灰"
title: "项目开发中到底能不能使用vite👀"
date: 2021-01-04
description: "很多人其实并没有拿vite用于正式的项目开发中,仅仅是用vite运行下vue3跑跑demo。因为现在基于webpack构建的脚手架足够稳定及好用。下面就我自己在vite使用中遇见的槽点而言,和大家分享下现阶段vite使用上的一些不爽之处,如有错误,欢迎留言评论。这种报错自然…"
tags: ["Vue.js"]
ShowReadingTime: "阅读5分钟"
weight: 301
---
前言
--

就在2020的最后一天,我把公司的一个小项目升级到了`vue3`,项目很简单,核心功能就是一个H5拼图(公司内部项目,不便给出链接)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6c1a337b7ef47c5892e43510c1f7af3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

原来的项目架构:`vue2` + `vue-cli2` + `vant`

升级后的项目架构: `vue3` + `vite1.0` + `vant`

**一天时间重构上线,在元旦节中使用一切正常** 😘

下面我们不卑不亢,来探讨下`vue3`及`vite1.0`

`vite`升级到了2.0
-------------

元旦节的时候,尤雨溪送给了我们一个跨年礼物,发布了`vite`的2.0版本 ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc3c45e1b13844ebb6c312877251ec16~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

是不是很震惊!`1.0`的还没用呢,`2.0`的就出来了?

不要慌,在我看来`2.0`最主要的更新点就是`vite`和`vue`解耦,还有就是出了[vite官网文档](https://link.juejin.cn?target=https%3A%2F%2Fvitejs.dev%2Fconfig%2F "https://vitejs.dev/config/"),虽然是英文版,但耐心看下来,也可以看懂个七七八八 ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/296d7108b50f4998853f425bf1e93fcd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我在使用`vite`中遇到的槽点
----------------

很多人其实并没有拿`vite`用于正式的项目开发中,仅仅是用`vite`运行下`vue3`跑跑demo。因为现在基于`webpack`构建的脚手架足够稳定及好用。

`vite`的优点不言而喻,个人认为以后很有可能替代`webpack`,那`vite`在正式项目开发中表现如何呢?

下面就我自己在`vite`使用中遇见的槽点而言,和大家分享下现阶段`vite`使用上的一些不爽之处,如有错误,欢迎留言评论。

### `require`不能使用

在使用`vue-cli`的时候,出于业务需要我们可能需要这样引用图片

js

 代码解读

复制代码

`{   imgUrl:require("../assets/images/bg.png") }`

然后在`template`中使用

html

 代码解读

复制代码

`<img :src="imgUrl" alt="">`

如何图片的路径是动态的,我们也需要使用`require`引用,从而让框架在打包的时候分析出正确的路径

但这种图片引用方案在`vite`中并不能用,浏览器中会报`require`相关错误 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a115c099bb145a184115c10f8e861a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这种报错自然可以理解,因为`vite`使用的是浏览器自带的`module`去解析`js`的,而`require`语法是`node`语法,自然报错,但是`vite`并没有给出合理的解决方案。

最后只好是把需要`require`引入的图片放到`public`文件夹下😟,这样打包前后路径都不会被处理,可以保证路径的正确性

### 全局css文件无法配置

在`vue-cli`中我们可以使用`css预处理器`来提取公用css变量及css函数并放在一个文件中,然后再`vue.config.js`中如下配置

js

 代码解读

复制代码

``module.exports = {   css: {     // 不用在每一个页面都进行引入样式，就能直接引用。     loaderOptions: {       sass: {         prependData: `@import '@/assets/scss/variables.scss';`       }     }   } }``

这样我们就可以在任何`sass`文件中都可以使用到`sass`变量了

但在`vite`中却没有提供这样的配置🙄,官方也提供了如何配置css变量

js

 代码解读

复制代码

``export default {   css: {     preprocessorOptions: {       scss: {         additionalData: `$injectedColor: orange;`       }     }   } }``

但是,如果我想把所有的变量及函数抽离到一个文件中引入,像以下这样:

js

 代码解读

复制代码

`export default {   css: {     preprocessorOptions: {       scss: {         additionalData: "@import '../assets/scss/_base.scss';" // 无效       }     }   } }`

发现并不起作用

去`vite`的`issues`中发现有人也提及了类似的问题 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ec01a4d90e542e1ac6cd28df0721f5b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

尤雨溪的回答也很简单

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c10f9354a7145bcba2fbd22ffbfa4ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

意思就是使用`poctss-import`来配置全局css,但是并没有说如何配置(有知道的大佬可以再下面评论哦)

### 错误提示不友好

相比于`vue-cli`,`vite`的错误提示并不是十分友好,有些时候页面也不报错也不出来任何东西。遇到这种情况时,我们可以重新启动框架试试,还有就是在引用`.vue`文件时,后缀名不能省略。

推荐使用vite
--------

`vite`本身已经足够完善,可能在一些工程化及社区建设方面比`webpack`差了一些,但总体体验下来,很多地方都是可以无缝迁移的,速度确实比`webpack`快,打出来的包也比`webpack`小,下面是同样的代码打出来的包体积的对比:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/278b53d28871411a9a07f8641a2e1f57~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

对vue3的看法
--------

`vue3`内部的优化就不讨论了,我们说下开发体验

### 代码量增多

可以感觉到,在使用`vue3`时一切都变成的函数,且在使用`vuex`和`vue-router`也大有不同

js

 代码解读

复制代码

`import { useRoute, useRouter } from "vue-router"; import { useStore } from "vuex"; export default {   setup() {     const route = useRoute();     const router = useRouter();     const store = useStore();   }`

无形之中确实增加了些代码量

### 代码变的更灵活

vue3最大的更新就是[composition-api](https://link.juejin.cn?target=https%3A%2F%2Fvue-composition-api-rfc.netlify.app%2Fzh%2F "https://vue-composition-api-rfc.netlify.app/zh/"),全新的语法及代码结构,从api要做的事来讲确实是增加的代码的灵活性,代码的可组织性确实变高的很多。

但是,在现实开发中,我们很可能一不小心就写出`setup`中有很多代码的情况,你可能也会遇到如下场景:

makefile

 代码解读

复制代码

`同事小张:  可以把代码抽离出来,放到不同的文件夹,便于维护啊! 我:  抽离出来就又会多出来几个js文件,对我来说并不便于维护啊! 同事小张: 你懂啥,我看你就是懒吧! 我:  是啊,时间紧任务重,哪有时间整理啊!`

只能说理想和现实总是有差别的,任何东西都是一把双刃剑,你觉得呢?

最后
--

如有收获,请慷慨点赞呦😚