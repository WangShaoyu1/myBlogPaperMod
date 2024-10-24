---
author: "华为云开发者联盟"
title: "从零开始带你上手体验Sermant自定义插件开发"
date: 2024-07-03
description: "本文对Sermant的自定义插件开发的流程进行了体验和探索，包括项目编译、运行、动态配置验证、插件拦截原理等内容，希望对初次体验Sermant高效开发插件的开发者有所帮助。"
tags: ["云原生","开源","微服务中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:0,views:124,"
---
本文分享自华为云社区[《Sermant自定义插件开发上手体验》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F430295%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/430295?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者：华为云开源。

一、研究缘由
======

由于目前我们所处的行业是汽车行业，项目上进行云服务的迁移时使用到了Sermant中的相关插件, 为了加深对Sermant开发和运行机制的了解，我们从零开始体验Sermant自定义插件的开发。

下面我们就Sermant-example中的first-plugin-demo来进行研究说明。

二、下载Sermant-example
===================

首先我们下载sermant-example的demo：

![](/images/jueJin/ecde78b86f9b4b2.png)

下载完成之后，我们从最简单的自定义插件开始，也即first-plugin-demo。

三、执行打包
======

对first-plugin-demo执行打包，打完包的结构：

![](/images/jueJin/0f435aa53dd8446.png)

可以看到我们的项目和对应的插件模板项目都在里面了。

四、启动项目
======

```
java -javaagent:sermant-agent.jar -jar Application.jar
```

然后访问controller方法

![](/images/jueJin/539d0d91936a4ed.png)

从而可以看到拦截的效果：

![](/images/jueJin/4f259c3a456a425.png)

可以看到启动的过程中，完成了拦截的效果。

也即它走了拦截器的前置和后置方法。

![](/images/jueJin/f064234b93ce494.png)

五、动态配置验证
========

![](/images/jueJin/fee27fd411584c0.png)

配置的动态配置里面配置的配置中心是zookeeper，因此我们在启动项目前需要启动一个zookeeper作为配置中心，同时开启动态配置开关。

完成之后，我们需要在相应的监听节点下创建一个配置项，来测试动态配置的功能：

![](/images/jueJin/627391fcb09a453.png)

再次进行访问，可以在控制台看到如下效果：

![](/images/jueJin/f5a452482c76498.png)

也即完成了动态配置的功能。而我们可以看到

![](/images/jueJin/63af29d33dfd485.png)

其实质是创建了配置监听器，实现了配置处理的process方法，其中DynamicConfigEvent就是监听到的配置更改的事件，包含了配置的group，key，content等配置信息。实现动态配置的相关实现是调用了自己实现的process方法，基于map对配置进行存储和处理，从而实现配置切换。

六、全流程中的参数argsMap到底是什么
=====================

之前一直很好奇配置里面的信息到底是什么，最近debug之后有所发现。

我们可以看到加载的argMap里面的相关参数：

![](/images/jueJin/5afd09791eb34ae.png)

我们可以看到argsMap里面的参数基本上和上面的配置，同时会加载插件里面的配置信息。完成这些操作之后，就可以在全流程中去完成对应信息的加载了。

ConfigManager.initialize(argsMap) ，主要是解析一些配置，由于配置存在yaml和properties等不同的形式，因此这里采用策略模式来进行解析。主要的相关配置信息可以参考BaseConfig这个接口的实现。

七、插件的加载是在plugins.yaml
=====================

插件的加载是在plugins.yaml里面配置的，比如我们自定义的插件：

![](/images/jueJin/2f60cd8817fa47b.png)

而实现插件的关键在于plugins.yaml中配置了哪些插件。因为这些插件正是后续进行拦截的基础。也即它告诉了程序，需要加载哪些插件，不需要加载哪些插件。有了这个基础，才会进行后面精准的转换、installOn操作。

八、拦截原理
======

我们可以看到上面控制台打印的拦截信息，那如何实现拦截的呢？

可以看到我们执行first-plugin-demo这个示例的时候：会发现我们执行业务方法的时候，它就会进行织入拦截器，执行对应的onMethodEnter和方法执行完后的onMethodExit方法。

![](/images/jueJin/c3d87ac94931461.png)

这两个方法和byte-buddy中的使用实现的功能是类似的。在需要拦截的方法中执行织入的逻辑。

同时可以从控制台debug中的信息可以看到调用的情况：

![](/images/jueJin/02230ef5d493429.png)

完成上面的调用之后，我们便可以看到控制台输出的信息了。

这里我们以进入方法为例，来进行说明：

![](/images/jueJin/e1a60c3f96b54a1.png)

可以看到进入对应的织入方法之后，最终会走到我们需要进行扩展的迭代器中，来实现迭代。

![](/images/jueJin/ec2c7c6788404aa.png)

可以看到进入了first-plugin-demo中的插件拦截：

![](/images/jueJin/a2bf98adb4cd49a.png)

完成拦截进入到业务方法中，实现拦截功能的织入。然后进入后置拦截，完成after的拦截逻辑。

**参考：**

官网：[sermant.io](https://link.juejin.cn?target=https%3A%2F%2Fsermant.io "https://sermant.io")

仓库地址：[github.com/sermant-io/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsermant-io%2FSermant "https://github.com/sermant-io/Sermant")

Demo仓库：[github.com/sermant-io/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsermant-io%2FSermant-examples "https://github.com/sermant-io/Sermant-examples")

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")