---
author: "江小北"
title: "只CURD的Java后端要如何提升自己？"
date: 2024-09-24
description: "抱怨过苦恼过也后悔过，但是站在现在的时间点回想以前，发现有很多事情我们是可以做的更好的。小北将带大家从六个方面深入探讨如何在Java后台管理开发中不断进步，帮助你在职业道路上稳步前行"
tags: ["后端"]
ShowReadingTime: "阅读11分钟"
weight: 1108
---
> 你是否工作3~5年后，发现日常只做了CURD的简单代码。  
> 你是否每次面试就会头疼，自己写的代码，除了日常CURD简历上毫无亮点可写

抱怨过苦恼过也后悔过，但是站在现在的时间点回想以前，发现有很多事情我们是可以做的更好的。

于是有了这篇文章。

小北将带大家从六个方面深入探讨如何在Java后台管理开发中不断进步，帮助你在职业道路上稳步前行

### 一、写优雅的代码

#### 优雅代码的重要性

优雅的代码不仅易于阅读和维护，还能减少错误，提高开发效率。对于后台管理系统，代码的整洁与规范尤为重要，因为它们通常涉及复杂的业务逻辑和大量的数据处理。

我们看一个简单的案例，我们直观的感受下，需求如下：

> 用户可以通过银行网页转账给另一个账号，支持跨币种转账。  
> 同时因为监管和对账需求，需要记录本次转账活动

拿到这个需求之后，一个开发可能会经历一些技术选型，最终可能拆解需求如下：

> 1、从MySql数据库中找到转出和转入的账户，选择用MyBatis的mapper实现DAO  
> 2、从Yahoo（或其他渠道）提供的汇率服务获取转账的汇率信息（底层是http开放接口）  
> 3、计算需要转出的金额，确保账户有足够余额，并且没超出每日转账上限  
> 4、实现转入和转出操作，扣除手续费，保存数据库  
> 5、发送Kafka审计消息，以便审计和对账用

而一个常规的代码实现如下：

java

 代码解读

复制代码

`public class TransferServiceImpl implements TransferService {     private static final String TOPIC_AUDIT_LOG = "TOPIC_AUDIT_LOG";     private AccountMapper accountDAO;     private KafkaTemplate<String, String> kafkaTemplate;     private YahooForexService yahooForex;     @Override     public Result<Boolean> transfer(Long sourceUserId, String targetAccountNumber, BigDecimal targetAmount, String targetCurrency) {         // 1. 从数据库读取数据，忽略所有校验逻辑如账号是否存在等         AccountDO sourceAccountDO = accountDAO.selectByUserId(sourceUserId);         AccountDO targetAccountDO = accountDAO.selectByAccountNumber(targetAccountNumber);         // 2. 业务参数校验         if (!targetAccountDO.getCurrency().equals(targetCurrency)) {             throw new InvalidCurrencyException();         }         // 3. 获取外部数据，并且包含一定的业务逻辑         // exchange rate = 1 source currency = X target currency         BigDecimal exchangeRate = BigDecimal.ONE;         if (sourceAccountDO.getCurrency().equals(targetCurrency)) {             exchangeRate = yahooForex.getExchangeRate(sourceAccountDO.getCurrency(), targetCurrency);         }         BigDecimal sourceAmount = targetAmount.divide(exchangeRate, RoundingMode.DOWN);         // 4. 业务参数校验         if (sourceAccountDO.getAvailable().compareTo(sourceAmount) < 0) {             throw new InsufficientFundsException();         }         if (sourceAccountDO.getDailyLimit().compareTo(sourceAmount) < 0) {             throw new DailyLimitExceededException();         }         // 5. 计算新值，并且更新字段         BigDecimal newSource = sourceAccountDO.getAvailable().subtract(sourceAmount);         BigDecimal newTarget = targetAccountDO.getAvailable().add(targetAmount);         sourceAccountDO.setAvailable(newSource);         targetAccountDO.setAvailable(newTarget);         // 6. 更新到数据库         accountDAO.update(sourceAccountDO);         accountDAO.update(targetAccountDO);         // 7. 发送审计消息         String message = sourceUserId + "," + targetAccountNumber + "," + targetAmount + "," + targetCurrency;         kafkaTemplate.send(TOPIC_AUDIT_LOG, message);         return Result.success(true);     } }`

我们可以看到，一段业务代码里经常包含了**参数校验、数据读取存储、业务计算、调用外部服务、发送消息**等多种逻辑。  
在这个案例里虽然是写在了同一个方法里，在真实代码中经常会被拆分成多个子方法，但实际效果是一样的，而在我们日常的工作中，绝大部分代码都或多或少的接近于此类结构。

那么优雅的代码应该是什么样的？

java

 代码解读

复制代码

`public class TransferServiceImplNew implements TransferService {     // 可以看出来，经过重构后的代码有以下几个特征：     // 业务逻辑清晰，数据存储和业务逻辑完全分隔。     // Entity、Domain Primitive、Domain Service都是独立的对象，没有任何外部依赖，     // 但是却包含了所有核心业务逻辑，可以单独完整测试。     // 原有的TransferService不再包括任何计算逻辑，仅仅作为组件编排，     // 所有逻辑均delegate到其他组件。这种仅包含Orchestration（编排）的服务叫做Application Service（应用服务）。     // 我们可以根据新的结构重新画一张图：     private AccountRepository accountRepository;     private AuditMessageProducer auditMessageProducer;     private ExchangeRateService exchangeRateService;     private AccountTransferService accountTransferService;     @Override     public Result<Boolean> transfer(Long sourceUserId, String targetAccountNumber, BigDecimal targetAmount, String targetCurrency) {         // 参数校验         Money targetMoney = new Money(targetAmount, new Currency(targetCurrency));         // 读数据         Account sourceAccount = accountRepository.find(new UserId(sourceUserId));         Account targetAccount = accountRepository.find(new AccountNumber(targetAccountNumber));         // 获取汇率         ExchangeRate exchangeRate = exchangeRateService.getExchangeRate(             sourceAccount.getCurrency(), targetMoney.getCurrency()         );         // 业务逻辑         accountTransferService.transfer(sourceAccount, targetAccount, targetMoney, exchangeRate);         // 保存数据         accountRepository.save(sourceAccount);         accountRepository.save(targetAccount);         // 发送审计消息         AuditMessage message = new AuditMessage(sourceAccount, targetAccount, targetMoney);         auditMessageProducer.send(message);         return Result.success(true);     } }`

虽然功能都一样，但是在面试的时候写了上面的代码能得到了面试官的赞扬，而如果写成了上面的样子，估计不会有这种效果。

> 最近无意间获得一份阿里大佬写的刷题笔记，一下子打通了我的任督二脉，进大厂原来没那么难。这是大佬写的，\[7701页的BAT大佬写的刷题笔记，让我offer拿到手软\]

### 二、提升代码质量

如果说优雅的代码是我们程序员的里子，那代码质量就是我们的面子。

想象一下，如果你写的代码，提测后测试出来各种bug，上线后也出现bug，就算你代码写的再优雅也没用了。

#### 如何提升代码质量

想提升代码质量，最理想的是靠 code review，但是实际上这玩意在大多数公司根本就推行不下去。

> 为什么呢？因为大家都很忙，忙着改上一个迭代的bug，忙着写下一个迭代的需求，忙着做各种性能优化，忙着做各种日报、周报、月报等等...

所以靠人不如靠己，我们在日常工作中要善于利用工具，来帮我们发现问题，解决问题。

例如以下实践方法：

1.  **自动化测试**：编写单元测试、集成测试，确保代码功能的正确性和稳定性。使用JUnit、Mockito等工具进行测试驱动开发（TDD）。
2.  **持续集成（CI）**：通过Jenkins、GitHub Actions等工具，自动化构建和测试流程，及时发现并解决问题。
3.  **静态代码分析**：使用工具如SonarQube，对代码进行静态分析，检测代码中的潜在问题和代码风格违规。
4.  合理利用大模型，对我们的代码进行分析，发现bug。

### 三、关注业务

> 看到这里有的人不禁要问，我一个后端开发，写好代码就行了，还需要关注业务吗？

如果你有这样的想法，那就大错特错了。

中国的企业，90%的开发都是面向业务开发，纯做研究的公司少之又少。所以你想要在互联网行业走的更高，那就一定不能脱离业务。

而且只有深刻理解业务了，才能对系统有一个整体的规划意识，才能设计出一个好的系统。

#### 实践方法

1.  **多与业务团队沟通**：定期与产品经理、业务分析师沟通，了解业务流程和需求变化。
2.  **参与需求讨论**：积极参与需求评审和讨论，提出技术上的可行性建议和优化方案。
3.  **业务文档学习**：阅读业务相关的文档和资料，全面了解系统的功能和使用场景。
4.  **业务架构梳理**：梳理公司整体系统业务领域架构图，先从整体对公司业务有一个清晰的概念

#### 实践建议

1.  **业务流程图**：绘制业务流程图，帮助理解各个业务环节之间的关系和数据流动。
2.  **用户故事**：通过用户故事的方式，站在用户角度思考功能设计，提高系统的用户体验。
3.  **持续学习**：随着业务的发展，持续学习和更新业务知识，确保技术方案与业务需求保持一致。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f716a6a4609c49379c1069047d7d0e6f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5bCP5YyX:q75.awebp?rk3s=f64ab15b&x-expires=1727791182&x-signature=Xe3Vq1OB5f%2BdSpBFJ5J62uhPDGc%3D)

### 四、培养架构思维

5年以上的程序员，就一定要培养自己的架构思维了，也就是要把自己的技术视角由自己的点扩展到线，再扩展到面。  
从而对公司整体系统技术架构有一个整体的认知。

例如到一个公司之后，你一定要具有自我绘制如下技术架构图的能力。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2f8ce037235847ae84ebc420c7a9c3e8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5bCP5YyX:q75.awebp?rk3s=f64ab15b&x-expires=1727791182&x-signature=8oL21FLfg%2BTFp7wT20SqLlVfpec%3D)

#### 架构思维的重要性

良好的架构设计是系统稳定、高效运行的基础。  
培养架构思维，能够帮助你在项目初期做出合理的技术选型和系统设计，提升系统的可扩展性和维护性。

##### 实践方法

1.  **学习架构设计原则**：如单一职责原则（SRP）、开闭原则（OCP）、依赖倒置原则（DIP）等，指导架构设计。
2.  **分层架构**：采用DDD领域分层架构，如适配层、应用层和领域层、防腐层，明确各层的职责，降低耦合度。
3.  **模块化设计**：将系统拆分为独立的领域模块或微服务，提升系统的可维护性和可扩展性。

> 最近无意间获得一份阿里大佬写的刷题笔记，一下子打通了我的任督二脉，进大厂原来没那么难。这是大佬写的，\[7701页的BAT大佬写的刷题笔记，让我offer拿到手软\]

### 五、关注源码

#### 源码学习的价值

其实学习源码最市侩的价值那就是面试会问了，比如说 HashMap 的一些经典问题：

> 1、加载因子为什么是 0.75？  
> 2、为什么链表改为红黑树的阈值是 8?  
> 3、HashMap的底层数据结构是什么？  
> 4、解决hash冲突的办法有哪些？  
> 5、HashMap数组的长度为什么是 2 的幂次方？  
> 6、HashMap 的扩容方式？

这些问题只有通过源码才能得出比较准确的回答。

但是我个人认为阅读源码对我们最大的价值其实是我们可以学习借鉴源码设计中的优秀思想。

> 想象一下，我们每天做着CURD的996工作，根本没有机会接触优秀的项目设计思想。而阅读源码是我们最容易接触到优秀项目设计核心思想的机会。

其次阅读源码也可以在系统出现棘手的问题时候，可以快速定位解决。大大提升自己在职场中的核心竞争力。

> 有个同学说过一句话，给我的印象特别深刻，就是“有啥解决不了的？只要你肯阅读源码。”

### 六、项目管理能力

实现一个软件系统的过程，不仅只有编码，还涉及到项目安排，团队协调等一系列非技术因素，如果想从一名程序员走向管理岗，成为 team leader 或者开发经理，软件工程方面的知识就必须得跟得上。

要想写出一个好而美的程序，需要经过三个阶段。

**第一阶段**：有扎实的基本功，简单点说，就是要做到语法熟练、框架熟练，成为一名能够完成开发任务的“码农”。

**第二阶段**：从“码农”到“工程师”，在局部上，不仅要能够实现功能，还能关注功能之外的维度，比如健壮性、低耦合、可扩展等指标。

**第三阶段**：从“工程师”到“架构师”，不仅在局部上追求一个模块的好坏，而且还要从整个系统层面去掌控，合理安排资源的优先级，保证整个系统不会出现腐败等等。

所以要想成为一名优秀的架构师，项目管理能力是必不可少的。

比如项目范围管理、质量管理、资源/成本管理、风险管理等一系列管理能力。有兴趣的同学可以学习PMP，提升一下自己的项目管理能力。

#### 传统预测项目管理

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a917ecbeb2b94f7a8140b7f197c44020~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5bCP5YyX:q75.awebp?rk3s=f64ab15b&x-expires=1727791182&x-signature=uIV4bFNwECFLgtfE6G2SF7Q9aKo%3D)

#### 敏捷开发项目管理

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1df62999ef6c4036b0dd11d458d81b26~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGf5bCP5YyX:q75.awebp?rk3s=f64ab15b&x-expires=1727791182&x-signature=darh8FjpNKrhQE8PWAt4XF8v3oE%3D)

### 说在最后

学习的过程，就好像登山一样，大概有 80% 的人在这个过程中会掉队。要想成为一名优秀的架构师，除了自身的努力，也需要一点点运气。

那么请相信我，只要目标明确，努力加上坚持，再加上一点点好运气，你就能登顶！

#### **免费看 500 套技术教程的网站，希望对你有帮助**

[程序员快看-教程，程序员编程资料站 | CXYKK.COM](https://link.juejin.cn?target=https%3A%2F%2Fcxykk.com%2F%23zhuanlan "https://cxykk.com/#zhuanlan")

\***最近无意间获得一份阿里大佬写的刷题笔记，一下子打通了我的任督二脉，进大厂原来没那么难。这是大佬写的，** \*[\[7701页的BAT大佬写的刷题笔记，让我offer拿到手软\]](https://link.juejin.cn?target=https%3A%2F%2Fcxykk.com%2F%23zhuanlan "https://cxykk.com/#zhuanlan")

#### **求一键三连：点赞、分享、收藏**

我的技术网站：[**cxykk.com**](https://link.juejin.cn?target=https%3A%2F%2Fcxykk.com%2F%23zhuanlan "https://cxykk.com/#zhuanlan") 里面有，500套技术系列教程、1万+道，面试八股文、BAT面试真题、简历模版，工作经验分享、架构师成长之路，全部免费，欢迎收藏和转发。