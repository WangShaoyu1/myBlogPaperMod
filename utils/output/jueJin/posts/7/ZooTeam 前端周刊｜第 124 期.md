---
author: ""
title: "ZooTeam 前端周刊｜第 124 期"
date: 2021-03-05
description: "浅拷贝与深拷贝html2sketch：一名设计工程师的C2D探索之路为什么现在我更推荐pnpm而不是npmyarn前端工程化探究--sourcemap从输入URL开始建立前端知识体系字节跳动最爱考"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:12,comments:0,collects:3,views:1137,"
---
> [ZooTeam 前端周刊｜第 124 期](https://link.juejin.cn?target=https%3A%2F%2Fweekly.zoo.team%2Fdetail%2F124 "https://weekly.zoo.team/detail/124")
> 
> 浏览更多往期周刊，请访问： [weekly.zoo.team](https://link.juejin.cn?target=https%3A%2F%2Fweekly.zoo.team "https://weekly.zoo.team")
> 
> ![](/images/jueJin/316fb6cc772f415.png)

1.  [浅拷贝与深拷贝](https://juejin.cn/post/6844904197595332622 "https://juejin.cn/post/6844904197595332622")

> 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新…

2.  [html2sketch：一名设计工程师的 C2D 探索之路](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F312306021 "https://zhuanlan.zhihu.com/p/312306021")

> 这篇文章中提到的内容，均为我今年在蚂蚁集团· 体验技术部 4 个月暑期实习的成果，在此特别说明。非常感谢实习期间 @林外 @偏右悄悄地 @王嘉喆 等前辈们的指导，以及诸多可爱的小伙伴们，想你们呀 XD。 自诩为「…

3.  [为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FPFFkWxfUkyw3iKS3Mukrpw "https://mp.weixin.qq.com/s/PFFkWxfUkyw3iKS3Mukrpw")

> 分享一个业内一款出色的包管理器——pnpm。目前 GitHub 已经有 star 9.8k，现在已经相对成熟且稳定了。它由 npm/yarn 衍生而来，但却解决了 npm/yarn 内部潜在的 bug，并且极大了地优化了性能，扩展了使用场景

4.  [前端工程化探究--source map](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fz5yyUFtwvkQnc3q3AHOgJg "https://mp.weixin.qq.com/s/z5yyUFtwvkQnc3q3AHOgJg")

> 一文让读者一文搞懂 source map的机制。

5.  [从输入URL开始建立前端知识体系](https://juejin.cn/post/6935232082482298911 "https://juejin.cn/post/6935232082482298911")

> 浏览器主进程：只有一个，主要控制页面的创建、销毁、网络资源管理、下载等。 第三方插件进程：每一种类型的插件对应一个进程，仅当使用该插件时才创建。 GPU进程：最多一个，用于3D绘制等。 浏览器渲染进程(浏览器内核)：每个Tab页对应一个进程，互不影响。 这里我们只考虑输入的是一…

6.  [字节跳动最爱考的前端面试题：JavaScript 基础](https://juejin.cn/post/6934500357091360781 "https://juejin.cn/post/6934500357091360781")

> 最大安全数字：Number.MAX\_SAFE\_INTEGER = Math.pow(2, 53) - 1，转换成整数就是 16 位，所以 0.1 === 0.1，是因为通过 toPrecision(16) 去有效位之后，两者是相等的。 在两数相加时，会先转换成二进制，0.1 和…

7.  [有趣的装饰器：使用 Reflect Metadata 实践依赖注入\_嘿嘿-CSDN博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_31967569%2Farticle%2Fdetails%2F106617532 "https://blog.csdn.net/qq_31967569/article/details/106617532")

> 简介 控制反转和依赖注入是常见一种设计模式，在前后端均有很深的应用场景，不了解的小伙伴可以先看下资料：wiki/设计模式\_(计算机)，wiki/控制反转 如果之前有过 Angular 开发经历，那么肯定用过Injectable和Component等常见的装饰器，其作用就是完成控制反转和依赖注入 对于 node 后端，也同样有很多以IoC和DI这套思想为主打的库，比如：NestJs，InversifyJs等 今天主要聊聊这些依赖注入框架下的装饰器的使用原理...

![](/images/jueJin/d1bfd6a55ef4412.png)