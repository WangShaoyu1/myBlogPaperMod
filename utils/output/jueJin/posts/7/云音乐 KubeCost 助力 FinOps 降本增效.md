---
author: ""
title: "云音乐 KubeCost 助力 FinOps 降本增效"
date: 2023-06-29
description: "基于 Kubernetes 实现资源货币化，协助推进大账拆分小账，为 FinOps 提供数据来源支撑"
tags: ["Kubernetes","自动化运维","DevOps中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:13,views:7224,"
---
> 本文作者：[木心](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwork-jlsun "https://github.com/work-jlsun")

背景
--

目前很多互联网公司都告别了过去流量和业务迅猛增长的时期，进入了一个相对稳定发展的新阶段，业务增长可预期，成本控制成为了一个重要的议题。

在典型的互联网公司的成本组成中，IT 成本占比并不低，技术成本与人力成本的比例差不多在 1:2 ~ 1:2.5 左右， 降低 IT 成本显然能带来立竿见影的效果。

10 年来云计算、云原生、容器、Kubernetes、DevOps 等技术的高速发展，使得 IT 成本的管理变得更加复杂，也给成本的管理带来了更多的挑战。

目前大多数互联网公司，都基于 Kubernetes 实现资源的统一管控，实现统一的大池子，基于此的统一调度、分配、混合云等都是过去降本增效的重要手段。

在网易云音乐，我们通过 2 年多的时间完成了在线业务几乎 100% 的容器化，通过超售、统一调度、混合云、混合部署等行之有效的手段使得在线资源峰值利用率提升到 50%+，每年为公司带来数千万的成本节省。

但是，随着成本治理的深入，我们会发现，资源治理团队的压力会越来越大。因为研发一侧 DevOps 很容易获取资源，导致资源的增长也依然非常地快，并且在流程上缺乏管控（因为本质上从 DevOps 角度希望提效，传统的工单审批机制被摈弃）。

在云原生时代，随着资源池化之后，成本默认归属到了技术中心部门，业务部门对成本没有感知，同时缺乏有效的手段针将成本拆分到业务线，出现了典型的 **大账问题** ，导致无法有效评估业务 ROI。

![cost-challenge.png](/images/jueJin/5c9d5bfc72602a7.png) 总结一下存在的变化与挑战:

*   **去中心化**：随着云和云原生应用的蓬勃发展，传统的集中式财务预算和 IT 管理模式在向以业务为导向的分布式决策转型
*   **动态变化**：云上的动态环境和弹性能力导致费用随业务负载不断变化
*   **过剩浪费**：对资源和服务的即时访问使创新成为可能，但往往导致供应过剩

这也就驱动了云音乐推进 **FinOps** 系统建设，即通过数据驱动工程、财务、技术、业务团队协作，实现对成本的洞察、优化和运营，驱动建立更广泛更多角色参与得经营责任制，协助组织实现 ROI 的最大化。

![finops-framework.png](/images/jueJin/fe62402028bcdad.png)

云音乐的 FinOps 系统目前还在内部使用，建设以及完善，后续我们会择机开源出来，共享给社区。

在 FinOps 开源之前，我们第一阶段先介绍下 "基于 Kubernetes 实现资源货币化，协助推进大账拆分小账" 的组件 **KubeCost**。

KubeCost
========

KubeCost 是一个基于 Kubernetes 的资源成本分析工具，通过对 Kubernetes 集群资源的动态分析，将成本动态的分配到业务线，让业务线更加地关注成本，从而更好地利用资源，提高资源利用率，提高业务 ROI。

功能介绍
----

### 1 支持多种计费方案

比如包年包月、按量计费。

*   **包年包月**：目前大多数互联网企业都是按照包年包月的方式购买云资源，或者拥有内部固定的专有资源池。在固定拥有资源池的情况下，本质上企业需要按照业务峰值购买资源。自然需要按照业务峰值向业务分摊费用。
*   **按需计费**：在固有资源池情况下，往往有很多低峰期的资源是较为浪费的，为了提高资源利用率， 需要通过技术手段去充分利用低谷资源，比如在音乐场景，一些音频转码，音频特征分析等可以接受 T+1 的业务场景往往可以填补这些低谷。在这种场景下，需要按照业务实际使用的资源进行费用分摊，而不是按照常驻峰值。

备注：SPOT 资源（比如为了引导用户使用夜间资源，不同时间点价格不同）暂时不支持，后续会支持。

### 2 支持混合云多云计费

除了使用内部固有资源，云音乐也在使用公有云资源，比如阿里云，AWS 等。针对这种混合云以及多云场景，需要支持不同环境资源采用不同的计费单价。

### 3 计费模型

遵循 OpenCost 标准的计费模型，[OpenCost Specification](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fopencost%2Fopencost%2Fblob%2Fdevelop%2Fspec%2Fopencost-specv01.md "https://github.com/opencost/opencost/blob/develop/spec/opencost-specv01.md")

基本的原则就是， **allocate = Max(Usage, request)**

为了确保 **计费稳定、可靠、可回赎、可重复**， 基础计费单元，默认按照 10min，并且按照墙上时间对齐作为稳定的基础计费数据来源。

下图为基础的计算过程示例: ![kubecost-calculate.jpg](/images/jueJin/ba867fdb6f86737.png)

### 4 支持的计费资源类型

*   CPU
*   Mem
*   GPU
*   等等

在 Kubernetes 中，交付的 workload 非常多样，无法使用云厂商虚拟机的按照既定的规格分配进行计费。因此目前是按照不同资源的单价对资源实体，比如 POD 进行资源核算进行独立计费，分别计算出 CPU 费用，内存费用等，再聚合为 POD 的总费用。进一步汇总到某个应用微服务的费用。

### 5 支持丰富地过滤以及聚合

1.  **支持按照 Label 进行过滤**：提供类似 kubernetes 接口的 label filter 机制，方便用户按照自己的业务场景（label）进行过滤
2.  **支持 Label 聚合**：按照 Namespace、Cluster，以及 POD 的 Label 进行聚合。

比如如下为查询，所有通过云音乐标准 DevOps（[HorizonCD](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd "https://github.com/horizoncd")）系统接入的应用的成本的接口。

```bash
POST http://localhost:8080/queryrange
Content-Type: application/json

    {
    "startTime": 1685894400,
    "endTime": 1685980800,
        "labelSelector": {
            "matchExpressions": [
                {
                "key": "label_cloudnative_music_netease_com_application",
                "operator": "Exists"
            }
        ]
        },
            "groupBy":{
                "groupDefinition":[
                    {
                    "type": "label",
                    "key": "label_cloudnative_music_netease_com_cluster"
                        },{
                        "type": "time",
                        "key": "10m"
                    }
                ]
            }
        }
```

架构
--

![kubecost-architecture.jpg](/images/jueJin/befbc8206c468c6.png)

KubeCost 的架构如上图所示，架构设计主要考虑几点:

1.  **低侵入**：方案尽量做到更低的侵入性，保障对业务流程的影响最小化，所以未考虑使用 webhook 或者 sidecar 等方案，而是基于旁路指标采集的方案。
2.  **可靠性**：确保系统组件故障对整个计费系统的影响最小化
    *   ApiServer + etcd: 3 副本以上部署，一定程度保障可靠性。另外管控面挂了，基本等同于管控面关了，无法新增 POD，也就是无法新增成本。历史资源申请数据都已经采集到 Prometheus 中。
    *   prometheus：多实例，数据双备份存储。
    *   Kubelet：故障之后，相关节点的 usage 数据获取不到。但主要也是某个节点没有数据，影响范围较小。
3.  **扩展性**: 核心提供最小力度的原子成本数据，通过 OpenAPI 拓展支持各种计费方式，比如日 95 线峰值的计费、按需、包年包月等等不同的计费资源类型。
4.  **大规模**：支持 10w+，甚至百万以上的 POD 的成本数据统计和查询，数据存储选用使用 ClickHouse 进行数据的存储。按照测试 12w 两级别的 POD，10min 核算一次成本情况下，一个月压缩后存储量大约在 20GB 左右，本地一块 SSD 即可轻松保存几年的数据。
5.  **易使用**：可以灵活的通过各种不同的方式进行过滤和聚合。

如上基础架构确保最简单最原始的数据的可靠保障，架构可以容忍 KubeCost 不断迭代和更新，结合底层数据幂等支持，可以方便地实现故障情况下简单重试，系统鲁棒性较高，也很方便进行数据正确性验证。另外复杂的计费逻辑可以放在 Plugin 中实现，保障系统的可扩展性和故障隔离性。

底层数据模型
------

如下为底层数据模型，采用 ClickHouse ReplacingMergeTree 方式，使得目前计算模式下故障情况下可以快速重试，而不会重算，大大减少故障情况下的手工运维。

```vbnet
CREATE TABLE IF NOT EXISTS kubecost.kube_billing_infos
(
create_time        Int64 COMMENT 'record create time',
start_time         Int64 COMMENT 'billing start time',
end_time           Int64 COMMENT 'billing end time',
item               String COMMENT 'billing item, example: cpu, mem, gpu, etc',
cost               Float64 COMMENT 'billing cost',
currency           String COMMENT 'billing currency',
entity_primary_key String COMMENT 'entity primary key, cluster/namespace/pod/container',
usage_info Map(String, Float64) COMMENT 'etc:usage,request,allocate',
label_info Map(String, String) COMMENT 'basic labels',
price_info         String COMMENT 'cost price info'
) Engine = ReplacingMergeTree(create_time)
PARTITION BY toYYYYMM(FROM_UNIXTIME(start_time))
ORDER BY (start_time, end_time, item, entity_primary_key)
```

最后
--

目前云音乐内部已经上线了第一版的 Finops 和 KubeCost 系统，这对于一些对成本比较敏感的团队是一个有效的支撑工具，他们可以基于部门、业务线等各种维度快速定位到自己关心的成本范围， 对于更好地评估 ROI 起到了关键作用。 另外为了驱动建立更广泛更多角色参与得经营责任制，我们设计了 **Category** 模型，支持根据标签任意圈选 Finops 里汇聚的任意范围成本、用量和预算数据，非常灵活有效。 后续我们将对 Finops 设计和实现上的方方面面进行整理总结，最终贡献到开源社区，欢迎大家过来交流。

最后欢迎各位关注了解云音乐标准 DevOps（[HorizonCD](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd "https://github.com/horizoncd")）系统，已在今年一月份开源，其受 ArgoCD、AWS Proton 启发，实践 Gitops 理念，通过模板体系进行最大实践，并且有完善的系统管理、权限、外部系统集成体系， 可点击 [官网地址](https://link.juejin.cn?target=https%3A%2F%2Fhorizoncd.github.io%2F "https://horizoncd.github.io/") 了解更多详情，欢迎关注，提PR、issue，加入我们的社区，一起打磨完善产品，为中国云原生领域的发展做出贡献。

参考
==

*   OpenCost: [github.com/opencost/op…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fopencost%2Fopencost%2Fblob%2Fdevelop%2Fspec%2Fopencost-specv01.md "https://github.com/opencost/opencost/blob/develop/spec/opencost-specv01.md")
*   FinOps: [www.finops.org/introductio…](https://link.juejin.cn?target=https%3A%2F%2Fwww.finops.org%2Fintroduction%2Fwhat-is-finops%2F "https://www.finops.org/introduction/what-is-finops/")
*   Labels and Selectors: [kubernetes.io/docs/concep…](https://link.juejin.cn?target=https%3A%2F%2Fkubernetes.io%2Fdocs%2Fconcepts%2Foverview%2Fworking-with-objects%2Flabels%2F "https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！

```

```