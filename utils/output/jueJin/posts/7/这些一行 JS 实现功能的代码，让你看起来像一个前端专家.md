---
author: "yck"
title: "这些一行 JS 实现功能的代码，让你看起来像一个前端专家"
date: 2021-01-25
description: "从复杂的框架到处理 API，有太多的东西需要学习。 但是，它也能让你只用一行代码就能做一些了不起的事情。 1 获取一个随机布尔值 (truefalse) 这个函数使用 Mathrandom() 方法返回一个布尔值（true 或 false）。Mathrandom 将在 …"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:899,comments:0,collects:1100,views:37762,"
---
> 文章译自 [此处](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fdailyjs%2F13-javascript-one-liners-thatll-make-you-look-like-a-pro-29a27b6f51cb "https://medium.com/dailyjs/13-javascript-one-liners-thatll-make-you-look-like-a-pro-29a27b6f51cb")，老外也很会写标题。标题可能有 XX 党嫌疑，但是部分内容还是挺有用的。

JavaScript 可以做很多神奇的事情！

从复杂的框架到处理 API，有太多的东西需要学习。

但是，它也能让你只用一行代码就能做一些了不起的事情。

看看这 13 句 JavaScript 单行代码，会让你看起来像个专家!

1\. 获取一个随机布尔值 (true/false)
--------------------------

这个函数使用 `Math.random()` 方法返回一个布尔值（true 或 false）。`Math.random` 将在 0 和 1 之间创建一个随机数，之后我们检查它是否高于或低于 0.5。这意味着得到真或假的几率是 50%/50%。

![](/images/jueJin/0e571c2ef1984c8.png)

```js
const randomBoolean = () => Math.random() >= 0.5;
console.log(randomBoolean());
// Result: a 50/50 change on returning true of false
```

2\. 检查日期是否为工作日
--------------

使用这个方法，你就可以检查函数参数是工作日还是周末。

![](/images/jueJin/ab3f7078cb474e3.png)

```js
const isWeekday = (date) => date.getDay() % 6 !== 0;
console.log(isWeekday(new Date(2021, 0, 11)));
// Result: true (Monday)
console.log(isWeekday(new Date(2021, 0, 10)));
// Result: false (Sunday)
```

3\. 反转字符串
---------

有几种不同的方法来反转一个字符串。以下代码是最简单的方式之一。

![](/images/jueJin/20b69fab403b4e1.png)

```js
const reverse = str => str.split('').reverse().join('');
reverse('hello world');
// Result: 'dlrow olleh'
```

4\. 检查当前 Tab 页是否在前台
-------------------

我们可以通过使用 `document.hidden` 属性来检查当前标签页是否在前台中。

![](/images/jueJin/9dc1730c9598418.png)

```js
const isBrowserTabInView = () => document.hidden;
isBrowserTabInView();
// Result: returns true or false depending on if tab is in view / focus
```

5\. 检查数字是否为偶数
-------------

最简单的方式是通过使用模数运算符（%）来解决。如果你对它不太熟悉，这里是 [Stack Overflow](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F17524673%2Funderstanding-the-modulus-operator%2F17525046%2317525046 "https://stackoverflow.com/questions/17524673/understanding-the-modulus-operator/17525046#17525046") 上的一个很好的图解。

![](/images/jueJin/5648051d5cc4464.png)

```js
const isEven = num => num % 2 === 0;
console.log(isEven(2));
// Result: true
console.log(isEven(3));
// Result: false
```

6\. 从日期中获取时间
------------

通过使用 `toTimeString()` 方法，在正确的位置对字符串进行切片，我们可以从提供的日期中获取时间或者当前时间。

![](/images/jueJin/91862d058d794f2.png)

```js
const timeFromDate = date => date.toTimeString().slice(0, 8);
console.log(timeFromDate(new Date(2021, 0, 10, 17, 30, 0)));
// Result: "17:30:00"
console.log(timeFromDate(new Date()));
// Result: will log the current time
```

7\. 保留小数点（非四舍五入）
----------------

使用 `Math.pow()` 方法，我们可以将一个数字截断到某个小数点。

![](/images/jueJin/daf594f6c24145c.png)

```js
const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
// Examples
toFixed(25.198726354, 1);       // 25.1
toFixed(25.198726354, 2);       // 25.19
toFixed(25.198726354, 3);       // 25.198
toFixed(25.198726354, 4);       // 25.1987
toFixed(25.198726354, 5);       // 25.19872
toFixed(25.198726354, 6);       // 25.198726
```

8\. 检查元素当前是否为聚焦状态
-----------------

我们可以使用 `document.activeElement` 属性检查一个元素当前是否处于聚焦状态。

![](/images/jueJin/49948a37985d479.png)

```js
const elementIsInFocus = (el) => (el === document.activeElement);
elementIsInFocus(anyElement)
// Result: will return true if in focus, false if not in focus
```

9\. 检查浏览器是否支持触摸事件
-----------------

![](/images/jueJin/be9fda2bb55942d.png)

```js
    const touchSupported = () => {
    ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
}
console.log(touchSupported());
// Result: will return true if touch events are supported, false if not
```

10\. 检查当前用户是否为苹果设备
------------------

我们可以使用 `navigator.platform` 来检查当前用户是否为苹果设备。

![](/images/jueJin/e2e020766f93455.png)

```js
const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
console.log(isAppleDevice);
// Result: will return true if user is on an Apple device
```

11\. 滚动到页面顶部
------------

`window.scrollTo()` 方法会取一个 x 和 y 坐标来进行滚动。如果我们将这些坐标设置为零，就可以滚动到页面的顶部。

**注意：IE 不支持 `scrollTo()` 方法。**

![](/images/jueJin/4c2146ebb383487.png)

```js
const goToTop = () => window.scrollTo(0, 0);
goToTop();
// Result: will scroll the browser to the top of the page
```

12\. 获取所有参数平均值
--------------

我们可以使用 `reduce` 方法来获得函数参数的平均值。

![](/images/jueJin/3b51fa7fdb6244f.png)

```js
const average = (...args) => args.reduce((a, b) => a + b) / args.length;
average(1, 2, 3, 4);
// Result: 2.5
```

13\. 转换华氏度/摄氏度。（这个应该很少在国内用到吧）
-----------------------------

处理温度有时会让人感到困惑。这 2 个功能将帮助你将华氏温度转换为摄氏温度，反之亦然。

![](/images/jueJin/566c005a9f7e46d.png)

```js
const celsiusToFahrenheit = (celsius) => celsius * 9/5 + 32;
const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;
// Examples
celsiusToFahrenheit(15);    // 59
celsiusToFahrenheit(0);     // 32
celsiusToFahrenheit(-20);   // -4
fahrenheitToCelsius(59);    // 15
fahrenheitToCelsius(32);    // 0
```

谢谢你的阅读！希望你今天能学到一些新的东西。

> 本文首发于公众号[「前端真好玩」](https://link.juejin.cn?target=)，欢迎关注。