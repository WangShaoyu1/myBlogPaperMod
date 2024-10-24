---
author: ""
title: "云音乐 GitOps 最佳实践"
date: 2023-07-03
description: "我们是来自云音乐的云原生团队，在实际开发中，GitOps 解决了许多运维的痛点，本文将介绍我们如何实现 GitOps，以及我们在实践中遇到的问题和解决方案。"
tags: ["自动化运维","DevOps中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:10,comments:1,collects:12,views:9717,"
---
> 本文作者：kiloson

近些年随着微服务、kubernetes 等技术的发展，越来越多的厂商将单体架构的项目进行微服务化。但是随着原有项目的不断拆分，微服务的数量越来越多，部署的频率也越来越高，传统手工运维的劣势越发明显，效率低、部署质量没有保证。在云原生时代，是否有一种更加高效、稳定的部署方式，可以帮助我们改进部署和管理流程呢？

随着我们对运维方法的调研，我们发现 GitOps 能够很好的解决这些问题。GitOps 是一种符合 DevOps 思想的运维方式，GitOps 以 Git 仓库作为唯一的事实来源，储存声明式配置，并通过自动化工具实现环境和应用的自动化管理。Git 实现了版本控制、回滚、多人协作；声明式配置保证了配置的可读性和事务性；自动化部署消除了人为错误，调高了部署效率和准确性，同时也保证了多环境的一致性。所以 **GitOps + 声明式配置** 能够很好的解决传统运维的痛点，提高部署效率，保证部署质量。

主机部署的缺陷
-------

在传统的云主机部署模式下，通过工单创建运维请求，运维人员接收到工单后，通过 Ansible 等运维工具手动进行运维操作。这种方式在实际操作过程中遇到了许多问题，比如由于 Ansible 基于 SSH 下发文件，所以需要给每台机器配置 SSH；因为机器底层的异构，导致运维需要修改配置文件；或是因为脚本执行顺序错误，导致需要重新执行整个部署流程；手工操作，导致部署效率低，容易出错，无法保证部署质量。

总的来说，云主机时代运维存在以下缺陷：

1.  **环境不一致**：需要step-by-step的编写脚本，设想目标环境中的各种情况，编写脚本时需要考虑各种情况，比如机器是否已经部署过，机器是否已经配置过 SSH，机器是否已经安装过依赖等等。并且脚本运行在不同环境中可能会有不同的结果。
2.  **无事务保证**：安装脚本不能被打断，如果中途遇到问题，服务可能处于不可用的中间状态。
3.  **协作困难**：需要另行编写文档描述运维流程，如果多人同时维护一个脚本，协作往往非常困难。
4.  **回滚困难**：部署流程难以回滚，如果部署过程中出现问题，需要手动执行逆向操作。
5.  **权限管控与审核**：通常运维需要目标主机的 root 权限，难以限制运维人员的权限，同时也难以对整个运维动作进行审核。

云原生时代部署特点
---------

云原生的代表技术包括容器、服务网格、微服务、不可变基础设施和声明式API。云原生时代，微服务架构应用成为了主流。微服务架构的特点是将应用拆分成多个服务，每个服务都有自己的数据库和配置文件。每个微服务都是独立部署的，这大大提高了部署的频率，带来了新的挑战：

1.  **部署频繁**：微服务应用被拆分成了多个服务，每个服务都需要独立部署，部署频率大大提高，需要更高的部署效率
2.  **多副本**：微服务通过扩容副本的方式来提高可用性，通常需要部署多副本，有时甚至需要部署数百个副本
3.  **多环境**：通常需要部署多个环境，比如开发环境、测试环境、预发环境和生产环境

为满足以上需求，我们需要一种全新的部署方式

1.  其应该有较高的_自动化_水平，能够减少人工参与，减少出错，提高部署效率
2.  应该有良好的_版本控制_，方便_回滚_
3.  应该保证多环境_一致_，快速在多个环境中拉起相同的应用，方便测试和验证
4.  应该能够保证_事务_，避免部署过程中出错，导致服务不可用
5.  便于_多人协作_，提高部署效率

什么是GitOps
---------

如果我们需要自己实现一种满足需求的部署方式，我们需要自己实现一个版本管理系统，这需要很大的工作量。但是事实上市面上已经存在一个十分优秀的版本管理系统，那就是 Git。 能不能直接基于 Git 进行部署呢？我们顺着这个思路继续调研基于 Git 的部署方式，最终发现了 GitOps，GitOps 能够很好的满足以上需求。 那么究竟什么是 GitOps 呢？ GitOps 的关键是使用 **Git 仓库**储存**声明式配置**，通过**自动化工具**将 Git 仓库中的配置应用到目标环境中。**Git 仓库**满足了对于_版本管理_、_回滚_、_多人协作_的需求，**声明式**配置满足了对于_事务性_、_一致性_的需求，而**自动化**工具提高了部署的_自动化_水平。所以 GitOps 能够很好的满足云原生时代的部署需求，是一种优秀的部署方式。

### Git仓库

Git 仓库所有开发者都很熟悉，它是一个分布式的版本控制系统，可以方便的进行版本管理和回滚。在 GitOps 中，Git 仓库作为唯一的事实来源，储存所有的配置信息。 使用 Git 仓库储存配置，可以方便的进行**版本管理**和**回滚**，并且天然支持**多人协作**，同时修改配置文件。并且通过 Pull Request 提交修改，可以基于 **Code Review** 保证修改的正确性和质量。

### 声明式配置

声明式配置使用配置文件直接描述系统的期望状态，使用者不需要考虑执行流程和目标环境的差异，易于编写、理解、代码 review 和进行版本管理。并且声明式配置天然具备幂等性，可以重复应用而不会导致系统状态发生变化。具备**事务性**，要么全部应用成功，要么什么都不做。以 Kubernetes 资源配置文件为例，使用者只需要指定 CPU 和 Memory 的大小，而不需要关心底层执行细节和环境差异，保证了各个环境中部署**一致**。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: example-deployment
spec:
replicas: 3
selector:
matchLabels:
app: example-app
template:
metadata:
labels:
app: example-app
spec:
containers:
- name: example-container
image: example-image
resources:
limits:
cpu: 1
memory: 512Mi
requests:
cpu: 500m
memory: 256Mi
```

### 自动化工具

GitOps 中的自动化工具负责将 Git 仓库中的配置应用到目标环境中。自动化工具可以是Gitlab CI、 Github Action 这类流水线工具，也可以是 Argo CD 这类专门用于 GitOps 的工具，自动化工具可以根据 Git 仓库中的配置，自动化的完成部署、回滚、监控、告警等工作。

以 ArgoCD 为例，用户只需要创建 Git 仓库和 ArgoCD Application，ArgoCD 就会自动的将 Git 仓库中的配置应用到目标环境中。并且 ArgoCD 会实时监听 Git 仓库的变化，一旦 Git 仓库中的配置发生变化，ArgoCD 也可以进行自动同步。

![argocd](/images/jueJin/6dace53a13c6336.png)

自动化工具能够提高部署**自动化**水平、效率，减少人工参与，减少出错，提高部署效率。满足了我们对高自动化水平的需求。

GitOps 实践
---------

经过上面的描述，相信大家已经对 GitOps 有了一个初步的认识。下面，我们将通过云音乐内部的实践，展示 GitOps 在生产环境中的应用与优势。 在云音乐全面推进容器化的过程中，需要安装部署许多的管控面组件，比如Grafana、Argo Rollout等，并且需要在多个环境中安装相同的应用。出于对 GitOps 理念的认同，我们设计了设计了一套基于 Gitlab CI 流水线的 GitOps 部署体系。

### 管控面运维

在云音乐的容器化过程中，我们使用了许多开源的管控面组件，比如 Prometheus、Grafana、Argo Rollout 等。我们有许多 kubernetes 集群，很多 kubernetes 集群中都需要安装相同的组件，通过手工安装费时费力，而且很难保证所有环境的配置一致。并且，在运维过程中，可能会出现多人修改同一个应用配置的情况，如何避免修改冲突和覆盖？Kubernetes 十分强大，但同时其也非常复杂，有海量的配置项可以修改，如何保证配置的正确性？

为了解决以上问题，我们设计了一套基于 GitOps 的自动化运维流程。每个线上组件都会有两到三个对应的仓库，分别是：代码仓库、配置仓库、Helm Chart 仓库。其中，代码仓库存放组件的源代码，如果是开源组件，则直接使用开源的 release，没有对应仓库；Helm Chart 仓库存放组件的 Helm Chart，配置仓库通过 [Helm Dependency](https://link.juejin.cn?target=https%3A%2F%2Fhelm.sh%2Fdocs%2Fhelm%2Fhelm_dependency%2F "https://helm.sh/docs/helm/helm_dependency/") 引用 Helm Chart 仓库中的 Chart，并存放了 values.yaml 文件，用于配置组件的参数。 将通用配置抽出来，放到同一个 Helm Cart 中，并在部署仓库中引用该 Chart，可以有效避免因多环境导致的配置不一致问题。

当需要修改配置时，开发者只需要修改配置仓库中的 values.yaml 文件，并向原仓库提交 MR，这时会触发流水线，验证修改是否正确。通过验证后，开发者需要请求团队中的其他人帮忙 review。通过检查后，将 MR 合并到 master 分支，这时会触发流水线，运行修改之后的配置，使用 Helm Upgrade 命令将组件更新到环境中。发布完成后，如果开发者本次更新升级有任何问题，可以通过运行上一次的部署流水线，将组件回滚到上一次的版本。

![push](/images/jueJin/c5338a7b3997c73.png)

为了强制执行以上过程，通常会回收开发者对于 master 分支的更新权限。开发者只能通过向原仓库提交 MR 的方式，来配置修改。这样，就可以保证配置和环境的一致性。为了避免开发者没有合入权限，我们开发了一个 review 机器人，当开发者提交 MR 时，机器人会在评论区进行评论，要求其他人 review 并投票。当该 MR 获得足够的票数（通常是两票）后，机器人会自动合入 MR。

![review rebot](/images/jueJin/c0dd4ba571efa8f.png)

需要注意的是，这里选择了使用一个仓库对应一个环境，但是实际上，也可以使用一个仓库对应多个环境，只需要在仓库中创建多个分支，每个分支对应一个环境，然后在流水线中，根据分支名称，选择对应的环境。为什么选择仓库对应环境的方式而不是分支对应环境的形式呢？主要是因为仓库对应环境的形式在权限管控方面比较有优势，因为开发者可能需要不同环境拥有不同的权限，如果选择分支对应环境，那么就需要在部署流程中对不同环境的权限进行管控，这样很麻烦。

并且通过引入测试流水线和 Reviewer 降低了出错的概率，通过重新运行部署流水线完成了快速回滚，通过 commit 记录每次部署的操作者，通过自动化部署减少了人工介入，解决了绝大部分传统部署过程中的问题。

### Horizon 应用部署

以上实践，部署少量的管控面组件还是比较方便的，但当部署的应用数量增多时，就会变得比较麻烦。因为每个应用都需要创建对应的仓库和创建流水线，这样就会导致仓库、流水线数量过多，维护成本过高。 为了优化云音乐大量应用的部署流程，我们开发了 Horizon CD 平台，Horizon 基于 GitOps、ArgoCD 部署应用。通过 Horizon，开发者只需要在 Horizon 平台上创建应用，配置应用的参数，就可以完成应用的部署，并且也可以享受到 GitOps 带来的好处。

开发者通过填写表单即可在 Horizon 上创建应用，表单中包含了应用的基本信息和部署信息，例如应用名称、应用描述、镜像地址、副本数、部署环境等。Horizon 会为应用创建对应的 GitOps 仓库，并将用户输入以及其它创建应用必要的信息一并写入到 GitOps 仓库中。GitOps 仓库中的每个分支对应不同的环境，方便管理多环境。 用户可以根据以上创建的应用，创建对应的应用实例，应用实例对应 Kubernetes 中的一系列相关资源。Horizon 会为该应用实例创建 GitOps 仓库和 ArgoCD Application。 该 GitOps 仓库有两个 branch —— master 和 gitops。master 和 gitops 分支都存放了应用的配置。用户修改应用配置后，Horizon 会将修改记录到 gitops 分支中。用户发布应用时，Horizon 会将 gitops 分支合并到 master 分支中，并触发 ArgoCD 同步，将 GitOps 仓库中的配置应用到 Kubernetes 中。这样，就完成了一次部署。

如果有人手动修改了 kubernetes 中相关资源或者修改了 GitOps 仓库但并未执行同步，ArgoCD 会感知到 master 分支配置与 kubernetes 中资源配置不一致，会将该应用标记为 `OutOfSync`，在 Horizon 上，用户也可以观察到该应用状态不正常，方便用户及时发现问题，并与 Horizon 管理员联系，及时排查解决。

![pull](/images/jueJin/6a07471bcc37973.png)

Horizon 依赖于 GitOps 仓库实现回滚，Horizon 的每次发布会在 master 分支生成一条 commit 记录，当用户需要回滚应用实例时，只需要找到当时的部署记录，即一条 Pipelinerun 记录，代表了一次流水线运行。Horizon 通过该 Pipelinerun 记录找到对应的 commit 记录，然后将该记录之后的所有 commit 记录revert，最后触发 ArgoCD 的同步，这样就完成了一次回滚。

![rollback](/images/jueJin/472b1c3bb342629.png)

#### GitOps 仓库

Horizon 通过拓展 Helm Chart，设计了一套 Template 系统。Template 包含三个部分，[Helm Chart](https://link.juejin.cn?target=https%3A%2F%2Fhelm.sh%2Fdocs%2Fchart_template_guide%2Fgetting_started%2F "https://helm.sh/docs/chart_template_guide/getting_started/")，[JsonSchema](https://link.juejin.cn?target=https%3A%2F%2Fjson-schema.org%2F "https://json-schema.org/") 和 [ReactJsonSchemaForm](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frjsf-team%2Freact-jsonschema-form "https://github.com/rjsf-team/react-jsonschema-form")。Horizon 会通过 ReactJsonSchemaForm 渲染表单，获取用户输入，并使用 JsonSchema 验证用户输入，确认无误后，记录到 GitOps 仓库的相关文件中。GitOps 仓库是一个 Helm Chart 仓库，部署时，ArgoCD 通过 Helm 渲染 Manifest，并将 Manifest 应用到 Kubernetes 中。Horizon 管理员可以通过自定义 Template，实现部署各种类型的应用，非常灵活。

以下为 GitOps 仓库结构

![gitops-repo-tree](/images/jueJin/0f3281f3b1c189b.png)

`Chart.yaml` 文件是 Helm Chart 的标准，通过 dependency 字段，引用预先定义的 Horizon Template。

```yaml
apiVersion: v2
name: demo
version: 1.0.0
dependencies:
- name: deployment
version: v0.0.1-ec06d596
repository: https://horizon-harbor-core.horizon.svc.cluster.local/chartrepo/horizon-template
```

`application.yaml` 包含了用户通过 ReactJsonSchemaForm 表单填写的数据。

```yaml
deployment:
app:
envs:
- name: test
value: test
spec:
replicas: 1
resource: x-small
```

`pipeline-output.yaml` 包含了 CI 阶段的输出，因为在 Horizon 中 CI 也是可以自定义的，所以该文件的内容也是不固定的。默认的 CI 脚本输出如下：

```yaml
deployment:
image: library/demo:v1
git:
branch: master
commitID: 28992d8f35a6ef38d59181080b3728df9540d8d6
url: https://github.com/horizoncd/springboot-source-demo.git
```

参数

描述

.Values.image

CI 阶段构建 image 的全路径

.Values.git.{ref}

源代码仓库的引用类型，可以是 branch、tag、commit

.Values.git.commitID

构建代码的 commit ID

.Values.git.url

源代码的引用链接

`pipeline.yaml` 包含了 CI 阶段的配置信息，Horizon 管理员可以通过自定义 CI 以支持更多的构建类型

```yaml
pipeline:
buildType: dockerfile
dockerfile:
path: ./Dockerfile
```

参数

描述

.Values.buildType

该应用的构建类型，默认是“dockerfile”

.Values.dockerfile.path

dockerfile 相对于源代码仓库的路径

.Values.dockerfile.content

dockerfile 的内容

`sre.yaml` 包含了一些管理员配置，比如ingress、默认的超售比等等。使用 `sre.yaml` 文件修改管理员配置，既可以做到关注点分离，又保证了 GitOps 应用修改的体验统一。比如可以通过配置`nodeAffinity`，将应用部署到特定的节点上。SRE在修改`sre.yaml`后，也需要提交 PR 到 GitOps 仓库，并通过 review 机器人完成多人审核，合入到发布分支，最后在 Horizon 上执行发布，即可完成变更。

```yaml
deployment:
affinity:
nodeAffinity:
requiredDuringSchedulingIgnoredDuringExecution:
nodeSelectorTerms:
- matchExpressions:
- key: cloudnative/demo
operator: In
values:
- "true"
```

system目录下的文件记录了部署的元信息

`env.yaml` 记录了部署环境相关的信息

参数

描述

.Values.env.environment

环境名

.Values.env.region

Kubernete 名

.Values.env.namespace

Namespace

.Values.env.baseRegistry

image 仓库的地址

.Values.env.ingressDomain

ingress 域名

```yaml
deployment:
env:
environment: local
region: local
namespace: local-1
baseRegistry: horizon-harbor-core.horizon.svc.cluster.local
ingressDomain: cloudnative.com
```

`horizon.yaml` 包含了该应用在 Horizon 中的信息

参数

描述

.Values.horizon.application

应用名

.Values.horizon.clusterID

集群ID（这里的集群指应用实例，应用为配置集合）

.Values.horizon.cluster

集群

.Values.horizon.template.name

模板名

.Values.horizon.template.release

模板版本

.Values.horizon.priority

优先级

`restart.yaml` Horizon 通过修改该文件内容，重启所有 Pod

参数

含义

.Values.restartTime

重启时间

```yaml
deployment:
restartTime: "2023-01-06 18:28:49"
```

结语
--

通过以上部署模式，我们可以很方便的管理数十个环境上百管控面管控面组件的部署，而且每个环境的配置都是独立的，修改对应的配置仓库不会影响其他环境的部署。同时，基于 Horizon 平台，我们实现了部署的自动化，用户发布应用时，只需要填写表单，即可完成应用发布，无需运维人员介入，运维效率提升 10 倍以上。Horizon 平台如今每天的发布数量已经达到了 1000+，这是传统运维模式难以企及的。在达成高效发布的同时，也保证了发布的质量，每次发布都有对应的流水线记录，可以方便的回滚到任意版本。Horizon 将开发、运维、测试等多个团队的工作流程串联起来，实现了 DevOps 的理念。

GitOps 在云音乐的实践中，表现出了非常好的效果，但同时在实践中我们也发现了一些问题：

1.  修改不便：设想，如果我们有多个环境，每个环境都对应一个配置仓库，那么一旦需要修改一个统一的值，那么需要修改所有仓库。
2.  密码管理：Git 仓库中数据都是明文显示，并且 Git 仓库会记住所有的历史修改，所以放在 Git 仓库中的明文信息应该加密。虽然社区里面开发了一些类似于 [git-secret](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsobolevn%2Fgit-secret "https://github.com/sobolevn/git-secret") 的工具，但使用起来还是不太方便。这里需要注意的是，密码管理指将密钥放置于 Git 仓库中，和 Gitlab、Github secret并不一致。将密码放在 secret 中，就失去了 Git 仓库提供的 版本管理、回滚、审计等能力。
3.  标准不统一：对于回滚的实现，到底是修改配置，reset 到对应版本；还是通过运行 CI，重新部署到环境中？对于不同环境的相同应用部署，到底是选择多个仓库，还是一个仓库多个环境？这些都没有统一的标准，需要根据自身情况选择。

所以 GitOps 并不是银弹，使用者任需要基于自身情况判断，选择最适合自己的方案。 但是 GitOps 作为随着云原生出生的 DevOps 方法，还在快速发展中，相信以上提到的问题，以后都会逐渐被解决。我们也会持续关注、尝试 GitOps 领域的最新技术和解决方案。如果你对 Horizon 或者 GitOps，可以[加入我们](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhorizoncd%2Fhorizon%23contact-us "https://github.com/horizoncd/horizon#contact-us")，和我们一起讨论。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！