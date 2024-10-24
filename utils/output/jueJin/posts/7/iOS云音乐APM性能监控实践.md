---
author: ""
title: "iOS云音乐APM性能监控实践"
date: 2023-03-15
description: "本文介绍了云音乐过去1年里在客户端性能监控方面的实践经验，探讨 CPU 高消耗、OOM、卡顿、ANR 等典型异常场景的监控原理和实施效果。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:45,comments:0,collects:81,views:14487,"
---
> 本文作者：xxq

背景
==

客户端 APM 监控是发现和解决产品质量问题的重要手段，通常用于排查线上崩溃等问题，随着业务迭代，单纯的崩溃监控不能满足要求，特别是对于云音乐这样业务场景很复杂的产品，**滑动不流畅、设备发热、UI 卡死、无故闪退**等异常问题对用户体验伤害都很大，因此我们自研了一套能力更完善的 APM 监控系统并在云音乐上取得了不错的效果，本文是关于客户端监控部分的具体实现方案以及实施效果的一些总结。

行业调研
====

互联网大厂基本都有自研的 APM，其中有些甚至已经开源，市面已有方案中有大厂将自己积累多年的 APM 监控能力商业化（字节、阿里、[手Q](https://link.juejin.cn?target=https%3A%2F%2Fperfdog.qq.com%2Farticle_detail%3Fid%3D10089%26issue_id%3D0%26plat_id%3D1 "https://perfdog.qq.com/article_detail?id=10089&issue_id=0&plat_id=1")），也有许多优秀的开源项目或详细方案介绍（[matrix](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTencent%2Fmatrix "https://github.com/Tencent/matrix")、[Wedjat](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faozhimin%2FiOS-Monitor-Platform "https://github.com/aozhimin/iOS-Monitor-Platform")、[Sentry](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgetsentry%2Fsentry-cocoa "https://github.com/getsentry/sentry-cocoa")），这些 APM 项目中不乏质量较高的开源项目比如 matrix 的内存监控，也有原理和思路比较全面比如 Wedjat 以及一些技术分享文章。

但对于云音乐这样比较复杂且独立的大型项目来讲，亟需一款技术可控且符合自身业务特点的 APM，因此我们不仅吸纳了市面上优秀方案的实践经验，同时结合业务场景做了深度的优化与改进，我们的方案主要有如下特点：

*   场景丰富全面：覆盖了 **OOM、ANR、Jank 卡顿、CPU 发热、UI 假死**等场景；
*   异常精细管控：设计了一套异常问题分级标准，对不同级别的问题采用不同的监控和治理策略；
*   堆栈精准高效：
    *   通过**聚合型堆栈**结构提升问题堆栈的准确率；
    *   通过过滤无用堆栈减少干扰信息；
    *   上报堆栈的线程名以便于过滤特定问题堆栈；
*   调试能力丰富：调试工具可以有效提升问题排查效率
    *   监控台实时展现CPU/GPU/FPS等信息；
    *   支持各类异常场景的模拟；
    *   支持本地符号化堆栈信息；
    *   支持函数耗时统计。

方案介绍
====

一、堆栈
----

### 目标

一款 APM 项目的核心目标是帮助业务提前发现和快速定位性能问题，在大家熟知的崩溃监控中**崩溃堆栈**是其最为核心的信息，在大部分场景能直接定位到出现崩溃问题的代码行，在本文提到的各类异常监控中亦是如此，本项目中绝大部分异常 Issue 都会将堆栈作为其核心信息上报，因此堆栈是 APM 项目中最基础也是最重要的模块。 但与此同时性能性能异常的堆栈和崩溃型堆栈也存在很大区别，崩溃堆栈是在问题发生时抓取全线程堆栈，而性能异常的监控很多时候不能准确抓取到当时的调用栈，需要利用统计学手段去**猜**问题场景最有可能的堆栈，所以我们设计了一套**聚合型堆栈**方案，本文也先从这里开始阐述。

### 堆栈聚合

#### Apple 的 ips 堆栈

堆栈格式参考自苹果ips文件，它将多组堆栈聚合到一起展示，通过缩进来表示堆栈的深度，这样即节省了堆栈的存储空间，也便于直观展示多组堆栈信息，还能根据堆栈的命中次数提取出命中率最高的**关键堆栈**，这对 Issue 的聚合有很大的帮助。

![image.png](/images/jueJin/e1ddc94657c3489.png)

#### 云音乐的聚合型堆栈

**存储结构**：这种聚合型堆栈实现方法比较简单，通过二叉树存储堆栈数据，打印结果时只需遍历二叉树，其中二叉树生成的算法如下：

> 1.  传入堆栈数组以及当前遍历的深度，如果深度已经超过数组大小，则退出递归；否则执行 `> 步骤2`；
> 2.  从栈底开始匹配当前二叉树节点，如果相同，则跳转至 `步骤3`；不相同则跳转至 `步骤> 4`；
> 3.  移动到下一个深度并交给 `right`节点处理，`right`为nil时创建节点，递归跳转至 `> 步骤1`；
> 4.  不移动深度并交给 `left`处理，`left`为nil时创建节点，递归跳转至 `步骤1`。

![image.png](/images/jueJin/3dea7f2e4b76c5a.png)

打印堆栈则是通过 DFS 后续遍历二叉树，再格式化输出每一栈帧的信息即可，需要根据树深度来输出正确的缩进，同时将堆栈的命中次数/占比打印在前面，后文有聚合型堆栈的展示效果，此处不赘述。

**压缩原理**：函数调用栈有一个特点，栈底的调用变化远远小于栈顶，这很好理解，一个调用树肯定是越往树枝末端分叉越多，这也使得从栈底向上聚合时能压缩大量的存储空间，粗略统计相比不用聚合型堆栈的数据，可以节省50%以上的存储空间。

> 下图中演示了3组堆栈聚合的过程，其中堆栈数据通过二叉树来管理。

![image.png](/images/jueJin/926dd268a917c65.png)

### 关键堆栈

每次传入堆栈更新/构建二叉树时，将当前节点的计数+1，表示当前节点匹配的次数，次数最高的权重也就最高，权重最高的为关键堆栈。

因此获取关键堆栈的过程也是搜索权重最大的二叉树路径，实现比较简单此处不再赘述。

### 无效堆栈

**为什么要过滤？**

在实际上报的堆栈里，我们发现大量堆栈如下，都是一些纯系统调用。

![image.png](/images/jueJin/fdc415daef7c8d5.png) ![image.png](/images/jueJin/ce07e917a9e9035.png) ![image.png](/images/jueJin/7fed15c6e7d6c00.png)

这类堆栈对我们排查问题几乎没有什么帮助，因此我们默认剔除这类堆栈，最大程度减少干扰。

一个堆栈是由一组调用帧组成，每个调用帧由 `image` `addr` `offset` 或与之等价的信息构成，我们只需判断 image 是不是 app 自己即可知道当次调用是否来自我们应用自身的代码。需要注意的是APP自身引入的动态库也要纳入内部调用，因此判断 `image` 是否来自 app 自身时，文件路径要去掉 `*.app/*`这部分的匹配。

**判断 `main`函数地址**

上面的三个图中，第一个图里有 `main`函数，不论何时抓取主线程几乎必定有这个调用，因为 APP 是由它启动的。但是 main 函数的 image 就是应用自身，如何单独排除掉这个特殊情况？可以通过 main 函数地址进行判断，首先获取到 main 函数地址，然后判断调用帧的 `addr`是否来自main函数。

main函数地址存在 mach-o 文件信息 `LC_MAIN` CMD 中

```c++
// 获取 main 函数地址
struct uuid_command * cmd = (struct uuid_command *)macho_search_command(image, LC_MAIN);
    if (cmd != NULL) {
    struct entry_point_command * entry_pt = (struct entry_point_command *)cmd;
    Dl_info info = {0};
    dladdr((const void *)header, &info);
    main_func_addr = (void *)(info.dli_saddr + entry_pt->entryoff);
}
```

> 需要注意的是，获取到的函数地址与frame的 `addr`会存在一个固定差值，判断时需要处理一下。

二、监控
----

### 目标

有了新的堆栈能力后，接下来我们需要针对不同的异常场景设计相应的监控方案，一般比较常见的性能异常场景和归因如下：

场景

归因

设备发热、耗电快

CPU 长时间高占用、频繁磁盘IO

卡顿

主线程执行或同步等待耗时任务，比如磁盘IO、文件加解密计算、图片提前解压等

界面不响应

主队列不响应任务，比如主线程死锁、死循环占用等

异常闪退

内存占用过高OOM、界面卡死、磁盘空间不足、CPU持续过高等

我们需要利用设备的系统信息对不同的场景实施与之相应的监控方案，其中系统信息与异常场景之间可以简单按照下面的映射进行关联：

*   CPU => 设备发热问题
*   Runloop 耗时 => 卡顿问题
*   main queue => 界面不响应
*   内存占用 => OOM

实际中会稍微复杂一些，接下来本文会围绕一些典型场景讲述其监控原理。

### CPU 高消耗

#### 原理

**窗口统计机制**

CPU过高的占用会带来设备发热、耗电快、后台进程被系统强杀等问题，严重影响用户体验，但正常使用下，比如滚动列表视图，通常会由于频繁I/O以及UI高频刷新，而致使CPU很容易达到100%占用率，但短时间的CPU高占用并不能衡量APP的健康度，甚至很多时候是正常现象，我们更关注的那些**长时间占用 CPU** 的问题线程，像 Xcode 自带的耗电监控也是类似的逻辑，因此我们使用**窗口扫描机制**策略来发现这类异常问题。

> `Apple Xcode`自带的耗电监控异常日志
> 
> ![image.png](/images/jueJin/0645d1a7a64722d.png)

实践中我们发现大部分CPU异常场景会集中在单个线程，因此监控更侧重线程维度的表达，异常Issue与线程一对一的关系，同时将线程名称一并上报。

此外CPU异常最关键的信息是**堆栈**，关于堆栈的格式、抓取策略、关键帧提取等内容，前面已经详细阐述，总的来说方案有如下几个关键点：

1.  通过窗口扫描机制，聚焦**长时间占用 CPU** 的异常情况
2.  将异常问题根据平均CPU占用率划分 info/warn/error 三种级别
3.  一个 Issue 对应一个线程，Issue 中包含线程名信息
4.  默认情况下，过滤完全没有APP内部调用的堆栈数据

> **窗口扫描机制**
> 
> 固定的统计窗口内CPU超过限制的次数超过一定次数时，抓取当前线程堆栈，当抓取线程堆栈数量超过设定阈值时，将采集到的堆栈聚合、排序并上报。
> 
> ![image.png](/images/jueJin/9fda9a43b85b23d.png)
> 
> 解释说明：
> 
> *   CPU usage 范围是0~1000，即 usage 为 `100`表示占用率为 `10%`
> *   图中窗口为 5/8，即窗口8次中有5次超限（超过80阈值），抓取堆栈
> *   窗口1中只有120、100、100，共计3次超限
> *   窗口2中有120、100、100、100，共计4次超限
> *   窗口3中有120、100、100、100、100，共计5次超限，满足5/8窗口，`抓取堆栈`
> *   ...

#### 效果

通过CPU监控定位了一处后台线程高占用从而导致云音乐后台听歌被强杀的线上问题。

> 某个线程CPU高占用上报量突增，解决后上报量降低到个位数
> 
> ![image.png](/images/jueJin/8f49a5b73aa95a6.png)

> 上报堆栈显示主线程某个动画模块持续高CPU占用
> 
> ![image.png](/images/jueJin/cc93e7d075d8a44.png)

### Jank 卡顿

#### 原理

**后台线程监控**

业内关于卡顿监控的方案基本大同小异，通过一个单独的线程不断轮训检测 Main Runloop 的耗时情况，超时则认为发生卡顿，我们定义超时时间为3帧即 `50ms`。同时我们还控制了堆栈抓取的频次以及页面采集频次，因为卡顿事件实在是太多了😹。

![image.png](/images/jueJin/4440c71c0b4a10c.png)

> 示例代码

```objc
// 监控线程
    dispatch_async(self.monitorQueue, ^{
    //子线程开启一个持续的loop用来进行监控
        while (YES) {
        NSTimeInterval tsBeforeWaiting = GetTimestamp();
        long semaphoreWait = dispatch_semaphore_wait(self.dispatchSemaphore, dispatch_time(DISPATCH_TIME_NOW, s_jank_monitor_runloop_timeout * NSEC_PER_MSEC));
        CFRunLoopActivity runloopActivity = atomic_load_explicit(&self->_runLoopActivity, memory_order_acquire);
        NSTimeInterval currentTime = GetTimestamp();
        NSTimeInterval tsInterval = currentTime - tsBeforeWaiting;
            if (semaphoreWait != 0) {
            // 信号量超时，认为发生卡顿
            ...
        }
    }
}

...

// 主线程runloop回调

    static void RunLoopObserverCallBack(CFRunLoopObserverRef observer, CFRunLoopActivity activity, void *info) {
    APMJankRunloopMonitor *jankMonitor = (__bridge APMJankRunloopMonitor *)info;
    atomic_store_explicit(&jankMonitor->_runLoopActivity, activity, memory_order_release);
    dispatch_semaphore_t semaphore = jankMonitor.dispatchSemaphore;
    dispatch_semaphore_signal(semaphore);
}
```

**频控**

每个页面每日只统计1次，除此之外，为了避免过于密集地抓取堆栈以及扩大堆栈采集的时间跨度，并不是每次卡顿事件发生时都抓取堆栈，约定在第1、3、5、10、15、20...`5n`次卡顿时抓取主线程堆栈，当抓取到的堆栈数量超过一个阈值时上报数据。

#### 效果

从上线后效果来看，聚合的准确度还不错，通过几个头部卡顿 Issue 可以看到，页面卡顿的典型场景集中在磁盘IO方面，与实际的结果是相符的。

> 主线程操作 FMDB
> 
> ![image.png](/images/jueJin/c13ee886ef5f652.png)

> 主线程 md5 计算
> 
> ![image.png](/images/jueJin/8db8f61c2bde585.png)

> 主线程下载文件
> 
> ![image.png](/images/jueJin/85e9a00e8794960.png)

### ANR 卡死

#### 原理

**ping机制**

**ANR** 是指UI线程无响应的情况，此时UI线程由于某种原因被阻塞，不执行任何新提交的主线程队列任务，基于这个特点，监控原理则是通过定时向 `main_queue`中发送任务修改 `ack`值，每次轮训检测 `ack`的值是否发生修改来判断主线程是否发生了**ANR**。

> 检测流程示意

![image.png](/images/jueJin/426d48ec7b6ec3d.png)

> 示意代码

```objc
// ack: recv success
    if (atomic_load_explicit(&s_ack, memory_order_acquire)) {
    // ack成功，值被修改
    // 状态恢复，ANR结束/未发生
    // ...
    // ANR 计数清零
    atomic_store_explicit(&s_anr_count, 0u, memory_order_release);
        } else {
        // 无应答，ANR 计数+1
        unsigned long anr_count = atomic_fetch_add_explicit(&s_anr_count, 1u, memory_order_acq_rel);
        anr_count ++;
        // 发生 ANR 事件
        // ...
    }
    
    // ack: send
    atomic_store_explicit(&s_ack, false, memory_order_release);
        dispatch_async(dispatch_get_main_queue(), ^{
        // ack: recv
        atomic_store_explicit(&s_ack, true, memory_order_release);
        });
```

每次发生 ANR 时抓取堆栈，抓取规则如下

1.  ANR 的第 4、8、16 秒时，抓取全线程堆栈并聚合
2.  ANR 的第 2、3、4、5、6...n 秒时，抓取主线程堆栈并聚合

实时将抓取到的堆栈数据存储到本地，如果程序从 ANR 状态恢复执行，则删除本地 ANR 数据；

每次启动时检查本地是否存在 ANR 数据，如果有数据则上报 ANR 异常，上报后删除这份数据。

#### 效果

常见的ANR场景有死锁（CPU占用低）、死循环（CPU占用高）、大任务等，下面展示了几种典型的ANR异常堆栈。

> 死锁问题
> 
> ![image.png](/images/jueJin/d1c4bd1938a5d61.png)

> h5 页面死锁
> 
> ![image.png](/images/jueJin/5b8002312c7372d.png)

> IO 操作超时
> 
> ![image.png](/images/jueJin/e6c93e3e653e3ee.png)

### 内存异常

#### 原理

内存异常主要包含**OOM**、**大内存对象**和**巨量小内存对象**三类异常，其中 OOM 属于崩溃型异常，而后两者属于运行时异常内存分配，比如某个对象创建了是百万次，或者一次申请了10M大小的内存对象。

方案原理在一定程度参考了 `matrix` 的方案，通过系统的 `malloc_logger` 回调时抓取内存申请的堆栈，根据内存大小维度聚合内存对象，记录内存的申请数量、内存大小以及堆栈等信息，在上报时dump出堆栈数据并上报，堆栈格式和前面一样都是聚合型堆栈。

需要注意的是，Dump 内存信息是比较耗性能的任务，监控只在APP内存占用超过500M时触发 dump，同时在 >500M 的前提下，每次内存增长300M会再次触发 dump 任务，下图展示了内存波动与 dump 时机的场景。

![image.png](/images/jueJin/0978cac0dbfdc6b.png)

#### 效果

目前OOM监控已在线上启用3个月以上，没有对用户体验产生明显劣化，我们甚至尝试过在 main 函数前就启动 OOM 监控，帮助业务侧定位到一个极难排查的**启动 OOM** 问题。

> 程序刚启动便发生严重的 OOM，系统的 ips 以及 xcode instrument 等官方工具，对这个场景几乎都束手无策。
> 
> ![image.png](/images/jueJin/86903343bf42340.png)

> 下图展示了某个 240 字节的内存对象申请了6535次，共占用485Mb内存大小
> 
> ![image.png](/images/jueJin/cc93e7d075d8a44.png)

后记
==

限于篇幅有很多能力没有展开讲述，APM 上线半年以来，帮助云音乐发现和定位不少线上问题，如今面对客诉反馈时也不再两眼一抹黑，大大提高了问题的解决效率，APM 在未来还会围绕下面几个方向持续完善，它也将持续为云音乐线上质量保驾护航。

> 关于 APM 未来的规划

*   链路自动化：异常 Issue 自动指派
*   场景精细化：网络大图内存异常监控
*   更全面的工具：监控日志定向回捞、采样数据可视化展现

* * *

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！