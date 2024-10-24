---
author: "MacroZheng"
title: "Github标星 8K+，免费又好用的Redis客户端工具！"
date: 2020-09-22
description: "以前一直使用的是RedisDesktopManager这款Redis客户端工具，由于很久没更新界面有点古老，最近想更新升级下，进到官网一看，发现收费了 于是就去Github上找了下，发现了另一个RedisDesktopManager，界面漂亮而且免费，一看Star数…"
tags: ["Java","Redis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:82,comments:10,collects:101,views:9137,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

最近在寻找一款免费又好用的Redis客户端工具，于是找到了`AnotherRedisDesktopManager`，界面漂亮而且支持Redis集群，推荐给大家！

RedisDesktopManager
-------------------

以前一直使用的是RedisDesktopManager这款Redis客户端工具，由于很久没更新界面有点古老，最近想更新升级下，进到官网一看，发现收费了......

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

AnotherRedisDesktopManager
--------------------------

于是就去Github上找了下，发现了`另一个`RedisDesktopManager，界面漂亮而且免费，一看Star数量8K+，有点厉害！就决定用它了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

使用
--

### 安装

*   首先我们需要下载安装包，然后双击安装即可，下载地址：[github.com/qishibo/Ano…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fqishibo%2FAnotherRedisDesktopManager%2Freleases "https://github.com/qishibo/AnotherRedisDesktopManager/releases")

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   安装完成后，点击`新建连接`可以连接到Redis，可以发现`Cluster`这个选项，之前使用的旧版RedisDesktopManager并不支持Redis集群，这个工具支持了很不错！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### 深色模式

我们现在使用的界面模式为浅色模式，可以从设置中打开深色模式，还是很炫酷的！

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### 命令行

支持使用Redis命令行，点击`Redis控制台`按钮即可打开。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### Redis数据操作

*   使用`新增Key`功能可以往Redis中存储键值对数据，目前支持5种数据结构；

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   我们先来存储`String`类型的键值对数据，可以发现支持文本、JSON、反序列化三种显示，而且JSON支持效果不错；

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   再来存储`List`类型的键值对，发现可以像操作表格一样操作List中的数据；

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   再来存储`Hash`类型的键值对，依然可以像操作表格一样操作HashMap中的数据。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### 集群模式

*   既然该客户端支持了集群模式，那我们也来试试吧，首先需要搭建一个Redis集群，搭建方式可以参考[《Docker环境下秒建Redis集群，连SpringBoot也整上了！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FVg8WCsyA1arLUoKENoNJQw "https://mp.weixin.qq.com/s/Vg8WCsyA1arLUoKENoNJQw")；
    
*   创建好Redis集群之后，连接任意一个Redis服务即可访问集群，注意我们的Redis服务运行端口为`6391~6396`，我们先连接到`6391`的服务；
    

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   往Redis集群中存储一个键值对数据后，连接另一个Redis服务`6392`，发现依然可以查看到该数据；

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   删除该数据后，两个连接都已经看不见该数据了，证明可以正常操作Redis集群；

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！