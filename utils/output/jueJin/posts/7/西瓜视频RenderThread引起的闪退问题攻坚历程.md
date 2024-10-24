---
author: "字节跳动技术团队"
title: "西瓜视频RenderThread引起的闪退问题攻坚历程"
date: 2023-12-14
description: "本文将深入揭秘西瓜一个 TOP Native Crash 的攻克过程，为解决类似问题提供宝贵的参考！"
tags: ["客户端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:70,comments:0,collects:78,views:13757,"
---
背景
==

影响
--

西瓜之前存在过一类RenderThread闪退，从堆栈上看，全部都是系统so调用，给人的第一印象像是一个系统bug，无从下手。闪退集中在Android 5~6上，表现为打开直播间立即闪退。该问题在2022年占据Native Crash Top5，2023年更是上升到到Top1。因此有必要投入时间和精力再重新审视一下这个问题。在历经多周的源码分析和排查后，逐步明确了问题根因并修复，最终取得了显著的稳定性收益和业务收益。

接下来，我们将抽丝剥茧，一步步深入分析这个历史遗留问题，揭开它背后真正的原因。

基本信息
----

**具体堆栈如下：**

![](/images/jueJin/2bf7efdf9d40429.png)

堆栈都是系统的so调用，不能明确具体闪退业务场景，只能看出是RenderThread线程主动abort了。

根据abort message找到对应的abort代码，在CanvasContext::requireSurface时闪退了，代码如下：

![](/images/jueJin/9e03132fe4de4d6.png)

**问题特征：**

问题集中在Android 5.0~6.0，线程集中在RenderThread，无明显机型、厂商特征。

RenderThread简介
--------------

为了便于理解下面的分析过程，先对RenderThread简单的介绍。顺便看一下是怎么调用到CanvasContext::requireSurface的。

相关类图如下：

![图.png](/images/jueJin/5a999a6cf72d459.png)

相关源码：[frameworks/base/libs/hwui/renderthread](https://link.juejin.cn?target=https%3A%2F%2Fcs.android.com%2Fandroid%2Fplatform%2Fsuperproject%2F%2B%2Fandroid-6.0.0_r1%3Aframeworks%2Fbase%2Flibs%2Fhwui%2Frenderthread%2F "https://cs.android.com/android/platform/superproject/+/android-6.0.0_r1:frameworks/base/libs/hwui/renderthread/")

**RenderThread::threadLoop**

RenderThread继承自Thread和Singleton，是一个单例模式的线程，通过RenderThread.getInstance()获取。和主线程很像，内部是一个通过for实现的无限循环，不断从TaskQueue里通过nextTask函数获取RenderTask并执行，RenderTask执行完后会按需调用requestVsync。核心代码在threadLoop函数中：

![](/images/jueJin/1f917452b4ae4a2.png)

**ThreadedRender**

Java层通过ThreadedRender与RenderThread进行通信。当Window启用硬件加速时，ViewRootImpl会通过HardwareRenderer.create()创建一个ThreadedRender实例。ThreadedRender在创建时，会调用nCreateProxy在native层创建一个RenderProxy。ThreadedRender通过RenderProxy向RenderThread提交任务。

![](/images/jueJin/1557c185fcb846a.png)

**RenderProxy**

RenderProxy在创建时，会同步创建一个CanvasContext，再通过RenderThread.getInstance()拿到RenderThread实例。RenderProxy通过CREATE\_BRIDGE定义了许多Bridge函数，再通过SETUP\_TASK把这些Bridge函数包装成RenderTask，再通过postAndWait提交给RenderThread调用。postAndWait之后，当前线程进入等待状态，当对应的task执行完毕之后唤醒当前线程。以RenderProxy::createTextureLayer为例：

![](/images/jueJin/3e1790e4a19f4bc.png)

![](/images/jueJin/72b32b5928de4ad.png)

**CanvasContext**

RenderProxy把任务提交给RenderThread之后，执行的实际上是CanvasContext::createTextureLayer，就是在这里调用了requireSurface。

![](/images/jueJin/40b8e335cef4454.png)

初步猜想
====

**其他 App 相似问题修复**

其他端App也曾有过'**requireSurface() called but no surface set!** '相关闪退。原因是：在Activity进行侧滑退出时，侧滑框架需要强制对下层Activity进行绘制生成Bitmap，再用这个Bitmap来实现Activity的切换效果。但由于下层Activity此前已处于不可见状态，可能有业务层主动释放了下层Activity中的TextureView，导致了no surface set的闪退。经过对西瓜的侧滑框架的源码分析，发现不会产生此类问题，因此西瓜的问题应该另有其因。

**正面分析西瓜问题**

问题的条件是mEglSurface == EGL\_NO\_SURFACE，看下mEglSurface赋值为EGL\_NO\_SURFACE的时机。

总共有两处：

**第一处：CanvasContext::setSurface**

这里总共两处mEglSurface赋值操作。一处直接赋值为EGL\_NO\_SURFACE，另一处为mEglManager.createSurface的返回值。而mEglManager.createSurface在返回前判断如果是EGL\_NO\_SURFACE会主动abort，显然createSurface的返回值一定不是EGL\_NO\_SURFACE。

```Java
    void CanvasContext::setSurface(ANativeWindow* window) {
        if (mEglSurface != EGL_NO_SURFACE) {
        mEglSurface = EGL_NO_SURFACE;
    }
    if (window) {//不可能返回EGL_NO_SURFACE
    mEglSurface = mEglManager.createSurface(window);
}
}

    EGLSurface EglManager::createSurface(EGLNativeWindowType window) {
    EGLSurface surface = eglCreateWindowSurface(mEglDisplay, mEglConfig, window, nullptr);
    LOG_ALWAYS_FATAL_IF(surface == EGL_NO_SURFACE,"Failed to create EGLSurface for window %p, eglErr = %s",(void*) window, egl_error_str());
    return surface;
}
```

那么这里根据window是否为nullptr又可以分为两种情况：

1.  setSurface(nullptr)之后，mEglSurface 最终赋值为 EGL\_NO\_SURFACE，之后调用requireSurface发生abort。
2.  setSurface(window)，第5行会先设置为EGL\_NO\_SURFACE，在第10行createSurface返回之前，此时在另外一个线程调用requireSurface也会发生abort。

**第二处：初始值**

初始值为EGL\_NO\_SURFACE。只有调用CanvasContext::setSurface时，mEglSurface 才会被赋值，在此之前，调用了requireSurface也会引发闪退。

```Java
    class CanvasContext : public IFrameCallback {
    private:
    EGLSurface mEglSurface = EGL_NO_SURFACE;
}
```

总结下来，有三个时机调用requireSurface会导致闪退：

1.  多线程并发，mEglSurface短暂为EGL\_NO\_SURFACE
2.  CanvasContext::setSurface(nullptr)之后，即mEglSurface被销毁
3.  CanvasContext::setSurface之前，即mEglSurface未初始化

深入分析
====

**7.0+系统是如何避免这个问题的？**
---------------------

从多维信息看出，问题在6.0及以下版本发生。那么7.0上系统做了哪些优化，是如何规避我们上面三种可能的情况的？这些优化思路对我们解决问题能否提供帮助？

对比6.0和7.0代码之后，发现谷歌直接把requireSurface这个方法移除了！

逐个翻看6.0~7.0上RenderThread相关的commit，最终找到了这个commit(8afcc769)。这里确实是把requireSurface删除了，并在createTextureLayer中调用了一下 mEglManager.initialize()。而EglManager::initialize里的实现，是执行下EglManager的初始化，这里跟6.0基本一致。

![](/images/jueJin/c6bd22475e914d0.png)

![](/images/jueJin/e227cebabcd84c0.png)

![](/images/jueJin/7511a872c39842d.png)

那6.0上的abort原来是可以直接删掉的吗？如果是这样，我们是不是可以有样学样，尝试hook requireSurface，把abort去掉，再主动调用一下mEglManager.initialize，从而达到这个commit相似的修复效果？

在云真机上找了个6.0的设备，把libhwui.so pull下来，通过 **readelf -sW libhwui.so**查看requireSurface的符号。发现，没有requireSurface的符号。解开so后发现，requireSurface被inline进了createTextureLayer：

![](/images/jueJin/5ee8146feb044cf.png)

再尝试一下hook requireSurface的上一层调用CanvasContext::createTextureLayer，发现也没有对应的符号，只有RenderProxy::createTextureLayer 的符号。如果采用7.0的修复方案，需要修改的指令非常多。而且，这个MR中还有其他改动，要不要一起hook？这些问题暂时还没搞清楚，花大力气去做的话风险太高。

![](/images/jueJin/43a87ad753794a8.png)

看起来，参考7.0修复方案操作难度大，并且不确定是否有效。我们先把它作为备选方案，另谋出路！

正面分析三种可能性
---------

### **多线程问题？**

CanvasContext的createTextureLayer和setSurface相关代码，都被RenderProxy转移到了RenderThread上执行，而RenderThread又是单例的，所以这里不存在多线程问题，**因此可以直接排除线程并发问题**。

### **setSurface(null)导致？**

前面分析过，setSurface(nullptr)也会导致EGL\_NO\_SURFACE。下面是ThreadedRender一个大概的调用时序图，把几个可能产生EGL\_NO\_SURFACE的setSurface调用做了标记，序号24就是的闪退函数**requireSurface**。 时序图：

![](/images/jueJin/24c7bf7a5ffd465.png)

可以看出在CanvasContext中，setSurface的调用有：initialize、swapBuffers、makeCurrent、updateSurface、destory、~ConvasContext。对应的java层调用为ThreadedRender中的的initialize、draw、createTextureLayer、updateSurface、destory、finalize方法。排除一些不会出现异常的方法：

**排除ThreadedRender.initialize**

initialize时java层传过来的surface做了判断保护，可以确保surface不为nullptr，因此可以排除initialize，代码如下：

![](/images/jueJin/064d7cf7e1e548b.png)

**排除ThreadedRender.draw**

draw对应的问题是swapBuffers失败。发生在swapBuffers失败时，也就是eglSwapBuffers错误了。

![](/images/jueJin/a2c21ec8f9c3478.png)

系统有以下两种方式处置错误：

1.  EGL\_BAD\_SURFACE：打印失败日志。但翻看多个跟踪日志，均没有发现类似日志，暂时不关注。
2.  其他EGL错误：直接abort掉，此时变成另外一个闪退，因此可以排除。

综上，对于swapBuffers失败这种情况可能存在，但未发现相关报错日志，暂时不作过多关注。相关代码如下：

![](/images/jueJin/ea3874d474ca4ef.png)

**排除ThreadedRender.finalize**

ThreadedRender.finalize之后，会在native层通过delete 释放RenderProxy和ConvasContext，在~ConvasContext析构时调用setSurface(nullptr)。因此，如果之后再调用requireSurface，应该会发生SIGSEGV相关错误，不可能出现surface not set异常。因此，也可以排除掉。代码如下：

![](/images/jueJin/82c4fc17625243d.png)![](/images/jueJin/a449ce9b50b0463.png)![](/images/jueJin/84f0199e5a864d7.png)

**剩余情况**

排除了intialize、swapBuffers、finalize之后，还剩下makeCurrent失败、updateSurface(nullptr)、destory都有可能产生问题，上游调用比较多追踪起来依然比较困难，暂时无法排除。

### **初始化前触发了requireSurface？**

一般来说，setSurface的首次调用是在initialize中。那么，如果在initialize之前就调用了requireSurface，是不是就会出问题呢？从前面的分析可以看出，requireSurface的上游是java层的createTextureLayer，而createTextureLayer的调用处只有一个，在TextureView的getHardwareLayer中。

![](/images/jueJin/0d64f20a6775438.png)

getHardwareLayer是View的一个方法，默认返回null。从注释上也能看出，在6.0上只有TextureView用到了这个方法，调用处也只有移除在getBitmap中。在7.0上也是直接把getHardwareLayer从View中移除了，变成TextureView的一个方法。而getBitmap是个public方法，这里是可以被app调用到的。

![](/images/jueJin/face3e65604a40e.png)

![](/images/jueJin/77aacc0b40a5415.png)

闪退的前提条件：

1.  ThreadedRender.initialize还未调用
2.  ThreadedRender.destroy或者ThreadedRender.updateSurface(null)之后

在Java层触发requireSurface步骤如下：

*   TextureView.getBitmap => ThreadedRender.createTextureLayer => ConvasContext::requireSurface

最终定位
====

验证分析结论
------

通过前面的分析，找到了问题的前提条件，并发现了一条触发requireSurface的方式。那么，就可以结束纸上谈兵，通过实操来在本地复现这个闪退，来实锤前面的结论。

**ThreadedRender.initialize还未调用**

由于ThreadedRenderer不是公开api，需要通过反射来创建实例。拿到实例后不调用其intialize方法，直接反射调用createTextureLayer。代码如下：

![](/images/jueJin/b0702bc774c4496.png)

果然，复现了'requireSurface() called but no surface set!' 这个问题：

![](/images/jueJin/45a79b97583444b.png)

**destroy或updateSurface(null)**

通过反射创建ThreadedRender实例，先执行ThreadedRender.intialize，之后调用destroy或updateSurface清空surface，最后调用createTextureLayer，也成功复现了这个闪退。

业务场景定位
------

前面的复现，只是从技术层面确认了问题发生的几种可能，但还没有与业务场景关联起来。真实的问题是否在前面提到的这几种可能中间？如果在的话，那具体的调用点在哪，又该如何修复？

**尝试在真实场景中复现**

通过shaddow hook RenderProxy的Initialize、destroy、updateSurface、createTextureLayer等函数，在hook函数中打印一些日志。由于RenderProxy可能存在多个实例，需要在日志里加上RenderProxy实例的地址来方便追踪单个RenderProxy调用时序。

hook函数如下：

![](/images/jueJin/ea1562ee781644f.png)

尽管这个问题在android 6上闪退率比较高，但我用6.0测试机跑自动化测试，还是没有复现这个问题。

### 线上定位

问题不是必现的，排查进程在线下难以为继。而只有在真实的业务场景中复现，才能明确问题根因，找到最佳修复方案。因此，需要加把这些hook点上线进一步排查。上线无小事，线下可以小步快走，逐渐定位问题。但上线步子一定要稳，不能迈太大。但也不能太小，否则周期会拉的很长。所以，既要保证有足够的信息排查，也要尽可能的降低稳定性和性能影响。

**明确业务堆栈**

前面的hook方案只能确认真实业务场景是否也有调用时序问题，并不清楚具体的业务调用堆栈。

从业务上层代码到异常点，必然经过了ThreadedRender的Initialize、destroy、update、createTexture等方法，那么通过java hook把这些方法hook住，并打印堆栈应该就定位到业务代码。需要注意的是：

1.  稳定性问题

Java hook 目前主流的方案中还没有能达到线上大规模使用的水平，只能小流量观察。

保障方案：系统版本限制在6.0，放量计划1%->5%->10%，小流量观察。

2.  性能问题

由于这些api调用频率可能很高，也都在主线程，直接打印堆栈会影响性能。真正需要关注的就是异常前的几次调用，且有些case可以通过以下条件预判，其余的堆栈都不必要甚至是干扰信息。需要关注的堆栈如下：

1.  initialize：不需要堆栈。只要知道有没有调用过，打印一行日志即可。
2.  destroy：必须全部打印堆栈。发生在异常前，无法预判过滤。
3.  updateSurface：surface==null时打印堆栈。surface不为null不会导致异常。
4.  createTextureLayer：未初始化或者surface==null时打印堆栈。只有这两种可能会有异常。

总结：可以通过surface是否为null、initialize是否调用过这两个条件减少stackTrace。

在ThreadedRender中，surface都被透传给了native层，没有对应的Java引用，需要手动维护一个java 层的实例。初始化状态可以通过反射ThreadedRenderer.mInitialized拿到，不过既然已经hook intialize和destroy了，这里也选择手动维护一个初始化状态，毕竟可以减少一次反射调用。

```Java
    public class ThreadedRenderer extends HardwareRenderer {
    private boolean mInitialized = false;
    
    @Override
        void updateSurface(Surface surface) throws OutOfResourcesException {
        updateEnabledState(surface);//透传给了Native层，Java层没有引用
        nUpdateSurface(mNativeProxy, surface);
    }
}
```

Java hook伪代码如下：

```Java
    public static class ExtraInfo {
    private boolean isSurfaceNull = true;
    private boolean mInitialized = false;
}

static Map<Object, ExtraInfo> infoMap = new ConcurrentHashMap<>();

    private static ExtraInfo extraInfo(Object instance) {
    ExtraInfo threadedRendererInfo = infoMap.get(instance);
        if (threadedRendererInfo == null) {
        threadedRendererInfo = new ExtraInfo();
        infoMap.put(instance, threadedRendererInfo);
    }
    return threadedRendererInfo;
}
    public static boolean initializedHook(Object instance,Surface surface) {
    extraInfo(instance).mInitialized = true;
    return (Boolean) Hubble.callOrigin(initializeHookEntry, instance, surface);
}

    public static void destroyHook(Object instance) {
    infoMap.remove(instance);
    Log.d("REPAIR", "destroy", new Throwable());
    Hubble.callOrigin(destroyHookEntry, instance);
}

    public static void updateSurfaceHook(Object instance, Surface surface) {
    extraInfo(instance).isSurfaceNull = surface == null;
        if (surface == null) {
        Log.d("REPAIR", "updateSurface null ", new Throwable());
    }
    Hubble.callOrigin(destroyHookEntry, instance);
}

    public static void createTextureLayerHook(Object instance) {
    ExtraInfo extraInfo = extraInfo(instance);
        if (extraInfo.mInitialized || extraInfo.isSurfaceNull) {
        Log.d("REPAIR", "createTextureLayer null ", new Throwable());
    }
    return Hubble.callOrigin(createTextureHookEntry, instance);
}
```

### **线上日志**

上线后成功采集到了关键的Java调用堆栈！基本都集中在直播业务场景下，初始化前调用requireSurface。也有一些零星的destroy之后requireSurface的case，由于量级太小本文不做重点讨论。

**ThreadedRender.Initialize之前**

日志截图如下：

![](/images/jueJin/fad023daa8b8421.png)

**调用时序问题确认：**

对于地址为0x814a0b0的RenderProxy实例，没有它intialize相关调用日志，只有一条createTextureLayer调用日志。可以明确，这个RenderProxy实例是在initialize之前调用createTextureLayer导致闪退！

**Java 堆栈分析：**

Log.d会对过长的堆栈进行截取，FrameLayout.onMeasure之前的都被截取了，不过对于排查问题，影响不大。

堆栈关键信息整理如下：

1.  闪退时正在执行onMeasure
2.  在com.bytedance.android.livesdk.chatroom.ui.LivePlayerWidget.loadSharedPlayer中调用了**TextureView的getBitmap方法**，再到ThreadedRender.creatTextureLayer，之后就发生了Native crash。

**为什么没有intialize？**
-------------------

onMeasure会早于ThreadedRender.initialize执行吗？

ThreadedRender.initialize和performMeasure相关的代码都在performTraversals中，再次回到源码中去分析。从代码结构来看，initialize前后都有measure相关操作。initialize之前通过measureHierarchy调用了performMeasure，initialize之后是直接调用performMeasure。由于measureHierarchy外部包了许多判断条件，所以不能直接从代码行的上下关系，得出measure早于initialize的结论，但我们可以保持这个怀疑进一步验证。

这个方法过于巨大，移除无关代码后如下：

```Java
    private void performTraversals() {
        if (mFirst) {
        mLayoutRequested = true;
    }
    
    boolean layoutRequested = mLayoutRequested && (!mStopped || mReportNextDraw);
        if (layoutRequested) {
        windowSizeMayChange |= measureHierarchy(host, lp, res, desiredWindowWidth, desiredWindowHeight);
    }
    
        if (mApplyInsetsRequested) {
            if (mLayoutRequested) {
            windowSizeMayChange |= measureHierarchy(host, lp, mView.getContext().getResources(), desiredWindowWidth, desiredWindowHeight);
        }
    }
        if (mFirst || windowShouldResize || insetsChanged || viewVisibilityChanged || params != null) {
            if (!hadSurface) {
                if (mSurface.isValid()) {
                    if (mAttachInfo.mHardwareRenderer != null) {
                    hwInitialized = mAttachInfo.mHardwareRenderer.initialize(mSurface);
                }
            }
        }
        
            if (!mStopped || mReportNextDraw) {
                if (focusChangedDueToTouchMode || mWidth != host.getMeasuredWidth() || mHeight != host.getMeasuredHeight() || contentInsetsChanged) {
                performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
        }
    }
}

private boolean measureHierarchy(final View host, final WindowManager.LayoutParams lp,
    final Resources res, final int desiredWindowWidth, final int desiredWindowHeight) {
    boolean goodMeasure = false;
        if (lp.width == ViewGroup.LayoutParams.WRAP_CONTENT) {
            if (baseSize != 0 && desiredWindowWidth > baseSize) {
            performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                if ((host.getMeasuredWidthAndState()&View.MEASURED_STATE_TOO_SMALL) == 0) {
                goodMeasure = true;
                    } else {
                    performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                        if ((host.getMeasuredWidthAndState()&View.MEASURED_STATE_TOO_SMALL) == 0) {
                        goodMeasure = true;
                    }
                }
            }
        }
            if (!goodMeasure) {
            performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
        }
        return windowSizeMayChange;
    }
```

由于堆栈被裁剪了，无法确认异常是从哪个分支过来的。不过没关系，注意到当mFirst=true时，满足layoutRequested = true，会先调用执行measureHierarchy，可以在本地模拟mFirst=true这种情况，即可验证。

**本地通过onMeasure复现**

本地写个demo，在FrameLayout.onMeasure中立即调用TextureView.getBitmap，并通过反射查看mFirst的值，找个6.0的云真机验证一下。onMeasure会连续执行多次，只有第一次的mFirst为true，但没能复现问题，代码如下：

```Java
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    boolean first=reflectFirst();//反射获取mFirst
    activity.log("mFirst=" + first);
    Bitmap bitmap = mTextureView.getBitmap(mBitmap);
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
}
```

再来看下mTextureView.getBitmap的实现，

```Java
    public Bitmap getBitmap(Bitmap bitmap) {
        if (bitmap != null && isAvailable()) {
            if (mLayer == null && mUpdateSurface) {
            getHardwareLayer();
        }
    }
    return bitmap;
}

    public boolean isAvailable() {
    return mSurface != null;
}

    public void setSurfaceTexture(@NonNull SurfaceTexture surfaceTexture) {
    mSurface = surfaceTexture;
}
```

可以看到，要想执行到ThreadedRender.createTextureLayer还需要满足以：isAvailable()为true，手动调用一下TextureView.setSurfaceTexture就可以满足。

根据猜想，再次编写代码终于**复现成功！** demo如下：

```Java
mTextureView.setSurfaceTexture(new SurfaceTexture(0));

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    boolean first=reflectFirst();
    activity.log("mFirst=" + first);;
    mTextureView.getBitmap(mBitmap);
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
}
```

尝试只在mFisrt=false时执行getBitmap，再次运行，不崩了。可见异常的关键条件就是mFirst！

```Java
if (!first) { //没问题
mTextureView.getBitmap(mBitmap);
}
```

问题根因
====

梳理下整体流程。ViewRootImpl首次performTraversals时(mFirst=true)，onMeasure会早于ThreadedRenderer.initialize。而业务方在onMeasure中又调用了TextureView.getBitmap，最终在native层会调用CanvasContext::requreSurface。由于还没有执行过CanvasContext::initialize，当前mEglSurface为EGL\_NO\_SURFACE，于是在Android5~6上触发了abort，发生surface not set的异常。

总结起来：在android6.0上，ViewRootImpl首次performTraversals时，如过在onMeasure中调用了TextureView.getBitmap，就可能会发生这个异常。

线上还存在一些零星的destroy之后requireSurface、swapBuffers失败后requireSurface的异常，由于排查思路大同小异，这里就不展开说了。

修复方案
----

通过字节码插桩全局替换TextureView.getBitmap方法，当ViewRootImpl.mFirst=true时，就返回默认值而不执行getBitmap原有逻辑，这样就不会调用到ThreadedRender.createTextureLayer。

但由于mFirst只能通过反射获取，这可能会影响performTraversals性能，有没有性能更好的方案？

通过代码分析，发现performTraversals会经历layout阶段，而layout之后View会增加一个PFLAG3\_IS\_LAID\_OUT：

```Java
/**
* Flag indicating that the view has been through at least one layout since it
* was last attached to a window.
*/
static final int PFLAG3_IS_LAID_OUT = 0x4;

    public void layout(int l, int t, int r, int b) {
    mPrivateFlags3 |= PFLAG3_IS_LAID_OUT;
}


    public boolean isLaidOut() {
    return (mPrivateFlags3 & PFLAG3_IS_LAID_OUT) == PFLAG3_IS_LAID_OUT;
}
```

因此，可以通过isLaidOut ()获取到这一个属性，达到和mFirst基本一致的效果。

**最终方案：**

插装替换全局TextureView.getBitmap调用，增加textureView.isLaidOut()判断。

```Java
    public static boolean isGetBitmapSafe(TextureView textureView) {
    return Build.VERSION.SDK_INT > 23 || textureView.isLaidOut() || !AppSettings.inst().mFerretSettings.autoFixRequireSurface.enable();
}

@ReplaceMethodInvoke(targetClass = TextureView.class, methodName = "getBitmap", includeOverride = true)
    public static Bitmap getBitmapHook(TextureView textureView) {
    return isGetBitmapSafe(textureView) ? textureView.getBitmap() : null;
}

@ReplaceMethodInvoke(targetClass = TextureView.class, methodName = "getBitmap", includeOverride = true)
    public static Bitmap getBitmapHook(TextureView textureView, int width, int height) {
    return isGetBitmapSafe(textureView) ? textureView.getBitmap(width, height) : null;
}

@ReplaceMethodInvoke(targetClass = TextureView.class, methodName = "getBitmap", includeOverride = true)
    public static Bitmap getBitmapHook(TextureView textureView, Bitmap bitmap) {
    return isGetBitmapSafe(textureView) ? textureView.getBitmap(bitmap) : bitmap;
}
```

修复效果
----

实验全量后requireSurface 相关crash明显下降，观察两周业务指标没有明显劣化，直播场景有正向收益，符合预期。全量后量级大幅下降，还剩下一小部分主要是老版本、以及一些少量的destroy、swapBuffer失败相关的问题。

业务收益：看播渗透显著提升；人均看播天数显著提升；

稳定性收益：Native Crash大幅下降

![](/images/jueJin/61b2ae57bc99403.png)

![](/images/jueJin/a7779f822a40447.png)

后续思考
====

这个requireSurface问题发生在RenderThread，但造成问题的原因在主线程，因此如果能在RenderThread线程发生native crash时抓到主线程java堆栈，就可以定位到业务根因，也就不需要一系列自下而上地代码分析来寻找hook点了。

因此，后续有RenderThread线程异常时，应该把主线程堆栈上报上来，提高RenderThread问题的排查效率。

加入我们
====

我们是字节跳动西瓜视频客户端团队，专注于西瓜视频 App 的开发和基础技术建设，在客户端架构、性能、稳定性、编译构建、研发工具等方向都有投入。如果你也想一起攻克技术难题，迎接更大的技术挑战，欢迎点击阅读原文，或者投递简历到[xiaolin.gan@bytedance.com](https://link.juejin.cn?target=mailto%3Axiaolin.gan%40bytedance.com "mailto:xiaolin.gan@bytedance.com")。

最 Nice 的工作氛围和成长机会，福利与机遇多多，在上海和杭州均有职位，欢迎加入西瓜视频客户端团队 ！

> 文章推荐
> 
> [客户端架构设计的过程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FUag99drsJJnQXT6slTFrIg "https://mp.weixin.qq.com/s/Uag99drsJJnQXT6slTFrIg")
> 
> [Android D8编译器“bug”导致Crash的问题排查](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F483_hesZalaGRPebzz5tPA "https://mp.weixin.qq.com/s/483_hesZalaGRPebzz5tPA")
> 
> [Baseline Profile 安装时优化在西瓜视频的实践](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FWoTmR4kTgKEvl4adyOpHtw "https://mp.weixin.qq.com/s/WoTmR4kTgKEvl4adyOpHtw") 文章推荐 [客户端架构设计的过程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FUag99drsJJnQXT6slTFrIg "https://mp.weixin.qq.com/s/Uag99drsJJnQXT6slTFrIg")