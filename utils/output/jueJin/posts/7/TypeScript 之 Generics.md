---
author: "冴羽"
title: "TypeScript 之 Generics"
date: 2021-11-22
description: "TypeScript4 最新官方文档 Generics 的翻译，结果这篇内容与老版相同，翻译完后才发现……所以请欣赏冴羽翻译版"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:26,comments:0,collects:8,views:2926,"
---
前言
--

TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

本篇整理自 TypeScript Handbook 中 「[Generics](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fgenerics.html "https://www.typescriptlang.org/docs/handbook/2/generics.html")」 章节。

本文并不严格按照原文翻译，对部分内容也做了解释补充。

正文
--

软件工程的一个重要部分就是构建组件，组件不仅需要有定义良好和一致的 API，也需要是可复用的（reusable）。好的组件不仅能够兼容今天的数据类型，也能适用于未来可能出现的数据类型，这在构建大型软件系统时会给你最大的灵活度。

在比如 C# 和 Java 语言中，用来创建可复用组件的工具，我们称之为泛型（generics）。利用泛型，我们可以创建一个支持众多类型的组件，这让用户可以使用自己的类型消费（consume）这些组件。

Generics 初探（Hello World of Generics）
------------------------------------

让我们开始写第一个泛型，一个恒等函数（identity function）。所谓恒等函数，就是一个返回任何传进内容的函数。你也可以把它理解为类似于 `echo` 命令。

不借助泛型，我们也许需要给予恒等函数一个具体的类型：

```typescript
    function identity(arg: number): number {
    return arg;
}
```

或者，我们使用 `any` 类型：

```typescript
    function identity(arg: any): any {
    return arg;
}
```

尽管使用 `any` 类型可以让我们接受任何类型的 `arg` 参数，但也让我们丢失了函数返回时的类型信息。如果我们传入一个数字，我们唯一知道的信息是函数可以返回任何类型的值。

所以我们需要一种可以捕获参数类型的方式，然后再用它表示返回值的类型。这里我们用了一个**类型变量（type variable）**，一种用在类型而非值上的特殊的变量。

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}
```

现在我们已经给恒等函数加上了一个类型变量 `Type`，这个 `Type` 允许我们捕获用户提供的类型，使得我们在接下来可以使用这个类型。这里，我们再次用 `Type` 作为返回的值的类型。在现在的写法里，我们可以清楚的知道参数和返回值的类型是同一个。

现在这个版本的恒等函数就是一个泛型，它可以支持传入多种类型。不同于使用 `any`，它没有丢失任何信息，就跟第一个使用 `number` 作为参数和返回值类型的的恒等函数一样准确。

在我们写了一个泛型恒等函数后，我们有两种方式可以调用它。第一种方式是传入所有的参数，包括类型参数：

```typescript
let output = identity<string>("myString"); // let output: string
```

在这里，我们使用 `<>` 而不是 `()`包裹了参数，并明确的设置 `Type` 为 `string` 作为函数调用的一个参数。

第二种方式可能更常见一些，这里我们使用了**类型参数推断（type argument inference）**（部分中文文档会翻译为“**类型推论**”），我们希望编译器能基于我们传入的参数自动推断和设置 `Type` 的值。

```typescript
let output = identity("myString"); // let output: string
```

注意这次我们并没有用 `<>` 明确的传入类型，当编译器看到 `myString` 这个值，就会自动设置 `Type` 为它的类型（即 `string`）。

类型参数推断是一个很有用的工具，它可以让我们的代码更短更易阅读。而在一些更加复杂的例子中，当编译器推断类型失败，你才需要像上一个例子中那样，明确的传入参数。

使用泛型类型变量（Working with Generic Type Variables）
---------------------------------------------

当你创建类似于 `identity` 这样的泛型函数时，你会发现，编译器会强制你在函数体内，正确的使用这些类型参数。这就意味着，你必须认真的对待这些参数，考虑到他们可能是任何一个，甚至是所有的类型（比如用了联合类型）。

让我们以 `identity` 函数为例：

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}
```

如果我们想打印 `arg` 参数的长度呢？我们也许会尝试这样写：

```typescript
    function loggingIdentity<Type>(arg: Type): Type {
    console.log(arg.length);
    // Property 'length' does not exist on type 'Type'.
    return arg;
}
```

如果我们这样做，编译器会报错，提示我们正在使用 `arg` 的 `.length`属性，但是我们却没有在其他地方声明 `arg` 有这个属性。我们前面也说了这些类型变量代表了任何甚至所有类型。所以完全有可能，调用的时候传入的是一个 `number` 类型，但是 `number` 并没有 `.length` 属性。

现在假设这个函数，使用的是 `Type` 类型的数组而不是 `Type`。因为我们使用的是数组，`.length` 属性肯定存在。我们就可以像创建其他类型的数组一样写：

```typescript
    function loggingIdentity<Type>(arg: Type[]): Type[] {
    console.log(arg.length);
    return arg;
}
```

你可以这样理解 `loggingIdentity` 的类型：泛型函数 `loggingIdentity` 接受一个 `Type` 类型参数和一个实参 `arg`，实参 `arg` 是一个 `Type` 类型的数组。而该函数返回一个 `Type` 类型的数组。

如果我们传入的是一个全是数字类型的数组，我们的返回值同样是一个全是数字类型的数组，因为 `Type` 会被当成 `number` 传入。

现在我们使用类型变量 `Type`，是作为我们使用的类型的一部分，而不是之前的一整个类型，这会给我们更大的自由度。

我们也可以这样写这个例子，效果是一样的：

```typescript
    function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}
```

泛型类型 (Generic Types)
--------------------

在上个章节，我们已经创建了一个泛型恒等函数，可以支持传入不同的类型。在这个章节，我们探索函数本身的类型，以及如何创建泛型接口。

泛型函数的形式就跟其他非泛型函数的一样，都需要先列一个类型参数列表，这有点像函数声明：

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

泛型的类型参数可以使用不同的名字，只要数量和使用方式上一致即可：

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

我们也可以以对象类型的调用签名的形式，书写这个泛型类型：

```typescript
    function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

这可以引导我们写出第一个泛型接口，让我们使用上个例子中的对象字面量，然后把它的代码移动到接口里：

```typescript
    interface GenericIdentityFn {
    <Type>(arg: Type): Type;
}

    function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

有的时候，我们会希望将泛型参数作为整个接口的参数，这可以让我们清楚的知道传入的是什么参数 (举个例子：`Dictionary<string>` 而不是 `Dictionary`)。而且接口里其他的成员也可以看到。

```typescript
    interface GenericIdentityFn<Type> {
    (arg: Type): Type;
}

    function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

注意在这个例子里，我们只做了少许改动。不再描述一个泛型函数，而是将一个非泛型函数签名，作为泛型类型的一部分。

现在当我们使用 `GenericIdentityFn` 的时候，需要明确给出参数的类型。(在这个例子中，是 `number`)，有效的锁定了调用签名使用的类型。

当要描述一个包含泛型的类型时，理解什么时候把类型参数放在调用签名里，什么时候把它放在接口里是很有用的。

除了泛型接口之外，我们也可以创建泛型类。注意，不可能创建泛型枚举类型和泛型命名空间。

泛型类（Generic Classes）
--------------------

泛型类写法上类似于泛型接口。在类名后面，使用尖括号中 `<>` 包裹住类型参数列表：

```typescript
    class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) {
    return x + y;
    };
```

在这个例子中，并没有限制你只能使用 `number` 类型。我们也可以使用 `string` 甚至更复杂的类型：

```typescript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
    stringNumeric.add = function (x, y) {
    return x + y;
    };
    
    console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

就像接口一样，把类型参数放在类上，可以确保类中的所有属性都使用了相同的类型。

正如我们在 Class 章节提过的，一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数。

泛型约束（Generic Constraints）
-------------------------

在早一点的 `loggingIdentity` 例子中，我们想要获取参数 `arg` 的 `.length` 属性，但是编译器并不能证明每种类型都有 `.length` 属性，所以它会提示错误：

```typescript
    function loggingIdentity<Type>(arg: Type): Type {
    console.log(arg.length);
    // Property 'length' does not exist on type 'Type'.
    return arg;
}
```

相比于能兼容任何类型，我们更愿意约束这个函数，让它只能使用带有 `.length` 属性的类型。只要类型有这个成员，我们就允许使用它，但必须至少要有这个成员。为此，我们需要列出对 `Type` 约束中的必要条件。

为此，我们需要创建一个接口，用来描述约束。这里，我们创建了一个只有 `.length` 属性的接口，然后我们使用这个接口和 `extend`关键词实现了约束：

```typescript
    interface Lengthwise {
    length: number;
}

    function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
    console.log(arg.length); // Now we know it has a .length property, so no more error
    return arg;
}
```

现在这个泛型函数被约束了，它不再适用于所有类型：

```typescript
loggingIdentity(3);
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```

我们需要传入符合约束条件的值：

```typescript
loggingIdentity({ length: 10, value: 3 });
```

在泛型约束中使用类型参数（Using Type Parameters in Generic Constraints）
----------------------------------------------------------

你可以声明一个类型参数，这个类型参数被其他类型参数约束。 ​ 举个例子，我们希望获取一个对象给定属性名的值，为此，我们需要确保我们不会获取 `obj` 上不存在的属性。所以我们在两个类型之间建立一个约束：

```typescript
    function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");

// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

在泛型中使用类类型（Using Class Types in Generics）
----------------------------------------

在 TypeScript 中，当使用工厂模式创建实例的时候，有必要通过他们的构造函数推断出类的类型，举个例子：

```typescript
    function create<Type>(c: { new (): Type }): Type {
    return new c();
}
```

下面是一个更复杂的例子，使用原型属性推断和约束，构造函数和类实例的关系。

```typescript
    class BeeKeeper {
    hasMask: boolean = true;
}

    class ZooKeeper {
    nametag: string = "Mikle";
}

    class Animal {
    numLegs: number = 4;
}

    class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

    class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

    function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。