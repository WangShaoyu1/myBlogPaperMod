---
author: "前端开发爱好者"
title: "一个不用充钱也能让你变强的VSCode插件！！！"
date: 2023-11-06
description: "之前一直使用的GitHubCopilot，虽然功能强大，但是收费相对来说有点贵，每个月收费在10美刀这样，一直想找一个免费的替代方案，之前也尝试使用Kite和TabNine等类似智能"
tags: ["VisualStudioCode"]
ShowReadingTime: "阅读4分钟"
weight: 696
---
> 哈喽,大家好 我是 `xy`👨🏻‍💻。今天给大家推荐一款不用充钱也能让你变强的 `vscode` 插件 `通义灵码（TONGYI Lingma）`，可以称之为 `copilot` 的替代甜品 💪

前言
--

之前一直使用的 `GitHub Copilot`，虽然功能强大，但是收费相对来说有点贵，每个月收费在`10美刀`这样，一直想找一个`免费`的替代方案，之前也尝试使用 `Kite` 和 `TabNine` 等类似智能代码补全插件，但是效果都不尽人意。

一直到上个月，也就是 10 月 31 号，在杭州云栖大会上，阿里云对外展示了一款可自动编写代码的 AI 助手：`通义灵码（TONGYI Lingma）`，可以称之为 `copilot` 的替代甜品

什么是 通义灵码（TONGYI Lingma）
-----------------------

通义灵码（TONGYI Lingma），是`阿里云`出品的一款基于`通义大模型`的智能`编码辅助工具`，提供`行级/函数级实时续写`、`自然语言生成代码`、`单元测试生成`、`代码注释生成`、`代码解释`、`研发智能问答`、`异常报错排查`等能力，并针对阿里云 `SDK/OpenAPI` 的使用场景调优，助力开发者高效、流畅的编码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/763301304a2f45d891b61bcd0754f2ac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=955&s=425878&e=png&b=070521)

*   兼容 `Visual Studio Code`、`JetBrainsIDEs` 等主流 IDE
    
*   支持 `Java`、`Python`、`Go`、`C/C++`、`JavaScript`、`TypeScript`、`PHP`、`Ruby`、`Rust`、`Scala` 等主流编程语言
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12c0a01cd43c476c9eebb4562fde4fcd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=955&s=367831&e=png&b=03061f)

> 产品官网: `https://tongyi.aliyun.com/lingma`

通义灵码主要功能
--------

`代码智能生成`:

*   通过训练海量优秀开源代码数据，根据当前代码文件的上下文，为开发者生成行级和函数级代码，包括`代码块`、`方法`等，帮助开发者快速完成编码工作。

`行/函数级实时续写`:

*   在编码过程中，根据上下文和当前语法，通义灵码会自动预测和生成建议代码，开发者只需点击 `Tab` 键即可采纳

`自然语言生成代码`:

*   在编辑器中，开发者可以通过自然语言描述所需功能，通义灵码会根据`描述`和`上下文`，在编辑器区直接`生成代码`及`相关注释`，提供连续的编码体验。

`单元测试生成`:

*   通义灵码支持根据不同的测试架(如`JUnit`、`MockitoSpring Test`、`unit test`、`pytest`等)生成单元测试代码，并提供相关的代码解释。

`代码注释生成`:

*   通义灵码可以`一键生成`方法注释及行间注释，节省编写代码注释的时间，提升代码的可读性和注释覆盖率

`研发智能问答`:

*   基于海量研发文档、产品文档、通用研发知识以及阿里云的云服务文档和`SDK/OpenAPI`文档等进行问答训练，为开发者提供研发问题的答疑解惑。

在 VSCode 中安装通义灵码
----------------

*   打开 `VSCode`，在插件市场搜索 `通义灵码（TONGYI Lingma）`，点击 `安装`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e640b2ca5db94ea4917b138767ca8f5b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=849&h=323&s=48833&e=png&b=2e3642)

*   安装成功之后左侧菜单中会增加`通义灵码`插件按钮，点击按钮，接着点击登录去授权

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df442ceb2d46400e890d4845d65e69e2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=554&h=424&s=20738&e=png&b=2f3643)

*   VSCode 会提示等待阿里云`授权`中: 已复制链接，如遇浏览器未打开的情况，可直接粘贴至浏览器进行登录 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74f5708773034d5abf24b1a332eb70d2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=457&h=103&s=9280&e=png&b=2a2e36)
    
*   浏览器会自动打开到阿里云的登录`授权页面`，登录自己的账号直接授权即可
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/581215be8641493cba13e1d63b43b757~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=955&s=371668&e=png&b=f3f1f7)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00a1e09757ea4fc792f892d49a7f26b4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=438&h=427&s=17774&e=png&b=ffffff)

*   授权成功后，`VSCode` 会提示登录成功，并且在插件窗口会显示自己的`账号`名称

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/336a81c2079f41879d35bd4ad29e19ad~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=431&h=46&s=2695&e=png&b=232933)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd1722b7eac843daa9531a2b486b5fd0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=502&h=286&s=18305&e=png&b=303744)

*   重启 `Visual Studio Code`，有的不需要重启好像也可以直接用，就可以体验 `通义灵码` 智能编码了。

简单试用一下效果
--------

随便找了个文件，输入要求：`帮我写一个防抖函数, 使用typescript写`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ec61f63266446188abac03a3077fc6a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=527&h=446&s=26943&e=png&b=303845)

直接就自动生成出来了，只需点击 `Tab` 键即可采纳，是不是感觉很强大，总的来说，相比较于`Github Copilot`，`通义灵码` 还是有很多优势的，比如：`免费！！！`

写在最后
----

> `公众号`：`前端开发爱好者` 专注分享 `web` 前端相关`技术文章`、`视频教程`资源、热点资讯等，如果喜欢我的分享，给 🐟🐟 点一个`赞` 👍 或者 ➕`关注` 都是对我最大的支持。

欢迎`加我好友`，我会第一时间和你分享`前端行业趋势`，`面试资源`，`学习途径`等等。

**WX: `xuxuxu_yyy`**

添加好友备注【**进阶学习**】拉你进技术交流群

关注公众号后，在首页：

*   回复`面试题`，获取最新大厂面试资料。
*   回复`简历`，获取 3200 套 简历模板。
*   回复`React实战`，获取 React 最新实战教程。
*   回复`Vue实战`，获取 Vue 最新实战教程。
*   回复`ts`，获取 TypeScript 精讲课程。
*   回复`vite`，获取 Vite 精讲课程。
*   回复`uniapp`，获取 uniapp 精讲课程。
*   回复`js书籍`，获取 js 进阶 必看书籍。
*   回复`Node`，获取 Nodejs+koa2 实战教程。
*   回复`数据结构算法`，获取数据结构算法教程。
*   回复`架构师`，获取 架构师学习资源教程。
*   更多教程资源应有尽有，欢迎`关注获取`