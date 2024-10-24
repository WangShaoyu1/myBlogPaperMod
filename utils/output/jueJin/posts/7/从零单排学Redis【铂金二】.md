---
author: "Java3y"
title: "从零单排学Redis【铂金二】"
date: 2018-12-04
description: "Redis提供了哨兵(Sentinal)机制供我们解决上面的情况。如果主服务器挂了，我们可以将从服务器升级为主服务器，等到旧的主服务器(挂掉的那个)重连上来，会将它(挂掉的主服务器)变成从服务器。 主服务器挂了，主从复制操作就中止了，并且哨兵系统是可以察觉出主服务挂了。： 这篇…"
tags: ["服务器","Redis","后端","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:42,views:1355,"
---
前言
==

> 只有光头才能变强

好的，今天我们要上【铂金二】了，如果还没有上铂金的，赶紧先去蹭蹭经验再回来(**不然不带你上分了**)：

*   [从零单排学Redis【青铜】](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484359%26idx%3D1%26sn%3D0994c6246990b7ad42a2d3f294042316%26chksm%3Debd742c6dca0cbd0a826ace13f4d4eeff282052f4a97b31654ef1b3b32f991374f5c67a45ae9%26token%3D1834317504%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484359&idx=1&sn=0994c6246990b7ad42a2d3f294042316&chksm=ebd742c6dca0cbd0a826ace13f4d4eeff282052f4a97b31654ef1b3b32f991374f5c67a45ae9&token=1834317504&lang=zh_CN#rd")
*   [从零单排学Redis【白银】](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484386%26idx%3D1%26sn%3D323ddc84dc851a975530090fcd6e2326%26chksm%3Debd742e3dca0cbf52bc65d430447e639d81cc13e0ac34613edf464dae3950b10e2e1df74dcc5%26token%3D1834317504%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484386&idx=1&sn=323ddc84dc851a975530090fcd6e2326&chksm=ebd742e3dca0cbf52bc65d430447e639d81cc13e0ac34613edf464dae3950b10e2e1df74dcc5&token=1834317504&lang=zh_CN#rd")
*   [从零单排学Redis【黄金】](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484391%26idx%3D1%26sn%3D9bd54938ecdced37d69d3ce5bfd65a2e%26chksm%3Debd742e6dca0cbf020b5e1e18b59626ce5d85a3f8de35d8d5b32e7fd5bf0be9dcadb1bb98177%26token%3D544611154%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484391&idx=1&sn=9bd54938ecdced37d69d3ce5bfd65a2e&chksm=ebd742e6dca0cbf020b5e1e18b59626ce5d85a3f8de35d8d5b32e7fd5bf0be9dcadb1bb98177&token=544611154&lang=zh_CN#rd")
*   [从零单排学Redis【铂金一】](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484430%26idx%3D1%26sn%3Dbe69ef08e58dc7559d054221732ee8ee%26chksm%3Debd7450fdca0cc19a4a8cd788161bfdebc0d51abe9989debadd61ba29e3cce6961ebe6093d5b%26token%3D752118079%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484430&idx=1&sn=be69ef08e58dc7559d054221732ee8ee&chksm=ebd7450fdca0cc19a4a8cd788161bfdebc0d51abe9989debadd61ba29e3cce6961ebe6093d5b&token=752118079&lang=zh_CN#rd")

在上篇中抛出了一个问题：

> 抛个问题：如果从服务器挂了，没关系，我们一般会有多个从服务器，其他的请求可以交由没有挂的从服务器继续处理。如果主服务器挂了，怎么办？因为我们的写请求由主服务器处理，只有一台主服务器，那就无法处理写请求了？

Redis提供了**哨兵(Sentinal)机制**供我们解决上面的情况。如果主服务器挂了，我们可以将从服务器**升级**为主服务器，等到旧的主服务器(挂掉的那个)重连上来，会将它(挂掉的主服务器)变成从服务器。

*   这个过程叫做**主备切换**(故障转移)

在正常的情况下，主从加哨兵(Sentinal)机制是这样子的：

![正常情况下](/images/jueJin/1675eb83ba33121.png)

主服务器挂了，主从复制操作就中止了，并且哨兵系统是可以察觉出主服务挂了。：

![Sentinel可以察觉主服务掉线，复制操作中止。](/images/jueJin/16777e4bc6693ea.png)

Redis提供哨兵机制可以将**选举**一台从服务器变成主服务器

![选举一台从服务器变成主服务器](/images/jueJin/16777e4bc6975cf.png)

然后旧的主服务器如果重连了，会变成从服务器：

![旧的主服务器如果重连了，会变成从服务器](/images/jueJin/16777e4bc6e0775.png)

这篇文章主要讲讲Redis的哨兵(Sentinal)机制的一些细节。希望看完对大家有所帮助~

一、哨兵(Sentinal)机制
================

> High Availability: Redis Sentinel is the official high availability solution for Redis.

哨兵(Sentinal)机制主要用于实现Redis的**高可用性**，主要的功能如下：

*   Monitoring. Sentinel constantly checks if your master and slave instances are working as expected.
    *   Sentinel**不停地监控**Redis主从服务器是否正常工作
*   Notification. Sentinel can notify the system administrator, another computer programs, via an API, that something is wrong with one of the monitored Redis instances.
    *   如果某个Redis实例有故障，那么哨兵负责**发送消息通知**管理员
*   Automatic failover. If a master is not working as expected, Sentinel can start a failover process where a slave is promoted to master, the other additional slaves are reconfigured to use the new master, and the applications using the Redis server informed about the new address to use when connecting.
    *   如果主服务器挂掉了，会**自动**将从服务器提升为主服务器(包括配置都会修改)。
*   Configuration provider. Sentinel acts as a source of authority for clients service discovery: clients connect to Sentinels in order to ask for the address of the current Redis master responsible for a given service. If a failover occurs, Sentinels will report the new address.
    *   Sentinel可以作为**配置中心**，能够提供当前主服务器的信息。

下面来具体讲讲Sentinel是如何将从服务器提升为主服务器的。

> tips:Sentinel可以让我们的Redis实现高可用，Sentinel作为这么一个组件，自身也必然是高可用的(**不可能是单点的**)

1.1启动和初始化Sentinel
-----------------

首先我们要知道的是：Sentinel本质上只是一个**运行在特殊模式下的Redis服务器**。因为Sentinel做的事情和Redis服务器是不一样的，所以它们的初始化是有所区别的(比如，Sentinel在初始化的时候并不会载入AOF/RDB文件，因为Sentinel根本就不用数据库)。

然后，在启动的时候会将普通Redis服务器的代码替换成**Sentinel专用代码**。(所以Sentinel虽然作为Redis服务器，但是它不能执行SET、DBSIZE等等命令，因为命令表的代码被替换了)

接着，初始化Sentinel的状态，并根据给定的配置文件**初始化**Sentinel监视的**主服务器列表**。

![初始化](/images/jueJin/16777e4bc6f575a.png)

最后，Sentinel会创建两个**连向主服务器的网络连接**：

*   命令连接(发送和接收命令)
*   订阅连接(订阅主服务器的`_sentinel_:hello`频道)

![创建网络连接](/images/jueJin/16777e4bc70967b.png)

1.2获取和更新信息
----------

Sentinel通过主服务器发送INFO命令来获得主服务器属下所有从服务器的地址信息，并为这些从服务器创建相应的实例结构。

![更新实例结构](/images/jueJin/16777e4bc8c318f.png)

当发现有**新的从服务器出现时**，除了创建对应的从服务器实例结构，Sentinel还会创建命令连接和订阅连接。

![创建连接](/images/jueJin/16777e4c20a584f.png)

在Sentinel运行的过程中，通过命令连接会以每两秒一次的频率向**监视的主从服务器**的`_sentinel_:hello频道`发送命令(主要发送Sentinel本身的信息，监听主从服务器的信息)，并通过订阅连接接收`_sentinel_:hello频道`的信息。

*   这样一来一回，我们就可以**更新每个Sentinel实例结构的信息**。

1.3判断主服务器是否下线了
--------------

判断主服务器是否下线有两种情况：

*   主观下线
    *   Sentinel会以每秒一次的频率向与它创建命令连接的实例(包括主从服务器和其他的Sentinel)**发送PING命令**，通过PING命令返回的信息判断实例是否在线
    *   如果一个**主服务器**在`down-after-milliseconds`毫秒内连续向Sentinel发送**无效回复**，那么当前Sentinel就会**主观认为**该主服务器已经下线了。
*   客观下线
    *   当Sentinel将一个主服务器判断为主观下线以后，为了确认该主服务器是否真的下线，它会向同样监视该主服务器的Sentinel**询问**，看它们是否也认为该主服务器是否下线。
    *   如果**足够多**的Sentinel认为该主服务器是下线的，那么就判定该主服务为客观下线，并对主服务器执行故障转移操作。

> 在多少毫秒内无效回复才认定主服务器是主观下线的，以及有多少个Sentinel认为主服务器是下线才认定为客观下线。这都是**可以配置**的

1.4选举领头Sentinel和故障转移
--------------------

当一个主服务器认为为客观下线以后，监视这个下线的主服务器的各种Sentinel会进行协商，**选举出一个领头的Sentinel**，领头的Sentinel会对下线的主服务器执行故障转移操作。

> 选举领头Sentinel的规则也比较多，总的来说就是**先到先得**(哪个快，就选哪个)

选举出领头的Sentinel之后，领头的Sentinel会对已下线的主服务器执行故障转移操作，包括三个步骤：

*   在已下线主服务器**属下的从服务器中**，挑选一个转换为主服务器
*   让已下线主服务器属下的所有从服务器改为**复制新的主服务器**
*   已下线的主服务器**重新连接时**，让他成为新的主服务器的从服务器
*   (这三步实际上就是文章开头的图片)

挑选某一个从服务器作为主服务器也是有**策略**的，大概如下：

*   （1）跟master断开连接的时长
*   （2）slave优先级
*   （3）复制offset
*   （4）run id

最后
==

这篇文章主要讲解了Sentinel的作用和工作的基本过程(我觉得已经基本OK了)，其中也涉及到了很多的细节，这里我就没有一一整理出来了。想要深入学习的同学最好自己看看书或者文档~~

> tips:目前为止的主从+哨兵架构可以说Redis是高可用的，但要清楚的是：Redis还是会**丢失数据**的

丢失数据有两种情况：

*   异步复制导致的数据丢失
    *   **有部分数据还没复制到从服务器，主服务器就宕机了**，此时这些部分数据就丢失了
*   脑裂导致的数据丢失
    *   有时候主服务器脱离了正常网络，跟其他从服务器不能连接。此时哨兵可能就会**认为主服务器下线了**(然后开启选举，将某个从服务器切换成了主服务器)，但是实际上主服务器还运行着。这个时候，集群里就会有两个服务器(也就是所谓的脑裂)。
    *   虽然某个从服务器被切换成了主服务器，但是可能客户端**还没来得及切换到新的主服务器**，客户端还继续写向旧主服务器写数据。旧的服务器重新连接时，会作为从服务器复制新的主服务器(这意味着旧数据丢失)。

可以通过以下两个配置**尽量**减少数据丢失的可能：

```

min-slaves-to-write 1
min-slaves-max-lag 10

```

从零单排学Redis【铂金三】，敬请期待~

参考资料：

*   《Redis设计与实现》
*   《Redis实战》

如果你觉得我写得还不错，了解一下：

*   坚持**原创**的技术公众号：Java3y。
*   文章的**目录导航**(精美脑图+海量视频资源)：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

![帅的人都关注了](/images/jueJin/167554b3537ce51.png)