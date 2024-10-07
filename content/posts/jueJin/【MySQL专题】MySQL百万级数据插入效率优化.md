---
author: "Java白羊"
title: "【MySQL专题】MySQL百万级数据插入效率优化"
date: 2022-08-23
description: "由于压力测试，您需要在数据库中检索大量数据，但数据库中没有太多数据。因此，对于测试，您必须快速将大量临时数据插入数据库。有两种方法可以快速插入大量数据：一种是使用java代码实现;另一种是使用存储"
tags: ["MySQL","Java"]
ShowReadingTime: "阅读4分钟"
weight: 1129
---
携手创作，共同成长！这是我参与「掘金日新计划 · 8 月更文挑战」的第17天，[点击查看活动详情](https://juejin.cn/post/7123120819437322247 "https://juejin.cn/post/7123120819437322247")

场景
--

由于**压力测试**，您需要在数据库中检索大量数据，但数据库中没有太多数据。于是为了**测试**，就得往数据库里快速插入大量的**临时数据**。

有两种方法可以快速插入大量数据：

*   一种是使用**Java代码**实现；
*   另一种是使用数据库**存储过程**。

优化方向
----

直接使用foreach的方式，一条一条的直接插入数据到MySQL中，效率十分低下。大概10w数据量需要18秒左右，100w数据大概需要10多分钟甚至直接卡死了。因此，我们可以对数据插入过程进行优化，分为下面两个方面：

*   **数据提交方面**：批量提交
*   **数据库引擎方面**：MyisAM

因为批量提交是分批次提交数据，因此一次创建少量的数据再分批次提交到数据库，这样既保证了数据传递的效率又不会一次占满内存；

另外因为InnoDB的锁级别为行锁并且是事务性的，而MyisAM为表锁且无事务，因此MyisAM引擎对于频繁数据更新和插入的效率远大于InnoDB引擎。

下面我们来进行代码实践：

快速实践
----

### 1\. 创建数据表

首先，你必须有一个数据表，注意数据表的引擎，在构建表时使用MyISAM引擎，**MyISAM插入比InnoDB快得多**，因为InnoDB的事务支持要好得多，**并且在大多数情况下是default使用InnoDB，因此您可以在插入数据后将引擎从修改的MyISAM更换回为InnoDB**。

sql

 代码解读

复制代码

``CREATE TABLE `tb_data` (   `id` int(11) DEFAULT NULL,   `user_name` varchar(100) DEFAULT NULL,   `create_time` datetime DEFAULT NULL,   `random` double DEFAULT NULL ) ENGINE=MyISAM DEFAULT CHARSET=utf8;``

### 2\. 编写数据插入类

创建100w数据插入到MySQL的测试代码：

java

 代码解读

复制代码

`package com.test; ​ import java.sql.Connection; import java.sql.DriverManager; import java.sql.PreparedStatement; import java.sql.SQLException; ​ public class InsertDataDemo {     static Connection conn = null; ​     public static void initConn() throws ClassNotFoundException, SQLException { ​         String url = "jdbc:mysql://localhost:3306/testdb?"                 + "user=root&password=root&useUnicode=true&characterEncoding=UTF8&useSSL=false&serverTimezone=UTC"; ​         try {             // 动态加载mysql驱动             Class.forName("com.mysql.jdbc.Driver");             System.out.println("成功加载MySQL驱动程序");             conn = DriverManager.getConnection(url);         } catch (Exception e) {             e.printStackTrace();         }     } ​ ​     public static String randomStr(int size) {         //定义一个空字符串         String result = "";         for (int i = 0; i < size; ++i) {             //生成一个97~122之间的int类型整数             int intVal = (int) (Math.random() * 26 + 97);             //强制转换（char）intVal 将对应的数值转换为对应的字符，并将字符进行拼接             result = result + (char) intVal;         }         //输出字符串         return result;     } ​ ​     public static void insert(int insertNum) {         // 开时时间         Long begin = System.currentTimeMillis();         System.out.println("开始插入数据...");         // sql前缀         String prefix = "INSERT INTO tb_data (id, user_name, create_time, random) VALUES "; ​         try {             // 保存sql后缀             StringBuffer suffix = new StringBuffer();             // 设置事务为非自动提交             conn.setAutoCommit(false);             //为继承了Statement对象所有功能的预编译对象，性能和防SQL注入优于Statement对象，常用于重复执行的批处理命令             PreparedStatement pst = conn.prepareStatement("");             for (int i = 1; i <= insertNum; i++) {                 // 构建sql后缀(并一次生成8条数据)                 suffix.append("(" + i +",'"+ randomStr(8)  + "', SYSDATE(), " + i * Math.random() + "),");             }             // 构建完整sql             String sql = prefix + suffix.substring(0, suffix.length() - 1);             // 添加执行sql             pst.addBatch(sql);             // 执行操作(批处理)             pst.executeBatch();             // 提交事务             conn.commit();                    // 关闭连接             pst.close();             conn.close();         } catch (SQLException e) {             e.printStackTrace();         }         // 结束时间         Long end = System.currentTimeMillis();         System.out.println("插入"+insertNum+"条数据数据完成！");         System.out.println("耗时 : " + (end - begin) / 1000 + " 秒");     } ​ ​     public static void main(String[] args) throws SQLException, ClassNotFoundException { ​         initConn();         insert(1000000); ​     } }`

### 3\. 测试数据插入

**注意**，这里有两个坑：**1\. MySQL连接器版本**；2. **MySQL最大内存值限制**。

> 第一个问题：MySQL连接器版本过高或过低，需要固定依赖版本

执行后，会出现下面的错误：

![image-20200825022534929](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59a5fe9c1ea845908565691ca4457485~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

python

 代码解读

复制代码

``Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary. Successfully loaded MySQL driver Start Inserting Data... java.sql.SQLException: SQL String cannot be empty``

解决方式就是：将下面mysql连接器依赖版本替换为5.1.47

[![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9049f4c1a0af4c4fbdbbe53e43eb4cc4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fdeepinsea%2FPicBed%2Fraw%2Fmaster%2Fimages%2Fimage-20200825022713029.png "https://gitee.com/deepinsea/PicBed/raw/master/images/image-20200825022713029.png")

xml

 代码解读

复制代码

 `<dependency>             <groupId>mysql</groupId>             <artifactId>mysql-connector-java</artifactId>             <version>5.1.47</version>             <scope>runtime</scope>         </dependency>`

> 第二个问题：MySQL最大限制内存过小

修改MySQL驱动版本为5.1+版本后，发现控制台报OOM异常：

![image-20200825030453797](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fe6a305a63844d4b8321582867ba7e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

csharp

 代码解读

复制代码

`java.sql.BatchUpdateException: Packet for query is too large (50235460 > 1048576). You can change this value on the server by setting the max_allowed_packet' variable.`

仔细分析下，其实批处理插入数据的方式也是基于内存的，在批量提交的时候也会有一定内存的占用率。因此，应该是超过了MySQL最大内存限制导致的。

查看my.ini配置文件，发现MySQL数据库引擎内存最大值为1M(5.7版本默认是1M)，得到验证。

查看内存大小：

sql

 代码解读

复制代码

`mysql> show VARIABLES like '%max_allowed_packet%';`

![image-20200825025548421](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07bda0e64f5c49ef99ed9dcc57e9909c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

控制台修改内存大小（也可直接修改my.ini配置文件）

ini

 代码解读

复制代码

`mysql> mysql --max_allowed_packet=500M 或 set global max_allowed_packet = 4*1024*1024*10`

保存，重启MySQL服务

![image-20200825030322144](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef3c86b3b53a48d5a7c75fd93a2b5818~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image-20200825030908540](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f816beb28a9d4cd58ee54023a531c703~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

最后，控制台输出：

kotlin

 代码解读

复制代码

`Successfully loaded MySQL driver Start Inserting Data... insert1000000 data data is completed! Time-consuming : 7seconds ​ Process finished with exit code 0`

数据库显示

![image-20200825031237631](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92a06d105a2747d583f0e3aaa4be86c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

到这里已经实现了快速插入100w数据到MySQL数据库，测试成功！

**注意事项**

适当增加mysql的max\_allowed\_packet参数值允许系统在客户端到服务器端传递大数据时分配更多扩展内存以进行处理。 修改mysql配置文件（不能直接通过命令行进行修改）：

ini

 代码解读

复制代码

`[mysqld] # 没有不需要添加 net_buffer_length=512k ​ max_allowed_packet=500M`

**\-- 更改引擎的语句** ALTER TABLE 表名 ENGINE=**MyISAM**;

**\-- 更改引擎的语句** ALTER TABLE 表明 ENGINE=**InnoDB**

总结
--

相比较于for循环直接插入而言，使用批处理提交的方式进行百万级别的数据插入，效率的确得到了极大地提升！

如果数据量再提升一个或几个量级，那么就需要考虑多线程和批量提交相结合的方式了，并且可以使用异步批处理的方式进行进一步优化，这里就不进行深入探究了。

**欢迎点赞关注评论，感谢观看ヾ(◍°∇°◍)ﾉﾞ**