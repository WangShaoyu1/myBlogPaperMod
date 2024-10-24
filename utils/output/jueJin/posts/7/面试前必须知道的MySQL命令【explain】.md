---
author: "Java3y"
title: "面试前必须知道的MySQL命令【explain】"
date: 2018-12-06
description: "刷面试题的时候，不知道你们有没有见过MySQL这两个命令：explain和profile(反正我就见过了) 之前虽然知道这两个命令大概什么意思，但一直没有去做笔记。今天发现自己的TODO LIST有这么两个命令，于是打算来学习一番，记录一下~ 发现很使用起来很简单，只要ex…"
tags: ["MySQL","面试","后端","SQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:36,views:1190,"
---
前言
==

> 只有光头才能变强

刷面试题的时候，不知道你们有没有见过MySQL这两个命令：`explain`和`profile`(反正我就见过了)..

之前虽然知道这两个命令大概什么意思，但一直没有去做笔记。今天发现自己的`TODO LIST`有这么两个命令，于是打算来学习一番，记录一下~

使用的MySQL的版本为`5.6.38`

![MySQL版本](/images/jueJin/1678178f69aae4c.png)

一、explain命令
===========

1.1体验explain命令
--------------

首先我们来**体验**一下`explain`命令是怎么使用的，以及输出的结果是什么：

```

explain select * from table_user ;

```

输出结果：

![体验explain命令](/images/jueJin/1678178f66cb1ae.png)

发现很使用起来很简单，只要explain后边跟着SQL语句就完事了(MySQL5.6之前的版本，只允许解释`SELECT`语句，从 MySQL5.6开始，非`SELECT`语句也可以被解释了)。

1.2为什么需要explain命令
-----------------

我们很多时候编写完一条SQL语句，往往想知道这条SQL语句执行是否高效。或者说，我们建立好的索引在这条SQL语句中是否使用到了，就可以使用`explain`命令来分析一下！

*   简单来说：通过`explain`命令我们可以学习到该条SQL是如何执行的，随后解析explain的结果可以帮助我们使用更好的索引，最终来优化它！

通过`explain`命令我们可以知道以下信息：表的读取顺序，数据读取操作的类型，哪些索引可以使用，哪些索引实际使用了，表之间的引用，每张表有多少行被优化器查询等信息。

`// 好了，我们下面看一下explain出来的结果是怎么看的。`

1.3读懂explain命令结果
----------------

explain命令输出的结果有10列：`id、select_type、table、type、possible_keys、key、key_len、ref、rows、Extra`

### 1.3.1id

> 包含一组数字，表示查询中执行SELECT子句或操作表的**顺序**。

在id列上也会有几种情况：

*   如果id相同执行顺序由上至下。
*   如果id不相同，id的序号会递增，id值越大优先级越高，越先被执行。
    *   (一般有子查询的SQL语句id就会不同)

![explain一下拥有子查询的SQL](/images/jueJin/1678178f66e92cf.png)

### 1.3.2select\_type

> 表示select查询的类型

select\_type属性下有好几种类型：

*   **SIMPLLE**：简单查询，该查询不包含 UNION 或子查询
*   **PRIMARY**：如果查询包含UNION 或子查询，则**最外层的查询**被标识为PRIMARY
*   UNION：表示此查询是 UNION 中的第二个或者随后的查询
*   DEPENDENT：UNION 满足 UNION 中的第二个或者随后的查询，其次取决于外面的查询
*   UNION RESULT：UNION 的结果
*   **SUBQUERY**：子查询中的第一个select语句(该子查询不在from子句中)
*   DEPENDENT SUBQUERY：子查询中的 第一个 select，同时取决于外面的查询
*   **DERIVED**：包含在from子句中子查询(也称为派生表)
*   UNCACHEABLE SUBQUERY：满足是子查询中的第一个 select 语句，同时意味着 select 中的某些特性阻止结果被缓存于一个 Item\_cache 中
*   UNCACHEABLE UNION：满足此查询是 UNION 中的第二个或者随后的查询，同时意味着 select 中的某些特性阻止结果被缓存于一个 Item\_cache 中

> 类型有点多啊，我加粗的是最常见的，起码要看得懂加粗的部分。

### 1.3.3table

> 该列显示了对应行正在访问哪个表(有别名就显示别名)。

当from子句中有子查询时，table列是 `<derivenN>`格式，表示当前查询依赖 `id=N`的查询，于是先执行 `id=N` 的查询

### 1.3.4type

> 该列称为**关联类型或者访问类型**，它指明了MySQL决定如何查找表中符合条件的行，同时**是我们判断查询是否高效的重要依据**。

以下为常见的取值

*   ALL：**全表扫描**，这个类型是性能最差的查询之一。通常来说，我们的查询不应该出现 ALL 类型，因为这样的查询，在数据量最大的情况下，对数据库的性能是巨大的灾难。
*   index：**全索引扫描**，和 ALL 类型类似，只不过 ALL 类型是全表扫描，而 index 类型是扫描全部的索引，主要优点是避免了排序，但是开销仍然非常大。如果在 Extra 列看到 Using index，说明正在使用覆盖索引，只扫描索引的数据，它比按索引次序全表扫描的开销要少很多。
*   range：**范围扫描**，就是一个有限制的索引扫描，它开始于索引里的某一点，返回匹配这个值域的行。这个类型通常出现在 `=、<>、>、>=、<、<=、IS NULL、<=>、BETWEEN、IN()` 的操作中，key 列显示使用了哪个索引，当 type 为该值时，则输出的 ref 列为 NULL，并且 key\_len 列是此次查询中使用到的索引最长的那个。
*   ref：一种索引访问，也称索引查找，它返回所有匹配某个单个值的行。此类型通常出现在多表的 join 查询, 针对于非唯一或非主键索引, 或者是使用了最左前缀规则索引的查询。
*   eq\_ref：使用这种索引查找，最多只返回一条符合条件的记录。在使用唯一性索引或主键查找时会出现该值，非常高效。
*   const、system：该表至多有一个匹配行，在查询开始时读取，或者该表是系统表，只有一行匹配。其中 const 用于在和 primary key 或 unique 索引中有固定值比较的情形。
*   NULL：在执行阶段不需要访问表。

### 1.3.5possible\_keys

> 这一列显示查询**可能**使用哪些索引来查找

### 1.3.6key

> 这一列显示MySQL**实际**决定使用的索引。如果没有选择索引，键是NULL。

### 1.3.7key\_len

> 这一列显示了在索引里使用的字节数，当key列的值为 NULL 时，则该列也是 NULL

### 1.3.8ref

> 这一列显示了哪些字段或者常量被用来和key配合从表中查询记录出来。

### 1.3.9rows

> 这一列显示了**估计**要找到所需的行而要读取的行数，这个值是个估计值，原则上值越小越好。

### 1.3.10extra

> 其他的信息

常见的取值如下：

*   **Using index**：使用覆盖索引，表示查询索引就可查到所需数据，不用扫描表数据文件，往往说明性能不错。
*   Using Where：在存储引擎检索行后再进行过滤，使用了where从句来限制哪些行将与下一张表匹配或者是返回给用户。
*   Using temporary：在查询结果排序时会使用一个临时表，一般出现于排序、分组和多表 join 的情况，查询效率不高，建议优化。
*   Using filesort：对结果使用一个外部索引排序，而不是按索引次序从表里读取行，一般有出现该值，都建议优化去掉，因为这样的查询 CPU 资源消耗大。

最后
==

原本以为Explain命令是比较难学的，但查找资料看下来，之前只是不知道具体的列和列中下的属性是什么意思而已。常见出现的其实也就那么几个，感觉对着每个属性多看一会，还是可以能看懂的。

> 当然了，在《高性能MySQL》中也有复杂的SQL语句来分析(但我认为我们一般不会写到那么复杂)..

这篇文章也借鉴了很多其他优秀的博客，如果大家有兴趣的话可以去阅读一下：

*   EXPLAIN 命令详解：
    *   [www.cnblogs.com/gomysql/p/3…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fgomysql%2Fp%2F3720123.html "https://www.cnblogs.com/gomysql/p/3720123.html")
*   MySQL Explain 命令详解：
    *   [mrzhouxiaofei.com/2018/04/06/…](https://link.juejin.cn?target=http%3A%2F%2Fmrzhouxiaofei.com%2F2018%2F04%2F06%2FMySQL%2520Explain%2520%25E5%2591%25BD%25E4%25BB%25A4%25E8%25AF%25A6%25E8%25A7%25A3%2F "http://mrzhouxiaofei.com/2018/04/06/MySQL%20Explain%20%E5%91%BD%E4%BB%A4%E8%AF%A6%E8%A7%A3/")
*   mysql系列\_explain执行计划：
    *   [zhuanlan.zhihu.com/p/34222512](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F34222512 "https://zhuanlan.zhihu.com/p/34222512")
*   MySQL explain详解
    *   [www.cnblogs.com/butterfly10…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fbutterfly100%2Farchive%2F2018%2F01%2F15%2F8287569.html "https://www.cnblogs.com/butterfly100/archive/2018/01/15/8287569.html")

如果你觉得我写得还不错，了解一下：

*   坚持**原创**的技术公众号：Java3y。
*   文章的**目录导航**(精美脑图+海量视频资源)：
    *   [github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

![帅的人都关注了](/images/jueJin/167554b3537ce51.png)