---
author: "王宇"
title: "6、FTT系统私有化部署版本功能体验与测试报告"
date: 六月05,2023
description: "（五）虚拟人资源"
tags: ["（五）虚拟人资源"]
ShowReadingTime: "12s"
weight: 757
---
*   1[1\. 系统结构](#id-6、FTT系统私有化部署版本功能体验与测试报告-系统结构)
*   2[2\. 界面布局](#id-6、FTT系统私有化部署版本功能体验与测试报告-界面布局)
*   3[3\. 系统板块](#id-6、FTT系统私有化部署版本功能体验与测试报告-系统板块)
    *   3.1[3.1. 监控预警](#id-6、FTT系统私有化部署版本功能体验与测试报告-监控预警)
        *   3.1.1[3.1.1. 板块简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-板块简介)
        *   3.1.2[3.1.2. 功能描述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能描述)
    *   3.2[3.2. 应用中心](#id-6、FTT系统私有化部署版本功能体验与测试报告-应用中心)
        *   3.2.1[3.2.1. 板块简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-板块简介.1)
        *   3.2.2[3.2.2. 我的应用](#id-6、FTT系统私有化部署版本功能体验与测试报告-我的应用)
            *   3.2.2.1[3.2.2.1. 功能描述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能描述.1)
            *   3.2.2.2[3.2.2.2. 富文本（A+）编辑器](#id-6、FTT系统私有化部署版本功能体验与测试报告-富文本（A+）编辑器)
    *   3.3[3.3. 资源母版](#id-6、FTT系统私有化部署版本功能体验与测试报告-资源母版)
        *   3.3.1[3.3.1. 板块简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-板块简介.2)
        *   3.3.2[3.3.2. 虚拟人母版](#id-6、FTT系统私有化部署版本功能体验与测试报告-虚拟人母版)
            *   3.3.2.1[3.3.2.1. 简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-简介)
            *   3.3.2.2[3.3.2.2. 功能描述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能描述.2)
            *   3.3.2.3[3.3.2.3. 本模块存在的疑问](#id-6、FTT系统私有化部署版本功能体验与测试报告-本模块存在的疑问)
    *   3.4[3.4. 知识母版](#id-6、FTT系统私有化部署版本功能体验与测试报告-知识母版)
        *   3.4.1[3.4.1. 板块简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-板块简介.3)
        *   3.4.2[3.4.2. FAQ母版](#id-6、FTT系统私有化部署版本功能体验与测试报告-FAQ母版)
            *   3.4.2.1[3.4.2.1. 功能详述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能详述)
            *   3.4.2.2[3.4.2.2. 本模块存在的疑问](#id-6、FTT系统私有化部署版本功能体验与测试报告-本模块存在的疑问.1)
            *   3.4.2.3[3.4.2.3. 私有化部署前后单库测试结果对比分析](#id-6、FTT系统私有化部署版本功能体验与测试报告-私有化部署前后单库测试结果对比分析)
        *   3.4.3[3.4.3. 指令母版](#id-6、FTT系统私有化部署版本功能体验与测试报告-指令母版)
            *   3.4.3.1[3.4.3.1. 功能详述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能详述.1)
        *   3.4.4[3.4.4. 3、系统优化需求](#id-6、FTT系统私有化部署版本功能体验与测试报告-3、系统优化需求)
        *   3.4.5[3.4.5. 4、测试结果](#id-6、FTT系统私有化部署版本功能体验与测试报告-4、测试结果)
    *   3.5[3.5. 系统设置](#id-6、FTT系统私有化部署版本功能体验与测试报告-系统设置)
        *   3.5.1[3.5.1. 模块简介](#id-6、FTT系统私有化部署版本功能体验与测试报告-模块简介)
        *   3.5.2[3.5.2. 功能描述](#id-6、FTT系统私有化部署版本功能体验与测试报告-功能描述.3)
*   4[4\. 系统优化需求（已更新在文档）](#id-6、FTT系统私有化部署版本功能体验与测试报告-系统优化需求（已更新在文档）)

1\. 系统结构
========

![](/download/attachments/101828309/FTT%E7%B3%BB%E7%BB%9F%E7%BB%93%E6%9E%84.png?version=5&modificationDate=1685674567791&api=v2)

2\. 界面布局
========

![](/download/attachments/101828309/image2023-5-30_17-43-8.png?version=1&modificationDate=1685439788628&api=v2)

云服务平台界面主要由以下几部分组成：功能菜单栏、页面路径、账号设置、功能使用操作区。

页面左侧为功能菜单栏。点击一级菜单可展开或收起二级菜单，点击二级菜单即切换功能使用操作区的页面。页面上方为页面路径，可点击上级路径返回至相应页面。页面右上角为登录账号，可在此处进入个人设置或退出登录。

3\. 系统板块
========

3.1. 监控预警
---------

### 3.1.1. 板块简介

    监控统计用于日常数据的监控运营，主要统计终端用户访问数、交互次数等。

![](/download/attachments/101828309/image2023-5-31_17-57-57.png?version=1&modificationDate=1685527077485&api=v2)

### 3.1.2. 功能描述

序号

功能模块

子模块

功能描述

注意事项

备注

1

访问统计

访问用户数/人次

1、用于统计终端用户对云服务的访问，按userid统计访问用户数，支持筛选时间段、应用、交互语种。

2、可通过鼠标悬停显示某一天的数量。

  

![](/download/attachments/101828309/image2023-6-1_16-35-23.png?version=1&modificationDate=1685608524064&api=v2)

2

交互请求数

用于统计终端用户对云服务的访问，包括请求提问、播报提问，支持筛选时间段、应用、交互语种。

  

![](/download/attachments/101828309/image2023-6-1_16-35-35.png?version=1&modificationDate=1685608535193&api=v2)

3.2. 应用中心
---------

### 3.2.1. 板块简介

    应用是后台运营系统为客户端提供云服务的核心。一个应用可包含多个不同的虚拟人，虚拟人直接引用在资源母版和知识母版中已经搭建好的模板，组合成能够在具体业务场景中和终端用户进行交互的 AI 虚拟人，并支持资源版本升级和 AI 配置的运营。

### 3.2.2. 我的应用

#### 3.2.2.1. 功能描述

序号

功能模块

子模块

功能描述

注意事项

备注

1

搜索应用

  

可搜索应用，支持筛选应用名称、引擎、平台搜索。

  

![](/download/attachments/101828309/image2023-6-1_16-37-4.png?version=1&modificationDate=1685608624460&api=v2)

2

查看应用

  

1、点击**「查看」**，可查看母版信息，其中包含应用名称、渲染引擎、系统平台、应用类型、Bundle ID、域名、应用描述、App ID、App Key、App Secret。对于可修改的字段，编辑后保存即可。

  

![](/download/attachments/101828309/image2023-6-1_16-39-28.png?version=1&modificationDate=1685608769024&api=v2)

3

配置应用  
  
  
  
  
  
  
  

创建虚拟人

1、点击**「创建」**，进入创建页面，填写虚拟人信息。

*   “虚拟人名称”：可自定义，创建后可修改。
*   “虚拟人母版”和“版本”：用于选择存在已发布的虚拟人母版及其版本
*   “虚拟人描述”：可用于备注，创建后可修改。
*   完成所有必填项后，点击**「确认」**即完成虚拟人创建。

*   “虚拟人母版”和“版本”：系统会根据应用的渲染引擎过滤出引擎一致的虚拟人母版及版本提供引用。创建后不可更换母版，但可升级版本。

![](/download/attachments/101828309/image2023-6-1_16-41-1.png?version=1&modificationDate=1685608861214&api=v2)

4

查看虚拟人

点击**「查看」**，可查看母版信息，其中包含虚拟人 ID。对于可修改的字段，编辑后保存即可。

  

![](/download/attachments/101828309/image2023-6-1_16-42-14.png?version=1&modificationDate=1685608934982&api=v2)

5

配置虚拟人  
  
  
  
  

点击**「配置」**按钮，进入虚拟人的配置页面。每个虚拟人有**【NLP 执行顺序】【NLP 答案编辑】【TTS 配置】【行为情绪配置】【富文本管理】**这几个标签页。

  

![](/download/attachments/101828309/image2023-6-1_16-43-51.png?version=1&modificationDate=1685609031877&api=v2)

6

**【NLP 执行顺序】**

    用于配置虚拟人的 NLP 执行逻辑。可为虚拟人勾选 NLP 子模块，并配置顺序和阈值。其中，角色属性寒暄话术为系统内置（阈值通常用 0.9），FAQ 和指令可选择已经训练并发布的知识母版，闲聊可选择系统集成的第三方闲聊库（不存在阈值），兜底话术是指以上模块都未命中时的反馈。

    当一个 query 输入时，系统将按配置的顺序进入每一个子模块进行识别，对于存在阈值的子模块，如果返回意图的打分高于阈值，则输出相应答案（见【NLP 答案编辑】），如果低于阈值，则继续执行下一个子模块，直至兜底。（如果没有勾选兜底，系统中还存在默认的兜底话术用于保护）。

    可点击右上角「文本测试」体验问答效果。此处系统只返回 NLP 结果，不会执行后续TTS 和行为情绪等流程。

  

![](/download/attachments/101828309/image2023-6-1_16-44-3.png?version=1&modificationDate=1685609043882&api=v2)

7

**【NLP 答案编辑】**

    用于预览虚拟人播报话术时的表现，在此基础上，支持对每个话术进行富文本编辑。除第三方闲聊库外，这里的二级标签页和**【NLP 执行顺序】**中的子模块相对应。

    对于系统内置的角色属性寒暄话术及兜底话术，可新增自定义话术。如果一个问题开启多个回复话术，命中后系统将随机输出一个。  
    针对每个话术，点击**「更多」**后可选择**「编辑富文本」**，即使用“A+编辑器”。

  

![](/download/attachments/101828309/image2023-6-1_16-44-18.png?version=1&modificationDate=1685609058908&api=v2)

8

**【TTS 配置】**

    用于修改来自母版的发音人、音量、语速、语调。  
    修改后点击**「保存」**可在预览器中体验，点击**「发布」**即更新终端效果，点击**「恢复」**可重置为上一次发布的配置。此处的修改不会影响母版的配置。

  

![](/download/attachments/101828309/image2023-6-1_16-46-5.png?version=1&modificationDate=1685609165496&api=v2)

9

**【行为情绪配置】**

    用于修改来自母版的行为情绪配置。  
    上传配表后可在预览器中体验，点击**「发布」**即更新终端效果，点击**「恢复」**可重置为上一次发布的配置。此处的修改不会影响母版的配置。

  

![](/download/attachments/101828309/image2023-6-1_16-46-18.png?version=1&modificationDate=1685609178821&api=v2)

10

**【富文本管理】**

    主要用于新增自定义富文本，也可预览【NLP 答案编辑】中编辑的富文本。此外，可将所有富文本打包下发至客户端。  
    在**【自定义富文本】页**面，点击**「新增」**，填写名称后点击**「确认」**即完成创建并生成唯一 ID，然后点击**「编辑」**进入编辑器。

    客户端可通过 Aplus 接口，用 ID 作为入参，向服务端请求该富文本进行播放。此外，点击**「打包管理」**并进行**「打包更新」**，可以将虚拟人所有的富文本单独打包下发给客户端以供缓存在本地。

  

![](/download/attachments/101828309/image2023-6-1_16-53-8.png?version=1&modificationDate=1685609589058&api=v2)

11

删除虚拟人

在虚拟人列表页，点击**「删除」**，在输入登录密码通过校验后，即完成虚拟人的删除。

*   如果应用及虚拟人已上线，请谨慎使用“删除虚拟人”的操作。

![](/download/attachments/101828309/image2023-6-1_16-55-11.png?version=1&modificationDate=1685609711617&api=v2)

12

运营应用

会话记录

用于保存终端用户和虚拟人的交互记录，也为优化虚拟人的知识母版提供参考。支持通过时间段、虚拟人、用户输入等条件进行筛选。

  

![](/download/attachments/101828309/image2023-6-1_17-11-24.png?version=1&modificationDate=1685610684927&api=v2)

  

#### 3.2.2.2. 富文本（A+）编辑器

从配置虚拟人的【NLP答案编辑】和【富文本管理】点击击**「编辑」**进入编辑器；

详情见链接：[4、A+ 编辑器的功能与测试报告](/pages/viewpage.action?pageId=101837841)

3.3. 资源母版
---------

### 3.3.1. 板块简介

资源母版用于管理可供复用的资源包，并支持版本管理。

### 3.3.2. 虚拟人母版

#### 3.3.2.1. 简介

虚拟人母版用于管理可复用的虚拟人资源和默认 AI 能力，并支持版本管理。版本发布后可在应用中引用，在不同应用中可以引用同一个虚拟人母版，它们和应用中的虚拟人是模板和实例的关系

#### 3.3.2.2. 功能描述

序号

功能模块

子模块

功能描述

注意事项

备注

1

搜索虚拟人母版

  

可搜索虚拟人母版，支持筛选母版ID、母版名称、渲染擎搜索。

  

![](/download/attachments/101828309/image2023-6-1_17-13-5.png?version=1&modificationDate=1685610785229&api=v2)

2

创建虚拟人母版

  

点击**「创建」**，进入创建页面，填写母版信息。

*   “母版名称”会在应用中创建虚拟人的母版选择中显示，创建后可修改。
*   “母版描述”可用作备注，创建后可修改。
*   “渲染引擎”选择虚拟人的渲染引擎。
*   “初始版本”默认为 v1.0.0。
*   “初始模型结构”针对大版本 v1，“拆分”和“不拆分”需要上传的美术资源结构不同。如果选不拆分，需上传的模型为全身模型；如果选拆分，需上传的模型分为头、头发、上身、下身、套装、鞋子各部件模型。创建后，如果需要变更结构，可通过新增大版本重新选择是否拆分。（目前仅支持不拆分，后续将随 PTA 功能支持拆分）
*   “初始版本资源”支持手动配置和整包上传两种。整包上传通常用于资源迁移，在版本管理中，已发布的版本支持下载资源包，可将下载的资源包在此处上传。
*   完成所有必填项后，点击**「确认」**即生成新的虚拟人母版及其 v1.0.0 版本。

*   “渲染引擎”选择的渲染引擎需和应用的渲染引擎一致，创建后不可修改。

![](/download/attachments/101828309/image2023-6-1_17-14-16.png?version=1&modificationDate=1685610856999&api=v2)  

  

3

查看虚拟人母版

  

点击**「查看」**，可查看母版信息，其中包含母版ID、母版名称、母版、母版描述、渲染引擎、创建时间、最后修改时间、修改人字段，对于可修改的字段，编辑后保存即可。

  

![](/download/attachments/101828309/image2023-6-1_17-15-28.png?version=1&modificationDate=1685610928142&api=v2)

4

管理虚拟人母版  
  
  
  
  
  
  
  
  
  

  

   点击**「管理」**进入母版，默认进入该母版已有的最高版本，对于新创建的母版即进入v1.0.0。左上角**「版本管理」**为版本列表的入口，右上角**「发布」**按钮，左侧为预览器，右侧为上传美术资源和配置 AI 能力的区域。

  

![](/download/attachments/101828309/image2023-6-1_17-17-30.png?version=1&modificationDate=1685611050662&api=v2)

5

版本配置  
  
  
  

    每个虚拟人版本都有**【角色模型】【角色骨骼】【角色动画】【语种配置】**四个标签页。完整上传角色模型、角色骨骼、角色动画，并在语种配置中配置角色状态后，预览器中可显示虚拟人形象

  

  

6

**【角色骨骼】**

    在**【角色骨骼】**页面，点击「新增」，选择骨骼的口型数量，上传骨骼文件，点击**「保存」**即完成新增。角色骨骼最多存在一个，已上传的骨骼支持**「更新」**。

  

![](/download/attachments/101828309/image2023-6-1_17-19-50.png?version=1&modificationDate=1685611190761&api=v2)

7

**【角色模型】**

    在**【角色模型】**页面，如果结构为“不拆分”，则显示**【全身】**二级标签页。点击**「新增」**，填写模型名称，上传模型文件，点击**「保存」**即完成新增。全身模型最多存在一个，已新增的模型支持**「更新」**和**「删除」**。

  

![](/download/attachments/101828309/image2023-6-1_17-24-30.png?version=1&modificationDate=1685611470680&api=v2)

8

**【角色动画】**

    在**【角色动画】**页面，可进行批量新增或单个新增动画文件。动画通常使用批量新增，点击**「批量新增」**即可引用本地文件。已上传的动画支持**「修改」「播放」「删除」**。

  

![](/download/attachments/101828309/image2023-6-1_17-27-5.png?version=1&modificationDate=1685611625963&api=v2)

9

**【语种配置】**

     在**【语种配置】**页面，可选择并切换语种，不同语种并存，配置相互独立。每个语种都有**【角色状态】【对话能力】【行为情绪】**三个二级页面。

*   在**【角色状态】**页面，有“待命”“无聊”“倾听”“思考”四种状态，需为这四种状态配置动画。
*   在**【对话能力】**页面，可配置 NLP 闲聊库和 TTS 参数，分别点击**「保存」**后即在预览器中生效。
*   在**【行为情绪】**页面，点击**「点击上传」**按钮可为虚拟人配置行为情绪动画映射表（有固定模板），为每个行为情绪标签配置动画，上传后即在预览器中生效。

  

![](/download/attachments/101828309/image2023-6-1_17-27-39.png?version=1&modificationDate=1685611659954&api=v2)

10

预览器体验

**【形象预览】**

    在预览器中，可左击鼠标旋转虚拟人，右击鼠标拖拽虚拟人，滚轮滑动缩放虚拟人，点击**「点此复位」**将虚拟人复位。

  

![](/download/attachments/101828309/image2023-6-1_17-29-30.png?version=1&modificationDate=1685611770931&api=v2)

11

**【交互预览】**

    在“文字提问”模式，输入文本并发送，虚拟人将会播报**【对话能力】**中NLP 闲聊库返回的结果；在“文字播报”模式，输入文本并发送，虚拟人将会播报输入的文本。

  

![](/download/attachments/101828309/image2023-6-1_17-29-42.png?version=1&modificationDate=1685611782963&api=v2)

12

版本发布

    完成以上步骤后，点击右上角**「发布」**即可发布版本。系统将自动校验是否完成必要的上传和配置，并提示已经完成配置的语种。此外，系统将进行更新项校验，只有相较于上一个子版本，在角色模型、角色骨骼、角色动画、角色状态上存在变更时才支持发布。发布后的版本仍可预览，但不可变更美术资源和 AI 能力。

  

![](/download/attachments/101828309/image2023-6-1_17-45-52.png?version=1&modificationDate=1685612752697&api=v2)

13

版本管理

*   点击**「版本管理」**可打开版本列表。

    版本号有三位，即 X.X.X，第一位是大版本号，后两位是子版本号。每个子版本都是一个可以完整交互的虚拟人母版。  
针对每个子版本，可进行**「查看更新项」「前往」「添加描述」「下载资源包」「删除」**操作。

*   点击**「查看更新项」**，可查看该子版本和上一个子版本相对比的更新项。
*   点击**「前往」**，可切换至该版本并刷新页面。
*   点击**「添加描述」**，可对该版本进行描述备注。
*   点击**「下载资源包」**，可下载该版本完整资源的 zip 压缩包，仅支持已发布的版本。在创建母版或新增大版本的环节，可选择整包上传。
*   点击**「删除」**，可删除未发布的子版本，已发布的版本不支持删除，每个大版本的第一个子版本，即 vX.0.0 也不支持删除。

  

![](/download/attachments/101828309/image2023-6-1_17-46-34.png?version=1&modificationDate=1685612794378&api=v2)

14

版本新增

**\[新增子版本\]**

  当某个大版本的最新子版本已发布时，可点击「新增子版本」，支持自定义版本号。点击**「确认」**后，系统将自动复制沿用上一个子版本的资源和配置，以供修改变更。点击「前往」可切换至该版本进行管理。

**\[新增大版本\]**  
  点击**「新增版本」**，可创建大版本。大版本号自动生成，可重新选择“模型结构”和“版本资源”的配置方式。点击**「确认」**后，系统将生成一个美术资源和 AI 能力配置都为空的版本。点击「前往」可切换至该版本进行管理，操作流程及内容和初始版本相同。

  

![](/download/attachments/101828309/image2023-6-1_17-48-2.png?version=1&modificationDate=1685612883006&api=v2)

15

删除虚拟人母版

  

点击**「删除」**，在输入登录密码通过校验后，如果系统校验没有虚拟人正在使用，即完成删除。

出于保护，没有被应用虚拟人使用的虚拟人母版可以删除，有虚拟人正在使用的虚拟人母版不支持删除。

  

#### 3.3.2.3. **本模块存在的疑问**

序号

所属模块

问题描述

图片

提出人

解答结果

解决人

序号

所属模块

问题描述

图片

提出人

解答结果

解决人

1

语种配置

行为情绪标签配置多个动画资源下，是随机调取一个播放还是全都播放？

  

秦路航

  

  

3.4. 知识母版
---------

### 3.4.1. 板块简介

    知识母版用于管理可复用的业务知识库，发布后支持跨应用的多个虚拟人引用。它们和应用中虚拟人的知识是模板和实例的关系。  
    知识母版分两大类。一类是问答知识，另一类是技能知识。 简要地说，不需要客户端执行逻辑的属于问答知识，需要客户端执行逻辑的属于技能知识。FAQ 属于问答知识，指令属于技能知识。

### 3.4.2. FAQ母版

#### 3.4.2.1. 功能详述

序号

功能模块

子模块

功能描述

备注

1

编辑母版

分类管理

1、【新增分类】FAQ库的分类可按需进行增加或者删减，分类名称可修改但不可重复。

2、【编辑】编辑分类名称。在新增分类下新建FAQ，默认该分类。

2、【删除】删除分类时，分类下的问答对会被移动到【未分类】中。

  

搜索标准问

1、【搜索标准问关键词】即搜索标准问，通过匹配命中的关键词返回搜索结果，且只能对当前选择的分类下的标准问词条内容进行搜索。

  

全量导出

1、目前只支持全量导出，不支持单独或部分导出。

2、导出Excel文件格式与批量上传模板相同。

3、导出的问答对按上传时间排序，最新上传的靠前。

  

批量导入

1、当添加大量的问答对的时候可以使用批量导入；重复相同问答仅导入单个。  
2、下载模板，按照模板的格式和要求填入分类、标准问、标准答、相似问；  
3、导入格式：

![](/download/attachments/101828309/image2023-3-15_15-42-53.png?version=1&modificationDate=1685611680309&api=v2)

4、报错分析：

1）参数无效：表格"Sheet"未改命名为“FAQ”；加密文档，上传错误；问题之间有空行【error reading from server EOF】；确认格式正确后，仍上传失败极可能是系统异常，刷新网页重新上传即可；

2）文件纠错分析：词条标红可能存在重复。

  

新增一条

1、逐条添加新问答对，此处仅支持选择问答对【所属分类】及进行【标准问】、【回复话术】填写，无法添加相似问。

2、【分类】一个问答只能选择一个分类，【标准问】新增标准问不能与已有标准问重复，不超过250字，【回复话术】只能输入一条标准问，不超过300字。

  

相似问

1、点击相似问列的蓝色数字即可进行相似问的添加、增减操作，修改后需点击保存，否则无效。

2、暂不支持批量导入。

3、相似问允许添加相同语句，勾选其中一个，相同的语句会同时选中，但添加后系统会自动合并所有相同语句。

  

问答对操作

1、【编辑】可对单个问答对内容（所属分类、标准问、回复话术）进行编辑，编辑后点击保存。

2、【删除】删除单条问答对，删除后无法找回。

  

问答对启用

1、【启用】启用按钮变蓝即问答对生效。

2、问答对关闭状态并经过【FAQ训练】后，输入该问题标准问进行【FAQ测试】无法匹配出回复话术。

![](/download/attachments/101828309/image2023-3-16_10-27-53.png?version=1&modificationDate=1685611680456&api=v2)

  

问答对批量管理

勾选问答对左侧方框，出现【选中项】下拉框，可对已选中的进行批量管理，包括批量删除、批量启用、批量关闭。

1、【批量删除】批量删除已勾选的FAQ，删除后无法找回，标题行可全选当前页的全部FAQ。

2、【批量启用】批量启用已勾选的FAQ，标题行可全选当前页的全部FAQ。

3、【批量关闭】批量关闭已勾选的FAQ，标题行可全选当前页的全部FAQ。

  

问答对页面管理

1、FAQ显示数量切换，提供10/页、20/页、30/页、40/页、50/页、100/页共六种选项。

2、点击页码可快速切换页面，也可自己输入页码后点击enter键跳转。

  

2

训练母版

开始训练

1、用于在【编辑模板】页面对标准问、相似问及问题状态进行编辑后，训练并更新母版。

2、仅修改回复话术不允许进行训练，QQ匹配类型中，对回复话术进行训练无太大意义，培训文档描述为“仅编辑话术不需要训练”。

  

训练记录

1、记录下最后编辑时间、上次训练时间、上次发布时间三部分

  

3

排查母版

综述

1、输入问句进行排查，系统给出的【当前命中标准问】与【期望命中的标准问】不符，则表明该【当前命中标准问】置信度>【期望命中的标准问】置信度，那么就需要把输入的排查问句添加到期望FAQ的相似问中以提升期望标准问的置信度，或者对预测标准问的影响因素进行删除或者转移来降低预测标准问的置信度，最终实现预测标准问与期望标准问一致。

2、关键词解释：

【当前命中标准问】：输入问句排查后系统实际匹配到的标准问（实际结果）

【期望命中的标准问】：输入问句期望匹配到的标准问（预先期望）

  

提问

1、输入待排查问句点击【提交】可以得出召回模块以及召回问句对应的影响因素  
2、通过模糊搜索命中关键词返回搜索结果

  

提问结果返回模板

1、根据输入的待排查问句返回最多三个答案候选项并按置信度排序  
2、该模块包括【当前命中标准问】、【影响命中的相似问】两部分  
3、【影响命中的相似问】就是选中上面召回问句候选项后对应的相似问，这部分可以对相似问进行调整包括删除和转移；删除是去除选中问句候选项对应的相似问，点击转移就将影响因素的转到期望命中标准问下

  

期望命中

1、可以选择【期望命中的标准问】的问句并对其进行相似问管理  
2、选择【期望命中的标准问】后会列出已有相似问，可以对已有相似问进行查看、添加、删除，删除支持批量删除和单条删除  
3、期望命中对相似问的管理后的结果与【编辑模板】同步

  

4

测试母版

综述

1、测试模板提供批量测试和单条测试两种测试方式。  
2、测试模板包含了测试输入部分、测试结果、创建批测、批测管理四部分

  

单条问句测试

1、进行单条问句的测试；  
2、输入测试问句后点击【提交】返回测试结果；  
3、通过模糊匹配关键词返回答案，如果没有匹配到则返回空格  
4、测试结果包括了问题、回答、命中标准问、置信度和，召回问句根据置信度排序

  

创建批测

1、批量测试：

![](/download/attachments/101828309/image2023-3-15_15-55-30.png?version=1&modificationDate=1685611680505&api=v2)

2、批量测试模板如上图，批量测试结果如下图，批量测试只显示置信度最高的单条预测标准问，并判断预测标准问与期望标准问是否一致。

![](/download/attachments/101828309/image2023-3-16_11-14-42.png?version=1&modificationDate=1685611680531&api=v2)

3、即使测试结果为不正确其置信度也可能很高

4、准确率=正确数量/测试数量

   

批测管理

1、支持查看、下载历史批测结果，导出的文件为Excel表格。

2、列表显示批测文件对应批测状态、批测结果，按上传时间排序，后上传的靠前。

  

5

发布母版

发布

1、【发布模板】用于将已训练的母版更新到线上，训练成功并测试验证后点击“发布”即更新线上效果。

2、“上次训练时间”、“上次发布时间”可用于参考最新训练的模型是否已发布。

3、每个FAQ库会保留两个模型，一个为线上模型，一个为预览模型。【FAQ训练】是更新预览模型，提供测试；【FAQ发布】是将预览模型更新到线上。

  

记录

1、记录下最后编辑时间、上次训练时间、上次发布时间三部分。

  

#### 3.4.2.2. **本模块存在的疑问**

序号

所属模块

问题描述

图片

提出人

解答结果

解决人

序号

所属模块

问题描述

图片

提出人

解答结果

解决人

1

编辑母版

在私有化版本上传后删除再上传不了，校验结果几乎把所有FAQ标准问标红。是否存在删除残留干扰（2023.6.1）

![](/download/attachments/101828309/image2023-6-1_16-37-8.png?version=1&modificationDate=1685611680639&api=v2)

李明仙

系统缺陷，已处理

虚拟人公司

  

  

  

  

  

  

  

#### 3.4.2.3. **私有化部署前后单库测试结果对比分析**

[私有化部署前测试网址：https://open.haihuman.com/userSpace/knowledge/faq\_troubleshooting](https://open.haihuman.com/userSpace/knowledge/faq_troubleshooting)

私有化部署后测试网址：[FAQ测试 (yingzi.com)](https://vdh-open.yingzi.com/userSpace/knowledge/faq_test)

内容板块

私有化部署前准确率

私有化部署后准确率

变化幅度

备注

内容板块

私有化部署前准确率

私有化部署后准确率

变化幅度

备注

食品食谱

98.25%

97.89%

\-0.36%

  

服务助手

96.65%

97.01%

0.36%

  

万得厨硬件

95.83%

97.22%

1.39%

  

平台宣传

96.94%

96.94%

0.00%

  

运动顾问

97.15%

97.97%

0.82%

  

美食推荐

95.01%

95.29%

0.28%

  

分析：问答库分类测试准确率总体略有上升，可见私有化部署版本的语义理解能力比之前略有提升。

### 3.4.3. 指令母版

#### 3.4.3.1. 功能详述

序号

功能模块

子模块

功能描述

备注

1  
  
  
  
  
  
  

定义词槽  
  
  
  
  
  
  

搜索词槽名称

1、【搜索词槽名称】在词槽名称中进行搜索匹配，返回搜索的词槽，支持关键词搜索

/

实体

1、点击实体列的蓝色数字即可进行实体的新增、删除和修改，编辑后需进行保存，否则编辑无效。

2、【编辑实体】可对实体的信息包含ID、标准名、别名进行编辑

3、【新增实体】点击最下方的新增实体，进行实体的添加

4、【删除】可逐个删除词槽内的实体

5、【保存】对编辑的内容进行保存

6、【返回】进入词槽管理页面，且编辑的内容不会保存

1、实体ID：实体唯一标识，不能包含中文，同一词槽内不可重复；新增实体的ID与已有的实体ID重复，无法新增，显示“已存在”；不同词槽内的实体ID可重复，相互不影响

2、实体标准名，同一词槽内不可重复，不超过50字

3、实体别名有多个时用”==“进行连接，如汉语==普通话==中国语

4、词槽内需至少剩一个实体，将词槽中的所有实体删除后无法进行保存，显示“参数无效”

词槽编辑

1、【编辑】可对词槽名称和词槽描述进行修改

2、【删除】能对整个词槽进行删除，删除后无法找回，如词槽存在关联的指令，则无法删除

1、词槽名称编辑的时候可能会导致重复名称，这个时候可以成功保存，新增重复项则无法完成操作

  

导出词槽

1、【导出词槽】excel表格的形式导出词槽信息，包含词槽名称、词槽描述、实体ID、实体标准名、实体别名

1、导出文件名为command\_109\_xxxxxxxxxx。其中109是指令库名称的business ID

导入词槽

1、【导入词槽】添加大量词槽时，可通过词槽模板进行词槽批量导入

2、下载模板后，按模板的格式和要求填入词槽名称、词槽描述、实体ID、实体标准名、实体别名，完成后上传文件

3、导入格式：

![](/download/attachments/101828309/image2023-3-20_11-24-10.png?version=1&modificationDate=1685702976461&api=v2)

1、词槽名称必填，不可重复，不超过50字，支持汉字

2、导入时对实体ID、实体标准名同样要求不可重复

3、导入失败原因：

*   表格"Sheet"未改命名为“词槽”
*   加密文档无法导入
*   系统本身原因，可以刷新重试

导入失败报告

1、【下载校验结果】导入报告的表格和导入表格格式一致，导入失败的词槽名称单元格会用红色填充

![](/download/attachments/101828309/image2023-6-1_20-56-1.png?version=1&modificationDate=1685702976507&api=v2)

  

新增词槽

1、【新增词槽】显示词槽信息，词槽名称必填，词槽描述选填

2、【保存】进行词槽名称保存

3、【返回】进入词槽管理页面，且词槽信息不会保存

1、【新增词槽】出现相同词槽名称会显示数据库添加异常，词槽已存在

词槽列表

1、【词槽列表】可以进行每页展示数量和页数选择

2、页面展示支持10条/页、20条/页、30条/页、40条/页、50条/页、100条/页

3、支持手动切换下一页和输入页数快速切换

/

2  
  
  
  
  
  
  

编辑母版  
  
  
  
  
  
  

搜索指令名称

1、【搜索指令名称】是在指令名称中进行搜索匹配，通过关键词匹配返回搜索的结果

/

新增分类

1、【新增分类】填写分类名称

2、【完成】进行新增分类的保存

3、【取消】取消保存

/

编辑分类

1、【编辑】对分类名称进行修改

2、【完成】进行编辑内容的保存

3、【取消】取消保存

/

删除分类

1、【删除】删除对应的分类，分类里面的指令会转移到”未分类”中

1、“未分类”不可编辑和删除

指令编辑

1、【编辑】可对指令信息进行编辑，包括分类、指令名称、指令标识、指令描述、关联词槽、追问话术、执行成功话术、执行失败话术

2、【删除】可删除整条指令内容，删除后无法找回

1、不关联词槽情况下不会显示是否多轮追问

2、关联词槽状态下不追问，不会显示追问话术和追问失败话术

3、指令名称和指令标识编辑的时候出现与已有指令的名称和标识重复，这个时候可以成功保存，新增重复项则无法完成保存

4、若添加关联词槽且追问次数大于0，则追问话术和追问失败话术必填

5、正向反馈话术和负向反馈话术可以添加多个，系统随机回复

  

相似问

1、点击相似问列的蓝色数字即可进行相似问的添加和删除，编辑后需进行保存，否则编辑无效

2、【引用关联词槽】如果指令关联了词槽，则相似问可引用关联词槽

3、【添加】用于相似问的新增，在语料需要引用词槽的位置选择要引用的词槽名称，如设置\[语言\]

4、【删除勾选项】可勾选想要删除的相似问，进行批量删除

5、【保存】对编辑的内容进行保存

6、【返回】进入指令编辑页面，且编辑内容不会保存

1、如果指令关联的词槽为系统词槽（duration和number），则新增相似问时无法直接引用关联词槽名字，直接输入包括的词槽实体的语料即可，如大火三分钟

2、无法对某一条相似问进行内容的修改，只能直接删除

指令状态

1、【状态】开关即为指令生效开关

2、指令状态为关闭并经过指令训练时，通过指令测试无法匹配到该指令

![](/download/attachments/101828309/image2023-3-20_13-57-1.png?version=1&modificationDate=1685702976536&api=v2)

  

批量操作

1、【批量设置】多选指令后，可对勾选的指令进行批量操作

2、【批量删除】将勾选的所有指令删除

3、【批量启用】将勾选的所有指令的启用状态打开

4、【批量关闭】将勾选的所有指令的启用状态关闭

![](/download/attachments/101828309/image2023-6-1_21-5-16.png?version=1&modificationDate=1685702976564&api=v2)

  

导出指令

1、【导出指令】excel表格的形式导出指令信息，包含分类、指令名称、指令标识、指令描述、关联词槽、追问话术、追问失败话术、追问次数、相似问、执行成功话术、执行失败话术

2、导出表格与导入模板格式一致

1、目前仅支持全部导出，暂不支持选择性导出和按分类导出

  

导入指令

1、【导入指令】当需要添加大量指令时，可通过指令模板将指令信息批量导入

2、根据指令模板的要求和格式填入分类、指令名称、指令标识、指令描述、关联词槽、追问话术、追问失败话术、追问次数、相似问、执行成功话术、执行失败话术，完成后上传文件

3、导入格式：

![](/download/attachments/101828309/image2023-6-1_20-31-19.png?version=1&modificationDate=1685702976590&api=v2)

1、指令名称：

*   指令名称和已有指令名称重复的，该指令导入失败
*   缺少指令名称的，指令导入无效

2、指令标识：

*   不能包含中文名
*   系统上不同指令的指令标识可以重复（系统优化需求已提出）
*   表格中缺少指令标识也可以导入成功

3、词槽：

*   如果导入指令的关联词槽在词槽库中不存在，则会自动在词槽列表添加相应词槽，但无实体
*   引用词槽名称时用的括号为\[ \]，使用其他括号无法引用到词槽
*   指令关联的词槽为系统词槽（duration和number），则新增相似问时无法直接引用关联词槽名字，直接输入包括的词槽实体的语料即可，如大火三分钟

4、追问次数

*   追问次数未填，则默认为0
*   追问次数如果填写超过3次，则导入默认为1次

5、报错分析：

*   表格页签“sheet”未改名为“指令”
*   加密文档无法导入
*   系统本身原因，可以刷新重试

导入失败报告

1、【下载校验结果】导入报告的表格和导入表格格式一致，导入失败的指令名称和指令标识单元格会用红色填充

![](/download/attachments/101828309/image2023-6-1_20-33-59.png?version=1&modificationDate=1685702976621&api=v2)

  

新增指令

1、【新增指令】进行指令的添加。指令名称、指令标识必填，指令描述选填，选择关联词槽，添加追问话术、反馈话术等

2、【保存】保存编辑好的指令

1、【新增指令】出现相同指令名称会显示异常

2、新增指令可一次关联多个词槽

3、不关联词槽情况下不会显示是否多轮追问

4、关联词槽状态下不追问，不会显示追问话术和追问失败话术

指令列表

1、【指令列表】展示指令的页面，按创建时间排序新增在前

2、页面展示支持10条/页、20条/页、30条/页、40条/页、50条/页、100条/页；

3、支持手动切换下一页和输入页码快速切换

  

3

训练母版

开始训练

1、【开始训练】编辑的指令要通过训练并成功后，才能够在指令测试中进行期望的反馈

1、缺少追问话术可以训练成功

2、关联词槽中没有实体可以训练成功

3、缺少指令标识可以训练成功

训练记录

1、显示训练的信息，包含最后编辑时间、上次训练时间、上次发布时间三部分

  

4

测试母版

输入测试指令

1、在输入想测试的指令后点击【发送】，可以显示出对话框或者结果。

2、可以通过【清空窗口】清空当前测试的所有内容

1、在指令训练过程中输入测试指令会显示“未找到训练成功的导航库”

2、在删除指令后，不进行训练，输入该指令进行测试会显示：服务端进入exception报错，error

识别结果

1、显示answer，score，code，failed\_answer，succeed\_answer等内容

*   answer显示对话框给出的回复，如有追问，则显示追问话术；如识别到指令，则显示default；如识别不到指令，则显示null
*   score表示测试问句与匹配到的指令的匹配分数，如测试问句与指令的相似问完全相同，则score为1
*   code表示系统匹配到的指令的指令标识
*   failed\_answer表示系统匹配到的指令的执行失败话术
*   succeed\_answer表示系统匹配到的指令的执行成功话术
*   similar value表示识别到的系统中已有的词槽实体

2、【copy】可以将指令库识别结果处的代码进行复制

  

5

发布母版

指令发布

1、【发布】用于发布已经训练成功的指令

2、发布之后，指令才能同步到客户端进行语音识别

1、指令训练过程中，指令无法发布

发布记录

1、显示发布的信息，包含最后编辑时间、上次训练时间、上次发布时间三部分

  

### 3.4.4. 3、系统优化需求

序号

功能模块

子模块

问题描述

需求描述

反馈人

问题分类

备注（图片）

跟进情况

跟进人

序号

功能模块

子模块

问题描述

需求描述

反馈人

问题分类

备注（图片）

跟进情况

跟进人

1

定义词槽

词槽删除

词槽只能逐个删除

增加批量删除词槽的功能

马冬颖

需求

  

  

  

2

指令库

词槽管理

无法在词槽管理页面查看词槽的关联指令

词槽管理页，关联指令的数字设置成链接形式，点击后链接到词槽关联到的所有指令（参考词槽对应实体数字的设置）

马冬颖

需求

  

  

  

3

编辑母版

指令标识

逐条编辑指令的页面显示的是“指令编码”，导入模板中显示的是“指令标识”

统一导入模板与编辑指令页面对于“指令标识”的表述

马冬颖

缺陷

![](/download/thumbnails/101828309/image2023-6-1_20-43-49.png?version=1&modificationDate=1685702976653&api=v2)

![](/download/attachments/101828309/image2023-6-1_20-44-24.png?version=1&modificationDate=1685702976677&api=v2)

  

  

4

编辑母版

分类

指令只能逐个修改分类

支持批量修改指令分类

马冬颖

需求

  

  

  

5

编辑母版

相似问

引用系统词槽（duration和number）时，相似问中不能直接用词槽名称来代替，要举实体的例子来代替，比如三分钟

引用系统词槽时，相似问中同样可以用词槽名称来代替

马冬颖

需求

![](/download/attachments/101828309/image2023-3-21_15-55-1.png?version=1&modificationDate=1685702976701&api=v2)

  

  

6

编辑母版

导入结果报告

生成的导入报告只是将导入失败的词槽和指令名称标红，在数据量很大的情况下很难找到，也不清楚导入失败的原因

在原有表格的基础上添加一列，写明导入结果及失败原因

马冬颖

需求

  

  

  

7

编辑母版

批量导出

只支持相应指令库下面所有指令的全量导出

支持指令按照分类导出和多选导出

马冬颖

需求

  

  

  

8

测试母版

批量测试

目前指令只能逐条测试，在相似问较多的情况下，测试工作量较大

提供指令批量测试的功能

马冬颖

需求

  

  

  

9

指令训练

指令训练

目前指令训练只能看到训练中的状态，无法查看训练进度和训练时间

提供指令训练进度和训练时间查询的功能

廖鸿珍

需求

  

  

  

### 3.4.5. 4、测试结果

![](/download/attachments/101828309/image2023-6-2_17-53-14.png?version=1&modificationDate=1685702976739&api=v2)

3.5. 系统设置
---------

### 3.5.1. 模块简介

系统设置用于管理账号与用户组权限。

### 3.5.2. 功能描述

序号

功能模块

子模块

功能描述

注意事项

备注

序号

功能模块

子模块

功能描述

注意事项

备注

  

成员

成员搜索

目前支持按照账户名筛选进行收缩。

  

![](/download/thumbnails/101828309/image2023-6-2_9-44-59.png?version=1&modificationDate=1685670299244&api=v2)

  

  

成员创建

点击「创建」，填写账号信息。

*   “账户名”是账号的唯一标识，支持英文、数字、符号，不支持汉字，创建后不支持修改。
*   “密码”必须包含英文、数字、符号，6-16 位，创建后可修改。
*   “真实姓名”可填写用户姓名，创建后可修改。
*   “权限”即选择用户组，创建后可修改。
*   填写以上内容后，点击「确定」即完成创建，用户可使用账户名和密码进行登录。

1、目前用户的账户名设置格式为”FTT\_用户姓名每个字的首位字母小写缩写“，比如秦路航的账;户名为”FTT\_qlh"

2、分配权限时需要先在【用户组】界面创建用户组，选择对应权限点再进行分配，同一个用户组可以给多个人员分配.

![](/download/attachments/101828309/image2023-6-2_9-48-34.png?version=1&modificationDate=1685670514453&api=v2)

  

用户组

新增用户组

点击「新增」，填写用户组信息即可完成创建。

*   ”用户组名称“可包含英文、数字、符号。
*   ”用户组描述“可填写用户组的分配角色、权限内容等描述。

  

![](/download/attachments/101828309/image2023-6-2_9-56-14.png?version=1&modificationDate=1685670974257&api=v2)

  

  

编辑用户组

在已有用户组点击「编辑」，可编辑用户组信息。

  

![](/download/attachments/101828309/image2023-6-2_10-1-35.png?version=1&modificationDate=1685671295957&api=v2)

  

  

权限分配

点击已有用户组，可在右侧区域为该用户组勾选权限。

  

![](/download/thumbnails/101828309/image2023-6-2_9-57-52.png?version=1&modificationDate=1685671072646&api=v2)

  

  

删除用户组

在已有用户组点击「删除」，可将用户组删除。

有账号在使用的用户组不支持删除。

![](/download/attachments/101828309/image2023-6-2_10-0-56.png?version=1&modificationDate=1685671256949&api=v2)

  

  

  

  

  

  

  

4\. 系统优化需求（已更新在文档）
==================

.......

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)