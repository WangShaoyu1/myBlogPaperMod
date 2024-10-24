---
author: "冴羽"
title: "TypeScript 之 Class（上）"
date: 2021-12-08
description: "TypeScript4 最新官方文档 Classes 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","TypeScript","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:12,views:5452,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Classes](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fclasses.html%23readonly "https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

类（Classes）
----------

TypeScript 完全支持 ES2015 引入的 `class` 关键字。

和其他 JavaScript 语言特性一样，TypeScript 提供了类型注解和其他语法，允许你表达类与其他类型之间的关系。

类成员（Class Members）
------------------

这是一个最基本的类，一个空类：

```typescript
class Point {}
```

这个类并没有什么用，所以让我们添加一些成员。

### 字段（Fields）

一个字段声明会创建一个公共（public）可写入（writeable）的属性：

```typescript
    class Point {
    x: number;
    y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

注意：类型注解是可选的，如果没有指定，会隐式的设置为 `any`。​

字段可以设置初始值（initializers）：

```typescript
    class Point {
    x = 0;
    y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

就像 `const` 、`let` 和 `var` ，一个类属性的初始值会被用于推断它的类型:

```typescript
const pt = new Point();
pt.x = "0";
// Type 'string' is not assignable to type 'number'.
```

#### \--strictPropertyInitialization

[strictPropertyInitialization](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictPropertyInitialization "https://www.typescriptlang.org/tsconfig#strictPropertyInitialization") 选项控制了类字段是否需要在构造函数里初始化：

```typescript
    class BadGreeter {
    name: string;
    // Property 'name' has no initializer and is not definitely assigned in the constructor.
}
``````typescript
    class GoodGreeter {
    name: string;
    
        constructor() {
        this.name = "hello";
    }
}
```

注意，字段需要在构造函数自身进行初始化。TypeScript 并不会分析构造函数里你调用的方法，进而判断初始化的值，因为一个派生类也许会覆盖这些方法并且初始化成员失败：

```typescript
    class BadGreeter {
    name: string;
    // Property 'name' has no initializer and is not definitely assigned in the constructor.
        setName(): void {
        this.name = '123'
    }
        constructor() {
        this.setName();
    }
}
```

如果你执意要通过其他方式初始化一个字段，而不是在构造函数里（举个例子，引入外部库为你补充类的部分内容），你可以使用明确赋值断言操作符（definite assignment assertion operator） `!`:

```typescript
    class OKGreeter {
    // Not initialized, but no error
    name!: string;
}
```

### `readonly`

字段可以添加一个 `readonly` 前缀修饰符，这会阻止在构造函数之外的赋值。

```typescript
    class Greeter {
    readonly name: string = "world";
    
        constructor(otherName?: string) {
            if (otherName !== undefined) {
            this.name = otherName;
        }
    }
    
        err() {
        this.name = "not ok";
        // Cannot assign to 'name' because it is a read-only property.
    }
}

const g = new Greeter();
g.name = "also not ok";
// Cannot assign to 'name' because it is a read-only property.
```

### 构造函数（Constructors）

类的构造函数跟函数非常类似，你可以使用带类型注解的参数、默认值、重载等。

```typescript
    class Point {
    x: number;
    y: number;
    
    // Normal signature with defaults
        constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
``````typescript
    class Point {
    // Overloads
    constructor(x: number, y: string);
    constructor(s: string);
        constructor(xs: any, y?: any) {
        // TBD
    }
}
```

但类构造函数签名与函数签名之间也有一些区别：

*   构造函数不能有类型参数（关于类型参数，回想下泛型里的内容），这些属于外层的类声明，我们稍后就会学习到。
*   构造函数不能有[返回类型注解](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Feveryday-types.html%23return-type-annotations "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations")，因为总是返回类实例类型

#### Super 调用（Super Calls）

就像在 JavaScript 中，如果你有一个基类，你需要在使用任何 `this.` 成员之前，先在构造函数里调用 `super()`。

```typescript
    class Base {
    k = 4;
}

    class Derived extends Base {
        constructor() {
        // Prints a wrong value in ES5; throws exception in ES6
        console.log(this.k);
        // 'super' must be called before accessing 'this' in the constructor of a derived class.
        super();
    }
}
```

忘记调用 `super` 是 JavaScript 中一个简单的错误，但是 TypeScript 会在需要的时候提醒你。

### 方法（Methods）

类中的函数属性被称为方法。方法跟函数、构造函数一样，使用相同的类型注解。

```typescript
    class Point {
    x = 10;
    y = 10;
    
        scale(n: number): void {
        this.x *= n;
        this.y *= n;
    }
}
```

除了标准的类型注解，TypeScript 并没有给方法添加任何新的东西。

注意在一个方法体内，它依然可以通过 `this.` 访问字段和其他的方法。方法体内一个未限定的名称（unqualified name，没有明确限定作用域的名称）总是指向闭包作用域里的内容。

```typescript
let x: number = 0;

    class C {
    x: string = "hello";
    
        m() {
        // This is trying to modify 'x' from line 1, not the class property
        x = "world";
        // Type 'string' is not assignable to type 'number'.
    }
}
```

### Getters / Setter

类也可以有存取器（accessors）：

```typescript
    class C {
    _length = 0;
        get length() {
        return this._length;
    }
        set length(value) {
        this._length = value;
    }
}
```

TypeScript 对存取器有一些特殊的推断规则：

*   如果 `get` 存在而 `set` 不存在，属性会被自动设置为 `readonly`
*   如果 setter 参数的类型没有指定，它会被推断为 getter 的返回类型
*   getters 和 setters 必须有相同的成员可见性（[Member Visibility](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fclasses.html%23member-visibility "https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility")）。

从 TypeScript 4.3 起，存取器在读取和设置的时候可以使用不同的类型。

```typescript
    class Thing {
    _size = 0;
    
    // 注意这里返回的是 number 类型
        get size(): number {
        return this._size;
    }
    
    // 注意这里允许传入的是 string | number | boolean 类型
        set size(value: string | number | boolean) {
        let num = Number(value);
        
        // Don't allow NaN, Infinity, etc
            if (!Number.isFinite(num)) {
            this._size = 0;
            return;
        }
        
        this._size = num;
    }
}
```

### 索引签名（Index Signatures）

类可以声明索引签名，它和对象类型的索引签名是一样的：

```typescript
    class MyClass {
    [s: string]: boolean | ((s: string) => boolean);
    
        check(s: string) {
        return this[s] as boolean;
    }
}
```

因为索引签名类型也需要捕获方法的类型，这使得并不容易有效的使用这些类型。通常的来说，在其他地方存储索引数据而不是在类实例本身，会更好一些。

类继承（Class Heritage）
-------------------

JavaScript 的类可以继承基类。

### `implements` 语句（`implements` Clauses）

你可以使用 `implements` 语句检查一个类是否满足一个特定的 `interface`。如果一个类没有正确的实现(implement)它，TypeScript 会报错：

```typescript
    interface Pingable {
    ping(): void;
}

    class Sonar implements Pingable {
        ping() {
        console.log("ping!");
    }
}

    class Ball implements Pingable {
    // Class 'Ball' incorrectly implements interface 'Pingable'.
    // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
        pong() {
        console.log("pong!");
    }
}
```

类也可以实现多个接口，比如 `class C implements A, B {`

#### 注意事项（Cautions）

`implements` 语句仅仅检查类是否按照接口类型实现，但它并不会改变类的类型或者方法的类型。一个常见的错误就是以为 `implements` 语句会改变类的类型——然而实际上它并不会：

```typescript
    interface Checkable {
    check(name: string): boolean;
}

    class NameChecker implements Checkable {
        check(s) {
        // Parameter 's' implicitly has an 'any' type.
        // Notice no error here
        return s.toLowercse() === "ok";
        // any
    }
```

在这个例子中，我们可能会以为 `s` 的类型会被 `check` 的 `name: string` 参数影响。实际上并没有，`implements` 语句并不会影响类的内部是如何检查或者类型推断的。

类似的，实现一个有可选属性的接口，并不会创建这个属性：

```typescript
    interface A {
    x: number;
    y?: number;
}
    class C implements A {
    x = 0;
}
const c = new C();
c.y = 10;

// Property 'y' does not exist on type 'C'.
```

### `extends` 语句（`extends` Clauses）

类可以 `extend` 一个基类。一个派生类有基类所有的属性和方法，还可以定义额外的成员。

```typescript
    class Animal {
        move() {
        console.log("Moving along!");
    }
}

    class Dog extends Animal {
        woof(times: number) {
            for (let i = 0; i < times; i++) {
            console.log("woof!");
        }
    }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

#### 覆写属性（Overriding Methods）

一个派生类可以覆写一个基类的字段或属性。你可以使用 `super` 语法访问基类的方法。

TypeScript 强制要求派生类总是它的基类的子类型。

举个例子，这是一个合法的覆写方法的方式：

```typescript
    class Base {
        greet() {
        console.log("Hello, world!");
    }
}

    class Derived extends Base {
        greet(name?: string) {
            if (name === undefined) {
            super.greet();
                } else {
                console.log(`Hello, ${name.toUpperCase()}`);
            }
        }
    }
    
    const d = new Derived();
    d.greet();
    d.greet("reader");
```

派生类需要遵循着它的基类的实现。

而且通过一个基类引用指向一个派生类实例，这是非常常见并合法的：

```typescript
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

但是如果 `Derived` 不遵循 `Base` 的约定实现呢？

```typescript
    class Base {
        greet() {
        console.log("Hello, world!");
    }
}

    class Derived extends Base {
    // Make this parameter required
        greet(name: string) {
        // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
        // Type '(name: string) => void' is not assignable to type '() => void'.
        console.log(`Hello, ${name.toUpperCase()}`);
    }
}
```

即便我们忽视错误编译代码，这个例子也会运行错误：

```typescript
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

#### 初始化顺序（Initialization Order）

有些情况下，JavaScript 类初始化的顺序会让你感到很奇怪，让我们看这个例子：

```typescript
    class Base {
    name = "base";
        constructor() {
        console.log("My name is " + this.name);
    }
}

    class Derived extends Base {
    name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

到底发生了什么呢？

类初始化的顺序，就像在 JavaScript 中定义的那样：

*   基类字段初始化
*   基类构造函数运行
*   派生类字段初始化
*   派生类构造函数运行

这意味着基类构造函数只能看到它自己的 `name` 的值，因为此时派生类字段初始化还没有运行。

#### 继承内置类型（Inheriting Built-in Types）

> 注意：如果你不打算继承内置的类型比如 `Array`、`Error`、`Map` 等或者你的编译目标是 ES6/ES2015 或者更新的版本，你可以跳过这个章节。

在 ES2015 中，当调用 `super(...)` 的时候，如果构造函数返回了一个对象，会隐式替换 `this` 的值。所以捕获 `super()` 可能的返回值并用 `this` 替换它是非常有必要的。

这就导致，像 `Error`、`Array` 等子类，也许不会再如你期望的那样运行。这是因为 `Error`、`Array` 等类似内置对象的构造函数，会使用 ECMAScript 6 的 `new.target` 调整原型链。然而，在 ECMAScript 5 中，当调用一个构造函数的时候，并没有方法可以确保 `new.target` 的值。 其他的降级编译器默认也会有同样的限制。

对于一个像下面这样的子类：

```typescript
    class MsgError extends Error {
        constructor(m: string) {
        super(m);
    }
        sayHello() {
        return "hello " + this.message;
    }
}
```

你也许可以发现：

1.  对象的方法可能是 `undefined` ，所以调用 `sayHello` 会导致错误
2.  `instanceof` 失效， `(new MsgError()) instanceof MsgError` 会返回 `false`。

我们推荐，手动的在 `super(...)` 调用后调整原型：

```typescript
    class MsgError extends Error {
        constructor(m: string) {
        super(m);
        
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MsgError.prototype);
    }
    
        sayHello() {
        return "hello " + this.message;
    }
}
```

不过，任何 `MsgError` 的子类也不得不手动设置原型。如果运行时不支持 `Object.setPrototypeOf`，你也许可以使用 `__proto__` 。

不幸的是，这些方案并不会能在 IE 10 或者之前的版本正常运行。解决的一个方法是手动拷贝原型中的方法到实例中（就比如 `MsgError.prototype` 到 `this`），但是它自己的原型链依然没有被修复。

成员可见性（Member Visibility）
------------------------

你可以使用 TypeScript 控制某个方法或者属性是否对类以外的代码可见。

### `public`

类成员默认的可见性为 `public`，一个 `public` 的成员可以在任何地方被获取：

```typescript
    class Greeter {
        public greet() {
        console.log("hi!");
    }
}
const g = new Greeter();
g.greet();
```

因为 `public` 是默认的可见性修饰符，所以你不需要写它，除非处于格式或者可读性的原因。

### `protected`

`protected` 成员仅仅对子类可见：

```typescript
    class Greeter {
        public greet() {
        console.log("Hello, " + this.getName());
    }
        protected getName() {
        return "hi";
    }
}

    class SpecialGreeter extends Greeter {
        public howdy() {
        // OK to access protected member here
        console.log("Howdy, " + this.getName());
    }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();

// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

#### 受保护成员的公开（Exposure of protected members）

派生类需要遵循基类的实现，但是依然可以选择公开拥有更多能力的基类子类型，这就包括让一个 `protected` 成员变成 `public`：

```typescript
    class Base {
    protected m = 10;
}
    class Derived extends Base {
    // No modifier, so default is 'public'
    m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

这里需要注意的是，如果公开不是故意的，在这个派生类中，我们需要小心的拷贝 `protected` 修饰符。

#### 交叉等级受保护成员访问（Cross-hierarchy protected access）

不同的 OOP 语言在通过一个基类引用是否可以合法的获取一个 `protected` 成员是有争议的。

```typescript
    class Base {
    protected x: number = 1;
}
    class Derived1 extends Base {
    protected x: number = 5;
}
    class Derived2 extends Base {
        f1(other: Derived2) {
        other.x = 10;
    }
        f2(other: Base) {
        other.x = 10;
        // Property 'x' is protected and only accessible through an instance of class 'Derived2'. This is an instance of class 'Base'.
    }
}
```

在 Java 中，这是合法的，而 C# 和 C++ 认为这段代码是不合法的。

TypeScript 站在 C# 和 C++ 这边。因为 `Derived2` 的 `x` 应该只有从 `Derived2` 的子类访问才是合法的，而 `Derived1` 并不是它们中的一个。此外，如果通过 `Derived1` 访问 `x` 是不合法的，通过一个基类引用访问也应该是不合法的。

看这篇[《Why Can’t I Access A Protected Member From A Derived Class?》](https://link.juejin.cn?target=https%3A%2F%2Fblogs.msdn.microsoft.com%2Fericlippert%2F2005%2F11%2F09%2Fwhy-cant-i-access-a-protected-member-from-a-derived-class%2F "https://blogs.msdn.microsoft.com/ericlippert/2005/11/09/why-cant-i-access-a-protected-member-from-a-derived-class/")，解释了更多 C# 这样做的原因。

### `private`

`private` 有点像 `protected` ，但是不允许访问成员，即便是子类。

```typescript
    class Base {
    private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
// Property 'x' is private and only accessible within class 'Base'.
``````typescript
    class Derived extends Base {
        showX() {
        // Can't access in subclasses
        console.log(this.x);
        // Property 'x' is private and only accessible within class 'Base'.
    }
}
```

因为 `private` 成员对派生类并不可见，所以一个派生类也不能增加它的可见性：

```typescript
    class Base {
    private x = 0;
}
    class Derived extends Base {
    // Class 'Derived' incorrectly extends base class 'Base'.
    // Property 'x' is private in type 'Base' but not in type 'Derived'.
    x = 1;
}
```

#### 交叉实例私有成员访问（Cross-instance private access）

不同的 OOP 语言在关于一个类的不同实例是否可以获取彼此的 `private` 成员上，也是不一致的。像 Java、C#、C++、Swift 和 PHP 都是允许的，Ruby 是不允许。

TypeScript 允许交叉实例私有成员的获取：

```typescript
    class A {
    private x = 10;
    
        public sameAs(other: A) {
        // No error
        return other.x === this.x;
    }
}
```

#### 警告（Caveats）

`private`和 `protected` 仅仅在类型检查的时候才会强制生效。

这意味着在 JavaScript 运行时，像 `in` 或者简单的属性查找，依然可以获取 `private` 或者 `protected` 成员。

```typescript
    class MySafe {
    private secretKey = 12345;
}
``````typescript
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);
```

`private` 允许在类型检查的时候，通过方括号语法进行访问。这让比如单元测试的时候，会更容易访问 `private` 字段，这也让这些字段是弱私有（soft private）而不是严格的强制私有。

```typescript
    class MySafe {
    private secretKey = 12345;
}

const s = new MySafe();

// Not allowed during type checking
console.log(s.secretKey);
// Property 'secretKey' is private and only accessible within class 'MySafe'.

// OK
console.log(s["secretKey"]);
```

不像 TypeScript 的 `private`，JavaScript 的[私有字段](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FClasses%2FPrivate_class_fields "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields")（`#`）即便是编译后依然保留私有性，并且不会提供像上面这种方括号获取的方法，这让它们变得强私有（hard private）。

```typescript
    class Dog {
    #barkAmount = 0;
    personality = "happy";
    
constructor() {}
}
``````typescript
"use strict";
    class Dog {
    #barkAmount = 0;
    personality = "happy";
constructor() { }
}

```

当被编译成 ES2021 或者之前的版本，TypeScript 会使用 WeakMaps 替代 `#`:

```typescript
"use strict";
var _Dog_barkAmount;
    class Dog {
        constructor() {
        _Dog_barkAmount.set(this, 0);
        this.personality = "happy";
    }
}
_Dog_barkAmount = new WeakMap();
```

如果你需要防止恶意攻击，保护类中的值，你应该使用强私有的机制比如闭包，`WeakMaps` ，或者私有字段。但是注意，这也会在运行时影响性能。

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。