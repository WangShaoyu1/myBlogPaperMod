---
author: "冴羽"
title: "Nextjs 项目接入 AI 的利器 —— Vercel AI SDK"
date: 2024-06-05
description: "首先我们花 10 分钟使用 Nextjs 快速部署一个 ChatGPT 聊天网站，效果如下： 不过巧妇难为无米之炊，首先你要有： 一个 ChatGPT 35 的 API KEY（必须，40 也可"
tags: ["前端","React.js","Next.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:47,comments:2,collects:71,views:7208,"
---
> 本文为稀土掘金技术社区首发签约文章，30天内禁止转载，30天后未获授权禁止转载，侵权必究！

前言
--

首先我们花 10 分钟使用 Next.js 快速部署一个 ChatGPT 聊天网站，效果如下：

![1.gif](/images/jueJin/09e6db4b96a54a0.png)

不过巧妇难为无米之炊，首先你要有：

1.  一个 ChatGPT 3.5 的 API KEY（必须，4.0 也行，修改对应的 model 名就行）
2.  一个好的网速（非必须，但可能 10 分钟就搞不定了）

废话不多说，让我们直接开始吧！

> 1.  本篇已收录到掘金专栏[《Next.js 开发指北》](https://juejin.cn/column/7343569488744611849 "https://juejin.cn/column/7343569488744611849")
>     
> 2.  系统学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！
>     

十分钟部署版
------

使用 Next.js 官方脚手架创建一个新项目：

```bash
npx create-next-app@latest
```

运行效果如下：

![image.png](/images/jueJin/10579998fa944a8.png)

为了样式美观，我们会用到 Tailwind CSS，所以**注意勾选 Tailwind CSS**，其他随意。

为了快速实现，我们需要用到 `ai` 、`@ai-sdk/openai` 这两个 npm 包，其中`ai` 是 Vercel 提供的用于接入 AI 产品、处理流式数据的库， `@ai-sdk/openai`是 Vercel 基于 openAI 官方提供的 SDK `openai` 的封装。

安装一下依赖项：

```bash
npm install ai @ai-sdk/openai
```

> 注：写这篇文章的时候，ai 版本为 3.1.23， @ai-sdk/openai 版本为 0.0.18，未来 SDK 的用法可能会修改

修改 `app/page.js`，代码如下：

```jsx
'use client';

import { useChat } from 'ai/react';

    export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    {messages.map(m => (
    <div key={m.id} className="whitespace-pre-wrap">
{m.role === 'user' ? 'User: ' : 'AI: '}
{m.content}
</div>
))}

<form onSubmit={handleSubmit}>
<input
className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
value={input}
placeholder="Say something..."
onChange={handleInputChange}
/>
</form>
</div>
);
}
```

新建 `app/api/chat/route.js`代码如下：

```javascript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

    const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://api.openai-proxy.com/v1"
    });
    
    export const maxDuration = 30;
    
        export async function POST(req) {
        const { messages } = await req.json();
        
            const result = await streamText({
            model: openai('gpt-3.5-turbo'),
            messages,
            });
            
            return result.toAIStreamResponse();
        }
```

新建 `.env.local`文件，代码如下：

```javascript
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

修改 `app/globals.css`，注释掉这些部分（为了样式美观而已）：

```javascript
    /* :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;
}

    @media (prefers-color-scheme: dark) {
        :root {
        --foreground-rgb: 255, 255, 255;
        --background-start-rgb: 0, 0, 0;
        --background-end-rgb: 0, 0, 0;
    }
    } */
```

命令行运行 `npm run dev`，浏览器无痕模式（为了避免插件等干扰）打开 [http://localhost:3000/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F "http://localhost:3000/")，运行效果如下：

![1.gif](/images/jueJin/069e7099978a4f1.png)

接下来我们部署到 Vercel 上。巧妇再次难为无米之炊，你需要一个 Vercel 账号并全局安装了 Vercel Cli，具体参考 [《实战篇 | React Notes | Vercel 部署》](https://juejin.cn/book/7307859898316881957/section/7309114840307400714#heading-3 "https://juejin.cn/book/7307859898316881957/section/7309114840307400714#heading-3")。

项目根目录运行：

```javascript
vercel
```

接下来等待 Vercel 自动部署（大概 1 分钟左右），交互效果如下：

![image.png](/images/jueJin/024401f7682346f.png)

此时 Vercel 部署完成。打开 Vercel 平台查看项目的线上地址：

![截屏2024-03-09 14.25.58.png](/images/jueJin/79c6dc9f25e0403.png)

部署地址是 [next-chatgpt-amber.vercel.app/](https://link.juejin.cn?target=https%3A%2F%2Fnext-chatgpt-amber.vercel.app%2F "https://next-chatgpt-amber.vercel.app/")，页面虽然能访问，但此时并没有效果，因为我们还没有设置我们的环境变量。

打开项目的 Settings，添加 `OPENAI_API_KEY`环境变量的值，然后点击 `Save` 按钮添加：

![截屏2024-03-09 14.29.51.png](/images/jueJin/5ddf62a2cb69464.png)

添加后，为了让环境变量生效，此时需要 Redeploy 一次：

![截屏2024-03-09 14.45.36.png](/images/jueJin/9c7a2c9ebce14e3.png)

此时再访问 [next-chatgpt-amber.vercel.app/](https://link.juejin.cn?target=https%3A%2F%2Fnext-chatgpt-amber.vercel.app%2F "https://next-chatgpt-amber.vercel.app/")，已经能够正常运行：

![openai-1.gif](/images/jueJin/21354dc4511648c.png)

不过 Vercel 部署的地址默认国内无法访问，但也有解决方法，参考 [《实战篇 | React Notes | Vercel 部署》](https://juejin.cn/book/7307859898316881957/section/7309114840307400714#heading-3 "https://juejin.cn/book/7307859898316881957/section/7309114840307400714#heading-3")。

五分钟部署版
------

是不是感觉还是有点麻烦，没有关系，还有 5 分钟部署版。前提是你有 Vercel 账号以及一个 API KEY。

打开 [next-openai](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvercel%2Fai%2Ftree%2Fmain%2Fexamples%2Fnext-openai "https://github.com/vercel/ai/tree/main/examples/next-openai")，点击 Deploy 按钮：

![截屏2024-03-09 14.59.57.png](/images/jueJin/780c7863409a4d2.png)

然后在 Deploy 界面创建一个 GitHub 仓库，配置一下环境变量，最后等待部署即可：

![截屏2024-03-09 15.01.58.png](/images/jueJin/531b664d7dbc4ec.png)

最后获取一下生产地址：

![截屏2024-03-09 15.04.04.png](/images/jueJin/684638adeb9041a.png)

这个是 Vercel 提供的 Next.js + OpenAI 的官方模板，除了刚才的例子，还提供了各种示例，也支持 GPT 4，从源码中也可以看出：

![image.png](/images/jueJin/0f6b903f8e1948e.png)

除了 Next.js + OpenAI，其实 [Vercel AI](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs "https://sdk.vercel.ai/docs") 还提供了其他模板和例子：

![image.png](/images/jueJin/043fb5ba6903496.png)

Vercel AI SDK
-------------

如果你要在 Next.js 项目中接入 AI 比如 OpenAI、Anthropic、Google、Mistral 等，尤其要使用 Stream 的时候，虽然可以手动处理，参考：

1.  [《如何用 Next.js v14 实现一个 Streaming 接口？》](https://juejin.cn/post/7344089411983802394#heading-5 "https://juejin.cn/post/7344089411983802394#heading-5")
2.  [《Next.js v14 如何实现 SSE、接入 ChatGPT Stream?》](https://juejin.cn/post/7372020457124659234#heading-11 "https://juejin.cn/post/7372020457124659234#heading-11")

但流的处理是非常让人头疼的，Node 有自己的 Stream 同时也支持 Web Stream，各种类型的流牵涉到各种概念和 API，繁琐的让人头疼。就连 Dan 也感到害怕（🐶）：

![image.png](/images/jueJin/195cb4f40b70437.png)

所以处理 AI + Stream 的时候，最好是使用 Vercel 的 AI SDK，它针对多个 AI 模型都提供了 Providers，也支持Stream。加上是 Vercel 出品，质量有保证，属于官方推荐产品，已经成为 Next.js 项目接入 AI 的第一选择。

本篇就以 OpenAI 为例，为大家讲解如何使用 Vercel AI SDK。

### 1\. 基础配置

首先是安装依赖项：

```javascript
npm install ai @ai-sdk/openai
```

配置 OpenAI API Key：

```javascript
OPENAI_API_KEY=xxxxxxxxx
```

创建一个路由处理程序：

```javascript
// app/api/chat/route.ts

import { openai } from '@ai-sdk/openai';
import { generateText } from "ai"

    export async function POST(req) {
    const { messages } = await req.json();
        const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        messages
        })
        
        return Response.json({ text })
    }
```

但如果你在国内调用，因为一些原因，需要配置代理，所以需要写成这样：

```javascript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from "ai"

    const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://api.openai-proxy.com/v1"
    });
    
        export async function POST(req) {
        const { messages } = await req.json();
            const { text } = await generateText({
            model: openai('gpt-3.5-turbo'),
            messages
            })
            
            return Response.json({ text })
        }
```

### 2\. AI SDK Core

#### 2.1. 核心函数

之前的例子中，我们用的是 `ai`导出的 `generateText` 函数，这就是 ai 的核心函数，一共有 4 个：

1.  [generateText](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Freference%2Fai-sdk-core%2Fgenerate-text "https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text")：生成文本，适合非交互式用例，例如需要编写文本（例如起草电子邮件或总结网页）的自动化任务
2.  [streamText](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Freference%2Fai-sdk-core%2Fstream-text "https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text")：生成流文本。适合用于交互式用例，例如聊天机器人和内容流
3.  [generateObject](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Freference%2Fai-sdk-core%2Fgenerate-object "https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object")：生成结构化对象，很多大模型支持返回结构化对象，比如 OpenAI（在官方文档搜 “JSON mode”查看具体介绍）
4.  [streamObject](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Freference%2Fai-sdk-core%2Fstream-object "https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-object")：生成流式结构化对象

常用的是 streamText，因为大型语言模型 (LLM) 可能需要长达一分钟才能完成生成响应，对于聊天机器人这种交互场景来说，这种延迟是不可接受的，用户希望立刻得到响应，所以使用 Stream 格式很重要。

streamText 的基本用法如下：

```javascript
    export async function POST(req) {
    const { messages } = await req.json();
    
        const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        messages,
        });
        
        return result.toAIStreamResponse();
    }
```

#### 2.2. ReadableStream

其中 `result.textStream` 是一个 `ReadableStream`，你可以在浏览器或者 Node 中使用：

```javascript
    const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    });
    
        for await (const textPart of result.textStream) {
        console.log(textPart);
    }
    
```

打印结果如下：

![image.png](/images/jueJin/d3162e0d2a0547e.png)

稍微进阶一点的用法，我们可以在实战中体会。

新建 `app/learn/page.js`，代码如下：

```javascript
'use client';

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { useEffect, useState } from 'react';

    const openai = createOpenAI({
    apiKey: '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',
    baseURL: "https://api.openai-proxy.com/v1"
    });
    
        const fetch = async (cb) => {
            const result = await streamText({
            model: openai('gpt-3.5-turbo'),
            prompt: '如何学习 JavaScript，请详细描述',
            });
            
            const reader = result.textStream.getReader();
            
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                    console.log("Stream complete");
                    return;
                }
                cb(value)
                return reader.read().then(processText);
                });
            }
            
                export default function Chat() {
                
                const [text, setText] = useState('');
                const [charsReceived, setCharsReceived] = useState('');
                const [chunk, setChunk] = useState('');
                
                    useEffect(() => {
                        fetch((text) => {
                        setChunk(text)
                            setText((prev) => {
                            const res = prev + text
                            setCharsReceived(res.length)
                            return res
                            })
                            })
                            }, [])
                            
                            return (
                            <>
                            <p>{text}</p>
                            <div className="bg-cyan-300 text-xl text-white text-center fixed inset-x-0 bottom-0 p-4">已收到 {charsReceived} 字符。当前片段：{chunk}</div>
                            </>
                            
                            )
                        }
```

浏览器效果如下：

![2.gif](/images/jueJin/34a1f91a98ce4bb.png)

#### 2.3. 完成回调

AI SDK 同时提供了完成回调函数：

```javascript
    const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
        onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        console.log(text, finishReason, usage)
        },
        });
```

#### 2.4. 辅助函数

streamText 的返回对象包含多个辅助函数，以便更轻松地集成到 AI SDK UI 中：

1.  `result.toAIStream()`: 返回一个 AI stream 对象，可以和 StreamingTextResponse()、 StreamData 一起使用
2.  `result.toAIStreamResponse()`: 返回一个 AI stream response
3.  `result.toTextStreamResponse()`: 返回一个普通的文字 stream response
4.  `result.pipeTextStreamToResponse()`: 将数据写入类似于 Node.js response 的对象
5.  `result.pipeAIStreamToResponse()`: 将 AI 流数据写入类似于 Node.js response 的对象

在上面的例子中，我们就是直接使用 `result.toAIStreamResponse`作为路由处理程序的返回。

### 3\. AI SDK RSC

除了 `ai`，Vercel 针对服务端组件还提供了 `ai/rsc`，用于在服务端流式返回内容。借助 `ai/rsc`，你不再需要手动创建 API 接口，可直接使用 Server Actions 完成前后端交互。

AI SDK RSC 也提供了多个核心函数，就比如用于处理 Stream Value 的 createStreamableValue，它可以将可序列化的 JS 值从服务器流式传输到客户端，例如字符串、数字、对象和数组：

```javascript
'use server';

import { createStreamableValue } from 'ai/rsc';

    export const runThread = async () => {
    const streamableStatus = createStreamableValue('thread.init');
    
        setTimeout(() => {
        streamableStatus.update('thread.run.create');
        streamableStatus.update('thread.run.update');
        streamableStatus.update('thread.run.end');
        streamableStatus.done('thread.end');
        }, 1000);
        
            return {
            status: streamableStatus.value,
            };
            };
```

readStreamableValue 搭配 createStreamableValue 使用，用于在客户端读取流式值，它返回一个异步迭代器，该迭代器在更新时生成新值：

```javascript
import { readStreamableValue } from 'ai/rsc';
import { runThread } from '@/actions';

    export default function Page() {
    return (
    <button
        onClick={async () => {
        const { status } = await runThread();
        
            for await (const value of readStreamableValue(status)) {
            console.log(value);
        }
    }}
    >
    Ask
    </button>
    );
}
```

具体在项目中怎么使用呢？我给大家举个完整可用的例子。

修改 `app/page.js`，代码如下：

```javascript
'use client';

import { useState } from 'react';
import { generate } from './actions';
import { readStreamableValue } from 'ai/rsc';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

    export default function Home() {
    const [generation, setGeneration] = useState('');
    
    return (
    <div>
    <button
        onClick={async () => {
        const { output } = await generate('如何学习 JavaScript?');
        
            for await (const delta of readStreamableValue(output)) {
            setGeneration(currentGeneration => `${currentGeneration}${delta}`);
        }
    }}
    >
    如何学习 JavaScript?
    </button>
    
    <div>{generation}</div>
    </div>
    );
}
```

新建 `app/actions.js`，代码如下：

```javascript
'use server';

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

    const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://api.openai-proxy.com/v1"
    });
    
    
        export async function generate(input) {
        'use server';
        
        const stream = createStreamableValue('');
        
            (async () => {
                const { textStream } = await streamText({
                model: openai('gpt-3.5-turbo'),
                prompt: input,
                });
                
                    for await (const delta of textStream) {
                    stream.update(delta);
                }
                
                stream.done();
                })();
                
                return { output: stream.value };
            }
```

浏览器效果如下：

![3.gif](/images/jueJin/d19c812aa0154e8.png)

当然 AI SDK RSC 的核心函数还有流式传输 UI 的 createStreamableUI、常用于查询聊天记录的 AI and UI State 等，具体查看 [sdk.vercel.ai/docs/ai-sdk…](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Fai-sdk-rsc "https://sdk.vercel.ai/docs/ai-sdk-rsc")

### 4\. AI SDK UI

Vercel AI SDK UI，虽然名字上带了 UI，但其实跟框架、UI 都无关，主要是用于简化前端管理 Stream 和 UI 的过程，更高效的开发界面。

主要提供了 3 个 hook：

1.  useChat：对应 OpenAI 的 ChatCompletion，专为生成对话场景设计
2.  useCompletion：对应 OpenAI 的 Completion，是一个通用的自然语言生成接口，支持生成各种类型的文本，包括段落、摘要、建议、答案等等
3.  useAssistant：对应 OpenAI 的 Assistants API

简单的来说就是用法基本类似，但背后调用的 OpenAI 的接口有所不同，实现的效果也不同。我们以 useChat 为例：

```jsx
'use client';

import { useChat } from 'ai/react';

    export default function Page() {
        const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: 'api/chat',
        });
        
        return (
        <>
        {messages.map(message => (
        <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
{message.content}
</div>
))}
<form onSubmit={handleSubmit}>
<input
name="prompt"
value={input}
onChange={handleInputChange}
id="input"
/>
<button type="submit">Submit</button>
</form>
</>
);
}
```

不需要再定义其他状态，就实现了一个最基本的数据提交和数据展示。

除此之外还支持 loading 和 error 状态：

```javascript
const { isLoading, ... } = useChat()

return <>
{isLoading ? <Spinner /> : null}
...

``````javascript
const { error, ... } = useChat()

    useEffect(() => {
        if (error) {
        toast.error(error.message)
    }
    }, [error])
    
    // Or display the error message in the UI:
    return <>
{error ? <div>{error.message}</div> : null}
...

```

可大幅简化前端界面的开发成本。

完整的文档可以参考 [sdk.vercel.ai/docs/ai-sdk…](https://link.juejin.cn?target=https%3A%2F%2Fsdk.vercel.ai%2Fdocs%2Fai-sdk-rsc%2Foverview "https://sdk.vercel.ai/docs/ai-sdk-rsc/overview")

总结
--

借助 Vercel AI SDK 可快捷接入 AI 产品，处理流式返回，构建前端界面，堪称 Next.js 接入 AI 的第一选择。