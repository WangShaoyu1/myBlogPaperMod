---
author: ""
title: "RTC 脚手架的设计和实现"
date: 2022-09-08
description: "目前云音乐旗下 APP 众多，其中涉及到 RTC 业务的不在少数，例如：常见的音视频连麦、PK、派对房，1v1 聊天等。由于业务线不同，功能不同，开发者也不同，大家各写一套，不断的重复造轮子。"
tags: ["Android","RTC中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:2,comments:1,collects:6,views:1661,"
---
> 图片来源：[699pic.com/tupian-4017…](https://link.juejin.cn?target=https%3A%2F%2F699pic.com%2Ftupian-401703470.html "https://699pic.com/tupian-401703470.html")

> 作者：AirLand

#### 什么是 RTC？

**RTC** 即 Real-Time Communication 的简称是一种给行业提供高并发、低延时、高清流畅、安全可靠的全场景、全互动、全实时的音视频服务的终端服务。上面是比较官方的解释，通俗的来讲就是一种能够实现一对一、多对多音视频通话等众多功能的服务。目前提供该项服务的服务商有很多例如：声网、云信、火山引擎、腾讯云等。

#### 背景

目前云音乐旗下 APP 众多，其中涉及到 RTC 业务的不在少数，例如：常见的音视频连麦、PK、派对房，1v1 聊天等。由于业务线不同，功能不同，开发者也不同，大家各写一套，不断的重复造轮子，因此为了避免重复的开发工作提升开发效率，需要有一套通用的RTC框架。

#### 设计思路

在讲具体的方案设计之前，先讲一下我的设计思路：

1.  **功能内聚**：需要将功能都封装在一个容器里，对外通过接口提供方法调用
2.  **业务隔离**：不同的业务需要有不同的功能容器
3.  **统一调用**：所有功能容器需要有统一的调用入口
4.  **状态维护**：需要对状态进行精准维护
5.  **切换无感**：进行功能容器切换时候，无感知
6.  **核心可控**：对核心链路可监控，故障预警

基于以上 6 点，大致的架构设计如图所示，这里先不用深究图中的模块表示什么，后面会讲到，这里只是先了解一下大致的架构：

![image.png](/images/jueJin/dc115845006b71f.png)

接下来我就来讲讲具体的实现过程。

#### 方案设计

##### 前言：

RTC 的业务场景虽然很多，但本质上却相差无几，都是用户加入到一个共同的房间，然后在房间内进行实时的音视频通讯。具体到实际项目中大致又可分为两种：全场景 RTC 和部分场景 RTC。

*   **全场景 RTC** ：整个业务都是通过 RTC 技术实现例如：1v1 音视频通话、派对房等。
*   **部分场景 RTC**：即整个业务链路中只有一部分使用了 RTC 技术，往往这种业务会涉及到引擎的切换。

不管是哪一种场景，承载核心功能的引擎都是必不可少的，因此我们首先就从引擎开始着手，另外为了方便描述，后续便将引擎统一称作 Player。

##### 1、Player 的封装

在与 RTC 相关联的业务中会涉及到不同类型的 Player，例如：主播开播（推流 Player），观众观看直播（拉流 Player）以及 RTC Player等。它们的功能虽然各不相同，但用法却有相似之处，例如都有启动 start，终止 stop 等。因此我们可以将不同的 Player 抽象出一个共同的接口 **IPlayer** 相关代码如下：

```java
    interface IPlayer<DS : IDataSource, CB : ICallback> {
    fun start(ds: DS)
    
    fun stop()
    
    fun <T : Any> setParam(key: String, value: T?)
    
    ......
}
```

其中 **IDataSource** 和 **ICallback** 分别是启动 Player 所需要的数据源和回调，后面的文章中也会多次提到，特别是 **IDataSource** 它是 Player 启动的源头就好比打电话时的电话号码。

> 在这里遇到的一个问题点就是由于 Player 内聚了所有的功能除了有一些通用方法外，也有着属于自己特有的方法，例如：静音，音量调节等。这些方法众多而且各不相同无法在 IPlayer 接口中全部列出，即使能全部列出，但随着业务的迭代 Player 中的方法肯定会不断变化，不可能每更改一个方法就改一下接口，这显然不符合程序设计原则。那么如何将不同的方法抽象化，让上层通过调用同一个方法来执行不同的操作呢？这里通过：

```java
fun <T : Any> setParam(key: String, value: T?)
```

来实现，其中 key 表示方法的唯一标记，value 表示方法的入参。这样上层只需要通过调用 setParam 传入相应的方法标记和方法入参即可调用到对应的方法了。那么如何做到呢？答案也很简单通过一个中间层建立起一一映射关系。但是 Player 的类型众多，要是每写一个 Player 都要写一个映射逻辑就太麻烦了。所以这里通过 **APT** 编译时注解再结合 [javapoet](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsquare%2Fjavapoet "https://github.com/square/javapoet") 自动生成这个中间层并给它命名为 xxxPlayerWrapper 其内部生成一个 convert 方法，在这个方法内部完成一一映射逻辑。接下来我们看看具体实现过程：

1.  首先定义了两个注解分别作用于具体的 Player 和对应的方法例如：

```java
@Retention(RetentionPolicy.CLASS)
@Target({ElementType.TYPE})
    public @interface PlayerClass {
}

@Retention(RetentionPolicy.CLASS)
@Target({ElementType.METHOD})
    public @interface PlayerMethod {
    String name();
}

@PlayerClass
    open class xxxPlayer : IPlayer<xxxDataSource, xxxCallback>() {
    
    @PlayerMethod(name = "key1")
        fun method1(v: String) {
        ....具体实现
    }
}
```

2.  一一映射关系建立：

xxxPlayer 和 xxxPlayerWrapper 之间是一个相互依赖关系，互为彼此的成员变量。当调用 xxxPlayer 的接口方法 setParam(key: String, value: T?) 时，会直接调用到 xxxPlayerWrapper 的 convert 方法，convert 方法会根据 key 来找到其所对应的方法名，最后直接调用到 Player 的具体方法。

![image.png](/images/jueJin/c9bc8974491f23c.png)

由于所有的 Player 都有这个逻辑因此可以将这部分再抽象成一个 AbsPlayer:

```java
abstract class AbsPlayer<DS : IDataSource, CB : ICallback>
    : IPlayer<DS, CB>{
    var dataSource: DS? = null
        private val wrapper by lazy {
            val ret = kotlin.runCatching {
            val clazz = Class.forName(this::class.java.canonicalName + "Wrapper")
            val signature = arrayOf(this::class.java)
                clazz.constructors.find {
                signature.contentEquals(it.parameterTypes)
                }?.newInstance(this) as? PlayerWrapper
            }
            ret.exceptionOrNull()?.printStackTrace()
            ret.getOrNull()
        }
        
        
            override fun <T : Any> setParam(key: String, value: T?) {
            wrapper?.convert(key, value)
        }
        //...... 省略其他无关代码
    }
    
```

最后整个 Player 的类图如下所示：

![image.png](/images/jueJin/d8f77942a09f7e0.png)

这里我们不关注 Player 的功能具体是如何实现的，比如如何推流，如何拉流，如何进行 RTC 等。毕竟每个项目底层所用的服务商 sdk 各不相同，技术实现也不同，因此这里我们只从架构的层面去探讨。

##### 2、Player 的切换

Player 的切换针对的就是部分场景 RTC，这里我们引入 **SwitchablePlayer** 的概念专门用于此种场景，而其本身也继承自 AbsPlayer， 具备 Player 的所有功能。只不过这些功能是通过装饰者模式由其内部真正的 Player 来实现，同时增加了 Switch 的能力。再讲到 Switch 能力之前先来思考几个问题。

> 1.  何时触发 Switch？
>     
> 2.  如何进行 Switch？
>     
> 3.  Switch 的目标对象 Player 从何而来？
>     

**第一个问题何时触发 Switch**：我们知道只要触发 Switch 就意味着需要启动另外的 Player，而启动 Player 又需要上面提到的 IDataSource，因此我们只需要判断启动 Player 所传入的 IDataSource 类型和当前 Player 的 IDataSource 类型是否相同，如果不同便可触发。判断的具体逻辑是对比当前 Player 泛型参数的 IDataSource 类型（**AbsPlayer<DS : IDataSource, CB : ICallback>第一个范型参数**）和传入的 IDataSource 类型来实现。

```java
private fun isSourceMatch(
player: AbsPlayer<IDataSource, ICallback>?,
ds: IDataSource
    ): Boolean {
        if (player == null) {
        return false
            } else {
            val clazz = player::class.java
            var type = getGenericSuperclass(clazz) ?: return false
                while (Types.getRawType(type) != AbsPlayer::class.java) {
                type = getGenericSuperclass(type) ?: return false
            }
                return if (type is ParameterizedType) {
                val args = type.actualTypeArguments
                    if (args.isNullOrEmpty()) {
                    false
                        } else {
                        Types.getRawType(args[0]).isInstance(ds) && isSameSource(player, ds)
                    }
                        } else {
                        false
                    }
                }
            }
```

**第二个问题如何进行 Switch**：这个就比较简单了只需要停止掉当前的 Player 再启动目标 Player 即可。

**第三个问题 Switch 的目标对象 Player 从何而来**：SwitchablePlayer 并不清楚业务需要哪些 Player ，只是对 Player 功能的一层包装以及维护 Switch 功能，因此具体的 Player 创建需要由业务层来实现， SwitchablePlayer 只提供一个获取 Player 的抽象方法例如：

```java
abstract fun getPlayer(ds: IDataSource): AbsPlayer<out IDataSource, out ICallback>?
```

另外由于进行 Switch 的时候会停止掉当前的 Player，而被停止的 Player 是否能复用，如果能复用则可以将其缓存起来，下次使用优先从缓存中获得。整个SwitchablePlayer对应的流程如图所示：

![image.png](/images/jueJin/a3fb38a8f5bf15c.png)

在使用时调用者可以根据自己的业务定义相关 Player,例如在直播-> PK 的业务中，涉及到两个 Player 的切换即：LivePlayer 和 PKPlayer

```java
    class LivePKSwitchablePlayer : SwitchablePlayer(false) {
        override fun getPlayer(ds: IDataSource): AbsPlayer<out IDataSource, out ICallback> {
            return when (ds) {
                is LiveDataSource -> {
                LivePlayer()
            }
                is PKDataSource -> {
                PKPlayer()
            }
            else -> LivePlayer()
        }
    }
    
}
```

##### 3、流程封装

对于整个 RTC 流程的封装需要搞清楚两件事情：

> 1.  RTC 的主体流程是怎样的
> 2.  业务调用方需要的是什么，关注的又是什么

由于 RTC 的主体流程和日常打电话相似，所以笔者以此类比，这样大家更容易理解。下图所示即为整个通话过程。 ![image.png](/images/jueJin/3c9c76c59d3c95d.png)

搞清楚整个流程后，接下来就是搞清楚第二件事情，业务调用方需要的是什么，关注的又是什么。结合上图来看关注的大概有三点：

*   第一就是需要具备拨打和挂断的入口；（**Player 的 Start 和 Stop**）
    
*   第二就是要能知道当前的通话状态比如是否正在连通，是否已经接通，是否通话结束；（**Player 的 状态维护**）
    
*   第三就是一些反馈比如对方未接通，对方不在服务区，手机号是空号等。（**Player 的 核心事件回调即之前提到的 ICallback**）
    

而至于它是如何连通的，底层做了哪些操作，拨打电话的人对此毫不关心。基于上述我们的整体功能设计所要关注的点就有了。

> 1、通过设计一个 manager 来管理 Player 并对外暴露 Start 和 Stop 方法。
> 
> 2、对 Player 进行状态维护，并让其状态可被上层监听。
> 
> 3、Player 的一些核心事件回调也可被上层监听。

其中第一点和第三点比较简单，这里就不做过多的赘述。第二点状态维护，笔者使用了 StateMachine 状态机来实现，在不同的状态执行不同的操作，同时每一种状态都对应一个状态码，上层可以通过监听状态码来感知状态变化。

![image.png](/images/jueJin/337a3feed982416.png)

状态码和核心事件的设置这里使用了 LiveData 去处理

```java
    class RtcHolder : IRtcHolder {
    private val _rtcState = MutableLiveData(RtcStatus.IDLE)
    private val _rtcEvent = MutableLiveData(RtcEvent.IDLE)
    val rtcState = _rtcState.distinctUntilChanged()
    val rtcEvent = _rtcEvent.distinctUntilChanged()
        private val callBack = object : IRtcCallBack {
            override fun onCurrentStateChange(stateCode: Int) {
            _rtcState.value = stateCode
        }
        
            override fun onEvent(eventCode: Int) {
            _rtcEvent.value = eventCode
        }
        
        //......省略其他代码
        
    }
    
        init {
        //上层状态监听
            rtcState.observeForever {
                when (it) {
                    RtcStatus.CONNECT_END -> {
                    ToastHelper.showToast("通话结束")
                }
            }
        }
    }
    //......省略其他代码
}
```

到这里整个脚手架的方案设计就结束了，其中服务商 SDK 封装部分以及监控部分，笔者准备放到下期再来讲解。

#### 总结

本文介绍了 RTC 脚手架产生的背景，并以通俗易懂的方式一步步阐述设计过程以及最终实现。在此期间发现问题，解决问题，引出思考。由于受限于篇幅，不能将每一个点都进行详尽的介绍，有兴趣的同学如有疑问，可以留言，一起探讨学习。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！