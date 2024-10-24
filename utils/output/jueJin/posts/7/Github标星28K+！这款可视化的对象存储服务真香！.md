---
author: "MacroZheng"
title: "Github标星28K+！这款可视化的对象存储服务真香！"
date: 2021-08-11
description: "在我们平时做项目的时候，文件存储是个很常见的需求。今天带大家搭建一款自己的对象存储服务，带可视化管理，用起来也挺简单！"
tags: ["Java","后端","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:18,comments:0,collects:35,views:4722,"
---
> SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

在我们平时做项目的时候，文件存储是个很常见的需求。这时候我们就会用到对象存储服务，平时我们可能会选择OSS、AWS S3这类第三方服务。今天带大家搭建一款自己的对象存储服务，带可视化管理，用起来也挺简单！

MinIO简介
-------

MinIO 是一款基于Go语言的高性能对象存储服务，在Github上已有28K+Star。它采用了Apache License v2.0开源协议，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等。

安装
--

> 使用Docker安装MinIO服务非常简单，几个命令就可以搞定！

*   首先下载MinIO的Docker镜像；

```bash
docker pull minio/minio
```

*   下载完成后使用如下命令运行MinIO服务，注意使用`--console-address`指定MinIO Console的运行端口（否则会随机端口运行）：

```bash
docker run -p 9090:9000 -p 9001:9001 --name minio \
-v /mydata/minio/data:/data \
-e MINIO_ROOT_USER=minioadmin \
-e MINIO_ROOT_PASSWORD=minioadmin \
-d minio/minio server /data --console-address ":9001"
```

*   运行成功后就可访问MinIO Console的管理界面了，输入账号密码`minioadmin:minioadmin`即可登录，访问地址：[http://192.168.7.142:9090](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.142%3A9090 "http://192.168.7.142:9090")

![](/images/jueJin/0acd49e169204aa.png)

MinIO Console使用
---------------

> MinIO Console是MinIO自带的可视化管理工具，比起上一代的可视化工具功能还是强大了不少的，下面我们来体验下这个工具。

*   先来看下上一代的MinIO Browser，基本只支持存储桶及文件的管理功能；

![](/images/jueJin/8a8aff01b5324b5.png)

*   再来看下MinIO Console，不仅支持了存储桶、文件的管理，还增加了用户、权限、日志等管理功能，强了不少；

![](/images/jueJin/1d0fb8897e0245e.png)

*   在存储文件之前，我们首先得创建一个存储桶；

![](/images/jueJin/25848127c0e8465.png)

*   创建成功后，再上传一个文件；

![](/images/jueJin/78048f54a8854eb.png)

*   上传成功后如果你想从外部访问文件的话，需要把访问策略设置为公开，这里的策略只有公开和私有两种，感觉不太灵活；

![](/images/jueJin/71edd79df5b044f.png)

*   之后把地址改为外网访问地址即可访问图片，默认只能下载不能直接查看（这个问题我们下面再解决），外网访问地址：[http://192.168.7.142:9090/blog/avatar.png](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.142%3A9090%2Fblog%2Favatar.png "http://192.168.7.142:9090/blog/avatar.png")

![](/images/jueJin/cc2c572891e2447.png)

客户端使用
-----

> 其实对于对象存储来说，MinIO Console的功能还是不够用的，所以官方还提供了基于命令行的客户端MinIO Client(简称mc)，下面我们来讲讲它的使用方法。

### 常用命令

> 我们先来熟悉下mc的命令，这些命令和Linux中的命令有很多相似之处。

命令

作用

ls

列出文件和文件夹

mb

创建一个存储桶或一个文件夹

rb

删除一个存储桶或一个文件夹

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

> 由于MinIO服务端中并没有自带客户端，所以我们需要安装并配置完客户端后才能使用，这里以Docker环境下的安装为例。

*   下载MinIO Client 的Docker镜像；

```bash
docker pull minio/mc
```

*   在Docker容器中运行mc；

```bash
docker run -it --entrypoint=/bin/sh minio/mc
```

*   运行完成后我们需要进行配置，将我们自己的MinIO服务配置到客户端上去，配置的格式如下；

```bash
mc config host add <ALIAS> <YOUR-S3-ENDPOINT> <YOUR-ACCESS-KEY> <YOUR-SECRET-KEY>
```

*   对于我们的MinIO服务可以这样配置。

```bash
mc config host add minio http://192.168.7.142:9090 minioadmin minioadmin
```

### 常用操作

*   查看存储桶和查看存储桶中存在的文件；

```bash
# 查看存储桶
mc ls minio
# 查看存储桶中存在的文件
mc ls minio/blog
```

![](/images/jueJin/af180f4c7f1a4f7.png)

*   创建一个名为`test`的存储桶；

```bash
mc mb minio/test
```

![](/images/jueJin/01cc52d490554a8.png)

*   共享`avatar.png`文件的下载路径；

```bash
mc share download minio/blog/avatar.png
```

![](/images/jueJin/7b619a9d1161422.png)

*   查找`blog`存储桶中的png文件；

```bash
mc find minio/blog --name "*.png"
```

![](/images/jueJin/aa8e99a768074bc.png)

*   设置`test`存储桶的访问权限为`只读`。

```bash
# 目前可以设置这四种权限：none, download, upload, public
mc policy set download minio/test/
# 查看存储桶当前权限
mc policy list minio/test/
```

![](/images/jueJin/f2eee6606aaf4e9.png)

兼容AWS S3
--------

> 当我们对接第三方服务要用到对象存储时，这些服务往往都是支持AWS S3的。比如说一个直播的回放功能，需要对象存储来存储回放的视频，由于MinIO兼容AWS S3的大多数API，我们可以直接拿它当AWS S3来使用。

*   我们可以下载个AWS S3的客户端来试试，MinIO到底能不能支持S3的API，这里使用的是`S3 Browser`，下载地址：[s3browser.com/](https://link.juejin.cn?target=https%3A%2F%2Fs3browser.com%2F "https://s3browser.com/")

![](/images/jueJin/49aa5d88a712437.png)

*   安装好`S3 Browser`之后，添加一个Account，输入相关登录信息，注意选择Account类型为`S3 Compatible Storage`；

![](/images/jueJin/c061ee42dc804cc.png)

*   连接成功后，我们可以看见之前我们创建的存储桶和上传的文件；

![](/images/jueJin/6ca91497eb1d48a.png)

*   `S3 Browser`这个工具功能还是很强大的，MinIO Console和它比起来实在太弱了；

![](/images/jueJin/92e1c7eb7ce2480.png)

*   上面有提到一个问题，图片文件无法直接查看，其实是因为访问图片文件时，MinIO返回的Content-Type为`application/octet-stream`导致的；

![](/images/jueJin/e391e44f336749b.png)

*   接下来我们可以通过`S3 Browser`来修改默认返回的响应头；

![](/images/jueJin/9f13f47bf78c41d.png)

*   然后将`.png`开头的文件的响应头改为`image/png`就可以了；

![](/images/jueJin/747c0614059a4f7.png)

*   需要注意的是之前上传的文件需要重新上传下才可以生效，此时访问链接就可以直接查看图片了；

![](/images/jueJin/8d8c78ad3cfb4af.png)

*   如果你想修改存储桶的访问权限的话直接通过`Permissions`标签修改即可，是不是比MinIO Console灵活多了。

![](/images/jueJin/24f3ceba95c0439.png)

总结
--

如果你想自建对象存储服务的话，MinIO确实是首选。它能兼容AWS S3的API，使用MinIO相当于是在使用AWS S3，能兼容一些主流的第三方服务。不过它自带的客户端MinIO Console确实有点鸡肋，还好支持了AWS S3，可以使用一些功能强大的S3客户端工具。

参考资料
----

官方文档：[docs.min.io/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.min.io%2F "https://docs.min.io/")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！