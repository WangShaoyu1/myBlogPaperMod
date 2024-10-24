---
author: "MacroZheng"
title: "Podman 已成 Linux 官方标配！Docker 没戏了？"
date: 2022-03-01
description: "提到容器技术大家一般都会想到Docker，Docker确实是一种非常流行的容器技术。最近升级了CentOS8，发现内置了另一种容器技术Podman，为什么官方会加持Podman？今天我们就来体验一把！"
tags: ["Docker","Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:80,comments:15,collects:109,views:16571,"
---
> 提到容器技术大家一般都会想到Docker，Docker确实是一种非常流行的容器技术。最近升级了`CentOS 8`，发现它内置了另一种容器技术Podman，为什么官方会加持Podman？其实Podman也是RedHat开发的，自家的操作系统自然要支持自家的容器技术了。今天我们来体验一把Podman，看看它有何神奇之处！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Podman简介
--------

Podman是一个开源项目，在Github上已有`12k+Star`，可在大多数Linux平台上使用。Podman是一个无守护进程的容器引擎，用于在Linux系统上开发、管理和运行OCI(Open Container Initiative)容器和容器镜像。Podman提供了一个与Docker兼容的命令行工具，可以简单地为`docker`命令取别名为`podman`即可使用，所以说如果你会Docker的话可以轻松上手Podman。

安装启动
----

> `CentOS 8`已经内置Podman，`CentOS 7`下需要自行安装。

*   `CentOS 7`可以使用yum命令安装Podman；

```bash
yum -y install podman
```

*   安装成功后使用如下命令启动podman服务。

```bash
systemctl start podman
```

使用
--

> 接下来我们将在Podman中运行Nginx、MySQL和SpringBoot应用，大家可以体会下它和Docker的不同之处。

*   使用如下命令下载Nginx镜像：

```bash
podman pull nginx:1.10
```

*   使用Podman下载镜像时，我们可以选择不同的镜像源，选择从`docker.io`下载就是从DockerHub中下载了；

![](/images/jueJin/8670b2f5bdb64f9.png)

*   由于Podman容器默认情况下没有权限访问宿主机的文件系统，当要进行目录挂载时，需要使用`--privileged`开启权限，可使用如下命令运行nginx容器，基本和docker一致；

```bash
podman run -p 80:80 --name nginx \
--privileged \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx  \
-d nginx:1.10
```

*   运行成功后，把我们的`mall学习教程`前端项目放入`/mydata/nginx/html`即可正常访问了；

![](/images/jueJin/efbaa5307ad8425.png)

*   运行MySQL容器也基本和使用Docker一样，使用如下命令即可运行；

```bash
podman run -p 3306:3306 --name mysql \
--privileged \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root  \
-d mysql:5.7
```

*   通过如下命令可以进入到mysql容器，并查看数据库信息；

```bash
# 进入mysql容器
podman exec -it mysql /bin/bash
# 登录mysql
mysql -proot -uroot
# 查看所有数据库
show databases;
```

*   感觉Podman使用起来基本和Docker没啥两样，就像是换了皮的Docker；

![](/images/jueJin/e19cab12ee49497.png)

*   下面我们在Podman中运行一个SpringBoot应用试试，先下载Docker镜像，该镜像已经上传到DockerHub中：

```bash
docker pull macrodocker/mall-tiny-boot:latest
```

*   运行SpringBoot应用，如果你想使用`--link`选项来连接mysql容器的话，很遗憾Podman并不支持，那就只能使用IP来访问mysql服务了；

```bash
podman run -p 8088:8088 --name mall-tiny-boot \
--privileged \
-e spring.datasource.url='jdbc:mysql://192.168.3.106:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai' \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny/logs:/var/logs \
-d macrodocker/mall-tiny-boot:latest
```

*   运行成功后可访问SpringBoot应用的Swagger页面，访问地址：[http://192.168.3.106:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.106%3A8088%2Fswagger-ui%2F "http://192.168.3.106:8088/swagger-ui/")

![](/images/jueJin/e8483a3e9ac045f.png)

*   使用`podman ps`命令可以查看所有运行中的容器；

![](/images/jueJin/8bb4039867464c5.png)

*   使用`podman images`命令可以查看所有下载的镜像；

![](/images/jueJin/184867c68112464.png)

*   如果你没有安装Docker而输入docker命令的话，会提示你安装`podman-docker`插件，该插件会直接把docker命令转成podman，这是想彻底取代docker？

![](/images/jueJin/bfba713a86e2407.png)

可视化管理
-----

> `CentOS 8`内置的可视化管理工具Cockpit已经内置了Podman支持，直接使用它即可，具体可以参考[Cockpit使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fp4r9hPHnNTK5EKcWIAL8Vw "https://mp.weixin.qq.com/s/p4r9hPHnNTK5EKcWIAL8Vw")。

*   打开`podman容器`管理，即可查看所有运行中的容器和已经下载的镜像；

![](/images/jueJin/a74e085d5a654f0.png)

*   还可以实时查看容器日志，重启、停止或删除容器；

![](/images/jueJin/6e253249b7144a2.png)

*   还可以直接进入容器执行命令，比如查看mysql容器中的数据库；

![](/images/jueJin/a4aa6a08f6a7420.png)

*   也可以直接进行镜像下载；

![](/images/jueJin/506e64b39af745b.png)

*   还可以通过镜像来运行容器，用起来还是挺方便的。

![](/images/jueJin/8e068f24dfc5433.png)

Podman VS Docker
----------------

> Podman和Docker的各方面对比可以参考下表。

Podman

Docker

架构

无守护进程，可以在启动容器的用户下运行容器

使用守护进程来创建镜像和运行容器

安全

允许容器使用Rootless特权

守护进程拥有Root权限

运行容器

需要另一个工具来管理服务并支持后台容器的运行

使用守护进程管理和运行容器

构建镜像

需要容器镜像生成器Buildah的辅助

可以自己构建容器镜像

理念

采用模块化的方法，依靠专门的工具来完成特定的任务

一个独立的、强大的工具

使用

兼容大部分Docker命令，有专门的docker兼容插件

使用自己的命令

总结
--

今天体验了一把Podman，确实使用起来和Docker非常相似。感觉Podman和Docker主要区别在于是否使用守护进程来管理容器以及它们的理念。Docker强调`all in one`，致力于成为一款功能强大的工具，而Podman则更强调`模块化`，通过其他工具的辅助来完成特定任务。Docker和Podman都是非常优秀的容器引擎，如果你的项目中已经使用了Docker，没必要换成Podman，如果你项目才起步，技术选型的时候可以考虑下Podman。

项目地址
----

[github.com/containers/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcontainers%2Fpodman "https://github.com/containers/podman")

本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！