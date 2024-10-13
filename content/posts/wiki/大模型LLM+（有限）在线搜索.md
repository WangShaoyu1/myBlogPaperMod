---
author: "王宇"
title: "大模型LLM+（有限）在线搜索"
date: 八月10,2024
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 193
---
        众所周知，大模型的能力非常强，但是其训练数据是截至某个时间的数据，故对于某些需要搜索近期信息的场景，无法满足，这可以结合搜索引擎来弥补。同时，还可以结合某些/某个具体的网站来提供近期信息。比如说，某个用户输入，大模型无法回答，就调用知乎或者github或者其他专业网站上的信息。

1\. 需求描述
========

Actor

大模型LLM

Prompt

大模型知识库

外部知识  
向量库

外部搜索

补充：本需求先不探讨这个方向

大模型能够回复

大模型不能回复

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-3e866b00-a6ca-4dc8-8b3c-e2624395e867'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE/129181863?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/129181863/未命名绘图.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=129181863&owningPageId=129181863&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '大模型LLM+（有限）在线搜索'; readerOpts.attVer = '2'; readerOpts.attId = '129181867'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-07-14 22:17:20.791'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

2\. 方案设计
========

Actor

大模型知识库

搜索引擎能力  
(谷歌)

大模型LLM  
判断

1、爬取网站  
2、获取具体内容

内容存放在文件中

大模型LLM推理，组合答案

Prompt

能

不能

Function Calling

目标网址

知乎

Github

CSDN

StackOverFlow

HuggingFace

......

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-17c00d34-7b64-4e82-924c-c1515904e05a'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%31%31/129181863?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/129181863/11.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=129181863&owningPageId=129181863&diagramName=%31%31&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%31%31'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '大模型LLM+（有限）在线搜索'; readerOpts.attVer = '1'; readerOpts.attId = '129181878'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-07-14 22:45:25.331'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

2.1. 技术选型
---------

功能模块

技术选型

备注

功能模块

技术选型

备注

大模型

GPT模型/GLM4大模型/其他模型

调用API的方法，目前绝大部分模型都和GPT系列差不多。考虑到获取API\_KEY操作的方便性，本文选用智谱AI的API

搜索技术

谷歌搜索API、爬虫

也可以用其他的搜索。如：DuckDuckGo

性能优化

提示词工程

针对不同的网站，提示词可以进一步优化

  

  

  

2.2. 谷歌云平台注册
------------

### 2.2.1. 第一步：获取API\_KEY

访问地址：[https://console.cloud.google.com/](https://console.cloud.google.com/)

操作步骤如下：  
  

  

第一步

第二步

第三步

第四步

第五步

第六步

![](/download/thumbnails/129181863/image2024-7-14_22-51-48.png?version=1&modificationDate=1720968708407&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_22-52-41.png?version=1&modificationDate=1720968761954&api=v2)

  

![](/download/thumbnails/129181863/image2024-7-14_22-53-31.png?version=1&modificationDate=1720968811749&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_22-56-34.png?version=1&modificationDate=1720968994372&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_22-57-19.png?version=1&modificationDate=1720969039726&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_22-59-17.png?version=1&modificationDate=1720969157865&api=v2)

第七步

第八步

第九步

第十步

  

  

![](/download/thumbnails/129181863/image2024-7-14_23-1-52.png?version=1&modificationDate=1720969312873&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_23-6-16.png?version=1&modificationDate=1720969576876&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_23-6-43.png?version=1&modificationDate=1720969604151&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_23-7-0.png?version=1&modificationDate=1720969620622&api=v2)

![](/download/thumbnails/129181863/image2024-7-14_23-8-47.png?version=1&modificationDate=1720969728209&api=v2)

  

### 2.2.2. 第二步：注册可编程的搜索引擎

访问地址：[https://programmablesearchengine.google.com/](https://programmablesearchengine.google.com/)

第一步

第二步

第三步

第一步

第二步

第三步

![](/download/attachments/129181863/image2024-7-14_23-18-59.png?version=1&modificationDate=1720970339800&api=v2)

![](/download/attachments/129181863/image2024-7-14_23-19-47.png?version=1&modificationDate=1720970388167&api=v2)

  

![](/download/attachments/129181863/image2024-7-14_23-22-26.png?version=1&modificationDate=1720970547035&api=v2)

经过这两个步骤，就能够完成谷歌搜索的API调用了，有两个地方需要注意下：

*   搜索引擎可以选择在指定域名下搜索，见2.2.2第二步
*   谷歌搜索API每天免费使用100次，见：[https://developers.google.com/custom-search/v1/overview?hl=zh\_CN](https://developers.google.com/custom-search/v1/overview?hl=zh_CN)

### 2.2.3. 谷歌搜索API的使用

请求网址为：[https://www.googleapis.com/customsearch/v1?\[parameters](https://www.googleapis.com/customsearch/v1?[parameters)\]

具体的使用文档见：[https://developers.google.com/custom-search/v1/using\_rest?hl=zh-cn](https://developers.google.com/custom-search/v1/using_rest?hl=zh-cn)

详细的字段说明文档见：[https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list#request](https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list#request)

常用参数解析：

参数名

详情

备注

参数名

详情

备注

key

谷歌搜索API密钥，详见：2.2.1步骤

必填

cx

可编程搜索引擎ID，详见：2.2.2步骤

必填

q

搜索内容表达式

必填

c2coff

启用或停用简体中文，默认为0（启用）

0：启用  
1：停用

cr

将搜索结果限制为来自特定国家/地区的文档

1、国家 /地区标识查询：[https://developers.google.com/custom-search/docs/json\_api\_reference?hl=zh-cn#countryCollections](https://developers.google.com/custom-search/docs/json_api_reference?hl=zh-cn#countryCollections)

2、Google 搜索通过分析以下内容来确定文档所在的国家/地区：

*   文档网址的顶级域名 (TLD)
    
*   Web 服务器 IP 地址的地理位置
    

dateRestrict

搜索特定时间段

  

lr

搜索以特定语言撰写的文档

  

num

要返回的搜索结果数

有效值为 1 到 10 之间的整数（包括 1 和 10）

siteSearch

指定应始终从结果中包含或排除的给定网站

结合下面的siteSearchFilter

siteSearchFilter

``enum (`[SiteSearchFilter](https://developers.google.com/custom-search/v1/reference/rest/v1/SiteSearchFilter?hl=zh-cn)`)``

控制是否包含或排除 `siteSearch` 参数中指定的网站的结果。

可接受的值为：

*   `"e"`：排除
    
*   `"i"`：包含
    

默认为：`"i"：包含`

  

  

  

3\. 具体实现（含代码）
=============

3.1. ZhiPu AI GPT模型（示例）
-----------------------

智谱AI官网：[https://bigmodel.cn/](https://bigmodel.cn/)，注册一个账号，登录进去，进入 “开发工作台”，很方便就能获取到API\_KEY

一个最简版本的请求如下：

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

`ffrom zhipuai` `import` `ZhipuAI`

`client` `=` `ZhipuAI(api_key``=``api_key)`

`def` `chat_completion_request(messages, tools``=``None``, tool_choice``=``None``, model``=``GPT_MODEL):`

    `try``:`

        `response` `=` `client.chat.completions.create(`

            `model``=``model,`

            `messages``=``messages,`

            `tools``=``tools,`

            `tool_choice``=``tool_choice,`

        `)`

        `return` `response`

    `except` `Exception as e:`

        `print``(``"Unable to generate ChatCompletion response"``)`

        `print``(f``"Exception: {e}"``)`

        `return` `e`

在一步中，需要用到ZhiPu的Function calling功能，以实现，如果大模型能回答则直接回答，如果不能回答就执行Function Calling。其中需要关注的有两点：

1.  ZhiPu GPT的Function Calling的写法
2.  提示词上需要实现如上流程流转

补充上Function calling实现：

[?](#)

1

`/``/` `定义Tool，函数定义`

3.2. 一些测试
---------

### 3.2.1. 大模型回答问题策略测试

#### 3.2.1.1. 提示词

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

`response` `=` `client.chat.completions.create(`

  `model``=``"glm-4"``,`

  `messages``=``[`

    `{``"role"``:` `"system"``,` `"content"``:` `"根据用户输入的问题进行回答，如果知道问题的答案，请回答问题答案，如果不知道问题答案，请回复‘抱歉，这个问题我并不知道’"``},`

    `{``"role"``:` `"user"``,` `"content"``:` `"请问，什么是机器学习？"``}`

  `]`

`)`

`response.choices[``0``].message.content`

`-``-``-``output`

`'机器学习是人工智能的一个核心领域，它让计算机能够模拟人类的学习和思考方式。通过使用大量数据和算法，机器学习可以使计算机学会分类、回归和聚类等任务，从而让计算机能够从数据中提取知识，进行决策和预测。在机器学习的流程中，包括数据获取、特征工程、建立模型、模型评估以及调参等步骤。深度学习和强化学习是机器学习的两个重要分支。深度学习主要用于处理复杂结构数据的建模问题，而强化学习则让机器在探索环境中通过试错进行学习。'`

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

`response` `=` `client.chat.completions.create(`

  `model``=``"glm-4"``,`

  `messages``=``[`

    `{``"role"``:` `"system"``,` `"content"``:` `"根据用户输入的问题进行回答，如果知道问题的答案，请回答问题答案，如果不知道问题答案，请回复‘抱歉，这个问题我并不知道’"``},`

    `{``"role"``:` `"user"``,` `"content"``:` `"介绍一下关于GPT-6的猜想"``}`

  `]`

`)`

`response.choices[``0``].message.content`

`-``-``-``output`

`'抱歉，这个问题我并不知道。\n\n到2023为止，GPT-6尚未被公开提及或发布。GPT（Generative Pre-trained Transformer）系列模型由OpenAI开发，至今已发布了多个版本，如GPT-2和GPT-3。关于未来版本的GPT，如GPT-6，可能会有很多猜想和预期，但具体的内容和功能我无法提供，因为那将基于未来尚未公开的技术和信息。如果GPT-6在您提问之后有了新的消息，我可能无法获取那些最新的信息。'`

#### 3.2.1.2. 增加外部函数

测试的目的是：检测增加了外部函数的情况下，glm4回答同一个问题的时候，是不是都倾向于走外部函数

外部函数：有参数定义、函数描述、返回值

智谱的tools格式为：

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

`tools` `=` `[`

    `{`

        `"type"``:` `"function"``,`

        `"function"``: {`

            `"name"``:` `"get_flight_number"``,`

            `"description"``:` `"根据始发地、目的地和日期，查询对应日期的航班号"``,`

            `"parameters"``: {`

                `......`

            `},`

        `}`

    `}，`

    `...`

`]`

测试函数为：

[?](#)

1

2

3

4

5

6

7

`def` `ml_answer(q``=``'什么是机器学习'``):`

    `"""`

    `解释什么是机器学习，返回机器学习的定义和解释`

    `:param q: 询问的问题，非必要参数，字符串类型对象`

    `:return：返回机器学习的定义和解释`

    `"""`

    `return``(``"机器学习是一种人工智能（AI）的分支领域，旨在使计算机系统通过学习和经验改进性能。"``)`

现在将测试函数转化为tool需要的格式，写一个转换函数，里面也会用到glm4：

**auto\_functions生成tool需要的格式**  展开源码

[expand source](#)[?](#)

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

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

`def` `auto_functions(functions_list):`

    `"""`

    `Chat模型的functions参数编写函数`

    `:param functions_list: 包含一个或者多个函数对象的列表；`

    `:return：满足Chat模型functions参数要求的functions对象`

    `"""`

    `def` `functions_generate(functions_list):`

        `# 创建空列表，用于保存每个函数的描述字典`

        `functions` `=` `[]`

        `# 对每个外部函数进行循环`

        `for` `function` `in` `functions_list:`

            `# 读取函数对象的函数说明`

            `function_description` `=` `inspect.getdoc(function)`

            `# 读取函数的函数名字符串`

            `function_name` `=` `function.__name__`

            `system_prompt` `=` `'以下是某的函数说明：%s,输出结果必须是一个JSON格式的字典，只输出这个字典即可，前后不需要任何前后修饰或说明的语句'` `%` `function_description`

            `user_prompt` `=` `'根据这个函数的函数说明，请帮我创建一个JSON格式的字典，这个字典有如下``5``点要求：\`

                           `1.``字典总共有三个键值对；\`

                           `2.``第一个键值对的Key是字符串name，value是该函数的名字：``%``s，也是字符串；\`

                           `3.``第二个键值对的Key是字符串description，value是该函数的函数的功能说明，也是字符串；\`

                           `4.``第三个键值对的Key是字符串parameters，value是一个JSON Schema对象，用于说明该函数的参数输入规范。\`

                           `5.``输出结果必须是一个JSON格式的字典，只输出这个字典即可，前后不需要任何前后修饰或说明的语句'` `%` `function_name`

            `response` `=` `client.chat.completions.create(`

                              `model``=``"glm-4"``,`

                              `messages``=``[`

                                `{``"role"``:` `"system"``,` `"content"``: system_prompt},`

                                `{``"role"``:` `"user"``,` `"content"``: user_prompt}`

                              `]`

                            `)`

            `json_str``=``response.choices[``0``].message.content.replace(``"```json"``,"``").replace("`` ``` ``","``")`

            `json_function_description``=``json.loads(json_str)`

            `json_str``=``{``"type"``:` `"function"``,``"function"``:json_function_description}`

            `functions.append(json_str)`

        `return` `functions`

    `## 最大可以尝试4次`

    `max_attempts` `=` `4`

    `attempts` `=` `0`

    `while` `attempts < max_attempts:`

        `try``:`

            `functions` `=` `functions_generate(functions_list)`

            `break`  `# 如果代码成功执行，跳出循环`

        `except` `Exception as e:`

            `attempts` `+``=` `1`  `# 增加尝试次数`

            `print``(``"发生错误："``, e)`

            `if` `attempts` `=``=` `max_attempts:`

                `print``(``"已达到最大尝试次数，程序终止。"``)`

                `raise`  `# 重新引发最后一个异常`

            `else``:`

                `print``(``"正在重新运行..."``)`

    `return` `functions`

执行auto\_function(\[ml\_answer\])，能够生成tool需要的格式。接下来测试面对一个问题，在有外部函数能执行functuon call的情况下，到底是执行function call呢还是大模型直接执行。

直接执行glm4执行函数，发现面对同一个问题“什么是机器学习”，有时候直接回答，有时候通过外部函数回答，要解决这个不稳定的问题

**glm4执行**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

`response` `=` `client.chat.completions.create(`

        `model``=``"glm-4"``,`

        `messages``=``[`

            `{``"role"``:` `"user"``,` `"content"``:` `"解释什么是机器学习？"``}`

        `],`

        `tools``=``tools,`

        `tool_choice``=``"auto"`

    `)`

`response.choices[``0``].message`

提示词很细腻，轻微的差别，也许回复就会差别很大，

提示词1：system\_prompt \= '以下是某函数的函数说明：%s，输出结果必须是一个JSON格式的字典，只输出这个字典即可，前后不需要任何修饰或说明的语句' % function\_description

提示词2：system\_prompt \= '以下是某函数的函数说明：%s，输出结果必须是一个JSON格式的字典，只输出这个字典即可，前后不需要任何前后修饰或说明的语句' % function\_description

提示词1返回结果为：

**glm4执行**  展开源码

[expand source](#)[?](#)

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

`以下是符合您要求的JSON格式字典：`

` ```json `

`{`

`"name"``:` `"sunwukong_function"``,`

`"description"``:` `"该函数定义了数据集计算过程，接受数据表作为输入，并返回计算后的结果。"``,`

`"parameters"``: {`

`"type"``:` `"object"``,`

`"required"``: [``"data"``],`

`"properties"``: {`

`"data"``: {`

`"type"``:` `"string"``,`

`"description"``:` `"带入计算的数据表，用字符串进行表示"`

`}`

`},`

`"additionalProperties"``: false`

`}`

`}`

` ``` `

`这个JSON对象包含三个键值对：`

`1.` `` ` ```"name"``` ` 键对应着函数的名字。 ``

`2.` `` ` ```"description"``` ` 键提供了函数的功能说明。 ``

`3.` `` ` ```"parameters"``` ` 键包含一个JSON Schema对象，描述了函数的参数输入规范，包括数据类型和描述，并指出` ```"data"``` `参数是必须的（` ```"required"``: [``"data"``` ]`）。此外，` ```"additionalProperties"```: false`确保没有其他额外的参数被传入函数。``

提示词2返回结果为：

**glm4执行**  展开源码

[expand source](#)[?](#)

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

`{`

  `"name"``:` `"sunwukong_function"``,`

  `"description"``:` `"该函数定义了数据集计算过程，接收一个数据表作为输入，并返回计算后的结果。"``,`

  `"parameters"``: {`

    `"type"``:` `"object"``,`

    `"properties"``: {`

      `"data"``: {`

        `"type"``:` `"string"``,`

        `"description"``:` `"必要参数，表示带入计算的数据表，用字符串进行表示"`

      `}`

    `},`

    `"required"``: [``"data"``]`

  `}`

`}`

提示词2的输出100%是json格式的内容，而提示词1的输出内容中，每次都包含前后的修饰性的中文，当然也包含JSON部分的内容，夹在在一起。而这两份提示词之间的区别，就是提示词2多了两个字“前后”，差别却很大。

工程上的处理，其实要预防着 输出的文本不只是 纯字符串类型的JSON格式的内容，抽取夹杂着修饰性文本+JSON格式内容字符串的，而不能完全依赖大模型的返回。可以保险期间，如果结果是需要代码块的，需要执行代码提取函数。函数如下：

**extract\_code\_block提取代码块**

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

`def` `extract_code_block(text, language):`

    `"""`

    `提取文本中的指定语言的代码块，并返回代码块的字符串内容。`

    `:param text: 包含代码块的字符串`

    `:param language: 代码块语言标记，例如'json', 'python', 'java'等`

    `:return: 提取的代码块内容字符串，如果未找到则返回None`

    `"""`

    `pattern` `=` `re.``compile``(rf``'```{language}\n(.*?)\n```'``, re.DOTALL)`

    `match` `=` `pattern.search(text)`

    `if` `match:`

        `return` `match.group(``1``)`

    `else``:`

        `print``(f``"未找到 {language} 代码块"``)`

        `return` `None`

3.3. 增加外部函数回复稳定性
----------------

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)