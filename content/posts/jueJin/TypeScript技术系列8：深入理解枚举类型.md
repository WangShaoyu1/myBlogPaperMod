---
author: "黑土豆"
title: "TypeScript技术系列8：深入理解枚举类型"
date: 2024-09-23
description: "本文将深入探讨枚举类型的不同用法、它们的优势以及如何在TypeScript中高效地使用它们。赶紧来看看吧！"
tags: ["前端","TypeScript","掘金·金石计划"]
ShowReadingTime: "阅读6分钟"
weight: 388
---
前言
--

在`TypeScript`中，**枚举（Enum）** 是一种用于定义命名常量集的类型。与其他语言一样，枚举类型在构建可靠、可读性高的代码时起着重要作用，尤其是在需要处理一组相关常量的场景中。与普通的`JavaScript`不同，`TypeScript`提供了对枚举的直接支持，这使得开发者可以轻松地组织和管理这些常量。

**枚举**不仅能增强代码的可读性，还能提供类型检查、提高代码的安全性。它们在处理特定值集合时非常有用，例如一周的天数、方向、状态等场景。本文将深入探讨枚举类型的不同用法、它们的优势以及如何在`TypeScript`中高效地使用它们。

1\. 什么是枚举？
----------

**枚举（Enum）** 是将一组相关值组织在一起的一种方式。它允许开发者定义一组命名常量，赋予这些常量友好的名字，而不是直接使用数字或字符串。

在`TypeScript`中，枚举可以分为三类：**数字枚举**、**字符串枚举**和**常量枚举**。

### 1.1 数字枚举

**数字枚举**是最常见的枚举类型。在这种情况下，枚举的成员会从`0`开始递增，也可以手动赋值。

scss

 代码解读

复制代码

`enum Direction {     Up,     Down,     Left,     Right } let move: Direction = Direction.Up; console.log(move); // 输出：0`

在上面的示例中，`Direction`是一个枚举，它包含四个方向：`Up`、`Down`、`Left` 和`Right`。默认情况下，第一个枚举成员的值为`0`，后续的成员依次递增。如果你想为枚举成员赋予特定的数值，也可以手动设置。

arduino

 代码解读

复制代码

`enum Status {     Pending = 1,     Approved,     Rejected } console.log(Status.Pending);  // 输出：1 console.log(Status.Approved); // 输出：2 console.log(Status.Rejected); // 输出：3`

在这个示例中，`Pending`被显式地设置为`1`，而后续的成员`Approved`和`Rejected`会自动递增。

### 1.2 字符串枚举

与数字枚举不同，**字符串枚举**的成员必须显式赋值为字符串。这种方式允许我们定义更加明确的常量，适合表示一组固定的字符串值。

ini

 代码解读

复制代码

`enum Response {     Success = "SUCCESS",     Failure = "FAILURE",     Timeout = "TIMEOUT" } console.log(Response.Success); // 输出：SUCCESS`

在这个例子中，`Response`枚举包含了三个字符串常量，分别表示操作成功、失败和超时的状态。字符串枚举的好处在于，它们在调试和日志记录中更加直观，因为它们的值直接是可读的字符串，而不是数字。

### 1.3 常量枚举

在某些情况下，我们希望避免在编译后的`JavaScript`中生成额外的代码，尤其是当我们只需要枚举的值而不需要枚举类型的额外开销时。`TypeScript`提供了常量枚举来解决这个问题。

常量枚举通过在枚举定义前加上`const`关键字来声明。这样做的好处是，`TypeScript`在编译时会将常量枚举内联，避免生成额外的`JavaScript`代码。

typescript

 代码解读

复制代码

`const enum Color {     Red,     Green,     Blue } let color: Color = Color.Green; console.log(color); // 输出：1`

在这个例子中，`Color`枚举被声明为常量枚举，编译后的`JavaScript`代码中不会包含完整的枚举定义，只会保留对应的数值。这在性能敏感的应用中非常有用。

### 1.4 异构枚举

**异构枚举**允许枚举成员同时包含数字和字符串值。这种用法较为少见，但在某些特定场景下可能非常有用。

ini

 代码解读

复制代码

`enum Result {     No = 0,     Yes = "YES" } console.log(Result.No);  // 输出：0 console.log(Result.Yes); // 输出：YES`

虽然**异构枚举**看似灵活，但最好避免在实际项目中滥用它们，因为它们可能会使代码变得更加复杂和难以维护。

2\. 枚举的反向映射
-----------

`TypeScript`中的枚举不仅支持从名称到值的映射，还支持从值到名称的反向映射。**反向映射只适用于数字枚举**。

scss

 代码解读

复制代码

`enum Direction {     Up = 1,     Down,     Left,     Right } console.log(Direction.Up);        // 输出：1 console.log(Direction[1]);        // 输出：Up console.log(Direction[Direction.Down]); // 输出：Down`

在这个例子中，`Direction[1]`返回了`Up`，这是因为`TypeScript`自动为数字枚举生成了反向映射。这对于调试和处理动态数据非常有用。

3\. 枚举的特性
---------

`TypeScript`中的枚举具有一些特殊的特性，这使得它们在某些场景中非常强大。让我们来详细探讨这些特性。

### 3.1 枚举是可迭代的

`TypeScript`中的枚举是可迭代的，我们可以通过`Object.keys()`或`Object.values()`方法来枚举枚举的键和值。

css

 代码解读

复制代码

`enum Days {     Monday,     Tuesday,     Wednesday,     Thursday,     Friday } console.log(Object.keys(Days));   // 输出：['0', '1', '2', '3', '4', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] console.log(Object.values(Days)); // 输出：[0, 1, 2, 3, 4, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']`

通过这种方式，我们可以轻松地获取枚举的键值对，并根据需要对其进行操作。

### 3.2 枚举与类型联合

`TypeScript`中的枚举与类型联合可以结合使用，提供更强大的类型检查。假设我们有一个函数，它只接受某些特定的枚举值。

typescript

 代码解读

复制代码

``enum Status {     Pending,     Approved,     Rejected } function updateStatus(status: Status) {     switch (status) {         case Status.Pending:             console.log("Status is pending");             break;         case Status.Approved:             console.log("Status is approved");             break;         case Status.Rejected:             console.log("Status is rejected");             break;         default:             const exhaustiveCheck: never = status;             throw new Error(`Unknown status: ${exhaustiveCheck}`);     } } updateStatus(Status.Pending); // 输出：Status is pending``

在这个示例中，`updateStatus`函数接受一个`Status`类型的参数。我们使用`switch`语句来处理每个枚举成员，并通过`never`类型来确保所有枚举成员都被处理，避免遗漏。

4\. 枚举的应用场景
-----------

### 4.1 状态管理

**枚举**在处理状态时非常有用。比如在表单的提交状态中，我们可以定义一个枚举来表示不同的提交状态，如`Pending`、`Submitted` 和`Failed`。

typescript

 代码解读

复制代码

`enum FormStatus {     Pending = "PENDING",     Submitted = "SUBMITTED",     Failed = "FAILED" } function getFormStatusMessage(status: FormStatus): string {     switch (status) {         case FormStatus.Pending:             return "Form is pending submission.";         case FormStatus.Submitted:             return "Form has been submitted.";         case FormStatus.Failed:             return "Form submission failed.";     } } console.log(getFormStatusMessage(FormStatus.Pending)); // 输出：Form is pending submission.`

### 4.2 路由管理

在大型应用中，**枚举**可以用于定义路由名称，避免在应用中硬编码路由路径。

ini

 代码解读

复制代码

``enum Routes {     Home = "/home",     About = "/about",     Contact = "/contact" } function navigateTo(route: Routes) {     console.log(`Navigating to ${route}`); } navigateTo(Routes.Home); // 输出：Navigating to /home``

### 4.3 权限管理

在权限管理系统中，**枚举**可以用于定义不同的用户角色或权限级别，从而使权限判断更加直观和可维护。

ini

 代码解读

复制代码

`enum UserRole {     Admin = "ADMIN",     User = "USER",     Guest = "GUEST" } function checkPermission(role: UserRole) {     if (role === UserRole.Admin) {         console.log("Admin has full access.");     } else if (role === UserRole.User) {         console.log("User has limited access.");     } else {         console.log("Guest has no access.");     } } checkPermission(UserRole.Admin); // 输出：Admin has full access.`

5\. 枚举与对象的对比
------------

尽管**枚举**在`TypeScript`中提供了很多便利，但它们并非唯一选择。在某些场景下，我们也可以使用普通的对象来实现类似的功能。让我们比较一下枚举和对象在定义常量集时的差异。

javascript

 代码解读

复制代码

``// 使用对象 const Colors = {     Red: "RED",     Green: "GREEN",     Blue: "BLUE" } as const; type ColorsType = typeof Colors[keyof typeof Colors]; function getColor(color: ColorsType) {     console.log(`Selected color is ${color}`); } getColor(Colors.Red); // 输出：Selected color is RED``

在这个示例中，我们使用了一个普通的对象`Colors`来定义一组颜色常量，并使用`as const`保持这些常量的不可变性。相比枚举，对象的优势在于它更加灵活，但枚举在类型检查和类型推断方面具有更多的优势。

总结
--

**枚举**是`TypeScript`中强大的工具之一，能够有效地帮助我们管理和组织一组相关的常量。在本文中，我们详细介绍了枚举的不同类型（**数字枚举**、**字符串枚举**、**常量枚举**、**异构枚举**），并探讨了它们的应用场景，如状态管理、路由管理和权限管理。

无论是使用枚举还是对象，都应根据项目的需求和代码的可读性来选择适合的解决方案。希望这篇文章能帮助你更好地理解`TypeScript`中的枚举及其最佳实践。

后语
--

小伙伴们，如果觉得本文对你有些许帮助，点个👍或者➕个关注再走吧^\_^ 。另外如果本文章有问题或有不理解的部分，欢迎大家在评论区评论指出，我们一起讨论共勉。