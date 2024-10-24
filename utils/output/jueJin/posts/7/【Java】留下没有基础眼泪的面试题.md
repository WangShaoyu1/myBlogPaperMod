---
author: "Java3y"
title: "【Java】留下没有基础眼泪的面试题"
date: 2018-08-15
description: "程序在执行时，多线程是CPU通过给每个线程分配CPU时间片来实现的，时间片是CPU分配给每个线程执行的时间，因时间片非常短，所以CPU通过不停地切换线程执行。 无锁并发编程。多线程竞争时，会引起上下文切换，所以多线程处理数据时，可以用一些办法来避免使用锁，如将数据的ID按照Ha…"
tags: ["操作系统","Java EE","Java","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:412,comments:5,collects:204,views:7493,"
---
前言
==

> 只有光头才能变强

本文**力求简单讲清每个知识点**，希望大家看完能有所收获

一、如何减少线程上下文切换
=============

使用多线程时，**不是多线程能提升程序的执行速度**，使用多线程是为了**更好地利用CPU资源**！

程序在执行时，多线程是CPU通过给每个线程**分配CPU时间片来实现**的，时间片是CPU分配给每个线程执行的时间，因时间片非常短，所以**CPU通过不停地切换线程执行**。

线程**不是越多就越好**的，因为线程上下文切换是有**性能损耗**的，在使用多线程的同时需要考虑如何减少上下文切换

一般来说有以下几条经验

*   **无锁并发编程**。多线程竞争时，会引起上下文切换，所以多线程处理数据时，可以用一些办法来避免使用锁，如将数据的ID按照Hash取模分段，不同的线程处理不同段的数据
*   **CAS算法**。Java的Atomic包使用CAS算法来更新数据，**而不需要加锁**。
*   **控制线程数量**。避免创建不需要的线程，比如任务很少，但是创建了很多线程来处理，这样会造成大量线程都处于等待状态
*   **协程**。在单线程里实现多任务的调度，并在单线程里维持多个任务间的切换
    *   协程可以看成是用户态**自管理的“线程”**。**不会参与**CPU时间调度，没有均衡分配到时间。**非抢占式**的

还可以考虑我们的应用是**IO密集型的还是CPU密集型**的。

*   如果是IO密集型的话，线程可以多一些。
*   如果是CPU密集型的话，线程不宜太多。

参考资料：

*   多线程编程-减少上下文切换（1）：[blog.csdn.net/yxpjx/artic…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fyxpjx%2Farticle%2Fdetails%2F52081034 "https://blog.csdn.net/yxpjx/article/details/52081034")
*   多线程上下文切换优化与注意：[www.cnblogs.com/signheart/p…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fsignheart%2Fp%2F3e3379943de1c36d5bcc7d8cee4b9825.html "https://www.cnblogs.com/signheart/p/3e3379943de1c36d5bcc7d8cee4b9825.html")

二、计算机网络
=======

2.1MAC地址已经是唯一了，为什么需要IP地址？
-------------------------

或者可以反过来问：已经有IP地址了，为什么需要MAC地址？？在zhihu上还蛮多类似的问题的：

![](/images/jueJin/1653b06be1557ba.png)

我来简单总结一下为什么有了MAC(IP)还需要IP(MAC)：

*   MAC是链路层，IP是网络层，**每一层干每一层的事儿**，之所以在网络上分链路层、网络层(...，就是将问题简单化。
*   历史的兼容问题。

已经有IP地址了，为什么需要MAC地址？？

*   现阶段理由：**DHCP基于MAC地址分配IP**。

MAC地址已经是唯一了，为什么需要IP地址？

*   **MAC无网段概念，非类聚，不好管理**。

> 如果有更好的看法，不妨在评论区下留言哦~

参考资料：

*   MAC地址唯一，不能满足通信需求吗？为什么需要IP？[www.wukong.com/answer/6549…](https://link.juejin.cn?target=https%3A%2F%2Fwww.wukong.com%2Fanswer%2F6549169419812077827%2F "https://www.wukong.com/answer/6549169419812077827/")
*   有了 IP 地址，为什么还要用 MAC 地址？[www.zhihu.com/question/21…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F21546408 "https://www.zhihu.com/question/21546408")

2.2TCP状态
--------

> TCP 每个状态说一下，TIME-WAIT状态说一下

TCP总共有11个状态，状态之间的转换是这样的：

![](/images/jueJin/1653b06bd1a9083.png)

流程图：

![](/images/jueJin/1653b06bd48bc9e.png)

下面我简单总结一下每个状态：

*   **CLOSED**：初始状态，表示TCP连接是“关闭着的”或“未打开的”。
*   **LISTEN**：表示服务器端的某个SOCKET处于监听状态，可以接受客户端的连接。
*   **SYN-SENT**：表示客户端**已发送SYN报文**。当客户端SOCKET执行connect()进行连接时，它首先发送SYN报文，然后随即进入到SYN\_SENT状态。
*   **SYN\_RCVD**：表示服务器接**收到了来自客户端请求连接的SYN报文**。当TCP连接处于此状态时，**再收到客户端的ACK报文**，它就会进入到**ESTABLISHED状态**。
*   **ESTABLISHED**：表示TCP**连接已经成功建立**。
*   **FIN-WAIT-1**：**第一次主动请求关闭连接**,等待对方的ACK响应。
*   **CLOSE\_WAIT**：对方发了一个FIN报文给自己，回应一个ACK报文给对方。此时进入CLOSE\_WAIT状态。
    *   接下来呢，你需要检查**自己是否还有数据要发送给对方**，如果没有的话，那你也就可以`close()`这个SOCKET并发送FIN报文给对方，即关闭自己到对方这个方向的连接
*   **FIN-WAIT-2**：主动关闭端**接到ACK后**，就进入了FIN-WAIT-2。在这个状态下，应用程序还有接受数据的能力，但是已经无法发送数据。
*   **LAST\_ACK**：当被动关闭的一方在**发送FIN报文后，等待对方的ACK报文**的时候，就处于LAST\_ACK 状态
*   **CLOSED**：当收到对方的ACK报文后，也就可以进入到CLOSED状态了。
*   **TIME\_WAIT**：表示收到了对方的FIN报文，并发送出了ACK报文。TIME\_WAIT状态下的TCP连接会等待`2*MSL`
*   **CLOSING**：罕见的状态。表示双方都**正在关闭SOCKET连接**

TIME\_WAIT状态一般用来处理以下两个问题：

![](/images/jueJin/1653b06b9e89bbc.png)

*   关闭TCP连接时，确保最后一个ACK正常运输(或者可以认为是：**等待以便重传ACK**)
*   网络上可能会有残余的数据包，为了能够正常处理这些残余的数据包。使用TIME-WAIT状态可以**确保**在**创建新连接时**，先前网络中**残余的数据都丢失了**。

* * *

> TIME\_WAIT过多怎么解决？

如果在**高并发，多短链接情景下**，TIME\_WAIT就会过多。

可以通过调整内核参数解决：`vi /etc/sysctl.conf` 加入以下内容设置：

*   reuse是表示是否允许重新应用处于TIME-WAIT状态的socket用于新的TCP连接；
*   recyse是加速TIME-WAIT sockets回收

我们可以知道TIME\_WAIT状态是**主动关闭连接的一方出现**的，我们不要轻易去使用上边两个参数。先看看是不是可以**重用TCP连接**来尽量避免这个问题(比如我们HTTP的KeepAlive)~

参考资料：

*   TCP/IP详解--TCP连接中TIME\_WAIT状态过多：[blog.csdn.net/yusiguyuan/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fyusiguyuan%2Farticle%2Fdetails%2F21445883 "https://blog.csdn.net/yusiguyuan/article/details/21445883")
*   TCP连接的状态详解以及故障排查：[blog.csdn.net/hguisu/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fhguisu%2Farticle%2Fdetails%2F38700899 "https://blog.csdn.net/hguisu/article/details/38700899")
*   TCP的11种状态：[www.cnblogs.com/qingergege/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fqingergege%2Fp%2F6603488.html "https://www.cnblogs.com/qingergege/p/6603488.html")

2.3TCP滑动窗口
----------

TCP是一个可靠的传输协议，它要**保证所有的数据包都可以到达**，这需要重传机制来支撑。

重传机制有以下几种：

*   超时重传
*   快速重传
*   SACK 方法

滑动窗口可以说是TCP非常重要的一个知识点。TCP的滑动窗口主要有两个作用：

*   提供TCP的**可靠性**
*   提供TCP的**流控特性**

简略滑动窗口示意图：

![](/images/jueJin/1653b06bd107bf0.png)

详细滑动窗口示意图：

![](/images/jueJin/1653b06bce69949.png)

*   #1已收到ack确认的数据。
*   #2发还没收到ack的。
*   #3在窗口中还没有发出的（接收方还有空间）。
*   #4窗口以外的数据（接收方没空间）

接受端控制发送端的图示：

![](/images/jueJin/1653b06a08f9307.png)

2.4拥塞控制
-------

> TCP不是一个自私的协议，当拥塞发生的时候，要做自我牺牲。就像交通阻塞一样，每个车都应该把路让出来，而不要再去抢路了

拥塞控制主要是四个算法：

*   1）慢启动，
*   2）拥塞避免，
*   3）拥塞发生，
*   4）快速恢复

拥塞控制的作用：

![](/images/jueJin/1653b06a091cc1c.png)

拥塞的判断：

*   重传定时器超时
*   收到三个相同（重复）的 ACK

![](/images/jueJin/1653b06a08db0e8.png)

强烈建议阅读：

*   TCP 的那些事儿（上）：[coolshell.cn/articles/11…](https://link.juejin.cn?target=https%3A%2F%2Fcoolshell.cn%2Farticles%2F11564.html "https://coolshell.cn/articles/11564.html")
*   TCP 的那些事儿（下）：[coolshell.cn/articles/11…](https://link.juejin.cn?target=https%3A%2F%2Fcoolshell.cn%2Farticles%2F11609.html "https://coolshell.cn/articles/11609.html")

参考资料：

*   TCP连续ARQ协议和滑动窗口协议：[www.cnblogs.com/blythe/arti…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fblythe%2Farticles%2F7348812.html "https://www.cnblogs.com/blythe/articles/7348812.html")
*   [运输层](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484322%26idx%3D7%26sn%3Dcde9aa52b0c62efc642401c87e9a8c01%26chksm%3Debd742a3dca0cbb53a459c500e310dc49fccf8df577b95806aaf34d3220c288337cc6d4132fe%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484322&idx=7&sn=cde9aa52b0c62efc642401c87e9a8c01&chksm=ebd742a3dca0cbb53a459c500e310dc49fccf8df577b95806aaf34d3220c288337cc6d4132fe#rd")
*   TCP/IP(十一)TCP滑动窗口和拥塞控制：[blog.csdn.net/endlu/artic…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fendlu%2Farticle%2Fdetails%2F51140213 "https://blog.csdn.net/endlu/article/details/51140213")
*   TCP-IP详解：滑动窗口（Sliding Window）：[blog.csdn.net/wdscq1234/a…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwdscq1234%2Farticle%2Fdetails%2F52444277 "https://blog.csdn.net/wdscq1234/article/details/52444277")
*   TCP拥塞控制-慢启动、拥塞避免、快重传、快启动：[blog.csdn.net/jtracydy/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjtracydy%2Farticle%2Fdetails%2F52366461 "https://blog.csdn.net/jtracydy/article/details/52366461")
*   TCP协议的滑动窗口具体是怎样控制流量的？[www.zhihu.com/question/32…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F32255109 "https://www.zhihu.com/question/32255109")

三、操作系统
======

3.1僵尸进程和孤儿进程是什么(区别)
===================

> unix/linux环境下

![](/images/jueJin/1653b06a0d206e5.png)

僵尸进程：

*   父进程创建出子进程，子进程退出了，父进程没有调用`wait`或`waitId`获取子进程的信息(状态)，**子进程的描述符仍在系统中**。

孤儿进程：

*   父进程退出，子进程仍在运行中。这些子进程就叫做孤儿进程，孤儿进程将被**init进程**(进程号为1)所**收养**，并由init进程对它们完成状态收集工作

**僵尸进程危害**：

*   系统进程表是一项有限资源，如果系统进程表被僵尸进程耗尽的话，系统就可能**无法创建新的进程**。
*   一个父进程创建了很多子进程，就是不回收，会造成**内存资源的浪费**。

解决僵尸进程的手段：

*   杀掉父进程，余下的僵尸进程会成为孤儿进程，最后被init进程管理
*   子进程退出时向父进程发送SIGCHILD信号，父进程处理SIGCHILD信号。在**信号处理函数中调用wait进行处理僵尸进程**
*   fork两次：原理是将子进程成为孤儿进程，从而其的父进程变为init进程，通过init进程可以处理僵尸进程

参考资料：

*   僵尸进程和僵死进程有什么区别?[www.zhihu.com/question/26…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F26432067%2Fanswer%2F70643183 "https://www.zhihu.com/question/26432067/answer/70643183")
*   孤儿进程与僵尸进程\[总结\]：[www.cnblogs.com/Anker/p/327…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2FAnker%2Fp%2F3271773.html "http://www.cnblogs.com/Anker/p/3271773.html")

3.2操作系统进程间通信的方式有哪些？
-------------------

首先要知道的是：进程和线程的**关注点**是不一样的：

*   **进程间资源是独立的**，关注的是**通讯**问题。
*   **线程间资源是共享的**，关注的是**安全**问题。

> 操作系统进程间通信的方式有哪些？

*   管道（pipe）：管道是一种**半双工**的通信方式，数据只能单向流动，而且只能在具有亲缘关系的进程间使用。进程的亲缘关系通常是指**父子进程**关系。
*   有名管道（named pipe）：有名管道也是半双工的通信方式，但是它**允许无亲缘关系**进程之间的通信。
*   消息队列（message queue）：消息队列是消息的链表，存放在内核中并由消息队列表示符标示。消息队列**克服了信号传递信息少**，管道只能承载无格式字节流以及缓冲区大小受限制等缺点。
*   共享内存（shared memory）：共享内存就是映射一段内被其它进程所访问的内存，共享内存由一个进程创建，但是多个进程都可以访问。共享内存是最快的IPC，它是**针对其它进程通信方式运行效率低的而专门设计的**。它往往与其它通信机制。如信号量，配合使用，来实现进程间的同步和通信。
*   套接字（socket）：套接字也是进程间的通信机制，与其它通信机制不同的是，它可以用于**不同机器间**的进程通信。
*   信号（signal）：信号是一种比较复杂的通信方式，用于**通知**接受进程进程某个时间已经发生。
*   信号量（semaphore）：信号量是一个**计数器**，可以用来控制多个进程对共享资源的访问。
    *   它常作为一种**锁的机制**，防止某进程正在访问共享资源时，其它进程也访问该资源。因此它主要作为不同进程或者同一进程之间**不同线程之间同步的手段**。

* * *

3.3操作系统线程间通信的方式有哪些？
-------------------

> 操作系统线程间通信的方式有哪些？(可以直接理解成：线程之间**同步的方式**有哪些)

*   锁机制：包括互斥锁、条件变量、读写锁
*   信号量机制(Semaphore)：包括无名线程信号量和命名线程信号量
*   信号机制(Signal)：类似进程间的信号处理

线程间的通信目的**主要是用于线程同步**。

参考资料：

*   线程通信与进程通信的区别：[www.cnblogs.com/xh0102/p/57…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fxh0102%2Fp%2F5710074.html "https://www.cnblogs.com/xh0102/p/5710074.html")
*   操作系统——进程，线程，锁：[www.cnblogs.com/biterror/p/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fbiterror%2Fp%2F6909653.html "https://www.cnblogs.com/biterror/p/6909653.html")
*   操作系统进程、线程：[www.cnblogs.com/wxquare/p/5…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2Fwxquare%2Fp%2F5168745.html "http://www.cnblogs.com/wxquare/p/5168745.html")
*   进程间的五种通信方式介绍：[blog.csdn.net/wh\_sjc/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwh_sjc%2Farticle%2Fdetails%2F70283843 "https://blog.csdn.net/wh_sjc/article/details/70283843")

扩展阅读：

*   进程间的五种通信方式介绍(详情介绍)：[blog.csdn.net/wh\_sjc/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwh_sjc%2Farticle%2Fdetails%2F70283843 "https://blog.csdn.net/wh_sjc/article/details/70283843")
*   Linux内核调度分析（进程调度）：[cloud.tencent.com/developer/a…](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1027448 "https://cloud.tencent.com/developer/article/1027448")

3.4操作系统进程调度算法有哪些？
-----------------

> 操作系统进程调度算法有哪些？

*   先来先服务算法(FCFS)
    *   谁先来，就谁先执行
*   短进程/作业优先算法(SJF)
    *   谁用的时间少、就先执行谁
*   最高响应比优先算法(HRN)
    *   对FCFS方式和SJF方式的一种综合平衡
*   最高优先数算法
    *   系统把处理机分配给就绪队列中**优先数最高**的进程
*   基于时间片的轮转调度算法
    *   每个进程所享受的CPU处理时间都是一致的
*   最短剩余时间优先算法
    *   短作业优先算法的升级版，只不过它是**抢占式**的
*   多级反馈排队算法
    *   设置多个就绪队列，分别赋予不同的优先级，如逐级降低，队列1的优先级最高

参考笔记：

*   [操作系统第四篇【处理机调度】](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484186%26idx%3D5%26sn%3D54bda03c277af5283c9daff07fff4246%26chksm%3Debd7421bdca0cb0da6de8e2211049a7b9e95b0d4f5a76b9f6c68682d8648ecc71d92b12bcde3%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484186&idx=5&sn=54bda03c277af5283c9daff07fff4246&chksm=ebd7421bdca0cb0da6de8e2211049a7b9e95b0d4f5a76b9f6c68682d8648ecc71d92b12bcde3#rd")

四、拓展阅读
======

**此部分是看别人的博文已经写得很好了，分享给大家**~

4.1ConcurrentHashMap中的扩容是否需要对整个表上锁？
-----------------------------------

> ConcurrentHashMap中的扩容是否需要对整个表上锁？

总结(摘抄)要点：

*   通过给**每个线程分配桶区间**(默认一个线程分配的桶是16个)，避免线程间的争用。
*   通过为**每个桶节点加锁**，避免 putVal 方法导致数据不一致。
*   同时，在扩容的时候，也会**将链表拆成两份**，这点和 HashMap 的 resize 方法类似。

参考资料：

*   并发编程——ConcurrentHashMap扩容逐行分析[www.jianshu.com/p/2829fe36a…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F2829fe36a8dd "https://www.jianshu.com/p/2829fe36a8dd")
*   《Java源码分析》：ConcurrentHashMap JDK1.8：[blog.csdn.net/u010412719/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fu010412719%2Farticle%2Fdetails%2F52145145 "https://blog.csdn.net/u010412719/article/details/52145145")

4.2什么是一致性Hash算法（原理）？
--------------------

> 什么是一致性Hash算法（原理）？

总结(摘抄)要点：

*   一致性Hash算法将整个哈希值空间组织成一个**虚拟的圆环**，好处就是提高**容错性和可扩展性**。
    *   对于节点的增减都**只需重定位环空间中的一小部分数据**。

参考资料：

*   一致 Hash 算法分析：[crossoverjie.top/2018/01/08/…](https://link.juejin.cn?target=https%3A%2F%2Fcrossoverjie.top%2F2018%2F01%2F08%2FConsistent-Hash%2F "https://crossoverjie.top/2018/01/08/Consistent-Hash/")
*   面试必备：什么是一致性Hash算法？[zhuanlan.zhihu.com/p/34985026](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F34985026 "https://zhuanlan.zhihu.com/p/34985026")

4.3MySQL date、datetime和timestamp类型的区别
-------------------------------------

> MySQL date、datetime和timestamp类型的区别

总结(摘抄)要点：

*   date精确到天，datetime和timestamp精确到秒
*   datetime和timestamp的区别：
    *   timestamp会**跟随设置的时区**变化而变化，而datetime保存的是绝对值不会变化
    *   timestamp储存占用4个字节，datetime储存占用8个字节
    *   可表示的时间范围不同，timestamp只能到表示到2038年，datetime可到9999年

参考资料：

*   MySQL date、datetime和timestamp类型的区别：[zhuanlan.zhihu.com/p/23663741](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F23663741 "https://zhuanlan.zhihu.com/p/23663741")

4.4判断一个链表是否有环/相交
----------------

判断一个链表是否有环(实际上就是看看**有无遍历到重复的节点**)，解决方式(3种)：

1.  for遍历两次
2.  使用hashSet做缓存，记录已遍历过的节点
3.  使用两个指针，一前一后遍历，总会出现`前指针==后指针`的情况

参考资料：

*   漫画算法：如何判断链表有环？[blog.jobbole.com/106227/](https://link.juejin.cn?target=http%3A%2F%2Fblog.jobbole.com%2F106227%2F "http://blog.jobbole.com/106227/")

* * *

判断**两个无环链表是否相交**，解决方式(2种)：

*   将第一个链表尾部的next指针指向第二个链表，两个链表组成一个链表。
    *   判断这一个链表是否有环，有环则相交，无环则不相交
*   直接判断两个链表的尾节点是否相等，如果相等则相交，否则不相交

判断**两个有环链表**是否相交(注:当一个链表中有环，一个链表中没有环时，两个链表必不相交)：

*   找到第一个链表的环点，然后将环断开（当然不要忘记了保存它的下一个节点），然后再来遍历第二个链表，如果发现第二个链表从有环变成了无环，那么他们就是相交的嘛，否则就是不相交的了。

参考资料：

*   判断两个链表是否相交并找出交点：[blog.csdn.net/jiary520131…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjiary5201314%2Farticle%2Fdetails%2F50990349 "https://blog.csdn.net/jiary5201314/article/details/50990349")
*   判断单链表是否存在环，判断两个链表是否相交问题详解：[www.cppblog.com/humanchao/a…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cppblog.com%2Fhumanchao%2Farchive%2F2008%2F04%2F17%2F47357.html "http://www.cppblog.com/humanchao/archive/2008/04/17/47357.html")

4.5keepAlive含义
--------------

*   HTTP协议的Keep-Alive意图在于**连接复用**，同一个连接上串行方式传递请求-响应数据
*   TCP的KeepAlive机制意图在于**保活、心跳，检测连接错误**

参考资料：

*   聊聊 TCP 中的 KeepAlive 机制：[www.importnew.com/27624.html](https://link.juejin.cn?target=http%3A%2F%2Fwww.importnew.com%2F27624.html "http://www.importnew.com/27624.html")

最后
==

如果大家有更好的理解方式或者文章有错误的地方还请大家不吝在评论区留言，大家互相学习交流~~~

> 如果想看更多的**原创**技术文章，欢迎大家关注我的**微信公众号:Java3y**。公众号还有**海量的视频资源**哦，关注即可免费领取。

可能感兴趣的链接：

*   **文章的目录导航(微信公众号端)**：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")
*   **文章的目录导航(PC端)**：[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fpcduan-wen-zhang-dao-hang "http://www.zhongfucheng.bitcron.com/post/shou-ji/pcduan-wen-zhang-dao-hang")
*   **海量精美脑图：**[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fnao-tu-da-quan "http://www.zhongfucheng.bitcron.com/post/shou-ji/nao-tu-da-quan")