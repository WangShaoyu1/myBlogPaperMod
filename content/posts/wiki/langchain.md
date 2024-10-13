---
author: "王宇"
title: "langchain"
date: 一月02,2024
description: "任鹏"
tags: ["任鹏"]
ShowReadingTime: "12s"
weight: 337
---
**LangChain** 是一个基于大模型开发应用的框架。他能够让应用变得

1、情景感知 带着上下文连接大模型

2、推理 依赖大模型推理。基于提供的情景，提供推理，基于推理的答案执行动作。

python [https://github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)

java [https://github.com/langchain4j/langchain4j](https://github.com/langchain4j/langchain4j)

六大核心模块
======

模型（models） : LangChain 支持的各种模型类型和模型集成。

提示（prompts） : 包括提示管理、提示优化和提示序列化。

内存（memory） : 内存是在链/代理调用之间保持状态的概念。LangChain 提供了一个标准的内存接口、一组内存实现及使用内存的链/代理示例。

索引（indexes） : 与您自己的文本数据结合使用时，语言模型往往更加强大。

链（chains） : 链不仅仅是单个 LLM 调用，还包括一系列调用（无论是调用 LLM 还是不同的实用工具）。LangChain 提供了一种标准的链接口、许多与其他工具的集成。LangChain 提供了用于常见应用程序的端到端的链调用。

代理（agents） : 代理涉及 LLM 做出行动决策、执行该行动、查看一个观察结果，并重复该过程直到完成。LangChain 提供了一个标准的代理接口，一系列可供选择的代理，以及端到端代理。

模型（models）
==========

**LLMs**

大型语言模型（LLMs)是将文本字符串作为输入，并返回文本字符串作为输出。

**聊天模型**

聊天模型是常由语言模型支持，但它们的API更加结构化。 具体来说，这些模型将聊天消息列表作为输入，并返回聊天消息。

**文本嵌入模型**

将文本作为输入，并返回一个浮点数列表。

提示（prompts）
===========

“提示”指的是模型的输入。 这个输入很少是硬编码的，而是通常从多个组件构建而成的。 PromptTemplate负责构建这个输入。 LangChain提供了几个类和函数，使构建和处理提示变得容易。

**LLM提示模板**

如何使用PromptTemplates提示语言模型。

**聊天提示模板**

如何使用PromptTemplates提示聊天模型。

**示例选择器**

通常情况下，在提示中包含示例很有用。 这些示例可以是硬编码的，但如果它们是动态选择的，则通常更有力。 

**输出解析器**

语言模型（和聊天模型)输出文本。 但是，很多时候，您可能希望获得比仅文本更结构化的信息。 这就是输出解析器的作用。 输出解析器负责（1)指示模型应该如何格式化输出， （2)将输出解析为所需的格式

内存（memory）
==========

默认情况下，Chains和Agents是无状态的，这意味着它们独立地处理每个传入的查询（就像底层的LLMs和聊天模型一样）。在某些应用程序中（聊天机器人是一个很好的例子），记住以前的交互非常重要，无论是在短期还是长期层面上。 “记忆”这个概念就是为了实现这一点。

LangChain以两种形式提供记忆内存 （Memory）组件。

首先，LangChain提供了管理和操作以前的聊天消息的辅助工具。

索引（indexes）
===========

索引是指构造文档的方法，以便 LLM 可以最好地与它们交互。此模块包含用于处理文档的实用工具函数、不同类型的索引，以及在链中使用这些索引的示例。

在链中使用索引的最常见方式是“检索”步骤。这一步是指接受用户的查询并返回最相关的文档。我们之所以这样区分，是因为(1)索引可以用于检索之外的其他事情，(2)检索可以使用索引之外的其他逻辑来查找相关文档。

链（chains）
=========

使用单独的LLM对于一些简单的应用程序来说是可以的，但许多更复杂的应用程序需要链接LLM——无论是相互链接还是与其他专家链接。LangChain为链提供了标准接口，以及一些常见的链实现，以便于使用。

代理（agents）
==========

根据用户输入，代理人可以决定是否调用其中任何一个工具。

  

demo
====

[?](#)

`from langchain.llms` `import` `OpenAI`

`from langchain.prompts` `import` `PromptTemplate`

`llm = OpenAI(temperature=``0.9``, max_tokens=``500``)`

`prompt = PromptTemplate(`

    `input_variables=[``"product"``],`

    `template=``"给制造{product}的有限公司取10个好名字，并给出完整的公司名称"``,`

`)`

`from langchain.chains` `import` `LLMChain`

`chain = LLMChain(llm=llm, prompt=prompt)`

`print(chain.run({`

    `'product'``:` `"高大上的智能微波炉"`

    `}))`

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)