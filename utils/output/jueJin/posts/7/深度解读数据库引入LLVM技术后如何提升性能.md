---
author: "华为云开发者联盟"
title: "深度解读数据库引入LLVM技术后如何提升性能"
date: 2024-06-12
description: "GaussDB作为企业级的数据库，经过了多年的技术发展，具备丰富的技术特性，使用LLVM技术后提升了系统的查询性能，使得开发者在OLAP和OLTP多场景中均受益。"
tags: ["数据库","后端","LLVM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:0,views:304,"
---
> GaussDB作为企业级的数据库，经过了多年的技术发展，具备丰富的技术特性，使用LLVM技术后提升了系统的查询性能，使得开发者在OLAP和OLTP多场景中均受益。

Hi，别急！让技术触达每一个角落，赋能更多的人，GaussTech第3期《LLVM技术在GaussDB等数据库中的应用》，不仅带来满满的技术干货，还推出【**分享集赞回帖赢好礼**】活动，参与就能赢好礼，[点击链接](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fforum%2Fthread-0249152272038530018-1-1.html "https://bbs.huaweicloud.com/forum/thread-0249152272038530018-1-1.html")参与！

万物互联的态势下，数据量的激增使得“如何提升数据处理性能”成为各家数据库共同面临的挑战。作为编译优化技术的代表，基于LLVM的CodeGen技术，能为每个查询生成定制的机器码替代原本的通用函数，减少实际查询时冗余的条件逻辑判断、虚函数调用并提高数据局域性，从而达到提升查询整体性能的目的，成为数据库性能优化的一项重要技术。

LLVM能在分析类场景中给用户带来较大的收益，也能在特定的交易性场景中给用户带来一定的收益。接下来详细解读一下LLVM技术在GaussDB中的应用吧。

LLVM和数据库
========

LLVM（Low Level Virtual Machine）是一款流行的开源编译器框架，是CodeGen（生成源代码的工具）技术的事实标准，被广泛运用于数据库（如KES，AnalyticDB，GaussDB）、大数据（如Spark）、AI平台（如tensorflow）等领域，用于提升数据处理的性能。

在没有引入LLVM这类CodeGen技术之前，数据库会使用通用的处理逻辑来处理数据，但通用逻辑“笨重”（递归、封装、类型判断转换）的代码实现方式，存在虚函数开销、缓存使用率低下、对指令集不敏感等性能短板。

引入LLVM之后，可以为具体的查询生成定制化的机器码，并尽可能的将数据存储在CPU的寄存器中进一步加快计算的速度：

*   LLVM天然支持JIT，该技术可以解决条件逻辑冗余的问题；
*   减少大量的虚函数调用；
*   将数据尽可能的从内存加载到Cache上；
*   LLVM做了很多自动矢量化的工作；

比如，下图左侧是通用代码，右侧是CodeGen之后的代码。CodeGen根据实际情况消除了不必要的循环和判断。

![](/images/jueJin/06a5acc38d0a454.png)图1 通用性处理逻辑和LLVM代码示意

另外，LLVM技术可以有不同的实现粒度。比如：可使用LLVM加速表达式计算，或再进一步，将多个算子融合编译成定制的机器码，或将自定义函数、存储过程等编译成定制的机器码。

![](/images/jueJin/1e6f70ee46c2466.png)图2 LLVM的实现粒度

数据库在执行引擎中，运用LLVM技术提升SQL的执行速度。如下图所示：

![](/images/jueJin/ccc8fa0999fc452.png)图3 LLVM技术运用于执行引擎

LLVM适用场景
========

**LLVM对所有类型的SQL都会有收益吗？**

答案是否定的。

因为执行实时编译本身需要耗费一定的时间（简单表达式能做到毫秒级，复杂情况在百毫秒级），对于查询本身耗时较少的场景，加入LLVM反而会导致性能劣化。

因此，目前LLVM在OLAP/HTAP分析型业务场景中收益较大，有着广泛应用，而在OLTP交易型业务场景中，则相对没有那么广泛。

**LLVM在OLTP中就一定没有收益吗？**

答案同样是否定的。

找对场景，一样有收益。比如根据ISPRAS 2017年发表的实验结果  jit-compiling sql queries in postgresql using llvm可知：pgbench测试下，OLTP场景中简单的查询加上JIT（Just-in-time及时编译，LLVM天然支持）扩展没有带来性能的提升，甚至将TPS（事务数/秒）从21.8降低到了7.8。

但是在Prepared query（plan cached）的情况下，叠加 JIT技术之后将TPS从20.7提升到了43，性能上有了两倍的提升。

GaussDB中的LLVM
=============

**1\. LLVM在华为应用于数据库的时间线**

华为云数据库在LLVM上的研究还是非常超前的。早在**2015**年，华为就作为某流行开源数据库社区的全球开发者大会的赞助商，在会上发表的动态编译（Go Faster with Native Compilation）演讲，引起了很大的反响。

当时社区领袖Josh Burkus在其博客里面，用一节篇幅专门详细介绍了华为动态编译的议题。

![](/images/jueJin/9d3d345666284f6.png)图5 2015年社区领袖Josh Burkus介绍华为的动态编译议题

在**2017**年，华为在面向OLAP场景的数据库内核中突破了LLVM动态编译技术，并在多个运营商、金融证券的POC项目中帮助客户提升数据处理性能，同时，在软件开发过程中充分模块化、通用化接口设计，将LLVM同年落地到面向OLTP的数据库设计中。

目前，GaussDB数据库对于LLVM也在不断的演进开发。

**2\. GaussDB LLVM实现简析**

GaussDB针对向量化引擎（主要用于分析场景）、行存（主要用于交易场景）都实现了CodeGen。如下图所示，从代码模块层次来看：

1.  GaussDB通过API接口层封装处理了LLVM环境、资源、基本元素等。
    
2.  GaussDB在CodeGen层调用API接口进行了不同粒度的实现。
    
3.  GaussDB在执行引擎侧根据情况使用CodeGen技术进行性能优化。
    

![](/images/jueJin/496b18499ec747d.png)

图6 GaussDB LLVM 模块层次图

GaussDB启动后会进行LLVM的初始化工作，检查CPU对CodeGen的支持情况，并进行环境初始化。

在执行启动阶段，以表达式为例，程序会判断当前表达式是否可JIT，是的话，则会进行IR函数的生成和生成定制机器码，及原本表达式执行函数的入口替代工作。

在实际执行过程中，运行处理函数（该函数已经在上一阶段进行了入口替代）进行实际执行工作。

在执行结束后的清理阶段，释放LLVM相关资源。

![](/images/jueJin/420f74f9e91b465.png)图7 GaussDB CodeGen编译执行流程简图

GaussDB使用了阈值codegen\_cost\_threshold来估算当前查询使用LLVM技术是否能带来收益。如果处理数据的规模大于该阈值后，才会继续使用LLVM技术进行相关处理。该阈值代表行数，也可以理解成处理数据的规模，默认值为100000行，可以调节。

在OLAP场景中，GaussDB在判断是否能够对于一个算子进行CodeGen后（如：数据类型，算子类型判断等），开始生成对应的IR bytecode片段，之后MCJIT模块会调用生成的LLVM Module单元进行执行。

在OLTP场景中，GaussDB则会在Plan Cache场景下结合CodeGen框架，通过缓存机器码的方式，节省下编译生成中间语言IR Func以及优化成机器码的时间，整个过程是异步的。因此，在大量重复查询的场景下，后续的查询也会因为LLVM技术而受益。

另外，为了避免行数估计错误而选择CodeGen导致性能劣化，GaussDB还研发了当前业界独有的异步编译功能，即在查询语句确定要使用CodeGen的时候，将编译工作转交给后台线程，工作线程在JIT函数编译完成前继续使用原始执行逻辑执行，编译完成后，再替换成JIT函数执行。

**3\. GaussDB LLVM支持加速的场景**

**支持LLVM的表达式：**

![](/images/jueJin/8c638a0c14ec445.png)

行存表达式计算支持的数据类型不受限制。

在向量化执行引擎中，仅当表达式出现在Scan节点的filter、Hash Join节点中的complicate hash condition，hash join filter，hash join target, Nested Loop节点中的filter，join filter, Merge Join节点的merge join filter, merge join target, Group节点中的filter表达式时，才会考虑是否使用LLVM动态编译优化。

在行存执行引擎中，除一次性的表达式计算外，会考虑为所有算子的filter和Targetlist表达式都使用LLVM动态编译优化。

**支持LLVM的算子：**

Join ：HashJoin（仅向量化执行引擎支持）

Agg ：HashAgg

Sort（仅向量化执行引擎支持）

其中，HashJoin算子仅支持Hash Inner Join，对应的hash cond仅支持int4、bigint、bpchar类型的比较；HashAgg算子仅支持针对bigint、numeric类型的sum及avg操作，且group by语句仅支持int4、bigint、bpchar，text，varchar，timestamp类型操作，同时支持count(\*)聚集操作。Sort算子仅支持对int4，bigint，numeric，bpchar，text，varchar数据类型的比较操作。除此之外，无法使用LLVM动态编译优化，具体可通过explain performance工具进行显示。

**4\. GaussDB LLVM使用建议**

**GUC参数：**

enable\_codegen：控制LLVM特性的打开和关闭。目前数据库内核侧默认打开。

codegen\_cost\_threshold：使用处理行数控制是否开启codegen，默认为10000。10000是通过实验验证得出的优化值，不建议将此值设置的过低。

另外，在开启LLVM特性的前提下，建议在允许的条件下尽可能设置较大的work\_mem，如果出现大量下盘，则建议关闭LLVM动态编译优化。用户可通过analysis\_options为on(LLVM\_COMPILE)，执行对应查询语句，在User Define Profiling中就可以看到LLVM的编译时间。结合此数据，可对codegen\_cost\_threshold进一步调整以获取更好的查询性能。

**5\. GaussDB LLVM性能表现**

GaussDB实验室分别就codegen打开和关闭进行了TPCH性能测试。

![](/images/jueJin/ff3fdf0d9448408.png)

表1 测试环境

测试结果显示，打开codegen时，带有qual的SQL，查询性能都有明显提升，且提升比例与qual在整个SQL中的占比相关，像Q6、Q12、Q19等qual占比较高的查询，性能提升也较多。

![](/images/jueJin/3a8ae1f303a9464.png)表2 TPCH 部分Query的测试结果

TPCC的性能提升并没有TPCH那么多，但据实验室数据，打开codegen后，tpmC提升了约7%。

总结
==

LLVM被广泛运用于数据库、大数据、AI等领域。在数据库领域，多家商业数据库和开源数据库都应用其加速数据库处理。GaussDB作为企业级的数据库，经过了多年的技术发展，具备丰富的技术特性，使用该技术后提升了系统的查询性能，使得客户在OLAP和OLTP多场景中均受益。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")