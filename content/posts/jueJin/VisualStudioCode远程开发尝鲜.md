---
author: "liuyatao"
title: "VisualStudioCode远程开发尝鲜"
date: 2019-06-07
description: "本实验使用UbuntuServer18.04作为远程开发环境，MacOS作为本地机器。目标是能够在安装VSCode的MacOS上编辑远程开发环境的文件。添加完后要登录服务器就只需输入liuyatao@192.168.2.110就可以直接进入服务器，不需要密码。在VS…"
tags: ["VisualStudioCode"]
ShowReadingTime: "阅读1分钟"
weight: 872
---
概述
==

Visual Studio Code(以下简称 VS Code)从1.35.0版本正式提供可以在本地编辑远程开发环境的文件的功能，具体实现如下图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/7/16b2fdd6d6e51433~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

本实验使用Ubuntu Server 18.04作为远程开发环境，MacOS作为本地机器。目标是能够在安装VS Code的MacOS上编辑远程开发环境的文件。

配置免密远程登录
========

在本地机器生成密钥对：

 代码解读

复制代码

`ssh-keygen -t rsa -C "739697044@qq.com"`

生成的路径在`~/.ssh/`

将公钥拷贝到服务器上：

 代码解读

复制代码

`ssh-copy-id liuyatao@192.168.2.110`

添加完后要登录服务器就只需输入`liuyatao@192.168.2.110`就可以直接进入服务器，不需要密码。

VS Code远程开发扩展
=============

在VS Code扩展商店中搜索`remote`安装`Remote Development`即可。

使用
==

使用`cmd+shift+p`的快捷键调用命令，执行`Remote-SSH:Connect to Host...`,然后选择配置文件的路径

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/7/16b2fdd6d8cef14b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

然后输入主键信息：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/7/16b2fdd6dfa53ad5~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

再接着执行`Remote-SSH:Connect to Host`的命令即可连接到服务器。

连接成功就可以像在编辑本地文件一样的编辑远程文件了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/7/16b2fdd6de0886a7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

出处
==

欢迎关注作者公众账号，获取更多干货。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/7/16b2fdd6daa46270~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)