---
author: "王宇"
title: "开源对话中控模块USKit学习笔记"
date: 八月31,2023
description: "黄婷"
tags: ["黄婷"]
ShowReadingTime: "12s"
weight: 238
---
1\. 概述
======

对话机器人通常是多种技能的综合，这涉及到多个技能的管理、召回、排序和选择等策略，在具体的实现中，通常由一个统一调度对话中控 US (Unified Scheduler) 来提供这些能力。常见应用：Siri、小爱、小度、小冰。

2\. 主要功能
========

2.1. 核心概念
---------

*   **对话技能 (bot skill)**：指某个特定场景下的对话能力，一个对话技能对应一个具体的对话场景，例如天气技能负责提供天气场景下的对话能力。
*   **对话机器人 (bot service)**：由多个对话技能整合而成的统一对话服务，可以同时支持多个对话场景的人机对话，一个对话机器人对应一个具体业务的整体解决方案，比如车载对话机器人、育儿对话机器人等。

2.2. 功能介绍
---------

USKit 作为 UNIT 的开源中控模块，通过配置驱动和内置表达式运算支持，提供了以下能力：

*   支持配置表达式运算，内置常用函数，提供丰富的表达能力，通过修改配置即可轻松实现策略的定制
*   支持定义后端服务的请求构造和接入策略 (后端服务泛指各种通过网络访问的远程服务，比如 UNIT 技能、DMKit 服务、Redis session 服务等)，支持的通信协议包括 `HTTP` 和 `Redis`
*   支持定义后端服务结果的抽取 (extract) 和变换 (transform) 策略
*   支持定义多种对话技能的排序 (ranking) 和选择策略
*   支持定义对话中控流程 (chatflow) 策略
*   内置 UNIT 技能协议请求构造和结果解析策略的配置支持，只需配置技能 ID 即可实现对话技能的快速接入

3\. 架构
======

USKit 针对对话中控的能力做了抽象，抽取出不同对话场景中下中控的通用能力，避免不必要的重复开发。同时按照配置化驱动和高扩展性的思想进行整体架构的设计，方便开发者通过配置快速构建和定制适用于特定业务场景的对话中控。USKit的整体架构如下图：

![](/download/attachments/109250265/image2023-8-28_17-43-19.png?version=1&modificationDate=1693215799612&api=v2)

系统主要由以下4个核心部分组成：

*   表达式引擎：负责表达式的解析和执行求值，详细的运算支持可以参见[配置表达式运算支持](https://github.com/baidu/unit-uskit/blob/master/docs/expression.md)，表达式引擎为下面三个引擎提供了基础支持，基于表达式引擎，可以实现根据用户请求动态生成配置
*   后端服务管理引擎：负责后端服务的接入、请求构造和结果解析抽取等策略的管理，通过 `backend.conf` 进行策略的配置
*   排序策略管理引擎：负责技能的排序规则的管理，用于多技能的排序，通过 `rank.conf` 进行策略的配置
*   对话流程管理引擎：负责对话中控流程的策略的管理，用于定义机器人中控的逻辑执行流程：包括调用后端服务引擎召回技能 (recall)、调用排序引擎进行技能排序 (rank)、结果选择和输出等，通过 `flow.conf` 进行策略的配置

开发者在使用 USKit 的时候，只需配置上述3个配置文件，即可完成对话中控的搭建，后续策略的变动和升级也通过修改配置文件即可完成，可以让开发者关注对话机器人中控本身的策略逻辑，不需要重复开发框架代码。

4\. 参考文档
========

*   [USKit开源项目](https://github.com/baidu/unit-uskit)
*   [USKit配置表达式运算支持](https://github.com/baidu/unit-uskit/blob/master/docs/expression.md)
*   [USKit详细配置说明](https://github.com/baidu/unit-uskit/blob/master/docs/config.md)
*   [USKit 使用示例 (demo)](https://github.com/baidu/unit-uskit/blob/master/docs/demo.md)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)