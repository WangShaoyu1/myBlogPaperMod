---
author: "彩票中了3个亿"
title: "海山数据库(He3DB)+AI（五）：一种基于强化学习的数据库旋钮调优方法"
date: 2024-09-25
description: "@[TOC]0前言在海山数据库(He3DB)+AI（三）中，介绍了四种旋钮调优方法：基于启发式，基于贝叶斯，基于深度学习和基于强化学习。本文介绍一种基于强化学习的旋钮调优方法：QTune:A"
tags: ["数据库"]
ShowReadingTime: "阅读4分钟"
weight: 799
---
@\[TOC\]

### 0 前言

在海山数据库(He3DB)+AI（三）中，介绍了四种旋钮调优方法：基于启发式，基于贝叶斯，基于深度学习和基于强化学习。本文介绍一种基于强化学习的旋钮调优方法：QTune: A Query-Aware Database Tuning System with Deep Reinforcement Learning。

### 1 QTuner框架

数据库旋钮调优问题是一个NP-hard问题，现有的解决方法中仍存在一些不足：

1.  DBA无法在不同的环境中对大量的数据库实例进行调优；
2.  传统的机器学习方法依赖训练数据，而高质量的数据集难以获取；
3.  大多数方法只支持粗粒度调优，如负载层面的调优，无法提供细粒度的调优，如query层面的调优。

为了解决以上不足，本文提出了基于强化学习的调优框架QTuner。QTuner首先将SQL语句进行特征向量化，然后将特征向量输入到训练好的模型中获得合适的旋钮配置。该深度模型使用了强化学习中的actor-critic网络，基于查询向量和数据库状态进行调优，能够在训练样本不足的情况下获得较好的效果。

QTuner中提供了三种不同粒度的调优：

1.  **Query-level**：在该调优方法下，对于每个query，首先调整数据库的旋钮，然后执行查询，该方法可以优化延迟，但可能无法实现高吞吐量。
2.  **Workload-level**：该调优方法对整个工作负载的数据库旋钮进行调优，这种方法不能优化查询延迟，因为不同的query可能需要使用不同的最佳旋钮值，然而，这种方法可以实现高吞吐量，因为不同的query可以在设置新调整的旋钮后并行处理。
3.  **Cluster-level**：在该调优方法下，将query分成不同的组，为每个组进行旋钮调优，同一组中使用相同的旋钮配置，并执行并行查询，该方法可以同时优化延迟和吞吐量。

三种不同粒度的调优流程如下图所示：

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/87ef9f64c4a540a49d1c88e42266d650~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=DwuuSzOuqNKdVL62xyGw%2FFPUj0I%3D)

### 2 query特征化

在特征化的过程中，需要考虑以下问题：1）如何来捕获query的信息，如query中涉及多少表？2）如何捕获执行query的代价？3）如何对向量进行编码使得其维度一致？

#### 2.1 特征提取

本节主要回答第一和第二个问题，即如何捕获query和代价信息。

**（1）Query信息**

将一条Query语句进行分解，一般包括以下几个部分：**query类型**（如insert，delete和update等），**涉及的表**，**属性**，**操作**（如selection，join和groupby)。在以上部分中，哪些特征是重要的呢？首先，**query类型**是重要的，不同的类型具有不同的代价。其次，**涉及的表**也是重要的，表的数据量和结构会显著影响数据库的性能。而**属性**和**操作**可以忽略，原因有三：一是代价信息中会捕获操作信息，不需要对该信息进行重复编码；二是操作信息太过于具体，可能会导致泛化性能降低；三是属性和操作信息更新过于频繁，每次更新都需要对模型进行重新设计。

**（2）代价信息**

代价信息捕获处理这条query时的执行代价，出于实际情况，使用优化器的成本估计来代替实际的执行成本。

#### 2.2 编码方法

本节回答向量化的第三个问题，如何编码使其维度一致。

对于**query信息**，设计一个长度为4+∣T∣4+|T|4+∣T∣的向量，“4”对query类型（insert, select, update, delete）进行one-hot方式的编码，"T"代表数据库中的表，同样使用one-hot的方式进行编码。

对于**代价信息**，设计一个长度为MMM的向量，MMM代表数据库中操作的个数（如postgre数据库中有38个操作）。优化器生成查询计划后，每个操作计算其在计划树中的代价和，最后通过减去均值和除以标准差进行归一化。

将query向量和代价向量拼接在一起，就得到了最后的特征向量。如下图为一个将query进行特征向量化的过程。

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f63ec1d38a1c473aa9e297dfab118edb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=oeSfzSViL%2BfE1C7%2FrDSsOM9AtAI%3D)

以上是对一条query进行特征向量化的过程，在工作负载调优时，涉及多条query，假设其编码后的特征为v1,v2,...vmv\_1,v\_2,...v\_mv1​,v2​,...vm​，计算其并集，计算公式如下所示：

\[∪1mvi\[1\],…,∪1mvi\[4+∣T∣\],∑1mvi\[5+∣T∣\],⋯ ,∑1mvi\[4+∣T∣+∣P∣\]\[\\cup\_{1}^{m} v\_{i}\[1\], \\ldots, \\cup\_{1}^{m} v\_{i}\[4+|T|\], \\sum\_{1}^{m} v\_{i}\[5+|T|\], \\cdots, \\sum\_{1}^{m} v\_{i}\[4+|T|+|P|\]\[∪1m​vi​\[1\],…,∪1m​vi​\[4+∣T∣\],1∑m​vi​\[5+∣T∣\],⋯,1∑m​vi​\[4+∣T∣+∣P∣\]

### 3 DS-DDPG

在对query向量化后，将其输入DS-DDPG模型得到推荐的旋钮参数。本节首先介绍DS-DDPG框架，然后介绍该框架的训练过程。

#### 3.1 模型框架

DS-DDPG将旋钮调优问题建模为强化学习，将调优过程中的各个问题映射到各个强化学习模块，映射关系如下图所示：

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/537191e7f96843a8a1065ed3c93c44a4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=vdvbdiyMdUz%2FQG2VarBatn3lRuI%3D)

DS-DDPG模型框架如下图所示。执行步骤如下：

（1）Query(或Queries)通过**Query2Vector**生成特征向量；

（2）特征向量输入到**Predictor**中，Predictor是一个深度模型，预测处理query前后数据库的性能变化ΔS\\Delta SΔS；

（3）该变化传递到Environment，Environment中包括内部状态（如旋钮配置值）和外部特征（关键性能评价指标）；

（4）Environment将变化值ΔS\\Delta SΔS加到原来的性能SSS上得到执行query后的性能观察值S′(S′\=ΔS+S)S'(S'=\\Delta S + S)S′(S′\=ΔS+S);

（5）Actor是一个深度模型，根据性能观察值S′S'S′输出旋钮调优动作action;

（6）critic网络同样为一个深度模型，其根据性能变化ΔS\\Delta SΔS和action得到一个score，这个score判断旋钮调整是否有效;

（7）Environment得到这个action后进行执行query，得到一个旋钮调整后的性能反馈reward;

（8）critic根据reward更新其权重，actor根据score更新其权重。

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/23ef1d097bf74391951bb3079cb711cf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=v4Zl3QaMniLE%2FDHwwTeXSB1DWNI%3D)

#### 3.2 训练方法

在DS-DDPG模型中，包含了Predictor模型，Actor和Critic模型（Agent模型）。整体的训练流程如算法1所示:

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5f5ce617e3a44c52bbdbc290b68516fb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=32XT8bmILQlZhhViz95xIczp5tI%3D)

训练Predictor模型如算法2所示：

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/61edde2b18ef43c092fc2f653b1ab9c1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=gruULrTxmaQlsCMFw3BaOJf4p%2FM%3D)

训练Agent模型如算法3所示：

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c34afac38f9e4b2c9f3a208b2b3a12ad~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=v3cr5nofng1LW0Yuec9%2BTJbTLVM%3D)

### 4 Query分组

在Cluster-level进行调优时，对query进行分组调优，从而结合query层间调优的优化延迟和负载层面调优的高吞吐量这两个优点。每一个query得到一组配置参数，对所有的配置参数进行聚类分组。每个旋钮的值为不同区间的连续值，聚类中不需要如此精确的值，因此本文将每个旋钮离散化为 - 1，0，1 。具体来说，对于每个旋钮，如果调整后的旋钮值在默认值附近，将其设置为0；如果估计值远大于默认值设为-1，如果估计值远小于默认值设为-1。  
同时，为了避免聚类过程中的维度灾难问题，只选择最常调整的旋钮作为特征，如在Postgre中，选择20个旋钮，每个旋钮有3个可能的值，那么就有3203^{20}320种可能的情况，本文利用深度模型对离散特征进行进一步映射降低计算量，深度模型结构如下图所示。

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/033f8c8f99804d509d3c9a27f2e67181~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5b2p56Wo5Lit5LqGM-S4quS6vw==:q75.awebp?rk3s=f64ab15b&x-expires=1727859082&x-signature=GSTh55hiRDtRYqvReiVWdt%2BoJ5M%3D)

在获得每个query的深度特征后，根据特征的相似性将其分类到不同的簇中。本文使用DBSCAN算法进行聚类，DBSCAN在配置模式的基础上，根据距离度量和需要聚类的最少点数将距离较近的模式聚在一起，从而得到不同分组中的配置参数。