---
author: "Java3y"
title: "《阿里巴巴 Java开发手册》读后感"
date: 2018-11-16
description: "前一阵子一直在学Redis，结果在黄金段位被虐了，暂时升不了段位了，每天都拿不到首胜(好烦)。 趁着学校校运会，合理地给自己放了一个小长假，然后就回家了。回到家才发现当时618买了一堆书，这堆书还有没撕包装的呢于是我翻出了最薄的一本《阿里巴巴 Java开发手册》 这本书…"
tags: ["Java","阿里巴巴","后端","单元测试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:92,comments:10,collects:92,views:7163,"
---
前言
==

> 只有光头才能变强

前一阵子一直在学Redis，结果在黄金段位被虐了，暂时升不了段位了，每天都拿不到首胜(好烦)。

趁着学校校运会，**合理**地给自己放了一个小长假，然后就回家了。回到家才发现当时618买了一堆书，这堆书还有没撕包装的呢....于是我翻出了最薄的一本《阿里巴巴 Java开发手册》

![手册](/images/jueJin/16715081c423cd0.png)

这本书一共就90多页，一天就可以**通读**完了，看完之后我又来**水**博文了。

注意：

*   书上很多的规范是可以用IDE来避免的，也有很多之前已经知道的了。
*   所以，这篇文章**只记录**我认为比较重要，或者说是我之前开发时没有注意到的一些规范(知识点)。
*   该文章的内容肯定没有书上写得那么全的，如果感兴趣的同学可以去买一本来读一下~

PDF官方地址：

*   [github.com/alibaba/p3c](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fp3c "https://github.com/alibaba/p3c")

一、Java相关
========

1.  POJO是DO/DTO/BO/VO的统称，禁止命名为xxxPOJO
2.  获取多个对象的方法中list作为前缀
3.  获取统计值的方法用count作为前缀
4.  POJO类中的布尔类型(Boolean)的变量都不要加is前缀，否则部分框架解析会引起序列化错误
    *   如果你的变量名带is的话，比如isActive，框架解析的时候可能就当成active了。
5.  如果是形容能力的接口名称，取对应的形容词为接口名(通常是-able的形式)
6.  不允许任何魔法值(**未经预先定义的常量**)直接出现在代码中
7.  Object的euqals方法容易抛出空指针异常，应使用常量或者有值的对象来调用equals。推荐使用`java.util.Object#equals`工具类
8.  所有POJO**类的属性**全部使用**包装数据类型**，RPC的返回值和参数必须使用**包装**数据类型，所有的**局部变量**都使用**基本数据**类型。定义VO/DTO/DO等POJO类时，不要设定任何属性的默认值
    *   如果你的类属性使用int这样的基本数据类型，默认值是0。一般情况下该变量没有赋值，一般想表达的是不存在(null)，而不是0。
9.  构造方法禁止加入任何的业务逻辑，如果初始化逻辑可以放在init方法中。set/get方法也不要增加业务逻辑。
    *   如果set/get方法放入业务逻辑，有时候排查问题就变得很麻烦了
10.  工具类Arrays.asList()把数组转成List时，不能使用其修改集合的相关方法。比如说add、clear、remove
11.  在JDK7以及以上版本中，Comparator要**满足三个条件**，不然调用`Arrays.sort()或者Collections.sort()`会报异常。
    *   x，y 的比较结果和 y，x 的比较结果相反
    *   传递性：x>y并且y>z，那么x一定大于z
    *   对称性：x=y,则 x,z 比较结果和y，z比较结果相同
12.  使用entrySet遍历Map类集合K/V，而不是用keySet方式遍历
    *   keySet遍历了两次，一次是转成Iterator对象，一次是从hashMap中取出key所对应的value，如果JDK8可以使用Map.foreach方法
13.  线程资源必须**由线程池提供**，不允许在应用中自行显示创建线程。线程池**不允许用Executors创建**，通过ThreadPoolExecutor的方式创建，这样的处理方式能够让编写代码的工程师更加明确线程池的运行规则，规避资源耗尽的风险。
14.  SimpleDateFormat是**线程不安全的类**，一般不要定义为static变量，如果定义为static，必须加锁，或者使用DateUtils工具类
    *   如果是JDK8应用，可以使用Instant(针对**时间统计**等场景)代替Date，LocalDateTime代替Calendar，DateTimeFormatter代替SimpleDateFormat
15.  避免Random实例被多线程使用，虽然共享该实例是线程安全的，但会因竞争同一seed导致性能下降
    *   在JDK7之后，可以**直接使用API ThreadLocalRandom**，而在JDK7 之前，需要编码保证每个线程持有一个实例。
16.  **类、类属性、类方法的注释必须使用 Javadoc 规范**，使用 `/**内容*/` 格式，不得使用 `//xxx` 方式
17.  所有的**抽象方法**（包括接口中的方法）必须要用 Javadoc 注释，除了返回值、参数、异常说明外，还必须指出该方法做什么事情，实现什么功能。**所有的类都必须添加创建者和创建日期**。
18.  对于暂时被注释掉，后续可能恢复使用的代码片断，在注释代码的上方，使用三个斜杠`///`来说明注释代码的理由
19.  保证单元测试的**独立性**。为了保证单元测试稳定可靠且便于维护，单元测试之间**不能互相调用**，也**不能依赖执行的先后顺序**。
20.  高并发服务器建议调小TCP协议的time\_await超时时间，调大最大事件句柄数(fd)，

1.1值得说明的点
---------

一、不允许任何魔法值(**未经预先定义的常量**)直接出现在代码中

例子：

```

Negative example:
//Magic values, except for predefined, are forbidden in coding.
    if (key.equals("关注公众号：Java3y")) {
    //...
}

Positive example:
String KEY_PRE = "关注公众号：Java3y";
    if (KEY_PRE.equals(key)) {
    //...
}

```

ps:我猜是把先常量定义出来，后续引用/修改的时候就很方便了。

* * *

二、**Object的euqals方法容易抛出空指针异常，应使用常量或者有值的对象来调用equals**。推荐使用`java.util.Object#equals`工具类

java.util.Object#equals的源码(已经判断null的情况了)

```

    public static boolean equals(Object a, Object b) {
    return (a == b) || (a != null && a.equals(b));
}
```

* * *

三、工具类Arrays.asList()把数组转成List时，不能使用其修改集合的相关方法。

因为返回的ArrayList是一个**内部类**，并没有实现集合的修改方法。**后台的数据仍是数组**，这里体现的是适配器模式。

![ArrayList在这里是内部类](/images/jueJin/16715081c596982.png)

* * *

四、在JDK7以及以上版本中，Comparator要**满足自反性，传递性，对称性**，不然调用`Arrays.sort()或者Collections.sort()`会报异常。

> The implementor must ensure that sgn(compare(x, y)) == -sgn(compare(y, x)) for all x and y. (This implies that compare(x, y) must throw an exception if and only if compare(y, x) throws an exception.)

> The implementor must also ensure that the relation is transitive: ((compare(x, y)>0) && (compare(y, z)>0)) implies compare(x, z)>0.

> Finally, the implementor must ensure that compare(x, y)==0 implies that sgn(compare(x, z))==sgn(compare(y, z)) for all z.

*   1） x，y 的比较结果和 y，x 的比较结果相反。
*   2） 传递性：x>y,y>z,则 x>z。
*   3） 对称性：x=y,则 x,z 比较结果和 y，z 比较结果相同。

反例：下例中**没有处理相等**的情况，实际使用中可能会出现异常：

```

    new Comparator<Student>() {
    @Override
        public int compare(Student o1, Student o2) {
        return o1.getId() > o2.getId() ? 1 : -1;
    }
}
```

* * *

**使用entrySet遍历Map类集合K/V，而不是用keySet方式遍历**

首先我们来看一下使用keySet是如何遍历HashMap的：

```

    public static void main(String[] args) throws InterruptedException {
    
    HashMap<String, String> hashMap = new HashMap<>();
    hashMap.put("关注公众号:", "Java3y");
    hashMap.put("坚持原创", "Java3y");
    hashMap.put("点赞", "关注，转发，分享");
    
    
    // 得到keySet，遍历keySet得到所有的key
    Set<String> strings = hashMap.keySet();
    Iterator<String> iterator = strings.iterator();
        while (iterator.hasNext()) {
        
        // HashMap的每个key
        String key = iterator.next();
        
        // 通过key可以获得对应的value，如果有看过HashMap的同学知道get方法的时间复杂度是O(1)
        System.out.println("key = " + key + ", value = " + hashMap.get(key));
    }
    
}



```

再来看一下源码：

```

// 1. 得到keySet，如果不存在，则创建
    public Set<K> keySet() {
    Set<K> ks = keySet;
        if (ks == null) {
        ks = new KeySet();
        keySet = ks;
    }
    return ks;
}

// 2.初始化ks (实际上就是Set集合[HashMap的内部类]，在初始化时需要顺便初始化iterator)
    ks = new AbstractSet<K>() {
        public Iterator<K> iterator() {
            return new Iterator<K>() {
            private Iterator<Entry<K,V>> i = entrySet().iterator();
            
                public boolean hasNext() {
                return i.hasNext();
            }
            
                public K next() {
                return i.next().getKey();
            }
            
                public void remove() {
                i.remove();
            }
            };
        }
        
        };
        
        
        
        
```

再来看一下entrySet，**可以直接拿到key和value，不用再使用get方法来得到value，所以比keySet更加推荐使用**！

```

    public static void main(String[] args) throws InterruptedException {
    
    HashMap<String, String> hashMap = new HashMap<>();
    hashMap.put("关注公众号:", "Java3y");
    hashMap.put("坚持原创", "Java3y");
    hashMap.put("点赞", "关注，转发，分享");
    
    
    // 得到entrySet，遍历entrySet得到结果
    Set<Map.Entry<String, String>> entrySet = hashMap.entrySet();
    Iterator<Map.Entry<String, String>> iterator = entrySet.iterator();
        while (iterator.hasNext()) {
        Map.Entry<String, String> entry = iterator.next();
        System.out.println("key = " + entry.getKey() + ", value = " + entry.getValue());
    }
}
```

如果是JDK8的话，推荐直接使用`Map.forEach()`就好了，我们也来看看用法：

```

    public static void main(String[] args) throws InterruptedException {
    
    HashMap<String, String> hashMap = new HashMap<>();
    hashMap.put("关注公众号:", "Java3y");
    hashMap.put("坚持原创", "Java3y");
    hashMap.put("点赞", "关注，转发，分享");
    
    
    // forEach用法
    hashMap.forEach((key, value) -> System.out.println("key = " + key + ", value = " + value));
}

```

其实在源码里边我们可以发现，forEach实际上就是封装了entrySet，提供forEach给我们可以**更加方便**地遍历Map集合

```


// forEach源码
    default void forEach(BiConsumer<? super K, ? super V> action) {
    Objects.requireNonNull(action);
        for (Map.Entry<K, V> entry : entrySet()) {
        K k;
        V v;
            try {
            k = entry.getKey();
            v = entry.getValue();
                } catch(IllegalStateException ise) {
                // this usually means the entry is no longer in the map.
                throw new ConcurrentModificationException(ise);
            }
            action.accept(k, v);
        }
    }
```

* * *

五、SimpleDateFormat是**线程不安全的类**，一般不要定义为static变量，如果定义为static，必须加锁，或者使用DateUtils工具类。

有以下的例子可以正确使用SimpleDateFormat：

```

// 1. 在方法内部使用，没有线程安全问题
private static final String FORMAT = "yyyy-MM-dd HH:mm:ss";
    public String getFormat(Date date){
    SimpleDateFormat dateFormat = new SimpleDateFormat(FORMAT);
    return dateFormat.format(date);
}


// 2. 每次使用的时候加锁
private static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public void getFormat(){
        synchronized (SIMPLE_DATE_FORMAT){
        SIMPLE_DATE_FORMAT.format(new Date());
        ….;
    }
    
    // 3. 使用ThreadLocal，每个线程都有自己的SimpleDateFormat对象，互不干扰
        private static final ThreadLocal<DateFormat> DATE_FORMATTER = new ThreadLocal<DateFormat>() {
        @Override
            protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
        };
        
        // 4. 使用DateTimeFormatter(This class is immutable and thread-safe.)
        
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        System.out.println(timeFormatter.format(LocalDateTime.now()));
        
```

如果是JDK8应用，可以使用Instant代替Date，LocalDateTime代替Calendar，DateTimeFormatter代替SimpleDateFormat。

* * *

二、数据库相关
=======

1.  表达是否概念的字段，必须使用**isxxx的方式命名**，数据类型是**unsigned tinyint**(1表示是，0表示否)
2.  小数类型用**decimal**，禁止使用float和double。
3.  varchar是可变字符串，不预选分配存储空间的话，长度不要超过5000个字符。如果超过则用text，独立一张表，用主键对应，避免影响到其他字段的**索引效率**。
4.  表必备的三个字段：id(类型是unsigned bigint)，gmt\_create(创建时间)，gme\_modified(修改时间)
5.  字段允许适当冗余，以提高查询性能，但必须考虑数据一致性。冗余的字段必须**不是频繁修改的字段，不是varhar超长字段(更不能是text字段)**。
6.  单表行数**超过500万行或者单表容量超过2GB**才推荐进行**分库分表**(如果预计三年都达不到这个数据量，不要在创建表的时候就分库分表!)
7.  **超过三个表禁止使用join**，需要join的字段，数据类型必须保持一致，当多表关联查询时，保证**被关联的字段需要有索引**！
8.  在varchar字段上建立索引时，必须指定索引长度，**没必要对全字段建立索引**，页面搜索**严禁左模糊或者全模糊**，如果需要则通过搜索引擎来解决。
    *   充分利用好最左前缀匹配特性！
9.  利用**延迟关联**或者子查询优化超多也分场景。
10.  如果有全球化需要，均以utf-8编码。如果需要存储表情，选择utf8mb4进行存储。

2.1值得说明的点
---------

一、利用**延迟关联**或者子查询优化超多也分场景。

> MySQL并不是跳过 offset行，而是取 offset+N行，然后返回放弃前offset行，返回N行，那当 offset特别大的时候，效率就非常的低下，要么控制返回的总页数，要么对超过特定阈值的页数进行SQL改写。

例子：

```

// 优化前

SELECT id, cu_id, name, info, biz_type
, gmt_create, gmt_modified, start_time, end_time, market_type
, back_leaf_category, item_status, picuture_url
FROM relation
WHERE biz_type = '0'
AND end_time >= '2014-05-29'
ORDER BY id ASC
LIMIT 149420, 20;


// 优化后

SELECT a.*
FROM relation a, (
SELECT id
FROM relation
WHERE biz_type = '0'
AND end_time >= '2014-05-29'
ORDER BY id ASC
LIMIT 149420, 20
) b
WHERE a.id = b.id

```

解释：其实这里就是通过使用**覆盖索引查询返回需要的主键**,再根据**主键关联原表获得需要的数据**。这样就是**充分利用了索引**！

* * *

三、未解决的问题
========

在看《手册》的时候还有一些知识点没看过、没实践过、涉及到的知识点比较多的，在这里先**mark**一下，后续再遇到或者有空的时候再回来补坑~

*   使用CountDownLatch进行异步转同步操作，每个线程退出前必须调用 countDown方法，线程执行代码注意 catch 异常，确保 countDown 方法被执行到，避免主线程无法执行至 await 方法，直到超时才返回结果。说明： 注意，子线程抛出异常堆栈，不能在主线程 try-catch 到。
*   对于一写多读，是可以解决变量同步问题， 但是如果多写，同样无法解决线程安全问题。如果是 count++操作，使用如下类实现: `AtomicInteger count = new AtomicInteger(); count.addAndGet(1);`如果是 JDK8，推荐使用 LongAdder 对象，比 AtomicLong 性能更好(减少乐观锁的重试次数)。
*   使用JDK8的Optional类来防止NPE问题。

当然了，如果你有比较好的资料阅读，也可以在评论区告诉我。我也会mark住好好看看。

比如说：“3y，我发现Optional类有篇文章写得很不错，url是xxxx(书籍的名称是xxx)

* * *

由于现在没有一定的经验积累，所以以下的章节得回头看：

*   《手册》中的“日志规约”，“工程结构”、“设计规范”

最后
==

看我上面写的内容就知道，除了一些规范外，还有很多**实用**的小技巧，这些对我们开发是有帮助的。我这个阶段也有一些没怎么接触过的("日志","设计","二方库")，这些都需要我在**成长中不断的回看才行**。

*   ps:我会回来补坑的。

引用书上的一句话：

> 很多编程方式客观上没有对错之分，一致性很重要，可读性很重要，团队沟通效率很重要。程序员天生需要团队协作，而协作的正能量要放在问题的有效沟通上。个性化应尽量表现在系统架构和算法效率的提升上，而不是在合作规范上进行纠缠不休的讨论、争论，最后没有结论。

作者(孤尽)在知乎回答的一句话：

> **翻完了不代表记住了，记住了不代表理解了，理解了不代表能够应用上去，真正的知识是实践，实践，实践**。

如果你觉得我写得还不错，了解一下：

*   坚持**原创**的技术公众号：Java3y
*   文章的**目录导航**(精美脑图+海量视频资源)：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")