---
author: "Vam的金豆之路"
title: "正式发布一款可cmd命令安装的React.js项目脚手架——FastReactApp"
date: 2021-04-24
description: "前言今天，篇幅可能比较短，主要介绍最近这段时间开发的一款脚手架——FastReactApp。这是一款基于Parcel2开发的React.js项目脚手架。虽然比不上正在前端界火爆的Vite以及占据稳"
tags: ["React.js"]
ShowReadingTime: "阅读6分钟"
weight: 936
---
前言
--

今天，篇幅可能比较短，主要介绍最近这段时间开发的一款脚手架——**FastReactApp**。这是一款基于Parcel2 开发的React.js项目脚手架。虽然比不上正在前端界火爆的Vite以及占据稳定地位的CreateReactApp，但是基本的项目开发还是可以的。

下面我将介绍**FastReactApp**几点特征：

*   对JS、CSS、HTML、文件资产等的现成支持—不需要插件。
*   使用`dynamic import()`语法，它分割输出包，以便您只在初始加载时加载所需的内容。
*   当您在开发过程中进行更改时，它会自动更新浏览器中的模块，无需配置。
*   它使用工作进程来支持多核编译，并且有一个文件系统缓存，即使在重新启动后也可以快速重建。
*   现在生成树震动包的源映射，并在引用未知符号时显示友好的错误消息。
*   它对`React Fast Refresh`有一流的支持。它（在大多数情况下）能够在重新加载之间保持状态（即使在发生错误之后）。

我们定义**FastReactApp**这个名字，你会看到`Fast`这个单词，中文意思是“快”，那到底有多快呢？我们来检验一下。

我们先来看下初始化时安装依赖需要多长时间。

![截屏2021-04-24 19.26.22.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d23bb6f058f740b1bb5229da9377fa5b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

仅仅使用了**4.80s**。

那么，我们接下来看下热重载的时间。

![截屏2021-04-24 20.15.28.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e342ce31c6cc4f56b62862a19148ca87~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

也仅仅使用了**499ms**，是不是觉得特别快。

这全仅仅是Parcel2 的功劳，它使用工作进程来支持多核编译，并且有一个文件系统缓存，即使在重新启动后也可以快速重建。另外，使用`dynamic import()`语法，分割输出包。

以下是Parcel2的官方网址，你可以查看它其他特性。

arduino

 代码解读

复制代码

`https://v2.parceljs.org/`

搭建FastReactApp项目
----------------

我们首先需要安装**FastReactApp**，这里你需要全局安装一个为**FastReactApp**而生的命令脚手架**FastReactCli**，它可以更快地为你生成一个**FastReactApp**项目。

在安装之前，你需要确保你的Node版本>=12.0.0。

### 全局安装

shell

 代码解读

复制代码

`npm install fast-react-cli -g`

### 初始化项目

shell

 代码解读

复制代码

`fast-react-cli init <projectName>`

例：这里，我初始化一个名称为**myreact2**的项目，选择`fast-react-app@1.0.1`项目模板。

![截屏2021-04-24 20.38.01.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd1c119fe604c1797635c0d1608a942~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后回车，项目初始化完成。

![截屏2021-04-24 20.54.42.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7592eb15bc604afb8b70d6688f87ed2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 检测版本

shell

 代码解读

复制代码

`fast-react-cli -v`

我们目前`fast-react-cli`最新版本是1.1.7。

![截屏2021-04-24 20.56.51.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c31f4b4477424287a4bf2debcac8f038~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 安装项目依赖

我们使用`fast-react-cli`安装上了**FastReactApp**，我们下一步需要安装项目的依赖。 在安装之前，你需要注意以下几点：

如果你的项目需要引入图片，你需要使用`@parcel/transformer-image`依赖，它可以调整图像的大小、更改图像的格式和质量。为了完成这些图像转换，它依赖于图像转换库`Sharp`，因此，需要将几个特定的文件导入NPM缓存路径下的特定文件夹中。

1.  获取文件

打开网址：

ruby

 代码解读

复制代码

`https://github.com/lovell/sharp-libvips/`

找到两个与您的计算机环境匹配的文件，以下是两个文件，xxx代表计算机环境。

markdown

 代码解读

复制代码

`1. libvips-8.9.0-xxx.tar.gz 2. libvips-8.10.5-xxx.tar.br`

`darwin-x64` 一般指Mac OS环境，`win32-x64` 一般指 Windows环境。

2.  查找文件夹

键入以下命令以获取NPM缓存路径：

shell

 代码解读

复制代码

`npm config get cache`

获得路径后，在此`_libvips`这个文件夹，将符合你计算机环境的两个文件放入这个文件夹内。

至此大功告成。

如果你的项目不引入图片，你可以不用看以上内容。另外，你需要把`package.json`文件中的`"devDependencies"`属性内的`@parcel/transformer-image`依赖删除掉，还有项目中默认会引入图片，把相应引入图片地址的代码段删除掉即可，因为这个依赖默认是安装的。

我们默认我们项目需要它，然后我们也做完了以上需要注意的工作。那么，现在就可以安装依赖了。

shell

 代码解读

复制代码

`npm install`

![截屏2021-04-24 21.31.08.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e744cab28e8d422bbe97a3d3412f0ee0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 运行项目

shell

 代码解读

复制代码

`npm run serve`

![截屏2021-04-24 21.32.17.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dc5876d5ae14dca95d41a093b731225~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这里需要声明一点，项目默认安装了`mocker-api`，`mocker-api` 为 `REST API` 创建模拟 API。 当您尝试在没有实际 `REST API` 服务器的情况下测试应用程序时，它会很有用。所以，使用`concurrently`并行地运行多个命令（同时跑前端和后端的服务）。这里的`mocker-api`只有在开发环境中适用。

项目默认端口号为：**3000**，当然你也可以在`package.json`文件中修改默认配置。

json

 代码解读

复制代码

  `"scripts": {     "start": "parcel ./public/index.html --port 3000 --no-source-maps",     "build": "parcel build ./public/index.html --no-source-maps",     "api": "mocker ./mock/mocker.js",     "serve": "concurrently \"yarn api\" \"yarn start\""   },`

`--port 3000`这里你可以修改端口，这行命令配置是基于Parcel 2，更多配置可以参考：

bash

 代码解读

复制代码

`https://v2.parceljs.org/features/cli/`

我们在浏览器上输入`http://localhost:3000/`。

![截屏2021-04-24 21.43.39.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97c83b908c43498da6a19fad2aa84033~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

项目成功启动。

### 发布项目

shell

 代码解读

复制代码

`npm run build`

将用于生产的应用程序生成到**buildDir**文件夹。它在生产模式下正确地进行反应，并优化构建以获得最佳性能。构建被缩小，文件名包含哈希。

你的应用程序已准备好部署。

FastReactApp资源
--------------

介绍完如果搭建项目了，下面，我们来看下**FastReactApp**给我们默认安装了那些资源依赖。

*   `parcel`
*   `concurrently`
*   `mocker-api`
*   `eslint`
*   `babel-plugin-import`
*   `antd`
*   `axios`
*   `immutable`
*   `react`
*   `react-dom`
*   `react-redux`
*   `react-router`
*   `react-router-dom`
*   `redux`
*   `redux-immutable`
*   `redux-thunk`
*   `styled-components`
*   `web-vitals`

前三项我们已经之前介绍过了，这里就不再复述了，下面，我们将挑几个代表性的资源依赖介绍下。

`eslint`可谓是现代前端开发过程中必备的工具了。其用法简单，作用却很大，使用过程中不知曾帮我减少过多少次可能的 bug。其实仔细想想前端开发过程中的必备工具似乎也没有那么多，ESLint 做为必备之一，值得深挖，理解其工作原理。

`babel-plugin-import`是一款babel插件,在编译过程中将import的写法自动转换成按需引入的方式。

`antd`是基于Ant Design 设计体系的 React UI 组件库,用于研发企业级中后台产品。Ant Design 2.0官网上有两句耐人寻味的话，我特别喜欢。

> “Ant Design 无法保证业务产品能否成功，但是能帮助业务产品『正确的成功』或者『正确的失败』。”
> 
> “Ant Design 不但追求『用户』的使用体验，还追求『设计者』和『开发者』的使用体验。”

`immutable`对象是不可直接赋值的对象，它可以有效的避免错误赋值的问题。在react中，`immutable`主要是防止`state`对象被错误赋值。在`Rudux`中因为深拷贝对性能的消耗太大了（用到了递归，逐层拷贝每个节点）。但当你使用`immutable`数据的时候：只会拷贝你改变的节点，从而达到了节省性能。`immutable`的不可变性让纯函数更强大，每次都返回新的`immutable`的特性让程序员可以对其进行链式操作，用起来更方便。

`styled-components`有以下几点：1、样式写在 js 文件里，降低 js 对 css 文件的依赖。 2、样式可以使用变量，更加灵活。 3、使用方便，不需要配置 webpack、开箱即用。可以说做到了”All in js“。

`web-vitals`库是一个小型（约1K）模块化库，用于测量真实用户的所有web vitals指标，精确匹配Chrome对这些指标的测量方式，并报告给其他Google工具（例如Chrome用户体验报告、页面速度洞察、搜索控制台的速度报告）。

结语
--

**FastReactApp**官方文档网址：

ruby

 代码解读

复制代码

`https://www.maomin.club/site/fastReactApp/`

![截屏2021-04-24 22.18.48.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c04db107f1224a16835b57c264fe5115~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)