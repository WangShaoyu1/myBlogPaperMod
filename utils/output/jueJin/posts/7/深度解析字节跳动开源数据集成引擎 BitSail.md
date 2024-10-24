---
author: "字节跳动技术团队"
title: "深度解析字节跳动开源数据集成引擎 BitSail"
date: 2022-11-01
description: "字节跳动数据集成引擎开源啦！BitSail 是字节跳动开源数据集成引擎，支持多种异构数据源间的数据同步，并提供离线、实时、全量、增量场景下全域数据集成解决方案。"
tags: ["开源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:15,views:5760,"
---
1\. 导读
======

BitSail 是字节跳动开源数据集成引擎，支持多种异构数据源间的数据同步，并提供离线、实时、全量、增量场景下全域数据集成解决方案，目前支撑了字节内部和火山引擎多个客户的数据集成需求。经过字节跳动各大业务线海量数据的考验，在性能、稳定性上得到较好验证。

10 月 26 日，字节跳动宣布 BitSail 项目正式在 GitHub 开源，为更多的企业和开发者带来便利，降低数据建设的成本，让数据高效地创造价值。本篇内容将围绕 BitSail 演讲历程及重点能力解析展开，主要包括以下四个部分：

*   字节跳动内部数据集成背景

*   BitSail 技术演进历程

*   BitSail 能力解析

*   未来展望

2\. 字节跳动内部数据集成背景
================

![图片](/images/jueJin/7a5fe8891d514f9.png)

一直以来，字节跳动都非常重视并贯彻“数据驱动”这一理念，作为数据驱动的一环，数据中台能力的建设至关重要，而这其中，数据集成作为数据中台建设的基础，主要解决了异构数据源的数据传输、加工和处理的问题。

BitSail 源自字节跳动数据平台团队自研的数据集成引擎 DTS（全称 Data Transmission Service，即数据传输服务），最初基于 Apache Flink 实现，至今已经服务于字节内部业务接近五年，现已具备批式集成、流式集成和增量集成三类同步模式，并支持分布式水平扩展和流批一体架构，在各种数据量和各种场景下，一个框架即可解决数据集成需求。此外，BitSail 采用插件式架构，支持运行时解耦，从而具备极强的灵活性，企业可以很方便地接入新的数据源。

3\. BitSail 演进历程
================

3.1  全域数据集成引擎演进三阶段
------------------

![图片](/images/jueJin/467aaac60133482.png)

字节跳动数据集成引擎 BitSail 演进的历程可以分为三个阶段：

① 初始期：2018 年以前公司没有统一的数据集成框架，对每个通道都是各自实现，因此依赖的大数据引擎也比较零散，如 MapReduce 、Spark ，数据源之间的连接也是网状连接，整体的开发和运维成本都比较高。

② 成长期：可以分为三个小阶段。

*   2018 - 2019 ：随着 Flink 生态不断完善，越来越多的公司将 Flink 作为大数据计算引擎的首选，字节跳动也不例外，并在 Flink 上持续探索，并于 2019 年提出基于 Flink 的异构数据源间传输，完成批式场景的统一。
*   2020 - 2021 ：随着 Flink 批流一体的完善，字节跳动对原有架构进行较大升级，并覆盖了流式场景，完成批流场景的统一。

*   2021 - 2022 ：接入了 Hudi 数据湖引擎，解决 CDC 数据实时同步问题，并提供湖仓一体解决方案。

③ 成熟期：2022 年开始全域数据集成引擎的整体架构已经稳定，并经过字节跳动内部各业务线生产环境的考验，在性能和稳定性上也得到充分的保障，于是团队希望能够将能力对外输出，为更多的企业和开发者带来便利，降低数据建设的成本，让数据高效地创造价值。

3.2  BitSail 数据集成引擎技术架构演进
-------------------------

### 3.2.1 基于 Flink 的异构数据源传输架构

基于 Flink 1.5 DataSet API 实现的异构数据源传输架构，只支持批式场景。**框架核心思想是，对原始输入层数据抽象为 BaseInput**，主要用于拉取源端的数据；**对输出层抽象为 BaseOutput**，负责将数据写到外部系统。同时，框架层提供了基础服务，包括类型系统（Type System）、自动并发度（Auto Parallelism）、流控（Flow Control）、脏数据检测（Dirty Data）等等，并对所有的数据源通道生效。

![图片](/images/jueJin/a44a5d897f5e402.png)

以下介绍一个批次场景上比较有意思的功能，也是实际业务中面临的一些**痛点**。

![图片](/images/jueJin/2e68badf5714408.png)

上图左上部分是原始的 Flink 运行日志，从这个日志里看不到任务进度数据和预测数据，如当前任务运行的百分比、运行完成所需时间。

左下部分则是 Flink UI 界面提供的任务运行的元信息，可以看到读写条数都是 0 ，从 Flink 引擎角度，由于所有算子作为一个整体是没有输入和输出的，这是合理的，但从用户角度就无法看到任务整体进度信息和当前处理记录条数，从而导致用户怀疑这个任务是否已经卡住。图中右边是改造之后的效果，日志中明确输出当前处理了多少条数、实时进度展示、消耗时间等等，该功能在字节内部上线后，得到了很多业务的好评。

![图片](/images/jueJin/8565ecef7aeb4f8.png)

下面介绍一下具体的实现。

首先回顾 Flink Task 的执行过程，与传统的 MapReduce、Spark 的驱动模型不一样，Flink 是以任务驱动，JM 创建好 Split 之后，Task 是常驻运行，不断向 JM 请求新的 Split，只有所有的 Split 处理完之后，Task 才会退出。此时，如果用总的完成的 Task 个数除以总的 Task 个数，进度将出现一定程度的失真。最开始，所有的 Task 都在运行，不断地去拉取 Split，我们看到的进度会是 0，等到 JM 的 Split 处理完之后，所有的 Task 会集中退出，可以看到进度会突然跳动到 100%，中间是缺少进度信息的。

**为了解决这个问题，我们还是要回到数据驱动本身，以 Split 的维度来衡量整个 Job 的运行过程**。图中右边所展示的是，通过 Flink UI 提供的 API，可以拿到整个任务的拓扑信息，将其分为两层算子并进行改造，分别是 Source 层和 Operator 层。

*   **Source 层**

我们修改了原生的 Source API，具体的话包括两个部分，第一个是创建 Split 之后，我们会去拿到 Total Split 的个数，将它上载到 Metric 里；其次是 Source里的每个 Task 每处理完一个 Split 之后，我们会上报一个 CompletedSplit。最终我们通过 Flink UI 是可以拿到当前已经完成的 Split 个数以及总共的 Split 个数，并用完成的 Split 个数来除以总共的 Split 个数来衡量 Source 节点的进度。

*   **Operator 层**

首先我们会看当前 Operator 上游节点的输出多少条，以及当前节点它读取了多少条，并用当前节点读取的条数除以它的上游节点的输出条数作为当前 Operator 的进度。同时，这里我们做了一个梯度限制，就是当前节点的进度只能小于等于它的上游节点进度。

### 3.2.2 基于 Flink 批流一体的架构

以下是**批流一体的架构**，相对于原有架构，字节跳动数据平台团队完成如下**升级**：

![图片](/images/jueJin/4f9ceb146375432.png)

*   将 Flink 版本从 1.5 升级到 1.9，同时我们分析了 DataSet API，统一升级到 DataStream API，以支持批流一体架构。
*   对数据源支持进行扩充，除了原有的离线数据源之外，增加了实时数据源，如消息队列。
*   对框架层完成拓展，支持 Exactly Once、支持 Event Time 写入、Auto DDL 等功能。
*   对引擎层进行改进，增加推测执行、Region Failover 等功能。
*   在 Runtime 层也做了进一步的扩充，支持云原生架构。

我们分析一个实时场景中比较典型的链路，MQ 到 Hive 这个链路。

![图片](/images/jueJin/f1c730974d39489.png)

左图（Shuffle）是目前社区的实现方式，很多数据湖的写入，比如 Hudi、Iceberg 基本上也是这个结构。这套结构分为两层算子，第一层是我们的数据处理层，负责数据的读取和写入；第二层算子是一个单节点的提交层，它是一个单并发，主要负责元信息的提交，比如去生成 Hive 的分区或者做一些其他的元信息动作。

**这个架构的优势**是其整体拓扑（数据处理流程）比较清晰，算子功能定位也比较清楚，但是它有一个明显的**缺陷**，加入一个单并发节点后，导致整个任务变成 Shuffle 连接。而 Shuffle 连接天然的弱势是，当遇到 Task Failover 的时候，它会直接进行全局重启。

右图（Pipelined）是改造之后的数据处理流程，数据写入部分没有变化，变化的是后面的提交部分，这样的设计考虑是是保持原有 Pipeline 架构，以实现 Task 容错时不会进行全局重启。废弃了原有的单并发提交节点，把所有元信息的提交拿到 JM 端处理，同时 Task 和 JM 的通讯是通过 Aggregate Manager 来实现。改为这套架构之后，在大数据量场景下，其稳定性得到了显著的提升。

### 3.2.3 基于 Flink 湖仓一体的架构

引入湖仓一体架构的目的是解决 CDC 数据的近实时同步。

![图片](/images/jueJin/2870c37b2ad440d.png)

右图是原有架构，处理流程包括三个模块：

*   **拉取批次任务**：用来拉取 CDC 全量的数据，写到 Hive 里作为一个基础的镜像。

*   **实时任务**：拉取 CDC 的 Changelog，并实时写入 HDFS，作为一个增量数据。

*   **离线调度任务**：周期性地进行 Merge，将全量数据和增量数据进行合并，形成新的全量数据。

上述架构比较复杂，并依赖 Flink、Spark 等多种计算引擎，在实时性方面，只能做到 T+1，最快也只能做到小时级延迟，无法有效支撑近实时分析场景。从效率来说，存储开销比较大，每个分区都是一个全量镜像，而且计算成本较高，每次 Merge 都需要进行全局 Shuffle。

![图片](/images/jueJin/ddb4ce1abd1c464.png)

右图是升级后的架构，**主要的升级点包括：**

*   将 Flink 1.9 升级到 Flink 1.11，接入了 Hudi 数据湖引擎，以支持 CDC 数据近实时同步。这是因为 Hudi 引擎有完备的索引机制以及高效的 Upsert 性能。
*   对 Hudi 引擎也进行了多项基础改进，以提高整体的写入效率和稳定性。

最终实施的效果，近实时写入，整体的延迟在 10 分钟以内，综合性能比原有架构提升 70% 以上。至此，完成了全域数据集成架构统一，实现一套系统覆盖所有同步场景。

3.3  架构演进过程实践经验分享
-----------------

下面介绍实际演进过程中的一些思考、问题和改进方案。

*   **表类型选择**

![图片](/images/jueJin/405e1867145342e.png)

数据湖是支持多种表格式的，比如 CopyOnWrite（简称COW）表、MergeOnRead（简称MOR）表。COW 表的优势在于读性能比较好，但是会导致写放大，MOR 表正好相反，写的性能比较好的，会导致读放大。具体选择哪种表格式，更多要根据大家的业务场景来决定。

我们的业务场景是为了解决 CDC 数据的近实时同步，CDC 数据有个明显的特点，是存在大量的随机更新。这个场景下选择 COW，会导致写放大的问题比较严重，所以我们选择了 MOR 表。上图就是一个 MOR 表查询和写入的流程。第一个是列存储的基础镜像文件，我们称之为 Base 文件，第二个是行存储的增量日志，我们称之为 Log 文件。

每次查询时，需要将 Log 文件和 Base 文件合并，为了解决 MOR 表读放大的问题，通常我们会建一个 Compaction 的服务，通过周期性的调度，将 Log 文件和 Base 文件合并，生成一个新的 Base 文件。

*   **Hudi 实时写入痛点**

![图片](/images/jueJin/9f23baaad4c44c9.png)

如图所示，这是原生的 Hudi 实时写入的流程图。

**首先，我们接入 Hudi 数据，会进入 Flink State，它的作用是索引。** Hudi 提供了很多索引机制，比如 BloomIndex。但是 BloomIndex 有个缺陷，它会出现假阳性，降级去遍历整个文件，在效率上有一定的影响。Flink State 的优势是支持增量更新，同时它读取的性能会比较高。经过 Flink State 之后，我们就可以确认这条记录是 Upsert，还是 Insert 记录，同时会分配一个 File Id。

**紧接着，我们通过这个 File Id 会做一层 KeyBy，将相同 File 的数据分配到同一个Task。** Task 会为每一个 File Id 在本地做一次缓存，当缓存达到上限后，会将这批数据 Flush 出去到 hoodie client 端。Hoodie client 主要是负责以块的方式来写增量的 Log 数据，以 Mini Batch 的方式将数据刷新到 HDFS。

**再之后，我们会接一个单并发的提交节点，** 最新的版本是基于 Coordinator 来做的，**当所有的算子 Checkpoint 完成之后，会提交元信息做一次 Commit，认为这次写入成功。** 同时 Checkpoint 时，我们会刷新 Task 的缓存和 hoodie client 的缓存，同时写到 HDFS。通常，我们还会接一个 Compaction 的算子，主要用来解决 MOR 表读放大的问题。

**这个架构在实际的生产环境会遇到如下问题：**

（1）当数据量比较大的时候，Flink State 的膨胀会比较厉害，相应地会影响 Task 的速度以及 Checkpoint 的成功率。

（2）关于 Compaction 算子，Flink 的流式任务资源是常驻的，Compaction 本身是一个周期性的调度，如果并发度设置比较高，往往就意味着资源的浪费比较多。

（3）Flink 提供了很多资源优化的策略，比如 Slot Sharing，来提高整体的资源利用率，这就会导致资源抢占的问题，Compaction 会和真正的数据读写算子来进行资源的抢占。Compaction 本身也是一个重 I/O、CPU 密集型操作，需要不断地读取增量日志、全量日志，同时再输出一个全量数据。

针对上述问题，我们**优化了 Hudi 的写入流程。**

![图片](/images/jueJin/9e6a3feed5ba4fe.png)

**首先我们会采集 CDC 的 Change Log，并发送到消息队列，然后消费消息队列中的 Change Log，然后我们进行如下三个优化：**

（1）废弃了原先的 Flink State，替换为 Hash Index。Hash Index 的优势是不依赖外部存储。来了一个 Hoodie Record 之后，只需要一个简单的哈希处理，就知道它对应的 Bucket。

（2）将 Compaction 服务独立成一个离线的任务，并且是周期性的调度，用来解决资源浪费和资源抢占的问题。

（3）将 Task 缓存和 Hudi 缓存做了合并，因为每次 Checkpoint 都需要刷新 Task 缓存，Hudi 缓存需要写入 HDFS，如果缓存的数据量比较多，会导致整个 Checkpoint 时间比较长。

优化之后，稳定性方面，可以支持百万级的 QPS；端到端的 Checkpoint 延时控制在 1 分钟以内，Checkpoint 成功率可以做到 99%。

![图片](/images/jueJin/a31dd1d34f3c45a.png)

4\. BitSail 能力解析
================

目前技术架构比较成熟，并经过字节跳动各业务线的验证，在数据的稳定性和效率上都能得到一定的保障。因此，我们希望能把自己沉淀的经验对外输出，给更多企业和开发者带来便利，降低大家数据建设的成本，让数据创造高效的价值。为了达到这个目标，我们要解决两个能力的构建。

4.1  低成本共建能力
------------

数据集成有一个明显的网络效应，每个用户所面临的数据集成的场景也是不一样的，因此需要大家的共同参与，完善数据集成的功能和生态，这就需要解决共建成本的问题，让大家都能低成本地参与整个项目的共建和迭代。

在 BitSail 中，我们通过两个思路推进这个能力建设。

### 4.1.1 模块拆分

![图片](/images/jueJin/f642fcae1a704c1.png)

所有的模块糅合在一个大的 jar 包中，包括引擎层、数据源层、基础框架层，模块耦合比较严重，数据处理流程也不清晰。针对这个问题，我们按照功能模块进行划分，将基础框架和数据源从引擎中独立出来，同时我们的技术组件采取可插拔的设计，以应对不同的用户环境，比如脏数据检测、Schema 同步、监控等等，在不同的环境中会有不同的实现方式。

### 4.1.2 接口抽象

![图片](/images/jueJin/04099d81885a4cc.png)

框架对 Flink API 是深度绑定，用户需要深入到 Flink 引擎内部，这会导致整体 Connector 接入成本比较高。为了解决这个问题，我们抽象了新的读写接口，该接口与引擎无关，用户只要开发新的接口即可。同时在内部会做一层新的抽象接口与引擎接口的转换，这个转换对用户是屏蔽的，用户不需要了解底层引擎细节。

4.2  架构的兼容能力
------------

不同公司依赖的大数据组件和数据源的版本不一样，同时还会遇到版本前后不兼容问题，因此需要完善架构的兼容能力，以解决不同环境下的快速安装、部署和验证。我们同样有两个思路来建设这个能力。

### 4.2.1 多引擎架构

![图片](/images/jueJin/b21276a8fb8e4b0.png)

当前架构和 Flink 引擎深度绑定，在使用场景方面受到一定的限制，比如有些客户用了 Spark 引擎或者其他引擎。Flink 引擎依赖比较重的情况下，对于简单场景和小数据量场景，整体的资源浪费比较严重。

**为解决此问题，我们在引擎层预留了多引擎入口，在已经预留的 Flink 引擎基础之上，接下来会扩展到 Spark 引擎或者 Local Engine。** \*\*\*\* 具体实现方面，我们对执行的环境进行了一层抽象，不同的引擎会去实现我们的抽象类。同时，我们探索 Local 执行方式，对小数据量在本地通过线程的方式来解决，不用去启动 Flink Job 或类似的处理，提高整体资源的使用效率。

### 4.2.2 依赖隔离

![图片](/images/jueJin/66eacd5331754a9.png)

目前系统存在一些外部环境中没有的内部依赖，大数据底座也是绑定的公司内部版本，我们进行了三个方面的**优化：**

*   剔除公司内部依赖，采取开源的通用解决方案，以应对不同的业务场景。
*   大数据底座方面，采用 Provided 依赖，不绑定固定底座，运行时由外部指定，针对不兼容的场景，通过 Maven Profile 和 Maven Shade 隔离。
*   针对数据源多版本和版本不兼容的问题，采取动态加载的策略，将数据源做成独立的组件，每次只会加载需要的数据源，以达到隔离的目标。

5\. 未来展望
========

BitSail 希望数据畅通无阻地航行到有价值的地方，期待和大家共同合作，完善数据集成的功能和生态。同时未来我们将在三个方面**继续深化：**

① 多引擎架构：探索 Local Engine 落地，支持本地执行，对简单场景和小数据量场景提高资源利用率；实现引擎智能选择策略，针对简单场景使用 Local Engine；针对复杂场景复用大数据引擎的能力。

② 通用能力建设：推广新接口，对用户屏蔽引擎细节，降低 Connector 开发成本

探索 Connector 多语言方案。

③ 流式数据湖：统一 CDC 数据入湖解决方案，在性能上稳定支撑千万级 QPS

在数据湖平台能力构建方面，全面覆盖批式、流式、增量使用场景。

_**✳️本文感谢 DataFun 志愿者钟晓华整理**_

6\. 活动预告
========

**11 月 9 日 19:30，** 字节跳动数据平台举办 BitSail 首期直播活动，邀请数据集成领域专家，深入解读字节跳动数据集成技术实践与应用、开源项目规划和路径，更有工程师手把手教你如何快速上手。

**👇** **立即扫码进群，预约直播，赢取精美礼品！**

![图片](/images/jueJin/e63d3292a09240b.png)