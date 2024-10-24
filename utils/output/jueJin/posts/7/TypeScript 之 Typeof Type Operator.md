---
author: "冴羽"
title: "TypeScript 之 Typeof Type Operator"
date: 2021-11-24
description: "TypeScript4 最新官方文档 Typeof Type Operator 章节的中文翻译，同时补充了部分相关内容"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:6,views:1986,"
---
前言
--

TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

本篇整理自 TypeScript Handbook 中 「[Typeof Type Operator](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Ftypeof-types.html "https://www.typescriptlang.org/docs/handbook/2/typeof-types.html")」 章节。

本文并不严格按照原文翻译，对部分内容也做了解释补充。

`typeof` 类型操作符（The `typeof` type operator）
------------------------------------------

JavaScript 本身就有 `typeof` 操作符，你可以在表达式上下文中（expression context）使用：

```typescript
// Prints "string"
console.log(typeof "Hello world");
```

而 TypeScript 添加的 `typeof` 方法可以在类型上下文（type context）中使用，用于获取一个变量或者属性的类型。

```typescript
let s = "hello";
let n: typeof s;
// let n: string
```

如果仅仅用来判断基本的类型，自然是没什么太大用，和其他的类型操作符搭配使用才能发挥它的作用。

举个例子：比如搭配 TypeScript 内置的 `ReturnTypep<T>`。你传入一个函数类型，`ReturnTypep<T>` 会返回该函数的返回值的类型：

```typescript
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
/// type K = boolean
```

如果我们直接对一个函数名使用 `ReturnType` ，我们会看到这样一个报错：

```typescript
    function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<f>;

// 'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
```

这是因为值（values）和类型（types）并不是一种东西。为了获取值 `f` 也就是函数 `f` 的类型，我们就需要使用 `typeof`：

```typescript
    function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;

    // type P = {
    //    x: number;
    //    y: number;
// }
```

限制（Limitations）
---------------

TypeScript 有意的限制了可以使用 `typeof` 的表达式的种类。

在 TypeScript 中，只有对标识符（比如变量名）或者他们的属性使用 `typeof` 才是合法的。这可能会导致一些令人迷惑的问题：

```typescript
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// ',' expected.
```

我们本意是想获取 `msgbox("Are you sure you want to continue?")` 的返回值的类型，所以直接使用了 `typeof msgbox("Are you sure you want to continue?")`，看似能正常执行，但实际并不会，这是因为 `typeof` 只能对标识符和属性使用。而正确的写法应该是：

```typescript
ReturnType<typeof msgbox>
```

(注：原文到这里就结束了)

对对象使用 `typeof`
--------------

我们可以对一个对象使用 `typeof`：

```typescript
const person = { name: "kevin", age: "18" }
type Kevin = typeof person;

    // type Kevin = {
    // 		name: string;
    // 		age: string;
// }
```

对函数使用 `typeof`
--------------

我们也可以对一个函数使用 `typeof`：

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}

type result = typeof identity;
// type result = <Type>(arg: Type) => Type
```

对 enum 使用 `typeof`
------------------

在 TypeScript 中，enum 是一种新的数据类型，但在具体运行的时候，它会被编译成对象。

```typescript
    enum UserResponse {
    No = 0,
    Yes = 1,
}
```

对应编译的 JavaScript 代码为：

```typescript
var UserResponse;
    (function (UserResponse) {
    UserResponse[UserResponse["No"] = 0] = "No";
    UserResponse[UserResponse["Yes"] = 1] = "Yes";
    })(UserResponse || (UserResponse = {}));
```

如果我们打印一下 `UserResponse`：

```typescript
console.log(UserResponse);

    // [LOG]: {
    //   "0": "No",
    //   "1": "Yes",
    //   "No": 0,
    //   "Yes": 1
// }
```

而如果我们对 `UserResponse` 使用 `typeof`：

```typescript
type result = typeof UserResponse;

// ok
    const a: result = {
    "No": 2,
    "Yes": 3
}

result 类型类似于：

    // {
    //	"No": number,
    //  "YES": number
// }
```

不过对一个 enum 类型只使用 `typeof` 一般没什么用，通常还会搭配 `keyof` 操作符用于获取属性名的联合字符串：

```typescript
type result = keyof typeof UserResponse;
// type result = "No" | "Yes"
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。