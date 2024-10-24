---
author: "MacroZheng"
title: "10分钟搭建自己的Git仓库"
date: 2019-08-26
description: "GitLab是一款使用MIT许可证的基于网络的Git仓库管理工具，我们可以使用它来搭建自己的Git仓库，本文将介绍如何使用Gitlab在Linux下快速搭建Git仓库。 由于Gitlab启动比较慢，需要耐心等待10分钟左右，如果Gitlab没有启动完成访问，会出现如下错误。 可…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:58,comments:10,collects:96,views:8208,"
---
> SpringBoot实战电商项目mall（20k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

简介
--

GitLab是一款使用MIT许可证的基于网络的Git仓库管理工具，我们可以使用它来搭建自己的Git仓库，本文将介绍如何使用Gitlab在Linux下快速搭建Git仓库。

Gitlab服务端搭建
-----------

> 在Linux（CenterOS7.6）下我们会以Docker的方式来安装Gitlab，对Docker不了解的朋友可以参考：[开发者必备Docker命令](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fd_CuljDTJq680NTndAay8g "https://mp.weixin.qq.com/s/d_CuljDTJq680NTndAay8g")。

### 下载Gitlab的Docker镜像

```
docker pull gitlab/gitlab-ce
```

### 运行如下命令来启动Gitlab

> 需要注意的是我们的Gitlab的http服务运行在宿主机的1080端口上，这里我们将Gitlab的配置，日志以及数据目录映射到了宿主机的指定文件夹下，防止我们在重新创建容器后丢失数据。

```
docker run --detach \
--publish 10443:443 --publish 1080:80 --publish 1022:22 \
--name gitlab \
--restart always \
--volume /mydata/gitlab/config:/etc/gitlab \
--volume /mydata/gitlab/logs:/var/log/gitlab \
--volume /mydata/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest
```

### 开启防火墙的指定端口

> 由于Gitlab运行在1080端口上，所以我们需要开放该端口，注意千万不要直接关闭防火墙，否则Gitlab会无法启动。

```
# 开启1080端口
firewall-cmd --zone=public --add-port=1080/tcp --permanent
# 重启防火墙才能生效
systemctl restart firewalld
# 查看已经开放的端口
firewall-cmd --list-ports
```

### 访问Gitlab

*   访问地址：[http://192.168.3.101:1080/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.101%3A1080%2F "http://192.168.3.101:1080/")
*   由于Gitlab启动比较慢，需要耐心等待10分钟左右，如果Gitlab没有启动完成访问，会出现如下错误。

![](/images/jueJin/16ccdfbdd7c029c.png)

*   可以通过docker命令动态查看容器启动日志来知道gitlab是否已经启动完成。

```
docker logs gitlab -f
```

![](/images/jueJin/16ccdfbdd7fd87f.png)

Gitlab的使用
---------

### Gitlab启动完成后第一次访问，会让你重置root帐号的密码

![](/images/jueJin/16ccdfbddd05b75.png)

### 重置完成后输入帐号密码登录

![](/images/jueJin/16ccdfbddcd66a2.png)

### 选择创建项目、创建组织、创建帐号

![](/images/jueJin/16ccdfbddd0de1d.png)

### 创建组织

首先我们需要创建一个组织，然后在这个组织下分别创建用户和项目，这样同组织的用户就可以使用该组织下的项目了。

![](/images/jueJin/16ccdfbde0de927.png)

### 创建用户并修改密码

#### 找到添加用户的按钮

![](/images/jueJin/16ccdfbe069d9a4.png)

#### 输入用户名密码添加用户

![](/images/jueJin/16ccdfbe0d118f4.png)

#### 在编辑界面中修改用户密码

![](/images/jueJin/16ccdfbe0d1266e.png)

![](/images/jueJin/16ccdfbe097f02d.png)

### 创建项目并添加README文件

![](/images/jueJin/16ccdfbe11543e3.png)

![](/images/jueJin/16ccdfbe15c3990.png)

### 将用户分配到组织

![](/images/jueJin/16ccdfbf1453870.png)

Git客户端安装及使用
-----------

### 下载Git客户端并安装

*   下载地址：[github.com/git-for-win…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgit-for-windows%2Fgit%2Freleases%2Fdownload%2Fv2.23.0.windows.1%2FGit-2.23.0-64-bit.exe "https://github.com/git-for-windows/git/releases/download/v2.23.0.windows.1/Git-2.23.0-64-bit.exe")
*   下载完成后，一路点击Next安装即可。

![](/images/jueJin/16ccdfbe3cf5044.png)

### clone项目

*   找到项目clone的地址：

![](/images/jueJin/16ccdfbe40377e5.png)

*   打开Git命令行工具：

![](/images/jueJin/16ccdfbe4ba2740.png)

*   执行以下命令clone项目到本地：

```
git clone http://192.168.3.101:1080/macrozheng/hello.git

```

### 提交代码

进入项目目录，修改一下README.md并提交：

```
# 进入项目工程目录
cd hello/
# 将当前修改的文件添加到暂存区
git add .
# 提交代码
git commit -m "first commit"
```

### 推送到远程仓库

```
git push
```

![](/images/jueJin/16ccdfbe6854528.png)

### 拉取远程仓库代码

*   在Gitlab上修改readme中的文件内容：

![](/images/jueJin/16ccdfbe6f7d844.png)

*   拉取代码：

```
git pull
```

### 本地创建并提交分支

```
# 切换并从当前分支创建一个dev分支
git checkout -b dev
# 将新创建的dev分支推送到远程仓库
git push origin dev
```

![](/images/jueJin/16ccdfbe781101c.png)

### 其他常用命令

```
# 切换到dev分支
git checkout dev
# 查看本地仓库文件状况
git status
# 查看本地所有分支
git branch
# 查看提交记录
git log
```

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16ccdfc88b7a3ac.png)