---
author: "MacroZheng"
title: "40K+Star！Mall电商实战项目开源回忆录！"
date: 2020-09-17
description: "最近看了下我的Github，发现mall项目已经突破40K+Star，有点小激动！记得去年8月的时候mall项目刚过20K+Star，时隔1年多已经增长到了40K+Star。今天跟大家聊聊mall项目的发展历程，希望对大家有所启发！ 2018年初的时候一度想找个业务与技术相结合…"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:148,comments:11,collects:229,views:14287,"
---
摘要
--

最近看了下我的Github，发现`mall`项目已经突破40K+Star，有点小激动！记得去年8月的时候`mall`项目刚过20K+Star，时隔1年多已经增长到了40K+Star。今天跟大家聊聊`mall`项目的发展历程，希望对大家有所启发！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

最近情况
----

Github上面有个Java Topic排行榜，`mall`项目目前排在第9位，有很多小伙伴早就发现了，这里附上地址：[github.com/topics/java](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftopics%2Fjava "https://github.com/topics/java")

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

发展历程
----

### 最初的20K+Star

为什么要写`mall`项目？打造一个业务与技术相结合的实战项目！

2018年初的时候一度想找个业务与技术相结合的开源项目学习下，但是一直没有找到合适的，于是萌生了自己写一个的想法。总感觉一个项目要是缺少了业务和应用场景，就好像没有了灵魂。于是业务选择了比较好理解的电商，技术选择了流行的SpringBoot。历时1年多，2019年8月的时候`mall`项目累计获得了20K+Star，之前写过一篇文章[《我的Github开源项目，从0到20000 Star！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FvvuxhILdwYcIM0tAAJ00YA "https://mp.weixin.qq.com/s/vvuxhILdwYcIM0tAAJ00YA")，总结了那一年的项目发展历程，大家感兴趣的可以看下。

### SpringCloud系列教程

当项目发展到一定程度，总会去寻找一些新的突破，于是我想把`mall`项目改造成微服务版本。在Java体系中，Spring Cloud基本成了微服务的标准。于是就想先研究下整套Spring Cloud组件，然后再进行改造。在研究过程中写下了一套涵盖大部署核心组件使用的系列教程，就是`springcloud-learning`这个项目，目前获得了2.2K+Star。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### mall-swarm微服务项目

掌握了整套Spring Cloud核心组件之后，接下来就是对`mall`项目进行微服务改造。经过一段时候的打磨，`mall-swarm`项目在2019年12月发布了第一个版本。最近`mall-swarm`项目又进行了一次重大更新，升级至Spring Cloud Hoxton & Alibaba，使用Nacos取代了原来的注册中心Eureka和配置中心Spring Cloud Config，使用Oauth2取代了原来Spring Security实现的权限功能，目前看来是最合理的Spring Cloud技术栈了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### mall更新完善

mall项目这一年更新了很多内容，这里挑重点的回顾下！

*   之前一直使用的Linux部署方式有主要有`Docker`和`Docker Compose`两种，后来加入了`Jenkins`自动化部署，方便生产环境使用。
*   有很多朋友反馈`OSS`对象存储需要花钱，于是加入了自行搭建的`MinIO`对象存储方案，不过生产环境还是推荐使用OSS，毕竟服务器带宽还是很贵的！
*   一直需求很大的权限管理功能实现了，之前一直使用的基于注解的权限控制，升级为了动态权限控制，前端和后台都有了！
*   商品SKU功能设计与优化，抛弃了之前固化的设计，改成了灵活的JSON存储。
*   整合了ELK日志收集系统，采用分场景收集日志的方案，适合生产环境使用，查看日志更方便！
*   最近升级了SpringBoot 2.3.0，使用的各种技术版本又焕然一新了！

### mall-tiny快速开发脚手架

`mall-tiny`之前是一个继承了`mall`完整技术栈的项目骨架，我感觉它依赖服务太多，过于复杂了。这次我把它重新定位为一个快速开发脚手架，化繁为简，只保留了最常用的依赖服务MySQL和Redis。而且实现了完整的权限管理功能，可对接`mall-admin-web`前端项目，秒变权限管理系统！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### mall-admin-web前端项目

`mall-admin-web`前端项目主要是增加了权限管理功能，这里提示下`mall`、`mall-swarm`、`mall-tiny`项目都可以无缝对接该项目，是不是很通用！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### mall-learning学习项目

`mall-learning`项目在`mall`项目的发展历程中，一直贯彻始终。拥有完善的学习教程，这可能是`mall`项目和其他开源项目很大的不同之处，`mall-learning`项目是专门为`mall`项目打造的学习教程项目，包含了丰富的文档和示例代码。我一直使用这样的方式来更新项目，首先学习新技术，在`mall-learning`中写相关教程，也算是一直技术调研吧，之后技术合适的话就运用到`mall`项目中去。感觉这种方式还是很不错的，既深入学习了新技术，又得到了实际的应用，大家学习新技术的时候也可以尝试下。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

未来展望
----

感觉`mall`项目发展至今，已经不单单是一个开源项目，它已经发展出了自己的生态系统，可以称之为`mall`系列生态了。`mall`项目接下来还是会持续更新的，争取打造更好的实战型学习项目！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

项目地址
----

*   `mall`电商实战项目：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")
*   `mall-swarm`微服务电商项目：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")
*   `mall-admin-web`前端项目：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/mall-admin-web")
*   `mall-learning`学习教程项目：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning")
*   `springcloud-learning`学习项目：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning "https://github.com/macrozheng/springcloud-learning")
*   `mall-tiny`快速开发脚手架：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")