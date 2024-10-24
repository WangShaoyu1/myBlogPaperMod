---
author: "字节跳动技术团队"
title: "自回归超越扩散！北大、字节VAR范式解锁视觉生成Scaling Law"
date: 2024-04-16
description: "新一代视觉生成范式「VAR Visual Auto Regressive」视觉自回归来了！使 GPT 风格的自回归模型在图像生成首次超越扩散模型，并观察到与大语言模型"
tags: ["LLM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:3,views:30761,"
---
新一代视觉生成范式「VAR: Visual Auto Regressive」视觉自回归来了！使 **GPT 风格的自回归模型在图像生成首次超越扩散模型**，并观察到与大语言模型相似的 **Scaling Laws 缩放定律**、Zero-shot Task Generalization 泛化能力：

![](/images/jueJin/3d0528fcb6e4444.png)

_论文标题：Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction_

这项名为 VAR 的新工作由**北京大学**和**字节跳动**的研究者提出，登上了 GitHub 和 Paperwithcode 热度榜单，并得到大量同行关注：

![](/images/jueJin/281050d5f51d4d0.png)

目前体验网站、论文、代码、模型已放出：

*   体验网站：[var.vision/](https://link.juejin.cn?target=https%3A%2F%2Fvar.vision%2F "https://var.vision/")
*   论文链接：[arxiv.org/abs/2404.02…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F2404.02905 "https://arxiv.org/abs/2404.02905")
*   开源代码：[github.com/FoundationV…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FFoundationVision%2FVAR "https://github.com/FoundationVision/VAR")
*   开源模型：[huggingface.co/FoundationV…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2FFoundationVision%2Fvar "https://huggingface.co/FoundationVision/var")

背景介绍
====

在自然语言处理中，以 GPT、LLaMa 系列等大语言模型为例的 Autoregressive 自回归模型已经取得了较大的成功，尤其 **Scaling Law 缩放定律**和 **Zero-shot Task Generalizability 零样本任务泛化**能力十分亮眼，初步展示出通往「通用人工智能 AGI」的潜力。

然而在图像生成领域中，自回归模型却广泛落后于扩散（Diffusion）模型：近期持续刷屏的 **DALL-E3、Stable Diffusion3、SORA** 等模型均属于 Diffusion 家族。此外，对于视觉生成领域是否存在\*\*「Scaling Law 缩放定律」**仍未知，即测试集的交叉熵损失是否能够随着模型或训练开销 而呈现出可预测的**幂律（Power-law）下降趋势\*\* 仍待探索。

GPT形式自回归模型的强大能力与 Scaling Law，在图像生成领域，似乎被「锁」住了：

![](/images/jueJin/461af10b54eb42c.png)

_自回归模型在生成效果榜单上落后于一众 Diffusion 模型_

剑指「解锁」自回归模型的能力和 Scaling Laws，研究团队从图像模态内在本质出发，**模仿人类处理图像的逻辑顺序**，提出一套全新的「视觉自回归」生成范式：VAR, Visual AutoRegressive Modeling，**首次使得 GPT 风格的自回归视觉生成，在效果、速度、Scaling能力多方面超越 Diffusion，并迎来了视觉生成领域的 Scaling Laws：**

![](/images/jueJin/0fe5e5aa33cc4bc.png)

VAR方法核心：模仿人类视觉，重新定义图像自回归顺序
==========================

人类在感知图像或进行绘画时，往往先概览全局、再深入细节。这种由粗到细、从把握整体到精调局部的思想非常自然：

![](/images/jueJin/8ecfb2fbaaec4dc.png)

_人类感知图片（左）与创作画作（右）_ _由粗到细的逻辑顺序_

然而，传统的图像自回归（AR）却使用一种不符合人类直觉（但适合计算机处理）的顺序，即自上而下、逐行扫描的光栅顺序，来逐个预测图像token：

![](/images/jueJin/b492fe5f3afb40d.png)

**VAR则「以人为本」，模仿人感知或人创造图像的逻辑顺序**，使用从整体到细节的多尺度顺序逐渐生成token map：

![](/images/jueJin/dc9c784ea55c434.png)

除了更自然、更符合人类直觉，VAR带来的另一个显著优势是大幅提高了生成速度：在自回归的每一步（每一个尺度内部），所有图像token是一次性并行生成的；跨尺度则是自回归的。这使得在模型参数和图片尺寸相当的情况下，VAR能比传统AR快数十倍。此外，在实验中作者也观察到 VAR 相比 AR 展现出更强的性能和 Scaling 能力。

VAR方法细节：两阶段训练
=============

![](/images/jueJin/077da46cdc694cc.png)

VAR 在第一阶段训练一个**多尺度量化自动编码器**（Multi-scale VQVAE），在第二阶段训练一个**与 GPT-2 结构一致**（结合使用AdaLN）的自回归 Transformer。

如左图所示，VQVAE 的训练前传细节如下：

*   **离散编码**：编码器将图片转化为离散 token map R=(r1, r2, ..., rk)，分辨率**从小到大**
*   **连续化**：r1至rk先通过嵌入层转换为连续 feature map，再统一插值到rk对应最大分辨率，**并求和**
*   **连续解码**：求和后的 feature map 经过解码器得到重建图片，并通过重建+感知+对抗**三个损失混合训练**

如右图所示，在 VQVAE 训练结束后，会进行第二阶段的自回归 Transformer 训练：

*   自回归第一步是通过**起始 token \[S\]** 预测最初的 **1x1** token map
*   随后每一步，VAR都基于**历史所有**的 token map 去预测**下一个更大尺度**的 token map
*   训练阶段，VAR 使用**标准的交叉熵损失**监督这些 token map 的概率预测
*   测试阶段，采样得到的 token map 会借助 VQVAE decoder 进行连续化、插值求和、解码，从而得到最终生成的图像

作者表示，VAR 的自回归框架是全新的，而具体技术方面则吸收了 RQ-VAE 的残差VAE、StyleGAN与DiT的AdaLN、PGGAN的progressive training等一系列经典技术的长处。VAR 实际是站在巨人的肩膀上，聚焦于自回归算法本身的创新。

实验效果对比
======

VAR 在 Conditional ImageNet 256x256 和 512x512 上进行实验：

*   VAR 大幅提升了 AR 的效果，**一转 AR 落后于 Diffusion** 的局面
*   VAR 仅需 **10 步**自回归步骤，生成速度大幅超过AR、Diffusion，甚至逼近 GAN 的高效率
*   通过 **Scale up** VAR 直至 **2B/3B**，VAR 达到了 SOTA 水平，展现出一个**全新的**、有潜力的生成模型家族。

![](/images/jueJin/ec34de3611b14f6.png)

令人关注的是，通过与 **SORA、Stable Diffusion 3 的基石模型 Diffusion Transformer（DiT）** 对比，VAR 展现出了：

*   **更好效果**：经过 **scale up**，VAR最终达到 FID=1.80，逼近理论上的 FID 下限 1.78（ImageNet validation set），显著优于 DiT最优的 2.10
*   **更快速度**：VAR只需不到**0.3秒**即可生成一张256图像，速度是DiT的**45倍**；在512上更是DiT的**81倍**
*   **更好 Scaling** 能力：如左图所示，DiT 大模型在增长至 3B、7B 后体现出**饱和**现象，无法更靠近 FID 下限；而 VAR 经过缩放到20亿参数，性能不断提升，最终**触及 FID 下限**
*   **更高效的数据利用**：VAR仅需**350** epoch训练即超过 DiT **1400** epoch 训练

**这些比 DiT 更高效、更高速、更可扩放的证据为新一代视觉生成的基础架构路径带来了更多可能性。**

![](/images/jueJin/2b50adb70a8444a.png)

Scaling Law 实验
==============

Scaling law 可谓是大语言模型的「皇冠明珠」。相关研究已经确定，在 Scale up 自回归大型语言模型过程中，测试集上的交叉熵损失 L，会随着模型参数量 N、训练token个数 T，以及计算开销 Cmin 进行**可预测的降低**，呈现出幂律（Power-law）关系。

Scaling law 不仅使根据小模型预测大模型性能成为可能，节省了计算开销和资源分配，也体现出自回归 AR 模型强大的学习能力，测试集性能随着 N、T、Cmin 增长。

通过实验，研究者观察到了 **VAR 展现出与 LLM 几乎完全一致的幂律 Scaling Law**：研究者训练了 12 种大小的模型，缩放模型参数量从1800万到20亿，总计算量横跨 6 个数量级，最大总 token 数达到3050亿，并观察到测试集损失 L 或测试集错误率 与 N 之间、L 与 Cmin 之间展现出平滑的的幂律关系，并拟合良好：

![](/images/jueJin/d0820cef53a343c.png)

在 scale-up 模型参数和计算量过程中，模型的生成能力可见得到逐步提升（例如下方示波器条纹）：

![](/images/jueJin/e58ae05919bd4c9.png)

Zero-shot 实验
============

得益于自回归模型能够使用 Teacher-forcing 机制强行指定部分 token 不变的这一优良性质，VAR 也展现出一定的零样本任务泛化能力。在条件生成任务上训练好的 VAR Transformer，不通过任何微调即可零样本泛化到一些生成式任务中，例如图像补全（inpainting）、图像外插（outpainting）、图像编辑（class-condition editing），并取得一定效果：

![](/images/jueJin/39c6a39d998045d.png)

结论
==

VAR 为如何定义图像的自回归顺序提供了一个全新的视角，即**由粗到细、由全局轮廓到局部精调的顺序**。在符合直觉的同时，这样的自回归算法带来了很好的效果：VAR 显著提升自回归模型的速度和生成质量，在多方面使得**自回归模型首次超越扩散模型**。同时 VAR 展现出类似 LLM 的 **Scaling Laws**、Zero-shot Generalizability。作者们希望 VAR 的思想、实验结论、开源，能够贡献社区探索自回归范式在图像生成领域的使用，并促进未来基于自回归的统一多模态算法的发展。

招聘信息
====

字节跳动商业化-GenAI团队专注于开发先进的生成式人工智能技术并创造包括文字、图像、视频在内的行业领先的技术解决方案，通过利用Generative AI实现自动化创意工作流程，为广告主，机构和创造者提高创意效率、带来价值驱动。

团队更多视觉生成和LLM方向岗位开放中，欢迎关注字节跳动招聘信息。