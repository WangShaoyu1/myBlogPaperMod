---
author: ""
title: "React Native原理之跨端通信机制"
date: 2022-02-28
description: "本文讲述了安卓中 React Native 的通信原理，解释了业务中如何实现 Native 模块和 JS 模块的桥接，读者可以加深对React Native或者其他跨端方案的通信原理的了解。"
tags: ["React Native中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:56,comments:6,collects:102,views:7244,"
---
> 图片来源：[unsplash.com/photos/gy08…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2Fgy08FXeM2L4 "https://unsplash.com/photos/gy08FXeM2L4")

> 作者：[五廿](https://juejin.cn/user/2163450444000909 "https://juejin.cn/user/2163450444000909")

跨端通信
----

在移动端开发场景中，能使用一份代码就能同时在安卓和 iOS 系统上运行 APP 的方案，熟称为跨端方案。而 Webview ，React Native 都是云音乐大前端团队用的比较多的跨端方案，这些方案虽然能提高开发效率，但它们不能像原生语言一样直接调用系统的能力，于是在做 HTML5（以下简称 H5） 或者 React Native（以下简称 RN） 需求的时候，开发者们经常碰到要调用 Native 能力的情况。Native 能力用原生语言编写，有自己的运行环境，RN 页面使用 JS 编写，也有独立的运行环境，这种跨越运行环境的调用被称为`跨端通信`。

![webView jsb](/images/jueJin/c6fa2502b58501f.png)

H5 中的`跨端通信`称为 `JSBridge`，在进行一次 JSBridge 调用的时候会携带调用参数，默认有 4 个参数：

```makefile
ModuleId: 模块 ID
MethodId: 方法 ID
params: 参数
CallbackId: JS 回调名
```

其中 `ModuleId` 和 `MethodId` 能定位到具体调用的原生方法，`params` 参数作为原生方法调用的参数，最后通过 `CallbackId` 回调 JS 的回调函数，H5 就能从回调函数中拿到调用结果。该流程中主要使用了 Webview 容器中`拦截请求`和`客户端调用 JS 函数`的能力，比如安卓中通常使用的是 `WebChromeClient.onJsPrompt` 方法来拦截 H5 的请求，`evaluateJavascript` 方法用来执行回调。但是 React Native 中没有引入 Webview 来实现这些调用的能力，它采用了完全不同的方式来处理。另外，在云音乐团队的 APP 中， 会同时存在 H5 和 RN 页面，也就是同一个 APP 中两种跨端通信方式并存，但它们最后调用的原生方法却是来自同一个原生模块。本文主要从 Android 系统的 RN 实现来介绍 RN 的通信机制和桥接能力（以下简称 Bridge），并结合以上通信场景中会碰到的问题来讲解如何实现一个业务中可用的 Bridge。大体由三部分组成，首先介绍 RN 中不同的组成模块和它们各自的角色；第二部分是各个模块之间的调用方式和具体的示例；最后一部分探讨业务中的 Bridge 的实现。

RN 组成
-----

在 RN 中，主要有三个重要的组成模块：`平台层`（ Android 或者 OC 环境），`桥接层`（ C++ ）和`JS 层`。

*   平台层负责原生组件的渲染和提供各式各样的原生能力，由原生语言实现；
*   桥接模块负责解析 JS 代码，JS 和 Java/OC 代码互调，由 C++ 语言实现；
*   JS 层负责跨端页面具体的业务逻辑。

![rn 通信模块](/images/jueJin/4d61cc9d83879be.png)

相比起 Webview 的结构来说，RN 的结构多了一层`桥接层`，也就是 C++ 层。文章先来介绍一下这个模块的作用，以及为什么会多出这么一个模块。

### 桥接层（C++ 层）

React Native 和 H5 一样，使用了 JS 作为跨端页面的开发语言，因此它必须要有一个 JS 执行引擎，而在使用 H5 的情况下，Webview 是 JS 的执行引擎，同时 Webview 还是页面的渲染引擎。RN 不一样的地方在于，已经有了自己的渲染层，这个功能交给了 Java 层，因为 RN 的 JS 组件代码最后都会渲染成原生组件。因此 RN 只需要一个 JS 执行引擎来跑 React 代码。 RN 团队选择了 `JSCore` 作为 JS 的执行引擎，而 `JSCore` 的对外接口是用 C 和 C++ 编写的。因此平台层的 Java 代码 / OC 代码想要通过 `JSCore` 拿到 JS 的模块和回调函数，只能通过 C++ 提供的接口获取，再加上 C++ 在 iOS 和安卓系统上也有良好的跨端运行的功能，选它作为桥接层是不错的选择。

### JSCore

JSCore 是桥接层中的主要模块，它是 RN 架构中的 JS 引擎，负责 JS 代码的加载和解析。先来看下它的主要 API ：

```sql
JSContextGetGlobalObject：获取JavaScript运行环境的Global对象。
JSObjectSetProperty/JSObjectGetProperty：JavaScript对象的属性操作：set和get。
JSEvaluateScript：在JavaScript环境中执行一段JS脚本。
JSObjectCallAsFunction：在JavaScript环境中调用一个JavaScript函数
```

通过 API 可以看出来，开发者可以用 `JSEvaluateScript` 在 JSCore 环境中执行一段 JS 代码，也可以通过 `JSContextGetGlobalObject` 拿到 JS 上下文的 Global 变量，然后把它转化成 C++ 可以使用的数据结构并且操作它，注入 API。而 `JSObjectSetProperty` 和 `JSContextGetGlobalObject` 也是比较重要的两个 API ，稍后会在通信流程中发挥作用。

### Native 模块和 JavaScript 模块

说起通信的话，整个过程肯定存在信源和信宿，也就是消息的发送者和接收者，在 RN 的通信中，它们是 Native 和 JS 的模块，它们向对方提供能力都是以模块为功能单位的，类似 JSBridge 协议中的 ModuleID 的概念。

*   Native 模块在 Android 系统下是 Java 模块，由平台代码实现，JS 通过模块 ID（moduleID） 和方法 ID（methodID） 来进行调用，一般都在 RN 源码工程的 `java/com/facebook/react/modules/` 目录下，可以给 RN 页面开放原生系统的能力，如计时器的实现模块 `Timing`，给 JS 代码提供计时器的能力。
*   JavaScript 模块是由 JS 实现，代码在 `/Libraries/ReactNative/` 目录下，如 App 启动模块 `AppRegistery` ，对 Java 环境来说，作用是提供操作 JS 环境的 API，如回调，广播等。Java 的调用方法是通过 JS 暴露出来的 `callFunctionReturnFlushedQueue` API。

JS 环境中会维护一份所有 Native 模块的 moduleID 和 methodID 的映射 `NativeModules`，用来调用 Native 模块的时候查找对应 ID；Java 环境中也会维护一份 JavaScript 模块的映射 `JSModuleRegistry`，用来调用 JS 代码。而在实际的代码中，Native 模块和 JS 模块的通信需要通过中间层也就是 C++ 层的过渡，也就是说 Native 模块和 JS 模块实际上都只是在和 C++ 模块进行通信。

C++ 和 JS 通信
-----------

上面提到，JSCore 可以让 C++ 拿到 JS 运行环境的 global 对象并能操作它的属性，而 JS 代码会在 global 对象中注入一些原生模块需要的 API，这是 JS 向 C++ 提供操作 API 的主要方式。

*   RN 环境中 JS 会在 global 对象中设置了 `__fbBatchedBridge` 变量，并在变量塞入了 4 个的 API，作为 JS 被调用的入口，主要 API 包括：

```arduino
callFunctionReturnFlushedQueue // 让 C++ 调用 JS 模块
invokeCallbackAndReturnFlushedQueue // 让 C++ 调用 JS 回调
flushedQueue // 清空 JS 任务队列
callFunctionReturnResultAndFlushedQueue // 让 C++ 调用 JS 模块并返回结果
```

*   JS 还在 global 中还设置了 `__fbGenNativeModule` 方法，用来给 C++ 调用后在 JS 环境生成 Java 模块的映射对象，也就是 `NativeModules` 模块。它的数据结构类似于（跟实际的数据结构有偏差）：

```json
    {
        "Timing": {
        "moduleID": "1001",
            "method": {
                "createTimer": {
                "methodID": "10001"
            }
        }
    }
}
```

*   通过 `NativeModules` 的映射，开发者能拿到调用模块和方法的 `moduleID` 和 `methodID` ，在调用过程中会映射到具体的 Native 的方法。

同样的，C++ 通过 JSCore 的 `JSObjectSetProperty` 方法在 global 对象中塞入了几个 Native API，让 JS 能通过它们来调用 C++ 模块。主要 API 有：

```arduino
nativeFlushQueueImmediate // 立即清空 JS 任务队列
nativeCallSyncHook // 同步调用 Native 方法
nativeRequire  // 加载 Native 模块
```

*   上面介绍 API 的时候，有多个 API 的功能比较类似，就是清空 JS 的任务队列，那是因为 JS 在调用 Native 模块是异步调用，它会把调用参数包装成一个调用任务放入 JS 任务队列 `MessageQueue` 中，然后等待 Native 的调用。调用时机一般是在触发事件的时候，事件会触发 Native 回调 JS 的回调函数，Native 模块需要通过 `__fbBatchedBridge` 的四个 API 回调 JS 代码，而这四个 API，都有 `flushedQueue` 功能：清空任务队列并执行所有的任务，借此来消费队列中的 Native 调用任务。但是如果某一次调用距离上一次的 `flushedQueue` 行为有点久（一般是大于 5 ms），就会触发立即调用的逻辑，JS 调用 `nativeFlushQueueImmediate` API，主动触发任务消费。

平台（Java）和 C++ 的通信
-----------------

Java 跟 C++ 的互相调用通过 JNI（Java Native Interface），通过 JNI，C++ 层会暴露出来一些 API 来给 Java 层调用，来让 Java 能跟 JS 层进行通信。下面是 C++ 通过 JNI 暴露给 Java 的一些方法：

```arduino
initializeBridge // 初始化：C++ 从 Java 拿到 Native 模块，作为参数传给 JS 生成 NativeModules
jniLoadScriptFromFile // 加载 JS 文件
jniCallJSFunction // 调用 JS 模块
jniCallJSCallback// 调用 JS 回调
setGlobalVariable // 编辑 global 变量
getJavaScriptContext // 获取 JS 运行环境
```

*   由上面的 API 基本可以判断出，C++ 负责的是一些中间层的角色，有 JS 的加载，解析的工作，还有提供操作 JS 运行环境的 API；
*   这里操作 JS 的 API 都会走到上一节 `__fbBatchedBridge` 的四个 API 上，如 `jniCallJSFunction` 会调用 `callFunctionReturnFlushedQueue`。`jniCallJSCallback` 会调用 `invokeCallbackAndReturnFlushedQueue`。由此，三个模块的调用链路就连接了起来。

调用示例
----

以 RN 中的 setTimeout 方法为例，走一遍调用流程。

*   初始化过程

![RN setTimeout 初始化](/images/jueJin/240b94544803024.png)

*   Timing Class：Native 中的延时调用的实现类，被 @reactModule 装饰器描述为一个 Native 模块，在 RN 初始化的时候被放入 ModuleRegistry 映射表，用于后面的调用映射。
    
*   ModuleRegistry 映射表构造完成后，调用 C++ 的 initializeBridge ，把 ModuleRegistry 的模块通过 \_\_fbGenNativeModule 函数注册进 JS 环境。
    
*   JS 代码中的 JSTimer 类 引用 Timing 模块的 createTimer 来实现 setTimeout，延迟执行函数。
    
    ```typescript
    // 源代码位置:/Libraries/Core/Timers/JSTimers.js
    const {Timing} = require('../../BatchedBridge/NativeModules');
    
        function setTimeout(func: Function, duration: number, ...args: any): number {
        // 创建回调函数
        const id = _allocateCallback(
        () => func.apply(undefined, args),
        'setTimeout',
        );
        Timing.createTimer(id, duration || 0, Date.now(), /* recurring */ false);
        return id;
        },
    ```
*   setTimeout 的调用过程
    

![RN setTimeout 调用](/images/jueJin/618cc0a5403ff61.png)

*   当 setTimeout 在 JSTimer.js 被调用，通过 NativeModules 找到 Timing Class 的 moduleID 和 methodID，放进任务队列 `MessageQueue` 中；
    
*   Native 通过事件或者主动触发清空 `MessageQueue` 队列，C++ 层把 moduleID ，methodID 和其他调用参数交给 `ModuleRegistry` ，由它来找到 Native 模块的代码，Timing 类；
    
*   Timing 调用 `createTimer` 方法，调用系统计时功能实现延迟调用；
    
*   计时结束，Timing 类需要回调 JS 函数
    
    ```scss
    // timerToCall 是回调函数的 ID 数组
    getReactApplicationContext().getJSModule(JSTimers.class)
    .callTimers(timerToCall);
    ```
*   `getJSModule` 方法会通过 `JSModuleRegistry` 找到需要调用的 JS 模块，并调用对应的方法，该流程中调用 `JSTimers` 模块的 `callTimers` 方法。
    
*   Java 代码通过 JNI 接口 `jniCallJSFunction` 通过 C++ 调用 JS 模块，并传入 module：`JSTimers` 和 method：`callTimers`；
    
*   C++ 调用 JS 暴露出来的 `callFunctionReturnFlushedQueue` API，带上 module 和 method，回到 JS 的调用环境；
    
*   JS 执行 `callFunctionReturnFlushedQueue` 方法找到 RN 初始化阶段注册好的 JSTimer 模块的 `callTimers` 函数，进行调用。调用完毕后清空一下任务队列 `MessageQueue`。
    

RN 的 JSBridge
-------------

以上通过 RN 的 setTimeout 函数走了一遍 RN 内 Java 代码和 JS 代码的通信流程。简单来说，Java 模块和 JS 模块可以通过 NativeModules 和 JS 回调函数互相调用，来达成一次跨端调用。但是业务中的 Bridge 需要包含一些额外的场景，比如并发调用，事件监听等。

*   并发调用：类似于在 web 端同时发多个请求，为了将请求结果回调到正确的回调函数内，需要保存一个请求到回调函数的映射，在 Bridge 的调用中也是一样的。而这份映射可以维护在 JS 代码中，也可以维护在 Native 代码中，在跨端方案中，两者都可行的情况下一般选择 JS 代码的方案来保持灵活性，Native 只负责处理结果并回调。
    
*   事件监听：比如 JS 代码监听页面是否切换到后台，同一个回调函数在页面多次切换到后台的时候，应该要被调用多次，但是 RN 的 JSCallback 只允许调用一次（每一个 callback 实例会带上是否调用过的标记）， 回调显然不适合这种场景，云音乐的 Bridge 使用 RN 的事件通知：`RCTDeviceEventEmitter` 来代替回调。`RCTDeviceEventEmitter` 是一个纯 JS 实现的事件订阅分发模块，Native 模块通过 `getJSModule` 可以拿到它的方法，因此可以在 Native 端发出一个 JS 事件并带上回调的参数和映射 ID 等，而不用走 JSCallback。
    

回到之前的问题：如何实现 RN 的 Bridge，能让一个 Bridge 的 API 同时支持 H5 和 RN 的调用。因为 H5 和 RN 大多数的业务场景都是相同的，比如获取用户信息 user.info，设备信息 device.info 类似的接口，在 H5 和 RN 中都是会用到的。除了跨端调用的协议要保持一致外，具体的实现模块，协议解析模块都是可以复用的。其中不一样的就是调用链路。RN 链路中的主要模块包括：

*   给 JS 代码调用的 NativeModule，作为调用入口，JS 代码调用它暴露出来的方法传入调用参数并开始调用流程，但是该模块不解析协议和参数，可以称作 `RNRPCNativeModule`;
*   在 Native 模块处理完后，`RNRPCNativeModule` 使用 `RCTDeviceEventEmitter` 生成一个事件回调给 JS 代码，并带上执行结果。

除了以上两个不一样的模块外，其他模块都是可以复用的，如协议解析和任务分发模块，解析协议的调用模块，方法，参数等，并把它分发给具体的 Native 模块；还有 Native 具体的功能实现模块，都可以保持一致。

结合前面介绍的调用流程，开发者如果调用 `User.info` 这个 JSBridge 来获取用户信息，调用流程如下： ![User.info 调用](/images/jueJin/9f1b6231002979f.png)

这样的处理，能保证 H5 和 RN 能用同一份 moduleID 和 methodID 来调用 Native 的功能，而且保证在同一个模块进行处理。从开发者的角度来看，就是一个 Bridge 的 API 可以同时支持 H5 和 RN 的调用。

以上。

相关资料
----

*   [React Native 源代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact-native "https://github.com/facebook/react-native")
    
*   [React Native 原生模块和 JS 模块交互](https://link.juejin.cn?target=https%3A%2F%2Fdanke77.github.io%2F2016%2F12%2F07%2Freact-native-native-modules-android%2F "https://danke77.github.io/2016/12/07/react-native-native-modules-android/")
    
*   [Handler 与 Looper，MessageQueue 的关系](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Ffuly550871915%2Fp%2F4889838.html "https://www.cnblogs.com/fuly550871915/p/4889838.html")
    
*   [React Native 通信机制详解](https://link.juejin.cn?target=http%3A%2F%2Fblog.cnbang.net%2Ftech%2F2698%2F "http://blog.cnbang.net/tech/2698/")
    
*   [React Native 源码解析](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsucese%2Freact-native%2Ftree%2Fmaster%2Fdoc%2FReactNative%25E6%25BA%2590%25E7%25A0%2581%25E7%25AF%2587 "https://github.com/sucese/react-native/tree/master/doc/ReactNative%E6%BA%90%E7%A0%81%E7%AF%87")
    
*   [How React Native constructs app layouts](https://link.juejin.cn?target=https%3A%2F%2Fwww.freecodecamp.org%2Fnews%2Fhow-react-native-constructs-app-layouts-and-how-fabric-is-about-to-change-it-dd4cb510d055%2F "https://www.freecodecamp.org/news/how-react-native-constructs-app-layouts-and-how-fabric-is-about-to-change-it-dd4cb510d055/")
    

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！