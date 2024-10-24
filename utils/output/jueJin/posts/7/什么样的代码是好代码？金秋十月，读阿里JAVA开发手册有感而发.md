---
author: "捡田螺的小男孩"
title: "什么样的代码是好代码？金秋十月，读阿里JAVA开发手册有感而发"
date: 2019-10-19
description: "最近重温阿里巴巴Java开发手册这本书，思考了什么样的代码是好代码，给大家分享一下我的想法，有哪里不对，欢迎指出，感激不尽。 好的命名，命名易于理解，语义表达清晰。 是酝酿好代码的第一步。以下列举阿里JAVA开发手册的几点，都是在强调好的命名，以便于阅读。 抽象类命名使用 Ab…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:27,comments:4,collects:32,views:2508,"
---
前言
--

最近重温阿里巴巴Java开发手册这本书，思考了什么样的代码是好代码，给大家分享一下我的想法，有哪里不对，欢迎指出，感激不尽。

什么样的代码是好代码？
-----------

什么是好代码？实现了功能的代码只是合格的代码，而真正的好代码具有以下特点：

*   命名易于理解，语义表达清晰而不需人揣摩
*   代码逻辑清晰透明，层次分明
*   代码格式公整美观
*   性能效率高
*   安全性高

好的命名
----

好的命名，命名易于理解，语义表达清晰。 是酝酿好代码的第一步。以下列举阿里JAVA开发手册的几点，都是在强调好的命名，以便于阅读。

### 抽象类命名使用 Abstract 或 Base 开头；异常类命名使用 Exception 结尾；测试类 命名以它要测试的类的名称开始，以 Test 结尾。

理由：大家约定俗成这样写，阅读者一看这个类就知道它是抽象类还是异常类，岂不美哉。

推荐指数：五星

### 杜绝完全不规范的缩写，避免望文不知义。

理由：AbstractClass“缩写”命名成 AbsClass；condition“缩写”命名成 condi，此类随意缩写严重降低了代码的可阅读性

推荐指数：五星

### 为了达到代码自解释的目标，任何自定义编程元素在命名时，使用尽量完整的单词 组合来表达其意

正例：在 JDK 中，表达原子更新的类名为：AtomicReferenceFieldUpdater。

反例：变量 int a 的随意命名方式

理由：完整的单词，表达意思更清楚。

推荐指数：四星

### 如果模块、接口、类、方法使用了设计模式，在命名时需体现出具体模式。

正例：

```
public class OrderFactory;
public class LoginProxy;
public class ResourceObserver;
```

理由：将设计模式体现在名字中，有利于阅读者快速理解架构设计理念。

推荐指数：四星

### 不允许任何魔法值（即未经预先定义的常量）直接出现在代码中。

反例：

```
String key = "Id#taobao_" + tradeId;
cache.put(key, value);
```

理由：魔法值只有开发者自己知道，或者过一段时间他自己也不知道了。。。还谈何维护。。。

推荐指数：五星

### 枚举类名建议带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。

正例：枚举名字为 ProcessStatusEnum 的成员名称：SUCCESS / UNKNOWN\_REASON。

理由：枚举其实就是特殊的类，域成员均为常量，且构造方法被默认强制是私有。

推荐指数：三星

清晰的结构，分明的层次，明了的逻辑
-----------------

好的代码，还表现在清晰的结构，分明的层次，明了的逻辑。不仅表现在代码功能层明上，代码块、函数各司其职，符合设计模式设计理念，还表现在项目结构轮廓分明。列举了以下几点：

### 不要使用一个常量类维护所有常量，要按常量功能进行归类，分开维护。

正例：缓存相关常量放在类 CacheConsts 下，系统配置相关常量放在类 ConfigConsts 下。

理由：大而全的常量类，杂乱无章，使用查找功能才能定位到修改的常量，不利于理解和维护。

推荐指数：四星

### 一个过于冗长的函数或者一段需要注释才能让人理解用途的代码，可以考虑把它切分成一个功能明确的函数单元，并定义清晰简短的函数名，这样会让代码变得更加优雅。

反例：

```
private String name;
private Vector<Order> orders = new Vector<Order>();

    public void printOwing() {
    //print banner
    System.out.println("****************");
    System.out.println("*****customer Owes *****");
    System.out.println("****************");
    
    //calculate totalAmount
    Enumeration env = orders.elements();
    double totalAmount = 0.0;
        while (env.hasMoreElements()) {
        Order order = (Order) env.nextElement();
        totalAmount += order.getAmout();
    }
    
    //print details
    System.out.println("name:" + name);
    System.out.println("amount:" + totalAmount);
}

```

正例：

```
private String name;
private Vector<Order> orders = new Vector<Order>();

    public void printOwing() {
    
    //print banner
    printBanner();
    //calculate totalAmount
    double totalAmount = getTotalAmount();
    //print details
    printDetail(totalAmount);
}

    void printBanner(){
    System.out.println("****************");
    System.out.println("*****customer Owes *****");
    System.out.println("****************");
}

    double getTotalAmount(){
    Enumeration env = orders.elements();
    double totalAmount = 0.0;
        while (env.hasMoreElements()) {
        Order order = (Order) env.nextElement();
        totalAmount += order.getAmout();
    }
    return totalAmount;
}

    void printDetail(double totalAmount){
    System.out.println("name:" + name);
    System.out.println("amount:" + totalAmount);
}
```

推荐指数：四星

### 使用多态或者适当的设计模式替代复杂冗长的if...else/switch

比如：

```
    int getArea() {
        switch (shape){
        case SHAPE.CIRCLE:
        return 3.14 * _r * _r; break;
        case SHAPE.RECTANGEL;
        return width *,heigth;
    }
}
```

使用多态后：

```
    class Shape {
    int getArea(){};
}

    class Circle extends Shape {
        int getArea() {
        return 3.14 * r * r;
    }
}

    class Rectangel extends Shape {
        int getArea() {
        return width * heigth;
    }
}

```

推荐指数：三星

### 项目结构需要轮廓分明，简言之分包名划分清楚。

说明：如下为rocketMq源码项目结构图。

![](/images/jueJin/16ddfa5ef163968.png)

推荐指数：四星

代码格式优雅
------

优雅的代码格式，是使代码有个好看的皮囊，所以平时写代码注意用快捷键优化一下格式。

### 大括号的使用约定。如果是大括号内为空，则简洁地写成{}即可，不需要换行；如果 是非空代码块则

*   1） 左大括号前不换行。
*   2） 左大括号后换行。
*   3） 右大括号前换行。
*   4） 右大括号后还有 else 等代码则不换行；表示终止的右大括号后必须换行。

推荐指数：五星

### 左小括号和字符之间不出现空格；同样，右小括号和字符之间也不出现空格；而左大 括号前需要空格

反例：

```
if (空格 a == b 空格)
```

推荐指数：五星

### 不同逻辑、不同语义、不同业务的代码之间插入一个空行分隔开来以提升可读性。

说明：任何情形，没有必要插入多个空行进行隔开。

推荐指数：四星

效率性
---

单单有好看的皮囊当然还是不够，还要持久实用呢，才能称得上好腰杆代码。阿里开发手册以下几点，都有助于提高代码性能。当然，除了这些，还有日常开发中，哪些代码流程是否可以优化，哪些接口是否调用多了，那些代码是不是没用到。总之，这个要看自己总结与积累。

### 集合初始化时，指定集合初始值大小。

说明：HashMap 使用 HashMap(int initialCapacity) 初始化。

正例：initialCapacity = (需要存储的元素个数 / 负载因子) + 1。注意负载因子（即loader factor）默认为 0.75，如果暂时无法确定初始值大小，请设置为 16（即默认值）。

反例：HashMap 需要放置 1024 个元素，由于没有设置容量初始大小，随着元素不断增加，容 量 7 次被迫扩大，resize 需要重建 hash 表，严重影响性能。

推荐指数：四星

### 线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。

说明：使用线程池的好处是减少在创建和销毁线程上所消耗的时间以及系统资源的开销，解决 资源不足的问题。如果不使用线程池，有可能造成系统创建大量同类线程而导致消耗完内存或 者“过度切换”的问题。

### 对于接口性能，可以考虑缓存，分批，SQl索引等这些手段。

说明:以上几点，是针对代码块的性能优化。对于接口，跟SQL有关的话，考虑添加索引等手段，如果涉及大量数据，可以考虑分批思想，还可以考虑添加缓存，冷热数据区分等。

安全性
---

安全性对于好代码的判断标准，具有一票否决权。对于这一点，我们平时可以积累，避开以下一些雷区外，有时间可以看一些常用框架，中间件的源码，如rocketMq，sring，jdk源码等，学习里面一些写法，以及避开可能的坑。

### Object 的 equals 方法容易抛空指针异常，应使用常量或确定有值的对象来调用 equals

正例： `"test".equals(object);`

反例：`object.equals("test");`

说明：推荐使用 `java.util.Objects#equals`（JDK7 引入的工具类）

推荐指数：五星。

### ArrayList的subList结果不可强转成ArrayList，否则会抛出ClassCastException 异常，即 java.util.RandomAccessSubList cannot be cast to java.util.ArrayList

理由：subList 返回的是 ArrayList 的内部类 SubList，并不是 ArrayList 而是 ArrayList 的一个视图，对于 SubList 子列表的所有操作最终会反映到原列表上

推荐指数：五星。

### 用户请求传入的任何参数必须做有效性验证。

说明：忽略参数校验可能导致：

*   page size 过大导致内存溢出
*   恶意 order by 导致数据库慢查询
*   任意重定向
*   SQL 注入
*   反序列化注入
*   正则输入源串拒绝服务 ReDoS

说明：Java 代码用正则来验证客户端的输入，有些正则写法验证普通用户输入没有问题， 但是如果攻击人员使用的是特殊构造的字符串来验证，有可能导致死循环的结果。

推荐指数：五星。

### 慎用无界队列线程池，如newFixedThreadPool线程池导致的内存飙升。

说明：newFixedThreadPool线程池可能导致的内存飙升问题，是因为它使用了无界队列。所以这些点需要我们积累以及看一下常用类的源码，如线程池，AQS等等。

推荐指数：三星。

总结
--

所以具有以下几点特性的代码，就是好代码

*   好的命名
*   清晰的结构
*   优雅的格式
*   性能好，效率高
*   安全稳定

平时我们可以多点积累，看书，看源码，着这里给大家推荐几本书

*   阿里巴巴Java开发书册》
*   《重构 改善既有代码的设计》
*   《Spring源码深度解析》
*   《HeadFirst设计模式》

参考与感谢
-----

*   《阿里巴巴Java开发书册》
*   《重构 改善既有代码的设计》

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。