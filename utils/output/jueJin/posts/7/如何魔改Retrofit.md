---
author: ""
title: "如何魔改Retrofit"
date: 2022-11-15
description: "本文从一次简单的性能优化开始，挖掘了Retrofit的实现细节，并在此基础上，探索了对Retrofit的更多玩法。"
tags: ["Android","Retrofit中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:140,comments:19,collects:158,views:7628,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")  
> 本文作者： lizongjun

前言
--

Retrofit 是 Square 公司开源的网络框架，在 Android 日常开发中被广泛使用，开发者们对于 Retrofit 的原理、源码都已经有相当深入的分析。

本文也是从一次简单的性能优化开始，挖掘了 Retrofit 的实现细节，并在此基础上，探索了对 Retrofit 的更多玩法。

因此，本文将主要讲述从发现、优化到探索这一完整的过程，以及过程的一些感悟。

Retrofit 的性能问题
--------------

问题源自一次 App 冷启动优化，常规启动优化的思路，一般是分析主线程耗时，然后把这些耗时操作打包丢到IO线程中执行。短期来看这不失是一种见效最快的优化方法，但站在长期优化的角度，也是性价比最低的一种方法。因为就性能优化而言，我们不能仅考虑主线程的执行，更多还要考虑对整体资源分配的优化，尤其在并发场景，还要考虑锁的影响。而 Retrofit 的问题正属于后者。

我们在排查启动速度时发现，首页接口请求的耗时总是高于接口平均值，导致首屏数据加载很慢。针对这个问题，我们使用 systrace 进行了具体的分析，其中一次结果如下图，

![image](/images/jueJin/1e63d4338e487a9.png)

可以看到，这一次请求中有大段耗时是在等锁，并没有真正执行网络请求；如果观察同一时间段的其他请求，也能发现类似现象。

那么这里的请求是在等什么锁？配合 systrace 可以在 Retrofit 源码（下文相关源码都是基于 Retrofit 2.7.x 版本，不同版本逻辑可能略有出入）中定位到，是如下的一把锁，

```less
// retrofit2/Retrofit.java
    public <T> T create(final Class<T> service) {
    validateServiceInterface(service);
    return (T) Proxy.newProxyInstance(service.getClassLoader(), new Class<?>[] { service },
        new InvocationHandler() {
        @Override public @Nullable Object invoke(Object proxy, Method method,
            @Nullable Object[] args) throws Throwable {
            ...
            return loadServiceMethod(method).invoke(args != null ? args : emptyArgs);
        }
        });
    }
    
        ServiceMethod<?> loadServiceMethod(Method method) {
        ServiceMethod<?> result = serviceMethodCache.get(method);
        if (result != null) return result;
        
        synchronized (serviceMethodCache) { // 等待的锁
        result = serviceMethodCache.get(method);
            if (result == null) {
            result = ServiceMethod.parseAnnotations(this, method);
            serviceMethodCache.put(method, result);
        }
    }
    return result;
}
```

Retrofit 相关的实现原理这里就不再赘述，简而言之 `loadServiceMethod` 这个方法的作用是：通过请求 interface 的入参、返回值、注解等信息，生成 Converter、CallAdapter，并包装成一个 `ServiceMethod` 返回，之后会通过这个 `ServiceMethod` 来发起真正的网络请求。

从上述源码也可以看到，`ServiceMethod` 是有内存缓存的，但问题也正在这里—— `ServiceMethod` 的生成是在锁内完成的。

因此问题就变成，生成 `ServiceMethod` 为什么会有耗时？以云音乐的项目为例，各个团队都是使用 moshi 进行 json 解析，大部分 meta 类是通过 kotlin 实现，但也存在一定 kotlin、 Java 混用的情况。

这部分耗时主要来自 moshi 生成 `JsonAdapter`。生成 `JsonAdapter` 需要递归遍历 meta 类中的所有 field，过程中除了 kotlin 反射本身的效率和受并发的影响，还涉及 kotlin 的 builtins 机制，以及冷启动过程中，类加载的耗时。

上述提到的几个耗时点，每一个都可以单开一篇文章讨论，篇幅原因这里一言以蔽之——冷启动过程中，moshi 生成 `JsonAdapter` 是一个非常耗时的过程（而且这个耗时，跟使用 moshi 解析框架本身也没有必然联系，使用其他 json 解析框架，或多或少也会遇到类似问题）。

锁+不可避免的耗时，引发的必然结果是：在冷启动过程中，通过 Retrofit 发起的网络请求，会部分劣化成一个串行过程。因此出现 systrace 中呈现的结果，请求大部分时间在等锁，这里等待的是前一个请求生成 `ServiceMethod` 的耗时，并以此类推耗时不断向后传递。

尝试优化
----

既然定位到了原因，我们可以尝试优化了。

首先可以从 `JsonAdapter` 的生成效率入手，比如 moshi 原生就支持 `@JsonClass` 注解，通过 apt 在编译时生成 meta的 解析器，从而显著减少反射耗时。

二来，还是尝试从根本上解决问题。其实从发现这个问题开始，我们就一直在思考这种写法的合理性：首先加锁肯定是为了访问 `serviceMethodCache` 时的线程安全；其次，生成 `ServiceMethod` 的过程时，确实有一些反射操作内部是有缓存的，如果发生并发是有一定性能损耗的。

但就我们的实际项目而言，不同 Retrofit interface 之间，几乎没有重叠的部分，反射操作都是以 Class 为单位在进行。以此为基础，我们可以尝试优化一下这里的写法。

那么，在不修改 Retrofit 源码的基础上，有什么方法可以修改请求流程吗？

在云音乐的项目中，对于创建 Retrofit 动态代理，是有统一封装的。也就是说，项目中除个别特殊写法，绝大多数请求的创建，都是通过同一段封装。只要我们改写了 Retrofit 创建动态代理的流程，是不是就可以优化掉前面的问题？

先观察一下 `Retrofit.create` 方法的内部实现，可以发现大部分方法的可见性都是包可见的。众所周知，在 Java 的世界里，包可见就等于 public，所以我们可以自己实现 `Retrofit.create` 方法，写法大概如下，

```sql
    private ServiceMethod<?> loadServiceMethod(Method method) {
    // 反射取到Retrofit内部的缓存
    Map<Method, ServiceMethod<?>> serviceMethodCache = null;
        try {
        serviceMethodCache = cacheField != null ? (Map<Method, ServiceMethod<?>>) cacheField.get(retrofit) : null;
            } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
            if (serviceMethodCache == null) {
            return retrofit.loadServiceMethod(method);
        }
        ServiceMethod<?> result = serviceMethodCache.get(method);
        if (result != null) return result;
        
            synchronized (serviceMethodCache) {
            result = serviceMethodCache.get(method);
            if (result != null) return result;
        }
        synchronized (service) { // 这里替换成类锁
        result = ServiceMethod.parseAnnotations(retrofit, method);
    }
        synchronized (serviceMethodCache) {
        serviceMethodCache.put(method, result);
    }
    return result;
}
```

可以看到，除了需要反射获取 `serviceMethodCache` 这个私有成员 ，其他方法都可以直接访问。这里把耗时的 `ServiceMethod.parseAnnotations` 方法从锁中移出，改为对 interface Class 加锁。（当然这里激进一点，也可以完全不加锁，需要根据实际项目的情况来定）

修改之后，在启动过程中重新抓取 systrace，已经看不到之前等锁的耗时了，首页请求速度也回落到正常区间内。

或许从这也能看出 kotlin 为什么要约束包可见性和泛型的上下边界—— Java 原有的约束太弱，虽然方便了 hook，但同样也说明代码边界更容易被破坏；同时这里也说明了代码规范的重要性，只要保证统一的编码规范，即使不使用什么“黑科技”，也能对代码运行效率实现有效的管控。

不是AOP的AOP
---------

到这里，我们会突然发现一个问题：既然我们都自己来实现 Retrofit 的动态代理了，那不是意味着我们可以获取到每一次请求的结果，乃至控制每一次请求的流程？

我们知道，传统的接口缓存，一般是基于网络库实现的，比如在 okhttp 中的 `CacheInterceptor`。

这种网络库层级缓存的缺点是：网络请求毕竟是一个IO过程，它很难是面向对象的；并且 Response 的 body 也不能被多次 read，在 cache 过程中，一般需要把数据深拷贝一次，有一定性能损耗。

比如，`CacheInterceptor` 中就有如下缓存相关的逻辑，在 body 被 read 的同时，再 copy一份到 cache 中。

```kotlin
    val cacheWritingSource = object : Source {
    var cacheRequestClosed: Boolean = false
    
    @Throws(IOException::class)
        override fun read(sink: Buffer, byteCount: Long): Long {
        val bytesRead: Long
            try {
            bytesRead = source.read(sink, byteCount)
                } catch (e: IOException) {
                    if (!cacheRequestClosed) {
                    cacheRequestClosed = true
                    cacheRequest.abort() // Failed to write a complete cache response.
                }
                throw e
            }
            
                if (bytesRead == -1L) {
                    if (!cacheRequestClosed) {
                    cacheRequestClosed = true
                    cacheBody.close() // The cache response is complete!
                }
                return -1
            }
            
            sink.copyTo(cacheBody.buffer, sink.size - bytesRead, bytesRead)
            cacheBody.emitCompleteSegments()
            return bytesRead
        }
        ...
    }
```

但如果我们能整个控制 Retrofit 请求，在动态代理这一层取到的是真正请求结果的 meta 对象，如果把这个对象缓存起来，连 json 解析的过程都可以省去；而且拿到真实的返回对象后，基于对象对数据做一些 hook 操作，也更加容易。

当然，直接缓存对象也有风险风险，比如如果 meta 本身不是 immutable 的，会破坏请求的幂等性，这也是需要在后续的封装中注意的，避免能力被滥用。

那么我们能在动态代理层拿到 Retrofit 的请求结果吗？答案是肯定的。

我们知道 `ServiceMethod.invoke` 这个方法返回的结果，取决于 `CallAdapter` 的实现。Retrofit 有两种原生的 `CallAdpater`，一种是基于 okhttp 原生的 RealCall，一种是基于 kotlin 的 suspend 方法。

也就是说我们在通过 Retrofit 发起网络请求时，一般只有如下两种写法（各个写法其实都还有几个不同的小变种，这里就不展开了）。

```less
    interface Api {
    @FormUrlEncoded
    @POST("somePath")
    suspend fun get1(@Field("field") field: String): Result
    
    @FormUrlEncoded
    @POST("somePath")
    fun get2(@Field("field") field: String): Call<Result>
}
```

这里 intreface 定义的返回值，其实就是动态代理那里的返回值，

![image](/images/jueJin/d6207908719e33a.png)

对于返回值为 Call 的写法 ，hook 逻辑类似下面的写法，只要对回调使用装饰器包装一下，就能拿到返回结果或者异常。

```kotlin
    class WrapperCallback<T>(private val cb : Callback<T>) : Callback<T> {
        override fun onResponse(call: Call<T>, response: Response<T>) {
        val result = response.body() // 这里response.body()就是返回的meta
        cb.onResponse(call, response)
    }
}
```

但对于 suspend 方法呢？调试一下会发现，当请求定义为 suspend 方法时，返回值如下，

![image](/images/jueJin/2de6d284a945cc2.png)

这里的 `COROUTINE_SUSPENDED` 是什么？

获取 suspend 方法的返回值
-----------------

要解释 `COROUTINE_SUSPENDED` 是什么，稍微涉及协程的实现原理。我们可以先看看 Retrofit 本身在生成动态代理时，是怎么适配 suspend 方法的。

Retrofit 中对于 suspend 方法的返回，是通过 `SuspendForBody` 和 `SuspendForResponse` 这两个 `ServiceMethod` 来封装的。两者逻辑类似，我们以 `SuspendForBody` 为例，

```scala
    static final class SuspendForBody<ResponseT> extends HttpServiceMethod<ResponseT, Object> {
    ...
        @Override protected Object adapt(Call<ResponseT> call, Object[] args) {
        call = callAdapter.adapt(call);
        
        //noinspection unchecked Checked by reflection inside RequestFactory.
        Continuation<ResponseT> continuation = (Continuation<ResponseT>) args[args.length - 1];
        ...
            try {
            return isNullable
            ? KotlinExtensions.awaitNullable(call, continuation)
            : KotlinExtensions.await(call, continuation);
                } catch (Exception e) {
                return KotlinExtensions.suspendAndThrow(e, continuation);
            }
        }
    }
```

首先，代码中的 `Continuation` 是什么？ `Continuation` 可理解为挂起方法的回调。我们知道，suspend 方法在编译时，会被编译成一个普通的 Java 方法，除了返回值被改写成 Object，它与普通 Java 方法的另一个区别是，编译器会在方法末尾插入一个入参，这个入参的类型就是 `Continuation`。

![image](/images/jueJin/fdac4559a737736.png)

可以看到，一个 suspend 方法，在编译之后，多了一个入参。

kotlin 协程正是借助 `Continuation` 来向下传递协程上下文，再向上返回结果的；所以 suspend 方法真正的返回结果，一般不是通过方法本身的返回值来返回的。

此时，我们只要根据协程状态，任意返回一个占位的返回值即可，比如在 `suspendCancellableCoroutine` 闭包中，

```kotlin
// CancellableContinuationImpl.kt
@PublishedApi
    internal fun getResult(): Any? {
    setupCancellation()
    if (trySuspend()) return COROUTINE_SUSPENDED
    // otherwise, onCompletionInternal was already invoked & invoked tryResume, and the result is in the state
    val state = this.state
    if (state is CompletedExceptionally) throw recoverStackTrace(state.cause, this)
    
    ...
    
    return getSuccessfulResult(state)
}
```

这也就是前文 `COROUTINE_SUSPENDED` 这个返回结果的来源。

回到前面 Retrofit 桥接 suspend 的代码，如果我们写一段类似下面的测试代码，会发现这里的 context 与入参 continuation.getContext 返回的是同一个对象。

```ini
    val ret = runBlocking {
    val context = coroutineContext // 上一级协程的上下文
    val ret = api.getUserDetail(uid)
    ret
}
```

而 Retrofit 中的 `KotlinExtensions.await` 方法的实现如下，

```kotlin
    suspend fun <T : Any> Call<T>.await(): T {
    return suspendCancellableCoroutine { continuation ->
        continuation.invokeOnCancellation {
        cancel()
    }
        enqueue(object : Callback<T> {
            override fun onResponse(call: Call<T>, response: Response<T>) {
                if (response.isSuccessful) {
                val body = response.body()
                    if (body == null) {
                    ...
                    continuation.resumeWithException(e)
                        } else {
                        continuation.resume(body)
                    }
                        } else {
                        continuation.resumeWithException(HttpException(response))
                    }
                }
                
                    override fun onFailure(call: Call<T>, t: Throwable) {
                    continuation.resumeWithException(t)
                }
                })
            }
        }
```

结合前面对 `Continuation` 的了解，把这段代码翻译成 Java 伪代码，大概是这样的，

```kotlin
    public Object await(Call<T> call, Object[] args, Continuation<T> continuation) {
        call.enqueue(object : Callback<T> {
            override fun onResponse(call: Call<T>, response: Response<T>) {
            continuation.resumeWith(Result.success(response.body));
        }
        
            override fun onFailure(call: Call<T>, t: Throwable) {
            continuation.resumeWith(Result.failure(t));
        }
        })
        return COROUTINE_SUSPENDED;
    }
```

可以看到，suspend 方法是一种更优雅实现回调的语法糖，无论是在它的设计目的上，还是实现原理上，都是这样。

所以，根据这个原理，我们也可以按类似如下方式 hook suspend 方法，从而获得返回值。

```less
@Nullable
    public T hookSuspend(Method method, Object[] args) {
    Continuation<T> realContinuation = (Continuation<T>) args[args.length - 1];
        Continuation<T> hookedContinuation = new Continuation<T>() {
        @NonNull
        @Override
            public CoroutineContext getContext() {
            return realContinuation.getContext();
        }
        
        @Overrid
            public void resumeWith(@NonNull Object o) {
            realContinuation.resumeWith(o); // 这里的object就是返回结果
        }
        };
        args[args.length - 1] = hookedContinuation;
        return method.invoke(args);
    }
```

缓存请求结果
------

到这里已经距离成功很近了，既然我们能拿到每一种请求类型的返回结果，再加亿点点细节，就意味着我们可以实现基于 Retrofit 的预加载、缓存封装了。

Cache 封装大差不差，主要是处理以下这条逻辑链路：

Request -> Cache Key -> Store -> Cached Response

因为我们只做内存缓存，所以也不需要考虑数据的持久化，直接使用Map来管理缓存即可。

*   先封装入参，我们在动态代理层以此入参为标志，触发预加载或缓存机制，

```kotlin
sealed class LoadInfo(
val id: String = "", // 请求id，默认不需要设置
val timeout: Long // 超时时间
)

// 用来写缓存/预加载
class CacheWriter(
id: String = "",
timeout: Long = 10000
) : LoadInfo(id, timeout)

// 用来读缓存
class CacheReader(
id: String = "",
timeout: Long = 10000,
val asCache: Boolean = false // 未命中时，是否要产生一个新的缓存，可供下一次请求使用
) : LoadInfo(id, timeout)
```

*   插入 hook 代码，处理缓存读写逻辑，(这里还需要处理并发，基于协程比较简单，这里就不展开了)

```kotlin
    fun <T> ServiceMethod<T>.hookInvoke(args: Array<Any?>): T? {
    val loadInfo = args.find { it is LoadInfo } as? LoadInfo
    // 这里我们可以用方法签名做缓存key，方法签名肯定是唯一的
    val id = method.toString()
        if (loadInfo is CacheReader) {
        // 尝试找缓存
    val cache = map[id]
        if (isSameRequest(cache?.args, args)) {
        // 找到缓存，并且请求参数一致，则直接返回
        return cache?.result as? T
    }
}

// 正常发起请求
val result = invoke(args)

    if (loadInfo is CacheWriter) {
    // 存缓存
    map[id] = Cache(id, result)
}
return result
}
```

这里使用 map 缓存请求结果，丰富一下缓存超时逻辑和前文提到的并发处理，即可投入使用。

*   定义请求，

我们可以利用 Retrofit 中的 `@Tag` 注解来传入 `LoadInfo` 参数，这样不会影响真正的网络请求。

```less
    interface TestApi {
    @FormUrlEncoded
    @POST("moyi/user/center/detail")
    suspend fun getUserDetail(
    @Field("userId") userId: String,
    @Tag loadInfo: LoadInfo // 缓存配置
    ): UserDetail
}
```

*   have a try，

```kotlin
    suspend fun preload(preload: Boolean) {
        launch {
        // 预加载
        api.getUserDetail("123", CacheWriter(timeout = 5000))
    }
    delay(3000)
    // 读预加载的结果
    api.getUserDetail("123", CacheReader()) // 读到上一次的缓存
}
```

执行代码可以看到，两次 api 调用，只会发起一次真正的网络请求，并且两次返回结果是同一个对象，跟我们的预期一致。

相比传统网络缓存，这种写法的好处，除了前面提到的减少 IO 开销之外，几乎可以做到零侵入，相比常规网络请求写法，只是多了一个入参；而且写法非常简洁，常规写法可能用到的预加载、超时、并发等大量的胶水代码，都被隐藏在 Retrofit 动态代理内部，上层业务代码并不需要感知。当然 AOP 带来的便利性，与动态代理写法的优势也是相辅相成。

One more thing?
---------------

云音乐内部一直在推动 Backend-for-Frontend (BFF) 的建设，BFF 与 Android 时下新兴的 MVI 框架非常契合，借助 BFF 可以让 Model 层变的非常简洁。

但 BFF 本身对于服务端是一个比较重的方案，特别对于大型项目，需要考虑 RPC 数据敏感性、接口性能、容灾降级等一系列工程化问题，并且 BFF 在大型项目里一般也只用在一些非 P0 场景上。特别对于团队规模比较小的业务来说，考虑到这些成本后，BFF 本身带来的便利几乎全被抵消了。

那么有什么办法可以不借助其他端实现一个轻量级的 BFF 吗？相信你已经猜到了，我们已经 AOP 了 Retrofit，实现网络缓存可以看作是小试牛刀，那么实现 BFF 也不过是更进一步。

与前文借助动态代理层实现网络缓存的思路类似，我们也选择把 BFF 层隐藏在动态代理层中。

可以先梳理一下大概的思路：

1.  使用注解定位需要 BFF 的 Retrofit 请求；
2.  使用 apt 生成 BFF 需要的胶水代码，将多个普通 Retrofit 请求，合并成一个 BFF 请求；
3.  通过 AGP Transform 收集所有 BFF 生成类，建立映射表；
4.  在 Retrofit 动态代理层，借助映射表，把请求实现替换成生成好的 BFF 代码。

实际上，目前主流的各种零入侵代码框架（比如路由、埋点、数据库、启动框架、依赖注入等），都是用类似的思路实现的，我们触类旁通即可。

这里为对此思路还不太熟悉的小伙伴，简单过一遍整体设计流程，

首先，定义需要的注解，用 `@BFF` 来标识需要进行 BFF 操作的 meta 类或接口，

```less
@Retention(RetentionPolicy.CLASS)
@Target({ElementType.FIELD, ElementType.METHOD})
    public @interface BFF {
    String source() default ""; // 数据源信息，默认不需要
    boolean primary() default false; // 是否为必要数据
}
```

用 `@BFFSource` 注解来标识数据预处理的逻辑（在大部分简单场景下，是不需要使用此注解的，因此把这部分拆分成一个单独的注解，以降低学习成本），

```less
@Retention(RetentionPolicy.CLASS)
@Target({ElementType.FIELD})
    public @interface BFFSource {
    Class clazz() default String.class; // 目前数据
    String name() default ""; // 别名
    String logic() default ""; // 预处理逻辑
}

```

定义数据源，数据源的写法跟普通 Retrofit 请求一样，只是方法上额外加一个 `@BFF` 注解作为 apt 的标识，

```less
@JvmSuppressWildcards
    interface TestApi {
    @BFF
    @FormUrlEncoded
    @POST("path/one")
    suspend fun getPartOne(@Field("position") position: Int): PartOne
    
    @BFF
    @FormUrlEncoded
    @POST("path/two")
    suspend fun getPartTwo(@Field("id") id: Int): PartTwo
}
```

定义目标数据结构，这里依然通过 `@BFF` 注解，与前面的请求做关联，

```less
data class MyMeta(
@BFF(primary = true) val one: PartOne,
@BFF val two: PartTwo?
    ) {
    @BFFSource(clazz = PartOne::class, logic = "total > 0")
    var valid: Boolean = false
}
```

定义BFF请求，

```less
@JvmSuppressWildcards
    interface BFFApi {
    @BFF
    @POST("path/all") // 在这个方案中，BFF api的path没有实际意义
    suspend fun getAll(
    @Field("position") position: Int,
    @Field("id") id: Int
    ): MyMeta
}
```

通过上述注解，在编译时生成胶水代码如下，（这里生成代码的逻辑其实跟依赖注入是完全一致的，囿于篇幅就不详细讨论了）

```kotlin
public class GetAllBFF(
private val creator: RetrofitCreate,
scope: CoroutineScope
    ) : BFFSource(scope) {
        private val testApi: TestApi by lazy {
        creator.create(UserApi::class.java)
    }
    
    public suspend fun getAll(
    position: Int,
    id: Int
        ): MyMeta {
    val getPartOneDeferred = loadAsync { testApi.getPartOne(position) }
val getPartTwoDeferred = loadAsync { testApi.getPartTwo(id) }
val getPartOneResult = getPartOneDeferred.await()
val getPartTwoResult = getPartTwoDeferred.await()

val result = MyMeta(getPartOneResult!!,
getPartTwoResult)
result.valid = getPartOneResult!!.total > 0
return result
}
}
```

在使用时，直接把 BFF api 当作一个普通的接口调用即可，Retrofit 内部会完成替换。

```kotlin
    private val bffApi by lazy {
    creator.create(BFFApi::class.java)
}

public suspend fun getAllMeta(
position: Int,
id: Int
    ): MyMeta {
    return bffApi.getAll(position, id) // 直接返回BFF合成好的结果
}
```

可以看到，与前文设计接口缓存封装类似，可以做到零侵入、零胶水代码，使用起来非常简洁、直接。

总结
--

至此，我们回顾了对于 Retrofit 的性能问题，从发现问题到解决问题的过程，并简单讲解了我们是怎么进一步开发 Retrofit 的潜力，以及常用的低侵入框架的设计思路。文章涉及的基于 Retrofit 的缓存、BFF 设计，更多是抛砖引玉，而且不仅仅是 Retrofit，大家掌握类似的设计思路之后，可以把它们应用在更多场景中，对于日常的开发、编码效率提升和性能优化，都会很有帮助，希望对各位能有所启发。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！