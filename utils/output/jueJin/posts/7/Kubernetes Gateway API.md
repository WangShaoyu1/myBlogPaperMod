---
author: "政采云技术"
title: "Kubernetes Gateway API"
date: 2023-08-10
description: "浅聊网关发展 网关发展 初始的 Kubernetes 内部服务向外暴露，使用的是自身的 LoadBlancer 和 NodePort 类型的Service，在集群规模逐渐扩大的时候，这种 Servic"
tags: ["Kubernetes","API中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读32分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:7,views:2415,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![将明.png](/images/jueJin/34dfe49afd50423.png)

浅聊网关发展
======

网关发展
----

初始的 Kubernetes 内部服务向外暴露，使用的是自身的 LoadBlancer 和 NodePort 类型的Service，在集群规模逐渐扩大的时候，这种 Service 管理的方式满足不了我们的需求，比如 NodePort 需要大量的端口难以维护，多了一层NAT，请求量大会对性能有影响；LoadBlancer 需要每个 Service 都有一个外部负载均衡器。 接着 Kubernetes 提供了一个内置的资源对象 Ingress API 来暴露 HTTP 服务给外部用户，它的创建是为了标准化的将 Kubernetes 中的服务流量暴露给外部，Ingress API 通过引入路由功能，克服了默认服务类型 NodePort 和 LoadBalancer 的限制。在创建 Ingress 资源的时候通过 IngressClass 指定该网关使用的控制器，主要是靠 Ingress 控制器不断监听 Kubernetes API Server 中 IngressClass 以及 Ingress 资源的的变动，配置或更新入口网关和路由规则。 IngressClass实现了网关与后台的解耦，但也有着很多的局限性。Ingress 配置过于简单，只支持 http 和 https 协议的服务路由和负载均衡，缺乏对其他协议和定制化需求的支持，而且 http 路由只支持 host 和 path 的匹配，对于高级路由只能通过注解来实现，当然这取决于 Ingress 控制器的实现方式，不同的 Ingress 控制器使用不同的注解，来扩展功能，使用注解对于 Ingress 的可用性大打折扣；路由无法共享一个命名空间的网关，不够灵活；网关的创建和管理的权限没有划分界限，开发需要配置路由以及网关。 当然也有很多第三方的网关组件，例如 istio 和 apisix 等，提供了丰富的流量管理功能，如负载均衡、动态路由、动态 upstream、A/B测试、金丝雀发布、限速、熔断、防御恶意攻击、认证、监控指标、服务可观测性、服务治理等，还可以处理南北流量以及服务之间的东西向流量。对外提供路由功能，对内提供流量筛选，已经很好的满足了当下网络环境的所有需求。但对于小集群来说，这两个网关的部署成本有点高；而且太多类型的网关，不同的配置项、独立的开发接口、接口的兼容性、学习成本、使用成本、维护成本以及迁移成本都很高。急需一种兼容所有厂商 API 的接口网关。 所以应运而生，Kubernetes 推出了 Gateway API。Gateway API 是 Kubernetes 1.19 版本引入的一种新的 API 规范，会成为 Ingress 的下一代替代方案。它有着 Ingress 的所有功能，且提供更丰富的功能，它支持更多的路由类型选择，除了 http路由外，还支持 tcp 以及 grpc 路由类型；它通过角色划分将各层规则配置关注点分离，实现规则配置上的解耦；并提供跨 namespace 的路由与网关支持使其更适应多云环境等。与 Ingress Api 工作类似的，Gateway Controller 会持续监视 Kubernetes API Server 中的 GatewayClass 和 Gateway 对象的变动，根据集群运维的配置来创建或更新其对应的网关和路由。 API 网关、入口控制器和服务网格的核心都是一种代理，目的在于内外部服务通信。更多的功能并不等于更好的工具，尤其是在 Kubernetes 中，工具的复杂性可能是一个杀手。

周边生态
----

> [gateway-api.sigs.k8s.io/implementat…](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fimplementations%2F "https://gateway-api.sigs.k8s.io/implementations/")

目前 Gateway API 还处于开发阶段,但已经有多个项目表示支持或计划支持 Gateway API。主要包括:

*   Istio 是最流行的服务网格项目之一，Istio 1.9 版本计划引入实验性的 Gateway API 支持。用户可以通过 Gateway 和 HTTPRoute 资源来配置 Istio 的 Envoy 代理。
*   Linkerd 是另一个流行的服务网格项目，Linkerd 2.10 版本添加了 Gateway API 支持。用户可以使用 Gateway API 资源来配置 Linkerd 的代理。
*   Contour 是一个Kubernetes Ingress Controller，Contour 1.14.0 版本添加 Gateway API 支持，可以使用 Gateway 和 HTTPRoute 来配置 Contour。
*   Flagger 是一款 Kubernetes 的蓝绿部署和 A/B 测试工具，Flagger 0.25版本添加了对Gateway API的支持，可以使用Gateway和HTTPRoute构建Flagger的流量路由。
*   HAProxy Ingress Controller支持Gateway API，可以使用Gateway和HTTPRoute构建HAProxy的配置。
*   Traefik是著名的开源边缘路由器，Traefik 2.5版本开始支持Gateway API并逐步淘汰Ingress支持。
*   Apache APISIX 来实现高性能、高可用性的 API 网关，通过 Gateway API 实现请求路由、安全认证、限流等功能。同时，Apache APISIX 还支持灰度发布、集群管理和插件机制等特性，可以满足大部分企业级 API 网关的需求。

除此之外，各大云服务商都在积极跟进 Gateway API 进展，预计未来会在相应的服务中提供 Gateway API 支持。可以看出，尽管 Gateway API 还不算成熟和稳定，但由于其强大的功能和作为 Kubernetes 官方项目的影响力，已经获得大量项目的支持和兼容。

使用场景
----

> [gateway-api.sigs.k8s.io/](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2F "https://gateway-api.sigs.k8s.io/")

Gateway API 用于管理和配置 k8s 集群中的网关以及集群内部的流量流向并执行丰富的负载均衡操作以及通过统一配置方式，来管理和配置不同类型的网关，简化了网关的管理和部署。 Kubernetes Gateway 使用场景：

*   实现 API 网关：可以将多个微服务的 API 统一暴露给外部客户端，并通过统一的认证、鉴权和限流策略来保护 API 的安全性和可靠性。
*   实现流量控制：可以根据不同的流量类型和负载需求，设置不同的路由规则、流量转发策略和负载均衡算法，确保服务的稳定和高效。
*   提供网络安全性保障：可以通过将 TLS 终止、OAuth2、JWT 等常见安全机制嵌入 Gateway 中，保证网络传输的安全性和完整性。

Gateway API 目标：

*   面向角色 - Gateway 由各种 API 资源组成，包括 GatewayClass、Gateway、HTTPRoute、TCPRoute、Service 等，这些资源共同为各种网络用例构建模型。
*   通用性 - 和 Ingress 一样是一个具有众多实现的通用规范，Gateway API 是一个被设计成由许多实现支持的规范标准。
*   更具表现力 - Gateway API 资源支持基于 Header 头的匹配、流量权重等核心功能，这些功能在 Ingress 中只能通过自定义注解才能实现。
*   可扩展性 - Gateway API 允许自定义资源链接到 API 的各个层，这就允许在 API 结构的适当位置进行更精细的定制。
*   GatewayClasses - GatewayClasses 将负载均衡实现的类型形式化，这些类使用户可以很容易了解到通过 Kubernetes 资源可以获得什么样的能力。
*   共享网关和跨命名空间支持 - 它们允许独立的路由资源绑定到同一个网关，这使得团队可以安全地共享跨命名空间基础资源。
*   规范化路由和后端 - Gateway API 支持类型化的路由资源和不同类型的后端，这使得 API 可以灵活地支持各种协议（如 HTTP 和 gRPC）和各种后端服务（如 Kubernetes Service、存储桶或函数）
*   提供了基于 L4/L7 协议层的负载均衡功能和流量控制功能，可以根据不同的负载和需求来调整服务间的流量分配。可以在 API 层面实现安全认证和授权，并支持 TLS 终止、OAuth2、JWT 等常见的安全机制。
*   支持适配器插件，可以扩展新的负载均衡算法、控制规则和协议解析器，满足更加复杂的网络需求

Gateway API 详解
==============

> [gateway-api.sigs.k8s.io/concepts/ap…](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fconcepts%2Fapi-overview%2F "https://gateway-api.sigs.k8s.io/concepts/api-overview/") [gateway-api.sigs.k8s.io/faq/](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Ffaq%2F "https://gateway-api.sigs.k8s.io/faq/")

面向角色
----

Gateway Api 特性之一就是通过角色划分将各层规则配置关注点分离，实现规则配置上的解耦。基础设施都是为了共享而建的，共享基础设施有一个共同的挑战，那就是如何为基础设施用户提供灵活性的同时还能被所有者控制。 Gateway API 通过面向角色的设计来实现这一目标，通过将资源对象分离，实现配置上的解耦，可以由不同的角色的人员来管理，平衡了灵活性和集中控制，解决了入口网关创建与管理职责界限的划分。如下图： ![image.png](/images/jueJin/d02caab394b5415.png)

GatewayClass资源是集群统一部署的，由平台提供。一个集群管理员创建了从 GatewayClass 派生的 Gateway 资源，该 Gateway 对访问 foo.example.com 的流量进行了统一的 TLS 配置并设置了默认策略。在和集群管理员达成一致后，负责存储的开发人员创建了一个 HTTPRoute，将访问foo.example.com/store/_的流量导入到 Store namespace 下的 foo-store 服务中，并且对这些流量进行了加权分发，将 90%的流量导入到 foo-store v1 中，另外 10%的流量导入到 foo-store v2 中。另外一边，负责网站的开发人员也创建了一个 HTTPRoute，将访问foo.example.com/site/_ 的流量导入到 Site namespace 下的 foo-site 服务中。Store 和 Site 团队在他们自己的 namespaces 中运行，但是将他们的 Routes 绑定到同一个共享 Gateway，允许他们独立控制自己的路由逻辑。这种用户模型在为基础设施提供灵活性的同时也保证了对不同角色之间的控制。如下图： ![image.png](/images/jueJin/50d8318eae8347a.png)

资源类型
----

> [gateway-api.sigs.k8s.io/references/…](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Freferences%2Fspec "https://gateway-api.sigs.k8s.io/references/spec")

官网现在支持两个 api 版本：

*   gateway.networking.k8s.io/v1beta1：支持 GatewayClass、Gateway、HTTPRoute、ReferenceGrant
*   gateway.networking.k8s.io/v1alpha2：支持 GatewayClass、Gateway、HTTPRoute、ReferenceGrant、TCPRoute、TLSRoute、GRPCRoute

Gateway API 的资源模型中，最主要有三种对象类型：GatewayClass、Gateway、Route。

### GatewayClass

[GatewayClass](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fapi-types%2Fgatewayclass%2F "https://gateway-api.sigs.k8s.io/api-types/gatewayclass/") 定义了一组共享配置和行为的 Gateway，GatewayClass 是一个集群范围的资源，必须至少定义一个 GatewayClass，Gateway 引用该 GatewayClass 才能够生效。 每个 GatewayClass 必须关联一个控制器 controller ，控制器 controller 可以处理多个 GatewayClass。控制器 controller 作用就是持续监视 Kubernetes API Server 中的 GatewayClass 和 Gateway 对象的变动，创建或更新其对应的网关和路由配置。 通俗讲 GatewayClass 就是一类 Gateway 的集合的入口，Gateway 想要实现转发必须要关联到某一个 GatewayClass 上，而 GatewayClass 也需要关联到一个网关控制器 controller，控制器 controller 可以监听 API Server 资源中 GatewayClass 以及 Gateway 的变化。比如 Istio、Traefik、Apisix 等根据 Gateway Api 的标准和要求，实现了一个 controller，能够让 Gateway 依赖 GatewayClass 创建对应的网关。一般 GatewayClass 不需要人工手动创建，参与支持 Gateway Api 工程的第三方网关组件安装时会自动创建。 GatewayClass 与控制器 controller 使用 spec.controllerName 关联。

```java
kind: GatewayClass
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
name: istio
spec:
controllerName: istio.io/gateway-controller  // 关联istio的控制器 controller
```

### Gateway

[Gateway](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fapi-types%2Fgateway%2F "https://gateway-api.sigs.k8s.io/api-types/gateway/") 负责外部请求到集群内的流量接入以及往后转发，定义了对特定负载均衡器配置的请求。Gateway 实现了 GatewayClass 配置和行为的约定，该资源可以由运维人员直接创建，也可以由处理 GatewayClass 的控制器创建。 Gateway 资源是一个中间层，需要定义所要监听的端口、协议、TLS 配置等信息，可以将网络流量的管理和控制集中到一个位置，提高集群的可用性和安全性。配置完成后，由 GatewayClass 绑定的 Controller 为我们提供一个具体存在的 Pod 作为流量入口。 Gateway 规范中定义了以下内容：

*   **GatewayClassName**：定义此网关使用的 GatewayClass 对象的名称。字段必填。
    
*   **Listeners**：定义主机名、端口、协议、终止、TLS 设置以及哪些路由可以绑定到监听器，字段必填。Gateway 中可以包含多个 Listener，每个 Listener 定义了绑定在该 Gateway 地址上的逻辑终点，至少需要指定一个 Listener。Gateway 中的每个 Listener 必须具有唯一的 hostname、port、protocol 组合。
    
    *   **hostname**：hostname 指定虚拟主机名，未指定时，匹配所有主机名。对于不需要基于主机名匹配的协议，此字段将被忽略。
    *   **port**：监听访问的后端端口。多个 Listener 可以指定相同的值，但必须确保多个 Listener 之间的兼容。
    *   **protocol**：监听所需要的协议。
    *   **tls**：当协议为 TLS或者 HTTPS的时候，需要配置tls。一般的话会在 Gateway 资源中配置 TLS 资源证书，当然配置在route中也可以。
    *   **allowedRoutes**：允许哪些路由可以绑定到网关，详情请看路由绑定。虽然一个客户端请求可能匹配多个路由规则，但最终可能只有一个规则接收到该请求。必须按照以下标准确定匹配优先级：路由定义的最具体优先、基于创建时间戳的最旧路由优先、如果其他一切都相同，则应优先考虑按字母顺序（名称空间/名称）首先出现的路由，例如，foo/bar 优先于 foo/baz。
*   **Addresses**：定义为此 Gateway 请求的网络地址。用于指定该 Gateway 可以通过哪些网络地址访问的，此字段非必填。Addresses 字段表示外部流量将使用的“Gateway 外部”的地址，该流量绑定到此网关的地址。这可以是外部负载均衡器或其他网络基础架构的 IP 地址或主机名，或者其他一些流量将被发送到的地址。
    

#### TLS

[tls](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2Ftls%2F "https://gateway-api.sigs.k8s.io/guides/tls/")的两种协议类型：Terminate、Passthrough

*   Terminate：将加密的流量解密并将明文流量转发到后端服务。这种模式需要在网关处配置证书和密钥，以便对客户端和服务器之间的流量进行加密和解密，确保数据安全性。
*   Passthrough：将加密的流量原样转发到后端服务。这种模式不需要在网关处配置证书和密钥，因为 TLS 连接只在后端服务处终止。这种模式适用于需要将 TLS 流量直接传递到后端服务的场景，如需要对后端服务进行更细粒度的访问控制或流量监控的情况。

不同的监听器协议，支持不同的 TLS 模式和路由类型：

监听器协议

TLS 模式

路由类型

TLS

Passthrough

TLSRoute

TLS

Terminate

TCPRoute

HTTPS

Terminate

HTTPRoute

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: gateway-istio
spec:
gatewayClassName: istio ## 关联指定的 GatewayClass，名字必须与 GatewayClass 中定义的名称相同
listeners:
- name: foo-https
protocol: HTTPS   ## 网关使用的协议
port: 443   ## 网关监听端口
hostname: tls.example.com
tls:    #为 HTTPS 配置加密协议
mode: Terminate #加密协议类型 Terminate
certificateRefs:
- kind: Secret
group: ""
name: foo-example-com-cert
- name: wildcard-https
protocol: HTTPS   ## 网关使用的协议
port: 443   ## 网关监听端口
hostname: "*.cai-inc.com"  # 通配符
tls:    #为 HTTPS 配置加密协议
mode: Terminate #加密协议类型 Terminate
certificateRefs:
- kind: Secret
group: ""  # 空字符串 Kubernetes API 核心组
name: wildcard-example-com-cert
```

#### ReferenceGrant

[ReferenceGrant](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fapi-types%2Freferencegrant%2F "https://gateway-api.sigs.k8s.io/api-types/referencegrant/") 可用于在 Gateway API 中启用跨命名空间引用。特别的，Router 可能会将流量转发到其他命名空间中的后端，或者 Gateway 可能会引用另一个命名空间中的 Secret。 ![image.png](/images/jueJin/f71df5f9fbd44ea.png) 如果从其命名空间外部引用一个对象，则该对象的所有者必须创建一个 ReferenceGrant 资源以显式允许该引用，否则跨命名空间引用是无效的。 ReferenceGrant 由两个列表组成，一个是引用来源的资源列表，另一个是被引用的资源列表。

*   **from** 列表允许你指定可能引用 to 列表中描述的项目的资源的 group, kind, namespace。
*   **to** 列表允许你指定可能被 from 列表中描述的项目引用的资源组和种类。命名空间在 to 列表中不是必需的，因为引用授予只能用于允许引用与引用授予相同的命名空间中的资源，每个 ReferenceGrant 仅支持一个 From 和 To 部分。

以下示例显示命名空间 foo 中的 HTTP 路由如何引用命名空间 bar 中的服务。在此示例中，bar 命名空间中的引用授予明确允许从 foo 命名空间中的 HTTP 路由引用服务。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
name: foo
namespace: foo
spec:
rules:
- matches:
- path: /bar
backendRefs:
- name: bar
namespace: bar
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
name: bar
namespace: bar
spec:
from:
- group: gateway.networking.k8s.io
kind: HTTPRoute
namespace: foo
to:
- group: ""
kind: Service
```

网关配置引用不同名称空间中的证书，在目标命名空间中创建 ReferenceGrant 以允许跨命名空间引用。如果没有该引用授予，则跨名称空间引用将无效。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: cross-namespace-tls-gateway
namespace: gateway-api-example-ns1
spec:
gatewayClassName: istio
listeners:
- name: https
protocol: HTTPS
port: 443
hostname: "*.cai-inc.com"
tls:
mode: Terminate
certificateRefs:
- kind: Secret
group: ""
name: allow-ns1-gateways-to-ref-secrets
namespace: gateway-api-example-ns2
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
name: allow-ns1-gateways-to-ref-secrets
namespace: gateway-api-example-ns2
spec:
from:
- group: gateway.networking.k8s.io
kind: Gateway
namespace: gateway-api-example-ns1
to:
- group: ""
kind: Secret
```

### Route

一个 Gateway 可以包含一个或多个 Route 引用，每个Route都要绑定一个Gateway，这些 Route 的作用是将一个子集的流量引导到一个特定的服务上。目前支持4种路由类型：HTTPRoute、TLSRoute、TCPRoute、GRPCRoute。

#### HTTPRoute

[HTTPRoute](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2Fhttp-routing%2F "https://gateway-api.sigs.k8s.io/guides/http-routing/") 适用于多路复用 HTTP 或 HTTPS 请求，并使用 HTTP 请求进行路由或修改的场景，比如使用 HTTP Headers 头进行路由，url路径的重定向或者重写，灰度发布涉及权重等。 HTTPRoute 的规范中包括：

*   **parentRefs**：定义此路由要绑定到的 Gateway。
    
*   **hostnames**（可选）：定义用于匹配 HTTP 请求的主机头的主机名列表，当请求匹配主机名时，将选择 HTTPRoute 执行请求路由。主机名是由 RFC 3986 定义的网络主机的完全限定域名，但要注意的是：不允许使用 IP；禁止使用端口；可以使用通配符标签（\*）前缀，但通配符标签必须单独出现作为第一个标签；如果未指定主机名，则匹配所有绑定在 Gateway 上的路由。当Gateway 的 Listener 和 HTTPRoute 中都指定了主机名，只有有交集的主机名才会绑定到 Listener，没有绑定的 HTTPRoute 的 RouteParentStatus 中 Accepted 为 False 状态。如果多个 HTTPRoute 指定重叠的主机名（例如，通配符匹配和精确匹配主机名重叠），则优先给予最长匹配主机名字符数的 HTTPRoute 的规则。
    
*   **rules**：定义规则列表以针对匹配的 HTTPRoute 请求执行操作。每条规则由 matches、filters（可选）和 backendRefs（可选）字段组成。
    
    *   **matches：** 由一个或多个匹配条件组成，这些匹配条件可以基于HTTP请求的各种属性（如请求method方法、path路径、headers头部、queryParams查询参数等）进行匹配，从而确定哪些请求应该被路由到该规则对应的后端服务。注意的是 headers 和 queryParams 参数为数组形式可以匹配多个，关系为 and，全部匹配可以通过；path 和 method 参数为非数组，在一个 matches 中只能出现一次。
        
        *   path：支持 Exact、PathPrefix、RegularExpression 匹配。其中 Exact、PathPrefix 必须以 / 字符开头且不能连续包含 /。正则处理可以使用 POSIX、PCRE、RE2 或任何其他正则表达式。
        *   headers：支持Exact、RegularExpression 匹配。
        *   queryParams：支持Exact、RegularExpression 匹配。
        *   method：值为大写。CONNECT、DELETE、GET、HEAD、OPTIONS、PATCH、POST、PUT、TRACE。
    *   **filters:** 对传入请求进行更细粒度的控制，定义了必须在请求或响应生命周期中完成的处理步骤，例如修改请求的头部、转发请求到其他服务、将请求重定向到不同的URL等。它们由一组规则组成，每个规则都包含一个或多个过滤器。这些过滤器可以在请求被路由到后端服务之前或之后进行处理，以实现各种不同的功能。
        
        *   http 请求头修改：HTTPRoute 资源可以修改来自客户端的 HTTP 请求和 HTTP 响应的头。有两种过滤器来满足这些要求：RequestHeaderModifier 和 ResponseHeaderModifier。注意：一个 HTTPRoute 资源可以同时修改传入请求的 HTTP 头和其响应的 HTTP 头。
        *   http 路径重定向：HTTPRoute 资源可以重定向或重写来自客户端发出的 URL 路径。需要注意的是，重定向和重写过滤器是互斥的，规则不能同时使用两种过滤器类型。重定向过滤器 RequestRedirect 会返回 HTTP 3XX 响应给客户端，例如，要从 HTTP 永久重定向 (301) 到 HTTPS，请配置 type: RequestRedirect 以及 requestRedirect.statusCode: 301 和 requestRedirect.scheme: "https"。重定向会修改已配置的 URL ，同时保留原始请求其他配置，主机名、路径和端口 (隐式) 保持不变。路径重写 urlRewrite 场景不多，不啰嗦了。
        *   http 流量镜像: 使用 RequestMirror 将 HTTP 请求镜像到不同的后端，且后端的 responses 响应必须被网关忽略。
    *   **backendRefs:** 用来指定后端服务的引用，它包含一个后端服务的列表，每个服务由名称和端口号组成，可以使用不同的负载均衡算法，将请求路由到后端服务的其中一个实例中，实现负载均衡。如果未指定后端列表，则规则不进行转发。
        
        *   group：可选，当未指定或空字符串时，组为 gateway.networking.k8s.io 。
        *   kind：可选，对象的 Kubernetes 资源种类。未指定时默认为 Service 。
        *   namespace：可选，后端的命名空间。未指定时默认为当前命名空间。请注意，当指定的命名空间不同于本地命名空间时，引用命名空间中需要一个 ReferenceGrant 引用授予对象，以允许该命名空间的所有者接受引用。
        *   name：必填，给引用的后端起个名字。
        *   port：可选，端口指定用于此资源的目标端口号。当引用对象是 Service 时，端口是必填的，在这种情况下，端口号是服务端口号，而不是目标端口。
        *   weight：指定权重来在不同后端之间移动流量。这对于滚动升级、金丝雀发布更改或应急情况下分隔流量非常有用。HTTPRoutespec.rules.backendRefs 接受一个后端列表，一个路由规则将把流量发送到这些后端。这些后端的权重定义它们之间的流量分配，权重表明流量的比例分配（而不是百分比），权重之和不需要等于 100。权重是一个可选参数，如果没有指定，则默认为 1。如果权重设置为 0，则不应为该条目转发任何流量。如果对于一个路由规则只指定了一个后端，则该后端隐式地接收到 100% 的流量，无论指定的权重为何。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
name: httproute-example
spec:
parentRefs:
- name: gateway-istio  ## 引用 Gateway
hostnames:
- "zcy.cai-inc.com"
rules:
- matches: ## 前缀为 monitor 的服务转发到后端 monitor-center 的6099端口
- path:
type: PathPrefix
value: /monitor
backendRefs:
- name: monitor-center1  ## 90%的流量转发给monitor-center1
port: 6099
weight: 90
- name: monitor-center2
port: 6099
weight: 10
- matches:  ## 请求头包含 env=prod 前缀为 /api2/otel 的服务转发到 otel-dashboard 的7099
- headers:    ## Exact 精确匹配，也可以使用支持 POSIX、PCRE 或正则表达式
- name: env
type: Exact
value: prod
path:
type: PathPrefix
value: "/api2/otel"
filters:
- type: RequestHeaderModifier  ## 请求头添加 cookie=test1
requestHeaderModifier:
add:
- name: cookie
value: test1
# - type: RequestHeaderModifier  ## 请求头修改已存在的 cookie=test2
#   requestHeaderModifier:
#     set:
#       - name: cookie
#         value: test2
# - type: RequestHeaderModifier  ## 删除请求头 cookie
#   requestHeaderModifier:
#     remove: ["cookie"]
- type: ResponseHeaderModifier  ## 添加响应头
responseHeaderModifier:
add:
- name: X-Header-Add-1
value: header-add-1
- name: X-Header-Add-2
value: header-add-2
- type: RequestRedirect
requestRedirect:
scheme: https
statusCode: 301
backendRefs:
- name: otel-dashboard
port: 7099
```

#### TLSRoute

[TLSRoute](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2Ftls%2F "https://gateway-api.sigs.k8s.io/guides/tls/") 用于 TLS 连接，通过 SNI 进行区分，它适用于希望使用 SNI 作为主要路由方法的地方，并且对 HTTP 等更高级的协议不感兴趣，连接的字节流不经任何检查就被代理到后端。 它的配置和 HTTPRoute 类似，不同点在于 rules 的配置中只有 backendRefs， 没有 matches 和 filters，官网对 TLSRoute 介绍不多，可能建议 tls 统一配置在 Gateway 处，详情请看上面 Gateway tls 配置。

#### TCPRoute

[TCPRoute](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2Ftcp%2F "https://gateway-api.sigs.k8s.io/guides/tcp/")（和UDPRoute）可以根据目的IP地址、目的端口号和协议等匹配规则来确定流量，将TCP流量动态路由到符合应用需求的后端服务上。 完成TCPRoute 路由的配置，需要在绑定的 Gateway listeners.protocol 为 TCP。Gateway 中的 listeners.name 与 TCPRoute 的 parentRefs.sectionName 绑定区分后端的服务service。通过这种方式，每个 TCP 路由将自身绑定到网关上的不同端口，以便 Gateway.listeners.name --> TCPRoute.parentRefs.sectionName --> service 从集群外部获取端口 XXX 的流量。 它的配置和 TLSRoute 类似，与 HTTPRoute 相比 rules 的配置中只有 backendRefs，没有 matches 和 filters。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: tcp-gateway
spec:
gatewayClassName: istio
listeners:
- name: foo   # 与 TCPRoute sectionName 绑定
protocol: TCP   # tcp 协议
port: 8080
allowedRoutes:  # 绑定为 TCPRoute
kinds:
- kind: TCPRoute
- name: bar
protocol: TCP
port: 8090
allowedRoutes:
kinds:
- kind: TCPRoute
---
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: TCPRoute
metadata:
name: tcp-app-1
spec:
parentRefs:
- name: tcp-gateway
sectionName: foo
rules:
- backendRefs:
- name: foo-service
port: 6000
---
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: TCPRoute
metadata:
name: tcp-app-2
spec:
parentRefs:
- name: tcp-gateway
sectionName: bar
rules:
- backendRefs:
- name: bar-service
port: 6000
```

#### GRPCRoute

[GRPCRoute](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fapi-types%2Fgrpcroute%2F "https://gateway-api.sigs.k8s.io/api-types/grpcroute/") 用于路由 gRPC 请求，包括按主机名、gRPC服务、gRPC方法或HTTP/2头匹配请求的能力。支持 GRPCRoute 的网关需要支持 HTTP/2，否则报错不支持的协议“UnsupportedProtocol”。 虽然可以通过 HTTPRoute 或自定义的 CRD 来路由 gRPC，但从长远来看，这会导致生态系统的碎片化。gRPC 是业界广泛采用的流行 RPC 框架，该协议在 Kubernetes 项目本身中被广泛地应用于许多接口，由于 gRPC 在 Kubernetes 项目和应用层网络中的重要性，因此不允许过度细分，强制规定使用 GRPCRoute 来路由 gRPC。 支持 GRPC 路由的实现必须强制 GRPCRoute 和 HTTPRoute 之间 hostnames 的唯一性。如果 HTTP 路由或 GRPC 路由类型的路由 (A) 附加到 Gateway Listener，并且该 Listener 已经绑定了其他类型的另一个路由 (B)，并且 A 和 B 的 hostnames 交集非空，则路由 A 不会实现，建议对gRPC和非gRPC HTTP流量使用不同的主机名。 GRPCRoute 与 HTTPRoute rules 规则基本一致，定义了基于条件匹配 matches、过滤器 filters 以及将请求转发到后端 backendRefs。不同点在于 GRPCRoute.rules.matches 只支持 method 和 headers，headers参数为数组类型，method 参数为非数组。method 和 headers 匹配只支持精确匹配 Exact 和正则匹配 RegularExpression，且不能包含 / 字符。GRPCRoute.rules.filters 中不支持 url 重定向以及重写。

```java
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: GRPCRoute
metadata:
name: grpcroute
spec:
parentRefs:   # 绑定 Gateway
- name: gateway-istio
hostnames:    # 绑定主机名
- my.example.com
rules:
- matches:
- method:   # 包含 com.example.User.Login 方法且头部包含 version: "2"
service: com.example.User
method: Login
headers:
- type: Exact
name: version
value: "2"
backendRefs:  # 不配置则不会转发
- name: foo-svc
port: 50051
- matches:  # 包含 grpc.reflection.v1.ServerReflection 方法添加请求头my-header：bar
- method:
service: grpc.reflection.v1.ServerReflection
filters:
- type: RequestHeaderModifier
requestHeaderModifier:
add:
- name: my-header
value: bar
backendRefs:
- name: bar-svc1
port: 50052
weight: 90
- name: bar-svc2
port: 50052
weight: 10
```

路由绑定
----

> [gateway-api.sigs.k8s.io/guides/mult…](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2Fmultiple-ns%2F "https://gateway-api.sigs.k8s.io/guides/multiple-ns/")

Gateway API 支持跨 Namespace 路由 Route，网关 Gateway 和路由 Route 可以部署到不同的命名空间中。路由可以跨 Namespace 边界绑定到网关的能力需要 Gateway 和 Route 双方协商同意。Route 和 Gateway 资源具有内置的控制，以允许或限制它们之间如何相互选择。当 Route 绑定到 Gateway 时，代表应用在 Gateway 上配置了底层的负载均衡器或代理。 一个 Kubernetes 集群管理员在 Infra 命名空间中部署了一个名为 shared-gw 的 Gateway，供不同的应用团队使用，以便将其应用暴露在集群之外。团队 A 和团队 B（分别在命名空间 "A" 和 "B" 中）将他们的 Route 绑定到这个 Gateway。它们互不相识，只要它们的 Route 规则互不冲突，就可以继续隔离运行。团队 C 有特殊的网络需求（可能是性能、安全或关键性），他们需要一个专门的 Gateway 来代理他们的应用到集群外。团队 C 在 "C" 命名空间中部署了自己的 Gateway dedicated-gw，该 Gateway 只能由 "C" 命名空间中的应用使用。 不同命名空间及 Gateway 与 Route 的绑定关系如下图所示： ![image.png](/images/jueJin/849dc6b5cbbd401.png) 网关和路由的绑定是双向的：只有网关所有者和路由所有者都同意绑定才会成功。这种双向关系存在的原因有两个：

0.  路由所有者不想通过他们不知道的路径过度暴露他们的应用程序。
1.  网关所有者不希望某些应用程序或团队在未经允许的情况下使用网关。例如，内部服务不应该通过互联网网关可访问。

网关支持管理路由来源约束，使用 listeners 字段限制可以附加的路由。网关支持命名空间和路由类型作为附加约束，不符合附加约束的任何路由都无法附加到该网关上。路由通过父引用字段 parentRefs 显式引用它们要附加到的网关。这些共同创建了一个协议，使基础设施所有者和应用程序所有者能够独立定义应用程序如何通过网关公开，有效地降低了管理开销。 如何将路由与网关绑定：

*   一对一：网关和路由可以由一个所有者部署和使用，并具有一对一的关系。团队 C 就是一个例子。
*   一对多：一个网关可以有许多路由与之绑定，这些路由由来自不同命名空间的不同团队所拥有。团队 A 和 B 就是这样的一个例子。
*   多对一：路由也可以绑定到多个网关，允许一个路由同时控制不同 IP、负载均衡器或网络上的应用暴露。

将路由附加到网关包括以下步骤：

0.  Route 需要在其 parentRefs 字段中引用 Gateway；
1.  Gateway 上至少有一个监听器允许其附加。

总之，网关选择路由，路由控制它们的暴露。当网关选择一个允许自己暴露的路由时，那么该路由将与网关绑定。当路由与网关绑定时，意味着它们的集体路由规则被配置在了由该网关管理的底层负载均衡器或代理服务器上。

### 路由选择

> [gateway-api.sigs.k8s.io/concepts/ap…](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fconcepts%2Fapi-overview%2F%23attaching-routes-to-gateways "https://gateway-api.sigs.k8s.io/concepts/api-overview/#attaching-routes-to-gateways")

Gateway 根据 Route 元数据，Route 资源的种类、命名空间和标签来选择 Route。Route 实际上被绑定到 Gateway 中的监听器上，因此每个监听器都有一个 listeners.allowedRoutes 字段，它通过以下一个或多个标准来选择 Route。

*   **Kind**：网关监听器 allowedRoutes.kinds 只能选择单一类型的路由资源。可以是 HTTPRoute、TCPRoute 或自定义 Route 类型。
    
*   **Namespace**：Gateway 还可以通过 allowedRoutes.namespaces 字段控制可以从哪些 Namespace 中选择 Route。namespaces.from 支持三种可能的值。
    
    *   SameNamespace 是默认选项。只有与该网关相同的命名空间中的路由才会被选择。
    *   All 将选择来自所有命名空间的 Route。
    *   Selector 意味着该网关将选择由 Namespace 标签选择器选择的 Namespace 子集的 Route。当使用 Selector 时，那么 namespaces.selector 字段可用于指定标签选择器。All 或 SameNamespace 不支持该字段。

下面的 Gateway 将在集群中的所有 Namespace 中选择 otel: true 的所有 HTTPRoute 资源。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: gatewayDemo
namespace: gateway-istio
spec:
gatewayClassName: istio
listeners:
- name: http
port: 80
protocol: HTTP
allowedRoutes:
kinds:
- kind: HTTPRoute
namespaces:
from: Selector
selector:
matchLabels:
otel: "true"

---
apiVersion: v1
kind: Namespace
metadata:
name: routeDemo-example
labels:
otel: "true"

---
# HTTPRoute
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
name: routeDemo
namespace: routeDemo-example
spec:
parentRefs:
- kind: Gateway
name: gatewayDemo
namespace: gateway-istio
rules:
- backendRefs:
- name: otel
port: 7099
​
```

### 组合类型

GatewayClass、Gateway、xRoute 和 Service 的组合将定义一个可实现的负载均衡器。下图说明了不同资源之间的关系。 ![image.png](/images/jueJin/40f55643fb4c4f2.png) 使用反向代理实现的网关的一个客户端请求网关 / 流程是：

*   客户端向 [foo.example.com](https://link.juejin.cn?target=http%3A%2F%2Ffoo.example.com "http://foo.example.com") 发出请求。
*   DNS 将该名称解析为网关地址。
*   反向代理在 Listener 上接收请求，并使用 Host 头 来匹配 HTTPRoute。
*   可选地，反向代理可以根据 HTTPRoute 的匹配规则执行请求头和 / 或路径匹配。
*   可选地，反向代理可以根据 HTTPRoute 的过滤规则修改请求，即添加 / 删除头。
*   最后，反向代理可以根据 HTTPRoute 的规则，将请求转发到集群中的一个或多个对象，即 Service。

Gateway API 上手
==============

基本流程
----

*   安装 [Gateway API CRD](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fguides%2F%23installing-gateway-api "https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api")
*   安装 [Gateway Api Controller](https://link.juejin.cn?target=https%3A%2F%2Fgateway-api.sigs.k8s.io%2Fimplementations%2F "https://gateway-api.sigs.k8s.io/implementations/")
*   创建 Gateway ，定义网关规则以及支持路由绑定，详情查看上述
*   创建 HTTPRoute 规则绑定业务流量

### 安装 Gateway API CRD

```java
$ wget https://github.com/kubernetes-sigs/gateway-api/releases/download/v0.6.1/standard-install.yaml
$ kubectl apply -f standard-install.yaml

# 查看安装的 CRD 资源
$ kubectl get crd |grep networking.k8s.io
```

![image.png](/images/jueJin/cb67ad25bd484e3.png)

```java
# 查看安装的 controller
$ kubectl get pod -n gateway-system

# 对于 status 为 Completes 状态的 pod，他们的作用是为了初始化 gateway-api-admission-server-665c77984-nhzmd
# 可以删除
$ kubectl delete pod -n gateway-system gateway-api-admission-patch-ll7lq
$ kubectl delete pod -n gateway-system gateway-api-admission-wnlz2
```

![image.png](/images/jueJin/258db73e0f7c479.png) 需要注意的是，standard-install.yaml 中的镜像因为某些原因，不可拉取，所以我们需要找国内别人已经保存的镜像，或者是自己把缓存镜像。推荐几个镜像：

```java
lianyuxue1020/kube-webhook-certgen:v1.1.1
acmestack/admission-server:v0.6.1
```

### **安装 Gateway Api C**ontroller

Gateway Api Controller 不需要手动去安装，所有实现了 Gateway Api 接口的网关都会集成 Controller。目前的网关流行的有 istio、apisix、nginx等，此处以 istio 网关为例安装演示。

#### **安装 istio**

istio 在 1.6 版本后开始支持 Gateway Api

```java
# 查看机器型号
$ uname -m

# 选择相对应的版本
$ wget https://github.com/istio/istio/releases/download/1.17.2/istio-1.17.2-linux-amd64.tar.gz

# 解压
$ tar -zxvf istio-1.17.2-linux-amd64.tar.gz

# 设置命令全局路径
$ cd istio-1.17.2/
$ export PATH=$PWD/bin:$PATH

# 查看 istioctl 版本
$ istioctl version

# 最小化安装 istio，不再需要istio-ingressgateway
$ istioctl install --set profile=minimal -y
```

安装完成后，Istio 会自动创建一个 GatewayClass，Controller 为 istio.io/gateway-controller

```java
$ kubectl get gatewayclass
NAME    CONTROLLER                    ACCEPTED   AGE
istio   istio.io/gateway-controller   True       6s
```

### 配置 Gateway、HTTPRoute

创建后端服务并配置 gateway 以及 http 路由，这里的 gateway 指的是 Gateway API gateway.networking.k8s.io/v1beta1 中的 Gateway 资源，而不是 Istio API networking.istio.io/v1beta1 中的 Gateway。 istio 中有一个例子，可以测试使用，部署一个名为 httpbin 的简单服务，并且将它用 Gateway 暴露到集群外部。 1、部署httpbin服务：

```java
# 如果需要 istio 注入，需要在 namespace 打标
$ kubectl label namespace xxx istio-injection=enabled

$ cd istio-1.17.2/samples/httpbin
$ kubectl apply -f httpbin.yaml
serviceaccount/httpbin created
service/httpbin created
deployment.apps/httpbin created

$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
httpbin      ClusterIP   10.96.0.85     <none>        8000/TCP   10s

$ kubectl get pod
NAMESPACE        NAME                         READY   STATUS    RESTARTS      AGE
default          httpbin-85d76b4bb6-gr84d     1/1     Running   0             15s
```

2、部署 Gateway 和 HTTPRoute，将访问 httpbin.example.com/get/\* 的流量导入到 httpbin 服务中：

```java
apiVersion: v1
kind: Namespace
metadata:
name: istio-ingress
spec:
finalizers:
- kubernetes
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: gateway
namespace: istio-ingress
spec:
gatewayClassName: istio # 这里指定使用istio gatewayclass
listeners:
- name: default
hostname: "*.example.com"
port: 80
protocol: HTTP
allowedRoutes:
namespaces:
from: All
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
name: http
namespace: default
spec:
parentRefs:
- name: gateway
namespace: istio-ingress
hostnames:
- "httpbin.example.com"
rules:
- matches:
- path:
type: PathPrefix
value: /get
backendRefs:
- name: httpbin
port: 8000
```

查看 Gateway 和 HTTPRoute 创建。默认情况下，每个Gateway 会自动创建同名的 Service 和 Deployment，如果更新了 Gateway，它们也会随之更新。当然也可以手动配置 Service 和 Deployment 并将其绑定到 Gateway，详情查看官网。

```java
$ kubectl get gateway -n istio-ingress
NAME      CLASS   ADDRESS   																	 PROGRAMMED   AGE
gateway   istio   gateway.istio-ingress.svc.cluster.local:80                26s

$ kubectl get deployment -n istio-ingress
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
gateway   1/1     1            1           30s

$ kubectl get svc -n istio-ingress
NAME      TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)                        AGE
gateway   LoadBalancer   10.96.0.36   <pending>     15021:31764/TCP,80:32701/TCP   36s

$ kubectl get HTTPRoute
NAME   HOSTNAMES                 AGE
http   ["httpbin.example.com"]   40s

# 查看 HTTPRoute 是否被绑定，status 中的 conditions 的 reason: Accepted，	status："True"
$ kubectl get HTTPRoute http -o yaml
```

3、等待Gateway部署完成并设置Ingress Host环境变量：

```java
$ kubectl get deployment -n istio-ingress
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
gateway   1/1     1            1           3m29s

$ kubectl get service -n istio-ingress
NAME      TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)      		AGE
gateway   LoadBalancer   10.96.0.36      15021:30088/TCP,80:31690/TCP   4m13s

$ kubectl wait -n istio-ingress --for=condition=ready gateways.gateway.networking.k8s.io gateway
gateway.gateway.networking.k8s.io/gateway condition met

$ export INGRESS_HOST=$(kubectl get gateways.gateway.networking.k8s.io gateway -n istio-ingress -ojsonpath='{.status.addresses[*].value}')
```

4、访问httpbin 服务:

```java
# 使用了-H将 HTTP Header 中的 Host 设置为 httpbin.example.com
$ curl -s -I -HHost:httpbin.example.com "http://$INGRESS_HOST/get"
HTTP/1.1 200 OK
server: istio-envoy
date: Mon, 05 Jun 2023 07:33:41 GMT
content-type: application/json
content-length: 1356
access-control-allow-origin: *
access-control-allow-credentials: true
x-envoy-upstream-service-time: 3
```

5、访问没有配置过的路由/headers，会得到 HTTP 404 的错误：

```java
$ curl -s -I -HHost:httpbin.example.com "http://$INGRESS_HOST/headers"
HTTP/1.1 404 Not Found
```

更新路由规则也会暴露 /headers 并为请求添加标头：

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
name: http
namespace: default
spec:
parentRefs:
- name: gateway
namespace: istio-ingress
hostnames: ["httpbin.example.com"]
rules:
- matches:
- path:
type: PathPrefix
value: /get
- path:
type: PathPrefix
value: /headers
filters:
- type: RequestHeaderModifier
requestHeaderModifier:
add:
- name: my-added-header
value: added-value
backendRefs:
- name: httpbin
port: 8000
``````java
curl -s -HHost:httpbin.example.com "http://$INGRESS_HOST/headers"
    {
        "headers": {
        "Accept": "*/*",
        "Host": "httpbin.example.com",
        "My-Added-Header": "added-value",
        ...
```

### 卸载

```java
$ kubectl delete -f samples/httpbin/httpbin.yaml

# 删除 namespace、 httproute 和 gateways
$ kubectl delete -f demo.yaml

# 删除 istio
$ istioctl uninstall -y --purge
$ kubectl delete ns istio-system

删除 Kubernetes Gateway API CRD
$ kubectl delete -f standard-install.yaml
```

### 其他功能

#### HPA

Gateway Pod 默认只有 1 个，不能真正满足实际生产需要，多数情况至少需要多个 Pod 一起负载压力。 使用 HPA 需要在 Gateway 的 Deployment 中设置对应的 request/limit 资源。

```java
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
name: gateway
namespace: istio-ingress
spec:
gatewayClassName: istio
listeners:
- name: default
hostname: "*.example.com"
port: 80
protocol: HTTP
allowedRoutes:
namespaces:
from: All
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
name: gateway
namespace: istio-ingress
spec:
# 通过引用与生成的 Deployment 匹配
# 注意不要使用 `kind: Gateway`
scaleTargetRef:
apiVersion: apps/v1
kind: Deployment
# Gateway Deployment 名称
name: gateway
minReplicas: 2
maxReplicas: 5
metrics:
- type: Resource
resource:
name: cpu
target:
type: Utilization
averageUtilization: 50
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
name: gateway
namespace: istio-ingress
spec:
minAvailable: 1
selector:
# Match the generated Deployment by label
matchLabels:
istio.io/gateway-name: gateway
​
```

推荐阅读
----

[架构方法论](https://juejin.cn/post/7264538238533320719 "https://juejin.cn/post/7264538238533320719")

[redisString结构解析及内存使用优化](https://juejin.cn/post/7262704979903430712 "https://juejin.cn/post/7262704979903430712")

[Trino 插件开发入门](https://juejin.cn/post/7260132092834742333 "https://juejin.cn/post/7260132092834742333")

[精准测试体系构建](https://juejin.cn/post/7259354549165375549 "https://juejin.cn/post/7259354549165375549")

[操作日志数据治理实战](https://juejin.cn/post/7257519248033415223 "https://juejin.cn/post/7257519248033415223")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)