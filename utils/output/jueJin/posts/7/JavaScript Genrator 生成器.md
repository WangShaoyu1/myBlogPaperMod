---
author: "Gaby"
title: "JavaScript Genrator 生成器"
date: 2021-09-08
description: "generator（生成器）是ES6标准引入的新的数据类型。一个generator看上去像一个函数，但可以返回多次。执行 Generator 函数会返回一个迭代器对象。"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:5,views:508,"
---
> 须知少时凌云志，曾许人间第一流。 **点个关注防止迷路！**  据说 **点赞 + 收藏 == 学会**

* * *

生成器(Generator) 的概念
------------------

ES6定义generator标准的哥们借鉴了Python的generator的概念和语法，如果你对Python的generator很熟悉，那么ES6的generator自然不在话下。

我们先复习函数的概念。一个函数是一段完整的代码，调用一个函数就是传入参数，然后返回结果：

```js
    function foo(x) {
    return x + x;
}

var r = foo(1); // 调用foo函数
```

函数在执行过程中，如果没有遇到`return`语句（函数末尾如果没有`return`，就是隐含的`return undefined;`），控制权无法交回被调用的代码。

generator（生成器）是ES6标准引入的新的数据类型。一个generator看上去像一个函数，但可以返回多次。执行 Generator 函数会返回一个迭代器对象。就是说，Generator 函数是一个生成迭代器对象的函数。

1、ES6提供的解决异步编程  
2、cenerator的数是一个状态机，内部封装了不同状态的数据  
3、用来生成遍历器对象  
4、可暂停函数（惰性求值），yield可暂停，next方法可启动。每次返回的是yield后的表达式结果

**特点：**

1、function与函数名之间有一个星号  
2、内部用yield表达式来定义不同的状态  
例如：

```js
    function* foo(){
    let result = yield 'hello'；//状态值为hello
    yield 'generator'；//状态值为generator
}
```

3、generator函数返回的是指针对象（按11章节里iterator），而不会执行两数内部逻辑  
4、调用next方法函数内部逻辑开始执行，遇到yield表达式停止，返回{value：yield后的表达式  
5、再次调用next方法会从上一次停止时的yield处开始，直到最后  
6、yield语句返回结果通常为undefined，当调用next方法时传参内容会作为启动时yield语句

创建生成器(Generator)
----------------

### 函数声明的方式

generator跟函数很像，定义如下：

```js
    function* foo(x) {
    yield x + 1;
    yield x + 2;
    return x + 3;
}
```

generator和函数不同的是，generator由`function*`定义（注意多出的`*`号），关键字 `function` 与 `函数名` 之间有一个星号 `*`，并且，除了`return`语句，还可以用`yield`返回多次。

`yield` 关键字只能在生成器 `generator` 函数中使用，否则会报错

### 函数表达式的方式

除了**函数声明**的方式创建生成器；还有**函数表达式**的方式创建生成器：

```js
    let foo = function* (arr) {
        for (let i = 0; i < arr.length; i++) {
        yield arr[i];
    }
}
let g = foo([1, 2, 3]);

console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true}
```

此时是匿名函数表达式，所以 \* 在 function 关键字和小括号之间

注意：不能通过箭头函数创建生成器，毕竟 \* 都不知该写哪里了是吧

### ES6 对象方法的简写方式

也可以用 ES6 对象方法的简写方式来创建生成器，只需要在函数名前添加一个星号 \*

```js
    let obj = {
        * createIterator(arr) {
            for (let i = 0; i < arr.length; i++) {
            yield arr[i];
        }
    }
    };
```

生成器(Generator)的调用方式
-------------------

### 1.循环：

这里会发现，普通的 for 循环和 for..in 循环都不太合适，所以用 for..of 循环 不会遍历 return 后面的内容

```js
    function* foo() {
    yield "a";
    yield "b";
    return 'c';
}
let g1 = foo();

    for (let val of g1) {
    console.log(val); // a b
}
```

### 2.解构：(不会遍历 return 后面的内容)

```js
    function* foo() {
    yield "a";
    yield "b";
    return 'c';
    };
    let [g1, g2, g3] = foo();
    console.log(g1, g2, g3); // a b undefined
```

### 3.扩展运算符：(不会遍历 return 后面的内容)

```js
    function* show() {
    yield "a";
    yield "b";
    return 'c';
    };
    let [...g1] = show();
console.log(g1); // ["a", "b"]
```

### 4.Array.from()：(不会遍历 return 后面的内容)

```js
    function* show() {
    yield "a";
    yield "b";
    return 'c';
    };
    let g1 = Array.from(show());
console.log(g1); // ["a", "b"]
```

### 5.对象的生成器方法：

生成器本身就是函数，因而可以添加到对象中，成为对象的方法

```js
    let obj = {
        createIterator: function* (arr) {
            for (let i = 0; i < arr.length; i++) {
            yield arr[i];
        }
    }
    };
    let iterator = obj.createIterator([10, 20, 30]);
console.log(iterator.next()); // {value: 10, done: false}
console.log(iterator.next()); // {value: 20, done: false}
console.log(iterator.next()); // {value: 30, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

generator返回多次的作用
----------------

generator就是能够返回多次的“函数”？返回多次有什么用？

我们以一个著名的斐波那契数列为例，它由`0`，`1`开头：

```js
0 1 1 2 3 5 8 13 21 34 ...
```

要编写一个产生斐波那契数列的函数，可以这么写：

```js
    function fib(max) {
    var
    t,
    a = 0,
    b = 1,
    arr = [0, 1];
        while (arr.length < max) {
        [a, b] = [b, a + b];
        arr.push(b);
    }
    return arr;
}

// 测试:
fib(5); // [0, 1, 1, 2, 3]
fib(10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

函数只能返回一次，所以必须返回一个`Array`。但是，如果换成generator，就可以一次返回一个数，不断返回多次。用generator改写如下：

```js
    function* fib(max) {
    var
    t,
    a = 0,
    b = 1,
    n = 0;
        while (n < max) {
        yield a;
        [a, b] = [b, a + b];
        n ++;
    }
    return;
}
```

直接调用试试：

```js
fib(5); // fib {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
```

直接调用一个generator和调用函数不一样，`fib(5)`仅仅是创建了一个generator对象，还没有去执行它。

调用generator对象有两个方法，一是不断地调用generator对象的`next()`方法：

```js
var f = fib(5);
f.next(); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}
```

`next()`方法会执行generator的代码，然后，每次遇到`yield x;`就返回一个对象`{value: x, done: true/false}`，然后“暂停”。返回的`value`就是`yield`的返回值，`done`表示这个generator是否已经执行结束了。如果`done`为`true`，则`value`就是`return`的返回值。

当执行到`done`为`true`时，这个generator对象就已经全部执行完毕，不要再继续调用`next()`了。

第二个方法是直接用`for ... of`循环迭代generator对象，这种方式不需要我们自己判断`done`：

```js
'use strict'

    function* fib(max) {
    var
    t,
    a = 0,
    b = 1,
    n = 0;
        while (n < max) {
        yield a;
        [a, b] = [b, a + b];
        n ++;
    }
    return;
}

//通过 `for` 循环，批量处理 `yield` 语句
    for (var x of fib(10)) {
    console.log(x); // 依次输出0, 1, 1, 2, 3, ...
}
```

### generator和普通函数相比，有什么用？

因为generator可以在执行过程中多次返回，所以它看上去就像一个可以记住执行状态的函数，利用这一点，写一个generator就可以实现需要用面向对象才能实现的功能。例如，用一个对象来保存状态，得这么写：

```js
    var fib = {
    a: 0,
    b: 1,
    n: 0,
    max: 5,
        next: function () {
        var
        r = this.a,
        t = this.a + this.b;
        this.a = this.b;
        this.b = t;
            if (this.n < this.max) {
            this.n ++;
            return r;
                } else {
                return undefined;
            }
        }
        };
```

用对象的属性来保存状态，相当繁琐。

generator还有另一个巨大的好处，就是把异步回调代码变成“同步”代码。这个好处要等到后面学了AJAX以后才能体会到。

没有generator之前的黑暗时代，用AJAX时需要这么写代码：

```js
    ajax('http://url-1', data1, function (err, result) {
        if (err) {
        return handle(err);
    }
        ajax('http://url-2', data2, function (err, result) {
            if (err) {
            return handle(err);
        }
            ajax('http://url-3', data3, function (err, result) {
                if (err) {
                return handle(err);
            }
            return success(result);
            });
            });
            });
```

回调越多，代码越难看。

有了generator的美好时代，用AJAX时可以这么写：

```js
    try {
    r1 = yield ajax('http://url-1', data1);
    r2 = yield ajax('http://url-2', data2);
    r3 = yield ajax('http://url-3', data3);
    success(r3);
}
    catch (err) {
    handle(err);
}
```

看上去是同步的代码，实际执行是异步的。

### 完整的`ajax` 请求实例

```js
    function ajax(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
            url,
            type: 'get',
            success: resolve,
            error: reject
            });
            });
        }
        
            function* show() {
            yield ajax('https://jsonplacehouger.typicode.com/todos/1');
            yield ajax('https://jsonplacehouger.typicode.com/todos/2');
            yield ajax('https://jsonplacehouger.typicode.com/todos/3');
            };
            
            let g1 = show();
            
                g1.next().value.then(res => {
                console.log(res);
                return g1.next().value;
                    }).then(res => {
                    console.log(res);
                    return g1.next().value;
                        }).then(res => {
                        console.log(res);
                        return g1.next().value;
                        });
```

* * *

╭╮╱╭┳━━━┳╮╱╭╮  
┃┃╱┃┃╭━╮┃┃╱┃┃  
┃╰━╯┃┃┃┃┃╰━╯┃  
╰━━╮┃┃┃┃┣━━╮┃  
╱╱╱┃┃╰━╯┃╱╱┃┃

来都来了还不点个赞再走， 据说**点赞 + 收藏 == 学会**