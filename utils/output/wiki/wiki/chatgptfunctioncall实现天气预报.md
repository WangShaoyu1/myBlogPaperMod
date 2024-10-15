---
author: "王宇"
title: "chatgptfunctioncall实现天气预报"
date: 十二月01,2023
description: "任鹏"
tags: ["任鹏"]
ShowReadingTime: "12s"
weight: 330
---
function\_call和plugin区别是function\_call是客户端调用，plugin是服务端调用

[https://platform.openai.com/docs/guides/function-calling](https://platform.openai.com/docs/guides/function-calling)

[https://platform.openai.com/docs/plugins/introduction](https://platform.openai.com/docs/plugins/introduction)

1\. 概述
======

Notebook 介绍了如何将 Chat Completions API 与外部函数结合使用，以扩展 GPT 模型的功能。包含以下2个部分：

1.  如何使用 functions 参数
2.  如何使用 function\_call 参数

本demo做一个天气预报查询，跑在jupyter

首先需要配置环境变量OPENAI\_API\_KEY，值为gpt的key

[?](#)

1

`!pip install scipy tenacity tiktoken termcolor openai requests`

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

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

`Requirement already satisfied: scipy in c:\python310\lib\site-packages (1.11.4)`

`Requirement already satisfied: tenacity in c:\python310\lib\site-packages (8.2.3)`

`Requirement already satisfied: tiktoken in c:\python310\lib\site-packages (0.5.1)`

`Requirement already satisfied: termcolor in c:\python310\lib\site-packages (2.3.0)`

`Requirement already satisfied: openai in c:\python310\lib\site-packages (0.28.0)`

`Requirement already satisfied: requests in c:\python310\lib\site-packages (2.31.0)`

`Requirement already satisfied: numpy<1.28.0,>=1.21.6 in c:\python310\lib\site-packages (from scipy) (1.26.2)`

`Requirement already satisfied: regex>=2022.1.18 in c:\python310\lib\site-packages (from tiktoken) (2023.10.3)`

`Requirement already satisfied: tqdm in c:\python310\lib\site-packages (from openai) (4.66.1)`

`Requirement already satisfied: aiohttp in c:\python310\lib\site-packages (from openai) (3.9.0)`

`Requirement already satisfied: charset-normalizer<4,>=2 in c:\python310\lib\site-packages (from requests) (3.3.2)`

`Requirement already satisfied: idna<4,>=2.5 in c:\python310\lib\site-packages (from requests) (3.5)`

`Requirement already satisfied: urllib3<3,>=1.21.1 in c:\python310\lib\site-packages (from requests) (2.1.0)`

`Requirement already satisfied: certifi>=2017.4.17 in c:\python310\lib\site-packages (from requests) (2023.11.17)`

`Requirement already satisfied: attrs>=17.3.0 in c:\python310\lib\site-packages (from aiohttp->openai) (23.1.0)`

`Requirement already satisfied: multidict<7.0,>=4.5 in c:\python310\lib\site-packages (from aiohttp->openai) (6.0.4)`

`Requirement already satisfied: yarl<2.0,>=1.0 in c:\python310\lib\site-packages (from aiohttp->openai) (1.9.3)`

`Requirement already satisfied: frozenlist>=1.1.1 in c:\python310\lib\site-packages (from aiohttp->openai) (1.4.0)`

`Requirement already satisfied: aiosignal>=1.1.2 in c:\python310\lib\site-packages (from aiohttp->openai) (1.3.1)`

`Requirement already satisfied: async-timeout<5.0,>=4.0 in c:\python310\lib\site-packages (from aiohttp->openai) (4.0.3)`

`Requirement already satisfied: colorama in c:\python310\lib\site-packages (from tqdm->openai) (0.4.6)`

`WARNING: Ignoring invalid distribution - (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -p (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -p (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -ip (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution - (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -p (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -p (c:\python310\lib\site-packages)`

`WARNING: Ignoring invalid distribution -ip (c:\python310\lib\site-packages)`

  

  

[?](#)

`import` `os`

`import` `openai`

`import` `json`

`openai.api_key` `=` `os.getenv(``"OPENAI_API_KEY"``)`

`#通过写死返回天气的demo`

`# 实际上你可以调用后台或者外部api`

`def` `get_current_weather(location, unit``=``"摄氏度"``):`

    `"""Get the current weather in a given location"""`

    `if` `"北京"` `in` `location.lower():`

        `return` `json.dumps({``"location"``:` `"北京"``,` `"temperature"``:` `"10"``,` `"unit"``:` `"摄氏度"``})`

    `elif` `"上海"` `in` `location.lower():`

        `return` `json.dumps({``"location"``:` `"上海"``,` `"temperature"``:` `"72"``,` `"unit"``:` `"华氏度"``})`

    `elif` `"广州"` `in` `location.lower():`

        `return` `json.dumps({``"location"``:` `"广州"``,` `"temperature"``:` `"22"``,` `"unit"``:` `"摄氏度"``})`

    `else``:`

        `return` `json.dumps({``"location"``: location,` `"temperature"``:` `"unknown"``})`

`def` `run_conversation():`

    `# Step 1:发送会话和函数定义给大模型`

    `messages` `=` `[{``"role"``:` `"user"``,` `"content"``:` `"广州的天气情况？"``}]`

    `tools` `=` `[`

        `{`

            `"type"``:` `"function"``,`

            `"function"``: {`

                `"name"``:` `"get_current_weather"``,`

                `"description"``:` `"获取给定城市的天气情况"``,`

                `"parameters"``: {`

                    `"type"``:` `"object"``,`

                    `"properties"``: {`

                        `"location"``: {`

                            `"type"``:` `"string"``,`

                            `"description"``:` `"城市,像北京、上海"``,`

                        `},`

                        `"unit"``: {``"type"``:` `"string"``,` `"enum"``: [``"摄氏度"``,` `"华氏度"``]},`

                    `},`

                    `"required"``: [``"location"``],`

                `},`

            `},`

        `}`

    `]`

    `response` `=` `openai.ChatCompletion.create(`

        `model``=``"gpt-3.5-turbo-1106"``,`

        `messages``=``messages,`

        `tools``=``tools,`

        `tool_choice``=``"auto"``,` 

    `)`

    `print``(response)`

    `response_message` `=` `response.choices[``0``].message`

    `tool_calls` `=` `response_message.tool_calls`

    `# Step 2: 模型返回的函数调用`

    `if` `tool_calls:`

        `# Step 3: 调用这个函数`

        `#注意返回的函数可能为空`

        `available_functions` `=` `{`

            `"get_current_weather"``: get_current_weather,`

        `}`  `# 例子中只有一个函数，但实际可以有多个`

        `messages.append(response_message)`  `# extend conversation with assistant's reply`

        `# Step 4: 把大模型返回的信息传给函数，把函数的返回值传给大模型`

        `for` `tool_call` `in` `tool_calls:`

            `function_name` `=` `tool_call.function.name`

            `function_to_call` `=` `available_functions[function_name]`

            `function_args` `=` `json.loads(tool_call.function.arguments)`

            `function_response` `=` `function_to_call(`

                `location``=``function_args.get(``"location"``),`

                `unit``=``function_args.get(``"unit"``),`

            `)`

            `messages.append(`

                `{`

                    `"tool_call_id"``: tool_call.``id``,`

                    `"role"``:` `"tool"``,`

                    `"name"``: function_name,`

                    `"content"``: function_response,`

                `}`

            `)`  `# extend conversation with function response`

        `second_response` `=` `openai.ChatCompletion.create(`

            `model``=``"gpt-3.5-turbo-1106"``,`

            `messages``=``messages,`

        `)`  `#通过大模型获取一个关于函数返回值新的回复`

        `text` `=` `second_response[``'choices'``][``0``][``'message'``][``'content'``]`

        `print``(text)`

    `return` `second_response`

`print``(run_conversation())`

[?](#)

`{`

    `"id"``:``"chatcmpl-8Qne5zppsIzUXkklFfN3JjXP3xjbp"``,`

    `"object"``:``"chat.completion"``,`

    `"created"``:1701398057,`

    `"model"``:``"gpt-3.5-turbo-1106"``,`

    `"choices"``:[`

        `{`

            `"index"``:0,`

            `"message"``:{`

                `"role"``:``"assistant"``,`

                `"content"``:``null``,`

                `"tool_calls"``:[`

                    `{`

                        `"id"``:``"call_I32tbDLPexTVpgseGpy4jp5y"``,`

                        `"type"``:``"function"``,`

                        `"function"``:{`

                            `"name"``:``"get_current_weather"``,`

                            `"arguments"``:``"{\"location\": \"\u5e7f\u5dde\", \"unit\": \"\u6444\u6c0f\u5ea6\"}"`

                        `}`

                    `}`

                `]`

            `},`

            `"finish_reason"``:``"tool_calls"`

        `}`

    `],`

    `"usage"``:{`

        `"prompt_tokens"``:91,`

        `"completion_tokens"``:39,`

        `"total_tokens"``:130`

    `},`

    `"system_fingerprint"``:``"fp_eeff13170a"`

`}`

`广州目前的气温是22摄氏度。`

`{`

    `"id"``:``"chatcmpl-8Qne6rcwvpqyw0QpykFqN2SuUsUTP"``,`

    `"object"``:``"chat.completion"``,`

    `"created"``:1701398058,`

    `"model"``:``"gpt-3.5-turbo-1106"``,`

    `"choices"``:[`

        `{`

            `"index"``:0,`

            `"message"``:{`

                `"role"``:``"assistant"``,`

                `"content"``:``"\u5e7f\u5dde\u76ee\u524d\u7684\u6c14\u6e29\u662f22\u6444\u6c0f\u5ea6\u3002"`

            `},`

            `"finish_reason"``:``"stop"`

        `}`

    `],`

    `"usage"``:{`

        `"prompt_tokens"``:86,`

        `"completion_tokens"``:17,`

        `"total_tokens"``:103`

    `},`

    `"system_fingerprint"``:``"fp_eeff13170a"`

`}`

  

[![](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/4.1.1/_/download/resources/com.atlassian.confluence.plugins.confluence-view-file-macro:view-file-macro-resources/images/placeholder-medium-file.png)functioncall.ipynb](/download/attachments/114666942/functioncall.ipynb?version=1&modificationDate=1701409925669&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)