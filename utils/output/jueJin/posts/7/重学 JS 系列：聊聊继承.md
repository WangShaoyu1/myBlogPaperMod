---
author: "yck"
title: "重学 JS 系列：聊聊继承"
date: 2019-04-01
description: "继承得靠原型来实现，当然原型不是这篇文章的重点，我们来复习一下即可。 对象之间通过 __proto__ 连接起来，这样称之为原型链。当前对象上不存在的属性可以通过原型链一层层往上查找，直到顶层 Object 对象 其实原型中最重要的内容就是这些了，完全没有必要去看那些长篇大论什…"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:169,comments:13,collects:218,views:8912,"
---
> 这是重学 JS 系列的第二篇文章，写这个系列的初衷也是为了夯实自己的 JS 基础。既然是重学，肯定不会从零开始介绍一个知识点，如有遇到不会的内容请自行查找资料。

原型
--

继承得靠原型来实现，当然原型不是这篇文章的重点，我们来复习一下即可。

其实原型的概念很简单：

*   所有对象都有一个属性 `__proto__` 指向一个对象，也就是原型
*   每个对象的原型都可以通过 `constructor` 找到构造函数，构造函数也可以通过 `prototype` 找到原型
*   所有函数都可以通过 `__proto__` 找到 `Function` 对象
*   所有对象都可以通过 `__proto__` 找到 `Object` 对象
*   对象之间通过 `__proto__` 连接起来，这样称之为原型链。当前对象上不存在的属性可以通过原型链一层层往上查找，直到顶层 `Object` 对象

其实原型中最重要的内容就是这些了，完全没有必要去看那些长篇大论什么是原型的文章，初学者会越看越迷糊。

当然如果你想了解更多原型的深入内容，可以阅读我 [之前写的文章](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream%2Fissues%2F2 "https://github.com/KieSun/Dream/issues/2")。

ES5 实现继承
--------

ES5 实现继承总的来说就两种办法，之前写过这方面的内容，就直接复制来用了。

总的来说这部分的内容我觉得在当下更多的是为了应付面试吧。

### 组合继承

组合继承是最常用的继承方式，

```js
    function Parent(value) {
    this.val = value
}
    Parent.prototype.getValue = function() {
    console.log(this.val)
}
    function Child(value) {
    Parent.call(this, value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

以上继承的方式核心是在子类的构造函数中通过 `Parent.call(this)` 继承父类的属性，然后改变子类的原型为 `new Parent()` 来继承父类的函数。

这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

### 寄生组合继承

这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了。

```js
    function Parent(value) {
    this.val = value
}
    Parent.prototype.getValue = function() {
    console.log(this.val)
}

    function Child(value) {
    Parent.call(this, value)
}
    Child.prototype = Object.create(Parent.prototype, {
        constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true
    }
    })
    
    const child = new Child(1)
    
    child.getValue() // 1
    child instanceof Parent // true
```

以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

Babel 如何编译 ES6 Class 的
----------------------

为什么在前文说 ES5 实现继承更多的是应付面试呢，因为我们现在可以直接使用 `class` 来实现继承。

但是 `class` 毕竟是 ES6 的东西，为了能更好地兼容浏览器，我们通常都会通过 Babel 去编译 ES6 的代码。接下来我们就来了解下通过 Babel 编译后的代码是怎么样的。

```js

    function _possibleConstructorReturn (self, call) {
    // ...
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

    function _inherits (subClass, superClass) {
    // ...
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    
    
        var Parent = function Parent () {
        // 验证是否是 Parent 构造出来的 this
        _classCallCheck(this, Parent);
        };
        
            var Child = (function (_Parent) {
            _inherits(Child, _Parent);
            
                function Child () {
                _classCallCheck(this, Child);
                
                return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
            }
            
            return Child;
            }(Parent));
```

以上代码就是编译出来的部分代码，隐去了一些非核心代码，我们先来阅读 `_inherits` 函数。

设置子类原型部分的代码其实和寄生组合继承是一模一样的，侧面也说明了这种实现方式是最好的。但是这部分的代码多了一句 `Object.setPrototypeOf(subClass, superClass)`，其实这句代码的作用是**为了继承到父类的静态方法**，之前我们实现的两种继承方法都是没有这个功能的。

然后 `Child` 构造函数这块的代码也基本和之前的实现方式类似。所以总的来说 Babel 实现继承的方式还是寄生组合继承，无非多实现了一步继承父类的静态方法。

继承存在的问题
-------

讲了这么些如何实现继承，现在我们来考虑下继承是否是一个好的选择？

总的来说，我个人不怎么喜欢继承，原因呢就一个个来说。

我们先看代码。假如说我们现在要描述几辆不同品牌的车，车必然是一个父类，然后各个品牌的车都分别是一个子类。

```js
    class Car {
        constructor (brand) {
        this.brand = brand
    }
        wheel () {
        return '4 个轮子'
    }
        drvie () {
        return '车可以开驾驶'
    }
        addOil () {
        return '车可以加油'
    }
}
Class OtherCar extends Car {}
```

这部分代码在当下看着没啥毛病，实现了车的几个基本功能，我们也可以通过子类去扩展出各种车。

但是现在出现了新能源车，新能源车是不需要加油的。当然除了加油这个功能不需要，其他几个车的基本功能还是需要的。

如果新能源车直接继承车这个父类的话，就出现了第一个问题 ，大猩猩与香蕉问题。这个问题的意思是我们现在只需要一根香蕉，但是却得到了握着香蕉的大猩猩，大猩猩其实我们是不需要的，但是父类还是强塞给了子类。继承虽然可以重写父类的方法，但是并不能选择需要继承什么东西。

另外单个父类很难描述清楚所有场景，这就导致我们可能又需要新增几个不同的父类去描述更多的场景。随着不断的扩展，代码势必会存在重复，这也是继承存在的问题之一。

除了以上两个问题，继承还存在强耦合的情况，不管怎么样子类都会和它的父类耦合在一起。

既然出现了强耦合，那么这个架构必定是脆弱的。一旦我们的父类设计的有问题，就会对维护造成很大的影响。因为所有的子类都和父类耦合在一起了，假如更改父类中的任何东西，都可能会导致需要更改所有的子类。

如何解决继承的问题
---------

继承更多的是去描述一个东西是什么，描述的不好就会出现各种各样的问题，那么我们是否有办法去解决这些问题呢？答案是组合。

什么是组合呢？你可以把这个概念想成是，你拥有各种各样的零件，可以通过这些零件去造出各种各样的产品，组合更多的是去描述一个东西能干什么。

现在我们把之前那个车的案例通过组合的方式来实现。

```js
    function wheel() {
    return "4 个轮子";
}
    function drvie() {
    return "车可以开驾驶";
}
    function addOil() {
    return "车可以加油";
}
// 油车
const car = compose(wheel, drvie, addOil)
// 新能源车
const energyCar = compose(wheel, drive)
```

从上述伪代码中想必你也发现了组合比继承好的地方。无论你想描述任何东西，都可以通过几个函数组合起来的方式去实现。代码很干净，也很利于复用。

最后
--

其实这篇文章的主旨还是后面两小节的内容，如果你还有什么疑问欢迎在评论区与我互动。

我所有的系列文章都会在我的 [Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream "https://github.com/KieSun/Dream") 中最先更新，有兴趣的可以关注下。今年主要会着重写以下三个专栏

*   重学 JS
*   React 进阶
*   重写组件

最后，觉得内容有帮助可以关注下我的公众号 「前端真好玩」咯，会有很多好东西等着你。

![](/images/jueJin/1678800c654a7f3.png)