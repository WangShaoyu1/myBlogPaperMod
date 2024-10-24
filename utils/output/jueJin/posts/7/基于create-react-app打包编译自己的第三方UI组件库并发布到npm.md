---
author: "徐小夕"
title: "基于create-react-app打包编译自己的第三方UI组件库并发布到npm"
date: 2019-10-22
description: "这篇文章主要是总结一下我们在工作中如何为公司开发内部的第三方UI组件，并通过npm install的方式安装的一些步骤和思路。在学习完这套发布方法后大家也可以快速的发布自己的UI库到npm，供他人使用，就比如elementUI或者Ant Design。 此时我们就可以用npm …"
tags: ["React.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:37,comments:0,collects:31,views:6719,"
---
### 前言

这篇文章主要是总结一下我们在工作中如何为公司开发内部的第三方UI组件，并通过npm install的方式安装的一些步骤和思路。在学习完这套发布方法后大家也可以快速的发布自己的UI库到npm，供他人使用，就比如elementUI或者Ant Design。

如果想学习如何发布一个js库或者框架，那么使用rollup更为适合，可以参考如下文章：

[前端组件/库打包利器rollup使用与配置实战](https://juejin.cn/post/6844903970469576718 "https://juejin.cn/post/6844903970469576718")

### 实现效果

首先我们看一下实现效果，比如我们本地开发了一个Tag组件：

![](/images/jueJin/16deb990555ab37.png)

蓝色的按钮就是我们的tag组件，接下来我们把它发布到npm上，效果如下：

此时我们就可以用npm install的方式安装我们的组件并使用了。

### 实现

首先我是基于create-react-app来打包我们的UI库的，因为比较方便简单，当然我们也可以使用自己搭建的webpack来实现这一过程。

#### 1.通过create-react-app快速启动一个项目：

```
npx create-react-app alex_xu
cd alex_xu
npm start
```

#### 2.设计组件库目录结构

我们在create-react-app创建的项目下的src目录下新建components用来存放我们的组件,用app.js要导入我们的组件来测试效果,我们会把打包后的组件目录放在lib下,目录大致如下:

![](/images/jueJin/16df121fd29d4cb.png)

#### 3.配置package.json文件

package.json主要用来设置组件库的信息及打包脚本,就好比我们用vue/react脚手架搭建项目一样,大家应该都很熟悉了:

```
    {
    "name": "@alex_xu/ui",
    "version": "0.0.1",
    "description": "A Design UI library for React",
    "main": "lib/index.js",
    "module": "es/index.js",
    "author": "alex_xu",
    "private": false,
    "license": "MIT",
        "publishConfig": {
        "registry": "你的npm仓库地址"
        },
            "repository": {
            "type": "git",
            "url": "git+你的git仓库地址"
            },
                "bugs": {
                "url": "issues地址"
                },
                    "files": [
                    "es",
                    "lib"
                    ],
                    "homepage": "组件库的主页",
                        "keywords": [
                        "react",
                        "components",
                        "ui",
                        "framework",
                        "frontend"
                        ],
                            "peerDependencies": {
                            "react": ">=16.5.0",
                            "react-dom": ">=16.5.0"
                            },
                                "scripts": {
                                "start": "node scripts/start.js",
                                "build": "node scripts/build.js",
                                },
                                    "eslintConfig": {
                                    "extends": "react-app"
                                    },
                                        "browserslist": {
                                            "production": [
                                            ">0.2%",
                                            "not dead",
                                            "not op_mini all"
                                            ],
                                                "development": [
                                                "last 1 chrome version",
                                                "last 1 firefox version",
                                                "last 1 safari version"
                                            ]
                                            },
                                                "devDependencies": {
                                                "@babel/cli": "^7.6.4",
                                                "@babel/core": "^7.6.4",
                                                "@babel/plugin-syntax-dynamic-import": "^7.2.0",
                                                "@babel/preset-env": "^7.6.3",
                                                "@babel/preset-react": "^7.6.3",
                                                "babel-plugin-import": "^1.12.2"
                                                },
                                                // ...
                                            }
                                            
```

这里的script配置只是运行时配置,打包的时候我们会写单独的配置脚本去执行打包,然后打包jsx语法我们需要手动配置babel,所以我们会安装babel插件,babel配置如下:

```
    const presets = [
        [
        "@babel/preset-env",   // 将ES6语法转换为es5
            {
            "useBuiltIns": "usage",    // 只编译需要编译的代码
            "corejs": "3.0.1",
        }
        ],
        "@babel/preset-react"
        ];
        
            const plugins = [
            "@babel/plugin-syntax-dynamic-import",
        ["import", { "libraryName": "antd", "style": true }]
    ]
    
module.exports = { presets, plugins }
```

接下来安装babel模块:

```
npm i @babel/cli @babel/core @babel/preset-env @babel/preset-react -D
```

这里为了设置兼容多平台的环境变量,我们还需要用到cross-env, 拷贝css需要cpx,

```
npm i cross-env cpx -D
```

需要安装的插件已经完成,现在可以写打包组件的shell脚本了(建议在在根目录下创建):

```
cross-env BABEL_OUTPUT=commonjs babel src/components --out-dir lib/
babel src/components --out-dir es/
# 拷贝css
cpx \"src/components/**/*.css\" es"
cpx \"src/components/**/*.css\" lib"
```

接下来我们继续我们的组件库发布.

#### 4.发布组件库

首先假定我们在components下写好了第一个组件Tag,我们在components的index.js统一导出:

```
export { default as Tag } from './Tag';
// ...
```

然后执行我们的shell脚本:

```
bash build.sh
```

执行完可以发现在根目录下多了lib和es的目录,里面即使我们打包后的组件,一种遵循es规范,一种遵循cjs规范.

发布:

```
npm publish --access public
```

\--access是设置npm的访问级别,有public|restricted, restricted是限制访问,如果要发开源包,一般设置为public.

### 最后

完整配置文件我已经发布到github，如果想了解更多webpack，gulp，css3，javascript，nodeJS，canvas等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [前端组件/库打包利器rollup使用与配置实战](https://juejin.cn/post/6844903970469576718 "https://juejin.cn/post/6844903970469576718")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [快速掌握es6+新特性及es6核心语法盘点](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [基于nodeJS从0到1实现一个CMS全栈项目的服务端启动细节](https://juejin.cn/post/6844903955143786510 "https://juejin.cn/post/6844903955143786510")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [《javascript高级程序设计》核心知识总结](https://juejin.cn/post/6844903953671389191 "https://juejin.cn/post/6844903953671389191")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")