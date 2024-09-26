---
author: "叶知秋水"
title: "EcmaInternational批准ECMAScript2024：有哪些新内容？"
date: 2024-06-30
description: "2024年6月26日，第127届Ecma大会批准了ECMAScript2024语言规范，这意味着它现在正式成为标准。ECMAScript2024有什么新功能？"
tags: ["前端","ECMAScript6"]
ShowReadingTime: "阅读2分钟"
weight: 74
---
![1_Naae67Ssp2makfMYy2Tx6w.webp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e3a7a1449d4f2caeee5c4b9fe83239~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=800&h=275&s=2466&e=webp&b=fbf2b8) 2024 年 6 月 26 日，[第 127 届 Ecma 大会批准了 ECMAScript 2024 语言规范](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fecma262%2Freleases%2Ftag%2Fes2024 "https://github.com/tc39/ecma262/releases/tag/es2024")，这意味着它现在正式成为标准。

ECMAScript 2024 有什么新功能？
-----------------------

### 对同步可迭代对象进行

`Map.groupBy()`将可迭代项分组到 Map 条目中，这些条目的键由回调提供：

dart

 代码解读

复制代码

`assert.deepEqual(   Map.groupBy([0, -5, 3, -4, 8, 9], x => Math.sign(x)),   new Map()     .set(0, [0])     .set(-1, [-5,-4])     .set(1, [3,8,9]) );`

还有一种`Object.groupBy()`方式可以生成一个对象而不是 Map：

ini

 代码解读

复制代码

`assert.deepEqual(   Object.groupBy([0, -5, 3, -4, 8, 9], x => Math.sign(x)),   {     '0': [0],     '-1': [-5,-4],     '1': [3,8,9],     __proto__: null,   } );`

有关在这两种方法之间进行选择的技巧以及更多示例，请参阅[“探索 JavaScript”](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_sync-iteration.html%23grouping-sync-iterables "https://exploringjs.com/js/book/ch_sync-iteration.html#grouping-sync-iterables")。

### `Promise.withResolvers()`  [](https://link.juejin.cn?target=https%3A%2F%2F2ality.com%2F2024%2F06%2Fecmascript-2024.html%23promise.withresolvers\(\) "https://2ality.com/2024/06/ecmascript-2024.html#promise.withresolvers()")

[`Promise.withResolvers()`](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_promises.html%23Promise.withResolvers "https://exploringjs.com/js/book/ch_promises.html#Promise.withResolvers")提供了一种创建我们想要解决的 Promise 的新方法：

arduino

 代码解读

复制代码

`const { promise, resolve, reject } = Promise.withResolvers();`

### 正则表达式`/v`  [](https://link.juejin.cn?target=https%3A%2F%2F2ality.com%2F2024%2F06%2Fecmascript-2024.html%23regular-expression-flag-%252Fv "https://2ality.com/2024/06/ecmascript-2024.html#regular-expression-flag-%2Fv")

[新的正则表达式标志`/v`（`.unicodeSets`）](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_regexps.html%23regexp-flag-unicode-sets "https://exploringjs.com/js/book/ch_regexps.html#regexp-flag-unicode-sets")可实现以下功能：

*   Unicode 字符串属性的转义（😵‍💫由三个代码点组成）：
    
    javascript
    
     代码解读
    
    复制代码
    
    ``// Previously: Unicode code point property `Emoji` via /u assert.equal(   /^\p{Emoji}$/u.test('😵‍💫'), false ); // New: Unicode string property `RGI_Emoji` via /v assert.equal(   /^\p{RGI_Emoji}$/v.test('😵‍💫'), true );``
    
*   `\q{}`通过字符类中的字符串文字：
    
    javascript
    
     代码解读
    
    复制代码
    
    `> /^[\q{😵‍💫}]$/v.test('😵‍💫') true > /^[\q{abc|def}]$/v.test('abc') true`
    
*   字符类的集合运算：
    
    javascript
    
     代码解读
    
    复制代码
    
    `> /^[\w--[a-g]]$/v.test('a') false > /^[\p{Number}--[0-9]]$/v.test('٣') true > /^[\p{RGI_Emoji}--\q{😵‍💫}]$/v.test('😵‍💫') false`
    
*   `/i`如果 Unicode 属性转义被否定，则改进匹配`[^···]`
    

### ArrayBuffers和SharedArrayBuffers的新功能

ArrayBuffers 有两个新功能：

*   [resize](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_typed-arrays.html%23resizing-array-buffers "https://exploringjs.com/js/book/ch_typed-arrays.html#resizing-array-buffers")：重新调整大小（原来必须分配一个新的，并复制旧的）：
    
    ini
    
     代码解读
    
    复制代码
    
    ``const buf = new ArrayBuffer(2, {maxByteLength: 4}); // `typedArray` starts at offset 2 const typedArray = new Uint8Array(buf, 2); assert.equal(   typedArray.length, 0 ); buf.resize(4); assert.equal(   typedArray.length, 2 );``
    
*   [transfer](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_typed-arrays.html%23transferring-detaching-array-buffers "https://exploringjs.com/js/book/ch_typed-arrays.html#transferring-detaching-array-buffers")：转移比复制更快
    
    javascript
    
     代码解读
    
    复制代码
    
    ``async function validateAndWriteSafeAndFast(arrayBuffer) {   const owned = arrayBuffer.transfer();   // We have `owned` and no one can access its data via   // `arrayBuffer` now because the latter is detached:   assert.equal(     arrayBuffer.detached, true   );   // `await` pauses this function – which gives external   // code the opportunity to access `arrayBuffer`.   await validate(owned);   await fs.writeFile("data.bin", owned); }``
    

SharedArrayBuffers 可以调整大小，但只能增大而不能缩小。它们不可转移，因此无法获得该`.transfer()`方法`ArrayBuffers`。

### 确保字符串格式正确

两种新方法可以帮助我们确保字符串格式正确（相对于[UTF-16](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_unicode.html%23utf-16 "https://exploringjs.com/js/book/ch_unicode.html#utf-16")代码单元）：

*   [`isWellFormed()`](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_strings.html%23qref-String.prototype.isWellFormed "https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed")检查 JavaScript 字符串是否_格式正确_且不包含任何[**lone surrogate**](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_unicode.html%23unicode-lone-surrogate "https://exploringjs.com/js/book/ch_unicode.html#unicode-lone-surrogate")。
*   [`toWellFormed()`](https://link.juejin.cn?target=https%3A%2F%2Fexploringjs.com%2Fjs%2Fbook%2Fch_strings.html%23qref-String.prototype.isWellFormed "https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed")返回接收方的副本，其中每个单独的代理都被代码单元 0xFFFD 替换（表示具有相同数字的代码点，其名称为“替换字符”）。因此结果是格式正确的。

### `Atomics.waitAsync()`  [#](https://link.juejin.cn?target=https%3A%2F%2F2ality.com%2F2024%2F06%2Fecmascript-2024.html%23atomics.waitasync\(\) "https://2ality.com/2024/06/ecmascript-2024.html#atomics.waitasync()")

`Atomics.waitAsync()`让我们异步等待共享内存的更改。有关更多信息，请参阅[MDN Web 文档。](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FAtomics%2FwaitAsync "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync")