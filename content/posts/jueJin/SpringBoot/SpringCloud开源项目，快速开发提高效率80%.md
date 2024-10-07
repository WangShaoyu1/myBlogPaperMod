---
author: "小u"
title: "SpringBoot/SpringCloud开源项目，快速开发提高效率80%"
date: 2023-09-09
description: "前言SpringBoot是一个非常流行的Java框架，它可以帮助开发者快速构建应用程序。他不仅继承了Spring框架原有的优秀特性，而且还通过简化配置来进一步简化了Spring应用的整"
tags: ["后端","Java","SpringBoot"]
ShowReadingTime: "阅读17分钟"
weight: 182
---
前言
--

SpringBoot 是一个非常流行的 Java 框架，它可以帮助开发者快速构建应用程序。他不仅继承了 Spring 框架原有的优秀特性，而且还通过简化配置来进一步简化了 Spring 应用的整个搭建和开发过程。下面我将来介绍若干个项目，带你来快速开发。(排名不分先后)

> 注：里面有很多项目都不在维护了，所以请仔细查看。当然也不代表不维护的项目就不适合你，寻找一个自己合适的一套体系，才可以提高自己的开发效率 推荐的仅仅是个人观点

一、开发脚手架
-------

### 1.1 Cloud-Platform

> *   项目地址：[gitee.com/geek\_qi/clo…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fgeek_qi%2Fcloud-platform "https://gitee.com/geek_qi/cloud-platform") （star 18.6k）

Cloud-Platform 是国内首个基于Spring Cloud微服务化开发平台，具有统一授权、认证后台管理系统，其中包含具备用户管理、资源权限管理、网关API 管理等多个模块，支持多业务系统并行开发，可以作为后端服务的开发脚手架。

代码简洁，架构清晰，适合学习和直接项目中使用。核心技术采用Spring Boot 2.1.2以及Spring Cloud (Greenwich.RELEASE) 相关核心组件，采用Nacos注册和配置中心，集成流量卫兵Sentinel，前端采用vue-element-admin组件。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd27933015e945df93a266353c6e4eb1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2876&h=1638&s=297735&e=png&b=ffffff)

### 1.2 SpringCloud(已停止维护)

> *   项目地址：[github.com/zhoutaoo/Sp…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzhoutaoo%2FSpringCloud "https://github.com/zhoutaoo/SpringCloud") （star 8.3k）

基于 SpringCloud2.1 的微服务开发脚手架，整合了spring-security-oauth2、nacos、feign、sentinel、springcloud-gateway等。服务治理方面引入elasticsearch、skywalking、springboot-admin、zipkin等，让项目开发快速进入业务开发，而不需过多时间花费在架构搭建上。

### 1.3 spring-boot-api-project-seed

> *   项目地址：[github.com/lihengming/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flihengming%2Fspring-boot-api-project-seed "https://github.com/lihengming/spring-boot-api-project-seed") （star 9.4k）

spring-boot-api-project-seed 是一个基于Spring Boot & MyBatis的种子项目，用于快速构建中小型API、RESTful API项目，该种子项目已经有过多个真实项目的实践，稳定、简单、快速，使我们摆脱那些重复劳动，专注于业务代码的编写，减少加班。

### 1.4 Roses

> *   项目地址：[gitee.com/stylefeng/r…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fstylefeng%2Froses "https://gitee.com/stylefeng/roses") (star 2.9k)

Roses 基于Spring Boot 2和Spring Cloud Finchley.SR2，更符合企业级的分布式和服务化解决方案，Roses拥有高效率的开发体验，提供可靠消息最终一致性分布式事务解决方案，提供基于调用链的服务治理，提供可靠的服务异常定位方案（Log + Trace）等等，一个分布式框架不仅需要构建高效稳定的底层开发框架，更需要解决分布式带来的种种挑战。

### 1.5 Pig

> *   项目地址：[gitee.com/log4j/pig](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Flog4j%2Fpig "https://gitee.com/log4j/pig") （Star 40.5k）

*   基于 Spring Cloud Hoxton 、Spring Boot 2.2、 OAuth2 的RBAC权限管理系统；
*   基于数据驱动视图的理念封装 element-ui，即使没有 vue 的使用经验也能快速上手；
*   提供对常见容器化支持 Docker、Kubernetes、Rancher2 支持；
*   提供 lambda 、stream api 、webflux 的生产实践；

![image-20230905135528214](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16284327aab346eab2ac5b4f7d5be7d5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2526&h=1240&s=194717&e=png&b=fefefe)

### 1.6 RuoYi/RouYi-Cloud(推荐)

> *   项目地址：[gitee.com/y\_project/R…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fy_project%2FRuoYi "https://gitee.com/y_project/RuoYi") （star 38k ）

基于Spring Boot、Spring Cloud & Alibaba的分布式微服务架构权限管理系统，同时提供了 Vue3 的版本， 核心技术采用Spring、MyBatis、Shiro没有任何其它重度依赖。

*   提供了多种版本：单体、前后端分离、微服务（即将开源）；
*   提供的功能齐全，覆盖大部分场景需求；
*   提供的文档丰富便于上手和学习；
*   生态系统丰富提供了多种版本；
*   采用主流框架比如 SpringBoot、Shiro、Thymeleaf、Vue、Bootstrap；
*   可以用于所有的 Web 应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA；

![image-20230905135612406](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49f73fe38a5e46f58925c01fe8e95968~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=293147&e=png&b=fefefe)

![image-20230905135640620](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4df534bd59fc43459b2302adc22602b1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1072&h=889&s=229597&e=png&b=ffffff)

### 1.7 JeecgBoot

> *   项目地址：[gitee.com/jeecg/jeecg…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fjeecg%2Fjeecg-boot "https://gitee.com/jeecg/jeecg-boot") （star 14.3k）

JeecgBoot 基于代码生成器的低代码开发平台，开源界“小普元”超越传统商业开发平台！前后端分离架构：SpringBoot 2.x，Ant Design&Vue，Mybatis-plus，Shiro，JWT。强大的代码生成器让前后端代码一键生成，无需写任何代码!

引领新开发模式(OnlineCoding-> 代码生成-> 手工MERGE)，帮助Java项目解决70%重复工作，让开发更关注业务逻辑，既能快速提高开发效率，帮助公司节省成本，同时又不失灵活。

JeecgBoot 可以应用在任何 J2EE 项目的开发中，尤其适合企业信息管理系统（MIS）、内部办公系统（OA）、企业资源计划系统（ERP）、客户关系管理系统（CRM）等，其半智能手工 Merge 的开发方式，可以显著提高开发效率 70%以上，极大降低开发成本。

![image-20230905135925623](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83edcb3fb7ef4dcc9aa9855d6e9f7bfe~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=175174&e=png&b=fdfdfd)

### 1.8 iBase4J

> *   项目地址：[gitee.com/iBase4J/iBa…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FiBase4J%2FiBase4J "https://gitee.com/iBase4J/iBase4J") （star 9.9k）

iBase4J 是Java语言的分布式系统架构，基于SpringBoot 2.0，SpringMVC，Mybatis，mybatis-plus，motan/dubbo分布式，Redis缓存，Shiro权限管理，redis管理Session，Quartz分布式集群调度，Restful服务。

系统包括4个子系统：系统管理Service、系统管理Web、业务Service、业务Web。

系统管理：包括用户管理、权限管理、数据字典、系统参数管理等等；支持QQ/微信登录，App token登录，微信/支付宝支付；日期转换、数据类型转换、序列化、汉字转拼音、身份证号码验证、数字转人民币、发送短信、发送邮件、加密解密、图片处理、excel导入导出、FTP/SFTP/fastDFS上传下载、二维码、XML读写、高精度计算、系统配置工具类等等。

可以无限的扩展子系统，子系统之间使用![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30444df9467c48c4af5b2a7f8274b16d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1917&h=954&s=104287&e=png&b=f2f5f7)

ubbo或MQ进行通信。

### 1.9 renren

> *   项目地址：[www.renren.io](https://link.juejin.cn?target=https%3A%2F%2Fwww.renren.io "https://www.renren.io")

renren 下面一共开源了两个 Java 项目开发脚手架，分别是：

*   renren-security :采用 Spring、MyBatis、Shiro 框架，开发的一套轻量级权限系统，极低门槛，拿来即用；
*   renren-fast : 一个轻量级的 Java 快速开发平台，能快速开发项目并交付【接私活利器】；

renren-security 相比于 renren-fast 在后端功能的区别主要在于：renren-security 提供了权限管理功能，另外还额外提供了数据字典和代码生成器。

> 注意：微服务版 renren-cloud和 renren-security 需要收费才能正常使用，renren-fast 属于完全免费并且提供了详细的文档，不过，完整文档需要捐赠 80 元才能获取到。

### 1.10 SpringBlade

> *   项目地址：[bladex.vip](https://link.juejin.cn?target=https%3A%2F%2Fbladex.vip "https://bladex.vip")

SpringBlade 是一个由商业级项目升级优化而来的 SpringCloud 分布式微服务架构、SpringBoot 单体式微服务架构并存的综合型项目，采用 Java8 API 重构了业务代码，完全遵循阿里巴巴编码规范。

采用 Spring Boot 2 、Spring Cloud Hoxton 、Mybatis 等核心技术，同时提供基于 React 和 Vue 的两个前端框架用于快速搭建企业级的 SaaS 多租户微服务平台。

*   允许免费用于学习、毕设、公司项目、私活等。如果商用的话，需要授权，并且功能更加完善；
*   前后端分离，后端采用 SpringCloud 全家桶，单独开源出一个框架：BladeTool （感觉很厉害）；
*   集成 Sentinel 从流量控制、熔断降级、系统负载等多个维度保护服务的稳定性；
*   借鉴 OAuth2，实现了多终端认证系统，可控制子系统的 token 权限互相隔离；
*   借鉴 Security，封装了 Secure 模块，采用 JWT 做 Token 认证，可拓展集成 Redis 等细颗粒度控制方案；
*   项目分包明确，规范微服务的开发模式，使包与包之间的分工清晰；

### 1.11 COLA(推荐)

> *   项目地址：[github.com/alibaba/COL…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FCOLA "https://github.com/alibaba/COLA") ( star:10.4k)

根据我的了解来看，很多公司的项目都是基于 COLA 进行开发的，相比于其他快速开发脚手架，COLA 并不提供什么已经开发好的功能，它提供的主要是一个干净的架构，然后你可以在此基础上进行开发。

![image-20230905151655314](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e76c2e3f2543589ec6c9d03aae5971~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1271&h=976&s=201548&e=png&b=fefdfd)

COLA 既是框架，也是架构。创建 COLA 的主要目的是为应用架构提供一套简单的可以复制、可以理解、可以落地、可以控制复杂性的”指导和约束"。

*   框架部分主要是以二方库的形式被应用依赖和使用。
*   架构部分主要是提供了创建符合 COLA 要求的应用 Archetype。

### 1.12 SpringBoot\_v2

> *   Github 地址 ：[github.com/fuce1314/Sp…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffuce1314%2FSpringboot_v2 "https://github.com/fuce1314/Springboot_v2") (star:1.6k)

SpringBoot\_v2 项目是努力打造 springboot 框架的极致细腻的脚手架。原生纯净，可在线生成 controller、mapperxml、dao、service、html、sql 代码，极大减少开发难度，增加开发进度神器脚手架。

*   没有基础版、没有 vip 版本、没有付费群、没有收费二维码。
*   对新手友好，配置好数据库连接即可运行。
*   满足一般中小企业的基本需求。
*   功能简单，无其他杂七杂八的功能

![image-20230905152051148](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2924a759d5534f5c88ce8a9ca98f8300~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1526&h=711&s=203145&e=png&b=fbfbfb)

### 1.13 lamp-cloud

> *   项目地址：[gitee.com/zuihou111/l…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzuihou111%2Flamp-cloud "https://gitee.com/zuihou111/lamp-cloud") （star 5k）

Iamp-cloud 是一个微服务中后台快速开发平台，可以通过插件无缝切换是否启用SaaS模式、通过配置切换SaaS模式采用独立数据库模式还是字段模式。

她具备SaaS模式切换、完备的RBAC功能、网关统一鉴权、灰度发布、数据权限、可插拔缓存、统一封装缓存的key、表单校验前后端统一验证、字典数据自动回显、Xss防跨站攻击、自动生成前后端代码、多种存储系统、分布式事务、分布式定时任务等多个功能和模块， 支持多业务系统并行开发， 支持多服务并行开发，是中后台系统开发脚手架的最佳选择。代码简洁，注释齐全，架构清晰，非常适合学习和企业作为基础框架使用。

核心技术采用Spring Cloud Alibaba、SpringBoot、Mybatis、Seata、Sentinel、RabbitMQ、FastDFS/MinIO、SkyWalking等主要框架和中间件。希望能努力打造一套从 JavaWeb基础框架 - 分布式微服务架构 - 持续集成 - 系统监测 的解决方案。项目旨在实现基础能力，不涉及具体业务。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b7b3e8651f42fe8781995c84d99909~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1713&h=933&s=75093&e=png&a=1&b=fefefe)

### 1.14 microservices-platform

> *   项目地址：[gitee.com/zlt2000/mic…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzlt2000%2Fmicroservices-platform "https://gitee.com/zlt2000/microservices-platform") （star 7.6k）

基于SpringBoot2.x、SpringCloud和SpringCloudAlibaba并采用前后端分离的企业级微服务多租户系统架构。并引入组件化的思想实现高内聚低耦合，项目代码简洁注释丰富上手容易，适合学习和企业中使用。

真正实现了基于RBAC、jwt和oauth2的无状态统一权限认证的解决方案，面向互联网设计同时适合B端和C端用户，支持CI/CD多环境部署，并提供应用管理方便第三方系统接入；同时还集合各种微服务治理功能和监控功能。

模块包括:企业级的认证系统、开发平台、应用监控、慢sql监控、统一日志、单点登录、Redis分布式高速缓存、配置中心、分布式任务调度、接口文档、代码生成等等。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03c1cf6232ff42798c74b64ed12013c6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2455&h=1361&s=245567&e=png&b=fdfdfd)

### 1.15 MCMS

> *   项目地址：[gitee.com/mingSoft/MC…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FmingSoft%2FMCMS "https://gitee.com/mingSoft/MCMS") （star 19k）

完整开源的 CMS。基于SpringBoot 2架构，前端基于vue、element ui。每月28定期更新版本，为开发者提供上百套免费模板,同时提供适用的插件（文章、商城、微信、论坛、会员、评论、支付、积分、工作流、任务调度等…），一套简单好用的开源系统、一整套优质的开源生态内容体系。

铭飞的使命就是降低开发成本提高开发效率，提供全方位的企业级开发解决方案。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ebfae22a4da4222aa52978fdee25521~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=934&s=689495&e=png&b=faf9f9)

二、后台管理系统
--------

### 2.1 EL-ADMIN

> *   项目地址：[github.com/elunez/elad…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Felunez%2Feladmin "https://github.com/elunez/eladmin") （star:20.1k)

EL-ADMIN 项目基于 Spring Boot 2.1.0 、 Jpa、 Spring Security、redis、Vue的前后端分离的后台管理系统，项目采用分模块开发方式， 权限控制采用 RBAC，支持数据字典与数据权限管理，支持一键生成前后端代码，支持动态路由。

主要功能：

*   **用户管理**：提供用户的相关配置，新增用户后，默认密码为123456
    
*   **角色管理**：对权限与菜单进行分配，可根据部门设置角色的数据权限
    
*   **菜单管理**：已实现菜单动态路由，后端可配置化，支持多级菜单
    
*   **部门管理**：可配置系统组织架构，树形表格展示
    
*   **岗位管理**：配置各个部门的职位
    
*   **字典管理**：可维护常用一些固定的数据，如：状态，性别等
    
*   **操作日志**：记录用户操作的日志
    
*   **异常日志**：记录异常日志，方便开发人员定位错误
    
*   **SQL监**控：采用druid 监控数据库访问性能，默认用户名admin，密码123456
    
*   **定时任务**：整合Quartz做定时任务，加入任务日志，任务运行情况一目了然
    
*   **代码生成**：高灵活度一键生成前后端代码，减少百分之80左右的工作任务
    
*   **邮件工具**：配合富文本，发送html格式的邮件
    
*   **免费图床**：使用sm.ms图床，用作公共图片上传使用，该图床不怎么稳定，不太建议使用
    
*   **七牛云存储**：可同步七牛云存储的数据到系统，无需登录七牛云直接操作云数据
    
*   **支付宝支付**：整合了支付宝支付并且提供了测试账号，可自行测试
    
    ![image-20230905152923388](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fef8468883d7455c8d86dbd876953836~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=158693&e=png&b=fefefe)
    

### 2.2 jeeSpringCloud

> *   项目地址：[gitee.com/JeeHuangBin…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FJeeHuangBingGui%2FjeeSpringCloud "https://gitee.com/JeeHuangBingGui/jeeSpringCloud") （star 10.6k）

jeeSpringCloud 基于SpringBoot2.0的后台权限管理系统界面简洁美观敏捷开发系统架构。核心技术采用Spring、MyBatis、Shiro没有任何其它重度依赖。互联网云快速开发框架,微服务分布式代码生成的敏捷开发系统架构。

项目代码简洁,注释丰富,上手容易,还同时集中分布式、微服务，同时包含许多基础模块和监控、服务模块。

模块包括:定时任务调度、服务器监控、平台监控、平台设置、开发平台、单点登录、Redis分布式高速缓存、会员、营销、在线用户、日志、在线人数、访问次数、调用次数、直接集群、接口文档、生成模块、代码实例、安装视频、教程文档 代码生成(单表、主附表、树表、列表和表单、redis高速缓存对接代码、图表统计、地图统计、vue.js)、dubbo、springCloud、SpringBoot、mybatis、spring、springmvc。

### 2.3 springboot-plus

> *   项目地址：[gitee.com/xiandafu/sp…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fxiandafu%2Fspringboot-plus "https://gitee.com/xiandafu/springboot-plus") （star 6.1k）

springboot-plus 是一个基于SpringBoot 2 的管理后台系统,包含了用户管理，组织机构管理，角色管理，功能点管理，菜单管理，权限分配，数据权限分配，代码生成等功能 相比其他开源的后台系统，SpringBoot-Plus 具有一定的复杂度。系统基于Spring Boot2.1技术，前端采用了Layui2.4。

数据库以`MySQL`/`Oracle`/`Postgres`/`SQLServer`为实例，理论上是跨数据库平台。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f466961dc4143678b8825255eacf198~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1305&h=794&s=69921&e=png&b=fcfcfc)

### 2.4 Timo

> *   项目地址：[gitee.com/aun/Timo](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Faun%2FTimo "https://gitee.com/aun/Timo") （star 3.2k）

TIMO 后台管理系统，基于SpringBoot2.0 + Spring Data Jpa + Thymeleaf + Shiro 开发的后台管理系统，采用分模块的方式便于开发和维护，支持前后台模块分别部署，目前支持的功能有：权限管理、部门管理、字典管理、日志记录、文件上传、代码生成等，为快速开发后台系统而生的脚手架！

![image-20230905153429262](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed91ac233044490d99d293c734c6810d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=275042&e=png&b=fefefe)

### 2.5 Guns

> *   项目地址：[gitee.com/stylefeng/g…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fstylefeng%2Fguns "https://gitee.com/stylefeng/guns") （star 15.1k）

Guns 基于Spring Boot2，致力于做更简洁的后台管理系统。包含系统管理，代码生成，多数据库适配，SSO单点登录，工作流，短信，邮件发送，OAuth2登录，任务调度，持续集成，docker部署等功。支持Spring Cloud Alibaba微服务。

![section](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edc664f8317248ed857824d51fb1ea9a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=3832&h=1901&s=266173&e=png&b=fefefe)

三、电商系统
------

### 3.1 mall(推荐)

> *   项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall") （star 69.6k）

mall 项目是一套电商系统，包括前台商城系统及后台管理系统，基于SpringBoot+MyBatis实现，采用Docker容器化部署。

前台商城系统包含首页门户、商品推荐、商品搜索、商品展示、购物车、订单流程、会员中心、客户服务、帮助中心等模块。

后台管理系统包含商品管理、订单管理、会员管理、促销管理、运营管理、内容管理、统计报表、财务管理、权限管理、设置等模块。

![image-20230905153718458](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc93cf29d47b40eb83b7648a240a3111~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=197844&e=png&b=ffffff)

### 3.2 mall-swarm

> *   项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm") （star 10.7k）

mall-swarm 是一套微服务商城系统，采用了 Spring Cloud Greenwich、Spring Boot 2、MyBatis、Docker、Elasticsearch等核心技术，同时提供了基于Vue的管理后台方便快速搭建系统。mall-swarm在电商业务的基础集成了注册中心、配置中心、监控中心、网关等系统功能。

### 3.3 newbee-mall

> *   项目地址：[github.com/newbee-ltd/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnewbee-ltd%2Fnewbee-mall "https://github.com/newbee-ltd/newbee-mall") (star 10.3k)

newbee-mall 项目（新蜂商城）是一套电商系统，包括 newbee-mall 商城系统及 newbee-mall-admin 商城后台管理系统，基于 Spring Boot 2.X 及相关技术栈开发。

前台商城系统包含首页门户、商品分类、新品上线、首页轮播、商品推荐、商品搜索、商品展示、购物车、订单结算、订单流程、个人订单管理、会员中心、帮助中心等模块。后台管理系统包含数据面板、轮播图管理、商品管理、订单管理、会员管理、分类管理、设置等模块。

![image-20230905153836587](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8745995d894f423991d741500a4aa20d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=1069380&e=png&b=fcfafa)

### 3.4 onemall

> *   项目地址：[github.com/YunaiV/onem…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYunaiV%2Fonemall "https://github.com/YunaiV/onemall") (star 40k )

onemall 商城，基于微服务的思想，构建在 B2C 电商场景下的项目实战。核心技术栈是 Spring Boot + Dubbo 。

![image-20230905154105800](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d850af376c714630aa4b2b6199da7bf7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=192122&e=png&b=ffffff)

### 3.5 litemall

> *   项目地址：[github.com/linlinjava/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flinlinjava%2Flitemall "https://github.com/linlinjava/litemall") （star 18.3k）

litemall 是 一个商城项目，包括Spring Boot后端 + Vue管理员前端 + 微信小程序用户前端 + Vue用户移动端。

### 3.6 xbin-store

> *   项目地址：[github.com/xubinux/xbi…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxubinux%2Fxbin-store "https://github.com/xubinux/xbin-store") （star 2.1k）

xbin-store 模仿国内知名B2C网站,实现的一个分布式B2C商城 使用Spring Boot 自动配置 Dubbox / MVC / MyBatis / Druid / Solr / Redis 等，它有Spring Cloud版本和Dubbox版本。

![image-20230905154316537](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95b2641e64a0466e93fc22c2530e12ab~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1448&h=755&s=116634&e=png&b=fdfdfd)

### 3.7 zscat\_sw

> *   项目地址：[gitee.com/catshen/zsc…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fcatshen%2Fzscat_sw "https://gitee.com/catshen/zscat_sw") （star 7k）

zscat\_sw 是基于springboot dubbo构建的一个商城项目，包括前端，后端和h5应用，小程序，作为zscat应用实践的模板项目。包含sso登录、API网关、流量控制、自定义协议包装、、自动crud、自动缓存、读写分离、分布式缓存、分布式定时任务、分布式锁、消息队列、事件机制、oauth2.0登录、全文搜索、集成qiniu文件服务、集成dubbo、集成springcboot等功能。

![image-20230905154422639](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5235fc111c8b4f22a54df0c97a485b40~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=100452&e=png&b=fefefe)

四、人力资源管理系统
----------

### 4.1 vhr - 微人事

> *   项目地址：[github.com/lenve/vhr](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flenve%2Fvhr "https://github.com/lenve/vhr") （star 26.3k）

微人事 是一个前后端分离的人力资源管理系统，项目采用 SpringBoot + Vue 开发。权限管理相关的模块主要有两个，分别是 \[系统管理->基础信息设置->权限组\] 可以管理角色和资源的关系， \[系统管理->操作员管理\] 可以管理用户和角色的关系。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24d1f6ecca7a4550b39e291da8f2b574~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1485&h=763&s=193564&e=png&b=fdfcfc)

### 4.2 oasys-OA自动化办公系统

> *   项目地址：[gitee.com/aaluoxiang/…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Faaluoxiang%2Foa_system "https://gitee.com/aaluoxiang/oa_system") （star 7k）

办公自动化（OA）是面向组织的日常运作和管理，员工及管理者使用频率最高的应用系统，极大提高公司的办公效率。

oasys是一个OA办公自动化系统，使用Maven进行项目管理，基于springboot框架开发的项目，mysql底层数据库，前端采用freemarker模板引擎，Bootstrap作为前端UI框架，集成了jpa、mybatis等框架。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b790316f0f94f9ebc0486272d22be9b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1928&h=1048&s=149990&e=png&b=f9f9f9)

五、支付案例
------

### 5.1 spring-boot-pay

> *   项目地址：[gitee.com/52itstyle/s…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2F52itstyle%2Fspring-boot-pay "https://gitee.com/52itstyle/spring-boot-pay") （star 10.1k）

spring-boot-pay 是一个支付案例，提供了包括支付宝、微信、银联在内的详细支付代码案例，对于有支付需求的小伙伴来说，这个项目再合适不过了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dcd3a1c30c64966896194473b358748~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=720&h=386&s=37891&e=png&b=fbfbfb)

六、秒杀系统
------

### 6.1 spring-boot-seckill

> *   项目地址：[gitee.com/52itstyle/s…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2F52itstyle%2Fspring-boot-seckill "https://gitee.com/52itstyle/spring-boot-seckill") （star 13.4k）

从0到1构建分布式秒杀系统，脱离案例讲架构都是耍流氓。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c821dfa01e44742a8f548b22f96e2d8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=635&s=401992&e=png&b=f6f4f3)

七、博客管理系统
--------

### 7.1 VBlog

> *   项目地址：[github.com/lenve/VBlog](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flenve%2FVBlog "https://github.com/lenve/VBlog") （star 7k）

V部落，Vue+SpringBoot实现的多用户博客管理平台！

![image-20230905155000221](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27f8c6ac90a54e0baaa4a736a403f8ef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1570&h=703&s=97531&e=png&b=fdfdfd)

### 7.2 halo

> *   项目地址：[github.com/halo-dev/ha…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhalo-dev%2Fhalo "https://github.com/halo-dev/halo") （star28.6k）

Halo 是一款现代化的个人独立博客系统，给习惯写博客的同学多一个选择。一个优秀的开源博客发布应用。

![image-20230905155216659](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b294a414cf407a95cd4afa4848934b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1715&h=1050&s=298450&e=png&b=ffffff)

### 7.3 NiceFish

> *   项目地址：[gitee.com/mumu-osc/Ni…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fmumu-osc%2FNiceFish "https://gitee.com/mumu-osc/NiceFish") （star 5.3k）

NiceFish（美人鱼） 是一个系列项目，目标是示范前后端分离的开发模式:前端浏览器、移动端、Electron 环境中的各种开发模式；后端有两个版本：SpringBoot 版本和 SpringCloud 版本。

![image-20230905155144363](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/084c607db5d94cb090de7579393ec966~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2549&h=1257&s=1033456&e=png&b=fefefe)