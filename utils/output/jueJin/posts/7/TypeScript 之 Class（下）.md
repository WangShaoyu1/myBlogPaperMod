---
author: "冴羽"
title: "TypeScript 之 Class（下）"
date: 2021-12-09
description: "TypeScript4 最新官方文档 Classes 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","JavaScript","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:36,views:3965,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Classes](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fclasses.html%23readonly "https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

静态成员（Static Members）
--------------------

类可以有静态成员，静态成员跟类实例没有关系，可以通过类本身访问到：

```typescript
    class MyClass {
    static x = 0;
        static printX() {
        console.log(MyClass.x);
    }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员同样可以使用 `public` `protected` 和 `private` 这些可见性修饰符：

```typescript
    class MyClass {
    private static x = 0;
}
console.log(MyClass.x);
// Property 'x' is private and only accessible within class 'MyClass'.
```

静态成员也可以被继承：

```typescript
    class Base {
        static getGreeting() {
        return "Hello world";
    }
}
    class Derived extends Base {
    myGreeting = Derived.getGreeting();
}
```

### 特殊静态名称（Special Static Names）

类本身是函数，而覆写 `Function` 原型上的属性通常认为是不安全的，因此不能使用一些固定的静态名称，函数属性像 `name`、`length`、`call` 不能被用来定义 `static` 成员：

```typescript
    class S {
    static name = "S!";
    // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

### 为什么没有静态类？（Why No Static Classes?）

TypeScript（和 JavaScript） 并没有名为静态类（static class）的结构，但是像 C# 和 Java 有。

所谓静态类，指的是作为类的静态成员存在于某个类的内部的类。比如这种：

```typescript
// java
    public class OuterClass {
    private static String a = "1";
        static class InnerClass {
        private int b = 2;
    }
}
```

静态类之所以存在是因为这些语言强迫所有的数据和函数都要在一个类内部，但这个限制在 TypeScript 中并不存在，所以也没有静态类的需要。一个只有一个单独实例的类，在 JavaScript/TypeScript 中，完全可以使用普通的对象替代。

举个例子，我们不需要一个 `static class` 语法，因为 TypeScript 中一个常规对象（或者顶级函数）可以实现一样的功能：

```typescript
// Unnecessary "static" class
    class MyStaticClass {
static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
    const MyHelperObject = {
    dosomething() {},
    };
```

类静态块（static Blocks in Classes）
------------------------------

静态块允许你写一系列有自己作用域的语句，也可以获取类里的私有字段。这意味着我们可以安心的写初始化代码：正常书写语句，无变量泄漏，还可以完全获取类中的属性和方法。

```typescript
    class Foo {
    static #count = 0;
    
        get count() {
        return Foo.#count;
    }
    
        static {
            try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
    catch {}
}
}
```

泛型类（Generic Classes）
--------------------

类跟接口一样，也可以写泛型。当使用 `new` 实例化一个泛型类，它的类型参数的推断跟函数调用是同样的方式：

```typescript
    class Box<Type> {
    contents: Type;
        constructor(value: Type) {
        this.contents = value;
    }
}

const b = new Box("hello!");
// const b: Box<string>
```

类跟接口一样也可以使用泛型约束以及默认值。

### 静态成员中的类型参数（Type Parameters in Static Members）

这代码并不合法，但是原因可能并没有那么明显：

```typescript
    class Box<Type> {
    static defaultValue: Type;
    // Static members cannot reference class type parameters.
}
```

记住类型会被完全抹除，运行时，只有一个 `Box.defaultValue` 属性槽。这也意味着如果设置 `Box<string>.defaultValue` 是可以的话，这也会改变 `Box<number>.defaultValue`，而这样是不好的。

所以泛型类的静态成员不应该引用类的类型参数。

类运行时的 `this`（this at Runtime in Classes）
----------------------------------------

TypeScript 并不会更改 JavaScript 运行时的行为，并且 JavaScript 有时会出现一些奇怪的运行时行为。

就比如 JavaScript 处理 `this` 就很奇怪：

```typescript
    class MyClass {
    name = "MyClass";
        getName() {
        return this.name;
    }
}
const c = new MyClass();
    const obj = {
    name: "obj",
    getName: c.getName,
    };
    
    // Prints "obj", not "MyClass"
    console.log(obj.getName());
```

默认情况下，函数中 `this` 的值取决于函数是如何被调用的。在这个例子中，因为函数通过 `obj` 被调用，所以 `this` 的值是 `obj` 而不是类实例。

这显然不是你所希望的。TypeScript 提供了一些方式缓解或者阻止这种错误。

### 箭头函数（Arrow Functions）

如果你有一个函数，经常在被调用的时候丢失 `this` 上下文，使用一个箭头函数或许更好些。

```typescript
    class MyClass {
    name = "MyClass";
        getName = () => {
        return this.name;
        };
    }
    const c = new MyClass();
    const g = c.getName;
    // Prints "MyClass" instead of crashing
    console.log(g());
```

这里有几点需要注意下：

*   `this` 的值在运行时是正确的，即使 TypeScript 不检查代码
*   这会使用更多的内存，因为每一个类实例都会拷贝一遍这个函数。
*   你不能在派生类使用 `super.getName` ，因为在原型链中并没有入口可以获取基类方法。

### `this` 参数（this parameters）

在 TypeScript 方法或者函数的定义中，第一个参数且名字为 `this` 有特殊的含义。该参数会在编译的时候被抹除：

```typescript
// TypeScript input with 'this' parameter
    function fn(this: SomeType, x: number) {
    /* ... */
}
``````typescript
// JavaScript output
    function fn(x) {
    /* ... */
}
```

TypeScript 会检查一个有 `this` 参数的函数在调用时是否有一个正确的上下文。不像上个例子使用箭头函数，我们可以给方法定义添加一个 `this` 参数，静态强制方法被正确调用：

```typescript
    class MyClass {
    name = "MyClass";
        getName(this: MyClass) {
        return this.name;
    }
}
const c = new MyClass();
// OK
c.getName();

// Error, would crash
const g = c.getName;
console.log(g());
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
```

这个方法也有一些注意点，正好跟箭头函数相反：

*   JavaScript 调用者依然可能在没有意识到它的时候错误使用类方法
*   每个类一个函数，而不是每一个类实例一个函数
*   基类方法定义依然可以通过 `super` 调用

`this` 类型（this Types）
---------------------

在类中，有一个特殊的名为 `this` 的类型，会动态的引用当前类的类型，让我们看下它的用法：

```typescript
    class Box {
    contents: string = "";
        set(value: string) {
        // (method) Box.set(value: string): this
        this.contents = value;
        return this;
    }
}
```

这里，TypeScript 推断 `set` 的返回类型为 `this` 而不是 `Box` 。让我们写一个 `Box` 的子类：

```typescript
    class ClearableBox extends Box {
        clear() {
        this.contents = "";
    }
}

const a = new ClearableBox();
const b = a.set("hello");

// const b: ClearableBox
```

你也可以在参数类型注解中使用 `this` ：

```typescript
    class Box {
    content: string = "";
        sameAs(other: this) {
        return other.content === this.content;
    }
}
```

不同于写 `other: Box` ，如果你有一个派生类，它的 `sameAs` 方法只接受来自同一个派生类的实例。

```typescript
    class Box {
    content: string = "";
        sameAs(other: this) {
        return other.content === this.content;
    }
}

    class DerivedBox extends Box {
    otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
// Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.

```

### 基于 `this` 的类型保护（this-based type guards）

你可以在类和接口的方法返回的位置，使用 `this is Type` 。当搭配使用类型收窄 (举个例子，`if` 语句)，目标对象的类型会被收窄为更具体的 `Type`。

```typescript
    class FileSystemObject {
        isFile(): this is FileRep {
        return this instanceof FileRep;
    }
        isDirectory(): this is Directory {
        return this instanceof Directory;
    }
        isNetworked(): this is Networked & this {
        return this.networked;
    }
constructor(public path: string, private networked: boolean) {}
}

    class FileRep extends FileSystemObject {
        constructor(path: string, public content: string) {
        super(path, false);
    }
}

    class Directory extends FileSystemObject {
    children: FileSystemObject[];
}

    interface Networked {
    host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

    if (fso.isFile()) {
    fso.content;
    // const fso: FileRep
        } else if (fso.isDirectory()) {
        fso.children;
        // const fso: Directory
            } else if (fso.isNetworked()) {
            fso.host;
            // const fso: Networked & FileSystemObject
        }
```

一个常见的基于 this 的类型保护的使用例子，会对一个特定的字段进行懒校验（lazy validation）。举个例子，在这个例子中，当 `hasValue` 被验证为 true 时，会从类型中移除 `undefined`：

```typescript
    class Box<T> {
    value?: T;
    
        hasValue(): this is { value: T } {
        return this.value !== undefined;
    }
}

const box = new Box();
box.value = "Gameboy";

box.value;
// (property) Box<unknown>.value?: unknown

    if (box.hasValue()) {
    box.value;
    // (property) value: unknown
}
```

参数属性（Parameter Properties）
--------------------------

TypeScript 提供了特殊的语法，可以把一个构造函数参数转成一个同名同值的类属性。这些就被称为参数属性（parameter properties）。你可以通过在构造函数参数前添加一个可见性修饰符 `public` `private` `protected` 或者 `readonly` 来创建参数属性，最后这些类属性字段也会得到这些修饰符：

```typescript
    class Params {
    constructor(
    public readonly x: number,
    protected y: number,
    private z: number
        ) {
        // No body necessary
    }
}
const a = new Params(1, 2, 3);
console.log(a.x);
// (property) Params.x: number

console.log(a.z);
// Property 'z' is private and only accessible within class 'Params'.
```

类表达式（Class Expressions）
-----------------------

类表达式跟类声明非常类似，唯一不同的是类表达式不需要一个名字，尽管我们可以通过绑定的标识符进行引用：

```typescript
    const someClass = class<Type> {
    content: Type;
        constructor(value: Type) {
        this.content = value;
    }
    };
    
    const m = new someClass("Hello, world");
    // const m: someClass<string>
```

抽象类和成员（abstract Classes and Members）
------------------------------------

TypeScript 中，类、方法、字段都可以是抽象的（abstract）。

抽象方法或者抽象字段是不提供实现的。这些成员必须存在在一个抽象类中，这个抽象类也不能直接被实例化。

抽象类的作用是作为子类的基类，让子类实现所有的抽象成员。当一个类没有任何抽象成员，他就会被认为是具体的（concrete）。

让我们看个例子：

```typescript
    abstract class Base {
    abstract getName(): string;
    
        printName() {
        console.log("Hello, " + this.getName());
    }
}

const b = new Base();
// Cannot create an instance of an abstract class.
```

我们不能使用 `new` 实例 `Base` 因为它是抽象类。我们需要写一个派生类，并且实现抽象成员。

```typescript
    class Derived extends Base {
        getName() {
        return "world";
    }
}

const d = new Derived();
d.printName();
```

注意，如果我们忘记实现基类的抽象成员，我们会得到一个报错：

```typescript
    class Derived extends Base {
    // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
    // forgot to do anything
}
```

### 抽象构造签名（Abstract Construct Signatures）

有的时候，你希望接受传入可以继承一些抽象类产生一个类的实例的类构造函数。

举个例子，你也许会写这样的代码：

```typescript
    function greet(ctor: typeof Base) {
    const instance = new ctor();
    // Cannot create an instance of an abstract class.
    instance.printName();
}
```

TypeScript 会报错，告诉你正在尝试实例化一个抽象类。毕竟，根据 `greet` 的定义，这段代码应该是合法的：

```typescript
// Bad!
greet(Base);
```

但如果你写一个函数接受传入一个构造签名：

```typescript
    function greet(ctor: new () => Base) {
    const instance = new ctor();
    instance.printName();
}
greet(Derived);
greet(Base);

// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
// Cannot assign an abstract constructor type to a non-abstract constructor type.
```

现在 TypeScript 会正确的告诉你，哪一个类构造函数可以被调用，`Derived` 可以，因为它是具体的，而 `Base` 是不能的。

类之间的关系（Relationships Between Classes）
-------------------------------------

大部分时候，TypeScript 的类跟其他类型一样，会被结构性比较。

举个例子，这两个类可以用于替代彼此，因为它们结构是相等的：

```typescript
    class Point1 {
    x = 0;
    y = 0;
}

    class Point2 {
    x = 0;
    y = 0;
}

// OK
const p: Point1 = new Point2();
```

类似的还有，类的子类型之间可以建立关系，即使没有明显的继承：

```typescript
    class Person {
    name: string;
    age: number;
}

    class Employee {
    name: string;
    age: number;
    salary: number;
}

// OK
const p: Person = new Employee();
```

这听起来有些简单，但还有一些例子可以看出奇怪的地方。

空类没有任何成员。在一个结构化类型系统中，没有成员的类型通常是任何其他类型的父类型。所以如果你写一个空类（只是举例，你可不要这样做），任何东西都可以用来替换它：

```typescript
class Empty {}

    function fn(x: Empty) {
    // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。