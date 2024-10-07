---
author: "布丁是只猫"
title: "通过脚手架一键生成vue后台管理系统"
date: 2024-04-03
description: "最近一直在做后台管理，一般都是从网上gitclone一份下来，然后根据需求将多余的模块删除。这时我就在想有没有一种方法能够根据我的需要自动配置我想要的功能和模块呢？毕竟每一次复制粘贴也怪麻烦的，"
tags: ["前端"]
ShowReadingTime: "阅读2分钟"
weight: 112
---
最近一直在做后台管理，一般都是从网上git clone一份下来，然后根据需求将多余的模块删除。

这时我就在想有没有一种方法能够根据我的需要自动配置我想要的功能和模块呢？ 毕竟每一次复制粘贴也怪麻烦的，而且有些后台管理用的技术栈并不是我想要的。

例如，我想用不同的ui库，模板用的ts，但是我想要js版的，想用上多语言等等。。。

于是，参考vue cli 的方式我搭建了一个脚手架 bd-admin,能够按照我的需求自己选择技术栈

如果对你有帮助，可以下载安装试一试，欢迎提各种需求和bug

开源地址：[github.com/lhpCode/bd-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FlhpCode%2Fbd-admin "https://github.com/lhpCode/bd-admin")

**ps:如果发现项目无法创建或者生成的项目有问题，请说一下你现在的版本号**

**目前最低支持版本18.12.0**

**如果发现有eslint报错，或者无法下载，更新至18.18.0 以上试试**

bd-admin是什么？
------------

bd-admin（布丁admin）是一款能根据需求快速配置vue后台管理的脚手架，内置使用vue3 + vue-router + pinia + axios 其他功能均可自定义。

脚手架能做什么？
--------

*   极简操作，安装就可使用
*   轻装上阵，模块功能自己决定是否使用，可以快速修改为自己想要的模板。
*   自定义技术栈 : vue3 +elementUI or vue3+Ant Design 由你搭配
*   自定义后台管理功能模块：权限配置 or 多语言 or 动态换肤 项目功能由你选择
*   代码规范可配置：自选是否在项目中应用eslint 和Prettier

构建后后台管理有哪些功能？
-------------

搭建的后台模板默认是使用vite5，vue3,pinia,axios这些流行的技术栈 其余可选配置有

*   框架技术自提
    *    语言选择： typeScript or javaScript
    *    ui库选择 ：element Plus or Ant Design
    *    css扩展语言选择: less or scss
    *    代码规范:eslint 和Prettier
    *    多语言：使用i18配置多语言
*   框架模块自提
    *    echarts
    *    three.js

如何使用
----

使用方法很简单,先全局安装脚手架

js

 代码解读

复制代码

`npm install bd-admin -g`

然后

js

 代码解读

复制代码

`bd-admin create <name>`

之后就可以根据配置自主选择项目需要哪些模块了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc2ba0b02e4c46ccadc2c829a370841d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=392&h=487&s=25312&e=png&b=181818)

生成后的项目示例
--------

### 示例1

**ts**+vue3+i18n+vue-router+pinia+**ant Design vue**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d56630d8474cd79148114da451a8dd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1579&h=750&s=127345&e=png&b=ffffff)

### 示例2

**js**+vue3+i18n+vue-router+pinia+**element**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0bf800088ae4c84b7ede10fb08aa6ca~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1910&h=863&s=2533997&e=png&b=1c6f80)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/267d622463d141528d373effc8faa328~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1099&h=731&s=382671&e=png&b=353535)