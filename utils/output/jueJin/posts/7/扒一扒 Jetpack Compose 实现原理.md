---
author: ""
title: "扒一扒 Jetpack Compose 实现原理"
date: 2022-11-18
description: "Google 于2021年7月底正式发布 Jetpack Compose 的 10 正式版本，这是 Android 的现代化开发工具包，可以帮助开发者更高效的开发应用"
tags: ["Android Jetpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:119,comments:4,collects:180,views:7419,"
---
> 图片来自：[developer.android.google.cn/jetpack/com…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose "https://developer.android.google.cn/jetpack/compose")

> 本文作者：goolong

> Compose 是 Google 推出的现代化 UI 开发工具包，基于声明式 UI 开发风格，加上 @Composable 函数帮助开发者有效的实现关注点分离，另外 Compose 内部最大程度优化了重组范围，可以帮助我们高效的刷新UI，考虑到 Compose 整体架构设计过于复杂，这篇文章主要带大家了解 Compose Runtime 层核心的实现逻辑。

![](/images/jueJin/082411995c6b914.png)

#### 声明式UI

> 声明式 UI 对于 Android 开发同学可能有点陌生，不过熟悉 React 和 Flutter 的同学应该比较清楚，不管是 React、Flutter、Compose，核心都是 MVI 架构方式，通过数据驱动 UI，底层需要维护相应的 UI Tree，比如 React 的 VirtualDOM，Flutter 的 Element，而 Compose 的核心是 Composition。

所谓 "数据驱动UI"，就是当 state 变化时，重建这颗树型结构并基于这棵 NodeTree 刷新 UI。 当然，出于性能考虑，当 NodeTree 需要重建时，各框架会使用 VirtualDom 、GapBuffer（或称SlotTable） 等不同技术对其进行 "差量" 更新，避免 "全量" 重建。`compose.runtime` 的重要工作之一就是负责 NodeTree 的创建与更新。

![](/images/jueJin/856b9baf6cf7b79.png)

##### @Composable

`@Copmposable` 并不是一个注解处理器，Compose 在 Kotlin 编译器的类型检测和代码生成阶段依赖 Kotlin 编译器插件工作，工作原理有点类似于 Kotlin Coroutine 协程的 suspend 函数，suspend 函数在 Kotlin 插件编译时生成带有 `$continuation` 参数（挂起点），而 Compose 函数生成带有参数 `$composer`，因此 Compose 也被网友戏称为 **“KotlinUI”**。

类似于在 suspend 函数中可以调用普通函数和 suspend 函数，而普通函数中不能调用 suspend 函数，Compose 函数也遵循这一规则，正是因为普通函数中不带有 Kotlin 编译器生成的 $composer 参数。

```kotlin
    fun Example(a: () -> Unit, b: @Composable () -> Unit) {
    a() // 允许
    b() // 不允许
}

@Composable
    fun Example(a: () -> Unit, b: @Composable () -> Unit) {
    a() // 允许
    b() // 允许
}
```

##### 生命周期

所有的 Compose 函数都是一个可组合项，当 Jetpack Compose 首次运行可组合项时，在初始组合期间，它将跟踪您为了描述组合中的界面而调用的可组合项。当应用的状态发生变化时，Jetpack Compose 会安排重组，重组是指 Jetpack Compose 重新执行可能因状态更改而更改的可组合项，然后更新组合以反映所有更改。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

参考 Google Jetpack 文档的例子：

```kotlin
@Composable
    fun LoginScreen(showError: Boolean) {
        if (showError) {
        LoginError()
    }
    LoginInput() // This call site affects where LoginInput is placed in Composition
}

@Composable
fun LoginInput() { /* ... */ }
```

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

#### Compose NodeTree

前面介绍了 Compose 一些基础知识，Android 同学都知道 View 体系中构建了一颗 View 树，而在 Compose 中也是这样，不过在Compose 中有两颗树（类似于 React ），一颗虚拟树 `SlotTable` (负责树构建和重组，类似 React 中的 VirtualDom )，一颗真实的树 `LayoutNode` (负责测量和绘制)。

首先我们来看下 Compose UI 中如何构建 Layout 布局代码，直接看 setContent 方法。

```kotlin
internal fun ViewGroup.setContent(
parent: CompositionContext,
content: @Composable () -> Unit
    ): Composition {
    GlobalSnapshotManager.ensureStarted() // 开启snapshot监听（非常重要，后面会讲到）
    val composeView =
        if (childCount > 0) {
        getChildAt(0) as? AndroidComposeView
            } else {
            removeAllViews(); null
                } ?: AndroidComposeView(context).also {
                // 创建AndroidComposeView，并添加到ViewGroup()
                addView(it.view, DefaultLayoutParams)
            }
            return doSetContent(composeView, parent, content)
        }
        
        @OptIn(InternalComposeApi::class)
        private fun doSetContent(
        owner: AndroidComposeView,
        parent: CompositionContext,
        content: @Composable () -> Unit
            ): Composition {
            ...
            val original = Composition(UiApplier(owner.root), parent) // 构建Composition
            val wrapped = owner.view.getTag(R.id.wrapped_composition_tag)
            as? WrappedComposition
                ?: WrappedComposition(owner, original).also {
                owner.view.setTag(R.id.wrapped_composition_tag, it)
                } // 包装成WrappedComposition
                wrapped.setContent(content)
                return wrapped
            }
```

`content` 函数 (例如 Text | Button ) 最终调用了 Layout 函数，核心逻辑就是通过 `ReusableComposeNode` 创建 Node 节点。

```kotlin
@Composable
inline fun Layout(
content: @Composable () -> Unit,
modifier: Modifier = Modifier,
measurePolicy: MeasurePolicy
    ) {
    val density = LocalDensity.current
    val layoutDirection = LocalLayoutDirection.current
    ReusableComposeNode<ComposeUiNode, Applier<Any>>(
    factory = ComposeUiNode.Constructor, // factory创建Node节点
    update = { // update更新Node节点内容
    set(measurePolicy, ComposeUiNode.SetMeasurePolicy)
    set(density, ComposeUiNode.SetDensity)
    set(layoutDirection, ComposeUiNode.SetLayoutDirection)
    },
    skippableUpdate = materializerOf(modifier),
    content = content
    )
}
```

从上面我们可以看出来，Compose UI 如何基于 Compose Runtime 构建的具有树管理的 View 系统（内部 LayoutNode 测量和绘制逻辑先忽略掉），**下面我们来基于 Compose Runtime 构建一个简单的树管理系统，比如实现下面这个简单的 `Content` 函数**。

```kotlin
@Composable
    fun Content() {
var state by remember { mutableStateOf(true) }
    LaunchedEffect(Unit) {
    delay(3000)
    state = false
}
    if (state) {
    Node1()
}
Node2()
}
```

1.  **我们先定义 Node 节点**（其中 Node1 和 Node2 都继承于 Node，Node 内部通过 children 保存子节点信息）

```kotlin
    sealed class Node {
    val children = mutableListOf<Node>()
    
        class RootNode : Node() {
            override fun toString(): String {
            return rootNodeToString()
        }
    }
    
    data class Node1(
    var name: String = "",
    ) : Node()
    
    data class Node2(
    var name: String = "",
    ) : Node()
}
```

2.  **其次我们需要自定义 NodeApplier 用来操作 Node 节点**

```kotlin
    class NodeApplier(node: Node) : AbstractApplier<Node>(node) {
    ...
        override fun insertTopDown(index: Int, instance: Node) {
        current.children.add(index, instance) // 插入节点
    }
    
        override fun move(from: Int, to: Int, count: Int) {
        current.children.move(from, to, count) // 更新节点
    }
    
        override fun remove(index: Int, count: Int) {
        current.children.remove(index, count) // 移除节点
    }
}
```

3.  **然后我们需要定义 Compose 函数，**（内部逻辑是通过 `ReusableComposeNode` 创建 Node 节点）

```kotlin
@Composable
    private fun Node1(name: String = "node1") {
    ReusableComposeNode<Node.Node1, NodeApplier>(
        factory = {
        Node.Node1()
        },
            update = {
        set(name) { this.name = it }
    }
    )
}

@Composable
    private fun Node2(name: String = "node2") {
    ReusableComposeNode<Node.Node2, NodeApplier>(
        factory = {
        Node.Node2()
        },
            update = {
        set(name) { this.name = it }
    }
    )
}
```

4.  **最后我们来运行 Content 函数**，这样我们就利用 Compose Runtime 构建了一个简单的树管理系统

```kotlin
    fun main() {
    val composer = Recomposer(Dispatchers.Main)
    
    GlobalSnapshotManager.ensureStarted() // 监听
    val mainScope = MainScope()
        mainScope.launch(DefaultChoreographerFrameClock) {
        composer.runRecomposeAndApplyChanges() // Choreographer Frame回调时开始重组
    }
    
    val rootNode = Node.RootNode()
        Composition(NodeApplier(rootNode), composer).apply {
            setContent {
            Content()
        }
    }
}
```

**看到这里我们大概明白了 Compose 构建流程，但是我们心中可能还有一些疑问：**

*   Compose 函数内部调用流程是什么样的
*   Compose 怎么构建生成 NodeTree，Node 节点信息怎么储存的
*   Compose 什么时候发生重组，重组过程中做了什么事情
*   Compose 如何监听 State 变化并实现高效 diff 更新的
*   Snapshot 的作用是什么

下面让我们带着上面这些疑问，看看 Kotlin Compiler Plugin 编译后生成的代码

```kotlin
@Composable
    public static final void Content(@Nullable Composer $composer, final int $changed) {
    // ↓↓↓↓RestartGroup↓↓↓↓
    $composer = $composer.startRestartGroup(-337788314);
    ComposerKt.sourceInformation($composer, "C(Content)");
        if ($changed == 0 && $composer.getSkipping()) {
        $composer.skipToGroupEnd();
            } else {
            // LaunchedEffect and MutableState related code
            $composer.startReplaceableGroup(-337788167);
                if (Content$lambda-2(state$delegate)) {
                Node1((String)null, $composer, 0, 1);
            }
            
            $composer.endReplaceableGroup();
            Node2((String)null, $composer, 0, 1);
        }
        
        ScopeUpdateScope var18 = $composer.endRestartGroup();
        // ↑↑↑↑RestartGroup↑↑↑↑
        // ↓↓↓↓Register the function to be called again↓↓↓↓
            if (var18 != null) {
                var18.updateScope((Function2)(new Function2() {
                    public final void invoke(@Nullable Composer $composer, int $force) {
                    MainKt.Content($composer, $changed | 1);
                }
                }));
            }
            // ↑↑↑↑Register the function to be called again↑↑↑↑
        }
        
        @Composable
            private static final void Node1(final String name, Composer $composer, final int $changed, final int var3) {
            $composer = $composer.startRestartGroup(1815931657);
            ...
            ScopeUpdateScope var10 = $composer.endRestartGroup();
                if (var10 != null) {
                    var10.updateScope((Function2)(new Function2() {
                        public final void invoke(@Nullable Composer $composer, int $force) {
                        MainKt.Node1(name, $composer, $changed | 1, var3);
                    }
                    }));
                }
            }
```

第一次看到上面的代码可能会有点懵，生成的 compose 函数内部插入了很多 `$composer.startXXXGroup` 和 `$composer.endXXXGroup` 模板代码，通过查看 `Composer` 实现类 `ComposerImpl` ，会发现所有 `startXXXGroup` 代码最终调用下面这个 `start` 方法

```kotlin
/**
* @param key: 编译器生成Group唯一值
* @param objectKey: 辅助key，某些Group中会用到
* @param isNode: 是否有Node节点
* @param data:
*/
    private fun start(key: Int, objectKey: Any?, isNode: Boolean, data: Any?) {
    ...
    // slotTable操作逻辑
}
```

`start` 方法内部核心逻辑是通过 `SlotReader` 和 `SlotWriter` 操作 `SlotTable`，上述 Compose 函数内部生成的 `$composer.startXXXGroup` 和 `$composer.endXXXGroup` 模板代码就是构建 NodeTree，在 `Composer` 中针对不同的场景，可以生成不同类型的 Group。

startXXXGroup

说明

startNode /startResueableNode

插入一个包含 Node 的 Group。例如文章开头 ReusableComposeNode 的例子中，显示调用了 startResueableNode ，而后调用 createNode 在 Slot 中插入 LayoutNode

startRestartGroup

插入一个可重复执行的 Group，它可能会随着重组被再次执行，因此 RestartGroup 是重组的最小单元

startReplacableGroup

插入一个可以被替换的 Group，例如一个 if/else 代码块就是一个 ReplaceableGroup，它可以在重组中被插入后者从 SlotTable 中移除

startMovableGroup

插入一个可以移动的 Group，在重组中可能在兄弟 Group 之间发生位置移动

startReusableGroup

插入一个可复用的 Group，其内部数据可在 LayoutNode 之间复用，例如 LazyList 中同类型的 Item

接下来我们来看看 `SlotTable` 内部结构：

##### SlotTable

SlotTable 内部存储结构核心的就是 `groups` （ group 分组信息，NodeTree 树管理）和 `slots` （ group 所对应的数据），那 SlotTable 是怎么实现树结构和如何管理的呢？

```kotlin
    internal class SlotTable : CompositionData, Iterable<CompositionGroup> {
    /**
* An array to store group information that is stored as groups of [Group_Fields_Size]
* elements of the array. The [groups] array can be thought of as an array of an inline
* struct.
*/
var groups = IntArray(0)
private set

/**
* An array that stores the slots for a group. The slot elements for a group start at the
* offset returned by [dataAnchor] of [groups] and continue to the next group's slots or to
* [slotsSize] for the last group. When in a writer the [dataAnchor] is an anchor instead of
* an index as [slots] might contain a gap.
*/
var slots = Array<Any?>(0) { null }
private set
}
```

![](/images/jueJin/ead615d896e21d7.png)

`groups` 是一个 IntArray，每 5 个 Int 为一组构成一个 Group 的信息

*   `key` : Group 在 SlotTable 中的标识，在 Parent Group 范围内唯一
*   `Group info`: Int 的 Bit 位中存储着一些 Group 信息，例如是否是一个 Node，是否包含 Data 等，这些信息可以通过位掩码来获取。
*   `Parent anchor`: Parent 在 groups 中的位置，即相对于数组指针的偏移（**树结构**）
*   `Size: Group`: 包含的 Slot 的数量
*   `Data anchor`：关联 Slot 在 slots 数组中的起始位置（**位置信息**）

我们可以通过 `SlotTable#asString()` 方法打印对应的树结构信息，通过前面分析，我们知道树结构是在 **Kotlin Compiler Plugin** 编译器生成的，通过 `$composer#startXXXGroup` 和 `$composer#endXXXGroup` 配对生成 Group 树结构。

```kotlin
Group(0) key=100, nodes=2, size=16, slots=[0: {}]
Group(1) key=1000, nodes=2, size=15
Group(2) key=200, nodes=2, size=14 objectKey=OpaqueKey(key=provider)
Group(3) key=-985533309, nodes=2, size=13, slots=[2: androidx.compose.runtime.RecomposeScopeImpl@4fb4ae6, androidx.compose.runtime.internal.ComposableLambdaImpl@3b52827]
Group(4) key=-337788314, nodes=2, size=12 aux=C(Content), slots=[5: androidx.compose.runtime.RecomposeScopeImpl@b882ad4]
Group(5) key=-3687241, nodes=0, size=1 aux=C(remember):Composables.kt#9igjgp, slots=[7: MutableState(value=false)@167707773]
Group(6) key=-3686930, nodes=0, size=1 aux=C(remember)P(1):Composables.kt#9igjgp, slots=[9: MutableState(value=false)@167707773, Function2<kotlinx.coroutines.CoroutineScope, kotlin.coroutines.Continuation<? super kotlin.Unit>, java.lang.Object>]
Group(7) key=1036442245, nodes=0, size=2 aux=C(LaunchedEffect)P(1)336@14101L58:Effects.kt#9igjgp
Group(8) key=-3686930, nodes=0, size=1 aux=C(remember)P(1):Composables.kt#9igjgp, slots=[13: kotlin.Unit, androidx.compose.runtime.LaunchedEffectImpl@8d3f428]
Group(9) key=-337788167, nodes=1, size=4
Group(10) key=1815931657, nodes=1, size=3, slots=[15: androidx.compose.runtime.RecomposeScopeImpl@7421fc3]
Group(11) key=1546164276, nodes=1, size=2 aux=C(ReusableComposeNode):Composables.kt#9igjgp
Group(12) key=125, nodes=0, size=1 node=Node1(name=node1), slots=[18: node1]
Group(13) key=1815931930, nodes=1, size=3, slots=[19: androidx.compose.runtime.RecomposeScopeImpl@81cf51f]
Group(14) key=1546164276, nodes=1, size=2 aux=C(ReusableComposeNode):Composables.kt#9igjgp
Group(15) key=125, nodes=0, size=1 node=Node2(name=node2), slots=[22: node2]
```

##### GapBuffer

GapBuffer（间隙缓冲区）这个概念一般在很多地方有用到，比如文本编辑器，它在内存中使用扁平数组（flat array）实现，这个数组比真正存储数据的集合要大，而且在插入数据的会判断数据大小进行 gap 扩容，通过移动 gap index 可以将 insert（增）、delete（删）、update（改）、get（查）操作的时间复杂度降到 O（n）常数量级。

> SlotTable 中移动 gap 的方法详见 moveGroupGapTo 和 moveSlotGapTo

下面我们来对比下没有 GapBuffer 和 GapBuffer 两种场景下删除一个节点和多个节点的效率，可以看到删除多个节点情况下 GapBuffer的效率要远高于没有 GapBuffer；在没有 GapBuffer 的情况下，在 Array 中只能每次移动一个 Node，insert 和 delete 节点时间效率是 O(nLogN)，但是有 GapBuffer 情况下，可以通过移动 gap 的位置，将时间效率优化到 O(n)。

没有GapBuffer

有GapBuffer

删除一个节点

![](/images/jueJin/15e226f450dc271.png)

![](/images/jueJin/fcbf7bf991ad09e.png)

删除多个节点

![](/images/jueJin/664897db8b06d5c.png)

![](/images/jueJin/91288cfa833d1d3.png)

##### Snapshot

Snapshot 是一个 \*\*MVCC（Multiversion Concurrency Control，多版本并发控制）\*\*的实现，一般 MVCC 用于数据库中实现事务并发，还有分布式版本控制系统（常见的 Git 和 SVN），下面简单看下 Snapshot 使用。

```kotlin
    fun test() {
    // 创建状态（主线开发）
    val state = mutableStateOf(1)
    
    // 创建快照（开分支）
    val snapshot = Snapshot.takeSnapshot()
    
    // 修改状态（主线修改状态）
    state.value = 2
    
    println(state.value) // 打印1
    
    snapshot.enter {//进入快照（切换分支）
    // 读取快照状态（分支状态）
    println(state.value) // 打印1
}
// snapshot.apply() 保存快照（下面print statr打印1）

// 读取状态（主线状态）
println(state.value) // 打印2

// 废弃快照（删除分支）
snapshot.dispose()
}
```

另外Snapshot提供了 `registerGlobalWriteObserver` 和 `registerApplyObserver` 用来监听全局 Snapshot 写入和 apply 回调，实际同时在 MutableSnapshot 构造函数传入的。

```kotlin
open class MutableSnapshot internal constructor(
id: Int,
invalid: SnapshotIdSet,
override val readObserver: ((Any) -> Unit)?,  // 读取监听
override val writeObserver: ((Any) -> Unit)?  // 写入监听
) : Snapshot(id, invalid)
```

如果不直接复用系统封装好的，我们也可以自己创建 Snapshot，并注册通知。

```kotlin
    class ViewModel {
    val state = mutableStateOf("initialized")
}

    fun main() {
    val viewModel = ViewModel()
    Snapshot.registerApplyObserver { changedSet, snapshot ->
        changedSet.forEach {
        println("registerApplyObserver:" + it)
    }
}
viewModel.state.value = "one"
Snapshot.sendApplyNotifications() //
}
```

回到我们之前提到的 `GlobalSnapshotManager.ensureStarted()`，实际上就是通过 Snapshot 状态改变通知 Composition 重组。

```kotlin
    internal object GlobalSnapshotManager {
    private val started = AtomicBoolean(false)
    
        fun ensureStarted() {
            if (started.compareAndSet(false, true)) {
            val channel = Channel<Unit>(Channel.CONFLATED)
                CoroutineScope(AndroidUiDispatcher.Main).launch {
                    channel.consumeEach {
                    Snapshot.sendApplyNotifications() // 发送通知applyChanges
                }
            }
                Snapshot.registerGlobalWriteObserver {
                channel.trySend(Unit) // 监听全局Snapshot写入
            }
        }
    }
}
```

上面大概了解了 `SlotTable` 结构和 NodeTree 构建流程，下面看看这段代码：

```kotlin
@Composable
    fun Content() {
var state by remember { mutableStateOf(true) }
    LaunchedEffect(Unit) {
    delay(3000)
    state = false
}
...
}
```

估计大家应该能看懂这段代码逻辑是创建一个 state，然后在3秒后更新 state 的值，但是大家一定存在几个疑惑

*   `remember` 函数的作用是什么
*   `LaunchedEffect` 函数作用是啥，里面可以调用 `delay` 函数，是不是与协程有关系
*   通过 `mutableStateOf` 创建的 State，为啥可以通知 Compose 进行重组

上面涉及到的 `remember` | `LaunchedEffect` | `State` 与 Compose 重组存在紧密联系，下面让我们一起来看看 Compose 重组是如何实现的

#### Compose重组

> @Composable 函数是纯函数，纯函数是幂等的，唯一输入对应唯一输出，且不应该包含任何副作用（比如修改全局变量或反注册监听等），为了维护 @Composable 纯函数语义，Compose提供了 state、remember、SideEffect、CompositionLocal 这些实现，类似于 React 提供的各种 Hook。

![在这里插入图片描述](/images/jueJin/53f0f4be765f47f.png)

##### Remember

直接来看下 `remember` 函数定义，主要参数是 key 和 calculation，`Composer` 根据 key 变化判断是否重新调用 calculation 计算值

```kotlin
inline fun <T> remember(calculation: @DisallowComposableCalls () -> T): T
inline fun <T> remember(key1: Any?, calculation: @DisallowComposableCalls () -> T): T
inline fun <T> remember(key1: Any?, key2: Any?, calculation: @DisallowComposableCalls () -> T): T
inline fun <T> remember(key1: Any?, key2: Any?, key3: Any?, calculation: @DisallowComposableCalls () -> T): T
inline fun <T> remember(vararg keys: Any?, calculation: @DisallowComposableCalls () -> T): T
```

`remember` 内部调用的 `composer#cache` 方法，key 是否变化调用的 `composer#changed` 方法。

```kotlin
    inline fun <T> Composer.cache(invalid: Boolean, block: () -> T): T {
    @Suppress("UNCHECKED_CAST")
        return rememberedValue().let {
            if (invalid || it === Composer.Empty) {
            val value = block()
            updateRememberedValue(value)
            value
            } else it
            } as T
        }
        
        @ComposeCompilerApi
            override fun changed(value: Any?): Boolean {
                return if (nextSlot() != value) {
                updateValue(value)
                true
                    } else {
                    false
                }
            }
```

`rememberedValue` 直接调用 `nextSlot` 方法，`updateRememberedValue` 直接调用 `updateValue` 方法，核心逻辑就是通过`SlotReader` 和 `SlotWriter` 操作 `SlotTable` 存储数据，而且这些数据是可以跨 Group 的，具体细节可以自己查看源码。

##### State

`State` 接口定义很简单，实际开发过程中都是调用 `mutableStateOf` 创建 `MutableState`。

```kotlin
fun <T> mutableStateOf(
value: T,
policy: SnapshotMutationPolicy<T> = structuralEqualityPolicy() // snapshot比较策略
): MutableState<T> = createSnapshotMutableState(value, policy)

internal actual fun <T> createSnapshotMutableState(
value: T,
// SnapshotMutationPolicy有三个实现StructuralEqualityPolicy（值相等）|ReferentialEqualityPolicy（同一个对象）|NeverEqualPolicy（永不相同）
policy: SnapshotMutationPolicy<T>
): SnapshotMutableState<T> = ParcelableSnapshotMutableState(value, policy)
```

`ParcelableSnapshotMutableState` 继承自 `SnapshotMutableStateImpl`，自身实现 `Parcelable` 内存序列化，所以我们直接分析 `SnapshotMutableStateImpl`。

```kotlin
internal open class SnapshotMutableStateImpl<T>(
value: T,
override val policy: SnapshotMutationPolicy<T>
    ) : StateObject, SnapshotMutableState<T> {
    @Suppress("UNCHECKED_CAST")
    override var value: T
    get() = next.readable(this).value
    set(value) = next.withCurrent { // 内部
        if (!policy.equivalent(it.value, value)) {
    next.overwritable(this, it) { this.value = value }
}
}

private var next: StateStateRecord<T> = StateStateRecord(value) // 继承StateRecord

override val firstStateRecord: StateRecord
get() = next

    override fun prependStateRecord(value: StateRecord) {
    @Suppress("UNCHECKED_CAST")
    next = value as StateStateRecord<T>
}

@Suppress("UNCHECKED_CAST")
override fun mergeRecords(
previous: StateRecord,
current: StateRecord,
applied: StateRecord
    ): StateRecord? {
    ...
    // snapshot分支冲突解决合并逻辑，最终结果与policy相关
}
}
```

可以看到真正的核心类是 `StateObject`，StateObject 内部存储结构是 `StateRecord`，内部使用链表存储，通过 Snapshot 管理 State 值，最终调用 `mergeRecords` 处理冲突逻辑（与 SnapshotMutationPolicy 值相关）。

```kotlin
    abstract class StateRecord {
    
    internal var snapshotId: Int = currentSnapshot().id  // snapshotId，版本管理
    
    internal var next: StateRecord? = null // 内部存储结构是链表
    
    abstract fun assign(value: StateRecord)  // 将value赋值给当前StateRecord
    
    abstract fun create(): StateRecord  // 创建新的StateRecord
}
```

##### SideEffect

副作用是指 Compose 内部除了状态变化之外的应用状态的变化，比如页面声明周期 Lifecycle 或广播等场景，需要在页面不可见或广播注销时改变一些应用状态避免内存泄漏等，类似于 Coroutine 协程中提供的 `suspendCancellableCoroutine` 在 `invokeOnCancel` 中做一些状态修改的工作，Effect 分为以下三类：

**第一类是 `SideEffect`**，实现方式比较简单，调用流程是 `composer#recordSideEffect` -> `composer#record`， 直接往 Composer 中 `changes` 插入 `change`，最终会在 `Composition#applychanges` 回调 `effect` 函数。

```kotlin
@Composable
@NonRestartableComposable
@OptIn(InternalComposeApi::class)
fun SideEffect(
effect: () -> Unit
    ) {
    currentComposer.recordSideEffect(effect)
}
``````kotlin
internal class CompositionImpl(
...
    ) : ControlledComposition {
    ...
        override fun applyChanges() {
            synchronized(lock) {
            val manager = RememberEventDispatcher(abandonSet) // RememberManager实现类
                try {
                applier.onBeginChanges()
                
                // Apply all changes
                slotTable.write { slots ->
                val applier = applier
                // 遍历changes然后invoke注入，可以查看ComposerImpl#recordSideEffect方法
                changes.fastForEach { change ->
                change(applier, slots, manager)
            }
            changes.clear()
        }
        
        applier.onEndChanges()
        
        // Side effects run after lifecycle observers so that any remembered objects
        // that implement RememberObserver receive onRemembered before a side effect
        // that captured it and operates on it can run.
        manager.dispatchRememberObservers() // RememberObserver的onForgotten或onRemembered被调用
        manager.dispatchSideEffects() // SideEffect调用
        
            if (pendingInvalidScopes) {
            pendingInvalidScopes = false
        observations.removeValueIf { scope -> !scope.valid }
    derivedStates.removeValueIf { derivedValue -> derivedValue !in observations }
}
    } finally {
    manager.dispatchAbandons() // RememberObserver的onAbandoned被调用
}
drainPendingModificationsLocked()
}
}
...
}
```

**第二类是 `DisposableEffect`**，DisposableEffectImpl 实现了 RememberObserver 接口，借助于 `remember` 存储在 SlotTable 中，并且 Composition 发生重组时会通过 `RememberObserver#onForgotten` 回调到 `effect` 的 `onDispose` 函数。

```kotlin
@Composable
@NonRestartableComposable
fun DisposableEffect(
key1: Any?,
effect: DisposableEffectScope.() -> DisposableEffectResult
    ) {
remember(key1) { DisposableEffectImpl(effect) }
}
```

**第三类是 `LaunchedEffect`**，与 `DisposableEffect` 的主要区别是内部开启了协程，用来异步计算的。

```kotlin
@Composable
@NonRestartableComposable
@OptIn(InternalComposeApi::class)
fun LaunchedEffect(
key1: Any?,
block: suspend CoroutineScope.() -> Unit
    ) {
    val applyContext = currentComposer.applyCoroutineContext
remember(key1) { LaunchedEffectImpl(applyContext, block) }
}
```

##### CompositionLocal

在 `WrappedComposition#setContent` 我们看到有调用 CompositionLocalProvider，在 `ProvideCommonCompositionLocals` 内部中定义了很多 CompositionLocal，主要功能是在 `content` 函数内部调用其他 Compose 函数时，可以快捷获取一些全局服务。

```kotlin
private class WrappedComposition(
val owner: AndroidComposeView,
val original: Composition
    ) : Composition, LifecycleEventObserver {
    
    private var disposed = false
    private var addedToLifecycle: Lifecycle? = null
    
    @OptIn(InternalComposeApi::class)
        override fun setContent(content: @Composable () -> Unit) {
            owner.setOnViewTreeOwnersAvailable {
                if (!disposed) {
                val lifecycle = it.lifecycleOwner.lifecycle
                lastContent = content
                    if (addedToLifecycle == null) {
                    addedToLifecycle = lifecycle
                    // this will call ON_CREATE synchronously if we already created
                    lifecycle.addObserver(this)
                        } else if (lifecycle.currentState.isAtLeast(Lifecycle.State.CREATED)) {
                            original.setContent {
                            ...
                                CompositionLocalProvider(LocalInspectionTables provides inspectionTable) {
                                ProvideAndroidCompositionLocals(owner, content) // CompositionLocal注入
                            }
                        }
                    }
                }
            }
        }
    }
``````kotlin
@Composable
internal fun ProvideCommonCompositionLocals(
owner: Owner,
uriHandler: UriHandler,
content: @Composable () -> Unit
    ) {
    CompositionLocalProvider(
    LocalAccessibilityManager provides owner.accessibilityManager,
    LocalAutofill provides owner.autofill,
    LocalAutofillTree provides owner.autofillTree,
    LocalClipboardManager provides owner.clipboardManager,
    LocalDensity provides owner.density,
    LocalFocusManager provides owner.focusManager,
    LocalFontLoader provides owner.fontLoader,
    LocalHapticFeedback provides owner.hapticFeedBack,
    LocalLayoutDirection provides owner.layoutDirection,
    LocalTextInputService provides owner.textInputService,
    LocalTextToolbar provides owner.textToolbar,
    LocalUriHandler provides uriHandler,
    LocalViewConfiguration provides owner.viewConfiguration,
    LocalWindowInfo provides owner.windowInfo,
    content = content
    )
}
```

`CompositionLocal` 作用是为了避免组合函数间传递显式参数，这样可以通过隐式参数传递给被调用的组合函数，其内部实现也是利用了 SlotTable 存储数据。

```kotlin
@Stable
    sealed class CompositionLocal<T> constructor(defaultFactory: () -> T) {
    @Suppress("UNCHECKED_CAST")
    internal val defaultValueHolder = LazyValueHolder(defaultFactory)
    
    @Composable
    internal abstract fun provided(value: T): State<T> //
    
    @OptIn(InternalComposeApi::class)
    inline val current: T
    @ReadOnlyComposable
    @Composable
    get() = currentComposer.consume(this)  // 获取当前CompositionLocalScope对应的值
}
```

定义好 CompositionLocal 之后，需要通过 `CompositionLocalProvider` 方法绑定数据，`ProvidedValue` 可以通过 ProvidableCompositionLocal 提供的中缀方法 `provides` 返回。

```kotlin
@Composable
@OptIn(InternalComposeApi::class)
    fun CompositionLocalProvider(vararg values: ProvidedValue<*>, content: @Composable () -> Unit) {
    currentComposer.startProviders(values) // 在SlotTable的groups插入key为providerKey和providerValuesKey的group数据
    content()
    currentComposer.endProviders()
}
```

接着来看下 CompositionLocal 如何获取数据，通过代码看到直接通过 `composer#consume` 返回，而 consume 方法内部最终还是通过 `CompositionLocalMap` （实际是一个 PersistentMap<CompositionLocal<Any?>, State<Any?>> 结构）获取数据，其在 SlotTable 中对应的 groupKey 是 **compositionLocalMapKey**。

```kotlin
@Stable
    sealed class CompositionLocal<T> constructor(defaultFactory: () -> T) {
    ...
    inline val current: T
    @ReadOnlyComposable
    @Composable
    get() = currentComposer.consume(this)
}

    internal class ComposerImpl(...) {
    ...
    override fun <T> consume(key: CompositionLocal<T>): T =
    resolveCompositionLocal(key, currentCompositionLocalScope())
    
    private fun <T> resolveCompositionLocal(
    key: CompositionLocal<T>,
    scope: CompositionLocalMap
        ): T = if (scope.contains(key)) {
        scope.getValueOf(key)
            } else {
            key.defaultValueHolder.value
        }
        ...
    }
```

看到这里我们大概明白了 CompositionLocal 实现逻辑：

*   首先定义 CompositionLocal
*   通过 CompositionLocalProvoder 方法在 compose 函数嵌入插入 `composer#startProviders` 和 `composer#endProviders` ，最终在 SlotTable 存入数据
*   通过 `composer#consume` 获取之前在 SlotTable 中插入的数据
*   在 Compose 函数内部可以重新赋值，不过只在自身和子 Compose 函数内部生效

CompositionLocal 有两种实现，**第一种是 StaticProvidableCompositionLocal**，全局保持不变（比如 LocalDensity 屏幕像素密度不随 Compose 函数层级而改变）。

```kotlin
internal class StaticProvidableCompositionLocal<T>(defaultFactory: () -> T) :
    ProvidableCompositionLocal<T>(defaultFactory) {
    
    @Composable
    override fun provided(value: T): State<T> = StaticValueHolder(value) // 返回一个常量
}
```

**第二种是 DynamicProvidableCompositionLocal**，可以在 Compose 函数内部改变其值，然后通知 Compose 重组并获取到最新的值。

```kotlin
internal class DynamicProvidableCompositionLocal<T> constructor(
private val policy: SnapshotMutationPolicy<T>,
defaultFactory: () -> T
    ) : ProvidableCompositionLocal<T>(defaultFactory) {
    
    @Composable
        override fun provided(value: T): State<T> = remember { mutableStateOf(value, policy) }.apply {
        this.value = value
        } /// 通过remember返回 MutableState
    }
```

#### 总结

到这里我们就基本明白了 Compose 是怎么实现的，最后回到我们之前的问题：

*   **Compose 函数内部调用流程是什么样的**
    *   Kotlin Compiler Plugin 在编译阶段帮助生成 `$composer` 参数的普通函数（有些场景还有带有 `$change` 等辅助参数），内部调用的 Compose 函数传递 `$composer` 参数
*   **Compose 怎么构建生成 NodeTree，Node 节点信息怎么储存的**
    *   Kotlin Compiler Plugin 在 Compose 函数前后插入 `startXXXGroup` 和 `endXXXGroup` 构建树结构，内部通过 SlotTable 实现 Node 节点数据存储和 diff 更新，SlotTable 通过 `groups` 存储分组信息 和 `slots` 存储数据
*   **Compose 如何监听 State 变化并实现高效 diff 更新的**
    *   MutableState 实现了 StateObject，内部借助 Snapshot 实现内部值更新逻辑，然后通过 `remember` 函数存储到 SlotTable 中，当 State 的值发生改变时，Snapshot 会通知到 Composition 进行重组
*   **Compose 什么时候发生重组，重组过程中做了什么事情**
    *   当 State 状态值发生改变时，会借助 Snapshot 通知到 Composition 进行重组，而重组的最小单位是 RestartGroup（Compose 函数编译期插入的 `$composer.startRestartGroup` ），通过 Kotlin Compiler Plugin 编译后的代码我们发现，重组其实就是重新执行对应的 Compose 函数，通过 Group key 改变 SlotTable 内部结构，最终反映到 LayoutNode 重新展示到 UI 上
*   **Snapshot 的作用是什么**
    *   Compose 重组借助了 Snapshot 实现并发执行，并且通过 Snapshot 读写确定下次重组范围

##### 参考资料：

*   [深入详解Jetpack Compose | 优化UI构建](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F267250784 "https://zhuanlan.zhihu.com/p/267250784")
*   [深入详解Jetpack Compose | 实现原理](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F270682182 "https://zhuanlan.zhihu.com/p/270682182")
*   [探索Compose内核：深入SlotTable系统](https://juejin.cn/post/7113736450968911908 "https://juejin.cn/post/7113736450968911908")
*   [一文看懂Jetpack Compose快照系统](https://juejin.cn/post/7095544677515919367 "https://juejin.cn/post/7095544677515919367")
*   [Understanding Jetpack Compose — part 1 of 2](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fandroiddevelopers%2Funderstanding-jetpack-compose-part-1-of-2-ca316fe39050 "https://medium.com/androiddevelopers/understanding-jetpack-compose-part-1-of-2-ca316fe39050")
*   [Understanding Jetpack Compose — part 2 of 2](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fandroiddevelopers%2Funder-the-hood-of-jetpack-compose-part-2-of-2-37b2c20c6cdd "https://medium.com/androiddevelopers/under-the-hood-of-jetpack-compose-part-2-of-2-37b2c20c6cdd")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！