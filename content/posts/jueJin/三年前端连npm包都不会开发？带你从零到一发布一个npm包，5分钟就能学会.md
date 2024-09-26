---
author: "天天鸭"
title: "三年前端连npm包都不会开发？带你从零到一发布一个npm包，5分钟就能学会"
date: 2024-08-05
description: "作为一名开发，npm包大家肯定用的多了，但不知道大家有没有自己开发过，这篇文章带你从零到一去发布一个插件，超级详细的。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读4分钟"
weight: 785
---
前言:
===

回想当初项目需求要写`vue`的插件，由于对这方面没有了解，所以当时听到头都大了毕竟听着就高大上，后来硬着头皮去了解学习后发现也就那么回事啊挺简单的，距离现在也有一段时间没写过插件了今天就从零到一写个文章，当是复习一下流程。以下是基于`vue3+vite`创建一个防抖函数插件为例，从编写到发布上线流程去说明。

一、创建项目
======

#### （1）先创建一个文件夹初始化项目

bash

 代码解读

复制代码

`mkdir tty-debounce-plugin cd tty-debounce-plugin npm init -y`

> 执行完上面命令之后：
> 
> *   当前工作目录会有一个名为 `tty-debounce-plugin` 的文件夹。
> *   `tty-debounce-plugin` 文件夹内会有一个 `package.json`文件，其中包含了默认的项目配置相关信息。

#### （2）然后使用指令去安装`vue3`和`vite`的依赖

lua

 代码解读

复制代码

`npm install vite vue@next --save`

二、vite配置
========

由于是基于`vue3+vite`开发的插件，所以要创建 `vite.config.js`文件

php

 代码解读

复制代码

`export default defineConfig({   build: {     lib: {       entry: './src/index.js',       name: 'ttyDebouncePlugin',       fileName: 'tty-debounce-plugin',     },     rollupOptions: {       external: ['vue'],       output: {         globals: {           vue: 'Vue'         }       }     }   } });`

> **上面配置几个核心大概意思如下：**
> 
> *   entry: 指定了库的入口文，例如这里入口是 ./src/index.js。
> *   name: 库的名称是什么，例如这里设置为 ttyDebouncePlugin。
> *   fileName: 构建完成后的文件名是什么，例如这里设置为 tty-debounce-plugin。
> *   external: 哪些模块会被外部化处理，例如这里设置了 vue 。
> *   output.globals: 如何将外部化的模块映射到全局变量上，这里将 vue 映射为 Vue。

三、插件代码编写
========

由于上面`vite`配置了`entry: './src/index.js'`作为入口，所以要在文件夹里面创建`src`文件夹，然后在里，创建`index.js`文件，然后在文件中编写具体的防抖函数。具体代码如下所示。

ini

 代码解读

复制代码

`import { createApp } from 'vue'; function ttydebounce(func, wait, immediate) {   let timeout;   return function(...args) {     const context = this;     const later = function() {       timeout = null;       if (!immediate) func.apply(context, args);     };     const callNow = immediate && !timeout;     clearTimeout(timeout);     timeout = setTimeout(later, wait);     if (callNow) func.apply(context, args);   }; } export default {   install(app, options) {     app.config.globalProperties.$ttydebounce = ttydebounce;   } };`

上面代码中`ttydebounce`为防抖函数，最后用`export default`导出`vue`插件，并且用`vue`的全局属性`globalProperties`把 `ttydebounce` 函数绑定在 `Vue` 的全局属性 `$ttydebounce` 上方便全局使用。

**注意：其中一定要用 `install` 方法，这是用来安装插件到 `Vue` 实例的。**

四、打包构建插件
========

按上面流程配置好环境并且写好代码自行测试没有问题之后，就可以输入法如下指令打包项目了。

 代码解读

复制代码

`vite build`

由于`vite`配置了`fileName: 'tty-debounce-plugin'`，打包后会输出一个 `tty-debounce-plugin`文件。

五、配置 package.json文件
===================

发布前要修改 `package.json` 文件，里面会配置插件对应的各种信息，如下所示

perl

 代码解读

复制代码

`{   "name": "tty-debounce-plugin",   "version": "1.0.0",   "description": "这是天天肉鸭的文章示例代码",   "main": "dist/tty-debounce-plugin.js",   "module": "dist/tty-debounce-plugin.js",   "exports": {     ".": {       "import": "./dist/tty-debounce-plugin.js",       "require": "./dist/tty-debounce-plugin.js"     }   },   "scripts": {     "build": "vite build",     "test": "jest"   },   "author": "tty <my.email@tty.com>",   "license": "MIT",   "repository": {     "type": "git",     "url": "https://github.com/......"   },   "keywords": [     "vue",     "plugin",     "vue3",     "debounce",     "vite"   ],   "peerDependencies": {     "vue": "^3.3.6"   } }`

> **上面配置的核心内容意思如下：**
> 
> *   `name`: 项目名称。
> *   `version`: 项目版本号。
> *   `description`: 项目描述
> *   `license`: 项目的许可协议。
> *   `repository`: 项目的仓库信息。
> *   `keywords`: 项目的关键词列表。
> *   `main`: 指定项目主入口文件。
> *   `module`: 指定 `ES` 模块的入口文件。
> *   `exports`: 指定不同环境下的导出文件路径。
> *   `peerDependencies`: 指定项目兼容版本范围。例如这里是 `^3.3.6`。即表示该插件只能和 `Vue 3.3.6` 及其后续版本兼容。

六、连接远程 Git 仓库
=============

一切配置都完成之后就要先初始化再连接远程仓库了。

#### （1）初始化仓库

csharp

 代码解读

复制代码

`git init git add . git commit -m "tty-dome"`

#### （2）连接远程仓库

先前往 `GitHub` 创建一个新的仓库，然后开始关联。

csharp

 代码解读

复制代码

`git remote add origin https://github.com/yourname/tty-debounce-plugin.git git push -u origin main`

上面指令是将远程仓库添加到本地 `Git` 仓库，然后远程推送。

七、注册 npm 账号并且登录发布
=================

发布`npm`包肯定需要有`npm`的帐号啦，直接前往官网注册。然后按以下步骤操作。

#### （1）登录

输入`npm login`后会要你输入帐号，再输入密码的。

 代码解读

复制代码

`npm login`

**注意：输入密码时控制台看着没有反应，其实是正常的生效的。**

#### （2）发布

发布前先看看包名有没有被使用了

sql

 代码解读

复制代码

`npm search tty-debounce-plugin`

然后发布指令如下，发布完成后，可以直接访问 `npm` 官方网站查看是否成功。

 代码解读

复制代码

`npm publish`

八、发布成功后在项目中使用
=============

终于发布成功，肯定就是使用包了，使用其实都差不多，步骤如下。

#### （1）安装插件

 代码解读

复制代码

`npm install tty-debounce-plugin`

#### （2）在`main.js` 或 `main.ts` 文件引入使用插件。

javascript

 代码解读

复制代码

`import ttyDebouncePlugin from 'tty-debounce-plugin'; app.use(ttyDebouncePlugin);`

然后就可以在页面直接`$ttydebounce`使用了。

小结：
===

至此一个插件就开发完成了，是不是真的很简单。其实就是组件封装然后走一个配置、打包、发布的流程。但和日常组件有点不同的是需要更加重视兼容性的问题，具体还是针对插件的应用场景而定。如果上面那里写的不对或者有更好的建议欢迎大佬批出。