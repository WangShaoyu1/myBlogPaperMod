---
author: "冴羽"
title: "underscore 系列之防冲突与 Utility Functions"
date: 2017-12-20
description: "所以 underscore 提供了 noConflict 功能，可以放弃 underscore 的控制变量 _，返回 underscore 对象的引用。 首先，在 underscore 执行的时候，会储存之前的 _ 对象，然后当执行 noConflict 函数的时候，再将之前储…"
tags: ["Underscore.js","前端","GitHub","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:13,comments:2,collects:6,views:884,"
---
防冲突
---

underscore 使用 \_ 作为函数的挂载对象，如果页面中已经存在了 `_` 对象，underscore 就会覆盖该对象，举个例子：

```
var _ = {value: 1 }

// 引入 underscore 后
console.log(_.value); // undefined
```

所以 underscore 提供了 noConflict 功能，可以放弃 underscore 的控制变量 `_`，返回 underscore 对象的引用。

```
var _ = {value: 1 }

// 引入 underscore 后

// 放弃 "_"，使用 "$"
var $ = _.noConflict();

console.log(_.value); // 1

// 使用 underscore 的方法
$.each([1, 2, 3], alert);
```

那么 noConflict 函数是如何实现的呢？

首先，在 underscore 执行的时候，会储存之前的 `_` 对象，然后当执行 noConflict 函数的时候，再将之前储存的 `_` 对象赋给全局对象，最后返回 underscore 对象。这样，我们就可以利用返回的 underscore 对象使用 underscore 提供的各种方法。

```
// 源码一开始的时候便储存之前的 _ 对象
var previousUnderscore = root._;

    _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
    };
```

是的，就是这么简单。你可以轻松为你的函数库添加防冲突功能。

接下来我们看 underscore 中的一些功能函数。

\_.identity
-----------

```
    _.identity = function(value) {
    return value;
    };
```

看起来匪夷所思的一个函数，传入一个值，然后返回该值，为什么不直接使用该值呢？

还记得我们在[《underscore 系列之内部函数 cb 和 optimizeCb》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F58 "https://github.com/mqyqingfeng/Blog/issues/58")中接触过这个函数吗？

如果我们自己编写了一个 `_.map` 函数：

```
    _.map = function(arr, iteratee){
    return arr.map(iteratee)
}
```

然而当我们这样使用 `_.map([1, 2, 3])` 时便会报错，因为我们没有传入 iteratee 函数，然而使用 underscore 却没有问题，结果是返回一个相同的新数组，原因就在于当 iteratee 为 undefined 的时候，underscore 视为传入了 `_.identity` 函数。就相当于：

```
    _.map = function(arr, iteratee){
    if (!iteratee) iteratee = _.identity
    return arr.map(iteratee)
}
```

简而言之，如果我们想要复制一个数组：

```
var clonedArr = [1, 2, 3].map(_.identity) // [1, 2, 3]
```

\_.constant
-----------

```
    _.constant = function(value) {
        return function() {
        return value;
        };
        };
```

该函数传入一个 value，然后返回一个返回该 value 的函数，这又有什么用呢？我们来看个 demo：

```
var value = 1;
var getValue = _.constant(value);

value = 2;

getValue(); // 1
getValue(); // 1
```

这很容易让人想到 ES6 的 const，我一开始以为就是用来表示 ES6 的 const ，后来看了这个函数起源的 issue，才发现并非如此，它其实像下面的 \_.noop 函数一样可以作为默认函数使用。

举个例子：

```
_.select(collection, filterFunction || function() { return true; })
```

我们根据 filterFunction 筛选 collection 中符合条件的元素，如果没有传 filterFunction，我们就返回所有的元素，如果有 `_.constant` 函数，我们可以将其简化为：

```
_.select(collection, filterFunction || _.constant(true))
```

尽管没有什么大的改变，但是语义更加明确。

\_.noop
-------

```
_.noop = function(){};
```

一个空函数，看起来依旧没什么用……

noop 函数可以用于作为默认值，这样就可以省去是否存在的判断，举个例子：

```
// 不使用 noop
    function a(value, callback){
    // 每次使用 callback 都要判断一次
    _.isFunction(callback) && callback()
}

// 使用 noop
    function a(value, callback) {
    // 判断一次
    if(!_.isFunction(callback)) callback = _.noop;
    
    // 以后都可以直接使用
    callback()
}
```

deepGet
-------

```
    var deepGet = function(obj, path) {
    var length = path.length;
        for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return length ? obj : void 0;
    };
```

deepGet 用于获得对象深层次的值。举个例子：

```
    var obj = {
        value: {
        deepValue: 2
    }
}

console.log(deepGet(obj, ['value', 'deepValue']))
```

使用这个函数，可以避免深层次取值时，因为没有其中的一个属性，导致的报错。

shallowProperty
---------------

```
    var shallowProperty = function(key) {
        return function(obj) {
        return obj == null ? void 0 : obj[key];
        };
        };
```

shallowProperty 也是用于获取对象的属性，也许你会好奇在开发中，直接使用`.` 不就可以获取对象的属性了，为什么还要写成这样呢？我们来举个例子：

```
// 获取 arr 所有元素的 name 属性
    var arr = [
        {
        value: 1,
        name: 'Kevin'
        },
            {
            value: 2,
            name: 'Daisy'
        }
    ]
    
    // 普通方式
        var names = arr.map(function(item){
        return item.name;
        })
        
        // 使用 shallowProperty
        var names = arr.map(shallowProperty('name'))
```

\_.property
-----------

```
    _.property = function(path) {
        if (!_.isArray(path)) {
        return shallowProperty(path);
    }
        return function(obj) {
        return deepGet(obj, path);
        };
        };
```

`_.property` 结合了 deepGet 和 shallowProperty，可以获取元素深层次的值。上面一个例子也可以写成：

```
var names = arr.map(_.property('name'))
```

\_.propertyOf
-------------

```
    _.propertyOf = function(obj) {
        if (obj == null) {
        return function(){};
    }
        return function(path) {
        return !Array.isArray(path) ? obj[path] : deepGet(obj, path);
        };
        };
```

`_.property` 返回一个函数，这个函数返回任何传入的对象的指定属性。

`_.propertyOf` 与 `_.property` 相反。需要一个对象，并返回一个函数，这个函数将返回一个提供的属性的值。

我们写个例子：

```
// 获取 person 对象的所有属性值
    var person = {
    name: 'Kevin',
    age: '18'
    };
    
    // 普通方式
var values = Object.keys(person).map((key) => person[key]); // ["Kevin", "18"]

// 使用 _.propertyOf
var values = Object.keys(person).map(_.propertyOf(person)); // ["Kevin", "18"
```

\_.random
---------

返回一个 min 和 max 之间的随机整数。如果你只传递一个参数，那么将返回 0 和这个参数之间的整数。

```
    _.random = function(min, max) {
        if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
    };
```

注意：该随机值有可能是 min 或 max。

underscore 系列
-------------

underscore 系列目录地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")。

underscore 系列预计写八篇左右，重点介绍 underscore 中的代码架构、链式调用、内部函数、模板引擎等内容，旨在帮助大家阅读源码，以及写出自己的 undercore。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。