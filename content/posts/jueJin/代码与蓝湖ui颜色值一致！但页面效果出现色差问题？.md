---
author: "尖椒土豆sss"
title: "代码与蓝湖ui颜色值一致！但页面效果出现色差问题？"
date: 2024-09-05
description: "前言最近在开发新需求，按照蓝湖的ui图进行开发，但是在开发完部署后发现做出来的页面部分元素的颜色和设计图有出入，有色差！经过一步步的排查最终破案，解决。仅以此篇记录自己踩坑、学习的过程，也希望可以帮"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读4分钟"
weight: 927
---
前言
--

最近在开发新需求，按照蓝湖的ui图进行开发，但是在开发完部署后发现做出来的页面部分元素的颜色和设计图有出入，有色差！经过一步步的排查最终破案，解决。仅以此篇记录自己踩坑、学习的过程，也希望可以帮助到其他同学。

发现问题
----

事情是这样的，那是一个愉快的周五的下午，和往常一样我开心的提交了代码后进行打包发版，然后通知负责人查看我的工作成果。

但是，过了不久后，负责人找到了我，说我做出来的效果和ui有点出入，有的颜色有点不一样。我一脸懵逼，心想怎么可能呢，我是根据ui图来的，ui的颜色可是手把手从蓝湖复制到代码中的啊。

随后他就把页面和ui的对比效果图发了出来:

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2a11b3254a354dfbafa2656193f1f1c8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=N0fRFZQOb9TNmg8Q2n5DazJOulo%3D)

上图中左侧是蓝湖ui图，右侧是页面效果图。我定睛一看，哇趣！！！好像是有点不一样啊。 感觉右侧的比左侧的更亮一些。于是我赶紧本地查看我的页面和ui，果然也是同样问题！ 开发时真的没注意，没发现这个问题！！！

排查问题
----

于是，我迅速开始进行问题排查，看看到底是什么问题，是值写错了？还是那里的问题。

### ui、页面、代码对比

下图中：最上面部分是蓝湖ui图、下面左侧是我的页面、右侧是我的页面代码样式

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/973a6d92b4554cd19382f73945de47d3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=akmDoIn9CUIictZ%2BdSGkbL0PQf0%3D)

仔细检查后发现颜色的值没错啊，我的代码中背景颜色、边框颜色的值都和ui的颜色值是一致的！ 但这是什么问题呢？？？ 值都一样为什么渲染到页面会出现色差？

起初，我想到的是屏幕的问题，因为不同分辨率下展示出来的页面效果是会有差距的。但是经过查看发现同事的win10笔记本、我的mac笔记本、外接显示器上都存在颜色有色差这个问题！！！

### ui、页面、源文件对比

通过对比ui、页面、颜色值，不同设备展示效果可以初步确认：和显示器关系不大。当我在百思不解的时候，我突然想到了ui设计师！ui提供的ui图是蓝湖上切出来的，那么她的源文件颜色是什么呢？

于是我火急火燎的联系到了公司ui小姐姐，让她发我源文件该元素的颜色值，结果值确实是一样的，但是！！！ 源文件展示出来的效果好像和蓝湖上的不太一样！

然后我进行了对比(左侧蓝湖、右上页面、右下源文件)：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0acdf88743be4cf295599320b6f2834d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=n2JU0wd6GofQfCK1JvGbvYXk7jI%3D)

可以看到源文件和我页面的效果基本一致！到这一步基本可以确定我的代码是没问题的！

尝试解决
----

首先去网上找了半天没有找到想要的答案，于是我灵光一现，想到了蓝湖客服！然后就询问了客服，为什么上传后的ui图内容和源文件有色差？

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6223853f43fe4858bbfb26c05064a4d6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=z7Ug40EYB3%2F7duD817qlsqIlCKU%3D)

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5aa4c322f98f4b81b08f6e8d84ce4d02~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=WxKSe6KnxSb61t4TWXThaGBqWrc%3D)

沟通了很久，期间我又和ui小姐姐在询问她的软件版本、电脑版本、源文件效果、设置等内容就不贴了，最终得到如下解答：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4dceb03035bc43b2b28874758adeef1b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=UAhGqDoJTTV8JMnXyhtT1aY%2BRwk%3D)

解决方式
----

下载最新版蓝湖插件，由于我们的ui小姐姐用的 `sketch` 切图工具，然后操作如下：

1.下载安装最新版蓝湖插件： [lanhuapp.com/mac?formHea…](https://link.juejin.cn?target=https%3A%2F%2Flanhuapp.com%2Fmac%3FformHeader%3Dmac "https://lanhuapp.com/mac?formHeader=mac")

2.安装新版插件后--插件重置

3.后台程序退出 `sketch`，重新启动再次尝试打开蓝湖插件.

4.插件设置**打开高清导出上传**（重要！）

5.重新切图上传蓝湖

最终效果
----

左侧ui源文件、右侧蓝湖ui： ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ce080f8f3fc94e7b94b3ab95151f5caf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=EzI7ZoLuLREy1RUx6lNG2AOcMko%3D)

页面效果：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/176d76bbe27f4566a2b78f1d11a21628~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCW5qSS5Zyf6LGGc3Nz:q75.awebp?rk3s=f64ab15b&x-expires=1727919762&x-signature=dzMzNq5EB3Pfcw0hIo3oZsHhD%2Fc%3D)

可以看到我的页面元素的`border`好像比ui粗一些，感觉设置0.5px就可以了，字体效果的话是因为我还没来得及下载ui对应的字体文件。

但是走到这一步发现整体效果已经和ui图到达了95%以上相似了，不至于和开始有那么明显的色差。

总结
--

至此，问题已经基本是解决。遇到问题不能怕，多想一想，然后有思路后就一步一步排查、尝试解决问题。当解决完问题后会发现心情舒畅！整个人都好起来了，也会增加自信心！