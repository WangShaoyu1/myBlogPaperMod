---
author: "王宇"
title: "docker中运行虚拟人CPU过高问题排查"
date: 六月10,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 291
---
  

docker ps 查看运行的容器id，输出如下
========================

CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES  
da2f7a830d7d [acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.24-arm64v8](http://acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:0.0.24-arm64v8) "./main" 15 minutes ago Up 15 minutes AvatarModule  
5df9016b5d88 [mcr.microsoft.com/azureiotedge-hub:1.4](http://mcr.microsoft.com/azureiotedge-hub:1.4) "/bin/sh -c 'echo \\"$…" 19 hours ago Up 18 hours 0.0.0.0:443->443/tcp, :::443->443/tcp, 0.0.0.0:5671->5671/tcp, :::5671->5671/tcp, 0.0.0.0:8883->8883/tcp, :::8883->8883/tcp, 1883/tcp edgeHub  
b80067a6fd9d [mcr.microsoft.com/azureiotedge-agent:1.4](http://mcr.microsoft.com/azureiotedge-agent:1.4) "/bin/sh -c 'exec /a…" 19 hours ago Up 18 hours edgeAgent

**字段说明：**

**CONTAINER ID ：容器ID**

IMAGE：当前运行的镜像

NAMES：容器name

  

top命令查看进程资源使用情况
===============

  

![](/download/attachments/123664288/image2024-6-10_23-12-29.png?version=1&modificationDate=1718032349255&api=v2)

**同一个项目中，打包的main进程运行在docker中，而打包的yingzi\_vdh直接运行。**

  

docker exec -it <container\_id> top -H .查看CPU 线程情况
==================================================

输出如下

  

top - 04:07:07 up 19:23, 0 users, load average: 5.40, 5.90, 5.18  
Threads: 50 total, 6 running, 44 sleeping, 0 stopped, 0 zombie  
%Cpu(s): 87.1 us, 2.7 sy, 0.0 ni, 9.3 id, 0.0 wa, 0.7 hi, 0.3 si, 0.0 st  
MiB Mem : 7618.6 total, 1158.6 free, 3302.2 used, 3157.8 buff/cache  
MiB Swap: 3809.3 total, 3471.3 free, 338.0 used. 4018.8 avail Mem

PID USER PR NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND  
47 root 20 0 4071568 525372 83372 R 84.7 6.7 14:49.79 llvmpipe-4  
43 root 20 0 4071568 525372 83372 R 84.0 6.7 14:57.86 llvmpipe-0  
46 root 20 0 4071568 525372 83372 R 84.0 6.7 14:53.89 llvmpipe-3  
48 root 20 0 4071568 525372 83372 S 84.0 6.7 14:51.36 llvmpipe-5  
44 root 20 0 4071568 525372 83372 R 83.7 6.7 14:57.83 llvmpipe-1  
45 root 20 0 4071568 525372 83372 R 83.7 6.7 14:55.72 llvmpipe-2

  

### 字段说明

1.  **PID** (Process ID): 线程的唯一标识符。
2.  **USER**: 线程所属的用户。
3.  **PR** (Priority): 线程的优先级，数字越小优先级越高。`20` 是默认优先级。
4.  **NI** (Nice value): 线程的优先级调整值。`0` 是默认值，范围从 `-20`（最高优先级）到 `19`（最低优先级）。
5.  **VIRT** (Virtual Memory Size): 线程使用的虚拟内存总量，包括所有的代码、数据和共享库等（单位：KB）。
6.  **RES** (Resident Set Size): 线程使用的驻留内存量，即实际使用的物理内存量（单位：KB）。
7.  **SHR** (Shared Memory Size): 线程共享的内存量（单位：KB）。
8.  **S** (State): 线程的状态。常见的状态有：
    *   `R`: 运行
    *   `S`: 休眠
    *   `D`: 不可中断休眠
    *   `T`: 停止
    *   `Z`: 僵尸进程
9.  **%CPU**: 线程使用的 CPU 百分比。这里显示的是每个线程占用的 CPU 资源。
10.  **%MEM**: 线程使用的内存百分比。这里显示的是每个线程占用的内存资源。
11.  **TIME+**: 线程的总 CPU 时间，格式为 `MM:SS.SS`。
12.  **COMMAND**: 线程的名称或命令

  

**原因：** `llvmpipe` 是 LLVM 项目的软件渲染管道，说明容器中的 OpenGL 渲染可能是通过软件而不是硬件来完成的。这种情况下，所有渲染工作都由 CPU 执行，而不是由 GPU 执行，导致高 CPU 使用率。

  

jtop工具查看GPU和CPU占用情况
===================

直接输入jtop命令

  

  

![](/download/attachments/123664288/296172CB-A70F-4fe7-BF2F-7C1D10CF2E6D.png?version=1&modificationDate=1718031988656&api=v2)

  

可以同时看到应用程序使用GPU和CPU的情况，从上面信息可以看出yingzi\_vdh是使用了GPU渲染

如果使用nvidia-smi命令查看GPU，有时候会看不到GPU使用情况

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)