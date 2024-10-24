---
author: ""
title: "Android本地搜索优化"
date: 2023-05-11
description: "在本文中，我们将通过Android本地搜索业务介绍如何使用JavaScriptCore、JNI相关技术来实现效率提升。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:18,comments:0,collects:26,views:4632,"
---
> 本文作者：lsnbing

引言
==

在本文中，我们将通过 Android 本地搜索业务介绍如何使用 JavaScriptCore（以下简称 JSC）和Java Native Interface（以下简称 JNI）相关技术来实现搜索效率提升。

背景
==

本地搜索业务内部使用动态下发 JS 代码实现一些业务逻辑，用户触发搜索到最终展示数据耗时久，体验很差 ( 8000 首歌曲的处理量大概在 7 秒左右)，分析：

*   本地的 DB 和数据处理耗时占 50%
*   JS 引擎的数据传输上占 50%

DB 和数据处理不做讨论，这里主要解决 JS 引擎的数据传输问题

基于现有方案的分析： ![性能瓶颈](/images/jueJin/bf393af10b69f9b.png)

可以发现 Native 在和 JVM 传输次数过多，且跨语言的数据传输序列化耗时

方案
==

结合现有业务特点：

*   算法是变化的、动态下发的，所以代码由 JS 实现，故需要在 JS 引擎中执行
*   Java 使用 JSC 需要借助 JNI，并加入一些逻辑处理
*   JNI 需要向 JS 引擎输入数据，同时需要获取执行得结果

得出如下流程图

![流程](/images/jueJin/bf6f8a1fb31eee6.png)

如何实现？

1.  准备好 JavaScriptCore 库，这里复用 ReactNative 中的 so 库
2.  C++调用 JavaScriptCore 库，实现部分逻辑，输出业务层 a.so 库
3.  上层使用 a.so 对库进行调用

前置知识
----

方案实现需要了解 JavaScriptCore 和 JNI 的相关知识，下面分别介绍

### JavaScriptCore 简介

JavaScriptCore 是一个开源的 JavaScript 引擎，可以用来解析和执行 JavaScript 代码，类似的还有 V8、Hermes 等。

JSAPI 是 JavaScriptCore 的 C++接口，它提供了一组 C++类和函数，可以用于将 JavaScript 嵌入到 C++程序中。JSAPI 提供了以下功能：

*   创建和管理 JavaScript 对象和值
*   执行 JavaScript 代码
*   访问 JavaScript 对象的属性和方法
*   注册 JavaScript 函数
*   处理 JavaScript 异常
*   进行垃圾回收

#### JavaScriptCore 类型

*   JSC::JSObject：表示一个 JavaScript 对象。
*   JSC::JSValue：表示一个 JavaScript 值。
*   JSC::JSGlobalObject：表示 JavaScript 对象的全局对象。
*   JSC::JSGlobalObjectFunctions：包含一组函数，用于实现 JSAPI 的功能，如执行 JavaScript 代码、访问 JavaScript 对象的属性和方法等。

在 JSAPI 中，JavaScript 对象和值通过 JSC::JSObject 和 JSC::JSValue 类进行表示。 JSC::JSObject 表示一个 JavaScript 对象，它可以包含一组属性和方法； JSC::JSValue 表示一个 JavaScript 值，它可以是一个对象、一个数值、一个字符串或一个布尔值等。

JSAPI 提供了 JSC::JSGlobalObject 类作为 JavaScript 对象的全局对象，所有的 JavaScript 对象都是从该全局对象继承而来。

### API 介绍

#### JSContextGroupCreate

JSContextGroupRef 是一个包含多个 JSContext 的分组，它们可以共享内存池和垃圾回收器，从而提高 JavaScript 执行效率和减少内存占用。

#### JSGlobalContextCreateInGroup

JSGlobalContextCreateInGroup 函数会创建一个 JSGlobalContextRef 类型的对象，表示一个 JavaScript 上下文对象，该对象包含一个虚拟机对象、内存池、全局对象等成员变量。该函数返回值为创建的 JSGlobalContextRef 类型的对象，表示 JavaScript 上下文对象。 由于不同的 JSGlobalContextRef 对象拥有不同的全局对象，因此它们之间不会相互影响。在不同的 JSGlobalContextRef 对象中创建的 JavaScript 对象、函数、变量等，都是相互独立的，它们之间不会共享数据或状态。

#### JSEvaluateScript

用于执行一段 JavaScript 代码。其内部工作机制主要包括以下几个步骤：

*   将 JavaScript 代码转换为抽象语法树（AST） 在执行 JavaScript 代码之前，JavaScriptCore 需要将其转换为抽象语法树（AST），这样才能对其进行解析和执行。JavaScriptCore 的 AST 解析器可以将 JavaScript 代码转换为一棵 AST 树，其中每个节点代表了一条 JavaScript 语句或表达式。
*   解析和执行 AST 树 一旦生成了 AST 树，JavaScriptCore 就可以对其进行解析和执行了。在解析过程中，JavaScriptCore 会对 AST 树进行遍历，同时将其中的变量、函数等标识符与对应的值进行绑定。在执行过程中，JavaScriptCore 会按照 AST 树的结构逐步执行其中的语句和表达式，同时根据需要调用相应的函数和方法。
*   将执行结果返回给调用方 一旦 JavaScript 代码执行完毕，JavaScriptCore 就会将其执行结果返回给调用方。这个结果可以是任何 JavaScript 值，包括数字、字符串、对象、函数等。调用方可以根据需要对这个结果进行处理和使用。

JSEvaluateScript 是一个同步函数，即在执行完 JavaScript 代码之前，它会一直等待，直到 JavaScript 代码执行完毕并返回结果。这意味着，在执行长时间运行的 JavaScript 代码时，JSEvaluateScript 函数可能会阻塞程序的运行。

我们可以通过线程来对 JS 代码的异步化（以下省略一些判空逻辑）

```scss
    void completionHandler(JSContextRef ctx, JSValueRef value, void *userData) {
    JSValueRef *result = (JSValueRef *)userData;
    *result = value;
}

    void evaluateAsync(JSContextRef ctx, const char* script, JSObjectRef thisObject, JSValueRef* exception, JSAsyncEvaluateCallback completionHandler) {
    // 异步执行
        std::thread([ctx, script, thisObject, exception, completionHandler]() {
        // 执行脚本
        JSStringRef scriptStr = JSStringCreateWithUTF8CString(script);
        JSValueRef result = JSEvaluateScript(ctx, scriptStr, thisObject, nullptr, 0, exception);
        JSStringRelease(scriptStr);
        
        // 回调 completionHandler
        completionHandler(result, exception);
        }).detach();
    }
```

此外还应关注注册到 JS 环境中的 C 接口回调，这里因尽快返回，如果有耗时任务，则需要将结果通过异步去通知 JS 层，否则会阻塞 JS 线程（也就是调用该函数的线程）。

### 关键代码示例

下面实现了一个向 global 中添加 getData 的 Native 函数

```scss
// 回调函数
JSValueRef JSCExecutor::onGetDataCallback(JSContextRef ctx, JSObjectRef function, JSObjectRef thisObject,
size_t argumentCount, const JSValueRef arguments[],
    JSValueRef *exception) {
    LOGD(TAG, "onGetDataCallback");
    NativeBridge::JSCExecutor *executor = static_cast<NativeBridge::JSCExecutor *>(JSObjectGetPrivate(
    thisObject));
    ... // 省略参数、类型等判断
    executor->xxx(); // C++业务侧
    return xxx; // 返回到JS内
}

    bool JSCExecutor::initJSC() {
    // 初始化 JSC 引擎
    context_group_ = JSContextGroupCreate();
    JSClassDefinition global_class_definition = kJSClassDefinitionEmpty;
    global_class_ = JSClassCreate(&global_class_definition);
    
    // 在js执行上下文环境(Group)中创建一个全局的js执行上下文
    context_ = JSGlobalContextCreateInGroup(context_group_, global_class_);
        if (!context_) {
        LOGE(TAG, "create js context error!");
        return false;
    }
    
    // 获取js执行上下文的全局对象
    global_ = JSContextGetGlobalObject(context_);
        if (!global_) {
        LOGE(TAG, "get js context error!");
        return false;
    }
    
    // 绑定c++对象地址
    JSObjectSetPrivate(global_, this);
    
    // 注册函数
    JSStringRef dynamic_get_data_func_name = JSStringCreateWithUTF8CString("getData");
    JSObjectRef dynamic_get_data_obj = JSObjectMakeFunctionWithCallback(context_,
    dynamic_get_data_func_name,
    onGetDataCallback);
    JSObjectSetProperty(context_,
    obj,
    dynamic_get_data_func_name,
    dynamic_get_data_obj,
    kJSPropertyAttributeDontDelete,
    NULL);
    return true;
}
```

JNI(Java Native Interface)
--------------------------

JNI 全称为 Java Native Interface，是一种允许 Java 代码与本地（Native）代码交互的技术。JNI 提供了一组 API，可以使 Java 程序访问和调用本地方法和资源，也可以使本地代码访问和调用 Java 对象和方法。 此方案需要使用 JNI 进行双向调用。

### C 调用 Java

步骤：

*   获取 JNIEnv 指针：JNIEnv 是一个结构体指针，代表了 Java 虚拟机调用本地方法时的环境信息。JNIEnv 指针可以通过 Java 虚拟机实例、调用线程等参数获取。
*   获取 Java 类、方法、字段等的 ID：通过 JNIEnv 指针，可以使用函数 FindClass()、GetMethodID()、GetStaticMethodID()、GetFieldID()等函数获取 Java 类、方法、字段等的 ID。比如在 C 中去创建 Java 对象，并操作相关 Java 对象
*   调用 Java 方法或访问 Java 字段：通过 JNIEnv 指针和 Java 对象的 ID，可以使用 CallObjectMethod()、CallStaticObjectMethod()、GetDoubleField()、SetObjectField()等函数调用 Java 方法或访问 Java 字段。

### JavaC

步骤：

1.  设计规划功能、接口
2.  Java 声明 Native 方法
3.  按照 JNI 标准实现方法，并通过 System.loadLibrary()加载

```typescript
    public class TestJNI {
        static {
        System.loadLibrary("xxx.so"); // 加载动态链接库
    }
    
    // 声明本地方法
    private native void PrintHelloWorld();
    
    // 静态方法
    public static native String GetVersion();
    
}

// C实现函数
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *reserved) { ... } // so初始化回调函数
JNIEXPORT void JNICALL JNI_OnUnload(JavaVM *jvm, void *reserved) { ... } // so卸载回调函数

// 实现
包名_PrintHelloWorld(JNIEnv *env, jobject thiz) { ... }
包名_GetVersion(JNIEnv *env, jclass clazz) { ... }
```

### 关注点

JNI 的编写会遇到有很多坑，比如 Java 封装对象和 C++对象的生命周期关系、异步调用逻辑、编译器报错不完善、类型不匹配、JVM 环境不一致、运行线程不一致等等，下面是一些常用的规则

#### 内存

*   在 C/C++代码中，使用对象或智能指针去管理内存，若使用 malloc、calloc 等函数分配内存，然后使用 free 函数释放内存。
*   在 JNI 中，通过 jobject 等 JNI 对象的创建和销毁方法，手动管理 Java 内存。例如，在 JNI 中创建 Java 对象时，需要调用 NewObject 等 JNI 方法创建 Java 对象，然后在使用完后，需要调用 DeleteLocalRef 等 JNI 方法释放 Java 对象。

#### 性能

1.  避免频繁创建和销毁 JNI 引用：创建和销毁 JNI 引用（如 jobject、jclass、jstring 等）的开销比较大，应该尽量避免频繁创建和销毁 JNI 引用。
2.  使用本地数据类型：JNI 支持本地数据类型（如 jint、jfloat、jboolean 等），这些数据类型与 Java 数据类型相对应，可以直接传递给 Java 代码，避免了数据类型转换的开销。
3.  使用缓存：如果有一些数据在 JNI 函数中需要重复使用，可以考虑使用缓存，避免重复计算，比如 GetObjectClass、GetMethodID，这些可以保存起来重复使用。
4.  避免频繁切换线程：JNI 函数会涉及到 Java 线程和本地线程之间的切换，这个过程比较耗时。因此，应该尽量避免频繁切换线程。
5.  避免 Native 侧代码对整体性能造成得侵入，如 NDK 下 std::vector 分配大数据造成得性能低下，如 RN0.63 版本以前存在这个问题：Make JSStringToSTLString 23x faster (733532e5e9 by @radex)这需要对不同得编译环境差异性有所了解。使用 NDK 编译汇编代码`/YourPath/Android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++ --target=armv7-none-linux-androideabi21 --gcc-toolchain=/YourPath/Android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64 --sysroot=/YourPath/Android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64/sysroot -S native-lib.cpp`

#### 线程安全

1.  当一个线程调用 Java 方法时，JNI 系统将自动为该线程创建一个 JNIEnv。因此，在访问 Java 对象之前，需要手动将当前线程与 JVM 绑定，以便获取 JNIEnv 指针，这个过程就叫做 "Attach"。可以使用 AttachCurrentThread 方法将当前线程附加到 JVM 上，然后就可以使用 JNIEnv 指针来访问 Java 对象了。 在 JNI 中，一般建议每个线程在使用完 JNIEnv 之后，立即 Detach，以释放资源，避免内存泄漏
2.  Native 层线程安全需要针对自己得业务去区分是否需要加锁

### 数据优化结果

![优化结果](/images/jueJin/4a745df1a997d47.png) 根据数据分析，性比之前减少了 50%的耗时

总结
==

上面概括性介绍了 JSC 和 JNI 的相关知识及经验总结，由于篇幅有限一些问题没有说明白或理解有误，欢迎一起交流~~

参考
==

[webkit.org/blog](https://link.juejin.cn?target=https%3A%2F%2Fwebkit.org%2Fblog "https://webkit.org/blog")

[developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fjavascriptcore "https://developer.apple.com/documentation/javascriptcore")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！