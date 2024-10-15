---
author: "王宇"
title: "jmeter模拟批量创建FAQ问题库"
date: 八月22,2023
description: "jmeter结合业务应用脚本"
tags: ["jmeter结合业务应用脚本"]
ShowReadingTime: "12s"
weight: 158
---
*   1[1\. 需求](#jmeter模拟批量创建FAQ问题库-需求)
*   2[2\. 操作](#jmeter模拟批量创建FAQ问题库-操作)
    *   2.1[2.1. 整理FAQ文档为导入所需格式的csv文件](#jmeter模拟批量创建FAQ问题库-整理FAQ文档为导入所需格式的csv文件)
    *   2.2[2.2. 配置脚本参数](#jmeter模拟批量创建FAQ问题库-配置脚本参数)
    *   2.3[2.3. 检查webFAQ数据创建情况](#jmeter模拟批量创建FAQ问题库-检查webFAQ数据创建情况)
*   3[3\. 脚本](#jmeter模拟批量创建FAQ问题库-脚本)

1\. 需求
======

指令组同事存在需要新增FAQ话术问题，并提供了一些话术（分类、标准问、回复话术、相似问），需求文件：[FAQ.csv](/download/attachments/105279858/FAQ.csv?version=1&modificationDate=1692069936803&api=v2)

2\. 操作
======

2.1. 整理FAQ文档为导入所需格式的csv文件
-------------------------

![](/download/attachments/105279858/image2023-8-15_11-27-15.png?version=1&modificationDate=1692070035879&api=v2)

2.2. 配置脚本参数
-----------

![](/download/attachments/105279858/image2023-8-15_11-31-14.png?version=1&modificationDate=1692070275379&api=v2)

![](/download/attachments/105279858/image2023-8-15_11-34-41.png?version=1&modificationDate=1692070482706&api=v2)

2.3. 检查webFAQ数据创建情况
-------------------

![](/download/attachments/105279858/image2023-8-15_11-33-29.png?version=1&modificationDate=1692070409894&api=v2)

3\. 脚本
======

[my\_FAQ\_file.jmx](/download/attachments/105279858/my_FAQ_file.jmx?version=1&modificationDate=1692070136038&api=v2)

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)