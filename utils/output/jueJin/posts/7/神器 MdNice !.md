---
author: "MacroZheng"
title: "神器 MdNice !"
date: 2021-04-07
description: "作为一名程序员，相信大家都关注了很多技术大佬的公众号，其中不乏文章样式看起来特别舒服的。之前也有读者朋友问我，我的公众号文章是用什么工具排版的，看起来很舒服！今天给大家推荐一下我经常使用的排版工具 MdNice，支持多达20种样式，总有一款适合你！ 作为程序员，我们经常会写一些…"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:33,comments:0,collects:59,views:3638,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

作为一名程序员，相信大家都关注了很多技术大佬的公众号，其中不乏文章样式看起来特别舒服的。之前也有读者朋友问我，我的公众号文章是用什么工具排版的，看起来很舒服！今天给大家推荐一下我经常使用的排版工具 MdNice，支持多达20种样式，总有一款适合你！

使用Markdown写文章
-------------

作为程序员，我们经常会写一些开发文档，Markdown作为一种轻量级标记语言，非常容易学习和使用。看看Github上面的开源项目文档，很多都是用它来写的，就知道它有多流行了！

所以我们选择使用它来写文章，准没错！使用Markdown写文章需要一个编辑器，这里我个人推荐使用下面两个。

使用IDEA来写，IDEA不愧为神器，自带Markdown支持，用来写文章也是很不错的。

![](/images/jueJin/57848dde767d434.png)

使用Typora来写，使用Typora来写最大的好处是所见即所得，Typora的用法具体可以参考[《神器 Typora ！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FUrW6pV8IeljShpGV-zK-Dw "https://mp.weixin.qq.com/s/UrW6pV8IeljShpGV-zK-Dw")。

![](/images/jueJin/5d857ecac0744a7.png)

使用Markdown写的文章，支持的样式比较单一，所以我们需要一个排版工具，将Markdown转化为HTML，并添加好看的样式，如果发到公众号上去的话，还需要支持微信的样式，此时就要使用到MdNice了。

MdNice简介
--------

Markdown Nice（简称MdNice）是一款样式丰富的 Markdown 编辑器，同时支持微信公众号、知乎和稀土掘金等平台的文章排版（能用富文本编辑器写文章的平台基本都支持）。

MdNice支持多达20种样式，总有一款适合你，接下来我们来看看有哪些样式！

![](/images/jueJin/4e00b2033ab44ef.png)

![](/images/jueJin/a9eefc89f04b47e.png)

看完这些样式是不是有种似曾相识的感觉，很多技术大佬的文章都是用MdNice排版的！

本地部署
----

> 作为一名程序员，我们不仅要会使用工具，自己动手部署一下也是很有必要的！接下来我们本地部署下，来体验一下吧！

*   首先我们需要把项目下载到本地并导入到IDEA，项目地址：[github.com/mdnice/mark…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmdnice%2Fmarkdown-nice "https://github.com/mdnice/markdown-nice")

![](/images/jueJin/baaa794d6be64e3.png)

*   接下来我们需要使用yarn命令安装项目所有依赖；

```bash
yarn
```

*   然后再使用如下命令启动项目；

```bash
yarn start
```

*   项目启动后即可访问，访问地址：[http://localhost:3000](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000 "http://localhost:3000")

![](/images/jueJin/b9820b88a226458.png)

*   此时我们会发现没有主题可以选择，需要在项目的`src\json`目录下添加`localThemeList.json`用于定义主题，文件地址（数据太长，这里只提供格式）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fjson%2FlocalThemeList.json "https://github.com/macrozheng/mall-learning/blob/master/document/json/localThemeList.json")

```json
    [
        {
        "themeId": "1",
        "itemId": null,
        "name": "橙心",
        "cover": "https://files.mdnice.com/pic/9322d897-85d5-4be1-9c9d-c392d4d39bff.png",
        "css": "很长的css样式代码",
        "article": "",
        "html": null,
        "exampleHtml": null,
        "authorName": "zhning12",
        "authorEmail": null,
        "description": "橙心的作者很懒，暂时没有描述",
        "sort": null,
        "checked": true,
        "userThemeId": 21231,
        "userThemeType": 0,
        "fixThemeId": null,
        "price": null,
        "tmpPrice": null,
        "isPublic": true,
        "createTime": "2020-04-04T09:57:55.000+0000",
        "updateTime": "2020-11-21T23:11:44.000+0000"
    }
]
```

*   然后修改项目的`src\component\MenuLeft\Theme.js`文件，主要是导入`localThemeList.json`和将获取远程主题改为从本地获取；

![](/images/jueJin/75dd0d13aa9d4ce.png)

*   修改完主题之后，我们可以发现已经有20种主题可供选择了：

![](/images/jueJin/8b68b11e8e5f413.png)

*   最后通过右上角的复制按钮，即可将Markdown转化为对应主题的HTML了，然后复制到公众号的编辑器中即可，是不是很方便！

![](/images/jueJin/29400fedc0e846b.png)

在线使用
----

当然，如果你觉得本地搭建有点麻烦，也可以直接在线使用，在线使用地址：[www.mdnice.com/](https://link.juejin.cn?target=https%3A%2F%2Fwww.mdnice.com%2F "https://www.mdnice.com/")

总结
--

刚开始做公众号的时候，一直在寻找一款合适的排版工具，最后找到了MdNice。样式丰富，使用方便，想要使用Markdown写文章的朋友可以尝试下！

项目地址
----

[github.com/mdnice/mark…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmdnice%2Fmarkdown-nice "https://github.com/mdnice/markdown-nice")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！