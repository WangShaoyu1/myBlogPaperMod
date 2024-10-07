---
author: "Phil_Hu"
title: "前端项目搭建部署全流程（一）：搭建React项目"
date: 2020-11-25
description: "前段时间突发一个想法，想尝试从零开始搭建一个React项目模板，发布到GitHub，再编写脚手架命令拉取模板以及编写脚本命令快速生成业务模块，然后再用这个模板结合之前的一套组件库，完成编译打包运行一些列操作，再就是另外一个大事，用基于这个项目模板与组件库构建的项目，搭建自动化构…"
tags: ["React.js"]
ShowReadingTime: "阅读4分钟"
weight: 977
---
1.前言
----

前段时间突发一个想法，想尝试从零开始搭建一个React项目模板，发布到GitHub，再编写脚手架命令拉取模板以及编写脚本命令快速生成业务模块，然后再用这个模板结合之前的一套组件库，完成编译打包运行一些列操作，再就是另外一个大事，用基于这个项目模板与组件库构建的项目，搭建自动化构建与自动化部署整个流程，将连载文章记录整个这个流程，以便后期回溯。

2.初始化项目
-------

新建项目文件然后执行命令，`-y` 需要选择的地方默认是yes，执行完后会生成个`package.json`文件

bash

 代码解读

复制代码

`npm init -y`

3.初始化typeScript配置
-----------------

执行完命令后会生成`tsconfig.json`文件，文件中会有全属性的配置与描述，在结合自己的需求配置使用，因`tsconfig.json`篇幅太长只留了我的一些配置项

bash

 代码解读

复制代码

`yarn add typescript -g tsc init`

json

 代码解读

复制代码

`{   "compilerOptions": {     /* Visit https://aka.ms/tsconfig.json to read more about this file */     /* Basic Options */     "target": "ES2016",                       /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */     "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */     "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */     /* Strict Type-Checking Options */     "strict": true,                           /* Enable all strict type-checking options. */     "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of      /* Advanced Options */     "skipLibCheck": true,                     /* Skip type checking of declaration files. */     "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */   } }`

4.配置react
---------

#### 4.1.安装依赖

sql

 代码解读

复制代码

`yarn add react react-dom react-router-dom yarn add @types/react @types/react-dom @types/react-router-dom --dev`

#### 4.2.新建html模板

新建`public`目录下新建`index.html`

html

 代码解读

复制代码

`<!--public/index.html--> <!DOCTYPE html> <html lang="zh-CN">   <head>     <meta charset="utf-8" />     <link rel="icon" href="favicon" />     <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />     <title>React App</title>   </head>   <body>     <div id="root"></div>   </body> </html>`

#### 4.3.新建工程入口文件

新建`src`目录下新建`App.tsx`与`index.tsx`

js

 代码解读

复制代码

`// App.tsx import React from 'react'; const App = () => {   return <div>buildDemo</div>; }; export default App; // index.tsx import App from './App'; import ReactDom from 'react-dom'; import React from 'react'; ReactDom.render(<App />, document.querySelector('#root'));`

5.配置webpack
-----------

#### 5.1.安装webpack依赖（webpack版本5.x）

bash

 代码解读

复制代码

`yarn add webpack webpack-cli webpack-merge html-webpack-plugin@next clean-webpack-plugin --dev`

#### 5.2.依赖包说明

`html-webpack-plugin@next` wepack 5需要安装5.x版本的`html-webpack-plugin`官网要求，具体[启动](#%E5%90%AF%E5%8A%A8 "#%E5%90%AF%E5%8A%A8")会有说明

`clean-webpack-plugin` 清除打包目录的插件

#### 5.3.新建webpack配置

新建`config`文件存放webpack的配置文件：

*   `webpack.config.base.js` webpack基本配置
*   `webpack.config.dev.js` webpack开发环境配置
*   `webpack.config.prod.js` webpack生产环境配置

js

 代码解读

复制代码

`// webpack.config.base.js // 加上type在配置时会有提示 /**  * @type {import('webpack').Configuration}  */ module.exports = { 	entry: path.resolve(__dirname, '../src/index.tsx'), 	output: { 		filename: '[name].[hash].js', 		path: path.resolve(__dirname, '../dist'), 	}, 	resolve: { 		extensions: ['.ts', '.tsx', '.js', '.jsx'], 	}, 	plugins: [ 		new HtmlWebpackPlugin({ 			filename: 'index.html', 			template: path.resolve(__dirname, '../publich/index.html'), 			favicon: path.resolve(__dirname, '../publich/favicon.ico'), 			hash: true, 		}),         new CleanWebpackPlugin({ 			dry: false, 			cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')], 		}), 	], };`

js

 代码解读

复制代码

`// webpack.config.dev.js /**  * @type {import('webpack').WebpackOptionsNormalized}  */ const devConfig = { 	mode: 'development', }; module.exports = webpackMerge.merge(baseConfig, devConfig);`

js

 代码解读

复制代码

`// webpack.config.prod.js /**  * @type {import('webpack').Configuration}  */ const prodConfig = { 	mode: 'production', }; module.exports = webpackMerge(baseConfig, prodConfig);`

6.配置babel
---------

#### 6.1.安装依赖（babel版本7.x）

bash

 代码解读

复制代码

`yarn add babel-loader babel-plugin-import @babel/cli @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript --dev`

#### 6.2.依赖包说明

`babel-loader` 官网解释是文件预处理器，其实就是webpack处理静态文件的时候，需要各种loader来加载文件

`babel-plugin-import` 可以针对antd，antd-mobile，lodash等库进行按需加载

`@babel/cli` 内置的CLI命令行工具

`@babel/core` 需要调用babel的api进行转码，就要使用该模块

`@babel/preset-env` 是一个灵活的预设，你可以无需管理目标环境需要的语法转换或浏览器`polyfill`，就可以使用最新的 JavaScript

`@babel/preset-react` react预设

`@babel/preset-typescript` typescript预设

#### 6.3.创建babel.config.js文件

js

 代码解读

复制代码

`// type 编写时会有提示 /**  * @type {import('@babel/core').TransformOptions}  */ module.exports = { 	presets: [ 		[ 			'@babel/env', 			{ 				useBuiltIns: 'usage', 				corejs: 3, 			}, 		], 		'@babel/preset-react', 		'@babel/preset-typescript', 	], };`

`webpack.config.base.js`中添加module配置

js

 代码解读

复制代码

`/**  * @type {import('webpack').Configuration}  */ module.exports = { 	... 	module: { 		rules: [ 			{ 				test: /\.(js|ts)x?$/, 				exclude: /(node_modules)/, 				use: { 					loader: 'babel-loader', 				}, 			}, 		], 	}, };`

7.配置开发服务器
---------

bash

 代码解读

复制代码

`yarn add webpack-dev-server --dev`

`webpack.config.dev.js`添加如下配置

js

 代码解读

复制代码

`/**  * @type {import('webpack-dev-server').Configuration}  */ const devServer = { 	port: 3000, 	host: 'localhost', 	contentBase: path.join(__dirname, '../publich'), 	watchContentBase: true, 	publicPath: '/', 	compress: true, 	historyApiFallback: true, 	hot: true, 	clientLogLevel: 'error', 	// open: true, 	watchOptions: { 		ignored: /node_modules/, 	}, }; /**  * @type {import('webpack').WebpackOptionsNormalized}  */ const devConfig = { 	mode: 'development', 	devServer: devServer, }; module.exports = webpackMerge.merge(baseConfig, devConfig);`

`package.json`中添加启动命令

json

 代码解读

复制代码

`"scripts": { 	"start": "webpack serve --config ./config/webpack.config.dev.js" },`

8.启动
----

#### 8.1.Error: Cannot find module 'webpack-cli/bin/config-yargs'

`webpack-dev-server` 启动过程中，如果`webpack-cli`版本是4，则会报该错误

_解决方案有两种：_

1.  修改命令`"start": "webpack serve --config ./config/webpack.config.dev.js"`
2.  降低`webpack-cli`的版本到3

再次启动抛出这个问题，排查是因为`webpack.config.base.js`中`resolve中extensions`未关联`.js,.jsx` ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c4a8b5f6e7940b69ab1d052937a24ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 8.2.Error：Uglify SyntaxError: Unexpected token: punc ())

当使用`UglifyJs`压缩时，出现这个错误，查阅相关资料是`ES6`语法压缩问题 ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7642c75ae6644a57a0c21173021b90f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

\*解决方案：\*把`UglifyJs`移到`webpack.optimization.minimizer`中

参考文献：[stackoverflow.com/questions/4…](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F42375468%2Fuglify-syntaxerror-unexpected-token-punc "https://stackoverflow.com/questions/42375468/uglify-syntaxerror-unexpected-token-punc")

#### 8.3.Error：Failed to decode param '/%PUBLIC\_URL%/favicon.ico

出现这个问题的原因是我自己下载的依赖包没有关注版本

_解决方案：_

1.  查阅`html-webpack-plugin`是`webpack5`要使用这个版本的plugin`"html-webpack-plugin": "^5.0.0-alpha.14",`
2.  还一种解决方案就是回退`webpack`到4然后用`InterpolateHtmlPlugin`替换`/%PUBLIC_URL%/`

9.参考资料
------

[juejin.cn/post/684490…](https://juejin.cn/post/6844904192658636808 "https://juejin.cn/post/6844904192658636808")

第一次记录写文章，文笔有限，多多包涵，ヾ(_´ー\`_)ﾉ゛谢谢♪