---
author: "Java3y"
title: "Linux网络管理"
date: 2018-06-13
description: "这篇主要讲解在Linux下网络的管理。 在网络底层也支持Ethernet、Token Ring、ATM、PPP（PPPoE）、FDDI、Frame Relay等网络协议。 这些网络协议是Linux内核提供的功能，具体的支持情况由内核编译参数决定。 桥接模式的虚拟机，就像一个在路…"
tags: ["Linux","命令行","后端","Shell中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:137,comments:5,collects:86,views:4765,"
---
前言
==

> 只有光头才能变强

回顾前面：

*   [看完这篇Linux基本的操作就会了](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484231%26idx%3D1%26sn%3D4cf217a4d692a7aba804e5d96186b15b%26chksm%3Debd74246dca0cb5024de2f1d9f9e2ecb631e49752713c25bbe44f44856e919df5a973049c189%23rd "http://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484231&idx=1&sn=4cf217a4d692a7aba804e5d96186b15b&chksm=ebd74246dca0cb5024de2f1d9f9e2ecb631e49752713c25bbe44f44856e919df5a973049c189#rd")
*   [Linux用户和权限管理看了你就会用啦](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484255%26idx%3D1%26sn%3Dfe812d7f5ea23a7ed96ad8a3927d6075%26chksm%3Debd7425edca0cb48e5cf927e3064bc72dad2d515867a502b4c62d52e6c66e12fbcb786639961%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484255&idx=1&sn=fe812d7f5ea23a7ed96ad8a3927d6075&chksm=ebd7425edca0cb48e5cf927e3064bc72dad2d515867a502b4c62d52e6c66e12fbcb786639961#rd")
*   [Linux进程管理](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484259%26idx%3D1%26sn%3D5a360c8d9c468adfa65891bdfdb861e9%26chksm%3Debd74262dca0cb746435cb274950a3c819169d9db3baa635cb199a650a6515345ca880084101%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484259&idx=1&sn=5a360c8d9c468adfa65891bdfdb861e9&chksm=ebd74262dca0cb746435cb274950a3c819169d9db3baa635cb199a650a6515345ca880084101#rd")

这篇主要讲解在**Linux下网络的管理**。

那么接下来就开始吧，如果文章有错误的地方请大家多多包涵，不吝在评论区指正哦~

> 声明：基于Centos6.9

一、Linux下的网络
===========

Linux**支持各种协议类型**的网络

*   TCP/IP、NetBIOS/NetBEUI、IPX/SPX、AppleTake等
*   在网络底层也支持Ethernet、Token Ring、ATM、PPP（PPPoE）、FDDI、Frame Relay等网络协议。
*   这些网络协议**是Linux内核提供的功能**，具体的支持情况由内核编译参数决定。

![](/images/jueJin/163f853b7a63d50.png)

配置网络参数有**两种**方式：

*   临时性网络配置
    *   通过**命令**修改当前内核中的网络相关参数实现，配置后**立即**生效，重新开机后失效
*   永久性网络配置
    *   通过直接**修改**网络相关的**配置文件**实现，需要**重启服务**，重新开机后保留所有配置

在Linux下配置网络，总会遇到**桥接和NAT模式的概念**的，这里我简要摘抄一下：

*   桥接模式的虚拟机，就像一个在路由器"民政局"那里"上过户口"的成年人，有自己单独的居住地址，虽然和主机住在同一个大院里，但好歹是有户口的人，可以大摇大摆地直接和外面通信。
*   NAT模式的虚拟机，纯粹就是一个没上过户口的黑户，路由器"民政局"根本不知道有这么个人，自然也不会主动和它通信。即使虚拟机偶尔要向外面发送点的信件，都得交给主机以主机的名义转发出去，主机还专门请了一位叫做NAT的老大爷来专门负责这些虚拟机的发信、收信事宜。
*   仅主机模式的虚拟机，纯粹是一个彻彻底底的黑奴，不仅没有户口、路由器"民政局"不知道这么号人，还被主机关在小黑屋里，连信件也不准往外发。

参考资料：

*   [zhuanlan.zhihu.com/p/32948325](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F32948325 "https://zhuanlan.zhihu.com/p/32948325")\--VMware网络连接模式—桥接、NAT以及仅主机模式的详细介绍和区别（软件指南针）

1.1常用的管理网络命令
------------

**网络接口相关**：

*   查看网络接口配置：`ifconfig [ethX]`
*   网络接口的启用与停用：使用 `ifup ethX` 命令来启用指定的接口，使用 `ifdown ethX` 命令来禁用指定的接口

**临时配置相关**：

*   `ifconfig`命令可以临时地设置网络接口的IP参数
*   `route`命令可以临时地设置内核路由表
*   使用`hostname`命令可以临时地修改主机名
*   使用`sysctl`命令可以临时地开启内核的包转发

使用命令来做网络的临时配置，要做到永久配置就需要**直接修改文件**的方式了！

![](/images/jueJin/163f853b78ef45c.png)

**网络检测的常用工具：**

*   ifconfig 检测网络接口配置
*   route 检测路由配置
*   ping 检测网络连通性
*   netstat 查看网络状态
*   lsof 查看指定IP 和/或 端口的进程的当前运行情况
*   host/dig/nslookup 检测DNS解析
*   traceroute 检测到目的主机所经过的路由器
*   tcpdump 显示本机网络流量的状态

1.1配置Linux网络练习题
---------------

> 检查windows的virtualbox虚拟网卡是否禁用，如果禁用，请启动；以root账户登录，用ifconfig检查当前网络配置；然后分别用ifup命令启动eth0网卡和eth1网卡，观察结果，并记录网卡绑定的ip地址，在第五部分记录。关闭检查防火墙的状态，如果防火墙已启动，请关闭linux系统的防火墙，

![](/images/jueJin/163f853b768ea4c.png)

![](/images/jueJin/163f853b788fea6.png)

![](/images/jueJin/163f853b7f9861d.png)

![](/images/jueJin/163f853b7cff0b1.png)

![](/images/jueJin/163f853badd78ef.png)

> 启动putty，在Host Name输入框中输入eth1网卡当前的ip地址，connection type 选择SSH，Port为22；按“open”按钮，提示Putty Security Alert对话框，选择确定；分别以root账户，jkXX账户登录

![](/images/jueJin/163f853bc02e165.png)

![](/images/jueJin/163f853bc47b7f3.png)

![](/images/jueJin/163f853bd8a810c.png)

> 在root账户登录的putty终端上查看（ps au）当前用户运行的进程，找到jk08账户运行的shell程序的pid，并且在第五部分记录。在root账户登录的putty终端上，用kill命令杀死刚才记录的shell程序；

![](/images/jueJin/163f853bd0df395.png)

![](/images/jueJin/163f853be12b5d1.png)

![](/images/jueJin/163f853beee6cca.png)

> 杀死一个进程需要什么条件？如果是peter账户，是否可以杀死jason账户运行的进程？

答：杀死一个进程，应获得这个进程控制的权利，比如获得进程所属账户的权限；或者获得超级账户的权限。如果是peter账户，没有获得jason账户的权限，因此，杀死jason账户下运行的进程是被禁止的。

> 用路由命令查看当前网络路由状况，并用ping命令测试外部网站地址是否可以连通；并截图

![](/images/jueJin/163f853c0f9c4d0.png)

![](/images/jueJin/163f853c0fdf95e.png)

![](/images/jueJin/163f853c2238a30.png)

> 用ifconfig查看eth0的当前ip地址；修改ip地址，地址的最后一段数字比原来的大1，查看是否成功；用ifconfig修改eth0的地址，要求指定掩码和广播地址，其中掩码为B类地址掩码；用路由命令观察路由表的变化；

![](/images/jueJin/163f853c2f8a5ea.png)

![](/images/jueJin/163f853c3319444.png)

![](/images/jueJin/163f853c39a6825.png)

> 在eth1网卡上添加一个主机路由，要求其主机ip地址为192.168.3.3；在eth0网卡上添加一个网络路由，网络地址为10.20.0.0，掩码是255.255.0.0；观察路由表中的默认路由，根据步骤（2）观察到的默认路由，恢复默认网关路由，并测试网络与外部网站的连通性；

![](/images/jueJin/163f853c3edc26f.png)

![](/images/jueJin/163f853c471511b.png)

![](/images/jueJin/163f853c4f97a0e.png)

![](/images/jueJin/163f853c5c5c869.png)

![](/images/jueJin/163f853c752df69.png)

> 给网卡eth1设置别名eth1:0，ip地址比eth1的ip地址最后一段数字大1；从windows端，用ping命令测试eth1和eth1:0的连通性；停止eth1:0工作，观察结果，并截图

![](/images/jueJin/163f853c87538af.png)

![](/images/jueJin/163f853c8e2ee1f.png)

![](/images/jueJin/163f853c8f6d221.png)

> 修该主机名称为serverXX（XX为学生学号末两位），退出shell重新登录；观察内核参数net.ipv4.ip\_forward的值，将其修改为1；

![](/images/jueJin/163f853c9767bfc.png)

![](/images/jueJin/163f853c9b8d7d0.png)

> 为什么默认路由记录不见了，可能的原因是？

答：修改了默认路由经过的网卡eth0的ip地址，对原有路由影响较大，因此系统自动将默认路由删除。

> 一个网卡有多个IP地址有什么好处？

答：好处是有利于在一个网卡上绑定多个相同的网络服务，比如可以绑定多个网站。

> 编辑eth0和eth1的网络接口文件，要求修改为启动时自动启动设备；并且要求eth1的地址为192.168.56.121，网络前缀为26；系统重启，检验网卡是否自动启动，及其IP地址；

![](/images/jueJin/163f853ca124dc2.png)

![](/images/jueJin/163f853caca481c.png)

![](/images/jueJin/163f853cba20a09.png)

![](/images/jueJin/163f853cc13ed55.png)

> 编辑本地域名解析配置文件，要求添加10.0.2.2地址，对应的域名为gateXX（其中XX为学生学号的末两位），存盘退出；执行ping命令，参数为gateXX，检查通过域名是否可以连通对应的ip地址；

![](/images/jueJin/163f853ccb5d610.png)

![](/images/jueJin/163f853cd0d0626.png)

> 编辑文件，使得系统支持ip包转发；用sysctl -p命令让修改结果生效；

![](/images/jueJin/163f853cda5714f.png)

![](/images/jueJin/163f853ce7f2f06.png)

![](/images/jueJin/163f853ce879621.png)

> 用ping命令测试网站www.qq.com，要求只发送10次ICMP测试包；用netstat命令观察网络接口信息；用netstat命令观察路由表信息；用netstat命令观察正在监听的tcp端口；用netstat命令观察正在监听的udp端口；

![](/images/jueJin/163f853cee2130c.png)

![](/images/jueJin/163f853cfd1aed1.png)

![](/images/jueJin/163f853cf7fea93.png)

![](/images/jueJin/163f853d0ba4824.png)

![](/images/jueJin/163f853d124b4b8.png)

> sysctl -p看到的是配置文件中的数据，还是内存中的数据？

答：看到的既是配置文件中的数据，也是内存中的数据。因为-p参数的意思是把配置文件中的数据更新到内存中。

二、安装软件
======

一般我们的Centos下安装软件可以**直接使用yum命令来安装**，非常方便。在yum之前还有一个RPM，来看看它的区别：

*   rpm是由红帽公司开发的软件包管理方式，使用rpm我们可以方便的进行软件的安装、查询、卸载、升级等工作。但是rpm软件包之间的依赖性问题往往会很繁琐,尤其是软件由多个rpm包组成时。
*   Yum（全称为 Yellow dog Updater, Modified）是一个在Fedora和RedHat以及SUSE中的Shell前端软件包管理器。基於RPM包管理，能够从指定的服务器自动下载RPM包并且安装，**可以自动处理依赖性关系**，并且一次安装所有依赖的软体包，无须繁琐地一次次下载、安装。

2.1yum使用
--------

```

yum  [全局参数] 命令 [命令参数]
```

![](/images/jueJin/163f853d160e857.png)

常用的全局参数：

*   `-y`：对yum命令的提问回答“是（yes）”
*   `-C`：只利用本地缓存，不从远程仓库下载文件
*   `--enablerepo=REPO`：临时启用指定的名为REPO的仓库
*   `--disablerepo=REPO`：临时禁用指定的名为REPO的仓库
*   `--installlroot=PATH`：指定安装软件时的根目录，主要用于为chroot环境安装软件

![](/images/jueJin/163f853d20be48a.png)

![](/images/jueJin/163f853d30e7aa5.png)

2.2几种常用的网络工具
------------

![](/images/jueJin/163f853d304bf60.png)

![](/images/jueJin/163f853d54be4e9.png)

2.3练习yum安装软件与使用
---------------

> 用yum查找软件包tree，lsof，traceroute，观察结果；查找tree软件包的基本信息；安装tree，lsof，traceroute三个软件包

![](/images/jueJin/163f853d59f45e0.png)

![](/images/jueJin/163f853d7d21772.png)

![](/images/jueJin/163f853d8a0acdf.png)

![](/images/jueJin/163f853d8e74cdf.png)

![](/images/jueJin/163f853d8f9f770.png)

![](/images/jueJin/163f853dbd12f50.png)

![](/images/jueJin/163f853dc0c27d1.png)

![](/images/jueJin/163f853dc9dd67d.png)

![](/images/jueJin/163f853dceb389a.png)

![](/images/jueJin/163f853dd2bf530.png)

> 运行命令tree，查看/etc目录下的子目录情况；运行lsof查看使用网络tcp端口22的是哪个应用；用traceroute命令观察某个网站经过了多少个路由

![](/images/jueJin/163f853de4aebbb.png)

![](/images/jueJin/163f853de9c7d94.png)

![](/images/jueJin/163f853df8c21c4.png)

![](/images/jueJin/163f853df9740a3.png)

![](/images/jueJin/163f853e6b2a69b.png)

> 用浏览器打开网站http://www.rpmfind.net，分别查找软件包system-config-network-tui, tree, ntsysv，找到软件包，并复制下载链接；在linux中用wget下载链接，成功下载后，用长格式列出该文件

![](/images/jueJin/163f853e8769cf2.png)

![](/images/jueJin/163f853e87ab717.png)

![](/images/jueJin/163f853e916731b.png)

![](/images/jueJin/163f853ea2530e3.png)

![](/images/jueJin/163f853ea6cd07a.png)

![](/images/jueJin/163f853eaca5442.png)

![](/images/jueJin/163f853eafe042f.png)

![](/images/jueJin/163f853ebc351fb.png)

> 用rpm工具查看所有已经安装的软件包，并将结果输出到文件installXX.txt，其中（XX为学生学号末两位）；用rpm查看bash的软件包信息；用rpm查看安装包文件的数字签名信息；

![](/images/jueJin/163f853ec0385fc.png)

![](/images/jueJin/163f853ef0ef7e9.png)

![](/images/jueJin/163f853efc4325c.png)

> 使用rpm分别安装第2步下载的三个软件包；它们都能顺利安装吗？为什么会出错；观察结果，

![](/images/jueJin/163f853f07907d1.png)

![](/images/jueJin/163f853f13f7982.png)

![](/images/jueJin/163f853f1a509bd.png)

![](/images/jueJin/163f853f202df94.png)

> 哪个软件包不能顺利安装，为什么？应该怎样安装该软件？

答：system-config-network-tui-1.6.0.el6.3-4.el6.noarch.rpm软件包不能顺利安装，因为这个软件包依赖其他软件包，应把依赖的软件包先安装，才能安装这个软件包。可以yum工具安装，它可以自动安装依赖的软件包。

四、总结
====

本文主要是总结了Linux下网络和安装软件的知识~~~这两个知识点在Linux下也是很重要的，是学习Linux的基础~

**继续完善上一次的思维导图**：

![](/images/jueJin/163f853f2387924.png)

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**。

**文章的目录导航**：

*   [zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")