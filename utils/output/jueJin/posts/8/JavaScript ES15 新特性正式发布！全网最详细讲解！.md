---
author: "Sunshine_Lin"
title: "JavaScript ES15 新特性正式发布！全网最详细讲解！"
date: 2024-08-07
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 2024 年 6 月 26 日，第 127 届 Ecma 大会批准了 ECMAScript 2024"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:9,comments:2,collects:2,views:553,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

2024 年 6 月 26 日，第 127 届 Ecma 大会批准了 ECMAScript 2024 语言规范，这意味着它现在正式成为标准。

新特性如下：

*   **Object.groupBy、Map.groupBy**
*   **Promise.withResolvers**
*   **String.prototype.isWellFormed、String.prototype.toWellFormed**
*   **Atomics.waitAsync()**
*   **正则表达式 v 标识**

![image.png](/images/jueJin/5e0303eb7c984b0.png)

接下来给大家讲讲这些新特性吧~

Object.groupBy、Map.groupBy
--------------------------

### 背景 & 使用

不知道你们有没有遇到过这样的类似的需求，比如现在有以下的数据，我想要按照年龄 age 字段，给这些数据分个组，那你们会怎么做呢？

![](/images/jueJin/1587666a11ca467.png)

其实可以直接使用 reduce 这个数组方法去做，就可以实现我们想要的效果

![](/images/jueJin/19161679f5b34e7.png)

![](/images/jueJin/a8b0db099455433.png)

但是有一个`lodash`的方法，叫`groupBy`，可以很简单做到我们想要的效果

![](/images/jueJin/f72938baaaec463.png)

这个方法很好用，但他是 lodash 的方法，而不是原生的，要是他是原生的就好了~~

然而，原生已经支持了这个方法！！！在 Object 身上！请看下方的代码，但是需要在 谷歌浏览器`117`以上的版本 才能运行

![](/images/jueJin/85be96f220c74ca.png)

同时也支持了`Map.groupBy`这个方法，但是我感觉这个方法不太实用。。。。。

![](/images/jueJin/d8628e6be0e34e5.png)

### 兼容性

![image-1.png](/images/jueJin/5a0a0f9cf4f5415.png)

![image-2.png](/images/jueJin/3f9abb3921b8467.png)

Promise.withResolvers
---------------------

### 背景 & 使用

有时候我们需要把 Promise 的 resolve 或者 reject 这两个参数给取出来，去实现某种目的

就比如下面例子，我想手动控制 Promise 的 fullfiled 的时机，所以需要把 resolve 给取出来，然后在我觉得适当的时机去执行这个 resolve，这样 Promise 就变 fullfiled 了

![](/images/jueJin/cb42567806aa4e7.png)

但是这样挺麻烦的，我总是得定义一个额外的变量去存储这个 resolve

`Promise.withResolvers`就是为了解决这件事情

它的作用是把 Promise实例、resolve、reject 解构出来供我们使用，还是刚刚的例子，使用`Promise.withResolvers`

![](/images/jueJin/efd4b91281eb48e.png)

### 兼容性

![image-3.png](/images/jueJin/bd2c44b47871493.png)

String.prototype.isWellFormed、String.prototype.toWellFormed
-----------------------------------------------------------

JavaScript 中的字符串是`UTF-16`编码的。`UTF-16`编码中有代理对的概念，这一概念在`UTF-16`字符、Unicode 码位和字素簇部分有详细介绍。

### isWellFormed

`isWellFormed()`让你能够测试一个字符串是否是格式正确的（即不包含单独代理项）。由于引擎能够直接访问字符串的内部表示，与自定义实现相比 `isWellFormed()` 更高效。如果你需要将字符串转换为格式正确的字符串，可以使用 `toWellFormed()`方法。`isWellFormed()`让你可以对格式正确和格式错误的字符串进行不同的处理，比如抛出一个错误或将其标记为无效。

![image-4.png](/images/jueJin/c94a10201bc1439.png)

如果传递的字符串格式不正确，`encodeURI`会抛出错误。可以通过使用`isWellFormed()`在将字符串传递给 encodeURI() 之前测试字符串来避免这种情况。

![image-5.png](/images/jueJin/3f3b077b20164fd.png)

![image-6.png](/images/jueJin/6acbdb16b82a4c1.png)

### toWellFormed

`toWellFormed()`迭代字符串的码元，并将任何单独代理项替换为`Unicode`替换字符`U+FFFD`。这确保了返回的字符串格式正确并可用于期望正确格式字符串的函数，比如`encodeURI`。由于引擎能够直接访问字符串的内部表示，与自定义实现相比`toWellFormed()`更高效。

当在某些上下文中使用格式不正确的字符串时，例如`TextEncoder`，它们会自动转换为使用相同替换字符的格式正确的字符串。当单独代理项被呈现时，它们也会呈现为替换字符（一个带有问号的钻石形状）。

![image-7.png](/images/jueJin/bbfa6a9a2f80475.png)

如果传递的字符串格式不正确，`encodeURI`会抛出错误。可以先通过使用`toWellFormed()`将字符串转换为格式正确的字符串来避免这种情况。

![image-8.png](/images/jueJin/a5b6208623844b6.png)

![image-9.png](/images/jueJin/24f9ca31025a42c.png)

Atomics.waitAsync()
-------------------

### 背景 & 使用

`Atomics.waitAsync()`静态方法异步等待共享内存的特定位置并返回一个`Promise`。

与`Atomics.wait()`不同，`waitAsync`是非阻塞的且可用于主线程。语法如下：

![image-10.png](/images/jueJin/a50639fde76f468.png)

> 此操作仅适用于基于`SharedArrayBuffer`的 `Int32Array`或 `BigInt64Array` 视图。

举一个简单的例子，给定一个共享的 Int32Array：

![image-11.png](/images/jueJin/ad075f6fb2334c4.png)

令一个读取线程休眠并在位置 0 处等待，预期该位置的值为 0。result.value 将是一个 Promise：

![image-12.png](/images/jueJin/43ee89a296704f4.png)

在该读取线程或另一个线程中，对内存位置 0 调用以令该 Promise 解决为 "ok"：

![image-13.png](/images/jueJin/2582c2bb323f488.png)

如果它没有解决为 "ok"，则共享内存该位置的值不符合预期（value 将是 "not-equal" 而不是一个 Promise）或已经超时（该 Promise 将解决为 "time-out"）

### 兼容性

![image-14.png](/images/jueJin/b9161d805d5c45c.png)

正则表达式 v 标识
----------

RegExp v 标志是 u 标志的超集，并提供了另外两个功能：

*   字符串的 Unicode 属性： 通过 Unicode 属性转义，可以使用字符串的属性。

![image-15.png](/images/jueJin/d0775772e0b742a.png)

*   设置符号： 允许在字符类之间进行集合操作。

![image-16.png](/images/jueJin/12bf69d9589e494.png)

在 JavaScript 中，使用 "u" 标志的正则表达式进入 Unicode 模式，它扩展了正则表达式的处理能力以包含 Unicode 序列，而非仅限于 ASCII 字符集。这样做有多种好处：

*   **Unicode 字符的准确处理：** 不加 "u" 标志的正则表达式可能无法正确处理超出基本多文种平面（BMP）的 Unicode 字符。启用 "u" 标志允许正则表达式匹配任何有效的 Unicode 字符。
    
*   **量词行为的变化：** 在启用了 "u" 标志的情况下，量词（如 \*、+、?、{n}、{n,} 和 {n,m}）将适用于任何有效的 Unicode 字符，而不仅是 ASCII 字符。
    
*   **支持 Unicode 属性转义：** 使用 "\\p{...}" 和 "\\P{...}" 转义序列，可以分别匹配或排除具有特定 Unicode 属性的字符，如 "\\p{Script=Arabic}" 可以匹配所有阿拉伯脚本的字符。
    
*   **Unicode 转义的正确处理：** Unicode 模式允许使用 "\\u{...}" 表示 Unicode 字符，其中的 {...} 是一个十六进制数。
    
*   **正则表达式方法行为的改进：** 在 Unicode 模式下，例如 String.prototype.match()、String.prototype.replace()、String.prototype.search() 和 RegExp.prototype.exec() 等方法的返回结果更为精确。
    

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有10000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")