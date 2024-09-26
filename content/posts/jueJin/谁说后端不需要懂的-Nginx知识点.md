---
author: "JavaSouth南哥"
title: "谁说后端不需要懂的-Nginx知识点"
date: 2024-08-28
description: "他叫IgorSysoev，一个俄罗斯程序员。就是他，着手开发了大名鼎鼎处理高并发、高负载网络请求的Nginx，同时他在2004年把Nginx作为开源软件发布。大家好，我是南哥。一个Java学习与"
tags: ["后端","Java"]
ShowReadingTime: "阅读5分钟"
weight: 566
---
> _先赞后看，南哥助你Java进阶一大半_

他叫`Igor Sysoev`，一个俄罗斯程序员。就是他，着手开发了大名鼎鼎处理高并发、高负载网络请求的Nginx，同时他在2004年把Nginx作为开源软件发布。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/21afdc2e601a43dd81bb96b2798a3084~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727256348&x-signature=2YW4nMuSpARUjUYInvI5F1DmkB8%3D)

大家好，我是南哥。

一个Java学习与进阶的领路人，相信对你通关面试、拿下Offer进入心心念念的公司有所帮助。

> ⭐⭐⭐本文收录在《Java学习/进阶/面试指南》：[github..JavaSouth](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaSouth "https://github.com/hdgaadd/JavaSouth")

**精彩文章推荐**

*   [面试官没想到一个ArrayList，我都能跟他扯半小时](https://juejin.cn/post/7396934542958739467 "https://juejin.cn/post/7396934542958739467")
*   [《我们一起进大厂》系列-Zookeeper基础](https://juejin.cn/post/7395127149912227859 "https://juejin.cn/post/7395127149912227859")
*   [再有人问你WebSocket为什么牛逼，就把这篇文章发给他！](https://juejin.cn/post/7388025457821810698 "https://juejin.cn/post/7388025457821810698")
*   [全网把Kafka概念讲的最透彻的文章，别无二家](https://juejin.cn/post/7386967785091514387 "https://juejin.cn/post/7386967785091514387")
*   [可能是最漂亮的Java I/O流详解](https://juejin.cn/post/7391699600761274394 "https://juejin.cn/post/7391699600761274394")

1\. Nginx必知必会
-------------

### 1.1 Nginx概要

> _**面试官：说说你对Nginx的理解？**_

一款**Web服务器**，它叫Nginx，碾压了Apache、Microsoft IIS、Tomact、Lighttpd等一众Web服务器。我们国内没有部署Nginx的科技业务公司，相信也没有多少。

为什么呢？南哥认为和Nginx的出身有关！Nginx在2002年立项开发就是为了服务俄罗斯访问量位居首位的Rambler.ru站点。另外最重要一点，免费开源！让Nginx集结了全球的智慧，帮助它升级迭代、不断攀登宝座。

在Java后端的每一个SpringBoot项目都集成了一个Tomcat服务器，那和Nginx有何区别？其实两者实际上都是提供互联网交互能力的一个节点，同样是Web服务器，不过主要的功能不同。

Tomcat服务器设计小巧轻量，没有集成处理复杂业务场景的功能，更适合作为一个API Web服务器。Nginx提供的功能就很多了，像反向代理、负载均衡、Web缓存，我们企业面向用户的第一关卡便是Nginx，后面的链条才轮到微服务节点。下面我一一道来。

### 1.2 Nginx反向代理、负载均衡

> _**面试官：Nginx常用功能知道吧？**_

（1）反向代理

认识Nginx就从它的反向代理功能开始，Nginx可以配置这样的映射关系。

xml

 代码解读

复制代码

`server {     listen       9001;     server_name  localhost;     location ~ /server01/ {             proxy_pass   http://localhost:8001; 	}     location ~ /server02/ {             proxy_pass   http://localhost:8002; 	} }`

以上配置代表了**所有包含**`/server01/`的路径，实际指向的是后台端口为：`http://localhost:8001`。

举个栗子，用户访问浏览器，这代表了用户肉眼可见的`url链接`实际映射到企业内部服务器是哪个地址、哪些微服务节点处理这个url链条的请求等。

当然Nginx的反向代理功能不止上面说的基础功能，Nginx**转发策略**也是它的本事。我们可以设置代理的正则表达式，把一定规则的域名都转发到某一个端口。

xml

 代码解读

复制代码

`server {     listen 80;     server_name example.com;     location ~ ^/api/ {         proxy_pass http://api.example.com;     } }`

例如以上Nginx配置，南哥使用了正则表达式 `^/api/` ，严格匹配所有以 `/api/` **开头**的URL路径，我们把这些请求转发到 `http://api.example.com`。

（2）负载均衡

后台一众的微服务节点，前面我们知道了Nginx负责代理转发的功能，那Nginx就少不了支持负载均衡。

例如6个微服务节点，1秒内1万个用户请求过来，Nginx这台Web服务器要如何负载均衡把哪些请求转发到哪些个微服务节点。

Nginx服务器提供的负载均衡策略包含了内置策略、扩展策略两个类别，这期我们先说说内置策略，而扩展策略顾名思义其实是第三方提供的，类似于插件。

内置策略包含了以下 3 种。

1、轮询策略

将每个用户请求（也是客户端请求）按一定顺序逐个地代理转发到不同的微服务节点上。

2、加权策略

权是权重的意思，我们可以调整某些个后端节点的权重，性能足够的话权重可以加些，给其他节点兄弟分担分担压力。

3、IP Hash策略

这个策略对请求IP进行了`Hash`操作，也就是相同的Hash结果都会代理转发到同一个微服务节点上。

### 1.3 正向代理和反向代理

> _**面试官：那正向代理和反向代理有什么区别？**_

这两个概念很多网上的解释十分绕口，解释不清。我们先说反向代理。

（1）反向代理

通过上文Nginx反向代理的说明，我们可以知道反向代理配置了暴露给用户的链接与实际服务器地址的映射关系。通过反向代理，可以保护企业内部服务器不被直接暴露、负载均衡处理用户请求等。

（2）正向代理

理解反向代理我们是从企业内部服务器的角度，而理解正向代理，我们要从用户的角度来看。

用户通过浏览器访问某个链接，这个链接的请求先到达**正向代理服务器**，再由正向代理服务器代理用户做这一次请求动作，最后把请求结果返回给用户。

正向代理服务器在其中实际上充当了一部分防火墙的功能，可以保护局域网内用户的安全。

[戳这，《JavaSouth》作为一份涵盖Java程序员所需掌握核心知识、面试重点的《Java学习进阶指南》。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaSouth "https://github.com/hdgaadd/JavaSouth")

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fcb642210dcd4a739524d059bf69e4fe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727256348&x-signature=aYeXB81zRjndxUyFKhCXmcEoES4%3D)

我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️