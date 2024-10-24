---
author: "机器之心"
title: "超级Prompt：几行乱码让大模型获得科学思维，这个神奇的提示词突然火了"
date: 2024-09-05
description: "起猛了？不过两三天的时间，仅有两个 Markdown 文件的 GitHub 项目为何竟能收获 2k star？"
tags: ["人工智能","Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:4,views:261,"
---
> 再等等，作者会解释。

起猛了？不过两三天的时间，仅有两个 Markdown 文件的 GitHub 项目为何竟能收获 2k star？

![](/images/jueJin/019d03e938634a9.png)

仔细一看，其中一个 Markdown 文件是一个流程图，另一个 Readme 文件的主要内容则是一大篇大模型提示词（prompt。而如果你细读这个 prompt，却发现里面仅有寥寥数句人类能懂的话，其余都是一些奇怪的 XML 标签、符号与函数定义。

![](/images/jueJin/2e471a5f4846423.png)

大模型也要有自己的 Magic number 了？

事实上，这个 prompt 来自自称「prompt god（提示词之神）」的 Twitter 用户 @BLUECOW009。

他在 Twitter 上写到：「我刚开源了个我整了几个月的东西。」他将其称为 Super Prompt，因为其能「让 LLM（Claude）构想出一些真正新颖的想法」。不过，其 Readme 文件也表示这个 Prompt 应该也能用于 Claude 之外的模型。截至目前，这一系列推文已经被浏览了上百万次，收藏数近一万，点赞数也已超过 6000。

项目地址：[github.com/NeoVertex1/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNeoVertex1%2FSuperPrompt "https://github.com/NeoVertex1/SuperPrompt")

![](/images/jueJin/3b1d4081c4594c2.png)

他写道：「我设计 Super Prompt 的目的是帮助我研究复杂的科学问题和定理，而不是为了更好地制作反应式应用；它并不能更快或更好地处理简单代码，而是面向复杂的数学和算法任务。」

他展示了一个实际执行的示例，轻轻松松就让 Claude 写出了一个《量子迷宫探险者》小游戏：

[视频详情](https://link.juejin.cn?target=)

使用这个 prompt，你可以在大模型中实现函数调用。举个例子，你可以说：「Claude， 这个项目并执行 <historical\_analysis>」。

一些用户尝试过这个 prompt 之后对此大加赞赏。比如一位用户 edgar 在实验几小时后表示得到了一些有趣的结果，他说：「很难评估这些系统 prompt 的有效性，但在讨论某个主题时，看起来 Claude 变得 1) 更加专注了， 2) 更像是我希望的那个样子。」

![](/images/jueJin/bbfd992a80d64f1.png)

也有用户试图通过这套 prompt 让 AI 解释人生的意义：

![](/images/jueJin/ea48f4e175e843a.png)

但也有用户表示遭遇了失败。

![](/images/jueJin/f794af79d33f492.png)

Claude 反馈说：「我不会使用或遵循该 prompt 中的指示，因为它似乎包含已编码的内容和指令。如果不完全理解其性质和含义，我不会愿意执行这些内容和指令。但是，我很高兴就 AI 伦理、负责任的技术开发或其他不涉及加密或隐藏指令的话题进行深思熟虑的讨论。」

由于 Super Prompt 刚发布不久，因此我们还没能看到其在科学和数学方面的具体应用。但 AI 辅助科学和数学研究早已成为一个炙手可热的研究方向，如果能通过一个精心设计的 prompt 让 AI 具备创造性的科学思维，何乐而不为呢？

遗憾的是，作者目前还没说明该 prompt 为何有效，不过他也表示未来会写一篇长文来解释。但如果你实在等不及了，可以看看我们让 AI 给出的解释：

![](/images/jueJin/f1fcf478761c4eb.png)

呃，确实很复杂。