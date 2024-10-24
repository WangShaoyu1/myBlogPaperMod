---
author: "机器之心"
title: "Grok-2 来了，能生图识图、性能比肩 GPT-4o，马斯克：发展猛如火箭"
date: 2024-08-14
description: "北京时间周三下午，xAI 正式发布了新一代 Grok 2 大模型。 第三方大模型基准组织 Chatbot Arena 也立即更新了 LMSYS 榜的成绩列表。"
tags: ["人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:108,"
---
> GPT-5 不出，Grok 已经赶上了。

就在谷歌与 OpenAI 互相抢新闻的同一天，马斯克旗下的 xAI 也没有闲着。

北京时间周三下午，xAI 正式发布了新一代 Grok 2 大模型。

![](/images/jueJin/73a48f84f8634a7.png)

第三方大模型基准组织 Chatbot Arena 也立即更新了 LMSYS 榜的成绩列表。Grok 2 的早期型号（sus-column-r）紧随 GPT-4o（0513 版）之后可以位列第四，表现优于 Claude 3.5 Sonnet 和 GPT-4-Turbo。

它在编码、复杂问题和数学方面表现出色。

![](/images/jueJin/2871766ab1e243f.png)

‍![](/images/jueJin/4181693fda21438.png)

马斯克不免自夸起来，「Grok 的推进速度像坐了火箭。」

![](/images/jueJin/e22622972f67429.png)

注意，这只是早期版本的分数，Chatbot Arena 表示后续还会测试一下正式版。

马斯克表示，Grok-2 是具有最先进推理能力的先进语言模型。新一代包括两个版本：Grok-2 和 Grok-2 mini。两种模型现在都在 X 平台上向 Grok 用户发布。目前，X Premium 和 Premium+ 用户已经可以体验 Grok-2 和 Grok-2 mini 这两种模型。

相比此前的 Grok-1.5，Grok-2 的早期预览版实现了重大进步，在聊天、推理、代码等方面展示出了领先的能力。xAI 表示，Grok-2 和 Grok-2 mini 目前正在 X 上处于测试阶段，将在本月晚些时候通过企业 API 的方式提供。

新模型发布后不到半小时，已经有网友在晒使用效果了，他使用 Grok 2 mini 生成了一张「我与马斯克吃热狗」的图像。

![](/images/jueJin/c39a7d3c200f42d.png)

![](/images/jueJin/a725751648ba40a.png)

再试试其他的生成一张华盛顿的画像。

![](/images/jueJin/dc27ae5dae364e7.png)

也有人试了试 Grok 2 mini，生成一只飞猫。

![](/images/jueJin/651718a4e408442.png)

还有人生成了特斯拉 Model Y，看起来挺像的？

![](/images/jueJin/cfc06aa21ab1431.png)

**Grok-2 性能大 PK**

随着 xAI 将 Grok-2 的早期版本「sus-column-r」放入到 Chatbot Arena，我们看到了它与其他流行开闭源模型的性能比较。

就总体的 Elo 得分而言，Grok-2 的表现要优于 Claude 系列模型和大多版本的 GPT-4。当然，排在第一位的是 OpenAI 这几天刚放出的 GPT-4o（8 月 8 日版本）。

![](/images/jueJin/3ccf6c4e470b416.png)

下图为 Grok-2 与其他流行模型的胜率（Win Rate）比较。

![](/images/jueJin/927cda6b98ec481.png)

下图为 Grok 1.5 与 Grok 2 两个版本基于事实性的胜率比较。

![](/images/jueJin/376505d9cc234eb.png)

xAI 采取这样的流程来对 Grok 2 模型进行评估，利用 AI Tutors 在各种任务中与模型真实互动。在每次互动过程中，Grok 2 都会向 AI Tutors 提供两个响应，然后根据指南中列出的特定标准选择最佳响应。

xAI 专注于在两个关键领域评估模型性能， 分别是指令遵循和提供准确、真实的信息。结果显示，Grok 2 在利用检索到的内容进行推理以及使用工具的能力方面有了显著的进步，比如正确地识别缺失信息、通过事件序列进行推理、丢弃不相关的帖子等。

**基准测试成绩**

xAI 通过一系列学术基准对 Grok-2 模型进行了评估，这些基准包括推理、阅读理解、数学、科学和编码。

Grok-2 和 Grok-2 mini 都比之前的 Grok-1.5 模型有了显著改进。在研究生水平的科学知识 (GPQA)、常识 (MMLU、MMLU-Pro) 和数学竞赛问题 (MATH) 等领域的表现可与其他前沿模型相媲美。

此外，Grok-2 在基于视觉的任务方面表现也很出色，在视觉数学推理 (MathVista) 和基于文档的问答 (DocVQA) 方面性能显著。

![](/images/jueJin/149203fa026e44c.png)

**Grok 2 界面和功能「大变身」**

过去几个月，xAI 一直不断地提升 x 平台上的 Grok 体验。现在，随着下一代 Grok 2 的推出，xAI 重新设计了界面，如下图所示。

![](/images/jueJin/730e9e9f92b845d.png)

当然，xAI 提供了一些新功能，比如 Conway《生命游戏》的简单实现。

![](/images/jueJin/240db72839b64ae.png)

再比如多模态理解能力（看图说话）。

![](/images/jueJin/e5262a7dbc5c4bb.png)

其中，Grok-2 是 xAI 最先进的 AI 助手，拥有文本和视觉理解功能，并集成了来自 X 平台的实时信息，可通过 X 应用程序中的 Grok 选项卡访问。

Grok-2 mini 是一款小巧但功能强大的模型，在速度和答案质量之间取得了很好平衡。

![](/images/jueJin/d386ad5bacf74f4.png)

与其前代产品相比，Grok-2 更直观、更可控、更灵活，适用于各种任务，无论你是在寻找答案、协作写作还是解决编码任务。

此外，xAI 还与初创公司 [Black Forest Labs](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650928796%26idx%3D1%26sn%3Df1e04e0d0308a888831d93ca6ec57417%26chksm%3D84e432e2b393bbf4c7ebf5f6962899504f2c167a59bcfe8b6c7d62619f41b228a97fffb67639%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650928796&idx=1&sn=f1e04e0d0308a888831d93ca6ec57417&chksm=84e432e2b393bbf4c7ebf5f6962899504f2c167a59bcfe8b6c7d62619f41b228a97fffb67639&scene=21#wechat_redirect") 展开合作，试验他们的 FLUX.1 模型，以扩展 Grok 在 X 上的功能。

![](/images/jueJin/273721b15df8412.png)

本月晚些时候， xAI 还将通过新的企业 API 平台向开发人员发布 Grok-2 和 Grok-2 mini。即将推出的 API 建立在新的定制技术堆栈上，允许多区域推理部署，以实现全球低延迟访问。

当然，xAI 还提供了一些增强的安全功能，例如强制性多因素身份验证（例如使用 Yubikey、Apple TouchID 或 TOTP）。

可以看到，自 2023 年 11 月推出 Grok-1 以来，xAI 一直以惊人的速度推进该系列模型。很快，他们将发布具有多模态理解的预览版。xAI 之后的重点将是通过新的计算集群来提高模型的核心推理能力。

_博客地址：[x.ai/blog/grok-2](https://link.juejin.cn?target=https%3A%2F%2Fx.ai%2Fblog%2Fgrok-2 "https://x.ai/blog/grok-2")_