---
author: "MacroZheng"
title: "Linux防火墙Firewall和Iptables的使用"
date: 2019-06-13
description: "Linux中有两种防火墙软件，ConterOS70以上使用的是firewall，ConterOS70以下使用的是iptables，本文将分别介绍两种防火墙软件的使用。 mall项目全套学习教程连载中，关注公众号第一时间获取。"
tags: ["Linux中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:11,comments:0,collects:23,views:16948,"
---
摘要
--

Linux中有两种防火墙软件，ConterOS7.0以上使用的是firewall，ConterOS7.0以下使用的是iptables，本文将分别介绍两种防火墙软件的使用。

Firewall
--------

*   开启防火墙：

```
systemctl start firewalld
```

*   关闭防火墙：

```
systemctl stop firewalld
```

*   查看防火墙状态：

```
systemctl status firewalld
```

*   设置开机启动：

```
systemctl enable firewalld
```

*   禁用开机启动：

```
systemctl disable firewalld
```

*   重启防火墙：

```
firewall-cmd --reload
```

*   开放端口（修改后需要重启防火墙方可生效）：

```
firewall-cmd --zone=public --add-port=8080/tcp --permanent
```

![展示图片](/images/jueJin/16b51180ea020d4.png)

*   查看开放的端口：

```
firewall-cmd --list-ports
```

![展示图片](/images/jueJin/16b51180ea2ab29.png)

*   关闭端口：

```
firewall-cmd --zone=public --remove-port=8080/tcp --permanent
```

![展示图片](/images/jueJin/16b51180ea342f0.png)

Iptables
--------

### 安装

> 由于CenterOS7.0以上版本并没有预装Iptables,我们需要自行装。

*   安装前先关闭firewall防火墙
    
    ![展示图片](/images/jueJin/16b51180ea6aae5.png)
    
*   安装iptables:

```
yum install iptables
```

*   安装iptables-services:

```
yum install iptables-services
```

### 使用

*   开启防火墙：

```
systemctl start iptables.service
```

![展示图片](/images/jueJin/16b51180ea61e93.png)

*   关闭防火墙：

```
systemctl stop iptables.service
```

*   查看防火墙状态：

```
systemctl status iptables.service
```

*   设置开机启动：

```
systemctl enable iptables.service
```

*   禁用开机启动：

```
systemctl disable iptables.service
```

*   查看filter表的几条链规则(INPUT链可以看出开放了哪些端口)：

```
iptables -L -n
```

![展示图片](/images/jueJin/16b51180ea597ac.png)

*   查看NAT表的链规则：

```
iptables -t nat -L -n
```

![展示图片](/images/jueJin/16b511810ad4af7.png)

*   清除防火墙所有规则：

```
iptables -F
``````
iptables -X
``````
iptables -Z
```

*   给INPUT链添加规则（开放8080端口）：

```
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
```

![展示图片](/images/jueJin/16b511810ae98aa.png)

*   查找规则所在行号：

```
iptables -L INPUT --line-numbers -n
```

![展示图片](/images/jueJin/16b511810aeee04.png)

*   根据行号删除过滤规则（关闭8080端口）：

```
iptables -D INPUT 1
```

![展示图片](/images/jueJin/16b511810fc14ec.png)

公众号
---

mall项目全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16b5116c9d74a6a.png)