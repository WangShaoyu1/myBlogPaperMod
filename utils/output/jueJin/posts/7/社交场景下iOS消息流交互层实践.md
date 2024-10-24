---
author: ""
title: "社交场景下iOS消息流交互层实践"
date: 2023-01-09
description: "一款社交产品的诞生，离不开即时通讯（IM）场景。本文主要介绍如何构建一套通用的消息流交互层方案，适应多个业务不同IM场景需要。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:37,comments:3,collects:53,views:10939,"
---
> 图片来自：[unsplash.com/photos/mw6O…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2Fmw6Onwg4frY "https://unsplash.com/photos/mw6Onwg4frY")
> 
> 本文作者：旭风

背景
--

一款社交产品的诞生，离不开即时通讯（IM）场景。随着团队业务版图在社交领域的布局，诞生了多个社交场景APP，涉及的IM场景，包含私聊、群聊、聊天室等。

这些IM场景，在消息流的展示形式上是极为相似的，同时每个业务又有着自己特殊的交互需求。基于此，我们对IM消息流能力做了标准化的构建，来减少IM功能的业务接入成本；同时也是为了统一各个业务的技术方案，减少跨业务开发的理解和维护成本。本文主要针对iOS端在IM消息流交互层的设计上，提供一些实践思路。

业界方案
----

目前业界有各种即时通讯服务商（例如云信、LeanCloud等）提供的配套交互层解决方案，其大多以牺牲灵活性来满足快速集成需要，在定制能力上远不能胜任我们业务需要。再者则是诸如 `MessageKit` 之类的社区IM框架，其在视觉交互表现上功能完备，能帮助我们快速、灵活搭建消息流结构，但业务需要的是一套完整的携带消息交互能力的方案，因此对此类框架，仍需要做不小的改造才能适应我们的业务。

思考
--

对于一个消息流交互层方案，主要考虑几个方面：

1.  **规范的消息流结构**：提供消息流视图结构规范化的构建方式
2.  **标准的消息交互能力**：统一消息交互能力，业务方按需使用，快速集成
3.  **业务拓展性**：针对数据源、消息交互能力提供业务灵活拓展点
4.  **业务接入成本**：内置通用交互方案，降低业务接入成本

目前，我们存量业务中的IM场景，底层IM能力主要由云信引擎提供。同时又存在基于业务服务端，通过HTTP去交互的场景。另外，还需要预留后期切换IM引擎的可能性，因此需要将交互层IM能力抽象出来。此外，为了适应团队现状，减小业务接入成本，考虑将云信提供的交互能力内置在方案中。

整体设计
----

> 设计愿景：提供标准化的能力，同时对拓展开放。

我们期望一套通用的消息流能力，能够在方案上标准化。这里的标准化，主要包含消息流结构构建的标准化，以及消息交互能力的标准化。同时，方案需要在交互能力上适应不同业务场景，因此采用依赖注入的方式，提供业务定制能力。 按照职能划分，将框架整体分为了两层：

![image-20220914152451655](/images/jueJin/545439284c4e110.png)

*   消息流结构层：负责消息流结构的构建，定义消息视图、布局、数据上的规范，提供业务层分别在「消息」、「会话」两个维度的配置能力。
*   消息交互层：提供消息能力、消息流、消息数据方面的交互能力，向下依赖交互接口，内置标准交互能力的同时，也支持业务按需注入交互实现。

流结构
---

### 消息组件

不同的业务场景，消息流样式表现必然有所差异。下面列出了我们几个业务中的消息流界面：

![image-20220914163609223](/images/jueJin/0b5ff4947a23c50.png)

如何设计一套通用的消息流视图结构，满足不同业务需要？经过对各个业务以及一些主流IM工具的观察，将消息视图结构设计成如下结构，是能够满足我们各个IM场景需要的：

![image-20220914164113441](/images/jueJin/891d2e65c539953.png)

我将消息结构拆分成了5部分，对应5个消息组件 `MessageView` ，每个消息组件都支持业务对其「样式」、「显隐」、「布局」进行配置，从而满足不同场景定制需要。

`MessageView`作为基础消息组件，提供了一些标准能力，例如是否响应菜单动作 `canPerformMenuAction` 、视图重用回调时机 `prepareForReuse` 、尺寸策略等。

```swift
    open class MessageView: MessageAbstractView {
    public var canPerformMenuAction = false
open func refresh(with message: Message) {}
open func prepareForReuse() {}
    open class func createSizeStrategy(message: Message, fittingSize: CGSize) -> MessageLayoutSizeStrategy? {
    // ...
}
}

```

### 尺寸策略

消息组件尺寸作为消息流布局上不可或缺的要素，方案提供了多种尺寸计算策略 `MessageLayoutSizeStrategy` ：

1.  自动布局计算策略：业务方对消息组件使用 AutoLayout 布局时使用，内部会依据约束自动计算好组件尺寸
2.  SizeThatFit 策略：依据组件 `SizeThatFit` 方法返回的尺寸进行布局
3.  自定义策略：提供自定义尺寸计算方式

```swift
    public protocol MessageLayoutSizeStrategy {
    func caclulateSize(_ sizeViewType: MessageView.Type,
    message: Message,
    fittingSize: CGSize) -> CGSize
}

    public struct MessageAutoLayoutSizeStrategy: MessageLayoutSizeStrategy {
    public func caclulateSize(_ sizeViewType: MessageView.Type,
    message: Message,
        fittingSize: CGSize) -> CGSize {
        // ...省略其他代码
        return sizeView.systemLayoutSizeFitting(UIView.layoutFittingCompressedSize)
    }
    
}

    public struct MessageSizeThatFitsStrategy: MessageLayoutSizeStrategy {
    public func caclulateSize(_ sizeViewType: MessageView.Type,
    message: Message,
        fittingSize: CGSize) -> CGSize  {
        // ...省略其他代码
        return sizeView.sizeThatFits(fittingSize)
    }
}
```

### 布局快照

我们还针对消息组件维度支持了布局快照。通常当一个消息组件尺寸固定，在交互过程中尺寸不会发生的情况下，打开布局快照，以减少布局计算消耗。同时也提供了快照清除的能力。我们对多个消息流在快速滚动过程中的CPU峰值做了统计，在使用自动布局尺寸策略的情况下，开启布局快照，峰值降低了10%~20%。

![](/images/jueJin/ba2feba168d29ef.png)

### 交互事件

另外在手势交互上，对外暴露了各个消息组件的一系列交互事件。常见的场景例如单击浏览消息内容，长按展示消息菜单等。方案内部提供了基于系统样式的长按菜单，并提供上层菜单配置能力，同时也可以基于暴露的长按手势事件来自定义菜单。

### 流

一个会话对应一个流，方案也提供了消息流在会话维度上的一些标准化配置。例如消息分页数量、是否自动拉取历史消息、是否开启增量刷新，以及在时间展示上的样式配置等。

此外为了减少列表重绘，消息流也支持增量刷新。通常情况下业务层不需要主动刷新列表，只需对消息数据进行增删改操作，内部会触发对数据源的「diff-update」计算，从而驱动列表的增量更新。

![image-20220915101944057](/images/jueJin/e21a2adc3347377.png)

交互层
---

对于业务方而言，在消息交互上通常关心这么几点：

1.  提供了哪些标准化的交互能力
2.  如何拓展自定义的交互实现
3.  如何对交互流程进行干预

结合团队现状，我们在方案内部内置了基于云信的IM交互能力，同时定义了相关交互接口，供业务方按需注入实现。在实际业务中，一个APP内可能存在多个IM场景，因此交互能力支持按会话维度进行注入，各个会话之间的交互是相互隔离的。

### 消息源

不同的IM场景，消息数据来源可能存在差异。例如我们私聊、群聊的数据源来自云信数据同步服务，聊天室数据需要通过云信提供的历史消息接口拉取，另外也存在诸如通过业务服务端接口来拉取消息数据的场景。因此方案上设置了数据源接口 `SessionMessageProvider` ，提供不同场景消息源的定制能力。

```swift
    public protocol SessionMessageProvider {
    func messages(in session: Session,
    anchorMessage: Message?,
    limit: Int,
    completion: @escaping ([Message]) -> Void)
}
```

方案设置了一个负责管理消息数据源的 DataManager 实例， 其依赖 `SessionMessageProvider` 提供的数据源。同时内置了基于云信的数据源获取实现，能够根据当前会话类型，获取私聊、群聊、聊天室的数据源。如果当前场景是通过HTTP拉取消息的，则需要业务上层手动注入一个从接口获取数据源的 `SessionMessageProvider` 实例。

![image-20220915153237442](/images/jueJin/2467aa612e0f19a.png)

### 交互源

方案提供了IM标准交互能力，例如消息收发、消息撤回、保存等，以统一各业务交互姿势。具体的交互源除了要考虑目前包含的云信及业务服务端，也要适应其他交互源，因此将交互实现部分也抽象出了接口 `MessageServiceInterface` 。业务根据当前实际场景，注入具体的交互实现即可。下面列出了一些交互申明：

```swift
    public protocol MessageServiceInterface {
    func send(message: Message, in session: Session, completion: @escaping MessageServiceInterfaceCompletion)
    func resend(message: Message, completion: @escaping MessageServiceInterfaceCompletion)
    func forward(message: Message, to session: Session, completion: @escaping MessageServiceInterfaceCompletion)
    func revoke(message: Message, completion: @escaping MessageServiceInterfaceCompletion)
    func save(message: Message, in session: Session, completion: @escaping MessageServiceInterfaceCompletion)
    func delete(message: Message, completion: @escaping MessageServiceInterfaceCompletion)
}
```

同样，我们也内置了一些通用交互方案，例如支持云信提供的私聊群聊交互能力，以及由中台提供的通用聊天室服务交互能力，以支持相关场景下快速接入。

![image-20220915153244248](/images/jueJin/3dc6a2b0d3de6fc.png)

### 交互钩子

在实际IM业务开发过程中，往往需要对交互流程做一些干预，或是在交互过程中做一些定制化的动作。因此方案也提供了一些交互钩子，支持「交互前置校验」、「交互前准备」。以消息发送流程为例，提供了「发送前校验」、「发送准备」两个消息发送过程的回调钩子：

```swift
    public protocol MessageServicePrechecker {
    // 消息发送前置校验
    func shouldSend(message: Message, in session: Session) -> Bool
    
    // ...省略其他代码
}

    public protocol MessageServicePreparation {
    /// 准备发送准备
    func prepareSend(message: Message, in session: Session, callback: @escaping MessageServicePreparationCallback)
    
    // ...省略其他代码
}
```

整体的发送流程如图所示：

![image-20220915163725098](/images/jueJin/89533b15615de34.png)

前置校验阶段，用来作消息发送前的校验工作，根据实际状态决定消息是否可以发送。发送准备阶段，则可以在消息投递前做最后的准备工作，例如海外业务可以在这里处理消息资源附件上传Amazon，或是在此处对消息塞入一些客户端信息、反作弊Token等，支持异步操作。

业务接入
----

业务只需要在上层提供针对消息以及会话两个维度的配置，就能基于内置的交互能力，构建出一套基础的IM消息流能力。在具体的消息样式呈现上，则通常需要业务层维护一组关于「消息类型-消息组件类型-消息结构」的映射关系，具体关联如下：

![image-20220915171500598](/images/jueJin/82f056d618e30af.png)

在交互能力上，提供了IM场景的标准能力，业务可以按需使用。

另外，实际IM场景可能需要一些更为丰富的定制能力，则可以依据方案提供的消息数据源接口、消息交互接口来对具体交互实现进行定制。同时也可以使用相关的交互钩子对交互过程进行干预，以适应自己的业务。

总结
--

本文对团队IM场景的现状做了简单介绍，撇开具体实现细节，就如何搭建一套能够适应多业务需要的通用IM消息流交互层方案，提供了一些思考和实践经验。从结果来看，该方案稳定支撑了团队多个IM场景，抹除各场景实现差异，有效降低了维护成本和新业务接入成本。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！