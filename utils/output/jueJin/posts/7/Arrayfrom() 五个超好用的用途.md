---
author: "无名之苝"
title: "Arrayfrom() 五个超好用的用途"
date: 2019-08-29
description: "因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。 任何一种编程语言都具有超出基本用法的功能，它得益于成功的设计和试图去解决广泛问题。 JavaScript 中有一个这样的函数 Arrayfrom：允许在 JavaScript 集合(如 数组、类…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:746,comments:0,collects:772,views:52679,"
---
> 翻译：刘小夕
> 
> 原文链接：[dmitripavlutin.com/javascript-…](https://link.juejin.cn?target=https%3A%2F%2Fdmitripavlutin.com%2Fjavascript-array-from-applications%2F "https://dmitripavlutin.com/javascript-array-from-applications/")

因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

任何一种编程语言都具有超出基本用法的功能，它得益于成功的设计和试图去解决广泛问题。

`JavaScript` 中有一个这样的函数: `Array.from`：允许在 `JavaScript` 集合(如: 数组、类数组对象、或者是字符串、`map` 、`set` 等可迭代对象) 上进行有用的转换。

在本文中，我将描述5个有用且有趣的 `Array.from()` 用例。

### 1\. 介绍

在开始之前，我们先回想一下 `Array.from()` 的作用。语法:

```
Array.from(arrayLike[, mapFunction[, thisArg]])
```

*   arrayLike：必传参数，想要转换成数组的伪数组对象或可迭代对象。
*   mapFunction：可选参数，`mapFunction(item，index){...}` 是在集合中的每个项目上调用的函数。返回的值将插入到新集合中。
*   thisArg：可选参数，执行回调函数 `mapFunction` 时 this 对象。这个参数很少使用。

例如，让我们将类数组的每一项乘以2：

```
const someNumbers = { '0': 10, '1': 15, length: 2 };

Array.from(someNumbers, value => value * 2); // => [20, 30]
```

### 2.将类数组转换成数组

`Array.from()` 第一个用途：将类数组对象转换成数组。

通常，你会碰到的类数组对象有：函数中的 `arguments` 关键字，或者是一个 `DOM` 集合。

在下面的示例中，让我们对函数的参数求和：

```
    function sumArguments() {
    return Array.from(arguments).reduce((sum, num) => sum + num);
}

sumArguments(1, 2, 3); // => 6
```

`Array.from(arguments)` 将类数组对象 `arguments` 转换成一个数组，然后使用数组的 `reduce` 方法求和。

此外，`Array.from()` 的第一个参数可以是任意一个可迭代对象，我们继续看一些例子:

```
Array.from('Hey');                   // => ['H', 'e', 'y']
Array.from(new Set(['one', 'two'])); // => ['one', 'two']

const map = new Map();
map.set('one', 1)
map.set('two', 2);
Array.from(map); // => [['one', 1], ['two', 2]]
```

### 3.克隆一个数组

在 `JavaScript` 中有很多克隆数组的方法。正如你所想，`Array.from()` 可以很容易的实现数组的浅拷贝。

```
const numbers = [3, 6, 9];
const numbersCopy = Array.from(numbers);

numbers === numbersCopy; // => false
```

`Array.from(numbers)` 创建了对 `numbers` 数组的浅拷贝，`numbers === numbersCopy` 的结果是 `false`，意味着虽然 `numbers` 和 `numbersCopy` 有着相同的项，但是它们是不同的数组对象。

是否可以使用 `Array.from()` 创建数组的克隆，包括所有嵌套的？挑战一下！

```
    function recursiveClone(val) {
    return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}

const numbers = [[0, 1, 2], ['one', 'two', 'three']];
const numbersClone = recursiveClone(numbers);

numbersClone; // => [[0, 1, 2], ['one', 'two', 'three']]
numbers[0] === numbersClone[0] // => false
```

`recursiveClone()` 能够对数组的深拷贝，通过判断 数组的 `item` 是否是一个数组，如果是数组，就继续调用 `recursiveClone()` 来实现了对数组的深拷贝。

你能编写一个比使用 `Array.from()` 递归拷贝更简短的数组深拷贝吗？如果可以的话，请写在下面的评论区。

### 4\. 使用值填充数组

如果你需要使用相同的值来初始化数组，那么 `Array.from()` 将是不错的选择。

我们来定义一个函数，创建一个填充相同默认值的数组：

```
const length = 3;
const init   = 0;
const result = Array.from({ length }, () => init);

result; // => [0, 0, 0]
```

`result` 是一个新的数组，它的长度为3，数组的每一项都是0。调用 `Array.from()` 方法，传入一个类数组对象 `{ length }` 和 返回初始化值的 `mapFunction` 函数。

但是，有一个替代方法 `array.fill()` 可以实现同样的功能。

```
const length = 3;
const init   = 0;
const result = Array(length).fill(init);

fillArray2(0, 3); // => [0, 0, 0]
```

`fill()` 使用初始值正确填充数组。

#### 4.1 使用对象填充数组

当初始化数组的每个项都应该是一个新对象时，`Array.from()` 是一个更好的解决方案：

```
const length = 3;
const resultA = Array.from({ length }, () => ({}));
const resultB = Array(length).fill({});

resultA; // => [{}, {}, {}]
resultB; // => [{}, {}, {}]

resultA[0] === resultA[1]; // => false
resultB[0] === resultB[1]; // => true
```

由 `Array.from` 返回的 `resultA` 使用不同空对象实例进行初始化。之所以发生这种情况是因为每次调用时，`mapFunction`，即此处的 `() => ({})` 都会返回一个新的对象。

然后，`fill()` 方法创建的 `resultB` 使用相同的空对象实例进行初始化。不会跳过空项。

#### 4.2 使用 `array.map` 怎么样？

是不是可以使用 `array.map()` 方法来实现？我们来试一下:

```
const length = 3;
const init   = 0;
const result = Array(length).map(() => init);

result; // => [undefined, undefined, undefined]
```

`map()` 方法似乎不正常，创建出来的数组不是预期的 `[0, 0, 0]`，而是一个有3个空项的数组。

这是因为 `Array(length)` 创建了一个有3个空项的数组(也称为稀疏数组)，但是 `map()` 方法会跳过空项。

### 5\. 生成数字范围

你可以使用 `Array.from()` 生成值范围。例如，下面的 `range` 函数生成一个数组，从0开始到 `end - 1`。

```
    function range(end) {
    return Array.from({ length: end }, (_, index) => index);
}

range(4); // => [0, 1, 2, 3]
```

在 `range()` 函数中，`Array.from()` 提供了类似数组的 `{length：end}` ，以及一个简单地返回当前索引的 `map` 函数 。这样你就可以生成值范围。

### 6.数组去重

由于 `Array.from()` 的入参是可迭代对象，因而我们可以利用其与 `Set` 结合来实现快速从数组中删除重复项。

```
    function unique(array) {
    return Array.from(new Set(array));
}

unique([1, 1, 2, 3, 3]); // => [1, 2, 3]
```

首先，`new Set(array)` 创建了一个包含数组的集合，`Set` 集合会删除重复项。

因为 `Set` 集合是可迭代的，所以可以使用 `Array.from()` 将其转换为一个新的数组。

这样，我们就实现了数组去重。

### 7.结论

`Array.from()` 方法接受类数组对象以及可迭代对象，它可以接受一个 `map` 函数，并且，这个 `map` 函数不会跳过值为 `undefined` 的数值项。这些特性给 `Array.from()` 提供了很多可能。

如上所述，你可以轻松的将类数组对象转换为数组，克隆一个数组，使用初始化填充数组，生成一个范围，实现数组去重。

实际上，`Array.from()` 是非常好的设计，灵活的配置，允许很多集合转换。

你知道 `Array.from()` 的其他有趣用例吗？可以写在评论区。

### 写在最后

翻译完又是凌晨一点，果然，没有一个成年人的生活是容易的。

**谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，你的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)