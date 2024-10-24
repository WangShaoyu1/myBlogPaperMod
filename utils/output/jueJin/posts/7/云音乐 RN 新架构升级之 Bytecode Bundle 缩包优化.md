---
author: "网易云音乐技术团队"
title: "云音乐 RN 新架构升级之 Bytecode Bundle 缩包优化"
date: 2024-01-23
description: "RN 升级 070 后使用了 Hermes 引擎，Hermes 引擎的一大优势是预编译与字节码执行能力。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:22,comments:0,collects:23,views:3669,"
---
> 本文作者：陈骏 陈东洋

![](/images/jueJin/a9bd550d7cd4240.png)

背景
--

RN 升级 0.70 后使用了 Hermes 引擎，Hermes 引擎的一大优势是预编译与字节码执行能力，但是将 JS 文本编译成字节码是有额外成本的，根据我们后续实际打包经验，JS Bundle 文件转换成 HBC Bundle（Hermes Bytecode Bundle）文件后的 ZIP 包体积增加了 40% ～100%，且增量包是原先的 2 ～ 3 倍。

是否压缩

JS Bundle 大小

Bytecode Bundle 大小

ZIP 前

2.7MB

3.3MB

ZIP 后

623KB

1.4MB

包大小的增加不仅影响到用户体验，也会使网络资费上涨，因此有必要对 HBC 包体积过大问题进行治理。我们主要从以下两个方面进行缩包：

1.  从产物压缩方式入手
2.  从打包产物导出入手

从产物压缩方式入手
---------

在 RN 0.60 时期，我们一直选用的 zip 来对最终包产物进行压缩，zip 本身是一种压缩率比较低的压缩方式，为了能选择适合的压缩方式，对比了下市面上常用的压缩率比 zip 要高的三种压缩方式：gzip，bzip2，xz。

### 压缩算法对比

#### gzip

*   采用 DEFLATE 算法进行数据压缩

#### 性能

![img](/images/jueJin/4076f42cdd274b6.png)

#### bzip2

*   采用 Burrows-Wheeler 变换和霍夫曼编码算法进行数据压缩
    *   Burrows-Wheeler 变换是一种数据重排技术
    *   霍夫曼编码则用于进一步压缩重排后的数据

#### 性能

![img2](/images/jueJin/6f1268c5c64b4c8.png)

#### xz

*   采用 LZMA（Lempel-Ziv-Markov chain algorithm）算法进行数据压缩

#### 性能

![img3](/images/jueJin/ae99dc75867c414.png)

### 数据对比（使用默认压缩等级6对比）

*   压缩速度：
    *   对比：xz 耗时 1 分 27 秒 1，gzip 耗时 5 秒 1，bzip2 耗时 8 秒 8
    *   结论：xz 压缩耗时比 gzip 与 bzip2 要长很多
*   占用压缩内存：
    *   对比：xz 压缩最大内存为 97656KB，gzip 压缩最大内存为 2048KB，bzip2 压缩最大内存为 6164KB
    *   结论：xz 压缩最大内存比 gzip 与 bzip2 要大很多
*   压缩率：
    *   对比：xz 压缩率为 73.62%，gzip 压缩率 63.48%，bzip2 压缩率 70.32%
    *   结论：xz 压缩率最高，bzip2 第二，gzip 最低
*   解压耗时：
    *   对比：xz 解压耗时 1 秒 9，gzip 解压耗时 0.8 秒，bzip2 解压耗时 5 秒 5
    *   结论：gzip 解压速度最快，xz 次之，bzip2 解压速度比其他慢好几倍
*   解压内存占比：
    *   对比：xz 解压最大内存 10580KB，gzip 解压最大内存 1876KB，bzip2 解压最大内存 3812KB
    *   结论：xz 解压最大内存比 gzip 与 bzip2 要大很多

### 压缩方式选择

1.  压缩速度： 由于我们在打包机压缩，不会影响到用户体验，可忽略
2.  占用压缩内存：同 1，可忽略
3.  压缩率（重点考虑）：缩包主要减少包体积，优先选用 xz 压缩
4.  解压耗时（重点考虑）：gzip 耗时最短，但压缩率低，bzip2 解压速度太慢，优先选用 xz
5.  解压内存占比（非重点考虑）：测试了 23G 数据压缩，解压内存最高占用到 60MB，且是瞬时内存，马上下降。对于 RN 包来说体积不会像测试数据一样庞大，预估内存占用最多在 KB 级别，可忽略。

**结论：** 从压缩率，解压耗时两方面并结合解压内存进行考虑，最终我们选择了 xz 作为 HBC 包新的压缩方式

### HBC 压缩数据对比

xxx-home

xxx-vip

xxx-artist

xxx-timed

xxx-voice

xxx-detail

xxx-rn

相比 ZIP 缩小百分比

\-23%

\-25%

\-25%

\-20%

\-22%

\-20%

\-26%

从打包产物导出入手
---------

### HBC 包与 SourceMap

#### HBC 包优化导出

在普通文本 Bundle 转换成 HBC Bundle 时，hermesc 提供一些优化选项，其中有 `-O` 最高级别优化，命令参数如下:

![Hermesc optimization level](/images/jueJin/ad1892d0f3c04eb.png)

经过本地验证得知，相同的普通文本 Bundle 使用 `-O` 参数导出的 HBC Bundle 相较于未使用 `-O` 在文件大小上有 10% ~ 22% 的收益。主要收益来自于符号表（SourceMap）导出，试验数据列举如下:

xxx-p

xxx-s

xxx-c

xxx-s

减少百分比

\-10.06%

\-15.65%

\-22.28%

\-17.58%

#### HBC 优化导出后的 SourceMap 补全

**JS 异常在 RN Bundle 里的符号解析**

在 RN 运行时，当发生 JS 异常时，引擎会生成异常堆栈。这个堆栈包含关键信息，其中之一是每个堆栈帧的行和列。通过这些行和列信息，我们能够在打包后的 Bundle 中定位到具体 JS 文件中出错的函数位置。这种定位背后使用的是一套标准的前端符号解析技术，即 SourceMap。在 NPM 上有标准的 SourceMap 解析库可供安装和使用 - [SourceMap NPM安装](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsource-map%23new-sourcemapconsumerrawsourcemap "https://www.npmjs.com/package/source-map#new-sourcemapconsumerrawsourcemap")。为了获取 RN Bundle 的 SourceMap，我们需要在打包时进行导出。

**JS 到 普通文本 Bundle 打包，这里导出的 SourceMap 我们称为：普通文本 Bundle SourceMap**

```css
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ./build/index.ios.bundle --sourcemap-output ./build/index.ios.bundle.packager.map
```

下面举个简单的例子，点击按钮访问未定义变量的 JS 异常例子:

![异常代码Demo](/images/jueJin/96f8b1ee810243b.png)

![引擎报错](/images/jueJin/5dcd1d1c4882403.png)

此时我们有 SourceMap 文件和异常堆栈，就可以使用脚本进行符号解析，如本示例第 1 条堆栈的行号 384，列号 2419；第 2 条堆栈的行号 384，列号 2609，解析结果如下:

```yaml
//堆栈第1条
执行:node parse_error.js 384 2419
    {
    source: '/Users/xxx/Desktop/bear_baby/RNNew/App.js',
    line: 120,
    column: 18,
    name: 'myVariable'
}

//堆栈第2条
执行:node parse_error.js 384 2609
    {
    source: '/Users/xxx/Desktop/bear_baby/RNNew/App.js',
    line: 113,
    column: 4,
    name: 'undefinedVarTest'
}
```

这里我们很清晰的还原符号所在的文件，函数/变量名等信息。

**普通文本 Bundle 和 未使用 `-O` 优化导出的 HBC Bundle 异常解析**

正常情况下普通文本 Bundle 和 未使用 `-O` 优化导出的 HBC Bundle 都可以使用上述解析方案进行解析，都能还原现场信息，但是如何使用 `-O` 优化打包的 HBC Bundle 运行发生 JS 异常时就会出现如下问题。

**使用 `-O` 优化导出的 HBC Bundle 异常解析**

使用 `-O` 优化导出的 HBC Bundle 调试时发现 JS 错误时报错堆栈完全失去了关键信息可读性，如下:

![引擎报错图2](/images/jueJin/b6c94fbaa358452.png)

此时 HBC Bundle 的 JS Fatal 错误堆栈中，定位到的行号都是 1，因为 HBC Bundle 真的只有 1 行。这是因为 `-O` 是最高优化级别，生成的最终产物中已经不包含符号表信息，导致引擎无法将异常还原到原始文本 Bundle 的行列。

显然这样不利于业务排查问题，因此需要着手解决优化后 HBC Bundle 加载异常符号缺失问题。经过本地试验分析，在普通文本 Bundle 转换成 HBC Bundle 时 Hermes 提供了再次导出 普通文本 Bundle 到 HBC Bundle 的 SourceMap 导出参数 `--sourcemap-output` ，如下:

**普通文本 Bundle 到 HBC Bundle 打包，这里导出的 SourceMap 我们称为： HBC Bundle SourceMap**

```bash
./hermesc -O -emit-binary -output-source-map -out=./build/index.ios.bundle.hbc ./build/index.ios.bundle
```

至此我们有了这 2 个 SourceMap 文件，我们就可以对 `-O` 优化 HBC Bundle 发生的 JS 异常进行完整的解析，具体解析流程如下:

1.  对于使用 `-O` 优化导出 HBC Bundle 发生的 JS 符号异常，入参行列号我们使用 **HBC Bundle SourceMap** 去解析得到一个新的行列号，这个行列号就是 对应普通文本 Bundle 对象的行列号。
2.  拿到上一步的普通文本的 Bundle 行列号，我们使用 **普通文本 Bundle SourceMap** 却解析得到此行列号对应的对应的 JS 文件名 和 所在 JS 文件具体的行列号。

当然如果加载最终 Bundle 产物就是 `-O` 优化 HBC Bundle，那么我们也可以提前使用合并命令合并 2 个 SourceMap 文件得到最终的 SourceMap 文件，使用最终的 SourceMap 文件可以一步到位解析出符号所在文件位置等信息。合并命令如下:

```bash
./node_modules/react-native/scripts/compose-source-maps.js ./build/index.ios.bundle.packager.map ./build/index.ios.bundle.hbc.map -o ./build/index.ios.bundle.map
```

**一图胜万言**

![SourceMap导出](/images/jueJin/f1034d9790134af.png)

![SourceMap解析](/images/jueJin/343cd36ec67e475.png)

**结论：**

1.  hermes 导出 HBC Bundle 时可以使用 `-O` 参数优化导出产物，减少导出产物体积，有 10% ~ 22% 的收益。
2.  使用 `-O` 参数优化导出的 HBC Bundle 在 JS 异常解析堆栈符号时，需要使用 **HBC Bundle SourceMap** 文件先解析出行列，再使用**普通文本 Bundle SourceMap** 解析出最终产物。
3.  当然也可以提前合并 **HBC Bundle SourceMap** 和 **普通文本 Bundle SourceMap**，实现一步到位的解析。
4.  实际实现时，还需要考虑 SourceMap 文件的打包存储及版本关系，这个就不做过多赘述。

### 增量包缩包

这里的增量包是在原先 Bundle 包的基础上，进行修改代码，通过 bsdiff 生成的一种差量包，用于下发给客户端进行增量更新。增量包本身也有大小，且在使用 HBC Bundle 后，体积也增大明显，所以增量包缩包的意思是缩小增量包体积。

#### 了解 `-base-bytecode` 原理

hermes 编译器有个参数 `-base-bytecode`，该参数的作用是指定一个基本的字节码文件，这个文件包含了可能会被多个包共享的代码。在生成新的字节码文件时，hermes 会使用这个基本字节码文件作为参考，这样可以减少重复编译相同代码的时间并减小最终字节码文件的大小。

执行步骤如下：

1.  引用基础字节码：编译器加载由 `-base-bytecode` 指定的基础字节码文件（如 test.hbc）。这个文件通常包含了一组 JS 代码编译后的字节码，它可能包括了库、框架或者其他常用功能的代码。
    
2.  增量编译：当编译新的 JS 源文件时，编译器会检查这些源文件中的代码是否已经存在于基础字节码文件中。
    
3.  避免重复：对于已经存在于基础字节码文件中的代码，编译器不会重新编译这部分代码。相反，它会在新生成的字节码文件中（如 test1.hbc）引用基础字节码文件中的对应部分。
    
4.  编译新代码：对于新的源文件中独有的代码，编译器将其编译成字节码，并将这些新的字节码与基础字节码文件中的字节码合并，形成最终的字节码文件。
    

从以上原理可以得出，编译器使用 `-base-bytecode` 后，不会重复编译已存在的代码，理论上对这部分代码进行 diff 操作不会出现任何差异。

#### `-base-bytecode` 与 bsdiff 结合

**不添加-base-bytecode**

*   增量包大小为：65kb
    
    //生成新版本 hbc，test1 大小为 2.63mb 左右 hermes -emit-binary ./test1.bundle -out ./test1.hbc
    
    //生成patch, 大小为 65kb bsdiff test.hbc test1.hbc patchfile
    

**添加-base-bytecode**

*   'noneBaseBytecodeTest.hbc' 不是通过 `-base-bytecode` 方式生成的包
    *   增量包大小为：13kb

```csharp
//生成新版本 hbc，大小为 2.65mb 左右，大小不变
hermes -emit-binary -base-bytecode='noneBaseBytecodeTest.hbc' ./test1.bundle -out ./test1.hbc

//生成patch, 大小为 13kb
bsdiff noneBaseBytecodeTest.hbc test1.hbc patchfile
```

*   'baseBytecodeTest.hbc' 是通过 `-base-bytecode` 方式生成的包
    *   增量包大小为：9kb

```csharp
//生成新版本 hbc，大小为 2.65mb 左右，大小不变
hermes -emit-binary -base-bytecode='baseBytecodeTest.hbc' ./test1.bundle -out ./test1.hbc

//生成patch, 大小为 9kb
bsdiff baseBytecodeTest.hbc test1.hbc patchfile
```

**结论：**

1.  使用 `-base-bytecode` 比不使用 `-base-bytecode`，使用 bsdiff 生成的增量包体积减少了 80% ～ 85%。
2.  都使用 `-base-bytecode` 生成的包，使用 bsdiff 生成的增量包更小。

### 参考资料

*   [Comparison of gzip, bzip2 and xz compression tools.](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Flinuxstories%2Fcomparison-of-gzip-bzip2-and-xz-compression-tools-7348ed910c68 "https://medium.com/linuxstories/comparison-of-gzip-bzip2-and-xz-compression-tools-7348ed910c68")

最后
==

![](/images/jueJin/902ac8f5fe844d5.png)

更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")