---
author: "王宇"
title: "jmeter批量调nlp话术验证接口"
date: 九月12,2023
description: "jmeter结合业务应用脚本"
tags: ["jmeter结合业务应用脚本"]
ShowReadingTime: "12s"
weight: 156
---
*   1[1\. 需求](#jmeter批量调nlp话术验证接口-需求)
*   2[2\. 工具](#jmeter批量调nlp话术验证接口-工具)
*   3[3\. 脚本](#jmeter批量调nlp话术验证接口-脚本)
*   4[4\. 操作步骤](#jmeter批量调nlp话术验证接口-操作步骤)
    *   4.1[4.1. 首先明确要测试的接口，在FTT系统通过F12查看测试请求的接口，分析传参情况，编写jmeter脚本。](#jmeter批量调nlp话术验证接口-首先明确要测试的接口，在FTT系统通过F12查看测试请求的接口，分析传参情况，编写jmeter脚本。)
    *   4.2[4.2. 调试验证脚本可行性](#jmeter批量调nlp话术验证接口-调试验证脚本可行性)
        *   4.2.1[4.2.1. 传参来自本地csv文件](#jmeter批量调nlp话术验证接口-传参来自本地csv文件)
        *   4.2.2[4.2.2. 切换环境](#jmeter批量调nlp话术验证接口-切换环境)
        *   4.2.3[4.2.3. 接口返回数据](#jmeter批量调nlp话术验证接口-接口返回数据)
        *   4.2.4[4.2.4. 导出csv文件获取的字段](#jmeter批量调nlp话术验证接口-导出csv文件获取的字段)
        *   4.2.5[4.2.5. 用户授权](#jmeter批量调nlp话术验证接口-用户授权)
    *   4.3[4.3. 根据需求进行测试验证，得出测试数据](#jmeter批量调nlp话术验证接口-根据需求进行测试验证，得出测试数据)
*   5[5\. 扩展](#jmeter批量调nlp话术验证接口-扩展)

1\. 需求
======

在FTT系统测试环境进行话术的验证，验证话术命中的情况，当数据量比较大的时候如果靠人工一个一个复制粘贴来验证的话效率会非常低，以此了解该需求后，利用jmeter工具执行对应的脚本来获取自己想要的数据可大大提升工作效率。需求文件：[test\_nlp.csv](/download/attachments/105277389/test_nlp.csv?version=1&modificationDate=1692069188267&api=v2)

![](/download/attachments/105277389/image2023-8-10_17-6-28.png?version=1&modificationDate=1691658388582&api=v2)  
![](/download/attachments/105277389/image2023-8-10_17-20-31.png?version=1&modificationDate=1691659231724&api=v2)

2\. 工具
======

  
安装jmeter工具，脚本已经维护好，直接替换excel表格测试文本数据即可  
安装教程： [https://blog.csdn.net/Deng872347348/article/details/126953048](https://blog.csdn.net/Deng872347348/article/details/126953048)

3\. 脚本
======

[chatSerial.jmx](/download/attachments/105277389/chatSerial.jmx?version=1&modificationDate=1694486569505&api=v2)

4\. 操作步骤
========

4.1. 首先明确要测试的接口，在FTT系统通过F12查看测试请求的接口，分析传参情况，编写jmeter脚本。
-------------------------------------------------------

  
![](/download/attachments/105277389/image2023-8-10_17-26-22.png?version=1&modificationDate=1691659582422&api=v2)  
  

4.2. 调试验证脚本可行性
--------------

### 4.2.1. 传参来自本地csv文件

![](/download/attachments/105277389/image2023-8-11_15-51-47.png?version=1&modificationDate=1691740307736&api=v2)

### 4.2.2. 切换环境

![](/download/attachments/105277389/image2023-8-11_15-54-17.png?version=1&modificationDate=1691740457706&api=v2)

### 4.2.3. 接口返回数据  
![](/download/attachments/105277389/image2023-8-10_17-28-5.png?version=1&modificationDate=1691659685964&api=v2)

### 4.2.4. 导出csv文件获取的字段

![](/download/attachments/105277389/image2023-8-10_17-33-31.png?version=1&modificationDate=1691660011420&api=v2)

### 4.2.5. 用户授权

![](/download/attachments/105277389/image2023-8-11_15-55-36.png?version=1&modificationDate=1691740536361&api=v2)

4.3. 根据需求进行测试验证，得出测试数据
----------------------

  
![](/download/attachments/105277389/image2023-8-10_17-43-35.png?version=1&modificationDate=1691660615891&api=v2)

5\. 扩展
======

该工具还可以进行数据的创建，例如批量创建FAQ问答库等。  
验证杭州公司返回的置信度，例如验证请求1000次“酸辣土豆丝怎么做”，分析命中情况是否都一样，还是存在命中指令或者FAQ。  
工具强大，技术无边，值得探索

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)