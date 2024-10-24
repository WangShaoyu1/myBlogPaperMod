---
author: "徐小夕"
title: "从零打造一款轻量且天然支持SSR的CMS系统——simpleCMS"
date: 2021-01-05
description: "2年前笔者开发了一款基于 nodejs 的全栈开源 cms 系统 XPCMS, 主要是为了解决技术开发者搭建自身内容平台的局限以及降低使用成本, 虽然10版本已经完成, 但是从整体部署和二次开发的便捷度上还是存在很多缺点, 更加适合有一定技术能力的开发者来使用 为了解决 X…"
tags: ["CMS","Node.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:59,comments:30,collects:67,views:5879,"
---
2年前笔者开发了一款基于 **nodejs** 的全栈开源 **cms** 系统 [XPCMS](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FXPCMS "https://github.com/MrXujiang/XPCMS"), 主要是为了解决技术开发者搭建自身内容平台的局限以及降低使用成本, 虽然1.0版本已经完成, 但是从整体部署和二次开发的便捷度上还是存在很多缺点, 更加适合有一定技术能力的开发者来使用.

为了解决 [XPCMS](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FXPCMS "https://github.com/MrXujiang/XPCMS") 的不足, 去年笔者和朋友特地开发了一款轻量便捷的内容管理系统——[**simpleCMS**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FsimpleCMS "https://github.com/MrXujiang/simpleCMS"), 目前已在 **github** 上开源, 且能同时适配PC端和移动端.

目前市面上已经有很多成熟的 **cms** 系统, 比如 **worldPress**, 博客系统 **hexo**, 对于技术开发者来说使用和部署很简单, 但是定制和自定义扩展方面, 却需要一定的技术门槛和开发成本.

基于以上一些痛点和局限, 我们开发了一款简单易用, 且天然支持服务端渲染(SSR)的全栈 **cms** 系统, 方便大家轻松定制自己的博客网站. 笔者接下来就来带大家一起分析 [**simpleCMS**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FsimpleCMS "https://github.com/MrXujiang/simpleCMS") 的功能和技术实现.

技术架构和实现方案
---------

为了降低大家的使用和部署成本, 我们采用了如下技术实现:

*   服务层: **koa2 + nodejs + jsonSchema**(当然其中还使用了很多`nodejs`中间件)
*   前台页面: **pug**(结合`nodejs`实现前后端同构, 且天然的`ssr`)
*   后台管理: **umi3.0 + react + antd + axios + typescript**(当然还用了很多前端插件, 比如富文本, `md`编辑器)
*   系统/服务器相关: **linux / pm2 / nginx**

基本架构模式如下图所示: ![](/images/jueJin/a6b96af41cd74fd.png) 系统页面架构图: ![](/images/jueJin/65ebc8d07e7a4ce.png)

功能分析
----

接下来笔者就来介绍 [**simpleCMS**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FsimpleCMS "https://github.com/MrXujiang/simpleCMS") 的功能点. 我们先来分析一下后台管理系统.

### 后台管理系统功能分析

后台管理系统是动态博客系统必备的模块, 它能很方便的管理我们的网站数据. 这里笔者先来带大家看一下后台管理系统的基本模块:

*   登录页面
*   数据大盘
*   内容管理
*   页面配置
*   广告配置
*   用户信息管理
*   多语言支持

以上是 `cms` 管理系统必备的模块, 这里我们基本上采用`react hooks` 来写, 具体页面如下:

1.  登录页面 ![](/images/jueJin/eb5647d96cd8460.png)
2.  数据大盘 ![](/images/jueJin/6b697ad1e92c48c.png)
3.  文章管理 ![](/images/jueJin/46f35f33dd684a5.png)
4.  内容编辑 ![](/images/jueJin/f5b7746fdc6f40b.png)
5.  多语言支持 ![](/images/jueJin/63e0ec53bd124b0.png) 其他页面就不一一展示了, 感兴趣的朋友可以体验一下. 主要技术采用 **umi + antd + react + typescript** 实现, 感兴趣可以在 [github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FsimpleCMS "https://github.com/MrXujiang/simpleCMS") 上参考学习.

### 前台基本功能分析

前台主要是我们的博客网站, 这里采用 `pug` 这个模版引擎来实现, 交互功能使用大家最熟悉的`jquery`.前台基本模块有:

*   博客首页
*   文章列表页
*   文章详情页

对应的交互功能有**点赞**, **评论**, **文章搜索**功能等, 基本页面如下:

1.  首页 ![](/images/jueJin/619a089beae3479.png)
2.  列表页 ![](/images/jueJin/b6106c64f3cb4d9.png)
3.  详情页 ![](/images/jueJin/4af80411a61a4a7.png)
4.  评论和点赞 ![](/images/jueJin/84123146de574a0.png)

由于`pug`模版引擎适合做一些展示型的网站, 所以非常适合用在`cms`系统中, 我们也可以使用`ejs`等模版引擎.

技术实现细节
------

由于整个`cms` 系统是一个完整的技术闭环, 数据流转都是相关的, 这里笔者主要总结一下实现一个`cms`的技术细节.

*   数据统计功能实现 —— 采用`nodejs`定时任务(`node-schedule`)
*   富文本和md编辑器实现
*   后台多语言实现方案
*   内容管理流程设计
*   `pug` 模版和数据交互
*   `jsonSchema` 数据结构设计
*   手写简单加密解密算法
*   跨域解决方案以及用户权限设计
*   `pm2`管理`node`进程以及做负载均衡
*   多进程场景下的并发锁设计

### 数据统计功能实现

数据统计主要是统计网站的pv, 单篇文章阅读量和点赞量, 为了更好的进行分析我们需要对单日的数据进行统计和存库, 具体实现就是利用定时任务在一天结束前进行数据的统计, 这里我们用 `node-schedule`来实现, 具体使用方式笔者也在之前的文章中做了介绍, 感兴趣可以参考一下.![](/images/jueJin/2741a76fa8e646c.png) 基本使用如下:

```js
let schedule = require('node-schedule');

    let testJob = schedule.scheduleJob('42 * * * *', function(){
    console.log('将在未来的每个时刻的42分时执行此代码, 比如22:42, 23:42');
    });
```

### 富文本和md编辑器方案实现

这里我们用的富文本组件是`braft`, 功能和可扩展性基本满足业务需求, `md`编辑器是程序员写博客的基本方式, 这里主要采用了`for-editor`, 其次就是对其进行了二次封装来实现支持剪切板功能.

### 国际化方案

多语言主要使用的`react-intl`, 由于`umi` 对其有很好的集成, 所以说我们只需要搭建基本的多语言规则即可. 比如在项目目录里建立`locales`文件夹, 然后存放`zh`(中文)/`en`(英文)文件即可, 基本的代码如下:

```js
// locales/en/user
    export default {
    simpleCMS_DESC: 'Easy to use CMS system, help everyone to have their own website blog.',
    CopyrightText: 'SimpleCMS r&d team',
}

// locales/zh/user
    export default {
    simpleCMS_DESC: '简单易用的cms系统, 助力每个人都能拥有自己的网站博客。',
    CopyrightText: 'SimpleCMS 研发团队'
}
```

如果对多语言实现方案感兴趣的, 可以参考`simpleCMS`源码.

后期会继续写对应的文章来介绍具体的实现方案, 感兴趣可以持续关注和交流.

github地址: [传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FsimpleCMS "https://github.com/MrXujiang/simpleCMS")

### simpleCMS开发伙伴

*   The Way, 负责后台管理研发, 掘金: [juejin.cn/user/412502…](https://juejin.cn/user/4125023360529239 "https://juejin.cn/user/4125023360529239")
*   胡小磊, 负责博客前台开发, 掘金: [juejin.cn/user/129268…](https://juejin.cn/user/1292681405798151 "https://juejin.cn/user/1292681405798151")
*   Duang, 负责cms整体UI设计, 博客: [miaochenhao.com/](https://link.juejin.cn?target=http%3A%2F%2Fmiaochenhao.com%2F "http://miaochenhao.com/")

最后
--

> 觉得有用 ？喜欢就收藏，顺便点个**赞**吧，你的支持是我最大的鼓励！微信搜 “**趣谈前端**”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.