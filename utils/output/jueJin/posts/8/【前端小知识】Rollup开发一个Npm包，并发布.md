---
author: "Sunshine_Lin"
title: "【前端小知识】Rollup开发一个Npm包，并发布"
date: 2023-08-06
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 背景 前几天老大说现在团队中很多冗余代码，而其中一部分就表现在，很多项目都重复写了一些一模一样的工具"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:55,views:3207,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/793d42e704ef435.png)

背景
--

前几天老大说现在团队中很多冗余代码，而其中一部分就表现在，很多项目都重复写了一些一模一样的工具函数，比如：

*   公司内部加密函数
*   公司内部的权限校验函数
*   公司内部的单点登录封装函数
*   等等。。。。

其实这些函数在每一个项目中都是一模一样的，没必要每一个项目都写一遍，这种做法有很多坏处

*   代码冗余
*   不好维护，函数一改，就所有项目都需要一起改

由于我们公司项目不是采用 Monorepo 的方式去管理的，所以现阶段比较好的办法就是写一个工具库包，发布到私有 npm 仓库上，然后在每一个项目中去安装使用即可~ 这样好处有

*   减少了每个项目中的代码冗余
*   好维护，逻辑只需要改一处，然后改版本号重新发包即可

类比
--

在日常的开发中，我们会使用到很多很多的包，比如我们想要使用 `lodash` 只需要在终端里输入

```js
npm i lodash -D
```

然后我们就会在 `node_modules`中看到这个包，并且可以去使用它~

![](/images/jueJin/604c94996aeb470.png)

```js
import { cloneDeep } from 'lodash'

const obj1 = {};
const obj2 = cloneDeep(obj1)
```

这些包长啥样？
-------

我们打开 `node_modules` 中的 `lodash` 发现，里面其实都是打包后的产物，也就是开发 lodash 的开发者，编写一些例如 `ts、ES6` 语法的代码后，进行 `打包后` 发布到 `npm` 上，我们才可以通过 `npm i lodash` 去安装它~

![](/images/jueJin/85cdcae7d2bc43a.png)

那为啥要 `打包后` 才发布到 `npm` 上呢？这是因为

*   需要把 `ts、ES6` 这些比较新语法转换成 `ES5` 的旧语法
*   需要对代码进行压缩后再发布，这样体积会比较小一些

Webpack or Rollup？
------------------

大部分的前端开发者接触到的打包工具都是 `Webpack`，而很少接触到 `Rollup`，我可以给大家简单讲讲这两者有什么区别~

### Webpack

`Webpack`主要用于构建复杂的前端项目。他能做以下这些事情：

*   支持将多种资源（如JavaScript、CSS、图片等）视为模块，并通过模块依赖关系进行打包
*   提供了丰富的插件和加载器，能够处理各种复杂的场景，如代码分割、懒加载、热模块替换等
*   它还支持开发环境和生产环境的不同配置，使得项目开发和部署更加方便

由于 `Webpack` 的灵活性和丰富的功能，它适用于大型、复杂的项目，特别是那些包含大量模块和资源、有复杂构建需求的项目

### Rollup

`Rollup`是一个面向现代JavaScript应用的模块打包工具，专注于创建用于库和类似库的打包。具备以下这些特点：

*   采用ES模块作为标准，可以按需引入和打包代码，并且能够进行 `Tree Shaking`，去除未使用的代码，减小输出文件大小
*   相对于 `Webpack`，`Rollup` 更加轻量级和简单，它不提供像Webpack那样丰富的插件和加载器生态系统，但它的输出更精简

### 小结

*   `Webpack` 适合用在项目中
*   `Rollup` 适用于开发一些工具库、组件库

所以我们开发工具库是推荐使用 `Rollup` 来开发

开发自己的工具库
--------

### 初始项目

首先新建一个 `npm-sx-test` 的文件夹，用来开发我们的工具库

> 名字可以自己定~

然后进入到 `npm-sx-test` 中，运行

```js
npm init
```

初始化一个 npm 的环境~

```js
    {
    name: 'npm-sx-test', // 包名
    main: 'index.js', // 包被引入时的入口文件
    type: "module", // 代码可以使用 ES6 模块化
    version: 1.0.0, // 版本
    description: '', // 描述
    author: 'zh', // 作者
    contributors: '', // 其他贡献者
    dependencies: {}, // 生产依赖
    devDependencies: {}, // 开发依赖
    repository：'', // 源码地址
    keywords: [], // 包搜索关键字
}
```

接着在根目录下，创建一个入口文件 `index.js` 以及一个 `utils` 文件夹

*   **index.js** 用来统一导出所有工具函数
*   **utils** 用来存放各种工具函数

![](/images/jueJin/c759df70c4014b4.png)

```js
// permission.js
    export const checkPermission = (role) => {
    // coding...
    return role
}
// crypto.js
    export const crypto = (password) => {
    // coding...
    return password
}
// sso.js
    export const sso = (username) => {
    // coding...
    return username
}
// index.js
import { crypto } from './utils/crypto'
import { checkPermission } from './utils/permission'
import { sso } from './utils/sso'

    export default {
    crypto,
    checkPermission,
    sso
}
```

### 配置 Rollup & Babel 打包环境

代码写完后，我们需要将他们打包，还记得我们上面说了为啥要打包后再发布？

*   1、需要把 `ts、ES6` 这些比较新语法转换成 `ES5` 的旧语法
*   2、需要对代码进行压缩后再发布，这样体积会比较小一些

我们需要先安装这些必要的插件

```js
npm i @babel/preset-env
@rollup/plugin-babel
rollup
```

接着创建一个 `rollup.config.js` 用来存放 `Rollup` 打包的配置

```js
// rollup.config.js
import babel from '@rollup/plugin-babel';

    export default {
    input: 'index.js', // 入口文件
        output: [
            {
            file: './es/index.js',
            format: 'esm',  // 将软件包保存为 ES 模块文件
            name: 'cssModuleVue'
            },
                {
                file: './dist/index.js',
                format: 'cjs',  // CommonJS，适用于 Node 和 Browserify/Webpack
                name: 'cssModuleVue',
                exports: 'default'
            }
            ],
            watch: {  // 配置监听处理
            exclude: 'node_modules/**'
            },
                plugins: [
                // 使用插件 @rollup/plugin-babel
                    babel({
                    babelHelpers: 'bundled',
                    exclude: 'node_modules/**'
                    })
                ]
                };
```

然后新建一个 `babel.config.js` 用来配置 `Babel` ，它可以帮我们把一些高级语法转成低级语法

```js
// babel.config.js
    {
        "presets": [
            [
            "@babel/preset-env",
                {
                "modules": false
            }
        ]
    ]
}

```

### 配置打包命令

现在我们可以配置打包命令了，在 `package.json` 中，配置命令

```js
    "scripts": {
    "build": "rollup -c",
    "serve": "rollup -c -w"
}
```

*   **\-c**：代表读取配置去打包，默认读取根目录下的`babel.config.js`
*   **\-w**：代表了 watch 监听，调试的时候可以用~

运行 `npm run build` 之后，我们可以看到打包成两个版本

*   dist：产物是 Commonjs 模块化
*   es：产物是 ES6 模块化

![](/images/jueJin/4af8f05baec34de.png)

![](/images/jueJin/3cbcd482c18b4e7.png)

### 发布 NPM 包

首先我们需要把 NPM 的源设置成你想要的，一般都是设置为公司的私有仓库地址，但是这里我设置为公共仓库~

```js
npm config set registry https://registry.npmjs.org/
```

接着我们需要登录 NPM ，进行身份认证~

```js
npm login
```

需要填写这些信息

*   username：npm 的用户名
*   password：npm 的密码
*   email： npm 注册的邮箱
*   one-time password：邮箱接收的验证码

![](/images/jueJin/50ea2be7b6714fa.png)

最后修改一下 `package.json`里

```js
改 "main": "dist/index.js",
去掉 "type": "module",
    加上 "files": [
    "es/*",
    "dist/*"
    ],
```

*   修改 main 是为了我们使用这个包时引用到 dist 里的文件
*   修改 files 是为了推送 npm 只推送所需要的文件上去就行

然后运行 `npm publish`，就会将打包后的产物推送到 npm 上了~

![](/images/jueJin/a8ff17f8c099490.png)

使用函数库
-----

现在回到各个项目中，只需要

```js
npm i npm-sx-test
```

就可以使用我们自己的组件库啦~

```js
import { checkPermission } from 'npm-sx-test'

console.log(checkPermission('admin'))
```

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/d2416f4483ff44f.png)