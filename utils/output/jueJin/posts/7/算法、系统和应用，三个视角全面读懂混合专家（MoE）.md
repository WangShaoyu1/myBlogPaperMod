---
author: "机器之心"
title: "算法、系统和应用，三个视角全面读懂混合专家（MoE）"
date: 2024-07-26
description: "最近，各家科技公司提出的新一代大模型不约而同地正在使用混合专家（Mixture of Experts：MoE）方法。"
tags: ["LLM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读27分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:1,views:380,"
---
机器之心报道

**编辑：Panda W**

> LLM 很强，而为了实现 LLM 的可持续扩展，有必要找到并实现能提升其效率的方法，混合专家（MoE）就是这类方法的一大重要成员。

最近，各家科技公司提出的新一代大模型不约而同地正在使用混合专家（Mixture of Experts：MoE）方法。

混合专家这一概念最早诞生于 1991 年的论文《Adaptive mixtures of local experts》，三十多年来已经得到了广泛的探索和发展。近年来，随着稀疏门控 MoE 的出现和发展，尤其是与基于 Transformer 的大型语言模型相结合，这种已有三十多年历史的技术焕发出了新的生机。

MoE 框架基于一个简单却又强大思想：模型的不同部分（称为专家）专注于不同的任务或数据的不同方面。

使用这一范式时，对于一个输入，仅有与之相关的专家（Expert）才会参与处理，这样一来便能控制计算成本，同时仍能受益于大量专业知识。因此，MoE 可在不大幅提升计算需求的前提下提升大语言模型的能力。

如图 1 所示，MoE 相关研究增长强劲，尤其是在 2024 年 Mixtral-8x7B 以及 Grok-1、DBRX、Arctic、DeepSeek-V2 等各种产业级 LLM 出现之后。

![图片](/images/jueJin/88fa52bd932b4a6.png)

这张图来自香港科技大学（广州）的一个研究团队近日发布的一篇 MoE 综述报告，其中清晰且全面地总结了 MoE 相关研究，并提出了一种全新的分类法，将这些研究归类到了算法、系统和应用三大类。

![图片](/images/jueJin/c28143908d3a470.png)

*   论文标题：A Survey on Mixture of Experts
    
*   论文地址：[arxiv.org/pdf/2407.06…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2407.06204 "https://arxiv.org/pdf/2407.06204")
    

机器之心整理了这篇综述报告的内容主干，以帮助读者了解当前 MoE 的发展概况，更多详情请阅读原论文。此外，我们也在文末整理了一些与 MoE 相关的报道。

**混合专家的背景知识**

在基于 Transformer 的大型语言模型（LLM）中，每个混合专家（MoE）层的组成形式通常是 𝑁 个「专家网络」{𝑓\_1, ... , 𝑓\_𝑁} 搭配一个「门控网络」G。

这个门控网络的形式通常是一个使用 softmax 激活函数的线性网络，其作用是将输入引导至合适的专家网络。MoE 层的放置位置是在 Transformer 模块内，作用是选取前向网络（FFN），通常位于自注意力（SA）子层之后。这种放置方式很关键，因为随着模型增大，FFN 的计算需求也会增加。举个例子，在参数量达到 5400 亿的 PaLM 模型中，90% 的参数都位于其 FFN 层中。

用数学形式描述的话：每个专家网络 𝑓\_𝑖 （通常是一个线性 - ReLU - 线性网络）都由 W\_𝑖 进行参数化，其接收同一输入 x 并生成输出 𝑓\_𝑖 (x; W\_𝑖)。同时，参数为 Θ 的门控网络 G（通常由一个线性 - ReLU - 线性 - softmax 网络构成）得到输出 G (x; Θ)。再根据门控函数的设计方式，可以将 MoE 层大致分为以下两类。

![图片](/images/jueJin/f370cf8331e440c.png)

**密集 MoE**

密集混合专家层是在每次迭代过程中激活所有专家网络 {𝑓\_1, ... , 𝑓\_𝑁}。早期的 MoE 研究普遍采用了这一策略。近段时间也有一些研究采用了密集 MoE，比如 EvoMoE、MoLE 、LoRAMoE 和 DS-MoE。图 2a 给出了密集 MoE 层的结构。因此，密集 MoE 层的输出可以表示成：

![图片](/images/jueJin/ed30d361a24e497.png)

其中，𝑔(x; Θ) 是 softmax 运算之前的门控值。

**稀疏 MoE**

尽管密集混合专家的预测准确度通常更高，但其计算负载也非常高。

为了解决这个问题，Shazeer et al. 的论文《Outrageously large neural networks: The sparsely-gated mixture-of-experts layer》引入了稀疏门控 MoE 层，其能在每次前向通过时仅激活选定的专家子集。该策略实现稀疏性的方式是计算 top-k 个专家的输出的加权和，而非将所有专家的输出聚合到一起。图 2b 展示了这种稀疏 MoE 层的结构。

根据上述论文提出的框架，可对 2.2 式进行修改以反映稀疏门控机制：

![图片](/images/jueJin/e21eeb69102d4ec.png)

这里解释一下：TopK (・, 𝑘) 函数是仅保留向量原始值的前 k 项，同时将其它项设置为 −∞。之后是 softmax 运算，所有 −∞ 项都会变成近似于零。超参数 k 要根据具体应用选取，常见选项是 𝑘 = 1 或 𝑘 = 2。加入噪声项 R\_noise 是训练稀疏门控 MoE 层的一种常用策略，可促进专家之间的探索并提升 MoE 训练的稳定性。

尽管稀疏门控 G (x; Θ) 可在不增加相应计算成本的前提下显著扩展模型的参数空间，但也会导致负载平衡问题。负载平衡问题是指各专家的负载分布不均 —— 某些专家被频繁使用，而另一些专家则很少被使用甚至完全不上场。

为了解决这个问题，每个 MoE 层都要集成一个辅助损失函数，其作用是敦促每批次的 token 被均匀分配给各个专家。从数学形式描述来看，首先定义一个包含 T 个 token 的查询批次 B = {x\_1 , x\_2, ... , x\_𝑇 } 以及 N 个专家。则对于其的辅助负载平衡损失定义为：

![图片](/images/jueJin/572314205221478.png)

其中 D\_i 是分配给专家 i 的 token 比例，P\_i 是分配给专家 i 的门控概率比例。为了确保该批次在 N 个专家之间均匀分布，应当最小化负载平衡损失函数 L\_{load-balancing}。当每个专家都被分配了同等数量的 token D\_𝑖 = 1/𝑁 和同等的门控概率 P\_𝑖 = 1/𝑁 时，即达到最优条件：

![图片](/images/jueJin/2de0a67a76af45b.png)

此时各专家的负载达到平衡。

在后文中，除非另有明确说明，则「MoE」这一术语单指「稀疏 MoE」。

**混合专家的分类**

为了帮助研究者在大量采用 MoE 的 LLM 研究中找到目标，该团队开发了一套分类方法，根据三个方面对这些模型进行了分类：算法设计、系统设计和应用。

图 3 展示了这种分类法以及一些代表性研究成果。

![图片](/images/jueJin/9bc660f6815141e.png)

下面将全面深入地介绍各类别的情况。

**混合专家的算法设计**

**门控函数**

门控函数（也被称为路由函数或路由器）是所有 MoE 架构的基础组件，其作用是协调使用专家计算以及组合各专家的输出。

根据对每个输入的处理方法，该门控可分为三种类型：稀疏式、密集式和 soft 式。其中稀疏式门控机制是激活部分专家，而密集式是激活所有专家，soft 式则包括完全可微方法，包括输入 token 融合和专家融合。图 4 展示了 MoE 模型中使用的各种门控函数。

![图片](/images/jueJin/ca18b1cd24b0492.png)

*   稀疏式

稀疏门控函数在处理各个输入 token 时会激活被选中的部分专家，这可被视为一种形式的条件计算。

门控函数可以实现多种形式的门控决策，比如二元决策、稀疏或连续决策、随机或确定性决策；其已经得到了深入的研究，可使用各种形式的强化学习和反向传播来训练。

Shazeer et al. 的研究《Outrageously large neural networks: The sparsely-gated mixture-of-experts layer》开创性地提出了一种使用辅助负载平衡损失的可微分启发式方法，其中可根据选取概率对专家计算的输出进行加权。这为门控过程引入了可微性，由此可通过梯度来引导门控函数的优化。

后来，这一范式便成了 MoE 研究领域的主导范式。由于这种方法会针对每个输入 token 选择专家，因此可将其看作是 token 选择式门控函数。

以下为这一小节的要点，详见原论文：

*   token 选择式门控
    
*   用于 token 选择式门控的辅助损失
    
*   token 选择式门控的专家容量
    
*   token 选择式门控的其它进展
    
*   不可训练的 token 选择式门控
    
*   专家选择式门控
    

![图片](/images/jueJin/28ed2993896b4d3.png)

*   密集式

密集 MoE 是指处理每个输入时都激活所有专家。

虽然稀疏 MoE 有效率方面的优势，但密集 MoE 方向依然在不断迎来创新。尤其值得一提的是，密集激活在 LoRA-MoE 微调方面表现很好，并且 LoRA 专家的计算开销相对较低。这种方法能够有效灵活地集成多个 LoRA 以完成各种下游任务。这能保留原始预训练模型的生成能力，同时保留各个 LoRA 针对各个任务的独有特性。

*   soft 式

对稀疏 MoE 来说，一大基本离散优化难题是如何决定为每个 token 分配哪些合适的专家。为了确保专家能平衡地参与并尽可能减少无分配 token，这通常必须启发式的辅助损失。在涉及分布外数据的场景（比如推理批次小、有全新输入或迁移学习）中，这个问题尤其显著。

类似于密集 MoE，soft MoE 方法在处理每个输入时也会使用所有专家，从而维持完全可微性，进而避免离散专家选择方法的固有问题。soft MoE 与密集 MoE 的不同在于前者会通过对输入 token 或专家进行门控加权的融合来缓解计算需求。

**专家**

这一节会介绍 MoE 框架内专家网络的架构，并会讨论协调这些专家的激活的门控函数。

*   网络类型

自从 MoE 被整合到 Transformer 架构中以来，其通常会替代这些模型中的前向网络（FFN）模块。通常来说，MoE 层中的每个专家都会复制其替换的 FFN 的架构。

这种将 FFN 用作专家的范式到现在依然是主流，但人们也对此做了不少改进。

*   超参数

稀疏 MoE 模型的规模由几个关键超参数控制，包括：

*   每个 MoE 层的专家数量
    
*   每个专家的大小
    
*   MoE 层在整个模型中的放置频率
    

这些超参数的选择至关重要，因为它会深刻影响模型在各种任务中的性能和计算效率。因此，要根据特定的应用要求和计算基础设施来选择最佳超参数。表 2 给出了一些使用 MoE 的模型的配置情况。

![图片](/images/jueJin/f8fa8c984de64e7.png)

另外，表 3 列举了一些近期的开源模型的参数数量和基准性能。

![图片](/images/jueJin/08e331cf4fa3424.png)

*   激活函数

基于密集 Transformer 架构构建的稀疏 MoE 模型采用了与 BERT、T5、GPT 和 LLAMA 等领先的密集 LLM 类似的激活函数。激活函数已经从 ReLU 发展出了 GeLU、GeGLU、SwiGLU 等更先进的选择。

这一趋势也扩展到了 MoE 模型的其它组件，它们经常整合均方根层归一化（RMSNorm）、分组查询注意力（GQA）和旋转位置嵌入（RoPE）等技术。

*   共享专家

DeepSpeed-MoE 创新性地引入了残差 MoE（Residual-MoE）架构，其中每个 token 都由一个固定专家外加一个门控选择的专家进行处理，实现了每一层都有两个专家参与处理，同时也不会让通信成本超过 top-1 门控方法。这种方法是把门控选择的 MoE 专家当作是固定密集 FFN 的纠错辅助。

NLLB 中使用的条件式 MoE 路由（CMR/Conditional MoE Routing）也采用了类似的方法，将密集 FFN 和 MoE 层的输出组合起来使用。

将固定 FFN 和稀疏 MoE 整合起来的范式通常被称为共享专家，如图 5b 所示。

![图片](/images/jueJin/8ff8108ee2f2484.png)

近期有 DeepSeekMoE、OpenMoE、Qwen1.5-MoE 和 MoCLE 等模型采用这一范式，表明其正在成为一种主流配置。不过 DeepSeekMoE 和 Qwen1.5-MoE 采用了多个共享专家，而不是单个。

**混合参数高效型专家**

参数高效型微调（PEFT）是一种提升微调效率的方法。简单来说，PEFT 就是在微调时仅更新基础模型的一小部分参数。

PEFT 很成功，但由于其可训练的参数有限以及可能存在的灾难性遗忘问题，该方法难以用于需要泛化到多个任务的情况。

为了缓解这些局限，混合参数高效型专家（MoPE）诞生了，其将 MoE 框架与 PEFT 整合到了一起。MoPE 集成了 MoE 的门控机制与多专家架构，同时每个专家都使用了 PEFT 技术进行构建。这种巧妙的组合能极大提升 PEFT 在多任务场景中的性能。此外，由于使用了 PEFT 来构建专家，因此 MoPE 使用的参数也更少，资源效率比传统 MoE 模型高得多。

MoPE 融合了 MoE 的多任务特性与 PEFT 的资源效率，是一个极具前景的研究方向。图 6 根据在 Transformer 模型架构中的位置对 MoPE 进行了分类。至于 MoPE 方面更详细的研究成果介绍，请参看原论文。

![图片](/images/jueJin/224e0a38548e414.png)

**训练和推理方案**

混合专家在进步发展，相关的训练和推理方案也在进步发展。

初始的训练和推理方案需要从头开始训练 MoE 模型，直接采用训练的模型配置来执行推理。

但现在，MoE 模型的训练和推理方面已经出现了许多新范式，包括组合密集模型和稀疏模型的优势实现取长补短。

![图片](/images/jueJin/d3f356f3d19c41b.png)

图 7 展示了与 MoE 相关的训练和推理方案，可以看到新出现的方案可分为三类：

*   密集到稀疏：从密集模型训练开始，逐步过渡到稀疏 MoE 配置；
    
*   稀疏到密集：涉及到将稀疏 MoE 模型降格为密集形式，这有利于将推理实现为硬件形式；
    
*   专家模型融合：将多个预训练密集专家模型整合成一个统一的 MoE 模型。
    

**MoE 的衍生技术**

混合专家（MoE）启发了许多不同的变体技术。举个例子，Xue et al. 的论文《Go wider instead of deeper》提出了模型宽度增大的 WideNet，其做法是将前向网络（FFN）替换成 MoE 层，同时维持 Transformer 层上的共享可训练参数，但归一化层除外。

另外还有 Tan et al. 提出的 SYT（稀疏通用 Transformer）、Antoniak et al. 提出的 MoT（混合 token）、Choi et al. 提出的 SMoP（稀疏混合提词）、Chen et al. 提出的 Lifelong-MoE、Raposo et al. 提出的 MoD（混合深度）等。

总结一下，MoE 衍生技术的发展揭示了一个趋势：MoE 的功能越来越多，越来越能适应不同的领域。

**混合专家的系统设计**

混合专家（MoE）虽然能增强大型语言模型的能力，但也带来了新的技术挑战，因为其具有稀疏且动态的计算负载。

GShard 引入了专家并行化（expert parallelism），可根据专家能力的负载平衡限制来调度切分后的局部 token，从而实现并行的门控和专家计算。该范式已经成为促进 MoE 模型高效扩展的基础策略。我们可以将该方法看作是增强版的数据并行化 ——MoE 层中的每个专家都被分配到一台不同设备，同时所有设备上都重复配备所有非专家层。

如图 8a 所示，专家并行化的工作流程是按顺序执行以下操作：门路由、输入编码、All-to-All 调度、专家计算、All-to-All 组合、输出解码。

![图片](/images/jueJin/28efc9196e6f43e.png)

一般来说，GEMM 的输入大小需要足够大，以便充分利用计算设备。因此，要使用输入编码将同一个专家的输入 token 聚合到连续的内存空间中，这由门路由中的「token - 专家映射」决定。之后，All-to-All 调度的作用是将输入 token 分发给各设备上对应的专家。之后是专家的本地化计算。计算完成后再通过 All-to-All 组合汇总，然后解码输出，根据门控索引恢复原始数据的布局。

此外，也有研究者探索专家并行化与其它已有并行策略（比如张量、管道化、序列并行化）的协同，以提升 MoE 模型在大规模分布式环境中的可扩展性和效率。

图 8 中给出了一些混合并行化示例，包括 (b) 数据 + 专家 + 张量并行化、(c) 数据 + 专家 + 管道并行化、(d) 专家 + 张量并行。

需要认识到，计算效率、通信负载、内存占用之间存在复杂的相互作用，分布式并行化策略的选择会对其产生影响，并且也会被不同的硬件配置影响。因此，在部署用于实际应用的策略时，必须细致地权衡考虑并针对具体场景进行调整。

之后，该团队分计算、通信和存储三大板块介绍了 MoE 模型开发所面临的系统设计难题以及解决这些难题的研究成果，详见原论文。表 4 给出了开源 MoE 框架的概况。

![图片](/images/jueJin/d32af124961145a.png)

**混合专家的应用**

在当前 Transformer 主导的大型语言模型（LLM）领域，混合专家（MoE）范式颇具吸引力，因为其能在不给训练和推理阶段引入过大计算需求的前提下大幅提升模型能力。这类技术能显著 LLM 在多种下游任务上的性能，甚至造就了一些超越人类水平的 AI 应用。

有传言说强大如斯的 GPT-4 可能也采用了某种 MoE 架构 —— 由 8 个 2200 亿参数的专家构成，在多样化的数据集和任务上完成了训练，并使用了一种 16 次迭代的推理过程。有关该传言的更多详情可参阅机器之心报道《[终极「揭秘」：GPT-4 模型架构、训练成本、数据集信息都被扒出来了](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650883517%26idx%3D2%26sn%3D4b795725b3341dc60b282a19e31692de%26chksm%3D84e481c3b39308d5758cc635fef1ffd6cf56e57e345e82ddce683db42fd2b6a741747c35abdb%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650883517&idx=2&sn=4b795725b3341dc60b282a19e31692de&chksm=84e481c3b39308d5758cc635fef1ffd6cf56e57e345e82ddce683db42fd2b6a741747c35abdb&scene=21#wechat_redirect")》。

所以，毫不奇怪 MoE 在自然语言处理、计算机视觉、推荐系统和多模态应用中遍地开花了。

这些应用本质上就需要使用条件计算来大幅提升模型的参数量，以此增强模型在固定计算成本下的性能，或通过门控机制实现动态专家选择来实现高效多任务学习。

该团队也介绍了这些不同领域的代表性 MoE 应用，可帮助读者理解如何将 MoE 用于具体任务。详见原论文。

**挑战与机遇**

混合专家，功能强大，降低成本，提升性能。前景虽好，仍有挑战。

这一节中，该团队梳理了 MoE 相关的关键性挑战，并指出了有希望获得重要成果的未来研究方向。下面简要列出了这些挑战和研究方向，更多详情请查看原论文。

*   训练稳定性和负载平衡
    
*   可扩展性和通信开销
    
*   专家的专业化和协作
    
*   稀疏激活和计算效率
    
*   泛化和稳健性
    
*   可解释性和透明性
    
*   最优的专家架构
    
*   与现有框架整合
    

**扩展阅读：MoE 相关报道**

**基础：**

*   [30 年历史回顾，Jeff Dean：我们整理了一份「稀疏专家模型」研究综述](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650858005%26idx%3D1%26sn%3D167bc30ab9335962ac6586c66a79bb0f%26chksm%3D84e5266bb392af7d84e0c56ce4146a098ef603be05a5fd0b2ea8ab6e6829a4bae9b454489508%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650858005&idx=1&sn=167bc30ab9335962ac6586c66a79bb0f&chksm=84e5266bb392af7d84e0c56ce4146a098ef603be05a5fd0b2ea8ab6e6829a4bae9b454489508&scene=21#wechat_redirect")
    
*   [为什么基于 MoE 的大模型更值得关注？](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650900669%26idx%3D5%26sn%3D573c5435e483b05b0f2ba40f5a10dd0e%26chksm%3D84e44cc3b393c5d5e8c4b54ea4159107b49717f39c59978c96b635b7c3c484d00b8d68c830bd%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650900669&idx=5&sn=573c5435e483b05b0f2ba40f5a10dd0e&chksm=84e44cc3b393c5d5e8c4b54ea4159107b49717f39c59978c96b635b7c3c484d00b8d68c830bd&scene=21#wechat_redirect")
    
*   [被 OpenAI、Mistral AI 带火的 MoE 是怎么回事？一文贯通专家混合架构部署](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650904974%26idx%3D3%26sn%3D669f3b0013c2e335cef576b55563ee84%26chksm%3D84e45df0b393d4e600023cc414837b77acd873d35defb35474d3b398e4ac97f00a898934e18b%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650904974&idx=3&sn=669f3b0013c2e335cef576b55563ee84&chksm=84e45df0b393d4e600023cc414837b77acd873d35defb35474d3b398e4ac97f00a898934e18b&scene=21#wechat_redirect")
    
*   [吸引机器学习圈眼球的 MoE，会成为 NLP 与 CV 的未来吗？](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650850109%26idx%3D4%26sn%3D2589b1d2213883147def562569bff9db%26chksm%3D84e50743b3928e550062de9aea48bd475c1c65610db455775c77967be8e00f0547f9526ac0f5%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650850109&idx=4&sn=2589b1d2213883147def562569bff9db&chksm=84e50743b3928e550062de9aea48bd475c1c65610db455775c77967be8e00f0547f9526ac0f5&scene=21#wechat_redirect")
    
*   [手把手教你，从零开始实现一个稀疏混合专家架构语言模型（MoE）](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650907458%26idx%3D1%26sn%3D14d6a69dda179cece342d0d798bacec7%26chksm%3D84e4673cb393ee2a32c68d49934ee1474f63f0b3eeb3b8926f6437c278b4fc3ac79f085cc997%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650907458&idx=1&sn=14d6a69dda179cece342d0d798bacec7&chksm=84e4673cb393ee2a32c68d49934ee1474f63f0b3eeb3b8926f6437c278b4fc3ac79f085cc997&scene=21#wechat_redirect")
    

**前沿：**

*   [单一作者论文，谷歌提出百万专家 Mixture，超越密集前馈、稀疏 MoE](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650925512%26idx%3D3%26sn%3D7a737e23afe4f1f14659fc07baa8c2b1%26chksm%3D84e42db6b393a4a0d3a1223f57dad525f450cad58386609337cded89f8215e2498ddf7113f6d%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650925512&idx=3&sn=7a737e23afe4f1f14659fc07baa8c2b1&chksm=84e42db6b393a4a0d3a1223f57dad525f450cad58386609337cded89f8215e2498ddf7113f6d&scene=21#wechat_redirect")
    
*   [微软让 MoE 长出多个头，大幅提升专家激活率](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650917888%26idx%3D4%26sn%3D90c657686a0d4b7363686ec9588d04dd%26chksm%3D84e4087eb393816826bd8a9f44fcad32d75822eaa731021c1893634ed387d31d7cedd1683e89%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650917888&idx=4&sn=90c657686a0d4b7363686ec9588d04dd&chksm=84e4087eb393816826bd8a9f44fcad32d75822eaa731021c1893634ed387d31d7cedd1683e89&scene=21#wechat_redirect")
    
*   [将多模态大模型稀疏化，3B 模型 MoE-LLaVA 媲美 LLaVA-1.5-7B](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650906368%26idx%3D3%26sn%3Dde29015cd3874bf021926bafa358f5c5%26chksm%3D84e45b7eb393d2689b3fa22b063234a9550ae9ceffc9cf1771621390f24039d2f97928e8da0d%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650906368&idx=3&sn=de29015cd3874bf021926bafa358f5c5&chksm=84e45b7eb393d2689b3fa22b063234a9550ae9ceffc9cf1771621390f24039d2f97928e8da0d&scene=21#wechat_redirect")
    
*   [MoE 与 Mamba 强强联合，将状态空间模型扩展到数百亿参数](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650905254%26idx%3D3%26sn%3D71a840e160797a8052a8d6ea4fcf4dec%26chksm%3D84e45ed8b393d7ce34f461ca0b195b51a26aad975272cccd18a2a2e7dc2a316a2f800eabec95%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650905254&idx=3&sn=71a840e160797a8052a8d6ea4fcf4dec&chksm=84e45ed8b393d7ce34f461ca0b195b51a26aad975272cccd18a2a2e7dc2a316a2f800eabec95&scene=21#wechat_redirect")
    
*   [开源大模型王座再易主，1320 亿参数 DBRX 上线，基础、微调模型都有](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650912509%26idx%3D1%26sn%3Dcab582849245ef9382317ec13f820dfc%26chksm%3D84e47283b393fb95bf5f8b793eecb5280c5a3f67dd14a097e7aaa947e9dd2e04a6fffab5b1a0%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650912509&idx=1&sn=cab582849245ef9382317ec13f820dfc&chksm=84e47283b393fb95bf5f8b793eecb5280c5a3f67dd14a097e7aaa947e9dd2e04a6fffab5b1a0&scene=21#wechat_redirect")
    
*   [CVPR 2024 | 基于 MoE 的通用图像融合模型，添加 2.8% 参数完成多项任务](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650915526%26idx%3D5%26sn%3D78f3444380c9ca6e7146a881a7231215%26chksm%3D84e406b8b3938fae7f47b441828fff2d259251938f0ac8bab4df6e9b198688710b3ec8013033%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650915526&idx=5&sn=78f3444380c9ca6e7146a881a7231215&chksm=84e406b8b3938fae7f47b441828fff2d259251938f0ac8bab4df6e9b198688710b3ec8013033&scene=21#wechat_redirect")
    
*   [CVPR 2023 | 模块化 MoE 将成为视觉多任务学习基础模型](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650872496%26idx%3D4%26sn%3Dde6400986f9d53f85bd70066b1f7a878%26chksm%3D84e4deceb39357d805a3456afb5e1ed78dc36a3752b27e2e6aee6e5696a1f789fd87d86f0e70%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650872496&idx=4&sn=de6400986f9d53f85bd70066b1f7a878&chksm=84e4deceb39357d805a3456afb5e1ed78dc36a3752b27e2e6aee6e5696a1f789fd87d86f0e70&scene=21#wechat_redirect")
    
*   [谷歌 Gemini1.5 火速上线：MoE 架构，100 万上下文](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650907658%26idx%3D2%26sn%3De6dad13b58a1ea9298c81e537f022041%26chksm%3D84e46074b393e962eb67f32e0f56357678a211d9cdad63ac28174cdbffc896662c35ffcf22a7%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650907658&idx=2&sn=e6dad13b58a1ea9298c81e537f022041&chksm=84e46074b393e962eb67f32e0f56357678a211d9cdad63ac28174cdbffc896662c35ffcf22a7&scene=21#wechat_redirect")
    
*   [苹果大模型 MM1 杀入场：300 亿参数、多模态、MoE 架构，超半数作者是华人](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650911073%26idx%3D1%26sn%3Da915a4e1c32154400adeadbeb853925a%26chksm%3D84e4751fb393fc09a702a547b344f7daa5a5d639679f80f35b7333cdf86a44d1901d04444f06%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650911073&idx=1&sn=a915a4e1c32154400adeadbeb853925a&chksm=84e4751fb393fc09a702a547b344f7daa5a5d639679f80f35b7333cdf86a44d1901d04444f06&scene=21#wechat_redirect")
    
*   [8x7B MoE 与 Flash Attention 2 结合，不到 10 行代码实现快速推理](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650902476%26idx%3D2%26sn%3D05a810a5308474855903090833005521%26chksm%3D84e44bb2b393c2a4ce0ad46ad7214c46d07ce1f17f9f1bb62aabddcfb70c8d5c2059774dca50%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650902476&idx=2&sn=05a810a5308474855903090833005521&chksm=84e44bb2b393c2a4ce0ad46ad7214c46d07ce1f17f9f1bb62aabddcfb70c8d5c2059774dca50&scene=21#wechat_redirect")
    
*   [打破 MoE 训练效率与性能瓶颈，华为盘古稀疏大模型全新架构 LocMoE 出炉](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650906843%26idx%3D4%26sn%3D8a4a960e42ad3e10d1805eaf7ee92de7%26chksm%3D84e464a5b393edb356d83f5bdcd46d613dec70fa599247bb3979cd6b5a0c196885bd2fdb8ffa%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650906843&idx=4&sn=8a4a960e42ad3e10d1805eaf7ee92de7&chksm=84e464a5b393edb356d83f5bdcd46d613dec70fa599247bb3979cd6b5a0c196885bd2fdb8ffa&scene=21#wechat_redirect")
    
*   [单个 4090 可推理，2000 亿稀疏大模型「天工 MoE」开源](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650920390%26idx%3D4%26sn%3D0bc7ce29e6bcff325da99316b20e377e%26chksm%3D84e411b8b39398ae368f15554e3db1a2b16037e264124274a5599c184614e237b360847c972b%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650920390&idx=4&sn=0bc7ce29e6bcff325da99316b20e377e&chksm=84e411b8b39398ae368f15554e3db1a2b16037e264124274a5599c184614e237b360847c972b&scene=21#wechat_redirect")
    
*   [Mistral 开源 8X22B 大模型，OpenAI 更新 GPT-4 Turbo 视觉，都在欺负谷歌](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650913885%26idx%3D5%26sn%3D4c5362a45c3a460ac2c3038b4a947379%26chksm%3D84e47823b393f13505f538ca74a1e7dcacce8932efb86b38cf6f05fef81f7f04e5a3330ec403%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650913885&idx=5&sn=4c5362a45c3a460ac2c3038b4a947379&chksm=84e47823b393f13505f538ca74a1e7dcacce8932efb86b38cf6f05fef81f7f04e5a3330ec403&scene=21#wechat_redirect")
    
*   [一条磁力链接席卷 AI 圈，87GB 种子直接开源 8x7B MoE 模型](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650899930%26idx%3D1%26sn%3D7dfa496cd639127d6779e478b829b07c%26chksm%3D84e441a4b393c8b2a57030622e16874be29f1103bc0ca14d10f8408dec71e6d6988d06152958%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650899930&idx=1&sn=7dfa496cd639127d6779e478b829b07c&chksm=84e441a4b393c8b2a57030622e16874be29f1103bc0ca14d10f8408dec71e6d6988d06152958&scene=21#wechat_redirect")
    
*   [比 MoE 更有潜力？进化算法融合模型的新路径是否值得一试？](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650914415%26idx%3D4%26sn%3D838e9be75a17c589aae3e83ca1d28174%26chksm%3D84e47a11b393f30748039e2573824e65d5013bb864aa0863bd691898a109aae3f3f1fe8dd786%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650914415&idx=4&sn=838e9be75a17c589aae3e83ca1d28174&chksm=84e47a11b393f30748039e2573824e65d5013bb864aa0863bd691898a109aae3f3f1fe8dd786&scene=21#wechat_redirect")
    
*   [清华发布 SmartMoE：一键实现高性能 MoE 稀疏大模型分布式训练](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650886540%26idx%3D5%26sn%3Db656504d2a1ac8d555a8c68ccc0f7ded%26chksm%3D84e495f2b3931ce4b8c1b3f75fde8929af3c1a1ca49e6e543fea4fcdfb70c5d0a6f33c4e6f74%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650886540&idx=5&sn=b656504d2a1ac8d555a8c68ccc0f7ded&chksm=84e495f2b3931ce4b8c1b3f75fde8929af3c1a1ca49e6e543fea4fcdfb70c5d0a6f33c4e6f74&scene=21#wechat_redirect")
    
*   [一块钱 100 万 token，超强 MoE 模型开源，性能直逼 GPT-4-Turbo](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650917057%26idx%3D4%26sn%3D2d3225438117cdea15e417b6aa6b3d1e%26chksm%3D84e40cbfb39385a9f367174f0721a69e4cacb0eb88a7ccc960029abe75285eb677ac938f87d7%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650917057&idx=4&sn=2d3225438117cdea15e417b6aa6b3d1e&chksm=84e40cbfb39385a9f367174f0721a69e4cacb0eb88a7ccc960029abe75285eb677ac938f87d7&scene=21#wechat_redirect")