---
author: "捡田螺的小男孩"
title: "生产问题分析！delete in子查询不走索引?！"
date: 2021-09-29
description: "大家好，我是捡田螺的小男孩。（求个星标置顶） 文章开篇前，先问大家一个问题：delete in子查询，是否会走索引呢？很多伙伴第一感觉就是：会走索引。最近我们出了个生产问题，就跟它有关。"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:24,comments:1,collects:21,views:3630,"
---
前言
--

大家好，我是捡田螺的小男孩。

文章开篇前，先问大家一个问题：**delete in子查询，是否会走索引呢**？很多伙伴**第一感觉**就是：会走索引。最近我们出了个生产问题，就跟它有关。本文将跟大家一起探讨这个问题，并附上优化方案。

![](/images/jueJin/830c54f528954e6.png)

*   公众号：**捡田螺的小男孩**

问题复现
----

MySQL版本是`5.7`，假设当前有两张表`account`和`old_account`,表结构如下：

```sql
CREATE TABLE `old_account` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
`name` varchar(255) DEFAULT NULL COMMENT '账户名',
`balance` int(11) DEFAULT NULL COMMENT '余额',
`create_time` datetime NOT NULL COMMENT '创建时间',
`update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`id`),
KEY `idx_name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1570068 DEFAULT CHARSET=utf8 ROW_FORMAT=REDUNDANT COMMENT='老的账户表';

CREATE TABLE `account` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
`name` varchar(255) DEFAULT NULL COMMENT '账户名',
`balance` int(11) DEFAULT NULL COMMENT '余额',
`create_time` datetime NOT NULL COMMENT '创建时间',
`update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`id`),
KEY `idx_name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1570068 DEFAULT CHARSET=utf8 ROW_FORMAT=REDUNDANT COMMENT='账户表';
```

执行的SQL如下：

```csharp
delete from account where name in (select name from old_account);
```

我们explain执行计划走一波，

![](/images/jueJin/42febbf243d24c6.png)

从`explain`结果可以发现：先**全表扫描** `account`，然后逐行执行子查询判断条件是否满足；显然，这个执行计划和我们预期不符合，因为**并没有走索引**。

但是如果换成把`delete`换成`select`，就会走索引。如下：

![](/images/jueJin/62bc02bfc04b4ba.png)

为什么**select in**子查询会走索引，delete in子查询却不会走索引呢？

原因分析
----

`select in`子查询语句跟`delete in`子查询语句的不同点到底在哪里呢？

我们执行以下SQL看看

```csharp
explain select * from account where name in (select name from old_account);
show WARNINGS;
```

> **show WARNINGS** 可以查看优化后,最终执行的sql

结果如下：

```perl
select `test2`.`account`.`id` AS `id`,`test2`.`account`.`name` AS `name`,`test2`.`account`.`balance` AS `balance`,`test2`.`account`.`create_time` AS `create_time`,`test2`.`account`.`update_time` AS `update_time` from `test2`.`account`
semi join (`test2`.`old_account`)
where (`test2`.`account`.`name` = `test2`.`old_account`.`name`)
```

可以发现，实际执行的时候，MySQL对**select in子查询**做了优化，把子查询改成join的方式，所以可以走索引。但是很遗憾，对于**delete in子查询**，MySQL却没有对它做这个优化。

优化方案
----

那如何优化这个问题呢？通过上面的分析，显然可以把`delete in子查询`改为**join**的方式。我们改为join的方式后，再explain看下：

![](/images/jueJin/2f4c8365a4e64df.png)

可以发现，改用join的方式是**可以走索引的**，完美解决了这个问题。

实际上，对于update或者delete子查询的语句，**MySQL官网**也是推荐join的方式优化

![](/images/jueJin/934adf4d49f942b.png)

其实呢，给表加别名，也可以解决这个问题哦，如下:

```csharp
explain delete a from account as a where a.name in (select name from old_account)

```

![](/images/jueJin/9d25ff4209ae4e4.png)

为什么加别个名就可以走索引了呢？
----------------

**what**？为啥加个别名，delete in子查询又行了，又走索引了？

我们回过头来看看explain的执行计划，可以发现Extra那一栏，有个**LooseScan**。 ![](/images/jueJin/e954e1a09165481.png)

**LooseScan是什么呢？** 其实它是一种策略，是**semi join子查询**的一种执行策略。

> 因为子查询改为join，是可以让delete in子查询走索引;而**加别名**，会走**LooseScan策略**，而LooseScan策略，本质上就是**semi join子查询**的一种执行策略。

因此，加别名就可以让delete in子查询走索引啦！

总结
--

*   本博文分析了**delete in子查询不走索引**的原因，并附上解决方案。`delete in`在日常开发，是非常常见的，平时大家工作中，需要注意一下。同时呢，建议大家工作的时候，写SQL的时候，尽量养成一个好习惯，先用explain分析一下SQL。
*   本文整体思路参考同事的博文，已经经过他本人同意。也建议大家遇到问题时，多点思考，多点写写总结，避免重蹈覆辙。
*   我是捡田螺的小男孩，码字不易，看完文章有收获的话，求个点赞，公众号（捡田螺的小男孩）求个关注，感谢、比心~