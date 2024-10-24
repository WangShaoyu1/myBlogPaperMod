---
author: "MacroZheng"
title: "直观易用！推荐两款JSON可视化工具，配合Swagger使用真香！"
date: 2022-05-24
description: "经常使用Swagger的小伙伴应该有所体会，Swagger对于JSON的支持真的很不友好！最近发现了两款颜值很不错的JSON可视化工具，可以优雅地展示JSON数据从而提高开发效率，推荐给大家！"
tags: ["后端","Java","JSON中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:56,comments:10,collects:73,views:8300,"
---
> 经常使用Swagger的小伙伴应该有所体会，Swagger对于JSON的支持真的很不友好！最近发现了两款颜值很不错的JSON可视化工具，可以优雅地展示JSON数据从而提高开发效率，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊Swagger
---------

> 我们先来聊聊Swagger对JSON支持有哪些不友好的地方，我们为什么需要JSON可视化工具！

*   当我们使用Swagger提交POST请求，输入JSON请求参数时，它既不支持JSON格式校验，也不支持格式化，用起来很不方便；

![](/images/jueJin/394ff871786841d.png)

*   当我们使用Swagger获取到的JSON数据比较长时，Swagger不支持折叠数据，有时候我们只能把数据复制到其他工具里去查看，比如找个在线JSON解析工具。

![](/images/jueJin/58e985aebb4440a.png)

*   针对上面两个Swagger的使用痛点，使用`JsonHero`和`JsonVisio`都可以解决，而且它们都是比较有特色的JSON可视化工具。

JsonHero
--------

### 简介

JsonHero是一款开源的JSON可视化工具，目前在Github已有`2.9K+Star`，通过JsonHero可以非常方便地查看JSON数据，它支持列视图、树视图和编辑视图，总有一款适合你！

![](/images/jueJin/68995b6005b1459.png)

### 安装

*   JsonHero是个前端项目，下载安装还是非常简单的，首先下载它的安装包，下载地址：[github.com/jsonhero-io…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjsonhero-io%2Fjsonhero-web "https://github.com/jsonhero-io/jsonhero-web")

![](/images/jueJin/dc1a94f804084e6.png)

*   下载完成后解压到指定目录，在根目录下创建`.env`文件，文件内容如下；

```ini
SESSION_SECRET=abc123
```

*   然后使用如下命令安装依赖并启动，使用前需先安装`node.js`环境；

```bash
npm install
npm start
```

*   启动成功后控制台将显示如下信息；

![](/images/jueJin/595f055fcae6414.png)

*   接下来就可以使用JsonHero来可视化JSON数据了，访问地址：[http://localhost:8787](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8787 "http://localhost:8787")

![](/images/jueJin/fcbf479989b0467.png)

### 使用

*   JsonHero的使用非常简单，直接把JSON数据或者获取JSON的URL复制到输入框，然后点击`Go`按钮即可；

![](/images/jueJin/3dcd74ec9a764c3.png)

*   我们可以把Swagger中获取到的长JSON数据复制过来，通过`列视图`我们可以层层深入地查看JSON数据；

![](/images/jueJin/cb0a4d31adb6416.png)

*   当我们选中某个JSON对象时，右侧会直接显示该JSON对象的数据；

![](/images/jueJin/caa87c0d619b446.png)

*   通过`JSON视图`我们可以查看格式化好的JSON数据，同样选中某个JSON对象时，右侧会直接显示该JSON对象的数据；

![](/images/jueJin/3b0079938745476.png)

*   通过`树视图`可以对JSON数据进行折叠，可以更加方便地查看数据；

![](/images/jueJin/97e41a29d1ad485.png)

*   我们还可以通过搜索功能，对JSON数据进行全局搜索；

![](/images/jueJin/b76606485cc14a7.png)

*   JsonHero还支持对不同格式的数据进行预览，比如图片、时间、日期、网址等数据。

![](/images/jueJin/5f4d7f8cf23d404.png)

JsonVisio
---------

### 简介

JsonVisio是一款简洁易用的JSON可视化工具，目前在Github已有`4.1K+Star`，可以支持JSON格式化、编辑和校验，并且能根据JSON生成树状图。

![](/images/jueJin/5f9dd193b8b7440.png)

### 安装

*   首先我们需要下载JsonVisio的安装包，注意下载`1.6.0`版本，下载地址：[github.com/AykutSarac/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAykutSarac%2Fjsonvisio.com%2Freleases "https://github.com/AykutSarac/jsonvisio.com/releases")

![](/images/jueJin/78f2ba7a45d74bc.png)

*   下载成功后解压到指定目录，然后使用`npm`命令进行安装和启动；

```bash
npm install
npm run dev
```

*   启动成功后控制台将输出如下信息；

![](/images/jueJin/f4024a76346a4c8.png)

*   接下来就可以访问JsonVisio的页面了，点击`Start Generating`开始使用JSON编辑器，访问地址：[http://localhost:3000](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000 "http://localhost:3000")

![](/images/jueJin/91bbfdb3a1c046b.png)

### 使用

*   把我们需要在Swagger中编辑的请求参数给拷贝过来，JsonVisio可以支持编辑、格式化、清空和保存等操作；

![](/images/jueJin/ee442c4777d14de.png)

*   当我们的JSON格式出错时，会给出提示；

![](/images/jueJin/68a35795d2854b6.png)

*   还可以支持根据JSON格式生成树状图。

![](/images/jueJin/16347e76294e436.png)

总结
--

通过使用上面两种JSON可视化工具，就算只使用Swagger来调试接口也不愁了！细心的小伙伴应该可以发现，JsonHero只支持查看JSON，并不支持编辑，所以编辑JSON还得使用JsonVisio。不过项目作者在Issues里面回复到，以后版本会进行支持。

项目地址
----

*   JsonHero：[github.com/jsonhero-io…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjsonhero-io%2Fjsonhero-web "https://github.com/jsonhero-io/jsonhero-web")
*   JsonVisio：[github.com/AykutSarac/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAykutSarac%2Fjsonvisio.com "https://github.com/AykutSarac/jsonvisio.com")