---
author: "政采云技术"
title: "CAP 原则之 ZK 和 Eureka 注册中心"
date: 2023-04-27
description: "分布式 CAP 原则与 BASE 理论 CAP CAP 是 Consistency、Availablity、Partition-tolerance 的缩写，由计算机科学家埃里克·布鲁尔在 2000 年"
tags: ["分布式","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:11,comments:5,collects:15,views:3974,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![田七.png](/images/jueJin/d709cb817d3d4a3.png)

分布式 CAP 原则与 BASE 理论
-------------------

### CAP

CAP 是 Consistency、Availablity、Partition-tolerance 的缩写，由计算机科学家埃里克·布鲁尔在 2000 年提出的，所以又称布鲁尔定理 （Brewer’s theorem），它指出对于一个分布式计算系统来说，不可能同时满足以下三点

**Consistency（一致性）** ：如果对任意一个节点的数据就行修改成功后，所有其他节点都能读取到最新的值，那么这个系统就被认为具有严格的一致性。

**Availability（可用性）** ：每次请求都能获取到非错的响应，即单节点宕机可从其他节点获取到响应，但是不能保障获取到的数据为最新的数据，即和一致性互斥

**Partition tolerance（分区容错性）** ：当节点间出现网络分区（不同节点处于不同的子网络，子网络之间是联通的，但是子网络之间是无法联通的，也就是被切分成了孤立的集群网络），照样可以提供满足一致性和可用性的服务，除非整个网络环境都发生了故障。

任何一个分布式系统只能满足三选二，即只能 AP 或 CP，必须要有 P 。

![img](/images/jueJin/f96ca61e7c99462.png)

#### 为什么 CAP 只能达到 CP 或者 AP？

CAP 认为分布式环境下网络的故障是常态，比如我们多机房部署下机房间就可能发生光缆被挖断、专线故障等网络分区情况（导致部分节点无法通信，原本一个大集群变成多个独立的小集群），也可能出现网络波动、丢包、节点宕机等，所以分布式系统设计要考虑的是在满足 P 的前提下选择 C 还是 A。

抛开严谨的学术证明我们设想工作中的例子：我们要开发一个分布式缓存服务，只提供简单的读取与写入功能，服务支持多个节点做数据冗余及负载，请求由网关随机分发到其中一个节点，我们必须确保其中一个或几个节点故障时另一些节点仍然可以提供服务，在网络分区形成独立小集群时也可以提供服务，这就必须满足分区容错性（P），我们假设部署了两个服务节点，那么：

如果要保证一致性（C），即所有节点可查询到的数据随时随刻都是一致的（同步中的数据不可查询），就要求一个节点写入数据后必须再将数据写入到另一个节点后才能返回成功，这样当我们读取之前写入的数据时才能确保一致，但上文说明过网络异常在所难免，如果两个服务节点无法相互通讯时为保证一致性在数据写入发现无法同步到另一节点时就会返回错误进而牺牲了可用性（A）。

如果要保证可用性（A），即只要不是服务宕机所有请求都可得到正确的响应，那么在网络异常节点不能通讯的情况下要让数据没有同步到另一节点的请求也返回成功，这就必须牺牲一致性（C）导致在一段时间内（网络异常期间）两个服务节点所查询到的数据可能不同。

所以从中可以简单地发现一致性（C）与可用性（A）是不可能同时满足的。同 FLP Impossibility 一样 CAP 理论也为我们做分布式服务架构指明了方向：分布式系统中我们只能选择 CP（满足一致性牺牲可用性）或 AP（满足可用性牺牲一致性）。

当我们选择 CP，即满足一致性而牺牲可用性时意味着在网络异常出现多个节点孤岛时为了保证各个节点的数据一致系统会停止服务，反之选择 AP，即满足可用性牺牲一致性时网络异常时系统仍可工作，但会出现各节点数据不致的情况。

在我们做微服务架构时需要知道 CAP 并做出架构设计或选型。比如注册中心常用的 Eureka 和 Zookeepr 实现，Eureka 是 AP 的，Zookeeper 是 CP 的，Spring Cloud 之所以推荐 Eureka 是因为它认为注册中心的场景允许出现短暂的数据不一致情况，可用性要高于强一致性，

上面出现了“强一致性”与“弱一致性”两个概念，这其实是对一致性的延展，大量的工程实践的经验表明可用性很重要，一致性也很重要，但可以容许一定的时差，即只要保证在一定时间内达到一致即可，这也就是所谓的最终一致性。要实现强一致性的成本很高，尤其是存在很多数据副本的情况下，区块链的 PoW 及其衍生算法就是典型的代表，它的共识机制是概率强一致性（Probabilistic Strong Consistency），要求等待大多数节点都接受了这笔交易再真正接受它，但是带来的问题是交易的确认严重滞后。

基于此出现了 Base 理论。

### BASE

BASE 是由 Basically Available（基本可用）、Soft state（软状态）、Eventually consistent（最终一致性）缩写而来的。BASE 理论是对 CAP 中的一致性和可用性进行一个权衡的结果，理论的核心思想就是：我们无法做到强一致，但每个应用都可以根据自身的业务特点，采用适当的方式来使系统达到最终一致性，让 CAP 三者同时基本实现。

**Basically Available**：基本可用，就是在某个节点宕机或者发生网络分区的情况，可以让所有请求都强制走主节点，这样保证了数据的一致性可可用性，如果主节点压力比较大可以触发降级熔断机制等，或者限流等，让原先 0.5 秒响应的请求以更长的时间去相应

**Soft state**：软状态相对原子性来说各个要求都有所降低，原子性（硬状态），要求多个节点的数据副本都是一致的,这是一种"硬状态"。软状态（弱状态）允许系统中的数据存在中间状态,并认为该状态不影响系统的整体可用性,即允许系统在多个不同节点的数据副本存在数据延迟

**Eventually consistent**：最终一致性，一致性也分强一致性和弱一致性，而最终一致性属于弱一致性，就是系统并不保证连续进程或者线程的访问都会返回最新的更新过的值。系统在数据写入成功之后，不承诺立即可以读到最新写入的值，也不会具体的承诺多久之后可以读到。但会尽可能保证在某个时间级别（比如秒级别）之后，可以让数据达到一致性状态。

基于 zookeeper 实现注册中心(CP)
-----------------------

CP 模式，保证一致性

### zookeeper 集群

zookeeper 集群是一主多从的模式

zookeeper 集群中的节点有三种角色

*   Leader：处理集群的所有事务请求，集群中只有一个 Leader
    
*   Follower：只能处理读请求，参与 Leader 选举
    
*   Observer：只能处理读请求，提升集群读的性能，但不能参与 Leader 选举
    
    ![image-20230412195202526](/images/jueJin/80e529c6ff744c4.png)
    

### ZK 集群的数据同步机制

#### 正常的客户端数据提交流程（zookeeper 集群服务注册订阅）

![image-20230412195251430](/images/jueJin/32086d6d87f346f.png)

步骤：

1、首先集群启动时，会先进行领导者选举，确定哪个节点是 Leader ，哪些节点是 Follower 和 Observer

2、然后 Leader 会和其他节点进行数据同步，采用发送快照和发送 Diff 日志的方式

3、集群在工作过程中，所有的写请求都会交给 Leader 节点来进行处理，从节点只能处理读请求

4、Leader 节点收到一个写请求时，会通过两阶段机制来处理

5、Leader 节点会将该写请求对应的日志发送给其他 Follower 节点，并等待 Follower 节点持久化日志成功

6、Follower 节点收到日志后会进行持久化，如果持久化成功则发送一个 Ack 给 Leader 节点

7、当 Leader 节点收到半数以上的 Ack 后，就会开始提交，先更新 Leader 节点本地的内存数据

8、然后发送 commit 命令给 Follower 节点， Follower 节点收到 commit 命令后就会更新各自本地内存数据

9、同时 Leader 节点还是将当前写请求直接发送给 Observer 节点， Observer 节点收到 Leader 发过来的写请求后直接执行更新本地内存数据

10、最后 Leader 节点返回客户端请求响应成功

**结论：通过同步机制和两阶段提交机制来达到集群中节点数据一致**

#### **节点宕机后的 Leader 选举和数据同步流程**

当 zookeeper 集群中的 Leader 宕机后，会触发新的选举，选举期间，整个集群是没法对外提供服务的。直到选出新的 Leader 之后，才能重新提供服务

![选举](/images/jueJin/a04c8e914cea4d2.png)

步骤：

1、Leader 挂了，zookeeper 集群不可用

2、通过选举，Follower1 成为了 Leader，zookeeper 集群可用

3、原来的 Leader 启动起来了，变成了集群的 Follower5

4、Leader 通过 ZXID 事务 ID 向 Follower5 同步数据，Follower5 可用

**结论：在 zookeeper 选举和同步过程，zookeeper 集群不可用**

#### 结论：

不管是**正常的客户端数据提交流程**还是**节点宕机后的 Leader 选举和数据同步流程**都保证了 zookeeper 集群的一致性，但是在节点宕机后的 Leader 选举和数据同步流程中 zookeeper 集群是不可用的，无法提供可用性，所以 zookeeper 保证了 CP，放弃了 A。

基于 Eureka 实现注册中心(AP)
--------------------

AP 模式保证可用性

### Eureka 集群

eureka 集群中每个节点的角色都一样，都可以提供事务请求和读请求

![image-20230413134807695](/images/jueJin/72bb723bb4ec400.png)

### eureka 服务注册与发现

![image-20230413140129774](/images/jueJin/17c3e3dfaa1643e.png)

步骤：

1、Eureka Server 启动成功，等待服务端注册。在启动过程中如果配置了集群，集群之间定时通过 Replicate 同步注册表，每个 Eureka Server 都存在独立完整的服务注册表信息

2、Eureka Client 启动时根据配置的 Eureka Server 地址去注册中心注册服务

3、Eureka Client 会每 30s 向 Eureka Server 发送一次心跳请求，证明客户端服务正常

4、当 Eureka Server 90s 内没有收到 Eureka Client 的心跳，注册中心则认为该节点失效，会注销该实例

5、单位时间内 Eureka Server 统计到有大量的 Eureka Client 没有上送心跳，则认为可能为网络异常，进入自我保护机制，不再剔除没有上送心跳的客户端

6、当 Eureka Client 心跳请求恢复正常之后，Eureka Server 自动退出自我保护模式

7、Eureka Client 定时全量或者增量从注册中心获取服务注册表，并且将获取到的信息缓存到本地

8、服务调用时，Eureka Client 会先从本地缓存找寻调取的服务。如果获取不到，先从注册中心刷新注册表，再同步到本地缓存

9、Eureka Client 获取到目标服务器信息，发起服务调用

10、Eureka Client 程序关闭时向 Eureka Server 发送取消请求，Eureka Server 将实例从注册表中删除

#### 结论：

Eureka 集群每个节点都相等，都可以提供事务请求和读请求，集群之间定时通过 Replicate 同步注册表并通过心跳检测机制去处理 Client 的上下线，保证了 AP，放弃了 C，这里放弃了一致性，只是说放弃了强一致性，去追求最终一致性

参考文献
----

[《全面解读 CAP 定理》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetflix%2Feureka "https://github.com/Netflix/eureka")

[《ZooKeeper：分布式过程协同技术详解》](https://link.juejin.cn?target=http%3A%2F%2Fwww.17bigdata.com%2Fbook%2Fzookeeper%2Findex.html "http://www.17bigdata.com/book/zookeeper/index.html")

推荐阅读
----

[分布式多级缓存系统设计与实战](https://juejin.cn/post/7225634879152570405 "https://juejin.cn/post/7225634879152570405")

[数据成本量化](https://juejin.cn/post/7223037521424777276 "https://juejin.cn/post/7223037521424777276")

[AKF理论及应用](https://juejin.cn/post/7221183644575711288 "https://juejin.cn/post/7221183644575711288")

[业务系统的Prometheus实践](https://juejin.cn/post/7220439797566292029 "https://juejin.cn/post/7220439797566292029")

[MVCC与数据库锁](https://juejin.cn/post/7215226343713112125 "https://juejin.cn/post/7215226343713112125")

招贤纳士
----

政采云技术团队（Zero），包含前端（ZooTeam）、后端、测试、UED 等，Base 在风景如画的杭州，一个富有激情、创造力和执行力的团队。团队现有500多名研发小伙伴，既有来自阿里、华为、网易的“老”兵，也有来自浙大、中科大、杭电等校的新人。团队在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)