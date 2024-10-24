---
author: "MacroZheng"
title: "IDEA同款数据库管理工具，提示太全了，用起来贼香！"
date: 2020-06-02
description: "最近体验了一把Jetbrains出品的数据库管理工具DataGrip，发现SQL提示真的很全，写起SQL来特别顺手，各种数据库支持也很全。整理了下其用法和使用技巧，助大家码出更高质量的SQL。 编辑器字体大小配置，通过软件设置中的Editor-Font配置可以调整编辑器字体大…"
tags: ["Java","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:37,comments:15,collects:54,views:11858,"
---
> SpringBoot实战电商项目mall（35k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

最近体验了一把Jetbrains出品的数据库管理工具`DataGrip`，发现SQL提示真的很全，写起SQL来特别顺手，各种数据库支持也很全。整理了下其用法和使用技巧，助大家码出更高质量的SQL。

下载
--

> 直接从Jetbrains的官网下载即可，下载地址：[www.jetbrains.com/datagrip/](https://link.juejin.cn?target=https%3A%2F%2Fwww.jetbrains.com%2Fdatagrip%2F "https://www.jetbrains.com/datagrip/")

![](/images/jueJin/1726fd245179d62.png)

外观配置
----

> 有时候我们的电脑屏幕过大，需要调整下字体大小，要不然看起来太小不适应，可以修改下下面两个配置。

*   软件的外观配置，通过`File->Settings`打开软件设置（用过IDEA的朋友一定很熟悉），然后可以设置软件外观的字体大小；

![](/images/jueJin/1726fd245319533.png)

*   编辑器字体大小配置，通过软件设置中的`Editor->Font`配置可以调整编辑器字体大小。

![](/images/jueJin/1726fd245438627.png)

创建数据源
-----

> 使用DataGrip操作数据库时，我们需要首先创建数据源。

*   我们可以通过`左上角的加号->Data Source->MySQL`来创建一个MySQL的数据源；

![](/images/jueJin/1726fd2453fd58b.png)

*   输入相关数据库配置以后，点击`测试连接`，我们发现连接失败了，缺少`serverTimezone`参数的配置；

![](/images/jueJin/1726fd2455c5691.png)

*   只需在`高级`选项中，设置`serverTimezone`属性的值为`Asia/Shanghai`即可；

![](/images/jueJin/1726fd2457ef974.png)

*   设置成功后，点击`测试连接`，就会返回连接成功的信息了。

![](/images/jueJin/1726fd24fb13a7c.png)

管理表相关操作
-------

> 我们先来介绍下数据库表相关操作，包括设计表、查看表数据及导出表数据。

*   连接成功后，在左侧就可以查看数据库中所有的表了；

![](/images/jueJin/1726fd24fcbf0c4.png)

*   选中表`右键->修改表`即可查看数据库表的相关信息；

![](/images/jueJin/1726fd24fd78ea1.png)

*   双击表就可以分页查看表中存储的数据了；

![](/images/jueJin/1726fd24ff0c67b.png)

*   有时候有些列的数据我们并不关心，可以右键表头选择隐藏列来隐藏它；

![](/images/jueJin/1726fd24ff9d3fc.png)

*   我们可以在顶部的过滤条件中直接编写WHERE语句来实现对数据的过滤筛选；

![](/images/jueJin/1726fd2502e0a74.png)

*   我们可以通过右键数据库名称，选择新建表；

![](/images/jueJin/1726fd2522df369.png)

*   新建时可以添加表中的列，并且可以预览对应的SQL脚本；

![](/images/jueJin/1726fd25224d288.png)

*   数据导出功能，可以将数据导出为CSV、Html、Excel、JSON等格式。

![](/images/jueJin/1726fd252702c97.png)

SQL操作技巧
-------

> 下面再介绍下在DataGrip中编写SQL的各种小技巧！

*   打开查询控制台，右键数据库，选择`Open Query Console`打开编辑器；

![](/images/jueJin/1726fd252823ea6.png)

*   强大的提示功能，对于SQL语句、数据库中的表和列均有提示；

![](/images/jueJin/1726fd252d375cd.png)

*   编写`SELECT *`语句并不是好习惯，可以通过选中`*`再使用`Alt+Enter`快捷键来直接扩展成相关列；

![](/images/jueJin/1726fd254760506.png)

*   当我们查询的表取了别名以后，可以通过`Alt+Enter`快捷键来直接为所有查询的列添加前缀；

![](/images/jueJin/1726fd252d2222a.png)

*   当我们使用`INSERT INTO`语句时，可用直接生成所有需要插入的列名；

![](/images/jueJin/1726fd254adf07a.png)

*   当我们把鼠标悬停在函数上方时，会显示非常详细的函数使用说明；

![](/images/jueJin/1726fd254bb5dcf.png)

*   使用`Ctrl+Alt+L`快捷键可以格式化我们的SQL语句；

![](/images/jueJin/1726fd254d82323.png)

*   对于执行的各种操作都会显示SQL日志；

![](/images/jueJin/1726fd2555192fe.png)

*   查看代码历史，直接右键编辑器，选择`Local History->Show History`可以打开查看SQL执行的历史记录；

![](/images/jueJin/1726fd256b7d7ae.png)

*   查看执行计划，选中目标SQL并右键，选择`Explain Plain`，即可在底部查看。

![](/images/jueJin/1726fd255878591.png)

![](/images/jueJin/1726fd2572d43e4.png)

MongoDB支持
---------

> DataGrip不仅对关系型数据库有所支持，对非关系型数据库也有所支持，下面简单介绍下如何用它管理MongoDB数据库。

*   创建数据源，通过`左上角的加号->Data Source->MongoDB`来创建一个MongoDB的数据源；

![](/images/jueJin/1726fd2577a7c15.png)

*   修改数据源配置并测试连接；

![](/images/jueJin/1726fd257888fe8.png)

*   查看集合中的信息，可以设置筛选条件；

![](/images/jueJin/1726fd2578e2b2c.png)

*   往集合中插入数据。

![](/images/jueJin/1726fd2591aa64b.png)

总结
--

本文主要讲述了在DataGrip中管理MySQL和MongoDB的常用操作及使用技巧，用过Jetbrains公司其他产品的朋友应该很容易就可以上手了！

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/172510f0b1fbb20.png)