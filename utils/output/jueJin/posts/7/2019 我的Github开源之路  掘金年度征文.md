---
author: "MacroZheng"
title: "2019 我的Github开源之路  掘金年度征文"
date: 2019-12-23
description: "转眼间2019即将过去，回想这一年，学习了很多也输出了很多。如果要说我最大的成果的话，我的Github可以概括下。这一年之中累计收获了3w+Star，总计开源维护了6个项目，下面我就对这些开源项目做个小小的总结。 首先我们来说说mall这个项目，mall是一套电商系统，基于Sp…"
tags: ["Java","程序员中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:168,comments:13,collects:48,views:5511,"
---
前言
--

转眼间2019即将过去，回想这一年，学习了很多也输出了很多。如果要说我最大的成果的话，我的Github可以概括下。这一年之中累计收获了3w+Star，总计开源维护了6个项目，下面我就对这些开源项目做个小小的总结。

![](/images/jueJin/16f2c8c5b9945dc.png)

mall
----

首先我们来说说`mall`这个项目，`mall`是一套电商系统，基于SpringBoot+MyBatis实现，采用Docker容器化部署。这个项目是我去年3月份开始写的，耗时9个月，到去年12月的时候正式开源。这是我的第一个开源项目，也是一个从零开始的项目，整个项目的需求分析、后台功能的实现、前端页面实现、移动端原型设计都由我一个人来完成，其中的使用的很多技术和工具都是现学现用，收获很大。这个项目开启了我的开源之路，我觉得围绕这个项目我可以打造很多有价值的东西，毕竟互联网上的实战型项目太少了，而文档齐全的项目更少，于是我便努力把它打造成一个学习型项目，于是便有了接下来的一系列开源项目。

mall-admin-web
--------------

`mall-admin-web`是一个电商后台管理系统的前端项目，基于Vue+Element实现。这个项目是和`mall`项目同时产生的，毕竟再好的后端项目，没有前端展现，大家也不知道它是个啥。虽然我是个后端开发，但在最近几年大前端的浪潮下，但学点前端技术总没有坏处，通过一步步实现这个项目，我也牢牢地掌握了它们。

mall-learning
-------------

之前提过我想把`mall`项目打造成一个学习型项目，让更多的人来学习，于是便有了`mall-learning`这个实战型学习教程。`mall-learning`围绕着`mall`项目，对其架构、业务、技术要点三方面进行解析。这个项目从今年5月份开始，至今还在完善，我会把平时学习到的技术都融入到里面去。其实这个项目写到现在，它已经不仅仅是`mall`专属的学习教程了，把它称之为一个通用的项目实战教程也不为过，因为里面涉及的很多技术都可以放到其他项目里面去使用。

我们可以看下`mall`项目在刚发布之初的到底有哪些文档：

![](/images/jueJin/16f2c8c5b982939.png)

再看下`mall-learning`中目前所有的文档：

![](/images/jueJin/16f2c8c5ba510bf.png)

![](/images/jueJin/16f2c8c5bcae49f.png)

![](/images/jueJin/16f2c8c5bce7561.png)

可以说基本上`mall`项目整个后端技术栈的文档都在里面了，这些文档不仅在学习时有用，在做项目的时候也非常有用，有些时候某些技术忘了怎么使用了，我也会来翻看这些文档，毕竟好记性不如烂笔头啊。

通过`mall-learning`项目文档的完善，我的技术栈也在逐渐提升，基本打造了以下的技术栈。

![](/images/jueJin/16f2c8c5be34507.png)

mall-tiny
---------

一个项目会越做越复杂，复杂之后又会进行简化，提取出来一个骨架以便于新项目的使用，`mall-tiny`就是这么一个骨架项目。 `mall-tiny`是从`mall`项目中抽取出来的项目骨架，保留了mall项目的整个技术栈，对业务逻辑进行了精简，只保留了权限及商品核心表，方便开发使用，可以自由定制业务逻辑。 如果大家有从零开始的项目搭建需求，可以参考下这个项目。

springcloud-learning
--------------------

随着微服务架构的越来越流行，我们也得学习些微服务的技术，`springcloud-learning`便是我写的一套Spring Cloud 教程。这套教程我从今年9月份开始写，写到了今年11月份，耗时两个多月。虽然以前看过一些Spring Cloud相关的资料，但是还是写下来才能牢牢掌握。`springcloud-learning`涵盖大部分Spring Cloud核心组件使用，包括Spring Cloud Alibaba及分布式事务Seata，同时为之后`mall`项目的微服务架构改造做了技术储备。

以下是`springcloud-learning`中所涵盖的内容：

![](/images/jueJin/16f2c8c5ed44efe.png)

mall-swarm
----------

学习了很多Spring Cloud 的各种核心知识，是时候来一波实战了，于是我在`mall`项目的基础上进行了改造，在原来电商业务的基础集成了注册中心、配置中心、监控中心、网关等系统功能，`mall-swarm`项目就此诞生。

来一张我画了两个小时的项目架构图：

![](/images/jueJin/16f2c8c5ee6ebf4.png)

总结
--

总的来说，今年我的收获比去年还大，这两年的收获已经超过了前五年的程序员生涯。为啥要在Github上面写开源项目呢，其实我的心中一直有这样一个想法：作为一个从事互联网工作的人，我们总得在互联网上留下点什么吧！

Github地址
--------

最后附上我的Github地址：[github.com/macrozheng](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng "https://github.com/macrozheng")

[掘金年度征文 | 2019 与我的技术之路征文活动正在进行中......](https://juejin.cn/post/6844904017403838471 "https://juejin.cn/post/6844904017403838471")