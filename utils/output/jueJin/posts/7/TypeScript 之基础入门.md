---
author: "冴羽"
title: "TypeScript 之基础入门"
date: 2021-11-30
description: "TypeScript4 最新官方文档 The Basic 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:14,views:2337,"
---
前言
--

TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

本篇整理自 TypeScript Handbook 中 「[The Basics](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fbasic-types.html "https://www.typescriptlang.org/docs/handbook/2/basic-types.html")」 章节。

本文并不严格按照原文翻译，对部分内容也做了解释补充。

正文
--

JavaScript 的每个值执行不同的操作时会有不同的行为。这听起来有点抽象，所以让我们举个例子，假设我们有一个名为 `message` 的变量，试想我们可以做哪些操作：

```typescript
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();
// Calling 'message'
message();
```

第一行代码是获取属性 `toLowerCase` ，然后调用它。第二行代码则是直接调用 `message` 。

但其实我们连 `message` 的值都不知道呢，自然也不知道这段代码的执行结果。每一个操作行为都先取决于我们有什么样的值。

*   `message` 是可调用的吗？
*   `message` 有一个名为 `toLowerCase` 的属性吗？
*   如果有，`toLowerCase` 是可以被调用的吗？
*   如果这些值都可以被调用，它们会返回什么？

当我们写 JavaScript 的时候，这些问题的答案我们需要谨记在心，同时还要期望处理好所有的细节。

让我们假设 `message` 是这样定义的：

```typescript
const message = "Hello World!";
```

你完全可以猜到这段代码的结果，如果我们尝试运行 `message.toLowerCase()` ，我们可以得到这段字符的小写形式。

那第二段代码呢？如果你对 JavaScript 比较熟悉，你肯定知道会报如下错误：

```typescript
TypeError: message is not a function
```

如果我们能避免这样的报错就好了。

当我们运行代码的时候，JavaScript 会在运行时先算出值的类型（type），然后再决定干什么。所谓值的类型，也包括了这个值有什么行为和能力。当然 `TypeError` 也会暗示性的告诉我们一点，比如在这个例子里，它告诉我们字符串 `Hello World` 不能作为函数被调用。

对于一些值，比如基本值 `string` 和 `number`，我们可以使用 `typeof` 运算符确认他们的类型。但是对于其他的比如函数，就没有对应的方法可以确认他们的类型了，举个例子，思考这个函数：

```typescript
    function fn(x) {
    return x.flip();
}
```

我们通过阅读代码可以知道，函数只有被传入一个拥有可调用的 `flip` 属性的对象，才会正常执行。但是 JavaScript 在代码执行时，并不会把这个信息体现出来。在 JavaScript 中，唯一可以知道 `fn` 在被传入特殊的值时会发生什么，就是调用它，然后看会发生什么。这种行为让你很难在代码运行前就预测代码执行结果，这也意味着当你写代码的时候，你会更难知道你的代码会发生什么。

从这个角度来看，类型就是描述什么样的值可以被传递给 `fn`，什么样的值则会导致崩溃。JavaScript 仅仅提供了动态类型（dynamic typing），这需要你先运行代码然后再看会发生什么。

替代方案就是使用静态类型系统（static type system），在代码运行之前就预测需要什么样的代码。

静态类型检查（Static type-checking）
----------------------------

让我们再回想下这个将 `string` 作为函数进行调用而产生的 `TypeError` ，大部分的人并不喜欢在运行代码的时候得到报错。这些会被认为是 bug。当我们写新代码的时候，我们也尽力避免产生新的 bug。

如果我们添加一点代码，保存文件，然后重新运行代码，就能立刻看到错误，我们可以很快的定位到问题，但也并不总是这样，比如如果我们没有做充分的测试，我们就遇不到可能出错的情况。或者如果我们足够幸运看到了这个错误，我们也许不得不做一个大的重构，然后添加很多不同的代码，才能找出问题所在。

理想情况下，我们应该有一个工具可以帮助我们，在代码运行之前就找到错误。这就是静态类型检查器比如 TypeScript 做的事情。静态类型系统（Static types systems）描述了值应有的结构和行为。一个像 TypeScript 的类型检查器会利用这个信息，并且在可能会出错的时候告诉我们：

```typescript
const message = "hello!";

message();

// This expression is not callable.
// Type 'String' has no call signatures.
```

在这个例子中，TypeScript 会在运行之前就会抛出错误信息。

非异常失败（Non-exception 失败）
-----------------------

至今为止，我们已经讨论的都是运行时的错误，所谓运行时错误，就是 JavaScript 会在运行时告诉我们它认为的一些没有意义的事情。这些事情之所以会出现，是因为 [ECMAScript 规范](https://link.juejin.cn?target=https%3A%2F%2Ftc39.github.io%2Fecma262%2F "https://tc39.github.io/ecma262/")已经明确的声明了这些异常时的行为。

举个例子，规范规定，当调用一个非可调用的东西时应该抛出一个错误。也许听起来像是理所当然的，由此你可能认为，如果获取一个对象不存在的属性也应该抛出一个错误，但是 JavaScript 并不会这样，它不报错，还返回值 `undefined`。

```typescript
    const user = {
    name: "Daniel",
    age: 26,
    };
    user.location; // returns undefined
```

一个静态类型需要标记出哪些代码是一个错误，哪怕实际生效的 JavaScript 并不会立刻报错。在 TypeScript 中，下面的代码会产生一个 `location` 不存在的报错：

```typescript
    const user = {
    name: "Daniel",
    age: 26,
    };
    
    user.location;
    // Property 'location' does not exist on type '{ name: string; age: number; }'.
```

尽管有时候这意味着你需要在表达的时候上做一些取舍，但目的还是找出我们项目中一些合理的错误。TypeScript 现在已经可以捕获很多合理的错误。

举个例子，比如拼写错误：

```typescript
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
```

函数未被调用：

```typescript
    function flipCoin() {
    // Meant to be Math.random()
    return Math.random < 0.5;
    // Operator '<' cannot be applied to types '() => number' and 'number'.
}
```

基本的逻辑错误：

```typescript
const value = Math.random() < 0.5 ? "a" : "b";
    if (value !== "a") {
    // ...
        } else if (value === "b") {
        // This condition will always return 'false' since the types '"a"' and '"b"' have no overlap.
        // Oops, unreachable
    }
```

类型工具（Types for Tooling）
-----------------------

TypeScript 不仅在我们犯错的时候，可以找出错误，还可以防止我们犯错。

类型检查器因为有类型信息，可以检查比如说是否正确获取了一个变量的属性。也正是因为有这个信息，它也可以在你输入的时候，列出你可能想要使用的属性。

这意味着 TypeScript 对你编写代码也很有帮助，核心的类型检查器不仅可以提供错误信息，还可以提供代码补全功能。这就是 TypeScript 在工具方面的作用。 ![](/images/jueJin/e92f206a097e49d.png)

TypeScript 的功能很强大，除了在你输入的时候提供补全和错误信息。还可以支持“快速修复”功能，即自动的修复错误，重构成组织清晰的代码。同时也支持导航功能，比如跳转到变量定义的地方，或者找到一个给定的变量所有的引用。

所有这些功能都建立在类型检查器上，并且跨平台支持。[有可能你最喜欢的编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMicrosoft%2FTypeScript%2Fwiki%2FTypeScript-Editor-Support "https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support")已经支持了 TypeScript。

`tsc` TypeScript 编译器（tsc，the TypeScript compiler）
-------------------------------------------------

至今我们只是讨论了类型检查器，但是还一直没有用过。现在让我们了解下我们的新朋友 `tsc` —— TypeScript 编译器。首先，我们可以通过 npm 安装它：

```bash
npm install -g typescript
```

> 这会把 TypeScript 编译器安装在全局，如果你想把 `tsc` 安装在一个本地的 `node_modules` 中，你也可以使用 npx 或者类似的工具。

让我们创建一个空文件夹，然后写下我们第一个 TypeScript 程序: `hello.ts`：

```typescript
// Greets the world.
console.log("Hello world!");
```

注意这里并没有什么多余的修饰，这个 `hello world` 项目就跟你用 JavaScript 写是一样的。现在你可以运行 `tsc` 命令，执行类型检查：

```bash
tsc hello.ts
```

现在我们已经运行了 `tsc`，但是你会发现什么也没有发生。确实如此，因为这里并没有什么类型错误，所以命令行里也不会有任何输出。

但如果我们再次检查一次，我们就会发现，我们得到了一个新的文件。查看一下当前目录，我们会发现 `hello.ts` 同级目录下还有一个 `hello.js`，这就是 `hello.ts` 文件编译输出的文件， `tsc` 会把 ts 文件编译成一个纯 JavaScript 文件。让我们查看一下编译输出的文件：

```typescript
// Greets the world.
console.log("Hello world!");
```

在这个例子中，因为 TypeScript 并没有什么要编译处理的内容，所以看起来跟我们写的是一样的。编译器会尽可能输出干净的代码，就像是正常开发者写的那样，当然这并不是容易的事情，但 TypeScript 会坚持这样做，比如保持缩进，注意跨行代码，保留注释等。

如果我们执意要产生一个类型检查错误呢？我们可以这样写 `hello.ts`:

```typescript
// This is an industrial-grade general-purpose greeter function:
    function greet(person, date) {
    console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

此时我们再运行下 `tsc hello.ts` 。这次我们会在命令行里得到一个错误：

```typescript
Expected 2 arguments, but got 1.
```

TypeScript 告诉我们少传了一个参数给 `greet` 函数。

虽然我们编写的是标准的 JavaScript，但 TypeScript 依然可以帮助我们找到代码中的错误，cool~。

报错时仍产出文件（Emitting with Errors）
------------------------------

在刚才的例子中，有一个细节你可能没有注意到，那就是如果我们打开编译输出的文件，我们会发现文件依然发生了改动。这是不是有点奇怪？`tsc` 明明已经报错了，为什么还要再编译文件？这就要讲到 TypeScript 一个核心的观点：大部分时候，你要比 TypeScript 更清楚你的代码。

举个例子，假如你正在把你的代码迁移成 TypeScript，这会产生很多类型检查错误，而你不得不为类型检查器处理掉所有的错误，这时候你就要想了，明明之前的代码可以正常工作，TypeScript 为什么要阻止代码正常运行呢？

所以 TypeScript 并不会阻碍你。当然了，你如果想要 TypeScript 更严厉一些，你可以使用 [noEmitOnError](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23noEmitOnError "https://www.typescriptlang.org/tsconfig#noEmitOnError") 编译选项，试着改下你的 `hello.ts` 文件，然后运行 `tsc`:

```typescript
tsc --noEmitOnError hello.ts
```

你会发现 `hello.ts` 并不会得到更新。

显示类型（Explicit Types）
--------------------

直到现在，我们还没有告诉 TypeScript，`person` 和 `date` 是什么类型，让我们编辑一下代码，告诉 TypeScript，`person` 是一个 `string` 类型，`date` 是一个 `Date` 对象。同时我们使用 `date` 的 `toDateString()` 方法。

```typescript
    function greet(person: string, date: Date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

我们所做的就是给 `person` 和 `date` 添加了**类型注解（type annotations）**，描述 `greet` 函数可以支持传入什么样的值。你可以如此理解这个**签名 (signature)**： `greet` 支持传入一个 `string` 类型的 `person` 和一个 `Date` 类型的 `date` 。

添加类型注解后，TypeScript 就可以提示我们，比如说当 `greet` 被错误调用时：

```typescript
    function greet(person: string, date: Date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
// Argument of type 'string' is not assignable to parameter of type 'Date'.
```

TypeScript 提示第二个参数有错误，这是为什么呢？

这是因为，在 JavaScript 中调用 `Date()` 会返回一个 `string` 。使用 `new Date()` 才会产生 `Date` 类型的值。

我们快速修复下这个问题：

```typescript
    function greet(person: string, date: Date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

记住，我们并不需要总是写类型注解，大部分时候，TypeScript 可以自动推断出类型：

```typescript
let msg = "hello there!";
// let msg: string
```

尽管我们并没有告诉 TypeScript， `msg` 是 `string` 类型的值，但它依然推断出了类型。这是一个特性，如果类型系统可以正确的推断出类型，最好就不要手动添加类型注解了。

类型抹除（Erased Types）
------------------

上一个例子里的代码，TypeScript 会编译成什么样呢？我们来看一下：

```typescript
"use strict";
    function greet(person, date) {
    console.log("Hello " + person + ", today is " + date.toDateString() + "!");
}
greet("Maddison", new Date());
```

注意两件事情：

1.  我们的 `person` 和 `date` 参数不再有类型注解
2.  模板字符串，即用 \`\`\` 包裹的字符串被转换为使用 `+` 号连接

让我们先看下第一点。类型注解并不是 JavaScript 的一部分。所以并没有任何浏览器或者运行环境可以直接运行 TypeScript 代码。这就是为什么 TypeScript 需要一个编译器，它需要将 TypeScript 代码转换为 JavaScript 代码，然后你才可以运行它。所以大部分 TypeScript 独有的代码会被抹除，在这个例子中，像我们的类型注解就全部被抹除了。

```typescript
谨记：类型注解并不会更改程序运行时的行为
```

降级（Downleveling）
----------------

我们再来关注下第二点，原先的代码是：

```typescript
`Hello ${person}, today is ${date.toDateString()}!`;
```

被编译成了:

```typescript
"Hello " + person + ", today is " + date.toDateString() + "!";
```

为什么要这样做呢？

这是因为模板字符串是 ECMAScript2015（也被叫做 ECMAScript 6 ,ES2015, ES6 等）里的功能，TypeScript 可将新版本的代码编译为老版本的代码，比如 ECMAScript3 或者 ECMAScript5 。这个将高版本的 ECMAScript 语法转为低版本的过程就叫做**降级（downleveling）** 。

TypeScript 默认转换为 `ES3`，一个 ECMAScript 非常老的版本。我们也可以使用 [target](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23target "https://www.typescriptlang.org/tsconfig#target") 选项转换为比较新的一些版本，比如执行 `--target es2015` 会转换为 ECMAScript 2015, 这意味着转换后的代码可以在任何支持 ECMAScript 2015 的地方运行。

执行 `tsc --target es2015 hello.ts` ，让我们看下编译成 ES2015 后的代码：

```typescript
    function greet(person, date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> 尽管默认的目标是 ES3 版本，但是大多数的浏览器都已经支持 ES2015 了，因此大部分开发者可以安全的指定为 ES2015 或者更新的版本，除非你非要兼容某个问题浏览器。

严格模式（Strictness）
----------------

不同的用户使用 TypeScript 会关注不同的事情。一些用户会寻找较为宽松的体验，既可以帮助检查他们程序中的部分代码，也可以享受 TypeScript 的工具功能。这就是 TypeScript 默认的开发体验，类型是可选的，推断会兼容大部分的类型，对有可能是 `null`/ `undefined` 值也不做强制检查。就像 tsc 在编译报错时依然会输出文件，这些默认选项并不会阻碍你的开发。如果你正在迁移 JavaScript 代码，最一开始就可以使用这种方式。

与之形成鲜明对比的是，还有很多用户希望 TypeScript 尽可能多地检查代码，这就是为什么这门语言会提供严格模式设置。但不同于切换开关的形式（要么检查要么不检查），TypeScript 提供的形式更像是一个刻度盘，你越是转动它，TypeScript 就会检查越多的内容。这需要一点额外的工作，但是是值得的，它可以带来更全面的检查和更准确的工具功能。如果可能的话，新项目应该始终开启这些严格设置。

TypeScript 有几个严格模式设置的开关。除非特殊说明，文档里的例子都是在严格模式下写的。CLI 里的 [strict](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%2F%23strict "https://www.typescriptlang.org/tsconfig/#strict") 配置项，或者 [tsconfig.json](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Ftsconfig-json.html "https://www.typescriptlang.org/docs/handbook/tsconfig-json.html") 中的 `"strict": true` 可以同时开启，也可以分开设置。在这些设置里，你最需要了解的是 [noImplicitAny](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23noImplicitAny "https://www.typescriptlang.org/tsconfig#noImplicitAny") 和 [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks "https://www.typescriptlang.org/tsconfig#strictNullChecks")。

`noImplicitAny`
---------------

在某些时候，TypeScript 并不会为我们推断类型，这时候就会回退到最宽泛的类型：`any` 。这倒不是最糟糕的事情，毕竟回退到 `any`就跟我们写 JavaScript 没啥一样了。

但是，经常使用 `any` 有违背我们使用 TypeScript 的目的。你程序使用的类型越多，你在验证和工具上得到的帮助就会越多，这也意味着写代码的时候会遇到更少的 bug。启用 [noImplicitAny](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23noImplicitAny "https://www.typescriptlang.org/tsconfig#noImplicitAny") 配置项后，当类型被隐式推断为 `any` 时，会抛出一个错误。

`strictNullChecks`
------------------

默认情况下，像 `null` 和 `undefined` 这样的值可以赋值给其他的类型。这可以让我们更方面的写一些代码。但是忘记处理 `null` 和 `undefined` 也导致了不少的 bug，甚至有些人会称呼它为[价值百万的错误](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DybrQvs4x0Ps "https://www.youtube.com/watch?v=ybrQvs4x0Ps")！ [strictNullChecks](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictNullChecks "https://www.typescriptlang.org/tsconfig#strictNullChecks") 选项会让我们更明确的处理 `null` 和 `undefined`，也会让我们免于忧虑是否忘记处理 `null` 和 `undefined` 。

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。