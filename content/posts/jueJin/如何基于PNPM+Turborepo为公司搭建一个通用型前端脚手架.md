---
author: "Moment"
title: "如何基于PNPM+Turborepo为公司搭建一个通用型前端脚手架"
date: 2024-03-18
description: "⾯对创建不同项⽬时遇到的初始化配置繁琐和前期配置不便，以及不同项⽬间相同逻辑的重复问题，为了解决这些问题，我们设计并实现了⼀款前端脚⼿架⼯具。⽬的是通过⾃动化处理常⻅的初始化任务，极⼤简化开发前期的配"
tags: ["前端","JavaScript","GitHub"]
ShowReadingTime: "阅读4分钟"
weight: 959
---
⾯对创建不同项⽬时遇到的初始化配置繁琐和前期配置不便，以及不同项⽬间相同逻辑的重复问题，为了解决这些问题，我们设计并实现了⼀款前端脚⼿架⼯具。⽬的是通过⾃动化处理常⻅的初始化任务，极⼤简化开发前期的配置⼯作，同时通过用户的选择⽀持生成包括 React、Vue 等多种流⾏前端技术栈的模板，确保了该脚⼿架的⼴泛适⽤性与⾼度的灵活性。

项目目录分层
======

我们整个项目使用的是 Turborepo+PNPM 实现的 Monorepo 架构，如下结构所示：

![20240317100944](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87f3a19966f448909236c6374d02cecb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1296&h=1472&s=162564&e=png&b=191919)

在上面展示的目录中，我们分别管理者三个目录，分别是 packages、app、example，其中 packages 为整个脚手架的核心包，而 app 为在我们创建项目时所需要的模板包，这里的模板包都会上传到 NPM 上，稍后我们会讲到，而 example 就见名知意啦，会存放我们的一些 demo。

Create-Neat 整体架构
================

现在我们只需要把所有目光聚焦到 packages 目录下，这里就是我们所有的实现逻辑，虽然目前整体再进行重构，但是大差不差

![20240317101627](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c214251d3ad3474eae31bb242a82c957~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1276&h=390&s=44112&e=png&b=181818)

在上面我们只需要挑三个文件来讲解就可以啦：

1.  core：脚手架核心，通过该子包可以在终端中快速创建项目；
2.  react-webpack-config：配置了一些核心的 webpack 配置，并通过 npm 包的方式提供用户直接使用；
3.  utils：存放两个依赖包之间相同的代码；

core
----

我们现在的目光来到 core 这里，这里也就是我们的 Create-Neat 包，src 目录下的 index.ts 就是整个项目的入口文件，当我们在终端中执行 `npx create-neat app` 就会进入到该文件并执行：

![20240317102114](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca6c50c60bd54826b6e356e8ea2caf8f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2764&h=1116&s=277776&e=png&b=1c1c1c)

执行到这里的时候，它会根据用户的选择来处理不同的用户选择来创建不同的模板，这里处理的核心逻辑就是我们的 `createApp` 函数了，在这里我们只需要看一个核心的逻辑：

![20240317103237](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7abb05e89e34c40b9dcd4a451ef8111~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=3536&h=1816&s=859469&e=png&b=1f1f1f)

在这里，你会看到我们使用 axios 来执行了一个网络请求，这里就是我们前面说到的模板包的作用了，当我们发布一个包到 NPM 上，每个包对应的版本都有一个 tgz 后缀的文件：

ts

 代码解读

复制代码

``const template: string[] = [   "common-lib",   "react-ui",   "react-web-js",   "react-web-ts",   "vue-web-js",   "vue-web-ts",   "commit", ]; export const packageVersion = "1.0.1"; const getProjectLink = (templates: string[]): Map<string, string> =>   new Map(     templates.map((template) => [       template,       `https://registry.npmjs.org/@laconic/template-${template}/-/template-${template}-${packageVersion}.tgz`,     ])   ); export const projectLink: Map<string, string> = getProjectLink(template);``

这里是我们定义的常量，我们通过 axios 获取到来了 tgz 文件之后，我们需要将其解压到特定的目录，之后将根据用户不同的选择，讲不同的模板合并到一起这样就可以创建出一个用户所需要的项目啦，是不是好帅！！！

我们来使用 `https://registry.npmjs.org/@laconic/template-react-web-ts/-/template-react-web-ts-1.0.0.tgz` 这个连接来直接打开浏览器看看效果：

![20240317103914](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da09484080544e61a0e8ea19d8a2f583~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1514&h=872&s=196611&e=png&b=282825)

这里就是我们需要的文件了。

utils
-----

utils 这边没啥好说的，我们就讲一个比较特别的函数：

ts

 代码解读

复制代码

`import fs from "node:fs"; import path from "node:path"; const appDirectory: string = fs.realpathSync(process.cwd()); function resolveApp(relativePath: string): string {   return path.resolve(appDirectory, relativePath); } export { resolveApp };`

这个函数用于获取我们当前终端的所在目录，假想一下，我们在启动一个 React 项目的时候，我们是不是需要在项目的根目录下来启动，通过这个函数来获取当前路径，那么就可以通过这个路径来做我们想做的事情啦。

react-webpack-config
--------------------

react-webpack-config 这个包集成了一些我们内置的 webpack 配置，babel 配置：

![20240317104522](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4023b46c10dd44c9800819cc5b326eb2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=3306&h=1498&s=701252&e=png&b=1f1f1f)

我们区分了开发环境和生产环境，其中一个比较特别的点就是，它会判断当前项目下是否存在 `webpack.config.js` 的文件，这个文件就是提供用户自定义 webpack 配置的，之所以能读取到他的配置，这也就是我们的 utils 包的 resolveApp 函数的作用了。

我们先来使用 `Create-Neat` 来创建一个项目，我们通过这个项目来理解到 react-webpack-config 这个包是怎么被启动起来的：

![20240317105325](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8317c63ca9fb40488c82d42a4e066248~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=3840&h=2112&s=864337&e=png&b=1d1d1d)

小图片就是我们创建的项目，项目依赖 react-webpack-config 的包，然后当我们执行 `pnpm start` 启动项目的时候，它就会通过 bin 命令来执行 react-webpack-config 中 bin 目录下的 index.js 文件：

js

 代码解读

复制代码

``#!/usr/bin/env node const crossSpawn = require("cross-spawn"); const argument = process.argv.slice(2); if (["start", "build", "analyzer"].includes(argument[0])) {   const result = crossSpawn.sync(     process.execPath,     [require.resolve(`../script/${argument[0]}.js`)],     {       stdio: "inherit",     }   );   if (result.signal) {     if (result.signal === "SIGKILL") {       console.log(         "The build failed because the process exited too early. " +           "This probably means the system ran out of memory or someone called " +           "`kill -9` on the process."       );     } else if (result.signal === "SIGTERM") {       console.log(         "The build failed because the process exited too early. " +           "Someone might have called `kill` or `kill all`, or the system could " +           "be shutting down."       );     }     process.exit(1);   }   process.exit(result.status); } else {   console.log('Unknown script "' + argument[0] + '".');   console.log("Perhaps you need to update react-scripts?"); }``

这里它会根据命令之后传入的第一个参数是什么，然后执行不同的文件，我们展示中执行的是 start 文件，这个时候我们可以将目光转移到 scripts 目录下的 start.js 文件了：

![20240317105653](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e75d8a58d77d4d65bb50b9dd01503acf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2134&h=1558&s=523799&e=png&b=1f1f1f)

这里我们接收所有的开发环境的 webpack 配置，并且读取用户是否有编写.env 文件并且自定义了端口，如果自定义了端口，就使用用户定义的，如果没有则使用默认端口，我们把整个 webpack 的配置传入 webpack-dev-server 来运行，这样子整个项目就启动起来了。

在后面我们会根据一些不同的 hooks 来处理不同的逻辑，例如格式化输出格式等等。

其他 build 和 analyzer 文件请自行查阅。

如何启动项目
======

首先我们应该在仓库中拉取项目到本地：

bash

 代码解读

复制代码

`git clone https://github.com/xun082/create-neat.git`

项目拉取完成之后，要在根目录下使用 pnpm 来安装相关依赖 （必须使用pnpm）：

bash

 代码解读

复制代码

`pnpm install`

依赖安装完成之后，直接执行如下命令来启动项目：

bash

 代码解读

复制代码

`pnpm dev`

因为项目使用Turborepo来管理着，所以它会启动所有子包中带有 `dev` 字段的包。create-neat 也会运行起来了的。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/274ad82ff6324b1e8707afc7acbd59cd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1530&h=526&s=58934&e=png&b=181818)

这样子整个项目就启动起来了，要想在本地中调试该脚手架，那么你就需要在 `core` 目录下面打开终端：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de27a217714b4a36aa5cc2a78e7d12fb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1694&h=628&s=217497&e=png&b=1f1f1f)

在该终端里面直接执行 `npm link` 将项目链接到全局，这个时候你就可以直接在本地中调试了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82725f3382ef41eb939c5e33a3d9ed58~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2342&h=1432&s=270560&e=png&b=1c1c1c)

这样就启动完成脚手架的调试了。

总结
==

通过上面的步骤，首先使用 Create-Neat 来实现根据用户的选择来创建不同的模板，在创建的模板当中添加 react-webpack-config 这样的依赖包，并且在 scripts 中添加相对应的启动命令， react-webpack-config 会根据传入的参数不同来判断是生产环境还是开发文件来处理不同的配置。这样就是一整个脚手架创建的核心流程。

最后分享两个我的两个开源项目,它们分别是:

*   [前端脚手架 create-neat](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxun082%2Freact-cli "https://github.com/xun082/react-cli")
*   [在线代码协同编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxun082%2Fonline-cooperative-edit "https://github.com/xun082/online-cooperative-edit")

这两个项目都会一直维护的,如果你也喜欢,欢迎 star 🚗🚗🚗

如果你对开源项目感兴趣的，可以加我微信 yunmz777