---
author: "冴羽"
title: "TypeScript 之常见类型（上）"
date: 2021-12-01
description: "TypeScript4 最新官方文档 Everyday Types 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:4,views:1770,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Everyday Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Feveryday-types.html "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

常见类型（Everyday Types）
--------------------

本章我们会讲解 JavaScript 中最常见的一些类型，以及对应的描述方式。注意本章内容并不详尽，后续的章节会讲解更多命名和使用类型的方式。

类型可以出现在很多地方，不仅仅是在类型注解 (type annotations)中。我们不仅要学习类型本身，也要学习在什么地方使用这些类型产生新的结构。

我们先复习下最基本和常见的类型，这些是构建更复杂类型的基础。

原始类型: `string`，`number` 和 `boolean`（The primitives）
---------------------------------------------------

JavaScript 有三个非常常用的[原始类型](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2FPrimitive "https://developer.mozilla.org/en-US/docs/Glossary/Primitive")：`string`，`number` 和 `boolean`，每一个类型在 TypeScript 中都有对应的类型。他们的名字跟你在 JavaScript 中使用 `typeof` 操作符得到的结果是一样的。

*   `string` 表示字符串，比如 "Hello, world"
*   `number` 表示数字，比如 `42`，JavaScript 中没有 `int` 或者 `float`，所有的数字，类型都是 `number`
*   `boolean` 表示布尔值，其实也就两个值： `true` 和 `false` ​

> 类型名 `String` ，`Number` 和 `Boolean` （首字母大写）也是合法的，但它们是一些非常少见的特殊内置类型。所以类型总是使用 `string` ，`number` 或者 `boolean` 。

数组（Array）
---------

声明一个类似于 `[1, 2, 3]` 的数组类型，你需要用到语法 `number[]`。这个语法可以适用于任何类型（举个例子，`string[]` 表示一个字符串数组）。你也可能看到这种写法 `Array<number>`，是一样的。我们会在泛型章节为大家介绍 `T<U>` 语法。

> 注意 `[number]` 和 `number[]` 表示不同的意思，参考[元组](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fobjects.html%23tuple-types "https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types")章节

`any`
-----

TypeScript 有一个特殊的类型，`any`，当你不希望一个值导致类型检查错误的时候，就可以设置为 `any` 。

当一个值是 `any` 类型的时候，你可以获取它的任意属性 (也会被转为 `any` 类型)，或者像函数一样调用它，把它赋值给一个任意类型的值，或者把任意类型的值赋值给它，再或者是其他语法正确的操作，都可以：

```typescript
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

当你不想写一个长长的类型代码，仅仅想让 TypeScript 知道某段特定的代码是没有问题的，`any` 类型是很有用的。

### `noImplicitAny`

如果你没有指定一个类型，TypeScript 也不能从上下文推断出它的类型，编译器就会默认设置为 `any` 类型。

如果你总是想避免这种情况，毕竟 TypeScript 对 `any` 不做类型检查，你可以开启编译项 [noImplicitAny](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23noImplicitAny "https://www.typescriptlang.org/tsconfig#noImplicitAny")，当被隐式推断为 `any` 时，TypeScript 就会报错。

变量上的类型注解（Type Annotations on Variables）
---------------------------------------

当你使用 `const`、`var` 或 `let` 声明一个变量时，你可以选择性的添加一个类型注解，显式指定变量的类型：

```typescript
let myName: string = "Alice";
```

> TypeScript 并不使用“在左边进行类型声明”的形式，比如 `int x = 0`；类型注解往往跟在要被声明类型的内容后面。

不过大部分时候，这不是必须的。因为 TypeScript 会自动推断类型。举个例子，变量的类型可以基于初始值进行推断：

```typescript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = "Alice";
```

大部分时候，你不需要学习推断的规则。如果你刚开始使用，尝试尽可能少的使用类型注解。你也许会惊讶于，TypeScript 仅仅需要很少的内容就可以完全理解将要发生的事情。

函数（Function）
------------

函数是 JavaScript 传递数据的主要方法。TypeScript 允许你指定函数的输入值和输出值的类型。

### 参数类型注解（Parameter Type Annotations）

当你声明一个函数的时候，你可以在每个参数后面添加一个类型注解，声明函数可以接受什么类型的参数。参数类型注解跟在参数名字后面：

```typescript
// Parameter type annotation
    function greet(name: string) {
    console.log("Hello, " + name.toUpperCase() + "!!");
}
```

当参数有了类型注解的时候，TypeScript 便会检查函数的实参：

```typescript
// Would be a runtime error if executed!
greet(42);
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

> 即便你对参数没有做类型注解，TypeScript 依然会检查传入参数的数量是否正确

### 返回值类型注解（Return Type Annotations）

你也可以添加返回值的类型注解。返回值的类型注解跟在参数列表后面：

```typescript
    function getFavoriteNumber(): number {
    return 26;
}
```

跟变量类型注解一样，你也不需要总是添加返回值类型注解，TypeScript 会基于它的 `return` 语句推断函数的返回类型。像这个例子中，类型注解写和没写都是一样的，但一些代码库会显式指定返回值的类型，可能是因为需要编写文档，或者阻止意外修改，亦或者仅仅是个人喜好。

### 匿名函数（Anonymous Functions）

匿名函数有一点不同于函数声明，当 TypeScript 知道一个匿名函数将被怎样调用的时候，匿名函数的参数会被自动的指定类型。

这是一个例子：

```typescript
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
    names.forEach(function (s) {
    console.log(s.toUppercase());
    // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
    });
    
    // Contextual typing also applies to arrow functions
        names.forEach((s) => {
        console.log(s.toUppercase());
        // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
        });
```

尽管参数 `s` 并没有添加类型注解，但 TypeScript 根据 `forEach` 函数的类型，以及传入的数组的类型，最后推断出了 `s` 的类型。

这个过程被称为**上下文推断（contextual typing）**，因为正是从函数出现的上下文中推断出了它应该有的类型。

跟推断规则一样，你也不需要学习它是如何发生的，只要知道，它确实存在并帮助你省掉某些并不需要的注解。后面，我们还会看到更多这样的例子，了解一个值出现的上下文是如何影响它的类型的。

对象类型（Object Types）
------------------

除了原始类型，最常见的类型就是对象类型了。定义一个对象类型，我们只需要简单的列出它的属性和对应的类型。

举个例子：

```typescript
// The parameter's type annotation is an object type
    function printCoord(pt: { x: number; y: number }) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

这里，我们给参数添加了一个类型，该类型有两个属性, `x` 和 `y`，两个都是 `number` 类型。你可以使用 `,` 或者 `;` 分开属性，最后一个属性的分隔符加不加都行。

每个属性对应的类型是可选的，如果你不指定，默认使用 `any` 类型。

### 可选属性（Optional Properties）

对象类型可以指定一些甚至所有的属性为可选的，你只需要在属性名后添加一个 `?` ：

```typescript
    function printName(obj: { first: string; last?: string }) {
    // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

在 JavaScript 中，如果你获取一个不存在的属性，你会得到一个 `undefined` 而不是一个运行时错误。因此，当你获取一个可选属性时，你需要在使用它前，先检查一下是否是 `undefined`。

```typescript
    function printName(obj: { first: string; last?: string }) {
    // Error - might crash if 'obj.last' wasn't provided!
    console.log(obj.last.toUpperCase());
    // Object is possibly 'undefined'.
        if (obj.last !== undefined) {
        // OK
        console.log(obj.last.toUpperCase());
    }
    
    // A safe alternative using modern JavaScript syntax:
    console.log(obj.last?.toUpperCase());
}
```

联合类型（Union Types）
-----------------

TypeScript 类型系统允许你使用一系列的操作符，基于已经存在的类型构建新的类型。现在我们知道如何编写一些基础的类型了，是时候把它们组合在一起了。

### 定义一个联合类型（Defining a Union Type）

第一种组合类型的方式是使用联合类型，一个联合类型是由两个或者更多类型组成的类型，表示值可能是这些类型中的任意一个。这其中每个类型都是联合类型的**成员（members）**。

让我们写一个函数，用来处理字符串或者数字：

```typescript
    function printId(id: number | string) {
    console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
// Type '{ myID: number; }' is not assignable to type 'number'.
```

### 使用联合类型（Working with Union Types）

提供一个符合联合类型的值很容易，你只需要提供符合任意一个联合成员类型的值即可。那么在你有了一个联合类型的值后，你该怎样使用它呢？

TypeScript 会要求你做的事情，必须对每个联合的成员都是有效的。举个例子，如果你有一个联合类型 `string | number` , 你不能使用只存在 `string` 上的方法：

```typescript
    function printId(id: number | string) {
    console.log(id.toUpperCase());
    // Property 'toUpperCase' does not exist on type 'string | number'.
    // Property 'toUpperCase' does not exist on type 'number'.
}
```

解决方案是用代码收窄联合类型，就像你在 JavaScript 没有类型注解那样使用。当 TypeScript 可以根据代码的结构推断出一个更加具体的类型时，类型收窄就会出现。

举个例子，TypeScript 知道，对一个 `string` 类型的值使用 `typeof` 会返回字符串 `"string"`：

```typescript
    function printId(id: number | string) {
        if (typeof id === "string") {
        // In this branch, id is of type 'string'
        console.log(id.toUpperCase());
            } else {
            // Here, id is of type 'number'
            console.log(id);
        }
    }
```

再举一个例子，使用函数，比如 `Array.isArray`:

```typescript
    function welcomePeople(x: string[] | string) {
        if (Array.isArray(x)) {
        // Here: 'x' is 'string[]'
        console.log("Hello, " + x.join(" and "));
            } else {
            // Here: 'x' is 'string'
            console.log("Welcome lone traveler " + x);
        }
    }
```

注意在 `else`分支，我们并不需要做任何特殊的事情，如果 `x` 不是 `string[]`，那么它一定是 `string` .

有时候，如果联合类型里的每个成员都有一个属性，举个例子，数字和字符串都有 `slice` 方法，你就可以直接使用这个属性，而不用做类型收窄：

```typescript
// Return type is inferred as number[] | string
    function getFirstThree(x: number[] | string) {
    return x.slice(0, 3);
}
```

> 你可能很奇怪，为什么联合类型只能使用这些类型属性的交集，让我们举个例子，现在有两个房间，一个房间都是身高八尺戴帽子的人，另外一个房间则是会讲西班牙语戴帽子的人，合并这两个房间后，我们唯一知道的事情是：每一个人都戴着帽子。

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。