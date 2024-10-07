---
author: "前端开发爱好者"
title: "等了7年，开发者呼声极高的VSCode“浮动窗口”特性终于要来了！！！"
date: 2023-11-09
description: "等了7年，开发者呼声极高的VSCode浮动窗口特性，终于实现了。其实浮动窗口的提案，早在2016年就有人提出，当时提出这个issues的目的在于可以利用大屏幕空间和/或多显示器截止到目前"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读3分钟"
weight: 778
---
> 哈喽,大家好 我是 `xy`👨🏻‍💻。VSCode `浮动窗口` 的特性终于要来了 💪

等了 7 年，开发者呼声极高的 VSCode `浮动窗口` 特性，终于实现了。

其实`浮动窗口`的提案，早在`2016`年就有人提出，当时提出这个`issues`的目的在于`可以利用大屏幕空间和/或多显示器`

> Allow for floating windows #10121: `https://github.com/microsoft/vscode/issues/10121`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5fcc4ee85a437a8ff3333d77d0fed6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1213&h=301&s=64605&e=png&b=252a32)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13b706bb110e43c0b5b8b3fa8534d194~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1847&h=696&s=74149&e=png&b=22272e)

截止到目前改`issues`已经接近`3000`点赞数和`上百条`的回复，可见开发者对这一提案的呼声极高:

评论一:

我认为编辑器选项卡比其他选项卡更重要。当您无法断开选项卡时，真的很难使用`两个显示器`。这在引用代码时很重要，而且对于 `Markdown` 预览等内容也很重要。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b938fb9c27e84b178268be028a8d7a2e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=944&h=181&s=16063&e=png&b=242930)

评论二:

想要附和“`me-to`”。

特别是编辑器选项卡。不幸的是，问题作者的优先级如此落后，但我不敢相信微软没有人在过去一年的某个时候看到过这个issues，认识到能够从一个编辑器选项卡中拖动编辑器选项卡的巨大价值另一个窗口（您的 Visual Studio 团队几十年来一直在这样做），并且现在已经实现了这一点。

`这是 VSCode 作为编辑器的严重不足`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/213541ca26374408a071186d7ecac5da~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=948&h=296&s=26393&e=png&b=242930)

评论三:

我使用 `Visual Studio` 作为主要编辑器大约 9 年，然后在转到纯前端项目团队后切换到 VS Code。VS Code 有很多值得喜爱的地方，但对我来说，一个重要的缺失功能是缺少浮动的编辑器选项卡窗口（就像我在 Visual Studio 中习惯的那样）。

比如我并排使用 4 个显示器。仅在一台显示器上进行代码编辑感觉很疯狂，尤其是当我`同时处理多个文件`时。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1232906e9554951915e2fc8e22c8c91~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=939&h=261&s=26946&e=png&b=242930)

评论四:

我必须同意上面的评论。对于那些拥有多个显示器的人（基本上是所有使用代码的人）来说，缺乏此功能是一个巨大的问题。显然，您可以通过在单独的 (ctrl + shift + N) Visual Studio Code 实例中打开特定文件来解决这个问题，但这绝对是应该尽快解决的问题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/946b2a5092b148f384520374c87711b2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=959&h=217&s=18627&e=png&b=242930)

迫不及待的更新了一把，目前 `VSCode` 最新版本是 1.84.0，具体更新内容如下：

*   `更多音频提示`：新的音频提示可指示清除、保存和格式化活动。
    
*   `自定义活动栏位置`：将活动栏移至顶部以紧凑显示。
    
*   `隐藏编辑器选项卡`：显示多个、单个或不显示编辑器选项卡。
    
*   `最大化 Editor Groups`：快速展开活动的 Editor Group。
    
*   `Python 改进`：更好地在终端中运行代码，更轻松地创建虚拟环境。
    
*   `FastAPI 教程`：了解如何使用 VS Code 开发 Python FastAPI 应用程序。
    
*   `Gradle for Java`：改进了对 Java Gradle 项目的支持。
    
*   `Preview：GitHub Copilot`：聊天 “代理”，生成 commit 消息，终端支持。
    

查看 Github 的 issue，翻到最后，看到最后一次官方成员`bpasero`的回复是在四天前

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8392fd79084e45a8b3981e007c214c90~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=914&h=777&s=214394&e=png&b=23282f)

回复的大致内容是:

我们非常高兴和激动地宣布，即将推出浮动编辑器的预览版。更多信息请参见: [code.visualstudio.com/updates/v1\_…](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_84%23_floating-editor-windows "https://code.visualstudio.com/updates/v1_84#_floating-editor-windows") 。

对于希望尝试此功能并提供反馈的用户，请：

*   安装 `VS Code Insiders`
*   在编辑器上使用`Move Active Editor into a New Window`查看效果

并且最后提到计划将此功能的实验版本发布到下一个稳定版本。

意思就是最新的 `VSCode1.84.0` 版本还没有添加这个功能，目前只发布到了`VS Code Insiders`版本中，稳定版本会在下个版本发布。

需要体验的小伙伴们可以自行前往下载: `https://code.visualstudio.com/insiders/`

最后
--

> 如果觉得本文对你有帮助，希望能够给我点赞支持一下哦 💪 也可以关注wx公众号：**`前端开发爱好者`** 回复加群，一起学习前端技能 公众号内包含很多`实战`精选资源教程，欢迎关注