---
author: "京东云开发者"
title: "Java表达式引擎选型调研分析"
date: 2024-08-15
description: "1 简介 我们项目组主要负责面向企业客户的业务系统，企业的需求往往是多样化且复杂的，对接不同企业时会有不同的定制化的业务模型和流程。 我们在业务系统中使用表达式引擎，集中配置管理业务规则，并实现实时决 1 简介

我们项目组主要负责面向企业客户的业务系统，企业的需求往往是多样化且复杂的，对接不同企业时会有不同的定制化的"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读19分钟"
weight: 1
selfDefined:"likes:13,comments:0,collects:23,views:423,"
---
**1 简介**
--------

我们项目组主要负责面向企业客户的业务系统，**企业的需求往往是多样化且复杂的，对接不同企业时会有不同的定制化的业务模型和流程。** 我们在业务系统中**使用表达式引擎，集中配置管理业务规则，并实现实时决策和计算，可以提高系统的灵活性和响应能力**，从而更好地满足业务的需求。

举个简单的例子，假设我们有一个业务场景，在返利系统中，当推广员满足一定的奖励条件时，就会给其对应的奖励金额。例如某个产品的具体奖励规则如下：

奖励条件

奖励金额

拉新用户数大于等于3个且客单价大于50元

100元

拉新用户数大于等于5个且客单价大于100元

200元

拉新用户数大于等于10个且客单价大于200元

500元

这个规则看起来很好实现，只要在代码里写几个if else分支就可以了。但是如果返利系统对接了多家供应商，且每家提供的产品的奖励规则都不同呢？再通过硬编码的方式写if else似乎就不太好了，每次增加修改删除规则都需要系统发版上线。

引入规则引擎似乎就能解决这个问题，规则引擎的一个好处就是可以使业务规则和业务代码分离，从而降低维护难度，同时它还可以满足业务人员通过编写DSL或通过界面指定规则的诉求，这样就可以在没有开发人员参与的情况下建立规则了，这种说法听起来似乎很有道理，但在实践中却很少行得通。首先，规则引擎有一定的学习成本，即使开发人员使用也需要进行专门的学习，更何况没有任何编程背景的业务人员，其次，其实现的复杂度也高，如果业务规则复杂，规则制定者对规则引擎内部隐藏的程序流程不了解，很可能会得到意想不到的结果，最后，有些规则引擎还存在性能瓶颈。如果对规则引擎和表达式引擎都不熟悉，抽离的业务规则又需要由开发人员来制定，那么**相比之下表达式引擎就要容易上手的多，其语法更接近Java，而且有些表达式引擎还会将表达式编译成字节码，在执行速度和资源利用方面可能就更有优势。** 所以，对于此类业务场景，使用表达式引擎似乎更加合适一些。

本文主要对Java表达式引擎进行概要性介绍和分析，并提供一定建议，为团队研发过程中对表达式引擎的技术选型提供输入。

**2 技术栈简介**
-----------

本文将针对[AviatorScript](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkillme2008%2Faviatorscript "https://github.com/killme2008/aviatorscript")、[MVEL](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmvel%2Fmvel "https://github.com/mvel/mvel")、[OGNL](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Forphan-oss%2Fognl "https://github.com/orphan-oss/ognl")、[SpEL](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspring-projects%2Fspring-framework "https://github.com/spring-projects/spring-framework")、[QLExpress](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FQLExpress "https://github.com/alibaba/QLExpress")、[JEXL](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fcommons-jexl "https://github.com/apache/commons-jexl")、[JUEL](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbeckchr%2Fjuel "https://github.com/beckchr/juel")几种常见表达式引擎进行选型调研。先简单介绍一下这几种表达式引擎。

### **2.1 AviatorScript**

AviatorScript 是一门高性能、轻量级寄宿于 JVM 之上的脚本语言。AviatorScript 可将表达式编译成字节码。2010年作者在淘宝中间件负责Notify内部消息中间件时开发并开源。它原来的定位一直只是一个表达式引擎，不支持 if/else 条件语句，也不支持for/while循环语句等，随着5.0的发布变身为一个通用脚本语言，支持了这些语言特性。

文档：[www.yuque.com/boyan-avfmj…](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Fboyan-avfmj%2Faviatorscript "https://www.yuque.com/boyan-avfmj/aviatorscript")﻿

### **2.2 MVEL (MVFLEX Expression Language)**

MVEL是一种混合的动态/静态类型的、可嵌入Java平台的表达式语言，MVEL被众多Java项目使用。MVEL 在很大程度上受到 Java 语法的启发，但也有一些本质区别，目的是使其作为一种表达式语言更加高效，例如直接支持集合、数组和字符串匹配的操作符，以及正则表达式。最早版本发布于2007年。

文档：[mvel.documentnode.com/](https://link.juejin.cn?target=http%3A%2F%2Fmvel.documentnode.com%2F "http://mvel.documentnode.com/")﻿

### **2.3 OGNL (Object-Graph Navigation Language)**

OGNL 是 Object-Graph Navigation Language（对象图导航语言）的缩写；它是一种表达式语言，用于获取和设置 Java 对象的属性，以及其他额外功能，如列表投影和选择以及 lambda 表达式。于2005年发布2.1.4版。

文档：[commons.apache.org/dormant/com…](https://link.juejin.cn?target=https%3A%2F%2Fcommons.apache.org%2Fdormant%2Fcommons-ognl%2Flanguage-guide.html "https://commons.apache.org/dormant/commons-ognl/language-guide.html")﻿

### **2.4 SpEL (Spring Expression Language)**

SpEL是一种功能强大的表达式语言，支持在运行时查询和操作对象图。该语言的语法与 Unified EL 相似，但提供了更多的功能，其中最主要的是方法调用和基本的字符串模板功能。

文档：[docs.spring.io/spring-fram…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.spring.io%2Fspring-framework%2Fdocs%2F5.3.x%2Freference%2Fhtml%2Fcore.html%23expressions "https://docs.spring.io/spring-framework/docs/5.3.x/reference/html/core.html#expressions")﻿

### **2.5 QLExpress**

由阿里的电商业务规则、表达式（布尔组合）、特殊数学公式计算（高精度）、语法分析、脚本二次定制等强需求而设计的一门动态脚本引擎解析工具。在阿里集团有很强的影响力，同时为了自身不断优化、发扬开源贡献精神，于2012年开源。

文档：[github.com/alibaba/QLE…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FQLExpress "https://github.com/alibaba/QLExpress")﻿

### **2.6 JEXL (Java Expression Language)**

JEXL 旨在促进在 Java 编写的应用程序和框架中实现动态脚本功能。 JEXL 基于对 JSTL 表达式语言的一些扩展实现了一种表达式语言，支持 shell 脚本或 ECMAScript 中的大部分构想。1.0版发布于2005年。

文档：[commons.apache.org/proper/comm…](https://link.juejin.cn?target=https%3A%2F%2Fcommons.apache.org%2Fproper%2Fcommons-jexl%2Freference%2Fsyntax.html "https://commons.apache.org/proper/commons-jexl/reference/syntax.html")﻿

### **2.7 JUEL (Java Unified Expression Language)**

JUEL 是统一表达式语言 (EL) 的实现，该语言是 JSP 2.1 标准 (JSR-245) 的一部分，已在 JEE5 中引入。此外，JUEL 2.2 实现了 JSP 2.2 维护版本规范，完全符合 JEE6 标准。于2006年发布2.1.0版本，2.2.7发布于2014年。

文档：[juel.sourceforge.net/guide/start…](https://link.juejin.cn?target=https%3A%2F%2Fjuel.sourceforge.net%2Fguide%2Fstart.html "https://juel.sourceforge.net/guide/start.html")﻿

### **2.8 Janino**

Janino是一个超小、超快的Java编译器，也可以用作表达式引擎，它的性能非常出色，根据官网介绍，Apache Spark、Apache Flink、Groovy等优秀的开源项目都在用Janino。

文档：[janino-compiler.github.io/janino/](https://link.juejin.cn?target=http%3A%2F%2Fjanino-compiler.github.io%2Fjanino%2F "http://janino-compiler.github.io/janino/")﻿

由于Janino实际是一个Java编译器，理论上其性能应该更接近于直接执行Java代码，其次作为表达式引擎使用起来比较复杂。因此，下面的对比中，Janino不参与比较，可以将其作为一个参照。

### **2.9 其他**

如下一些表达式引擎虽然也常见于各技术博客，但由于长期没有更新维护，因此没有纳入此次选型比较

**Fel**

Fel是轻量级的高效的表达式计算引擎。Fel源自于企业项目，设计目标是为了满足不断变化的功能需求和性能需求。项目托管于Google Code，上次更新是2012年，已经十几年没有更新了，所以没有纳入此次选型。

**ik-expression**

IK Expression是一个开源的（OpenSource)，可扩展的（Extensible），基于java语言开发的一个超轻量级（Super lightweight）的公式化语言解析执行工具包。2009年2月发布第一个版本，2009年10月发布最后一个版本后再没有新版本发布，所以没有纳入此次选型。

**JSEL**

JSEL是一个兼容 JavaScript 运算规则的简单的表达式解释引擎，你可以通过Map接口，或者JavaBean给出一个变量集合，能后通过表达式从这个集合中抽取变量，再通过表达式逻辑生成你需要的数据。2009年发布第一个版本，2011年发布最后一个版本后未再更新，所以没有纳入此次选型。

此外规则引擎如 Drools， urule， easy-rules 等不参与此次选型比较。相对比较成熟完善的脚本语言如Groovy，JavaScript等也不参与选型比较。这篇文章主要针对相对轻量简单的表达式引擎进行选型。

**3 技术栈选型评估**
-------------

选择表达式引擎，我们希望其社区支持情况良好、实现复杂度适中、执行速度快、安全并且简单易学。所以，**接下来将从社区支持情况、引入的大小和依赖、性能、安全性、使用案例和语法几个方面对几种表达式引擎进行比较评估。**

### **3.1 社区支持情况**

**社区支持情况可以辅助评估项目的健康度，有问题是不是能及时解决，项目是不是能持续演进等等**，下面列出了GitHub star，watch，fork，last commit等数据，可以作为参考，由于数据随着时间推移会产生变化，以下仅针对2023.10.29的数据进行分析。

![](/images/jueJin/ef21e0c66b714de.png)

由于 Spring 项目被广泛使用，而SpEl又是Spring的一个子项目，所以从各项数据来看SpEl的社区支持情况是最好的。下面先排除SpEl分析其他几个表达式引擎。

QLExpress，AviatorScript 和 MVEL 在国内使用比较多，这可能是他们star，watch，fork数较高的原因。说明这几个项目受欢迎度，受认可度，影响力应该较高。

从issues，pull requests数来分析，可以看到 MVEL，AviatorScript 和 QLExpress 高于其他脚本引擎，说明他们的用户需求和反馈较多，也可能意味着项目面临较多问题和挑战。

MVEL，JEXL，OGNL 均有较多贡献者参与。他们的社区协作、项目可持续性方面应该都比较不错。

**综合以上分析，除SpEl外，QLExpress，AviatorScript 和 MVEL 的社区支持情况都相对较好。**

### **3.2 引入大小和依赖**

**代码大小和依赖可以辅助评估代码的复杂性**，下面列出了各个Github仓库的代码大小，可以作为一个参考（实际并不完全准确反映其实现的复杂性）。

以下是2023.10.29的数据

![](/images/jueJin/3bb8d1d1ee2a44e.png)

JUEL，QLExpress代码大小最小，都在600多KB；其次是 OGNL 1MB多一点；AviatorScript，MVEL，JEXL 大小都在2MB左右；SpEl由于在 spring-framework 仓库中，上表中统计的是 spring-framework 的总量，单纯看 SpEl 的模块 spring-expression 的话，大小是1.3MB左右。但是其还依赖了 spring-core 和 spring-jcl，再含这两个的话，大小 7.4MB左右。

我们再结合各个项目的依赖来分析一下。

```diff
+- org.mvel:mvel2:jar:2.5.0.Final:compile
+- com.googlecode.aviator:aviator:jar:5.3.3:compile
+- com.alibaba:QLExpress:jar:3.3.1:compile
|  +- commons-beanutils:commons-beanutils:jar:1.8.2:compile
|  |  - (commons-logging:commons-logging:jar:1.1.1:compile - omitted for conflict with 1.2)
|  - commons-lang:commons-lang:jar:2.4:compile
+- org.codehaus.janino:janino:jar:3.1.10:compile
|  - org.codehaus.janino:commons-compiler:jar:3.1.10:compile
+- ognl:ognl:jar:3.4.2:compile
|  - org.javassist:javassist:jar:3.29.2-GA:compile
+- org.apache.commons:commons-jexl3:jar:3.3:compile
|  - commons-logging:commons-logging:jar:1.2:compile
+- org.springframework:spring-expression:jar:5.3.29:compile
|  - org.springframework:spring-core:jar:5.3.29:compile
|     - org.springframework:spring-jcl:jar:5.3.29:compile
+- de.odysseus.juel:juel-api:jar:2.2.7:compile
+- de.odysseus.juel:juel-impl:jar:2.2.7:compile
+- de.odysseus.juel:juel-spi:jar:2.2.7:compile
```

除了SpEl外，QLExpress，OGNL，JEXL也都有其他依赖。

如果考虑 commons-beanutils， commons-lang， commons-logging 三个依赖，QLExpress 引入的大小在 10MB左右。

如果考虑 javassist 依赖，OGNL 引入的大小是4MB多。

如果考虑 commons-logging 依赖，JEXL 引入的大小是2.5MB左右。

**综合来看，JUEL，AviatorScript，MVEL，JEXL 在引入大小和依赖方面要好于其他。**

### **3.3 性能**

**较好的性能意味着系统能够快速地响应用户的请求，减少等待时间，提升体验。**

性能方面主要通过 JMH 在字面量表达式、含有变量的表达式以及含有方法调用的表达式等使用场景对几个表达式引擎进行测试。

> JMH（Java Microbenchmark Harness），是用于代码微基准测试的工具套件，主要是基于方法层面的基准测试，精度可以达到纳秒级。该工具是由 Oracle 内部实现 JIT 的大牛们编写的，他们应该比任何人都了解 JIT 以及 JVM 对于基准测试的影响。

由于不同表达式引擎语法或特性稍有差别，下面测试中对于差异项会进行说明。

性能测试代码地址： [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhowiefh%2Fexpression-engine-benchmark "https://github.com/howiefh/expression-engine-benchmark")

#### **3.3.1 字面量表达式**

![](/images/jueJin/af0eb471971844f.png)

：`1000 + 100.0 * 99 - (600 - 3 * 15) / (((68 - 9) - 3) * 2 - 100) + 10000 % 7 * 71`

：`6.7 - 100 > 39.6 ? 5 == 5 ? 4 + 5 : 6 - 1 : !(100 % 3 - 39.0 < 27) ? 8 * 2 - 199 : 100 % 3`

说明：

由于QlExpress执行第2个表达式时报错，需要增加圆括号，实际执行的是`6.7 - 100 > 39.6 ? (5 == 5 ? 4 + 5 : 6 - 1) : (!(100 % 3 - 39.0 < 27) ? 8 * 2 - 199 : 100 % 3)`

结果分析:

可以明显看到 JEXL，JUEL，QlExpress这三个表达式引擎性能明显不如其他引擎。

SpEl 在执行第1个算数操作时表现出色，但是在执行第2个嵌套三元操作时明显不如AviatorScript，MVEL，OGNL引擎。

此轮测试中 AviatorScript，OGNL，MVEL表现出色。AviatorScript，OGNL 执行两个表达式表现都比较出色，其中AviatorScript略好于OGNL。 MVEL 在执行第1个算数操作时表现最出色，但是在执行第2个嵌套三元操作时慢于AviatorScript，OGNL引擎。

#### **3.3.2 含有变量的表达式**

![](/images/jueJin/b00f3dccfeba461.png)

：`pi * d + b - (1000 - d * b / pi) / (pi + 99 - i * d) - i * pi * d / b`

：`piDecimal * dDecimal + bDecimal - (1000 - dDecimal * bDecimal / piDecimal) / (piDecimal + 99 - iDecimal * dDecimal) - iDecimal * piDecimal * dDecimal / bDecimal`

：`i * pi + (d * b - 199) / (1 - d * pi) - (2 + 100 - i / pi) % 99 == i * pi + (d * b - 199) / (1 - d * pi) - (2 + 100 - i / pi) % 99`

：`(clientVersion == '1.9.0' || clientVersion == '1.9.1' || clientVersion == '1.9.2') && deviceType == 'Xiaomi' && weight >= 4 && osVersion == 'Android 9.0' && osType == 'Android' && clientIp != null && requestTime <= now&& customer.grade > 1 && customer.age > 18`

说明：

•由于不同的表达式引擎在执行第2个表达式时底层实现除法时有所差别，MVEL，AviatorScript，JEXL 执行`decimal.divide(otherDecimal, java.math.MathContext.DECIMAL128)`，其他实际执行的是`decimal.divide(otherDecimal, scale, roundingMode)`，只是参数略有不同，分析时分组进行。

•由于QlExpress执行第3个表达式时报错，不支持非整型mod操作，需要增加类型转换，实际执行的是`i * pi + (d * b - 199) / (1 - d * pi) - (int)(2 + 100 - i / pi) % 99 == i * pi + (d * b - 199) / (1 - d * pi) - (int)(2 + 100 - i / pi) % 99`

•由于AviatorScript执行第4个表达式时报错，null的字面量是nil，实际执行的是`(clientVersion == '1.9.0' || clientVersion == '1.9.1' || clientVersion == '1.9.2') && deviceType == 'Xiaomi' && weight >= 4 && osVersion == 'Android 9.0' && osType == 'Android' && clientIp != nil && requestTime <= now&& customer.grade > 1 && customer.age > 18`

结果分析：

第1个基本类型包装类的算术计算 SpEl 最优。其次是AviatorScript，MVEL，OGNL。而JEXL，JUEL，QlExpress则不如其他引擎。

第2个BigDecimal类型的算术计算。由于底层实现不同，分为两组。第1组 MVEL、AviatorScript和JEXL，AviatorScript 优于 MVEL 优于 JEXL。第2组 JUEL，QlExpress，OGNL和SpEl，性能由优到差依次是 OGNL，SpEl，JUEL，QlExpress。并且第1组由于精度更高，性能明显都差于第2组。

第3个含有基本类型包装类算数计算的布尔表达式。SpEl 最优，AviatorScript 次之，接下来依次是 OGNL, MVEL，JUEL，JEXL，QlExpress。

第4个含有字符串比较的布尔表达式。AviatorScript，MVEL，JEXL，OGNL 性能优于 JUEL，QlExpress，SpEl。

#### **3.3.3 含有方法调用的表达式**

![](/images/jueJin/f6b1468cd7ee4ee.png)

：`new java.util.Date()`

：`s.substring(b.d)`

：`s.substring(b.d).substring(a, b.c.e)`

说明：

•由于 JUEL 执行`new java.util.Date()`时报错，不支持new实例，本轮实际执行的是自定义函数`fn:date()`

•由于 AviatorScript 执行`s.substring`时报错，需使用其提供的内部函数，本轮实际执行的是其内部函数`string.substring`

结果分析：

此轮测试中 SpEl 的表现最优，甚至比Janino还要快。MVEL，AviatorScript次之，在执行构造方法时MVEL要好于AviatorScript。JEXL 表现也比较出色。QlExpress，JUEL，OGNL这三个表达式引擎则不如其他引擎。

#### **3.3.4 总结**

**综合以上测试结果，AviatorScript，SpEl，MVEL，OGNL性能表现相对较好。**

**AviatorScript 性能相对较好，表现均衡，但其语法相较其他引擎跟Java的差异略大。**

**SpEl 除了在个别场景下性能较差，大部分场景表现非常出色，尤其是在字面量和含有变量的算数计算及方法调用场景下。**

**MVEL 性能表现相对均衡，含有变量的算术计算略差于AviatorScript，其在字面量算术计算，方法调用场景下表现都非常出色。**

**OGNL 性能表现也相对均衡，但方法调用场景下表现不佳。**

### **3.4 安全**

**引入表达式引擎，应该重视系统的安全性和可靠性，比如要防止在不可信环境中被注入恶意脚本，越权执行某些系统命令或使应用停止服务等。** 安全性方面主要通过漏洞披露、安全指南和配置比较几种表达式引擎。

#### **3.4.1 漏洞**

首先在[cve.mitre.org/cve/search\_…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcve%2Fsearch_cve_list.html "https://cve.mitre.org/cve/search_cve_list.html")通过关键字搜索的方式粗略了解一下不同表达式引擎被公开的漏洞。这种方式可能不是非常的准确，由于不同表达式引擎的使用场景、使用方式、关注度的不同可能导致被公开的漏洞存在差异。比如我们所熟悉的 OGNL、SpEl 的关键字出现在漏洞中的频率明显高于其他表达式引擎。OGNL 在[MyBatis](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmybatis%2Fmybatis-3 "https://github.com/mybatis/mybatis-3")和[Struts](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fstruts "https://github.com/apache/struts")中被使用，SpEl则在[Spring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspring-projects%2Fspring-framework "https://github.com/spring-projects/spring-framework")中被广泛使用，这两个表达式引擎会被大部分项目间接使用，直接将用户输入作为表达式的一部分执行，很容易导致出现漏洞。

我们**可以从这些公布的漏洞中了解不同表达式引擎可能存在的安全隐患及其修复情况，在使用过程中尽可能避免出现类似问题。**

**此外，不推荐将表达式执行直接开放到不可信的环境，如果确实需要，应该详细了解选择的表达式引擎，是否提供了必要的设置选项可以避免某些安全隐患。**

名称

关键字链接

漏洞数

AviatorScript

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DAviatorScript "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=AviatorScript")

1

MVEL

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DMVEL "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=MVEL")

4

OGNL

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DOGNL "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=OGNL")

28

SpEl

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DSpEl "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=SpEl")

10

QLExpress

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DQLExpress "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=QLExpress")

0

JEXL

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DJEXL "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=JEXL")

3

JUEL

[cve.mitre.org/cgi-bin/cve…](https://link.juejin.cn?target=https%3A%2F%2Fcve.mitre.org%2Fcgi-bin%2Fcvekey.cgi%3Fkeyword%3DJUEL "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=JUEL")

1

#### **3.4.2 安全设置**

AviatorScript，QLExpress，JEXL均从不同程度提供了一些安全选项设置。

**AviatorScript**

•设置白名单

```vbscript
// 在new语句和静态方法调用中允许使用的类白名单 默认 null 表示无限制
AviatorEvaluator.setOption(Options.ALLOWED_CLASS_SET, Sets.newHashSet(List.class));
// 在new语句和静态方法调用中允许使用的类白名单 包含子类 默认 null 表示无限制
AviatorEvaluator.setOption(Options.ASSIGNABLE_ALLOWED_CLASS_SET, Sets.newHashSet(List.class));
```

•防止死循环

```scss
// 循环最大次数 默认 0 表示无限制
AviatorEvaluator.setOption(Options.MAX_LOOP_COUNT, 10000);
```

•特性开关

```scss
// 关闭某些特性
AviatorEvaluator.getInstance().disableFeature(Feature.Module);
AviatorEvaluator.getInstance().disableFeature(Feature.NewInstance);
// 只开启需要的特性
AviatorEvaluator.setOption(Options.FEATURE_SET, Feature.asSet(Feature.If));
```

**QLExpress**

•开启沙箱模式

```arduino
QLExpressRunStrategy.setSandBoxMode(true);
```

在沙箱模式中，不可以：

◦import Java 类

◦显式引用 Java 类，比如`String a = 'mmm'`

◦取 Java 类中的字段：`a = new Integer(11); a.value`

◦调用 Java 类中的方法：`Math.abs(12)`

可以：

◦使用 QLExpress 的自定义操作符/宏/函数，以此实现与应用的受控交互

◦使用. 操作符获取 Map 的 key 对应的 value，比如 a 在应用传入的表达式中是一个 Map，那么可以通过 a.b 获取

◦所有不涉及应用 Java 类的操作

•设置白名单

```arduino
// 设置编译期白名单
QLExpressRunStrategy.setCompileWhiteCheckerList(Arrays.asList(
// 精确设置
CheckerFactory.must(Date.class),
// 子类设置
CheckerFactory.assignable(List.class)
));
// 设置运行时白名单// 必须将该选项设置为 true
QLExpressRunStrategy.setForbidInvokeSecurityRiskMethods(true);
// 有白名单设置时, 则黑名单失效
QLExpressRunStrategy.addSecureMethod(RiskBean.class, "secureMethod");
```

•设置黑名单

```arduino
// 必须将该选项设置为 true
QLExpressRunStrategy.setForbidInvokeSecurityRiskMethods(true);
// 这里不区分静态方法与成员方法, 写法一致
// 不支持重载, riskMethod 的所有重载方法都会被禁止
QLExpressRunStrategy.addSecurityRiskMethod(RiskBean.class, "riskMethod");
```

QLExpess 目前默认添加的黑名单有：

◦java.lang.System.exit

◦java.lang.Runtime.exec

◦java.lang.ProcessBuilder.start

◦java.lang.reflect.Method.invoke

◦java.lang.reflect.Class.forName

◦java.lang.reflect.ClassLoader.loadClass

◦java.lang.reflect.ClassLoader.findClass

•防止死循环

```ini
//可通过timeoutMillis参数设置脚本的运行超时时间:1000ms
Object r = runner.execute(express, context, null, true, false, 1000);
```

**JEXL**

•使用沙箱

```scss
// 使用中应该通过JexlSandbox的重载构造方法进行配置
new JexlBuilder().sandbox(new JexlSandbox()).create();
```

•设置白名单权限

```scss
new JexlBuilder().permissions(JexlPermissions.RESTRICTED.compose("com.jd.*")).create();
```

•特性开关

```scss
// 关闭循环、new 实例，import等特性
new JexlBuilder().features(new JexlFeatures().loops(false).newInstance(false).importPragma(false)).create();
```

### **3.5 使用案例**

从业界使用情况可以了解不同表达式引擎的可行性、生态和整合性，以及最佳实践，进而借鉴。从下表可以看到AviatorScript，MVEL，QLExpress在国内业务线均有使用案例，有些企业也有文章输出，我们可以借鉴使用。

名称

案例

AviatorScript

[美团酒旅实时数据规则引擎应用实践](https://link.juejin.cn?target=https%3A%2F%2Ftech.meituan.com%2F2018%2F04%2F19%2Fhb-rt-operation.html "https://tech.meituan.com/2018/04/19/hb-rt-operation.html")，liteflow，京东星链

MVEL

[闲鱼亿级商品库中的秒级实时选品](https://link.juejin.cn?target=https%3A%2F%2Fwww.infoq.cn%2Farticle%2Fyglagc7z0t-stzx11foe "https://www.infoq.cn/article/yglagc7z0t-stzx11foe")，easy-rules，compileflow，京东星链

OGNL

MyBatis，Struts

SpEl

Spring

QLExpress

compileflow，liteflow，阿里内部业务线

JEXL

cat，Jelly

JUEL

JSP

Janino

Apache Spark、Apache Flink、Groovy

### **3.6 语法**

易于理解和使用的语法可以提高开发效率，并降低学习成本。接下来从类型、操作符、控制语句、集合、方法定义几方面比较一下不同表达式引擎的语法设计。

类型方面，AviatorScript 设计了特有的类型，使用时需要注意其类型转换的优先级long->bigint->decimal->double。AviatorScript、MVEL、OGNL、JEXL都支持BigInteger、BigDecimal字面量，这意味着进行精确计算时可以使用字面量，将更方便，如`10.24B`就表示一个BigDecimal字面量（AviatorScript中BigDecimal字面量后缀是M）。此外AviatorScript、QLExpress还支持高精度计算的设置项。

操作符方面，QLExpress支持替换、自定义操作符及添加操作符别名，这可能有助于简化复杂表达式或使表达式更加直观，不过添加预置函数应该可以达到差不多的效果。AviatorScript也支持自定义部分操作符，不过支持数量相当有限。AviatorScript、SpEl、JEXL支持正则匹配操作符。

控制语句方面，除OGNL、SpEl、JUEL不支持控制语句外，其他都支持，不过需要注意 AviatorScript 的 `else if` 语法有些特殊写作 `elsif`，foreach语句跟Java也有所不同。

集合方面，除JUEL外其他都提供了快捷定义的方式，只不过语法不同。

函数定义方面，SpEl、JUEL均不支持，OGNL支持伪lambda定义，其他都支持定义函数。QLExpress不支持定义lambda。

综合来看，和Java语法都或多或少存在一些差异。**AviatorScript设计了自己特有的一些语法，使用的话需要熟悉一下。QLExpress支持自定义操作符，可以使表达式看起来更直观。MVEL、JEXL的语法可能更接近Java，让人更容易接受一些。OGNL、SpEl、JUEL的语法更简单一些，不支持控制语句和函数定义，当然也可以通过预置一些函数变通解决一些较复杂的问题。**

**4 选型建议**
----------

社区方面，SpEl无疑是最活跃的。AviatorScript，QLExpress，MVEL在国内很受欢迎，QLExpress 有阿里背书。

代码大小和依赖方面，AviatorScript，MVEL 依赖少，并且代码大小也偏小。

性能方面，如果你使用表达式引擎执行字面量算术计算或方法调用偏多可以选用SpEl，MVEL。如果希望整体性能表现较好可以选用 AviatorScript。

安全方面，如果想自定义安全选项，可以考虑 AviatorScript，QLExpress和JEXL。

使用案例方面，AviatorScript，MVEL，QLExpress在国内都有实际使用案例可循。

语法方面，可能存在一些主观因素，仅供参考，个人觉得MVEL、JEXL的语法设计使用起来会更容易一些。

通过对以上几个方面的评估和分析，希望可以帮助团队基于自身情况及偏好选择最适合自己项目的Java表达式引擎。

**5 参考资料**
----------

**QLExpress：** [github.com/alibaba/QLE…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FQLExpress "https://github.com/alibaba/QLExpress")﻿

**AviatorScript：** [github.com/killme2008/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkillme2008%2Faviatorscript "https://github.com/killme2008/aviatorscript")﻿

**MVEL：** [github.com/mvel/mvel](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmvel%2Fmvel "https://github.com/mvel/mvel")﻿

**OGNL：** [github.com/orphan-oss/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Forphan-oss%2Fognl "https://github.com/orphan-oss/ognl")﻿

**SpEl：** [github.com/spring-proj…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspring-projects%2Fspring-framework "https://github.com/spring-projects/spring-framework")﻿

**Janino：** [github.com/janino-comp…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjanino-compiler%2Fjanino "https://github.com/janino-compiler/janino")﻿

**JUEL：** [github.com/beckchr/jue…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbeckchr%2Fjuel "https://github.com/beckchr/juel")﻿

**JEXL：** [github.com/apache/comm…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fcommons-jexl "https://github.com/apache/commons-jexl")﻿

**Fel：** [github.com/dbcxy/fast-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdbcxy%2Ffast-el "https://github.com/dbcxy/fast-el")﻿

**ik-expression：** [code.google.com/archive/p/i…](https://link.juejin.cn?target=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Fik-expression%2F "https://code.google.com/archive/p/ik-expression/")﻿

**JSEL：** [code.google.com/archive/p/l…](https://link.juejin.cn?target=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Flite%2Fwikis%2FJSEL.wiki "https://code.google.com/archive/p/lite/wikis/JSEL.wiki")﻿

**JMH：** [www.cnblogs.com/wupeixuan/p…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fwupeixuan%2Fp%2F13091381.html "https://www.cnblogs.com/wupeixuan/p/13091381.html")