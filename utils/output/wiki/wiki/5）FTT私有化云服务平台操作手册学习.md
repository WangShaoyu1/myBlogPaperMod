---
author: "王宇"
title: "5）FTT私有化云服务平台操作手册学习"
date: 五月19,2023
description: "2、系统学习小结"
tags: ["2、系统学习小结"]
ShowReadingTime: "12s"
weight: 597
---
概念理解

母版：用于管理可复用的业务，有版本管理，可被引用。母版可被查看、管理、修改、删除。

  

1、FTT功能清单

序号

功能菜单

平台功能

功能操作

功能目的

疑惑问题

备注

1

监控统计

访问统计

筛选【时间】、【应用】、【语言】

1、监控统计用于日常数据的监控运营，主要统计终端用户访问数、交互次数等。

  

1、支持展现的维度除访问用户数、交互请求数还有哪些？

  

2

应用中心

我的应用

【查看】

【配置】（下含创建、查看、配置、更新、删除虚拟人）

【富文本编辑器】（下含功能区、编辑区、预览区、属性区、发布区）

【运营应用】（含会话记录）

1、进行选择存在已发布的虚拟人母版及其版本，支持虚拟人的创建、更新、删除，；

2、配置虚拟人智能交互能力；

3、用于监管应用上线后终端用户的使用情况，也为优化虚拟人的知识母版提供参考。；

1、NLP配置顺序和阈值，阈值是统一配置，还是单独的

2、TTS配置看不到发音人、音量、语速、语调的说明，TTS的配置是否只能恢复上一次

3、富文本的组合形态有哪些，文字数量、图片数量、视频时长是否有限制？

4、上传的资源大小会不会进行自压缩，是否会影响后续交互的响应速度；

5、上传的资源太大有没有可能导致播放卡顿；

  

3

资源母版

虚拟人

【创建虚拟人】

【配置与发布版本】下含：

上传美术资源：可调整角色模型、角色骨骼、角色动画、语种配置

配置 AI 能力：在语种配置下添加角色状态、对话能力、行为情绪

【版本管理】

【查看虚拟人母版】

【删除虚拟人母版】

  

1、管理可复用的虚拟人资源和默认 AI 能力。

2、支持资源母版的版本管理，返回历史记录；

1、角色状态是否能新增 ；

2、行为情绪看不到解释 ；

3、NLP支持的闲聊库只有合作方科大讯飞；

4、TTS配置也是搭载科大讯飞提供的能力？声音类型、发音人有哪些类型，是否支持自己录入；

5、虚拟人母版有无数量限制；

6、提供的对话能力、行为情绪跟后续导入的问答对、富文本编辑器有什么区别；

  

4  
  

知识母版

FAQ

【创建FAQ母版】

【查看FAQ母版】

【管理FAQ母版】（下含编辑、训练、排查、测试、发布FAQ）

【删除FAQ母版】

1、为虚拟人提供不需要客户端执行逻辑的问答类知识；

1、FAQ母板数量有无限制，一个母版内的FAQ数量有无限制

2、功能描述的是初期版本，后期提的更新需求没有描述

3、没有说明阈值，默认阈值是多少，是否能自己调整，每个母版的阈值是否可分别设置；

  

  

指令

【创建指令母版】

【查看指令母版】

【管理指令母版】（管理词槽、编辑指令、训练、测试、发布）

【删除指令母版】

1、为虚拟人提供需要客户端执行逻辑的技能知识；

1、指令数量有无限制

2、指令的默认阈值没有说明

  

导航模板

/

/

/

  

5

系统设置

成员

【创建】（设置账户名、密码、真实姓名、权限）

1、在此页面，对账号信息进行增删改。

  

  

用户组

【新增】

【删除】

1、用户组用于管理群组权限；（为用户勾选功能的使用权限）

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)