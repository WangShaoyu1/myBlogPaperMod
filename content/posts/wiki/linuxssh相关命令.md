---
author: "王宇"
title: "linuxssh相关命令"
date: 五月27,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 255
---
### 通过ssh远程连接  
ssh username@remotehost

  

### 使用SSH（Secure Shell）传输文件

通常有两种主要方法：scp（Secure Copy）和rsync，或者你也可以使用sftp（Secure File Transfer Protocol）命令行工具来手动传输文件。

1\. 使用 scp  
scp 是基于SSH协议进行安全的远程文件拷贝的命令。其基本语法如下：

bash  
\# 从本地复制到远程  
scp /path/to/local/file username@[remotehost:/path/to/remote/directory/](http://remotehost/path/to/remote/directory/)

如果是文件夹。添加-r 

  
\# 从远程复制到本地  
scp username@[remotehost:/path/to/remote/file](http://remotehost/path/to/remote/file) /path/to/local/directory/

  
安装包  
sudo apt -f install

设置自启动  
sudo cp /usr/share/applications/fcitx.desktop /etc/xdg/autostart/

###   
文件映射。远程文件目录映射到本地  
sudo sshfs -o allow\_other username@[remotehost:/path/to/remote/directory](http://remotehost/path/to/remote/directory) /path/to/local/directory

  
  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)