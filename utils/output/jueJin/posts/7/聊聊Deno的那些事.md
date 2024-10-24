---
author: "政采云技术"
title: "聊聊Deno的那些事"
date: 2021-05-12
description: "Deno 是什么 Deno 是一个简单、现代、安全的 JavaScript、TypeScript、Webassembly 运行时环境。 它是建立在： Rust（Deno 的底层是用 Rust 开发，而"
tags: ["前端","deno中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:136,comments:0,collects:66,views:11311,"
---
![](/images/jueJin/70ccf0585fc94af.png)

> 这是第 99 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[聊聊Deno的那些事](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Ftalk-about-deno "https://zoo.team/article/talk-about-deno")

![七彩.png](/images/jueJin/067ff757920d4a6.png)

Deno 是什么
========

![deno1](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Deno 是一个简单、现代、安全的 [JavaScript](https://link.juejin.cn?target=https%3A%2F%2Fwww.javascript.com%2F "https://www.javascript.com/")、[TypeScript](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2F "https://www.typescriptlang.org/")、[Webassembly](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.org%2F "https://webassembly.org/") 运行时环境。

> Deno 是 Node 的变位词，其发音是恐龙（dinosaur）的缩写读音"蒂诺"。

它是建立在：

*   [Rust](https://link.juejin.cn?target=https%3A%2F%2Fwww.rust-lang.org%2Fzh-CN%2F "https://www.rust-lang.org/zh-CN/")（Deno 的底层是用 Rust 开发，而 Node 是用 C++）
*   [Tokio](https://link.juejin.cn?target=https%3A%2F%2Ftokio-zh.github.io%2F "https://tokio-zh.github.io/")（Deno 的事件机制是基于 Tokio，而 Node 是基于 libuv）
*   [TypeScript](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2F "https://www.typescriptlang.org/")
*   [V8](https://link.juejin.cn?target=https%3A%2F%2Fv8.dev%2F "https://v8.dev/")

Deno 的背景
========

![deno演讲.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Deno 起源于 Node 的创建者 **Ryan Dahl**，这也是大家对 Deno 项目充满期待的原因之一。在 JSConfEu 上，**Dahl** 在他的的[演讲](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DM3BM9TB-8yA%26vl%3Den "https://www.youtube.com/watch?v=M3BM9TB-8yA&vl=en")中说出了自己对 Node 中存在的一些缺陷，并解释了如何围绕 Node 的架构做出更好的决定，在演讲的最后，宣布了 Deno 的第一个原型，并承诺构建一个更好、更安全的运行时环境。

Node 的缺陷
========

原生 API 缺少 Promise
-----------------

Node 最大的亮点在于事件驱动， 非阻塞 I/O 模型，这使得 Node 具有很强的并发处理能力，非常适合编写网络应用。在 Node 中大部分的 I/O 操作几乎都是异步的，于是乎 Callback Hell 产生了:

```javascript
// fs.js
const fs = require('fs');
const myFile = '/tmp/test';

    fs.readFile(myFile, 'utf8', (err, txt) => {
        if (!err) {
        fs.writeFile(myFile);
    }
    });
```

若要实现链式调用，你需要使用 Promise 重新包装下原生 API，如下所示：

```javascript
const fs = require("fs");
const myFile = '/tmp/test';

    function readFile_promise(path) {
        return new Promise((resolve, reject) => {
            fs.readfile(path, "utf-8", (err, data) => {
                if (err) {
                reject(err);
                    } else {
                    resolve(data);
                }
                })
                });
            }
            
            readFile_promise(myFile)
                .then((res) => {
                fs.writeFile(myFile, res);
                })
```

缺少安全性
-----

在 Node 中，可以调用 fs.chmod 来修改文件或目录的读写权限。说明 Node 运行时的权限是很高的。如果你在 Node 中导入一份不受信任的软件包，那么很可能它将删除你计算机上的所有文件，所以说 Node 缺少安全模块化运行时。除非手动提供一个沙箱环境，诸如 Docker 这类的容器环境来解决安全性问题。

```javascript
const fs = require('fs');
//删除hello.txt
fs.unlinkSync('./hello.txt');
// 删除css文件夹
fs.rmdirSync('./css');
```

构建系统与 Chrome 存在差异
-----------------

![v8编译.png](/images/jueJin/524c9f24d50e4c7.png)

首先我们需要了解构建系统是啥？

写惯前端的童鞋可能不是很明白这个东西是干啥用的？但是其实平时你都会接触到，只是概念不同而已。前端我们一般称其为打包构建，类似工具诸如 webpack、rollup、parcel 做的事情。它们最后的目标其实都是想得到一些目标性的文件，这里我们的目标是[编译 V8](https://link.juejin.cn?target=https%3A%2F%2Fv8.dev%2Fdocs%2Fbuild-gn "https://v8.dev/docs/build-gn") 代码。

Node 的 V8 构建系统是 [GYP](https://link.juejin.cn?target=https%3A%2F%2Fgyp.gsrc.io%2F "https://gyp.gsrc.io/")（Generate Your Projects），而 Chrome 的 V8 已升级为 [GN](https://link.juejin.cn?target=https%3A%2F%2Fchromium.googlesource.com%2Fchromium%2Fsrc%2Ftools%2Fgn%2F%2B%2F48062805e19b4697c5fbd926dc649c78b6aaa138%2FREADME.md "https://chromium.googlesource.com/chromium/src/tools/gn/+/48062805e19b4697c5fbd926dc649c78b6aaa138/README.md")（Generate Ninja）。我们知道 V8 是由 Google 开发的，这也证明 Node 和 Google 的亲儿子 Chrome 渐行渐远，而且 GN 的构建速度比 GYP 快20倍，因为 GN 是用 C++ 编写，比起用 python 写的 GYP 快了很多。但是 Node 底层架构已无法挽回。

复杂的包管理模式
--------

![deno模块太阳.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Node 自带的 NPM 生态系统中，由于严重依赖语义版本控制和复杂的依赖关系图，少不了要与 package.json、node\_modules 打交道。node\_modules 的设计虽然能满足大部分的场景，但是其仍然存在着种种缺陷，尤其在前端工程化领域，造成了不少的问题。特别是不同包依赖版本不一致时，各种问题接踵而来，于是乎 yarn lock、npm lock 闪亮登场。

然而还是有很多场景是 lock 无法覆盖的，比如当我们第一次安装某个依赖的时候，此时即使第三方库里含有 lock 文件，但是 npm install|、yarn install 也不会去读取第三方依赖的 lock，这导致第一次创建项目的时候，还是会可能会触发 bug。而且由于交叉依赖，node\_modules 里充满了各种重复版本的包，造成了极大的空间浪费，也导致 install 依赖包很慢，以及 require 读取文件的算法越来越复杂化。

读取文件复杂化
-------

Node 使用 [require](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fmodules.html%23modules_all_together "https://nodejs.org/api/modules.html#modules_all_together") 引用其他脚本文件，其内部逻辑如下：

```javascript
当 Node 遇到 require(X) 时，按下面的顺序处理。
（1）如果 X 是内置模块（比如 require('http'）)
a. 返回该模块。
b. 不再继续执行。

（2）如果 X 以 "./" 或者 "/" 或者 "../" 开头
a. 根据 X 所在的父模块，确定 X 的绝对路径。
b. 将 X 当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
X
X.js
X.json
X.node
c. 将 X 当成目录，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
X/package.json（main字段）
X/index.js
X/index.json
X/index.node

（3）如果 X 不带路径
a. 根据 X 所在的父模块，确定 X 可能的安装目录。
b. 依次在每个目录中，将 X 当成文件名或目录名加载。

（4） 抛出 "not found"
```

可以看得出来，require 的读取逻辑是很复杂的，虽然用起来很可爱，但是没必要。

Deno 的架构
========

![deno源码.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

1.  Deno 以 Rust 作为启动入口，通过 Rust FFI 去执行 C++ 代码，然后在 C++ 中引入 V8 实例。
    
2.  初始化 V8 对象以及注入外部 C++ 方法，例如 send、recv 等方法。
    
3.  向 V8 全局作用域下注入 Deno 对象，暴露 Deno 的一些基本 API 给 JavaScript。
    
4.  通过绑定在 V8 上的 C++ 方法，调用对应的 Rust 方法，去执行底层逻辑。
    

不难发现 Deno 其实和 RN、Flutter 这些框架很类似，因为它本质上也是跑了个 JS 引擎，只是这个 JS 引擎是 V8，不负责 UI 的 binding 而已。所以说架构的本质就是思路复刻、模块重组。

Deno 的特点
========

安全
--

![deno-sec.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

与 Node 相反，Deno 默认在沙箱中执行代码，这意味着运行时无法访问以下权限：

*   文件系统
*   网络
*   环境变量

你可以通过命令行参数形式来开启默认关闭的权限，类似下面这样：

```javascript
// 授予从磁盘读取和侦听网络的权限
deno run --allow-read --allow-net https://deno.land/std/http/file_server.ts

// 授予从磁盘filepath读取白名单文件的权限
deno run --allow-read=/etc https://deno.land/std/http/file_server.ts

// 授予所有权限
deno run --allow-all https://deno.land/std/http/file_server.ts

```

或者通过编程形式控制权限，类似下面这样：

```javascript
// 检测是否有读取权限
const status = await Deno.permissions.query({ name: "write" });
    if (status.state !== "granted") {
    throw new Error("need write permission");
}

// 读取log文件
const log = await Deno.open("request.log", "a+");

// 关闭读写权限
await Deno.permissions.revoke({ name: "read" });
await Deno.permissions.revoke({ name: "write" });

// 打印log内容
const encoder = new TextEncoder();
await log.write(encoder.encode("hello\n"));
```

内置工具
----

![deno恐龙标志](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Deno 目前提供了以下内置工具，在使用 JavaScript 和 TypeScript 时非常有用，只需要执行以下命令即可:

*   [deno bundler](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fbundler "https://deno.land/manual@v1.8.3/tools/bundler") (自带打包和 tree shaking功能，可以将我们的代码打包成单文件)
*   [deno compile](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fcompiler "https://deno.land/manual@v1.8.3/tools/compiler") (将 Deno 项目构建为完全独立的可执行文件)
*   [deno installe](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fscript_installer "https://deno.land/manual@v1.8.3/tools/script_installer") (可以将我们的代码生成可执行文件进行直接使用)
*   [deno info](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fdependency_inspector "https://deno.land/manual@v1.8.3/tools/dependency_inspector") (查看所有模块的依赖关系树)
*   [deno doc](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fdocumentation_generator "https://deno.land/manual@v1.8.3/tools/documentation_generator") (将源代码中的注释生成文档)
*   [deno fmt](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Fformatter "https://deno.land/manual@v1.8.3/tools/formatter") (递归地格式化每个子目录中的每个文件)
*   [deno repl](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Frepl "https://deno.land/manual@v1.8.3/tools/repl") (启动一个 read-eval-print-loop，它允许您在全局上下文中交互式地构建程序状态)
*   [deno test](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftesting "https://deno.land/manual@v1.8.3/testing") (对名为 .test 的文件进行单元测试)
*   [deno lint](https://link.juejin.cn?target=https%3A%2F%2Fdeno.land%2Fmanual%40v1.8.3%2Ftools%2Flinter "https://deno.land/manual@v1.8.3/tools/linter") (代码检测器)

支持 TyprScript
-------------

![tsbanner.jpeg](/images/jueJin/570fe1b9ef54468.png)

使用 Deno 运行 TypeScript 代码不需要编译步骤以及繁琐的配置文件—— Deno 会自动为你执行这一步骤。

[源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdenoland%2Fdeno%2Ftree%2Fmain%2Fcli%2Ftsc "https://github.com/denoland/deno/tree/main/cli/tsc")中我们发现，Deno 其实是集成了一个 TypeScript 编译器和一个用于运行时快照的小型编译器主机。转换的[核心代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdenoland%2Fdeno%2Fblob%2Fmain%2Fcli%2Ftsc.rs "https://github.com/denoland/deno/blob/main/cli/tsc.rs")如下：

```javascript
// globalThis.exec 这个函数在/cli/tsc/99_main_compiler.js中
// 其主要作用就是把TypeScript转换成JavaScript
let exec_source = format!("globalThis.exec({})", request_str);

runtime
.execute("[native code]", startup_source)
.context("Could not properly start the compiler runtime.")?;
runtime.execute("[native_code]", &exec_source)?;
```

前段时间 Deno 内部把 TS 改回 JS 的讨论很是热闹，但并不意味着 Deno 放弃了 TypeScript，它依然是一个安全的 TS/JS Runtime。

例如：

```javascript
// index.ts
const str: string = 'hello word';
console.log(str);
```

你可以直接在命令行运行并打印出 hello word：

```javascript
deno run index.ts
```

支持 ES 模块标准
----------

Deno 采用的是 ES Module 的浏览器实现。[ES Module](https://link.juejin.cn?target=https%3A%2F%2Fhacks.mozilla.org%2F2018%2F03%2Fes-modules-a-cartoon-deep-dive%2F "https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/") 大家应该都是比较熟悉的，它是 JavaScript 官方的标准化模块系统，其浏览器实现如下所示：

```javascript
// 从 URL 导入import React from "https://cdn.bootcdn.net/ajax/libs/react/17.0.1/cjs/react-jsx-dev-runtime.development.js";// 从相对路径导入import * as Api from "./service.js";// 从绝对路径导入import "/index.js";
```

需要注意的是，Deno 不支持以下写法：

```javascript
import foo from "foo.js";import bar from "bar/index.js";import zoo from "./index"; // 没有后缀
```

兼容浏览器 API
---------

![chromebanner.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Deno 通过与浏览器 API 保持一致，来减少大家的认知。

*   模块系统：从上面的介绍看出 Deno 是完全遵循浏览器实现的。
*   默认安全
*   对于异步操作返回 Promise
*   使用 ArrayBuffer 处理二进制
*   存在 window 全局变量
*   支持 fetch、webCrypto、worker 等 Web 标准，也支持 onload、onunload、addEventListener 等事件操作函数

```javascript
console.log(window === this, window === self, window === globalThis); // true true true
```

支持 Promise
----------

![promisebanner.png](/images/jueJin/5b1c580078514bb.png)

Deno 所有的异步操作，一律返回 Promise，并且全局支持 await。

```javascript
// 读取异步接口数据const response = await fetch("http://my.json.host/data.json");console.log(response.status)console.log(response.statusText);const jsonData = await response.json();// 读取文件const decoder = new TextDecoder("utf-8");const data = await Deno.readFile("hello.txt");console.log(decoder.decode(data));
```

去中心化包
-----

Deno 没有 package.json、node\_modules，那么它是怎么进行包管理的呢？我们先看下面的例子：

```javascript
// index.jsimport { white, bgRed } from "https://deno.land/std/fmt/colors.ts";console.log(bgRed(white("hello world!")));// 命令行执行> deno run index.jsDownload https://deno.land/std/fmt/colors.tsCompile https://deno.land/std/fmt/colors.tshello world!
```

我们看到执行时会有 `Download` 和 `Compile` 两个步骤，于是乎我们会产生几个疑问：

**1、每次执行都要下载吗？**

答：不需要每次下载，有缓存机制。

```javascript
> deno run index.jshello world!
```

**2、Download 和 Compile 的文件在哪里呢？**

答：我们可以通过上面介绍的自带工具 deno info 来查看依赖关系。

```javascript
> deno info index.jslocal: /Users/xxx/Desktop/index.tstype: TypeScriptemit: /Users/xxx/Library/Caches/deno/gen/file/Users/xxx/Desktop/index.ts.jsdependencies: 0 unique (total 41B)file:///Users/xxx/Desktop/index.ts (41B)
```

**3、依赖代码更新了怎么办？**

答：当依赖模块更新时，我们可以通过 `--reload` 进行更新缓存，例如：

```javascript
> deno run --reload index.js// 通过白名单的方式更新部分依赖> deno run --reload=https://deno.land index.js
```

**4、多版本怎么处理？**

答：暂时没有好的解决方案，只能通过 git tag 的方式区分版本。

Deno 是通过 URL 导入代码，可以在互联网上的任何地方托管模块。并且相比 Node 的 require 读取文件，它显得更加轻巧玲珑，并且无需集中注册表即可分发 Deno 软件包。不需要 package.json 文件和依赖项列表，因为所有模块都是在应用程序运行时下载，编译和缓存的。

上手 Deno
=======

安装
--

使用 Shell (macOS 和 Linux):

```ruby
curl -fsSL https://deno.land/x/install/install.sh | sh

```

使用 PowerShell (Windows):

```ruby
iwr https://deno.land/x/install/install.ps1 -useb | iex

```

运行 **deno --version**，如果它打印出 Deno 版本，说明安装成功。

```javascript
> deno --versiondeno 1.8.1 (release, aarch64-apple-darwin)v8 9.0.257.3typescript 4.2.2
```

实战体验
----

![deno-getting-started.jpeg](/images/jueJin/ca1684a9023d40e.png)

### Hello Word

本地创建一个 index.ts 文件，内容如下所示：

```javascript
// index.tsconsole.log("Welcome to Deno 🦕");
```

打开终端，输入以下命令行：

```javascript
> deno run index.ts
```

以上输出 "Welcome to Deno 🦕"。

### HTTP 请求

本地创建一个 http.ts 文件，内容如下所示：

```javascript
const url = Deno.args[0]; // 取得第一个命令行参数，存储到变量 url。const res = await fetch(url); // 向指定的地址发出请求，等待响应，然后存储到变量 res。const body = new Uint8Array(await res.arrayBuffer()); // 把响应体解析为一个 ArrayBuffer，等待接收完毕，将其转换为 Uint8Array，最后存储到变量 body。await Deno.stdout.write(body); // 把 body 的内容写入标准输出流 stdout。
```

打开终端，输入以下命令行：

```javascript
deno run --allow-net=api.github.com http.ts https://api.github.com/users/answer518
```

以上输出 json 对象。

### 远程导入

从远程模块导入 **add** 和 **multiply** 方法：

```javascript
import {  add,  multiply,} from "https://x.nest.land/ramda@0.27.0/source/index.js";function totalCost(outbound: number, inbound: number, tax: number): number {  return multiply(add(outbound, inbound), tax);}console.log(totalCost(19, 31, 1.2)); // 60console.log(totalCost(45, 27, 1.15)); // 82.8
```

### 支持 WASM

```javascript
// wasm.tsconst wasmCode = new Uint8Array([  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,  65, 42, 11]);const wasmModule = new WebAssembly.Module(wasmCode);const wasmInstance = new WebAssembly.Instance(wasmModule);const main = wasmInstance.exports.main as CallableFunction;console.log(main().toString());
```

打开终端，输入以下命令行：

```javascript
> deno run wasm.ts
```

以上输出数字42。

### RESTful 服务

```javascript
// restful.tsimport { Application, Router } from "https://deno.land/x/oak/mod.ts";const books = new Map<string, any>();books.set("1", {  id: "1",  title: "平凡的世界",  author: "路遥",});const router = new Router();router  .get("/", (context) => {    context.response.body = "Hello world!";  })  .get("/book", (context) => {    context.response.body = Array.from(books.values());  })  .get("/book/:id", (context) => {    if (context.params && context.params.id && books.has(context.params.id)) {      context.response.body = books.get(context.params.id);    }  });const app = new Application();app.use(router.routes());app.use(router.allowedMethods());await app.listen({ hostname: '127.0.0.1', port: 8000 });
```

终端输入以下命令：

```javascript
> deno run  --allow-net restful.ts
```

本地访问 [http://localhost:8000/book/1](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8000%2Fbook%2F1 "http://localhost:8000/book/1") 将会返回id为1的book数据。

### 静态资源服务

```javascript
// static.tsimport { Application } from "https://deno.land/x/oak/mod.ts";const app = new Application();app.use(async (context) => {  await context.send({    root: Deno.cwd(), // 静态资源的根路径  });});await app.listen({ hostname: "127.0.0.1", port: 8000 });
```

终端输入以下命令：

```javascript
> deno run  --allow-net --allow-read static.ts
```

本地访问 [http://localhost:8000/static.ts](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8000%2Fstatic.ts "http://localhost:8000/static.ts") 将会返回 static.ts 的源码。

结束语
===

Deno 是一个非常伟大的项目，但却不是 **“下一代 Nods.js ”**。Ryan Dahl 自己也说： **“Node.js isn't going anywhere”** 。并且 Deno 还处在开发中，功能还不稳定，不建议用于生产环境。但是，它已经是一个可用的工具，有很多新特性都是 Node 所没有的，大家可以多多试玩。

推荐阅读
----

[数据可视化探索之 SpreadJS](https://juejin.cn/post/6955998176549535758 "https://juejin.cn/post/6955998176549535758")

[H5 页面列表缓存方案](https://juejin.cn/post/6948210854126944292 "https://juejin.cn/post/6948210854126944292")

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/ff91eb605a84431.png)