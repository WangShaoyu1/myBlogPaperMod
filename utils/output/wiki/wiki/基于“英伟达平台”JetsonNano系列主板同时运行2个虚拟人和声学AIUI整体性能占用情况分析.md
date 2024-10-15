---
author: "王宇"
title: "基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析"
date: 六月20,2024
description: "万得厨cpu占用情况分析"
tags: ["万得厨cpu占用情况分析"]
ShowReadingTime: "12s"
weight: 166
---
*   1[1\. 测试对象](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-测试对象)
*   2[2\. 结论](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-结论)
*   3[3\. 测试过程](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-测试过程)
    *   3.1[3.1. 场景一：单独运行虚拟人功能](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-场景一：单独运行虚拟人功能)
        *   3.1.1[3.1.1. 数据统计](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-数据统计)
    *   3.2[3.2. 场景二：单独运行AIUI声学功能](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-场景二：单独运行AIUI声学功能)
        *   3.2.1[3.2.1. 数据统计](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-数据统计.1)
    *   3.3[3.3. 场景三：运行AIUI声学+虚拟人](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-场景三：运行AIUI声学+虚拟人)
        *   3.3.1[3.3.1. 数据统计](#id-基于“英伟达平台”JetsonNano系列主板同时运行2个虚拟人和声学AIUI整体性能占用情况分析-数据统计.2)

1\. 测试对象
========

**硬件平台：**

*   型号：Jetson Nano系列
*   内存：8G
*   硬盘：128G
*   CPU核心数：6核，600%
*   显卡：NVIDIA Tegra Orin (nvgpu)/integrated

**应用软件：**

同时运行2个 虚拟人应用，同时一个声卡收音（咨询讯飞厂家后，讯飞声学AIUI支持一个主板，两块声卡、两个麦克风同时工作）

2\. 结论
======

结果：虚拟人形象渲染、声学都运行的情况下，平均整体占据CPU 13.4%  ，占用不到一个核；平均内存为2.2G、占比为27.5%；

数据类：

1.   **在满载CPU为600%的情况下**，通过测试，单独运行虚拟人CPU平均占用60%左右，最高63%。单独运行aiui CPU平均占用20%左右，最高30%。两个APP一起运行CPU平均占用75%  ，最高81%。
2.  虚拟人渲染过程消耗CPU，经询问，该主板确有搭载显卡，看虚拟人SDK是否有必要通过优化硬件加速方式渲染来减少CPU占用（需要虚拟人厂家给出解决方案）

3\. 测试过程
========

3.1. 场景一：单独运行虚拟人功能
------------------

平台：处理器ARMV8，6核，7.3G内存

场景解释：只开启虚拟人运行功能。通过按钮点击模拟ASR话术。调用虚拟人播报nlp过程。查看CPU占用情况

### 3.1.1. 数据统计

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

1

63.2%

2.9G

  

2

60.3%

2.9G

  

3

62.1%

  

  

4

60.6%

3.3G

  

平均

61.5%

3G

  

![](/download/attachments/123662075/1.png?version=6&modificationDate=1717397578092&api=v2)

  

![](/download/attachments/123662075/2.png?version=6&modificationDate=1717397583691&api=v2)

  

![](/download/attachments/123662075/3.png?version=4&modificationDate=1717397597724&api=v2)

  

![](/download/attachments/123662075/4.png?version=2&modificationDate=1717397609080&api=v2)

3.2. 场景二：单独运行AIUI声学功能
---------------------

平台：处理器ARMV8，6核，7.3G内存

测试场景：单独运行语音功能

场景解释：只开启语音运行功能。通过唤醒和识别ASR。查看CPU占用情况

### 3.2.1. 数据统计

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

1

24.2%

2.46G

  

2

30.1%

2.46G

  

3

30.5%

2.47G

  

平均

28.3%

2.46G

  

![](/download/attachments/123662075/11.png?version=1&modificationDate=1717397704977&api=v2)

  

![](/download/attachments/123662075/12.png?version=1&modificationDate=1717397711956&api=v2)

  

![](/download/attachments/123662075/13.png?version=1&modificationDate=1717397719502&api=v2)

3.3. 场景三：运行AIUI声学+虚拟人
---------------------

平台：处理器ARMV8，6核，7.3G内存

场景解释：通过AIUI唤醒+识别。调用虚拟人播报nlp方式。查看CPU占用情况

### 3.3.1. 数据统计

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

序号

CPU占比（满载600%  ）

内存（满载8G）

备注

1

78.4%

2.25G

  

2

81.1%

2.27G

  

3

81.8%

2.08G

  

平均

80.4%

2.2G

  

![](/download/attachments/123662075/31.png?version=1&modificationDate=1717397767773&api=v2)

  

![](/download/attachments/123662075/32.png?version=1&modificationDate=1717397772065&api=v2)

  

![](/download/attachments/123662075/33.png?version=1&modificationDate=1717397777224&api=v2)

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)