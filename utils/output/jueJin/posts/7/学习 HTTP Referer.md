---
author: "政采云技术"
title: "学习 HTTP Referer"
date: 2022-08-10
description: "HTTP 中 Referer 字段在工作中或许并不会吸引你的注意，隐藏在 Network 的请求之下，但是却有着非常重要的作用。平常你一定会遇到一些问题需要去排查。"
tags: ["HTTP","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:60,comments:0,collects:28,views:8562,"
---
![政采云技术团队.png](/images/jueJin/bfefad3ee3474e3.png)

![维尼.png](/images/jueJin/8583065dd4a64c1.png)

> 这是第 155 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[学习 HTTP Referer](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Farticle%2Fhttp-referer "https://www.zoo.team/article/http-referer")

背景
==

HTTP 中 Referer 字段在工作中或许并不会吸引你的注意，隐藏在 Network 的请求之下，但是却有着非常重要的作用。平常你一定会遇到一些问题需要去排查，假如这个问题在你排查完全部代码后，依然没有解决，这个时候你会怎么办？此时我们就需要将排查问题的角度转换一下，切换到 HTTP 协议上。

最近工作当中也碰到了与此相关的一些问题，借此机会也同时做个记录和总结。HTTP 协议整体包含内容非常多，本次我们只把其中的 Referer 字段拿出来和大家详细说一下。

HTTP Referer
============

Referer 是什么？
------------

HTTP Referer 是 HTTP 表头的一个字段，用来表示当前网页是来源于哪里，采用的格式是 URL。我们通过这个 HTTP Referer，可以查到访客的来源。

可以通过 Network 面板看到，页面访问及资源请求的 Request Headers 请求头信息里有一个 Referer 字段，用来标记来源的 URL。

![](/images/jueJin/af20b2829990439.png)

有同学可能会注意到 Referer “似乎”拼写有误，应该是 “Referrer" 才对，这其实是个历史原因，在早期 HTTP 规范当中就存在的拼写错误，后面为了向下兼容，所以将错就错。

拼写错误只有 Request Headers 的 “Referer”，在其他地方比如General Headers、 JavaScript 及 DOM 上，都是正确的拼写。

General Headers：

![](/images/jueJin/7f7bfd870e62464.png)

```javaScript
// javascript
document.referrer

// DOM
<a target="_blank" href="https://edu.zcygov.cn/live" referrerpolicy="no-referrer">查看链接</a>
```

到此大家应该对 Referer 有了一个大概的了解，那么 Referer 字段在什么条件下会展示，以及如何去控制 Referer 返回的具体内容呢？答案就在 Referrer-Policy 当中，下面就带大家详细讲一下 Referrer-Policy 策略。

Referrer-Policy 策略
------------------

### 有哪些策略？

#### **Referrer-Policy: no-referrer**

顾名思义，这个策略表示不发送 Referer 信息。

工作中实际使用的场景：

在双品牌“乐彩云”推广中为降低双域名跳转改造成本，运维层面在Nginx添加了一个规则，若访问链接（例如 news.zcygov.cn）的 Referer 包含 lecaiyun.com 域名，则会强制将访问链接的域名变更为 lecaiyun.com ，实现链接跳转统一。

若部分域名不需要走这一套逻辑，不携带 Referer 头信息，则需要指定 Referrer-Policy 策略为 no-referrer 。

![](/images/jueJin/903db37bc96443b.png)

#### Referrer-Policy: no-referrer-when-downgrade

如果从 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，其他情况发送（包括 HTTP 网址链接到 HTTP 网址）。

此规则原先是大多数浏览器的默认策略，现在随着隐私安全性的要求变高之后，浏览器将默认规则变更成了 strict-origin-when-cross-origin。

#### Referrer-Policy: origin

Referer字段一律只发送源信息（协议+域名+端口），不管是否跨域。

#### Referrer-Policy: origin-when-cross-origin

同源时，发送完整的Referer字段，跨域时发送源信息。

#### Referrer-Policy: same-origin

链接到同源网址（协议+域名+端口 都相同）时发送，否则不发送。注意，[foo.com](https://link.juejin.cn?target=https%3A%2F%2Ffoo.com "https://foo.com") 链接到 [foo.com](https://link.juejin.cn?target=http%3A%2F%2Ffoo.com "http://foo.com") 也属于跨域，因为两者的协议不同。

#### Referrer-Policy: strict-origin

如果从 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，其他情况只发送源信息。

#### Referrer-Policy: strict-origin-when-cross-origin

同源时，发送完整的Referer字段；跨域时，如果 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，否则发送源信息。

#### Referrer-Policy: unsafe-url

Referer字段包含源信息、路径和查询字符串，不包含锚点、用户名和密码。

针对以上策略，可以根据策略及 Referer 携带信息的完整度，可以总结成一个表格，可以按照自己的需求配置不同的策略：

不携带任何 Referer 信息

Referer 只携带域名 Origin 信息

Referer 携带完整 URL 信息

no-referrer

✅

\-

\-

origin

\-

✅

\-

unsafe-url

\-

\-

✅

strict-origin

从 HTTPS 请求到 HTTP 的网址时

满足以下任意条件：  
  

*   从 HTTPS 请求到 HTTPS 网址时
*   从 HTTP 请求到 HTTP 的网址时

\-

no-referrer-when-downgrade

从 HTTPS 请求到 HTTP 的网址时

\-

满足以下任意条件：  
  

*   从 HTTPS 请求到 HTTPS 网址时
*   从 HTTP 请求到 HTTP 的网址时

origin-when-cross-origin

\-

跨域请求

同源请求

same-origin

跨域请求

\-

同源请求

strict-origin-when-cross-origin

从 HTTPS 请求到 HTTP 的网址时

满足以下任意条件：  
  

*   跨域请求
*   从 HTTPS 请求到 HTTPS 网址时
*   从 HTTP 请求到 HTTP 网址时

同源请求

### 浏览器默认的策略

浏览器

默认的策略

Chrome

Chrome 85 版本默认策略变更为：strict-origin-when-cross-origin  
原策略：no-referrer-when-downgrade  
  
详细可查看：[developer.chrome.com/blog/referr…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fblog%2Freferrer-policy-new-chrome-default%2F "https://developer.chrome.com/blog/referrer-policy-new-chrome-default/")

Firefox

Firefox 87 版本默认策略变更为：strict-origin-when-cross-origin  
原策略：strict-origin-when-cross-origin  
  
详细可查看：[blog.mozilla.org/security/20…](https://link.juejin.cn?target=https%3A%2F%2Fblog.mozilla.org%2Fsecurity%2F2021%2F03%2F22%2Ffirefox-87-trims-http-referrers-by-default-to-protect-user-privacy%2F "https://blog.mozilla.org/security/2021/03/22/firefox-87-trims-http-referrers-by-default-to-protect-user-privacy/")

Edge

Edge 88 版本默认策略变更为：strict-origin-when-cross-origin  
原策略：no-referrer-when-downgrade  
  
详细可查看：[docs.microsoft.com/zh-cn/deplo…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.microsoft.com%2Fzh-cn%2Fdeployedge%2Fmicrosoft-edge-policies "https://docs.microsoft.com/zh-cn/deployedge/microsoft-edge-policies")

Safari

类似于 strict-origin-when-cross-origin  
  
依赖智能跟踪预防 (ITP)策略，详细可查看：[webkit.org/blog/9661/p…](https://link.juejin.cn?target=https%3A%2F%2Fwebkit.org%2Fblog%2F9661%2Fpreventing-tracking-prevention-tracking%2F "https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/")

### 设置 Policy 的方法

当我们需要变更 Referer 策略的时候，浏览器本身以及W3C规范都给我们提供了路径，有以下几种方式可以操作：

#### rel 属性

<a>、<area>标签均支持 rel 属性，最常见的就是在 <a> 标签中对单个链接设置 `rel="noreferrer"`

```javaScript
<a href="xxx" rel="noreferrer" target="_blank">新地址</a>
```

![](/images/jueJin/ecf32aea34a34a2.png)

设置之后，新开的网页请求头中，将不再携带来源页面的 Referer 信息。

![](/images/jueJin/7d3159e114dd4a1.png)

#### <meta> 标签

在HTML的 <head> 标签内，可以新增 <meta> 标签，设置整个网页的 Referer Policy 策略。

```javaScript
<meta name="referrer" content="no-referrer">
```

#### Headers 请求头

更改 HTTP 头信息中的 Referer-Policy 值即可。比如你使用的是 Nginx，则可以设置 add\_headers 设置请求头。

```javaScript
add_header Referrer-Policy "no-referrer";
```

设置完请求头，最终体现在浏览器 Headers 里字段是：

```javaScript
Referrer-Policy: no-referrer
```

#### referrerpolicy 属性

这个目前看还是实验性功能，并且在 IE 浏览器上也是完全不支持的。

```javaScript
<a href="xxx" referrerpolicy="no-referrer" target="_blank">新地址</a>
```

支持的标签：<a>、<area>、<img>、<iframe>、<link>

#### 优先级

以上几种设置方式，有页面级和元素级，当这两者都存在时，优先级按以下方式进行生效：

1、元素级政策

2、页面级政策

3、浏览器默认

举例：

```javaScript
<meta name="referrer" content="strict-origin-when-cross-origin">

<a href="https://foo.com" rel="no-referrer" target="_blank">地址一</a>
<a href="https://bar.com" target="_blank">地址二</a>
```

页面中地址一，则优先按元素级策略，走 no-referrer，而页面中其他元素（包括但不限于 a 标签）则按 meta 页面级策略执行

作用及使用场景
=======

以下列举了几个比较常见的作用及使用场景：

### （1）防盗链

以 CDN 加速为例，一般都提供了防盗链配置，其内部实现原理是按照 Referer 来源来判断是否在配置的白名单或者黑名单中，来决定资源能否可被访问。

![](/images/jueJin/68641f37f1ef419.png)

图片来自[阿里云CDN的防盗链配置](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F27134.html "https://help.aliyun.com/document_detail/27134.html")

### （2）埋点分析

埋点分析有一种情况是用于追溯用户的完整访问路径，这个时候可以依赖的就是 HTTP Referer，可以通过 Referer 来源逐步分析用户的来源网址和整体访问链路。

### （3）错误排查（接口日志）

排查接口请求报错时，一般会关注日志系统，而日志系统里如果没有对于接口访问来源的字段，那么想快速精确找到接口访问的页面是比较困难的。这时候 Referer 就提供了一个比较好的帮助，可以看到接口的请求来源。

![](/images/jueJin/94c75c68d418492.png)

### （4）用户隐私保护

为什么各浏览器厂商都升级了 Policy 默认策略？

目的其实是为了保护用户隐私，过于完整的 Referer 信息能够通过日志抓取到完整链路，也就意味着你的访问路径和来源是没有任何隐藏，这样可能会对隐私及网站的安全性带来一定的危害。

参考资料
====

*   [HTTP来源地址](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FHTTP%25E5%258F%2583%25E7%2585%25A7%25E4%25BD%258D%25E5%259D%2580 "https://zh.wikipedia.org/wiki/HTTP%E5%8F%83%E7%85%A7%E4%BD%8D%E5%9D%80")
*   [HTTP Referer 教程](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2019%2F06%2Fhttp-referer.html "https://www.ruanyifeng.com/blog/2019/06/http-referer.html")
*   [链接类型](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTML%2FLink_types "https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types")
*   [引荐来源 (Referer) 和引荐来源政策 (Referrer-Policy) 最佳实践](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Freferrer-best-practices%2F "https://web.dev/referrer-best-practices/")

推荐阅读
----

[浅谈低代码平台远程组件加载方案](https://juejin.cn/post/7127440050937151525 "https://juejin.cn/post/7127440050937151525")

[前端富文本基础及实现](https://juejin.cn/post/7124839474575441934 "https://juejin.cn/post/7124839474575441934")

[可视化搭建系统之数据源](https://juejin.cn/post/7122240814108901406 "https://juejin.cn/post/7122240814108901406")

[表单数据形式配置化设计](https://juejin.cn/post/7119639489567260686 "https://juejin.cn/post/7119639489567260686")

[如何将传统 Web 框架部署到 Serverless](https://juejin.cn/post/7117042614313943070 "https://juejin.cn/post/7117042614313943070")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 90 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)