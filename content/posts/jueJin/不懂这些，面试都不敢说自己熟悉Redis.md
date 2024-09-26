---
author: "JavaSouth南哥"
title: "不懂这些，面试都不敢说自己熟悉Redis"
date: 2024-07-23
description: "下面这位就是Redis的创始人，他叫antirez，让我们Java开发者又要多学一门Redis的始作俑者。我们肯定很难想象Redis创始人竟然学的是是建筑专业，而当年antirez是为了帮网站管理员"
tags: ["后端","Java"]
ShowReadingTime: "阅读5分钟"
weight: 618
---
> _点赞再看，Java进阶一大半_

下面这位就是Redis的创始人，他叫antirez，让我们Java开发者又要多学一门Redis的始作俑者。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d78338cc487040a3a5ede95f67fa7277~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727420989&x-signature=%2Bss5iOcEugdxyWTPsG7U0XelrKY%3D)

我们肯定很难想象Redis创始人竟然学的是是建筑专业，而当年antirez是为了帮网站管理员监控访问者的实时行为才开发的Redis。为啥antirez不用MySQL来开发？MySQL并不适用于实时应用程序，存储数据库需要磁盘读写，大量的数据操作会使网站速度过于缓慢。于是Redis的前身LLOOGG就这样诞生了，后期也发展为了Redis。

大家好，我是南哥。

一个Java学习与进阶的领路人，相信对你通关面试进入心心念念的公司有所帮助。

本文收录在我开源的《Java学习进阶指南》中，涵盖了在大厂工作的Javaer都不会不懂的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫，南哥希望收到大家的 ⭐ Star ⭐支持我完善下去。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")。

1\. Redis哨兵
-----------

### 1.1 哨兵作用

> _**面试官：Redis哨兵知道吧？**_

哨兵的含义是什么？我们来看看百度百科的解释。

> 哨兵，汉语词语，是指站岗、放哨、巡逻、稽查的士兵

Redis主从架构也有自己的哨兵，名为Sentinel。Sentinel是什么含义，我们看看英文含义，很遗憾这个英文起名没有什么故事可讲，英文意思还是哨兵。

Redis哨兵本质是一个运行在特殊模式下的Redis服务器，并不是特殊要另外部署的服务模块。哨兵可以是一个，如果公司资金充足的话，部署由多个Sentinel实例组成的哨兵系统也是可以的。

那哨兵有什么作用？

它的主要作用是通过检测Redis主从服务器的下线状态，**选举出新Redis主服务器**，也就是**故障转移**，来保证Redis的高可用性。

### 1.2 检测主从下线状态

> _**面试官：你说说是怎么检测Redis主从服务器的下线状态的？**_

我们先来讲讲哨兵最重要的第一个功能，检测Redis主从服务器下线状态，后面我们再来讲讲故障转移。

哨兵检测主从服务器下线状态有两种方式，分为主观和客观，我们可以给哨兵配置其中一种。

（1）**检测主观下线状态**：默认情况Sentinel会每隔 1 s向Redis主、从服务器发送PING命令，通过PING命令返回的信息来判断Redis主从服务器的下线状态。

（2）**检测客观下线状态**：Sentinl在主观判断下线后，会向其他Sentinel进行询问**是否同意**该节点已下线，当标记下线的**数量足够多**就会判断客观下线。

下面是哨兵们和Redis主从服务器之间藕断丝连的关系。

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a8b4dea719b04dfb927f054cc7f66b2f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727420989&x-signature=PA73qbS6pxzXVMXzR60Y4d%2FoajI%3D)

### 1.3 检测下线状态不一致

> _**面试官：有没有A哨兵判断Redis实例下线，但B哨兵判断Redis实例仍然存活的情况？**_

各个**哨兵的配置**对检测下线的配置不同，可能会产品奇奇怪怪的问题，大家要注意下。

假如我们的A、B两个哨兵配置的是检测主观下线状态，哨兵会判断Redis实例进入主观下线**所需的响应时间长度**。

南哥假设A哨兵的配置是10000毫秒、B哨兵是50000毫秒，但此时Redis实例要在20000毫秒才响应，像这种情况就会发生A哨兵判断Redis实例下线，但B哨兵判断Redis实例仍然存活的情况。

2\. 哨兵选举
--------

### 2.1 选举领头哨兵

> _**面试官：领头哨兵怎么选举出来的？**_

大家注意不要把领头哨兵和Redis主服务器弄混淆了，不然可就尴尬了哈。

南哥先说说领头哨兵的作用，免得大家误解。**领头Sentinel**起到执行故障转移的作用，也就是**选举出新的Redis主服务器**，而且只有当Redis主服务器被判断**客观下线**后才会选举出领头Sentinel。

那领头哨兵要怎么选择出来呢？选举出这个天选之子。

Sentinel哨兵设置局部领头Sentinel的规则是**先到先得**。

最先向**目标Sentinel**发送设置要求的源Sentinel将成为目标Sentinel的**局部领头Sentinel**，而之后接收到的所有设置要求都会被目标Sentinel拒绝。

如果有某个Sentinel被**半数以上**的Sentinel设置成了局部领头Sentinel，那么这个Sentinel就会成为领头Sentinel。

### 2.2 选举Redis主服务器

> _**面试官：知道怎么选举新的Redis主服务器吗？**_

看到这，我来和大家讲讲哨兵最重要的第二个功能：选举出新的Redis主服务器。

（1）领头Sentinel会将已下线Redis主服务器的所有Redis从服务器保存到一个列表里面。

（2）通过**删除策略**，删除所有处于下线或者断线状态的、删除最近五秒内没有回复过领头Sentinel命令的、删除与已下线主服务器连接断开超过10毫秒的。

（3）如果有多个相同优先级的从服务器，将按照**复制偏移量**进行排序选出偏移量最大的，复制偏移量最大也就是数据同步最新的。

（4）最后选出的Redis实例也就成为新的Redis主服务器。

[戳这，《JavaProGuide》作为一份涵盖Java程序员所需掌握核心知识、面试重点的Java学习进阶指南。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/266d493c4c1747aeb65583b2f69bba49~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727420989&x-signature=34usn2w7bfYUqJP4XQjXsFXA%2Brk%3D)

欢迎关注南哥的公众号：Java进阶指南针。我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️