---
author: "MacroZheng"
title: "Github标星19K+Star，10分钟自建对象存储服务！"
date: 2019-12-31
description: "对象存储服务可以用来存储各类文件，mall项目中的图片存储采用的是OSS，今天我们来讲下如何自己搭建一个对象存储服务来存储图片。 MinIO 是一款基于Go语言的高性能对象存储服务，在Github上已有19K+Star。它采用了Apache License v20开源协议，非…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:80,comments:10,collects:100,views:14733,"
---
> SpringBoot实战电商项目mall（25k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

对象存储服务可以用来存储各类文件，`mall`项目中的图片存储采用的是OSS，今天我们来讲下如何自己搭建一个对象存储服务来存储图片。

MinIO简介
-------

MinIO 是一款基于Go语言的高性能对象存储服务，在Github上已有19K+Star。它采用了Apache License v2.0开源协议，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等。 本文将使用 MinIO 来自建一个对象存储服务用于存储图片。

安装及部署
-----

> MinIO的安装方式有很多，这里我们使用它在Docker环境下的安装方式。

*   下载MinIO的Docker镜像：

```
docker pull minio/minio
```

*   在Docker容器中运行MinIO，这里我们将MiniIO的数据和配置文件夹挂在到宿主机上：

```
docker run -p 9090:9000 --name minio \
-v /mydata/minio/data:/data \
-v /mydata/minio/config:/root/.minio \
-d minio/minio server /data
```

*   运行成功后，访问该地址来登录并使用MinIO，默认Access Key和Secret都是`minioadmin`：[http://192.168.6.132:9090](https://link.juejin.cn?target=http%3A%2F%2F192.168.6.132%3A9090 "http://192.168.6.132:9090")

![](/images/jueJin/16f56f488ee5304.png)

上传文件及使用
-------

> 通过使用MinIO的网页端即可完成文件的上传下载功能，下面我们以图片上传下载为例来演示下该功能。

*   在存储文件之前，我们需要新建一个存储桶：

![](/images/jueJin/16f56f489066f1d.png)

*   存储桶创建完成后，通过上传按钮可以上传文件，这里我们上传一张图片：

![](/images/jueJin/16f56f48908b100.png)

*   图片上传完成后，我们可以通过拷贝链接按钮来获取图片访问路径，但是这只是个临时的访问路径：

![](/images/jueJin/16f56f4890983ab.png)

*   要想获取一个永久的访问路径，需要修改存储桶的访问策略，我们可以点击存储桶右上角的编辑策略按钮来修改访问策略；

![](/images/jueJin/16f56f48938b902.png)

*   这里有三种访问策略可以选择，一种只读、一种只写、一种可读可写，这里我们选择只读即可，但是需要注意的是，访问前缀需要设置为`*.*`，否则会无法访问；

![](/images/jueJin/16f56f4894acd86.png)

*   设置完成后，我们只需要通过拷贝链接中的前一串路径即可永久访问该文件；

![](/images/jueJin/16f56f48bdfa06f.png)

*   访问图片效果展示：

![](/images/jueJin/16f56f48c1ad4ce.png)

MinIO客户端的使用
-----------

> 虽然MinIO的网页端管理已经很方便了，但是官网还是给我们提供了基于命令行的客户端MinIO Client(简称mc)，下面我们来讲讲它的使用方法。

### 常用命令

> 下面我们先来熟悉下mc的命令，这些命令和Linux中的命令有很多相似之处。

命令

作用

ls

列出文件和文件夹

mb

创建一个存储桶或一个文件夹

cat

显示文件和对象内容

pipe

将一个STDIN重定向到一个对象或者文件或者STDOUT

share

生成用于共享的URL

cp

拷贝文件和对象

mirror

给存储桶和文件夹做镜像

find

基于参数查找文件

diff

对两个文件夹或者存储桶比较差异

rm

删除文件和对象

events

管理对象通知

watch

监听文件和对象的事件

policy

管理访问策略

session

为cp命令管理保存的会话

config

管理mc配置文件

update

检查软件更新

version

输出版本信息

### 安装及配置

> 由于MinIO服务端中并没有自带客户端，所以我们需要安装配置完客户端后才能使用，这里以Docker环境下的安装为例。

*   下载MinIO Client 的Docker镜像：

```
docker pull minio/mc
```

*   在Docker容器中运行mc：

```
docker run -it --entrypoint=/bin/sh minio/mc
```

*   运行完成后我们需要进行配置，将我们自己的MinIO服务配置到客户端上去，配置的格式如下：

```
mc config host add <ALIAS> <YOUR-S3-ENDPOINT> <YOUR-ACCESS-KEY> <YOUR-SECRET-KEY> <API-SIGNATURE>
```

*   对于我们的MinIO服务可以这样配置：

```
mc config host add minio http://192.168.6.132:9090 minioadmin minioadmin S3v4
```

### 常用操作

*   查看存储桶和查看存储桶中存在的文件：

```
# 查看存储桶
mc ls minio
# 查看存储桶中存在的文件
mc ls minio/blog
```

![](/images/jueJin/16f56f48c24a83b.png)

*   创建一个名为`test`的存储桶：

```
mc mb minio/test
```

![](/images/jueJin/16f56f48c52e523.png)

*   共享`avatar.png`文件的下载路径：

```
mc share download minio/blog/avatar.png
```

![](/images/jueJin/16f56f48c7258ed.png)

*   查找`blog`存储桶中的png文件：

```
mc find minio/blog --name "*.png"
```

![](/images/jueJin/16f56f48ca9a082.png)

*   设置`test`存储桶的访问权限为`只读`：

```
# 目前可以设置这四种权限：none, download, upload, public
mc policy set download minio/test/
# 查看存储桶当前权限
mc policy list minio/test/
```

![](/images/jueJin/16f56f48e779165.png)

参考资料
----

详细了解MinIO可以参考官方文档：[docs.min.io/cn/minio-qu…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.min.io%2Fcn%2Fminio-quickstart-guide.html "https://docs.min.io/cn/minio-quickstart-guide.html")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16f3d335f89c8ad.png)