---
author: "我码玄黄"
title: "vue-cli老项目继续优化：json压缩神器compress-json"
date: 2024-10-03
description: "通过压缩JSON格式脚本，显著减小构建产物大小，但本地打包时间缩短不明显。将压缩库集成到Jenkins打包脚本中，打包时间减少到7min。"
tags: ["前端","Vue.js","GitHub"]
ShowReadingTime: "阅读3分钟"
weight: 267
---
### 前言

上文讲到一个 `vue-cli` 带脚本生成内容的老项目的打包时间已经从 `40min` ，优化到 `12min` ，再到 `9min` 。

还有可以考虑的方式包含缩小脚本体积、依赖分包、构建的缓存等等。

那么本文就来讨论缩小脚本体积的方式。

### 分析

前文已知，生成的大量的脚本内容都是`JSON`的格式。

众所周知，`JSON`格式是一种 `key-value` 的格式，这样的格式，在遇到大量的描述内容时，势必会遇到 `key` 不断重复的问题，这就造成了文件体积迅速膨胀，尤其是在大量的数组，仅 `value` 不一样的时候。

所以，`JSON` 的格式一定有极大的压缩空间，尤其是我当前所遇到的场景，至少有50%以上的体积可以被压缩掉。

当然本文就不讨论具体的压缩方法了，直接上网查库解决问题。

当前生成文件的大小：

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ea55bd72c839461e8673444c888cc2fc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oiR56CB546E6buE:q75.awebp?rk3s=f64ab15b&x-expires=1728574995&x-signature=IqGYF3iNYbtc64UiT0Xo6K0ev48%3D)

当前打包时间：

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/59a871b7976b48c48649d8fef4d47799~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oiR56CB546E6buE:q75.awebp?rk3s=f64ab15b&x-expires=1728574995&x-signature=XnDVp4aZB3elY412c2fYV1Omyd8%3D)

### 对压缩库的要求

首先，能够在前端`js`环境和 `nodejs` 环境中直接压缩和解压缩使用，这是必须满足的。

其次，压缩率要尽量高，压缩后的内容不必一定要可读，二进制都行。

然后，一定要无损压缩，解压后不影响后续的使用。

逛了一圈后选中了 `compress-json` 库。

github：[github.com/beenotung/c…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbeenotung%2Fcompress-json "https://github.com/beenotung/compress-json")

该库不仅可以在js中使用，还有PHP、Python等版本。

### 使用压缩库

#### 安装

csharp

 代码解读

复制代码

`yarn add compress-json`

#### 压缩脚本

javascript

 代码解读

复制代码

`// 接收外部命令传入的json const json = process.argv[2] // 使用 compress-json 进行压缩 const compressedJson = require('compress-json').compress(JSON.parse(json)) // 返回压缩后的字符串 console.log(JSON.stringify(compressedJson))`

#### 修改生成文件的命令

bash

 代码解读

复制代码

``citem=$(node compress.js "${item}") echo "import { decompress } from 'compress-json';export const ${uuid} = decompress(\`${citem}\`)" > "${filename}.js"``

### 对比效果

#### 压缩后的文件大小

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d811e5a2fcb04a12aaa9340dc4d90eba~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oiR56CB546E6buE:q75.awebp?rk3s=f64ab15b&x-expires=1728574995&x-signature=qFvz8PPTdV76AndIzyTMKh1cjx4%3D)

#### 压缩后的打包时长

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4565a108a9f34f7ca082c53002b554d2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oiR56CB546E6buE:q75.awebp?rk3s=f64ab15b&x-expires=1728574995&x-signature=ZWLqbDDS9%2FXYHlmUuNrqCWQQlhE%3D)

我们可以看到打包时长略有缩短，不是特别明显，说明体积对打包时长的影响不算特别大。

当然，体积小肯定不只是这里的作用，构建产物的体积变小了，对整个项目的访问无疑是好处巨大的。

大胆猜测一下，在之前的优化中，已经将 `JSON` 内容修改为了字符串的形式，对于编译过程来说，这些内容几乎已经原样输出，如果这样的话，压缩过后，在本地尤其磁盘速度和cpu都比较空闲的时候，对打包的时长影响不会很大。

### 写在最后

虽然本次优化的结果在本地打包时不是特别明显，但是显著减小了构建产物的大小。

最后本次修改放到了 `Jenkins` 打包脚本中，打包时间减少到了 `7min`，已经快接近正常的打包时长。

当然，接下来还可以继续考虑构建分包，构建缓存等等方案。

– 欢迎点赞、关注、转发、收藏【我码玄黄】，各大平台同名。