---
author: "冴羽"
title: "VuePress 博客优化之增加 Valine 评论功能"
date: 2022-03-02
description: "在 《一篇带你用 VuePress + Github Pages 搭建博客》中，我们使用 VuePress 搭建了一个博客，本篇讲讲如何使用 Valine 快速的实现评论功能。"
tags: ["前端","JavaScript","VuePress中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:35,comments:3,collects:10,views:3348,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，最终的效果查看：[TypeScript 中文文档](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")。

本篇讲讲如何使用 Valine 快速的实现评论功能。

主题内置
----

因为我用的是 `vuepress-theme-reco` 主题，主题内置评论插件 `@vuepress-reco/vuepress-plugin-comments`，可以根据自己的喜好选择 Valine 或者 Vssue。本篇讲讲使用 Valine 实现评论功能的全过程。

Valine
------

官网：[valine.js.org/](https://link.juejin.cn?target=https%3A%2F%2Fvaline.js.org%2F "https://valine.js.org/")

Valine 诞生于2017年8月7日，是一款基于 LeanCloud 的快速、简洁且高效的无后端评论系统。

特点是安全、快速、支持 Emoji、无后端实现、MarkDown 全语法支持、轻量易用等。

LeanCloud
---------

Valine 是基于 LeanCloud 的，LeanCloud 官网：[www.leancloud.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.leancloud.cn%2F "https://www.leancloud.cn/")

LeanCloud 是一种 Serverless 云服务，提供了一站式的后端服务，如数据存储、即时通讯等等，简单的来说，比如我要实现一个数据存储功能，我只用在 LeanCloud 注册一个账号，获得对应的 App ID 和 App Key，然后调用提供的 API 即可进行数据存储，以下是一个使用 JavaScript 语法的方式：

![](/images/jueJin/46067b5923264d5.png)

开始
--

有了一个基本的了解，我们开始吧。

### 1\. 注册

注册 LeanCloud：[leancloud.cn/dashboard/l…](https://link.juejin.cn?target=https%3A%2F%2Fleancloud.cn%2Fdashboard%2Flogin.html%23%2Fsignup "https://leancloud.cn/dashboard/login.html#/signup")

注意要使用 LeanCloud 的服务，需要完成实名认证，在填写完姓名和身份证号后，需要使用对应名字的支付宝账号扫码进行认证，扫码完后即可完成实名认证。

### 2\. 创建应用

[登录](https://link.juejin.cn?target=https%3A%2F%2Fleancloud.cn%2Fdashboard%2Flogin.html%23%2Fsignin "https://leancloud.cn/dashboard/login.html#/signin")后, 进入[控制台](https://link.juejin.cn?target=https%3A%2F%2Fleancloud.cn%2Fdashboard%2Fapplist.html%23%2Fapps "https://leancloud.cn/dashboard/applist.html#/apps")后点击左下角「创建应用」：

![](/images/jueJin/6c292eae66494da.png)

创建应用里，这里我们选择开发版，开发版有用量限制，比如 API 请求 3W 次每天，数据存储空间 1GB，对于个人项目是够用的：

![](/images/jueJin/623907f3550e4a1.png)

### 3\. 查看应用凭证

创建完后，点击进入应用的管理后台，选择 「设置 」- 「应用凭证」，然后就能看到你的 APP ID 和 APP Key了：

![](/images/jueJin/607ae11dc3e04d9.png)

### 4\. VuePress 引入

修改 config.js：

```javascript
    module.exports = {
    theme: 'reco',
        themeConfig: {
            valineConfig: {
            appId: '...',// your appId
            appKey: '...', // your appKey
        }
    }
}
```

### 5\. 效果展示

在每篇文章的底部就会出现一个评论栏：

![](/images/jueJin/d0fd9c414c034a9.png)

### 6\. 不展示评论

如果你想默认不加载评论，而只在某些页面显示评论功能，可以在 `valineConfig` 或 `vssueConfig` 中设置 `showComment: false`，并在需要展示评论的页面 设置 `isShowComments: true`。

如果仅是某篇文章不想设置开启评论功能，可以在 `front-matter` 设置 `isShowComments: false`。

更多的配置和注意细节，参考：

1.  [vuepress-theme-reco 评论功能](https://link.juejin.cn?target=https%3A%2F%2Fvuepress-theme-reco.recoluan.com%2Fviews%2F1.x%2Fvaline.html "https://vuepress-theme-reco.recoluan.com/views/1.x/valine.html")
2.  [Valine 配置项](https://link.juejin.cn?target=https%3A%2F%2Fvaline.js.org%2Fconfiguration.html "https://valine.js.org/configuration.html")

系列文章
----

博客搭建系列是我至今写的唯一一个偏实战的系列教程，预计 20 篇左右，讲解如何使用 VuePress 搭建、优化博客，并部署到 GitHub、Gitee、私有服务器等平台。本篇为第 25 篇，全系列文章地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。