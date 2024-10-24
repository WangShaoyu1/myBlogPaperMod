---
author: "网易云音乐技术团队"
title: "云音乐 CMS 平台 AIGC 实践与新特性实现总结"
date: 2023-11-02
description: "云音乐技术团队在AIGC方面做了许多实践，本文主要是介绍下云音乐 CMS 平台在 AIGC 方向的一些探索、实践以及相关能力的实现总结。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:9,comments:2,collects:8,views:2985,"
---
[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_3 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_3")

> 本文作者：辰木

摘要：本文主要是介绍下云音乐 CMS 平台在 AIGC 方向的一些探索、实践以及相关能力的实现总结

背景
--

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_7 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_7")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_8 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_8")

现如今随着 LLM 在实际业务生产中的不断尝试和实践落地，在中后台场景下以 ChatUI 为主要交互方式的智能助手，是必不可少的存在；这种通过聊天对话就能完成用户使用诉求的方式，在一定程度上极大地改变了用户传统的使用习惯。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_9 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_9")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_10 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_10")

目前由于云音乐 CMS 平台大都已使用 Tempo 框架，相关介绍参见上一篇分享《[云音乐 CMS UI 框架建设思考与实践](https://juejin.cn/post/7242105983136710717 "https://juejin.cn/post/7242105983136710717")》，一些平台的个性化定制和移动办公诉求也接踵而至，这些诉求对 Tempo 提出了新的要求。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_11 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_11")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_12 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_12")

现状
--

为了更好更快地响应业务平台的一些个性化诉求，Tempo 通过不断抽象平台属性以完善其配置能力。对于诸如修改平台 Logo、Logo 跳转链接、标题、页脚信息、Layout 布局、自定义搜索内容等，期望都可在线一键修改配置完成，以便减少业务开发人员因增加或修改这类需求而带来的研发和时间成本。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_15 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_15")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_16 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_16")

由于 Tempo 已经在近 100+ 的主应用中落地使用，尽管主应用的发布频率较低，每次 Tempo 的升级都需要主应用升级相关依赖版本并在 Febase（PS：云音乐前端应用研发和部署平台）重新部署，而这种方式带来的升级成本也是很高的。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_17 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_17")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_18 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_18")

与此同时，鉴于内部日常的沟通和办公都是基于 Popo，其登陆态并未与 CMS 平台打通，平台移动端样式也未适配，导致一些业务场景办公只能在 PC 端完成，无法满足这类用户移动办公的诉求。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_19 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_19")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_20 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_20")

问题
--

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_21 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_21")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_22 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_22")

通过对主应用的日常迭代需求和当前研发现状分析，不难发现一些问题：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_23 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_23")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_24 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_24")

*   Tempo 的每次版本升级，都需要主应用需要更新依赖版本重新发布部署，无法做到**免发布部署**上线。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_25 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_25")

*   平台功能复杂，新用户使用**上手成本高**，**无智能问答和交互**能力

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_26 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_26")

*   CMS 平台未支持登录态互通和**多端样式适配**，用户无法实现**移动办公**

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_27 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_27")

*   无论是对于简单还是复杂需求，都需要研发人员代码开发，无法做到**在线配置，插件加载**

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_28 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_28")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_29 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_29")

解法
--

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_30 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_30")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_31 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_31")

为了解决以上问题，Tempo 明确了一切新特性都需构建在免发布部署之上，从而重新定义了主应用的研发模式，并支持了几项新特性分别如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_32 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_32")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_33 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_33")

### 免发布部署

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_34 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_34")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_35 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_35")

由于免发布部署是构建一切新特性的基础能力，通过对日常主应用迭代的需求做了总结和分类，明确主应用新的研发模式为：**简单需求在线配置，复杂需求代码开发和插件加载，公共特性自动升级。**

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_36 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_36")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_37 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_37")

*   简单需求：修改平台 Logo、标题、页脚信息、Layout 布局、搜索内容自定义等

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_38 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_38")

*   复杂需求：业务内特殊场景的自定义功能模块，如：无权限展示、人群圈选规则等

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_39 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_39")

*   公共特性：智能助手接入、移动办公支持等

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_40 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_40")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_41 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_41")

由于 Febase 默认的构建部署以及静态资源服务能力，无法对构建后的 html 内容做自定义修改；尽管靠建设新的网关和渲染服务可以实现 html 内容的自定义和动态渲染，但对于想尽快上线免发布部署能力来说，这无疑是增加了更多的实现和后期运维成本。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_42 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_42")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_43 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_43")

#### 实现方案

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_44 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_44")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_45 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_45")

那么，有没有一种 ROI 较低的方案来实现免发布能力呢？答案是有的，即：通过在 Febase 云构建时 external 主应用中 Tempo 的依赖，在构建完成后修改 html 内容增加 meta 标签用以存储获取版本的关键参数和真实 entry 文件路径，并动态修改 entry 入口为 loader 脚本；该脚本的作用是通过接口获取主应用的配置信息和 Tempo 的最新版本，在获取到版本信息后，在动态加载 Tempo 的 umd 资源地址和真正 entry 文件路径即可。整体流程如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_46 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_46")

![Tempo 免发布能力](/images/jueJin/b1b4503d39cb472.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_47 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_47")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_48 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_48")

#### 成本收益

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_49 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_49")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_50 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_50")

通过这样的方式改造和实现后，后续免发布能力仅需维护 loader 和构建插件逻辑即可。带来的收益也是很可观，主要体现在以下 2 个方面：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_51 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_51")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_52 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_52")

*   对于 Tempo 来说：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_53 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_53")

*   仅需维护 loader 和构建插件逻辑，升级范围在一定程度内是可控

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_54 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_54")

*   对于 Tempo 来说，在自身版本升级后，可全量推送新特性，无需推动已接入的主应用重新部署。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_55 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_55")

*   对于接入 Tempo 的主应用来说：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_56 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_56")

*   仅需一次部署，后续能力自动生效，对简单需求可做到在线一键配置直接发布，对复杂需求可通过异步加载插件的方式实现。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_57 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_57")

*   支持加载指定的 Tempo 版本，无需担心 BR 可能带来的任何问题

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_58 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_58")

*   无需关注 Tempo 升级而带来的主应用发布部署成本，可直接享受升级后的最新公共特性能力。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_59 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_59")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_60 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_60")

当然，由于 Tempo 新版本默认打开免发布部署能力，考虑到一些主应用许久未更新 Tempo 版本，可能会出现一些未知的 BR。因此也支持关闭免发布部署能力，仅需在 chitu.config.js 中修改参数即可，示例代码如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_61 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_61")

![赤兔配置](/images/jueJin/a77fa87bef4d43a.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_62 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_62")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_63 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_63")

### AIGC 探索与实践

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_64 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_64")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_65 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_65")

由于 ChatGPT 的横空出世，基于 LLM 的逻辑理解和推导能力以及对话式交互方式，掀起了 AIGC 的新一轮浪潮。相比较 C 端场景，在中后台场景下其交互和业务逻辑的复杂性使得平台本身具备一定的复杂度。当新用户想要快速了解和使用平台能力时，很多时候只能通过翻阅文档或摸索使用来确定平台具体的功能，这在一定程度上增加了平台的上手和理解成本。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_66 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_66")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_67 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_67")

而云音乐各类 CMS 平台也面临着类似的诸多问题，在这个背景下云音乐公技前端团队探索并构建了一个低成本接入 LLM 服务的产品方案；通过建设基础服务、收敛和沉淀通用服务、UI 交互和表达的方式，帮助业务快速地、低成本地构建知识库、智能问答、AI 驱动产品功能等一系列能力。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_68 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_68")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_69 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_69")

#### 智能识别

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_70 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_70")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_71 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_71")

相比较通过 NLP 来识别用户意图，LLM 的逻辑理解和推导能力更胜一筹；不仅能准确理解用户输入的内容，也能借助 Prompt 来提取用户输入的关键参数，具体展示如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_72 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_72")

![智能识别](/images/jueJin/e5e0da12fbd5419.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_73 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_73")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_74 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_74")

#### 智能回答

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_75 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_75")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_76 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_76")

在识别到用户的意图后，可根据服务返回的结果类型展示不同的内容，具体展示如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_77 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_77")

![智能问答](/images/jueJin/0120fe50e3de4c9.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_78 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_78")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_79 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_79")

#### 智能交互

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_80 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_80")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_81 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_81")

根据已识别的用户意图动作也可进一步与平台交互通信，比如打开页面、回填表单数据等，主要交互方式如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_82 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_82")

![智能交互](/images/jueJin/153db9ee75df45e.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_83 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_83")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_84 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_84")

### 多端样式适配

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_85 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_85")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_86 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_86")

为了满足业务人员移动办公的诉求，Tempo 支持多端自适应能力，并将用户的登录态与 PMS（PS：云音乐权限管理系统）做了打通处理，当在 Popo 内打开 CMS 平台应用链接时可直接免登成功。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_87 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_87")

在实现自适应能力时，主要考虑了以下三点：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_88 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_88")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_89 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_89")

#### 屏幕宽度区间

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_90 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_90")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_91 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_91")

根据不同屏幕大小的宽度，对屏幕宽度区间做了划分处理，整体分为三大类：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_92 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_92")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_93 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_93")

*   PC 屏幕展示（Screen >= 1200px），Layout 菜单支持上-左、左、上的布局，内容弹性布局展示，显示如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_94 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_94")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_95 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_95")

![PC 布局](/images/jueJin/9c6cea6fba0d400.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_96 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_96")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_97 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_97")

*   Pad 屏幕展示（1200px > Screen >= 768px），Layout 菜单仅支持左侧布局，内容弹性布局展示，显示如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_98 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_98")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_99 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_99")

![Pad 布局](/images/jueJin/246cd0ddc163472.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_100 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_100")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_101 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_101")

*   Phone 屏幕展示（768px > Screen），Layout 菜单默认不显示，通过点击 Logo 后左侧浮层唤出，表单内标题和控件各占一行显示，具体布局风格如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_102 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_102")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_103 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_103")

![Phone 布局](/images/jueJin/c406d5b3e55a43d.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_104 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_104")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_105 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_105")

#### 组件适配

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_106 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_106")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_107 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_107")

当确定了屏幕宽度区间后，就可以对依赖的组件进行样式适配，由于高频场景下都是一些容器、表格和表单、详情展示类组件，因此仅对这些高频组件做了相应的适配支持，主要包括：Modal、Table、Form、Layout、Description。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_108 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_108")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_109 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_109")

在对组件适配各端样式时，考虑 Pad 会有横屏模式，因此整体对端类型做了 5 种分类，实现了公共的 hook 以及获取屏幕类型、高度、宽度方法，具体方法实现如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_110 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_110")

![use-device](/images/jueJin/9a3f7b82b15146d.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_111 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_111")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_112 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_112")

#### 链接分享

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_113 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_113")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_114 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_114")

具体的免登实现是在在一个 H5 中转页面内做逻辑验证处理（具体实现不再此处过多说明），在 CMS 平台升级完成后，默认会在右下角增加分享当前页面的 Popo 链接地址入口，展示如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_115 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_115")

![链接分享](/images/jueJin/a5e279ef8fc7419.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_116 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_116")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_117 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_117")

### 在线配置

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_118 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_118")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_119 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_119")

在线配置能力是基于 PaaS 提供的主应用配置服务而实现的，Tempo 对一些常见的平台属性做了进一步的抽象和默认配置；不仅支持在线修改，也提供了相应的原子组件方便自定义动作或渲染逻辑；配置属性的优先级是：原子组件属性 > 主应用在线配置 > Tempo 默认配置，抽象的配置属性如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_120 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_120")

![应用配置](/images/jueJin/10d9647f0a024af.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_121 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_121")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_122 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_122")

### 插件加载

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_123 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_123")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_124 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_124")

异步加载插件是 Tempo 提供的另外一个能力，借助主应用在线配置能力，配置好目标插件的 umd 资源后，在平台初始化显示时自动加载该资源脚本。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_125 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_125")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_126 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_126")

当主应用或者子应用需要消费该插件时，可通过全局的 window 对象来获取，其对应的 key 为 umd 包的 library 名称。异步加载插件的组件核心实现如下：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_127 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_127")

![组件实现](/images/jueJin/f27285cc35a1421.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_128 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_128")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_129 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_129")

总结
--

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_130 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_130")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_131 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_131")

以上就是 Tempo 带来的新能力增强以及相关实现思路，通过免发布部署能力，让已接入 Tempo 的主应用具备自动升级特性，直接具备多端适配和移动办公能力；通过在线增加相关配置，可一键接入智能助手，这在一定程度上极大的降低了主应用因升级依赖而带来的研发部署成本。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_132 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_132")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_133 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_133")

未来，Tempo 会继续从业务实际场景出发，进一步封装和完善相应能力，为业务提效带来更多便利。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_134 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_134")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F201%2Fdiffs%235c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_135 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/201/diffs#5c5f9c2323c1b2b16b9baefd5c8adcc348f172e1_0_135")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！