---
author: "yck"
title: "剖析 React 源码：调度原理"
date: 2019-06-04
description: "这是我的剖析 React 源码的第四篇文章，之前的文章都是具体剖析代码，但是觉得这种方式可能并不是太好。因此从这篇文章开始，我打算把在源码中学习到的内容单独写成一篇文章，这样对于读者来说可能更加的友好。 大家都知道 JS 和渲染引擎是一个互斥关系。如果 JS 在执行代码，那么渲…"
tags: ["React.js","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:156,comments:10,collects:127,views:8619,"
---
这是我的剖析 React 源码的第四篇文章，之前的文章都是具体剖析代码，但是觉得这种方式可能并不是太好。因此从这篇文章开始，我打算把在源码中学习到的内容单独写成一篇文章，这样对于读者来说可能更加的友好。

文章相关资料
------

*   [React 16.8.6 源码中文注释](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Freact-interpretation "https://github.com/KieSun/react-interpretation")，如果你想读源码但是又怕看不懂的话，可以通过我这个仓库来学习
*   [之前的所有文章合集](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues "https://github.com/KieSun/Dream/issues")

为什么需要调度？
--------

大家都知道 JS 和渲染引擎是一个互斥关系。如果 JS 在执行代码，那么渲染引擎工作就会被停止。假如我们有一个很复杂的复合组件需要重新渲染，那么调用栈可能会很长

![](/images/jueJin/164358b0310f476.png)

调用栈过长，再加上如果中间进行了复杂的操作，就可能导致长时间阻塞渲染引擎带来不好的用户体验，调度就是来解决这个问题的。

React 会根据任务的优先级去分配各自的 `expirationTime`，在过期时间到来之前先去处理更高优先级的任务，并且高优先级的任务还可以打断低优先级的任务（因此会造成某些生命周期函数多次被执行），从而实现在不影响用户体验的情况下去分段计算更新（也就是时间分片）。

![](/images/jueJin/164358f89595d56.png)

React 如何实现调度
------------

React 实现调度主要靠两块内容：

1.  计算任务的 expriationTime
2.  实现 requestIdleCallback 的 polyfill 版本

接下来就让笔者为大家一一介绍着两块内容。

### expriationTime

expriationTime 在前文简略的介绍过它的作用，这个时间可以帮助我们对比不同任务之间的优先级以及计算任务的 timeout。

那么这个时间是如何计算出来的呢？

![](/images/jueJin/16b1cd59bbe4f64.png)

当前时间指的是 `performance.now()`，这个 API 会返回一个精确到毫秒级别的时间戳（当然也并不是高精度的），另外浏览器也并不是所有都兼容 `performance` API 的。如果使用 `Date.now()` 的话那么精度会更差，但是为了方便起见，我们这里统一把当前时间认为是 `performance.now()`。

常量指的是根据不同优先级得出的一个数值，React 内部目前总共有五种优先级，分别为：

```
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;
```

它们各自的对应的数值都是不同的，具体的内容如下

```
var maxSigned31BitInt = 1073741823;

// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY = maxSigned31BitInt;
```

也就是说，假设当前时间为 5000 并且分别有两个优先级不同的任务要执行。前者属于 `ImmediatePriority`，后者属于 `UserBlockingPriority`，那么两个任务计算出来的时间分别为 `4999` 和 `5250`。通过这个时间可以比对大小得出谁的优先级高，也可以通过减去当前时间获取任务的 timeout。

### requestIdleCallback

说完了 `expriationTime`，接下来的主题就是实现 `requestIdleCallback` 了，我们首先来了解下该函数的作用

![](/images/jueJin/16b1e1a1f296909.png)

该函数的回调方法会在浏览器的空闲时期依次调用， 可以让我们在事件循环中执行一些任务，并且不会对像动画和用户交互这样延迟敏感的事件产生影响。

在上图中我们也可以发现，该回调方法是在渲染以后才执行的。那么介绍完了函数的作用，接下来就来说说它的兼容性吧。

![](/images/jueJin/16b1e1ebb62e0b3.png)

这个函数的兼容性并不是很好，并且它还有一个致命的缺陷：

> requestIdleCallback is called only 20 times per second - Chrome on my 6x2 core Linux machine, it's not really useful for UI work.

也就是说 `requestIdleCallback` 只能一秒调用回调 20 次，这个完全满足不了现有的情况，由此 React 团队才打算自己实现这个函数。

如果你想了解更多关于替换 `requestIdleCallback` 的内容，可以阅读 [该 Issus](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fissues%2F13206%23issuecomment-418923831 "https://github.com/facebook/react/issues/13206#issuecomment-418923831")。

如何实现 requestIdleCallback
------------------------

实现 `requestIdleCallback` 函数的核心只有一点，**如何多次在浏览器空闲时且是渲染后才调用回调方法？**

说到多次执行，那么肯定得使用定时器了。在多种定时器中，唯有 `requestAnimationFrame` 具备一定的精确度，因此 `requestAnimationFrame` 就是当下实现 `requestIdleCallback` 的一个步骤。

`requestAnimationFrame` 的回调方法会在每次重绘前执行，另外它还存在一个瑕疵：页面处于后台时该回调函数不会执行，因此我们需要对于这种情况做个补救措施

```
    rAFID = requestAnimationFrame(function(timestamp) {
    // cancel the setTimeout
    localClearTimeout(rAFTimeoutID);
    callback(timestamp);
    });
        rAFTimeoutID = setTimeout(function() {
        // 定时 100 毫秒是算是一个最佳实践
        localCancelAnimationFrame(rAFID);
        callback(getCurrentTime());
        }, 100);
```

当 `requestAnimationFrame` 不执行时，会有 `setTimeout` 去补救，两个定时器内部可以互相取消对方。

使用 `requestAnimationFrame` 只完成了多次执行这一步操作，接下来我们需要实现如何知道当前浏览器是否空闲呢？

![](/images/jueJin/16b2248ed9d1bca.png)

大家都知道在一帧当中，浏览器可能会响应用户的交互事件、执行 JS、进行渲染的一系列计算绘制。假设当前我们的浏览器支持 1 秒 60 帧，那么也就是说一帧的时间为 16.6 毫秒。如果以上这些操作超过了 16.6 毫秒，那么就会导致渲染没有完成并出现掉帧的情况，继而影响用户体验；如果以上这些操作没有耗时 16.6 毫秒的话，那么我们就认为当下存在空闲时间让我们可以去执行任务。

因此接下去我们需要计算出当前帧是否还有剩余时间让我们使用。

```
let frameDeadline = 0
let previousFrameTime = 33
let activeFrameTime = 33
let nextFrameTime = performance.now() - frameDeadline + activeFrameTime
if (
nextFrameTime < activeFrameTime &&
previousFrameTime < activeFrameTime
    ) {
        if (nextFrameTime < 8) {
        nextFrameTime = 8;
    }
    activeFrameTime =
    nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
        } else {
        previousFrameTime = nextFrameTime;
    }
```

以上这部分代码核心就是得出每一帧所耗时间及下一帧的时间。简单来说就是假设当前时间为 5000，浏览器支持 60 帧，那么 1 帧近似 16 毫秒，那么就会计算出下一帧时间为 5016。

得出下一帧时间以后，我们只需对比当前时间是否小于下一帧时间即可，这样就能清楚地知道是否还有空闲时间去执行任务。

那么最后一步操作就是如何在渲染以后才去执行任务。这里就需要用到事件循环的知识了

![](/images/jueJin/16b225dab6a2f2a.png)

想必大家都知道微任务宏任务的区别，这里就不再赘述这部分的内容了。从上图中我们可以发现，在渲染以后只有宏任务是最先会被执行的，因此宏任务就是我们实现这一步的操作了。

但是生成一个宏任务有很多种方式并且各自也有优先级，那么为了最快地执行任务，我们肯定得选择优先级高的方式。在这里我们选择了 `MessageChannel` 来完成这个任务，不选择 `setImmediate` 的原因是因为兼容性太差。

到这里为止，`requestAnimationFrame` + 计算帧时间及下一帧时间 + `MessageChannel` 就是我们实现 `requestIdleCallback` 的三个关键点了。

调度的流程
-----

上文说了这么多，这一小节我们将来梳理一遍调度的整个流程。

*   首先每个任务都会有各自的优先级，通过当前时间加上优先级所对应的常量我们可以计算出 `expriationTime`，**高优先级的任务会打断低优先级任务**
*   在调度之前，判断当前任务**是否过期**，过期的话无须调度，直接调用 `port.postMessage(undefined)`，这样就能在渲染后马上执行过期任务了
*   如果任务没有过期，就通过 `requestAnimationFrame` 启动定时器，在重绘前调用回调方法
*   在回调方法中我们首先需要**计算每一帧的时间以及下一帧的时间**，然后执行 `port.postMessage(undefined)`
*   `channel.port1.onmessage` 会在渲染后被调用，在这个过程中我们首先需要去判断**当前时间是否小于下一帧时间**。如果小于的话就代表我们尚有空余时间去执行任务；如果大于的话就代表当前帧已经没有空闲时间了，这时候我们需要去判断是否有任务过期，**过期的话不管三七二十一还是得去执行这个任务**。如果没有过期的话，那就只能把这个任务丢到下一帧看能不能执行了

调度不会仅仅只有 React 拥有
-----------------

在未来，调度这个功能不会仅仅只有 React 才拥有。因为 React 已经尝试把调度这个模块单独抽离成一个库，这个库在未来能够被大家置入到自己的应用中去提高用户体验。

并且社区也有提案，希望浏览器能自带这方面的功能，具体可以阅读 [这个库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FWICG%2Fmain-thread-scheduling "https://github.com/WICG/main-thread-scheduling")。

最后
--

阅读源码是一个很枯燥的过程，但是收益也是巨大的。如果你在阅读的过程中有任何的问题，都欢迎你在评论区与我交流。

另外写这系列是个很耗时的工程，需要维护代码注释，还得把文章写得尽量让读者看懂，最后还得配上画图，如果你觉得文章看着还行，就请不要吝啬你的点赞。

最后，觉得内容有帮助可以关注下我的公众号 「前端真好玩」咯，会有很多好东西等着你。

![](/images/jueJin/1678800c654a7f3.png)