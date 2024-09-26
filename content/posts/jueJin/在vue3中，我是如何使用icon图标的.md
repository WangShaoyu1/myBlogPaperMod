---
author: "白哥学前端"
title: "在vue3中，我是如何使用icon图标的"
date: 2023-07-14
description: "本文介绍三种使用icon的方案，分别是element-icon、svg-icon、@iconify/vue。通过这三种方式，让你不再为icon不知道怎么使用而烦恼"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读1分钟"
weight: 119
---
本文介绍三种使用icon的方案，分别是`element-icon`、`svg-icon`、`@iconify/vue`。

1\. element-icon
----------------

Element Plus 提供了一套常用的图标集合。

### 1.1. 安装

ruby

 代码解读

复制代码

`# 选择一个你喜欢的包管理器 # NPM $ npm install @element-plus/icons-vue # Yarn $ yarn add @element-plus/icons-vue # pnpm $ pnpm install @element-plus/icons-vue# 选择一个你喜欢的包管理器`

### 1.2. 注册所有图标

从 @element-plus/icons-vue 中导入所有图标并进行全局注册。

javascript

 代码解读

复制代码

`// main.ts // 如果您正在使用CDN引入，请删除下面一行。 import * as ElementPlusIconsVue from '@element-plus/icons-vue' const app = createApp(App) for (const [key, component] of Object.entries(ElementPlusIconsVue)) {   app.component(key, component) }`

### 1.3. 基础用法

xml

 代码解读

复制代码

`<!-- 使用 el-icon 为 SVG 图标提供属性 --> <template>   <div>     <el-icon :size="size" :color="color">       <Edit />     </el-icon>     <!-- 或者独立使用它，不从父级获取属性 -->     <Edit />   </div> </template>`

如果你想用字符串的形式，可以这样搞。

以侧边栏的图标渲染为例子。

我的路由是这样写的：

css

 代码解读

复制代码

`{   path: '/index',   name: 'Index',   component: () => import('@/views/workbench/home/index.vue'),   meta: {   title: '工作台',   icon: 'HomeFilled',   affix: true, }`

当在组件中渲染的时候可以用`component`组件来渲染：

ruby

 代码解读

复制代码

`<el-menu-item   :index="subItem.path"   @click="handleClickMenu(subItem)"   >    <el-icon>      <component :is="subItem.meta.icon"></component>   </el-icon> </el-menu-item>`

最终效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/414f037c51ec46808447abd4f2c16e1a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2\. svg-icon
------------

如果element的icon不满足我们的需求的话，我们可以从[iconfont](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2F "https://www.iconfont.cn/")去下载svg图标。然后使用。

### 2.1. 安装

首先要使用[vite-plugin-svg-icons](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvbenjs%2Fvite-plugin-svg-icons%2Ftree%2Fmain%23readme "https://github.com/vbenjs/vite-plugin-svg-icons/tree/main#readme")插件

csharp

 代码解读

复制代码

`yarn add vite-plugin-svg-icons -D # or npm i vite-plugin-svg-icons -D # or pnpm install vite-plugin-svg-icons -D`

### 2.2. 配置

在vite.config.ts中配置一下

ts

 代码解读

复制代码

`import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' import path from 'path' export default () => {   return {     plugins: [       createSvgIconsPlugin({         iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],         symbolId: 'icon-[dir]-[name]',       }),     ],   } }`

这里注意iconDirs的路径，是读取的svg icon存放的目录。

### 2.3. 封装

我们把Svg封装成一个组件：

vue

 代码解读

复制代码

``<template>   <i :class="['el-icon', spin && 'svg-icon-spin']" :style="getStyle">     <svg aria-hidden="true">       <use :xlink:href="symbolId" :fill="color" />     </svg>   </i> </template> <script setup lang="ts" name="SvgIcon">   import { computed } from 'vue'   import type { CSSProperties } from 'vue'   const props = defineProps({     prefix: {       type: String,       default: 'icon',     },     name: {       type: String,       required: true,     },     color: {       type: String,       default: '#ffffff',     },     size: {       type: [Number, String],       default: 20,     },     spin: {       type: Boolean,       default: false,     },   })   const symbolId = computed(() => `#${props.prefix}-${props.name}`)   const getStyle = computed((): CSSProperties => {     const { size } = props     let s = `${size}`     s = `${s.replace('px', '')}px`     return {       fontSize: s,     }   }) </script> <style scoped lang="scss">   .el-icon {     --color: inherit;     position: relative;     display: inline-flex;     align-items: center;     justify-content: center;     width: 1em;     height: 1em;     font-size: inherit;     line-height: 1em;     color: var(--color);     fill: currentColor;     svg {       width: 1em;       height: 1em;     }   }   .svg-icon-spin {     animation: circle 1.5s infinite linear;   }   /* 旋转动画 */   @keyframes circle {     0% {       transform: rotate(0);     }     100% {       transform: rotate(360deg);     }   } </style>``

这里我封装的支持prefix、name、size、color、spin（是否旋转）等属性。

### 2.4. 使用

我们先去[iconfont](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2F "https://www.iconfont.cn/")下载一个svg格式的图标。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7876a945c6c4c649e350a146345e7a6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

下载完成后，把这个svg放入iconDirs声明的路径下面即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/904564cadbc94db9a33444deaefe7e05~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在项目中使用。引入这个组件然后使用即可。注意name跟你的svg name保持一致。

vue

 代码解读

复制代码

`<SvgIcon name="welcome" size="400px" /><SvgIcon name="welcome" size="400px" />`

我这里的图标效果是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bffd5039875c472fab0347436231dc1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3\. iconify
-----------

iconify是一种非常广泛的图标解决方案，它收集了全网所有的图标。

### 3.1. 安装

scss

 代码解读

复制代码

`pnpm install --save-dev @iconify/vuepnpm install --save-dev @iconify/vue`

### 3.2. 封装

vue

 代码解读

复制代码

``import { h, defineComponent } from 'vue' import { Icon as IconifyIcon } from '@iconify/vue' export default defineComponent({   name: 'IconifyIconOnline',   components: { IconifyIcon },   props: {     icon: {       type: String,       default: '',     },   },   render() {     const attrs = this.$attrs     return h(       IconifyIcon,       {         icon: `${this.icon}`,         style: attrs?.style           ? Object.assign(attrs.style, { outline: 'none' })           : { outline: 'none' },         ...attrs,       },       {         default: () => [],       },     )   }, })``

当然你不封装也可以。

### 3.3. 使用

首先我们要找一个图标，可以去[icon-sets.iconify.design/](https://link.juejin.cn?target=https%3A%2F%2Ficon-sets.iconify.design%2F "https://icon-sets.iconify.design/")。搜索你想要的图标。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d17c9a59aaa748e69507f0df914cf5cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

复制图标的名字。

在项目中直接使用

vue

 代码解读

复制代码

`<template>   <div class="btn">     <el-tooltip content="刷新">       <el-button circle>         <IconifyIcon icon="ri:refresh-line" height="16" />       </el-button>     </el-tooltip>   </div> </template> <script lang="ts"> import { defineComponent } from 'vue' import { IconifyIcon } from '@/components/IconifyIcon' export default defineComponent({   components: {     IconifyIcon,   }, }) </script> <style scoped lang="scss"> .btn {   margin-right: 20px;   cursor: pointer;   transition: all 0.3s; }`

如果你想直接在vscode中预览这个图标长啥样，就像下面这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b89bcd765a0451f868c2dccf42b8deb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

你可以安装一个插件：**Iconify IntelliSense**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f26b4ad53fb485fa99885bb30c47ff1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们在浏览器中打开调试工具，看看application，发现这里缓存的一些图标

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac8c34e799d4cd899f1faf16c3921bb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

当第一次请求后，浏览器会把这个图标缓存。下次请求的时候直接从缓存中读取的。

最后
--

以上，就是我在项目中使用图表的三种方式。你还有其他的方式吗？欢迎在评论区讨论。

另外，我的开源项目正在进行，欢迎你的加入👏👏👏

开源项目预览地址：[vivace-admin-vue.vercel.app/#/index](https://link.juejin.cn?target=https%3A%2F%2Fvivace-admin-vue.vercel.app%2F%23%2Findex "https://vivace-admin-vue.vercel.app/#/index")

界面展示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88bc9c9a0f824d2fb4cb8b5737acffa6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)