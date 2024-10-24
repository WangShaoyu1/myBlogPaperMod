---
author: ""
title: "再见 Xshell ！这款开源的终端工具逼格更高！"
date: 
description: "作为一名后端开发，我们经常需要和Linux系统打交道，免不了要使用Xshell这类终端工具来进行远程管理。最近发现一款更炫酷的终端工具，主题丰富，功能强大，推荐给大家！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: ""
weight: 1
selfDefined:"likes:222,comments:0,collects:340,views:0,"
---
> 作为一名后端开发，我们经常需要和Linux系统打交道，免不了要使用Xshell这类终端工具来进行远程管理。最近发现一款更炫酷的终端工具`Tabby`，主题丰富，功能强大，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊Xshell
--------

之前经常使用Xshell来操作Linux虚拟机，基本上是够用了。但是Xshell免费使用只供`非商业用途`，而且如果你想用FTP来进行文件传输的话，还需单独下载Xftp。

无意中发现了另一款开源的终端工具`Tabby`，它直接集成了SFTP功能，而且界面也很炫酷，下面是它的使用界面。

![](/images/jueJin/69a00f59aed7413.png)

Tabby简介
-------

Tabby是一款现代化的终端连接工具，开源并且跨平台，支持在Windows、MacOS、Linux系统下使用。Tabby在Github上已有`20k+`Star，可见它是一款非常流行的终端工具！

![](/images/jueJin/f21c56d9e81a482.png)

安装
--

*   Tabby的安装非常简单，直接下载安装包解压即可，这里我下载的是Windows下的便携版本，下载地址：[github.com/Eugeny/tabb…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FEugeny%2Ftabby%2Freleases "https://github.com/Eugeny/tabby/releases")

![](/images/jueJin/09e1694998d548e.png)

*   下载完成后解压到指定目录，双击`Tabby.exe`即可运行；

![](/images/jueJin/9d39d2a095894d2.png)

*   运行成功后，看一眼界面，还是非常炫酷的！

![](/images/jueJin/680dd6568f1440c.png)

使用
--

> Tabby的功能是非常强大的，不仅支持作为SSH客户端使用，SFTP传输文件、使用PowerShell和Git命令也不在话下，下面我们来体验下。

### SSH

> 使用SSH我们可以远程管理Linux服务器。

*   连接之前我们得先创建个SSH连接配置，首先点击首页的`Settings`按钮；

![](/images/jueJin/15f8ad28113a473.png)

*   然后点击`New profile`按钮创建连接配置；

![](/images/jueJin/ce73729c7a8840b.png)

*   选择`SSH connection`配置模板；

![](/images/jueJin/333846f8579244d.png)

*   然后输入连接名称、主机地址及连接密码即可；

![](/images/jueJin/ad9b95d4af9c43a.png)

*   再点击连接配置右侧的运行按钮；

![](/images/jueJin/bc49de2772b24e8.png)

*   运行成功后就可以访问Linux服务器了，界面还是挺炫酷的！

![](/images/jueJin/e7db8bcd77ba4c0.png)

### SFTP

> 之前我经常使用`lrzsz`工具包来实现Windows和Linux之间的文件互传，其实使用SFTP来传输会方便很多。

*   例如我现在想下载个Nginx的配置文件来改下，直接点击`SFTP`按钮即可查看文件目录，然后单击文件即可下载到Windows的指定目录下；

![](/images/jueJin/087fba9eaafc46c.png)

*   修改完配置文件后，直接从文件夹里拖到Tabby中即可进行上传覆盖文件，是不是挺方便的！

![](/images/jueJin/0a38b51f7c164a9.png)

*   当然如果你还是想使用`lrzsz`工具包来互传，Tabby也是支持的。

![](/images/jueJin/1596522c2f34476.png)

### PowerShell

> 在使用Windows的`CMD`时，经常会觉得它不好用，而改用跨平台的`PowerShell`，Tabby也是支持它的！

*   我们可以通过点击`Profiles and connections`按钮选择并创建PowerShell连接；

![](/images/jueJin/5594ea42efac420.png)

*   创建成功后我们试下在`CMD`中不支持的`ls`命令，在PowerShell中是可以支持的。

![](/images/jueJin/3dbc78ef991c4ce.png)

### Git

> 之前我们需要使用Git Bash这类工具才能打开Git命令界面，使用Tabby也是可以实现的。

*   我们可以通过点击`Profiles and connections`按钮选择并创建Git连接；

![](/images/jueJin/6d68d8387c054ad.png)

*   然后就可以使用Git命令了，比如使用`git status`查看下本地文件的状况。

![](/images/jueJin/e8be2f3c4eb64c5.png)

设置
--

> 在使用新的工具时，我们往往需要进行设置，接下来讲讲Tabby的常用设置。

### 外观

终端字体有时候我们会觉得太小，可以在`Appearance`里面设置。

![](/images/jueJin/127dc761c4884dc.png)

### 颜色

*   对于终端配色，有一个网站提供了非常多的方案，网站地址：[iterm2colorschemes.com/](https://link.juejin.cn?target=https%3A%2F%2Fiterm2colorschemes.com%2F "https://iterm2colorschemes.com/")

![](/images/jueJin/7162a85c906a45d.png)

*   Tabby对于这些配色方案居然全部支持了，打开`Color Scheme`即可设置，颜色主题很多，总有一款适合你！

![](/images/jueJin/c29055af8599425.png)

### 快捷键

如果你想设置或者查看快捷键的话，打开`Hotkeys`即可！

![](/images/jueJin/8f646e746a7c4e2.png)

### 窗口

如果你想设置Tabby的主题的话，打开`Window`选择相应主题即可。

![](/images/jueJin/5d612aa890794d9.png)

插件支持
----

> Tabby的功能非常强大，还支持一系列的插件，打开`Plugins`可查看并安装插件，下面我们来看看有哪些好用的插件！

![](/images/jueJin/b34014fc16954a8.png)

*   clickable-links：给URL、IP、路径添加点击跳转功能的插件；
    
*   docker：可以连接到Docker容器命令行的插件；
    
*   title-control：可以控制窗口标签位置的插件；
    
*   sync-config：可以将配置同步到Github或者Gitee的插件；
    
*   theme-windows10：Windows 10 专用主题插件。
    

总结
--

Tabby确实是一款非常优秀的终端工具，它免费并且开源。主题非常丰富，功能也很强大，还支持自定义插件，强烈建议大家尝试下！

参考资料
----

项目官网：[github.com/Eugeny/tabb…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FEugeny%2Ftabby "https://github.com/Eugeny/tabby")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！