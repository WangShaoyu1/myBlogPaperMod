---
author: "Java3y"
title: "我是如何将博客转成PDF的"
date: 2018-12-12
description: "之前有读者问过我：“3y你的博客有没有电子版的呀？我想要份电子版的”。我说：“没有啊，我没有弄过电子版的，我这边有个文章导航页面，你可以去文章导航去找来看呀”然后就没有然后了。 最近也有个读者提过这个问题，然后这两天也没什么事做，所以打算折腾折腾，看看怎么把博客转成PDF。…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:18,comments:3,collects:16,views:2061,"
---
前言
==

> 只有光头才能变强

之前有读者问过我：“3y你的博客有没有电子版的呀？我想要份电子版的”。我说：“没有啊，我没有弄过电子版的，我这边有个文章导航页面，你可以去文章导航去找来看呀”..然后就没有然后了。

最近也有个读者提过这个问题，然后这两天也没什么事做，所以打算折腾折腾，看看怎么把博客转成PDF。

一、准备工作
======

要将博客转成PDF，我首先想到的是能不能将markdown文件转成PDF(因为平时我就是用markdown来写博客的)。

*   想了一下，**原生**markdown显示的话，代码是没有高亮的，格式也不会太好看。
*   所以就放弃了这个想法。

于是就去想一下，可不可以将HTML转成PDF呢。就去GitHub搜了有没有相关的轮子，也搜到了一些关于Python的爬虫啥的，感觉还是蛮复杂的。

后来，终于搜到了个不错的：

*   [github.com/petterobam/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpetterobam%2Fmy-html2file "https://github.com/petterobam/my-html2file")

> \*\*介绍：\*\*收集一系列html转文档的开源插件，做成html页面转文件的微服务集成Web应用，目前包含 html转PDF、html转图片、html转markdown等等。

功能：

*   网页转PDF（参用wkhtml2pdf插件）
*   网页转图片（参用wkhtml2pdf插件）
*   网页转Markdown（参用jHTML2Md）
*   网页转WORD（参用Apache POI）

这里我主要用到的网页转PDF这么一个功能，对应的插件是wkhtml2pdf。

1.1踩坑
-----

发现了一个不错的轮子了，感觉可行，于是就去下载来跑一下看看怎么样。启动的时候倒没有出错，但在调接口的时候，老是抛出异常。

*   于是就开始查一下路径，url有没有问题啦，查来查去发现都没问题啊。

后来才发现我的`wkhtml2pdf.exe`文件打不开，说我缺少几个dll文件。于是，我首先想到的是去wkhtml2pdf官网看看有没有相关的问题，想重新下载一个，但官网都进不去...(不是墙的问题)

*   [wkhtmltopdf.org/](https://link.juejin.cn?target=https%3A%2F%2Fwkhtmltopdf.org%2F "https://wkhtmltopdf.org/")
*   (ps：一个周末过去了，发现又能打开了。)

好吧，于是就去找‘dll文件缺失怎么办’。后面发现，安装一下`Visual C++ Redistributable for Visual Studio 2015`就好了(没有网上说得那么复杂)

*   [www.microsoft.com/zh-cn/downl…](https://link.juejin.cn?target=https%3A%2F%2Fwww.microsoft.com%2Fzh-cn%2Fdownload%2Fconfirmation.aspx%3Fid%3D48145 "https://www.microsoft.com/zh-cn/download/confirmation.aspx?id=48145")

完了之后，发现可以将一个HTML转成PDF了，**效果还不错**：

*   有目录
*   可复制粘贴
*   可跳转到链接
*   清晰度好评

![HTML转成PDF](/images/jueJin/167a251422e1076.png)

缺点：

*   页面加载速度慢的HTML，图片还没加载出来就已经生成PDF了
    *   所以我选用了博客园(速度快)
*   在PDF的末尾有好几页不相关的(评论，广告啥的)

本来想着能不能只截取HTML博文的部分啊(评论，广告和其他不相关的不截取)。于是就去搜了一下，感觉是挺麻烦的，自己做了几次试验都没弄出来，最后放弃了。

后来又想了一下，我不是有一个没有广告的博客平台吗，刚好可以拿来用了。但是，我自己写完的markdown是没有全部保存在硬盘上的，后来发现简书可以**下载已发布文章的所有markdown**。

![简书可以下载所有的文章](/images/jueJin/167a25141c3a706.png)

下载下来的文章，我想全部导入到之前那个无广告的博客平台上。但发现**导出来的markdown没有高亮语法**..

![下载下来的markdown没有高亮语法](/images/jueJin/167a25141bbcd8c.png)

`// 没有语法高亮咋看啊，所以到这里我就放弃了，将就用一下博客园生成的PDF吧`

1.2爬虫学习
-------

上面GitHub提供的接口是一个URL生成一个PDF文件，我是不可能一个一个将链接和标题放上去生成的(因为博客园上发的也将近200篇了)。

而我是**一点也不会爬虫**的，于是也去搜了一下Java的爬虫轮子，发现一个很出名(WebMagic)

*   [github.com/code4craft/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcode4craft%2Fwebmagic "https://github.com/code4craft/webmagic")

于是就跟着文档学习，也遇到了坑...文档给出的版本是`0.7.3`，我使用的JDK版本是`8`，用它的例子跑的时候抛出了`SSLException`异常(然而网上的`0.6.x`版本是没有问题的)

折腾完折腾去，也找到了`0.7.3`版本在JDK8上如何解决`SSLException`异常的办法了：

*   [www.cnblogs.com/vcmq/p/9484…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2Fvcmq%2Fp%2F9484418.html "http://www.cnblogs.com/vcmq/p/9484418.html")

> 修改HttpClientDownloader和HttpClientGenerator这两个类的部分代码就好了。

但是，我还是**死活**写不出能用的代码出来(真的菜!)..后来去问了一下同事(公众号：Rude3Knife)咋搞，他用Python几分钟就写好了。

```

def get_blog_yuan(blog_name, header):
for i in range(1, 6):
url = 'https://www.cnblogs.com/' + blog_name + '/default.html?page=' + str(i)
r = requests.get(url, headers=header, timeout=6)
selector = etree.HTML(r.text)
names = selector.xpath("//*[@class='postTitle']/a/text()")
links = selector.xpath("//*[@class='postTitle']/a/@href")
for num in range(len(names)):
print(names[num], links[num])
time.sleep(5)

```

我也不纠结了..直接用他爬下来的数据吧(:

WebMagic中文文档：

*   [webmagic.io/docs/zh/](https://link.juejin.cn?target=http%3A%2F%2Fwebmagic.io%2Fdocs%2Fzh%2F "http://webmagic.io/docs/zh/")

最后
==

最后我就生成了好多PDF文件了：

![PDF文件](/images/jueJin/167a251444d4cac.png)

`// 这篇文章简单记录下我这个过程吧，还有很多要改善的[//假装TODO]。如果你遇到过这种需求，有更好的办法的话不妨在评论区下告诉我~~`

WebMagic我的Demo还没写好！！！如果有兴趣或者用过WebMagic的同学，**有空的话**不妨也去爬爬我的博客园的文章，给我一份代码(hhhhh)

> 分析可能的原因：博客园反爬虫or爬取规则没写好

部门的前辈建议我去了解一下机器学习，我也想扩展一下眼界，所以这阵子会去学一下**简单的机器学习知识**。(当然啦，我后面也会补笔记的)

> 乐于分享和输出**干货**的Java技术公众号：Java3y。关注即可领取海量的视频资源！

![帅的人都关注了](/images/jueJin/167554b3537ce51.png)

文章的**目录导航**：

*   [github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")