---
author: "徐小夕"
title: "【开源力荐】做了一款开源博客系统——flygoose"
date: 2024-08-23
description: "这里我们用了国内网友最喜欢的前端框架 vue3, 同时为了支持服务端渲染, 我们采用了 nuxt3, 并且使用 pm2`作为博客的持久化方案, 为我们博客系统的稳定“保驾护航”"
tags: ["前端","GitHub","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:13,comments:0,collects:16,views:799,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring")
    
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
    
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
    
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep")
    

最近由**HW开源团队**做的开源博客系统终于上线了, 今天就和大家分享一下.

![图片](/images/jueJin/243b6e7efcca4f8.png)

在开源第一版的时候很多朋友提了非常不错的建议, 我们也做了很多优化, 最终目标是让任何人都能轻松拥有一套**精美且可定制**的个人博客系统.

github地址: `https://github.com/helloworld-Co/flygoose-blog`

demo博客地址: `https://flygoose-blog.helloworld.net`

flygoose 实现的技术栈
---------------

![图片](/images/jueJin/d8d4efbc6526437.png)

这里我们用了国内网友最喜欢的前端框架 `vue3`, 同时为了支持服务端渲染, 我们采用了 `nuxt3`, 并且使用 `pm2` 作为博客的持久化方案, 为我们博客系统的稳定“保驾护航”.

当然开源的不只有前端, 我们也把整个博客系统的**后端**(用Go语言实现) 和**后台管理系统**也开源了, 可以说它是一个全栈的开源博客解决方案, 大家可以根据使用教程轻松部署自己的博客, 并进行二次开发.

lygoose飞鹅开源博客系统都有哪些亮点呢?
-----------------------

接下来我就和大家演示一下它的功能亮点. (现场用飞鹅系统配置了一个博客来演示)

![图片](/images/jueJin/ce1890e2db2b450.png)

### 1\. 支持多端自适应

我们编辑好了博客, 可以在移动端和PC端访问, 采用了**自适应**的技术, 保证了用户的“审美体验”. 下面展示的是移动端访问的效果:

![图片](/images/jueJin/5ee2bdbd338345f.png)

下面展示一下文章详情的界面:

![图片](/images/jueJin/27e0b0c7912a442.png)

### 2\. 支持博客内容板块可定制

![图片](/images/jueJin/be0794073b76487.png)

展示一下文章详情的界为了保证用户可以自定义博客的内容和风格, 我们做了一个开箱即用的后台, 可以在后台轻松定制自己的内容板块, 比如**轮播图**, **通知公告**, **友情链接**, **网站信息**等.

这里展示一下创建博客的界面, 我们可以使用md语法轻松编写博客, 并支持自定义扩展:

![图片](/images/jueJin/a0d264f7b2d24c6.png)

### 3\. 提供开箱即用的后台管理系统

![图片](/images/jueJin/1c674d6e33e14ba.png)

同上, 哈哈, 大家感兴趣可以体验一下我们做的一个线上演示版地址:

[flygoose-admin.helloworld.net](https://link.juejin.cn?target=https%3A%2F%2Fflygoose-admin.helloworld.net "https://flygoose-admin.helloworld.net")

### 4\. 提供全面的部署文档和交流社区

当然如果想要部署使用博客系统, 离不开文档的支持, 我们提供了一份部署文档, 大家可以参考来快速的部署.

### 5\. 完全开源(前端 + 管理端 + 后台服务)

前端博客开源地址: [github.com/helloworld-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fflygoose-blog "https://github.com/helloworld-Co/flygoose-blog")

管理后台开源地址: [github.com/helloworld-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fflygoose-blog-admin "https://github.com/helloworld-Co/flygoose-blog-admin")

服务端开源地址: [github.com/helloworld-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fflygoose-api "https://github.com/helloworld-Co/flygoose-api")

后期规划

大家对于今天的分享有好的建议, 也欢迎随时和我反馈交流~

最近也独立了一款可视化文档编辑器, 类似飞书和**Notion**.

体验地址: **[react-flow.com/docx](https://link.juejin.cn?target=http%3A%2F%2Freact-flow.com%2Fdocx "http://react-flow.com/docx")**

后续我也会持续迭代 `H5-Dooring` 零代码项目，让它成为最好用的**可视化 + 无代码应用搭建工具**，如果大家感兴趣，也随时欢迎留言区反馈交流~