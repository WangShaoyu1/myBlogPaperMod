---
author: "MacroZheng"
title: "MyBatis Generator使用过程中踩过的一个坑"
date: 2019-06-24
description: "在使用MyBatis Generator生成代码的过程中，曾经遇到一个坑，每次生成mapperxml的时候并不是直接覆盖原文件，而是在原文件中追加了新的内容，导致运行项目出错，本文主要讲解如何解决这个问题。 表明了PmsBrandMapperxml文件解析错误，BaseRe…"
tags: ["MyBatis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:5,comments:3,collects:9,views:9628,"
---
摘要
--

在使用MyBatis Generator生成代码的过程中，曾经遇到一个坑，每次生成mapper.xml的时候并不是直接覆盖原文件，而是在原文件中追加了新的内容，导致运行项目出错，本文主要讲解如何解决这个问题。

问题重现
----

### 示例代码

使用的是mall-tiny-02的代码，代码地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-02 "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-02")

### 直接运行MallTinyApplication的main函数

发现正常运行，启动成功！

![展示图片](/images/jueJin/16b8836566665f7.png)

### 运行代码生成器

运行com.macro.mall.tiny.mbg.Generator的main方法

### 重新启动MallTinyApplication的main函数

发现已经无法正常运行，其中有这么一行关键性的错误：

```
nested exception is org.apache.ibatis.builder.BuilderException: Error parsing Mapper XML.
The XML location is 'file [D:\developer\github\mall-learning\mall-tiny-02\target\classes\com\macro\mall\tiny\mbg\mapper\PmsBrandMapper.xml]'.
Cause: java.lang.IllegalArgumentException: Result Maps collection already contains value for com.macro.mall.tiny.mbg.mapper.PmsBrandMapper.BaseResultMap
```

**表明了PmsBrandMapper.xml文件解析错误，BaseResultMap重复定义。**

### 查看PmsBrandMapper.xml文件

从中可以发现MyBatis Generator生成的mapper.xml文件信息是直接追加在原来的文件上的，并不是直接覆盖，导致了这个错误。

![展示图片](/images/jueJin/16b88365669137f.png)

问题解决
----

> 以前一直以为是MyBatis Generator生成的问题，直接删除mapper.xml所在文件夹，重新生成就好了,现在提供一种MyBatis Generator官方提供的解决方法。

### 升级MyBatis Generator的版本

MyBatis Generator 在1.3.7版本提供了解决方案，我们目前使用的版本为1.3.3。

```
<!-- MyBatis 生成器 -->
<dependency>
<groupId>org.mybatis.generator</groupId>
<artifactId>mybatis-generator-core</artifactId>
<version>1.3.7</version>
</dependency>
```

### 在generatorConfig.xml文件中添加覆盖mapper.xml的插件

```
<!--生成mapper.xml时覆盖原文件-->
<plugin type="org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin" />
```

### 重新运行代码生成器

发现PmsBrandMapper.xml生成已经正常，应用也可以正常运行了。

![展示图片](/images/jueJin/16b88365668259b.png)

![展示图片](/images/jueJin/16b8836566e7520.png)

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-02 "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-02")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16b794607551628.png)