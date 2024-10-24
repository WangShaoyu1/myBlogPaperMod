---
author: "字节跳动技术团队"
title: "字节跳动开源其云原生数据仓库 ByConity"
date: 2023-05-23
description: "ByConity 已于2023年5月正式开源回馈社区，期待感兴趣的技术团队加入共建。ByConity 是字节跳动开源的云原生数据仓库，它采用计算-存储分离的架构，支持多个关键功能特性，如计算存储分离、"
tags: ["开源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:9,comments:2,collects:17,views:23257,"
---
项目简介
----

ByConity 是字节跳动开源的云原生数据仓库，它采用计算-存储分离的架构，支持多个关键功能特性，如计算存储分离、弹性扩缩容、租户资源隔离和数据读写的强一致性等。通过利用主流的 OLAP 引擎优化，如列存储、向量化执行、MPP 执行、查询优化等，ByConity 可以提供优异的读写性能。

项目背景
----

ByConity 的背景可以追溯到 2018 年，当时字节跳动开始在内部使用 ClickHouse，因为业务的发展，要服务于大量的用户，数据规模变得越来越巨大。由于 ClickHouse 是 Shared-Nothing 的架构，每个节点是独立的，不会共享存储资源等，因而计算资源和存储资源是紧耦合的，这使得 ClickHouse 在使用过程中会遇到以下情况：

*   首先，这导致扩缩容成本变高，且会涉及到数据迁移，使我们不能实时按需的扩缩容，从而导致资源的浪费；
*   其次，ClickHouse 紧耦合的架构会导致多租户在共享集群环境相互影响，同时由于读写在同一个节点完成，导致读写相互影响；
*   最后，ClickHouse 在复杂查询上例如多表 Join 等操作的性能支持并不是很好。

基于这些痛点，字节在 ClickHouse 架构基础上进行了升级，于 2020 年在内部启动了 ByConity 项目，并于 2023 年 1 月发布 Beta 版本，5月底正式对外开源。

![图片](/images/jueJin/381a3b9ac6454c5.png)

图1 字节 ClickHouse 使用情况

功能特性
----

ByConity 计算与存储分离的架构，将原本计算和存储分别在每个节点本地管理的架构，转换为在分布式存储上统一管理整个集群内所有数据的架构，使得每个计算节点成为一个无状态的单纯计算节点，并利用分布式存储的扩展能力和计算节点的无状态特性实现动态的扩缩容。\*\*这种改进使得 ByConity 具有以下重要特性：

*   **资源隔离**：对不同的租户进行资源的隔离，租户之间不会受到相互影响；
*   **读写分离**：计算资源和存储资源解耦，确保读操作和写操作不会相互影响；
*   **弹性扩缩容**：支持弹性的扩缩容，能够实时、按需的对计算资源进行扩缩容，保证资源的高效利用；
*   **数据强一致**：数据读写的强一致性，确保数据始终是最新的，读写之间没有不一致；
*   **高性能**：采用了主流的 OLAP 引擎优化，例如列存、向量化执行、MPP 执行、查询优化等提供优异的读写性能。

技术架构
----

### 整体架构

ByConity 的架构分为三层，包括**服务接入层，计算层**和**数据存储层。**  服务接入层负责客户端数据和服务的接入，也就是 ByConity Server；ByConity 的计算资源层，由一个或者多个计算组构成，每个 Virtual Warehouse（VW）是一个计算组；数据存储层由分布式文件系统，如 HDFS、S3 等构成。

![图片](/images/jueJin/fa3f1811ba13433.png)

图2 ByConity 三层技术架构图

### 工作原理

图4 是 ByConity 组件交互图，图中虚线部分表示一个 SQL 的流入，实线部分的双向箭头表示组件内的交互，单向箭头表示数据的处理并输出给客户端。我们将通过一个 SQL 的完整生命周期来具体分析它在 ByConity 各个组件的交互过程。

![图片](/images/jueJin/a92ed38666f942d.png)

图3 ByConity 内部组件交互图

*   第一阶段：客户端提交 Query 请求给 Server 端，Server 端首先进行 Parsering，然后通过 Analyzer 和 Optimizer分析和优化生成更加高效的可执行计划。这里需要读取元数据 MetaData，元数据存储在一个分布式 KV 里，ByConity 使用 FoundationDB，并通过 Catalog 读取元数据。
*   第二阶段：ByConity 把通过分析和优化器后产生的可执行计划交由调度器（Plan Scheduler），调度器通过访问Resource Manager 获取空闲的计算资源，并决定把查询任务调度到哪些节点去执行。
*   第三阶段：Query请求最终在 ByConity 的 Worker 上执行，Worker 会从最底层的 Cloud Storage 读取数据，并通过建立 Pipeline 的方式进行计算。最终多个 Worker 的计算结果通过 Server 汇聚，并返回给客户端。

ByConity 还有两个主要的组件，分别是 Time-stamp Oracle 和 Deamon Manager。前者支持事务处理，后者则对后来的一些任务进行管理和调度。

### 主要组件库

#### 元数据管理

ByConity 提供了一个高可用和高性能的元数据读写服务--Catalog Server，并且支持了完备的事务语义特性（ACID）。同时我们对 Catalog Server 做了比较好的抽象，使得后端的存储系统是可插拔的，当前我们支持的是苹果开源的 FoundationDB，后面可以通过扩展去支持更多的后端存储系统。

#### 查询优化器

查询优化器是数据库系统的核心之一。一个优秀的优化器可以大大提高查询性能。尤其是在复杂的查询场景下，优化器可以带来数倍至数百倍的性能提升。ByConity 自研优化器基于两个方向提升优化能力：

*   RBO：基于规则的优化能力。支持：列裁剪、分区裁剪、表达式简化、子查询解除关联、谓词下推、冗余运算符消除、Outer-Join to Inner-Join、运算符下推存储、分布式运算符拆分等常见的启发式优化能力。
*   CBO：基于成本的优化能力。支持：Join Reorder、Outer-Join Reorder、Join/Agg Reorder、CTE、Materialized View、Dynamic Filter Push-Down、Magic Set 等基于成本的优化能力，并为分布式计划集成 Property Enforcement。

#### 查询调度

ByConity 目前支持两种查询调度策略：Cache-aware 调度和 Resource-aware 调度。其中：

**Cache-aware 调度**针对计算和存储分离的场景，旨在最大化 Cache 的使用避免冷读。Cache-aware 调度策略会尽可能地将任务调度到拥有对应数据缓存的节点上，实现计算命中 Cache，提升读写性能。同时，由于系统进行动态的扩缩容，当计算组的拓扑发生变化时，需要最小化 Cache 失效对查询性能的影响。

**Resource-aware 调度**通过感知整个集群中计算组不同节点的资源使用情况，并有针对性地进行调度，以最大化资源利用，同时还会进行流量控制，确保合理使用资源，避免过载造成的负面影响，如系统宕机等。

#### 计算组

ByConity支持不同的租户使用不同的计算资源，如图5 所示。在 ByConity 新的架构下，很容易实现了多租户隔离和读写分离等特性。不同租户可以使用不同的计算组，实现多租户隔离，同时支持读写分离。由于扩缩容方便，计算组可以按需进行动态的扩缩容，保证资源利用率高效。当资源利用率不高时，可以进行资源共享，借调计算组给其他租户使用，实现资源的最大化利用并降低成本。

![图片](/images/jueJin/2db7e9d4714f421.png)

图4 计算组和多租户

#### 虚拟文件系统

虚拟文件系统模块作为数据读写的中间层，ByConity 做了比较好的封装，将存储作为一种服务暴露给其他模块使用，实现“存储服务化”。虚拟文件系统提供了一个统一的文件系统抽象，屏蔽了不同的后端实现，方便扩展并支持多种存储系统，如 HDFS 或对象存储等。

#### 缓存加速

ByConity 通过缓存进行查询加速，在计算-存储分离的架构下，ByConity 在元数据和数据维度都进行缓存加速。在元数据维度，通过在 ByConity 的 Server 端的内存中进行缓存，以 Table 和 Partition 作为粒度。在数据维度，通过在ByConity 的 Worker 端，也就是计算组进行缓存，而且在 Worker 端的缓存是层次化的，同时利用了 Memory 和磁盘，以 Mark 集合作为缓存粒度，从而有效地提高查询速度。

### 如何获取和部署

ByConity 目前支持四种获取和部署模式，欢迎社区开发者使用，并给我们提 Issue：

*   单机Docker：[github.com/ByConity/by…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2Fbyconity-docker "https://github.com/ByConity/byconity-docker")
*   K8s集群部署：[github.com/ByConity/by…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2Fbyconity-deploy "https://github.com/ByConity/byconity-deploy")
*   物理机部署：[github.com/ByConity/By…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2FByConity%2Ftree%2Fmaster%2Fpackages "https://github.com/ByConity/ByConity/tree/master/packages")
*   源代码编译：[github.com/ByConity/By…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2FByConity%23build-byconity "https://github.com/ByConity/ByConity#build-byconity")

开源规划
----

> **Roadmap**
> 
> [github.com/ByConity/By…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2FByConity%2Fissues%2F26 "https://github.com/ByConity/ByConity/issues/26")

ByConity 在 2023 年的开源社区路线图中包括多个关键里程碑。这些里程碑旨在增强 ByConity 的功能、性能和易用性。其中，**开发新的存储引擎**、**支持更多的数据类型**和**与其他数据管理工具的集成**是我们重点关注领域。具体包含以下几个方向：

*   **性能提升**：使用索引进行加速，包含 Skip-index 优化、新的 Zorder-index 和倒排索引等支持、外表索引的构建和加速、以及索引的自动推荐和转换；查询优化器的持续优化；分布式缓存机制等。
*   **稳定性提升**：支持更多维度的资源隔离，提供更好多租户能力；丰富 Metrics，提升可观察性和问题诊断能力。
*   **企业级特性增强**：实现更细粒度权限控制；完善数据安全性相关的功能（备份、恢复和数据加密）；持续探索数据的深度压缩，节约存储成本。
*   **生态兼容性提升**：支持 S3、TOS 等对象存储；提升生态兼容性方便集成；支持数据湖联邦查询如 Hudi、Iceberg等。

社区合作共建
------

在 ByConity 发布 Beta 版本后，得到了来自华为、电子云、展心展力、天翼云、唯品会、传音控股等十几家企业开发者的支持，他们帮助 ByConity 分别在各自的环境下跑通了 TPC-DS 验证，有些在自身业务场景下进行测试并反馈出不错的效果，同时也给我们提出了诸多改进建议，我们对此表示非常感谢。同时也很荣幸收到社区伙伴一起共建的意愿和想法，例如，我们与华为终端云的交流中达成了共建合作，未来会在 Kerberos 鉴权、ORC 的支持、以及支持 S3 存储上一起共建。如果您有意向参与，请扫描以下二维码加入我们。

GitHub 地址：[github.com/ByConity/By…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2FByConity "https://github.com/ByConity/ByConity")

![图片](/images/jueJin/c402fce3d6b44dd.png)

ByConity 社区微信交流群

![图片](/images/jueJin/f78b8ee4f8ca471.png)

ByConity 社区飞书交流群

总之，ByConity 是一个开源的云原生数据仓库，提供读写分离、弹性扩缩容、租户资源隔离和数据读写的强一致性。其计算-存储分离的架构，结合主流的 OLAP 引擎优化，确保了优异的读写性能。随着 ByConity 的不断发展和改进，希望成为未来云原生数据仓库的重要工具。

了解更多：[github.com/ByConity/By…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FByConity%2FByConity "https://github.com/ByConity/ByConity")


-------------------------------------------------------------------------------------------------------------------------------------------------------