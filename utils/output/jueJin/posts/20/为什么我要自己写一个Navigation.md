---
author: ""
title: "为什么我要自己写一个Navigation"
date: 2023-08-30
description: "做一个Single Activity Application，Navigation很好用，但还是不够好用。如果要自己写一个Fragment路由框架，阁下又改如何应对呢？"
tags: ["Android","Android Jetpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:31,comments:0,collects:31,views:2139,"
---
Fragment的地位在提升
--------------

传统来说，Android APP中的页面应该是以多个Activity去组织的，Fragment往往只适合在Activity中挖出一块，用于展示便于切换的碎片页面。

随着Jetpack Navigation(此处主要指的是`navigation-fragment`)的推出，Fragment的地位开始有所提高。Navigation推荐我们用多个Fragment去展示单个业务下的多个页面，仿佛渐渐取代了传统的Activity，当上了主角。

甚至，我们可以考虑一整个app都只在一个Activity容器上承载，所有页面都通过Fragment去实现，这就是Single activity application。早在多年前，Android官方推出Navigation时就提出了这种设想（Single activity: Why, when, and how (Android Dev Summit '18)）。这样做有哪些激动人心的变化呢？

*   **更轻量的实现**：Fragment比Activity更轻量，也不需要在AndroidManifest中定义
*   **更好的性能**：启动Activity涉及与系统服务的跨进程通信，而启动Fragment则简单得多
*   **信息传递**：通过共享ViewModel去传递参数，比通过Intent去给另一个Activity传参更简单和灵活
*   **全局弹窗**：是否遇到过弹窗还没处理的时候发生了Activity跳转，此时弹窗就被挤掉了。只有一个Activity时，弹窗就是全局的，获得和iOS一样的全局弹窗体验。
*   **无需申请权限的应用内浮窗**：我们知道使用浮动窗口是需要向系统申请相关权限的，如果我们只需要一个应用内的“浮窗”，那只要往Activity的布局上添加这个“浮窗”，它就可以“浮动”在所有页面的顶上，得到一个应用内浮窗的效果。

#### ⚖ 那代价呢

凡事总有利弊，Single Activity Application带来好处的同时也引入了一些风险：

*   Fragment的生命周期比Activity更复杂
*   Fragment的回退栈不好管理，且调试时无法用adb指令dump出来
*   屏幕方向等Activity配置难以管理

为了方便开发者实现多Fragment的路由，Jetpack推出了Navigation这个最早是用于控制Fragment路由导航的框架。

Navigation好用吗
-------------

作为官方推出的框架，介绍它的文章自有不少，这里就不展开。

我也亲身使用过一段时间，确实能解决一些问题，但也同时有很多痛点

*   用xml定义路由表，与代码定义的Fragment有点割裂，且写法复杂
*   无法保持之前的Fragment状态
*   除了自行控制，在进入或返回时，不确定能否保持Fragment的屏幕方向，是否全屏等属性
*   用id资源来做路由地址，除非用DeepLink
*   缺乏路由拦截器机制

写完Fragment后还要去navGraph的xml去定义一下，实在是麻烦，我甚至连layout的xml都不想写

> 和layout xml说拜拜 [BrickUI，基于Android View体系撸一个声明式UI框架](https://juejin.cn/post/7243725397858336805 "https://juejin.cn/post/7243725397858336805")

如果让我来写一个Fragment路由框架
--------------------

我开始考虑，如果我要去做一个Single activity application，我需要一个怎样的路由框架？

*   直接在Fragment上定义路由信息
*   可以选择是否保持历史Fragment的状态
*   可以在去到或回到Fragment时，就像Activity一样，恢复其横竖屏、全屏等窗口属性，而不需要额外控制
*   可以通过uri来配置路由地址和传参，一个页面支持配置多个路由地址
*   具有路由拦截器机制，拦截器可以动态装载和卸载，拦截器有优先级区分
*   既然能传参，那还应该可以返回结果给上一个页面，类似onActivityResult
*   支持类似Activity的LaunchMode

![image.png](/images/jueJin/4d731d68d4494fc.png)

#### 这个路由框架已经写好了 👇🏻👇🏻👇🏻

🐱 [github.com/robin8yeung…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frobin8yeung%2FBlink%2Ftree%2Fmain%2Fblink-fragment "https://github.com/robin8yeung/Blink/tree/main/blink-fragment")

**Blink**，名字取自dota游戏中的闪烁技能。欢迎大家来star一下⭐️⭐️⭐️

来看看blink-fragment怎么用
--------------------

### 定义Activity容器

容器Activity用于承载Fragment，为了使`blink-fragment`框架正常运行，有以下要求：

*   需要继承抽象类`BlinkContainerActivity`
*   禁止系统设置变化导致Activity重建

```kotlin
    class FragmentContainerActivity: BlinkContainerActivity() {
    // 首个展示的Fragment，不希望写死也可以返回null，后续通过blink()方法来跳转
    override fun startFragment() = HomeFragment()
    
    // 其他业务代码
}
```

由于Activity重建会导致一系列问题，不太好解决，如结果返回，状态维护等，所以现阶段禁止Activity重建，请在`AndroidManifest.xml`中对容器Activity的`android:configChanges`进行以下配置：

```xml
<activity android:name="com.seewo.blink.example.fragment.FragmentContainerActivity"
android:configChanges="mcc|mnc|navigation|orientation|touchscreen|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"/>
```

### 定义一个Fragment

通过注解即可在定义Fragment的地方定义好它的路由地址，以及它的一系列页面属性。当然，这些页面属性的定义不是必须的。

```kotlin
    object Uris {
    const val fragment = "blink://my.app/fragment"
    const val HOME = "blink://my.app/home"
}

// 为MyFragment定义一个或多个路由uri
@BlinkUri(value = [Uris.fragment, Uris.HOME])
// 定义页面方向为竖屏，当来到或回到这个页面时，屏幕方向都将切换为竖屏
@Orientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)
// 自定义转场动画
@CustomAnimations(
enter = R.anim.enter_from_bottom, exit = R.anim.fade_out,
popEnter = R.anim.fade_in, popExit = R.anim.exit_to_bottom)
// 定义页面进入回退栈后不再保持状态(即通过replace切换到新的页面)
@KeepAlive(false)
// 设置SystemUI样式，当来到或回到此页面时，SystemUI样式更新为以下配置
@SystemUI(
hideStatusBar = true,
hideNavigationBar = true,
brightnessLight = false,
)
// 设置页面的背景颜色，类似于Activity设置window的背景颜色
@Background(Color.TRANSPARENT)
    class MyFragment : Fragment() {
    // ....
}
```

#### 🚀 LaunchMode

前面说了，我们还可以定义LaunchMode，但不是通过注解来定义。不是不行，而是类似Activity需要在onNewIntent中去接收二次打开时的新Intent。而blink-fragment定义了相关抽象类来提供相应功能。

```kotlin
// 为MyFragment定义LaunchMode为singleTop，继承SingleTopFragment即可
@BlinkUri(Uris.fragment)
    class MyFragment : SingleTopFragment() {
        override fun onNewArguments(arguments: Bundle?) {
        // 重复打开时，会回调此方法
    }
}

// 为MyFragment定义LaunchMode为singleTask，继承SingleTaskFragment即可
@BlinkUri(Uris.fragment)
    class MyFragment : SingleTaskFragment() {
        override fun onNewArguments(arguments: Bundle?) {
        // 重复打开时，会回调此方法
    }
}
```

这里没有SingleInstance模式，需要的话可以自行开一个新的Activity。

#### 🚥 路由表初始化

只用`@BlinkUri`定义了路由地址实际上还无法生效，它只是便于初始化路由表在执行KSP时收集信息。

对于多module的项目，每个定义过`@BlinkUri`的module中，都需要实现一个RouteMetadata，在初始化的时候，如Application的onCreate，调用每个RouteMetadata的inject()来把module的路由表注入到全局路由表之中。

如果不希望module的逻辑侵入app module，也可以借助Jetpack startup框架了来执行module内部的初始化

为什么不用ASM的方式来简化这个步骤呢？我的考虑是编译时插桩容易在编译侧造成开销，而这个初始化对于每个module，只需要写一点代码就可以一劳永逸，最终还是决定稍微难为一下开发者。

```kotlin
// 用@BlinkMetadata注解定义一个路由表的初始化入口，为了简化实现，请继承BaseMetadata
@BlinkMetadata
class RouteMetadata : BaseMetadata()

// lib module建议用startup框架来实现初始化，也可以在Application的onCreate中对所有模块的BaseMetadata子类进行初始化调用
    class AvatarInitializer : Initializer<Unit>{
        override fun create(context: Context) {
        // 初始化，注入module的路由表到全局路由表，建立uri与页面的映射关系，否则无法实现路由跳转
        RouteMetadata().inject()
    }
    
    override fun dependencies(): MutableList<Class<out Initializer<*>>> =
    mutableListOf()
}
```

### 传参与返回

#### 🎁 传参与返回回调

blink-fragment基于uri参数来传参，也提供了简洁的方式来创建uri。

此外通过`blink()`函数的`回调参数`即可接收下个页面返回的数据，是不是比传统Activity的`onActivityResult`方便多了？

```kotlin
    object Uris {
    const val HOME = "blink://my.app/home"
}

// 以下两种Uri的构造方式是等效的，都可以路由到@BlinkUri定义为Uris.HOME的页面并传参
    fragment.blink("${Uris.HOME}?name=Peter&age=8") {
    // 此处接受返回回调，返回的结果是个Bundle?类型
}

    fragment.blink(Uris.HOME.buildUri {
    append("name", "Peter")
    append("age", "8")
        }) {
        // 此处接受返回回调，返回的结果是个Bundle?类型
    }
```

#### 📮 接收参数与返回结果

blink-fragment提供了一系列简单的接收参数的操作符，也可以通过by lazy的方式来自行处理复杂的接受参数的操作

```kotlin
@BlinkUri(Uris.HOME)
    class HomeFragment : Fragment() {
    
    // 开发者通过by lazy自行处理Name参数传入
private val name: String? by lazy { arguments?.uriOrNull?.getQueryParameter("name") }

// 由Blink提供懒加载函数进行参数注入，默认值可选。
private val age: Int by intParams("age", 18)

    override fun onActivityCreated(savedInstanceState: Bundle?) {
    super.onActivityCreated(savedInstanceState)
        findViewById<View>(R.id.button).setOnClickListener {
        // 点击按钮，返回Bundle结果
            pop(Bundle().apply {
            putInt("result", 1)
            })
        }
            findViewById<View>(R.id.cancel).setOnClickListener {
            // 点击取消，直接返回，此时路由发起方的回调则会接收到一个null数据
            pop()
        }
    }
}
```

### 拦截器

通过拦截器可以方便的拦截某些路由或对路由进行重定向，修改参数等。blink-fragment的拦截器支持动态的添加和移除，也支持优先级的定义

```kotlin
// 这里仅用于举例，真实使用时，建议拦截器职责单一
    class ExampleInterceptor : Interceptor {
        override fun process(from: Fragment?, target: Bundle) {
        val uri = target.uriOrNull
        // 打印路由信息
        Log.i("blink", "[from] $from [to] $uri")
        // 获取路由请求的参数，修改path并增加参数
            target.setUri(uri?.build {
            path("/another")
            append("new", true)
            })
            // 对于缺少权限的情况，拦截跳转
                if (!Permission.hasCameraPermission) {
                interrupt("缺少必要权限")
            }
            // 如果权限具备，则继续跑到下一个拦截器或者跑完了所有拦截器则执行路由
        }
    }
    
    val exampleInterceptor = ExampleInterceptor()
    
    // 添加拦截器
    exampleInterceptor.attach()
    // 移除拦截器
    exampleInterceptor.detach()
```

#### 🚒 异常处理

既然路由可能被拦截，就要考虑做异常处理。`blink()`函数返回的是一个`Result<Unit>`，可以对Result处理异常。

**路由失败的原因主要有：**

*   **FragmentNotFoundException** 无法找到uri对应的Fragment
*   **自定义异常** 被路由拦截，拦截器调用`interrupt()`时，默认抛`InterruptedException`来拦截拦截，也支持自定义拦截异常

```kotlin
    blink("blink://navigator/example?name=Blink").onFailure {
    // 处理异常
        }.onSuccess {
        // 路由成功
    }
```

实现原理
----

**blink-fragment**的原理并不复杂，主要做了几件事：

#### 🏡 为每个Fragment分配容器

通过blink-fragment定义的Fragment实际上并不是直接插入`BlinkContainerActivity`中的，而是在其外层还包了一层`BlinkContainerFragment`，BlinkContainerFragment作为容器，为实际的Fragment提供了背景颜色，属性管理等的相关支持，也就是实际Fragment通过注解定义的除了BlinkUri以外的属性，都记录在了这个容器中，当来到或回到这个页面时，它就会让这些属性生效，免去Fragment对这些逻辑的关心。

#### 🌏 生成路由表

借助ksp框架，在编译时扫描开发者定义在module内定义的BlinkUri，并为该module生成路由表。再把路由表信息写入到被`@BlinkMetadata`注解的类中，为其创建一个`_inject()`函数，用于注入全局路由表。最终调用到了这个\_inject()函数即可完成路由表的初始化。而\_inject()函数的功能，即是往全局路由表单例`RouteMap`中注册该module的路由表信息。

#### 🚀 执行路由

通过调用`blink(uri)`来执行路由导航时，uri会经过每一个拦截器处理，如果未被拦截，则最终输出一个最终uri，此时即可到全局路由表`RouteMap`中去查找uri所对应的Fragment。如果无法查找到Fragment，则抛出`FragmentNotFoundException`；如果能查找到对应的Fragment，则创建一个`BlinkContainerFragment`容器去装载这个Fragment，并且获取其注解的相关参数，并生成一个唯一标识符，最终把这个BlinkContainerFragment根据所注解的参数，装载到`BlinkContainerActivity`中

#### ✉️ 结果返回

blink-fragment的路由功能本身基于一个`Blink`单例来实现，其也管理了一个收集回调的映射表，映射表的key为目标Fragment的唯一标识符。当调用`pop(bundle)`返回时，通过这个标识符即可查找到对应的结果回调，回调给路由来源

总结
--

目前`blink-fragment`已经接入到一些实际的项目中，也有着不错的开发效率收益。不过如果要做到Single Activity Application，可能对于新项目会更适合，毕竟对于成熟项目，把一个个Activity改成Fragment，工作量和风险着实不小。

本文适合的场景有限，所以仅当给大家拓宽个思路。如果有不合理和考虑不周的地方，也希望可以和大家友好讨论。

最后如果本文对你有帮助，就求点赞求评论求收藏，给个一键三连吧~🎉