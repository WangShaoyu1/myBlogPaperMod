---
author: "叶知秋水"
title: "深入浅出剖析Screenshot-to-code：快来释放一只手吧！"
date: 2024-06-21
description: "本文主要介绍Screenshot-to-code的实现原理，如何实现代码生成、如何实现选定节点二次调优UI、如何在本地运行项目。身为前端的你还等什么？赶紧来释放双手吧。"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读10分钟"
weight: 65
---
![未命名__2024-06-21+21_28_12.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eedadc97aaba4d6686a2b255ac64af7d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=459&s=288598&e=png&b=ffffff)

本文主要介绍Screenshot-to-code的实现原理，如何实现代码生成、如何实现选定节点二次调优UI、如何在本地运行项目。身为前端的你还等什么？赶紧来释放双手吧。

项目介绍
----

"Screenshot-to-code"（截图转代码）是一种将用户界面（UI）的截图自动转换成可编辑的前端代码的技术。这种技术通常由人工智能（AI）驱动，能够识别截图中的UI元素，如按钮、文本框、列表等，并将它们转换成相应的HTML、CSS和JavaScript代码，具备以下特点：

1.  **自动化**：通过自动化的方式，减少手动编写前端代码的时间和劳动强度。
    
2.  **AI识别**：使用机器学习算法来识别截图中的UI元素和布局。
    
3.  **前端代码生成**：将识别的UI元素转换成HTML标记、CSS样式和JavaScript逻辑。
    
4.  **提高效率**：允许开发人员专注于更复杂的功能实现，而不是花费大量时间编写基础的UI代码。
    
5.  **实时反馈**：一些工具可以提供实时预览，允许用户在生成代码之前调整UI元素。
    
6.  **定制化**：用户可以根据自己的需求调整生成的代码，以满足特定的功能或样式要求。
    

"Screenshot-to-code"尽管不能完全取代手动编码，但对于快速原型开发和加速前端开发流程非常有用，作者是**Abi Raja**截止到当前已经有53.9k的star。

项目地址：[github.com/abi/screens…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fabi%2Fscreenshot-to-code "https://github.com/abi/screenshot-to-code")

效果如下：也可以看git项目。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10c0dcb3c40c49df9223c4f01eb9d0d5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1232&h=720&s=5351923&e=gif&f=341&b=f9f8f5)

那它是怎么实现的呢？我们一起来看看

核心技术——前端
--------

Screenshot-to-code，里面包含了前端和后端。前端用的是react+vite+radix-ui，后端用的是python+poetry。

先来介绍一下前端：

核心代码基本都在App.tsx，整个项目只有1个页面，通过websocket请求后端，获取到数据后，显示到前端。

项目里用到的三个不错的外部库：

codemirror：代码编辑器

react-hot-toast：toast组件

zustand：状态管理

业务流程如下：

![无标题文档-流程图.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fefe53cdb3b44d689c3503d837b8babc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1011&h=2331&s=130024&e=png&b=ffffff)

以上是对话的过程，在生成代码预览的功能上，主要是使用了iframe实现，通过给iframe设置srcdoc来更新文档，实现逐步显示的效果，还贴心的做了节流。

除此之外里面还有一个比较实用的技巧，针对已经生成的页面做点对点的微调。这个是怎么实现的？

1、从上面的代码可以看到，对body监听了click事件，这个很重要。

2、click拿到的event被传递到EditPopup组件，组件内通过这个事件对象可以拿到位置显示那个对话弹窗。

3、通过event的target获取到Dom元素，有dom元素就可以通过outHtml获取具体的html内容了。二次修改的时候就可以把当前的html及要修改的内容一起发过去以及更新具体的内容。

4、返回的是完整的html，直接替换就完事。

核心技术——后端
--------

后端主要使用的是python语言，通过poetry管理项目，有点类似node的npm，Poetry 是一个 Python 包管理器和依赖管理器，它旨在提供一种更人性化、更可靠的方式去处理 Python 项目的依赖关系。python需要3.10以上。要提前安装好poetry和pyright，后者类似ts，主要检测类型。

核心文件：

routes/generate\_code.py：核心接口，主要用于代码生成

llm.py：调用大模型的接口

具体流程如下：

![无标题文档-流程图 (1).jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d0114e945974c51ac5235cea8b15888~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=411&h=2331&s=79556&e=png&b=ffffff)

所以，其实就是调用gpt生成的代码。调用的方式是通过AsyncOpenAI（[platform.openai.com/docs/api-re…](https://link.juejin.cn?target=https%3A%2F%2Fplatform.openai.com%2Fdocs%2Fapi-reference%2Fchat%2Fcreate%25EF%25BC%2589%25E3%2580%2582 "https://platform.openai.com/docs/api-reference/chat/create%EF%BC%89%E3%80%82")

既然是调用gpt那最重要的当然是prompts。来看看它的prompts，bob翻译如下，可以简单看一下：

首次：

> xml
> 
>  代码解读
> 
> 复制代码
> 
> `您是Tailwind的专家开发人员 您从用户那里截取参考网页的屏幕截图，然后构建单页应用程序 使用Tailwind、HTML和JS。 您可能还会收到您已经构建的网页的屏幕截图（第二张图片），并被要求 更新它，使其看起来更像参考图像（第一张图像）。 -确保应用程序看起来与屏幕截图一模一样。 - 密切关注背景颜色、文本颜色、字体大小、字体系列， 填充、边距、边框等。准确匹配颜色和尺寸。 -使用屏幕截图中的确切文本。 -不要在代码中添加注释，如“<!--根据需要添加其他导航链接-->”和“<!-...其他新闻项目...-->”来代替编写完整代码。编写完整的代码。 -根据需要重复元素以匹配屏幕截图。例如，如果有15个项目，代码应该有15个项目。不要留下“<!--对每个新闻项目重复-->”等评论，否则坏事会发生。 -对于图像，请使用来自https://placehold.co的占位符图像，并在替代文本中包含图像的详细描述，以便图像生成AI可以稍后生成图像。 在lib方面， -使用此脚本包括尾风：<script src="https://cdn.tailwindcss.com"></script> - 您可以使用谷歌字体 - Font Awesome图标字体：<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link> 仅返回<html></html>标签中的完整代码。 不要在开头或结尾包含标记“```”或“```html”`

二次修改：

> xml
> 
>  代码解读
> 
> 复制代码
> 
> `您是Tailwind的专家开发人员。 -不要在代码中添加注释，如“<!-- Add other navigation links as needed -->”和“!-- ... other news items ... -->”来代替编写完整代码。编写完整的代码。 -根据需要重复元素。例如，如果有15个项目，代码应该有15个项目。不要留下“<!-- Repeat for each news item -->”等评论，否则坏事会发生。 -对于图像，请使用来自https://placehold.co的占位符图像，并在替代文本中包含图像的详细描述，以便图像生成AI可以稍后生成图像。 在lib方面， -使用此脚本引入Tailwind：<script src="https://cdn.tailwindcss.com"></script> - 您可以使用谷歌字体 - Font Awesome 作为字体文件：<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link> 仅返回<html></html>标签中的完整代码。 不要在开头或结尾包含标记“```”或“```html”。`

从这里也可以看出gpt其实像一个听话的三好学生，你给它足够准确的提示，它会生成更精确的内容。

如果要自己搭建的，可以对上面的prompts做二次修改或者增加，文件在prompts/screenshot\_system\_prompts.py和imported\_code\_prompts.py。

这个项目跑起来还是比较容易的，我的步骤如下：

1、环境准备python3.10.x，poetry 、pright，升级或者安装流程可以问大模型

2、执行如下命令

bash

 代码解读

复制代码

`cd backendecho  "OPENAI_API_KEY=sk-your-key" > .env poetry install poetry shell poetry run uvicorn main:app --reload --port 7001`

.env文件需要配置一下OPENAI\_API\_KEY。还有其他配置可以看readme。

如果不想连gpt，用本地mock可以跑这个命令：

ini

 代码解读

复制代码

`MOCK=true poetry run uvicorn main:app --reload --port 7001`

项目启动后支持热更新。

总结
--

以上就是对这个项目的体验。我们内部测试了一下效果，还是值得入手的，写代码不会太差，加上可以微调，基本可以出一个框架了。可以自己改造一下，增加对element-ui、vant等开源框架的识别。叫它用scss写样式，生成vue单文件之类的也是可以的。

后期如果模型训练的复杂度下降了，能接入自己公司的组件库、接口文档之类的就可以更上一层楼了。

你心动了吗？心动不如行动，赶紧去试试吧。