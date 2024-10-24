---
author: "Gaby"
title: "JavaScript 数据类型之 Symbol、BigInt"
date: 2021-08-26
description: "在JavaScript中，我们已知有5种基本数据类型：`String`、`Number`、`Boolean`、`Undefined`、`Null`。"
tags: ["面试","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:15,comments:0,collects:37,views:6319,"
---
**这是我参与8月更文挑战的第24天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

### JavaScript数据类型

在JavaScript中，我们已知有5种基本数据类型：`String`、`Number`、`Boolean`、`Undefined`、`Null`。

当ES6问世，直至今日，又新增了两种基本数据类型：`Symbol`（ES新增）、`BigInt`（ES10新增）

### Symbol

Symbol 指的是独一无二的值。每个通过 Symbol() 生成的值都是唯一的。

symbol 是一种基本数据类型（primitive data type）。Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法：“new Symbol()”。

每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。

```js
let var_symbol = Symbol();
let other_symbol = Symbol();
console.log(var_symbol === other_symbol);
// false
console.log(typeof var_symbol);
// symbol
console.log(var_symbol.constructor === Symbol)
// true
```

那么，如何使用 Symbol 创建两个可以相等的变量呢？

```js
let var_symbol = Symbol.for('symbol');
let other_symbol = Symbol.for('symbol');
console.log(var_symbol === other_symbol)
// true
```

Symbol.for(key) 方法会根据给定的键 key(字符串)，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。

和 Symbol() 不同的是，用 Symbol.for() 方法创建的的 symbol 会被放入一个全局 symbol 注册表中。Symbol.for() 并不是每次都会创建一个新的 symbol，它会首先检查给定的 key 是否已经在注册表中了。假如是，则会直接返回上次存储的那个。否则，它会再新建一个。

#### 应用场景：

1.  使用Symbol来作为对象属性名(key)
2.  使用Symbol来替代常量
3.  使用Symbol定义类的私有属性/方法

### BigInt

BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数。而在其他编程语言中，可以存在不同的数字类型，例如:整数、浮点数、双精度数或大斐波数。

JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制。一是数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行科学和金融方面的精确计算。二是大于或等于2的1024次方的数值，JavaScript 无法表示，会返回Infinity。

```js
// 超过 53 个二进制位的数值，无法保持精度
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true

// 超过 2 的 1024 次方的数值，无法表示
Math.pow(2, 1024) // Infinity
```

ES2020 引入了一种新的数据类型 BigInt，来解决这个问题。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

为了与 Number 类型进行区分，BigInt 类型的数据必须添加后缀n。

```js
12 	// 普通Number
12n // BigInt

// BigInt 的运算
1n + 2n // 3n

// 与Number 类型进行运算
1 + 1n // Uncaught TypeError
```

BigInt 与普通整数是两种值，它们之间并不相等。

```js
12n === 12 // false
```

由于 BigInt 与 Number 完全属于两种类型,并且不会进行隐式转换，所以没有办法进行混合运算。想要运算的话，必须将两种数据类型转换为同一张后，方可进行计算：

```js
BigInt(number) // 将一个 Number 转换为 BigInt
Number(bigint) // 将一个 BigInt 转换为 Number
```

typeof 运算符对于 BigInt 类型的数据返回 bigint。

```js
typeof 12n // 'bigint'
```

由于 BigInt 并不是一个构造函数，所以，不能使用 new BigInt() 的方式来构建实例

```js
new BigInt()
// Uncaught TypeError: BigInt is not a constructor at new BigInt
```

另外，当你创建一个 BigInt 的时候，参数必须为整数，否则或报错

```js
BigInt(1.2)
// Uncaught RangeError: The number 1.2 cannot be converted to a BigInt because it is not an integer
```