---
author: "MacroZheng"
title: "还在百度Linux命令？推荐一套我用起来特顺手的命令！"
date: 2020-09-28
description: "查看即时活跃的进程，类似Windows的任务管理器。"
tags: ["Java","Linux中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:246,comments:0,collects:508,views:16568,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

作为一位Java后端开发，怎能不会点Linux命令？总结了一套非常实用的Linux命令（基于CentOS 7.6），希望对大家有所帮助！

系统服务管理
------

### systemctl

> `systemctl`命令是`service`和`chkconfig`命令的组合体，可用于管理系统。

*   输出系统中各个服务的状态：

```bash
systemctl list-units --type=service
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   查看服务的运行状态：

```bash
systemctl status firewalld
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   关闭服务：

```bash
systemctl stop firewalld
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   启动服务：

```bash
systemctl start firewalld
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   重新启动服务（不管当前服务是启动还是关闭）：

```bash
systemctl restart firewalld
```

*   重新载入配置信息而不中断服务：

```bash
systemctl reload firewalld
```

*   禁止服务开机自启动：

```bash
systemctl disable firewalld
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   设置服务开机自启动：

```bash
systemctl enable firewalld
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

文件管理
----

### ls

列出指定目录下的所有文件，列出`/`目录下的文件：

```bash
ls -l /
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### pwd

获取目前所在工作目录的绝对路径：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### cd

改变当前工作目录：

```bash
cd /usr/local
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### date

显示或修改系统时间与日期；

```bash
date '+%Y-%m-%d %H:%M:%S'
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### passwd

用于设置用户密码：

```bash
passwd root
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### su

改变用户身份（切换到超级用户）：

```bash
su -
```

### clear

用于清除屏幕信息

### man

显示指定命令的帮助信息：

```bash
man ls
```

### who

*   查询系统处于什么运行级别：

```bash
who -r
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   显示目前登录到系统的用户：

```bash
who -buT
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### free

显示系统内存状态（单位MB）：

```bash
free -m
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### ps

*   显示系统进程运行动态：

```bash
ps -ef
```

*   查看`sshd`进程的运行动态：

```bash
ps -ef | grep sshd
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### top

查看即时活跃的进程，类似Windows的任务管理器。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### mkdir

创建目录：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### more

用于分页查看文件，例如每页10行查看`boot.log`文件：

```bash
more -c -10 /var/log/boot.log
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### cat

用于查看文件，例如查看Linux启动日志文件文件，并标明行号：

```bash
cat -Ab /var/log/boot.log
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### touch

用于创建文件，例如创建`text.txt`文件：

```bash
touch text.txt
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### rm

*   删除文件：

```bash
rm text.txt
```

*   强制删除某个目录及其子目录：

```bash
rm -rf testdir/
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### cp

用于拷贝文件，例如将`test1`目录复制到`test2`目录

```bash
cp -r /mydata/tes1 /mydata/test2
```

### mv

用于移动或覆盖文件：

```bash
mv text.txt text2.txt
```

压缩与解压
-----

### tar

*   将`/etc`文件夹中的文件归档到文件`etc.tar`（并不会进行压缩）：

```bash
tar -cvf /mydata/etc.tar /etc
```

*   用`gzip`压缩文件夹`/etc`中的文件到文件`etc.tar.gz`：

```bash
tar -zcvf /mydata/etc.tar.gz /etc
```

*   用`bzip2`压缩文件夹`/etc`到文件`/etc.tar.bz2`：

```bash
tar -jcvf /mydata/etc.tar.bz2 /etc
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   分页查看压缩包中内容（gzip）：

```bash
tar -ztvf /mydata/etc.tar.gz |more -c -10
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   解压文件到当前目录（gzip）：

```bash
tar -zxvf /mydata/etc.tar.gz
```

*   解压文件到指定目录（gzip）：

```bash
tar -zxvf /mydata/etc.tar.gz -C /mydata/etc
```

磁盘和网络管理
-------

### df

查看磁盘空间占用情况：

```bash
df -hT
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### dh

查看当前目录下的文件及文件夹所占大小：

```bash
du -h --max-depth=1 ./*
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### ifconfig

显示当前网络接口状态：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### netstat

*   查看当前路由信息：

```bash
netstat -rn
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   查看所有有效TCP连接：

```bash
netstat -an
```

*   查看系统中启动的监听服务：

```bash
netstat -tulnp
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   查看处于连接状态的系统资源信息：

```bash
netstat -atunp
```

### wget

从网络上下载文件

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

文件上传下载
------

*   安装上传下载工具`lrzsz`；

```bash
yum install -y lrzsz
```

*   上传文件，输入以下命令`XShell`会弹出文件上传框；

```bash
rz
```

*   下载文件，输入以下命令`XShell`会弹出文件保存框；

```bash
sz fileName
```

软件的安装与管理
--------

### rpm

> RPM是`Red-Hat Package Manager`的缩写，一种Linux下通用的软件包管理方式，可用于安装和管理`.rpm`结尾的软件包。

*   安装软件包：

```bash
rpm -ivh nginx-1.12.2-2.el7.x86_64.rpm
```

*   模糊搜索软件包：

```bash
rpm -qa | grep nginx
```

*   精确查找软件包：

```bash
rpm -qa nginx
```

*   查询软件包的安装路径：

```bash
rpm -ql nginx-1.12.2-2.el7.x86_64
```

*   查看软件包的概要信息：

```bash
rpm -qi nginx-1.12.2-2.el7.x86_64
```

*   验证软件包内容和安装文件是否一致：

```bash
rpm -V nginx-1.12.2-2.el7.x86_64
```

*   更新软件包：

```bash
rpm -Uvh nginx-1.12.2-2.el7.x86_64
```

*   删除软件包：

```bash
rpm -e nginx-1.12.2-2.el7.x86_64
```

### yum

> Yum是`Yellow dog Updater, Modified`的缩写，能够在线自动下载RPM包并安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，非常方便！

*   安装软件包：

```bash
yum install nginx
```

*   检查可以更新的软件包：

```bash
yum check-update
```

*   更新指定的软件包：

```bash
yum update nginx
```

*   在资源库中查找软件包信息：

```bash
yum info nginx*
```

*   列出已经安装的所有软件包：

```bash
yum info installed
```

*   列出软件包名称：

```bash
yum list nginx*
```

*   模糊搜索软件包：

```bash
yum search nginx
```

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！