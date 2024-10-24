---
author: "阿里云云原生"
title: "RocketMQ 事件驱动：云时代的事件驱动有啥不同？"
date: 2024-04-15
description: "事件驱动是一个经典的概念，这篇文章主要探讨云时代的事件驱动和传统的事件驱动相比有哪些不同？第一部分从技术理念的层面了解一下事件驱动的概念，第二部分会介绍 RocketMQ 50 面向云时代的事件驱动"
tags: ["云原生","RocketMQ中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:3,views:1936,"
---
作者：林清山（隆基）

**前言：**

从初代开源消息队列崛起，到 PC 互联网、移动互联网爆发式发展，再到如今 IoT、云计算、云原生引领了新的技术趋势，消息中间件的发展已经走过了 30 多个年头。

目前，消息中间件在国内许多行业的关键应用中扮演着至关重要的角色。随着数字化转型的深入，客户在使用消息技术的过程中往往同时涉及交叉场景，比如同时进行物联网消息、微服务消息的处理，同时进行应用集成、数据集成、实时分析等，企业需要为此维护多套消息系统，付出更多的资源成本和学习成本。

在这样的背景下，2022 年，RocketMQ 5.0 正式发布，相对于 RocketMQ 4.0，架构走向云原生化，并且覆盖了更多的业务场景。

背景
--

事件驱动是一个经典的概念，这篇文章主要探讨云时代的事件驱动和传统的事件驱动相比有哪些不同？第一部分从技术理念的层面了解一下事件驱动的概念，第二部分会介绍 RocketMQ 5.0 面向云时代的事件驱动架构推出的子产品 EventBridge，最后再结合几个具体的案例帮助大家了解云时代的事件驱动的常见场景和最佳实践。

事件驱动架构
------

### 1\. 事件驱动架构定义

先从事件驱动的定义来看，事件驱动本质上是一种软件设计模式，它能够最大化降低不同模块以及不同系统之间的耦合度。

这里有一个典型的事件驱动架构图，首先是事件生产者发送事件到 EventBroker，然后 EventBroker 会把事件路由到对应的消费者进行事件处理。事件处理能够灵活扩展，随时增减事件消费者，事件生产者对此透明。

为什么说事件驱动是个很经典的设计模式呢？因为早在几十年前，就出现过多种事件驱动的技术，比如桌面客户端编程框架，点击按钮就可以触发 onclick 事件，开发者编写业务逻辑响应事件。在编程语言上，也经常会采用事件驱动的代码模式，比如 callback、handler 这类的函数。进入分布式系统的时代，系统之间的通信协同也会采用事件驱动的方式。

阅读过[《RocketMQ 5.0 架构解析：如何基于云原生架构支撑多元化场景》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247556145%26idx%3D1%26sn%3D4eb70855e0b5a16a922f312e1e70790c%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247556145&idx=1&sn=4eb70855e0b5a16a922f312e1e70790c&scene=21#wechat_redirect")一文的读者可能会发现，这里的图和之前 RocketMQ 的消息应用解耦图很像。没错，**无论是消息的发布订阅，还是事件的生产消费，都是为了进行代码解耦、系统解耦。** 消息队列更偏技术实现，大部分的 EventBroker 都是基于消息队列实现的，而事件驱动则更偏向于架构理念。

![图片](/images/jueJin/a0119a76f5c04fd.png)

### 2\. 事件的特征

从技术角度来看，消息队列是和 RPC 对应的，一个是同步通信，一个是异步通信。消息队列并不会规定消息的内容，只负责传输二进制内容。如果从技术实现来看，的确，EDA 需要的核心技术就是消息队列的技术。**事件驱动跟消息驱动最大的区别就是：事件是一种特殊的消息，只有消息满足了某些特征，才能把它叫做事件。**

打个比方，看左边这个图。消息就像是一个抽象类，有多种子类，最主要的就是 Command 和 Event 两种。以信号灯为例，向信号灯发送打开的消息，这就是一种 Command，信号灯接受这个 Command 并开灯。开灯后，信号灯对外发出信号灯变成绿色的消息，这个就是一种 Event。

对于事件（Event）来说，有四个主要的特征：

1.  不可变的，事件就是表示已经发生了的事情，已经成为事实。
    
2.  有时间概念，并且对同一个实体来说事件的发送是有序的。如信号灯按顺序发送了绿、黄、红等事件。
    
3.  无预期的，这个就是 EDA 架构之所以能够实现最大化解耦的特点，事件的产生者对于谁是事件消费者、怎么消费这个事件是不关心的。
    
4.  彻底解耦的，并且对于下游怎么去消费事件没有预期，所以事件是具象化的，应该包括尽可能详尽的信息，让下游消费者各取所需。比如交通信号灯事件，包含多个字段：它的来源是谁？它的类型是什么？它的主题是什么？是具体哪一个信号灯？它还会包含唯一的 ID 便于跟踪，以及事件发生时间、事件内容。
    

![图片](/images/jueJin/8ca608d56ffc4ce.png)

### 3\. 云时代的事件驱动

在全行业数字化转型的时代，事件驱动架构应用范围扩大，成为 Gartner 年度十大技术趋势。在新型的数字化商业解决方案里，会有 60% 采纳 EDA 架构。

![图片](/images/jueJin/3a79a4eadbde412.png)

事件驱动作为一个经典的架构模式，为什么会在云时代再度成为焦点呢？主要有几个原因：

1.  因为云原生技术的快速发展和广泛应用，其中之一是微服务。微服务是云原生应用架构的核心，引入微服务架构，数字化企业能够按照小型化的业务单元和团队划分，以“高内聚、低耦合”的方式高效协作。但是微服务架构也会带来新的问题，比如大量同步微服务会面临延迟增大、可用性降低等风险，采用事件驱动的微服务体系，可提高微服务的韧性，降低延迟，实现更彻底的解耦。
    
2.  云原生代表技术 Serverless 架构范式本身也是事件驱动的。现在主要的 Serverless 产品形态，无论是阿里云函数计算 FC、还是 AWS Lambda，它们的主要触发源都是各种形态的事件，比如云产品事件，OSS 文件上传，触发用户基于函数进行文件加工处理计算；用户业务事件，EventBroker 触发函数运行消费逻辑；云产品运维事件，用户通过响应事件，在云平台的基础上扩展自己的自动化运维体系。事件驱动架构的大规模使用，能够帮助数字化企业释放云计算 Serverless 的技术红利。
    
3.  IoT 也是事件驱动架构的重要推动力，有大量的 IoT 应用构建都是基于事件驱动的，比如传感器上报设备事件，温度变化事件、地址位置变化事件等等，云端应用订阅这些事件触发对应的业务流程。
    
4.  数字经济时代，在全行业大规模数字化转型后，跨组织业务逐步从线下搬到线上，数字化商业生态规模会持续扩大，跨组织业务协同更需要彻底解耦。而 EDA 天然具备的异步、解耦的特性，就可以解决这一系列的问题。比如阿里聚石塔业务就是事件驱动的模式，聚石塔实时发布交易事件，合作伙伴包括 ISV、软件服务商、品牌商家订阅消费交易事件，建设个性化的 CRM、商家运营、后台管理系统等等，形成一个庞大的电子商务数字化生态。
    

EventBridge
-----------

### 1\. 云时代的事件驱动能力抽象

接下来进入第二部分，RocketMQ 5.0 的 EventBridge。在系统了解技术实现之前，我们先来了解一下 EventBridge 对事件驱动的通用能力抽象，也可以了解到 EventBridge 的领域模型。

![图片](/images/jueJin/836e7085df9d4ca.png)

我们从左往右看这张图。

最左边是事件源，因为这个事件是希望被跨平台消费的，所以我们希望采用业界标准的事件格式。同时，事件是有可能被跨组织消费的，所以我们需要一个统一的事件中心，让这些不同的事件源都注册到这个事件中心。对消费者来说，就好比是一个事件商店，能够选择自己感兴趣的事件订阅。

在事件消费者开始编写消费逻辑的时候，还需要对这个事件的格式有更清楚的了解，需要知道这个事件有哪些内容，有哪些字段，分别是什么含义，才能编写正确的消费业务逻辑。所以，EventBridge 还提供了 schema 中心，消费者对于事件格式也就一目了然，不用跟事件源的发起者进行沟通了，整个效率也得到了大幅度的提升。

再往右看，就到了事件消费的环节，因为事件的消费者种类很多，不同消费者关注不同的事件类型，EventBridge 需要提供丰富的过滤规则。即便多个消费者对同一个事件感兴趣，但可能只需要事件的部分内容，EventBridge 还提供了事件转换的能力。

这就是 RocketMQ 5.0 对事件驱动的能力抽象。

### 2\. 统一事件标准

在云计算以及大规模数字化转型的时代，我们强调事件驱动架构往往跨越了不同的组织，不同的平台。所以事件驱动架构需要一个统一的事件标准。在 EventBridge 产品中，我们采用了 CNCF 基金会的 CloudEvents 标准，这是业界事件的事实标准，为了简化事件声明，提升事件在跨服务、跨平台的互操作性。

CloudEvents 带来了很多价值：

*   提供了一种规范，使得跨组织、跨平台的事件集成，有了共同语言，加速更多的事件集成。
*   随着 Serverless 的普及，各大云厂商都提供函数计算的服务，有了 CloudEvents 规范，用户在函数计算的使用上就可以实现无厂商绑定。
*   webhook 是一种通用的集成模式，有了 CloudEvents 规范作为统一格式，不同系统的 webhook 能实现更好的互操作性。
*   基于这样统一的规范，更有利于沉淀事件驱动的基础软件设施，比如跨服务的事件 Tracing 链路追踪。

![图片](/images/jueJin/650aa4fb8b1f461.png)

### 3\. RocketMQ - EventBridge

下图是 RocketMQ 面向 EDA 场景全新推出的产品形态 EventBridge。**它的核心技术都是基于 RocketMQ，但是在产品界面上面向事件驱动的业务进行一层抽象，核心领域对象从消息变成 CloudEvents。** 基于统一事件标准来构建事件驱动的数字生态。

它的事件源是多样化的，可以是云产品事件，可以是 SaaS 平台事件，应用自定义事件、通用的 WebHook。当然，它的事件目标更是多样化的，通过事件规则引擎把事件路由到不同的消费者，典型的消费者比如函数计算，存储系统，消息通知（如钉钉、短信），还有通用的 webhook。通过事件驱动这种彻底解耦的架构，更适合建设混合云、多云的数字化系统。

![图片](/images/jueJin/87c5b20c9ce14dd.png)

#### 事件 Schema

为了提升事件驱动的研发效率，EventBridge 也支持 Schema 的特性，支持事件信息的解释、预览，甚至还可以自动化的生成代码，让开发者以低代码、0 代码的方式完成事件集成。

![图片](/images/jueJin/75020a8cc2ca453.png)

#### 事件规则引擎

EventBridge 的另一个比较重要的特性是事件规则引擎。因为不同的事件消费者，对于事件的兴趣是不一样的。所以我们提供了七种事件过滤模式，包括前缀匹配、后缀匹配、除外匹配、数值匹配等等，可以进行各种复杂的组合逻辑过滤，只推送消费者感兴趣的事件。

当然，就算都关心同一个事件，不同消费者对事件内部的信息关注点也会有所不同。为了提升事件消费效率，我们也提供了四种事件转化器，可以只推送给消费者它关心的事件字段。还可以对事件进行自定义的模板转化，满足更灵活的业务诉求。

![图片](/images/jueJin/a15bf1c1d1914e4.png)

#### 事件可观测

作为 RocketMQ 的子项目，在 EventBridge 里也同样提供了完整的可观测能力。能够根据事件的时间、类型查询事件列表。每个事件都会生成唯一 ID。用户可以根据唯一 ID 去精确的定位事件的内容、发生时间、对应的事件规则，下游的消费状况，精准排查问题。

![图片](/images/jueJin/fe43b1329cb5453.png)

典型案例
----

接下来结合几个典型案例来看 EventBridge 的使用场景。

### 案例一：多种云产品事件处理场景

C 客户是一家以智能消费终端为核心的科技公司，希望收集账号里全部的云上事件，方便后续做分析或故障处理。公共云的 EventBridge 汇聚了所有的云产品事件，通过 EventBridge，客户能收集全量的事件并对其进行自定义的业务处理。还能够配置事件规则，过滤异常事件推送给监控系统或者钉钉，及时关注处理。

![图片](/images/jueJin/efd2ef213cbf472.png)

### 案例二：SaaS 事件集成场景

现在随着整个云计算生态的繁荣，有不少企业不仅使用了公共云的 IaaS、PaaS 产品，也会同时使用三方的 SaaS 产品，比如各种 ERP、CRM 等系统。基于 EventBridge 标准的 HTTP、webhook 的集成能力，能够无缝连接三方 SaaS 系统作为事件源，企业能够收集到他所关心的所有 SaaS 事件，方便后续管理，比如申请单、入职单、报销单、订单等等这些场景。

![图片](/images/jueJin/579826d39b77486.png)

### 案例三：SaaS 平台集成场景

以钉钉为例，钉钉是典型的 SaaS 平台，有繁荣的生态，拥有 4000+ 家的生态伙伴，包括 ISV 生态伙伴、硬件生态伙伴、服务商、咨询生态和交付生态伙伴等等。通过 EventBridge 把公共云的 Paas 层生态和钉钉的 SaaS 层生态连接起来，而且依赖 EventBridge 完成整体事件生命周期的管理，以 WebHook 的形式推送给下游 ISV 接收端。比如钉钉的官方事件源，包括视频会议、日程、通讯录、审批流、钉盘、宜搭等，企业和 SaaS 厂商可以充分利用这些官方应用的事件构建企业级的应用系统，也可以把钉钉的官方数据流和其他系统做深度集成。

![图片](/images/jueJin/e0b4004335a74b0.png)

总结
--

通过这篇文章，我们深入探讨了云时代 EDA 的新内涵，它在云时代再次流行的主要驱动力，包括技术驱动力，（如物联网技术、云原生技术）和商业驱动力（伴随着数字化商业生态的繁荣被更多的采纳）。

之后，我们重点介绍了，面向云时代的事件驱动场景，RocketMQ 5.0 推出的子产品 EventBridge，它的特点就是拥抱行业标准，使其具备跨平台、跨组织的事件链接能力。它提供了强大的规则引擎，可以灵活连接事件上下游。同时，它还提供了 Schema 能力，使得整个事件驱动的用户体验和研发生产力有进一步的提升。

最后，我们通过几个云时代事件驱动的典型案例，帮助大家进一步了解云时代事件驱动的常见场景和最佳实践。比如，在用户全面上云之后，怎么统一管理云产品事件；怎么利用多个 SaaS 平台的事件建设自己的业务系统；作为 SaaS 平台本身，又要如何基于 EventBridge 对外开放标准事件，构建平台生态。

![图片](/images/jueJin/02535c497d43469.png)

深度剖析 RocketMQ 5.0 的系列文章到此告一段落，回顾往期文章请点击下方链接：

[从互联网到云时代，Apache RocketMQ 是如何演进的？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247555252%26idx%3D1%26sn%3D256818e640aa01eefcd0162f1b5992c0%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247555252&idx=1&sn=256818e640aa01eefcd0162f1b5992c0&scene=21#wechat_redirect")

[RocketMQ 5.0 架构解析：如何基于云原生架构支撑多元化场景](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247556145%26idx%3D1%26sn%3D4eb70855e0b5a16a922f312e1e70790c%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247556145&idx=1&sn=4eb70855e0b5a16a922f312e1e70790c&scene=21#wechat_redirect")

[RocketMQ 在业务消息场景的优势详解](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247555456%26idx%3D1%26sn%3D33616e21e01ff9b410ddd51af46df5de%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247555456&idx=1&sn=33616e21e01ff9b410ddd51af46df5de&scene=21#wechat_redirect")

[Apache RocketMQ 5.0 消息进阶：如何支撑复杂的业务消息场景？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247556722%26idx%3D1%26sn%3Dcbb0264f39f7f725746997c1a9204d4b%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247556722&idx=1&sn=cbb0264f39f7f725746997c1a9204d4b&scene=21#wechat_redirect")

[RocketMQ 流存储解析：面向流场景的关键特性与典型案例](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzU4NzU0MDIzOQ%3D%3D%26mid%3D2247518478%26idx%3D1%26sn%3D3fb0a4349b24ea01e8dfbfe680f72abf%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzU4NzU0MDIzOQ==&mid=2247518478&idx=1&sn=3fb0a4349b24ea01e8dfbfe680f72abf&scene=21#wechat_redirect")

[RocketMQ 流数据库解析：如何实现一体化流处理？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247563015%26idx%3D1%26sn%3D6606fa325a0af660e3fd36d0b98af4a0%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247563015&idx=1&sn=6606fa325a0af660e3fd36d0b98af4a0&scene=21#wechat_redirect")

[RocketMQ 之 IoT 消息解析：物联网需要什么样的消息技术？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247563397%26idx%3D1%26sn%3Dee57074e6f14afc73f565ca6c5ee29da%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247563397&idx=1&sn=ee57074e6f14afc73f565ca6c5ee29da&scene=21#wechat_redirect")

欢迎点击[**此处**](https://link.juejin.cn?target=https%3A%2F%2Fwww.aliyun.com%2Fproduct%2Fons "https://www.aliyun.com/product/ons")进入官网了解更多详情，也欢迎填写表单进行咨询：_[survey.aliyun.com/apps/zhilia…](https://link.juejin.cn?target=https%3A%2F%2Fsurvey.aliyun.com%2Fapps%2Fzhiliao%2FbzT3AfPaq "https://survey.aliyun.com/apps/zhiliao/bzT3AfPaq")_