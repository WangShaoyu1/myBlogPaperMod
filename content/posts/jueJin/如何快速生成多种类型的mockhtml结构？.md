---
author: "我是小阵不悲催"
title: "如何快速生成多种类型的mockhtml结构？"
date: 2022-07-31
description: "携手创作，共同成长！这是我参与「掘金日新计划·8月更文挑战」的第5天，点击查看活动详情前言开开心心学技术大法~~来了来了，他真的来了~正文平时前端开发时总会用到mock数据，一般的mo"
tags: ["前端","HTML"]
ShowReadingTime: "阅读2分钟"
weight: 674
---
携手创作，共同成长！这是我参与「掘金日新计划 · 8 月更文挑战」的第5天，[点击查看活动详情](https://juejin.cn/post/7123120819437322247 "https://juejin.cn/post/7123120819437322247")

前言
==

> 大家好，我是小阵 🔥，一路奔波不停的码字业务员  
> 如果喜欢我的文章，可以关注 ➕ 点赞，与我一同成长吧~😋  
> 加我微信：**zzz886885**，邀你进群，一起学习交流，摸鱼学习两不误🌟

开开心心学技术大法~~

![开心](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73dd7fd219334fc08e5f5292f2fc70af~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

来了来了，他真的来了~

正文
==

平时前端开发时总会用到mock数据，一般的mock数据可以通过`mockjs`来生成

但是html结构怎样mock生成呢？

比如我要调试一个瀑布流的组件，我需要高度不一的图片或者文案，文案的话可以通过mockjs来生成，但是高度不一的图片怎样生成呢？

因此我们可以通过`dummyjs`来生成

安装
--

### 通过cdn

xml

 代码解读

复制代码

`<script src="https://dummyjs.com/js"></script>`

### 通过node包

javascript

 代码解读

复制代码

`const Dummy = require('dummyjs'); // es5 or node import Dummy from 'dummyjs'; // es6`

使用
--

### 在html中使用

css

 代码解读

复制代码

`<p data-dummy></p>`

比如，如果要生成包含150个单词的`p`标签

ini

 代码解读

复制代码

`<p data-dummy="150"></p>`

![image-20220731223939880](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1917cbd4ea3e41f6a8333dffa263c98e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

生成随机30-100个单词的的`p`标签

ini

 代码解读

复制代码

`<p data-dummy="30,100"></p>`

生成指定宽高的占位图片`img`

ini

 代码解读

复制代码

`<img data-dummy="400x300" />`

![image-20220731224008218](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7dd5612d97744fb923076034c5b6650~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

生成随机宽高的占位图片`img`

ini

 代码解读

复制代码

`<img data-dummy="400,100x100,400" />`

一键生成复杂的html结构

css

 代码解读

复制代码

`// 生成包含table、image、form的复杂html结构 <div data-html></div>`

![image-20220731224328138](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686a0c9470b941a188121c79fb118309~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

一键生成指定的html结构

css

 代码解读

复制代码

`<div data-html="h1,table,form,ul,p"></div>`

重复多个html结构

ini

 代码解读

复制代码

`<div data-repeat="3">Team Member</div>`

![image-20220731224436310](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b5060561504c9d9880f37ddf839f88~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 在js中使用

返回一个img的`base64字符串`

scss

 代码解读

复制代码

`Dummy.img(400,300)`

返回指定个数的word

scss

 代码解读

复制代码

`Dummy.text(4,7)`

具体示例

arduino

 代码解读

复制代码

`console.log('Dummy 400*300的img',Dummy.img(400,300)) console.log('Dummy 随机4-7个word',Dummy.text(4,7))`

![image-20220731223837937](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d98729823ab40318ef74e4e496f1c17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

快速调试
----

xml

 代码解读

复制代码

`<!DOCTYPE html> <html lang="en"> ​ <head>   <meta charset="UTF-8">   <meta http-equiv="X-UA-Compatible" content="IE=edge">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Document</title> </head> ​ <body>   <!-- <p data-dummy></p>   <p data-dummy="150"></p>   <p>哈啥都好说</p> -->   <div id="root"></div>   <!-- <div data-html></div> -->   <!-- <script src="https://dummyjs.com/js"></script> -->   <p data-dummy="150"></p>   <img data-dummy="400x300" />   <script src="https://dummy.paulcollett.com/js"></script>   <script>     console.log('Dummy 400*300的img',Dummy.img(400,300))     console.log('Dummy 随机4-7个word',Dummy.text(4,7))   </script> </body> ​ </html>`

直接粘贴验证即可

结语
==

如果文章真的有帮到你，希望可以多多点赞、收藏、关注支持一波呀！！小阵会很开心哒~

> 文章如有错误或不严谨之处，还望指出，感谢感谢！！！

![加油！](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3801e4dad8f49b0ac96fa605e66a0ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

往期好文推荐「我不推荐下，大家可能就错过了`史上最牛逼vscode插件集合`啦！！！(嘎嘎嘎~)😄」

*   [vscode最牛插件分享，只有你想不到，没有vscode办不到](https://juejin.cn/post/6844903838474829838 "https://juejin.cn/post/6844903838474829838")
    
*   [手写webpack loader是什么样的体验？](https://juejin.cn/post/7103905846337224711 "https://juejin.cn/post/7103905846337224711")
    
*   [看完就会的webapck loader编写教程](https://juejin.cn/post/7102010165074870309 "https://juejin.cn/post/7102010165074870309")
    
*   [六十行代码阐述webpack-core的思想](https://juejin.cn/post/7102822282388570143 "https://juejin.cn/post/7102822282388570143")
    
*   [因为懒，我写了个vscode插件](https://juejin.cn/post/7107250364986064910 "https://juejin.cn/post/7107250364986064910")
    
*   [为了生成目录结构方便，我写了个vscode插件](https://juejin.cn/post/7112438247166312456 "https://juejin.cn/post/7112438247166312456")
    
*   [我用30行代码实现了简易的husky](https://juejin.cn/post/7109491381176893470 "https://juejin.cn/post/7109491381176893470")
    
*   [抛弃HTML Snippets，拥抱Emmet成为html大师！](https://juejin.cn/post/7114554784740950047 "https://juejin.cn/post/7114554784740950047")