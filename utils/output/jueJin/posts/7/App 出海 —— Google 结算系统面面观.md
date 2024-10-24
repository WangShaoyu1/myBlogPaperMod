---
author: ""
title: "App 出海 —— Google 结算系统面面观"
date: 2022-04-28
description: "对于出海业务，Google 应用内支付是必不可少的支付渠道。但即使官方文档中对如何接入 Google 应用内支付做了基本阐述，在接入的过程中，还是会遇到很多问题。本文将介绍交易的重点流程和核心技术要点"
tags: ["Android","Google中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:75,views:3806,"
---
> 图片来源：[unsplash.com/photos/rQRK…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2FrQRKEu9HnZo "https://unsplash.com/photos/rQRKEu9HnZo")

> 本文作者：[zoulp](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzouliping "https://github.com/zouliping")

近年来中国移动应用出海势头良好。对于涉及到**交易业务**的出海应用来说，Google 应用内支付是必不可少的支付渠道。不同于国内相对完善的移动支付体系，即使官方文档中对如何接入 Google 应用内支付做了基本阐述，但是在接入的过程中，还是会遇到很多问题。本文将介绍交易的重点流程和核心技术要点，以及需要注意的问题。

接入过程
----

### 名词解释

首先解释三对概念来帮助理解 Google 支付的逻辑。

**一次性商品 vs 订阅型商品**

**一次性商品**是通过单次购买获得的商品。一次性商品又分为**消耗型商品**和**非消耗型商品**，消耗型商品顾名思义是可以被消耗的商品，例如 App 提供的金币或虚拟货币，用户可以重复购买。非消耗型商品是通过一次购买可以得到的永久权益，例如付费升级的内容。

**订阅型商品**是指会定期发生购买行为的商品，如会员服务等，订阅会自动续期，直至取消。

本文的讨论仅限于**消耗型商品**，不涉及其他类型的商品。

**Consume vs Acknowledge**

Consume 和 Acknowledge 均有完成支付后进行确认的含义，但两者并不完全相同。

**Acknowledge** 是实际意义上的确认操作，进行了 Acknowledge 会使得订单不被退款，Acknowledge 可由[客户端 API acknowledge()](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fcom%2Fandroid%2Fbillingclient%2Fapi%2FBillingClient%23acknowledgePurchase\(com.android.billingclient.api.AcknowledgePurchaseParams%2C%2520com.android.billingclient.api.AcknowledgePurchaseResponseListener\) "https://developer.android.google.cn/reference/com/android/billingclient/api/BillingClient#acknowledgePurchase(com.android.billingclient.api.AcknowledgePurchaseParams,%20com.android.billingclient.api.AcknowledgePurchaseResponseListener)") 执行，也可由 [Google 服务端 API acknowledge()](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.cn%2Fandroid-publisher%2Fapi-ref%2Frest%2Fv3%2Fpurchases.products%2Facknowledge "https://developers.google.cn/android-publisher/api-ref/rest/v3/purchases.products/acknowledge") 完成。 Google 会对已支付但未确认的订单在三天后进行自动退款处理。

**Consume** 是专门针对消耗型商品的操作，Consume 不仅包含确认的含义，并使得商品可以重复购买。Consume 可以看成是包含了 Acknowledge 操作，Consume 仅可由[客户端 API consumeAsync()](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fcom%2Fandroid%2Fbillingclient%2Fapi%2FBillingClient%23consumeasync "https://developer.android.google.cn/reference/com/android/billingclient/api/BillingClient#consumeasync") 完成，不能通过服务端 API 进行。

**业务服务端 vs Google 服务端**

本文中将多次提到关于服务端的操作，分别使用**业务服务端**和 **Google 服务端**来进行区分，避免混淆。业务服务端指的是 App 业务逻辑的服务端。Google 服务端在本文特指 Google 应用内支付的服务端，由 Google 提供。

### 交易流程概览

从业务的角度出发，一次交易流程可以大体用下图表示：

![https://p5.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13211245181/0261/e4ee/a827/33c0931dec2ed68844aff39b367e5638.png](/images/jueJin/33c0931dec2ed68.png)

但在实际交易的过程中，充满了不确定的因素，如用户的网络环境不稳定、误操作等等。由于交易业务的敏感性，既不能让用户多付钱，也不能少付、错付。因此需要全面考虑各种可能出现的情况，对可能导致订单和支付状态异常的因素做充分的考量和处置。站在技术的视角，完整的交易流程如下：

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13250165151/35cd/03e6/3bdb/da476a0ebc7220fb7682441e1ed77e61.png](/images/jueJin/da476a0ebc7220f.png)

### 交易重点流程详解

**创建订单**

创建订单这里指的是创建业务服务端的订单。订单创建完成后，会将业务订单 ID 和 对应的 Google 商品 ID 传递到后续的步骤中。业务服务端会管理维护自身的商品以及订单，这与 Google 的商品和订单并不相同，且需要建立和维护它们之间的关联关系。

**建立连接**

在进行 Google 支付前，需要与 Google Play 建立连接，连接的桥梁是 BillingClient。BillingClient 是 Google Play Billing Library 提供的重要工具，支付相关的操作都与之有关。倘若由于网络等原因连接断开，必须要重连才能继续后续操作。

**查询商品**

对于一个商品，需要提前在 Google 后台完成创建。查询商品是查询 Google 后台配置的商品信息，确认商品的信息无误，取得商品详情，为发起支付提供必要的数据。

**发起支付**

发起支付是通过 BillingClient 的 API `launchBillingFlow()` 调用 Google 的支付界面，此时对应的 Google 支付的服务端订单被创建。业务服务端订单和 Google 服务端订单需关联起来，常规的方式是客户端在后续发起订单校验时，告知业务服务端对应 Google 订单 ID，现实中客户端可能由于某些原因没有收到支付结果，在由 Google 开发者实时通知回调业务服务端的场景下，同样需要足够的信息来关联。在这里将业务服务端 ID 通过混淆的方式传入，目的是使得业务服务端凭借混淆 ID 将 Google 订单和业务服务端订单关联起来，完成后续的确认和履约。

**订单确认**

收到支付成功的回调后，客户端主动调用 BillingClient 提供的 `consumeAsync()`方法，确保订单已确认不被退款，并且可再次被购买。对于未确认的订单，Google 会在三天后自动退款。此外，需要主动向业务服务端发起订单的检查。

**订单履约**

按照流程，客户端发起订单的校验，服务端确认了订单的有效无误后需要进行履约，业务上通常表现为发放金币、余额增加等。服务端必须保证此操作的**幂等性**，履约一次且仅且履约一次，这是订单补偿机制的前提。

**订单补偿**

一个支付的流程可能被打断，需要重点关注的是是用户支付完成但是没有收到权益的情况，此过程容易造成客诉，需要通过 **订单补偿** 作为兜底。

订单补偿分为两个场景，一个是业务服务端通过 Google 提供的实时开发者通知，接收到 Pub/Sub 消息，得知订单支付状态发生变化，此时检查订单的状态，若是未履约态，会进行履约保障用户的权益，并且调用服务端 acknowledge API 确认订单，确保不出现自动退款而造成资损的情况。

另一个场景是由客户端主动发起订单补偿机制，在合适的时机，获取已支付但未确认的订单进行后续的 Consume 和履约过程。主动补偿可以在启动 App、进入充值购买页面等多个时机进行，可根据业务场景自行决定。同时也会将第一种场景逻辑完善，第一个场景下服务端 Acknowledge 完成，权益得到发放，但是该商品却无法再次购买，此时由客户端完成 Consume，使得商品可重复购买，形成整体逻辑的闭环。

技术实现
----

![https://p5.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13211034378/455e/3689/d4d5/3a169de7485c7e2bdced5c2631fe708e.png](/images/jueJin/3a169de7485c7e2.png)

交易流程的一个重要的特点是事件驱动。在技术上表现为，需要在大量的回调方法中决定下一步的操作。按照面向过程的方式，代码会层层回调嵌套。这样的代码逻辑不够清晰、难以理解，无数的回调会导致异常处理复杂，排查问题也比较困难。为了解决这个问题，可以将整个交易流程看成是一个 pipeline，将每一步抽象成子模块。

Google Play Billing Library 直接提供的回调是无法组成 pipeline 的，需要进行一层转换。Kotlin Coroutine 提供的 CallbackFlow 是一个 Flow 构建器，可以将基于回调的 API 转换成 Flow。

### 逻辑封装

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13200827987/2b92/0b0f/44b7/4fc22901ce8c123430a8530d9261ebcb.png](/images/jueJin/4fc22901ce8c123.png)

整个交易的流程拆分层若干的子模块，使得子模块是可衔接和可复用的。每个子模块有特定的输入和输出，上一个子模块的输出是下一个子模块的输入，例如查询商品子模块的输出是商品详情信息，而商品详情作为发起支付的输入，展示在输入面板上。并且，每个子模块需保证自身逻辑内聚，仅关心当前流程需要完成的工作，不关心接下来的流程。

我们将拆分后的独立的子模块包装成 CallbackFlow。操作成功后通过 offer 方法在协程外发送数据到后续的 Flow 中，出现错误可以终止 close() 或取消 cancel() 当前 Flow。拆分的颗粒度由操作和回调共同决定，原则是模块功能单一且内聚。此外，在整个操作过程中，都需要用到 BillingClient 的实例，输入时将传递该实例。

```kotlin
fun queryPurchasesFlow(client: BillingClient?): Flow<List<Purchase>> =
    callbackFlow {
    client?.queryPurchasesAsync(
    BillingClient.SkuType.INAPP
    ) { p0, p1 ->
        when (p0.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
            // emit the value to the flow
            offer(p1)
        }
            else -> {
            // close the flow
            close()
        }
    }
}

    awaitClose {
    // log & release resources
}
}
```

### pipeline 组建

在完成单个操作的封装后，需要将这些 Flow 组装起来。CallbackFlow 提供了操作符用于串联和转换 Flow，其中 [flatMapConcat](https://link.juejin.cn?target=https%3A%2F%2Fkotlin.github.io%2Fkotlinx.coroutines%2Fkotlinx-coroutines-core%2Fkotlinx.coroutines.flow%2Fflat-map-concat.html "https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-concat.html") 是对上游的元素进行转换、拍扁并返回新的 Flow。flatMapConcat 是适用于当前场景的。一个串联的例子如下，通过建立 Google 连接后，获取商品的信息，校验无误后调用支付面板。

```kotlin
    startConnectionFlow(client).flatMapConcat {
    querySkuDetailFlow(client, request)
        }.flatMapConcat {
        launchBillingFlow(activity, client, it, request)
        }.catch { e ->
        // catch exception
        e.printStackTrace()
            }.collect {
            processNext(it)
        }
```

此外，还可以灵活的编配 Flow，以实现不同的业务逻辑。订单补偿流程和正常的支付流程不完全相同，需要重新编排对应的 Flow，相同的流程可以与支付逻辑复用，无需重新开发。

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13176784898/a09e/1979/1224/a7667f5df45dd74570717365f150606b.png](/images/jueJin/a7667f5df45dd74.png)

### 整体设计

Google 支付作为一个核心业务组件提供给 App 的其他模块使用，其特点是接入方便、接口简单。其组件的架构如下：

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13212561063/5a95/6fe2/b5ae/7b95ef0c7074d26f1f4441f23493cebf.png](/images/jueJin/7b95ef0c7074d26.png)

产品层：支付的调用方可以是不同形态的收银台，Web 收银台和 Native 收银台。

接口层：支付组件对外提供接口简单，支付发起和订单补偿。

管理层：控制器下有数据管理和连接管理。数据管理是管理订单和商品相关的数据。连接管理是管理 Google 提供的 BillingClient，在合适的时机断开连接。

核心层：核心层包含业务的核心逻辑，包括建立连接、获取商品等。并且包含支付模块的日志与监控。

支撑层：依托于 App 现有的底层基础功能。

踩坑总结
----

### 获取商品详情为空

```kotlin
billingClient.querySkuDetailsAsync(params) { p0, p1 ->
    when (p0.responseCode) {
        BillingClient.BillingResponseCode.OK -> {
        // p1 is empty
    }
}
}
```

在早期调试的过程中，出现通过 google sku id 使用 querySkuDetailsAsync() 获取到商品信息为空的情况，经过排查找到了几个影响点。

*   需要**发布内测版本**，根据 Google Console 的要求发布一个内测版本，无需等待审核通过。
*   **商品创建存在一定的延迟**，在从未成功调试支付的初期，会出现短暂的延迟，即创建商品的当下无法获取，间隔一段时间后成功获取。这个情况后续未出现。
*   **包名、签名不匹配**，需要使用上传 PlayStore 配置的包名和签名，不需使用提交的同一个包，但是包名和签名一定要匹配。

### 无法购买您要买的商品

![https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/13250189687/cfd3/3552/318a/35ea794365d6923048b36eed647622ae.png](/images/jueJin/35ea794365d6923.png)

出现无法购买您要买的商品提示，可能的原因有：

*   检查测试用户是否在**内测用户**列表和**许可测试**列表。
*   需要登录内测的账号，点击**接受测试邀请链接**，接受邀请。

### 必要条件

成功完成一次支付，总结起来需要注意以下这些点。

*   测试机的 **Google Services Framework** 已安装。
*   Google PlayStore 检测 IP **非国区**。依赖于网络环境，也可在 Google PlayStore 设置国家（不是必选项）。
*   测试账号已添加到谷歌后台，包括**内测用户**添加和**许可测试**添加，两者都需要添加。
*   接受测试邀请，找到内测链接，点击**接受内测邀请**，这一步很重要，容易遗漏。
*   发布**内测版本**，应用发布状态，无需等待审核通过。
*   **安装包签名和包名**与提交到 Google 后台的签名**一致**。
*   Google PlayStore 的**版本更新**。

最后
--

交易业务的特殊性和重要性不言而喻。无论是保障 App 的营收，还是准确执行用户的交易意愿，避免客诉，都要求交易业务尽可能把各种场景考虑完善。对开发者来说，不仅要对整个下单、支付的业务流程了然于心，还要通过技术手段，将业务流程抽象，将复杂多变的业务场景和逻辑分支，实现为灵活的编排，提高系统整体的可维护性、健壮性。

本文首先对交易流程进行简明扼要的介绍，之后借助 Kotlin Coroutine 的 CallbackFlow 来实现业务链路的灵活编排，将层层嵌套的回调和事件通知转为流式、线性的写法。但即便如此，还是不能覆盖到真实场景中的全部异常情况，除了订单补偿的机制外，还需要通过自动化、智能化的手段，分析每一个交易失败的 case，并建设完备的监控和报警机制，不断总结提高，这是后续需要持续投入的地方。

受限于篇幅，不能将每一个点进行详尽的介绍，欢迎读者留言探讨。

参考链接
----

*   [Google Play’s billing system overview](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fgoogle%2Fplay%2Fbilling "https://developer.android.google.cn/google/play/billing")
*   [Integrate the Google Play Billing Library into your app](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Fgoogle%2Fplay%2Fbilling%2Fintegrate "https://developer.android.google.cn/google/play/billing/integrate")
*   [play-billing-samples](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fandroid%2Fplay-billing-samples "https://github.com/android/play-billing-samples")
*   [Is it possible acknowledge consumable products from server side?](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fandroid%2Fplay-billing-samples%2Fissues%2F341%23issuecomment-676765032 "https://github.com/android/play-billing-samples/issues/341#issuecomment-676765032")
*   [图解 Monad](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F07%2Fmonad.html "https://www.ruanyifeng.com/blog/2015/07/monad.html")
*   [Functors, Applicatives, And Monads In Pictures](https://link.juejin.cn?target=https%3A%2F%2Fadit.io%2Fposts%2F2013-04-17-functors%2C_applicatives%2C_and_monads_in_pictures.html "https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html")
*   [CompletableFuture](https://link.juejin.cn?target=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2F8%2Fdocs%2Fapi%2Fjava%2Futil%2Fconcurrent%2FCompletableFuture.html "https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html")
*   [ListenableFutureExplained](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgoogle%2Fguava%2Fwiki%2FListenableFutureExplained "https://github.com/google/guava/wiki/ListenableFutureExplained")
*   [Kotlin flows on Android - Convert callback-based APIs to flows](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Fkotlin%2Fflow%23callback "https://developer.android.com/kotlin/flow#callback")
*   [Simplifying APIs with coroutines and Flow](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fandroiddevelopers%2Fsimplifying-apis-with-coroutines-and-flow-a6fb65338765 "https://medium.com/androiddevelopers/simplifying-apis-with-coroutines-and-flow-a6fb65338765")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！