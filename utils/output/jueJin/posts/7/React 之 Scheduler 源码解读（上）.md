---
author: "冴羽"
title: "React 之 Scheduler 源码解读（上）"
date: 2022-11-28
description: "前言 在《React 之从 requestIdleCallback 到时间切片》中，我们讲到，React 会把更新做成一个个任务，放进任务队列里。任务有不同的优先级、开始时间等，那怎么判断哪些任务先执"
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:61,comments:0,collects:42,views:7525,"
---
> 本文为稀土掘金技术社区首发签约文章，14 天内禁止转载，14 天后未获授权禁止转载，侵权必究！
> 
> 本篇是 React 基础与进阶系列第 13 篇，[关注专栏](https://juejin.cn/column/7142674773930147853 "https://juejin.cn/column/7142674773930147853")

前言
--

在[《React 之从 requestIdleCallback 到时间切片》](https://juejin.cn/post/7167335700424196127 "https://juejin.cn/post/7167335700424196127")中，我们讲到，React 会把更新做成一个个任务，放进任务队列里。任务有不同的优先级、开始时间等，那怎么判断哪些任务先执行呢？如果一个任务执行太久，如何及时中断、让出线程，等浏览器空闲了再接着执行呢？

React 中，用来处理这些工作的就是 Scheduler。

Scheduler，中文译为调度器、调度程序等。调度在计算机中指的是分配工作所需资源的方法。进行调度工作的程序则被称为调度器。

本篇我们直接来看 Scheduler 源码，为什么连 React 架构什么的都没讲呢，就可以直接看 Scheduler 源码呢？

这是因为 Scheduler 被 React 做成了一个单独的包，它与 React 相互独立，不过目前还只被用于 React 内部，也没有公开的 API。

学习源码最好的方式自然是直接看源码，第一次看肯定会有很多不熟悉、感到疑惑的地方，但多看几遍，认知成本就会降低，再看那些原理解读的文章就会豁然开朗。我们也是采用这样的顺序，先源码解读，再进行总体的原理总结。

scheduleCallback
----------------

现在我们打开 Scheduler 的[核心源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fv18.2.0%2Fpackages%2Fscheduler%2Fsrc%2Fforks%2FScheduler.js "https://github.com/facebook/react/blob/v18.2.0/packages/scheduler/src/forks/Scheduler.js")，为了保证我们看的源码一致，这里采用的是 v18.2.0 版本的代码，一共 629 行，说简单也简单，我们从 `unstable_scheduleCallback` 函数开始看起，这个函数是调度的开始。

```javascript
let getCurrentTime = () => performance.now();

// Scheduler 优先级划分，数字越小优先级越高，0 表示没有优先级
const NoPriority = 0;
const ImmediatePriority = 1;
const UserBlockingPriority = 2;
const NormalPriority = 3;
const LowPriority = 4;
const IdlePriority = 5;

// Scheduler 根据优先级设置的对应 timeout 时间，越小表示越紧急
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
var IDLE_PRIORITY_TIMEOUT = 1073741823;

// 普通任务队列
var taskQueue = [];
// 延时任务队列
var timerQueue = [];

var taskIdCounter = 1;

var isPerformingWork = false;

var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;

    function unstable_scheduleCallback(priorityLevel, callback, options) {
    var currentTime = getCurrentTime();
    
    // 任务开始调度的时间
    var startTime;
        if (typeof options === 'object' && options !== null) {
        var delay = options.delay;
            if (typeof delay === 'number' && delay > 0) {
            startTime = currentTime + delay;
                } else {
                startTime = currentTime;
            }
                } else {
                startTime = currentTime;
            }
            
            // 任务能被拖延执行多久
            var timeout;
                switch (priorityLevel) {
                case ImmediatePriority:
                timeout = IMMEDIATE_PRIORITY_TIMEOUT;
                break;
                case UserBlockingPriority:
                timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
                break;
                case IdlePriority:
                timeout = IDLE_PRIORITY_TIMEOUT;
                break;
                case LowPriority:
                timeout = LOW_PRIORITY_TIMEOUT;
                break;
                case NormalPriority:
                default:
                timeout = NORMAL_PRIORITY_TIMEOUT;
                break;
            }
            
            var expirationTime = startTime + timeout;
            
                var newTask = {
                id: taskIdCounter++,
                callback,
                priorityLevel,
                startTime,
                expirationTime,
                sortIndex: -1,
                };
                
                // 如果是延时任务，将其放到 timerQueue
                    if (startTime > currentTime) {
                    newTask.sortIndex = startTime;
                    push(timerQueue, newTask);
                        if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
                        // 任务列表空了，而这就是最早的 delay 任务
                            if (isHostTimeoutScheduled) {
                            cancelHostTimeout();
                                } else {
                                isHostTimeoutScheduled = true;
                            }
                            // 安排调度
                            requestHostTimeout(handleTimeout, startTime - currentTime);
                        }
                    }
                    // 如果是普通任务，就将其放到 taskQueue
                        else {
                        newTask.sortIndex = expirationTime;
                        push(taskQueue, newTask);
                            if (!isHostCallbackScheduled && !isPerformingWork) {
                            isHostCallbackScheduled = true;
                            requestHostCallback(flushWork);
                        }
                    }
                    
                    return newTask;
                }
```

### 1\. 入参

`unstable_scheduleCallback` 这个函数会被传入三个参数，`priorityLevel`, `callback`, `options`

为了让读者更有体感，我们使用 `create-react-app` 创建的默认代码，调试下 Scheduler 的源码，打印下这三个参数的值：

![image.png](/images/jueJin/3522151c04384dc.png)

`priorityLevel`，顾名思义，优先级等级，根据 `react/packages/scheduler/src/SchedulerPriorities.js`中的定义，分为从 0 到 5，一共 6 个等级，根据等级的名字也可以看出，数字越小，优先级越高，0 表示没有优先级

```javascript
// react/packages/scheduler/src/SchedulerPriorities.js
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;
```

`callback`，根据打印的结果，它被传入的是一个叫做 `performConcurrentWorkOnRoot` 的函数，它的定义在 `react-reconciler/src/ReactFiberWorkLoop.old.js`这个文件，它被调用的地方在同文件的 `ensureRootIsScheduled` 函数：

```javascript
// https://github.com/facebook/react/blob/v18.2.0/packages/react-reconciler/src/ReactFiberWorkLoop.old.js

    function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
    // ...
    
    // Schedule a new callback.
    let newCallbackNode;
    
    let schedulerPriorityLevel;
        switch (lanesToEventPriority(nextLanes)) {
        case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
        case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
        case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
        case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
        default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root),
    );
    
    
    root.callbackPriority = newCallbackPriority;
    root.callbackNode = newCallbackNode;
}
```

其中 `scheduleCallback` 就是我们的 `unstable_scheduleCallback` 函数，而关于实际传入的 performConcurrentWorkOnRoot 函数具体做了什么，现在我们还不需要关心，我们只要知道这就是任务队列里的任务的执行函数就对了。

从 `ensureRootIsScheduled` 的源码我们也可以看出，React 有一套优先级，Scheduler 也有一套优先级，`ensureRootIsScheduled` 明显的做了一个优先级对应关系。然后`ensureRootIsScheduled`把 `scheduleCallback` 函数的返回值，挂载到 `root.callbackNode`。目前知道这些就够了。

`options`，可选项，其中有一个 delay 属性，如果有 delay 属性，表示这是一个延时任务，要多少毫秒后再安排执行。

### 2\. startTime

现在我们接着看源码：

```javascript
var startTime;
    if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
        if (typeof delay === 'number' && delay > 0) {
        startTime = currentTime + delay;
            } else {
            startTime = currentTime;
        }
            } else {
            startTime = currentTime;
        }
```

这里声明了一个 `startTime`，它表示这个任务开始调度的时间，它的计算逻辑是`startTime = currentTime + options.delay`。

虽然名为开始时间，但实际创建了任务，React 也不会立刻就去执行，只能说，这是一个安排调度的时间，非要举例的话，这有点像你去银行，点击取号的那个时间。有了这个时间，可以方便的知道你已经在这家银行排队排了多久。

### 3\. timeout

接下来我们声明了 `timeout`，它跟优先级相互对应，表示这个任务能被拖延执行多久。

我们知道 React 中的任务是可以被打断的，低优先级的任务可以被高优先级任务打断，但任务也不能一直被打断，所以要设置一个时间，超出某个时间就一定要执行。不同的优先级任务对应不同的超时时间，像普通优先级的任务就是 5000ms。

```javascript
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
var IDLE_PRIORITY_TIMEOUT = 1073741823;

var timeout;
    switch (priorityLevel) {
    case ImmediatePriority:
    timeout = IMMEDIATE_PRIORITY_TIMEOUT;
    break;
    // ...
}
```

### 4\. expirationTime

由 startTime + timeout 算出 expirationTime，expirationTime 表示这个任务的过期时间，这个值越小，说明越快过期，任务越紧急，越要优先执行。

### 5\. newTask

接下来我们声明了一个 task 对象，它就是被放进任务队列里的对象，注意它的 sortIndex，它就是任务排序的 key 值，这个值越小，在排序中就会越靠前。

```javascript
// 初始任务
    var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
    };
```

为了让读者更有体感，我们打印一下最终的 newTask 的值：

![image.png](/images/jueJin/fc24039add4e49a.png)

### 6\. taskQueue 和 timerQueue

```javascript
    if (startTime > currentTime) {
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
        if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
        // 任务列表空了，而这就是最早的 delay 任务
            if (isHostTimeoutScheduled) {
            cancelHostTimeout();
                } else {
                isHostTimeoutScheduled = true;
            }
            // 安排调度
            requestHostTimeout(handleTimeout, startTime - currentTime);
        }
    }
    // 如果是普通任务，就将其放到 taskQueue
        else {
        newTask.sortIndex = expirationTime;
        push(taskQueue, newTask);
            if (!isHostCallbackScheduled && !isPerformingWork) {
            isHostCallbackScheduled = true;
            requestHostCallback(flushWork);
        }
    }
    
```

这里是最核心的逻辑，作用是将创建的任务分到不同的任务队列里，然后安排调度。

在`unstable_scheduleCallback`函数之外，我们声明了两个全局变量：`taskQueue` 和 `timerQueue`，它们用来表示任务队列。根据代码逻辑，如果有设置 delay 时间，那么它就会被放入 timerQueue 中，所以 timerQueue 表示要延时执行的任务，taskQueue 对应表示现在就要执行的任务。不同的文章中对这两种任务类型的描述不一样，比如有的将其描述为同步任务、异步任务。在本系列文章中，我们都用普通任务和延时任务来表达。

虽然`taskQueue` 和 `timerQueue`声明的是数组结构，但其实它是一个最小堆数据结构映射成的数组结构，当我们执行比如 `push(timerQueue, newTask)` 的时候，它不像 JavaScript 的 push ，向数组的末尾直接添加一个元素，而是在添加之后，又做了一层排序，将最小值移动到数组的第一个元素，这样 React 可以快捷的取出最小值，对应到任务列表，也就是优先级最高的任务。

那判断大小的依据是什么呢？就是根据 newTask 的 sortIndex 字段，它的初始值是 -1，在这段代码里，如果是普通任务，使用 expirationTime 作为 sortIndex 字段，如果是延时任务，则使用 startTime 作为 sortIndex 字段。这个很好理解，任务都已经排上了，那就用过期时间，过期时间越小，说明离现在越近，任务优先级越高，而延时任务，表示任务还没有排上，那就用排上的时间作为排序字段，等排上了，React 其实会将任务从 timerQueue 中移到 taskQueue 中。

requestHostCallback
-------------------

我们先看普通任务的执行逻辑，再看延时任务的执行逻辑。

如果你看过[《React 之从 requestIdleCallback 到时间切片》](https://juejin.cn/post/7167335700424196127 "https://juejin.cn/post/7167335700424196127")这篇，这里的逻辑想必你已经熟悉了，不过没关系，我们再看一遍：

```javascript
let isMessageLoopRunning = false;

    function requestHostCallback(callback) {
    scheduledHostCallback = callback;
        if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        schedulePerformWorkUntilDeadline();
    }
}
```

我们将 callback 赋值给全局的 scheduledHostCallback 变量，callback 就是我们传入的 flushWork 函数，接下来判断 isMessageLoopRunning，然后执行 schedulePerformWorkUntilDeadline

schedulePerformWorkUntilDeadline
--------------------------------

```javascript
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
    let schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
    };
```

简单来说，就是让出线程，让浏览器可以处理用户输入或者动画，当浏览器空闲了，它会执行 performWorkUntilDeadline 这个函数，我们看下 performWorkUntilDeadline 这个函数：

performWorkUntilDeadline
------------------------

```javascript
let startTime = -1;
    const performWorkUntilDeadline = () => {
        if (scheduledHostCallback !== null) {
        const currentTime = getCurrentTime();
        startTime = currentTime;
        const hasTimeRemaining = true;
        
        let hasMoreWork = true;
            try {
            hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
                } finally {
                    if (hasMoreWork) {
                    schedulePerformWorkUntilDeadline();
                        } else {
                        isMessageLoopRunning = false;
                        scheduledHostCallback = null;
                    }
                }
                    } else {
                    isMessageLoopRunning = false;
                }
                needsPaint = false;
                };
```

注意这里的 startTime 不是 `unstable_scheduleCallback` 函数中的 startTime，它是一个全局变量，用于记录这次批量任务执行的开始时间。

为什么说是批量任务呢，因为 React 并不是每一个任务执行完都执行 schedulePerformWorkUntilDeadline 让出线程的，而是执行完一个任务，看看过了多久，如果时间不超过 5ms，那就再执行一个任务，等做完一个任务，发现过了 5ms，这才让出线程，所以 React 是一批一批任务执行的，startTime 记录的是这一批任务的开始时间，而不是单个任务的开始时间。

scheduledHostCallback 就是我们的 flushWork，执行 `scheduledHostCallback(hasTimeRemaining, currentTime)`相当于执行 `flushWork(hasTimeRemaining, currentTime)`，它会返回一个 hasMoreWork 布尔值，顾名思义，如果为 true，表示队列还有任务，那就执行 schedulePerformWorkUntilDeadline，让出线程，如果为 false，表示队列执行完毕，isMessageLoopRunning 设为 false，scheduledHostCallback 也置为空。

我们也可以想到，flushWork 的作用就是批量处理任务。我们来看 flushWork 的代码：

flushWork
---------

```javascript
function flushWork(hasTimeRemaining, initialTime)
// We'll need a host callback the next time work is scheduled.
isHostCallbackScheduled = false;
    if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
}

isPerformingWork = true;
const previousPriorityLevel = currentPriorityLevel;
    try {
    return workLoop(hasTimeRemaining, initialTime);
        } finally {
        currentTask = null;
        currentPriorityLevel = previousPriorityLevel;
        isPerformingWork = false;
    }
}
```

你会发现，进行了一堆判断，主要的执行还是在 workLoop 函数中，我们看 workLoop：

workLoop
--------

```javascript
    function workLoop(hasTimeRemaining, initialTime) {
    let currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek(taskQueue);
        while (currentTask !== null &&!isSchedulerPaused) {
        if (
        currentTask.expirationTime > currentTime &&
        (!hasTimeRemaining || shouldYieldToHost())
            ) {
            // This currentTask hasn't expired, and we've reached the deadline.
            break;
        }
        const callback = currentTask.callback;
            if (typeof callback === 'function') {
            currentTask.callback = null;
            currentPriorityLevel = currentTask.priorityLevel;
            const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
            const continuationCallback = callback(didUserCallbackTimeout);
            currentTime = getCurrentTime();
                if (typeof continuationCallback === 'function') {
                currentTask.callback = continuationCallback;
                advanceTimers(currentTime);
                return true;
                    } else {
                        if (currentTask === peek(taskQueue)) {
                        pop(taskQueue);
                    }
                    advanceTimers(currentTime);
                }
                    } else {
                    pop(taskQueue);
                }
                currentTask = peek(taskQueue);
            }
            // Return whether there's additional work
                if (currentTask !== null) {
                return true;
                    } else {
                    const firstTimer = peek(timerQueue);
                        if (firstTimer !== null) {
                        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
                    }
                    return false;
                }
            }
```

这段代码看似很长，主要注意着几个点：

### advanceTimers

`advanceTimers(currentTime)`，它的作用是遍历一遍 timerQueue 中的任务，判断 startTime 是否到了 currentTime，如果到了，就将其添加到 taskQueue 中。

### while 循环

这段代码执行了 while 循环， 作用在于不断执行任务列表里的任务，那什么时候不再执行呢，代码中给出的条件是 ：

```javascript
if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost()))
```

简单的来说，如果当前任务时间还没有过期并且 shouldYieldToHost 函数返回为 true，那么我们就不再执行了，shouldYieldToHost 函数我们稍后再看。

### continuationCallback

```javascript
const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
const continuationCallback = callback(didUserCallbackTimeout);
currentTime = getCurrentTime();
    if (typeof continuationCallback === 'function') {
    currentTask.callback = continuationCallback;
    advanceTimers(currentTime);
    return true;
        } else {
            if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
        }
        advanceTimers(currentTime);
    }
```

为什么会有 continuationCallback 函数呢？这就是任务的恢复和执行。 我们可以这样理解，不止完成多个任务的时候会被打断，单个任务在执行的时候也会被打断，如果单个任务在执行的时候被打断，那么就返回 continuationCallback 函数，并将其赋值给 callback 属性，等待下次执行。

shouldYieldToHost
-----------------

```javascript
let frameInterval = 5;

    function shouldYieldToHost() {
    const timeElapsed = getCurrentTime() - startTime;
        if (timeElapsed < frameInterval) {
        return false;
    }
    
    return true;
}
```

shouldYieldToHost 的效果很简单，判断时间过了多久，如果大于等于 5ms，那就让出线程。

advanceTimers
-------------

```javascript
    function advanceTimers(currentTime: number) {
    // Check for tasks that are no longer delayed and add them to the queue.
    let timer = peek(timerQueue);
        while (timer !== null) {
            if (timer.callback === null) {
            // Timer was cancelled.
            pop(timerQueue);
                } else if (timer.startTime <= currentTime) {
                // Timer fired. Transfer to the task queue.
                pop(timerQueue);
                timer.sortIndex = timer.expirationTime;
                push(taskQueue, timer);
                    } else {
                    // Remaining timers are pending.
                    return;
                }
                timer = peek(timerQueue);
            }
        }
```

advanceTimers 的内容也很简单，如果 callback 为空，说明任务已经执行完毕，那就清除掉，如果任务的 startTime <= currentTime，说明任务的 startTime 已经过了，我们将其从 timerQueue 中移到 taskQueue 中安排执行。

至此，一个普通任务的调度过程的源码就分析完了。

总结
--

当创建一个调度任务的时候（unstable\_scheduleCallback），会传入优先级（priorityLevel）、执行函数（callback），可选项（options），React 会根据任务优先级创建 task 对象，并根据可选项中的 delay 参数判断是将任务放到普通任务队列（taskQueue），还是延时任务队列（timerQueue）。

当放到普通任务队列后，便会执行 requestHostCallback(flushWork)，requestHostCallback 的作用是借助 Message Channel 将线程让出来，让浏览器可以处理动画或者用户输入，当浏览器空闲的时候，便会执行 flushWork 函数，flushWork 的作用是执行任务队列里的任务，它会执行 advanceTimers，不断地将 timerQueue 中到期的任务添加到 taskQueue，它会执行 taskQueue 中优先级最高的任务，当任务函数执行完毕之后，它会判断过了多久，如果时间还没有到一个切片时间（5ms），便会执行队列里的下个优先级最高的任务，一直到超出切片时间，当超出时间之后，React 会让出线程，等待浏览器下次继续执行 flushWork，也就是再次遍历执行任务队列，直到任务队列中的任务全部完成。

普通任务队列的处理流程，我们已经了解了，下篇我们讲讲延时任务的流程。

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")
5.  [React 之 Race Condition](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")
6.  [React 之 Suspense](https://juejin.cn/post/7163934860694781989 "https://juejin.cn/post/7163934860694781989")
7.  [React 之从视觉暂留到 FPS、刷新率再到显卡、垂直同步再到16ms的故事](https://juejin.cn/post/7164394153848078350 "https://juejin.cn/post/7164394153848078350")
8.  [React 之 requestAnimationFrame 执行机制探索](https://juejin.cn/post/7165780929439334437 "https://juejin.cn/post/7165780929439334437")
9.  [React 之 requestIdleCallback 来了解一下](https://juejin.cn/post/7166547963517337614 "https://juejin.cn/post/7166547963517337614")
10.  [React 之从 requestIdleCallback 到时间切片](https://juejin.cn/post/7167335700424196127 "https://juejin.cn/post/7167335700424196127")
11.  [React 之最小堆（min heap）](https://juejin.cn/post/7168283003037155359 "https://juejin.cn/post/7168283003037155359")
12.  [React 之如何调试源码](https://juejin.cn/post/7168821587251036167 "https://juejin.cn/post/7168821587251036167")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。