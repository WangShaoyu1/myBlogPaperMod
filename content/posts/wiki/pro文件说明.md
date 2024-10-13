---
author: "王宇"
title: "pro文件说明"
date: 三月29,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 260
---
#qt程序用到的模块

QT += core gui

  
#QT += core gui widgets

#如果是qt5.0版本以上，可以不加下面这句话，直接把 widgets 写在上面的模块中即可。这句代码是为了兼容5.0以下的版本

greaterThan(QT\_MAJOR\_VERSION, 4): QT += widgets

  
CONFIG += c++11

  
DEFINES += QT\_DEPRECATED\_WARNINGS

  
#生成的应用程序的名字

TARGET = xxx

  
#指定生成的makefile的类型为app 还可以为lib类型（生成库）

TEMPLATE = app

  
#源文件 \\ 是换行的意思

SOURCES += \\

main.cpp \\

mywidget.cpp

  
#头文件

HEADERS += \\

mywidget.h

  
\# Default rules for deployment.

qnx: target.path = /tmp/$${TARGET}/bin

else: unix:!android: target.path = /opt/$${TARGET}/bin

!isEmpty(target.path): INSTALLS += target

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)