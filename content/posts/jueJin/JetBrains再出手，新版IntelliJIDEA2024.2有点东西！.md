---
author: "CodeSheep"
title: "JetBrains再出手，新版IntelliJIDEA2024.2有点东西！"
date: 2024-08-21
description: "说时迟，那时快。就在最近，IntelliJIDEA又迎来了一波大版本更新，这也是2024年来的第二个版本大动作！没错，全新的IntelliJIDEA2024.2版本正式发布了。这次"
tags: ["前端","后端","程序员"]
ShowReadingTime: "阅读8分钟"
weight: 482
---
说时迟，那时快。

就在最近，IntelliJ IDEA 又迎来了一波大版本更新，这也是 2024年来的第二个版本大动作！

没错，全新的 IntelliJ IDEA 2024.2 版本正式发布了。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2653c7c3267c415ab2a954d2c67aaeda~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=ycMjq9%2FYewYwZkb3Ewtbbv%2BkxhA%3D)

这次的新版 IntelliJ IDEA 2024.2 带来了不少优化和改进，下面就针对本次新版 IntelliJ IDEA 的一些更新和特性来做一些梳理，希望能对大家有所帮助。

### 增强启动体验

在这次最新刚发布的 2024.2 版本中，一大重点更新就是增强了启动体验，目的是让用户能够更快地开始编码。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9fb316b1ae6647ba92def8e406466154~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=xL6zLgE4N2j6Ts4V62RwrrU5cds%3D)

这次升级使 IDE 可以在不完整的项目模型下运行，并允许在索引编制期间访问关键功能，包括代码高亮显示、代码补全、意图操作、测试启动、有效装订区域标记、Lombok 支持等，从而减少用户的等待时间，提升工作效率。

### 默认启用全新UI

上个月我们就写过一篇文章聊了聊JetBrains即将为所有用户默认标配开启的全新UI。

*   [如期而至！JetBrains全新UI正式官宣标配](https://juejin.cn/post/7392115478561980443 "https://juejin.cn/post/7392115478561980443")

果不其然，在这次正式到来的2024.2大版本中，就为所有JetBrains IDE 默认启用全新UI。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/39a8bd8b08ce424cba4bea0a87dbd674~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=JlINrduQx6cOOxIYAAGxYwZeVeE%3D)

那这时候就有一个问题：**假如有些用户如果还怀念旧UI那该怎么办呢？**

没关系，JetBrains已经贴心地将经典的旧款UI做成了插件，并在JetBrains Marketplace中来进行提供，所以说大家可以根据自己的喜好来选择用或者不用。

从2024.2版本开始，用户将看到一个包含插件链接的弹出窗口，或者可以在“设置”|“插件”中找到该插件。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f6591a5906f04474a7a3ce9cce9489de~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=wnFFjQd4ifCArmkeJ%2F7VJft4NQg%3D)

新 UI 简洁而现代，提供更大、更易用的控件、一致的调色盘、明亮清晰的图标、增强的对比度和更好的强调色。

官方表示，目前新 UI 的采用率很高，不少用户都表示早已切换到全新 UI 使用了很久了。

### 改进的Spring Data JPA支持

新版 IDEA 添加了在 IDE 中运行 Spring Data JPA 方法的功能，持续改进 IntelliJ IDEA 的 Spring 框架支持。

这项新功能允许用户在不运行应用程序和分析日志文件的情况下查看方法将生成哪个查询，而且现在用户可以使用装订区域图标直接在 JPA 控制台中执行任何仓库方法。

![改进的SpringDataJPA支持.gif](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/67cfc99c69444313b5af1b22a59257fe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=KFYRzZ1zlu1U5rMjZjsKF5tUvzE%3D)

### 改进的cron表达式支持

新版IDEA在代码中处理 cron 表达式比以往更加简单。

当使用 Spring、Quarkus 或 Micronaut 实现定时服务时，用户可以更轻松地理解 cron 表达式。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1ce2afe986ec469ca2c0066b3ab9cb60~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=wPAtPC7vTXbtxqq8Kgx9AAf5oKs%3D)

此外，自动补全功能提供了用户可以立即添加和调整的预填充示例，这样就不用从头开始编写 cron 表达式了，非常方便。

### 改进的全行代码补全

2024.2 版本使接受全行代码补全建议的流程更加直观和精确。 内联代码补全建议现在包含代码高亮显示，新的快捷键可以让用户从较长的建议中接受单个单词或整个行。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e5321c2d47594320a7d3eb3bbcf4595c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=gs00mltNsvroPpkw%2FvsEpT5C1V4%3D)

除此之外新版还优化了将接受的更改集成到代码中的方式，消除了格式设置和相关问题。

### Search Everywhere中的预览选项

新版在 Search Everywhere（随处搜索）对话框增加了一个选项，用于预览用户正在搜索的代码库元素。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fe10011111dc4aea84ab1df1d51eb66a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=ICBQMAvk2VYV774mQxVwm18YBck%3D)

通过对话框工具栏上的 Preview（预览）图标启用此功能后，预览窗格将出现在搜索结果下方，提供更多上下文以让用户更轻松地浏览项目。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/af132860c65148d4acda10d9e3daab8a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=pvXJHtVTs%2B6OcrHdLAF%2FnqSzSb0%3D)

### 代理设置自动检测默认为新用户启用

新版IntelliJ IDEA 现在会默认自动检测并使用用户的计算机上配置的系统代理设置，以促进与外部资源和服务的无缝交互。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/633d84d5228f4bb2a47b08de187f5d36~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=l%2BBsa9LRcfCelTXQGnT4TknK96c%3D)

### Linux 上更新的窗口控件

在 Linux 系统上，IntelliJ IDEA 此前将窗口控件置于 IDE 的右侧，而现在的新版会自动调整控件位置，以匹配用户的 Linux 桌面配置中指定的窗口控件设置。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f0f8f86948554ec58019f2a5c8b617d6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=i8uDGNHzP3BP6ivDNws0UYWJe9o%3D)

这个小但重要的更改可以让用户保持适合个人偏好的布局。此外，新版还重新设计了窗口控件按钮，提供更接近用户操作系统的外观，可以说还是非常贴心的。

### 增强的日志管理

IntelliJ IDEA 2024.2 为 Java 和 Kotlin 引入了增强的日志管理。

新功能包括字符串文字和实参解析的高亮显示，让用户可以从占位符无缝导航到对应实参，非常方便。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cbc8d8b993204f32915756a9f1ce3801~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=%2FO%2Fx54gGA9WvgK9yod6NlpjTuu8%3D)

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f248310d94304799a64a8bf2ea753599~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=L2hA51YQUDAFcl77KHnAK7lssz4%3D)

### 重构嵌入提示

为了使 Change Signature（更改签名）重构更加易用和直观，新版IDEA在修改的代码元素附近添加了一个新的嵌入提示。

当用户点击并确认更改时，IDE 会自动更新整个代码库中的所有相关方法引用，这样可以确保一致并降低错误风险，简化重构流程。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/07f66c019b85493981ea55802dc7bebe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=vvLLCOZQgN%2Fr%2Bo4s10TERjxMcy4%3D)

### Run工具窗口中的性能图表展示

为了使性能分析更快、更高效，新版 IDEA 在 Run（运行）工具窗口中实现了新的 Performance（性能）标签页。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/77def81a46e044a0b5557533396541f1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=STct6JxGgZCKzXlohe0sZf16uHc%3D)

新的标签页提供实时 CPU 和内存图表，并允许用户捕获代码的执行时间并直接在编辑器中查看来查明性能瓶颈。 此外，用户还可以捕获内存快照来检查对象并找出内存泄漏的根本原因。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ed84f5dcb56a4c99a854d4aca499da5d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=J1A9zwlckyBd%2F59V5U1AJx%2Fu8XM%3D)

### 字符串变量可视化器

在新版 IDEA 中，调试和浏览具有复杂数据格式的长字符串变量变得比以前容易很多。

更新后的调试器为具有以 JSON、XML、HTML、JWT 和 URL 编码的字符串的字符串变量提供了格式正确的可视化效果。用户只需点击变量旁边的 View（查看）超链接，相关的可视化器便会根据变量的内容自动选择。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/00d948e27f9e451292b2dfeaa078496a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=icCN6ke1sSQKwKulu9VGpCrvcCc%3D)

### 优化Git Log提交图

新版 IDEA 优化了 Git 工具窗口 Log（日志）标签页中提交图的分支线的颜色编码和布局。重要的分支行现在始终位于图表左侧，并维持其指定颜色，更易识别和跟踪。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/146fe12bed7542b8a8f8db629541fc91~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=JSwi4cSrnkV%2BJ8icPysfVZzdwMY%3D)

### Markdown 文件语法增强

这次新版 IntelliJ IDEA 可以支持在 Markdown 文件中原生渲染数学表达式。 处理 Markdown 时，用户可以使用 $ 插入内联数学表达式，使用 $$ 插入包含数学内容的代码块。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3c9797ad6135476aa29e1bda7e0e31a3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=nGPC1fHKvwNQZ6BuoUrqoiJCaLY%3D)

### 改进的Gradle构建脚本体验

新版 IntelliJ IDEA 2024.2 为 Gradle 构建脚本提供了新的导航和高亮显示功能。 首先，IDE 现在为构建脚本中声明的 Gradle 插件提供了流畅、准确的导航。 此外，新版还实现了版本目录文件和 libs.versions.toml 文件中的构建脚本之间的导航，以及直接从装订区域运行已注册任务的选项，以提升效率。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f9c75b44ff094170be890f62f743acab~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=BJGoEPq1ueQjUhI%2Bv6YXxc1DXvo%3D)

### 增量Maven项目重新同步

这次的新版 IDEA 加快了 Maven 项目的重新同步工作流。

初始完全同步之后，IDE 现在会检测项目特定部分的更改，并仅重新同步这些部分而不是整个项目。

### AI Assistant改进

JetBrains AI Assistant 2024.2 对云代码补全引入了重大增强，以提供更准确、更快速的建议。

UX 经过重做，可以将 AI 代码补全功能更好地集成到 IDE 工作流中，并获得多项改进，包括建议代码中的语法高亮显示和代码建议的增量接受。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cc377adcdaa94a5fa5b7ef6c7c34faab~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=PHh9jn0NWa9ovV0p5zlUg6TN7A4%3D)

### Code With Me会话启动简化

Code With Me 会话启动弹出窗口经过重新设计，使流程有所简化。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d73f1f2221a049d9b0ace5bc59c57285~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=Ary4PoXMILWxr0dfrvd409ztJ9U%3D)

现在包括所有权限设置，减少了启动新会话所需的步骤，并且权限得到保留，每个会话只需点击两次即可启动。此外，权限可以在会话期间直接从弹出窗口更改，可以说非常方便了。

### Code With Me屏幕共享增强

Code With Me 通话中的屏幕共享现在重定向到浏览器，允许用户将特定窗口或整个屏幕指定为共享源。此前，所有屏幕和窗口都默认共享，没有选择特定源的选项，这次新版终于对此作了相应优化。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/eee669f45e704dcd982ad7d5448b08d0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1728416733&x-signature=dExd%2BLJ5wHHZfAXMlMbCv21u7hw%3D)

### 其他

除此之外，其他包括像数据库工具、其他框架、语言和技术的支持等方面的更新和说明，大家也可参阅jetbrains.com/zh-cn/idea/whatsnew。

怎么样，这次的新版 2024.2 IDEA大家会第一时间更新吗？

> 注：本文在GitHub开源仓库「编程之路」 [github.com/rd2coding/R…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frd2coding%2FRoad2Coding "https://github.com/rd2coding/Road2Coding") 中已经收录，里面有我整理的6大编程方向(岗位)的自学路线+知识点大梳理、面试考点、我的简历、几本硬核pdf笔记，以及程序员生活和感悟，欢迎star。