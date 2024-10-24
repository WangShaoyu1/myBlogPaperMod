---
author: "京东云开发者"
title: "全局视角看技术-Java多线程演进史"
date: 2024-10-16
description: "作者：京东科技 文涛 前言 2022年09月22日，JDK19发布了，此版本最大的亮点就是支持虚拟线程，从此轻量级线程家族再添一员大将。虚拟线程使JVM摆脱了通过操作系统调度线程的束缚，由JVM自身调"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读24分钟"
weight: 1
selfDefined:"likes:3,comments:1,collects:4,views:101,"
---
作者：京东科技 文涛

> 全文较长共6468字，语言通俗易懂，是一篇具有大纲性质的关于多线程的梳理，作者从历史演进的角度讲了多线程相关知识体系，让你知其然知其所以然。

前言
--

2022年09月22日，JDK19发布了，此版本最大的亮点就是支持虚拟线程，从此轻量级线程家族再添一员大将。虚拟线程使JVM摆脱了通过操作系统调度线程的束缚，由JVM自身调度线程。其实早期sun在Solaris操作系统的虚拟机中实现过JVM调度线程，基于其复杂性，和可维护性考虑，最终都回归到了由操作系统调度线程的模式。

长安归来锦衣客，昨日城南起新宅。回想这一路走来，关于多线程的概念令人烟花缭乱，网上相关讲解也不胜枚举，但总感觉缺少一个全局性的视角。为此笔者系统性的梳理了Java关于多线程的演进史，希望对你掌握多线程知识有帮助。

本文不讲什么：

> 1 不讲某些技术点的详细实现原理，不拆解源码，不画图，如果从本文找到了你感兴趣的概念和技术可以自行搜索 2 不讲支持并发性的库和框架，如Quasar、Akka、Guava等

本文讲什么

> 1 讲JDK多线程的演进历史 2 讲演进中某些技术点的功能原理及背景，以及解决了什么问题 3 讲针对某些技术点笔者的看法，欢迎有不同看法的人在评论区讨论

里程碑
---

老规矩，先上个统计表格。其中梳理了历代JDK中关于线程相关的核心概念。在这里，做一个可能不太恰当的比喻，可以将多线程的演进映射到汽车上，多线程的演进分别经历了手动档时代(JDK1.4及以下)，自动档时代（JDK5-JDK18），自动驾驶时代(JDK19及以后)。这个比喻只为了告诉读者JDK5以后可以有更舒服姿势的驾驭多线程，JDK19以后更是突破了单纯的舒服，它给IO密集型服务的性能带来了质的飞跃。

时代

版本

发布时间

核心概念

手动档

JDK1.0

1996-01-23

Thread和Runnable

手动档

JDK1.2

1998-12-04

ThreadLocal、Collections

自动档

JDK1.5/5.0

2004-09-30

明确Java内存模型、引入并发包

自动档

JDK1.6/6.0

2006-12-11

synchronized优化

自动档

JDK1.7/7.0

2011-07-28

Fork/Join框架

自动档

JDK1.8/8.0

2014-03-18

CompletableFuture、Stream

自动档

JDK1.9/9.0

2014-09-08

改善锁争用机制

自动档

JDK10

2018-03-21

线程-局部管控

自动档

JDK15

2020-09-15

禁用和废弃偏向锁

自动驾驶

JDK19

2022-09-22

虚拟线程

![](/images/jueJin/785b9ac1edb24ec.png)

手动档时代
-----

JDK1.4及以下笔者称之为多线程“手动档”的时代，也叫原生多线程时代。线程的操作还相对原生，没有线程池可用。研发人员必须手写工具避免频繁创建线程造成资源浪费，手动对共享资源加锁。也正是这个时代酝酿了许多优秀的多线程框架，最有名的被JDK5.0采纳了。

### JDK 1.0 Thread和Runnable

1996年1月的JDK1.0版本，从一开始就确立了Java最基础的线程模型，并且，这样的线程模型再后续的修修补补中，并未发生实质性的变更，可以说是一个具有传承性的良好设计。抢占式和协作式是两种常见的进程/线程调度方式，操作系统非常适合使用抢占式方式来调度它的进程，它给不同的进程分配时间片，对于长期无响应的进程，它有能力剥夺它的资源，甚至将其强行停止。采用协作式的方式，需要进程自觉、主动地释放资源，在这种调度方式下,可能一个执行时间很长的线程使得其他所有需要CPU的线程”饿死”。Java hotspot虚拟机的调度方式为抢占式调用，因此Java语言一开始就采用抢占式线程调度的方式。JDK 1.0中创建线程的方式主要是继承Thread类或实现Runnable接口，通过对象实例的start方法启动线程，需要并行处理的代码放在run方法中，线程间的协作通信采用简单粗暴的stop/resume/suspend这样的方法。

如何解释stop/resume/suspend的概念呢？就是主线程可以直接调用子线程的终止，暂停，继续方法。如果你小时候用过随身听，上面有三个按键，终止，暂停，继续。想象一下你正在同时听3个随身听，三个随身听就是三个子线程，你就是主线程，你可以随意控制这三个设备的启停。

这一套机制有个致命的问题，就是容易发生死锁，原因在于当线程A锁定了某个资源，还未释放时，被主线程暂停了(suspend方法并不会释放锁)，此时线程B如果想占有这个资源，只能等待线程A执行继续操作（resume）后释放资源，否则将永远得不到，发生死锁。

### JDK 1.2

粗暴的stop/resume/suspend机制在这个版本被禁止使用了，转而采用wait/notify/sleep这样的多条线程配合行动的方式。值得一提的是，在这个版本中，原子对象AtomicityXXX已经设计好了，主要是解决i++非原子性的问题。ThreadLocal和Collections的加入增加了多线程使用的姿势，因为这两项技术，笔者称它为Java的涡轮增压时代。

#### ThreadLocal

ThreadLocal是一种采用无锁的方式实现多线程共享线程不安全对象的方案。它并不能解决“银行账户或库存增加、扣减”这类问题，它擅长将具有“工具”属性的类，通过复本的方式安全的执行“工具”方法。典型的如SimpleDateFormat、库连接等。值得一提的是它的设计非常巧妙，想像一下如果让你设计，一般的简单思路是：在ThreadLocal里维护一个全局线程安全的Map，key为线程，value为共享对象。这样设计有个弊端就是内存泄露问题，因为该Map会随着越来越多的线程加入而无限膨胀，如果要解决内容泄露，必须在线程结束时清理该Map，这又得强化GC能力了，显然投入产出比不合适。于是，ThreadLocal就被设计成Map不由ThreadLocal持有，而是由Thread本身持有。key为ThreadLocal变量，value为值。每个Thread将所用到的ThreadLoacl都放于其中（当然此设计还有其它衍生问题在此不表，感兴趣的同学可以自行搜索）。

#### Collections

Collections工具类在这个版本被设计出来了，它包装了一些线程安全集合如SynchronizedList。在那个只有Hashtable、Vector、Stack等线程安全集合的年代，它的出现也是具有时代意义的。Collections工具的基本思想是我帮你将线程不安全的集合包装成线程安全的，这样你原有代码升级改造不必花很多时间，只需要在集合创建的时候用我提供方法初始化集合即可。比较像汽车的涡轮增压技术，在发动机排量不变的情况下，增加发动机的功率和扭矩。Java的涡轮增压时代到来了^\_^

自动档时代
-----

### JDK 5.0

#### 引入并发包

Doug Lea，中文名为道格·利。是美国的一个大学教师，大神级的人物，J.U.C就是出自他之手。JDK1.5之前，我们控制程序并发访问同步代码只能使用synchronized，那个时候synchronized的性能还没优化好，性能并不好，控制线程也只能使用Object的wait和notify方法。这个时候Doug Lea给JCP提交了JSR-166的提案，在提交JSR-166之前，Doug Lea已经使用了类似J.U.C包功能的代码已经三年多了，这些代码就是J.U.C的原型。

J.U.C提供了原子化对象、锁及工具套装、线程池、线程安全容器等几大类工具。研发人员可灵活的使用任意能力搭建自己的产品，进可使用ReentrantLock搭建底层框架，退可直接使用现成的工具或容器进行业务代码编写。站在历史的角度去看，J.U.C在2004年毫无争议可以称为“尖端科技产品”。为Java的推广立下了悍马功劳。Java的自动档时代到来了，就好比自动档的汽车降低司机的门槛一样，J.U.C大大降低了程序员使用多线程的门槛。这是个开创了一个时代的产品。

当然J.U.C同样存在一结瑕疵：

**CPU开销大**：如果自旋CAS长时间地不成功，则会给CPU带来非常大的开销。

解决方案：在JUC中有些地方就限制了CAS自旋的次数，例如BlockingQueue的SynchronousQueue。

**ABA问题**：如果一个值原来是A，变成了B，然后又变成了A，在CAS检查时会发现没有改变，但实际它已经改变，这就是ABA问题。大部分情况下ABA问题不会影响程序并发的正确性。

解决方案：每个变量都加上一个版本号，每次改变时加1，即A —> B —> A，变成1A —> 2B —> 3A。Java提供了AtomicStampedReference来解决。AtomicStampedReference通过包装\[E,Integer\]的元组来对对象标记版本戳（stamp），从而避免ABA问题。

**只能保证一个共享变量原子操作**：CAS机制所保证的只是一个变量的原子性操作，而不能保证整个代码块的原子性。

解决方案：比如需要保证3个变量共同进行原子性的更新，就不得不使用Synchronized了。还可以考虑使用AtomicReference来包装多个变量，通过这种方式来处理多个共享变量的情况。

#### 明确Java内存模型

此版本的JDK重新明确了Java内存模型，在这之前，常见的内存模型包括连续一致性内存模型和先行发生模型。 对于连续一致性模型来说，程序执行的顺序和代码上显示的顺序是完全一致的。这对于现代多核，并且指令执行优化的CPU来说，是很难保证的。而且，顺序一致性的保证将JVM对代码的运行期优化严重限制住了。

但是此版本JSR 133规范指定的先行发生（Happens-before）使得执行指令的顺序变得灵活：

> 在同一个线程里面，按照代码执行的顺序（也就是代码语义的顺序），前一个操作先于后面一个操作发生 对一个monitor对象的解锁操作先于后续对同一个monitor对象的锁操作 对volatile字段的写操作先于后面的对此字段的读操作 对线程的start操作（调用线程对象的start()方法）先于这个线程的其他任何操作 一个线程中所有的操作先于其他任何线程在此线程上调用 join()方法 如果A操作优先于B，B操作优先于C，那么A操作优先于C

而在内存分配上，将每个线程各自的工作内存从主存中独立出来，更是给JVM大量的空间来优化线程内指令的执行。主存中的变量可以被拷贝到线程的工作内存中去单独执行，在执行结束后，结果可以在某个时间刷回主存： 但是，怎样来保证各个线程之间数据的一致性？JLS（Java Language Specification）给的办法就是，默认情况下，不能保证任意时刻的数据一致性，但是通过对synchronized、volatile和final这几个语义被增强的关键字的使用，可以做到数据一致性。

### JDK 6.0 synchronized优化

作为“共和国长子”synchronized关键字，在5.0版本被ReentrantLock压过了风头。这个版本必须要扳回一局，因此JDK 6.0对锁做了一些优化，比如锁自旋、锁消除、锁合并、轻量级锁、所偏向等。本次优化是对“精细化管理”这个理念的一次诠释。没优化之前被synchronized加锁的对象只有两个状态：无锁，有锁（重量级锁）。优化后锁一共存在4种状态，级别从低到高依次是：无锁、偏向锁、轻量级锁、重量级锁。这几个状态随着竞争的情况逐渐升级，但是不能降级，目的是为了提高获取锁和释放锁的效率（笔者认为其实是太复杂了，JVM研发人员望而却步了）。

这一次优化让synchronized扬眉吐气，自此再也不允许别人说它的性能比ReentrantLock差了。但好戏还在后头，偏向锁在JDK 15被废弃了（─.─||）。笔者认为synchronized吃亏在了它只是个关键字，JVM负责它底层的动作，到底应用程序加锁的时候什么样的姿势舒服，得靠JVM“猜”。ReentrantLock就不同了，它将这件事直接交给程序员去处理了，你希望公平那就用公平锁，你希望你的不公平，那你就用非公平锁。设计层面算是一种偷懒，但同时也是一种灵活。

### JDK 7.0 Fork/Join框架

Fork/Join的诞生也是一个比较先进的产品，它的核心竞争力在于，支持递归式的任务拆解，同时将各任务结果进行合并。但它是一个既熟悉又陌生的技术，熟悉在于它被应用到各种地方，比如接下来JDK8.0要讲的CompletableFuture和Stream；陌生在于我们似乎很少在业务研发过程中使用到它。

甚至有人甚至觉得它鸡肋。笔者的观点是，你如果是业务需求相关的研发，它是鸡肋的，因为基本用不到，大批数据量的场景有数仓那套工具，其它场景可以用线程池代替；如果你是中间件框架编写相关的研发，它不鸡肋，兴许会用到。中文互联网上很少有人质疑这项技术，但国外已经有人在讨论，感兴趣的可以直接跳转查阅 [Is the Fork-Join framework in Java broken?](https://link.juejin.cn?target=https%3A%2F%2Fsoftwareengineering.stackexchange.com%2Fquestions%2F343402%2Fis-the-fork-join-framework-in-java-broken "https://softwareengineering.stackexchange.com/questions/343402/is-the-fork-join-framework-in-java-broken")

### JDK 8.0

此版本的发布对于Java来说是划时代的，以至于现在全世界在运行的Java程序里此版本占据了一半以上。但多线程相关的更新不如JDK5.0那么具有颠覆性。此版本除了增加了一些原子对象之外 ，最亮眼的便是以下两项更新。

#### CompletableFuture

网上关于CompletableFuture相关介绍很多，大多是讲它原理及怎么用。但是笔者始终不明白一个问题：为什么在有那么多线程池工具的情况下，还会有CompletableFuture的出现，它解决了什么痛点？它的核心竞争力到底是什么？相信你如果进行过思考也会提出这个问题，没关系，笔者已经帮你找到了答案。

结论：CompletableFuture的核心竞争力是**任务编排**。CompletableFuture继承Future接口特性，可以进行并发执行任务等特性这些能力都是有可替代性的。但它的任务编排能力无可替代，它的核心API中包括了构造任务链，合并任务结果等都是为了任务编排而设计的。所以JDK之所以在此版本引入此框架，主要是解决业务开发中越来越痛的任务编排需求。

最后多说一句，CompletableFuture底层使用了Fork/Join框架实现。

#### Stream

《架构整洁之道》里曾提到有三种编程范式，结构化编程（面向过程编程）、面向对象编程、函数式编程。Stream是函数式编程在Java语言中的一种体现，笔者认为，初级程序员向中级进阶的必经之路就是攻克Stream，初次接触Stream肯定特别不适应，但如果熟悉以后你将打开一个编程方式的新思路。作为研发人员经常混淆三个概念，函数式编程、Stream、Lambda表达式，总以为他们三个说的是一回事。以下是笔者的理解：

•函数式编程是一种编程思想，各种编程语言中都有该思想的实践

•Stream是JDK8.0的一个新特性，也可以理解新造了个概念，目的就是迎合函数式编程这种思想，通过Stream的形式可以在集合类上实现函数式编程

•Lambda 表达式（lambda expression）是一个匿名函数，通过它可以更简洁高效的表达函数式编程

那么说了这么多，Stream和多线程什么关系？Stream中的相关并行方法底层是使用了Fork/Join框架实现的。《Effective Java》中有一条相关建议“谨慎使用Stream并行”，理由就是因为所有的并行都是在一个通用的Fork/Join池中运行的，一个pipeline运行异常，可能损害其他不相关部分性能。

### JDK 9.0

#### 改善锁争用机制

锁争用限制了许多Java多线程应用性能，新的锁争用机制改善了Java对象监视器的性能，并得到了多种基准测试的验证（如Volano）,这类测试可以估算JVM的极限吞吐量。实际中, 新的锁争用机制在22种不同的基准测试中都得到了出色的成绩。如果新的机制能在Java 9中得到应用的话, 应用程序的性能将会大大提升。简单的解释就是当多个线程发生锁争用时，优化之前：晚到的线程统一采用相同的标准流程进行锁等待。优化后：JVM识别出一些可优化的场景时直接让晚到的线程进行“VIP通道”式的锁抢占。

详细解释请参考： [Contended locks explained – a performance approach](https://link.juejin.cn?target=https%3A%2F%2Fionutbalosin.com%2F2018%2F06%2Fcontended-locks-explained-a-performance-approach%2F "https://ionutbalosin.com/2018/06/contended-locks-explained-a-performance-approach/")

#### 响应式流

响应式流(Reactive Streams)是一种以非阻塞背压方式处理异步数据流的标准，提供一组最小化的接口，方法和协议来描述必要的操作和实体。

> 什么叫非阻塞背压？ 背压是back pressure的缩写，简单讲，生产者给消费者推送数据，当消费者处理不动了，告知生产者，此时生产者降低生产速率，此机制使用阻塞的方式实现最简单，即推送时直接返回压力数据。非阻塞方式实现增加了设计的复杂度，同时提高了性能。 PS:感觉背压这个词翻译的不好，不能望文生义。反压是不是更好^\_^

为了解决消费者承受巨大的资源压力(pressure)而有可能崩溃的问题，数据流的速度需要被控制，即流量控制(flow control)，以防止快速的数据流不会压垮目标。因此需要反压即背压(back pressure)，生产者和消费者之间需要通过实现一种背压机制来互操作。实现这种背压机制要求是异步非阻塞的，如果是同步阻塞的，消费者在处理数据时生产者必须等待，会产生性能问题。

响应式流(Reactive Streams)通过定义一组实体，接口和互操作方法，给出了实现非阻塞背压的标准。第三方遵循这个标准来实现具体的解决方案，常见的有Reactor，RxJava，Akka Streams，Ratpack等。

### JDK 10 线程-局部管控

Safepoint及其不足：

Safepoint是Hotspot JVM中一种让所有应用程序停止的一种机制。JVM为了做一些底层的工作，必须要Stop The World，让应用线程都停下来。但不能粗暴的直接停止，而是会给应用线程发送个指令信号告诉他，你该停下了。此时应用线程执行到一个Safepoint点时就会听从指令并响应。这也是为什么叫Safepoint。之所以加safe，是强调JVM要做一些全局的安全的事情了，所以给这个点加了个safe。

> 全局的安全的事情包括以下： 1、垃圾清理暂停 2、代码去优化（Code deoptimization）。 3、flush code cache。 4、类文件重新定义时（Class redefinition，比如热更新 or instrumentation)。 5、偏向锁的取消（Biased lock revocation）。 6、各种debug操作(比如： 死锁检查或者stacktrace dump等)。

然而，让所有线程都到就近的safepoint停下来本身就需要较长的时间。而且让所有线程都停下来是不是显得太过鲁莽和专断了呢。为此Java10就引入了一种可以不用stop all threads的方式，就是线程-局部管控（Thread Local Handshake）。

> 比如以下是不需要stop所有线程就可以搞定的场景： 1、偏向锁撤销。这个事情只需要停止单个线程就可以撤销偏向锁，而不需要停止所有的线程。 2、减少不同类型的可服务性查询的总体VM延迟影响，例如获取具有大量Java线程的VM上的所有线程的stack trace可能是一个缓慢的操作。 3、通过减少对信号（signals）的依赖来执行更安全的stack trace采样。 4、使用所谓的非对称Dekker同步技术，通过与Java线程握手来消除一些内存障碍。 例如，G1和CMS里使用的“条件卡标记码”（conditional card mark code），将不再需要“内存屏障”这个东东。这样的话，G1发送的“写屏障（write barrier）”就可以被优化， 并且那些尝试要规避“内存屏障”的分支也可以被删除了。

### JDK 15 禁用和废弃偏向锁

为什么要废弃偏向锁？偏向锁在过去带来的的性能提升，在现在看来已经不那么明显了。受益于偏向锁的应用程序，往往是使用了早期 Java 集合 API的程序（JDK 1.1），这些 API（Hashtable 和 Vector） 每次访问时都进行同步。JDK 1.2 引入了针对单线程场景的非同步集合（HashMap 和 ArrayList），JDK 1.5 针对多线程场景推出了性能更高的并发数据结构。这意味着如果代码更新为使用较新的类，由于不必要同步而受益于偏向锁的应用程序，可能会看到很大的性能提高。此外，围绕线程池队列和工作线程构建的应用程序，性能通常在禁用偏向锁的情况下变得更好。

> 以下以使用了Hashtable 和 Vector的API实现： _java.lang.Classloader_ _uses Vector_ _java.util.Properties_ _extends Hashtable_ _java.security.Provider_ _extends Properties_ _java.net.URL_ _uses Hashtable_ _java.net.URConnection_ _uses Hashtable_ _java.util.ZipOutputStream_ _uses Vector_ _javax.management.timer.TimerMBean_ _has Vector on the interface_

自动驾驶时代
------

虚拟线程使Java进入了自动驾驶时代。很多语言都有类似于“虚拟线程”的技术，比如Go、C#、Erlang、Lua等，他们称之为“协程”。这次java没有新增任何关键字，甚至没有新增新的概念，虚拟线程比起goroutine，协程，要好理解得多，看这名字就大概知道它在做啥了。

### JDK 19 虚拟线程

传统Java中的线程模型与操作系统是 1:1 对应的，创建和切换线程代价很大，受限于操作系统，只能创建有限的数量。当并发量很大时，无法为每个请求都创建一个线程。使用线程池可以缓解问题，线程池减少了线程创建的消耗，但是也无法提升线程的数量。假如并发量是2000，线程池只有1000个线程，那么同一时刻只能处理1000个请求，还有1000个请求是无法处理的，可以拒绝掉，也可以使其等待，直到有线程让出。

虚拟线程的之前的方案是采用异步风格。已经有很多框架实现了异步风格的并发编程（如Spring5的Reactor），通过线程共享来实现更高的可用性。原理是通过线程共享减少了线程的切换，降低了消耗，同时也避免阻塞，只在程序执行时使用线程，当程序需要等待时则不占用线程。异步风格确实有不少提升，但是也有缺点。大部分异步框架都使用链式写法，将程序分为很多个步骤，每个步骤可能会在不同的线程中执行。你不能再使用熟悉的 ThreadLocal 等并发编程相关的API，否则可能会有错误。编程风格上也有很大的变化，比传统模式的编程风格要复杂很多，学习成本高，可能还要改造项目中的很多已有模块使其适配异步模式。

虚拟线程的实现原理和一些异步框架差不多，也是线程共享，当然也就不需要池化。在使用时你可以认为虚拟线程是无限充裕的，你想创建多少就创建多少，不必担心会有问题。不仅如此，虚拟线程支持 debug，并且能被 Java 相关的监控工具所支持，这很重要。虚拟线程会使你程序的内存占用大幅降低，所有IO密集型应用，比如Web Servers，都可以在同等硬件条件下，大幅提升IO的吞吐量。原来1G内存，同时可以host 1000个访问，使用虚拟线程后，按照官方的说法，能轻松处理100万的并发，具体到业务场景上能否支撑还要看压力测试，但是我们打个折扣，10万应该能够轻松实现，而你不需要为此付出任何的代价，可能连代码都不用改。因为虚拟线程可以使得你保持传统的编程风格，也就是一个请求一个线程的模式，像使用线程一样使用虚拟线程，程序只需要做很少的改动。虚拟线程也没有引入新的语法，可以说学习和迁移成本极低。

值得一提的是虚拟线程底层依然使用了Fork/Join框架。

推荐阅读
----

[SaaS租户隔离及存储方案梳理](https://link.juejin.cn?target=http%3A%2F%2Fxingyun.jd.com%2Fshendeng%2Farticle%2Fdetail%2F11082 "http://xingyun.jd.com/shendeng/article/detail/11082")

参考
--

[java多线程的发展简史](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Ffindmyself_for_world%2Farticle%2Fdetails%2F41981355 "https://blog.csdn.net/findmyself_for_world/article/details/41981355")

[Java 19 Virtual Threads--Java的虚拟线程到来，给带来哪些改变？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F536743167 "https://www.zhihu.com/question/536743167")

[Java19 正式 GA！看虚拟线程如何大幅提高系统吞吐量](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FyyApBXxpXxVwttr01Hld6Q "https://mp.weixin.qq.com/s/yyApBXxpXxVwttr01Hld6Q")

[虚拟线程 - VirtualThread源码透视](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fthrowable%2Fp%2F16758997.html "https://www.cnblogs.com/throwable/p/16758997.html")

[Linux内核发展史和linux发行版](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_55255438%2Farticle%2Fdetails%2F126813373 "https://blog.csdn.net/weixin_55255438/article/details/126813373")

[Is the Fork-Join framework in Java broken?](https://link.juejin.cn?target=https%3A%2F%2Fsoftwareengineering.stackexchange.com%2Fquestions%2F343402%2Fis-the-fork-join-framework-in-java-broken "https://softwareengineering.stackexchange.com/questions/343402/is-the-fork-join-framework-in-java-broken")

[Java Concurrency Evolution](https://link.juejin.cn?target=https%3A%2F%2Fdzone.com%2Farticles%2Fjava-concurrency-evolution "https://dzone.com/articles/java-concurrency-evolution")

[如何看待Spring 5引入函数式编程思想以及Reactor?](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F52567283 "https://www.zhihu.com/question/52567283")

[java 锁竞争\_Java 9（JEP 143）中针对竞争锁的优化](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_42509766%2Farticle%2Fdetails%2F114610986 "https://blog.csdn.net/weixin_42509766/article/details/114610986")

[Contended locks explained – a performance approach](https://link.juejin.cn?target=https%3A%2F%2Fionutbalosin.com%2F2018%2F06%2Fcontended-locks-explained-a-performance-approach%2F "https://ionutbalosin.com/2018/06/contended-locks-explained-a-performance-approach/")

﻿[一次与印度兄弟就Java10中的Thread-Local Handshakes的探讨](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1115657 "https://cloud.tencent.com/developer/article/1115657")

[Disable biased-locking and deprecate all flags related to biased-locking](https://link.juejin.cn?target=https%3A%2F%2Fwww.reddit.com%2Fr%2Fjava%2Fcomments%2Fdy324a%2Fdisable_biasedlocking_and_deprecate_all_flags%2F "https://www.reddit.com/r/java/comments/dy324a/disable_biasedlocking_and_deprecate_all_flags/")

[Why Do We Need Completable Future?](https://link.juejin.cn?target=https%3A%2F%2Fmincong.io%2F2020%2F06%2F26%2Fcompletable-future%2F "https://mincong.io/2020/06/26/completable-future/")

[java并发包JUC诞生及详细内容](https://link.juejin.cn?target=https%3A%2F%2Fwww.lsjlt.com%2Fnews%2F140687.html "https://www.lsjlt.com/news/140687.html")

[Java 19 Virtual Threads--Java的虚拟线程到来，给带来哪些改变？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F536743167 "https://www.zhihu.com/question/536743167")

[响应式流(Reactive,Streams)](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwudaoshihun%2Farticle%2Fdetails%2F83070086 "https://blog.csdn.net/wudaoshihun/article/details/83070086")

[JAVA19虚拟线程以及原理](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_25353539%2Farticle%2Fdetails%2F126739697 "https://blog.csdn.net/qq_25353539/article/details/126739697")