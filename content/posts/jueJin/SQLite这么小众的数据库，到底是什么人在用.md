---
author: "古时的风筝"
title: "SQLite这么小众的数据库，到底是什么人在用"
date: 2024-07-29
description: "前几天在一个群里看到一位同学说：“SQLite这么小众的数据库，到底是什么人在用啊？”首先要说的是SQLite可不是小众的数据库，相反，SQLite是世界上装机量最多的数据库，远超MySQL"
tags: ["前端","后端","数据库"]
ShowReadingTime: "阅读7分钟"
weight: 427
---
> 🍄 **大家好，我是风筝**
> 
> 🌍 个人博客：【[古时的风筝](https://link.juejin.cn?target=https%3A%2F%2Fwww.moonkite.cn "https://www.moonkite.cn")】。
> 
> 本文目的为个人学习记录及知识分享。如果有什么不正确、不严谨的地方请及时指正，不胜感激。
> 
> 每一个赞都是我前进的动力。
> 
> 公众号：「古时的风筝」

前几天在一个群里看到一位同学说：“SQLite这么小众的数据库，到底是什么人在用啊？”

首先要说的是 SQLite 可不是小众的数据库，相反，SQLite 是世界上装机量最多的数据库，远超 MySQL，只不过比较低调而已。低调到我想在官网上找一个好看的用来当插图的图片都找不到，只能截一张官网首页来撑一撑，看起来十分朴素。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d41d667f1d844da0949e7521686b539b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-k5pe255qE6aOO562d:q75.awebp?rk3s=f64ab15b&x-expires=1728243121&x-signature=yZH6K5JsYwQTT8txP6RK9fCW4cc%3D) 我最早听说 SQLite 是刚毕业工作的时候，我们部门做微软内容管理产品的二次开发，其中有一个客户端即时沟通工具叫做 Lync，搭配上 LDAP 的组织架构，其功能就和现在的企业微信差不多。

Lync 支持二次扩展，结合我们的产品需要在其中做一些功能拓展，负责这项工作的是一位厉害的 C++ 大佬。有一次我和他聊起来，我说客户端要记住用户自己的配置和数据，是不是要在目录下放一个配置文件啊，那数据量大了会不会很慢。他说，用配置文件也行，但是咱这个不用配置文件，用 SQLite。

也是孤陋寡闻，那是我第一次听说 SQLite，才知道这也是个数据库，只不过多用在客户端而不是服务器上。

### SQLite

SQLite是一个轻量级的嵌入式关系型数据库管理系统。它由D. Richard Hipp在2000年开发，它实现了一个小型、快速、独立、高可靠性、功能齐全的SQL数据库引擎。

SQLite 用C语言开发，最开始的设计目标是嵌入式系统，它可以在不需要单独的服务器进程的情况下，直接嵌入到应用程序中。后来正好赶上智能手机等智能设备普及，正好契合 SQLite 的使用场景，于是大量的智能设备都在使用 SQLite 。这么说吧，你用的手机上，一定有 SQLite 存在。

像 MySQL 一样，SQLite 也是开源且免费的，据官方统计，目前正在使用的 SQLite 数据库超过 1 万亿个。

SQLite 也可以通过配置像MySQL 那样装在服务器上，通过网络连接访问，但是，完全没有必要。

SQLite 支持C、C++、Java、Python、Swift等大多数语言直接使用。

为什么说你的手机上肯定有 SQLite 呢？因为 SQLite 会随着应用程序代码一起打包，所以这样说来，你的手机上还不止一个 SQLite ，可能有很多，例如微信有一个、美团有一个、网易云音乐等等 APP ，都可能包含自己的 SQLite。

### 使用场景有哪些

#### 移动应用

前面也一直在说手机上的SQLite。Android就默认集成了SQLite作为应用数据存储的标准解决方案。

Apple 的 IOS 其实提供了自己的数据存储方案，比如 CoreData，但是很多开发者都觉得官方提供的方案实在太难用，所以，有很多应用开发者还是选择 SQLite 作为本地存储方案使用。

#### 嵌入式系统

SQLite 本来就是为了嵌入式系统设计的，所以它的特点就是轻量和高性能吗，这也使得他在嵌入式系统中被广泛使用。包括嵌入式Linux设备、物联网（IoT）设备、路由器，以及汽车电子系统等等。 ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9a45fbd9556642b6ae314a3f0786cd8c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-k5pe255qE6aOO562d:q75.awebp?rk3s=f64ab15b&x-expires=1728243121&x-signature=nPs9W8XdQOY%2FxnSuSzNhNHyaKHY%3D)

#### 桌面应用

许多桌面应用程序使用SQLite作为其内部数据库，我第一次听说 SQLite 就是那位同事大佬为了拓展桌面客户端。

尤其是一些纯的本地应用，不需要联网的，所有的配置和数据都会存在本地，这种场景正好适合SQLite 这种轻量级数据库。

#### 数据分析和处理

SQLite还可以用于处理和分析小规模的数据集。例如，数据科学家可以使用SQLite来存储和操作中小型数据集，以进行数据清理、转换和分析。

#### 网站加速

最近看了一篇文章，介绍 Notion 技术团队如何使用WASM SQLite在浏览器中加速Notion 的性能。

WebAssembly (WASM) 是一种低级字节码格式，能够在现代浏览器中高效运行。它被设计为一个可移植的目标，可以被多种编程语言编译成它。 它有接近原生的性能，同时可以安全地运行在浏览器的沙箱环境中。

所以为了追求更好的性能，有些像 Notion 这样的网站直接将 SQLite 编译到 WebAssembly，相当于在网站中加入了 SQLite。

这样一来，更多的数据存到本地 SQLite ，减少不必要的网络交互，对于网站的速度和性能会有很大提升。

**还可以看看风筝往期文章**

[我做了一款网页 AI 效率插件](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449473693%26idx%3D1%26sn%3D17d9c2e8e6eee0de9258fdaad33fd806%26chksm%3D8c434efabb34c7ec6a92092b7196d3286a58498494932bfc1a0c6209686d5b4283fed6d8871e%26token%3D1503852429%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449473693&idx=1&sn=17d9c2e8e6eee0de9258fdaad33fd806&chksm=8c434efabb34c7ec6a92092b7196d3286a58498494932bfc1a0c6209686d5b4283fed6d8871e&token=1503852429&lang=zh_CN#rd")

[有人问我数据库ER图为什么这么好看？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FeyRhSQQ1923Akpbm7geDQw "https://mp.weixin.qq.com/s/eyRhSQQ1923Akpbm7geDQw")

[「差生文具多系列」最好看的编程字体](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449472490%26idx%3D1%26sn%3Dda10b436d1f8123149316dac76a618aa%26chksm%3D8fbcb58db8cb3c9ba481b7d095966abb86ff7d1a45a771aad191991db65cd6e384a557a40ec4%26token%3D1977984185%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449472490&idx=1&sn=da10b436d1f8123149316dac76a618aa&chksm=8fbcb58db8cb3c9ba481b7d095966abb86ff7d1a45a771aad191991db65cd6e384a557a40ec4&token=1977984185&lang=zh_CN#rd")

[我患上了空指针后遗症](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449473008%26idx%3D1%26sn%3Dc8f8d9c9675571ea1a42c13b1af9b6e7%26chksm%3D8fbcb397b8cb3a81f3c6c55eb398c0599128f18b9bbdae87965cd40ef519dad3394649426d1e%26token%3D1044263965%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449473008&idx=1&sn=c8f8d9c9675571ea1a42c13b1af9b6e7&chksm=8fbcb397b8cb3a81f3c6c55eb398c0599128f18b9bbdae87965cd40ef519dad3394649426d1e&token=1044263965&lang=zh_CN#rd")

[一千个微服务之死](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449473057%26idx%3D1%26sn%3D2170397d6bab5ad0a6d6427f77584df2%26chksm%3D8fbcb046b8cb3950d1784fe29bc7776cb0c71868acba36a47d60b41bc8a60959303082b0ee2a%26token%3D1977984185%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449473057&idx=1&sn=2170397d6bab5ad0a6d6427f77584df2&chksm=8fbcb046b8cb3950d1784fe29bc7776cb0c71868acba36a47d60b41bc8a60959303082b0ee2a&token=1977984185&lang=zh_CN#rd")

[搭建静态网站竟然有这么多方案，而且还如此简单](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449472966%26idx%3D1%26sn%3Da272a9df52ae18cc9a6163732b37c5d8%26chksm%3D8fbcb3a1b8cb3ab7857a88adc8a2e6d28bb6f2316df501f5f8e6fc487794f3b34f77829b4b94%26token%3D1977984185%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449472966&idx=1&sn=a272a9df52ae18cc9a6163732b37c5d8&chksm=8fbcb3a1b8cb3ab7857a88adc8a2e6d28bb6f2316df501f5f8e6fc487794f3b34f77829b4b94&token=1977984185&lang=zh_CN#rd")

[被人说 Lambda 代码像屎山，那是没用下面这三个方法](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxMjA0MDk2OA%3D%3D%26mid%3D2449472616%26idx%3D1%26sn%3Da41a420933f9af7f88af0759eb75f815%26chksm%3D8fbcb20fb8cb3b1969433e2468523234552562e504f3a12c8c1a2a012cff7fd1422e6dd48723%26token%3D1977984185%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzAxMjA0MDk2OA==&mid=2449472616&idx=1&sn=a41a420933f9af7f88af0759eb75f815&chksm=8fbcb20fb8cb3b1969433e2468523234552562e504f3a12c8c1a2a012cff7fd1422e6dd48723&token=1977984185&lang=zh_CN#rd")