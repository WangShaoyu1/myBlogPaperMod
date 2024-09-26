---
author: "JinSo"
title: "解析ReactScheduler原理，Solid竟也在使用！"
date: 2024-09-24
description: "本文将从一个新的角度探讨ReactScheduler，揭示它是如何利用几个简单的API实现这一壮举的。"
tags: ["React.js","前端","JavaScript"]
ShowReadingTime: "阅读10分钟"
weight: 797
---
对于 **`React Scheduler`**，它通过将任务切片并异步执行，避免了阻塞浏览器的主线程。

很多人其实都看到过类似的文章了，甚至说去手写调度器，都写的很不错，所以本文将从一个新的角度探讨 **`React Scheduler`**，揭示它是如何利用几个简单的 API 实现这一壮举的。

`React Scheduler` 解析
--------------------

首先，让我们回顾一下浏览器的任务类型：宏任务和微任务，以及它们是如何在事件循环中执行的。

> 图片来源：[浏览器与Node事件循环机制解析\_浏览器与node 的事件循环-CSDN博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_38080573%2Farticle%2Fdetails%2F131147154 "https://blog.csdn.net/weixin_38080573/article/details/131147154")

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e7a5a9c72ec24667bef94408c0ef00e2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmluU28=:q75.awebp?rk3s=f64ab15b&x-expires=1727714451&x-signature=B6cEVLqUyPGb3hfSMhGMXKQH1hY%3D)

在浏览器的一次事件循环中，包括宏任务、微任务和页面渲染三个部分。如果我们假设屏幕的刷新率是 60FPS，那么大约每 16ms 就会执行一次事件循环。

这 16ms 内我们还要留些事件给浏览器处理页面渲染。而剩余的时间我们就需要尽可能的充分利用。

那么我们怎么知道还剩多少空余时间呢，可以使用 **`requestIdleCallback`** 方法，它会插入一个函数，并在浏览器空闲的时候执行，同时传入一个参数包含剩下的空余时间。

但是实际上并没有去使用 **`requestIdleCallback`** 去处理，为什么没有使用 **`requestIdleCallback`** 去实现呢？

1.  兼容性问题
    
    虽然大部分主流浏览器都支持该方法，但是 Safari 等部分浏览器却仍不支持。 [requestIdleCallback - Web API | MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestIdleCallback%23%25E6%25B5%258F%25E8%25A7%2588%25E5%2599%25A8%25E5%2585%25BC%25E5%25AE%25B9%25E6%2580%25A7 "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7")
    
2.  不确定性
    
    **`requestIdleCallback`** 只会在浏览器空闲的时候去调用，这意味着它的执行有很大的不确定性，有可能会有较高的延迟。这对于一些高响应的任务，是没办法处理的。
    
3.  一致性
    
    **`requestIdleCallback`** 属于浏览器 API，脱离了浏览器之后没办法使用。
    

有了这个时间，我们就可以去执行空余时间这么长的任务了，但是我们怎么去确定我们的任务去执行多长时间呢？

### **时间分片**

当然，这个我们肯定确认不了，这里我们就需要提到 React Scheduler 的一个精髓：**时间分片**。

它将大任务分割成无数个小任务，并在每次执行时判断是否还有空余时间，如果有，则继续执行；如果没有，则在下一次事件循环中继续。

而任务的细分属于代码层面的内容，实现的方式没有限制，但宏观上就是分成了一个个小任务。简单示例一下：

javascript

 代码解读

复制代码

``for (let i = 0; i < 1000000000000; i++) {   console.log(`执行第 ${i + 1} 个任务`) } // => let curTask = 0 function task() {   console.log(`执行第 ${curTask} 个任务`) }``

拆分完成之后，我们就可以实现上面的时间分片了，但这里还有一个问题，这次事件循环里的时间被充分利用了，但是怎么到下一个事件循环还能继续执行呢？

再回头看一下事件循环的执行顺序，**宏任务 → 微任务 → 页面渲染**，那么我们就需要在宏任务中插入一条任务来保持分片任务能继续往下执行，这里就需要用到 **`MessageChannel`** 了。

至于为什么使用 **`MessageChannel`** 可以看看这篇文章：

> [React Scheduler 为什么使用 MessageChannel 实现React Scheduler 为什么使用 - 掘金 (juejin.cn)](https://juejin.cn/post/6953804914715803678 "https://juejin.cn/post/6953804914715803678")

利用 **`MessageChannel`** 实现宏任务的插入，我们就能给 时间分片 实现一个闭环，我们来看看吧。

javascript

 代码解读

复制代码

``const yieldInterval = 5 let deadline let scheduleCallback function task(curTask) {   console.log(`执行第 ${curTask} 个任务`) } const taskQueue = Array.from({ length: 1000000 }).map((_, i) => () => task(i)) const init = () => {   const channel = new MessageChannel()   const port = channel.port2 	// 是否应该让出主线程   const shouldYieldToHost = () => {     return performance.now() >= deadline   } 	// postMessage 会触发 onmessage 事件的执行，同时会把该事件加入到宏任务队列当中   channel.port1.onmessage = () => {     if (taskQueue.length > 0) {       deadline = performance.now() + yieldInterval       while (!shouldYieldToHost() && taskQueue.length > 0) {         taskQueue.shift()()       } 			// 宏任务调度       if (taskQueue.length > 0) {         port.postMessage(null)       }     }   }   scheduleCallback = () => {     port.postMessage(null)   } } init() scheduleCallback()``

功能上就是把之前理论的东西做了实践，包括空余时间的使用，宏任务的调度…

这里通过 **`performance.now()`** 来实现空余时间的执行，而没有使用 **`requestIdleCallback`** ，原因后面会解释。

到这里，其实核心的知识都了解的差不多了，主要就是

*   任务分片
*   宏任务调度（保证能持续执行）
*   充分利用浏览器空余时间

最终实现了 **`React Scheduler`** 的 **时间分片** 效果。

`React Scheduler` 精简版 —— Solid
------------------------------

最近在研究 Solid 的过程中，看到了 Solid 对于 React Scheduler 的引用，并稍作修改；并没有实现像 lane 车道等一下内容，只是实现了一个最精简的版本。

同时 Solid 也在 **`transition`** 等延迟处理的一下内容中用到了这一块内容。

接下来，我们来看一个关于 React Scheduler 精简版的实现。

基本原理和上面的实现差不多，只是多了些细节的把控。

> 源码：[github.com/solidjs/sol…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsolidjs%2Fsolid%2Fblob%2Fmain%2Fpackages%2Fsolid%2Fsrc%2Freactive%2Fscheduler.ts "https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/scheduler.ts")

### 分析

Solid 的实现与上述原理基本一致，但增加了一些细节控制。以下是初始化函数 **`setupScheduler`** 的实现（ 对应 **`init`**）：

typescript

 代码解读

复制代码

``function setupScheduler() {   // 这里宏任务调度的实现和前面一致   const channel = new MessageChannel(),     port = channel.port2;   scheduleCallback = () => port.postMessage(null);   channel.port1.onmessage = () => {     // scheduledCallback -> flushWork     if (scheduledCallback !== null) {       const currentTime = performance.now();       deadline = currentTime + yieldInterval;       const hasTimeRemaining = true;       try { 	      // 这里就相当于之前的 while 循环，去执行任务         const hasMoreWork = scheduledCallback(hasTimeRemaining, currentTime);         if (!hasMoreWork) {           scheduledCallback = null;         } else port.postMessage(null);       } catch (error) {         // If a scheduler task throws, exit the current browser task so the         // error can be observed.         port.postMessage(null);         throw error;       }     }   };   if (     navigator &&     (navigator as NavigatorScheduling).scheduling &&     (navigator as NavigatorScheduling).scheduling.isInputPending   ) {     const scheduling = (navigator as NavigatorScheduling).scheduling;     // 判断是否要让出线程给主线程     shouldYieldToHost = () => {       const currentTime = performance.now();       if (currentTime >= deadline) {         if (scheduling.isInputPending!()) {           return true;         }         // There's no pending input. Only yield if we've reached the max         // yield interval.         return currentTime >= maxYieldInterval;       } else {         // There's still time left in the frame.         return false;       }     };   } else {     // `isInputPending` is not available. Since we have no way of knowing if     // there's pending input, always yield at the end of the frame.     shouldYieldToHost = () => performance.now() >= deadline;   } }``

前半部分的原理和之前的基本一致，利用 **`MessageChannel`** 去调度宏任务，这里的任务执行是通过 **`scheduledCallback`** 去处理的。

后半部分的话，是处理 **`shouldYieldToHost`** 方法，用于判断是否需要让出主线程。

### `Scheduling`

这里 Solid 进行了特殊处理，利用 **`navigator.scheduling`** 去获取浏览器的调度信息再进行处理，更好的利用时间去处理任务，但 **`navigator.scheduling`** 目前还属于实验性 API。

> [Navigator：scheduling 属性 - Web API | MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FNavigator%2Fscheduling "https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/scheduling")

#### **`isInputPending`**

尤其是里面的 **`isInputPending`** 方法，可以看一下 MDN 的介绍：

> **`Scheduling`** 接口的 **`isInputPending`** 方法允许您检查事件队列中是否有待处理的输入事件，这表明用户正在尝试与页面交互。 如果您要运行任务队列，并且您希望定期让位于主线程以允许用户交互，以便应用程序尽可能保持响应式和高性能，则此功能非常有用。**`isInputPending`** 允许你只在有 input 待处理时让步，而不必以任意间隔进行。
> 
> [Scheduling: isInputPending() method - Web APIs | MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FScheduling%2FisInputPending "https://developer.mozilla.org/en-US/docs/Web/API/Scheduling/isInputPending")

有了此方法，可以最大限度去调度任务，同时在观察到用户对页面进行交互后把线程交还给浏览器。

接下来，我看看 **`scheduledCallback`** 的实现，也就是任务的执行逻辑（对应 **`while`**）：

typescript

 代码解读

复制代码

`function flushWork(hasTimeRemaining: boolean, initialTime: number) {   // We'll need a host callback the next time work is scheduled.   isCallbackScheduled = false;   isPerformingWork = true;   try {     return workLoop(hasTimeRemaining, initialTime);   } finally {     currentTask = null;     isPerformingWork = false;   } }`

里面主要是对状态做了一些处理，主要看 **`workLoop`** 函数。

typescript

 代码解读

复制代码

`function workLoop(hasTimeRemaining: boolean, initialTime: number) {   let currentTime = initialTime;   currentTask = taskQueue[0] || null;   while (currentTask !== null) {     // 任务过期或者没有时间或需要让出线程     if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost!())) {       // This currentTask hasn't expired, and we've reached the deadline.       break;     }     // 执行任务     const callback = currentTask.fn;     if (callback !== null) {       currentTask.fn = null;       const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;       callback(didUserCallbackTimeout);       currentTime = performance.now();       if (currentTask === taskQueue[0]) {         taskQueue.shift();       }     } else taskQueue.shift();     // 分片处理，准备好下一个任务     currentTask = taskQueue[0] || null;   }   // 返回是否还要任务需要调度，有的话，则进行后续的宏任务调度   return currentTask !== null; }`

接下来，我们看看任务是怎么加入队列的：**`requestCallback`**

typescript

 代码解读

复制代码

`export function requestCallback(fn: () => void, options?: { timeout: number }): Task {   if (!scheduleCallback) setupScheduler();   let startTime = performance.now(),     timeout = maxSigned31BitInt;   if (options && options.timeout) timeout = options.timeout; 	// 初始化一个任务   const newTask: Task = {     id: taskIdCounter++,     fn,     startTime,     expirationTime: startTime + timeout   };   enqueue(taskQueue, newTask);   if (!isCallbackScheduled && !isPerformingWork) {     isCallbackScheduled = true;     // 这里对 scheduledCallback 进行处理     scheduledCallback = flushWork;     // 这里会调度该宏任务     scheduleCallback!();   }   return newTask; }`

整体过程就是创建任务 → 加入任务队列 → 调度任务。

最后来看看 **`enqueue`** 里对任务做了什么处理。

typescript

 代码解读

复制代码

`function enqueue(taskQueue: Task[], task: Task) {   // 按过期时间找到插入位置   function findIndex() {     let m = 0;     let n = taskQueue.length - 1;     while (m <= n) {       const k = (n + m) >> 1;       const cmp = task.expirationTime - taskQueue[k].expirationTime;       if (cmp > 0) m = k + 1;       else if (cmp < 0) n = k - 1;       else return k;     }     return m;   }   taskQueue.splice(findIndex(), 0, task); }`

可以看出来，任务队列整体是按照过期时间进行排序的。

通过二分的方式，找到合适的位置进行插入即可。

其实整体看下来也没什么，和之前给的那个案例的原理是完全一致的，只是多了细节的处理。

只要了解了原理，其他这些额外的内容都是很好理解的。

最后贴一下 Solid 实现的 React Scheduler 的精简版的完整代码，可以梳理一下整体过程：

typescript

 代码解读

复制代码

``// Basic port modification of Reacts Scheduler: <https://github.com/facebook/react/tree/master/packages/scheduler> export interface Task {   id: number;   fn: ((didTimeout: boolean) => void) | null;   startTime: number;   expirationTime: number; } // experimental new feature proposal stuff type NavigatorScheduling = Navigator & {   scheduling: { isInputPending?: () => boolean }; }; let taskIdCounter = 1,   isCallbackScheduled = false,   /**     当时是否在执行任务    */   isPerformingWork = false,   taskQueue: Task[] = [],   currentTask: Task | null = null,   /**     利用 navigator.scheduling & deadline & yieldInterval 判断是否需要让出线程给 Host    */   shouldYieldToHost: (() => boolean) | null = null,   yieldInterval = 5,   deadline = 0,   maxYieldInterval = 300,   /**     用于在下一次浏览器执行时，插入一条宏任务    */   scheduleCallback: (() => void) | null = null,   /**     用于宏任务中进行调度的回调，与 scheduleCallback 结合，实现分片    */   scheduledCallback: ((hasTimeRemaining: boolean, initialTime: number) => boolean) | null = null; const maxSigned31BitInt = 1073741823; /* istanbul ignore next */ function setupScheduler() {   // 利用 MessageChannel 实现宏任务调度   const channel = new MessageChannel(),     port = channel.port2;     /**       在每次调度的最后，执行一次 postMessage，然后就可以把 onmessage 任务加入到下一次的宏任务队列了       而这个宏任务就会在下一次浏览器渲染完成之后去执行，这样就不会影响浏览器       也是通过这种方式实现把整个调度任务切分成很多小任务      */   scheduleCallback = () => port.postMessage(null);   channel.port1.onmessage = () => {     // scheduledCallback -> flushWork     if (scheduledCallback !== null) {       const currentTime = performance.now();       deadline = currentTime + yieldInterval;       const hasTimeRemaining = true;       try {         const hasMoreWork = scheduledCallback(hasTimeRemaining, currentTime);         if (!hasMoreWork) {           scheduledCallback = null;         } else port.postMessage(null);       } catch (error) {         // If a scheduler task throws, exit the current browser task so the         // error can be observed.         port.postMessage(null);         throw error;       }     }   };   if (     navigator &&     (navigator as NavigatorScheduling).scheduling &&     (navigator as NavigatorScheduling).scheduling.isInputPending   ) {     const scheduling = (navigator as NavigatorScheduling).scheduling;     // 判断是否要让出线程给主线程     shouldYieldToHost = () => {       const currentTime = performance.now();       if (currentTime >= deadline) {         // There's no time left. We may want to yield control of the main         // thread, so the browser can perform high priority tasks. The main ones         // are painting and user input. If there's a pending paint or a pending         // input, then we should yield. But if there's neither, then we can         // yield less often while remaining responsive. We'll eventually yield         // regardless, since there could be a pending paint that wasn't         // accompanied by a call to `requestPaint`, or other main thread tasks         // like network events.         if (scheduling.isInputPending!()) {           return true;         }         // There's no pending input. Only yield if we've reached the max         // yield interval.         return currentTime >= maxYieldInterval;       } else {         // There's still time left in the frame.         return false;       }     };   } else {     // `isInputPending` is not available. Since we have no way of knowing if     // there's pending input, always yield at the end of the frame.     shouldYieldToHost = () => performance.now() >= deadline;   } } function enqueue(taskQueue: Task[], task: Task) {   // 按过期时间找到插入位置   function findIndex() {     let m = 0;     let n = taskQueue.length - 1;     while (m <= n) {       const k = (n + m) >> 1;       const cmp = task.expirationTime - taskQueue[k].expirationTime;       if (cmp > 0) m = k + 1;       else if (cmp < 0) n = k - 1;       else return k;     }     return m;   }   taskQueue.splice(findIndex(), 0, task); } export function requestCallback(fn: () => void, options?: { timeout: number }): Task {   // 通过初始化 setupScheduler，生成一个 scheduleCallback，用于调度到下一次宏任务作为收尾   if (!scheduleCallback) setupScheduler();   let startTime = performance.now(),     timeout = maxSigned31BitInt;   if (options && options.timeout) timeout = options.timeout;   const newTask: Task = {     id: taskIdCounter++,     fn,     startTime,     expirationTime: startTime + timeout   };   enqueue(taskQueue, newTask);   if (!isCallbackScheduled && !isPerformingWork) {     isCallbackScheduled = true;     scheduledCallback = flushWork;     // 这里会调度该宏任务     scheduleCallback!();   }   return newTask; } export function cancelCallback(task: Task) {   task.fn = null; } function flushWork(hasTimeRemaining: boolean, initialTime: number) {   // We'll need a host callback the next time work is scheduled.   isCallbackScheduled = false;   isPerformingWork = true;   try {     return workLoop(hasTimeRemaining, initialTime);   } finally {     currentTask = null;     isPerformingWork = false;   } } function workLoop(hasTimeRemaining: boolean, initialTime: number) {   let currentTime = initialTime;   currentTask = taskQueue[0] || null;   while (currentTask !== null) {     // task expired or no time remain     if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost!())) {       // This currentTask hasn't expired, and we've reached the deadline.       break;     }     // execute task     const callback = currentTask.fn;     if (callback !== null) {       currentTask.fn = null;       const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;       callback(didUserCallbackTimeout);       currentTime = performance.now();       if (currentTask === taskQueue[0]) {         taskQueue.shift();       }     } else taskQueue.shift();     // update new task to be executed     currentTask = taskQueue[0] || null;   }   // if currentTask is null, it's explained that there is none of tasks   // Return whether there's additional work   return currentTask !== null; }``