---
author: "Java3y"
title: "Storm入门，包学会"
date: 2020-05-11
description: "由于最近在整理系统，所以顺便花了点时间入门了一下Storm（前几天花了点时间改了一下，上线以后一堆Bug，于是就果断回滚了。） 这篇文章来讲讲简单Storm的简单使用，没有复杂的东西。看完这篇文章，等到接手Storm的代码的时候你们『大概』『应该』能看懂Storm的代码…"
tags: ["Java","大数据中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:12,comments:0,collects:16,views:2294,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

听说过大数据的同学应该都听说过**Storm**吧？其实我现在负责的系统用的就是Storm，在最开始接手系统的时候，我是完全不了解Storm的（现在其实也是一知半解而已）

由于最近在整理系统，所以顺便花了点时间入门了一下Storm（前几天花了点时间改了一下，上线以后一堆Bug，于是就果断回滚了。）

这篇文章来讲讲简单Storm的简单使用，没有复杂的东西。看完这篇文章，等到接手Storm的代码的时候你们\*\*『大概』『应该』\*\*能看懂Storm的代码。

什么是Storm
--------

我们首先进官方看一下Storm的介绍：

> Apache Storm is a free and open source distributed realtime computation system

Storm是一个**分布式的实时计算系统**。

分布式：我在之前已经写过挺多的分布式的系统了，比如Kafka/HDFS/Elasticsearch等等。现在看到分布式这个词，三歪第一反应就是「它的存储或者计算交由**多台服务器上**完成，最后汇总起来达到最终的效果」。

实时：处理速度是毫秒级或者秒级的

计算：可以简单理解为对数据进行处理，比如清洗数据（对数据进行规整，取出有用的数据）。

我们使用Storm做了什么？
--------------

我现在做的消息管理平台是可以推送各类的消息的（IM/PUSH/短信/微信消息等等)，消息下发后，**我们是肯定要知道这条消息的下发情况的**（是否发送成功，如果用户没收到是由于什么原因导致用户没收到，消息是否被点击了等等）。

**消息是否成功下发到用户上，这是运营和客服经常关心的问题。**

**消息下发的效果，这是运营非常关心的问题**

基于上面问题，我们用了**Storm做了一套自己的埋点方案**，帮助我们快速确认消息**是否成功下发到用户上**以及统计**消息下发的效果**。

听起来好像很牛逼，下面我来讲讲背景，看完你就会发现一点儿都不难。

### 需求背景

消息管理平台虽然看起来只是发消息的，但是系统设计还是有点东西的。我们以「**微服务**」的思想去看这个系统，会将**不同的功能模块抽取到不同的系统**的。

其中PUSH（推送）的链路是最长的，一条消息下发经过的后端系统就有7个，如图下：

![](/images/jueJin/17201473bb76fce.png)

这7个系统都有可能「干掉」了这条消息，导致用户没收到。如果我们每去查一个问题，都要逐一排查每个系统，那实在是太慢了。

很多时候客服反馈过来的问题都是当天的，甚至是前几分钟的，我们需要有一个**及时的反馈**给客服来帮助用户找到为什么收不到消息的原因。

于是我们要做两个功能：

1.  能够查询用户**当天**所有的消息下发情况。（能够快速定位是哪个系统什么原因导致用户收不到消息）
2.  查询某条消息的**实时**整体下发情况。（能够快速查看该消息的整体下发情况，包括下发量，中途过滤的量以及点击量）

> 如果是单纯查问题，我们将各个系统的日志收集到Kafka，然后写到Elasticsearch这个是完全没问题的（现在我们也是这么干的）
> 
> 涉及到统计相关的，我们就有自己的一套埋点方案，**这个是便于对数据的统计，也能完成部分排查的功能**。

### 需求实现

前面提到了「埋点」，实际上就是**打日志**。其实就是在关键的地方上打上日志做记录，方便排查问题。

比如，现在我们有7个系统，每个系统在执行消息的时候都会可能导致这条消息发不出去（可能是消息去重了，可能是用户的手机号不正确，可能是用户太久没有登录了等等都有可能）。我们在这些『**关键位置**』都打上日志，方便我们去排查。

这些「关键位置」我们都给它**用简单的数字来命个名**。比如说：我们用「11」来代表这个用户没有绑定手机号，用「12」来代表这个用户10分钟前收到了一条一模一样的消息，用「13」来代表这个用户屏蔽了消息.....

「11」「12」「13」「14」「15」「16」这些就叫做「**点位**」，把这些点位在关键的位置中打上日志，这个就叫做「**埋点**」

有了埋点，我们要做的就是将这些**点位收集**起来，然后统一处理成我们的格式，输出到数据源中。

OK，就是分三步：

1.  收集日志
2.  **清洗日志**
3.  输出到数据源

收集日志我们有logAgent帮我们收集到**Kafka**，实时清洗日志我们用的就是**Storm**，清洗完我们输出到Redis(实时)/Hive（离线）。

Storm一般是在处理（清洗）那层，Storm的上下游也很明确了（上游是消息队列，下游写到各种数据源，这种是最常见的）：

![](/images/jueJin/17201473beb8c60.png)

Storm统一清洗出来放到Redis，我们就可以通过接口来很方便去查一条消息的整体下发情况，比如：

![](/images/jueJin/17201473bf35b48.png)

到这里，主要想说明我们通过Storm来**实时清洗**数据，下来来讲讲Storm的基本使用~

Storm入门
-------

我们从一段最简单的Storm代码入门，先看看下面的代码：

![](/images/jueJin/17201473bf42d26.png)

如果完全没看过Storm代码的同学，看到上面的代码会怎么分析？我是这样的：

*   首先有一个TopologyBuilder的东西，这个东西可能是Storm的构造器之类的
*   然后设置了Spout和Bolt（但是我不知道这两个东西是用来干嘛的，但是我可以点进去对象里边看看做了什么）
*   然后设置了一下Config配置（应该是设置Storm分配多少内存，多少线程之类的，反正跟配置相关）
*   最后用StormSubmitter提交任务，把配置和TopologyBuilder的内容给提交上去。

我们简单搜一下，就可以发现它的流程大致是这样的：

![](/images/jueJin/17201473c19dd0b.png)

Spout是**数据的源头**，一般我们用它去接收数据，Spout接收到数据后往Bolt上发送，**Bolt处理数据**（清洗）。Bolt清洗完数据可以写到一个数据源或者传递给下一个Bolt继续清洗。

Topology**关联了**我们在程序中定义好的Spout和Bolt。各种 Spout 和 Bolt 连接在一起之后，就成了一个 Topology，一个 Topology 就是一个 Storm 应用。

Spout往Bolt传递数据，Bolt往Bolt传递数据，这个传递的过程叫做**Stream**，Stream传递的是一个一个**Tuple**。

![](/images/jueJin/17201473c414069.png)

现在问题来了，我们的Spout和Bolt之间是怎么关联起来的呢？Bolt和Bolt之间是怎么关联起来的呢？

在上面的图我们知道一个Topology会有多个Spout和多个Bolt，那我怎么知道这个Spout传递的数据是给这个Bolt，这个Bolt传递的数据是给另外一个Bolt？（说白了，就是上面图上的**箭头**是怎么关联的呢？）

在Storm中，有**Grouping**的机制，就是决定Spout的数据流向哪个Bolt，Bolt的数据流向下一个Bolt。

为了提高**并发度**，我们在setBolt的时候，可以指定Bolt的线程数，也就是所谓的**Executor**（Spout也同样可以指定线程数的，只是这次我拿Bolt来举例）。我们的结构可能会是这样的：

![](/images/jueJin/1720147413a9698.png)

分组的策略有以下：

*   1）**shuffleGrouping**（随机分组）
*   2）fieldsGrouping（按照字段分组，在这里即是同一个单词只能发送给一个Bolt）
*   3）allGrouping（广播发送，即每一个Tuple，每一个Bolt都会收到）
*   4）globalGrouping（全局分组，将Tuple分配到task id值最低的task里面）
*   5）noneGrouping（随机分派）
*   6）directGrouping（直接分组，指定Tuple与Bolt的对应发送关系）
*   7）Local or shuffle Grouping
*   8）partialKeyGrouping（关键字分组，与按字段分组很相似，但他分配更加均衡）
*   9）customGrouping （自定义的Grouping）

shuffleGrouping策略我们是用得最多的，比如上面的图上有两个Spout，我们会将这两个Spout的Tuple**均匀**分发到各个Bolt中执行。

说到这里，我们再回头看看最开始的代码，**我给补充一下注释**，你们应该就能看得懂了：

![](/images/jueJin/17201473e3f97a6.png)

我还是再画一个图吧：

![](/images/jueJin/17201473e5777ff.png)

入门的过程复杂吗？不复杂。说白了就是Spout接收到数据，通过grouping机制将Spout的数据传到给Bolt处理，Bolt处理完看还需不需要继续往下处理，如果需要就传递给下一个Bolt，不需要就写到数据源、调接口等等。

![](/images/jueJin/17201474275f572.png)

Storm架构
-------

当我们提交任务之后，会发生什么呢？我们来看看。

1.  任务提交后，会被上传到**Nimbus**节点上，它是主控节点，负责分配代码、布置任务及检测故障
2.  Nimbus会去**Zookeeper**上读取整个集群的信息，将任务交给**Supervisor**，它是工作节点，负责创建、执行任务
3.  **Supervisor**创建Worker进程，每个Worker对应一个Topology的子集。Worker是Task的容器，Task是真正的任务执行者。

流程大致如下：

![](/images/jueJin/17201473e5efc6d.png)

Nimbus和Supervisor都是节点（服务器），Storm用Zookeeper去管理Supervisor节点的信息。

Supervisor节点下会创建Worker进程，创建多少个Worker进程由Conf配置文件决定。线程Executor，由进程产生，用于执行任务，Executor线程数有多少个是在setBolt、setSpout的时候决定。Task是真正的任务执行者，Task其实就是包装了Bolt/Spout实例。

![](/images/jueJin/17201473e62e3ff.png)

关于Worker、Executor、Task之间的关系，在官网有一个例子专门说明了，我们可以看看。先放出代码：

![](/images/jueJin/17201473e92e8ee.png)

内部的图：

![](/images/jueJin/17201473f59d1dc.png)

解释一下：

*   默认情况下：**如果不指定Tasks数，那么一个线程会有一个Task**
*   `conf.setNumWorkers(2)`代表会创建两个Worker进程
*   `setSpout("blue-spout", new BlueSpout(), 2)`蓝色Spout会有两个线程处理，因为有两个进程，所以一个进程会有一个蓝色Spout线程
*   `topologyBuilder.setBolt("green-bolt", new GreenBolt(), 2).setNumTasks(4)` 绿色Bolt会有两个线程处理，因为有两个进程Worker所以一个进程会有一个绿色Bolt线程。又因为设置了4个Task数，所以一个线程会分配两个绿色的Task
*   `topologyBuilder.setBolt("yellow-bolt", new YellowBolt(), 6).shuffleGrouping("green-bolt")`。黄色Bolt会有6个线程处理，因为创建了两个进程，所以一个进程会有3个黄色Bolt线程。没有单独设置Task书，所以一个线程默认有一个Task

从上面我们可以知道`threads ≤ tasks`线程数是肯定**小于等于**Task数的。有没有好奇宝宝会问：「**Storm用了线程，那么会有线程不安全的情况吗？**」（其实这是三歪刚学的疑问）

一般来说不会，因为很多情况下，一个线程是对应一个Task的（Task你可以理解为Bolt/Spout的实例），既然每个线程是处理自己的实例了，那当然不会有线程安全的问题啦。（当然了，你如果在Bolt/Spout中设置了**静态成员变量**，那还是会有线程安全问题）

最后
--

这篇文章简单地介绍了一下Storm，Storm的东西其实还有很多，包括ack机制什么的。现在进官方找文档，都在主推**Trident**了，有兴趣的同学可以继续往下看。

话又说回来，我司也在主推**Flink**了，这块后续如果有迁移计划，我也准备学学搞搞，到时候再来分享分享入门文章。

参考资料：

*   [storm.apache.org/releases/2.…](https://link.juejin.cn?target=http%3A%2F%2Fstorm.apache.org%2Freleases%2F2.1.0%2FUnderstanding-the-parallelism-of-a-Storm-topology.html "http://storm.apache.org/releases/2.1.0/Understanding-the-parallelism-of-a-Storm-topology.html")
*   [blog.csdn.net/w8y56f/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fw8y56f%2Farticle%2Fdetails%2F88826489 "https://blog.csdn.net/w8y56f/article/details/88826489")

### 各类知识点总结

> 下面的文章都有对应的**原创精美**PDF，在持续更新中，可以来找我催更~

*   [92页的Mybatis](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F0_zTBooRV4RTWQa8VOwiWg "https://mp.weixin.qq.com/s/0_zTBooRV4RTWQa8VOwiWg")
*   [129页的多线程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fr7IrmvBxG5W0hswfcgFjcQ "https://mp.weixin.qq.com/s/r7IrmvBxG5W0hswfcgFjcQ")
*   [141页的Servlet](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486798%26idx%3D1%26sn%3Dce900e97a495ffd681cd0ad9b78aa5ca%26chksm%3Debd74c4fdca0c559d0a32a3f3ddb3f579d3a16b47f70234c46ac2e5df315e7df90f93d1715b9%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486798&idx=1&sn=ce900e97a495ffd681cd0ad9b78aa5ca&chksm=ebd74c4fdca0c559d0a32a3f3ddb3f579d3a16b47f70234c46ac2e5df315e7df90f93d1715b9&token=1109491988&lang=zh_CN#rd")
*   [158页的JSP](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486854%26idx%3D1%26sn%3Dfd77a6225b898b69c4f0e1a7e66cf105%26chksm%3Debd74c87dca0c5910a923a443ea6f694dd554b68df8cc00506570555b9cf7718a2ef2a058754%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486854&idx=1&sn=fd77a6225b898b69c4f0e1a7e66cf105&chksm=ebd74c87dca0c5910a923a443ea6f694dd554b68df8cc00506570555b9cf7718a2ef2a058754&token=1109491988&lang=zh_CN#rd")
*   [76页的集合](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486873%26idx%3D1%26sn%3Dce0752f481336ffba9b8f44265b2550e%26chksm%3Debd74c98dca0c58ee04162d7e5d07fd36c8ec1b32460a8a2396168a9fc5885a208810f0916f2%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486873&idx=1&sn=ce0752f481336ffba9b8f44265b2550e&chksm=ebd74c98dca0c58ee04162d7e5d07fd36c8ec1b32460a8a2396168a9fc5885a208810f0916f2&token=1109491988&lang=zh_CN#rd")
*   [64页的JDBC](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486905%26idx%3D1%26sn%3D67fcd0558cfbdf6cd36de98cbd93afaf%26chksm%3Debd74cb8dca0c5ae052e6d216ed13458a9a17fa1b0f245bf740379b1d4b04b4e55fcbfb5adb4%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486905&idx=1&sn=67fcd0558cfbdf6cd36de98cbd93afaf&chksm=ebd74cb8dca0c5ae052e6d216ed13458a9a17fa1b0f245bf740379b1d4b04b4e55fcbfb5adb4&token=1109491988&lang=zh_CN#rd")
*   [105页的数据结构和算法](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486831%26idx%3D1%26sn%3D0d4b05e10d66eda1129f43348a8e3952%26chksm%3Debd74c6edca0c5786a5109a131d0501ef6bd02077e5ce1ad75d906cf3612a320d1098163e2d0%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486831&idx=1&sn=0d4b05e10d66eda1129f43348a8e3952&chksm=ebd74c6edca0c5786a5109a131d0501ef6bd02077e5ce1ad75d906cf3612a320d1098163e2d0&token=1109491988&lang=zh_CN#rd")
*   [142页的Spring](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247487013%26idx%3D1%26sn%3Df0d8c292738eb49bcd09cb2f6458dc69%26chksm%3Debd74f24dca0c632fa3ef8f205a2dd5c96531f78a68eae805e15b84de0b59774196a188aed14%26token%3D306734573%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247487013&idx=1&sn=f0d8c292738eb49bcd09cb2f6458dc69&chksm=ebd74f24dca0c632fa3ef8f205a2dd5c96531f78a68eae805e15b84de0b59774196a188aed14&token=306734573&lang=zh_CN#rd")
*   [58页的过滤器和监听器](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247487054%26idx%3D1%26sn%3D25f92798050d092027931e2ae0379e90%26chksm%3Debd74f4fdca0c6595bc795fd00354cf683d4593550cdd38ba7103893dd622606fc8f55fe6631%26token%3D306734573%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247487054&idx=1&sn=25f92798050d092027931e2ae0379e90&chksm=ebd74f4fdca0c6595bc795fd00354cf683d4593550cdd38ba7103893dd622606fc8f55fe6631&token=306734573&lang=zh_CN#rd")
*   [30页的HTTP](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247487071%26idx%3D1%26sn%3D511459730b3114fc77c60b82b54159b8%26chksm%3Debd74f5edca0c648c9b0c572fbc7fdbc26179ddcd7c45de37c06b6a2906a8ffc207f145b66f2%26token%3D480724592%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247487071&idx=1&sn=511459730b3114fc77c60b82b54159b8&chksm=ebd74f5edca0c648c9b0c572fbc7fdbc26179ddcd7c45de37c06b6a2906a8ffc207f145b66f2&token=480724592&lang=zh_CN#rd")
*   Hibernate
*   AJAX
*   Redis
*   ......

#### 涵盖Java后端所有知识点的开源项目（已有7 K star）：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

如果大家想要**实时**关注我更新的文章以及分享的干货的话，微信搜索**Java3y**。

PDF文档的内容**均为手打**，有任何的不懂都可以直接**来问我**（公众号有我的联系方式）。

![](/images/jueJin/172014741149ff4.png)

![](/images/jueJin/17201474114bf77.png)

![](/images/jueJin/1720147414014b5.png)

本文使用