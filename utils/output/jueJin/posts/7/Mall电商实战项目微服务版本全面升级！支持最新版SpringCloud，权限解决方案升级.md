---
author: "MacroZheng"
title: "Mall电商实战项目微服务版本全面升级！支持最新版SpringCloud，权限解决方案升级"
date: 2022-08-02
description: "前阵子我把mall项目全面升级了，支持了SpringBoot 27，相信很多小伙伴已经知道了。最近抽空把它的微服务版本也升级了，已支持最新版SpringCloud&Alibaba。"
tags: ["Java","后端","Spring Cloud中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:17,comments:1,collects:28,views:1872,"
---
> 前阵子我把[mall项目全面升级了](https://juejin.cn/post/7116694234236715038 "https://juejin.cn/post/7116694234236715038") ，支持了SpringBoot 2.7.0，相信很多小伙伴已经知道了。最近抽空把它的微服务版本`mall-swarm`也升级了，已支持最新版SpringCloud&Alibaba，今天来聊聊升级内容和升级过程中遇到的一些问题，希望对大家有所帮助！

SpringCloud实战电商项目`mall-swarm`（8.8k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")

技术栈升级
-----

> `mall-swarm`作为mall项目的微服务版本，实现功能与mall项目基本一致，只是架构有所不同。所以说mall项目中被升级的技术，`mall-swarm`基本也升级了，这里挑一些重点的提下，其他升级信息可以参考[mall项目全面升级了](https://juejin.cn/post/7116694234236715038 "https://juejin.cn/post/7116694234236715038") 。

技术

版本

说明

Spring Cloud

Hoxton.SR5->2021.0.3

微服务框架

Spring Cloud Alibaba

2.2.0->2021.0.3

微服务框架

Spring Boot

2.3.0->2.7.0

容器+MVC框架

Spring Security Oauth2

2.2.2->2.2.5

认证和授权框架

MyBatis

3.4.6->3.5.9

ORM框架

Knife4j

2.0.4->3.0.3

文档生产工具

Nacos

1.3.1->2.1.0

注册中心及配置中心

Spring Boot Admin

2.3.0->2.7.0

微服务监控

升级过程
----

> 这里整理了升级过程中遇到的一些问题，大家可以参考下！

### 支持SpringBoot 2.7.0

由于`mall-swarm`项目使用了Spring Cloud Gateway+Oauth2实现统一认证和鉴权的权限解决方案，所以说在mall项目中出现的循环依赖问题，这里并没有出现。升级SpringBoot 2.7.0还是挺顺利的，默认直接支持了！

### 支持SpringCloud 2021

升级SpringCloud 2021以后，Spring Cloud中有一个重要的组件被弃用了，那就是作为负载均衡组件的Ribbon。在有服务间调用需求的服务中，比如网关服务中，我们需要加入LoadBalancer依赖：

```xml
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

否则在服务间调用时，会返回`Service Unavailable`错误信息。

```json
    {
    "timestamp": "2022-06-28T02:36:31.680+00:00",
    "path": "/auth/oauth/token",
    "status": 503,
    "error": "Service Unavailable",
    "requestId": "c480cefa-1"
}
```

### 支持Nacos 2.1.0

之前项目使用Nacos作为注册中心和配置中心，这次把版本从`1.3.1`升级到了最新版`2.1.0`，使用上面基本没改变，除了在Windows上启动Nacos时需要添加`standalone`参数。

```bash
startup.cmd -m standalone
```

下面是使用Nacos作为配置中心的截图。

![](/images/jueJin/780e3277c364498.png)

### 微服务权限解决方案升级

升级了微服务权限解决方案，适配最新版Spring Cloud，实现思路：`mall-auth`认证服务负责统一认证，`mall-gateway`网关服务负责校验认证和鉴权，其他API服务（如mall-admin、mall-portal）则负责处理自己的业务逻辑。权限相关的逻辑只存在于认证服务和网关服务中，其他服务只是单纯地提供服务而没有任何权限相关逻辑。具体可以参考[支持Nacos 2.1.0！这套Spring Cloud Gateway+Oauth2终极权限解决方案升级了！](https://juejin.cn/post/7121892567130013732 "https://juejin.cn/post/7121892567130013732")。

### Knife4j升级

升级了Knife4j的版本，从`2.x`升级到了`3.x`，由于Knife4j基本上就是换了皮肤的Swagger，所以只要解决之前Swagger升级的问题即可，具体可以参考[升级 SpringBoot 2.6.x 版本后，Swagger 没法用了！](https://juejin.cn/post/7077731765737472037 "https://juejin.cn/post/7077731765737472037") 。

来看下新版Knife4j的页面，和之前的版本基本没啥区别。

![](/images/jueJin/d9adedab0c89496.png)

### 微服务监控升级

`mall-swarm`使用Spring Boot Admin作为微服务监控，升级后用法与之前基本一致。

![](/images/jueJin/cfcb2062c663424.png)

部署文档更新
------

> `mall-swarm`项目的部署文档也同步更新了，具体可以参考以下链接。

*   mall-swarm在Windows环境下的部署

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_swarm_deploy_windows.html "https://www.macrozheng.com/mall/deploy/mall_swarm_deploy_windows.html")

*   mall-swarm在Linux环境下的部署（基于Docker容器）

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_swarm_deploy_docker.html "https://www.macrozheng.com/mall/deploy/mall_swarm_deploy_docker.html")

运行效果演示
------

> 有的小伙伴可能还没了解过这个项目，这里展示下`mall-swarm`微服务电商项目的演示效果。

*   使用Nacos作为注册配置中心；

![](/images/jueJin/8dfdfe143568417.png)

*   使用Knife4j作为API接口文档工具；

![](/images/jueJin/1e99f1fd3b3c438.png)

*   微服务应用监控系统；

![](/images/jueJin/de0602b466f2483.png)

![](/images/jueJin/2c3d07e7bd3a43d.png)

*   微服务日志收集系统；

![](/images/jueJin/10afa889d4934ef.png)

*   微服务应用容器管理。

![](/images/jueJin/6edd7ad7aa9e40e.png)

![](/images/jueJin/8a2524120c254a6.png)

总结
--

今天分享了一下`mall-swarm`项目的升级内容和升级过程中遇到的一些问题，基本能平滑过渡。 自从改用日期作为版本号后，总感觉Spring Cloud的版本号看着有点迷糊，而且目前最新稳定版是2021，2022版本估计还在路上。

项目源码地址
------

> 开源不易，觉得项目有帮助的小伙伴点个`Star`支持下吧！

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")