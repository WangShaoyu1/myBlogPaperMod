---
author: "王宇"
title: "智能问答FAQ四月学习小结LMX"
date: 四月26,2023
description: "李明仙"
tags: ["李明仙"]
ShowReadingTime: "12s"
weight: 492
---
1\. 问题模式
========

第一种问题简明、直接，通常询问定义、方法、意见或者事实，同时包含大量领域内的专有词语。

第二种问题的特点是结构比较复杂，一般提问者在提出问题前会先给出一段比较长的背景描述，为后面的提问设定一个情景，然后再提出问题。

1.1. 问题模式判断
-----------

首先判断问题类型，简洁模式问题通常只由一句话组成，而情景模式问题由于需要描述背景，一般需要由多个分句构成，这里的分句是以逗号、分号、句号、问号等来分隔的。避免误判多个简明句组成的连问。简洁模式问题可以直接判断问句的相似度。情景模式问题把问句拆分为情景和情景问题，情景从问题-答案语料库中提取，采用情景特征词集合的形式来表达。情景模式问题的相似度计算需要综合考虑情景部分的相似度和问句部分的相似度。

![](/download/attachments/101816312/image2023-4-26_10-48-41.png?version=1&modificationDate=1682477321994&api=v2)

1.2. 基于简洁问句的识别算法
----------------

### 1.2.1. 组合问句相似度计算方法

将词形相似度、问句长度相似度、词序相似度及距离相似度组合起来,根据各相似度所起作用的大小分别赋予不同的权重,最后将各相似度与其权重的乘积进行相加求和,从而计算出问句的相似度。

步骤：

(0)输入需要计算相似度的两个问句_q_1和_q_2;输出_q_1和_q_2的相似度。

(1)利用问句预处理模块对两个问句进行分词等预处理,并利用同义词词库进行关键词扩展,得到各个问句的关键词集。

(2)计算词序相似度、词形相似度、句长相似度和距离相似度。

(3)通过给各个相似度进行加权求和,得到两个问句_q_1和_q_2的相似度。

词形相似度：词形相似度方法是通过计算两个问句的词形即相同词的个数来比较相似度的。两个问句相同的词数越多,两个问句越相似。

问句长度相似度：问句长度相似性在一定程度上反映了问句形态上的相似性。从问句整体上来看,两句子长度相差越小,两个句子相似的可能性越大。

词序的相似度：关键词的顺序可以反映两个问句中所含相同词或同义词在位置关系上的相似程度。当一个分句或短语整体发生长距离移动后,使用词序相似度可以发现其仍与原来的语句很相似。

距离相似度：编辑距离是指把一个以字为单位的句子变成另一个以字为单位的句子所需要最小的编辑操作个数。编辑操作有插入、删除和替换3种。例以普通编辑距离算法为基础,采用词语取代单个的汉字或字符作为基本的编辑单元参与运算,借助构建的同义词词库作为语义资源来计算词汇之间的语义距离,并且给不同编辑操作赋予不同的权重。

### 1.2.2. 基于关键词向量空间模型的_TFIDF_问句相似度计算方法

TF (Term Frequency)词频，描述的是一个词在一个文档中出现的频率

IDF(Inverse Document Frequency) (逆文档频率)描述的是一个词在所有句子中出现的次数。如果一个词在很多句子都出现过，那么可以认为，这个词通用性较强，所以不具备一定的区分能力。

  

1、余弦相似度

余弦相似度量：计算个体间的相似度。相似度越小，距离越大。相似度越大，距离越小。

余弦相似度算法：一个向量空间中两个向量夹角间的余弦值作为衡量两个个体之间差异的大小，余弦值接近1，夹角趋于0，表明两个向量越相似，余弦值接近于0，夹角趋于90度，表明两个向量越不相似。

思路： 1、分词；2、列出所有词；3、分词编码；4、词频向量化；5、套用余弦函数计量两个句子的相似度。

参考资料：

[FAQ 检索式问答系统学习记录\_faq检索系统简介\_桂花很香,旭很美的博客-CSDN博客](https://blog.csdn.net/weixin_40959890/article/details/127500586?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168247255416800226571976%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168247255416800226571976&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-1-127500586-null-null.142^v86^insert_down1,239^v2^insert_chatgpt&utm_term=%E5%A6%82%E4%BD%95%E6%8F%90%E9%AB%98FAQ%E8%AF%86%E5%88%AB%E6%AD%A3%E7%A1%AE%E7%8E%87&spm=1018.2226.3001.4187)

[常见文本相似度计算方法简介 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/88938220)

[(55条消息) 【转载】基于结巴分词的文本余弦相似性计算\_不懂人情世故的天才的博客-CSDN博客](https://blog.csdn.net/Tink_bell/article/details/129669959?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-129669959-blog-123808182.235%5Ev32%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-129669959-blog-123808182.235%5Ev32%5Epc_relevant_default_base3&utm_relevant_index=5) 

[(55条消息) java 向量相似度计算 tf-idf\_使用 TF-IDF 加权的空间向量模型实现句子相似度计算...\_米西西的博客-CSDN博客](https://blog.csdn.net/weixin_29202213/article/details/114154274?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168247861416800211549642%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=168247861416800211549642&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-1-114154274-null-null.blog_rank_default&utm_term=%E5%9F%BA%E4%BA%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E5%90%91%E9%87%8F%E7%A9%BA%E9%97%B4%E6%A8%A1%E5%9E%8B%E7%9A%84TFIDF%E9%97%AE%E5%8F%A5%E7%9B%B8%E4%BC%BC%E5%BA%A6%E8%AE%A1%E7%AE%97%E6%96%B9%E6%B3%95&spm=1018.2226.3001.4450)

[(55条消息) NLP合集:教程/实体抽取/关系(三元组)抽取/文本分类/知识图谱/Bert系列/相似度判定/机器人问答/文本工具/竞赛方案精选/面试指南/NLP各类任务数据集等集合\_爬取百度百科抽取三元组\_Mr\_不想起床的博客-CSDN博客](https://blog.csdn.net/qq_42189083/article/details/111614140?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-111614140-blog-80161213.235%5Ev32%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-111614140-blog-80161213.235%5Ev32%5Epc_relevant_default_base3&utm_relevant_index=5)

董自涛,包佃清,马小虎.智能问答系统中问句相似度计算方法\[J\].武汉理工大学学报(信息与管理工程版),2010,32(01):31-34.

周建政,谌志群,李治等.问答系统中问题模式分类与相似度计算方法\[J\].计算机工程与应用,2014,50(01):116-120. 

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)