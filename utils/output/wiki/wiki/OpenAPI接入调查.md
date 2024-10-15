---
author: "王宇"
title: "OpenAPI接入调查"
date: 三月02,2023
description: "chatGPT与OpenAI相关学习资料"
tags: ["chatGPT与OpenAI相关学习资料"]
ShowReadingTime: "12s"
weight: 519
---
模型

描述

模型

描述

GPT-3

一组能够理解和生成自然语言的模型

Codex

一组可以理解和生成代码的模型，包括将自然语言转换为代码

虽然**GPT-3**模型没有ChatGPT背后的**GPT-3.5**强大，但是用API有如下好处：

**优点**

*   无需注册、无需Science上网
*   有参数可以控制输出
*   比ChatGPT稳定
*   速度比ChatGPT快一点
*   可以整合到其他系统中

**缺点**

*   生成质量不如ChatGPT
*   优先的上下文支持
*   会产生费用

  

demo用法
------

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

`// $ npm install openai`

`const { Configuration, OpenAIApi } = require(``"openai"``);`

`const configuration =` `new` `Configuration({`

  `apiKey:` `'YOUR_OPENAI_API_KEY'``,`

`});`

`const openai =` `new` `OpenAIApi(configuration);`

`const response = await openai.createCompletion({`

  `model:` `"text-davinci-003"``,`

  `prompt:` `"Hello"``,`

  `temperature: 0,`

  `max_tokens: 16,`

`});`

  

API参数说明
-------

**GPT-3**和**Codex**模型支持的参数：

参数名

类型

默认值

说明

参数名

类型

默认值

说明

`model`

string

  

模型名称（详见模型综述）

`prompt`

string

  

输入的提示

`suffix`

string

`null`

文本生成后在文末插入的后缀

`max_tokens`

int

`16`

文本生成时要生成的最大token数。  
提示的token数加上`max_tokens`不能超过模型的上下文长度。  
大多数模型的上下文长度为2048个token（最新模型支持4096 tokens）

`temperature`

float

`1`

采样温度。值越高意味着模型承担的风险越大。  
对于需要创意的场景，可以尝试0.9，  
对于答案明确的场景，建议用0（argmax采样）  
建议不要与`top_p`同时改变。

`top_p`

float

`1`

核采样（温度采样的另一种方式），其中模型考虑具有`top_p`概率质量的token的结果。因此，0.1意味着只考虑包含最高10%概率质量的token  
建议不要与`temperature`同时改变。

`n`

int

`1`

每个提示要生成多少个答案

`stream`

boolean

`false`

是否返回流传输进度。如果设置，token将在可用时以纯数据服务器端推送事件发送，流以`data:[DONE]`消息终止。

`logprobs`

int

`nul`

如果传值（最大值5）则表示包括`logprobs`个最可能的token以及所选令牌的对数概率。例如，如果`logprobs`为5，则API将返回包含5个最可能Token的列表。

`echo`

boolean

`false`

是否回传提示

`stop`

string

`null`

最多4个序列，遇到`stop`API将停止生成。  
返回的文本不包含停止序列。

`presence_penalty`

float

`0`

数值介于-2.0和2.0之间。正值将根据到目前为止新token是否出现在文本中来惩罚新token，从而增加模型谈论新主题的可能性。

`frequency_penalty`

float

`0`

数值介于-2.0和2.0之间。正值根据文本中新token已经出现的频率惩罚新token，从而降低模型逐字重复同一行的可能性。

`best_of`

int

`1`

在服务端生成`best_of`个完成，并返回“最佳”（每个token的log概率最高的一条）。结果无法流式传输。  
与`n`一起使用时，`best_of`控制候选回应的数量，`n`指定要返回的数量–`best_of`必须大于等于`n`。  
⚠注意：由于此参数生成许多回应，因此会快速消耗token配额。小心使用并确保对`max_tokens`和`stop`进行了合理的设置。

`logit_bias`

map

`null`

修改回应种出现指定token的可能性。  
接受一个json对象，该对象将token（由GPT tokenizer的token ID指定）映射到-100到100之间的相关偏差值。可以用 tokenizer tool 将文本转换成token ID。  
在数学上，在采样之前，将偏差添加到模型生成的逻辑中。每个模型的确切效果会有所不同，但介于-1和1之间的值应该会降低或增加选择的可能性；像-100或100这样的值应该会导致相关token的禁用或必现。  
例如，可以传递`｛"50256": -100｝`以防止生成\`<

`user`

string

`null`

代表终端用户的唯一标识符，OpenAI用来监控和检测滥用。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)