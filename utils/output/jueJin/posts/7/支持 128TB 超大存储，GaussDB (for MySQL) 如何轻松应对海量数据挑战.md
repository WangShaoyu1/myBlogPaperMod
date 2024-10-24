---
author: "华为云开发者联盟"
title: "支持 128TB 超大存储，GaussDB (for MySQL) 如何轻松应对海量数据挑战"
date: 2024-09-19
description: "华为云数据库 GaussDB (for MySQL) 基于华为最新一代 DFV 存储，采用计算存储分离架构，最多支持 128TB 的海量存储。"
tags: ["AIGC中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:0,views:25,"
---
本文分享自华为云社区[《【选择 GaussDB (for MySQL) 的十大理由】之二：128TB 超大存储》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F434840%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/434840?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者：GaussDB 数据库。

大数据时代的挑战
========

随着互联网、大数据等行业的迅猛发展，企业的数据流量呈现爆炸式增长，数据库作为数据存储的核心，其承载的数据量越来越大。近十年，企业数据量从 GB 发展到 TB，甚至 PB 级别，数据库正面临前所未有的存储挑战，这要求数据库具备更高的存储能力和扩展性以满足海量数据的存储需求，为企业数据分析和业务发展提供坚实基础。

GaussDB (for MySQL) 如何支持海量存储
============================

华为在数据库存储领域的布局已经 20 余年，连续多年保持市场份额和发货量第一。在云原生自研数据库领域，华为云相较于其他云厂商，最大的技术优势之一就是多年积累的存储技术。

华为云数据库 GaussDB (for MySQL) 基于华为最新一代 DFV 存储，采用计算存储分离架构，最多支持 128TB 的海量存储。其中，DFV（Data Function Virtualization）是华为提供的一个与数据库垂直整合的高性能，高可靠的分布式存储系统。

GaussDB (for MySQL) 整体架构自下向上分为存储层、存储抽象层和 SQL 解析层三层。

![](/images/jueJin/1599826e1a02105.png)

**存储层**：基于华为 DFV 存储，提供大容量、分布式、强一致和高性能的存储能力，此层来保障数据的可靠性以及横向扩展能力，保证数据的可靠性不低于 99.999999999%。

**存储抽象层**：位于 InnoDB 之下，底层存储节点之上的中间层，提供数据库的日志处理能力，页面和存储之间数据映射管理以及页面读取能力，是数据库高性能的核心。

**SQL 解析层**：GaussDB (for MySQL) 与 MySQL 8.0 开源版 100% 兼容。

基于以上软硬件垂直优化，GaussDB (for MySQL) 在拥有 128TB 存储容量上限的同时，仍能够保持超高性能，轻松满足企业级应用场景中的海量数据存储和分析的需求。另外，GaussDB (for MySQL) 的存储空间支持自动弹性横向扩展，在线扩容过程对业务透明无感，保证业务的连续稳定。

GaussDB (for MySQL) 超大存储与极致性能，驱动多行业数据高效处理
=========================================

超大存储空间使得 GaussDB (for MySQL) 能够面对各行各业的数据量挑战，如互联网、金融、医疗、教育等。某在线教育客户，经过多库合并的降本增效改造后，在单个 GaussDB (for MySQL) 实例中保存了海量历史数据，单实例数据量达 80TB，最大的单表数据量超过 10 亿行。并行执行、算子下推等核心内核优化保证 GaussDB (for MySQL) 在如此大的数据模型下，性能表现依然强悍。

GaussDB (for MySQL) 使用示例
========================

1\. 在创建 GaussDB (for MySQL) 实例时，存储空间可自由选择，上限是 128TB，操作如下：

![](/images/jueJin/9d0fd2aea85de6d.png)

2\. 当正在使用的 GaussDB (for MySQL) 实例的存储空间即将耗尽时，可以进行磁盘扩容，操作步骤：

1）在 “实例管理” 页面，选择目标实例，单击 “操作” 列的 “更多 > 容量变更”，进入 “容量变更” 页面。

![](/images/jueJin/b77ac9272273c12.png)

除此之外，还可以通过单击目标实例名称，进入 “基本信息” 页面。在 “存储 / 备份空间” 模块，单击 “容量变更”，进入 “容量变更” 页面。

![](/images/jueJin/56a671bd6d4f3c5.png)

2）在 “容量变更” 页面，选择空间大小，单击 “下一步” 直至结束。

总结
==

GaussDB (for MySQL) 支持 128TB 海量存储，为企业提供了巨大的数据存储空间，能够轻松应对各行各业的大数据需求，同时提高数据处理性能，降低运维成本，助力企业长期发展。您可购买 “包年 / 包月” 或 “按需” 实例，自动创建，无需部署，快来试用吧！

[点击关注，第一时间了解华为云新鲜技术～](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")