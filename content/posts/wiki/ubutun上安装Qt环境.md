---
author: "王宇"
title: "ubutun上安装Qt环境"
date: 三月19,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 260
---
**Qt介绍**

Qt是一个跨平台应用程序和用户界面框架，使用C + +或者QML，类似CSS和JavaScript开发语言。 它提供给应用程序开发者建立艺术级的图形用户界面所需的所用功能。Qt是完全面向对象的，很容易扩展，并且允许真正地组件编程。Qt Creator支持Qt IDE。 Qt Quick的配套工具的开发是由一个包容性的精英治理模式的一个开源项目。 Qt可以根据开源（GPL v3和LGPL 2.1版）或商业条款进行使用。  
基本上，Qt 同 X Window 上的 Motif，Openwin，GTK 等图形界 面库和 Windows 平台上的 MFC，OWL，VCL，ATL 是同类型的东西，但是 Qt 具有下列优点:  
优良的跨平台特性:   
Qt支持下列操作系统: Microsoft Windows 95/98， Microsoft Windows NT， Linux， Solaris， SunOS， HP-UX， Digital UNIX (OSF/1， Tru64)， Irix， FreeBSD， BSD/OS， SCO， AIX， OS390，QNX 等等。

  

  

**Qt 环境安装**

默认linux平台下提供的安装包以run后缀结尾

下载路径：[https://download.qt.io/archive/qt/5.12/5.12.12/qt-opensource-linux-x64-5.12.12.run](https://download.qt.io/archive/qt/5.12/5.12.12/qt-opensource-linux-x64-5.12.12.run)

下载完xxx.run文件

下载后 再控制台 chmod +x  xxx.run增加权限

然后./xxx.run运行安装文件

安装过程需要有一个QT账号

![](https://pic1.zhimg.com/80/v2-79282de866b4dde43cf8383af3de08fc_720w.webp)

  

  

  

![](https://pic2.zhimg.com/80/v2-35d8263d296a91c8f076c4981726826d_720w.webp)

上图红框中是必须选择的，其他的组件就根据自己的实际需要选择

  

Qt开发环境安装完成了后，接着需要安装编译器，在终端输入以下命令安装编译器和所需的库：

    sudo apt-get install gcc               #安装gcc编译器
    sudo apt-get install g++               #安装g++编译器
    sudo apt-get install make              #安装make构建套件
    sudo apt-get install libgl1-mesa-dev   #安装OpenGL核心库

  

  

运行QtCreator看看效果：

![](https://pic2.zhimg.com/80/v2-627f8c61dd32961209a68428e0790b55_720w.webp)

  

相关文章：

[Qt技术开发](https://zhuanlan.zhihu.com/p/608318975)

[Qt介绍](https://www.yiibai.com/qt/)

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)