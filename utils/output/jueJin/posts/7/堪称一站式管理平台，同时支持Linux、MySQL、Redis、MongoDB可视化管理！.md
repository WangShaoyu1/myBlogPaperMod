---
author: "MacroZheng"
title: "堪称一站式管理平台，同时支持Linux、MySQL、Redis、MongoDB可视化管理！"
date: 2022-10-10
description: "最近发现一款好用的可视化管理工具，可以通过Web的形式进行Linux系统管理，同时支持MySQL、Redis、MongoDB等数据库的管理，功能非常强大，今天就给大家介绍下这款工具！"
tags: ["Java","后端","MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:64,comments:0,collects:158,views:6583,"
---
> 最近发现一款好用的可视化管理工具`mayfly-go`，可以通过Web的形式进行Linux系统管理，同时支持MySQL、Redis、MongoDB等数据库的管理，功能非常强大！今天就给大家介绍下这款工具，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

mayfly-go简介
-----------

mayfly-go号称Web版Linux、数据库、Redis、MongoDB统一管理操作平台，是一款开源的可视化管理工具。

它的主要功能如下：

*   Linux系统管理：支持查看Linux系统信息和进程管理，内置了Web版的SSH终端工具。
*   数据库管理：目前仅支持MySQL和PostgreSQL，类似于简化版的Navicat，功能不多但基本能满足我们的数据库管理需求。
*   Redis管理：支持Redis服务信息的查看及数据管理。
*   MongoDB管理：支持MongoDB服务信息的查看及数据管理。
*   系统管理：拥有完整的权限管理功能及日志、水印等功能。

下面是mayfly-go使用过程中的效果图，功能还是非常完善的！

![](/images/jueJin/826d95e6eec44f0.png)

安装
--

> mayfly-go在Linux下的安装非常简单，仅需下载安装包并配置下即可。

*   首先我们需要下载它的安装包，下载地址：[gitee.com/objs/mayfly…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fobjs%2Fmayfly-go%2Freleases "https://gitee.com/objs/mayfly-go/releases")

![](/images/jueJin/59aeb138240349d.png)

*   下载完成后上传到Linux服务器并解压，解压完成后文件夹内容如下；

![](/images/jueJin/5e9f96cb25164dc.png)

*   接下来修改配置文件`config.yml`，仅需修改MySQL的连接配置即可；

```yaml
mysql:
host: localhost:3306
username: root
password: root
db-name: mayfly-go
config: charset=utf8&loc=Local&parseTime=true
max-idle-conns: 5
```

*   创建`mayfly-go`数据库，导入`mayfly-go.sql`文件，之后使用`startup.sh`命令启动服务；

![](/images/jueJin/704c534b9cb3401.png)

*   启动成功后使用账号密码登录`admin/admin123.`，访问地址：[http://192.168.3.105:8888](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8888 "http://192.168.3.105:8888")

![](/images/jueJin/4990654c7bc5422.png)

使用
--

> 接下来我们将使用它来管理Linux服务器和各类数据库，看看它是否够好用！

### 项目管理

*   在使用前我们需要先创建项目；

![](/images/jueJin/8b431274b771446.png)

*   创建完成后给项目配置环境信息；

![](/images/jueJin/8947229d38e4444.png)

*   再给项目配置成员，比如超级管理员`admin`，至此就可以开始使用mayfly-go来管理服务器了。

![](/images/jueJin/00f4fde80949451.png)

### 机器管理

> mayfly-go支持Linux服务器管理，它不仅支持服务器状态的查看还内置了SSH终端工具。

*   首先添加一台服务器，配置好连接信息即可；

![](/images/jueJin/fdc87f3ae5904d2.png)

*   配置完成后，我们在机器列表中可以发现有`终端、文件、脚本、进程`这几个功能；

![](/images/jueJin/497089bc5b9f447.png)

*   点击`服务器地址`我们可以查看服务器的状态信息；

![](/images/jueJin/9c15ff49e9d840b.png)

*   点击`终端`可以打开一个SSH终端工具，直接操作服务器；

![](/images/jueJin/58a8f07444a4472.png)

*   点击`进程`可以查看并管理服务器上运行的进程。

![](/images/jueJin/8d7a24b39b4a410.png)

### 数据库管理

> mayfly-go支持关系型数据库的管理，功能等同于迷你版的Navicat，目前仅支持MySQL和PostgreSQL。

*   在使用前我们需要先添加`数据库资源`，输入数据库连接信息即可；

![](/images/jueJin/0715b1f5834946c.png)

*   点击`数据库名称`后我们可以查看数据库表信息、进行表管理和导出操作；

![](/images/jueJin/663c400d52de4e1.png)

*   在`数据操作`功能中，可以选择表并查看表中数据，点击数据列还能进行数据的修改；

![](/images/jueJin/8abc46f9fff74b2.png)

*   如果你想直接使用SQL操作数据库的话，可以使用`查询`功能，支持各种SQL语法提示，还是挺方便的！

![](/images/jueJin/291d63468d2f4d9.png)

### Redis管理

> mayfly-go也支持Redis的管理，可以用来查看Redis的信息及数据管理。

*   我们需要先添加一个Redis资源，配置好Redis的连接信息即可；

![](/images/jueJin/93633e5d65964e1.png)

*   点击`单机信息`可以查看Redis的信息；

![](/images/jueJin/eca78cdc5c1d49a.png)

*   在`数据操作`功能中我们可以对Redis中的数据进行管理。

![](/images/jueJin/1e5b2fb7dd3f4fb.png)

### MongoDB管理

> mayfly-go也支持MongoDB的管理，可以用来查看MongoDB的信息及数据管理。

*   我们需要先添加一个MongoDB资源，配置好MongoDB的连接信息即可；

![](/images/jueJin/cf3ba27fad424ff.png)

*   点击`数据库`功能可以查看MongoDB中包含的数据库及集合信息；

![](/images/jueJin/25255fe394b84fa.png)

*   使用`数据操作`功能可以实现对数据的管理。

![](/images/jueJin/1ba97542450e4a4.png)

### 系统管理

> mayfly-go还提供了完整的权限管理功能，支持对账号的角色以及资源进行分配。

*   在`账号管理`中我们可以对账号进行管理，支持角色分配；

![](/images/jueJin/f42ec5b027ff47d.png)

*   在`角色管理`中我们可以对角色进行管理，支持分配菜单和权限；

![](/images/jueJin/3fe7066a654847d.png)

*   在`资源管理`中我们可以对菜单和权限进行管理，可以发现mayfly-go的权限是绑定在菜单之下的；

![](/images/jueJin/52b227e0a15240d.png)

*   在`操作日志`中可以查看每个用户的操作记录；

![](/images/jueJin/a4cbddcd9ef245e.png)

*   在`系统配置`中可以进行水印和验证码的开启和关闭。

![](/images/jueJin/35f613d74679472.png)

总结
--

mayfly-go确实是一款功能非常完善的一站式Web管理平台，用来管理Linux服务器和各类数据库正合适。它能让我们在无需安装客户端工具的情况下，以Web的形式操作Linux系统和各种服务，还提供了完善的权限管理功能，感兴趣的小伙伴可以尝试下它！

参考资料
----

官方文档：[objs.gitee.io/mayfly-go-d…](https://link.juejin.cn?target=https%3A%2F%2Fobjs.gitee.io%2Fmayfly-go-docs%2F "https://objs.gitee.io/mayfly-go-docs/")

项目地址
----

[gitee.com/objs/mayfly…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fobjs%2Fmayfly-go "https://gitee.com/objs/mayfly-go")