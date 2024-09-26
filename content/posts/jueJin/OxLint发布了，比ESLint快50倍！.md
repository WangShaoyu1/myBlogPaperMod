---
author: "mysteryven"
title: "OxLint发布了，比ESLint快50倍！"
date: 2023-12-14
description: "OxLint作者也在掘金->快来关注。告诉大家一个好消息，OxLint现在正式发布了！可能有些同学不了解，简单介绍一下，它和ESLint一样，是一个JavaScript代码检查工具，只"
tags: ["前端","JavaScript","开源"]
ShowReadingTime: "阅读4分钟"
weight: 859
---
> Oxlint 作者也在掘金，快关注！！ -> [Boshen](https://juejin.cn/pin/7288507975223427109 "https://juejin.cn/pin/7288507975223427109")

告诉大家一个好消息，[OxLint](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Foxlint "https://www.npmjs.com/package/oxlint") 现在正式发布了！可能有些同学不了解，简单介绍一下，它和 ESLint 一样，是一个 JavaScript 代码检查工具，只是它不需要任何复杂的配置，就能帮助我们捕捉错误或无用代码。它使用 Rust 编写，速度非常地快，和 ESLint 对比起来，大概快 50 ~ 100 倍。

尤大也惊叹它的速度之快：

![CleanShot 2023-12-14 at 21.16.26@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cadbee3527e4c689409d96610903ada~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1194&h=1404&s=386702&e=png&b=000000)

放个图给大家感受一下：

![CleanShote 2023-12-14 at 20.48.05@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cec792449d0d4275a570874477c2456e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1720&h=1294&s=87804&e=png&b=ffffff)

更详细的性能对比请前往 [bench-javascript-linter](https://link.juejin.cn?target=https%3A%2F%2Foxc-project.github.io%2Fdocs%2Fguide%2Fusage%2Flinter.html "https://oxc-project.github.io/docs/guide/usage/linter.html")。

如何使用
----

OxLint**并非旨在完全取代ESLint**，毕竟 ESLint 生态已经很完善了，有些时候我们并不关注它的性能问题，但当ESLint 的速度成为工作流程瓶颈时，可以把它当做一个增强工具。

比如有些项目会在 lint-staged 或者 CI 设置运行 ESLint，如果有一个大项目本来在 lint-staged 阶段要花费 10 秒，现在就连 1 秒都不到，连给你接水摸鱼的时间都没了（狗头保命）。

说了这些，我们看看怎么用。要在JavaScript / TypeScript 代码库中测试 OxLint，只需在存储库的根目录下执行以下命令：

sh

 代码解读

复制代码

`npx oxlint@latest # npm pnpm dlx oxlint@latest # pnpm yarn dlx oxlint@latest # yarn bunx oxlint@latest # bun deno run oxlint@latest # deno`

如果有报错，命令行就会抛出详细的警告。同时，我们也有 VSCode 插件，在插件市场搜索 oxc 就可以搜到。

更多内容，请阅读我们的 [安装指南](https://link.juejin.cn?target=https%3A%2F%2Foxc-project.github.io%2Fdocs%2Fguide%2Fusage%2Flinter.html "https://oxc-project.github.io/docs/guide/usage/linter.html")。

设计
--

### 1\. 比 ESLint 快 50-100 倍

在实际场景中，Shopify 告称他们的原本需要运行 75 分钟 ESLint，现在仅需10秒。

这是来自 Jason Miller，Shopify DX 和 Preact 作者的消息：

> oxlint对我们来说是一个巨大的胜利。我们以前的lint设置需要运行 75 分钟，因此我们在CI中分配了 40 多个工作程序。
> 
> 相比之下，oxlint 在单个工作程序上对相同代码库的 lint 大约需要 10 秒钟，而且输出更易于解释。
> 
> 当我们迁移时，甚至发现了一些旧设置中隐藏或跳过的几个错误！

OXlint 专门为性能设计，在其中，利用 Rust 和并行处理是其中的关键因素。

### 2\. 为正确性进行代码检查

OxLint默认识别错误、冗余或混乱的代码 — 优先考虑正确性而不是一些吹毛求疵的规则（分类为 `perf`、`suspicious`、`pedantic` 或 `style`）。

它的分类借鉴自了 `clippy` 的[分类规则](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frust-lang%2Frust-clippy "https://github.com/rust-lang/rust-clippy")。初次见，可能会觉得很不适应，但是一旦熟悉，就会觉得这样的的分类是如此的方便，好用！

运行默认模式（不加任何参数，直接 `npx oxlint`）识别出来的错误，一般都是需要修正的错误。

### 3\. 使用便捷

现在配置新的 JavaScript / TypeScript 代码库变得越来越复杂。遇到兼容性问题的可能性很高，可能导致数小时的时间浪费。这就是为什么我们设计 OXLint 以零配置的方式出现的原因。别说配置文件了，Node.js 也不是必需的！

我们工具的大多数调整可以通过命令行完成，目前兼容 ESLint 的配置文件的工作也在进行中。

### 4\. 增强诊断

理解 lint 工具的信息可能具有挑战性。Oxlint 旨在通过定位根本原因并提供有用的信息来简化这一过程，也就是说，我们的报错信息比较容易读懂。看一个例子：

如果我们想在 [vscode](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fvscode "https://github.com/microsoft/vscode")中运行一下性能相关的 lint 规则： `oxlint -D perf`：

得到的结果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80bf47bfb5a54cdb9b495bcd651eebbd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2216&h=412&s=104977&e=png&b=010101)

### 5\. 统一的规则

Oxlint 目前尚未提供插件系统，但我们正在积极整合来自流行插件如 TypeScript、React、Jest、Unicorn、JSX-a11y和 Import 的规则。

我们认识到在 JavaScript 生态系统中插件的重要性，并且也正在研究基于 DSL 的插件系统。

然而，你可能会喜欢一个独立的 lint 工具 — 无需管理一系列插件依赖项，不想[解决兼容性问题](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fantfu%2Feslint-ts-patch "https://github.com/antfu/eslint-ts-patch")、或者[由于版本限制而求助于分支插件](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fimport-js%2Feslint-plugin-import%2Fpull%2F2504%23issuecomment-1191057877 "https://github.com/import-js/eslint-plugin-import/pull/2504#issuecomment-1191057877")。

* * *

感谢大家阅读到这，希望大家可以使用 OxLint 获得更愉悦的开发体验，也预祝大家即将到来的元旦假期快乐！

> 要开始使用，请查阅[安装指南](https://link.juejin.cn?target=https%3A%2F%2Foxc-project.github.io%2Fdocs%2Fguide%2Fusage%2Flinter.html "https://oxc-project.github.io/docs/guide/usage/linter.html")，或者[了解更多关于oxc项目](https://link.juejin.cn?target=https%3A%2F%2Foxc-project.github.io%2Fdocs%2Flearn%2Fparser_in_rust%2Fintro.html "https://oxc-project.github.io/docs/learn/parser_in_rust/intro.html")的信息。

我们项目还有很多好玩的东西，欢迎来玩 👉 [oxc-project.github.io/](https://link.juejin.cn?target=https%3A%2F%2Foxc-project.github.io%2F "https://oxc-project.github.io/")