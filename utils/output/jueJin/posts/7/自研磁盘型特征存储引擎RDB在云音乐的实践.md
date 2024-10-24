---
author: ""
title: "自研磁盘型特征存储引擎RDB在云音乐的实践"
date: 2022-03-16
description: "云音乐推荐和搜索业务有大量的算法特征数据，需要以key-value的形式存储，提供在线的读写服务。2020年H2开始，我们以tair为存储框架，rocksdb为存储内核，研发了磁盘型特征存储引擎RDB"
tags: ["数据库","人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:3,views:5978,"
---
> 本文作者：奇涛，来自数据智能部-实时计算组，主要负责云音乐算法特征存储相关工作。

### 业务背景

云音乐推荐和搜索业务有大量的算法特征数据，需要以key-value的形式存储，提供在线的读写服务。这些特征主要从大数据平台上spark或者flink的任务产出，比如歌曲的特征、用户的特征等。它们的特点是数据量大，每天定时全量更新或者实时增量更新，而且对查询的性能要求高。这些算法特征数据，有的存储在redis/tair内存型存储系统中，也有的存储在myrocks/hbase磁盘型存储系统中。

为了减小接入多种不同存储系统带来的成本，并且可以针对算法特征kv数据的存储特点定制化开发，我们在tair分布式存储框架下引入rocksdb引擎，用以低成本地支持数据量较大的算法特征kv数据场景的在线存储。

下面先简要介绍tair引入rocksdb的方案，再介绍我们在算法特征kv存储上的实践。为区分tair框架下以memcache为引擎的内存型存储和以rocksdb为引擎的磁盘型存储，我们将两者分别称为MDB和RDB。

### RDB介绍

tair作为分布式存储框架，分为ConfigServer和DataServer两部分。DataServer由多个节点组成，负责数据的实际存储。所有kv数据根据对key计算hash值划分到若干桶（bucket），每个桶的数据可以存储多个副本到不同的DataServer节点上，具体映射规则由ConfigServer构建的路由表决定。

![tair分布式存储框架](/images/jueJin/4d17c43b26bb46d.png)

ConfigServer维护所有DataServer节点的状态，如果有节点增加或者减少，则发起数据迁移，并构建新的路由表。DataServer支持不同的底层存储引擎，底层引擎需要实现kv数据的基本操作put/get/delete，以及数据全量扫描scan接口。Client通过ConfigServer提供的路由表，向实际要请求的DataServer节点读写数据。读写数据均请求对应桶的master节点，如果是写数据由DataServer内部完成数据的主从复制。

![rocksdb存储引擎原理](/images/jueJin/3d3ba2762bc8470.png)

而rocksdb为开源的kv存储引擎，原理为lsm(log structured merge)，lsm为很多sst文件组成的分层结构。每个sst文件包含一定数量的kv数据，并附带相应的元数据信息，而且sst文件中的kv都是按key排序的。通过分层的方式，定期将各个level的数据做合并(compaction)，删除无效数据。新写入的数据放在level0，level0的规模达到阈值后compaction到level1，依次类推。每一层的所有sst文件也保持整体有序且不重叠(level0除外），查询时从上往下在各level中检索。

在tair中引入rocksdb时，我们设计了每条kv数据的存储格式如下。

![RDB中的kv格式](/images/jueJin/1228670b6adc4ed.png)

存储到rocksdb中的key，由bucket\_id+area\_id+原始key拼接而成。其中area\_id指的是业务表id，不同的数据表有不同的area。bucket\_id的作用是为了数据迁移时方便按桶依次迁移，因为rocksdb的数据是有序存储的，相同桶的数据聚集在一起可以通过前缀扫描提高效率。area\_id的作用是为了区分不同的业务表，避免key有重叠。其实，对于数据量大的表，我们在rocksdb中会存储到单独的column family中，这样同时也能避免key重叠。

存储到rocksdb中的value，由meta+原始value拼接而成。其中meta保存了kv的修改时间、过期时间等信息，因为rocksdb中的数据可以在compaction的时候判断是否丢弃，通过自定义CompactionFilter可以实现过期数据的删除。

### bulkload批量导数据

#### bulkload方案

算法特征数据有很多的场景都是每天在大数据平台离线计算出最新的全量数据，再导入kv存储引擎，这些数据表的规模经常在100GB以上，条数在1亿条以上。基础版本的RDB只能通过调用put接口逐条写入，这样会导致需要有很多并发的任务来通过put方式导入全量数据，占用大数据平台的计算资源。

而且，因为数据put写入RDB的顺序是无序的，这样会导致rocksdb在compaction的时候io压力较大，因为需要对大量的kv做完排序后重新生成整体有序的sst文件。这也就是rocksdb的写放大问题，rocksdb真实写数据的量会放大几十倍，磁盘io压力会导致读请求的响应时间波动。

针对此问题，我们借鉴了hbase的bulkload机制来提高导入效率。导入大规模的离线特征时，先通过spark将原始数据排序并转换为rocksdb内部的数据格式文件sst，再通过调度程序依次将sst文件加载（rocksdb提供ingest机制）到RDB集群中相应数据节点。

![bulkload方案](/images/jueJin/0f7b2e1a03c0439.png)

这个过程中有两个点提升了导数据的效率，一是通过文件大批量加载数据，而不是调用put接口写入单条/多条数据。二是在Spark转换数据时已经做了排序，减少了rocksdb内部的数据合并（compaction）。

通过一份线上的真实算法特征数据，我们对比了bulkload方式和逐条put方式导入的性能，bulkload方式在io压力、读rt、compaction量上均明显好于put方式，约3倍提升。场景：已有全量数据3.8TB（2副本共7.6TB），导入2.1亿条增量数据300GB（2副本共600GB），导入时间均控制在100分钟左右，读qps为1.2w/s。

![io-util对比（bulkload vs put）](/images/jueJin/c3dca7d22c3147e.png)

![平均读rt对比（bulkoad vs put）](/images/jueJin/f3c689e2f15f44d.png)

通过rocksdb内部日志对比两者compaction情况，bulkload共85GB（10:00到13:00），put共273GB（13:00到16:00），约1:3.2。

```arduino
10:00 Cumulative compaction: 1375.15 GB write, 6.43 MB/s write, 1374.81 GB read, 6.43 MB/s read, 23267.8 seconds
13:00 Cumulative compaction: 1460.62 GB write, 6.29 MB/s write, 1460.29 GB read, 6.29 MB/s read, 24320.8 seconds
16:00 Cumulative compaction: 1733.60 GB write, 7.16 MB/s write, 1733.31 GB read, 7.16 MB/s read, 27675.0 seconds
```

#### 双版本导数据

在bulkload的基础上，对于每次通过全量导数据覆盖更新的场景，我们通过双版本的机制，进一步减少了bulkload导数据时的磁盘io。一份数据对应2个版本（areaid），即对应到rocksdb中的2个column family。导数据和读数据的版本错开，并轮流切换。导数据前先清空无效版本的数据，这样完全避免了rocksdb中的数据合并（compaction）。

双版本的机制使用了存储代理层的多版本功能，具体方案和细节这里不作介绍。通过这种方式，导数据期间查询数据的rt波动更小。下图为同一份数据在RDB集群与冷热集群（hBase+redis）读rt的监控对比。

![双版本bulkload效果对比](/images/jueJin/6c34503f8aa94f9.png)

### key-value分离存储

#### kv分离方案

rocksdb通过compaction合并无效的数据，并保证每个level的数据都是有序的。compaction过程会引起写放大问题。对于长value，写放大问题更严重，因为value会被频繁的读写。对于长value的写放大问题，业内已经有针对SSD存储的kv分离方案了《WiscKey: Separating Keys from Values in SSD-conscious Storage》\[1\]。即将value单独存放在blob文件中，lsm中只存储value在blob文件中的位置索引（fileno+offset+size）。

在RDB中，我们引入了tidb开源的kv分离插件，它对rocksdb的代码入侵较小，且有一套无效数据回收的GC机制。GC的方式是在每次compaction时更新每个blob文件有多少数据量的value被有效引用，如果一个blob文件的有效数据比例低于某个阈值（默认0.5），则重写有效数据到新文件，并删除原文件。

![kv分离原理](/images/jueJin/40ac4086dc54481.png)

通过对比，对于长value，kv分离在随机写数据和bulkload导数据场景下均有不同程度的性能提升，但代价是更多的磁盘空间占用。随机写数据由于本身写放大问题严重，kv分离后读rt能下降90%。bulkload导数据kv分离后读rt也能下降50%以上。并且，我们测得kv分离有效果的value长度阈值约在0.5KB~0.7KB之间，线上部署时配置默认阈值为1KB，超过此长度的value会被分离存放在blob文件中。

下图是我们测试的一个场景，value平均长度5.3KB，全量数据800GB（1.6亿条），bulkload导入更新数据，并随机读数据。不做kv分离时，平均读rt为1.02ms，做了kv分离后，平均读rt为0.44ms，降低57%。

![kv分离读rt对比](/images/jueJin/e3d42306935e4e5.png)

#### 序列append

在kv分离这个机制的基础上，我们也在探索进一步的创新：实现blob文件中value的原地更新。

这个想法的来源是这样的：有些算法特征是以序列形式的value存储的，比如用户的历史行为，更新的方式是向长序列中追加（append）一个短序列。按照原有的kv方式，我们需要先获取原序列，再append更新数据形成新的序列，最后写到RDB。这个过程多余了大量数据的读写。针对这个问题，我们研发了序列append更新的接口。

如果只是简单的在RDB内部做序列的读取->追加->写入操作，仍然会存在大量的磁盘读写。于是我们做了一个改造：提前在kv分离后的blob文件中对每个value预留一部分空间（类似于STL中的vector的内存分配），序列append时直接写入到blob文件中value的尾部。如果这一过程无法进行（如预留空间不够），则仍旧执行读取->追加->写入的操作。

序列append更新的存储格式如下：

![序列append更新存储](/images/jueJin/25c3c8c98a3848f.png)

序列append更新的详细流程如下：

![序列append更新流程](/images/jueJin/2d5cd250cc694b2.png)

目前RDB的序列append功能已经上线，效果也非常明显。一个实际的算法特征存储场景，原来每次更新数据量几TB，耗时10小时，现在每次更新数据量几GB，耗时1小时。

### ProtoBuf字段更新

序列append的方案证实是可行的，于是我们探索进一步的扩展：支持更多通用的“部分更新”接口，如add/incr等。

云音乐的算法特征kv数据，value基本上是以ProtoBuf（简称PB）的格式存储的，我们算法工程团队在2020年也自研了支持PB格式字段级更新的内存型存储引擎（在MDB上扩展为PDB），后续也会有专门对PDB的详细介绍文章，这里不做具体介绍。PDB的原理是通过引擎层对PB的编解码，支持对指定编号的字段做更新操作，如incr/update/add，也包括更复杂的reapted字段的去重和排序等。这样原来要在应用层实现的读取->解码->更新->编码->写入的过程，现在只要调用pb\_upate接口即可完成。PDB已在线上广泛应用，因此我们希望能把这一套PB更新功能扩展到磁盘型特征存储引擎RDB上。

目前这一块我们已经开发完成，正在做更多的测试。方案是复用PDB的PB更新逻辑，改造rocksdb代码实现kv分离后的value原地修改，避免频繁的compaction带来多余的磁盘读写。上线后的效果待后续再同步。

改造后的rocksdb存储格式如下：

![改造后的rocksdb存储](/images/jueJin/04ae89b8a36d42e.png)

RDB中PB更新的详细流程如下：

![RDB中PB更新流程](/images/jueJin/ae9ece7e693f41e.png)

### 总结思考

经过一年多的时间，在基础版本的RDB上，我们根据算法特征数据存储的特点，定制化研发了以上一些新特性。目前RDB线上集群已经具备一定的规模，存储数据条数百亿级，数据量十TB级，QPS峰值达百万每秒。

对于RDB的自研特性，我们的思考是这样的：底层内核为改造后的rocksdb（带kv分离），在此之上定制化研发新的应用场景，包括离线特征bulkload、实时特征snapshot、PB字段更新协议等。

![](/images/jueJin/1cf9bd31da054d1.png)

当然，RDB也存在一些不足之处。比如，RDB采用的tair框架按key通过hash分区，相比于通过range分区，在扫描一个范围的数据时支持得就不好。另外，目前RDB支持的数据结构和操作接口也比较简单，我们后续也将根据特征存储的业务需要，研发支持更多的功能，比如计算查询一个时间序列窗口的统计值（sum/avg/max等）。我们也会结合内部特征平台Feature Store的演进，构建一套完整的面向机器学习的特征存储服务。

### 参考资料

\[1\]. Arpaci-Dusseau R H, Arpaci-Dusseau R H, Arpaci-Dusseau R H, et al. WiscKey: Separating Keys from Values in SSD-Conscious Storage\[J\]. Acm Transactions on Storage, 2017, 13(1):5.

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们[staff.musicrecruit@service.netease.com](https://link.juejin.cn?target=mailto%3Astaff.musicrecruit%40service.netease.com "mailto:staff.musicrecruit@service.netease.com")