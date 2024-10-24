---
author: "MacroZheng"
title: "还在从零开始搭建项目？这款基于SpringBoot 3的快速开发脚手架值得一试！"
date: 2023-11-09
description: "关注我Github的小伙伴应该了解，之前我开源了一款快速开发脚手架，该脚手架完整继承了mall项目的技术栈，拥有完整的权限管理功能。最近把它升级支持了Spring Boot 3，今天就来聊聊它！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:43,comments:2,collects:116,views:5713,"
---
> 关注我Github的小伙伴应该了解，之前我开源了一款快速开发脚手架`mall-tiny`，该脚手架完整继承了mall项目的技术栈，拥有完整的权限管理功能。最近抽空把该项目支持了Spring Boot 3，今天再和大家聊聊这个脚手架，同时聊聊升级项目到Spring Boot 3 的一些注意点，希望对大家有所帮助！

聊聊mall-tiny项目
-------------

> 可能有些小伙伴还不了解这个脚手架，我们先来聊聊它！

### 项目简介

mall-tiny是一款基于SpringBoot+MyBatis-Plus的快速开发脚手架，目前在Github上已有`1600+Star`。它拥有完整的权限管理功能，支持使用MyBatis-Plus代码生成器生成代码，可对接mall项目的Vue前端，开箱即用。

> 项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")

![](/images/jueJin/599de2fbea434d2.png)

### 项目演示

mall-tiny项目可无缝对接`mall-admin-web`前端项目，秒变前后端分离脚手架，由于mall-tiny项目仅实现了基础的权限管理功能，所以前端对接后只会展示了权限管理相关菜单。

> 前端项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/mall-admin-web")

![](/images/jueJin/6d6bdbf4f4b54ce.png)

### 技术选型

这次升级不仅支持了Spring Boot 3，其他依赖版本也升级了。

技术

版本

说明

SpringBoot

3.1.5

容器+MVC框架

SpringSecurity

6.1.5

认证和授权框架

MyBatis

3.5.10

ORM框架

MyBatis-Plus

3.5.3

MyBatis增强工具

MyBatis-Plus Generator

3.5.3

数据层代码生成器

SpringDoc

2.0.2

文档生产工具

Redis

5.0

分布式缓存

Docker

18.09.0

应用容器引擎

Druid

1.2.14

数据库连接池

Hutool

5.8.9

Java工具类库

JWT

0.9.1

JWT登录支持

Lombok

1.18.30

简化对象封装工具

### 数据库表结构

化繁为简，仅保留了权限管理功能相关的9张表，业务简单更加方便定制开发，觉得mall项目学习太复杂的小伙伴可以先学习下mall-tiny。

![](/images/jueJin/20a110a426a0454.png)

### 接口文档

由于Swagger依赖从SpringFox升级到了SpringDoc，原来的接口文档访问路径已经改变，最新访问地址：[http://localhost:8080/swagger-ui/index.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fswagger-ui%2Findex.html "http://localhost:8080/swagger-ui/index.html")

![](/images/jueJin/86008ff3dbe54d4.png)

### 使用流程

升级版本基本不影响之前的使用方式，具体使用流程可以参考最新版`README`文件：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")

![](/images/jueJin/ef1ef9cbef61403.png)

升级过程
----

> 接下来我们再来聊聊mall-tiny项目升级Spring Boot 3 版本主要的过程，如果你的项目也想升级Spring Boot 3 的话，了解下应该会有所帮助！

### 升级JDK 17

由于Spring Boot 3 版本最低要求为Java 17，所以我们在运行项目时需要修改项目使用的SDK为JDK 17。

![](/images/jueJin/dad322ef2f27477.png)

### 升级SpringDoc

*   由于之前使用的SpringFox提供的Swagger库，已经三年多没更新了，也不支持Spring Boot 3，所以我们需要迁移到能支持Spring Boot 3 的SpringDoc去。

![](/images/jueJin/64a7f7d1a3bd470.png)

*   我们需要修改项目的依赖，从SpringFox迁移到SpringDoc，

```xml
<!--SpringDoc 官方Starter-->
<dependency>
<groupId>org.springdoc</groupId>
<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
<version>2.0.2</version>
</dependency>
```

*   然后修改Controller和实体类上使用的SpringFox注释，主要是替换`@Api`、`@ApiOperation`、`@ApiModel`和`@ApiModelProperty`注解，具体替换参考下表。

SpringFox

SpringDoc

@Api

@Tag

@ApiIgnore

@Parameter(hidden = true)`or`@Operation(hidden = true)`or`@Hidden

@ApiImplicitParam

@Parameter

@ApiImplicitParams

@Parameters

@ApiModel

@Schema

@ApiModelProperty

@Schema

@ApiOperation(value = "foo", notes = "bar")

@Operation(summary = "foo", description = "bar")

@ApiParam

@Parameter

@ApiResponse(code = 404, message = "foo")

ApiResponse(responseCode = "404", description = "foo")

### 升级Spring Security 6

从Spring Security 5升级到6，有很多之前使用的API都废弃了，我们需要把这些废弃的用法改成Spring Security 6的新用法。

例如在SecurityConfig类中，就有这些方法已经弃用了，我们需要修改下。

![](/images/jueJin/6935731acc8844d.png)

还有就是之前实现动态权限的DynamicAccessDecisionManager和DynamicSecurityFilter类也已经被弃用了。

![](/images/jueJin/d369277f5d6f42c.png)

我们需要写一个类实现AuthorizationManager接口用于实现我们之前的动态权限逻辑，其实写法比以前更简洁了。

```java
/**
* 动态鉴权管理器，用于判断是否有资源的访问权限
* Created by macro on 2023/11/3.
*/
    public class DynamicAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {
    
    @Autowired
    private DynamicSecurityMetadataSource securityDataSource;
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    @Override
        public void verify(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
        AuthorizationManager.super.verify(authentication, object);
    }
    
    @Override
        public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext requestAuthorizationContext) {
        HttpServletRequest request = requestAuthorizationContext.getRequest();
        String path = request.getRequestURI();
        PathMatcher pathMatcher = new AntPathMatcher();
        //白名单路径直接放行
        List<String> ignoreUrls = ignoreUrlsConfig.getUrls();
            for (String ignoreUrl : ignoreUrls) {
                if (pathMatcher.match(ignoreUrl, path)) {
                return new AuthorizationDecision(true);
            }
        }
        //对应跨域的预检请求直接放行
            if(request.getMethod().equals(HttpMethod.OPTIONS.name())){
            return new AuthorizationDecision(true);
        }
        //权限校验逻辑
        List<ConfigAttribute> configAttributeList = securityDataSource.getConfigAttributesWithPath(path);
        List<String> needAuthorities = configAttributeList.stream()
        .map(ConfigAttribute::getAttribute)
        .collect(Collectors.toList());
        Authentication currentAuth = authentication.get();
        //判定是否已经实现登录认证
            if(currentAuth.isAuthenticated()){
            Collection<? extends GrantedAuthority> grantedAuthorities = currentAuth.getAuthorities();
            List<? extends GrantedAuthority> hasAuth = grantedAuthorities.stream()
            .filter(item -> needAuthorities.contains(item.getAuthority()))
            .collect(Collectors.toList());
                if(CollUtil.isNotEmpty(hasAuth)){
                return new AuthorizationDecision(true);
                    }else{
                    return new AuthorizationDecision(false);
                }
                    }else{
                    return new AuthorizationDecision(false);
                }
            }
        }
```

### 升级MyBatis-Plus

*   `mall-tiny`脚手架使用了`Mybatis-Plus`，需要升级到`3.5.3`版本支持SpringBoot 3；

```xml
<dependency>
<groupId>com.baomidou</groupId>
<artifactId>mybatis-plus-boot-starter</artifactId>
<version>3.5.3</version>
</dependency>
```

*   `Mybatis-Plus`代码生成器还需配置支持SpringDoc。

![](/images/jueJin/95a05327469041f.png)

总结
--

今天分享了下我的开源项目脚手架`mall-tiny`，以及它升级Spring Boot 3 的过程。我们在写代码的时候，如果有些用法已经废弃，应该尽量去寻找新的用法来使用，这样才能保证我们的代码足够优雅！

项目地址
----

> 开源不易，觉得项目有帮助的小伙伴点个`Star`支持下吧，Spring Boot 3 版本目前在`3.x`分支下。

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny%2Ftree%2F3.x "https://github.com/macrozheng/mall-tiny/tree/3.x")