---
author: "Java3y"
title: "我说我懂多线程，面试官立马给我发了offer"
date: 2020-04-07
description: "在上周总结了一篇「工作中常用到的Java集合类」，反响还不错。这周来写写Java另一个重要的知识点：「多线程」 多线程大家在初学的时候，对这个知识点应该有不少的疑惑的。我认为主要原因有两个： 多线程在初学的时候不太好学，并且一般写项目的时候也很少用得上（至少在初学阶段时写的项目…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:50,comments:0,collects:31,views:4642,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

在上周总结了一篇「工作中常用到的Java集合类」，反响还不错。这周来写写Java另一个重要的知识点：「**多线程**」

![](/images/jueJin/1715238ef53a286.png)

多线程大家在初学的时候，对这个知识点应该有不少的疑惑的。我认为主要原因有两个：

*   多线程在初学的时候不太好学，并且一般写项目的时候也很少用得上（至少在初学阶段时写的项目基本不需要自己创建线程）。
*   多线程的知识点在面试经常考，多线程所涉及的知识点非常多，难度也不低。

这就会给人带来一种感觉「**这破玩意涉及的东西是真的广，平时也不怎么用，怎么面试就偏偏爱问这个鬼东西**」

不多BB，我要开始了。

![](/images/jueJin/1715238ef6afc2e.png)

为什么使用多线程？
---------

首先，我们要明确的是「为什么要使用多线程」，可能有人会认为「**使用多线程就是为了加快程序运行的速度啊**」。如果你是这样回答了，那面试官可能会问你「那多线程是怎么加快程序运行速度的？」

于我的理解：使用多线程最主要的原因是**提高系统的资源利用率**。

现在CPU基本都是多核的，如果你只用单线程，那就是只用到了一个核心，其他的核心就相当于空闲在那里了。

> 厕所的坑位有5个，如果只用一个坑位，那不是很亏？比如现在我有5个人要上厕所。
> 
> 在单线程的时候：进去一个人解决要10分钟，然后后面的人都得等一个坑位。那总的时间就要花费50分钟。
> 
> 在多线程的时候，进去一个人要解决10分钟，然后后面的人发现还有别的坑位，就去别的坑位了，不是傻瓜地等一个坑位。

![](/images/jueJin/1715238ef67ef67.png)

我们可以把「等坑位」看作是**IO**操作，众所周知IO操作相对于CPU而言是非常慢的，CPU等待IO那段时间是空闲的。如果我们需要做类似IO这种慢的操作，可以开多个线程出来，**尽量不要让CPU空闲下来**，提高系统的资源利用率。

说白了，我们就是在\*\*「压榨」\*\*CPU的资源。本来就有的资源，**如果有需要**，我们就应当好好利用。

**多线程不是银弹**，并不是说线程越多，我们的资源利用效率就越好。执行IO操作我们线程可以适当多一点，因为很多时候CPU是相对空闲的。如果是计算型的操作，本来CPU就不空闲了，还开很多的线程就不对了（有多线程就会有线程切换的问题，线程切换都是需要耗费资源的）

![](/images/jueJin/1715238efa4a1cd.png)

多线程离我们远吗？
---------

多线程其实离我们很近，只是很多时候我们感知不到它的存在而已。

Tomcat我相信每个Java后端的同学都认识它，它就是以多线程去响应请求的，我们可以在`server.xml`中配置连接池的配置，比如：

```
<Connector port="8080" maxThreads="350" maxHttpHeaderSize="8192" minSpareThreads="45" maxPostSize="512000" protocol="HTTP/1.1" enableLookups="false" redirectPort="8443" acceptCount="200" keepAliveTimeout="15000" maxKeepAliveRequests="-1" maxConnections="25000" connectionTimeout="15000" disableUploadTimeout="false" useBodyEncodingForURI="true" URIEncoding="UTF-8" />
```

Tomcat处理每一个请求都会从线程连接池里边用一个线程去处理，这显然是多线程的操作。然后这个请求线程顺藤摸瓜到了我们的Servlet，执行对应的`service()`方法。

![](/images/jueJin/1715238efc9e6fc.png)

而我们的`service`方法是无状态的，多个线程请求`service`方法，往往都没有操作共享变量，不操作共享变量就不会有线程安全问题。

![](/images/jueJin/1715238f00ddf56.png)

上面只是用了Servlet举例，我们常用的SpringMVC其实也是一样的（毕竟底层还是Servlet）。

还有我们在连接数据库的时候，也会用对应的连接池（Druid、C3P0、DBCP等），比如常见的Druid配置：

```
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
<property name="url" value="${jdbc_url}" />
<property name="username" value="${jdbc_user}" />
<property name="password" value="${jdbc_password}" />

<property name="filters" value="stat" />

<property name="maxActive" value="20" />
<property name="initialSize" value="1" />
<property name="maxWait" value="60000" />
<property name="minIdle" value="1" />

<property name="timeBetweenEvictionRunsMillis" value="60000" />
<property name="minEvictableIdleTimeMillis" value="300000" />

<property name="testWhileIdle" value="true" />
<property name="testOnBorrow" value="false" />
<property name="testOnReturn" value="false" />

<property name="poolPreparedStatements" value="true" />
<property name="maxOpenPreparedStatements" value="20" />

<property name="asyncInit" value="true" />
</bean>
```

我想说的是：我们日常开发的程序几乎都是多线程模式的，只是绝大多数时候我们没感知到而已。很多时候都是**框架**帮我们屏蔽掉了。

多线程知识重要吗？
---------

从上面总结下来，我们可以发现：我们日常「关于多线程的代码」写得不多，但是我们写的程序代码的的确确是在多线程的环境下跑的。

如果我们不懂多线程知识，很直接的一个现实：

![生成结果](/images/jueJin/1715238f1db1fec.png)

从文章最开头的思维导图，我们可以发现多线程的知识点还是很多的，我们起码得知道：

*   线程和进程的区别
*   Thead类的常见方法
*   可以用什么手段来解决线程安全性问题
*   Synchronized和Lock锁的区别
*   什么是AQS、ReentrantLock和ReentrantReadWriteLock锁
*   JDK自带的线程池有哪几个，线程池的构造方法重要的参数
*   什么是死锁，怎么避免死锁
*   CountDownLatch、CyclicBarrier、Semaphore是什么？
*   Atomic包下的常见子类，什么是CAS，CAS会有什么问题
*   ThreadLocal是什么？
*   .....//

虽然在工作中未必会全部用得上，但如果项目真的用到了，我们如果学过了可能就可以很快地理解当时**为什么要这样设计**（我觉得去挖掘过程还是挺有意思的）。

「**我可能不用，但你必须要有**」

这个道理也很容易懂：「我买电脑的时候，虽然我是木耳听不出什么音质出来，但你音质就是得好」。企业招人的时候也一样「**你在工作的时候未必要写，但你必须要会**」

至少在我看来，从求职的角度触发，多线程是很重要的。之前我还整理过在我当时校招经常被问到的多线程面试题目：

1.  多线程了解多少啊？使用多线程会有什么问题？你是怎么理解“线程安全”的？
2.  如果我现在想要某个操作等待线程结束之后才执行，有什么方法可以实现？为什么要用CountDownLatch？CountDownLatch的底层是什么？(引出AQS)
3.  synchronized关键字来说一下，它的用途是什么？synchronized底层的原理是什么？
4.  线程安全的容器有哪些？(着重于ConcurrentHashMap、CopyWriteOnArrayList与其他非线程安全容器的区别以及它们的具体实现)
5.  ThreadLocal你了解过吗？主要是用来干什么的？具体的源码实现原理来说一下吧
6.  产生死锁的条件是什么？我们可以如何避免死锁？(可延伸到操作系统层面上的死锁)
7.  synchronized锁和ReentrantLock锁有什么区别呀？
8.  线程池你应该也看过吧，来说说为什么要用线程池。JDK默认实现了几个线程池，分别有xxx(自然地ThreadPoolExecutor构造函数的常用几个参数你也得一起说出来)
9.  ...

我在工作中用到的线程知识有哪些
---------------

本来是打算这篇文章主旋律就写这块的，然后我翻了一下自己维护的系统，用到的线程的地方还真的不是很多...

我就拿我现在的系统用到线程相关知识的几个例子吧。

### 线程池

我这边有个调度系统，运营设置了对应的时间，该任务就去执行，执行的内容大致就是去读HDFS文件，然后将数据组装，再传递到下游。

任务触发了以后，我们直接将这个任务交给一个线程池去处理，交由线程池后就直接返回`SUCCESS`。

![](/images/jueJin/1715238f1f2ebc6.png)

这样做的好处是什么？如果多个任务同时触发，那可能某些任务执行时间过长，请求可能会被阻塞住，而我们如果放在线程池中可以提高系统的吞吐量。

使用线程池的时候，往往我们的调用方都不需要考虑**请求是否立马处理成功**。假设线程池在处理任务的时候因为某些原因失败了，我们可以走**报警**机制（用邮件/短信等渠道去提醒请求方即可）。

不知道大家学过消息队列了没有，我们常常说消息队列是**异步**的，很多时候调用方的请求我们丢到消息队列里边，就告诉调用方我们这条请求处理成功了。实际上，这个请求可能还交由下游的多个系统去处理，下游的系统可能也是异步的.....

在使用线程池的时候，很多时候我们也是把他当做异步来使（WebFlux实际上也是将请求丢到线程池嘛)，只要我们的系统之间交互不是强一致性的，又希望提高系统的吞吐量，我们就可以考虑使用线程池。

![](/images/jueJin/1715238f2199c6b.png)

### 轮询

有的时候，我们需要有一个线程去轮询处理某些任务。

比如，我的系统会有发短信的功能，我调用渠道商的下发接口的后，我需要拿到短信的回执信息，于是我就需要去调用渠道商的回执接口。

此时最简单的做法就是开一个线程，不断的轮询渠道商的回执接口（我们设定轮询的间隔时间即可）

```
    Thread thread = new Thread(new Runnable() {
    @Override
        public void run() {
            while (true) {
                try {
                // 间隔一段时间轮询一次
                TimeUnit.MILLISECONDS.sleep(period);
                
                // 调用接口
                String result = http.post();
                
                // 得到result后进行处理(比如将结果插入到数据库)
                smsDao.insert(result);
            }
        }
        });
        thread.start();
```

或者有的时候，我们把任务放到内存阻塞队列或者Redis，也是通过一个线程轮询去取「队列」的数据。

![](/images/jueJin/1715238f2838bfe.png)

### 借助juc包实现线程安全

juc其实就是`java.util.concurrent`包

![](/images/jueJin/1715238f2b30c03.png)

我们在使用线程的时候，或者在日常开发的时候，都是得考虑我们现在使用的场景是否是**线程安全**的。

如果不是线程安全的，我们可以做什么东西来使我们的程序变得线程安全。

*   如果是集合，我们可以考虑一下juc包下的集合类。
*   如果是数值/对象，我们可以考虑一下atomic包下的类。
*   如果是涉及到线程的重复利用，我们可以考虑一下是否要用线程池。
*   如果涉及到对线程的控制（比如一次能使用多少个线程，当前线程触发的条件是否依赖其他线程的结果），我们可以考虑CountDownLatch/Semaphore等等
*   如果synchronized无法满足你，我们可以考虑lock包下的类

![](/images/jueJin/1715238f4e8da7d.png)

放干货
---

现在已经工作有一段时间了，为什么还来写`多线程`呢，原因有以下几个：

*   我是一个对**排版**有追求的人，如果早期关注我的同学可能会发现，我的GitHub、文章导航的`read.me`会经常更换。现在的[GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")导航也不合我心意了（太长了），并且早期的文章，说实话排版也不太行，我决定重新搞一波。
*   我的文章会分发好几个平台，但文章发完了可能就没人看了，并且图床很可能因为平台的防盗链就挂掉了。又因为有很多的读者问我：”**你能不能把你的文章转成PDF啊**？“
*   我写过很多系列级的文章，这些文章就几乎不会有太大的改动了，就非常适合把它们给”**持久化**“。

基于上面的原因，我决定把我的系列文章汇总成一个`PDF/HTML/WORD`文档。说实话，打造这么一个文档**花了我不少的时间**。为了防止**白嫖**，关注我的公众号回复「**888**」即可获取。

**PDF的内容非常非常长，干货非常非常的硬，有兴趣的同学可以浏览一波。共有「129」页**

![](/images/jueJin/1715238f349eed0.png)

文档的内容**均为手打**，有任何的不懂都可以直接**来问我**（公众号有我的联系方式）。

![img](/images/jueJin/171523928eff26c.png)

#### 涵盖Java后端所有知识点的开源项目（已有6 K star）：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

如果大家想要**实时**关注我更新的文章以及分享的干货的话，微信搜索**Java3y**。

![](/images/jueJin/171394f724d37f8.png)

![](/images/jueJin/171394f7272e09f.png)

![](/images/jueJin/171394f727b8607.png)