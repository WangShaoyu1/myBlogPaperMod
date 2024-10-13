---
author: "王宇"
title: "c编译相关命令"
date: 三月18,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 243
---
**编译动态库**

g++ xxx.cpp -fPIC -shared -o xxx.so

  

### \-fPIC

编译器就输出位置无关目标码.适用于动态连接(dynamic linking),即使分支需要大范围转移.

### \-o

制定目标名称,缺省的时候,gcc 编译出来的文件是a.out

### \-shared (-G) 此选项将尽量使用动态库，为默认选项

优点：生成文件比较小

缺点：运行时需要系统提供动态库

  

  

  

相关文章：

[GCC 参数详解](https://www.runoob.com/w3cnote/gcc-parameter-detail.html)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)