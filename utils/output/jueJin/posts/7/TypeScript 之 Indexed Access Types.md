---
author: "冴羽"
title: "TypeScript 之 Indexed Access Types"
date: 2021-11-25
description: "TypeScript4 最新官方文档 Indexed Access Types 章节的中文翻译，同时补充了相关内容"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:4,views:1865,"
---
前言
--

TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

本篇整理自 TypeScript Handbook 中 「[Indexed Access Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Findexed-access-types.html "https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html")」 章节。

本文并不严格按照原文翻译，对部分内容也做了解释补充。

正文
--

我们可以使用 **索引访问类型（indexed access type）** 查找另外一个类型上的特定属性：

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// type Age = number
```

因为索引名本身就是一个类型，所以我们也可以使用联合、`keyof` 或者其他类型：

```typescript
type I1 = Person["age" | "name"];
// type I1 = string | number

type I2 = Person[keyof Person];
// type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
// type I3 = string | boolean
```

如果你尝试查找一个不存在的属性，TypeScript 会报错：

```typescript
type I1 = Person["alve"];
// Property 'alve' does not exist on type 'Person'.
```

接下来是另外一个示例，我们使用 `number` 来获取数组元素的类型。结合 `typeof` 可以方便的捕获数组字面量的元素类型：

```typescript
    const MyArray = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
    { name: "Eve", age: 38 },
    ];
    
    type Person = typeof MyArray[number];
    
        // type Person = {
        //    name: string;
        //    age: number;
    // }
    
    type Age = typeof MyArray[number]["age"];
    // type Age = number
    
    // Or
    type Age2 = Person["age"];
    // type Age2 = number
```

作为索引的只能是类型，这意味着你不能使用 `const` 创建一个变量引用：

```typescript
const key = "age";
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

然而你可以使用类型别名实现类似的重构：

```typescript
type key = "age";
type Age = Person[key];
```

最后讲一个实战案例：​

假设有这样一个业务场景，一个页面要用在不同的 APP 里，比如淘宝、天猫、支付宝，根据所在 APP 的不同，调用的底层 API 会不同，我们可能会这样写：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'];

    function getPhoto(app: string) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // ok
```

如果我们仅仅是对 app 约束为 `string` 类型，即使传入其他的字符串，也不会导致报错，我们可以使用字面量联合类型约束一下：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'];
type app = 'TaoBao' | 'Tmall' | 'Alipay';

    function getPhoto(app: app) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

但写两遍又有些冗余，我们怎么根据一个数组获取它的所有值的字符串联合类型呢？我们就可以结合上一篇的 `typeof` 和本节的内容实现：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

    function getPhoto(app: app) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

我们来一步步解析：

首先是使用 `as const` 将数组变为 `readonly` 的元组类型：

```typescript
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
// const APP: readonly ["TaoBao", "Tmall", "Alipay"]
```

但此时 `APP` 还是一个值，我们通过 `typeof` 获取 `APP` 的类型：

```typescript
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```

最后在通过索引访问类型，获取字符串联合类型：

```typescript
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。