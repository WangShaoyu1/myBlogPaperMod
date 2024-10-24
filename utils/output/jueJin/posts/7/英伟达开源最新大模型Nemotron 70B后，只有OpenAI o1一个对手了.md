---
author: "机器之心"
title: "英伟达开源最新大模型Nemotron 70B后，只有OpenAI o1一个对手了"
date: 2024-10-17
description: "今天，英伟达又开源了一个性能超级强大的模型 —— Llama-31-Nemotron-70B-Instruct 英伟达不仅要做显卡领域的领先者，还要在大模型领域逐渐建立起自己的优势。

今天，英伟达又开源了一个性能超级强大的模型 —— Llama-31-Nemotron-70B-Instruct，它击败了 Ope"
tags: ["人工智能","Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:76,"
---
> 英伟达不仅要做显卡领域的领先者，还要在大模型领域逐渐建立起自己的优势。

今天，英伟达又开源了一个性能超级强大的模型 —— Llama-3.1-Nemotron-70B-Instruct，它击败了 OpenAI 的 GPT-4o 等闭源模型和 Anthropic 的 Claude-3.5 sonnet 等开源模型。

从命名来看，显然 Llama-3.1-Nemotron-70B-Instruct 是基于 Llama-3.1-70B 打造而成。

![](/images/jueJin/1e6bfdbc6426441.png)

从下图中大模型榜单可以看到， Llama-3.1-Nemotron-70B-Instruct 的性能仅次于 OpenAI 最新 o1 大模型了。

![](/images/jueJin/63c66d49ecf5435.png)

_图源：[x.com/itsPaulAi/s…](https://link.juejin.cn?target=https%3A%2F%2Fx.com%2FitsPaulAi%2Fstatus%2F1846565333240607148 "https://x.com/itsPaulAi/status/1846565333240607148")_

目前，Llama-3.1-Nemotron-70B-Instruct 已经可以在线体验了。Starwberry 中有几个 r 这样的题目难不倒它。

![](/images/jueJin/ab892bfcd456489.png)

_图源：[x.com/mrsiipa/sta…](https://link.juejin.cn?target=https%3A%2F%2Fx.com%2Fmrsiipa%2Fstatus%2F1846551610199273817 "https://x.com/mrsiipa/status/1846551610199273817")_

不过有时也一本正经地胡说八道，比如「2.11 和 2.9 哪个大」。

![](/images/jueJin/2c154bf80f87475.png)

体验地址：[huggingface.co/chat/](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fchat%2F "https://huggingface.co/chat/")

不过英伟达也强调了，他们主要是提高模型在通用领域的性能，尚未针对数学等专业领域的表现进行调优，或许等待一段时间，模型就可以正确回答 2.11 和 2.9 哪个大了。

此外，英伟达还开源了 Nemotron 的训练数据集 HelpSteer2，包括如下：

*   构建了 21362 个提示响应，使模型更符合人类偏好，也更有帮助、更符合事实、更连贯，并且可以根据复杂度和详细度进行定制；
    
*   构建了 20324 个用于训练的提示响应，1038 个用于验证。
    

![](/images/jueJin/3424e235020d4c5.png)

_数据集地址：[huggingface.co/datasets/nv…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fdatasets%2Fnvidia%2FHelpSteer2 "https://huggingface.co/datasets/nvidia/HelpSteer2")_

除了 Llama-3.1-Nemotron-70B-Instruct 之外，英伟达还开源了另一个 Llama-3.1-Nemotron-70B-Reward 模型。

![](/images/jueJin/f4900238ef7b4d7.png)

模型合集地址：[huggingface.co/collections…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fcollections%2Fnvidia%2Fllama-31-nemotron-70b-670e93cd366feea16abc13d8 "https://huggingface.co/collections/nvidia/llama-31-nemotron-70b-670e93cd366feea16abc13d8")

**模型介绍**

Llama-3.1-Nemotron-70B-Instruct 是英伟达定制的大型语言模型，旨在提高 LLM 生成的响应的有用性。

Llama-3.1-Nemotron-70B-Instruct 在 Arena Hard 基准上得分为 85.0，在 AlpacaEval 2 LC 基准上得分为 57.6，在 GPT-4-Turbo MT-Bench 基准上得分为 8.98。

![](/images/jueJin/a773697d6df34e0.png)

截至 2024 年 10 月 1 日，Llama-3.1-Nemotron-70B-Instruct 在三个自动对齐基准中均排名第一，击败了 GPT-4o 和 Claude 3.5 Sonnet 等强大的前沿模型。

对于这一成绩，有网友表示，在 Arena Hard 基准上拿到 85.0 分，对于一个 70B 的模型来说，确实是件大事。

![](/images/jueJin/54451caa5224490.png)

还有网友讨论说，用相同的提示测试 GPT-4o 和英伟达模型，所有的答案都是英伟达的模型好，并且是好很多的那种。

![](/images/jueJin/6ff83aefc61749e.png)

「加大题目难度，Llama-3.1-Nemotron-70B-Instruct 照样回答的很好。」

![](/images/jueJin/d2a04fc7648d4f9.png)

在训练细节上，该模型在 Llama-3.1-70B-Instruct 基础上使用了 RLHF 技术（主要是 REINFORCE 算法），并采用了 Llama-3.1-Nemotron-70B-Reward 和 HelpSteer2 偏好提示作为初始训练策略。

此外，Llama-3.1-Nemotron-70B-Reward 是英伟达开发的一个大型语言模型，用于预测 LLM 生成的响应的质量。该模型使用 Llama-3.1-70B-Instruct Base 进行训练，并结合了 Bradley Terry 和 SteerLM 回归奖励模型方法。

Llama-3.1-Nemotron-70B-Reward 在 RewardBench 榜单的 Overall 排名中表现最佳，并在 Chat（聊天）、Safety（安全）和 Reasoning（推理）排名中也有出色表现。

![](/images/jueJin/5e48ebce2ee449b.png)

不过，想要部署该模型还需要一些先决条件，至少需要一台带有 4 个 40GB 或 2 个 80GB NVIDIA GPU 的机器，以及 150GB 的可用磁盘空间。想要尝试的小伙伴跟着官方给出的步骤进行部署即可。

_参考链接：_

_[huggingface.co/nvidia/Llam…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fnvidia%2FLlama-3.1-Nemotron-70B-Instruct "https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Instruct")_

_[huggingface.co/nvidia/Llam…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fnvidia%2FLlama-3.1-Nemotron-70B-Reward "https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Reward")_