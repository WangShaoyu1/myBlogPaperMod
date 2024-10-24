---
author: "政采云技术"
title: "Redis Bigkey 排查"
date: 2023-08-15
description: "在处理 bigkey 问题可以先从一下几点入手 什么是 bigkey? bigkey 危害？ bigkey 是如何产生的? 如何发现 bigkey ? 如何处理 bigkey? 什么是 Bigkey "
tags: ["Redis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:27,views:1524,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![薛顺.png](/images/jueJin/107c95f211c64e6.png)

在处理 bigkey 问题可以先从一下几点入手

1.  什么是 bigkey?
2.  bigkey 危害？
3.  bigkey 是如何产生的?
4.  如何发现 bigkey ?
5.  如何处理 bigkey?

什么是 Bigkey
----------

Redis bigkey 是指在 Redis 数据库中占用空间较大的键值对。这些键通常包含了大量的数据，可能会影响 Redis 的性能和内存使用。例如，在一个集合、哈希表、列表或有序集合中存储了大量元素的键。

实际生产环境中出现下面两种情况，我们就可以认为它是 bigkey。

1.  字符串类型：它的 big 体现在单个 value 值很大，超过 10KB。如果 key 过大也是不行的。
2.  非字符串类型：哈希、列表、集合、有序集合，元素超过 5000 个。

Bigkey 的危害
----------

1.  超时阻塞：由于 Redis 单线程的特性，操作 bigkey 比较耗时。
2.  集群节点失衡：在 Redis 集群中，如果某个节点中存在大量的 bigkey，可能会导致该节点的负载过高，从而导致集群节点失衡，影响整个集群的性能和稳定
3.  备份和恢复困难：当 Redis 需要进行备份和恢复时，bigkey 也会成为一个问题，因为备份和恢复需要占用大量的磁盘空间和网络带宽，如果存在大量的 bigkey，备份和恢复的过程可能会非常耗时和困难。

Bigkey 如何产生的
------------

一般来说，bigkey 的产生都是由于程序设计不当，或者对于数据规模预料不清楚造成的。

要避免 bigkey 产生，需要合理选择数据结构、拆分大型字符串、压缩数据及定期检查数据库中的键值对大小。

如何发现 Bigkey
-----------

### 使用 Redis 的内置命令行

```java
$ redis-cli --bigkeys
​
# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.01 to sleep 0.01 sec
# per SCAN command (not usually needed).
​
[00.00%] Biggest string found so far 'key-419' with 3 bytes
[05.14%] Biggest list   found so far 'mylist' with 100004 items
[35.77%] Biggest string found so far 'counter:__rand_int__' with 6 bytes
[73.91%] Biggest hash   found so far 'myobject' with 3 fields
​
-------- summary -------
​
Sampled 506 keys in the keyspace!
Total key length in bytes is 3452 (avg len 6.82)
​
Biggest string found 'counter:__rand_int__' has 6 bytes
Biggest   list found 'mylist' has 100004 items
Biggest   hash found 'myobject' has 3 fields
​
504 strings with 1403 bytes (99.60% of keys, avg size 2.78)
1 lists with 100004 items (00.20% of keys, avg size 100004.00)
0 sets with 0 members (00.00% of keys, avg size 0.00)
1 hashs with 3 fields (00.20% of keys, avg size 3.00)
0 zsets with 0 members (00.00% of keys, avg size 0.00)
```

不过需要注意，执行 --bigkeys 时，是通过扫描数据库来查找 bigkey，所以会对 Redis 实例的性能产生影响。

如果是主从，最好使用从节点执行。

```java
# redis-cli 会没扫描 100 次暂停 0.1 秒
./redis-cli  --bigkeys -i 0.1
```

使用 redis-cli --bigkey 不足：

1.  这个方法只能返回每种类型中最大的那个 bigkey，无法得到大小排在前 N 位的 bigkey；
2.  对于集合类型来说，只统计集合元素个数的多少，而不是实际占用的内存量。但是，一个集合中的元素个数多，并不一定占用的内存就多。因为，有可能每个元素占用的内存很小，这样的话，即使元素个数有很多，总内存开销也不大

统计 value 内存大小，可以通过 scan 命令迭代，具体步骤如下：

0.  通过 SCAN 命令进行全局扫描。
    
    ```java
    #SCAN cursor [MATCH pattern] [COUNT count]
    #cursor - 游标。
    #pattern - 匹配的模式。
    #count - 可选，用于指定每次迭代返回的 key 的数量，默认值为 10 。
    redis 127.0.0.1:6379> scan 0   # 使用 0 作为游标，开始新的迭代
    1) "17"                        # 第一次迭代时返回的游标
    2)  1) "key:12"
    2) "key:8"
    3) "key:4"
    4) "key:14"
    5) "key:16"
    6) "key:17"
    7) "key:15"
    8) "key:10"
    9) "key:3"
    10) "key:7"
    11) "key:1"
    redis 127.0.0.1:6379> scan 17  # 使用的是第一次迭代时返回的游标 17 开始新的迭代
    1) "0"
    2) 1) "key:5"
    2) "key:18"
    3) "key:0"
    4) "key:2"
    5) "key:19"
    6) "key:13"
    7) "key:6"
    8) "key:9"
    9) "key:11"
    ```
1.  通过 TYPE 命令判断 key 的类型。
    
    ```java
    redis> SET weather "sunny"
    OK
    ​
    redis> TYPE weather
    string
    ```
2.  根据 key 类型，统计 value 大小
    

a. String 类型：STRLEN 就是占用内存大小。

```markdown
> STRLEN 22de5ac4e8074ff4bf03d777850de62c
640
```

b. 集合类型：如果已知元素大小，乘上元素个数就是占用内存大小。

```java
# List
redis 127.0.0.1:6379> LLEN list1
(integer) 2
​
# Hash
redis 127.0.0.1:6379> HLEN myhash
(integer) 2
​
# Set
redis 127.0.0.1:6379> SCARD myset
(integer) 2
​
# Sorted Set
redis 127.0.0.1:6379> ZCARD myzset
(integer) 2
```

c. 未知可以通过 memory usage

```java
memory usage 0188a87272cb4558905b0cfbe64a30d6
1624
```

### 分析 RDB 文件

0.  先执行下面的命令
    
    ```arduino
    set hello redis
    save
    ```
1.  找到 dump.rdb 文件，并执行下面命令
    
    ```java
    od -A x -t x1c -v dump.rdb
    000000  52  45  44  49  53  30  30  30  39  fa  09  72  65  64  69  73
    R   E   D   I   S   0   0   0   9 372  \t   r   e   d   i   s
    000010  2d  76  65  72  05  35  2e  30  2e  37  fa  0a  72  65  64  69
    -   v   e   r 005   5   .   0   .   7 372  \n   r   e   d   i
    000020  73  2d  62  69  74  73  c0  40  fa  05  63  74  69  6d  65  c2
    s   -   b   i   t   s 300   @ 372 005   c   t   i   m   e 302
    000030  12  ff  54  64  fa  08  75  73  65  64  2d  6d  65  6d  c2  c8
    022 377   T   d 372  \b   u   s   e   d   -   m   e   m 302 310
    000040  bb  0d  00  fa  0c  61  6f  66  2d  70  72  65  61  6d  62  6c
    273  \r  \0 372  \f   a   o   f   -   p   r   e   a   m   b   l
    000050  65  c0  00  fe  00  fb  01  00  00  05  68  65  6c  6c  6f  05
    e 300  \0 376  \0 373 001  \0  \0 005   h   e   l   l   o 005
    000060  72  65  64  69  73  ff  db  4d  64  00  c2  0b  2d  8d
    r   e   d   i   s 377 333   M   d  \0 302  \v   - 215
    00006e
    ```

一个 RDB 主要是有三部分组成

1.  文件头：Redis 魔数，RDB 版本，Redis 版本，RDB 创建时间，键值对占用内存大小等
2.  文件数据：Redis 数据库所有键值对
3.  文件尾：RDB 文件结束标识符，以及文件校验值。这个校验值用来在 Redis Server 加载 RDB 文件是否被篡改过。

这里解读文件的一部分

![image-20230512203931176](/images/jueJin/2a15ac7468b6483.png)

RDB 文件格式主要如下：

![未命名文件 (2)](/images/jueJin/ff5711f9a0c841f.png)

```java
type 类型如下
# 0 =  "String Encoding"
# 1 =  "List Encoding"
# 2 =  "Set Encoding"
# 3 =  "Sorted Set Encoding"
# 4 =  "Hash Encoding"
# 9 =  "Zipmap Encoding"
# 10 = "Ziplist Encoding"
# 11 = "Intset Encoding"
# 12 = "Sorted Set in Ziplist Encoding"
# 13 = "Hashmap in Ziplist Encoding"
```

这里 type 常量都代表了一种对象类型或底层编码，当服务器读入 RDB 文件中键值对数据，程序会根据 type 的来决定如何读入和解释 value。

*   key 总是一个字符串对象，他的编码和 String Encoding 类型的 value 一样。
*   根据 type 的不同，以及保存内容的长度不同，保存的 value 的结构和长度也会有所不同。

如果需要解读其他类型需要我们对 Redis 的对象底层编码结构了解，下面是个简单的关系图。具体可以查看[OBJECT ENCODING](https://link.juejin.cn?target=https%3A%2F%2Fredis.io%2Fcommands%2Fobject-encoding%2F "https://redis.io/commands/object-encoding/")

![image-20230512205131067](/images/jueJin/d9a70dac20f549d.png)

如果想深入了解 RDB 文件格式可以访问 [Redis-RDB-Dump\_File\_Foramt](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsripathikrishnan%2Fredis-rdb-tools%2Fwiki%2FRedis-RDB-Dump-File-Format "https://github.com/sripathikrishnan/redis-rdb-tools/wiki/Redis-RDB-Dump-File-Format")

所以比起使用命令直接调用 Redis Server 获取 bigkey。分析 RDB 文件是个不错的选择。

### redis-rdb-tool

从文档中可以看到 redis-rdb-tool 的主要功能：

0.  生成内存报告；
1.  将 dump.rdb 文件转化为 json 格式；
2.  比较两个 dump 文件等。

将 dump.rdb 文件转化为 json 格式。

```java
rdb --command json dump.rdb
[{"hello":"redis"}]
```

有了 json 数据之后，我们就可以方法对 Redis 的数据进行统计和监控，也不会对 Redis Server 产生影响。

具体使用手册可以访问[redis-rdb-tool](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsripathikrishnan%2Fredis-rdb-tools "https://github.com/sripathikrishnan/redis-rdb-tools")

如何处理 Bigkey
-----------

当发现 Bigkey 的时候，不应该直接删除。而是通知调用方，让调用方去处理。选择数据结构、拆分大型字符串、压缩数据等。

当发现 Redis 变慢了，可以通过下面的 checklist 来排查问题：

1.  使用复杂度过高的命令或一次查询全量数据；
2.  操作 bigkey；
3.  大量 key 集中过期；
4.  内存达到 maxmemory；
5.  客户端使用短连接和 Redis 相连；
6.  当 Redis 实例的数据量大时，无论是生成 RDB，还是 AOF 重写，都会导致 fork 耗时严重；
7.  AOF 的写回策略为 always，导致每个操作都要同步刷回磁盘；
8.  Redis 实例运行机器的内存不足，导致 swap 发生，Redis 需要到 swap 分区读取数据；
9.  进程绑定 CPU 不合理；
10.  Redis 实例运行机器上开启了透明内存大页机制；
11.  网卡压力过大。

推荐阅读
----

[Kubernetes Gateway API](https://juejin.cn/post/7265283229505175587 "https://juejin.cn/post/7265283229505175587")

[架构方法论](https://juejin.cn/post/7264538238533320719 "https://juejin.cn/post/7264538238533320719")

[redisString结构解析及内存使用优化](https://juejin.cn/post/7262704979903430712 "https://juejin.cn/post/7262704979903430712")

[Trino 插件开发入门](https://juejin.cn/post/7260132092834742333 "https://juejin.cn/post/7260132092834742333")

[精准测试体系构建](https://juejin.cn/post/7259354549165375549 "https://juejin.cn/post/7259354549165375549")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)