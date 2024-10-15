---
author: "王宇"
title: "对比js和wasm的md5执行速度"
date: 三月01,2024
description: "WebAssembly"
tags: ["WebAssembly"]
ShowReadingTime: "12s"
weight: 547
---
本文直接跑代码，没进行基准测试

  

首先，得编译成wasm（裸写wasm基本不可能），我选择用rust，那得安装rust相关环境和配套工具，自行安装，注意版本

  

安装打包工具

[?](#)

`cargo install wasm-pack`

  

失败的话查看rust版本

rustc -V

  

不兼容的话升级，完毕后再安装wasm-pack

rustup update

  

  

rust部分

[?](#)

`#[wasm_bindgen]`

`pub fn digest(str: &str) -> String {`

    `let digest = md5::compute(str);`

    `let res = format!(``"{:x}"``, digest);`

    `res`

`}`

  

执行部分

[?](#)

`<``script` `type``=``"module"``>`

    `import init, { greet, digest } from './pkg/wasm_demo.js';`

    `import './node_modules/js-md5/src/md5.js'`

    `function runManyTimes(func, times = 1000000) {`

        `for(let i = 0; i <` `times``; i++) {`

            `func('xxx')`

        `}`

    `}`

    `async function run_wasm() {`

          `await init();`

        `//   greet();`

        `console.time('wasm')`

        `runManyTimes(digest)`

        `console.timeEnd('wasm')`

      `}`

      `run_wasm()`

      `console.time('js')`

      `runManyTimes(md5)`

      `console.timeEnd('js')`

`</script>`

  

1000000次执行对比

  

方式

xxx

xxxxx

xxxxxxxx

xxxxxxxxxxxx

1234567890

今天星期几啊123abc

  

  

方式

xxx

xxxxx

xxxxxxxx

xxxxxxxxxxxx

1234567890

今天星期几啊123abc

  

  

wasm

1124.492919921875 ms

1088.14111328125 ms

1134.912109375 ms

1209.14013671875 ms

1177.028076171875 ms

1319.912109375 ms

  

  

js

9462.156982421875 ms

9579.87109375 ms

11974.6240234375 ms

10264.001220703125 ms

10486.0810546875 ms

11240.406982421875 ms

  

  

  

  

  

wasm里还包括实例化代码的阶段，这里还未算上，1000次执行init花费796.4951171875 ms

  

然而，发现次数不多的时候，**有时候**wasm执行比js快一点

1000次对比

![](/download/attachments/119675434/image2024-2-19_11-7-45.png?version=1&modificationDate=1708312065156&api=v2)

  

GPT结论：
------

  
Rust生成的WebAssembly（Wasm）在性能方面通常很有优势，因为它比JavaScript更接近机器码，能够提供更低层次的控制和更优化的性能。然而，在某些情况下，使用Rust编写的Wasm运行得比纯JavaScript版本慢，原因可能是多方面的：

1\. \*\*初始化开销\*\*： 调用Wasm模块前需要先加载和初始化Wasm代码。如果你在测量性能时包括了这部分开销，那么比较结果可能会对Wasm不利。

2\. \*\*交互开销\*\*： JavaScript与Wasm之间的交互有时可能会很慢。数据在JS和Wasm模块之间的传递需要通过共享的线性内存，这可能会造成额外开销。

3\. \*\*冷启动\*\*： 第一次调用Wasm函数可能会有冷启动的延迟。如果Wasm代码被分割成多个小功能，并且经常只调用少数几个，则每次调用可能都会有这种延迟。

4\. \*\*浏览器优化\*\*： 现代浏览器对JavaScript有高度优化，尤其是对于像MD5这类常见的算法。而Wasm可能没有与此相同的优化级别。

5\. \*\*代码编译与优化\*\*： Rust编译器（rustc）及其Wasm后端可能没有为特定的Wasm目标生成最优代码。而JavaScript引擎会即时编译（JIT）和优化JavaScript代码。

6\. \*\*算法实现\*\*： Rust实现的算法可能不如现有的JavaScript库优化。JavaScript的MD5库可能经过多年优化，提供了针对JS引擎高度优化的代码。

  

为了确定原因并优化性能，你可以：

\- 确保对比测试专注于算法执行时间，排除加载与初始化Wasm的时间。

\- 使用浏览器的性能分析工具来理解时间的消耗。

\- 优化Rust到Wasm编译的配置，并确保启用了最高的优化级别。

\- 减少JS与Wasm之间的数据交互次数。

\- 评估在Rust中是否可以优化MD5算法的实现。

\- 检查是否使用了最新的Rust Wasm工具链，确保各种性能优化都是最新的。

如果上述尝试都无法提升性能，可能就是目前的Wasm实现和浏览器的限制。随着WebAssembly的发展，这些问题可能会减少，同时浏览器对Wasm的支持也会进一步优化。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)