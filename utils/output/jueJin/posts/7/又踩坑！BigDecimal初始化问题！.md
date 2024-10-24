---
author: "捡田螺的小男孩"
title: "又踩坑！BigDecimal初始化问题！"
date: 2024-04-10
description: "大家好，我是田螺。 在日常开发中，BigDecimal类被广泛用于精确的数值、金额的计算。但是在使用BigDecimal的过程中，存在以下这几个坑，大家要注意一下哈"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:10,views:760,"
---
前言
--

大家好，我是田螺。

在日常开发中，BigDecimal类被广泛用于精确的数值、金额的计算。但是在使用BigDecimal的过程中，存在以下这几个坑，大家要注意一下哈

*   **公众号：捡田螺的小男孩**（坚持了5年后端技术文更新）

1.浮点数初始化的坑
----------

**反例:**

```csharp
BigDecimal problematic = new BigDecimal(0.1);
System.out.println("Problematic: " + problematic.toString());
//输出 Problematic: 0.1000000000000000055511151231257827021181583404541015625
```

可以发现，直接使用`new BigDecimal(double)`构造方法可能会得到一个看起来相当奇怪的结果。这是因为`double`本身的精度问题会被带入`BigDecimal`中。为了避免这个问题，推荐使用`String`参数的构造方法或者使用`BigDecimal.valueOf`方法，例如`new BigDecimal("0.1")`，这样可以确保BigDecimal的精度。

> 由于计算机的资源是有限的，所以是没办法用二进制精确的表示 0.1，只能用「近似值」来表示，就是在有限的精度情况下，最大化接近 0.1 的二进制数，于是就会造成精度缺失的情况。

**正例：**

```ini
BigDecimal problematic1 =  BigDecimal.valueOf(0.1);
System.out.println("Problematic: " + problematic1.toString());

BigDecimal problematic2 =  new BigDecimal("0.1");
System.out.println("Problematic: " + problematic2.toString());
//输出
Problematic: 0.1
Problematic: 0.1
```

2\. 比较数值时使用compareTo()方法而非equals()
----------------------------------

```ini
BigDecimal bd1 = new BigDecimal("0.10");
BigDecimal bd2 = new BigDecimal("0.1");
System.out.println(bd1.equals(bd2)); // 输出: false
System.out.println(bd1.compareTo(bd2) == 0); // 输出: true
```

BigDecimal的equals方法不仅比较数值，还会比较对象的scale（小数点后的位数）,如果只想比较数值，而不考虑`scale`，应该使用`compareTo`方法。

![](/images/jueJin/b0b4ef6d441945c.png)

3.做除法时，未指定精度可能异常
----------------

```ini
BigDecimal dividend = new BigDecimal("10");
BigDecimal divisor = new BigDecimal("3");
BigDecimal result = dividend.divide(divisor); // 未指定精度和舍入模式
System.out.println(result);
//输出
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
at java.math.BigDecimal.divide(BigDecimal.java:1693)
at com.example.demo.controller.Test.main(Test.java:26)
```

除法操作将`10`除以`3`，结果是无限循环小数`3.3333...`，但由于未指定精度和舍入模式，会抛出`ArithmeticException`异常。

官方有给出解释：

> "If the quotient has a nonterminating decimal expansion and the operation is specified to return an exact result, an ArithmeticException is thrown. Otherwise, the exact result of the division is returned, as done for other operations."

要使用`BigDecimal`时，要记得指定精度，避免因为精度问题带来的损失。

4\. BigDecimal转String，科学计数法展示问题
-------------------------------

```csharp
System.out.println( new BigDecimal("0.0000000000001").toString());
BigDecimal bigDecimal = new BigDecimal("1E+12");
System.out.println(bigDecimal.toString());
//输出 1E-13
//输出 1E+12
```

这是因为 `toString()` 某些场景下使用科学计数法展示。 如果不想用任何计数法，可以使用 `toPlainString()`

```csharp
System.out.println( new BigDecimal("0.0000000000001").toPlainString());
BigDecimal bigDecimal = new BigDecimal("1E+12");
System.out.println(bigDecimal.toPlainString());
//输出
0.0000000000001
1000000000000
```

5\. 注意使用setScale方法设置精度
----------------------

```ini
BigDecimal number = new BigDecimal("123.4567");
BigDecimal roundedNumber = number.setScale(2, RoundingMode.HALF_UP);
//输出
123.46
```

因为`BigDecimal`的精度是无限的，因此一般在计算的时候，要注意设置精度几位。

并且，`RoundingMode.HALF_UP` 是一种舍入模式，用于四舍五入，即当数字的一部分被舍去时，如果剩余部分大于或等于0.5，则向上舍入。除了`HALF_UP`之外，还有几个常用的舍入模式：

*   `UP`：远离零方向舍入的舍入模式。总是在非零舍弃部分之前增加数字。
*   `DOWN`：接近零方向舍入的舍入模式。总是在非零舍弃部分之前减少数字。
*   `CEILING`：接近正无穷大的方向舍入的舍入模式。如果BigDecimal是正的，则舍入行为与UP相同；如果是负的，则舍入行为与DOWN相同。
*   `FLOOR`：接近负无穷大的方向舍入的舍入模式。如果BigDecimal是正的，则舍入行为与DOWN相同；如果是负的，则舍入行为与UP相同。
*   `HALF_DOWN`：向“最近邻居”舍入，除非两边距离相等，此时向下舍入。
*   `HALF_EVEN`：向“最近邻居”舍入，除非两边距离相等，此时向偶数舍入。这种模式也称为“银行家舍入法”，因为它减少了累计错误。

还有一个点，就是：使用`setScale`方法实际上会产生一个全新的`BigDecimal`实例，而不会更改原有对象。所以，当你用`setScale`调整了数字精度后，别忘了把新生成的对象赋值回原来的变量。