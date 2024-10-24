---
author: ""
title: "systrace 统计方法耗时"
date: 2022-06-07
description: "本文讲述了 systrace 的原理以及如何摆脱 PC 在端上开启 systrace 进行方法耗时统计的实现。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:44,views:4474,"
---
> 本文作者：Fangx3

Android是单线程模型，用户的按键事件、屏幕触摸及 UI 绘制都在 UI 线程中处理。单线程意味着串行执行，如果某一个操作耗时了就会导致后续的操作都得等待，这个时候用户的第一感知就是卡了。所以在排查卡顿的时候有一个最简单的办法就是找出耗时长的方法。

#### 如何统计方法耗时？

在开发的时候想统计一个方法的耗时最简单的方法就是在方法的开始和结束位置打个时间戳，两个时间戳相减就是这个方法的耗时。

```kotlin
    fun take() {
    val start = System.currentTimeMillis()
    //..
    service.take();
    //...
    val end = System.currentTimeMillis()
    val const = end - start
}
```

上面的方法能统计到我们应用代码的耗时，但是无法统计到 Android 的系统方法耗时。 其实 Android 系统已经在一些关键链路上已经埋入了一些点位，但是它的实现不是像我们这样埋入时间戳，而是通过`Trace类`来实现的，而 Trace 类也支持我们应用层调用插入自定义的点位，在通过 Android 提供的`systrace`工具，抓取处理 Trace 类打的点位信息。最终生成一个 Html 文件，通过 Chrome 可以直观的查看一个完整链路的耗时情况。

systrace 在开发阶段确实是一个调优的利器，但是它有两个明显的限制导致这个利器无法在线上使用：

*   需要连接 PC 端，通过执行命令的方式开启 Trace 功能，
*   需要开发者手动加入`Trace.beginSection`和`Trace.endSection`，这就变成了需要开发预判耗时位置手动加入 Trace 函数，但是线上环境无法预判哪里会耗时。

所以如果能够解决上面两个问题就能将 systrace 这个利器用于线上问题排查了。

#### 脱离 PC 端运行 systrace

这里简单画下 systrace 的工作原理： ![image.png](/images/jueJin/0be2d796b2fc943.png)

从上面的图上可以看到 systrace 抓的数据可以分为两类：

*   Java 层和 Native 层发生的函数调用信息
*   内核态的事件信息

其中 Java 层和 Native 层的函数调用信息就是我们通过调用 Trace 类的方法收集起来的信息(也是这次我们需要关心的数据)，数据信息会记录到`trace_marker`中； 而内核态的时间信息是通过 Linux 提供的 ftrace 功能，通过激活不同的事件节点，在内核运行时根据节点使能状态，会往 ftrace 缓冲中打点记录事件。 最终 systrace 通过回捞上述两个数据整合生成一份 Html 文件。

从上图中可以看到 systrace 通过 Atrace 来设置 Tag ，如果能够找到需要抓取的类型信息的对应 Tag ，并且直接在端上进行设置，在将 trace\_marker 中的数据捞取出来，就可以摆脱 PC 端的限制。

##### 端上设置 Tag

```java
    public static void beginSection(@NonNull String sectionName) {
        if (isTagEnabled(TRACE_TAG_APP)) {
            if (sectionName.length() > MAX_SECTION_NAME_LEN) {
            throw new IllegalArgumentException("sectionName is too long");
        }
        nativeTraceBegin(TRACE_TAG_APP, sectionName);
    }
}
```

上面是系统 Trace 类中的 beginSecion 方法，首先会判断对应的 Tag 是否可用，可用时才会调用 native 层的 TraceBegin 方法写入数据。 而`isTagEnabled`的实现如下：

```java
    public static boolean isTagEnabled(long traceTag) {
    long tags = sEnabledTags;
        if (tags == TRACE_TAG_NOT_READY) {
        tags = cacheEnabledTags();
    }
    return (tags & traceTag) != 0;
}

    private static long cacheEnabledTags() {
    long tags = nativeGetEnabledTags();
    sEnabledTags = tags;
    return tags;
}
```

看到这里在想是不是通过反射修改`sEnabledTags`的值就可以开启Trace功能了呢？ 通过实践可以发现，仅修改 sEnabledTags 还是无法开启 Trace 功能，因此可以大概猜测在 native 层应该也是有类似的判断，具体的 native 代码在`/system/core/libcutils/trace-dev.c`(Android O版本代码)文件下

```c
static inline void atrace_begin(uint64_t tag, const char* name)
    {
        if (CC_UNLIKELY(atrace_is_tag_enabled(tag))) {
        void atrace_begin_body(const char*);
        atrace_begin_body(name);
    }
}
```

可以看到这里逻辑和 Java 中的处理类似，也是先判断 Tag 是否可用，如果可用才执行写入数据逻辑，继续看下`atrace_is_tag_enabled`的实现，

```c
static inline uint64_t atrace_is_tag_enabled(uint64_t tag)
    {
    return atrace_get_enabled_tags() & tag;
}
static inline uint64_t atrace_get_enabled_tags()
    {
    atrace_init();
    return atrace_enabled_tags;
}
```

可以看到这里是获取了`atrace_enabled_tags`字段的值在进行与操作，而 Trace 类中的 sEnabledTags 也是通过`nativeGetEnabledTags`方法获取到的这个值。因此我们应该修改下 native 层的这个值就可以开启 Trace 功能了。

这里参考了 Facebook 的 profilo 的方案，通过`dlopen`获取 libcuitls.so 对应的句柄，通过从对应 symbol 中找到`atrace_enabled_tags`的指针，从而设置 atrace\_enabled\_tags 来打开 Trace 功能。

```c
std::string lib_name("libcutils.so");
std::string enabled_tags_sym("atrace_enabled_tags");

    if (sdk < 18) {
    lib_name = "libutils.so";
    enabled_tags_sym = "_ZN7android6Tracer12sEnabledTagsE";
}
    if (sdk < 21) {
    handle = dlopen(lib_name.c_str(), RTLD_LOCAL);
        } else {
        handle = dlopen(nullptr, RTLD_GLOBAL);
    }
    
    atrace_enabled_tags = reinterpret_cast<std::atomic<uint64_t> *>(dlsym(handle, enabled_tags_sym.c_str()));
```

atrace\_enabled\_tags 在不同版本上其符号名不一样，所以这里需要作下版本区分。 查询具体的符号名称可以通过`objdump`工具查看，在 Mac 上可以使用`binutils`工具提供的`gobjdump`工具来查看。 像上面的 atrace\_enabled\_tags 的符号在 Android 版本18以下，我们就可以直接通过 gobjdump 工具查看获得： ![image.png](/images/jueJin/d31f20ac99ac18d.png) 但是有时候一个符号名称可能会被 mangle ，在查看时不是太直观和确认是否是我们需要的符号名称，可以在通过`c++filt`工具 demangle 这个符号从而得到一个比较直观的符号名称，方便我们确认。 ![image.png](/images/jueJin/5eef3b19e5f31f1.png)

到这里我们就拿到了 atrace\_enabled\_tags 符号对应的指针，在修改成具体的对应的 Tag 值，同时通过反射同步修改 Trace 类中的`sEnabledTags`值，就开启了 Trace 功能。这里要设置的 Tag 可以具体看下系统提供的 Trace 类，里面具体定义了所有的 Tag 值，我们可以通过对这些 Tag 值的或操作来得到一个最终需要设置的 int 类型的值。

##### 数据回捞

经过上面的步骤我们可以不用在 PC 端执行 systrace 脚本的方式开启 Trace 功能，但是从上面的实现原理图上可以看到数据最终是写在`trace_marker`中，而这个是在内核态中，应用层是无法直接读取的。在查找 Trace 开启对应的 Tag 的过程中可以看到在 native 代码中还有定义了：

```c
int  atrace_marker_fd     = -1;
```

通过查看代码可以发现这个字段就是对应的`trace_marker` 的文件描述符。 而我们在调用 Trace.beginSection 写入的时候最终是会调用到 native 层的`atrace_begin_body` 方法

```c
void atrace_begin_body(const char* name)
    {
    char buf[ATRACE_MESSAGE_LENGTH];
    
    int len = snprintf(buf, sizeof(buf), "B|%d|%s", getpid(), name);
        if (len >= (int) sizeof(buf)) {
        ALOGW("Truncated name in %s: %s\n", __FUNCTION__, name);
        len = sizeof(buf) - 1;
    }
    write(atrace_marker_fd, buf, len);
}
```

可以看到最终的写入过程其实就是调用了`write`方法实现的。

我们可以和上面获取 atrace\_enabled\_tags 一样的方式拿到 trace\_marker 的文件描述符对应的指针，这样有了文件描述符，在通过 hook 系统的 write 方法，在 write 方法中通过文件描述符判断是否是往 trace\_marker 中写入内容，如果是的话可以将内容直接保存到我们自定义的一个文件中，实现数据回捞。

但是从上面代码中可以看到最终写入到 trace\_marker 中的内容是 "B|pid|name"这样一串数据，如果只是这样一串内容的数据还是无法被 systrace 工具识别解析的，因此我们还需要按照下面的格式进行数据补全。

```java
<线程名> - <线程id>  [000] ...1 <时间-秒>: tracing_mark_write: <B|E>|<进程id>|<TAG>
```

将数据保存文件导出后，可以通过 systrace 工具提供的`--from-file`参数将文件转为 Html 文件，就可以通过Chrome 打开查看了。 最新的 SDK Platform Tools 已经移除了 systrace 工具，这里可以直接通过 [Perfetto](https://link.juejin.cn?target=https%3A%2F%2Fui.perfetto.dev%2F "https://ui.perfetto.dev/") 直接打开导出的文件，不需要在将文件进行转换。 通过端上开启 Trace 之后抓的数据效果最终如下，可以看到 Android 系统中埋的点和我们自己添加的点的数据都能抓取到。 ![image.png](/images/jueJin/e8cbd4217098a22.png)

#### 预判耗时？

systrace 的另一个痛点是需要开发手动插入 Trace.beginSection 和 Trace.endSection 方法，这就意味着需要开发预判哪里的函数耗时。但是大部分情况下可能并不知道哪里可能会产生耗时，特别是线上环境，根本无法判断哪里会产生耗时。既然无法预判，那就全部增加，但是这个对一个大项目来说工作量巨大，没有实操性。因此这里通过函数插桩的方式在每个方法中加入 Trace 的方法。

在插桩时如果只是设置方法名称，最终生成的文件可读性较差，不利于进行数据分析，但是如果插入方法的全限定名称 Trace.beginSection 方法中对 sectionName 的长度有限制，因此这里参考了腾讯的 martix 的实现生成 methodId ，插入的时候插入一个 methodId ，这样可以避免 beginSection 方法的长度限制。 ![image.png](/images/jueJin/f794da9dc480a48.png) 最终的效果如上图。

操作几次后会发现最后生成的文件中会有一些 Did not Finish 的数据 ![image.png](/images/jueJin/00ac61cfe8a5717.png) 前后数据分析之后，发现是这些地方抛了异常走了异常流程导致 Trace 数据没有闭合。因此在插桩的时候还需要在抛异常的 catch 代码块中也插入 Trace.endSection，完成数据闭合。

#### 总结

借助系统提供的 Trace 功能帮我们生成一个完整的调用链路信息，利于开发进行问题排除；在端上开启 systrace 功能摆脱了 PC 的限制，方便我们在各种环境下进行数据抓取，能帮助我们发现一些偶现或隐藏的耗时卡顿问题。

#### 参考资料

*   [github.com/facebookinc…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebookincubator%2Fprofilo.git "https://github.com/facebookincubator/profilo.git")
*   [github.com/Tencent/mat…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTencent%2Fmatrix.git "https://github.com/Tencent/matrix.git")
*   [linux.cn/article-983…](https://link.juejin.cn?target=https%3A%2F%2Flinux.cn%2Farticle-9838-1.html "https://linux.cn/article-9838-1.html")
*   [segmentfault.com/a/119000002…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000021327942 "https://segmentfault.com/a/1190000021327942")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！