---
author: "MacroZheng"
title: "Mall电商实战项目全面升级！支持最新版SpringBoot，彻底解决循环依赖"
date: 2022-07-05
description: "Mall电商实战项目全面升级了，不仅是支持了最新版SpringBoot，使用到的技术栈基本都升级到最新了！今天分享下升级内容和升级过程中遇到的一些问题，大家可以参考下！"
tags: ["Java","后端","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:27,comments:0,collects:56,views:4271,"
---
> 前不仅，SpringBoot 2.7.0 版本发布了，我也是第一时间把之前开源的脚手架项目[mall-tiny](https://juejin.cn/post/7107046500340858893 "https://juejin.cn/post/7107046500340858893") 给升级支持了！有的小伙伴提出把mall项目也升级下，于是我最近抽空把它给升级了！不仅是支持了最新版SpringBoot，使用到的技术栈基本都升级到最新了！今天分享下升级内容和升级过程中遇到的一些问题，大家可以参考下！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

技术栈升级
-----

mall项目采用现阶主流技术实现，这些主流技术基本都升级了目前最新稳定版，具体升级内容大家可以参考下表。

技术

版本

说明

SpringBoot

2.3.0->2.7.0

容器+MVC框架

SpringSecurity

5.1.4->5.7.1

认证和授权框架

MyBatis

3.4.6->3.5.9

ORM框架

MyBatisGenerator

1.3.3->1.4.1

数据层代码生成

RabbitMQ

3.7.14->3.10.5

消息队列

Redis

5.0->7.0

分布式缓存

MongoDB

4.2.5->5.0

NoSql数据库

Elasticsearch

7.6.2->7.17.3

搜索引擎

LogStash

7.6.2->7.17.3

日志收集工具

Kibana

7.6.2->7.17.3

日志可视化查看工具

Nginx

1.10->1.22

静态资源服务器

Druid

1.1.10->1.2.9

数据库连接池

MinIO

7.1.0->8.4.1

对象存储

Hutool

5.4.0->5.8.0

Java工具类库

PageHelper

5.2.0->5.3.0

MyBatis物理分页插件

Swagger-UI

2.9.2->3.0.0

文档生成工具

logstash-logback-encoder

5.3->7.2

Logstash日志收集插件

docker-maven-plugin

spotify->fabric8

应用打包成Docker镜像的Maven插件

升级过程
----

> 升级过程中遇到一些问题，这里整理了下，给想要升级这套技术栈的小伙伴一个参考！

### 支持SpringBoot 2.7.0

看了下之前使用的`2.3.0`版本，一年前就`End of Support`了，升级`2.7.0`还是很有必要的。

![](/images/jueJin/e17621416a7a4a5.png)

升级`2.7.0`版本不仅是改个版本号就行了，由于SpringBoot`2.6.x`版本开始默认禁用了循环依赖，如果你的项目中循环依赖太多的话，只能使用如下配置开启了。

```yaml
spring:
main:
allow-circular-references: true
```

既然官方都禁止使用了，我们还是从源头上解决循环依赖的好，如何优雅地解决循环依赖问题具体可以参考[mall-tiny升级支持SpringBoot 2.7.0](https://juejin.cn/post/7107046500340858893 "https://juejin.cn/post/7107046500340858893") 中的解决循环依赖部分，mall项目也使用了这种优雅的方式。

### Swagger改用Starter

之前项目中是直接使用Swagger依赖来集成的，并没有用`Starter`，这次改用了它。

```xml
<!--Swagger-UI API文档生产工具-->
<dependency>
<groupId>io.springfox</groupId>
<artifactId>springfox-boot-starter</artifactId>
<version>3.0.0</version>
</dependency>
```

在升级SpringBoot `2.6.x`版本的时候，其实Swagger就有一定的兼容性问题，需要在配置中添加`BeanPostProcessor`这个Bean，具体可以参考[升级 SpringBoot 2.6.x 版本后，Swagger 没法用了](https://juejin.cn/post/7077731765737472037 "https://juejin.cn/post/7077731765737472037") 。

### SpringSecurity用法升级

在升级SpringBoot`2.7.0`版本后，SpringSecurity中有个重要的类被弃用了，那就是一直作为配置类使用的`WebSecurityConfigurerAdapter`。

![](/images/jueJin/d5b5a62c7bb24e5.png)

新用法非常简单，无需再继承`WebSecurityConfigurerAdapter`，只需直接声明配置类，再配置一个生成`SecurityFilterChainBean`的方法，把原来的`HttpSecurity`配置移动到该方法中即可，mall项目也采用了这种新用法。

```java
/**
* SpringSecurity 5.4.x以上新用法配置
* 为避免循环依赖，仅用于配置HttpSecurity
* Created by macro on 2022/5/19.
*/
@Configuration
    public class SecurityConfig {
    
    @Bean
        SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        //省略HttpSecurity的配置
        return httpSecurity.build();
    }
    
}
```

最新版Spring Security用法具体可以参考[Spring Security 最新用法](https://juejin.cn/post/7106300827035238407 "https://juejin.cn/post/7106300827035238407") 。

### MyBatis升级

在升级MyBatis的过程中，也升级了MySQL的驱动版本，从`8.0.16`升级到了`8.0.29`。

```xml
<dependency>
<groupId>mysql</groupId>
<artifactId>mysql-connector-java</artifactId>
<version>8.0.29</version>
</dependency>
```

之前有小伙伴提出升级到该版本后，在Linux上无法连接到MySQL数据库，其实是因为默认使用了SSL连接导致的，在配置文件中添加`useSSL=false`配置即可解决。

```yaml
spring:
datasource:
url: jdbc:mysql://db:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false
username: reader
password: 123456
```

### ELK日志收集系统升级

其实每次升级SpringBoot版本，如果集成了Elasticsearch都基本要升级ES，然后整套ELK组件都得升级，这次全部升级到了`7.17.3`版本。

为什么升级该版本呢？因为SpringBoot`2.7.0`使用的Java SDK默认兼容该版本。

![](/images/jueJin/182ae0d2c0a84b5.png)

不得不说ES的Java SDK各版本兼容性很差，如果还是使用之前的`7.6.2`版本的话，运行`mall-search`中的单元测试代码会出现如下问题。很多小伙伴使用ES出现一些稀奇古怪的问题，大概率是版本兼容性问题。

![](/images/jueJin/a327e4bca245425.png)

看一眼升级后的日志收集系统，Kibana的界面更现代化了！

![](/images/jueJin/ef226ed5e92645d.png)

### MongoDB升级

MongoDB升级`5.0`用法基本和之前一致，但是在部署到Docker环境时发现，MongoDB`5.0`居然需要特定CPU支持，只得改用`4.x`版本了。

![](/images/jueJin/368ef97198b940d.png)

### 镜像打包插件改用fabric8io

之前一直使用的是`spotify`出品的`docker-maven-plugin`，用于打包应用Docker镜像并上传到服务器。上了下官网，这个插件基本上是不维护了，之前也有小伙伴反馈使用有问题。

![](/images/jueJin/f657949ba81d496.png)

现在改用了`fabric8`出品的`docker-maven-plugin`，功能更强大，更新也比较及时。

![](/images/jueJin/a8229d43226649e.png)

虽然插件换了，但用法还是一样的，配置好docker远程访问地址后直接双击`package`命令就可以实现一键打包上传应用镜像了。

![](/images/jueJin/bac466bdfeff470.png)

部署文档更新
------

项目的部署文档也同步更新了，具体可以参考以下链接。

*   mall在Windows环境下的部署

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_deploy_windows.html "https://www.macrozheng.com/mall/deploy/mall_deploy_windows.html")

*   mall在Linux环境下的部署（基于Docker容器）

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_deploy_docker.html "https://www.macrozheng.com/mall/deploy/mall_deploy_docker.html")

*   mall在Linux环境下的部署（基于Docker Compose）

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_deploy_docker_compose.html "https://www.macrozheng.com/mall/deploy/mall_deploy_docker_compose.html")

总结
--

今天分享了一下mall项目的升级内容和升级过程中遇到的一些问题，不得不说，SpringBoot确实是个很棒的框架，跨了几个大版本升级到`2.7.0`，代码几乎无需改动。SpringBoot 2.7 版本很可能成为一个钉子户版本，因为从SpringBoot 3.0 开始最低要求Java 17了，大家可以尝试下升级到该版本！

项目源码地址
------

> 开源不易，觉得项目有帮助的小伙伴点个`Star`支持下吧！

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")