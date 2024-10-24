---
author: "华为云开发者联盟"
title: "ES6生成器，看似同步的异步流程控制表达风格"
date: 2024-04-10
description: "本文分享自华为云社区《3月阅读周·你不知道的JavaScript  ES6生成器，看似同步的异步流程控制表达风格》，JavaScript开发者在代码中几乎普遍依赖的一个假定：一个函数一旦开始执行。"
tags: ["前端","JavaScript","函数式编程中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:7,views:2851,"
---
本文分享自华为云社区《[3月阅读周·你不知道的JavaScript | ES6生成器，看似同步的异步流程控制表达风格](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F424397%3Futm_source%3Dzhihu%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/424397?utm_source=zhihu&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： 叶一一。

生成器
===

打破完整运行
------

JavaScript开发者在代码中几乎普遍依赖的一个假定：一个函数一旦开始执行，就会运行到结束，期间不会有其他代码能够打断它并插入其间。

ES6引入了一个新的函数类型，它并不符合这种运行到结束的特性。这类新的函数被称为生成器。

```scss
var x = 1;

    function foo() {
    x++;
    bar(); // <-- 这一行在x++和console.log(x)语句之间运行
    console.log('x:', x);
}

    function bar() {
    x++;
}

foo(); // x: 3
```

如果bar()并不在那里会怎样呢？显然结果就会是2，而不是3。最终的结果是3，所以bar()会在x++和console.log(x)之间运行。

但JavaScript并不是抢占式的，（目前）也不是多线程的。然而，如果foo()自身可以通过某种形式在代码的这个位置指示暂停的话，那就仍然可以以一种合作式的方式实现这样的中断（并发）。

下面是实现合作式并发的ES6代码：

```javascript
var x = 1;

    function* foo() {
    x++;
    yield; // 暂停！
    console.log('x:', x);
}

    function bar() {
    x++;
}
// 构造一个迭代器it来控制这个生成器
var it = foo();

// 这里启动foo()！
it.next();
console.log('x:', x); // 2
bar();
console.log('x:', x); // 3
it.next(); // x: 3
```

*   it = foo()运算并没有执行生成器＊foo()，而只是构造了一个迭代器（iterator），这个迭代器会控制它的执行。
*   ＊foo()在yield语句处暂停，在这一点上第一个it.next()调用结束。此时＊foo()仍在运行并且是活跃的，但处于暂停状态。
*   最后的it.next()调用从暂停处恢复了生成器＊foo()的执行，并运行console.log(..)语句，这条语句使用当前x的值3。

生成器就是一类特殊的函数，可以一次或多次启动和停止，并不一定非得要完成。

输入和输出
-----

生成器函数是一个特殊的函数，它仍然有一些函数的基本特性。比如，它仍然可以接受参数（即输入），也能够返回值（即输出）。

```ini
    function* foo(x, y) {
    return x * y;
}

var it = foo(6, 7);
var res = it.next();

res.value; // 42
```

向＊foo(..)传入实参6和7分别作为参数x和y。＊foo(..)向调用代码返回42。

多个迭代器
-----

每次构建一个迭代器，实际上就隐式构建了生成器的一个实例，通过这个迭代器来控制的是这个生成器实例。

同一个生成器的多个实例可以同时运行，它们甚至可以彼此交互：

```ini
    function* foo() {
    var x = yield 2;
    z++;
    var y = yield x * z;
    console.log(x, y, z);
}

var z = 1;

var it1 = foo();
var it2 = foo();

var val1 = it1.next().value; // 2 <-- yield 2
var val2 = it2.next().value; // 2 <-- yield 2

val1 = it1.next(val2 * 10).value; // 40   <-- x:20,  z:2
val2 = it2.next(val1 * 5).value; // 600  <-- x:200, z:3

it1.next(val2 / 2); // y:300
// 20300 3
it2.next(val1 / 4); // y:10
// 200 10 3
```

简单梳理一下执行流程：

(1) ＊foo()的两个实例同时启动，两个next()分别从yield 2语句得到值2。

(2) val2 ＊ 10也就是2 ＊ 10，发送到第一个生成器实例it1，因此x得到值20。z从1增加到2，然后20 ＊ 2通过yield发出，将val1设置为40。

(3) val1 ＊ 5也就是40 ＊ 5，发送到第二个生成器实例it2，因此x得到值200。z再次从2递增到3，然后200 ＊ 3通过yield发出，将val2设置为600。

(4) val2 / 2也就是600 / 2，发送到第一个生成器实例it1，因此y得到值300，然后打印出x y z的值分别是20300 3。

(5) val1 / 4也就是40 / 4，发送到第二个生成器实例it2，因此y得到值10，然后打印出x y z的值分别为200 10 3。

生成器产生值
======

生产者与迭代器
-------

假定你要产生一系列值，其中每个值都与前面一个有特定的关系。要实现这一点，需要一个有状态的生产者能够记住其生成的最后一个值。

迭代器是一个定义良好的接口，用于从一个生产者一步步得到一系列值。JavaScript迭代器的接口，就是每次想要从生产者得到下一个值的时候调用next()。

可以为数字序列生成器实现标准的迭代器接口：

```javascript
    var something = (function () {
    var nextVal;
    
        return {
        // for..of循环需要
            [Symbol.iterator]: function () {
            return this;
            },
            
            // 标准迭代器接口方法
                next: function () {
                    if (nextVal === undefined) {
                    nextVal = 1;
                        } else {
                        nextVal = 3 * nextVal + 6;
                    }
                    
                    return { done: false, value: nextVal };
                    },
                    };
                    })();
                    
                    something.next().value; // 1
                    something.next().value; // 9
                    something.next().value; // 33
                    something.next().value; // 105
```

next()调用返回一个对象。这个对象有两个属性：done是一个boolean值，标识迭代器的完成状态；value中放置迭代值。

iterable
--------

iterable（可迭代），即指一个包含可以在其值上迭代的迭代器的对象。

从ES6开始，从一个iterable中提取迭代器的方法是：iterable必须支持一个函数，其名称是专门的ES6符号值Symbol.iterator。调用这个函数时，它会返回一个迭代器。通常每次调用会返回一个全新的迭代器，虽然这一点并不是必须的。

```css
var a = [1, 3, 5, 7, 9];

    for (var v of a) {
    console.log(v);
}
// 1 3 5 7 9
```

上面的代码片段中的a就是一个iterable。for..of循环自动调用它的Symbol.iterator函数来构建一个迭代器。

```csharp
    for (var v of something) {
    ..
}
```

for..of循环期望something是iterable，于是它寻找并调用它的Symbol.iterator函数。

生成器迭代器
------

可以把生成器看作一个值的生产者，我们通过迭代器接口的next()调用一次提取出一个值。

生成器本身并不是iterable，当你执行一个生成器，就得到了一个迭代器：

```javascript
function *foo(){ .. }

var it = foo();
```

可以通过生成器实现前面的这个something无限数字序列生产者，类似这样：

```ini
    function* something() {
    var nextVal;
    
        while (true) {
            if (nextVal === undefined) {
            nextVal = 1;
                } else {
                nextVal = 3 * nextVal + 6;
            }
            
            yield nextVal;
        }
    }
```

因为生成器会在每个yield处暂停，函数＊something()的状态（作用域）会被保持，即意味着不需要闭包在调用之间保持变量状态。

异步迭代生成器
=======

```javascript
    function foo(x, y) {
        ajax('http://some.url.1/? x=' + x + '&y=' + y, function (err, data) {
            if (err) {
            // 向*main()抛出一个错误
            it.throw(err);
                } else {
                // 用收到的data恢复*main()
                it.next(data);
            }
            });
        }
        
            function* main() {
                try {
                var text = yield foo(11, 31);
                console.log(text);
                    } catch (err) {
                    console.error(err);
                }
            }
            
            var it = main();
            
            // 这里启动！
            it.next();
```

在yield foo(11,31)中，首先调用foo(11,31)，它没有返回值（即返回undefined），所以发出了一个调用来请求数据，但实际上之后做的是yield undefined。

这里并不是在消息传递的意义上使用yield，而只是将其用于流程控制实现暂停/阻塞。实际上，它还是会有消息传递，但只是生成器恢复运行之后的单向消息传递。

看一下foo(..)。如果这个Ajax请求成功，我们调用：

```ini
it.next(data);
```

这会用响应数据恢复生成器，意味着暂停的yield表达式直接接收到了这个值。然后随着生成器代码继续运行，这个值被赋给局部变量text。

总结
==

我们来总结一下本篇的主要内容：

*   生成器是ES6的一个新的函数类型，它并不像普通函数那样总是运行到结束。取而代之的是，生成器可以在运行当中（完全保持其状态）暂停，并且将来再从暂停的地方恢复运行。
*   yield/next(..)这一对不只是一种控制机制，实际上也是一种双向消息传递机制。yield .．表达式本质上是暂停下来等待某个值，接下来的next(..)调用会向被暂停的yield表达式传回一个值（或者是隐式的undefined）。
*   在异步控制流程方面，生成器的关键优点是：生成器内部的代码是以自然的同步/顺序方式表达任务的一系列步骤。其技巧在于，把可能的异步隐藏在了关键字yield的后面，把异步移动到控制生成器的迭代器的代码部分。
*   生成器为异步代码保持了顺序、同步、阻塞的代码模式，这使得大脑可以更自然地追踪代码，解决了基于回调的异步的两个关键缺陷之一。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")