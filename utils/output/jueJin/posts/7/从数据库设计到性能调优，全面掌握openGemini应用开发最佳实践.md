---
author: "华为云开发者联盟"
title: "从数据库设计到性能调优，全面掌握openGemini应用开发最佳实践"
date: 2024-06-04
description: "本文分享自华为云社区《DTSE Tech Talk × openGemini ：从数据库设计到性能调优，全面掌握openGemini应用开发最佳实践》，数据库设计和性能调优最重要的干货都在这里了！"
tags: ["数据库","开源","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:1,views:330,"
---
本文分享自华为云社区《[DTSE Tech Talk × openGemini ：从数据库设计到性能调优，全面掌握openGemini应用开发最佳实践](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428477%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428477?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者：华为云开源。

在本期\*\*[《从数据库设计到性能调优，全面掌握openGemini应用开发最佳实践》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Flive%2FDTT_live%2F202405291630.html "https://bbs.huaweicloud.com/live/DTT_live/202405291630.html")\*\*的主题直播中，华为云开源DTSE技术布道师&openGemini社区发起人Shawn，通过解析数据库应用开发的一般流程与开发者们分享了熟悉业务场景是做好数据库设计的关键这一重要观点，并分别向大家介绍了openGemini库和表设计、数据写入、数据查询的最佳实践，希望能让开发者们从优秀实践中获得新的启发和提升。

熟悉业务场景是做好数据库设计的关键
=================

任何数据库都不是万能的，熟悉业务场景是做好数据库设计非常关键的一环，同时，当了解清楚业务场景再去做数据库选型时会给你带来很大的帮助。做数据库选型之前，大家可以按照以下8条去做细致的评估：

*   数据分类
*   应用分类
*   采集频率(s)
*   时间线评估
*   每分钟写入数据量
*   采集的指标
*   业务查询场景
*   数据保留周期

**![](/images/jueJin/dfac20fe61ed4d6.png)**

openGemini库和表设计最佳实践
===================

当把业务场景都了解清楚过后，便可以做库和表的设计了。Shard是openGemini的数据分片概念，openGemini支持shard延时加载，也就有了有活动shard和历史shard的区别。每个shard有自己的索引和缓存，增加DB，或者增加RP，都会增加同等数量的shard，也就增大了数据处理的并发度。个人建议在使用openGemini时采用多个库，适度增加DB数量，有利于系统资源得到充分利用，并提升性能。

当机器规格一定时，支持的shard数量是有上限的  
粗略的评估方法：shard数量 <= 总量内存 \* 0.25 / 60M  
Shard数量受本地磁盘性能限制，因为不同shard之间存在磁盘带宽和I/O的竞争。

![](/images/jueJin/de8655f28f6241a.png)

**shard或表过多，容易对系统性能造成影响：**

*   DB/RP越多，shard越多，占用内存资源会越大，磁盘I/O竞争越大
*   表越多，数据文件越多，占用操作系统句柄资源越多
*   Shard和表越多，元数据越多，ts-sql和ts-store与ts-meta之间同步元数据时延大，会造成数据读写性能波动

**表的设计原则：**

*   建表要结合查询场景做综合考虑
*   建表要充分考虑指标列数量，大于1000列，建议开始分表

openGemini数据写入最佳实践
==================

现在跟大家分享一下客户端写数据最佳实践的注意事项：

1.  客户端批量写入，减少网络交互
2.  客户端并发写入，确保多批次数据之间时间线不存在交叉，减少乱序数据的产生
3.  BatchSize指一次批量写入的数据大小，需多次实验，找到最为合适的值
4.  ts-sql并发分发数据能力是一定的，增加sql数量才能处理更多数据
5.  写入并发比较大的情况下，可以适当减小BatchSize，否则ts-store容易造成数据堆积

\*\*![](/images/jueJin/2148edfe7383401.png)\*\*\*\*写性能的内核参数调优：\*\*正常情况下，业务的写QPS是趋于稳定的，当出现比较大的波动时，引起原因可能是：数据量增大导致wal时延增加、磁盘IO瓶颈、数据缓存堆积、Compaction阻塞等。

openGemini数据查询最佳实践

**时间线比较多时（百万以上），如下查询场景要慎用，可能引发进程OOM：**

1.  全量时间线扫描，无TAG过滤
2.  海量分组：TAG+Time | 细粒度Time
3.  海量数据在ts-sql聚合场景（除first/last/count/sum/mean/min/max外）
4.  海量时间线查询, tag1=xxx 可能对应百万时间线

![](/images/jueJin/3a970fc93da5405.png)

openGemini 查询语句使用Tips：
======================

1、查询返回的数据量比较多时，推荐添加查询参数：chunked=true&chunk\_size=1000 ，可分批流式返回

**例如：**

curl -XPOST '[http://localhost:8086/query?db=mydb&](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8086%2Fquery%3Fdb%3Dmydb%26 "http://localhost:8086/query?db=mydb&") chunked=true & chunk\_size=1000 ' --data-urlencode 'q=SELECT \* FROM mst'

2、在openGemini集群中，一条时间线数据只属于一个数据节点，因此在做简单查询时，可以使用Hint查询，直接定位到具体数据节点查询数据。

**语法：** /\*+ full\_series \*/

\*\*约束：\*\*查询条件必须包含所有的TAG

**例如:**

SELECT /\*+ full\_series \*/ mean(C) FROM mst WHERE A=“a1” AND B=“b1” AND time > xxx AND time < xxx

3、嵌套查询要遵循的原则：处在最里层的子查询尽可能通过TAG或者时间过滤数据，减少结果数据总量

**例如：**

SELECT \* FROM  
(SELECT temperature FROM disk\_temp\_monitor WHERE time > xxx AND time < xxx AND nd=“xxx” AND disk\_type = SATA\_HDD )  
WHERE disk\_type = SATA\_HDD GROUP BY \* LIMIT 1000

本次分享到这里就结束了，openGemini社区旨在打造开放、合作、包容的全球性技术社区，欢迎大家试用openGemini时序数据库，加入开源社区。

**openGemini\*\*\*\*开源地址**：[github.com/openGemini](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FopenGemini "https://github.com/openGemini")

**openGemini\*\*\*\*官网地址**：[opengemini.org](https://link.juejin.cn?target=https%3A%2F%2Fopengemini.org "https://opengemini.org")

![](/images/jueJin/0563e31ea3dc48e.png)

openGemini是一款开源分布式时序数据库，主要聚焦于海量时序数据的存储和分析，通过技术创新，简化业务系统架构，降低存储成本，提升时序数据的存储和分析效率。

![](/images/jueJin/c5701dfc41074d4.png)

**HDC 2024，6月21日-23日，东莞松山湖，期待与您相见！**

更多详情请参见大会官网：

中文：[developer.huawei.com/home/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fhdc "https://developer.huawei.com/home/hdc")

英文：[developer.huawei.com/home/en/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fen%2Fhdc "https://developer.huawei.com/home/en/hdc")

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")