---
author: ""
title: "掘力计划第23期 - MetaGPT：让每个人拥有专属智能体"
date: 2023-09-15
description: "活动介绍 9月9日，掘力计划第23期线上分享活动以“AIGC的应用和创新”为主题召开。本次活动的分享主题为《MetaGPT：让每个人拥有专属智能体》，由深度赋智 NLP & AIGC 方向算法负责人洪"
tags: ["人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:0,views:526,"
---
![](/images/jueJin/30a71caa0e69419.png)

活动介绍
----

9月9日，掘力计划第23期线上分享活动以“AIGC的应用和创新”为主题召开。本次活动的分享主题为《MetaGPT：让每个人拥有专属智能体》，由深度赋智 NLP & AIGC 方向算法负责人洪思睿主讲。

洪思睿曾任智能控制上市企业 NLP 团队负责人，负责千万级行业知识图谱及多项自然语言处理技术的应用落地。在深度赋智，她负责法律、物流、美妆、电商等多个领域的知识问答、搜索系统及多模态应用等行业落地工作。他还开源了多智能体框架MetaGPT，并在 NeurIPS AutoDL 顶级竞赛中获得世界冠军，相关工作及论文发表于顶级学术期刊《IEEE TPAMI》。

直播回放地址：[juejin.cn/live/jpower…](https://juejin.cn/live/jpowermeetup23 "https://juejin.cn/live/jpowermeetup23")

大语言模型发展历程
---------

![](/images/jueJin/4ae2bbbbd82a40c.png)

洪思睿首先回顾了大语言模型技术的发展历程，从早期的 CBOW 自监督学习方法，到 BERT 的双向编码器以及 GPT-3 的巨大规模预训练，再到最近的 GPT-4，大语言模型取得了巨大的技术突破。

### 早期技术：SSL、Transformer 和 BERT

自2013年起，自然语言理解领域出现了一些新的技术趋势。早在2013年，CBOW 模型就使用了自监督学习的方法，将词嵌入到稠密的向量空间中，奠定了后来语言模型技术的基础。2017年，Transformer 模型则通过引入注意力机制，改善了 CNN 在长序列建模方面的困难。随后在2018年，BERT 的出现则证明了规模化预训练对自然语言理解的巨大提升，只需要在特定下游任务进行微调就可以取得非常强的效果。具体来说，BERT使用了多层 Transformer 编码器进行预训练，通过 masked language model 和 next sentence prediction 等任务获得了语义理解能力，然后在下游任务中进行微调从而适应特定领域。

### GPT-3的预训练范式

![](/images/jueJin/d3f10f51dfdc46e.png)

相比 BERT 采用预训练与微调相结合的方法，OpenAI 的 GPT 系列模型更加强调巨大规模的单向预训练。以 GPT-3 为例，它拥有高达 1750 亿参数，但没有进行微调就直接进行预训练并应用。GPT-3 证明了更大规模的模型即使不经微调也可以取得较强的泛化性能。随着模型规模的扩大，GPT-3 展现出了更强的 Few-Shot 学习能力。

### Instruction Tuning

在 GPT-3 之后，研究者提出了指令微调（Instruction Tuning）的训练方法，使用自然语言指令引导模型学习，可以进一步提升大规模预训练语言的数据利用能力，增强泛化能力。例如，基于该方法调优后的模型，即使在未见过的数据集上也可以取得更高的准确率。这为模型带来了更好的迁移学习能力。

### InstructGPT

Instruction Tuning 的idea也被 OpenAI 借鉴到了 InstructGPT 模型中。该模型不仅使用了指令微调，还利用了基于人类反馈的强化学习进行来降低模型输出的毒性。实验证明，使用人类反馈进行调优后，模型的输出质量可以大幅提升，信息量更大，偏向性和有毒性内容更少，更符合人类期待。

GPT-4时代的到来
----------

![](/images/jueJin/23e550c6a19c400.png)

今年3月，OpenAI 发布了 GPT-4 模型，其规模达到了 GPT-3 的 10 倍以上，参数量高达 18000 亿。为实现这样大规模模型的高效推理，OpenAI 采用了混合专家（Mixture of Experts）技术。具体来说，GPT-4 包含了 16 个规模约为 1110 亿参数的专家模型，每次推理会调用 2 个专家，并在专家之间共享部分权重。在训练数据方面，GPT-4 使用了约 130 万亿个词元进行预训练，是目前最大规模的语言模型。为实现高效训练，OpenAI 采用了多达 8k 的上下文序列长度，以及可变序列批处理和流水线等技术。

GPT-4 的到来预示着语言模型技术已经进入一个新的阶段，各大企业和机构也纷纷推出了自己的预训练语言模型。在模型评测领域，MMLU 基准测试已经成为衡量不同语言模型能力的标准测试集。各模型在 MMLU 基准测试中的排名也成为大家关注的焦点。

MetaGPT：构建多智能体框架
----------------

![](/images/jueJin/97c99ec5d3cc4dc.png)

在模型技术日益成熟的背景下，模型的落地应用也成为一个重要方向。洪思睿介绍了他们多智能体框架 MetaGPT。该框架可以通过简单的自然语言描述完成完整的软件开发过程中的文档输出和代码生成工作。

MetaGPT 通过定义不同的角色，如产品经理、架构师、工程师等，让每个角色负责软件开发过程中的不同阶段，实现流水线式的协同工作。具体来说，产品经理会根据需求输出产品文档，架构师负责设计架构图，最后工程师根据上游输出进行代码实现。

实验证明，MetaGPT 生成的代码质量明显优于其他基于智能体框架的代码生成效果。因为上游角色的输出为下游工程师提供了完整的上下文信息，将原始的需求/任务进行了更细化和结构化的拆解，减少了歧义，提升了最终代码的可靠性。在多个数据集上的评测也证明了 MetaGPT 生成代码的优异性能。

智能体技术的应用前景
----------

![](/images/jueJin/c546abda53b64c3.png)

洪思睿认为，基于大语言模型训练的智能体将会成为未来社会的重要组成部分。未来的人机交互范式也会从嵌入式模式，发展到辅助模式，再到代理模式，最终达到人机深度协作的社会化模式。在这个模式下，人类和智能体既可以自主提出需求，也可以相互提供资源来完成任务。

此外，未来互联网的门户也将从 App 变成智能体。用户只需要向单个或多个智能体提出需求，由智能体负责完成整个工作流程，包括调用不同的软件程序、设定参数等。这将极大提升人机协同的效率，更进一步带来生活和工作方式的变革。

总结
--

本次分享活动洪思睿详细介绍了大语言模型技术的发展历程，以及最新的GPT-4等前沿技术。她从他们开源的工作MetaGPT展开，展示了如何构建多智能体协作框架，并展望了智能体技术在简化人机交互等方面的应用前景。这次活动内容丰富，对于理解当前AI技术发展具有重要参考价值。

**掘力计划**
--------

掘力计划由稀土掘金技术社区发起，致力于打造一个高品质的技术分享和交流的系列品牌。聚集国内外顶尖的技术专家、开发者和实践者，通过线下沙龙、闭门会、公开课等多种形式分享最前沿的技术动态。