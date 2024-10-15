---
author: "王宇"
title: "nano"
date: 八月30,2023
description: "十一、项目资源"
tags: ["十一、项目资源"]
ShowReadingTime: "12s"
weight: 95
---
 [![](/rest/documentConversion/latest/conversion/thumbnail/109707719/1)](/download/attachments/109707718/orinnano%E7%83%A7%E5%BD%95jetpack5.1.1%E6%AD%A5%E9%AA%A4.pdf?version=1&modificationDate=1693384907461&api=v2) PDF

  

1 、 当前路径打开终端执行以下命令解压 tbz2(请注意空格)：  
$tar xf Jetson\_Linux\_R35.3.1\_aarch64.tbz2  
$sudo tar xpf Tegra\_Linux\_Sample-Root-Filesystem\_R35.3.1\_aarch64.tbz2 -C Linux\_for\_Tegra/rootfs/  
$ cd Linux\_for\_Tegra/  
$ sudo ./apply\_binaries. sh  
$sudo ./tools/l4t\_flash\_prerequisites.sh  
跳线 REC+GND ， 接线进入刷机模式,输入以下命令开始刷系统：

  

sudo ./tools/kernel\_flash/l4t\_initrd\_flash.sh --external-device nvme0n1p1 \\  
\-c tools/kernel\_flash/flash\_l4t\_external.xml -p "-c bootloader/t186ref/cfg/flash\_t234\_qspi.xml" \\  
\--showlogs --network usb0 jetson-orin-nano-devkit internal

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)