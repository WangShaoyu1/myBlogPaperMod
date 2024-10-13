---
author: "王宇"
title: "NVIDIAChatWithRTXDemo测评、理解、拓展"
date: 三月21,2024
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 194
---
1\. 安装
======

类别

详情

备注

下载地址

[https://www.nvidia.cn/ai-on-rtx/chat-with-rtx-generative-ai/](https://www.nvidia.cn/ai-on-rtx/chat-with-rtx-generative-ai/)

  

  

  

  

系统要求

平台：Windows

  

GPU：NVIDIA GeForce® RTX 30 或 40 系列 GPU 或配备至少 8GB VRAM 的 NVIDIA RTX™ Ampere 或 Ada Generation GPU

  

RAM：16GB 或更高

  

操作系统：Windows 11

  

驱动：535.11 或更新版本驱动

  

文件大小：35 GB

  

参考资料

[https://blogs.nvidia.cn/2024/01/08/generative-ai-rtx-pcs-and-workstations/](https://blogs.nvidia.cn/2024/01/08/generative-ai-rtx-pcs-and-workstations/)

  

2\. 试用Demo
==========

        2024.1.8，NVIDIA 发布由 TRT-LLM 加速的 Chat with RTX 技术 Demo，让 AI 爱好者能与他们的笔记、文档和其他内容进行交互。

3\. 测评
======

3.1. 测评数据准备
-----------

       系统默认有两个大模型：Mistral 7B int4、Llama2 13B int4，对中文的支持程度较差。测评数据做了一定程度的变通，将知识库、问题翻译为英文，每回合的回答也是英文，这对判断其答案是否准确带来了一定的识别困难。同时对于翻译的准确性也要打一个折扣。

**先将测试用例进行分类：**

 

类别

个数

Mistral 7B

错误数

百分百

Llama2 13B

错误数

百分百

备注

类别

个数

Mistral 7B

错误数

百分百

Llama2 13B

错误数

百分百

备注

个人属性

15

  

7

9.2%

  

2

5.1%

  

集团介绍

16

  

14

**18.4%**

  

5

**12.8%**

  

影子介绍

12

  

9

**11.8%**

  

5

**12.8%**

  

产品介绍

19

  

15

**19.7%**

  

10

**25.6%**

  

解决方案

12

  

8

10.5%

  

4

10.3%

  

秀博+饲料

8

  

7

9.2%

  

3

7.7%

  

领导介绍

6

  

3

3.9%

  

2

5.1%

  

闲聊

15

  

7

9.2%

  

4

10.3%

  

常识问答

17

  

6

7.9%

  

4

10.3%

  

  

  

  

76

100.0%

  

39

100.0%

  

### 3.1.1. Mistral 7B int4

**Mistral 7B**

数据

详情

  

  

  

  

知识库

[en\_spring\_festival\_1\_105\_translate\_20240223121931.doc](/download/attachments/119679388/en_spring_festival_1_105_translate_20240223121931.doc?version=1&modificationDate=1710120491714&api=v2)

  

  

  

  

测评结果

[春节知识库.xlsx](/download/attachments/119679388/%E6%98%A5%E8%8A%82%E7%9F%A5%E8%AF%86%E5%BA%93.xlsx?version=3&modificationDate=1710572488814&api=v2)

"测试结果-Mistral 7B"页签

问题总数

正确

错误

部分对

120

31

76

13

  

25.8%

63.3%

10.8%

  

  

  

  

  

  

  

  

  

  

### 3.1.2. Llama2 13B int4

Llama2 13B

数据

详情

  

  

  

  

知识库

[en\_spring\_festival\_1\_105\_translate\_20240223121931.doc](/download/attachments/119679388/en_spring_festival_1_105_translate_20240223121931.doc?version=1&modificationDate=1710120491714&api=v2)

  

  

  

  

测评结果

[春节知识库.xlsx](/download/attachments/119679388/%E6%98%A5%E8%8A%82%E7%9F%A5%E8%AF%86%E5%BA%93.xlsx?version=3&modificationDate=1710572488814&api=v2)

“测试结果-Llama2 13B”页签

问题总数

正确

错误

部分对

120

58

39

23

  

48.3%

32.5%

19.2%

  

  

  

  

  

  

3.2. 分析
-------

        当前项目是一个演示Demo版本，实现的是于自己电脑上的文件进行AI对话，利用检索增强技术（RAG）、TensorRT-LLM和RTRX加速，基于项目[https://github.com/NVIDIA/trt-llm-rag-windows](https://github.com/NVIDIA/trt-llm-rag-windows) 构建而成

### 3.2.1. 什么是RAG

 概念版：【大型语言模型（LLM）的检索增强生成（RAG）旨在通过在推理过程中**利用外部数据存储**来提高预测的准确性。这种方法构建了一个包含上下文、历史数据和最新或相关知识的综合提示】

分析：这是一种有效利用大预言模型LLM与我们专有数据之间的桥梁，一般的，要解决这个问题，有两个主流的思路，一个是微调（Fine-Tuning）和检索增强生成（Retrieval-Augmented Generation，简称RAG)，两种方法各有千秋。

从问题出发：**让大模型适应特定的行业或私有信息**

方案对比：

  

  

备注

  

  

备注

  

  

概念

**大模型LLM**

        大模型LLM通过训练大量的数据来获得广泛的通用知识，这些知识被存储在神经网络的权重（参数记忆）中。但是，当需要LLM生成需要训练数据之外的知识（如最新的、专有或者特定领域的信息）就有可能导致事实上的不准确（“幻觉”）。

**专有数据**

        不在互联网的数据、行业独有数据、企业数据、个人非公开数据等等

  

【方法】

  

  

*   微调

1.  消耗大量计算资源
2.  花费高
3.  需技术高手操盘

  

*   检索增强生成

亮点在于：将生成内容的模型（即是LLM）和一个能进行信息检索的模块结合在一起，这样，模型就可以直接从一个更新的外部知识源那里获得所需信息了

1.  基本工作流如下：![](https://pic1.zhimg.com/v2-8e9aec4aa1da405f08a57b69b6e16d94_r.jpg)
2.  检索、增强、生成。

  

  

  

4\. 拓展~~~增加其他大模型
================

  

  

  

5\. 思考
======

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)