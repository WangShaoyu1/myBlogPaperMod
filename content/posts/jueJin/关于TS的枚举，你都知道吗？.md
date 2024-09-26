---
author: "叶知秋水"
title: "关于TS的枚举，你都知道吗？"
date: 2024-08-15
description: "在TypeScript中，enum关键字提供了一种定义一组命名常量的方式，这些常量可以作为类型或值使用。枚举最早在TypeScript的第一个版本中引入，虽然它们还没有被添加到JavaSc"
tags: ["前端"]
ShowReadingTime: "阅读5分钟"
weight: 76
---
![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6d919031c6e746e7ac00093dedcc5633~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1727340589&x-signature=o13FokXfRpsgz92cZp7w%2BHTCQbQ%3D)

在 TypeScript 中，`enum` 关键字提供了一种定义一组命名常量的方式，这些常量可以作为类型或值使用。枚举最早在 TypeScript 的第一个版本中引入，虽然它们还没有被添加到 JavaScript 中，但它们在 TypeScript 中作为一个独有的运行时特性，展现了强大的功能和一些有趣的行为。

枚举特别适用于定义一组有限的、稳定的常量值，帮助开发者编写更加清晰和易于维护的代码。

### 数值枚举

数值枚举是一种将相关的成员组合在一起，并为它们自动分配从 0 开始的数值的机制。例如，以下是一个定义了 `AlbumStatus` 枚举的代码：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease,   OnSale,   StaffPick }`

在这个例子中，`AlbumStatus.NewRelease` 的值为 0，`AlbumStatus.OnSale` 为 1，依此类推。我们可以通过名称来使用这个枚举：

typescript

 代码解读

复制代码

`function logStatus(status: AlbumStatus) {   console.log(status);   // 输出 0 } logStatus(AlbumStatus.NewRelease);`

当然，你也可以为枚举的每个成员指定特定的值：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = 1,   OnSale = 2,   StaffPick = 3 }`

此时，`AlbumStatus.NewRelease` 的值为 1，`AlbumStatus.OnSale` 为 2，依次类推。

### 自动递增的数值枚举

当你只为枚举的某些成员指定了值时，TypeScript 会从最后一个指定值开始自动递增。例如：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = 1,   OnSale,   StaffPick, }`

在这个例子中，`OnSale` 会自动分配为 2，`StaffPick` 则为 3。

### 字符串枚举

字符串枚举允许你为枚举的每个成员分配字符串值，这在某些场景中会更具表达力：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = "NEW_RELEASE",   OnSale = "ON_SALE",   StaffPick = "STAFF_PICK", }`

使用字符串枚举后，`logStatus` 函数将输出字符串值：

typescript

 代码解读

复制代码

`function logStatus(status: AlbumStatus) {   console.log(status);   // 输出 "NEW_RELEASE" } logStatus(AlbumStatus.NewRelease);`

### 枚举的奇特行为

由于 JavaScript 本身没有 `enum` 关键字的等效语法，TypeScript 在为枚举制定规则时展现了一些独特的行为。

#### 数值枚举的反向映射

当 TypeScript 编译数值枚举时，会生成一个支持反向映射的对象。这意味着你不仅可以通过枚举名获取数值，还可以通过数值反向获取枚举名。例如：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease,   OnSale,   StaffPick, }`

会被编译为以下 JavaScript 代码：

javascript

 代码解读

复制代码

`var AlbumStatus; (function (AlbumStatus) {   AlbumStatus[AlbumStatus["NewRelease"] = 0] = "NewRelease";   AlbumStatus[AlbumStatus["OnSale"] = 1] = "OnSale";   AlbumStatus[AlbumStatus["StaffPick"] = 2] = "StaffPick"; })(AlbumStatus || (AlbumStatus = {}));`

这个代码段为每个枚举值创建了一个对象属性，同时生成了一个值到键的反向映射：

javascript

 代码解读

复制代码

`var AlbumStatus = {   0: "NewRelease",   1: "OnSale",   2: "StaffPick",   NewRelease: 0,   OnSale: 1,   StaffPick: 2, };`

因此，当你调用 `Object.keys(AlbumStatus)` 时，将会得到如下输出：

javascript

 代码解读

复制代码

`console.log(Object.keys(AlbumStatus)); // ["0", "1", "2", "NewRelease", "OnSale", "StaffPick"]`

#### 字符串枚举的简化行为

相比之下，字符串枚举的行为要简单得多。它不会生成反向映射，只保留枚举值：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = "NEW_RELEASE",   OnSale = "ON_SALE",   StaffPick = "STAFF_PICK", }`

编译后生成的 JavaScript 代码为：

javascript

 代码解读

复制代码

`var AlbumStatus; (function (AlbumStatus) {   AlbumStatus["NewRelease"] = "NEW_RELEASE";   AlbumStatus["OnSale"] = "ON_SALE";   AlbumStatus["StaffPick"] = "STAFF_PICK"; })(AlbumStatus || (AlbumStatus = {}));`

调用 `Object.keys(AlbumStatus)` 只会返回键值：

javascript

 代码解读

复制代码

`console.log(Object.keys(AlbumStatus)); // ["NewRelease", "OnSale", "StaffPick"]`

这种数值枚举和字符串枚举之间的差异可能会引起一定的困惑。

#### 类型差异

数值枚举和字符串枚举在用作类型时表现不同。让我们用数值枚举来定义 `logStatus` 函数：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = 0,   OnSale = 1,   StaffPick = 2, } function logStatus(status: AlbumStatus) {   console.log(status); }`

你可以直接传入枚举成员，也可以传入一个对应的数字：

javascript

 代码解读

复制代码

`logStatus(AlbumStatus.NewRelease); logStatus(0);`

但是，如果传入一个非枚举成员的数字，TypeScript 会报错：

javascript

 代码解读

复制代码

`logStatus(3); // Argument of type '3' is not assignable to parameter of type 'AlbumStatus'.`

相比之下，字符串枚举只允许枚举成员作为类型：

typescript

 代码解读

复制代码

`enum AlbumStatus {   NewRelease = "NEW_RELEASE",   OnSale = "ON_SALE",   StaffPick = "STAFF_PICK", } function logStatus(status: AlbumStatus) {   console.log(status); } logStatus(AlbumStatus.NewRelease); logStatus("NEW_RELEASE"); // Argument of type '"NEW_RELEASE"' is not assignable to parameter of type 'AlbumStatus'.`

字符串枚举的行为更接近其他语言（如 C# 和 Java）中的枚举，但它们与数值枚举的不一致性可能会让人感到困惑。特别是字符串枚举在 TypeScript 中是基于名称（名义）进行比较的，而不是像其他类型那样基于结构进行比较。这意味着即使两个字符串枚举的成员相同，但名称不同，它们也会被视为不同的类型：

typescript

 代码解读

复制代码

`enum AlbumStatus2 {   NewRelease = "NEW_RELEASE",   OnSale = "ON_SALE",   StaffPick = "STAFF_PICK", } logStatus(AlbumStatus2.NewRelease); // Argument of type 'AlbumStatus2.NewRelease' is not assignable to parameter of type 'AlbumStatus'.`

### const 枚举

`const enum` 允许你在声明枚举时使用 `const` 关键字，这种枚举在编译时会直接被替换为相应的值，不会生成任何额外的对象。使用 `const enum` 的代码如下：

typescript

 代码解读

复制代码

`const enum AlbumStatus {   NewRelease = "NEW_RELEASE",   OnSale = "ON_SALE",   StaffPick = "STAFF_PICK", }`

编译后，TypeScript 会直接将枚举的值替换到代码中：

javascript

 代码解读

复制代码

`let albumStatuses = [   "NEW_RELEASE",   "ON_SALE",   "STAFF_PICK", ];`

不过，TypeScript 团队建议在库代码中避免使用 `const enum`，因为它们可能会在库的使用者那里表现出不可预测的行为。

### 总结

在这篇文章中，我们探讨了 TypeScript 枚举的几种形式及其特性：

1.  **数值枚举** 具有反向映射的特性，并且类型不具备强制性，可以用具体值代替。
2.  **字符串枚举** 不具备反向映射，但类型具有强相等性，不会进行结构对比，也不能直接用值替代。
3.  **常量枚举** 在编译后会被替换成具体的值，而不会生成额外的 JavaScript 代码。

通过合理地使用枚举，你可以让代码更加简洁、清晰，同时增强代码的可维护性。