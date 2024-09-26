---
author: "程序员晓凡"
title: "国产语言MoonBit崛起，比Rust快9倍，比GO快35倍"
date: 2024-09-23
description: "在这个技术日新月异的时代，编程语言的更新换代似乎已经成为了家常便饭。但国产语言却一直不温不火，对于程序员来说，拥有一款属于我们自己的语言，一直是大家梦寐以求的事情。"
tags: ["编程语言","OpenAI","后端"]
ShowReadingTime: "阅读4分钟"
weight: 104
---
在这个技术日新月异的时代，编程语言的更新换代似乎已经成为了家常便饭。但国产语言却一直不温不火，对于程序员来说，拥有一款属于我们自己的语言，一直是大家梦寐以求的事情。

如果我说有一种国产编程语言，它的运行速度比Rust快9倍，比GO快35倍，你会相信吗？

这不是天方夜谭，最近，被称为“国产编程语引领者”的`MoonBit`（月兔），宣布正式进入Beta预览版本阶段啦！

一听月兔这名字起得挺中式的。

#### 一、初识MoonBit

> `MoonBit`是由粤港澳大湾区数字经济研究院（福田）研发的全新编程语言。

① 官网

[www.moonbitlang.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.moonbitlang.cn%2F "https://www.moonbitlang.cn/")

![官网](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4a08ef5c0d7d40f08055f10c62ce16b5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=1ZjJcLhFEiLhsFdQXMLtLuHhH34%3D)

② 目前状态

`MoonBit`是2022年推出的国产编程语言，并在2023年8月18日海外发布后，立即获得国际技术社区的广泛关注。

经过一年多的高速迭代，`MoonBit`推出了beta预览版。

`MoonBit` 目前处于 `Beta-Preview` 阶段。官方希望能在 2024/11/22 达到 Beta 阶段，2025年内达到 1.0 阶段。

③ 由来

诞生于AI浪潮，没有历史包袱：`MoonBit` 诞生于 `ChatGPT` 出世之后，使得 `MoonBit` 团队有更好的机会去重新构想整个程序语言工具链该如何与 AI 友好的协作，不用承担太多的历史包袱

#### 二、MoonBit 语言优势

① **编译与运行速度快**

MoonBit在编译速度和运行时性能上表现出色，其编译626个包仅需1.06秒，**比Rust快了近9倍；运行速度比GO快35倍！**

![编译速度比较](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/60d56329fd5945afb6edc6a0644a279c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=zWVFj9zh4P1cS5CEvTNjM127dzI%3D)

② **代码体积小**

`MoonBit` 在输出 `Wasm` 代码体积上相较于传统语言有显著优势。

一个简单的HTTP 服务器时，`MoonBit` 的输出文件大小仅为 `27KB`，而 `WasmCloud`提供的`http-hello-world` 模板中 `Rust` 的输出为 `100KB`，`TypeScript` 为 `8.7MB`，`Python` 更是高达 `17MB`。

![代码体积比较](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6efc22434be14751872fb62df3480319~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=15fqZ7TRU7cTY3fNAmm2arKlaeo%3D)

③ **多重安全保障**

`MoonBit` 采用了强大的类型系统，并内置静态检测工具，在编译期检查类型错误，

`MoonBit`自身的静态控制流分析能在编译器捕获异常的类型，从而提高代码的正确性和可靠性。

④ **高效迭代器**

`MoonBit`创新地使用了零开销的迭代器设计，使得用户能够写出既优雅又高效的代码。

⑤ **创新的泛型系统设计**

`MoonBit`语言在它的测试版里就已经搞定了泛型和特殊的多态性，而且在编译速度特别快的同时，还能做到用泛型时不增加额外负担。

你要知道，这种本事在很多流行的编程语言里，都是正式发布很久之后才慢慢有的，但`MoonBit`一开始就做到了。这种设计在现在编程语言越来越复杂的大背景下特别关键，因为一个好的类型系统对于整个编程语言生态的健康成长是特别重要的。

#### 三、应用场景

① 云计算

② 边缘计算

③ AI 以及教学领域的发展

#### 四、开发样例

我们在官网 [www.moonbitlang.cn/gallery/](https://link.juejin.cn?target=https%3A%2F%2Fwww.moonbitlang.cn%2Fgallery%2F "https://www.moonbitlang.cn/gallery/") 可以看到用使用`MoonBit` 开发的游戏样例

*   罗斯方块游戏
*   马里奥游戏
*   数独求解器
*   贪吃蛇游戏

![游戏开发样例](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/782306e8f0144c3a8dddfc86505b1d09~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=0mLChD1AN5JgqJj89mYSnyQ6UrM%3D)

#### 五、语言学习

##### 5.1 语法文档

> 如果你也对`MoonBit`感兴趣，想学习它，访问官方文档[docs.moonbitlang.cn/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.moonbitlang.cn%2F "https://docs.moonbitlang.cn/")。文档算是比较详细的了

![image-20240921212615386](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9b12a01b50d24e0b9edc902cc26dbe2b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=w1%2FEjfU9YFLvYHl5a5AblIhIG5c%3D)

##### 5.2 在线编译器

> 无需本地安装编译器即可使用，官方提供了在线编译器

① 在线编辑器地址

[try.moonbitlang.cn/](https://link.juejin.cn?target=https%3A%2F%2Ftry.moonbitlang.cn%2F "https://try.moonbitlang.cn/")

![在线编辑器](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cab914a6af064781b2ce3fe7eface3f8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=FN3GS60DeDH9Pg7ASp5xwcazPTM%3D)

② 点击这儿运行代码

![运行代码](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cd6d4ae7eced45f5a92d22b43258921a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=vU3xRL2kAJp8yeLQit5BiuHEUaA%3D)

##### 5.3 VS Code 中安装插件编写代码、

① 安装插件

![安装插件](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/876ee9ac9fc347899eea4b26ff17a2e4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=9m%2FCcxxzTCR73M%2FBPrOaENLL8vg%3D)

![搜索插件](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/536043ac00a84a2f89f0754b6cc47699~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=%2F7nUbIanujoxWKD98%2BKiACvl0vE%3D)

② 下载程序

按下`shift+cmd+p`快捷键（mac快捷键，windows和linux快捷键是`ctrl+shift+p`），输入 `MoonBit:install latest moonbit toolchain`，随后会出现提示框，点击“yes”，等待程序下载完成。

![下载程序](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/000a335b478046d69ec09f81aa7e93d6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGY5pmT5Yeh:q75.awebp?rk3s=f64ab15b&x-expires=1727704591&x-signature=wMwKn%2BvsfgfGHVDljxq9ZLNwWeU%3D)

③ 创建并打开新项目

下载完成后，点击terminal，输入`moon new hello && code hello`以创建并打开新项目。

④ 始执行代码

项目启动后，再次打开terminal，输入`moon run main`命令，即可开始执行代码。

#### 六、小结

下面是晓凡的一些个人看法

`MoonBit` 作为一款新兴的国产编程语言，其在性能和安全性方面的表现令人印象深刻。

特别是它在编译速度和运行效率上的优化，对于需要处理大量数据和高并发请求的现代应用来说，是一个很大的优势。

同时，它的设计理念符合当前软件开发的趋势，比如对云计算和边缘计算的支持，以及对 AI 应用的适配。

此外，`MoonBit` 团队在语言设计上的前瞻性思考，比如泛型系统的实现，显示出了其对未来编程语言发展趋势的深刻理解。

而且，提供的游戏开发样例不仅展示了 `MoonBit` 的实用性，也降低了初学者的学习门槛。