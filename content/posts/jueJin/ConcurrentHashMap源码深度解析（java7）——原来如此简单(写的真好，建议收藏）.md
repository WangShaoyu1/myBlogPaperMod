---
author: "徐同学呀"
title: "ConcurrentHashMap源码深度解析（java7）——原来如此简单(写的真好，建议收藏）"
date: 2021-03-25
description: "ConcurrentHashMap算是java基础中非常基本的知识点，不仅在日常开发中经常用到，面试中也是经久不衰的话题。它基本沿用HashMap的接口定义，使得即使不了解其底层原理，也能无缝切换。谈到ConcurrentHashMap，经常会拿java7和java8的实现做…"
tags: ["Java"]
ShowReadingTime: "阅读15分钟"
weight: 539
---
一、前言
----

`ConcurrentHashMap`算是java基础中非常基本的知识点，不仅在日常开发中经常用到，面试中也是经久不衰的话题。它基本沿用`HashMap`的接口定义，使得即使不了解其底层原理，也能无缝切换。

谈到`ConcurrentHashMap`，经常会拿java7和java8的实现做对比。虽然现在java的版本更新很快，但是常用的还是java8，而看似java7的实现方式已经过时了，好像没必要去了解了，非也。

`ConcurrentHashMap`在java7中的实现有很多值得学习借鉴的地方，比如基本的数据结构数组链表的应用，并发开发，哈希算法等都可以学以致用。而且了解了java7的实现细节，才能更好的明白java8中为什么要做一些看似莫名其妙的优化？

轮子好用，但是造轮子更好玩。

1.  `ConcurrentHashMap`的数据结构是怎样的？
2.  `ConcurrentHashMap`的容量为什么是2的整数次方？
3.  如何实现的并发安全？是读写分离吗？get需要加锁吗？
4.  哈希冲突体现在哪里，如何解决？
5.  扩容思想是什么，怎么扩容？

带着问题探索源码，才能更容易get到作者的良苦用心。

二、初始化
-----

![ConcurrentHashMap-数据结构](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae33ef40b03246ca950cbcba53055cc6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) `ConcurrentHashMap` 初始化可自定义传入初始容量、负载因子和并发级别，但并不是单纯将值赋值给一些成员变量，而是需要经过计算，找到适合的初始值：

*   `initialCapacity` 初始容量，用于计算每个`Segment`中`HashEntry`数组的初始长度。
*   `loadFactor` 负载因子，用于计算每个`Segment`中`HashEntry`数组的扩容阈值。
*   `concurrencyLevel` 并发级别，用于计算`Segment`数组的固定长度。

初始化过程主要是对`Segment`数组和其内部的`HashEntry`数组进行初始化：

（1）通过`concurrencyLevel`计算`ssize`作为`Segment`数组的固定长度，需要确保计算的`ssize`是大于等于`concurrencyLevel`且离`concurrencyLevel`最近的2的整数次方的数值。如默认`concurrencyLevel=16`，则`ssize=16`；若自定义传入`concurrencyLevel=15`，则`ssize=16`；`concurrencyLevel=17`，则`ssize=32`。

（2）计算用于对key的哈希值进行映射成数组下标的`segmentShift`（偏移量）和`segmentMask`（掩码）（`int index=(hash >>> segmentShift) & segmentMask`）：

*   `segmentShift`，key的哈希值右移`segmentShift`位，最高`sshift`位用于哈希映射。
*   `segmentMask`，`ssize`的掩码，因为`ssize`为2的整数次方值，二进制为1后面若干0，掩码就是`ssize-1`，如2（10）掩码（1）、4（100）掩码3（11）、8（1000）掩码7（111）。

（3）通过`initialCapacity` 和`ssize`平均计算每个`Segment`内部`HashEntry`数组的初始长度，但并不是简单的`int c = initialCapacity / ssize`，而是像计算`ssize`一样，找到一个大于等于`c`且离`c`最近的2的整数次方数值。

（4）初始化第一个`Segment`，其他`Segment`等添加元素时用到了再创建。

（5）初始化`Segment`数组。

java

 代码解读

复制代码

`@SuppressWarnings("unchecked") public ConcurrentHashMap(int initialCapacity,                          float loadFactor, int concurrencyLevel) {     if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)         throw new IllegalArgumentException();     if (concurrencyLevel > MAX_SEGMENTS)         concurrencyLevel = MAX_SEGMENTS;     // Find power-of-two sizes best matching arguments     int sshift = 0;     int ssize = 1;     while (ssize < concurrencyLevel) {         ++sshift;         // 1.保证并发级别是2的整数次方，即Segment<K,V>[]数组的长度         // ssize = ssize << 1         // ssize = ssize * (2^1)         ssize <<= 1;     }     // 假设 ssize=16, sshift=4     // segmentShift = 28     // segmentMask = 15     // 2.用于对key的哈希值进行映射计算成数组下标的偏移量和掩码（int index=(hash >>> segmentShift) & segmentMask）。     // segmentShift:key的哈希值右移segmentShift位，最高sshift位用于计算。     // segmentMask:ssize的掩码，因为ssize为2的整数次方值，二进制为1后面若干0，掩码就是ssize-1，如2（10）掩码（1）、4（100）掩码3（11）、8（1000）掩码7（111）。     this.segmentShift = 32 - sshift; // 偏移量     this.segmentMask = ssize - 1; // 掩码     if (initialCapacity > MAXIMUM_CAPACITY)         initialCapacity = MAXIMUM_CAPACITY;     // 3.Segment<K,V>[]平均计算每一个Segment内部的HashEntry[]数组的长度     // 但是为了确保HashEntry链表的长度也是2的整数次方，用同样的方式找到离大于等于c且离c最近的2的整数次方的数     int c = initialCapacity / ssize;     if (c * ssize < initialCapacity)         ++c;     int cap = MIN_SEGMENT_TABLE_CAPACITY;     while (cap < c)         cap <<= 1;     // 4.create segments and segments[0]     // cap * loadFactor  HashEntry的容量 * loadFactor计算阈值     // 构造第0个Segment     Segment<K,V> s0 =             new Segment<K,V>(loadFactor, (int)(cap * loadFactor),                     (HashEntry<K,V>[])new HashEntry[cap]);     // 5.Segment数组不可扩容     Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];     UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]     this.segments = ss; }`

三、Segment是一个容器也是一把锁
-------------------

`Segment`继承自`ReentrantLock`，所以其具备并发锁的功能，在初始化时传入`concurrencyLevel`计算而得的数组长度`ssize`，代表最多有`ssize`个锁，也就决定了整个`ConcurrentHashMap`后续的最大并发级别是`ssize`（最多可以有`ssize`个线程获取锁操作容器）。

`Segment`内部又包含了一个`HashEntry`数组，用于存储`key-value`。

从后续的扩容原理了解，`Segment`数组后续是不扩容的，真正扩容的是其内部的`HashEntry`数组，所以`Segment`数组的长度的初始设置至关重要。

每一个`Segment`都有独立的`key-value`增删改和扩容机制，且操作前必须先获取锁以确保并发安全。

java

 代码解读

复制代码

`static final class Segment<K,V> extends ReentrantLock implements Serializable {     private static final long serialVersionUID = 2249069246763182397L;          /**      * 用于在竞争锁时最大自旋重试次数      * The maximum number of times to tryLock in a prescan before      * possibly blocking on acquire in preparation for a locked      * segment operation. On multiprocessors, using a bounded      * number of retries maintains cache acquired while locating      * nodes.      */     static final int MAX_SCAN_RETRIES =             Runtime.getRuntime().availableProcessors() > 1 ? 64 : 1;     /**      * 每一个HashEntry都是一个链表，然后组成一个HashEntry链表数组      * The per-segment table. Elements are accessed via      * entryAt/setEntryAt providing volatile semantics.      */     transient volatile HashEntry<K,V>[] table;     /**      * 元素的个数，不是线程安全的      * The number of elements. Accessed only either within locks      * or among other volatile reads that maintain visibility.      */     transient int count;     /**      * 修改总次数，线程不安全      * The total number of mutative operations in this segment.      * Even though this may overflows 32 bits, it provides      * sufficient accuracy for stability checks in CHM isEmpty()      * and size() methods.  Accessed only either within locks or      * among other volatile reads that maintain visibility.      */     transient int modCount;     /**      * HashEntry数组的扩容阈值，(int)(cap * loadFactor)      * count > threshold 且没有达到最大元素数量就扩容      * The table is rehashed when its size exceeds this threshold.      * (The value of this field is always <tt>(int)(capacity *      * loadFactor)</tt>.)      */     transient int threshold;     /**      * 装载因子，所有的segments都是一样的      * The load factor for the hash table.  Even though this value      * is same for all segments, it is replicated to avoid needing      * links to outer object.      * @serial      */      final float loadFactor;     Segment(float lf, int threshold, HashEntry<K,V>[] tab) {         this.loadFactor = lf;         this.threshold = threshold;         this.table = tab;     }     final V put(K key, int hash, V value, boolean onlyIfAbsent) {... ...}     final V remove(Object key, int hash, Object value) {... ...}     final boolean replace(K key, int hash, V oldValue, V newValue) {... ...}     final V replace(K key, int hash, V value) {... ...}     final void clear() {... ...} }`

四、HashEntry真正存放元素的链表数组
----------------------

`ConcurrentHashMap`解决哈希冲突的方式是链表法，即将哈希冲突的节点链接成一个个链表。

基本属性有`final`修饰的`hash`和`key`，一旦赋值不可修改，`volatile`修饰的`value`和`next`，修改时可以遵循`volatile`的语义，写happen-before读，立即刷新主内存。

java

 代码解读

复制代码

`static final class HashEntry<K,V> {     final int hash;     final K key;     volatile V value;     // java7之前，next是final修饰，     // java7进行了优化，在put时，若没有抢到锁，会自旋同时初始化一个HashEntry节点，为后面获取锁后节省时间     volatile HashEntry<K,V> next;     HashEntry(int hash, K key, V value, HashEntry<K,V> next) {         this.hash = hash;         this.key = key;         this.value = value;         this.next = next;     }     /**      * Sets next field with volatile write semantics.  (See above      * about use of putOrderedObject.)      */     final void setNext(HashEntry<K,V> n) {         UNSAFE.putOrderedObject(this, nextOffset, n);     }     // Unsafe mechanics     static final sun.misc.Unsafe UNSAFE;     static final long nextOffset;     static {         try {             UNSAFE = sun.misc.Unsafe.getUnsafe();             Class k = HashEntry.class;             nextOffset = UNSAFE.objectFieldOffset                     (k.getDeclaredField("next"));         } catch (Exception e) {             throw new Error(e);         }     } }`

五、put添加元素
---------

java

 代码解读

复制代码

`public V put(K key, V value) {     Segment<K,V> s;     if (value == null)         throw new NullPointerException();     int hash = hash(key); // 计算出对应的哈希值     // 假设 ssize=16, sshift=4     // segmentShift = 28     // segmentMask = 15     // 计算的hash向右移28位在与segmentMask作与操作，即以hash值的最高4位映射计算对应的Segment数组下标j     // 找到对应Segment的位置j，如果该位置的segment还未设置则需要先初始化     int j = (hash >>> segmentShift) & segmentMask;     if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck             (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment         // cas 初始化segment         s = ensureSegment(j);     // segment的put内部加锁，所以是分段锁     return s.put(key, hash, value, false); }`

（1）添加元素时，首先对key进行哈希运算，`hash()`会对非字符串的key做一个补充哈希的处理（`Wang/Jenkins hash`变体），使得哈希值的高位和低位不相同，减少哈希冲突。

java

 代码解读

复制代码

`private transient final int hashSeed = randomHashSeed(this); private int hash(Object k) {     int h = hashSeed;     if ((0 != h) && (k instanceof String)) {         return sun.misc.Hashing.stringHash32((String) k);     }     // 小声说，补充哈希的位运算没看懂运算过程...     h ^= k.hashCode();     h += (h <<  15) ^ 0xffffcd7d;     h ^= (h >>> 10);     h += (h <<   3);     h ^= (h >>>  6);     h += (h <<   2) + (h << 14);     return h ^ (h >>> 16); }`

（2）然后对key的哈希值进行映射计算（`(hash >>> segmentShift) & segmentMask`）找到`Segment`数组对应下标。

**key的哈希值是一个32位的数值，右移`segmentShift`位剩余高位和掩码`segmentMask`做`&`运算，这个过程相当于模运算（`(hash >>> segmentShift) % ssize`），计算结果分布在`[0,segmentMask]`**。

（3）**为什么还要对hash映射的下标做`(j << SSHIFT) + SBASE))`运算呢？**

因为通过`UNSAFE.getObject`可以从主内存中获取最新的Segment，而这个方法需要知道`Segment`在**内存中的偏移量**。同样计算主内存偏移量的方式在后续获取`HashEntry`时也会用到。

映射`Segment`数组下标的过程运用了与运算以及利用2的整数次方数值减1就是掩码的特性，而位运算要比通俗意义上的加减乘除的性能要高，这也是为什么`Segment`数组的长度必须是2的整数次方的原因。可想而知作者在细枝末节上的极致性能追求。

（4）若找到的`segment`是空的，则先进行`cas`初始化`ensureSegment`，可以看出`segments`数组是懒加载：

java

 代码解读

复制代码

`private Segment<K,V> ensureSegment(int k) {     final Segment<K,V>[] ss = this.segments;     // 算出 内存偏移量     long u = (k << SSHIFT) + SBASE; // raw offset     Segment<K,V> seg;     if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {         // 获取的seg为null则 开始初始化，获取0位置的segment，取出基本属性cap、lf、threshold         Segment<K,V> proto = ss[0]; // use segment 0 as prototype         int cap = proto.table.length;         float lf = proto.loadFactor;         int threshold = (int)(cap * lf);         HashEntry<K,V>[] tab = (HashEntry<K,V>[])new HashEntry[cap];         // 再检查一次         if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))                 == null) { // recheck             Segment<K,V> s = new Segment<K,V>(lf, threshold, tab);             // 自旋cas设置segment，保证线程安全             while ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))                     == null) {                 if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))                     break;             }         }     }     return seg; }`

### 1、Segment#put真正的操作元素

找到对应的`segment`后，就继续对其内部的`HashEntry`链表数组进行操作，这个过程中可能会产生哈希冲突，也可能需要扩容，而作者是如何解决实现的呢？

java

 代码解读

复制代码

`// java.util.concurrent.ConcurrentHashMap.Segment#put final V put(K key, int hash, V value, boolean onlyIfAbsent) {     // (1)若获取锁，则node=null，没有获取锁，也会做一些事情scanAndLockForPut：     // 拿不到锁，不立即阻塞，而是先自旋，若自旋到一定次数仍未拿到锁，再调用lock（）阻塞；     // 在自旋的过程中遍历链表，若发现没有重复的节点，则提前新建一个节点，为后面再插入节省时间。     HashEntry<K,V> node = tryLock() ? null :             scanAndLockForPut(key, hash, value);     V oldValue;     try {         HashEntry<K,V>[] tab = table;         //(2)tab.length是2的整数次方，所以tab.length-1 的二进制就是若干1，对hash 做与运算，算出的index不会超出tab.length-1         int index = (tab.length - 1) & hash;         // 定位到第index个HashEntry         HashEntry<K,V> first = entryAt(tab, index);         for (HashEntry<K,V> e = first;;) {             if (e != null) {                // (3)e不为空则说明发生hash冲突,解决hash冲突的办法：链表法，新节点作为链表的头节点                 // 如果hash值算的不好，经常发生hash冲突，就会造成某一个链表很长，性能就会很低。                 K k;                 // HashEntry key地址相等 or (hash值相等且key值相等)时                 if ((k = e.key) == key ||                         (e.hash == hash && key.equals(k))) {                     oldValue = e.value;                     if (!onlyIfAbsent) {                         // onlyIfAbsent 为false，则旧值替换为新值，然后break，否则直接break                         e.value = value;                         ++modCount;                     }                     break;                     // put key存在时会新值替换旧值                     // putIfAbsent key存在时不替换。                 }                 // 在e不为null的情况下，向下遍历，直到找到HashEntry的末尾或者 一个key或者hash相等的HashEntry                 e = e.next;             }             else {                 if (node != null)                     // node不为null，说明前面没有抢到锁时，顺便初始化了node                     // 同时node放在了HashEntry单列表的头部                     node.setNext(first);                 else                     // 初始化一个node，并放在first链表的头部                     node = new HashEntry<K,V>(hash, key, value, first);                 int c = count + 1;                 if (c > threshold && tab.length < MAXIMUM_CAPACITY)                     //(4) 因为count是对一个segment中的HashEntry节点个数的统计，                     // 如果hash冲突严重，键值对只添加到HashEntry[]中某几个HashEntry链表中，                     // 就造成HashEntry[]有空闲位置，也会造成无味的扩容，内存利用率持续下降                     // count 超过了阈值，默认是HashEntry<K,V>[]初始容量*0.75                     // 扩容                     rehash(node);                 else                    // (5)更新tab index位置的node                     setEntryAt(tab, index, node);                 // modCount++                 ++modCount;                 count = c;                 oldValue = null;                 break;             }         }     } finally {         unlock();     }     return oldValue; }`

（1）`segment`本身是一把锁，且为了确保put元素的过程是线程安全的，必须先尝试获取锁。若`tryLock()`获取锁失败，不会立即阻塞，而是执行`scanAndLockForPut`，自旋重试一定次数，并且在这个过程中不只是单纯的自旋，还会初始化添加元素需要的节点，为后续获取锁后节省时间，这又是一处体现作者追求极致性能的地方。

java

 代码解读

复制代码

`/**  * @return a new node if key not found, else null  */ private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {     // 找到对应的HashEntry节点first     HashEntry<K,V> first = entryForHash(this, hash);     HashEntry<K,V> e = first;     HashEntry<K,V> node = null;     int retries = -1; // negative while locating node     while (!tryLock()) {         HashEntry<K,V> f; // to recheck first below         if (retries < 0) {             if (e == null) {                 // 若 找到的节点是空的，则进行初始化，为后面拿到锁后，节省时间                 if (node == null) // speculatively create node                     node = new HashEntry<K,V>(hash, key, value, null);                 // retries为0，防止重复初始化                 retries = 0;             }             else if (key.equals(e.key))                 // 若 找到节点不为空，且 key和准备添加的key相等                 retries = 0;             else                 // e不为空且 key不相等，则向下遍历该链表，e设置为下一个节点，                 // 直到找到下一个节点空的或者key相等的（可能是替换操作，无需初始化节点）                 e = e.next;         }         else if (++retries > MAX_SCAN_RETRIES) {             // 自旋一定次数后lock阻塞             lock();             break;         }         else if ((retries & 1) == 0 &&                 (f = entryForHash(this, hash)) != first) {             // (retries & 1) == 0 偶数次检查头节点是否有修改             // 若first节点被修改了，则重置自旋重试机制，             // 为什么链表的第一个节点会变呢，是因为，新增元素时在头节点的位置添加。             e = first = f; // re-traverse if entry changed             retries = -1;         }     }     return node; }`

（2）获取锁之后，hash映射`HashEntry`数组的下标（`int index= (tab.length - 1) & hash`），并获取主内存中的first节点（`entryAt(tab, index)`）。

java

 代码解读

复制代码

`static final <K,V> HashEntry<K,V> entryAt(HashEntry<K,V>[] tab, int i) {     return (tab == null) ? null :             (HashEntry<K,V>) UNSAFE.getObjectVolatile                     (tab, ((long)i << TSHIFT) + TBASE); }`

和映射`Segment`数组下标不同的是，这里并没有对hash做移位操作，也就是**映射`HashEntry`数组下标用了hash值的低位，映射`Segment`数组下标用了hash值的高位**，这样做的目的也是为了使得元素分布均匀，减少哈希冲突（`hash()`补充哈希使得哈希值高位和低位不同）。

（3）找到的first节点不为空，则发生了哈希冲突，需要遍历链表，看看是否有key和hash相同的节点，有则判断是否需要替换，不论是否需要替换，都不需要加入新节点，则结束本次put操作。若遍历到末尾依然找不到相同的节点，则需要将新节点加到链表头部（头插法）。 ![ConcurrentHash-put](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65aaf14f6d51432f969708b009c8a85c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

（4）元素个数`count+1`，若`HashEntry`数组元素`count`超出阈值且长度未达到最大值，则扩容`rehash(node)`。

（5）将新增的节点更新到主内存对应位置（`setEntryAt`）：

java

 代码解读

复制代码

`static final <K,V> void setEntryAt(HashEntry<K,V>[] tab, int i,                                    HashEntry<K,V> e) {     UNSAFE.putOrderedObject(tab, ((long)i << TSHIFT) + TBASE, e); }`

### 2、rehash扩容

扩容比较复杂重要，所以单独拎出来探讨，默认情况下当一个`Segment`中`HashEntry`数组的元素个数大于初始容量的3/4且小于最大长度时触发扩容，从函数命名`rehash()`也可以看出是一个再哈希的过程：

java

 代码解读

复制代码

`private void rehash(HashEntry<K,V> node) {     HashEntry<K,V>[] oldTable = table;     int oldCapacity = oldTable.length;     // newCapacity = oldCapacity * 2^1,即为扩容为原来的2倍     int newCapacity = oldCapacity << 1;     // 重新计算新的threshold     threshold = (int)(newCapacity * loadFactor);     HashEntry<K,V>[] newTable =             (HashEntry<K,V>[]) new HashEntry[newCapacity];     int sizeMask = newCapacity - 1;     for (int i = 0; i < oldCapacity ; i++) {         HashEntry<K,V> e = oldTable[i];         if (e != null) {             HashEntry<K,V> next = e.next;             // 计算e在新数组中的位置             // 对newCapacity - 1 做&运算             int idx = e.hash & sizeMask;             if (next == null)   //  Single node on list                 // next=null 说明是链表的最后一个节点了，直接赋值                 newTable[idx] = e;             else { // Reuse consecutive sequence at same slot                 // 不是链表的最后一个节点，则需要寻找链表的最后一个元素                 HashEntry<K,V> lastRun = e;                 int lastIdx = idx;                 for (HashEntry<K,V> last = next;                      last != null;                      last = last.next) {                     int k = last.hash & sizeMask;                     if (k != lastIdx) {                         lastIdx = k;                         lastRun = last;                     }                 }                 // 找到lastRun节点，因为lastRun后面的节点的hash都和lastRun一样，                 // 所以可以直接把lastRun连同后面的节点一起复制到新数组的对应位置。                 newTable[lastIdx] = lastRun;                 // Clone remaining nodes                 // 而 lastRun前面的节点则需要重新计算在新数组中的位置，                 // 并拷贝（new HashEntry）到新数组中                 for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {                     V v = p.value;                     int h = p.hash;                     int k = h & sizeMask;                     HashEntry<K,V> n = newTable[k];                     newTable[k] = new HashEntry<K,V>(h, p.key, v, n);                 }             }         }     }     // 将新元素添加到数组中     int nodeIndex = node.hash & sizeMask; // add the new node     node.setNext(newTable[nodeIndex]);     newTable[nodeIndex] = node;     // 将新链表赋值给table, copy on write     // 只能保证最终一致性，不能保证实时一致性     table = newTable; }`

（1）首先新建一个数组，长度为旧数组的2倍（`oldCapacity << 1`）。

（2）按新数组的长度重新计算扩容阈值(`threshold = (int)(newCapacity * loadFactor)`）。

（3）从旧数组复制迁移节点到新数组。这里又有一个追求极致性能的点，按道理旧数组中的节点都需要重新哈希然后映射到新数组，但是，作者做了一个小优化，找到每条链表中最后一个与前一个节点哈希映射新数组下标不同的点，称之为`lastRun`，这样就把一个链表截成了两半，`lastRun`之后节点的哈希映射结果和`lastRun`相同，所以只需要复制迁移`lastRun`节点即可，其后的节点可以顺带过去；而`lastRun`前的节点则还需要一个个重新和新数组做哈希映射并复制。如图：

![ConcurrentHashMap-reHash](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/680b9a0c5ef9405f9858e4f10efd4661~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

（4）将新元素添加到新数组对应位置中。

（5）新数组赋值给旧数组（`table = newTable`），`copy on write` 思想，所以只能保证最终一致性，不能保证实时一致性，在扩容的过程中也不会影响get的使用。

六、remove删除元素
------------

删除元素的方法有两个：

`remove(Object key)`，删除键为key的元素。

`remove(Object key, Object value)`，删除键为key，值为value的元素。

java

 代码解读

复制代码

`public V remove(Object key) {     int hash = hash(key);     Segment<K,V> s = segmentForHash(hash);     return s == null ? null : s.remove(key, hash, null); } public boolean remove(Object key, Object value) {     int hash = hash(key);     Segment<K,V> s;     return value != null && (s = segmentForHash(hash)) != null &&             s.remove(key, hash, value) != null; }`

代码基本相同，都是先找到对应的`Segment`，然后调用`Segment`的`remove`方法。

java

 代码解读

复制代码

`private Segment<K,V> segmentForHash(int h) {     // hash 映射 segments数组下标的同时 计算出 该segment在内存中的偏移量     long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;     // segments数组是没有被volatile修饰的，使用getObjectVolatile，     // 可为segments增加volatile语义     return (Segment<K,V>) UNSAFE.getObjectVolatile(segments, u); }`

`Segment`的`remove`方法：

*   首先尝试获取锁，获取失败会自旋重试一定次数后依然没有获取锁则阻塞。
*   获取锁后，通过哈希映射找到对应的`HashEntry`节点e，若为空则说明没必要删除，若不为空则开始遍历链表。
*   找到`key`相同的节点，若有传递`value`，还需判断该节点的`value`是否相同。
*   删除节点时需分两种情况，若被删除节点的前驱为空，则说明是从链表头部删除，被删除的节点的`next`节点作为`index`位置的新头节点；若被删除节点的前驱不为空，则说明是从链表中间删除，将被删除节点的`next`节点链接到其前驱的`next`指针上。
*   最后释放锁。

java

 代码解读

复制代码

`final V remove(Object key, int hash, Object value) {     if (!tryLock())         // 1.获取锁失败，会自旋重试一段时间，如果还没获取锁则阻塞         scanAndLock(key, hash);     V oldValue = null;     try {         HashEntry<K,V>[] tab = table;         int index = (tab.length - 1) & hash;         // 找到 对应的hashentry         HashEntry<K,V> e = entryAt(tab, index);         HashEntry<K,V> pred = null;         while (e != null) {             K k;             HashEntry<K,V> next = e.next;             if ((k = e.key) == key ||                     (e.hash == hash && key.equals(k))) {                 V v = e.value;                 if (value == null || value == v || value.equals(v)) {                     if (pred == null)                         // 被删节点的前驱为空，则说明删除的节点是头节点，                         // 则被删节点的next节点作为index位置的头节点。                         setEntryAt(tab, index, next);                     else                         // 若pred不为null，则是从链表中间位置删除的节点，                         // 可将删除节点的pred与被删除节点的next相连                         pred.setNext(next);                     ++modCount;                     --count;                     oldValue = v;                 }                 break;             }             pred = e;             e = next;         }     } finally {         unlock();     }     return oldValue; }`

`scanAndLock`和`scanAndLockForPut`的目的基本一样，`scanAndLock`少了初始化节点操作。

java

 代码解读

复制代码

`private void scanAndLock(Object key, int hash) {     // similar to but simpler than scanAndLockForPut     HashEntry<K,V> first = entryForHash(this, hash);     HashEntry<K,V> e = first;     int retries = -1;     while (!tryLock()) {         HashEntry<K,V> f;         if (retries < 0) {             if (e == null || key.equals(e.key))                 // e为null or key存在则置retries=0，开始自旋计数                 retries = 0;             else                 e = e.next;         }         else if (++retries > MAX_SCAN_RETRIES) {             // 超过最大自旋次数，则阻塞             lock();             break;         }         else if ((retries & 1) == 0 &&                 (f = entryForHash(this, hash)) != first) {             // 偶数次检查头节点被修改，则 retries=-1 重置重试机制             e = first = f;             retries = -1;         }     } }`

七、get获取元素
---------

replace方法较为简单就不做分析了，来看看get方法：

*   首先通过hash计算`segment[]`下标同时计算内存偏移量。
*   `getObjectVolatile`从主内存中获取对应`Segment`。
*   第二次hash计算找到`HashEntry`。
*   遍历链表找到key相同的节点返回即可。

可以看到get没有加锁，为什么可以不加锁呢？

*   `put`添加元素时更改的是链表的头节点不会影响get的遍历，且`put` 和`remove`修改的是`HashEntry`的`next`指针，`next`被`volatile`修饰，replace修改的是`HashEntry`的`value`，`value`被`volatile`修饰，都是利用`volatile`语义（写happen-before读），使得修改后立即刷新主内存，并且通知其他线程获取到最新值。
*   put操作中若发生扩容，其利用了`copy on write`思想，在扩容没有完前，get获取的数据都是一份独立的旧数据；又因为`Segment`中`HashEntry`数组被`volatile`修饰，扩容完成后重新赋值`table`会立即刷新主内存，通知其他线程获取最新值。

java

 代码解读

复制代码

`public V get(Object key) {     Segment<K,V> s; // manually integrate access methods to reduce overhead     HashEntry<K,V>[] tab;     int h = hash(key);     // 计算segment[]索引的同时计算内存偏移量     long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;     // 第一次hash计算找到segment，     // getObjectVolatile 加上volatile语义，强制从主存中获取属性值。     // 这个方法要求被使用的属性被volatile or final(具有happen-before的修饰符)修饰，否则功能和getObject方法相同。     if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&             (tab = s.table) != null) {         // 第二次hash计算找到HashEntry         for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile                 (tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE);              e != null; e = e.next) {             K k;             // key地址相等 or （hash相等&& key值相等）             if ((k = e.key) == key || (e.hash == h && key.equals(k)))                 return e.value;         }     }     return null; }`

八、size获取元素个数
------------

一个`ConcurrentHashMap`被分成了多个`Segment`，那获取元素的个数就是所有`Segment`中元素个数之和。而`size`的过程中有可能在`put`、`remove`等影响每个`Segment`内部元素个数操作，所以需要一个个获取锁来统计。但是这样一个不太重要的`size`操作把整个`Segment`数组锁住岂不是非常影响写性能。

所以作者用了一种乐观锁的方式，假设在结算`size`的过程`Segment`内部没有发生修改操作，如果发生了修改则重试重新计算。

\*\*判断`Segment`内部没有发生修改的方式是比对最近两次总的修改次数是否一致。\*\*而重试也不是无限重试，而是重试2次，加上初始的一次就是3次。

重试3次之后依然检查到`Segment`内部有修改，则遍历`segments`数组加锁统计。**假设第3次重试和第4次加锁统计的修改总次数`sum`相等则结束统计返回size**，若不相等则第5次统计（重试次数不等2了，则不会发生锁重入）。

java

 代码解读

复制代码

`public int size() {     // Try a few times to get accurate count. On failure due to     // continuous async changes in table, resort to locking.     final Segment<K,V>[] segments = this.segments;     // 统计所有segment中元素的个数     int size;     // size的长度超过了32位，代表溢出了，设置为true     boolean overflow; // true if size overflows 32 bits     // 统计所有segment中修改的次数，后续可判断segments是否有修改     long sum;         // sum of modCounts     // 最近的一次sum     long last = 0L;   // previous sum     // 重试次数     int retries = -1; // first iteration isn't retry     try {         for (;;) {             // RETRIES_BEFORE_LOCK = 2             // 重试三次，乐观的认为在size的时候，segments内部没有变动             // 注意retries++             if (retries++ == RETRIES_BEFORE_LOCK) {                 // 超过三次重试次数，遍历segments数组，分别获取锁，                 for (int j = 0; j < segments.length; ++j)                     ensureSegment(j).lock(); // force creation             }             sum = 0L;             size = 0;             overflow = false;             for (int j = 0; j < segments.length; ++j) {                 // 遍历获取内存中的Segment                 Segment<K,V> seg = segmentAt(segments, j);                 if (seg != null) {                     // 统计总修改次数sum                     sum += seg.modCount;                     // 统计元素个数，并判断是否有溢出                     int c = seg.count;                     if (c < 0 || (size += c) < 0)                         overflow = true;                 }             }             // 统计的修改总次数sum和上次记录的相同则停止重试             if (sum == last)                 break;             last = sum;         }     } finally {         // 若重试超过了三次，说明分别获取过锁，则需要遍历释放锁         if (retries > RETRIES_BEFORE_LOCK) {             for (int j = 0; j < segments.length; ++j)                 segmentAt(segments, j).unlock();         }     }     // 返回size，若size溢出则为Integer.MAX_VALUE     return overflow ? Integer.MAX_VALUE : size; }`

九、总结
----

看完java7的`ConcurrentHashMap`源码，了解了其实现原理后，心里的疑云基本都解开了：

1.  `ConcurrentHashMap`中`segment`数组的长度以及`HashEntry`数组的长度之所以要保持为2的整数次方就是为了利用2的整数次方数值减1就是掩码的特性，哈希值与掩码做与运算相当于模运算来快速映射计算数组的下标。
2.  `ConcurrentHashMap`使用分段锁的方式，每一个`segment`相等于一把锁，在修改map时首先会先获取锁。而get也不需要加锁的原因是`HashEntry`中`next`指针，`value`都是`volatile`修饰的，可以很好的利用其写happen-before读的语义，以及修改后立即刷新到主内存并通知其他线程获取最新值。
3.  哈希冲突的体现不只是在链表中，还是在第一次哈希映射`segment`数组时，多个元素到同一个`segment`也算是哈希冲突。而解决哈希冲突的方式是链表法。
4.  哈希映射`segment`数组下标时用了哈希值的高位，而哈希映射`HashEntry`数组下标时用的哈希值低位，为的是尽可能利用哈希值，使得元素节点分布均匀减少冲突。
5.  扩容是容量扩大为原来的2倍，然后遍历每个元素重新哈希映射到新数组中，但是作者有一个小优化就是把一个链表截成两半，以`lastRun`为界，`lastRun`后面的节点因为和`lastRun`哈希映射新数组的结果一样，所以可以跟随`lastRun`一起复制到新数组，而`lastRun`之前的节点则需要一个个重新哈希映射。
6.  size统计所有`segment`的元素个数，以乐观重试的方式判断`segment`内部是否有修改，最近两次修改次数一致则返回统计的size。
7.  `segment`数组一旦初始化后期不可扩容。

PS: **如若文章中有错误理解，欢迎批评指正，同时非常期待你的评论、点赞和收藏。我是徐同学，愿与你共同进步！**

> 天青色等烟雨，而我在等你，微信公众号搜索：徐同学呀，持续更新肝货，快来关注我，和我一起学习吧~