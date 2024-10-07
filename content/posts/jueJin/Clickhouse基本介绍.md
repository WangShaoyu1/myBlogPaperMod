---
author: "山间小僧"
title: "Clickhouse基本介绍"
date: 2021-04-07
description: "它是一个用于联机分析(OLAP)的列式数据库管理系统(DBMS)。这么存数据有什么特点呢，那就是做数据分析相当快，向行式数据库，以MySQL为例，定位某条记录很快，但是，做某一列的统计就不太行了。（MySQ我也颇有研究，有兴趣的可以留言，后续可能考虑出博客呦）绝大多数请求是…"
tags: ["数据库"]
ShowReadingTime: "阅读6分钟"
weight: 987
---
ClickHouse&列式数据库
================

简单介绍
----

ClickHouse最初是为YandexMetrica世界第二大Web分析平台而开发的 它是一个用于联机分析(OLAP)的列式数据库管理系统(DBMS)。 它是真正意义上的列式数据库，什么是列式数据库呢

列式数据库
-----

rowId

guid

name

001

aaa

zhangsan

002

bbb

fawaikuangtu

传统的行式数据库是这样存数据的

makefile

 代码解读

复制代码

`001:aaa,zhangsan 002:bbb,fawaikuangtu`

但是列式数据库存储是按照列进行存的，同一列的数据被存储在一起

makefile

 代码解读

复制代码

`aaa:001,bbb:002 zhangsan:001,fawaikuangtu:002`

这么存数据有什么特点呢，那就是做数据分析相当快，向行式数据库，以MySQL为例，定位某条记录很快，但是，做某一列的统计就不太行了。（MySQ我也颇有研究，有兴趣的可以留言，后续可能考虑出博客呦）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a84491438c6428f8741d2ceb88a8394~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8be3d6036cc4ad8b61167e792ea473a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

OLAP场景的关键特征
-----------

*   绝大多数请求是以读为主。
*   数据以相当大的批次（> 1000行）进行更新，而不是单行更新;或者根本不更新。
*   数据被添加到数据库，基本不怎么修改。
*   对于读取，大量的数据从数据库中抽取出来，但只有列的一个子集。
*   表是“宽的”，这意味着它们包含大量的列。
*   查询相对较少（通常每台服务器数百个查询或更少）。
*   对于简单的查询，允许大约50 ms的延迟。
*   列值相当小 - 数字和短字符串（例如，每个URL 60个字节）。
*   处理单个查询时需要高吞吐量（每台服务器每秒高达数十亿行）。
*   无事务处理。
*   数据一致性要求低- 每个查询有一个大表，其他所有的表都是小表。
*   查询结果显著小于源数据。也就是说，数据被过滤或聚合。结果可以放在单个服务器的内存中。

Clickhouse的特点
-------------

*   数据长度是固定的，避免长度不固定带来的cpu计算
*   可以压缩数据
*   可以在磁盘中存储
*   支持并发
*   支持分布式的查询处理
*   支持sql语法
*   不光按列存储，同事还按向量（列的一部分）进行处理
*   支持索引
*   支持近似计算
    *   各类聚合函数，如：distinct values, medians, quantiles
    *   于数据的部分样本进行近似查询
    *   不使用全部的聚合条件，通过随机选择有限个数据聚合条件进行聚合
*   并允许角色的访问控制（MySQL那一套）

安装
==

也可以自己下环境啊，我这里偷懒了，就用docker搭了，真香！

创建服务器实例

shell

 代码解读

复制代码

`$ mkdir $HOME/some_clickhouse_database $ docker run -d --name some-clickhouse-server --ulimit nofile=262144:262144 --volume=$HOME/some_clickhouse_database:/var/lib/clickhouse yandex/clickhouse-server`

创建客户端连接服务器

shell

 代码解读

复制代码

`$ docker run -it --rm --link some-clickhouse-server:clickhouse-server yandex/clickhouse-client --host clickhouse-server`

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9e6c92a45a74c81b2ec06f34eedb57b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

连接
==

clickhouse-client原生命令行客户端
-------------------------

如上图，clickhouse-client就是原生的命令行客户端，他是随着sever一起升级的，向下兼容，也就是说老版本不支持新特性，新特性兼容老版本，一般都是和server一起升级

### 命令参数

*   `--host, -h` -– 服务端的host名称, 默认是`localhost`。您可以选择使用host名称或者IPv4或IPv6地址。
*   `--port` – 连接的端口，默认值：9000。注意HTTP接口以及TCP原生接口使用的是不同端口。
*   `--user, -u` – 用户名。 默认值：`default`。
*   `--password` – 密码。 默认值：空字符串。
*   `--query, -q` – 使用非交互模式查询。
*   `--database, -d` – 默认当前操作的数据库. 默认值：服务端默认的配置（默认是`default`）。
*   `--multiline, -m` – 如果指定，允许多行语句查询（Enter仅代表换行，不代表查询语句完结）。
*   `--multiquery, -n` – 如果指定, 允许处理用`;`号分隔的多个查询，只在非交互模式下生效。
*   `--format, -f` – 使用指定的默认格式输出结果。
*   `--vertical, -E` – 如果指定，默认情况下使用垂直格式输出结果。这与`–format=Vertical`相同。在这种格式中，每个值都在单独的行上打印，这种方式对显示宽表很有帮助。
*   `--time, -t` – 如果指定，非交互模式下会打印查询执行的时间到`stderr`中。
*   `--stacktrace` – 如果指定，如果出现异常，会打印堆栈跟踪信息。
*   `--config-file` – 配置文件的名称。
*   `--secure` – 如果指定，将通过安全连接连接到服务器。
*   `--history_file` — 存放命令历史的文件的路径。
*   `--param_<name>` — 查询参数配置查询参数

支持http接口调用
----------

默认情况下，clickhouse-server会在8123端口上监控HTTP请求

rust

 代码解读

复制代码

`curl 'http://localhost:8123/?query=SELECT%201'`

在使用keepalive和传输编码chunked时，它在HTTP 1.1上不能很好地工作。

MySQL链接
-------

css

 代码解读

复制代码

 `mysql --protocol tcp -u default -P 9004`

JDBC驱动链接
--------

[github.com/ClickHouse/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FClickHouse%2Fclickhouse-jdbc "https://github.com/ClickHouse/clickhouse-jdbc")

数据类型
====

*   整数
    *   Int8-\[-128:127\]
    *   Int16-\[-32768:32767\]
    *   Int32-\[-2147483648:2147483647\]
    *   Int64-\[-9223372036854775808:9223372036854775807\]
*   无符号整数
    *   UInt8-\[0:255\]
    *   UInt16-\[0:65535\]
    *   UInt32-\[0:4294967295\]
    *   UInt64-\[0:18446744073709551615\]
*   浮点（也会丢失精度）
    *   Float32 - float
    *   Float64 - double
*   特殊浮点数
    *   inf 正无穷
    *   \-inf 负无穷
    *   NaN非数字
*   大数据类型（P:1～38多少个十进制数字，S:多少个小树）
    *   Decimal(P,S)
    *   Decimal32(S)
    *   Decimal64(S)
    *   Decimal128(S)
*   布尔类型
    *   没有特定的类型，可以用UInt8，限制为0或1
*   字符串
    *   String （任意长度）
    *   FixedString（N）(固定长，不达长度末尾补充空字节)
    *   UUID （16-byte ，可以用函数generateUUIDv4()生成）
*   日期
    *   Date 精确到日，可以插入日期字符串或10位的时间戳`INSERT INTO dt Values (1546300800, 1), ('2019-01-01', 2);`
    *   Datetime(\[timezone\]) 精确到秒`INSERT INTO dt Values (1546300800, 1), ('2019-01-01 00:00:00', 2);`
    *   DateTime64(precision, \[timezone\]) precision控制精度，timezone控制时区
*   枚举
    *   Enum8 eg.:Enum8('hello' = 1, 'world' = 2)
    *   Enum16
*   数组
    *   array(T)
*   其他
    *   Nest 改类型的每个子元素都是数组
    *   Tuple每个子类型都可以随意定义
    *   Nullable通常和上面各个类型放一起Nullable(Int8)，表示可以存放null
    *   IPv4
    *   IPv6
    *   Map

* * *

> 大致介绍如上，操作基本和MySQL类似，主要烦的是引擎，后续会更新 参考文献 [clickhouse.tech/docs/zh/](https://link.juejin.cn?target=https%3A%2F%2Fclickhouse.tech%2Fdocs%2Fzh%2F "https://clickhouse.tech/docs/zh/")