---
author: "古哥E下"
title: "这里有一份免费的ChatGPT工具集"
date: 2023-04-12
description: "工具的进步本身就会慢慢地会取代或改变很多人的工作与生活，所以重要的是我们要学会并适应这个工具，以加速自己的效率。"
tags: ["ChatGPT"]
ShowReadingTime: "阅读3分钟"
weight: 445
---
`ChatGPT` 经过一个来月的疯狂炒作，感觉目前热度已经慢慢地降下来了。

不得不说，国内对于这种新事物的热度炒作，中间商赚差价玩得挺溜的。最开始是账号倒卖，然后做门户网站引流，做代理网站，到现在的知识星球私域。

在这其中，就是对热点信息的敏感度、人心的把控、资源的利用、文案震惊部的鼎力支持。如果说作为一个纯粹的技术人，我是觉得这些东西华而不实，拒而远之。但经历半年来的见识与成长，我算是学到了很多，心态也改变了很多。

但我们需要认识到，`ChatGPT` 更多的是一个工具，我们不能过度地神话它，所以大家应该好好阅读下吴军老师的访谈文章：[吴军 | ChatGPT七问七答](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA4OTYwNzk0NA%3D%3D%26mid%3D2649712029%26idx%3D2%26sn%3D8a29e484994cfb2f294b355d619e3741%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzA4OTYwNzk0NA==&mid=2649712029&idx=2&sn=8a29e484994cfb2f294b355d619e3741&scene=21#wechat_redirect")，提升自己的认知，可以吃瓜，但不要随波逐流。工具的进步本身就会慢慢地会取代或改变很多人的工作与生活，所以重要的是我们要学会并适应这个工具，以加速自己的效率。

在我的 `App` 在漫长的审核路上龟速前进时，我重新完善了下 `emo-ai`，简而言之，就是大家做的我也全做了一遍，然后再加了点微创新，慢慢地做大做强。

地址：[emo.qhplus.cn/ai/dashboar…](https://link.juejin.cn?target=https%3A%2F%2Femo.qhplus.cn%2Fai%2Fdashboard%2Fportal "https://emo.qhplus.cn/ai/dashboard/portal")

账号系统
----

一般代理网站都需要填入`OpenAI` 提供的 `key`，但是我做了自己的 `API KEY` 生成逻辑，由我来给大家分配 `API KEY` 了，大家完全感知不到 `OpenAI` 的存在了。

以后后端接入 `文心一言`、`通义千问`都不是问题。

> 关注公众号可以获取公共体验 KEY， 体验次数 1000 次，用完就没啦。

门户网站
----

![p1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0394f3d1c34cdb870d73be8eee908c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在内容还不够多，但如果可以，可以在这里构建一个巨大的知识矩阵。

地址：[emo.qhplus.cn/ai/dashboar…](https://link.juejin.cn?target=https%3A%2F%2Femo.qhplus.cn%2Fai%2Fdashboard%2Fportal "https://emo.qhplus.cn/ai/dashboard/portal")

AI 聊天
-----

![p2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d23977b9781045e2a17250cda74b787a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

很多人会做代理网站，也有人做 `Prompt` 聚合，但每次 `Copy-Paste` 总是不爽，所以，我把这两个聚合起来了，可以一步到位，并且我针对 `Prompt` 做了分类：

*   系统指令：就是系统发送给 `ChatGpt` 的消息，用于指出 `ChatGpt` 的角色，功能，用户的对话都是在这个条件下进行。
    
*   用户指令：以用户角色直接发送消息
    
*   用户填空：点击使用后，用户可以在【】中输入自定义的内容，就是提供一个公共模板。
    

使用者都可以创建 `Prompt`， 通过点赞数排序，也可以搜索，随着 `Prompt` 的丰富，整个聊天就更方便了，是吧？

地址：[emo.qhplus.cn/ai/dashboar…](https://link.juejin.cn?target=https%3A%2F%2Femo.qhplus.cn%2Fai%2Fdashboard%2Fchat "https://emo.qhplus.cn/ai/dashboard/chat")

代码翻译/Code Review
----------------

这是之前提供的功能，不过其实是可以通过提供 `Prompt` 在聊天里实现了，不过目前我还是独立在这。做的优化，就是逐字吐出答案了，用户体验上更好了。

![p3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2bb4d9cee94879bed29decb27e9719~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

不过因为有 `Copilot` 的存在， `VS Code` 都有成熟的插件，那是更好的选择。

语音编程的功能暂时无法使用了，要重新设计下交互和使用方式，让它更完美。

要想做 `AI`，第一步就是给 `OpenAI` 送钱，不知道我能不能成功给他们送钱，现在没买会员，请求速度有点慢。

![p5.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87415913ac1f4c69a1a1b819c6a72e2f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

图片由 Stable Diffusition 生成

* * *

我是古哥E下，前微信读书客户端程序猿 / 自学 5 年中医，维护过上万 Star 开源项目 `QMUI Android`，现独立维护好用简洁的 `Android` 组件库 `emo`。

关注我可得：`ChatGPT` 开发玩法 | 程序员学习经验 | 组件库新变动 | 中医健康调理。