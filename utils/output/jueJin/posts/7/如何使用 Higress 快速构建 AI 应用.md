---
author: "阿里云云原生"
title: "如何使用 Higress 快速构建 AI 应用"
date: 2024-08-22
description: "随着 AI 时代到来，基于大模型的应用对网关提出了新的要求，例如在不同 LLM 提供商之间进行负载均衡、构建 AI 应用的可观测能力、基于 token 的限流保护与配额管理、AI 应用内容安全等等。H随着 AI 时代到来，基于大模型的应用对网关提出了新的要求，例如在不同 LLM 提供商之间进行负载均衡、构建 AI 应用"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:1,views:59,"
---
随着 AI 时代到来，基于大模型的应用对网关提出了新的要求，例如在不同 LLM 提供商之间进行负载均衡、构建 AI 应用的可观测能力、基于 token 的限流保护与配额管理、AI 应用内容安全等等。Higress 基于企业内外的丰富场景沉淀了众多面向AI的功能，推出了 AI 原生的 API 网关形态并且全部开源。

![图片](/images/jueJin/d08f3a81798146d.png)

ChatGPT-Next-Web **\[** **1\]** 是一个开源的前端项目，用于提供大模型聊天窗口，支持接入多种大模型，本文基于Higress、通义千问以及 ChatGPT-Next-Web，演示 Higress 如何兼容 openai 协议，并逐步搭建一个体系完整的 LLM 应用，应用最终架构如图所示：

![图片](/images/jueJin/051ce19d67af4f7.png)

AI 代理
-----

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-agent%3Fspm%3Da2c4g.11186623.0.0.2927178eciPER4 "https://help.aliyun.com/zh/mse/user-guide/ai-agent?spm=a2c4g.11186623.0.0.2927178eciPER4")_

### 应用架构

首先，我们先通过网关快速部署一个可以进行对话的聊天应用，其架构如下图所示：

![图片](/images/jueJin/30ee550a898a442.png)

LLM 服务使用通义千问，服务类型为 DNS。路由及服务创建完成后如下图所示：

![图片](/images/jueJin/866fa9479dee4dc.png)

![图片](/images/jueJin/50995598bb594a8.png)

### 插件配置

设置路由级插件规则，选择在 llm 路由下生效，配置如下：

```yaml
provider:
type: qwen
apiTokens:
- sk-xxxxxxxxxxxxxxxxxxxxxx
timeout: 1200000
modelMapping:
'gpt-3.5-turbo': qwen-turbo
'gpt-4': qwen-max
'*': qwen-max
```

### 插件效果

![图片](/images/jueJin/173d7b7e25c248a.png)

AI 可观测
------

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-observable%3Fspm%3Da2c4g.11186623.0.0.42b4d95f14d39z "https://help.aliyun.com/zh/mse/user-guide/ai-observable?spm=a2c4g.11186623.0.0.42b4d95f14d39z")_

### 应用架构

现在，我们已经有了基础的对话功能，作为一款网关产品，我们希望在网关这个统一的入口处对各个服务、路由的请求情况进行观测。考虑到 LLM 请求主要以 token 为观测目标，网关提供了对 token 的观测机制，包含路由级、服务级、模型级的 token 用量观测。

现在，我们改变上文的应用架构，插入可观测插件，改造后如下图所示：

![图片](/images/jueJin/701fd007a35c48c.png)

### 插件配置

依然是选择在 llm 这条路由上生效，插件配置如下：

```bash
enable: true
```

### 插件效果

![图片](/images/jueJin/abb6a1c1170549a.png)

AI 内容安全
-------

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-content-security%3Fspm%3Da2c4g.11186623.0.0.4408488dYGAm2X "https://help.aliyun.com/zh/mse/user-guide/ai-content-security?spm=a2c4g.11186623.0.0.4408488dYGAm2X")_

### 应用架构

大模型通常是通过学习互联网上广泛可用的数据来训练的，它们有可能在过程中学习到并复现有害内容或不良言论，因此，当大模型未经过适当的过滤和监控就生成回应时，它们可能产生包含有害语言、误导信息、歧视性言论甚至是违反法律法规的内容。正是因为这种潜在的风险，大模型中的内容安全就显得异常重要。

基于 AI 内容安全插件，通过简单的配置即可对接阿里云内容安全 **\[** **2\]** ，为大模型问答的合规性保驾护航。

![图片](/images/jueJin/ab574f43138a4fc.png)

配置 AI 内容安全插件后，应用架构如下图所示：

![图片](/images/jueJin/2ffe4933a339408.png)

### 插件配置

首先需要在网关配置内容安全的服务：

![图片](/images/jueJin/ac96870709f14e8.png)

配置服务后，开启内容安全插件，选择对 llm 路由生效：

```makefile
serviceSource: dns
serviceName: green-cip
servicePort: 443
domain: green-cip.cn-hangzhou.aliyuncs.com
ak: xxxxxxxxxxxxxxxxx
sk: xxxxxxxxxxxxxxxxx
```

### 插件效果

![图片](/images/jueJin/d879fc7c155a4a0.png)

登录阿里云内容安全控制台，可以查看每条请求的审计记录：

![图片](/images/jueJin/268b30a07f3c44b.png)

AI Token 限流
-----------

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-token-current-limiting%3Fspm%3Da2c4g.11186623.0.i4 "https://help.aliyun.com/zh/mse/user-guide/ai-token-current-limiting?spm=a2c4g.11186623.0.i4")_

### 应用架构

ai-token-ratelimit 插件实现了基于特定键值实现 token 限流，键值来源可以是 URL 参数、HTTP 请求头、客户端 IP 地址、consumer 名称、cookie 中 key 名称。其借助 redis 实现全局的 token 限流。

![图片](/images/jueJin/a60a82c6aa46400.png)

创建一个 redis 服务并且在网关进行配置：

![图片](/images/jueJin/3d125d1aa920487.png)

之后添加 AI Token 限流插件，应用架构为：

![图片](/images/jueJin/991c980aefe943e.png)

### 插件配置

```yaml
rule_name: default_rule
rule_items:
- limit_by_per_ip: from-remote-addr
limit_keys:
- key: 0.0.0.0/0
token_per_minute: 100
redis:
service_name: redis.static
service_port: 6379
username: xxxxxx
password: xxxxxx
rejected_code: 429
rejected_msg: 您的请求频率过高，请稍后再试。
```

以上插件配置效果为每个 ip 地址每分钟内只能使用 100 个 token，当超过 token 限制时，返回 429，响应 body 为“您的请求频率过高，请稍后再试。”

### 插件效果

![图片](/images/jueJin/1e3f34166bf64d4.png)

AI 缓存
-----

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-cache%3Fspm%3Da2c4g.11186623.0.0.3cdf306bbJSWdn "https://help.aliyun.com/zh/mse/user-guide/ai-cache?spm=a2c4g.11186623.0.0.3cdf306bbJSWdn")_

### 应用架构

AI 缓存插件能够缓存每个请求的响应，当有相同请求到来时，可以直接返回存储在 redis 中的大模型的生成内容，添加 AI 缓存插件后，应用架构为：

![图片](/images/jueJin/2abf39fdc34b4e0.png)

### 插件配置

```yaml
redis:
serviceName: redis.static
servicePort: 6379
timeout: 2000
username: xxxxxx
password: xxxxxx
```

### 插件效果

![图片](/images/jueJin/eb5aefb1a7d44b1.png)

AI RAG
------

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-rag%3Fspm%3Da2c4g.11186623.0.0.24c77267ImcfGS "https://help.aliyun.com/zh/mse/user-guide/ai-rag?spm=a2c4g.11186623.0.0.24c77267ImcfGS")_

### 应用架构

大模型具有一个显著的局限性，那就是它们的知识截止到模型被训练的数据。一旦训练完成，模型就无法获取或学习新的信息。此外，大型语言模型的训练数据虽然浩如烟海，但仍然有可能缺少某些领域的信息，或者对某些主题的覆盖不够深入，针对这些细领域的查询可能会产生不够精确或缺乏深度的结果。检索增强生成（RAG）技术能够利用检索系统从大规模的数据库中找到相关信息，然后将这些信息提供给文本生成模型以帮助生成更精确、更丰富、更符合实际情况的文本。

Higress 通过对接阿里云向量检索服务能够快速实现 RAG 功能：

![图片](/images/jueJin/e74edd5be7f046f.png)

添加 RAG 插件后，应用架构如下图所示：

![图片](/images/jueJin/9ce4c050822141d.png)

### 插件配置

插件需要配置 dashscope 和 dashvector 两个云服务的相关信息：

```yaml
dashscope:
apiKey: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
serviceName: qwen
servicePort: 443
domain: dashscope.aliyuncs.com
dashvector:
apiKey: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
serviceName: dashvector
servicePort: 443
domain: vrs-cn-xxxxxxxxxxxxxx.dashvector.cn-hangzhou.aliyuncs.com
collection: xxxxxxxxxxxxxx
```

### 插件效果

![图片](/images/jueJin/704a0d013c18419.png)

其他
--

除了以上插件，我们还提供了对 prompt 进行修改的插件以及对请求/响应进行智能转换的插件。

### Prompt 工程相关插件

Prompt 插件包括 prompt 模板以及 prompt 装饰器：

*   prompt 模板 **\[** **3\]**
*   prompt 装饰器 **\[** **4\]**

Prompt 模板允许用户在网关定义一系列 LLM 请求的模板，使用者通过指定模板中的参数对 LLM 进行访问，配置示例如下：

```yaml
templates:
- name: "developer-chat"
template:
model: gpt-3.5-turbo
messages:
- role: system
content: "你是一个 {{program}} 专家, 你平时使用的编程语言为 {{language}}"
- role: user
content: "帮我写一个 {{program}} 程序, 你的返回结果里面应该只包含python代码"
```

请求 body 示例如下：

```json
    {
    "template": "developer-chat",
        "properties": {
        "program": "冒泡排序",
        "language": "python"
    }
}
```

Prompt 装饰器允许用户在网关定义对 prompt 的修改操作，包括在原始请求之前和之后插入 message，配置示例如下，请求 body 与 openai 的请求一致。

```less
prepend:
- role: system
content: "请使用英语回答问题."
append:
- role: user
content: "每次回答完问题，尝试进行反问"
```

### AI 请求/响应智能转换

官方文档：_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-request-response-intelligent-transformation%3Fspm%3Da2c4g.11186623.0.0.4f6f63beBCZCAU "https://help.aliyun.com/zh/mse/user-guide/ai-request-response-intelligent-transformation?spm=a2c4g.11186623.0.0.4f6f63beBCZCAU")_

请求响应转换插件支持对请求/响应进行智能转换，其工作流程如下图所示（示例中后端服务为 httpbin）：

![图片](/images/jueJin/2813027e653448b.png)

此插件可用于修改经过网关的请求/响应内容，例如将 xml 格式的响应修改为 json 格式。

### 插件配置

```yaml
response:
enable: true
prompt: "帮我修改以下HTTP应答信息，要求：1. content-type修改为application/json；2. body由xml转化为json；3. 移除content-length。"
provider:
serviceName: qwen
domain: dashscope.aliyuncs.com
apiKey: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 插件效果

访问原始的 httpbin 的 /xml 接口，结果为：

```xml
<?xml version='1.0' encoding='us-ascii'?>

<!--  A SAMPLE set of slides  -->

<slideshow
title="Sample Slide Show"
date="Date of publication"
author="Yours Truly"
>

<!-- TITLE SLIDE -->
<slide type="all">
<title>Wake up to WonderWidgets!</title>

</slide>


<!-- OVERVIEW -->
<slide type="all">
<title>Overview</title>

<item>Why <em>WonderWidgets</em> are great</item>

<item/>
<item>Who <em>buys</em> WonderWidgets</item>

</slide>


</slideshow>
```

使用以上配置，通过网关访问 httpbin 的 /xml 接口，结果为：

```json
    {
        "slideshow": {
        "title": "Sample Slide Show",
        "date": "Date of publication",
        "author": "Yours Truly",
            "slides": [
                {
                "type": "all",
                "title": "Wake up to WonderWidgets!"
                },
                    {
                    "type": "all",
                    "title": "Overview",
                        "items": [
                        "Why <em>WonderWidgets</em> are great",
                        "",
                        "Who <em>buys</em> WonderWidgets"
                    ]
                }
            ]
        }
    }
```

**相关链接：**

\[1\] ChatGPT-Next-Web

_[github.com/ChatGPTNext…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FChatGPTNextWeb%2FChatGPT-Next-Web "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web")_

\[2\] 阿里云内容安全

_[help.aliyun.com/document\_de…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F28417.html%3Fspm%3Da2c4g.28415.0.0.1dab1f55pipQr9 "https://help.aliyun.com/document_detail/28417.html?spm=a2c4g.28415.0.0.1dab1f55pipQr9")_

\[3\] prompt 模板

_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-cue-template%3Fspm%3Da2c4g.11186623.0.0.768b184f1WdsVb "https://help.aliyun.com/zh/mse/user-guide/ai-cue-template?spm=a2c4g.11186623.0.0.768b184f1WdsVb")_

\[4\] prompt 装饰器

_[help.aliyun.com/zh/mse/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmse%2Fuser-guide%2Fai-cue-decorator%3Fspm%3Da2c4g.11186623.0.0.124548a79q3fyU "https://help.aliyun.com/zh/mse/user-guide/ai-cue-decorator?spm=a2c4g.11186623.0.0.124548a79q3fyU")_