---
author: "starry陆离"
title: "笔记：Windows用户如何安装使用内网穿透？"
date: 2022-10-27
description: "笔记：Windows用户如何安装使用内网穿透？对于开发人员来讲，演示内网web站点、本地开发微信公众号、小程序开发、调试第三方支付系统对接等开发环境，往往需要一个环境可以进行调试。而解决办法很简单"
tags: ["掘金·日新计划"]
ShowReadingTime: "阅读3分钟"
weight: 449
---
> 持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第28天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532 "https://juejin.cn/post/7147654075599978532")

> 👨‍🎓作者简介：一位喜欢写作，计科专业的大三菜鸟
> 
> 🏡个人主页：[starry陆离 的个人主页](https://juejin.cn/user/1258265331121399 "https://juejin.cn/user/1258265331121399")
> 
> 如果文章有帮到你的话记得点赞👍+收藏💗支持一下哦

笔记：Windows用户如何安装使用内网穿透？
=======================

对于开发人员来讲，演示内网web站点、本地开发微信公众号、小程序开发、调试第三方支付系统对接等开发环境，往往需要一个环境可以进行调试。

而解决办法很简单，用内网穿透工具就可以，不需要自己搭建服务，也不需要公网IP。市面上内网穿透工具有很多，这里推荐一款简单又好用的工具，可以`永久免费使用`，`不限制流量`，支持http/https/tcp协议，不需要公网ip，也不需要设置路由器。 ![image-20221015110201640](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f90854879e14f92a8994982f9cbcea4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

cpolar的使用也很简单，在本地安装配置完成后，创建隧道即可将内网端口映射到公网，生成相应的公网地址实现公网访问内网。

* * *

将本地80端口下的web网站发布到公网可访问：
=======================

1\. 安装内网穿透工具
============

cpolar官网： [www.cpolar.com/](https://link.juejin.cn?target=https%3A%2F%2Fi.cpolar.com%2Fm%2F4Vas "https://i.cpolar.com/m/4Vas") 需要先注册一个账号，后面会用到

1.1 Windows系统
-------------

windows系统可以在官网下载最新的安装包，然后解压默认安装即可。

![image-20221015110940564](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2145f69477f406e9418563ec1cc5a77~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1.2 Linux系统
-----------

linux系统支持一键自动安装脚本

### 1.2.1 安装

*   国内使用

ruby

 代码解读

复制代码

 `curl -L https://www.cpolar.com/static/downloads/install-release-cpolar.sh | sudo bash`

*   国外使用

arduino

 代码解读

复制代码

 `curl -sL https://git.io/cpolar | sudo bash`

### 1.2.2 向系统添加服务

bash

 代码解读

复制代码

 `sudo systemctl enable cpolar`

### 1.2.3 启动服务

sql

 代码解读

复制代码

 `sudo systemctl start cpolar`

### 1.2.4 查看服务状态

lua

 代码解读

复制代码

 `sudo systemctl status cpolar`

如正常显示`active`，则说明已经启动成功。

安装成功后，cpolar会默认安装两个样例隧道：

*   一个是Website隧道指向http 8080端口
*   一个是ssh隧道（Linux&macOS系统）/远程桌面隧道（win系统），指向tcp 22端口/tcp 3389端口

2\. 创建隧道映射内网端口
==============

安装成功后，在浏览器上访问127.0.0.1:9200，使用账号登录web UI管理界面。

![1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/009930a43b3843499744ea854f7256c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

登录成功后，进入主界面

比如，我们需要将本地80端口下的web站点发布到公网可访问，只需要点击左侧仪表盘的`隧道管理`————`创建隧道`，输入隧道信息，然后点击创建即可。

*   _隧道名称：可自定义，注意不要重复_
*   _协议：选择`http`协议_
*   _本地地址：填写`80`端口_
*   _域名类型：选择`随机域名`（可免费使用）_
*   _地区：选择`China VIP`_

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/929fcd0884a4427f9abc9723029cbd8b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

隧道创建成功后，可以在`隧道管理`————`隧道列表`查看隧道状态，如为`active`激活。说明已经启动成功。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a22e2de096eb42b8bd1d9dfbf88a871d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3\. 获取公网地址
==========

点击左侧仪表盘的`状态`————`在线隧道列表`，找到我们刚刚创建的隧道，可以看到有生成相应的公网URL地址，有两行，其中一个是http隧道，一个是https隧道。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d82cd98c20654ff3a7233877090fa03b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

将公网地址复制到浏览器访问即可，实现公网远程访问内网web站点。如果你本地有正常配置页面，那么就会正常显示出来。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe7062bad6e4c91b8747a514f8fb4cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

* * *