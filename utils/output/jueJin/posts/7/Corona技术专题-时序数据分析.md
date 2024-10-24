---
author: "网易云音乐技术团队"
title: "Corona技术专题-时序数据分析"
date: 2023-10-27
description: "无论您是大前端或是服务端开发同学，通过本文的阅读您都将掌握时序数据库的基本概念、特点，从而帮助您更好地理解和使用市面上的监控类产品，也为您创建类似的服务提供一些启发。"
tags: ["前端","监控中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读22分钟"
weight: 1
selfDefined:"likes:11,comments:0,collects:16,views:2617,"
---
![题图](/images/jueJin/cf3926517d364ef.png)

> 本文作者: [kkdev163](https://link.juejin.cn?target=https%3A%2F%2Fkkdev163.github.io%2F "https://kkdev163.github.io/")

Corona 技术专题系列文章:
----------------

*   1.[网易云音乐大前端监控体系（Corona）建设实践-开篇](https://juejin.cn/post/7243451555931521061?searchId=2023101610211842B1DC300A92FAEC3EF8 "https://juejin.cn/post/7243451555931521061?searchId=2023101610211842B1DC300A92FAEC3EF8")
*   2.[Corona技术专题-日志上报、采集、分流链路设计](https://juejin.cn/post/7253824401513758779?searchId=2023101610211842B1DC300A92FAEC3EF8 "https://juejin.cn/post/7253824401513758779?searchId=2023101610211842B1DC300A92FAEC3EF8")

一. 前言
-----

在 Corona 平台的技术体系建设中，时序数据库承担了时序数据的「存储」和「分析」 的关键作用。本文将介绍三款数据库在 Corona 时序分析场景下的应用。分别是 InfluxDB、ClickHouse、ElasticSearch。 无论您是大前端或是服务端开发同学，通过本文的阅读您都将掌握时序数据库的基本概念、特点，从而帮助您更好地理解和使用市面上的监控类产品，也为您创建类似的服务提供一些启发。

二. 时序数据库简介
----------

### 2.1 什么是时序数据？

时序数据是按时间顺序排序的一组数字序列，它可以反应某一现象的变化规律。在我们的日常生活中时序数据随处可见，如「天气预报时序走势图」它反映了温度随时间变化的规律; 如「油价时序走势图」 它反应了油价随时间变化的规律:

![](/images/jueJin/94b0b5f84d9b453.png)

在应用监控领域，时序走势图能够反应「应用健康度」随时间变化的趋势，是用户最为关注的几类图表之一: ![](/images/jueJin/0fba2b937c4a40b.png)

除了分钟级粒度的数据，有时也需要按 「小时级」、「天级」 粒度查看走势数据：

![](/images/jueJin/110a38440356408.png)

除了整体维度，用户也可以按某个特征维度对走势数据做分类(下表对比了不同档次机型的加载时间走势): ![](/images/jueJin/5e84f413b90842b.png)

对时序数据做上述分析的过程我们可以称其为时序数据分析。便于存储时序数据、提供时序数据分析能力的数据库我们称其为时序数据库。

### 2.2 时序数据库中的基本概念

1.**时间列**

时序数据库的主要查询和分析能力与「时间」字段有较大关联，所以在设计时序数据库的表结构时通常会将「时间」字段作为「索引」字段。

这样的设计方便应用快速筛选出目标范围的时序数据，并且时序数据库也提供了一系列「时间」相关的工具函数，方便我们在时序数据上按不同的时间粒度(如 分钟、小时、天 )做聚合分析。

2.**维度列**

在储存时序数据时，通常会附带上这条数据的维度信息，维度信息可以在后续分析时作为过滤或聚合的条件。如天气时序数据中，会有「城市」维度，维度值为 北京、上海、杭州 等。 油价时序数据中，会有「汽油标号」维度，维度值为 92、95、98 等。

在表结构设计时通常高频的查询和聚合维度也是建议作为「索引」字段存储。

3.**数值列**

时序数据的数值，如天气时序数据中的「温度值」、油价时序数据中的「价格」，会作为数值列进行存储。

时序数据库会提供一系列的工具函数对数值列做分析计算。常见的分析函数有：

*   avg 求平均值
*   max 求最大值
*   min 求最小值

组合以上的基本概念，我们可以运用时序数据库就做一些常见的时序分析，如:

查询 2023 年 9 月份杭州每天的平均温度值走势 SQL：

```SQL
SELECT toStartOfDay(time), avg(degree)
FROM table_temperature
WHERE
time>='2023-09-01' AND
time<'2023-10-01' AND
city='杭州'
GROUP BY toStartOfDay(time)
```

查询最近 10 年各品类汽油每年的平均价格走势 SQL:

```SQL
SELECT toYear(time), model, avg(price)
FROM table_gas
WHERE
time>='2013-01-01' AND
time<'2023-01-01'
GROUP BY toYear(time), model
```

4.**数据过期时间 TTL**

时序数据的另一个特点是关注近期的数据，距离当前比较久远的数据相对来说没那么重要，有时出于存储容量的考虑，我们甚至会希望自动删除老旧的数据。

时序数据库一般会提供 TTL (Time To Live) 功能，在设计数据库表结构时，一般会根据数据表的聚合粒度设置相应的过期时间。如原始数据或分钟级的数据保留 30 天， 小时或天级的聚合数据保留 1 年。

简要介绍完 时序数据分析 和 时序数据库 的基本概念后，下文将介绍三款经典数据库在 Corona 时序分析场景下的应用。分别是 InfluxDB、ClickHouse、ElasticSearch。

三. InfluxDB
-----------

### 3.1 简介

[InfluxDB](https://link.juejin.cn?target=https%3A%2F%2Fdocs.influxdata.com%2Finfluxdb%2Fv2.6%2Fget-started%2F "https://docs.influxdata.com/influxdb/v2.6/get-started/") 是一款经典的开源时序数据库。在 InfluxDB 中有几个常用的概念

1.**measurement**

measurement 是 InfluxDB 中的数据表。一张 measurement 中可包含一个时间列(time column)、多个维度列(tag column)、多个数值列(field column)。

用户无需手动使用 CREATE 语句创建 measurement，InfluxDB 会在写入的数据时动态创建 measurement、动态新增维度列与数据列。

2.**tag**

tag column 是 InfluxDB 中的维度列，InfluxDB 会为所有的维度列建立索引。在设计表结构时，我们需要将经常作为查询条件、聚合条件的字段作为 tag 列进行存储。

在设计 tag 列时，需要特别留意的是 tag 列的潜在值是要可收敛的，不能是无限增长的。

举几个对比的例子:

Good Case

Bad Case

监控页面的域名(location.host)

监控页面的 URL (location.href)

设备操作系统

设备 UUID

歌曲文件类型

歌曲 ID

以监控页面的 URL 为例，它可能会带有 路径参数 或 query 参数，导致维度值非常离散，我们需要避免将这一类难以聚合的字段设计为 tag 列的原因是: InfluxDB 为了 查询/写入 性能，会为所有的 tag 列建立索引，而索引的规模直接影响内存的占用开销。若 tag 列设计不合理，极易造成 InfluxDB 的内存持续增长甚至出现 OOM 的情况。

3.**field**

field column 是 InfluxDB 中的数值列，数据类型可以是数字、字符串型。在设计表结构时，我们需要将未来用于数值统计分析的字段作为 field 列存储。一些不常作为查询条件、无法收敛的额外信息也可以放到 field 列进行存储。

4.**retention policy**

RP(retention policy) 数据保留策略，是 InfluxDB 的 TTL 实现机制。RP 可以在创建数据库后随时新增、变更。我们可以为一个数据库创建多个 RP。如:

*   `create retention policy one_week on apm_log duration 7d default;`
*   `create retention policy one_year on apm_log duration 365d;`

在数据写入时，我们可以根据数据的重要度、时效性显示地指定使用哪个 RP，数据在超过保留时间后，就会自动删除。

5.**continue query**

CQ(continue query) 持续查询，可用于 数据归档、降采样。举例来说当我们采集的原始数据是分级的，我们可以使用 CQ 功能，将原始表的数据聚合写入小时级表。

```SQL
CREATE CONTINUE QUERY "cq_event" ON "apm_log"
BEGIN
SELECT SUM("pv") as pv
INTO "one_year"."cq_hour_event"
FROM "one_week"."cq_minute_event"
GROUP BY time(1h), *
END
```

创建完 CQ 任务后，InfluxDB 就会每小时执行一次聚合任务。这样后续在查询的时候，可以直接从聚合结果中查询，加快查询速度。

### 3.2 在 Corona 中的应用场景

InfluxDB 在 Corona 平台中主要有以下几个应用场景:

*   存储 C 端用户上报的 访问量、性能 等「预聚合结果」数据
*   存储平台自身运行健康度的「原始」数据

1.**存储「预聚合结果」数据**

在平台上线初期，我们曾使用 InfluxDB 直接存储用户端上报的原始日志，并使用 CQ 功能聚合出 分钟级、小时级 粒度的聚合表。 但随着接入应用数的增多、上报日志量 的持续增长，CQ 功能查询的内存开销出现了成倍的增长，导致 InfluxDB 的查询性能骤降。

随后我们在架构中引入了流计算引擎 Flink , C 端上报数据经过外部计算引擎预聚合后，再存入 InfluxDB。 经过这样的调整后，InfluxDB 只存储 C 端用户 每分钟、每小时的 聚合结果，每分钟存储量只与 series 量级(group by 维度组合结果量级) 挂钩，不再与用户量直接关联。 InfluxDB 自身的查询性能也得到保障。

![](/images/jueJin/e186925cebc04f9.png)

举例来说，我们可以在 Flink 中配置分钟级 PV 聚合任务：

```SQL
SELECT
TUMBLE_START(PROCTIME(), INTERVAL '1' MINUTE) as wTime,
count(os) as pv,
os as osName,
moduleName as moduleName
FROM performance_log
WHERE
props['mspm'] = 'ReactNativeApplication'
GROUP BY
TUMBLE(PROCTIME(), INTERVAL '1' MINUTE),
os,
props['moduleName']
```

我们将 Flink 的聚合结果，写入 InfluxDB 表中，表结构示例如下 (moduleName、osName 为 tag 列, pv 为 field 列):

time

moduleName

osName

pv

2023-01-01 12:00:00

rn-app-1

android

10000

2023-01-01 12:00:00

rn-app-1

iphone

8000

2023-01-01 12:00:00

rn-app-2

android

5000

2023-01-01 12:00:00

rn-app-2

iphone

4000

2023-01-01 12:01:00

rn-app-1

android

10000

2023-01-01 12:01:00

...

...

...

...

...

...

...

这样在查询 每小时、每天 PV 走势时，我们可以直接基于 分钟级表 的数据做分析，相较于查询 每个用户上报的原始日志，查询数据量级大幅降低、性能大幅提升。 (细心的读者可能想到了，这里的 Flink 与 之前介绍的 InfluxDB CQ 的作用其实是一致的)

后续我们可以这样查询 InfluxDB:

```sql
SELECT
moduleName,
osName,
sum(pv) AS pv
FROM rn_minute_pv
WHERE
moduleName='rn-app-1' AND
osName='android' AND
time>='2023-01-01' AND
time<='2023-01-02'
GROUP BY time(1h)
```

查询结果:

time

moduleName

osName

pv

2023-01-01 12:00:00

rn-app-1

android

600000

2023-01-01 13:00:00

rn-app-1

android

600000

2023-01-01 14:00:00

rn-app-1

android

600000

...

...

...

...

2.**存储「原始」数据**

Corona 使用 InfluxDB 的另一个场景是存储平台自身运行健康度的「原始」数据，提升平台自身运行的可观测。 相较于 C 端场景的海量数据，机器、集群的健康度数据量级较为可控，我们可以使用 InfluxDB 进行存储、 CQ 计算。

![](/images/jueJin/4698c579317c4e4.png)

例如当我们需要观测自建的「数据消费服务」的健康度时，我们使用 InfluxDB 采集每个进程每次批量处理的 事件数，同时包含 机器、进程、事件上报平台 等维度列。 表结构示例如下:

time

hostname

pid

platform

events

2023-01-01 12:00:03

music-corona-worker-1

130616

web

10

2023-01-01 12:00:04

music-corona-worker-1

128204

android

50

2023-01-01 12:00:04

music-corona-worker-2

33096

ios

30

...

...

...

...

...

有了原始数据表，我们可以按 hostname 维度、platform 维度 观测集群的数据消费健康度。可视化方案推荐使用 [Grafna](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Fgrafana%2Flatest%2F "https://grafana.com/docs/grafana/latest/") :

![](/images/jueJin/b90814b57c024a6.png)

四. ClickHouse
-------------

### 4.1 ClickHouse 简介

ClickHouse 是 OLAP(On-Line Analytic Processing) 联机分析处理数据库。在数据分析时，可直接对亿级原始日志做在线的实时聚合计算，并且能在秒级给出聚合结果。

### 4.2 在 Corona 中的应用场景

Corona 在引入 ClickHouse 之初，是为了补充原有 性能监控架构 的分析能力(如多维的分位数 P50、P95 统计能力)，随着我们对 ClickHouse 使用经验的积累 和 特性原理的认识，我们发现在 Corona 的性能分析应用场景上，ClickHouse 能够完全取代 Flink 、InfluxDB 的作用。并且整体的架构更加简洁，数据分析的方式也更加灵活、轻便。

目前 Corona 上的建设的性能监控指标，已完全由 ClickHouse 提供存储与数据分析的能力。主要的分析功能有:

1). 基于上报数据维度字段，提供多维的组合筛选能力

2). 在线实时聚合计算，统计 平均值、分位数、PV、UV 走势

![](/images/jueJin/60fe7134fa454f5.png) 3). 按照某个维度聚合，对比不同维度值的走势

![](/images/jueJin/f5945a59a3d741b.png) 4). 查看不同维度值的占比 ![](/images/jueJin/7a8cfa68af9143a.png) 5). 统计指标值的详细分布情况 ![](/images/jueJin/977346c4480d4d1.png)

### 4.3 表结构设计及查询示例

ClickHouse 在写入数据前，需要使用建表语句创建表结构。以 ReactNative 启动耗时监控为例, 以下为示例的表结构:

```SQL
CREATE TABLE rn_monitor_cold_boot_stage_local
(
`appName` String, -- 应用名，如 云音乐
`osName` String, -- 操作系统名
`appVersion` String, -- 应用版本
`rnModuleName` String, -- ReactNative 模块名
`deviceTag` String, -- 设备性能分档
`uploadTime` DateTime, -- 日志到达服务端时间
`uid` String, -- 用户 uid
`stageName` String, -- 阶段名
`stageCost` Float32, -- 阶段耗时
)
ENGINE = MergeTree
PARTITION BY (appName, osName, toYYYYMMDD(uploadTime))
ORDER BY (rnModuleName, uploadTime)
TTL uploadTime + toIntervalDay(90)
SETTINGS index_granularity = 8192, use_minimalistic_part_header_in_zookeeper = 1
```

在示例表结构中，uploadTime 为时间列， stageCost 为数值列，其他字段都为维度列。

MergeTree 是 ClickHouse 中最重要的表引擎，这种表引擎的特点是，数据在批量写入时，ClickHouse 会将数据写入新的临时分区中, ClickHouse 会在后台对 临时分区 与 已有的数据分区 做 Merge，以此来提高数据的写入性能。

PARTITION BY 数据的分区策略，示例表以 appName, osName, 上报时间(天) 所组成的联合键 建立分区。 ClickHouse 会为每个分区建立一个目录，合理的分区策略，可以让 ClickHouse 在后续查找数据时，直接选中分区目录，大大降低扫描的数据行数。

ORDER BY 数据的排序键，ClickHouse 默认会为排序键建立索引。

TTL 数据自动过期时间，此处设置了 90 天。

index\_granularity 索引粒度为 8192 行(可理解为 8192 行数据，建立一条索引)。

示例数据如下:

```JSON
    {
    "appName": "music"
    "osName": "android",
    "appVersion": "8.9.0",
    "rnModuleName": "rn-playlistrank",
    "deviceTag": "高端机",
    "uploadTime": "2023-04-27 12:00:00",
    "uid": "9999999",
    "stageName": "render",
    "stageCost": 1000
}
```

查询示例:

```SQL
SELECT
toStartOfDay(uploadTime) as "time",
avg(stageCost) AS "avg",
quantiles(0.5, 0.9)(stageCost) AS "quantiles",
count() AS "pv",
uniq(uid) AS "uv"
FROM rn_monitor_cold_boot_stage_shard
WHERE
uploadTime>=1682006400 AND
uploadTime<=1682611199 AND
stageName='render' AND
rnModuleName='rn-playlistrank'
GROUP BY toStartOfDay(uploadTime)
ORDER BY toStartOfDay(uploadTime) ASC
```

查询结果示例: ![](/images/jueJin/d736828c752944c.png)

以上的查询示例，包含了 平均值、分位值、PV、UV 的统计，是 Corona 性能监控分析最基础 SQL。其他的性能分析都是基于该 SQL 的变种。

### 4.4 数据读写架构 及 配套建设

得益于 ClickHouse 的高性能 (举例来说，当上述的示例 SQL 的扫描数据量级达到 6 亿行时，也仅需 2 秒就可以完成数据分析）， ![](/images/jueJin/a5916b8cdc244ab.png) 在绝大多数的场景，我们可以直接使用 ClickHouse 直接对原始数据做实时聚合分析，这也使得我们的性能分析架构变得简洁。

**数据写入**

在数据写入前，我们使用自建的「性能日志处理服务」订阅不同 type 的性能日志，每个消费者订阅一种日志类型，在预处理后，会根据每张表的建表分区规则，在服务端对数据做预分区，每个分区的数据单独批量写入 ClickHouse。以此达到 批量写入 同时又减少 ClickHouse 在后台对数据做再次分区的开销，提高写入性能。

数据批量写入时，使用了自建的集群版 ClickHouse NodejsClient，做数据 Schema 校验 并 随机请求集群中的 Node 达到数据均匀分片的目的。 ![](/images/jueJin/d57861c3671b462.png) **数据查询**

细心的读者可能发现了，我们在上面示例中，我们所建的示例表，是以 `_local` 结尾，而我们的查询示例表是以 `_shard` 结尾。

事实上，我们在建表时，会同时创建 local 表 与 shard 表。在数据写入时，性能日志处理服务是直连每个 ClickHouse node 向 local 表写入数据。可以理解为每个 node 只保存了 整个完整表的 1/4 行的数据。在查询时，查询任意一个节点的 shard 表，ClickHouse 会在后台自动汇总 4 个 node 的全部数据做分析。 ![](/images/jueJin/f1a24bcf23684e2.png) 注: 该图 local 表中的行号仅用于示意分片的数据量级，并非实际的存储或索引行号。

在自建的性能日志处理服务 和 可视化后台 上，我们也加入了一些监控指标，来观测 ClickHouse 集群的读写健康度。

**写入侧监控:**

*   每分钟 批量写入的请求数
*   每分钟 批量写入的日志数
*   每分钟 不同分区的写入日志数
*   每分钟 忽略的日志数(Schema 校验不通过) ![](/images/jueJin/a45cedcf2e70405.png)
*   数据消费的延时
*   数据批量转换耗时
*   数据批量转换条数 ![](/images/jueJin/1e3752b1446447e.png)
*   数据分区转换并写入 ClickHouse 耗时
*   ClickHouse 写入请求耗时 ![](/images/jueJin/f7d2ea5cfaa1446.png)

**查询侧监控**:

*   每分钟总查询次数
*   每分钟平均查询耗时
*   慢查询 SQL 详情 ![](/images/jueJin/3c0650f886b74e0.png)

### 4.5 存在的痛点

ClickHouse 在 Corona 的性能分析场景满足了我们绝大多数的诉求，如果非要让笔者想一个痛点的话，那可能是缺少像 InfluxDB 一样的 CQ ( Continue Query) 能力。什么情况下需要 CQ 呢？

ClickHouse 虽然具有强大的实时在线分析能力，但是他的处理性能也是有资源开销的。在机器资源有限的前提下，如果需要做时间跨度大，数据量级超几百亿的分析，也是有相当大的资源开销和等待时间的。

举例来说，在 Corona 比较分析 App 版本性能走势场景时，由于 App 发版时间跨度大，每个版本仅存在一段时间的高峰流量期，如果需要客观地对比每个 App 的性能，需要让每个版本的样本量尽可能大，我们如果还是选择在线分析的话，就需要把 时间跨度拉到好几个月，此时数据分析的等待时间就会特别长。

为了解决等待耗时长的问题，我们还是转为离线分析的思路，在应用层，每日对 Top3 日活的版本做性能归档快照。在分析 App 版本走势时，使用归档快照数据做分析。

如果 ClickHouse 原生具备 InfluxDB 的 Continue Query 能力，可能实现起来会相对容易些。

五. ElasticSearch
----------------

### 5.1 简介

Elasticsearch 是一款基于 Apache Lucene 的分布式搜索和分析引擎，用于全文检索、日志分析、数据可视化等场景。它支持实时搜索、数据聚合、自动化分片和复制等功能，并提供了 RESTful API 和丰富的插件生态系统。Elasticsearch 被广泛应用于企业级搜索和日志分析等领域。

### 5.2 在 Corona 中的应用场景

在设计 Corona 平台时，我们引入 ES 的主要目的是用于存储异常监控的原始日志，并借助 ES 的全文检索能力，提供丰富、灵活的日志搜索功能。

下图为 Corona 的搜索面板，在此处我们意图搜索包含 undefined 信息的错误日志。

![](/images/jueJin/93568ad450d34a8.png)

下图为 Corona 的搜索结果列表，展示了包含 undefined 错误信息的 Issue。

![](/images/jueJin/8ea865254ecf4b2.png)

关于 ES 搜索的概念，在这篇文章中不作更多展开，感兴趣的读者可以查看笔者的[这篇文章](https://link.juejin.cn?target=https%3A%2F%2Fkkdev163.github.io%2Fblog%2Felasticsearch-basic%2F "https://kkdev163.github.io/blog/elasticsearch-basic/")。除了日志的搜索功能外，Corona 也希望为用户展示异常发生的时序趋势图。由于原始日志的存储我们已经使用了 ES 进行存储，在设计时序分析功能实现时，我们其实是有两条技术实现路线可供选择:

1.  将原始日志另写入一份至消息队列 -> Flink 聚合 -> InfluxDB
2.  使用 ES 的聚合能力，基于原始日志直接做时序数据分析。

考虑到架构的简洁、减少依赖等因素，并参考了 ES 与 InfluxDB 的性能对比文章后，我们最终选择了方案二。 以下是使用 ES 做的一些时序分析功能演示:

下图为应用整体的异常趋势图: ![](/images/jueJin/28e534991cc4487.png)

下图为单条 issue 的异常趋势图: ![](/images/jueJin/4eb4961af07446d.png)

### 5.3 表结构设计及查询示例

ES 在写入数据前，不要求建立表结构。ES 会根据写入的数据自动推断数据类型进行存储。但为了避免类型的错误推断导致后续查询功能不符合预期，建议是在写入数据前，对表结构进行约束。

ES 对表结构进行约束的方式是创建模板。模板中可包含索引匹配规则 (可理解为表名)，表中的数据结构类型。

下面我们创建一个演示的模板，模板中的索引包含了 5 个字段

*   project\_id: 应用 ID，类型为 long
*   issue\_id: 聚合错误 ID, 类型为 long
*   os: 上报操作系统，类型为 keyword
*   ts: 上报时间，类型为 date
*   error\_obj: 错误详情对象，JSON 类型，JSON 中包含 message 字段，message 为文本类型，支持分词检索。

```JSON
PUT _template/template_web_demo
    {
    "indx_patterns": ["web_demo_*"],
        "mappings": {
            "_doc": {
                "project_id": {
                "type": "long"
                },
                    "issue_id": {
                    "type": "long"
                    },
                        "os": {
                        "type": "keyword"
                        },
                            "ts": {
                            "type": "date"
                            },
                                "error_obj": {
                                    "properties": {
                                        "message": {
                                        "type": "text",
                                            "fields": {
                                                "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
```

以下是一些示例数据：

```javascript
    [
        {
        id: 1,
        project_id: 1,
        issue_id: 1,
        os: "iphone",
        ts: "2023-04-27 15:00:00",
            error_obj: {
            message: "Cannot read properties of undefined (reading 'providerLog')",
            },
            },
                {
                id: 2,
                project_id: 1,
                issue_id: 2,
                os: "android",
                ts: "2023-04-27 15:01:00",
                    error_obj: {
                    message: "e.forEach is not a function')",
                    },
                    },
                    ];
```

查询示例: 查询项目 id 为 1 的所有 issue 的最近 7 天每日上报量走势

```JSON
    {
        "query": {
            "bool": {
                "filter": {
                    "bool": {
                        "must": [
                        { // 指定查询的项目id 为 1
                            "term": {
                            "project_id": 1
                        }
                        },
                        { // 指定查询时间范围 >= 2023-04-21 00:00:00
                            "range": {
                                "ts": {
                                "gte": 1682006400000
                            }
                        }
                        },
                        { // 指定查询时间范围 <= 2023-04-27 23:59:59
                            "range": {
                                "ts": {
                                "lte": 1682611199000
                            }
                        }
                    }
                ]
            }
        }
    }
    },
    "aggs": { // 聚合，按 issue_id 字段做聚合
        "issueId": {
            "terms": {
            "field": "issue_id"
            },
            "aggs": { // 子聚合，按时间1天粒度做聚合
                "series": {
                    "date_histogram": {
                    "field": "ts",
                    "interval": "1d",
                    "format": "yyyy-MM-dd HH:mm:ss",
                    "time_zone": "+08:00"
                }
            }
        }
    }
}
"size": 0, // 只统计聚合结果，不返回原文档
}
```

对于首次接触 ES 的同学来看，这个查询条件看上去会比较地复杂。上面的查询如果用 InfluxDB SQL 的话其实就是:

```SQL
SELECT COUNT()
FROM `web_demo`
WHERE
project_id = 1 AND
time>=1682006400000 AND
time <=1682611199000
GROUP BY issue_id, time(1d);
```

### 5.4 数据读写架构

> 本节我们只介绍 ES 在 Corona 时序数据场景下的应用层架构

**1) 基于原始日志做时序分析**

Corona 平台的异常日志原始日志由异常日志清洗服务做预处理后批量写入 ES。可视化管理后台在后续可直接请求 ES 做时序数据分析。 ![](/images/jueJin/27b73a6d3c904a0.png)

**2) 基于聚合数据做时序分析**

在 Corona 的告警场景，考虑到查询聚合表会比查询原始表有更高的性能，并且为了方便追溯告警的历史走势，我们在应用层配置了定时任务做分钟级的数据聚合，告警任务在执行时，直接读取分钟级聚合表。

![](/images/jueJin/82b7a1537193436.png)

### 5.5 存在的痛点

Corona 使用 ES 做时序分析的场景相对来说还比较有限。对于 ES 在时序分析下的性能，是否存在瓶颈，尚未有深入的探索。我们的痛点主要是集中在使用姿势上。

通过 5.3 节 的示例，读者不难发现，在时序分析场景，ES 查询的请求体的书写 和 理解 相对于 InfluxDB 来说，具有一定的复杂度。 如果我们的项目需要用到 ES 来做时序分析，建议是在应用层封装一些 Utils 工具类，协助做请求体生成 和 数据解析。NodeJS 环境下推荐基于 [bodybuilder](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fbodybuilder "https://www.npmjs.com/package/bodybuilder") 做上层的封装。

六.小结
----

本篇文章介绍了时序分析的基本概念，并结合 Corona 平台的应用场景，分别介绍了三款时序数据库的 基本概念 和 使用建议，下表是简要的总结，希望对读者有一些帮助和启发，限于笔者的个人水平，文中难免存在解释不到位或描述不准确的地方，欢迎读者留言讨论交流。

数据库

特点

痛点

适合 存储、分析 场景

InfluxDB

使用便捷、部署低成本

官方仅开源单机版无高可用、内存敏感型

客户端侧预聚合后的性能日志、服务器侧的原始性能日志

ClickHouse

海量数据在线实时计算、列式存储压缩、使用便捷

部署规格高、无 CQ

客户端侧原始性能日志

ElasticSearch

具备强大的文本搜索功能

时序分析场景下的使用姿势较为复杂

具有搜索需求的文本型数据

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！