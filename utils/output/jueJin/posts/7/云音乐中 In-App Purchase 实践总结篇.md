---
author: ""
title: "云音乐中 In-App Purchase 实践总结篇"
date: 2023-05-17
description: "In-App Purchase (简称IAP)是苹果提供在 App 内进⾏购买⽀付的方式 。本文介绍IAP使用整体流程及内部使用的基础库 NEStoreKit，并总结IAP使用经验以及常见问题。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:45,comments:17,collects:84,views:10298,"
---
> 本文作者：[0linatan0](https://juejin.cn/user/2612095357316494 "https://juejin.cn/user/2612095357316494")

IAP主要说明
=======

内购项目
----

开发者接入 IAP 时，需要按照苹果提供的规范，根据 App 提供商品的功能和类型来选择不同的内购项目类型，进行创建商品。相当于在我们业务服务端有一份商品列表，苹果 AppStoreConnect 也有一份商品列表与之对应。目前 IAP 中内购项目分为四类：

1.  Consumable products （消耗型商品）
    *   比如：Look 直播中的音符
    *   同一个 AppleID 可以购买多次，即买即用
2.  Non-consumable products （非消耗型商品）
    *   比如：解锁App中功能关卡
    *   同一个 AppleID 只能购买一次，再次购买会提示"已购买", 永久有效
3.  Auto-renewable subscriptions （自动续期订阅）
    *   比如：云音乐中黑胶会员连续包月
    *   同一 Apple ID 在购买时会检查是否购买过，如果购买过并且还在续期权限中，系统会提示已购买而无法再购买；如果购买过之后取消过，则可以再次购买
4.  Non-renewable subscriptions （非续期订阅）
    *   比如: 月度/季度/年度 会员
    *   同一 Apple ID 可以购买多次，可以再次购买，权益受期限限制

![IAP商品](/images/jueJin/ce442d085b993a0.png)

创建管理IAP商品
---------

选择商品类型后，AppStore Connect 中创建商品，以消耗型商品创建为例，需要提供如下信息：

1.  product identifier : 标识商品的ID
    *   在此应用下是唯一的，只要创建过即使删除也会存在
2.  price ： 根据苹果提供的价格等级，不能随意填写金额
    *   会出现同一等级对应不同国家的 AppleID 账号价格换算差异大
3.  商品描述
    *   支持多种语言，会根据 AppleID 所在地区展示
4.  截图&操作路径【送审需要】

具体操作手册参见[Create in-app purchases](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fhelp%2Fapp-store-connect%2Fmanage-consumable-and-non-consumable-in-app-purchases%2Fcreate-in-app-purchases "https://developer.apple.com/help/app-store-connect/manage-consumable-and-non-consumable-in-app-purchases/create-in-app-purchases")

项目实现IAP购买
---------

开发者需要接入系统库 StoreKit，苹果在 WWDC21 推出新的 StoreKit2 支持购买，但其需要 iOS15 及以上才支持，目前我们项目中还是使用老的 StoreKit 。

对于 IAP 购买支付的过程是苹果系统处理，只是在交易完成之后，更新本地的交易票据信息并回调 App （票据可以理解为包含交易支付相关信息的加密数据），而对于这份数据是可能会重复或者伪造；需要对其进行验证，苹果提供两种方式：本地验证和服务端验证；一般出于安全性和功能考虑会选用服务端验证。服务端会拿着这份票据再去请求苹果服务端，获取交易支付的详细信息，根据信息判断处理履约情况。

### 流程图

整体流程结构如下图： ![IAP交互流程图](/images/jueJin/10139b0acda8f54.png)

自动订阅类型的商品因为涉及到下个周期代扣履约的情况，会多一些处理，一是服务端可以通过 [App Store Server Notifications](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fhelp%2Fapp-store-connect%2Fconfigure-in-app-purchase-settings%2Fenter-server-urls-for-app-store-server-notifications "https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/enter-server-urls-for-app-store-server-notifications")接收订阅续期的情况；二是 App 在启动时收到苹果关于续期成功的票据更新回调。

### 主体逻辑

1.  通过ProductId请求获取具体的商品信息

```objectivec
SKProductsRequest *productRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:[NSSet setWithObject:self.productIdentifier]];
request.delegate = self;
....
[request start];

//SKRequestDelegate callback
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{....}
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error{....}
```

IAP Product 是在 AppStoreConnect 中配置，是与我们的App对应。特别需要注意的是在测试包App被重签名时，将会获取不到对应的 IAP 商品信息。

2.  发起支付

```ini
SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:self.product];
payment.quantity = MAX(_quantity,1);
payment.applicationUsername = self.userIdentifier;
[[SKPaymentQueue defaultQueue] addPayment:payment];
```

IAP 支持批量购买，但支持的最大数量是 10 ，具体说明参见 [SKMutablePayment——quantity](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fstorekit%2Fskpayment%2F1506077-quantity "https://developer.apple.com/documentation/storekit/skpayment/1506077-quantity")

3.  支付完成后，StoreKit 处理支付，返回此次交易信息

```objectivec
//需要监听Payment Queue，建议是在didFinishLaunchingWithOptions:时就增加监听
[[SKPaymentQueue defaultQueue] addTransactionObserver:self];

//处理回调事件
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
    {
    for (SKPaymentTransaction *transaction in transactions)
        {
        switch (transaction.transactionState)
            {
            case SKPaymentTransactionStatePurchased:
            //购买完成...
            break;
            case SKPaymentTransactionStateFailed:
            //交易失败...
            break;
            case SKPaymentTransactionStateRestored:
            //恢复交易...
            break;
            case SKPaymentTransactionStatePurchasing:
            //交易正在进行..
            break;
            default:
            break;
        }
    }
}
```

4.  交易完成后，获取小票信息，请求服务端进行票据验证

```objectivec
//获取小票
NSData *receiptData = [NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]];

//请求服务端验证
....

//交易完成
[[SKPaymentQueue defaultQueue] finishTransaction:transaction];
```

### 服务端票据验证

1.  调用苹果服务端的票据验证接口

```arduino
沙盒环境: https://sandbox.itunes.apple.com/verifyReceipt

正式环境: https://buy.itunes.apple.com/verifyReceipt
```

沙盒环境不需要真实购买，在 AppStoreConnect 创建沙盒测试账号，可以模拟支付。

正式环境是针对 AppStore 上架的应用内购买，如果将沙盒环境小票发送到正式环境验证，会收到 21007 的 Status Code

2.  请求参数格式

```json
    {
    "receipt-data":"xxxxx",   //客户端本地的小票数据
    "password":"xxxxxx"       //可选，自动订阅设置时在 AppStoreConnect 生成的密钥（无自动订阅时不需要）
}
```

可以看到验证请求接口没有过多限制，只要是真实的小票数据，就可以通过验证接口请求返回结果，这也对服务端对票据结果的真实可靠性需要做完备的校验

3.  返回的结果

```json
//消费型商品购买验证结果
    {
        "receipt": {
        "receipt_type": "Production",   //交易产生的环境
        "adam_id": 0,
        "app_item_id": 0,
        "bundle_id": "xxxxxxx",     //小票归属的 App bundleId
        "application_version": "0",
        "download_id": 0,
        "version_external_identifier": 0,
        "receipt_creation_date": "2023-02-22 11:02:52 Etc/GMT",
        "receipt_creation_date_ms": "1677063772000", //生成小票的时间戳
        "receipt_creation_date_pst": "2023-02-22 03:02:52 America/Los_Angeles",
        "request_date": "2023-02-24 04:20:38 Etc/GMT",
        "request_date_ms": "1677212438488",
        "request_date_pst": "2023-02-23 20:20:38 America/Los_Angeles",
        "original_purchase_date": "2022-12-16 05:46:18 Etc/GMT",
        "original_purchase_date_ms": "1671169578000",
        "original_purchase_date_pst": "2022-12-15 21:46:18 America/Los_Angeles",
        "original_application_version": "0",
        "in_app": [ //所有交易小票信息
            {
            "quantity": "1",
            "product_id": "xxxxxxxxx.xxxx.xxxx",    //交易商品的标识符
            "transaction_id": "470001434498518", //每次交易发生产的唯一标识符
            "original_transaction_id": "470001434498518",//原始购买的交易标识符，自动续费下次代扣发生交易，改址不变
            "purchase_date": "2023-02-22 11:02:52 Etc/GMT",
            "purchase_date_ms": "1677063772000", //购买时间戳
            "purchase_date_pst": "2023-02-22 03:02:52 America/Los_Angeles",
            "original_purchase_date": "2023-02-22 11:02:52 Etc/GMT",
            "original_purchase_date_ms": "1677063772000",
            "original_purchase_date_pst": "2023-02-22 03:02:52 America/Los_Angeles",
            "is_trial_period": "false",
            "in_app_ownership_type": "PURCHASED"
        }
    ]
    },
    "environment": "Production", //票据产生环境，Sandbox/Production
    "status": 0  //标识票据是否合法
}
``````json
//自动订阅商品购买验证结果
    {
    "status": 0,
    "environment": "Production",
        "receipt": {
        "receipt_type": "Production",
        "adam_id": 0,
        "app_item_id": 0,
        "bundle_id": "xxxxxx",
        "application_version": "0",
        "download_id": 0,
        "version_external_identifier": 0,
        "receipt_creation_date": "2019-05-15 12:00:08 Etc/GMT",
        "receipt_creation_date_ms": "1557921608000",
        "receipt_creation_date_pst": "2019-05-15 05:00:08 America/Los_Angeles",
        "request_date": "2019-06-03 08:47:04 Etc/GMT",
        "request_date_ms": "1559551624568",
        "request_date_pst": "2019-06-03 01:47:04 America/Los_Angeles",
        "original_purchase_date": "2018-08-26 03:28:11 Etc/GMT",
        "original_purchase_date_ms": "1535254091000",
        "original_purchase_date_pst": "2018-08-25 20:28:11 America/Los_Angeles",
        "original_application_version": "0",
            "in_app": [{
            "quantity": "1",
            "product_id": "xxxxxxxxxxx",
            "transaction_id": "370000374840125",
            "original_transaction_id": "370000374840125",
            "purchase_date": "2019-05-15 11:59:38 Etc/GMT",
            "purchase_date_ms": "1557921578000",
            "purchase_date_pst": "2019-05-15 04:59:38 America/Los_Angeles",
            "original_purchase_date": "2019-05-15 11:59:40 Etc/GMT",
            "original_purchase_date_ms": "1557921580000",
            "original_purchase_date_pst": "2019-05-15 04:59:40 America/Los_Angeles",
            "expires_date": "2019-06-15 11:59:38 Etc/GMT",
            "expires_date_ms": "1560599978000",
            "expires_date_pst": "2019-06-15 04:59:38 America/Los_Angeles",
            "web_order_line_item_id": "370000115213929",
            "is_trial_period": "false",
            "is_in_intro_offer_period": "true"
        }]
        },
        "latest_receipt_info": [{ //除已完成的消费型商品以外的所有交易信息
        "quantity": "1",
        "product_id": "xxxxxxxxx.xxxx.xxxx",
        "transaction_id": "370000374840125",
        "original_transaction_id": "370000374840125",
        "purchase_date": "2019-05-15 11:59:38 Etc/GMT",
        "purchase_date_ms": "1557921578000",
        "purchase_date_pst": "2019-05-15 04:59:38 America/Los_Angeles",
        "original_purchase_date": "2019-05-15 11:59:40 Etc/GMT",
        "original_purchase_date_ms": "1557921580000",
        "original_purchase_date_pst": "2019-05-15 04:59:40 America/Los_Angeles",
        "expires_date": "2019-06-15 11:59:38 Etc/GMT",
        "expires_date_ms": "1560599978000",
        "expires_date_pst": "2019-06-15 04:59:38 America/Los_Angeles",
        "web_order_line_item_id": "370000115213929",
        "is_trial_period": "false",
        "is_in_intro_offer_period": "true"
        }],
        "latest_receipt": "xxxxxxxxxxx latest_receipt_info xxxxxxxxxxxxx",  //只包含自动续费相关票据
        "pending_renewal_info": [{  //自动续费具体状态和内容
        "auto_renew_product_id": "xxxxxxxxx.xxxx.xxxx",
        "original_transaction_id": "370000374840125",
        "product_id": "xxxxxxxxx.xxxx.xxxx",
        "auto_renew_status": "1"
    }]
}
```

所有字段的含义可以参见[App Store Receipts responseBody](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstorereceipts%2Fresponsebody "https://developer.apple.com/documentation/appstorereceipts/responsebody")

可以看到返回结果中包含交易的详细信息，但没有和我们 App 内部相关的，需要服务端解析这些信息处理，将权益发放给用户，因此也会产生较多的问题

主要问题
----

从上述流程中发现，IAP 商品交易支付是在系统内部流转，对于 App 只有发起和交易结果回调的感知，而最终交易结果需要依托客户端像服务端发起票据验证请求，获取到结果再和自身服务做匹配履约；服务端无法主动向苹果请求订单结果。

因此在实际应用场景中会遇到各种问题：

1.  向苹果请求商品信息获取失败
    *   一般是网络的原因，但是这种会导致用户无法再进行下一步支付
    *   优化方法是请求到商品信息，会进行缓存，下一次支付直接获取商品信息
2.  票据验证请求慢，经常超时
    *   优化方式：服务端接入海外代理
3.  苹果交易和我们服务订单号如何匹配
    *   客户端会本地记录 IAP 商品和订单号的数据，当收到回调时，根据交易中 ProductId 获取对应的订单号，一并带到服务端请求验证
    *   如果因为某些原因未获取到订单号，服务端可以根据票据交易信息在订单系统中向前回溯适用的订单进行履约
4.  Apple 已扣款，但 App 中权益未到账
    *   网络抖动、客户端票据丢失无法向服务端发起请求验证等情况都有可能导致该问题
    *   优化方式：
        *   客户端获取到小票交易信息存储本地，如果验证未完成，定时向服务端发起验证
        *   提供用户手动发起验证入口，刷新本地小票数据，向服务端发起验证
        *   完善每个阶段的日志，便于追溯交易行为
5.  自动续费下个周期代扣问题
    *   有如下途径可以让服务端感知到扣费时间
        *   服务端可以通过 Apple Server-To-Server Notification 接收消息
        *   客户端收到 StoreKit 扣款成功回调，带上本地票据信息请求服务端处理
    *   但因为服务端回调有时不稳定以及依赖设备开启状态，还有一种方式是服务端保存已签约用户的小票数据，在到期前通过这批旧小票向苹果服务端请求续费状态

NEStoreKit
==========

针对上述提到的问题进行解决，也伴随着云音乐多个产品线开发上线，接入 IAP 需求也在增加，因此我们开发了基础库 NEStoreKit，对业务流程进行抽象，方便各团队快速接入；保障支付履约完成，完善交易场景，记录各个阶段交易日志，对问题有效排查。

整体结构
----

![整体结构](/images/jueJin/2dbd0baf5aae187.png)

将 IAP 交易处理逻辑封装在内部，回调的交易信息包装成 Task，放入队列中，依次交由 Verifier 请求服务端进行验证。

### SDK外部使用

```objectivec
//配置
NEStoreConfig *storeConfig = [NEStoreConfig new];
storeConfig.verifyRequestUrl = xxxx
//重试验证回调处理
    storeConfig.silentVerifyCompletionBlock = ^(NEStorePaymentResult *paymentResult) {
    };
    //取消购买回调
        storeConfig.cancelPaymentBlock = ^(NEStorePaymentResult *paymentResult, SKPaymentTransaction *transaction) {
        //...
        };
        [[NEStoreManager defaultManager] setConfig:storeConfig];
        
        //发起购买调用
        - (void)makePayment:(NSString *)productIdentifier
        quantity:(NSInteger)quantity
        userIdentifier:(nullable NSString *)userIdentifier
        userInfo:(nullable NSDictionary *)userInfo
        success:(nullable NEPaymentCompletionBlock)success
        failure:(nullable NEPaymentCompletionBlock)failure;
```

IAP票据结果的可靠性
-----------

1.  沙盒环境权益发放的隔离
    *   审核版本（ TestFlight 包）App 运行的是正式环境，IAP内购走的是沙盒环境，不需要真实支付，会导致一批没有真实支付的账号兑现线上权益；
    *   需要对这部分票据验证完成的权益发放进行限制，行为可追溯；非审核期间关闭正式环境的沙盒校验
2.  票据结果解析的可靠性
    *   因为票据信息依赖于客户端发起请求，有概率会被假冒，服务端需要校验结果合法性
        *   bundle\_id： 检查是不是自家 App 产生票据（不同的 bundle\_id 下是可以创建相同 product\_id 内购项目，苹果验证请求只返回结果，不会做任何校验）
        *   交易信息的检查
            *   product\_id 、purchase\_date\_ms : 和App端订单系统比对 IAPProductId，下单时间
            *   transaction\_id 、original\_transaction\_id : 标识交易的唯一性（非自动订阅在 restore 之后会生成新的交易，transaction\_id 会更改，original\_transaction\_id 不变）
            *   web\_order\_line\_item\_id：自动订阅时才会生成，标识交易的唯一性（因为一份自动订阅，original\_transaction\_id 是相同的，transaction\_id 也会因为 restore 会生成不一样，防止重复使用，只能用这个）
3.  退款问题
    *   大量退款，涉及到对外结算对账会比较头疼，可以接入处理苹果提供的[App Store Server Notifications](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreservernotifications "https://developer.apple.com/documentation/appstoreservernotifications")中返回的 `REFUND` 类型
4.  现实应用中还会遇到其他各种问题，客户端有详尽的各阶段日志， 服务端保留上传的小票信息，风控处理，接入苹果查询支付相关的 API

StoreKit2
---------

苹果在WWDC2021提出的针对IAP的全新设计，[Meet StoreKit 2](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2021%2F10114%2F "https://developer.apple.com/videos/play/wwdc2021/10114/")

1.  客户端：API是使用Swift5.5特性 async/await 进行开发，iOS15及以上
    *   返回的ProductInfo信息更全面
        *   productType，subscription，jsonRepresentation
    *   MakePayment时支持传入 appAccountToken ，**可以将AppleId和App中账户对应**（不会像 applicationUserName 那样容易丢了）
    *   苹果自动校验 Transaction 的合法性，但对于我们还是会需要通过服务端去校验
    *   支持查看历史账单：这个和设置里看账单历史是对应的，但只能看非消耗型、订阅和自动订阅的
    *   支持查看订阅信息：最近交易信息，订阅状态，自动订阅补充信息
2.  服务端
    *   基于JWS(JSON Web Signature)新Server API
        *   [LookUpOrderId API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreserverapi%2Flook_up_order_id "https://developer.apple.com/documentation/appstoreserverapi/look_up_order_id") : 根据用户提供的苹果账单上的invoice order ID
        *   [Get Refund History](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreserverapi%2Fget_refund_history "https://developer.apple.com/documentation/appstoreserverapi/get_refund_history"): 传入用户某次的originTransactionId可以查询历史退款
        *   [Get All Subscription Statuses](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreserverapi%2Fget_all_subscription_statuses "https://developer.apple.com/documentation/appstoreserverapi/get_all_subscription_statuses")
    *   Apple server Notification V2 [文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreservernotifications%2Fenabling_app_store_server_notifications "https://developer.apple.com/documentation/appstoreservernotifications/enabling_app_store_server_notifications")
        *   V1 返回是jsonObj
        *   V2 返回的是用jws数据格式

### Origin StoreKit vs StoreKit2

1.  所有交易信息是互通的
2.  原先老版本购买的，新版本可以获取
3.  新版本购买的，老版本可以获取到

StoreKit2 提供的 API 使用更为简单，对于客户端来说可以用 appAccountToken 替换 applicationUserName ，将 AppleId 和 App 中账户对应，不会像之前容易丢失；同时服务端也可以通过这个标识将用户的消费行为发给苹果，协助苹果处理用户对消费型商品退款的情况。目前较大问题是iOS版本的限制。

最后
==

IAP的使用一直为开发者诟病，包括创建商品的流程繁琐，以及刚开始接入自动续费时，踩了不少坑，在和苹果开发人员交流和反馈中，苹果逐渐为开发者提供了更多更全面的API，诸如调用接口管理 IAP 商品[Create an In-App Purchase](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreconnectapi%2Fcreate_an_in-app_purchase "https://developer.apple.com/documentation/appstoreconnectapi/create_an_in-app_purchase")，服务端通过[App Store Server API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreserverapi "https://developer.apple.com/documentation/appstoreserverapi")自主查询交易信息。作为iOS开发人员需要持续关注 StoreKit 的发展，与服务端交流，不断完善交易系统的可靠和安全性。

参考链接
====

1.  [App 内购买项目](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fcn%2Fin-app-purchase%2F "https://developer.apple.com/cn/in-app-purchase/")
2.  [StoreKit——In-App Purchase](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fstorekit%2Fin-app_purchase "https://developer.apple.com/documentation/storekit/in-app_purchase")
3.  [Validating receipts with the App Store](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstorereceipts%2Fvalidating_receipts_with_the_app_store "https://developer.apple.com/documentation/appstorereceipts/validating_receipts_with_the_app_store")
4.  [App Store Receipts responseBody](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstorereceipts%2Fresponsebody "https://developer.apple.com/documentation/appstorereceipts/responsebody")
5.  [App Store Server Notifications](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fappstoreservernotifications "https://developer.apple.com/documentation/appstoreservernotifications")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！