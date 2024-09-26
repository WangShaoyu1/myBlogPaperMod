---
author: "tager"
title: "基于node的redis集群配置详解【看完必会】"
date: 2022-03-28
description: "前言关于node中使用redis集群功能，没有找到一篇比较完整且通俗易懂的文章，因此自己在开发调试的过程中也走了不少弯路。本文会详细介绍了在本地如何搭建redis集群、在客户端如何使用集群、在搭建"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读8分钟"
weight: 805
---
前言
--

关于`node`中使用`redis`集群功能，没有找到一篇比较完整且通俗易懂的文章，因此自己在开发调试的过程中也走了不少弯路。

本文会详细介绍了**在本地如何搭建redis集群、在客户端如何使用集群、在搭建过程中遇到的问题和错误汇总并说明**，以避免下次使用的时候再走弯路，提高开发、工作效率。

使用集群的背景是：在Redis单例模式下随着用户量、访问量的提高，qps值急剧上涨👆🏻，大量的`io`操作导致某一时刻占满`cpu(100%)`，随时有宕机的危险，同时通过批量处理redis等方式也是治标不治本，**无法突破服务器性能的瓶颈**。因此使用集群方案或增加redis实例就势在必行。

名词解释--集群
--------

集群一般是指服务器集群，区别于分布式系统，是将很多服务器集中起来一起进行同一种服务，在客户端看来就像是只有一个服务器。集群可以利用多个计算机进行[并行计算](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25B9%25B6%25E8%25A1%258C%25E8%25AE%25A1%25E7%25AE%2597%2F113443 "https://baike.baidu.com/item/%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97/113443")从而获得很高的计算速度，也可以用多个计算机做[备份](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25A4%2587%25E4%25BB%25BD%2F4249315 "https://baike.baidu.com/item/%E5%A4%87%E4%BB%BD/4249315")，从而使得任何一个机器坏了整个系统还是能正常运行。(**在redis3.0之前一般使用的都是** **哨兵模式，但** **哨兵的配置略微复杂，并且性能和高可用性等各方面表现一般**)

redis集群要求
---------

由于投票容错机制要求超过半数节点认为某个节点挂了该节点才是挂了，所以2个节点无法构成集群，因此Redis集群至少需要3个节点。

要保证集群的高可用、需要每个节点都有从节点（也就是备份节点），所以`Redis`集群至少需要6台服务器。 **（三主三从、三存三取、高可用、可备份）**

当然，我们在本地调试时不可能用这么多服务器，因此我们可以在本地模拟运行6个`redis`实例，**事实上生产环境的Redis集群搭建和这里基本上一样。**

mac 环境下搭建本地redis集群
------------------

### 1\. 下载安装redis

可以在官网选择安装，也可以用命名行安装

bash

 代码解读

复制代码

`#安装 brew install redis #启动 redis-server #进入redis客户端 redis-cli`

### 2\. 通过redis配置集群环境

#### 首先要找到redis配置文件的位置

*   `brew list redis` # 查看redis安装的位置
*   `cd /opt/homebrew/Cellar/redis/6.2.4` # 根据位置进入版本号所在的文件夹
*   `open .` \# 打开文件夹
*   用`Xcode.app`打开`homebrew.mxcl.redis.plist`, 即可找到`redis.conf`所在的位置，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16930505e1914222893aee7b172fa56d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1790902082ce42a6b9031ab524eddc89~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 创建六个服务配置文件

`cd /opt/homebrew/etc/`(上一步找到的配置文件目录)

bash

 代码解读

复制代码

`# 需要在 /opt/homebrew/etc/ 路径下 mkdir -p redis/cluster/7000 mkdir -p redis/cluster/7001 mkdir -p redis/cluster/7002 mkdir -p redis/cluster/7003 mkdir -p redis/cluster/7004 mkdir -p redis/cluster/7005`

#### 修改配置文件

`/opt/homebrew/etc/redis.conf`路径下的配置文件不用去修改, 只要将其copy到上面创建的 `redis/cluster/7000`目录下，然后再修改，步骤如下

*   先复制一份配置文件修改

bash

 代码解读

复制代码

`cd /opt/homebrew/etc/ # 进入配置文件目录 cp redis.conf redis/cluster/7000/7000.conf code redis/cluster/7000/7000.conf # 用编辑器打开或者用vim打开配置文件来进行修改`

*   进入到`7000.conf`后，修改以下属性

yaml

 代码解读

复制代码

`# Redis端口号（7000-7005每个配置文件都要修改） port 7000   # 开启集群模式运行 cluster-enabled yes    # 集群内部配置文件配置文件路径，默认nodes-6379.conf（7000-7005每个配置文件都要修改） cluster-config-file nodes-7000.conf  # 节点间通信的超时时间 cluster-node-timeout 5000   # 数据持久化 appendonly yes`                      

*   将7000.conf复制到每个redis服务的目录下

yaml

 代码解读

复制代码

`cd /opt/homebrew/etc/redis/cluster # 进入配置文件目录 cp 7000/7000.conf 7001/7001.conf cp 7000/7000.conf 7002/7002.conf cp 7000/7000.conf 7003/7003.conf cp 7000/7000.conf 7004/7004.conf cp 7000/7000.conf 7005/7005.conf`

*   再修改`7001.conf-7005.conf`每个配置文件的port和cluster-config-file属性

**注意：** 每个配置文件必需配置不一样的`port和cluster-config-file`值（否则集群不会生效），上面是以端口区分。

**通过**`find /opt/homebrew -name nodes-7000.conf`**命令可查找到该配置文件的目录**

* * *

### 3\. 启动和停止集群服务

由于我们配置了6个服务，因此不可能一个一个的启动或停止，需要借助shell脚本来实现

进入`/opt/homebrew/etc/redis/cluster`目录，创建start.sh和stop.sh文件

bash

 代码解读

复制代码

`# start.sh 文件 #!/bin/sh redis-server /opt/homebrew/etc/redis/cluster/7000/7000.conf & redis-server /opt/homebrew/etc/redis/cluster/7001/7001.conf & redis-server /opt/homebrew/etc/redis/cluster/7002/7002.conf & redis-server /opt/homebrew/etc/redis/cluster/7003/7003.conf & redis-server /opt/homebrew/etc/redis/cluster/7004/7004.conf & redis-server /opt/homebrew/etc/redis/cluster/7005/7005.conf & # stop.sh 文件 #!/bin/sh redis-cli -p 7000 shutdown & redis-cli -p 7001 shutdown & redis-cli -p 7002 shutdown & redis-cli -p 7003 shutdown & redis-cli -p 7004 shutdown & redis-cli -p 7005 shutdown &`

执行`./start.sh`或者`./stop.sh`来启停服务

执行`ps -ef |grep redis`来查看已启动的redis服务

**注意：** 第一次执行./start.sh需要通过`sudo chmod +x start.sh`授权执行权限

### 4\. 相关命令

perl

 代码解读

复制代码

`redis-cli -p 7000 # 单个客户端启动 redis-server 7000/7000.conf  # 启动单个服务端 redis-cli -p 7000 shutdown # 关闭服务端 sudo chmod +x start.sh # 开启脚本执行权限 # 设置redis主从关系（三主三从） redis-cli --cluster create  --cluster-replicas 1 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 cluster nodes #查看集群节点情况（进入某个客户端执行） cluster info #查看集群信息（进入某个客户端执行） 查看所有key值：keys * 删除指定索引的值：del key 清空整个 Redis 服务器的数据：flushall  清空当前库中的所有 key：flushdb` 

客户端使用 ioredis 框架接入集群
--------------------

Redis.Cluster提供了在多个Redis节点上自动分片的功能，使用前面搭建好的六个redis服务器，然后在本地启动`node redis.js`,就可以测试集群的效果了。[ioredis](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fioredis "https://www.npmjs.com/package/ioredis")

php

 代码解读

复制代码

`// redis.js const Redis = require("ioredis"); const cluster = new Redis.Cluster([   {     port: 7000,     host: "127.0.0.1",   },   {     port: 7001,     host: "127.0.0.1",   }, ]); cluster.set("foo", "bar"); cluster.get("foo", (err, res) => {   // res === 'bar' });`

使用bull框架（redis 队列）
------------------

javascript

 代码解读

复制代码

`import Queue from 'bull' // 创建redis队列实例 const instance = new Queue('custom', {   prefix : '{myprefix}',   createClient(type) {     // cluster 集群实例同上     return cluster   } }) // 添加数据到redis队列(生产者) instance.add(   'request',    {      ...params   },   {     removeOnComplete: false   } ).catch(e => {   console.error(e) }) // 消费者回调 instance.process('request', 5, async (job, done) => {   console.log('获取当前消费的数据：', job.data)   // 执行异步操作   await new Promise((resolve)=>resolve())   done() })`

使用`bull`框架连接`ioredis`集群时存在问题： 每次有数据`push`到`redis`队列时对应的回调函数可能会触发多次，目前无法确定是使用的问题还是框架本身的问题（如果有了解的欢迎大家留言告知）。

替代集群的方案：在不需要数据同步和数据迁移的情况下，可以在客户端使用多个`redis`实例，结合`Math.random()`使数据平分到其中的一个`redis`，从而解决了单个实例硬件(`cpu`等)瓶颈的问题。

问题处理
----

1.  **Mac系统下连接redis报错？**

控制台错误提示：Could not connect to Redis at 127.0.0.1:6379: Connection refused

原因：服务端没有开启或启动失败

解决办法：需要先启动redis服务端redis-server [参考链接](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_23347459%2Farticle%2Fdetails%2F104257529 "https://blog.csdn.net/qq_23347459/article/details/104257529")

2.  **客户端启动、读写报错？**

错误提示：ClusterAllFailedError: Failed to refresh slots cache.

原因：每个服务下的配置文件中的cluster-config-file属性一致。

处理：修改成唯一的属性值 [参考链接1](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F57350961%2Fioredis-clusterallfailederror-failed-to-refresh-slots-cache "https://stackoverflow.com/questions/57350961/ioredis-clusterallfailederror-failed-to-refresh-slots-cache") [参考2](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fluin%2Fioredis%2Fissues%2F711 "https://github.com/luin/ioredis/issues/711")

3.  **执行创建主从redis语句失败？**

执行语句：`redis-cli --cluster create --cluster-replicas 1 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005`

提示错误：`[ERR] Node 127.0.0.1:7000 is not empty. Either the node already knows other nodes (check with CLUSTER NODES) or contains some key in database 0`

原因：执行创建语句时，没有清空数据和重置集群

处理：清空数据和重置集群, 清除rdb和aof文件

[参考清除redis数据](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F37206993%2Fredis-server-cluster-not-working "https://stackoverflow.com/questions/37206993/redis-server-cluster-not-working")

ruby

 代码解读

复制代码

`# 以7000端口的服务为例，7001-7005重复以下操作 $redis-cli -p 7000 127.0.0.1:7000> flushall 127.0.0.1:7000> cluster reset 127.0.0.1:7000> exit # 使用find找到rdb和aof文件(也在rdb目录下) find /opt/homebrew -name dump.rdb # 重新执行创建语句成功 redis-cli --cluster create  --cluster-replicas 1 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005`

[](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fluin%2Fioredis%2Fissues%2F431 "https://github.com/luin/ioredis/issues/431")

结语
--

redis集群在客户端的使用是非常简单的，相比之下服务端的配置会比较繁琐。

客户端的具体使用只做了一下简单的说明，使用过程中要注意redis数据的同步和迁移等问题。

使用集群虽然能提升服务能力、支持主从复制、哨兵模式、读写分离、平分服务器的压力等特点。但不具备自动容错和恢复功能，如果出现宕机会使部分读写请求失败，降低了系统的可用性。在使用时根据业务情况分析、选择不同的方案。

> 作者： `tager`  
> 相关文章地址：[`https://juejin.cn/user/4353721776234743/posts`](https://juejin.cn/user/4353721776234743/posts "https://juejin.cn/user/4353721776234743/posts")  
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

* * *