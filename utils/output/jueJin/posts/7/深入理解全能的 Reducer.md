---
author: "无名之苝"
title: "深入理解全能的 Reducer"
date: 2019-08-07
description: "这两段代码在功能上是等价的，都是数组中所有数字的总和，但是它们之间有一些理念差异。让我们先研究一下 reducer，因为它们功能强大，而且在编程中很重要。有成百上千篇关于 reducer 的文章，最后我会链接我喜欢的文章。 要理解 reducer 的第一点也是最重要的一点是它永…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:163,comments:25,collects:100,views:9338,"
---
> 翻译： 刘小夕
> 
> 原文链接：[css-tricks.com/understandi…](https://link.juejin.cn?target=https%3A%2F%2Fcss-tricks.com%2Funderstanding-the-almighty-reducer%2F "https://css-tricks.com/understanding-the-almighty-reducer/")

**更多文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

有一些小伙伴，对JavaScript的 `reduce` 方法还不够理解，我们来看下面两段代码：

```
const nums = [1, 2, 3];
let value = 0;

    for (let i = 0; i < nums.length; i++) {
    value += nums[i];
}
``````
const nums = [1, 2, 3];
const value = nums.reduce((ac, next) => ac + next, 0);
```

这两段代码在功能上是等价的，都是数组中所有数字的总和，但是它们之间有一些理念差异。让我们先研究一下 `reducer`，因为它们功能强大，而且在编程中很重要。有成百上千篇关于 `reducer` 的文章，最后我会链接我喜欢的文章。

#### `reducer` 是什么

要理解 `reducer` 的第一点也是最重要的一点是它永远返回一个值，这个值可以是数字、字符串、数组或对象，但它始终只能是一个。`reducer` 对于很多场景都很适用，但是它们对于将一种逻辑应用到一组值中并最终得到一个单一结果的情况特别适用。

另外需要说明：`reducer` 本质上不会改变你的初始值；相反，它们会返回一些其他的东西。

让我们回顾一下第一个例子，这样你就可以看到这里发生了什么，一起看一下下面的gif：

![](/images/jueJin/16c6786481f027e.png)

观看gif也许对我们所有帮助，不过还是要回归代码：

```
const nums = [1, 2, 3];
let value = 0;

    for (let i = 0; i < nums.length; i++) {
    value += nums[i];
}
```

数组 `nums` (\[1,2,3\]) ，数组中的每个数字的第一个值将被添加到 `value` (0)。我们遍历数组并将其每一项添加到 `value`。

让我们尝试一下不同的方法来实现此功能：

```
const nums = [1, 2, 3];
const initialValue = 0;

    const reducer = function (acc, item) {
    return acc + item;
}

const total = nums.reduce(reducer, initialValue);
```

现在我们有了相同的数组，但这次我们不会改变初始值(即前段代码中的 `value`)。这里，我们有一个仅在开始时使用的初始值。接下来，我们可以创建一个函数，它接受一个累加器(`acc`)和一个项(`item`)。累加器是在上一次调用中返回的累积值(或者是 `initialValue`)，是下一个回调的输入值。在这个例子中，你可以把它想象成一个滚下一座山的雪球，当它以每一个吃过的值的大小增长时，它会吃掉它路径中的每个值。

![](/images/jueJin/16c679c16e1adae.png)

我们将使用 `.reduce()` 来接收这个函数并从初始值开始。可以使用箭头函数简写：

```
const nums = [1, 2, 3];
const initialValue = 0;

    const reducer = (acc, item) => {
    return acc + item;
}

const total = nums.reduce(reducer, initialValue);
```

进一步缩短代码长度，我们知道箭头函数，在没有 `{}` 时，默认 `return`;

```
const nums = [1, 2, 3];
const initialValue = 0;

const reducer = (acc, item) => acc + item;

const total = nums.reduce(reducer, initialValue);
```

现在我们可以在调用它的地方应用这个函数，也可以直接设置初始值，如下:

```
const nums = [1, 2, 3];

const total = nums.reduce((acc, item) => acc + item, 0);
```

累加器可能是一个令人生畏的术语，所以当我们在回调调用上应用逻辑时，你可以将它想象成数组的当前状态。

### 调用栈

如果不清楚发生了什么，让我们记录下每次迭代的情况。`reduce` 使用的回调函数将针对数组中的每个项运行。下面的演示将有助于更清楚地说明这一点。我使用了一个不同的数组（\[1，3，6\]），因为数字与索引相同可能会令人困惑。

```
const nums = [1, 3, 6];

    const reducer4 = function (acc, item) {
    console.log(`Acc: ${acc}, Item: ${item}, Return value: ${acc + item}`);
    return acc + item;
}
const total4 = nums.reduce(reducer4, 0);
```

当我们执行这段代码时，我们会在控制台看到以下输出:

```
Acc: 0, Item: 1, Return value: 1
Acc: 1, Item: 3, Return value: 4
Acc: 4, Item: 6, Return value: 10
```

下面是一个更直观的分解：

![](/images/jueJin/16c67b01d59829c.png)

1.  累加器(`acc`)从初始值(`initialValue`)：0 开始的
2.  然后第一个 `item`是1，所以返回值是1（0+1=1）
3.  1在下次调用时成为累加器
4.  现在我们累加器是1(`acc`)，`item` (数组的第二项)是3
5.  返回值变为4（1+3=4）
6.  4在下次调用时成为累加器，调用时的下一项 `item` 是6
7.  结果是10（4+6=10），是我们的最终值，因为6是数组中的最后一项

### 简单示例

既然我们已经掌握了这一点，那么让我们来看看 `reducer` 可以做的一些常见和有用的事情。

#### 我们有多少个X？

假设您有一个数字数组，并且希望返回一个报告这些数字在数组中出现的次数的对象。请注意，这同样适用于字符串。

```
const nums = [3, 5, 6, 82, 1, 4, 3, 5, 82];

    const result = nums.reduce((tally, amt) => {
    tally[amt] ? tally[amt]++ : tally[amt] = 1;
    return tally;
    }, {});
    
    console.log(result);
//{ '1': 1, '3': 2, '4': 1, '5': 2, '6': 1, '82': 2 }

```

最初，我们有一个数组和将要放入其中的对象。在 `reducer` 中，我们首先判断这个item是否存在于累加器中，如果是存在，加1。如果不存在，添加这一项并设置为1。最后，请返回每一项出现的次数。然后，我们运行`reduce`函数，同时传递 `reducer` 和初始值。

#### 获取一个数组并将其转换为显示某些条件的对象

假设我们有一个数组，我们希望基于一组条件创建一个对象。`reduce` 在这里非常适用！现在，我们希望从数组中任意一个数字项创建一个对象，并同时显示该数字的奇数和偶数版本。

```
const nums = [3, 5, 6, 82, 1, 4, 3, 5, 82];

// we're going to make an object from an even and odd
// version of each instance of a number
    const result = nums.reduce((acc, item) => {
        acc[item] = {
        odd: item % 2 ? item : item - 1,
        even: item % 2 ? item + 1 : item
    }
    return acc;
    }, {});
    
    console.log(result);
```

控制台输出结果:

```

{ '1': { odd: 1, even: 2 },
'3': { odd: 3, even: 4 },
'4': { odd: 3, even: 4 },
'5': { odd: 5, even: 6 },
'6': { odd: 5, even: 6 },
'82': { odd: 81, even: 82 }
}
```

当我们遍历数组中的每一项时，我们为偶数和奇数创建一个属性，并且基于一个带模数运算符的内联条件，我们要么存储该数字，要么将其递增1。模算符非常适合这样做，因为它可以快速检查偶数或奇数 —— 如果它可以被2整除，它是偶数，如果不是，它是奇数。

### 其它资源

在顶部，我提到了其他一些便利的文章，这些文章有助于更熟悉 `reducer` 的作用。以下是我的最爱：

1.  [MDN文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Freduce "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce")对此非常有用。说真的，这是他们最好的帖子之一，他们也更详细地描述了如果你不提供一个初始值会发生什么，我们在这篇文章中没有提到。
2.  [Coding Train](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-LFjnY1PEDA%2522 "https://www.youtube.com/watch?v=-LFjnY1PEDA%22")
3.  [A Drip of JavaScript](https://link.juejin.cn?target=http%3A%2F%2Fadripofjavascript.com%2Fblog%2Fdrips%2Fboiling-down-arrays-with-array-reduce.html "http://adripofjavascript.com/blog/drips/boiling-down-arrays-with-array-reduce.html")

谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。 [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)