---
author: "JavaSouth南哥"
title: "因为不懂Redis集群，我被diss了"
date: 2024-08-01
description: "Redis官方在官网里写着霸气的宣传语：从构建者那里获取世界上最快的内存数据库Gettheworld’sfastestin-memorydatabasefromtheoneswho"
tags: ["后端","Java"]
ShowReadingTime: "阅读7分钟"
weight: 597
---
> _点赞再看，Java进阶一大半_

Redis官方在官网里写着霸气的宣传语：从构建者那里获取世界上最快的内存数据库`Get the world’s fastest in-memory database from the ones who built it`。南哥相信国内没用Redis的科技公司也屈指可数。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fb2462e227194781ac30182288c8852a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727426769&x-signature=YpyCtQXk9WIwkydx8RfP9sr993s%3D)

现在Redis已经走向了商业化，它所属的公司叫`Redis Ltd`。不过可惜的是Redis创始人`Salvatore Sanfilippo`在2020年就离开了`Redis Labs`，那个留着乱糟糟黑色头发的中年男人就是Redis的创始人。

Redis的商业推广仍在继续着，今年8月29号新加坡就有Redis演讲活动，大家要去现场看看嘛。

大家好，我是南哥。

一个Java学习与进阶的领路人，相信对你通关面试、拿下Offer进入心心念念的公司有所帮助。

**历史精彩文章推荐**

[面试官没想到一个ArrayList，我都能跟他扯半小时](https://juejin.cn/post/7396934542958739467 "https://juejin.cn/post/7396934542958739467")

[《我们一起进大厂》系列-Zookeeper基础](https://juejin.cn/post/7395127149912227859 "https://juejin.cn/post/7395127149912227859")

[再有人问你WebSocket为什么牛逼，就把这篇文章发给他！)](https://juejin.cn/post/7388025457821810698 "https://juejin.cn/post/7388025457821810698")

[全网把Kafka概念讲的最透彻的文章，别无二家](https://juejin.cn/post/7386967785091514387 "https://juejin.cn/post/7386967785091514387")

[可能是最漂亮的Java I/O流详解](https://juejin.cn/post/7391699600761274394 "https://juejin.cn/post/7391699600761274394")

1\. Redis集群
-----------

### 1.1 集群概念

> _**面试官：我看你简历写了Redis集群，你说一说？**_

Redis主从架构和Redis集群架构是两种不同的概念，大家刚接触Redis时经常弄混淆。南哥给大家贴下Redis官网对两者的解释。

（1）Redis主从架构

> Redis主从实现了有一个易于使用和配置的领导者跟随者复制，它允许副本 Redis 实例成为主实例的精确副本。

（2）Redis集群架构

> Redis 集群将数据自动分片到多个 Redis 节点，Redis 集群还在分区期间提供一定程度的可用性，当某些节点发生故障或无法通信时，Redis集群能够继续运行。

它们两者都是Redis**高可用的解决方案**，但偏向点不同。Redis主从对数据的完整性更看重，Redis主从节点都保存了完整的一套数据库状态。

而Redis集群则对抗压能力更看重，整个集群的数据库整合起来才是一个完整的数据库。

在功能性上它们也有不同，Redis主从有哨兵，而Redis集群有分片。我们要看业务选择不同的Redis方案，当然，Redis集群还可以搭配Redis主从一起使用，我们可以在某一个集群节点上配置一套主从模型。

如果要6002、6003节点添加到6001节点的Redis集群里，我们可以使用以下命令。

shell

 代码解读

复制代码

`127.0.0.1:6001＞ CLUSTER MEET 127.0.0.1 6002 OK 127.0.0.1:6001＞ CLUSTER MEET 127.0.0.1 6003 OK`

### 1.2 集群分片

> _**面试官：那Redis集群怎么实现负载均衡的？**_

大家要记住Redis集群一个很重要的知识点，那就是分片。

Redis集群通过分片的方式来保存数据库中的键值对，Redis集群把整个数据库分为**16384**个槽，而集群中的每个节点可以处理这里面的0个或最多16384个槽。

假如南友们在公司里配置了一个包含 3 个节点的集群，那么这3个节点的槽分配会是这样的：

*   节点 A 包含从 0 到 5500 的哈希槽。
*   节点 B 包含从 5501 到 11000 的哈希槽。
*   节点 C 包含从 11001 到 16383 的哈希槽。

那这样分片有什么作用？

大家想一想，有了分片，我们对某一个键值对的增删改查就会在三个集群节点中的其中一个进行，这样对Redis的各种操作也就**负载均衡**地下落到各个集群的节点中。

### 1.3 重新分片

> _**面试官：要是热点数据都是某个Redis节点的槽，负载均衡不是没用了？**_

Redis集群甚至可以在线上环境直接执行**重新分片**功能，分片是不是很灵活呢？南哥给Redis点赞。

Redis官网对分片是这么解释的。

> Moving hash slots from a node to another does not require stopping any operations; therefore, adding and removing nodes, or changing the percentage of hash slots held by a node, requires no downtime.
> 
> 将哈希槽从一个节点移动到另一个节点不需要停止任何操作；因此，添加和删除节点，或更改节点持有的哈希槽百分比，不需要停机。

Redis集群重新分片可以将任意数量已指派给某个节点的槽改为指派给另一个节点，而相关槽所属的键值对也会从源节点被移动到目标节点。重新分片操作也不需要集群节点下线，源节点和目标节点也都可以继续处理命令请求。

要是小伙伴遇到热点数据都精确命中了Redis集群的某一个节点，赶快在线上环境紧急重新分片，把相关热点槽**指派**给其他节点处理，这也是一个不错的选择。

2\. 集群的主从模型
-----------

### 2.1 主从模型

> _**面试官：Redis集群的主从模型，知道吗？**_

还记得上文南哥提到过可以给Redis集群的某一个节点配置主从模型吗？

Redis集群把键值都分散在多个集群节点中，这也有缺点。例如某一个节点失效了，那这个节点里所有槽的键值对也都无法访问了。Redis官方当然也知道，主从模型可以让集群节点有1~N个副本节点。

像上文的Redis集群的A、B、C三个节点，主从模型可以为这每一个主节点添加一个副本节点。这样的话集群就变成了由A、B、C、A1、B1、C1组成，例如当A节点失效了，那它的副本节点A1就会提升为新的主节点。

主从模型也有另外的好处，我们可以让主节点用于处理槽，而副本节点用来分担**读的压力**。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/274fc718f44c432881bfae6e5e79548d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727426769&x-signature=b7NB7sdKK754BDEqOvqehzb9h7o%3D)

> 为集群B节点添加B1、B2副本节点

### 2.2 主节点选举

> _**面试官：那集群里怎么选举主节点的？**_

Redis集群的主从模型选举主节点和Redis哨兵选举出主节点非常相似，但大家不要搞混了，Redis集群中并没有哨兵的概念。

主从模型选举主节点和**哨兵**选举领头哨兵一样是先到先得，而且它们投票的对象是**集群中的其他主节点**。

选举的流程如下。

（1）当从节点发现主节点进入下线状态时，会广播一条`CLUSTERMSG_TYPE_FAILOVER_AUTH_REQUEST`消息，要求其他集群主节点向改从节点进行投票。

（2）投票遵循先到先得的规则，集群主节点会投票给第一个发送选举信息的该从节点，返回一条`CLUSTERMSG_TYPE_FAILOVER_AUTH_ACK`消息。

（3）如果集群主节点的个数是N，当某个从节点收到大于等于`N / 2 + 1`张支持票时，代表该从节点获胜，该从节点也将成为新的主节点。

本文收录在我开源的《Java学习进阶指南》中，涵盖了在大厂工作的Javaer都不会不懂的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫，南哥希望收到大家的 ⭐ Star ⭐支持我完善下去。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0d8f2f253dea4670a394c13a2e64b135~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727426769&x-signature=1ePUFP18lVzYHUsZjyQsdY%2BxYHs%3D)

欢迎关注南哥的公众号：**Java进阶指南针**。公众号里有南哥珍藏整理的大量优秀pdf书籍！

我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️