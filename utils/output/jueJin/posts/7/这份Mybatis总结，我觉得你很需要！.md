---
author: "Java3y"
title: "这份Mybatis总结，我觉得你很需要！"
date: 2020-04-24
description: "Mybatis应该是国内用得最多的「数据访问层」框架了，我看了我司的好几个系统，基本都是用Mybatis的。 实话实说，我对Mybatis没有很深入的了解，也仅仅是处于「会用」的阶段上。日常的要加张表，加个字段就是写写DAOMapper。 为什么没有深入去研究Mybatis的…"
tags: ["Java","MyBatis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:96,comments:0,collects:163,views:12653,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

Mybatis应该是国内用得最多的「数据访问层」框架了，我看了我司的好几个系统，基本都是用Mybatis的。

实话实说，我对Mybatis没有很深入的了解，也仅仅是处于「会用」的阶段上。日常的要加张表，加个字段就是写写`DAO/Mapper`。

![](/images/jueJin/171a9cd527a0d1a.png)

为什么没有深入去研究Mybatis的原因很可能是**面试其实问得不是特别多**，起码我在校招的时候面了很多家公司，也没怎么问我Mybatis的。

Mybatis如果仅仅是要「会用」，入门是非常快的，感觉两三天就可以搞好了。

![](/images/jueJin/171a9cd52a34a66.png)

认识Mybatis
---------

在前阵子已经总结过了JDBC了，无论是什么的ORM框架（Object Relation Mapping）其实都是在JDBC上封装了一层，底层用的都是JDBC的代码。

众所周知，直接写JDBC的代码的效率是最高的。那为什么要用ORM框架呢？？

回想起我第一次实习看到公司代码时的感受：「**卧槽，代码怎么这么多啊**。这为什么有这么多的包啊，一直点开都有」

![生成结果](/images/jueJin/171a9cd5388986f.png)

如果纯用JDBC，只要项目是有点规模的，那我们的项目里代码量一定会很多。最重要的是，很多的代码都是**重复**的。如果我们的项目里边积累了这么多的重复代码，最致命的问题就是「**不好维护**」

于是就有了这么多的ORM框架，至于用哪一个ORM框架，我觉得没有对错之分，公司用哪个你就用哪个就好了。

毕竟**技术都是服务于业务**，公司在选型的时候，选了某ORM框架，肯定也有当时的一个考虑。等到真的是由于使用了某ORM框架导致无法承接掉业务的时，那自然而然就会有优化。

在知乎上有很多「Mybatis与Hibernate/SpringData JPA」的对比，有兴趣的小伙伴可以去学习学习，看着大佬们的「回答/讨论」还是能学到不少的东西的。

![](/images/jueJin/171a9cd52b8b31a.png)

Mybatis作为一个ORM框架，在市面上非常受欢迎，只要有JDBC基础，学会用很简单。

**不BB了，开始吧**。

![](/images/jueJin/171a9cd53066784.png)

入门
--

使用Mybatis的步骤大致如下：

![](/images/jueJin/171a9cd52dafd7f.png)

首先我们需要配Mybatis的一份配置文件，这份配置文件主要配置**数据库相关**的信息：

![](/images/jueJin/171a9cd55af4351.png)

随后，我们编写一个工具类来获取sqlSession，这个SQLSession相当于JDBC的Connection对象

![](/images/jueJin/171a9cd55d332b5.png)

然后编写我们的映射文件，这个映射文件实际上就是对象与数据库的映射关系：

![](/images/jueJin/171a9cd55d192f3.png)

我们在映射文件上使用`<insert>`标签来实现插入：

![](/images/jueJin/171a9cd581abdf2.png)

然后调用sqlSession来实现插入即可：

![](/images/jueJin/171a9cd56316044.png)

效果如下：

![](/images/jueJin/171a9cd5896c372.png)

看到这里，会不会觉得好像有点复杂？其实这几个步骤都很自然而然的：

*   要操作数据库，总会有数据库相关的配置吧。（这块实际上就写一次，第一次写完了就不用再写了）
*   要操作数据库，得告诉程序怎么操作吧，所以有映射文件（可以是`XML`的映射文件，也可以是注解的方式，反正我们得开个口子去告诉程序怎么执行）
*   然后我们操作SQLSession去执行命令（这块后面我们可以把SQLSession直接屏蔽掉）

所以，用Mybatis实际上就是写`映射文件/注解`去告诉程序怎么操作，而`映射文件/注解`其实就是写SQL，对我们来说并不是难事。

因此，Mybatis入门是真的简单。

![](/images/jueJin/171a9cd58bfab03.png)

Mybatis细节
---------

#### 动态SQL

动态SQL实际上就是使用Mybatis给我们提供的`if/foreach`之类的标签去判断传递进来的参数有没有值，如果有值我们就拼接参数，如果没有，我们就不拼接。

![](/images/jueJin/171a9cd59685641.png)

#### 缓存

了解Mybatis的一级缓存和二级缓存是什么意思，Mybatis的缓存实现可以用`ehcache`来管理。

如果某些数据查询量大而且不怎么修改的，我们可以考虑使用`ehcache`来对这部分的数据进行缓存，减少数据库的压力。

![](/images/jueJin/171a9cd59e16acf.png)

#### Mapper代理

在最开头的例子我们看到我们使用Mybatis在开发中也不见得简单很多，因为有`SQLSession`这一块还是需要我们手动去编写。

我们可以使用Mapper代理的方式屏蔽掉`SQLSession`这块的代码，开发只要写一个`接口`+一个`Mapper.xml(或者注解)`就足够了。

那是怎么屏蔽的呢？依靠的是动态代理。为什么可以依靠动态代理来实现呢？因为我们Mapper代理是需要依赖「规则」的，有了「规则」我们就可以通过「反射」去简化我们的代码了。

![生成结果](/images/jueJin/171a9cd5a731068.png)

#### 逆向工程

通过Mapper代理我们已经可以实现「一个接口+一个Mapper映射文件(注解)」就可以开发我们的程序了。

而又因为在工作中，CRUD是避免不了的，几乎每增加一张表，都需要有「**最基本**」的CRUD。

于是程序员们又偷懒了，连「**最基本**」的CRUD都不想自己写了，于是就有了逆向工程。

我们看一下逆向工程的配置就差不多能看懂是干啥的了：

![](/images/jueJin/171a9cd5a897588.png)

通过表的结构，生成我们自己的JavaBean以及对应的Mapper接口和Mapper映射文件。

![](/images/jueJin/16219bf508969d5.png)

![](/images/jueJin/171a9cd5af40939.png)

#### Mybatis-plus

Mybatis-plus又是程序员偷懒造出的轮子（狗头

这款插件说实话我没用过，看了一下官网，大致就是：简单的CRUD，我连XML都不需要了，API直接帮我们内置了对应的CRUD方法。

有兴趣的同学去学学，都是能提高开发效率的工具。

[mp.baomidou.com/](https://link.juejin.cn?target=https%3A%2F%2Fmp.baomidou.com%2F "https://mp.baomidou.com/")

![](/images/jueJin/171a9cd5b0ce289.png)

放干货
---

现在已经工作有一段时间了，为什么还来写`Mybatis`呢，原因有以下几个：

*   我是一个对**排版**有追求的人，如果早期关注我的同学可能会发现，我的GitHub、文章导航的`read.me`会经常更换。现在的[GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")导航也不合我心意了（太长了），并且早期的文章，说实话排版也不太行，我决定重新搞一波。
*   我的文章会分发好几个平台，但文章发完了可能就没人看了，并且图床很可能因为平台的防盗链就挂掉了。又因为有很多的读者问我：”**你能不能把你的文章转成PDF啊**？“
*   我写过很多系列级的文章，这些文章就几乎不会有太大的改动了，就非常适合把它们给”**持久化**“。

基于上面的原因，我决定把我的系列文章汇总成一个`PDF/HTML/WORD/epub`文档。说实话，打造这么一个文档**花了我不少的时间**。为了防止**白嫖**，关注我的公众号回复「**888**」即可获取。

**Mybatis电子书，有兴趣的同学可以浏览一波。共有「92」页**

![](/images/jueJin/171a9cd5c1ba251.png)

文档的内容**均为手打**，有任何的不懂都可以直接**来问我**（公众号有我的联系方式）。

### :coffee: 各类知识点总结

> 下面的文章都有对应的**原创精美**PDF，在持续更新中，可以来找我催更~

*   [92页的Mybatis](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F0_zTBooRV4RTWQa8VOwiWg "https://mp.weixin.qq.com/s/0_zTBooRV4RTWQa8VOwiWg")
*   [129页的多线程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fr7IrmvBxG5W0hswfcgFjcQ "https://mp.weixin.qq.com/s/r7IrmvBxG5W0hswfcgFjcQ")
*   [141页的Servlet](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486798%26idx%3D1%26sn%3Dce900e97a495ffd681cd0ad9b78aa5ca%26chksm%3Debd74c4fdca0c559d0a32a3f3ddb3f579d3a16b47f70234c46ac2e5df315e7df90f93d1715b9%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486798&idx=1&sn=ce900e97a495ffd681cd0ad9b78aa5ca&chksm=ebd74c4fdca0c559d0a32a3f3ddb3f579d3a16b47f70234c46ac2e5df315e7df90f93d1715b9&token=1109491988&lang=zh_CN#rd")
*   [158页的JSP](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486854%26idx%3D1%26sn%3Dfd77a6225b898b69c4f0e1a7e66cf105%26chksm%3Debd74c87dca0c5910a923a443ea6f694dd554b68df8cc00506570555b9cf7718a2ef2a058754%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486854&idx=1&sn=fd77a6225b898b69c4f0e1a7e66cf105&chksm=ebd74c87dca0c5910a923a443ea6f694dd554b68df8cc00506570555b9cf7718a2ef2a058754&token=1109491988&lang=zh_CN#rd")
*   [76页的集合](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486873%26idx%3D1%26sn%3Dce0752f481336ffba9b8f44265b2550e%26chksm%3Debd74c98dca0c58ee04162d7e5d07fd36c8ec1b32460a8a2396168a9fc5885a208810f0916f2%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486873&idx=1&sn=ce0752f481336ffba9b8f44265b2550e&chksm=ebd74c98dca0c58ee04162d7e5d07fd36c8ec1b32460a8a2396168a9fc5885a208810f0916f2&token=1109491988&lang=zh_CN#rd")
*   [64页的JDBC](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486905%26idx%3D1%26sn%3D67fcd0558cfbdf6cd36de98cbd93afaf%26chksm%3Debd74cb8dca0c5ae052e6d216ed13458a9a17fa1b0f245bf740379b1d4b04b4e55fcbfb5adb4%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486905&idx=1&sn=67fcd0558cfbdf6cd36de98cbd93afaf&chksm=ebd74cb8dca0c5ae052e6d216ed13458a9a17fa1b0f245bf740379b1d4b04b4e55fcbfb5adb4&token=1109491988&lang=zh_CN#rd")
*   [105页的数据结构和算法](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486831%26idx%3D1%26sn%3D0d4b05e10d66eda1129f43348a8e3952%26chksm%3Debd74c6edca0c5786a5109a131d0501ef6bd02077e5ce1ad75d906cf3612a320d1098163e2d0%26token%3D1109491988%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486831&idx=1&sn=0d4b05e10d66eda1129f43348a8e3952&chksm=ebd74c6edca0c5786a5109a131d0501ef6bd02077e5ce1ad75d906cf3612a320d1098163e2d0&token=1109491988&lang=zh_CN#rd")
*   Spring家族
*   Hibernate
*   AJAX
*   监听器和过滤器
*   ......

![](/images/jueJin/171a9cdaaedd05f.png)

#### 涵盖Java后端所有知识点的开源项目（已有7 K star）：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

如果大家想要**实时**关注我更新的文章以及分享的干货的话，微信搜索**Java3y**。

PDF文档的内容**均为手打**，有任何的不懂都可以直接**来问我**（公众号有我的联系方式）。

![](/images/jueJin/171a9cdaaed8cfc.png)

![](/images/jueJin/171a9cdaafd1031.png)

![](/images/jueJin/171a9cdab0dc611.png)

![](/images/jueJin/171a9cdab2ac499.png)