---
author: "王宇"
title: "23年11周学习笔记——FAQ知识管理分类、FAQ系统测试"
date: 三月16,2023
description: "2023年学习笔记"
tags: ["2023年学习笔记"]
ShowReadingTime: "12s"
weight: 453
---
**（一）、知识库管理**

问答型对话没有需要参数化的内容，往往具有固定的标准答案；这类型的对话逻辑梳理其实就是要对问题进行分类，或者叫知识分类。如  
问题类型：WiFi登录  
问题：WiFi密码是多少，WiFi怎么登录

  
知识库管理是类似的，所以在梳理整个知识库管理的分类框架上面，就犯难了，因为涉及到的业务线多，很难区分清楚，相互之前还存在重叠，我们后面在补充数据的时候很容易出现数据[冗余](https://so.csdn.net/so/search?q=%E5%86%97%E4%BD%99&spm=1001.2101.3001.7020)，所以阅读了一些资料以后，决定采用MECE分析法进行分析。  
机器人知识库必须有良好的分类才能便于理解、学习与后期的维护。  
如果知识库分类复杂，毫无逻辑，那么人们在提问的时候，从知识库里面搜索答案的时候，就不知道对应的问题是属于哪个知识点的分类，后续在进行维护的时候更是很大的工作量。所以，当知识点逐渐变多后，我们需要一些合理的方式来对知识点的分类进行组织和管理。知识点组织的结构梳理有助于在知识库搭建过程中，给知识库里的知识点一个方便归纳的方法论。

知识库分类是按照知识点的特点和根据业务系统求解问题的需要将知识分为若干类，而每一类又分为若干子分类。一般子分类是母分类的基础，母分类是子分类的概括，子分类之间互不相容，知识库分类的划分遵循MECE的原则。  
MECE分析法，全称 Mutually Exclusive Collectively Exhaustive，中文意思是“相互独立，完全穷尽”。也就是对于一个重大的议题，能够做到不重叠、不遗漏的分类，而且能够借此有效把握问题的核心，并成为有效解决问题的方法。  
分类方法：  
1、分类纵向划分方法  
在知识库构建过程中主要按照最终用户参与时间顺序构建分类的方法叫知识库的纵向划分方法。适合用于单一产品线。  
2、分类横向划分方法  
知识库的横向划分结构主要用在产品业务线较多的情况下，并且往往是针对次一级分类进行划分，适合用于多条产品业务线的时候  
梳理方法：  
1、从大到小  
没有条件也要创造条件：业务框架  
没有历史的语料情况下，我们普遍要依赖业务框架，那在没有业务框架情况下，首先要做的事情就是梳理业务框架，梳理好业务框架，往业务框架中不断地填充知识点及其相似问，用结构化的思想不断地界定知识库的边界，故为从大（业务框架）到小（知识点、相似问）。  
![](/plugins/servlet/confluence/placeholder/error?i18nKey=editor.placeholder.broken.image&locale=zh_CN&version=2 "com.atlassian.confluence.content.render.xhtml.XhtmlException: Missing required attribute: {http://atlassian.com/resource/identifier}value")

![](/plugins/servlet/confluence/placeholder/error?i18nKey=editor.placeholder.broken.image&locale=zh_CN&version=2 "com.atlassian.confluence.content.render.xhtml.XhtmlException: Missing required attribute: {http://atlassian.com/resource/identifier}value")  
三、产品功能分析  
![](/plugins/servlet/confluence/placeholder/error?i18nKey=editor.placeholder.broken.image&locale=zh_CN&version=2 "com.atlassian.confluence.content.render.xhtml.XhtmlException: Missing required attribute: {http://atlassian.com/resource/identifier}value")  
当我们梳理好业务框架，有了这么一棵树，接着就是要不断地往里面扩充知识点及其对应相似问，纳入对应的业务场景下；好比在树干（业务框架）上长出树枝（知识点），树枝上再不断地长出叶子（相似问）。  
![](/plugins/servlet/confluence/placeholder/error?i18nKey=editor.placeholder.broken.image&locale=zh_CN&version=2 "com.atlassian.confluence.content.render.xhtml.XhtmlException: Missing required attribute: {http://atlassian.com/resource/identifier}value")  
比如运用到二分法，把人分为男人和女人。

**（二）、智能对话系统测试**

  
一、百度大脑的FAQ问答技能  
1、什么是FAQ问答技能  
FAQ问答技能是通过训练问答对数据来实现人机对话能力的技能。其中问答对是指问题与答案的组合。问答对中的问题与答案支持一对一、一对多、多对一和多对多四种形式。当用户的问题与问答对中配置的问题相似时，即会输出该问答对中的答案。  
![](/plugins/servlet/confluence/placeholder/error?i18nKey=editor.placeholder.broken.image&locale=zh_CN&version=2 "com.atlassian.confluence.content.render.xhtml.XhtmlException: Missing required attribute: {http://atlassian.com/resource/identifier}value")  
2、问答技能适用于哪些对话场景？  
  问答技能适用于一问一答（用户问，机器人回答），且每个问题的答案相对固定，不需要根据用户问题中的关键信息来作出复杂的回复。其应用于客服场景中的服务咨询，教育场景中的科普问答，政务场景中的政策咨询等等。  
[3、](https://ai.baidu.com/ai-doc/UNIT/6kipmwqna#%E9%9C%80%E8%A6%81%E5%87%86%E5%A4%87%E5%93%AA%E4%BA%9B%E6%95%B0%E6%8D%AE%EF%BC%9F)需要准备哪些数据？  
  问答对是问答技能的基础数据。在创建问答技能前，您需要基于自己的业务场景按照文档格式要求梳理问答对数据，具体问答对为问题与答案的组合，示例如下：  
    Q: 商品支持退货嘛？A：15天内支持退换货。  
    Q: 购物车可以添加多少件商品？A：购物车可以添加100件商品。  
4、流程  
创建FAQ问答——添加问答对数据——训练模型——对话测试并部署  
5、关键词解释  
问题模板：当大量相似问题句式相同，只是个别关键词不同时，可用问题模板来覆盖，提高效率。  
标准问：  
相似问：相似问题是标准问题的其他说法，用来提升问答对的召回能力。在实际应用场景中，同一个问题经常会有很多种不同的说法，为了能够更准确的回答用户的问题，我们还需要对配置的问答对进行泛化。在收集场景数据时，需要尽可能贴近真实场景下用户的表达方式，最好是从实际业务场景中沉淀下来的真实数据，全面覆盖用户在该场景下可能出现的表达方式。  
标准答：  
问答对：  
阈值：1\. 当用户语句中可识别部分内容字数除以模板内容总字数 > 阈值时，语句可匹配该模板。  
   2. 可识别部分包括：词槽，特征词，固定汉字，口语化词。计算字数时，汉字是1，数字、字母、标点符号是0.5。  
一对问答对有标准问和标准答还可以设置相似问和相似答，属于一个问题，多个问答对的管理使用标签进行管理。  
功能：  
1、支持的问答技能有FAQ问答、对话式文档问答、表格问答三种  
2、FAQ问答问题格式支持普通问题和问题模板，普通问题包含标准问、相似问；问题模板可以直接使用特征词相似问题句式相同，只是个别关键词不同时，可用问题模板来覆盖，提高效率  
3、支持一问一答、多问一答、一问多答、多问多答

  

二、科大讯飞问答  
1、什么是语言问答  
语音问答（Q&A）是语音技能的简单版。不同的是，语音问答中的每一个用户输入，系统回复是确定的（可能是一个或者多个），不存在过多的逻辑处理。  
举例  
用户 ：你多大了？  
讯飞 : 我还小 / 不告诉你 / 我已经两岁了  
用户 ：你是谁 ？  
讯飞 ：我叫叮咚 / 我是聪明的机器人  
2、功能详情：  
2.1在我的问答库——创建问答库  
问答类型分为语句问答和关键词问答  
语句问答是通过整句话模糊匹配来回复用户  
关键词问答是通过匹配命中的关键词回复用户  
2.2输入问答库名称后点击创建——点击新创建的问答库进入问答编辑界面  
2.3进入问答编辑界面后——创建主题  
创建主题包括了单条新增和批量导入的两种形式  
一个问答库可以包含很多主题，一个主题对应一对问答对，就是一个主题包含了标准问和标准答，还包含了相似问和相似答。  
多对问答对的管理使用主题管理，多个主题的管理使用问答库的管理。  
概念理解：  
主题：主题就是对一类问题就行聚合  
支持一问一答、多问一答、一问多答、多问多答

  
三、FTT系统FAQ库

支持一问一答、多问一答  
1、功能详情：  
[FTT问答库功能详细.xlsx](/download/attachments/97891667/FTT%E9%97%AE%E7%AD%94%E5%BA%93%E5%8A%9F%E8%83%BD%E8%AF%A6%E7%BB%86.xlsx?version=1&modificationDate=1678965713688&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)