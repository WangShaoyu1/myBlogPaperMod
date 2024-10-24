---
author: "阿里云云原生"
title: "iLogtail 开源两周年：感恩遇见，畅想未来"
date: 2024-08-21
description: "iLogtail 的诞生初衷非常朴素，那就是开发一款轻量、高性能、高可靠的可观测数据采集器。也是基于这样一个常见且迫切的需求，iLogtail 于 2013 年在阿里巴巴诞生。"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:3,comments:1,collects:2,views:70,"
---
早在上世纪 60 年代，早期的计算机（例如 ENIAC 和 IBM 的大型机）在操作过程中会输出一些基本的状态信息和错误报告，这些记录通常通过打印机输出到纸带或纸卡上，用于跟踪操作流程和调试，最早期的日志系统借此诞生。纵观 IT 发展几十年历程，以日志为代表的可观测以及监控技术在 IT 技术演变过程中扮演着重要角色。从最初的硬件监控到系统资源管理，再到网络、应用、云服务和容器的监控，每一阶段的 IT 发展都推动了监控技术的进步。

与此同时，近十年来开源技术在中国得到了快速和深远的发展，政府的重视、企业的积极参与、活跃的开源社区和优秀的本地化项目共同推动了这一进程。教育和人才培养的加强，以及广泛的国际合作，使中国逐渐成为全球开源生态的重要组成部分。也是在这样的浪潮之下，国内涌现出诸如 iLogtail、RocketMQ、Nacos、TiDB 等不同技术领域非常多优秀的开源项目。

过往回顾
----

iLogtail 的诞生初衷非常朴素，那就是开发一款轻量、高性能、高可靠的可观测数据采集器。也是基于这样一个常见且迫切的需求，iLogtail 于 2013 年在阿里巴巴诞生。期间，通过阿里云飞天、阿里巴巴集团上云等严苛考验与迭代优化。在历经近十年磨炼之后，直至 2022 年全面开源，iLogtail 成为可以部署于物理机、虚拟机、Kubernetes 等多种环境中，用于采集文件、容器输出、指标等各类可观测数据的轻量、高性能采集器。帮助开发者构建统一的数据采集层，赋能可观测平台打造各种上层的应用场景。截至目前，iLogtail 一直稳定服务阿里集团、蚂蚁集团以及众多公有云上的企业客户，目前已经有千万级的安装量，每天采集数十 PB 可观测数据，充分证明了其在可观测领域内的重要地位与广泛应用价值，同时也标志着其技术成熟度与社区贡献达到了新的里程碑。

### 技术里程碑回顾

iLogtail 开源两年时间里，共发布 22 个 Release 版本，涉及从功能增强到 bug 修复、底层框架重构与优化等方面，经历了从 v1.x 到 v2.x 的大版本演进。可以说，每个版本的发布都意味着 iLogtail 的成长与完善。

![图片](/images/jueJin/f4474f0f2898495.png)

iLogtail 一直致力于通用可观测采集器打造，并基于此发布了众多特性：

*   升级了 C++/Golang Pipeline 的通用 Event 数据模型，可扩展表达 Logs、Metric、Traces、Events、Profiles 等在内的多种可观测类型，为通用计算打下基础。
*   重构 C++/Golang Pipeline 系统，彻底打通两种插件处理系统，做到原生插件与扩展插件的可组合性。
*   可编程能力跨越式提升，推出了 SPL ，通过管道符（|）引导的探索式语法，自有编排解决各类负责的数据处理逻辑。
*   K8s 采集能力不断完善：完整的 K8s 元数据 AutoTagging 能力；针对 Job 类容器增删频率高、生命周期短、突发并发大等特点，从容器发现速度、句柄锁定机制、秒退容器数据完整性等方面进行了针对性的优化。
*   生态进一步完善，全面兼容了 Opentelemetry 协议，支持了包括 Kafka、Elasticsearch 在内的众多 Flusher。
*   推出社区版 ConfigServer 服务，为大规模采集配置管理提供便捷。

### 贡献者不断增加

在过去两年中，iLogtail 社区收获了 1.6K Star，86 位 Contributors、7 位 Committer、6 位 PMC ，解决了 274 个 Issues，完成了 909 个 Pull Requests。其中不乏多位优秀贡献者：

**刘浩杨（PMC，字节跳动云原生可观测）、朱舜佳/郭刚平（Committer，字节跳动云原生可观测）**

iLogtail 开源初期内部数据流是以 SLS-PB 为结构，对于开源社区流行的 OTLP 等协议兼容性不是太好，也缺乏原生的 Metrics 、Traces 数据模型，所有数据处理都需要以 SLS-PB 结构做数据中转，造成性能额外开销及兼容性问题。刘浩杨、朱舜佳、郭刚平等字节跳动云原生可观测团队同学发起了全新数据模型的提案，新的数据模型中 Pipeline 中流动的每条数据定义为 PipelineEvent，并基于此派生出 Metric、Trace、Log、Profiling，为 iLogtail 向通用化发展打下坚实基础。同时，也就该数据模型设计并实现了全新 Golang Pipeline，使数据流转及处理效率大幅提升。

在过去两年的时间里，贡献了很多优秀的提案、设计与实现。例如，实现了 Extension 插件类型，增强了插件的可组合性；发起了心跳 & 配置同步流程重构提案，为通用管控协议的发展输出了宝贵的建议；贡献了包括 HTTP、OTLP 在内的多个 Flusher。

**孙宇（Committer，同程旅行）**

作为目前社区 Kafka 功能的主要负责人，不仅完善了上下游插件生态，还在数据完整性保护、依赖库升级、数据格式处理等方面贡献突出。主要贡献了 Kafka、Pulsar Flusher，指导新晋开发者开发 Elasticsearch Flusher，支持日志输出数据平铺格式。

除了开发贡献外，他还积极参与社区互动，无论是 GitHub 的 Issues/Discussions，或是社区的钉钉/微信交流群，经常可以看到其帮助开源开发者解决问题的身影。

**邱风硕（Contributor）**

2023 年夏天，作为研一的在校学生，参加了 iLogtail 社区组织的开源直通车活动。期间，参加了项目“编写 SQL 处理插件”，也是本次活动中难度最大的项目。期间，邱风硕同学对词法分析、语法分析和语义分析等阶段进行了详细的设计，同时根据项目的特点提出了各自的裁剪和优化方法。提交的代码不仅在功能、执行效率方面表现出色，而且代码结构组织清晰、异常处理得当，附带了完善的单元测试，这反映了邱风硕同学对于代码质量方面的意识。最终也凭借在项目中的优异表现成功拿到 iLogtail 项目组实习生的机会。

更多突出贡献者包括但不限于：

*   俞倩雯（urnotsally，字节跳动云原生可观测）：贡献了 ByteArray 数据结构和 HTTP 数据透传功能。
*   魏文晗（XLPE，某大型通信与信息服务类公司）：贡献了第三方性能测试。
*   舒震宇（szy441687879，小红书）：多次分享使用经验，提出多项大数量场景下 GC 优化建议。
*   杜旻翔（kl7sn，石墨文档）、彭友顺（askuy，石墨文档）：贡献了 ClickHouse Flusher。
*   周弘懿（pj1987111，阿里云 EMR 团队）：贡献了 Fields\_with\_conditions Processor 及多篇案例分享。
*   梁若羽（liangry， UC）：贡献 Configserver 代码优化与案例。

**企业持续参与贡献**

经过两年的开源建设，我们看到越来越多来自电商、交通出行、社交、旅游等不同行业的开发者、企业开始了解 iLogtail、使用 iLogtail、反哺 iLogtail。秉承着开源分享精神，这些企业与开发者近距离交流可观测采集相关技术、解决方案及实践案例。这不仅促进了 iLogtail 的功能演进与生态发展，也为开源项目的持续发展奠定了坚实的基础。

![图片](/images/jueJin/040f86912bf54a9.png)

**同程旅行**通过部署 iLogtail 以替换 FileBeat，有效缓解了大数据组件日志采集时的高延迟及资源过载问题，优化了日志采集与处理效能。针对云环境中的大数据组件，根据日志流量差异实行策略化采集：对大流量组件采用 Sidecar 模式并行采集，确保高效；小流量组件则部署 DaemonSet 模式，实现资源的经济性利用。很好地展现了同程旅行在日志采集与管理领域的精细化能力。

![图片](/images/jueJin/d348f0b168ac426.png)

**滴滴出行**基于对 iLogtail 卓越采集性能与高效资源利用的认可，已将其整合进主机与 K8s 环境下的日志采集流程，并推送至后端消息队列系统。目前处于灰度验证阶段，相信未来在滴滴发挥更大的价值。

![图片](/images/jueJin/4d01d37799c24f7.png)

**UC** 使用 iLogtail 替代传统的 ELK 栈中的 FileBeat  和 Logstash，并利用开源版 Configserver 构建了采集配置管控系统。通过基于 Configserver 的可扩展接口进行了一系列的优化动作，包括 Agent 生命周期管理与存活状态判断、扩展了 Agent 按标签分组能力、基于云数据库的持久化、 iLogtail 运行状态可视化，成功生产环境应用，并称“ConfigServer 是皇冠上的明珠”。

![图片](/images/jueJin/5e09218e3bc5440.png)

**小红书**广泛部署 iLogtail 于Kubernetes（K8s）环境中，针对标准输出及文件日志采集需求；依托 gRPC 协议设计实现级联架构，增强系统灵活性与效率；引入 iLogtail 作为轻量化计算组件，替代 Logstash 承担 Kafka 消息消费任务，优化资源利用与提升处理速度。

![图片](/images/jueJin/9667d9276847494.png)

**石墨文档**将 iLogtail 成功与 ClickHouse 相结合，并借助 ClickVisual 打造轻量级的开源日志查询、分析、报警的可视化平台。

![图片](/images/jueJin/4deeeaf8d311482.png)

总结过往两年，我们发现开发者与企业对数据采集器的期望已向更高层次迈进，不仅重视其高性能与高可靠性，还迫切需求具备强大的通用计算能力、全面覆盖异构系统的 All-In-One 方案（集日志、指标、跟踪于一体），强调高度的可扩展性及支持多样化灵活部署的能力，以适配日益复杂和动态变化的业务场景。

### 社区活动精彩不断

本着开源分享精神与推动可观测领域技术演进的初衷，在社区建设方面，iLogtail 社区发布贡献者任务、发布开发者勋章，通过“开源直通车”校园活动、“开源之夏”活动强化与开发者的连接与互动，并与 OpenKruise、ClickVisual、OpenSergo 等知名开源项目联动，促进开源生态的不断壮大。

与此同时，我们相信项目演进离不开社区开发者的群策群力，因此定期召开线上开发者例会，讨论社区发展路线的同时，分享实际使用过程中的最佳实践。截止目前，已召开近 20 场例会，超过 500 位开发者参与其中。

![图片](/images/jueJin/4281dd6df849411.png)

自 2022年7月 iLogtail 项目宣布完整开源并推出首个社区版以来，如今已两周年有余。这段时间里，我们见证了项目及社区的蓬勃成长，目睹了众多开发者与企业的加入，共同推动项目在功能更新、性能提升、稳定性加强以及生态合作等方面不断演进。

回顾过去两年，我们不仅在技术上取得了诸多突破与进步，同时积累了宝贵的开源社区建设经验。现在，在开源两周年到来之际，我们回顾这段旅程的同时，也在规划未来发展蓝图。我们憧憬着构建一个更加开放、包容的 iLogtail 开源社区，更好地服务于更多开发者与企业。

项目焕新与升级
-------

值此龙年盛夏，适逢开源项目两周年庆典之际，我们隆重宣布 iLogtail 品牌正式升级为 LoongCollector。

![图片](/images/jueJin/d9df2e65daef4d4.png)

#### 品牌寓意：

LoongCollector，灵感源于东方神话中的“中国龙”形象，Logo 中两个字母 O 犹如龙灵动的双眼，充满灵性。

龙的眼睛具有敏锐的洞察力，正如 LoongCollector 能够全面精准地采集和解析每一条可观测数据；龙的灵活身躯代表了对多变环境高度的适应能力，映射出 LoongCollector 广泛的系统兼容性与灵活的可编程性，可以满足各种复杂的业务需求；龙的强大力量与智慧象征了在高强度负载下卓越的性能和无与伦比的稳定性。最后，期待 LoongCollector 犹如遨游九天的中国龙，不断突破技术边界，引领可观测采集的新高度。

#### 定位：

*   中文：LoongCollector 是一款集卓越性能、超强稳定性和灵活可编程性于一身的数据采集器，专为构建下一代可观测 Pipeline 设计。
*   英文：LoongCollector is an high-performance, reliable, and programmable collector designed for building next-generation observability pipelines。

#### 愿景：

这一品牌进化之举，不仅是对 LoongCollector 技术发展路线的重申，更是向业界宣告了我们矢志不渝的愿景：打造业界领先的“统一可观测 Agent（Unified Observability Agent）”与“端到端可观测 Pipeline（End-to-End Observability Pipeline）”。

LoongCollector 的品牌进化，不仅仅是技术上的革新，更是我们对开源精神与技术远见的全面诠释与坚定承诺。

### 坚持长期主义

LoongCollector 社区将紧密围绕既定的愿景蓝图，专注于核心价值与竞争力提升。主要表现在如下方面：降低机器资源成本，提高稳定性；打造畅通的数据链路，丰富上下游；增益数据价值，自动贴标，灵活处理；降低接入运维人力成本，易配置，有管控。

为了达到这些核心价值能力提升的目的，LoongCollector 将坚持如下长期主义发展策略。

#### 性能可靠，无懈可击 Uncompromised Performance and Reliability

LoongCollector 始终将追求极致的采集性能和超强可靠性放在首位，坚信这是实践长期主义理念的根基。我们深知，LoongCollector 核心价值在于为大规模分布式系统提供稳固、高效的可观测性数据统一采集 Agent 与端到端 Pipeline。不管在过去、现在、未来，LoongCollector 都将持续通过技术革新与优化，实现资源利用效率的提升与在极端场景下的稳定运行。

![图片](/images/jueJin/ff631a056d184cc.png)

#### 遥测数据，无限边界 Unlimited Telemetry Data

![图片](/images/jueJin/19090a0830554ac.png)

LoongCollector 坚信 All-in-One 的设计理念，致力于所有的采集工作用一个 Agent 实现 Logs、Metric、Traces、Events、Profiles 的采集、处理、路由、发送等功能。展望未来，LoongCollector 将着重强化其 Prometheus 抓取能力，深度融入 eBPF（Extended Berkeley Packet Filter）技术以实现无侵入式采集，提供原生的指标采集功能，做到真正的 OneAgent。

同时，秉承开源、开放的原则，积极拥抱 OpenTelemetry、Prometheus 在内的开源标准。开源两年以来，也收获了 OpenTelemetry Flusher、ClickHouse Flusher、Kafka Flusher 等众多开源生态对接能力。作为可观测基础设施，LoongCollector 不断致力于完善在异构环境下的兼容能力，并积极致力于实现对主流操作系统环境的全面且深度的支持。

K8s 采集场景的能力一直都是 LoongCollector 的核心能力所在。众所周知在可观测领域，K8s 元数据（例如 Namespace、Pod、Container、Labels 等）对于可观测数据分析往往起着至关重要的作用。LoongCollector 基于标准 CRI API 与 Pod 的底层定义进行交互，实现 K8s 下各类元数据信息获取，从而无侵入的实现采集时的 K8s 元信息 AutoTagging 能力。

#### 编程管道，无与伦比 Unrestricted Programmable Pipeline

LoongCollector 通过 SPL 与多语言 Plugin 双引擎加持，构建完善的可编程体系。

*   不同引擎都可以相互打通，通过灵活的组合实现预期的计算能力。
*   设计通用的 Event 数据模型，可扩展表达 Logs、Metric、Traces、Events、Profiles 等在内的多种可观测类型，为通用计算提供便捷。

![图片](/images/jueJin/70564d2f19004b8.png)

开发者可以根据自身需求灵活选择可编程引擎。如果看重执行效率，可以选择原生插件；如果看重算子全面性，需要处理复杂数据，可以选择 SPL 引擎；如果强调低门槛的自身定制化，可以选择扩展插件，采用 Golang 进行编程。

![图片](/images/jueJin/c4b295ee18a2425.png)

### 配置管理，无忧无虑 Unburdened Config Management

在分布式系统复杂的生产环境中，管理成千上万节点的配置接入是一项严峻挑战，这尤其凸显了在行业内缺乏一套统一且高效的管控规范的问题。针对这一痛点，LoongCollector 社区设计并推行了一套详尽的 Agent 管控协议。此协议旨在为不同来源与架构的 Agent 提供一个标准化、可互操作的框架，从而促进配置管理的自动化。

在此基础上，社区进一步研发 ConfigServer 服务平台实现 ConfigServer 服务，可以管控任意符合该协议的 Agent。这一机制显著提升了大规模分布式系统中配置策略的统一性、实时性和可追溯性。ConfigServer 作为一款可观测 Agent 的管控服务，支持以下功能：

*   以 Agent 组的形式对采集 Agent 进行统一管理。
*   远程批量配置采集 Agent 的采集配置。
*   监控采集 Agent 运行状态，汇总告警信息。

同时，对于存储适配层进行了抽象，便于开发者对接符合自己环境需求的持久化存储。

![图片](/images/jueJin/630f256f0f4f4c2.png)

LoongCollector 极大地完善了自身可观测性的建设。不管是 LoongCollector 自身运行状态，还是采集 Pipeline 节点都有完整指标。开发者只需要将这些指标对接到可观测系统，即可体验对 LoongCollector 运行状态的清晰洞察。

![图片](/images/jueJin/6de061a201e541a.png)

### 核心场景：不仅仅是 Agent

![图片](/images/jueJin/f23a3bf94f6c4a1.png)

作为一款高性能的可观测数据采集与处理 Pipeline，LoongCollector 的部署模式在很大程度上能够被灵活定制以满足各种不同的业务需求和技术架构。

1.  **Agent 模式：As An Agent**
    
    *   LoongCollector  作为 Agent 运行在各类基础架构节点上，包括主机或 K8s 环境。每个 LoongCollector 实例专注于采集所在节点的多维度可观测性数据。
    *   可以充分利用本地计算资源，实现在数据源头的即时处理，降低了数据传输带来的延迟和网络流量，提升了数据处理的时效性。
    *   具备随节点动态扩展的自适应能力，确保在集群规模演变时，可观测数据的采集与处理能力无缝弹性伸缩。
2.  **集群模式：As A Service**
    
    *   LoongCollector 部署于一个或多个核心数据处理节点，以多副本部署及支持扩缩容，用于接收来自系统内 Agent 或 开源协议的数据，并进行转换、汇集等操作。
    *   作为中心化服务，便于掌握整个系统的上下文，强化了集群元数据的关联分析能力，为深入理解系统状态与数据流向奠定了基础。
    *   作为集中式服务枢纽，提供 Prometheus 指标抓取等集群数据抓取和处理能力。
3.  **轻量流计算模式：As A Stream Consumer**
    
    *   LoongCollector 与消息队列配合，利用消息队列的天然缓冲特性实现数据流的平滑处理，有效应对流量峰值与低谷，保障了对数据流的实时捕获、灵活处理及高效分发能力。
    *   借助 SPL 或多语言 Plugin 引擎的处理能力，使轻量级的数据处理、流式数据聚合、过滤、分发成为可能。

行业对比
----

在可观测领域，Fluent Bit、OpenTelemetry Collector 及 Vector 都是备受推崇的可观测数据采集器。其中，FluentBit 小巧精悍，以性能著称；OpenTelemetry Collector 背靠 CNCF，借助 Opentelemetry 概念构建了丰富的生态体系；而 Vector 在 Datadog 加持下，则通过 Observability Pipelines 与 VRL 的组合，为数据处理提供了新的选择。

LoongCollector 则立足日志场景，通过持续完善指标、跟踪等场景实现更全面的 OneAgent 采集能力；依托性能、稳定性、Pipeline灵活性、可编程性优势，打造核心能力的差异化；同时，借助强大的管控能力，提供了大规模采集配置管理能力。更多详见下表，绿色部分为优势项。

![图片](/images/jueJin/2c110312035f422.png)

RoadMap
-------

未来，LoongCollector 社区将持续围绕长期主义进行建设，打造核心竞争力。同时，也期待更多小伙伴的加入。

![图片](/images/jueJin/16cba3d12bea465.png)

*   通过框架能力增强，构建高性能、高可靠的基础底座。
    
    *   通用发送重构框架
    *   Golang & C++ Pipeline 全链路打通
    *   多目标发送 Fan-out 能力
    *   采集配置独立加载
    *   不同发送目标的流水线间故障隔离
    *   不同类型输入插件的流水线间根据优先级调度
    *   整体内存控制，防止 OOM 和加剧系统不稳定
*   通过采集能力丰富，打造 All In One 采集器。
    
    *   Stdout C++版日志采集上线
    *   文件采集插件支持多路径
    *   eBPF 支持网络监控、HTTP监控
    *   eBPF 支持进程指纹采集
    *   eBPF 支持 Profiling
    *   原生 Node 级指标采集能力
    *   Prometheus Exporter 指标抓取能力完善
*   通过可编程性，提升通用计算能力。
    
    *   Tag 处理能力
    *   Golang 插件 V2 Pipeline 补齐
    *   通用 logtometric 插件
    *   SPL 支持 Agg 等更多通用算子
*   通过管控与可观测能力，提升易用性。
    
    *   全新 Configserver 管控协议
    *   托管版 Configserver
    *   开源版 Configserver 扩展更多分布式能力
    *   框架类（队列资源、线程数等）指标完善
    *   可观测数据支持 Prometheus Exporter
*   下游生态支持：与更多开源消息队列、存储分析系统集成。
    

写在最后
----

凡是过往，皆为序章；iLogtail 社区，是我们共同编织的果实。所有将来，皆为可盼；LoongCollector，是我们共筑的未来。

开源两周年的成长告诉我们：开源比闭源更有希望，同行比独行更有分量。在眺望目标的过程中，感恩正在身边的每一位朋友，是你们贡献了开源之路上的动力与灵感，是你们推动了 LoongCollector 的进步与完善。

技术共享一直是 LoongCollector 秉承的理念，如果以上内容让您感觉到兴奋，非常欢迎加入 LoongCollector 社区参与共建。“集百家之所长，融百家之所思”，希望跟开发者一起能够将 LoongCollector 的核心能力打造得更完善，上下游生态构建得更丰富。相信通过大家共同的努力，LoongCollector 将会被打造成业界顶级的可观测数据采集 Pipeline。