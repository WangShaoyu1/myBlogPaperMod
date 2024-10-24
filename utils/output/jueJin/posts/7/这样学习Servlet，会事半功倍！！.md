---
author: "Java3y"
title: "这样学习Servlet，会事半功倍！！"
date: 2020-03-12
description: "老实说，Servlet放在现在肯定算是一个古老的技术了。现在你去任何的一家公司，应该都不是直接用Servlet来写项目的。现在的项目一般来说还是以SpringMVC-Spring-Mybatis  SpringBoot居多。面试也几乎不会问Servlet的知识（无论是校招还是…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:106,comments:13,collects:82,views:7384,"
---
前言
--

工作已经有一段时间了，如果让我重新学Servlet，我会怎么学呢？下面抛出两个常见的问题，我分开来解答

*   2020年了，还需要学Servlet吗？
*   Servlet的学习路线（学习重点）

![](/images/jueJin/170cc56b01dfeb4.png)

一、2020年了，还需要学Servlet吗？
----------------------

老实说，Servlet放在现在肯定算是一个**古老**的技术了。现在你去任何的一家公司，应该都不是**直接**用Servlet来写项目的。现在的项目一般来说还是以`SpringMVC-Spring-Mybatis / SpringBoot`居多。面试也几乎不会问Servlet的知识（无论是校招还是社招）

既然Servlet已经是一个这么古老的技术了，那我还需要学吗？这是一个非常常见的问题。我初学的时候也非常喜欢搜相关的问题：“`SWING/AWT`这种技术还需要学吗”。

无论是我在知乎回答Java学习路线，还是读者问到的这个问题，我都会给予肯定的回答：“**需要学Servlet，不要跳过Servlet去学框架**”

我因为好好学了Servlet，在学Struts2（没错，我还学过Struts2）和SpringMVC的都非常容易上手，几天就基本会用了。

如果了解`Struts2或SpringMVC`的同学就会知道，其实他俩的底层都离不开Servlet。Struts2的核心用的是Filter（过滤器），而SpringMVC的核心用的就是Servlet。

学过Servlet好处是什么：

*   打下坚实的基础，学习框架就得心应手了。

![](/images/jueJin/170cc56b01a05fd.png)

二、Servlet的学习路径
--------------

下面我来讲讲Servlet的重点有哪些，其实就是学习Servlet的路线。还是要重复一句话：“**在学习一项技术之前，首先要知道为什么要学习它**”

![](/images/jueJin/170cc56b0342a74.png)

### 2.1 Tomcat

学Servlet之前，首先我们要学学`Tomcat`。Tomcat是一个Web服务器（同时也是Servlet容器），通过它我们可以很方便地**接收和返回**到请求（如果不用Tomcat，那我们需要自己写Socket来接收和返回请求）。

Tomcat其实我们并不需要学太多的知识，只要学会安装和启动以及了解一下各个目录的含义就差不多了。

![](/images/jueJin/170cc56b04a7a68.png)

Tomcat各个目录的含义：

![](/images/jueJin/170cc56b059be7e.png)

![](/images/jueJin/170cc56b0832290.png)

### 2.2 Servlet版“Hello world“

首先，我们需要认清一个JavaWeb的标准目录结构：

![](/images/jueJin/170cc56b305d55c.png)

随后，我们编写一个最简单的Servlet程序和配置`web.xml`来完成一次交互。

![](/images/jueJin/170cc56b3417077.png)

![](/images/jueJin/170cc56b32a0383.png)

在写Servlet的时候，我们**顺便**了解一下Servlet的**继承体系和生命周期**

![](/images/jueJin/170cc56b3065d7c.png)

2.3 HTTP简单学一下
-------------

**HTTP协议是客户端和服务器交互的一种通迅的格式**。

例如:在浏览器点击一个链接，浏览器就为我打开这个链接的网页。

原理：当在浏览器中点击这个链接的时候，**浏览器会向服务器发送一段文本**，\*\*告诉服务器请求打开的是哪一个网页。服务器收到请求后，就返回一段文本给浏览器，浏览器会将该文本解析，然后显示出来。\*\*这段「文本」就是遵循HTTP协议规范的。

在初学的时候，我们只要记住一些常用的**头信息**（请求头和响应头）就足够了。

![](/images/jueJin/170cc56b383d806.png)

### 2.4 ServletConfig和ServerContext对象

ServletConfig：通过此对象可以读取`web.xml`中配置的初始化参数，不写硬编码，将配置写在配置文件中。

ServletContext：这个对象是在Tomcat启动的时候就会创建，代表着当前整个应用。我们一般用来获取整个应用的配置信息（ServletConfig是单个的，而ServletContext是整个应用的），还可以用这个对象来读取资源文件。

这几个最基本的Servlet对象学完了以后，我们就可以关注一下Servlet的一些小细节了，比如说：

*   Servlet是单例的
*   配置通配符的时候可以用各种的通配符`*.`和一个Servlet可以被多个配置映射
*   访问任何资源其实都是在访问Servlet(即便是访问图片资源，Tomcat都有默认Servlet处理)
*   ....

![](/images/jueJin/170cc56b3c675a4.png)

### 2.5request和response对象

Servlet的**重点需要学习**request和response对象。当我们学完HTTP的请求头和响应头以后，再看到这两个对象。我们就应该知道：request其实就是封装了HTTP的请求头，而response就是封装了HTTP响应头。

这两个对象是Servlet中最重要的，因为我们跟外接的交互都是通过request和response对象来进行的。

通过response对象，我们可以尝试写一些Demo，比如：

*   给浏览器输出一些简单的内容
*   实现文件下载的功能
*   实现页面自动刷新的功能
*   实现对数据的压缩
*   生成验证码图片
*   重定向跳转
*   .....

通过request对象，我们也可以尝试做些Demo，比如：

*   得到浏览器的传递过来的各类信息（请求参数、请求头等）
*   实现防盗链
*   通过request对象来转发
*   解决请求参数中文乱码的问题
*   ....

一句话总结：request对象主要用于**接收**请求各种的信息，response对象主要用户**返回**给请求各种的信息。围绕着请求、响应我们分别有request和response对象供我们操作。

![](/images/jueJin/170cc56b5920ddc.png)

### 2.6 Cookie和session会话机制

前面我们已经学到了Servlet的几个对象了，分别是Config（获取配置信息）、Context（代表整个Web应用）、Request（HTTP请求）、Response（HTTP响应）。

每个网站都会有**登录注册**的功能，那它是怎么实现的呢？上这上面的几个对象，好像都不是实现登录注册的。于是我们该来学学**会话机制** Cookie和Session啦。

![](/images/jueJin/170cc56b5c8d987.png)

首先我们了解一下Cookie是存储在哪的，以及Cookie的基本API使用，包括：

*   Cookie的有效期如何设置
*   Cookie如何保存中文
*   Cookie的不可跨域性是什么意思
*   使用Cookie来显示用户上次访问的时间
*   使用Cookie来显示上次浏览过的商品

Cookie的API使用基本会了以后，我们就可以学习Session了，学Session的时候我们需要解决：

*   有了Cookie，为什么需要Session（因为他俩都是会话机制）
*   Session的API基本使用
*   Session的生命周期和有效期
*   Session的实现原理，如果禁用Cookie，还能使用Session吗
*   尝试完成Session的几个小Demo
    *   使用Session完成购物的功能
    *   使用Session完成简单的登录注册
    *   使用Session完成防止表单重复提交
    *   使用Session完成一次性校验码

完了以后，我们可以**对比**一下Cookie和Session的区别主要有哪些。

一句话总结：**Cookie是检查用户身上的”通行证“来确认用户的身份，Session就是通过检查服务器上的”客户明细表“来确认用户的身份的。Session相当于在服务器中建立了一份“客户明细表”**。

![img](/images/jueJin/170cc56b5da956a.png)

### 2.7 Servlet知识总结

其实纵观Servlet，无非就是学几个对象，但这几个对象对我们后面的学习都非常重要，我之前画过一张思维导图概括了这几个对象，希望对大家有帮助：

![](/images/jueJin/170cc56b62610fd.png)

三、发干货！
------

如果了解我的同学，应该知道我已经写过不少的文章了，[GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")的原创列表文章需要拖动很久才能拖到底。

`Servlet`是我最开始写系列级文章的开始，我在各大博客发表的第一篇文章就叫做《Tomcat 就是这么简单》。

现在已经工作有一段时间了，为什么还来写`Servlet`呢，原因有以下几个：

*   我是一个对**排版**有追求的人，如果早期关注我的同学可能会发现，我的GitHub、文章导航的`read.me`会经常更换。现在的[GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")导航也不合我心意了（太长了），并且早期的Servlet文章，说实话排版也不太行，我决定重新搞一波。
*   我的文章会分发好几个平台，但文章发完了可能就没人看了，并且图床很可能因为平台的防盗链就挂掉了。又因为有很多的读者问我：”**你能不能把你的文章转成PDF啊**？“
*   我写过很多系列级的文章，这些文章就几乎不会有太大的改动了，就非常适合把它们给”**持久化**“。

基于上面的原因，我决定把我的Servlet汇总成一个`PDF/HTML/WORD`文档。说实话，打造这么一个文档**花了我不少的时间**。为了防止**白嫖**，关注我的公众号回复「**888**」即可获取。

文档的内容**均为手打**，有任何的不懂都可以直接**来问我**（公众号有我的联系方式）。

![](/images/jueJin/170cc56b75dc616.png)

如果**点赞超过500**，那下周再肝一个系列出来。**想要看什么，可以留言告诉我**

![](/images/jueJin/170cc56b77e591c.png)

如果大家想要**实时**关注我更新的文章以及分享的干货的话，可以关注我的公众号「**Java3y**」。

*   🔥**Java精美脑图**
*   🔥**Java学习路线**
*   🔥**开发常用工具**
*   🔥**精美文档电子书**

在公众号下回复「**888**」即可获取！！

![](/images/jueJin/170cc56b7e6d258.png)

> **本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")
> 
> **求点赞** **求关注️** **求分享👥** **求留言💬** 对我来说真的 **非常有用**！！！

，