---
author: "王宇"
title: "5月AI学习小结lmx"
date: 六月29,2023
description: "李明仙"
tags: ["李明仙"]
ShowReadingTime: "12s"
weight: 481
---
1 知识图谱-食品食谱
===========

**本体是什么？**

本体是语义数据模型，用于定义domain中事物的类型以及可用于描述它们的属性。本体是广义的数据模型，这意味着它们仅对具有某些属性的事物的一般类型进行建模，而并不包含有关我们domain中具体个体的信息。本体有三个主要组成部分，类、关系、属性。又可称为三元组关系主语、谓语、宾语。

类： 存在于数据中的不同类型的。类型是对具有相同特点或属性的实体集合的抽象。

关系：连接两个类的属性。关系也可以是实体与实体之间关系的抽象。

属性：描述单个类的属性。属性是对实体与实体之间关系的抽象

实体（Entity）：实体是对客观个体的抽象，一个人、一部电影、一句话都可以看作是一个实体。实体的定义通常根据领域词典、词表来进行规范，之后根据目标需求进行自定义。

域（domain）：域是类型的集合，凌驾于类型之上，是对某一领域所有类型的抽象。

值（value）：值是用来描述实体的，可以分为文本型和数值型。

**怎么定义不同实体之间的关系？**

实体和实体之间的关系类型分为分类关系和非分类关系。分类关系分为上下位关系、继承关系，非分类关系分为同义关系（并列关系）、整体部分关系、相关关系、因果关系、其它关系。

构建食品食谱的三元组要怎么定义呢？

实体：特指具体的一个商品

实体-万得厨商城具体一个食品链接、食谱下面具体一个食谱链接

属性：可以从品类类目视角、用户认知视角、商品属性视角展开。品类类目视角包括类目关联、典型品牌、典型属性、品类层级、品类搭配。用户认知视角包括热度/销量、特色标签、别名/俗称、推荐理由。商品属性视角包括品牌、口味、含糖/脂肪、香型、半/未加工、包装/规格、产地、适用人群、适用时间、适用场景。

万得厨类目属性：1）主食类、菜肴类、汤类。饭、粉、面、粥、汤、中式包点、西点；

怎么用算法实现实体、属性、关系的抽提？

  

 [知识图谱中的实体及关系定义＜二＞\_实体关系分类\_铭珏的博客-CSDN博客](https://blog.csdn.net/qq_34816884/article/details/107882930)

[FoodKG- A Semantics-Driven Knowledge Graph for Food Recommendation\_四时风间的博客-CSDN博客](https://blog.csdn.net/VAOVA/article/details/104886323?ops_request_misc=&request_id=&biz_id=102&utm_term=%E8%8F%9C%E8%B0%B1%20%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-9-104886323.142^v88^insert_down38v5,239^v2^insert_chatgpt&spm=1018.2226.3001.4187)

 [基于知识图谱的菜谱问答系统——需求分析\_问答系统的需求分析\_Isaac Einstein的博客-CSDN博客](https://blog.csdn.net/Born_without_fun/article/details/122122152?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_utm_term~default-4-122122152-blog-104886323.235^v36^pc_relevant_default_base3&spm=1001.2101.3001.4242.3&utm_relevant_index=5)

[https://blog.51cto.com/u\_15730109/5511437](https://blog.51cto.com/u_15730109/5511437)美团大脑系列之商品知识图谱

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)