---
author: "字节跳动技术团队"
title: "字节跳动云原生成本优化实践开源项目 Katalyst ｜社区编程挑战启动！"
date: 2023-09-19
description: "Katalyst 是字节跳动开源的成本优化实践系统，致力于解决云原生场景下的资源不合理利用问题，为资源管理和成本优化提供解决方案。真实开源项目体验、开源导师一对一辅导、丰厚的项目激励，等你来！"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:2,comments:1,collects:6,views:13725,"
---
Katalyst 简介
===========

> GitHub Repo：[github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core "https://github.com/kubewharf/katalyst-core")

Katalyst 是字节跳动开源的成本优化实践系统，致力于解决云原生场景下的资源不合理利用问题，为资源管理和成本优化提供解决方案。

Katalyst 于今年3月正式开源，从0.1.0 版本发布至今，经过0.2.0版本迭代，已经完成若干核心能力的输出。8月8日 Katalyst [发布 v0.3.0 版本](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FkyYHvr-H5q2BOIPvoH6VXA "https://mp.weixin.qq.com/s/kyYHvr-H5q2BOIPvoH6VXA")，核心功能包括 KCNR API 能力增强，框架可拓展性增强，混部能力增强等，具体见 Katalyst [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fmilestone%2F3%3Fclosed%3D1 "https://github.com/kubewharf/katalyst-core/milestone/3?closed=1")。

活动背景
====

Katalyst 作为字节跳动云原生团队持续投入的开源项目，看重开源的长期价值，重视开源社区的反馈与参与，同时也非常鼓励高校同学在早期参与到真实的开源项目中，体验开源社区的运作方式，提升个人能力。在之前参与的 [GLCC 编程夏令营](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FAs4MjrUn67fxVCvXu_ZMYg "https://mp.weixin.qq.com/s/As4MjrUn67fxVCvXu_ZMYg")中， Katalyst 发布的相关议题吸引了不少高校同学报名参与，项目过程中导师和项目同学积极沟通可行性方案，帮助同学参与项目开发。

由于之前活动的议题限制，当时仅有一位同学最终参与到项目中。为了鼓励更多对云原生感兴趣的高校学生参与到社区，也希望社区有更多的外部声音和新鲜力量，我们计划将此与高校同学协作的开发模式在项目版本迭代过程中进行复用，为高校同学提供参与开源社区的路径与指导，同时帮助社区收集更多的反馈与需求。基于此，我们将于 9 月在社区发布 Katalyst 开源社区【**编程挑战**】活动，根据社区未来新版本中的相关能力规划，发布议题任务，邀请高校同学参与项目部分 issue 的设计与开发，并为完成任务的同学提供一定的奖励。

议题介绍
====

**议题一：Support for** **OOM** **priority as a** **QoS** **enhancement 支持 OOM 优先级作为 QoS 增强**

> GitHub issue: [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F216 "https://github.com/kubewharf/katalyst-core/issues/216")

**请在 Katalyst 增加以下能力：**

*   Users can specify the OOM priority as a QoS enhancement.
    
*   Implement OOM priority with `oom_score_adj`.
    
*   用户可以指定OOM优先级作为 QoS 增强
    
*   使用 `oom_score_adj`实现 OOM 优先级
    

**议题说明：**

Currently, Kubernetes will configure different `oom_score_adj` values for different QoS classes. However, the order of OOM also depends on other dimensional factors such as the memory usage of the container.

In the colocation scenario, it's important to strictly ensure that web services are terminated later than batch jobs due to OOM when the cluster's memory resources become scarce.

目前，Kubernetes 为不同的 QoS 类配置不同的 `oom_score_adj` 值。然而，OOM 的顺序还取决于其他维度的因素，如容器的内存使用等。

在混部场景中，当集群内存资源变得稀缺时，必须严格确保批处理作业比 web 服务更早因 OOM 而终止。

**议题二：Support NUMA-granularity reporting for reclaimed resources 支持回收资源** **NUMA** **颗粒度上** **报**

> GitHub issue: [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F217 "https://github.com/kubewharf/katalyst-core/issues/217")

**请在 Katalyst 增加以下能力：**

Enhance the resource reporting mechanism to support reporting of reclaimed resources at the granularity of NUMA nodes.

增强资源上报机制，支持回收资源 NUMA 节点颗粒度的上报。

**议题说明：**

Currently, the reporting of reclaimed resources is performed at a node granularity level. However, in environments with NUMA architectures, this approach might lead to suboptimal scheduling result and potential pod evictions due to NUMA-level interference.

目前，回收资源的上报是在节点颗粒度级别进行的。然而，在具有 NUMA 架构的环境中，这种方法可能会导致次优调度结果和由于 NUMA 级别的干扰而导致潜在的 Pod 驱逐。

**议题三：Support inter-pod** **affinity** **and anti-affinity at** **NUMA** **level 支持 NUMA 级别** **pod** **间亲和性和反亲和性**

> GitHub issue: [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F220 "https://github.com/kubewharf/katalyst-core/issues/220")

**请在 Katalyst 增加以下能力：**

Support inter-pod affinity and anti-affinity at NUMA level in Kubernetes.

支持 Kubernetes 中 NUMA 级别 pod 间亲和性和反亲和性。

**议题说明：**

Currently, Kubernetes supports inter-pod affinity and anti-affinity at the node level. However, there is a growing need for extending this support to the NUMA level.

For example, in a tensorflow training job, high-memory bandwidth consuming pods, like workers, can impact the performance of other pods on the same NUMA node, such as parameter servers. Allocating these pods to different NUMA nodes can mitigate such interferences.

目前，Kubernetes 在节点级别支持 pod 间亲和性和反亲和性。然而，将这种支持扩展到 NUMA 级别的需求逐渐增加。

例如，在 tensorflow 训练中，高内存带宽消耗 worker，会影响同一 NUMA 节点上的参数服务器。将这些 pod 分配给不同的 NUMA 节点可以减轻这种干扰。

预期收获
====

1.  体验真实开源项目，熟悉开源社区运作流程，积累开发实践经验
2.  参与community meeting，与开源爱好者交流，了解社区动态
3.  项目 mentor 一对一辅导，面对面答疑
4.  完成项目的优秀 contributor 还可获得社区激励奖金 5000元（等额京东卡）

参与要求
====

1.  18岁以上高校在校学生
2.  热爱开源文化，接受开源协作模式

\*非高校学生如果对议题感兴趣，欢迎参与社区一起共建开发～

参与流程
====

1.  从以下 GitHub issue 中选择1个议题
    
    1.    [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F216 "https://github.com/kubewharf/katalyst-core/issues/216")
    2.    [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F217 "https://github.com/kubewharf/katalyst-core/issues/217")
    3.    [github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkatalyst-core%2Fissues%2F220 "https://github.com/kubewharf/katalyst-core/issues/220")
2.  发送个人简历+议题proposal 给相关联系人
    
    1.    联系人：唐同学
    2.    邮箱：[tangpengcheng.tangpc@bytedance.com](https://link.juejin.cn?target=mailto%3Atangpengcheng.tangpc%40bytedance.com "mailto:tangpengcheng.tangpc@bytedance.com")
3.  通过后将由项目导师联系沟通具体开发任务，启动开发
    
4.  完成任务后，需写一篇参与开源项目的经验与感受，在第三方社区（InfoQ/CSDN/知乎/开源中国等）或校园 blog 上发布
    

活动时间
====

*   报名时间：9月01日-9月22日
*   入选通知：9月23日
*   开发时间：9月24日-10月30日
*   文章发布时间：11月10日之前
*   优秀议题&同学公布：11月10日-11月15日

如有疑问，欢迎联系字节跳动云原生小助手(左图)，加入云原生交流群（右图）

![](/images/jueJin/aed4ac22497f482.png) ![](/images/jueJin/8eb4863b356e490.png)