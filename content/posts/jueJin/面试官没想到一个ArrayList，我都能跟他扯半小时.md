---
author: "JavaSouth南哥"
title: "面试官没想到一个ArrayList，我都能跟他扯半小时"
date: 2024-07-29
description: "南哥在stackoverflow社区看到14年前的这么一个问题：Java的Vector.add()和Vector.addElement()有什么区别，大家有答案吗？它们实际上没有区别！！！"
tags: ["后端","Java"]
ShowReadingTime: "阅读6分钟"
weight: 586
---
> _点赞再看，Java进阶一大半_

南哥在stackoverflow社区看到14年前的这么一个问题：`Java 的 Vector.add() 和 Vector.addElement() 有什么区别`，大家有答案吗？

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3251aee69dc3442897041f26c2f6caf3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727231606&x-signature=4JtxwdMnKdLMd0XvKGGYhZ%2B2sPc%3D)

它们实际上没有区别！！！1996年的JDK 1.0版本中，JDK就没有提供过系统的集合框架，当时老一辈程序员在集合处理上只能使用诸如Vector、Hashtable。

而随着1998 年 12 月 4 日的JDK 1.2版本发布，Java终于提供了系统的集合框架支持。上面我们提到的Vector则作为List接口的实现之一，`add`方法是List的顶层方法，而Vector自带的`addElement`方法仍然保留，主要是为了向后兼容性。。。

大家好，我是南哥。

一个Java学习与进阶的领路人，相信对你通关面试进入心心念念的公司有所帮助。

本文收录在我开源的《Java学习进阶指南》中，涵盖了在大厂工作的Javaer都不会不懂的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫，南哥希望收到大家的 ⭐ Star ⭐支持我完善下去。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")。

1\. List集合
----------

### 1.1 集合概述

> _**面试官：List集合都知道哪些对象？**_

作为四大集合之一的List，在业务开发中我们比较常见的是以下 3 种：ArrayList、Vector、LinkedList，业务开发我们接触最多就是容器类库了，容器类库可以说是面向对象语言最重要的类库。大家看看在工作里你比较熟悉的是哪个？

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fa672b2ff14243459232629ae3d16b99~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727231606&x-signature=s0bLq7YgkLcl1VCz4CBL%2FC7Y6i8%3D)

这篇文章南哥打算专注于List集合，后面四大集合之Map、Queue、Set后续再来填坑，比心心♥。

### 1.2 ArrayList

> _**面试官：ArrayList为什么线程不安全？**_

普通的数组类型，我们是这么创建的`int[] arr = new int[66]`。数组可以创建固定长度的容量，不会过度浪费资源，但有优点也有缺点。如果长度设置过小，你就会看到一个大大的`ArrayIndexOutOfBoundsException`。

shell

 代码解读

复制代码

`Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 6 	at org.codeman.Test.main(MsgExtractor.java:11)`

也别把数组说得那么不堪，起码数组是线程安全的，ArrayList却是线程不安全的。另外ArrayList底层的存储容器实际上也是一个Object数组，大家看看以下源码。

java

 代码解读

复制代码

    `/**      * The array buffer into which the elements of the ArrayList are stored.      * The capacity of the ArrayList is the length of this array buffer. Any      * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA      * will be expanded to DEFAULT_CAPACITY when the first element is added.      */     transient Object[] elementData; // non-private to simplify nested class access`

那ArrayList为什么线程不安全？原因就在下面源码这个size。

java

 代码解读

复制代码

    `/**      * The size of the ArrayList (the number of elements it contains).      *      * @serial      */     private int size;`

ArrayList底层是根据当前size的值来作为新添加元素的下标，南哥假设目前size为0，有线程A、线程B都想要添加一个元素。

线程A在下标0插入A元素，当添加成功后还没有对size进行++。此时CPU调度让线程B运行，线程B也在下标0插入B元素，覆盖了A元素。线程A、B执行到程序末尾对size进行++，此时就有问题了，大家发现了没？

size进行了两次加法变成了2，但却只有一个B元素添加到了下标0位置，后面再添加其他元素下标1也会是空的。

### 1.3 AarrayList面试小tip

另外ArrayList有些小知识点大家也需要记一记，面试官可能照着公司给的面试题稿子问你：

（1）ArrayList初始容量为10。

（2）ArrayList负载因子为1，也代表ArrayList底层数组满了才会扩容。而数组扩容长度为原始长度的**1.5倍**。

（3）ArrayList的扩容时间复杂度为O(n)。

### 1.4 Vector

> _**面试官：知道线程安全的List集合吗？**_

Vector和ArrayList的源码说明很相似，都是告诉你它们相比数组来说是一个可调整大小的数组实现，大家看看以下源码注释。

java

 代码解读

复制代码

`// Resizable-array implementation of the <tt>List</tt> interface. // List接口的可调整大小数组实现。`

java

 代码解读

复制代码

`// The {@code Vector} class implements a growable array of objects. // Vector类实现了一个可增长的对象数组。`

那Vector和ArrayList有什么区别？南哥给大家贴下get和set方法的源码就一清二楚，Vector的元素操作都是线程安全性的，每个方法都有`synchronized`进行修饰，而ArrayLiset却是一个线程不安全的List集合。

java

 代码解读

复制代码

    `// Vector源码     public synchronized E get(int index) {         if (index >= elementCount)             throw new ArrayIndexOutOfBoundsException(index);         return elementData(index);     }     public synchronized E set(int index, E element) {         if (index >= elementCount)             throw new ArrayIndexOutOfBoundsException(index);         E oldValue = elementData(index);         elementData[index] = element;         return oldValue;     }`

两者除了线程安全性的区别，在效率上，ArrayList相比Vector来说效率更高。Vector虽然线程安全了，但每个操作方法是同步的，也意味着增加了额外的开销。

一般我们在业务开发也很少使用到Vector，至少南哥还没有在开发中使用过Vector，小伙伴有写过的吗？如果是需要保证线程安全的场景，我一般是在集合的外部方法加上锁机制，或者使用线程安全的List集合，我更多使用的是`CopyOnWriteArrayList`而不是Vector。

### 1.5 Vector面试小tip

（1）Vector初始容量为10。

（2）Vector负载因子为1，也代表Vector底层数组满了才会扩容。而数组扩容长度为原始长度的**2倍**。

（3）Vector的扩容时间复杂度为O(n)。

### 1.6 LinkedList

> _**面试官：双向链表你说说？**_

LinkedList是JDK提供的一个双向链表实现，我们来看看官方源码的介绍。

> List和Deque接口的双向链表实现。实现所有可选的列表操作，并允许所有元素（包括null ）。 所有操作的执行方式都符合双向链表的预期。索引到列表中的操作将从列表的开头或结尾（以更接近指定索引为准）遍历列表
> 
> Doubly-linked list implementation of the {@code List} and {@code Deque} interfaces. Implements all optional list operations, and permits all elements (including {@code null}).

我们来看看LinkedList的数据结构，节点类型分为头节点和尾节点。

java

 代码解读

复制代码

    `transient Node<E> first;     transient Node<E> last;`

同时每个节点有指向上一个节点的指针和下一个节点的指针。

java

 代码解读

复制代码

    `private static class Node<E> {         E item;         Node<E> next;         Node<E> prev;         Node(Node<E> prev, E element, Node<E> next) {             this.item = element;             this.next = next;             this.prev = prev;         }     }`

LinkedList比较重要的知识点是为什么它也是一个线程不安全的List集合实现？这一点和上文介绍的`头节点first`有关。

LinkedList对元素的操作并没有使用`synchronized`进行同步控制，如果现在有两个线程A、B同时要使用addFist添加第一个头节点。当A线程把A元素设置为头节点后，此时的头节点还没有和旧链表建立连接。而线程B执行时又把B元素设置为了头节点，注意！此时A元素被覆盖了。

以上两个线程的两个添加操作最终却只添加了一个元素。

java

 代码解读

复制代码

    `/**      * Inserts the specified element at the beginning of this list.      *      * @param e the element to add      */     public void addFirst(E e) {         linkFirst(e);     }`

[戳这，《JavaProGuide》作为一份涵盖Java程序员所需掌握核心知识、面试重点的Java学习进阶指南。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ef14a7294b5b4535be45188ff41f43d7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727231606&x-signature=z0Hlzjr%2BfKGdaSgqe0SzFH8wko8%3D)

欢迎关注南哥的公众号：Java进阶指南针，公众号里有南哥珍藏整理的大量优秀pdf书籍！

我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️