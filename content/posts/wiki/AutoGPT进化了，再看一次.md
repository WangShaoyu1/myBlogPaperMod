---
author: "王宇"
title: "AutoGPT进化了，再看一次"
date: 七月08,2024
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 182
---
*   1[1\. 前言](#AutoGPT进化了，再看一次-前言)             
*   2[2\. 运行项目](#AutoGPT进化了，再看一次-运行项目)
    *   2.1[2.1. 目录](#AutoGPT进化了，再看一次-目录)
    *   2.2[2.2. 运行](#AutoGPT进化了，再看一次-运行)
    *   2.3[2.3. 启动项目中遇到的问题](#AutoGPT进化了，再看一次-启动项目中遇到的问题)
*   3[3\. 分析项目](#AutoGPT进化了，再看一次-分析项目)
    *   3.1[3.1.  调用关系分析](#AutoGPT进化了，再看一次-调用关系分析)
    *   3.2[3.2. 核心部分](#AutoGPT进化了，再看一次-核心部分)
        *   3.2.1[3.2.1. 大模型与提示词](#AutoGPT进化了，再看一次-大模型与提示词)
            *   3.2.1.1[3.2.1.1. prompt示例](#AutoGPT进化了，再看一次-prompt示例)
            *   3.2.1.2[3.2.1.2. 响应示例](#AutoGPT进化了，再看一次-响应示例)
        *   3.2.2[3.2.2. 提示词分析](#AutoGPT进化了，再看一次-提示词分析)
        *   3.2.3[3.2.3. 响应内容分析](#AutoGPT进化了，再看一次-响应内容分析)
*   4[4\. 运行思维启动AutoGPT](#AutoGPT进化了，再看一次-运行思维启动AutoGPT)
*   5[5\. 拓展及经典代码分析](#AutoGPT进化了，再看一次-拓展及经典代码分析)
    *   5.1[5.1. action/ability注册](#AutoGPT进化了，再看一次-action/ability注册)
    *   5.2[5.2. 增加一个自定义action](#AutoGPT进化了，再看一次-增加一个自定义action)
    *   5.3[5.3. agent.py最简化代码](#AutoGPT进化了，再看一次-agent.py最简化代码)
    *   5.4[5.4. 提示词组装方法](#AutoGPT进化了，再看一次-提示词组装方法)
*   6[6\. 过程中用到的经典库](#AutoGPT进化了，再看一次-过程中用到的经典库)
*   7[7\. 大模型使用指令测试](#AutoGPT进化了，再看一次-大模型使用指令测试)
    *   7.1[7.1. 提示词](#AutoGPT进化了，再看一次-提示词)

1\. 前言             
===================

         在去年研究Hungging GPT项目的时候，顺手也下载了autogpt的初代版本代码，对比起来看，那时候的结论是：两者之间没有太大的区别，都是期望着一个大模型作为中控，理解需求后，划分为不同的任务，然后让不同的小模型或者算法去执行不同的任务，最后中控大模型结合提示词与小模型或者算法返回的结果，做最终的归纳总结，返回给用户。

         彼时开创了一种新的大模型应用方向，即初代的Agent，实践后，发现其方向性高于实用性。因为有不少环节，都是默认选项，比如：

*   如何去选择一个小模型或者算法，依据是huggingface.co上面的对应分类的开源模型上面的用户点赞数（下载数），这其实有一些主观
*   对于每个能够被调用的小模型或者算法而言，其描述文件没有太多统一的规范，这也是整个生态的问题
*   对于每个小模型或者算法，如何和其他模型或者算法，没有统一的协议（请求入参格式、响应出参格式）

         前段时间，开始关注AI Agent，重新关注了AutoGPT这个项目（官网地址为：[https://news.agpt.co/](https://news.agpt.co/)）。star数从不到1K，增长为163K；从之前的小作坊，现在变成了一个小生态，其愿景为：“AutoGPT 的愿景是让每个人都能轻松使用和构建 AI。我们的使命是提供工具，让您专注于重要的事情”。有如下变化：

1.  明确AutoGPT项目长期发展目标
2.  生态化，号召按照agent protocol来开发agent
3.  项目包含Forge模块，提供了大量的agent模板
4.  项目包含Benchmark模块，为评价agent提供了标准
5.  项目中前后端代码分离

2\. 运行项目
========

2.1. 目录
-------

         项目核心目录为：

目录

详情

备注

目录

详情

备注

assets

资源

  

autogpt

autogpt核心目录，支持GPT Groq Anthropic

1、使用了很多的python项目，新的特性，安装包灯方法

注意GPT api key的使用方法，很容易被封，推荐购买key

benchmark

衡量agent能力的各项指标、标准

需要遵守agent protocol

docs

文档合集

  

forge

agent模板，提供教程，用户可以据此作为参考做自己的agent

基于LLM的agent模板

frontend

前端界面，使用flutter框架开发web，也可以开发window应用

用到谷歌登录等第三方库

rnd/autogpt\_server

探索性项目，下一代agent，agent代理服务器

  

2.2. 运行
-------

         分别运行autogpt、frontend这两个文件夹：

[?](#)

1

2

`python -m autogpt serve`

`flutter run -d chrome`

       运行界面为：

2.3. 启动项目中遇到的问题
---------------

序号

问题

方案

备注

  

  

1

frontend文件夹中，flutter启动web服务器，报错连不上：“SocketException: Failed to create server socket”

**方案1：**在启动文件上加上参数：\--web-port=8080 --web-hostname=127.0.0.1，特别是hostname的设置，但这样会出现谷歌账号认证失败的情况（其默认的地址为localhost）；

方案2一劳永逸

**方案2：**在电脑配置“网络与Internet---高级网络设置”，“本地连接—更多适配器选项”，“网络”配置中，将“Internet 协议版本6（TCP/IPv6）”配置为不选中状态；

  

2

前端、后端之间存在跨域问题

方案1：将后端的可允许的域（+**端口**）配置在允许的源中，并与前端的默认**端口**保持一致（配置在编辑器的启动配置Configurations中，Additional run args选项中，配置内容为：--web-port=**端口**），两者保持一致能解决跨域问题

方案二：配置后端跨域配置CORSMiddleware中的allow\_origins=\["\*"\]

方案二一劳永逸

3

flutter for web前端界面中文显示乱码，数据库、接口、参数入参，内部各个环节都显示中文显示正常。什么原因

定位为渲染问题，配置flutter字体，本地、云端都尝试过，都显示为中文乱码。但直接写在页面上的中文显示正常；

定位为字符格式问题，检查请求入参（viewmodel、提交到server端）、出参（apifox测试接口，console控制台接口返回）、数据库对应中文字段，都没有问题；但是控制台打印的话，是乱码。

定位为页面编码问题，统一调整IDE文件格式为utf-8，没有效果。

最终经过尝试，定位为，接口响应头Content-Type没有加上charset=UTF-8，只有application/json。加上即解决问题

apifox接口在线调试、console控制台，响应response不加响应头charset=UTF-8，内部机制默认转化了，导致接口显示正常。但其实返回给页面前端的内容中中文并不是utf-8格式

4

运start命令时，出现Unlock Keyring，Authentication required

执行命令：rm -f ~/.gnome2/keyrings/login.keyring

如果记得密码也行，一般是Ubuntu 开机密码

5

通过poetry来管理依赖

1、一些常用命令poetry install、poetry update，后面都可以带具体的包名

  

6

执行read\_page页面，提示chrome not found

1、在Linux环境下安装google-chrome-stable版本

  

7

添加装饰器时，报错TypeError: 'module' object is not callable

1、引用模块的时候，直接执行模块了，而不是执行模块里的具体f

  

3\. 分析项目
========

3.1.  调用关系分析
------------

前端（futter for web）、后端接口之间调用关系链，参考如下：

**autogpt**

autogpt

\_\_main\_\_.py

cli.py  

run\_auto\_gpt\_server

app.main.py

agent\_protocol\_server.py  

AgentProtocolServer  

new AgentProtocolServer()

.start  

start

create\_task

get\_task

list\_task

create\_step

get\_step

execute\_step

create\_artifacts

list\_artifacts

get\_artifacts

\_on\_agent\_write\_file

autogpt

\_\_main\_\_.py

cli.py  

run\_auto\_gpt\_server

autogpt

\_\_main\_\_.py

cli.py  

run\_auto\_gpt\_server

forge

base\_router

request method  
request path  

request process  

agent

create\_task  
list\_tasks  
get\_task  
list\_steps  
execute\_step  
get\_step  
list\_artifacts  
create\_artifacts  
get\_artifacts  

eg：create\_task

(AgentDB).create\_task

new AgentProtocolServer()

.start  

forge

base\_router

agent

create\_task  
list\_tasks  
get\_task  
list\_steps  
execute\_step  
get\_step  
list\_artifacts  
create\_artifacts  
get\_artifacts  

request method  
request path  

request process  

eg：create\_task

**forge**

base\_router

agent

create\_task  
list\_tasks  
get\_task  
list\_steps  
execute\_step  
get\_step  
list\_artifacts  
create\_artifacts  
get\_artifacts  

request method  
request path  

request process  

eg：create\_task

**frontend**

Type a message

NULL

非NULL

currentTaskId

createTask

viewmodel  
service

fetchAndCombineData

fetchTasks

fetchTasksSuites

newTaskId

executeStep

stepId

stepResponse

createTask

**autogpt  
server  
**

Post  /agent/tasks  
froge  api\_router.py  
froge agent.py  
forge db.py  

createStep

Post   /agent/tasks/{task\_id}/steps  
froge  api\_router.py  
autogpt agent\_protocol\_server.py  
autogpt db.py  

agent\_protocol\_server.py  
agent.propose\_action  

ChatPrompt:build\_prompt  

complete\_and\_parse(prompt)

agent.propose\_action

**result**

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-785cc076-1c5a-4a50-83a4-85154db5e9e4'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%71%73/123663221?revision=11'; readerOpts.imageUrl = '' + '/download/attachments/123663221/未命名绘图qs.png' + '?version=11&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123663221&owningPageId=123663221&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%71%73&revision=11'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1200'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%71%73'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = 'AutoGPT进化了，再看一次'; readerOpts.attVer = '11'; readerOpts.attId = '123663736'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-06-10 22:38:57.893'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

3.2. 核心部分
---------

### 3.2.1. 大模型与提示词

#### 3.2.1.1. prompt示例

**prompt示例**

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

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

`SYSTEM: You are AutoGPT, a seasoned digital assistant: capable, intelligent, considerate and assertive. You have extensive research and development skills, and you don't shy away from writing some code to solve a problem. You are pragmatic and make the most out of the tools available to you.`

`Your decisions must always be made independently without seeking user assistance. Play to your strengths` `as` `an LLM and pursue simple strategies with no legal complications.`      

`The OS you are running on is: Ubuntu` `22.04``.``3` `LTS`

`## Constraints`

`You operate within the following constraints:`

`1``. Exclusively` `use` `the commands listed below.`

`2``. You can only act proactively, and are unable to start background jobs or set up webhooks for yourself. Take this into account when planning your actions.`

`3``. You are unable to interact with physical objects. If this is absolutely necessary to fulfill a task or objective or to complete a` `step``, you must ask the user to` `do` `it for you. If the user refuses this, and there is no other way to achieve your goals, you must terminate to avoid wasting time and energy.`

`## Resources`

`You can leverage access to the following resources:`

`1``. The ability to read and` `write` `files.`

`2``. You are a Large Language Model, trained on millions of pages of text, including a lot of factual knowledge. Make` `use` `of this factual knowledge to avoid unnecessary gathering of information.`

`3``. Internet access for searches and information gathering.`

`4``. Ability to read websites.`

`## Commands`

`These are the ONLY commands you can` `use``. Any action you perform must be possible through one of these commands:`

`1``. open_file: Opens a file for editing or continued viewing; creates it` `if` `it does not exist yet. Note: If you only need to read or` `write` `a file once,` `use` `` `write_to_file` instead.. Params: (file_path: string) ``

`2``. open_folder: Open a folder to keep track of its content. Params: (path: string)`

`3``. execute_shell: Execute a Shell Command, non-interactive commands only. Params: (command_line: string)`

`4``. execute_shell_popen: Execute a Shell Command, non-interactive commands only. Params: (command_line: string)`

`5``. read_file: Read a file and` `return` `the contents. Params: (filename: string)`

`6``. write_file: Write a file, creating it` `if` `necessary. If the file exists, it is overwritten.. Params: (filename: string, contents: string)`

`7``. list_folder: Lists files` `in` `a folder recursively. Params: (folder: string)`

`8``. finish: Use this to shut down once you have completed your task, or when there are insurmountable problems that make it impossible for you to finish your task.. Params: (reason: string)`

`9``. ask_user: If you need more details or information regarding the given goals, you can ask the user for input.. Params: (question: string)`

`10``. web_search: Searches the web. Params: (query: string, num_results?: number)`

`11``. read_webpage: Read a webpage, and extract specific information from it. You must specify either topics_of_interest, a question, or get_raw_content.. Params: (url: string, topics_of_interest?: Array<string>, question?: string, get_raw_content?:` `boolean``)`

`## Best practices`

`1``. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.`

`2``. Constructively self-criticize your big-picture behavior constantly.`

`3``. Reflect on past decisions and strategies to refine your approach.`

`4``. Every command has a cost, so be smart and efficient. Aim to complete tasks` `in` `the least number of steps.`

`5``. Only make` `use` `of your information gathering abilities to` `find` `information that you don't yet have knowledge of.`

`## Your Task`

`The user will specify a task for you to execute,` `in` `triple quotes,` `in` `the next message. Your job is to complete the task` `while` `following your directives` `as` `given above, and terminate when your task is done.`

`## RESPONSE FORMAT`

`YOU MUST ALWAYS RESPOND WITH A JSON OBJECT OF THE FOLLOWING TYPE:`

`interface` `AssistantResponse {`

`thoughts: {`

`// Relevant observations from your last action (if any)`

`observations: string;`

`// Thoughts`

`text: string;`

`// Reasoning behind the thoughts`

`reasoning: string;`

`// Constructive self-criticism`

`self_criticism: string;`

`// Short list that conveys the long-term plan`

`plan: Array<string>;`

`// Summary of thoughts, to say to user`

`speak: string;`

`};`

`use_tool: {`

`name: string;`

`arguments: Record<string, any>;`

`};`

`}`

`------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`

`USER:` `"""告诉我英国的面积"""`

`SYSTEM: ## Clock`

`The current time and date is Mon Jun` `10` `13``:``01``:``31` `2024`

`USER: Determine exactly one command to` `use` `next based on the given goals and the progress you have made so far, and respond using the JSON schema specified previously:`

#### 3.2.1.2. 响应示例

**Step Response示例**

[?](#)

1

2

3

4

5

6

7

`thoughts=AssistantThoughts(observations=``''``,`

`text=``'I will perform a web search to find the current world population.'``,`

`reasoning=``'Searching the web is the most efficient way to obtain up-to-date information on the current world population.'``,`

`self_criticism=``''``,`

`plan=[``'Perform a web search to find th e current world population.'``],`

`speak=``'I will search the web to find the current world population.'``)`

`use_tool=AssistantFunctionCall(name=``'web_search'``, arguments={``'query'``:` `'current world population'``})`

### 3.2.2. 提示词分析

        提示词共分为7个部分：

1.  System。系统相关，角色、时间等
2.  Constraints。约束条件
3.  Resources。可利用资源
4.  Commands。能使用的命令
5.  Best practices。最佳实践
6.  Your Task。任务概述 
    
7.  Response format。响应格式

这7个部分在项目中，分散到不同的文件、模块中，通过各种工程逻辑，最终合并在一起，作为prompt输入到大模型中（GPT-4或者GPT-3.5-turbe或者其他）。

System：设置AutoGPT的角色—“你是一个经验丰富的数字助理，能力强、聪明、考虑周到、坚定自信。你具有丰富的研究和开发技能，同时不介意通过写一些代买来解决问题。你是务实的并且能充分利用好可用的工具“

Constraints：您需在以下限制内进行操作：

*   只能使用 下面conmands列出的命令；
*   只能主动采取行动，无法开启后台任务或者设置网络钩子、回调，在计划你的行动的时候，充分考虑这一点；
*   你不能和物理物体交互，如果对于完成一个任务、目标、步骤来讲非常有必要，你必须要求用户来执行操作，如果用户拒绝，另外没有其他的方案来完成目标，你必须终止以免浪费时间精力；

Reources：您可以利用对以下资源的访问：

*   1、读写文件的能力。
*   你是一个大型语言模型，经过数百万页文本的训练，包括大量事实知识。 利用这些事实知识来避免不必要的信息收集。
*    用于搜索和信息收集的互联网接入。
*    具备阅读网站的能力。

Commands：

这些是您可以使用的唯一命令。 您执行的任何操作都必须可以通过以下11个命令之一来实现：

*   open\_file：打开文件进行编辑或继续查看；如果文件尚不存在，则创建它。注意：如果您只需要读取或写入文件一次，请改用\`write\_to\_file\`。参数：（file\_path：字符串）
*   open\_folder：打开文件夹以跟踪其内容。参数：（path：字符串）
*   execute\_shell：执行 Shell 命令，仅限非交互式命令。参数：（command\_line：字符串）
*    execute\_shell\_popen：执行 Shell 命令，仅限非交互式命令。参数：（command\_line：字符串）
*    read\_file：读取文件并返回内容。参数：（filename：字符串）
*   write\_file：写入文件，必要时创建它。如果文件存在，则将其覆盖。参数：（filename：字符串，contents：字符串）
*   list\_folder：以递归方式列出文件夹中的文件。参数：（文件夹：字符串）
*    finish：完成任务后，或者遇到无法解决的问题导致无法完成任务时，使用此参数关闭。参数：（原因：字符串）
*    ask\_user：如果您需要有关给定目标的更多详细信息或信息，您可以要求用户输入。参数：（问题：字符串）
*   web\_search：搜索网络。参数：（查询：字符串，num\_results？：数字）
*   read\_webpage：阅读网页，并从中提取特定信息。您必须指定topics\_of\_interest、问题、get\_raw\_content。参数：（url：字符串，topics\_of\_interest？：Array<string>，问题？：字符串，get\_raw\_content？：布尔值）

Best practices：

*   不断审查和分析你的行为，以确保您发挥出最佳能力。
*   不断地建设性地自我批评你的大局行为。
*   反思过去的决策和策略以完善您的方法。
*   每个命令都有成本，所以要聪明、高效。 旨在以最少的步骤完成任务。
*   只利用你的信息收集能力来寻找你还不了解的信息。

Your Task：

用户将在下一条消息中指定你要执行的任务，您的工作是按照上述指示完成任务，并在任务完成后终止。

Response format：

您必须始终使用以下类型的 JSON 对象进行响应：

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

`interface` `AssistantResponse {`

   `thoughts: {`

      `// Relevant observations from your last action (if any)`

      `observations: string;`

      `// Thoughts`

      `text: string;`

      `// Reasoning behind the thoughts`

      `reasoning: string;`

      `// Constructive self-criticism`

      `self_criticism: string;`

      `// Short list that conveys the long-term plan`

      `plan: Array<string>;`

      `// Summary of thoughts, to say to user`

      `speak: string;`

      `};`

   `use_tool: {`

   `name: string;`

   `arguments: Record<string, any>;`

   `};`

`}`

  

### 3.2.3. 响应内容分析

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

31

32

33

`{`

    `"name"``:` `"现在广州什么天气"``,`

    `"input"``:` `"现在广州什么天气"``,`

    `"additional_input"``: {},`

    `"created_at"``:` `"2024-06-11T04:48:32.654656"``,`

    `"modified_at"``:` `"2024-06-11T04:48:43.905814"``,`

    `"task_id"``:` `"6ba54e05-870e-402e-8235-880a759ecc7f"``,`

    `"step_id"``:` `"9d2944c2-29eb-4f6d-a8b6-aa5022a3cbb6"``,`

    `"status"``:` `"completed"``,`

    `"output"``:` `"Finding the current weather in Guangzhou.\n\nNext Command: web_search(query='current weather Guangzhou')"``,`

    `"additional_output"``: {`

        `"thoughts"``: {`

            `"observations"``:` `"The user requested the current weather in Guangzhou."``,`

            `"text"``:` `"I will use a web search to gather the most current and accurate information regarding the weather in Guangzhou."``,`

            `"reasoning"``:` `"Accessing a reliable source such as a local weather reporting service via a web search will provide up-to-date information."``,`

            `"self_criticism"``:` `"An alternative method could have been using a specific API call if available and integrated, which might have provided more detailed and reliable data more efficiently."``,`

            `"plan"``: [`

                `"Perform a web search to determine the current weather in Guangzhou."``,`

                `"Display the results to the user."`

            `],`

            `"speak"``:` `"Finding the current weather in Guangzhou."`

        `},`

        `"use_tool"``: {`

            `"name"``:` `"web_search"``,`

            `"arguments"``: {`

                `"query"``:` `"current weather Guangzhou"`

            `}`

        `},`

        `"task_cumulative_cost"``:` `0.0161`

    `},`

    `"artifacts"``: [],`

    `"is_last"``: false`

`}`

4\. 运行思维启动AutoGPT
=================

        上述分析是用技术思维来分析AutoGPT整个项目，看其各个模块的调用关系，以及如何使用大模型的调度和分析的能力。那如何使用AutoGPT来打造个人的AutoGPT呢，针对大家而言应该更重要。这个官方有更简单的操作步骤，具体如下：

  

步骤

  

备注

  

  

  

  

build your own AI Agents using the AutoGPT Forge

步骤一

clone项目[AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)，cd进入项目，允许命令：./run setup

（用tag autogpt-v0.5.1）

可能会遇到允许报错，比如setup文件找不到、./run文件找不到，bin/bash^M: bad interpreter: No such file or directory，或者其他错误。这个错误通常是因为 `setup.sh` 文件中包含了 Windows 风格的换行符（CRLF），而不是 Unix 风格的换行符（LF）。这种情况会导致 Bash 在解析脚本时出现问题。需要将文件中的所有 CRLF 转换为 LF。

解决方案：系统安装dos2unix，然后执行：dos2unit   /绝对地址/setup.sh，极了解决问题。然后允许./run setup

步骤二

创建个人agent

运行命令：./run agent create YOUR\_AGENT\_NAME

之后就创建了你的个人agent，文件路径在：agents/YOUR\_AGENT\_NAME

不用主动添加conda虚拟环境，程序中会自动处理，否则报错

  

步骤三

运行个人agent

运行命令：./run agent start YOUR\_AGENT\_NAME\`

出现界面：

![](/download/thumbnails/123663221/image2024-6-12_15-5-37.png?version=1&modificationDate=1718175938239&api=v2)

  

Enhancing Your Agent

  

Profile

Memory

Planning

Action

\-------------------------------

agent protocol：The Linguistics of AI Communication：[agent protocol](https://agentprotocol.ai/)

LLM-Based AI Agents：

![](https://miro.medium.com/v2/resize:fit:1050/1*9fDToDTOEc3tzMSDIJ-Tng.png)

  

  

  

Interacting with your Agent throught UI

  

使用 AutoGPT Forge UI 创建任务

页面操作 :如果点击按钮![](/download/thumbnails/123663221/image2024-6-19_13-0-59.png?version=1&modificationDate=1718773260118&api=v2)，则可以循环执行步骤，直到任务完成，不过token消耗比较快，（$1分分钟就消耗完，哈哈）

![](https://wiki.yingzi.com/download/thumbnails/123663221/image2024-6-12_15-5-37.png?version=1&modificationDate=1718175938239&api=v2)

  

基准测试

  

  

提交自己的agent到Leaderboard，也就是AutoGPT的AI生态里

  

  

  

  

  

  

  

  

  

  

  

  

  

  

5\. 拓展及经典代码分析
=============

5.1. action/ability注册
---------------------

 展开源码

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

`def` `register_abilities(``self``)` `-``>` `None``:`

    `# 遍历当前目录及其子目录下的所有 Python 文件（递归方式）`

    `for` `action_path` `in` `glob.glob(`

        `os.path.join(os.path.dirname(__file__),` `"**/*.py"``), recursive``=``True`

    `):`

        `# 排除文件名为 "__init__.py" 和 "registry.py" 的文件`

        `if` `not` `os.path.basename(action_path)` `in` `[`

            `"__init__.py"``,`

            `"registry.py"``,`

        `]:`

            `# 获取相对于当前文件目录的相对路径，并将路径中的斜杠替换为点号`

            `action` `=` `os.path.relpath(`

                `action_path, os.path.dirname(__file__)`

            `).replace(``"/"``,` `"."``)`

            `try``:`

                `# 动态导入相应的模块`

                `module` `=` `importlib.import_module(`

                    `f``".{action[:-3]}"``, package``=``"forge.actions"`

                `)`

                `# 遍历模块中的所有属性`

                `for` `attr` `in` `dir``(module):`

                    `func` `=` `getattr``(module, attr)`

                    `# 检查属性是否具有 'action' 属性`

                    `if` `hasattr``(func,` `"action"``):`

                        `ab` `=` `func.action`

                        `# 设置 action 的类别`

                        `ab.category` `=` `(`

                            `action.split(``"."``)[``0``].lower().replace(``"_"``,` `" "``)`

                            `if` `len``(action.split(``"."``)) >` `1`

                            `else` `"general"`

                        `)`

                        `# 将 action 注册到 self.abilities 字典中`

                        `self``.abilities[func.action.name]` `=` `func.action`

            `except` `Exception as e:`

                `# 如果出现异常，打印错误信息`

                `print``(f``"Error occurred while registering abilities: {str(e)}"``)`

5.2. 增加一个自定义action
------------------

        在action文件夹下，添加文件，有一点要求：

1.  通过@action前缀进行定义，描述好action函数入参、action 描述（重要）

举例，增加一个web请求的action：

 展开源码

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

54

`from` `__future__` `import` `annotations`

`import` `json`

`import` `time`

`from` `duckduckgo_search` `import` `DDGS`

`from` `..registry` `import` `action`

`DUCKDUCKGO_MAX_ATTEMPTS` `=` `1`

`@action``(`

    `name``=``"web_search"``,`

    `description``=``"Searches the web"``,`

    `parameters``=``[`

        `{`

            `"name"``:` `"query"``,`

            `"description"``:` `"The search query"``,`

            `"type"``:` `"string"``,`

            `"required"``:` `True``,`

        `}`

    `],`

    `output_type``=``"list[str]"``,`

`)`

`async` `def` `web_search(agent, task_id:` `str``, query:` `str``)` `-``>` `str``:`

    `"""Return the results of a Google search`

    `Args:`

        `query (str): The search query.`

        `num_results (int): The number of results to return.`

    `Returns:`

        `str: The results of the search.`

    `"""`

    `search_results` `=` `[]`

    `attempts` `=` `0`

    `num_results` `=` `8`

    `while` `attempts < DUCKDUCKGO_MAX_ATTEMPTS:`

        `if` `not` `query:`

            `return` `json.dumps(search_results)`

        `search_results` `=` `DDGS().text(query, max_results``=``num_results)`

        `if` `search_results:`

            `break`

        `time.sleep(``1``)`

        `attempts` `+``=` `1`

    `results` `=` `json.dumps(search_results, ensure_ascii``=``False``, indent``=``4``)`

    `print``(f``"result:{results}"``)`

    `return` `results`

5.3. agent.py最简化代码
------------------

 展开源码

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

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

`import` `json`

`from` `forge.actions` `import` `ActionRegister`

`from` `forge.sdk` `import` `(`

    `Agent,`

    `AgentDB,`

    `ForgeLogger,`

    `Step,`

    `StepRequestBody,`

    `Task,`

    `TaskRequestBody,`

    `Workspace,`

`)`

`LOG` `=` `ForgeLogger(__name__)`

`from` `.sdk` `import` `PromptEngine, chat_completion_request`

`class` `ForgeAgent(Agent):`

    `def` `__init__(``self``, database: AgentDB, workspace: Workspace):`

        `"""`

        `The database is used to store tasks, steps and artifact metadata. The workspace is used to`

        `store artifacts. The workspace is a directory on the file system.`

        `Feel free to create subclasses of the database and workspace to implement your own storage`

        `"""`

        `super``().__init__(database, workspace)`

        `self``.abilities` `=` `ActionRegister(``self``)`

    `async` `def` `create_task(``self``, task_request: TaskRequestBody)` `-``> Task:`

        `task` `=` `await` `super``().create_task(task_request)`

        `LOG.info(`

            `f``"📦 Task created: {task.task_id} input: {task.input[:40]}{'...' if len(task.input) > 40 else ''}"`

        `)`

        `return` `task`

    `async` `def` `execute_step(``self``, task_id:` `str``, step_request: StepRequestBody)` `-``> Step:`

        `# something additon`

        `# Firstly we get the task this step is for so we can access the task input`

        `task` `=` `await` `self``.db.get_task(task_id)`

        `#  Create a new step in the database`

        `step` `=` `await` `self``.db.create_step(`

            `task_id``=``task_id,` `input``=``step_request, is_last``=``True`

        `)`

        `# Log the message`

        `LOG.info(f``"\t✅ Final Step completed: {step.step_id} input: {step.input[:19]}"``)`

        `# Initialize the PromptEngine with the "gpt-3.5-turbo" model`

        `prompt_engine` `=` `PromptEngine(``"gpt-3.5-turbo"``)`

        `# Load the system and task prompts`

        `system_prompt` `=` `prompt_engine.load_prompt(``"system-format"``)`

        `# Define the task parameters`

        `task_kwargs` `=` `{`

            `"task"``: task.``input``,`

            `"abilities"``:` `self``.abilities.list_abilities_for_prompt(),`

        `}`

        `# Load the task prompt with the defined task parameters`

        `task_prompt` `=` `prompt_engine.load_prompt(``"task-step"``,` `*``*``task_kwargs)`

        `# Initialize the messages list with the system prompt`

        `messages` `=` `[`

            `{``"role"``:` `"system"``,` `"content"``: system_prompt},`

            `{``"role"``:` `"user"``,` `"content"``: task_prompt}`

        `]`

        `try``:`

            `# Define the parameters for the chat completion request`

            `chat_completion_kwargs` `=` `{`

                `"messages"``: messages,`

                `"model"``:` `"gpt-3.5-turbo"``,`

            `}`

            `# Make the chat completion request and parse the response`

            `chat_response` `=` `await chat_completion_request(``*``*``chat_completion_kwargs)`

            `answer` `=` `json.loads(chat_response[``"choices"``][``0``][``"message"``][``"content"``])`

            `# Log the answer for debugging purposes`

            `# LOG.info(pprint.pformat(answer))`

            `print``(f``"answer is:{answer}"``)`

        `except` `json.JSONDecodeError as e:`

            `# Handle JSON decoding errors`

            `LOG.error(f``"Unable to decode chat response: {chat_response}"``)`

        `except` `Exception as e:`

            `# Handle other exceptions`

            `LOG.error(f``"Unable to generate chat response: {e}"``)`

        `# Extract the ability from the answer`

        `ability` `=` `answer[``"ability"``]`

        `print``(f``"ability:{ability}"``)`

        `# Run the ability and get the output`

        `# We don't actually use the output in this example`

        ``# Some action don`t need action,here you can do many thing``

        `if` `ability[``"name"``]` `not` `in` `self``.abilities.list_abilities().keys():`

            `step.output` `=` `answer[``"thoughts"``][``"text"``]`

        `else``:`

            `output` `=` `await` `self``.abilities.run_action(`

                `task_id, ability[``"name"``],` `*``*``ability[``"args"``]`

            `)`

            `# Set the step output to the "speak" part of the answer`

            `step.output` `=` `answer[``"thoughts"``][``"speak"``]`

        `# Return the completed step`

        `return` `step`

打造一个agent的步骤：

1.  创建一个任务，获取task\_id，
2.  根据上述的task\_id，执行接下来的步骤
3.  初始化提示工程，选择用什么模型
4.  使用和创建action
5.  加载系统提示词模板、自定义提示词模板
6.  运行大模型
7.  运行一个能力
8.  返回用户反馈，文本、图片、或者其他与系统的交互操作

5.4. 提示词组装方法
------------

 展开源码

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

`{% extends "techniques/expert.j2" %}`

`{% block expert %}Planner{% endblock %}`

`{% block prompt %}`

`Your task is:`

`{{ task }}`

`Answer in the provided format.`

`Your decisions must always be made independently without seeking user assistance. Play to your strengths as an LLM and`

`pursue simple strategies with no legal complications.`

`{% if constraints %}`

`## Constraints`

`You operate within the following constraints:`

`{% for constraint in constraints %}`

`- {{ constraint }}`

`{% endfor %}`

`{% endif %}`

`{% if resources %}`

`## Resources`

`You can leverage access to the following resources:`

`{% for resource in resources %}`

`- {{ resource }}`

`{% endfor %}`

`{% endif %}`

`{% if abilities %}`

`## Abilities`

`You have access to the following abilities you can call:`

`{% for ability in abilities %}`

`- {{ ability }}`

`{% endfor %}`

`{% endif %}`

`{% if best_practices %}`

`## Best practices`

`{% for best_practice in best_practices %}`

`- {{ best_practice }}`

`{% endfor %}`

`{% endif %}`

`{% if previous_actions %}`

`## History of Abilities Used`

`{% for action in previous_actions %}`

`- {{ action }}`

`{% endfor %}`

`{% endif %}`

`{% endblock %}`

这是一个jinja2模板文件，有双括号{{}}的地方就是变量，在初始化的时候需要填充进去；

对应3.2.1.1中所叙的内容，具体如下：

*   先定义角色，使用了一个叫做expert.js的模板。定义一个块block，名字为”expert“；
*   用户输入的内容填充在 {{task}}中；
*   如果存在约束constraints，则列出每一条约束条件
*   如果存在资源resources，则列出每一条资源
*   如果存在能力abilities，则列出每一条能力
*   如果存在最佳实践best\_practices，则列出每一条最佳实践
*   如果存在上一步操作previous\_actions，则列出每一条action

至于判断是否存在constraints、resources、abilities、best\_practices、previous\_actions，有一套。举个例子，在prompt上增加abilities，实现函数如下：

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

`# Initialize the PromptEngine with the "gpt-3.5-turbo" model or other model`

`prompt_engine` `=` `PromptEngine(model``=``"gpt-3.5-turbo"``, debug_enabled``=``True``)`

`# Define the task parameters`

`task_kwargs` `=` `{`

    `"task"``: task.``input``,`

    `"abilities"``:` `self``.abilties.list_abilities_for_prompt(),`

`}`

`# Load the task prompt with the defined task parameters`

`task_prompt` `=` `prompt_engine.load_prompt(``"task-step"``,` `*``*``task_kwargs)`

画图表示为：

Prompt

Jinja2模板引擎

task

constraints

resources

abilities

best\_practices

previous\_actions

ActionRegister

按照所有符合action

格式要求的.py文件

1、注册action格式  
2、依据产品需求、领域、活动类型自定义action  
3、可以拓展：互联网查询、对接RAG、

用户输入input

依据不同的场景设置不同的约束条件

可以使用的资源(**?**)

怎么更好地完成任务

上一个action

可大量拓展action

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-5cc93905-d9fc-4a93-858a-381edf36b6fd'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%31%31%32/123663221?revision=4'; readerOpts.imageUrl = '' + '/download/attachments/123663221/112.png' + '?version=4&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123663221&owningPageId=123663221&diagramName=%31%31%32&revision=4'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%31%31%32'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = 'AutoGPT进化了，再看一次'; readerOpts.attVer = '4'; readerOpts.attId = '129173463'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-06-23 12:12:27.398'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

  

  

6\. 过程中用到的经典库
=============

库名称

详细

备注

库名称

详细

备注

litellm

使用 OpenAI 格式调用所有 LLM API \[Bedrock、Huggingface、VertexAI、TogetherAI、Azure、OpenAI 等\]

在.env文件中使用

  

  

  

  

  

  

7\. 大模型使用指令测试
=============

7.1. 提示词
--------

提示词详情为：

[?](#)

1

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)