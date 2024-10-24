---
author: "字节跳动技术团队"
title: "深度解析字节跳动云数据仓库：ByteHouse  第八期字节跳动技术沙龙来啦！"
date: 2022-09-22
description: "深度解析字节跳动云数据仓库：ByteHouse  第八期字节跳动技术沙龙来啦！在 2016 年正式开源后，ClickHouse 这个大数据计算引擎里的后起之秀开始在一众“前辈”面前崭露头角。"
tags: ["大数据中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:0,views:8929,"
---
在 2016 年正式开源后，ClickHouse 这个大数据计算引擎里的后起之秀开始在一众“前辈”面前崭露头角。近两年来，ClickHouse 的关注度、采用度得到了显著提升，这归功于其强大的性能优势和细粒度的分析能力。

字节跳动是国内最大规模的 ClickHouse 使用者之一：节点总数超过 18000个；最大内部集群 2400 余台；管理数据量超 700 PB。然而正如《人月神话》所言，软件开发没有银弹，开源版的 ClickHouse 也无法解决字节跳动复杂的业务场景所带来的个性化挑战。为了解决实际业务场景对 ClickHouse 的需求，字节跳动基于开源的 ClickHouse 做了大量二次开发和深度投入，并在2021年8月沉淀为火山引擎正式对外发布的商业化产品——ByteHouse，提供海量数据上更强的查询服务和数据写入性能，应用包括海量数据多维分析、机器学习模型评估、微服务监控和统计等。

在一众大数据计算引擎中，字节跳动为什么选择了 ClickHouse 作为核心分析技术？ByteHouse 在 ClickHouse 社区版基础上做了哪些增强、重构？除了强悍的性能优势以外，ByteHouse 还有哪些值得称道的技术设计上的巧思？企业用户能从 ByteHouse 里获取哪些解决实际痛点的产品能力？

10 月 15 日下午 2 点，第八期字节跳动技术沙龙 **《深度解析字节跳动云数据仓库：ByteHouse》主题**，将以线上直播的形式，全面解密字节跳动 ByteHouse 的过去、现在与未来，技术、产品与规划。

![图片](/images/jueJin/be64bab670e4482.png)

本期沙龙免费报名火热进行中，**识别长图二维码**，或点击文末**阅读原文**即可完成报名，除了沉浸式的技术分享体验，会务组还准备了海量福利等你来拿，快快行动吧~

【演讲主题】
======

ByteHouse，新一代云原生数据仓库
--------------------

### \- 内容简介

为什么字节选择了 ClickHouse 作为核心的分析技术？ByteHouse 在 ClickHouse 社区版基础上做了哪些增强、重构？ByteHouse 如何持续演进？本次分享将为您逐一解答。

### \- 精彩看点

1.了解 AP 领域的演进趋势

2.了解为何使用 ByteHouse 可以帮助提升决策分析效率

3.了解 ByteHouse 主要被应用于哪些领域和场景

### \- 讲师信息

**李群 火山引擎云原生数据仓库 ByteHouse 产品负责人**

火山引擎云原生数据仓库 ByteHouse 产品负责人，在 OLAP 领域有 15 年以上的经验积累，曾服务过 IBM、Teradata、华为等行业头部厂商。

ByteHouse 如何解决迁移传统数仓负载中的复杂查询问题
------------------------------

### \- 内容简介

ClickHouse 已经成为行业主流且热门的开源引擎。随着业务数据量扩大，场景覆盖变得广泛。在传统数仓中，有很多复杂查询的场景，ClickHouse 执行复杂查询容易存在查询异常问题，影响业务正常推进。本次主要分享字节跳动如何在 ByteHouse 中解决复杂查询问题，并详细解读技术实现细节。

###  - 精彩看点

1.如何提升 OLAP 中的复杂查询的支持能力

2.如何解决 Coordinator 的计算压力大，容易成为瓶颈的问题

3.如何实现大表 Join 以及如何优化

###  - 讲师信息

**董一峰 字节跳动数据平台团队 分析型数据库资深研发工程师**

2016 年加入字节跳动 OLAP 团队，一直从事大数据查询引擎的开发和推广工作，先后负责 Hive、Spark、Druid、ClickHouse 等大数据引擎，目前主要聚焦于 ClickHouse 执行层相关的研发。

ByteHouse 实时导入的技术演进与应用
----------------------

###  - 内容简介

随着业务升级，用户对查询分析的实时性要求越来越高，对实时导入也提出了更高的技术需求和更复杂的使用场景，包括导入数据的准确性和稳定性保证、越来越大的数据体量、更低的导入延时等。为此字节分析型数据团队基于社区 ClickHouse 做了技术演进和优化，满足公司内部大部分业务的实时导入需求。

本次分享以字节跳动 OLAP 团队在实时导入方向的技术优化和应用为主题，主要包括以下内容：

1.自研 Kafka 导入数据表引擎

2.云原生新架构下的实时导入技术实现

3.实时导入在字节内部的应用

###  - 精彩看点

1.如何实现云原生架构上的实时导入

2.云原生架构上的实时导入会对使用带来哪些变化

3.实时导入能力为字节跳动实际业务带来了哪些提升

### \- 讲师信息

**任强 字节跳动数据平台团队 分析型数据库资深研发工程师**\*\*\*\*

2020 年 7 月加入字节跳动分析型数据库团队，一直从事实时导入相关研发工作，目前负责实时导入模块。

ByteHouse 查询优化器的设计与实现
---------------------

### \- 内容简介

Clickhouse 本身在存储引擎、向量化计算这些领域有着它独特的优势，但是缺乏复杂查询的优化和执行能力。作为一个真正能大规模使用的成熟的 AP 数据库来说一个完善且强大的优化器是必不可少的，所以我们从零到一自研了优化器。本次分享主要介绍我们是如何构建一个完整的优化器，主要包括：

1.  Bytehouse 优化器架构

2.  重要 RBO 规则

3.  CBO 的实现原理

4.  高阶优化器功能

###  - 精彩看点

1.ByteHouse 的查询优化器技术上是如何实现的

2.ByteHouse 查询优化器应用哪些规则

3.查询优化器为业务带来哪些收益

### \- 讲师信息

**景鹏 字节跳动数据平台团队 分析型数据库资深研发工程师**

一直从业于大数据和数据库相关领域，在查询优化领域拥有丰富的经验；加入字节后负责 ByteHouse 优化器模块。

【活动详情】
======

![图片](/images/jueJin/91c056efd6b940d.png)

【沙龙介绍】
======

字节跳动技术沙龙，是由字节跳动技术社区 ByteTech 发起的，面向全行业开发者的技术交流活动。通过搭建一个包容、开放、自由的交流平台，促进前沿技术的普及与落地，帮助技术团队和开发者快速成长。字节跳动技术沙龙的技术分享来源于字节跳动一线技术专家，针对热点技术方向和实践总结，为技术团队和开发者呈现一场场可供参考的技术盛宴。