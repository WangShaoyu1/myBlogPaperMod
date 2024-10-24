---
author: "机器之心"
title: "浙大李玺团队：指代表达理解新方法，ScanFormer粗到细迭代消除视觉视觉"
date: 2024-08-20
description: "作为基础的视觉语言任务，指代表达理解（指表达理解，REC）根据自然语言描述来定位被指代的目标。REC模型通常由三部分组成：编码器、文本编码器和跨模视觉形态交互文本。"
tags: ["人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:56,"
---
**该论文作者均来自于浙江大学李玺教授团队，论文第一作者为博士生苏伟同学，通讯作者为李玺教授（IET Fellow，国家杰青）。李玺教授团队近年来在国际权威期刊（如TPAMI、IJCV等）和国际顶级学术会议（ICCV、CVPR、ECCV等）上发表180余篇CV/AIGC相关的研究工作，和一批高校知名人士、科研机构广泛开展合作。**

作为基础的视觉语言任务，指代表达理解（指表达理解，REC）根据自然语言描述来定位被指代的目标。REC模型通常由三部分组成：编码器、文本编码器和跨模视觉形态交互文本，分别用于提取景观特征、形态特征和跨形态特征特征交互与增强。

目前的研究主要集中在设计高效的跨模态交互模块以提升任务精度，缺少对视觉编码器的探索。常见的做法是利用在分类、检测任务上预训练的特征提取器，如ResNet、DarkNet、Swin Transformer这些模型以滑动窗口或分割补丁的方式检索图像的所有空间位置来提取特征，其计算复杂度会随着图像分辨率快速增长，在基于Transformer的模型中更加明显。

由于图像的空间特征，图像中存在大量低信息量的背景区域以及与指代相关的区域，以相同的方式在这些区域中增加提取特征会计算量，但对有效提取特征没有任何帮助。高效文本的方式是提前预测图像区域的相关性和内容的丰富程度，对文本相关的前景区域充分提取特征，对背景区域粗略提取特征。对于区域预测，听觉解析的方式是通过图像塔来实现，在质谱仪的粗粒度图像中提前实现背景区域，之后逐步加入高分辨率的细粒度前景区域。

基于以上分析，我们提出了 **从粗到精的迭代感知框架ScanFormer**，在图像金字塔中逐层扫描，从低分辨率的粗像素图像开始，阶梯过滤掉指代表达相关/背景区域来降低计算浪费，使模型更多地关注前景/任务相关区域。

![](/images/jueJin/07caa7dda2aa460.png)

*   论文标题：ScanFormer：通过迭代扫描实现指代表达式理解
    
*   论文链接：[arxiv.org/pdf/2406.18…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2406.18048 "https://arxiv.org/pdf/2406.18048")
    

**方法介绍**

**一、由粗到精的人工采集框架**

为了简化结构，我们采用统一的文本和视觉模态的ViLT \[1\]模型，将其沿深度分为Encoder1和Encoder2两部分以用于不同的任务。

首先，提取文本特征并将其存入 KV Cache；然后构造图像金字塔并从金字塔依次往下迭代，在每次迭代中，输入当前像素被选择的 patch，Encoder1 用于预测每个 patch 的下一个一个尺 寸的细粒度补丁的选择情况，特别是，当前图像的补丁全部被选上，以保证模型能够获得粗粒度的全图信息。Encoder2 进一步提取特征并基于当前尺 寸的 \[cls\] token 来该预测尺寸的边界框。

同时，Encoder1 和 Encoder2 的中间特征会被存入 KV Cache 以方便被后续的刻度利用。随着刻度的增加，细粒度特征被引入，位置预测会更加准确，同时大部分相关的补丁被丢弃以节省大量计算。

另外，每一个维度内部的贴片具有心血管注意力，同时会关注前维度所有的贴片和文本特征。这种维度的维度内部的贴片可以进一步降低计算需求。

![](/images/jueJin/b383ad7c6281437.png)

**二、动态补丁选择**

每个补丁的选择情况由前一像素生成的选择因子决定，对于应用的位置有两种方案，其一个是用于 Encoder 每层 MHSA 的所有头中，然而，对于 N 层 H 头的 Encoder，很很难获得有效的敏锐信息来更新，因此获得的选择因子不太理想；其二是直接用于编码器的输入，即补丁嵌入上，因为只用在这个位置，因此更容易学习，最终论文也采用了该方案。

另外，需要注意的是，即使输入 patch embedding 被置 0，由于 MHSA 和 FFN 的存在，该 patch 在后续层的特征仍然会变为非 0 并影响其余 patch 的特征。幸运的是，当 token 序列中存在许多相同的 token 时，可以简化 MHSA 的计算，实现实际的推理加速。另外，为了增强模型的灵活性，本文并没有直接将 patch embedding 设置为 0，而是将其替换为一个可学习的常量 token。

因此，补丁的选择问题被转换成补丁的替换问题。补丁选择的过程可以拆分为常量令牌替换和令牌合并两步。独立选择的补丁会被替换为同一个常量令牌。由于这些一致性选择的token是相同的，根据缩放点积注意力的计算方式，这些token可以被合并为一个token并乘上总数，等价于将加到维度上，因此点积注意力的计算方式不变，常见的加速方法已可用。

![](/images/jueJin/5ea3d08f98a6403.png)

**实验结果**

本文方法在RefCOCO、RefCOCO+、RefCOCOg和ReferItGame四个数据集上取得了和state-of-the-art相近的性能。通过在大规模数据集上预训练并在具体数据集上参数，模型的性能可以进一步大幅提升，并达到和预训练模型如 MDETR \[2\] 和 OFA \[3\] 等相近的结果。

![](/images/jueJin/7b1684130daa4b3.png)

![](/images/jueJin/3776f61063774c9.png)

在推理速度上，提出的方法达到了实时的推理速度，同时能够保证严格的任务准确性。

![](/images/jueJin/8a44dbd3f7964c6.png)

另外，实验部分也对模型的补丁情况选择每个以及刻度（scale1和scale2）定位精度的分配做了统计。

如左图所示，随着精度的增加，细粒度的图像特征被加入，模型精度逐步提升。可以尝试加入相应的早退机制，在定位精度满足要求时及时退出，进一步避免在高精度上图像计算，实现根据样本选择合适的分辨率的效果。论文也进行了一些初步的尝试，包括加入IoU、GIoU和不确定性等预测路径，回归提前退出的指标，但发现效果不太理想，如何设计合适且准确的提前退出指标有待继续探索。

右图显示了不同的标尺的斑块选择情况，在所有的标尺上，被选择的斑块占均比较小，大部分的斑块都可以被清晰除掉，因此可以有效地节省计算资源。对于每个样本（图+指达），实际选择的补丁数量相对较少，大概占总数的65%。

![](/images/jueJin/45fbb9076250447.png)

最后，实验部分显示了一些可视化结果，随着刻度的增加（红→绿→蓝），模型的精度定位逐步提高。另外，根据被选择的补丁重建的图像可以看出模型为背景区域而已关注了粗粒度的信息，对于相关的前景区域，模型能够关注细粒度的细节信息。

![](/images/jueJin/531342620a264a9.png)

相关文献：

\[1\].Kim W, Son B, Kim I. Vilt：无卷积或区域监督的视觉和语言转换器\[C\]//国际机器学习会议。PMLR，2021：5583-5594。

\[2\]。Kamath A、Singh M、LeCun Y 等人。Mdetr 调制检测用于端到端多模态理解\[C\]//IEEE/CVF 国际计算机视觉会议论文集。2021：1780-1790。

\[3\]。Wang P，Yang A，Men R 等。Ofa：通过简单的序列到序列学习框架统一架构、任务和模态\[C\]//国际机器学习会议。PMLR，2022：23318-23340。