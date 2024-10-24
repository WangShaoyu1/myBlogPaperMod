---
author: "字节跳动技术团队"
title: "Habitat Challenge 2022冠军技术：字节AI Lab提出融合传统和模仿学习的主动导航"
date: 2022-11-29
description: "字节跳动 AI Lab-Research 团队提交的方法 ByteBOT 在 Habitat ObjectNav Challenge 2022 获得冠军。"
tags: ["人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:5,comments:1,collects:1,views:5758,"
---
> 在刚刚结束的国际机器人 Habitat 物体目标导航挑战赛 (Habitat  ObjectNav Challenge 2022) 上，字节跳动 AI Lab-Research 团队提交的方法 ByteBOT 获得冠军。该方法结合了基于地图的传统方法以及端到端的深度模仿学习方法，集两种方法的优势于一体，达到了当前最好的结果。

物体目标导航 (Object Navigation) 是智能机器人的基本任务之一。在此任务中，智能机器人在一个未知的新环境中主动探索并找到人指定的某类物体。物体目标导航任务面向未来家庭服务机器人的应用需求，当人们需要机器人完成某些任务时，例如拿一杯水，机器人需要先寻找并移动到水杯的位置，进而帮人们取到水杯。

Habitat Challenge 挑战赛由 Meta AI 等机构联合举办，是物体目标导航领域的知名赛事之一，截至 2022 今年已连续举办 ４ 届，本次比赛共有 54 支参赛队参加。在比赛中，字节跳动 AI Lab-Research 团队的研究者针对现有方法的不足，提出了一种全新的物体目标导航框架。该框架巧妙地将模仿学习与传统方法结合，从一众方法中脱颖而出获得冠军。在关键指标 SPL 中大幅度超过了第二名及其他参赛队伍的结果。历史上该赛事的冠军队伍一般是 CMU、UC Berkerly、Facebook 等知名研究机构。

![图片](/images/jueJin/7e0262473b5345d.png)

Test-Standard 榜单

![图片](/images/jueJin/7016f801c03a4a3.png)

Test-Challenge 榜单

Habitat Challenge 比赛官网：[aihabitat.org/challenge/2…](https://link.juejin.cn?target=https%3A%2F%2Faihabitat.org%2Fchallenge%2F2022%2F "https://aihabitat.org/challenge/2022/")

Habitat Challenge 比赛 LeaderBoard：[eval.ai/web/challen…](https://link.juejin.cn?target=https%3A%2F%2Feval.ai%2Fweb%2Fchallenges%2Fchallenge-page%2F1615%2Fleaderboard "https://eval.ai/web/challenges/challenge-page/1615/leaderboard")

1\.  研究动机
=========

目前的物体目标导航方法可以大致分为端到端的方法和基于地图的方法两大类。端到端的方法提取输入的传感器数据的特征，再送入一个深度学习模型中得到 action，此类方法一般基于强化学习或模仿学习（如图１Map-less methods）；基于地图的方法一般会构建显式或隐式地图，然后通过强化学习等方法在地图上选取一个目标点，最后规划路径并得到 action（如图１Map-based method）。

![图片](/images/jueJin/e2774503e1b5476.png)

__图１　端到端的方法(上)和基于地图的方法（下）流程示意图__

在经过大量实验对比两类方法后，研究者们发现这两类方法各有优劣：端到端的方法不需要构建环境的地图，因此更加简洁，且不同场景的泛化能力更强。但由于网络需要学习编码环境的空间信息，依赖大量的训练数据，且难以同时学习一些简单的行为，比如在目标物体附近停下。而基于地图的方法使用栅格来存储特征或语义，具有显式空间信息，因此这类行为的学习门槛较低。但它非常依赖准确的定位结果，而且在一些如楼梯等环境中，需要人工设计感知和路径规划策略。

基于上述结论，字节跳动 AI Lab-Research 团队的研究者们希望将两类方法的优势结合起来。然而这两类方法的算法流程差异很大，难以直接组合；此外也很难设计出一种策略直接融合两种方法的输出。因此研究者设计了一种简单但有效的策略，使两类方法根据机器人的状态交替进行主动探索和物体搜索，从而将各自的优势最大程度地发挥出来。

2\. 竞赛方法
========

算法主要有两个分支组成：基于概率地图的分支和端到端的分支。算法的输入是第一视角的 RGB-D 图像和机器人位姿，以及需要寻找的目标物体类别，输出是下一步动作 (action)。首先对 RGB 图像进行实例分割，并将其与其他原始输入数据一起传给两个分支。两个分支分别输出各自的 action，并由一个切换策略决定最终输出的 action。

![图片](/images/jueJin/df8368be7708427.png)

__图2 算法流程示意图__

**基于概率地图的分支**

基于概率地图的分支借鉴了 Semantic linking map\[2\] 的思想，对作者原来发表在 IROS 机器人顶会的论文\[3\]的方法进行了简化。该分支根据输入的实例分割结果、深度图和机器人位姿，一方面构建 2D 语义地图；另一方面基于预先学习的物体间关联概率，对一张概率地图进行更新。

概率地图的更新方式包括以下几种：当检测到目标物体但没有足够把握时(置信概率 confidence score 低于阈值)，此时应该继续靠近观察，因此概率地图上相应区域的概率值应该提高（如图 3 上方所示）；同理，如果检测到和目标物体有关联的物体（例如桌子和椅子放在一起的概率比较高），则相应区域的概率值也会提高（如图 3 下方所示）。算法通过选择概率最高的区域作为目标点，鼓励机器人靠近潜在目标物体以及关联物体进一步观察，直到找到置信概率高于阈值的目标物体。

![图片](/images/jueJin/1d786fb6fa04450.png)

__图3 概率地图更新方式示意图__

**端到端的分支**

端到端分支的输入包括 RGB-D 图像、实例分割结果、机器人位姿，以及目标物体类别，并直接输出 action。端到端分支的主要作用是引导机器人像人类一样寻找物体，因此采用了 Habitat-Web\[4\] 方法的模型和训练流程。该方法基于模仿学习，通过在训练集中收集人类寻找物体的示例样本训练网络。

**切换策略**

切换策略主要根据概率地图和路径规划的结果，在概率地图分支和端到端分支输出的两个 action 中选择一个作为最终输出。当概率地图中没有概率大于阈值的栅格，机器人需要对环境进行探索；当地图上无法规划出可行路径时，此时机器人可能处于一些特殊环境（如楼梯），这两种情况下会采用端到端分支，使机器人具备足够的环境适应能力。其他情况则选择概率地图分支，充分发挥其在寻找目标物体方面的优势。

该切换策略的效果如视频所示，机器人一般情况下利用端到端分支高效地探索环境，一旦发现了可能的目标物体或关联物体，则切换到概率地图分支靠近观察，如果目标物体的置信概率大于阈值，则在目标物体处停下；否则该区域的概率值会不断降低，直到没有概率大于阈值的栅格，机器人重新切换回端到端继续探索。

视频链接：[bytedance.feishu.cn/docx/GfWydt…](https://bytedance.feishu.cn/docx/GfWydtLKBoav8AxGK39cR2fDnsd "https://bytedance.feishu.cn/docx/GfWydtLKBoav8AxGK39cR2fDnsd")

从视频中可以看出，这种方法兼具了端到端方法和基于地图的方法的优势。两个分支各司其职，端到端方法主要负责探索环境；概率地图分支负责靠近感兴趣区域进行观察。因此该方法不仅能够在复杂场景探索（如楼梯），还降低了端到端分支的训练要求。

3\.  总结
=======

针对物体主动目标导航任务，字节跳动 AI Lab-Research 团队提出了一种结合经典概率地图与现代模仿学习的框架。该框架是对传统方法与端到端方法相结合的一次成功的尝试。在 Habitat 竞赛中，字节跳动 AI Lab-Research 团队提出的方法大幅度超出了第二名及其他参赛队伍的结果，证明了算法的先进性。通过将传统方法引入目前主流的 Embodied AI 端到端方法，来进一步弥补端到端方法的一些不足，从而使得智能机器人在帮助人、服务人的道路上更进一步。

近期，字节跳动 AI Lab-Research 团队在机器人领域的研究还被 CoRL、IROS、ICRA 等机器人顶会收录，其中包括物体位姿估计、物体抓取、目标导航、自动装配、人机交互等机器人核心任务。

【CoRL 2022】Generative Category-Level Shape and Pose Estimation with Semantic Primitives

*   论文地址：[arxiv.org/abs/2210.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2210.01112 "https://arxiv.org/abs/2210.01112")

【IROS 2022】3D Part Assembly Generation with Instance Encoded Transformer

*   论文地址：[arxiv.org/abs/2207.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2207.01779 "https://arxiv.org/abs/2207.01779")

【IROS 2022】Navigating to Objects in Unseen Environments by Distance Prediction

*   论文地址：[arxiv.org/abs/2202.03…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2202.03735 "https://arxiv.org/abs/2202.03735")

【EMNLP 2022】Towards Unifying Reference Expression Generation and Comprehension

*   论文地址：[arxiv.org/pdf/2210.13…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2210.13076 "https://arxiv.org/pdf/2210.13076")

【ICRA 2022】Learning Design and Construction with Varying-Sized Materials via Prioritized Memory Resets

*   论文地址：[arxiv.org/abs/2204.05…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2204.05509 "https://arxiv.org/abs/2204.05509")

【IROS 2021】Simultaneous Semantic and Collision Learning for 6-DoF Grasp Pose Estimation

*   论文地址：[arxiv.org/abs/2108.02…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2108.02425 "https://arxiv.org/abs/2108.02425")

【IROS 2021】Learning to Design and Construct Bridge without Blueprint

*   论文地址：[arxiv.org/abs/2108.02…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2108.02439 "https://arxiv.org/abs/2108.02439")

4\.  参考文献
=========

\[1\] Yadav, Karmesh, et al. "Habitat-Matterport 3D Semantics Dataset." arXiv preprint arXiv:2210.05633 (2022).

\[2\] Zeng, Zhen, Adrian Röfer, and Odest Chadwicke Jenkins. "Semantic linking maps for active visual object search." 2020 IEEE International Conference on Robotics and Automation (ICRA). IEEE, 2020.

\[3\] Minzhao Zhu, Binglei Zhao, and Tao Kong. "Navigating to Objects in Unseen Environments by Distance Prediction." _arXiv preprint arXiv:2202.03735_ (2022).

\[4\] Ramrakhya, Ram, et al. "Habitat-Web: Learning Embodied Object-Search Strategies from Human Demonstrations at Scale." Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2022.

5.  关于我们
========

字节跳动 AI Lab NLP&Research 专注于人工智能领域的前沿技术研究，涵盖了自然语言处理、机器人等多个技术研究领域，同时致力于将研究成果落地，为公司现有的产品和业务提供核心技术支持和服务。团队技术能力正通过火山引擎对外开放，赋能 AI 创新。

字节跳动 AI-Lab NLP&Research 联系方式

*   招聘咨询：[fankaijing@bytedance.com](https://link.juejin.cn?target=mailto%3Afankaijing%40bytedance.com "mailto:fankaijing@bytedance.com")
*   学术合作：[luomanping@bytedance.com](https://link.juejin.cn?target=mailto%3Aluomanping%40bytedance.com "mailto:luomanping@bytedance.com")

**扫描下方海报二维码或联系HR进行简历投递，快来加入我们吧**

![图片](/images/jueJin/83e8e0a260454ca.png)![图片](/images/jueJin/a7b1f9c95e4e4a1.png)