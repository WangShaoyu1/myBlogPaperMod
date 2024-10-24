---
author: "捡田螺的小男孩"
title: "10个经典又容易被人疏忽的JVM面试题"
date: 2020-11-22
description: "1 对象一定分配在堆中吗？有没有了解逃逸分析技术？ 对象一定分配在堆中吗？ 不一定的，JVM通过逃逸分析，那些逃不出方法的对象会在栈上分配。 逃逸分析(Escape Analysis)，是一种可以有效减少Java 程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。通过…"
tags: ["Java","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:86,comments:5,collects:168,views:5213,"
---
### 前言

整理了10个经典又容易被疏忽的JVM面试题，谢谢阅读，大家加油哈

github地址，感谢每颗star

> [github.com/whx123/Java…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")

公众号：**捡田螺的小男孩**

### 1\. 对象一定分配在堆中吗？有没有了解逃逸分析技术？

**对象一定分配在堆中吗？** 不一定的，JVM通过**逃逸分析**，那些逃不出方法的对象会在栈上分配。

*   **什么是逃逸分析？**

逃逸分析(Escape Analysis)，是一种可以有效减少Java 程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。通过逃逸分析，Java Hotspot编译器能够分析出一个新的对象的引用的使用范围，从而决定是否要将这个对象分配到堆上。

> 逃逸分析是指分析指针动态范围的方法，它同编译器优化原理的指针分析和外形分析相关联。当变量（或者对象）在方法中分配后，其指针有可能被返回或者被全局引用，这样就会被其他方法或者线程所引用，这种现象称作指针（或者引用）的逃逸(Escape)。通俗点讲，如果一个对象的指针被多个方法或者线程引用时，那么我们就称这个对象的指针发生了逃逸。

*   **一个逃逸分析的例子**

```typescript
/**
*  @author 捡田螺的小男孩
*/
    public class EscapeAnalysisTest {
    
    public static Object object;
    
    //StringBuilder可能被其他方法改变，逃逸到了方法外部。
        public StringBuilder  escape(String a, String b) {
        //公众号：捡田螺的小男孩
        StringBuilder str = new StringBuilder();
        str.append(a);
        str.append(b);
        return str;
    }
    
    //不直接返回StringBuffer,不发生逃逸
        public String notEscape(String a, String b) {
        //公众号：捡田螺的小男孩
        StringBuilder str = new StringBuilder();
        str.append(a);
        str.append(b);
        return str.toString();
    }
    
    //外部线程可见object,发生逃逸
        public void objectEscape(){
        object = new Object();
    }
    
    //仅方法内部可见,不发生逃逸
        public void objectNotEscape(){
        Object object = new Object();
    }
}
```

**逃逸分析的好处**

> *   栈上分配，可以降低垃圾收集器运行的频率。
> *   同步消除，如果发现某个对象只能从一个线程可访问，那么在这个对象上的操作可以不需要同步。
> *   标量替换，把对象分解成一个个基本类型，并且内存分配不再是分配在堆上，而是分配在栈上。这样的好处有，一、减少内存使用，因为不用生成对象头。 二、程序内存回收效率高，并且GC频率也会减少。

### 2.虚拟机为什么使用元空间替换了永久代？

**什么是元空间？什么是永久代？为什么用元空间代替永久代？** 我们先回顾一下**方法区**吧,看看虚拟机运行时数据内存图，如下:

![](/images/jueJin/2c2c0b50122d416.png)

> 方法区和堆一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译后的代码等数据。

**什么是永久代？它和方法区有什么关系呢？**

> 如果在HotSpot虚拟机上开发、部署，很多程序员都把方法区称作永久代。可以说方法区是规范，永久代是Hotspot针对该规范进行的实现。在Java7及以前的版本，方法区都是永久代实现的。

**什么是元空间？它和方法区有什么关系呢？**

> 对于Java8，HotSpots取消了永久代，取而代之的是元空间(Metaspace)。换句话说，就是方法区还是在的，只是实现变了，从永久代变为元空间了。

**为什么使用元空间替换了永久代？**

*   永久代的方法区，和堆使用的物理内存是连续的。

![](/images/jueJin/b1bbd1389486402.png)

**永久代**是通过以下这两个参数配置大小的~

*   \-XX:PremSize：设置永久代的初始大小
*   \-XX:MaxPermSize: 设置永久代的最大值，默认是64M

对于**永久代**，如果动态生成很多class的话，就很可能出现**java.lang.OutOfMemoryError: PermGen space错误**，因为永久代空间配置有限嘛。最典型的场景是，在web开发比较多jsp页面的时候。

*   JDK8之后，方法区存在于元空间(Metaspace)。物理内存不再与堆连续，而是直接存在于本地内存中，理论上机器**内存有多大，元空间就有多大**。

![](/images/jueJin/b2021e5ce1e549b.png)

可以通过以下的参数来设置元空间的大小：

> *   \-XX:MetaspaceSize，初始空间大小，达到该值就会触发垃圾收集进行类型卸载，同时GC会对该值进行调整：如果释放了大量的空间，就适当降低该值；如果释放了很少的空间，那么在不超过MaxMetaspaceSize时，适当提高该值。
> *   \-XX:MaxMetaspaceSize，最大空间，默认是没有限制的。
> *   \-XX:MinMetaspaceFreeRatio，在GC之后，最小的Metaspace剩余空间容量的百分比，减少为分配空间所导致的垃圾收集
> *   \-XX:MaxMetaspaceFreeRatio，在GC之后，最大的Metaspace剩余空间容量的百分比，减少为释放空间所导致的垃圾收集

**所以，为什么使用元空间替换永久代？**

> 表面上看是为了避免OOM异常。因为通常使用PermSize和MaxPermSize设置永久代的大小就决定了永久代的上限，但是不是总能知道应该设置为多大合适, 如果使用默认值很容易遇到OOM错误。 当使用元空间时，可以加载多少类的元数据就不再由MaxPermSize控制, 而由系统的实际可用空间来控制啦。

### 3.什么是Stop The World ? 什么是OopMap？什么是安全点？

进行垃圾回收的过程中，会涉及对象的移动。为了保证对象引用更新的正确性，必须暂停所有的用户线程，像这样的停顿，虚拟机设计者形象描述为**Stop The World**。

在HotSpot中，有个数据结构（映射表）称为**OopMap**。一旦类加载动作完成的时候，HotSpot就会把对象内什么偏移量上是什么类型的数据计算出来，记录到OopMap。在即时编译过程中，也会在**特定的位置**生成 OopMap，记录下栈上和寄存器里哪些位置是引用。

这些特定的位置主要在：

*   1.循环的末尾（非 counted 循环）
*   2.方法临返回前 / 调用方法的call指令后
*   3.可能抛异常的位置

这些位置就叫作**安全点(safepoint)。** 用户程序执行时并非在代码指令流的任意位置都能够在停顿下来开始垃圾收集，而是必须是执行到安全点才能够暂停。

### 4.说一下JVM 的主要组成部分及其作用？

![](/images/jueJin/c592a78d7eb649a.png)

JVM包含两个子系统和两个组件，分别为

> *   Class loader(类装载子系统)
> *   Execution engine(执行引擎子系统)；
> *   Runtime data area(运行时数据区组件)
> *   Native Interface(本地接口组件)。

*   **Class loader(类装载)：** 根据给定的全限定名类名(如：java.lang.Object)来装载class文件到运行时数据区的方法区中。
*   **Execution engine（执行引擎）**：执行class的指令。
*   **Native Interface(本地接口)：** 与native lib交互，是其它编程语言交互的接口。
*   **Runtime data area(运行时数据区域)**：即我们常说的JVM的内存。

> 首先通过编译器把 Java源代码转换成字节码，Class loader(类装载)再把字节码加载到内存中，将其放在运行时数据区的方法区内，而字节码文件只是 JVM 的一套指令集规范，并不能直接交给底层操作系统去执行，因此需要特定的命令解析器执行引擎（Execution Engine），将字节码翻译成底层系统指令，再交由 CPU 去执行，而这个过程中需要调用其他语言的本地库接口（Native Interface）来实现整个程序的功能。

### 5\. 守护线程是什么？守护线程和非守护线程的区别是？守护线程的作用是？

**守护线程**是区别于用户线程哈，**用户线程**即我们手动创建的线程，而守护线程是程序运行的时候在后台提供一种**通用服务的线程**。垃圾回收线程就是典型的守护线程。

**守护线程和非守护线程的区别是？** 我们通过例子来看吧~

```csharp
/**
* 关注公众号：捡田螺的小男孩
*/
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(()-> {
            while (true) {
                try {
                Thread.sleep(1000);
                System.out.println("我是子线程(用户线程.I am running");
                    } catch (Exception e) {
                }
            }
            });
            //标记为守护线程
            t1.setDaemon(true);
            //启动线程
            t1.start();
            
            Thread.sleep(3000);
            System.out.println("主线程执行完毕...");
        }
```

运行结果：

![](/images/jueJin/9c39494e1f044fd.png)

可以发现标记为守护线程后，**主线程销毁停止，守护线程一起销毁**。我们再看下，去掉 t1.setDaemon(true)守护标记的效果：

```csharp
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(()-> {
            while (true) {
                try {
                Thread.sleep(1000);
                System.out.println("我是子线程(用户线程.I am running");
                    } catch (Exception e) {
                }
            }
            });
            //启动线程
            t1.start();
            
            Thread.sleep(3000);
            System.out.println("主线程执行完毕...");
        }
```

![](/images/jueJin/41243ddd54924d0.png)

所以，当主线程退出时，JVM 也跟着退出运行，守护线程同时也会被回收，即使是死循环。如果是用户线程，它会一直停在死循环跑。这就是**守护线程和非守护线程的区别**啦。

守护线程拥有**自动结束自己生命周期的特性**，非守护线程却没有。如果垃圾回收线程是非守护线程，当JVM 要退出时，由于垃圾回收线程还在运行着，导致程序无法退出，这就很尴尬。这就是**为什么垃圾回收线程需要是守护线程啦**。

### 6.WeakHashMap了解过嘛？它是怎么工作的？

**WeakHashMap** 类似HashMap ，不同点在WeakHashMap的key是**弱引用**的key。

谈到**弱引用**，在这里回顾下四种引用吧

> *   强引用：Object obj=new Object()这种，只要强引用关系还存在，垃圾收集器就永远不会回收掉被引用的对象。
> *   软引用: 一般情况不会回收，如果内存不够要溢出时才会进行回收
> *   弱引用： 当垃圾收集器开始工作，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。
> *   虚引用：为一个对象设置虚引用的唯一目的只是为了能在这个对象被回收时收到一个系统的通知。

正是因为WeakHashMap使用的是弱引用，**它的对象可能随时被回收**。WeakHashMap 类的行为部分**取决于垃圾回收器的动作**,调用两次size()方法返回不同值，调用两次isEmpty()，一次返回true，一次返回false都是**可能的**。

WeakHashMap**工作原理**回答这两点：

> *   1.  WeakHashMap具有弱引用的特点：随时被回收对象。
> *   2.  发生GC时，WeakHashMap是如何将Entry移除的呢？

WeakHashMap内部的Entry继承了WeakReference，即弱引用，所以就具有了弱引用的特点，**随时可能被回收**。看下源码哈：

```scala
    private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V> {
    V value;
    final int hash;
    Entry<K,V> next;
    
    /**
    * Creates new entry.
    */
    Entry(Object key, V value,
    ReferenceQueue<Object> queue,
        int hash, Entry<K,V> next) {
        super(key, queue);
        this.value = value;
        this.hash  = hash;
        this.next  = next;
    }
    ......
```

**WeakHashMap是如何将Entry移除的？** GC每次清理掉一个对象之后，引用对象会放到ReferenceQueue的，接着呢遍历queue进行删除。WeakHashMap的增删改查操作，就是直接/间接调用expungeStaleEntries()方法，达到及时清除过期entry的目的。可以看下expungeStaleEntries源码哈：

```ini
/**
* Expunges stale entries from the table.
*/
    private void expungeStaleEntries() {
        for (Object x; (x = queue.poll()) != null; ) {
            synchronized (queue) {
            @SuppressWarnings("unchecked")
            Entry<K,V> e = (Entry<K,V>) x;
            int i = indexFor(e.hash, table.length);
            
            Entry<K,V> prev = table[i];
            Entry<K,V> p = prev;
                while (p != null) {
                Entry<K,V> next = p.next;
                    if (p == e) {
                    if (prev == e)
                    table[i] = next;
                    else
                    prev.next = next;
                    // Must not null out e.next;
                    // stale entries may be in use by a HashIterator
                    e.value = null; // Help GC
                    size--;
                    break;
                }
                prev = p;
                p = next;
            }
        }
    }
}
```

### 7\. 是否了解Java语法糖嘛？说下12种Java中常用的语法糖？

语法糖（Syntactic Sugar），也称糖衣语法，让程序更加简洁，有更高的可读性。Java 中最常用的语法糖主要有泛型、变长参数、条件编译、自动拆装箱、内部类等12种。

*   语法糖一、switch 支持 String 与枚举
*   语法糖二、 泛型
*   语法糖三、 自动装箱与拆箱
*   语法糖四 、 方法变长参数
*   语法糖五 、 枚举
*   语法糖六 、 内部类
*   语法糖七 、条件编译
*   语法糖八 、 断言
*   语法糖九 、 数值字面量
*   语法糖十 、 for-each
*   语法糖十一 、 try-with-resource
*   语法糖十二、Lambda表达式

感兴趣的朋友，可以看下这篇文章哈：[不了解这12个语法糖，别说你会Java！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzIwOTE2MzU4NA%3D%3D%26mid%3D2247483961%26idx%3D1%26sn%3Da99600e933f0bf528606ebe028f9e22c%26chksm%3D97794616a00ecf004b335f68ed8f1eb990ca5ea11c9510672637ba4e9a2d5b64b8514910761f%26token%3D1672286597%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzIwOTE2MzU4NA==&mid=2247483961&idx=1&sn=a99600e933f0bf528606ebe028f9e22c&chksm=97794616a00ecf004b335f68ed8f1eb990ca5ea11c9510672637ba4e9a2d5b64b8514910761f&token=1672286597&lang=zh_CN#rd")

### 8\. 什么是指针碰撞？什么是空闲列表？什么是TLAB？

> 一般情况下，JVM的对象都放在堆内存中（发生逃逸分析除外）。当类加载检查通过后，Java虚拟机开始为新生对象分配内存。如果Java堆中内存是绝对规整的，所有被使用过的的内存都被放到一边，空闲的内存放到另外一边，中间放着一个指针作为分界点的指示器，所分配内存仅仅是把那个指针向空闲空间方向挪动一段与对象大小相等的实例，这种分配方式就是“**指针碰撞**”。

![](/images/jueJin/4f31d89e352b4e5.png)

> 如果Java堆内存中的内存并不是规整的，已被使用的内存和空闲的内存相互交错在一起，不可以进行指针碰撞啦，虚拟机必须维护一个列表，记录哪些内存是可用的，在分配的时候从列表找到一块大的空间分配给对象实例，并更新列表上的记录，这种分配方式就是“**空闲列表**”

对象创建在虚拟机中是非常频繁的行为，可能存在线性安全问题。如果一个线程正在给A对象分配内存，指针还没有来的及修改，同时另一个为B对象分配内存的线程，仍引用这之前的指针指向，这就出**问题**了。

> 可以把内存分配的动作按照线程划分在不同的空间之中进行，每个线程在Java堆中预先分配一小块内存,这就是**TLAB（Thread Local Allocation Buffer，本地线程分配缓存）** 。虚拟机通过-XX:UseTLAB设定它的。

### 9.CMS垃圾回收器的工作过程，CMS收集器和G1收集器的区别。

CMS(Concurrent Mark Sweep) 收集器： 是一种以获得最短回收停顿时间为目标的收集器，标记清除算法，运作过程：**初始标记，并发标记，重新标记，并发清除**，收集结束会产生大量空间碎片。如图（下图来源互联网）：

![](/images/jueJin/e71ad52006ae451.png)

**CMS收集器和G1收集器的区别：**

*   CMS收集器是老年代的收集器，可以配合新生代的Serial和ParNew收集器一起使用；
*   G1收集器收集范围是老年代和新生代，不需要结合其他收集器使用；
*   CMS收集器以最小的停顿时间为目标的收集器；
*   G1收集器可预测垃圾回收的停顿时间
*   CMS收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片
*   G1收集器使用的是“标记-整理”算法，进行了空间整合，降低了内存空间碎片。

### 10.JVM 调优

JVM调优其实就是通过调节JVM参数，即对垃圾收集器和内存分配的调优，以达到更高的吞吐和性能。JVM调优主要调节以下参数

![](/images/jueJin/8a702dd127c9454.png)

**堆栈内存相关**

> *   \-Xms 设置初始堆的大小
> *   \-Xmx 设置最大堆的大小
> *   \-Xmn 设置年轻代大小，相当于同时配置-XX:NewSize和-XX:MaxNewSize为一样的值
> *   \-Xss 每个线程的堆栈大小
> *   \-XX:NewSize 设置年轻代大小(for 1.3/1.4)
> *   \-XX:MaxNewSize 年轻代最大值(for 1.3/1.4)
> *   \-XX:NewRatio 年轻代与年老代的比值(除去持久代)
> *   \-XX:SurvivorRatio Eden区与Survivor区的的比值
> *   \-XX:PretenureSizeThreshold 当创建的对象超过指定大小时，直接把对象分配在老年代。
> *   \-XX:MaxTenuringThreshold设定对象在Survivor复制的最大年龄阈值，超过阈值转移到老年代

**垃圾收集器相关**

> *   \-XX:+UseParallelGC： 选择垃圾收集器为并行收集器。
> *   \-XX:ParallelGCThreads=20： 配置并行收集器的线程数
> *   \-XX:+UseConcMarkSweepGC： 设置年老代为并发收集。
> *   \-XX:CMSFullGCsBeforeCompaction=5 由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行5次GC以后对内存空间进行压缩、整理。
> *   \-XX:+UseCMSCompactAtFullCollection： 打开对年老代的压缩。可能会影响性能，但是可以消除碎片

**辅助信息相关**

> *   \-XX:+PrintGCDetails 打印GC详细信息
> *   \-XX:+HeapDumpOnOutOfMemoryError让JVM在发生内存溢出的时候自动生成内存快照,排查问题用
> *   \-XX:+DisableExplicitGC禁止系统System.gc()，防止手动误触发FGC造成问题.
> *   \-XX:+PrintTLAB 查看TLAB空间的使用情况

### 参考与感谢

*   [JVM的逃逸分析](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000023475016 "https://segmentfault.com/a/1190000023475016")
*   [面试官 | JVM 为什么使用元空间替换了永久代？](https://link.juejin.cn?target=https%3A%2F%2Fmy.oschina.net%2Fu%2F3471412%2Fblog%2F4426430 "https://my.oschina.net/u/3471412/blog/4426430")
*   [Metaspace 之一：Metaspace整体介绍（永久代被替换原因、元空间特点、元空间内存查看分析方法）](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fduanxz%2Fp%2F3520829.html "https://www.cnblogs.com/duanxz/p/3520829.html")
*   [深入理解WeakHashmap](https://link.juejin.cn?target=https%3A%2F%2Fblog.51cto.com%2Fmikewang%2F880775 "https://blog.51cto.com/mikewang/880775")
*   [一文搞懂WeakHashMap工作原理](https://link.juejin.cn?target=https%3A%2F%2Fbaijiahao.baidu.com%2Fs%3Fid%3D1666368292461068600%26wfr%3Dspider%26for%3Dpc "https://baijiahao.baidu.com/s?id=1666368292461068600&wfr=spider&for=pc")
*   [谈谈什么是守护线程及作用](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fquanxiaoha%2Fp%2F10731361.html "https://www.cnblogs.com/quanxiaoha/p/10731361.html")
*   [浅析java中的TLAB](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F8be816cbb5ed "https://www.jianshu.com/p/8be816cbb5ed")
*   《深入理解Java虚拟机》

### 公众号

后端技术栈公众号：捡田螺的小男孩