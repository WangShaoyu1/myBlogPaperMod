---
author: ""
title: "云音乐 Android so 体积治理实践"
date: 2023-05-22
description: "软件体积对软件启动速度、下载安装时长、安装成功率等都有深刻影响，是应被关注的重要属性。本文主要介绍云音乐 Android 端在 so 体积治理上的实践经验和背景知识。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:43,comments:0,collects:49,views:5544,"
---
> 本文作者： dyl

背景
==

软件应用除了功能外，还有许多非功能质量属性需要我们关注，常见有性能、安全性、可用性、可扩展性等。除此之外，软件的体积也是我们应该关注的重要质量属性。体积对启动速度、下载安装时长、安装成功率、磁盘空间占用、OOM 异常等都有深刻影响。

最近负责治理云音乐 Android 端 so 的体积，通过研究摸索总结了一些方法，主要从三个方面着手治理，分别是

*   优化代码
*   优化编译链接
*   优化依赖。

用这些方法进行了一次大面积 so 治理后，so 整体从 30M+ 降低为 20M+，减少了 30%+ 的体积。本文对这些治理方法和背景知识进行了介绍，以供大家参考。

优化代码
====

针对代码，主要关注在去重复代码和禁用昂贵的 C++ 语言特性。Andorid NDK 下昂贵的语言特性包括

*   异常
*   RTTI
*   iostream 库

去除重复代码
------

重复的代码，不仅带来体积问题，更是一种代码坏味道。移除重复代码无论在质量上，还是减小 so 体积上都有益处。我们可采用代码静态检测工具检测重复代码，然后以提炼类或函数的重构手法进行处理。

*   提炼函数：如果一个类的多个函数有重复代码，提炼独立函数，放入类中供其他函数使用。如果多个兄弟子类有重复代码，提炼独立函数，放入父类之中供子类使用。
*   提炼类：如果不相关类有重复代码，提炼独立类放置重复代码，供这些类使用。

禁用昂贵的 C++ 语言特性
--------------

在 Android NDK 下，有许多 C++ 特性是比较昂贵的，在 Android NDK 官方文档亦有提及，要尽量避免使用。主要包括禁用 C++ 异常、禁用 C++ RTTI、避免使用 iostream。

C++ 异常会有一个误导，以为可以捕获让人头疼的空指针、内存越界等意料之外的错误，其实并不能。异常机制实际上是一种错误处理框架，捕获预先定义的错误，其目的是将正常逻辑和异常逻辑的处理分开，提高代码整洁度。而我们每定义一处异常，在编译链接后都会插入 C++ 库代码进行扩展，占用比编写的代码更多的空间。因为其性能和体积等问题，在实践中可考虑改用返回错误码来代替。

C++ RTTI 机制，在语意层面和多态是矛盾的。C++ 的多态，是通过基类指针指向派生类对象，在 Compile Time 时无须知道实际类型，在 Run Time 时方根据指向的类型，执行对应的虚函数实现，从而让我们得以从依赖实现改为依赖接口。而 C++ RTTI，则是在 Compie Time 期间得知基类指针指向的实际类型，也即让我们从依赖接口改为了依赖实现。此外，编译器实现 RTTI 机制往往会增加 class 的大小，比如为每个 class 产生额外的 RTTI 数据，包含类名和基类信息。当我们使用到 RTTI 时应该仔细考量，是否设计上出现了问题。如果特殊情况需要使用，也要清楚背后的体积成本和设计成本。

对于 iostream 库，通过我们在实际场景中的检查，发现大部分仅仅是使用了 `std::cout` 输出日志。Android 本身提供有 `log` 方法，用 `<android/log.h>` 中的 `log` 进行日志输出，可移除 iostream 的依赖，从而减少体积。

优化代码实践方法
--------

禁用上述语言特性，在 NDK Build 下无需特别指定，其默认禁用 C++ 异常和 RTTI。在 CMake 下禁用异常和 RTTI 的编译选项如下：

```shell
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fno-exceptions -fno-rtti")
```

针对 iostream 库的引入，可搜索整体代码，或用 objdump 反汇编 so 库，确定是否含有 iostream 信息，然后定位修改代码。

```shell
objdump -D demo.so | grep iostream
```

优化编译链接
======

在编译链接方面，重点是治理 so 的导出符号，增加相应的编译链接优化选项，提供足够的信息给编译器，由它在编译链接期间进行体积优化。 要了解 so 的导出符号，需要了解 ELF 文件格式。ELF 文件有多个分段（section），可以通过 readelf 命令查看细节。我们关注的分段为：

*   .text：存放编译后的机器代码
*   .date：存放已初始化的全局/静态变量
*   .dynsym：动态符号表，包含导出符号和导入符号
*   .dynstr：动态符号字符串表
*   .symtab：全体符号表
*   .debug：调试信息表

其中动态符号表（.dynsym）是我们关注的重点，它记录了动态库的导入导出符号，我们需要确保导出的是必要且完整的符号集合，去除不必要的导出符号。

对于代码段（.text）和数据段（.data），在默认编译选项下，产出的目标文件会将多个函数汇集到一个代码段，多个变量放到一个数据段，最后合入到so中。我们需要通过编译链接选项，帮助编译器只合入用到的函数和变量。

全体符号表（.symtab）和调试信息（.debug），则包含了丰富完整的符号信息，在分析 Crash 堆栈时可还原符号。我们保留一份带有 .symtab 和 .debug 的 so，并在发布时执行 strip 移除这些符号调试信息。就即可以发布小体积的 so，也可以在出现 Crash 时用大体积 so 还原堆栈符号。

限定动态符号表
-------

ELF 中的动态符号表（.dynsym），记录了动态库的导入导出符号。在 Linux/Android NDK下，编译器默认将函数和全局变量，及引入使用的静态库的函数和全局变量，作为自己的动态符号全部导出，使用者在使用时也无需任何特殊操作。虽然方便，但也容易导致 so 包含许多不应该导出的函数符号，甚至将内部使用的其他静态库的函数也进行导出。我们需要对导出的动态符号做出限制，确保只暴露外部依赖的符号，可以有效缩减动态符号表以及相关表项。对于第三方或无法明确导出符号的 so，则强制不导出其它的静态库符号。我们也强制要求不导出 C++ 库的符号。见下图示意：

![](/images/jueJin/5e63a0ef53dcec3.png)

移除未使用函数和变量
----------

默认编译选项下的目标文件在编译后，会将多个函数汇集到一个代码段，多个变量放到一个数据段。以代码段来说，其含有多个函数，哪怕我们只用到其中一个函数，这个代码段就要整个保留，在链接阶段会整体合入 so，从而合入了并未使用的函数，增大了体积。数据段也是如此。我们可以通过选项告知编译器用更细粒度分段，让一个函数占一个代码段，一个变量占一个数据段，并告知编译器回收未使用的代码段和数据段，从而移除并未使用的函数和变量。见下图示意：

![](/images/jueJin/5b0f011a16b66f9.png)

精简 JNI 原生接口符号
-------------

在 Android NDK 下的 JNI 原生接口注册方式有两种，分别是静态注册和动态注册。静态注册是以“Java+包名+类名+方法名”定义 native 方法，由 runtime 自己扫描注册。动态注册则是在 cpp 文件中定义 `JNI_OnLoad` 方法，我们在此方法中调用 `RegsiterNative` 注册 JNI 接口。采用动态注册，对于支持 JNI 的 so 只需要导出 `JNI_OnLoad` 、 `JNI_OnUnload` 、 `Java_*` 可有效降低体积（规模更小、速度更快的共享库）。 `RegsiterNatives` 动态注册方法，可参考 [Google 官网动态注册代码](https://link.juejin.cn?target=https%3A%2F%2Fandroid.googlesource.com%2Fplatform%2Fdevelopment%2F%2B%2Fmaster%2Fsamples%2FSimpleJNI%2Fjni%2Fnative.cpp "https://android.googlesource.com/platform/development/+/master/samples/SimpleJNI/jni/native.cpp")。

优化编译链接实践方法
----------

融合上述的限制动态符号表，细化代码段和数据段，并回收未使用分段，可以让编译器移除没有被“导出函数”直接或间接依赖的函数和变量，从而大幅减少 so 的体积。

### 限制导出符号方法

可采用 version script 的方法，这也是 NDK 官网示例的方法。具体来说我们编写一个类似 json 的文件，指明要导出的函数，并在链接选项中加入此脚本文件即可。version script 文件示例如下（注意导出类需要 extern "C++"，避免名称修饰问题）：

```shell
    {
    global: gValue;
    *someFuncs*;
        extern "C++" {
        CSemaphore::*;
        CCritical::*;
        };
        local: *;
        };
```

CMake编译链接选项如下：

```shell
# 以 version script 指定导出函数
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,versionscript=${CMAKE_CURRENT_SOURCE_DIR}/funcs.map")

# 不导出所有引入的静态库的符号
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,--exclude-libs,ALL")
```

NDK build编译链接选项如下：

```shell
# 以 version script 指定导出函数
LOCAL_LDFLAGS += -Wl,--version-script=${LOCAL_PATH}/funcs.map

# 不导出所有引入的静态库的符号
LOCAL_LDFLAGS += -Wl,--exclude-libs,ALL
```

### 协助编译器移除未使用函数和变量

我们通过增加编译选项，可让编译器回收未使用的代码段和数据段，如下：

1.  指定分段选项，此举会让编译器在编译目标文件或静态库时，将单函数和单变量放入单个独立的段。
    *   \-ffunction-sections
    *   \-fdata-sections
2.  指定回收选项，此举会让编译器在链接阶段执行 DeadCode 检测，识别出未使用的函数和变量，进而移除未使用的段。
    *   –gc-sections

```shell
# CMake 编译选项
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -flto -fdata-sections -ffunction-sections")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -flto -fdata-sections -ffunction-sections")
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -O3 -flto -Wl,--gc-sections")
``````shell
# NDK Build 编译选项：
LOCAL_CFLAGS += -Oz -flto -fdata-sections -ffunction-sections
LOCAL_LDFLAGS += -O3 -flto -Wl,--gc-sections
```

优化依赖
====

当一个静态库被多个 so 重复依赖时，会引入多份静态库代码，可以提取这个重复依赖库为独立 so，供其他 so 库共用。当一个 so 库仅仅被另一个 so 库依赖时，会产生相关导入/导出符号表项，可通过合并两个 so 去除导入导出符号。这两个方法是依赖的治理思路。

在实践中，我们重点推进了 libc++ 的依赖治理。一个应用不应使用多个 c++ 运行时，在 Android 下 libc++ 版本与 NDK 版本是相对应的，统一 NDK 版本及 libc++ 依赖方式非常重要，涉及的不仅仅是体积问题，还可能导致 App Crash 或者其他奇怪问题。通过检测我们发现大部分自研 so 库都是采用静态依赖 libc++\_static 且版本不一，所以重点推进了 NDK 版本的统一，并统一动态依赖 libc++\_shared 。对于因为历史原因无法升级 NDK 版本的则保持静态链接 libc++\_static，但要确保不导出其符号。

统一 libc++ 的依赖方式
---------------

*   确定统一的 NDK 版本以及相应的 libc++\_shared.so，在 module 级约束 ndkVersion 为统一版本。
*   发布基础 aar 包，内含 libc++\_shared.so。
*   在功能性 so 工程中，动态链接 libc++\_shared.so。

```shell
# Module 级的 build.gradle，此举会自动将 libc++_shared.so 打入 aar 包
DANDROID_STL=c++_shared

# ndk-build 下，在 Application.mk中加入
APP_STL := c++_shared
```

*   发布功能性 so aar 包时，排除自身的 c++\_shared.so，以避免冲突

```shell
    packagingOptions {
    exclude '**/libc++_shared.so'
}
```

*   如果不能对齐统一版本的 ndk，则采用静态链接 C++ 库的方式。因为 so 默认会将自己引入的静态库作为自己的导出符号全部导出，所以需要排除 C++ 库的符号。

```shell
# 不导出 C++ 库的符号
LOCAL_LDFLAGS += -Wl,--exclude-libs,libc++_static.a -Wl,--exclude-libs,libc++abi.a
```

总结
==

通过上述方法，能够有效的治理和控制so的体积。除此之外，还需要不断挖掘重复依赖的功能；同时为了防止劣化，需要在CI/CD机制中加上相关符号和编译选项的检测。这也需要我们持续进行关注和完善。

参考资料
====

*   Android NDK文档 [针对中间件供应商的建议](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Fndk%2Fguides%2Fmiddleware-vendors%3Fhl%3Dzh-cn "https://developer.android.com/ndk/guides/middleware-vendors?hl=zh-cn")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！