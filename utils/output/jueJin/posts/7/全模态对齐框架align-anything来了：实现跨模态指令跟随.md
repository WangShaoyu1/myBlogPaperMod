---
author: "机器之心"
title: "全模态对齐框架align-anything来了：实现跨模态指令跟随"
date: 2024-10-17
description: "本开源项目由北京大学对齐小组开发并进行长期维护，团队专注于人工智能系统的安全交互与价值对齐，指导老师为北京大学人工智能研究院杨耀东助理教授。本开源项目由北京大学对齐小组开发并进行长期维护，团队专注于人工智能系统的安全交互与价值对齐，指导老师为北京大学人工智能研究院杨耀东助理教授。核心成员包括吉嘉铭、周嘉懿、"
tags: ["人工智能","Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读19分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:1,views:67,"
---
\*\*本开源项目由北京大学对齐小组开发并进行长期维护，团队专注于人工智能系统的\*\*\*\*安全交互与价值对齐，指导老师为北京大学人工智能研究院杨耀东助理教授。核心成员包括吉嘉铭、周嘉懿、邱天异、陈博远、王恺乐、洪东海、楼翰涛、王旭尧、\*\***陈文琦、张钊为、汪明志、钟伊凡等。**

**团队就强化学习方法及大模型的后训练对齐技术开展了一系列重要工作，包括 Aligner（NeurIPS 2024 Oral）、ProgressGym（NeurIPS 2024 Spotlight）以及 Safe-RLHF（ICLR 2024 Spotlight）等系列成果。近期，团队针对 OpenAI o1 技术的深入分析累计点击量已超过 15 万。**

> 如何全模态大模型与人类的意图相对齐，已成为一个极具前瞻性且至关重要的挑战。

在当前 AI 领域的快速发展中，「有效加速」和「超级对齐」已经成为两个主要的发展动向，它们深刻影响着研发方向和投资决策。前者以 OpenAI 为代表，后者则得到了包括 Llama 等诸多开源模型的支持。

2024 年 9 月 25 日，MetaAI 发布了 Llama 3.2 后，北京大学一支团队迅速跟进，**用自研的全球首个全模态对齐框架「Align Anything」对 Llama 3.2 进行了微调，表现出了比 Meta 微调的 Llama-3.2-11B-Vision-Instruct 更强的对齐性与指令跟随性**。

为进一步促进社区的多模态对齐研究，**日前，该团队以将「Align Anything」框架进行开源**。通过该框架，研究人员不但可以利用该框架进行多模态模型的对齐实验，提高模型的训练和评估效率，还可以用该框架微调各种大模型，提升在特定任务上的表现。该框架的推出，对探索全模态大模型与人类的意图相对齐、研究如何通过不同对齐算法让模型输出更符合人类预期和价值观具有重要意义。

该框架的独特之处在于：

1）**Align-Anything 框架支持文本、图像、音频、视频等多种模态的输入和输出对齐，这在目前开源社区中是独一无二的**。它填补了现有框架仅支持单一模态或少数模态对齐的空白，为全模态大模型的对齐提供了统一和通用的解决方案；

2）框架实现了包括 SFT、DPO、PPO、SimPO 等超过 6 种对齐算法，支持从文本到文本、文本加图像到文本、文本到图像、文本到音频、文本到视频等多种模态的微调。**研究者可以轻易地在任意至任意的模态上扩展新的对齐算法**；

3）**同时发布首个全模态人类偏好数据集 Align-Anything**，提供详细的人类偏好注释以及用于批评和改进的精细语言反馈，在增强模型的多模态理解能力的同时，从而实现跨模态的全面评估和改进。

**全模态大模型与全模态对齐**
----------------

**大模型性能的最后一块拼图**
----------------

人类在日常生活中接收到的信息往往是全模态的，不同的感官渠道能够互相补充，帮助我们更全面地理解和表达复杂的概念。这种全模态的信息流对大模型范式转向通用人工智能也同等重要，研究人员开始尝试将大语言模型进行模态扩展，得到不仅能够处理语言，还可以理解并生成图像、音频、视频等多种信息的全模态模型，如 GPT-4o、Chameleon 等。也包含目前最为流行的开源视觉语言模型，Llama-3.2-Vision。

以 Llama-3.2-Vision 为代表的大语言模型多模态化已是大势所趋，而支持任意的模态输入并生成任意模态的输出的全模态大模型将成为未来的里程碑。**如何将全模态大模型与人类的意图相对齐，已成为一个极具前瞻性且至关重要的挑战**。然而，随着模态的增加，输入输出空间的分布更加广泛，并增加了幻觉现象，使得全模态对齐变得更加复杂。

在不到两周的时间内，北大对齐小组基于 Llama-3.2-Vision 的 11B 预训练版本进行后训练 (Post-Training) 对齐微调得到 Beaver-Vision-11B，表现出了比 Meta 微调的 Llama-3.2-11B-Vision-Instruct 更强的对齐性与指令跟随性。

*   Beaver-Vision-11B 模型：[huggingface.co/PKU-Alignme…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2FPKU-Alignment%2FBeaver-Vision-11B "https://huggingface.co/PKU-Alignment/Beaver-Vision-11B")

例如被问到「图中的拉面来自于何家餐厅？」这个问题时，Llama-3.2-11B-Vision-Instruct 没有准确识别出餐具中的「一兰」字样，将餐厅错误地解读为「Ippudo」；专家模型 GPT-4o 识别准确，但提供的回答并不详细具体。而 Beaver-Vision-11B 既准确地识别出了餐厅，还提供了细致的思考与推理过程。

![](/images/jueJin/f2bf0a1d09cf42d.png)

在 Meta 并未披露 Llama-3.2-11B-Vision-Instruct 对齐技术细节情况下，北大对齐小组愿开源数据、训练、模型、评估的全流程，为全模态对齐研究贡献力量。

**对齐框架：Align-Anything 详解**

Beaver-Vision-11B 的背后是北大对齐小组在数据、模型、算法、框架和评估五大维度进行的深入原创探索 —— Align-Anything 框架，它致力于使全模态大模型与人类意图和价值观对齐，这里的全模态包括文生文、文生图、文图生文、文生视频等任意到任意的输入与输出模态。

*   Align-anything 开源地址：[github.com/PKU-Alignme…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FPKU-Alignment%2Falign-anything "https://github.com/PKU-Alignment/align-anything")
    
*   Align-anything 数据集地址：[huggingface.co/datasets/PK…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fdatasets%2FPKU-Alignment%2Falign-anything-400k "https://huggingface.co/datasets/PKU-Alignment/align-anything-400k")
    

关于全模态大模型对齐的定义和里程碑的更多细节，可以参阅北大对齐小组发布的 AI 对齐综述。

![](/images/jueJin/92556e4980c5485.png)

*   论文链接：[alignmentsurvey.com/](https://link.juejin.cn?target=https%3A%2F%2Falignmentsurvey.com%2F "https://alignmentsurvey.com/")

总体而言，该框架具有以下特点：

![](/images/jueJin/28c5021e112a411.png)_align-anything 的框架示意图_

*   **高度模块化的框架**：对不同算法类型的**抽象化和精心设计的 API**，用户能够为不同的任务修改和定制代码，以及**定制化模型与数据集注册**等高级扩展用法；
    
*   **支持跨任意模态模型的微调**：包含对如 Llama3.2、LLaVA、Chameleon、Qwen2-VL、Qwen2-Audio、Diffusion 等**跨越多种模态生成与理解**的大模型的微调能力；
    
*   **支持不同的对齐方法**：支持任意模态上的多种对齐算法，既包括 **SFT、DPO、PPO** 等经典算法，也包括 **ORPO, SimPO 和 KTO** 等新算法；
    
*   **支持多种开、闭源对齐评估**：支持了 30 多个多模态评测基准，包括如 MMBench、VideoMME 等**多模态理解评测**，以及如 FID、HPSv2 等**多模态生成评测**。
    

**训练框架**

北大对齐小组设计了高度**模块化**、**扩展性**以及**简单易用**的对齐训练框架，支持由**文本、图片、视频、音频**四大基本模态衍生出的**任意模态模型对齐微调**，并验证了框架对齐算法的**实现正确性**。

![](/images/jueJin/65ce39fe06914fd.png)

**模块化**

对齐代码实现高度可复用。Align-Anything 的设计思路是模态与算法的解耦合。例如，对于 DPO 算法，其损失函数的实现可被抽象为：提升 chosen 答案的概率，降低 rejected 答案的概率。这一思想是模态无感的。

Align-Anything 在模态扩展的过程中尽可能地复用了相同的框架，这样既能够突出不同模态间算法实现的差异性，也便于用户在新的模态上扩展算法。

**扩展性**

模型与数据集注册高度可定制。多模态大模型的迭代日新月异，新模型、新数据集层出不穷。这要求对齐框架具备高度的可扩展性，便于用户快速地将新模型或新数据集仅通过几行代码注册进框架中。

对于新数据集的注册，Align-Anything 提出了一个名为「template」的数据集键值转换规则。无论 prompt 对应的键名是「prompt」还是「question」，无论 response 对应的键名是「response」还是「answer」，「template」机制都支持用户通过简单构建映射规则的方式完成键值解析和转换，避免用户单独实现复杂的数据预处理代码。

**易用性**

用户指南与代码传参高度可复现。对齐算法的训练启动往往涉及复杂的路径与训练超参数传递，而随着模态数的增多，算法训练启动愈发复杂，新用户往往难以快速上手。为此，北大对齐小组为 Align-Anything 开发了详尽的使用说明文档。

![](/images/jueJin/6987edc3fb1a47f.png)

这份说明文档为已支持模态的每个对齐算法都提供了一份可以直接复制粘贴并运行的启动脚本。示例是最好的入门教程，通过运行这些示例，用户可以快速启动训练。

进一步，北大对齐团队提供了细致的训练超参数传递规则解析，告知用户有哪些训练超参数可传入，以及如何传入，这些设计将为用户调试多模态大模型对齐实验提供极大便利。

**正确性**

北大对齐小组在他们构造的全模态对齐数据集上，测试了 Align-Anything 在多种模态的任务和模型上的对齐表现。他们发现对齐算法能够大幅提升模型的指令跟随能力，并且在多种开源榜单上进行了验证，这些实验结果既包含了 LLaVA 等经典的视觉语言模型，也涵盖有最新由 Meta 开源的 Chameleon 系列模型：

![](/images/jueJin/37bede4d710848c.png)

*   AA-chameleon-7b-base 模型：[huggingface.co/PKU-Alignme…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2FPKU-Alignment%2FAA-chameleon-7b-base "https://huggingface.co/PKU-Alignment/AA-chameleon-7b-base")
    
*   AA-chameleon-7b-plus 模型：[huggingface.co/PKU-Alignme…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2FPKU-Alignment%2FAA-chameleon-7b-plus "https://huggingface.co/PKU-Alignment/AA-chameleon-7b-plus")
    

除了最经典的图文模态，北大对齐小组还在时新的音频文本混合模态上进行了对齐的有效性验证。Qwen2-Audio 是截至目前效果最好的开源音频文本混合模型之一，已在 AIR Bench 等多种类型的评测榜单上取得 SOTA 的表现。Qwen2-Audio 的技术报告中提到了对齐算法 DPO 在后训练（Post-Training）阶段的重要作用，然而，目前社区并不支持对于该模型的对齐微调。

北大对齐小组开源了首个对 Qwen2-Audio 的 DPO 算法的实现，并在 AIR Bench 的多个维度上进行测试，在音频文本上百尺竿头更进一步，相较于 Qwen2-Audio 取得了明显的提升：

![](/images/jueJin/b3d2afa1533d447.png)

**评测框架**

北大对齐小组精心设计了高度解耦合的多模态对齐评测框架，提供**多种模态评测**，支持**多种推理后端**，具有**高度可扩展性**，以满足多样化的多模态模型评测需求。

![](/images/jueJin/62adeb7f1f444c8.png)

**多种模态评测**

Align-Anything 评估框架现已适配了超过 30 个常用基准测试，涵盖了 Text ⇒ Text、Text + Image ⇒ Text 以及 Text ⇒ Image 等模态类别。此外，Text + Audio/Video ⇒ Text 和 Text ⇒ Audio/Video 的基准测试也已完成内部开发。

下表列举了部分框架中已经适配的基准测试：

![](/images/jueJin/84815f42142c438.png)

**多种推理后端**

考虑到 Transformers 框架和 Diffusers 框架对模型支持之间的差异，Align-Anything 的评测框架将推理和评估过程进行了解耦合，并支持使用不同的后端进行推理。在多模态理解任务和多模态生成任务中，框架分别采用 Deepspeed 和 Accelerate 作为推理后端，以适配不同模型结构的推理需求。

此外，Align-Anything 评测模块还提供了使用 vLLM 进行推理的接口，适配 vLLM 框架的模型能够在评测中实现推理加速。

**高度可扩展性**

为了方便集成自定义评测集，Align-Anything 对评测框架进行了高度解耦。该框架主要由 DataLoader、Generator 和 Evaluator 三部分组成。DataLoader 负责加载和预处理多种评测集，转化为适合推理的数据格式；Generator 负责使用不同的推理框架生成结果；Evaluator 则对生成的结果进行评估并输出评分。

如果开发者仅需更换评测集，而无需更改推理框架和评估方式，只需将新的评测集适配到 DataLoader 中即可完成集成。

**对齐综合示例：指令跟随提升**

![](/images/jueJin/6f46b62e80c5437.png)

**全模态人类偏好数据集：Align-Anything**

*   数据集链接：[huggingface.co/datasets/PK…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fdatasets%2FPKU-Alignment%2Falign-anything-400k "https://huggingface.co/datasets/PKU-Alignment/align-anything-400k")

北大对齐小组同时发布了首个全模态人类偏好数据集 Align-Anything。与专注于单个模态且质量参差不齐的现有偏好数据集不同，Align-Anything 提供了高质量的数据，包括了混合输入和输出中的任何模态，旨在提供详细的人类偏好注释以及用于批评和改进的精细语言反馈，从而实现跨模态的全面评估和改进。

总的来说，该数据集具有如下特征：

*   **全模态任务**：涵盖指令跟随、感性认知、针对内容提问、创意创作等多个任务，覆盖任何输入输出混合模态。
    
*   **精细化偏好标注**：基于标注指令跟随、美学性、客观原则符合性、清晰度等多个细粒度原则进行标注，提供复杂精细化偏好标注。
    
*   **自然语言语言反馈**：提供细粒度批评和润色反馈，可利用此自然语言反馈开发算法及提升模型性能
    
*   **跨模态 QA 对**：输入输出包含混合模态，在不同模态之间实现更丰富的交互。
    

**与现有数据集的对比**

我们的世界本质上是多模态的。人类通过多种感官感知世界，**语言模型**也应该以类似的方式运作。然而，由于不同模态数据的可用性和多样性，**当前多模态基础模型**的开发面临限制。具体来说，挑战包括：

*   **模态数据不平衡**：虽然视觉任务有丰富的数据，但视频和音频等其他模态的数据相对稀缺，并且缺乏不同模态之间的联动数据。
    
*   **有限的多模态训练数据**：大多数现有数据集都集中在特定于模态的问答任务上，而缺乏专门的数据集来增强多模态模型的**指令跟随**能力。
    

![](/images/jueJin/ad174d42ebda40e.png)

表中的首选项注释方法由三个部分组成：

*   A 是指标注来源，它指示如何在数据集中确定偏好项。主要是人工注释或手动构建、由 GPT-4V 或其他系统等模型生成或注释，或是从多个来源聚合。 
    
*   S 表示偏好信号的组成，其中可能包括评分、排名和推理。在某些情况下，首选项是通过优化、更正或破坏响应来构建，以形成所需的首选项对。 
    
*   F 则表示数据集是否在这些首选项维度中提供更详细的细粒度反馈。
    

通过和目前现有偏好数据集的对比，北大对齐小组发现虽然随着大模型的能力逐渐向越来越多模态迁移，目前偏好数据集却缺乏细粒度的反馈维度且涵盖模态较少，同时缺乏一个合理的结构和纽带，将跨模态偏好数据集组织起来。 

**数据集的呈现**

为了能够应对上述提到的挑战，在数据集的构建阶段，北大对齐小组开创性地将数据集的呈现分为三个模块，通过语言反馈标注作为弥合模态之间鸿沟的桥梁，承载任意模态上的人类细粒度偏好反馈：

*   Any-to-Any 表示任意类型的输入输出模态的双向转换。
    
*   Any-to-Text 表示从非文字模态的输入向文字模态输出的转换。
    
*   Text-to-Any 则代表从文字模态向其他任意模态进行的转换。
    

同时，他们还演示了基于多模态特性优化数据集质量的多步骤流程：

![](/images/jueJin/49d7a7dabfce4d0.png)

从流程图可以看到，首先设计针对各种模态量身定制的特征，根据特定的模态任务及其相应的特征，以优化部分较低质量的原始提示，以得到最终版本的问题，同时从多个来源收集回答（包括根据特性构造偏序问答对、调用开源和闭源模型以及使用人工生成答案）。

接着对收集到的问答对使用目前 SOTA 闭源模型和专业标注人员进行细粒度的偏好标注。标注过程涵盖各种维度，每个维度都有相应的偏好回答选项和评分标准。

最后，针对各个模态任务特性，提供有关回答的语言反馈（包括批评和优化）。这里的语言反馈流程分为三步：确定批评的范围、对相应需要批评的范围进行反馈，以及对整个反馈过程提供优化建议。这样的语言反馈流程范式捕获了跨模态的直接偏好和基于语言的反馈，确保对响应进行全面评估和优化。

**对齐算法：从全模态语言反馈中学习**

为了解决全模态的统一对齐，北大对齐小组通过更丰富的信息内容实现更精确、细粒度的全模态对齐，需要从数据多样性和反馈机制统一性两个方面深入探索和优化：

*   **丰富的全模态反馈数据**

传统对齐方法依赖单一模态数据，无法满足全模态模型对齐的复杂需求。需要引入更丰富和复杂的反馈模态，如结合图像、音频、视频等多种模态的信息，使反馈内容更加立体和多元化。这种全模态反馈能呈现更多维度的信息，帮助模型更好地理解和捕捉不同模态之间的相互关系，提高对齐的精准度；

*   **统一的反馈收集和处理机制**

当前不同模态之间的反馈形式不统一，导致对齐过程中协调性差。设计一种通用的反馈建模与收集机制，允许人类提供自由形式的反馈，无论是文字描述、图像标注还是语音指令。开发高效的反馈处理机制，将任意模态上的人类反馈转换为细粒度监督信号，对全模态的反馈进行统一建模处理，使其在模型训练中具有一致性；

如何利用好语言反馈的丰富信息赋能全模态对齐，是北大对齐团队重点关注的关键科学问题。为此，他们提出了从语言反馈中学习的范式（_Learning from Language Feedback, LLF_）。

![](/images/jueJin/9f5ba04ca013497.png)

LLF 范式主要包含四大环节：

1.  评论模型建模：使用交叉熵损失函数，令多模态大模型拟合数据集中的语言反馈，作为评论模型。训练完成的评论模型将对输入的问答对提供评论。
    
2.  模型自提升：令初始模型在给定好 prompt 的数据集上生成一系列 response，再利用评论模型对此生成的评论，令初始模型针对自身的 response 进行修正。
    
3.  奖励建模：将修正后的 response 与原先的 response 拼接，组成偏序对，进行奖励建模，或是 DPO 微调。
    
4.  强化学习微调：基于训练好的奖励模型，完成完整的强化学习微调流程。
    

北大对齐小组希望 LLF 能够通过语言反馈提取出更加丰富的偏好信息，从而提升多模态大模型的指令跟随能力。他们已在图文模态上展开了前期探索，验证了这套路径的可行性。北大对齐小组将在更多模态上实践这一范式，针对语言反馈赋能全模态对齐开展更具实证性的研究。

![](/images/jueJin/e47f5369dfb146b.png)

**基于 Align-Anything 框架**

**实现 Llama-3.1 的模态增加**

Align-Anything 提供了一套全面的工具和教程，用于构建和训练基于 Llama 的多模态语言模型。项目提供了整合视觉（CLIP）和听觉（CLAP）模态的详细教程，涵盖从模型构建、分阶段训练到多数据集联合训练的高级技巧。

项目同时也开源了构建后的模型参数和使用示例。该实例旨在帮助开发者基于自身的私有数据构建和定制多模态大语言模型。

部分测试样例结果为：

![](/images/jueJin/482010a6be5c4df.png)

**基于 Align-Anything 框架**

**实现 Chameleon 全模态激活与对齐**

北大对齐小组基于 Meta 的 Chameleon-7B，使用了 laion-art 数据集激活了 Chameleon 模型的图像生成能力，并开源了以这个方式训练得到的 AA-Chameleon-7B-Base 模型。他们随后使用 Align-Anything 数据集的图文联合数据对该模型进行对齐，开源了 AA-Chameleon-7B-Plus 模型。

同时，北大对齐小组也开源了首个对 Chameleon 进行图文模态输入 / 输出的 DPO 与 PPO 两大经典对齐算法的实现。

对齐过程中，北大对齐小组选用了包含指令跟随、物理规律、文字清晰度、图像美学性、模态联动和信息丰富程度等多维度的偏好数据，达到了较好的效果。对齐后模型的文生图能力和图文联合输入 / 输出能力都有较大的提升：

![](/images/jueJin/30ba1359862a48b.png)

在图文联合输入 / 输出评测中，对齐后模型和对齐前模型比较，GPT-4o 评测胜率超过 80%。以下为对齐前后的一些实例比较：

![](/images/jueJin/543cb9301e6647b.png)

**基于 Align-Anything 框架**

**对 Llama-3.2-11B-Vision**

**进行指令跟随对齐**

Llama-3.2-11B-Vision 是最新 Llama-3.2 系列中以图文问答见长的模型，北大对齐小组使用他们提出的 Align-Anything-Instruct 数据集对该模型进行了细致的指令微调，得到了 Beaver-Vision-11B。

![](/images/jueJin/ebc5fb39da454c4.png)

该模型在多个开源评测榜上超越了 Meta 官方发布的指令微调版本 Llama-3.2-11B-Vision-Instruct，表现出了更强的指令跟随能力与图像识别能力。

![](/images/jueJin/129e4e67b7574ad.png)