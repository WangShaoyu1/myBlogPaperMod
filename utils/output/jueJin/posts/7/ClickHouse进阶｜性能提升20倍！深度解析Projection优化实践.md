---
author: "字节跳动技术团队"
title: "ClickHouse进阶｜性能提升20倍！深度解析Projection优化实践"
date: 2023-07-28
description: "在12亿条的实际生产数据集中进行测试，查询并发能力提升10～20倍！预聚合是OLAP系统中常用的一种优化手段，在通过在加载数据时就进行部分聚合计算"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:16,comments:4,collects:32,views:16197,"
---
预聚合是OLAP系统中常用的一种优化手段，在通过在加载数据时就进行部分聚合计算，生成聚合后的中间表或视图，从而在查询时直接使用这些预先计算好的聚合结果，提高查询性能，实现这种预聚合方法大多都使用物化视图来实现。

ClickHouse社区实现的Projection功能类似于物化视图，原始的概念来源于Vertica，在原始表数据加载时，根据聚合SQL定义的表达式，计算写入数据的聚合数据与原始数据同步写入存储。在数据查询的过程中，如果查询 SQL 通过匹配分析可以通过聚合数据计算得到，直接查询聚合数据减少计算开销，大幅提升查询性能。

ClickHouse Projection是针对物化视图现有问题，在查询匹配，数据一致性上扩展了使用场景：

*   支持normal projection，按照不同列进行数据重排，对于不同条件快速过滤数据
*   支持aggregate projection, 使用聚合查询在源表上直接定义出预聚合模型
*   查询分析能根据查询代价，自动选择最优Projection进行查询优化，无需改写查询
*   projeciton数据存储于原始part目录下，在任一时刻针对任一数据变换操作均提供一致性保证
*   维护简单，不需另外定义新表，在原始表添加projection属性

ByteHouse 是火山引擎基于ClickHouse研发的一款分析型数据库产品，是同时支持实时和离线导入的自助数据分析平台，能够对 PB 级海量数据进行高效分析。具备真实时分析、存储-计算分离、多级资源隔离、云上全托管服务四大特点，为了更好的兼容社区的projection功能，扩展projection使用场景，ByteHouse对Projection进行了匹配场景和架构上进行了优化。在ByteHouse商用客户性能测试projection的性能测试，在1.2亿条的实际生产数据集中进行测试，查询并发能力提升10～20倍，下面从projeciton在优化器查询改写和基于ByteHouse框架改进两个方面谈一谈目前的优化工作。

Projection使用
============

为了提高ByteHouse对社区有很好的兼容性，ByteHouse保留了原有语法的支持，projection操作分为创建，删除，物化，删除数据几个操作。为了便于理解后面的优化使用行为分析系统例子作为分析的对象。

语法
--

```sql
-- 新增projection定义
ALTER  TABLE [db]. table  ADD PROJECTION name ( SELECT  < COLUMN LIST EXPR > [ GROUP  BY ] [ ORDER  BY ] )
-- 删除projection定义并且删除projection数据
ALTER  TABLE [db]. table  DROP PROJECTION name
-- 物化原表的某个partition数据
ALTER  TABLE [db.] table MATERIALIZE PROJECTION name IN  PARTITION partition_name
-- 删除projection数据但不删除projection定义
ALTER  TABLE [db.] table CLEAR PROJECTION name IN  PARTITION partition_name
```

实例
--

```sql
CREATE DATABASE IF NOT EXISTS tea_data;

创建原始数据表
CREATE TABLE tea_data.events(
app_id UInt32,
user_id UInt64,
event_type UInt64,
cost UInt64,
action_duration UInt64,
display_time UInt64,
event_date Date
) ENGINE = CnchMergeTree PARTITION BY toDate(event_date)
ORDER BY
(app_id, user_id, event_type);

创建projection前写入 2023-05-28 分区测试数据
INSERT INTO tea_data.events
SELECT
number / 100,
number % 10,
number % 3357,
number % 166,
number % 5,
number % 40,
'2023-05-28 05:11:55'
FROM system.numbers LIMIT 100000;

创建聚合projection
ALTER TABLE tea_data.events ADD PROJECTION agg_sum_proj_1
(
SELECT
app_id,
user_id,
event_date,
sum(action_duration)
GROUP BY app_id,
user_id, event_date
);

创建projection后写入 2023-05-29 分区测试数据
INSERT INTO tea_data.events
SELECT
number / 100,
number % 10,
number % 3357,
number % 166,
number % 5,
number % 40,
'2023-05-29 05:11:55'
FROM system.numbers LIMIT 100000;

Note：CnchMergeTree是ByteHouse特有的引擎
```

Query Optimizer扩展Projection改写
=============================

ByteHouse优化器
------------

ByteHouse 优化器为业界目前唯一的ClickHouse 优化器方案。ByteHouse 优化器的能力简单总结如下：

![image.png](/images/jueJin/cc46fb1799d5471.png)

*   RBO：支持：列裁剪、分区裁剪、表达式简化、子查询解关联、谓词下推、冗余算子消除、Outer-JOIN 转 INNER-JOIN、算子下推存储、分布式算子拆分等常见的启发式优化能力。
*   CBO：基于 Cascade 搜索框架，实现了高效的 Join 枚举算法，以及基于 Histogram 的代价估算，对 10 表全连接级别规模的 Join Reorder 问题，能够全量枚举并寻求最优解，同时针对大于10表规模的 Join Reorder 支持启发式枚举并寻求最优解。CBO 支持基于规则扩展搜索空间，除了常见的 Join Reorder 问题以外，还支持 Outer-Join/Join Reorder，Magic Set Placement 等相关优化能力。
*   分布式计划优化：面向分布式MPP数据库，生成分布式查询计划，并且和 CBO 结合在一起。相对业界主流实现：分为两个阶段，首先寻求最优的单机版计划，然后将其分布式化。我们的方案则是将这两个阶段融合在一起，在整个 CBO 寻求最优解的过程中，会结合分布式计划的诉求，从代价的角度选择最优的分布式计划。对于 Join/Aggregate 的还支持 Partition 属性展开。
*   高阶优化能力：实现了 Dynamic Filter pushdown、单表物化视图改写、基于代价的 CTE （公共表达式共享）。

借助ByteHouse优化器强大的能力，针对projection原有实现的几点局限性做了优化，下面我们先来看一下社区在projection改写的具体实现。

社区Projection改写实现
----------------

在非优化器执行模式下，对原始表的聚合查询可通过 aggregate projection 加速，即读取 projection 中的预聚合数据而不是原始数据。计算支持了 normal partition 和 projection partition 的混合查询，如果一个 partition 的 projection 还没物化，可以使用原始数据进行计算。

具体改写执行逻辑：

1.  计划阶段
    
    1.  将原查询计划和已有projection 进行匹配筛选能满足查询要求的projection candidates；
    2.  基于最小的 mark 读取数选择最优的 projection candidate；
    3.  对原查询计划中的 ActionDAG 进行改写和折叠，之后用于 projection part 数据的后续计算；
    4.  将当前数据处理阶段提升到 WithMergeableState；
2.  执行阶段
    
    1.  MergeTreeDataSelectExecutor 会将 aggregate 之前的计算进行拆分：对于 normal part，使用原查询计划进行计算；对于 projection part，使用改写后 ActionDAG 构造QueryPipeline；
    2.  将两份数据合并，用于 aggregate 之后的计算。

![image.png](/images/jueJin/8d0b51a69d86405.png)

ByteHouse优化器改写实现
----------------

优化器会将查询切分为不同的plan segment分发到worker节点并行执行，segment之间通过exchange交换数据，在plan segment内部根据query plan 构建pipeline执行，以下面简单聚合查询为例，说明优化器如何匹配projection。

```vbnet
Q1:
SELECT
app_id,
user_id,
sum(action_duration)
FROM tea_data.events
WHERE event_date = '2023-05-29'
GROUP BY
app_id,
user_id
```

在执行计划阶段优化器尽量的将 TableScan 上层的 Partial Aggregation Step，Projection 和 Filter 下推到 TableScan 中，在将plan segment发送到worker节点后，在根据查询代价选择合适projection进行匹配改写，从下面的执行计划上看，命中projection会在table scan中直接读取AggregateFunction(sum, UInt64)的state数据，相比于没有命中projection的执行计划减少了AggregaingNode的聚合运算。

Q1查询计划(optimizer\_projection\_support=0)

Q1查询计划(optimizer\_projection\_support=1)

![](/images/jueJin/0ef41ea2f05049f.png)![](/images/jueJin/3382c7a51e2f425.png)

![](/images/jueJin/3173e16ff2fb4c5.png)![](/images/jueJin/c76099d34c934e8.png)

### 混合读取Projection

Projection在创建之后不支持更新schema，只能创建新的projection，但是在一些对于projection schema 变更需求频繁业务场景下，需要同一个查询既能够读取旧projection也能读取新projection，所以在匹配时需要从partition维度进行匹配而不是从projection定义的维度进行匹配，混合读取不同projection的数据，这样会使查询更加灵活，更好的适应业务场景，下面举个具体的实例：

```sql
创建新的projection
ALTER TABLE tea_data.events ADD PROJECTION agg_sum_proj_2
(
SELECT
app_id,
sum(action_duration),
sum(cost)
GROUP BY app_id
);

写入 2023-05-30 的数据
INSERT INTO tea_data.events
SELECT
number / 10,
number % 100,
number % 23,
number % 3434,
number % 23,
number % 55,
'2023-05-30 04:12:43'
FROM system.numbers LIMIT 100000;

执行查询
Q2:
SELECT
app_id,
sum(action_duration)
FROM tea_data.events
WHERE event_date >= '2023-05-28'
GROUP BY app_id
```

Q2执行计划

按照partition来匹配projection

![](/images/jueJin/447e22ffaa3b425.png)

![image.png](/images/jueJin/c28846595d804a6.png)查询过滤条件WHERE event\_date >= '2023-05-28' 会读取是三个分区的数据， 并且agg\_sum\_proj\_1， agg\_sum\_proj\_2都满足Q2的查询条件，所以table scan会读取2023-05-28的原始数据，2023-05-29会读取agg\_sum\_proj\_1的数据，2023-05-30由于agg\_sum\_proj\_2相对于 agg\_sum\_proj\_1的数据聚合度更高，读取代价较小，选择读取agg\_sum\_proj\_2的数据，混合读取不同projection的数据。

### 原始表Schema更新

当对原始表添加新字段（维度或指标 )，对应projection 不包含这些字段，这时候为了利用projection一般情况下需要删除projection重新做物化，比较浪费资源，如果优化器匹配算法能正确处理不存在缺省字段，并使用缺省值参与计算就可以解决这个问题。

```sql

ALTER TABLE tea_data.events ADD COLUMN device_id String after event_type;
ALTER TABLE tea_data.events ADD COLUMN stay_time UInt64 after device_id;

执行查询
Q3:
SELECT
app_id,
device_id,
sum(action_duration),
max(stay_time)
FROM tea_data.events
WHERE event_date >= '2023-05-28'
GROUP BY app_id,device_id
```

Q3执行计划

默认值参与计算

![](/images/jueJin/574777f07bcf449.png)

从查询计划可以看出，即使agg\_sum\_proj\_1和agg\_sum\_proj\_2 并不包含新增的维度字段device\_id，指标字段stay\_time, 仍然可以命中原始的partiton的projection，并且使用默认值来参与计算，这样可以利用旧的projection进行查询加速。

ByteHouse Projection实现
======================

Projection是按照ByteHouse的存算分离架构进行设计的，Projecton数据由分布式存储统一进行管理，而针对projection的查询和计算则在无状态的计算节点上进行。相比于社区版，ByteHouse Projection实现了以下优势：

*   对于Projection数据的存储节点和计算节点可以独立扩展，即可以根据不同业务对于Projection的使用需求，增加存储或者计算节点。
*   当进行Projection查询时，可以根据不同Projection的数据查询量来分配计算节点的资源，从而实现资源的隔离和优化，提高查询效率。
*   Projection的元数据存储十分轻量，在业务数据急剧变化的时候，计算节点可以做到业务无感知扩缩容，无需额外的Projection数据迁移。

![image.png](/images/jueJin/95d2d952c7c7416.png)

Projection数据存储
--------------

在ByteHouse中，多个projections数据与data数据存储在一个共享存储文件中。文件的外部数据对projections内部的内容没有感知，相当于一个黑盒。当需要读取某个projection时，通过checksums里面存储的projection指针，定位到特定projection位置，完成projection数据解析与加载。

![image.png](/images/jueJin/1d0c9cbc331b48b.png)

Write操作
-------

Projection写入分为两部分，先在本地做数据写入，产生part文件存储在worker节点本地，然后通过dumpAndCommitCnchParts将数据dump到远程共享存储。

*   **写入本地**
    
    *     通过writeTempPart()将block写入本地，当写完原始part后，循环通过方法addProjectionPart()将每一个projection写入part文件夹，并添加到new\_part中进行管理。
*   **dump到远程存储**
    
    *     dumpCnchParts()的时候，按照上述的存储格式，写入完原始part中的bin和mark数据后，循环将每一个projection文件夹中的数据写入到共享存储文件中，并记录位置和大小到checksums，如下：
    *   写入header
    *   写入data
    *   写入projections
    *   写入Primary index
    *   写入Checksums
    *   写入Metainfo
    *   写入Unique Key Index
    *   写入data footger

Merge操作
-------

随着时间的推移，针对同一个partition会存在越来越多的parts，而parts越多查询过滤时的代价就会越大。因此，ByteHouse在后台进程中会merge同一个partition的parts组成更大的part，从而减少part的数量提高查询的效率。

*   对于每一个要merge的part
    
    *   对于part中的每一列，缓存对应的segments到本地
    *   创建MergeTreeReaderStreamWithSegmentCache，通过远程文件buffer或者本地segments的buffer初始化
*   通过MergingSortedTransform或AggregatingSortedTransform等将sources融合成PipelineExecutingBlockInputStream
    
*   创建MergedBlockOutputStream
    

对于projection，进行如下操作

*   建立每一个projection的读取流，本地缓存buffer或者远程文件buffer
*   原始表merge过程，对parts中的projections进行merge
*   通过dumper将新的完整part存储到远端

![image.png](/images/jueJin/8a208487d80e486.png)

Mutate操作
--------

ByteHouse采用MVCC的方式，针对mutate涉及的列，新增一个delta part版本存储此次mutate涉及到的列。相应地，我们在mutate的时候，构造projection的mutate操作的inputstream，将mutate后的projection和原始表数据一起写到同一个delta part中。

*   在MutationsInterpreter里面，通过InterpreterSelectQuery(mutation\_ast)获取BlockInputStream
*   projection通过block和InterpreterSelectQuery(projection.ast)重新构建

![image.png](/images/jueJin/c5633e0e7efa496.png)

Materialize物化操作
---------------

如下图所示，根据ByteHouse的part管理方式，针对mutate操作或新增物化操作，我们为part生成新的delta part，在下图part中，它所管理的三个projections由base part中的proj2，delta part#1中的proj1'，以及delta part#2中的proj3共同构成。当parts加载完成后，delta part#2会存储base part中的proj2的指针和delta part#1中的proj1'指针，以及自身的proj3指针，对上层提供统一的访问服务。

![image.png](/images/jueJin/270665f1666047a.png)

Worker端磁盘缓存
-----------

目前，CNCH中针对不同数据设计了不同的缓存类型

*   DiskCacheSegment：管理bin和mark数据
*   ChecksumsDiskCacheSegment：管理checksums数据
*   PrimaryIndexDiskCacheSegment：管理主键索引数据
*   BitMapIndexDiskCacheSegment：管理bitmap索引数据

针对Projection中的数据，分别通过上述的DiskCache，ChecksumsDiskCache和PrimaryIndexDiskCache对bin，mark，checksums以及索引进行缓存。

另外，为了加快Projection数据的加载过程，我们新增了MetaInfoDiskCacheSegment用于缓存Projection相关的元数据信息。

实际案例分析
======

某真实用户场景的数据集，我们利用它对Projection性能进行了测试。

该数据集约1.2亿条，包含projection约240G大小，测试机器 80CPU(s) / 376G Mem，配置如下：

*   SET allow\_experimental\_projection\_optimization = 1
*   use\_uncompressed\_cache = true
*   max\_threads = 1
*   log\_level = error
*   开启Projection查询并发度80，关闭Projection查询并发度为30

测试结果
----

开启Projection后，针对1.2亿条的数据集，查询性能提升10～20倍。

**QPS** **(开启Projection)**

**QPS** **(关闭Projection)**

**Q1**

**87.365**

**5.697**

**Q2**

**124.780**

**4.511**

### 表结构

```swift

CREATE TABLE user.trades(
`type` UInt8，
`status` UInt64，
`block_hash` String，
`sequence_number` UInt64，
`block_timestamp` DateTime，
`transaction_hash` String，
`transaction_index` UInt32，
`from_address` String，
`to_address` String，
`value` String，
`input` String，
`nonce` UInt64，
`contract_address` String，
`gas` UInt64，
`gas_price` UInt64，
`gas_used` UInt64，
`effective_gas_price` UInt64，
`cumulative_gas_used` UInt64，
`max_fee_per_gas` UInt64，
`max_priority_fee_per_gas` UInt64，
`r` String，
`s` String，
`v` UInt64，
`logs_count` UInt32，
PROJECTION tx_from_address_hit
(
SELECT *
ORDER BY from_address
)，
PROJECTION tx_to_address_hit (
SELECT *
ORDER BY to_address
)，
PROJECTION tx_sequence_number_hit (
SELECT *
ORDER BY sequence_number
)，
PROJECTION tx_transaction_hash_hit (
SELECT *
ORDER BY transaction_hash
)
)
ENGINE=CnchMergeTree()
PRIMARY KEY (transaction_hash， from_address， to_address)
ORDER BY (transaction_hash， from_address， to_address)
PARTITION BY toDate(toStartOfMonth(`block_timestamp`));
```

### 开启Projection

**Q1**

```sql
WITH tx AS ( SELECT * FROM user.trades WHERE from_address = '0x9686cd65a0e998699faf938879fb' ORDER BY sequence_number DESC，transaction_index DESC UNION ALL SELECT * FROM user.trades WHERE to_address = '0x9686cd65a0e998699faf938879fb' ORDER BY sequence_number DESC， transaction_index DESC ) SELECT * FROM tx LIMIT 100;
```

![](/images/jueJin/edb2eff59083418.png)

**Q2**

```sql
with tx as (select sequence_number， transaction_index， transaction_hash， input from user.trades where from_address = '0xdb03b11f5666d0e51934b43bd' order by sequence_number desc，transaction_index desc UNION ALL select sequence_number， transaction_index， transaction_hash， input from user.trades where to_address = '0xdb03b11f5666d0e51934b43bd' order by sequence_number desc， transaction_index desc) select sequence_number， transaction_hash， substring(input，1，8) as func_sign from tx order by sequence_number desc， transaction_index desc limit 100 settings max_threads = 1， allow_experimental_projection_optimization = 1， use_uncompressed_cache = true;
```

![](/images/jueJin/b8bf0761633c47f.png)

### 关闭Projection

**Q1**

![](/images/jueJin/d0b1a1d3b0b3422.png)

**Q2**

![](/images/jueJin/db90e8cb989749f.png)

![](/images/jueJin/0ea44dc8761c4e9.png)

进入官方交流群，了解更多ClickHouse&ByteHouse干货