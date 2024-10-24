---
author: "字节跳动技术团队"
title: "前端监控系列4 ｜ SDK 体积与性能优化实践"
date: 2022-10-28
description: "随着业务不断迭代，功能变得越来越多，对监控的需求也会变得越来越多。本文以字节前端监控SDK为例，探讨作为三方SDK如何实现性能优化的思路与实操。"
tags: ["前端","监控中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:23,comments:2,collects:49,views:6572,"
---
背景
==

字节各类业务拥有众多用户群，作为字节前端性能监控 SDK，自身若存在性能问题，则会影响到数以亿计的真实用户的体验，所以此类 SDK 自身的性能在设计之初，就必须达到一个非常极致的水准。

与此同时，随着业务不断迭代，功能变得越来越多，对监控的需求也会变得越来越多。例如，今天 A 业务更新了架构，想要自定义性能指标的获取规则，明天 B 业务接入了微前端框架，需要监控子应用的性能。在解决这些业务需求的同时，我们会不断加入额外的判断逻辑、配置项。同时由于用户的电脑性能、浏览器环境的不同，我们又要解决各种兼容性问题，加入 polyfill 等代码，不可避免地造成 SDK 体积膨胀，性能劣化。那么我们是如何在需求和功能不断迭代的情况下，持续追踪和优化 SDK 的体积和性能的呢？

SDK 体积优化
========

通常而言，体积的优化是最容易拿到收益的一项。

由于监控 SDK 通常作为第一个脚本被加载到页面中，体积的膨胀不仅会增加用户的下载时间，还会增加浏览器解析脚本的时间。对于体积优化，我们可以从宏观和微观两个角度去实现。

微观上，我们会去尽可能去精简所有的表达，剥离冗余重复代码，同时尽可能减少以下写法的出现：

1.  **过多的 class 和过长的属性方法名**

Class 的定义会被转换成 function 声明 + prototype 赋值，以及常用代码压缩工具无法对 object 属性名压缩，过多的面向对象写法会让编译后的 js 代码体积膨胀得非常快。例如下列代码：

```javascript
    class ClassWithLongName {
methodWithALongLongName() {}
}
```

经过 ts 转换后会变成：

```javascript
    var ClassWithLongName = /** @class */ (function () {
        function ClassWithLongName() {
    }
    ClassWithLongName.prototype.methodWithALongLongName = function () { };
    return ClassWithLongName;
    }());
```

压缩后代码为：

```javascript
var ClassWithLongName=function(){function n(){}return n.prototype.methodWithALongLongName=function(){},n}();
```

可以看到以上长命名都无法被压缩。

如果使用函数式编程来代替面向对象编程，能够很好的避免代码无法被压缩的情况：

```csharp
    function functionWithLongName() {
return function MethodWithALongLongName(){}
}
```

经过压缩后变成：

```javascript
function n(){return function(){}}
```

相较于 class 的版本，压缩后的代码减小了50%以上。

2.  **内部函数传参使用数组代替对象**

原理同上，对象中的字段名通常不会被代码压缩工具压缩。同时合理使用 TS named tuple 类型可以保证代码可维护性。

```javascript
    function report(event, {optionA, optionB, optionC, optionD}: ObjectType){
}
```

改为：

```csharp
    function report(event, [optionA, optionB, optionC, optionD]: NamedTupleType){
}
```

3.  在不需要判断 nullable 时，尽可能避免 `?.` `??` `??=` 等操作符的出现。同理，尽可能避免一些例如 spread 操作符、generator 等新语法，这些语法在编译成 es5 后通常会引入额外的 polyfill。

TS 会将这些操作符转换成非常长的代码，例如 `a?.b`会被转换成：

```csharp
a === null || a === void 0 ? void 0 : a.b
```

过多的 nullish 操作符也是代码体积增加的一个原因。

当然，以上只列举了部分体积优化措施，还有更多优化方法要结合具体代码而议。对于我们的前端监控 SDK，为了性能和体积是可以牺牲一些开发体验的，并且由于使用 TS 类型系统，并不会对代码维护增加很多负担。

从宏观上，我们应该思考如何减少 SDK 所依赖的模块，减少产物包含的内容，增加产物的“信噪比”，有以下几个方式：

1.  **拆分文件**

我们可以分离出 SDK 中不是必须提前执行的逻辑，拆分成异步加载的文件，仅将必须提前执行的逻辑加入初始脚本。同时将不同功能拆分成不同文件，业务按需加载，这样可以最大程度减少对首屏加载时间的影响。

2.  **尽可能避免 polyfill 的使用**

polyfill 会显著增加产物体积，我们尽可能不使用存在兼容性的方法。甚至在不需要兼容低端浏览器环境时，我们可以不使用 polyfill。

3.  **减少重复的常量字符串的出现次数**

对于多次重复出现的常量字符串，提取成公共变量。例如

```less
a.addEventListener('load', cb)
b.addEventListener('load', cb)
c.addEventListener('load', cb)
```

我们可以将 `addEventListener`和 `load` 提取公共变量：

```ini
let ADD_EVENT_LISTENER = 'addEventLister'
let LOAD = 'load'
a[ADD_EVENT_LISTENER](LOAD, cb)
b[ADD_EVENT_LISTENER](LOAD, cb)
c[ADD_EVENT_LISTENER](LOAD, cb)
```

此段代码压缩后会变成：

```scss
let d="addEventLister",e="load";a[d](e,cb),b[d](e,cb),c[d](e,cb);
```

我们还可以使用 TSTransformer 或者 babel plugin 来帮我们自动地完成上述过程。

值得注意的是，这个方法在 web 端并不能取得很好的收益，因为浏览器在传输数据时会做 gzip 压缩，已经将重复信息用最高效的算法压缩了，我们做的并不会比 gzip 更好。但是在需要嵌入移动端 app 的监控 SDK 来说，这一做法能减少约 10 ~ 15% 产物体积。

除了体积优化以外，随着需求不断增加，功能不断完善，不可避免的会影响到 SDK 的性能。接下来，我们介绍如何测量并优化 SDK 的性能。

使用工具进行性能衡量
==========

通常来说，监控类 SDK 最有可能影响性能的地方为：

1.  监控初始化时执行各类监听的过程。

2.  监控事件上报请求对业务的影响。

3.  SDK 维护数据缓存时的内存使用情况。

接下来，我们着重从以上几个维度来衡量并优化 SDK 的性能。

### 性能衡量过程

使用 Benchmark 性能衡量工具的目的便是为了知道 SDK 运行过程中每一个函数执行的耗时，给业务带来多大的影响，是否会引起 longtask。由于我们的监控 SDK 包含了性能、请求、资源等各类前端监控能力，这些功能的实现依赖对页面各类事件的监听、性能指标的获取、请求对象的包装。除此之外，SDK还提供给用户（开发者）调用的方法，例如配置页面信息、自定义埋点、更改监控行为等能力。根据 SDK 以上行为和能力，我们将测试分为两个模块：

1.  接入 SDK 后自动运行的各类监控，这些行为大部分会在页面加载之初执行，若此部分性能劣化，会严重影响到所有前端业务用户的首屏加载。

2.  用户端（开发者）调用的方法，我们会将此类方法包装成 client 对象以 npm 包的形式给开发者调用，这部分方法的执行由用户控制，可能存在频繁调用的情况，因此也应避免耗时过长的调用出现。

在过往文章[前端监控系列1｜ 字节的前端监控 SDK 是怎样设计的](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI1MzYzMjE0MQ%3D%3D%26mid%3D2247497407%26idx%3D1%26sn%3D217376a862e10ca96f7fc6c615429cb1%26chksm%3De9d33d5ddea4b44bfc654fdf311ae0230c67e396edd729a89aac655d5fb1a444ee9ba51c571b%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247497407&idx=1&sn=217376a862e10ca96f7fc6c615429cb1&chksm=e9d33d5ddea4b44bfc654fdf311ae0230c67e396edd729a89aac655d5fb1a444ee9ba51c571b&scene=21#wechat_redirect")中我们讲到，我们的 SDK 在设计时已经做到的尽可能的解耦，各个模块各司其职，这一特点非常便于我们针对各个模块方法进行单独的性能衡量。

下面我们以使用 benny ([github.com/caderek/ben…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcaderek%2Fbenny "https://github.com/caderek/benny"))  这一开源工具为例，展示一段方便理解 benchmark 过程的伪代码，仅作参考：

benny 是一个非常简单易用的 benchmark 工具，通过 `suite` 方法创建测试用例组合，通过`add`方法添加需要测试的函数，`cycle`方法用于多次循环执行测试用例，`complete`用于添加测试完成之后的回调函数。更多详细的使用说明可以查阅官方文档。

```scss
const { suite, add, cycle, complete, save } = require('benny')
// 衡量 SDK 各类监控初始化运行性能
suite(
'collectors setup',
add('route', () => route(context)),
add('exception', () => exception(context)),
add('ajax', () => ajax(context)),
add('FCP', getFCP),
add('LCP', getLCP),
add('longtask', getLongtask),
cycle(),
complete(),
)

// 衡量 Client 实例方法耗时
suite(
'npm client',
add('set config', () => client.config({pid})),
add('set context', () => client.context.set({ something })),
add('send custom pv', () => client.sendPageView(pid)),
add('send custom event', () => client.sendCustom(ev)),
// ...
cycle(),
complete(),
)
```

通常这类 benchmark 工具都是在 Node 上执行的，但是我们的 SDK 是个前端监控 SDK，依赖了非常多的浏览器环境对象，我们几乎不可能在 Node 环境去创造或模拟这些对象，我们有没有办法在浏览器里去运行这段脚本，做性能自动化测试呢？

### 利用 Puppeteer 在浏览器环境中执行 Benchmark

由于我们的前端监控依赖浏览器环境，我们可以将上述 benchmark 测试代码打包成 commonjs 之后放入 headless chrome 浏览器中执行，并通过 puppeteer 收集执行结果。

> Puppeteer 是一个 Node 模块，提供了通过 Devtool Protocol 控制 Chrome 或者 Chromium 的能力。Puppeteer 默认运行 Chrome 的无头版本，也可以通过设置运行 Chrome 用户界面版。

下面是一段方便理解操作 puppeteer 过程的伪代码，仅作参考，实际情况较为复杂，需要等待未完成的异步请求等：

```typescript
const browser = await puppeteer.launch()
const page = await browser.newPage()
const cdp = await page.target().createCDPSession()

// 用于 benchmark 脚本和 puppeteer 之间的通信，用以收集结果
await page.evaluate(() => (window.benchmarks = []))
// 将 pushResult 方法暴露给浏览器，来将结果收集到 node 端
await page.exposeFunction(
'pushResult',
(result: any) => benchmark.results.push(result)
)

await cdp.send('Profiler.enable')
await cdp.send('Profiler.start')

// 开始执行 benchmark
    await page.addScriptTag({
    content: file.toString(),
    })
    
    await Promise.race([timeout, allBenchmarksDone()])
    
    // profile 可用于绘制火焰图
    const { profile } = await cdp.send('Profiler.stop')
    await page.close()
```

通过运行以上脚本，我们便可以在无头浏览器中运行我们的性能测试脚本，在测试脚本产出结果后添加调用 pushResult 方法来收集测试结果。

在实际的 benchmark 测试中，我们发现开启性能监听（即运行各个性能监控的 PerformanceObserver.observe 方法）最大耗时达到了21ms，虽然看上去并不久，但若和其他监听同时执行，加上引入业务代码的复杂性和移动端更弱的 CPU 性能，极有可能成为给业务带来 longtask 的罪魁祸首。性能监控性能成为了瓶颈。

接下来，我们将性能监听一个个拆分，用同样的方式单独测试每一个性能监听的耗时。在实际的 benchmark 结果中，我们发现 fp、fcp、lcp、cls 监控耗时最大，加在一起超过了10ms，占了一半以上，是我们之后需要重点优化的地方。

除此之外利用 puppeteer 的能力，我们不仅可以得到 benchmark 的结果，还可以获取到整个 benchmark 过程的 profile 数据，利用 speedscope ([github.com/jlfwong/spe…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjlfwong%2Fspeedscope%2Fblob%2Fmain%2FREADME-zh_CN.md "https://github.com/jlfwong/speedscope/blob/main/README-zh_CN.md")) 绘制出函数执行过程中的火焰图：

_绘制火焰图的具体实现不在本文讨论范围内，感兴趣的同学可以参考 speedscope 官方文档_

![](/images/jueJin/7de7b8ec8201496.png)

此处显示的时间为该用例执行总耗时（单次耗时\*次数）

### 如何衡量异步任务性能？

Benny 的 api 是支持异步测试用例的，测量的是每个异步函数从开始执行到 resolve 的时间。但通常这并不是我们想要的衡量的数据，因为异步任务的执行过程中并不是一直占据着主线程。对于一些异步的定时任务（例如 SDK 的崩溃检测、卡顿检测、白屏检测），将他们拆解为一系列可测的同步任务能更直观的展示各个阶段的性能耗时。

例如我们 SDK 的前端白屏检测，由一个 mutationObserver 和触发白屏检测的函数组成。我们可以单独对 mutationObserver 的回调和触发函数做性能衡量。

这两个方法已没有很好的优化方式了。但是根据 benchmark 结果并结合源码可以发现，性能监控所有指标项的开启均为同步执行，每一项指标都会对页面做事件监听或者 PerformanceObserver 监听，且这些原生监听耗时都在毫秒级。于是我们对性能做了如下优化：

1.  性能监控逻辑分片运行，将各项性能指标的监听同步拆为异步，用 requestIdleCallback ([developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestIdleCallback "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback"))  做调度并区分优先级。

2.  多个性能指标监听同一事件的公用监听器，例如 CLS 和 LCP 都需要监听 onBFCacheRestore，让他们只做一次 addEventListener。

3.  可以延迟执行的方法延迟执行，例如在高版本的 Chrome 中 PerformanceObserver 是有 buffer ([www.w3.org/TR/performa…](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fperformance-timeline-2%2F%23dom-performanceobserverinit-buffered "https://www.w3.org/TR/performance-timeline-2/#dom-performanceobserverinit-buffered"))  的，可以直接获取到调用之前的性能指标，这些方法调用就可以等待页面完全加载完成之后执行，从而尽可能减少对业务页面首屏影响。

通过 Perfsee 的 Lab 结果分析性能问题
=========================

以上的 benchmark 流程得到的结果毕竟是一种理想化、单纯的方法调用的性能情况，然而在实际浏览器环境中我们前端监控 SDK 对性能影响有多大呢，对于这一类页面初始化即加载的 SDK 可以通过 Perfsee ([perfsee.com/](https://link.juejin.cn?target=https%3A%2F%2Fperfsee.com%2F "https://perfsee.com/"))  的 Lab 功能进行性能衡量。

> Perfsee 是一个针对前端 web 应用在整个研发流程中的性能分析平台。提供性能分析报告、产物分析报告、源码分析、竞品分析等模块，定位与梳理性能问题，提供专业的优化方案来渐进地优化产品性能。
> 
> Lab 模块性能分析的依据是，使用 headless 浏览器运行用户指定的页面，通过运行时数据的收集，分析并产出关键性能指标分数、网络请求信息、主线程 JS/渲染/Longtask 信息供业务方参考优化。具体使用说明请查看 perfsee.com ([perfsee.com/docs/cn/lab…](https://link.juejin.cn?target=https%3A%2F%2Fperfsee.com%2Fdocs%2Fcn%2Flab%2Fget-started "https://perfsee.com/docs/cn/lab/get-started"))

注意，本文所展示 Perfsee 功能示例为早期版本，并不与开源版本功能和界面完全一致。

### 准备基准页面作为对照组

我们的目的是衡量 SDK 对业务性能造成的影响，便需要找到一个基准页面作为对比。此处以 React Server Component Demo ([github.com/reactjs/ser…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freactjs%2Fserver-components-demo "https://github.com/reactjs/server-components-demo"))  为例作为基准页面。该应用有以下几个特点：

1.  容易搭建，一个命令就能跑起来。

2.  自身逻辑简单，性能好，SDK 所造成的影响容易被放大观察。

3.  SPA 应用，含有异步加载的逻辑，更容易探测到监控 SDK 对页面 FCP、LCP 等指标影响。

4.  无外部网络请求，页面结果稳定不易波动。

我们修改一下应用的逻辑，能够通过 url 参数注入监控 sdk 脚本，把它部署在服务器上。接着，我们在 perfsee 平台上配置好基准页面和注入 SDK 的页面这两个 page，并触发一次性能扫描。

### 查看 Lab 性能报告

我们将没有注入 SDK 的页面作为空白组 (empty)，注入了 SDK 的页面作为实验组 (with-sdk)。

首先我们需要配置好空白组和实验组的 pages 以及 profile，触发一次 snapshot 之后，我们得到了多份报告，我们可以点击 compare 将空白组和实验组的数据进行比对。

![图片](/images/jueJin/e1435b5b353b464.png)

在实际的 lab 性能扫描结果中，我们可以看到两个页面所有性能指标的对比。我们发现 sdk 的注入在 mobile profile（4倍降频） 下还是给业务带来了 fcp 70ms、lcp 90ms、load 200ms 的劣化。

![图片](/images/jueJin/b3ad7f35de44403.png)

同时我们还可以观察到注入了 sdk 之后，fmp 和 lcp 之前的请求仅多了 1 个，这是符合预期的。不过这仍是我们保持观察的指标之一，因为在一些中低端的环境中，页面加载完成之前每发出一个请求就可能让业务更高优先级的请求被延后，从而引起页面性能指标的下降。

切换到 Breakdown Tab，我们还可以看到页面首屏时间线。我们需要重点关注几个关键指标（load、fcp、lcp）之前的线程占用情况，hover 在 load 之前这一黄色色块上，我们发现 sdk 在 load 之前执行了 30ms，成为了拖慢了业务指标的原因之一。

![图片](/images/jueJin/bfaac5daa7b547f.png)

此处截图省略了一些内部信息，一般情况下，如果需要更多信息可以借助 **Source** 模块来找到引起主线程密集计算的代码位置。

在这个例子中，这个调用未触发 longtask，并且我们很容易发现这就是 SDK 初始化的逻辑，也是接下来需要优化的地方

问题分析与性能优化
=========

通过上述 benchmark 工具和 perfsee lab 性能分析结果，我们可以看出 SDK 初始化逻辑以及大量的事件监听确实对业务性能造成了一定影响。

例如上文火焰图中所示每一个 `onBFCacheRestore` 都占用了超过 15ms 的时间，我们在源码里搜索这个函数，此部分伪代码如下：

```javascript
    const onBFCacheRestore = (cb) => {
        addEventListener('pageshow', (e) => {
        if (e.persisted) cb(e)
        }, true)
    }
```

> BFCache ([web.dev/bfcache/](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fbfcache%2F "https://web.dev/bfcache/"))  即 back-forward cache，可称为“往返缓存”，可以在用户使用浏览器的“后退”和“前进”按钮时加快页面的转换速度。这个缓存不仅保存页面数据，还保存了 DOM 和 JS 的状态，实际上是将整个页面都保存在内存里。如果页面位于 BFCache 中，那么再次打开该页面就不会触发 onload 事件。

可以看到，耗时主要由 onBFCacheRestore 和 onHidden 两个方法中的原生 addEventListener 造成。这些监听本身都是在毫秒级的，回调函数也没有什么优化空间，从实际场景考虑，这两处回调是为了监听用户页面前进和返回的，并非优先级最高的任务。

我们可以从以下几个方面降低对业务造成的影响：

### 1\. 监控任务切片运行，区分优先级

对于监控 SDK 而言，除了必要的监听以及事件预收集等任务，其他任何任务不应该阻碍到业务代码的执行。对于字节前端监控需求而言，异常和请求监听为必须前置执行的任务，其他所有事件监听可以拆分为单独的任务，所有的采样、数据运算、上报请求等数据**后处理**逻辑只在空闲时执行，通过 requestIdleCallback 调用。

### 2\. 减少重复监听次数

多个性能指标监听同一事件的公用监听器，例如 CLS 和 LCP 这两个指标都需要监听 onBFCacheRestore，让他们只做一次 addEventListener。

### 3\. 请求数量的优化

我们 SDK 的脚本是由一个必须最先执行的主脚本（包含预收集、请求hook、错误监听等逻辑）和多个通过不同配置开启的异步插件脚本（性能、资源、白屏等）组成，主脚本的请求无法省略，而插件脚本可以通过接入 cdn combo 服务或自行搭建 combo 服务将多个请求合并成一个。

*   对于事件上报请求，我们在内部维护一个缓存，只有当间隔达到一定时间或者累计一定数量之后才会统一上报。在这个场景中，我们又需要考虑两个问题：
    *   浏览器对请求并发量有限制，所以存在网络资源竞争的可能性
    *   浏览器在页面卸载时会忽略异步ajax请求，而同步 ajax 通常在现代浏览器中已被禁用

我们可以通过使用 navigator.sendBeacon 方法解决上述问题。

> 这个方法主要用于满足统计和诊断代码的需要，这些代码通常尝试在卸载（unload）文档之前向 Web 服务器发送数据。过早的发送数据可能导致错过收集数据的机会。然而，对于开发者来说保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在 `unload (en-US)` 事件处理器中产生的异步 `XMLHttpRequest`

经过以上优化后，我们注入优化过后的 SDK 再次跑分。

优化后的 SDK 对业务 FCP、LCP、LOAD 等性能的影响已经降到了最低，已经达到了非常高的性能标准。

了解更多
====

字节内部众多业务方使用的前端监控解决方案已同步在火山引擎上，无论是外部企业开发者或个人开发者，均可通过接入该服务提升性能优化的效率。 ****了解Perfsee 性能分析平台：[perfsee.com/docs/cn/](https://link.juejin.cn?target=https%3A%2F%2Fperfsee.com%2Fdocs%2Fcn%2F "https://perfsee.com/docs/cn/")****

**字节内部课程来袭，掘金会员免费看 ！！** 为了帮助大家近距离了解、学习来自字节跳动工程师的技术知识，拓展技术视野、提升技术实力。掘金联合字节内部技术社区 ByteTech 共同推出「字节内部课」。课程涉及前端、后端、客户端、大数据、通用等技术方向，揭秘大厂员工技术成长之路，带你体验原汁原味字节课程。 10月28号课程上新日，诚邀学习，奖品不断～