---
author: "捡田螺的小男孩"
title: "oppo后端16连问"
date: 2022-04-18
description: "大家好，我是程序员田螺。最近有为读者去面试了oppo，给大家整理了面试真题的答案。希望对大家有帮助哈，一起学习，一起进步。 聊聊你印象最深刻的项目，或者做了什么优化。"
tags: ["后端","Java","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:130,comments:6,collects:385,views:14238,"
---
前言
--

大家好，我是**程序员田螺**。最近有为读者去面试了oppo，给大家整理了面试真题的答案。希望对大家有帮助哈，一起学习，一起进步。

1.  聊聊你印象最深刻的项目，或者做了什么优化。
2.  你项目提到分布式锁，你们是怎么使用分布式锁的?
3.  常见分布式事务解决方案
4.  你们的接口幂等是如何保证的？
5.  你们的MySQL架构是怎样的？
6.  常见的索引结构有？哈希表结构属于哪种场景？
7.  给你ab,ac,abc字段，你是如何加索引的？
8.  数据库隔离级别是否了解？你们的数据库默认隔离级别是？为什么选它？
9.  RR隔离级别实现原理，它是如何解决不可重复读的？
10.  你们项目使用了RocketMQ对吧？那你知道如何保证消息不丢失吗？
11.  事务消息是否了解？场景题：比如下单清空购物车，你是如何设计的？
12.  如何快速判断一个数是奇数还是偶数，除开对2取余呢。
13.  Spring声明式事务原理？哪些场景事务会失效？
14.  你们是微服务架构嘛？如果你来设计一个类似淘宝的系统，你怎么划分微服务？
15.  你们是怎么分库分表的？分布式ID如何生成？
16.  所有异常的共同祖先是？运行时异常有哪几个？

*   公众号：**捡田螺的小男孩**
*   [我的github地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")，感谢给个star

1\. 聊聊你印象最深刻的项目，或者做了什么优化。
-------------------------

大家平时做的项目，如果很多知识点跟面试八股文相关的话，就可以相对条理清晰地写到简历去。

比如缓存数据库相关的，查询为空，你设置了一个`-1`到缓存，代表数据库没记录。下次判断`-1`，就不查库了，以解决缓存穿透问题。又比如你设置缓存过期时间比较分散，解决缓存击穿问题，都可以条理清晰写到简历去，这样面试官很可能会问你相关的问题，这时候就对答如流啦。

还有平时你做的项目，有一些比较好的设计，都可以说一下哈，比如你是如何保证数据一致性的，怎么优化接口性能的。 如果是讲**优化接口**这一块的话，你可以看下我这篇文章哈，结合来一起讲。其实就是**缓存、分批、并发调用、异步**等那几个关键知识点。

[记一次接口性能优化实践总结：优化接口性能的八个建议](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247488004%26idx%3D1%26sn%3D00840efd9c0bd0a7f172b59eb2ca130f%26chksm%3Dcf21cd2df856443bf21d8e09cfe5c8452ecaf82e3c2210fca3b28829ded04defddcf63c0a59b%26token%3D162724582%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247488004&idx=1&sn=00840efd9c0bd0a7f172b59eb2ca130f&chksm=cf21cd2df856443bf21d8e09cfe5c8452ecaf82e3c2210fca3b28829ded04defddcf63c0a59b&token=162724582&lang=zh_CN&scene=21#wechat_redirect")

如果是代码优化细节，可以结合我这篇:[工作四年，分享50个让你代码更好的小建议](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247488708%26idx%3D1%26sn%3D6e2e0a740f5d42a59641487a0bf1e3bf%26chksm%3Dcf21cbedf85642fbb485fa1c7bf9af21923d8503f2542b6f8283ce79ddc683f7d9e45da83100%26token%3D162724582%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247488708&idx=1&sn=6e2e0a740f5d42a59641487a0bf1e3bf&chksm=cf21cbedf85642fbb485fa1c7bf9af21923d8503f2542b6f8283ce79ddc683f7d9e45da83100&token=162724582&lang=zh_CN&scene=21#wechat_redirect") 。你可以挑个简单的来讲，比如**复杂的if逻辑条件，可以调整顺序，让程序更高效**，这样会让面试官眼前一亮哦。

如果是慢SQL优化这一块，可以看下我之前MySQL专栏系列文章，理解透之后，还是挺稳的：

*   [看一遍就理解：order by详解](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247490571%26idx%3D1%26sn%3De8638573ec8d720fd25da5b2b0d90ed2%26chksm%3Dcf21c322f8564a34461acd9811730d14d12075cf5c7438a3a11433725b9ce463fcb78e7916a1%26token%3D500637053%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247490571&idx=1&sn=e8638573ec8d720fd25da5b2b0d90ed2&chksm=cf21c322f8564a34461acd9811730d14d12075cf5c7438a3a11433725b9ce463fcb78e7916a1&token=500637053&lang=zh_CN&scene=21#wechat_redirect")
*   [看一遍就理解：group by详解](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247497527%26idx%3D1%26sn%3D1f30251d88b0e935bfffc3e8eaf53f28%26chksm%3Dcf22281ef855a1084fe84a7b257db5734c7b982c6ddaf9ef497d4e31e60faebd5f329e3c55a6%26token%3D2101142450%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247497527&idx=1&sn=1f30251d88b0e935bfffc3e8eaf53f28&chksm=cf22281ef855a1084fe84a7b257db5734c7b982c6ddaf9ef497d4e31e60faebd5f329e3c55a6&token=2101142450&lang=zh_CN#rd")
*   [实战！聊聊如何解决MySQL深分页问题](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247495139%26idx%3D1%26sn%3D9dd98a8e09af48440cc5f01d3aafd87e%26chksm%3Dcf2232caf855bbdc4ea538550ecde6c575c91a1d1b1c42f3bc6091c715dde1a4a5e90d3f7ce2%26token%3D1913427154%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247495139&idx=1&sn=9dd98a8e09af48440cc5f01d3aafd87e&chksm=cf2232caf855bbdc4ea538550ecde6c575c91a1d1b1c42f3bc6091c715dde1a4a5e90d3f7ce2&token=1913427154&lang=zh_CN#rd")
*   [后端程序员必备：书写高质量SQL的30条建议](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247487972%26idx%3D1%26sn%3Dcd035a7fcd7496658846ab9f914be2db%26chksm%3Dcf21cecdf85647dbc53e212bf1a2b95d0eb2bffe08dc0141e01f8a9b2088abffc385a2ef584e%26token%3D1495321435%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247487972&idx=1&sn=cd035a7fcd7496658846ab9f914be2db&chksm=cf21cecdf85647dbc53e212bf1a2b95d0eb2bffe08dc0141e01f8a9b2088abffc385a2ef584e&token=1495321435&lang=zh_CN&scene=21#wechat_redirect")
*   [阿里一面，给了几条SQL，问需要执行几次树搜索操作？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247488130%26idx%3D1%26sn%3D2f225ba5100c882089eec8a2666fee54%26chksm%3Dcf21cdabf85644bd91c8f0bc223d883a53896f3bd71e06a4167e050155fe64f55872c7ad97d8%26token%3D1495321435%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247488130&idx=1&sn=2f225ba5100c882089eec8a2666fee54&chksm=cf21cdabf85644bd91c8f0bc223d883a53896f3bd71e06a4167e050155fe64f55872c7ad97d8&token=1495321435&lang=zh_CN&scene=21#wechat_redirect")
*   [生产问题分析！delete in子查询不走索引？！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247495170%26idx%3D1%26sn%3Dce914de3abdb0d887e286b680b25111f%26chksm%3Dcf22312bf855b83d31a00da110626747df8e69fca1bc310642c56e39d663b006a8105f9fb1e1%26token%3D1495321435%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247495170&idx=1&sn=ce914de3abdb0d887e286b680b25111f&chksm=cf22312bf855b83d31a00da110626747df8e69fca1bc310642c56e39d663b006a8105f9fb1e1&token=1495321435&lang=zh_CN&scene=21#wechat_redirect")
*   [面试官问如何优化慢SQL？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247498342%26idx%3D1%26sn%3D1171168d3475dd5c46da40341731960f%26chksm%3Dcf22254ff855ac595c7b35264704be19262d1f31223fdbc25eafb398f32c92d3cc031a5422a5%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247498342&idx=1&sn=1171168d3475dd5c46da40341731960f&chksm=cf22254ff855ac595c7b35264704be19262d1f31223fdbc25eafb398f32c92d3cc031a5422a5&token=2044040586&lang=zh_CN#rd")

2\. 你项目提到分布式锁，你们是怎么使用分布式锁的?
---------------------------

一般你讲述你做的项目时，面试官会根据你项目涉及的一些面试点，然后抽他感兴趣的一两个来问。所以大家对哪些知识点熟悉，讲述项目时，就说你用该知识点，解决了什么问题。

*   比如，你看了田螺哥的 [《七种方案！探讨Redis分布式锁的正确使用姿势》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247488142%26idx%3D1%26sn%3D79a304efae7a814b6f71bbbc53810c0c%26chksm%3Dcf21cda7f85644b11ff80323defb90193bc1780b45c1c6081f00da85d665fd9eb32cc934b5cf%26token%3D162724582%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247488142&idx=1&sn=79a304efae7a814b6f71bbbc53810c0c&chksm=cf21cda7f85644b11ff80323defb90193bc1780b45c1c6081f00da85d665fd9eb32cc934b5cf&token=162724582&lang=zh_CN&scene=21#wechat_redirect")，很熟悉，就可以说用分布式锁解决了超卖问题什么的。
*   如果你看了田螺哥的[《美团二面：Redis与MySQL双写一致性如何保证？》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247490243%26idx%3D1%26sn%3Dff11c3aab9ada3b16d7f2b57c846d567%26chksm%3Dcf21c5eaf8564cfc59e3d0d56fd02b0f5513015005f498381be4d12db462442a49aabe4159ef%26token%3D1495321435%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247490243&idx=1&sn=ff11c3aab9ada3b16d7f2b57c846d567&chksm=cf21c5eaf8564cfc59e3d0d56fd02b0f5513015005f498381be4d12db462442a49aabe4159ef&token=1495321435&lang=zh_CN&scene=21#wechat_redirect")，你就可以说你是用什么方案保证缓存好数据库一致性的。

3\. 常见分布式事务解决方案
---------------

> **分布式事务**：就是指事务的参与者、支持事务的服务器、资源服务器以及事务管理器分别位于不同的分布式系统的不同节点之上。简单来说，分布式事务指的就是分布式系统中的事务，它的存在就是为了保证不同数据库节点的数据一致性。

聊到分布式事务，大家记得这两个理论哈：**CAP理论 和 BASE 理论**

分布式事务的几种解决方案：

*   2PC(二阶段提交)方案、3PC
*   TCC（Try、Confirm、Cancel）
*   本地消息表
*   最大努力通知
*   seata

**2PC(二阶段提交)方案**

2PC，即两阶段提交，它将分布式事务的提交拆分为2个阶段：`prepare和commit/rollback`，即准备阶段和提交执行阶段。在prepare准备阶段需要等待所有参与子事务的反馈，因此可能造成数据库资源锁定时间过长，不适合并发高以及子事务生命周长较长的业务场景。并且协调者宕机，所有的参与者都收不到提交或回滚指令。

**3PC**

两阶段提交分别是：`CanCommit，PreCommit 和 doCommit`，这里不再详述。3PC 利用超时机制解决了 2PC 的同步阻塞问题，避免资源被永久锁定，进一步加强了整个事务过程的可靠性。但是 3PC 同样无法应对类似的宕机问题，只不过出现多数据源中数据不一致问题的概率更小。

**TCC**

TCC 采用了补偿机制，其核心思想是：针对每个操作，都要注册一个与其对应的确认和补偿（撤销）操作。它分为三个阶段：`Try-Confirm-Cancel`

*   try阶段：尝试去执行，完成所有业务的一致性检查，预留必须的业务资源。
*   Confirm阶段：该阶段对业务进行确认提交，不做任何检查，因为try阶段已经检查过了，默认Confirm阶段是不会出错的。
*   Cancel 阶段：若业务执行失败，则进入该阶段，它会释放try阶段占用的所有业务资源，并回滚Confirm阶段执行的所有操作。

TCC方案让应用可以自定义数据库操作的粒度，降低了锁冲突，可以提升性能。但是应用侵入性强，try、confirm、cancel三个阶段都需要业务逻辑实现。

**本地消息表**

ebay最初提出本地消息表这个方案，来解决分布式事务问题。业界目前使用这种方案是比较多的，它的核心思想就是将分布式事务拆分成本地事务进行处理。可以看一下基本的实现流程图：

![](/images/jueJin/0a5db8069e504dd.png)

**最大努力通知**

最大努力通知方案的目标，就是发起通知方通过一定的机制，最大努力将业务处理结果通知到接收方。

![](/images/jueJin/01d05c537384478.png)

**seata**

Saga 模式是 Seata 提供的长事务解决方案。核心思想是将长事务拆分为多个本地短事务，由Saga事务协调器协调，如果正常结束那就正常完成，如果某个步骤失败，则根据相反顺序一次调用补偿操作。

Saga的并发度高，但是一致性弱，对于转账，可能发生用户已扣款，最后转账又失败的情况。

整理了这几篇分布式事务文章，大家可以看看哈：

*   [看一遍就理解：分布式事务详解](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247498358%26idx%3D1%26sn%3Daa6c7ceb61b73267d68d1b4fb7ccc2ed%26chksm%3Dcf22255ff855ac495861d57df276517e89779006267fa8413fe925cc15b0c3e0b0f1b1a5675e%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247498358&idx=1&sn=aa6c7ceb61b73267d68d1b4fb7ccc2ed&chksm=cf22255ff855ac495861d57df276517e89779006267fa8413fe925cc15b0c3e0b0f1b1a5675e&token=2044040586&lang=zh_CN#rd")
*   [1.4 w字，25 张图让你彻底掌握分布式事务原理](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247488144%26idx%3D1%26sn%3D3493379523f678fc46a558f814551468%26chksm%3Dcf21cdb9f85644af4b09ac499ab16a5ae2b9d313d853b60fadcb9c888ac710b3df4e93b55d52%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247488144&idx=1&sn=3493379523f678fc46a558f814551468&chksm=cf21cdb9f85644af4b09ac499ab16a5ae2b9d313d853b60fadcb9c888ac710b3df4e93b55d52&token=2044040586&lang=zh_CN#rd")
*   [后端程序员必备：分布式事务基础篇](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247487969%26idx%3D1%26sn%3D1a7c255439810aa12d0417a69c709bce%26chksm%3Dcf21cec8f85647dee38af93bb6747fc4e597c9918ad83f5ad30fe726f2918e017e390b2b7413%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247487969&idx=1&sn=1a7c255439810aa12d0417a69c709bce&chksm=cf21cec8f85647dee38af93bb6747fc4e597c9918ad83f5ad30fe726f2918e017e390b2b7413&token=2044040586&lang=zh_CN#rd")

4\. 你们的接口幂等是如何保证的？
------------------

如果你调用下游接口超时了，是不是考虑重试？如果重试，下游接口就需要支持幂等啦。

实现幂等一般有这8种方案：

*   select+insert+主键/唯一索引冲突
*   直接insert + 主键/唯一索引冲突
*   状态机幂等
*   抽取防重表
*   token令牌
*   悲观锁(如select for update，很少用)
*   乐观锁
*   分布式锁

大家平时是用哪个方案解决幂等的，最后结合工作实际讲讲哈。可以看下我之前这篇文章: [聊聊幂等设计](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247497427%26idx%3D1%26sn%3D2ed160c9917ad989eee1ac60d6122855%26chksm%3Dcf2229faf855a0ecf5eb34c7335acdf6420426490ee99fc2b602d54ff4ffcecfdab24eeab0a3%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247497427&idx=1&sn=2ed160c9917ad989eee1ac60d6122855&chksm=cf2229faf855a0ecf5eb34c7335acdf6420426490ee99fc2b602d54ff4ffcecfdab24eeab0a3&token=2044040586&lang=zh_CN#rd")

5\. 你们的mySQL架构是怎样的？
-------------------

大家可以结合自己公司的MySQL架构聊聊。如果不是很清楚的话，可以结合我之前写的来看看哈：[面试必备：聊聊MySQL的主从](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247497982%26idx%3D1%26sn%3Dbb589329cceb5462fc41f66ec63dbf56%26chksm%3Dcf2227d7f855aec16dd4d3b3425c0401850eeaf2c9cdc82e82722d38a00c24ee9ccfa3353774%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247497982&idx=1&sn=bb589329cceb5462fc41f66ec63dbf56&chksm=cf2227d7f855aec16dd4d3b3425c0401850eeaf2c9cdc82e82722d38a00c24ee9ccfa3353774&token=2044040586&lang=zh_CN#rd")

数据的库高可用方案

*   双机主备
*   一主一从
*   一主多从
*   MariaDB同步多主机
*   数据库中间件

### 5.1 双机主备

![](/images/jueJin/bee3bd65032c494.png)

*   优点：一个机器故障了可以自动切换，操作比较简单。
*   缺点：只有一个库在工作，读写压力大，未能实现读写分离，并发也有一定限制

### 5.2 一主一从

![](/images/jueJin/bc4c44aebc4e45a.png)

*   优点：从库支持读，分担了主库的压力，提升了并发度。一个机器故障了可以自动切换，操作比较简单。
*   缺点：一台从库，并发支持还是不够，并且一共两台机器，还是存在同时故障的机率，不够高可用。

### 5.3 一主多从

![](/images/jueJin/2d0cfd5a6d414b9.png)

*   优点：多个从库支持读，分担了主库的压力，明显提升了读的并发度。
*   缺点：只有一台主机写，因此写的并发度不高

### 5.4 MariaDB同步多主机集群

![](/images/jueJin/e38cf716685b482.png)

*   有代理层实现负载均衡，多个数据库可以同时进行读写操作；各个数据库之间可以通过Galera Replication方法进行数据同步，每个库理论上数据是完全一致的。
*   优点：读写的并发度都明显提升，可以任意节点读写，可以自动剔除故障节点，具有较高的可靠性。
*   缺点：数据量不支持特别大。要避免大事务卡死，如果集群节点一个变慢，其他节点也会跟着变慢。

### 5.5 数据库中间件

![](/images/jueJin/1ecccf9d059248f.png)

*   mycat分片存储，每个分片配置一主多从的集群。
*   优点：解决高并发高数据量的高可用方案
*   缺点：维护成本比较大。

大家有兴趣可以看看我这篇文章哈：[面试必备：聊聊MySQL的主从](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247497982%26idx%3D1%26sn%3Dbb589329cceb5462fc41f66ec63dbf56%26chksm%3Dcf2227d7f855aec16dd4d3b3425c0401850eeaf2c9cdc82e82722d38a00c24ee9ccfa3353774%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247497982&idx=1&sn=bb589329cceb5462fc41f66ec63dbf56&chksm=cf2227d7f855aec16dd4d3b3425c0401850eeaf2c9cdc82e82722d38a00c24ee9ccfa3353774&token=2044040586&lang=zh_CN#rd")

6\. 常见的索引结构有？哈希表结构属于哪种场景？
-------------------------

哈希表、有序数组和搜索树。

*   哈希表这种结构适用于只有等值查询的场景
*   有序数组适合范围查询，用二分法快速得到，时间复杂度为 O(log(N))。查询还好，如果是插入，就得挪动后面所有的记录，成本太高。因此它一般只适用静态存储引擎，比如保存2018年某个城市的所有人口信息。
*   B+树适合范围查询，我们一般建的索引结构都是B+树。

7.给你ab,ac,abc字段，你是如何加索引的？
-------------------------

这主要考察联合索引的最左前缀原则知识点。

*   这个最左前缀可以是联合索引的最左`N`个字段。比如组合索引`（a,b,c）`可以相当于建了`（a），（a,b）,(a,b,c)`三个索引，大大提高了索引复用能力。
*   最左前缀也可以是字符串索引的最左`M`个字符。

因此给你`ab,ac,abc`字段，你可以直接加`abc`联合索引和`ac`联合索引即可。

8\. 数据库隔离级别是否了解？你们的数据库默认隔离级别是？为什么选它？
------------------------------------

四大数据库隔离级别，分别是`读未提交，读已提交，可重复读，串行化（Serializable）`。

*   **读未提交**：事务即使未提交，却可以被别的事务读取到的，这级别的事务隔离有脏读、重复读、幻读的问题。
*   **读已提交**：当前事务只能读取到其他事务提交的数据，这种事务的隔离级别解决了脏读问题，但还是会存在不可重复读、幻读问题；
*   **可重复读**：限制了读取数据的时候，不可以进行修改，所以解决了**不可重复读**的问题，但是读取范围数据的时候，是可以插入数据，所以还会存在幻读问题。
*   **串行化**：事务最高的隔离级别，在该级别下，所有事务都是进行串行化顺序执行的。可以避免脏读、不可重复读与幻读所有并发问题。但是这种事务隔离级别下，事务执行很耗性能。

MySQL选择`Repeatable Read（可重复读）`作为默认隔离级别，我们的数据库隔离级别选的是`读已提交`。

### 8.1 为什么MySQL的默认隔离离别是RR?

binlog的格式也有三种：statement，row，mixed。设置为`statement`格式，binlog记录的是SQL的原文。又因为MySQL在主从复制的过程是通过`binlog`进行数据同步，如果设置为读已提交（RC）隔离级别，当出现事务乱序的时候，就会导致备库在 SQL 回放之后，结果和主库内容不一致。

比如一个表t，表中有两条记录：

```sql

CREATE TABLE t (
a int(11) DEFAULT NULL,
b int(11) DEFAULT NULL,
PRIMARY KEY a (a),
KEY b(b)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
insert into t1 values(10,666),(20,233);
```

两个事务并发写操作，如下：

![](/images/jueJin/72c63375516f41a.png)

在`读已提交（RC）`隔离级别下，两个事务执行完后，数据库的两条记录就变成了`（30,666）、(20,666)`。这两个事务执行完后，binlog也就有两条记录，因为事务binlog用的是`statement`格式，事务2先提交，因此`update t set b=666 where b=233`优先记录，而`update t set a=30 where b=666`记录在后面。

当`bin log`同步到从库后，执行`update t set b=666 where b=233`和`update t set a=30 where b=666`记录，数据库的记录就变成`（30,666）、(30,666)`，这时候主从数据不一致啦。

因此MySQL的**默认隔离离别**选择了`RR`而不是`RC`。`RR`隔离级别下，更新数据的时候不仅对更新的行加行级锁，还会加间隙锁`（gap lock）`。事务2要执行时，因为事务1增加了间隙锁，就会导致事务2执行被卡住，只有等事务1提交或者回滚后才能继续执行。

并且，MySQL还禁止在使用`statement`格式的`binlog`的情况下，使用`READ COMMITTED`作为事务隔离级别。

### 我们的数据库隔离级别最后选的是读已提交（RC）。

那为什么MySQL官方默认隔离级别是RR，而有些大厂选择了RC作为默认的隔离级别呢？

*   提升并发

RC 在加锁的过程中，不需要添加`Gap Lock`和 `Next-Key Lock` 的，只对要修改的记录添加行级锁就行了。因此RC的支持的并发度比RR高得多，

*   减少死锁

正式因为RR隔离级别增加了`Gap Lock`和 `Next-Key Lock` 锁，因此它相对于RC，更容易产生死锁。

9\. RR隔离级别实现原理，它是如何解决不可重复读的？
----------------------------

### 9.1 什么是不可重复读

先回忆下什么是**不可重复读**。假设现在有两个事务A和B：

*   事务A先查询Jay的余额，查到结果是100
*   这时候事务B 对Jay的账户余额进行扣减，扣去10后，提交事务
*   事务A再去查询Jay的账户余额发现变成了90

![](/images/jueJin/12c329106ec2418.png)

事务A被事务B干扰到了！在事务A范围内，两个相同的查询，**读取同一条记录，却返回了不同的数据，这就是不可重复读**。

### 9.2 undo log版本链 + Read View可见性规则

RR隔离级别实现原理，就是MVCC多版本并发控制，而MVCC是是通过`Read View+ Undo Log`实现的，Undo Log 保存了历史快照，Read View可见性规则帮助判断当前版本的数据是否可见。

`Undo Log`版本链长这样：

![](/images/jueJin/31925e73d0d74f3.png)

Read view 的几个重要属性

*   `m_ids`:当前系统中那些活跃(未提交)的读写事务ID, 它数据结构为一个List。
*   `min_limit_id`:表示在生成Read View时，当前系统中活跃的读写事务中最小的事务id，即m\_ids中的最小值。
*   `max_limit_id`:表示生成Read View时，系统中应该分配给下一个事务的id值。
*   `creator_trx_id`: 创建当前Read View的事务ID

Read view 可见性规则如下：

1.  如果数据事务ID`trx_id < min_limit_id`，表明生成该版本的事务在生成Read View前，已经提交(因为事务ID是递增的)，所以该版本可以被当前事务访问。
2.  如果`trx_id>= max_limit_id`，表明生成该版本的事务在生成Read View后才生成，所以该版本不可以被当前事务访问。
3.  如果`min_limit_id =<trx_id< max_limit_id`,需腰分3种情况讨论

> *   3.1 如果`m_ids`包含`trx_id`,则代表Read View生成时刻，这个事务还未提交，但是如果数据的`trx_id`等于`creator_trx_id`的话，表明数据是自己生成的，因此是可见的。
> *   3.2 如果`m_ids`包含`trx_id`，并且`trx_id`不等于`creator_trx_id`，则Read View生成时，事务未提交，并且不是自己生产的，所以当前事务也是看不见的；
> *   3.3 如果`m_ids`不包含`trx_id`，则说明你这个事务在Read View生成之前就已经提交了，修改的结果，当前事务是能看见的。

### 9.3 RR 如何解决不可重复读

查询一条记录，基于MVCC，是怎样的流程

1.  获取事务自己的版本号，即事务ID
2.  获取Read View
3.  查询得到的数据，然后Read View中的事务版本号进行比较。
4.  如果不符合Read View的可见性规则， 即就需要Undo log中历史快照;
5.  最后返回符合规则的数据

假设存在事务A和B，SQL执行流程如下

![](/images/jueJin/e8de3391f93c45b.png)

在可重复读（RR）隔离级别下，**一个事务里只会获取一次Read View**，都是副本共用的，从而保证每次查询的数据都是一样的。

假设当前有一张core\_user表，插入一条初始化数据,如下：

![](/images/jueJin/27888524f5ea442.png) 基于MVCC，我们来看看执行流程

1.  A开启事务，首先得到一个事务ID为100
2.  B开启事务，得到事务ID为101
3.  事务A生成一个Read View，read view对应的值如下

变量

值

m\_ids

100，101

max\_limit\_id

102

min\_limit\_id

100

creator\_trx\_id

100

然后回到版本链：开始从版本链中挑选可见的记录：

![](/images/jueJin/5314671eddae455.png)

由图可以看出，最新版本的列name的内容是孙权，该版本的trx\_id值为100。开始执行**read view可见性规则**校验：

```ini
min_limit_id(100)=<trx_id（100）<102;
creator_trx_id = trx_id =100;
```

由此可得，trx\_id=100的这个记录，当前事务是可见的。所以查到是**name为孙权**的记录。

4.  事务B进行修改操作，把名字改为曹操。把原数据拷贝到undo log,然后对数据进行修改，标记事务ID和上一个数据版本在undo log的地址。

![](/images/jueJin/72ccee877a7c431.png)

5.  事务B提交事务
    
6.  事务A再次执行查询操作，因为是RR（可重复读）隔离级别，因此**会复用老的Read View副本**，Read View对应的值如下
    

变量

值

m\_ids

100，101

max\_limit\_id

102

min\_limit\_id

100

creator\_trx\_id

100

然后再次回到版本链：从版本链中挑选可见的记录：

![](/images/jueJin/43953d122bba4c5.png)

从图可得，最新版本的列name的内容是曹操，该版本的trx\_id值为101。开始执行read view可见性规则校验：

```scss
min_limit_id(100)=<trx_id（101）<max_limit_id（102);
因为m_ids{100,101}包含trx_id（101），
并且creator_trx_id (100) 不等于trx_id（101）
```

所以，`trx_id=101`这个记录，对于当前事务是不可见的。这时候呢，版本链`roll_pointer`跳到下一个版本，`trx_id=100`这个记录，再次校验是否可见：

```scss
min_limit_id(100)=<trx_id（100）< max_limit_id（102);
因为m_ids{100,101}包含trx_id（100），
并且creator_trx_id (100) 等于trx_id（100）
```

所以，trx\_id=100这个记录，对于当前事务是可见的，所以两次查询结果，都是name=孙权的那个记录。即在可重复读（RR）隔离级别下，复用老的Read View副本，解决了不可重复读的问题。

大家可以回头多看几遍我这篇文章哈：[看一遍就理解：MVCC原理详解](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247495277%26idx%3D1%26sn%3Da1812febb4246f824ce54d778f672025%26chksm%3Dcf223144f855b8528ad6cce707dc3a1b4d387817bd751dfab4f79dda90c6640f9763d25f3f33%26token%3D1495321435%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247495277&idx=1&sn=a1812febb4246f824ce54d778f672025&chksm=cf223144f855b8528ad6cce707dc3a1b4d387817bd751dfab4f79dda90c6640f9763d25f3f33&token=1495321435&lang=zh_CN&scene=21#wechat_redirect")

10\. 你们项目使用了RocketMQ对吧？那你知道如何保证消息不丢失吗？
--------------------------------------

一个消息从生产者产生，到被消费者消费，主要经过这3个过程：

![](/images/jueJin/708a8d7b0e2f41f.png)

1.  生产者产生消息
2.  消息发送到存储端，保存下来
3.  消息推送到消费者，消费者消费完，ack应答。

因此如何保证MQ不丢失消息，可以从这三个阶段阐述：

*   生产者保证不丢消息
*   存储端不丢消息
*   消费者不丢消息

### 10.1 生产者保证不丢消息

生产端如何保证不丢消息呢？确保生产的消息能顺利到达存储端。

如果是`RocketMQ`消息中间件的话，`Producer`生产者提供了三种发送消息的方式，分别是：

*   同步发送
*   异步发送
*   单向发送

生产者要想发消息时保证消息不丢失，可以：

*   采用同步方式发送，send消息方法返回成功状态，即消息正常到达了存储端`Broker`。
*   如果`send`消息异常或者返回非成功状态，可以发起重试。
*   可以使用事务消息，`RocketMQ`的事务消息机制就是为了保证零丢失来设计的

### 10.2 存储端不丢消息

如何保证存储端的消息不丢失呢？确保消息持久化到磁盘，那就是刷盘机制嘛。

刷盘机制分**同步刷盘和异步刷盘**：

*   同步刷盘：生产者消息发过来时，只有持久化到磁盘，`RocketMQ`的存储端`Broker`才返回一个成功的ACK响应。它保证消息不丢失，但是影响了性能。
*   异步刷盘：只要消息写入`PageCache`缓存，就返回一个成功的ACK响应。这样提高了MQ的性能，但是如果这时候机器断电了，就会丢失消息。

出了同步刷盘机制，还有一个维度需要考虑。`Broker`一般是集群部署的，有主节点和从节点。消息到`Broker`存储端，只有主节点和从节点都写入成功，才反馈成功的`ack`给生产者。这就是**同步复制**，它保证了消息不丢失，但是降低了系统的吞吐量。与之对应即是**异步复制**，只要消息写入主节点成功，就返回成功的`ack`，它速度快，但是会有性能问题。

### 10.3 消费阶段不丢消息

消费者**执行完业务逻辑**，再反馈会`Broker`说消费成功，这样才可以保证消费阶段不丢消息。

11\. 事务消息是否了解？场景题：比如下单清空购物车，你是如何设计的？
------------------------------------

事务消息主要用来解决消息生产者和消息消费者的**数据一致性**问题。我们先来回忆一下：一条普通的消息队列消息，从产生到被消费，经历的流程：

![](/images/jueJin/408c25e5b6f74bc.png)

1.  生产者产生消息，发送带MQ服务器
2.  MQ收到消息后，将消息持久化到存储系统。
3.  MQ服务器返回ACk到生产者。
4.  MQ服务器把消息push给消费者
5.  消费者消费完消息，响应ACK
6.  MQ服务器收到ACK，认为消息消费成功，即在存储中删除消息。

**消息队列的事务消息流程是怎样的呢？**

![](/images/jueJin/661dc92559af447.png)

1.  生产者产生消息，发送一条半事务消息到MQ服务器
2.  MQ收到消息后，将消息持久化到存储系统，这条消息的状态是待发送状态。
3.  MQ服务器返回ACK确认到生产者，此时MQ不会触发消息推送事件
4.  生产者执行本地事务
5.  如果本地事务执行成功，即commit执行结果到MQ服务器；如果执行失败，发送rollback。
6.  如果是正常的commit，MQ服务器更新消息状态为可发送；如果是rollback，即删除消息。
7.  如果消息状态更新为可发送，则MQ服务器会push消息给消费者。消费者消费完就回ACK。
8.  如果MQ服务器长时间没有收到生产者的commit或者rollback，它会反查生产者，然后根据查询到的结果执行最终状态。

我们举个下**订单清空购物车**的例子吧。订单系统创建完订单后，然后发消息给下游系统购物车系统，清空购物车。

1.  生产者（订单系统）产生消息，发送一条半事务消息到MQ服务器
2.  MQ收到消息后，将消息持久化到存储系统，这条消息的状态是待发送状态。
3.  MQ服务器返回ACK确认到生产者，此时MQ不会触发消息推送事件
4.  生产者执行本地事务（订单创建成功，提交事务消息）
5.  如果本地事务执行成功，即commit执行结果到MQ服务器；如果执行失败，发送rollback。
6.  如果是commit正常提交，MQ服务器更新消息状态为**可发送**；如果是rollback，即**删除消息**。
7.  如果消息状态更新为可发送，则MQ服务器会push消息给消费者（购物车系统）。消费者消费完（即拿到订单消息，清空购物车成功）就应答ACK。
8.  如果MQ服务器长时间没有收到生产者的commit或者rollback，它会反查生产者，然后根据查询到的结果（回滚操作或者重新发送消息）执行最终状态。

有些伙伴可能有疑惑，如果消费者消费失败怎么办呢？那数据是不是不一致啦？所以就需要消费者消费成功，执行业务逻辑成功，再反馈ack嘛。如果消费者消费失败，那就自动重试嘛，接口支持幂等即可。

12\. 如何快速判断一个数是奇数还是偶数，除开对2取余呢。
------------------------------

判断一个数是奇数还是偶数，我们最容易想到的就是对2取余。

```scss
if( x % 2 )
// 奇数
else
// 偶数
```

还有一种方法，就是与1相与（ `&1`），具体实现如下：

```scss
if( x & 1 )
// 奇数
else
// 偶数
```

13\. Spring声明式事务原理？哪些场景事务会失效？
-----------------------------

### 13.1 声明式事务原理

spring声明式事务，即`@Transactional`,它可以帮助我们把事务开启、提交或者回滚的操作，通过Aop的方式进行管理。

![](/images/jueJin/b0bfe9d10a79426.png)

在spring的bean的初始化过程中，就需要对实例化的bean进行代理，并且生成代理对象。生成代理对象的代理逻辑中，进行方法调用时，需要先获取切面逻辑，@Transactional注解的切面逻辑类似于@Around，在spring中是实现一种类似代理逻辑。

![](/images/jueJin/b78a41e8dcb6426.png)

详解可以看下这篇文章哈：[Spring中的@Transactional实现原理](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247497609%26idx%3D1%26sn%3D4a1e5c567961ba8ca1e98960a38ce56e%26chksm%3Dcf2228a0f855a1b6ab227e7d941b10c7ee97f3fb4b5284183973d6b1dc0c563acf5db07e62d1%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247497609&idx=1&sn=4a1e5c567961ba8ca1e98960a38ce56e&chksm=cf2228a0f855a1b6ab227e7d941b10c7ee97f3fb4b5284183973d6b1dc0c563acf5db07e62d1&token=2044040586&lang=zh_CN#rd")

### 13.2 spring声明式事务哪些场景会失效

*   方法的访问权限必须是public，其他private等权限，事务失效
*   方法被定义成了final的，这样会导致事务失效。
*   在同一个类中的方法直接内部调用，会导致事务失效。
*   一个方法如果没交给spring管理，就不会生成spring事务。
*   多线程调用，两个方法不在同一个线程中，获取到的数据库连接不一样的。
*   表的存储引擎不支持事务
*   如果自己try...catch误吞了异常，事务失效。
*   错误的传播

详解大家可以看下这篇文章：[聊聊spring事务失效的12种场景，太坑了](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzg3NzU5NTIwNg%3D%3D%26mid%3D2247494570%26idx%3D2%26sn%3D17357bcd328b2d1d83f4a72c47daac1b%26chksm%3Dcf223483f855bd95351a778d5f48ddd37917ce2790ebbbcd1d6ee4f27f7f4b147f0d41101dcc%26token%3D2044040586%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzg3NzU5NTIwNg==&mid=2247494570&idx=2&sn=17357bcd328b2d1d83f4a72c47daac1b&chksm=cf223483f855bd95351a778d5f48ddd37917ce2790ebbbcd1d6ee4f27f7f4b147f0d41101dcc&token=2044040586&lang=zh_CN#rd")

14\. 你们是微服务架构嘛？如果你来设计一个类似淘宝的系统，你怎么划分微服务？
----------------------------------------

可以按业务领域、功能、重要程度进行划分。

*   可以按业务领域，把用户、社区、商品信息、消息等模块等划分。
*   单一功能职责，按功能拆分，比如订单、支付、物流、权限。
*   按重要程度划分，区分核心和非核心功能，比如支付、订单就是核心功能。

15\. 你们是怎么分库分表的？分布式ID如何生成？
--------------------------

如果是我们公司的话，使用了水平分库的方式，就是一个用户注册时，就划分了属于哪个数据库，然后具体的表结构是一样的。

业界还有垂直分库，就是按照不同的系统中的不同业务进行拆分，比如拆分成用户库、订单库、积分库、商品库，把它们部署在不同的数据库服务器。

分表的话也有水平分表和垂直分表，垂直分表就是将一些不常用的、数据较大或者长度较长的列拆分到另外一张表，水平分表就是可以按照某种规则（如hash取模、range），把数据切分到多张表去。一张订单表，按时间range拆分如下：

![](/images/jueJin/e6a33698a96c4af.png)

**range划分利于数据迁移，但是存在数据热点问题。hash取模划分，不会存在明显的热点问题，但是不利于扩容。可以range+hash取模结合使用。**

**分布式ID可以使用雪花算法生成**

> 雪花算法是一种生成分布式全局唯一ID的算法，生成的ID称为Snowflake IDs。这种算法由Twitter创建，并用于推文的ID。

一个Snowflake ID有64位。

*   第1位：Java中long的最高位是符号位代表正负，正数是0，负数是1，一般生成ID都为正数，所以默认为0。
*   接下来前41位是时间戳，表示了自选定的时期以来的毫秒数。
*   接下来的10位代表计算机ID，防止冲突。
*   其余12位代表每台机器上生成ID的序列号，这允许在同一毫秒内创建多个Snowflake ID。

![](/images/jueJin/7a02f54834ba4d0.png)

16\. 所有异常的共同的祖先是？运行时异常有哪几个？
---------------------------

![](/images/jueJin/ce8c87b6ecfb40f.png)

Java 异常的顶层父类是`Throwable`，它生了两个儿子，大儿子叫`Error`,二儿子叫`Exception`。

*   **Error**：是程序⽆法处理的错误，一般表示系统错误，例如虚拟机相关的错误`OutOfMemoryError`
*   **Exception**：程序本身可以处理的异常。它可以分为RuntimeException（运行时异常）和CheckedException（可检查的异常）。

**什么是RuntimeException（运行时异常）**？

> 运行时异常是不检查异常，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。

常见的**RuntimeException异常**：

*   NullPointerException：空指针异常
    
*   ArithmeticException：出现异常的运算条件时，抛出此异常
    
*   IndexOutOfBoundsException：数组索引越界异常
    
*   ClassNotFoundException：找不到类异常
    
*   IllegalArgumentException(非法参数异常)
    

什么是**CheckedException（可检查的异常）**？

> 从程序语法角度讲是必须进行处理的异常，如果不处理，程序就不能编译通过。如IOException、SQLException等。

**常见的 Checked Exception 异常：**

*   IOException：(操作输入流和输出流时可能出现的异常)
*   SQLException

最后(求关注，别白嫖我)
------------

如果这篇文章对您有所帮助，或者有所启发的话，求一键三连：点赞、转发、在看，您的支持是我坚持写作最大的动力。

参考感谢
----

*   [我的阿里二面，为什么MySQL选择Repeatable Read作为默认隔离级别？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FbzTJtuVYkR61zDPBAOzU2g "https://mp.weixin.qq.com/s/bzTJtuVYkR61zDPBAOzU2g")
*   [MySQL 默认隔离级别是RR，为什么阿里等大厂会改成RC？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FbzTJtuVYkR61zDPBAOzU2g "https://mp.weixin.qq.com/s/bzTJtuVYkR61zDPBAOzU2g")