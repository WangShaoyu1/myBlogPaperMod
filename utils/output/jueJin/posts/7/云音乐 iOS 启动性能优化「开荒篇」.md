---
author: ""
title: "云音乐 iOS 启动性能优化「开荒篇」"
date: 2022-09-21
description: "云音乐 iOS 启动性能优化实践，从分析 App 启动现状瓶颈到对 App 治理实践，本文介绍了云音乐 iOS 如何从动态库、+load、二进制重排、业务层面代码等各方面治理实践的过程。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读34分钟"
weight: 1
selfDefined:"likes:49,comments:0,collects:91,views:6774,"
---
> 本文作者：Lazyyuuuuu

一.背景
----

  App 启动作为用户使用应用的第一个体验点，直接决定着用户对 App 的第一印象。云音乐作为一个有着近10年发展历史的 App，随着各种业务不停的发展和复杂场景的堆叠，不同的业务和需求不停地往启动链路上增加代码，这给 App 的启动性能带来了极大的挑战。而随着云音乐用户基数的不断扩大和深度使用，越来越多的用户反馈启动速度慢，况且启动速度过慢更甚至会降低用户的留存意愿。因此，云音乐 iOS App 急需要进行一个专项针对启动性能进行优化。

二.分析
----

### 2.1 启动的定义

  大家都知道在 iOS13 之后，苹果全面将 dyld3 替代之前的 dyld2[1](#user-content-fn-1 "#user-content-fn-1")，并且在 dyld3 中增加了启动闭包的概念，在下载/更新 App、系统更新或者重启手机后的第一次启动 App 时创建。所以 iOS13 前后对冷启动的概念会有所区别。

##### iOS13之前：

*   冷启动：App 点击启动前，系统中不存在 App 的进程，用户点击 App，系统给 App 创建进程启动；
*   热启动：App 在冷启动后用户将 App 退回后台，App 进程还在系统中，用户点击 App 重新返回 App 的过程；

##### iOS13及之后：

*   冷启动：重启手机系统后，系统中没有任何 App 进程的缓存信息，用户点击 App，系统给 App 创建进程启动；
    
*   热启动：用户把 App 进程杀死，系统中存在 App 进程的缓存信息，用户点击 App，系统给 App 创建进程启动；
    
*   回前台：App 在启动后用户将 App 退回后台，App 进程还在系统中，用户点击 App 重新返回 App 的过程；
    

  在云音乐 App 启动治理过程中始终以 iOS13 之后的冷启动为对齐标准，不管是以用户视角测量的启动时间还是用 Instrument 中 App Launch 测量的启动时间都是在手机重启后进行的。

### 2.2 冷启动的定义

  一般而言，大家把 iOS 冷启动的过程定义为：从用户点击 App 图标到启动图完全消失后的第一帧渲染完成。整个过程可以分为两个阶段：

*   T1 阶段：main() 函数之前，包括系统创建 App 进程，加载 MachO 文件到内存，创建启动闭包，再到 dyld 处理一系列的加载、符号绑定、初始化等工作，最后跳转到执行 main() 之前。
    
*   T2 阶段：跳转到 main() 函数之后，开始执行 App 中 UI 场景的创建以及 Delegate 相关生命周期方法，到完成首屏渲染的第一帧。 整体流程如下图所示：
    
    ![](/images/jueJin/c1d3b3ed555f44b.png)
    

  本文如涉及到时间相关一般是以系统为 14.3 的 iPhone 8 Plus 作为基准测试设备，并且在 Debug 模式下。

### 2.3 冷启动的过程

  从冷启动的定义后我们可以把整个冷启动的过程分为 T1 和 T2 两个过程，iOS 系统在两个过程中分别会在不同的节点进行相应的处理和代码的调用，后续可以针对这两个过程分别进行治理优化。

  T1 阶段启动过程如下图所示： ![](/images/jueJin/3362bcb5c0e44a9.png)

  从上图所示的流程中，我们可以看到在 T1 阶段更多的是系统在为运行 App 做一些初始化的工作，所以我们能做的就是尽量减少对系统初始化工作的影响。从整个流程看来，启动闭包之后的动态库加载、rebase&bind、Objc Init、+load、static initializer 这几个节点我们是可以做一些针对性的治理和优化工作的。

  T2 阶段启动过程如下图所示：

![](/images/jueJin/0d77709513b348c.png)

  从上图所示的流程中，我们可以看到在 T2 阶段已经基本是属于业务方的代码了，在这个阶段中往往我们会把 Crash 相关、APP 配置信息、AB 数据、定位、埋点、网络初始化、容器预热以及二三方 SDK 初始化等一股脑的塞在里面，而针对这个阶段优化的 ROI 也是相对比较高的。

### 2.4 云音乐的现状

  云音乐作为一个从 2013 年开始推出的 App 有着近 10 年的业务发展和代码堆叠，在此期间对启动性能的关注和治理也比较有限，再加上云音乐除了听歌业务以外还有直播、K 歌等业务集成，所以总体来说整个启动链路上的代码是比较复杂的。甚至由于云音乐自身开屏广告业务的特殊性，在笔者开始着手启动优化专项后发现云音乐的启动红屏由一般 App 的启动开屏页和假红屏两部分组成，整个启动流程如下图所示： ![](/images/jueJin/fa685ca0864d460.png)

#### 2.4.1 T1阶段各情况分析

##### 动态库

  从WWDC2022[2](#user-content-fn-2 "#user-content-fn-2")我们也知道一个 App 中动态库的数量是会影响整个 T1 阶段的耗时的，因此我们一是需要知道目前动态库对整个 T1 阶段耗时的影响，二是需要知道有哪些动态库造成了影响并且是可以优化的。通过 Xcode 提供的环境变量`DYLD_PRINT_STATISTICS`我们可以大致的知道所有动态库在 T1 阶段的耗时，如下图所示：

![](/images/jueJin/092837e360804ce.png)

  从 Xcode 输出的结果可以看到，动态库加载的耗时占整个 pre-main 的比例还挺高的。这个时候我通过解压云音乐线上 IPA 包发现 Frameworks 目录下动态库的数量有 16 个之多。

##### +load方法

  iOS 开发人员对 +load 方法应该已经很熟悉了，因为 +load 方法提供了一个比较早的时机能够让我们前置去执行一些基础配置的代码、注册类代码或者方法交换等代码。也正是由于这个原因，我们在不停的业务迭代中发现大家想要找一个早一点的时机就会想到去用 +load 方法，导致项目中 +load 过多，严重影响启动性能，云音乐工程也有这样的问题，下面我们来看下对 +load 方法使用情况的分析。

  我们知道对于实现了 +load 方法的类和分类会在编译时被写入到 MachO 中`__DATA`段的`__objc_nlclslist`和`__objc_nlcatlist`两个 section 中。因此，我们可以通过`getsectbynamefromheader`方法把定义了 +load 的所有的类和分类捞取出来，如下图所示：

![](/images/jueJin/190bc82274a2454.png)

  当然当我们知道了所有定义了 +load 的类和分类以后，更想知道这些 +load 的耗时情况，这样好方便我们优先优化耗时高的那部分 +load 方法。我们想到的是 Hook +load 方法，而要能够 Hook 所有的 +load 方法肯定是需要在最早的时机去 Hook，那么实现一个动态库，并且在动态库的 +load 中去 Hook 是最好的时机了，同时也要保证这个动态库是最先加载的动态库，如下图所示：

![](/images/jueJin/fff7b4599fb94ce.png)

  由于云音乐工程已经用 Cocoapods 来实现组件化，所以只需要创建以 AAA 名称开头的仓库就可以了，如 AAAHookLoad，并且在 Podfile 中引入对应的仓库，就能实现动态库最先加载，这里可以参照开源库 A4LoadMeasure[3](#user-content-fn-3 "#user-content-fn-3")。如果还是单工程则取什么名称都可以，只需要在工程设置`Build Phases=>Link Binary With Libraries`中把对应的库移到第一个位置就可以，如下图所示：

![](/images/jueJin/6608f288f9a14e6.png)

  经过 Hook +load 方法后，我们发现在云音乐工程中竟有接近 800 处调用，并且整个耗时达到了 550ms+ 的级别，可见 +load 方法的乱用对整个启动性能的影响有多大。

##### static initializer

  对于同一个二进制文件来说执行完 +load 方法就会进入 static initializer 阶段，一般来说一个以 OC 为主开发语言的 App 相对比较少的会去用到 static initializer 的代码，但也不排除有些底层库会用到。以下几种代码类型会导致静态初始化：

*   C/C++ 构造函数`__attribute__((constructor))`，如：

```scss
    __attribute__((constructor)) static void test() {
    NSLog(@"test");
}
```

*   非基本类型的 C++ 静态全局变量，如：

```c
    class Test1 {
    static const std::string testStr1;
    };
    const std::string testStr2 = "test";
    static Test1 test1;
```

*   需要运行时进行初始化的全局变量，如：

```csharp
    bool test2 () {
    NSLog(@"is a test func");
    return false;
}
bool g_testFlag = test2();
```

  其实我们可以看到，不能在编译期间确定值的全局变量的初始化都可以认为是在这个阶段执行的。 对于 static initializer 的分析来说，MachO 中`__DATA` 段的`__mod_init_func`这个 section 中存储着初始化相关的函数地址。跟 +load 一样，我们只需要 Hook 掉对应的函数指针就能获取到对应函数的耗时。在云音乐工程中 static initializer 相关函数比较少，且耗时也不明显，这块就没有重点去关注。

##### Page In的影响

  当用户点击 App 启动的时候，系统会创建进程并为进程申请一块虚拟内存，虚拟内存和物理内存是需要映射的。当进程需要访问的一块虚拟内存页还没有映射对应的物理内存页时，就会触发一次缺页中断 Page In。这个过程中会发生 I/O 操作，将磁盘中的数据读入到物理内存页中。如果读入的是 Text 段的页，还需要解密，并且系统还会对解密后的页进行签名验证。所以，如果在启动过程中频繁的发生 Page In 的话，Page In 引起的 I/O 操作以及解密验证操作等的耗时也是影响很大的。需要注意的是，iOS13 及以后苹果对这个过程进行了优化，Page In 的时候不再需要解密了。

  Page In 的具体情况我们可以通过 Instruments 中的 System Trace 工具来分析，其中找到 Main Thread 进程，再选择 Summary:Virtual Memory 选项，下面看到的 File Backed Page In 就是对应的缺页中断数据了，从数据上看Page In对云音乐的影响并非瓶颈，如下图所示：

![](/images/jueJin/eb7f3e6fdd7e412.png)

#### 2.4.2 T2阶段情况分析

  T2 阶段主要是 Main 之后的方法执行，要分析这个阶段可以用到两个工具，一个是 Hook objc\_msgSend 函数后输出对应的火焰图，另一个是利用苹果提供的 Instruments 中的 App Launch 工具分析整个启动流程。通过这两个工具我们可以从时间线、方法调用堆栈、不同线程的执行状态等各个细节点入手找到需要优化的点。

  火焰图（Flame Graph）是由 Linux 性能优化大师 Brendan Gregg 发明的，和所有其他的 profiling 方法不同的是，火焰图以一个全局的视野来看待时间分布，它从顶部往底部，列出所有可能导致性能瓶颈的调用栈。

##### Hook objc\_msgSend生成火焰图

  我们知道 OC 是一种动态语言，所有运行时的 OC 方法都会通过 objc\_msgSend 来完成执行，objc\_msgSend 会根据传入的对象和对应方法的 selector 去查找对应的函数指针执行。所以，我们只要通过 Hook 掉 objc\_msgSend ，并且在原方法前后加入耗时统计代码再执行原方法就能得到对应的方法名以及耗时。一般想到要 Hook objc\_msgSend 就会想到是 fishhook，由于 objc\_msgSend 使用汇编实现的，所以用 fishhook 去 hook 的话还要处理寄存器的数据现场。其实通过 HookZz[4](#user-content-fn-4 "#user-content-fn-4") 这个库也可以 hook objc\_msgSend 并且比 fishhook 更方便。

  这里我们通过开源库 appletrace[5](#user-content-fn-5 "#user-content-fn-5") 来实现对 objc\_msgSend 方法性能的分析以及火焰图的生成，样式如下图所示：

![](/images/jueJin/f08b4efd538b4ef.png)

##### Instruments中App Launch工具分析

  通过分析生成的火焰图数据与实际 Debug 调试发现火焰图上对应方法的耗时也不是特别精确，会有一定的误差，但是相对占比还是能够反映出相应方法在整个 T2 阶段的影响的。同时，火焰图只能看到整个启动链路的时间线以及方法调用栈，线程间的状态还是不够直观，也缺乏 C/C++ 相关方法性能的检测，并且火焰图对每个具体阶段的描述也是缺乏的。这个时候就需要用到 Instruments 的 App Launch 工具再来分析一遍。

  Xcode 自带 Instruments 一系列的分析工具，而 App Launch 分析后会把整个启动链路的各个阶段详细展示，通过对各个阶段区间的划分可以很方便的找到每个阶段主线程的性能瓶颈以及多线程的状态，如下图所示： ![](/images/jueJin/956fc62a9a434eb.png)

![](/images/jueJin/5326ddb8d327442.png)

#### 2.4.3 广告业务现状

  在上面提到云音乐存在假红屏的现象，而这个假红屏就是由广告业务产生。在咨询了广告业务相关同学后得知，云音乐这边的广告业务是去实时请求后实时展示的，所以在请求之前展示假红屏页面，直到等待接口数据返回后假红屏消失，后续展示广告或者进入首页。进一步了解后知道，实时请求是因为广告业务需要去外部广告联盟拉取实时广告，然后根据业务情况再去分发广告。由于网络的波动和响应时间的存在，广告业务对启动性能的影响还是比较大的，整体流程如下图所示：

![](/images/jueJin/527f63dd205149b.png)

三.实践
----

### 3.1 T1阶段治理

#### 3.1.1 动态库治理

  动态库数量的增多不仅会影响系统创建启动闭包的时间，同时也会增加动态库加载阶段的耗时，苹果官方对于动态库数量的建议是保持在 6 个以内。而云音乐目前共有 16 个动态库，可见压力之大。对于动态库的治理，主要有以下几种方式：

*   动态库转静态库，推荐以这种方式治理，还能优化包大小；
*   合并动态库，由于动态库的提供方有三方也有二方，要让几方一起处理实操难度很大；
*   动态库懒加载，这种方式的收益很明显，但是需要各业务方改造并且统一入口；

  云音乐在动态库的治理当中还是主张把动态库转成静态库，更适合一个应用的长远发展。在动态库转静态库的过程中发现很多的动态库是因为需要用到 OpenSSL，而工程中已经有库用到 OpenSSL 了会导致符号冲突，所以不得己做成了动态库，对于这种情况首先就是找到 OpenSSL 符号冲突的库，其次是全工程统一 OpenSSL 版本。

#### 寻找 OpenSSL 符号冲突原因

  通过集成 OpenSSL 静态库以及把一个动态库转成静态库后发现由于部分符号在链接的时候没有正确链接，导致运行时崩溃。查找到对应的符号为 \_RC4\_set\_key，通过 LinkMap 发现 \_RC4\_set\_key 链接到了公司内部二方 SDK。

  打开 LinkMap.txt 文件首先查找到 \_RC4\_set\_key 符号，然后看到前面对应的 file 所在的序号为 2333，如下图：

![](/images/jueJin/d317154d2bf444d.png)

接着我们可以从 LinkMap 上方的 Object files 区块找到对应序号的文件，发现正是云信的 IM SDK，如下图所示：

![](/images/jueJin/adc392c6dee6443.png)

由于云音乐工程依赖了云信 4 个动态库，所以我们查看了 4 个库的符号，发现有两个库都有依赖 OpenSSL。下面我们要做的工作就是使 OpenSSL 符号正确的链接到云音乐自己的 OpenSSL 库。

##### 解决OpenSSL符号链接问题

  通过查看工程配置发现，OpenSSL 符号的链接顺序跟 Other Linker Flags 中的顺序有关，而 Other Linker Flags 中的顺序是根据 Cocoapods 中 Pods 的 xcconfig 中 OTHER\_LDFLAGS 的顺序来的。经过实际修改 xcconfig 中 OTHER\_LDFLAGS 的顺序验证 OpenSSL 符号的链接问题得到解决。据此，有两种方法能解决 OpenSSL 符号连接问题：

*   通过修改 Podfile 在链接阶段优先链接白名单内的库；
*   让除了 OpenSSL 库以外的其他动态库隐藏相关的 OpenSSL 符号； 在考虑了后续长远发展以及避免后续链接存在隐患，我们选择了第二种方法，让云信导出自身库的时候都隐藏第三方库的符号。

  经过 OpenSSL 符号的统一，我们把相关的 4 个动态库转成了静态库。同时，我们移除了一个已经不在用到的动态库。有 3 个库由于 ffmpeg 相关符号冲突并且涉及面较广作为长期目标优化。依赖的一个迅雷网络库作为下次优化目标。动态库这一块目前总的优化 5 个，收益有 200ms 左右。

#### 3.1.2 +load方法治理

  从原则上来说，我们在开发过程中不应该使用 +load，很多大厂在建立规范后也都禁用掉了 +load 方法。+load 方法的影响如下：

*   +load 的运行时机非常靠前，应用 Crash 检测 SDK 的初始化工作都还没完成，一旦 +load 中的代码出现问题，SDK 都没法捕获相应的问题；
    
*   +load 的调用顺序和对应文件的链接顺序相关，如果有一些注册业务写在其中，而当其他 +load 相关业务在获取时，可能注册业务的 +load 还没执行；
    
*   执行 +load 时的代码都是在主线程运行的，应用所有 +load 的运行都会加长整个启动的耗时，而 +load 可以随意在相应的业务类中添加，业务开发无意的代码添加说不定就会造成耗时的严重增加；
    
*   从 Page In 的角度出发，执行一次 +load 不仅需要加载 +load 这个符号，还需要加载其中需要执行的符号，这也增加了不必要的耗时; 针对 +load 方法的优化，主要是采用如下几种方案：
    
    *   删除不必要的代码；
        
    *   +load中代码延迟到 main 之后子线程处理或者首页显示之后；
        
    *   底层库设计专有的初始化 API 统一去初始化；
        
    *   业务代码接口懒加载；
        
    *   改为 initialize 中执行，针对 initialize 中处理需要注意的是分类 initialize 会覆盖主类 initialize 以及有子类后 initialize 执行多次的问题，需要使用 dispatch\_once 来保证代码只执行一次;
        

  在具体分析了云音乐中的部分 +load 方法的用处后发现，云音乐中很多底层库都是通过使用宏定义来在 +load中实现一些注册行为，或者就只提供注册接口，业务使用方就会选择在 +load 中去调用注册接口。针对这种情况，我们优化了几个库的注册方式。通过去中心化注册，集中式统一初始化原则，不仅可以让注册时机统一，也能够更好的管控业务使用方，为以后的监控做铺垫。去中心化注册利用 attribute 特性在编译期间把相应的结构化数据写到 DATA 段指定的 section 中：

```arduino
#define _MODULE_DATA_SECT(sectname) __attribute((used, section("__DATA," sectname) ))
#define _ModuleEntrySectionName   "_ModuleSection"
    typedef struct {
    const char *className;
    } _ModuleRegisterEntry;
    #define __ModuleRegisterInternal(className) \
    static _ModuleRegisterEntry _Module##className##Entry _MODULE_DATA_SECT(_ModuleEntrySectionName) = { \
    #className  \
    };
    
```

同时，我们提供了一个统一初始化的接口，在接口实现中把数据中对应的 section 中捞出来并通过原有接口统一注册：

```ini
size_t dataLength = sizeof(_ModuleRegisterEntry);
    for (id headerItem in appImageHeaders) {
    const ne_mach_header *mach_header = (__bridge const ne_mach_header *)(headerItem);
    unsigned long size = 0;
    void *dataPtr = getsectiondata(mach_header, SEG_DATA, _ModuleEntrySectionName, &size);
        if (!dataPtr) {
        continue;
    }
    size_t count = size / dataLength;
        for (size_t i = 0; i < count; ++i) {
        void *data = &dataPtr[i * dataLength];
            if (!data) {
            continue;
        }
        _ModuleRegisterEntry *entry = data;
        //调用原有注册接口
    }
}
```

针对于原有使用宏定义在 +load 注册的方式，我们另外增加了方法废弃的标注，这样能让业务开发同学在使用过程中感知使用姿势的改变：

```arduino
static inline __attribute__((deprecated("NEModuleHubExport is deprecated, please use 'ModuleRegister'"))) void func_loadDeprecated (void) {}
#define NEModuleHubExport \
+(void)load { \
// 调用原有注册接口\
func_loadDeprecated();  \
}\

```

由于存量 +load 数量太多，我们在第一阶段只针对耗时 2ms 以上的前 30 个重点 +load 方法进行了优化处理，我们会在后续的启动防劣化相关工作中做针对 +load 的监控，并且推动业务方优化治理。

#### 3.1.3 无用代码清理

  从前面的分析章节我们知道，不管是 rebase&bind 还是 Objc Init 阶段，工程中类及分类的代码量都会影响这几个阶段的耗时，尤其是大型 App 中不断发展的业务导致代码量巨多，而很多业务和代码在上线后并没有用到，所以对于这些无用代码的清理也能减少启动耗时。另外，无用代码清理对于包大小的收益更大，云音乐在包大小优化中做了无用代码的清理[6](#user-content-fn-6 "#user-content-fn-6")。

  那么，如何才能找出哪些代码没有被用到呢？一般可以分为静态代码扫描和线上大数据统计两种方式。静态代码扫描还是从 MachO 出发， MachO 中的`_objc_selrefs`和`_objc_classrefs`两个 section 中存储了引用到的 sel 和 class，而在`__objc_classlist`section 中存储了所有的 sel 和 class，通过比较两者数据的差集就可以获取没有被用到的类。而我们知道 OC 是一门动态语言，所以很多类都是运行时调用，在删除类之前需要确保没有被真正地调用。线上大数据统计则采用类元数据中相应的标记为是否被初始化来统计。我们知道，在 OC 中，每个类都有自己的元数据，在元数据中的一个标记位存储着自己是否被初始化，这个标记位不受任何因素影响，只要有被初始化就会打标记，在 OC 的源码中获取标记位的方式如下：

```scss
    struct objc_class : objc_object {
        bool isInitialized() {
        return getMeta()->data()->flags & RW_INITIALIZED;
    }
}
```

但这个方法我们是无法直接调用的，它是 OC 的方法。但是，要知道类的元数据结构是不会变的，所以我们可以通过自己模拟构建类的元数据结构来获取 RW\_INITIALIZED 标记位数据，从而来确定某个类是否已经初始化，代码如下：

```ini
#define FAST_DATA_MASK 0x00007ffffffffff8UL
#define RW_INITIALIZED (1<<29)
    - (BOOL)isUsedClass:(NSString *)cls {
    Class metaCls = objc_getMetaClass(cls.UTF8String);
        if (metaCls) {
        uint64_t *bits = (__bridge void *)metaCls + 32;
        uint32_t *data = (uint32_t *)(*bits & FAST_DATA_MASK);
            if ((*data & RW_INITIALIZED) > 0) {
            return YES;
        }
    }
    return NO;
}
```

通过上面的代码可以获取到某个类是否被初始化过，从而统计应用类的使用情况，进一步通过大数据统计分析哪些类可以清理。通过这种方式，我们统计出数千多个类未被使用，在后续的清理中通过排除 AB 测试及业务预埋等业务侧代码外，我们清理了 300+ 个类。

#### 3.1.4 二进制重排

  从前面对 Page In 的分析知道，在启动过程中过多的 Page In 会产生过多的 I/O 操作以及解密验证操作，这些操作的耗时影响也会比较大。针对 Page In 的影响，我们可以通过二进制重排来减少这个过程的耗时。我们知道进程在访问虚拟内存的时候是以页为单位的，而启动过程中的两个方法如果在不同的页，系统就会进行两次缺页中断 Page In 操作来加载这两个页。而如果启动链路上的方法分散在不同的页的话，整个启动的过程就会产生非常多的 Page In 操作。为了能减少系统因缺页中断产生的 Page In 操作，我们需要做的就是把启动链路上所有用到的方法都排在连续的页上，这样系统在加载符号的时候就可以减少相应的内存页数量的访问，从而减少整个启动过程的耗时，如下图所示：

![](/images/jueJin/0dbd22f0b95046f.png)

  要实现符号的重排，一是需要我们收集整个启动链路上的方法和函数等符号，二是需要生成对应的 order 文件来配置 ld 中的 Order File 属性。当工程在编译的时候，Xcode 会读取这个 order 文件，在链接过程中会根据这个文件中的符号顺序来生成对应的 MachO。一般业界中收集符号的方案有两种：

*   Hook objc\_msgSend，只能拿到 OC 以及 swift @objc dynamic 的符号；
    
*   Clang 插桩，能完美拿到 OC、C/C++、Swift、Block 的符号；
    

  由于云音乐工程已经进行了组件化工作，并且二进制化后全源码编译还有点问题，为了快速验证问题，我们先选择了使用 Hook objc\_msgSend 的方式去收集符号。Hook objc\_msgSend 的方式可以参照上面火焰图生成时的方案。通过 Hook objc\_msgSend 方式收集了启动链路上一万四千多去重后的符号，并且配置主工程 Order File 属性，如下图所示：

![](/images/jueJin/6d6ebe4dbbe7412.png)

在编译完成后通过验证 LinkMap 文件中 #Symbols: 部分符号顺序是否和 order 文件中的符号顺序一致来确定是否配置成功，如下图所示： ![](/images/jueJin/15f4145ed7f64b0.png)

  最后就是二进制重排后的效果验证了，从网上各类文章我们得知 Instruments 中的 System Trace 可以看到相应的效果。重启手机后使用 System Trace 运行程序，直到首页出现后结束运行，找到主线程，并且在左下方选择 Summary:Virtual Memory 就能看到对应的 File Backed Page In 相关的数据了，如下图所示：

![](/images/jueJin/307f0f1ec4b948d.png)

通过多次重启冷启动测试我们发现 System Trace 中 File Backed Page In 的数据并不稳定，且波动范围比较大，二进制重排优化前后数据难以证明有优化效果。我们想到 Instruments 中 APP Launch 可能也有 Page In 相关的数据，于是，从 App Launch 中同样找到 Main Thread 后选择 Summary:Virtual Memory，如下图所示：

![](/images/jueJin/645a15f168b84fa.png)

不同的是，从 App Launch 我们发现 File Backed Page In 的数据量级比 System Trace 大很多，相对也稳定很多，并且 App Launch 可以选择对应的 App LifeCycle 阶段来查看对应的数据，因此我们可以只看第一帧渲染出来之前的数据。经过我们多次的测试比较取平均数发现，优化后只比优化前减少了 50ms 不到。至此，我们十分怀疑二进制重排的效果。分析了下测试条件，发现我们有两个点可以改进，一是苹果对 iOS13 做过优化，所以我们准备了一台 iOS12 的设备进行测试，二是 Hook objc\_msgSend 符号不能全覆盖的问题，所以我们花了点时间修复了工程全源码编译，并且通过 Clang 插桩的形式导出启动链路上的符号。   Clang 插桩主要通过利用 Xcode 自带的 SanitizerCoverage 工具进行。SanitizerCoverage 是 LLVM 内置的一个代码覆盖率检测工具，通过配置，在编译时它能够根据相应的编译配置，在每一个自定义的函数内部插入`__sanitizer_cov_trace_pc_guard`回调函数，通过实现该函数就能在运行时期拿到被插入该函数的原函数地址，通过函数地址解析出对应的符号，从而能够收集整个启动过程中的函数符号。通过在 Other C Flags 中配置`-fsanitize-coverage=func, trace-pc-guard ;`可以收集 C、C++、OC 方法对应的符号。而如果工程中有 Swift 代码的话也需要在 Other Swift Flags 中配置 `-sanitize-coverage=func; -sanitize=undefined ;`这样就能收集 Swift 方法的符号了。对于使用 Cocoapods 来管理代码的工程来说，可以参考开源项目 AppOrderFiles[7](#user-content-fn-7 "#user-content-fn-7") 的实现。另外需要注意的是，AppOrderFiles 中的实现是先通过函数地址解析出对应的符号再进行去重，而对于中大型工程来说，启动过程中的符号调用数量可达几百万级别，所以这个过程特别的久，可以改为先进行去重再进行函数地址解析符号的方式节省时间。同时，由于云音乐工程已经开启了 Cocoapods 中的`generate_multiple_pod_projects`特性，所以相应的 Podfile 中的配置也需要修改为如下代码才能有效配置所有子工程的 Other C Flags/Other Swift Flags，代码如下：

```arduino
post_install do |installer|
installer.pod_target_subprojects.flat_map { |project| project.targets }.each do |target|
target.build_configurations.each do |config|
config.build_settings['OTHER_CFLAGS'] = '-fsanitize-coverage=func,trace-pc-guard'
config.build_settings['OTHER_SWIFT_FLAGS'] = '-sanitize-coverage=func -sanitize=undefined'
end
end
end
```

  通过 Clang 插桩的方式，我们收集了启动链路上总共 2 万左右经过去重后的符号，并且在一台系统版本为iOS12.5.4 的 iPhone 6 Plus 设备上测试。经过多次测试取平均值，发现二进制重排后有 180ms 左右的优化。通过结果数据可见，二进制重排的效果被神话了，并且 iOS13 之前苹果对 Page In 过程的解密验证操作才是耗时的大头，符号的重排影响较小。

### 3.2 T2阶段治理

  T2 阶段的治理主要从各个启动任务的配置和初始化、首页加载两个方向出发，这一块的优化空间也是最大的。从前面可知，由于云音乐业务的特殊性，广告业务的影响在 T2 阶段占了很大的比重，所以我们在 T2 阶段还对广告业务做了治理。目前，云音乐首页已经做了缓存，且因为广告业务的存在，所以首页在整个启动过程中并不是瓶颈，我们把治理的重点放在了各个启动任务上面。

  而云音乐除了在 AppDelegate 初始化中的部分代码没有去管理以外，其他的启动任务都已经通过一个启动任务管理框架管理。所以，在 T2 阶段我们主要是通过 Hook objc\_msgSend 生成火焰图和 Instruments 中 App Launch 工具结合启动任务管理框架来分析整个启动链路的性能，通过分析以及后续的优化，我们总结了以下几个可优化的方向：

#### 3.2.1 高频OC方法优化

  OC 是一门动态语言，所有运行时的方法都会通过 objc\_msgSend 转发，从而我们实现了火焰图来分析各方法的性能。大家都知道动态语言的优势就是灵活，但是伴随而来的是性能相对会差些，尤其是在底层库的应用中影响和范围也更明显。

##### NEHeimdall库优化

  我们从火焰图的分析中看到一个底层库的方法被频繁的调用，汇总起来就有很大的耗时，如下图所示：

![](/images/jueJin/0b5f0599340446d.png)

![](/images/jueJin/1e0f2e6035444bb.png)

  从放大图上我们可以看到被频繁调用的方法`[[NEHeimdall]disableOptions]`。NEHeimdall 是我们一个底层用来做运行时崩溃防护的库，Hook 了包括容器类、NSString、UIVIew、NSObject 等类，并在方法中做了开关开启判断。而像系统底层容器类 NSArray 被广泛的应用且调用频繁，如果在每次的 objectAtIndex 方法中都去再次调用`[[NEHeimdall]disableOptions]`方法的确是更加耗时了。

  优化思路主要有两点：一是在 Hook 阶段判断开关状态来决定是否开启防护，二是把原先`[[NEHeimdall]disableOptions]`方法改成 C 方法，相对能提升总的性能。由于第一种方式改动较大且因为 AB 的存在不能保证开关的实时性，最终我们选择了第二种方式。

##### JSON解析优化

  在常规大型 App 中 ABTest 是必不可少的组件，而 AB 缓存数据的获取肯定是在启动链路的前期，由于云音乐工程历史比较久，目前在 ABTest 数据序列化和反序列化中 JSON 数据的解析还在使用 SBJson 的库，而 SBJson 会频繁的调用子方法，如下图所示：

![](/images/jueJin/a2e4bd6012d245f.png)

从 N 早之前网友的测评数据[8](#user-content-fn-8 "#user-content-fn-8")来看，SBJson 库的性能是比较差的，如下图所示：

![](/images/jueJin/c1a8d9711fb544c.png)

从上图也可以看到，对于 JSON 数据的解析来说，系统提供的 NSJSONSerialization 库的性能反倒是最好的，所以在 ABTest 组件中，我们主要是把 SBJson 移除并且通过 NSJSONSerialization 来做 JSON 数据的解析。工程中还有非启动链路组件对 SBJson 库有依赖，进一步需要做的就是整个工程都移除对 SBJson 库的依赖。

#### 3.2.2 runtime遍历优化

  OC 的动态性给了开发者很多的可扩展性，因此大家也都会在平时的开发过程中去做一些骚操作，比如 Hook 以及遍历符号等，而这些操作都是很耗性能的。

##### Hook优化

  云音乐工程中需要 Hook 的场景特别多，不管是通过 Method Swizzle 还是 fishhook 这种遍历符号表的方式。而我们在分析火焰图和 Instrument 的时候发现两种 hook 方式都很影响性能，如下图所示：

![](/images/jueJin/f12fefaf359645b.png)

  针对 Hook 的优化想到的有两点，一是找到性能好的 Hook 库替换，但是会引入新库且有一定的改造成本。二是把原先 Hook 的代码异步到子线程去执行，但是会遇到子线程时机不定的问题，需要确保在对应的类在被应用之前完成 Hook 操作。我们在方式二做了一些尝试，但是最后没有上线，后续会去对 Hook 统一管理以便减少重复 Hook 带来的耗时。

##### EXTConcreteProtocol优化

  我们知道在 OC 中 protocol 是没有默认实现的，但是很多场景下如果 protocol 有默认实现的话又特别方便。而 libextobjc 库中的 EXTConcreteProtocol 可以提供协议默认实现的能力，通过 Instrument 我们发现 ext\_loadConcreteProtocol 方法特别耗时，如下图所示：

![](/images/jueJin/5293d90200fb418.png)

通过查看源码发现 ext\_loadConcreteProtocol 也是通过 runtime 遍历去达到协议拥有默认实现的能力，考虑到现有业务只有一个地方使用到了 EXTConcreteProtocol，但是对启动耗时的影响又特别大，所以对 EXTConcreteProtocol 的优化就是移除依赖，改造业务代码实现，通过对 NSObject 增加分类并继承协议也能达到协议有默认实现的能力。

#### 3.2.3 网络相关优化

  在云音乐工程中，涉及到网络相关影响启动性能的主要有两点：Cookies 设置同步问题、UserAgent 生成和使用。

##### Cookies设置同步优化

  对常规 App 来说都会有三方跳转到 H5 的需求，在云音乐中之前为了同步 Cookies 会在启动链路上预先生成一个 WKWebview 的对象，而 WKWebview 实例的创建是非常耗时的。针对这一块，我们主要是做了懒加载来优化，把 WKWebview 对象的创建放到了真的有 H5 页面打开的时候，并且在创建的时候再去同步 Cookies。

##### UserAgent每次生成优化

  UserAgent 对于请求来说是必不可少的参数，而在云音乐中 UserAgent 又是通过临时创建 UIWebView 对象并通过执行navigator.userAgent来获取的，并且每次启动的时候都会去重新创建后重新获取，耗时点主要也是在 UIWebView 对象的创建。通过查看 UserAgent 具体内容发现，除了系统版本号和 App 版本号会随着升级更新以外，其他的内容都不会变。因此，我们针对 UserAgent 的使用做了缓存，并且在每次系统更新或者 App 更新的时候主动去更新缓存，以降低对启动性能的影响，如下图所示：

![](/images/jueJin/12cbe946c7f245c.png)

#### 3.2.4 系统接口

  在分析火焰图和 Instrument 数据的过程中，我们也发现了一些系统接口的性能对整个启动链路的耗时很有影响，目前发现的主要有两个接口：

*   NSBundle 中的 bundleWithIdentifier: 接口；
    
*   UIApplication 中的 beginReceivingRemoteControlEvents 接口；
    

  云音乐这边拿Bundle的时候自己做了一层封装，通过podName获取对应Bundle。内部实现中先通过系统 bundleWithIdentifier: 接口的形式查找，找不到的情况下再通过 mainBundle 寻找 URL 的方式查找。通过分析发现系统接口 bundleWithIdentifier: 在第一次调用时的性能很差，而通过 mainBundle获取 Bundle 的性能很高。经验证 mainBundle 方式都能获取到 Bundle，所以我们对此进行了顺序切换，优先通过 mainBundle 查找 Bundle，如下图所示：

![](/images/jueJin/ea049abe4f114fd.png)

  beginReceivingRemoteControlEvents 接口的使用场景主要是需要在锁屏界面上显示相关的信息和按钮，就必须要先开启远程控制事件(Remote Control Event)。云音乐作为一个音乐软件在播放音乐的时候就需要显示相关信息。之前的做法是播放相关的服务会在启动的时候往 IOC 中注册对应的实例。为此我们对 IOC 底层做了改造，支持相关实例的懒加载，把相关服务在用到的时候再去初始化实例，这样就把 beginReceivingRemoteControlEvents 接口对启动的影响延后了，对比如下图所示：

![](/images/jueJin/baaa4994ab144de.png)

#### 3.2.5 广告业务优化

  在对广告业务的深入分析以后，我们发现目前云音乐的广告投放对象包括会员和非会员用户。会员用户投放的广告比较少，一般是内部运营活动，而内部运营活动是不需要去广告联盟拉取数据的。并且从代码层面来说，广告业务的接口请求时机要等到执行到广告业务代码才会去发出，时机已经偏晚了。针对这两个情况，我们对广告业务做了相应的优化：

*   会员用户广告业务接口请求开关动态配置；
*   广告业务接口时机前置；

  内部运营活动一般会是运营配置，并且会有投放对象的选项，所以把这个开关动态配置的能力放到了后端，当运营配置的活动投放对象需要有会员的时候才会把对应的开关打开，非运营活动状态开关都是关闭状态，会员用户不会去请求接口。同时，对于非会员用户来说广告业务的影响也是不能忍的，在目前状态基础上我们把广告业务接口的请求时机前置到了网络库初始化之后即发出，可以缩短请求时长对启动的影响，从灰度数据来看平均能优化 300~400ms 左右。

#### 3.2.6 其他业务层面优化

  另外有一些业务拓展或者说功能新增带来的对启动性能有影响的点，比如 iPhone 支持一键登录后号码的读取。云音乐在支持一键登录的需求后会通过 SDK 去读取运营商是否支持一键登录并获取号码，在之前的设计中，不管用户是否登录都会去判断并获取，从 SDK 获取也有一定的耗时，我们改成了只在未登录用户的情况下获取。

  还有一些非共性的业务代码使用姿势的问题我们也做了很多优化，就不在这里一一罗列了。

四.总结
----

  经过阶段性的启动性能专项优化，云音乐 App 的启动性能相比之前是有了一定的提升，到目前为止性能提升30%+。不过对于启动性能优化来说，所有优化的措施只是针对目前 App 遇到的情况处理的。而常规大型 App 的业务迭代非常的频繁，业务需求量也特别的多，在日常开发阶段如何能够检测、拦截对启动性能有影响的代码，App 在上线后如何能够快速定位到新版本有劣化且劣化后的归因，甚至如何感知单用户对启动性能的体感数据。这是在经过了一阶段启动治理之后需要去考虑和实践的，我们目前也正在完善整个启动性能的防劣化系统，等到上线并稳定运行后也会进一步的分享一些防劣思路。

  从前面我们也可以知道，广告业务对云音乐 App 整个启动性能的影响是特别大的，尤其是接口响应时间的不确定性，而广告又涉及到收入，所以这块的短期改动比较难，虽然我们这次针对会员用户做了优化，后续还会进一步的分析广告业务并做一定的优化。还有一些业务层面的优化比如 tabbar 懒加载、首页加载，以及常规的 +load 等方面会进一步的治理。

PS：附上云音乐优化实践小总结表：

阶段

优化方向

可能性收益

分析工具/方法

T1/pre-main

动态库转静态库

平均20-30ms/库

解包/Xcode环境变量

+load

看具体业务

Hook load汇总

无用代码清理

看具体业务

大数据统计类使用率

二进制重排

50-200ms

Hook objc\_msgSend/Clang插桩

T2/post-main

高频OC方法

200-300ms

火焰图

runtime符号遍历

300-500ms

火焰图/Instrument

网络相关

200-300ms

火焰图/Instrument

系统接口

100-200ms

火焰图/Instrument

业务影响

300-400ms

火焰图/Instrument

五.参考资料
------

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！

Footnotes
---------

1.  [developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2019%2F423%2F "https://developer.apple.com/videos/play/wwdc2019/423/") [↩](#user-content-fnref-1 "#user-content-fnref-1")
    
2.  [developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2022%2F110362%2F "https://developer.apple.com/videos/play/wwdc2022/110362/") [↩](#user-content-fnref-2 "#user-content-fnref-2")
    
3.  [github.com/tripleCC/La…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FtripleCC%2FLaboratory%2Ftree%2Fmaster%2FHookLoadMethods%2FA4LoadMeasure "https://github.com/tripleCC/Laboratory/tree/master/HookLoadMethods/A4LoadMeasure") [↩](#user-content-fnref-3 "#user-content-fnref-3")
    
4.  [iosre.com/t/hookzz-ha…](https://link.juejin.cn?target=https%3A%2F%2Fiosre.com%2Ft%2Fhookzz-hack-objc-msgsend%2F9422 "https://iosre.com/t/hookzz-hack-objc-msgsend/9422") [↩](#user-content-fnref-4 "#user-content-fnref-4")
    
5.  [github.com/everettjf/A…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Feverettjf%2FAppleTrace "https://github.com/everettjf/AppleTrace") [↩](#user-content-fnref-5 "#user-content-fnref-5")
    
6.  [mp.weixin.qq.com/s/GTbhvzMA-…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FGTbhvzMA-W0ANlars7mKog "https://mp.weixin.qq.com/s/GTbhvzMA-W0ANlars7mKog") [↩](#user-content-fnref-6 "#user-content-fnref-6")
    
7.  [github.com/yulingtianx…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyulingtianxia%2FAppOrderFiles "https://github.com/yulingtianxia/AppOrderFiles") [↩](#user-content-fnref-7 "#user-content-fnref-7")
    
8.  [blog.csdn.net/arthurchenj…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Farthurchenjs%2Farticle%2Fdetails%2F7009995 "https://blog.csdn.net/arthurchenjs/article/details/7009995") [↩](#user-content-fnref-8 "#user-content-fnref-8")