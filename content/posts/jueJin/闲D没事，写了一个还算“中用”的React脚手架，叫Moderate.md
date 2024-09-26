---
author: "闲D阿强"
title: "闲D没事，写了一个还算“中用”的React脚手架，叫Moderate"
date: 2021-06-17
description: "一款基于react的脚手架，初步整合了Cocos引擎，针对一些常见业务下功夫，在平平无奇的地方，做一些普普通通的事情。"
tags: ["React.js"]
ShowReadingTime: "阅读3分钟"
weight: 776
---
这是我参与更文挑战的第1天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557?share_token=67cd5fc2-7fd0-4de9-8e11-ae726fb642bc "https://juejin.cn/post/6967194882926444557?share_token=67cd5fc2-7fd0-4de9-8e11-ae726fb642bc") ![ezgif.com-gif-maker (3).gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8487798a853d4cbb9292edc7733720ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![ezgif.com-gif-maker (5).gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c923d3d0d134009b3128657ad133a57~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![ezgif.com-gif-maker (6).gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdbb36117cdd404d8829ba5f5308f121~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

[gitee](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fqanglee%2Fmoderate-react-template "https://gitee.com/qanglee/moderate-react-template")

[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FmoderateReact%2Fmoderate-react-template "https://github.com/moderateReact/moderate-react-template")

Moderate "终"定在哪？
================

Moderate，意思为适中的，适度的，用这个作为代号，主要取决于他的本名“中用”，其一以贯之的想法就是中庸，秉承着以人为本的态度，着眼一般且常见业务，整理出一套“还行”的解决方案，选择性地追求先锋，策略性地坚持守拙，大体保持趋向极致的中庸，目标是打造一个没那么“重”(各种设限)，没那么“轻”(啥也没有)，方便演化的一个有生命力的脚手架，这就是Moderate所追求的“终”。

> 基于此想法指导下，初步具备了以下主要功能：

🥟 **开箱即用**，逻辑风格（比较）统一，理解一二，可推其他，并提供模版作为参考。

🍢 **路由可配置**，可约定（部分），可视化调整，并且具备切换动画和还原滚动位置等功能。

🥥 **页面开发确立了一个灵活的规范**，即将页面的数据和逻辑关注分离，实则一体，方便扩展和维护。

🥪 **组件基于antd进行了包装**，目的旨在（尽可能）遵循其设计的基础上扩展一些功能，（追求）让用起来更方便。

🍱 **对数据管理器层进行了整合**，确立好业务边界，让业务流转协调顺畅，可配置行为，如:mock，schema校验，接口防抖，提示信息等。

🍬 **网络请求基于axios进行了包装**，进行了简单且必要的封装。

🇬🇧 **对国际化功能进行了包装**，为每个页面指定了独立的国际化文件，并简化了开发复杂度，更直接，便于扩展和维护。

🥦 **前端mock接口更直接自然**，开发环境下动态引入且可拆卸可定制。

📐 **提供接口参数的schema校验**，以应对后台的api文档细节口口相传的潜在危机。

📒 **集成了MD文档功能**，这样可以方便在开发时有什么相关想法和收获，在不脱离项目的情况下进行记录沉淀，既方便个人，又贡献集体。

🏀 **初步整合了Cocos引擎**，可以在react代码中写游戏，想想就感觉兴奋，一加一就不是等于二的问题了。

快速上手
====

环境准备
----

首先得有 node 推荐使用 `yarn` 管理 `npm` 依赖，并使用国内源（阿里用户使用内网源）。

安装 qanglee-cli
--------------

shell

 代码解读

复制代码

  `npm i -g qanglee-cli`

创建项目
----

先找个地方，然后执行`qanglee create`或者`npx qanglee create`。

shell

 代码解读

复制代码

  `qanglee create ? your projectName: Moderate`

运行
--

shell

 代码解读

复制代码

`npm start`

用不用
===

因人而异，Moderate就是在“平平无奇”的地方，做着”普普通通“的事情，不奢望会被接受，不忧虑会被否定，一直在路上，仅希望有一分就贡献一分光和热。

作赋一首，以抒胸意
=========

前潜皆可，可攻可守。 黑白皆容，趋善避恶。 乾坤知易，随遇而刻。 保中守和，无成有终。