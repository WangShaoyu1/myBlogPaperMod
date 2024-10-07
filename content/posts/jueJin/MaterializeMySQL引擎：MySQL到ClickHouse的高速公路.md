---
author: "华为云开发者联盟"
title: "MaterializeMySQL引擎：MySQL到ClickHouse的高速公路"
date: 2021-01-21
description: "引言熟悉MySQL的朋友应该都知道，MySQL集群主从间数据同步机制十分完善。令人惊喜的是，ClickHouse作为近年来炙手可热的大数据分析引擎也可以挂载为MySQL的从库，作为MySQL的'协处理"
tags: ["MySQL"]
ShowReadingTime: "阅读8分钟"
weight: 966
---
> 摘要： MySQL到ClickHouse数据同步原理及实践

引言
--

熟悉MySQL的朋友应该都知道，MySQL集群主从间数据同步机制十分完善。令人惊喜的是，ClickHouse作为近年来炙手可热的大数据分析引擎也可以挂载为MySQL的从库，作为MySQL的 "协处理器" 面向OLAP场景提供高效数据分析能力。早先的方案比较直截了当，通过第三方插件将所有MySQL上执行的操作进行转化，然后在ClickHouse端逐一回放达到数据同步。终于在2020年下半年，Yandex 公司在 ClickHouse 社区发布了MaterializeMySQL引擎，支持从MySQL全量及增量实时数据同步。MaterializeMySQL引擎目前支持 MySQL 5.6/5.7/8.0 版本，兼容 Delete/Update 语句，及大部分常用的 DDL 操作。

基础概念
----

*   **MySQL & ClickHouse**

MySQL一般特指完整的MySQL RDBMS，是开源的关系型数据库管理系统，目前属于Oracle公司。MySQL凭借不断完善的功能以及活跃的开源社区，吸引了越来越多的企业和个人用户。

ClickHouse是由Yandex公司开源的面向OLAP场景的分布式列式数据库。ClickHouse具有实时查询，完整的DBMS及高效数据压缩，支持批量更新及高可用。此外，ClickHouse还较好地兼容SQL语法并拥有开箱即用等诸多优点。

*   **Row Store & Column Store**

MySQL存储采用的是Row Store，表中数据按照 Row 为逻辑存储单元在存储介质中连续存储。这种存储方式适合随机的增删改查操作，对于按行查询较为友好。但如果选择查询的目标只涉及一行中少数几个属性，Row 存储方式也不得不将所有行全部遍历再筛选出目标属性，当表属性较多时查询效率通常较低。尽管索引以及缓存等优化方案在 OLTP 场景中能够提升一定的效率，但在面对海量数据背景的 OLAP 场景就显得有些力不从心了。

ClickHouse 则采用的是 Column Store，表中数据按照Column为逻辑存储单元在存储介质中连续存储。这种存储方式适合采用 SIMD (Single Instruction Multiple Data) 并发处理数据，尤其在表属性较多时查询效率明显提升。列存方式中物理相邻的数据类型通常相同，因此天然适合数据压缩从而达到极致的数据压缩比。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4e46e0e6c1e4736b8fa321abddb6cca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

使用方法
----

*   部署Master-MySQL

开启BinLog功能：ROW模式  
开启GTID模式：解决位点同步时MySQL主从切换问题（BinLog reset导致位点失效）

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b085ec7141c4701bf5b6d358736cb2b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   部署Slave-ClickHouse

获取 ClickHouse/Master 代码编译安装  
推荐使用GCC-10.2.0，CMake 3.15，ninja1.9.0及以上

*   创建Master-MySQL中database及table

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24282f3b0cf14a058a923ba4d7f974db~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   创建 Slave-ClickHouse 中 MaterializeMySQL database

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/588116c3baa445e28d49d28c4692ae0a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

此时可以看到ClickHouse中已经有从MySQL中同步的数据了：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72fc303b03994d3091c25c9504e83a70~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

工作原理
----

*   BinLog Event

MySQL中BinLog Event主要包含以下几类：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b889c56a9904770a0fbf76f95a9dd43~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

事务提交后，MySQL 将执行过的 SQL 处理 BinLog Event，并持久化到 BinLog 文件

ClickHouse通过消费BinLog达到数据同步，过程中主要考虑３个方面问题：

1、DDL兼容：由于ClickHouse和MySQL的数据类型定义有区别，DDL语句需要做相应转换

2、Delete/Update 支持：引入`_version`字段，控制版本信息

3、Query 过滤：引入`_sign`字段，标记数据有效性

*   DDL操作

对比一下MySQL的DDL语句以及在ClickHouse端执行的DDL语句：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/378a555198254a5a9a31c1153b545ee8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

可以看到：

1、在DDL转化时默认增加了2个隐藏字段：\_sign(-1删除, 1写入) 和 \_version(数据版本)  
2、默认将表引擎设置为 ReplacingMergeTree，以 \_version 作为 column version  
3、原DDL主键字段 runoob\_id 作为ClickHouse排序键和分区键

此外还有许多DDL处理，比如增加列、索引等，相应代码在Parsers/MySQL 目录下。

*   Delete/Update操作

Update：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6718ba3a0d644628425602e53270891~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

可以看到，ClickHouse数据也实时同步了更新操作。

*   Delete:

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae2d3e220dcf408dada5a41aaff86020~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

可以看到，删除id为2的行只是额外插入了`_sign == -1`的一行记录，并没有真正删掉。

*   日志回放

MySQL 主从间数据同步时Slave节点将 BinLog Event 转换成相应的SQL语句，Slave 模拟 Master 写入。类似地，传统第三方插件沿用了MySQL主从模式的BinLog消费方案，即将 Event 解析后转换成 ClickHouse 兼容的 SQL 语句，然后在 ClickHouse 上执行（回放），但整个执行链路较长，通常性能损耗较大。不同的是，MaterializeMySQL 引擎提供的内部数据解析以及回写方案隐去了三方插件的复杂链路。回放时将 BinLog Event 转换成底层 Block 结构，然后直接写入底层存储引擎，接近于物理复制。此方案可以类比于将 BinLog Event 直接回放到 InnoDB 的 Page 中。

同步策略
----

*   日志回放

v20.9.1版本前是基于位点同步的，ClickHouse每消费完一批 BinLog Event，就会记录 Event 的位点信息到 .metadata 文件:

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f87b44f7a3ec42feb53cbb15410b3dab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

这样当 ClickHouse 再次启动时，它会把 {‘mysql-bin.000003’, 355005999} 二元组通过协议告知 MySQL Server，MySQL 从这个位点开始发送数据：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90d529ecaa9549a691130d524baaf8c7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

存在问题：

如果MySQL Server是一个集群，通过VIP对外服务，MaterializeMySQL创建 database 时 host 指向的是VIP，当集群主从发生切换后，{Binlog File, Binlog Position} 二元组不一定是准确的，因为BinLog可以做reset操作。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb23979c45f048cfa45550041ca9fde3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

为了解决这个问题，v20.9.1版本后上线了 GTID 同步模式，废弃了不安全的位点同步模式。

*   GTID同步

GTID模式为每个 event 分配一个全局唯一ID和序号，直接告知 MySQL 这个 GTID 即可，于是`.metadata`变为:

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa959072190646db96f9cc36ccb12c0d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

其中 0857c24e-4755-11eb-888c-00155dfbdec7 是生成 Event的主机UUID，1-783是已经同步的event区间

于是流程变为:

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a8df7ac7e1844faafb48bba5477f995~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

源码分析
----

*   概述

在最新源码 (v20.13.1.1) 中，ClickHouse 官方对 DatabaseMaterializeMySQL 引擎的相关源码进行了重构，并适配了 GTID 同步模式。ClickHouse 整个项目的入口 `main` 函数在 `/ClickHouse/programs/main.cpp` 文件中，主程序会根据接收指令将任务分发到 `ClickHouse/programs` 目录下的子程序中处理。本次分析主要关注 Server 端 `MaterializeMySQL` 引擎的工作流程。

*   源码目录

与 MaterializeMySQL 相关的主要源码路径：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91c28876b96340b481a36acc71e98fc3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   服务端主要流程

ClickHouse 使用 POCO 网络库处理网络请求，Client连接的处理逻辑在 ClickHouse/src/Server/\*Handler.cpp 的 hander方法里。以TCP为例，除去握手，初始化上下文以及异常处理等相关代码，主要逻辑可以抽象成:

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bd4761e2d0d4108ba31efa83b120b9b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   数据同步预处理

Client发送的SQL在executeQuery函数处理，主要逻辑简化如下：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd922cc467504ee68fb40d4636fe8ce6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

主要有三点：

1、解析SQL语句并生成语法树 AST  
2、InterpreterFactory 工厂类根据 AST 生成执行器  
3、interpreter->execute()

跟进第三点，看看 InterpreterCreateQuery 的 excute() 做了什么：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c2c9bf4b4224a7db96ff4d706b6f6a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

这里注释很明显，主要执行 CREATE 或 ATTACH DATABASE，继续跟进 createDatabase() 函数：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3631616fc544bffbf19992194a22806~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

到这里，相当于将任务分发给DatabaseMaterializeMySQL处理，接着跟踪 loadStoredObjects 函数：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e44319891df4d04b8530d3812cf10cb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

跟进startSynchronization() 绑定的执行函数：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d5f06fe3a24e1f97ec3a3162bb6cc6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   全量同步

MaterializeMySQLSyncThread::prepareSynchronized 负责DDL和全量同步，主要流程简化如下：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea8904f5252642389ae1d02b41eff1b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

ClickHouse作为MySQL从节点，在MaterializeMetadata构造函数中对MySQL端进行了一系列预处理：

1、将打开的表关闭，同时对表加上读锁并启动事务  
2、TablesCreateQuery通过SHOW CREATE TABLE 语句获取MySQL端的建表语句  
3、获取到建表语句后释放表锁

继续往下走，执行到 metadata.transaction() 函数，该调用传入了匿名函数作为参数，一直跟进该函数会发现最终会执行匿名函数，也就是cleanOutdatedTables以及dumpDataForTables函数，主要看一下 dumpDataForTables 函数：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5e9406cdc364d07b1229f6215f9b845~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

继续跟踪 tryToExecuteQuery 函数，会调用到 executeQueryImpl() 函数，上文提到过这个函数，但这次我们的上下文信息变了，生成的执行器发生变化，此时会进行 DDL 转化以及 dump table 等操作：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/826298b5fe9f44538ddf000cdf599681~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

此时 InterpreterFactory 返回 InterpreterExternalDDLQuery，跟进去看 execute 函数做了什么：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5355334b7a945dcaad35b93da3ea571~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

继续跟进去看看 getIdentifierName(arguments\[1\])).execute() 做了什么事情：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2f8dac398974edea5f99a46764bd34a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

进一步看 InterpreterImpl::getRewrittenQueries 是怎么转化 DDL 的：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7541ee09efb54a0691efe8feb378f858~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

完成DDL转换之后就会去执行新的DDL语句，完成建表操作，再回到 dumpDataForTables：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/861c1e5ca303464bbee3317014885729~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

*   增量同步

还记得startSynchronization() 绑定的执行函数吗？全量同步分析都是在 prepareSynchronized()进行的，那增量更新呢？

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f88625830604873bac95d8e325f285f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

可以看到，while 语句里有一个 binlog\_event 的侦听函数，用来侦听 MySQL 端 BinLog 日志变化，一旦 MySQL 端执行相关操作，其 BinLog 日志会更新并触发 binlog\_event，增量更新主要在这里进行。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbfc4483ad66451f952356c4ff3bd98d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "image")

小结
--

MaterializeMySQL 引擎是 ClickHouse 官方2020年主推的特性，由于该特性在生产环境中属于刚需且目前刚上线不久，整个模块处于高速迭代的状态，因此有许多待完善的功能。例如复制过程状态查看以及数据的一致性校验等。感兴趣的话可参考Github上的2021-Roadmap，里面会更新一些社区最近得计划。以上内容如有理解错误还请指正。

引用
--

ClickHouse社区文档

[ClickHouse社区源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FClickHouse%2FClickHouse "https://github.com/ClickHouse/ClickHouse")

MySQL实时复制与实现

[MaterializeMySQL引擎分析](https://link.juejin.cn?target=http%3A%2F%2F3ms.huawei.com%2Fhi%2Fgroup%2F3288655%2Fwiki_6006250.html%233 "http://3ms.huawei.com/hi/group/3288655/wiki_6006250.html#3")

本文分享自华为云社区《MySQL到ClickHouse的高速公路-MaterializeMySQL引擎》，原文作者：FavonianKong 。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F238417%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/238417?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")