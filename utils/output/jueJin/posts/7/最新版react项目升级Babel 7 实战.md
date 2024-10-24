---
author: "Gaby"
title: "最新版react项目升级Babel 7 实战"
date: 2021-09-30
description: "项目中一些有特殊需求，要自己配置 webpack 或其他方面配置比较灵活的项目，由于很多库都有了大版本的升级，之前教程也都过时了，会有些兼容性的问题，再次重新梳理搭建一个适合当下的 React 环境。"
tags: ["JavaScript","React.js","Babel中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:7,views:2484,"
---
小知识，大挑战！本文正在参与“[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")”创作活动。

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

* * *

适合一些有特殊需求，要自己配置 webpack 或其他方面配置比较灵活的项目，由于很多库都有了大版本的升级，之前教程也都过时了，会有些兼容性的问题，再次重新梳理搭建一个适合当下的 React 环境。

> “你从头读，尽量往下读，直到你一窍不通时，再从头开始，这样坚持往下读，直到你完全读懂为止。”

1-从0-1搭建React项目工程架构  
​ 2-React技术栈：React  
​ 3-硬件：Mac  
​ 4-环境:node.js v12+  
​ 5-构建:webpack

> 关于安装方式 可以使用 `npm`、`cnpm`、`yarn`，几种形式均可

你可以使用定制的 [cnpm](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcnpm%2Fcnpm "https://github.com/cnpm/cnpm") (gzip 压缩支持) 命令行工具代替默认的 `npm`:

```ini
$ npm install -g cnpm --registry=https://registry.npmmirror.com
```

[淘宝镜像地址](https://link.juejin.cn?target=https%3A%2F%2Fnpmmirror.com%2F "https://npmmirror.com/")

### 初始化package.json

创建项目文件夹，并进入到项目根目录

```js
$ mkdir react && cd react
```

在项目的根目录下打开命令行，输入以下命令，当然你也可以使用 `yarn` 命令：

```js
// 跳过询问直接生成 package.json
$ npm init -y
// 或者 按照询问进行配置基本信息后生成 package.json
$ npm init
```

![image.png](/images/jueJin/2da0a87022e642d.png)

### 安装 React

安装 react 相关

```js
$ npm install react react-dom --save
```

![image.png](/images/jueJin/11db365519ed400.png)

虽然已经安装了 React 的包，但是还不能进行访问，还需要安装转译包

这里我们先创建好入口文件和组件备用 在根目录创建文件夹 src，并创建 index.js 以及 App.js，两个文件

![image.png](/images/jueJin/af5091200e5043b.png)

`src/index.js` 入口文件内容：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
<App />,
document.getElementById('root')
)
```

`src/App.js` 组件文件内容：

```js
import React, { Component } from 'react'

    class App extends Component {
        render() {
        return (
        <div>
        <h1>Welcome to React App</h1>
        </div>
        )
    }
}

export default App;
```

创建 html 文件，路径 public/index.html 该路径后续要同 webpack.config.js 中的路径保持一致

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>My React Boilerplate</title>
</head>
<body>
<div id="root"></div>
</body>
</html>
```

![image.png](/images/jueJin/5be65b5da32c459.png)

在项目中要使用JSX语法：

什么是JSX语法：就是符合XML规范的js语法。（语法格式相对于html严谨很多）

启用JSX语法需要编译，就需要安装 babel 和 webpack

### 安装 babel

Babel可以说是目前前端工程中必备的一款工具链（除非你还在用ES6以前的语法），主要用于在旧的浏览器或环境中将 ECMAScript 2015+ 代码转换为向后兼容版本的JavaScript代码。Babel 7 已于2018年8月份正式发布，其中更新了很多的用法和内容，使得几乎要重新安装NPM包和配置Babel文件。

在Babel 7中，最重要的升级之一就是将所有的packages改为了scoped packages，这将有效的避免重名或者名称被抢注的问题，而且在命名上就与普通的社区packages区别开来，更加的清晰。所以我们将原先安装的Babel核心包 **babel-core** 改为 **@babel/core**

babel 是js的编译器 解析为兼容性的js代码，由于 Babel已经升级到 `Babel 7.X`，而之前的教程都是使用的 `Babel 6.X`已经逐渐被替代，所以这里也更新到了 `Babel 7.X`

最新版本的 `babel` 舍弃了以前的 `babel--`的命名方式，改成了 `@babel/-`  
`stage-x` 已经被启用，`babel 7.X`版本已经不建议再使用，所以在开发过程中需要把 `babel-preset-stage-x`卸载

babel升级之后，不再使用以前的 `babel-core` ,而是将其放在@babel/core,同时 `babel-loader` 也要升级到最新版本。

`@babel/preset-react` 转换 JSX 为函数

`@babel/preset-env` 是一种智能预设，它允许您使用最新的JavaScript，而无需微观管理目标环境需要哪些语法转换(以及可选的浏览器多填充)。这既让您的生活更轻松，又使JavaScript包更小！

`@babel/preset-flow` 如果您使用了 [Flow](https://link.juejin.cn?target=https%3A%2F%2Fflow.org%2Fen%2Fdocs%2Fgetting-started%2F "https://flow.org/en/docs/getting-started/")，则建议您使用此预设（preset）。Flow 是一个针对 JavaScript 代码的静态类型检查器。

```js
$ npm install core-js @babel/core @babel/preset-env @babel/preset-react @babel/register babel-loader @babel/plugin-transform-runtime --save-dev
```

![image.png](/images/jueJin/5a3d8ef606444ce.png)

```js
$ npm install @babel/polyfill @babel/runtime --save
```

![image.png](/images/jueJin/bf4f351593e2431.png)

我们项目中的Babel配置文件放在了 **.babelrc** 文件中，Babel官方如是说：

> You want to programmatically create the configuration? You want to compile node\_modules? [`babel.config.js`](https://link.juejin.im/?target=https%3A%2F%2Fbabel.docschina.org%2Fdocs%2Fen%2Fconfiguration%23babelconfigjs "https://link.juejin.im/?target=https%3A%2F%2Fbabel.docschina.org%2Fdocs%2Fen%2Fconfiguration%23babelconfigjs") is for you! You have a static configuration that only applies to your simple single package? [`.babelrc`](https://link.juejin.im/?target=https%3A%2F%2Fbabel.docschina.org%2Fdocs%2Fen%2Fconfiguration%23babelrc "https://link.juejin.im/?target=https%3A%2F%2Fbabel.docschina.org%2Fdocs%2Fen%2Fconfiguration%23babelrc") is for you!

大致意思就是如果你的配置文件很简单，那么使用.babelrc就可以了，但是如果你想要更加灵活的动态配置项，那么使用babel.config.js更加合适。

添加一个配置文件 `.babelrc`,进行如下配置：

```json
    {
        "presets" : [
        "@babel/preset-env" ,
        "@babel/preset-react"
        ],
            "plugins" : [
            "@babel/plugin-transform-runtime"
        ]
    }
```

### 安装 webpack

可能有的小伙伴会看下如下命令，但这里不推荐如此安装，因为 webpack-command 已不被官方所推荐，具体原因继续往下看。

```js
// 注意：不要执行该命令
$ npm install webpack webpack-cli webpack-command --save-dev
```

**关于 [webpack-command](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebpack-command "https://www.npmjs.com/package/webpack-command")**

2018.2.25，webpack 4.0.0 正式发布，[该版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack%2Freleases%2Ftag%2Fv4.0.0 "https://github.com/webpack/webpack/releases/tag/v4.0.0")将 webpack 命令行代码迁移到 [webpack-cli](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack-cli "https://github.com/webpack/webpack-cli")。

但让人意外的是，webpack 4.0.0 正式发布那天，就又出来一个极其类似的项目 [webpack-command](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fwebpack-command "https://github.com/webpack-contrib/webpack-command")，而且官方最近宣称它将[取代 webpack-cli 项目](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fwebpack%2Funladen-swallows-and-the-deprecation-of-webpack-cli-39814f6694d3 "https://medium.com/webpack/unladen-swallows-and-the-deprecation-of-webpack-cli-39814f6694d3")：

> 2018 年 6 月底用户安装 webpack-cli 时将被重定向到 webpack-command，等 webpack 5 正式发布，webpack-cli 将被废弃。

事情有变：webpack-command 作者称 webpack 项目带头人不支持 webpack-cli 迁移到 webpack-command 的计划。

目前为止，webpack 命令[不再推荐 webpack-command](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack%2Fpull%2F7966 "https://github.com/webpack/webpack/pull/7966")。

> 注意： webpack-command 现在在[这个 fork](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshellscape%2Fwebpack-command "https://github.com/shellscape/webpack-command")上维护，并且将向喜欢这个 CLI 的用户开放 Pull Requests 和 Issues。webpack-contrib 组织已选择放弃对该模块的支持，并且不再积极维护它。  
> Note: webpack-command is now being maintained on [this fork](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshellscape%2Fwebpack-command "https://github.com/shellscape/webpack-command"), and will be open to Pull Requests and Issues for users that prefer this CLI. The webpack-contrib org has chosen to drop support for this module and is no longer actively maintaining it.

所以最终结论还是使用 `webpack-cli`

```js
$ npm install webpack webpack-cli --save-dev
```

![image.png](/images/jueJin/45bc170821ea450.png)

安装webpack 服务器 webpack-dev-server,让启动更方便

```js
$ npm install webpack-dev-server --save-dev
```

![image.png](/images/jueJin/18336ee869d8459.png)

自动创建html文件 html-webpack-plugin

```js
$ npm install html-webpack-plugin --save-dev
```

![image.png](/images/jueJin/8dbd7a29fc58482.png)

### 配置 webpack

webpack.config.js 配置文件：

```js
const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin") // 导入 在内存中自动生成html文件 的插件

// 创建一个插件的实例对象
    const htmlPlugin = new htmlWebpackPlugin({
    template: path.join(__dirname, "./public/index.html"), // 源文件
    filename: "index.html" // 生成的 内存中首页的 名称
    })
    
    // 向外暴露一个打包的实例对象，因为webpack是基于Node构建的，所以webpack支持所有Node API和语法
    // webpack 默认只能打包处理.js后缀名类型的文件，想.vue .png无法主动处理，所以要配置第三方的loader
    
    //无关代码没有写
        module.exports = {
        mode: 'development', // development 或 production
        //无关代码......
        module: {//所有第三方模块的配置  规则
        rules : [//第三方匹配规则
            {
            test : /\.js|jsx$/,//默认 .js 文件。但是也写了 jsx 文件
            use : ['babel-loader'],
            exclude : /node_modules/ //不要忘记添加 exclude 排除项
        }
    ]
    },
        plugins: [
        htmlPlugin
    ]
}
```

### 启动项目

在 package.json 中添加启动命令，并执行 `npm run dev` 进行启动

```json
    {
        "scripts": {
        "dev": "webpack-dev-server --open --mode development"
        },
    }
    
```

启动命令

```js
$ npm run dev
```

![image.png](/images/jueJin/830cde94a0374b6.png)

![image.png](/images/jueJin/99fb4a3a25d44e0.png)

显得以上页面则启动成功！

### 其他配置

接下来就可以自行配置 router、redux、sass、axios 等常用库了

* * *

华丽丽的的结束分割线

文章看完了，但还有一件事需要做，点赞、关注 + 收藏 ， 据说做完这件事的人，运气都不错哦！