---
author: "Sunshine_Lin"
title: "leader：深拷贝有这5个段位，你只是青铜段位？还想涨薪？"
date: 2021-10-12
description: "本文已参与「掘力星计划」，赢取创作大礼包，挑战创作激励金。 前言 大家好，我是林三心。前几天跟leader在聊深拷贝 leader：你知道怎么复制一个对象吗？ 我：知道啊！不就深拷贝吗？ leader"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:262,comments:40,collects:339,views:12553,"
---
本文已参与「[掘力星计划](https://juejin.cn/post/7012210233804079141/ "https://juejin.cn/post/7012210233804079141/")」，赢取创作大礼包，挑战创作激励金。

前言
--

大家好，我是林三心。前几天跟leader在聊`深拷贝`

*   leader：你知道怎么复制一个对象吗？
*   我：知道啊！不就`深拷贝`吗？
*   leader：那你是怎么`深拷贝`的？
*   我：我直接一手`JSON.parse(JSON.stringfy(obj))`吃遍天
*   leader：兄弟，有空去看看`lodash`里的`deepClone`，看看人家是怎么实现的

哈哈，确实，`深拷贝`在日常开发中是有很多应用场景的，他也是非常重要的，写一个合格的`深拷贝`方法是很有必要的。那怎么才能写一个合格的`深拷贝`方法呢？或者说，怎么才能写一个毫无破绽的`深拷贝`方法呢？

![image.png](/images/jueJin/41ac96018b1248d.png)

深拷贝 && 浅拷贝
----------

咱们先来说说什么是深拷贝，什么是浅拷贝吧。

**浅拷贝**

所谓浅拷贝，就是只复制最外一层，里面的都还是相同引用

```js
// 浅拷贝
const a = { name: 'sunshine_lin', age: 23, arr: [] }
const b = {}
    for (let key in a){
b[key] = a[key]
}

console.log(b) // { name: 'sunshine_lin', age: 23, arr: [] }
console.log(b === a) // false
console.log(b.arr === a.arr) // true
```

**深拷贝**

深拷贝，则是你将一个对象拷贝到另一个新变量，这个新变量指向的是一块新的堆内存地址

```js
// 深拷贝

    function deepClone(target) {
    // ...实现深拷贝
}

const a = { name: 'sunshine_lin', age: 23, arr: [] }
const b = deepClone(a)

console.log(b) // { name: 'sunshine_lin', age: 23, arr: [] }
console.log(b === a) // false
console.log(b.arr === a.arr) // false
```

黄金版本
----

相信大多数人平时在实现深拷贝时，都会这么去实现

```js
    function deepClone(target) {
    return JSON.parse(JSON.stringify(target))
}

const a = { name: 'sunshine_lin', age: 23 }
const b = deepClone(a)

console.log(b) // { name: 'sunshine_lin', age: 23 }
console.log(b === a) // false
```

虽然大多数时候这么使用是没问题的，但这种方式还是有很多缺点的

*   1、对象中有字段值为`undefined`，转换后则会直接字段消失
*   2、对象如果有字段值为`RegExp`对象，转换后则字段值会变成{}
*   3、对象如果有字段值为`NaN、+-Infinity`，转换后则字段值变成null
*   4、对象如果有`环引用`，转换直接报错

![截屏2021-10-02 下午9.34.22.png](/images/jueJin/3b3d09dfac47431.png)

铂金版本
----

既然是要对象的深拷贝，那我可以创建一个空对象，并把需要拷贝的原对象的值一个一个复制过来就可以了呀！！！

```js
    function deepClone(target) {
const temp = {}
    for (const key in target) {
temp[key] = target[key]
}
return temp
}

const a = { name: 'sunshine_lin', age: 23 }
const b = deepClone(a)

console.log(b) // { name: 'sunshine_lin', age: 23 }
console.log(b === a) // false
```

但是其实上面这种做法是不完善的，因为咱们根本不知道咱们想拷贝的对象有多少层。。大家一听到“不知道有多少层”，想必就会想到递归了吧，是的，使用递归就可以了。

```js
    function deepClone(target) {
    // 基本数据类型直接返回
        if (typeof target !== 'object') {
        return target
    }
    
    // 引用数据类型特殊处理
const temp = {}
    for (const key in target) {
    // 递归
    temp[key] = deepClone(target[key])
}
return temp
}

    const a = {
    name: 'sunshine_lin',
    age: 23,
hobbies: { sports: '篮球',tv: '雍正王朝' }
}
const b = deepClone(a)

console.log(b)
    // {
    //     name: 'sunshine_lin',
    //     age: 23,
//     hobbies: { sports: '篮球', tv: '雍正王朝' }
// }
console.log(b === a) // false
```

钻石版本
----

前面咱们只考虑了对象的情况，但是没把数组情况也给考虑，所以咱们要加上数组条件

```js
    function deepClone(target) {
    // 基本数据类型直接返回
        if (typeof target !== 'object') {
        return target
    }
    
    // 引用数据类型特殊处理
    
    // 判断数组还是对象
const temp = Array.isArray(target) ? [] : {}
    for (const key in target) {
    // 递归
    temp[key] = deepClone(target[key])
}
return temp
}

    const a = {
    name: 'sunshine_lin',
    age: 23,
    hobbies: { sports: '篮球', tv: '雍正王朝' },
works: ['2020', '2021']
}
const b = deepClone(a)

console.log(b)
    // {
    //     name: 'sunshine_lin',
    //     age: 23,
    //     hobbies: { sports: '篮球', tv: '雍正王朝' },
//     works: ['2020', '2021']
// }
console.log(b === a) // false
```

星耀版本
----

前面实现的方法都没有解决`环引用`的问题

*   `JSON.parse(JSON.stringify(target))`报错`TypeError: Converting circular structure to JSON`，意思是`无法处理环引用`
*   `递归方法`报错`Maximum call stack size exceeded`，意思是`递归不完，爆栈`

![截屏2021-10-02 下午10.06.58.png](/images/jueJin/5505e92690d74f7.png)

```js
// 环引用
const a = {}
a.key = a
```

那怎么解决环引用呢？其实说难也不难，需要用到ES6的数据结构`Map`

*   每次遍历到有引用数据类型，就把他当做`key`放到`Map`中，对应的`value`是新创建的`对象temp`
*   每次遍历到有引用数据类型，就去Map中找找有没有对应的`key`，如果有，就说明这个对象之前已经注册过，现在又遇到第二次，那肯定就是环引用了，直接根据`key`获取`value`，并返回`value`

![截屏2021-10-02 下午10.18.19.png](/images/jueJin/4d57df9d0fc048c.png)

```js
    function deepClone(target, map = new Map()) {
    // 基本数据类型直接返回
        if (typeof target !== 'object') {
        return target
    }
    
    // 引用数据类型特殊处理
    // 判断数组还是对象
const temp = Array.isArray(target) ? [] : {}

    +    if (map.get(target)) {
    +        // 已存在则直接返回
    +        return map.get(target)
+    }
+    // 不存在则第一次设置
+    map.set(target, temp)

    for (const key in target) {
    // 递归
    temp[key] = deepClone(target[key], map)
}
return temp
}

    const a = {
    name: 'sunshine_lin',
    age: 23,
    hobbies: { sports: '篮球', tv: '雍正王朝' },
works: ['2020', '2021']
}
a.key = a // 环引用
const b = deepClone(a)

console.log(b)
    // {
    //     name: 'sunshine_lin',
    //     age: 23,
    //     hobbies: { sports: '篮球', tv: '雍正王朝' },
    //     works: [ '2020', '2021' ],
//     key: [Circular]
// }
console.log(b === a) // false
```

王者版本
----

![image.png](/images/jueJin/2c282d8f97c2417.png)

刚刚咱们只是实现了

*   `基本数据类型`的拷贝
*   `引用数据类型`中的`数组，对象`

但其实，引用数据类型可不止只有数组和对象，我们还得解决以下的引用类型的拷贝问题，那怎么判断每个引用数据类型的各自类型呢？可以使用`Object.prototype.toString.call()`

类型

toString

结果

Map

Object.prototype.toString.call(new Map())

\[object Map\]

Set

Object.prototype.toString.call(new Set())

\[object Set\]

Array

Object.prototype.toString.call(\[\])

\[object Array\]

Object

Object.prototype.toString.call({})

\[object Object\]

Symbol

Object.prototype.toString.call(Symbol())

\[object Symbol\]

RegExp

Object.prototype.toString.call(new RegExp())

\[object RegExp\]

Function

Object.prototype.toString.call(function() {})

\[object Function\]

我们先把以上的引用类型数据分为两类

*   可遍历的数据类型
*   不可遍历的数据类型

```js
// 可遍历的类型
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';

// 不可遍历类型
const symbolTag = '[object Symbol]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

// 将可遍历类型存在一个数组里
const canForArr = ['[object Map]', '[object Set]',
'[object Array]', '[object Object]']

// 将不可遍历类型存在一个数组
const noForArr = ['[object Symbol]', '[object RegExp]', '[object Function]']

// 判断类型的函数
    function checkType(target) {
    return Object.prototype.toString.call(target)
}

// 判断引用类型的temp
    function checkTemp(target) {
    const c = target.constructor
    return new c()
}
```

### 可遍历引用类型

主要处理以下四种类型

*   Map
*   Set
*   Object
*   Array

```js
    function deepClone(target, map = new Map()) {
    
    // 获取类型
    +    const type = checkType(target)
    
    
    // 基本数据类型直接返回
        +    if (!canForArr.concat(noForArr).includes(type)) {
        +        return target
    +    }
    
    // 引用数据类型特殊处理
    +    const temp = checkTemp(target)
    
        if (map.get(target)) {
        // 已存在则直接返回
        return map.get(target)
    }
    // 不存在则第一次设置
    map.set(target, temp)
    
    // 处理Map类型
        +    if (type === mapTag) {
            +        target.forEach((value, key) => {
            +            temp.set(key, deepClone(value, map))
            +        })
            +
            +        return temp
        +    }
        
        // 处理Set类型
            +    if (type === setTag) {
                +        target.forEach(value => {
                +            temp.add(deepClone(value, map))
                +        })
                +
                +        return temp
            +    }
            
            // 处理数据和对象
                for (const key in target) {
                // 递归
                temp[key] = deepClone(target[key], map)
            }
            return temp
        }
        
        
            const a = {
            name: 'sunshine_lin',
            age: 23,
            hobbies: { sports: '篮球', tv: '雍正王朝' },
            works: ['2020', '2021'],
            map: new Map([['haha', 111], ['xixi', 222]]),
            set: new Set([1, 2, 3]),
        }
        a.key = a // 环引用
        const b = deepClone(a)
        
        console.log(b)
            // {
            //     name: 'sunshine_lin',
            //     age: 23,
            //     hobbies: { sports: '篮球', tv: '雍正王朝' },
            //     works: [ '2020', '2021' ],
            //     map: Map { 'haha' => 111, 'xixi' => 222 },
            //     set: Set { 1, 2, 3 },
        //     key: [Circular]
    // }
    console.log(b === a) // false
```

### 不可遍历引用类型

主要处理以下几种类型

*   Symbol
*   RegExp
*   Function

先把拷贝这三个类型的方法写出来

```js
// 拷贝Function的方法
    function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
        if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
            if (body) {
                if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
                    } else {
                    return new Function(body[0]);
                }
                    } else {
                    return null;
                }
                    } else {
                    return eval(funcString);
                }
            }
            
            // 拷贝Symbol的方法
                function cloneSymbol(targe) {
                return Object(Symbol.prototype.valueOf.call(targe));
            }
            
            // 拷贝RegExp的方法
                function cloneReg(targe) {
                const reFlags = /\w*$/;
                const result = new targe.constructor(targe.source, reFlags.exec(targe));
                result.lastIndex = targe.lastIndex;
                return result;
            }
```

### 最终版本

![image.png](/images/jueJin/4f02f525c82b40b.png)

```js
    function deepClone(target, map = new Map()) {
    
    // 获取类型
    const type = checkType(target)
    
    
    // 基本数据类型直接返回
    if (!canForArr.concat(noForArr).includes(type)) return target
    
    
    // 判断Function，RegExp，Symbol
    +  if (type === funcTag) return cloneFunction(target)
    +  if (type === regexpTag) return cloneReg(target)
    +  if (type === symbolTag) return cloneSymbol(target)
    
    // 引用数据类型特殊处理
    const temp = checkTemp(target)
    
        if (map.get(target)) {
        // 已存在则直接返回
        return map.get(target)
    }
    // 不存在则第一次设置
    map.set(target, temp)
    
    // 处理Map类型
        if (type === mapTag) {
            target.forEach((value, key) => {
            temp.set(key, deepClone(value, map))
            })
            
            return temp
        }
        
        // 处理Set类型
            if (type === setTag) {
                target.forEach(value => {
                temp.add(deepClone(value, map))
                })
                
                return temp
            }
            
            // 处理数据和对象
                for (const key in target) {
                // 递归
                temp[key] = deepClone(target[key], map)
            }
            return temp
        }
        
        
            const a = {
            name: 'sunshine_lin',
            age: 23,
            hobbies: { sports: '篮球', tv: '雍正王朝' },
            works: ['2020', '2021'],
            map: new Map([['haha', 111], ['xixi', 222]]),
            set: new Set([1, 2, 3]),
            func: (name, age) => `${name}今年${age}岁啦！！！`,
            sym: Symbol(123),
            reg: new RegExp(/haha/g),
        }
        a.key = a // 环引用
        
        const b = deepClone(a)
        console.log(b)
            // {
            //     name: 'sunshine_lin',
            //     age: 23,
            //     hobbies: { sports: '篮球', tv: '雍正王朝' },
            //     works: [ '2020', '2021' ],
            //     map: Map { 'haha' => 111, 'xixi' => 222 },
            //     set: Set { 1, 2, 3 },
            //     func: [Function],
            //     sym: [Symbol: Symbol(123)],
            //     reg: /haha/g,
        //     key: [Circular]
    // }
    console.log(b === a) // false
```

结语
--

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645