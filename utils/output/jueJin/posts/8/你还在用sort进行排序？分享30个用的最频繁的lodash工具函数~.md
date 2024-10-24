---
author: "Sunshine_Lin"
title: "你还在用sort进行排序？分享30个用的最频繁的lodash工具函数~"
date: 2023-02-07
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 事情起因是，有几个小伙伴在对一个数据进行排序，做了激烈的讨论，这组数据，想要根据num字段进行排序~"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:86,comments:0,collects:157,views:3990,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。

![](/images/jueJin/8ecd8f450757421.png)

事情起因是，有几个小伙伴在对一个数据进行排序，做了激烈的讨论，这组数据，想要根据`num`字段进行排序~把我气的，你们就不能直接用`lodash的sortBy`吗？你们再怎么实现，能实现得比`lodash`好？

```js
    const arr = [
    {num: 3,name: 'hh'},
    {num: 1,name: 'xx'},
{num: 2,name: 'aa'}
]

// 使用lodash
console.log(_.sortBy(arr, ['num']))
```

所以，我觉得有必要跟各位小伙伴分享一下，我在项目中用的最多的**30个lodash工具方法**

> 注：此文是总结一些常用的lodash方法，案例从文档拿的，介意的朋友请勿看~

我要对数组进行一系列操作！
-------------

### 取「交集」!

#### `intersection`

返回一个包含所有传入数组交集元素的新数组。

```js
_.intersection([2, 1], [4, 2], [1, 2]);
// => [2]
```

#### `intersectionBy`

根据某个字段来进行计算交集

```js
_.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
// => [{ 'x': 1 }]
```

#### `intersectionWith`

根据某个条件函数来计算交集，比如使用`isEqual`

```js
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];

_.intersectionWith(objects, others, _.isEqual);
// => [{ 'x': 1, 'y': 2 }]
```

### 取「合集」!

#### `union`

返回一个新的联合数组。

```js
_.union([2], [1, 2]);
// => [2, 1]
```

#### `unionBy`

根据某个字段来计算合集

```js
_.unionBy([{ 'x': 1, 'y': 5 }], [{ 'x': 2, 'y': 3 }, { 'x': 1, 'y': 6 }], 'x');
// => [{ 'x': 1, 'y': 5 }, { 'x': 2, 'y': 3 }]
```

#### `unionWith`

根据某个条件函数来计算合集

```js
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];

_.unionWith(objects, others, _.isEqual);
// => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
```

### 取「差集」!

同上面两种工具函数，这里无需多言~

*   `difference`
*   `differenceBy`
*   `differenceWith`

### 取数组「总和」!

#### `sum`

返回总和。

```js
_.sum([4, 2, 8, 6]);
// => 20
```

#### `sumBy`

根据某个字段计算并返回总和。

```js
var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];

_.sumBy(objects, function(o) { return o.n; });
// => 20

// The `_.property` iteratee shorthand.
_.sumBy(objects, 'n');
// => 20
```

### 取「平均数」！

#### `mean`

计算平均数

```js
_.mean([4, 2, 8, 6]);
// => 5
```

#### `meanBy`

根据某个字段计算出平均值

```js
var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];

_.meanBy(objects, function(o) { return o.n; });
// => 5

// The `_.property` iteratee shorthand.
_.meanBy(objects, 'n');
// => 5
```

### 根据字段或条件「排序」！

#### `sortBy`

```js
    var users = [
    { 'user': 'fred', 'age': 48 },
    { 'user': 'barney', 'age': 36 },
    { 'user': 'fred', 'age': 40 },
{ 'user': 'barney', 'age': 34 }
];

_.sortBy(users, function(o) { return o.user; });
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]

_.sortBy(users, ['user', 'age']);
// => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]

    _.sortBy(users, 'user', function(o) {
    return Math.floor(o.age / 10);
    });
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

超级实用的工具函数！
----------

### 我要「浅拷贝」！

#### `clone`

```js
const obj1 = [{a: 1 }]

const obj2 = _.clone(obj1)

console.log(obj1 === obj2) // false

console.log(obj1.a === obj2.a) // true
```

### 我要「深拷贝」！

#### `cloneDeep`

```js
const obj1 = [{a: 1 }]

const obj2 = _.cloneDeep(obj1)

console.log(obj1 === obj2) // false

console.log(obj1.a === obj2.a) // false
```

### `debounce` 我要「防抖」！

#### 参数

1.  `func`  _(Function)_ : 要防抖动的函数。
2.  `[wait=0]`  _(number)_ : 需要延迟的毫秒数。
3.  `[options=]`  _(Object)_ : 选项对象。
4.  `[options.leading=false]`  _(boolean)_ : 指定在延迟开始前调用。
5.  `[options.maxWait]`  _(number)_ : 设置 `func` 允许被延迟的最大值。
6.  `[options.trailing=true]`  _(boolean)_ : 指定在延迟结束后调用。

#### 返回

_(Function)_ : 返回新的 debounced（防抖动）函数。

#### 例子

```dart
// 避免窗口在变动时出现昂贵的计算开销。
jQuery(window).on('resize', _.debounce(calculateLayout, 150));

// 当点击时 `sendMail` 随后就被调用。
    jQuery(element).on('click', _.debounce(sendMail, 300, {
    'leading': true,
    'trailing': false
    }));
    
    // 确保 `batchLog` 调用1次之后，1秒内会被触发。
    var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
    var source = new EventSource('/stream');
    jQuery(source).on('message', debounced);
    
    // 取消一个 trailing 的防抖动调用
    jQuery(window).on('popstate', debounced.cancel);
```

### `throttle` 我要「节流」！

#### 参数

1.  `func`  _(Function)_ : 要节流的函数。
2.  `[wait=0]`  _(number)_ : 需要节流的毫秒。
3.  `[options=]`  _(Object)_ : 选项对象。
4.  `[options.leading=true]`  _(boolean)_ : 指定调用在节流开始前。
5.  `[options.trailing=true]`  _(boolean)_ : 指定调用在节流结束后。

#### 返回

_(Function)_ : 返回节流的函数。

#### 例子

```dart
// 避免在滚动时过分的更新定位
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

// 点击后就调用 `renewToken`，但5分钟内超过1次。
var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
jQuery(element).on('click', throttled);

// 取消一个 trailing 的节流调用。
jQuery(window).on('popstate', throttled.cancel);
```

### 我「获取」对象中的某几个字段！

#### `pick`

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };

_.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }
```

### 我要「剔除」掉对象中的某几个字段！

### `omit`

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };

_.omit(object, ['a', 'c']);
// => { 'b': '2' }
```

我要判断一个变量的类型！
------------

### `isUndefined`

如果 `value` 是 `undefined` ，那么返回 `true`，否则返回 `false`

```js
_.isUndefined(undefined);
// => true

_.isUndefined(null);
// => false
```

### `isNull`

如果 `value` 为`null`，那么返回 `true`，否则返回 `false`。

```js
_.isNull(null);
// => true

_.isNull(undefined);
// => false
```

### `isString`

如果 `value` 为一个字符串，那么返回 `true`，否则返回 `false`。

```js
_.isString('abc');
// => true

_.isString(1);
// => false
```

### `isPlainObject`

如果 `value` 为一个普通对象，那么返回 `true`，否则返回 `false`。

```js
    function Foo() {
    this.a = 1;
}

_.isPlainObject(new Foo);
// => false

_.isPlainObject([1, 2, 3]);
// => false

_.isPlainObject({ 'x': 0, 'y': 0 });
// => true

_.isPlainObject(Object.create(null));
// => true
```

### `isNumber`

如果 `value` 为一个数值，那么返回 `true`，否则返回 `false`。

```js
_.isNumber(3);
// => true

_.isNumber(Number.MIN_VALUE);
// => true

_.isNumber(Infinity);
// => true

_.isNumber('3');
// => false
```

### `isArray`

如果`value`是一个数组返回 `true`，否则返回 `false`。

```js
_.isArray([1, 2, 3]);
// => true

_.isArray(document.body.children);
// => false

_.isArray('abc');
// => false

_.isArray(_.noop);
// => false
```

### `isBoolean`

如果 `value` 是一个布尔值，那么返回 `true`，否则返回 `false`。

```js
_.isBoolean(false);
// => true

_.isBoolean(null);
// => false
```

### `isFunction`

如果 `value` 是一个函数，那么返回 `true`，否则返回 `false`。

```js
_.isFunction(function(){});
// => true

_.isFunction('');
// => false
```

### `isNill`

如果 `value` 为`null` 或 `undefined`，那么返回 `true`，否则返回 `false`。

```js
_.isNil(null);
// => true

_.isNil(void 0);
// => true

_.isNil(NaN);
// => false
```

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个，有5000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/fc3f3d434b7d489.png)