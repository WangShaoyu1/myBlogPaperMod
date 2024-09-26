---
author: "叶知秋水"
title: "window.ai-在本地跑AI大模型"
date: 2024-07-04
description: "这篇文章主要介绍了如何在ChromeCanary浏览器中本地运行AI模型。以及如何使用window.ai。"
tags: ["前端"]
ShowReadingTime: "阅读5分钟"
weight: 64
---
![未命名__2024-07-04+10_40_17.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a41f2b590bc4c848c6b8c67e8f948e9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=575&s=178618&e=jpg&b=fdfdfd)

这篇文章主要介绍了如何在Chrome Canary浏览器中本地运行AI模型。

* * *

序
=

**在设备上直接运行AI的浏览器时代即将来临。**

目前这项功能只在**Chrome Canary**版本中可用，这意味着它很快就会（或许）出现在我们面前。

在本文中，我将向你展示如何在你的设备上运行它，这样你就可以尝试一下，并思考一下你能想到的使用方式。

需要强调的是，这是本地化的，在没有互联网连接的情况下依然可以运行window.ai。

**设置**
======

启动和运行只需要5分钟！

1.  下载Chrome Canary
    
    前往[Chrome Canary网站并下载Chrome Canary](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2Fintl%2Fen_uk%2Fchrome%2Fcanary%2F "https://www.google.com/intl/en_uk/chrome/canary/")。
    
2.  启用“Gemini Nano的Prompt API”。
    
    打开Chrome Canary，在地址栏输入`chrome://flags/`并按回车。
    
    然后在顶部的搜索框中输入“prompt API”。
    
    你应该只看到一个选项“Prompt API for Gemini Nano”。
    
    将其切换为“启用”。
    

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1934f07defe14e4e9f58e0b8e18a005a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1928&h=1130&s=257629&e=png&a=1&b=ffffff)

3.  启用“启用设备上的优化指南”。
    
    当你在`chrome://flags`页面时，你需要启用第二个项目。
    
    清除之前的搜索，搜索“optimization guide on”。
    
    你应该只看到一个选项“Enables optimization guide on device”。
    
    这次你想启用它，但要选择“Enabled ByPassPerfRequirement”选项。
    

![1934f07defe14e4e9f58e0b8e18a005a~tplv-k3u1fbpfcp-jj-mark_0_0_0_0_q75.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baf70e4fba294b7da071fb2412dcea1e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1928&h=1130&s=237316&e=png&a=1&b=ffffff)

4.  安装Gemini Nano
    
    最后一步，我们需要在我们的设备上安装Gemini Nano。
    
    这实际上是一个更大工具的一部分，但我们不需要担心这个，除了它帮助我们知道要下载什么。
    
    警告：这个文件是1.5GB。它没有在任何地方告诉你这一点，所以如果你的连接速度慢/按GB付费的数据/存储空间低，你可能不想这么做！
    
    前往：“chrome://components/”。
    
    按Ctrl + f搜索“Optimization Guide”。
    
    你会看到一个项目“Optimization Guide On Device Model”。
    
    点击“检查更新”，它将安装该文件。
    

![iShot_2024-07-04_08.55.31.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49a9990533a7473a84339a7f937f159c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2010&h=956&s=163376&e=png&a=1&b=fefefe)

5.  完成！
    
    最后一步：重启Chrome Canary以使更改生效。
    
    添加完毕，现在我们可以继续使用本地AI了！
    

**使用window.ai**
===============

如果一切按预期工作，那么现在你应该能够在打开DevTools（F12），前往“控制台”标签页并开始玩耍！

检查的最简单方法是在控制台中输入window.，看看ai是否作为选项出现。

![iShot_2024-07-04_08.56.46.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40b467924c04434f8d724f9a67754f01~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1194&h=950&s=215358&e=png&a=1&b=fefafa)

*   `canCreateGenericSession` 和 `canCreateTextSession` 仅用于检查您是否具备使用这些特性所需的一切。如果结果是 'readily'，则表示您已经准备好了。
*   `createGenericSession` 和 `createTextSession` 用于创建会话，您可以从这些会话中使用模型。
*   `defaultGenericSessionOptions` 和 `defaultTextSessionOptions` 简单地返回最后两个函数使用的默认选项参数。

如果没有，请回去检查你是否漏掉了哪一步！

**创建我们的第一个会话。**

只需要一个命令就可以启动与我们的AI模型的会话。

javascript

 代码解读

复制代码

`const chatSession = await window.ai.createTextSession();`

提示：不要忘记await！

还有一个createGenericSession()的选项，但我还不清楚它们之间的区别！

现在我们可以使用该会话来提问。

**发送提示**

为此，我们只需要在我们的chatSession对象上使用.prompt函数！

javascript

 代码解读

复制代码

`const result = await chatSession.prompt('hi, what is your name?');`

再次提醒，所有异步操作，不要忘记await。

根据你的提示的复杂性和你的硬件，这可能需要从几毫秒到几秒钟的时间，但最终你应该会在控制台看到undefined，一旦它完成了。

![iShot_2024-07-04_09.02.02.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98af35604d8f4d53ad4b120fc40e080e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1182&h=1022&s=281186&e=png&a=1&b=fcf6f5)

从这里可以看到它是真的支持离线使用的。

你不想一直发送多个命令，所以你可以将这个函数复制并粘贴到你的控制台中，以使事情变得更容易：

javascript

 代码解读

复制代码

`async function askLocalGPT(promptText){   if (window.chatSession){     console.log('starting chat session');     window.chatSession = await window.ai.createTextSession();     console.log('chat session created');     return console.log(await chatSession.prompt(promptText));   } }`

现在你只需要在控制台中输入askLocalGPT("prompt text")。

另外经过测试发现它现在还不能记住上下文

![iShot_2024-07-04_10.10.17.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55e2055160e7429988bfc43e0d0f3de4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1154&h=384&s=100892&e=png&a=1&b=fefdfd)

目前还找不到API的详细介绍，截止目前测试了`systemPrompt`,`initialPrompts`参数似乎也未见生效。

使用评价
====

好用吗？响应速度一般。

不好用？真的吗？

这其实取决于你使用的衡量标准。如果你试图将它与Claude或ChatGPT进行比较，那是很糟糕的。

然而，对于本地玩耍和实验来说，它是很棒的！

所以如果你想进行一个模型“记住”之前说过的话的对话，你需要用你的新问题来提供之前的问题和答案。

**它好玩吗？**

是的。

我能够让它在我的浏览器中本地工作，这很酷。它还可以做简单的编码问题等。

而且，美妙之处在于没有大账单！你可以随意使用完整的32k上下文窗口，而不必担心因错误而产生大账单。

我只是触及了新API的表面，现在也只是出于本地AI的早起起步阶段。

**本地AI有什么意义？**

目前，希望使用语言模型的Web开发人员必须要么调用云API，要么自带并使用WebAssembly和WebGPU等技术运行它们。通过提供对浏览器或操作系统现有语言模型的访问，我们可以提供以下与云API相比的优势：

*   本地处理敏感数据，例如允许网站结合AI功能和端到端加密。
*   潜在的更快结果，因为没有服务器往返。
*   离线使用。
*   为Web开发人员降低API成本。

一旦AI对所有人在浏览器中可用，我们也就有了更大的想象空间：

*   **通过 AI 增强内容消费**：包括摘要、回答有关某些内容的问题、分类和特征。
*   **AI 支持的内容创作**：例如写作辅助、校对、语法更正和重新表述。