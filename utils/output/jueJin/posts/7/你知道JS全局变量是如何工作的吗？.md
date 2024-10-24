---
author: "无名之苝"
title: "你知道JS全局变量是如何工作的吗？"
date: 2019-08-26
description: "在这篇博文中，我们将研究 JavaScript 的全局变量是如何工作的。如：scripts的范围，所谓的全局对象等等。 变量的词法作用域（简称：作用域）是可以访问它的程序的区域。JavaScript 的作用域是静态的（它们在运行时不会改变）并且它们可以嵌套 - 例如： if 语…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:52,comments:0,collects:33,views:4667,"
---
> 原文: [2ality.com/2019/07/glo…](https://link.juejin.cn?target=https%3A%2F%2F2ality.com%2F2019%2F07%2Fglobal-scope.html "https://2ality.com/2019/07/global-scope.html")
> 
> 翻译: 刘小夕

在这篇博文中，我们将研究 `JavaScript` 的全局变量是如何工作的。如：`scripts`的范围，所谓的全局对象等等。

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 1.作用域

变量的词法作用域（简称：作用域）是可以访问它的程序的区域。`JavaScript` 的作用域是静态的（它们在运行时不会改变）并且它们可以嵌套 - 例如：

```
function func() { // (A)
const foo = 1;
if (true) { // (B)
const bar = 2;
}
}
```

`if` 语句引入的作用域（行B）嵌套在函数 `func()`（行A）的作用域内。

在示例中，`func` 是 `if` 的外层作用域。

### 2.词法作用域

在 `JavaScript` 语言规范中，作用域是通过词法作用域“实现”的。它们由两部分组成：

*   将变量名映射到变量值的环境记录（可以想象成是字典）。这是 `JavaScript` 存储变量的地方。环境记录中的一个 `key-value` 条目称为绑定。
*   对外部环境的引用 - 表示当前环境所代表的作用域的外部作用域的环境。

因此，嵌套作用域树可以由嵌套环境树表示。

### 3.全局对象

全局对象是一个对象，其属性是全局变量。

*   无处不在：全局 `this`
*   全局对象的其他名称取决于平台和语言构造：
    *   window：是引用全局对象的经典方式，但它只适用于普通浏览器环境; 不在 `Node.js` 和 `Web Workers` 中。
    *   self：在浏览器中随处可用，包括 `Web Workers`。 但是 `Node.js` 不支持它。
    *   global：仅在 `Node.js` 中可用。

全局对象包含所有内置全局变量。

### 4.全局环境

全局作用域是“最外层”作用域 - 它没有外部作用域。它的环境是全局环境。每个环境都通过由外部引用链接的一系列环境与全局环境相关联。 全局环境的外部引用为 `null`。

> 全局环境结合了两个**环境记录**：

*   对象式环境记录，其作用类似于普通环境记录，但保持其绑定与对象同步。 在这种情况下，对象是全局对象。
*   声明式环境记录。

下图显示了这些数据结构。

![](/images/jueJin/16ccc10c54a7fb4.png)

接下来的两个小节将解释如何组合对象记录和声明式记录。

#### 4.1创建变量

为了创建一个真正全局的变量，你必须处于全局作用域内 - 必须要在 `scripts` 的顶层：

*   顶级 `const`，`let` 和 `class` 在声明式环境记录中创建绑定。
*   顶级 `var` 和函数声明在对象式环境记录中创建绑定。

```
<script>
const one = 1;
var two = 2;
</script>
<script>
// All scripts share the same top-level scope:
console.log(one); // 1
console.log(two); // 2

// Not all declarations create properties of the global object:
console.log(window.one); // undefined
console.log(window.two); // 2
</script>
```

此外，全局对象包含所有内置全局变量，并通过对象式记录将它们给全局环境。

#### 4.2读取/设置变量

当我们获取或设置变量并且两个环境记录都具有该变量的绑定时，声明式环境记录将获胜：

```
<script>
let foo = 1; // 声明式环境记录
globalThis.foo = 2; // 对象式环境记录

console.log(foo); // 1 (声明式记录获胜)
console.log(globalThis.foo); // 2
</script>
```

### 5.模块环境

每个模块都有自己的环境，它存储所有顶级声明 - 包括导入。模块环境的外部环境是全局环境。

### 结论：为什么JavaScript既有全局变量又有全局对象？

通常认为全局对象是错误的。因此，较新的构造（如 `const`，`let` 和 `classes`）会创建正常的全局变量，不会成为全局对象的属性。（在`script`作用域内时）。

值得庆幸的是，大多数用现代 `JavaScript` 编写的代码都存在于 `ECMAScript` 模块和`CommonJS` 模块中。每个模块都有自己的作用域，这就是为什么管理全局变量的规则很少对基于模块的代码很重要。

**最后谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)