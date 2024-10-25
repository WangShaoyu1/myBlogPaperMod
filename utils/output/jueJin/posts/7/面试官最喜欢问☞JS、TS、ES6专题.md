---
author: "Gaby"
title: "面试官最喜欢问☞JS、TS、ES6专题"
date: 2021-08-13
description: "由于之前面试题篇幅有限，特又综合整理了些当下面试中常遇到的知识点，面试题及面经只是起到参考作用，圈定个大致的复习范围，以求得事半功倍。但每个面试官的执业经验，技术栈有所不同因而面试内容也会有所不同，以"
tags: ["前端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读51分钟"
weight: 1
selfDefined:"likes:16,comments:0,collects:39,views:1104,"
---
**这是我参与8月更文挑战的第11天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

**最新更新时间：2020年08月21日 19:36**

* * *

前言
--

本专题按照以下几个方便进行整理：

*   JavaScript
*   TypeScript
*   ES6

适合初次全面复习的同学，查缺补漏，知识面比较全，复习完成后，再按照本人整理的面试高频题配合复习，使得找工作事半功倍，一定要理解，不要死记硬背，对于一些概念性的和原理的内容要深入理解。由于之前面试题篇幅有限，特又综合整理了些当下面试中常遇到的知识点，面试题及面经只是起到参考作用，圈定个大致的复习范围，以求得事半功倍。但每个面试官的执业经验，技术栈有所不同因而面试内容也会有所不同，以此共勉，再接再厉！**持续更新中...**

> “你从头读，尽量往下读，直到你一窍不通时，再从头开始，这样坚持往下读，直到你完全读懂为止。”

JavaScript
----------

ECMAScript 最初被设计为一种_Web 脚本语言_，提供一种机制来使浏览器中的 Web 页面活跃起来，并作为基于 Web 的客户端-服务器架构的一部分来执行服务器计算。ECMAScript 现在用于为各种[主机](https://link.juejin.cn?target=http%3A%2F%2F262.ecma-international.org%2F12.0%2F%23host "http://262.ecma-international.org/12.0/#host")环境。

### JS中的数据类型及区别

包括值类型(基本对象类型)和引用类型(复杂对象类型)

**值类型(基本类型)：** `Number`(数字),`String`(字符串),`Boolean`(布尔),`null`(空),`undefined`(未定义),`Symbol`(唯一的标识符),`BigInt`(大整数)在内存中占据固定大小，保存在栈内存中

**引用类型(复杂数据类型)：** `Object`(对象)、`Array`(数组)、`Function`(函数)。其他还有Date(日期)、RegExp(正则表达式)、Math(数学函数)，特殊的基本包装类型(String、Number、Boolean) 以及单体内置对象(Global、Math)等 引用类型的值是对象 保存在堆内存中，栈内存存储的是对象的变量标识符以及对象在堆内存中的存储地址。

**八进制和十六进制**

*   如果前缀为 0，则 JavaScript 会把数值常量解释为八进制数
*   如果前缀为 0 和 "x"，则解释为十六进制数

### 简单介绍一下 symbol?

Symbol 是 ES6 的新增属性，代表用给定名称作为唯一标识，这种类型的值可以这样创建，let id=symbol(“id”);Symbl 确保唯一，即使采用相同的名称，也会产生不同的值，有内置方法 Object.getOwnPropertySymbols(obj)可以获得所有的 symbol。 也有一个方法 Reflect.ownKeys(obj)返回对象所有的键，包括 symbol。

### null 和 undefined的区别

undefined是访问一个未初始化的变量时返回的值，而null是访问一个尚未存在的对象时所返回的值。undefined看作是空的变量，而null看作是空的对象

### JS中的数据类型检测方案

#### 1.typeof

```js
console.log(typeof 1);               // number
console.log(typeof true);            // boolean
console.log(typeof 'mc');            // string
console.log(typeof function(){});    // function
console.log(typeof console.log());   // function
console.log(typeof []);              // object
console.log(typeof {});              // object
console.log(typeof null);            // object
console.log(typeof undefined);       // undefined
console.log(typeof Symbol());        // symbol
console.log(typeof 9007199254740991n); // bigint
```

![image.png](/images/jueJin/5d04c22ec5584d7.png)

优点：能够快速区分基本数据类型

缺点：不能将Object、Array和Null区分，都返回object

#### 2.instanceof

用于判断引用类型属于哪个构造函数的方法

```js
console.log(1 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false
console.log('str' instanceof String);                // false
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true
```

优点：能够区分Array、Object和Function，适合用于判断自定义的类实例对象，instanceof 除了可以检测类型外，还可以在继承关系的检测中使用,可以判断一个函数是否是一个变量的构造函数

缺点：Number，Boolean，String基本数据类型不能判断

#### 3.Object.prototype.toString.call()

```js
var toString = Object.prototype.toString;
console.log(toString.call(1));                      //[object Number]
console.log(toString.call(true));                   //[object Boolean]
console.log(toString.call('mc'));                   //[object String]
console.log(toString.call([]));                     //[object Array]
console.log(toString.call({}));                     //[object Object]
console.log(toString.call(function(){}));           //[object Function]
console.log(toString.call(undefined));              //[object Undefined]
console.log(toString.call(null));                   //[object Null]
```

优点：精准判断数据类型

缺点：写法繁琐不容易记，推荐进行封装后使用

### 变量计算

**显性强制类型转换（explicit coercion）**:

转换为布尔值 `Boolean()`  
转换为数字 `Number()`,`ParseInt()`,`ParseFloat()`  
转换为字符串 `String()`

**隐式强制类型转换（implicit coercion）**:

```js
// 1.字符串拼接 转成 字符串
var a = 100 + 10 // 110
var b = 100 + '10' // '10010'
// 2.==运算符 转成 数字
100 = '100' // true
0 == '' // true
null = undefined // true [nullundefined都会转换成false]
// 3.if语句 三元判断 转换为 boolean
let a = true
    if(a){
    //
}

let b = 100
    if(b){
    // 会将b强制转换成boolean类型
}

let c = ''
    if(c){
    // 空字符串会被强制转换成boolean
}
//4.逻辑运算符
console. Log (10 && 0) // 0
console. log('' || 'abc') // 'abc'
console. log(!window.abc) // true
//判断一个变量会被当做true还是false，使用双非判断
var a = 100
console.log(!!a)
```

### 简单说一下隐式转换规则

*   对象和布尔值比较 对象先转换为字符串，然后再转换为数字，布尔值直接转换为数字
*   对象和字符串比较 对象转换为字符串，然后两者进行比较。
*   对象和数字比较 对象先转换为字符串，然后转换为数字，再和数字进行比较。
*   字符串和数字比较 字符串转换成数字，二者再比较。
*   字符串和布尔值比较 二者全部转换成数值再比较。
*   布尔值和数字比较 布尔转换为数字，二者比较。
*   复杂数据类型的转换规则： xx.valueOf().toString()

### JS Number 取值范围

```js
console.log(Number.MAX_VALUE) // 1.7976931348623157e+308
console.log(Number.MIN_VALUE) // 5e-324
//最大安全整数
console.log(Number.MAX_SAFE_INTEGER) //9007199254740991
```

### JS中有哪些内置函数(数据封装类对象)

Object、Array、Boolean、Number、String、Function、Date、RegExp、Error

### 如何理解JSON

JSON只不过是一个JS对象而已，跟Math一样；也是一种数据格式。它有两个 API 如下:  
JSON.stringify({a: 10, b: 20});  
JSON.parse('{"a":10,"b":20}');

### 手动实现一个isNaN的方法

```js
    function isNaN(num){
    let n = Number(num);
    n += '';
        if(n == 'NaN'){
        return true;
            } else {
            return false;
        }
    }
```

### js常用数组API

1. **连接：** arr.join("连接符")  
用连接符把数组里面的元素连接成字符串。arr.join("")能无缝连接。

2. **拼接：** arr.concat("a","b",arr1)  
不会修改原数组，返回新数组。

3.  截取：arr.slice(start\[,end\]) 不会修改原数组，返回新的子数组。含头不含尾。省略第二个参数表示从start位置开始一直截取到末尾。支持负数，表示倒数第几个。
    
4.  删除、插入、替换：arr.splice(start, deleteCount \[,value1,value2...\]) 直接修改原数组。返回所有被删除元素组成的子数组。
    
5.  翻转数组：arr.reverse() 直接修改原数组。
    

6. 数组排序：arr.sort()直接修改原数组。

```js
var arr=[1,4,2,3,5]
    var arr2 = arr.sort(function(a,b){
    //从小到大排序
    return a - b
    //从大到小排序
    // return b - a
    })
    console.log(arr2);
```

7.  查找：arr.indexOf(value\[,from\])或arr.lastIndexOf(value\[,from\])
    
8.  循环数组，无返回值：arr.forEach(function(value,index,arr){})
    

```js
var arr = [1,2,3];
    arr.forEach(function(item, index){
    // 遍历数组的所有元素
    console.log(index, item);
    })
```

9.  循环数组，有返回值：arr.map(function(value,index,arr){})

```js
var arr=1,2,3,4]
    var arr2=arr.map(function(item, index){
    //将元素重新组装,并返回
    return '<b>' item +'</b>';
    })
    console.log(arr2);
```

10.  数组转字符串：String(arr)或arr.toString() 将数组中的元素用逗号连接成字符串，类似于arr.join(",")。
    
11.  开头入栈：arr.unshift(value1, value2......) 在数组的最开头插入元素。
    
12.  开头出栈：arr.shift()
    
13.  结尾入栈：arr.push(value1\[,value2,arr1\])在数组末尾追加元素。
    
14.  结尾出栈：arr.pop()弹出数组最末尾的元素。
    
15.  **Array.filter**按条件过滤，过滤符合条件的元素。
    
16.  **Array.reduce**汇总
    
17.  **Array.findIndex**查找
    
18.  **Array.includes**包含
    
19.  **Array.find**找出第一个符合条件的数组成员，没找到返回 undefined。
    
20.  every判断所有元素是否都符合条件
    

```js
var arr = [1,2,3];
    var result = arr.every(function (item, index){
    //用来判断所有的数组元素,都满足一个条件
        if(item < 4){
        return ture;
    }
    })
    console.log(result);//要求item全部符合条件才返回结果
```

21.  some判断是否有至少一个元素符合条件

```js
var arr = [1,2,3];
    var result = arr.some(function (item, index){
    //用来判断所有的数组元素,都满足一个条件
        if(item < 2){
        return ture;
    }
    })
    console.log(result);//只要item有一个符合判断条件，则返回为真
```

### 对象API

```js
    var obj = {
    x:100,
    y:200,
    z:300
}
var key;
    for (Key in obj){
    // 注意hasOwnProperty这里的,再讲原型链时候讲过了
        if(obj.hasOwnProperty(key)){
        console.log(key, obj[key]);
    }
}
```

### JS 中的数组和函数在内存中是如何存储的？

JavaScript 中的数组存储大致需要分为两种情况：

*   同种类型数据的数组分配连续的内存空间
*   存在非同种类型数据的数组使用哈希映射分配内存空间

> 温馨提示：可以想象一下连续的内存空间只需要根据索引（指针）直接计算存储位置即可。如果是哈希映射那么首先需要计算索引值，然后如果索引值有冲突的场景下还需要进行二次查找（需要知道哈希的存储方式）。

### 创建对象有几种方法

```js
// 第一种：字面量
var o1 = {name: "o1"}
var o2 = new Object({name: "o2"})
// 第二种：通过构造函数
var M = function(name){this.name = name}
var o3 = new M("o3")
// 第三种：Object.create()
var p = {name: "p"}
var o4 = Object.create(p)

```

### 类和实例

ES6提供了更接近面向对象（注意：javascript本质上是基于对象的语言）语言的写法，引入了Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。 类的创建（es5）：new 一个 function，在这个 function 的 prototype 里面增加属性和方法。

### 构造函数

*   构造函数名称的首字母应大写。
*   var a={} 其实是var a= new Object() 的语法糖
*   var a=\[\] 其实是var a= new Array() 的语法糖
*   function Foo{...} 其实是 var Foo= new Function(...)
*   使用 instanceof 判断一个函数是否是一个变量的构造函数

```js
    function Foo(name, age){
    this.name = name;
    this.age = age;
    this.class = 'class-1';
    //return this; //默认有这一行 默认构造函数就会直接返回 this 即使不写也没问题
}
var f= new Foo('zhangsan',20);
// var f1= new Foo('lisi',22); // 可创建多个对象
```

### 原型规则

**5条原型规则**：(原型规则是学习原型链的基础。)

*   所有的引用类型(数组、对象、函数),都具有对象特性,即`可自由扩展属性`(除了 "null" 以外)
*   所有的引用类型(数组、对象、函数),都有一个`__proto__(隐式原型)` 属性,属性值是一个普通的对象
*   所有的函数,都有一个 `prototype(显式原型)` 属性,属性值也是一个普通的对象
*   所有的引用类型(数组、对象、函数), `__proto__隐式原型` 属性值指向它的构造函数的 `prototype(显式原型)` 属性值。`obj.__proto__ === Object.prototype`
*   当试图得到一个对象的某个属性时,如果这个对象本身没有这个属性,那么会去它自身的`__proto__(隐式原型)` (即它的构造函数的 `prototype(显式原型)` )中寻找。

```js
// 构造函数
    function Foo(name, age){
    this.name = name;
}
    Foo.prototype.alertName= function(){
    alert(this.name);
}
// 创建示例
varf= new Foo('zhangsan');

//符合第一条可以自由扩展属性
    f.printName= function(){
    console. log(this. name)
}
//测试
f.printName(); // 自身属性查找
f.alertName(); // 自身属性没有的情况下去自身的隐式原型，也就是构造函数的显式原型中查找
``````js
var obj = {}; obj.a = 100;//符合第一条可以自由扩展属性
var arr = []; arr.a = 100;
function fn(){}
fn.a=100;

console. log(obj.__proto__)
console. log(arr.__proto__)
console. log(fn.__proto__)

console. log(fn.prototype)

console.log(obj.__proto__===Object. prototype)
```

示例：

```js
// 构造函数
    function Foo(name, age) {
    this.name = name;
}
    Foo.prototype. alertName = function(){
    alert(this.name);
}
//创建示例
var f = new Foo('zhangsan');
    f.printName = function (){
    console.log(this. name);
}
// 测试
f.printName();
f.alertName();
f.toString() //要去f._proto_._proto_中查找 原型链
```

![](/images/jueJin/b00f8a0a569c4bf.png)

原型链就是我从我的实例对象网上找构造这个实例相关联的对象，然后这个关联的对象再往上找它又有创造它的原型对象以此类推，一直到Object.prototype原型对象终止。Object.prototype原型对象是整个原型链的顶端，到这就截止了。

![](/images/jueJin/49b3e1d8ff3d486.png)

**原型关系：**

*   每个 class都有显示原型 prototype
    
*   每个实例都有隐式原型 \_ proto\_
    
*   实例的\_ proto\_指向对应 class 的 prototype ‌ ![](/images/jueJin/7fde8f0d3fe04d6.png) ![image.png](/images/jueJin/03f935c5df1a4f7.png) **基于原型的执行规则：即原型链**
    
*   获取属性 xialuo.name或执行方法 xialuo. sahi()时
    
*   先在自身属性和方法寻找
    
*   如果找不到则自动去隐式原型\_ proto\_中查找
    

**原型:**  在 JS 中，每当定义一个对象（函数也是对象）时，对象中都会包含一些预定义的属性。其中每个**函数对象**都有一个`prototype` 属性，这个属性指向函数的**原型对象**。

原型链：函数的原型链对象constructor默认指向函数本身，原型对象除了有原型属性外，为了实现继承，还有一个原型链指针\_\_proto\_\_,该指针是指向上一层的原型对象，而上一层的原型对象的结构依然类似。因此可以利用\_\_proto\_\_一直指向Object的原型对象上，而Object原型对象用Object.prototype.**proto**\=null表示原型链顶端。如此形成了js的原型链继承。同时所有的js对象都有Object的基本防范

**特点:**  `JavaScript`对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。

### new运算符的实现机制

1.  首先创建了一个新的`空对象`
2.  `设置原型`，将对象的原型设置为函数的`prototype`对象。
3.  让函数的`this`指向这个对象，执行构造函数的代码（为这个新对象添加属性）
4.  判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

### JS中的多种继承方案、继承(含es6)

（1）第一种是以`原型链的方式来实现继承`，但是这种实现方式存在的缺点是，在包含有引用类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱。还有就是在创建子类型的时候不能向超类型传递参数。

（2）第二种方式是使用`借用构造函数`的方式，这种方式是通过在子类型的函数中调用超类型的构造函数来实现的，这一种方法解决了不能向超类型传递参数的缺点，但是它存在的一个问题就是无法实现函数方法的复用，并且超类型原型定义的方法子类型也没有办法访问到。

（3）第三种方式是`组合继承`，组合继承是将原型链和借用构造函数组合起来使用的一种方式。通过借用构造函数的方式来实现类型的属性的继承，通过将子类型的原型设置为超类型的实例来实现方法的继承。这种方式解决了上面的两种模式单独使用时的问题，但是由于我们是以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成了子类型的原型中多了很多不必要的属性。

（4）第四种方式是`原型式继承`，原型式继承的主要思路就是基于已有的对象来创建新的对象，实现的原理是，向函数中传入一个对象，然后返回一个以这个对象为原型的对象。这种继承的思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承，ES5 中定义的 Object.create() 方法就是原型式继承的实现。缺点与原型链方式相同。

（5）第五种方式是`寄生式继承`，寄生式继承的思路是创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，然后对象进行扩展，最后返回这个对象。这个扩展的过程就可以理解是一种继承。这种继承的优点就是对一个简单对象实现继承，如果这个对象不是我们的自定义类型时。缺点是没有办法实现函数的复用。

（6）第六种方式是`寄生式组合继承`，组合继承的缺点就是使用超类型的实例做为子类型的原型，导致添加了不必要的原型属性。寄生式组合继承的方式是使用超类型的原型的副本来作为子类型的原型，这样就避免了创建不必要的属性。

### JS中的深浅拷贝

1.  深拷贝 最简单的方法就是JSON.parse(JSON.stringify())，但是这种拷贝方法不可以拷贝一些特殊的属性（例如正则表达式，undefine，function）

```js
//对象深度克隆的简单实现
var shallowCopy = function(obj) { // 只拷贝对象
if (typeof obj !== 'object') return;
// 根据 obj 的类型判断是新建一个数组还是对象
var newObj = obj instanceof Array ? [] : {};
// 遍历 obj，并且判断是 obj 的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
    }
}
return newObj;
}
```

2.  浅拷贝

```js
//方法 1
Object.assign(target, ...sources)
//方法 2
    function simpleClone(obj) {
    var result = {};
        for (var i in obj) {
        result[i] = obj[i];
    }
    return result;
}
```

### var && let && const

ES6之前创建变量用的是var,之后创建变量用的是let/const

**三者区别**：

1.  var定义的变量，`没有块的概念，可以跨块访问`, 不能跨函数访问。  
    let定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问。  
    const用来定义常量，使用时必须初始化(即必须赋值)，只能在块作用域里访问，且不能修改。
    
2.  var可以`先使用，后声明`，因为存在变量提升；let必须先声明后使用。
    
3.  var是允许在相同作用域内`重复声明同一个变量`的，而let与const不允许这一现象。
    
4.  在全局上下文中，基于let声明的全局变量和全局对象GO（window）没有任何关系 ;  
    var声明的变量会和GO有映射关系；
    
5.  `解决暂时性死区`：
    

> 暂时性死区是浏览器的bug：检测一个未被声明的变量类型时，不会报错，会返回undefined  
> 如：console.log(typeof a) //undefined  
> 而：console.log(typeof a)//未声明之前不能使用  
> let a

6.  let /const/function会把当前所在的大括号(除函数之外)作为一个全新的块级上下文，应用这个机制，在开发项目的时候，遇到循环事件绑定等类似的需求，无需再自己构建闭包来存储，只要基于let的块作用特征即可解决

**面试回答**：`var`是 ES5 之前的变量声明方式，**存在很多容易产生误解的缺陷**，具体体现在：没有块的概念可以跨块访问，存在变量提升和暂时性死区, **针对这些问题，ES6 提出了 `let/const` 的变量声明方式**，它们具有一些新的特性：有块作用域的概念，不能跨块访问，必须先声明后使用，解决了暂时性死区。

### 变量提升

> 当浏览器开辟出供代码执行的栈内存后，代码并没有自上而下立即执行，而是继续做了一些事情：把当前作用域中所有带var、function关键字的进行提前的声明和定义 =>变量提升机制 【预解析】

```js
    function fn(){
    // 函数声明
}

    var fn = function (){
    // 函数表达式
}
```

*   带var的只是提前声明，没有赋值，默认值是undefined。
*   带function的声明加赋值。
*   不带var的`a=3`表示给全局设置`window.a=3`和在全局作用域下`var a=3`是一样的;

在变量提升阶段，遇到`大括号`、`判断体`等，不论条件是否成立，都要进行变量提升,而在高版本浏览器中，函数只声明、不赋值。

### 执行上下文 execute context

理解：代码执行的环境

触发的时机：代码正式执行之前要进入的环境

所做的工作：

1.  创建变量对象 1）.获取变量，提升变量 2）.获取函数及函数的形参 3）.全局的变量对象是window 4）.局部的变量对象是抽象的但实际存在的
2.  确认this的指向 1）.全局的变量 this指向window 2）.局部变量 this指向调用其的对象
3.  创建作用域链 父级作用域链 + 当前的变量对象

作用域：  
在 Javascript 中，作用域分为 全局作用域 和 函数作用域

1.  全局作用域：代码在程序的任何地方都能被访问，window 对象的内置属性都拥有全局作用域。
2.  函数作用域：在固定的代码片段才能被访问

作用域的作用：作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。

作用域链:  
一般情况下，变量取值到 创建 这个变量 的函数的作用域中取值。 但是如果在当前作用域中没有查到值，就会向上级作用域去查，直到查到全局作用域，这么一个查找过程形成的链条就叫做作用域链。

### ES6里的set和map

*   `Map`对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。构造函数Map可以接受一个数组作为参数。
*   `Set`对象允许你存储任何类型的值，无论是原始值或者是对象引用。它类似于数组，但是成员的值都是唯一的，没有重复的值。

### JS函数柯里化

1.  参数复用
2.  提前确认
3.  延迟运行

```js
// 普通的add函数
    function add(x, y) {
    return x + y
}

// Currying后
    function curryingAdd(x) {
        return function (y) {
        return x + y
    }
}

add(1, 2)           // 3
curryingAdd(1)(2)   // 3
```

### JS的单线程&同步异步

1.  **什么是单线程**  
    单线程即同一时间只有一个线程，只能做一件事  
    原因：避免DOM渲染的冲突  
    解决方案：异步  
    实现方式：event-loop
    
2.  **JS的 同步任务/异步任务**
    
    *   同步任务：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务
    *   异步：不进入主线程、而进入"`任务队列`"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行
    *   区别：
        *   同步会阻塞代码执行,而异步不会
        *   alert是同步, setTimeout是异步
3.  **JavaScript为什么需要异步**
    
    如果在JS代码执行过程中，某段代码执行过久，后面的代码迟迟不能执行，产生**阻塞**（即卡死），会影响用户体验。
    
4.  **JavaScript怎么实现异步**
    
    JS 实现异步时通过 **事件循环（Event Loop）**,是JS异步的解决方案。 JS实现异步的具体解决方案
    
    1、同步代码，直接执行  
    2、异步代码先放在 `异步队列` 中  
    3、待同步函数执行完毕，轮询执行异步队列 中的函数
    
5.  **目前JS解决异步的方案有哪些**
    

*   Node.js 中的 Callback 回调函数、[EventEmitter](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2Fapi%2Fevents.html%23events_class_eventemitter "http://nodejs.cn/api/events.html#events_class_eventemitter")、[Stream](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2Fapi%2Fstream.html "http://nodejs.cn/api/stream.html")
*   事件监听
*   发布-订阅
*   ES6 中的 [`Promise`](https://link.juejin.cn?target=https%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fpromise "https://es6.ruanyifeng.com/#docs/promise")
*   ES6 中的 Generator
*   ES2017 中的 `Async/Await`
*   三方库 RxJS、[Q](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkriskowal%2Fq "https://github.com/kriskowal/q") 、[Co、](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftj%2Fco "https://github.com/tj/co")[Bluebird](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpetkaantonov%2Fbluebird "https://github.com/petkaantonov/bluebird")

6.  前端使用异步的场景

*   定时任务: setTimeout, setInverval
*   网络请求:ajax请求,动态`<img>`加载
*   事件绑定

### JS堆栈内存的运行机制

![Snipaste_2021-07-28_19-05-38.png](/images/jueJin/a530b7f7c7d5466.png)

JS内存空间分为**栈(stack)** 、**堆(heap)** 、**池(一般也会归类为栈中)** 。 其中**栈**存放变量，**堆**存放复杂对象，**池**存放常量，所以也叫常量池。

*   基本类型：--> `栈`内存（不包含闭包中的变量）
*   引用类型：--> `堆`内存

**栈内存(Stack)**：浏览器在计算机内存中分配出一块内存供代码执行的环境栈（ECStack），也称栈内存 ；

> 基本数据类型都是存到栈里面的。 引用数据类型指针存到栈内存。

**堆内存(Heap)**：浏览器会把内置的属性和方法放到一个单独的内存中，

> 引用数据类型是先开辟一个堆内存，一个16进制的地址，按照键、值分别存放，最后把地址放到栈中供代码关联使用；

js 中存在多种作用域（全局，函数私有的，块级私有的），引擎在编译执行代码的过程中，首先会创建一个执行栈，也就是栈内存（`ECStack` => 执行环境栈），然后执行代码。

代码执行前首先会形成自己的`EC`(执行上下文)，执行上下文分为全局执行上下文（`EC(G)`）和函数执行上下文（`EC(...)`）,其中函数的执行上下文是私有的。

创建执行上下文的过程中，可能会创建：

*   `GO(Global Object)`：全局对象 浏览器端，会把GO赋值给window
*   `VO(Varible Object)`：变量对象，存储当前上下文中的变量。
*   `AO(Active Object)`：活动对象

然后把上下文压缩进栈，进栈后，在当前上下文再依次执行代码； 全局执行器上下文（EC(G)）进栈（ECStack）执行,执行完代码就会把形成的上下文释放（出栈），执行后一些没用的上下文也将出栈，有用的上下文会压缩到栈底（闭包）。栈底永远是全局执行上下文，栈顶则永远是当前执行上下文。当页面关闭全局上下文出栈。

### JS编译机制：VO/AO/GO

**VO 变量对象**：每一个执行上下文都会有自己的一个VO变量对象，用来存放在当前上下文中创建的变量和函数。（函数私有上下文叫 AO 活跃对象，但也是变量对象）。

**GO 全局对象**：他是一个堆内存（存储的都是浏览器内置的 api 属性方法），在浏览器端，让 window 指向它

**VO（G）全局变量对象**：全局上下文中用来存储全局变量的空间，他不是 GO=》只不过某些情况下 VO（G）中的东西会和 GO 中的东西有所关联而已；

> 函数执行:

*   创建执行栈`ECStack`：引擎在编译执行代码的过程中，首先会创建一个执行栈
*   形成全局执行上下文`EC(FN)`：函数执行的时候，形成一个全新的私有上下文`EC(FN)`，供字符串代码执行
*   创建全局变量或对象 `GO`
*   进栈执行：进栈执行，从上面进去，把全局往下压
*   代码执行之前还需要：
    *   1.初始化作用域链（scopeChain）：<EC(FN),EC(G)>
    *   2.初始化 this 指向：window
    *   3.初始化实参集合：arguments
    *   4.形参赋值
    *   5.变量提升
    *   6.代码执行

### JS垃圾回收机制

1.  项目中，如果存在大量不被释放的内存（堆/栈/上下文），页面性能会变得很慢。当某些代码操作不能被合理释放，就会造成内存泄漏。我们尽可能减少使用闭包，因为它会消耗内存。
    
2.  浏览器垃圾回收机制/内存回收机制:
    
    > 浏览器的`Javascript`具有自动垃圾回收机制(`GC:Garbage Collecation`)，垃圾收集器会定期（周期性）找出那些不在继续使用的变量，然后释放其内存。
    
    **标记清除**:在`js`中，最常用的垃圾回收机制是标记清除：当变量进入执行环境时，被标记为“进入环境”，当变量离开执行环境时，会被标记为“离开环境”。垃圾回收器会销毁那些带标记的值并回收它们所占用的内存空间。  
    **谷歌浏览器**：“查找引用”，浏览器不定时去查找当前内存的引用，如果没有被占用了，浏览器会回收它；如果被占用，就不能回收。  
    **IE浏览器**：“引用计数法”，当前内存被占用一次，计数累加1次，移除占用就减1，减到0时，浏览器就回收它。
    
3.  优化手段：内存优化 ; 手动释放：取消内存的占用即可。
    
    （1）堆内存：fn = null 【null：空指针对象】
    
    （2）栈内存：把上下文中，被外部占用的堆的占用取消即可。
    
4.  内存泄漏
    
    在 JS 中，常见的内存泄露主要有 4 种,全局变量、闭包、DOM 元素的引用、定时器
    

### 作用域和作用域链

创建函数的时候，已经声明了当前函数的作用域==>`当前创建函数所处的上下文`。如果是在全局下创建的函数就是`[[scope]]:EC(G)`，函数执行的时候，形成一个全新的私有上下文`EC(FN)`，供字符串代码执行(进栈执行)

定义：简单来说作用域就是变量与函数的可访问范围，`由当前环境与上层环境的一系列变量对象组成`  
1.全局作用域：代码在程序的任何地方都能被访问，window 对象的内置属性都拥有全局作用域。  
2.函数作用域：在固定的代码片段才能被访问

作用：作用域最大的用处就是`隔离变量`，不同作用域下同名变量不会有冲突。

**作用域链参考链接**一般情况下，变量到 创建该变量 的函数的作用域中取值。但是如果在当前作用域中没有查到，就会向上级作用域去查，直到查到全局作用域，这么一个查找过程形成的链条就叫做作用域链。

### 闭包

#### 闭包的概念

概念1：函数执行时形成的私有上下文EC(FN)，正常情况下，代码执行完会出栈后释放;但是特殊情况下，如果当前私有上下文中的某个东西被上下文以外的事物占用了，则上下文不会出栈释放，从而形成不销毁的上下文。 函数执行函数执行过程中，会形成一个全新的私有上下文，可能会被释放，可能不会被释放，不论释放与否，我们把函数执行形成私有上下文，来保护和保存私有变量机制称为`闭包`。

> 闭包是指有权访问另一个函数作用域中的变量的函数--《JavaScript高级程序设计》

> 函数执行后返回结果是一个内部函数，并被外部变量所引用，如果内部函数持有被执行函数作用域的变量，即形成了闭包。

可以在内部函数访问到外部函数作用域。使用闭包，一可以读取函数中的变量，二可以将函数中的变量存储在内存中，保护变量不被污染。而正因闭包会把函数中的变量值存储在内存中，会对内存有消耗，所以不能滥用闭包，否则会影响网页性能，造成内存泄漏。当不需要使用闭包时，要及时释放内存，可将内层函数对象的变量赋值为null。

**稍全面的回答**： 在js中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁。

#### 闭包原理

函数执行分成两个阶段(预编译阶段和执行阶段)。

*   在预编译阶段，如果发现内部函数使用了外部函数的变量，则会在内存中创建一个“闭包”对象并保存对应变量值，如果已存在“闭包”，则只需要增加对应属性值即可。
*   执行完后，函数执行上下文会被销毁，函数对“闭包”对象的引用也会被销毁，但其内部函数还持用该“闭包”的引用，所以内部函数可以继续使用“外部函数”中的变量

利用了函数作用域链的特性，一个函数内部定义的函数会将包含外部函数的活动对象添加到它的作用域链中，函数执行完毕，其执行作用域链销毁，但因内部函数的作用域链仍然在引用这个活动对象，所以其活动对象不会被销毁，直到内部函数被烧毁后才被销毁。

#### 闭包的特性

*   1、内部函数可以访问定义他们外部函数的参数和变量。(作用域链的向上查找，把外围的作用域中的变量值存储在内存中而不是在函数调用完毕后销毁)设计私有的方法和变量，避免全局变量的污染。
    
    1.1.闭包是密闭的容器，，类似于set、map容器，存储数据的  
    1.2.闭包是一个对象，存放数据的格式为 key-value 形式
    
*   2、函数嵌套函数
    
*   3、本质是将函数内部和外部连接起来。优点是可以读取函数内部的变量，让这些变量的值始终保存在内存中，不会在函数被调用之后自动清除
    

#### 闭包形成的条件

1.  函数的嵌套
2.  内部函数引用外部函数的局部变量，延长外部函数的变量生命周期

#### 闭包的主要作用

（1）保护：划分一个独立的代码执行区域，在这个区域中有自己私有变量存储的空间，保护自己的私有变量不受外界干扰（操作自己的私有变量和外界没有关系）；

（2）保存：如果当前上下文不被释放【只要上下文中的某个东西被外部占用即可】，则存储的这些私有变量也不会被释放，可以供其下级上下文中调取使用，相当于把一些值保存起来了；

#### 闭包的用途

```markdown
1. 模仿块级作用域
2. 保护外部函数的变量 能够访问函数定义时所在的词法作用域(阻止其被回收)
3. 封装私有化变量
4. 创建模块
```

#### 闭包的优点

1.  可以从内部函数访问外部函数的作用域中的变量，且访问到的变量长期驻扎在内存中，可供之后使用，`延长局部变量的生命周期`
2.  `避免变量污染全局`
3.  把变量`存到独立的作用域`，作为私有成员存在

#### 闭包的缺点

1.  对内存消耗有负面影响。因内部函数保存了对外部变量的引用，导致无法被垃圾回收，增大内存使用量，所以使用不当会`导致内存泄漏`
    
2.  对处理速度具有负面影响。`闭包的层级决定了引用的外部变量在查找时经过的作用域链长度`
    
3.  `可能获取到意外的值`(captured value)
    

#### 闭包应用场景

闭包的两个场景，闭包的两大作用：`保存/保护`。 在开发中, 其实我们随处可见闭包的身影, 大部分前端JavaScript 代码都是“事件驱动”的,即一个事件绑定的回调方法; 发送ajax请求成功|失败的回调;setTimeout的延时回调;或者一个函数内部返回另一个匿名函数,这些都是闭包的应用。

**应用场景一：**  典型应用是模块封装，在各模块规范出现之前，都是用这样的方式防止变量污染全局。

**应用场景二：**  在循环中创建闭包，防止取到意外的值。

### JS 中 this 的五种情况

1.  作为普通函数执行时，`this`指向`window`。
2.  当函数作为对象的方法被调用时，`this`就会指向`该对象`。
3.  构造器调用，`this`指向`返回的这个对象`。
4.  箭头函数 箭头函数的`this`绑定看的是`this所在函数定义在哪个对象下`，就绑定哪个对象。如果有嵌套的情况，则this绑定到最近的一层对象上。
5.  基于Function.prototype上的 `apply 、 call 和 bind` 调用模式，这三个方法都可以显示的指定调用函数的 this 指向。`apply`接收参数的是数组，`call`接受参数列表，`bind`方法通过传入一个对象，返回一个`this` 绑定了传入对象的新函数。这个函数的 `this`指向除了使用`new` 时会被改变，其他情况下都不会改变。若为空默认是指向全局对象window。

### 箭头函数的特性

1.  `箭头函数没有自己的this`，指向外层普通函数作用域
2.  `箭头函数没有constructor`，不能通过new 调用；
3.  `没有new.target 属性`。在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。在普通的函数调用中，new.target 的值是undefined
4.  `箭头函数不绑定Arguments 对象`。由于 箭头函数没有自己的this指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定this），他们的第一个参数会被忽略。（这种现象对于bind方法同样成立）

### EventLoop 事件循环

`JS`是单线程的，为了防止一个函数执行时间过长阻塞后面的代码，所以会先将同步代码压入执行栈中，依次执行，将异步代码推入异步队列，异步队列又分为宏任务队列和微任务队列，因为宏任务队列的执行时间较长，所以微任务队列要优先于宏任务队列。微任务队列的代表就是，`Promise.then`，`MutationObserver`，宏任务的话就是`setImmediate setTimeout setInterval`

JS运行的环境。一般为浏览器或者Node。 在浏览器环境中，有JS 引擎线程和渲染线程，且两个线程互斥。 Node环境中，只有JS 线程。 不同环境执行机制有差异，不同任务进入不同Event Queue队列。 当主程结束，先执行准备好微任务，然后再执行准备好的宏任务，一个轮询结束。

#### **浏览器中的事件环（Event Loop)**

##### Micro-Task 与 Macro-Task

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。

常见的 macro-task(宏任务)：`ajax`、`setTimeout`、`setInterval`、`setTmmediate(只兼容ie)`、`requestAnimationFrame`、`messageChannel`、`script（整体代码）`、 `I/O 操作`、`UI 渲染`、`一些浏览器api`等,由宿主环境提供的，比如浏览器。

常见的 micro-task(微任务): `new Promise().then(回调)`、`queueMicrotask(基于then)`、`MutationObserve(浏览器提供)`、`messageChannel`等，由语言本身提供的，比如promise.then。

##### requestAnimationFrame

requestAnimationFrame也属于异步执行的方法，但该方法既不属于宏任务，也不属于微任务。按照MDN中的定义：

> `window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

requestAnimationFrame是GUI渲染之前执行，但在`Micro-Task`之后，不过requestAnimationFrame不一定会在当前帧必须执行，由浏览器根据当前的策略自行决定在哪一帧执行。

`事件环的运行机制`是，先会执行栈中的内容，栈中的内容执行后执行微任务，微任务清空后再执行宏任务，先取出一个宏任务，再去执行微任务，然后在取宏任务清微任务这样不停的循环。

*   eventLoop 是由JS的宿主环境（浏览器）来实现的；
    
*   事件循环可以简单的描述为以下四个步骤:
    
    1.  函数入栈，当Stack中执行到异步任务的时候，就将他丢给WebAPIs,接着执行同步任务,直到Stack为空；
    2.  此期间WebAPIs完成这个事件，把回调函数放入队列中等待执行（微任务放到微任务队列，宏任务放到宏任务队列）
    3.  执行栈为空时，Event Loop把微任务队列执行清空；
    4.  微任务队列清空后，进入宏任务队列，取队列的第一项任务放入Stack(栈）中执行，执行完成后，查看微任务队列是否有任务，有的话，清空微任务队列。重复4，继续从宏任务中取任务执行，执行完成之后，继续清空微任务，如此反复循环，直至清空所有的任务。
    
    ![事件循环流程](/images/jueJin/c502ca1a4ec9447.png)
    

#### **Node 环境中的事件环（Event Loop)**

`Node`是基于V8引擎的运行在服务端的`JavaScript`运行环境，在处理高并发、I/O密集(文件操作、网络操作、数据库操作等)场景有明显的优势。虽然用到也是V8引擎，但由于服务目的和环境不同，导致了它的API与原生JS有些区别，其Event Loop还要处理一些I/O，比如新的网络连接等，所以Node的Event Loop(事件环机制)与浏览器的是不太一样。

![2020120317343116.png](/images/jueJin/5ea8b1f1aaf6419.png)

##### 六大阶段

其中libuv引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

执行顺序如下：

1.  `timers`阶段: 计时器，执行setTimeout和setInterval的回调
2.  `pending callbacks`阶段: 执行延迟到下一个循环迭代的 I/O 回调
3.  `idle, prepare`阶段: 队列的移动，仅系统内部使用
4.  `poll轮询`阶段: 检索新的 I/O 事件;执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
5.  `check`阶段: 执行`setImmediate`回调，setImmediate在这里执行
6.  `close callbacks`阶段: 执行`close`事件的`callback`，一些关闭的回调函数，如：socket.on('close', ...)

##### poll阶段

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1.回到 timer 阶段执行回调

2.执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

*   如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
    
*   如果 poll 队列为空时，会有两件事发生
    
    *   如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
    *   如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

##### setTimeout 和 setImmediate

二者非常相似，区别主要在于调用时机不同。

*   setImmediate 设计在poll阶段完成时执行，即check阶段；
*   setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行

```lua
    setTimeout(function timeout () {
    console.log('timeout');
    },0);
        setImmediate(function immediate () {
        console.log('immediate');
        });
```

1.  对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
2.  首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
3.  如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

##### process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行

### Promise

#### 1）Promise基本特性

*   1、Promise有三种状态：pending(进行中)、fulfilled(已成功)、rejected(已失败)
*   2、Promise对象接受一个回调函数作为参数, 该回调函数接受两个参数，分别是成功时的回调resolve和失败时的回调reject；另外resolve的参数除了正常值以外， 还可能是一个Promise对象的实例；reject的参数通常是一个Error对象的实例。
*   3、then方法返回一个新的Promise实例，并接收两个参数onResolved(fulfilled状态的回调)；onRejected(rejected状态的回调，该参数可选)
*   4、catch方法返回一个新的Promise实例
*   5、finally方法不管Promise状态如何都会执行，该方法的回调函数不接受任何参数
*   6、Promise.all()方法将多个多个Promise实例，包装成一个新的Promise实例，该方法接受一个由Promise对象组成的数组作为参数(Promise.all()方法的参数可以不是数组，但必须具有Iterator接口，且返回的每个成员都是Promise实例)，注意参数中只要有一个实例触发catch方法，都会触发Promise.all()方法返回的新的实例的catch方法，如果参数中的某个实例本身调用了catch方法，将不会触发Promise.all()方法返回的新实例的catch方法
*   7、Promise.race()方法的参数与Promise.all方法一样，参数中的实例只要有一个率先改变状态就会将该实例的状态传给Promise.race()方法，并将返回值作为Promise.race()方法产生的Promise实例的返回值
*   8、Promise.resolve()将现有对象转为Promise对象，如果该方法的参数为一个Promise对象，Promise.resolve()将不做任何处理；如果参数thenable对象(即具有then方法)，Promise.resolve()将该对象转为Promise对象并立即执行then方法；如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，状态为fulfilled，其参数将会作为then方法中onResolved回调函数的参数，如果Promise.resolve方法不带参数，会直接返回一个fulfilled状态的 Promise 对象。需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
*   9、Promise.reject()同样返回一个新的Promise对象，状态为rejected，无论传入任何参数都将作为reject()的参数

#### 2）Promise优点

*   ①统一异步 API
    
    *   Promise 的一个重要优点是它将逐渐被用作浏览器的异步 API ，统一现在各种各样的 API ，以及不兼容的模式和手法。
*   ②Promise 与事件对比
    
    *   和事件相比较， Promise 更适合处理一次性的结果。在结果计算出来之前或之后注册回调函数都是可以的，都可以拿到正确的值。 Promise 的这个优点很自然。但是，不能使用 Promise 处理多次触发的事件。链式处理是 Promise 的又一优点，但是事件却不能这样链式处理。
*   ③Promise 与回调对比
    
    *   解决了回调地狱的问题，将异步操作以同步操作的流程表达出来。
*   ④Promise 带来的额外好处是包含了更好的错误处理方式（包含了异常处理），并且写起来很轻松（因为可以重用一些同步的工具，比如 Array.prototype.map() ）。
    

#### 3）Promise缺点

*   1、无法取消Promise，一旦新建它就会立即执行，无法中途取消。
*   2、如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
*   3、当处于Pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
*   4、Promise 真正执行回调的时候，定义 Promise 那部分实际上已经走完了，所以 Promise 的报错堆栈上下文不太友好。

#### 4）简单代码实现

最简单的Promise实现有7个主要属性, state(状态), value(成功返回值), reason(错误信息), resolve方法, reject方法, then方法.[Promise 实例详解](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flgwebdream%2FFE-Interview%2Fissues%2F29 "https://github.com/lgwebdream/FE-Interview/issues/29")

```js
    class Promise{
        constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
            let resolve = value => {
                if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
            }
            };
                let reject = reason => {
                    if (this.state === 'pending') {
                    this.state = 'rejected';
                    this.reason = reason;
                }
                };
                    try {
                    // 立即执行函数
                    executor(resolve, reject);
                        } catch (err) {
                        reject(err);
                    }
                }
                    then(onFulfilled, onRejected) {
                        if (this.state === 'fulfilled') {
                        let x = onFulfilled(this.value);
                        };
                            if (this.state === 'rejected') {
                            let x = onRejected(this.reason);
                            };
                        }
                    }
```

#### Promise的概念

*   主要用于异步计算。promise是用来解决异步函数的顺序问题.
*   可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果。
*   可以在对象之间传递和操作Promise，帮助我们处理队列。

**回调有四个问题**

*   嵌套层次很深，难以维护
*   无法正常使用return和throw
*   无法正常检索堆栈信息
*   多个回调之间难以建立联系

```javascript
new Promise(
/*执行器executor */
    function (resolve, reject){
    //段耗时很长的异步操作
    resolve();//数据处理完成
    reject(); //数据处理出错
}
    .then(function A(){
    //成功，下一步
        },function B(){
        //失败，做相应处理
    }
```

#### Promise详解如何实现异步执行

*   Promise是一个代理对象，它和原先要进行的操作并无关系。
*   它通过引入一个回调，避免更多的回调。

Promise的内部是如何实现异步执行的呢？

通过查看Promise的源码实现，发现其异步执行是通过asap这个库来实现的。

asap是as soon as possible的简称，在Node和浏览器环境下，能将回调函数以高优先级任务来执行（下一个事件循环之前），即把任务放在微任务队列中执行。

> 宏任务（macro-task）和微任务（micro-task）表示异步任务的两种分类。在挂起任务时， js 引擎会将所有任务按照类别分到这两个队列中，首先在 macrotask 的队列（这个队列也被叫做 task queue）中取出第一个任务，执行完毕后取出 microtask 队列中的所有任务顺序执行；之后再取 macrotask 任务，周而复始，直至两个队列的任务都取完。

```js
// asap 用法
    asap(function () {
    // ...
    });
```

#### Promise有3个状态：

*   `pending`|【待定】初始状态
*   `fulfilled`|【实现】操作成功
*   `rejected`【被否决】操作失败

Promise状态发生改变，就会触发.then（）里的响应函数处理后 续步骤。 Promise状态一经改变，不会再变。 Promise实例一经创建，执行器立即执行。

#### .then()

.then（）接受两个函数作为参数，分别代表`fulilled`和`rejected .then（）`返回一个新的Promise实例，所以它可以链式调用 .当前面的Promise状态改变时，.then（）根据其最终状态，选择特定 的状态响应函数执行 .状态响应函数可以返回新的Promise，或其它值 .如果返回新的Promise，那么下一级.then（）会在新Promise状态改变之后执行 .如果返回其它任何值，则会立刻执行下一级.then（）

#### .then（）里有.then（）的情况

因为.then（）返回的还是Promise实例。 会等里面的.then（）执行完，在执行外面的。 对于我们来说，此时最好将其展开，会更好读。

#### 错误处理

Promise会自动捕获内部异常，并交给rejected响应函数处理。 **错误处理的两种做法：**  reject（'错误信息）.then（null，message =>{}） throw new Error（'错误信息'）catch（message=>{}） 推荐使用第二种，更加清晰好读，并且可以捕获前面的错误。

#### Promise.all() 批量执行

*   Promise.all（【p1，p2，p….】）用于将多个Promise实例，包装成一个新的Promise实例。
*   返回的实例就是普通Promise
*   它接受一个数组作为参数。
*   数组里可以是Promise对象，也可以是别的值，只有Promise会等待状态改变。
*   当所有子Promise都完成，该Promise完成，返回值是全部值的数组
*   有任何一个失败，该Promise失败，返回值是第一个失败的子Promise的结果。 Promise.all() 最常见就是和.map() 连用。 实现队列1.使用.forEach（）2.使用.reduce()

#### Promise.resolve()

*   返回一个fulfilled的Promise实例，或原始Promise实例。
*   参数为空，返回一个状态为fulfilled 的Promise实例
*   参数是一个跟Promise无关的值，同上，不过fulfuilled响应函数会得到这个参数
*   参数为Promise实例，则返回该实例，不做任何修改
*   参数为thenable，立刻执行它的.then（）

#### Promise.reject()

返回一个rejected的Promise实例。 Promise.reject()其他特性同Promise.resolve()，但不认thenable

#### Promise.race()

类似Promise.all（），区别在于它有任意一个完成就算完成。 场景用法： 把异步操作和定时器放在一起 如果定时器先触发，就认为超时，告知用户

#### 把回调包装成Promise

把回调包装成Promise最为常见。它有两个显而易见的好处： 可读性更好 返回的结果可以加入任何Promise队列c。

### 实现 Promise.all

**1) 核心思路**

*   ①接收一个 Promise 实例的数组或具有 Iterator 接口的对象作为参数
*   ②这个方法返回一个新的 promise 对象，
*   ③遍历传入的参数，用Promise.resolve()将参数"包一层"，使其变成一个promise对象
*   ④参数所有回调成功才是成功，返回值数组与参数顺序一致
*   ⑤参数数组其中一个失败，则触发失败状态，第一个触发失败的 Promise 错误信息作为 Promise.all 的错误信息。

**2）实现代码**  
一般来说，Promise.all 用来处理多个并发请求，也是为了页面数据构造的方便，将一个页面所用到的在不同接口的数据一起请求过来，不过，如果其中一个接口失败了，多个请求也就失败了，页面可能啥也出不来，这就看当前页面的耦合程度了～[更多示例](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flgwebdream%2FFE-Interview%2Fissues%2F30 "https://github.com/lgwebdream/FE-Interview/issues/30")

```js
    function promiseAll(promises) {
        return new Promise(function(resolve, reject) {
            if(!Array.isArray(promises)){
            throw new TypeError(`argument must be a array`)
        }
        var resolvedCounter = 0;
        var promiseNum = promises.length;
        var resolvedResult = [];
            for (let i = 0; i < promiseNum; i++) {
                Promise.resolve(promises[i]).then(value=>{
                resolvedCounter++;
                resolvedResult[i] = value;
                    if (resolvedCounter == promiseNum) {
                    return resolve(resolvedResult)
                }
                    },error=>{
                    return reject(error)
                    })
                }
                })
            }
            
            // test
                let p1 = new Promise(function (resolve, reject) {
                    setTimeout(function () {
                    resolve(1)
                    }, 1000)
                    })
                        let p2 = new Promise(function (resolve, reject) {
                            setTimeout(function () {
                            resolve(2)
                            }, 2000)
                            })
                                let p3 = new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                    resolve(3)
                                    }, 3000)
                                    })
                                        promiseAll([p3, p1, p2]).then(res => {
                                    console.log(res) // [3, 1, 2]
                                    })
                                    
```

await原理 generator原理

### 原生AJAX核心四步操作

**ajax**是一种异步通信的方法,从服务端获取数据,达到局部刷新页面的效果。 过程：

1.  创建`XMLHttpRequest`对象;
2.  调用`open`方法传入三个参数 请求方式`(GET/POST)、url、同步异步(true/false)`;
3.  监听`onreadystatechange`事件，当`readystate`等于4时返回`responseText`;
4.  调用send方法传递参数。

### 前后端接口怎么设计的

1.接口注释和说明写清楚！

2.参数、接口名称见名知意，给出参数的类型和示例数据，最好能有段直接执行的测试代码。

3.接口做好分类，通常按照功能进行分类，如下方钉钉开放接口 4.接口功能单一性——只做一件事不做其他的

5.接口的参数如果可以写默认值就把默认值写上 6.后端设计统一的返回模型

### 为什么要用json?

为了服务器端发送到客户端的数据更少 便于浏览器javascript的解析 (直接用eval函数不就将服务器传来的字符串转为类了嘛)

### 介绍节流防抖原理、区别以及应用

`节流`：事件触发后，规定时间内，事件处理函数不能再次被调用。也就是说在规定的时间内，函数只能被调用一次，且是最先被触发调用的那次。

`防抖`：多次触发事件，事件处理函数只能执行一次，并且是在触发操作结束时执行。也就是说，当一个事件被触发准备执行事件函数前，会等待一定的时间（这时间是码农自己去定义的，比如 1 秒），如果没有再次被触发，那么就执行，如果被触发了，那就本次作废，重新从新触发的时间开始计算，并再次等待 1 秒，直到能最终执行！

`使用场景`：  
节流：滚动加载更多、搜索框搜的索联想功能、高频点击、表单重复提交……  
防抖：搜索框搜索输入，并在输入完以后自动搜索、手机号，邮箱验证输入检测、窗口大小 resize 变化后，再重新渲染。

```js
/**
* 节流函数 一个函数执行一次后，只有大于设定的执行周期才会执行第二次。有个需要频繁触发的函数，出于优化性能的角度，在规定时间内，只让函数触发的第一次生效，后面的不生效。
* @param fn要被节流的函数
* @param delay规定的时间
*/
    function throttle(fn, delay) {
    //记录上一次函数触发的时间
    var lastTime = 0;
        return function(){
        //记录当前函数触发的时间
        var nowTime = Date.now();
            if(nowTime - lastTime > delay){
            //修正this指向问题
            fn.call(this);
            //同步执行结束时间
            lastTime = nowTime;
        }
    }
}

    document.onscroll = throttle(function () {
    console.log('scllor事件被触发了' + Date.now());
    }, 200);
    
    /**
    * 防抖函数  一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
    * @param fn要被节流的函数
    * @param delay规定的时间
    */
        function debounce(fn, delay) {
        //记录上一次的延时器
        var timer = null;
            return function () {
            //清除上一次的演示器
            clearTimeout(timer);
            //重新设置新的延时器
                timer = setTimeout(function(){
                //修正this指向问题
                fn.apply(this);
                }, delay);
            }
        }
            document.getElementById('btn').onclick = debounce(function () {
            console.log('按钮被点击了' + Date.now());
            }, 1000);
```

### 事件绑定时 e.target与e.currentTarget区别

*   e.currentTarget 指向的是触发事件监听的对象。在上面，就是id为child的这个组件或id为father的这个组件。
    
*   e.target 指向的是添加（注册）监听事件的对象。在上面，就是id为father的这个组件。
    
*   e.relatedTarget 属性返回与触发鼠标事件的元素相关的元素。  
    对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。  
    对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。  
    对于其他类型的事件来说，这个属性没有用。
    

relatedTargert 属性可以与 mouseover 事件一起使用以指示光标刚刚退出的元素，或者与 mouseout 事件一起使用以指示光标刚刚进入的元素。 注意：“触发事件监听”的对象与“添加（注册）监听事件”的对象是不一样的！

前者是能够触发该事件但没有绑定事件，后者指绑定了事件，如:bindtap、catchtap。

**说明：** 取值方面（一般用于页面传值）

**1、如果绑定的事件所在组件没有子元素，则用e.target===e.currentTarget一样；**

**2、如果事件绑定在父元素中，且该父元素有子元素，**

**当用e.currentTarget时，不管点击父元素所在区域还是子元素（当前事件），都正确执行，**

**若用e.target时，点击父元素所在区域无错，点击子元素区域，执行报错-------》**

**报错的原因是事件没绑定在子元素上，是在父元素上，子元素要用e.currentTarget才正确！**

* * *

**总之：使用e.target时要注意，e.currentTarget就无所谓了~**

JS高阶编程技巧：惰性函数/柯理化函数/高阶函数 constructor构造函数模式 类和实例 call/apply/bind DOM/BOM的核心操作 DOM2级事件的核心运行机制 事件对象 发布订阅设计模式 浏览器底层渲染机制和DOM的回流重绘 事件传播机制和事件代理

**ES6/ES7的核心知识** 解头函数ArrowFunction 解构聚值和拓展运算符 JS底层运行机制：单线程和同步 Set/Map数据结构 异步编程 Gonerator生成器函数 Intorator选代器和for of循环

**AJAX/HTTP前后端数据交互**

前端性能优化汇总（包含强缓存和弱缓存）

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**

* * *

往期文章
====

*   [前端面试☞HTTP及网络专题](https://juejin.cn/post/6995404801848639501 "https://juejin.cn/post/6995404801848639501")
*   [2021年前端面试知识点大厂必备](https://juejin.cn/post/6989800620437798919 "https://juejin.cn/post/6989800620437798919")
*   [7月前端高频面试题](https://juejin.cn/post/6992222084382326798 "https://juejin.cn/post/6992222084382326798")
*   [浏览器的工作原理](https://juejin.cn/post/6992597760935460901 "https://juejin.cn/post/6992597760935460901")
*   [深度剖析TCP与UDP的区别](https://juejin.cn/post/6992743999756845087 "https://juejin.cn/post/6992743999756845087")
*   [彻底理解浏览器的缓存机制](https://juejin.cn/post/6992843117963509791 "https://juejin.cn/post/6992843117963509791")
*   [JavaScript是如何影响DOM树构建的](https://juejin.cn/post/6992887065050349605 "https://juejin.cn/post/6992887065050349605")
*   [JavaScript 事件模型](https://juejin.cn/post/6992978598441254925 "https://juejin.cn/post/6992978598441254925")
*   [深入了解现代 Web 浏览器](https://juejin.cn/post/6993095345576083486 "https://juejin.cn/post/6993095345576083486")
*   [在Linux阿里云服务器上部署Nextjs项目](https://juejin.cn/post/6993205190471974925 "https://juejin.cn/post/6993205190471974925")
*   [Snowpack - 更快的前端构建工具](https://juejin.cn/post/6993209659297366024 "https://juejin.cn/post/6993209659297366024")
*   [深入了解 JavaScript 内存泄露](https://juejin.cn/post/6993614323176177695 "https://juejin.cn/post/6993614323176177695")
*   [细说前端路由的hash模式和 history模式](https://juejin.cn/post/6993897542970769421 "https://juejin.cn/post/6993897542970769421")
*   [CSS样式之BFC和IFC的用法](https://juejin.cn/post/6993902300091645965 "https://juejin.cn/post/6993902300091645965")
*   [CSS性能优化](https://juejin.cn/post/6994059570469404686 "https://juejin.cn/post/6994059570469404686")
*   [快速写一个让自己及面试官满意的原型链](https://juejin.cn/post/6994295598958510111 "https://juejin.cn/post/6994295598958510111")
*   [细说JS模块化规范（CommonJS、AMD、CMD、ES6 Module）](https://juejin.cn/post/6994814324548091940 "https://juejin.cn/post/6994814324548091940")
*   [webpack工作原理及loader和plugin的区别](https://juejin.cn/post/6995073296517562376 "https://juejin.cn/post/6995073296517562376")
*   [解读 HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542 "https://juejin.cn/post/6995109407545622542")