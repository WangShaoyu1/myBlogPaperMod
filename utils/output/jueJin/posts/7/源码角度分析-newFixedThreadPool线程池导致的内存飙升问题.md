---
author: "捡田螺的小男孩"
title: "源码角度分析-newFixedThreadPool线程池导致的内存飙升问题"
date: 2019-09-02
description: "使用无界队列的线程池会导致内存飙升吗？面试官经常会问这个问题，本文将基于源码，去分析newFixedThreadPool线程池导致的内存飙升问题，希望能加深大家的理解。 JVM OOM问题一般是创建太多对象，同时GC 垃圾来不及回收导致的，那么什么原因导致线程池的OOM呢？带着…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:31,comments:4,collects:37,views:5168,"
---
前言
--

使用无界队列的线程池会导致内存飙升吗？面试官经常会问这个问题，本文将基于源码，去分析newFixedThreadPool线程池导致的内存飙升问题，希望能加深大家的理解。

内存飙升问题复现
--------

### 实例代码

```
ExecutorService executor = Executors.newFixedThreadPool(10);
    for (int i = 0; i < Integer.MAX_VALUE; i++) {
        executor.execute(() -> {
            try {
            Thread.sleep(10000);
                } catch (InterruptedException e) {
                //do nothing
            }
            });
        }
```

### 配置Jvm参数

IDE指定JVM参数：-Xmx8m -Xms8m :

![](/images/jueJin/16cefd5b076aba3.png)

### 执行结果

run以上代码，会抛出OOM：

![](/images/jueJin/16cefd66c1153bc.png)

**JVM OOM问题**一般是**创建太多对象**，同时**GC 垃圾**来不及回收导致的，那么什么原因**导致线程池的OOM**呢？带着发现新大陆的心情，我们从源码角度分析这个问题，去找找实例代码中哪里创了太多对象。

线程池源码分析
-------

以上的**实例代码**，就一个**newFixedThreadPool**和一个**execute**方法。首先，我们先来看一下newFixedThreadPool方法的源码

### newFixedThreadPool源码

```
    public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
    0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>());
}
```

该段源码以及结合**线程池特点**，我们可以知道**newFixedThreadPool**：

*   **核心线程数coreSize和最大线程数maximumPoolSize**大小一样，都是nThreads。
*   空闲时间为0，即**keepAliveTime为0**
*   **阻塞队列**为无参构造的**LinkedBlockingQueue**

线程池特点了解不是很清楚的朋友，可以看我这篇文章，[面试必备：Java线程池解析](https://juejin.cn/post/6844903889678893063 "https://juejin.cn/post/6844903889678893063")

接下来，我们再来看看线程池执行方法execute的源码。

### 线程池执行方法execute的源码

execute的源码以及相关**解释**如下：

```
    public void execute(Runnable command) {
    if (command == null)
    throw new NullPointerException();
    int c = ctl.get();
    if (workerCountOf(c) < corePoolSize) {   //步骤一：判断当前正在工作的线程是否比核心线程数量小
    if (addWorker(command, true))    // 以核心线程的身份，添加到工作集合
    return;
    c = ctl.get();
}
//步骤二：不满足步骤一，线程池还在RUNNING状态，阻塞队列也没满的情况下，把执行任务添加到阻塞队列workQueue。
    if (isRunning(c) && workQueue.offer(command)) {
    int recheck = ctl.get();
    //来个double check ，检查线程池是否突然被关闭
    if (! isRunning(recheck) && remove(command))
    reject(command);
    else if (workerCountOf(recheck) == 0)
    addWorker(null, false);
}
//步骤三：如果阻塞队列也满了，执行任务以非核心线程的身份，添加到工作集合
else if (!addWorker(command, false))
reject(command);
}
```

纵观以上代码，我们可以发现就**addWorker 以及workQueue.offer(command)** 可能在创建对象。那我们先分析addWorker方法。

### addWorker源码分析

addWorker源码以及相关解释如下

```
    private boolean addWorker(Runnable firstTask, boolean core) {
    retry:
        for (;;) {
        int c = ctl.get();
        //获取当前线程池的状态
        int rs = runStateOf(c);
        
        //如果线程池状态是STOP,TIDYING,TERMINATED状态的话，则会返回false。
        // 如果现在状态是SHUTDOWN，但是firstTask不为空或者workQueue为空的话，那么直接返回false
        if (rs >= SHUTDOWN &&
        ! (rs == SHUTDOWN &&
        firstTask == null &&
        ! workQueue.isEmpty()))
        return false;
        //自旋
            for (;;) {
            //获取当前工作线程的数量
            int wc = workerCountOf(c);
            //判断线程数量是否符合要求，如果要创建的是核心工作线程，判断当前工作线程数量是否已经超过coreSize，
            // 如果要创建的是非核心线程，判断当前工作线程数量是否超过maximumPoolSize，是的话就返回false
            if (wc >= CAPACITY ||
            wc >= (core ? corePoolSize : maximumPoolSize))
            return false;
            //如果线程数量符合要求，就通过CAS算法，将WorkerCount加1，成功就跳出retry自旋
            if (compareAndIncrementWorkerCount(c))
            break retry;
            c = ctl.get();  // Re-read ctl
            if (runStateOf(c) != rs)
            continue retry;
            retry inner loop
        }
    }
    //线程启动标志
    boolean workerStarted = false;
    //线程添加进集合workers标志
    boolean workerAdded = false;
    Worker w = null;
        try {
        //由(Runnable 构造Worker对象
        w = new Worker(firstTask);
        final Thread t = w.thread;
            if (t != null) {
            //获取线程池的重入锁
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
                try {
                //获取线程池状态
                int rs = runStateOf(ctl.get());
                //如果状态满足，将Worker对象添加到workers集合
                if (rs < SHUTDOWN ||
                    (rs == SHUTDOWN && firstTask == null)) {
                    if (t.isAlive())
                    throw new IllegalThreadStateException();
                    workers.add(w);
                    int s = workers.size();
                    if (s > largestPoolSize)
                    largestPoolSize = s;
                    workerAdded = true;
                }
                    } finally {
                    mainLock.unlock();
                }
                //启动Worker中的线程开始执行任务
                    if (workerAdded) {
                    t.start();
                    workerStarted = true;
                }
            }
                } finally {
                //线程启动失败，执行addWorkerFailed方法
                if (! workerStarted)
                addWorkerFailed(w);
            }
            return workerStarted;
        }
```

**addWorker执行流程**

大概就是判断**线程池状态是否OK**，如果OK，在判断当前工作中的线程数量**是否满足（小于coreSize/maximumPoolSize）,如果不满足，不添加**，如果满足，就将执行任务添加到工作集合workers，，并启动执行该线程。

再看一下workers的类型：

```
/**
* Set containing all worker threads in pool. Accessed only when
* holding mainLock.
*/
private final HashSet<Worker> workers = new HashSet<Worker>();
```

workers是一个HashSet集合，它由coreSize/maximumPoolSize控制着，那么addWorker方法会导致OOM？结合**实例代码demo，coreSize=maximumPoolSize=10，如果超过10，不会再添加到workers了，所以它不是导致newFixedThreadPool内存飙升的原因**。那么，问题应该就在于workQueue.offer(command) 方法了。为了让整个流程清晰，我们画一下execute执行的流程图。

### 线程池执行方法execute的流程

根据以上execute以及addWork源码分析，我们把流程图画出来：

![](/images/jueJin/16cf07544c85651.png)

*   提交一个任务command，线程池里存活的核心线程数小于线程数corePoolSize时，调用addWorker方法，线程池会创建一个核心线程去处理提交的任务。
*   如果线程池核心线程数已满，即线程数已经等于corePoolSize，一个新提交的任务，会被放进任务队列workQueue排队等待执行。
*   当线程池里面存活的线程数已经等于corePoolSize了,并且任务队列workQueue也满，判断线程数是否达到maximumPoolSize，即最大线程数是否已满，如果没到达，创建一个非核心线程执行提交的任务。
*   如果当前的线程数达到了maximumPoolSize，还有新的任务过来的话，直接采用拒绝策略处理 。

看完execute的执行流程，我猜测，内存飙升问题就是**workQueue塞满**了。接下来，进行阻塞队列源码分析，揭开内存飙升问题的神秘面纱。

阻塞队列源码分析
--------

![](/images/jueJin/16cf15040f05b11.png)

回到newFixedThreadPool构造函数，发现阻塞队列就是LinkedBlockingQueue，而且是个**无参的LinkedBlockingQueue队列**。OK，那我们直接分析LinkedBlockingQueue源码。

### LinkedBlockingQueue类图

![](/images/jueJin/16ceaacce7207c4.png)

由类图可以看到：

*   LinkedBlockingQueue 是使用单向链表实现的，其有两个 Node，分别用来存放首、尾节点， 并且还有一个初始值为 0 的原子变量 count，用来记录 队列元素个数。
*   另外还有两个 ReentrantLock 的实例，分别用来控制元素入队和出队的原 子性，其中 takeLock 用来控制同时只有一个线程可以从队列头获取元素，其他线程必须 等待， putLock 控制同时只能有一个线程可以获取锁，在队列尾部添加元素，其他线程必 须等待。
*   另外， notEmpty 和 notFull 是条件变量，它们内部都有一个条件队列用来存放进 队和出队时被阻塞的线程，其实这是生产者一消费者模型。

### LinkedBlockingQueue无参构造函数

```
    public LinkedBlockingQueue() {
    this(Integer.MAX_VALUE);
}
    public LinkedBlockingQueue(int capacity) {
    if (capacity <= 0) throw new IllegalArgumentException();
    this.capacity = capacity;
    last = head = new Node<E>(null);
}
```

LinkedBlockingQueue无参构造函数，默认构造**Integer.MAX\_VALUE（那么大）** 的链表，看到这里，你回想一下execute流程，是不是阻塞队列一直不会满了，这队列来者不拒，把所有阻塞任务收于麾下。。。是不是内存飙升问题水落石出啦。

### LinkedBlockingQueue的offer函数

![](/images/jueJin/16cf171a4da5f19.png)

线程池中，插入队列用了offer方法，我们来看一下阻塞队列LinkedBlockingQueue的offer骚操作吧

```
    public boolean offer(E e) {
    //为空元素则抛出空指针异常
    if (e == null) throw new NullPointerException();
    final AtomicInteger count = this.count;
    //如采当前队列满则丢弃将要放入的元素， 然后返回false
    if (count.get() == capacity)
    return false;
    int c = -1;
    //构造新节点，获取putLock独占锁
    Node<E> node = new Node<E>(e);
    final ReentrantLock putLock = this.putLock;
    putLock.lock();
        try {
        //如采队列不满则进队列，并递增元素计数
            if (count.get() < capacity) {
            enqueue(node);
            c = count.getAndIncrement();
            //新元素入队后队列还有空闲空间，则
            唤醒 notFull 的条件队列中一条阻塞线程
            if (c + 1 < capacity)
            notFull.signal();
        }
            } finally {
            //释放锁
            putLock.unlock();
        }
        if (c == 0)
        signalNotEmpty();
        return c >= 0;
    }
```

**offer操作**向队列尾部插入一个元素，如果队列中有空闲则插入成功后返回 true，如果队列己满 则丢弃当前元素然后返回 false。 如果 e 元素为 null 则抛出 Nul!PointerException 异常。另外， 该方法是非阻塞的。

内存飙升问题结果揭晓
----------

newFixedThreadPool线程池的**核心线程数是固定**的，它使用了近乎于**无界的LinkedBlockingQueue阻塞队列**。当核心线程用完后，任务会入队到阻塞队列，如果任务执行的时间比较长，没有释放，会导致**越来越多的任务堆积到阻塞队列**，最后导致机器的内存使用不停的飙升，造成JVM OOM。

参考与感谢
-----

*   《Java并发编程之美》
*   [面试必备：Java线程池解析](https://juejin.cn/post/6844903889678893063 "https://juejin.cn/post/6844903889678893063")

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。