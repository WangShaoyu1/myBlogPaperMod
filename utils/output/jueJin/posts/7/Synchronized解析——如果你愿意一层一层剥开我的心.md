---
author: "捡田螺的小男孩"
title: "Synchronized解析——如果你愿意一层一层剥开我的心"
date: 2019-08-18
description: "synchronized，是解决并发情况下数据同步访问问题的一把利刃。那么synchronized的底层原理是什么呢？下面我们来一层一层剥开它的心，就像剥洋葱一样，看个究竟。 接下来，我们先剥开synchronized的第一层，反编译其作用的代码块以及方法。 由图可得，添加了s…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:229,comments:30,collects:392,views:16583,"
---
前言
--

synchronized，是解决并发情况下数据同步访问问题的一把利刃。那么synchronized的底层原理是什么呢？下面我们来一层一层剥开它的心，就像剥洋葱一样，看个究竟。

> [github.com/whx123/Java…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")

Synchronized的使用场景
-----------------

synchronized关键字可以作用于方法或者代码块，最主要有以下几种使用方式，如图：

![](/images/jueJin/16c9f05b7128270.png)

**接下来，我们先剥开synchronized的第一层，反编译其作用的代码块以及方法**。

### synchronized作用于代码块

```
    public class SynchronizedTest {
    
        public void doSth(){
            synchronized (SynchronizedTest.class){
            System.out.println("test Synchronized" );
        }
    }
}
```

反编译，可得：

![](/images/jueJin/16c9ff7877f8935.png)

由图可得，添加了synchronized关键字的代码块，多了两个指令**monitorenter、monitorexit**。即JVM使用monitorenter和monitorexit两个指令实现同步，monitorenter、monitorexit又是怎样保证同步的呢？我们等下剥第二层继续探索。

### synchronized作用于方法

```
    public synchronized void doSth(){
    System.out.println("test Synchronized method" );
}
```

反编译，可得：

![](/images/jueJin/16ca016199a7c03.png)

由图可得，添加了synchronized关键字的方法，多了**ACC\_SYNCHRONIZED**标记。即JVM通过在方法访问标识符(flags)中加入ACC\_SYNCHRONIZED来实现同步功能。

monitorenter、monitorexit、ACC\_SYNCHRONIZED
------------------------------------------

剥完第一层，反编译synchronized的方法以及代码块，我们已经知道synchronized是通过monitorenter、monitorexit、ACC\_SYNCHRONIZED实现同步的，它们三作用都是啥呢？我们接着剥第二层：

### monitorenter

[monitorenter指令介绍](https://link.juejin.cn?target=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2Fspecs%2Fjvms%2Fse8%2Fhtml%2Fjvms-6.html%23jvms-6.5.monitorenter "https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.monitorenter")

> Each object is associated with a monitor. A monitor is locked if and only if it has an owner. The thread that executes monitorenter attempts to gain ownership of the monitor associated with objectref, as follows:
> 
> > If the entry count of the monitor associated with objectref is zero, the thread enters the monitor and sets its entry count to one. The thread is then the owner of the monitor.
> > 
> > If the thread already owns the monitor associated with objectref, it reenters the monitor, incrementing its entry count.
> > 
> > If another thread already owns the monitor associated with objectref, the thread blocks until the monitor's entry count is zero, then tries again to gain ownership.

谷歌翻译一下，如下：

> 每个对象都与一个**monitor** 相关联。当且仅当拥有所有者时（被拥有），monitor才会被锁定。执行到monitorenter指令的线程，会尝试去获得对应的monitor，如下：
> 
> > 每个对象维护着一个记录着被锁次数的计数器, 对象未被锁定时，该计数器为0。线程进入monitor（执行monitorenter指令）时，会把计数器设置为1.
> > 
> > 当同一个线程再次获得该对象的锁的时候，计数器再次自增.
> > 
> > 当其他线程想获得该monitor的时候，就会阻塞，直到计数器为0才能成功。

可以看一下以下的图，便于理解用：

![](/images/jueJin/16ca3d3685a4824.png)

### monitorexit

[monitorexit指令介绍](https://link.juejin.cn?target=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2Fspecs%2Fjvms%2Fse8%2Fhtml%2Fjvms-6.html%23jvms-6.5.monitorexit "https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.monitorexit")

> The thread that executes monitorexit must be the owner of the monitor associated with the instance referenced by objectref.
> 
> The thread decrements the entry count of the monitor associated with objectref. If as a result the value of the entry count is zero, the thread exits the monitor and is no longer its owner. Other threads that are blocking to enter the monitor are allowed to attempt to do so.

谷歌翻译一下，如下：

> monitor的拥有者线程才能执行 monitorexit指令。
> 
> 线程执行monitorexit指令，就会让monitor的计数器减一。如果计数器为0，表明该线程不再拥有monitor。其他线程就允许尝试去获得该monitor了。

可以看一下以下的图，便于理解用：

![](/images/jueJin/16ca3ceaf0a2a93.png)

### ACC\_SYNCHRONIZED

[ACC\_SYNCHRONIZED介绍](https://link.juejin.cn?target=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2Fspecs%2Fjvms%2Fse8%2Fhtml%2Fjvms-2.html%23jvms-2.11.10 "https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.10")

> Method-level synchronization is performed implicitly, as part of method invocation and return. A synchronized method is distinguished in the run-time constant pool’s method\_info structure by the ACC\_SYNCHRONIZED flag, which is checked by the method invocation instructions. When invoking a method for which ACC\_SYNCHRONIZED is set, the executing thread enters a monitor, invokes the method itself, and exits the monitor whether the method invocation completes normally or abruptly. During the time the executing thread owns the monitor, no other thread may enter it. If an exception is thrown during invocation of the synchronized method and the synchronized method does not handle the exception, the monitor for the method is automatically exited before the exception is rethrown out of the synchronized method.

谷歌翻译一下，如下：

> 方法级别的同步是隐式的，作为方法调用的一部分。同步方法的常量池中会有一个ACC\_SYNCHRONIZED标志。
> 
> 当调用一个设置了ACC\_SYNCHRONIZED标志的方法，执行线程需要先获得monitor锁，然后开始执行方法，方法执行之后再释放monitor锁，当方法不管是正常return还是抛出异常都会释放对应的monitor锁。
> 
> 在这期间，如果其他线程来请求执行方法，会因为无法获得监视器锁而被阻断住。
> 
> 如果在方法执行过程中，发生了异常，并且方法内部并没有处理该异常，那么在异常被抛到方法外面之前监视器锁会被自动释放。

可以看一下这个流程图：

![](/images/jueJin/16ca3c63dcbace2.png)

### Synchronized第二层的总结

*   同步代码块是通过monitorenter和monitorexit来实现，当线程执行到monitorenter的时候要先获得monitor锁，才能执行后面的方法。当线程执行到monitorexit的时候则要释放锁。
*   同步方法是通过中设置ACC\_SYNCHRONIZED标志来实现，当线程执行有ACC\_SYNCHRONI标志的方法，需要获得monitor锁。
*   每个对象维护一个加锁计数器，为0表示可以被其他线程获得锁，不为0时，只有当前锁的线程才能再次获得锁。
*   同步方法和同步代码块底层都是通过monitor来实现同步的。
*   每个对象都与一个monitor相关联，线程可以占有或者释放monitor。

好的，剥到这里，我们还有一些不清楚的地方，**monitor是什么呢，为什么它可以实现同步呢？对象又是怎样跟monitor关联**的呢？客观别急，我们继续剥下一层，请往下看。

monitor监视器
----------

montor到底是什么呢？**我们接下来剥开Synchronized的第三层，monitor是什么？** 它可以理解为一种**同步工具**，或者说是**同步机制**，它通常被描述成一个对象。操作系统的**管程**是概念原理，**ObjectMonitor**是它的原理实现。

![](/images/jueJin/16ca3a7a69089b6.png)

### 操作系统的管程

*   管程 (英语：Monitors，也称为监视器) 是一种程序结构，结构内的多个子程序（对象或模块）形成的多个工作线程互斥访问共享资源。
*   这些共享资源一般是硬件设备或一群变量。管程实现了在一个时间点，最多只有一个线程在执行管程的某个子程序。
*   与那些通过修改数据结构实现互斥访问的并发程序设计相比，管程实现很大程度上简化了程序设计。
*   管程提供了一种机制，线程可以临时放弃互斥访问，等待某些条件得到满足后，重新获得执行权恢复它的互斥访问。

### ObjectMonitor

#### ObjectMonitor数据结构

在Java虚拟机（HotSpot）中，Monitor（管程）是由ObjectMonitor实现的，其主要数据结构如下：

```
    ObjectMonitor() {
    _header       = NULL;
    _count        = 0; // 记录个数
    _waiters      = 0,
    _recursions   = 0;
    _object       = NULL;
    _owner        = NULL;
    _WaitSet      = NULL;  // 处于wait状态的线程，会被加入到_WaitSet
    _WaitSetLock  = 0 ;
    _Responsible  = NULL ;
    _succ         = NULL ;
    _cxq          = NULL ;
    FreeNext      = NULL ;
    _EntryList    = NULL ;  // 处于等待锁block状态的线程，会被加入到该列表
    _SpinFreq     = 0 ;
    _SpinClock    = 0 ;
    OwnerIsThread = 0 ;
}
```

#### ObjectMonitor关键字

ObjectMonitor中几个关键字段的含义如图所示：

![](/images/jueJin/16ca302e3334308.png)

#### 工作机理

Java Monitor 的工作机理如图所示：

![](/images/jueJin/16ca34f7e0149c3.png)

*   想要获取monitor的线程,首先会进入\_EntryList队列。
*   当某个线程获取到对象的monitor后,进入\_Owner区域，设置为当前线程,同时计数器\_count加1。
*   如果线程调用了wait()方法，则会进入\_WaitSet队列。它会释放monitor锁，即将\_owner赋值为null,\_count自减1,进入\_WaitSet队列阻塞等待。
*   如果其他线程调用 notify() / notifyAll() ，会唤醒\_WaitSet中的某个线程，该线程再次尝试获取monitor锁，成功即进入\_Owner区域。
*   同步方法执行完毕了，线程退出临界区，会将monitor的owner设为null，并释放监视锁。

为了形象生动一点，举个例子：

```
synchronized(this){  //进入_EntryList队列
doSth();
this.wait();  //进入_WaitSet队列
}
```

OK，我们又剥开一层，知道了monitor是什么了，那**么对象又是怎样跟monitor关联**呢？各位帅哥美女们，我们接着往下看，去剥下一层。

对象与monitor关联
------------

对象是如何跟monitor关联的呢？直接先看图：

![](/images/jueJin/16ca45741a93cf9.png)

看完上图，其实对象跟monitor怎样关联，我们已经有个大概认识了，接下来我们分**对象内存布局，对象头，MarkWord**一层层继续往下探讨。

### 对象的内存布局

在HotSpot虚拟机中,对象在内存中存储的布局可以分为3块区域：对象头（Header），实例数据（Instance Data）和对象填充（Padding）。

![](/images/jueJin/16ca465b4e47dc9.png)

*   **实例数据**：对象真正存储的有效信息，存放类的属性数据信息，包括父类的属性信息；
*   **对齐填充**：由于虚拟机要求 对象起始地址必须是8字节的整数倍。填充数据不是必须存在的，仅仅是为了字节对齐。
*   **对象头**：Hotspot虚拟机的对象头主要包括两部分数据：Mark Word（标记字段）、Class Pointer（类型指针）。

### 对象头

对象头主要包括两部分数据：Mark Word（标记字段）、Class Pointer（类型指针）。

![](/images/jueJin/16ca473cc7ea66e.png)

*   **Class Pointer**:是对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例
*   **Mark Word** : 用于存储对象自身的运行时数据，它是实现轻量级锁和偏向锁的关键。

### Mark word

Mark Word 用于存储对象自身的运行时数据，如哈希码（HashCode）、GC分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等。

在32位的HotSpot虚拟机中，如果对象处于未被锁定的状态下，那么Mark Word的32bit空间里的25位用于存储对象哈希码，4bit用于存储对象分代年龄，2bit用于存储锁标志位，1bit固定为0，表示非偏向锁。其他状态如下图所示：

![](/images/jueJin/16ca4775d4a404c.png)

*   前面分析可知，monitor特点是互斥进行，你再喵一下上图，**重量级锁，指向互斥量的指针**。
*   其实synchronized是**重量级锁**，也就是说Synchronized的对象锁，Mark Word锁标识位为10，其中指针指向的是Monitor对象的起始地址。
*   顿时，是不是感觉柳暗花明又一村啦！对象与monitor怎么关联的？答案：**Mark Word重量级锁，指针指向monitor地址**。

### Synchronized剥开第四层小总结

对象与monitor怎么关联？

*   对象里有对象头
*   对象头里面有Mark Word
*   Mark Word指针指向了monitor

锁优化
---

事实上，只有在JDK1.6之前，synchronized的实现才会直接调用ObjectMonitor的enter和exit，这种锁被称之为重量级锁。**一个重量级锁，为啥还要经常使用它呢？** 从JDK6开始，HotSpot虚拟机开发团队对Java中的锁进行优化，如增加了适应性自旋、锁消除、锁粗化、轻量级锁和偏向锁等优化策略。

### 自旋锁

**何为自旋锁？**

自旋锁是指当一个线程尝试获取某个锁时，如果该锁已被其他线程占用，就一直循环检测锁是否被释放，而不是进入线程挂起或睡眠状态。

**为何需要自旋锁？**

线程的阻塞和唤醒需要CPU从用户态转为核心态，频繁的阻塞和唤醒显然对CPU来说苦不吭言。其实很多时候，锁状态只持续很短一段时间，为了这段短暂的光阴，频繁去阻塞和唤醒线程肯定不值得。因此自旋锁应运而生。

**自旋锁应用场景**

自旋锁适用于锁保护的临界区很小的情况，临界区很小的话，锁占用的时间就很短。

**自旋锁一些思考**

在这里，我想谈谈，**为什么ConcurrentHashMap放弃分段锁，而使用CAS自旋方式**，其实也是这个道理。

### 锁消除

**何为锁消除？**

锁削除是指虚拟机即时编译器在运行时，对一些代码上要求同步，但是被检测到不可能存在共享数据竞争的锁进行削除。

**锁消除一些思考**

在这里，我想引申到日常代码开发中，有一些开发者，在没并发情况下，也使用加锁。如没并发可能，直接上来就ConcurrentHashMap。

### 锁粗化

**何为锁租化？**

锁粗话概念比较好理解，就是将多个连续的加锁、解锁操作连接在一起，扩展成一个范围更大的锁。

**为何需要锁租化？**

在使用同步锁的时候，需要让同步块的作用范围尽可能小—仅在共享数据的实际作用域中才进行同步，这样做的目的是 为了使需要同步的操作数量尽可能缩小，如果存在锁竞争，那么等待锁的线程也能尽快拿到锁。**但是如果一系列的连续加锁解锁操作，可能会导致不必要的性能损耗，所以引入锁粗话的概念。**

**锁租化比喻思考**

举个例子，买门票进动物园。老师带一群小朋友去参观，验票员如果知道他们是个集体，就可以把他们看成一个整体（锁租化），一次性验票过，而不需要一个个找他们验票。

总结
--

我们直接以一张Synchronized洋葱图作为总结吧，如果你愿意一层一层剥开我的心。

![](/images/jueJin/16ca4f292061cb0.png)

参考与感谢
-----

*   Synchronized之管程 [www.jianshu.com/p/32e136181…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F32e1361817f0 "https://www.jianshu.com/p/32e1361817f0")
*   深入理解多线程（一）——Synchronized的实现原理 [www.hollischuang.com/archives/18…](https://link.juejin.cn?target=https%3A%2F%2Fwww.hollischuang.com%2Farchives%2F1883 "https://www.hollischuang.com/archives/1883")
*   深入理解多线程（五）—— Java虚拟机的锁优化技术 [www.hollischuang.com/archives/23…](https://link.juejin.cn?target=https%3A%2F%2Fwww.hollischuang.com%2Farchives%2F2344 "https://www.hollischuang.com/archives/2344")
*   《深入理解Java虚拟机》

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

欢迎大家关注，大家一起学习，一起讨论哈。