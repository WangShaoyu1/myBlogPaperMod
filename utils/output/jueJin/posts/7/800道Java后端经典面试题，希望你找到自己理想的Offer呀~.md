---
author: "捡田螺的小男孩"
title: "800道Java后端经典面试题，希望你找到自己理想的Offer呀~"
date: 2020-05-16
description: "在茫茫的互联网海洋中寻寻觅觅，我收藏了800+道Java经典面试题，分享给你们。建议大家收藏起来，在茶余饭后拿出来读一读，以备未雨绸缪之需。另外，面试题答案的话，我打算后面慢慢完善在github， 希望大家都能找到自己理想的offer呀。 String类能被继承吗，为什么。 讲…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读40分钟"
weight: 1
selfDefined:"likes:3,comments:2,collects:12,views:845,"
---
### 前言

在茫茫的互联网海洋中寻寻觅觅，我收藏了800+道Java经典面试题，分享给你们。建议大家收藏起来，在茶余饭后拿出来读一读，以备未雨绸缪之需。另外，面试题答案的话，我打算后面慢慢完善在[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")， 希望大家都能找到自己理想的offer呀。

*   Java 基础
*   Java 集合
*   Java 并发 && 多线程
*   JVM 篇
*   数据库
*   缓存/Redis
*   计算机网络
*   消息队列
*   mybatis
*   操作系统
*   Spring
*   Netty/tomcat
*   常用Linux 命令
*   ZooKeeper
*   Elasticsearch
*   dubbo框架
*   Spring cloud
*   Nginx
*   算法
*   大厂方案设计面试题

这些面试题也会收藏在我的个人公众号上（**公众号：捡田螺的小男孩**），欢迎关注，交个朋友哦~

### Java 基础

1.  equals与==的区别
2.  final, finally, finalize 的区别
3.  重载和重写的区别
4.  两个对象的hashCode()相同，则 equals()是否也一定为 true？
5.  抽象类和接口有什么区别
6.  BIO、NIO、AIO 有什么区别？
7.  String，Stringbuffer，StringBuilder的区别
8.  JAVA中的几种基本数据类型是什么，各自占用多少字节呢
9.  Comparator与Comparable有什么区别？
10.  String类能被继承吗，为什么。
11.  说说Java中多态的实现原理
12.  Java泛型和类型擦除
13.  int和Integer 有什么区别，还有Integer缓存的实现
14.  说说反射的用途及实现原理，Java获取反射的三种方法
15.  面向对象的特征
16.  &和&&的区别
17.  Java中IO流分为几种?
18.  讲讲类的实例化顺序，比如父类静态数据，构造函数，子类静态数据，构造函数。
19.  Java创建对象有几种方式
20.  如何将GB2312编码的字符串转换为ISO-8859-1编码的字符串呢？
21.  守护线程是什么？用什么方法实现守护线程
22.  notify()和 notifyAll()有什么区别？
23.  Java语言是如何处理异常的，关键字throws、throw、try、catch、finally怎么使用？
24.  谈谈Java的异常层次结构
25.  静态内部类与非静态内部类有什么区别区别
26.  String s与new String与有什么区别
27.  反射中，Class.forName和ClassLoader的区别
28.  JDK动态代理与cglib实现的区别
29.  error和exception的区别，CheckedException，RuntimeException的区别。
30.  深拷贝和浅拷贝区别
31.  JDK 和 JRE 有什么区别？
32.  String 类的常用方法都有那些呢？
33.  谈谈自定义注解的场景及实现
34.  说说你熟悉的设计模式有哪些？
35.  抽象工厂和工厂方法模式的区别？
36.  什么是值传递和引用传递？
37.  可以在static环境中访问非static变量吗？
38.  Java支持多继承么,为什么？
39.  用最有效率的方法计算2乘以8？
40.  构造器是否可被重写？
41.  char型变量中能不能存贮一个中文汉字，为什么？
42.  如何实现对象克隆？
43.  object中定义了哪些方法？
44.  hashCode的作用是什么？
45.  for-each与常规for循环的效率对比
46.  写出几种单例模式实现，懒汉模式和饿汉模式区别
47.  请列出 5 个运行时异常。
48.  2个不相等的对象有可能具有相同的 hashcode吗？
49.  访问修饰符public,private,protected,以及default的区别？
50.  谈谈final在java中的作用？
51.  java中的Math.round(-1.5) 等于多少呢？
52.  String属于基础的数据类型吗？
53.  如何将字符串反转呢？
54.  描述动态代理的几种实现方式，它们分别有什么优缺点
55.  在自己的代码中，如果创建一个java.lang.String类，这个类是否可以被类加载器加载？为什么。
56.  谈谈你对java.lang.Object对象中hashCode和equals方法的理解。在什么场景下需要重新实现这两个方法。
57.  在jdk1.5中，引入了泛型，泛型的存在是用来解决什么问题。
58.  什么是序列化，怎么序列化，反序列呢？
59.  java8的新特性。
60.  匿名内部类是什么？如何访问在其外面定义的变量呢？
61.  break和continue有什么区别？
62.  String s = "Hello";s = s + " world!";这两行代码执行后，原始的 String 对象中的内容是否会改变？
63.  怎样将GB2312编码的字符串转换为ISO-8859-1编码的字符串？
64.  try-catch-finally-return执行顺序
65.  Java 7新的 try-with-resources语句，平时有使用吗
66.  简述一下面向对象的”六原则一法则”。
67.  switch是否能作用在byte 上，是否能作用在long 上，是否能作用在String上？
68.  数组有没有length()方法？String有没有length()方法？
69.  是否可以从一个静态（static）方法内部发出对非静态（non-static）方法的调用？
70.  String s = new String("jay");创建了几个字符串对象？
71.  匿名内部类是否可以继承其它类？是否可以实现接口？
72.  我们能将int强制转换为 byte类型的变量吗？如果该值大于byte 类型的范围，将会出现什么现象？
73.  float f=3.4;正确吗？
74.  你能写出一个正则表达式来判断一个字符串是否是一个数字吗？
75.  Reader和InputStream区别？
76.  列举出JAVA中6个比较常用的包
77.  JDK 7有哪些新特性
78.  同步和异步有什么区别？
79.  实际开发中，Java一般使用什么数据类型来代表价格？
80.  64 位 JVM 中，int 的长度是多数？
81.  java8的新特性
82.  字节流与字符流的区别
83.  Java 事件机制包括哪三个部分？分别介绍下。
84.  为什么等待和通知是在 Object 类而不是 Thread 中声明的？
85.  每个对象都可上锁，这是在 Object类而不是 Thread 类中声明，为什么呢？
86.  为什么char 数组比Java中的 String 更适合存储密码？
87.  如何使用双重检查锁定在 Java 中创建线程安全的单例？
88.  如果你的Serializable类包含一个不可序列化的成员，会发生什么？你是如何解决的？
89.  什么是serialVersionUID ？如果你不定义这个, 会发生什么？
90.  Java 中，Maven 和 ant，gradle 有什么区别？
91.  常见的序列化协议有哪些
92.  @transactional注解在什么情况下会失效，为什么。
93.  Java 中，DOM 和SAX 解析器有什么不同？
94.  数组在内存中如何分配；
95.  什么是 Busy spin？我们为什么要使用它？
96.  Java 中怎么获取一份线程 dump 文件？
97.  父类的静态方法能否被子类重写
98.  什么是不可变对象
99.  如何正确的退出多层嵌套循环？
100.  SimpleDateFormat是线程安全的吗?你一般怎么格式化
101.  抽象类必须要有抽象方法吗？
102.  怎么实现动态代理？有哪些应用
103.  什么是内部类？内部类的作用
104.  泛型中extends和super的区别
105.  内部类有几种，在项目中的有哪些应用
106.  utf-8编码中的中文占几个字节；int型几个字节？
107.  说说你对Java注解的理解
108.  Java 中 java.util.Date 与 java.sql.Date 有什么区别？
109.  说一下隐式类型转换
110.  抽象类能使用final修饰吗
111.  给我一个符合开闭原则的设计模式的例子
112.  Files的常用方法都有哪些
113.  Java 中，Serializable与Externalizable 的区别？
114.  Java锁有哪些种类，它们都有哪些区别
115.  抽象的方法是否可同时是静态的）,是否可同时是本地方法），是否可同时被 synchronized 修饰？
116.  一个”.java”源文件中是否可以包含多个类（不是内部类）？有什么限制？
117.  说说代理的实现原理
118.  了解哪设计模式，举例说说在jdk源码哪些用到了你说的设计模式
119.  什么是B/S架构？什么是C/S架构
120.  Java有那些开发平台呢？
121.  Java内部类为什么可以访问到外部类呢？
122.  Java支持的数据类型有哪些？什么是自动拆装箱呢？
123.  创建线程有几种不同的方式
124.  hashCode()和equals()方法的重要性体现在什么地方？
125.  如何通过反射获取和设置对象私有字段的值？
126.  如何通过反射调用对象的方法？
127.  简述一下面向对象的"六原则一法则"
128.  Java 对象不使用时为什么要赋值为 null？
129.  什么时候用断言（assert）？
130.  AJAX请求为什么不安全？
131.  一个Java字符串中到底能有多少个字符?
132.  StringBuilder为什么线程不安全？
133.  深克隆和浅克隆
134.  聊一聊设计模式的基本原则
135.  Java 能否自定义一个类叫 java.lang.System？
136.  Java中的两种异常类型是什么？他们有什么区别？
137.  Java中Exception和Error有什么区别？
138.  throw和throws有什么区别？
139.  异常处理完成以后，Exception对象会发生什么变化？
140.  什么是RMI？
141.  解释下Serialization和Deserialization。
142.  环境变量Path和ClassPath的作用是什么？如何设置这两个环境变量？
143.  字符型常量和字符串常量的区别
144.  构造器Constructor是否可被override
145.  什么是方法的返回值？返回值在类的方法里的作用是什么？
146.  一个类的构造方法的作用是什么？若一个类没有声明构造方法，改程序能正确执行吗？为什么？
147.  静态方法和实例方法有何不同？
148.  对象的相等与指向他们的引用相等，两者有什么不同？
149.  用 Java 写一个线程安全的单例模式
150.  我能在不进行强制转换的情况下将一个 double值赋值给 long类型的变量吗？
151.  java 枚举类型是否可以继承 (final)？
152.  Cloneable 接口实现原理？
153.  继承和聚合的区别？
154.  能用Java覆盖静态方法吗？如果我在子类中创建相同的方法是编译时错误？
155.  什么是Java程序的主类？应用程序和小程序的主类有何不同？
156.  instanceof 工作中使用过吗？
157.  Java自带线程池判断线程池是否已经结束运行的方法叫什么
158.  成员变量与局部变量的区别有那些？
159.  创建一个对象用什么运算符? 对象实体与对象引用有何不同?
160.  一行Java代码是如何执行的？

### Java 集合

1.  Arraylist与LinkedList区别
2.  Collections.sort和Arrays.sort的实现原理
3.  HashMap原理，java8做了什么改变
4.  List 和 Set，Map 的区别
5.  poll()方法和 remove()方法的区别？
6.  HashMap，HashTable，ConcurrentHash的共同点和区别
7.  写一段代码在遍历 ArrayList 时移除一个元素
8.  Java中怎么打印数组？
9.  TreeMap底层？
10.  HashMap 的扩容过程
11.  HashSet是如何保证不重复的
12.  HashMap 是线程安全的吗，为什么不是线程安全的？死循环问题？
13.  LinkedHashMap的应用，底层，原理
14.  哪些集合类是线程安全的？哪些不安全？
15.  ArrayList 和 Vector 的区别是什么？
16.  Collection与Collections的区别是什么？
17.  如何决定使用 HashMap 还是TreeMap？
18.  如何实现数组和 List之间的转换？
19.  迭代器 Iterator 是什么？怎么用，有什么特点？
20.  Iterator 和 ListIterator 有什么区别？
21.  怎么确保一个集合不能被修改？
22.  快速失败(fail-fast)和安全失败(fail-safe)的区别是什么？
23.  什么是Java优先级队列(Priority Queue)？
24.  JAVA8的ConcurrentHashMap为什么放弃了分段锁，有什么问题吗，如果你来设计，你如何设计。
25.  阻塞队列的实现，ArrayBlockingQueue的底层实现？
26.  Java 中的 LinkedList是单向链表还是双向链表？
27.  说一说ArrayList 的扩容机制吧
28.  HashMap 的长度为什么是2的幂次方，以及其他常量定义的含义~
29.  ConcurrenHashMap 原理？1.8 中为什么要用红黑树？
30.  ArrayList的默认大小
31.  为何Collection不从Cloneable和Serializable接口继承？
32.  Enumeration和Iterator接口的区别？
33.  我们如何对一组对象进行排序？
34.  当一个集合被作为参数传递给一个函数时，如何才可以确保函数不能修改它？
35.  说一下 HashSet 的实现原理？
36.  Array 和 ArrayList 有何区别？
37.  在 Queue中poll()和 remove()有什么区别？
38.  ArrayList 如何删除重复的元素或者指定的元素；
39.  讲讲红黑树的特点？
40.  Java集合类框架的最佳实践有哪些？
41.  Enumeration接口和Iterator 接口的区别有哪些？
42.  HashSet和TreeSet有什么区别？
43.  Set里的元素是不能重复的，那么用什么方法来区分重复与否呢? 是用==还是equals()?
44.  说出ArrayList,LinkedList的存储性能和特性
45.  Java中HashMap的key值要是为类对象则该类需要满足什么条件？
46.  ArrayList集合加入1万条数据，应该怎么提高效率
47.  如何对Object的list排序
48.  ArrayList 和 HashMap 的默认大小是多数？
49.  有没有有顺序的Map实现类，如果有，他们是怎么保证有序的
50.  HashMap是怎么解决哈希冲突的

### Java 并发 && 多线程

1.  synchronized 的实现原理以及锁优化？
2.  ThreadLocal原理，使用注意点，应用场景有哪些？
3.  synchronized和ReentrantLock的区别？
4.  说说CountDownLatch与CyclicBarrier 区别
5.  Fork/Join框架的理解
6.  为什么我们调用start()方法时会执行run()方法，为什么我们不能直接调用run()方法？
7.  Java中的volatile关键是什么作用？怎样使用它？在Java中它跟synchronized方法有什么不同？volatile 的实现原理
8.  CAS？CAS 有什么缺陷，如何解决？
9.  如何检测死锁？怎么预防死锁？死锁四个必要条件
10.  如果线程过多,会怎样?
11.  说说 Semaphore原理？
12.  AQS组件，实现原理
13.  假设有T1、T2、T3三个线程，你怎样保证T2在T1执行完后执行，T3在T2执行完后执行？
14.  LockSupport作用是？
15.  Condition接口及其实现原理
16.  说说并发与并行的区别?
17.  为什么要用线程池？Java的线程池内部机制，参数作用，几种工作阻塞队列，线程池类型以及使用场景
18.  如何保证多线程下 i++ 结果正确？
19.  10 个线程和2个线程的同步代码，哪个更容易写？
20.  什么是多线程环境下的伪共享（false sharing）？
21.  线程池如何调优，最大数目如何确认？
22.  Java 内存模型？
23.  怎么实现所有线程在等待某个事件的发生才会去执行？
24.  说一下 Runnable和 Callable有什么区别？
25.  用Java编程一个会导致死锁的程序，你将怎么解决？
26.  线程的生命周期，线程的几种状态。
27.  ReentrantLock实现原理
28.  java并发包concurrent及常用的类
29.  wait(),notify()和suspend(),resume()之间的区别
30.  FutureTask是什么？
31.  一个线程如果出现了运行时异常会怎么样
32.  生产者消费者模型的作用是什么
33.  ReadWriteLock是什么
34.  Java中用到的线程调度算法是什么？
35.  线程池中的阻塞队列如果满了怎么办？
36.  线程池中 submit()和 execute()方法有什么区别？
37.  介绍一下 AtomicInteger 类的原理？
38.  多线程锁的升级原理是什么？
39.  指令重排序，内存栅栏等？
40.  Java 内存模型 happens-before原则
41.  公平锁/非公平锁
42.  可重入锁
43.  独享锁、共享锁
44.  偏向锁/轻量级锁/重量级锁
45.  如何保证内存可见性
46.  非核心线程延迟死亡，如何实现？
47.  ConcurrentHashMap读操作为什么不需要加锁？
48.  ThreadLocal 如何解决 Hash 冲突？
49.  ThreadLocal 的内存泄露是怎么回事？
50.  为什么ThreadLocalMap 的 key是弱引用，设计理念是？
51.  同步方法和同步代码块的区别是什么？
52.  在Java中Lock接口比synchronized块的优势是什么？如果你需要实现一个高效的缓存，它允许多个用户读，但只允许一个用户写，以此来保持它的完整性，你会怎样去实现它？
53.  用Java实现阻塞队列。
54.  用Java写代码来解决生产者——消费者问题。
55.  什么是竞争条件？你怎样发现和解决竞争？
56.  为什么我们调用start()方法时会执行run()方法，为什么我们不能直接调用run()方法？
57.  Java中你怎样唤醒一个阻塞的线程？
58.  什么是不可变对象，它对写并发应用有什么帮助？
59.  你在多线程环境中遇到的共同的问题是什么？你是怎么解决它的？
60.  Java 中能创建 volatile数组吗
61.  volatile 能使得一个非原子操作变成原子操作吗
62.  你是如何调用 wait（）方法的？使用 if 块还是循环？为什么？
63.  我们能创建一个包含可变对象的不可变对象吗？
64.  在多线程环境下，SimpleDateFormat是线程安全的吗
65.  为什么Java中 wait 方法需要在 synchronized 的方法中调用？
66.  BlockingQueue，CountDownLatch及Semeaphore的使用场景
67.  Java中interrupted 和 isInterruptedd方法的区别？
68.  怎么检测一个线程是否持有对象监视器
69.  什么情况会导致线程阻塞
70.  如何在两个线程间共享数据
71.  Thread.sleep(1000)的作用是什么？
72.  使用多线程可能带来什么问题
73.  说说线程的生命周期和状态?
74.  什么是上下文切换
75.  Java Monitor 的工作机理
76.  按线程池内部机制，当提交新任务时，有哪些异常要考虑。
77.  线程池都有哪几种工作队列？
78.  说说几种常见的线程池及使用场景?
79.  使用无界队列的线程池会导致内存飙升吗？
80.  为什么阿里发布的 Java开发手册中强制线程池不允许使用 Executors 去创建？
81.  Future有缺陷嘛？

### JVM 篇

1.  什么情况下会发生栈内存溢出。什么时候发生堆溢出？你是怎么排错的？
2.  JVM怎么判断对象是可回收对象？有哪些方法。
3.  JVM的内存结构，新生代与老年代的比例，Eden和Survivor比例。
4.  你知道哪几种垃圾收集器，各自的优缺点，重点讲下cms和G1，包括原理，流程，优缺点。
5.  简单说说你了解的类加载器，可以打破双亲委派么，怎么打破。
6.  JVM内存为什么要分成新生代，老年代，持久代。新生代中为什么要分为Eden和Survivor。
7.  JVM 出现 fullGC 很频繁，怎么去线上排查问题？
8.  JVM中一次完整的GC流程是怎样的，对象如何晋升到老年代，说说你知道的几种主要的JVM参数。
9.  垃圾回收算法的实现原理。
10.  JVM内存模型的相关知识了解多少，比如重排序，内存屏障，happen-before，主内存，工作内存等。
11.  说一下Java对象的创建过程
12.  你们线上应用的JVM参数配置了哪些。
13.  G1和cms区别。
14.  怎么打出线程栈信息。
15.  说一下类加载的执行过程
16.  JVM垃圾回收机制，何时触发MinorGC等操作呢？
17.  ZGC 垃圾收集器，了解过吗
18.  对象的访问定位有哪两种方式?
19.  说一下 jvm 调优的工具？
20.  对象什么时候会进入老年代？
21.  内存泄漏和内存溢出区别？
22.  什么是tomcat类加载机制？
23.  了解逃逸分析技术吗
24.  调用System.gc()会发生什么?
25.  谈谈Minor GC条件，full GC条件
26.  Stop The World 了解过吗？
27.  谈谈你认识多少种OOM？如何避免OOM?
28.  了解过JVM调优没，基本思路是什么?如何确定它们的大小呢？
29.  淘宝热门商品信息在JVM哪个内存区域
30.  字节码的编译过程
31.  Java需要开发人员回收内存垃圾吗？
32.  Java中垃圾回收有什么目的？什么时候进行垃圾回收？
33.  System.gc()和Runtime.gc()会做什么事情？
34.  主内存与工作内存
35.  内存间交互操作
36.  volatile 禁止内存重排序
37.  内存模型三大特性
38.  谈谈先行发生原则
39.  JVM 堆内存溢出后，其他线程是否可继续工作？
40.  说一下JVM 常用参数有哪些？
41.  VM 为什么使用元空间替换了永久代？
42.  Java堆的结构是什么样子的？什么是堆中的永久代(Perm Gen space)?
43.  JVM的永久代中会发生垃圾回收么？
44.  什么是字节码？采用字节码的最大好处是什么？什么Java是虚拟机？
45.  MinorGC 的过程
46.  CPU 占用过高如何分析
47.  Serial与Parallel GC之间的不同之处？
48.  WeakHashMap 是怎么工作的？
49.  解释 Java 堆空间及 GC？
50.  你能保证 GC 执行吗？
51.  JVM中哪个参数是用来控制线程的栈堆栈小的?

### 数据库

1.  MySQL 索引使用有哪些事项呢？
2.  说说分库与分表的设计
3.  日常工作中你是怎么优化SQL的？
4.  MySQL 遇到过死锁问题吗，你是如何解决的？
5.  InnoDB与MyISAM的区别
6.  数据库索引的原理，为什么要用 B+树，为什么不用二叉树？
7.  聚集索引与非聚集索引的区别
8.  limit 100000 加载很慢的话，你是怎么解决的呢？
9.  如何选择合适的分布式主键方案呢？
10.  事务的隔离级别有哪些？MySQL的默认隔离级别是什么？
11.  什么是幻读，脏读，不可重复读呢？
12.  在高并发情况下，如何做到安全的修改同一行数据？
13.  数据库的乐观锁和悲观锁。
14.  SQL优化的一般步骤是什么，怎么看执行计划（explain），如何理解其中各个字段的含义。
15.  select for update有什么含义，会锁表还是锁行还是其他。
16.  MySQL事务得四大特性以及实现原理
17.  如果某个表有近千万数据，CRUD比较慢，如何优化。
18.  如何写sql能够有效的使用到复合索引。
19.  mysql中in 和exists的区别。
20.  数据库自增主键可能遇到什么问题。
21.  MVCC熟悉吗，它的底层原理？
22.  数据库中间件了解过吗，sharding jdbc，mycat？
23.  MYSQL的主从延迟，你怎么解决？
24.  说一下大表的优化方案
25.  什么是数据库连接池?为什么需要数据库连接池呢?
26.  一条SQL语句在MySQL中如何执行的？
27.  InnoDB引擎中的索引策略，了解过吗？
28.  数据库存储日期格式时，如何考虑时区转换问题？
29.  一条sql执行过长的时间，你如何优化，从哪些方面入手？
30.  MYSQL数据库服务器性能分析的方法命令有哪些?
31.  Blob和text有什么区别？
32.  mysql里记录货币用什么字段类型比较好？
33.  Mysql中有哪几种锁，列举一下？
34.  Hash索引和B+树区别是什么？你在设计索引是怎么抉择的？
35.  mysql 的内连接、左连接、右连接有什么区别？
36.  MySQL 的基础架构
37.  什么是内连接、外连接、交叉连接、笛卡尔积呢？
38.  说一下数据库的三大范式
39.  mysql有关权限的表有哪几个呢？
40.  Mysql的binlog有几种录入格式？分别有什么区别？
41.  InnoDB引擎的4大特性，了解过吗
42.  索引有哪些优缺点？
43.  索引有哪几种类型？
44.  创建索引优有什么原则呢？
45.  创建索引的三种方式
46.  百万级别或以上的数据，你是如何删除的？
47.  什么是最左前缀原则？什么是最左匹配原则？
48.  B树和B+树的区别，数据库为什么使用B+树而不是B树？
49.  覆盖索引、回表等这些，了解过吗？
50.  B+树在满足聚簇索引和覆盖索引的时候不需要回表查询数据？
51.  什么是聚簇索引？何时使用聚簇索引与非聚簇索引
52.  非聚簇索引一定会回表查询吗？
53.  联合索引是什么？为什么需要注意联合索引中的顺序？
54.  什么是数据库事务？
55.  隔离级别与锁的关系
56.  按照锁的粒度分，数据库锁有哪些呢？锁机制与InnoDB锁算法
57.  从锁的类别角度讲，MySQL都有哪些锁呢？
58.  MySQL中InnoDB引擎的行锁是怎么实现的？
59.  什么是死锁？怎么解决？
60.  为什么要使用视图？什么是视图？
61.  视图有哪些特点？哪些使用场景？
62.  视图的优点，缺点，讲一下？
63.  count(1)、count(\*) 与 count(列名) 的区别？
64.  什么是游标？
65.  什么是存储过程？有哪些优缺点？
66.  什么是触发器？触发器的使用场景有哪些？
67.  MySQL中都有哪些触发器？
68.  超键、候选键、主键、外键分别是什么？
69.  SQL 约束有哪几种呢？
70.  谈谈六种关联查询，使用场景。
71.  varchar(50)中50的涵义
72.  mysql中int(20)和char(20)以及varchar(20)的区别
73.  drop、delete与truncate的区别
74.  UNION与UNION ALL的区别？
75.  SQL的生命周期？
76.  超大分页怎么处理？
77.  慢查询日志
78.  关心过业务系统里面的sql耗时吗？统计过慢查询吗？对慢查询都怎么优化过？
79.  主键使用自增ID还是UUID，为什么？
80.  mysql自增主键用完了怎么办？
81.  字段为什么要求定义为not null？
82.  如果要存储用户的密码散列，应该使用什么字段进行存储？
83.  优化查询过程中的数据访问
84.  如何优化长难的查询语句？有实战过吗？
85.  优化特定类型的查询语句
86.  MySQL数据库cpu飙升的话，要怎么处理呢？
87.  读写分离有哪些解决方案？
88.  MySQL的复制原理以及流程
89.  备份计划，mysqldump以及xtranbackup的实现原理？
90.  Innodb的事务实现原理？
91.  谈谈 MySQL 的Explain
92.  Innodb的事务与日志的实现方式
93.  MySQL binlog的几种日志录入格式以及区别
94.  500台db，在最快时间之内重启。
95.  你是如何监控你们的数据库的？你们的慢日志都是怎么查询的？
96.  你是否做过主从一致性校验，如果有，怎么做的，如果没有，你打算怎么做？
97.  你们数据库是否支持emoji表情存储，如果不支持，如何操作？
98.  MySQL中InnoDB引擎的行锁是通过加在什么上完成(或称实现)的？为什么是这样子的？
99.  一个6亿的表a，一个3亿的表b，通过外间tid关联，你如何最快的查询出满足条件的第50000到第50200中的这200条数据记录。
100.  数据库垂直和水平拆分

### 缓存/Redis

1.  Redis用过哪些数据类型，每种数据类型的使用场景
2.  Redis缓存穿透、缓存雪崩和缓存击穿原因，以及解决方案
3.  如何使用Redis来实现分布式锁，redis分布式锁有什么缺陷？
4.  Redis 持久化机制，有几种方式，优缺点是什么，怎么实现的，RDB和AOF的区别
5.  Redis集群，高可用，原理。
6.  Redis的数据淘汰策略
7.  为什么要用redis？为什么要用缓存，在哪些场景使用缓存
8.  redis事务，了解吗，了解Redis事务的CAS操作吗
9.  如何解决 Redis 的并发竞争Key问题。
10.  Redis为什么是单线程的，为什么单线程还这么快？
11.  如何保证缓存与数据库双写时的数据一致性?
12.  redis和memcached有什么区别
13.  JVM本地缓存，了解过吗
14.  redis的list结构相关的操作。
15.  redis2和redis3的区别，redis3内部通讯机制。
16.  Redis的选举算法和流程是怎样的？
17.  Reids的主从复制机制原理。
18.  Redis的线程模型是什么？
19.  Redis的使用要注意什么，讲讲持久化方式，内存设置，集群的应用和优劣势，淘汰策略等。
20.  Redis缓存分片
21.  redis的集群怎么同步的数据的？
22.  请思考一个方案，设计一个可以控制缓存总体大小的自动适应的本地缓存。
23.  redis的哨兵模式，一个key值如何在redis集群中找到存储在哪里。
24.  Redis，一个字符串类型的值能存储最大容量是多少？
25.  MySQL里有2000w数据，redis中只存20w的数据，如何保证redis中的数据都是热点数据？
26.  Redis和Redisson有什么关系？
27.  Redis中的管道有什么用？
28.  Redis事务相关的命令有哪几个？
29.  Redis key的过期时间和永久有效分别怎么设置？
30.  Redis回收使用的是什么算法？
31.  一个Redis实例最多能存放多少的keys？List、Set、Sorted Set他们最多能存放多少元素？
32.  Redis—跳跃表，复杂度是多少？
33.  Redis有哪些优缺点？为什么要用 Redis ？
34.  为什么要用Redis 而不用 map/guava 做缓存?
35.  如何用 Redis 统计独立用户访问量？
36.  如何选择合适的持久化方式
37.  Redis持久化数据和缓存怎么做扩容？
38.  Redis key的过期时间和永久有效分别怎么设置？
39.  我们知道通过expire来设置key 的过期时间，那么对过期的数据怎么处理呢?
40.  Redis的过期键的删除策略
41.  Redis的内存用完了会发生什么？
42.  Redis如何做内存优化？
43.  Redis事务的三个阶段
44.  Redis事务相关命令
45.  Redis事务保证原子性吗，支持回滚吗？
46.  Redis事务支持隔离性吗？
47.  Redis集群的主从复制模型是怎样的？
48.  生产环境中的 redis 是怎么部署的？
49.  说说Redis哈希槽的概念
50.  Redis集群会有写操作丢失吗？为什么？
51.  Redis集群最大节点个数是多少？
52.  Redis集群如何选择数据库？
53.  Redis是单线程的，如何提高多核CPU的利用率？
54.  为什么要做Redis分区？有什么缺点？
55.  你知道有哪些Redis分区实现方案？
56.  缓存的实现原理，设计缓存要注意什么
57.  如何解决 Redis 的并发竞争 Key 问题
58.  分布式Redis是前期做还是后期规模上来了再做好？为什么？
59.  什么是 RedLock？
60.  Redis支持的Java客户端都有哪些？官方推荐用哪个？
61.  为什么Redis的操作是原子性的，怎么保证原子性
62.  Redis常见性能问题和解决方案？
63.  一个字符串类型的值能存储最大容量是多少？
64.  Redis如何做大量数据插入？
65.  假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？
66.  使用Redis做过异步队列吗，是如何实现的？
67.  Redis如何实现延时队列？
68.  Redis回收进程如何工作的？
69.  热点数据和冷数据是什么
70.  使用过Redis哪些命令？

### 计算机网络

1.  请详细介绍一下TCP 的三次握手机制，为什么要三次握手？
2.  讲一下HTTP与HTTPS 的区别。
3.  Session和cookie的区别。
4.  TCP的四次挥手，为什么要有TIME\_WAIT 状态，为什么需要四次握手
5.  http1.0和http1.1有什么区别。
6.  HTTP的常见状态码有哪些，代表什么含义？比如200, 302, 404？
7.  当你用浏览器打开一个链接到返回结果，发生了什么。
8.  TCP/IP如何保证可靠性，说说TCP头的结构。
9.  GET与POST方式的区别
10.  如何避免浏览器缓存。
11.  TCP/IP模型?
12.  讲一讲 TCP 和 UDP 各有什么特点，两者有什么区别
13.  详细讲一下TCP的滑动窗口
14.  说一下拥塞控制
15.  如何理解HTTP协议的无状态性。
16.  HTTP有哪些 method？
17.  HTTP长连接和短连接
18.  HTTPS原理，加签，验签，什么是数字签名？什么是数字证书？对称加密和非对称加密等。
19.  谈下你对 IP 地址分类的理解？
20.  ARP及RARP协议的工作原理？
21.  怎么解决拆包和粘包？
22.  DNS 的解析过程？
23.  什么是DoS、DDoS、DRDoS攻击？如何防御？
24.  WebSocket与socket的区别
25.  讲一讲SYN超时，洪泛攻击，以及解决策略
26.  ICMP协议的功能
27.  什么是 session，有哪些实现 session 的机制？
28.  Http请求的过程与原理
29.  你知道网络协议有那些？
30.  HTTPS 为什么是安全的？说一下他的底层实现原理？
31.  ping的原理
32.  如果服务器出现了大量 CLOSE\_WAIT 状态如何解决。
33.  TCP 黏包是怎么产生的？
34.  OSI七层体系结构路
35.  由器与交换机的区别
36.  什么是XSS攻击，如何避免
37.  什么是CSRF攻击，如何避免
38.  Https双向和单向验证的区别
39.  如果客户端禁止Cookie能实现Session
40.  HTTP请求中session实现原理

### 消息队列

1.  消息队列有哪些使用场景。
2.  消息中间件如何解决消息丢失问题？
3.  谈谈消息的重发，补充策略。
4.  如何保证消息的顺序性。
5.  怎么利用mq实现最终一致性？
6.  kafka 和其他消息队列的区别，kafka 主从同步怎么实现？
7.  MQ的连接是线程安全的吗，你们公司的MQ服务架构怎样的。
8.  kafka吞吐量高的原因。
9.  rabbitmq如何实现集群高可用？
10.  使用kafka有没有遇到什么问题，怎么解决的？
11.  MQ有可能发生重复消费，如何避免，如何做到幂等？
12.  MQ的消息延迟了怎么处理，消息可以设置过期时间么，过期了你们一般怎么处理？
13.  rabbitmq 有几种广播类型？
14.  使用 kafka 集群需要注意什么？
15.  为什么使用消息队列？有什么用？
16.  消息队列有什么优点和缺点？
17.  Kafka、ActiveMQ、RabbitMQ、RocketMQ 都有什么区别，以及适合哪些场景？
18.  MQ能否保证消息必达，即消息的可靠性
19.  大量消息在MQ里长时间积压，该如何解决？
20.  MQ消息过期失效怎么办？
21.  kafka可以脱离zookeeper单独使用吗？为什么？
22.  kafka 的分区策略有哪些？
23.  kafka 有几种数据保留策略？
24.  RabbitMQ 中的 broker 是指什么？cluster 又是指什么？
25.  Kafka 消息是采用 Pull 模式，还是 Push 模式？
26.  RabbitMQ 有哪些重要组件
27.  如何确保消息接收方消费了消息？
28.  消息基于什么传输？
29.  消息怎么路由？
30.  消息如何分发？

### mybatis

1.  mybatis 中 #{}和 ${}的区别是什么？
2.  什么是SQL注入 ，如何避免。
3.  说一下 mybatis 的一级缓存和二级缓存
4.  mybatis 是否支持延迟加载？延迟加载的原理是什么？
5.  mybatis 动态sql中使用标签与直接写where关键字有什么区别？
6.  mybatis 动态sql标签中循环标签中有哪些属性，各自的作用。
7.  mybatis 和 hibernate 的区别有哪些？
8.  RowBounds是一次性查询全部结果吗？为什么？
9.  MyBatis 定义的接口，怎么找到实现的？
10.  Mybatis的底层实现原理。
11.  Mybatis是如何进行分页的？分页插件的原理是什么？
12.  Mybatis执行批量插入，能返回数据库主键列表吗？
13.  Mybatis都有哪些Executor执行器？它们之间的区别是什么？
14.  Mybatis动态sql有什么用？执行原理？有哪些动态sql？
15.  mybatis有几种分页方式？
16.  MyBatis框架的优点和缺点
17.  使用MyBatis框架，当实体类中的属性名和表中的字段名不一样 ，怎么办 ？
18.  通常一个Xml映射文件，都会写一个Dao接口与之对应，请问，这个Dao接口的工作原理是什么？Dao接口里的方法，参数不同时，方法能重载吗？
19.  Xml映射文件中，除了常见的select|insert|updae|delete标签之外，还有哪些标签？
20.  简述Mybatis的插件运行原理，以及如何编写一个插件。

### 操作系统

1.  Linux系统下你关注过哪些内核参数，说说你知道的。
2.  epoll和poll有什么区别。
3.  线上CPU爆高，请问你如何找到问题所在。
4.  Linux下IO模型有几种，各自的含义是什么。
5.  top 命令之后有哪些内容，有什么作用。
6.  进程通信有几种方式？
7.  说说进程的调度算法
8.  常见的几种内存管理机制
9.  什么是虚拟内存(Virtual Memory)?
10.  内存置换算法
11.  虚拟地址、逻辑地址、线性地址、物理地址的区别。
12.  操作系统的页式存储
13.  进程和线程的区别
14.  socket客户端和服务端通信过程
15.  影响调度程序的指标是什么？
16.  进程间状态有哪些？
17.  一个线程在内存中如何存储？
18.  僵尸进程是什么，如果产生一个僵尸进程，如何查找僵尸进程
19.  一个进程有20个线程，在某个线程中调用fork，新的进程会有20个线程吗？
20.  什么是 RR 调度算法？
21.  什么是 DMA（直接内存访问）？

### Spring 相关

1.  BeanFactory和 ApplicationContext有什么区别？
2.  Spring IOC 的理解，其初始化过程
3.  Spring Bean 的生命周期
4.  Spring MVC 的工作原理？
5.  Spring 循环注入的原理？
6.  Spring 中用到了那些设计模式？
7.  Spring AOP的理解，各个术语，他们是怎么相互工作的？
8.  Spring框架中的单例bean是线程安全的吗?
9.  Spring @ Resource和Autowired有什么区别？
10.  Spring 的不同事务传播行为有哪些，有什么作用？
11.  Spring Bean 的加载过程是怎样的？
12.  请举例说明@Qualifier注解
13.  Spring 是如何管理事务的，事务管理机制？
14.  使用Spring框架的好处是什么？
15.  Spring由哪些模块组成？
16.  ApplicationContext通常的实现是什么？
17.  什么是Spring的依赖注入？
18.  你怎样定义类的作用域？
19.  Spring框架中的单例bean是线程安全的吗？
20.  你可以在Spring中注入一个null 和一个空字符串吗？
21.  你能说下 Spring Boot 与 Spring 的区别吗
22.  SpringBoot 的自动配置是怎么做的？
23.  @RequestMapping 的作用是什么？
24.  spring boot 有哪些方式可以实现热部署？
25.  说说Ioc容器的加载过程
26.  为什么 Spring 中的 bean 默认为单例？
27.  说说Spring中的@Configuration
28.  FileSystemResource 和ClassPathResource 有何区别？
29.  什么是 Swagger？你用 Spring Boot 实现了它吗？
30.  spring的controller是单例还是多例，怎么保证并发的安全。
31.  说一下Spring的核心模块
32.  如何向 Spring Bean 中注入一个 Java.util.Properties
33.  如何给Spring 容器提供配置元数据?
34.  如何在Spring中如何注入一个java集合，实现过吗？
35.  什么是基于Java的Spring注解配置? 举几个例子？
36.  怎样开启注解装配？
37.  Spring支持哪些事务管理类型
38.  在Spring AOP 中，关注点和横切关注的区别是什么？
39.  spring 中有多少种IOC 容器？
40.  描述一下 DispatcherServlet 的工作流程
41.  介绍一下 WebApplicationContext吧
42.  Spring Boot 的配置文件有哪几种格式？它们有什么区别？
43.  Spring Boot 需要独立的容器运行吗？
44.  Spring Boot 自动配置原理是什么？
45.  RequestMapping 和 GetMapping 的不同之处在哪里？
46.  如何使用Spring Boot实现异常处理？
47.  Spring Boot 中如何解决跨域问题 ?
48.  Spring Boot 如何实现热部署 ?
49.  Spring Boot打成的 jar 和普通的jar有什么区别呢?
50.  bootstrap.properties 和 application.properties 有何区别 ?
51.  springboot启动机制

### Netty/tomcat

1.  BIO、NIO和AIO区别
2.  说一下Netty 的各大组件
3.  Netty 线程模型和 Reactor 模式
4.  什么是 Netty 的零拷贝？
5.  NIO 的底层实现。
6.  netty的心跳处理在弱网下怎么办
7.  Netty 高性能表现在哪些方面？
8.  Netty 和 Tomcat 有什么区别？
9.  Netty 发送消息有几种方式？
10.  默认情况 Netty 起多少线程？何时启动？
11.  Netty 支持哪些心跳类型设置？
12.  Java 中怎么创建 ByteBuffer
13.  Java 中的内存映射缓存区是什么？
14.  简单讲讲tomcat结构，以及其类加载器流程，线程模型等
15.  tomcat如何调优，涉及哪些参数
16.  IO多路复用机制
17.  Netty 的应用场景有哪些？
18.  有几种I/O 网络模型？
19.  说说Netty的执行流程？
20.  select、poll、epoll的机制及其区别？

### 常用Linux 命令

1.  修改目录，文件权限的命令
2.  如何获取一个本地服务器上可用的端口。
3.  说说常见的linux命令，linux查看内存的命令是什么？
4.  查看系统磁盘空间剩余情况的命令
5.  如何获取java进程的pid
6.  如何获取某个进程的网络端口号；
7.  如何实时打印日志
8.  如何统计某个字符串行数；
9.  用一行命令查看文件的最后五行。
10.  用一行命令输出正在运行的java进程。
11.  绝对路径，当前目录、上层目录，切换目录分别用什么命令？
12.  怎么清屏？怎么退出当前命令？
13.  目录创建，创建文件，复制文件分别用什么命令？
14.  查看文件内容有哪些命令可以使用？tail？cat？less？more？
15.  怎么使一个命令在后台运行?
16.  终止进程用什么命令? 带什么参数? kill-9 pid有什么风险？
17.  搜索文件用什么命令? 格式是怎么样的?
18.  使用什么命令查看网络是否连通?
19.  使用什么命令查看 ip 地址及接口信息？
20.  awk 详解

### ZooKeeper

1.  Zookeeper的用途，选举的原理是什么。
2.  Zookeeper watch机制原理。
3.  zookeeper 怎么保证主从节点的状态同步？
4.  集群中有3台服务器，其中一个节点宕机，这个时候 zookeeper 还可以使用吗？
5.  zookeeper都有哪些功能？
6.  什么是paxos算法，什么是zab协议。
7.  zookeeper 是如何保证事务的顺序一致性的？
8.  zookeeper 负载均衡和 nginx 负载均衡区别
9.  Zookeeper 的典型应用场景
10.  说说四种类型的数据节点Znode
11.  Zookeeper 的服务器角色（Leader，Follower，Observer）
12.  Zookeeper 有哪几种几种部署模式？

### Elasticsearch

1.  详细描述一下Elasticsearch索引文档的过程。
2.  详细描述一下Elasticsearch搜索的过程。
3.  Elasticsearch 的倒排索引是什么。
4.  Elasticsearch是如何实现master选举的。
5.  lucence内部结构是什么。
6.  Lucene全文搜索的原理
7.  在并发情况下，Elasticsearch 如何保证读写一致呢？
8.  详细阐述一下 Elasticsearch 搜索的过程。
9.  Elasticsearch 索引数据多了怎么办呢，如何调优，部署
10.  Elasticsearch 对于大数据量（上亿量级）的聚合如何实现？

### dubbo框架

1.  Dubbo的服务请求失败怎么处理
2.  dubbo的负载均衡有几种算法?（随机，轮询，最少活跃请求数，一致性hash）
3.  Dubbo 和 Spring Cloud 有什么区别？
4.  dubbo都支持什么协议，推荐用哪种？
5.  画一画服务注册与发现的流程图
6.  Dubbo默认使用什么注册中心，还有别的选择吗？
7.  在 Provider 上可以配置的 Consumer 端的属性有哪些？
8.  Dubbo启动时如果依赖的服务不可用会怎样？
9.  Dubbo推荐使用什么序列化框架，你知道的还有哪些？
10.  Dubbo默认使用的是什么通信框架，还有别的选择吗？
11.  服务上线怎么兼容旧版本？
12.  Dubbo服务之间的调用是阻塞的吗？
13.  Dubbo telnet 命令能做什么？
14.  Dubbo如何一条链接并发多个调用。
15.  Dubbo 的使用场景有哪些？
16.  Dubbo 核心功能有哪些？
17.  Dubbo 核心组件有哪些？
18.  Dubbo 服务器注册于发现的流程？
19.  Dubbo 支持哪些协议，它们的优缺点有哪些？
20.  Dubbo 的注册中心集群挂掉，发布者和订阅者之间还能通信么？
21.  Dubbo源码使用了哪些设计模式
22.  Dubbo集群提供了哪些负载均衡策略？
23.  Dubbo的集群容错方案有哪些？
24.  Dubbo 支持哪些序列化方式？
25.  Dubbo超时重试，Dubbo超时时间设置

### spring cloud

1.  Eureka和Zookeeper区别
2.  什么是服务熔断？什么是服务降级?
3.  什么是Ribbon？
4.  什么是 Netflix Feign？它的优点是什么？
5.  Ribbon和Feign的区别？
6.  什么是Spring Cloud Bus?
7.  Spring Cloud Gateway?
8.  什么是SpringCloudConfig?
9.  什么是 Hystrix？它如何实现容错？
10.  什么是微服务？微服务优缺点
11.  Sentinel，微服务哨兵，了解过吗

### nginx

1.  Nginx的模块与工作原理是什么?
2.  Nginx 是什么？有什么作用？
3.  说说Nginx的一些特性。
4.  请说一下Nginx如何处理HTTP请求。
5.  你知道，Nginx服务器上的Master和Worker进程分别是什么吗?
6.  nginx常用命令，启动，重启，检查配置文件等
7.  Nginx 和 Apache 比较，各有什么优缺点?
8.  Nginx 多进程模型是如何实现高并发的？
9.  说说Nginx的反向代理和负载均衡
10.  请列举Nginx服务器的最佳用途。

### 算法

1.  谈一谈一致性哈希算法。
2.  快排怎么实现
3.  手写二分查找
4.  如何判断一个单链表是否有环
5.  平衡二叉树的时间复杂度；
6.  反转单链表
7.  合并多个单有序链表
8.  LRU 淘汰算法，用java自己实现一个LRU。
9.  跳表和平衡树区别
10.  你了解大O符号(big-O notation)么？你能给出不同数据结构的例子么？
11.  如何手撸一个队列？
12.  10亿个数字里里面找最小的10个。
13.  平衡二叉树的时间复杂度；
14.  有1亿个数字，其中有2个是重复的，快速找到它，时间和空间要最优。
15.  八大基本排序的时间，空间复杂度
16.  堆排序的原理
17.  树的几种遍历方式
18.  递归算法
19.  一个乱序数组，求第K大的数。排序方式使用字典序。
20.  一棵二叉树，求最大通路长度。
21.  万亿级别的两个URL文件A和B，如何求出A和B的差集C,(Bit映射->hash分组->多文件读写效率->磁盘寻址以及应用层面对寻址的优化)
22.  最快的排序算法是哪个？给阿里2万多名员工按年龄排序应该选择哪个算法？堆和树的区别；写出快排代码；链表逆序代码
23.  LeetCode的经典算法题目，都要刷一遍以上哈~

### 分布式

1.  说说分布式事务？分布式事务的解决方案
2.  什么是分布式系统？
3.  讲讲CAP理念。
4.  怎么理解强一致性、单调一致性和最终一致性？
5.  如何实现分布式锁？
6.  如何实现分布式 Session?
7.  负载均衡的理解？
8.  分布式集群下如何做到唯一序列号？
9.  分布式事务
10.  什么是一致性hash。

### 系统设计/方案设计

1.  谈谈如何设计秒杀系统。
2.  一千万的用户实时排名如何实现；
3.  五万人并发抢票怎么实现
4.  手机扫二维码登录是怎么实现的？
5.  Google是如何在一秒内把搜索结果返回给用户的。
6.  12306网站的订票系统如何实现，如何保证不会票不被超卖。
7.  如果有几十亿的白名单，每天白天需要高并发查询，晚上需要更新一次，如何设计这个功能。
8.  接口的幂等性如何设计
9.  如何设计存储海量数据的存储系统
10.  分布式session如何管理，你有哪些方案
11.  讲一下如何给高并发系统做限流？
12.  使用SpringBoot如何开发邮件发送系统？
13.  你如何设计一个能抗住大流量的系统，说说设计方案
14.  如何设计一个高并发的系统？
15.  数据量大的情况下分页查询很慢，有什么优化方案？
16.  设计一个秒杀系统，30分钟没付款就自动关闭交易。
17.  如何使用redis和zookeeper实现分布式锁？有什么区别优缺点，会有什么问题，分别适用什么
18.  如何设计一个安全的API接口。
19.  线上系统突然变得异常缓慢，你如何查找问题。
20.  设计一个社交网站中的“私信”功能，要求高并发、可扩展等等。 画一下架构图。
21.  后台系统怎么防止请求重复提交
22.  讲讲你理解的服务治理。
23.  执行某操作，前50次成功，第51次失败a全部回滚b前50次提交第51次抛异常，ab场景分别如何设置
24.  一个大的含有50M个URL的记录，一个小的含有500个URL的记录，找出两个记录里相同的URL
25.  海量日志数据，提取出某日访问百度次数最多的那个IP
26.  1000个线程同时运行，怎么防止不卡
27.  设计一个分布式自增id生成服务

### 个人公众号

![](/images/jueJin/1721b50d0033139.png)

*   欢迎关注我个人公众号，交个朋友，一起学习哈~