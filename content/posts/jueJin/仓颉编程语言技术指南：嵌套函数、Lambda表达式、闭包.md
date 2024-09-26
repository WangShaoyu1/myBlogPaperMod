---
author: "华为云开发者联盟"
title: "仓颉编程语言技术指南：嵌套函数、Lambda表达式、闭包"
date: 2024-07-26
description: "本文分享自华为云社区《【华为鸿蒙开发技术】仓颉编程语言技术指南【嵌套函数、Lambda表达式、闭包】》，仓颉编程语言通过嵌套函数、Lambda表达式和闭包为开发者提供了灵活和强大的编程工具。"
tags: ["敏捷开发","HarmonyOS","编程语言"]
ShowReadingTime: "阅读8分钟"
weight: 521
---
本文分享自华为云社区[《【华为鸿蒙开发技术】仓颉编程语言技术指南【嵌套函数、Lambda 表达式、闭包】》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F431299%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/431299?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者：柠檬味拥抱。

仓颉编程语言（Cangjie）是一种面向全场景应用开发的通用编程语言，旨在兼顾开发效率和运行性能，并提供良好的编程体验。本文将深入探讨仓颉语言的主要特点和功能，包括其简明高效的语法、多范式编程支持、类型安全性、内存安全性、高效并发、兼容性、领域扩展能力、UI 开发支持和内置库功能。

1\. 语法简明高效
==========

仓颉编程语言提供了一系列简明高效的语法特性，旨在减少冗余书写、提升开发效率。以下是一些关键特性：

1.1 嵌套函数
--------

仓颉语言允许在函数体内定义嵌套函数，这些函数可以在外部函数内部调用，也可以作为返回值返回：

scss

 代码解读

复制代码

`func foo() {     func nestAdd(a: Int64, b: Int64) {         a + b + 3     }     println(nestAdd(1, 2))  // 输出：6     return nestAdd } main() {     let f = foo()     let x = f(1, 2)     println("result: ${x}")  // 输出：result: 6 }`

1.2 Lambda 表达式
--------------

仓颉语言支持简洁的 lambda 表达式，使函数式编程变得更加方便：

javascript

 代码解读

复制代码

`let f1 = { a: Int64, b: Int64 => a + b } var display = { => println("Hello") } func f(a1: (Int64) -> Int64): Int64 {     a1(1) } main() {     let sum1 = { a: Int64, b: Int64 => a + b }     let r1 = { a: Int64, b: Int64 => a + b }(1, 2)  // r1 = 3     let r2 = { => 123 }()  // r2 = 123     let f2Res = f({ a2 => a2 + 10 })  // 使用 lambda 表达式 }`

2\. 多范式编程
=========

仓颉编程语言支持函数式、命令式和面向对象等多范式编程。开发者可以根据需求选择不同的编程范式：

*   **函数式编程**：支持高阶函数、代数数据类型、模式匹配等特性。
*   **面向对象编程**：支持封装、接口、继承等特性。
*   **命令式编程**：支持值类型、全局函数等特性。

3\. 类型安全
========

仓颉语言是静态强类型语言，通过编译时类型检查来尽早识别程序错误，降低运行时风险。编译器提供了强大的类型推断能力，减少类型标注工作：

css

 代码解读

复制代码

`var sum1: (Int64, Int64) -> Int64 = { a, b => a + b } var sum2: (Int64, Int64) -> Int64 = { a: Int64, b => a + b }`

4\. 内存安全
========

仓颉语言提供自动内存管理，并在运行时进行数组下标越界检查、溢出检查等，以确保内存安全：

swift

 代码解读

复制代码

`func safeArrayAccess(arr: [Int64], index: Int64): Int64 {     if index < arr.length {         return arr[index]     } else {         println("Index out of bounds")         return -1     } }`

5\. 高效并发
========

仓颉语言提供用户态轻量化线程（原生协程）以及简单易用的并发编程机制，适用于高效的并发场景：

csharp

 代码解读

复制代码

`func concurrentTask() {     let task = async {          // 执行异步任务     }     await task }`

6\. 兼容语言生态
==========

仓颉语言支持与 C 等主流编程语言的互操作，采用声明式编程范式以实现对其他语言库的高效复用和生态兼容：

scss

 代码解读

复制代码

`extern func cFunction(arg: Int64) -> Int64 func callCFunction() {     let result = cFunction(10)     println(result) }`

7\. 领域易扩展
=========

仓颉语言支持基于词法宏的元编程能力，允许在编译时变换代码，支持构建内嵌式领域专用语言（EDSL）：

scss

 代码解读

复制代码

`macro square(x: Int64) => x * x func useMacro() {     let result = square(4)  // 结果为 16     println(result) }`

8\. 助力 UI 开发
============

仓颉语言的元编程和尾随 lambda 等特性可以用来搭建声明式 UI 开发框架，提升 UI 开发效率和体验：

less

 代码解读

复制代码

`func createUI() {     let button = Button(text: "Click Me", onClick: { => println("Button clicked") })     // 创建并显示 UI 组件 }`

9\. 内置库功能丰富
===========

仓颉语言提供了丰富的内置库，涵盖数据结构、常用算法、数学计算、正则匹配、系统交互、文件操作、网络通信、数据库访问等功能：

javascript

 代码解读

复制代码

`import stdlib func exampleUsage() {     let numbers = [1, 2, 3, 4, 5]     let sum = numbers.reduce(0, { a, b => a + b })     println("Sum: ${sum}") }`

仓颉编程语言凭借其简洁高效的语法、多范式编程支持、类型和内存安全、高效并发能力以及广泛的内置库功能，为开发者提供了一个强大且灵活的编程平台。无论是进行高效的应用开发、构建复杂的 UI 组件，还是进行领域特定的编程，仓颉语言都能满足开发者的需求。

仓颉编程语言的嵌套函数、Lambda 表达式与闭包解析
===========================

1\. 嵌套函数
--------

在仓颉编程语言中，嵌套函数指的是定义在另一个函数内部的函数。这种函数在外部函数的作用域内是可见的，但其作用域仅限于外部函数。嵌套函数可以访问外部函数的局部变量，并且可以作为返回值返回，使得函数式编程更加灵活。

**示例：**

scss

 代码解读

复制代码

`func foo() {     func nestAdd(a: Int64, b: Int64) {         a + b + 3     }     println(nestAdd(1, 2))  // 6     return nestAdd } main() {     let f = foo()     let x = f(1, 2)     println("result: ${x}") }`

在上述示例中，`nestAdd` 是一个定义在 `foo` 函数内部的嵌套函数。它不仅可以在 `foo` 内部被调用，还可以作为返回值返回，供外部使用。运行结果为：

makefile

 代码解读

复制代码

`6 result: 6`

2\. Lambda 表达式
--------------

Lambda 表达式是仓颉编程语言中一种简洁的函数定义方式，用于定义匿名函数。Lambda 表达式的语法为 `{ p1: T1, ..., pn: Tn => expressions | declarations }`。其中，`=>` 之前为参数列表，`=>` 之后为表达式或声明序列。Lambda 表达式可以赋值给变量，也可以作为函数的实参或返回值使用。

**示例：**

javascript

 代码解读

复制代码

`let f1 = { a: Int64, b: Int64 => a + b } var display = { => println("Hello") }   // 无参数的 lambda 表达式 // Lambda 表达式的调用 let r1 = { a: Int64, b: Int64 => a + b }(1, 2) // r1 = 3 let r2 = { => 123 }()                          // r2 = 123 func f2(lam: () -> Unit) { } let f2Res = f2{ println("World") } // OK to omit the =>`

在上述示例中，`f1` 是一个接受两个参数并返回它们和的 Lambda 表达式。`display` 是一个无参数的 Lambda 表达式。Lambda 表达式可以直接调用，也可以赋值给变量再调用。

3\. 闭包
------

闭包是指函数或 Lambda 表达式在定义时捕获了其外部作用域中的变量，即使在外部作用域之外执行，闭包仍然能够访问这些捕获的变量。闭包的变量捕获遵循一定的规则：

*   **变量捕获的规则：** 捕获的变量必须在闭包定义时可见，并且在闭包定义时已经完成初始化。
*   **闭包与变量捕获：** 函数或 Lambda 内访问外部函数的局部变量称为变量捕获。被捕获的变量的生命周期由闭包决定，这使得闭包可以在其外部作用域被调用时，仍然保持对这些变量的访问。

**示例 1：**

scss

 代码解读

复制代码

`func returnAddNum(): (Int64) -> Int64 {     let num: Int64 = 10     func add(a: Int64) {         return a + num     }     add } main() {     let f = returnAddNum()     println(f(10))  // 输出 20 }`

在这个示例中，`add` 函数捕获了 `num` 变量。即使 `num` 的定义作用域已经结束，`add` 函数仍然能够访问 `num`。

**示例 2：**

scss

 代码解读

复制代码

`func f() {     let x = 99     func f1() {         println(x)     }     let f2 = { =>         println(y)      // 错误，y 在闭包定义时未定义     }     let y = 88     f1()          // 打印 99.     f2()          // 错误 }`

在这个示例中，`f2` 尝试捕获 `y` 变量，但 `y` 在 `f2` 定义时尚未定义，因此会导致编译错误。

**示例 3：**

scss

 代码解读

复制代码

`func f() {     let x: Int64     func f1() {         println(x)    // 错误，x 尚未初始化     }     x = 99     f1() }`

在此示例中，`f1` 尝试访问尚未初始化的 `x`，这也是一个编译错误。

**示例 4：**

csharp

 代码解读

复制代码

`class C {     public var num: Int64 = 0 } func returnIncrementer(): () -> Unit {     let c: C = C()     func incrementer() {         c.num++     }     incrementer } main() {     let f = returnIncrementer()     f() // c.num 增加 1 }`

在这个示例中，`incrementer` 捕获了 `c` 对象，并可以修改 `c` 的 `num` 成员变量。闭包可以正常访问并修改捕获的引用类型变量。

仓颉编程语言中的高阶函数与函数式编程特性
====================

1\. 高阶函数
--------

高阶函数是指接受其他函数作为参数或返回函数的函数。高阶函数能够提高代码的复用性和可读性。在仓颉编程语言中，你可以创建和使用高阶函数以便在不同的上下文中灵活地操作函数。

**示例 1：高阶函数的基本使用**

scss

 代码解读

复制代码

`func applyFunction(x: Int64, func f: (Int64) -> Int64): Int64 {     return f(x) } func square(n: Int64): Int64 {     return n * n } main() {     let result = applyFunction(4, square)     println(result)  // 输出 16 }`

在这个示例中，`applyFunction` 是一个高阶函数，它接受一个整数 `x` 和一个函数 `f` 作为参数，并将 `x` 传递给 `f`。`square` 函数计算平方值，并作为参数传递给 `applyFunction`。

**示例 2：函数返回函数**

scss

 代码解读

复制代码

`func makeMultiplier(factor: Int64): (Int64) -> Int64 {     func multiplier(x: Int64) -> Int64 {         return x * factor     }     return multiplier } main() {     let double = makeMultiplier(2)     let triple = makeMultiplier(3)     println(double(5))  // 输出 10     println(triple(5))  // 输出 15 }`

在这个示例中，`makeMultiplier` 函数返回了一个新的函数 `multiplier`，该函数可以将输入的整数乘以 `factor`。你可以创建不同的乘法器（如 `double` 和 `triple`），并应用于不同的输入值。

2\. 函数式编程特性
-----------

仓颉编程语言支持函数式编程特性，如不可变数据、函数组合、柯里化等，这些特性能够使代码更加简洁和模块化。

**示例 1：不可变数据**

scss

 代码解读

复制代码

`func modifyValue(x: Int64) -> Int64 {     let y = x + 1     return y } main() {     let value = 5     let newValue = modifyValue(value)     println(value)     // 输出 5（原值未改变）     println(newValue) // 输出 6（新值） }`

在这个示例中，`value` 变量的值不会被 `modifyValue` 函数所改变，这体现了不可变数据的特性。原始值保持不变，而函数返回一个新的值。

**示例 2：函数组合**

swift

 代码解读

复制代码

`func addOne(x: Int64) -> Int64 {     return x + 1 } func multiplyByTwo(x: Int64) -> Int64 {     return x * 2 } func compose(f: (Int64) -> Int64, g: (Int64) -> Int64): (Int64) -> Int64 {     return { x: Int64 => f(g(x)) } } main() {     let addThenMultiply = compose(multiplyByTwo, addOne)     println(addThenMultiply(3))  // 输出 8（(3 + 1) * 2） }`

在这个示例中，`compose` 函数将两个函数 `f` 和 `g` 组合成一个新的函数，新的函数先应用 `g`，然后应用 `f`。通过组合 `addOne` 和 `multiplyByTwo` 函数，我们得到了一个新的函数 `addThenMultiply`，它先将输入加一，然后乘以二。

**示例 3：柯里化**

scss

 代码解读

复制代码

`func add(a: Int64) -> (Int64) -> Int64 {     func inner(b: Int64) -> Int64 {         return a + b     }     return inner } main() {     let addFive = add(5)     println(addFive(10))  // 输出 15 }`

在这个示例中，`add` 函数是一个柯里化函数，它返回一个新的函数 `inner`。这个新函数可以将一个整数 `b` 加到 `a` 上。通过柯里化，我们可以创建特定的加法函数（如 `addFive`），并用于后续的计算。

3\. 函数式编程的最佳实践
--------------

**a. 尽量使用不可变数据：** 不可变数据可以减少副作用，使代码更容易理解和测试。

**b. 充分利用高阶函数：** 高阶函数能够让你更灵活地操作函数，提高代码的复用性和模块化程度。

**c. 关注函数组合和柯里化：** 函数组合和柯里化能够帮助你创建更简洁和灵活的函数，提高代码的表达能力。

**d. 避免副作用：** 尽量减少函数中的副作用，使函数更具纯粹性，增强代码的可预测性。

通过理解和应用这些函数式编程特性，你可以编写更高效、灵活和可维护的代码。如果你有其他关于仓颉编程语言或函数式编程的问题，请继续讨论！

总结
--

仓颉编程语言通过嵌套函数、Lambda 表达式和闭包为开发者提供了灵活和强大的编程工具。嵌套函数支持函数内部的局部定义和返回，Lambda 表达式简化了匿名函数的定义，而闭包则允许函数访问其定义时的上下文变量。掌握这些功能能够帮助开发者更好地进行函数式编程，提高代码的灵活性和表达能力。

如果你有其他关于仓颉编程语言的问题或想了解更多高级功能，欢迎继续讨论！

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")