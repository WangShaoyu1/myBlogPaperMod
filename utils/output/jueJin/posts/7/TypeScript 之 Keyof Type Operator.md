---
author: "冴羽"
title: "TypeScript 之 Keyof Type Operator"
date: 2021-11-23
description: "TypeScript4 最新官方文档 Keyof Type Operator 章节的中文翻译，冴羽做了部分补充。"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:45,comments:0,collects:26,views:4911,"
---
前言
--

TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

本篇整理自 TypeScript Handbook 中 「[Keyof Type Operator](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fkeyof-types.html "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html")」 章节。

本文并不严格按照原文翻译，对部分内容也做了解释补充。

`keyof` 类型操作符
-------------

对一个对象类型使用 `keyof` 操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合。这个例子中的类型 P 就等同于 "x" | "y"：

```typescript
type Point = { x: number; y: number };
type P = keyof Point;

// type P = keyof Point
```

但如果这个类型有一个 `string` 或者 `number` 类型的索引签名，`keyof` 则会直接返回这些类型：

```typescript
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
```

注意在这个例子中，`M` 是 `string | number`，这是因为 JavaScript 对象的属性名会被强制转为一个字符串，所以 `obj[0]` 和 `obj["0"]` 是一样的。

(注：原文到这里就结束了)

数字字面量联合类型
---------

在一开始我们也说了，`keyof` 也可能返回一个数字字面量的联合类型，那什么时候会返回数字字面量联合类型呢，我们可以尝试构建这样一个对象：

```typescript
    const NumericObject = {
    [1]: "冴羽一号",
    [2]: "冴羽二号",
    [3]: "冴羽三号"
    };
    
    type result = keyof typeof NumericObject
    
    // typeof NumbericObject 的结果为：
        // {
        //   1: string;
        //   2: string;
        //   3: string;
    // }
    // 所以最终的结果为：
    // type result = 1 | 2 | 3
```

Symbol
------

其实 TypeScript 也可以支持 symbol 类型的属性名：

```typescript
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

    const symbolToNumberMap = {
    [sym1]: 1,
    [sym2]: 2,
    [sym3]: 3,
    };
    
    type KS = keyof typeof symbolToNumberMap; // typeof sym1 | typeof sym2 | typeof sym3
```

这也就是为什么当我们在泛型中像下面的例子中使用，会如此报错：

```typescript
    function useKey<T, K extends keyof T>(o: T, k: K) {
    var name: string = k;
    // Type 'string | number | symbol' is not assignable to type 'string'.
}
```

如果你确定只使用字符串类型的属性名，你可以这样写：

```typescript
    function useKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
    var name: string = k; // OK
}
```

而如果你要处理所有的属性名，你可以这样写：

```typescript
    function useKey<T, K extends keyof T>(o: T, k: K) {
    var name: string | number | symbol = k;
}
```

类和接口
----

对类使用 `keyof`：

```typescript
// 例子一
    class Person {
    name: "冴羽"
}

type result = keyof Person;
// type result = "name"
``````typescript
// 例子二
    class Person {
    [1]: string = "冴羽";
}

type result = keyof Person;
// type result = 1
```

对接口使用 `keyof`：

```typescript
    interface Person {
    name: "string";
}

type result = keyof Person;
// type result = "name"
```

实战
--

在「[TypeScript 之 Generic](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F222 "https://github.com/mqyqingfeng/Blog/issues/222")」这篇中就讲到了一个 `keyof` 的应用： ​ 我们希望获取一个对象给定属性名的值，为此，我们需要确保我们不会获取 `obj` 上不存在的属性。所以我们在两个类型之间建立一个约束：

```typescript
    function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");

// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

在后面的「[Mappred Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fmapped-types.html "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html")」 章节中，我们还会讲到 `keyof` 。

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。