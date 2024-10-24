---
author: "网易云音乐技术团队"
title: "网易云音乐 RN 新架构升级实践"
date: 2023-12-14
description: "本文介绍了从 RN 新架构源码实现角度出发，介绍了如何升级适配，以及网易云音乐在升级适配时遇到的问题及解决方案。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:159,comments:61,collects:167,views:13698,"
---
> 本文作者：王永亮

本文介绍了从 RN 新架构源码实现角度出发，介绍了如何升级适配，以及网易云音乐在升级适配时遇到的问题及解决方案。

![题图](/images/jueJin/64de17f875364f7.png)

一、背景
----

网易云音乐从 ReactNative 0.33 版本开始接入，在 2019 年时开始把 RN 作为主要跨端方案进行建设，并从 0.33 升级到了 0.60，升级 0.60 时还只有十几个页面使用 RN 开发，时至 2022 年底已经有 100+ 业务模块使用 RN 开发，对应 100+ RN 项目，P0 级别项目占比超过四分之一。云音乐 RN 已经拥有完善的组件库和自定义协议库，并且建设了从开发脚手架、一站式开发平台、分发服务、端侧定制容器以及监控体系等一系列的配套设施。

![基建架构](/images/jueJin/5a19365447f44ea.png)

虽然使用 RN 开发的页面越来越多，但受限于 JS 的解释执行速度以及 RN 的多线程通信架构等问题，RN 页面在启动性能和某些交互体验上和纯原生仍有一些差距，特别是核心场景，业务对页面打开效率和使用体验特别的敏感，这也导致跨端使用场景进一步扩大受阻。为了突破性能瓶颈，我们在横向对比了业界各主流 App 上使用的动态化跨端方案，同时考虑基于当前 RN 版本进行改造和引擎替换等方案，最终结合云音乐自身的特点和已有基建情况我们选选择了 ReactNative 新架构升级方案。本文主要介绍网易云音乐升级 RN 新架构遇到的一些问题和解决方案，希望给想要升级的同学提供一些可参考的信息。

二、项目思路和方案
---------

### 新架构调研

升级前我们首先使用 Demo 对新老版本从性能、Bundle 包大小、客户端包大小、内存占用等多角度进行了详细的数据对比，测试机型为 iOS iPhone 6 iOS 12.5、iPhone 12 iOS 16.1，Android 小米8 SE 和红米 Note 9 Pro，测试环境为 RN 0.60 版本 + JavaScriptCore 引擎和 RN 0.70 版本 + Hermes + 字节码预编译，详细对比信息如下：

#### 性能对比

经过对比，使用新架构 + Hermes 引擎 + 预编译后 Android 小米8 SE 首帧提升 71.5%，LCP 提升 40.1%；红米 Note 9 pro 首帧提升 77.3%，LCP 提升 41.9%；iPhone 6 首帧耗时提升 63%，iPhone 12 提升 42%；LCP iPhone 6 提升 48.5%，iPhone 12 提升 18.3%，详细数据如下表：

首帧时间：

版本

iPhone 6

iPhone 12

小米 8 SE

红米 Note 9 pro

RN 0.60

1563.66ms

189.66ms

987.2ms

743.4ms

RN 0.70

578.66ms

110ms

281ms

168.4ms

LCP 时间：

版本

iPhone 6

iPhone 12

小米 8 SE

红米 Note 9 pro

RN 0.60

2482.2ms

886.5ms

1720ms

1358.6ms

RN 0.70

1276.6ms

724.25ms

1030.2ms

788.4ms

#### 离线包大小影响

Hermes 引擎的一大优势是预编译和字节码执行能力，但是将 JS 文本编译成字节码是有额外成本的，编译后相比编译前 demo 的 bundle 包的大小压缩前增加 18.1%，ZIP 压缩后相比于非字节码 ZIP 后增加了 57.6%，根据我们后续实际打字节码包的经验，JS Bundle 在字节码预编译后 ZIP 包会有 40% ~ 100% 不等的增加，在网络状态差的情况对离线包的到达会有一定的影响，需要采取一些优化措施， demo 详细数据如下：

是否压缩

bundle大小

bundle（bytecode）大小

ZIP前

2.7M

3.3M

ZIP后

623kb

1.4M

#### 客户端包大小影响

iOS新版本不引入 hermes.framework 时 IPA 包大小为 1.1MB，引入后为 3.1MB，增加了 2MB 包大小。 Android新版本依赖大小 6.12M，老版本 6.14M，影响较小

#### 内存占用影响

使用 Demo 验证在内存（包含 App 本身的内存使用）使用上，RN 0.70 也比 RN 0.60 也有明显优化，iOS 新版本相比老版本内存占用减少了 50% 左右，Android 小米8 SE 内存占用减少 33.2%，红米 Note 9 Pro 内存占用减少31%，具体数据如下：

*   iOS

版本

iPhone 6

iPhone 12

RN 0.60

42.2MB

47.4MB

RN 0.70

21.4MB

25.7MB

*   Android

版本

小米 8 SE

红米 Note 9 Pro

RN 0.60

208.4MB

223.1MB

RN 0.70

139MB

153.9MB

#### 其他影响

我们对通信耗时、长列表场景帧率和页面交互能力等场景也进行了 demo 验证，使用 TurboModule、FabricComponent 后通信性能有了 50% 以上的提升，长列表场景帧率无明显变化，页面交互能力和 Native 基本持平。

综上调研结果，RN 0.70 新架构 + Hermes 引擎 + 字节码预编译开启在各个方面上表现都要优于云音乐之前使用的 RN 0.60 + JavaScriptCore 引擎。

### 新架构适配

RN 新架构的核心主要有三方面的优化 —— Fabric、TurboModule 和 Hermes，分别对应组件渲染、信息通信和执行引擎，三项优化都可以独立开启和关闭，接入复杂度上 Hermes 接入适配成本相对最低；Fabric 和 TurboModule 都需要进行代码改造适配后才能启用，TurboModule 开启后 NativeModule 仍然可以使用，改造成本适中，Fabric 的开启最为复杂，由于 Fabric 开启后只支持渲染 FabricComponent，所以需要将原来的 NativeComponent 全部改造为 FabricComponent 才能使用，Fabric 在三者中适配成本最高。

这里从 Android 端的角度介绍下新架构的基本原理和适配:

#### Hermes 升级适配

Hermes 在 0.70 版本时开始被作为双端默认的 JavaScript 引擎，Hermes 引擎最大的优势是支持预编译能力，预编译将原本在端上解释执行时进行的抽象语法树解析、词法解析、以及各种编译优化放到了打包时，直接输出执行效率更高的字节码，具体原理可以参考官方图：

![Hermes 预编译](/images/jueJin/2b01ddb3478f4f6.png)

Hermes 支持执行纯文本 JS Bundle 和 JS Bundle 预编译后的字节码文件（HBC 文件），纯文本执行性能相比于其他引擎性能降低明显，但是执行预编译后的二进制文件时性能可以说有了质的提升，尤其是在 Android 系统上，比较直观的体现是 JS Bundle 预编译成字节码后页面首屏渲染速度的显著提升。 但是也带来了一些副作用，首先是 JS Bundle 预编译为二进制后体积增加 50% 以上，另外一个问题是 JS Bundle 预编译为字节码后使用 bsdiff 打出的差量包的大小相比于原来纯文本的 diff 包增加了 80% 以上，从几 kb、几十 kb 增加到了上百 kb，在一些弱网等场景包大小的增大可能会直接带来离线包下载失败率的提升。对于 diff 包增大的问题经过排查我们发现在打字节码包时增加 `-base-bytecode` 指令可以降低 diff 包的大小，指令如下：

```csharp
hermes -emit-binary -out bundle.hbc -base-bytecode bundle.hbc
```

原理可以参考 hermes 的 [issue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fhermes%2Fissues%2F208 "https://github.com/facebook/hermes/issues/208")，这里不得不吐槽下 Hermes 官方文档实在是内容太少了，没有对这方面内容的说明。

对于打字节码后包增大的问题，虽然对大部分场景用户都可以通过差量包进行升级，但是对于新用户和刚刚升级到 RN 0.70 的用户还是需要全量拉取的，为了解决这个问题我们对字节码离线包进行了剪裁和引入了新的压缩算法。

使用 Hermes 引擎后 JS 代码打包时会经过混淆、压缩和预编译等步骤，在之前文本打包的基础上，字节码预编译后会生成 HBC SourceMap 来关联字节码和 JS SourceMap，HBC SourceMap 大小在非 ZIP 情况下可以占到 HBC 包大小的 30% 左右，HBC SourceMap 主要作用是字节码执行出现异常时将字节码堆栈还原为纯文本堆栈，在运行时不需要使用，所以我们在打包时把 HBC SourceMap 从 HBC 包中移除并上传到了云存储，在异常监控平台解析堆栈使用时直接从云存储获取，通过 HBC 包的剪裁压缩后包大小可以缩小 10% ~ 20%。

另外经过调研和对比还引入了 XZ 压缩算法，XZ 压缩算法有更高的压缩比，相比于 gzip 压缩比提升 10% 以上，但是压缩时间和解压缩时间都增加了几十倍，压缩由于发生在打包时时长增加可以忽略不计，在中低端手机上测试解压缩时间从原来的 0.0x 毫秒上升到了几毫秒，时间增加完全可以接受。

经过两项优化后离线包整体大小缩小 30% 以上。

#### TurboModule 升级适配

TurboModule 提供了 JS 同步调用客户端代码的能力，原理上是以 C++ 代码作为桥梁实现不同语言间的通信，通过 JSI 和 JNI 实现跨语言的通信，代码中利用 JSI 能力在 C++ 代码中向 JSRuntime 注入了 “\_\_turboModuleProxy”，通过 ”\_\_turboModuleProxy“ JS 可以直接调用到 C++，C++ 则通过框架初始化时使用 JNI 注入的 TurboModuleManager Java 对象的引用获取 TurboModule Java 层实现，最后通过 Java 层获取到 C++ 层方法映射完成 TurboModule 的获取。

TurboModule 需要通过 Codegen 来生成，具体方法可以参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Freactnative.cn%2Fdocs%2Fthe-new-architecture%2Fpillars-turbomodules "https://reactnative.cn/docs/the-new-architecture/pillars-turbomodules")，使用 Codegen 生成的 TurboModule 包含 Java 代码和 C++ 代码两部分，C++ 代码中维护了当前 TurboModule JS 到 C++ 方法的映射，以及对实际实现 TurboModule 的 Java 对象的引用，最终调用 Java 层 TurboModule 方法时则通过 JavaTurboModule 的 invokeJavaMethod 统一中转到 Java 层，这里需要注意的是如果 TurboModule 中定义的方法如果返回值是 void 类型，则会自动转为异步调用方式，相关代码如下：

```css
```
    case VoidKind: {
    TMPL::asyncMethodCallArgConversionEnd(moduleName, methodName);
    TMPL::asyncMethodCallDispatch(moduleName, methodName);
    
    nativeInvoker_->invokeAsync(
    // 具体方法实现
    );
    
    TMPL::asyncMethodCallEnd(moduleName, methodName);
    return jsi::Value::undefined();
}
```
```

改造为 TurboModule 后，如果需要使用同步方法，则函数定义的返回值也需要改为非 Void。在 RN 新架构中虽然新增了 TurboModule，但是之前的 NativeModule 也还是可以使用的，并且新增的 TurboModule 也是向前兼容的，所以云音乐的做法是先将频繁使用的 NativeModule 改造为 TurboModule，降低改造成本和前端适配的成本。

#### Fabric 升级适配

Fabric 对渲染系统进行了重构，重构后渲染系统分为渲染、提交、挂载三个阶段，渲染阶段主要是运行 JS 渲染逻辑，为每个通过 React Fiber 框架计算生成的 Element 节点创建对应的 C++ 影子树节点（shadowNode），提交阶段使用 Yoga 引擎对前一阶段生成的影子树（ShadowTree）进行布局计算，挂载阶段在客户端 UI 线程中将计算好的布局信息和来自于 JS 的样式信息解析为客户端的视图树。新的渲染系统将影子树逻辑和相对应的 Yoga 布局计算直接放在了 C++ 中，优化掉了原来 Java 代码中的影子树和不必要的 YogaJNI 调用，提升了数据传输的效率，整体架构如下图：

![](/images/jueJin/187f618cbc0345f.png)

Fabric 的适配成本相对来说还是比较高的，和 TurboModule 不同，由于代码中 UIManager 和 FabricUIManager 只能二选一，所以在一个 RN 应用中开启 Fabric 需要将这个 RN 应用依赖的所有 NativeComponent 都改造为 FabricComponent，否则在页面上使用该组件的位置会展示一个未实现组件的提示，FabricComponent 需要使用官方提供的 Codegen 工具生成，这里除了自研组件需要适配，依赖的社区开源的组件也需要升级和改造，这里依赖组件过多改造成本高的话也可以选择分页面逐步迁移以降低开发成本。

#### 前端代码适配

RN 升级除了客户端 RN SDK 升级、NativeModule、NativeComponent 的改造外，前端的兼容适配也有比较大的工作量，首先要解决的是 RN 本身迭代导致的变更，跨越 0.60、0.70 版本不少改动和优化需要适配，另外就是新架构的 API 变更，开启 Fabric 后一些老的 API (如 findNodeHandle、setNativeProps 等) 已无法使用，API 迁移可以参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fnew-architecture-intro "https://reactnative.dev/docs/new-architecture-intro")说明，这些 API 使用非常广泛，除了业务源码中使用外、我们自己开发的二方组件、社区的三方组件都需要进行适配或者更新，部分三方常用组件还没有新架构的适配版本需要我们自行进行适配，为了尽快完成升级工作，我们选择了先临时对三方库进行私有化，在私有化基础上进行适配改造，稳定性验证完毕后可以回馈给社区，这也带来了另一个问题，常用三方库除了直接在业务代码中依赖在其他三方库中也可能被依赖，这样就造成了私有化的连锁反应，为了解决这个问题我们通过 alias 方式避免依赖膨胀，后续会有前端篇文章专门来介绍。

### 云音乐升级实战

对于云音乐来说，RN 新架构升级这要有两个问题：

**1\. 兼容成本高。** 升级新架构，除了客户端之前的 NativeModule、FabricComponent 需要升级适配外，还要对在云音乐中已存在 100+ RN 应用进行逐个适配回归，这里面还包含一些营收广告之类的重要页面，回归和上线都需要格外谨慎。

**2\. 新架构不确定性高，稳定性风险大。** 项目开始时距离 RN 0.70 版本发布只过了 3 个月的时间，还没有有关大型 App 对新架构的使用和稳定性情况的消息，另外在老架构中我们就遇到一些 JSC 相关的出现概率不低偶现 Crash，新架构担心会有相同问题。

针对以上问题我们调研制定了比较稳健的升级上线方案，主要涉及工作如下图：

![](/images/jueJin/72c93633afcb4ca.png)

其中主要工作还是围绕降低升级成本和稳定性保障两个方面：

#### 降低升级成本

*   **自动化脚本减少适配工作量**

在整个 RN 升级工作中工作量占比最高的就是业务的适配和回归工作，在没有遇到疑难问题的情况下熟手适配一个应用需要 0.5d，100+ 应用理想情况下预估完全适配完成可能需要 2~3 个月的时间，适配同时还需要兼顾各业务线的迭代排期，可能进一步拉长项目时间，并且已有页面还在不断的迭代中，时间越长适配成本就会越高，后期项目可能会失去掌控。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F213%2Fdiffs%236dab318fe366742c52f9e8f84ef6fcc21260e1c3_0_161 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/213/diffs#6dab318fe366742c52f9e8f84ef6fcc21260e1c3_0_161")

针对以上问题，我们经过分析发现除了少量 API 升级后参数出现变更，很难通过自动化改造外，大部分情况可以将改造点收敛到依赖中，升级依赖即可完成版本升级，所以针对这个特点我们实现了自动化升级脚本，大部分升级工作通过执行脚本完成，只有少量 API 改造和升级出现的 UI 适配问题需要投入人力，实际每个应用适配工作量缩短到 1h~2h 左右，整体升级成本大大降低。

*   **RN新架构源码改造，降低改造成本**

新架构中客户端一项重要的工作就是 NativeModule 和 FabricComponent 的改造，这块在新架构适配部分也有介绍，对于 NativeModule 我们选择了对部分高频使用的 Module 进行改造，比如我们的自定义协议传输的 Module，几乎所有业务的 JS 和 客户端通信都需要通过这里，这个 Module 改造完已经解决了大部分问题，对于 FabricComponent 我们通过分析源码发现虽然新架构源码中 FabricUIManager 必须使用 FabricComponent，但是仍然可以通过修改源码进行兼容，通过 Codegen 生成的 C++ 代码当前版本的主要作用是实现 Props 的类型定义，真正执行时还是会通过 TS 中的 RawProps 来操作需要变更的属性。所以最终我们通过更改 ComponentDescriptorRegistry.cpp 和 SurfaceMountingManager.java 的查找逻辑实现了兼容，重点代码如下：

ComponentDescriptorRegistry.cpp: ![](/images/jueJin/30f06755a64b487.png)

SurfaceMountingManager.java:

![](/images/jueJin/463d5526f621435.png)

通过该更改节约了大量的自研组件升级带来的工作量。

*   **新老版本一套代码、一次打包即可同时上线新老 RN 版本客户端**

对于已经存在 100+ RN 项目的大型 App，RN 新架构升级这种量级的改动是无法直接线上全量的，需要通过 Android 分流、iOS AB 切换的方式逐步放量，放量时间短则一两个迭代，长则可能到一两个月，这时 RN 页面日常迭代发布就需要考虑 RN 0.60 和 RN 0.70 同时兼容的问题，对此我们设计了一套代码出双包的方案，使用该方案业务更改后，一套代码一次打包可以同时发布运行在线上使用 RN 0.60 版本的客户端，以及线上使用 RN 0.70 版本的客户端，整体方案通过自动化升级脚本和 RN 打包脚本改造实现，尽量做到具体业务最小的开发适配成本，改造后整体架构如下：

![](/images/jueJin/a69f04e2ca2b406.png)

相对应的开发调试流程也需要相应的变化：

![](/images/jueJin/43608ebd3a6b496.png)

在打包发布平台上兼容模式是可配置的，RN 70 全量后，对于一些如营收相关的页面线上存量的 RN 0.60 版本客户端也非常重要，集成在 RN 0.60 版本客户端上的页面需要持续的维护，直到 RN 0.70 版本覆盖率到达到一定程度，到时才可以放弃少量的存量版本，这种情况可以一直保持 RN 0.60 版本和 RN 0.70 版本的配置，对于大部分应用在RN 0.70 全量后 RN 0.60 的兼容包就不需要再维护，则去掉打 RN 0.60 兼容包的配置即可。

#### 稳定性保障

RN 升级需要适配页面众多，改造成本极大，新架构还带来了很多的不确定性，对此我们做了非常多的工作进行稳定性保障，RN 升级上线后做到了 0 线上问题。

*   **源码改造，新增 Hermes、FabricComponent、TurboModule 降级能力**

RN 新架构中 Hermes 引擎、FabricComponent 和 TurboModule 都还是比较新的东西，为避免出现线上问题，我们对 Hermes、Fabric、TurboModule 都增加了动态降级能力，通过配置的实时下发随时可以切换到降级模式，避免异常突增或某些业务突现 bug 造成诸如资损等严重问题。

*   **iOS 双动态库方案，实现 AB 阶梯放量**

在 RN 0.70 版本中，新架构和引擎都存在非常大的不确定性，根据我们之前的 RN 使用经验，老版本中Android JavaScriptCore 引擎在开发测试期间都比较稳定，但是上线后会有一些出现概率不低的引擎侧异常，iOS 切换为 Hermes 后很可能有相同问题，所以要提前设计好上线的方式和节奏，尤其是在 iOS 系统上，由于苹果应用市场的限制，几乎不可能做到和 Android 一样的灰度和逐个应用市场放量的能力，所以为了避免风险，我们设计了 RN 0.60 和 RN 0.70 版本双动态库方案，即保证了稳定性，又为 AB 数据实验做好了准备，详细实现可以关注后续文章。

三、升级收益
------

*   性能提升 **升级后页面线上性能数据普遍提升，首次渲染白屏有效解决，低端机提升尤其显著**

升级后 RN 页面 JS 渲染执行时的 loading 展示时间已完全不可见，除了体感的提升外，我们还对线上的性能数据进行了全面的统计，统计结果中各项性能数据均显著提升，其中 Android 最大元素渲染完成时间（LCP）提升 20%~50%，iOS LCP提升 10%~20%，在 Android、iOS 低端机上提升都更加显著，RN 升级后页面 LCP 时间基本都可以做到 1s 内，做到了页面秒开。

*   稳定性提升 **升级后客户端各项稳定性数据均有提升**

RN 升级后 Android 端稳定性得到显著提升，JavaSriptCore 引擎偶现崩溃得以解决，Hermes 偶现万分位异常，引擎带来的稳定性问题基本已被解决，由于新架构新引擎的内存占用减低，一些内存不足引起的异常也减少很多。

> 相关链接： [reactnative.dev/docs/next/n…](https://link.juejin.cn?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fnext%2Fnew-architecture-intro "https://reactnative.dev/docs/next/new-architecture-intro") [reactnative.cn/architectur…](https://link.juejin.cn?target=https%3A%2F%2Freactnative.cn%2Farchitecture%2Ffabric-renderer "https://reactnative.cn/architecture/fabric-renderer")

最后
==

![](/images/jueJin/ac6e6e8bbb1c40c.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")