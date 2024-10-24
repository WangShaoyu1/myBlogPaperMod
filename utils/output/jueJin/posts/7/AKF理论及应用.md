---
author: "政采云技术"
title: "AKF理论及应用"
date: 2023-04-13
description: "AKF 立方体也叫做 AKF Scala Cube，它在《The Art of Scalability》一书中被首次提出，旨在提供一个系统化的扩展思路。在分布式系统中，AKF 理论非常重要"
tags: ["分布式","微服务中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:7,comments:1,collects:4,views:4142,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![路杭.png](/images/jueJin/adb073d8bd3f4b7.png)

什么是AKF
======

AKF 立方体也叫做 AKF Scala Cube，它在《The Art of Scalability》一书中被首次提出，旨在提供一个系统化的扩展思路。在分布式系统中，AKF 理论非常重要，因为分布式系统需要处理大量的数据和请求，同时还需要保证系统的可用性和容错性。AKF 理论提供了一些关键的原则和实践，可以帮助开发人员和架构师设计和开发出更加可靠和高效的分布式系统。 我们日常见到的各种系统扩展方案，都可以归结到 AKF 立方体的这三个维度上。而且，我们可以同时组合这 3 个方向上的扩展动作，使得系统可以近乎无限地提升性能。 ![AKF_Scale_Cube_Explained.jpg](/images/jueJin/aaba087c672e458.png)

AKF Scale Cube 的核心是三个简单的轴，每个轴都有一个与可伸缩性相关的规则。多维数据集是表示从最小规模(多维数据集的左下前方)到近乎无限可伸缩性(多维数据集的右上后方)的路径的好方法。有时候，在没有立方体的限制空间的情况下，更容易看到这三个轴。 ![AKF.png](/images/jueJin/011cbfd23e26483.png)

**AKF 把系统扩展分为以下三个维度：**

*   X 轴：服务和数据的水平复制和克隆
*   Y 轴：功能拆分
*   Z 轴：数据或服务分区 ( Sharding / Pods )

X轴-水平复制
-------

**常见的 X 轴扩展的方式：**

*   Web层：复制 Web 服务器和负载平衡。
*   应用层：将会话存储在浏览器或单独的对象缓存中，以独立于应用层进行水平扩展。
*   数据库层：将只读副本用于报告、搜索等只读使用情形。

### 应用扩展

对于应用程序来说 X 轴伸缩即可以解决系统中的单点问题，又可以提升系统系能。主要方式为在负载均衡器后面运行应用程序的多个副本，如果有 N 个副本，则每个副本处理负载的 1/N。这是一种简单、常用的扩展应用程序程序容量和可用性的的方法。X 轴扩展的一个好处是，它通常在技术上易于实现，而且从事务的角度来看，它具有很好的伸缩性。 实现 X 轴的障碍包括与会话相关的繁重信息，这些信息通常难以分发或需要持久化到服务器这可能导致可用性和可伸缩性问题，此外，随着事务量的增加，缓存往往会在多个级别上降级。这种方法的另一个问是，它没有解决日益增加的开发和应用程序复杂性的问题。

![AKF_X_服务水平扩展.png](/images/jueJin/d4816b1d85d4497.png)

### 数据库扩展

对于数据存储类（数据库，MQ，缓存）的应用，X 轴扩展主要为解决数据单点问题，提升数据安全性。主要方式为主从模式，即设置多个副本，在主节点出现故障时主从切换进行故障转移，保证系统可用性和数据的安全。也有一些方案为客户端对多个节点进行双写，节点之间不需要进行数据同步，没有主从之分，但是此种方案会增加客户端的复杂度，而且数据一致性也需要客户端来负责，在实际开发中应用较少。

![数据_x.png](/images/jueJin/65a6fe3435d44e4.png)

### 特点

**优点:**

*   **简单：** 易于实施。
*   **快速：** 通常实现起来非常快。
*   **事务可伸缩性：** 很好地扩展事务。

**缺点：**

*   **存储：** 可能非常昂贵。
*   **成本可扩展性：** 多个数据集。
*   **复杂性：** 不能解决不断增加的开发和应用程序复杂性问题，要解决这些问题，我们需要应用Y轴缩放。

Y轴-功能拆分
-------

### 应用扩展

与 X 轴和 Z 轴不同，X 轴和 Z 轴由多个相同的应用程序副本组成，而 Y 轴扩展将应用程序拆分为多个不同的服务。每个服务负责一个或多个密切相关的功能。每个服务实现一组相关功能，如订单管理、客户管理、库存等。此外，每个服务都应该有自己的非共享数据，以确保高可用性和故障隔离。 此外，由于 Y 轴允许团队划分代码和数据的所有权，因此提高了组织的可伸缩性。随着数据和服务被适当地拆分，数据被分配给由相对较少事务访问的较小数据集，高速缓存命中率应该会增加。运营成本通常会降低，因为可以将系统规模缩小到商用服务器，或者可以使用较小的 IaaS 实例。 有几种不同的方法可以将应用程序分解为服务。一种方法是使用基于动词的分解并定义实现单个用例的服务，如结账。另一种选择是按名词分解应用程序，并创建负责特定实体(如客户管理)相关的所有操作的服务。应用程序可以结合使用基于动词和基于名词的分解。 ![AKF-Y-服务拆分.png](/images/jueJin/4fb7b4dfa5cc478.png)

### 数据库扩展

Y 轴扩展主要为对业务进行拆分，对应在数据存储类应用一方面表现为不同的业务使用不同的数据存储，如不同的数据库，不同的 Redis等，另一方面也体现在存储类自身的设计中，同一个业务模块根据不同的功能进行更细粒度的拆分，进行如同一个 DB 中不同的库或表，Redis 中不同的 Key，MQ 中不同的 Topic 等。 ![DB_Y.png](/images/jueJin/35cc1057a693451.png)

### 特点

**优点：**

*   **缓存：** 增加缓存命中率。
*   **可用性：** 可实现故障隔离。

**缺点：**

*   **难点：** 可能需要时间来设计架构。
*   **复杂性：** 拆分为更多的服务。

Z轴 - 分片
-------

### 应用扩展

应用程序在使用 Z 轴伸缩时，每个服务器都运行相同的代码副本。在这方面，它类似于 X 轴缩放。最大的区别在于，每台服务器只负责数据的一个子集。系统的某个组件负责将每个请求路由到适当的服务器。路由器将每个内容项分发到适当的分区，并在那里对其进行索引和存储。查询聚合器将每个查询发送到所有分区，并组合来自每个分区的结果。一个常用的路由标准是请求的属性，例如被访问的实体的主键。另一个常见的路由标准是客户类型。例如，应用程序可能通过将付费客户的请求路由到另一组容量更大的服务器来为付费客户提供比免费客户更高的 SLA。

![AKF-Z-拆分.png](/images/jueJin/d85706c95a6c4b6.png)

### 数据库扩展

Y 轴处理不同事物的分割(通常沿着名词或动词边界)，而 Z 轴则处理“相似”事物的分割。Z 轴拆分通常用于扩展数据库，将数据分片在一组服务器中（数据库的分库分表，Redis Cluster）。如根据 UserID 区间或取模进行拆分，或根据地理边界来划分客户。产品目录可以按SKU 拆分，内容可以按 Content\_ID 拆分。Z 轴扩展提高了事务的可伸缩性，并在故障隔离时提高了解决方案的可用性。由于部署到服务器的软件在每个 Z 轴碎片中本质上是相同的(但数据是不同的)，因此组织的可伸缩性没有增加。数据集越小，缓存命中率越高，而运营成本通常会下降，因为可以使用商用服务器或较小的 IaaS 实例。

![数据_Z.png](/images/jueJin/a8e70224c6e0436.png)

### 特点

**优点：**

*   每个服务器只处理数据的一个子集，这提高了缓存利用率，并减少了内存使用和I/O流量。
*   它还提高了事务可伸缩性，因为请求通常分布在多个服务器上。
*   改进了故障隔离，因为故障仅使中的部分数据可访问。
*   延迟：缩短响应时间。

**缺点：**

*   增加了应用程序的复杂性。
*   我们需要实现分区方案，这可能很棘手，特别是当我们需要对数据进行重新分区时。
*   不能解决不断增加的开发和应用程序复杂性问题。要解决这些问题，我们需要应用Y轴缩放。

AKF应用
=====

Kafka
-----

### 拆分方案

设想一下自己实现一个 MQ 要怎么做？ 【 Y轴扩展 - Topic 】所有业务的消息都放在一起然后根据 Message Type 区分业务？这样所有的生产者和消费者都是用相同的消息队列，这样一方面会增加生产者和消费者的复杂性，而且消费者还要消费很多不关心的业务，如何优化？ 我们的 MQ 可以支持多个消息队列，每个业务模块都使用自己单独的队列，这一个个单独的队列，就对应 Kafka 的 Topic。 【 Z轴扩展 - Partition 】随着业务的激增，消息量激增，单机已经无法支撑，如何优化 MQ 来支撑？ 我们可以将 MQ 扩展至多个服务器，每个服务器服务负责 Topic 的一部分数据。对数据进行拆分由多台服务器进行处理，每一部分就对应 Kafka 中 Topic 的 Partition。 【 X轴扩展 - Leader/Follower 】随着 MQ 的运行，势必会遇到某些故障，导致服务器掉线，那么就会导致该服务器上的数据丢失，对业务造成严重的影响，如何规避这种问题？ 我们可以将每个 Partition 的数据在其他服务器进行备份，当服务器因为各种原因导致掉线时，可以使用其他服务器上的备份数据，从而避免数据的丢失，对应的就是 Kafka 中 Partition Leader 和 Partition Follower。

![kafka.png](/images/jueJin/40ed926094ff4cf.png)

Kafka 集群以 Topic 形式负责分类集群中的 Record，每一个 Record 属于一个Topic。

每个 Topic 底层都会对应一组分区的日志用于持久化 Topic 中的 Record。同时在 Kafka 集群中，Topic 的每一个日志的分区都一定会有 1个 Partition 担当该分区的 Leader，其他的 Partition 担当该分区的 Follower。Leader 负责分区数据的读写操作，Follower 负责同步记录分区的数据。这样如果分区的 Leader 宕机，该分区的其他 Follower 会选取出新的 Leader 继续负责该分区数据的读写，其中集群的中 Leader 的监控和 Topic 的部分元数据是存储在 Zookeeper 中。

类比于 AKF 设计原则，Topic 就相当于沿 Y 轴进行的功能划分，而分区就是沿 Z 轴进行数据分片分区，X 轴就是 Partition 副本划分。

0.  AKF 原则中 Y 轴一般是基于功能进行划分的，类比于 Kafka 中的 Topic，一般一个业务订阅一个 Topic；
1.  Z轴 一般是数据分区，类比于 Topic 中的 Partition；
2.  X 轴提供高可用，Kafka 集群为了高可用，可搭建多个 Partition 副本，在主节点的 Partition 上进行 R/W。

### 数据一致性

当 Producer 向 Leader 发送数据时，可以通过 request.required.acks 参数来设置数据可靠性的级别： **【弱一致性】**

> request.required.acks = 1

默认情况，即：Producer 发送数据到 Leader，Leader 写本地日志成功，返回客户端成功；此时 ISR 中的其它副本还没有来得及拉取该消息，如果此时 Leader 宕机了，那么此次发送的消息就会丢失。

> request.required.acks = 0

Producer 不停向 Leader 发送数据，而不需要 Leader 反馈成功消息，这种情况下数据传输效率最高，但是数据可靠性确是最低的。可能在发送过程中丢失数据，可能在 Leader 宕机时丢失数据。

**【强一致性】**

> request.required.acks = -1（all）

Producer 发送数据给 Leader，Leader 收到数据后要等到 ISR 列表中的所有副本都同步数据完成后（强一致性），才向生产者返回成功消息，如果一直收不到成功消息，则认为发送数据失败会自动重发数据。这是可靠性最高的方案，当然，性能也会受到一定影响。

**注意：参数 min.insync.replicas** 如果要提高数据的可靠性，在设置 request.required.acks = -1 的同时，还需参数 min.insync.replicas 配合，如此才能发挥最大的功效。min.insync.replicas 这个参数用于设定 ISR 中的最小副本数，默认值为 1，当且仅当 request.required.acks 参数设置为 -1 时，此参数才生效。当 ISR 中的副本数少于 min.insync.replicas 配置的数量时，客户端会返回异常：

> org.apache.kafka.common.errors.NotEnoughReplicasExceptoin: Messages are rejected since there are fewer in-sync replicas than required。

不难理解，如果 min.insync.replicas 设置为 2，当 ISR 中实际副本数为 1 时（只有 Leader），将无法保证可靠性，此时拒绝客户端的写请求以防止消息丢失。

Redis
-----

Redis 的特点：单机，单实例，单进程，这些特点会有如下问题：

*   单点故障
*   数据容量有限
*   性能压力（CPU，网络）

这三点正好对应 AKF 的三个 XYZ 轴进行优化

### 拆分方案

### ![redis_x.png](/images/jueJin/5d799e38784440c.png)

![redis_y.png](/images/jueJin/f1b6033ead174bd.png)

![redis_z.png](/images/jueJin/ddb0cda0d59d4ab.png)

### 数据一致性

AFK 三轴拆分后，引入的数据一致性问题 **【强一致性】**

当客户端对 Redis 进行写的时候，主 Redis 先不返回客户端是否写入成功，而是先去通知副 Redis 同步复制写入，主 Redis 在阻塞等待着，直到数据全部一致，主 Redis 再返回客户端写入成功。 客户端可以使用 WAIT 命令来请求同步复制某些特定的数据。但是，WAIT 命令只能确保在其他 Redis 实例中有指定数量的已确认的副本：在故障转移期间，由于不同原因的故障转移或是由于 Redis 持久性的实际配置，故障转移期间确认的写入操作可能仍然会丢失。这是通过同步方式达成的强一致性，但是强一致性的缺陷也很明显，只要有一个 Redis 的网络通信不好，就会导致所有的写入失败，所以强一致性极容易破坏可用性。简单说，我用你了，但你不太好用，或者根本不能用。

**【弱一致性】**

只要主 Redis 写入成功，就直接和客户端说返回成功了，然后副 Redis 异步复制写入 Redis 数据； Redis 使用默认的异步复制，其特点是低延迟和高性能，是绝大多数 Redis 用例的自然复制模式。但是，从 Redis 服务器会异步地确认其从主 Redis 服务器周期接收到的数据量。这是通过异步方式达成弱一致性，但是弱一致性的缺陷在于，有可能主 Redis 写入成功，但是副Redis 没有成功写入，就导致副 Redis 丢失部分数据。 **【最终一致性】**

为了解决弱一致性问题，可以在主 Redis 和众多副 Redis 中搭建 Kafka 等中间件去解决问题。主 Redis 和 Kafka 是阻塞的，主Redis 必须等 Kafka 返回成功才可以向客户端返回成功。而 Kafka 中的数据从 Redis 自己从中去取，然后写入库中。

**【其他思路】**

[RedRock](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fszstonelee%2Fredrock "https://github.com/szstonelee/redrock") 是一个 100% 兼容 Redis 且支持数据扩大到磁盘的开源应用。Redis 的持久化不论是 AOF 还是 RDB 都只是数据的备份，只能用来进行 Redis 数据恢复。 换个思路，如果本地存储的数据支持以 Key 的方式进行查询，数据实时进行持久化本地或者冷数据进行持久化。 RedRock 就是此方式，在 Redis 基础上增加 RocksDB，支持通过 Key 查询磁盘，热数据在内存保证访问速度，冷温数据在磁盘并且支持实时读写。

参考
==

*   [The Scale Cube](https://link.juejin.cn?target=https%3A%2F%2Fakfpartners.com%2Fgrowth-blog%2Fscale-cube "https://akfpartners.com/growth-blog/scale-cube")
*   [Splitting Applications Or Services For Scale](https://link.juejin.cn?target=https%3A%2F%2Fakfpartners.com%2Fgrowth-blog%2Fsplitting-applications-or-services-for-scale "https://akfpartners.com/growth-blog/splitting-applications-or-services-for-scale")
*   [Splitting Databases For Scale](https://link.juejin.cn?target=https%3A%2F%2Fakfpartners.com%2Fgrowth-blog%2Fsplitting-databases-for-scale "https://akfpartners.com/growth-blog/splitting-databases-for-scale")
*   [Redis Replication](https://link.juejin.cn?target=https%3A%2F%2Fredis.io%2Ftopics%2Freplication "https://redis.io/topics/replication")

推荐阅读
----

[业务系统的Prometheus实践](https://juejin.cn/post/7220439797566292029 "https://juejin.cn/post/7220439797566292029")

[MVCC与数据库锁](https://juejin.cn/post/7215226343713112125 "https://juejin.cn/post/7215226343713112125")

[浅谈“分布式锁”](https://juejin.cn/post/7213362932423245861 "https://juejin.cn/post/7213362932423245861")

[浅析基于Spring Security 的身份认证流程](https://juejin.cn/post/7212616585768714299 "https://juejin.cn/post/7212616585768714299")

[MySQL - InnoDB 内存结构解析](https://juejin.cn/post/7210028235621974071 "https://juejin.cn/post/7210028235621974071")

招贤纳士
----

政采云技术团队（Zero），包含前端（ZooTeam）、后端、测试、UED 等，Base 在风景如画的杭州，一个富有激情、创造力和执行力的团队。团队现有500多名研发小伙伴，既有来自阿里、华为、网易的“老”兵，也有来自浙大、中科大、杭电等校的新人。团队在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/64412602cc6c4f3.png)