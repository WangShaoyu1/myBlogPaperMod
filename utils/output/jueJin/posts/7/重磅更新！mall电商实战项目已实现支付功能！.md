---
author: "MacroZheng"
title: "重磅更新！mall电商实战项目已实现支付功能！"
date: 2023-10-10
description: "之前经常有小伙伴问我，mall项目有没有实现支付功能。最近发现支付宝支付有沙箱环境了，无需复杂的商业流程，即可实现支付功能。目前mall项目已实现支付宝支付功能，感兴趣的小伙伴可以了解下！"
tags: ["后端","Spring Boot","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:28,comments:1,collects:46,views:3042,"
---
> 之前经常有小伙伴问我，mall项目有没有实现支付功能。最近发现支付宝支付有沙箱环境了，无需复杂的商业流程，只需拥有一个支付宝账号，即可实现支付功能。目前mall项目已实现支付宝支付功能，今天就给大家介绍下它的使用，感兴趣的小伙伴可以了解下！

mall项目简介
--------

这里还是简单介绍下mall项目吧，mall项目是一套基于 SpringBoot + Vue + uni-app 实现的电商系统（Github标星60K），采用Docker容器化部署。包括前台商城项目和后台管理系统，能支持完整的订单流程！涵盖商品、订单、购物车、支付、权限、优惠券、会员、支付等功能，功能很强大！

*   项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")
*   官方文档：[www.macrozheng.com](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com "https://www.macrozheng.com")

### 后台管理系统演示

![](/images/jueJin/b32813809c694c8.png)

### 前台商城项目演示

![](/images/jueJin/f1c29d52362c40b.png)

支付流程
----

> 下面我们来介绍下mall项目中的订单流程和支付流程。

### 订单流程

其实之前mall项目中之前已经实现了完整的订单流程，只需修改很少的代码，就能对接支付功能了，具体流程可以参考下图。

![](/images/jueJin/c2f92f07470d44b.png)

其实仅需三步就可以实现支付了：

*   在`确认支付`环节添加支付宝支付功能；
*   在`支付结果页`去支付宝查询支付结果；
*   在支付宝的`异步回调`中调用原来实现的支付成功逻辑。

### 支付流程演示

> 接下来我们来演示下mall项目的整个支付流程。

*   首先我们添加商品到购物车，然后去创建订单；

![](/images/jueJin/10a197f6098f49f.png)

*   接下来我们点击`提交订单`，在弹框中选择`去支付`，之后我们就会进入选择支付页面，选择`支付宝支付`，并点击`确认支付`；

![](/images/jueJin/8228951a08e64cb.png)

*   然后会跳转到支付宝付款页，选择`继续浏览器付款`；

![](/images/jueJin/44d13c0399f2484.png)

*   之后我们输入沙箱环境的买家账号登录，登录成功后点击`确认付款`即可；

![](/images/jueJin/7236797a654e4b0.png)

*   支付成功后，点击`完成`按钮，我们会跳转到我们配置好的支付结果页面；

![](/images/jueJin/053db91e5c9e466.png)

*   在该页面我们可以查看到支付状态，点击`查看订单`可以去查看订单；

![](/images/jueJin/0e55c41cd8e64e0.png)

*   打开订单详情页，我们可以发现该订单已经被成功支付，并进入`等待发货`状态。

![](/images/jueJin/bfcd4a839671488.png)

支付配置
----

> 如何在mall项目中使用支付功能呢，这里仅需两步配置即可实现。

### mall项目配置

*   我们需要在`mall-portal`模块的`application-dev.yml`中添支付宝支付的配置，注意替换成自己的支付宝配置；

```yaml
alipay:
# 支付宝网关
gatewayUrl: https://openapi-sandbox.dl.alipaydev.com/gateway.do
# 应用ID
appId: your appId
# 应用私钥
alipayPublicKey: your alipayPublicKey
# 支付宝公钥
appPrivateKey: your appPrivateKey
# 用户确认支付后，支付宝调用的页面返回路径，开发环境为：http://localhost:8060/#/pages/money/paySuccess
returnUrl: http://localhost:8060/#/pages/money/paySuccess
# 支付成功后，支付宝服务器主动通知商户服务器里的异步通知回调（需要公网能访问），开发环境为：http://localhost:8085/alipay/notify
notifyUrl:
```

*   这些配置从哪里来呢，首先我们需要登录支付宝沙箱应用的开发者控制台，访问地址：[open.alipay.com/develop/san…](https://link.juejin.cn?target=https%3A%2F%2Fopen.alipay.com%2Fdevelop%2Fsandbox%2Fapp "https://open.alipay.com/develop/sandbox/app")

![](/images/jueJin/cd5ccad6ba1d4ec.png)

*   配置文件中的支付宝网关地址和APPID可以从这里获取；

![](/images/jueJin/a21967547a6d41f.png)

*   我们打开支付宝的秘钥查看，可以发现里面有三个秘钥，应用公钥、应用私钥和支付宝公钥，我们只需使用应用私钥和支付宝公钥这两个即可。

![](/images/jueJin/5b81f789a76e46e.png)

### mall-app-web配置

mall-app-web是mall项目的前台商城项目，目前默认没有开启支付宝支付功能，只需修改`appConfig.js`文件的`USE_ALIPAY`属性即可开启。

![](/images/jueJin/704b52432a33443.png)

总结
--

今天给大家介绍了下mall项目中的支付功能，其实基于之前的订单功能，实现支付也是很简单的，感兴趣的小伙伴可以去github上下载mall项目的最新代码，体验一下支付功能！

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")