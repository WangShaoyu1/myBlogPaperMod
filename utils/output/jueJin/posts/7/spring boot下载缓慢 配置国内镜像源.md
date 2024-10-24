---
author: "Gaby"
title: "spring boot下载缓慢 配置国内镜像源"
date: 2023-08-11
description: "spring boot下载缓慢 配置国内镜像源,右击pomxml 文件 maven选项 craete settingsxml 配置下方任意镜像之一"
tags: ["Spring Boot","maven中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:2,views:1013,"
---
右击pom.xml

![image.png](/images/jueJin/f4ab4e0c41af42b.png)

文件 maven选项 craete settings.xml

![image.png](/images/jueJin/d5b0abb6719740e.png)

配置下方任意镜像之一后续更新添加

创建完成后 create settings.xml选项会更改为open settings.xml 然后重启idea

```xml
<mirrors>
<mirror>
<id>alimaven</id>
<name>aliyun maven</name>
<url>http://maven.aliyun.com/nexus/content/groups/public/</url>
<mirrorOf>central</mirrorOf>
</mirror>
</mirrors>
```