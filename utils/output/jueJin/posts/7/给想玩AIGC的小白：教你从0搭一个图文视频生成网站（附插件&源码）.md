---
author: "腾讯云开发者"
title: "给想玩AIGC的小白：教你从0搭一个图文视频生成网站（附插件&源码）"
date: 2023-04-06
description: "Stable Diffusion的发布是AI图像生成发展过程中的一个里程碑，相当于给大众提供了一个可用的高性能模型，让「AI 文本图片生成」变成普通人也能玩转的技术。最近一些网友将网上的"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:38,comments:1,collects:74,views:2386,"
---
![图片](/images/jueJin/f7f7657974fa43c.png)

![图片](/images/jueJin/46fcce85270b4e6.png)

**👉腾小云导读**

Stable Diffusion的发布是AI图像生成发展过程中的一个里程碑，相当于给大众提供了一个可用的高性能模型，让「AI 文本图片生成」变成普通人也能玩转的技术。最近一些网友将网上的真人图片不断喂给模型，让其自主学习，训练出来的效果已经可以做到以假乱真——你甚至不知道哪些图片是 AI 生成的还是真人拍出来的。你感兴趣吗？今天这篇文章从零开始，手把手教你如何搭建自己的真人 AI 网站。强烈建议收藏（不管是否吃灰）。

**👉看目录，点收藏**

1\. 搭建你自己的 AI 网站

2\. 模型下载

3\. 汉化插件下载

4\. 生成你的真人图片

4.1 生成真人图片

4.2 不同风格图片生成

4.3 动画视频生成

5\. 让你生成的图片开口说话

01、搭建你自己的AI网站
-------------

本篇我们将单刀直入教各位最快搭建出一个质量不错的 AI 网站，如果各位想了解相关的原理、技术点，可以留言告诉我们。下文会提及的**模型、插件和源码**，我们也一并提前为各位整理～**点击下方公众号卡片，进入回复「AI网站」即可领取。**

第一步，我们可以直接使用 GitHub 仓库：

stable-diffusion-webui。

![图片](/images/jueJin/c3fee2215921420.png)

首先，在电脑上安装 python 3.10.6，如果已经安装了其他 python 版本，可以利用 conda 安装多一个 3.10 的虚拟环境版本：

conda create -n novelai python==3.10.6

接下来下载该仓库的代码：

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

再安装对应的 GPU 版本的 Pytorch，直接进入网站：

[pytorch.org/get-started…](https://link.juejin.cn?target=https%3A%2F%2Fpytorch.org%2Fget-started%2Flocally%2F%25EF%25BC%258C%25E5%25A4%258D%25E5%2588%25B6%25E5%25AF%25B9%25E5%25BA%2594%25E7%259A%2584%25E5%2591%25BD%25E4%25BB%25A4%25E3%2580%2582 "https://pytorch.org/get-started/locally/%EF%BC%8C%E5%A4%8D%E5%88%B6%E5%AF%B9%E5%BA%94%E7%9A%84%E5%91%BD%E4%BB%A4%E3%80%82")

![图片](/images/jueJin/13451c1e57a64de.png)

进入刚刚创建的虚拟环境”novelai“：

![图片](/images/jueJin/ba07cb7fafed4b6.png)

执行刚刚的命令：

```bash
./python -m pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu116
```

安装成功后，可以测试自己的 pytorch 版本是否可以跑通。

![图片](/images/jueJin/84038d1541004ec.png)

进入刚刚下载的 Github 仓库的代码文件夹，安装第三方依赖：

```
python -m pip install -r requirements.txt
```

02、模型下载
-------

有了网站之后，就需要下载对应的 AI 模型进行有效生成。一些网友已经利用网上大量的图片训练好的模型，并分享到网站上。我们举个例子：

[civitai.com/](https://link.juejin.cn?target=https%3A%2F%2Fcivitai.com%2F "https://civitai.com/")

这个大名鼎鼎的网站被人们称为「C 站」，里面有很多你意想不到的模型。

![图片](/images/jueJin/f429c7c48d07458.png)

可以在这个网站上找到很多已经训练好的模型。例如找一个生成真人图片的模型：ChilloutMix。从网页上下载对应的模型后，把该模型放到工程目录：models/Stable-diffusion。

![图片](/images/jueJin/02702da49b4c440.png)

![图片](/images/jueJin/242a4290e9a8451.png)

03、汉化插件下载
---------

stable-diffusion-webui 这个项目还支持下载第三方插件。例如我们可以下载对应的汉化插件。其下载地址如下：

[github.com/dtlnor/stab…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdtlnor%2Fstable-diffusion-webui-localization-zh%255C_CN "https://github.com/dtlnor/stable-diffusion-webui-localization-zh%5C_CN")

登陆上面网站后，就可以下载插件的安装包：

![图片](/images/jueJin/ca6304df1de347b.png)

然后将文件解压放到 extensions 目录下：

![图片](/images/jueJin/a237db3a2fb1473.png)

接着，就需要对网页进行重启服务：

![图片](/images/jueJin/a8609b332de2446.png)

在扩展这里，把插件勾上：

![图片](/images/jueJin/4df5883d781944c.png)

在“设置”选项里，找到 zh\_CN，最后需要重新启动网页，就可以生效了：

![图片](/images/jueJin/d8bfde6c9aed403.png)

![图片](/images/jueJin/aceccf340eb148a.png)

04、生成你的真人图片
-----------

启动主程序"launch.py"，等待一定的时间出现网页地址就可以了。

![图片](/images/jueJin/ceb146b5c4e1430.png)

打开网址时，有时候可能模型没有更新。因此可以尝试一下多次重启。需要选择刚刚下载的模型：ChilloutMix。

![图片](/images/jueJin/3bd81be1fb3444b.png)

这样就已经完成前期的部署工作了。接下来详细教大家怎么生成自己想要的图片。

#### **4.1 生成真人图片**

在c站上，已经有很多大神利用 promt 生成图片了，因此我们就可以对这些进行参考。例如找一个好看的图片，对下面的 Prompt 词语进行复制：

![图片](/images/jueJin/5b779b864b11492.png)

其中 Prompt 词语放在提示词框内，消极 Prompt 词语放在对应的方框内。同时调整对应的参数，最后就可以生成真人图片：

![图片](/images/jueJin/9868446a0d7f473.png)

* * *

#### **4.2 不同风格图片生成**

在 C 站上，还有很多 Lora 模型可以进行下载。这是一种可以帮助你调整画风的小模型。主要是放到 Prompt 中进行使用。例如我们可以在网站上下载原神的 Lora 模型：

![图片](/images/jueJin/bc7248858701415.png)

‍下载完成后，把模型放到 models/Lora 路径下：

![图片](/images/jueJin/6faec2348e8d494.png)

按照图片下的步骤，选中模型后，会看到具体的 Prompt 在方框内了：

![图片](/images/jueJin/975bc24d080d4f1.png)

把步骤 4.1 中的 Prompt 词语加入到这里，就可以生成一个原神风格的图片：

![图片](/images/jueJin/5de74ee0c0124a8.png)

* * *

#### **4.3 动画视频生成**

首先需要安装插件 **“deforum”** 这个插件能够根据多个生成的图片构造成视频动画。

[github.com/deforum-art…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdeforum-art%2Fdeforum-for-automatic1111-webui "https://github.com/deforum-art/deforum-for-automatic1111-webui")

在当前 stable-diffusion 目录下，执行下面命令，就会发现 extensions 多了新的插件：

```bash
git clone https://github.com/deforum-art/deforum-for-automatic1111-webui extensions/deforum
```

![图片](/images/jueJin/cab73fbddbd1437.png)

同时重启新的网页，会发现多了 deforum 这个选项：

![图片](/images/jueJin/85882f85153a449.png)

可以先执行简单的生成，在提示词上，已经默认填写了语句：

```json
    {
    "0": "tiny cute swamp bunny, highly detailed, intricate, ultra hd, sharp photo, crepuscular rays, in focus, by tomasz alen kopera",
    "30": "anthropomorphic clean cat, surrounded by fractals, epic angle and pose, symmetrical, 3d, depth of field, ruan jia and fenghua zhong",
    "60": "a beautiful coconut --neg photo, realistic",
    "90": "a beautiful durian, trending on Artstation"
}
```

最后生成出来的视频如下：

![图片](/images/jueJin/1d72229c2213436.png)

Prompt 词语模板解释如下：

```json
//Abstracted Example
    {
    "0": "Prompt A --neg NegPompt"
    "12": "Prompt B"
}
```

其中“0”和“12”提示在插值中解析的关键帧。Prompt A 和 B 是肯定提示，NegPrompt 是否定提示。当然，也可以直接用上面 C 站下载下来的模型，生成真人动画。

![图片](/images/jueJin/6ca0eea508d7485.png)

05、让你生成的图片开口说话
--------------

从上面我们已经得到了生成的图片。那么就可以利用这张图片，创建自己的 AI 说话视频。登陆这个网址：

[studio.d-id.com/](https://link.juejin.cn?target=https%3A%2F%2Fstudio.d-id.com%2F "https://studio.d-id.com/")

![图片](/images/jueJin/10f6fcc01dcd4a2.png)

选择刚刚生成的图片，然后输入自己想要说的话，之后生成就可以了：

![图片](/images/jueJin/4bcad23eb132426.png)

最后就可以得到比较逼真的真人 AI 说话视频了。

![图片](/images/jueJin/7f6e6472e0e7441.png)

有了这个技术，就可以批量制作二次元甚至是真人说话视频。这对于 AICG 这个行业是一个颠覆性的技术，相信未来这个技术在多个领域上都能够推广开来。 **点下方卡片进入公众号，在后台回复「AI网站」，即可0门槛领取本文所述模型、插件和源码。** 快来展示你的搭建成果吧～

以上是本次分享全部内容，欢迎大家在评论区分享交流。如果觉得内容有用，欢迎转发～

\-End-

原创作者｜李洛勤

技术责编｜李洛勤

![图片](/images/jueJin/1cf36f903b9d4a8.png)

最近无论是火爆的 GPT 智能文本生成模型，还是Diffusion Model（GLIDE、DALLE2、Imagen等）智能图片生成模型，AIGC领域给人惊喜不断。它使用深度学习算法，从大量的数据中学习模式，以创建高质量的文本、音频、图像和视频。在《[这波可以，终于有内行人把 GPT-4 说透了](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI2NDU4OTExOQ%3D%3D%26mid%3D2247594780%26idx%3D1%26sn%3D8816118c7069ce76cd79c94651fc743e%26chksm%3Deaa9694cdddee05aea1edc11d9515225e1d4f35ca4d6fe41a14e5e4f37e6b26611d9d4553336%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzI2NDU4OTExOQ==&mid=2247594780&idx=1&sn=8816118c7069ce76cd79c94651fc743e&chksm=eaa9694cdddee05aea1edc11d9515225e1d4f35ca4d6fe41a14e5e4f37e6b26611d9d4553336&scene=21#wechat_redirect")》《[TVP专家夜聊：不用ChatGPT的开发都该被炒掉](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI2NDU4OTExOQ%3D%3D%26mid%3D2247594780%26idx%3D2%26sn%3D6b117b7cf1c1912dff5a28b3cc30787e%26chksm%3Deaa9694cdddee05aec31d2c962d662bc936b3fc9225e83d7b05b9ad1c73504444d48b750561c%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzI2NDU4OTExOQ==&mid=2247594780&idx=2&sn=6b117b7cf1c1912dff5a28b3cc30787e&chksm=eaa9694cdddee05aec31d2c962d662bc936b3fc9225e83d7b05b9ad1c73504444d48b750561c&scene=21#wechat_redirect")》两篇中，我们探讨了「GPT们」的发展对程序员的影响——会取代程序员吗？各位程序员朋友们给出了精彩的回答：

![图片](/images/jueJin/6a8e3f739b10473.png)

![图片](/images/jueJin/628e703bd2b54fd.png)

![图片](/images/jueJin/269b51c75d934f8.png)

![图片](/images/jueJin/35c9ca6c63e4437.png)

AIGC深度学习模型不断完善、开源模式的推动、大模型探索商业化的可能，成为让其发展的加速度。**总体来说，我们看到了AIGC在未来更可能是与人类合作的模式。人类可以借助AI技术进行创作和生产，提高生产效率和质量。**

![图片](/images/jueJin/a289d707ecbf4e9.png)

**“你还能想到AIGC什么应用方式？ta还能帮助程序员做什么？“**

欢迎在评论区聊一聊你的看法。在4月12日前将你的评论记录截图，发送给腾讯云开发者公众号后台，可领取腾讯云「开发者春季限定红包封面」一个，数量有限先到先得😄。我们还将选取点赞量最高的1位朋友，送出腾讯QQ公仔1个。4月12日中午12点开奖。快邀请你的开发者朋友们一起来参与吧！

关注公众号并点亮星标 不错过更多鹅厂学习资源

**公众号回复「AI网站」，领取本文模型、插件和源码**

[阅读原文](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F22gbSI1hq6KQV35UcWvDhw "https://mp.weixin.qq.com/s/22gbSI1hq6KQV35UcWvDhw")