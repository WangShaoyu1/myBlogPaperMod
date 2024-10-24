---
author: "Sunshine_Lin"
title: "Vue3 + BigModel 开放平台，搭建超强的前端增效工具"
date: 2024-09-25
description: "最近公司前端团队内部，为了提高整体的开发效率，上级要求我们中台组搭建一个内部的 AI 平台，主要是两种场景： 🎈 1、AI 生成图片，为了生成一些图片供给前端团队使用 🎈 2、AI 问答，顾名思义，就"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:19,comments:0,collects:34,views:1396,"
---
最近公司前端团队内部，为了提高整体的开发效率，上级要求我们中台组搭建一个内部的 AI 平台，主要是两种场景：

*   🎈 1、AI 生成图片，为了生成一些图片供给前端团队使用
*   🎈 2、AI 问答，顾名思义，就是为了解答前端成员的问题

大体的页面如下

![zhipu-1-2.gif](/images/jueJin/b154f132bb1141b.png)

🤔 AI 模型
--------

想要实现这个内部的 AI 平台，就得用到 AI 模型，什么是 AI 模型呢？

![image.png](/images/jueJin/65b3381a3d73405.png)

你可以理解 AI 模型是一个知识库，知识库里面已经有现成的知识了，你可以从里面去获取到知识，你也可以训练它，让他去学习更多的知识 ✨

![image-5.png](/images/jueJin/6d7893f8978d4fd.png)

所以想要完成这个内部 AI 平台，我需要选一个 **AI 模型**，并且通过 **Nodejs** 去请求获取目标知识 🙇🏻

🤖 BigModel 开放平台
----------------

在 AI 模型的选型上，我注重两个方面：

*   **1️⃣ 上手门槛要低，且要免费**
*   **2️⃣ 必须得是国产中的佼佼者**
*   **3️⃣ 模型要够大，够大知识才够完善**

🙌 于是我挑选了 **BigModel** 来作为我这一次的 AI 模型，因为顾名思义，它够**Big**、够大，而且非常火爆的代码生成模型 **CodeGeex** 就是他们家的！！！ 🙌

🙌 而且首页的标语吸引了我：**几行代码接入大模型，极速构建变革性AI体验。** 🙌

> 官网：[bigmodel.cn/](https://link.juejin.cn?target=https%3A%2F%2Fbigmodel.cn%2F "https://bigmodel.cn/")

![image-3.png](/images/jueJin/58233d2229574c6.png)

**BigModel** 提供了多种不同类型的 AI 模型供我们选择，每一个模型都是术业有专攻，我们只需要根据我们的需求去按需选择即可

> 文档：[bigmodel.cn/dev/howuse/…](https://link.juejin.cn?target=https%3A%2F%2Fbigmodel.cn%2Fdev%2Fhowuse%2Fmodel "https://bigmodel.cn/dev/howuse/model")

![image-4.png](/images/jueJin/3df8605a75a2413.png)

由于我这一次做的是**图片生成、问答**，所以我选择以下两个模型：

*   **GLM-4-0520：** 高智能模型，适用于处理高度复杂和多样化的任务 ✅
*   **CogView-3：** 图片生成，根据用户文字描述快速、精准生成图像 ✅

🙇🏻 API Key
------------

想要调用 **BigModel** 提供的 AI 模型，需要先登录并获取 **API Key**

这个 **API Key** 到时在 Nodejs 请求的时候需要用到

![image-29.png](/images/jueJin/835e1a4e5231418.png)

💻 请求 BigModel 接口
-----------------

**BigModel** 提供了非常详细的接口文档，且传参都很语义化，你可以根据你所选的模型去请求不同的接口

![image-7.png](/images/jueJin/36842a866f8e4f7.png)

> 接口文档：[bigmodel.cn/dev/api/nor…](https://link.juejin.cn?target=https%3A%2F%2Fbigmodel.cn%2Fdev%2Fapi%2Fnormal-model%2Fglm-4 "https://bigmodel.cn/dev/api/normal-model/glm-4")

最让我感到兴奋的是，**BigModel** 为大部分编程语言都提供了对应的请求库，让你请求BigModel 接口时，更加方便快捷，就比如针对 `Nodejs`，**BigModel** 提供了 **zhipuai-sdk-nodejs-v4**

![image-27.png](/images/jueJin/5d9392e0d1e3485.png)

💻 Nodejs 请求，So Easy~
---------------------

我们需要起一个 `Nodejs` 服务来请求 **BigModel** 大模型

```bash
npm init
npm i express zhipuai-sdk-nodejs-v4 body-parser
```

*   **zhipuai-sdk-nodejs-v4**，用来请求 BigModel 大模型
*   express、body-parser 用来起服务，以及接受前端请求体

对于请求两个 AI 模型，我编写了两个接口：

*   1️⃣ /api/v1/ai/image：请求 **CogView-3** 模型
*   2️⃣ /api/v1/ai/agent：请求 **GLM-4-0520** 模型

`Nodejs` 部分的代码如下

![image-9.png](/images/jueJin/c24d046fcac54aa.png)

💻 前端页面
-------

前端使用的是 `Vue3` 来进行页面编写，前端这边也需要安装几个插件，主要是用来展示 **GLM-4-0520** 返回的 `markdown` 格式响应

```bash
pnpm i marked github-markdown-css highlight.js marked-highlight
```

**Index.vue**

![image-11.png](/images/jueJin/66a87b55247449d.png)

**Image.vue**

![image-14.png](/images/jueJin/4e2a7973bfe442b.png)

**Agent.vue**

![image-13.png](/images/jueJin/f013c0d50579486.png)

🚀 最终效果
-------

这样就能通过调用 **BigModel** 提供的 AI 模型来实现我们想要的效果

![zhipu-2.gif](/images/jueJin/d59cf78964d34e7.png)

![zhipu-3.gif](/images/jueJin/4442ade54fe4441.png)

打造属于自己的大模型
----------

**BigModel** 是一个非常人性化的开放平台，它允许我们开发者去定制训练属于自己的大模型，我现阶段做的 **内部 AI 平台**，其实拿的知识库还是从公网里去获取的，但是想要实现真正的 **内部知识库**，我需要自己去训练一个，那么 **内部知识库** 到底包含什么呢？其实有两部分：

*   前端内部的一些知识文档 ✅
*   前端内部的一些代码 ✅

> 顺便提一嘴，**BigModel** 支持私有化部署，让你打造真正的 **内部知识库模型**

我们需要把这两部分导入到 **BigModel** 知识库中，刚好它支持导入文档、url

### 创建知识库

![image-15.png](/images/jueJin/61b970aac245488.png)

导入方式很简单，我们只需要创建知识库，并导入知识即可

![image-18.png](/images/jueJin/0981b229967e4d0.png)

我这里是新建了两个知识库：

*   1️⃣ 内部前端文档库，导入的是一些内部的前端文档PDF
*   2️⃣ 内部前端代码库，导入的是一些内部的前端代码仓库链接

![image-17.png](/images/jueJin/dfca5444b79e47f.png)

### 创建机器人应用

当你的知识库创建完毕之后，你需要创建一个应用去获取这些知识，并呈现到你面前

![image-19.png](/images/jueJin/ff71f8224b3e4da.png)

点击右上角的创建按钮，进行创建，这里创建的是**问答机器人**

![image-20.png](/images/jueJin/7472721cc4064fb.png)

应用需要绑定你想绑定的知识库，比如我这里就绑定了刚刚创建的两个知识库，并且同时你得选择一个现有模型，它能帮你做兜底，当知识库不满足你的提问时，模型会帮你去寻找答案

![image-22.png](/images/jueJin/d3f75413b9b845e.png)

### 调试 & 发布

一切准备就绪，我们可以调试一下，看看是否达到我们的预期，我们选择一些知识库中的知识点，去进行提问，就比如下面这个知识点

![image-23.png](/images/jueJin/84b62bd70b7240e.png)

可以看到还是符合预期的，这说明我们的应用打造成功了

![image-24.png](/images/jueJin/3bcfb2ec92d8441.png)

接下来可以点击右上角的发布按钮啦~~ 发布后你可以自己用，也可以分享给其他人使用，非常方便~~

![image-26.png](/images/jueJin/f098fcfb3e23455.png)

![image-25.png](/images/jueJin/17aad92d7b7940a.png)

🎉 BigModel，无限可能
----------------

这一次使用 **BigModel** 让我体验到了什么是 **几行代码接入大模型，极速构建变革性AI体验。**

🎉🎉 这一次只是用到了 **BigModel** 的 **GLM-4、CogView-3** 这两个 AI 模型，但是其实 **BigModel** 还有很多好用的 AI 模型 ，它也成为了我今后搭建 AI 平台的不二之选！！！ 🎉🎉

🎉🎉 **BigModel，真的有无限的可能！！！** 🎉🎉