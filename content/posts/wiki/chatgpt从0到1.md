---
author: "王宇"
title: "chatgpt从0到1"
date: 十月08,2023
description: "任鹏"
tags: ["任鹏"]
ShowReadingTime: "12s"
weight: 328
---
1\. 名词解释
========

  
**OpenAI：**一家美国人工智能公司的名称。它之前是一个非盈利组织，不过现在已经商业化，并注册成了以盈利为目的公司。  
**ChatGPT：**OpenAI的一个AI聊天产品。使用浏览器访问。很多人会全部小写，或者开头字母小写，其实关系不大，但是一些公众号都写成chatGPT，让我大跌眼镜。  
**ChatGPT Plus：**ChatGPT中的一种订阅服务，每月20美元，如果你不懂什么叫“订阅”，你就把ChatGPT Plus理解为会员就可以了。  
**OpenAI账号：**使用OpenAI服务需要注册登录的账号，这个常常被说成ChatGPT账号或GPT账号，其实这种说法是错误的，但是太多人这样称呼，所以大家一般也默认这种错误的说法了。  
**GPT-3/GPT-3.5/GPT-4：** 是OpenAI的三代模型（model）名称。  
**模型(Model)：**AI全靠模型提供能力，你可以把模型理解为AI的智能引擎。  
**ChatGPT4/ChatGPT-4：**根本没有这种东西，所以不要问什么支持不支持ChatGPT4之类的话。  
**ChatGPT Plugins：**ChatGPT支持的一种新功能，也就是插件，目前并没有开放，OpenAI目前只允许少部分开发者和Plus用户可以使用。  
**OpenAI API：**OpenAI提供的API服务。可以让第三方应用集成AI功能。  
**GPT4 API：**使用GPT-4模型的API  
**API Key或API密钥：**使用OpenAI账号创建一段以“sk-”开头的字符串。程序在调用OpenAI API时，需要使用这个API密钥验证身份，就像你使用ChatGPT时需要登录账号认证一样。如果你还是理解不了，你可以理解为程序登录使用API的账号密码。  
**GPT：**Generative Pre-trained Transformer 生成式 预训练 变换模型  
**生成式：**这个模型能够生成新的文本序列，通过预训练，gpt模型能够学习大量的自然语言文本，从而能够捕捉自然语言的语法、语义和结构等规律，一旦GPT完成预训练，就可以用来生成新的文本序列。  
**预训练：**

**ChatGPT 背后的 GPT 模型是在⼀个超⼤语料基础上预训练出的⼤语⾔  
模型（LLM） ，采⽤从左到右进⾏填字概率预测的⾃回归语⾔模型，并  
基于 prompting（提示）来适应不同领域的任务。**

**![](/download/attachments/109708530/image2023-9-7_14-29-17.png?version=1&modificationDate=1694068179247&api=v2)**

**bert是看左右两边的上一下猜字谜，gpt是根据左边的猜字谜。**

**大模型开发技术栈**

  

**![](/download/attachments/109708530/image2023-9-19_10-53-11.png?version=1&modificationDate=1695091991913&api=v2)**

**gpt发展史**

**gpt3之前需要微调，即通过数据标注的方式，调整模型**

**gpt3以后就是通过prompt，分为fewshot oneshot zeroshot**

**fewshot除了提供任务描述，还需要提供几个任务的示例**

**oneshot 提供任务描述，和一个任务示例**

**zeroshot不提供任务示例，只说任务描述**

**![](/download/thumbnails/109708530/image2023-9-22_16-12-23.png?version=1&modificationDate=1695370343887&api=v2)**

**![](/download/attachments/109708530/image2023-9-22_16-14-5.png?version=1&modificationDate=1695370445876&api=v2)**

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)