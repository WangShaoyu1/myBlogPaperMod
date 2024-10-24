---
author: "捡田螺的小男孩"
title: "京东一面： MySQL写入一条数据的流程是怎样的？"
date: 2024-09-09
description: "大家好，我是田螺。 有位朋友去京东面试，被问到这么一道题 MySQL写入一条数据的流程是怎样的？ 如果是我，我会按照这几个维度 MySQL 基本架构 连接器 查询缓存 分析器 优化器 执行器"
tags: ["后端","面试","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:22,views:821,"
---
前言
--

大家好，我是田螺。

有位朋友去京东面试，被问到这么一道题: MySQL写入一条数据的流程是怎样的？

如果是我，我会按照这几个维度

*   MySQL 基本架构
*   连接器
*   查询缓存
*   分析器
*   优化器
*   执行器
*   Buffer Pool
*   Redo Log
*   Binlog
*   事务两阶段提交
*   数据刷入磁盘

*   关注公众号：**捡田螺的小男孩** （更多原创面试文章）

1\. MySQL 基本架构
--------------

![图片](/images/jueJin/0285360b553147f.png)

总体来说，MySQL大体分为两部分，分别是**Server 层和存储引擎层**。

**Server 层**

它包括**连接器、查询缓存、分析器、优化器、执行器**等。比如**存储过程，触发器，视图**都是在这一层实现的。

*   **连接器Connection Manager）**：负责处理客户端与服务器之间的连接。它接受来自客户端的请求，并进行身份验证和权限检查，建立和管理连接。
*   **查询缓存（Query Cache）**：在旧版 MySQL 中有，但在较新的版本中已不推荐使用。它能够缓存查询和对应的结果，以提高查询性能。然而，在高并发和大型数据库中，它反而可能成为性能瓶颈，因为它在某些情况下会引起锁和不必要的开销。
*   **分析器（Parser）**：负责分析 SQL 查询语句，验证其语法和语义，确保查询的正确性。它将 SQL 语句转换成内部数据结构供优化器和执行器使用。
*   **优化器（Optimizer）**：接收来自分析器的查询请求，并决定如何最有效地执行查询。优化器的目标是找到最佳的执行路径，选择合适的索引、连接顺序和访问方法，以提高查询性能。
*   **执行器（Executor）**：负责执行优化器生成的执行计划，获取存储引擎返回的数据，并处理客户端请求。它与存储引擎交互，执行查询并返回结果给用户。
*   **存储引擎层:** 它负责数据的存储和提取。Mysql支持InnoDB、MyISAM、Memory 等多个存储引擎。我们日常开发中，一般用的存储引擎就是InnoDB。从 MySQL 5.5 版本开始，InnoDB 就成为了默认的存储引擎。

介绍完MySQL基本架构，带大家看一下，每个组件，一条写入SQL,它主要做什么事~~

2.连接器
-----

我们要执行写入SQL，一般在MySQL客户端, 需要输入连接命令，连接到MySQL服务端。在MySQL服务端，就是**连接器**负责跟你的客户端**建立连接、获取权限、维持和管理连接**。

连接命令如下：

```scss
mysql -h(ip地址) -P(端口) -u(用户名) -p
```

输入完连接命令之后，我们接着输入正确的密码，经过经典的TCP握手之后，就可以成功**连接**到MySQL服务器啦，如下：

```python
C:\MySQL\MySQL Server 8.0\bin>mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password: ******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 50
Server version: 8.0.31 MySQL Community Server - GPL

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

如果输入密码错误，则会收到一个 `Access denied`的错误信息，如下：

```arduino
C:\Program Files\MySQL\MySQL Server 8.0\bin>mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password: *****
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
```

连接成功之后，大家就可以直接输入写入SQL，就可以看到结果啦。

```scss
mysql> insert into user_score_tab(user_id,score) values(888,10);
Query OK, 1 row affected (0.02 sec)
```

3\. 查询缓存（Query Cache）
---------------------

在**5.6 及更早的MySQL版本**中，连接成功后，会提供查询缓存，来优化**查询SQL**。如果你查询的表进行更新、插入的时候，**会清空缓存的**。因此，当你执行写入SQL，会清空缓存。

其实，MySQL比较新的版本，如8.0 已经彻底废弃了查询缓存。因为在高并发和大型数据库环境下，查询缓存可能导致性能问题，并且在实际测试中发现，禁用查询缓存可能会提高整体性能和可伸缩性。

4\. 分析器
-------

你扔个**写入SQL**给MySQL服务器，它肯定需要先解析，才知道这个SQL是做什么的，对吧。

它会派出分析器，先做**词法分析**。你提交过来的写入SQL是由很多个字符串和空格组成的，MySQL会先解析出这些字符串表示什么意思。比如这个插入SQL:

```scss
insert into user_score_tab(user_id,score) values(888,10);
```

它会把关键字`insert into`解析出来，然后把`user_score_tab`解析成表，`user_id`、score解析成列名。做完词法分析之后，开始做**语法分析**。语法分析主要就是判断，你的SQL是否满足MYSQL的语法。

如果你的SQL写错了，语法分析就会报错误提示：`ERROR 1064 (42000): You have an error in your SQL syntax;`

```scss
mysql> inser into user_score_tab(user_id,score) value(888,10);
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'inser into user_score_tab(user_id,score) value(888,10)' at line 1
```

平时大家看到这个错误的时候，只需要，关注关键词 `syntax to use near` 就可以快速知道哪里写错啦。比如这个例子，就是我的`insert`写错了，少了`t`。

做完词法分析和语法分析解析，就知道这是**一条插入SQL**。

5\. 优化器
-------

对于**简单的插入SQL语句**，优化器并不会执行复杂的查询计划生成工作。

优化器会处理索引的选择与维护，但并不涉及复杂的查询优化。如果表中存在主键或索引，优化器会确保索引的更新以保证数据一致性，并在插入数据时检查约束条件。

**INSERT语句也会生成执行计划**，它详细描述了数据库如何访问数据、使用哪些索引、以及数据的处理顺序等

6\. 执行器
-------

> 执行器负责执行具体的 SQL 操作，是数据库系统的核心执行模块。对于`INSERT`语句，执行器会负责实际的数据写入过程。

*   **确定插入位置**：根据优化器的执行计划，执行器会决定将数据插入表的具体位置，比如根据主键或唯一索引找到插入点。
*   **加载数据页**：如果要插入的数据页在内存（Buffer Pool）中，则直接使用；如果不在内存中，**则需要从磁盘加载对应的数据页到内存。**
*   **更新索引**：如果表中有索引（如主键、唯一索引或其他索引），执行器也会相应更新这些索引。

7\. Buffer Pool
---------------

> **Buffer Pool** 是 MySQL InnoDB 存储引擎中的一块内存区域，专门用来缓存数据库表的数据页、索引页等内容。它的主要目的是提高数据读写性能，减少磁盘 I/O 操作.

*   **数据写入内存中的数据页**：执行器将新数据插入到**Buffer Pool**中的相应数据页。这是一个**内存操作**，而不是直接修改磁盘上的文件。

8\. undo log
------------

**生成 Undo Log** 在真正插入数据之前，InnoDB 会生成 **undo log**。对于插入操作，undo log 记录的是如何删除当前插入的记录（这用于事务回滚时撤销插入操作）。 **为什么生成 undo log？**

> 在事务回滚时，MySQL 需要撤销未提交的操作。通过 undo log，MySQL 能够删除已经插入但未提交的记录，确保事务的原子性。

9\. Redo Log
------------

> 执行器在插入数据后，立即将这个操作记录在 **redo log** 中

*   **写入 redo log**：为了确保数据的可靠性，MySQL采用了**预写日志（Write-Ahead Logging, WAL）**机制。在数据真正写入磁盘前，首先会将这个操作记录在**redo log**中。

过程是怎样的呢？

> MySQL首先将操作写入**redo log**，并标记为\*\*预提交（prepare）\*\*状态。这意味着如果崩溃，MySQL可以通过redo log将操作重做，从而恢复数据。

10\. 写入 Binlog
--------------

*   **写入 binlog**：在写入 redo log 的同时，MySQL还会将这次操作写入**binlog**，用于**数据库复制和灾难恢复**。

> binlog是 MySQL 的逻辑日志，记录了SQL操作细节，比如（`INSERT INTO`）。不同于redo log的物理日志。

11\. 事务提交（两阶段提交）
----------------

在两阶段提交机制下，MySQL会在事务提交时更新 redo log 为**commit**状态。

为什么需要两阶段提交？

> 确保 binlog 和 redo log 的一致性。如果系统崩溃，MySQL可以通过 redo log 重做操作，并通过 binlog 进行恢复。

12\. 数据刷入磁盘
-----------

> 执行器不会立即将内存中的脏页同步到磁盘。后台线程会根据一定的策略（如定时刷新等），异步地将 Buffer Pool 中的脏页刷到磁盘上的表空间文件中。 - 这样可以避免频繁的磁盘 I/O 提高性能。