---
author: "yck"
title: "绝了，没想到一个 source map 居然涉及到那么多知识盲区"
date: 2021-05-17
description: "Source map 想必大家都不陌生。线上的代码多是压缩后的，如果线上有报错却只能调试那个代码多半是个噩梦。因此我们需要有一个桥梁帮助我们搭建起源代码及压缩后代码的联系。"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:552,comments:0,collects:445,views:32466,"
---
Source map 想必大家都不陌生。线上的代码多是压缩后的，如果线上有报错却只能调试那个代码多半是个噩梦。因此我们需要有一个桥梁帮助我们搭建起源代码及压缩后代码的联系，source map 就是起了这个作用。

以下是 MDN 对于 source map 的解释：

> 调试原始源代码会比浏览器下载的转换后的代码更加容易。 [source map](https://link.juejin.cn?target=https%3A%2F%2Fwww.html5rocks.com%2Fen%2Ftutorials%2Fdevelopertools%2Fsourcemaps%2F "https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/") 是从已转换的代码映射到原始源的文件，使浏览器能够重构原始源并在调试器中显示重建的原始源。

但是不知道各位读者有没有对 source map 的原理产生过疑问？笔者列出了四个疑问，不知道各位是不是也存在过这样的问题：

![Source map 四问](/images/jueJin/7221a39259a648a.png)

接下来的内容会逐步为读者解答这四问。

source map 文件是否影响网页性能
---------------------

这个答案肯定是不会影响，否则构建相关的优化就肯定会涉及到对于 source map 的处理了，毕竟 source map 文件也不小。

其实 source map 只有在打开 dev tools 的情况下才会开始下载，相信大部分用户都不会去打开这个面板，所以这也就不是问题了。

这时可能会有读者想说：哎，但是我好像从来没有在 Network 里看到 source map 文件的加载呀？其实这只是浏览器隐藏了而已，如果大家使用抓包工具的话就能发现在打开 dev tools 的时候开始下载 source map 了。

source map 存在标准嘛？
-----------------

source map 是存在一个标准的，为 Google 及 Mozilla 的工程师制定，[文档地址](https://link.juejin.cn?target=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k%2Fedit "https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit")。正是因为存在这份标准，各个打包器及浏览器才能生成及使用 source map，否则就乱套了。

各个打包器基本都基于[该库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmozilla%2Fsource-map "https://github.com/mozilla/source-map")来生成 source map，当然也存在一些魔改的方案，但是标准都是统一的。

通过上面的库生成出来的 source map 格式大致如下，大家也可以对比各个打包器的产物，格式及内容大部分都是一致的：

```json
    {
    version: 3,
    file: "min.js",
    names: ["bar", "baz", "n"],
    sources: ["one.js", "two.js"],
    sourceRoot: "http://example.com/www/js/",
    mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA"
}
```

接下来笔者介绍下重要字段的作用：

*   version：顾名思义，指代了版本号，目前 source map 标准的版本为 3，也就是说这份 source map 使用的是第三版标准产出的
*   file：编译后的文件名
*   names：一个优化用的字段，后续会在 mappings 中用到
*   sources：多个源文件名
*   mappings：这是最重要的内容，表示了源代码及编译后代码的关系，但是先略过这块，下文中会详细解释

另外大部分应用都是由 webpack 来打包的，可能有些读者会发现 webpack 的 source map 产出的字段于上面的略微有些不一致。

这是因为 webpack 魔改了一些东西，但是底下还是基于这个库实现的，只是变动了一些不涉及核心的字段，[具体代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack-sources%2Fblob%2Fmaster%2Flib%2FSourceMapSource.js "https://github.com/webpack/webpack-sources/blob/master/lib/SourceMapSource.js")。

浏览器怎么知道源文件和 source map 的关系？
---------------------------

这里我们以 webpack 做个实验，通过 webpack5 对于以下代码进行打包：

```js
// index.js
const a = 1
console.log(a);
```

当我们开启 source map 选项以后，产物应该为两个文件，分别为 `bundle.js` 以及 `bundle.js.map`。

查看 `bundle.js` 文件以后我们会发现代码中存在这一一段注释：

```js
console.log(1);
//# sourceMappingURL=bundle.js.map
```

`sourceMappingURL` 就是标记了该文件的 source map 地址。

当然除此之外还有别的方式，通过查阅 [MDN 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FSourceMap "https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/SourceMap") 发现还可以通过 response header 的 `SourceMap: <url>` 字段来表明。

source map 是如何对应到源代码的？
----------------------

这是 source map 最核心的功能，也是最涉及知识盲区的一块内容。

大家应该还记得上文中没介绍的 `mapping` 字段吧，接下来我们就来详细了解这个字段的用处。

我们还是以刚才打包的文件为例，来看看产出的 source map 长啥样（去掉了无关紧要的）：

```json
    {
    sources:["webpack://webpack-source-demo/./src/index.js"],
    names: ['console', 'log'],
    mappings: 'AACAA,QAAQC,IADE',
}
```

首先 `mappings` 的内容其实是 Base64 VLQ 的编码表示。

内容由三部分组成，分别为：

*   英文，表示源码及压缩代码的位置关联
*   逗号，分隔一行代码中的内容。比如说 `console.log(a)` 就由 `console` 、`log` 及 `a` 三部分组成，所以存在两个逗号。
*   分号，代表换行

逗号和分号想必大家没啥疑问，但是对于这几个英文内容应该会很困惑。

其实这就是一种压缩数字内容的编码方式，毕竟源代码可能很庞大，用数字表示行数及列数的话 source map 文件将也会很庞大，因此选用 Base 64 来代表数字用以减少文件体积。

比如说 `A` 代表了数字 0，`C` 代表了数字 1 等等，有兴趣的读者可以通过[该网站](https://link.juejin.cn?target=https%3A%2F%2Fwww.murzwin.com%2Fbase64vlq.html "https://www.murzwin.com/base64vlq.html")了解映射关系。

了解了这层编码的映射关系，我们再来聊聊这一串串英文到底代表了什么。

其实这每串英文中的字母都代表了一个位置：

1.  压缩代码的第几列
2.  哪个源代码文件，毕竟可以多个文件打包成一个，对应 `sources` 字段
3.  源代码第几行
4.  源代码第几列
5.  `names` 字段里的索引

这时读者可能有个疑惑，为啥没有压缩代码的第几行表示？这是因为压缩后的代码就一行，所以只需要表示第几列就行了。

* * *

**更新：有读者询问 Base64 表达的数字是有上限的，如果需要表示的数字很大的话该怎么办。实际上除了每个分号中的第一串英文是用来表示代码的第几行第几列的绝对位置之外，后面的都是相对于之前的位置来做加减法的。**

* * *

了解完以上知识以后，我们就来根据上文的内容解析下 `AACAA` 的具体含义吧，通过[该网站](https://link.juejin.cn?target=https%3A%2F%2Fwww.murzwin.com%2Fbase64vlq.html "https://www.murzwin.com/base64vlq.html")我们可以知道 `AACAA` 对应了 `[0,0,1,0,0]`，这里需要注意的是数字都从 0 开始，笔者表述的时候会自动加一，毕竟代码第零行听起来怪怪的。

1.  压缩代码的第一列
2.  第一个源代码文件，也就是 `index.js` 文件了
3.  源代码第二行了
4.  源代码的第一列
5.  `names` 数组中的第一个索引，也就是 `console`

通过以上的解析，我们就能知道 `console` 在源代码及压缩文件中的具体位置了。

但是为什么 source map 会知道编译后的代码具体在什么位置呢？这里就要用到 AST 了。让我们打开[网站](https://link.juejin.cn?target=https%3A%2F%2Fastexplorer.net%2F "https://astexplorer.net/")输入 `console.log(a)` 后观察右边的内容，你应该会发现如图所示的数据：

![image-20210516214636867](/images/jueJin/d7f590b8c7b1493.png)

因为 source map 是由 AST 产出的，所以我们能用上 AST 中的这个数据。

source map 的应用
--------------

一般来说 source map 的应用都是在监控系统中，开发者构建完应用后，通过插件将源代码及 source map 上传至平台中。一旦客户端上报错误后，我们就可以通过[该库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmozilla%2Fsource-map "https://github.com/mozilla/source-map")来还原源代码的报错位置（具体 API 看文档即可），方便开发者快速定位线上问题。

最后
--

source map 是我们日常中经常用到的东西，但是直到学习这块内容的时候才知道居然涉及到了那么多的知识盲区。

大家如果有什么疑问欢迎在评论区交流。

[![](/images/jueJin/33b5f724190f400.png)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Ffucking-frontend "https://github.com/KieSun/fucking-frontend")