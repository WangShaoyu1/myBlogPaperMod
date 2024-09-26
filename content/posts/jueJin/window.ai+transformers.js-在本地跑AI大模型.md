---
author: "叶知秋水"
title: "window.ai+transformers.js-在本地跑AI大模型"
date: 2024-07-17
description: "transformers.js是一个JavaScript库，直接在浏览器运行，不需要服务器。支持如下功能：📝自然语言处理：文本分类、命名实体识别、问题回答、语言建模、总结、翻译、多项选择和文本"
tags: ["前端","AIGC"]
ShowReadingTime: "阅读2分钟"
weight: 81
---
> 之前介绍了如何在控制台使用window.ai的功能，多少体验上不太好。这次结合transformers.js来看看最新的打开方式。

transformers.js 是一个 JavaScript 库，直接在浏览器运行，不需要服务器。支持如下功能：

*   📝自然语言处理：文本分类、命名实体识别、问题回答、语言建模、总结、翻译、多项选择和文本生成。
*   🖼️计算机视觉：图像分类、对象检测和分割。
*   🗣️音频：自动语音识别和音频分类。
*   🐙多模态：零拍摄图像分类。

最近它也支持谷歌内置的模型，具体可以参考：[github.com/xenova/tran…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxenova%2Ftransformers.js%2Ftree%2Fchrome-built-in-ai "https://github.com/xenova/transformers.js/tree/chrome-built-in-ai")

在这里，我们直接来看看它是如何跟谷歌内置模型搭配使用的。先来体验一下案例。

Demo案例
======

结合transformers.js使用，速度还是很快的。

[windowai.miniwa.site/](https://link.juejin.cn?target=https%3A%2F%2Fwindowai.miniwa.site%2F "https://windowai.miniwa.site/")

主要包含以下功能

*   检测是否支持window.ai
*   点击加载模型后，可以实现模型对话聊天

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b8b6a5bf7614431989ccfb583197569b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1727235693&x-signature=sqPjPrnrp2Uph%2FUWT3j3fAvF%2BeQ%3D)

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/388ba9c961a7431b8474e195dbff0be3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1727235693&x-signature=pLP0kDor4JqsiiiS%2BsujGJveaVs%3D)

开启浏览器支持window.ai可以参考这个文章：[juejin.cn/post/738730…](https://juejin.cn/post/7387306673207050292#comment "https://juejin.cn/post/7387306673207050292#comment")

### 模型相关的实现

首先需要加载模型，transformers.js提供了简单的api来实现模型加载

arduino

 代码解读

复制代码

`pipeline('text-generation', 'Xenova/gemini-nano');`

作者使用的是一个单例的模式：

csharp

 代码解读

复制代码

`class TextGenerationPipeline {     static model_id = 'Xenova/gemini-nano';     static instance = null;     static async getInstance() {         this.instance ??= pipeline('text-generation', this.model_id);         return this.instance;     } }`

主要流程是加载和通信，考虑到ai交互可能是一个耗时的操作。作者使用了worker处理。以下是worker的主要代码：

php

 代码解读

复制代码

`import {     pipeline,     InterruptableStoppingCriteria,     RawTextStreamer, } from '@xenova/transformers'; async function generate(messages) {     const generator = await TextGenerationPipeline.getInstance();     const cb = (output) => {         self.postMessage({             status: 'update',             output,         });     }     const streamer = new RawTextStreamer(cb);     self.postMessage({ status: 'start' });     const output = await generator(messages, {         streamer,         stopping_criteria,         // Greedy search         top_k: 1,         temperature: 0,     })     if (output[0].generated_text.length === 0) {         // No response was generated         self.postMessage({             status: 'update',             output: ' ', tps: null, numTokens: 0,         });     }     // Send the output back to the main thread     self.postMessage({         status: 'complete',         output: output[0].generated_text,     }); } async function load() {     self.postMessage({         status: 'loading',         data: '正在加载模型...'     });     // 获取模型实例     const generator = await TextGenerationPipeline.getInstance(x => {         self.postMessage(x);     });     self.postMessage({         status: 'loading',         data: '正在加载模型...'     });     // 检测是否已经ready     await generator('1+1=');     self.postMessage({ status: 'ready' }); } // 监听消息 self.addEventListener('message', async (e) => {     const { type, data } = e.data;     switch (type) {         case 'load':             load().catch((e) => {                 self.postMessage({                     status: 'error',                     data: e,                 });             });             break;         case 'generate':             stopping_criteria.reset();             generate(data);             break;         case 'interrupt':             stopping_criteria.interrupt();             break;         case 'reset':             stopping_criteria.reset();             break;     } });`

可以看到这里主要是通过监听message消息跟外界交互。

*   self，类似于主线程中的 window 对象，指向woker自身；
*   收到load指令时，启动模型加载，并内部测试
*   收到generate指令时，调用模型的generator方法获取模型结果，并通过postMessage传递出去