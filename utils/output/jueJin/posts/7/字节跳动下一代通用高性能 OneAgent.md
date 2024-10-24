---
author: "字节跳动技术团队"
title: "字节跳动下一代通用高性能 OneAgent"
date: 2024-05-29
description: "本文介绍了字节跳动云原生可观测团队在构建 OneAgent 方面的探索，涉及数据模型、流程管道、编排调度和构建体系等方面，还分享了 OneAgent 在字节跳动内部的几个应用案例，展示了其在数据采集效"
tags: ["微服务","云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:20,comments:2,collects:22,views:20099,"
---
> 作者：朱舜佳

本文介绍了字节跳动云原生可观测团队在构建 OneAgent 方面的探索，涉及数据模型、流程管道、编排调度和构建体系等方面，还分享了 OneAgent 在字节跳动内部的几个应用案例，展示了其在数据采集效率、资源消耗和系统稳定性方面的优势。

一、为什么需要 OneAgent？
=================

字节跳动拥有海量的主机和微服务实例，涵盖物理机、虚拟机、容器等多种场景，每秒产生的千亿级别的可观测性数据，在可观测性数据采集和管道化处理等方面给技术团队带来了巨大挑战：

*   字节跳动内部存在多套可观测系统和多个数据采集组件，一台机器上往往需要部署多个遥测采集 Agent，造成了资源的浪费。这些采集组件来自不同的团队，有些已经年久失修无人维护，运维和排障非常困难；
*   内外一体逐渐成为集团业务开发的一个重点，很多业务使用开源 SDK，也想统一接入公司的可观测性平台，采集组件侧存在大量的适配工作；
*   字节跳动内场多年打磨的 M.T.L 引擎也将逐步上云产品化，我们需要保证内外统一的观测接入及产品体验。

![字节可观测性埋点现状分析](/images/jueJin/9706b1a5777f495.png)

字节可观测性埋点现状分析

为了解决上述问题，技术团队决定构建 OneAgent 组件，提供 Logs、Metrics、Trace 和 Event 采集解决方案。

OneAgent 是字节可观测团队提供的新一代可观测性数据\[M.T.L.E\]采集和处理管道（DataPipeline），目标是让 OneAgent 成为集团和云上的首选可观测性基础设施，简化在云环境中接入可观测性系统的复杂度，同时让用户可以轻松地从可观测性数据中获取更多价值。

OneAgent 中的 One 指的是**统一和复用**，我们希望它作为一款可观测数据采集、预处理 Agent，能在系统中发挥以下作用：

*   数据采集统一：Metrics、Log、Trace、Event 能够使用同一个 agent 实现采集
*   Client、Server 端复用：可以支持部署在 Client 端采集，也可以部署在 Server 侧作为 Collector Proxy
*   内外场复用：内部和商业化版本的采集标准链路上，能够使用同一个 Agent 作为采集器

通过调研了社区内现有的开源解决方案，我们最终决定和 iLogtail 社区达成了共建合作，采用开源 iLogtail 作为 OneAgent 的底座，同时将通用能力直接以开源的工作方式贡献回社区。

二、OneAgent 架构
=============

基于开源项目的框架，字节跳动云原生可观测团队打造的 OneAgent 本身分为 C++ 编写的 core 部分，和以 Go 为主的插件系统部分。

![](/images/jueJin/88fdd34f7f294d8.png)

Core 是 iLogtail 的主体，主要负责 OneAgent 自身状态的管理，包括配置的加载和监听、流水线的启停、保存 CheckPoint、自监控、告警等，也包含了日志文件采集相关的逻辑。Go 插件系统则对接了多种可观测性生态，包括 Prometheus、OpenTelemetry、SkyWalking 等生态的诸多插件，大大拓宽了 iLogtail 的应用场景。

以语言为界，iLogtail 包含了 C++ 和 Go 两种流水线，两者之间可以通过 cgo 的方式来交互。

1.  C++ 流水线起源于日志文件采集，在 iLogtail 1.0 阶段是固定的一条流水线，不支持编排，自由度较低。后来在 iLogtail 2.0 阶段放开了 C++ 流水线做了插件化改造，现在已经支持编排能力，目前的 C++ 流水线处在高速迭代发展阶段，不过总体插件生态仍然弱于 Go pipeline，可以通过调用 Go 插件增强处理数据的能力。
2.  Go 的 pipeline 的生态更加丰富，对接了多种开源协议。Go Pipeline 既能独立运行，也能借由 Core 拉起。在 iLogtail 1.0 阶段，Go 流水线只能调用 C++ 写的一些 Processor 来加速处理数据。随着 iLogtail 2.0 将两条流水线的打通，数据只要进入任意一条流水线，都能在两条流水线中自由流动。

云原生可观测团队目前使用 OneAgent 的 Go 流水线来采集和处理 Metrics 和 Traces 数据，使用 C++ 流水线搭配 Go Flusher 插件做 Logs 文件采集。

三、基于业务场景的开源改造
=============

在实际开发过程中，由于字节跳动拥有庞大的业务规模和复杂的业务场景，单纯的开源版本并不能完全满足现实需要。为此，我们对核心的数据模型、流水线、编排调度、构建体系都做了深度改造。

### 原生的 Event 数据模型

社区版本的 pipeline 是以日志作为底座的，使用 SLS-PB 数据模型。虽然也可以处理 Metrics、Traces 数据，但是都得先转化成日志，这往往会造成性能额外开销及兼容性问题。以下述 metric 为例，metric 的字段使用特殊约定的 key 存储，其中 metrics 的多个 labels 以固定格式拼接到一个字段中，value 则通过 string 格式存储。

```ProtoBuf
    {
    "__name__":"net_out_pkt",
    "__labels__":"cluster#$#ilogtail-test-cluster|hostname#$#master-1-1.c-ca9717110efa1b40|hostname#$#test-1|interface#$#eth0|ip#$#10.1.37.31",
    "__time_nano__":"1680079323040664058",
    "__value__":"32.764761658490045",
    "__time__":"1680079323"
}
```

这带来一些问题：

*   对 label 进行操作就会引入反序列化开销；
*   value 运算前需要做转换；
*   value 不支持多值，传输效率低；
*   对一些社区比较流行的数据协议，例如 Prometheus，OpenTelemetry 等的兼容性不够好。

为了解决上述问题，我们开发了基于新数据模型的 2.0 pipeline。2.0 Pipeline 中流动的每一条数据定义为 PipelineEvent，Metric、Trace、Log、Bytes，Profiling 等都是派生自 PipelineEvent 的具体事件，大幅提升了灵活性：

```Bash
    type PipelineEvent interface {
    GetName() string
    
    SetName(string)
    
    GetTags() Tags
    
    GetType() EventType
    
    GetTimestamp() uint64
    
    GetObservedTimestamp() uint64
    
    SetObservedTimestamp(uint64)
}
```

PipelineEvent 不但可以携带更丰富的信息，也更适合做 data pipeline 内的计算模型，大大提升了通用处理能力。

目前，我们已经把这项改造贡献给社区，社区也已经接受这个新的数据模型为核心处理模型，后续新的插件都将支持新的数据模型，存量的插件也在逐渐适配支持。

### 全新的构建方案

社区在 v1.4.0 之前要求插件必须放在项目主仓库内，但互联网时代，代码是企业最核心的资产之一，受限于字节跳动内部的安全合规要求，一些插件必须放在公司内部的私有仓库，不能贡献到开源社区。一般面对这种情况，我们只能 fork 一个新的仓库来增加一些内部专用的插件，但这会导致我们和社区上游渐行渐远，既也不能享受开源项目的新特性，也不利于把最终用户的反馈反哺社区。

针对这个问题，我们设计了一种产物构建机制，能够合并官方仓库和私有仓库的插件，一起构建出包。在方案上，我们重点参考了 OpenTelemetry Collector 的做法，使用 YAML 文件渲染成最终的 Go 文件。我们对仓库做了如下改造：

![](/images/jueJin/2b07eeecf2d148c.png)

v1.4.0 之前，插件的引入都放在 plugins/all/all.go 下：

```go
package all

import (
_ "github.com/alibaba/ilogtail/plugins/aggregator"
_ "github.com/alibaba/ilogtail/plugins/aggregator/baseagg"
...
)
```

v1.4.0 之后，项目主仓库添加 plugins.yml 文件，内置插件都加到这个文件里面进行注册，默认使用 plugins.yml 来生成内置插件的 all.go 。同时编译脚本支持传递多个 \*\_plugins.yml ， 使用 external\_plugins.yml 来加载外部仓库的插件，生成 external\_all.go 文件。

plugin.yml:

```YAML
plugins:
common:
- import: "github.com/alibaba/ilogtail/plugins/aggregator"
- import: "github.com/alibaba/ilogtail/plugins/aggregator/baseagg"
...
```

external\_plugins.yml:

```YAML
plugins:    // 需要注册的plugins，按适用的系统分类
common:
- gomod: code.private.org/private/custom_plugins v1.0.0  // 必须，插件module
import: code.private.org/private/custom_plugins        // 可选，代码中import的package路径
path: ../custom_plugins                            // 可选，replace 本地路径，用于调试
windows:
linux:

project:
replaces:       // 可选，array，用于解决多个插件module之间依赖冲突时的问题
go_envs:        // 可选，map，插件的repo是私有的时候，可以添加如GOPRIVATE环境等设置
GOPRIVATE: *.code.org
git_configs:    // 可选，map，私有插件repo可能需要认证，可以通过设置git url insteadof调整
url.https://user:token@github.com/user/.insteadof: https://github.com/user/
```

有了这个能力之后，各个公司能更自由地开发自己场景的插件，大大降低了开发门槛，大幅提升了开源项目的共建体验。

![字节跳动的插件配置（脱敏）](/images/jueJin/2e43aae703b24e6.png)

字节跳动的插件配置（脱敏）

### 插件开发

基于上述这两个特性，我们开发一系列 OneAgent 插件运用在不同场景，很好地支撑了业务的需求：

输入插件：

*   Unix Domain Socket Input
*   Prometheus Service Input V2
*   OpenTelemetry Input
*   HTTP Server Input V2
*   Metrics TCP Server Input
*   TTLogAgent Input

处理插件：

*   Prometheus Metric Validator
*   Telegraf Metric Filter

聚合插件：

*   Metric Tag Aggregator

输出插件：

*   HTTP Flusher
*   OTLP Flusher
*   TTLogAgent Flusher

拓展插件：

*   Metric Event Filter
*   Byted Metrics Decoder
*   Status Code Request Breaker

上述插件中的部分也已经贡献给开源社区。

四、OneAgent 案例分享
===============

本节将会介绍 3 个字节跳动使用 OneAgent 的案例。

### 存储底座替换 Telegraf

字节跳动内部某业务的存储业务主要使用 BytedMetrics 1.0 SDK 进行打点，使用 Metrics Agent（ms2）和 Telegraf 作为指标采集的 Agent。这条采集链路过长并且资源消耗过高，并且产品侧指标存在采集延迟、指标丢点的问题。部分业务单个实例每分钟打点可达百万级，采集组件至多可以占用 16 核心，却仍然受限于性能问题，无法实时地上报监控指标，从而造成了产品侧指标采集延迟、丢点的问题。

![](/images/jueJin/746444bf55864a0.png)

> **ms2** 是字节跳动自研的高性能指标采集 Agent，用 C++ 实现，主要用来聚合，清洗，降级数据以及投递数据，以 Daemonset 的形式部署在各个集群，终态会和 OneAgent 融合。详细介绍见文章：[字节跳动百万级 Metrics Agent 性能优化的探索与实践](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fbl1HbC6ti6Pw2FGxgstfBw "https://mp.weixin.qq.com/s/bl1HbC6ti6Pw2FGxgstfBw")
> 
> **BytedMetrics SDK 1.0** 是字节自研的第一代打点 SDK，依赖 ms2 做数据聚合。
> 
> **BytedMetrics SDK 2.0** 是字节自研的第二代高性能打点 SDK，具有数据聚合能力，性能领先 Prometheus SDK 2-5 倍。
> 
> **Telegraf** 是 InfluxData 公司开发的一款开源指标采集 Agent，用于主机指标和业务指标的采集，现在逐步被 OneAgent 替换。

为了解决上述问题，我们使用 OneAgent 作为新的指标采集 Agent，现阶段已经使用 OneAgent 平替 Telegraf，降低了采集 Agent 80%的 CPU 占用，解决了业务的监控丢点和延迟问题。

![OneAgent上线效果](/images/jueJin/171ad726c514487.png)

OneAgent上线效果

该业务用户的打点方式多种多样，涵盖了 BytedMetrics 1.0 SDK、BytedMetrics 2.0 SDK、InfluxDB SDK、Prometheus Exporter、OpenTelemetry SDK 等。过去需要部署多个 Agent 进行采集，这不仅导致了资源的浪费，还增加了运维成本。如今，OneAgent 已经能够接收除 BytedMetrics 1.0 SDK 以外的所有数据，成功收敛了数个采集 Agent。

随着业务逐渐接入 BytedMetrics 2.0 SDK，以及我们下一个阶段对 C++流水线的改造，最终 OneAgent 将取代 ms2，成为该业务唯一的可观测数据采集 Agent，从而进一步节省资源，这也是我们的最终目标。

### 日志文件采集

![](/images/jueJin/463ad720b2c741e.png)

字节跳动内部主流是 Go 微服务，主要使用侵入式的 BytedLogs SDK 来记录日志，SDK 通过 Unix Domain Socket 上报给本机的 TTLogAgent，可以实现无盘化采集日志。

> **TTLogAgent** 是字节自研的日志采集 Agent，用 Go 实现，主要用来接收 Log SDK 上报的数据并发送到后端，同时也支持日志文件采集，日志降级，错误日志分流等功能，以 daemonset 的形式部署在各个集群，最终会被 OneAgent 替换。
> 
> **Logs SDK** 是字节自研的高性能日志 SDK，采用链式 API，性能属于业内第一梯队。

这也带来一些问题：

1.  如果进程发生不可恢复的错误，崩溃信息无法及时上报，这部分 stdout/stderr 输出会重定向到一个文件中，当前依赖一个脚本工具上报 panic 日志。
2.  随着公司上云和内外一体策略，一些业务使用了开源组件打日志，无法接入字节跳动内部的日志平台，需要使用文件采集方案。

TTLogAgent 文件采集能力较弱，对日志的处理通用性也不够，不支持正则处理多行日志，无法开放给所有用户使用。在对比 TTLogAgent 与 iLogtail 的优劣之后，我们决定复用 OneAgent 的这部分能力，将 TTLogAgent 改造成 OneAgent 的一个插件。

对比项

TTLogAgent

iLogtail

资源消耗

低

低

文件读取公平性

差（多文件读取的公平性靠 goroutine 的调度）

好（时间片轮转保证公平性）

文件读取隔离性：不同文件；不同 pipeline

一般

一般

文件读取限流

有

无，但可以新增插件增强

Graceful Shutdown

不完善

完善

可观测性

弱

弱

插件能力

较少

丰富

事件驱动的文件采集

OneAgent 采用了轮询（polling）与事件（inotify）并存的模式进行日志采集，既借助了 inotify 的低延迟与低性能消耗的特点，也通过轮询的方式兼顾了运行环境的全面性，可以实现毫秒级的日志采集的延迟控制，很好地应对字节跳动当前的日志压力。

改造后 TTLogAgent 变成了 OneAgent 的一个插件：

![](/images/jueJin/3fd6f6c6ea5e466.png)

后续我们会把 TTLogAgent 的功能逐步迁移到 OneAgent，最终下线 TTLogAgent。

### 对接开源生态

OneAgent 不但可以作为采集 Agent，也可以部署成服务作为 Proxy 或 Gateway。字节跳动内部部署了多个 OneAgent 服务，帮助用户接入不同的可观测性平台，实现内外一体的观测体验。

*   有团队部署了 OneAgent 服务作为 Prometheus Remote Write 的后端，将指标写入公司自研时序数据库 ByteTSD。

![](/images/jueJin/9002e334470e433.png)

*   有团队使用 InfluxDB SDK 通过 OneAgent 接入 ByteTSD 和 InfluxDB。

![](/images/jueJin/7b1293c259a1430.png)

*   有团队使用 OpenTemetry SDK 通过 OneAgent 写入内场可观测性平台。

![](/images/jueJin/f0797e39aadb4b0.png)

五、未来展望
------

根据后续规划，未来我们会持续增强 OneAgent 能力，提升其稳定性和易用性。同时我们也会深度参与开源社区共建，和广大开发者共同打造领先的可观测数据采集器：

*   实现 OneAgent 多 pipeline 的连接，增强数据处理能力。
*   扩展增强 C++ 的 pipeline，更高性能地处理 Metrics 和 Trace 数据，在一些计算密集型场景，Go 插件的处理能力还无法和 C++ 组件对齐。
*   加快 OneAgent 运维控制面建设。
*   收敛目前字节内部的 Agent 到 OneAgent，首先考虑融合 Telegraf、ms2 及 TTLogagent。

六、引用
----

字节跳动百万级 Metrics Agent 性能优化的探索与实践：[mp.weixin.qq.com/s/bl1HbC6ti…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fbl1HbC6ti6Pw2FGxgstfBw "https://mp.weixin.qq.com/s/bl1HbC6ti6Pw2FGxgstfBw")

节约资源、提升性能，字节跳动超大规模 Metrics 数据采集的优化之道：[mp.weixin.qq.com/s/spHNCBWfg…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FspHNCBWfgOCHSomLvp5aWA "https://mp.weixin.qq.com/s/spHNCBWfgOCHSomLvp5aWA")

OpenTelemetry Collector Connector: [github.com/open-teleme…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fopen-telemetry%2Fopentelemetry-collector%2Fblob%2Fmain%2Fconnector%2FREADME.md "https://github.com/open-telemetry/opentelemetry-collector/blob/main/connector/README.md")

**云原生可观测团队**

字节跳动云原生可观测（Cloud Native-Observability）团队提供日均数十 PB 级可观测性数据采集、存储和查询分析的引擎底座，致力于为业务、业务中台、基础架构建设完整统一的可观测性技术支撑能力。同时，团队也正通过火山引擎持续对外输出云上可观测技术能力。