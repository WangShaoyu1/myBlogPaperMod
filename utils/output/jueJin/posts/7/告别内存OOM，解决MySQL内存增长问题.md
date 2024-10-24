---
author: "华为云开发者联盟"
title: "告别内存OOM，解决MySQL内存增长问题"
date: 2024-06-04
description: "MySQL内存问题可以结合MySQL提供的performance schema内存表和jeprof工具来辅助定位。"
tags: ["数据库","后端","MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:1,views:462,"
---
本文分享自华为云社区《[【华为云MySQL技术专栏】MySQL内存增长问题分析案例](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428447%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428447?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者：GaussDB 数据库。

**前言**
------

在现网环境中，偶尔会遇到客户实例内存OOM（Out Of Memory，即内存耗尽或溢出）的情况。MySQL数据库作为一款面向高并发应用场景的系统软件，因其应用场景复杂且函数调用链极长，导致分析内存异常问题变得非常困难。

MySQL提供了Performance Schema功能，用于跟踪其性能指标，包括内存占用情况。但该工具是有一定的局限性，只能监控通过MySQL提供的内存分配接口分配的内存，不能监控直接使用malloc或者new函数分配的内存。这种情况我们就可以借助jeprof工具（jeprof是jemalloc配套的内存分析工具）来定位，以下是借助jeprof定位MySQL内存问题的分析过程。

**问题描述**
--------

在生产环境中，某客户的实例频繁出现OOM，通过排查客户业务，发现是大事务导致的内存异常增长，该实例的MySQL版本为8.0.22（MySQL 8.0.25以后的版本解决了内存异常增长问题），我们通过如下方式在本地进行复现：

1\. 采用sysbench往一张表中压入100000000条数据，如下：

```css
sysbench --mysql-host=xxx  --mysql-port=xxx --mysql-user=xxx  --mysql-password=xxx  \/usr/share/sysbench/oltp_read_write.lua  --tables=1  \--table_size=100000000 prepare
```

2\. 随后开启一个大事务，比如更新某一列数据，如下：

```sql
begin;  update sbtest1 set  k=k+1;
```

该语句执行前，通过top命令查看到的内存使用情况如下：

![1.png](/images/jueJin/4069687287314ee.png)

语句执行过程中，内存持续增长，执行完毕时，其内存占用如下：

![2.png](/images/jueJin/3004337a1af1457.png)

**执行过程中，物理内存增长了近2.6g，显然占用异常**，若并发量较大的情况下，势必会OOM。

**定位过程**
--------

**1\. 查看performance\_schema相关的内存监控数据**

遇到MySQL的内存问题，首先想到的是打开performance\_schema开启MySQL自带的内存监控，这些监控在相当一部分场景下的确发挥了重要作用。

例如，可以使用如下的命令查看内存情况：

```csharp
select event_name, current_alloc from sys.memory_global_by_current_bytes limit 20;
```

但performance\_schema监控数据也有一些局限性。比如当前的这个场景，MySQL自带的内存监控并没有采样到任何的内存变化。这是因为自带的内存监控只能监控到通过MySQL内存分配函数分配的内存，比如以mem\_block\_info\_t为单位的MySQL内存分配函数等。所以，**直接通过malloc或者new分配的函数，自带内存监控是无法监控到的**。

**2\. 通过jeprof等工具采样内存**

jeprof可以捕获所有的malloc和free函数的调用，不过由于glibc默认的分配器是ptmalloc，因此，需要一些配置将默认的ptmalloc替换成jemalloc。

下载jemalloc源码，启用--enable-prof，编译出对应的libjemalloc.so.2，jeprof工具即可，具体如下：

步骤一：下载jemalloc源码，进入解压后的目录，执行如下命令编译出对应的libjemalloc.so.2，jeprof工具；

```bash
cd {jemalloc解压后的目录}  ./autogen.sh --enable-prof  ./configure --enable-prof
```

步骤二：配置jeprof内存采样，配置相关的选项参数, 具体的参数配置参考；[jemalloc.net/jemalloc.3.…](https://link.juejin.cn?target=http%3A%2F%2Fjemalloc.net%2Fjemalloc.3.html%25E3%2580%2582 "http://jemalloc.net/jemalloc.3.html%E3%80%82")

```ini
export MALLOC_CONF="background_thread:true,narenas:4,dirty_decay_ms:5000,prof:true,prof_prefix:/opt/workdir/logs/log,lg_prof_interval:30,lg_prof_sample:19"
```

步骤三：将ptmalloc替换为jemalloc，若通过ldd命令能看到如下结果则证明配置成功。

```arduino
export LD_PRELOAD='/jemalloc/libjemalloc.so.2' // 步骤一编译出来的libjemalloc.so.2路径
```

![3.png](/images/jueJin/a70bcae318c5437.png)

步骤四：启动进程，随后就可以在配置的prof\_prefix路径下查看到生成的内存采样数据。

**结果分析**
--------

关于jeprof结果解析的命令，这里不再赘述，具体可以通过jeprof -h查看。

就本文的问题而言，实际上只需要关心从语句执行开始到语句执行结束内存的变化部分就可。那么，就可以通过如下命令对比第一次生成的profing数据以及最后一次的profling数据：

```bash
/jemalloc/jeprof  --pdf ./mysqld  --base=log.start.heap log.end.heap > ../xxx.pdf
```

这里取部分结果的截图做分析:

![4.png](/images/jueJin/d87d73720499481.png)

![5.png](/images/jueJin/ee7b2ce20c0b4d8.png)

采样出来的数据是非常直观的，3072M的内存全部是在Rpl\_transaction\_write\_set\_ctx add\_write\_set函数中分配的，通过查看Rpl\_transaction\_write\_set\_ctx add\_write\_set函数的实现如下：

```javascript
void Rpl_transaction_write_set_ctx::add_write_set(uint64 hash) {    DBUG_TRACE;    DBUG_EXECUTE_IF("add_write_set_crash_no_memory", throw std::bad_alloc(););    write_set.push_back(hash);  }
```

参考《STL源码剖析》一书, vector的底层数据结构其实就是一段连续的线性空间，以start指针和fininsh指针分别指向已申请的连续空间中目前已被使用的范围，以end\_of\_storage指针指向连续空间的尾端，当原空间使用完，也即fininsh==end\_of\_storage时，vector会执行的动态扩容，也就是\_M\_realloc\_insert过程, 其步骤如下：

1） 以原空间大小的2倍申请一块新的空间；

2） 将原空间的内容拷贝到新空间；

3） 释放原空间。

而write\_set恰是一个vector, 因此可以确定write\_set占用了3072M内存从而导致内存的异常增长。这其实也是vector错误使用的一个典型案例，对于这种大量的push\_back场景，由于vector的2倍扩容，不仅会导致内存占用过多，扩容的过程中反复的申请新内存、释放旧内存也会导致性能问题。若仅考虑当前的问题场景，显然list是更优的选择。

**注意事项**
--------

1\. 编译jemalloc时，注意./autogen.sh --enable-prof 以及./configure --enable-prof 都需要加上--enable-prof选项，若仅在./autogen.sh是加上--enable-prof参数，这种情况下你需要在启动的时候以如下方式启动mysqld, 否则无法生成profiling文件：

```ini
LD_PRELOAD='/jemalloc/libjemalloc.so.2' bin/mysqld &
```

2\. 注意MALLOC\_CONF的参数中lg\_prof\_interval参数。该参数设置过小，会严重影响mysqld的性能。当执行性能下降后，某些场景可能就不会复现。比如本文所涉及的问题场景，lg\_prof\_interval设置的过小，就几乎观察不到明显的内存变化。

3\. 通过jeprof采样到的数据没有捕获到buffer pool的内存分配，这是因为jeprof是通过在jemalloc中设置采样点来采集数据的，只有应用程序通过malloc, free分配释放内存才会被采集到，而MySQL的buffer pool内存是直接通过mmap系统调用分配的，不经过jemalloc, 可以参考MySQL的large\_page\_aligned\_alloc函数，所有的大内存均是通过该函数分配的。

```arduino
inline void *large_page_aligned_alloc(size_t n_bytes) {    int mmap_flags = MAP_PRIVATE | MAP_ANON;    void *ptr = mmap(nullptr, n_bytes, PROT_READ | PROT_WRITE, mmap_flags, -1, 0);    return (ptr != (void *)-1) ? ptr : nullptr;  }
```

**总结**
------

上述客户业务中出现的问题，归根结底是代码中未对vector的内存进行限制，才有了大事务场景下内存无限增长最终导致OOM发生。华为云RDS for MySQL和GaussDB(for MySQL)完全兼容MySQL，华为云数据库在产品中对该问题进行了提前修复，后来开源MySQL在高版本中也对该问题也进行了修复。因此，MySQL内存问题可以结合MySQL提供的performance schema内存表和jeprof工具来辅助定位。

![](/images/jueJin/3cb6b9921060413.png)

**HDC 2024，6月21日-23日，东莞松山湖，期待与您相见！**

更多详情请参见大会官网：

中文：[developer.huawei.com/home/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fhdc "https://developer.huawei.com/home/hdc")

英文：[developer.huawei.com/home/en/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fen%2Fhdc "https://developer.huawei.com/home/en/hdc")

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")