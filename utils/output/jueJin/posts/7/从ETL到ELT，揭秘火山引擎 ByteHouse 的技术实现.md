---
author: "字节跳动技术团队"
title: "从ETL到ELT，揭秘火山引擎 ByteHouse 的技术实现"
date: 2023-10-25
description: "火山引擎ByteHouse是一款基于开源ClickHouse推出的云原生数据仓库，为用户提供极速分析体验，能够支撑实时数据分析和海量数据离线分析，同时还具备便捷的弹性扩缩容能力，极致分析性能和"
tags: ["数据结构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:13,views:12127,"
---
> 作者：樊齐

前言
==

当涉及到企业分析场景时，所使用的数据通常源自多样的业务数据，这些数据系统大多采用以行为主的存储结构，比如支付交易记录、用户购买行为、传感器报警等。在数仓及分析领域，海量数据则主要采按列的方式储存。因此，将数据从行级转换成列级存储是建立企业数仓的基础能力。

传统方式是采用Extract-Transform-Load (ETL)来将业务数据转换为适合数仓的数据模型，然而，这依赖于独立于数仓外的ETL系统，因而维护成本较高。但随着云计算时代的到来，云数据仓库具备更强扩展性和计算能力，也要求改变传统的ELT流程。

火山引擎ByteHouse是一款基于开源ClickHouse推出的云原生数据仓库，为用户提供极速分析体验，能够支撑实时数据分析和海量数据离线分析，同时还具备便捷的弹性扩缩容能力，极致分析性能和丰富的企业级特性。凭借其强大的计算能力，可以全面支持Extract-Load-Transform (ELT)的能力，从而使用户免于维护多套异构系统。

具体而言，用户可以将数据导入后，通过自定义的SQL语句，在ByteHouse内部进行数据转换，而无需依赖独立的ETL系统及资源。这样，用户只需要采用统一的SQL方式来完成数据转换操作。

在本文中，我们将重点介绍ByteHouse遇到的挑战，以及如何通过3大能力建设实现完备的ELT能力。

痛点以及挑战
======

我们先从一个简单的SSB(start-schema-benchmark)场景出发， 其中包含：

*   1个事实表: lineorder
*   4个维度表：customer, part, supplier, dwdate

![ssb.png](/images/jueJin/a3a5fd0cc7c545a.png)

在SSB的查询分析中，我们发现大部分的查询都涉及到事实表和维表的join，因此可以通过Transform的步骤，将事实表“打平”。 打平所用到的SQL如下:

```csharp
insert into ssb_flat
select * from
lineorder l
join customer c on l.lo_custkey = c.c_custkey
join part p on l.lo_partkey = p.p_partkey
join supplier s on l.lo_suppkey = s.s_suppkey
where l.lo_orderdate = <bizdate>
```

之后的查询分析可以通过对`ssb_flat` 的单表扫描来规避很多`join`操作，其性能能有显著提升。 这个“打平”的过程，就是“Transform”的一种。 实际生产场景中的“Transform”的case会更多也更复杂。 但是通过以上这个“打平”的过程，我们可以分析出这类操作在数据库上的普遍性痛点。

变换操作跟普通查询相比，有几个大的区别:

1.  变换操作执行时间久， 整体重试成本高
2.  变换操作没有返回值，我们只关心他成功或者失败
3.  变化操作读写量大，占用资源

具体来说：

*   首先对于ByteHouse来讲，其擅长的临时查询时间都在秒级，查询中间出故障一般都直接返回错误，交由上游重试。而在ETL场景下，一个任务如果执行了50分钟，由于某些原因故障了，重试相当于前50分钟的资源都被浪费了，显然不能被接受。
*   其次，由于ETL没有返回结果，客户端需要保持一个idle的长链接，很有可能由于配置原因超时，同时大量的并发任务也会吃掉正常的链接资源。
*   最后，由于ETL任务读写量大，多个任务并发的时候，需要考虑到资源的分配，以达到性能和隔离的平衡。

针对这三个痛点，ByteHouse 针对性的设计了三个功能，即长任务管理、异步提交和查询队列。

功能一：长任务管理
=========

通常情况下，我们可以用settings max\_execution\_time 来控制一个查询的超时时间，ByteHouse提供了事务支持来保障读写操作的原子性。

但是并这不足以覆盖ETL任务的需求。 在长时间的任务执行中，更容易遇到系统性故障，如节点OOM等。在这种情况下，由客户端重试并不是个优雅的方案。

在ByteHouse中，一个SQL查询会被转化为一系列的算子。 我们希望提升算子的容错能力以更好的应对长时间查询下的系统故障。目前的版本中，ByteHouse已经针对聚合，排序，关联等算子提供了disk spill功能。 具体来说，当某个算子无法获得足够的内存时，我们允许这个算子将一部分数据缓存在磁盘上，以此在资源紧张的情况下仍能够完成工作。

例如在排序算子中，我们引入了external merge sort的能力，并通过`max_bytes_before_external_sort`来控制外部排序能力。在下图左边是未开启spill的排序查询计划，右边是开启spill的计划。

![组 1.png](/images/jueJin/a5f5a457ae4e499.png)

可以看到在开启external sort之后，ByteHouse引入了BufferingToFileTransform，MergingSortedTransform两个算子。同样的，ByteHouse里的聚合，关联算子都做了类似的优化例如grace hash join等。

接下来ByteHouse也打算针对exchange操作，进一步提升shuffle操作的容错性。

功能二：异步提交能力
==========

面对大量长耗时的ETL任务时，传统的同步执行的方式需要客户端等待服务端返回。 这样很容易出现客户端超时，进而影响后续任务执行的问题。

同时，在这种场景中，用户并不关心单个任务或请求的相应时间，只期望任务能在特定时间内完成，并对可靠性等要求较高。 因此ByteHouse提供了异步提交的任务的能力。

ByteHouse用户现在可以通过 setting `enable_async_execution` 来提交一个异步任务。ByteHouse在收到这类任务之后，会返回一个异步任务ID， 例如 `ff46fccf-d872-4c68-bdb2-c8c18fc178f5`。 之后客户端可以选择间歇性轮训来获得任务的最终状态。

ByteHouse 提供了 `show async status 'ff46fccf-d872-4c68-bdb2-c8c18fc178f5'` 的指令来获得状态。 同时ByteHouse也提供了 `kill query 'ff46fccf-d872-4c68-bdb2-c8c18fc178f5'`的指令来取消某些异步的查询。

功能三：查询队列
========

离线加工面对大量请求时，当系统超载，需要一定的排队机制使query请求挂起，等待集群释放资源后再进行调度。ByteHouse为此提供了查询队列能力。

ByteHouse可以允许用户从三个维度度来定义一个队列，即: 队列大小，总CPU占用率，和总内存占用率。

在ByteHouse中，Resource Manager 组件可以用来监听各个队列中的查询指标，得到队列的资源使用率。 当用户向一个队列提交查询时，如果队列还未达到上限，ByteHouse会将这个查询入队，否则拒绝掉这个查询。

此后，ByteHouse会时刻检查队列的资源利用率，当空闲资源高过某个阀值时，Bytehouse会将等待中的查询出队。当某个处于等待期的查询被取消时，ByteHouse也会将其移出队列。利用查询队列，用户在编排ETL任务时不用担心底层资源过载，因此可以更加自由。

之后ByteHouse也在计划增加优先级队列功能。届时，用户可以为ETL任务和即时查询创建不同队列优先级，这样ELT任务和即时查询可以跑在同一个计算组中而不会显著的相互影响。

总结
==

以上介绍了ByteHouse 在支持ETL能力中的一些技术细节。其中长任务，异步提交已经队列功能已经在preview版本中上线。接下来，ByteHouse也会继续扩展ETL能力，包括支持更多的ETL相关的转换函数、长任务容错、优先级队列等。

除了ELT能力之外，火山引擎ByteHouse基于独家自研的高可用引擎及查询优化器，可以为企业提供快速、稳定、安全的查询服务和数据写入性能。在云原生架构下，火山引擎ByteHouse提供了极致扩展的统一数据分析平台，具有出色的弹性伸缩和可扩展性，确保资源可以灵活地水平扩展；同时，ByteHouse支持多级资源隔离，为用户资源提供更安心的安全保障。火山引擎ByteHouse还从业务角度出发提供了完整的运维监控和排障能力，帮助企业实现业务云上托管，降低运维成本。欢迎登陆火山引擎ByteHouse官网体验。

火山引擎ByteHouse官网链接：[www.volcengine.com/product/byt…](https://link.juejin.cn?target=https%3A%2F%2Fwww.volcengine.com%2Fproduct%2Fbytehouse%3Futm_source%3Dwechat_dp%26utm_medium%3Darticle%26utm_term%3Dwx_readmore%26utm_campaign%3D20230904%26utm_content%3Dbytehouse "https://www.volcengine.com/product/bytehouse?utm_source=wechat_dp&utm_medium=article&utm_term=wx_readmore&utm_campaign=20230904&utm_content=bytehouse")