---
author: ""
title: "网易云音乐全面开源一款云原生应用部署平台：Horizon"
date: 2023-02-24
description: "网易云音乐最近开源了一个名为 Horizon (httpsgithubcomhorizoncdhorizon)的应用部署平台，旨在为 Kubernetes 代码部署提供高效和标准化支持。"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:37,views:6978,"
---
网易云音乐最近开源了 [Horizon](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd%2Fhorizon "https://github.com/horizoncd/horizon") 应用部署平台，旨在为基于 Kubernetes 的云原生应用部署提供可靠、安全、高效的标准化方案。Horizon是一个基于 Kubernetes 的云原生持续部署平台，并且全面践行 GitOps。PlatForm Team可以自定义创建版本化的服务模板，为业务应用程序和中间件定义符合统一标准的部署和运维。Developer可以选择预先定义的模板，进行自动化的服务部署，确保基于Kubernetes的统一最佳实践。通过Horizon GitOps机制，确保任意变更（代码、配置、环境）持久化、可回滚、可审计。

Horizon 受 Argo CD 和 AWS Proton 的启发，并由网易云音乐、网易数帆等团队合作开发，现在 Horizon 已被大规模应用到了网易云音乐和网易传媒的实际生产环境中。

开源背景
----

网易云音乐全面启动云原生、容器化的时间并不是非常早，大约在2020年，云原生的发展也是日新月异，诸多技术方案基于Cloud和Kubernetes都有被重新打造的潜力和趋势。当时我们关注到GitOps领域的发展，以及CICD领域的云原生的前沿进展，决定基于这些最新的理念和方案去打造一款能够中长期满足公司长远发展的CD平台。

目前该项目已经全面落地到网易云音乐，以及其他事业部。网易云音乐通过Horizon全面管理国内外7大机房，支持各种类型的业务，包括在线应用（Web服务）、Serverless（支持音视频）、实时计算、AI推理、中间件等的部署和运维。基于Horizon的日均构建和发布达到上千次，各类微服务集群8K+。全面高效支撑了云音乐实现云原生容器化的技术迭代和转型，并且有效地支持了公司降本增效目标的落地。

经过2年多来，协同业务不断地打磨、迭代，以及大规模业务落地实践，我们认为Horizon 在 GitOps 持续部署领域相比业界解决方案拥有优势。正好，网易集团也鼓励我们做创新做开源。所以此次，我们将Horizon正式全面开源，希望Horizon同样帮助更多同行和公司，创造更大的价值。当然我们希望社区和有兴趣的同仁能够参与到Horizon的开源建设，一起交流，一起学习，一起进步。

优势与特性
-----

### 优势

1.  **标准化部署**：选择Horizon的一个关键原因是Horizon标准化的应用部署。虽然 Kubernetes 灵活而强大，但也是庞大而复杂的，融合诸多视角的关注点，比如安全、架构、sre等等，这使得开发人员难以全面理解 Kubernetes，更难以遵循最佳实践。Horizon 通过引入模板（基于Helm Template）解决了这个问题。Horizon提供了标准化模板化的能力，平台管理人员可以自定义符合自身需求的模板，协助业务进行最佳实践落地。例如，Horizon 管理团队可以在自定义模板中提供几个基本资源选项，比如，默认情况下只提供 tiny（0.5 core，512 MB）、small（1 core，1 GB）和 middle（2 core，4 GB）等，防止出现资源的碎片化且保障用户接口的更加友好而简洁。
2.  **安全和可靠**：Horizon 的另一个优点是安全和可靠。Horizon 100% 基于GitOps，通过 Horizon 对应用程序所做的每个变更都是持久化的、可回滚和可审计。保障可靠安全的情况下，依然能够助力业务进行敏捷实践。
3.  **开放且可扩展**：Horizon 还支持各种类型的工作负载，包括基本的 Kubernetes 工作负载和云原生工程师自主研发的[CRD](https://link.juejin.cn?target=https%3A%2F%2Fkubernetes.io%2Fdocs%2Fconcepts%2Fextend-kubernetes%2Fapi-extension%2Fcustom-resources%2F%23customresourcedefinitions "https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions")。基于通用的声明式API，实现广泛的兼容与开放。大部分情况下，Horizon平台不用任何前后端代码研发，即可快速将各种云原生能力赋能到业务一线研发。
4.  **多云支持**：Horizon 提供了统一的应用程序平台来管理多云和混合云，这使得 Horizon 成为各种使用场景下的理想平台。
5.  **高效**：Horizon 管理团队能够基于模板以及低代码的能力快速交付符合最佳实践的应用部署，快速赋能业务全面实践 DevOps。

### 特性

1.  **GitOps**: Horizon 基于 GitOps 部署应用，Git 仓库储存了所有的配置及其变更，使每个应用程序的更改都是持久化的、可逆的和可审计的。
2.  **Horizon模板**: Horizon 基于 JSON Schema 简单拓展了 Helm Template System（兼容 Helm Template），Horizon 管理团队可以在 Template 中定义 默认Kubernetes 资源的基本配置（例如 security, affinity, priority, resource 等）确保业务开发能够遵守最佳实践；并且各种底层声明式的能力可以面向业务进行进一步的更好的产品化。用户选择模板后，Horizon 基于模板中的 JSON Schema 文件和 React JSON Schema Form 渲染一个简单统一的 HTML 表单。Template 简单而灵活，可以基于 Template 定义自己的最佳实践。
3.  **RBAC & Member**: Horizon 提供了一个与 Gitlab/GitHub 类似的 RBAC & Member 系统，Horizon 管理团队可以轻松地创建符合自身需求的 Role（与Kubernetes 的 role、rolebinding 类似）和 Member。在我们的生产实践中，我们定义了 PE、Owner、Maintainer、Guest 等角色。Owner 拥有读（查询Pods，读取配置等），写（部署，构建部署，重启，发布，删除等）权限，Guest 只有读权限。
4.  **外部集成**：Horizon 支持提供了 OpenAPI、OAuth2.0、Webhooks、访问令牌等功能，用户可以方便地将 Horizon 集成到自身内部系统中。并且 Horizon 也可以作为 OAuth 客户端，接入外部 OAuth 服务器。

![stream](/images/jueJin/c4fa97825fcd261.png)

系统架构
----

![architecture](/images/jueJin/463177070e7ce77.png)

### Horizon-Core

Horizon-Core 是 Horizon 平台的核心，Horizon-Core 是一个 Restful 服务器，为Web UI、CLI 等各种系统，提供了 OpenAPI 接口。它提供了丰富的功能，包括 Kubernetes 和环境管理，模板管理，私有令牌和访问令牌管理，组、应用程序和集群管理，CI/CD 流水线管理，Webhook 管理，用户和成员管理以及 IDP 管理。

### Gitlab & ArgoCD

Horizon 使用 Gitlab 存储应用程序所有配置，而 Argo CD 则是 Horizon 默认的 GitOps 引擎，用于将应用程序的配置文件（Kubernetes Manifest）从 Git 仓库渲染同步到 Kubernetes。

### Tekton & S3

Horizon 使用云原生流水线 Tekton 作为默认的 CI 引擎，可以自动从源代码构建镜像。一旦流水线完成，Horizon 将流水线归档存储在 S3 存储中，兼容 Mino 和 AWS S3等服务。

### Grafana

为了监控平台的健康状况，Horizon 集成了 Grafana。如果配置了 Prometheus 源，Horizon 将自动探测指标并在指标仪表板上显示所有指标。

### MySql & Redis

最后，Horizon 使用 MySQL 和 Redis 存储和缓存基本元信息，包括成员、用户、令牌、Webhook、IDP 等相关数据。

相关产品比较
------

### Horizon 与 ArgoCD

Argo CD 对于 Kubernetes 运维团队和熟悉 Kubernetes 的用户来说是一个很好的工具，实际上，Horizon 使用 Argo CD 作为默认的 GitOps 引擎。但是我们认为 Argo CD 对于广大的业务研发的全流程支撑并不是很友好。基于 Group、Member、RBAC 和 Template 等核心特性， Horizon 对于业务开发者更加友好。

#### 产品功能对比

产品功能

Horizon

Argo CD

CI

支持（待完善）

不支持

CD

支持

支持

GitOps

支持

支持

Group

支持

不支持

RBAC 与 Member

支持

支持

Template

支持

不支持

应用

支持自定义

支持自定义

### Horizon 与 OpenShift

我们认为 Horizon 和 Openshift 都想要解决同一个问题。两者都给予了用户在Kubernetes上构建、部署和运行应用的能力。但是 Horizon 与 Openshift 存在根本性的差异，Openshift 更像是 Kubernetes 的发行版，但是 Horizon 的目标是成为基于 Kubernetes 的持续交付平台。

#### 产品功能对比

产品功能

Horizon

OpenShift

CI

支持（待完善）

支持

CD

支持

支持

GitOps

支持

支持

Group

支持

支持

RBAC 与 Member

支持

支持

Template

支持

不支持

应用

支持自定义

丰富，支持各种预置中间件

### Horizon 与 KubeVela

和 Horizon 一样，KubeVela 通过 OAM 掩盖了 Kubernetes 的复杂性。但是 Horizon 和 KubeVela 的定位不同，KubeVela 是一个部署工具，而 Horizon 则是一个功能完善的平台，支持登录、RBAC、Group管理等功能。对于企业来说，这些功能都是不可或缺的。

#### 产品功能对比

产品功能

Horizon

KubeVela

CI

支持（待完善）

不支持

CD

支持

支持

GitOps

支持

不支持

Group

支持

支持

RBAC 与 Member

支持

支持

Template

支持

支持

应用

支持自定义

支持自定义

社区
--

Horizon计划建设一个关于 GitOps 与 CD 的国际化社区，如果你对GitOps、云原生或者 CICD 感兴趣，请与我们联系，或者在 GitHub 上给我们一个 Star。

Github：[github.com/horizoncd/h…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd%2Fhorizon "https://github.com/horizoncd/horizon")

官网与文档：[horizoncd.github.io/](https://link.juejin.cn?target=https%3A%2F%2Fhorizoncd.github.io%2F "https://horizoncd.github.io/")

Slack：[join.slack.com/t/horizoncd…](https://link.juejin.cn?target=https%3A%2F%2Fjoin.slack.com%2Ft%2Fhorizoncd%2Fshared_invite%2Fzt-1pqpobiwn-1mgV60SIa1oi4mL1WXf7uA "https://join.slack.com/t/horizoncd/shared_invite/zt-1pqpobiwn-1mgV60SIa1oi4mL1WXf7uA")

微信：

![wechat](/images/jueJin/10b2d205b93869b.png)

注：如果二维码过期，请前往 Horizon Github 仓库查看最新二维码