---
author: "小u"
title: "只需要一张sql表,生成controller、service、dao、entity---自动生成代码插件"
date: 2023-09-02
description: "快速开始一个业务的开发，是每一个程序员必备的技能。如何进行快速的开发，市面上有着很多插件，良莠不齐，今天我来介绍一个自己一直在用的一个插件。easycode，如果你的项目只有crud的话，这个插件"
tags: ["Java","SpringBoot","数据库"]
ShowReadingTime: "阅读1分钟"
weight: 167
---
快速开始一个业务的开发，是每一个程序员必备的技能。

如何进行快速的开发，市面上有着很多插件，良莠不齐，今天我来介绍一个自己一直在用的一个插件。**easy code**，如果你的项目只有crud的话，这个插件可以说是一个非常好用的存在

easy code
---------

> EasyCode是基于IntelliJ IDEA Ultimate版开发的一个代码生成插件，主要通过自定义模板（基于velocity）来生成各种你想要的代码。通常用于生成Entity、Dao、Service、Controller。如果你动手能力强还可以用于生成HTML、JS、PHP等代码。理论上来说只要是与数据有关的代码都是可以生成的。

这里我用的是idea来进行演示

首先要在插件商店上下载上easycode，这个就不多说了。

![image-20230831171233726](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1eb4498db4140b4b23c57d158f23a95~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=993&h=278&s=38446&e=png&b=2c2e31)

easycode使用
----------

首先连接需要生成代码的数据库

![image-20230831171438193](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b586571b7a674344be096900fed7d510~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2188&h=820&s=147304&e=png&b=242629)

选中要生成的表右键，一张或者多张都可以

![image-20230831171535910](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06b314fd335d432088e896e3cf2f12e1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=617&h=851&s=69025&e=png&b=2c2e31)

在package里面配置要生成代码的路径![image-20230831171613882](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a5877b2154f421e85a83c9ed7960847~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=765&h=557&s=54184&e=png&b=2c2e31)

之后下面的配置我一般都是这样选择的

![image-20230831171701215](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12391383d1914c7f92c00302eeb62d29~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=765&h=557&s=56535&e=png&b=2c2e31)

可以根据自己需求来进行选择。

之后就发现关于这些的crud就已经出来了

![image-20230831171805686](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e787e47cf14b42b4bcd7bc8c6f88cac2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=514&h=188&s=11018&e=png&b=2c2e31)

![image-20230831171739334](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a71582a387848e8a9cdb9509977227c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=520&h=780&s=61916&e=png&b=2b2d30)

最后需要再启动类中修改一下代码，在启动类中添加mapperscan

将dao层目录进放入

java

 代码解读

复制代码

`package com.example.easycode; import org.mybatis.spring.annotation.MapperScan; import org.springframework.boot.SpringApplication; import org.springframework.boot.autoconfigure.SpringBootApplication; @SpringBootApplication @MapperScan("com.example.easycode.dao") public class EasycodeApplication {     public static void main(String[] args) {         SpringApplication.run(EasycodeApplication.class, args);     } }`

之后就可以了