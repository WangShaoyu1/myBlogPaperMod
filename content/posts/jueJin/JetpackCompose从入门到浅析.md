---
author: "若丶相见"
title: "JetpackCompose从入门到浅析"
date: 2021-07-28
description: "JetpackCompose是用于构建原生AndroidUI的现代工具包。JetpackCompose使用更少的代码，强大的工具和直观的KotlinAPI，简化并加速了Android上的UI"
tags: ["AndroidJetpack","Android"]
ShowReadingTime: "阅读27分钟"
weight: 488
---
概述
==

[Jetpack Compose 1.0 正式发布！打造原生 UI 的 Android 现代工具包](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FlkQ7AMVRulf-c02-Niju7g "https://mp.weixin.qq.com/s/lkQ7AMVRulf-c02-Niju7g")

Jetpack Compose是用于构建原生Android UI的现代工具包。 Jetpack Compose使用更少的代码，强大的工具和直观的Kotlin API，简化并加速了Android上的UI开发。这是Android Developers 官网对它的描述。

> 概述引自：  
> 作者：依然范特稀西  
> 链接：[juejin.cn/post/684490…](https://juejin.cn/post/6844903999347359751 "https://juejin.cn/post/6844903999347359751")

0\. 声明式 UI 的前世今生
----------------

其实声明式 UI 并不是什么新技术，早在 2006 年，微软就已经发布了其新一代界面开发框架 WPF，其采用了 XAML 标记语言，支持双向数据绑定、可复用模板等特性。

2010 年，由诺基亚领导的 Qt 团队也正式发布了其下一代界面解决方案 Qt Quick，同样也是声明式，甚至 Qt Quick 起初的名字就是 Qt Declarative。QML 语言同样支持数据绑定、模块化等特性，此外还支持内置 JavaScript，开发者只用 QML 就可以开发出简单的带交互的原型应用。

声明式 UI 框架近年来飞速发展，并且被 Web 开发带向高潮。React 更是为声明式 UI 奠定了坚实基础并一直引领其未来的发展。随后 Flutter 的发布也将声明式 UI 的思想成功带到移动端开发领域...

声明式UI的意思就是，描述你想要一个什么样的UI界面，状态变化时，界面按照先前描述的重新“渲染”即可得到状态绝对正确的界面，而不用像命令一样，告诉程序一步一步该干什么，维护各种状态。扯远了，这个并不是今天文章的重点，稍微了解一下就好，其他的就不在本文延伸。

关于声明式的更多介绍，建议看看这篇文章：[从 SwiftUI 谈声明式 UI 与类型系统](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F68275232 "https://zhuanlan.zhihu.com/p/68275232")

1\. 为什么我们需要一个新的UI 工具？
---------------------

在Android中，UI工具包的历史可追溯到至少10年前。自那时以来，情况发生了很大变化，例如我们使用的设备，用户的期望，以及开发人员对他们所使用的开发工具和语言的期望。

以上只是我们需要新UI工具的一个原因，另外一个重要的原因是View.java这个类实在是太大了，有太多的代码，它大到你甚至无法在Githubs上查看该文件，因为它实际上包含了30000行代码，这很疯狂，而我们所使用的几乎每一个Android UI 组件都需要继承于View。

GogleAndroid团队的Anna-Chiara表示，他们对已经实现的一些API感到遗憾，因为他们也无法在不破坏功能的情况下收回、修复或扩展这些API，因此现在是一个崭新起点的好时机。

这就是为什么Jetpack Compose 让我们看到了曙光。

2\. Jetpack Compose 介绍
----------------------

Jetpack Compose 是一个用于构建原生Android UI 的现代化工具包，它基于声明式的编程模型，因此你可以简单地描述UI的外观，而Compose则负责其余的工作-当状态发生改变时，你的UI将自动更新。由于Compose基于Kotlin构建，因此可以与Java编程语言完全互操作，并且可以直接访问所有Android和Jetpack API。它与现有的UI工具包也是完全兼容的，因此你可以混合原来的View和现在新的View，并且从一开始就使用Material和动画进行设计。

Compose 瞅一眼
===========

1\. 开发工具
--------

由于Compose 还没有发布正式版本，想要提前体验Compose的预览模式，则需要下载 [Android Studio Arctic Fox 2020.3.1 白狐版](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fstudio%2F "https://developer.android.google.cn/studio/")

2\. 第一个 Hello World
-------------------

首先从创建一个空的Jetpack Compose项目开始，打开最新 Canary 版的 Android studio 预览版，选择Empty Compose Activity 模板，开始Compose之旅：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14be6cda89e34b64950687d6376e2bf9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9adafdf21a164ef8a7b3f4ffd9973b86~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 创建Jetpack Compose项目时，我们发现 Minimum SDK 最小只能选择 API 21：Android 5.0，也就是说Jetpack Compose 支持的最小版本就是 API 21：Android 5.0 。

点击Finish完成项目构建，构建完成后效果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ab66df5d98e4c038ab87b3f4b128154~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 红框1：切换代码和布局样式  
> 红框2："A successful build is needed before the preview can be displayed" 需要成功构建才能显示预览，点击 "Build & Refresh..."

等待项目构建完成，效果并没有显示出来，此时需要我们运行项目 或者 点击"Build & Refresh..." 或者我们自己手动Build项目才会出现最终效果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50caaa38ef194810b818ed6660d7bcbd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 红框1. 刷新视图，当代码发生变化时，点击它可以刷新视图（首次需要Build）  
> 红框2和3. 把当前视图直接部署到设备上看效果。更多关于布局预览工具的使用，可以查看官网上关于此内容的介绍 [developer.android.google.cn/jetpack/com…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Fpreview "https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Fpreview")

Compose 我就想自己手动配置
-----------------

Compose的相关配置，都是studio工具创建 Empty Compose Activity 模板时自动配置好的，那Compose项目和普通项目之间有什么不同呢？

1.  Jetpack Compose 围绕 Kotlin 构建而成。在某些情况下，Kotlin 提供了一些特殊的惯用语，这使编写良好的 Compose 代码变得更容易。如果你的项目还不支持，请查看官网教程 [将 Kotlin 添加到现有应用](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fkotlin%2Fadd-kotlin%3Fhl%3Dzh-cn "https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fkotlin%2Fadd-kotlin%3Fhl%3Dzh-cn") 自行配置(确保您在项目中使用的是 Kotlin 1.5.10 或更高版本)。
    
2.  Jetpack Compose 的相关配置都在项目的 `app/build.gradle` 文件中：
    

js

 代码解读

复制代码

``plugins {     id 'com.android.application'     id 'org.jetbrains.kotlin.android' } android {     compileSdk 30     buildToolsVersion "30.0.3"     defaultConfig {         ...                  // Jetpack Compose 最小支持版本         minSdk 21     }     // 基于Jdk 1.8版本     compileOptions {         sourceCompatibility JavaVersion.VERSION_1_8         targetCompatibility JavaVersion.VERSION_1_8     }     kotlinOptions {         jvmTarget = '1.8'     }               buildFeatures {         // 启用 Jetpack Compose         compose true     }     composeOptions {         // compose_version = '1.0.0-beta09'         kotlinCompilerExtensionVersion compose_version     } } dependencies {     implementation 'androidx.core:core-ktx:1.3.2'     implementation 'androidx.appcompat:appcompat:1.2.0'     implementation 'com.google.android.material:material:1.3.0'     // ① Compose 由 `androidx` 中的 6 个 Maven 组 ID 构成。每个组都包含一套特定用途的功能     implementation "androidx.compose.ui:ui:$compose_version"     implementation "androidx.compose.material:material:$compose_version"     implementation "androidx.compose.ui:ui-tooling:$compose_version"     implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.3.1'     implementation 'androidx.activity:activity-compose:1.3.0-alpha06'     testImplementation 'junit:junit:4.+'     androidTestImplementation 'androidx.test.ext:junit:1.1.2'     androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'     androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version" }``

① Compose 由 `androidx` 中的 6 个 Maven 组 ID 构成。每个组都包含一套特定用途的功能

组

说明

[compose.animation](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-animation "https://developer.android.google.cn/jetpack/androidx/releases/compose-animation")

在 Jetpack Compose 应用中构建动画，丰富用户的体验。

[compose.compiler](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-compiler "https://developer.android.google.cn/jetpack/androidx/releases/compose-compiler")

借助 Kotlin 编译器插件，转换 @Composable functions（可组合函数）并启用优化功能。

[compose.foundation](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-foundation "https://developer.android.google.cn/jetpack/androidx/releases/compose-foundation")

使用现成可用的构建块编写 Jetpack Compose 应用，还可扩展 Foundation 以构建您自己的设计系统元素。

[compose.material](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-material "https://developer.android.google.cn/jetpack/androidx/releases/compose-material")

使用现成可用的 Material Design 组件构建 Jetpack Compose UI。这是更高层级的 Compose 入口点，旨在提供与 [www.material.io](https://link.juejin.cn?target=http%3A%2F%2Fwww.material.io "http://www.material.io") 上描述的组件一致的组件。

[compose.runtime](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-runtime "https://developer.android.google.cn/jetpack/androidx/releases/compose-runtime")

Compose 的编程模型和状态管理的基本构建块，以及 Compose 编译器插件针对的核心运行时。

[compose.ui](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fandroidx%2Freleases%2Fcompose-ui "https://developer.android.google.cn/jetpack/androidx/releases/compose-ui")

与设备互动所需的 Compose UI 的基本组件，包括布局、绘图和输入。

3\. Composable (可组合的) 函数
------------------------

我们以往页面视图习惯性的在XMl里书写，而 Jetpack Compose 是围绕可组合函数构建的。这些函数可让您以编程方式定义应用界面，只需描述应用界面的形状和数据依赖关系，而不必关注界面的构建过程。如需创建可组合函数，只需将 `@Composable` 注释添加到函数名称中即可。

js

 代码解读

复制代码

`setContent {     // 使用主题中的“背景”颜色的表面容器(设置背景，具有Material Design的特性)     Surface(color = MaterialTheme.colors.background) {         Greeting("Android")     } } @Composable  fun Greeting(name: String) {      Text(text = "Hello $name!")  }`

①. setContent（`注意不是 setContentView 哦`）块定义了 Activity 的布局。我们不使用 XML 文件来定义布局内容，而是调用可组合函数。Jetpack Compose 使用自定义 Kotlin 编译器插件将这些可组合函数转换为应用的界面元素。例如，Compose 界面库定义了 `Text()` 函数；您可以调用该函数在应用中声明文本元素。

②. 可组合函数只能在其他可组合函数的范围内调用。要使函数成为可组合函数，请添加 `@Composable` 注释。如需尝试此操作，请定义一个 `Greeting()` 函数并向其传递一个名称，然后该函数就会使用该名称配置文本元素。

③. [当前的 Canary 版 Android Studio](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fstudio%2Fpreview "https://developer.android.google.cn/studio/preview") 允许您在 IDE 中预览可组合函数，而无需将应用下载到 Android 设备或模拟器中。主要限制在于，可组合函数不能接受任何参数。因此，您无法直接预览 `Greeting()` 函数，而是需要创建另一个名为 `PreviewGreeting()` 的函数，由该函数使用适当的参数调用 `Greeting()`。请在 `@Composable` 上方添加 `@Preview` 注释。

### 认识一下第一个组件 Text

js

 代码解读

复制代码

`@Composable fun Text(     text: String, // 文本     // Modifier 一个 有序的、不可变的修饰元素集合，用于添加装饰或者行为到Compose UI元素。例如background、padding 、点击事件等。     modifier: Modifier = Modifier,      color: Color = Color.Unspecified, // 文字颜色     fontSize: TextUnit = TextUnit.Unspecified, // 文字大小     fontStyle: FontStyle? = null, // 绘制字母时使用的字体变体（例如，斜体）     fontWeight: FontWeight? = null, // 字体粗细     fontFamily: FontFamily? = null, // 呈现文本时要使用的字体系列     letterSpacing: TextUnit = TextUnit.Unspecified, // 字间距     textDecoration: TextDecoration? = null, // 文字装饰、比如下划线     textAlign: TextAlign? = null, // 对齐方式     lineHeight: TextUnit = TextUnit.Unspecified, // 行高     overflow: TextOverflow = TextOverflow.Clip, // 文字显示不完的处理方式，例如尾部显示…或者中间显示…     softWrap: Boolean = true, // 文本是否应在换行符处中断。如果为false，则文本的宽度会在水平方向上无限延伸，且textAlign属性失效，可能会出现异常情况。     maxLines: Int = Int.MAX_VALUE, // 最大行数     onTextLayout: (TextLayoutResult) -> Unit = {}, // 计算新的文本布局时执行的回调     style: TextStyle = LocalTextStyle.current // 文本的样式配置，例如颜色，字体，行高等。也就是说上面属性中的color,fontSize等一些属性也可以在这里进行声明。具体包含的属性可以参考TextStyle类。 ) {     ... }`

### 看看我们声明式的优点之一 数据更新

#### mutableStateOf

js

 代码解读

复制代码

`class MainActivity : ComponentActivity() {     // inputText的类型改成mutableState，标明这个data是有状态的，如果发生了改变，则所有设计到的组件都要重新绘制     var inputText = mutableStateOf("")     override fun onCreate(savedInstanceState: Bundle?) {         super.onCreate(savedInstanceState)         setContent {             // var inputText by mutableStateOf("") 在Compose域中可使用by 代理             Content()         }     }       @Composable     fun HelloContent() {         Column(modifier = Modifier.padding(16.dp)) {             Text(                 text = "Hello",                 modifier = Modifier.padding(bottom = 8.dp)             )             OutlinedTextField( // 类比 EditText                 value = inputText.value,                 onValueChange = { inputText.value = it },                 label = { Text(text = "Name") },             )         }     } }`

mutableStateOf 会保存状态，而inputText是一个类成员变量，而JetPack Compose是一种“函数式”编程，因此通常无法引用或者不方便引用类变量，此时就需要 remember 了。

> 注：var inputText by mutableStateOf("") 也可以放在组件的父组件或者祖父..组件中声明，但是前提是需要保证该值变化导致界面重绘时其父组件或者祖父..组件不会重绘，若其父组件或者祖父..组件会重绘，则重绘时该值也会重新初始化，导致该值变化失败，此时就需要 remember 来缓存此值或者将其保存在 ViewModel中。

#### remember 和 ViewModel

js

 代码解读

复制代码

`// 1. remember："remember将值存储起来，当界面发生了重新绘制，就会读之前存储的值。" @Composable fun Content() {     val inputText = remember { mutableStateOf("") }     Column(modifier = Modifier.padding(16.dp)) {         Text(             text = "Hello",             modifier = Modifier.padding(bottom = 8.dp)         )         OutlinedTextField(             value = inputText.value,             onValueChange = { inputText.value = it },             label = { Text(text = "Name") },         )     } } // 2. ViewModel class WeViewModel : ViewModel() {     var inputText by mutableStateOf("") } @Composable fun Content() {     // 需要依赖 implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:1.0.0-alpha07'     val viewModel: WeViewModel = viewModel()     Column(modifier = Modifier.padding(16.dp)) {         Text(             text = "Hello",             modifier = Modifier.padding(bottom = 8.dp)         )         OutlinedTextField(             value = viewModel.inputText.value,             onValueChange = { viewModel.inputText.value = it },             label = { Text(text = "Name") },         )     } }`

Compose 在编译期分析出会受到某 state 变化影响的代码块，并记录其引用，当此 state 变化时，会根据引用找到这些代码块并标记为 Invalid 。在下一渲染帧到来之前 Compose 会触发 recomposition，并在重组过程中执行 invalid 代码块。

[\# 了解Compose的重组作用域](https://link.juejin.cn?target=https%3A%2F%2Fdocs.compose.net.cn%2Fprinciple%2Frecomposition_scope%2F "https://docs.compose.net.cn/principle/recomposition_scope/")

Compose 基础组件
============

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/566d253541bb413f9632a5d2476f5c86~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c1a368cce694e7885891dd2bcab24d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c07c2b79b914bba9dd6003c39f95f1a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Compose 神奇的Modifier
===================

Modifier 修饰符
------------

借助修饰符，您可以修饰或扩充可组合项。您可以使用修饰符来执行以下操作：

*   更改可组合项的大小、布局、行为和外观
*   添加信息，如无障碍标签
*   处理用户输入
*   添加高级互动，如使元素可点击、可滚动、可拖动或可缩放

修饰符是标准的 Kotlin 对象。您可以通过调用某个 [`Modifier`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fkotlin%2Fandroidx%2Fcompose%2Fui%2FModifier "https://developer.android.google.cn/reference/kotlin/androidx/compose/ui/Modifier") 类函数来创建修饰符。您可以将以下函数连在一起以将其组合起来：

js

 代码解读

复制代码

`@Composable fun ArtistCard(     artist: Artist,     onClick: () -> Unit ) {     val padding = 16.dp     Column(         Modifier             .clickable(onClick = onClick)             .padding(padding)             .fillMaxWidth()     ) {         Row(verticalAlignment = Alignment.CenterVertically) { /*...*/ }         Spacer(Modifier.size(padding))         Card(elevation = 4.dp) { /*...*/ }     } }`

请注意，在上面的代码中，结合使用了不同的修饰符函数。

*   `clickable` 使可组合项响应用户输入，并显示涟漪。
*   `padding` 在元素周围留出空间。
*   `fillMaxWidth` 使可组合项填充其父项为它提供的最大宽度。
*   `size()` 指定元素的首选宽度和高度。

> **注意**：除了其他作用之外，修饰符的作用类似于基于视图的布局中的布局参数。不过，由于修饰符有时专用于特定作用域，因此它们不仅可以确保类型安全，而且还能帮助您发现和了解对某个布局可用且适用的元素。对于 XML 布局，有时很难查明特定的布局属性是否适用于给定的视图。

### 修饰符顺序很重要

修饰符函数的顺序**非常重要**。由于每个函数都会对上一个函数返回的 `Modifier` 进行更改，因此顺序会影响最终结果。让我们来看看这方面的一个示例：

js

 代码解读

复制代码

`@Composable fun ArtistCard(/*...*/) {     val padding = 16.dp     Column(         Modifier             .clickable(onClick = onClick)             .padding(padding)             .fillMaxWidth()     ) {         // rest of the implementation     } }`

在上面的代码中，整个区域（包括周围的内边距）都是可点击的，因为 `padding` 修饰符应用在 `clickable` 修饰符后面。\*\*如果修饰符顺序颠倒，由 `padding` 添加的空间就不会响应用户输入

> **注意**：明确的顺序可帮助您推断不同的修饰符将如何相互作用。您可以将这一点与基于视图的系统进行比较。在基于视图的系统中，您必须了解盒模型，在这种模型中，在元素的“外部”应用外边距，而在元素的“内部”应用内边距，并且背景元素将相应地调整大小。修饰符设计使这种行为变得明确且可预测，并且可让您更好地进行控制，以实现您期望的确切行为。这也说明了为什么没有外边距修饰符，而只有 `padding` 修饰符。

### 内置修饰符

Jetpack Compose 提供了一个内置修饰符列表，可帮助您修饰或扩充可组合项。已引入 `padding`、`clickable` 和 `fillMaxWidth` 等修饰符。

> [Modifier修饰符(官方中文文档)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Flayouts%2Fbasics%3Fhl%3Dzh_cn%23modifiers "https://developer.android.google.cn/jetpack/compose/layouts/basics?hl=zh_cn#modifiers")  
> [Compose Modifier 相关文档(全)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fkotlin%2Fandroidx%2Fcompose%2Fui%2FModifier "https://developer.android.google.cn/reference/kotlin/androidx/compose/ui/Modifier")

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96b826c2dd7a4e538b6a0e3de9a90676~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dce3f9ea0a94f0694e5d9dbab7725b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Compose 自定义
===========

*   自定义绘制： `Canvas()`、`Modifier.drawBehind` 和 `Modifier.drawWithContent`

js

 代码解读

复制代码

`// 绘制未读小红点 fun Modifier.unread(show: Boolean) = this.drawWithContent {     // "*记得一定要调用！！！*"     drawContent()     if (show) {         drawIntoCanvas {             // ViewOverlay             // 绘制红色小点角标             val paint = Paint().apply {                 color = Color.Red             }             it.drawCircle(Offset(size.width - 1.dp.toPx(), 1.dp.toPx()), 5.dp.toPx(), paint)         }     } }`

*   Canvas 纯自定义绘制：[Compose 中的图形](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Fgraphics%3Fhl%3Dzh_cn "https://developer.android.google.cn/jetpack/compose/graphics?hl=zh_cn")
    
*   Layout：[自定义布局](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Flayouts%2Fcustom%3Fhl%3Dzh_cn "https://developer.android.google.cn/jetpack/compose/layouts/custom?hl=zh_cn")
    

js

 代码解读

复制代码

`@Composable fun CustomColumn(     modifier: Modifier = Modifier,     content: @Composable () -> Unit ) {     Layout(         modifier = modifier,         content = content     ) { measurables, constraints -> // 子布局列表, 测量布局的不可变约束         // 遍历测量         val placeables = measurables.map { measurable ->             // 测量每一个子组件             measurable.measure(constraints)         }         // 布局，将布局的大小设置为尽可能大         layout(constraints.maxWidth, constraints.maxHeight) {             // 记录放置子组件的 y 坐标             var yPosition = 0             // 将子元素放置在父布局中             placeables.forEach { placeable ->                 // 在屏幕上定位                 placeable.placeRelative(x = 0, y = yPosition)                 // 重置放置到的 y 坐标                 yPosition += placeable.height             }         }     } }`

Compose 固有特性
============

[\# Compose 布局中的固有特性测量](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Flayouts%2Fintrinsic-measurements%3Fhl%3Dzh_cn "https://developer.android.google.cn/jetpack/compose/layouts/intrinsic-measurements?hl=zh_cn")

Compose 有一项规则，即，子项只能测量一次，测量两次就会引发运行时异常。但是，有时需要先收集一些关于子项的信息，然后再测量子项。**借助固有特性，可以先查询子项，然后再进行实际测量。**

**触发场景：子布局决定父布局的宽高，比如：**

1.  Modifier.width(IntrinsicSize.Max)
2.  Modifier.width(IntrinsicSize.Min)
3.  Modifier.height(IntrinsicSize.Max)
4.  Modifier.height(IntrinsicSize.Min)

### 重写MeasurePolicy固有特性测量相关方法

js

 代码解读

复制代码

`@Composable inline fun Layout(     content: @Composable () -> Unit,     modifier: Modifier = Modifier,     measurePolicy: MeasurePolicy )`

对于固有特性测量的适配，我们需要根据需求重写以下四个方法。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/529442fea83949139c0190e0faa6938b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Layout声明时，我们就不需要传入MeasurePolicy，而是要自己实现MeasurePolicy，并重写相关的所有方法。

js

 代码解读

复制代码

`@Composable fun CustomColumn(modifier: Modifier, content: @Composable () -> Unit){     Layout(         content = content,         modifier = modifier,         measurePolicy = object: MeasurePolicy {             override fun MeasureScope.measure(                 measurables: List<Measurable>,                 constraints: Constraints             ): MeasureResult {                 TODO("Not yet implemented")             }             override fun IntrinsicMeasureScope.minIntrinsicHeight(                 measurables: List<IntrinsicMeasurable>,                 width: Int             ): Int {                 TODO("Not yet implemented")             }             override fun IntrinsicMeasureScope.maxIntrinsicHeight(                 measurables: List<IntrinsicMeasurable>,                 width: Int             ): Int {                 TODO("Not yet implemented")             }             override fun IntrinsicMeasureScope.maxIntrinsicWidth(                 measurables: List<IntrinsicMeasurable>,                 height: Int             ): Int {                 TODO("Not yet implemented")             }             override fun IntrinsicMeasureScope.minIntrinsicWidth(                 measurables: List<IntrinsicMeasurable>,                 height: Int             ): Int {                 TODO("Not yet implemented")             }         }     )  }`

Compose 浅入浅出
============

> 源码根据 **1.0.0-beta09 进行分析**

**我们在分析之前先想几个问题：**

1.  setContent是如何设置 `@Composable` 组件来初始化视图的？
2.  `@Composable` 到底是怎样通过函数来实现一系列View的功能的呢？
3.  我们设置的Modifier 是如何起作用的呢？
4.  测量流程从哪开始的呢？是如何测量的呢？
5.  绘制draw入口在哪？

**先给答案：**

1.  setContent方法里 通过创建ComposeView，并当作R.layout.xxx 设置到原setContentView方法中，来初始化内容视图。
2.  `@Composable` 函数最后生成LayoutNode，一些列`@Composable` 最后构建成了一个以root为根的LayoutNode树（类似于View🌲）。
3.  Modifier 绑定到 LayoutNode 中，每一个Modifier的扩展方法首先会通过 then 方法生成CombinedModifier的链，即每一个CombinedModifier 中 都包含上一个扩展方法返回的 Modifier，然后在 LayoutNode 中转换为LayoutNodeWrapper链，然后测量过程中递归遍历所有LayoutNodeWrapper链中所有LayoutNodeWrapper进行各个属性测量，最后回到LayoutNodeWrapper链中最后一个节点 InnerPlaceable(LayoutNode成员属性中初始化) 中开始测量当前LayoutNode子node，然后记录测量结果。
4.  测量流程 从我们的 AndroidComposeView 的 **onMeasure** 方法中开始，通过AndroidComposeView中的root来递归测量所有的LayoutNode，每一个LayoutNode又通过 LayoutNodeWrapper链测量。
5.  绘制draw入口 也在 AndroidComposeView 里，在 **dispatchDraw** 方法里调用了 root.draw(this)

视图的初始化--setContent
------------------

js

 代码解读

复制代码

`public fun ComponentActivity.setContent(     parent: CompositionContext? = null,     content: @Composable () -> Unit ) {     val existingComposeView = window.decorView         .findViewById<ViewGroup>(android.R.id.content)         .getChildAt(0) as? ComposeView     if (existingComposeView != null) with(existingComposeView) {         setParentCompositionContext(parent)         setContent(content)     } else ComposeView(this).apply {         // Set content and parent **before** setContentView         // to have ComposeView create the composition on attach         setParentCompositionContext(parent)         // ①         setContent(content)         // Set the view tree owners before setting the content view so that the inflation process         // and attach listeners will see them already present         setOwners()         setContentView(this, DefaultActivityContentLayoutParams)     } } // ①处代码 fun setContent(content: @Composable () -> Unit) {     shouldCreateCompositionOnAttachedToWindow = true     this.content.value = content     if (isAttachedToWindow) {         // ②         createComposition()     } } // ② 处代码 fun createComposition() {     check(parentContext != null || isAttachedToWindow) {         "createComposition requires either a parent reference or the View to be attached" +                 "to a window. Attach the View or call setParentCompositionReference."     }     // ③     ensureCompositionCreated() } // ③ 处代码 @Suppress("DEPRECATION") // Still using ViewGroup.setContent for now private fun ensureCompositionCreated() {     if (composition == null) {         try {             creatingComposition = true             // ④             composition = setContent(resolveParentCompositionContext()) {                 Content()             }         } finally {             creatingComposition = false         }     } } // ④ 处代码 internal fun ViewGroup.setContent(     parent: CompositionContext,     content: @Composable () -> Unit ): Composition {     GlobalSnapshotManager.ensureStarted()     // ⑤ 此处看到初始化了 AndroidComposeView，并且 addView 进 ComposeView     val composeView =         if (childCount > 0) {             getChildAt(0) as? AndroidComposeView         } else {             removeAllViews(); null         } ?: AndroidComposeView(context).also { addView(it.view, DefaultLayoutParams) }     // ⑥     return doSetContent(composeView, parent, content) }`

梳理一下：

1.  setContent 中我们看到创建了 ComposeView(ViewGroup)，然后看到了我们熟悉的 setContentView，并且将ComposeView 当作我们以往的 R.layout.xxx 形式来设置界面布局
2.  随后⑤的位置 初始化了AndroidComposeView(ViewGroup)，并且addView到 ComposeView 中，而AndroidComposeView也成为了最后一个我们熟悉的ViewGroup，而后续的测量、布局、绘制都是由AndroidComposeView开启。

@Composable方法最后的归宿--LayoutNode
------------------------------

我们通过一系列 `@Composable` 来实现界面的显示，对于 `@Composable` 到底是怎样通过函数来实现一系列View的功能的呢？答案其实就是 `LayoutNode`

### LayoutNode 的 前世今生

js

 代码解读

复制代码

`@Suppress("ComposableLambdaParameterPosition") @Composable inline fun Layout(     content: @Composable () -> Unit,     modifier: Modifier = Modifier,     measurePolicy: MeasurePolicy ) {     val density = LocalDensity.current     val layoutDirection = LocalLayoutDirection.current     ReusableComposeNode<ComposeUiNode, Applier<Any>>(         // ① 初始化 LayoutNode         factory = ComposeUiNode.Constructor,         update = {             set(measurePolicy, ComposeUiNode.SetMeasurePolicy)             set(density, ComposeUiNode.SetDensity)             set(layoutDirection, ComposeUiNode.SetLayoutDirection)         },         // ② 绑定modifier         skippableUpdate = materializerOf(modifier),         content = content     ) } ==========================  ↓↓↓↓↓  ============================= @Composable @ExplicitGroupsComposable inline fun <T, reified E : Applier<*>> ReusableComposeNode(     noinline factory: () -> T,     update: @DisallowComposableCalls Updater<T>.() -> Unit,     noinline skippableUpdate: @Composable SkippableUpdater<T>.() -> Unit,     content: @Composable () -> Unit ) {     if (currentComposer.applier !is E) invalidApplier()     currentComposer.startReusableNode()     // 此时为true     if (currentComposer.inserting) {         // 创建新Node节点         currentComposer.createNode(factory)     } else {         currentComposer.useNode()     }     currentComposer.disableReusing()     // 回调update，同理 ③     Updater<T>(currentComposer).update()     currentComposer.enableReusing()     // ③ 回调skippableUpdate     SkippableUpdater<T>(currentComposer).skippableUpdate()     currentComposer.startReplaceableGroup(0x7ab4aae9)     // ✋🏻 调用 @Composable 注解的方法     content()     currentComposer.endReplaceableGroup()     // ④ 结束Node     currentComposer.endNode() } ==========================  ↓↓ 先看下创建节点相关 ↓↓  =========================== @Suppress("UNUSED") override fun <T> createNode(factory: () -> T) {     validateNodeExpected()     check(inserting) { "createNode() can only be called when inserting" }     val insertIndex = nodeIndexStack.peek()     val groupAnchor = writer.anchor(writer.parent)     groupNodeCount++     // ⑤ 记录1     recordFixup { applier, slots, _ ->         @Suppress("UNCHECKED_CAST")         val node = factory()         slots.updateNode(groupAnchor, node)         @Suppress("UNCHECKED_CAST") val nodeApplier = applier as Applier<T>         // 若此nodeApplier为UiApplier，则此方法此处为空实现         nodeApplier.insertTopDown(insertIndex, node)         // ⑥ 重新设置current 的LayoutNode，为后续绑定Modifier做准备         applier.down(node)     }        // ⑦ 记录2     recordInsertUpFixup { applier, slots, _ ->         @Suppress("UNCHECKED_CAST")         val nodeToInsert = slots.node(groupAnchor)         // ⑧ 重新获取上一个 current，此操作为下面插入节点准备                         applier.up()         @Suppress("UNCHECKED_CAST") val nodeApplier = applier as Applier<Any?>         // 若此nodeApplier为UiApplier，插入节点使用此方法，         nodeApplier.insertBottomUp(insertIndex, nodeToInsert)     } }    private val insertFixups = mutableListOf<Change>()    // ⑤ 的方法实现 private fun recordFixup(change: Change) {     insertFixups.add(change) } private val insertUpFixups = Stack<Change>()    // ⑦ 的方法实现 private fun recordInsertUpFixup(change: Change) {     insertUpFixups.push(change) } // 将⑦中的Change add 到⑤ 中 private fun registerInsertUpFixup() {     insertFixups.add(insertUpFixups.pop()) } // ⑨ 此方法在上述 ④ 结束Node 里被调用 private fun recordInsert(anchor: Anchor) {     if (insertFixups.isEmpty()) {         val insertTable = insertTable         recordSlotEditingOperation { _, slots, _ ->             slots.beginInsert()             slots.moveFrom(insertTable, anchor.toIndexFor(insertTable))             slots.endInsert()         }     } else {         // 处理所有⑤ add 进 insertFixups 的所有Change的唯一逻辑         val fixups = insertFixups.toMutableList()         insertFixups.clear()         realizeUps()         realizeDowns()         val insertTable = insertTable         recordSlotEditingOperation { applier, slots, rememberManager ->             insertTable.write { writer ->                 fixups.fastForEach { fixup ->                     // 回调⑤ 中的lamdba                     fixup(applier, writer, rememberManager)                 }             }             slots.beginInsert()             slots.moveFrom(insertTable, anchor.toIndexFor(insertTable))             slots.endInsert()         }     } }    ======================  ↓↓ ③ 回头再看modifier传入的方法 ↓↓  =======================    @PublishedApi internal fun materializerOf(     modifier: Modifier ): @Composable SkippableUpdater<ComposeUiNode>.() -> Unit = {     val materialized = currentComposer.materialize(modifier)     update {         // 此set方法 方法体在下方         set(materialized, ComposeUiNode.SetModifier)     } } @Suppress("INLINE_CLASS_DEPRECATED", "EXPERIMENTAL_FEATURE_WARNING") inline class SkippableUpdater<T> constructor(     @PublishedApi internal val composer: Composer ) {     inline fun update(block: Updater<T>.() -> Unit) {         composer.startReplaceableGroup(0x1e65194f)         // 此处block 就是上个方法 ComposeUiNode.SetModifier的lamdba，即下面完整版         Updater<T>(composer).block()         composer.endReplaceableGroup()     } } // set方法 方法体 fun <V> set(     value: V,     block: T.(value: V) -> Unit ) = with(composer) {     if (inserting || rememberedValue() != value) {         updateRememberedValue(value)         // apply 将操作封装成Change 待后续执行         composer.apply(value, block)     } } override fun <V, T> apply(value: V, block: T.(V) -> Unit) {     // apply 将操作封装成Change 待后续执行     val operation: Change = { applier, _, _ ->         @Suppress("UNCHECKED_CAST")         (applier.current as T).block(value)     }     if (inserting) recordFixup(operation)     else recordApplierOperation(operation) } // ComposeUiNode.SetModifier 完整版, 此this 就是LayoutNode，此时已绑定modifier val SetModifier: ComposeUiNode.(Modifier) -> Unit = { this.modifier = it } =======================  ↓↓ 此时④ endNode执行后 ↓↓  ========================    override fun endNode() = end(isNode = true) private fun end(isNode: Boolean) {     ......          val inserting = inserting     if (inserting) {         if (isNode) {             // 🔟 将⑥中的Change add 到⑤ 中             registerInsertUpFixup()             expectedNodeCount = 1         }         reader.endEmpty()         val parentGroup = writer.parent         writer.endGroup()         if (!reader.inEmpty) {             val virtualIndex = insertedGroupVirtualIndex(parentGroup)             writer.endInsert()             writer.close()             // 调用⑨代码，处理insertFixups所有Change的唯一逻辑，开启创建节点和③处的回调             recordInsert(insertAnchor)             this.inserting = false             if (!slotTable.isEmpty) {                 updateNodeCount(virtualIndex, 0)                 updateNodeCountOverrides(virtualIndex, expectedNodeCount)             }         }     } else {         if (isNode) recordUp()         recordEndGroup()         val parentGroup = reader.parent         val parentNodeCount = updatedNodeCount(parentGroup)         if (expectedNodeCount != parentNodeCount) {             updateNodeCountOverrides(parentGroup, expectedNodeCount)         }         if (isNode) {             expectedNodeCount = 1         }         reader.endGroup()         realizeMovement()     }     exitGroup(expectedNodeCount, inserting) } =======================  ↓↓ 此时⑥ 和 ⑧ 执行前后 ↓↓  ======================== private val stack = mutableListOf<T>() override var current: T = root     protected set override fun down(node: T) {     //      stack.add(current)     current = node } override fun up() {     check(stack.isNotEmpty())     current = stack.removeAt(stack.size - 1) }      override fun insertTopDown(index: Int, instance: LayoutNode) {     // 忽略。在[insertBottomUp]中进行插入，自底向上构建树，避免子节点进入树时重复通知。 }  // 插入节点 override fun insertBottomUp(index: Int, instance: LayoutNode) {     current.insertAt(index, instance) }`

稍微梳理一下：

1.  ReusableComposeNode 开启了创建节点 和 设置参数，即：factory、update、skippableUpdate。
2.  factory、update、skippableUpdate 三个操作最终都变成了Change，待后续执行。
3.  currentComposer.endNode() 结束后，开始按顺序遍历执行所有的Change。

我们现在关注一下 ③ 和 ④ 中间的 ✋🏻 处，执行了我们使用 `@Composable` 注解的方法：

1.  ④处 endNode之后才会开始往current 节点中 insertAt 当前节点
    
2.  我们关注下 🔟 处节点代码，是先将所有⑦ 处的up和 insertBottomUp操作都放到 所有⑤处的 down和insertTopDown 之后操作。
    
3.  当执行完所有down和insertTopDown操作后，所有的LayoutNode都按从root(最外层)开始到最里层含有 **content:** **@Composable** \*\*\*\***ColumnScope.() -> Unit** 参数的LayoutNode存储到stack的缓存堆栈中。
    
4.  开始执行up和 insertBottomUp操作后，开始从后往前 取stack中LayoutNode构建完整的LayoutNode树。
    
5.  完整的LayoutNode树，所有的叶子节点，都是不带 **content:** **@Composable** \*\*\*\***ColumnScope.() -> Unit** 参数的 `@Composable` 的注解方法LayoutNode，根节点是root，其余页面依次向下。
    

#### applier.down(node) 和 applier.up()的迷惑操作？

js

 代码解读

复制代码

`// ⑤ 记录1 recordFixup { applier, slots, _ ->     @Suppress("UNCHECKED_CAST")     val node = factory()     slots.updateNode(groupAnchor, node)     @Suppress("UNCHECKED_CAST") val nodeApplier = applier as Applier<T>     // 若此nodeApplier为UiApplier，则此方法此处为空实现     nodeApplier.insertTopDown(insertIndex, node)     // ⑥ 重新设置current 的LayoutNode，为后续绑定Modifier做准备     applier.down(node) } // ⑦ 记录2 recordInsertUpFixup { applier, slots, _ ->     @Suppress("UNCHECKED_CAST")     val nodeToInsert = slots.node(groupAnchor)     // ⑧ 重新获取上一个 current，此操作为下面插入节点准备                     applier.up()     @Suppress("UNCHECKED_CAST") val nodeApplier = applier as Applier<Any?>     // 若此nodeApplier为UiApplier，插入节点使用此方法，     nodeApplier.insertBottomUp(insertIndex, nodeToInsert) }`

原因：Change 是按照 createNode、update、skippableUpdate 的顺序添加的，而遍历时也是需要按照此顺序，

applier.down(node) 先将createNode节点设置为current当前节点，然后执行update、skippableUpdate操作Change中的 (applier.current as T).block(value) 时，applier.current 就是 createNode，此时LayoutNode和Modifier就绑定成功了。而后续的applier.up() 是为了将createNode 插入到自己的父节点中，而createNode此时不能作为current，因为父节点下可能存在多个子节点，其下面的兄弟节点还需要插入到父节点上。

#### applier 为什么是 UiApplier？根LayoutNode又是谁？

js

 代码解读

复制代码

`"承接【视图初始化--serContent】部分源码" // ⑥ 处代码 @OptIn(InternalComposeApi::class) private fun doSetContent(     owner: AndroidComposeView,     parent: CompositionContext,     content: @Composable () -> Unit ): Composition {     if (inspectionWanted(owner)) {         owner.setTag(             R.id.inspection_slot_table_set,             Collections.newSetFromMap(WeakHashMap<CompositionData, Boolean>())         )         enableDebugInspectorInfo()     }     // ⑦ 初始化了Composition，同时初始化了UiApplier     val original = Composition(UiApplier(owner.root), parent)     val wrapped = owner.view.getTag(R.id.wrapped_composition_tag)         as? WrappedComposition         ?: WrappedComposition(owner, original).also {             owner.view.setTag(R.id.wrapped_composition_tag, it)         }     wrapped.setContent(content)     return wrapped } // ⑦ 初始化 UiApplier           internal class UiApplier(     root: LayoutNode ) : AbstractApplier<LayoutNode>(root) {     ...... }  // ⑧ 初始化 UiApplier 父类 AbstractApplier，此时可以看到 current = root，即上面传入的owner.root abstract class AbstractApplier<T>(val root: T) : Applier<T> {     private val stack = mutableListOf<T>()     override var current: T = root         protected set         ...... }`

我们从上面代码部分 ⑦ 处看到，初始化了UiApplier，此时也传入了一个参数 owner.root，那owner是谁呢，从代码 ⑤ 处看到 owner实际上是AndroidComposeView，从 ⑧ 处可以看出 根LayoutNode 就是 owner.root，即 AndroidComposeView 里的 root成员变量。

除了看上述源码为，还可以看 Applier 的实现类，只有三个 UiApplier、VectorApplier和AbstractApplier，前两者继承自最后一个抽象类，而 VectorApplier 只应用于 VectorComponent 和 VectorPainter中。

> **总结**： **@Composable** **注释的方法，最后都构建成了LayoutNode 被 insertAt 到 AndroidComposeView的root中，所以最后的 测量和布局 都在AndroidComposeView 中开始。**

Jetpack Compose 测量流程
--------------------

我们从上面得知 root 根LayoutNode在 AndroidComposeView 中，所以LayoutNode的测量肯定也是在AndroidComposeView里开始的，我们先从 AndroidComposeView 的 **onMeasure** 方法看起：

js

 代码解读

复制代码

`override val root = LayoutNode().also {     it.measurePolicy = RootMeasurePolicy     it.modifier = Modifier         .then(semanticsModifier)         .then(_focusManager.modifier)         .then(keyInputModifier) } private val measureAndLayoutDelegate = MeasureAndLayoutDelegate(root) override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {     trace("AndroidOwner:onMeasure") {         ...         val (minWidth, maxWidth) = convertMeasureSpec(widthMeasureSpec)         val (minHeight, maxHeight) = convertMeasureSpec(heightMeasureSpec)         val constraints = Constraints(minWidth, maxWidth, minHeight, maxHeight)         ...         // ① 更新约束 和 状态         measureAndLayoutDelegate.updateRootConstraints(constraints)         // ② 测量和布局         measureAndLayoutDelegate.measureAndLayout()         setMeasuredDimension(root.width, root.height)         ...     } } ==========================  ① 更新约束 和 状态  ============================= fun updateRootConstraints(constraints: Constraints) {     if (rootConstraints != constraints) {         require(!duringMeasureLayout)         rootConstraints = constraints         // 更新 root 状态         root.layoutState = LayoutNode.LayoutState.NeedsRemeasure         // 将root 添加进 需要测量或布局的布局节点         relayoutNodes.add(root)     } } ==========================   ② 测量和布局  ==================================      fun measureAndLayout(): Boolean {     ...     val rootConstraints = rootConstraints ?: return false     var rootNodeResized = false     if (relayoutNodes.isNotEmpty()) {         duringMeasureLayout = true         try {             // 取出刚刚add进的root             relayoutNodes.popEach { layoutNode ->                 if (layoutNode.isPlaced ||                     layoutNode.canAffectParent ||                     layoutNode.alignmentLines.required                 ) {                     // 在 ① 中状态已经更改为 NeedsRemeasure                     if (layoutNode.layoutState == LayoutNode.LayoutState.NeedsRemeasure) {                         // ③ 去测量                         if (doRemeasure(layoutNode, rootConstraints)) {                             rootNodeResized = true                         }                     }                     ......                 }             }         } finally {             duringMeasureLayout = false         }         consistencyChecker?.assertConsistent()     }     return rootNodeResized } ==========================   ③ 去测量  ================================== private fun doRemeasure(layoutNode: LayoutNode, rootConstraints: Constraints): Boolean {     // 当前 layoutNode 就是 root     val sizeChanged = if (layoutNode === root) {         // ④ 开始测量         layoutNode.remeasure(rootConstraints)     } else {         layoutNode.remeasure()     }     val parent = layoutNode.parent     if (sizeChanged) {         if (parent == null) {             return true         } else if (layoutNode.measuredByParent == LayoutNode.UsageByParent.InMeasureBlock) {             requestRemeasure(parent)         } else {             require(layoutNode.measuredByParent == LayoutNode.UsageByParent.InLayoutBlock)             requestRelayout(parent)         }     }     return false } // 根LayoutNode root internal fun remeasure(     constraints: Constraints = outerMeasurablePlaceable.lastConstraints ) = outerMeasurablePlaceable.remeasure(constraints) // OuterMeasurablePlaceable fun remeasure(constraints: Constraints): Boolean {     ......     // 此时 layoutState == NeedsRemeasure     if (layoutNode.layoutState == LayoutNode.LayoutState.NeedsRemeasure ||         measurementConstraints != constraints     ) {         layoutNode.alignmentLines.usedByModifierMeasurement = false         layoutNode._children.forEach { it.alignmentLines.usedDuringParentMeasurement = false }         measuredOnce = true         layoutNode.layoutState = LayoutNode.LayoutState.Measuring         measurementConstraints = constraints         val outerWrapperPreviousMeasuredSize = outerWrapper.size         owner.snapshotObserver.observeMeasureSnapshotReads(layoutNode) {             // ⑤ LayoutNodeWrapper 链开始 测量入口             outerWrapper.measure(constraints)         }         ......         return sizeChanged     }     return false } ==================   ⑤ LayoutNodeWrapper 链开始 测量入口 ===================== internal class OuterMeasurablePlaceable(     private val layoutNode: LayoutNode,     var outerWrapper: LayoutNodeWrapper // outerWrapper构造传入 ) // LayoutNode 中初始化 OuterMeasurablePlaceable internal val innerLayoutNodeWrapper: LayoutNodeWrapper = InnerPlaceable(this)     private val outerMeasurablePlaceable = OuterMeasurablePlaceable(this, innerLayoutNodeWrapper)`

最后调用了root的 innerLayoutNodeWrapper的 measure 进行整条LayoutNodeWrapper 链的测量

### outerWrapper 是谁？LayoutNodeWrapper 链 又是什么？

答：在【LayoutNode 的 前世今生】② 绑定modifier，最后实际上调用了LayoutNode的modifier成员属性

的set方法：

js

 代码解读

复制代码

`internal val innerLayoutNodeWrapper: LayoutNodeWrapper = InnerPlaceable(this) private val outerMeasurablePlaceable = OuterMeasurablePlaceable(this, innerLayoutNodeWrapper) override var modifier: Modifier = Modifier     set(value) {         if (value == field) return         if (modifier != Modifier) {             require(!isVirtual) { "Modifiers are not supported on virtual LayoutNodes" }         }         field = value         ...         // ① modifier.foldOut         val outerWrapper = modifier.foldOut(innerLayoutNodeWrapper) { mod, toWrap ->             var wrapper = toWrap             if (mod is RemeasurementModifier) {                 mod.onRemeasurementAvailable(this)             }             val delegate = reuseLayoutNodeWrapper(mod, toWrap)             if (delegate != null) {                 if (delegate is OnGloballyPositionedModifierWrapper) {                     getOrCreateOnPositionedCallbacks() += delegate                 }                 wrapper = delegate             } else {                 // ② 通过判断Modifier类型，将各个modifier操作包装到LayoutNodeWrapper中                 if (mod is DrawModifier) {                     wrapper = ModifiedDrawNode(wrapper, mod)                 }                 if (mod is FocusModifier) {                     wrapper = ModifiedFocusNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is FocusEventModifier) {                     wrapper = ModifiedFocusEventNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is FocusRequesterModifier) {                     wrapper = ModifiedFocusRequesterNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is FocusOrderModifier) {                     wrapper = ModifiedFocusOrderNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is KeyInputModifier) {                     wrapper = ModifiedKeyInputNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is PointerInputModifier) {                     wrapper = PointerInputDelegatingWrapper(wrapper, mod).assignChained(toWrap)                 }                 if (mod is NestedScrollModifier) {                     wrapper = NestedScrollDelegatingWrapper(wrapper, mod).assignChained(toWrap)                 }                 if (mod is LayoutModifier) {                     wrapper = ModifiedLayoutNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is ParentDataModifier) {                     wrapper = ModifiedParentDataNode(wrapper, mod).assignChained(toWrap)                 }                 if (mod is SemanticsModifier) {                     wrapper = SemanticsWrapper(wrapper, mod).assignChained(toWrap)                 }                 if (mod is OnRemeasuredModifier) {                     wrapper = RemeasureModifierWrapper(wrapper, mod).assignChained(toWrap)                 }                 if (mod is OnGloballyPositionedModifier) {                     wrapper =                         OnGloballyPositionedModifierWrapper(wrapper, mod).assignChained(toWrap)                     getOrCreateOnPositionedCallbacks() += wrapper                 }             }             wrapper         }         outerWrapper.wrappedBy = parent?.innerLayoutNodeWrapper         outerMeasurablePlaceable.outerWrapper = outerWrapper         ......     } // 此高阶函数不是很容易理解 override fun <R> foldOut(initial: R, operation: (Modifier.Element, R) -> R): R =         outer.foldOut(inner.foldOut(initial, operation), operation) // 我们稍微转换一下 override fun <R> foldOut(initial: R, operation: (Modifier.Element, R) -> R): R = {     // ③      val inn = inner.foldOut(initial, operation)     outer.foldOut(inn , operation) }    // 递归最后，调用operation回调函数 override fun <R> foldOut(initial: R, operation: (Element, R) -> R): R =     operation(this, initial)`

1.  通过① foldOut 函数我们可以看出，实际上是递归遍历了所有的Modifier操作，然后通过operation 回调函数来转换当前的Modifier和initial值；
    
2.  operation 实际上是将 当前modifier操作和 initial值(即③处inner.foldOut递归值，LayoutNodeWrapper) 包裹进新的LayoutNodeWrapper中，即②处的逻辑；
    
3.  由于递归遍历一直将 当前modifier操作和 initial值包裹进新的LayoutNodeWrapper中，而新的LayoutNodeWrapper又是inner.foldOut的返回值 输入到下一次递归中，因此最后形成了一个LayoutNodeWrapper链结构。
    
4.  由于初始initial值 是InnerPlaceable，因此 整个LayoutNodeWrapper链最终节点就是InnerPlaceable。
    
5.  root的 innerLayoutNodeWrapper 最后实际上已经是经过① foldOut 函数转换过的 outerWrapper 新的LayoutNodeWrapper链 头LayoutNodeWrapper了。
    

Jetpack Compose 绘制流程
--------------------

js

 代码解读

复制代码

`// AndroidComposeView override fun dispatchDraw(canvas: android.graphics.Canvas) {     if (!isAttachedToWindow) {         invalidateLayers(root)     }     measureAndLayout()     isDrawingContent = true     canvasHolder.drawInto(canvas) { root.draw(this) }     ...... } // LayoutNode internal fun draw(canvas: Canvas) = outerLayoutNodeWrapper.draw(canvas) // LayoutNodeWrapper var layer: OwnedLayer? = null // 用于分隔 绘制内容 的层     private set      fun draw(canvas: Canvas) {     val layer = layer     if (layer != null) {         // 隔离层若存在，则执行drawLayer         layer.drawLayer(canvas)     } else {         // 绘制自己或者递归下一个LayoutNodeWrapper链节点绘制         // LayoutNodeWrapper链：【outerWrapper 是谁？LayoutNodeWrapper 链 又是什么？】         val x = position.x.toFloat()         val y = position.y.toFloat()         canvas.translate(x, y)         performDraw(canvas)         canvas.translate(-x, -y)     } } protected abstract fun performDraw(canvas: Canvas) // --------------------------performDraw的实现------------------------- internal open class DelegatingLayoutNodeWrapper<T : Modifier.Element>(     override var wrapped: LayoutNodeWrapper,     open var modifier: T ) : LayoutNodeWrapper(wrapped.layoutNode) {          override fun performDraw(canvas: Canvas) {         // 执行下一个节点绘制         wrapped.draw(canvas)     } } // LayoutNodeWrapper链中最后一个节点，开始遍历绘制子组件 internal class InnerPlaceable(     layoutNode: LayoutNode ) : LayoutNodeWrapper(layoutNode), Density by layoutNode.measureScope {     override fun performDraw(canvas: Canvas) {         val owner = layoutNode.requireOwner()         // 遍历绘制子组件         layoutNode.zSortedChildren.forEach { child ->             if (child.isPlaced) {                 child.draw(canvas)             }         }         if (owner.showLayoutBounds) {             drawBorder(canvas, innerBoundsPaint)         }     } } // 绘制节点 internal class ModifiedDrawNode(     wrapped: LayoutNodeWrapper,     drawModifier: DrawModifier ) : DelegatingLayoutNodeWrapper<DrawModifier>(wrapped, drawModifier), OwnerScope {     override fun performDraw(canvas: Canvas) {         val size = measuredSize.toSize()         if (cacheDrawModifier != null && invalidateCache) {             layoutNode.requireOwner().snapshotObserver.observeReads(                 this,                 onCommitAffectingModifiedDrawNode,                 updateCache             )         }         // 绘制范围         val drawScope = layoutNode.mDrawScope         drawScope.draw(canvas, size, wrapped) {             with(drawScope) {                 with(modifier) {                     // 绘制自己，draw()方法里必会调用drawContent()触发执行下一个节点绘制                     draw()                 }             }         }     } // 绘制范围：从给定的 LayoutNodeWrapper 中提取密度和布局方向信息 // canvasDrawScope 中可向指定的画布和边界发出绘图命令 internal class LayoutNodeDrawScope(     private val canvasDrawScope: CanvasDrawScope = CanvasDrawScope() ) : DrawScope by canvasDrawScope, ContentDrawScope {     private var wrapped: LayoutNodeWrapper? = null     override fun drawContent() {         // 继续绘制下一节点         // "注：若要通过Modifier.drawWithContent自定义，则一定调用此方法，否则绘制链会就此断开！！！"         drawIntoCanvas { canvas -> wrapped?.draw(canvas) }     }     internal inline fun draw(         canvas: Canvas,         size: Size,         LayoutNodeWrapper: LayoutNodeWrapper,         block: DrawScope.() -> Unit     ) {         val previousWrapper = wrapped         wrapped = LayoutNodeWrapper         canvasDrawScope.draw(             LayoutNodeWrapper.measureScope,             LayoutNodeWrapper.measureScope.layoutDirection,             canvas,             size,             block         )         wrapped = previousWrapper     } }`

Jetpack Compose 任重前行
====================

Compose是面向未来的UI框架，我们用一组函数来声明UI，并且一个Compose函数可以嵌套另一个Compose函数，并以树的结构来构造所需要的UI，此树实际上就是`LayoutNode` 树。在Compose的世界中，没有类的概念，全都是函数，并且都是顶层函数，因此不会有任何继承和层次机构问题。

Android中的几乎所有组件都继承于View类（直接或间接继承）。比如EidtText 继承于TextView，而同时TextView又继承于其他一些View,这样的继承机构最终会指向跟View即View.java。并且View.java有非常多的功能。而Compose团队则将整个系统从继承转移到了顶层函数。Textview，EditText，复选框和所有UI组件都是它们自己的Compose函数，而它们构成了要创建UI的其他函数，代替了从另一个类继承。

而我们上面 Compose的基础组件 和 原生组件的 对应表，实际上不能说 是一一对应的，因为两者完全不属于一个层面，只能说实现的效果大致相当。并且有些甚至不能说是 View层次，比如Button：Button实际上在Compose里属于Layout，因为Button可以传入`@Composable` 方法，其内可以通过图片实现。

Jetpack Compose的绘制也比较特殊，通过源码的了解，其绘制也是 Modifier 来实现的，而 `@Composable` 方法主要是用来生成各个LayoutNode 的。Modifier 中包含各种组件属性，比如 大小、内边距、背景、点击、偏移等等，注意Compose中暂时没有Margin即外边距，可能Compose团队不希望设置Margin值，而是应该使用padding值。同时还提供了 状态栏的高度设置 _statusBarsPadding_ _以及底部导航栏高度的设置_ _navigationBarsPadding_

Jetpack Compose 本文只是了解了其平时和原生View相关或者惯性思维的一些内容，对于Compose来说只了解了其一角，并且此文是根据 **1.0.0-beta09** 版本学习分析，目前版本已更新至 **1.0.0-rc02** 甚至后面的正式版本，都可能存在舍弃的api或者新增api等。

Jetpack Compose 优秀文章：

*   【官网】[Jetpack Compose 使用入门](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fjetpack%2Fcompose%2Fdocumentation%3Fhl%3Dzh_cn "https://developer.android.google.cn/jetpack/compose/documentation?hl=zh_cn")
    
*   【入门】[Android Jetpack Compose 最全上手指南](https://juejin.cn/post/6844903999347359751 "https://juejin.cn/post/6844903999347359751")
    
*   [【译】Jetpack Compose,不止是一个UI框架！](https://juejin.cn/post/6844904165408243725 "https://juejin.cn/post/6844904165408243725")
    
*   【原理】[Jetpack Compose 博物馆](https://link.juejin.cn?target=https%3A%2F%2Fdocs.compose.net.cn%2Fprinciple%2Frecomposition_scope%2F "https://docs.compose.net.cn/principle/recomposition_scope/")
    
*   【谷歌开发者】[深入详解 Jetpack Compose | 优化 UI 构建](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAwODY4OTk2Mg%253D%253D%26chksm%3D808cf5b6b7fb7ca0fb12604578387cf1cf0c7d7d1847499e50b3700c4039c35adb6e806406b9%26idx%3D1%26mid%3D2652067315%26scene%3D21%26sn%3Db003ced0f0c86684c5189d31a6a77f92%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzAwODY4OTk2Mg%3D%3D&chksm=808cf5b6b7fb7ca0fb12604578387cf1cf0c7d7d1847499e50b3700c4039c35adb6e806406b9&idx=1&mid=2652067315&scene=21&sn=b003ced0f0c86684c5189d31a6a77f92#wechat_redirect")
    
*   【谷歌开发者】[深入详解 Jetpack Compose | 实现原理](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAwODY4OTk2Mg%3D%3D%26mid%3D2652068391%26idx%3D1%26sn%3D29c63fb6af42c03450b59133d1f6acb3%26chksm%3D808cfa62b7fb7374f2c1240c1eda4046afe9bd187784d792e011c402347a233ea4bebd5a371b%26scene%3D178%26cur_album_id%3D1355322955810799617%23rd "https://mp.weixin.qq.com/s?__biz=MzAwODY4OTk2Mg==&mid=2652068391&idx=1&sn=29c63fb6af42c03450b59133d1f6acb3&chksm=808cfa62b7fb7374f2c1240c1eda4046afe9bd187784d792e011c402347a233ea4bebd5a371b&scene=178&cur_album_id=1355322955810799617#rd")
    
*   [Jetpack Compose 1.0 正式发布！打造原生 UI 的 Android 现代工具包](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FlkQ7AMVRulf-c02-Niju7g "https://mp.weixin.qq.com/s/lkQ7AMVRulf-c02-Niju7g")