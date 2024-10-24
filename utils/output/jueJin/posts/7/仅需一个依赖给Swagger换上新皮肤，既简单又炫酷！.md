---
author: "MacroZheng"
title: "仅需一个依赖给Swagger换上新皮肤，既简单又炫酷！"
date: 2022-07-26
description: "Swagger最为方便的地方在于，你只要集成了它，一启动就能生成最新版文档，而且可以在线调试。不过Swagger的接口调试功能确实有很多缺点，今天我们使用Knife4j来增强下它！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:59,comments:12,collects:112,views:12852,"
---
> Swagger作为一款非常流行的API文档生成工具，相信很多小伙伴都在用。Swagger最为方便的地方在于，你的项目只要集成了它，一启动就能生成最新版文档，而且可以在线调试。不过Swagger的接口调试功能确实有很多缺点，比如对JSON支持不太友好。今天我们使用Knife4j来增强下它，使用的是SpringDoc提供的Swagger实现库，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊Swagger的Java库
---------------

> 首先我们来聊聊Java中两种比较流行的两种Swagger实现库，对比下哪个更好用。

### SpringFox

SpringFox是老牌的Swagger实现库，Github上标星`5.6K+`，相信很多小伙伴项目中都集成的是这个库。不过该实现库在两年前发了`3.0.0`版本后就再也没发版本了。 而且如果你在SpringBoot 2.6.x版本以上使用的话，会发现许多问题需要自行解决，具体可以参考[升级 SpringBoot 2.6.x 版本后，Swagger 没法用了！](https://juejin.cn/post/7077731765737472037 "https://juejin.cn/post/7077731765737472037") 。

![](/images/jueJin/eff36eca30d2472.png)

### SpringDoc

SpringDoc是最近才流行起来的Swagger实现库，Github上标星`2K+`，版本更新还是很快的，维护更新有保障。之前写过一篇[SpringDoc使用教程](https://juejin.cn/post/7080328458206707720 "https://juejin.cn/post/7080328458206707720") 大家可以参考下。

SpringDoc的功能还是挺强大的，不仅支持Spring WebMvc项目，还可以支持Spring WebFlux项目。

![](/images/jueJin/f7b0c37d027642b.png)

### 该选哪个

如果你的项目中已经集成了SpringFox并大量使用了，还是依然使用SpringFox吧，毕竟迁移也是需要成本的。如果你的项目是新项目目前正在技术选型阶段可以考虑使用SpringDoc，毕竟更新维护更有保障。

SpringDoc结合Knife4j使用
--------------------

> Knife4j是一款Swagger UI增强库，之前一直以为它只支持SpringFox，最近发现它也支持了SpringDoc。Knife4j可以无缝支持SpringDoc，仅需添加一个依赖即可，无需修改任何用法，非常方便！

*   这里我们还是使用[SpringDoc使用教程](https://juejin.cn/post/7080328458206707720 "https://juejin.cn/post/7080328458206707720") 中的`mall-tiny-springdoc`Demo，首先在`pom.xml`中添加Knife4j相关依赖；

```xml
<!--Knife4j的Swagger皮肤依赖-->
<dependency>
<groupId>com.github.xiaoymin</groupId>
<artifactId>knife4j-springdoc-ui</artifactId>
<version>3.0.3</version>
</dependency>
```

*   然后将项目启动起来，访问下Knife4j的默认接口文档地址：[http://localhost:8088/doc.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fdoc.html "http://localhost:8088/doc.html")

![](/images/jueJin/fe9a657018d348a.png)

*   我们找一个需要提交JSON格式请求参数的接口调试下，发现对于JSON格式参数，Knife4j提供了格式校验功能；

![](/images/jueJin/9e1575d0677d45e.png)

*   再找个返回数据比较长的接口调试下，Knife4j提供了数据折叠功能，这两个功能确实是我们比较需要的。

![](/images/jueJin/92256196d4e041d.png)

Knife4j微服务解决方案更新
----------------

> 之前出了套[微服务聚合Swagger的API文档解决方案](https://juejin.cn/post/6854573219916201997 "https://juejin.cn/post/6854573219916201997") ，也使用了Knife4j，最近把它更新支持了最新版Spring Cloud，这里我们再来聊聊这个解决方案。

### 实现原理

我们理想的解决方案应该是这样的，网关作为API文档的统一入口，网关聚合所有微服务的文档，通过在网关进行切换来实现对其他服务API文档的访问。

相关服务划分：

*   micro-knife4j-gateway：网关服务，作为微服务API文档的访问入口，聚合所有API文档，需要引入文档前端UI包；
*   micro-knife4j-user：用户服务，普通API服务，不需要引入文档前端UI包；
*   micro-knife4j-order：订单服务，普通API服务，不需要引入文档前端UI包。

### 项目地址

> [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning%2Ftree%2Fmaster%2Fmicro-knife4j "https://github.com/macrozheng/springcloud-learning/tree/master/micro-knife4j")

总结
--

像Knife4j这种，不改变Swagger原来的使用，能对Swagger进行功能增强的库确实很不错。要是能多几种这种换皮肤的实现库的话，Swagger的使用体验应该会更好！

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-springdoc "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-springdoc")