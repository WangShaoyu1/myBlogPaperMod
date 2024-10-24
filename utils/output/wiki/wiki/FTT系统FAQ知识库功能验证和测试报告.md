---
author: "王宇"
title: "FTT系统FAQ知识库功能验证和测试报告"
date: 六月01,2023
description: "1）服务助手类"
tags: ["1）服务助手类"]
ShowReadingTime: "12s"
weight: 605
---
一、FTT系统功能验证（根据AI虚拟人云服务平台操作手册对比）：

序号

一级功能

功能点

功能说明

功能验证结果

备注

1

FAQ首页

说明

1、支持创建并管理多个相互独立的 FAQ 母版

2、在列表页，可「创建」新的母版。针对列表，可进行过滤筛选。

3、针对每一个母版，可进行「查看」「管理」「删除」操作。

验证成功

  

  

创建FAQ母板

创建

1、点击「创建」，填写名称和语种后点击「确认」即可完成创建。创建后，母版名称可修  
改，语种类型不可修改。

验证成功

  

  

查看 FAQ 母版

查看

1、点击「查看」，可查看母版信息。对于可修改的字段，编辑后保存即可。

1、可查看模板信息

2、只支持修改母板名称

  

  

  

  

  

  

  

  

  

  

管理 FAQ 母版

说明

1、点击「管理」进入 FAQ 母版。每个 FAQ 母版包含【编辑母版】【训练母版】【测试母  
版】【排查母版】【发布母版】五个标签页。

验证成功

  

  

编辑 FAQ

1、在【编辑母版】页面，可管理 FAQ 分类及具体的问答内容。

2、左侧用于管理分类，支持对分类进行增删改。删除分类时，该分类下的 FAQ 将自动归  
入“未分类”。  
3、右侧用于管理具体的 FAQ 问答，每一条 FAQ 包含分类、标准问、相似问、回复话  
术。

4、支持逐条新增/编辑/开关状态、批量导入、全量导出。

1、支持逐条新增/编辑/开关状态

2、支持批量导入/导出/删除/开关状态

比之前和操作说明书里面多了批量删除和开关状态

  

训练

1、在【训练母版】页面，点击「开始训练」，可对【编辑母版】页面的指令进行训练，训  
练成功后，将更新测试模型的识别效果。（“最后编辑时间”、“上次训练时间”可用于参考  
最新编辑的内容是否经过训练）

最后编辑时间

上次训练时间

上次发布时间

  

  

排查

1、在【排查母版】页面，可深度测试最新模型对测试问句的打分情况和影响因素，并进  
行调优。

对影响命中的相似问进行删除和转移

  

  

测试

1、在【测试母版】页面，可模拟问答对话，用于测试最新模型的问答效果，支持单条测  
试和批量测试。

支持单条测试和批量测试

  

  

发布

1、在【发布母版】页面，可将已训练的模型更新到线上，训练成功并测试验证后，点击  
「发布」即更新线上效果。（“上次训练时间”、“上次发布时间”可用于参考最新训练的模  
型是否已发布）

2、每个 FAQ 母版会保留两个模型，一个为线上模型，一个为测试模型。【训练母版】更  
新的是测试模型，用于调试确认效果；【发布母版】是将测试模型更新到线上。

验证成功

  

  

删除 FAQ 母版

删除

1、出于保护，没有被应用虚拟人使用的 FAQ 母版可以删除，有虚拟人正在使用的 FAQ  
母版不支持删除。

2、点击「删除」，在输入登录密码通过校验后，如果系统校验没有虚拟人正在使用，即完  
成删除。

验证成功

  

二、服务助手前后测试结果（在全量下对服务助手进行测试）

版本

标准问

相似问

标准问：相似问

批测结果

版本

标准问

相似问

标准问：相似问

批测结果

私有化之前

418

4871

1:11

92.34%

私有化之后

418

4871

1:11

91.86%

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)