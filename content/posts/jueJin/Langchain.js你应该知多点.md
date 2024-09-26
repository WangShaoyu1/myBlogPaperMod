---
author: "叶知秋水"
title: "Langchain.js你应该知多点"
date: 2024-09-08
description: "关于Langchain.jsLangchain.js，在github上截止到今日已经有92k的start。之前一直偶有耳闻，但没有深入了解。今天看完后，真的是可以堪称大模型里的瑞士军刀。LangC"
tags: ["前端"]
ShowReadingTime: "阅读11分钟"
weight: 82
---
### 关于Langchain.js

Langchain.js，在github上截止到今日已经有92k的start。之前一直偶有耳闻，但没有深入了解。今天看完后，真的是可以堪称大模型里的瑞士军刀。

LangChain由Harrison Chase于2022年10月作为开源软件项目推出，用于连接 OpenAI 的 GPT API（后续已扩展到更多模型）以生成人工智能文本。在创立LangChain之前，Harrison Chase在Robust Intelligence（一家专注于测试和验证机器学习模型的MLOps公司）领导ML团队，并在Kensho（一家金融科技初创公司）领导实体链接团队。他曾在哈佛大学学习统计和计算机科学。它最初是一个开源项目，后来在获得大量关注后转变为一家初创公司，并获得了融资。

更具体地说，它是论文《ReAct: Synergizing Reasoning and Acting in Language Models》的实现：该论文展示了一种提示技术，允许模型「推理」（通过思维链）和「行动」（通过能够使用预定义工具集中的工具，例如能够搜索互联网）。

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/779845ee03224709a1d9dfe318449611~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1727565525&x-signature=FNGRHibJZraoZfcRRCA2uARHdZ8%3D)

论文链接：[arxiv.org/pdf/2210.03…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F2210.03629.pdf "https://arxiv.org/pdf/2210.03629.pdf")

事实证明，这种组合能够大幅提高输出文本的质量，并使大型语言模型具备正确解决问题的能力。而ChatGPT的API升级降价也助推了它的爆炸式增长。

### 基本定义

我们先来简单介绍一下Langchain.js中的一些核心概念：聊天消息（Chats）、模版（Templates）、工具（Tools）、调用链（Chains）。

#### 聊天消息

支持定义不同的消息类型，主要有SystemChatMessage、HumanChatMessage、AIChatMessage。支持变量替换。

1.  HumanChatMessage：代表人类用户的输入，通常是问题、指令或请求。
2.  AIChatMessage：代表模型的输出或回复，用于回应 HumanChatMessage 的内容。
3.  SystemChatMessage：用于设定对话的背景或角色，告诉模型如何表现或在对话中扮演什么角色。

javascript

 代码解读

复制代码

`import { ChatOpenAI } from 'langchain/llms/openai'; import { HumanChatMessage, AIChatMessage, SystemChatMessage } from 'langchain/schema'; // 初始化 ChatOpenAI 模型 const chatModel = new ChatOpenAI({   openAIApiKey: 'your-api-key', }); // 定义对话消息 const messages = [   new SystemChatMessage("你是一位量子物理教授，专业回答科学问题。"),   new HumanChatMessage("什么是量子纠缠？"), ]; // 模型生成回复 const response = await chatModel.call(messages); // 输出 AI 的回复 console.log(response);`

#### 模版（Templates）

PromptTemplate 是 LangChain 中的一个核心组件，它用于创建和管理与大型语言模型（LLMs）交互时的提示词（prompt）。PromptTemplate 帮助开发者构建动态和可复用的提示模板，将用户输入与预定义的模板内容结合，生成适合传递给语言模型的 prompt。

支持简单的变量和逻辑判断

javascript

 代码解读

复制代码

``import { PromptTemplate } from 'langchain/prompts'; // 定义更复杂的模板，包含条件逻辑 const template = ` 你好，我叫 {name}。 {#if topic} 今天我想讨论的是 {topic}。 {#else} 我今天没有特定的讨论话题。 {#/if} `; // 使用 LangChain 内置的模板引擎支持 const prompt = new PromptTemplate({   template: template,   inputVariables: ["name", "topic"], }); // 当提供了 topic 时，生成不同的 prompt const finalPromptWithTopic = await prompt.format({ name: "安笛杨", topic: "量子计算" }); console.log(finalPromptWithTopic); // 当未提供 topic 时，生成的 prompt 会有不同的结构 const finalPromptWithoutTopic = await prompt.format({ name: "安笛杨" }); console.log(finalPromptWithoutTopic);``

支持流式处理：：自动将每个步骤的输出作为下一步骤的输入，简化了多步骤任务的管理

arduino

 代码解读

复制代码

`import { PromptTemplate, PipelinePromptTemplate } from 'langchain/prompts'; // 定义多个 PromptTemplate const titlePrompt = new PromptTemplate({   template: "请为以下内容生成一个标题：\n{content}",   inputVariables: ["content"], }); const introPrompt = new PromptTemplate({   template: "请为这个标题生成一个简短的介绍：\n{title}",   inputVariables: ["title"], }); const summaryPrompt = new PromptTemplate({   template: "请为这个介绍生成一个总结：\n{introduction}",   inputVariables: ["introduction"], }); // 使用 PipelinePromptTemplate 将多个 PromptTemplate 串联起来 const pipeline = new PipelinePromptTemplate({   pipelinePrompts: [     { name: "title", promptTemplate: titlePrompt },     { name: "introduction", promptTemplate: introPrompt },     { name: "summary", promptTemplate: summaryPrompt },   ], }); // 提供初始输入，并生成最终提示词 const finalPrompt = await pipeline.format({   content: "量子计算正在改变未来的计算方式。", }); console.log(finalPrompt); // 输出：生成的最终提示词，会包含基于内容的标题、介绍和总结`

#### 工具函数

工具函数（Tools） 是构建复杂工作流和智能应用的核心组件。工具函数用于执行特定的任务或操作，它们可以是函数、API 调用、数据库查询等。LangChain 中的工具函数提供了一种灵活的方式，将外部系统或服务与语言模型（如 OpenAI GPT 系列）进行集成，使得模型可以动态调用工具来解决复杂问题。

在 LangChain 中，工具函数的定义通常包括以下几个要素：

*   名称（name）：工具函数的名称，帮助模型识别和选择该工具。
*   描述（description）：工具函数的功能描述，向模型或用户传达工具的用途。
*   调用逻辑（functionality）：工具的实际逻辑，实现特定任务或操作。

javascript

 代码解读

复制代码

`import { OpenAI } from 'langchain/llms/openai'; import { Tool, AgentExecutor } from 'langchain/agents'; // 初始化 OpenAI 模型 const model = new OpenAI({   openAIApiKey: 'your-api-key', }); // 定义一个简单的工具函数，用于查询天气 const weatherTool = new Tool({   name: 'getWeather',   description: '根据城市名称查询当前天气',   action: async (input) => {     // 模拟天气查询逻辑     const weatherData = {       '北京': '晴天 25°C',       '上海': '小雨 22°C',     };     return weatherData[input] || '无法获取该城市的天气数据';   }, }); // 创建智能代理，允许模型根据输入动态选择工具 const executor = new AgentExecutor({   tools: [weatherTool],   llm: model, }); // 通过模型输入选择工具 const input = "查询一下北京的天气"; const response = await executor.call({ input }); console.log(response);  // 输出：北京的天气是晴天 25°C`

#### 调用链（Chains）

调用链（Chain） 是 LangChain 中的核心概念之一，它用于将多个步骤串联在一起，形成一个工作流。每个链可以包含多个不同的模块（例如模型调用、工具函数、API 请求等），这些模块依次执行，完成从输入到输出的整个处理流程。通过调用链，开发者可以将复杂的任务分解为多个简单的步骤，并以逻辑顺序串联执行。

LangChain 的调用链特别适合构建复杂的应用，例如对话系统、信息检索增强生成（RAG）、多步骤文本处理等场景。通过调用链，开发者可以定义明确的数据流，确保每个步骤的输入、处理和输出都被合理处理。

LangChain 提供了多种不同类型的调用链，以支持各种任务的处理。常见的调用链类型包括：

1.  SimpleChain（简单链）： SimpleChain 是最基本的调用链类型，它将输入传递给链中的第一个模块，并依次将每个模块的输出作为下一个模块的输入，直到返回最终结果。适合处理简单的线性任务。
2.  SequentialChain（顺序链）： SequentialChain 是一个更复杂的链，支持多个模块按顺序执行，且每个步骤的输出可以作为下一个步骤的输入。适用于需要多步骤处理的任务。
3.  LLMChain（语言模型链）： LLMChain 是 LangChain 中专门用于调用语言模型（如 OpenAI GPT 系列）的调用链。它通常与提示模板（PromptTemplate）结合使用，将用户输入和模板内容结合，生成适合传递给语言模型的提示词，并将生成的结果作为输出。
4.  RouterChain（路由链）： RouterChain 是用于复杂的条件任务的链，允许根据输入的内容动态选择不同的链来执行。适用于需要根据用户输入决定执行不同逻辑的场景。
5.  TransformChain（转换链）： TransformChain 是用于数据转换的链，适合在多个步骤之间对数据进行格式转换或处理。

javascript

 代码解读

复制代码

`import { OpenAI } from 'langchain/llms/openai'; import { PromptTemplate } from 'langchain/prompts'; import { SequentialChain } from 'langchain/chains'; // 初始化 OpenAI 模型 const model = new OpenAI({   openAIApiKey: 'your-api-key', }); // 定义生成标题的 PromptTemplate const titlePrompt = new PromptTemplate({   template: "请为以下内容生成一个标题：\n{content}",   inputVariables: ["content"], }); // 定义生成摘要的 PromptTemplate const summaryPrompt = new PromptTemplate({   template: "请基于这个标题生成一个简短的内容摘要：\n{title}",   inputVariables: ["title"], }); // 创建 SequentialChain，将两个步骤串联 const chain = new SequentialChain({   chains: [     new LLMChain({ llm: model, prompt: titlePrompt }),  // 第一步：生成标题     new LLMChain({ llm: model, prompt: summaryPrompt }) // 第二步：生成摘要   ],   inputVariables: ["content"],  // 初始输入变量   outputVariables: ["summary"],  // 最终输出变量 }); // 执行链 const response = await chain.call({   content: "量子计算是一种利用量子力学原理进行计算的新型技术。", }); console.log(response);  // 输出：基于标题生成的摘要`

除此之外，Langchain还支持把内容转成向量数据用于关联查询、支持内存存储、状态记录等功能。

### LangChain Execution Language (LCEL)

Langchain.js还有一个重要的概念：LangChain Execution Language，简称LCEL。

LCEL是Langchain.js的灵魂语言，一种专门为Langchain.js框架设计的执行语言。它允许开发者以更加简洁和直观的方式描述和执行各种操作。

通过 LCEL，开发者可以定义自定义的数据流和工作流，从而使模型调用、工具函数、API 请求等可以灵活组合并执行。LCEL 在 LangChain 中充当管道，将各个步骤的输入输出连接起来，最终实现自动化的复杂工作流。

### **LCEL 的核心功能**

1.  **定义数据流**： LCEL 允许你清晰地定义数据如何在不同模块之间流动。每个模块的输出可以通过 LCEL 指定，传递给下一个模块，形成明确的工作流。
    
2.  **灵活组合**： LCEL 可以组合多个不同类型的模块，构建灵活的链式调用。无论是调用语言模型、工具函数，还是进行数据处理，都可以通过 LCEL 组合成一个整体。
    
3.  **条件逻辑**： LCEL 支持在工作流中添加条件逻辑（if-else），让数据流根据不同的输入路径或结果动态调整。这使得 LCEL 非常适合复杂的决策流程。
    
4.  **模块化设计**： LCEL 支持模块化构建，开发者可以轻松将单独的模块组合、重用，并构建更加复杂的应用。通过 LCEL，模块之间的连接非常灵活，可以根据需求进行调整。
    

LCEL 的核心是将多个**可运行模块（runnables）** 串联在一起。每个可运行模块代表一个具体的任务或操作，例如调用语言模型、查询数据库、调用 API、处理数据等。LCEL 的表达式描述了数据如何在这些模块之间流动。

LCEL 的基本结构是定义一个工作流，其中每个步骤可以是模型调用、工具函数等，并通过数据流进行连接。让我们来看一个例子：

假设你有一个文本处理任务，需要先生成一个摘要，然后根据摘要生成简短的介绍。我们可以通过 LCEL 来实现这个工作流。

javascript

 代码解读

复制代码

`import { OpenAI } from 'langchain/llms/openai'; import { PromptTemplate } from 'langchain/prompts'; import { RunnableSequence } from 'langchain/chains'; // 初始化 OpenAI 模型 const model = new OpenAI({   openAIApiKey: 'your-api-key', }); // 定义生成摘要的 PromptTemplate const summaryPrompt = new PromptTemplate({   template: "请为以下内容生成一个简短的摘要：\n{content}",   inputVariables: ["content"], }); // 定义生成介绍的 PromptTemplate const introductionPrompt = new PromptTemplate({   template: "请基于这个摘要生成一个简短的介绍：\n{summary}",   inputVariables: ["summary"], }); // 使用 LCEL 构建一个链式调用 const chain = RunnableSequence.from([   summaryPrompt,  // 第一步：生成摘要   model,  // 第二步：调用语言模型生成摘要   introductionPrompt,  // 第三步：基于摘要生成介绍   model,  // 第四步：调用模型生成介绍 ]); // 执行链式调用，传入初始内容 const response = await chain.call({ content: "量子计算是一种利用量子力学进行计算的技术。" }); console.log(response);  // 输出最终生成的介绍`

还可以通过 LCEL 添加条件逻辑，根据不同的输入路径选择不同的处理流程。

javascript

 代码解读

复制代码

`import { OpenAI } from 'langchain/llms/openai'; import { RunnableSequence } from 'langchain/chains'; // 初始化 OpenAI 模型 const model = new OpenAI({   openAIApiKey: 'your-api-key', }); // 使用 LCEL 添加条件逻辑 const chain = RunnableSequence.from([   async (input) => {     if (input.includes("weather")) {       return "天气预报";     } else {       return "普通文本处理";     }   },   model,  // 基于条件选择不同的模型调用 ]); // 执行链式调用 const response = await chain.call("Tell me the weather in New York."); console.log(response);  // 根据输入选择不同的模型处理`

**LangChain Expression Language (LCEL)** 提供了一种灵活、模块化的方式来管理复杂任务的工作流。通过 LCEL，开发者可以定义多步骤任务的数据流动、组合模型调用和工具函数，以及动态调整任务执行路径。LCEL 在文本处理、信息检索、智能代理等场景中具有广泛的应用，是 LangChain 中实现复杂工作流自动化的关键工具。

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b4ece30f7ac94a57ae8b2e14a3b122d4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1727565525&x-signature=kXLaHxLSWZOgmkeorIWHGxqg0Os%3D)

LangChain还可以实现RAG，后面在介绍。RAG是对大模型的一种增强处理。也是目前AI落地的一个大方向。要在公司内落地，就得把公司的数据通过RAG喂给大模型。有真实业务数据的加持，才可以让AI的回答更准确。

### 总结

Langchain对于开发AI应用的确是一个不可多得的工具。其对大模型调用的拆解和封装值得我们借鉴和学习。