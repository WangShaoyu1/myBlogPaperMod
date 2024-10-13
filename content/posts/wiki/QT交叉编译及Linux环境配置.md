---
author: "王宇"
title: "QT交叉编译及Linux环境配置"
date: 四月26,2024
description: "黄圆成"
tags: ["黄圆成"]
ShowReadingTime: "12s"
weight: 332
---
1.1. 准备工作ssh服务配置及FTP文件传输服务
--------------------------

### 1.1.1. Linux启动ssh服务

[?](#)

`sudo apt-get install openssh-server`

`sudo /etc/init.d/ssh start`

`设置开机自启动`

`sudo systemctl enable ssh`

`关闭ssh开机自动启动命令`

`sudo systemctl disable ssh`

`单次开启ssh`

`sudo systemctl start ssh`

`单次关闭ssh`

`sudo systemctl stop ssh`

`设置好后重启`

`reboot`

### 1.1.2. Linux上启动FTP服务

  

[?](#)

`sudo apt-get install vsftpd`

`vi /etc/vsftpd.conf`

`anonymous_enable=YES`

`local_enable=YES`

`write_enable=YES`

`启动 vsftpd 服务`

`sudo systemctl start vsftpd`    

`停止 vsftpd 服务`

`sudo systemctl stop vsftpd`   

`重启 vsftpd 服务`

`sudo systemctl restart vsftpd` 

`设置 vsftpd 服务开机自启动`

`sudo systemctl enable vsftpd`

  

### 1.1.3. Qt安装

Qt version installed by apt on Ubuntu 20.04 is 5.12.8

  

[?](#)

`sudo` `777` `chmod qt-opensource-linux-x64-``5.12``.``8``.run`

 `./qt-opensource-linux-x64-``5.12``.``8``.run`

`安装完后，需要配置环境变量，跟windows是一个道理，不然无法使用一些cmd命令`

`在以下文件 复制你的bin/路径 在qt应该是两个 主bin/目录 和tools下的bin/`

`yingzi``@ubuntu``~: sudo vim /etc/bash.bashrc`

`#以下两个代表你下载qt---.run时的文件目录 一般自己指定目录 不然在哪里你找不到`

`#复制进文件可以使用  shift + insert   快捷键`

`export PATH=``"/opt/Qt5.12.8/Tools/QtCreator/bin:$PATH"`

`export PATH=``"/opt/Qt5.12.8/5.12.8/gcc_64:$PATH"`

`#在终端输入qtcreator就能直接打开Qt Creator`

`yingzi``@ubuntu``~: qtcreator`

  

### 1.1.4. 安装必要的开发环境工具

[?](#)

`sudo apt-get install g++`

`sudo apt-get install build-essential`

`sudo apt-get install libgl1-mesa-dev`

`sudo apt-get install libglu1-mesa-dev freeglut3-dev`

`sudo apt-get install cmake`

`sudo apt-get install libssl-dev`

`sudo apt-get install make`

#### 1.1.4.1. cmake升级

[?](#)

`wget https:``//cmake.org/files/v3.22/cmake-3.22.1.tar.gz --no-check-certificate`

  

#### 1.1.4.2. SLDL库安装

[?](#)

`sudo apt-get install libsdl2-dev`

#### 1.1.4.3. curl库安装

[?](#)

`apt-get install libcurl4`

`apt-get install libcurl4-openssl-dev`

  

#### 1.1.4.4. yingzi-nvidia-vdh工程依赖库安装

[?](#)

`sudo apt install curl`

`sudo apt install libasound2`

`sudo apt install libspdlog-dev`

`sudo apt install libboost-all-dev`

`sudo apt-get install libzmq3-dev libczmq-dev`

`sudo apt install libc++-dev libc++abi-dev`

  

### 1.1.5. windows文件和Linux文件格式转换

  

[?](#)

`windows下^M转换为linux下$结尾`

`dos2unix solrconfig.xml` `//windows格式转unix格式`

`unix2dos solrconfig.xml` `//unix格式转window格式`

`dos2unix filename1 filename2 filename3 一次转换多个文件`

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)