---
author: "冴羽"
title: "TypeScript 之映射类型"
date: 2021-12-06
description: "TypeScript4 最新官方文档 Mapped Types 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","TypeScript","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:20,comments:2,collects:3,views:1575,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Mapped Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fmapped-types.html "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

映射类型（Mapped Types）
------------------

有的时候，一个类型需要基于另外一个类型，但是你又不想拷贝一份，这个时候可以考虑使用映射类型。

映射类型建立在索引签名的语法上，我们先回顾下索引签名：

```typescript
// 当你需要提前声明属性的类型时
    type OnlyBoolsAndHorses = {
    [key: string]: boolean | Horse;
    };
    
        const conforms: OnlyBoolsAndHorses = {
        del: true,
        rodney: false,
        };
```

而映射类型，就是使用了 `PropertyKeys` 联合类型的泛型，其中 `PropertyKeys` 多是通过 `keyof` 创建，然后循环遍历键名创建一个类型：

```typescript
    type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
    };
```

在这个例子中，`OptionsFlags` 会遍历 `Type` 所有的属性，然后设置为布尔类型。

```typescript
    type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
    };
    
    type FeatureOptions = OptionsFlags<FeatureFlags>;
        // type FeatureOptions = {
        //    darkMode: boolean;
        //    newUserProfile: boolean;
    // }
```

映射修饰符（Mapping Modifiers）
------------------------

在使用映射类型时，有两个额外的修饰符可能会用到，一个是 `readonly`，用于设置属性只读，一个是 `?` ，用于设置属性可选。

你可以通过前缀 `-` 或者 `+` 删除或者添加这些修饰符，如果没有写前缀，相当于使用了 `+` 前缀。

```typescript
// 删除属性中的只读属性
    type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
    };
    
        type LockedAccount = {
        readonly id: string;
        readonly name: string;
        };
        
        type UnlockedAccount = CreateMutable<LockedAccount>;
        
            // type UnlockedAccount = {
            //    id: string;
            //    name: string;
        // }
``````typescript
// 删除属性中的可选属性
    type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
    };
    
        type MaybeUser = {
        id: string;
        name?: string;
        age?: number;
        };
        
        type User = Concrete<MaybeUser>;
            // type User = {
            //    id: string;
            //    name: string;
            //    age: number;
        // }
```

通过 `as` 实现键名重新映射（Key Remapping via `as`）
----------------------------------------

在 TypeScript 4.1 及以后，你可以在映射类型中使用 `as` 语句实现键名重新映射：

```typescript
    type MappedTypeWithNewProperties<Type> = {
[Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

举个例子，你可以利用「[模板字面量类型](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Ftemplate-literal-types.html "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html")」，基于之前的属性名创建一个新属性名：

```typescript
    type Getters<Type> = {
[Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

    interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;

    // type LazyPerson = {
    //    getName: () => string;
    //    getAge: () => number;
    //    getLocation: () => string;
// }
```

你也可以利用条件类型返回一个 `never` 从而过滤掉某些属性:

```typescript
// Remove the 'kind' property
    type RemoveKindField<Type> = {
[Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

    interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

    // type KindlessCircle = {
    //    radius: number;
// }
```

你还可以遍历任何联合类型，不仅仅是 `string | number | symbol` 这种联合类型，可以是任何类型的联合：

```typescript
    type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
    // type Config = {
    //    square: (event: SquareEvent) => void;
    //    circle: (event: CircleEvent) => void;
// }
```

深入探索（Further Exploration）
-------------------------

映射类型也可以跟其他的功能搭配使用，举个例子，这是一个使用条件类型的映射类型，会根据对象是否有 `pii` 属性返回 `true` 或者 `false` :

```typescript
    type ExtractPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
    };
    
        type DBFields = {
        id: { format: "incrementing" };
        name: { type: string; pii: true };
        };
        
        type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
            // type ObjectsNeedingGDPRDeletion = {
            //    id: false;
            //    name: true;
        // }
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。