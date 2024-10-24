---
author: "政采云技术"
title: "JavaScript中的 this 指向"
date: 2023-03-22
description: "前言 JavaScript 中的 this 指向问题对于 web 前端入行不深的人来说是个比较复杂的问题。特写此文章来记录最近遇到的关于匿名函数中 this 指向问题的思考和感悟。 问题复现 最近在研"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:64,comments:0,collects:44,views:5950,"
---
![政采云技术团队.png](/images/jueJin/bfefad3ee3474e3.png)

![路威.png](/images/jueJin/d80f65bf5cc8497.png)

> 这是第 177 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[JavaScript中的 this 指向](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2Fblog%2Farticle%2Fjavascript-this "http://zoo.zhengcaiyun.cn/blog/article/javascript-this")

### 前言

JavaScript 中的 this 指向问题对于 web 前端入行不深的人来说是个比较复杂的问题。特写此文章来记录最近遇到的关于匿名函数中 this 指向问题的思考和感悟。

### 问题复现

最近在研究函数防抖场景时看到如下代码：

```plain
    function debounce(fn, delay) {
    var timer; // 维护一个 timer
        return function () {
        var _this = this; // 取 debounce 执行作用域的 this
        var args = arguments;
            if (timer) {
            clearTimeout(timer);
        }
            timer = setTimeout(function () {
            fn.apply(_this, args); // 用 apply 指向调用 debounce 的对象，相当于 _this.fn(args);
            }, delay);
            };
        }
```

其中有一段代码是 `var _this = this` 这段代码出现在由 return 返回的匿名函数中，这个时候我就有些懵逼了，因为根据我匮乏的 js 知识，这里的 this 应该是指向全局作用域才对，为什么能像注释那样指向 debounce 执行时的作用域呢？感觉如下所写是否更加合理呢？（事实证明这么写肯定是不对的）

```js
    function debounce(fn, delay) {
    var timer
    var _this = this
        return function() {
        ...
    }
}
```

于是我打算用代码来实测这里的 debounce 执行作用域中的 this 到底指的是什么，它会变化吗？还是根据我的理解只要是像这样类似的匿名函数，其中的 this 都是指向全局的呢？ 于是我写下如下代码（关键部分）：

body 部分新增一个 button 标签

```html
<button>我是button</button>
```

script 标签内部代码如下：

```js
//函数防抖
    function debounce(fn, delay) {
    var timer; // 维护一个 timer
        return function () {
        var _this = this; // 取 debounce 执行作用域的 this
        var args = arguments;
            if (timer) {
            clearTimeout(timer);
        }
            timer = setTimeout(function () {
            fn.apply(_this, args); // 用 apply 指向调用 debounce 的对象，相当于 _this.fn(args);
            }, delay);
            };
        }
        
        
    var btn = document.getElementsByTagName('button')[0]
    
        btn.onclick= debounce(function() {
        console.log(this)
        }, 1000)
```

点击按钮，看看控制台输出 this 到底是谁，按照我之前的理解输出的 this 应该是window 全局对象才对

```html
<button>我是button</button>
```

出乎意料，这里的 this 输出的是 button 元素，于是我再在上述脚本中新增一个事件绑定：

```js
    window.onclick = debounce(function() {
    console.log(this)
    }, 1000)
```

点击页面空白处输入如下：

![](/images/jueJin/72bf23384df8442.png)

这次输出的就是 window 了！ 看来这里的 this 实际是跟 debounce 函数所返回函数的实际调用者有关，第一次控制台输出的是 button 元素，因为是通过 button 元素来调用该返回函数，第二次调用者就是 widnow，举这段

```js
btn.onclick = dobounce(function() {console.log(this)}, 1000)
```

代码的例子:

1.  页面初始化完毕后，执行脚本代码，debounce 函数接收一个具体函数（将其命名为 fn 好了）和一个时间间隔参数（ intervcal ）
2.  进到 debounce 代码内部，return 一个匿名函数，并赋给 btn.onclick，实际上就是事件绑定
3.  所以说当我点击 button 的时候，btn.onclick 的执行代码是这样的：

```js
    btn.onclick = function() {
    var _this = this; // 取 debounce 执行作用域的 this
    var args = arguments;
        if (timer) {
        clearTimeout(timer);
    }
    //因为闭包的存在 timer 还是取的 debounce 中的 timer
        timer = setTimeout(function () {
        fn.apply(_this, args); // 用 apply 指向调用 debounce 的对象，相当于 _this.fn(args);
        }, delay);
    }
```

那么这里的 this 指向的就是 button 元素了，为什么呢，以上的例子引出我们今天的主题 - 函数的 this 指向

### 调用位置

关于函数的 this ，常常有句话，叫做`谁调用就指向谁`。简单来说 this 的指向跟函数的调用位置紧密相关，要想知道函数调用时 this 到底引用了什么，就应该明确函数的调用位置。一般来说需要通过函数的调用栈来判断来分析出函数真正的调用位置，具体怎么分析呢？除了目测代码外，还也可以借用浏览器的开发者工具（ debug 工具），去推断目标函数到底是在哪里调用的，这样才能更准确的知晓this的指向。比如下面这段代码：

```js
    function foo() {
    console.log('foo')
}

    function bar() {
    console.log('bar')
    foo()
}

bar()
```

要想知道 foo 函数是由谁调用的，就可以在浏览器中打开调试工具，在 foo 函数中的第一行打一个断点，找到函数的调用栈，然后再找到栈中的第二个元素，这就是真正的调用位置。如下图所示： ![](/images/jueJin/93898e169474469.png)

从浏览器的调试工具可以找到 foo 函数的真正调用位置。

### 默认绑定

```js
var a = 2
    function foo() {
    var a = 3
    console.log(this.a)
}

foo() // 2
```

输出结果为 2。因为 foo 函数调用时处于全局环境下（这里是 window ），查看一下浏览器中的调用栈： ![](/images/jueJin/2ee6bb790a87417.png)

调用栈中只有 foo 函数一个元素，说明调用者就是当前的全局环境 window ，所以这里的 this 指向的就是 window，因为最外部的 a 一开始是最为 window.a 声明并赋值的,所以可以理解为`this = window; this.a = 2`。比较特殊的一点就是，如果在 foo 函数内部采用了严格模式，那么 this 就会绑定到 undefined:

```js
var a = 2
    function foo() {
    'use strict'
    var a = 3
    console.log(this.a)
}

foo() //`//Cannot read property 'a' of undefined`
```

### 隐式绑定

举如下代码为例：

```js
var a = 2
    function foo() {
    console.log(this.a)
}

    var obj1 = {
    a:3,
    foo: foo
}

obj.foo() //3
```

输出结果为 3，说明这里的 this 指向的是 obj1，为什么不再是指向全局环境了呢。在这里就要考虑到调用位置是否存在上下文对象，或者说是否被某个对象拥有或包含。在上述的代码中，foo 函数的引用被赋给了 obj1 的 foo 属性`obj1.foo = foo`, 并且在 foo 函数被调用时，它的前面也加上了对 obj1 的引用。此时，当函数引用有上下文对象时，隐式绑定规则就会将函数中的this绑定到这个上下文对象，这里的上下文对象就是 obj1。 其实在理解**上下文对象时，**个人觉得不用那么抽象，它无非就是一个**不确定**的代名词，简单来说你觉得它是什么，那它就是什么。

### 显式绑定

默认绑定和隐式绑定在我看来是 js 的一个内置且被动的绑定方式，就是已经这么帮你设定好了，只要符合这两个规则且没有其他规则存在那么 this 的指向就按照这两个规则来。显然，这类被动的绑定方式并不符合实际的代码编写需要，比如我要指定一个函数的 this ，该怎么办呢？这时候就需要显式绑定了。call、apply 会在显式绑定时发挥作用。参考如下代码：

```js
    function foo() {
    console.log(this.a)
}

    var obj1 = {
    a: 2
}

var a = 3

foo.call(obj1) // 2
```

输出结果为 2。原因是因为 call 方法改变了 foo 函数运行的 this 指向，将原本 this 指向的 window 全局转为了指向 obj1 ，所以输出的是 2，从这里也可以看出，显示绑定的优先级大于默认绑定。

### new 绑定

首先应该明确一点，JavaScript 中的 new 与其他面向类的语言不同，在 js 中 new 后面的只不过是一个普通的函数，仅仅是被 new 操作符调用了而已。使用 new 调用函数时，会执行如下步骤：

1.  创建（或者说构造）一个全新的对象。
2.  这个新对象会被执行 \[\[Prototype\]\] 连接。
3.  这个新对象会绑定到函数调用的 this。
4.  如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。 代码如下所示：

```js
    function foo(a) {
    this.a = a
}

var bar = new foo(2)

console.log(bar.a) // 2
```

输出结果为 2。

### 不适用的情况

ES6 中出现了一种特殊的函数：箭头函数。以上的四种规则在箭头函数中都不适用，箭头函数的是根据外层函数或者全局链决定 this 的。其实这也是对以往 ES6 之前的较为复杂的 this 绑定规则的优化和统一，在实际编码的过程中更容易让人理解，当然箭头函数也有缺点，这里就不再展开。

### 总结

在写这篇总结文章之前，一直对 js 中的 this 问题理解不深，翻了几遍《你不知道的JavaScript》才算真正有所学习和领悟。本文写的并不具体，就 this 绑定时的绑定丢失问题并没有展开叙述，绑定的规则优先级也没有写全，暂时先留个坑，后面再来填坑 ！

### 参考文献

*   《你不知道的JavaScript》

推荐阅读
----

[0基础实现项目自动化部署](https://juejin.cn/post/7207787191623647288 "https://juejin.cn/post/7207787191623647288")

[uni-app 黑魔法探秘 （一）—— 重写内置标签](https://juejin.cn/post/7205216832834584613 "https://juejin.cn/post/7205216832834584613")

[前端 DDD 框架 Remesh 的浅析](https://juejin.cn/post/7200037182927585335 "https://juejin.cn/post/7200037182927585335")

[如何做一个看板搭建系统](https://juejin.cn/post/7197433202171854885 "https://juejin.cn/post/7197433202171854885")

[微前端框架qiankun的沙箱方案解析](https://juejin.cn/post/7210387904748552247 "https://juejin.cn/post/7210387904748552247")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2F "http://zoo.zhengcaiyun.cn/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云研发部，Base 在风景如画的杭州。团队现有 80 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)