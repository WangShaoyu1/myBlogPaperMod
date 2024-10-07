---
author: "CodeSheep"
title: "又整新活，新版IntelliJIDEA2024.1有点东西！"
date: 2024-04-09
description: "就在上周，Jetbrains又迎来了一波大版本更新，这也是JetBrains2024首个大动作！JetBrains为其多款IDE发布了2024年度首个大版本更新(2024.1)。"
tags: ["前端","后端","程序员"]
ShowReadingTime: "阅读9分钟"
weight: 693
---
就在上周，Jetbrains 又迎来了一波大版本更新，这也是 JetBrains 2024首个大动作！

JetBrains 为其多款 IDE 发布了 2024 年度首个大版本更新 (2024.1)。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f35f9ed9d6e4fc7a71f13bd8ad5ee2a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1998&h=1254&s=1133653&e=png&b=fefefe)

作为旗下重要的产品之一，IntelliJ IDEA当然也不例外。这不，现如今 IntelliJ IDEA 也来到了 2024.1 大版本了！

据官方介绍，这次 2024.1 新版本进行了数十项改进。

下面就针对本次新版 IntelliJ IDEA 的一些主要更新和特性做一个梳理和介绍，希望能对大家有所帮助。

全行代码补全
------

IntelliJ IDEA Ultimate 2024.1 带有针对 Java 和 Kotlin 的全行代码补全。

![全行代码补全.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e6f44890174da28886ff0e06c05f33~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=656594&e=gif&f=93&b=0e1216)

该项功能由无缝集成到 IDE 中的高级深度学习模型来提供支持。它可以基于上下文分析预测和建议整行代码，以助于提高编码效率。

对 Java 22 的支持
-------------

IntelliJ IDEA 2024.1 提供了对 2024 年 3 月刚发布的 JDK 22 中的功能集的支持。

![对Java22功能的支持.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bc021e9b7444e3098627052a74fa702~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=276483&e=gif&f=30&b=0e1216)

支持覆盖未命名变量与模式的最终迭代、字符串模板与隐式声明的类的第二个预览版，以及实例main方法。 此外，这次更新还引入了对`super(...)`之前预览状态下的 new 语句支持。

新终端加持
-----

IntelliJ IDEA 2024.1推出了重构后的新终端，具有可视化和功能增强，有助于简化命令行任务。

![新终端.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63be130a7f7a41f4b1ac7b8b5411aa0a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=1416017&e=gif&f=145&b=060604)

此更新为既有工具带来了全新的外观，命令被分为不同的块，扩展的功能集包括块间丝滑导航、命令补全和命令历史记录的轻松访问等。

编辑器中的粘性行
--------

此次新版本更新在编辑器中引入了粘性行，旨在简化大文件的处理和新代码库的探索。滚动时，此功能会将类或方法的开头等关键结构元素固定到编辑器顶部。

这样一来作用域将始终保持在视野中，用户可以点击固定的行快速浏览代码。

![编辑器中的粘性行.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4b769fc162d4795adb1459e1a788d79~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=1005400&e=gif&f=58&b=0e1216)

AI Assistant 改进
---------------

在本次新版中，AI Assistant 获得了多项有价值的更新，包括改进的测试生成和云代码补全、提交消息的自定义提示语、从代码段创建文件的功能，以及更新的编辑器内代码生成。

![AI_Assistant改进.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0c157e03c4e424088b645f208f86725~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=2369809&e=gif&f=161&b=0e1216)

不过需要注意的事，在这次 2024.1 版中，AI Assistant 已解绑，现在作为独立插件提供。这一改动是为了在使用 AI 赋能的技术方面提供更多的决策灵活度，让用户能够在工作环境中更好地控制偏好设置和要求。

索引编制期间 IDE 功能对 Java 和 Kotlin 的可用
--------------------------------

这次新版本中，代码高亮显示和补全等基本 IDE 功能可在项目索引编制期间用于 Java 和 Kotlin，这将会增强用户项目的启动体验。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580b854fe3ce4a4ea323b8790d6f6a9e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=1200&s=698657&e=png&b=1f1e25)

此外，用户可以在项目仍在加载时即使用 Go to class（转到类）和 Go to symbol（转到符号）来浏览代码。

更新的 New Project（新建项目）向导
-----------------------

为了减轻用户在配置新项目时的认知负担，新版微调了 New Project（新建项目）向导的布局。语言列表现在位于左上角，使最常用的选项更加醒目。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc07b8bcaba44241b418c839e585cf8f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1600&h=642&s=208328&e=png&b=2d2c33)

用于缩小整个 IDE 的选项
--------------

新版支持可以将 IDE 缩小到 90%、80% 或 70%，从而可以灵活地调整 IDE 元素的大小。

![用于缩小整个IDE的选项.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22a91ac8b2d7447da3f90f6a3e394b5e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=362376&e=gif&f=73&b=131215)

对Java支持的更新
----------

*   字符串模板中的语言注入

IntelliJ IDEA 2024.1 引入了将语言注入字符串模板的功能。

![字符串模板中的语言注入.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b5e2a9e2526486ba5b3ab9fdd65aa3f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=1310458&e=gif&f=98&b=0e1216)

用户既可以使用注解（注解会自动选择所需语言），也可以使用 Inject language or reference（注入语言或引用）来从列表中手动选择语言。

*   改进的日志工作流

由于日志记录是日常开发的重要环节，新版本引入了一系列更新来增强 IntelliJ IDEA 在日志方面的用户体验。

比如现在用户可以从控制台中的日志消息中轻松导航到生成它们的代码。

![改进的日志工作流 .gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a29435890444776bb90d4b34f417b0a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=103939&e=gif&f=58&b=262a2d)

此外，IDE会在有需要的位置建议添加记录器，并简化插入记录器语句的操作，即便记录器实例不在作用域内。

*   新检查与快速修复

新版本为 Java 实现了新的检查和快速修复，帮助用户保持代码整洁无误。

比如，IDE 现在会检测可被替换为对 Long.hashCode() 或 Double.hashCode() 方法的调用的按位操作。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abf65c36505146868119a8d262b1d221~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=540&s=208062&e=png&b=222228)

此外，新的快速修复也可以根据代码库的要求简化隐式和显式类声明之间的切换。

![新检查与快速修复_1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dce2f840726c4b2f8d6de9ec5673f79b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=206860&e=gif&f=37&b=0e1216)

另一项新检查为匹配代码段建议使用现有 static 方法，使代码可以轻松重用，而无需引入额外 API。此外，IDE现在可以检测并报告永远不会执行的无法访问的代码。

![新检查与快速修复_2.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/594590967c7541e9ae43478fceb0d8d8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=352347&e=gif&f=91&b=0e1216)

*   重构的 Conflicts Detected（检测到冲突）对话框

这次版本 2024.1 重构了 Conflicts Detected（检测到冲突）对话框以提高可读性。

现在，对话框中的代码反映了编辑器中的内容，使用户可以更清楚地了解冲突，并且 IDE 会自动保存窗口大小调整以供将来使用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7614aeadec404d43ba599611995bdbeb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=3000&h=1200&s=793820&e=png&b=222128)

另外，这次还更新了按钮及其行为以简化重构工作流，对话框现在可以完全通过键盘访问，用户可以使用快捷键和箭头键进行无缝交互。

*   Rename（重命名）重构嵌入提示

为了使重命名流程更简单、更直观，新版推出了一个新的嵌入提示，在更改的代码元素上显示。要将代码库中的所有引用更新为新版本，点击此提示并确认更改即可。

![Rename重构嵌入提示.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efccb9cba18640528610a3a25900a7dc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=248940&e=gif&f=55&b=0e1216)

版本控制系统改进
--------

*   编辑器内的代码审查

IntelliJ IDEA 2024.1 为 GitHub 和 GitLab 用户引入了增强的代码审查体验。

![编辑器内的代码审查.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b238d1838c6d4061af8fa6ddf8729b94~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=1603325&e=gif&f=304&b=1f2425)

该功能与编辑器集成，以促进作者与审查者直接互动。在检查拉取/合并请求分支时，审查模式会自动激活，并在装订区域中显示粉色标记，表明代码更改可供审查。

点击这些标记会弹出一个显示原始代码的弹出窗口，这样用户就能快速识别哪些代码已被更改。

装订区域图标可以帮助用户迅速发起新讨论，以及查看和隐藏现有讨论。另外这些图标还可以让用户更方便地访问评论，从而更轻松地完成查看、回复等功能。

*   Log（日志）标签页中显示审查分支更改的选项

新版通过提供分支相关更改的集中视图来简化了代码审查工作流。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b76fd6c65d1a4afa825a66ad78fc1612~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=243884&e=png&b=2c2b32)

对于 GitHub、GitLab 和 Space，用户现在可以在 Git 工具窗口中的单独 Log（日志）标签页中查看具体分支中的更改。用户可以点击 Pull Requests（拉取请求）工具窗口中的分支名称，然后从菜单中选择 Show in Git Log（在 Git 日志中显示）。

*   对代码审查评论回应的支持

新版开始支持对 GitHub 拉取请求和 GitLab 合并请求的审查评论发表回复，目前已有一组表情符号可供选择。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/684d4a981825485ea53d119787863443~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=142373&e=png&b=212027)

*   从推送通知创建拉取/合并请求

成功将更改推送到版本控制系统后，新版IDE将会发布一条通知，提醒用户已成功推送并建议创建拉取/合并请求的操作。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa6674cb8b2d4338b4bcc942c113df5a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=120672&e=png&b=2d2e34)

*   防止大文件提交到仓库

为了帮助用户避免由于文件过大而导致版本控制拒绝，新版IDE现在包含预提交检查，以防止用户提交此类文件并通知用户该限制。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54906a88491842a8ab0c85fc0b7e11ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=252018&e=png&b=28272e)

构建工具改进
------

*   针对 Maven 项目的打开速度提升

新版 IDEA 现在通过解析 pom.xml 文件构建项目模型。这使得有效项目结构可以在几秒钟内获得，具有所有依赖项的完整项目模型则同时在后台构建，这样一来用户就无需等待完全同步即可开始处理项目。

![针对Maven项目的打开速度提升.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8316e2dab9480a8d0282ae8a1211be~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=4394810&e=gif&f=254&b=0e1216)

*   从快速文档弹出窗口直接访问源文件

快速文档弹出窗口现在提供了一种下载源代码的简单方式。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91f0b2d73dea473eb9a8bdf0d6ba290f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=410737&e=png&b=212027)

现在当用户需要查看库或依赖项的文档并需要访问其源代码时，按 F1 即可。

更新后的弹出窗口将提供一个直接链接，用户可以使用它来下载所需的源文件，以简化工作流。

*   Maven 工具窗口中的 Maven 仓库

Maven 仓库列表及其索引编制状态现在直接显示在 Maven 工具窗口中，而不是以前 Maven 设置中的位置。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2453c46dc494da494384aaff7f2a265~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=250530&e=png&b=26252c)

*   Gradle 版本支持更新

从这个新版本开始，IntelliJ IDEA 将不再支持使用低于 Gradle 版本 4.5 的项目，并且 IDE 不会对带有不支持的 Gradle 版本的项目执行 Gradle 同步。

运行/调试更新
-------

*   多语句的内联断点

新版IDEA为在包含 lambda 函数或 return 语句的行中的断点设置提供了更方便的工作流。

![多语句的内联断点.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e46c9dfb954491185cc26b38c0f16fd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=1747196&e=gif&f=225&b=0f0e15)

点击装订区域设置断点后，IDE会自动显示可在其中设置额外断点的内联标记。每个断点都可以独立配置，释放高级调试功能。

*   条件语句覆盖

2024.1 新版使 IntelliJ IDEA 距离实现全面测试覆盖又近了一步。该项更新的重点是确定测试未完全覆盖代码中的哪些条件语句。

![条件语句覆盖.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102ac897f9064c31b394e0819d07ebb0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=3431239&e=gif&f=246&b=100f16)

现在，IntelliJ IDEA 既显示哪一行具有未覆盖的条件，还会指定未覆盖的条件分支或变量值。 这项功能默认启用。

框架和技术
-----

*   针对 Spring 的改进 Bean 补全和自动装配

IntelliJ IDEA Ultimate 现在为应用程序上下文中的所有 Bean 提供自动补全，并自动装配 Bean。

![针对 Spring 的改进 Bean 补全和自动装配.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e5269d3f22421c98668343c3a5a444~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=198549&e=gif&f=69&b=1f2024)

如果 Bean 通过构造函数自动装配依赖项，则相关字段也会通过构造函数自动装配。 同样，如果依赖项是通过字段或 Lombok 的 @RequiredArgsConstructor 注解注入，则新 Bean 会自动通过字段装配。

*   增强的 Spring 图表

新版的 Spring 模型图表更易访问。用户可以使用 Bean 行标记或对 Spring 类使用意图操作 (⌥⏎) 进行调用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d901688136d54b0aa18ac51831c33b68~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1500&h=600&s=414776&e=png&b=25242a)

同时新版为 Spring 图表引入了新的图标，增强了 Spring 原型（如组件、控制器、仓库和配置 Bean）的可视化。 此外，用户现在可以方便地切换库中 Bean 的可见性（默认隐藏）。

除此之外，其他包括像数据库工具、其他框架、语言和技术的支持等方面的更新和说明，大家也可参阅jetbrains.com/zh-cn/idea/whatsnew。

> 注：本文在GitHub开源仓库「编程之路」 [github.com/rd2coding/R…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frd2coding%2FRoad2Coding "https://github.com/rd2coding/Road2Coding") 中已经收录，里面有我整理的6大编程方向(岗位)的自学路线+知识点大梳理、面试考点、我的简历、几本硬核pdf笔记，以及程序员生活和感悟，欢迎star。