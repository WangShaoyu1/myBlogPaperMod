---
author: "冴羽"
title: "TypeScript 之模块"
date: 2021-12-09
description: "TypeScript4 最新官方文档 Modules 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:8,views:3739,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Module](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fmodules.html "https://www.typescriptlang.org/docs/handbook/2/modules.html")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

模块（Module）
----------

JavaScript 有一个很长的处理模块化代码的历史，TypeScript 从 2012 年开始跟进，现在已经实现支持了很多格式。不过随着时间流逝，社区和 JavaScript 规范已经收敛为名为 ES 模块（或者 ES6 模块）的格式，这也就是我们所知的 `import/export` 语法。

ES 模块在 2015 年被添加到 JavaScript 规范中，到 2020 年，大部分的 web 浏览器和 JavaScript 运行环境都已经广泛支持。

本章将覆盖讲解 ES 模块和和它之前流行的前身 CommonJS `module.exports =` 语法，你可以在 [Modules](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fmodules.html "https://www.typescriptlang.org/docs/handbook/modules.html") 章节找到其他的模块模式。

JavaScript 模块是如何被定义的（How JavaScript Modules are Defined）
--------------------------------------------------------

在 TypeScript 中，就像在 ECMAScript 2015 中 ，任何包含了一个顶层 `import` 或者 `export` 的文件会被认为是一个模块。​

相对应的，一个没有顶层导入和导出声明的文件会被认为是一个脚本，它的内容会在全局范围内可用。

模块会在它自己的作用域，而不是在全局作用域里执行。这意味着，在一个模块中声明的变量、函数、类等，对于模块之外的代码都是不可见的，除非你显示的导出这些值。

相对应的，要消费一个从另一个的模块导出的值、函数、类、接口等，也需要使用导入的格式先被导入。

非模块（Non-modules）
----------------

在我们开始之前，我们需要先理解 TypeScript 认为什么是一个模块。JavaScript 规范声明任何没有 `export` 或者顶层 `await` 的 JavaScript 文件都应该被认为是一个脚本，而非一个模块。

在一个脚本文件中，变量和类型会被声明在共享的全局作用域，它会被假定你或者使用 [outFile](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23outFile "https://www.typescriptlang.org/tsconfig#outFile") 编译选项，将多个输入文件合并成一个输出文件，或者在 HTML使用多个 `<script>` 标签加载这些文件。

如果你有一个文件，现在没有任何 `import` 或者 `export`，但是你希望它被作为模块处理，添加这行代码：

```typescript
export {};
```

这会把文件改成一个没有导出任何内容的模块，这个语法可以生效，无论你的模块目标是什么。

TypeScript 中的模块（Modules in TypeScript）
--------------------------------------

在 TypeScript 中，当写一个基于模块的代码时，有三个主要的事情需要考虑：

*   语法：我想导出或者导入该用什么语法？
*   模块解析：模块名字（或路径）和硬盘文件之间的关系是什么样的？
*   模块导出目标：导出的 JavaScript 模块长什么样？

### ES 模块语法（ES Module Syntax）

一个文件可以通过 `export default` 声明一个主要的导出：

```typescript
// @filename: hello.ts
    export default function helloWorld() {
    console.log("Hello, world!");
}
```

然后用这种方式导入：

```typescript
import hello from "./hello.js";
hello();
```

除了默认导出，你可以通过省略 `default` 的 `export` 语法导出不止一个变量和函数：

```typescript
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

    export function absolute(num: number) {
    if (num < 0) return num * -1;
    return num;
}
```

这些可以在其他的文件通过 `import` 语法引入：

```typescript
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
// const absPhi: number
```

### 附加导入语法（Additional Import Syntax）

一个导入也可以使用类似于 `import {old as new}` 的格式被重命名：

```typescript
import { pi as π } from "./maths.js";

console.log(π);
// (alias) var π: number
// import π
```

你可以混合使用上面的语法，写成一个单独的 `import` ：

```typescript
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RNGen, { pi as π } from "./maths.js";

RNGen;

(alias) class RNGen
import RNGen

console.log(π);
// (alias) const π: 3.14
// import π
```

你可以接受所有的导出对象，然后使用 `* as name` 把它们放入一个单独的命名空间：

```typescript
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);

// const positivePhi: number
```

你可以通过 `import "./file"` 导入一个文件，这不会引用任何变量到你当前模块：

```typescript
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

在这个例子中， `import` 什么也没干，然而，`math.ts` 的所有代码都会执行，触发一些影响其他对象的副作用（side-effects）。

### TypeScript 具体的 ES 模块语法（TypeScript Specific ES Module Syntax）

类型可以像 JavaScript 值那样，使用相同的语法被导出和导入：

```typescript
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

    export interface Dog {
    breeds: string[];
    yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript 已经在两个方面拓展了 `import` 语法，方便类型导入：

#### 导入类型（import type）

```typescript
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
// 'createCatName' cannot be used as a value because it was imported using 'import type'.
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```

#### 内置类型导入（Inline type imports）

TypeScript 4.5 也允许单独的导入，你需要使用 `type` 前缀 ，表明被导入的是一个类型：

```typescript
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

这些可以让一个非 TypeScript 编译器比如 Babel、swc 或者 esbuild 知道什么样的导入可以被安全移除。

导入类型和内置类型导入的区别在于一个是导入语法，一个是仅仅导入类型。

#### 有 CommonJS 行为的 ES 模块语法（ES Module Syntax with CommonJS Behavior）

TypeScript 之所以有 ES 模块语法跟 CommonJS 和 AMD 的 `required` 有很大的关系。使用 ES 模块语法的导入跟 `require` 一样都可以处理绝大部分的情况，但是这个语法能确保你在有 CommonJS 输出的 TypeScript 文件里，有一个 1 对 1 的匹配：

```typescript
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

你可以在[模块引用页面](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fmodules.html%23export--and-import--require "https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require")了解到关于这个语法更多的信息。

CommonJS 语法（CommonJS Syntax）
----------------------------

CommonJS 是 npm 大部分模块的格式。即使你正在写 ES 模块语法，了解一下 CommonJS 语法的工作原理也会帮助你调试更容易。

### 导出（Exporting）

通过设置全局 `module` 的 `exports` 属性，导出标识符。

```typescript
    function absolute(num: number) {
    if (num < 0) return num * -1;
    return num;
}

    module.exports = {
    pi: 3.14,
    squareTwo: 1.41,
    phi: 1.61,
    absolute,
    };
```

这些文件可以通过一个 `require` 语句导入：

```typescript
const maths = require("maths");
maths.pi;
// any
```

你可以使用 JavaScript 的解构语法简化一点代码：

```typescript
const { squareTwo } = require("maths");
squareTwo;
// const squareTwo: any
```

### CommonJS 和 ES 模块互操作（CommonJS and ES Modules interop）

因为默认导出和模块声明空间对象导出的差异，CommonJS 和 ES 模块不是很合适一起使用。TypeScript 有一个 [esModuleInterop](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23esModuleInterop "https://www.typescriptlang.org/tsconfig#esModuleInterop") 编译选项可以减少两种规范之间的冲突。

TypeScript 模块解析选项（TypeScript’s Module Resolution Options）
---------------------------------------------------------

模块解析是从 `import` 或者 `require` 语句中取出字符串，然后决定字符指向的是哪个文件的过程。

TypeScript 包含两个解析策略：Classic 和 Node。Classic，当编译选项 [module](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23module "https://www.typescriptlang.org/tsconfig#module") 不是 `commonjs` 时的默认选择，包含了向后兼容。Node 策略则复制了 CommonJS 模式下 Nodejs 的运行方式，会对 `.ts` 和 `.d.ts` 有额外的检查。

这里有很多 TSConfig 标志可以影响 TypeScript 的模块策略：[moduleResolution](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23moduleResolution "https://www.typescriptlang.org/tsconfig#moduleResolution"), [baseUrl](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23baseUrl "https://www.typescriptlang.org/tsconfig#baseUrl"), [paths](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23paths "https://www.typescriptlang.org/tsconfig#paths"), [rootDirs](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23rootDirs "https://www.typescriptlang.org/tsconfig#rootDirs")。

关于这些策略工作的完整细节，你可以参考 [Module Resolution](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fmodule-resolution.html "https://www.typescriptlang.org/docs/handbook/module-resolution.html")。

TypeScript 模块输出选项（TypeScript’s Module Output Options）
-----------------------------------------------------

有两个选项可以影响 JavaScript 输出的文件：

*   [target](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23target "https://www.typescriptlang.org/tsconfig#target") 决定了哪些 JS 特性会被降级（被转换成可以在更老的 JavaScript 运行环境使用），哪些则完整保留。
*   [module](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23module "https://www.typescriptlang.org/tsconfig#module") 决定了转换后代码采用的模块规范

你使用哪个 [target](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23target "https://www.typescriptlang.org/tsconfig#target") 取决于你期望代码运行的环境。这些可以是：你需要支持的最老的浏览器，你期望代码运行的最老的 Nodejs 版本，或者一些独特的运行环境比如 Electron 等。

编译选项 [module](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23module "https://www.typescriptlang.org/tsconfig#module") 决定了模块之间通信使用哪一种规范。在运行时，模块加载器会在执行模块之前，查找并执行这个模块所有的依赖。

举个例子，这是一个使用 ES Module 语法的 TypeScript 文件，展示了 [module](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23module "https://www.typescriptlang.org/tsconfig#module") 选项不同导致的编译结果：

```typescript
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

### ES2020

```typescript
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
```

### CommonJS

```typescript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;
```

### UMD

```typescript
    (function (factory) {
        if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
        else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants.js"], factory);
    }
        })(function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.twoPi = void 0;
        const constants_js_1 = require("./constants.js");
        exports.twoPi = constants_js_1.valueOfPi * 2;
        });
```

> 注意 ES2020 已经跟原始的 index.ts 文件相同了。

你可以在 [TSConfig 模块](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23module "https://www.typescriptlang.org/tsconfig#module")页面看到所有可用的选项和它们对应编译后的 JavaScript 代码长什么样。

TypeScript 命名空间（TypeScript namespaces）
--------------------------------------

TypeScript 有它自己的模块格式，名为 `namespaces` 。它在 ES 模块标准之前出现。这个语法有一系列的特性，可以用来创建复杂的定义文件，现在依然可以在 [DefinitelyTyped](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdt "https://www.typescriptlang.org/dt") 看到。当没有被废弃的时候，命名空间主要的特性都还存在于 ES 模块，我们推荐你对齐 JavaScript 方向使用。你可以在[命名空间页面](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fnamespaces.html "https://www.typescriptlang.org/docs/handbook/namespaces.html")了解更多。

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。