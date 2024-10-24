---
author: ""
title: "聊聊 RN 中 Android 提供 View 的那些坑"
date: 2020-12-02
description: "最近笔者研究 Android 中使用自定义 View 提供原生组件给 React Native（下面统一写成 RN ） 端的时候，遇到一些实际问题，在这里从 RN 的一些工作机制入手，分享一下问题的原因和解决方案。 在给 RN 提供自定义 View 的时候发现自定义 View …"
tags: ["WebView","React Native","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:17,comments:0,collects:9,views:2468,"
---
> 本文作者：[程磊](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fprofile_ext%3Faction%3Dhome%26__biz%3DMzAxODg1NzQ4OA%3D%3D%26scene%3D124%23wechat_redirect "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAxODg1NzQ4OA==&scene=124#wechat_redirect")

最近笔者研究 `Android` 中使用自定义 `View` 提供原生组件给 `React Native`（下面统一写成 `RN` ） 端的时候，遇到一些实际问题，在这里从 `RN` 的一些工作机制入手，分享一下问题的原因和解决方案。

### 自定义 View 内容不生效

#### 原因

在给 `RN` 提供自定义 `View` 的时候发现自定义 `View` 内部很多 `UI` 逻辑没有生效。

例如下图，根据逻辑隐藏/展示了一些控件，但是应显示控件的位置没有变化。被隐藏控件的位置还是空出来的。很明显整个自定义 `View` 的 `requestLayout` 没有执行。

![](/images/jueJin/55359dfc847a4ec.png)

问题的答案就在 `RN` 根布局 `ReactRootView` 的 `measure` 方法里面。

![](/images/jueJin/0e60d4e4d9754c8.png)

在这个View的测量过程中，会判断 measureSpec 是否有更新。

![](/images/jueJin/edb60e119169417.png)

当 `measureSpec` 有变化，或者宽高有变化的时候，才会触发 `updateRootLayoutSpecs` 的逻辑。

继续看下 `updateRootLayoutSpecs` 里做了一些什么事情，跟着源码最后会执行到 `UIImplementation` 的 `dispatchViewUpdates` 方法：

![](/images/jueJin/2470fe9146a841b.png)

最终执行：

![](/images/jueJin/e90d12a194b6468.png)

这里会从根节点往下一直更新子 `View` ，执行 `View`的 `measure` 和 `layout`。

所以 `ReactRootView` 在宽高和测量模式都没有变化的情况下，就相当于把子 `View` 发出的 `requestLayout` 请求都拦截了。

#### 解决方案

知道了原因就非常好解决了，既然你不让我通知我的根控件需要重新布局，那我就自己给自己重新布局好了。参考了 `RN` 一些自带的自定义 `View` 的实现，我们可以在这个自定义 `View` 重新布局的时候，注册一个 `FrameCallback` 去执行自己的 `measure` 和 `layout` 方法。

![](/images/jueJin/f4c4f5cea6724ba.png)

### RN 自定义View 必须在JS端设置宽高

实现了自定义 `View` 之后，在 `JSX` 里面指定标签之后，会发现这个原生组件并没有显示。通过 IDE 的 `Layout Inspect` 可以发现此时这个自定义 `View` 的 `width` 和 `height` 都是 `0` 。如果设置了 `width` 和`height` 的话就可以展示了。

这时候就很奇怪了， 为什么我的自定义 `View` 里面的内容明明是 `WRAP_CONTENT` 的，很多自定义 `View` 又是直接继承的 `ConstraintLayout` 、 `RelativeLayout` 这种 `Android` 的 `ViewGroup` ，但还是要指定宽高才能在 `RN` 中渲染出来呢？

要解决这个疑惑，就需要了解一下 `RN` 的渲染流程。

#### RN 是怎么确定 Native View的宽高的

我们顺着 `RN` 更新 `View` 结构的 `UIImplementation#updateViewHierarchy` 方法，发现有两处关键的逻辑：

![](/images/jueJin/436edcef884b463.png)

`calculateRootLayout` 中调用了 `cssRoot` 的布局计算逻辑:

![](/images/jueJin/557145ec263d454.png)

接下来就是 `applyUpdatesRecursive`，顾名思义就是递归的更新根节点的所有子节点，在我们的场景中即整个页面的布局。

![](/images/jueJin/e94117c83def416.png)

需要更新的节点则调用了 `dispatchUpdates` 方法，执行 `enqueueUpdateLayout`, 调用 `NativeViewHierarchyManager#updateLayout` 逻辑。

![](/images/jueJin/6e037ce055254a2.png)

`updateLayout` 的核心流程如下：

*   调用 `resolveView` 方法获取到真实的控件对象。
*   调用这个控件的 `measure` 方法。

![](/images/jueJin/2266d492ff02489.png)

*   调用`updateLayout`，执行这个控件的 `layout`方法

![](/images/jueJin/339797c81f22424.png)

发现了没有？这里的 `width`、`height` 已经是固定的值分别传给了 `meausre` 和 `layout`, 也就是说，这些 `View` 的宽高根本不是 `Android` 的绘制流程决定的，那么这个 `width` 和 `height` 的值是从哪里来的呢？ 回头看看就发现了答案：

![](/images/jueJin/5b0820cf5484453.png)

宽高是 `left`、`top`、`right`、`bottom`坐标相减得到的，而这些坐标则是通过 `getLayoutWidth` 和 `getLayoutHeight` 得到的：

![](/images/jueJin/5d98001edfac41c.png)

而这个 `layoutWidth` 和 `layoutHeight`，则都是 `Yoga` 帮我们计算好，存放在 `YogoNode`里面的。

**关于 Yoga**

```java
Yoga 是 Facebook 实现的一个高性能、易用、 Flex 的跨端布局引擎。
React Native 内部则是使用 Yoga 来布局的。
具体内容可以看 Yoga 的官网：https://yogalayout.com/
```

这里也就解释了为什么自定义 `View` 需要在 `jsx` 中指定了 `width` 和 `height` 才会渲染出来。因为这些自定义 `View` 原本在 `Android`系统的 `measure` `layout` 流程都已经被 `RN` 给控制住了。

这里可以总结成一句话：

_RN 中最终渲染出来的控件的宽高，都由 Yoga 引擎来计算决定，系统自身的布局流程无法直接决定这些控件的宽高_

但是这时候还是有一个疑问，为什么RN自己的一些组件，例如 `<Text/>` ，没有指定 宽高也可以正常自适应显示呢？

#### 为什么 RN 自己的 Text 是有自己的宽高的

我们来看一下RN是怎么定义渲染出来的 `TextView` 的，找到对应的 `TextView` 的 `ViewManager`,

`com.facebook.react.views.text.ReactTextViewManager`

我们关注两个方法：

1.  createViewInstance

![](/images/jueJin/b2d85a153713497.png)

2.  createShadowNodeInstance

![](/images/jueJin/9b49823d1376450.png)

其中，`ReactTextView` 其实就是实现了一个普通的 `Android TextView`, `ReactTextShadowNode` 则表示了这个 `TextView` 对应的 `YogaNode` 的实现。

![](/images/jueJin/783d4c87364d403.png)

在它的实现中，我们可以看到一个成员变量，从名字上看是负责这个 `YogaNode` 的 `measure` 工作。

![](/images/jueJin/b96011cab72a464.png)

`YogaNodeJNIBase` 会调用这个JNI的方法，给JNI的逻辑注册这样一个回调函数。

![](/images/jueJin/840cdce5b5774ae.png)

这个 `YogaMeasureFunction` 的具体实现：

![](/images/jueJin/88f5b2f73afb425.png)

这里截个图，可以看到这里调用了 `Android` 中 `Text` 绘制的 `API` 来确定的文本的宽高。函数返回的是

![](/images/jueJin/900f62b1553046e.png)

这里是使用了 `YogaMeasureOutput.make` 把 `Layout` 算出来的宽高转成一定格式的二进制回调给 `Yoga` 引擎，这也是为什么 `RN` 自己的 `Text` 标签是可以自适应宽高展示的。

这里我们也可以得到一个结论：如果 `Android` 端封装的自定义 `View` 可以是确定宽高或者内部的控件是非常固定可以通过 `measure` 和 `layout` 就能算出宽高的，我们可以通过注册 `measureFunction` 回调的方式告诉 `Yoga` 我们 `View` 的宽高。

但是在实际业务中，我们很多业务组件是封装在 `ConstraintLayout` 、`RelativeLayout` 等 ViewGroup 中，所以我们还需要其他的方法来解决组件宽高设置的问题。

#### 解决方案

那么这个问题可以重写 `View` 的 `onMeasure` 和 `layout` 方法来解决吗？看起来是这个做法是可以解决 `View` 宽高为 `0` 渲染不出来的问题。但是如果 `jsx` 这样描述布局的时候：

![](/images/jueJin/c3ad97aad4064f3.png)

这时候 `AndroidView` 和 `Text` 会同时显示，并且 `AndroidView` 被 `Text` 遮住。

稍微思考一下就能得到原因：对于 `Yoga` 引擎来说，`AndroidView` 所代表的的节点仍然是没有宽高的，`YogaNode` 里面的 `width`、`height` 仍然是 `0`，那么当重写 `onMeasure` 和 `onLayout` 的逻辑生效后，`View` 显示的左上方顶点是 `(0,0)` 的坐标。

而 `Yoga` 引擎自己计算出 `Text` 的宽高后， `Text` 的左上方顶点坐标肯定也是 `(0,0)` ，所以这时候2个 `View` 会显示在同一个位置（重叠或者覆盖）。

所以这时候问题就变成了，我们想通过 `Android` 自己的布局流程来确定并刷新这个自定义控件，但是 `Yoga` 引擎并不知道。

所以想要解决这个问题，可行的有两条路：

*   改变 UI 层级和自定义 `View` 的粒度
*   `Native` 测量出实际需要的宽高后同步给`Yoga` 引擎

##### 增加自定义控件的粒度

举一个自定义控件的例子：

![](/images/jueJin/406a6dc01cd54ac.png)

我们希望把这个图上第一行的控件拆分成粒度较低的自定义 `View` 交给 `RN` 来布局实现布局动态配置的能力。但是这类场景的左右两边控件都是自适应宽度。这时候在 `JS` 端其实没有办法提供一个合适的宽度。考虑到更多场景下同一个方向轴上的自适应宽度控件是有位置上的依赖性的，所以可以不拆分这两个部分，直接都定义在同一个自定义 `View` 内：

![](/images/jueJin/d8fb4168a149400.png)

提供给 `JS` 端使用，没有宽高的话，就把整个 `SingHeaderView` 的宽度设置成

![](/images/jueJin/a07b35d66ce34ab.png)

这时候内部的两个控件会自己去进行布局。最终展示出来的就是左右都是 `Wrap_Content` 的。

##### Native 测量出实际需要的宽高后同步给Yoga引擎

但是控制自定义 `View` 的粒度的方式总归是不够灵活，开发的时候也往往会让人犹豫是否拆分。接着之前的内容，既然这个问题的矛盾点在于 `Yoga` 不知道 `Android` 可以自己再次调用 `measure` 来确定宽高，那如果能把最新的宽高传给 `Yoga`，不就可以解决我们的问题吗？

具体怎么触发 `YogaNode` 的刷新呢？通过阅读源码可以找到解决方法。在 `UIManage`里面，有一个叫做 `updateNodeSize` 的 `api`:

![](/images/jueJin/337e666d55094de.png)

这个 `api` 会更新 `View` 对应的 `cssNode` 的大小，然后分发刷新 `View` 的逻辑。这个逻辑是需要保证在后台消息队列里面执行的，所以需要把这个刷新的消息发送到 `nativeModulesQueueThread` 里面去执行。

我们在 `ViewManager` 里面保存这个 `Manager` 对应的 `View` 和 `ReactNodeImpl` 实例。例如 `Android` 端封装了一个 `LinearLayout` ， 对应的 `node` 是 `MyLinearLayoutNode`。

![](/images/jueJin/819b4dae5b9e4a5.png)

重写自定义 `View` 的 `onMeasure`， 让自己是 `wrap_content` 的布局：

![](/images/jueJin/b8f5de192840493.png)

在 `requestLayout` 中根据自己真实的宽高布局并触发以下逻辑:

![](/images/jueJin/7f5bbbbe9009425.png)

![](/images/jueJin/cb161bab6474474.png)

不过上面这个方案虽然可以解决 `View` 的 `wrap_content` 显示的问题，但是存在一些缺点：

刷新 `YogaNode` 实际是在 `requestLayout` 的时候触发的，这就相当于 `requestLayout` 这种比较耗费性能的操作会双倍的执行。对于一些可能会频繁触发 `requestLayout` 的业务场景来说需要慎重考虑。如果遇到这种场景，还是需要根据自己的需求来灵活选择解决方式。

> 本文发布自 [网易云音乐大前端团队](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fx-orpheus "https://github.com/x-orpheus")，文章未经授权禁止任何形式的转载。我们常年招收前端、iOS、Android，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！