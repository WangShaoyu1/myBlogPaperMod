---
author: "MacroZheng"
title: "这些年我用过的API文档工具，个个是精品！"
date: 2021-12-22
description: "这些年用过不少API文档工具，也写过不少相关的文章，我发现哪种API文档工具更好用一直都是大家比较关心的话题。今天整理了下我曾经用过的7种API文档工具，每个都有详细的使用教程，肯定有你中意的一种！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:29,comments:0,collects:57,views:9085,"
---
> 这些年用过不少API文档工具，也写过不少相关的文章，我发现`哪种API文档工具更好用`一直都是大家比较关心的话题。今天整理了下我曾经用过的7种API文档工具，每个都有详细的使用教程，肯定有你中意的一种！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Swagger
-------

Swagger是一款非常流行的API文档工具，它能帮助你简化API文档的开发，极大提高开发效率，之前在[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")项目中就是使用的它。

![](/images/jueJin/0c5ba3e0ed5446f.png)

我们一般将Swagger和SpringBoot结合使用，使用的是Springfox给我们提供的工具。使用该工具可以根据注解自动生成API文档，并且可以在生成的文档上进行接口调试。

由于API文档随着项目的启动而更新，所以API文档的实时性很有保证！Springfox官方还给我们提供了Starter，整合非常方便，如果你还在SpringBoot项目中手动整合Swagger的话，不妨看下[《还在手动整合Swagger？Swagger官方Starter是真的香！》](https://juejin.cn/post/6890692970018766856 "https://juejin.cn/post/6890692970018766856") 。

项目地址：[github.com/springfox/s…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspringfox%2Fspringfox "https://github.com/springfox/springfox")

Knife4j
-------

虽然Swagger已经非常好用，但是存在界面不够美观，API调试功能弱的缺点，比如请求参数没有校验，返回一堆JSON数据时无法折叠这类问题。于是在Swagger的基础上，就有了一些增强工具的出现。

Knife4j是springfox-swagger的增强UI实现，为Java开发者在使用Swagger的时候，提供了简洁、强大的接口文档体验。Knife4j完全遵循了springfox-swagger中的使用方式，并在此基础上做了增强功能，如果你用过Swagger，你就可以无缝切换到Knife4j。

![](/images/jueJin/eb04a13ab2ea4b8.png)

使用Knife4j就好像给Swagger换了个新皮肤，瞬间就高大上了，具体使用可以参考[《给Swagger换了个新皮肤，瞬间高大上了！》](https://juejin.cn/post/6854573214358732814 "https://juejin.cn/post/6854573214358732814") 。

如果你的项目是微服务项目的话，使用Knife4j可以聚合所有服务的文档，具体使用可以参考[《微服务聚合Swagger文档，这波操作是真的香！》](https://juejin.cn/post/6854573219916201997 "https://juejin.cn/post/6854573219916201997") 。

![](/images/jueJin/4128e4ac4e97433.png)

项目地址：[github.com/xiaoymin/sw…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaoymin%2Fswagger-bootstrap-ui "https://github.com/xiaoymin/swagger-bootstrap-ui")

Postman
-------

由于Swagger的接口调试能力比较弱，使用Postman来调试也不失为一个好方案。

Postman是一款API接口调试工具，使用它可以很方便的对接口进行测试，并且后端人员可以将自己的调试结果导出，方便前端人员调试，具体使用可以参考[《Postman：API接口调试利器》](https://juejin.cn/post/6844903919529754638 "https://juejin.cn/post/6844903919529754638") 。

![](/images/jueJin/3293e0676709417.png)

当然在Postman中查看API文档也是可以的，只是功能有点偏弱，所以才有了Swagger+Postman这种流行组合，具体可以参考[《Swagger界面丑、功能弱怎么破？用Postman增强下就给力了！》](https://juejin.cn/post/6896633644769607694 "https://juejin.cn/post/6896633644769607694") 。

![](/images/jueJin/c40819e162584b0.png)

官方网站：[www.postman.com/](https://link.juejin.cn?target=https%3A%2F%2Fwww.postman.com%2F "https://www.postman.com/")

YApi
----

除了Knife4j这类给Swagger做增强的工具，还有一类工具本身就具有API文档管理的功能，可独立部署并且可以对接Swagger，功能更加强大，也可以称之为API文档管理平台。

YApi正是这样一种工具，YApi是高效、易用、功能强大的API管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。YApi在Github上已累计获得了18K+Star，具有优秀的交互体验，YApi不仅提供了常用的接口管理功能，还提供了权限管理、Mock数据、Swagger数据导入等功能，总之功能很强大！

![](/images/jueJin/bdd63dffcec347d.png)

YApi的具体使用可以参考[《当Swagger遇上YApi，瞬间高大上了！》](https://juejin.cn/post/6906279483448393735 "https://juejin.cn/post/6906279483448393735") 。

项目地址：[github.com/YMFE/yapi](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYMFE%2Fyapi "https://github.com/YMFE/yapi")

smart-doc
---------

Swagger需要通过它自己的注解来实现API文档的生成，代码入侵性有点强，如果你想零入侵的话，不妨试试`smart-doc`。

`smart-doc`是一款API文档生成工具，无需多余操作，只要你规范地写好代码注释，就能生成API文档。同时能直接生成Postman调试文件，一键导入Postman即可调试，非常好用！

![](/images/jueJin/37da6b0b159846f.png)

`smart-doc`和Swagger的接口调试能力一样，都比较弱，也得配合Postman来使用，具体可以参考[《还在用Swagger？试试这款零注解侵入的API文档生成工具，跟Postman绝配！》](https://juejin.cn/post/7028377863850033183 "https://juejin.cn/post/7028377863850033183") 。

项目地址：[gitee.com/smart-doc-t…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fsmart-doc-team%2Fsmart-doc "https://gitee.com/smart-doc-team/smart-doc")

Torna
-----

又一款可独立部署的API文档管理工具，可以搭建API文档管理平台。不仅支持Swagger导入、还支持Postman和OpenApi等导入。

![](/images/jueJin/aad1cbe731a7473.png)

Torna是一套企业级接口文档解决方案，可以配合Swagger使用，具体参考[《当 Swagger 遇上 Torna，瞬间高大上了！》](https://juejin.cn/post/7030976846011301901 "https://juejin.cn/post/7030976846011301901") 。它具有如下功能：

*   文档管理：支持接口文档增删改查、接口调试、字典管理及导入导出功能；
*   权限管理：支持接口文档的权限管理，同时有访客、开发者、管理员三种角色；
*   双模式：独创的双模式，管理模式可以用来编辑文档内容，浏览模式纯粹查阅文档，界面无其它元素干扰。

![](/images/jueJin/703a00dab11d406.png)

项目地址：[gitee.com/durcframewo…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fdurcframework%2Ftorna "https://gitee.com/durcframework/torna")

Apifox
------

一款在线使用的API文档管理工具，可以配合Swagger使用，功能强大，界面炫酷！

Apifox 的定位是`Postman + Swagger + Mock + JMeter`，具有API文档管理、API调试、API Mock、API 自动化测试等功能。可以通过一种工具解决之前使用多种工具的数据同步问题。高效、及时、准确！

![](/images/jueJin/cd42df5e98bb4fc.png)

具体使用可以参考：[《取代 Postman + Swagger！这款神器功能更强大，界面更炫酷！》](https://juejin.cn/post/7036169201584701471 "https://juejin.cn/post/7036169201584701471") 。

官方网站：[www.apifox.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.apifox.cn%2F "https://www.apifox.cn/")

总结
--

本文整理了之前使用过的7种API文档生成+管理工具，如果你是刚开始使用API文档工具的话，使用Swagger准没错！如果你正在使用Swagger，想要使用更好的API文档工具的话，可以考虑将Swagger配合Knife4j、YApi或Torna来使用。如果你不介意在线使用API文档管理工具的话，可以使用Apifox，它的功能更强大。

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！