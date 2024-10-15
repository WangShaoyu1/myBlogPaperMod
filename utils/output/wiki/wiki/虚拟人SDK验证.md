---
author: "王宇"
title: "虚拟人SDK验证"
date: 五月17,2024
description: "SDK能力验收"
tags: ["SDK能力验收"]
ShowReadingTime: "12s"
weight: 281
---
  

1

函数名

验证是否通过

函数功能

注

2

haisdk\_load\_env

是

设置环境配置路径

  

3

haisdk\_avatar\_load\_parts

是

加载或者替换身体部件

  

4

haisdk\_background\_show\_color

是

启用颜色背景，分别传递rgba的值，与SetBackgroundImage互斥，只有一个会显示。

  

5

haisdk\_avatar\_unload\_parts

是

卸载身体部件

  

6

haisdk\_avatar\_destroy

是

删除数字虚拟人

  

7

haisdk\_download\_server\_asset

是

调用haisdk\_check\_server\_asset之后，理论上可以调用这个接口了，调用时需要有网络，这个接口主要就是下载资源，

  

8

haisdk\_init

是

从启动到退出的一次完整操作流程中，SDK的初始化流程只需在主程序启动时执行一次。

  

9

haisdk\_check\_server\_asset

是

SDK初始化完毕之后，可以调用这个接口，调用时需要有网络，这个接口主要就是检查服务器资源状态，检查结束会异步返回值。

  

10

haisdk\_get\_authtoken

是

获取授权的token

  

11

haisdk\_add\_draw\_surface

是

添加一个绘制表面

  

12

haisdk\_enable\_single\_surfacemode

是

启用单一surface显示模式，这个模式与MultiSurfaces互斥，只会一个enable

  

13

haisdk\_set\_camera\_perspective\_focal

是

设置sdk的内部的渲染相机的投影方式，正交投影。

  

14

haisdk\_avatar\_do\_standby

是

将角色行为状态切换到 Idle 状态

  

15

haisdk\_avatar\_anim\_playdynamic

是

将角色行为状态切换到动态播报状态, 同时输出口型对齐结果和行为情绪分析结果。

  

16

haisdk\_avatar\_anim\_play\_aplusid

是

将角色行为状态切换到动态播报状态, 同时输出口型对齐结果和行为情绪分析结果。

  

17

haisdk\_avatar\_anim\_playclip

是

将角色行为状态切换到播放原子级的分成动画状态

  

18

haisdk\_avatar\_scale\_to

是

将角色基于现有大小缩放至指定的大小

  

19

haisdk\_avatar\_translate\_to

是

将角色由当前位置直接移动到指定的3d世界坐标位置

  

20

haisdk\_avatar\_get\_transformation

是

获取虚拟人实例的位置参数

  

21

haisdk\_avatar\_translate\_by

是

将角色由当前位置直接移动到当前角色的3d世界坐标+(deltax, deltay)的位置处

  

22

haisdk\_background\_show\_image

是

启用贴图背景，传递背景贴图的路径，与SetBackgroundColor互斥，只有一个会显示

  

23

haisdk\_update

是

sdk全局更新接口

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)