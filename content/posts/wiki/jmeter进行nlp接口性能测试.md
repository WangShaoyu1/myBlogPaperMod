---
author: "王宇"
title: "jmeter进行nlp接口性能测试"
date: 八月22,2023
description: "jmeter结合业务应用脚本"
tags: ["jmeter结合业务应用脚本"]
ShowReadingTime: "12s"
weight: 159
---
*   1[1\. 业务需求](#jmeter进行nlp接口性能测试-业务需求)
*   2[2\.  背景](#jmeter进行nlp接口性能测试-背景)
*   3[3\. 工具和环境](#jmeter进行nlp接口性能测试-工具和环境)
*   4[4\. 测试方案](#jmeter进行nlp接口性能测试-测试方案)
*   5[5\. 测试话术与脚本](#jmeter进行nlp接口性能测试-测试话术与脚本)
*   6[6\. 操作步骤](#jmeter进行nlp接口性能测试-操作步骤)
*   7[7\. 测试数据](#jmeter进行nlp接口性能测试-测试数据)
*   8[8\. 全部测试数据](#jmeter进行nlp接口性能测试-全部测试数据)
*   9[9\. 测试结论](#jmeter进行nlp接口性能测试-测试结论)

1\. 业务需求
========

要求虚拟人提供的服务一定程度上满足我们业务方的需求，现在能做到250tps，响应时间在2s之内就可以。后面照个大的量例如500、1000做水平扩展演练![](/download/attachments/105280733/image2023-8-22_11-37-11.png?version=1&modificationDate=1692675432002&api=v2)

2\.  背景
=======

基于我们自己业务的需求，针对性对第三方公司提供的能力进行性能的评估，验证业务方在并发500请求的时候系统处理能力。

3\. 工具和环境
=========

jmeter，测试环境

4\. 测试方案
========

从系统设计出发，结合业务需求，主要关注两个指标一个90%line（平均百分之90的用户响应时间），另一个是Throughput（吞吐量，可以帮助评估系统的性能，并确定系统在不同负载条件下的处理能力），先从压测并发500开始入手，50s内启动完所有线程，没秒启动10个线程，压测10分钟，通过分析聚合报告数据指标，进行下一步操作，假设并发500的情况下，90%line指标是2687ms，Throughput指标是358，明显可以看出与业务要求的平均响应时间在2s内差异很大，知道并发500系统当前的处理能力是不足的，反之，基于以上情况我们应当适当减少并发量进行测试，直到找到一个最优值。此时尝试并发量450，每秒启动10个线程，45s内启动完，压测10，观察测试后聚合报告的数据分析进行下一步操作。

5\. 测试话术与脚本
===========

[test\_nlp.csv](/download/attachments/105280733/test_nlp.csv?version=1&modificationDate=1692675353231&api=v2)

[nlp性能压测.jmx](/download/attachments/105280733/nlp%E6%80%A7%E8%83%BD%E5%8E%8B%E6%B5%8B.jmx?version=1&modificationDate=1692672995633&api=v2)

6\. 操作步骤
========

根据设计方案设置对应的参数，这里需要注意执行性能测试的时候最好禁用“查看结果数”，处理数据会占用系统资源，减少误差。只添加聚合报告即可，然后执行脚本。

![](/download/attachments/105280733/image2023-8-22_10-55-50.png?version=1&modificationDate=1692672950581&api=v2)

7\. 测试数据
========

综合分析结果数据，90%的用户没有达到响应时间在2秒之内，所以需要减少并发量进行下一组测试。

![](/download/attachments/105280733/image2023-8-22_11-9-10.png?version=1&modificationDate=1692673750187&api=v2)

8\. 全部测试数据
==========

根据以上测试步骤共进行5组数据测试，等到以下表格

![](/download/attachments/105280733/image2023-8-22_11-30-46.png?version=1&modificationDate=1692675046351&api=v2)

9\. 测试结论
========

测试环境，131条话术，循环调用FTT系统测试文本接口，进行nlp系统处理能力进行评估，综合本次测试结果数据分析，并发在430时，系统处理能力达到最优，此时90%的用户平均响应时间在约2.1s。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)