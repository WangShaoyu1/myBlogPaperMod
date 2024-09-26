---
author: "刘小灰"
title: "基于webpack打包多页应用,对前端工程化的思考"
date: 2020-12-17
description: "..."
tags: ["Webpack"]
ShowReadingTime: "阅读4分钟"
weight: 750
---
前言
--

在`Vue`,`React` 风靡的时代,加上基于框架衍生出来的各种`脚手架`,不得不说,现在 **前端工程化** 程度不逊色于任何端的开发

随着各种脚手架集成度的不断提高,现在几乎零配置就可以开发整个项目,俗称`傻瓜式开发`

是我们的代码变傻了吗?

不!!

是开发代码的人变的越来越傻了

脚手架并不能满足所有开发需求
--------------

比如,当我们需要开发一个公司官网,考虑到网站的SEO很可能我们还是需要使用原生js开发,开发模式大致如下:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39a1ae2d592d41b795b3ad313ee5407c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

开发模式很原始,本质上来说还是前后端不分离开发

虽然可以使用 **服务端渲染**, 及 **预渲染** 来优化这种开发方式,即可以实现 **前后端分离开发**,又兼顾了网站的 **SEO**,但你可能还会遇到一些问题

1.  历史性原因,推翻重做又不太现实
2.  服务端渲染,技术开发成本变高
3.  至少需要服务器搭建一套node环境
4.  ...

这个时候,可能我们又要回到上古时代的开发模式

使用`webpack`优化原始开发流程
-------------------

也就是使用`webpack`打包多页应用,让我们既可以有开发单页应用的丝滑体验,又满足项目开发需求

最重要的是手写`webpack`配置可以让你对前端工程化有更深入理解,`让开发代码的人越来越聪明,让代码变得越来越傻`

webpack工作流程(白话篇)
----------------

抽象来说,就是 **分** 与 **和**

*   开发的时候,让代码更 **'亲民'** 在模块开发下,我们可以把代码分开,组件化,提高开发效率使代码更容易维护
    
*   打包后,让代码更 **'亲计算机'** 打包后,再把代码组合成浏览器可识别的样子,同时让代码足够小,足够健壮
    

有了这个理念后,我们就可以开始搭建`wbpack`了

项目目录结构
------

开发环境时项目文件结构

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/796a0db9fd4a4fc8b256792750495805~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

打包后我们希望项目结构足够干净

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/047b55ccf5a645e79b306fbf57776718~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

webpack多页面配置
------------

> 1.  多代码警告!
> 2.  完整源码已放[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flyh0371%2Flyh-pages "https://github.com/lyh0371/lyh-pages"),并配有完整注释，欢迎直接去gaihub上看源码
> 3.  如有帮助,欢迎star,万分感谢

效果演示
----

*   开发环境 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4584ab5f6b340e2a09fbe6fd3e46749~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
*   生成环境 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fbd5083f2944a3493a1831156089ee5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 入口配置

为了让我们可以快速看到页面效果,我们先把入口写死成两个文件来说明打包的是多页面(后续会改成自动读取)

*   entry

js

 代码解读

复制代码

`module.exports = {   entry: {     index: path.join(__dirname, "../src/pages/index/index.js"),     user: path.join(__dirname, "../src/pages/user/user.js"),   }  }`

### 出口配置

*   output

js

 代码解读

复制代码

 `output: {     path: path.resolve(__dirname, "../dist"), // 打包路径     filename: assetsPath("js/[name]_[hash:7].js"), // 文件名称     publicPath: "./",   },`

*   使用`html-webpack-plugin`,动态生成对应模板 同样,在这里我们先写死为index和user,两个页面模板

js

 代码解读

复制代码

`const hwp = [   new HtmlWebpackPlugin({     filename: "index.html",     template: resoveDev("/index/index.html"),     title: "首页",     chunks: ["index", "common"],     minify: {       removeComments: false,       collapseWhitespace: false,       removeAttributeQuotes: false,       //压缩html中的js       minifyJS: false,       //压缩html中的css       minifyCSS: false,     },   }),   new HtmlWebpackPlugin({     filename: "user.html",     template: resoveDev("/user/user.html"),     title: "我的",     chunks: ["user", "common"],     minify: {       removeComments: false,       collapseWhitespace: false,       removeAttributeQuotes: false,       //压缩html中的js       minifyJS: false,       //压缩html中的css       minifyCSS: false,     },   }), ]; // 在插件中使用 plugins:[...hwp]`

### css处理

`webpack`并不支持处理除了`js`以外的任何文件,其他文件都需要通过相应的`loader`来处理

js

 代码解读

复制代码

`... module:{ 	rules:[        {         test: /\.less$/,         use: [           {             options: {               publicPath: "../../", // 配置css里面的路径             },           },           "css-loader",           "less-loader",         ],       },     ] } ...`

`webpack`默认会把`css`同样打包到`js`里面,我们还需要使用`mini-css-extract-plugin`把`css`抽离为单独的文件

js

 代码解读

复制代码

`... module:{ 	rules:[        {         test: /\.less$/,         use: [          loader: MiniCssExtractPlugin.loader,           {             options: {               publicPath: "../../", // 配置css里面的路径             },           },           "css-loader",           "less-loader",         ],       },     ] } ... const MiniCssExtractPlugin = require("mini-css-extract-plugin"); plugins:[new MiniCssExtractPlugin()]`

### 图片处理

图片处理 使用`url-loader`

js

 代码解读

复制代码

`module:{   rules:[       {           test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,           loader: "url-loader",           options: {             limit: 1000, // 1kb一下的图片变成base64格式             name: "[name]_[hash:7].[ext]", // 给图片添加hash             outputPath: "./static/images", // 图片输出路径           },         },   ] }`

这里需要注意的是`url-loader`只能处理`css`文件里面的图片,我们还需要使用`html-loader`来处理`html`里面的图片, 但是`html-loader`和`html-webpack-plugin`有冲突,所以我们不能在`webpack`里面对`html-loader`进行配置,只能在使用`html`中使用图片的时候妥协

html

 代码解读

复制代码

 `<img src=" <%= require('@/assets/images/logo.png' )%>" alt="" />`

而`html-loader`的重要用途在于可以实现html的模块化

html

 代码解读

复制代码

`<body> 	<!-- 加载公用html -->   	<%= require('html-loader!../common/header.html') %> </body>`

### 区分开发环境和生产环境

我们使用三个文件来配置`webpack`

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1e783ad57f044be860aa58be57d7219~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在`package.json`文件添加对应命令,不同的命令使用不同的配置文件

js

 代码解读

复制代码

 `"scripts": {     "dev": "webpack-dev-server --inline --progress --config config/webpack.dev.config.js --open",     "builds": "webpack  --config  config/webpack.pro.config.js",   }`

在`webpack.dev.config.js`和`webpack.pro.config.js`进行组合

js

 代码解读

复制代码

`// base 为基础文件  pro 为生成环境配置 merge(base, pro)`

后续优化
----

第一版本我们遵循 **代码先运行起来** 为原则,没有对webpack做任何优化,下个版本将会更新

*   1.  按照约定,路由自动生成
*   2.  `js`,`css` 的`tree-shaking`优化
*   3.  `eslint`+`prettier`的配置
*   4.  做成命令行工具,分为pc端及移动端,在使用命令行生成项目时可自行选择

最后
--

记得点赞哟😉