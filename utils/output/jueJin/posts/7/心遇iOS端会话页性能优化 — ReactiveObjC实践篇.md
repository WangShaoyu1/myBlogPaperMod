---
author: ""
title: "心遇iOS端会话页性能优化 — ReactiveObjC实践篇"
date: 2023-05-04
description: "本文将举例心遇会话页已知的性能问题，分析实现弊端，最后通过引入 ReactiveObjC 来更优雅的解决问题。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:24,comments:9,collects:45,views:8598,"
---
> 本文作者：[尚尧](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fu%2F38f5c5bd3849 "https://www.jianshu.com/u/38f5c5bd3849")

一、背景
====

心遇作为一款社交产品，消息会话页必定是用户使用量最大的页面之一，因而会话页的用户体验将尤为重要。同时，心遇有着陌生人社交属性，用户的会话量动辄上万，会话页也面临着较大的性能挑战。因此，会话页的性能优化既是重点，也是难点。

本文将举例会话页已知的性能问题，分析实现弊端，最后通过引入 ReactiveObjC 来更优雅的解决问题。

二、 ReactiveObjC 简介
==================

ReactiveObjC 是一个基于响应式编程 (Reactive Programming) 范式的开源框架了，它结合了函数式编程、观察者模式、事件流处理等多种编程思想，从而让开发者更加高效地处理异步事件和数据流。其核心思路是将事件抽象成一个个信号，再根据需求对信号进行组合操作，最后订阅处理信号。通过使用 ReactiveObjC ，写法上由命令式改为声明式，使得代码的逻辑变得更紧凑清晰。

三、实践
====

场景一：会话数据源处理存在的问题
----------------

### 问题分析

心遇会话页如图所示：

![](/images/jueJin/f4d0c0d36e1fc1a.png)

会话页的数据源来源于 `DataSource` 。`DataSource` 维护着一个有序的会话数组，内部监听着各种事件，比如会话更新、会话草稿更新、置顶会话变更等等。当触发事件后， `DataSource` 可能会重新绑定会话外显消息、过滤、排序会话数组，最后通知最上层业务侧刷新页面。结构图如下：

![](/images/jueJin/6bb1fce08d255d8.png)

部分实现代码如下：

```ini
// 会话变更的IM回调
    - (void)didUpdateRecentSession:(NIMRecentSession *)recentSession {
    // 更新会话的外显消息
    [recentSession updateLastMessage];
    // 过滤非自己家族的会话
    [self filterFamilyRecentSession];
    // 重新排序
    [self customSortRecentSessions];
    // 通知观察者数据变更
    [self dispatchObservers];
}

// 置顶数据变更
    - (void)stickTopInfoDidUpdate:(NSArray *)infos {
    self.stickTopInfos = infos;
    
    [self customSortRecentSessions];
    [self dispatchObservers];
}

// 草稿箱变更
    - (void)dartDidUpdate {
    [self customSortRecentSessions];
    [self dispatchObservers];
}

// 家族数据变更
    - (void)familyInfoDidUpdate {
    [self filterFamilyRecentSession];
    [self customSortRecentSessions];
    [self dispatchObservers];
}
```

这里需要解释的是 `[recentSession updateLastMessage]` 的调用。由于心遇的业务需要，部分消息是不需要外显到会话页的。因此当收到一条新消息时，需要重新更新该会话的外显消息。外显消息的更新逻辑如下：

*   第1步、通过 IMSDK 的接口同步获取会话最新的消息列表
*   第2步、倒叙遍历消息数组，找到最新的可外显的消息
*   第3步、更新会话的外显消息

其中，由于第一步的消息列表获取是同步 DB 操作，因此有阻塞当前线程的风险。当频繁接收到新消息时，可能会引起严重掉帧的问题。

同时， `filterFamilyRecentSession` 和 `customSortRecentSessions` 方法在内部会遍历会话数组，虽然时间复杂度是 O(n) ，但是当会话量大且回调进入频繁时，也会有一定的性能问题。

而在写法上，这里大量采用委托的方式，逻辑分散在各个回调中，可读性较差。同时每个回调中的逻辑又是类似的，代码冗余。

总结一下问题关键点：

*   主线程存在大量的耗性能操作，造成卡顿。
    
*   事件回调多，逻辑分散，可读性差，不好维护。
    

### 解决方案

解决方案：

*   将各种事件回调抽象成信号，进行 `combine` 组合操作，解决逻辑分散问题。
    
*   将耗性能操作移到子线程中，并抽象成异步信号，解决卡顿问题。
    
*   对组合信号使用 `flattenMap` 操作符，内部返回异步信号，最终生成结果信号供业务使用。
    

下面将按照方案，通过 ReactiveObjC 来一步步解决问题。

首先按照其核心思想，将上述的事件抽象成信号。以 `familyInfoDidUpdate` 回调为例，可以通过库提供的 `- (RACSignal<RACTuple *> *)rac_signalForSelector:(SEL)selector` 方法将委托方法转换成信号。当然，更好的做法是家族资料管理类直接提供一个信号给外部使用，这样外部就不需要再去封装信号了。

```ini
RACSignal <RACTuple *> *familyInfoUpdateSingal = [self rac_signalForSelector:@selector(familyInfoDidUpdate)];
```

再以会话数组为例，考虑到外显消息的更新是个耗时操作，因此先不处理，将源数据的变更先封装成信号 `originalRecentSessionSignal` 。

```ini
    - (void)didUpdateRecentSession:(NIMRecentSession *)recentSession {
    NSArray *recentSessions = [self addRecentSession:recentSession];
    self.recentSessions = recentSessions;
}

RACSignal <NSArray <NIMRecentSession *> *> *originalRecentSessionSignal = RACObserve(self, recentSessions);
```

现在，所有的回调事件都已经抽成信号了。由于这些信号均会触发过滤、排序等一系列操作，因此可以将信号进行组合 `combine` 处理。

![](/images/jueJin/e683b7c3396df32.png)

```ini
RACSignal <RACTuple *> *familyInfoUpdateSingal = [self rac_signalForSelector:@selector(familyInfoDidUpdate)];
RACSignal <NSArray <NIMRecentSession *> *> *originalRecentSessionSignal = RACObserve(self, recentSessions);
...

RACSignal <RACTuple *> *combineSignal = [RACSignal combineLatest:@[originalRecentSessionSignal, stickTopInfoSignal, familyInfoUpdateSingal, stickTopInfoSignal, draftSignal, ...]];
    [combineSignal subscribeNext:^(RACTuple * _Nullable value) {
    // 响应信号
    // 更新外显消息、过滤、排序等操作
    }];
```

`combine` 后的新信号 `combineSignal` 将会在任一回调事件触发时，通知信号的订阅者。同时该信号的类型为 `RACTuple` 类型，里面是各个子信号上一次触发的值。

![](/images/jueJin/e194ef6aa01936f.png)

到目前为止，已经将分散的逻辑集中到了 `combineSignal` 的订阅回调里。但是性能问题依旧没有解决。解决性能问题最方便的操作就是将耗时操作放到子线程中，而 ReactiveObjC 提供的 `flattenMap` 函数能让这一异步操作的实现更为优雅。

![](/images/jueJin/709b4f618835832.png)

通过龙珠图不难发现， `flattenMap` 可以将一个原始信号 A 通过信号 B 转换成一个 新类型的信号 C 。在上面的例子中， `combineSignal` 作为原始信号 A ，异步处理数据信号作为信号 B ，最终转换成了结果信号 C ，即 `recentSessionSignal` 。具体代码如下：

```objectivec
    RACSignal <NSArray <NIMRecentSession *> *> *recentSessionSignal = [[combineSignal flattenMap:^__kindof RACSignal * _Nullable(RACTuple * _Nullable value) {
    // 从tuple中拿出最新数据，传入
    return [[self flattenSignal:orignalRecentSessions stickTopInfo:stickTopInfo] deliverOnMainThread];
    }];
    
        - (RACSignal *)flattenSignal:(NSArray *)orignalRecentSessions stickTopInfo:(NSDictionary *)stickTopInfo {
            RACSignal *signal = [RACSignal createSignal:^RACDisposable * _Nullable(id<RACSubscriber>  _Nonnull subscriber) {
                dispatch_async(self.sessionBindQueue, ^{
                //  先处理：更新外显消息、过滤排序
                NSArray *recentSessions = ...
                //  后吐出最终结果
                [subscriber sendNext:recentSessions];
                [subscriber sendCompleted];
                });
                return nil;
                }];
                return signal;
            }
```

至此，该场景下的问题已优化完毕。再简单总结下信号链路：每当任一事件回调，都会触发信号，进而派发到子线程处理结果，最终通过结果信号 `recentSessionSignal` 吐出。完整信号龙珠图如下：

![](/images/jueJin/a4c8d89281ffb55.png)

场景二：会话业务数据处理存在的问题
-----------------

### 问题分析

由于业务隔离，会话的业务数据（比如用户资料）需要请求业务接口去获取。

对于这段业务数据的获取逻辑，心遇是通过 `BusinessBinder` 去完成的，结构图如下：

![](/images/jueJin/f3d5880fa59a76c.png)

`BusinessBinder` 监听着数据源变更的回调，在回调内部做两件事：

*   过滤出内存池中没有业务数据的会话，尝试从 DB 中获取数据并加载到内存池。
    
*   过滤出没有请求过业务数据的会话，批量请求数据，在接口回调中更新内存池并缓存。
    

业务层在刷新时，通过 id 从内存池中获取对应的业务数据：

![](/images/jueJin/529bd6dd6969791.png)

部分实现代码如下：

```ini
    - (void)recentSessionDidUpdate:(NSArray *)recentSessions {
    // 尝试从DB中加载没有内存池中没有的Data
        NSArray *unloadRecentSessions = [recentSessions bk_select:^BOOL(id obj) {
        return ![MemoryCache dataWithKey:obj.session.sessionId];
        }];
            for (recentSession in unloadRecentSessions) {
            Data *data = [DBCache dataWithKey:recentSession.session.sessionId];
            [MemoryCache cache:data forKey:recentSession.session.sessionId];
        }
        
        // 批量拉取未请求过的Data
            NSArray *unfetchRecentSessionIds = [[recentSessions bk_select:^BOOL(id obj) {
            return obj.isFetch;
                }] bk_map:^id(id obj) {
                return obj.session.sessionId;
                }];
                [self fetchData:unfetchRecentSessionIds ];
            }
            
                - (void)dataDidFetch:(NSArray *)datas {
                // 在接口响应回调中缓存
                    for (data in datas) {
                    [MemoryCache cache:data forKey:data.id];
                    [DataCache cache:data forKey:data.id];
                }
            }
```

由于和场景一类似，这里不做过多分析。简单总结下问题关键点：

*   `DataCache` 的读写操作以及多处遍历操作均在主线程执行，存在性能问题。

### 解决方案

由于场景二中的操作符在场景一中已详细介绍过，因此场景二会跳过介绍直接使用。场景二的核心思路和一类似：

*   将耗时操作异步处理，并抽象成信号。
    
*   将源信号、中间信号组合、操作，最终生成符合预期的结果信号。
    

首先， `DataCache` 的读取操作以及接口的拉取操作其实可以理解为同一行为，即数据获取。因此可以将这一行为抽象成一个异步信号，信号的类型为业务数据数组。触发该信号的时机为会话数据源变更。龙珠图如下：

![](/images/jueJin/6f0af43b692c0f4.png)

图中的新信号 `Data Signal` 即为业务数据获取信号。该信号由场景一中的 `Sessions Signal` 通过 `flattenMap` 操作符转变而来，在 `flattenMap` 内部去异步读取 `DataCache` ，请求接口。由于可能存在DB无数据或接口未获取到数据的情况，因此可以给 `Data Signal` 进行一次 `filter` 操作，过滤掉数据为空情况。

![](/images/jueJin/d1e4d66ee217be7.png)

其次按照上述分析的逻辑，当会话变更时，会从 `DataCache` 中获取数据并更新内存池；当业务数据获取到时，也需要更新内存池。因此，可以将 `Sessions Signal` 和 `Data Signal'` 进行组合操作。

![](/images/jueJin/f87eff20168a1d0.png)

现在，每当会话变更或业务数据获取到，都会触发组合后的新信号 `Combine Signal` 。最后，通过 `flattenMap` 异步获取 `DataCache` 数据并更新内存池，生成结果信号 `Result Signal` 。

![](/images/jueJin/cd908c0f442c06a.png)

至此，最终信号 `Result Signal` 即为业务数据数据获取完毕并更新内存池后的信号。上层业务通过订阅该信号即可获取到业务数据获取完毕的时机。完整的龙珠图如下：

![](/images/jueJin/a5e2416021f2c16.png)

四、小结
====

上述场景对于 ReactiveObjC 的使用只不过是冰山一角。它的强大之处在于通过它可以将任意的事件抽象成信号，同时它又提供了大量的操作符去转换信号，从而最终得到你想要的信号。

不可否认，诸如此类的框架的学习曲线是较陡的。但当真正理解了响应式编程思想并熟练运用后，开发效率必定会事半功倍。

五、参考文献
======

\[1\] [github.com/ReactiveCoc…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FReactiveCocoa%2FReactiveObjC "https://github.com/ReactiveCocoa/ReactiveObjC")

\[2\] [reactivex.io/documentati…](https://link.juejin.cn?target=https%3A%2F%2Freactivex.io%2Fdocumentation%2Foperators.html "https://reactivex.io/documentation/operators.html")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！