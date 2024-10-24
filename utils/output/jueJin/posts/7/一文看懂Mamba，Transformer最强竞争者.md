---
author: "机器之心"
title: "一文看懂Mamba，Transformer最强竞争者"
date: 2024-08-19
description: "深度学习架构有很多，但近些年最成功的莫过于 Transformer，其已经在多个应用领域确立了自己的主导地位。 如此成功的一大关键推动力是注意力机制，这能让基于 Transformer 的模型关注与输 Mamba 虽好，但发展尚早。

深度学习架构有很多，但近些年最成功的莫过于 Transformer，其已经在多个应"
tags: ["前端","人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:5,views:178,"
---
> Mamba 虽好，但发展尚早。

深度学习架构有很多，但近些年最成功的莫过于 Transformer，其已经在多个应用领域确立了自己的主导地位。

如此成功的一大关键推动力是注意力机制，这能让基于 Transformer 的模型关注与输入序列相关的部分，实现更好的上下文理解。但是，注意力机制的缺点是计算开销大，会随输入规模而二次增长，也因此就难以处理非常长的文本。

好在前段时间诞生了一种颇具潜力的新架构：结构化的状态空间序列模型（SSM）。该架构能高效地捕获序列数据中的复杂依赖关系，并由此成为 Transformer 的一大强劲对手。

这类模型的设计灵感来自经典的状态空间模型 —— 我们可以将其看作是循环神经网络和卷积神经网络的融合模型。它们可使用循环或卷积运算进行高效地计算，从而让计算开销随序列长度而线性或近线性地变化，由此大幅降低计算成本。

更具体而言，SSM 最成功的变体之一 Mamba 的建模能力已经可以比肩 Transformer，同时还能维持随序列长度的线性可扩展性。

Mamba 首先引入了一个简单却有效选择机制，其可根据输入对 SSM 进行重新参数化，从而可让模型在滤除不相关信息的同时无限期地保留必要和相关的数据。然后，Mamba 还包含一种硬件感知型算法，可使用扫描（scan）而非卷积来循环地计算模型，这在 A100 GPU 上能让计算速度提升 3 倍。

如图 1 所示，凭借强大的建模复杂长序列数据的能力和近乎线性的可扩展性，Mamba 已经崛起成为一种基础模型，并有望变革计算机视觉、自然语言处理和医疗等多个研究和应用领域。

![图片](/images/jueJin/89ebcb52b95b418.png)

因此，研究和应用 Mamba 的文献迅速增长，让人目不暇接，一篇全面的综述报告必定大有裨益。近日，香港理工大学的一个研究团队在 arXiv 上发布了他们的贡献。

![图片](/images/jueJin/8b83b3ea382c4e7.png)

*   论文标题：A Survey of Mamba
    
*   论文地址：[arxiv.org/pdf/2408.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2408.01129 "https://arxiv.org/pdf/2408.01129")
    

这份综述报告从多个角度对 Mamba 进行了总结，既能帮助初学者学习 Mamba 的基础工作机制，也能助力经验丰富的实践者了解最新进展。

Mamba 是一个热门研究方向，也因此有多个团队都在尝试编写综述报告，除了本文介绍的这一篇，还有另一些关注状态空间模型或视觉 Mamba 的综述，详情请参阅相应论文：

*   Mamba-360: Survey of state space models as transformer alternative for long sequence modelling: Methods, applications, and challenges. arXiv:2404.16112
    
*   State space model for new-generation network alternative to transformers: A survey. arXiv:2404.09516
    
*   Vision Mamba: A Comprehensive Survey and Taxonomy. arXiv:2405.04404
    
*   A survey on vision mamba: Models, applications and challenges. arXiv:2404.18861
    
*   A survey on visual mamba. arXiv:2404.15956
    

**预备知识**  
Mamba 集中了循环神经网络（RNN）的循环框架、Transformer 的并行计算和注意力机制、状态空间模型（SSM）的线性特性。因此，为了透彻地理解 Mamba，就必需先理解这三种架构。

**循环神经网络**

循环神经网络（RNN）具有保留内部记忆的能力，因此很擅长处理序列数据。

具体来说，在每个离散时间步骤 k，标准 RNN 在处理一个向量时会连同前一时间步骤的隐藏状态一起处理，之后输出另一个向量并更新隐藏状态。这个隐藏状态就可作为 RNN 的记忆，其能保留过去已见过的输入的信息。这种动态记忆让 RNN 可处理不同长度的序列。

也就是说，RNN 是一种非线性的循环模型，可通过使用存储在隐藏状态中历史知识来有效地捕获时间模式。  
**Transformer**  
Transformer 的自注意力机制有助于捕获输入之中的全局依赖。其实现方式是基于每个位置相对于其它位置的重要程度为它们分配权重。更具体而言，首先对原始输入进行线性变换，将输入向量的序列 x 转换成三类向量：查询 Q、键 K 和值 V。

然后计算归一化的注意力分数 S 并计算注意力权重。

除了可以执行单个注意力函数，我们还可以执行多头注意力。这让模型可以捕获不同类型的关系，并从多个视角理解输入序列。多头注意力会使用多组自注意力模块并行地处理输入序列。其中每个头都独立运作，执行的计算与标准自注意力机制一样。

之后，将每个头的注意力权重汇聚组合，得到值向量的加权和。这个聚合步骤可让模型使用来自多个头的信息并捕获输入序列中的多种不同模式和关系。

**状态空间**  
状态空间模型（SSM）是一种传统的数学框架，可用于描述系统随时间变化的动态行为。近些年来，人们已将 SSM 广泛应用于控制论、机器人学和经济学等多个不同领域。

究其核心，SSM 是通过一组名为「状态」的隐藏变量来体现系统的行为，使其能有效捕获时间数据的依赖关系。不同于 RNN，SSM 是一种具有关联（associative）属性的线性模型。具体来说，经典的状态空间模型会构建两个关键方程（状态方程和观察方程），以通过一个 N 维的隐藏状态 h (t) 建模当前时间 t 时输入 x 与输出 y 之间的关系。

*   离散化

为了满足机器学习的需求，SSM 必需经历一个离散化过程 —— 将连续参数转变成离散参数。通常来说，离散化方法的目标是将连续时间划分为具有尽可能相等积分面积的 K 个离散区间。为了实现这一目标，SSM 采用的最具代表性的解决方案之一是 Zero-Order Hold（ZOH），其假设区间 Δ = \[𝑡\_{𝑘−1}, 𝑡\_𝑘 \] 上的函数值保持不变。离散 SSM 与循环神经网络结构相似，因此离散 SSM 能比基于 Transformer 的模型更高效地执行推理过程。

*   卷积计算

离散 SSM 是一个具有结合属性的线性系统，因此可以与卷积计算无缝整合。  
RNN、Transformer 和 SSM 之间的关系  
图 2 展示了 RNN、Transformer 和 SSM 的计算算法。

![图片](/images/jueJin/78bd6740694f4ca.png)

一方面，常规 RNN 的运作基于一种非线性的循环框架，其中每个计算都仅依赖于之前的隐藏状态和当前输入。

尽管这种形式可让 RNN 在自回归推理时快速生成输出，但它也让 RNN 难以充分利用 GPU 的并行计算能力，导致模型训练速度变慢。

另一方面，Transformer 架构是在多个「查询 - 键」对上并行执行矩阵乘法，而矩阵乘法可以高效地分配给硬件资源，从而更快地训练基于注意力的模型。但是，如果要让基于 Transformer 的模型生成响应或预测，则推理过程会非常耗时。

不同于仅支持一类计算的 RNN 和 Transformer，离散 SSM 灵活性很高；得益于其线性性质，它既能支持循环计算，也可支持卷积计算。这种特性让 SSM 不仅能实现高效推理，也能实现并行训练。但是，需要指出，最常规的 SSM 是时不变的，也就是说其 A、B、C 和 Δ 与模型输入 x 无关。这会限制其上下文感知型建模的能力，导致 SSM 在选择性复制等一些特定任务上表现不佳。

**Mamba**  
为了解决上述传统 SSM 的缺点，实现上下文感知型建模，Albert Gu 和 Tri Dao 提出了可用作通用序列基础模型主干网络的 Mamba，参阅机器之心报道《[五倍吞吐量，性能全面包围 Transformer：新架构 Mamba 引爆 AI 圈](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650899414%26idx%3D1%26sn%3Db6c34617d6d0f45b3ad3da9ea6385206%26chksm%3D84e447a8b393cebe030f1b2dc3e5372e3258f772bdf8510134e1d551d82558225a8454399619%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650899414&idx=1&sn=b6c34617d6d0f45b3ad3da9ea6385206&chksm=84e447a8b393cebe030f1b2dc3e5372e3258f772bdf8510134e1d551d82558225a8454399619&scene=21#wechat_redirect")》。

之后，他们俩又进一步提出了 Mamba-2，其中的结构化空间状态对偶（SSD/Structured Space-State Duality）构建了一个将结构化 SSM 与多种形式的注意力连接起来的稳健的理论框架，让我们可将原本为 Transformer 开发的算法和系统优化技术迁移用于 SSM，也可参阅机器之心报道《[再战 Transformer！原作者带队的 Mamba 2 来了，新架构训练效率大幅提升](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650920390%26idx%3D1%26sn%3D46a34c9edf886e58b6d18f28c8ec438a%26chksm%3D84e411b8b39398aeb969f90b4a22821325c8974c1846ee91b853c0fa77b9f404b9f08b2a0e57%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650920390&idx=1&sn=46a34c9edf886e58b6d18f28c8ec438a&chksm=84e411b8b39398aeb969f90b4a22821325c8974c1846ee91b853c0fa77b9f404b9f08b2a0e57&scene=21#wechat_redirect")》。

**Mamba-1：使用硬件感知型算法的选择式状态空间模型**  
Mamba-1 基于结构化状态空间模型引入了三大创新技术，即基于高阶多项式投影算子（HiPPO）的内存初始化、选择机制和硬件感知型计算。如图 3 所示。这些技术的目标是提升 SSM 的长程线性时间序列建模能力。

![图片](/images/jueJin/4b03a2b71f7c46a.png)

具体来说，其中的初始化策略可构建一个连贯的隐藏状态矩阵，以有效地促进长程记忆。  
然后，选择机制可让 SSM 有能力获取可感知内容的表征。

最后，为了提升训练效率，Mamba 还包含两种硬件感知型计算算法：Parallel Associative Scan（并行关联扫描）和 Memory Recomputation（内存重新计算）。

**Mamba-2：状态空间对偶**  
Transformer 启发了多种不同技术的发展，比如参数高效型微调、灾难性遗忘缓解、模型量化。为了让状态空间模型也能受益于这些原本为 Transformer 开发的技术，Mamba-2 引入了一个新框架：结构化状态空间对偶（SSD）。该框架在理论上将 SSM 和不同形式的注意力连接到了一起。

本质上讲，SSD 表明，Transformer 使用的注意力机制和 SSM 中使用的线性时不变系统都可被视为半可分离的矩阵变换。

此外，Albert Gu 和 Tri Dao 还证明选择式 SSM 等价于使用一种半可分离掩码矩阵实现的结构化线性注意力机制。

Mamba-2 基于 SSD 设计了一种能更高效使用硬件的计算方法，这要用到一种块分解矩阵乘法算法。

具体来说，通过这种矩阵变换将状态空间模型视为半可分离矩阵，Mamba-2 能将该计算分解为矩阵块，其中对角块表示块内计算。而非对角块则表示通过 SSM 的隐藏状态分解的块间计算。该方法可让 Mamba-2 的训练速度超过 Mamba-1 的并行关联扫描的 2-8 倍，同时性能还能媲美 Transformer。

**Mamba 块**  
下面来看看 Mamba-1 和 Mamba-2 的块设计。图 4 比较了这两种架构。

![图片](/images/jueJin/b66f9e81d0654ba.png)

Mamba-1 的设计是以 SSM 为中心，其中选择式 SSM 层的任务是执行从输入序列 X 到 Y 的映射。在这种设计中，经过了初始的创建 X 的线性投射之后，会使用 (A, B, C) 的线性投射。然后，输入 token 和状态矩阵会通过选择式 SSM 单元，利用并行关联扫描，从而得到输出 Y。之后，Mamba-1 采用了一个 skip 连接，以鼓励特征复用和缓解常在模型训练过程中发生的性能下降问题。最后，通过交错地堆叠该模块与标准归一化和残差连接，便可构建出 Mamba 模型。

至于 Mamba-2，则是引入了 SSD 层来创建从 \[X, A, B, C\] 到 Y 的映射。其实现方式是在块的起点处使用单个投射来同时处理 \[X, A, B, C\]，这类似于标准注意力架构以并行方式生成 Q、K、V 投射的方式。  
也就是说，通过移除序列线性投射，Mamba-2 块是在 Mamba-1 块的基础上进行了简化。这能让 SSD 结构的计算速度超过 Mamba-1 的并行选择式扫描。此外，为了提升训练稳定性，Mamba-2 还在 skip 连接之后添加了一个归一化层。

**Mamba 模型正在发展进步**  
状态空间模型和 Mamba 近来发展迅猛，已经成为了一大极具潜力的基础模型骨干网络选择。尽管 Mamba 在自然语言处理任务上表现不俗，但也仍具有一些难题，比如记忆丢失、难以泛化到不同任务、在复杂模式方面的表现不及基于 Transformer 的语言模型。为了解决这些难题，研究社区为 Mamba 架构提出了诸多改进方案。现有的研究主要集中于修改块设计、扫描模式和记忆管理。表 1 分类总结了相关研究。

![图片](/images/jueJin/5e99f35b6f28440.png)

**块设计**  
Mamba 块的设计和结构对 Mamba 模型的总体性能有很大的影响，也因此这成为了一大研究热点。

![图片](/images/jueJin/bc9d204af49c40f.png)

如图 5 所示，基于构建新 Mamba 模块的不同方法，现有研究可以分为三类：

*   集成方法：将 Mamba 块与其它模型集成到一起，实现效果与效率的平衡；
    
*   替换方法：用 Mamba 块替换其它模型框架中的主要层；
    
*   修改方法：修改经典 Mamba 块内的组件。
    

**扫描模式**  
并行关联扫描是 Mamba 模型内的一大关键组件，其目标是解决由选择机制导致的计算问题、提升训练过程速度以及降低内存需求。其实现方式是利用时变的 SSM 的线性性质来在硬件层级上设计核融合和重新计算。但是，Mamba 的单向序列建模范式不利于全面学习多样化的数据，比如图像和视频。

![图片](/images/jueJin/c7e52ce61a79464.png)

为缓解这一问题，一些研究者探索了新的高效扫描方法，以提升 Mamba 模型的性能以及促进其训练过程。如图 6 所示，在开发扫描模式方面，现有的研究成果可以分为两类：

*   展平式扫描方法：以展平的视角看待 token 序列，并基于此处理模型输入；
    
*   立体式扫描方法：跨维度、通道或尺度扫描模型输入，这又可进一步分为三类：分层扫描、时空扫描、混合扫描。
    

**记忆管理**  
类似于 RNN，在状态空间模型内，隐藏状态的记忆有效地存储了之前步骤的信息，因此对 SSM 的整体性能有着至关重要的影响。尽管 Mamba 引入了基于 HiPPO 的方法来进行记忆初始化，但管理 SSM 单元中的记忆依然难度很大，其中包括在层之前转移隐藏信息以及实现无损记忆压缩。

为此，一些开创性研究提出了一些不同的解决方案，包括记忆的初始化、压缩和连接。

**让 Mamba 适应多样化的数据**  
Mamba 架构是选择式状态空间模型的一种扩展，其具备循环模型的基本特性，因而非常适合作为处理文本、时间序列、语音等序列数据的通用基础模型。

不仅如此，近期一些开创性研究更是扩展了 Mamba 架构的应用场景，使其不仅能处理序列数据，还能用于图像和图谱等领域，如图 7 所示。

![图片](/images/jueJin/4352083f17cf448.png)

这些研究的目标是既充分利用 Mamba 能获取长程依赖关系的出色能力，也让其发挥学习和推理过程中的效率优势。表 2 简单总结了这些研究成果。

![图片](/images/jueJin/1a1a7d3d60f7453.png)

**序列数据**  
序列数据是指以特定顺序收集和整理的数据，其中数据点的顺序具有重要意义。这份综述报告全面总结了 Mamba 在多种序列数据上的应用，包括自然语言、视频、时间序列、语音和人体运动数据。详见原论文。

**非序列数据**  
不同于序列数据，非序列数据并不遵循特定的顺序。其数据点可以任意顺序进行组织而不会对数据的含义造成显著影响。对于专门设计用于捕获数据中时间依赖关系的循环模型（RNN 和 SSM 等）来说，这种缺乏固有顺序的数据会很难处理。

令人惊讶的是，近期的一些研究成功让 Mamba（代表性的 SSM）实现了对非序列数据的高效处理，包括图像、图谱和点云数据。

**多模态数据**  
为了提升 AI 的感知和场景理解能力，可以整合多个模态的数据，比如语言（序列数据）和图像（非序列数据）。这样的整合能提供非常有价值和补充性的信息。

近段时间来，多模态大型语言模型（MLLM）是最受关注的研究热点；这类模型继承了大型语言模型（LLM）的强大能力，包括强大的语言表达和逻辑推理能力。尽管 Transformer 已经成为该领域的主导方法，但 Mamba 也正在崛起成为一大强劲竞争者，其在对齐混合源数据和实现序列长度的线性复杂度扩展方面表现出色，这使 Mamba 有望在多模态学习方面替代 Transformer。

**应用**  
下面介绍基于 Mamba 的模型的一些值得注意的应用。该团队将这些应用分为了以下类别：自然语言处理、计算机视觉、语音分析、药物发现、推荐系统以及机器人和自主系统。

这里我们不再过多介绍，详见原论文。

**挑战与机遇**  
Mamba 虽然已经在一些领域取得了出色表现，但总体而言，Mamba 研究仍还处于起步阶段，前方仍还有一些挑战有待克服。当然，这些挑战同时也是机遇。

*   如何开发和改进基于 Mamba 的基础模型；
*   如何充分实现硬件感知型计算，以尽可能利用 GPU 和 TPU 等硬件，提升模型效率；
*   如何提升 Mamba 模型的可信度，这需要安全和稳健性、公平性、可解释性以及隐私方面的进一步研究；
*   如何将 Transformer 领域的新技术用于 Mamba，如参数高效型微调、灾难性遗忘缓解、检索增强式生成（RAG）。