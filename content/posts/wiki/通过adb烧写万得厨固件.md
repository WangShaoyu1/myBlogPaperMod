---
author: "王宇"
title: "通过adb烧写万得厨固件"
date: 二月17,2023
description: "十一、项目资源"
tags: ["十一、项目资源"]
ShowReadingTime: "12s"
weight: 102
---
安装adb工具
=======

ADB是Android Debug Bridge，是Google Android SDK中包含的命令行程序。 adb可以从计算机上通过USB控制您的设备，来回复制文件，安装和卸载应用程序，运行shell命令等。

安装adb:

Windows版本：[https://dl.google.com/android/repository/platform-tools-latest-windows.zip](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)  
Mac版本：[https://dl.google.com/android/repository/platform-tools-latest-windows.zip](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)  
Linux版本：[https://dl.google.com/android/repository/platform-tools-latest-linux.zip](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)

将文件下载下来，解压缩到自定义的安装目录

配置环境变量  
按键windows+r打开运行，输入sysdm.cpl，回车。  
高级》环境变量》系统变量》path  
将adb的存放路径添加进path中

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200831141605395.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3gyNTg0MTc5OTA5,size_16,color_FFFFFF,t_70#pic_center)

  
两次确定之后在重新打开命令行进行校验是否安装成功。

zhuxiujundeMacBook-Pro:~ zhuxiujun$ adb version

Android Debug Bridge version 1.0.41

Version 31.0.3-7562133

连接设备
====

主要命令：

*   home键：adb shell input keyevent 3  
    
*   返回按键 ： adb shell input keyevent 4
    
*   连接设备：  adb connect ip 
    
*   重启设备进入loader下载模式：adb reboot loader
*   重启设备：adb reboot
*   打开设置页面：adb shell am start com.android.settings/com.android.settings.Settings
*   断开无线连接：adb disconnect 

  

连接设备实例
------

首先你的手机和设备是应用同一个网络。

比如设备IP是：192.168.55.5

### 连接设备

打开终端，输入命令：adb connect 设备IP

例子：adb connect 192.168.55.5

### 上传固件

将固件下载，重命名为:update.zip。上传固件命令：adb push  固件所在电脑的全路径  /sdcard/

注意：一定要把固件包重命名为update.zip

例子：adb push D:/update.zip /sdcard/

等待上传完成。

### 删除原有程序

adb uninstall com.yingzi.microwoven

### 烧写固件

固件上传完成后，扫码二维码进入升级流程。如下：

![](/download/attachments/95560052/image2022-4-19_9-43-19.png?version=1&modificationDate=1676604375353&api=v2)

等待升级完成。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)