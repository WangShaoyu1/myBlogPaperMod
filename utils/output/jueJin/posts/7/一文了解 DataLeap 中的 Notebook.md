---
author: "字节跳动技术团队"
title: "一文了解 DataLeap 中的 Notebook"
date: 2022-10-27
description: "Notebook 是一种支持 REPL 模式的开发环境。如何将 notebook 应用在数据研发中？"
tags: ["大数据中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:11,comments:2,collects:8,views:6279,"
---
一、概述
====

Notebook 是一种支持 REPL 模式的开发环境。所谓「REPL」，即「读取-求值-输出」循环：输入一段代码，立刻得到相应的结果，并继续等待下一次输入。它通常使得探索性的开发和调试更加便捷。在 Notebook 环境，你可以交互式地在其中编写你的代码、运行代码、查看输出、可视化数据并查看结果，使用起来非常灵活。

在数据开发领域，Notebook 广泛应用于数据清理和转换、数值模拟、统计建模、数据可视化、构建和训练机器学习模型等方面。

但是显然，做数据开发，只有 Notebook 是不够的。在火山引擎 DataLeap 数据研发平台，我们提供了任务开发、发布调度、监控运维等一系列能力。我们将 Notebook 作为一种任务类型，加入了数据研发平台，使用户既能拥有 Notebook 交互式的开发体验，又能享受一站式大数据研发治理套件提供的便利。如果还不够直观的话，试想以下场景：

> 在交互式运行和可视化图表的加持下，你很快就调试完成了一份 Notebook。简单整理了下代码，根据使用到的数据配置了上游任务依赖，上线了周期调度，并顺手挂了报警。之后，基本上就不用管这个任务了：不需要每天手动检查上游数据是否就绪；不需要每天来点击运行，因为调度系统会自动帮你执行这个 Notebook；执行失败了有报警，可以直接上平台来处理；上游数据出错了，可以请他们发起深度回溯，统一修数。

二、选型
====

2019 年末，在决定要支持 Notebook 任务的时候，我们调研了许多 Notebook 的实现，包括 Jupyter、Polynote、Zeppelin、Deepnote 等。Jupyter Notebook 是 Notebook 的传统实现，它有着极其丰富的生态以及庞大的用户群体，相信许多人都用过这个软件。事实上，在字节跳动数据平台发展早期，就有了在物理机集群上统一部署的 Jupyter（基于多用户方案 JupyterHub），供内部的用户使用。考虑到用户习惯和其强大的生态，Jupyter 最终成为了我们的选择。

![图片](/images/jueJin/3bb0b491e6a34ee.png)

Jupyter Notebook 是一个 Web 应用。通常认为其有两个核心的概念：Notebook 和 Kernel。

*   Notebook 指的是代码文件，一般在文件系统中存储，后缀名为`ipynb`。Jupyter Notebook 后端提供了管理这些文件的能力，用户可以通过 Jupyter Notebook 的页面创建、打开、编辑、保存 Notebook。在 Notebook 中，用户以一个一个 Cell 的形式编写代码，并按 Cell 运行代码。Notebook 文件的具体内容格式，可参考 The Notebook file [format](https://link.juejin.cn?target=https%3A%2F%2Fnbformat.readthedocs.io%2Fen%2Flatest%2Fformat_description.html "https://nbformat.readthedocs.io/en/latest/format_description.html")。
*   Kernel 是 Notebook 中的代码实际的运行环境，它是一个独立的进程。每一次「运行」动作，产生的效果是单个 Cell 的代码被运行。具体来讲，「运行」就是把 Cell 内的代码片段，通过 Jupyter Notebook 后端以特定格式发送给 Kernel 进程，再从 Kernel 接受特定格式的返回，并反馈到页面上。这里所说的「特定格式」，可参考 [Messaging in Jupyter](https://link.juejin.cn?target=https%3A%2F%2Fjupyter-client.readthedocs.io%2Fen%2Fstable%2Fmessaging.html "https://jupyter-client.readthedocs.io/en/stable/messaging.html")。

在 DataLeap 数据研发平台，开发过程围绕的核心是任务。用户可以在项目下的任务开发目录创建子目录和任务，像 IDE 一样通过目录树管理其任务。Notebook 也是一种任务类型，用户可以启动一个独立的任务 Kernel 环境，像开发其他普通任务一样使用 Notebook。

![图片](/images/jueJin/d8ba1081fcfe4f1.png)

三、技术路线
======

在 Jupyter 的生态下，除了 Notebook 本身，我们还注意到了很多其他组件。彼时，JupyterLab 正在逐渐取代传统的 Jupyter Notebook 界面，成为新的标准。JupyterHub 使用广泛，是多用户 Notebook 的版本答案。脱胎于 Jupyter Kernel Gateway(JKG)的 Enterprise Gateway(EG)，提供了我们需要的 Remote Kernel（上述的独立任务 Kernel 环境）能力。2020 上半年，我们基于上面的三大组件，进行二次开发，在字节跳动数据研发平台发布了 Notebook 任务类型。整体架构预览如图。

![图片](/images/jueJin/8d221c5f87f04f5.png)

### JupyterLab

前端这一侧，我们选择了基于更现代化的 JupyterLab ([jupyterlab.readthedocs.io/en/stable/g…](https://link.juejin.cn?target=https%3A%2F%2Fjupyterlab.readthedocs.io%2Fen%2Fstable%2Fgetting_started%2Foverview.html "https://jupyterlab.readthedocs.io/en/stable/getting_started/overview.html")) 进行改造。我们刨去了它的周边视图，只留下了中间的 Cell 编辑区，嵌入了 DataLeap 数据研发的页面中。为了和 DataLeap 的视觉风格更契合，从 2020 下半年到 2021 年初，我们还针对性地改进了 JupyterLab 的 UI。这其中包括将整个 JupyterLab 使用的代码编辑器从 CodeMirror 统一到 DataLeap 数据研发使用的 Monaco Editor，同时还接入了 DataLeap 提供的 Python & SQL 代码智能补全功能。

额外地，我们还开发了定制的可视化 SDK，使得用户在 Notebook 上计算得到的 Pandas Dataframe 可以接入 DataLeap 数据研发已经提供的数据结果分析模块，直接在 Notebook 内部做一些简单的数据探查。

### JupyterHub

[JupyterHub](https://link.juejin.cn?target=https%3A%2F%2Fjupyterhub.readthedocs.io%2Fen%2Fstable%2F "https://jupyterhub.readthedocs.io/en/stable/") 提供了可扩展的认证鉴权能力和环境创建能力。首先，由于用户较多，因此为每个用户提供单独的 Notebook 实例不太现实。因此我们决定，按 DataLeap 项目来切分 Notebook 实例，同项目下的用户共享一个实例（即一个项目实际上在 JupyterHub 是一个用户）。这也与 DataLeap 的项目权限体系保持了一致。注意这里的「Notebook 实例」，在我们的配置下，是拉起一个运行 JupyterLab 的环境。另外，由于我们会使用 Remote Kernel，所以在这个环境内，并不提供 Kernel 运行的能力。

在认证鉴权方面，我们让 JupyterHub 请求我们业务后端提供的验证接口，判断登录态的用户是否具备请求的对应 DataLeap 项目的权限，以实现权限体系对接。

在环境创建方面，我们通过 OpenAPI 对接了字节跳动内部的 PaaS 服务，为每一个使用了 Notebook 任务的 DataLeap 项目分配一个 JupyterLab 实例，对应一个 PaaS 服务。由于直接新建一个服务的流程较长，速度较慢，因此我们还额外做了池化，预先启动一批服务，当有新项目的用户登入时直接分配。

### Enterprise Gateway

[Jupyter Enterprise Gateway](https://link.juejin.cn?target=https%3A%2F%2Fjupyter-enterprise-gateway.readthedocs.io%2Fen%2Flatest%2F "https://jupyter-enterprise-gateway.readthedocs.io/en/latest/") 提供了在分布式集群（包括 YARN、Kubernetes 等）内部启动 Kernel 的能力，并成为了 Notebook 到集群内 Kernel 的代理。在原生的 Notebook 体系下，Kernel 是 Jupyter Notebook / JupyterLab 中的一个本地进程；对于启用了 Gateway 功能的 Notebook 实例，所有 Kernel 相关的功能的请求，如获取 Kernel 类型、启动 Kernel、运行 Cell、中断等，都会被代理到指定的 Gateway 上，再由 Gateway 代理到具体集群内的 Kernel 里，形成了 Remote Kernel 的模式。

这样带来的好处是，Kernel 和 Notebook 分离，不会相互影响：例如某个 Kernel 运行占用物理内存超限，不会导致其他同时运行的 Kernel 挂掉，即使他们都通过同一个 Notebook 实例来使用。

![图片](/images/jueJin/1a377018455a470.png)

EG 本身提供的 Kernel 类型，和字节跳动内部系统并不完全兼容，需要我们自行修改和添加。我们首先以 Spark Kernel 的形式对接了字节跳动内部的 YARN 集群。Kernel 以 PySpark 的形式在 Cluster 模式的 Spark Driver 运行，并提供一个默认的 Spark Session。用户可以通过在 Driver 上的 Kernel，直接发起运行 Spark 相关代码。同时，为了满足 Spark 用户的使用习惯，我们额外提供了在同一个 Kernel 内交叉运行 SQL 和 Scala 代码的能力。

2020 下半年，伴随着云原生的浪潮，我们还接入了字节跳动云原生 K8s 集群，为用户提供了 Python on K8s 的 Kernel。我们还扩展了很多自定义的能力，例如支持自定义镜像，以及针对于 Spark Kernel 的自定义 Spark 参数。

稳定性方面，在当时的版本，EG 存在异步不够彻底的问题，在 YARN 场景下，单个 EG 进程甚至只能跑起来十几个 Kernel。我们发现了这一问题，并完成了各处所需的 async 逻辑改造，保证了服务的并发能力。另外，我们利用了字节跳动内部的负载均衡（nginx 七层代理集群）能力，部署多个 EG 实例，并指定单个 JupyterLab 实例的流量总是打到同一个 EG 实例上，实现了基本的 HA。

四、架构升级
======

当使用 Notebook 的项目日渐增加时，我们发现，运行中的 PaaS 服务实在太多了，之前的架构造成了

1.  部署麻烦。全量升级 JupyterLab 较为痛苦。尽管有升级脚本，但是通过 API 操作升级服务，可能由于镜像构建失败等原因，会造成卡单现象，因此每次全量升级后都是人工巡检检查升级状态，卡住的升级单人工点击下一步。同时由于升级不同服务不会复用配置相同的镜像，所以有多少服务就要构建多少次镜像，当服务数量达到一定量级时，我们的批量升级请求可能把内部镜像构建服务压垮。

2.  JupyterLab 需要不断的根据用户增长（项目增长）进行扩容，一旦预先启动好的资源池不够，就会存在新项目里有用户打开 Notebook，需要经历整个 JupyterLab 服务创建、环境拉起的流程，速度较慢，影响体验。而且，JupyterLab 数量巨大后，遇到 bad case 的几率增高，有些问题不易复现、非常偶发，重启/迁移即可解决，但是在遇到的时候，用户体验受影响较大。

3.  运维困难。当用户 JupyterLab 可能出现问题，为了找到对应的 JupyterLab，我们需要先根据项目对应到 JupyterHub user，然后根据 user 找到 JupyterHub 记录的服务 id，再去 PaaS 平台找服务，进 webshell。

4.  当然，还有资源的浪费。虽然每个实例很小(1c1g)，但是数量很多；有些项目并不总是在使用 Notebook，但 JupyterLab 依然运行。

5.  稳定性存在问题。一方面，JupyterHub 是一个单点，升级需要先起后停，挂了有风险。另一方面，EG 入流量经过特定负载均衡策略，本身是为了使 JupyterLab 固定往一个 EG 请求。在 EG 升级时，JupyterLab 请求的终端会随之改变，极端情况下有可能造成 Kernel 启动多次的情况。

基于简化运维成本、降低架构复杂性，以及提高用户体验的考虑，2021 上半年，我们对整体架构进行了一次改良。在新的架构中，我们主要做了以下改进，大致简化为下图：

1.  移除 JupyterHub，将 JupyterLab 改为多实例无状态常驻服务，并实现对接 DataLeap 的多用户鉴权。

2.  改造原本落在 JupyterLab 本地的数据存储，包括用户自定义配置、Session 维护和代码文件读写。

3.  EG 支持持久化 Kernel，将 Kernel 远程环境元信息持久化在远端存储(MySQL)上，使其重启时可以重连，且 JupyterLab 可以知道某个 Kernel 需要通过哪个 EG 连接。

![图片](/images/jueJin/cd264dd802434df.png)

### 鉴权 & 安全

单用户的 Jupyter Notebook / JupyterLab 的鉴权相对简单（实际上 JupyterLab 直接复用了 Jupyter Notebook 的这套代码）。例如，使用默认命令启动时，会自动生成一个 token，同时自动拉起浏览器。有了 token，就可以任意地访问这个 Notebook。

事实上，JupyterHub 也是起到了维护 token 的作用。前端会发起一个获取 token 的 API 请求，再拿着获取的 token 请求通过 JupyterHub proxy 到真实的 Notebook 实例。而我们直接为 Jupyter Notebook 增加了 Auth 的功能，实现了在 JupyterLab 单实例上完成这套鉴权（此时，使用了 DataLeap 服务签发的 Token）。

![图片](/images/jueJin/3ee021d0dbc7438.png)

最后，由于所有用户会共享同一组 JupyterLab，我们还需要禁止一些接口的调用，以保证系统的安全。最典型的接口包括关闭服务(Shutdown)，以及修改配置等。后续 Notebook 所需的配置，转由前端保存在浏览器内。

### 代码 & Session 持久化

Jupyter Notebook 使用 [File Manager](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjupyter-server%2Fjupyter_server%2Fblob%2Fmain%2Fjupyter_server%2Fservices%2Fcontents%2Ffilemanager.py "https://github.com/jupyter-server/jupyter_server/blob/main/jupyter_server/services/contents/filemanager.py") 管理 Contents 相关读写（对我们而言主要是 Notebook 代码文件），原生行为是将代码存储在本地，多个服务实例之间无法共享同一份代码，而且迁移时可能造成代码丢失。

为了避免代码丢失，我们的做法是，把代码按项目分别存储在 OSS 上并直接读写，同时解决了一些由于代码文件元信息丢失，并发编辑导致的其他问题。例如，当多个页面访问同一份代码文件时，都会从 OSS 获取最新的 code，当用户存储时，前端会获取最新的代码文件，比较该文件的修改时间同前端存储的是否一致，如果不同，则说明有其它页面存储过，会提示用户选择覆盖或是恢复。

![图片](/images/jueJin/2067c76fa3f8407.png)

Notebook 使用 Session 管理用户到 Kernel 的连接，例如前端通过 `POST /session` 接口启动 Kernel，`GET /session` 查看当前运行中的 Kernel。在 Session 处理方面，原生的 Notebook 使用了原生的 sqlite(in memory)，见[代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjupyter-server%2Fjupyter_server%2Fblob%2Fmain%2Fjupyter_server%2Fservices%2Fsessions%2Fsessionmanager.py "https://github.com/jupyter-server/jupyter_server/blob/main/jupyter_server/services/sessions/sessionmanager.py")。 尽管我们并不明白这么做的意义何在（毕竟原生的 Notebook 重启，一切都没了），但我们顺着这个原生的表结构继续前进，引入了 sqlalchemy 对接多种数据库，将 Session 数据搬到了 MySQL。

![图片](/images/jueJin/0c9b51d43eef43f.png)

另一方面，由于我们启动的 Kernel，有一部分涉及 Spark on YARN，启动速度并不理想，因此早期我们增加了功能，若某个 path 已有正在启动的 Kernel，则等其启动完毕而不是再启动一个新的。这个功能原先使用内存中的 set 实现，现在也移植到了数据库上，通过 sqlalchemy 来访问。

### Kernel 持久化 & 访问

在 Remote Kernel 的场景下，一个 JupyterLab 需要知道它的某个 Kernel 具体在哪个 EG 上。在之前一个项目一个 JupyterLab 的状态下，我们通过负载均衡简单处理这个问题：即一个 Server 总是只访问同一个 Gateway。然而当 JupyterLab 成为无状态服务时，用户并非固定只访问一个 JupyterLab，也就不能保证总访问用户 Kernel 所在的 EG。

另一个情况是，当 JupyterLab 或 EG 重启时，其上的 Kernel 都会关闭。当我们升级相关服务时，总是需要通知用户准备重启 Kernel。因此，为了实现升级对用户无感，我们在 EG 这层开发了持久化 Kernel 的特性。

Kernel Gateway 在启动 Kernel 时，记录了关于 Kernel 的一些元信息，包括启动参数、连接 Kernel 使用的 IP/Port 等。有了这些信息，当一个 Kernel Gateway 重启且 Remote Kernel 不关闭，就有办法重新连接上。原本这些信息默认在内存 dict 中维护，开源仓库中有一套存储在本地文件的方案；基于这套方案，我们扩展了自研的存储到 MySQL 的方案。

在多实例的场景下，每一个 EG 实例依然会接管的各自的一部分 Kernel，并记录每个 Kernel 由谁接管（探活、Cull Idle、连接使用等）。在其关闭前，需要清除接管信息，以便下次启动或其他实例启动时捞起。

为了减少 client(正常是 JupyterLab) 任意访问 EG 的情况，一方面我们沿用了负载均衡的策略，另一方面 JupyterLab 在请求 Kernel 相关操作前，会先请求 EG 一次，由 EG 决定 JupyterLab 具体请求哪一个 EG IP/Port。

![图片](/images/jueJin/a649c79fc23d468.png)

当 EG 服务本身重启或者升级时，会在进程退出之前去清除接管信息。当页面继续访问时，JupyterLab 服务将会随机分发相应请求，由其它的 EG 服务继续接管。

### 收益

架构升级简化后，整套 Notebook 服务的稳定性获得了极大的提升。由于实现了用户无感知的升级，不仅提升了用户的使用体验，运维的成本也同时降低了。

部署的成本也极大地降低，包括算力、人力的节省。由于剥离了内部依赖，我们得以将这套架构部署在各种公有云、私有化场景。

五、调度方案
======

在前面，我们重点关注了怎么将 Jupyter 这套应用嵌入到 DataLeap 数据研发中。这只覆盖了我们 Notebook 任务的页面调试功能。实际上，同时作为一个调度系统，我们还需要关心怎么调度一个 Notebook 任务。

首先，是和所有其他任务类型相同的部分：当 Notebook 任务所配置的上游依赖任务全部运行完毕，开始拉起本次 Notebook 任务的运行。我们会根据任务的版本创建一个任务的快照，我们称之为任务实例，并将其提交到我们的执行器中。

对于 Notebook 任务，在实例运行前，我们会根据 Notebook 任务对应的版本，从 OSS 拷贝一份 Notebook 代码文件，用于执行。在具体的执行流程中，我们使用了 Jupyter 生态中的 [nbconvert](https://link.juejin.cn?target=https%3A%2F%2Fnbconvert.readthedocs.io%2Fen%2Flatest%2F "https://nbconvert.readthedocs.io/en/latest/") 来实现在没有 Jupyter 应用的前提下在后台运行这份 Notebook 文件，并将运行后得到的结果 Notebook 文件传回 OSS。nbconvert 的工作原理比较简单，且复用了 Jupyter 底层的代码，具体如下：

1.  根据指定的 Kernel Manager 或 Notebook 文件里的 Kernel 类型创建对应的 [Kernel Manager](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjupyter%2Fjupyter_client%2Fblob%2Fmain%2Fjupyter_client%2Fmanager.py "https://github.com/jupyter/jupyter_client/blob/main/jupyter_client/manager.py")；

2.  Kernel Manger 创建 Kernel Client，并启动一个 Kernel；

3.  遍历 Notebook 文件里的 Cell，调用 Kernel Client 执行 Cell 里的代码；

4.  获取输出结果，按照 nbformat 指定的 schema 填入 NotebookNode，并保存。

下图是调度执行 Notebook 的 Kernel 运行流程和通过调试走 EG 的 Remote Kernel 运行流程对比。可以看出，它们的链路并没有本质上的区别，只不过是在调度执行时，不需要交互式的 Kernel 通信，以及 EG 的这些 Kernel Launcher 使用了 embed\_kernel 在同进程内启动 Kernel 而已。走到最底层，它们都是使用了 ipykernel 的（其他语言 kernel 同理）。

![图片](/images/jueJin/1ab0ff3760da454.png)

六、未来工作
======

Notebook 任务已成为字节跳动内部使用较为高频的任务类型。在火山引擎，我们也可以购买 DataLeap，即一站式大数据研发治理套件，开通交互式分析的版本，使用到 DataLeap 的 Notebook 任务。

有的时候，我们发现，我们有比 Jupyter 社区快半步的地方：比如基于 asyncio 异步优化的 EG；比如给 Notebook 增加 Auth 能力。但社区的发展也很快：比如社区将 Jupyter 后端相关的代码实现，统一收敛到了`jupyter_server`；比如 EG 作者提出的 Kernel Provider 方案，令`jupyter_server`可以直接支持 Remote Kernel。

因此我们并未就此止步。目前，这套 Notebook 服务和 DataLeap 数据研发的其他前后端服务，仍存在着割裂。未来，我们希望精简架构，实现彻底的整合，使 Notebook 并非以嵌入的形式融合在 DataLeap 的产品中，而是使其原生就在 DataLeap 数据研发中被支持，带来更好的性能，同时又保留所有 Jupyter 生态带来的强大功能。另一方面，随着 DataLeap 数据研发平台对流式数据开发的支持，我们也希望借助 Notebook 实现用户对流式数据的探索、调试、可视化等功能的需求。相信不久的将来，Notebook 能够实现流批一体化，来服务更加广泛的用户群体。

七、关于我们
======

火山引擎大数据研发治理套件 DataLeap。

一站式数据中台套件，帮助用户快速完成数据集成、开发、运维、治理、资产、安全等全套数据中台建设，帮助数据团队有效的降低工作成本和数据维护成本、挖掘数据价值、为企业决策提供数据支撑。[点击](https://link.juejin.cn?target=https%3A%2F%2Fwww.volcengine.com%2Fproduct%2Fdataleap%2F%3Futm_source%3Dwechat_dp%26utm_medium%3Darticle%26utm_term%3Dwx_readmore%26utm_campaign%3D20221026%26utm_content%3Ddataleap "https://www.volcengine.com/product/dataleap/?utm_source=wechat_dp&utm_medium=article&utm_term=wx_readmore&utm_campaign=20221026&utm_content=dataleap")立即体验产品！

**欢迎加入字节跳动数据平台官方群，进行数据技术交流、获取更多内容干货**

![图片](/images/jueJin/71ca05cd7f7e4ac.png)