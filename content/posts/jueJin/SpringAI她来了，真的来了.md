---
author: "程序员晓凡"
title: "SpringAI她来了，真的来了"
date: 2024-04-15
description: "自从ChatGPT火了之后，各种产品都在不停的拥抱AI，在各自场景中接入AI，国内外各种大模型层出不穷。好像有点扯远了，言归正传，今天我们要说的是SpringAI"
tags: ["后端"]
ShowReadingTime: "阅读4分钟"
weight: 880
---
### 写在前面

自从`ChatGPT`火了之后，各种产品都在不停的拥抱AI，在各自场景中接入AI，国内外各种大模型层出不穷。

好像有点扯远了，言归正传，今天我们要说的是SpringAI，大家在逛Spring 官网（[spring.io/）](https://link.juejin.cn?target=https%3A%2F%2Fspring.io%2F%25EF%25BC%2589 "https://spring.io/%EF%BC%89") 应该发现了，在官网中多了`SpringAI` 模块

![springAI](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72ec3c34ee224b60993e82ff56e082d3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1702&h=979&s=192651&e=png&b=ffffff)

### 一、SpringAI 简介

我们来看看官网是怎么介绍的

Spring AI is an application framework for AI engineering. Its goal is to apply to the AI domain Spring ecosystem design principles such as portability and modular design and promote using POJOs as the building blocks of an application to the AI domain.

Portable API support across AI providers for Chat, text-to-image, and Embedding models. Both synchronous and stream API options are supported. Dropping down to access model-specific features is also supported.

上面翻译过来就是

Spring AI是一个面向AI工程的应用框架。其目标是将可移植性和模块化设计等设计原则应用于AI领域的Spring生态系统，并将POJO作为应用程序的构建块推广到AI领域。

跨AI提供商的便携API支持聊天、文本到图像和嵌入模型。同时支持同步和流API选项。还支持各种定制的功能。

总的来说就是：Spring出了一个AI框架，帮助我们快速调用AI，从而实现各种功能场景。

在之前的文章中我们有说过Java怎么调用OpenAI， **传送门**👉[Java程序接入ChatGPT](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FwZSAKtauOzXK1AZxL_nekg "https://mp.weixin.qq.com/s/wZSAKtauOzXK1AZxL_nekg") 👈

今天我们就来看看怎么使用Spring 自己提供的框架调用AI

### 二、各种模型

> 这里列举出了支持的各种厂商的各种模型接入，有我们熟悉的Amazon、Google 等模型，但目前还不支持国内的任何一种模型

#### 2.1 Chat Models 聊天模型

![聊天模型](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b79cb03c83eb4b0f8d8a769726b2cbd6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=899&h=482&s=35369&e=png&b=ffffff)

#### 2.2 Text-to-image Models 文生图模型

![文生图模型](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19885c6c71144418aadfdd40f1989c3f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=364&h=110&s=4605&e=png&b=ffffff)

#### 2.3 Transcription (audio to text) Models 音频文本互转模型

![音频模型](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/032f852508d34989bf410f1ff528e9b8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=397&h=65&s=1637&e=png&b=ffffff)

#### 2.4 Embedding Models 嵌入模型

![嵌入模型](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86160ba787164d97897a65b7bddd1c1a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=456&h=374&s=15847&e=png&b=ffffff)

### 三、接入准备

我们这里以接入`OpenAI` 为例，看看需要做哪些准备

① 首先我们得能魔法上网

② 注册过`OpenAI`账号，并创建了`API keys`

还不知道怎么注册的可以翻一翻之前的文章， **传送门** 👉 [如何注册OpenAI](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FwZSAKtauOzXK1AZxL_nekg "https://mp.weixin.qq.com/s/wZSAKtauOzXK1AZxL_nekg") 👈

**注：** 之前我们注册生成的`API keys` 可能过期了，有可能需要重新创建一个

![创建API key](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdc50f3e45b64a65839b34f469705754~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1804&h=680&s=82671&e=png&b=fefefe)

要想接下来调用成功，上面两步缺一不可

### 四、创建springboot项目

① `Spring Initializr` 创建项目

**注：**

*   Server URL 这里一定要 填[start.spring.io/](https://link.juejin.cn?target=https%3A%2F%2Fstart.spring.io%2F "https://start.spring.io/") ，而不是 [start.aliyun.com/](https://link.juejin.cn?target=https%3A%2F%2Fstart.aliyun.com%2F "https://start.aliyun.com/") 阿里云暂时还不支持
*   jdk一定要选择17及以上版本

![创建springboot项目](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1763675a1be54a5ba45f4eded9f78b99~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=917&h=774&s=53935&e=png&b=3d4042)

② 选择支持模块

如果上面一步选择正确的话，这一步我们会看到一个AI模块，这里选择`OpenAI` 模型和Spring Web即可，

如果这一步没看到AI模块的，请return到上一步

![模块选择](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/119b37105ccc46ffafddc11da5b4cc4d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=901&h=774&s=47275&e=png&b=3c3f41)

### 五、所需依赖

按照上面添加模块之后，idea会默认给我们添加如下依赖，当然了也还用到其他依赖，这里就不都贴出来了

xml

 代码解读

复制代码

`<dependency>     <groupId>org.springframework.ai</groupId>     <artifactId>spring-ai-openai-spring-boot-starter</artifactId> </dependency>`

如果你用的是`Gradle` 构建工具，那就是

xml

 代码解读

复制代码

`dependencies {     implementation 'org.springframework.ai:spring-ai-openai-spring-boot-starter' }`

**注：**

添加依赖之后，如果我们项目配置的是阿里云镜像的话，需要修改成如下仓库地址，否则依赖下载不下来

xml

 代码解读

复制代码

`<repositories>     <repository>         <id>spring-milestones</id>         <name>Spring Milestones</name>         <url>https://repo.spring.io/milestone</url>         <snapshots>             <enabled>false</enabled>         </snapshots>     </repository> </repositories>`

### 六、修改配置文件

`application.properties` 或者`application.yml`配置文件

properties

 代码解读

复制代码

`spring.ai.openai.api-key=前面步骤创建的apikey spring.ai.openai.chat.options.model=gpt-3.5-turbo spring.ai.openai.chat.options.temperature=0.7`

或者

yml

 代码解读

复制代码

`spring:   ai:     openai:       api-key: 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       chat:         options:           model: gpt-3.5-turbo           temperature: 0.7`

*   `api-key` : 前面步骤创建的`apikey`
*   `chat.options.model`: `gpt`模型 ,上面我们配置的是3.5 模型
*   `chat.options.temperature`:`Spring AI`与PT模型交互时，特别是在聊天或文本生成场景下，模型生成文本时的随机性程度为0.7

### 七、代码编写

这里我们只是简单测试一下，所以代码都写在了`controller` 层里

java

 代码解读

复制代码

`@RestController public class ChatController {     private final OpenAiChatClient chatClient;     @Autowired     public ChatController(OpenAiChatClient chatClient) {         this.chatClient = chatClient;     }     @GetMapping("/ai/generate")     public Map  generate(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {         return Map.of("generation", chatClient.call(message));     }     @GetMapping("/ai/generateStream")     public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {         Prompt prompt = new Prompt(new UserMessage(message));         return chatClient.stream(prompt);     } }`

代码解释：上面代码提供了`generate`和`generateStream` 两个方法接收前端传来的参数`message`,然后将`message`作为`prompt` （如果你还不知道`prompt`可以去百度一下）去调用封装好的大模型，并将大模型的结果返回去。

### 八、Spring AI函数调用流程

![AI函数调用流程1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49350b34b4964c229f8e9db70ee756cf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1131&h=884&s=117823&e=jpg&b=fcfcfc)

![AI函数调用流程2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5994100e43fc4affa42a3e5d5dbe6dab~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1117&h=895&s=176558&e=jpg&b=fbfbfb)

### 九、其他模型调用

上面例子中我们只是列举出`OpenAI` 模型调用方式，其他模型大家可以参考官方文档，文档写的也非常详细

假设我们想使用亚马逊的大模型，可以到[docs.spring.io/spring-ai/r…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.spring.io%2Fspring-ai%2Freference%2Fapi%2Fbedrock-chat.html "https://docs.spring.io/spring-ai/reference/api/bedrock-chat.html") 查看文档

![其他模型调用](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27646e5c060d4085b931c205965f44dc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1867&h=949&s=182794&e=png&b=1e2226)

本期内容到这儿就结束了，希望对你有所帮助

我们下期再见 (●'◡'●)