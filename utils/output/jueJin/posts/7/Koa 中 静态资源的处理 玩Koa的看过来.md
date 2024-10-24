---
author: "Gaby"
title: "Koa 中 静态资源的处理 玩Koa的看过来"
date: 2022-06-15
description: "很多技能对于已经研究会的小伙伴来说，简直就是小儿科，不值得一提的事情，但对于刚入门或者还没有入门的小伙伴来说，可能就是一头巨兽，所以问题不分大小就都写一写，给还不会或者正在查找该问题的小伙伴提点思路。"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:8,views:2456,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第16天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

为回馈掘金的小伙伴们，特地做了个文档站点，将前端知识及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")，目前，本站内容正紧锣密鼓的更新中！

### 问题

大家都知道在HTML中有三种使用CSS的方式，分别是：内联样式、内部样式、外部样式。外部样式，在head部分使用link标签引入外部写入css样式表的文件，示例如下：`<link href="index.css" rel="stylesheet">`，同时，在项目根目录下创建index.css文件，并写入样式。修改后我们刷新页面，发现页面背景色没有变成绿色, 不仅如此，我们在标签里引入一张图片。发现不仅引入的外部样式表不起作用，图片也同样无法正常显示。在刚开始使用koa 或者node开发服务端的时候总是会遇到类似的问题，可这究竟是为什么呢？

### 分析

当然，只是想当然不行地，还得动手去查看去分析，我们打开chrome浏览器的开发者模式进行调试的时候，在右侧找到 network并点击查看 该页面的有关请求，如果没有在刷新一下，我们可以看到浏览器为了渲染页面发了三次请求：

第一个请求的是'/‘, 服务器给我们返回了index.html文件； 第二个请求的是'/index.css', 但返回内容还是index.html文件； 第三个请求的是'/logo.png', 但返回内容还是index.html文件；

这是为什么呢？我们先看看当下 index.js文件中内容处理的部分：

```js
    app.use(ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('index.html');
    });
```

可以看到，无论我们请求的是什么内容，因为 我们的静态服务器 没有对 css 和 图片 类型 进行处理，返回的都是index.html文件。如何解决呢？

```js
    app.use(ctx => {
    const url = ctx.url == '/'  ?  '/index.html' : ctx.url
    const fileType = path.extname( url ).slice(1);
        if (fileType ==='html') {
        ctx.response.type = 'html';
        ctx.response.body = fs.createReadStream('index.html');
            } else if  (fileType ==='css') {
            ctx.response.type = 'css';
            ctx.response.body = fs.createReadStream('index.css');
                } else  if  (fileType ==='jpg')  {
                ctx.response.type = 'image/jpg';
                ctx.response.body = fs.createReadStream('skills.jpg');
                    } else {
                    ctx.response.body = '文件不存在';
                }
                });
```

可以看到，外部样式和图片都正常了，虽然在各种判断的加持下是可以正常运行，但是其他文件类型或图片类型的处理呢？如果我们想再添加一张png的图片，又会不正常，还得需要去更新新的判断代码。显然，在实际工作中，如果所有功能都需要自己去实现的话，效率会很低，不仅会延期，还会有很多未知的bug。对于一个成熟的产品必定存在相应的解决方案，前提是你得学，得去了解。

### 解决

对于基于koa开发的web应用，熟悉的小伙伴们可能都会嗤之以鼻，这么简单的问题还值得一提么，一般使用koa-static 就能解决了，如下:

1、安装

```shell
npm install koa-static
# or
yarn add koa-static
```

2、引入

```js
const KoaStatic = require('koa-static');
```

3、使用

```js
app.use(KoaStatic('./'));
```

重启服务，我们看到一切都正常，外部样式和图片都能正常展示，而且我们显示任何类型的图片，基本都没问题。

### 写在最后

很多技能对于已经研究会的小伙伴来说，简直了，那就是小儿科，不值得一提的事情，但对于刚入门或者还没有入门的小伙伴来说，可能就是一头巨兽，所以问题不分大小就都写一写，给还不会或者正在查找该问题的小伙伴提点思路。