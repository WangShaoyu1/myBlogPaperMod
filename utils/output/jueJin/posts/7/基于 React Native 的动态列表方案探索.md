---
author: ""
title: "基于 React Native 的动态列表方案探索"
date: 2022-09-13
description: "针对动态列表问题我们使用RN进行了一下探索尝试， 利用云音乐已经相对完善的RN基建，结合客户端列表能力低成本的实现了一套的动态化能力，同时兼顾一定的性能体验。"
tags: ["React Native中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:25,comments:5,collects:21,views:4458,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")  
> 本文作者： wyl

背景
--

时至2022，精细化运营已经成为了各大App厂商的强需求，阿里的 DinamicX、Tangram 大家应该都很熟悉了，很多App厂商也自研了一些类似框架，基于DSL的动态化方案虽然有性能上的一些优势，但是毕竟不是图灵完备，一些需要逻辑动态下发的需求实现成本偏高，或由于DSL本身限制无法实现，针对这个问题我们使用RN进行了一下探索尝试， 利用我们已经相对完善的RN基建，结合客户端列表能力低成本的实现了一套的动态化能力，同时兼顾一定的性能体验。

![示例1](/images/jueJin/50bb228023f2784.png)![示例2](/images/jueJin/5d79e672fa71057.png)

基于 ReactNative 的动态列表方案简单来说就是将 ReactNative 容器内嵌在 RecyclerView 的 ViewHolder 中，由于页面主体框架还是由 Native 开发和渲染，所以首屏加载速度得到了保证，局部的RN实现也使页面获得动态化的能力，从而在性能、”完备逻辑执行“的动态化能力之间取得了一个平衡点，根据我们使用经验对几种动态化方案排序如下：

*   整体性能体验排序： 纯 Native > 基于DSL动态化方案 >= ReactNative 动态列表方案 > 纯 ReactNative 页面 > H5
    
*   动态能力排序： H5 = 纯 ReactNative 页面 > ReactNative 动态列表方案 > 基于DSL动态化方案 > 纯 Native
    
*   实现能力排序： 纯 Native >= RN 动态列表方案 = 纯 ReactNative 页面 > H5 > 基于DSL的动态化方案
    

从以上排序中可以看出 ReactNative 动态列表方案整体处于中等或中等偏上的一个位置，在实现能力上远胜余基于 DSL 动态方案，和 Native 能力基本对等，可以实现一些复杂的UI交互效果，并且相比于纯 RN 实现的页面首屏速度会有非常大的优势，另外不需要对页面整体框架进行更改就能比较方便的嵌入，在开发维护成本上 RN 动态列表方案相比各种基于DSL的动态化方案会有比较明显的优势，不需要额外的开发组件管理平台，排查问题时也不用去读难懂的 dsl，最重要的是 RN 具有图灵完备的能力，所以综合来看使用 RN 内嵌到 Native RecyclerView 来实现 Native 页面部分动态化的方式算是一种性价比相对较高的方式了，值得一试。

技术方案介绍
------

这里从 Android 视角分享下我们这套方案实现的一些技术细节、原理以及遇到的问题。首先我们常用的一些术语：

1.  `moduleName` 是 RN 离线包的唯一 key，相当于离线包的名字；
2.  `componentName` 是 RN 中 registerComponent 的 component，对应一个 RN 实现的业务的执行入口；
3.  卡片指云音乐首页中每个 viewholder 内部的展示内容，展示的 UI 样式是卡片样式；
4.  RN 引擎指以 RN Bridge 为主的整个 JS 离线包运行时环境。

整体方案架构如下：

![整体方案设计](/images/jueJin/2c3ed74333de0c5.png)

从图中可以看出整体方案采用数据驱动的方式，服务端通过数据中携带的类型、component、moduleName等字段来唯一指定是否是使用 RN 来渲染，执行 RN 离线包中的哪个 component 逻辑

整体方案上有几个细节点：

1.  采用数据驱动的方式，接入页面无须关注具体展示数据，只需要将数据透传到 RN 的 JS 侧即可
2.  由于 RN 需要将离线包加载后才能执行 JS 生成客户端视图，在 RecyclerView 绑定数据时才开始加载 RN 的离线包势必会拖慢整个模块的展示，所以这里我们做了整个离线包的预加载
3.  首页列表中每个 ViewHolder 的展示元素我们叫做一个卡片，目前采取的策略是多个卡片放在一个 RN 的离线包中，通过同一个 RN 容器来分别展示，避免多个容器消耗过多的资源。

下面从数据流角度拆解整个方案，整体方案可以分为服务端数据定义和下发，容器数据透传，JS侧数据解析三个主要步骤：

1.  服务端数据定义和下发

由于是服务端接口驱动 RecyclerView 中内容展示，接口下发数据中需要有type字段标识使用RN还是Native展示，可以服用Native展示样式标记字段，由于RN中具体展示的样式和运行哪些 JS 代码直接相关，所以服务端下发的数据中需要带上对应的 moduleName 和 componentName，整体数据结构定义如下：

```css
[    {        "type":"rn",        "rnInfo":{            "moduleName":"bizDiscovery",            "component":"hotSong",            "otherInfo":{            }        },        "data":{            "songInfo":{            }        }    },    {        "type":"dragonball",        "data":{            "showInfo":{            }        }    }]
```

获取到数据之后只需要按照 RecyclerView 正常的使用方法将数据和不同的 ViewHolder 绑定即可

2.  容器数据透传

RN 容器直接直接内嵌在 ViewHolder 中，在 viewHolder 中只需要定义承载 RN JS 渲染视图的 ViewGroup container，RN Bridge 创建好 ReactRootView 后将创建好的 ReactRootView 调用 add 方法添加到 container 中即可，数据传递是透传的方式通过 RN 的 initialProperty 传入到 JS 侧，在 JS 侧解析和使用，数据传递代码如下：

```scss
mReactRootView?.startReactApplication(reactInstanceManager, componentName, initialProperties)
```

这里面需要注意的点是，由于所有使用RN展示的卡片都是对应的相同的 RecyclerView type 即相同的 ViewHolder，所以在 RecyclerView 复用时可能会出现两种情况：1. 只有一个 RN 卡片，上下滑动 RecyclerView 时发生复用，这时基本不用处理，2. 存在两种不同类型的 RN 卡片，复用时会运行完全不同的离线包代码，这种情况会导致 JS 侧重新执行渲染逻辑生成全新的视图，上下滚动时如果每次都出现 JS 侧重新渲染，会极大的影响滑动时性能，造成滑动卡顿掉帧，针对这种问题我们对 RN 的 ReactRootView 也做了缓存，整体架构如下：

![复用设计](/images/jueJin/aef3aeb7e0a0d0d.png)

从图中可以看到 ViewHolder 中的 container 和 RN 的 ReactRootView 是一对多的关系，RN 的 ReactRootView 在第一次初始化完成后还是挂在 RN 管理的虚拟视图树中，在 RecyclerView 滑动切换不同的展示类型时只需要从 ViewHolder 的 container 中移除不展示的ReactRootView 再重新 add 需要展示的 ReactRootView，不需要 JS 侧重新执行，重新 add ReactRootView 之后还需要将当前的数据再传入 JS 侧以适配相同样式的卡片展示不同数据的需求。这里面的原理是一般情况下我们一个 RN Bridge 只会创建一个 ReactRootView，但是查看 RN 源码，RN 其实支持一个 RN Bridge 绑定多个 RootView 的能力，代码如下：

```ini
    public void addRootNode(ReactShadowNode node) {
    mThreadAsserter.assertNow();
    int tag = node.getReactTag();
    mTagsToCSSNodes.put(tag, node);
    mRootTags.put(tag, true);
}
```

一个 ReactRootView 即一棵视图树，RN在更新客户端视图时都会遍历所有的 ReactRootView，代码如下：

```scss
    protected void updateViewHierarchy() {
    ....
        try {
            for (int i = 0; i < mShadowNodeRegistry.getRootNodeCount(); i++) {
            int tag = mShadowNodeRegistry.getRootTag(i);
            ReactShadowNode cssRoot = mShadowNodeRegistry.getNode(tag);
            
                if (cssRoot.getWidthMeasureSpec() != null && cssRoot.getHeightMeasureSpec() != null) {
                ...
                    try {
                    notifyOnBeforeLayoutRecursive(cssRoot);
                        } finally {
                        Systrace.endSection(Systrace.TRACE_TAG_REACT_JAVA_BRIDGE);
                    }
                    
                    calculateRootLayout(cssRoot);
                    ...
                        try {
                        applyUpdatesRecursive(cssRoot, 0f, 0f);
                            } finally {
                        }
                        ...
                    }
                }
                    } finally {
                    Systrace.endSection(Systrace.TRACE_TAG_REACT_JAVA_BRIDGE);
                }
            }
```

所以即使使用多个 ReactRootView RN 的渲染逻辑也可以正常执行，这里一个 ReactRootView 即对应 JS 实现中的一个 Component，我们在运行 RN 业务代码会看到 startApplication 的实现在 ReactRootView 中，startApplication 传入的参数就是 Component，对应代码如下：

```less
    public class ReactRootView extends FrameLayout implements RootView, ReactRoot {
    public void startReactApplication(
    ReactInstanceManager reactInstanceManager,
    String moduleName,
    @Nullable Bundle initialProperties,
        @Nullable String initialUITemplate) {
        ...
    }
}
```

到此客户端侧的重点实现基本完成了，接下来就是JS侧。

3.  JS 侧写法变化

JS 侧的对于卡片开发的写法和正常的 RN 开发基本相同，唯一的区别是需要同时注册多个 component，客户端每个业务卡片启动时只需要启动对应的 Component 即可，代码示例如下：

```scss
AppRegistry.registerComponent('hotTopic', () => EStyleTheme(HotTopic));
AppRegistry.registerComponent('musicCalendar', () => EStyleTheme(MusicCalendar));
AppRegistry.registerComponent('newSong', () => EStyleTheme(NewSong));
```

4.  JS 和 Native 通信

至此整个渲染流程都已经介绍完成，卡片已经可以正常展示，不过既然RN具有图灵完备的能力，势必会有一些用户交互导致的UI变化，比如点击卡片上的 ”叉“ 的不感兴趣操作，点击后需要通知客户端弹出客户端的不感兴趣组件，多个卡片对应同一个 JS 引擎，JS 和 Native 的通信通道也是复用的，怎么决定由哪个卡片来弹出呢，我们的做法是在卡片第一次渲染时就使用时间戳的哈希值生成唯一的 key，将这个 key 作为 Native 侧和 JS 侧区分不同业务的唯一标识，和具体展示的业务卡片关联起来在双侧都存储起来，这样后续每次通信时双侧就可以通过 key 来确认通信的对象，确保不会导致通信混乱。

5.  RN 引擎预热

在整个 RN 的执行周期中离线包加载一般也会消耗比较多的时间，所以为了尽可能的提升性能，我们还对页面卡片对应的整个离线包进行了预热，即提前将离线包加载到内存中并准备好业务逻辑的运行时环境，预热只需要创建好 ReactInstanceManager 并调用createReactContextInBackground() 即可，调用后整个离线包会被交给 JS 引擎进行预处理，代码如下：

```scss
ReactInstanceManager.builder()
.setApplication(ApplicationWrapper.getInstance())
.setJSMainModulePath("index.android")
.addPackage(MainReactPackage())
...
.build()
.createReactContextInBackground()
```

这里还需要注意的一个点是代码调试能力，采用内嵌的方式如果原来页面已经有摇一摇这种手势， RN 原生的调试菜单会无法呼出，这里需要增加额外的交互方式来解决，我们在卡片上增加了一个悬浮按钮。

到此整体框架就都已介绍完毕，在框架之外内存占用和合理的异常处理也是需要考虑的重点。

内存
--

在整体技术实现之外，我们另外关注的一个重点就是内存占用，我们对以RN Bridge为核心的RN容器内存占用进行了统计，使用Profiler工具获取数据如下：

无RN容器（native/java）

1 RN容器（native/java）

2 RN容器（native/java）

3 RN容器（native/java）

5 RN容器（native/java）

红米k30pro 6G

148/54.6

154/56

157/55.7

153/56.7

208/59.8

谷歌Pixel 2XL 4G

137.8/60

163/73

176/83

186/91

196/101

红米k30 8G

118/52

143/56

136/55

138/56

142/60

整体看来在5个以内RN容器的情况整体内存并没有增加很多，内存占用整体在可控状态，由于此方案采用了一个 RN Bridge 对应多个卡片的方式，所以相当于只新增一个Bridge，对内存影响较小，实际线上运行也没有新增 OOM 问题。

异常处理
----

1.  出现异常如何处理

不管是 JS 写法原因还是 ReactNative 本身的稳定性原因，总有一定概率会有异常出现，这时需要合理的逻辑处理保证功能和用户体验不会受到比较大的影响，我们当前的处理策略是异常监听还是使用 NativeExceptionHandler 来监听 SoftException 和 FatalException，异常时在统一的回调中通知上层业务（recyclerView 层），然后根据具体的业务情况，由业务层统一消除或者重建 RN 容器，保证体验不受影响或者影响较小，以云音乐首页使用场景为例目前卡片总 PV 约 1 亿，错误率不到万分之一，整体运行情况稳定，无相关用户反馈。

2.  RN版本升级导致和数据不兼容如何处理

RN 使用离线包策略，为保证用户能正常获取到离线包和保证离线包能快速高效的更新，我们采取了兜底包集成、更新信息服务端接口搭车等策略，不过受限于用户的机型地区、网络状态等原因还是存在一定概率的更新不成功，对于这种情况我们将当前 RN 离线包支持的卡片信息保存在离线包的配置文件中，通过离线包获取的接口暴露给业务方，业务在运行离线包前可以根据配置信息对网络请求结果进行过滤，保证新版数据匹配旧版的离线包时不会导致异常。

未来规划
----

短期内我们希望将 RN 动态列表方案结合我们已有的 RN 低代码能力，实现首页运营动态搭建发布，另一方面主要在性能提升，我们目前还是使用的 RN 0.60.5 版本，JS 的执行效率和当前版本的多线程框架是我们的最大的瓶颈，之后我们会在新架构上进行更多的尝试。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！