---
author: "MacroZheng"
title: "涵盖大部分核心组件使用的 Spring Cloud 教程，一定要收藏哦！"
date: 2019-11-26
description: "这是一套涵盖大部分核心组件使用的Spring Cloud教程，包括Spring Cloud Alibaba及分布式事务Seata，基于Spring Cloud Greenwich及SpringBoot 217。20篇文章，篇篇精华，30个Demo，涵盖大部分应用场景。 注册…"
tags: ["Spring Cloud中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:44,comments:0,collects:100,views:5009,"
---
> 耗时2个多月，周更两篇的Spring Cloud 全套教程终于完成了，想学习 Spring Cloud 的小伙伴们抓紧了！

简介
--

这是一套涵盖大部分核心组件使用的Spring Cloud教程，包括Spring Cloud Alibaba及分布式事务Seata，基于Spring Cloud Greenwich及SpringBoot 2.1.7。20篇文章，篇篇精华，30个Demo，涵盖大部分应用场景。

应用场景
----

### 注册中心

注册中心主要用于服务治理，提供了服务的注册与发现功能，微服务架构中的服务可以注册到注册中心，也可以通过注册中心获取到其他服务的信息。这里提供了Eureka、Consul、Nacos三种解决方案。

### 配置中心

配置中心主要用于提供统一的外部配置管理，微服务架构中的服务可以从配置中心获取配置信息，同时支持动态刷新配置。这里提供了Spring Cloud Config、Consul、Nacos三种解决方案。

### API网关

API网关主要用于为微服务架构中的服务提供统一的外部访问入口，实现请求的路由与过滤功能。这里提供了Zuul和Gateway两种解决方案。

### 负载均衡

微服务架构中有的服务会部署多个，Ribbon提供了服务间调用的客户端负载均衡功能，OpenFeign基于Ribbon提供了声明式的服务间调用。

### 熔断与限流

熔断与限流是对微服务架构中服务的一种保护措施，当系统中有故障发生时，可以防止故障的蔓延。这里提供了Hystrix和Sentinel两种解决方案。

### 安全保护

Spring Cloud Security 为构建安全的SpringBoot应用提供了一系列解决方案，结合Oauth2可以实现单点登录、服务安全保护等功能，可以很好地保护微服务架构中的服务。

### 监控中心

Spring Boot Admin 结合 Spring Cloud的注册中心使用可以用来监控微服务架构中的服务。

### 分布式事务解决

微服务架构中，当一次业务操作需要操作多个数据源或需要进行远程调用时就会产生分布式事务问题，Seata可以很好地解决该问题。

目录
--

*   [Spring Cloud 整体架构概览](https://juejin.cn/post/6844903938748219406 "https://juejin.cn/post/6844903938748219406")
*   [Spring Cloud Eureka：服务注册与发现](https://juejin.cn/post/6844903940312530957 "https://juejin.cn/post/6844903940312530957")
*   [Spring Cloud Ribbon：负载均衡的服务调用](https://juejin.cn/post/6844903943084965902 "https://juejin.cn/post/6844903943084965902")
*   [Spring Cloud Hystrix：服务容错保护](https://juejin.cn/post/6844903945026928654 "https://juejin.cn/post/6844903945026928654")
*   [Hystrix Dashboard：断路器执行监控](https://juejin.cn/post/6844903951179972622 "https://juejin.cn/post/6844903951179972622")
*   [Spring Cloud OpenFeign：基于Ribbon和Hystrix的声明式服务调用](https://juejin.cn/post/6844903959086235655 "https://juejin.cn/post/6844903959086235655")
*   [Spring Cloud Zuul：API网关服务](https://juejin.cn/post/6844903960696848397 "https://juejin.cn/post/6844903960696848397")
*   [Spring Cloud Config：外部集中化配置管理](https://juejin.cn/post/6844903966405296142 "https://juejin.cn/post/6844903966405296142")
*   [Spring Cloud Bus：消息总线](https://juejin.cn/post/6844903968158547976 "https://juejin.cn/post/6844903968158547976")
*   [Spring Cloud Sleuth：分布式请求链路跟踪](https://juejin.cn/post/6844903975016366088 "https://juejin.cn/post/6844903975016366088")
*   [Spring Cloud Consul：服务治理与配置中心](https://juejin.cn/post/6844903976710701063 "https://juejin.cn/post/6844903976710701063")
*   [Spring Cloud Gateway：新一代API网关服务](https://juejin.cn/post/6844903982599684103 "https://juejin.cn/post/6844903982599684103")
*   [Spring Boot Admin：微服务应用监控](https://juejin.cn/post/6844903984109617165 "https://juejin.cn/post/6844903984109617165")
*   [Spring Cloud Security：Oauth2使用入门](https://juejin.cn/post/6844903987137740813 "https://juejin.cn/post/6844903987137740813")
*   [Spring Cloud Security：Oauth2结合JWT使用](https://juejin.cn/post/6844903988727382024 "https://juejin.cn/post/6844903988727382024")
*   [Spring Cloud Security：Oauth2实现单点登录](https://juejin.cn/post/6844903992204623879 "https://juejin.cn/post/6844903992204623879")
*   [Spring Cloud Alibaba：Nacos 作为注册中心和配置中心使用](https://juejin.cn/post/6844903993873793032 "https://juejin.cn/post/6844903993873793032")
*   [Spring Cloud Alibaba：Sentinel实现熔断与限流](https://juejin.cn/post/6844903999876022279 "https://juejin.cn/post/6844903999876022279")
*   [使用Seata彻底解决Spring Cloud中的分布式事务问题](https://juejin.cn/post/6844904001528397831 "https://juejin.cn/post/6844904001528397831")
*   [IDEA中创建和启动SpringBoot应用的正确姿势](https://juejin.cn/post/6844903952970940424 "https://juejin.cn/post/6844903952970940424")

项目结构
----

> 本教程配套30个Demo，每个Demo都经过精心测试，保障能够完美运行！

```
springcloud-learning
├── eureka-server -- eureka注册中心
├── eureka-security-server -- 带登录认证的eureka注册中心
├── eureka-client -- eureka客户端
├── user-service -- 提供User对象CRUD接口的服务
├── ribbon-service -- ribbon服务调用测试服务
├── hystrix-service -- hystrix服务调用测试服务
├── turbine-service -- 聚合收集hystrix实例监控信息的服务
├── hystrix-dashboard -- 展示hystrix实例监控信息的仪表盘
├── feign-service -- feign服务调用测试服务
├── zuul-proxy -- zuul作为网关的测试服务
├── config-server -- 配置中心服务
├── config-security-server -- 带安全认证的配置中心服务
├── config-client -- 获取配置的客户端服务
├── consul-config-client -- 用于演示consul作为配置中心的consul客户端
├── consul-user-service -- 注册到consul的提供User对象CRUD接口的服务
├── consul-service -- 注册到consul的ribbon服务调用测试服务
├── api-gateway -- gateway作为网关的测试服务
├── admin-server -- admin监控中心服务
├── admin-client -- admin监控中心监控的应用服务
├── admin-security-server -- 带登录认证的admin监控中心服务
├── oauth2-server -- oauth2认证测试服务
├── oauth2-jwt-server -- 使用jwt的oauth2认证测试服务
├── oauth2-client -- 单点登录的oauth2客户端服务
├── nacos-config-client -- 用于演示nacos作为配置中心的nacos客户端
├── nacos-user-service -- 注册到nacos的提供User对象CRUD接口的服务
├── nacos-ribbon-service -- 注册到nacos的ribbon服务调用测试服务
├── sentinel-service -- sentinel功能测试服务
├── seata-order-service -- 整合了seata的订单服务
├── seata-storage-service -- 整合了seata的库存服务
└── seata-account-service -- 整合了seata的账户服务
```

项目地址
----

> 觉得本项目有帮助的小伙伴可以`点个Star`支持下！

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning "https://github.com/macrozheng/springcloud-learning")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16e7eb1c2559621.png)

\*\*\*\*\*\*\*\*