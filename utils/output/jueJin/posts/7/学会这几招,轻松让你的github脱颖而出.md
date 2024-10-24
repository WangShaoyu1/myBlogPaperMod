---
author: "徐小夕"
title: "学会这几招,轻松让你的github脱颖而出"
date: 2021-08-17
description: "今天分享的内容我想每一位对开源感兴趣的朋友都或多或少的知道, 也是我在做开源项目中用到的一些强大的工具, 可以让我们的开源项目和 github 主页更加富有展现力"
tags: ["前端","GitHub","开源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:98,comments:14,collects:121,views:4598,"
---
今天分享的内容我想每一位对开源感兴趣的朋友都或多或少的知道, 也是我在做开源项目中用到的一些强大的工具, 可以让我们的开源项目和 `github` 主页更加富有展现力, 最后会分享一个我自己的 `github` 主页的 `readme.md`, 大家可以参考学习一下.

在读完本文之后大家可以收获:

*   使用 **readme-md-generator** 快速美化你的 **README.md**
*   使用 **gitHub-readme-stats** 自动生成个人统计分析报表
*   使用 **git-emoji** 让你的代码提交记录可视化

### 一. 如何让你的开源项目有个漂亮的README.md ?

逛了一圈社区之后小夕发现了 `readme-md-generator`.

> **readme-md-generator** 通过扫描我们的 `package.json` 和 `git` 配置来帮助我们生成对应的 **readme** 结构。

![](/images/jueJin/a34f9727f21f42a.png)

产生的 **README.md** 类似如下展现：

![](/images/jueJin/9e6d9677a0d847a.png)

另外, 一个优秀的 `package.json` 应该包含如下几个元数据:

```json
    {
    "name": "H5-Dooring",
    "version": "1.1.3",
    "description": "H5-Dooring是一款功能强大，开源免费的H5可视化页面配置解决方案，致力于提供一套简单方便、专业可靠、无限可能的H5落地页最佳实践。技术栈以react为主， 后台采用nodejs开发。",
    "author": "作者信息",
    "license": "开源协议",
    "homepage": "主页地址",
        "repository": {
        "type": "git",
        "url": "git仓库地址"
        },
            "bugs": {
            "url": "供他人提issue的地址"
            },
                "engines": {
                "npm": ">=5.5.0",
                "node": ">=9.3.0"
            }
        }
```

大家在做开源项目的时候也可以参考如上规范, 让自己的开源项目更健壮美观, 接下来分享一个我用这个工具生成的 **readme.md** 效果:

![](/images/jueJin/8507d62fc285421.png)

地址: [mitu-editor | 轻量且强大的图片编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fmitu-editor "https://github.com/H5-Dooring/mitu-editor")

### 二. 使用 **github-readme-stats** 自动生成个人统计分析报表

我们都知道 `github` 的个人主页默认的配置很单调, 但是我们看很多大佬的 `github` 主页, 展现非常漂亮, 比如这位大大:

![](/images/jueJin/ccbc761f7e3d466.png)

这是为什么呢? 实不相瞒, 上图大佬就是发明美化 **github个人主页** 工具的作者, 我们可以看到他的个人主页有非常漂亮的统计图, 而生成这种动态统计图的工具就是 **github-readme-stats**. 它可以在我们的 **README** 中获取动态生成的 **GitHub** 统计信息, 而我们的使用方法也很简单, 只需要在自己 **github** 主页的 **README** 中加入如下代码:

```ini
[![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=anuraghazra)](https://github.com/anuraghazra/github-readme-stats)
```

我们只需要更改 `?username=` 的值为我们自己的 **GitHub** 用户名即可.

#### 定制自己的统计数据主题

同时, 我们还可以轻松定制统计卡片的主题, 该工具默认提供的主题如下:

![](/images/jueJin/57fe5471830244d.png)

同样, 我们只需要在 **README** 中加入如下代码:

```ini
![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&show_icons=true&theme=radical)
```

这样就能轻松选择自己喜欢的主题, 更强大的是我们还可以自定义主题颜色, 大家可以在 **github** 上亲自体验一下.

#### 添加自己项目的热门语言卡片

热门语言卡片显示了我们在 **GitHub** 上的开源项目常用的编程语言, 展示如下:

![](/images/jueJin/4a6c5bcf02204b4.png)

当然也可以设置成紧凑型布局:

![](/images/jueJin/c8e7bcf66ccb417.png)

要实现这样的效果也很简单, 只需要配置如下代码:

```ruby
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=anuraghazra&layout=compact)](https://github.com/anuraghazra/github-readme-stats)

```

更多的配置大家可以在 **github** 慢慢挖掘, 该项目的 **github** 地址如下:

[github-readme-stats](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fanuraghazra%2Fgithub-readme-stats "https://github.com/anuraghazra/github-readme-stats")

这里也展示一下我通过配置之后的 **github** 个人主页的界面效果:

![](/images/jueJin/07a1855322a8496.png)

### 三. 使用 git-emoji 让你的代码提交可视化

**git-emoji** 是 **git** 提交信息的 **emoji** 指南, 我们按照它的规范提交 **log** 日志, 将会生成形象易懂的提交表情, 如下:

![](/images/jueJin/15f06204ce9b406.png)

我们看到的比较有名的开源项目提交都会有形象的 **emoji**, 也都是遵循了对应的提交规范. 下面是它的介绍网站:

![](/images/jueJin/1bc4f6a63eb0482.png)

在线地址: [gitmoji.js.org/](https://link.juejin.cn?target=https%3A%2F%2Fgitmoji.js.org%2F "https://gitmoji.js.org/")

我们可以使用它的指南来轻松优化我们开源的提交 **log**, 赶紧来试试吧~

### 最后

这里分享一个我配置好的 **github README**模版, 大家可以参考一下: [美化你的github个人主页](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FMrXujiang "https://github.com/MrXujiang/MrXujiang"), 后期我会在数据可视化和工程化上输出更多实用的开源项目和框架，如果有其他问题或需求，可以和笔者交流学习。

如果这篇文章对你有帮助，希望能给笔者 **点赞+收藏** 以此鼓励作者继续创作前端硬核文章。也可以关注作者公众号 **趣谈前端** 第一时间推送前端好文。

*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")