---
author: ""
title: "Android 调试实战与原理详解"
date: 2023-01-31
description: "调试功能做为开发的必备神技，熟练掌握后能极大的提高开发效率，再也不必为频繁运行代码而苦恼了。文章同时还会详细介绍调试的原理，想知道为什么方法断点那么慢？一起来一探究竟吧"
tags: ["Android","Android Studio中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:153,comments:0,collects:184,views:6132,"
---
> 图片来自：[101.dev/](https://link.juejin.cn?target=https%3A%2F%2F101.dev%2F "https://101.dev/")  
> 本文作者： 雪谷

前言
==

调试功能做为开发的必备神技，熟练掌握后能极大的提高开发效率，再也不必为频繁运行代码而苦恼了。文章同时还会详细介绍调试的原理以及一些调试过程中的常见问题，想知道为什么方法断点那么慢？

接下来将从以下四个方面来讲解调试是如何运作的：

1.  调试操作
2.  调试实战
3.  调试原理
4.  常见问题

调试简介
====

这里我们介绍一下调试的常见操作，灵活掌握这些操作，可以帮助我们快速定位到对应代码或者获取想要的信息。

运行调试
----

开启 Debug 调试模式有两种方式：

![运行调试](/images/jueJin/7c7c342032b4d13.png)

Debug Run：直接以 Debug 模式运行 APP，该模式的优点是可以调试程序启动相关的代码， 例如 `Application.onCreate()`。

Attach To Process：在程序运行中选择进程来调试，该模式的优点是随时可开启、关闭 Debug 模式，使用灵活方便。

注意：Debug Run 会导致程序整体变慢，建议使用等待调试，使用该方式可以在启动应用后处于等待状态，在开启调试后，应用才会走初始化流程，有两种方式开启等待断点：  
方法1：「开发者选项 - 选择调试应用」的方式来调试应用启动阶段代码。具体方式为「选择调试应用」-> 「运行应用」-> 「Attach To Process」，然后等待断点执行即可。  
方法2：使用adb命令`adb shell am set-debug-app -w --persistent 包名`开启，「-w」即表示应用启动时等待调试程序；关闭使用`adb shell am clear-debug-app`。

调试操作
----

下面介绍一下 Debug 过程中的常见操作：

![断点操作](/images/jueJin/0daa429af880343.png)

1.  Show Execution Point：跳到当前执行的断点处。
2.  Step Over：单步执行，执行到当前行的下一行。
3.  Step Into：进入正在执行的方法。
4.  Focus Step Into：同3，但是可以进入源码，在3无法进入的情况下，可以尝试该操作。
5.  Step Out：跳出正在执行的方法。
6.  Drop Frame：返回到当前方法的调用处。
7.  Run to Cursor：运行到光标处（光标必须在当前断点位置后）。
8.  Evaluate expression：计算选中的变量的值。

断点类型
----

![断点类型](/images/jueJin/1fb7ae9b7e9e0c7.png)

断点分为以下四种类型：  
**行断点**： 当执行到此行是停止执行，等待调试。  
**属性断点**：打在类的成员变量上，当变量初始化或变量的值改变时触发断点。  
**异常断点**：当抛出指定异常时触发断点。  
**方法断点**：当需要知道一个方法的调用方时。

这里着重讲一下方法断点的使用场景：  
如下所示，有个接口 `IMethodTest`，同时有两个类 `MethodTestImpl1` 和 `MethodTestImpl2` 实现了该接口，在 `IMethodTest` 的 `printMethod()` 上打上方法断点。

![IMethodTest](/images/jueJin/702a7870e3cf9a4.png)

在代码中实例化了 `MethodTestImpl2` 来调用 `printMethod()` 。

![MethodTestImpl2](/images/jueJin/f277f54597a429d.png)

最后当 Debug 到该方法断点时，会自动走到 `MethodTestImpl2` 的 `printMethod()` 的实现中。

![MethodTestImpl2](/images/jueJin/70ed57e9f4fe69d.png)

注：方法断点只支持 Java 代码。

调试实战
====

大家都知道调试是提高开发效率的利器，那么它是如何帮助开发者的呢？  
答案就是「**查看信息**」和「**减少编译次数**」。

查看信息
----

当程序运行结果并不如你的预期时，通过调试来查看当前内存里的变量以及堆栈信息，是最快速定位问题的方式。

**查看局部变量**的方式如下图所示

![查看局部变量](/images/jueJin/8a6fc64c2985c8d.png)

系统自动打印：在当前调试位置之前的代码右侧会自动打印当前栈帧里保存的变量值。  
鼠标悬停：鼠标悬停在一个变量上几秒后，会列出该变量的详细信息。  
Variables 区：在 Variables 区里会自动打印当前方法里的变量详细信息。

**查看全局变量**有两种方式

![查看全局变量](/images/jueJin/f421a239680cb79.png)

在 Variables 区添加监听：点击左侧操作栏里的「+」，输入对应变量值，即可实时观察该值的变化。

![查看全局变量](/images/jueJin/4a89c6c0b869647.png)

在 Evaluate Expression 中输入想要观察的变量，回车后即可查看当前时刻该变量的值。

**注：查看局部变量和全局变量需要断点位置能访问到该值。**

**查看堆栈信息**

在调试页面的「Debugger」Tab下可以查看当前的调用堆栈。

![查看堆栈](/images/jueJin/e3338a3fee6571b.png)

需要注意的是，一个线程只会被一个断点阻塞，但是不同线程是可以同时阻塞的，可以切换下拉框来切换线程，**红色圆点表示正在被阻塞的线程**。

![线程](/images/jueJin/6b254312e1fef65.png)

减少编译次数
------

越大的项目运行起来越是缓慢，而有时我们只是修改了一行代码甚至是一个字符，这时再去重新编译是效率非常低下的，而灵活运用各种调试技巧，就可以帮助我们在不重新运行项目的前提下，去修改运行中代码。

![编译验证](/images/jueJin/10a8c749e64ac49.png)

### 运行期代码植入

想修改已经运行起来的代码，有两种方式：

在 Variables 区中使用 setValue。

![setValue](/images/jueJin/f9f550990500071.png)

使用 Evaluate Expression。

![Evaluate Expression](/images/jueJin/18354a0d1dbf1b7.png)

Evaluate Expression 是一个非常强大的功能，可以展开执行任意的代码段。灵活运用可以大量的减少编译次数，例如：

*   修改网络请求、外部跳转等来源的数据，模拟各种场景。
*   执行某些代码，直接查看结果。
*   执行某一段异常代码，直接查看报错信息。

### 日志断点

日志是辅助开发排查问题的常见手段，但是在代码中添加日志存在一些不便的情况，例如：

*   需要重新运行程序。
*   开发完成之后需要去除对应的日志代码。  
    而使用日志断点就可以避免以上问题，使用方式为在断点位置右键，取消 Suspend 框的勾选，同时勾选 Evaluate and Log 并输入想要的内容。

![日志断点](/images/jueJin/af589444d6c0985.png)

### 条件断点

当一个断点会被多次执行，而调试时只需求在某些特定条件下才挂起，可以使用条件断点。使用方式为在断点位置右键，在 Condition 框中输入条件表达式，回车，这时断点右下角出现一个「？」即为条件断点成功挂载。  
注意，条件断点的表达式返回值必须为 true 或者 false，否则断点报错。

![条件断点](/images/jueJin/7ef756c355d6a4c.png)

### 异常断点

当开发者知道接下来一定会报某一个异常，但是又不知道会是哪段代码触发时，可以尝试使用异常断点。使用方式为在断点管理界面点击「+」，添加 Java Exception Breakpoints。

![异常断点](/images/jueJin/a92ba22e697fc21.png)

然后输入你想要捕获的异常，注意，这里也会捕获系统抛出的异常，捕获时请仔细观察。

![异常断点](/images/jueJin/cdb107d469a7cde.png)

多线程断点
-----

多线程是日常开发中常见的问题，针对一系列线程切换场景，调试工具也有对应的方式来辅助我们定位问题。

这里请先思考一下这个示例，在不开启断点的情况下，下图的代码执行后会输出什么信息？

![多线程断点](/images/jueJin/2840d9bcff2d55e.png)

答案就是「**无法确定**」。  
没错，在 CPU 的时间片执行机制下，如果不加以控制，开发者是无法预估线程执行顺序的。而直接写一系列的线程控制代码耗时不小，有没有办法能先让线程按照开发者想要的顺序去执行呢？请继续往下看：

在断点位置上右键，出来的管理界面里有 All 和 Thread 两个选项：

*   All 表示阻塞所有线程，即所有线程都走到当前断点位置后，才能继续往下走。
*   Thread 表示阻塞当前线程，即当前线程的代码走完后，才会走其他线程。

![多线程断点](/images/jueJin/eb7cdceafe464a0.png)

所以结合上面的示例：  
All 选项的输出结果为：所有线程先执行完 start，再执行 end，但是哪个线程先执行无法确定。

![All](/images/jueJin/4502d09aea3b856.png)

Thread 选项的输出结果为：一个线程先执行完 start，再执行 end，然后是另外一个线程，但是哪个线程先执行无法确定。

![Thread](/images/jueJin/332fc000a657d6c.png)

调试Release包
----------

调试Relase包偏Android逆向，由于篇幅有限，这里主要介绍和调试相关内容，前期准备可以看这里[DebugApkSmali](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhi-dhl%2FDebugApkSmali "https://github.com/hi-dhl/DebugApkSmali")。

在反编译 APK，Smali 文件生成后，我们需要把手机和 Android Studio 关联上，这里需要使用 Remote 功能，具体流程如下：

选择 Edit Configurations。

![Edit Configurations](/images/jueJin/7100399190d177f.png)

新增 Remote JVM Debug，Name 随意，Port 不与现有端口冲突即可。

![Remote JVM Debug](/images/jueJin/f851cb28475aee2.png)

查看需要调试的页面位于哪个进程，先通过`adb shell dumpsys activity top | grep ACTIVITY`查看栈顶页面（这里调试的是知乎），然后在 AndroidManifest.xml 中查看对应 Activity 的 `android:process`（没有该属性的话就看 application 的 process）。

![activity](/images/jueJin/63b00169e06a062.png)

通过`adb shell ps | grep com.zhihu.android`查看该进程对应的 PID，根据下图可以得到对应的 PID 为16282。

![pid](/images/jueJin/6969cdb8bafbe07.png)

最后通过`adb forward tcp:5005 jdwp:16282`连接上手机和 Android Studio，就可以开始愉快的调试。

通过上面的介绍，我们了解了调试 Release 包的方式，但是大家有没有一种雨里雾里的感觉呢，为什么知道了端口就可以关联上？tcp 和 jdwp 又是什么意思？他们之前又是怎么传输数据的呢？带着这些疑问，我们一起来看下调试原理。

调试原理
====

假如用简单的一句话来解释调试原理，可以概括为「通过ADB协议以及JDWP协议来实现调试器与虚拟机之间的通信」，如下图所示，调试的过程，其实就是通信的过程，理解了如何通信以及传递了那些信息，就明白了调试的核心原理。后续内容请都参考该图来理解。

![调试原理](/images/jueJin/f0516d869fdfdb6.png)

ADB 架构
------

首先需要了解的是 ADB 架构，其中包含了三个部分：ADB Server、ADB Client 以及 ADB Dameon。

### ADB Server

运行在电脑上的进程名为 adb 的后台进程，端口号5037，作用是管理 ADB Client 与 ADB Dameon 进程的通信。如下图所示，通过 adb device （任意 adb 命令均可）命令可以从常驻的后台进程 adb 上 fork 一个子进程用于当前的通信。通过命令查看相关进程可以发现会有三个：

*   Android Studio 进程连接 adb 进程的通信。
*   adb 进程连接 Android Studio 进程的通信。
*   adb 常驻进程。

![ADB Server](/images/jueJin/49c1643431adb7d.png)

ADB Server 中包含 Local Service 和 Remote Service，Local Service 用于与 ADB Client 交互，Remote Service 用于与 ADB Dameon 交互。

### ADB Client

ADB Client 运行在电脑上，一般通过命令行或者 Android Studio 执行 adb 命令来与其交互。ADB Client 的主要职责是解析命令，做预处理，然后发送给 ADB Server，这里分为两种情况：

*   ADB Server 能处理的命令就自己处理，如 adb version。
*   ADB Server 不能处理的命令就发送给 ADB Dameon，并接受返回消息，如 adb devices。

### ADB Dameon

ADB Dameon 运行在手机上的服务进程，进程名为 adbd，在手机启动后，由 Zygote 进程创建。ADB Dameon 的主要职责是：

*   为手机提供adb服务。
*   创建 Local Service 和 Remote Service，Local Service 用于与 JVM 交互，Remote Service 用于与 ADB Server 交互。

了解了三者的分工后，可以通过下图对 ADB 架构有一个较为整体的理解。

![ADB 架构](/images/jueJin/de95ea49f11bea1.png)

看到这里，大家应该就能理解为什么连接手机和 Android Studio 的命令是`adb forward tcp:5005 jdwp:16282`了，它实际上就是把 ADB 和 手机虚拟机进行连接，同时也可以发现 ADB Server 和 ADB Dameon 之间的协议既可以是 USB（数据线）也可以是 TCP 的方式，其中 TCP 就是调试功能支持 WIFI、远程的基础。

注：由于篇幅有限，这里只对 ADB 架构做了简略的介绍，感兴趣的同学可以自行学习。

JDWP协议
------

在了解了 ADB 协议后，我们知道了命令是如何从 Android Studio 或者命令行传输到手机上的 ADB Dameon 的，那么 ADB Dameon 又是如何与虚拟机交互的，以及传输协议中的数据格式又是怎样的呢，这里就需要理解 JDWP 协议了。

### 概念介绍

JDWP 是 Java Debug Wire Protocol 的缩写，其本质上是调试器和目标虚拟机进行调试交互的通信协议，通过命令包和回复包两种格式来传输数据。  
这里有四个概念需要了解：

*   调试器（Debugger）：Android Studio、Eclipse、DDMS、Terminal 等，他们都实现了支持 JDWP 通信接口。
*   目标虚拟机（Target VM）：JVM、Art、Dalvik 等，在虚拟机启动时，会加载JDWP模块。
*   命令包（Command packet）：调试器发送给虚拟机用于获取程序状态信息或控制程序运行，或者虚拟机发送给调试器用于通知事件触发消息。
*   回复包（Reply packet）：虚拟机发送给调试器用于回复命令包的请求或者执行结果。

它们之间的交互如下图：

![JDWP](/images/jueJin/5ad4cc9fc376c58.png)

### 数据包

JDWP 数据包包含包头和数据两部分，数据部分就是简单的二进制数据流，我们这里注重讲一下包头部分的结构，这也是调试命令传输的核心。

![数据头](/images/jueJin/c9a933712116721.png)

如上图所示，命令包和回复包的前三部分结构是相同的：

*   length：4字节，数据包长度，包含包头和数据。
*   id：4字节，数据包序号，命令包和回复包必须保持一致。
*   flags：1字节，数据包类型，0x80 表示命令包，0x00 表示回复包。

不同之处在于最后2字节：

*   命令包包含 cmd set（命令分组）和 cmd id（命令序号）两部分，分别占1字节。
*   回复包里存放的是 error code 错误码，非0即为存在错误，占2字节。

常见的命令分组和序号按照功能大致分为18组命令，包含了虚拟机信息、类、对象、线程、方法、事件等不同类型的操作命令。见下图：

![命令组](/images/jueJin/c0b47ecca61af0f.png)  
该图片来源FreeBuf。

查看完整命令组及详细信息见：[命令组](https://link.juejin.cn?target=https%3A%2F%2Fdownload.oracle.com%2Fotn_hosted_doc%2Fjdeveloper%2F904preview%2Fjdk14doc%2Fdocs%2Fguide%2Fjpda%2Fjdwp-protocol.html "https://download.oracle.com/otn_hosted_doc/jdeveloper/904preview/jdk14doc/docs/guide/jpda/jdwp-protocol.html")。

这里以获取虚拟机版本的命令 VirtualMachine：version 为例演示，帮助大家理解命令到底是如何传输的。  
首先来看获取虚拟机版本会回复哪些信息：

![虚拟机版本](/images/jueJin/7fe0fd9be045c78.png)

通过上述表格可以推导出命令包与回复包的包信息为：

![包信息](/images/jueJin/89a17296c9c3fbd.png)

把对应编码转换成字符串为：

![字符串](/images/jueJin/6e53747cf833989.png)

需要注意，非基本数据类型的内存结构，例如 String，使用「长度」+「字符数据」的形式。以 vmName 字段为例，DalvikVM 的 ASCII 码为「44 61 6c 76 69 6b 56 4d」，DalvikVM 的长度为8，所以综合后 DalvikVM 的返回数据为「00 00 00 08 44 61 6c 76 69 6b 56 4d」。而 jdwpMajor 为纯数字，所以 jdwpMajor 的返回数据为「00 00 00 01」。

到这里调试原理就讲完了，原理部分只是从整体架构的层面为大家介绍了一下，内部还有很多的知识点值得大家去深究，感兴趣的同学可以自行学习。

常见问题
====

在讲完了调试实战和原理之后，我们来看一些常见的调试问题：

*   断点主动断开  
    现象：在某些机型上，例如华为非鸿蒙系统、部分 OPPO、一加设备等，当断点在 Activity、Fragment 的生命周期方法上超过10秒或者卡住页面展示超过一定时间（不同设备时长不一致）时，会出现断点主动断开的情况。  
    解决方式：使用非阻塞式的日志断点。
    
*   无法Attach to Process  
    现象：在挂载进程进行调试时，出现 `Error running 'Android Debugger (-1)': Invalid argument : Argument invalid [port]` 的报错，这时是由于 adb 进程端口号被其他进程抢占了。  
    解决方式：使用 `adb kill-server` 杀死 adb 进程，然后使用任意一个 adb 命令（adb devices）fork 一个新的 adb 进程即可。
    
*   方法断点导致Debug卡顿  
    现象：在使用方法断点时，调试器会变得异常卡顿，这是因为方法断点需要跟踪方法的入栈和出栈，每次进出都要发送指令给调试，具体流程如下：  
    1.把方法断点加入断点列表。  
    2.调试器发送指令告诉虚拟机需要监听 Method Entry 和 Method Exit。  
    3.虚拟机每次收到 Method Entry 或者 Method Exit 后发送事件给调试器。  
    4.调试器判断是否在断点列表中。  
    5.存在则向虚拟机发送 SetBreakPoint 请求挂起，否则发送请求释放该方法栈。  
    解决方式：  
    1.根据实际情况放开 Method Entry 或者 Method Exit，如下图所示。  
    2.用完即弃，及时去除方法断点。  
    3.不要用！使用行断点（官方建议）。
    

![方法断点](/images/jueJin/1c0176d50f53acb.png)

总结
==

调试是一个优秀开发者必备的技巧，对提升开发效率有极大的帮助。掌握调试原理也可以帮助开发者更好的理解 Android 架构，是一个高级开发者的必经之路。

参考资料
====

*   [Android 调试桥 (adb)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Fcommand-line%2Fadb "https://developer.android.com/studio/command-line/adb")
*   [jdwp\_handler](https://link.juejin.cn?target=https%3A%2F%2Fandroid.googlesource.com%2Fplatform%2Fart%2F%2B%2Fandroid-cts-7.0_r9%2Fruntime%2Fjdwp%2Fjdwp_handler.cc%231443 "https://android.googlesource.com/platform/art/+/android-cts-7.0_r9/runtime/jdwp/jdwp_handler.cc#1443")
*   [JDWP命令行调试](https://link.juejin.cn?target=https%3A%2F%2Fblog.51cto.com%2Fu_15794627%2F5682837 "https://blog.51cto.com/u_15794627/5682837")
*   [Android远程调试的探索与实现](https://link.juejin.cn?target=https%3A%2F%2Ftech.meituan.com%2F2017%2F07%2F20%2Fandroid-remote-debug.html "https://tech.meituan.com/2017/07/20/android-remote-debug.html")
*   [Java Debug Wire Protocol Specification Details](https://link.juejin.cn?target=https%3A%2F%2Fdownload.oracle.com%2Fotn_hosted_doc%2Fjdeveloper%2F904preview%2Fjdk14doc%2Fdocs%2Fguide%2Fjpda%2Fjdwp-protocol.html%23JDWP_EventRequest "https://download.oracle.com/otn_hosted_doc/jdeveloper/904preview/jdk14doc/docs/guide/jpda/jdwp-protocol.html#JDWP_EventRequest")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！