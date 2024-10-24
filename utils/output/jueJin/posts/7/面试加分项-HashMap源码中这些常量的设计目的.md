---
author: "捡田螺的小男孩"
title: "面试加分项-HashMap源码中这些常量的设计目的"
date: 2019-09-07
description: "之前周会技术分享，一位同事讲解了HashMap的源码，涉及到一些常量设计的目的，本文将谈谈这些常量为何这样设计，希望大家有所收获。 HashMap默认初始化大小为什么是16，这里分两个维度分析，为什么是2的幂，为什么是16而不是8或者32。 我们知道HashMap的底层数据结构…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:78,comments:0,collects:124,views:7229,"
---
![](/images/jueJin/16d0b2acfb4aeee.png)

前言
--

之前周会技术分享，一位同事讲解了HashMap的源码，涉及到一些常量设计的目的，本文将谈谈这些常量为何这样设计，希望大家有所收获。

HashMap默认初始化大小为什么是1 << 4（16）
----------------------------

```
/**
* The default initial capacity - MUST be a power of two.
*/
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
```

HashMap默认初始化大小为什么是16，这里分两个维度分析，为什么是2的幂，为什么是16而不是8或者32。

### 默认初始化大小为什么定义为2的幂？

```
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
    boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
    n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
    tab[i] = newNode(hash, key, value, null);
```

我们知道HashMap的底层数据结构是数组+链表/数组+红黑树，由以上方法，可以发现数组下标索引的定位公式是：`i = (n - 1) & hash`，当初始化大小n是2的倍数时，`(n - 1) & hash`等价于`n%hash`。定位下标一般用取余法，为什么这里不用取余呢？

*   因为，与运算（&）比取余（%）运算效率高
*   求余运算： a % b就相当与a-(a / b)\*b 的运算。
*   与运算： 一个指令就搞定

因此，默认初始化大定义为2的幂，就是为了**使用更高效的与运算**。

### 默认初始化大小为什么是16而不是8或者32？

如果太小，4或者8，**扩容比较频繁**；如果太大，32或者64甚至太大，又**占用内存空间**。

**打个比喻**，假设你开了个情侣咖啡厅，平时一般都是7,8对情侣来喝咖啡，高峰也就10对。那么，你是不是设置8个桌子就好啦，如果人来得多再考虑加桌子。如果设置4桌，那么就经常座位不够要加桌子，如果设置10桌或者更多，那么肯定占地方嘛。

默认加载因子为什么是0.75
--------------

```
/**
* The load factor used when none specified in constructor.
*/
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```

**加载因子**表示哈希表的填满程度，跟扩容息息相关。为什么不是0.5或者1呢？

如果是0.5，就是说哈希表填到一半就开始扩容了，这样会导致**扩容频繁**，并且空间利用率比较低。 如果是1，就是说哈希表完全填满才开始扩容，这样虽然空间利用提高了，但是**哈希冲突**机会却大了。可以看一下源码文档的解释：

```
* <p>As a general rule, the default load factor (.75) offers a good
* tradeoff between time and space costs.  Higher values decrease the
* space overhead but increase the lookup cost (reflected in most of
* the operations of the <tt>HashMap</tt> class, including
* <tt>get</tt> and <tt>put</tt>).  The expected number of entries in
* the map and its load factor should be taken into account when
* setting its initial capacity, so as to minimize the number of
* rehash operations.  If the initial capacity is greater than the
* maximum number of entries divided by the load factor, no rehash
* operations will ever occur.
```

翻译大概意思是：

作为一般规则，默认负载因子（0.75）在时间和空间成本上提供了良好的权衡。负载因子数值越大，空间开销越低，但是会提高查找成本（体现在大多数的HashMap类的操作，包括get和put）。设置初始大小时，应该考虑预计的entry数在map及其负载系数，并且尽量减少rehash操作的次数。如果初始容量大于最大条目数除以负载因子，rehash操作将不会发生。

简言之， **负载因子0.75** 就**是冲突的机会** 与**空间利用率**权衡的最后体现，也是一个程序员实验的经验值。

StackOverFlow有个回答这个问题的： [What is the significance of load factor in HashMap?](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F10901752%2Fwhat-is-the-significance-of-load-factor-in-hashmap "https://stackoverflow.com/questions/10901752/what-is-the-significance-of-load-factor-in-hashmap")

![](/images/jueJin/16d0a992b6a56d6.png)

**这个回答解释**：一个bucket空和非空的概率为0.5，通过牛顿二项式等数学计算，得到这个loadfactor的值为log（2），约等于**0.693**。

最后选择选择0.75，可能0.75是接近0.693的四舍五入数中，比较好理解的一个，并且默认容量大小16\*0.75=12，为一个整数。

链表转换红黑树的阀值为什么是8
---------------

```
/**
* The bin count threshold for using a tree rather than list for a
* bin.  Bins are converted to trees when adding an element to a
* bin with at least this many nodes. The value must be greater
* than 2 and should be at least 8 to mesh with assumptions in
* tree removal about conversion back to plain bins upon
* shrinkage.
*/
static final int TREEIFY_THRESHOLD = 8;
```

JDK8及以后的版本中，HashMap底层数据结构引入了红黑树。当添加元素的时候，如果桶中链表元素超过8，会自动转为红黑树。那么阀值为什么是8呢？请看HashMap的源码这段注释：

```
* Ideally, under random hashCodes, the frequency of
* nodes in bins follows a Poisson distribution
* (http://en.wikipedia.org/wiki/Poisson_distribution) with a
* parameter of about 0.5 on average for the default resizing
* threshold of 0.75, although with a large variance because of
* resizing granularity. Ignoring variance, the expected
* occurrences of list size k are (exp(-0.5) * pow(0.5, k) /
* factorial(k)). The first values are:
*
* 0:    0.60653066
* 1:    0.30326533
* 2:    0.07581633
* 3:    0.01263606
* 4:    0.00157952
* 5:    0.00015795
* 6:    0.00001316
* 7:    0.00000094
* 8:    0.00000006
* more: less than 1 in ten million
```

理想状态中，在随机哈希码情况下，对于默认0.75的加载因子，桶中节点的分布频率服从参数为0.5的泊松分布，即使粒度调整会产生较大方差。

由对照表，可以看到链表中元素个数为8时的概率非常非常小了，所以链表转换红黑树的阀值选择了8。

一个树的链表还原阈值为什么是6
---------------

```
/**
* The bin count threshold for untreeifying a (split) bin during a
* resize operation. Should be less than TREEIFY_THRESHOLD, and at
* most 6 to mesh with shrinkage detection under removal.
*/
static final int UNTREEIFY_THRESHOLD = 6;
```

上一小节分析，可以知道，链表树化阀值是8，那么树还原为链表为什么是6而不是7呢？这是为了**防止链表和树之间频繁的转换**。如果是7的话，假设一个HashMap不停的插入、删除元素，链表个数一直在8左右徘徊，就会频繁树转链表、链表转树，效率非常低下。

最大容量为什么是1 << 30
---------------

```
/**
* The maximum capacity, used if a higher value is implicitly specified
* by either of the constructors with arguments.
* MUST be a power of two <= 1<<30.
*/
static final int MAXIMUM_CAPACITY = 1 << 30;
```

### HashMap为什么要满足2的n次方？

由第一小节（**HashMap默认初始化大小为什么是1 << 4**）分析可知，HashMap容量需要满足2的幂，与运算比取余运算效率高。只有容量是2的n次方时，与运算才等于取余运算。

```
tab[i = (n - 1) & hash]
```

### 为什么不是2的31次方呢？

我们知道，int占**四个字节**，**一个字节占8位**，所以是32位整型，也就是说最多32位。那按理说，最大数可以向左移动31位即2的31次幂，在这里为什么**不是2的31次方呢**？

实际上，二进制数的最左边那一位是符号位，用来表示正负的，我们来看一下demo代码：

```
System.out.println(1<<30);
System.out.println(1<<31);
System.out.println(1<<32);
System.out.println(1<<33);
System.out.println(1<<34);
```

输出：

```
1073741824
-2147483648
1
2
4
```

所以，HashMap最大容量是1 << 30。

哈希表的最小树形化容量为什么是64
-----------------

```
/**
* The smallest table capacity for which bins may be treeified.
* (Otherwise the table is resized if too many nodes in a bin.)
* Should be at least 4 * TREEIFY_THRESHOLD to avoid conflicts
* between resizing and treeification thresholds.
*/
static final int MIN_TREEIFY_CAPACITY = 64;
```

这是因为容量低于64时，哈希碰撞的机率比较大，而这个时候出现长链表的可能性会稍微大一些，这种原因下产生的长链表，我们应该优先选择扩容而避免不必要的树化。

参考与感谢
-----

*   [HashMap的loadFactor为什么是0.75？](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F64f6de3ffcc1 "https://www.jianshu.com/p/64f6de3ffcc1")
*   [为什么java Hashmap 中的加载因子是默认为0.75](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fdff8f4641814 "https://www.jianshu.com/p/dff8f4641814")
*   [为什么HashMap中链表长度超过8会转换成红黑树](https://link.juejin.cn?target=https%3A%2F%2Fmy.oschina.net%2Fu%2F2935389%2Fblog%2F3031028 "https://my.oschina.net/u/2935389/blog/3031028")
*   [What is the significance of load factor in HashMap?](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F10901752%2Fwhat-is-the-significance-of-load-factor-in-hashmap "https://stackoverflow.com/questions/10901752/what-is-the-significance-of-load-factor-in-hashmap")
*   [HashMap的最大容量为什么是2的30次方](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fc8c60b543377 "https://www.jianshu.com/p/c8c60b543377")
*   [Java 程序员都该懂的 Java8 HashMap](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fb0334fb09fcf "https://www.jianshu.com/p/b0334fb09fcf")

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。