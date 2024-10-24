---
author: "敖丙"
title: "MySQL查询缓存的小奥秘"
date: 2020-12-23
description: "我们知道，缓存的设计思想在RDBMS数据库中无处不在，就拿号称2500w行代码，bug堆积如山的Oracle数据库来说，SQL的执行计划可以缓存在library cache中避免再次执行相同SQL发生硬解析（语法分析-语义分析-生成执行计划），SQL执行结果缓存在RESUL…"
tags: ["Java","数据库中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:26,comments:0,collects:27,views:3402,"
---
> 有情怀，有干货，微信搜索【**三太子敖丙**】关注这个不一样的程序员。
> 
> 本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已收录，有一线大厂面试完整考点、资料以及我的系列文章。

前言
--

我们知道，缓存的设计思想在RDBMS数据库中无处不在，就拿号称2500w行代码，bug堆积如山的Oracle数据库来说，SQL的执行计划可以缓存在library cache中避免再次执行相同SQL发生硬解析（语法分析->语义分析->生成执行计划），SQL执行结果缓存在RESULT CACHE内存组件中，有效的将物理IO转化成逻辑IO，提高SQL执行效率。

MySQL的QueryCache跟Oracle类似，缓存的是SQL语句文本以及对应的结果集，看起来是一个很棒的Idea，那为什么从MySQL 4.0推出之后，5.6中默认禁用，5.7中被deprecated（废弃）以及8.0版本被Removed，今天就聊聊MySQL QueryCache的前世今生。

QueryCache介绍
------------

MySQL查询缓（QC：QueryCache）在MySQL 4.0.1中引入，查询缓存存储SELECT语句的文本以及发送给客户机的结果集，如果再次执行相同的SQL，Server端将从查询缓存中检索结果返回给客户端，而不是再次解析执行SQL，查询缓存在session之间共享，因此，一个客户端生成的缓存结果集，可以响应另一个客户端执行同样的SQL。

![](/images/jueJin/2e02a2f8371b43d.png)

**回到开头的问题，如何判断SQL是否共享？**

通过SQL文本是否完全一致来判断，包括大小写，空格等所有字符完全一模一样才可以共享，共享好处是可以避免硬解析，直接从QC获取结果返回给客户端，下面的两个SQL是不共享滴，因为一个是from，另一个是From。

```sql
--SQL 1
select id, balance from account where id = 121;
--SQL 2
select id, balance From account where id = 121;
```

下面是Oracle数据库通过SQL\_TEXT生成sql\_id的算法，如果sql\_id不一样说明就不是同一个SQL，就不共享，就会发生硬解析。

```perl
#!/usr/bin/perl -w
use Digest::MD5  qw(md5 md5_hex md5_base64);
use Math::BigInt;
my $stmt = "select id, balance from account where id = 121\0";
my $hash = md5 $stmt;
my($a,$b,$msb,$lsb) = unpack("V*",$hash);
my $sqln = $msb*(2**32)+$lsb;
my $stop = log($sqln) / log(32) + 1;
my $sqlid = '';
my $charbase32 = '0123456789abcdfghjkmnpqrstuvwxyz';
my @chars = split '', $charbase32;
    for($i=0; $i < $stop-1; $i++){
    my $x = Math::BigInt->new($sqln);
    my $seq = $x->bdiv(32**$i)->bmod(32);
    $sqlid = $chars[$seq].$sqlid;
}
print "SQL is:\n    $stmt \nSQL_ID is\n    $sqlid\n";
```

大家可以发现SQL 1和SQL 2通过代码生成的sql\_id值是不一样，所以不共享。

```sql
SQL is:    select id, balance from account where id = 121
SQL_ID is  dm5c6ck1g7bds
SQL is:    select id, balance From account where id = 121
SQL_ID is  6xb8gvs5cmc9b
```

如果让你比较两个Java代码文件的内容的有何差异，只需要将这段代码理解透了，就可以改造实现自己的业务逻辑。

QueryCache配置
------------

```sql
mysql> show variables like '%query_cache%';
+------------------------------+----------+
| Variable_name                | Value    |
+------------------------------+----------+
| have_query_cache             | YES      |
| query_cache_limit            | 1048576  |
| query_cache_min_res_unit     | 4096     |
| query_cache_size             | 16777216 |
| query_cache_type             | OFF      |
| query_cache_wlock_invalidate | OFF      |
```

Variable\_name

Description

have\_query\_cache

查询缓存是否可用，YES-可用；NO-不可用，如果用标准二进制MySQL，值总是YES。

query\_cache\_limit

控制单个查询结果集的最大尺寸，默认是1MB。

query\_cache\_min\_res\_unit

查询缓存分片数据块的大小，默认是4KB，可以满足大部分业务场景。

query\_cache\_size

查询缓存大小，单位Bytes，设置为0是禁用QueryCache，注意：不要将缓存的大小设置得太大，由于在更新过程中需要线程锁定QueryCache，因此对于非常大的缓存，您可能会看到锁争用问题。

query\_cache\_type

当query\_cache\_size>0；该变量影响qc如何工作，有三个取值0，1，2，**0：禁止缓存或检索缓存结果**；**1：启用缓存，SELECT SQL\_NO\_CACHE的语句除外**；**2：只缓存以SELECT SQL\_CACHE开头的语句。**

**query\_cache\_min\_res\_unit说明**

默认大小是4KB，如果有很多查询结果很小，那么默认数据块大小可能会导致内存碎片，由于内存不足，碎片可能会强制查询缓存从缓存中删除查询。

在这种情况下，可以减小query\_cache\_min\_res\_unit的值，由于修剪而删除的空闲块和查询的数量由Qcache\_free\_blocks和Qcache\_lowmem\_prunes状态变量的值给出，如果大量的查询有较大的结果集，可以增大该参数的值来提高性能。

**通常开启QueryCache方式**

```shell
# 修改MySQL配置文件/etc/my.cnf，添加如下配置，重启MySQL server即可。
[mysqld]
query_cache_size = 32M
query_cache_type = 1
```

QueryCache使用
------------

先搞点测试数据，分别对禁用和开启QueryCache下的场景进行测试。

```sql
--创建一个用户表users，并且插入100w数据。
CREATE TABLE `users` (
`id` bigint NOT NULL AUTO_INCREMENT,
`name` varchar(20) NOT NULL DEFAULT '' COMMENT '姓名',
`age` tinyint NOT NULL DEFAULT '0' COMMENT 'age',
`gender` char(1) NOT NULL DEFAULT 'M' COMMENT '性别',
`phone` varchar(16) NOT NULL DEFAULT '' COMMENT '手机号',
`create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

select count(*) from users;
+----------+
| count(*) |
+----------+
|  1000000 |
```

### 禁用queryCache场景

在不使用QueryCache的时候，每次执行相同的查询语句，都要发生一次硬解析，消耗大量的资源。

![](/images/jueJin/5d586b7ac0b24f8.png)

```shell
#禁用QueryCache的配置
query_cache_size = 0
query_cache_type = 0
```

重复执行下面查询，观察执行时间。

```sql
--第一次执行查询语句
mysql> select * from users order by create_time desc limit 10;
+---------+------------+-----+--------+-------------+---------------------+---------------------+
| id      | name       | age | gender | phone       | create_time         | update_time         |
+---------+------------+-----+--------+-------------+---------------------+---------------------+
|  997855 | User997854 |  54 | M      | 15240540354 | 2020-12-15 14:34:50 | 2020-12-15 14:34:50 |
.......
10 rows in set (0.89 sec)
--第二次执行同样的查询语句
mysql> select * from users order by create_time desc limit 10;
+---------+------------+-----+--------+-------------+---------------------+---------------------+
| id      | name       | age | gender | phone       | create_time         | update_time         |
+---------+------------+-----+--------+-------------+---------------------+---------------------+
|  997855 | User997854 |  54 | M      | 15240540354 | 2020-12-15 14:34:50 | 2020-12-15 14:34:50 |
.......
10 rows in set (0.90 sec)
-- profile跟踪情况
mysql> show profile cpu,block io for query 1;
+----------------------+----------+----------+------------+--------------+---------------+
| Status               | Duration | CPU_user | CPU_system | Block_ops_in | Block_ops_out |
+----------------------+----------+----------+------------+--------------+---------------+
| preparing            | 0.000022 | 0.000017 |   0.000004 |            0 |             0 |
| Sorting result       | 0.000014 | 0.000009 |   0.000005 |            0 |             0 |
| executing            | 0.000011 | 0.000007 |   0.000004 |            0 |             0 |
| Sending data         | 0.000021 | 0.000016 |   0.000004 |            0 |             0 |
| Creating sort index  | 0.906290 | 0.826584 |   0.000000 |            0 |             0 |
```

可以看到，多次执行同样的SQL查询语句，执行时间都是0.89s左右，几乎没有差别，同时时间主要消耗在Creating sort index阶段。

### 开启queryCache场景

开启查询缓存时，查询语句第一次被执行时会将SQL文本及查询结果缓存在QC中，下一次执行同样的SQL执行从QC中获取数据返回给客户端即可。

![](/images/jueJin/52975e62d91547c.png)

```shell
#禁用QueryCache的配置
query_cache_size = 32M
query_cache_type = 1
``````sql
--第一次执行查询语句
mysql> select * from users order by create_time desc limit 10;
+---------+------------+-----+--------+-------------+---------------------+---------------------+
| id      | name       | age | gender | phone       | create_time         | update_time         |
+---------+------------+-----+--------+-------------+---------------------+---------------------+
|  997855 | User997854 |  54 | M      | 15240540354 | 2020-12-15 14:34:50 | 2020-12-15 14:34:50 |
.......
10 rows in set (0.89 sec)
--第二次执行查询语句
mysql> select * from users order by create_time desc limit 10;
+---------+------------+-----+--------+-------------+---------------------+---------------------+
| id      | name       | age | gender | phone       | create_time         | update_time         |
+---------+------------+-----+--------+-------------+---------------------+---------------------+
|  997855 | User997854 |  54 | M      | 15240540354 | 2020-12-15 14:34:50 | 2020-12-15 14:34:50 |
.......
10 rows in set (0.00 sec)
-- profile跟踪数据
mysql> show profile cpu,block io for query 3;
+--------------------------------+----------+----------+------------+--------------+---------------+
| Status                         | Duration | CPU_user | CPU_system | Block_ops_in | Block_ops_out |
+--------------------------------+----------+----------+------------+--------------+---------------+
| Waiting for query cache lock   | 0.000016 | 0.000015 |   0.000001 |            0 |             0 |
| checking query cache for query | 0.000007 | 0.000007 |   0.000000 |            0 |             0 |
| checking privileges on cached  | 0.000004 | 0.000003 |   0.000000 |            0 |             0 |
| checking permissions           | 0.000034 | 0.000033 |   0.000001 |            0 |             0 |
| sending cached result to clien | 0.000018 | 0.000017 |   0.000001 |            0 |             0 |
```

可以看到，第一次执行QueryCache里没有缓存SQL文本及数据，执行时间0.89s，由于开启了QC，SQL文本及执行结果被缓存在QC中，第二次执行执行同样的SQL查询语句，直接命中QC且返回数据，不需要发生硬解析，所以执行时间降低为0s，从profile里看到sending cached result to client直接发送QC中的数据返回给客户端。

查询缓存命中率
-------

**查询缓存相关的status变量**

```sql
mysql>SHOW GLOBAL STATUS LIKE 'QCache\_%';
+-------------------------+----------+
| Variable_name           | Value    |
+-------------------------+----------+
| Qcache_free_blocks      | 1        |  --查询缓存中可用内存块的数目。
| Qcache_free_memory      | 33268592 |  --查询缓存的可用内存量。
| Qcache_hits             | 121      |  --从QC中获取结果集的次数。
| Qcache_inserts          | 91       |  --将查询结果集添加到QC的次数，意味着查询已经不在QC中。
| Qcache_lowmem_prunes    | 0        |  --由于内存不足而从查询缓存中删除的查询数。
| Qcache_not_cached       | 0        |  --未缓存的查询数目。
| Qcache_queries_in_cache | 106      |  --在查询缓存中注册的查询数。
| Qcache_total_blocks     | 256      |  --查询缓存中的块总数。
```

**查询缓存命中率及平均大小**

```sql
Qcache_hits
Query cache hit rate = ------------------------------------------------ x 100%
Qcache_hits + Qcache_inserts + Qcache_not_cached

query_cache_size = Qcache_free_memory
Query Cache Avg Query Size = ---------------------------------------
Qcache_queries_in_cache
```

更新操作对QC影响
---------

举个例子，支付系统的里转账逻辑，先要锁定账户再修改余额，主要步骤如下：

![](/images/jueJin/07bf336ff30b4d3.png)

Query\_ID

Query

Description

1

reset query cache

清空查询缓存。

2

select balance from account where id = 121

第一次执行，未命中QC，添加到QC。

3

select balance from account where id = 121

命中QC，直接返回结果。

4

update account set balance = balance - 1000 where id = 121

更新，锁定query cche进行更新，缓存数据失效。

5

select balance from account where id = 121

缓存已失效，未命中，添加到QC。

6

select balance from account where id = 121

命中QC，直接返回结果。

对于这种情况来说，QC是不太适合的，因为第一次执行查询SQL未命中，返回结果给客户端，添加SQL文本及结果集到QC之后，下一次执行同样的SQL直接从QC返回结果，不需要硬解析操作，但是每次Update都是先更新数据，然后锁定QC然后更新缓存结果，会导致之前的缓存结果失效，再次执行相的查询SQL还是未命中，有得重新添加到QC，这样频繁的锁定QC->检查QC->添加QC->更新QC非常消耗资源，降低数据库的并发处理能力。

为何放弃QueryCache
--------------

### 一般业务场景

从业务系统的操作类型，可以分为OLTP（OnLine Transaction Processing 联机事务处理系统）和OLAP（OnLine Analysis Processing联机分析处理系统），对于政企业务，也可以分为BOSS（Business Operation Support System-业务操作支撑系统，简称业支）和BASS（Business Analysis Support System-业务分析支撑系统，简称经分），来总结下这两类系统的特点。

![](/images/jueJin/bdc4f862bd494e6.png)

### 适合QueryCache的场景

首先，查询缓存QC的大小只有几MB，不适合将缓存设置得太大，由于在更新过程中需要线程锁定QueryCache，因此对于非常大的缓存，可能会看到锁争用问题。那么，哪些情况有助于从查询缓存中获益呢？以下是理想条件：

1.  相同的查询是由相同或多个客户机重复发出的。
2.  被访问的底层数据本质上是静态或半静态的。
3.  查询有可能是资源密集型和/或构建简短但计算复杂的结果集，同时结果集比较小。
4.  并发性和查询QPS都不高。

这4种情况只是理想情况下，实际的业务系统都是有CRUD操作的，数据更新比较频繁，查询接口的QPS比较高，所以能满足上面的理想情况下的业务场景实在很少，我能想到就是配置表，数据字典表这些基本都是静态或半静态的，可以时通过QC来提高查询效率。

### 不适合QueryCache的场景

如果表数据变化很快，则查询缓存将失效，并且由于不断从缓存中删除查询，从而使服务器负载升高，处理速度变得更慢，如果数据每隔几秒钟更新一次或更加频繁，则查询缓存不太可能合适。

同时，查询缓存使用单个互斥体来控制对缓存的访问，实际上是给服务器SQL处理引擎强加了一个单线程网关，在查询QPS比较高的情况下，可能成为一个性能瓶颈，会严重降低查询的处理速度。因此，MySQL 5.6中默认禁用了查询缓存。

### 删除QueryCache

**The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes query\_cache\_type**，可以看到从MySQL 5.6的默认禁用，5.7的废弃以及8.0的彻底删除，Oracle也是综合了各方面考虑做出了这样的选择。

上面聊了下适合和不适合的QueryCache的业务场景，发现这个特性对业务场景要求过于苛刻，与实际业务很难吻合，而且开启之后，对数据库并发度和处理能力都会降低很多，下面总结下为何MySQL从**Disabled->Deprecated->Removed** QueryCache的主要原因。

![](/images/jueJin/9a67adeb2a4745c.png)

同时查询缓存碎片化还会导致服务器的负载升高，影响数据库的稳定性，在Oracle官方搜索QueryCache可以发现，有很多Bug存在，这也就决定了MySQL 8.0直接果断的Remove了该特性。

总结
--

上面为大家介绍了MySQL QueryCache从推出->禁用->废弃->删除的心路历程，设计之初是为了减少重复SQL查询带来的硬解析开销，同时将物理IO转化为逻辑IO，来提高SQL的执行效率，但是MySQL经过了多个版本的迭代，同时在硬件存储发展之快的今天，QC几乎没有任何收益，而且还会降低数据库并发处理能力，最终在8.0版本直接Removd掉了。

其实缓存设计思想在硬件和软件领域无处不在，硬件方面：RAID卡，CPU都有自己缓存，软件方面就太多了，OS的cache，数据库的buffer pool以及Java程序的缓存，作为一名研发工程师，需要根据业务场景选择合适缓存方案是非常重要的，如果都不合适，就需进行定制化开发缓存，来更好的Match自己的业务场景，今天就聊这么多，希望对大家有所帮助。

我是敖丙，**你知道的越多，你不知道的越多**，感谢各位人才的：**点赞**、**收藏**和**评论**，我们下期见！

* * *

> 文章持续更新，可以微信搜一搜「 **三太子敖丙** 」第一时间阅读，回复【**资料**】有我准备的一线大厂面试资料和简历模板，本文 **GitHub** [github.com/JavaFamily](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAobingJava%2FJavaFamily "https://github.com/AobingJava/JavaFamily") 已经收录，有大厂面试完整考点，欢迎Star。