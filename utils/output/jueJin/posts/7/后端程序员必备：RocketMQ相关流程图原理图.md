---
author: "捡田螺的小男孩"
title: "后端程序员必备：RocketMQ相关流程图原理图"
date: 2019-09-15
description: "整理了一些RocketMQ相关流程图原理图，做一下笔记，大家一起学习。 是一个队列模型的消息中间件，具有高性能、高可靠、高实时、分布式特点。 Producer、Consumer、队列都可以分布式。 实例消费这个 Topic 对应的所有队列，如果做集群消费，则多个 Consum…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:101,comments:1,collects:204,views:13093,"
---
### 前言

整理了一些RocketMQ相关流程图/原理图，做一下笔记，大家一起学习。

### RocketMQ是什么

![](/images/jueJin/16d2d660ebc81e5.png)

*   是一个队列模型的消息中间件，具有高性能、高可靠、高实时、分布式特点。
*   Producer、Consumer、队列都可以分布式。
*   Producer 向一些队列轮流发送消息，队列集合称为 Topic，Consumer 如果做广播消费，则一个 consumer 实例消费这个 Topic 对应的所有队列，如果做集群消费，则多个 Consumer 实例平均消费这个 topic 对应的队列集合。
*   能够保证严格的消息顺序
*   提供丰富的消息拉取模式
*   高效的订阅者水平扩展能力
*   实时的消息订阅机制
*   亿级消息堆积能力
*   较少的依赖

### RocketMQ 核心组件图

RocketMQ是开源的消息中间件，它主要由NameServer，Producer，Broker，Consumer四部分构成。

![](/images/jueJin/16d2b040e9dd422.png)

#### NameServer

NameServer主要负责Topic和路由信息的管理，功能类似Dubbo的zookeeper。

#### Producer

消息生产者，负责产生消息，一般由业务系统负责产生消息。

#### Broker

消息中转角色，负责存储消息，转发消息。

#### Consumer

消息消费者，负责消息消费，一般是后台系统负责异步消费。

### RokcetMQ 物理部署图

![](/images/jueJin/16d29d664d1224d.png)

#### NameServer

NameServer是一个几乎无状态节点，可集群部署，节点之间无任何信息同步。

#### Broker

Broker分为Master与Slave，一个Master可以对应多个Slave，但是一个Slave只能对应一个Master，Master与Slave的对应关系通过指定相同的BrokerName，不同的BrokerId来定义，BrokerId为0表示Master，非0表示Slave。Master也可以部署多个。每个Broker与Name Server集群中的所有节点建立长连接，定时注册Topic信息到所有Name Server。

#### Producer

Producer与Name Server集群中的其中一个节点（随机选择）建立长连接，定期从Name Server取Topic路由信息，并向提供Topic服务的Master建立长连接，且定时向Master发送心跳。Producer完全无状态，可集群部署。

#### Consumer

Consumer与Name Server集群中的其中一个节点（随机选择）建立长连接，定期从Name Server取Topic路由信息，并向提供Topic服务的Master、Slave建立长连接，且定时向Master、Slave发送心跳。Consumer既可以从Master订阅消息，也可以从Slave订阅消息，订阅规则由Broker配置决定。

### RocketMQ 逻辑部署结构

![](/images/jueJin/16d2d6ef194117e.png)

#### Producer Group

用来表示一个发送消息应用，一个 Producer Group 下包含多个 Producer 实例，可以是多台机器，也可以 是一台机器的多个进程，或者一个进程的多个 Producer 对象。一个 Producer Group 可以发送多个 Topic 消息，Producer Group 作用如下：

*   标识一类 Producer
*   可以通过运维工具查询这个发送消息应用下有多个 Producer 实例
*   发送分布式事务消息时，如果 Producer 中途意外宕机，Broker 会主动回调 Producer Group 内的任意 一台机器来确认事务状态。

#### Consumer Group

用来表示一个消费消息应用，一个 Consumer Group 下包含多个 Consumer 实例，可以是多台机器，也可 以是多个进程，或者是一个进程的多个 Consumer 对象。一个 Consumer Group 下的多个 Consumer 以均摊 方式消费消息，如果设置为广播方式，那么这个 Consumer Group 下的每个实例都消费全量数据。

### NameServer 路由注册、删除机制

![](/images/jueJin/16d295e81899870.png)

*   Broker每30秒向NameServer发送心跳包，心跳包中包含topic的路由信息
*   NarneServer 收到 Broker 心跳包后 更新 brokerLiveTable 中的信息， 特别记录心跳时间 lastUpdateTime
*   NarneServer 每隔 10s 扫描 brokerLiveTable， 检 测表中上次收到心跳包的时间，比较当前时间 与上一次时间，如果超过120s，则认为 broker 不可用，移除路由表中与该 broker相关的所有 信息
*   消息生产者拉取主题的路由信息，即消息生产者并不会立即感知 Broker 服务器的新增与删除。

### RocketMQ的消息领域模型图

![](/images/jueJin/16d2b4856aa85cb.png)

#### Topic

*   Topic表示消息的第一级类型，比如一个电商系统的消息可以分为：交易消息、物流消息等。一条消息必须有一个Topic。
*   最细粒度的订阅单位，一个Group可以订阅多个Topic的消息。

#### Tag

Tag表示消息的第二级类型，比如交易消息又可以分为：交易创建消息，交易完成消息等。RocketMQ提供2级消息分类，方便灵活控制。

#### Group

组，一个组可以订阅多个Topic。

#### Message Queue

消息的物理管理单位。一个Topic下可以有多个Queue，Queue的引入使得消息的存储可以分布式集群化，具有了水平扩展能力。

在 RocketMQ 中，所有消息队列都是持久化，长度无限的数据结构，所谓长度无限是指队列中的每个存储单元都是定长，访问其中的存储单元使用 Offset 来访问，offset 为 java long 类型，64 位，理论上在 100年内不会溢出，所以认为是长度无限。

也可以认为 Message Queue 是一个长度无限的数组，Offset 就是下标。

### 顺序消息原理图

![](/images/jueJin/16d32d1f00fd736.png)

消费消息的顺序要同发送消息的顺序一致，在 RocketMQ 中，主要的是局部顺序，即一类消息为满足顺 序性，必须 Producer 单线程顺序发送，且发送到同一个队列，这样 Consumer 就可以按照 Producer 收送 的顺序去消费消息。

### RocketMQ 消息存储设计原理图

![](/images/jueJin/16d3085660b8597.png)

#### CommitLog

消息存储文件，所有消息主题的消息都存储在 CommitLog 文件中。 Commitlog 文件存储的逻辑视图如图所示

![](/images/jueJin/16d3259de1adec3.png)

#### ConsumeQueue

消息消费队列，消息到达 CommitLog 文件后，将异步转发到消息 消费队列，供消息消费者消费。ConsumeQueue存储格式如下：

![](/images/jueJin/16d32685c1601f3.png)

*   单个 ConsumeQueue 文件中默认包含 30 万个条目，单个文件的长度为 30w × 20 字节， 单个 ConsumeQueue 文件可以看出是一个 ConsumeQueue 条目的数组，其下标为 ConsumeQueue 的逻辑偏移量，消息消费进度存储的偏移量 即逻辑偏移量。
*   ConsumeQueue 即为 Commitlog 文件的索引文件， 其构建机制是当消息到达 Commitlog 文件后， 由专门的线程 产生消息转发任务，从而构建消息消费队列文件与下文提到的索引文件。

#### IndexFile

消息索引文件，主要存储消息 Key 与 Offset 的对应关系。

消息消费队列是RocketMQ专门为消息订阅构建的索引文件，提高根据主题与消息队 列检索消息的速度 ，另外 RocketMQ 引入了 Hash 索引机制为消息建立索引， HashMap 的设 计包含两个基本点 ： Hash 槽与 Hash 冲突的链表结构。 RocketMQ 索引文件布局如图所示

![](/images/jueJin/16d3277da142b18.png)

lndexFile 总共包含 lndexHeader、 Hash 槽、 Hash 条目

#### 事务状态服务

存储每条消息的事务状态。

#### 定时消息服务

每一个延迟级别对应一个消息消费队列，存储延迟队列的消息拉取进度。

### RMQ文件存储模型层

![](/images/jueJin/16d32bfca82cd29.png)

#### RocketMQ业务处理器层

Broker端对消息进行读取和写入的业务逻辑入口，这一层主要包含了业务逻辑相关处理操作（根据解析RemotingCommand中的RequestCode来区分具体的业务操作类型，进而执行不同的业务处理流程），比如前置的检查和校验步骤、构造MessageExtBrokerInner对象、decode反序列化、构造Response返回对象等。

#### RocketMQ数据存储组件层

*   该层主要是RocketMQ的存储核心类—DefaultMessageStore，其为RocketMQ消息数据文件的访问入口，通过该类的“putMessage()”和“getMessage()”方法完成对CommitLog消息存储的日志数据文件进行读写操作（具体的读写访问操作还是依赖下一层中CommitLog对象模型提供的方法）；
*   另外，在该组件初始化时候，还会启动很多存储相关的后台服务线程，包括AllocateMappedFileService（MappedFile预分配服务线程）、ReputMessageService（回放存储消息服务线程）、HAService（Broker主从同步高可用服务线程）、StoreStatsService（消息存储统计服务线程）、IndexService（索引文件服务线程）等。

#### RocketMQ存储逻辑对象层

*   该层主要包含了RocketMQ数据文件存储直接相关的三个模型类IndexFile、ConsumerQueue和CommitLog。
*   IndexFile为索引数据文件提供访问服务，ConsumerQueue为逻辑消息队列提供访问服务，CommitLog则为消息存储的日志数据文件提供访问服务。
*   这三个模型类也是构成了RocketMQ存储层的整体结构。

#### 封装的文件内存映射层

*   RocketMQ主要采用JDK NIO中的MappedByteBuffer和FileChannel两种方式完成数据文件的读写。
*   其中，采用MappedByteBuffer这种内存映射磁盘文件的方式完成对大文件的读写，在RocketMQ中将该类封装成MappedFile类。
*   这里，每一种类的单个文件均由MappedFile类提供读写操作服务（其中，MappedFile类提供了顺序写/随机读、内存数据刷盘、内存清理等和文件相关的服务）。

#### 磁盘存储层

主要指的是部署RocketMQ服务器所用的磁盘。这里，需要考虑不同磁盘类型（如SSD或者普通的HDD）特性以及磁盘的性能参数（如IOPS、吞吐量和访问时延等指标）对顺序写/随机读操作带来的影响。

### RocketMQ中消息刷盘

在RocketMQ中消息刷盘主要可以分为同步刷盘和异步刷盘两种。

#### 同步刷盘

![](/images/jueJin/16d32a5429ed7cf.png)

*   在返回写成功状态时，消息已经被写入磁盘。
*   具体流程是，消息写入内存的PAGECACHE后，立刻通知刷盘线程刷盘，然后等待刷盘完成，刷盘线程执行完成后唤醒等待的线程，返回消息写成功的状态。
*   一般只用于金融场景。

#### 异步刷盘

![](/images/jueJin/16d32bb9fc5ddf7.png)

在返回写成功状态时，消息可能只是被写入了内存的PAGECACHE，写操作的返回快，吞吐量大；当内存里的消息量积累到一定程度时，统一触发写磁盘操作，快速写入。

### 消息在系统中流转图

![](/images/jueJin/16d32def7cdc69c.png)

1.Producer 发送消息，消息从 socket 进入 java 堆。

2.Producer 发送消息，消息从 java 堆转入 PAGACACHE，物理内存。

3.Producer 发送消息，由异步线程刷盘，消息从 PAGECACHE 刷入磁盘。

4.Consumer 拉消息（正常消费），消息直接从 PAGECACHE（数据在物理内存）转入 socket，到达 consumer， 不经过 java 堆。这种消费场景最多，线上 96G 物理内存，按照 1K 消息算，可以在物理内存缓存 1 亿条消 息。

5.Consumer 拉消息（异常消费），消息直接从 PAGECACHE（数据在虚拟内存）转入 socket。

6.Consumer 拉消息（异常消费），由于 Socket 访问了虚拟内存，产生缺页中断，此时会产生磁盘 IO，从磁 盘 Load 消息到 PAGECACHE，然后直接从 socket 发出去。

7.同 5 一致。

8.同 6 一致。

### 参考与感谢

*   [十分钟入门RocketMQ](https://link.juejin.cn?target=http%3A%2F%2Fjm.taobao.org%2F2017%2F01%2F12%2Frocketmq-quick-start-in-10-minutes%2F "http://jm.taobao.org/2017/01/12/rocketmq-quick-start-in-10-minutes/")
*   [分布式消息系列：详解RocketMQ的简介与演进、架构设计、关键特性及应用场景](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F0e795f096bb9 "https://www.jianshu.com/p/0e795f096bb9")
*   [RocketMQ消息存储](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Ffanguangdexiaoyuer%2Fp%2F10496112.html "https://www.cnblogs.com/fanguangdexiaoyuer/p/10496112.html")
*   《RocketMQ 原理简介》

### 个人公众号

![](/images/jueJin/16c381c89b127bb.png)

欢迎大家关注，大家一起学习，一起讨论。