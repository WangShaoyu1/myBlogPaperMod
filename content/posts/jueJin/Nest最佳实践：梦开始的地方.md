---
author: "工程师_Yan"
title: "Nest最佳实践：梦开始的地方"
date: 2023-12-30
description: "全栈工程师最佳的选择，快速上手使用nest.js开发自己的应用，手把手带领大家安装自己的nest.js开发环境，开发helloworld应用。"
tags: ["前端","Node.js","NestJS"]
ShowReadingTime: "阅读7分钟"
weight: 927
---
`Nest.js` 简介
============

`nest.js` 是一个基于 `node.js` 的后端开发框架，专为企业级应用设计。使用 `JavaScript/TypeScript` 编写，让开发效率大大加快。

`nest.js` 提供了如 IOC、AOP 等特性，能够有效地降低应用开发的复杂性，并确保得以处理企业级应用的需求。

本专栏中，我们将从最基本的开始，详细介绍我在使用 `nest.js` 开发应用过程中认为的优秀设计和实践，如：`MySQL`、`Redis`、`ORM 框架`、`RabbitMQ`、`Bull`、`Docker`、`Docker-Compose` 等等的应用。同时，我将在适当的时间点手把手实战开发一个项目，让你亲身体验 `nest.js` 的强大功能。

学会 `Nest.js` 能干嘛
================

成为全栈工程师
=======

作为一位前端工程师，你是否曾有过自行开发接口，独立打造专属产品、成为一名全栈工程师的念头？如果你有这个想法，那么 `nest.js` 无疑会是绝美的选择。在当前 `node.js` 的生态中，`nest.js` 已然是最受欢迎的后端框架之一。

有人可能会问，为何不选择如 `express` 和 `koa` 这类的 `node.js` 框架呢？

确实，`express` 和 `koa` 同样是优秀且备受好评的框架。但是它们却少企业级开发框架的约束能力，每个开发者都有自己的风格，如果一个团队当中各自用自己的风格编写代码，那无疑是非常致命的。

这一点在企业级应用的开发中至关重要，因为统一的开发规范意味着项目的扩展性和可维护性得以保障。所以在这个理念上，`nest.js` 提供了一整套的解决方案。

同样，我们还可以看看 `nest.js` 与 `express`、`koa` 在 `github` 上 `star` 数量的对比。

*   nest ![1703943286576-Mavl2w](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efca9e8550b342b1bf9f95d3a1b2c9d1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2024&h=324&s=17900&e=png&b=ffffff)
    
*   express ![1703943345457-PaUwpP](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2f1181a4d5f4d03a494584a83489ff8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1016&h=296&s=11619&e=png&b=ffffff)
    
*   koa ![1703943400455-CmbtU1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65245e01c75044a29d6d86dfbcb619fc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1092&h=298&s=10229&e=png&b=ffffff)
    

这里的数据截止到 2023 年 12 月 30 日，可以看到 `nest` 已经和 `expres` 的 star 数量差不多了，这一点足以表明它在社区当中的流行程度。

流行就意味着有许许多多的开发者已经填过很多坑，也有非常多的资料能够供后来者参考。

所以，对于前端工程师来说，通过学习 `nest` 是转向全栈的一条理想路径。

通过掌握 `nest`，不仅可以增强你的后端开发能力，也会使你的技能范围变得更加全面和有竞争力。这将让你从一个纯粹的前端工程师转变为真正的全栈开发者，打破狭窄的技术框架，能够更完整地理解和参与到项目的整个开发周期中去。

无论是为自己打造专属产品，还是在各类项目中更全面应用自己的技术。这些都将使你在编程的世界里游刃有余，也将为你的职场生涯增添浓墨重彩的一笔。

学习优秀的设计
=======

在学习 nest 的过程当中，同样我们也能够学习到非常多优秀的设计。

nest 并不与 `express` 绑定，而是采用适配器模式，能够让开发者轻松的在 `express` 和 `fastify` 之间进行切换。

如果你觉得还不够，而 nest 内部还为开发者提供了 `AbstractHttpAdapter` 的接口，开发者可以选择继承 `AbstractHttpAdapter` 得方式来实现其他框架的适配。

源码链接：[github.dev/nestjs/nest…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.dev%2Fnestjs%2Fnest%2Fblob%2Fmaster%2Fpackages%2Fcore%2Fadapters%2Fhttp-adapter.ts "https://github.dev/nestjs/nest/blob/master/packages/core/adapters/http-adapter.ts") ![1703944749563-8cCGMY](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94d422b27a744041a064e14b8df5ef67~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1668&h=1468&s=92247&e=png&b=ffffff)

源码链接：[github.dev/nestjs/nest…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.dev%2Fnestjs%2Fnest%2Fblob%2Fmaster%2Fpackages%2Fcore%2Fadapters%2Fhttp-adapter.ts "https://github.dev/nestjs/nest/blob/master/packages/core/adapters/http-adapter.ts") ![1703944662709-UEQvsx](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bab28e663fa478691046541a1e4da8e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1512&h=1250&s=74072&e=png&b=ffffff)

同时，在我们使用 `nest` 开发项目的过程当中，装饰器这种东西是能够贯彻整个应用的，比如`@Get`、`@Post` 等等，只要在函数之上简单的使用这些装饰器，就能够让我们编写的函数能够处理客户端发来的请求，这就是装饰器模块的应用场景，做函数的增强。

在 nest 当中，这样使用设计模式的地方非常多，IOC、AOP 这样的思想，也是贯穿整个应用的开发过程的。

总之，学习 nest，能够让我写出更好、更优雅代码，一旦你熟练的掌握了 nest ，能够在无形之中提高你整体的代码能力和架构设计能力。

环境准备
====

如果你已经对 `node.js` 有相当的理解，你可以跳过本小节的内容。

node
----

开发基于 `node.js` 的后端应用，我们首先需要在本地环境安装 `node.js`。我个人并不推荐直接从官网下载 `node.js`，而是建议使用 `node` 版本管理工具，例如 `nvm`。因为实际开发中，不同的项目可能需要不同版本的 `node.js`，使用版本管理工具能让我们在不同版本间切换变得非常容易。

社区中有许多优秀的版本管理工具，如：

1.  `nvm`: 这是一款广受欢迎的 Node 版本管理工具。`MacOS/Linux` 和 `Windows` 的版本不完全相同，你可以在下面的链接中选择适合你的版本下载：
    
    *   `Windows`：[github.com/coreybutler…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoreybutler%2Fnvm-windows%2Freleases%2Ftag%2F1.1.12 "https://github.com/coreybutler/nvm-windows/releases/tag/1.1.12")
    *   `Macos/ linux`: [github.com/nvm-sh/nvm/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnvm-sh%2Fnvm%2Freleases "https://github.com/nvm-sh/nvm/releases")
    *   如果你会使用 `brew` 那么直接使用 `brew install nvm` 安装即可，其他安装方式可以参考官方文档进行安装。
2.  `n` : 这也是一款优秀的包管理工具。
    
    *   安装链接：[github.com/tj/n](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftj%2Fn "https://github.com/tj/n")

此外还有更多的管理工具例如 `volta` （[volta.sh/](https://link.juejin.cn?target=https%3A%2F%2Fvolta.sh%2F "https://volta.sh/")）等。

这里我给大家推荐一篇使用 `nvm` 能够自动根据项目切换 `node` 版本的文章：[\# 全自动自动切换node版本](https://juejin.cn/post/7292309713704976425 "https://juejin.cn/post/7292309713704976425")

我平时主要使用 `MacOS` 进行开发，对 `windows` 平台的了解不够深入。如果你有关于 `windows` 平台的实用建议，欢迎留言交流。

nest-cli
--------

### 简介

以企业级开发出名的 `Java` 框架 `Spring` 以及 `SpringBoot` 这类框架，都是通过一些约定和规范，开发者遵守这些规范能够开发出易于维护和扩展的企业级应用，这类约定和规范在有个名称：`工程化`。

`nest-cli` 便是 `nest.js` 为开发者提供的命令行工具，使用它提供的工程化能力，能够开发出符合企业级规范的 `nest.js` 应用，它的优点有:

1.  项目脚手架 使用 `nest-cli` 我们能够快速的创建出一个 `nest.js` 项目的基本框架，能够大幅度减少开发者的初始化工作。
    
2.  生成器 `nest-cli` 内置了非常多使用的命令，使用这些命令能够快速的帮助我们生成整个应用程序的各个部分，比如控制器层（controller）、服务层（service）、模块（module）等等，能够大幅提高开发者的效率。
    
3.  开发服务器 `nest-cli` 还提供了开发服务器，让开发者能够在本地环境进行开发和调试。
    
4.  热重载 在开发环境在，能够使用 `--watch` 参数实现热重载功能，当监听到文件发生改变时，它能够自动重载应用，使用最新的代码运行，提高整个开发过程当中的效率。
    
5.  工程化支持 使用 `nest-cli` 内部封装好的 `cli` 命令即可获得一整套管理、开发、部署、测试的工具集，轻松的帮助开发者开发出企业级应用。
    

### 安装

我们直接使用下面的命令，将 `nest-cli` 安装到全局，方便后面使用（npm 在我们安装好 `node` 之后就已经成功的安装上了）

bash

 代码解读

复制代码

`npm install -g @nestjs/cli`

当我们在命令行当中输入 `nest --version` ，得到下面所示的输出说明我们成功安装了 `nest-cli`

![nest-cli 安装验证](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/954e59dbf0074935ab5784b23374afef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=874&h=146&s=6463&e=png&b=272935)

如果你觉得直接用 `npm` 安装的速度太慢了，可以选择使用国内的镜像，使用如下命令即可。

1.  查看所有的镜像源

bash

 代码解读

复制代码

`npx mnrm ls`

2.  选择使用 `taobao` 镜像源

bash

 代码解读

复制代码

`npx mnrm use taobao`

使用命令的过程如下图所示，至于 `npx` 的作用这里就不进行过多的介绍，后面有机会再详细讲述。 ![1703873082324-yiJBku](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83eab024bd9542e0b23f3172c22ca817~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=772&s=47976&e=png&b=3f404b)

第一个 Nest 应用
-----------

相信大家学习一门编程语言最开始都是学习怎么写 `hello world` 吧，学习框架也是一样的，接下来我就带领大家写一个 `nest` 的 `hello world` 程序吧。

使用 `nest new nest-hello` 创建一个 `nest.js` 的应用程序。

![1703873508792-ncBIkT](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b98a15806bf34ad08b33823add060ac8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1052&h=932&s=69352&e=png&b=272833)

然后使用自己的开发工具打开刚刚创建的 `nest-hello` 项目，我习惯使用 vscode 进行开发，打开项目之后，能够看到和下面差不多的目录结构。

![1703873693224-6BNQ4S](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab425c86308d46678cea960fafd3ac49~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=1114&s=31726&e=png&b=131313)

打开 `app.controller.ts` 文件，将内容修改成下面所示的代码

typescript

 代码解读

复制代码

`import { Controller, Get } from '@nestjs/common'; import { AppService } from './app.service'; @Controller() export class AppController {   constructor(private readonly appService: AppService) {}   @Get()   getHello(): string {     return 'hello nest';   } }`

随后打开终端，执行 `npm run start:dev` 可以看到我们的第一个 `nest` 项目成功的运行了起来。

![1703873839720-QqSoGS](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c611fe207a8b4a1a8f0922e04127d829~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1646&h=616&s=51352&e=png&b=262732)

打开浏览器，访问 [http://localhost:3000/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F "http://localhost:3000/") ，可以看到我们编写的 `hello nest` 已经成功的返回。 ![1703873871581-rSVrVS](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90f1c82b053f4cdf8a1b9fc0f418340c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=992&h=240&s=3732&e=png&b=fefefe)

恭喜🎉，到这里我们已经达成了学习 `nest.js` 的第一步，成功的创建了我们第一个 `nest` 程序。