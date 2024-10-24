---
author: "政采云技术"
title: "函数式编程（FP）"
date: 2022-02-16
description: "写在前面 可能大家都听过武侠小说中的内功和招式，商业大佬讲的道与术，一些唱歌选秀评委口中的感情和技巧。 那程序员的江湖里是不是也存在没有感情的API 调用工程师。随着前端生态的迅速发展，目前框架、语法"
tags: ["前端","JavaScript","设计模式中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:74,comments:3,collects:55,views:5411,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![廿夕.png](/images/jueJin/2c779a7bf84e406.png)

> 这是第 134 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[函数式编程（FP）](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Ffunction-production "https://zoo.team/article/function-production")

写在前面
----

可能大家都听过武侠小说中的`内功`和`招式`，商业大佬讲的`道`与`术`，一些唱歌选秀评委口中的`感情`和`技巧`。

那程序员的江湖里是不是也存在没有感情的`API 调用工程师`。随着前端生态的迅速发展，目前框架、语法、提案都更新换代的很快。各种各样的招式层出不穷，让人应接不暇，身心俱乏，对于内力的领悟和沉淀已经迫在眉睫，因为不管框架 API 怎么变一些编程的内在思想是不会变的。

js 为了实现面向对象的思想，做了很多事情，导致大家在学习 js 的时候，会遇到复杂的原型、原型链、继承，还有对人不友好的 **this** ；而当我们用这些东西组合起来模拟面向对象的特性的时候，就更加痛苦了。但我们可以使用一种更友好的方式，函数式编程。

什么是函数式编程
--------

函数式编程（functional programing）是编程范式之一。我们常见的范式还有面向过程、面向行为、面向对象等。

范式：我们可以认为它是一种思维模式加上它的实现方法，简单说就是编程的方法论。

*   **面向过程编程**：简单解释就是按照步骤来实现。
    
*   **面向行为编程**：它是函数式编程的衍生范型，将电脑运算平展为一系列的变化，并且避免使用程序指令以及堆叠的对象。
    
*   **面向对象编程**：它的思维方式是把现实世界中的事物抽象成程序世界中的类和对象，然后通过封装，继承和多态来演示事物之间的联系。
    
*   **面向函数式编程**：它的思维方式是把现实世界中的事物和事物之间的联系，抽象到程序世界中。
    
    #### 函数式编程特点：
    
*   程序的本质：就是利用计算机的计算能力将**输入**转化成对应的**输出**。
    
*   函数式编程中的**函数**指的不是编程语言里的函数，而是数学意义上的映射关系。比如 y=sin(x) 中 x 和 y 值的映射关系。
    
*   纯函数：相同的输入获得相同的输出（无副作用）。
    
*   函数式编程就是对\*\*数据(函数)\*\*映射关系的抽象。 举个例子：
    

比如我们已知 a，b 两个直角边，求斜边长度。

`y = \sqrt{a^{2}+b^{2}}`

```javascript
//非函数式 y = (a^2 + b^2)^0.5
const a = 3；
const b = 4;
const y = Math.sqrt(a*a + b*b)

//函数式 y = f(a, b)
    const f = (a, b) => {
    return Math.sqrt(a * a + b * b)
}
const y = f(3, 4)
```

通过代码实现，我们可以看出函数式就是对过程变形关系的抽象。抽象的是处理过程，然后我们只需关注输入和输出。接下来我们看一下几种函数式编程应用。

#### 高阶函数 (high-order-function)

> 一个以函数作为参数或返回的函数。 高阶函数，它虽然听起来很复杂，但其实并不难。并且非常的实用。要完全理解这个概念，首先必须了解[头等函数](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FFirst-class_Function "https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function")（_First-Class Functions_）的概念。

头等函数简单的讲就是**函数也是一个对象，它能赋值给变量，能作为参数返回**。

**而高阶函数就是以函数为参数或返回的函数**。

```javascript
// 一个批量处理数组元素的例子
    const use = ( arr, fn ) => {
    return arr.map( i => fn(i))
}

```

#### 闭包 (closure)

> 函数和其周围词法环境的引用捆绑在一起形成闭包。 闭包的概念并不复杂，只是定义比较绕。举一段代码的🌰

```javascript
    function once(fn){
    let done = false;
        return function (){
            if(!done){
            done = true;
            fn.apply(this, arguments)
        }
    }
}

const logOnce = once(console.log)

//此时只会执行一次
logOnce(1)
logOnce(1)
```

闭包的本质是函数在执行时，会被放到执行栈上去执行，执行结束后被移除，**但是堆上作用域成员由于外部的引用而不能被释放**。因此内部函数依然可以访问外部函数的成员。

可能有的同学会问，为什么有引用不会被释放？这是因为 js 的[垃圾回收](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F04%2Fmemory-leak.html "http://www.ruanyifeng.com/blog/2017/04/memory-leak.html")机制中最常用的是标记清除和引用计数。这里我们就不展开，有兴趣的同学可以自行了解一下。

#### 纯函数 (pure function)

> 相同的输入会得到相同的输出，而且没有任何可观测的副作用。 举一个数组中纯函数和不纯函数的 🌰

```javascript
let numberArr = [1,2,3,4,5]
//纯函数
numberArr.slice(0,2) //[1,2]
numberArr.slice(0,2) //[1,2]
//不纯函数
numberArr.splice(0,2) //[1,2]
numberArr.splice(0,2) //[3,4]
```

函数式编程不会保留计算中间的结果，所以变量是不可变、无状态的。我们可以把一个函数的执行结果交给另一个函数去处理。有的时候我们会拆分很多细粒度的函数库，这里可以了解一下 [lodash](https://link.juejin.cn?target=https%3A%2F%2Flodash.com%2Fdocs%2F4.17.15 "https://lodash.com/docs/4.17.15") 功能库，它提供了丰富的对数组、数字、对象、字符串、函数等操作的方法。

纯函数的好处：

*   对于耗时的操作，可对执行结果**缓存**，提高代码性能。
*   方便测试，降低排查问题的难度。
*   在多线程环境下（web worker），可对共享内存数据任意执行。

#### 柯里化 (currying)

假设一个场景，我们需要写一个函数来判断一个人的年龄是否大于 18 岁。你可能会直接写：

```javascript
const lucy = {age: 17}
const bob = {age: 100}

    function checkAge(age){
    return age > 18
}

checkAge(lucy.age)
checkAge(bob.age)
```

这样没什么问题，但是我们如果要更改基准值的时候判断是否大于`20`，那可能有需要重新定义一个 checkAge20 的新函数了。如果这个基准一直在变... 有的同学立马就想到了，那我传入基准值就好啦。

```javascript
const lucy = {age: 17}
const bob = {age: 100}

    function checkAge(min, age){
    return age > min
}

checkAge(18, lucy.age)
checkAge(18, bob.age)
```

这样 checkAge 没什么问题，但是发现我们每次都需要输入重复的基准值。有没有什么办法可以避免重复呢？让我们试试使用闭包和高阶函数：

```javascript
    function checkAge(min){
    return function(age){ // 函数作为返回
    return age > min; // 闭包，引用外部参数
}
}

// 若果用es6的语法会更简洁
const checkAge = min => age => age > min

const checkAge18 = checkAge(18)

checkAge18(lucy.age)
```

其实我们改造道这里就是函数的柯里化。那什么是柯里化呢？

当函数有多个参数的时候，我们可以对函数进行改造，只接收部分参数，然后返回一个函数继续等待接收剩余参数，并且返回相应的结果。

#### lodash 中的 FP

![](/images/jueJin/669a5c9b7a71443.png)

在lodash的官网上，我们很容易找到一个 function program guide 。在 lodash / fp 模块中提供了实用的对函数式编程友好的方法。里面的方式有以下的特性：

*   不可变
*   已柯里化（auto-curried）
*   迭代前置（iteratee-first）
*   数据后置（data-last） 假如我们有一个需求是将空格字符串以小写“ - ”分割该如何实现呢？

例如:（CAN YOU FEEL MY WORLD --> can-you-feel-my-world）

```javascript
import _ from 'lodash'

const str = "CAN YOU FEEL MY WORLD"
const split = _.curry((sep, str)=>_.split(str, sep))
const join = _.curry((sep, arr)=>_.join(arr, sep))
const map = _.curry((fn, arr)=>_.map(arr, fn))

const f = _.flow(split(' '),map(_.toLower), join('-'))

f(str) //'can-you-feel-my-world'
```

我们在使用 lodash 时，做能很多额外的转化动作，那我们试试 fp 模块吧。

```javascript
import fp from 'lodash/fp'

const str = "CAN YOU FEEL MY WORLD"
const f = fp.flow(fp.split(' '),fp.map(fp.toLower), fp.join('-'))

f(str) //'can-you-feel-my-world'
```

这种编程方式我们称之为 PointFree，它有 3 个特点：

*   不需要指明处理的数据
*   只需要合成运算过程
*   需要定义一些辅助的基本运算函数 当然使用的时候还是需要注意一下参数的描述。官网上有一个 🌰 是这样的：

```javascript
// The `lodash/map` iteratee receives three arguments:
// (value, index|key, collection)
_.map(['6', '8', '10'], parseInt);
// ➜ [6, NaN, 2]

// The `lodash/fp/map` iteratee is capped at one argument:
// (value)
fp.map(parseInt)(['6', '8', '10']);
// ➜ [6, 8, 10]

```

FP 中的 map 方法和 lodash 中的 map 方法参数的个数是不同的。

#### 什么是函数组合

弄明白了柯里化，我们开始函数组合了。

开发过程中，有的同学使用**高阶函数**和**高阶组件**的时候很容易写出洋葱代码。

![](/images/jueJin/2a706675c132483.png)

```javascript
withRouter(Form.create()(connect(({ model }) => ({ status: model.status}))(Index)))
```

这段代码通常我们会使用`装饰器`(decorator)的方案优化掉。

```javascript
withRouter
@Form.create()
    @connect(({ model }) => ({
    status: model.status,
    }))
    Index
```

但是`装饰器`只适用于组件 Component，对于拥抱 hooks 的函数组件并不适用。

在 redux 和 lodash 都有函数组合的方法提供，分别是 compose 和 flow，`fn = compose(f1,f2,f3)`，他可以帮助我们将上面的洋葱代码改造成管道的形式。我们需要注意管道的执行顺序，默认都是从右到左执行。compose 的实现也是特别的简单的。

```javascript
    function compose(...args){
        return function(value){
            return args.reverse().reduce(function(acc,fn){
            return fn(acc)
            }, value)
        }
    }
    // es6
    const compose = (...args) => value => args.reverse().reduce((acc,fn) => fn(acc), value)
```

对于函数组合，我们也可以随时插入一些用来调试的函数。

```javascript
const log = curry((label, x) => { console.log(label, x); return x; });
const y = compose(c, log('after a'),b, log('after a'), a);
```

#### 函子（Functor）

到目前来说，我们已经了解了一定的函数式编程的基础，但是我们还没有演示在函数式编程中如何把副作用控制在可控范围内、异常处理、异步操作等。在处理副作用之前，先聊下函子。

**什么是函子？**

容器：包容值和值的变形关系（这个变形关系就是函数）。

函子：一个特殊的容器，通过一个普通的对象来实现，该对象具有 **map** 方法， map 方法可以运行一个函数对值进行处理（变形关系）。

下面我们通过一段代码来看一下：

```javascript
    class Container{
        constructor(value){
        //私有的值 不对外公布
        this._value = value
    }
    //接收一个处理值的函数
    map(fn){// map 是一个契约名称 fn 需要是一个纯函数
    //返回一个新的函子
    return new Container(fn(this._value))
}
}

new Container(1)
.map(x => x + 1)
.map(x => x * x)
```

这样我们可以通过创建时给定初始值，map 方法来修改这个值。但是一直使用 new 关键字，让代码看起来很面向对象，让我们来改造一下。

```javascript
    class Container{
    //of 的作用就是给我们返回一个函子对象，我们把 new 关键字封装在里面
        static of(value){
        return new Container(value)
    }
    
        constructor(value){
        this._value = value
    }
    
        map(fn){
        return new Container(fn(this._value))
    }
}
new Container.of(1)
.map(x => x + 1)
.map(x => x * x)
```

但是这样的一个基础的函子还是存在许多的问题，比如初始化的值与操作的方法不匹配、异常处理、可控副作用、异步执行等。因此衍生出一系列的函子来解决这些问题，这里罗列一下对应的函子和它们解决的问题：

*   **maybe 函子**: 空值问题
*   **Either 函子**：异常处理
*   **IO 函子**：副作用处理
*   **Task 函子**：异步执行
*   **Monad 函子**：IO 函子多层嵌套

主流框架、库中的应用
----------

在 Redux 中，要写一个中间件代码大致是这样的：

```javascript
    const middleware = store => next => action => {
    // 具体实现
    };
```

其实对于最后的实现主体来说无非都是拿到`storenextaction`三个参数而已。完全可以用下面的方式定义：

```javascript
(store, next, action) => {...}
```

但是作者 Dan Abramov 还是采用了更具有函数式特性的方式去定义。

另外，React 16.8 版本开始正式的支持了 hooks。hooks 对比类组件的写法有几处优势这也刚好是符合函数式编程的特性的。

*   通过自定义 hooks 来共享一些组件的逻辑，如果用类组件实现，只能通过高阶组件模拟，这样会不断嵌套，无用的“龟壳”。
*   每个方法都是**独立**的, 不需要像类组件那样在一个 mount 生命周期里做一堆不相关的操作，更新时又做一堆不相关的操作。不相关的逻辑整合在一个生命周期内，本来就是不易读、不易维护的。

```javascript
    class Example extends Component {
        componentDidMount() {
        //注册事件
        //请求Api
        //设置状态 等等
    }
        componentWillUnmount(){
        //取消一些监听事件
    }
}
```

而 Hooks（主要是 useEffect）取代了生命周期的概念，让代码的依赖逻辑更接近本质。**函数式编程为组件的编写提供了更高的灵活度与可读性**。

总结
--

函数式编程是一种范式、一种思想、一种约定。他有着一定的优势，更高的可组合性，灵活性以及容错性。但是在实际应用中是很难用函数式去表达的，我们应该将其当做我们现有储备的一种补充，而并非最优解去看待。以往的开发过程，我们可能习惯了用变量存储和追踪程序的状态，不停的在一些节点打印语句来观察程序的过程，现代的 JavaScript 库已经开始尝试拥抱函数式编程的概念以获取这些优势来降低系统复杂度。统一存储管理数据，将程序的运行状态置于可预见状态里。 React、Rxjs、Redux 等 js 库都是这一理念的最佳实践者。

参考
--

*   [函数式编程的早期历史](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F24648375%3Frefer%3Dmarisa "https://zhuanlan.zhihu.com/p/24648375?refer=marisa")
*   [lodash -- FP Guide](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flodash%2Flodash%2Fwiki%2FFP-Guide "https://github.com/lodash/lodash/wiki/FP-Guide")
*   [函数式编程初探](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2012%2F04%2Ffunctional_programming.html "http://www.ruanyifeng.com/blog/2012/04/functional_programming.html")
*   [函数式编程（五）—— 函子](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000023744960 "https://segmentfault.com/a/1190000023744960")

推荐阅读
----

[如何利用 SCSS 实现一键换肤](https://juejin.cn/post/7062496975454732301 "https://juejin.cn/post/7062496975454732301")

[浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 60 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)