---
author: "政采云技术"
title: "基于Spline的数据血缘解析"
date: 2023-06-15
description: "数据血缘是数据产生、加工、转化，数据之间产生的关系。随着公司业务发展，通过数据血缘，能知道数据的流向，以便我们更好地进行数据治理。"
tags: ["Spark","大数据中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:3,views:2574,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![元宿.png](/images/jueJin/36fc1c2f749a45d.png)

一、前言
====

什么是数据血缘？数据血缘是数据产生、加工、转化，数据之间产生的关系。随着公司业务发展，通过数据血缘，能知道数据的流向，以便我们更好地进行数据治理。

二、为什么选择 Spline？
===============

政采云大数据平台的作业目前主要有 Spark SQL、PySpark、Spark JAR、数据交换、脚本类型等，最初由于实现难度的问题，考虑解析 SparkPlan（ Spark 物理计划）以获取表、字段血缘，但此方案针对 PySpark、Spark JAR 之类的作业自行解析较为复杂，而 Spline 则支持以上类型作业的解析。

### 附：SparkPlan

下图为 SparkPlan（ Spark 物理计划）中的详情。

![image.png](/images/jueJin/5f474a8ee9414b0.png) 从 Reference 中可以获取到解析完后依赖的字段信息 ![image (1).png](/images/jueJin/0aa2fee5b9e84df.png)

三、解析
====

通过 Spline REST 文档可见，REST 接口分 Producer 和 Consumer 两部分，Spline Producer 支持把解析完的数据发送到 Kafka，应用可消费 Kafka 数据获取字段血缘数据进行解析，但政采云大数据平台，基于业务需要，字段血缘需要跟作业绑定，若通过消费 Kafka 的方式，无法在获取字段血缘数据的同时跟作业绑定。故，目前使用了调用 Consumer 端接口的方式获取字段血缘。 附，Spline REST 文档 ![image (2).png](/images/jueJin/ef732d8180be41c.png)

1、血缘解析流程
--------

Htools：政采云大数据平台的一个调度工具 IData：政采云大数据平台应用层

![7A27C1D9-D9DB-4786-A1F4-AA4F96C641F6.png](/images/jueJin/dbc9dabe057b49a.png)

2、基于接口解析血缘
----------

解析字段血缘，主要涉及到 Consumer 端的接口，在 Api 接口文档中，我们可以看到各个接口详细的介绍。 ![image (4).png](/images/jueJin/270d01230bc047d.png) ![image (5).png](/images/jueJin/c5a29c83474044b.png)

3、示例
----

以下案例基于 insert into …… select …… 语句的解析

### （1）执行计划

从下图，可以看到一个 insert into …… select …… 语句，被解析成几个步骤，下列截图所对应的步骤，和 Spark 物理计划一致。 ![image (6).png](/images/jueJin/d2cc22b8e241417.png)

### （2）根据 applicationId 获取 planId

![image (7).png](/images/jueJin/c33a042c31494db.png) ![image (8).png](/images/jueJin/02a13b8b51cf464.png)

### （3）根据 planId 获取执行节点信息

![image (9).png](/images/jueJin/2966566ecf0148e.png) ![image (10).png](/images/jueJin/ccabefd9e3d1462.png)

### （4）根据节点 id 获取对应的信息

![image (11).png](/images/jueJin/353c171f728a4c6.png)

#### a、根据 Project 节点，获取输入表和输出表之间的字段血缘关系

![image (12).png](/images/jueJin/4492c9c67bb34f8.png)

#### b、根据 Relation 获取字段对应的表。

![image (13).png](/images/jueJin/8561a22da6e2445.png)

> Hive 表的 Relation 分 HiveTableRelation 和 LogicalRelation 两种，有 Catalog 的 Hive 表是 LogicalRelation，无 Catalog 的 Hive 表是 HiveTableRelation。 为什么要多此一举再调用接口获取表跟字段的对应信息？ 在 Project 中获取输入表和输出表之间的对应的字段，无法知道输入表涉及到的字段对应具体的表，所以需要根据 Relation 获取所有字段和表之间的关系，从而根据字段 Id 获取表。

### （5）根据字段获取依赖的字段

![image (14).png](/images/jueJin/aec95fa46350431.png) 从 Project 中获得的字段血缘，一些复杂场景是无法直接获取到的。如在实际中，大量涉及到诸如 with input\_tab as( …… ) insert into output\_tab as select \* from input\_tab 的语句，这种语句，根据 REST 接口获取到的字段信息，只能获取到最外层的字段信息，跟内层 sql 依赖的字段信息是脱节的，故，需要当前接口辅助获取内层依赖字段。

4、调优
----

表、字段血缘跟作业绑定，故，若作业无变化的情况，表、字段的血缘是不会变化的，在作业调度完后，调用解析血缘的接口时，我们结合当前作业版本和前一次血缘记录中的作业版本进行比对，若作业版本不一致的情况才更新血缘，否则则不操作。

5、成果展示
------

如下图所示，可以看到字段 settle\_record\_id 上下游字段血缘关系。 ![image (15).png](/images/jueJin/5382be21dd5840d.png)

四、总结
====

基于 Spline REST 接口获取表、字段血缘等相关信息，在实际实现过程中，每个作业调用的总接口次数是比较多的，但即便调用次数较多，也在服务器可承受范围内，上线后第一次解析血缘接口调用比较密集，后续只有在作业版本有变化的时候才会重新解析血缘。

推荐阅读
----

[由浅入深了解MySQL底层查询逻辑](https://juejin.cn/post/7243819890497945659 "https://juejin.cn/post/7243819890497945659")

[浅谈幂等](https://juejin.cn/post/7241941309174300732 "https://juejin.cn/post/7241941309174300732")

[政采云 Flutter 单元测试实践](https://juejin.cn/post/7241184271318351933 "https://juejin.cn/post/7241184271318351933")

[音视频技术助力政府采购之音视频编码采集（一）](https://juejin.cn/post/7239356303850684476 "https://juejin.cn/post/7239356303850684476")

[以dubbo源码为例-使用lambda重构面向对象模块](https://juejin.cn/post/7238604003599892536 "https://juejin.cn/post/7238604003599892536")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)