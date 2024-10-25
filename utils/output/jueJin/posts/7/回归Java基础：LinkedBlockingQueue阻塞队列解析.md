---
author: "捡田螺的小男孩"
title: "回归Java基础：LinkedBlockingQueue阻塞队列解析"
date: 2019-11-03
description: "整理了阻塞队列LinkedBlockingQueue的学习笔记，希望对大家有帮助。有哪里不正确，欢迎指出，感谢。 我们先来看看LinkedBlockingQueue的继承体系。使用IntelliJ IDEA查看类的继承关系图形 LinkedBlockingQueue实现了序列化…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:14,comments:3,collects:20,views:2807,"
---
前言
--

整理了阻塞队列LinkedBlockingQueue的学习笔记，希望对大家有帮助。有哪里不正确，欢迎指出，感谢。

LinkedBlockingQueue的概述
----------------------

### LinkedBlockingQueue的继承体系图

我们先来看看LinkedBlockingQueue的继承体系。[使用IntelliJ IDEA查看类的继承关系图形](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fdeng-cc%2Fp%2F6927447.html "https://www.cnblogs.com/deng-cc/p/6927447.html")

![](/images/jueJin/16e1d57729f68e9.png)

> *   蓝色实线箭头是指类继承关系
> *   绿色箭头实线箭头是指接口继承关系
> *   绿色虚线箭头是指接口实现关系。

LinkedBlockingQueue实现了序列化接口 Serializable，因此它有序列化的特性。 LinkedBlockingQueue实现了BlockingQueue接口，BlockingQueue继承了Queue接口，因此它拥有了队列Queue相关方法的操作。

### LinkedBlockingQueue的类图

类图来自Java并发编程之美

![](/images/jueJin/16e2795d7522fc5.png)

LinkedBlockingQueue主要特性：

1.  LinkedBlockingQueue底层数据结构为单向链表。
2.  LinkedBlockingQueue 有两个Node节点，一个head节点，一个tail节点，只能从head取元素，从tail添加元素。
3.  LinkedBlockingQueue 容量是一个原子变量count，它的初始值为0。
4.  LinkedBlockingQueue有两把ReentrantLock的锁，一把控制元素入队，一把控制出队，保证在并发情况下的线程安全。
5.  LinkedBlockingQueue 有两个条件变量，notEmpty 和 notFull。它们内部均有一个条件队列，存放着出入队列被阻塞的线程，这其实是生产者-消费者模型。

LinkedBlockingQueue的重要成员变量
--------------------------

```
//容量范围,默认值为 Integer.MAX_VALUE
private final int capacity;

//当前队列元素个数
private final AtomicInteger count = new AtomicInteger();

//头结点
transient Node<E> head;

//尾节点
private transient Node<E> last;

//take, poll等方法的可重入锁
private final ReentrantLock takeLock = new ReentrantLock();

//当队列为空时，执行出队操作（比如take ）的线程会被放入这个条件队列进行等待
private final Condition notEmpty = takeLock.newCondition();

//put, offer等方法的可重入锁
private final ReentrantLock putLock = new ReentrantLock();

//当队列满时， 执行进队操作（ 比如put）的线程会被放入这个条件队列进行等待
private final Condition notFull = putLock.newCondition();
```

LinkedBlockingQueue的构造函数
------------------------

LinkedBlockingQueue有三个构造函数：

1.  无参构造函数，容量为Integer.MAX

```
    public LinkedBlockingQueue() {
    this(Integer.MAX_VALUE);
}
```

2.  设置指定容量的构造器

```
    public LinkedBlockingQueue(int capacity) {
    if (capacity <= 0) throw new IllegalArgumentException();
    //设置队列大小
    this.capacity = capacity;
    //new一个null节点，head、tail节点指向该节点
    last = head = new Node<E>(null);
}
```

3.  传入集合，如果调用该构造器，容量默认也是Integer.MAX\_VALUE

```
    public LinkedBlockingQueue(Collection<? extends E> c) {
    //调用指定容量的构造器
    this(Integer.MAX_VALUE);
    //获取put, offer的可重入锁
    final ReentrantLock putLock = this.putLock;
    putLock.lock();
        try {
        int n = 0;
        //循环向队列中添加集合中的元素
            for (E e : c) {
            if (e == null)
            throw new NullPointerException();
            if (n == capacity)
            throw new IllegalStateException("Queue full");
            //将队列的last节点指向该节点
            enqueue(new Node<E>(e));
            ++n;
        }
        //更新容量值
        count.set(n);
            } finally {
            //释放锁
            putLock.unlock();
        }
    }
```

LinkedBlockingQueue底层Node类
--------------------------

### Node源码

```
    static class Node<E> {
    // 当前节点的元素值
    E item;
    // 下一个节点的索引
    Node<E> next;
    //节点构造器
        Node(E x) {
        item = x;
    }
}
```

LinkedBlockingQueue的节点符合单向链表的数据结构要求：

*   一个成员变量为当前节点的元素值
*   一个成员变量是下一节点的索引
*   构造方法的唯一参数节点元素值。

### Node节点图

item表示当前节点的元素值，next表示指向下一节点的指针

![](/images/jueJin/16e2f5e45ff428b.png)

LinkedBlockingQueue常用操作
-----------------------

### offer操作

入队方法，其实就是向队列的尾部插入一个元素。如果元素为空，抛出空指针异常。如果队列已满，则丢弃当前元素，返回false，它是**非阻塞的**。如果队列空闲则插入成功返回true。

#### offer源代码

**offer方法源码如下：**

```
    public boolean offer(E e) {
    //为空直接抛空指针
    if (e == null) throw new NullPointerException();
    final AtomicInteger count = this.count;
    //如果当前队列满了的话，直接返回false
    if (count.get() == capacity)
    return false;
    int c = -1;
    //构造新节点
    Node<E> node = new Node<E>(e);
    获取put独占锁
    final ReentrantLock putLock = this.putLock;
    putLock.lock();
        try {
        //判断队列是否已满
            if (count.get() < capacity) {
            //进队列
            enqueue(node);
            //递增元素计数
            c = count.getAndIncrement();
            //如果元素入队，还有空闲，则唤醒notFull条件队列里被阻塞的线程
            if (c + 1 < capacity)
            notFull.signal();
        }
            } finally {
            //释放锁
            putLock.unlock();
        }
        //如果容量为0，则
        if (c == 0)
        //激活 notEmpty 的条件队列，唤醒被阻塞的线程
        signalNotEmpty();
        return c >= 0;
    }
```

**enqueue方法源码如下：**

```
    private void enqueue(Node<E> node) {
    //从尾节点加进去
    last = last.next = node;
}
```

为了形象生动，我们用一张图来看看往队列里依次放入元素A和元素B。图片参考来源[【细谈Java并发】谈谈LinkedBlockingQueue](https://link.juejin.cn?target=http%3A%2F%2Fbenjaminwhx.com%2F2018%2F05%2F11%2F%25E3%2580%2590%25E7%25BB%2586%25E8%25B0%2588Java%25E5%25B9%25B6%25E5%258F%2591%25E3%2580%2591%25E8%25B0%2588%25E8%25B0%2588LinkedBlockingQueue%2F "http://benjaminwhx.com/2018/05/11/%E3%80%90%E7%BB%86%E8%B0%88Java%E5%B9%B6%E5%8F%91%E3%80%91%E8%B0%88%E8%B0%88LinkedBlockingQueue/")

![](/images/jueJin/16e312543566570.png)

**signalNotEmpty方法源码如下**

```
    private void signalNotEmpty() {
    //获取take独占锁
    final ReentrantLock takeLock = this.takeLock;
    takeLock.lock();
        try {
        //唤醒notEmpty条件队列里被阻塞的线程
        notEmpty.signal();
            } finally {
            //释放锁
            takeLock.unlock();
        }
    }
```

#### offer执行流程图

![](/images/jueJin/16e2c991c415860.png)

**基本流程：**

*   判断元素是否为空，如果是，就抛出空指针异常。
*   判读队列是否已满，如果是，添加失败，返回false。
*   如果队列没满，构造Node节点，上锁。
*   判断队列是否已满，如果队列没满，Node节点在队尾加入队列待。
*   加入队列后，判断队列是否还有空闲，如果是，唤醒notFull的阻塞线程。
*   释放完锁后，判断容量是否为空，如果是，唤醒notEmpty的阻塞线程。

### put操作

put方法也是向队列尾部插入一个元素。如果元素为null，抛出空指针异常。如果队列己满则阻塞当前线程，直到队列有空闲插入成功为止。如果队列空闲则插入成功，直接返回。如果在阻塞时被其他线程设置了中断标志， 则被阻塞线程会抛出 InterruptedException 异常而返回。

#### put源代码

```
    public void put(E e) throws InterruptedException {
    ////为空直接抛空指针异常
    if (e == null) throw new NullPointerException();
    int c = -1;
    // 构造新节点
    Node<E> node = new Node<E>(e);
    //获取putLock独占锁
    final ReentrantLock putLock = this.putLock;
    final AtomicInteger count = this.count;
    //获取独占锁,它跟lock的区别，是可以被中断
    putLock.lockInterruptibly();
        try {
        //队列已满线程挂起等待
            while (count.get() == capacity) {
            notFull.await();
        }
        //进队列
        enqueue(node);
        //递增元素计数
        c = count.getAndIncrement();
        //如果元素入队，还有空闲，则唤醒notFull条件队列里被阻塞的线程
        if (c + 1 < capacity)
        notFull.signal();
            } finally {
            //释放锁
            putLock.unlock();
        }
        //如果容量为0，则
        if (c == 0)
        //激活 notEmpty 的条件队列，唤醒被阻塞的线程
        signalNotEmpty();
    }
```

#### put流程图

![](/images/jueJin/16e2f4352aaaef7.png)

**基本流程：**

*   判断元素是否为空，如果是就抛出空指针异常。
*   构造Node节点，上锁（可中断锁）
*   判断队列是否已满，如果是，阻塞当前线程，一直等待。
*   如果队列没满，Node节点在队尾加入队列。
*   加入队列后，判断队列是否还有空闲，如果是，唤醒notFull的阻塞线程。
*   释放完锁后，判断容量是否为空，如果是，唤醒notEmpty的阻塞线程。

### poll操作

从队列头部获取并移除一个元素， 如果队列为空则返回 null， 该方法是不阻塞的。

#### poll源代码

**poll方法源代码**

```
    public E poll() {
    final AtomicInteger count = this.count;
    //如果队列为空，返回null
    if (count.get() == 0)
    return null;
    E x = null;
    int c = -1;
    //获取takeLock独占锁
    final ReentrantLock takeLock = this.takeLock;
    takeLock.lock();
        try {
        //如果队列不为空，则出队，并递减计数
            if (count.get() > 0) {
            x = dequeue();
            c = count.getAndDecrement();
            ////容量大于1，则激活 notEmpty 的条件队列，唤醒被阻塞的线程
            if (c > 1)
            notEmpty.signal();
        }
            } finally {
            //释放锁
            takeLock.unlock();
        }
        if (c == capacity)
        //唤醒notFull条件队列里被阻塞的线程
        signalNotFull();
        return x;
    }
```

**dequeue方法源代码**

```
//出队列
    private E dequeue() {
    //获取head节点
    Node<E> h = head;
    //获取到head节点指向的下一个节点
    Node<E> first = h.next;
    //head节点原来指向的节点的next指向自己，等待下次gc回收
    h.next = h; // help GC
    // head节点指向新的节点
    head = first;
    // 获取到新的head节点的item值
    E x = first.item;
    // 新head节点的item值设置为null
    first.item = null;
    return x;
}
```

为了形象生动，我们用一张图来描述出队过程。图片参考来源[【细谈Java并发】谈谈LinkedBlockingQueue](https://link.juejin.cn?target=http%3A%2F%2Fbenjaminwhx.com%2F2018%2F05%2F11%2F%25E3%2580%2590%25E7%25BB%2586%25E8%25B0%2588Java%25E5%25B9%25B6%25E5%258F%2591%25E3%2580%2591%25E8%25B0%2588%25E8%25B0%2588LinkedBlockingQueue%2F "http://benjaminwhx.com/2018/05/11/%E3%80%90%E7%BB%86%E8%B0%88Java%E5%B9%B6%E5%8F%91%E3%80%91%E8%B0%88%E8%B0%88LinkedBlockingQueue/")

![](/images/jueJin/16e312e9571be12.png)

**signalNotFull方法源码**

```
    private void signalNotFull() {
    //获取put独占锁
    final ReentrantLock putLock = this.putLock;
    putLock.lock();
        try {
        ////唤醒notFull条件队列里被阻塞的线程
        notFull.signal();
            } finally {
            //释放锁
            putLock.unlock();
        }
    }
```

#### poll流程图

![](/images/jueJin/16e2f9b027dd5f6.png)

**基本流程：**

*   判断元素是否为空，如果是，就返回null。
*   加锁
*   判断队列是否有元素，如果没有，释放锁
*   如果队列有元素，则出队列，获取数据，容量计数器减一。
*   判断此时容量是否大于1，如果是，唤醒notEmpty的阻塞线程。
*   释放完锁后，判断容量是否满，如果是，唤醒notFull的阻塞线程。

### peek操作

获取队列头部元素但是不从队列里面移除它，如果队列为空则返回 null。 该方法是不 阻塞的。

#### peek源代码

```
    public E peek() {
    //队列容量为0，返回null
    if (count.get() == 0)
    return null;
    //获取takeLock独占锁
    final ReentrantLock takeLock = this.takeLock;
    takeLock.lock();
        try {
        Node<E> first = head.next;
        //判断first是否为null，如果是直接返回
        if (first == null)
        return null;
        else
        return first.item;
            } finally {
            //释放锁
            takeLock.unlock();
        }
    }
```

#### peek流程图

![](/images/jueJin/16e30736897335e.png)

**基本流程：**

*   判断队列容量大小是否为0，如果是，就返回null。
*   加锁
*   获取队列头部节点first
*   判断节点first是否为null，是的话，返回null。
*   如果fist不为null，返回节点first的元素。
*   释放锁。

### take操作

获取当前队列头部元素并从队列里面移除它。 如果队列为空则阻塞当前线程直到队列 不为空然后返回元素，如果在阻塞时被其他线程设置了中断标志， 则被阻塞线程会抛出 InterruptedException 异常而返回。

#### take源代码

```
    public E take() throws InterruptedException {
    E x;
    int c = -1;
    final AtomicInteger count = this.count;
    //获取takeLock独占锁
    final ReentrantLock takeLock = this.takeLock;
    //获取独占锁,它跟lock的区别，是可以被中断
    takeLock.lockInterruptibly();
        try {
        //当前队列为空,则阻塞挂起
            while (count.get() == 0) {
            notEmpty.await();
        }
        //）出队并递减计数
        x = dequeue();
        c = count.getAndDecrement();
        if (c > 1)
        //激活 notEmpty 的条件队列，唤醒被阻塞的线程
        notEmpty.signal();
            } finally {
            //释放锁
            takeLock.unlock();
        }
        if (c == capacity)
        //激活 notFull 的条件队列，唤醒被阻塞的线程
        signalNotFull();
        return x;
    }
```

#### take流程图

![](/images/jueJin/16e308f0577e18c.png)

**基本流程：**

*   加锁
*   判断队列容量大小是否为0，如果是，阻塞当前线程，直到队列不为空。
*   如果队列容量大小大于0，节点出队列，获取元素x，计数器减一。
*   判断队列容量大小是否大于1，如果是，唤醒notEmpty的阻塞线程。
*   释放锁。
*   判断队列容量是否已满，如果是，唤醒notFull的阻塞线程。
*   返回出队元素x

### remove操作

删除队列里面指定的元素，有则删除并返回 true，没有则返回 false。

#### remove方法源代码

```
    public boolean remove(Object o) {
    //为空直接返回false
    if (o == null) return false;
    //双重加锁
    fullyLock();
        try {
        //边历队列，找到元素则删除并返回true
        for (Node<E> trail = head, p = trail.next;
        p != null;
            trail = p, p = p.next) {
                if (o.equals(p.item)) {
                //执行unlink操作
                unlink(p, trail);
                return true;
            }
        }
        return false;
            } finally {
            //解锁
            fullyUnlock();
        }
    }
```

**双重加锁，fullyLock方法源代码**

```
    void fullyLock() {
    //putLock独占锁加锁
    putLock.lock();
    //takeLock独占锁加锁
    takeLock.lock();
}
```

**unlink方法源代码**

```
    void unlink(Node<E> p, Node<E> trail) {
    p.item = null;
    trail.next = p.next;
    if (last == p)
    last = trail;
    //如果当前队列满 ，则删除后，也不忘记唤醒等待的线程
    if (count.getAndDecrement() == capacity)
    notFull.signal();
}
```

**fullyUnlock方法源代码**

```
    void fullyUnlock() {
    //与双重加锁顺序相反，先解takeLock独占锁
    takeLock.unlock();
    putLock.unlock();
}
```

#### remove流程图

![](/images/jueJin/16e30b18b5772b8.png)

基本流程

*   判断要删除的元素是否为空，是就返回false。
*   如果要删除的元素不为空，加双重锁
*   遍历队列，找到要删除的元素，如果找不到，返回false。
*   如果找到，删除该节点，返回true。
*   释放锁

### size操作

获取当前队列元素个数。

```
    public int size() {
    return count.get();
}
```

由于进行出队、入队操作时的 count是加了锁的，所以结果相比ConcurrentLinkedQueue 的 size 方法比较准确。

总结
--

*   LinkedBlockingQueue底层通过单向链表实现。
*   它有头尾两个节点，入队操作是从尾节点添加元素，出队操作是对头节点进行操作。
*   它的容量是原子变量count，保证szie获取的准确性。
*   它有两把独占锁，保证了队列操作原子性。
*   它的两把锁都配备了一个条件队列，用来存放阻塞线程，结合入队、出队操作实现了一个生产消费模型。

Java并发编程之美中，有一张图惟妙惟肖描述了它，如下图：

![](/images/jueJin/16e3135aef2102a.png)

参看与感谢
-----

*   《Java并发编程之美》
*   [阻塞队列之LinkedBlockingQueue](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fduodushuduokanbao%2Fp%2F9556555.html "https://www.cnblogs.com/duodushuduokanbao/p/9556555.html")
*   [Java并发之LinkedBlockingQueue](https://link.juejin.cn?target=https%3A%2F%2Fwww.iteye.com%2Fblog%2F286-2297295 "https://www.iteye.com/blog/286-2297295")
*   [【细谈Java并发】谈谈LinkedBlockingQueue](https://link.juejin.cn?target=http%3A%2F%2Fbenjaminwhx.com%2F2018%2F05%2F11%2F%25E3%2580%2590%25E7%25BB%2586%25E8%25B0%2588Java%25E5%25B9%25B6%25E5%258F%2591%25E3%2580%2591%25E8%25B0%2588%25E8%25B0%2588LinkedBlockingQueue%2F "http://benjaminwhx.com/2018/05/11/%E3%80%90%E7%BB%86%E8%B0%88Java%E5%B9%B6%E5%8F%91%E3%80%91%E8%B0%88%E8%B0%88LinkedBlockingQueue/")

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。