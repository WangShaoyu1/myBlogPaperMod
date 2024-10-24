---
author: "网易云音乐技术团队"
title: "云音乐 FinOps 体系建设"
date: 2023-11-16
description: "云音乐设计研发了 FinOps 一站式平台，满足对成本洞察、优化和运营的需求，协同业务获得最大的投入产出比。"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:10,views:2975,"
---
> 本文作者：[吴荣军](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fiamyeka "https://github.com/iamyeka")

![题图](/images/jueJin/fda5b73e1ef04b4.png)

背景
--

当前互联网增长红利消失，要实现 "正循环中，做大用户规模"，就需要关注企业经营毛利和利润，除去内容成本，技术侧 IT 成本是非常大的一块，过去一年（2022 年），云音乐开始了技术侧降本增效，其中云原生、容器化主要做的事情包含：

*   [Horizon](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd%2Fhorizon "https://github.com/horizoncd/horizon") 一站式平台（云音乐自研且已开源的容器部署平台），全面推进业务云原生、容器化，实现资源精细化管理
*   Serverless 技术支持在离线混合调度大幅提升了资源的利用

经历了一年技术降本的实践，总结发现仍然有很多挑战：

*   **安迪 - 比尔定律**：DevOps 提效，会出现典型的安迪 - 比尔定律，资源越容易获取，用得也越多
*   **成本关注较少**：由于缺乏成本跟踪运营管理平台，所以业务线、平台方也主要关注研发、质量、业务增长，没有花太多的精力关注成本，而且对于没有货币化的资源用量，对业务和开发来说，其实相对模糊和没有 “概念” 的
*   **一本大账**：底层基础服务现在都是一本大账算，权责不清，相关干系人很难盘活推进治理
*   **增长控制难**：底层技术侧项目制的成本优化效果好，但是也很容易反弹，很难持续跟踪和控制成本增长
*   **缺乏平台支撑**：缺乏统一的成本运营管理平台，数据散落，跟踪大多依赖 excel 传递，效果和效率都不好

为了解决这些问题，结合音乐的现状，我们学习和借鉴了当前比较流行的 FinOps 云财务管理的理念：

> FinOps 是一种不断发展的云财务管理科学和实践，通过数据驱动支出决策帮助财务、技术和业务团队进行协作，使得组织能够获得最大的业务价值

本文将介绍云音乐内部自研的 FinOps 平台，将从 成本洞察、成本优化、成本运营 三个角度说明 FinOps 提供的平台能力支撑，希望能给

一些希望开发类似平台的人一些经验参考和启发。

介绍
==

名词解释
----

*   ROI：投资回报率（Return on Investment），是衡量投资项目盈利能力的指标。它通过计算投资项目的净利润与投资成本之间的比率来衡量投资的效益。公式为：ROI = （净利润 / 投资成本）\* 100%。一般来说，ROI越高，说明投资项目的盈利能力越好

成本洞察
----

成本洞察主要包含资源跟踪、成本可视化、成本分配和账单管理，也就是发现成本问题。

下图展示 FinOps 的基础架构图：

![image-20231116135508596](/images/jueJin/d9872e3eecff4ec.png)

成本采集需要做到：

*   **统一成本接入**：集团内部服务、账单系统是多样纷杂，导致对应账单和用量数据格式也不统一，Finops 首先需要解决统一数据接入的问题，对接外部系统，然后归一化汇聚到 FinOps 系统。
*   **资源货币化**：对业务和开发来说，资源用量的多少和对应的成本其实相对模糊和没有概念的，所以需要对内部服务产品进行定价、计费及统计，这样让业务和开发实际感知对应资源对应的成本，从而更好的驱动大家对项目 ROI 的评估。更多信息可查阅云音乐技术团队之前分享的这篇文章：[云音乐 KubeCost 助力 FinOps 降本增效](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FXRfqpGH6RIQTujHH8xeVnw "https://mp.weixin.qq.com/s/XRfqpGH6RIQTujHH8xeVnw")
*   **大账拆小账**：有很大一块成本都是没有拆分的大帐，例如计算资源（如一台物理机上部署了多个业务的云主机），内部的服务平台如发布平台和大数据处理平台等，相关成本都是直接归属相关负责平台的技术团队，上面业务并不感知这块计算资源的成本，所以也没有优化的动力

成本优化
----

可以通过 FinOps 查看到资源的利用率等指标，评估资源是否存在浪费，最后执行相关优化动作。

以云原生为例，目前会给出 CPU 和 Memory 利用率的评级打分，如下表格，当前对于 CPU、内存利用率为`P 不合格`、`B 糟糕`、`M 合格`的，都建议进行优化到至少`A 良好`的标准

![image-20231116100806792](/images/jueJin/6e5873c1a90343a.png)

实际操作层面，基于**负责人机制**，我们设计了**治理**页面，针对云原生容器、大数据、PaaS服务等进行针对性的展示，如下为容器内存治理的界面：

![image-20231116101514944](/images/jueJin/f4744b5e57a34d9.png)

每个进入页面的人会看到自己名下有哪些待治理的集群，昨日的峰值内存利用率如何，当前内存规格和推荐规格是多少，如果采用新的规格，每个月能节省的成本有多少，方便应用负责人针对性地进行优化，也展示了近14d待治理集群数的变化趋势，方便负责人验收治理效果。部门负责人可以看到本部门下所有待治理的集群，各个组员待治理集群数的排名，方便跟踪优化

成本运营
----

![img](/images/jueJin/e14c960793f14a2.png)

成本优化推进之后，如何长期控制增长，就依赖持续的成本运营，这里驱动的基本逻辑就是：

*   首先 - **平台服务方**：这里主要包括容器、大数据、中间件等内部私有平台服务提供方
    *   定价计费：货币化所有资源成本和收入，让所有人切实感知成本，目前包括大数据、云原生、中间件日志服务等
    *   模式转变：服务平台从成本部门转变为经营收益部门，驱动内部平台提供更有竞争力的服务，避免内部腐化
*   然后 - **业务线**：
    *   通过内部和外部平台服务统一分账到业务线，业务线感知资源使用成本
    *   再通过分析成本组成，进而可以计算业务 ROI
    *   根据实际业务 ROI 情况，决策控制和优化资源用量
*   最后 - **开发**：
    *   收到来自业务线和平台服务方治理优化的需求，然后根据 FinOps 提供的利用率等手段进行评估和优化

![img](/images/jueJin/701dcb9739fc418.png)

这其中的核心就是通过 **治理分权** + **数据驱动** 去盘活所有干系人参与进来，进而全面建立成本和用量意识，持续改进运营流程。

（1）治理分权：FinOps 首先通过 **类别（Category）** 的功能，可以实现**任意数据范围的圈选**，使得管理者、财务、业务负责人、一、二、三、四级部门负责人以及每一个开发都能看到自己相关成本和用量等数据，进而将治理分权下放给所有干系人

其中 Category 的核心逻辑是设计了如下 json 表达式来圈选数据范围：

```json
    {
        "and": [
            {
                "tags": {
                "key": "department",
                    "values": [
                    "技术中心"
                ]
            }
        }
    ]
}
```

如上就表示圈选名为 “技术中心” 的部门下的所有成本、用量数据到一个类别下

（2）数据驱动：成本用量等数据贯穿整个运营的生命周期，所有干系人都根据数据指标来跟踪和指导下一步动作。例如业务负责人根据成本评估 ROI；或者开发，可以根据其提供服务使用资源的利用率数据，识别出哪些资源浪费，进而可以推动优化，简单的可以通过降配、闲置资源回收，复杂的可以升级架构来提升资源利用率，例如从固定副本数升级为 Serverless 弹性伸缩。

未来规划
----

*   成本洞察：
    *   成本分配：目前音乐内部仅有部分服务，例如容器，大数据、物理机、RDS 等已经将成本拆分到部门和业务线，未来还会和更多的服务提供方合作（例如 CDN、中间服务日志、消息队列等），通过标签等方式，将资源用量和成本拆分业务线和部门，避免 “糊涂账”
    *   资源生命周期管理：资源挂到人头上，确保业务线等必要的标签打上且正确，实现资源从生产、转移（业务变动、人员离职、转岗）到结束的整个生命周期跟踪
*   成本优化：
    *   成本治理层面，目前探索了云原生容器领域的治理实践和闭环，后续将把经验拓展到PaaS服务、大数据任务等更多的场景
    *   架构治理：架构师团队联合推动一些技术架构治理和升级：例如切换至 JDK 17 部署等
*   成本运营：
    *   通过责任人机制的建立高效推进各项资源治理 (所有**Poor**评价以及以下治理到**Accept**评价以及以上)
    *   运营机制：设计奖惩，激发自主降本，保持良性循序
    *   和内部其他核心平台联动，如和CICD平台联动展示成本信息和优化建议，将成本治理变成大家日常都可以轻松完成的事情

参考
==

*   OpenCost: [github.com/opencost/op…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fopencost%2Fopencost%2Fblob%2Fdevelop%2Fspec%2Fopencost-specv01.md "https://github.com/opencost/opencost/blob/develop/spec/opencost-specv01.md")
*   FinOps: [www.finops.org/introductio…](https://link.juejin.cn?target=https%3A%2F%2Fwww.finops.org%2Fintroduction%2Fwhat-is-finops%2F "https://www.finops.org/introduction/what-is-finops/")
*   Clickhouse: [clickhouse.com/docs/en/int…](https://link.juejin.cn?target=https%3A%2F%2Fclickhouse.com%2Fdocs%2Fen%2Fintro "https://clickhouse.com/docs/en/intro")
*   毛老师倾情分享B站FinOps实践思路: [www.bilibili.com/video/BV1ca…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1ca4y1T7q8%2F%3Fvd_source%3Db9faf4307fb32e2acc499b5e719146d7 "https://www.bilibili.com/video/BV1ca4y1T7q8/?vd_source=b9faf4307fb32e2acc499b5e719146d7")

最后：
===

![{"anchor_href":"","expected_size":"-1,-1","external_info":"","id":"1066","image_margin":2,"image_url":"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66ad83c1c9a744a8a53e4af1ef40e6ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=985&s=101564&e=png&b=fefefe","original_name":"","original_path":"C:/Users/wb.qiujunjie02/AppData/Local/netease/popo/users/wb.qiujunjie02@mesg.corp.netease.com/image/d1cba265d31bca682b7eaa839cfd5943.png","original_size":"-1,-1","press_can_drag":true,"show_in_image_viewer":true}](/images/jueJin/6551ecbf659572f.png)

更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")