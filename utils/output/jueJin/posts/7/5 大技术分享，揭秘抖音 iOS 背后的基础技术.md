---
author: "字节跳动技术团队"
title: "5 大技术分享，揭秘抖音 iOS 背后的基础技术"
date: 2022-10-21
description: "11 月 12 日下午 2 点，字节跳动技术沙龙「抖音 iOS 基础技术大揭秘 Vol02」将以免费线上直播的形式与大家见面，沙龙报名通道现已同步开启。"
tags: ["程序员中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:12,comments:2,collects:8,views:7822,"
---
从 2016 年 9 月的 1.0 版本上线至今，抖音在 6 年间实现了从零开始的快速增长。这短短 6 年伴随的是移动开发技术与云计算、机器学习等技术融合带来的技术落地新形式，也遇到了直播、连麦等新的用户需求所带来的产品功能新需求，更在海量的用户体量下遇到了工程稳定性、质量保障、用户体验等方面的严峻挑战。

2022 年 1 月 22 日，字节跳动技术团队带来了首期「抖音 iOS 基础技术大揭秘」技术沙龙分享，参与观看直播的 iOS 研发人员超过 4 万人，引发了对 iOS 技术的热烈讨论。睽违半年之久，抖音 iOS 基础技术团队在经过实践驱动的打磨、沉淀以后，带来了精心筹备的第二期沙龙分享。本期沙龙将围绕静态分析、视频播放品质优化、首页 Feed 重构、自动化服务及端智能技术探索等 5 大技术方向，深入解析抖音 iOS 的技术能力。

11 月 12 日下午 2 点，字节跳动技术沙龙「抖音 iOS 基础技术大揭秘 Vol.02」沙龙将以免费线上直播的形式与大家见面，沙龙报名通道现已同步开启，**扫描长图海报二维码即可报名**！除了一下午的沉浸式技术分享，我们还为参会者准备了精美的礼品福利抽奖！

一、演讲主题
======

1\. 抖音 iOS 从静态分析到准入体系：进击的“钟馗”
-----------------------------

### 内容简介

静态分析是保障软件工程质量的重要途径之一，如何将静态分析在项目中进行落地并尽可能发挥其最大价值一直是困扰研发团队的一个重大难题。这次分享中我们将和大家介绍抖音是如何从静态分析逐步演进到移动研发准入体系的，并会分享其中自研的静态分析引擎以及代码数据服务等相关实践经验，看看它是如何体系化地帮助抖音、西瓜等大型 App 提高研发质量。

### 精彩看点

*   了解静态分析的基本原理与应用，以及如何实现一个自定义的静态分析工具。

*   了解代码数据服务的构建原理与应用。

*   了解抖音移动研发准入体系的构成与其搭建思路。

### 讲师信息

**李云鹏 抖音基础技术 iOS 客户端工程师**

2017 年毕业于西安交通大学，同年加入百度，曾主导参与了百度移动研发工具链 EasyBox 的建设。2020 年加入字节跳动，目前主要负责抖音 iOS 客户端静态分析方向的工作。长期关注编译、静态分析以及研发流程等相关技术方向。

2\. 抖音 iOS 视频播放品质优化实践
---------------------

### 内容简介

此次分享围绕抖音播放场景，从基本链路、关键指标、核心策略几个维度展开，讲述抖音播放品质建设工作的实践经验，分享如何在各环节保障播放质量和提升播放体验，同时会介绍在新方向的探索进展和规划。

### 精彩看点

*   了解抖音播放的基本链路，如何保障大盘播放质量。

*   感知抖音播放的核心策略，如何提升用户播放体验。

*   介绍未来播放的优化方向，如何放大业务播放收益。

### 讲师信息

**王敏 抖音基础技术 iOS 客户端工程师**

2018 年加入字节跳动，先后在国际化体验团队负责账号、网络、磁盘、图片、低端机卡顿等优化工作，在端体验各方向积累了大量经验。目前主要负责抖音播放品质建设，持续推进播放链路、播放质量、播放架构建设。

3\. 抖音 iOS 首页 Feed 重构探索与实践
--------------------------

### 内容简介

首页 Feed 是抖音最重要的功能，也是最主要的流量入口，众多业务线持续迭代，2020 年初，仅 Feed 仓库代码量就超过 30 万行，数个文件过万行，代码复杂度陡增，事故频出，严重影响了研发流程和用户体验，经过2年来一系列重构和治理，已经能比较好地支撑起上百人的协作开发，本次分享在此过程中的经验、思考和方法论。

### 精彩看点

*   系统地了解复杂功能重构全流程的问题发现、分析、解构、思考、设计、方法论，从而提高编写可维护代码的意识和能力。

*   由点及面，了解大型产品架构演进过程和设计方法。

### 讲师信息

**张宇 抖音基础技术 iOS 客户端工程师**

负责抖音 iOS 基础架构工作，经历了抖音 iOS 从单仓库、组件化、壳工程到标准化架构的全部历程，并主导核心的架构标准、架构设计、组件化、业务架构、准入准出建设等工作，负责 iOS 端跨业务线技术评审，主导了 Feed 平台化等关键重构工作。

4\. 抖音 iOS 自动化服务：工具链演进与优化实践
---------------------------

### 内容简介

自动化测试与持续集成对于保障软件工程质量具有重要的价值，能够长期的保障核心代码正常运作，提升项目上线的质量，是大型项目增量式开发的保障手段之一。抖音作为大型项目，在自动化基建方向也进行了大量的实践和建设，沉淀出一套通用的测试服务能力，本次演讲将介绍抖音 iOS 自动化的工具链演进的方式，展示工具链架构设计和拓展机制，以及其中涉及到的一些技术挑战和解决方案，从而引发我们对自动化服务设计和优化实践的思考。

### 精彩看点

*   软件研发工程师可以了解抖音自动化测试的工具链设计和拓展机制，以及在抖音进行自动化测试落地的场景。

*   软件研发工程师可以了解苹果 M1 芯片上 crash 机制，以及大规模测试场景下优化 crash 捕获成功率的具体手段。

*   软件研发工程师可以了解符号化原子服务的设计，以及对\_\_TEXT 段迁移问题适配的具体手段。

### 讲师信息

**陈文欢 抖音基础技术 iOS 客户端工程师**

毕业于华中科技大学，先后在腾讯、Bigo 从事性能监控&优化、APM 平台建设等相关工作，后加入字节跳动，负责抖音质量与效率保障体系的自动化相关能力建设。长期关注客户端领域系统底层实现，架构演进，以及标准化工作，同时也是一名技术爱好者。

5\. 机器学习技术在抖音 iOS 的探索与实践
------------------------

### 内容简介

端智能（On-Device Machine Learning）是指在终端设备上部署和运行机器学习模型，使之成为智能载体，直接或间接参与智能任务的运行。目前，端智能应用已在 Google、阿里、腾讯、快手等公司落地，并取得不错的业务效果。本次分享首先介绍 AppInfra 中台为支撑字节系产品的业务发展自研的全套端智能工程链路基建，然后重点介绍如何通过基建助力抖音将机器学习技术在业务场景上快速探索与应用落地，最后介绍抖音端智能的未来规划与展望。

### 精彩看点

*   软件研发工程师对终端智能概念建立初步的认识。
*   软件研发工程师了解如何快速搭建终端可实践的机器学习链路。
*   软件研发工程师了解如何筛选合适智能场景及推进在产品上探索与落地。

### 讲师信息

**柳祚鹏 基础架构端智能中台研发工程师**

毕业于上海交通大学，先后在百度、字节跳动任职，从事移动端研发工作。于 2015 年加入百度，期间参与糯米组件架构演进工作。在 2016 年加入字节跳动，曾负责多个项目的架构设计与重点业务研发工作，主导公司中台侧账号和端智能基础能力的建设，目前在基础架构端智能团队负责将机器学习技术落地应用业务商业场景。长期关注移动端工程架构、编译器与链接器及机器学习应用等技术方向。

二、活动详情
======

![图片](/images/jueJin/bc271c9823454a6.png)

三、沙龙介绍
======

字节跳动技术沙龙，是由字节跳动技术社区 ByteTech 发起的，面向全行业开发者的技术交流活动。通过搭建一个包容、开放、自由的交流平台，促进前沿技术的普及与落地，帮助技术团队和开发者快速成长。字节跳动技术沙龙的技术分享来源于字节跳动一线技术专家，针对热点技术方向和实践总结，为技术团队和开发者呈现一场场可供参考的技术盛宴。

[点击报名链接参与活动吧~](https://www.bagevent.com/event/8325585?bag_track=ztgzh "https://www.bagevent.com/event/8325585?bag_track=ztgzh")