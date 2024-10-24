---
author: "MacroZheng"
title: "支持Nacos 210！这套Spring Cloud Gateway + Oauth2 微服务权限终极解决方案升级了！"
date: 2022-07-19
description: "最近抽空把之前文章中的微服务权限解决方案给升级了，支持了最新版的Spring Cloud和Nacos。今天再来介绍下这套微服务权限终极解决方案，希望对大家有所帮助！"
tags: ["Java","后端","Spring Cloud中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:114,comments:13,collects:337,views:14186,"
---
> 最近经常有小伙伴问我关于在微服务中使用Oauth2的问题，其实之前已经写过一篇相关文章了。这次抽空把之前文章中的Demo给升级了，支持了最新版的Spring Cloud和Nacos。今天再来介绍下这套微服务权限终极解决方案，希望对大家有所帮助！

SpringCloud实战电商项目`mall-swarm`（8.8k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")

实现思路
----

> 首先还是来聊聊这套解决方案的实现思路，我们理想的解决方案应该是这样的，认证服务负责统一认证，网关服务负责校验认证和鉴权，其他API服务则负责处理自己的业务逻辑。安全相关的逻辑只存在于认证服务和网关服务中，其他服务只是单纯地提供服务而没有任何安全相关逻辑。

这套解决方案中相关服务的划分如下：

*   `micro-oauth2-gateway`：网关服务，负责请求转发和鉴权功能，整合Spring Security+Oauth2；
*   `micro-oauth2-auth`：认证服务，负责对登录用户进行认证，整合Spring Security+Oauth2；
*   `micro-oauth2-api`：API服务，受网关服务的保护，用户鉴权通过后可以访问该服务，不整合Spring Security+Oauth2。

升级注意点
-----

*   这里项目的依赖版本都升级了，支持`SpringBoot 2.7.0`和最新版的Spring Cloud；

```xml
<properties>
<spring-boot.version>2.7.0</spring-boot.version>
<spring-cloud.version>2021.0.3</spring-cloud.version>
<spring-cloud-alibaba.version>2021.0.1.0</spring-cloud-alibaba.version>
</properties>
```

*   这里不得不吐槽下Spring Cloud的版本号，之前名字采用了伦敦地铁站的名字，根据字母表的顺序来对应版本时间顺序，后来又改成了年份，现在又添加了之前废弃的地铁站名字作为别名，真是让人迷惑；

![](/images/jueJin/12375f24fa794d6.png)

*   SpringBoot 2.7.0版本中使用Maven插件需要添加版本号；

```xml
<plugin>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-maven-plugin</artifactId>
<version>${spring-boot.version}</version>
</plugin>
```

*   最新版本的Spring Cloud已经放弃使用Ribbon来做负载均衡了，转而使用LoadBalancer，所以网关服务`micro-oauth2-gateway`中还需添加LoadBalancer依赖；

```xml
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

*   如果不添加LoadBalancer依赖，从网关调用任意服务会返回`Service Unavailable`错误信息；

```json
    {
    "timestamp": "2022-06-28T02:36:31.680+00:00",
    "path": "/auth/oauth/token",
    "status": 503,
    "error": "Service Unavailable",
    "requestId": "c480cefa-1"
}
```

*   `micro-oauth2-auth`认证服务需要升级版本，注意使用的JWT库也要同步升级；

```xml
<dependencies>
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-oauth2</artifactId>
<version>2.2.5.RELEASE</version>
</dependency>
<dependency>
<groupId>com.nimbusds</groupId>
<artifactId>nimbus-jose-jwt</artifactId>
<version>9.23</version>
</dependency>
</dependencies>
```

*   下载Nacos 2.1.0版本，下载地址：[github.com/alibaba/nac…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fnacos%2Freleases "https://github.com/alibaba/nacos/releases")

![](/images/jueJin/55a071fa88624a2.png)

*   下载完成后解压到指定目录即可，使用如下命令启动Nacos；

```bash
startup.cmd -m standalone
```

*   访问Nacos控制台，使用账号密码`nacos:nacos`进行登录，访问地址：[http://localhost:8848/nacos/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8848%2Fnacos%2F "http://localhost:8848/nacos/")

![](/images/jueJin/cab2cb9523f7480.png)

使用
--

> 本文仅作为[微服务权限终极解决方案，Spring Cloud Gateway + Oauth2 实现统一认证和鉴权！](https://juejin.cn/post/6850037263707930631 "https://juejin.cn/post/6850037263707930631") 升级版本的补充，具体代码实现可以参考该文，下面演示下该解决方案中的统一认证和鉴权功能。

*   首先需要启动Nacos和Redis服务，然后依次启动`micro-oauth2-auth`、`micro-oauth2-gateway`及`micro-oauth2-api`服务，启动完成后Nacos服务列表显示如下；

![](/images/jueJin/cef1e00fe15d49b.png)

*   使用密码模式获取JWT令牌，访问地址：[http://localhost:9201/auth/oauth/token](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9201%2Fauth%2Foauth%2Ftoken "http://localhost:9201/auth/oauth/token")

![](/images/jueJin/9dfb1c2f132c4ab.png)

*   不带JWT令牌访问受保护的API接口，访问地址：[http://localhost:9201/api/hello](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9201%2Fapi%2Fhello "http://localhost:9201/api/hello")

![](/images/jueJin/b2a17830771f4bc.png)

*   带JWT令牌访问受保护的API接口，注意请求头`Authorization`添加`Bearer` 前缀，可以正常访问；

![](/images/jueJin/1f06adec10ad45a.png)

*   使用获取到的JWT令牌访问获取当前登录用户信息的接口，访问地址：[http://localhost:9201/api/user/currentUser](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9201%2Fapi%2Fuser%2FcurrentUser "http://localhost:9201/api/user/currentUser")

![](/images/jueJin/fdf4b33e4d064e5.png)

*   当JWT令牌过期时，使用接口返回的`refreshToken`获取新的JWT令牌，访问地址：[http://localhost:9201/auth/oauth/token](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9201%2Fauth%2Foauth%2Ftoken "http://localhost:9201/auth/oauth/token")

![](/images/jueJin/cf027f55727a4b9.png)

*   使用没有访问权限的`andy:123456`账号登录，访问接口时会返回如下信息，访问地址：[http://localhost:9201/api/hello](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9201%2Fapi%2Fhello "http://localhost:9201/api/hello")

![](/images/jueJin/626bf1f8dd904d0.png)

总结
--

在微服务系统中实现权限功能时，我们不应该把重复的权限校验功能集成到每个独立的API服务中去，而应该在网关做统一处理，然后通过认证中心去统一认证，这样才是优雅微服务权限解决方案！

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning%2Ftree%2Fmaster%2Fmicro-oauth2 "https://github.com/macrozheng/springcloud-learning/tree/master/micro-oauth2")