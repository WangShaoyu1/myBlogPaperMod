---
author: ""
title: "掘力计划第21期 - 如何构建轻量级的 LLM Agent"
date: 2023-08-15
description: "摘要 随着大语言模型（LLM）的兴起，LLM Agent 成为构建 LLM 应用的关键方向。本文整理自 Michael Yuan 博士的技术分享，概述了使用轻量级运行时如 WebAssembly 构建"
tags: ["人工智能","LLM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:7,views:1995,"
---
摘要
--

随着大语言模型（LLM）的兴起，LLM Agent 成为构建 LLM 应用的关键方向。本文整理自 Michael Yuan 博士的技术分享，概述了使用轻量级运行时如 WebAssembly 构建 LLM Agent 的优势，分析 Python 在构建 LLM Agent 时的局限性，并推荐采用类似 Rust 这样的系统编程语言构建 LLM Agent。

引言
--

近年来，大语言模型（LLM）如 GPT-3 和 ChatGPT 引发了 AI 的革命。它们拥有强大的文本理解和生成能力，支持各种自然语言处理任务。但是 LLM 本身只是一个被动的模型，要将其能力发挥出来，还需要构建 LLM Agent。LLM Agent 负责与 LLM 进行交互，从用户那里获取输入，调用 LLM 进行推理，并将结果返回给用户。

目前主流的 LLM Agent 使用 Python 构建，并部署在云原生基础设施如 Kubernetes 上。但是这种方式存在一定局限性。主题为《大模型的崛起：解析大语言模型的训练和应用》的掘力计划第21期活动，我们邀请到 Michael Yuan 博士来探讨构建轻量级 LLM Agent 的新思路。

![](/images/jueJin/cca03e047fca447.png)

Michael Yuan 博士是 CNCF WasmEdge 项目的维护者，也是 Second State 的创始人。 他撰写过5本软件工程书籍，由 Addison-Wesley、Prentice-Hall 和 O'Reilly 出版。 Michael 是一位长期的开源开发者和贡献者。 他之前曾在许多行业会议上发表过演讲，包括 OpenSourceSummit、The Linux Foundation Member Summit 和 KubeCon。

LLM Agent 的作用
-------------

LLM 可以比喻为一个没有记忆力、感觉器官和行动能力的大脑。LLM Agent 就是为 LLM 提供这些关键功能的组件。具体来说，LLM Agent 包含以下功能：

![](/images/jueJin/2e74aaa80cd740a.png)

*   **记忆**：负责保存用户交互的历史上下文（short-term memory），以及项目或领域知识（long-term memory）。这样 LLM 才能持续地进行会话或完成特定任务。
    
*   **感知**：负责从外部世界获取输入（眼睛、耳朵），例如监听 IM 消息或 GitHub 事件。
    
*   **行动**：负责将 LLM 的输出转换成外部世界的行动（手），例如将结果返回给用户或调用 API。
    
*   **规划**：负责将不明确的任务分解为 LLM 可以处理的具体步骤。
    

可以看到，LLM Agent 负责处理 LLM 与外部世界的交互，是 LLM 应用的关键组件。构建高效的 LLM Agent 十分重要。

Python 的局限性
-----------

![](/images/jueJin/85a62b3c9b5f4cd.png)

当前，编写 LLM Agent 最常用的语言是 Python。但是 Python 存在一些局限性：

*   Python 是一个解释型语言，性能较差，尤其是在网络 IO 密集型任务中表现不佳。
    
*   Python 应用往往依赖庞大的依赖库，制作成 Docker 镜像体积过大。
    
*   Python 不易进行原生编译，难以实现真正的跨平台。
    

此外，Python 生态中 LLM Agent 的主流选择是 LangChain。但是 LangChain过于注重研究，提供了太多稀有用例的功能，使用起来非常复杂。

可以看到，Python 不太适合构建轻量级、高效的 LLM Agent。

轻量级运行时的优势
---------

相比之下，一些轻量级运行时具有以下优势：

*   使用系统编程语言如 Rust、Go 构建，性能更好。
    
*   可以进行原生编译，生成更轻量、更可移植的二进制文件。
    
*   更适合网络 IO 密集型、异步处理的任务。
    

具体来说，WebAssembly 就是一个非常有前途的轻量级运行时。使用 Rust 编译到 WebAssembly 中，可以实现比 Python 小几个数量级的二进制体积。此外，WebAssembly 还支持访问底层硬件能力，实现近似原生级别的性能。

因此，使用轻量级运行时构建 LLM Agent，可以避免 Python 的性能和体积问题，生成更高效的 LLM 应用。

构建轻量级 LLM Agent 的新方向
--------------------

![](/images/jueJin/703cfd8e4fed4a9.png)

基于上述分析，可以看到构建轻量级 LLM Agent 是提升 LLM 应用性能的重要方向。具体来说，有以下解决方案：

*   使用系统编程语言如 Rust、Go 代替 Python。可以大幅提升性能并减小体积。
*   采用轻量级运行时如 WebAssembly，进一步优化性能和可移植性。
*   对于 Agent 中非性能敏感的组件，可以采用 Serverless 架构，例如 [flows.network](https://link.juejin.cn?target=https%3A%2F%2Fflows.network "https://flows.network") 来简化部署和管理。
*   利用 Vec 之类的向量数据库实现长期记忆，减少单个请求的 overhead。
*   设计简单、模块化的 Agent 架构，避免过于复杂的功能。注重工程化而不是研究。

通过这些方法，可以构建出比现有 Python Agent 更轻量级、易部署和高性能的 LLM Agent。这有助于降低部署 LLM 应用的门槛，使更多组织能够受益于 LLM 带来的价值。

总结
--

LLM Agent 是构建 LLM 应用的关键组件。过重的 Python Agent 在许多场景下表现不佳，构建轻量级 LLM Agent 是提升性能的重要方向。采用编译语言、轻量级运行时等技术可以实现此目的。我们期待看到更多高效的 LLM Agent 架构和最佳实践出现，推动 LLM 的广泛应用。

关于掘力计划
------

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。