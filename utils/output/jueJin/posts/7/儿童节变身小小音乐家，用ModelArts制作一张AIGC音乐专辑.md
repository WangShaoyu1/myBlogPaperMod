---
author: "华为云开发者联盟"
title: "儿童节变身小小音乐家，用ModelArts制作一张AIGC音乐专辑"
date: 2024-05-31
description: "本文分享自华为云社区《儿童节变身小小音乐家，用ModelArts制作一张AIGC音乐专辑》，文字秒变旋律，开启你的AIGC音乐创作旅程。"
tags: ["人工智能","AIGC中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:1,views:433,"
---
本文分享自华为云社区《[儿童节变身小小音乐家，用ModelArts制作一张AIGC音乐专辑](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428305%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428305?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： 华为云社区精选。

儿童节，如何给小朋友准备一份特别的礼物？

这份AIGC音乐专辑制作攻略一定要收下

一段文字灵感就能编织出一曲悠扬悦耳的旋律

童话、梦幻、探险……

任何关键词都可以成为音乐的创意基石

在华为云ModelArts上，简单4步

小朋友就可以化身为“小小音乐家”

开启一场奇妙的AI音乐创作之旅

感受AI魔法编织的奇妙音乐体验

![](/images/jueJin/4a248847dd9848f.png)

一、🎵文字生成旋律，变身小小作曲家
==================

我们的AIGC专辑制作先从文字生成旋律开始，**基于华为云ModelArts，无需考虑计算资源、环境的搭建，就算不懂代码也能用AI将简单的文字变成音乐旋律。**

> ModelArts是面向开发者的一站式 AI 开发平台，为机器学习与深度学习提供海量数据预处理及交互式智能标注、大规模分布式训练、自动化模型生成，及端-边-云模型按需部署能力，帮助用户快速创建和部署模型，管理全周期 AI 工作流。

为了让开发者在云上直接进行AI应用的开发，ModelArts提供CodeLab的开发方式，它类似一种云上编译器，可以直连云端算力，且每天都会提供免费算力资源时长，即开即用，非常便利。（注：本文所有案例均可在CodeLab中直接开发）

本案例使用的是开源模型MusicGen，它可以根据文字描述或者已有旋律生成高质量的音乐(32kHz)，原理是通过生成Encodec token然后再解码为音频。

![](/images/jueJin/fce6392e7584426.png)

> 利用EnCodec神经音频编解码器来从原始波形中学习离散音频token。EnCodec将音频信号映射到一个或多个并行的离散token流。然后使用一个自回归语言模型来递归地对EnCodec中的音频token进行建模。生成的token然后被馈送到EnCodec解码器，将它们映射回音频空间并获取输出波形。最后，可以使用不同类型的条件模型来控制生成。

**具体操作步骤如下：**

**第一步：准备账号，** 注册华为云账号并完成实名认证，开启音乐之旅！

**第二步：👉 [**访问页面**](https://link.juejin.cn?target=https%3A%2F%2Fpangu.huaweicloud.com%2Fgallery%2Fasset-detail.html%3Fid%3D37d01266-5762-463a-8cba-d3a394f19666 "https://pangu.huaweicloud.com/gallery/asset-detail.html?id=37d01266-5762-463a-8cba-d3a394f19666")，** 点击「ModelArts中运行」按钮，进入到ModelArts CodeLab运行环境中。选择限时免费运行环境，切换所需Kernel，一键运行代码。

![](/images/jueJin/df81a8fd5b4a413.png)

**第三步：切换运行环境，** 选择限时免费的GPU-P100规格，目前每个用户每天可以享受3小时的免费时长。然后点击代码块前面的三角形运行按钮，即可自动运行，完成模型的加载。

![](/images/jueJin/95ad1a6817d8426.png)

▲ 切换运行环境

![](/images/jueJin/d3fb52498332463.png)

▲ 点击三角形按钮运行代码

**第四步： 依次运行完代码后，修改输入的Prompt，** 比如“一首充满着梦幻和童真的歌曲”，即可生成符合提示词的音乐旋律，并支持直接下载。

![](/images/jueJin/fbff5963969e494.png)

▲ 修改提示词

![](/images/jueJin/15be47ad07824cd.png)

▲点击下载生成的音乐旋律

同时，ModelArts还支持可视化的Gradio界面展示，可以将生成的页面地址分享给其他人，让他们直接填入提示词，自定义旋律的时长，快速创作一首独一无二的歌曲。

![](/images/jueJin/b98802cf329441c.png)

▲ 单独的可视化界面

二、✍️AI作诗，为旋律作词
==============

古有曹植七步成诗，今有AI自动作诗。参考“文字生成旋律案例”的步骤，👉 [**点击链接**](https://link.juejin.cn?target=https%3A%2F%2Fpangu.huaweicloud.com%2Fgallery%2Fasset-detail.html%3Fid%3D9519401d-e3df-4ca3-91e2-98bf4220f877 "https://pangu.huaweicloud.com/gallery/asset-detail.html?id=9519401d-e3df-4ca3-91e2-98bf4220f877") 选择在ModelArts中运行，进入到ModelArts CodeLab环境，然后切换资源规格，依次运行代码，并在下图的画框处填写诗句的第一个字，3秒钟就能生成相关的诗句。

![](/images/jueJin/b81c50166b5a432.png)

![](/images/jueJin/f194aa4b788346e.png)

三、🎨AI作画，为音乐制作专辑封面
==================

最后是专辑封面环节，👉 [**点击链接**](https://link.juejin.cn?target=https%3A%2F%2Fpangu.huaweicloud.com%2Fgallery%2Fasset-detail.html%3Fid%3D03aab198-dc21-4974-ab33-352e9f56939c "https://pangu.huaweicloud.com/gallery/asset-detail.html?id=03aab198-dc21-4974-ab33-352e9f56939c") 进入“AI作画-文字生成图片Stable Diffusion”案例页面，选择在ModelArts中运行，进入ModelArts CodeLab，将运行环境切换成GPU的规格，模型生成图像所用的时间会更短。

这个案例主要基于文本转图像模型Stable Diffusion来实现，它通过LAION-5B子集大量的512x512图文模型进行训练，所以只要简单的输入一段文本，Stable Diffusion就可以迅速将其转换为图像。

同之前的两个案例，依次运行代码，在Prompt的划线处填写与音乐旋律相匹配的提示词，建议先用中文描述，再用翻译软件转换为英文，这样生成的图片会更加精准。

![](/images/jueJin/97f9983cfae74c6.png)

🎹结语
====

至此，从曲子、歌词到封面，一张AIGC专辑应运而生。你不必是精通音符的大师，也无需深谙乐理，只需一键启动ModelArts，每一次灵感闪现，都会化作独一无二的旋律流淌而出。

**最后祝大小朋友们儿童节快乐！**

快来华为云ModelArts试试神奇的“AI音乐魔法”，体验创作的乐趣，让小小音乐梦想照进现实！🎶

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")