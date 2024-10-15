---
author: "王宇"
title: "远程linux终端显示UI程序步骤"
date: 六月14,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 275
---
  

当你想从一个远程会话或另一个用户会话中运行图形界面程序时。以下是对每一行代码的详细解释：

1.  **`export DISPLAY=:0`**
    -----------------------
    
    *   `DISPLAY` 环境变量告诉图形应用程序它们应该在哪个显示屏幕上显示。
    *   `:0` 通常表示本地计算机的第一个物理或虚拟屏幕。在多显示器设置或使用了如Xrandr等工具创建的虚拟屏幕时，可能会有多个DISPLAY设置（如 `:0.0`, `:0.1` 等）。
    *   使用 `export` 命令是为了将这个变量设置为当前shell及其子进程的环境变量。
2.  **`export XAUTHORITY=/run/user/1001/gdm/Xauthority`**
    -----------------------------------------------------
    
    *   `XAUTHORITY` 环境变量指定了包含X服务器授权信息的文件的路径。
    *   在这个例子中，`/run/user/1001/gdm/Xauthority` 可能是某个特定用户（其UID为1001）的GDM（GNOME Display Manager）会话的X授权文件。
    *   同样，使用 `export` 命令是为了将这个变量设置为当前shell及其子进程的环境变量。
3.  **`xhost +SI:localuser:$USER`**
    -------------------------------
    
    *   `xhost` 是一个用于控制哪些主机或用户可以访问X服务器的工具。
    *   `+SI:localuser:$USER` 这个命令允许本地机器上的 `$USER` 用户（即当前shell会话中的用户）通过SSH的X11转发（SSH的X11转发通常使用“SI”即“Subsystem”方式）来访问X服务器。
    *   注意：这个命令可能会带来安全风险，因为它允许任何从当前用户SSH会话中运行的程序访问X服务器。在生产环境中或在不安全的网络环境中，应该谨慎使用或避免使用此命令。

  

  

添加docker权限
==========

xhost +local:docker

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)