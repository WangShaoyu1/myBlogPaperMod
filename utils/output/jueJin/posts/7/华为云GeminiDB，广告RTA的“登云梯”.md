---
author: "华为云开发者联盟"
title: "华为云GeminiDB，广告RTA的“登云梯”"
date: 2024-04-09
description: "本文分享自华为云社区《华为云GeminiDB，广告RTA的“登云梯”》，详细介绍GeminiDB在广告RTA中的优势特性。"
tags: ["数据库","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:1,views:220,"
---
本文分享自华为云社区《[华为云GeminiDB，广告RTA的“登云梯”](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425256%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425256?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： GeminiDB-Redis博客。

行话说，广告RTA要想效果好，数据库挑战少不了。那么，广告RTA对数据库究竟有哪些挑战？在上篇文章《[究竟什么样的数据库，才能承接RTA广告这个技术活](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FU8-XOXYLvtPj7X9ULumm4w "https://mp.weixin.qq.com/s/U8-XOXYLvtPj7X9ULumm4w")》中，介绍了广告RTA对数据库的挑战，本文我们将详细介绍GeminiDB在广告RTA中的优势特性。

广告RTA业务面临高并发、超低时延、超大数据量等实际特性需求，因此，对核心画像数据库有如下诉求：

*   海量数据快速导入，确保决策精准性：

需要定期将成百GB甚至数TB全量画像数据导入画像数据库；全量数据导入越快，模型越精准，广告投放效果越好。

*   承载高并发访问：

RTA系统要承接大量的实时竞价请求。以电商、金融客户的RTA系统为例，经验上，日常数据库QPS在几十万到数百万之间。

*   保持稳定的低时延：

媒体侧要求广告主在40-100ms内返回决策结果；数据库需要在个位数毫秒内执行完请求。

*   降低业务成本：

为了追求极致的性能体验，RTA业务通常使用开源自建Redis，然而TB级别数据存储成本非常昂贵，成本也是广告主选型的重要考虑因素。

在广告RTA中，通常选用以下数据库作为画像数据库：

*   MySQL：难以满足数十万至百万QPS并发和低时延的要求。
*   MongoDB/Hbase：可以存储TB级数据，成本便宜，但无法满足稳定低时延诉求，超时率高，容易导致停投，影响商业利益。
*   内存数据库：能提供高并发、低时延极致性能，如开源自建Redis，是业界选用比较多的方案。但存在着稳定性差，数据丢失等风险。对于TB级用户画像数据，存在导入速度慢和成本高的痛点。

而华为云数据库GeminiDB Redis接口完全具备“稳定低时延、高性价比、FastLoad离线数据极速导入”等核心能力。

核心能力一：FastLoad极速数据导入，效率提升5-10倍
==============================

传统数据库只能通过标准协议逐条写入数据，先经过计算层复杂结算，再写入存储层。因此，大数据平台定期导入的数百GB乃至数TB的画像数据，通常需要数小时或者数天，且对在线业务影响比较大。

GeminiDB提供的FastLoad企业级特性，依托RTA业务场景大数据平台的高并发处理能力和自身存储引擎的数据编排能力，将海量数据通过专属高速持久化通道直接传入存储引擎，数据导入速度提升5-10倍，并降低对在线业务的影响。

![](/images/jueJin/afa927114663449.png)

GeminiDB FastLoad企业级特性与RTA场景

核心能力二：提供百万级并发和亚毫秒级延迟，无惧业务洪峰
===========================

华为云GeminiDB采用存算分离架构，通过分布式高性能存储池实现三副本、强一致的数据存储，所有节点高效读、写访问，支持算力水平和垂直扩展，能够轻松应对业务规模和数据量的爆炸式增长。同时，通过采用多线程架构和高性能存储池，配合内存数据结构和访问算法的深度优化，GeminiDB能够实现亚毫秒级的数据请求响应。

这种超低时延的性能，对需要实时数据处理和分析的应用场景，如在线游戏、金融科技、广告系统和实时推荐系统，提供了强大的数据支持，GeminiDB成为处理大规模实时交互和高频交易等场景的理想选择。

根据现网的案例经验，在百万+QPS流量下，GeminiDB可稳定保持平均时延1ms，p99时延2ms。

![](/images/jueJin/5f8f422f641342c.png)

GeminiDB架构图

核心能力三：高效数据压缩存储，效率与成本并行
======================

GeminiDB使用“逻辑数据+块数据”双重压缩机制，在不牺牲性能的前提下，大幅度降低数据的存储占用。同时，采用存算分离架构，将算力和数据存储解耦，支持独立弹性扩展。这意味着企业可以以更低的成本存储更多的数据，极大地优化资源利用效率，降低整体的使用成本。

![](/images/jueJin/e58435cd1d904c4.png)

根据现网案例经验，GeminiDB的数据压缩比通常为4:1，即实际12TB数据，在GeminiDB中仅占用3TB左右的存储空间。

总结
==

华为云GeminiDB数据库凭借自身在RTA场景上海量离线数据极速导入、高性能稳定低时延、节约存储成本等卓越性能，已经成为金融、广告、推荐等业务数字化转型和技术创新道路上的强大伙伴。我们期待与全球的企业和开发者合作，共同探索数据的未来，推动技术和业务的发展。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")