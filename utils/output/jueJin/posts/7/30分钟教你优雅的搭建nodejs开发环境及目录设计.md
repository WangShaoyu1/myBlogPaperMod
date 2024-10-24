---
author: "徐小夕"
title: "30分钟教你优雅的搭建nodejs开发环境及目录设计"
date: 2020-03-06
description: "笔者最近在工作之余,一直在做数据可视化和nodejs方面的研究,虽然之前的web工作中接触过nodejs和可视化相关的内容,但是没有一个系统的总结和回顾,所以为了更深入的研究和复盘我的nodejs和数据可视化之路,笔者将会花两个月的时间,做一个彻底的复盘 由上图可以看出,no…"
tags: ["Node.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:56,comments:0,collects:90,views:4236,"
---
前言
--

笔者最近在工作之余,一直在做**数据可视化**和**nodejs**方面的研究,虽然之前的web工作中接触过**nodejs**和**可视化**相关的内容,但是没有一个系统的总结和回顾,所以为了更深入的研究和复盘我的nodejs和数据可视化之路,笔者将会花两个月的时间,做一个彻底的复盘.

> **Node.js**是一个事件驱动I/O服务端JavaScript环境，基于Google的V8引擎，V8引擎执行Javascript的速度非常快，性能非常好。

可能很多朋友都或多或少的接触过**nodejs**,笔者先来大致总结了一下**nodejs**的应用领域:

![](/images/jueJin/170aac06a4a7e81.png)

由上图可以看出,**nodejs**的应用前景还是非常广泛的,前几年比较火的**IOT**物联网技术,nodejs也有一定的领域贡献.

所以作为一名前端工程师(国际一点的叫法Front-end engineer), 要想让自己的未来有更多的想象空间,node是必不可少的技能之一.话不多说,接下来笔者将带大家一步步搭建一个高可用的nodejs开发环境,以便让大家能更快更好的上手nodejs的开发工作.

你将收获
----

*   如何配置eslint来管理项目代码规范
*   如何使用babel7来配置nodejs支持最新的es语法
*   如何使用nodemon来自动化实现node程序自动重启
*   如何划分node目录结构实现一个node通用服务类Xoa来实现经典的MVC架构

正文
--

在介绍正文之前，我想先谈谈前端项目的管理。就笔者的工作和管理经验，衡量一个前端项目管理的好坏往往有以下几个衡量点：

![](/images/jueJin/170ab2d7808bf5b.png)

还原度和功能的完整性这两个方面可以通过完善的测试体系去把控，对于代码的扩展性，维护性和可读性的评定，首先需要由团队负责人去制定相应的代码规范和规则，最大限度的保证同一个项目不同模块的一致性。比如注释规范，格式规范，目录结构和文件命名等。其次放眼大局，公司如果有多个项目，或者多个项目会彼此联系，这时候我们更要从整个前端架构的角度去衡量和设计，所以前端项目不仅仅是泛泛而谈，它对企业长远的产品架构，技术架构上有着非常重要的作用。所以说制定团队或者项目规范，可以说是项目开始最为关键的一步。

### 1.配置eslint来管理项目代码规范

![](/images/jueJin/170ab39f48aa54a.png)

用过eslint的朋友都知道，eslint主要是针对javascript代码检测用的插件化工具。它可以约束代码的书写格式，语法规范，比如保持代码一致的缩进，代码末尾有无分号，使用单引号还是双引号等，我们通过一系列的配置，将会打造完全一致的代码写作风格，这样对后期的代码管理和维护有着非常重要的意义。说了这么多，我们看看看怎么使用在我们的**nodejs**项目中吧。

首先在[eslint官网](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fuser-guide%2Fgetting-started "http://eslint.cn/docs/user-guide/getting-started")我们可以知道下载和安装的方式，这里我们采用全局安装：

```
npm install eslint --global
```

然后我们就可以在项目中生成eslint的配置文件了，具体可选择的配置文件类型有专属的.eslintrc的静态json文件， 或者可动态配置的eslintrc.js文件，这里笔者建议采用后者, 在当前项目下生成配置文件的命令如下：

```
eslint --init
```

这样通过命令行的方法我们就可以生成我们想要的eslint配置文件了。首先笔者先上一份简单的eslint配置文件：

```
    module.exports = {
        "env": {
        "browser": true,
        "node": true,  // 启用node环境
        "es6": true    // 启用es6语法
        },
        "extends": "eslint:recommended",
            "globals": {
            "Atomics": "readonly",
            "SharedArrayBuffer": "readonly"
            },
                "parserOptions": {
                "ecmaVersion": 2018,
                "sourceType": "module"
                },
                    "rules": {
                    "semi": [2, "never"],  // 结尾不能有分号
                    "eqeqeq": "warn",  // 要求使用 === 和 !==
                    "no-irregular-whitespace": "warn",  // 禁止不规则的空白
                    "no-empty-pattern": "warn",  // 禁止使用空解构模式
                    "no-redeclare": "warn", // 禁止多次声明同一变量
                    "quotes": ["error", "single"],  // 代码中使用单引号包裹字符串
                    "indent": ["warn", 2],  // 代码缩进为2个空格
                    "no-class-assign": "error",  // 禁止修改类声明的变量
                    "no-const-assign": "error",  // 禁止修改 const 声明的变量
                }
                };
```

其中rules中键的值分别表示：

*   "off" or 0 - 关闭规则
*   "warn" or 1 - 将规则视为一个警告（不会影响退出码）
*   "error" or 2 - 将规则视为一个错误 (退出码为1)

这里的rule规则大家可以采用市面上已有的规则文件或者可以根据自己的团队风格自行配置，eslint上有比较全面的规则配置表：

![](/images/jueJin/170ab74111332cc.png)

当我们的配置规则配置完毕后，我们只需要在npm的scripts脚本文件中添加执行代码，eslint就会自动帮我们校验代码：

```
    "scripts": {
    "start": "eslint src && export NODE_ENV=development && nodemon -w src"
    },
```

上面代码中eslint src表示对src目录进行eslint语法规则和格式校验，如果我们代码有不符合规范的，那么在控制台将会显示相应的错误。比如我们代码中写了双引号，则运行项目的时候会出现如下错误：

![](/images/jueJin/170aba8911ab935.png)

### 2.如何使用babel7来配置nodejs支持最新的es语法

我们都知道，nodejs对es的支持还不够完善，虽然在10.0+已经支持大部分的es语法了，但是最重要的模块化语法（import，export），类（class）和修饰器（Decorator）还不支持，作为一名有追求的前端工程师，为了让代码更优雅更简洁，我们有理由去用最新的特性去编写更加强大的代码，所以完善的es的环境支持是搭建nodejs项目的第二步。

![](/images/jueJin/170ab81d2a18d3e.png)

没错，为了实现对es语法更全面的支持，babel是我们的不二选择。和eslint类似，编写babel同样也有几种编写配置文件的方式，这里我们还是采用js的方式，这样的好处是可以根据环境动态配置不同的编译方式。

我们这里统一采用babel7来给大家介绍如何配置es环境，如果你还在使用babel6或者更低的版本，可以查看对应文档的版本进行配置。babel7将很多功能都内置到了自己的模块中，我们首先要配置环境，即preset-env，我们可以使用@babel/preset-env，对于class和Decorator的支持，我们需要安装@babel/plugin-proposal-class-properties和@babel/plugin-proposal-decorators这两个模块。所以我们一共需要安装如下几个模块：

*   @babel/cli
*   @babel/core
*   @babel/node
*   @babel/plugin-proposal-class-properties
*   @babel/plugin-proposal-decorators
*   @babel/preset-env

关于babel的配置机制，官网上也写的很详细，大家感兴趣的可以看一下，核心就是环境（**presets**）和插件（**plugin**）机制。官网对preset-env的解释如下：

![](/images/jueJin/170ab944fb07394.png)

即@babel/preset-env是一个智能的允许我们使用最新javascript语法的代码自动转化工具。同时官网也列出了不同配置属性对应的不同功能，为了节约篇幅，我们直接上配置的代码：

```
    module.exports = function (api) {
    api.cache(true)
        const presets = [
            [
            '@babel/preset-env',
                {
                    'targets': {
                    'node': 'current'
                }
            }
        ]
    ]
    
        const plugins = [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose' : true }]
]

    return {
    presets,
    plugins
}
}
```

这也是官方推荐的使用方式，更多灵活的配置大家可以参考官网配置。以上两个plugin的作用不言而知，一个是用来编译转换修饰器属性的，一个是用来编译转换class语法的。最后一步就是在package.json中的脚本文件中使用我们的babel工具：

```
    "scripts": {
    "start": "eslint src && nodemon -w src --exec \"babel-node src\"",
    "build": "babel src --out-dir dist"
}
```

babel-node src指定了需要编译的node目录为src目录，其他文件和目录无需编译。 通过这样的配置，我们就能开心的用最新的javascript语法开发nodejs项目了,在代码编写完成之后，我们执行npm run build即可将src的代码打包编译到dist目录下。编译后的代码如下：

```
"use strict";

var _glob = _interopRequireDefault(require("glob"));

var _path = require("path");

var _xoa = _interopRequireDefault(require("./lib/xoa.js"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _xoa.default();
    app.use((req, res) => {
    console.log(req.url, req.method);
    }); // 全局注册业务接口
    // function autoRegister(path, )
    
        _glob.default.sync((0, _path.resolve)(__dirname, './routes/*.js')).forEach(item => {
        app.use(require(item).default);
        });
        // ...
```

### 3.如何使用nodemon来自动化实现node程序自动重启

nodemon的使用非常简单，我们只需要按照官网文档的配置来安装和使用即可：

```
npm install --save-dev nodemon
```

然后在package.json的脚本文件中如下配置：

```
    "scripts": {
    "start": "eslint src && export NODE_ENV=development && nodemon -w src --exec \"babel-node src\"",
    "build": "babel src --out-dir dist",
    "buildR": "node dist",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

nodemon -w src 表示监听src目录下的文件变化，一旦文件变化将立刻重新启动node程序。我们还可以专门写一个nodemon的配置文件，实现不监听某一个具体的文件变动，或者其他自定义的配置，如果服务上线，我们还可以用forever和nodemon结合来是实现持久化，当然主流的方式还是pm2.

### 4.如何划分node目录结构实现一个node通用服务类Xoa来实现经典的MVC架构

第四点是本文的核心和关键，目录划分往往考验的是程序员对项目和架构的理解程度，对于服务端的目录结构，笔者的经验如下：

![](/images/jueJin/170abb67ce51460.png)

具体目录如下：

![](/images/jueJin/170abe0750cea2a.png)

当然不同目录之间可以进一步细分，这个取决于项目规模。通过对项目有条理的结构化设计，团队中不同的成员就可以有序的负责不同的模块了。这种架构模式参考了传统的mvc的模式，具体还是需要代码层面进一步控制。

接下来笔者将用原生javascript实现一个简单的node服务层的封装，以实现更便捷的node开发，当然在实际项目中我们完全可以采用koa，egg这种成熟的框架来开发node应用，这里笔者只是简单实现一个例子方便大家对node开发有个更深入的认知。

我们都知道nodejs有http模块方便我们快速创建一个node服务器，代码可能长这个样子：

```
import { createServer } from 'http'
    createServer((req, res) => {
    res.end('hello world!')
    }).listen(3000)
```

这样就创建了一个简单的服务器，当我们访问localhost:3000的话我们就能看到页面会显示hello world! 但是我们如果要想实现更复杂的功能，比如根据不同的路由处理不同的逻辑，我们该怎么办呢？也许你会说直接在createServer的回调中根据req.url来判断，代码如下：

```
import { createServer } from 'http'
    createServer((req, res) => {
        if(req.url === 'A') {
        // A的逻辑
            }else if(req.url === 'B') {
            // B的逻辑
                }else if(req.url === 'C') {
                // C的逻辑
            }
            // ...
            }).listen(3000)
```

但是一旦业务逻辑复杂了，路由变多了，我们将写大量的if else代码，这对于维护性来说是一种极大的摧毁，我们希望将路由和业务逻辑划分，分开来管理，这样对于后期业务逻辑日渐复杂，页面路由不断增加才更加容易维护和管理。如何实现这一目标呢？我们可以参考koa的中间件机制，当我们要注册一个路由时，我们只需要这样写：

```
app.use(routeA)
```

这样是不是更优雅一点呢？所以我们基于以上需要来实现一个自己的小型服务框架

![](/images/jueJin/170abd03cc45791.png)

代码实现如下：

```
import { createServer } from 'http'

    class Xoa {
        constructor() {
        // 初始化中间键数组
    this.middleware = []
}
// 维持中间键数组
    use(func) {
    this.middleware.push(func)
}
// 创建服务器实例,并执行相应任务
    createServer() {
        const server = createServer((req, res) => {
        // 应用中间件
        this.middleware.forEach((fn) => fn(req, res))
        })
        return server
    }
    // 服务器监听
        listen(port = 3000, cb) {
        this.createServer().listen(port, cb)
    }
}

export default Xoa
```

通过这样的设计，我们就能优雅的使用中间件语法了：

```
import Xoa from './lib/xoa.js'

const app = new Xoa()

    app.use((req, res) => {
    console.log(req.url, req.method)
    res.end('A')
    })
    
        app.use((req, res) => {
        res.end('B')
        })
        
        app.listen(3000)
```

我们再来看另外一种场景，如果我们的路由很多，有负责页面渲染的路由，也有负责输出api数据的路由，那么我们要每个都使用use来use一遍，这样感觉太傻了，作为一个有追求的程序员是不允许这种事情发生的，我们希望这一切都是自动完成的，自动注册中间件，这该怎么实现呢？ 好在node社区提供了一个强大的第三方模块glob，我们可以通过glob来遍历目录实现自动化注册路由，关于glob的用法这里就不带大家细说了，用法非常简单。 比如我们的路由文件有如下几个：

![](/images/jueJin/170abda7743239d.png)

我们要保证路由目录下面的路由文件都有导出，然后在 入口文件中我们可以这么实现：

```
import glob from 'glob'
import { resolve } from 'path'
import Xoa from './lib/xoa.js'
import config from './config'

const app = new Xoa()

// 全局注册业务接口
    glob.sync(resolve(__dirname, './routes/*.js')).forEach(item => {
    app.use(require(item).default)
    })
    
        app.listen(config.serverPort, () => {
        console.log(`服务器地址:${config.protocol}//${config.host}:${config.serverPort}`)
        })
```

通过glob的sync方法我们可以遍历routes目录并通过require加载路由文件，然后直接注册到app上，这样就不用我们手动一个个引入了，是不是非常简单呢？（虽然这只是个极简版的服务端封装，对于实际项目需要做进一步的升级和扩展，但是设计思想希望大家能有所收获）

对于负责项目我们可能还会考虑业务逻辑，我们会在service目录下编写我们的服务层代码，在路由文件中使用，也有可能采用到数据库模块等，所以说这些都是比较有意思的实现，后面笔者将带大家继续做一个全栈项目，来感受node开发的魅力。

**注**: 本文代码已传到github上了，地址：[smart-node-tpl](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fsmart-node-tpl "https://github.com/MrXujiang/smart-node-tpl")

欢迎大家多交流讨论哈～

最后
--

如果想获取**更多项目完整的源码**, 或者想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [10分钟教你手写8个常用的自定义hooks](https://juejin.cn/post/6844904074433789959 "https://juejin.cn/post/6844904074433789959")
*   [《彻底掌握redux》之开发一个任务管理平台（上）](https://juejin.cn/post/6844904071933984776 "https://juejin.cn/post/6844904071933984776")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")