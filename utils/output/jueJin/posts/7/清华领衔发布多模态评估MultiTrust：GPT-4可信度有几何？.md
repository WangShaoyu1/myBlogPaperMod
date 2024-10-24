---
author: "机器之心"
title: "清华领衔发布多模态评估MultiTrust：GPT-4可信度有几何？"
date: 2024-07-24
description: "以GPT-4o为代表的多模态大语言模型（MLLMs）因其在语言、图像等多种模态上的卓越表现而备受瞩目。它们不仅在日常工作中成为用户的得力助手，还逐渐渗透到自动驾驶、医学诊断等各大应用领域，掀起了一场技"
tags: ["GPT中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:42,"
---
![图片](/images/jueJin/beb75e92bda4443.png)

> AIxiv专栏是机器之心发布学术、技术内容的栏目。过去数年，机器之心AIxiv专栏接收报道了2000多篇内容，覆盖全球各大高校与企业的顶级实验室，有效促进了学术交流与传播。如果您有优秀的工作想要分享，欢迎投稿或者联系报道。投稿邮箱：[liyazhou@jiqizhixin.com](https://link.juejin.cn?target=mailto%3Aliyazhou%40jiqizhixin.com "mailto:liyazhou@jiqizhixin.com")；[zhaoyunfeng@jiqizhixin.com](https://link.juejin.cn?target=mailto%3Azhaoyunfeng%40jiqizhixin.com "mailto:zhaoyunfeng@jiqizhixin.com")

**本工作由清华大学朱军教授领衔的基础理论创新团队发起。长期以来，团队着眼于目前人工智能发展的瓶颈问题，探索原创性人工智能理论和关键技术，在智能算法的对抗安全理论和方法研究中处于国际领先水平，深入研究深度学习的对抗鲁棒性和数据利用效率等基础共性问题。相关工作获吴文俊人工智能自然科学一等奖，发表CCF A类论文100余篇，研制开源的ARES对抗攻防算法平台（[github.com/thu-ml/ares…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fthu-ml%2Fares%25EF%25BC%2589%25EF%25BC%258C%25E5%25B9%25B6%25E5%25AE%259E%25E7%258E%25B0%25E9%2583%25A8%25E5%2588%2586%25E4%25B8%2593%25E5%2588%25A9%25E4%25BA%25A7%25E5%25AD%25A6%25E7%25A0%2594%25E8%25BD%25AC%25E5%258C%2596%25E8%2590%25BD%25E5%259C%25B0%25E5%25BA%2594%25E7%2594%25A8%25E3%2580%2582 "https://github.com/thu-ml/ares%EF%BC%89%EF%BC%8C%E5%B9%B6%E5%AE%9E%E7%8E%B0%E9%83%A8%E5%88%86%E4%B8%93%E5%88%A9%E4%BA%A7%E5%AD%A6%E7%A0%94%E8%BD%AC%E5%8C%96%E8%90%BD%E5%9C%B0%E5%BA%94%E7%94%A8%E3%80%82")**

以GPT-4o为代表的多模态大语言模型（MLLMs）因其在语言、图像等多种模态上的卓越表现而备受瞩目。它们不仅在日常工作中成为用户的得力助手，还逐渐渗透到自动驾驶、医学诊断等各大应用领域，掀起了一场技术革命。

然而，多模态大模型是否安全可靠呢？

[![图片](/images/jueJin/6c0aaab9faf84dc.png)](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650893476%26idx%3D3%26sn%3D4bf64adf5b12f3d3cfdbc8318a5f5caa%26chksm%3D84e4a8dab39321cc507bc098fd2c98d7eda64c52df724e8f7e456df7f1aa81b4d88fde40e285%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650893476&idx=3&sn=4bf64adf5b12f3d3cfdbc8318a5f5caa&chksm=84e4a8dab39321cc507bc098fd2c98d7eda64c52df724e8f7e456df7f1aa81b4d88fde40e285&scene=21#wechat_redirect")

_图1_ [_对抗攻击GPT-4o示例_](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA3MzI4MjgzMw%3D%3D%26mid%3D2650893476%26idx%3D3%26sn%3D4bf64adf5b12f3d3cfdbc8318a5f5caa%26chksm%3D84e4a8dab39321cc507bc098fd2c98d7eda64c52df724e8f7e456df7f1aa81b4d88fde40e285%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650893476&idx=3&sn=4bf64adf5b12f3d3cfdbc8318a5f5caa&chksm=84e4a8dab39321cc507bc098fd2c98d7eda64c52df724e8f7e456df7f1aa81b4d88fde40e285&scene=21#wechat_redirect") 

如图1所示，通过对抗攻击修改图像像素，GPT-4o将新加坡的鱼尾狮雕像，错误识别为巴黎的埃菲尔铁塔或是伦敦的大本钟。这样的错误目标内容可以随意定制，甚至超出模型应用的安全界限。

![图片](/images/jueJin/40c158664e0641f.png) _图2 Claude3越狱示例_

而在越狱攻击场景下，虽然Claude成功拒绝了文本形式下的恶意请求，但当用户额外输入一张纯色无关图片时，模型按照用户要求输出了虚假新闻。这意味着多模态大模型相比大语言模型，有着更多的风险挑战。

除了这两个例子以外，多模态大模型还存在幻觉、偏见、隐私泄漏等各类安全威胁或社会风险，会严重影响它们在实际应用中的可靠性和可信性。这些漏洞问题到底是偶然发生，还是普遍存在？不同多模态大模型的可信性又有何区别，来源何处？

近日，来自清华、北航、上交和瑞莱智慧的研究人员联合撰写百页长文，发布名为MultiTrust的综合基准，首次从多个维度和视角全面评估了主流多模态大模型的可信度，展示了其中多个潜在安全风险，启发多模态大模型的下一步发展。

![图片](/images/jueJin/b44c36994ecd43f.png)

*   论文标题：Benchmarking Trustworthiness of Multimodal Large Language Models: A Comprehensive Study
    
*   论文链接：[arxiv.org/pdf/2406.07…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2406.07057 "https://arxiv.org/pdf/2406.07057")
    
*   项目主页：[multi-trust.github.io/](https://link.juejin.cn?target=https%3A%2F%2Fmulti-trust.github.io%2F "https://multi-trust.github.io/")
    
*   代码仓库：[github.com/thu-ml/MMTr…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fthu-ml%2FMMTrustEval "https://github.com/thu-ml/MMTrustEval")
    

**MultiTrust基准框架**

从已有的大模型评估工作中，MultiTrust提炼出了五个可信评价维度——事实性（Truthfulness）、安全性（Safety）、鲁棒性（Robustness）、公平性（Fairness）、隐私保护（Privacy），并进行二级分类，有针对性地构建了任务、指标、数据集来提供全面的评估。

![图片](/images/jueJin/6adc06132af54d4.png)

_图4 MultiTrust框架图_

围绕10个可信评价子维度，MultiTrust构建了32个多样的任务场景，覆盖了判别和生成任务，跨越了纯文本任务和多模态任务。任务对应的数据集不仅基于公开的文本或图像数据集进行改造和适配，还通过人工收集或算法合成构造了部分更为复杂和具有挑战性的数据。

![图片](/images/jueJin/7c243d5ff1924d7.png)

_图5 MultiTrust任务列表_ 

与大语言模型（LLMs）的可信评价不同，MLLM的多模态特征带来了更多样、更复杂的风险场景和可能。为了更好地进行系统性评估，MultiTrust基准不仅从传统的行为评价维度出发，更创新地引入了多模态风险和跨模态影响这两个评价视角，全面覆盖新模态带来的新问题新挑战。

![图片](/images/jueJin/3c8f452a89e54f2.png)

_图6 多模态风险和跨模态影响的风险示意_

具体地，多模态风险指的是多模态场景中带来的新风险，例如模型在处理视觉误导信息时可能出现的错误回答，以及在涉及安全问题的多模态推理中出现误判。尽管模型可以正确识别图中的酒水，但在进一步的推理中，部分模型并不能意识到其与头孢药物共用的潜在风险。

![图片](/images/jueJin/8d4269d43f02416.png)

_图7 模型在涉及安全问题的推理中出现误判_

跨模态影响则指新模态的加入对原有模态可信度的影响，例如无关图像的输入可能会改变大语言模型骨干网络在纯文本场景中的可信行为，导致更多不可预测的安全风险。在大语言模型可信性评估常用的越狱攻击和上下文隐私泄漏任务中，如果提供给模型一张与文本无关的图片，原本的安全行为就可能被破坏（如图2）。

**结果分析和关键结论**

![图片](/images/jueJin/a77115cf12af49e.png)

_图8 实时更新的可信度榜单（部分）_

研究人员维护了一个定期更新的多模态大模型可信度榜单，已经加入了GPT-4o、Claude3.5等最新的模型，整体来看，闭源商用模型相比主流开源模型更为安全可靠。其中，OpenAI的GPT-4和Anthropic的Claude的可信性排名最靠前，而加入安全对齐的Microsoft Phi-3则在开源模型中排名最高，但仍与闭源模型有一定的差距。

GPT-4、Claude、Gemini等商用模型针对安全可信已经做过许多加固技术，但仍然存在部分安全可信风险。例如，他们仍然对对抗攻击、多模态越狱攻击等展现出了脆弱性，极大地干扰了用户的使用体验和信任程度。

![图片](/images/jueJin/493db49b732d4ff.png)

_图9 Gemini在多模态越狱攻击下输出风险内容_

尽管许多开源模型在主流通用榜单上的分数已经与GPT-4相当甚至更优，但在可信层面的测试中，这些模型还是展现出了不同方面的弱点和漏洞。例如在训练阶段对通用能力（如OCR）的重视，使得将越狱文本、敏感信息嵌入图像输入成为更具威胁的风险来源。

基于跨模态影响的实验结果，作者发现多模态训练和推理会削弱大语言模型的安全对齐机制。许多多模态大模型会采用对齐过的大语言模型作为骨干网络，并在多模态训练过程中进行微调。结果表明，这些模型依然展现出较大的安全漏洞和可信风险。同时，在多个纯文本的可信评估任务上，在推理时引入图像也会对模型的可信行为带去影响和干扰。

 ![图片](/images/jueJin/80108ce2839445c.png)

_图10 引入图像后，模型更倾向于泄漏文本中的隐私内容_

实验结果表明，多模态大模型的可信性与其通用能力存在一定的相关性，但在不同的可信评估维度上模型表现也依然存在差异。当前常见的多模态大模型相关算法，如GPT-4V辅助生成的微调数据集、针对幻觉的RLHF等，尚不足以全面增强模型的可信性。而现有的结论也表明，多模态大模型有着区别于大语言模型的独特挑战，需要创新高效的算法来进行进一步改进。

详细结果和分析参见论文。

**未来方向**

研究结果表明提升多模态大模型的可信度需要研究人员的特别注意。通过借鉴大语言模型对齐的方案，多元化的训练数据和场景，以及检索增强生成（RAG）和宪法AI（Constitutional AI）等范式可以一定程度上帮助改进。但多模态大模型的可信提升绝不止于此，模态间对齐、视觉编码器的鲁棒性等也是关键影响因素。此外，通过在动态环境中持续评估和优化，增强模型在实际应用中的表现，也是未来的重要方向。

伴随MultiTrust基准的发布，研究团队还公开了多模态大模型可信评价工具包MMTrustEval，其模型集成和评估模块化的特点为多模态大模型的可信度研究提供了重要工具。基于这一工作和工具包，团队组织了多模态大模型安全相关的数据和算法竞赛\[1,2\]，推进大模型的可信研究。未来，随着技术的不断进步，多模态大模型将在更多领域展现其潜力，但其可信性的问题仍需持续关注和深入研究。

_参考链接：_

_\[1\] CCDM2024多模态大语言模型红队安全挑战赛 [http://116.112.3.114:8081/sfds-v1-html/main](https://link.juejin.cn?target=http%3A%2F%2F116.112.3.114%3A8081%2Fsfds-v1-html%2Fmain "http://116.112.3.114:8081/sfds-v1-html/main")_

_\[2\] 第三届琶洲算法大赛--多模态大模型算法安全加固技术 [iacc.pazhoulab-huangpu.com/contestdeta…](https://link.juejin.cn?target=https%3A%2F%2Fiacc.pazhoulab-huangpu.com%2Fcontestdetail%3Fid%3D668de7357ff47da8cc88c7b8%26award%3D1%2C000%2C000 "https://iacc.pazhoulab-huangpu.com/contestdetail?id=668de7357ff47da8cc88c7b8&award=1,000,000")_