---
author: "MacroZheng"
title: "官方标配！非常炫酷的 Linux 可视化管理工具，你值得拥有！"
date: 2022-02-23
description: "用了很久的CentOS 7，最近想体验一下CentOS 8。无意中发现CentOS 8内置了一款可视化管理工具`Cockpit`，一些常见的命令行操作它都能支持，界面炫酷且功能强大，推荐给大家！"
tags: ["后端","Java","Linux中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:135,comments:13,collects:287,views:25841,"
---
> 用了很久的`CentOS 7`，最近想体验一下`CentOS 8`。无意中发现`CentOS 8`内置了一款可视化管理工具`Cockpit`，一些常见的命令行操作它都能支持，界面炫酷且功能强大，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Cockpit简介
---------

`Cockpit`是`CentOS 8`内置的一款基于Web的可视化管理工具，对一些常见的命令行管理操作都有界面支持，比如用户管理、防火墙管理、服务器资源监控等，使用非常方便，号称人人可用的Linux管理工具。

下面是`Cockpit`的管理界面，看起来还是挺炫酷的！

![](/images/jueJin/b0dda5bf85f1405.png)

CentOS 8安装
----------

> 如果你想体验最新版本的`Cockpit`，需要安装`CentOS 8`，下面我们先简单聊聊`CentOS 8`的安装。

*   `CentOS 8`的安装与`CentOS 7`基本相同，这里安装的是目前最新版`8.5.2111`，具体安装可以参考[虚拟机安装及使用Linux，看这一篇就够了！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FrmUsSgxjwVz9ntdY1gmP7A "https://mp.weixin.qq.com/s/rmUsSgxjwVz9ntdY1gmP7A") ，镜像下载地址：[vault.centos.org/8.5.2111/is…](https://link.juejin.cn?target=https%3A%2F%2Fvault.centos.org%2F8.5.2111%2Fisos%2Fx86_64%2F "https://vault.centos.org/8.5.2111/isos/x86_64/")

![](/images/jueJin/da2bb905a68748f.png)

*   使用`CentOS 8`的yum命令安装软件时经常会遇到无法下载的问题，切换到阿里云的镜像源即可解决，这里使用`Centos-vault-8.5.2111.repo`仓库配置；

```bash
# 先将原BaseOS配置进行备份
mv /etc/yum.repos.d/CentOS-Linux-BaseOS.repo /etc/yum.repos.d/CentOS-Linux-BaseOS.repo.bak
# 再下载新配置
sudo wget -O /etc/yum.repos.d/CentOS-Linux-BaseOS.repo http://mirrors.aliyun.com/repo/Centos-vault-8.5.2111.repo
```

*   yum仓库配置文件在`/etc/yum.repos.d`目录下，再修改`CentOS-Linux-AppStream.repo`文件，直接拷贝`CentOS-Linux-BaseOS`中的`appstream`部分即可；

```ini
[appstream]
name=CentOS-8.5.2111 - AppStream - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/8.5.2111/AppStream/$basearch/os/
http://mirrors.aliyuncs.com/centos-vault/8.5.2111/AppStream/$basearch/os/
http://mirrors.cloud.aliyuncs.com/centos-vault/8.5.2111/AppStream/$basearch/os/
gpgcheck=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
```

*   运行如下命令清空缓存并生效；

```bash
sudo yum clean all
sudo yum makecache
```

*   接下来查询一个安装包信息测试下，发现已经可以正常使用了。

![](/images/jueJin/d75fcdaca5b441e.png)

Cockpit安装启动
-----------

> 下面介绍下Cockpit的安装和启动，非常简单。

*   `CentOS 8`默认已安装Cockpit，直接启动服务即可；

```bash
# 配置cockpit服务开机自启
systemctl enable --now cockpit.socket
# 启动cockpit服务
systemctl start cockpit
```

*   `CentOS 7`上如果要使用Cockpit的话，需要自行安装，并开放对应服务；

```bash
# 安装
yum install cockpit
# 开放服务
firewall-cmd --permanent --zone=public --add-service=cockpit
# 重新加载防护墙
firewall-cmd --reload
```

*   安装完成后即可通过浏览器访问Cockpit，使用Linux用户即可登录（比如root用户），访问地址：[http://192.168.3.106:9090/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.106%3A9090%2F "http://192.168.3.106:9090/")

![](/images/jueJin/a53bcf3dd388439.png)

Cockpit使用
---------

> 之前我们经常使用命令行来管理Linux服务器，有了`Cockpit`就可以愉快地使用图形化界面了，下面我们来体验下`Cockpit`的功能。

*   通过`概览`查看服务器的基本信息，包括CPU内存使用情况、系统信息、服务器配置等；

![](/images/jueJin/f7f4b59d855c470.png)

*   点击`使用`可以查看到更详细的CPU、内存、磁盘、网络等监控信息，基本上就是个界面版的`top`命令啊；

![](/images/jueJin/c9a7253740b04f4.png)

*   通过`存储`可以查看更为详细的文件系统信息，还可以进行卷组的管理及NFS的挂载；

![](/images/jueJin/34685b0dcd8c4ae.png)

*   通过`网络`可以查看防火墙及网络监控信息，可以进行防火墙的开启关闭；

![](/images/jueJin/cdc148b44da74ea.png)

*   点击`防火墙`可以查看开放的服务端口，通过`添加服务`可以直接开放端口，还在用`firewalld`命令？

![](/images/jueJin/d6f93b76335f417.png)

*   通过`Podman容器`管理可以像使用Docker一样下载镜像并创建运行容器；

![](/images/jueJin/40717131e14f46f.png)

*   比如说我们可以根据Nginx镜像来创建一个nginx容器，并运行在`80`端口上；

![](/images/jueJin/9401ed1331aa4e7.png)

*   此时直接访问服务器的`80`端口就可以访问到Nginx的首页了；

![](/images/jueJin/2ccf8179e638440.png)

*   通过`账户`可以方便地管理Linux中的用户，再也不用`useradd`命令了；

![](/images/jueJin/c36f1e0f8e5f498.png)

*   另外Cockpit在服务器软件需要更新时也会提示我们，通过`软件更新`可以进行更新操作；

![](/images/jueJin/7eaa4543a6d345b.png)

*   通过`应用`功能可以下载一些服务器应用，目前只有几个可以安装，期待以后能有更多选择；

![](/images/jueJin/f84e32f576244b5.png)

*   如果以上功能满足不了你的需求，Cockpit也提供了命令行功能，打开`终端`即使用；

![](/images/jueJin/ac6cbbc61fc646a.png)

*   Cockpit还提供了SELinux管理功能，可以控制其开启和关闭。

![](/images/jueJin/6edf7373865d499.png)

总结
--

作为`CentOS 8`官方内置的可视化管理功能，`Cockpit`确实涵盖了很多常用的服务器管理功能，界面炫酷且使用方便！升级到`CentOS 8`的朋友，不妨尝试下它！

参考资料
----

官网文档：[cockpit-project.org/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fcockpit-project.org%2Fdocumentation.html "https://cockpit-project.org/documentation.html")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！