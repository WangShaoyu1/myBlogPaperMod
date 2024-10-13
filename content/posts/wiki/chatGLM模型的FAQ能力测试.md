---
author: "王宇"
title: "chatGLM模型的FAQ能力测试"
date: 八月23,2023
description: "唐玮"
tags: ["唐玮"]
ShowReadingTime: "12s"
weight: 324
---
1\. 模型介绍
========

chatGLM2-6B模型是由清华大学数据挖掘小组THUDM研发的开源大模型。在2023年这个模型引起了很大的关注，因为这是当前同时支持开源、可商用、耗费资源很少的大模型。chatGLM-6B可以部署在消费级的显卡上运行，也就是说只要拥有一台包含8G显存的GPU，就能本地部署大模型。8G的GPU当前的价位大概是3K左右。很多玩游戏用的中高端电脑都能运行。

chatGLM2-6B有60亿的模型参数，相比chatGPT（1750亿参数）相差甚远，这是主动缩减的结果。模型参数减小，让运行模型所需的GPU资源变低。

2\. 测评
======

2.1. FAQ测试
----------

使用 [GLM模型对比测试.xlsx](/download/attachments/105272416/GLM%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E6%B5%8B%E8%AF%95.xlsx?version=1&modificationDate=1690859188207&api=v2) 数据进行测试。该数据集包含99条数据，有测试问句、期望问题、期望回答3个字段。通过输入测试问题，评估模型的回复与期望回答的意思是否一致。并与FTT系统的FAQ功能进行比对。

对于大模型均统一使用一下prompt：

你是一款名为小万的聊天机器人，您的工作是按照给定的指令回答用户的问题。

上下文开始  
{context}  
上下文结束

要求：不超过50字，完全根据上下文的回答指令回答，不允许在回答中添加编造成分”  
问题：{question}  
回答：

*   **chatGLM2-6B（微调+知识库）**：使用“服务助手测试问句0529.xlsx”FAQ数据对chatGLM2-6B进行微调训练后的模型。同时基于Langchain框架嵌入知识库，相似度阈值为1.7，embedding模型为GanymedeNil/text2vec-large-chinese。
*   **chatGLM2-6B（微调）**：使用“服务助手测试问句0529.xlsx”FAQ数据进行微调训练后的模型。
*   **chatGLM2-6B（知识库）**：使用原生的chatGLM2-6B模型。同时基于Langchain框架嵌入知识库，相似度阈值为1.7，embedding模型为GanymedeNil/text2vec-large-chinese。

  

ps. “服务助手测试问句0529.xlsx”FAQ数据去除了ASR同音数据，具体如下：

万得厨-万得出、万能除、万德福；商城-山城、三成；预制菜-一只菜；APP-ab；blunch-brunch；微波-微博；扬翔-杨翔、杨祥；数影-素影、输赢；万得科技-万的科技；盈康-银康；新谊宾-心宜宾；港丰-港风；了解-了姐；计划-记划

  

模型

准确率

正确数量

错误数量

模型

准确率

正确数量

错误数量

chatGLM2-6B（微调+知识库）

85%

85

14

chatGLM2-6B（微调）

69%

69

30

chatGLM2-6B（知识库）

64%

64

35

**LLama2-13B（微调+知识库）**

**82%**

**82**

**17**

LLama2-13B（知识库）

73%

73

26

FTT

71%

71

28

测试结果数据：[20230807\_GLM模型对比测试\_99.xlsx](/download/attachments/105272416/20230807_GLM%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E6%B5%8B%E8%AF%95_99.xlsx?version=1&modificationDate=1691478654071&api=v2)

3\. 场景测试
========

3.1. 一阶段测试
----------

**场景**：模型部署于手机端，并接入虚拟人

**场景的能力需求**：

1.  关于基本信息的问答：万得厨、万得厨APP、影子公司
2.  关于食谱信息的回答：食材、烹饪步骤、烹饪器材等
3.  关于预制菜的回答：烹饪码、盒子的处理等
4.  平台宣传
5.  食材处理
6.  美食推荐

**要求**：

1.  针对**1、2、3、4**回答准确率都要达到90%以上
2.  知识库是结构化的知识，而不是问答对。方便后续知识变更以后，模型能够立即识别并正确回答。
3.  总结探索大模型应用中 知识更新与模型更新 的流程步骤，并梳理其中的风险和规避风险的方法。（关注）

**后续考虑实验的方向**：

1.  要将多个能力集合成一个入口。而不是需要从多个入口去获取使用不同能力。
2.  输出食谱食品图片。
3.  直接操控、修改万得厨设备信息和动作。
4.  当输出为长文本的时候，另提供一个50字的总结文本提供给虚拟人进行播报
5.  **5**食材处理要具备和chatGPT3.5一样的效果

  

  

  

参考文献

1.  [GitHub - THUDM/ChatGLM-6B: ChatGLM-6B: An Open Bilingual Dialogue Language Model | 开源双语对话语言模型](https://github.com/THUDM/ChatGLM-6B)
2.  [清华大学开源中文版ChatGPT模型——ChatGLM-6B发布 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/614331448)
3.  [ChatGLM](https://chatglm.cn/blog)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)