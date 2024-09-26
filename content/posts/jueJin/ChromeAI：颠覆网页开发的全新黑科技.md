---
author: "小明大白菜"
title: "ChromeAI：颠覆网页开发的全新黑科技"
date: 2024-06-27
description: "Chrome原生AI接口来袭！前端开发迎来革命性变化，浏览器端侧模型本地运算，颠覆你对浏览器的认知！"
tags: ["前端","人工智能"]
ShowReadingTime: "阅读5分钟"
weight: 826
---
Chrome AI 长啥样
-------------

废话不多说，让我们直接来看一个示例：

js

 代码解读

复制代码

`async function askAi(question) { 	if (!question) return "你倒是输入问题啊" 	// 检查模型是否已下载（模型只需下载一次，就可以供所有网站使用） 	const canCreate = await window.ai.canCreateTextSession() 	if (canCreate !== "no") { 		// 创建一个会话进程 	  const session = await window.ai.createTextSession()    		// 向 AI 提问 	  const result = await session.prompt(question) 	   	  // 销毁会话 	  session.destroy() 		 		return result 	}	 	 	return "模型都还没下载好，你问个蛋蛋" } askAi("玩梗来说，世界上最好的编程语言是啥").then(console.log) //打印： **Python 语言：程序员的快乐源泉！**`

可以看到这些浏览器原生 `AI` 接口是挂在 [`window.ai`](https://link.juejin.cn?target=http%3A%2F%2Fwindow.ai "http://window.ai") 对象下面的，浏览器自带 `AI` 模型（要下载），**无需消耗开发者的资金**去调用 `OpenAI API` 或者是 `文心一言 API`等。

由于没有成本限制，想象空间极大扩展。你可以**将智能融入网页的每一个环节**。例如，实时翻译，传统的 `i18n` 只能映射静态字符串来支持多语言，对于后端传过来的字符串毫无办法，现在可以交给 `AI` 实时翻译并展示。

未来，这个浏览器 `AI` 标准接口将不仅限于 Chrome 和 PC 端，其他浏览器厂商也会跟进，手机也将拥有本地运行小模型的浏览器。

Chrome AI 接口文档
--------------

我们刚刚看到了 `Chrome AI` 的调用示例，现在让我们看一下完整的 `Chrome` 文档。我将用 `TypeScript` 和注释方式展示，**这些类型和注释是我手动编写的，全网独一无二，赶紧收藏**：

ts

 代码解读

复制代码

``declare global {   interface Window {     readonly ai: AI;   }   interface AI {     /**      * 判断模型是否准备好了      * @example      * ```js      * const availability = await window.ai.canCreateTextSession()      * if (availability === 'readily') {      *  console.log('模型已经准备好了')      * } else if (availability === 'after-download') {      *  console.log('模型正在下载中')      * } else {      *  console.log('模型还没下载')      * }      * ```      */     canCreateTextSession(): Promise<AIModelAvailability>;     /**      * 创建一个文本生成会话进程      * @param options 会话配置        * @example      * ```js      * const session = await window.ai.createTextSession({      *  topK: 50, // 生成文本的多样性，越大越多样      *  temperature: 0.8 // 生成文本的创造性，越大越随机      * })      *       * const text = await session.prompt('今天天气怎么样？')      * console.log(text)      * ```      */     createTextSession(options?: AITextSessionOptions): Promise<AITextSession>;     /**      * 获取默认的文本生成会话配置      * @example      * ```js      * const options = await window.ai.defaultTextSessionOptions()      * console.log(options) // { topK: 50, temperature: 0.8 }      * ```      */     defaultTextSessionOptions(): Promise<AITextSessionOptions>;   }   /**    * AI模型的可用性    * - `readily`：模型已经准备好了    * - `after-download`：模型正在下载中    * - `no`：模型还没下载    */   type AIModelAvailability = 'readily' | 'after-download' | 'no';   interface AITextSession {     /**      * 询问 AI 问题, 返回 AI 的回答      * @param input 输入文本, 询问 AI 的问题      * @example      * ```js      * const session = await window.ai.createTextSession()      * const text = await session.prompt('今天天气怎么样？')      * console.log(text)      * ```      */     prompt(input: string): Promise<string>;     /**      * 询问 AI 问题, 以流的形式返回 AI 的回答      * @param input 输入文本, 询问 AI 的问题      * @example      * ```js      * const session = await window.ai.createTextSession()      * const stream = session.promptStreaming('今天天气怎么样？')      * let result = ''      * let previousLength = 0      *       * for await (const chunk of stream) {      *  const newContent = chunk.slice(previousLength)      *  console.log(newContent) // AI 的每次输出      *  previousLength = chunk.length      *  result += newContent      * }      *       * console.log(result) // 最终的 AI 回答（完整版）      */     promptStreaming(input: string): ReadableStream;     /**      * 销毁会话      * @example      * ```js      * const session = await window.ai.createTextSession()      * session.destroy()      * ```      */     destroy(): void;     /**      * 克隆会话      * @example      * ```js      * const session = await window.ai.createTextSession()      * const cloneSession = session.clone()      * const text = await cloneSession.prompt('今天天气怎么样？')      * console.log(text)      * ```      */     clone(): AITextSession;   }   interface AITextSessionOptions {     /**      * 生成文本的多样性，越大越多样，正整数，没有范围      */     topK: number;     /**      * 生成文本的创造性，越大越随机，0-1 之间的小数      */     temperature: number;   } }``

如何启用 Chrome AI
--------------

### 准备工作

1.  下载最新 [Chrome Dev](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2Fintl%2Fen_sg%2Fchrome%2Fdev%2F "https://www.google.com/intl/en_sg/chrome/dev/") 版或 [Chrome Canary](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2Fintl%2Fen_sg%2Fchrome%2Fcanary%2F "https://www.google.com/intl/en_sg/chrome/canary/") 版。(版本号不低于 `128.0.6545.0`)
2.  确保你的电脑有 `22G` 的可用存储空间。
3.  很科学的网络

### 启用 Gemini Nano 和 Prompt API

1.  打开 `Chrome`， 在地址栏输入: `chrome://flags/#optimization-guide-on-device-model`，选择 `enable BypassPerfRequirement`，这步是绕过性能检查，确保 `Gemini Nano`能顺利下载。
2.  再输入 `chrome://flags/#prompt-api-for-gemini-nano`，选择 `enable`。
3.  重启 `Chrome` 浏览器。

### 确认 Gemini Nano 是否可用

1.  按 `F12` 打开开发者工具， 在控制台输入 `await window.ai.canCreateTextSession()`，如果返回 `readily`，就说明 OK 了。
    
2.  如果上面的步骤不成功，重启 `Chrome` 后继续下面的操作:
    
    *   新开一个标签页，输入 `chrome://components`
    *   找到 `Optimization Guide On Device Model`，点击 `Check for update`，等待一个世纪直到 `Status - Component updated` 出现就是模型下载完成。（模型版本号不低于 `2024.5.21.1031`）
3.  模型下载完成后, 再次在开发者工具的控制台中输入`await window.ai.canCreateTextSession()`，如果这次返回 `readily`，那就 OK 了。
    
4.  如果还是不行，可以等一会儿再试。多次尝试后仍然失败，请关闭此文章🐶。
    

思考
--

`AI` 最近两年可谓是爆发式增长，从 `GPT-3` 开始，笔者就一直在使用 `AI` 产品，如 `Github copilot`。`ChatGPT` 推出后，我迅速开发了一个 [GPT-Runner](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnicepkg%2Fgpt-runner "https://github.com/nicepkg/gpt-runner") `vscode` 扩展，用于勾选代码文件进行对话。

我一直在思考，`AI` 能给网页产品带来哪些变革？例如，有没有可能出现一个 `AI` 组件库，将 `AI` 智能赋予组件，如 `input` 框猜测用户下一步输入，或 `table` 组件实现自然语言搜索和数据拼装。

与 `AI` 相关的技术通常需要额外的计算成本，企业主和用户支付意愿低。如果能利用本地算力，就无需额外花费。这个场景现在似乎在慢慢实现。

作为开发者，我们正在迎来 `AI` 全面赋能网页操作的时代。让我们积极拥抱变化，向老板展示更多的迭代需求，找到前端就业的新增长点。

如果本文章感兴趣者众多，将考虑使用这个 `AI` 接口实现兼容 `OpenAI API` 规范，这样你可以不用花钱，不用装 `Docker`，直接使用浏览器算力和油猴插件免费使用各类开源 `chat web ui`，如在线版的 [Chat-Next-Web](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FChatGPTNextWeb%2FChatGPT-Next-Web "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web")。

彩蛋
--

仔细观察 `window.ai.createTextSession` ，你会发现它为什么不叫 `window.ai.createSession` ？我猜测未来可能会有 `text-to-speech` 模型、 `speech-to-text` 模型、`text-to-image` 模型、`image-to-text` 模型，或者更多惊喜。

这不是随便猜测，我是在填写 `Chrome AI preview` 邀请表时看到的选项。敬请期待吧，各位前端开发er。