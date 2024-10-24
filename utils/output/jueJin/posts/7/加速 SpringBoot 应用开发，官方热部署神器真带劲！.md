---
author: "MacroZheng"
title: "加速 SpringBoot 应用开发，官方热部署神器真带劲！"
date: 2021-04-27
description: "平时使用SpringBoot开发应用时，修改代码后需要重新启动才能生效。如果你的应用足够大的话，启动可能需要好几分钟。有没有什么办法可以加速启动过程，让我们开发应用代码更高效呢？"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:34,comments:16,collects:45,views:5587,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

平时使用SpringBoot开发应用时，修改代码后需要重新启动才能生效。如果你的应用足够大的话，启动可能需要好几分钟。有没有什么办法可以加速启动过程，让我们开发应用代码更高效呢？今天给大家推荐一款SpringBoot官方的热部署工具`spring-boot-devtools`，修改完代码后可快速自动重启应用！

`spring-boot-devtools`简介
------------------------

SpringBoot官方开发工具，如果你的应用集成了它，即可实现热部署和远程调试。

实现原理
----

使用该工具应用为什么启动更快了？主要是因为它使用了两种不同的类加载器。基础类加载器用于加载不会改变的类（比如第三方库中的类），重启类加载器用于加载你应用程序中的类。当应用程序启动时，重启类加载器中的类将会被替换掉，这就意味着重启将比冷启动更快！

热部署
---

> 接下来我们将集成devtools，来演示下热部署功能。

*   首先需要在项目的`pom.xml`文件中，添加devtools的依赖；

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-devtools</artifactId>
<optional>true</optional>
</dependency>
```

*   为了方便测试，我们在项目中添加了如下测试接口；

```java
/**
* Created by macro on 2021/3/25.
*/
@Api(tags = "TestController", description = "SpringBoot Dev Tools测试")
@Controller
@RequestMapping("/test")
    public class TestController {
    
    @ApiOperation("测试修改")
    @RequestMapping(value = "/first", method = RequestMethod.GET)
    @ResponseBody
        public CommonResult first() {
        String message = "返回消息";
        return CommonResult.success(null,message);
    }
}
```

*   然后启动项目，启动成功后通过Swagger访问接口，返回结果如下，访问地址：[http://localhost:8088/swagger-ui.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui.html "http://localhost:8088/swagger-ui.html")

```json
    {
    "code": 200,
    "message": "返回消息",
    "data": null
}
```

*   由于在项目构建时，devtools才会自动重启项目，而IDEA默认并没有使用自动构建，此时我们可以修改应用启动配置，设置当IDEA失去焦点时自动构建项目；

![](/images/jueJin/7447e374c5bf406.png)

*   修改Controller中的代码，只要修改下`message`变量即可；

```java
/**
* Created by macro on 2021/3/25.
*/
@Api(tags = "TestController", description = "SpringBoot Dev Tools测试")
@Controller
@RequestMapping("/test")
    public class TestController {
    
    @ApiOperation("测试修改")
    @RequestMapping(value = "/first", method = RequestMethod.GET)
    @ResponseBody
        public CommonResult first() {
        String message = "返回消息（已修改）";
        return CommonResult.success(null,message);
    }
}
```

*   失去焦点后，等待项目自动构建，此时访问接口出现404问题；

```json
    {
    "timestamp": "2021-03-29T07:09:05.415+00:00",
    "status": 404,
    "error": "Not Found",
    "message": "No message available",
    "path": "/test/first"
}
```

*   由于devtools检测时间和IDEA的编译所需时间存在差异，当IDEA还没编译完成，devtools就已经重启应用了，导致了这个问题，修改`application.yml`配置文件，添加如下配置即可；

```yaml
spring:
devtools:
restart:
poll-interval: 2s
quiet-period: 1s
```

*   此时再次访问测试接口，显示内容如下，修改后的代码已经被自动应用了。

```json
    {
    "code": 200,
    "message": "返回消息（已修改）",
    "data": null
}
```

远程调试
----

> devtools除了支持热部署之外，还支持远程调试，接下来我们把应用部署到Docker容器中，然后试试远程调试！

*   由于SpringBoot默认打包不会包含devtools，所以我们需要先修改下`pom.xml`；

```xml
<plugin>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-maven-plugin</artifactId>
<configuration>
<!--打包时不排除Devtools-->
<excludeDevtools>false</excludeDevtools>
</configuration>
</plugin>
```

*   接下来需要`application.yml`文件，添加devtools的远程访问密码；

```yaml
spring:
devtools:
remote:
secret: macro666
```

*   接下来把项目打包成Docker镜像，然后使用如下命令运行起来；

```bash
docker run -p 8088:8088 --name mall-tiny-devtools \
--link mysql:db \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny/logs:/var/logs \
-d mall-tiny/mall-tiny-devtools:1.0-SNAPSHOT
```

*   添加一个启动配置，修改启动类为`org.springframework.boot.devtools.RemoteSpringApplication`，配置信息具体如下；

![](/images/jueJin/2c18aa8dc92148d.png)

*   启动该配置，控制台输出如下结果表示远程连接成功；

```yaml
2021-03-29 15:49:50.991  INFO 7848 --- [           main] o.s.b.devtools.RemoteSpringApplication   : Starting RemoteSpringApplication v2.3.0.RELEASE on DESKTOP-5NIMJ19 with PID 7848
2021-03-29 15:49:51.003  INFO 7848 --- [           main] o.s.b.devtools.RemoteSpringApplication   : No active profile set, falling back to default profiles: default
2021-03-29 15:49:51.664  WARN 7848 --- [           main] o.s.b.d.r.c.RemoteClientConfiguration    : The connection to http://192.168.5.78:8088 is insecure. You should use a URL starting with 'https://'.
2021-03-29 15:49:52.024  INFO 7848 --- [           main] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2021-03-29 15:49:52.055  INFO 7848 --- [           main] o.s.b.devtools.RemoteSpringApplication   : Started RemoteSpringApplication in 2.52 seconds (JVM running for 4.236)
```

*   接下来我们再次修改下Controller中的测试代码，只要修改下`message`变量即可；

```java
/**
* Created by macro on 2021/3/25.
*/
@Api(tags = "TestController", description = "SpringBoot Dev Tools测试")
@Controller
@RequestMapping("/test")
    public class TestController {
    
    @ApiOperation("测试修改")
    @RequestMapping(value = "/first", method = RequestMethod.GET)
    @ResponseBody
        public CommonResult first() {
        String message = "返回消息（远程调试）";
        return CommonResult.success(null,message);
    }
}
```

*   远程调试如果自动构建的话会导致远程服务频繁重启，此时我们可以使用IDEA手动构建，在项目的右键菜单中可以找到构建按钮；

![](/images/jueJin/1dde58bc05cb491.png)

*   构建成功后可以发现远程服务会自动重启，并应用修改后的代码，访问测试接口返回如下信息；

```json
    {
    "code": 200,
    "message": "返回消息（远程调试）",
    "data": null
}
```

总结
--

虽说使用SpringBoot官方的devtools可以进行热部署，但是这种方式更像是热重启，如果你想要更快的热部署体验的话可以使用JRebel。

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-devtools "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-devtools")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！