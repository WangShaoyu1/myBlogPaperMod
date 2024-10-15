---
author: "王宇"
title: "MVP双屏炉端虚拟人8月份需求版本规划"
date: 九月03,2024
description: "2024~~八月份"
tags: ["2024~~八月份"]
ShowReadingTime: "12s"
weight: 91
---
版本号

UED完成时间

开发完成时间

提测完成时间

发布上线时间

版本号

UED完成时间

开发完成时间

提测完成时间

发布上线时间

0828

  

0815

  

0820

序号

PDCA需求编号

需求名称

需求描述

优先级

是否

完成

所属项目

状态

产品

内容

UED

建模

前端

后端

算法

测试

需求责任人

备注

1  
  

[PDCA项目质量管理 (yingzi.com)](https://pdca.yingzi.com/#/documentMgtView_1721702672230?id=312&type=prd)

**虚拟人联网绑定引导**

虚拟人开机GIF素材提供

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

虚拟人联网绑定引导GIF+播报录音素材提供

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

**虚拟人离线提醒**

*   离线状态虚拟人对话框连网提醒（已缓存和未缓存）
*   语音唤醒则展示联网提醒对话框同时播报

P1

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

2

  

**虚拟人语音交互流程**

虚拟人交互唤醒、聆听、播报、休眠状态开发，注意各状态匹配动作

P0

是

  

  

  

  

  

  

  

  

  

  
2.5d

  

  

  

语音标签，仅展示不可点击

P0

否

  

  

  

  

  

  

  

  

  

  

  

  

  

虚拟人交互打断规则

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

3

  

**语音执行烹饪功能及过程控制**

开始烹饪前检测结果播报

空烧、炉门开关和异常检测结果播报

P2

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

烹饪过程语音控制指令

**启动烹饪**

**暂停烹饪**

**继续烹饪**

**终止烹饪**

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

播报烹饪剩余时长

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

智能烹饪

*   无个性化选择启动烹饪提示
*   有个性化选择引导用户填参，**选择口感**

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

*   无法识别生熟引导用户选择烹饪模式，指令烹饪模式选择
*   检测失败引导用户手动操作
*   打开指定页面（智能烹饪）

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

智能复热 指令

*   打开指定页面（智能复热）
*   设置烹饪温度（20~100℃）

P1

部分完成

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

自助烹饪 指令

*   打开指定页面（自助烹饪)
*   设置火力（小火、中火、大火）
*   设置时间(0~30min)
*   设置火力+时间

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

解冻

启动解冻

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

4

  

**虚拟人入场**

虚拟人首次入场动作和语音播报

P1

是

  

  

  

  

  

  

  

  

  

  

  

  

  

非首次入场（切换虚拟人和重启设备）动作和语音播报

P1

是

  

  

  

  

  

  

  

  

  

  

  

  

5

  

**虚拟人互动**

首次点击虚拟人交互动作引导

P2

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

  

左右滑动查看虚拟人3D形象，无操作后2s回正

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

点击虚拟人八个身体部位动作和播报交互

P0

部分完成

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

6

  

**通用控制**

语控支持返回上一个页面

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

语控支持返回首页

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

  

语控指令支持息屏

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

7

  

**连续对话**

支持技能范围内连续对话

[https://alidocs.dingtalk.com/i/nodes/KGZLxjv9VG3LvNDXImBxbGR3V6EDybno?utm\_scene=person\_space](https://alidocs.dingtalk.com/i/nodes/KGZLxjv9VG3LvNDXImBxbGR3V6EDybno?utm_scene=person_space)

P1

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

  

8

  

**FAQ和闲聊资源接入**

FAQ资源接入

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

  

闲聊资源接入

P0

是

  

  

  

  

  

  

  

  

  

  

  

  

9

  

**菜谱交互**

菜谱搜索

菜谱搜索、菜谱选择、菜谱详情页交互

P1

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

  

菜谱推荐

推荐菜谱、推荐菜谱选择、菜谱详情页交互

P1

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

10

  

**系统设置相关交互**

语音支持系统设置页面跳转

打开设置、打开网络设置、查看设备信息、查看使用帮助、打开语言切换

P2

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

  

语音设定具体值

音量、亮度、休眠时长（用户未填时间槽位则跳转相关页面）

P2

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

  

语音设置功能开关：打开、关闭童锁，打开关闭关门检测

P2

否

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

  

切换角色、切换主题

P2

部分完成

  

  

  

  

  

  

  

  

  

  

[赵吉山](/display/~zhaojishan)

  

11

  

虚拟人和万得厨进程通讯方式

指令通过公共能力模块控制设备

  

P3

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

因改动影响较大，并且多个模块需同步修改，故切分支修改

  

  

  

指令通过直接连接万得厨进程通讯

P3

否

  

  

  

  

  

  

  

  

  

  

[陆元伟](/display/~luyuanwei)

因改动影响较大，并且多个模块需同步修改，故切分支修改

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)