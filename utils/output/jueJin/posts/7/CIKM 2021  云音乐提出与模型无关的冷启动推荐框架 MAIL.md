---
author: ""
title: "CIKM 2021  云音乐提出与模型无关的冷启动推荐框架 MAIL"
date: 2022-04-27
description: "如何解决推荐系统中冷启动问题，一直是各团队持续研究的课题。云音乐算法团队提出一种双塔结构的与模型无关的兴趣学习框架 - MAIL ，在不改变原有排序模型的基础上，缓解推荐系统冷启动问题，并实现效果的增"
tags: ["人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读34分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:5,views:2002,"
---
> 图片来源：[zhuanlan.zhihu.com/p/376798647…](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F376798647%2F "https://zhuanlan.zhihu.com/p/376798647/")

> 作者：波克、庭庭、玄德

> 论文下载：[《Zero Shot on the Cold-Start Problem: \\Model-Agnostic Interest Learning for Recommender Systems》](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2108.13592.pdf "https://arxiv.org/pdf/2108.13592.pdf")

> 源代码：[MAIL 源代码下载](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLiangjunFeng%2FMAIL "https://github.com/LiangjunFeng/MAIL")

1 摘要
----

推荐系统需要根据用户的历史行为和兴趣预测用户未来的行为和兴趣，因此大量的用户行为数据就成为推荐系统的重要组成部分和先决条件。然而，对于新用户来说，user-item 之间的交互数据非常少，系统很难去捕捉新用户的兴趣偏好。为解决这种新用户冷启动（CSR）的困境，云音乐算法团队提出了一种双塔结构的与模型无关的兴趣学习框架 - MAIL 。 MAIL 框架是由双塔结构组成，其中一个塔设计于在零样本视角下解决冷启动推荐问题，另外一个塔专注于常规的排序任务。具体来说，零样本塔首先使用双自动编码器进行跨模态重建，从高度对齐的隐藏特征中为新用户获取虚拟行为偏好；然后排序塔可以根据零样本塔生成的行为偏好为用户提供推荐结果。实际上，MAIL 框架中的排序塔与具体模型结构无关，可以使用任意的 embedding-based 深度模型来实现。基于两个塔的协同训练，MAIL 提供了一种端到端的学习方法，能够在原来模型性能基础上获得增益。目前该方案已成功部署在网易云音乐直播推荐系统上，在实际业务场景上带来了点击率 13%~15% 的提升。并且我们也在多个公开数据集上验证了 MAIL 框架的有效性，现已将相关代码公开。

2 背景
----

个性化推荐系统已经在各种 web 和移动应用程序中发挥着重要作用，它是根据用户的历史行为和当前上下文信息，推荐符合用户个性化的对象，帮助用户找到想要的商品/新闻/音乐等、降低信息过载问题、提高站点的点击率/转化率、加深对用户的了解并进一步提供定制化服务 \[7, 25\]。其已广泛应用于许多领域，如电商，音乐、搜索、阅读、话题、广告等。尽管目前的深度学习 \[30\] 和基于矩阵分解的方法 \[17\] 在推荐系统领域取得了巨大的成功，但是推荐系统仍然面临着一个共同挑战就是冷启动推荐 (CSR)。究其原因是由于现有的推荐系统往往过渡依赖于用户的行为数据，而新用户和item 的行为交互都是非常少的。这就导致 "强者愈强、弱者愈弱" 的现象，系统很难去刻画新用户的兴趣偏好，新的item 能够被展示的机会也会偏少 \[9, 15\]。

目前业界针对冷启动问题做了很多的尝试，也提出了相应的解决方法。一种典型的方案就是利用用户的个人属性信息，用户在注册账号时，APP 往往要求填写一些基础信息，例如年龄、性别、职业等，利用这一系列信息初步可以完成对新用户的推荐。这一类方法立于"具有相似属性的用户具有相似的兴趣和行为"前提假设的基础上。除了利用个人属性信息之外，也有一些方法提出使用跨域信息来丰富新用户的表征 \[27\]，或者通过构造异构信息网络补充新用户有限的交互行为 \[13\] 。最近也有一些方案将冷启动问题视为一种少样本任务，通过 meta-learning 框架从 support sets 迁移有效知识 \[10, 20, 26\] 。 然而，已有的这些方案仍然受限于新用户的行为和兴趣缺失，语义知识和预训练embedding等辅助信息无法改变推荐系统对新用户知之甚少的困境。

在最近几年，零样本学习（zero-shot learning ZSL）在计算机视觉和机器学习社区中获得了越来越多的关注。与在训练阶段要求所有类别都有足够的样本的传统的分类任务不同，零样本学习的目标是识别在训练阶段从未出现过的新的类别的样本。这与冷启动问题有着异曲同工之处，其核心在于部分对象的部分数据缺失。 为了更好地理解，我们在图 1 中比较了 ZSL 和 CSR 的范例，以解释我们为什么要从零样本学习角度思考冷启动问题。

![](/images/jueJin/e1c565c2c9044e1.png)

在图像识别任务中，虽然未可见类别 "斑点狗" 的图片特征是缺失的，但是有带尾巴、金色毛发、4 条腿、强壮特性的 "金毛" 的各种图像和 "斑点狗" 的特征语义描述，零样本学习通过建立可见类别图片和语义信息之间的模态转移关系，利用语义描述来实现可见类别（金毛狗）到未可见类别（斑点狗）之间的知识迁移。同理，在冷启动问题中，虽然新用户的行为数据是缺失的，但是新用户和老用户都有属性特征，例如年龄、性别、婚育状况等，因此冷启动推荐就可以利用用户的属性特征建立老用户与新用户之间知识迁移，显示地推断出新用户潜在的行为和兴趣。目前也有一些相关的工作，2019 AAAI 发表的 LLAE 首次将零样本学习和冷启动问题结合在一起，使用线性自动编码器从低秩约束的用户属性中学习用户行为。然而，在冷启动问题中的用户行为数据不同于零样本学习中的图像特征。这是因为在真实的推荐系统中，用户可以和任意的 Item 发生交互，会产生大量的 user-item pair 对，这就导致用户行为和属性之间的模态转移问题会比 ZSL 中的更具有挑战性。上述讨论的线性自动编码器 LLAE 可能无法很好地表达复杂的映射关系，所以需要一种更加有效的对齐技术来克服用户行为和属性之间偏移问题。

而且，在现在这种各个团队将排序模型做的越来越复杂，并且和业务强相关的大背景下，构建一个合适的冷启动模块应该是原有排序模型的补充，而不是直接替换现有模型。已有的一些冷启动模型往往都是提出一个全新的模型来替换现有的排序模型，这对使用者的应用场景的模型改造就提出了很大的挑战。例如，\[19\] 设计了一种基于相似度传播算法的概率矩阵分解方法，\[20\] 使用改进的协同过滤来获取 item 推荐的评分信息。但是，这些方法往往过于关注冷启动问题而忽略排序模型本身的效率优化。像目前流行的排序算法 DeepFM、DMR、Wide & Deep 、ESMM 等，虽然在新用户上存在冷启动问题，但是这些方法通常在老用户上表现优异。因此，我们认为将冷启动模块和排序模型集成在一起，除了缓解冷启动问题之外，还可以为排序模型的效率带来进一步的提升。

基于上述讨论，本文提出了一个与模型无关的推荐系统冷启动框架，用于有效地从多个模态中学习新老用户的属性-行为链接，推断新用户潜在的行为和兴趣，解决推荐系统用户冷启动问题。MAIL 改进了现有的算法框架，针对不同的目标设计了零样本塔和排序塔，模型以端到端的方式联合建模。其中，零样本塔将冷启动问题视为零样本学习任务，推断新用户的潜在行为，为下一步排序塔的新用户行为特征提供数据支撑；排序塔根据零样本塔提供的潜在行为偏好进一步挖掘新用户的兴趣和新老用户的兴趣链接。具体来说，在零样本塔中通过双自动编码器显式构建和学习用户行为空间和用户属性空间，同时在自动编码器的公共隐藏空间中也进行了跨模态重建，建立老用户的用户行为和用户属性之间的模态转移。并且，由于用户属性存在同质性 （具有相似属性的用户具有相似的兴趣和行为），所以可以根据老用户的用户行为和属性之间的模态转移关系，重建出新用户的行为。对于排序塔，与具体的模型结构无关，可以使用任意 Embedding-based 的排序模型来实现，其根据重建出新用户行为和已有的新用户属性、老用户行为和老用户属性，完成整体推荐系统的物品推荐。零样本和排序塔是共享底层特征层，并且是联合训练的，这样既可以解决数据稀疏性问题，又能提高整体模型的训练速度。因此，本文认为将零样本学习与目前有效的排序模型结合，能够有效地缓解冷启动问题，从而实现排序模型效果的显著提升。本文的主要贡献如下：

*   1）本文设计了一个与模型无关的推荐系统冷启动框架，其构建了特殊的零样本塔，为新用户提供虚拟行为偏好，使得排序塔能够捕捉新用户的兴趣和新老用户之间的兴趣链接。
    
*   2）在零样本塔中，本文基于双自动编码器对用户的属性和行为进行跨模态重建，使得用户属性和用户行为的隐藏特征高度对齐，以将老用户的行为偏好泛化到新用户上。同时零样本塔不同于以往的冷启动模型，其是作为排序模型的一个补充而不是替换，所以能够在不影响排序模型的基础上，获得效果增益。
    
*   3）MAIL 的排序塔可以根据实际业务场景设计任意 embedding-based 的深度模型，并且其与零样本塔共享特征 embedding ，以有效缓解数据稀疏问题。
    
*   4）除了在多个公开数据上验证外，本文在云音乐直播的真实数据集上进行了充分实验，验证了 MAIL 在模型性能上取得的了很好的效果。同时，MAIL 已经部署在云音乐大规模实时在线推荐系统上，验证了 MAIL 与高度优化的已有基线相比有显著提升。
    

3 方法
====

### 3.1 问题定义

#### 3.1.1 推荐系统的特征

推荐系统一般有四类特征：用户属性 a∈Aa\\in \\mathcal{A}a∈A，用户行为 v∈Vv \\in \\mathcal{V}v∈V ，上下文内容 c∈Cc \\in \\mathcal{C}c∈C，目标item t∈Tt \\in \\mathcal{T}t∈T。用户属性特征 A\\mathcal{A}A 主要包含用户 ID、年龄、性别、职业等。 用户行为 VVV 是序列特征包含用户交互过的 item ID 以及 item 的相关特征。上下文内容特征 C\\mathcal{C}C 包含日期、召回方法、位置等。 目标Item 的特征 T\\mathcal{T}T 包含 item ID、类别 ID 等。 在推荐系统中，排序模型主要用于学习输入特征 x\=a,v,c,tx = {a, v, c, t}x\=a,v,c,t 到 item 打分 y^\\hat{y}y^​ 的映射关系 y^\=f(x)\\hat{y} = f(x) y^​\=f(x)。通常，item 的得分越高，被推荐的优先级更高，获得展示的机会就更多。

值得注意的是，上述多数提到的特征均为类别特征，其可以由高维 one-hot 向量表示。 在深度学习模型中，one-hot 特征通常通过embedding 层转化为低纬稠密向量。 因此，例如上文提到的 a 和 v 实际上表达的是特征对应的 embedding 向量。具体来看，用户属性 a\=\[a1,...,an\]∈Rna×da = \[a\_{1},..., a\_{n}\] \\in \\mathbb{R}^{n\_{a} \\times d}a\=\[a1​,...,an​\]∈Rna​×d ，其中 nan\_{a}na​ 是特征的数量，d 为 embedding 的尺寸大小。 用户行为 v\=\[v1,...,vn\]∈Rnv×dv = \[v\_{1},..., v\_{n}\] \\in \\mathbb{R}^{n\_{v} \\times d}v\=\[v1​,...,vn​\]∈Rnv​×d 中的 viv\_{i}vi​ 则为用户交互 item id 的 embedding 向量。此外，还存在一些稠密特征可以直接使用，无需做 embedding 转化。

#### 3.1.2 冷启动问题的零样本学习

在冷启动场景下，数据集可划分为两个部分，一个是老用户集合 S\\mathcal{S}S ，一个是新用户集合 O\\mathcal{O}O 。对于老用户来说，排序模型需要的四类特征是完整的，其数据可以表示为 xs\=as,cs,ts,vsx\_{s} = {a\_{s},c\_{s},t\_{s}, v\_{s}}xs​\=as​,cs​,ts​,vs​ 。新用户, 由于其行为数据的缺失，所以特征数据表示为 xo\=ao,co,tox\_{o} = {a\_{o},c\_{o},t\_{o} }xo​\=ao​,co​,to​ 。因此，本文我们基于老用户的特征数据训练了一个零样本塔 vs^\=g(as,vs)\\hat{v\_{s}}=g(a\_{s}, v\_{s})vs​^​\=g(as​,vs​)，用于推断出新用户潜在行为 vo^\=g(ao)\\hat{v\_{o}}= g(a\_{o})vo​^​\=g(ao​)，以解决新用户冷启动问题。从公式 vs^\=g(as,vs)\\hat{v\_{s}}=g(a\_{s}, v\_{s})vs​^​\=g(as​,vs​) 和 vo^\=g(ao)\\hat{v\_{o}}= g(a\_{o})vo​^​\=g(ao​) 可以看出，老用户的行为数据 vsv\_{s}vs​ 被用于零样本塔的训练，而新用户的行为是缺失的，故不可用。总而言之，本文的模型框架可以用如下两个公式简要表示：

*   老用户： ys^\=F(xs)\=f(as,cs,ts,vs)\\hat{y\_{s}} = F(x\_{s}) = f(a\_{s}, c\_{s}, t\_{s}, v\_{s})ys​^​\=F(xs​)\=f(as​,cs​,ts​,vs​)
*   新用户： yo^\=F(xo)\=f(ao,co,to,vo^)\\hat{y\_{o}} = F(x\_{o}) = f(a\_{o}, c\_{o}, t\_{o}, \\hat{v\_{o}})yo​^​\=F(xo​)\=f(ao​,co​,to​,vo​^​)， 其中 vo^\=g(ao)\\hat{v\_{o}} = g(a\_{o})vo​^​\=g(ao​) 。

### 3.2 与模型无关的零样本学习框架

#### 3.2.1 方案的整体思路

我们在图 2 中展示了 MAIL 框架的整体方案，框架由零样本塔和排序塔组成，其中排序塔基于零样本产出的完整数据来完成整体推荐结果产出，零样本塔与排序塔共享了底层的特征embedding。通过 MAIL 框架将零样本塔和排序塔集成在一起，可以帮助现有推荐系统缓解冷启动问题的基础上，实现推荐效果的进一步提升。

![](/images/jueJin/15f880a148c64de.png)

#### 3.2.2 冷启动模块之零样本塔

在本节，我们主要详细介绍如何构造零样本塔以缓解冷启动问题。首先需要明确的是，零样本塔是在老用户的特征样本上训练，在新用户上完成推理，通过用户的属性特征完成老用户到新用户行为偏好的知识迁移。因此，在零样本塔训练时仅有用户的属性特征 embedding asa\_{s}as​ 和用户的行为特征 embedding vsv\_{s}vs​ 参与训练，其特征 embedding 的获取是由排序塔中获取，同时 asa\_{s}as​ 和 vsv\_{s}vs​ 不参与零样本的参数更新。

**零样本塔具体构造步骤如下：**

*   **第一步**：从排序塔获取embedding向量 asa\_{s}as​ 和 vsv\_{s}vs​
*   **第二步**：分别对老用户的属性 asa\_{s}as​ 和行为 vsv\_{s}vs​ 进行隐藏特征重构，建立隐藏特征和原始特征的关系链接。以属性隐藏特征 hsah\_{s}^{a}hsa​ 为例，隐藏特征重构函数如下：

hsa\=∑i\=1naαiasi, (1)\\begin{aligned} h\_{s}^{a}= \\sum\_{i=1}^{n\_{a}} \\alpha\_{i} a\_{si},   \\end{aligned} \\tag{1}hsa​\=i\=1∑na​​αi​asi​, ​(1)

其中，nan\_{a}na​ 是用户属性特征数，asi∈Rda\_{si} \\in R^{d}asi​∈Rd 是第 i 个老用户属性的embedding 向量。αi\\alpha\_{i}αi​ 是特征权重，αi\\alpha\_{i}αi​ 可以被定义为

αi\=exp(ei)∑j\=1naej,ei\=  zTtanh(wasi+b),(2)\\begin{aligned} \\alpha\_{i} &= \\frac{exp(e\_{i})}{\\sum^{n\_{a}}\_{j=1}e\_{j}}, \\\\ e\_{i} =\\;& z^{T}tanh(w a\_{si}+ b), \\end{aligned} \\tag{2}αi​ei​\=​\=∑j\=1na​​ej​exp(ei​)​,zTtanh(wasi​+b),​(2)

其中，z∈Rdrz \\in \\mathbb{R}^{d\_{r}}z∈Rdr​, w∈Rdr×dw \\in \\mathbb{R}^{d\_{r} \\times d}w∈Rdr​×d, b∈Rdrb \\in \\mathbb{R}^{d\_{r}}b∈Rdr​ 是训练参数，drd\_{r}dr​ 是给定的隐藏向量尺寸。隐藏特征重构函数其实是一个简单的 self-attention，用于对不同特征做加权。

*   **第三步**：利用两个自编码器对 asa\_{s}as​ 和 vsv\_{s}vs​ 进行交叉重构，通过构造跨模态重建来对齐用户属性和行为，以更加有效地生成基于属性的行为生成器。本文分别对用户属性空间和用户行为空间进行了交叉重构，在属性空间中，令属性的隐藏特征 psp\_{s}ps​ 经过 D1 和 D2 分别重构用户的属性数据 asa\_{s}as​ 和行为数据 vsv\_{s}vs​；在行为空间中，令行为的隐藏特征 qsq\_{s}qs​ 经过 D1 和 D2 分别重构用户的属性数据 asa\_{s}as​ 和行为数据 vsv\_{s}vs​。具体公式如下：

（1）属性空间的跨模态重构损失函数：

La\=∣∣D1(ps)−as∣∣22+∣∣D2(ps)−vs∣∣22,(3)\\begin{aligned} \\mathcal{L}\_{a} = ||D1(p\_{s})-a\_{s}||^{2}\_{2} + ||D2(p\_{s})-v\_{s}||^{2}\_{2}, \\end{aligned} \\tag{3}La​\=∣∣D1(ps​)−as​∣∣22​+∣∣D2(ps​)−vs​∣∣22​,​(3)

（2）行为空间的跨模态重构损失函数：

Lv\=∣∣D1(qs)−as∣∣22+∣∣D2(qs)−vs∣∣22,(4)\\begin{aligned} \\mathcal{L}\_{v} = ||D1(q\_{s})-a\_{s}||^{2}\_{2} + ||D2(q\_{s})-v\_{s}||^{2}\_{2}, \\end{aligned} \\tag{4}Lv​\=∣∣D1(qs​)−as​∣∣22​+∣∣D2(qs​)−vs​∣∣22​,​(4)

其中，ps\=E1(hsa)∈Rdhp\_{s} = E1(h^{a}\_{s}) \\in \\mathbb{R}^{d\_{h}}ps​\=E1(hsa​)∈Rdh​, qs\=E2(hsv)∈Rdhq\_{s} = E2(h^{v}\_{s}) \\in \\mathbb{R}^{d\_{h}}qs​\=E2(hsv​)∈Rdh​，dhd\_{h}dh​ 是给定的隐藏向量尺寸。E1和 E2 是用户属性和用户行为的编码器，D1 和 D2 是对应的解码器，具体结构如图 3 所示。

![](/images/jueJin/385c99db02c14b1.png)

在跨模态重构中，属性和行为不属于同一个空间，所以需要对齐用户属性隐藏特征 psp\_{s}ps​ 和行为隐藏特征 qsq\_{s}qs​ ，保证 psp\_{s}ps​ 和 qsq\_{s}qs​ 具备相同分布。具体地，首先利用编码器生成 psp\_{s}ps​ 和 qsq\_{s}qs​ ，用解码器重构生成 asa\_{s}as​ 和 vsv\_{s}vs​，并在 psp\_{s}ps​ 和 qsq\_{s}qs​ 之间设计了 MMD (maximum mean discrepancy) 来最小化 PsP\_{s}Ps​ （ a batch of psp\_{s}ps​ ）和 QsQ\_{s}Qs​ （ a batch of qsq\_{s}qs​ ） 的分布距离，促使其具有相同的预测能力，并辅助交叉模态损失收敛。具体公式如下：

Ld\=DH(Ps,Qs)\=∥1n∑i\=1nϕ(psi)−1n∑j\=1nϕ(qsj)∥22\=1n∑i\=1n∑j\=1nk(psi,psj)+1n∑i\=1n∑j\=1nk(qsi,qsj)−2n2∑i\=1n∑j\=1nk(psi,qsj),(5)\\begin{aligned} \\mathcal{L}\_{d} &= D\_{\\mathcal{H}}(P\_{s},Q\_{s}) = \\left \\| \\frac{1}{n}\\sum^{n}\_{i=1}\\phi(p\_{si}) - \\frac{1}{n}\\sum^{n}\_{j=1}\\phi(q\_{sj}) \\right \\|\_{2}^{2} \\\\ &= \\frac{1}{n}\\sum^{n}\_{i=1}\\sum^{n}\_{j=1}k(p\_{si},p\_{sj}) + \\frac{1}{n}\\sum^{n}\_{i=1}\\sum^{n}\_{j=1}k(q\_{si},q\_{sj}) \\\\ & - \\frac{2}{n^{2}}\\sum^{n}\_{i=1}\\sum^{n}\_{j=1}k(p\_{si},q\_{sj}), \\end{aligned} \\tag{5}Ld​​\=DH​(Ps​,Qs​)\=∥∥​n1​i\=1∑n​ϕ(psi​)−n1​j\=1∑n​ϕ(qsj​)∥∥​22​\=n1​i\=1∑n​j\=1∑n​k(psi​,psj​)+n1​i\=1∑n​j\=1∑n​k(qsi​,qsj​)−n22​i\=1∑n​j\=1∑n​k(psi​,qsj​),​(5)

其中 H\\mathcal{H}H 是再生核希尔伯特空间 (RKHS)，ϕ:ps,qs→H\\phi:p\_{s}, q\_{s} \\rightarrow \\mathcal{H}ϕ:ps​,qs​→H, kkk 是一个高斯核函数：

k(ps,qs)\=exp(−∥ps−qs∥2/2σ2),(6)\\begin{aligned} k(p\_{s}, q\_{s}) = exp(-\\left \\| p\_{s}-q\_{s} \\right \\|^{2}/2\\sigma^{2}), \\end{aligned} \\tag{6}k(ps​,qs​)\=exp(−∥ps​−qs​∥2/2σ2),​(6)

，在本文中 σ\=1\\sigma=1σ\=1 。

综上述，零样本塔的训练损失函数为：

Lzst\=La+Lv+Ld.(7)\\begin{aligned} \\mathcal{L}\_{zst} = \\mathcal{L}\_{a} + \\mathcal{L}\_{v} + \\mathcal{L}\_{d}. \\end{aligned} \\tag{7}Lzst​\=La​+Lv​+Ld​.​(7)

其中 Lzst\\mathcal{L}\_{zst}Lzst​ 的前面两项是使得 psp\_{s}ps​ 和 qsq\_{s}qs​ 拥有重构 asa\_{s}as​ 和 vsv\_{s}vs​ 的能力，而第三项是使得 psp\_{s}ps​ 和 qsq\_{s}qs​ 共享相同的隐藏空间，以更好地收敛跨模态重建。 通过三重对齐的隐藏特征，可以很容易地根据新用户的属性为他们生成虚拟行为偏好，如下所示：

vo^\=D2(po)\=D2(E1(hoa)),(8)\\begin{aligned} \\hat{v\_{o}} = D2(p\_{o}) = D2(E1(h\_{o}^{a})), \\end{aligned} \\tag{8}vo​^​\=D2(po​)\=D2(E1(hoa​)),​(8)

其中 haoh\_{a}^{o}hao​ 是特征 aoa\_{o}ao​ 的权重，具体的参数可以通过公式（2）和（3）训练可得。

#### 3.2.3 排序塔

在本节，我们将详细介绍如何构建排序塔。 通常，排序塔与模型无关，可以通过任何embedding-based 的模型来实现，用于点击率 (CTR)预估、点击转化率 (CVR) 预估 或曝光转化率 (CTCVR) 预估 \[16\]。图 2 中展示的排序塔是最基础的深度模型，主要是为便于理解，可以被任意替换。当然，我们实际业务应用的排序模型比这复杂的多得多，具体细节可以参考我们之前发布的文章[《实时增量学习在云音乐直播推荐系统中的实践》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FuuogZ3aPMgEXQuWbcc835w "https://mp.weixin.qq.com/s/uuogZ3aPMgEXQuWbcc835w")。

**排序塔具体构造步骤如下：**

*   **第一步**：新老用户标志符定义 新老用户在排序塔中有不同的处理方式，这就意味着需要定义一个是否是新用户的标志符，如下：

flag\={truev\=∅falseotherwise,(9)\\begin{aligned} flag = \\left\\{\\begin{matrix} true & v = \\varnothing \\\\ false & otherwise, \\end{matrix}\\right. \\end{aligned} \\tag{9}flag\={truefalse​v\=∅otherwise,​​(9)

当flag=true时，表示为新用户，flag=false时为老用户。

*   **第二步**：根据embedding 矩阵和 flag 构造输入样本和特征：

x\={{ao,co,to,v^o}flag\=true{as,cs,ts,vs}  flag\=false,(10)\\begin{aligned} x = \\left\\{\\begin{matrix} \\{a\_{o}, c\_{o},t\_{o},\\hat{v}\_{o}\\} & flag = true \\\\ \\{a\_{s},c\_{s}, t\_{s}, v\_{s}\\} &\\; flag = false, \\end{matrix}\\right. \\end{aligned} \\tag{10}x\={{ao​,co​,to​,v^o​}{as​,cs​,ts​,vs​}​flag\=trueflag\=false,​​(10)

其中 v^o\\hat{v}\_{o}v^o​ 为 新用户的虚拟行为，由公式 (8) 产出。

排序塔中的隐藏层特征 z\=\[za,zv,zc,zt\]z= \[z\_{a}, z\_{v}, z\_{c}, z\_{t}\]z\=\[za​,zv​,zc​,zt​\] concat 拼接后生成，其中 zaz\_{a}za​ 是用户属性特征 a 经过 sum pooiling 后生成，zv,zc,ztz\_{v}, z\_{c}, z\_{t}zv​,zc​,zt​ 同理，公式：

za\=∑i\=1naai,(11)\\begin{aligned} z^{a} = \\sum^{n\_{a}}\_{i=1} a\_{i}, \\end{aligned} \\tag{11}za\=i\=1∑na​​ai​,​(11)

其中，aia\_{i}ai​ 是 用户属性特征 a 的第i个特征 embedding 向量 。

*   **第三步**：输出 output 结果 最后 output 结果 y^\\hat{y}y^​ 由多层感知机产出，用公式可表达为：

hz1\=LeakyReLU(BN(Dense(Dropout(z,0.5))))hz2\=LeakyReLU(BN(Dense(Dropout(hz1,0.5))))y^\=Sigmoid(Dense(hz2))),(12)\\begin{aligned} h\_{z1} = Lea&kyReLU(BN(Dense(Dropout(z,0.5)))) \\\\ h\_{z2} = Leak&yReLU(BN(Dense(Dropout(h\_{z1},0.5)))) \\\\ & \\hat{y} = Sigmoid(Dense(h\_{z2}))), \\end{aligned} \\tag{12}hz1​\=Leahz2​\=Leak​kyReLU(BN(Dense(Dropout(z,0.5))))yReLU(BN(Dense(Dropout(hz1​,0.5))))y^​\=Sigmoid(Dense(hz2​))),​(12)

对于点击率预估这种二分类任务而言，一般采用交叉熵作为损失函数，即：

Lrt\=−∑i\=1n(yilogy^i+(1−yi)log(1−y^i)),(13)\\begin{aligned} \\mathcal{L}\_{rt} = -\\sum^{n}\_{i=1}(y\_{i}log\\hat{y}\_{i} + (1-y\_{i})log(1-\\hat{y}\_{i})), \\end{aligned} \\tag{13}Lrt​\=−i\=1∑n​(yi​logy^​i​+(1−yi​)log(1−y^​i​)),​(13)

综上所述，MAIL 的整体损失为：

L\=Lzst+Lrt,(14)\\begin{aligned} \\mathcal{L} = \\mathcal{L}\_{zst} + \\mathcal{L}\_{rt}, \\end{aligned} \\tag{14}L\=Lzst​+Lrt​,​(14)

其中两个塔联合训练以解决推荐系统的 CSR。 值得一提的是，在实际应用中，不仅测试数据会有新用户，训练数据也会有新用户。 所以，排序和 CSR 两阶段模型其实很难解决排序模型在训练阶段的数据缺失问题，这是由于基于 embedding-based 的 CSR 模型需要在排序模型完成充分训练之后才能训练。相比之下，本文提出的 MAIL 框架是一个端到端的模型，排序塔可以从零样本塔中获取新用户的潜在行为偏好，这对于实际业务应用更加实用。

#### 3.2.4 MAIL的实现技巧和算法

本节总结了MAIL的实现技巧和训练算法。 **（1）两个优化器协同训练：** MAIL 的两个塔分别采用两个优化器来训练，其中一个优化器 GAG\_{A}GA​ 用于训练 Lzst\\mathcal{L}\_{zst}Lzst​，另一个 GBG\_{B}GB​ 用于训练 Lrt\\mathcal{L}\_{rt}Lrt​ 。 比较核心的是，MAIL 的特征 embedding 矩阵受排序塔和 GBG\_{B}GB​ 影响， 零样本塔的优化器 GAG\_{A}GA​ 不参与特征 embedding 矩阵的参数更新。因为零样本塔的目的在于重建 embedding 向量而不是去改变它，如果将零样本塔的梯度更新应用于 embedding 矩阵反而会导致模型的预估性能下降。

**（2）基于残差结构的自动编码器：** 在零样本塔中使用两个自动编码器来进行跨模态重建。 考虑到推荐系统中的稀疏信息，本文设计了基于残差结构的自动编码器，以便更好地执行重建任务。 以图 2 中的左侧的自编码器为例，残差结构如图 4 所示。具体用公式可以表示为如下两组公式。 ![](/images/jueJin/ff4a16860adc4ab.png)

残差编码器的前向传播可以表述如下：

zsa1\=LeakyReLU(Dense(Dropout(hsa,0.5)))zsa2\=LeakyReLU(Dense(Dropout(Concat(zsa1,hsa),0.5)))ps\=LeakyReLU(Dense(Concat(zsa2,hsa)))),(15)\\begin{aligned} &z^{a1}\_{s} = LeakyReLU(Dense(Dropout(h^{a}\_{s},0.5))) \\\\ z^{a2}\_{s} = &LeakyReLU(Dense(Dropout(Concat(z^{a1}\_{s},h^{a}\_{s}),0.5))) \\\\ & p\_{s} = LeakyReLU(Dense(Concat(z^{a2}\_{s},h^{a}\_{s})))), \\end{aligned} \\tag{15}zsa2​\=​zsa1​\=LeakyReLU(Dense(Dropout(hsa​,0.5)))LeakyReLU(Dense(Dropout(Concat(zsa1​,hsa​),0.5)))ps​\=LeakyReLU(Dense(Concat(zsa2​,hsa​)))),​(15)

残差解码器的前向传播可以表示为：

zsa3\=LeakyReLU(Dense(Dropout(ps,0.5)))zsa4\=LeakyReLU(Dense(Dropout(Concat(zsa3,ps),0.5)))a^s′\=Dense(Concat(zsa4,ps)).(16)\\begin{aligned} z^{a3}\_{s}& = LeakyReLU(Dense(Dropout(p\_{s},0.5))) \\\\ z^{a4}\_{s} = Leaky&ReLU(Dense(Dropout(Concat(z^{a3}\_{s},p\_{s}),0.5))) \\\\ & {\\hat{a}}'\_{s} = Dense(Concat(z^{a4}\_{s},p\_{s})). \\end{aligned} \\tag{16}zsa3​zsa4​\=Leaky​\=LeakyReLU(Dense(Dropout(ps​,0.5)))ReLU(Dense(Dropout(Concat(zsa3​,ps​),0.5)))a^s′​\=Dense(Concat(zsa4​,ps​)).​(16)

残差结构的原理类似于 wide&deep 模型 \[34\]，其中wide 模块负责模型记忆能力，即从历史数据中发现 item 或者特征之间的相关性；deep 模块负责模型的泛化能力，即相关性的传递，发现在历史数据中很少或者没有出现的新的特征组合。最后通过特征拼接层，使得模型能够同时获得记忆和泛化能力。

**（3）MAIL 的训练伪代码** ![](/images/jueJin/d11042191dda411.png)

### 3.3 基于属性的知识迁移的可行性分析

在 MAIL 中，零样本塔基于老用户的属性将行为偏好泛化到新用户上。知识转移背后有一个基本假设，具有相似属性的人具有相似的行为。 然而，这似乎存在一个矛盾，即用户属性空间远小于推荐系统中的用户行为空间。为了更好地说明，我们定义属性数量为 nan\_{a}na​，假设每个属性特征均有 kak\_{a}ka​ 个不同的值。类似地，用户行为序列的长度表示为nvn\_{v}nv​，可以与用户交互的 item 数表示为 kvk\_{v}kv​。一般情况下，要完成属性特征到行为的有效学习，需要 naka\>\=nvkvn\_{a}k\_{a} >= n\_{v}k\_{v}na​ka​\>=nv​kv​ ，然而实际情况可能存在 nv\>nan\_{v} > n\_{a}nv​\>na​， kv\>kak\_{v} > k\_{a}kv​\>ka​ 。

在本文，我们强调用户行为的核心是用户兴趣偏好，而非 items ，item 只是呈现用户兴趣的一个方面。 与直接学习用户与哪些 item 发生交互相比，对于推荐系统来说，去学习用户偏好的 item 风格更为合适和有效。这也就是为什么将稠密向量潜在用户行为 vvv 的预估作为零样本塔学习目标的重要原因之一。基于稠密向量，用户的兴趣 ϕ(r)\\phi(r)ϕ(r) 可以很容易地用一组 items 表示：

ϕ(r)\={r  ∣  ∣∣r−v∣∣22<\=ϵ},(17)\\begin{aligned} \\phi(r) = \\{r \\;|\\; ||r - v||^{2}\_{2} <=\\epsilon \\}, \\end{aligned} \\tag{17}ϕ(r)\={r∣∣∣r−v∣∣22​<=ϵ},​(17)

其中 ϵ\\epsilonϵ 为兴趣范围的误差界限。只要生成 a^∈ϕ(r)\\hat{a} \\in \\phi(r)a^∈ϕ(r) ，排序塔就可以捕捉用户兴趣。因此，用户属性空间迁移的目标实际上是用户兴趣空间而不是用户行为空间。同时，用户兴趣的种类 nrn\_{r}nr​ 远小于 nvkvn\_{v}k\_{v}nv​kv​，这使得基于属性的知识转移可用于CSR。

4 实验
----

在本节中，我们分别在公开数据集和大规模业务数据集上对 MAIL 做了细致地评估。首先，我们详细介绍了实验设置和对比模型。 并且，在推荐效果和消融研究展示了模型的优越结果。最后，为了便于更加直观的理解，我们提供了可视化特征结果。

### 4.1 实验设置和对比方法

#### 4.1.1 数据集

**（1）公开数据集: 阿里妈妈广告数据集** 其包含8天以上从淘宝随机抽取的广告展示和点击的日志。其包括 114 万用户和 84 万个item，以及 600 万条用户-item 交互日志。前 7 天的日志作为训练集，最后一天的日志作为测试集。请注意，数据集是没有提供新用户包的。因此，我们在训练和测试集中随机选择 40% 的用户，并通过删除他们的行为将他们视为新用户。

数据集：[tianchi.aliyun.com/dataset/dat…](https://link.juejin.cn?target=https%3A%2F%2Ftianchi.aliyun.com%2Fdataset%2FdataDetail%3FdataId%3D56 "https://tianchi.aliyun.com/dataset/dataDetail?dataId=56")

**（2）工业数据集: 网易云音乐直播业务数据** 按照双盲原则从公司数据库里面随机选择8天的直播推荐和用户行为日志。其包括 61.3 万用户和 5.2 万个 item，以及 200 万条用户-item交互日志。 在我们的业务数据集中，大约一半的用户是新用户。 两个数据集的统计数据汇总在表 1 中。 ![](/images/jueJin/6e933c44f46348f.png)

#### 4.1.2 对比方法

1.  **EmbLR** 逻辑回归是经典的线性模型，可以看成是浅层神经网络。在这里，我们使用 embedding 层（即 EmbLR）对具有稀疏 ID 的内容实现逻辑回归。 EmbLR 是 LLAE 的基线。
    
2.  **LLAE (2019)** LLAE \[4\] 是一种基于零样本学习的冷启动方法，它使用线性低秩自动编码器为逻辑回归生成行为偏好。正如 \[4\] 中所讨论的，低秩损失的权重由交叉验证决定，其设为 30。
    
3.  **BaseDNN** BaseDNN是图 2 所示的排序塔，这里用作 MetaEmb 和MAIL-Base的baseline。
    
4.  **MetaEmb (2019) MetaEmb** \[28\] 是一种基于元学习的冷启动方法，学习产出理想的初始化向量。基本模型实现为 BaseDNN。
    
5.  **MAIL-Base (Ours)}** MAIL-Base 是本文提出的双塔模型，如图 2 所示，它使用零样本塔来解决 BaseDNN 的冷启动问题。
    
6.  **DMR (2020)** DMR \[18\] 是一种优秀的推荐系统模型，其由 i2i 网络和 u2i 网络组成。 DMR 是 MAIL-DMR 的基线
    
7.  **MAIL-DMR (Ours)** MAIL 是本文提出的双塔模型，它使用 DMR 作为排序塔， 并从设计的零样本塔获取进一步的增益。
    

以上七种模型中，EmbLR 和 LLAE 是线性模型，BaseDNN、MetaEmb 和 MAIL-Base 是基础深度模型，DMR 和 MAIL-DMR 是改进的深度模型。

### 4.2 公开数据集和工业数据集上的模型效果

在实验中，我们将学习率设置为 0.001，embedding size 设置为 32，batch size 设置为 1024，dropout 设置为 0.5。对于所有用户，行为序列的最大长度设置为 100。如果用户行为序列的长度小于 100，我们用 0 填充行为序列。在 MAIL 中，使用了双自动编码器。编码器中隐藏层的维数为 1024-512-512，解码器中隐藏层的维数为512-1024-dtd\_{t}dt​，其中 dtd\_{t}dt​ 表示目标向量的维数。排序塔的多层感知器中隐藏层的维度为 512-256。在本文中，Adam 优化器 \[31\] 相关超参设置为 β1\=0.9\\beta\_{1} = 0.9β1​\=0.9 和 β2\=0.999\\beta\_{2} = 0.999β2​\=0.999 。

结果汇总在表 2 中。 LLAE 的性能优于基本的 EmbLR 方法。在新用户上获得了 0.6% ∼\\sim∼ 0.9% 的 AUC 提升，这对于大规模的真实世界数据集来说意义重大。但是，LLAE 仅限于线性变换并基于线性逻辑回归。与其他五个深度模型相比，可以观察到 LLAE 的弱表示能力，这证明了非线性变换和深度模型结构的有效性。

![](/images/jueJin/c96cfd3f7cdf4a8.png)

对于 MetaEmb 和 MAIL-Base，使用 BaseDNN 模型作为基线，在新用户上获得了 0.8% ∼\\sim∼ 1.3% 的 AUC 提升。本文提出的 MAIL-Base 基于用户属性生成行为偏好以解决 CSR，而 MetaEmb 为排序模型提供了更好的初始化 embedding 。相比之下，MAIL 的生成策略比 MetaEmb 的初始化策略更有效。此外，通过比较 MAIL-Base 和 MAIL-DMR，可以观察到 MAIL 可以在排序塔中使用更好的模型来实现预估性能的增量提升。对于公共数据集，MAIL 通过将 BaseDNN 替换为 DMR，将新用户的 AUC 从 0.5934 提高到 0.5958。对于工业数据集，新用户的 AUC 从 0.6849 提高到 0.6895。MAIL 框架提出的与模型无关的属性对于实际应用非常具有有意义，因为实际业务中存在各种各样的排序模型，其可能与业务强耦合，无法直接抽离，所以提供一种在原有模型基础上的补充模块，对实际应用非常重要。

此外，虽然冷启动方法 LLAE、MetaEmb 和 MAIL 专注于新用户，但我们发现它们对老用户的 AUC 也略有提升。对于公共数据集，可以观察到老用户的 AUC 提升了 0% ∼\\sim∼ 0.06%。 对于工业数据集，在老用户上取得了 0% ∼\\sim∼ 0.1% 的 AUC 提升。 冷启动方法通过生成虚拟行为偏好或用一个更优的初始化 embedding 来缓解了排序模型的数据稀疏问题，从而能够提高性能。 GAUC 评估结果与 AUC 的结果相似。

![](/images/jueJin/f10eee6753b94fb.png)

### 4.3 消融实验

零样本塔的训练损失 Lzst\\mathcal{L}\_{zst}Lzst​ 中由三个部分组成，包括两个跨模态重建的 loss 和 MMD loss。本节，我们将进行消融实验以探索这三个部分的有效性。我们设计了5个模型进行比较，如下所示：

1.  **BaseDNN** BaseDNN 是图 2 所示的排序塔。
2.  **MAIL-None** MAIL-None 在零样本塔中没有零样本训练损失，只有用户属性到用户行为的线性映射。 MAIL-None 的排序塔是 BaseDNN。
3.  **MAIL-Single** MAIL-Single 的零样本塔是由公式（3）训练可得。 MAIL-Single 的排序塔是 BaseDNN。
4.  **MAIL-Dual** MAIL-Dual 的零样本塔由公式 (3) 和 (4) 训练可得。 MAIL-Dual 的排序塔是 BaseDNN。
5.  **MAIL-Base** MAIL-Base 的零样本塔由公式（7）训练可得。 MAIL-Base 的排序塔是 BaseDNN。

表 2 给出了 MAIL 在公共和工业数据集上使用不同的零样本塔的结果。如表所示，MAIL-None 和 MAIL-Single 的结果比 BaseDNN 差。对于公共数据集，BaseDNN 新用户的 AUC 为 0.5862，而 MAIL-None 和 MAIL-Single 的 AUC 分别为 0.5834 和 0.5844。对于工业数据集，BaseDNN 新用户的 AUC 为 0.6771，而 MAIL-None 和 MAIL-Single 的 AUC 分别为 0.6755 和 0.6764。这两个模型根据用户属性生成虚拟数据，但没有将用户行为作为输入来进一步规范自编码器的生成，这会导致模型过度拟合和效果下降。相比之下，MAIL-Dual 和 MAIL-Base 的效果要好得多，通过对齐跨模态重构和最大均值差异进行更强的正则化，减少了用户行为和用户属性之间的模态转移问题，从而为排序模型生成更加合适的虚拟行为偏好。

此外，MAIL-None 和 MAIL-Single 生成的不可靠行为偏好对老用户的模型性能也有轻微影响。在公共数据集上，AUC 下降 0.06% ∼\\sim∼ 0.12%。在工业数据集上，AUC 下降 0.05% ∼\\sim∼ 0.07%。相比之下，MAIL-Dual 和 MAIL-Base 并没有发现影响老用户的排序效果。

同时，我们在图 4 中展示了 MAIL-Base 的训练损失，包括排序塔的损失 Lrt\\mathcal{L}\_{rt}Lrt​，基于行为的跨模态重建损失 La\\mathcal{L}\_{ a}La​、基于属性的跨模态重建损失 Lv\\mathcal{L}\_{v}Lv​ 和MMD损失 Ld\\mathcal{L}\_{d}Ld​。 一般来说，公共数据集和工业数据集的训练损失会在 100 个batch中迅速下降，这也验证了从用户属性到用户行为的可学习性。

### 4.4 可视化研究

在本小节中，我们使用 t-SNE \[36\] 对零样本塔中的各种隐藏特征进行可视化研究。

#### 4.4.1 公共数据集的可视化

对于公共数据集，我们提供了生成的特征 v^\\hat{v}v^ 和真实特征 vvv 之间的可视化比较，以验证零样本塔的有效性。需要提一点，公共数据集中的新用户是通过从数据集中删除他们的行为数据而产生的；因此，我们可以对老用户（v^s\\hat{v}\_{s}v^s​ 和 vsv\_{s}vs​）和新用户（v^o\\hat{v}\_{o}v^o​ 和 vov\_{o}vo​)。可视化如图 5 所示，大部分黄色点与紫色点重叠，生成的特征分布被真实分布覆盖，这证明了零样本学习损失对模态转移问题的有效性。

#### 4.4.2 工业数据集的可视化

对于工业数据集，我们提供了新用户特征和老用户特征之间的可视化比较，来验证我们之前提出的假设： 如果用户共享属性空间，可以使得用户的行为从老用户迁移到新用户。具体来说，hsah\_{s}^{a}hsa​ 与 hovh\_{o}^{v}hov​ 比较，vs^\\hat{v\_{s} }vs​^​ 与 vo^\\hat{v\_{o}}vo​^​ 进行比较。具体可视化结果如图6所示。可以观察到新用户的属性分布 hsah\_{s}^{a}hsa​ 与老用户的属性分布 hovh\_{o}^{v}hov​ 几乎相同，由此验证了所有用户都享有共同属性空间的假设。此外，在共同特征空间下，生成的 vs^\\hat{v\_{s}}vs​^​ 和 vo^\\hat{v\_{o}}vo​^​ 也相似，这也进一步证明了基于属性的行为从老用户转移到新用户的可行性。

#### 4.5 在线 A/B 结果验证

我们进行了在线 A/B 测试，以验证我们推荐系统中实际应用中的模型效果。 MAIL-DMR 和 DMR 分别部署以进行比较，其中每个模型分配了 300 万用户。在半个月的 A/B 测试中，本文提出的 MAIL-DMR 与 DMR 相比，CTR 提高了 13% ∼\\sim∼ 15% 和 CTCVR 提高了 3% ∼\\sim∼ 4%，且该模型已经在我们推荐场景全量上线。值得注意的是，只有当用户对推荐 item 真正感兴趣时，他们才会做一些转化或消费行为，例如购买商品、收藏歌曲、消费直播。因此，我们强调 MAIL-DMR 的重要贡献是在实际业务中是对 CTCVR 改进提升，这比 CTR 的改进更加困难。

5 结论
----

在本文中，我们提出了 MAIL 双塔框架 来解决推荐系统的冷启动问题。受零样本学习思想的启发，本文设计了一个全新的零样本塔，并与 MAIL 中的模型无关排序塔进行了联合训练。通过跨模态重建和基于最大平均差异的模态对齐，零样本塔根据老用户的属性将行为偏好迁移到新用户上。基于零样本塔产出的虚拟行为偏好，排序塔可以更好地捕捉新用户的兴趣并进行推荐。与以往提出的模型算法不同，本文的 MAIL 框架中排序塔可以用任意 embedding-based 的深度模型替换，与具体模型结构无关，这就允许 MAIL 在以前的工作基础上实现增量性能改进。为了进一步验证 MAIL 的有效性，我们在两个大规模的真实数据集上进行了排序实验、消融实验和可视化研究。此外，我们也将提出的 MAIL 部署在云音乐的在线大规模直播推荐系统上，并实现了 CTR 和 CTCVR 的大幅度提升。

参考文献
----

*   \[1\] Yann Lecun, Yoshua Bengio, Geoffrey Hinton. 2015. Deep learning. Nature, 521, 7553 (2015), 436-444.
    
*   \[2\] JingJing Li, Ke Lu, Zi Huang, and Heng Tao Shen. 2017. Two birds one stone: on both cold-start and long-tail recommendation. In Proceedings of the 25th ACM international conference on Multimedia (MM), 32 (2017), 898-906. ACM.
    
*   \[3\] Martin Arjovsky, Soumith Chintala, and Leon Bottou. 2017. Wasserstein GAN. In Proc. ICML, 2017, 1-32.
    
*   \[4\] JiangJing Li, Mengmeng Jiang, Ke Lu, Lei Zhu, Yang Yang, and Zi Huang. 2019. From zero-shot learning to cold-start recommendation. In Proceedings of the AAAI Conference on Artificial Intelligence, 33 (2019), 4189-4196.
    
*   \[5\] Xinghua Wang, Zhaohui Peng, Senzhang Wang, S Yu Philip, Wenjing Fu, Xiaokang Xu, and Xiaoguang Hong. 2019. CDLFM: cross-domain recommendation for cold-start users via latent feature mapping. Knowledge and Information Systems 2019, 1-28.
    
*   \[6\] Yanwei Fu, Tao. Xiang, Yu-Gang Jiang, Xiaoyang Xue, Leonid Sigal, and Shaogang Gong. 2018. Recent advances in zero-shot recognition: toward data-efficient understanding of visual content. IEEE Signal Processing Magazine, 35, 1 (2018), 112-125.
    
*   \[7\] Wang-Cheng Kang and Julian McAuley. 2018. Self-attentive sequential recommendation. In Proceedings of International Conference on Data Mining (ICDM) 2018, 197-206.
    
*   \[8\] Christoph H. Lampert, Hannes Nickisch, and Stefan Harmeling. 2009, Learning to detect unseen object classes by between-class attribute transfer. In Proc. IEEE Conf. CVPR 2009, 951-958.
    
*   \[9\] Jian Wei, Jianhua He, Kai Chen, Yi Zhou, and Zuoyin Tang. 2017. Collaborative filtering and deep learning based recommendation system for cold start items. Expert Systems with Applications, 69 (2017), 29-39.
    
*   \[10\] Hoyeop Lee, Jinbae Im, Seongwon Jang, Hyunsouk Cho, and Sehee Chung. 2019. MeLU: meta-learned user preference estimator for cold-start recommendation. In Proceedings of the 25th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining. ACM 2019, 1073-1082.
    
*   \[11\] Fan Wang, Weiyi Zhong, Xiaolong Xu, Wajid Rafique, Zhili Zhou, and Lianyong Qi. 2020. Privacy-aware cold-start recommendation based on collaborative filtering and enhanced trust. In IEEE 7th International Conference on Data Science and Advanced Analystics 2020, 655-663.
    
*   \[12\] Zeynep Akata, Florent Perronnin, Zaid Harchaoui, and Cordelia Schmid. 2013. Label-embedding for attribute-based classification. In Proc. IEEE Conf. CVPR}, 2013, 819-826.
    
*   \[13\] Yuanfu Lu, Yuan Fang, and Chuan Shi. 2020. Meta-learning on Heterogeneous Information Networks for Cold-start Recommendatio. In Processdings of ACM SIGKDD International Conference on Knowledge & Data Mining. ACM 2020, 1563-1574.
    
*   \[14\] Mohammd Norouzi, Tomas Mikolov, Samy Bengio, Yoram Singer, Jonathon Shlens, Andrea Frome, Greg S. Corrado, and Jeffrey Dean. Zero-shot learning by convex combination of semantic embeddings. arXiv pre-print [arxiv.org/abs/1312.56…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1312.5650 "https://arxiv.org/abs/1312.5650"), 2013.
    
*   \[15\] Jovian Lin, Kazunari Sugiyama, Min-Yen Kan, and Tat-Seng Chua. 2013. Addressing cold-start in app recommendation: latent user models constructed from twitter followers. In ACM SIGIR 2013, 283-292.
    
*   \[16\] Xiao Ma, Liqin Zhao, Guan Huang, Zhi Wang, Zelin Hu, Xiaoqiang Zhu, Kun Gai, 2018. Entire space multi-task model: an effective approach for estimating post-click conversion rate. In the 41st International ACM SIGIR Conference 2018, 1137-1140.
    
*   \[17\] Dheeraj Bokde, Sheetal Girase, and Debajyoti Mukhopadhyay. 2015. Matrix factorization model in collaborative filtering algorithms: a survey. Procedia Computer Science 49 (2015), 136-146.
    
*   \[18\] Ze Lyu, Yu Dong, Chengfu Huo, Weijun Ren. 2020. Deep match to rank model for personalized click-through rate prediction. In Proceedings of the AAAI Conference on Artificial Intelligence 34 (2020). 156-163.
    
*   \[19\] Haiyan Zhao, Shengsheng Wang, Qingkui Chen, and Jian Cao. 2015. Probabilistic matrix factorization based on similarity propagation and trust propagation for recommendation. In IEEE Conference on Collaboration and Internet Computing 2015, 90-99.
    
*   \[20\] Liang Zhao, Yang Wang, Daxiang Dong, and Hao Tian. 2019. Learning to recommend via meta parameter partition. arXiv preprint [arxiv.org/abs/1912.04…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1912.04108 "https://arxiv.org/abs/1912.04108") (2019).
    
*   \[21\] Romera-Paredes, Philip H. S. Torr. 2015. An embarrassingly simple approach to zero-shot learning. In International Conference on Machine Learning, 2015, 2152-2161.
    
*   \[22\] Jian Wei, Jianhua He, Kai Chen, Yi Zhou, and Zuoyin Tang. 2016. Collaborative filtering and deep learning based hybrid recommendation for cold start problem. In 2016 IEEE 14th International Conference on Dependable, Autonomic and Secure Computing, IEEE, 874-877.
    
*   \[23\] Yongqin Xian, Christoph H. Lampert, Bernt Schiele, Zeynep Akata. 2019. Zero-shot learning - a comprehensive evaluation of the good, the bad and the ugly. IEEE Transactions on. Pattern Anal. Mach. Intell., 41, 9 (2019), 2251-2265.
    
*   \[24\] Abhay Kumar, Nishant Jain, Suraj Tripathi, Chirag Singh. 2019. From fully supervised to zero-shot settings for Twitter hashtag recommendation. In Proceedings of International Conference on Computational Linguistics and Intelligent Text Processing (CICLING) 35 (2019), 1-12.
    
*   \[25\] Balazs. Hidasi, Massimo. Quadrana, Alexandros. Karatzoglou, and Doomonkos Tikk. 2016. Parallel recurrent neural network architectures for feature-rich session-based recommendations. In Proceedings of ACM Conference on Recommender Systems (RecSys.) 2016, 241-248
    
*   \[26\] Fei Chen, Zhenhua Dong, Zhenguo Li, and Xiuqiang He. 2019. Federated Meta-Learning with Fast Convergence and Efficient Communication. arXiv preprint [arxiv.org/abs/1802.07…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1802.07876 "https://arxiv.org/abs/1802.07876") (2019).
    
*   \[27\] Cheng Te Li, Chia Tai Hsu, and Man Kwan Shan. 2018. A cross-domain recommendation mechanism for cold-start users based on partial least squares regression. ACM Transactions on Intelligent Systems and Technology (TIST) 9, 6 (2018), 1-26.
    
*   \[28\] Feiyang Pan, Shuokai Li, Xiang Ao, Pingzhong Tang, and Qing He. 2019. Warm up cold-start advertisements: improving CTR predictions via learning to learn ID embeddings. In SIGIR 2019. 695-704.
    
*   \[29\] Zhong Ji, Yuxin Sun, Yunlong Yu, Yanwei Pang, and Jungong. Han. 2020. Attribute-guided network for cross-modal zero-shot hashing, IEEE Trans. Neural Netw. Learn. Syst. 31, 1 (2020), 321-330.
    
*   \[30\] Shuai Zhang, Lina Yao, Aixin Sun, and Yi Tay. 2019. Deep learning based recommender system: A survey and new perspectives. ACM Computing Surveys (CSUR) 52, 1 (2019), 1-35.
    
*   \[31\] Diederik Kingma and Jimmy Ba. 2014. Adam: A method for stochastic optimization. arXiv preprint [arxiv.org/abs/1412.69…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1412.6980 "https://arxiv.org/abs/1412.6980") (2014).
    
*   \[32\] Yu Zhu, Jinghao Lin, Shibi He, Beidou Wang, Ziyu Guan, Haifeng Liu, and Deng Cai. 2019. Addressing the item cold-start problem by attribute-driven active learning. IEEE Transactions on Knowledge and Data Engineering 2019, 1-14.
    
*   \[33\] Liangjun Feng, Chunhui Zhao. 2020. Transfer increment for generalized zero-shot learning. IEEE Trans. Neural Networks and Learning Systems 2020, 1-15.
    
*   \[34\] Heng-Tze Cheng, Levent Koc, et al. 2016. Wide & Deep Learning for Recommender Systems. In DLRS 2016, 1-4.
    
*   \[35\] Szu-Yu Chou, Yi-Hsuan Yang, Jyh-Shing Roger Jang, and Yu-Ching Lin. 2016. Addressing cold start for next-song recommendation. In Proceedings of the 10th ACM Conference on Recommender Systems 2016. 115-118.
    
*   \[36\] Laurens, Van Der Maaten, and Geoffrey Hinton. 2008. Visualizing Data using t-SNE. Journal of Machine Learning Research 9, 2605 (2008), 2579-2605.