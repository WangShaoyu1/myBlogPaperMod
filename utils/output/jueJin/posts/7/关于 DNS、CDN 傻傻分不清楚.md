---
author: "Gaby"
title: "关于 DNS、CDN 傻傻分不清楚"
date: 2022-06-19
description: "关于 DNS、CDN 傻傻分不清楚，你是否了解过二者的概念及二者的区别呢，只有去了解，才能揭开彼此的真实面目，还你一个真实。"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:9,comments:2,collects:19,views:2416,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第20天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

### 关于 DNS

**DNS 概念**：

域名解析协议（DNS）用来把便于人们记忆的主机域名和电子邮件地址映射为计算机易于识别的IP地址。DNS是一种c/s的结构，客户机就是用户用于查找一个名字对应的地址，而服务器通常用于为别人提供查询服务。

**DNS层次结构**：

DNS域名服务器的层次结构分为：根域名服务器、顶级域名服务器、权限域名服务器、本地域名服务器。

**DNS服务过程**：

解析器 ------(将指定域名放入DNS请求报文中)-----> 本地域名服务器 -----（在本地数据库查找）------->有：则直接交付，回复请求。无：本地服务器将请求转发至根域名服务器。----------->顶级域名服务器--------->权限域名服务器。

![](/images/jueJin/638cdfcaf546455.png)

**路由转发的过程**：

![img.png](/images/jueJin/bb59e80d8f434ab.png)

### 关于 CDN

**CDN 概念**：

CDN的全称是Content Delivery Network，即内容分发网络。CDN是构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN的关键技术主要有内容存储和分发技术。

**为什么会有CDN**

最常规的上线网站方式就是浏览器通过网络访问域名服务器，但有两个致命问题：

*   距离问题,用户离服务器越远，访问速度越慢
*   服务器稳定性,中小型网站因缺少维护，容易宕机后很长时间才被发现。

**CDN解析过程**：

DNS解析设置的后台添加CDN的解析记录 ---------->CDN网络专用的解析DNS请求的服务器---------->给浏览器返回CDN负载均衡服务器---------->CDN网络中找一台个条件下都适合用户设备提供服务的CDN服务器（例如距离最近的CDN服务器）------>若没有，就继续在CDN网络往上层查找------>拉去资源回来后，在每一层没有记录的CDN服务器都做一次缓存。

借用阿里云官网的例子，来简单介绍CDN的工作原理。 ![](/images/jueJin/v2-5ba76e77f05b.png)

*   假设通过CDN加速的域名为www.a.com，接入CDN网络，开始使用加速服务后，当终端用户（北京）发起HTTP请求时，处理流程如下：当终端用户（北京）向www.a.com下的指定资源发起请求时，首先向LDNS（本地DNS）发起域名解析请求。
*   LDNS检查缓存中是否有www.a.com的IP地址记录。如果有，则直接返回给终端用户；如果没有，则向授权DNS查询。
*   当授权DNS解析www.a.com时，返回域名CNAME [www.a.tbcdn.com对应IP地址。](https://link.juejin.cn?target=http%3A%2F%2Fwww.a.tbcdn.com%25E5%25AF%25B9%25E5%25BA%2594IP%25E5%259C%25B0%25E5%259D%2580%25E3%2580%2582 "http://www.a.tbcdn.com%E5%AF%B9%E5%BA%94IP%E5%9C%B0%E5%9D%80%E3%80%82")
*   域名解析请求发送至阿里云DNS调度系统，并为请求分配最佳节点IP地址。
*   LDNS获取DNS返回的解析IP地址。
*   用户获取解析IP地址。
*   用户向获取的IP地址发起对该资源的访问请求。
*   如果该IP地址对应的节点已缓存该资源，则会将数据直接返回给用户，例如，图中步骤7和8，请求结束。
*   如果该IP地址对应的节点未缓存该资源，则节点向源站发起对该资源的请求。获取资源后，结合用户自定义配置的缓存策略，将资源缓存至节点，例如，图中的北京节点，并返回给用户，请求结束。

**CDN优点**

每次浏览器访问一个网站时，都可以在离自己最近的，有缓存的CDN服务器上获取相应数据，而不必在源站上拉取。这使得用户快速打开一个网站，此外还可以防止宕机。因CDN网络中的一个CDN服务器宕机，还有其他服务器可以正常工作。

### 与 DNS 的关系

CDN服务本身并不具备DNS解析功能，而是依托于DNS智能解析功能，由DNS根据用户所在地、所用线路进行智能分配最合适的CDN服务节点，然后把缓存在该服务节点的静态缓存内容返回给用户.所以在启用CDN后进行ping查询时IP发生了变化，是因为此时返回的是我司DNS根据用户所在网络和服务器情况等智能适配后得出的最佳CDN服务节点IP而并真实服务器。

了解更多 ☞ [传送门](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FCDN%25E6%258A%2580%25E6%259C%25AF%2F2277971 "https://baike.baidu.com/item/CDN%E6%8A%80%E6%9C%AF/2277971")