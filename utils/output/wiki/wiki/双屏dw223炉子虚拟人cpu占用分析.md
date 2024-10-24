---
author: "王宇"
title: "双屏dw223炉子虚拟人cpu占用分析"
date: 九月26,2024
description: "双屏英伟达DW223"
tags: ["双屏英伟达DW223"]
ShowReadingTime: "12s"
weight: 176
---
*   1[1\. 测试设备](#id-双屏dw223炉子虚拟人cpu占用分析-测试设备)
*   2[2\. 测试场景](#id-双屏dw223炉子虚拟人cpu占用分析-测试场景)
    *   2.1[2.1. 首页虚拟人静止，cpu占比约在73% ，内存4.5% ](#id-双屏dw223炉子虚拟人cpu占用分析-首页虚拟人静止，cpu占比约在73% ，内存4.5% )
    *   2.2[2.2. 首页与虚拟人进行交互，切换角色，cpu占比瞬间高达约91% ，内存4.9% ，然后再降回去](#id-双屏dw223炉子虚拟人cpu占用分析-首页与虚拟人进行交互，切换角色，cpu占比瞬间高达约91% ，内存4.9% ，然后再降回去)
    *   2.3[2.3. 烹饪中，虚拟人静止，虚拟人CPU占比约72% ，内存4.9% ](#id-双屏dw223炉子虚拟人cpu占用分析-烹饪中，虚拟人静止，虚拟人CPU占比约72% ，内存4.9% )
    *   2.4[2.4. 烹饪中，与虚拟人进行交互，讲个故事，cpu占比约79% ，内存5.0% ](#id-双屏dw223炉子虚拟人cpu占用分析-烹饪中，与虚拟人进行交互，讲个故事，cpu占比约79% ，内存5.0% )
    *   2.5[2.5. 虚拟人开机24小时后，再次查看虚拟人占用资源情况，虚拟人无占用资源过高情况。CPU占比约70% ，内存占5.0% ](#id-双屏dw223炉子虚拟人cpu占用分析-虚拟人开机24小时后，再次查看虚拟人占用资源情况，虚拟人无占用资源过高情况。CPU占比约70% ，内存占5.0% )
*   3[3\. 测试数据](#id-双屏dw223炉子虚拟人cpu占用分析-测试数据)
*   4[4\. 测试结论](#id-双屏dw223炉子虚拟人cpu占用分析-测试结论)

1\. 测试设备
========

样机

ssh [yingzi@172.19.50.91](mailto:yingzi@172.19.50.91)

设备系统参数

六核cpu，128g内存

系统版本

1.1.70

虚拟人版本

1.0.6

虚拟人进程名

yingzi\_vdh-temp

2\. 测试场景
========

2.1. 首页虚拟人静止，cpu占比约在73% ，内存4.5% 
------------------------------

![](/download/attachments/134055737/image2024-9-9_10-12-13.png?version=1&modificationDate=1725847933109&api=v2)

2.2. 首页与虚拟人进行交互，切换角色，cpu占比瞬间高达约91% ，内存4.9% ，然后再降回去
------------------------------------------------

![](/download/attachments/134055737/image2024-9-9_10-25-11.png?version=1&modificationDate=1725848711523&api=v2)

2.3. 烹饪中，虚拟人静止，虚拟人CPU占比约72% ，内存4.9% 
----------------------------------

![](/download/attachments/134055737/image2024-9-9_10-34-30.png?version=1&modificationDate=1725849271044&api=v2)

2.4. 烹饪中，与虚拟人进行交互，讲个故事，cpu占比约79% ，内存5.0% 
---------------------------------------

![](/download/attachments/134055737/image2024-9-9_10-38-13.png?version=1&modificationDate=1725849493831&api=v2)

2.5. 虚拟人开机24小时后，再次查看虚拟人占用资源情况，虚拟人无占用资源过高情况。CPU占比约70% ，内存占5.0% 
------------------------------------------------------------

![](/download/attachments/134055737/image2024-9-9_13-57-52.png?version=1&modificationDate=1725861472874&api=v2)

3\. 测试数据
========

场景

是否烹饪

% CPU

内存

场景

是否烹饪

% CPU

内存

首页虚拟人静止

否

73% 

4.5% 

首页与虚拟人进行交互，切换角色

否

91% 

4.9% 

烹饪中，虚拟人静止

是

72% 

4.9% 

烹饪中，与虚拟人进行交互

是

79% 

5.0% 

虚拟人开机24小时后，虚拟人静止

否

70% 

5.0% 

  

4\. 测试结论
========

1.虚拟人总体CPU占比约占整个六核系统CPU的13% ，运行内存占比约为4.9% （总运用内存7.3Gi），总体而言虚拟人占用资源不算大，可优化提升的空间并不大。

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)