---
author: "字节跳动技术团队"
title: "字节跳动 kube-apiserver 高可用方案 KubeGateway"
date: 2022-10-31
description: "本文整理自 2022 年稀土开发者大会演讲，字节跳动云原生工程师章骏分享了 Kubernetes 集群 kube-apiserver 请求的负载均衡和治理方案 KubeGateway"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:18,comments:0,collects:22,views:6029,"
---
> 本文整理自 2022 年稀土开发者大会，字节跳动云原生工程师章骏分享了 Kubernetes 集群 kube-apiserver 请求的负载均衡和治理方案 KubeGateway。

KubeGateway 是字节跳动针对 kube-apiserver 流量特征专门定制的七层网关，它彻底解决了 kube-apiserver 负载不均衡的问题，同时在社区范围内首次实现了对 kube-apiserver 请求的完整治理，包括请求路由、分流、限流、降级等，显著提高了 Kubernetes 集群的可用性。

项目地址：[github.com/kubewharf/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubewharf%2Fkubegateway "https://github.com/kubewharf/kubegateway")

1\. 背景
======

在 Kubernetes 集群中，kube-apiserver 是整个集群的入口，任何用户或者程序对集群资源的增删改查操作都需要经过 kube-apiserver，因此它的高可用性决定了整个集群的高可用能力。kube-apiserver 本质上是一个无状态的服务器，为了实现其高可用，通常会部署多个 kube-apiserver 实例，同时引入外部负载均衡器（以下简称 LB）进行流量代理。

![图片](/images/jueJin/c28a646ee1b348b.png) 为了保证集群的安全，kube-apiserver 对请求进行认证和授权的准入控制，其中认证是为了识别出用户的身份。Kubernetes 支持多种认证策略，比如 Bootstrap Token、Service Account Token、OpenID Connect Token、TLS 双向认证等。

目前 kube-apiserver 的客户端使用得较多的策略是 TLS 双向认证。TLS 双向认证需要 LB 将请求中的 Client X509 Cert 正确传递给 kube-apiserver，但是传统的七层 LB 无法做到这一点，在转发过程中会丢失 Client X509 Cert，导致 kube-apiserver 无法认证用户。

因此目前 LB 的选型一般为 LVS、云厂商的 SLB 或 nginx、HAProxy 的四层负载均衡方案。

> 四层负载均衡工作在 OSI 的第四层即传输层，使用 NAT 技术进行代理转发
> 
> 七层负载均衡工作在 OSI 的第七层即应用层，一般是基于请求 URL 地址的方式进行代理转发。

但是使用四层 LB 会引起另外的问题，具体如下：

1.  请求负载不均衡：由于 kube-apiserver 和 client 是使用 HTTP2 协议连接，HTTP2 的多个请求都会复用底层的同一个 TCP 连接并且长时间不断开。在 kube-apiserver 滚动升级或者某个实例重启时，很容易引起迟些启动的 kube-apiserver 在长时间内只有很少的请求数。极端情况下，负载较高的实例会出现 OOM，甚至引起雪崩。
    
    ![图片](/images/jueJin/b320566b59214b7.png)
    
2.  缺乏请求治理的灵活性：4 层负载均衡在传输层工作，它只负责消息的传递，但是无法处理应用层的 HTTP 协议的信息，因此相较于 7 层负载缺乏对请求治理的“灵活性”和 “智能性”。比如无法根据请求的内容（比如 verb、url 等字段）制定灵活的负载均衡和路由策略，也无法在网关层对请求级别进行限流降级等处理。
    

社区中有一些相关工作试图解决上述问题，但均没有根治问题：

![图片](/images/jueJin/442f7cd3cbbc4c8.png)

随着云原生技术的发展，目前字节跳动 95% 以上的业务跑在 Kubernetes 上，对集群高可用提出了更高的要求。事实上，在生产环境中，我们也曾遇到过多次由于 kube-apiserver 负载不均衡或者缺乏请求治理能力带来的事故，面对以上问题，我们针对 kube-apiserver 的流量特征自研了七层网关 KubeGateway。

2\. 架构设计
========

KubeGateway 作为七层网关接入和转发 kube-apiserver 的请求，它具有以下特点：

1.  对于客户端完全透明，客户端无需任何改造即可以接入 KubeGateway；

2.  支持同时代理多个 K8s 集群的请求，不同 K8s 集群通过不同的域名或者虚拟地址（vip）进行区分。

3.  负载均衡从 TCP 连接级别变为 HTTP 请求级别，进而实现快速、有效的进行负载均衡，彻底解决 kube-apiserver 负载不均衡的问题。

4.  高扩展性的负载均衡策略，目前支持 Round Robin、Random 策略，负载均衡策略插件化，易于扩展。

5.  支持灵活的路由策略，KubeGateway 根据请求信息，包括但不限于 resource/ verb/ user/ namespace/ apigroup 等进行路由。为 kube-apiserver 分组提供基础能力，以低运维成本实现 kube-apiserver 组之间的隔离性，提高集群稳定性。

6.  配置管理云原生化，以 K8s 的标准 API 形式管理网关配置，支持配置热更新。

7.  支持限流、降级、动态服务发现、优雅退出、upstream 异常检测等网关的通用能力。

KubeGateway 对外以 K8s 标准 API 的形式提供代理配置管理的服务，主要提供路由转发规则、上游集群 kube-apiserver 地址、集群证书信息、限流等请求治理策略等配置信息的维护变更。它代理 kube-apiserver 的请求的流程如下图所示，主要分为五个步骤：请求解析、路由匹配、用户认证、流量治理和反向代理。下面依次对这些步骤进行详细介绍：

![图片](/images/jueJin/53b2645a89fa43f.png)

2.1 请求解析
--------

KubeGateway 可以深入理解 kube-apiserver 请求模型，从中解析出更多的信息，它将 kube-apiserver 的请求分为两种类型：

*   资源请求，如对 Pod 的 CRUD（增删改查）。
*   非资源请求，如访问 /healthz 查看 kube-apiserver 的健康情况，访问 /metrics 查看暴露的指标等。

对于资源请求，可以从请求的 URL 和 Header 中解析出以下的内容：

![图片](/images/jueJin/983f8d089913416.png)

最终一个请求可以解析出多维度的路由字段，如下图所示，这些字段将作为路由选择的依据。

![图片](/images/jueJin/2052e1676237488.png)

2.2 路由匹配
--------

从请求中解析出多维度的路由字段后，可以很方便地组合出非常强大的路由规则来区分不同的 API 请求，比如

*   通过 Verb 和 Resource 的结合，我们可以直接匹配到所有的 list pod 的请求。

*   通过 User，UserGroup，ServiceAccount 等，我们可以匹配出 kube-controller-manager，kube-scheduler 等核心控制组件的请求。

将不同的请求经过路由规则匹配后，我们能对它们做更精细化的分流，限流，熔断等流量控制。

匹配规则可以直接通过修改 KubeGateway 的配置管理服务对外暴露的 API -- UpstreamCluster 实时生效。

2.3 用户认证
--------

为了能够正确地代理 kube-apiserver 的七层流量，让请求经过代理后的在 upstream kube-apiserver 能被正确地进行认证授权，KubeGateway 需要将请求中的用户信息透传给 kube-apiserver，这要求 KubeGateway 也能认证出请求中的用户信息。

KubeGateway 将 kube-apiserver 支持的认证方式可以分为以下几类

*   基于 x509 客户端证书的认证方式：KubeGateway 通过规则 upstream kube-apiserver 中的 CA 证书，解析出客户端证书中用户和用户组信息

*   基于 Bearer Token 的认证方式：KubeGateway 通过给 upstream kube-apiserver 发送 TokenReview 请求，要求 upstream kube-apiserver 对 Bearer Token 进行认证，从而得到对应的用户信息。

识别出用户后，KubeGateway 通过 kube-apiserver 提供的 Impersonate（用户扮演）机制进行转发，详细内容会在 2.5.1 部分进行介绍。此外，KubeGateway 只会对请求进行认证，并不会对请求进行授权判断，授权操作由 upstream kube-apiserver 进行。

2.4 请求治理
--------

KubeGateway 作为七层网关，有着丰富的流量治理能力，具体包括：

### 2.4.1 负载均衡

UpstreamCluster 确定后，Upstream Servers 也随之确定。KubeGateway 按照负载均衡策略从 Upstream Servers 中选择出一个进行请求转发。良好的负载均衡策略可以优化资源效率，最大化吞吐量，减少延迟和容错。

目前 KubeGateway 支持 Round Robin 和 Random 负载均衡策略，这两种策略简单有效，能够满足大部分场景的需求。此外，KubeGateway 支持灵活的负载均衡策略扩展，可以快速实现 Least Request 等算法，以满足更多场景的需求。

### 2.4.2 健康监测

KubeGateway 会定期主动地访问 kube-apiserver 的 `/healthz` 接口进行健康监测。代理流量只会转发给健康的 kube-apiserver；而不健康的 kube-apiserver 会被临时屏蔽，当它被恢复健康后才会重新有新的流量

### 2.4.3 限流

KubeGateway 默认提供限流的能力，可以有效地防止 upstream kube-apiserver 在某些情况下过载。它的限流方案相比于 Kubernetes 本身的 APF（API Priority and Fairness）更容易理解和配置。请求经过请求解析和路由匹配之后，KubeGateway 会确定这个请求的限流规则。

比如我们想要限制普通用户 list pod 的 QPS 但是又要对管控组件（如 controller-manager，scheduler）进行豁免，可以在路由匹配中区分出两种类型的用户然后为他们单独配置 FlowControl 限流规则。

![图片](/images/jueJin/2d28fc41cceb466.png)

KubeGateway 提供了两种限流策略：

*   token bucket：令牌桶是常用的限流方式，它能有效地限制请求的 QPS 并在一定程度上允许突发的请求。

*   max requests inflight：最大请求数是比令牌桶更严格的限制方式，它限制在某个时刻能够执行的最大请求数量，通常用来限制一些更加耗时的请求，比如在大集群 list 全量 pods，这种请求会可能会持续好几分钟，而且会占用 kube-apiserver 大量的资源，只通过令牌桶的限流会放入过多的请求而造成 kube-apiserver OOM 等问题。

### 2.4.4 降级

KubeGateway 支持降级以应对集群管控面异常的情况。

在 kube-apiserver 或者 ETCD 发生故障的时候，可能引起集群的雪崩。在雪崩情况下，部分请求会返回成功，部分请求返回失败，加上客户端不断重试，容易导致集群出现非预期行为，比如 Node NotReady、 Pod 大量驱逐和删除等。

在这种情况下，开发人员可以通过 KubeGateway 进行降级操作拒掉所有流量。在降级状态下集群相当于被冻结了，所有写入都无法成功，可以保证存量的 Pod 进程保持存活状态，避免对业务造成影响。在集群恢复正常后，首先放开限制允许 Node 上报心跳，然后再恢复集群的其他流量。

2.5 反向代理
--------

KubeGateway 在反向代理部分，有以下关键的技术点：

### 2.5.1 Impersonate（用户扮演）

在通过流量治理后，KubeGateway 会根据选择出的 kube-apiserver 进行转发。在转发的时候 KubeGateway 通过 impersonate 的机制将用户信息通过 Request Header 传递给 upstream kube-apiserver。在 Request Header 中添加以下信息：

```arduino
Impersonate-User: Client 用户名
Impersonate-Group: Client 用户组
```

Impersonate 是 kube-apiserver 对外提供的一种机制，它允许一个用户扮演成另外一个用户执行 API 请求。在使用这个机制之前，我们需要在 upstream kube-apiserver 为 KubeGateway 的客户端配置好 Impersonate 的权限，Impersonate 的请求具体的流程如下：

![图片](/images/jueJin/117a831887d54a3.png)

*   kube-apiserver 认证 KubeGateway 用户，识别出用户扮演的行为。

*   kube-apiserver 确保 KubeGateway 具有 Impersonate 权限。

*   kube-apiserver 根据 HTTP Header 识别出 KubeGateway 扮演的用户名和用户组，然后将请求执行者替换成被扮演的用户。

*   对被扮演的用户进行授权验证，检查他是否有权限访问对应的资源。

kube-apiserver 对于 Impersonate 机制支持的很完善，审计日志中也兼容了 Impersonate。

最终 KubeGateway 依靠用户认证和 Impersonate 机制，完成原始用户信息的透传，解决了传统七层 LB 无法代理 kube-apiserver 请求的问题。而且在代理过程中，对于客户端是完全透明的，客户端无需进行任何修改即可接入 KubeGateway。

### 2.5.2 HTTP2 多路复用

KubeGateway 默认使用 HTTP2 协议，基于 HTTP2 协议的多路复用能力，单条连接上默认支持 250 个 Stream，即单个连接上支持 250 个并发的请求，使得 upstream 单个 kube-apiserver 的 TCP 连接数可以降低两个数量级。

![图片](/images/jueJin/b72ab7943ab44ec.png)

### 2.5.3 Forward & Exec 类请求处理

KubeGateway 支持所有原生 kube-apiserver 请求的透明代理。由于 Forward 、Exec 等部分请求需要通过 HTTP 1.1 建立的链接之上使用其他的协议（比如 SPDY、WebSocket 等）来进行通信，KubeGateway 在转发这类请求时会禁止 http2，且支持 Hijacker 处理。

3\. 落地效果
========

经过压测，KubeGateway 性能优异，经过代理后，请求延迟增加在 1ms 左右。目前 KubeGateway 已经平滑的接管了字节所有的 Kubernetes 集群，总 QPS 20w+。在 KubeGateway 的帮助下，研发团队彻底解决了 kube-apiserver 流量不均衡的问题，而且极大增强了 kube-apiserver 请求的治理能力，包括请求分组、路由、限流、降级等，有效提高了集群的稳定性和可用性。

同时，我们在 KubeGateway 优雅升级、多集群动态证书管理、可观测性上也做了很多优化，具体技术细节以后会进行更多的介绍，敬请期待。

4\. 未来演进
========

目前，KubeGateway 已在 GitHub 开源，未来它会在以下几个方面持续演进：

1.  提供更完整的 7 层网关能力，比如黑白名单，缓存等。
2.  持续提高可观测性，可以在异常情况下能够快速定位到问题，辅助排障。
3.  探索基于 KubeGateway 网关实现新型的联邦方案，通过 KubeGateway 可以将多个 K8s 集群透明地聚合成一个集群。

期待有更多朋友关注和加入 KubeGateway 社区，也欢迎大家在 GitHub 给我们提出各种建议！

5\. 关于我们
========

字节基础架构编排调度团队，负责构建字节跳动内部的容器云平台，为产品线提供运行基石；以超大容器集群规模整体支撑了字节内产品线，涵盖今日头条、抖音、西瓜视频等。

团队支持业务同时覆盖在线、离线机器学习，推荐/广告/搜索等多种应用场景；在持续多年的超高速增长中，积累了丰富的 Kubernetes/容器超大规模应用经验，旨在打造覆盖多场景，多地域的千万级容器的大平台。欢迎志同道合的同学们加入我们。简历投递：[lijiazhuo@bytedance.com](https://link.juejin.cn?target=mailto%3Alijiazhuo%40bytedance.com "mailto:lijiazhuo@bytedance.com")