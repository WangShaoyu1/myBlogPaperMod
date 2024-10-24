---
author: ""
title: "云音乐 iOS 跨端缓存库 - NEMichelinCache"
date: 2023-02-10
description: "在云音乐全面转跨端的时代，H5  RN 缓存模块是非常重要的组成部分，目前云音乐使用的缓存库已经“历史悠久”，没法在现有的基础上支撑日益庞大的跨端需求，因此我们基于缓存库的可扩展架构，从问题出发，重"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:28,comments:4,collects:37,views:13060,"
---
> 本文作者：[绎推](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fpeople%2Fmatthewchen-54 "https://www.zhihu.com/people/matthewchen-54")

### 背景

在云音乐全面转跨端的时代，H5 / RN 缓存模块是非常重要的组成部分，对页面的稳定性，页面性能等都有非常大影响，目前云音乐使用的缓存库已经“历史悠久”，没法在现有的基础上来支撑日益庞大的跨端需求，面临着当前架构没法修复的问题:

1.  后台 wake up问题与后台频繁 I / O 操作导致的崩溃 - 据统计，最高50%以上的后台崩溃是老缓存库导致
2.  主线程偶现卡死问题 - 线程管理问题
3.  RN / H5 页面偶现空白问题 - 数据不一致导致
4.  Fatal Exception，Bundler Error等降级错误率高
5.  RN unregister module 错误高
6.  大量细散重复日志，浪费网络资源
7.  没有整体日志监控，难以定位问题

因此我们基于缓存库的可扩展架构，从问题出发，重新设计了一套新的跨端缓存库 - **NEMichelinCache**，全文以 RN 缓存的角度来描述

### 缓存

首先我们要知道缓存的目的是什么？目的是以空间换时间。说起缓存，很多人会想到操作系统的缓存设计以及缓存中的直写与回写模式(Write Through and Write Back)。

#### 直写模式

![zhixie](/images/jueJin/a98785290e504c5.png)

> CPU 将数据同时更新到 Cache 和 Memory 中

#### 优点

*   有助于数据恢复（在停电或系统故障的情况下）
*   Cache 和 Memory 数据始终保持一致
*   直接 I / O 访问，可以获取到最新数据

#### 缺点

*   慢
*   写操作多

#### 回写模式

![huixie](/images/jueJin/5ec11381e0f74ed.png)

> CPU 将数据更新到 Cache 时，对 Cache 做一个标记，但不同步更新到 Memory 中（异步更新）

#### 优点

*   速度快
*   写操作少

#### 缺点

*   容易造成 Cache 和 Memory 数据不一致
*   直接 I / O 访问，不能获取到最新数据

### 思考

对于一个跨端缓存库方案，主要考虑以下几个方面:

*   如何解决目前面临的问题：收集缓存库相关问题，从问题出发设计解决方案
*   如何提高缓存的稳定性：需要综合缓存的优缺点，在数据一致性，读写速度等方面考虑方案
*   错误快速定位能力：针对各个阶段的错误，设计错误上报模块，需要做到不多报、不误报、不漏报
*   完善的日志模块：以**本地回捞日志**（储存于客户端，需要时通过指令上报的debug日志）为主，减少服务端压力，尽量保证日志的信息量足
*   缓存库新老切换成本：AB 切换成本，新老缓存迁移成本，各指标定义等
*   业务拓展性：针对数据源，缓存类型等，给业务提供拓展点
*   业务接入成本：内置通用方案，降低接入成本

通过各方调研，跨端缓存方案有些类似回写模式，但是需要着重关注回写的缺点。

### 问题解决方案

> 从缓存的回写模式缺点出发
> 
> 1.  保证数据一致性：保证内存缓存、引擎、磁盘缓存数据一致性
> 2.  不提供任何 I / O 直接访问缓存的方法给业务方

#### 因缓存库导致的后台崩溃 / 主线程卡死问题

*   线程模块设计 - 设计线程池，保证 I / O 操作/耗时操作都在次线程完成
*   下载更新模块 - 以保证数据一致性为核心，责任链模块设计，各节点功能原子化，保证耗时操作在次线程完成
*   数据库模块设计 - 统一管理，FMDB Queue

#### 降级错误 / 加载失败 / 页面空白 / 卡片模块消失空白 / unregister module等引擎错误

*   同步数据库时机 - 完全成功后同步，保证磁盘缓存必是可用的
*   数据库模块 - 支持事务，可 Fallback，保证出错时可回退
*   缓存多版本并存 - 保证本地 Bundle 缓存互不干扰
*   引用计数模块 - 用于清空缓存，保证使用中的缓存不被提前清空
*   接口修改
    *   删除对外提供清空缓存的接口 - 避免业务方随意删除缓存
    *   删除对外提供直接读取本地磁盘的接口 - 避免业务方随意读取缓存
*   责任链 Runner - 优先级队列，优先保证正在加载的页面加载速度
*   数据库/文件迁移 - 保证新版本兼容老版本数据，避免重复下载
*   接口 CDN 迁移
*   网络模块强行使用 https ，防拦截

#### 有效快速定位问题

*   日志模块设计
*   整体监控错误日志 - 自定义 Domain ，方便区分各个阶段，方便归因
*   删除冗余日志
*   结合加载流程做到异常信息细化，形成闭环

### 方案设计

![fangan](/images/jueJin/f4e36756542d467.png)

### 业务接口层

对业务方而言，主要是面向业务接口层开发，设计的初衷为了减少接入的难度，使接口可控，不让业务方随意访问磁盘等，如何设计这一层非常关键，对业务方来说，他们只要知道他们需要做什么，以及能够得到什么，我们的想法是这一层应该具备以下几点：

*   初始化参数 CacheConfig ：缓存名，缓存根目录，其他自定义参数

```less
@interface NEMichelinCacheConfig : NSObject

- (instancetype)initWithAppName:(NSString *)appName
cacheRootPath:(NSString *)cacheRootPath
xxx
@end
```

*   DataProvider协议 - 业务方只需要实现一个接口即可正常使用缓存功能

```objectivec
- (void)fetchBundleCacheResWithLocalApps:(NSArray<NEMCAppInfo *> *)apps
completionHandler:(void (^)(NSArray<NEMichelinResVersionInfo * > *infoList, NSError *error))completionHandler;
```

*   缓存更新接口

```erlang
- (void)updateResourceOfAppInfo:(id<NEMCAppInfo *>)appInfo
priority:(NEMichelinSerialChainPriority)priority
completeBlock:(void (^)(NSError *error, NSDictionary *result))completeBlock;
```

*   自定义缓存 / 数据协议 - 只有在特殊自定义缓存时，需要特殊实现

除了业务需要关心的以上接口外，此层中处理了：新老缓存库 AB 切换，内部协议定义，其他自定义接口预留等

### 责任链模块

![zerenlian](/images/jueJin/4496b6cc441141d.png)

*   拆分**前置判断**，**下载**，**MD5 校验**，**zip / gz 解压**，**合并**，**tar 解压**，**更新缓存**节点等，颗粒度细化
*   自定义链路能力
    *   可删除，增加节点
*   支持暂停 pause，继续 resume 能力
*   全局 Context 传递
*   失败异常抛出能力 - 节点执行失败后，中断执行，用于收集异常
*   生命周期监听能力 - 支持各个节点开始与结束生命周期监听
*   节点职责单一(只负责自己模块，谁创建，谁释放(包括本地临时文件))
*   逻辑内聚，只依赖数据 ：节点自行判断 Context 数据，节点间不相互依赖。

责任链模块的设计，为后续日志模块，错误模块设计打下了良好基础，可以方便在这个设计下收集各个模块的日志，以及删除冗余日志，错误也可以及时抛出，不会出现重复抛出的情况，也为后面跨端APM数据收集打下了基础，可以方便的在各个节点间插桩，减少了APM建设的工作量。最重要的收益是提升了稳定性，降低的出错可能性，各个节点完全掌控自己的**临时变量**，不会出现漏删文件，变量等情况。

### 责任链 Runner

*   优先级队列能力
*   支持一个key对应多个责任链
*   责任链缓存能力

主要为了支持优先级队列的能力，可以让优先级高的链插队，有效提升缓存速度。

### 解压/合并模块

![jieya](/images/jueJin/043ea6ee0b124e2.png)

*   抽离 zip，tar，gz 解压，压缩，合并能力
*   可自定义配置 zip，tar，gz 压缩包解压库能力
*   减少对三方库的依赖，可任意替换三方库

### 数据库

![shujuku](/images/jueJin/75247f71d9a440b.png)

*   FMDB 替换 sqlite3
*   使用事务
*   数据迁移
*   数据校验
*   出错回滚

### 多版本并存

*   AppInfo：相当于缓存描述，里面有 Bundle 文件路径
*   Bundle文件：RN 读取的 JS Bundle文件

#### 为什么要做多版本并存？

![duobanben](/images/jueJin/3a5514d51d4741d.png) 根据上图可以看出，AppInfo 读取时机跟引擎加载本地 Bundle 文件的时机是不一致的，所以有可能读取的 AppInfo 中的本地缓存路径已经被更改，从而导致不可预估的问题。

#### 多版本

![duobanb](/images/jueJin/d4609cc8991841c.png) 为了保证数据的一致性，就出现了多版本共存的情况，简单理解是同一个版本，在使用期间，数据库、内存、文件都不会被删除，也不会被覆盖。这样操作不就会导致磁盘缓存无限放大么？所以我们就想到了通过引用计数的方式删除冗余缓存。

### 引用计数 - 本地 Bundle 缓存清理时机

![yinyongjishu](/images/jueJin/bd11fb5d8483498.png)

*   Bridge 创建时，Bridge 对应的本地缓存会被引用持有
*   直到所有的 Bridge 被释放时，就会做本地缓存清理操作
*   本地缓存清理操作是悲观操作，也会校验是否是最新缓存，是否在使用

### 总结

#### 数据统计

CCCandyWebCache（老缓存库）

NEMichelinCache

结论

md5 校验成功率

97%

100%

上升3%

降级错误

\*\*\* W

\*\*\* W

下降94%

xcode 获取 wakeup 导致的 crash

22年6月份：最高到近 70% 的量；去年一年：Top10中占了3个

0

下降 100%

ANR

抽样卡死 104 次，影响 94 用户

暂未发现

下降 100%

卡顿

抽样卡顿 46061 次，影响 2519 用户

卡顿事件 3 个

下降 99%

CPU 异常

抽样数量 100+

暂未找到

下降 100%

OOM

抽样错误量 236 ，影响用户 67

暂未找到

下降 100%

引擎错误

9000+

481

下降 94%

24 小时升级率

Vip(96.43%)，Square(75.25%)

Vip(98.21%), Square(96.78%)

升级率上升 2% 到 20% 不等

除了以上模块，我们对错误通过 Domain 定义进行了详细分类，日志模块以云音乐自研的 Corona 平台，本地回捞等手段进行了详细监控，网络模块以网络库作为基础，支持了断点续传等能力。目前新库已在云音乐 RN 模块全量使用，错误率下降非常明显，后面将持续替换H5缓存，DSL 模版缓存等。

### 参考资料

*   [Write Through and Write Back in Cache](https://link.juejin.cn?target=https%3A%2F%2Fwww.geeksforgeeks.org%2Fwrite-through-and-write-back-in-cache%2F "https://www.geeksforgeeks.org/write-through-and-write-back-in-cache/")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！