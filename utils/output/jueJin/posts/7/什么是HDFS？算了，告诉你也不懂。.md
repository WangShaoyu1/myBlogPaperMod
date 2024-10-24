---
author: "Java3y"
title: "什么是HDFS？算了，告诉你也不懂。"
date: 2020-03-03
description: "上一篇已经讲解了「大数据入门」的相关基础概念和知识了，这篇我们来学学HDFS。如果文章有错误的地方，不妨在评论区友善指出~ 好比：我调用了一个RPC接口，我给他参数，他返回一个response给我。RPC接口做了什么事其实我都不知道的（可能这个RPC接口又调了其他的RPC接口）…"
tags: ["Java","HDFS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:44,comments:6,collects:50,views:3428,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

上一篇已经讲解了「**大数据入门**」的相关基础概念和知识了，这篇我们来学学HDFS。如果文章有错误的地方，不妨在评论区友善指出~

一、HDFS介绍
--------

上篇文章已经讲到了，随着数据量越来越大，在一台机器上已经无法存储所有的数据了，那我们会将这些数据分配到不同的机器来进行存储，但是这就带来一个问题：**不方便管理和维护**

所以，我们就希望有一个系统可以将这些分布在不同操作服务器上的数据进行**统一管理**，这就有了**分布式文件系统**

*   **HDFS**是分布式文件系统的其中一种（目前用得最广泛的一种）

在使用HDFS的时候是非常简单的：虽然HDFS是将文件存储到不同的机器上，但是我去使用的时候是把这些文件**当做**是存储在一台机器的方式去使用（背后却是多台机器在执行）：

*   好比：我调用了一个RPC接口，我给他参数，他返回一个response给我。RPC接口做了什么事其实我都不知道的（可能这个RPC接口又调了其他的RPC接口）-----**屏蔽掉实现细节，对用户友好**

![HDFS使用](/images/jueJin/16c9eafda9430c3.png)

明确一下：HDFS就是一个**分布式文件系统**，一个文件系统，我们用它来做什么？**存数据呀**。

下面，我们来了解一下HDFS的一些知识，能够帮我们更好地去「使用」HDFS

二、HDFS学习
--------

从上面我们已经提到了，HDFS作为一个分布式文件系统，那么**它的数据是保存在多个系统上的**。例如，下面的图：一个1GB的文件，会被**切分**成几个小的文件，每个服务器都会存放一部分。

![](/images/jueJin/1709b76d33afdb9.png)

那肯定会有人会问：那会切分多少个小文件呢？默认以`128MB`的大小来切分，每个`128MB`的文件，在HDFS叫做**块**(block)

> 显然，这个128MB大小是可配的。如果设置为太小或者太大都不好。如果切分的文件太小，那一份数据可能分布到多台的机器上（寻址时间就很慢）。如果切分的文件太大，那数据传输时间的时间就很慢。
> 
> PS：老版本默认是64MB

一个用户发出了一个`1GB`的文件请求给HDFS客户端，HDFS客户端会根据配置(现在默认是`128MB`)，对这个文件进行切分，所以HDFS客户端会切分为8个文件(也叫做**block**)，然后每个服务器都会存储这些切分后的文件(block)。现在我们假设**每个服务器都存储两份**。

![](/images/jueJin/1709b76d3470fbb.png)

这些存放**真实数据**的服务器，在HDFS领域叫做**DataNode**

![](/images/jueJin/1709b76d37bc1d4.png)

现在问题来了，HDFS客户端按照配置切分完以后，怎么知道往哪个服务器（DataNode）放数据呢？这个时候，就需要另一个角色了，管理者（**NameNode**）。

NameNode实际上就是**管理文件的各种信息**（这种信息专业点我们叫做**MetaData**「元数据」），其中包括：文文件路径名，每个Block的ID和存放的位置等等。

所以，无论是读还是写，HDFS客户端都会先去找**NameNode**，通过NameNode得知相应的信息，再去找DataNode

*   如果是写操作，HDFS切分完文件以后，会询问NameNode应该将这些切分好的block往哪几台DataNode上写。
*   如果是读操作，HDFS拿到文件名，也会去询问NameNode应该往哪几台DataNode上读数据。

![](/images/jueJin/1709b76d38b3a1f.png)

### 2.1 HDFS备份

作为一个分布式系统（把大文件切分为多个小文件，存储到不同的机器上），如果没有备份的话，只要有其中的一台机器挂了，那就会导致「数据」是不可用状态的。

> 写到这里，如果看过我的**Kafka**和**ElasticSearch**的文章可能就懂了。其实思想都是一样的。
> 
> Kafka对partition备份，ElasticSearch对分片进行备份，而到HDFS就是对Block进行备份。
> 
> **尽可能将数据备份到不同的机器上**，即便某台机器挂了，那就可以将备份数据拉出来用。
> 
> 对Kafka和ElasticSearch不了解的同学，可以关注我的[GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")，搜索关键字即可查询（我觉得还算写得比较通俗易懂的）

\*\*注：\*\*这里的备份并不需要HDFS客户端去写，只要DataNode之间互相传递数据就好了。

![](/images/jueJin/1709b76d39e4fc1.png)

### 2.2 NameNode的一些事

从上面我们可以看到，NameNode是需要处理hdfs客户端请求的。（因为它是存储元数据的地方，无论读写都需要经过它）。

现在问题就来了，NameNode是怎么存放元数据的呢？

*   如果NameNode只是把元数据放到内存中，那如果NameNode这台机器重启了，那元数据就没了。
*   如果NameNode将每次写入的数据都存储到硬盘中，那如果**只针对磁盘**查找和修改又会很慢（因为这个是**纯IO**的操作）

说到这里，又想起了Kafka。Kafka也是将partition写到磁盘里边的，但人家是怎么写的？**顺序IO**

NameNode同样也是做了这个事：修改内存中的元数据，然后把修改的信息**append**（追加）到一个名为`editlog`的文件上。

由于append是顺序IO，所以效率也不会低。现在我们增删改查都是走内存，只不过增删改的时候往磁盘文件`editlog`里边追加一条。这样我们即便重启了NameNode，还是可以通过`editlog`文件将元数据恢复。

![](/images/jueJin/1709b76d3a9c94f.png)

现在也有个问题：如果NameNode一直长期运行的话，那`editlog`文件应该会越来越大（因为所有的修改元数据信息都需要在这追加一条）。重启的时候需要依赖`editlog`文件来恢复数据，如果文件特别大，那启动的时候不就特别慢了吗？

的确是如此的，那HDFS是怎么做的呢？为了防止`editlog`过大，导致在重启的时候需要较长的时间恢复数据，所以NameNode会有一个**内存快照**，叫做`fsimage`

> 说到快照，有没有想起Redis的RDB!!

这样一来，重启的时候只需要加载内存快照`fsimage`+部分的`editlog`就可以了。

想法很美好，现实还需要解决一些事：我什么时候生成一个内存快照`fsimage`？我怎么知道加载哪一部分的`editlog`？

> 问题看起来好像复杂，其实我们就只需要一个**定时任务**。
> 
> 如果让我自己做的话，我可能会想：我们加一份配置，设置个时间就OK了
> 
> *   如果`editlog`大到什么程度或者隔了多长时间，我们就把editlog文件的数据跟内存快照`fsiamge`给合并起来。然后生成一个新的`fsimage`，把`editlog`给清空，覆盖旧的`fsimage`内存快照
> *   这样一来，NameNode每次重启的时候，拿到的都是最新的fsimage文件，editlog里边的都是没合并到fsimage的。根据这两个文件就可以恢复最新的元数据信息了。

HDFS也是类似上面这样干的，只不过它不是在NameNode起个定时的任务跑，而是用了一个新的角色：**SecondNameNode**。至于为什么？可能HDFS觉得**合并所耗费的资源太大**了，不同的工作交由不同的服务器来完成，也符合分布式的理念。

![](/images/jueJin/1709b76d5f17876.png)

现在问题还是来了，此时的架构**NameNode是单机**的。SecondNameNode的作用只是给NameNode合并`editlog`和`fsimage`文件，如果NameNode挂了，那client就请求不到了，而所有的请求都需要走NameNode，这导致整个HDFS集群都不可用了。

于是我们需要保证NameNode是高可用的。一般现在我们会通过**Zookeeper**来实现。架构图如下：

![](/images/jueJin/1709b76d60a53d4.png)

主NameNode和从NameNode需要保持元数据的信息一致（因为如果主NameNode挂了，那从NameNode需要顶上，这时从NameNode需要有主NameNode的信息）。

所以，引入了Shared Edits来实现主从NameNode之间的同步，Shared Edits也叫做**JournalNode**。实际上就是主NameNode如果有更新元数据的信息，它的`editlog`会写到JournalNode，然后从NameNode会在JournalNode读取到变化信息，然后同步。从NameNode也实现了上面所说的SecondNameNode功能（合并editlog和fsimage）

![](/images/jueJin/1709b76d63ba276.png)

稍微总结一下：

*   NameNode需要处理client请求，它是存储元数据的地方
*   NameNode的元数据操作都在内存中，会把增删改以`editlog`持续化到硬盘中（因为是顺序io，所以不会太慢）
*   由于`editlog`可能存在过大的问题，导致重新启动NameNode过慢（因为要依赖`editlog`来恢复数据），引出了`fsimage`内存快照。需要跑一个定时任务来合并`fsimage`和`editlog`，引出了`SecondNameNode`
*   又因为NameNode是单机的，可能存在单机故障的问题。所以我们可以通过Zookeeper来维护主从NameNode，通过JournalNode(Share Edits)来实现主从NameNode元数据的一致性。最终实现NameNode的高可用。

### 2.3 学点DataNode

从上面我们就知道，我们的数据是存放在DataNode上的（还会备份）。

如果某个DataNode掉线了，那HDFS是怎么知道的呢？

DataNode启动的时候会去NameNode上注册，他俩会维持**心跳**，如果超过时间阈值没有收到DataNode的心跳，那HDFS就认为这个DataNode挂了。

还有一个问题就是：我们将Block存到DataNode上，那还是有可能这个DataNode的磁盘**损坏了部分**，而我们DataNode没有下线，但我们也不知道损坏了。

一个Block除了存放数据的本身，还会存放一份元数据（包括数据块的长度，块数据的校验和，以及时间戳）。DataNode还是会**定期**向NameNode上报所有当前所有Block的信息，通过**元数据就可校验当前的Block是不是正常状态**。

最后
--

其实在学习HDFS的时候，你会发现很多的思想跟之前学过的都类似。就比如提到的Kafka、Elasticsearch这些常用的分布式组件。

如果对Kafka、Elasticsearch、Zookeeper、Redis等不了解的同学，可以在我的GitHub或公众号里边找对应的文章哦~我觉得还算写得通俗易懂的。

改天整合一下这些框架的持久化特点，再写一篇（因为可以发现，他们的持久化机制都十分类似）

下一篇无意外的话，会写写MapReduce，**感谢你看到这里**。

参考资料：

*   [HDFS漫画](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485134%26idx%3D1%26sn%3De06f0bc13e7326b94d770ef4616516a8%26chksm%3Debd747cfdca0ced9dd22443ab25d38e7ae51cb5515d38cbdf35c2796325d025b2a26445c831a%26token%3D1230572157%26lang%3Dzh_CN%23%23%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247485134&idx=1&sn=e06f0bc13e7326b94d770ef4616516a8&chksm=ebd747cfdca0ced9dd22443ab25d38e7ae51cb5515d38cbdf35c2796325d025b2a26445c831a&token=1230572157&lang=zh_CN###rd")
*   《从零开始学大数据 -李智慧》

如果大家想要**实时**关注我更新的文章以及分享的干货的话，可以关注我的公众号「**Java3y**」。

*   🔥**Java精美脑图**
*   🔥**Java学习路线**
*   🔥**开发常用工具**

在公众号下回复「**888**」即可获取！！

![](/images/jueJin/1709b76d7f16c53.png)

> **本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")
> 
> **求点赞** **求关注️** **求分享👥** **求留言💬** 对我来说真的 **非常有用**！！！