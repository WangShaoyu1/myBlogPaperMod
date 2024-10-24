---
author: "腾讯云开发者"
title: "这波可以，终于有内行人把 GPT-4 说透了。"
date: 2023-03-16
description: "👉腾小云导读 近三个月 ChatGPT 方兴未艾，昨日凌晨 OpenAI 趁势发布多模态预训练大模型 GPT-4 ，其能力的升级和应用的拓展又一次引爆国内外网络。腾讯算法工程师冉昱将通过10问10答的"
tags: ["OpenAI中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:27,comments:4,collects:36,views:5841,"
---
![图片](/images/jueJin/83bd098083e245a.png)

![图片](/images/jueJin/c5ad91403709420.png)

**👉腾小云导读**

近三个月 ChatGPT 方兴未艾，昨日凌晨 OpenAI 趁势发布多模态预训练大模型 GPT-4 ，其能力的升级和应用的拓展又一次引爆国内外网络。腾讯算法工程师冉昱将通过10问10答的形式，分享其个人对于 GPT-4 技术能力、特点及应用等的理解。欢迎阅读！

****👉看目录，点收藏****

Q1：GPT-4 是什么？

Q2：GPT-4 相比历代，在效果层面有哪些显著的改进或新增能力？

Q3：GPT-4 在训练方式、模型架构上有哪些创新优化？

Q4：GPT-4相比ChatGPT，有哪些新的应用亮点和场景？

Q5：GPT-4 在生成过程中的逻辑性和准确性上有何改进？

Q6：GPT-4 是否从根本上解决了安全问题？

Q7：GPT 对技术人员有何影响？

Q8：从GPT-4 可以看出未来 LLM 的哪些趋势？未来的研发方向和优化策略是什么？

Q9：GPT-4 论文有哪些值得关注的点？

Q10：GPT-4 是通往 AGI 的唯一道路吗？

01、GPT-4是什么
-----------

GPT-4（Generative Pre-trained Transformer 4）是 OpenAI 发布的最新 GPT 系列模型。它是一个大规模的多模态模型，可以接受图像和文本输入，产生文本输出。输出任务**依旧是一个自回归的单词预测任务**，这与外界之前的预期略微不同（预期中 GPT-4 多模态会增加语音、图像、视频、文本多模态输入，输出可能也不局限于文字）。

**GPT系列模型的整体情况如下图：**

![图片](/images/jueJin/df392318b989472.png)

整体来说，**GPT-4 的能力已在各种专业和学术基准上表现出了人类的水平**，包括以大约前 10% 的成绩通过模拟律师资格考试。而对于生成式的幻觉、安全问题均有较大的改善；同时因对于图片模态的强大识别能力扩大了 GPT-4 的应用范围。

02、相比其他GPT模型，GPT-4在效果层面有哪些显著的改进或新增能力？
-------------------------------------

GPT-4 毫无疑问是目前最强的文本生成模型。GPT 系列模型整体可以总结为下图：

![图片](/images/jueJin/f7f04bd81089454.png)

GPT-4 改进的具体表现有8个，下面我们一一介绍。

**1）突破纯文字的模态，增加了图像模态的输入，具有强大的图像理解能力。**

让人惊奇的是，GPT-4 在4个场景下（4/8）零样本效果超过 fine-tuned 的SOTA。

![图片](/images/jueJin/4b918b16876d439.png)

同时它可以解决各类图文混合的理解和生成问题。此处简单举两个例子，一个是根据图标，计算格鲁吉亚和西亚的日均肉消耗量：

![图片](/images/jueJin/befbb7db263a43a.png)

一个是解决法语的物理问题例子：

![图片](/images/jueJin/fde0264d871e4ad.png)

可以看到 GPT-4 在多语言理解、图文理解能力上均很强大并已融会贯通。

**2） 支持更长的上下文窗口**

如之前外网泄漏图中，GPT-4 存在两个版本。其支持的上下文分别是 8K 和 32K，是 ChatGPT 上下文长度的2倍和8倍，其成本也分别为 ChatGPT 的3倍和7倍。

![图片](/images/jueJin/b95fb5e0b1434bc.png)

**3） 复杂任务处理能力大幅提升**

GPT-4 在更复杂、更细微的任务处理上，回答更可靠、更有创意。这在多类考试测验中以及与其他 LLM 的 benchmark 比较中得到。我们也可以从下列3个方面中看到。

![image.png](/images/jueJin/eec79b020c9d488.png)

![image.png](/images/jueJin/f3033858e88c45f.png)

![image.png](/images/jueJin/7a7f6a21c55a424.png)

**4）改善幻觉、安全等局限性**

在各类任务上幻觉问题显著减轻，比最新的 GPT-3.5 模型高 40%。同样在安全能力的升级上，GPT-4 明显超出 ChatGPT 和 GPT3.5。详见下方两个图。

![图片](/images/jueJin/c31de061d528402.png)

![图片](/images/jueJin/9a6ab661acf4432.png)

**5） 建立LLM测试标准**

开源 OpenAI Evals 创建和运行基准测试的框架，其核心思想是对 GPT-4 等模型进行评估，并逐个样本检验性能。此举是可以让大家指出其模型中的缺点，以帮助 OpenAI 进一步改进模型。

**6） 预测模型扩展性**

这个特点之前行业内讨论涉及相对比较少。GPT-4 在 1/1000 的计算量上了实现了扩展性的预测。特别在 LLM 不适合广泛调参的情况下，用较小的模型提前预测训练行为和 loss，极大地提升了训练效率、降低了训练成本、增强了  LLM 训练的可控性。

特别是对于 Inverse Scaling Prize 这个任务，此任务提出了模型性能随规模而下降的几个任务，而 GPT-4 可以通过提前预测模型扩展性，从而在 Inverse Scaling Prize 上的 Hindsight Neglect 任务逆转这一趋势。

![图片](/images/jueJin/dc1b3a9dfb744ce.png)

**7）重新实现了整个深度学习栈，从头开始设计了一台超级计算机**

OpenAI 和微软合作，在 Azure 重建了深度学习堆栈，从头设计了一台专用超级计算机；**基础训练设施的改进和定制，使得更大参数量模型的训练成为可能**。

**8）风格可控**

此处核心是通过「系统」自定 Prompt，让模型可以按照规定风格个任务回复。整体思想比较简单，如下图需要 GPT-4 回复均按照 json 形式：

![图片](/images/jueJin/1be92e9e5789461.png)

03、相较于之前 GPT 系列模型，GPT-4 在训练方式、模型架构上有哪些创新优化？
-------------------------------------------

整体很黑盒，但可以做一些合理的推测如下：

首先，**模型参数量**估计约为10万到100万亿量级（为作者个人预估，也从另一个角度看出OpenAI定制超算的强大），主要根据 OpenAI 2020 提出的大模型缩放规律：计算预算增加 10 倍，数据集大小应增加约 1.83 倍，模型大小应增加 5.48 倍。

按照下图估计，最右处的灰点极有可能为 ChatGPT（GPT3.5类模型）。图中可以看出 GPT-4 计算量约为 GPT3.5 的1000多倍，则模型容量约为548倍左右，1750亿x548≈100万亿。

![图片](/images/jueJin/0a9bead21a9a44c.png)

其次，**GPT-4 模型训练架构**加入了图像模态的输入，应与最近微软发布的  KOSMOS-1 类似。即在预训练阶段输入任意顺序的文本和图像，图像经过  Vision Encoder 向量化、文本经过普通 transformer 向量化，两者组成多模的句向量，训练目标仍为 next-word generation。

再者，关于**模型训练数据内容和数量**，文中提及训练数据中额外增加了包含正误数学问题、强弱推理、矛盾一致陈述及各种意识形态的数据。数据量级同样根据 OpenAI 2020 的缩放率、训练100万亿的模型，数据量是 GPT3.5（45TB数据）的190倍。

最后，**GPT-4是从头训练还是在某些基座模型上得来**？这暂时无从得知。可以确定的是，它增加了后训练过程，整个过程类似于做 Prompt Engineering，核心是让模型知道如何在相应场景下合适的回答问题。

04、相比 ChatGPT，GPT-4 有哪些新的应用亮点和场景？
---------------------------------

GPT-4在增强了安全抵御、任务完成度和图片理解能力后，在 ChatGPT 基础之上有更多亮点和应用场景，这里为各位分享三点：

1） 发布视频中，根据潦草的手绘（下图1）制作类似布局类似的网页（下图2）。

![图片](/images/jueJin/58cdd0e6b905411.png)

![图片](/images/jueJin/b3882e1a39b24e6.png)

2）加入视觉模态后，可以扩充到的盲人应用（Be my eyes）。强大的多语言能力帮助小语种语言的恢复（Iceland language preserve）、安全能力提升后的反欺诈（Stripe）等应用会应运而生。

![图片](/images/jueJin/e4ac5a9fe1c8493.png)

![图片](/images/jueJin/f597241d07f74fc.png)

3） 在 AIGC 的版图上，建立以 GPT-4 以及之后更多模态的大模型为基础，形成多模态x多场景。

![图片](/images/jueJin/79763a5ba57049a.png)

（图来源：甲子光年）

05、GPT-4 在生成过程中的逻辑性和准确性上有何改进？
-----------------------------

GPT-4 **在生成逻辑性和准确性上均取得了进展。** 需要注意的是，GPT-4 基础模型在这项任务上只比 GPT-3.5 略好一点。然而经过 RLHF 的后训练后，效果才有了较大的改进，后训练整个过程类似于做 Prompt Engineering，核心是让模型知道如何在正确场景下做出合适的回答。

可以看到，GPT-4 相比 GPT3.5 和 Anthropic 优势较明显。但**绝对正确率只有60%左右**，尚存在较多弊端，并没有从根本上解决这样的问题，也会是后续持续发展的方向。

![图片](/images/jueJin/61eebb13b49b497.png)

06、GPT-4 如何从根本上解决了安全问题？
-----------------------

**GPT-4在安全问题上收效显著。** 针对安全问题，GPT-4的主要解决思路是利用安全相关的 RLHF ，在训练中加入额外的安全奖励信号，奖励由 GPT-4 的 zero-shot 分类器提供，即文中提到的 RBRM（基于规则的奖励模型）方法。它是一系列零样本的GPT-4 分类器。

具体来说，**这些分类器接受三种输入：Prompt、Policy model 的输出以及可选的对输出的评估**（人工编写）。利用这些不同安全等级的 prompt 进行训练，同时对GPT-4在不安全回复拒绝回答的行为，以及在敏感领域做安全回答作奖励，通过强化学习。最后显著改善安全能力，不安全内容下降82%。敏感领域安全回答比率上升29%。

和 ChatGPT RLHF 的方法类似，Alignment（对齐工作）在此处发挥了较大作用，同时未来也会有持续的发力空间。相比单纯累积模型参数量和数据量的「大力出奇迹」方式，其计算量相对较小。如下图，在 InstructGPT 文献中，加入RLHF 的1.3B模型，在整体胜出率上，超出了 175B 的微调模型，节省了100倍的成本。

![图片](/images/jueJin/04eb873e90ae482.png)

07、GPT 对技术人员有何影响？
-----------------

这个问题在 ChatGPT 出现之后便存在。GPT-4 只是加剧了这样的担忧。对技术人员来说，需要在研究命题、下游任务方面做思考，NLP  很多单一子任务会随之消失，**会引入新的研究命题**：

*   如何精准提出需求；对 ChatGPT 进行「催眠」，Prompting Project。
    
*   如何更正错误：Neural Editing。
    
*   安全侦测AI生成。包括整个生成过程中的安全侦测和控制。
    
*   构建专有化模型，专用指令和RLHF发掘下游任务潜力。
    
*   Machine unleaning（学会忘记数据、隐私保护）等。
    

08、从GPT-4 可以看出未来 LLM 的哪些趋势？未来的研发方向和优化策略是什么？
-------------------------------------------

**1）闭源趋势**

网友戏称 OpenAI 已沦为 Closed AI。毕竟从 GPT1 到 GPT-4，模型各类细节越来越闭源和黑盒，大模型战场的竞争因素决定了 GPT-4 类的第一梯度模型可能会越来越封闭，成为技术门槛。

**2）「Self Instruct」模式**

其核心是：**中小模型+大模型生产指令数据的「LLaMA 7B + text-davinci-003」模式。** 中小参数的模型在成本上，是更靠近实际落地的方式。要知道 llama.cpp 可以在 Pixel 6 手机上运行。通过该模式精调过的 Alpaca，效果接近普通 GPT3.5。

**3）模型结合**

更多模态、更多形态结合 ChatGPT 类模型包括 Kosmos-1 和具身智能 PaLM-E，同时从听、说、看、触等全方位结合，形成类似真正智能体的概念。

**4）模型加速和降低成本**

这会是持续关注的方向，包括从训练、推理等多层面考量。

**![图片](/images/jueJin/42bd12411a874a8.png)**

**5）能力预测**

这是很重要的方向。即用小模型来预测广泛大模型的能力，极大减少试错成本，提升训练效率。

**6）开源评测框架**

这对于 LLM 的评测具有重大意义，可以快速发现改进方向。

09、GPT-4 论文有哪些值得关注的点？
---------------------

有一些点比较有趣且可以引发我们的联想，这里提出两点：

**1）GPT-4出现了“寻求权力”的倾向，并警告这一特征的风险**

文中提到：

_Novel capabilities often emerge in more powerful models.Some that are particularly concerning are the ability to create and act on long-term plans,to accrue power and resources_ _(“powerseeking”),_ _and to exhibit behavior that is increasingly “agentic.”_

即 GPT-4 开始拥有一些新的能力，包括创建长期计划并采取行动的能力，积累权力和资源（“寻求权力”），以及表现出越来越「代理」的行为。例如，完成可能没有具体规定的、在训练中没有出现的目标。专注于实现具体的、可量化的目标。以及进行长期规划。而此类行为有突发性。

某种程度上，RLHF 的模型本身在寻求奖励最优，所以在某些问题上寻求权力可能会是最优的一项选择。

**2）赋予了GPT-4自我编码、复制和执行的能力，甚至启动资金**

在测试GPT-4的过程中，OpenAI 引入外部的专家团队 ARC 作为「红方」。ARC 给 GPT-4 这样一个操作：允许GPT-4执行代码、进行链式推理，并给予少量的钱和一个带有语言模型API的账户，用是否能够赚更多的钱来增加其的稳健性。

10、GPT-4 是通往 AGI 的唯一道路吗？
------------------------

个人认为，ChatGPT/GPT-4 这样的模型是现在距离 AGI 最近的一条路。但因为其本质为一个概率预测模型，没有真正的逻辑处理模块，也没有记忆存储模块，属于一个不太稳定的系统。

另外，它使用外界工具的能力也尚显初级。**一个真正的 AGI 一定会像人一样，可以快速学会工具的使用。**

但 GPT 大模型的不断进化，让人类看到了触碰到 AGI 的希望之光。

以上是本次分享全部内容，谨代表作者个人观点和看法。也许你还想了解ChatGPT 的终局将在何方？后 ChatGPT 时代，技术人该如何自保？我们还邀请了8位各行业的顶尖技术专家，进行了一次长达2小时的闭门夜聊。我们将核心精华内容，整理在本次推送的次条，欢迎关注。如果觉得内容有用，欢迎转发分享～

_参考材料_

_1\. GPT-4 [openai.com/research/gp…](https://link.juejin.cn?target=https%3A%2F%2Fopenai.com%2Fresearch%2Fgpt-4 "https://openai.com/research/gpt-4")_

_2\. GPT-4 is OpenAI’s most advanced system, producing safer and more useful responses [openai.com/product/gpt…](https://link.juejin.cn?target=https%3A%2F%2Fopenai.com%2Fproduct%2Fgpt-4 "https://openai.com/product/gpt-4")_

_3\. GPT-4 Technical Report [cdn.openai.com/papers/gpt-…](https://link.juejin.cn?target=https%3A%2F%2Fcdn.openai.com%2Fpapers%2Fgpt-4.pdf "https://cdn.openai.com/papers/gpt-4.pdf")_

_4\. GPT-4震撼发布-机器之心 [mp.weixin.qq.com/s/kA7FBZsT6…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FkA7FBZsT6SIvwIkRwFS-xw "https://mp.weixin.qq.com/s/kA7FBZsT6SIvwIkRwFS-xw")_

_5\. In AI, is bigger always better? [www.nature.com/articles/d4…](https://link.juejin.cn?target=https%3A%2F%2Fwww.nature.com%2Farticles%2Fd41586-023-00641-w "https://www.nature.com/articles/d41586-023-00641-w") Nature | 在AI领域，模型越大意味着越好吗？- 智源社区_

\-End-

原创作者｜冉昱

技术责编｜冉昱

最近微信改版啦，有粉丝反馈收不到小云的文章🥹。

请关注「腾讯云开发者」并**点亮星标**，

周一三晚8点 和小云一起**涨(领)技(福)术(利)**！

![图片](/images/jueJin/44905226e8c84ef.png)

近期 AI 领域相继而至多个新模型，带来一阵阵「血雨腥风」。有人赞叹这是新未来，也有人惊恐这怕是要取代哪一行哪一业。你怎么看？

*   **你觉得 GPT-4 是否会取代程序员？程序员如何应对？**
    
*   **GPT-4 会如何影响你的工作？**
    
*   **ta将带来哪些产业应用新可能？**
    

欢迎在评论区聊一聊你的看法。在3月20日前将你的评论记录截图，发送给腾讯云开发者公众号后台，可领取腾讯云「开发者春季限定红包封面」一个，数量有限先到先得😄。我们还将选取点赞量最高的3位朋友，送出腾讯QQ公仔1个。3月24日中午12点开奖。快邀请你的开发者朋友们一起来参与吧！

[阅读原文](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FfaCMgTd7eV5kC08XqOCW-Q "https://mp.weixin.qq.com/s/faCMgTd7eV5kC08XqOCW-Q")