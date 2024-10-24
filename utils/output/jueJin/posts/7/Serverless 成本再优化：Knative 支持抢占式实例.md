---
author: "阿里云云原生"
title: "Serverless 成本再优化：Knative 支持抢占式实例"
date: 2024-04-22
description: "Knative 是一款云原生、跨平台的开源 Serverless 应用编排框架，而抢占式实例是公有云中性价比较高的资源。Knative 与抢占式实例的结合可以进一步降低用户资源使用成本。本文介绍如何在"
tags: ["云原生","Serverless中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:1,views:901,"
---
作者：元毅、向先

Knative 是一款云原生、跨平台的开源 Serverless 应用编排框架，而抢占式实例是公有云中性价比较高的资源。Knative 与抢占式实例的结合可以进一步降低用户资源使用成本。本文介绍如何在 Knative 中使用抢占式实例。

背景信息
----

抢占式实例是一种低成本竞价型实例，您可以对阿里云当前闲置的资源出价，获得资源后运行容器，直到出价低于市场价格或者库存不足等原因导致资源回收。

Knative 是一款基于 Kubernetes 的开源 Serverless 应用编排框架，其目标是制定云原生、跨平台的 Serverless 应用编排标准。Knative 主要功能包括基于请求的自动弹性、缩容到 0、多版本管理、基于流量的灰度发布、函数部署以及事件驱动等。

![图片](/images/jueJin/ca7f128cb83844b.png)

Knative 与抢占实例结合
---------------

Knative 中提供了 Serverless 工作负载：Knative Service，可以基于请求自动扩缩容 Pod，使用抢占式实例的话只需要配置相应的 Pod 注解即可。而在 Virtual Node 根据 Pod 的注解自动申请对应的 ECI 资源规格。当前 Virtual Node 提供了抢占式实例自动替换能力，可以更加自动化的使用抢占式实例。

![图片](/images/jueJin/798fe7f78b3f44e.png)

Knative 结合抢占式实例的优势：

*   **Serverless 场景：** 短时 web 服务请求，资源随时使用，用完即释放，不会长时间占用资源。
*   **优雅下线的天然适配：** 在 Virtual Node 实现自动替换过程中，需要先删除 Pod，然后工作负载控制器再创建新的抢占式实例，这就要求业务容器具备优雅下线的能力。而在 Knative 中会为每个 Pod 设置 1 个 queue-proxy sidecar 容器，在删除 Pod 时，会先触发 queue-proxy 容器等待请求处理完成，然后再删除业务容器。
*   **成本敏感：** 对于使用 Knative 用户，更关心成本，因此支持抢占式实例更具吸引力。

### 如何做到抢占式实例自动替换

由于 ECI 抢占式实例在市场价格高于出价或实例规格库存不足时会被回收。因此，使用 ECI 抢占式实例在带来经济性的同时，也带来了应用稳定性的挑战。为尽量避免 ECI 抢占式实例回收导致的业务中断，容器服务 Virtual Node 在 ECI 抢占式实例回收前，通过发出的 SpotToBeReleased Event 和 Pod Condition 来通知用户。可以基于这些通知，进行抢占实例的优雅退出和 Pod 轮转等处理。

#### 优先使用抢占式实例

可以通过设置 k8s.aliyun.com/eci-spot-strategy 注解，如 SpotAsPriceGo 策略表示系统自动出价，跟随当前市场实际价格。创建后，可以稳定使用 1 小时，超出 1 小时保护期后，如果某一时刻的市场价格高于出价或实例规格库存不足，抢占式实例会被释放。在到达保护期之前，Virtual Node 会发出到期通知，然后会自动驱逐删除 Pod，然后 Knative 会自动创建新的抢占式实例 Pod，如果抢占成功，则继续通过抢占式实例提供服务。

![图片](/images/jueJin/dd9fa2dd12f3405.png)

#### 无抢占式实例，使用标准实例

如果想尽量保证服务的稳定性，避免申请抢占实例失败导致的服务受损。可以通过配置 k8s.aliyun.com/eci-spot-fallback: true，自动转为按量付费，以保证实例创建成功。

![图片](/images/jueJin/561d55766347480.png)

#### 抢占式实例中断通知

抢占式实例会在中断前 **3 分钟**发出 SpotToBeReleased Event，同时会更新 Pod Conditions 的 ContainerInstanceExpired 字段为 true。

Pod 的 Conditions 字段和 Events 字段显示如下。

![图片](/images/jueJin/1e8318c32b8c4d6.png)

#### 配置抢占式实例到期的优雅处理方式

为尽量避免 ECI 抢占式实例回收导致的业务中断，虚拟节点提供了可配置的 ECI 抢占式实例优雅下线的功能。您可以为抢占型 Pod 配置 annotations k8s.aliyun.com/eci-spot-release-strategy: api-evict。

那么当虚拟节点接收到 SpotToBeReleased Event 时，则会调用 Eviction API 来驱逐该抢占式实例。API 发起的驱逐将遵从您的 PodDisruptionBudgets 和 terminationGracePeriodSeconds 配置。使用 API 创建 Eviction 对象，类似于对 Pod 执行策略控制的 DELETE 操作。

1.  调用 API 请求：虚拟节点接收到 SpotToBeReleased Event，调用 Eviction API。
2.  PDB 检查：API 服务器验证与目标 Pod 关联的 PodDisruptionBudget。
3.  驱逐执行：如果API服务器允许驱逐，Pod 将按照如下方式删除。

1.  1.  API 服务器中的 Pod 资源会更新删除时间戳，之后 API 服务器会认为此 Pod 资源将被终止。此 Pod 资源还会标记上配置的宽限期。
    2.  本地运行状态的 Pod 所处的节点上的 kubelet 注意到 Pod 资源被标记为终止，并开始优雅停止本地 Pod。
    3.  当 kubelet 停止 Pod 时，控制面从 Endpoint 和 EndpointSlice 对象中移除该 Pod。因此，控制器不再将此 Pod 视为有用对象。
    4.  Pod 的宽限期到期后，kubelet 强制终止本地 Pod。
    5.  kubelet 告诉 API 服务器删除 Pod 资源。
    6.  API 服务器删除 Pod 资源。

4.  Knative Service：Knative 中会为每个 Pod 设置 1 个 queue-proxy sidecar 容器，在删除 Pod 时，会先触发 queue-proxy 容器等待请求处理完成，然后再删除业务容器。

#### 释放说明

抢占式实例创建成功后，在保护期内可以正常运行。超出保护期后，如果市场价格高于出价或者资源库存不足，抢占式实例会被释放。可以通过以下信息了解抢占式实例的释放情况。

*   **预释放事件**抢占式实例在释放前约 5 分钟，会产生 SpotToBeReleased 事件。**注意：ECI 会通过 Kubernetes Events 事件通知的方式告知您抢占式实例将被释放，** **在此期间，您可以做一定的处理来确保业务不受实例释放所影响。**

*   *   通过 kubectl describe 命令查看 Pod 详细信息，在返回信息的 Events 中可以看到预释放事件。示例如下：
    *   通过 kukubectl get events 命令查看事件信息，在返回信息中可以看到预释放事件。示例如下：

*   **释放后 Pod 状态**抢占式实例释放后，实例信息仍会保留，状态变更为 Failed，Failed 原因为 BidFailed。

*   *   通过 kubectl get pod 命令查看 Pod 信息，在返回信息中可以看到 Pod 状态已变更。示例如下：
    *   通过 kubectl describe 命令查看 Pod 详细信息，在返回信息中可以看到 Pod 状态信息。示例如下：

```sql
Events:
Type     Reason            Age    From          Message
----     ------            ----   ----          -------
Warning  SpotToBeReleased  3m32s  kubelet, eci  Spot ECI will be released in 3 minutes
``````bash
LAST SEEN   TYPE      REASON             OBJECT         MESSAGE
3m39s       Warning   SpotToBeReleased   pod/pi-frmr8   Spot ECI will be released in 3 minutes
``````lua
NAME       READY   STATUS      RESTARTS   AGE
pi-frmr8   1/1     BidFailed   0          3h5m
``````vbnet
Status:             Failed
Reason:             BidFailed
Message:            The pod is spot instance, and have been released at 2020-04-08T12:36Z
```

### 配置方式

在 Knative Service 中添加 Annotation 来创建抢占式实例。相关 Annotation 如下：

![图片](/images/jueJin/04b6e74d20fb4f0.png)

**🔔 说明：** 仅支持在创建 ECI Pod 时添加 ECI 相关 Annotation 来生效 ECI 功能，更新 ECI Pod 时添加或者修改 ECI 相关 Annotation 均不会生效。

#### 示例一：指定 ECS 规格，采用 SpotWithPriceLimit 策略

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
name: helloworld-go
spec:
template:
metadata:
labels:
alibabacloud.com/eci: "true"
annotations:
k8s.aliyun.com/eci-use-specs : "ecs.c6.large"           #指定ECS实例规格
k8s.aliyun.com/eci-spot-strategy: "SpotWithPriceLimit"  #采用自定义设置价格上限的策略
k8s.aliyun.com/eci-spot-price-limit: "0.25"            #设置每小时价格上限
spec:
containers:
- env:
- name: TARGET
value: "Knative"
image: registry.cn-hangzhou.aliyuncs.com/knative-sample/helloworld-go:73fbdd56
```

以上 YAML 示例可创建一个 ecs.c6 规格的抢占式实例。

*   创建时，如果没有满足规格和价格上限要求的库存，则创建失败。
*   创建后，可以稳定使用 1 小时，超出 1 小时保护期后，如果某一时刻的市场价格高于出价或实例规格库存不足，抢占式实例会被释放。

#### 示例二：设置没有库存时自动转为按量付费

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
name: helloworld-go
spec:
template:
metadata:
labels:
alibabacloud.com/eci: "true"
annotations:
k8s.aliyun.com/eci-use-specs : "ecs.c6.large"           #指定ECS实例规格
k8s.aliyun.com/eci-spot-strategy: "SpotWithPriceLimit"  #采用自定义设置价格上限的策略
k8s.aliyun.com/eci-spot-price-limit: "0.05"            #设置每小时价格上限
k8s.aliyun.com/eci-spot-fallback: "true"                #当抢占式实例没有库存时，自动转为按量付费
spec:
containers:
- env:
- name: TARGET
value: "Knative"
image: registry.cn-hangzhou.aliyuncs.com/knative-sample/helloworld-go:73fbdd56
```

以上 YAML 示例可创建一个 ecs.c6 规格的抢占式实例。

*   创建时，如果有满足规格和价格上限要求的库存，则会创建一个抢占式实例。创建后，可以稳定使用 1 小时，超出 1 小时保护期后，如果某一时刻的市场价格高于出价或实例规格库存不足，抢占式实例会被释放。
*   创建时，如果没有满足规格和价格上限要求的库存，则会创建一个按量付费的实例。创建后，系统不会主动释放实例。实例创建成功后，您可以通过 kubectl describe pod 命令查看对应 Pod 的事件来确认是否转为按量付费实例，如果看到 SpotDegraded 事件，则表明已转为按量付费实例。

### 最佳实践

由于抢占式实例不能保证一直有库存，而我们大部分情况下希望服务不能中断。那么我们可以这样配置：

*   采用系统自动出价，跟随当前市场实际价格前市场实际价格。
*   设置抢占式实例的保护期。
*   抢占式实例没有库存时，自动转为按量付费，以保证实例创建成功。

具体 Knative Service 配置如下：

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
name: helloworld-go
spec:
template:
metadata:
labels:
alibabacloud.com/eci: "true"
annotations:
k8s.aliyun.com/eci-use-specs : "ecs.c6.large"           #指定ECS实例规格
k8s.aliyun.com/eci-spot-strategy: "SpotAsPriceGo"  #采用自定义设置价格上限的策略
k8s.aliyun.com/eci-spot-duration: "1"
k8s.aliyun.com/eci-spot-fallback: "true"                #当抢占式实例没有库存时，自动转为按量付费
spec:
containers:
- env:
- name: TARGET
value: "Knative"
image: registry.cn-hangzhou.aliyuncs.com/knative-sample/helloworld-go:73fbdd56
```

小结
--

当前容器服务 Knative 结合 Virtual Node 已支持自动替换的方式使用抢占式实例，欢迎有兴趣的加入 Knative 钉钉交流群。（群号：_23302777_）