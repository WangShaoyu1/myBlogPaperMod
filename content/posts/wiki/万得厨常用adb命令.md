---
author: "王宇"
title: "万得厨常用adb命令"
date: 二月22,2023
description: "七、测试"
tags: ["七、测试"]
ShowReadingTime: "12s"
weight: 169
---
序号

说明

命令/路径

序号

说明

命令/路径

1

进入安卓原生系统设置页面

adb shell am start com.android.settings/com.android.settings.Settings

2

新食记应用包名

com.yingzi.microwoven

3

云端查看微波炉数据库（域名需要对应设备IP）

[http://172.19.50.221:8080](http://172.19.50.221:8080/#table=SCAN_RESULT)

4

拉取微波炉上新食记的应用日志

adb pull sdcard/android/data/com.yingzi.microwoven/cache/log

5

安装生产固件包时需卸载程序

adb uninstall com.shuying.astroboy.dw201.centercontroller  
adb uninstall com.shuying.astroboy.dw201.basicfunction  
adb uninstall com.shuying.astroboy.dw201.cloudcommunications  
adb uninstall com.shuying.astroboy.dw201.updateservice  
adb uninstall com.shuying.astroboy.dw201.logupload

6

连接设备

adb connect ip

7

查看连接设备

adb devices

8

获取权限

adb root

9

万得厨界面截图传到本地（需要在cmder上才能执行该命令，cmd不支持）

adb shell screencap -p | sed 's/\\r\\n$//' > G:\\image\\time.png

10

拉取微波炉系统全部日志

adb pull data/data/com.shuying.astroboy.dw201.consumer.updateservice/cache/astroboy\_log

11

文件md5值获取

[http://www.metools.info/other/o21.html](http://www.metools.info/other/o21.html)

12

消费端查看下载日志

adb pull data/data/com.shuying.astroboy.dw201.consumer.updateservice/cache/astroboy\_log

13

删除微波炉数据库

adb root  
adb shell  
cd data/data/com.shuying.astroboy.dw201.centercontroller（研发端） 或 cd /data/data/com.shuying.astroboy.dw201.consumer.centercontroller （消费端）  
ls cache code\_cache databases lib  
rm -rf databases

14

软件升级包储存路径

/data/user/0/com.yingzi.microwoven/files

15

强制降级安装apk

adb install -r -d apk

16

小万语音助手录音文件保存目录

/sdcard/AIUI/data/

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)