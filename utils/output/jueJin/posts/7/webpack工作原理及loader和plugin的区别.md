---
author: "Gaby"
title: "webpack工作原理及loader和plugin的区别"
date: 2021-08-11
description: "webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时,它会递归地构建一个依赖关系图"
tags: ["前端","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:16,views:1580,"
---
**这是我参与8月更文挑战的第9天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

* * *

目录
--

### webpack 原理

### webpack 配置

### webpack核心概念

#### entry

#### Output

#### Module

#### Chunk

#### loader

#### plugin

#### loader和plugin的区别

### webpack 构建流程

* * *

### webpack 原理

![image.png](/images/jueJin/ec5218cded7542e.png)

本质上,webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时,它会递归地构建一个依赖关系图(dependency graph),其中包含应用程序需要的每个模块,然后将所有这些模块打包成一个或多个 bundle。通过代码分割成单元片段并按需加载。

webpack 不仅可以让我们编写模块，而且还支持任何模块格式（至少在我们到达 ESM 之前），并且可以同时处理资源和资产，这也是 webpack 存在的原因。

### webpack 配置

以下是webpack.config.js的基本配置，更多配置请移步[webpack配置](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.docschina.org%2Fconcepts%2Fconfiguration%2F%23introductory-configuration "https://webpack.docschina.org/concepts/configuration/#introductory-configuration")

```js
const path = require('path');

    module.exports = {
    mode: 'development',
    entry: './foo.js',
        output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'foo.bundle.js',
        },
        };
```

### webpack核心概念

#### entry

入口起点(entry point)指示 webpack 应该使用哪个模块,来作为构建其内部依赖图的开始。

进入入口起点后,webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

每个依赖项随即被处理,最后输出到称之为 bundles 的文件中。

#### Output

output 属性告诉 webpack 在哪里输出它所创建的 bundles,以及如何命名这些文件,默认值为 ./dist。

基本上,整个应用程序结构,都会被编译到你指定的输出路径的文件夹中。

#### Module

模块,在 Webpack 里一切皆模块,一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。

#### Chunk

代码块,一个 Chunk 由多个模块组合而成,用于代码合并与分割。

#### loader

loader是文件转换器，可以将所有类型的文件转换为 webpack 能够处理的有效模块。

> 本质上，webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。**loader** 让 webpack 能够去处理其他类型的文件，并将它们转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

webpack 就像一条生产线,要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的,多个流程之间有存在依赖关系,只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能,在特定的时机对生产线上的资源做处理。

1.  处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序是相反的，即最后一个loader最先执行，第一个loader最后执行
    
2.  第一个执行的loader接收源文件内容作为参数，其它loader接收前一个执行的loader的返回值作为参数，最后执行的loader会返回此模块的JavaScript源码
    

#### plugin

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

> 在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。

webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件,插件只需要监听它所关心的事件,就能加入到这条生产线中,去改变生产线的运作。 webpack 的事件流机制保证了插件的有序性,使得整个系统扩展性很好。

#### loader和plugin的区别

对于loader，它是一个转换器，单纯的文件转换过程

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务

### webpack 构建流程

Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

*   初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
*   开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
*   确定入口：根据配置中的 entry 找出所有的入口文件。
*   编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
*   完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
*   输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
*   输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**