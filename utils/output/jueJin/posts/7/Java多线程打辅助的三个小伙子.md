---
author: "Java3y"
title: "Java多线程打辅助的三个小伙子"
date: 2018-07-27
description: "之前学多线程的时候没有学习线程的同步工具类(辅助类)。ps当时觉得暂时用不上，认为是挺高深的知识点就没去管了 在前几天，朋友发了一篇比较好的Semaphore文章过来，然后在浏览博客的时候又发现面试还会考，那还是挺重要的知识点。于是花了点时间去了解一下。 简单来说：Cou…"
tags: ["Java","后端",".NET","微信中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:71,comments:0,collects:43,views:2167,"
---
前言
==

之前学多线程的时候没有学习线程的同步工具类(辅助类)。ps:当时觉得暂时用不上，认为是挺高深的知识点就没去管了..

在前几天，朋友发了一篇比较好的Semaphore文章过来，然后在浏览博客的时候又发现面试还会考，那还是挺重要的知识点。于是花了点时间去了解一下。

Java为我们提供了**三个同步工具类**：

*   CountDownLatch(闭锁)
*   CyclicBarrier(栅栏)
*   Semaphore(信号量)

这几个工具类其实说白了就是为了能够**更好控制线程之间的通讯问题**~

一、CountDownLatch
================

1.1CountDownLatch简介
-------------------

> *   A synchronization aid that allows one or more threads to wait until a set of operations being performed in other threads completes.

简单来说：CountDownLatch是一个同步的辅助类，**允许一个或多个线程一直等待**，**直到**其它线程**完成**它们的操作。

它常用的API其实就两个:`await()`和`countDown()`

![](/images/jueJin/164d942fd946ec7.png)

使用说明：

*   count初始化CountDownLatch，然后需要等待的线程调用await方法。await方法会一直受阻塞直到count=0。而其它线程完成自己的操作后，调用`countDown()`使计数器count减1。**当count减到0时，所有在等待的线程均会被释放**
*   说白了就是通过**count变量来控制等待**，如果**count值为0了**(其他线程的任务都完成了)，那就可以继续执行。

1.2CountDownLatch例子
-------------------

例子：3y现在去做实习生了，其他的员工还没下班，3y不好意思先走，等其他的员工都走光了，3y再走。

```

import java.util.concurrent.CountDownLatch;

    public class Test {
    
        public static void main(String[] args) {
        
        final CountDownLatch countDownLatch = new CountDownLatch(5);
        
        System.out.println("现在6点下班了.....");
        
        // 3y线程启动
            new Thread(new Runnable() {
            @Override
                public void run() {
                
                    try {
                    // 这里调用的是await()不是wait()
                    countDownLatch.await();
                        } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("...其他的5个员工走光了，3y终于可以走了");
                }
                }).start();
                
                // 其他员工线程启动
                    for (int i = 0; i < 5; i++) {
                        new Thread(new Runnable() {
                        @Override
                            public void run() {
                            System.out.println("员工xxxx下班了");
                            countDownLatch.countDown();
                        }
                        }).start();
                    }
                }
            }
            
```

输出结果：

![](/images/jueJin/164d942f79acba9.png)

再写个例子：3y现在负责仓库模块功能，但是能力太差了，写得很慢，**别的员工都需要等3y写好了才能继续往下写。**

```

import java.util.concurrent.CountDownLatch;

    public class Test {
    
        public static void main(String[] args) {
        
        final CountDownLatch countDownLatch = new CountDownLatch(1);
        
        // 3y线程启动
            new Thread(new Runnable() {
            @Override
                public void run() {
                
                    try {
                    Thread.sleep(5);
                        } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("3y终于写完了");
                    countDownLatch.countDown();
                    
                }
                }).start();
                
                // 其他员工线程启动
                    for (int i = 0; i < 5; i++) {
                        new Thread(new Runnable() {
                        @Override
                            public void run() {
                            System.out.println("其他员工需要等待3y");
                                try {
                                countDownLatch.await();
                                    } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                                System.out.println("3y终于写完了，其他员工可以开始了！");
                            }
                            }).start();
                        }
                    }
                }
```

输出结果：

![](/images/jueJin/164d942fde3ef94.png)

参考资料：

*   [blog.csdn.net/qq\_19431333…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_19431333%2Farticle%2Fdetails%2F68940987 "https://blog.csdn.net/qq_19431333/article/details/68940987")
*   [blog.csdn.net/panweiwei19…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fpanweiwei1994%2Farticle%2Fdetails%2F78826072 "https://blog.csdn.net/panweiwei1994/article/details/78826072")
*   [www.importnew.com/15731.html](https://link.juejin.cn?target=http%3A%2F%2Fwww.importnew.com%2F15731.html "http://www.importnew.com/15731.html")

二、CyclicBarrier
===============

2.1CyclicBarrier简介
------------------

> *   A synchronization aid that allows a set of threads to all wait for each other to reach a common barrier point. CyclicBarriers are useful in programs involving a fixed sized party of threads that must occasionally wait for each other. The barrier is called _cyclic_ because it can be re-used after the waiting threads are released.

简单来说：CyclicBarrier允许一组线程互相等待，直到**到达某个公共屏障点**。叫做cyclic是因为当所有等待线程都被释放以后，CyclicBarrier可以**被重用**(对比于CountDownLatch是不能重用的)

使用说明：

*   CountDownLatch注重的是**等待其他线程完成**，CyclicBarrier注重的是：当线程**到达某个状态**后，暂停下来等待其他线程，**所有线程均到达以后**，继续执行。

2.2CyclicBarrier例子
------------------

例子：3y和女朋友约了去广州夜上海吃东西，由于3y和3y女朋友住的地方不同，自然去的路径也就不一样了。于是他俩约定在体育西路地铁站**集合**，约定等到**相互见面的时候**就发一条朋友圈。

```

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

    public class Test {
    
        public static void main(String[] args) {
        
        final CyclicBarrier CyclicBarrier = new CyclicBarrier(2);
            for (int i = 0; i < 2; i++) {
            
                new Thread(() -> {
                
                String name = Thread.currentThread().getName();
                    if (name.equals("Thread-0")) {
                    name = "3y";
                        } else {
                        name = "女朋友";
                    }
                    System.out.println(name + "到了体育西");
                        try {
                        
                        // 两个人都要到体育西才能发朋友圈
                        CyclicBarrier.await();
                        // 他俩到达了体育西，看见了对方发了一条朋友圈：
                        System.out.println("跟" + name + "去夜上海吃东西~");
                            } catch (InterruptedException e) {
                            e.printStackTrace();
                                } catch (BrokenBarrierException e) {
                                e.printStackTrace();
                            }
                            }).start();
                        }
                    }
                }
```

测试结果：

![](/images/jueJin/164d942fdd7161d.png)

玩了一天以后，**各自回到家里**，3y和女朋友约定**各自洗澡完之后再聊天**

```

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

    public class Test {
    
        public static void main(String[] args) {
        
        final CyclicBarrier CyclicBarrier = new CyclicBarrier(2);
            for (int i = 0; i < 2; i++) {
            
                new Thread(() -> {
                
                String name = Thread.currentThread().getName();
                    if (name.equals("Thread-0")) {
                    name = "3y";
                        } else {
                        name = "女朋友";
                    }
                    System.out.println(name + "到了体育西");
                        try {
                        
                        // 两个人都要到体育西才能发朋友圈
                        CyclicBarrier.await();
                        // 他俩到达了体育西，看见了对方发了一条朋友圈：
                        System.out.println("跟" + name + "去夜上海吃东西~");
                        
                        // 回家
                        CyclicBarrier.await();
                        System.out.println(name + "洗澡");
                        
                        // 洗澡完之后一起聊天
                        CyclicBarrier.await();
                        
                        System.out.println("一起聊天");
                        
                            } catch (InterruptedException e) {
                            e.printStackTrace();
                                } catch (BrokenBarrierException e) {
                                e.printStackTrace();
                            }
                            }).start();
                        }
                    }
                }
```

测试结果：

![](/images/jueJin/164d942fd928d45.png)

参考资料：

*   [blog.csdn.net/panweiwei19…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fpanweiwei1994%2Farticle%2Fdetails%2F78827000 "https://blog.csdn.net/panweiwei1994/article/details/78827000")

三、Semaphore
===========

3.1Semaphore简介
--------------

> Semaphores are often used to **restrict the number of threads than can access some (physical or logical) resource**.

* * *

> *   A counting semaphore. Conceptually, a semaphore maintains a set of permits. Each {@link #acquire} blocks if necessary until a permit is available, and then takes it. Each {@link #release} adds a permit,potentially releasing a blocking acquirer.However, no actual permit objects are used; the {@code Semaphore} just keeps a count of the number available and acts accordingly.

Semaphore(信号量)实际上就是可以控制**同时访问的线程个数**，它维护了一组\*\*"许可证"\*\*。

*   当调用`acquire()`方法时，会消费一个许可证。如果没有许可证了，会阻塞起来
*   当调用`release()`方法时，会添加一个许可证。
*   这些"许可证"的个数其实就是一个count变量罢了~

3.2Semaphore例子
--------------

3y女朋友开了一间卖酸奶的小店，小店一次只能容纳5个顾客挑选购买，超过5个就需要排队啦~~~

```


import java.util.concurrent.Semaphore;

    public class Test {
    
        public static void main(String[] args) {
        
        // 假设有50个同时来到酸奶店门口
        int nums = 50;
        
        // 酸奶店只能容纳10个人同时挑选酸奶
        Semaphore semaphore = new Semaphore(10);
        
            for (int i = 0; i < nums; i++) {
            int finalI = i;
                new Thread(() -> {
                    try {
                    // 有"号"的才能进酸奶店挑选购买
                    semaphore.acquire();
                    
                    System.out.println("顾客" + finalI + "在挑选商品，购买...");
                    
                    // 假设挑选了xx长时间，购买了
                    Thread.sleep(1000);
                    
                    // 归还一个许可，后边的就可以进来购买了
                    System.out.println("顾客" + finalI + "购买完毕了...");
                    semaphore.release();
                    
                    
                    
                        } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    }).start();
                    
                }
                
            }
        }
```

输出结果：

![](/images/jueJin/164d942fdb70a17.png)

反正每次只能**5个客户同时**进酸奶小店购买挑选。

参考资料：

*   [blog.csdn.net/qq\_19431333…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_19431333%2Farticle%2Fdetails%2F70212663 "https://blog.csdn.net/qq_19431333/article/details/70212663")
*   [blog.csdn.net/panweiwei19…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fpanweiwei1994%2Farticle%2Fdetails%2F78827248 "https://blog.csdn.net/panweiwei1994/article/details/78827248")

四、总结
====

Java为我们提供了**三个同步工具类**：

*   CountDownLatch(闭锁)
    *   某个线程等待其他线程**执行完毕后**，它才执行(其他线程等待某个线程**执行完毕后**，它才执行)
*   CyclicBarrier(栅栏)
    *   一组线程**互相等待至某个状态**，这组线程再同时执行。
*   Semaphore(信号量)
    *   **控制一组线程同时执行**。

本文简单的介绍了一下这三个同步工具类是干嘛用的，要**深入还得看源码**或者借鉴其他的资料。

最后补充一下之前的思维导图知识点：

![](/images/jueJin/164d94300b13d90.png)

参考资料：

*   《Java并发编程实战》
*   [www.cnblogs.com/dolphin0520…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2Fdolphin0520%2Fp%2F3920397.html "http://www.cnblogs.com/dolphin0520/p/3920397.html")
*   [zhuanlan.zhihu.com/p/27829595](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F27829595 "https://zhuanlan.zhihu.com/p/27829595")

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**。

**文章的目录导航**：

*   [zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")