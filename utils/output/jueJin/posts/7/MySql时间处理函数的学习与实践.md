---
author: "捡田螺的小男孩"
title: "MySql时间处理函数的学习与实践"
date: 2019-11-24
description: "日常业务开发中，我们经常需要跟SQl的日期打交道，比如查询最近30天的订单，查询某一个月的订单量，统计某天每小时的下单量等等，于是整理了以下MySql时间处理函数。 定义 向日期添加指定的时间间隔。 定义 从日期减去指定的时间间隔。 定义 表示返回日期是星期几，记住：星期…"
tags: ["MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:24,comments:0,collects:33,views:3263,"
---
前言
--

日常业务开发中，我们经常需要跟SQl的日期打交道，比如查询最近30天的订单，查询某一个月的订单量，统计某天每小时的下单量等等，于是整理了以下MySql时间处理函数。

### DATE\_ADD()

**定义:** 向日期添加指定的时间间隔。

**语法格式：**

```
DATE_ADD(date,INTERVAL expr unit)
```

**demo：**

```
mysql> SELECT DATE_ADD('2018-05-01',INTERVAL 1 DAY);
-> '2018-05-02'

//如果你查最近七天内的订单，可以这样：
mysql> SELECT * FROM `order` WHERE OrderDate>=DATE_ADD(NOW(),INTERVAL -7 DAY);
```

### DATE\_SUB()

**定义:** 从日期减去指定的时间间隔。

**语法格式：**

```
DATE_SUB(date,INTERVAL expr unit)
```

**demo：**

```
SELECT DATE_SUB('2018-05-01',INTERVAL 1 YEAR);
-> '2017-05-01'
//如果你查最近七天内的订单，可以这样：
select * from `order` where OrderDate>=DATE_SUB(NOW(),INTERVAL 7 DAY);
```

### DATEDIFF()

**定义:** 返回两个日期之间的天数

**语法格式：**

```
DATEDIFF(expr1,expr2)
```

**demo：**

```
mysql> SELECT DATEDIFF('2007-12-31 23:59:59','2007-12-30');
-> 1
mysql> SELECT DATEDIFF('2010-11-30 23:59:59','2010-12-31');
-> -31
//如果你查最近30天内的订单，可以这样：
select * from `order` where DATEDIFF(NOW(),OrderDate)<=30;
```

### DAYOFWEEK()

**定义:** 表示返回日期是星期几，记住：星期天=1，星期一=2， ... 星期六=7

**语法格式：**

```
DAYOFWEEK(date)
```

**demo：**

```
mysql> SELECT DAYOFWEEK('2007-02-03');
-> 7
//查询星期六下的订单
mysql> SELECT * FROM `order` WHERE DAYOFWEEK(OrderDate) =7;
```

### MONTH()

**定义:** 返回date是当年的第几月，1月就返回1，... ,12月就返回12

**语法格式：**

```
MONTH(date)
```

**demo：**

```
mysql> SELECT MONTH('2019-11-24');
-> 11
//查看今年11月份下的订单
SELECT * FROM `order` WHERE OrderDate>= '2019-01-01' and MONTH(OrderDate) =11 ;
```

### YEAR()

**定义:** 返回date是年份，从1000到9999.

**语法格式：**

```
YEAR(date)
```

**demo：**

```
mysql> SELECT YEAR('1987-01-01');
-> 1987
// 查看2018年下的订单总数
SELECT count(*) FROM `order` WHERE Year(OrderDate) =2018 ;
```

### HOUR()

**定义:** 返回该date或者time的hour值，值范围（0-23).

**语法格式：**

```
HOUR(time)
```

**demo：**

```
mysql> SELECT HOUR('10:05:03');
-> 10
// 查看2019年双11，0点下单量
SELECT count(*) FROM `order` WHERE  OrderDate BETWEEN '2019-11-11' and '2019-11-12' and HOUR(OrderDate) =0 ;
```

### DATE\_FORMAT()

**定义：** 用于以不同的格式显示日期/时间数据。。

**语法格式：**

```
DATE_FORMAT(date,format)
```

date为对应的日期，fromat为输出格式。format的格式如下：

格式

描述

%a

缩写星期名

%b

缩写月名

%c

月，数值

%D

带有英文前缀的月中的天

%d

月的天，数值(00-31)

%e

月的天，数值(0-31)

%f

微秒

%H

小时 (00-23)

%h

小时 (01-12)

%i

分钟，数值(00-59)

%j

年的天 (001-366)

%M

月名

%m

月，数值(00-12)

%S

秒(00-59)

%T

时间, 24-小时 (hh:mm:ss)

%W

星期名

%Y

年，4 位

**demo：**

```
mysql> SELECT DATE_FORMAT('2009-10-04 22:23:00', '%W %M %Y');
-> 'Sunday October 2009'
mysql> SELECT DATE_FORMAT('2007-10-04 22:23:00', '%H:%i:%s');
-> '22:23:00'
// 统计2019年11月23号，每小时的下单量
select hour(OrderDate) as hour,count(*) as counts from `order` where
DATE_FORMAT(OrderDate,'%Y-%m-%d') = '2019-11-23'  group by hour(OrderDate);
```

### EXTRACT()

**定义：** 用于返回日期/时间的单独部分，比如年、月、日、小时、分钟等等。

**语法格式：**

```
EXTRACT(unit FROM date)
```

date 参数是合法的日期表达式。unit 参数可以是下列的值：

Unit值

SECOND

MINUTE

HOUR

DAY

WEEK

MONTH

YEAR

...

**demo：**

```
mysql> SELECT EXTRACT(YEAR FROM '2019-07-02');
-> 2019
mysql> SELECT EXTRACT(YEAR_MONTH FROM '2019-07-02 01:02:03');
-> 201907
mysql> SELECT EXTRACT(DAY_MINUTE FROM '2019-07-02 01:02:03');
-> 20102

//查询订单的年月日
mysql>SELECT EXTRACT(YEAR FROM OrderDate) AS OrderYear,
->EXTRACT(MONTH FROM OrderDate) AS OrderMonth,
->EXTRACT(DAY FROM OrderDate) AS OrderDay
->FROM `order`
```

### NOW()，CURDATE()，CURTIME()

**定义：**

*   NOW()返回当前的日期和时间
*   CURDATE() 返回当前的日期
*   CURTIME() 返回当前的时间

**语法格式：**

```
NOW()
CURDATE()
CURTIME()
```

**demo:**

![](/images/jueJin/16e9d00b99ff282.png)

### DATE(),DAY(), TIME()

**定义:**

*   DATE() 提取日期或日期/时间表达式的日期部分
*   DAY() 返回当月的几号 (1-31)
*   TIME() 提取日期或日期/时间表达式的时间部分

**语法格式：**

```
DATE(expr)
DAY(date)
TIME(expr)
```

**demo:**

```
mysql> SELECT DATE('2003-12-31 01:02:03');
-> '2003-12-31'
mysql> select day('2017-02-03');
->3
mysql>  SELECT TIME('2003-12-31 01:02:03');
-> '01:02:03'
mysql> SELECT TIME('2003-12-31 01:02:03.000123');
-> '01:02:03.000123'
```

参考与感谢
-----

*   MySql官网[](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdoc%2Frefman%2F8.0%2Fen%2Fdate-and-time-functions.html%23function_date-format "https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format")
*   [SQL Date 函数](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3school.com.cn%2Fsql%2Fsql_dates.asp "https://www.w3school.com.cn/sql/sql_dates.asp")（[www.w3school.com.cn/sql/sql\_dat…](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3school.com.cn%2Fsql%2Fsql_dates.asp%25EF%25BC%2589 "https://www.w3school.com.cn/sql/sql_dates.asp%EF%BC%89")

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。