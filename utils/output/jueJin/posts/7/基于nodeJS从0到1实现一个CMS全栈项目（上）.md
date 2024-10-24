---
author: "徐小夕"
title: "基于nodeJS从0到1实现一个CMS全栈项目（上）"
date: 2019-09-25
description: "作为一名前端开发工程师，我们平时除了对javascript，css，html的积累之外，还需要对http，浏览器渲染原理甚至后端的一些知识有所了解，这样对自己职业发展才会更有帮助。 由于本人对前端领域非常感兴趣，接触到前端的时间也比较早，所以平时会用前端技术做一些有趣的东西，包…"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:436,comments:81,collects:579,views:27559,"
---
作为一名前端开发工程师，我们平时除了对javascript，css，html的积累之外，还需要对http，浏览器渲染原理甚至后端的一些知识有所了解，这样对自己职业发展才会更有帮助。

![](/images/jueJin/16d66d537ece5e7.png)

### 项目背景

由于本人对前端领域非常感兴趣，接触到前端的时间也比较早，所以平时会用前端技术做一些有趣的东西，包括H5游戏，一些简单框架的封装，脚手架的设计等等，在我之前的文章中也有比较详细的介绍。最近由于希望对node服务端技术，vue，react hooks这些技术实践做一次总结，也希望自己能做出一些比较实用的项目，把它开源出来可以一起完善，优化，迭代。

所以基于这样的想法，我想到了CMS，我们是不是可以做一个这样的系统，通过一些配置，生成自己的博客网站呢？虽然目前也有很多比较好的博客系统可以使用，比如hexo等，大家也可以参考这些优秀开源的源码，也会收获满满。

### 技术架构

我采用前后端分离的方式开发，具体技术栈有：

*   服务端：NodeJs + Koa + redis + Json-Schema
*   管理后台：Vue-cli3 + vue + vuex + typescript + axios + antd
*   前台页面：WP（自己基于webpack开发的脚手架） + React + axios + antd
*   部署上线：pm2 + nginx
*   代码管理： git

react我们会用到最新的react-hooks基础，也会教一些基本的用法。技术架构图：

![](/images/jueJin/16d67404763738c.png)

（本图使用adobeXD绘制，更多技巧多交流哈）

### 实现效果和关键技术点介绍

#### 1.node服务端搭建

这里我们采用node社区比较轻量的服务端框架Koa，然后服务端中间件有：

*   **ramda** 函数式库，提供优雅的调用方式来实现业务逻辑，地址[ramda](https://link.juejin.cn?target=http%3A%2F%2Framda.cn%2F "http://ramda.cn/")
*   **koa-static** 提供静态资源访问，具体用途在项目实现细节里面会详细介绍
*   **koa-logger** 控制台输出请求日志，方便开发中进行调试
*   **koa-body** 处理请求报文，让koa可以方便的拿到post/put的数据
*   **koa-session** 处理session相关操作
*   **koa2-cors** 本地联调时通过cors方式处理跨域问题
*   **ioredis** 基于nodejs的redis客户端，性能和操作方式都非常优秀
*   **jsonschema** 校验json数据格式，这里我用来封装redis形式的schema
*   **multer** 用来处理文件上传
*   **koa-router** 用来编写服务端路由和api
*   **bcrypt** 对用户密码进行加密

上面就是我们web服务端主要使用的中间件，对于每一块如何去组织和架构，包括自己实现错误校验中间件，我会在后面一一介绍，由于写服务端的过程中也查阅了很多资料，如有不足或需要优化的地方，欢迎交流。

服务端大致分为如下几层：

![](/images/jueJin/16d675a10cadbf6.png)

主要分为数据层，服务层和底层框架层等。

#### 2.后台管理系统

后台管理系统主要采用vue相关生态，我会采用typescript和vuex来组织管理代码及项目状态，主要模块有登录模块，权限控制，博客配置页面，文章编写修改页面，数据统计页面等，第三方UI采用antd，效果如下：

登录模块：

![](/images/jueJin/16d6762f7bdfec4.png)

主页模块：

![](/images/jueJin/16d6765d81c8692.png)

![](/images/jueJin/16d67669cb3600c.png)

![](/images/jueJin/16d6767c11370e3.png)

预览页面：支持pc端移动端预览

![](/images/jueJin/16d67686a229921.png)

![](/images/jueJin/16d67690f0bddd2.png)

然后关键点在于如何去维护配置的数据和config的数据结构的设计，因为考虑到预览功能和编辑设计到的状态既有同步状态也有异步，所以我们80%的业务是在vuex里做的。 文章编辑这块用的wangeditor，你也可以采用其他更优秀的富文本编辑器实现跟强大的功能。效果图如下：

![](/images/jueJin/16d676d3c76feb2.png)

总体来说，vue做的后台管理系统主要用到了vuex，vue-router，antd，axios，wangeditor这几个核心库，类型检验主要用的typescript，主要涉及到接口类型的定义，第一版不会涉及更多诸如泛型的知识，不过会涉及到一点接口的继承。页面中的组件的使用，自定义组件的封装也会在后期详细介绍，如果有更好的思考，经验，可以多多交流。

#### 3.CMS前台实现

前台实现我主要采用react相关生态去实现，这块用vue也是可以的，主要是本人想复习和进一步使用react hooks去实现一些有趣的东西。用到的技术主要有：react-router-dom，antd，axios，react-hooks，如果大家想尝试使用redux，也可以使用，后期我也会总结相关的文章和技术技巧。

理论上这块是要涉及到服务端渲染的，因为C端产品一个重要的点就是seo，所以后面也会增加ssr相关的技术实现。目前是采用骨架屏来实现伪ssr技术。

然后项目的脚手架我们有采用create-react-app，而是自己总结开发的基于webpack的脚手架，如果对webpack有兴趣的，可以一起探索一下webpack的奥妙。 因为每个人配置的页面都不一样，这里我展示一个通过我们管理系统配置的一个博客网站：

![](/images/jueJin/16d679008a77054.png)

![](/images/jueJin/16d678e1414a15b.png)

#### 最后

由于最近空闲时间都在做项目代码优化和调整，nginx服务器配置和服务器性能优化的工作，所以希望感兴趣的朋友可以一起参与进来，打造一个更完美的CMS。后期将更详细的介绍系统的具体实现过程和细节以及服务器相关的配置，包括项目的开源地址我会在十一之前告诉大家，欢迎在公众号《趣谈前端》加入我们一起讨论。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [《javascript高级程序设计》核心知识总结](https://juejin.cn/post/6844903953671389191 "https://juejin.cn/post/6844903953671389191")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [记一次老项目中的跨页面通信问题和前端实现文件下载功能](https://juejin.cn/post/6844903946121641991 "https://juejin.cn/post/6844903946121641991")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [JavaScript 中的二叉树以及二叉搜索树的实现及应用](https://juejin.cn/post/6844903906166718471 "https://juejin.cn/post/6844903906166718471")
*   [用 JavaScript 和 C3 实现一个转盘小游戏](https://juejin.cn/post/6844903895668375566 "https://juejin.cn/post/6844903895668375566")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [基于react/vue生态的前端集成解决方案探索与总结](https://juejin.cn/post/6844903891893485576 "https://juejin.cn/post/6844903891893485576")
*   [如何用不到200行代码写一款属于自己的js类库)](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [js基本搜索算法实现与170万条数据下的性能测试](https://juejin.cn/post/6844903866610221064 "https://juejin.cn/post/6844903866610221064")
*   [《前端算法系列》如何让前端代码速度提高60倍](https://juejin.cn/post/6844903865553256461 "https://juejin.cn/post/6844903865553256461")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")