---
author: "yck"
title: "带你理解 JS 容易出错的坑和细节"
date: 2017-11-01
description: "当执行 JS 代码时，会生成执行环境，只要代码不是写在函数中的，就是在全局执行环境中，函数中的代码会产生函数执行环境，只此两种执行环境。 想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:619,comments:25,collects:246,views:12920,"
---
> 目前自己组建的一个团队正在写一份面试图谱，将会在七月中旬开源。内容十分丰富，第一版会开源前端方面知识和程序员必备知识，后期会逐步写入后端方面知识。因为工程所涉及内容太多（目前已经写了一个半月），并且还需翻译成英文，所以所需时间较长。有兴趣的同学可以 Follow [我的 Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun "https://github.com/KieSun") 得到最快的更新消息。

执行环境（Execution context）
-----------------------

#### var 和 let 的正确解释

当执行 JS 代码时，会生成执行环境，只要代码不是写在函数中的，就是在全局执行环境中，函数中的代码会产生函数执行环境，只此两种执行环境。

接下来让我们看一个老生常谈的例子，`var`

```
b() // call b
console.log(a) // undefined

var a = 'Hello world'

    function b() {
    console.log('call b')
}
```

想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行环境时，会有两个阶段。第一个阶段是创建的阶段，JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```
b() // call b second

    function b() {
    console.log('call b fist')
}
    function b() {
    console.log('call b second')
}
var b = 'Hello world'
```

`var` 会产生很多错误，所以在 ES6中引入了 `let`。`let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了，在第一阶段内存也已经为他开辟好了空间，但是因为这个声明的特性导致了并不能在声明前使用。

#### 作用域

```
    function b() {
    console.log(value)
}

    function a() {
    var value = 2
    b()
}

var value = 1
a()
```

可以考虑下 b 函数中输出什么。你是否会认为 b 函数是在 a 函数中调用的，相应的 b 函数中没有声明 `value` 那么应该去 a 函数中寻找。其实答案应该是 1。

当在产生执行环境的第一阶段时，会生成 `[[Scope]]` 属性，这个属性是一个指针，对应的有一个作用域链表，JS 会通过这个链表来寻找变量直到全局环境。这个指针指向的上一个节点就是该函数声明的位置，因为 b 是在全局环境中声明的，所以 `value` 的声明会在全局环境下寻找。如果 b 是在 a 中声明的，那么 log 出来的值就是 2 了。

#### 异步

JS 是门同步的语言，你是否疑惑过那么为什么 JS 还有异步的写法。其实 JS 的异步和其他语言的异步是不相同的，本质上还是同步。因为浏览器会有多个 Queue 存放异步通知，并且每个 Queue 的优先级也不同，JS 在执行代码时会产生一个执行栈，同步的代码在执行栈中，异步的在 Queue 中。有一个 Event Loop 会循环检查执行栈是否为空，为空时会在 Queue 中查看是否有需要处理的通知，有的话拿到执行栈中去执行。

```
    function sleep() {
    var ms = 2000 + new Date().getTime()
while( new Date() < ms) {}
console.log('sleep finish')
}

    document.addEventListener('click', function() {
    console.log('click')
    })
    
    sleep()
        setTimeout(function() {
        console.log('timeout');
        }, 0);
        
            Promise.resolve().then(function() {
            console.log('promise');
            });
            console.log('finish')
```

以上代码如果你在 `sleep` 被调用期间点击，只有当 `sleep` 执行结束并且 log finish 后才会响应其他异步事件。所以要注意 `setTimeout` 并不是你设定多久 JS 就会准时的响应，并且 `setTimeout` 也有个小细节，第二个参数设置为 0 也许会有人认为这样就不是异步了，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。

以下输出建立在 Chrome 上，不同的浏览器会有不同的输出

```
promise // promise 会进入 Microtask Queue 中，这个 Queue 会优先执行
timeout // setTimeout 会进入 task Queue 中
click // 点击事件会进入 Event Queue 中
```

类型
--

#### 原始值

JS 共有 6 个原始值，分别为 `Boolean, Null, Undefined, Number, String, Symbol`，这些类型都是值不可变的。

有一个易错的点是：虽然 `typeof null` 是 object 类型，但是 Null 不是对象，这是 JS 语言的一个很久远的 Bug 了。

#### 深浅拷贝

对于对象来说，直接将一个对象赋值给另外一个对象就是浅拷贝，两个对象指向同一个地址，其中任何一个对象改变，另一个对象也会被改变

```
var a = [1, 2]
var b = a
b.push(3)
console.log(a, b) // -> 都是 [1, 2, 3]
```

有些情况下我们可能不希望有这种问题，那么深拷贝可以解决这个问题。深拷贝不仅将原对象的各个属性逐个复制出去，而且将原对象各个属性所包含的对象也依次采用深复制的方法递归复制到新对象上。深拷贝有多种写法，有兴趣的可以看[这篇文章](https://link.juejin.cn?target=http%3A%2F%2Fjerryzou.com%2Fposts%2Fdive-into-deep-clone-in-javascript%2F "http://jerryzou.com/posts/dive-into-deep-clone-in-javascript/")

函数和对象
-----

#### this

this 是很多人会混淆的概念，但是其实他一点都不难，你只需要记住几个规则就可以了。

```
    function foo() {
    console.log(this.a)
}
var a = 2
foo()

    var obj = {
    a: 2,
    foo: foo
}
obj.foo()

// 以上两者情况 this 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，this 只会绑定在 c 上
var c = new foo()
c.a = 3
console.log(c.a)

// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

以上几种情况明白了，很多代码中的 this 应该就没什么问题了，下面让我们看看箭头函数中的 this

```
    function a() {
        return () => {
            return () => {
            console.log(this)
        }
    }
}
console.log(a()()())
```

箭头函数其实是没有 this 的，这个函数中的 this 只取决于他外面的第一个不是箭头函数的函数的 this。在这个例子中，因为调用 a 符合前面代码中的第一个情况，所以 this 是 window。并且 this 一旦绑定了上下文，就不会被任何代码改变。

下面我们再来看一个例子，很多人认为他是一个 JS 的问题

```
    var a = {
    name: 'js',
        log: function() {
        console.log(this)
            function setName() {
            this.name = 'javaScript'
            console.log(this)
        }
        setName()
    }
}
a.log()
```

setName 中的 this 指向了 window，很多人认为他应该是指向 a 的。这里其实我们不需要去管函数是写在什么地方的，我们只需要考虑函数是怎么调用的，这里符合上述第一个情况，所以应该是指向 window。

#### 闭包和立即执行函数

闭包被很多人认为是一个很难理解的概念。其实闭包很简单，就是一个能够访问父函数局部变量的函数，父函数在执行完后，内部的变量还存在内存上让闭包使用。

```
    function a(name) {
    // 这就是闭包，因为他使用了父函数的参数
        return function() {
        console.log(name)
    }
}
var b = a('js')
b() // -> js
```

现在来看一个面试题

```
    function a() {
var array = []

    for(var i = 0; i < 3; i++) {
    array.push(
        function() {
        console.log(i)
    }
    )
}

return array
}

var b = a()
b[0]()
b[1]()
b[2]()
```

这个题目因为 `i` 被提升了，所以 `i = 3`，当 a 函数执行完成后，内存中保留了 a 函数中的变量 i。数组中 push 进去的只是声明，并没有执行函数。所以在执行函数时，输出了 3 个 3。

如果我们想输出 0 ，1，2 的话，有两种简单的办法。第一个是在 for 循环中，使用 `let` 声明一个变量，保存每次的 i 值，这样在 a 函数执行完成后，内存中就保存了 3 个不同 let 声明的变量，这样就解决了问题。

还有个办法就是使用立即执行函数，创建函数即执行，这样就可以保存下当前的 i 的值。

```
    function a() {
var array = []

    for(var i = 0; i < 3; i++) {
    array.push(
        (function(j) {
            return function() {
            console.log(j)
        }
        }(i))
        )
    }
    
    return array
}
```

立即执行函数其实就是直接调用匿名函数

```
function() {} ()
```

但是以上写法会报错，因为解释器认为这是一个函数声明，不能直接调用，所以我们加上了一个括号来让解释器认为这是一个函数表达式，这样就可以直接调用了。

所以我们其实只需要让解释器认为我们写了个函数表达式就行了，其实还有很多种立即执行函数写法

```
true && function() {} ()
new && function() {} ()
```

立即执行函数最大的作用就是模块化，其次就是解决上述闭包的问题了。

#### 原型，原型链和 instanceof 原理

原型可能很多人觉得很复杂，本章节也不打算重复复述很多文章都讲过的概念，你只需要看懂我画的图并且自己实验下即可

```
    function P() {
    console.log('object')
}

var p = new P()

```

![](/images/jueJin/7ce8b9b38da9f3f.png)

原型链就是按照 `__proto__` 寻找，直到 Object。`instanceof` 原理也是根据原型链判断的

```
p instanceof P // true
p instanceof Object // true
```

![](/images/jueJin/1611c0fce502004.png)