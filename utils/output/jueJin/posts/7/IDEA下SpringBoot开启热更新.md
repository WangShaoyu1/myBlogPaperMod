---
author: "Gaby"
title: "IDEA下SpringBoot开启热更新"
date: 2023-08-11
description: "在开发过程中，常会对一段业务代码不断地修改测试，往往需要重启服务，这种不必要的重复操作极大的降低了程序开发效率。为此，Spring Boot框架专门提供了进行热部署的依赖启动器，用于进行项目热部署"
tags: ["后端","Java","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:12,comments:0,collects:14,views:1336,"
---
在开发过程中，通常会对一段业务代码不断地修改测试，在修改之后往往需要重启服务，有些服务需要加载很久才能启动成功，这种不必要的重复操作极大的降低了程序开发效率。为此，Spring Boot框架专门提供了进行热部署的依赖启动器，用于进行项目热部署，而无需手动重启项目

1.  pom.xml 中引入依赖包 `spring-boot-devtools`

```xml
<!-- 引入热部署起步依赖 -->
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-devtools</artifactId>
</dependency>
```

2.  选择IDEA工具界面的【File】->【Settings】选项，打开Compiler面板设置页面  ![](/images/jueJin/71b2d3ba79cd40c.png)

3、IDEA 注册配置

### IDEA2021之前版本

1.  在项目任意页面中使用组合快捷键“Ctrl+Shift+Alt+/”打开Maintenance选项框，选中并打开Registry  ![](/images/jueJin/35fa9538f3fb478.png) 
    
2.  找到“compiler.automake.allow.when.app.running”，将该选项后的Value值勾选  ![](/images/jueJin/bc0a93e20d43411.png) 
    
3.  如果修改自己代码没有立即生效，需要按`ctrl+F9`
    

### IDEA2021之后版本

很多文章介绍IntelliJ IDEA开启热部署功能都会写到在IntelliJ IDEA中的注册表中开启compiler.automake.allow.when.app.running选项，`此选项在IntelliJ IDEA 2021.2之后的版本迁移到高级设置中`。

如下图所示：

![](/images/jueJin/31966087248d4f4.png)

如果你安装了中文语言包，那么它在这里

![](/images/jueJin/fa78a465068045b.png)