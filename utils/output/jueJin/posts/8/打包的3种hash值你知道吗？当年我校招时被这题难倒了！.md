---
author: "Sunshine_Lin"
title: "打包的3种hash值你知道吗？当年我校招时被这题难倒了！"
date: 2022-02-04
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 当年的校招 依稀记得，当年我参加了大厂的校招，面试的是网易雷火工作室，当时有一道题，我记得很清楚，就是"
tags: ["前端","JavaScript","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:105,comments:0,collects:96,views:9463,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

当年的校招
-----

依稀记得，当年我参加了大厂的校招，面试的是**网易雷火工作室**，当时有一道题，我记得很清楚，就是：**说说webpack中三种hash配置的区别**

哈哈，我当时连`webpack`都不太会配置，所以也答不出来，然后也。。。没有然后了。。

哪三种？
----

webpack中的三种`hash`分别是：

*   `hash`：全局hash
*   `chunkhash`：分组hash
*   `contenthash`：内容hash

实践讲解
----

### 事先准备

准备三个文件：

![](/images/jueJin/6ce4804a9015440.png)

*   `main.js`

```js
import './main.css'

console.log('我是main.js')
```

*   `console.js`

```js
console.log('我是console.js')
```

*   `main.css`

```js
    .title {
    color: #000;
}
```

### 打包环境搭建

打包环境的搭建我就不在这里详细讲了，想看的之后我会出一篇文章专门讲解。这里我就抽取精华部分。

*   `webpack.config.js`

```js
// 多入口打包
    entry: {
    main: './src/main.js',
    console: './src/console.js'
    },
    // 输出配置
        output: {
        path: path.resolve(__dirname, './dist'),
        // 这里预设为hash
        filename: 'js/[name].[hash].js',
        clean: true
        },
            plugins: [
            // 打包css文件的配置
                new MiniCssExtractPlugin({
                // 这里预设为hash
                filename: 'styles/[name].[hash].css'
                })
            ]
```

### hash

由于我们预设的是`hash`，所以我们直接运行打包`npm run build`，我们看看我们打包后的是什么东西

![](/images/jueJin/f65e12dba2bc477.png)

可以看到，所有文件的文件名hash值都是一致的，那我们现在改一下`main.css`这个文件

```js
    .title {
    // #000 改成 #fff
    color: #fff;
}
```

然后我们再运行`npm run build`打包，看看打包后的是什么东西：

![](/images/jueJin/1ac1ed163dd4460.png)

可以看出，修改一个文件，所有文件的hash值跟着变

> 结论：**牵一发动全身**，只改了一个`main.css`，会导致打包后所有文件的hash值都改变。所以当打包名称设置为`hash`时，整个项目文件是一致的，修改其中一个会导致所有跟着一起改。 ![](/images/jueJin/2d5fe59961ac4ad.png)

### chunkhash

我们把输出文件名规则修改为`chunkhash`：

```js
    entry: {
    main: './src/main.js',
    console: './src/console.js'
    },
        output: {
        path: path.resolve(__dirname, './dist'),
        // 修改为 chunkhash
        修改    filename: 'js/[name].[chunkhash].js',
        clean: true
        },
            plugins: [
                new MiniCssExtractPlugin({
                // 修改为 chunkhash
                修改      filename: 'styles/[name].[chunkhash].css'
                })
            ]
```

此时我们运行`npm run build`看看，打包后的东西：

![](/images/jueJin/c282f66132c440b.png)

我们可以看出，hash值会根据**入口文件的不同**而分出两个阵营：

*   `main.js、main.css`一个阵营，都属于**main.js**入口文件
*   `console.js`一个阵营，属于**console.js**入口文件

那我们现在照样修改一下`main.css`：

```js
    .title {
    // 从 #fff 改为 pink
    color: pink;
}
```

重新运行`npm run build`打包看看：

![](/images/jueJin/d307afd9309e464.png)

可以看出，`main.css`修改后会影响`main.css、main.js`的hash值

> 结论：当规则为`chunkhash`时，打包后的hash值会根据入口文件的不用而不一样，当某个入口文件修改后重新打包，会导致本入口文件关联的所有文件的hash值都修改，但是不会影响到其他入口文件的hash值 ![](/images/jueJin/deee7159b16a4e1.png)

### contenthash

我们把输出文件名规则修改为`contenthash`：

```js
    entry: {
    main: './src/main.js',
    console: './src/console.js'
    },
        output: {
        path: path.resolve(__dirname, './dist'),
        // 修改为 contenthash
        修改    filename: 'js/[name].[contenthash].js',
        clean: true
        },
            plugins: [
                new MiniCssExtractPlugin({
                // 修改为 contenthash
                修改      filename: 'styles/[name].[contenthash].css'
                })
            ]
```

运行`npm run build`打包，看看打包后的文件长什么样子：

![](/images/jueJin/fe39ec8d6312412.png)

可以看到，每个文件的hash值都不一样，每个文件的hash值都是根据自身的内容去生成的，那我们现在修改一下`main.css`：

```js
    .title {
    // pink 修改为 blue
    color: blue;
}
```

重新打包看看：

![](/images/jueJin/043aa7cea727466.png)

可以看出，`main.css`修改后只会影响`main.css`得hash值，也就是自己的hash值

> 结论：当规则为`contenthash`时，每个文件的hash值都是根据自身内容而生成，当某个文件内容修改时，打包后只会修改其本身的hash值，不会影响其他文件的hash值 ![](/images/jueJin/d54161567a4b4f1.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/2d1d43ebae0c47c.png)