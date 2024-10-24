---
author: "徐小夕"
title: "从零打造一款基于Nextjs+antd50的中后台管理系统"
date: 2024-03-28
description: "hi,大家好，我是徐小夕，最近在研究nextjs, 为了更全面复盘总结nextjs， 我写了一个开箱即用的基于 next 的后台管理系统, 供大家学习参考 github地址： httpsgit"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:44,comments:0,collects:72,views:4445,"
---
hi,大家好，我是徐小夕，最近在研究`nextjs`, 为了更全面复盘总结`nextjs`， 我写了一个开箱即用的基于 `next` 的后台管理系统, 供大家学习参考.

![](/images/jueJin/8d18d879b9b742c.png)

`github`地址： `https://github.com/MrXujiang/next-admin`

演示地址：`http://next-admin.com`

接下来我就和大家介绍一下 `Next-Admin` 这款中后台管理系统。

为什么要用Nextjs
-----------

![](/images/jueJin/5a9cf7010a2f468.png)

首先从官网上我们可以了解到 `Next.js` 提供了先进的**服务端渲染**（SSR）和**静态生成**（SSG）能力，使得我们能够在服务器上生成动态内容并将其直接发送给客户端，从而大大减少首次加载的等待时间。这样可以提高网站的**性能**、**搜索引擎优化**（SEO）以及**用户体验**。

在深度使用 `next.js` 开发应用之后，我总结了以下使用它的优点：

*   支持高效的服务端渲染和静态页面生成能力
*   规则化的路由系统（保证页面更有组织层次，能更好的管理多页面）
*   规范且颗粒度的API开发模式（更好的规范接口和业务调用）
*   支持复杂系统的搭建（优雅的SPA单页模式和MPA多页面模式）
*   部署和开发成本很低（前后端同构更优雅）

所以基于以上体验和思考，我决定在后面的产品和系统上都采用 Next 来开发。

Next-Admin 特点
-------------

![](/images/jueJin/99d7aeb5dade4d1.png)

去年值得高兴的事情是 `antd5.0` 发布了，从组件UI和设计架构上都有了很大的改进，尤其是 `Design Token` . 有了它我们可以轻松的实时切换网站主题风格， 并且在应用里复用 `antd` 的设计语言。

![](/images/jueJin/a594f5e86f6b4ce.png)

所以为了更好的方便国内开发者使用 `nextjs` 开发中后台系统，我打算使用 `antd5.0` 作为UI库来开发， 大家也可以在 `Next-Admin` 的基础上改造成自己的中后台系统。

接下来就来介绍一下 `Next-Admin` 的特点。

### 1\. 内置基础的登录注册页面

![](/images/jueJin/5afde44830df4f9.png)

### 2\. 内置可拖拽的数据报表

![](/images/jueJin/b5f98757e2e04b8.png)

在内置常用数据看板的同时我还支持了看板拖拽功能， 让用户更高效的消费数据。

### 3\. 内置监控大屏页面

![](/images/jueJin/17ea63e94724454.png)

### 4\. 内置常用的搜索列表

![](/images/jueJin/2e1f7286396d4a7.png)

### 5\. 支持内嵌第三方系统

![](/images/jueJin/0f1a3f1b2a124db.png)

上图演示的是内嵌表单搭建引擎 `https://turntip.cn/formManager` 的案例。

### 6\. 内置空白Landing页面

![](/images/jueJin/fe5cf12a2e0d4d5.png)

### 7\. 支持国际化 & 一键换肤

暗模式： ![](/images/jueJin/db1ba37edb214de.png)

明模式：

![](/images/jueJin/dcfb4cbfa306443.png)

同时项目还集成了很多优秀的开发工具，方便大家更高效的开发业务系统。

如果你对 `next` 开发或者需要开发一套管理系统， 我相信 `Next-Admin` 会给你开发和学习的灵感。

同时也欢迎和我一起贡献， 让它变得更优秀~

`github`地址： `https://github.com/MrXujiang/next-admin`

演示地址：`http://next-admin.com`

由于服务器在国外， 所以建议大家git到本地体验~

欢迎star + 反馈~

更多推荐
----

[可视化表单&试卷搭建平台技术详解](https://juejin.cn/user/3808363978429613/posts "https://juejin.cn/user/3808363978429613/posts")

[爆肝1000小时, Dooring零代码搭建平台3.5正式上线](https://juejin.cn/user/3808363978429613/posts "https://juejin.cn/user/3808363978429613/posts")