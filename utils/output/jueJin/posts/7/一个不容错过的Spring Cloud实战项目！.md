---
author: "MacroZheng"
title: "一个不容错过的Spring Cloud实战项目！"
date: 2020-03-12
description: "mall-swarm作为mall项目的Spring Cloud版本，目前已更新至最新代码，新增了权限管理功能。mall项目中的代码将一直保持最新，mall-swarm每过一段时间将从mall中合并一次代码，本文主要介绍mall-swarm的基本内容及学习路线。 mall-swa…"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:166,comments:0,collects:274,views:14583,"
---
> SpringBoot实战电商项目mall（30k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

`mall-swarm`作为`mall`项目的Spring Cloud版本，目前已更新至最新代码，新增了权限管理功能。`mall`项目中的代码将一直保持最新，`mall-swarm`每过一段时间将从`mall`中合并一次代码，本文主要介绍`mall-swarm`的基本内容及学习路线。

mall-swarm简介
------------

`mall-swarm`是一套微服务商城系统，采用了 Spring Cloud Greenwich、Spring Boot 2、MyBatis、Docker、Elasticsearch等核心技术，同时提供了基于Vue的管理后台方便快速搭建系统。`mall-swarm`在电商业务的基础集成了注册中心、配置中心、监控中心、网关等系统功能。

系统架构图
-----

![系统架构图](/images/jueJin/170c9a095f8925b.png)

后端技术栈
-----

技术

说明

Spring Cloud

微服务框架

Spring Boot

容器+MVC框架

Spring Security

认证和授权框架

MyBatis

ORM框架

MyBatisGenerator

数据层代码生成

PageHelper

MyBatis物理分页插件

Swagger-UI

文档生产工具

Elasticsearch

搜索引擎

RabbitMq

消息队列

Redis

分布式缓存

MongoDb

NoSql数据库

Docker

应用容器引擎

Druid

数据库连接池

OSS

对象存储

MinIO

对象存储

JWT

JWT登录支持

LogStash

日志收集

Lombok

简化对象封装工具

Seata

全局事务管理框架

Portainer

可视化Docker容器管理

Jenkins

自动化部署工具

项目结构
----

```
mall
├── mall-common -- 工具类及通用代码模块
├── mall-mbg -- MyBatisGenerator生成的数据库操作代码模块
├── mall-security -- 封装SpringSecurity+JWT的安全认证的模块
├── mall-registry -- 基于Eureka的微服务注册中心
├── mall-config -- 基于Spring Cloud Config的微服务配置中心
├── mall-gateway -- 基于Spring Cloud Gateway的微服务API网关服务
├── mall-monitor -- 基于Spring Boot Admin的微服务监控中心
├── mall-admin -- 后台管理系统服务
├── mall-search -- 基于Elasticsearch的商品搜索系统服务
├── mall-portal -- 移动端商城系统服务
└── mall-demo -- 微服务远程调用测试服务
```

学习路线
----

> 之前有朋友问我，`mall-swarm`这个项目有没有学习教程？其实这个项目的功能与`mall`项目基本一致，只是在此基础上改成了微服务版本，只要看我写的《mall学习教程》和《Spring Cloud学习教程》即可，下面聊聊我所推荐的学习路线。

### 学习mall

《mall学习教程》主要分为如下几个部分，推荐学习顺序是除参考篇以外可以按下面的顺序学习，对于参考篇，可以在用到里面相关技术时再学习。

*   序章：`mall`项目的整体架构及功能介绍，同时对于新手推荐了一些相关书籍资料；
*   架构篇：`mall`项目的架构搭建教程，手把手教你搭建一个`mall`项目在使用的基本项目骨架；
*   业务篇：`mall`项目电商业务相关教程，对于了解项目业务有很大帮助；
*   技术要点篇：`mall`项目中的一些技术要点解析，主要介绍一些技术在项目中的运用；
*   部署篇：`mall`项目的部署教程，包括Windows、Linux和自动化部署方案；
*   参考篇：`mall`项目中所用技术和工具的入门教程，每一篇都可以单独学习，对于`mall`项目，这些教程的深入程度都刚刚好。

项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning")

### 学习SpringCloud

《Spring Cloud学习教程》是一套涵盖大部分核心组件使用的教程，包括Spring Cloud Alibaba及分布式事务Seata，基于Spring Cloud Greenwich及SpringBoot 2.1.7。20篇文章，篇篇精华，30个Demo，涵盖大部分应用场景。`mall-swarm`项目中所用到的Spring Cloud技术该教程基本都涵盖了，学习该教程可以为学习`mall-swarm`项目打下良好的Spring Cloud基础。

项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning "https://github.com/macrozheng/springcloud-learning")

### 学习mall-swarm

当我们学习了《mall学习教程》和《Spring Cloud学习教程》之后就可以着手学习`mall-swarm`这个项目了。首先需要的就是按之前的教程把项目跑起来，然后进行源码的学习，相信有了学习上面两套教程的基础，搞懂源码并不是什么难事。下面提供下`mall-swarm`的部署教程：

*   [mall-swarm在Windows环境下的部署](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F3IWeI9Jiw-4D-zSwGFuUdw "https://mp.weixin.qq.com/s/3IWeI9Jiw-4D-zSwGFuUdw")
*   [mall-swarm在Linux环境下的部署（基于Docker容器）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBEK2yCNXjjYkYnXvElVV3Q "https://mp.weixin.qq.com/s/BEK2yCNXjjYkYnXvElVV3Q")
*   [微服务架构下的自动化部署，使用Jenkins来实现！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FaivvHF16_1oyvy0fhV0P5A "https://mp.weixin.qq.com/s/aivvHF16_1oyvy0fhV0P5A")

项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")

### 对接前端项目

最近发现有很多朋友使用`mall-admin-web`项目来对接`mall-swarm`项目，遇到了一些问题。这里需要提醒一点，由于我们的`mall-swarm`项目使用Spring Cloud Gateway作为网关服务，所以前端请求都需要走网关服务，具体可以参考[《前后端分离项目，引入 Spring Cloud Gateway 遇到的一个问题！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FrGIGhS7IkqYQw7o80ISHSA "https://mp.weixin.qq.com/s/rGIGhS7IkqYQw7o80ISHSA")。

项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/mall-admin-web")

项目地址
----

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/170c9a21411a5db.png)