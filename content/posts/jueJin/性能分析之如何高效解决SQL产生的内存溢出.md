---
author: "zuozewei"
title: "性能分析之如何高效解决SQL产生的内存溢出"
date: 2021-10-28
description: "今天在测试环境有过代码升级。升级后，在群里有人反映系统访问很慢。运维人员反映服务器CPU使用率很高。运维重启后，没有多久，又有人反映系统访问很慢，这时运维人员说有大量的FullGC产生。"
tags: ["后端"]
ShowReadingTime: "阅读4分钟"
weight: 1126
---
小知识，大挑战！本文正在参与“[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")”创作活动。

本文已参与 [「掘力星计划」](https://juejin.cn/post/7012210233804079141 "https://juejin.cn/post/7012210233804079141") ，赢取创作大礼包，挑战创作激励金。

一、问题现象
------

今天在测试环境有过代码升级。升级后，在群里有人反映系统访问很慢。运维人员反映服务器 CPU 使用率很高。

运维重启后，没有多久，又有人反映系统访问很慢，这时运维人员说有大量的 Full GC 产生。

二、全局监控
------

先 TOP 一下，发现单 cpu `%us`一直处于 100%

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3926e76ddbe40cdaf7f7f8eb1c2b954~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在执行 TOP 时，要习惯性的点下1，这样才能看到每个 CPU 的使用率，如果不点，则看到的是所有 CPU 的平均值，像这样单 CPU 高的情况就会被平均掉，会有遗漏。

通过全局监控，发现是 PID 为 7313 的 Java 进程消耗 CPU 比较厉害。

三、定向监控
------

### 1、分析GC

实时查看 GC 状态：

bash

 代码解读

复制代码

`jstat -gcutil 7313 1000`

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6445987df72464c9d4244c262a5f4b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 从上图来看，JVM 一直在频繁的 FGC。新生代内存爆满。老年代内存爆满！怎么回事？难道是不断创建大对象，一直回收不了？

从单 CPU 高到查看 JVM 的 GC，是考虑到对于串行 FGC 来说，会导致单 CPU 高的情况。

扩展知识：

*   [性能监控之常见JDK命令行工具整理](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fzuozewei%2Farticle%2Fdetails%2F82695814 "https://blog.csdn.net/zuozewei/article/details/82695814")

### 2、分析应用日志

接着查看后台日志，出现大量的 SQL 相关报错：

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94bf189bdc7b4ab8879cbb2b632470d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

因为日志中有堆栈信息，和 SQL 相关，并且 jstat 中看到 heap 也已经满了，所以接下来就要查看 heapdump。

### 3、Heap dump 分析

打印相关进程的 heap dump。开始借助 MAT 工具进行分析。

命令：

bash

 代码解读

复制代码

`jmap-dump:format=b,file=test.hprof 7313`

发现 `ExecuteThread: '0' for queue: 'weblogic.kernel.Default(self-tuning)'` 占用内存 1.4 G，总的内存才 1.7 G

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/801aaf5790c149f18bb266955d8c9287~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

根据可疑的问题点，查看一下 Threadstack：

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2085f1c7e80411f9bc2e9f3f6e3bd9d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这里主要是查看和业务代码相关的行，从而找到调用点。

从上图可以看出，执行程序代码 PreparedSQLQuery 导致的问题。这段是 SQL 代码，是否可以定位到具体的 SQL 语句呢？

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e18394cdf8754cdc99b926d809d7ac98~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 从上图可以看到有一 个 Thread 消耗掉了 1.5G 的内容。展开查看其中的正在执行的 SQL。

从上图的左边的属性值中，可以看到当前正在执行的 SQL。

### 4、应用分析

结合后台日志大量提示 SQL 问题，可以确定，这条 SQL 是本次问题的关键所在。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d916ad6273df49e4842820758e51b517~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 既然拿到了具体 的SQL ，那么就去相应的库中看一下！

拿着 SQL 到相应的数据库中执行。

发现 SQL 长时间没有响应，统计一下数据量大小，SQL 查询出来的数据量是 **537755** 行，表1中的数据总量是 **810093**，表 2 中的数据总量是 **537755** 行。

但是根据实际业务规则，这条 SQL 应该查询出来一条记录。这是怎么回事？

看一下两张表的结构（这里只列出 SQL 涉及到的列和索引）：

表1： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f4f47aca3ae4633b4a3c46cecf6fa70~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/404ccce56e804e719e1a7d0ff272cb46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ecf303b94234dc0971c464971693c1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

表2： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11af06c447864e6e9e945166e5ee7320~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19c741086e814cb185b0de727b256728~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d942592646be4180a1d1fc94350a7ef1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 接下来看一下原 SQL 的执行计划： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/479543562dba4388aab402ecf386777e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 说明下执行计划的相关知识： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf21d6f6589a44c9aff790f1b1690384~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 结合表结构和执行计划，第 1 张表进行了唯一索引扫描，第 2 张表则是索引快速扫描，似乎没有什么问题，但是cost 和 rows 很高，并且主要来自于第2 张表中。

分析一下原 SQL,最后发现关联表缺少了关联条件。

四、应用优化
------

优化一下SQL，查询出来的记录确实是一条，执行时间在 180ms 左右。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87beff66cd2746378ca57eca89e5822e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd6697c292a141f3ad14322c2596b8b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 从执行计划来看，添加了关联条件后，成本值大大降低。

经跟开发沟通确认后，他们确实是在测试环境调整了这条 SQL，测试环境恢复正常。了解到在生产环境对应的 SQL 语句是正确的。

五、总结
----

经过这个例子，我们应该体会到性能分析思路的重要性，基础知识很重要，实践也很重要。只有通过不断地积累，不断地实践，才能把理论体系转化为自己的能力体系。