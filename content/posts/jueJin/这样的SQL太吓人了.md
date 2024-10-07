---
author: "江南一点雨"
title: "这样的SQL太吓人了"
date: 2024-09-25
description: "昨天松哥在朋友圈发了这样一张图：很多小伙伴看到了能够快速发现问题，当company_id为null的时候，会导致全表更新。但是也有小伙伴不解，自己平时就是这么写的呀，也没什么问题，如果有问"
tags: ["后端","MySQL","Java"]
ShowReadingTime: "阅读4分钟"
weight: 1089
---
昨天松哥在朋友圈发了这样一张图：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4ac28b139a7441ed8fba8525a19ac443~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=RGIa6AXFDTkgoOVHrsTfjqUdC4c%3D)

很多小伙伴看到了能够快速发现问题，当 company\_id 为 null 的时候，会导致全表更新。

但是也有小伙伴不解，自己平时就是这么写的呀，也没什么问题，如果有问题，那么上面的 SQL 该怎么改呢？

松哥来和大家简单聊几句。

一 防止全表更新
--------

如果在生产环境中使用 UPDATE 语句更新表数据，此时如果忘记携带本应该添加的 WHERE 条件，那么后果不堪设想。

那么怎么避免这个问题呢？

二 sql\_safe\_updates
--------------------

sql\_safe\_updates 是 MySQL 数据库中的一个参数，它的作用是增强数据安全性，防止因误操作导致的数据丢失或破坏。

具体来说，当 sql\_safe\_updates 设置为 ON（启用）时，MySQL 将阻止执行没有明确 WHERE 子句的 UPDATE 或 DELETE 语句。这意味着如果试图运行一个不包含 WHERE 条件来限定更新或删除范围的 DML 语句，MySQL 会抛出一个错误。而当 sql\_safe\_updates 设置为 OFF（禁用）时，MySQL 不会对此类无条件更新或删除操作进行特殊限制，允许它们按常规方式执行

这个参数可以配置在会话级别或全局级别。

在会话级别，可以通过执行 `SET sql_safe_updates = 1;` 命令来启用，这只对当前连接有效。

在全局级别，可以通过 `SET GLOBAL sql_safe_updates = 1;` 命令或在 MySQL 配置文件中设置，这会影响服务器上所有新的会话，**但是这个配置不会修改当前会话**。

启用 sql\_safe\_updates 参数可以减少因人为失误引发的重大数据事故，尤其适合开发环境和对数据完整性要求严格的生产环境。

我们可以先执行 `SHOW VARIABLES LIKE '%sql_safe_updates%';` 查看当前配置：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b58a30e2c5664cd295d86db6fc62b730~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=cd1lPy1sYRx5RROLHwfl5oWOYC4%3D)

然后执行 `SET sql_safe_updates = 1;` 去更新，更新之后再去查看配置，发现 `sql_safe_updates` 就已经开启了：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/63c4e00c1391463d8d002168f051ca07~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=PXPCOHKmifZaRYFDpVKCbM4CN30%3D)

这个时候，假设我们执行如下 SQL：

sql

 代码解读

复制代码

`UPDATE user set username='javaboy';`

就会报一个错误：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c807724c0572459b8a330f4634282288~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=waB9v8jnSQG6HfeiPlFIDYbDUpw%3D)

> 需要注意的是，启用 sql\_safe\_updates 参数可能会影响现有应用程序的正常运行，特别是那些依赖于无条件更新或删除操作的程序，因此在生产环境中启用之前，必须确保所有相关的应用程序代码已经过严格审查和适配。

三 SQL 插件
--------

MyBatis-Plus 提供了一个非法 SQL 拦截插件叫做 IllegalSQLInnerInterceptor。这是 MyBatis-Plus 框架中的一个安全控制插件，用于拦截和检查非法 SQL 语句。

这个插件主要提供了四方面的功能：

*   识别并拦截特定类型的 SQL 语句，如全表更新、删除等高风险操作。
*   确保在执行查询时使用索引，以提高性能并避免全表扫描。
*   防止未经授权的全表更新或删除操作，减少数据丢失风险。
*   对包含 not、or 关键字或子查询的 SQL 语句进行额外检查，以防止逻辑错误或性能问题。

插件用法也简单，配置一个 Bean 即可：

java

 代码解读

复制代码

`@Configuration public class MybatisPlusConfig {     @Bean     public MybatisPlusInterceptor mybatisPlusInterceptor() {         MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();         // 添加非法SQL拦截器         interceptor.addInnerInterceptor(new IllegalSQLInnerInterceptor());         return interceptor;     } }`

配置完成后，如果执行了不带 where 条件的 update 或者 delete 语句，就会报如下错误。

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8d477abff55b4007b5413fd8fd601e41~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=53IT4zn%2BxCrGrm%2Fm5wJpMscWVBI%3D)

但是！！！

如果你的 SQL 后面有个 `where 1=1`，那么这样的 SQL 是不会被 IllegalSQLInnerInterceptor 插件识别并拦截的。

四 IDEA 插件
---------

利用 IDEA 的一些插件，也可以检测到有风险的 SQL，比如松哥常用的这个：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b159be4a4850406c988910ba389bd056~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5Y2X5LiA54K56Zuo:q75.awebp?rk3s=f64ab15b&x-expires=1727832330&x-signature=lq42uVwanSomHTrxX1Jdy%2Bqy21s%3D)

不过这些插件不一定能检测出来文章一开始所提出的问题。

五 Code Review
-------------

日常的 Code Review 也不可少，很多问题都是在 CR 的时候发现的。

六 问题解决
------

除了上面提到的各种办法之外，对于本文一开始提出的问题，这个有问题的 SQL 还可以做哪些修改呢？

欢迎小伙伴们评论区给出自己的答案～松哥也会在评论区给出我的看法！