---
author: "王宇"
title: "问答库测试报告LMX"
date: 三月31,2023
description: "李明仙"
tags: ["李明仙"]
ShowReadingTime: "12s"
weight: 500
---
**FTT系统问答库**

功能描述见[2、 系统学习小结](/pages/viewpage.action?pageId=97890530)

  

  

**1、科大讯飞问答库**

自定义问答：语音问答（Q&A）是语音技能的简单版。不同的是，语音问答中的每一个用户输入，系统回复是确定的（可能是一个或者多个），不存在过多的逻辑处理。

1.1语句问答（添加问题：相似问题列表，添加答案：相似答案列表)

**默认阈值为0.82**，对句式颠倒、相似句式、语气词、程度副词能够做到很好的识别。

语句问答导入模板

![](/download/attachments/97900585/image2023-3-31_15-19-5.png?version=1&modificationDate=1680247145222&api=v2)![](/download/attachments/97900585/image2023-3-31_15-20-7.png?version=1&modificationDate=1680247207534&api=v2)

1.2 关键词问答

关键词导入样板

![](/download/attachments/97900585/image2023-3-31_15-13-21.png?version=1&modificationDate=1680246801836&api=v2)![](/download/attachments/97900585/image2023-3-31_15-14-54.png?version=1&modificationDate=1680246894588&api=v2)

  

1.3 语句问答和关键词问答的差异

相同点：1、表头包含主题、问题、答案。2、支持一对多问答，多对一问答，多个相似问题和多个相似回答。3、对话触发都有一定的阈值，字段为问题模板主要内容片段，缺少结尾辅助词也可识别成功。4、每个主题之间需要用空白行作隔断。

不同点：1、语句问答的模板需标注文本情绪内容。2、关键词模板支持语句中的关键词多义穷举，多个关键词意义连接。3、关键词导入格式都是英文符号

1.4 语句问答测试

能根据词性识别问题的名词、副词、动词，对副词动词能做到单字分词，对名词能做到2-3字分词，重合的名词越多，顺序和语义近似能够识别成功。

![](/download/attachments/97900585/image2023-3-31_15-36-26.png?version=1&modificationDate=1680248186257&api=v2)

**百度智能对话平台-问答技能**

创建路径-我的技能-新建技能-问答技能（FAQ问答、对话式问答、表格问答）

FAQ问答：问答管理-新建问答对-标签、问题（普通问题、问题模板）、答案；标签可管理问答对，提升阅读理解能力

文档问答：

![](/download/attachments/97900585/image2023-3-31_15-2-54.png?version=1&modificationDate=1680246174959&api=v2)![](/download/attachments/97900585/image2023-3-31_15-6-28.png?version=1&modificationDate=1680246389163&api=v2)

表格问答：

![](/download/attachments/97900585/image2023-3-31_15-0-57.png?version=1&modificationDate=1680246057552&api=v2)![](/download/attachments/97900585/image2023-3-31_15-1-41.png?version=1&modificationDate=1680246101701&api=v2)

  

  

[Filter table data]()[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)