---
author: "MacroZheng"
title: "mall数据库表结构概览"
date: 2019-07-21
description: "mall是一套电商系统，后台系统主要包括商品管理、订单管理、营销管理（运营管理+促销管理）、内容管理、用户管理等模块，本文主要对这些模块的数据库表结构及功能做大概的介绍。 注意：部分功能暂未实现，只是对表结构进行了设计，商品管理、订单管理、营销管理大部分功能均已实现。 mall…"
tags: ["MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:32,comments:4,collects:73,views:15674,"
---
> SpringBoot实战电商项目mall（18k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

简介
--

mall是一套电商系统，后台系统主要包括商品管理、订单管理、营销管理（运营管理+促销管理）、内容管理、用户管理等模块，本文主要对这些模块的数据库表结构及功能做大概的介绍。

商品管理
----

### 数据库表结构

![展示图片](/images/jueJin/16c14b75d6f3097.png)

### 功能结构

![展示图片](/images/jueJin/16c14b75d70fbc5.png)

订单管理
----

### 数据库表结构

![展示图片](/images/jueJin/16c14b75dcd116d.png)

### 功能结构

![展示图片](/images/jueJin/16c14b75dd52b63.png)

营销管理
----

### 数据库表结构

![展示图片](/images/jueJin/16c14b75df4dd6e.png)

### 功能结构

![展示图片](/images/jueJin/16c14b75de86703.png)

内容管理
----

### 数据库表结构

![展示图片](/images/jueJin/16c14b76023f39a.png)

### 功能结构

![展示图片](/images/jueJin/16c14b760bca495.png)

用户管理
----

### 数据库表结构

![展示图片](/images/jueJin/16c14b764bb55ad.png)

### 功能结构

![展示图片](/images/jueJin/16c14b763f9a2e1.png)

`注意`：部分功能暂未实现，只是对表结构进行了设计，商品管理、订单管理、营销管理大部分功能均已实现。

相关资料
----

### PowerDesigner数据库设计文件

*   商品管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fpdm%2Fmall_pms.pdm "https://github.com/macrozheng/mall-learning/blob/master/document/pdm/mall_pms.pdm")
*   订单管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fpdm%2Fmall_oms.pdm "https://github.com/macrozheng/mall-learning/blob/master/document/pdm/mall_oms.pdm")
*   营销管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fpdm%2Fmall_sms.pdm "https://github.com/macrozheng/mall-learning/blob/master/document/pdm/mall_sms.pdm")
*   内容管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fpdm%2Fmall_cms.pdm "https://github.com/macrozheng/mall-learning/blob/master/document/pdm/mall_cms.pdm")
*   用户管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fpdm%2Fmall_ums.pdm "https://github.com/macrozheng/mall-learning/blob/master/document/pdm/mall_ums.pdm")

### MindMaster功能思维导图

*   商品管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fmind%2Fpms.emmx "https://github.com/macrozheng/mall-learning/blob/master/document/mind/pms.emmx")
*   订单管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fmind%2Foms.emmx "https://github.com/macrozheng/mall-learning/blob/master/document/mind/oms.emmx")
*   营销管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fmind%2Fsms.emmx "https://github.com/macrozheng/mall-learning/blob/master/document/mind/sms.emmx")
*   内容管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fmind%2Fcms.emmx "https://github.com/macrozheng/mall-learning/blob/master/document/mind/cms.emmx")
*   用户管理：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fmind%2Fums.emmx "https://github.com/macrozheng/mall-learning/blob/master/document/mind/ums.emmx")

使用到的工具
------

*   PowerDesigner:[powerdesigner.de/](https://link.juejin.cn?target=http%3A%2F%2Fpowerdesigner.de%2F "http://powerdesigner.de/")
*   MindMaster:[www.edrawsoft.cn/mindmaster](https://link.juejin.cn?target=http%3A%2F%2Fwww.edrawsoft.cn%2Fmindmaster "http://www.edrawsoft.cn/mindmaster")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16c14b89401381b.png)