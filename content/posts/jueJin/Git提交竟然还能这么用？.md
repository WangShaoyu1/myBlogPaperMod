---
author: "程序员鱼皮"
title: "Git提交竟然还能这么用？"
date: 2023-11-20
description: "大家好，我是鱼皮。Git是主流的代码版本控制系统，是团队协作开发中必不可少的工具。之前已经给大家分享过Git/GitHub的学习指南，感兴趣的同学可以先看视频了解：https://www."
tags: ["Git","面试","程序员"]
ShowReadingTime: "阅读6分钟"
weight: 535
---
大家好，我是鱼皮。Git 是主流的代码版本控制系统，是团队协作开发中必不可少的工具。

之前已经给大家分享过 Git / GitHub 的学习指南，感兴趣的同学可以先看视频了解：[www.bilibili.com/video/BV1KZ…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1KZ4y1e7cG "https://www.bilibili.com/video/BV1KZ4y1e7cG")。

这篇文章，主要是给大家分享 Git 的核心功能 `提交`（Commit）的作用，帮助大家更好地利用 Git 这一工具来提高自己的开发工作效率。

什么是 Git 提交？
-----------

Git 提交是指将你的代码保存到 Git 本地存储库，就像用 Word 写长篇论文时进行保存文件一样。每次 Git 提交时都会创建一个唯一的版本，除了记录本次新增或发生修改的代码外，还可以包含提交信息，来概括自己这次提交的改动内容。

如下图，就是一次 Git 提交：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85915c883851484492f45b455189fcac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2104&h=610&s=137221&e=png&b=3c3f41)

Git 提交的作用
---------

Git 提交有很多作用，我将它分为 **基础用法** 和 **其他妙用** 。

### 基本作用

#### 历史记录

Git 提交最基本的作用就是维护项目的历史记录。每次提交都会记录代码库的状态，包括文件的添加、修改和删除；还包括一些提交信息，比如提交时间、描述等。这使得我们可以通过查看所有的历史提交来追溯项目的开发进度和历程，了解每个提交中都发生了什么变化。

比如查看我们编程导航文档网站项目的提交记录，能看到我是怎么一步一步构建出这个文档网站的：

> 开源地址：[github.com/liyupi/code…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fliyupi%2Fcode-xingqiu "https://github.com/liyupi/code-xingqiu")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5490af78726643a29e8c5a73c209adbd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2098&h=508&s=195966&e=png&b=3f4446)

在企业开发中，如果一个人写了 Bug，还死不承认，那么就可以搬出 Git 提交记录，每一行代码是谁提交的都能很快地查出来，谨防甩锅！

#### 版本控制

另一个 Git 提交的基本作用是版本控制。每个提交都代表了代码库的一个版本，这意味着开发者可以随时切换代码版本进行开发，恢复旧版本的代码、或者撤销某次提交的代码改动。

推荐新手使用可视化工具而不是 Git 命令进行版本的切换和撤销提交，在不了解 Git 工作机制的情况下使用命令操作很容易出现问题。

如下图，在 JetBrains 系列开发工具中，右键某个提交，就可以切换版本或撤销提交了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b05dcf0fc7d246e299ed8facaa374d42~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1482&h=868&s=181153&e=png&b=3d4042)

#### 代码对比

你可以轻松地查看两个提交之间的所有代码更改，便于快速了解哪些部分发生了变化。这对于解决代码冲突、查找错误或审查代码非常有帮助。

在 JetBrains 系列开发工具中，只需要选中 2 个提交，然后点右键，选择 `Compare Versions` 就能实现代码对比了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dddd6d6962134486999aefdbdfd56480~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1602&h=738&s=285556&e=png&b=3f4446)

改动了哪些代码一目了然：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65820271a7ce401b96970889c2fdc860~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2776&h=960&s=420174&e=png&b=2b2b2b)

一般情况下，如果我们因为某次代码改动导致项目出现了新的 Bug。通过这种方式对比本次改动的所有代码，很快就能发现 Bug 出现的原因了。

### 其他妙用

除了基本作用外，Git 提交还有一些妙用~

#### 记录信息

像上面提到的，Git 提交不仅能用于记录代码更改，我们还可以在提交信息中包含有关这次更改的重要信息。比如本次改动代码的介绍、代码更改的原因、相关的任务（需求单）或功能等。可以简单理解为给本次工作写总结和描述。

如果提交信息编写得非常清晰完善，那么项目的团队成员可以更容易地理解每个提交，甚至能做到 “提交即文档”，提高协作和项目维护效率。

正因如此，很多团队会定制自己的提交信息规范，比如之前我在鹅厂的时候，每次提交都建议带上需求单的地址，便于了解这次提交是为了完成什么需求。

这里给大家推荐一种很常用的提交信息规范 —— 约定式提交，每次提交信息都需要遵循以下的结构：

> 《约定式提交》文档：[www.conventionalcommits.org/zh-hans/v1.…](https://link.juejin.cn?target=https%3A%2F%2Fwww.conventionalcommits.org%2Fzh-hans%2Fv1.0.0%2F "https://www.conventionalcommits.org/zh-hans/v1.0.0/")

ini

 代码解读

复制代码

`<类型>[可选 范围]: <描述> [可选 正文] [可选 脚注]`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7783d50ee81f4f03b54befc7a03c7e88~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1916&h=928&s=439449&e=png&b=ffffff)

当然，这种方式有利有弊，可能有同学会觉得 “我注释都懒得写，你还让我写提交信息？” 这取决于你们项目的规模和紧急程度等因素，反正团队内部保持一致就好。

像我在用 Git 开发个人项目时，也不是每次都写很详细的提交信息的。但是带 [编程导航](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FeNjauC-3361z-l7fy3VssA "https://mp.weixin.qq.com/s/eNjauC-3361z-l7fy3VssA") 的同学从 0 开发项目时，每场直播写的代码都会单独作为一次提交，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd1328c34cc4092add318ec997ed321~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1810&h=1284&s=346144&e=png&b=f9f9f9)

是不是很清晰呢？这样做的好处是，大家想获取某场直播对应的中间代码（而不是最终的成品代码）时，只需要点击某次提交记录就可以获取到了，很方便。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94da2732815045fba6b069626384bcd2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2434&h=816&s=200779&e=png&b=fafafa)

如果你的提交信息写得非常标准、统一结构，那么甚至还可以用程序自动读取所有的提交信息，生成日志、或者输出提交报告。

#### 自动化构建部署

大厂研发流程中，一般都是使用 CI / CD（持续集成和持续部署）平台，以流水线的形式自动构建部署项目的。

Git 提交可以和 CI / CD 平台进行集成，比如自动监视代码库中的提交，并在每次提交后自动触发构建和部署任务。一个典型的使用场景是，每次代码开发完成后，先提交代码到测试分支，然后 CI / CD 平台监测到本次提交，并立即在测试环境中构建和部署，而不需要人工操作，从而提交效率。

GitHub Actions 和 GitHub Webhooks 都可以实现上述功能，感兴趣的同学可以尝试下。

> GitHub Actions 文档教程：[docs.github.com/zh/actions/…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.github.com%2Fzh%2Factions%2Fquickstart "https://docs.github.com/zh/actions/quickstart")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41dec66d7f0e49c782dba6e25f5bd01c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1440&h=460&s=123397&e=png&b=ffffff)

#### 检验项目真假

最后这个点就比较独特了，那就是面试官可以通过查看 Git 的提交记录来判断你的项目真假、是不是自己做的。

比如我收到一些同学的简历中，有的开源项目看起来感觉很厉害，但是点进仓库看了下提交记录，发现寥寥无几，甚至有的只有 1 次！像下图这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9122435c878c432793a04117918af461~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2052&h=1050&s=175191&e=png&b=ffffff)

那么这个项目真的是他自己从 0 开始做的么？答案就显而易见了。

如果真的是你自己用心做的项目，提交记录绝对不止 1 次，而且面试官能够通过提交记录很清晰地了解到你的项目开发周期。

像我的 yuindex Web 终端项目一样，这才是比较真实、有说服力的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d02d0f3b3faf45fcbed708d27986d1f4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2248&h=1648&s=387830&e=png&b=ffffff)

其他人也能从你的提交记录中，感受到你对项目的用心程度。

讲到这里，是不是有些同学恍然大悟，知道为啥自己的项目明明开源了，但是没有收到面试邀请、或者被面试官觉得项目不真实了？

实践
--

以上就是本次分享，Git 提交的实践其实非常简单，我建议大家每次做新项目时，无论大小，都用 Git 来托管你的项目，并且每开发完一个功能或解决 Bug，都进行一次提交。等项目完成后回过头来看这些提交记录，都是自己宝贵的财富。