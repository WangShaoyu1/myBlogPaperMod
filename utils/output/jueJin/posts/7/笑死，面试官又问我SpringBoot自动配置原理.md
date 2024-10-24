---
author: "Java3y"
title: "笑死，面试官又问我SpringBoot自动配置原理"
date: 2022-12-26
description: "嗯，SpringBoot的自动配置我觉得是SpringBoot很重要的“特性”了。众所周知，SpringBoot有着“"
tags: ["后端","面试","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:94,comments:8,collects:236,views:15027,"
---
面试官：好久没见，甚是想念。今天来聊聊SpringBoot的自动配置吧？

候选者：嗯，SpringBoot的自动配置我觉得是SpringBoot很重要的“特性”了。众所周知，SpringBoot有着“约定大于配置”的理念，这一理念一定程度上可以用“SpringBoot自动配置”来解释。

![](/images/jueJin/ef277e4aa68846e.png)

候选者：SpringBoot自动配置的原理理解起来挺简单的，我们在使用SpringBoot的时候，肯定会依赖于autoconfigure这么一个包

候选者：autoconfigure这个包里会有一个spring.factories文件，该文件定义了100+个入口的配置类。比如我们经常使用的redis、kafka等等这样常见的中间件都**预置**了配置类

候选者：当我们在启动SpringBoot项目的时候，内部就会加载这个spring.factories文件，进而去加载“有需要”的配置类。那我们在使用相关组件的时候，就会非常的方便（因为配置类已经初始化了一大部分配置信息）。

候选者：一般我们只要在application配置文件写上对应的配置，就能通过各种template类直接操作对应的组件啦。

![](/images/jueJin/5a6381e3944d4f8.png)

面试官：那是所有的配置类都会加载吗？这个“有需要”的配置类你是怎么理解的？

候选者：不是所有的配置类都会加载的，假设我们没有引入redis-starter的包，那Redis的配置类就不会被加载。具体Spring在实现的时候就是使用 **@ConditionalXXX**进行判断的。比如Redis的配置类就会有@ConditionalOnClass({RedisOperations.class})的配置，说明当前环境下如果有RedisOperations.class这个字节码，才会去加载Redis的配置类

![](/images/jueJin/3e338051c5f24a0.png)

面试官：哦，这样啊，那了解了。那你知不知道Redis的配置类其实会有初始化RedisTemplate对象的操作，那假设我们没有引入redis-starter包，那他是怎么通过编译的？（当然了，其他的配置类也是有可能有一样的状况）

候选者：嗯，这个我看源码的时候我也发现了。其实就是在autoconfigure包里**会定义到相关的依赖**，但只是标记为optional并且只在编译环境有效。那这样是能通过编译的，**只是不会将其依赖传入到我们的应用工程里**。

候选者：这块还是花了我很多时间的，我最后在GitHub 的SpringBoot源码里找到的。

面试官：嗯啊，有点东西的哟。既然都聊到这块了，要不顺便聊聊你对SpringBoot starter的理解？

候选者：嗯，starter这东西就是为了**方便调用方去使用相关的组件**的嘛，Spring框架也给我们实现了很多好用的starter。

候选者：比如以前我们要用Mybatis框架，可能会引入各种的包才能使用。而starter就是做了一层封装，把相关要用到的jar都给包起来了，并且也写好了对应的版本。这我们使用的时候就不需要引入一堆jar包且管理版本类似的问题了。

![](/images/jueJin/0bf89b099cbd417.png)

候选者：现在很多开源的组件都会提供对应的springboot-starter包给我们去用，要做一个starter包并不难。参照Spring内置的实现就好了：1、在工程里引入 starter 打包相关的依赖。2、在我们工程内建spring.factories文件，编写我们配置类的全限类名。

面试官：嗯，大致都了解了，可以的。最后聊下你是怎么看这块源码的？

候选者：源码具体大概就不记得了，思路倒是还有的。我先从启动类开始，会有个@SpringBootApplication，后面会定位到一个自动配置的注解@EnableAutoConfiguration，那最后就能看到注解内部会去META-INF/spring.factories加载配置类

候选者：这块源码并不难，这个过程也了解到了原来maven有option和scope这俩标签，但确实是SpringBoot比较重要的概念吧。

面试官：好嘞，今天到这就结束了吧。

**题外**：自动配置这个问题确实被问到过几次。说实在的，对于Spring类、注解的信息我真的记不住。感觉能答出这个流程思路，也就够用了（如果面试官确实是要细究某个类名，那这种公司不去也罢）

**约定大于配置**：SpringBoot给我们内置了很多配置类，这些配置类也初始化了很多配置（**默认值**）。当我们要使用的时候，只需要覆盖这些配置项就完事了。即便我们不写，大多数情况下都不需要由我们显示配置出来，但相关组件就能正常访问了。

推荐项目
====

如果想学Java项目的，我还是**强烈推荐**我的开源项目消息推送平台Austin，可以用作**毕业设计**，可以用作**校招**，可以看看**生产环境是怎么推送消息**的。

Gitee仓库地址：**[gitee.com/zhongfuchen…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzhongfucheng%2Faustin "https://gitee.com/zhongfucheng/austin")**

GitHub仓库地址：**[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2Faustin "https://github.com/ZhongFuCheng3y/austin")**