---
author: "王宇"
title: "VSCode相关"
date: 六月26,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 283
---
  

实现SSH免密码登录，

1.  **使用SSH配置文件 (`~/.ssh/config`)：**

*   在本地计算机上编辑SSH配置文件 `~/.ssh/config`，添加类似以下的配置：
    
        Host myserver
            HostName remote_host
            User username
            IdentityFile ~/.ssh/id_rsa
        
    
    *   `myserver`: 自定义的主机别名。
    *   `remote_host`: 远程服务器的主机名或IP地址。
    *   `username`: 远程服务器的用户名。
    *   `IdentityFile`: 本地计算机上私钥的路径。
*   然后通过 `ssh myserver` 命令连接到远程服务器，无需输入密码。
    

1.  **使用 `ssh-agent`：**

*   如果你生成了带有密码保护的SSH密钥，可以使用 `ssh-agent` 来管理密钥，并在需要时自动提供密码。
    
    *   启动ssh-agent：
    
    [?](#)
    
    `eval` `$(``ssh``-agent)`
    
    *   将私钥添加到ssh-agent：
    
    [?](#)
    
    `ssh``-add ~/.``ssh``/id_rsa`
    
    *   然后使用 `ssh` 命令连接到远程服务器，ssh-agent 将自动提供所需的密钥。

1.  **使用公钥授权文件 (`authorized_keys`)：**

*   将本地计算机上的公钥内容添加到远程服务器的 `~/.ssh/authorized_keys` 文件中。
    
    *   将公钥复制到远程服务器：
    
    [?](#)
    
    `ssh``-copy-``id` `username@remote_host`
    
    *   或者手动添加：
    
    [?](#)
    
    `cat` `~/.``ssh``/id_rsa``.pub |` `ssh` `username@remote_host` `'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'`
    
    *   然后再次使用 `ssh` 命令连接时就不需要输入密码了。

这些方法中的每一种都可以根据你的需求和操作习惯选择，但它们都能够帮助你实现SSH免密码登录，提高远程操作的便捷性和安全性。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)