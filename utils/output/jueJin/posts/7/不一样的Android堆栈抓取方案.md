---
author: ""
title: "不一样的Android堆栈抓取方案"
date: 2023-03-21
description: "Android 应用堆栈是 Android 应用程序的一种重要组件，它提供了对所有正在运行的应用程序的信息。Android 应用堆栈可以帮助开发者更好地理解应用程序的运行状态，帮助开发者进行性能调优"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:102,comments:0,collects:147,views:13833,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")
> 
> 本文作者： zy

背景
--

曾几何时，我们只需要简简单单的一行 Thread.currentThread().getStackTrace() 代码就可以轻轻松松的获取到当前线程的堆栈信息，从而分析各种问题。随着需求的不断迭代，APP 遇到的问题越来越多，卡顿，ANR，异常等等问题接踵而来，那么简简单单某个时刻的堆栈信息已经不能满足我们的需求了，我们的目光逐渐转移到了每个时刻的堆栈上，如果能获取一个时间段内，每个时刻的堆栈信息，那么卡顿，以及 ANR 的问题也将被解决。

抓栈方案
----

目前对于一段时间内的抓栈方案有两种：

*   方法插桩抓栈
*   Native 抓栈

代码插桩抓栈
------

### 基本思路

APP 编译阶段，对每个方法进行插桩，在插桩的同时，填入当前方法 ID，发生卡顿或者异常的时候，将之前收集到的方法 ID 进行聚合输出。

插桩流程图：

![](/images/jueJin/616f19e62d10b5a.png)

优点：简单高效，无兼容性问题

缺点：插桩导致所有类都非 preverify，同时 verify 与 optimize 操作会在加载类时被触发。增加类加载的压力照成一定的性能损耗。另外也会导致包体积变大，影响代码 Debug 以及代码崩溃异常后错误行数

Native 抓栈
---------

使用 Native 抓栈之前，我们先了解一下 Java 抓栈的整个流程

### JAVA堆栈获取流程图

抓栈当前线程

![抓栈当前线程](/images/jueJin/171cc9131a61e06.png)

抓栈其他线程

![抓栈其他线程](/images/jueJin/962cb9241e59270.png)

### Java堆栈获取原理分析

由于当前线程抓栈和其他线程抓栈流程类似，这里我们从其他线程抓栈的流程进行分析 首先从入口代码出发，Java 层通过 `Thread.currentThread().getStackTrace()` 开始获取当前堆栈数据

```csharp
Thread.java

    public StackTraceElement[] getStackTrace() {
    
    StackTraceElement ste[] = VMStack.getThreadStackTrace(this);
    return str!=null?ste:EmptyArray.STACK_TRACE_ELEMENT;
    
}
```

Thread 中的 getStackTrace 只是一个空壳，底层的实现是通过 native 来获取的，继续往下走，通过 VMStack 来获取我们需要的线程堆栈数据

```scss
dalvik_system_vmstack.cc

    static jobjectArray VMStack_getThreadStackTrace(JNIEnv* env, jclass, jobject javaThread) {
    
    ScopedFastNativeObjectAccess soa(env);
    
    // fn 方法是线程挂起回调
    auto fn = [](Thread* thread, const ScopedFastNativeObjectAccess& soaa)
        REQUIRES_SHARED(Locks::mutator_lock_) -> jobject {
        return thread->CreateInternalStackTrace(soaa);
        };
        
        // 获取堆栈
        jobject trace = GetThreadStack(soa, javaThread, fn);
            if (trace == nullptr) {
            return nullptr;
        }
        
        // trace 是一个包含 method 的数组，有这个数据之后，我们进行数据反解，就能获取到方法堆栈明文
        return Thread::InternalStackTraceToStackTraceElementArray(soa, trace);
        
    }
```

上述代码中，需要注意三个元素

*   fn={return thread->CreateInternalStackTrace(soaa);}。 // 这个是线程挂起后的回调函数
    
*   GetThreadStack(sao,javaThread,fn) // 用来获取实际的线程堆栈信息
    
*   Thread::InternalStackTraceToStackTraceElementArray(sao,trace)，这里 trace 就是我们拿到的目标产物，这里面就包含了当前线程此时此刻的堆栈信息，需要对堆栈进行进一步的解析，才能获取到可识别的堆栈文本
    

接下来我们从获取堆栈信息函数着手，看看 GetThreadStack 的具体行为。

```scss
dalvik_system_vmstack.cc

    static ResultT GetThreadStack(const ScopedFastNativeObjectAccess& soa,jobject peer,T fn){
    
    ********
    ********
    ********
    
    ThreadList* thread_list = Runtime::Current()->GetThreadList();
    
    // 【Step1】: 挂起线程
    Thread* thread = thread_list->SuspendThreadByPeer(peer,SuspendReason::kInternal,&timed_out);
        if (thread != nullptr) {
            {
            ScopedObjectAccess soa2(soa.Self());
            
            // 【Step2】: FN 回调，这里面执行的就是抓栈操作，回到外层的回调函数逻辑中
            trace = fn(thread, soa);
        }
        
        // 【Step3】: 恢复线程
        bool resumed = thread_list->Resume(thread, SuspendReason::kInternal);
    }
}
return trace;
}
```

在该操作的三个步骤中，就包含了抓栈的整个流程，

*   【Step1】: 挂起线程，线程每时每刻都在执行方法，这样就导致当前线程的方法堆栈在不停的增加，如果想要抓到瞬时堆栈，就需要把当前线程暂停，保留瞬时的堆栈信息，这样抓出来的数据才是准确的。
    
*   【Step2】: 执行 FN 的回调，这里的 FN 回调，就是上文介绍的回调方法 fn={return thread->CreateInternalStackTrace(soaa)}
    
*   【Step3】: 恢复线程的正常运行。
    

上述流程中，我们需要重点关注一下 FN 回调里面做了什么，以及怎么做到的

```arduino
thread.cc

    jobject Thread::CreateInternalStackTrace(const ScopedObjectAccessAlreadyRunnable& soa) const {
    
    // 创建堆栈回溯观察者
    FetchStackTraceVisitor count_visitor(const_cast<Thread*>(this),&saved_frames[0],kMaxSavedFrames);
    count_visitor.WalkStack();    // 回溯核心方法
    
    // 创建堆栈回溯观察者 2 号，详细的堆栈数据就是 2 号处理返回的
    BuildInternalStackTraceVisitor build_trace_visitor(soa.Self(), const_cast<Thread*>(this), skip_depth);
    
    mirror::ObjectArray<mirror::Object>* trace = build_trace_visitor.GetInternalStackTrace();
    return soa.AddLocalReference<jobject>(trace);
    
}
```

*   创建堆回溯观察者 1 号 FetchStackTraceVisitor，最大深度 256 进行回溯，如果深度超过了 256，则使用 2 号继续进行回溯
    
*   创建堆回溯观察者 2 号 BuildInternalStackTraceVisitor，承接 1 号的回溯结果，1 号没回溯完，2 号接着回溯。
    

### 栈回溯的详细过程

回溯是通过 WalkStack 来实现的。StackVisitor::WalkStack 是一个用于在当前线程堆栈上单步遍历帧的函数。它可以用来收集当前线程堆栈上特定帧的信息，以便进行调试或其他分析操作。 例如，它可以用来找出当前线程堆栈上哪些函数调用了特定函数，或者收集特定函数的参数。 也可以用来找出线程调用的函数层次结构，以及每一层调用的函数参数。 使用这个函数，可以更好地理解代码的执行流程，并帮助进行异常处理和调试。

```ini
stack.cc

    void StackVisitor::WalkStack(bool include_transitions) {
    
        for (const ManagedStack* current_fragment = thread_->GetManagedStack();current_fragment != nullptr; current_fragment = current_fragment->GetLink()) {
        
        cur_shadow_frame_ = current_fragment->GetTopShadowFrame();
        
        ****
        ****
        ****
        
            do {
            // 通知子类，进行栈帧的获取
            bool should_continue = VisitFrame();
            cur_depth_++;
            cur_shadow_frame_ = cur_shadow_frame_->GetLink();
            } while (cur_shadow_frame_ != nullptr);
        }
        
    }
```

ManagedStack 是一个单链表，保存了当前 ShadowFrame 或者 QuickFrame 栈指针，先依次遍历 ManagedStack 链表，然后遍历其内部的 ShadowFrame 或者 QuickFrame 还原一个可读的调用栈，从而还原出当前的 Java 堆栈

![](/images/jueJin/e2971b89358c40f.png)

还原操作是通过 VisitFrame 来实现的，它是一个抽象接口，实现类我们需要看 BuildInternalStackTraceVisitor 的实现

```scss
thread.cc

    class BuildInternalStackTraceVisitor : public StackVisitor {
    
    mirror::ObjectArray<mirror::Object>* trace_ = nullptr;
        bool VisitFrame() override REQUIRES_SHARED(Locks::mutator_lock_) {
        
        ****
        ****
        ****
        
        // 每循环一帧，将其添加到 arrObj 中
        ArtMethod* m = GetMethod();
        AddFrame(m, m->IsProxyMethod() ? dex::kDexNoIndex : GetDexPc());
        return true;
    }
    
        void AddFrame(ArtMethod* method, uint32_t dex_pc) REQUIRES_SHARED(Locks::mutator_lock_) {
        ObjPtr<mirror::Object> keep_alive;
            if (UNLIKELY(method->IsCopied())) {
            ClassLinker* class_linker = Runtime::Current()->GetClassLinker();
            keep_alive = class_linker->GetHoldingClassLoaderOfCopiedMethod(self_, method);
                } else {
                keep_alive = method->GetDeclaringClass();
            }
            
            // 添加每一次遍历到的 artMethod 对象，在添加完成之后，进行 count++，进行 Arr 的偏移
            trace_->Set<false,false>(static_cast<int32_t>(count_) + 1, keep_alive);
            ++count_;
        }
        
    }
```

在执行 VisitFrame 的过程中，会将每次的 method 拎出来，然后添加至 ObjectArray 的集合中。当所有方法查找完成之后，会进行 method 的反解。

### 堆栈信息反解关键操作

反解的流程在文章开头，通过 `Thread::InternalStackTraceToStackTraceElementArray(soa,trace)` 来进行反解。

```rust
thread.cc

    jobjectArray Thread::InternalStackTraceToStackTraceElementArray(const ScopedObjectAccessAlreadyRunnable& soa,jobject internal,jobjectArray output_array,int* stack_depth) {
    
    int32_t depth = soa.Decode<mirror::Array>(internal)->GetLength() - 1;
    
        for (uint32_t i = 0; i < static_cast<uint32_t>(depth); ++i) {
        ObjPtr<mirror::ObjectArray<mirror::Object>> decoded_traces = soa.Decode<mirror::Object>(internal)->AsObjectArray<mirror::Object>();
        const ObjPtr<mirror::PointerArray> method_trace = ObjPtr<mirror::PointerArray>::DownCast(decoded_traces->Get(0));
        
        // 【Step1】: 提取数组中的 ArtMethod
        ArtMethod* method = method_trace->GetElementPtrSize<ArtMethod*>(i, kRuntimePointerSize);
        uint32_t dex_pc = method_trace->GetElementPtrSize<uint32_t>(i + static_cast<uint32_t>(method_trace->GetLength()) / 2, kRuntimePointerSize);
        
        // 【Step2】: 将 ArtMethod 转换成业务上层可识别的 StackTraceElement 对象
        const ObjPtr<mirror::StackTraceElement> obj = CreateStackTraceElement(soa, method, dex_pc);
        soa.Decode<mirror::ObjectArray<mirror::StackTraceElement>>(result)->Set<false>(static_cast<int32_t>(i), obj);
    }
    return result;
    
}

static ObjPtr<mirror::StackTraceElement> CreateStackTraceElement(

const ScopedObjectAccessAlreadyRunnable& soa,
ArtMethod* method,
    uint32_t dex_pc) REQUIRES_SHARED(Locks::mutator_lock_) {
    
    // 【Step3】: 获取行号
    line_number = method->GetLineNumFromDexPC(dex_pc);
    
    // 【Step4】: 获取类名
    const char* descriptor = method->GetDeclaringClassDescriptor();
    std::string class_name(PrettyDescriptor(descriptor));
    class_name_object.Assign(mirror::String::AllocFromModifiedUtf8(soa.Self(), class_name.c_str()));
    
    // 【Step5】: 获取类路径
    const char* source_file = method->GetDeclaringClassSourceFile();
    source_name_object.Assign(mirror::String::AllocFromModifiedUtf8(soa.Self(), source_file));
    
    
    // 【Step6】: 获取方法名
    const char* method_name = method->GetInterfaceMethodIfProxy(kRuntimePointerSize)->GetName();
    Handle<mirror::String> method_name_object(hs.NewHandle(mirror::String::AllocFromModifiedUtf8(soa.Self(), method_name)));
    
    // 【Step7】: 数据封装回抛
    return mirror::StackTraceElement::Alloc(soa.Self(),class_name_object,method_name_object,source_name_object,line_number);
}
```

到这里我们已经分析完一次由 Java 层触发的堆栈调用链路一直到底层的实现逻辑。

### 核心流程

我们的目标是抓栈，因此我们只需要关注 `count_visitor.WalkStack` 之后的栈回溯流程。

![](/images/jueJin/1e60d025899792f.png)

### 耗时阶段

这里最后阶段将 ArtMethod 转换成业务上层可识别的 StackTraceElement，由于涉及到大量的字符串操作，给 Java 堆栈的执行贡献了很大的耗时占比。

抓栈新思路
-----

传统的抓栈产生的数据很完善，过程也比较耗时。我们是否可以简化这个流程，提高抓栈效率呢，理论上是可以的，我们只需要自己将这个流程复写一份，然后抛弃部分的数据，优化数据获取时间，同样可以做到更高效的抓栈体验。

### Native抓栈逻辑实现

根据系统抓栈流程，我们可以梳理出要做的几个事情点

#### 要做的事情：

*   挂起线程【获取挂起线程方法内存地址】
    
*   进行抓栈【获取抓栈方法内存地址】【优化抓栈耗时】
    
*   恢复线程的执行【获取恢复线程方法内存地址】
    

#### 遇到的问题及解决方案：

*   如何获取系统 threadList 对象

threadList 是线程执行挂起和恢复的关键对象，系统未暴露该对象的直接访问操作，因此我们只能另辟蹊径来获取它，threadList 获取依赖流程图如下：

![](/images/jueJin/f8c500db12d9dfe.png)

如果想要执行线程的挂起 thread\_->SuspendThreadByPeer 或者恢复 thread\_list->Resume ，首先需要获取到 thread\_list 系统对象，该对象是通过 Runtime::Current()->getThreadList() 获取而来，，因此我们要先获取 Runtime ， Runtime 的获取可以通过 JavaVmExt 来获取，而 JavaVmExt 可以通过 JNI\_OnLoad 时的 JavaVM 来获取，完整流程如下代码所示

```ini
    JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *reserved) {
    
    JNIEnv *env = NULL;
        if (vm->GetEnv((void **) &env, JNI_VERSION_1_6) != JNI_OK) {
        return -1;
    }
    
    JavaVM *javaVM;
    env->GetJavaVM(&javaVM);
    auto *javaVMExt = (JavaVMExt *) javaVM;
    void *runtime = javaVMExt->runtime;
    
    // JavaVMExt 结构
    // 10.0 https://android.googlesource.com/platform/art/+/refs/tags/android-10.0.0_r1/runtime/jni/java_vm_ext.h
    
    // 【Step1】. 找到 Runtime_instance_ 的位置
        if (api < 30) {
        runtime_instance_ = runtime;
            } else {
            int vm_offset = find_offset(runtime, MAX_SEARCH_LEN, javaVM);
            runtime_instance_ = reinterpret_cast<void *>(reinterpret_cast<char *>(runtime) + vm_offset - offsetof(PartialRuntimeR, java_vm_));
        }
        
        // 【Step2】. 以 runtime_instance_ 的地址为起点，开始找到 JavaVMExt 在 【https://android.googlesource.com/platform/art/+/refs/tags/android-10.0.0_r29/runtime/runtime.h】中的位置
        // 7.1 https://android.googlesource.com/platform/art/+/refs/tags/android-7.1.2_r39/runtime/runtime.h
        int offsetOfVmExt = findOffset(runtime_instance_, 0, MAX, (size_t) javaVMExt);
            if (offsetOfVmExt < 0) {
            ArtHelper::reduce_model = 1;
            return;
        }
        
        // 【Step3】. 根据 JavaVMExt 的位置，根据各个版本的结构，进行偏移，生成 PartialRuntimeSimpleTenR 的结构
            if (ArtHelper::api == ANDROID_P_API || ArtHelper::api == ANDROID_O_MR1_API) {
            PartialRuntimeSimpleNineR *simpleR = (PartialRuntimeSimpleNineR *) ((char *) runtime_instance_ + offsetOfVmExt - offsetof(PartialRuntimeSimpleNineR, java_vm_));
            thread_list = simpleR->thread_list_;
                }else if (ArtHelper::api <= ANDROID_O_API) {
                PartialRuntimeSimpleSevenR *simpleR = (PartialRuntimeSimpleSevenR *) ((char *) runtime_instance_ + offsetOfVmExt - offsetof(PartialRuntimeSimpleSevenR, java_vm_));
                thread_list = simpleR->thread_list_;
                    }else{
                    PartialRuntimeSimpleTenR *simpleR = (PartialRuntimeSimpleTenR *) ((char *) runtime_instance_ + offsetOfVmExt - offsetof(PartialRuntimeSimpleTenR, java_vm_));
                    thread_list = simpleR->thread_list_;
                }
                
            }
```

经过三个步骤，我们就可以获取到底层的 Runtime 对象，以及最关键的 thread\_list 对象，有了它，我们就可以对线程执行暂停和恢复操作。

*   线程的暂停和恢复

因为 SuspendThreadByPeer 和 Resume 方法我们访问不到，但如果我们能够找到这两个方法的内存地址，那么就可以直接执行了，怎么获取到内存地址呢？这里使用 [Nougat\_dlfunctions](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Favs333%2FNougat_dlfunctions "https://github.com/avs333/Nougat_dlfunctions") 的 fake\_dlopen() 和 fake\_dlsym() 来获取已被加载到内存的动态链接库 libart.so 中方法内存地址。

```c
WalkStack_ = reinterpret_cast<void (*)(StackVisitor *, bool)>(dlsym_ex(handle,"_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb"));
SuspendThreadByThreadId_ = reinterpret_cast<void *(*)(void *, uint32_t, SuspendReason, bool *)>(dlsym_ex(handle,"_ZN3art10ThreadList23SuspendThreadByThreadIdEjNS_13SuspendReasonEPb"));
Resume_ = reinterpret_cast<bool (*)(void *, void *, SuspendReason)>(dlsym_ex(handle, "_ZN3art10ThreadList6ResumeEPNS_6ThreadENS_13SuspendReasonE"));
PrettyMethod_ = reinterpret_cast<std::string (*)(void *, bool)>(dlsym_ex(handle, "_ZN3art9ArtMethod12PrettyMethodEb"));
```

到这里，我们已经已经可以完成线程的挂起和恢复了，接下来就是抓栈的操作处理流程。

*   自定义抓栈

同样的，由于我们已经获取到用于栈回溯的 WalkStack 方法地址，我们只需要提供一个自定义的 TraceVisitor 类即可实现栈回溯

```arduino
    class CustomFetchStackTraceVisitor : public StackVisitor {
    
        bool VisitFrame() override {
        
        // 【Step1】: 系统堆栈调用时我们分析到的流程，每帧遍历时会走一次当前流程
        void *method = GetMethod();
        
        // 【Step2】: 获取到 Method 对象之后，使用 circular_buffer 存起来，没有多余的过滤逻辑，不反解字符串
            if (CustomFetchStackTraceVisitorCallback!= nullptr){
            return CustomFetchStackTraceVisitorCallback(method);
        }
        return true;
    }
    
}
```

获取到 Method 之后，为了节省本次的抓栈耗时，我们使用固定大小的 circular\_buffer 将数据存储起来，新数据自动覆盖老数据，根据需求，进行异步反解 Method 中的详细堆栈数据。到这里，自定义的 Native 抓栈逻辑就完成了。

总结
--

目前自定义 native 抓栈的多个阶段需要兼容不同系统版本的 thread\_list 获取，以及不同版本的线程挂起，线程恢复的函数地址获取。这些都会导致出现或多或少的兼容性问题，这里可以通过两种方案来规避，第一种是过滤读取到的不合法地址，对于这类不合法地址，需要跳过抓栈流程。另外一种就是动态配置下发过滤这些不兼容版本机型。

参考资料
----

*   Nougat\_dlfunctions：[github.com/avs333/Noug…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Favs333%2FNougat_dlfunctions "https://github.com/avs333/Nougat_dlfunctions")
*   环形缓冲区：[baike.baidu.com/item/%E7%8E…](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E7%258E%25AF%25E5%25BD%25A2%25E7%25BC%2593%25E5%2586%25B2%25E5%2599%25A8%2F22701730 "https://baike.baidu.com/item/%E7%8E%AF%E5%BD%A2%E7%BC%93%E5%86%B2%E5%99%A8/22701730")
*   Android 平台下的 Method Trace 实现解析：[zhuanlan.zhihu.com/p/526960193…](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F526960193%3Futm_id%3D0 "https://zhuanlan.zhihu.com/p/526960193?utm_id=0")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！