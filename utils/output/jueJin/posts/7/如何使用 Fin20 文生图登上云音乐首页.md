---
author: "网易云音乐技术团队"
title: "如何使用 Fin20 文生图登上云音乐首页"
date: 2023-11-14
description: "Fin20 是一款由云音乐公共技术部开发的智能设计助手。产品愿景是：通过 AIGC 赋能设计过程，降低设计的门槛和成本，让业务创新变得简单。"
tags: ["AIGC","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:9,comments:1,collects:3,views:2648,"
---
[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_4 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_4")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_5 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_5")

![题图](/images/jueJin/8673c5cadeeb4d3.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_6 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_6")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_7 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_7")

> 本文作者：原草（李磊）

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_8 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_8")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_9 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_9")

一、背景介绍
======

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_10 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_10")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_11 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_11")

1.1 什么是 Fin2.0？
---------------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_12 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_12")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_13 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_13")

Fin2.0 是一款由云音乐公共技术部开发的智能设计助手。产品愿景是：**通过 AIGC 赋能设计过程，降低设计的门槛和成本，让业务创新变得简单**。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_14 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_14")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_15 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_15")

![AIGC 能力矩阵](/images/jueJin/a52b43f22ab54a0.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_16 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_16")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_17 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_17")

我们利用 AIGC 能力矩阵：「文生图」、「文生 ICON」、「文生稿」，重构了整个设计流程。可以让策划、设计和运营，充分利用 AIGC 的相关能力来赋能设计过程，不仅能提高设计效率，还能降低沟通成本，同时可以避免使用外部服务造成数据安全的风险。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_18 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_18")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_19 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_19")

1.2 事件背景
--------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_20 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_20")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_21 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_21")

Jersey 是云音乐电波工作室的一位商务同学，负责站内的歌曲推广。这天临时需要设计资源对新歌做推广，可是设计师大大们的档期已经约不到了。这种情况下，商务同学大多数时候会选择请求外部资源。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_22 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_22")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_23 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_23")

还好， Jersey 同学之前通过设计师室友了解到过 Fin2.0 产品，加上自己有过美术相关的设计功底，因此选择通过 Fin2.0 文生图，来生成设计原画，自己来做文字的排版和布局。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_24 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_24")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_25 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_25")

![banner 位图片资源](/images/jueJin/e95de9884699494.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_26 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_26")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_27 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_27")

最终，Jersey 同学通过半天时间的文生图尝试，完成了两张高质量的 banner 位图片资源，很好完成了站内的歌曲推广工作。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_28 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_28")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_29 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_29")

1.3 落地成果
--------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_30 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_30")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_31 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_31")

通过 Fin2.0 文生图功能，可以快速生成大量高质量的图片，大大节省了生产内容的时间和成本。不同类型的场景可以生成不同类型的内容，满足不同的设计和业务需求，扩大内容生产的覆盖面。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_32 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_32")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_33 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_33")

![日飙升榜「第 2 名」](/images/jueJin/f78d8a58303e42e.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_34 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_34")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_35 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_35")

本次文生图案例，帮助 Jersey 同学完成了临时设计资源的需求，助力歌曲很好的进行站内流量转化，歌曲实现了日飙升榜「第 2 名」的好成绩。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_36 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_36")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_37 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_37")

二、Fin2.0 文生图功能介绍
================

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_38 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_38")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_39 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_39")

在 Fin2.0 产品设计之初，我们经过了大量的走查调研，了解设计团队现阶段使用 AIGC 工具的方式，以及在使用 AIGC 生成图片的一些问题。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_40 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_40")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_41 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_41")

![使用 AIGC 生成图片的一些问题](/images/jueJin/0838bdfa2521426.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_42 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_42")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_43 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_43")

主要有以下三类问题：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_44 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_44")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_45 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_45")

1.  Dreammaker（公司内部署的 Stable Diffusion 服务）使用门槛较高，生图过程需要完成复杂的配置，比如：大模型、Lora、提示词、负向提示词、controlnet、采样器、VAE 等；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_46 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_46")

2.  Midjourney 工具需要自费使用，每个团队都有大量生图资源和多账号需求，一般会选择采购多个账号，这对团队开销形成了一定压力；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_47 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_47")

3.  对于保密项目，使用外部生图工具（例如：Midjourney）又会担心项目数据安全的问题；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_48 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_48")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_49 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_49")

我们选择与 Dreammaker 合作， 使用其底层计算能力，这样所有的生图数据都会存在公司内部，不必要再担心使用外部设计工具存在的数据泄露问题。同时，Dreammaker 丰富的计算资源，也为 Fin2.0 的服务稳定和生图效率提供了保障。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_50 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_50")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_51 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_51")

2.1 三步生成图片
----------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_52 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_52")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_53 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_53")

使用 Stable Diffusion 进行创作，一个文生图步骤，最少需要 30 多个配置参数，主要分为三大类：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_54 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_54")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_55 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_55")

1.  必须类型：

参数名称

参数说明

model\_name

模型名称，底模

prompt

正向提示词

3.  基础类型：

参数名称

参数说明

negative\_prompt

负向提示词

sampler\_name

采样方法

steps

采样迭代步数

width

图片宽度

height

图片高度

cfg\_scale

提示词相关度

n\_iter

迭代次数，图片数量

seed

随机种子

5.  辅助类型：

参数名称

参数说明

enable\_hr

是否开启高分辨率

hr\_scale

高分辨率放大倍率

denoising\_strength

重绘幅度

hr\_upscaler

高分辨率放大算法

hr\_resize\_x

将宽度调整到

hr\_resize\_y

将宽度调整到

LoRA：用于完成特定功能、特定风格、特定形象，一般和底模配合使用

参数名称

参数说明

model\_name

模型名称

text\_encoder\_weights

高分辨率放大倍率

denoising\_strength

文本编码权重

unet\_encode\_weights

unet 编码权重

ControlNet，用于特殊场景配置

参数名称

参数说明

open

是否开启

processor

预处理

model

模型名称

weight

权重

pixel\_perfect

是否使用 pixel\_perfect

我们总结了一些常用的设计场景：推广和礼物原画的设计场景、游戏图标设计场景、3D 设计场景、赛博朋克设计场景、中国风设计场景、绘画风设计场景等。配合上一个能力强大的基础模型 SDXL，汇合成应用场景下的选项。用于满足在设计和运营日常需求的大部分设计场景。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_104 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_104")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_105 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_105")

每个设计场景，都配置了一套上面的生图参数，每个场景的需求不同，使用的模型也不同。像是用于偏向原画生成会选择 nijiv5style 模型，用于人物生成会选择 MeinaMix 模型，用于写真场景会选择 revAnimatedv122 模型等。另外场景会配合用于生成特定功能、特定风格、特定形象 LoRA 进行微调。共同实现该场景下图片生成的工作。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_106 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_106")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_107 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_107")

![三步生成图片](/images/jueJin/ae10905008d8491.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_108 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_108")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_109 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_109")

这样，一个看上去复杂的生图工作，就被汇总为简单三步：书写提示词、选择应用场景、点击生成。即刻获得理想的设计素材。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_110 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_110")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_111 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_111")

2.2 提示词模版
---------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_112 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_112")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_113 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_113")

在上文的三步生图步骤中，第一步就是提示词。提示词关系到了图片生成的内容、风格、角度等。提示词之于文生图，就仿佛剧本分镜之于电影，就仿佛草稿大纲之于小说，就仿佛说明规则方法之于 AutoGPT。是决定了一张图片灵魂与命运的主旋律。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_114 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_114")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_115 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_115")

但是，往往越是重要的东西，很多同学在使用的时候越是无从下手。因此，我们总结了一套公式，用于拼装组合成文生图的提示词。有了这套公式，在书写提示词也会知道如何下手，并且如何科学的修改提示词。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_116 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_116")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_117 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_117")

![提示词模版](/images/jueJin/e4b6ddee6b2a470.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_118 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_118")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_119 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_119")

提示词万能公式 = 画面主体 + 主体修饰 + 镜头光影 + 风格设定

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_120 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_120")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_121 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_121")

这套提示词主要包含四部分：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_122 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_122")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_123 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_123")

*   画面主体：画面中主体内容，通常是人物、动物、物体。例如：少年、美少女、羊、湖泊、高山、礼物盒、黑胶、唱片机等；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_124 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_124")

*   主体修饰：接下来就是描述主体状态的词语。例如：五官（大眼睛、红嘴唇）、表情（微笑、困惑、叹息）、头发（长头发、粉色头饰）、服饰（牛仔裤、汉服、圣诞帽），动作（跑、跳、飞），环境（城市、草原、日出、花海、沙漠、戈壁、大海）

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_125 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_125")

*   镜头光影：这部分主要就是成像的角度和光影，有摄影经验的同学会有体会。例如：镜头角度（中景、俯视图、水下拍摄、广角）、光线（氛围光、丁达尔效应、霓虹光）、画面质量（大师质量、高清画质）

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_126 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_126")

*   风格设定：最后就是整体呈现的画面风格，这部分有些情况下也会由模型和 LoRA 来代替。例如：风格（吉卜力风格、皮克斯动画）、画面类型（照片、写实、纹理、中国风）

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_127 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_127")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_128 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_128")

如此按照上面的结构，就可以完成一个标准的文生图提示词。至于为什么需要这么做，我会在下面章节「如何写好提示词」进行进一步的阐述。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_129 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_129")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_130 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_130")

但是，像是 SDXL 这样的模型，已经完全摆脱了这样类似 tag 的描述方式。SDXL 完全支持通过语义化描述画面内容的方式，例如我在一次业务中使用到的描述：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_131 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_131")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_132 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_132")

> 远处是沙漠,近处是胡杨树林,大面积的湖面,戈壁,少量羊,蒙古包,丰富细节,水粉画,远景,风景

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_133 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_133")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_134 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_134")

2.3 高级设置、历史记录、素材库
-----------------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_135 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_135")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_136 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_136")

对于 Stable Diffusion 的高级玩家，或是对生图需要细致调节的用户，我们也准备了高级设置功能。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_137 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_137")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_138 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_138")

![高级设置](/images/jueJin/69f903c0b5c44f5.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_139 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_139")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_140 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_140")

*   尺寸-分辨率：常用模型尺寸围绕 512\*512 进行配置，SDXL 围绕 1024\*1024 进行修改，这是和模型训练时使用的资源相关的；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_141 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_141")

*   迭代次数：Stable Diffusion 是基于噪点图像生成图片的，每次的迭代会对比提示词和当前迭代结果，默认值即可，某些情况下增加迭代次数可以增加图片细节；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_142 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_142")

*   提示词强度：迭代过程与提示词的对比强度；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_143 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_143")

*   随机种子：代表起始生成的噪点图；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_144 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_144")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_145 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_145")

我们还支持了生成历史和素材库两个功能。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_146 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_146")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_147 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_147")

![生成历史和素材库](/images/jueJin/1caced4e4817420.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_148 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_148")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_149 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_149")

「生成历史」包含了使用 Fin2.0 生图工具过程中生产的所有图片，收藏功能便于用户查找精品图片。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_150 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_150")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_151 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_151")

「素材库」是 Fin2.0 内部画廊，优秀作品的展出舞台。想要生成同款素材可以使用一键同款功能，复制提示词和参数，生成自己的素材。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_152 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_152")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_153 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_153")

三、Fin2.0 生图经验分享
===============

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_154 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_154")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_155 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_155")

在推广 Fin2.0 生图工具的过程，有各种各样的使用生图工具的姿势。最典型的一种就是只描述自己的需求，但是没有描述图片的具体内容。例如：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_156 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_156")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_157 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_157")

> 我想要一个盲盒皮肤

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_158 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_158")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_159 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_159")

想要使用好工具，除了通过定制生图模型参数、科学配比提示词，最好的方式就是了解生图模型是如何运作的。这样，知其然知其所以然，才能更好的使用生图工具。下面我就通过自己的视角，来解释生图模型和提示词在其的作用。以及如何在使用最基本的生图模式的情况下，更好的完成复杂图片的生成。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_160 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_160")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_161 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_161")

3.1 如何理解生图模型
------------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_162 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_162")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_163 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_163")

Stable Diffusion 的生图原则，就是将文字信息和图片信息通过噪声预测器进行转化。这样在文生图的时候，就可以把文字信息转化为图片信息。图生图同理，把图片信息加上一定的文字信息（作为修改）再转化为图片信息。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_164 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_164")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_165 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_165")

![Stable Diffusion 生图流程](/images/jueJin/e4a5c52a9f6c4e1.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_166 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_166")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_167 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_167")

因为每张图片像素分布满足一定规律分布，比如人脸有眼睛鼻子嘴巴，汽车是长方体有轮子。因此可以利用文本信息作为指导，把一张纯噪声的图片逐步去噪，生成一张跟文本信息匹配的图片。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_168 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_168")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_169 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_169")

整个生图过程是一个组合系统，里面包含了多个模型子模块。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_170 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_170")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_171 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_171")

首先，把文本信息转化为数字信息，这里就用到了文本编码器 text encoder（蓝色模块），可以把文字转换成计算机能理解的某种数学表示，它的输入是文字串，输出是一系列具有输入文字信息的语义向量。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_172 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_172")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_173 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_173")

接下来，有了这个语义向量，就可以作为后续图片生成器 image generator（粉黄组合框）的一个控制输入，这也是 stable diffusion 的核心模块。图片生成器生成潜在图像（也就是噪声图片），噪声预测器根据语义向量估计噪声图片中的噪声，从噪声图片中减去预测出来的噪声，生成新的潜在图像。多次重复上面的「预测+去除噪声」过程，最终得到生成图片。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_174 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_174")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_175 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_175")

想要使用好文生图，理解到这里就够了。因此想要生成一张好的图片，最好的办法就是描述出图片中的信息，也就是描述清楚提示词。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_176 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_176")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_177 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_177")

3.2 如何理解提示词
-----------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_178 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_178")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_179 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_179")

上面提示词模版介绍了如何科学的书写提示词。那么根据上文中图片信息是由文字信息转化来的，这里的文字信息一般用 token 表示（对，就是 ChatGPT 里同样使用的 token）。因此，也就难怪为什么我们描述图片信息的时候，都是一个一个的单词或短语了。当然，最新的 SDXL1.0 模型已经支持用自然语言描述图片内容。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_180 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_180")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_181 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_181")

至于为什么这么写提示词，我们还是从训练模型的过程中找找原因。训练一个图片模型，一定会需要图片和文字信息成对存在，也可以称为打标签。接下来，我们来做个测试。下面是是一张我用 Fin2.0 文生图创建的图片，请描述下面的图片：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_182 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_182")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_183 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_183")

![测试图片](/images/jueJin/6417d69687704c5.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_184 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_184")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_185 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_185")

如果没有经过一定的训练，或是按照一定的标准。我想大家的描述可能会是这样的：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_186 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_186")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_187 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_187")

*   戈壁图片，有山、有水、有羊；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_188 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_188")

*   黄色的草原氛围图；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_189 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_189")

*   新疆山水+胡杨树+羊；

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_190 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_190")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_191 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_191")

我实际采用的描述词是这样的：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_192 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_192")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_193 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_193")

> 远处是沙漠,近处是大面积的胡杨树林,大面积的湖面,戈壁,绵羊,蒙古包,丰富细节,近景,风景,儿童水彩画,

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_194 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_194")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_195 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_195")

可以看到，一张图片在不同人的理解下，所使用的文字描述一定是不同的。但是，在进行模型训练的时候，大多都是采用 tag 的方式，按照画面主体、主体描述、风格设定、镜头光影，这样大致的分类来分层次描述。因此，这也是为什么采用上面的格式书写提示词，才是最高效的。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_196 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_196")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_197 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_197")

3.3 如何制作复杂图片
------------

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_198 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_198")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_199 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_199")

在实际使用文生图的过程中，已经按照提示词模版科学的书写提示词，可是画面还是不受控制，还是没有达到我想要的样子，这是为什么呢？

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_200 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_200")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_201 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_201")

有一部分原因是对模型理解的不到位。比如：使用了一个擅长生成风景的模型来生成人物；使用了一个擅长生成国风风格的模型来生成漫画风；使用 1024\*1024 尺寸来要求模型（训练时采用的 512\*512 尺寸图片）生成图片，结果图片崩坏多头多手（SDXL1.0 是支持 1024\*1024 尺寸图片生成的）。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_202 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_202")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_203 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_203")

因此，对一个新需求最快捷的完成方式是：一方面，查看模型的预览图，查找最合适的模型，按照常规 512\*512 尺寸生图；另一方面，可以采用同一批提示词，对不同模型进行尝试，查找最符合自己需求的模型或场景。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_204 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_204")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_205 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_205")

选好了模型，再有就是给模型提供更多的信息。按照上文模型生图的原理，除了可以提供文字信息，也可以提供图像信息，通过图生图来生成。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_206 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_206")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_207 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_207")

下面，我就介绍下在没有 controlnet 或是其他 Stable Diffusion 插件的情况下，实际生产过程是如何如何生成复杂图片的。比如有这样一个需求：需要生成一个盲盒贴图，画面中有情侣头像、爱心、花朵、问号元素。如果简单把元素输入到提示词当中，那一定是抽盲盒似的，每次生成的内容都是不一样的，而且很少有图片能达到设计需求。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_208 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_208")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_209 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_209")

![制作复杂图片](/images/jueJin/53362db11b3142f.png)

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_210 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_210")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_211 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_211")

通过图生图生成图像，就好像为图片生成了一部分草稿，让模型按照我们的要求来生成图像。因此我先生成局部头像，然后采用设计工具 mastergo 或 figma 对图像进行拼装，配合上底色和关键元素问号。最后，使用这样一张草图让模型进行重新润色。这样只需几个简单的过程，就可以很快的得到理想的图片。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_212 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_212")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_213 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_213")

四、总结
====

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_214 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_214")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_215 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_215")

现在 Fin2.0 文生图已经有大量的落地案例。例如：

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_216 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_216")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_217 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_217")

*   云音乐商务推广运营位图片

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_218 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_218")

*   云音乐商城 H5 头图

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_219 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_219")

*   社交直播盲盒贴图

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_220 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_220")

*   社交直播称号背景图

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_221 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_221")

*   ...

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_222 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_222")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_223 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_223")

想用好一个工具，最好的办法还是多练习。本文只是从很基础的方式介绍了如何使用 Fin2.0 生图工具，如何填写提示词，如何理解模型、理解提示词，如何采用更高效的方式生成更复杂的图片。除此之外，Stable Diffusion 还有很多值得去学习的知识。例如：上面罗列的那么多文生图过程中使用的参数，对生成图像有什么影响？文中提到的 ControlNet 是什么东西？如何生成更高清画质的图像？

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_224 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_224")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_225 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_225")

回到文章最初，Fin2.0 工具的愿景就是：**通过 AIGC 赋能设计过程，降低设计的门槛和成本，让业务创新变得简单**。接下来我们会持续收集用户在使用文生图过程中的反馈。持续迭代优化产品，通过 Fin2.0 为用户提供更多便捷易用的功能。

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_226 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_226")

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_227 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_227")

参考链接
====

*   [huggingface.co/docs/diffus…](https://link.juejin.cn?target=https%3A%2F%2Fhuggingface.co%2Fdocs%2Fdiffusers%2Fapi%2Fpipelines%2Fstable_diffusion%2Ftext2img "https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img")
    
*   [github.com/AUTOMATIC11…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAUTOMATIC1111%2Fstable-diffusion-webui%2Fwiki%2FFeatures%23prompt-matrix "https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-matrix")
    
*   [stablediffusionxl.com/](https://link.juejin.cn?target=https%3A%2F%2Fstablediffusionxl.com%2F "https://stablediffusionxl.com/")
    

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_232 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_232")

*   [github.com/CompVis/lat…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCompVis%2Flatent-diffusion "https://github.com/CompVis/latent-diffusion")
    
*   [zhuanlan.zhihu.com/p/628714183](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F628714183 "https://zhuanlan.zhihu.com/p/628714183")
    

[](https://link.juejin.cn?target=https%3A%2F%2Fg.hz.netease.com%2Fcloudmusic-league%2Fcolumn%2F-%2Fmerge_requests%2F206%2Fdiffs%237a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_234 "https://g.hz.netease.com/cloudmusic-league/column/-/merge_requests/206/diffs#7a3ec148b3f2580c7a8ac289e5a7dfb44a878522_0_234")

*   [www.uisdc.com/lora-model](https://link.juejin.cn?target=https%3A%2F%2Fwww.uisdc.com%2Flora-model "https://www.uisdc.com/lora-model")

最后：
===

![{"anchor_href":"","expected_size":"-1,-1","external_info":"","id":"1007","image_margin":2,"image_url":"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2617b7ff8c14571af1b2cbd805fb0e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=985&s=101564&e=png&b=fefefe","original_name":"","original_path":"C:/Users/wb.qiujunjie02/AppData/Local/netease/popo/users/wb.qiujunjie02@mesg.corp.netease.com/image/d1cba265d31bca682b7eaa839cfd5943.png","original_size":"-1,-1","press_can_drag":true,"show_in_image_viewer":true}](/images/jueJin/007835386a6e44a.png)

更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")