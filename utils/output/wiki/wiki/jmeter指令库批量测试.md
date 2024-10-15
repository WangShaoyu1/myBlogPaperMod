---
author: "王宇"
title: "jmeter指令库批量测试"
date: 十一月02,2023
description: "jmeter结合业务应用脚本"
tags: ["jmeter结合业务应用脚本"]
ShowReadingTime: "12s"
weight: 157
---
*   1[1\. 需求](#jmeter指令库批量测试-需求)
*   2[2\. 可用环境](#jmeter指令库批量测试-可用环境)
*   3[3\. 脚本](#jmeter指令库批量测试-脚本)
*   4[4\. 设置参数](#jmeter指令库批量测试-设置参数)
    *   4.1[4.1. 身份校验](#jmeter指令库批量测试-身份校验)
    *   4.2[4.2. 线程组说明](#jmeter指令库批量测试-线程组说明)
    *   4.3[4.3. 请求nlp接口](#jmeter指令库批量测试-请求nlp接口)
    *   4.4[4.4. 添加断言](#jmeter指令库批量测试-添加断言)
    *   4.5[4.5. 请求清空会话记录接口](#jmeter指令库批量测试-请求清空会话记录接口)
    *   4.6[4.6. 引用csv测试集文件说明](#jmeter指令库批量测试-引用csv测试集文件说明)
    *   4.7[4.7. 生成会话id](#jmeter指令库批量测试-生成会话id)
    *   4.8[4.8. 获取相应的参数](#jmeter指令库批量测试-获取相应的参数)
    *   4.9[4.9. 写入的csv文件](#jmeter指令库批量测试-写入的csv文件)
    *   4.10[4.10. csv文件测试结果](#jmeter指令库批量测试-csv文件测试结果)

1\. 需求
======

指令组需要进行批量测试6000多条话术，验收话术测试结果，需要拿到结果数据进行分析，对系统话术进行优化处理。

测试话术用例： [指令294.csv](/download/attachments/105283252/%E6%8C%87%E4%BB%A4294.csv?version=1&modificationDate=1692781384424&api=v2)

![](/download/attachments/105283252/image2023-11-2_16-55-17.png?version=1&modificationDate=1698915318742&api=v2)

![](/download/attachments/105283252/image2023-11-2_16-56-25.png?version=1&modificationDate=1698915387794&api=v2)

2\. 可用环境
========

适用测试环境或者生产环境

3\. 脚本
======

jmeter脚本： [指令库批量话术测试.jmx](/download/attachments/105283252/%E6%8C%87%E4%BB%A4%E5%BA%93%E6%89%B9%E9%87%8F%E8%AF%9D%E6%9C%AF%E6%B5%8B%E8%AF%95.jmx?version=6&modificationDate=1692946672781&api=v2)

![](/download/attachments/105283252/image2023-8-23_17-5-4.png?version=1&modificationDate=1692781504540&api=v2)

4\. 设置参数
========

4.1. 身份校验
---------

当遇到脚本的身份鉴权失败，就通过登录ftt系统获取这两个参数放进来

![](/download/attachments/105283252/image2023-8-23_17-16-32.png?version=1&modificationDate=1692782192372&api=v2)

4.2. 线程组说明
----------

总线程数就是模拟用户数，批量测试6167条数据，因为不是整数，不然可以考虑用100个线程，设置循环xx次数，这里只能创建6167个线程在600s内跑完，勾选线程延迟直到需要，这里不会同时创建6167个线程对服务器造成那么大压力。

![](/download/attachments/105283252/image2023-8-24_9-59-17.png?version=1&modificationDate=1692842358114&api=v2)

4.3. 请求nlp接口
------------

明确需要测试的指令库，修改传参

![](/download/attachments/105283252/image2023-8-23_17-31-44.png?version=1&modificationDate=1692783104303&api=v2)

4.4. 添加断言
---------

判断请求是否成功，当请求成功返回200则通过，不然在察看结果树那看到请求的接口会变成红色，而不是绿色。

![](/download/attachments/105283252/image2023-8-24_10-12-24.png?version=1&modificationDate=1692843144221&api=v2)

4.5. 请求清空会话记录接口
---------------

![](/download/attachments/105283252/image2023-8-23_17-36-46.png?version=1&modificationDate=1692783406011&api=v2)

4.6. 引用csv测试集文件说明
-----------------

![](/download/attachments/105283252/image2023-8-23_17-19-14.png?version=1&modificationDate=1692782354458&api=v2)

![](/download/attachments/105283252/image2023-8-23_17-50-35.png?version=1&modificationDate=1692784235156&api=v2)

4.7. 生成会话id
-----------

![](/download/attachments/105283252/image2023-8-23_17-20-34.png?version=1&modificationDate=1692782434226&api=v2)

4.8. 获取相应的参数
------------

![](/download/attachments/105283252/image2023-8-23_17-27-15.png?version=1&modificationDate=1692782835989&api=v2)

4.9. 写入的csv文件
-------------

![](/download/attachments/105283252/image2023-8-23_17-29-46.png?version=1&modificationDate=1692782986258&api=v2)

4.10. csv文件测试结果
---------------

测试结果文件：[nluProcess271.csv](/download/attachments/105283252/nluProcess271.csv?version=1&modificationDate=1692783880537&api=v2)

兼容匹配双词槽similar\_value值，兼容匹配无法范化的双词槽text

![](/download/attachments/105283252/image2023-8-23_17-43-4.png?version=1&modificationDate=1692783784583&api=v2)

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)