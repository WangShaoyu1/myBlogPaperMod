---
author: "冴羽"
title: "搭建 VuePress 站点必做的 10 个优化"
date: 2022-03-23
description: "在使用 VuePress 搭建这样一个博客后，其实还有很多的优化工作需要做，本篇我们来盘点一下那些完成基础搭建后必做的 10 个优化。"
tags: ["VuePress","Vue.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:61,comments:0,collects:65,views:4169,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，最终的效果查看：[TypeScript 中文文档](https://link.juejin.cn?target=https%3A%2F%2Fts.yayujs.com%2F "https://ts.yayujs.com/")。

在搭建这样一个博客后，其实还有很多的优化工作需要做，本篇我们来盘点一下那些完成基础搭建后必做的 10 个优化。

1\. 开启 HTTPS
------------

开启 HTTPS 有很多好处，比如可以实现数据加密传输等，SEO 也会更容易收录：

> Google 会优先选择 HTTPS 网页（而非等效的 HTTP 网页）作为规范网页

开启 HTTPS，我们的基本步骤是：

1.  购买下载证书
2.  上传到服务器
3.  开启 Nginx 配置

具体的操作步骤，可以参考 [《VuePress 博客优化之开启 HTTPS》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F246 "https://github.com/mqyqingfeng/Blog/issues/246")

2\. Gzip 压缩
-----------

开启 Gzip 压缩将会极大的提高网站加载速度，如果服务器用的是按流量付费，就更是必须要做的内容。

如果使用的是 Nginx，由于 Nginx 内置 Gzip 压缩模块，可以直接开启：

```nginx
    server {
    # 这里是新增的 gzip 配置
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml text/css text/javascript text/plain text/xml;
}
```

关于 Gzip 压缩更多内容可以参考 [《VuePress 博客优化之开启 Gzip 压缩》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F248 "https://github.com/mqyqingfeng/Blog/issues/248")

3\. 数据统计
--------

添加数据统计后，可以看到网站的访问和来源情况，常添加的也就是百度统计和谷歌统计，在国内建议用百度统计。

添加统计代码很简单，往往只用在统计平台生成代码后，添加到站点就行，就比如百度的统计代码为：

```javascript
<script>
var _hmt = _hmt || [];
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?82a3f80007c4e88c786f3602d0b8a215";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    })();
    </script>
    
```

只是要注意，由于 VuePress 是单页应用，页面切换过程中，不会重新加载页面，自然也不会触发百度统计。所以我们只能统计到用户访问了页面，但具体点开了哪些文章，跳转了哪些路由并不知道。为了实现路由切换时的数据统计，我们还需要监听路由改变，手动上报数据。

更具体的步骤可以参考[《VuePress 博客优化之添加数据统计功能》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F245 "https://github.com/mqyqingfeng/Blog/issues/245")

4\. 功能插件
--------

如果要给站点添加各种功能，不一定就要自己手写各种代码，也可以直接利用现成的插件。

比如公告插件：

![image.png](/images/jueJin/604708565cce4f2.png)

代码复制插件：

![image.png](/images/jueJin/b4e0daa2872d4a5.png)

背景音乐插件：

![68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f39653739376364626163306434386237626332386134353565646231393637647e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765.gif](/images/jueJin/390f8d0c05dc4e8.png)

看板娘插件：

![1.gif](/images/jueJin/388a031f0f1943d.png)

更多的插件和效果参考[《搭建 VuePress 博客，你可能会用到的一些插件》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F261 "https://github.com/mqyqingfeng/Blog/issues/261")

5\. 评论功能
--------

一个网站如果有评论功能，可以与读者建立交流，优化站点，也可以及时更新文章中的错误。

添加评论功能，主流是使用 Valine 和 Vssue。

Valine 是一款基于 LeanCloud 的快速、简洁且高效的无后端评论系统，而 LeanCloud 是一种 Serverless 云服务，提供了一站式的后端服务，如数据存储、即时通讯等等。使用 Valine，需要注册 LeanCloud，注册 LeanCloud 并使用服务，需要实名认证，最终实现的效果如下：

![image.png](/images/jueJin/5099af428970415.png)

具体的操作步骤参考[《VuePress 博客优化之增加 Valine 评论功能》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F268 "https://github.com/mqyqingfeng/Blog/issues/268")

而 Vssue 是一个 Vue 驱动的、基于 Issue 的评论插件，虽然有多个托管平台可以使用，这里我使用的是 GitHub，并且实现了与我 GitHub 的文章 issues 打通，实现了同步。最终的效果如下：

![image.png](/images/jueJin/9e2b040ab6174d5.png)

具体的操作步骤参考 [《VuePress 博客优化之增加 Vssue 评论功能》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F270 "https://github.com/mqyqingfeng/Blog/issues/270")

6\. 全文搜索
--------

VuePress 的内置搜索只会为页面的标题、h2 、 h3 以及 tags 构建搜索索引。 如果你需要全文搜索，可则以使用 Algolia 搜索。

Algolia 是一个数据库实时搜索服务，能够提供毫秒级的数据库搜索服务，并且其服务能以 API 的形式方便地布局到网页、客户端、APP 等多种场景。

像 VuePress 官方文档就是使用的 Algolia 搜索，使用 Algolia 搜索最大的好处就是方便，它会自动爬取网站的页面内容并构建索引，你只用申请一个 Algolia 服务，在网站上添加一些代码，就像添加统计代码一样，然后就可以实现一个全文搜索功能：

![2.gif](/images/jueJin/2b7c9b07376548c.png)

具体的步骤参考 [《VuePress 博客优化之开启 Algolia 全文搜索》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F267 "https://github.com/mqyqingfeng/Blog/issues/267")

7\. SEO
-------

如果希望自己的站点能被搜索引擎做到，就要做好 SEO，而 SEO 牵涉的地方有很多，新手建议先看下基础的文档进行学习：

1.  《百度搜索引擎优化指南2.0》[ziyuan.baidu.com/college/cou…](https://link.juejin.cn?target=https%3A%2F%2Fziyuan.baidu.com%2Fcollege%2Fcourseinfo%3Fid%3D193%26page%3D3 "https://ziyuan.baidu.com/college/courseinfo?id=193&page=3")
2.  Google 搜索中心《搜索引擎优化 (SEO) 新手指南 》[developers.google.com/search/docs…](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fbeginner%2Fseo-starter-guide%3Fhl%3Dzh-cn "https://developers.google.com/search/docs/beginner/seo-starter-guide?hl=zh-cn")

很多事情是一定要做的，比如自定义标题、描述、关键词，优化链接、重定向、生成 sitemap，并提交到搜索引擎平台，再辅助使用多个站长平台，及时发现和优化问题。

具体可以参考：

1.  [VuePress 博客之 SEO 优化（一）sitemap 与搜索引擎收录](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F272 "https://github.com/mqyqingfeng/Blog/issues/272")
2.  [VuePress 博客之 SEO 优化（二）之重定向](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F273 "https://github.com/mqyqingfeng/Blog/issues/273")

8\. PWA 兼容
----------

PWA，英文全称：Progressive Web Apps， 中文翻译：渐进式 Web 应用。

实现 PWA，可以方便的让我们的网站实现桌面图标、离线缓存、推送通知等功能。

要实现 PWA 参考 [《VuePress 博客优化之兼容 PWA》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F263 "https://github.com/mqyqingfeng/Blog/issues/263")

9\. 修改样式
--------

网站样式总有一些不满足你期望的地方，有的时候，就需要自己修改代码。

如果你要修改主题色，VuePress 定义一些变量供以后使用，你可以创建一个 `.vuepress/styles/palette.styl` 文件：

```javascript
// 颜色
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
$arrowBgColor = #ccc
$badgeTipColor = #42b983
$badgeWarningColor = darken(#ffe564, 35%)
$badgeErrorColor = #DA5961

// 布局
$navbarHeight = 3.6rem
$sidebarWidth = 20rem
$contentWidth = 740px
$homePageWidth = 960px

// 响应式变化点
$MQNarrow = 959px
$MQMobile = 719px
$MQMobileNarrow = 419px
```

如果你要自定义样式，你可以创建一个 `.vuepress/styles/index.styl` 文件。这是一个 Stylus文件，但你也可以使用正常的 CSS 语法。

更多的颜色修改参考 VuePress 的 [palette.styl](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fconfig%2F%23palette-styl "https://vuepress.vuejs.org/zh/config/#palette-styl")。

10\. 手写插件
---------

有的时候，现有的插件实在满足不了要求，你就需要自己写一个插件了，但是你还要注意，我们写的是一个 VuePress 插件还是一个 markdown-it 插件，比如我们复制代码，我们可以使用 VuePress 插件来实现，但是如果我们要给代码块加一个 try 按钮，点击跳转到对应的 playground 页面，那就是拓展 markdown 语法了，就需要写一个 markdown-it 插件了。

但无论你写哪种插件，都提供了文章：

1.  VuePress 插件：[《从零实现一个 VuePress 插件》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F250 "https://github.com/mqyqingfeng/Blog/issues/250")
2.  Markdown-it 插件：[《VuePress 博客优化之拓展 Markdown 语法》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F251 "https://github.com/mqyqingfeng/Blog/issues/251")

系列文章
----

博客搭建系列，讲解如何使用 VuePress 搭建、优化博客，并部署到 GitHub、Gitee、私有服务器等平台。系列预计 20 篇左右，本篇为第 `33` 篇，全系列文章地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")

微信：「mqyqingfeng」，进低调务实优秀的中国好青年群，PS：这是一个正经的前端群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。