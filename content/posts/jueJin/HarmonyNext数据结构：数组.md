---
author: "冯志浩"
title: "HarmonyNext数据结构：数组"
date: 2024-09-24
description: "前言在开发移动端应用时，开发者不可避免的要和页面的数据打交道。那么，为了写出高性能的代码，熟练掌握相应系统的数据结构用法还是非常重要的，本篇文章我们就一起来学习下鸿蒙操作系统中数组的用法。数组在"
tags: ["HarmonyOS","掘金·金石计划"]
ShowReadingTime: "阅读4分钟"
weight: 482
---
#### 前言

在开发移动端应用时，开发者不可避免的要和页面的数据打交道。那么，为了写出高性能的代码，熟练掌握相应系统的数据结构用法还是非常重要的，本篇文章我们就一起来学习下鸿蒙操作系统中数组的用法。

#### 数组

在 Harmony OS 中，与数组概念相关的有三个数据结构：

*   Array（JS 系统库中的）
*   Array（arkts.collections 库里的）
*   ArrayList

JS 内建的 Array 与arkts.collections 库里提供的 Array 区别官方文档解释如下： `arkts.collections 主要用于并发场景下的高性能数据传递。功能与 JavaScript 内建的对应容器类似，但ArkTS容器实例无法通过.或者[]添加或更新属性。`

因为两种 Array 接口基本一致，这里就使用 arkts.collections 中的 Array 做代码示例。

对于 Array 与 ArrayList 的区别，通过接口列表可以看出，Array 的接口更多支持的功能更多，比如常用的 `map`/`filter`/`reduce` 等，而 ArrayList 都是不支持的。

对于扩容，ArrayList会根据实际需要动态调整容量，每次扩容增加50%。而 Array 的扩容策略文档并未提现。

#### 初始化

##### Array

Array 支持以下五种初始化方式：

*   直接 new ，不带任何参数，示例代码如下：

ini

 代码解读

复制代码

`const arr1 = new collections.Array<number>();`

*   填充初始值，示例代码如下：

csharp

 代码解读

复制代码

`const arr2 = new collections.Array<string>("1", "2", "3");`

*   通过传入数组初始化，示例代码如下：

ini

 代码解读

复制代码

`const arr1 = new collections.Array<number>(); const arr3 = new collections.Array(...arr1);`

*   静态 create 方法，示例代码如下：

c

 代码解读

复制代码

`const array = collections.Array.create<number>(2, 1); // [1, 1]`

*   静态 from 方法，该方法传入的数组元素必须是支持 Sendable 的类型。示例代码如下：

csharp

 代码解读

复制代码

`let array : Array<string> = ['str1', 'str2', 'str3']; let sendableArray = collections.Array.from<string>(array);`

##### ArrayList

ArrayList 的初始化只有以下一种方式：

typescript

 代码解读

复制代码

`const arrayList: ArrayList<number> = new ArrayList();`

#### 添加元素

##### Array

*   首部添加（可以添加一个或多个元素，返回新数组长度）：

ini

 代码解读

复制代码

`const arr1 = new collections.Array<number>(1, 2, 3); const res = arr1.unshift(0); // [0, 1, 2, 3]`

*   尾部添加 - push（可以添加一个或多个元素，返回新数组长度）：

scss

 代码解读

复制代码

`arr1.push(1); arr1.push(1,2,3); // [1, 1, 2, 3]`

*   扩容 - extendTo：

ini

 代码解读

复制代码

`const arr1 = new collections.Array(1, 2, 3); arr1.extendTo(5, 10); // [1, 2, 3, 10, 10]`

##### ArrayList

*   尾部添加 - add（只能添加一个元素）：

csharp

 代码解读

复制代码

`arrayList.add(10);`

*   插入 - insert（在数组长度范围内任意位置插入）：

lua

 代码解读

复制代码

`arrayList.insert("a", 0); arrayList.insert("b", 1); arrayList.insert("c", 2);`

#### 删除元素

##### Array

*   移除第一个元素 - shift（若数组为空，返回 undefined，若不为空返回移除的元素）：

ini

 代码解读

复制代码

`const arr1 = new collections.Array<string>("1", "2", "3"); const ele = arr1.shift(); // "1"`

*   移除最后一位元素 - pop（若数组为空，返回 undefined，若不为空返回移除的元素）：

ini

 代码解读

复制代码

`const arr1 = new collections.Array<string>("1", "2", "3"); const ele = arr1.pop(); // "3"`

*   删除指定位置的元素 - splice（返回被删除的元素数组）：

ini

 代码解读

复制代码

`// 从索引 2 的位置一直删除到尾部 const array1 = new collections.Array<number>(1, 2, 3, 4, 5); let removeArray1 = array1.splice(2); // array1 [1, 2]; removeArray1 [3, 4, 5] // 从索引 2 的位置删除一位 const array2 = new collections.Array<number>(1, 2, 3, 4, 5); let removeArray2 = array2.splice(2, 1); // array2 [1, 2, 4, 5] removeArray2 [3] // 从索引 2 的位置删除两位，且从索引 2 的位置开始插入 6 和 7 const array3 = new collections.Array<number>(1, 2, 3, 4, 5); let removeArray3 = array3.splice(2, 2, 6, 7); // array3 [1, 2, 6, 7, 5] removeArray3 [3, 4]`

*   收缩长度 - shrinkTo：

ini

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 2, 3, 4, 5); array1.shrinkTo(2); // array1 [1, 2] const array2 = new collections.Array<number>(1, 2, 3, 4, 5); array2.shrinkTo(100); // array2 不变`

##### ArrayList

*   根据 index 删除元素 - removeByIndex：

csharp

 代码解读

复制代码

`const arrayList: ArrayList<string> = new ArrayList(); arrayList.insert("a", 0); arrayList.insert("b", 1); arrayList.insert("c", 2); const res = arrayList.removeByIndex(0); // "a"`

*   移除第一个相同的元素 - remove：

lua

 代码解读

复制代码

`const arrayList: ArrayList<string> = new ArrayList(); arrayList.insert("a", 0); arrayList.insert("b", 1); arrayList.insert("c", 2); arrayList.insert("b", 3); const res = arrayList.remove("b");  // ["a", "c", "b"]`

*   按范围删除 - removeByRange：

lua

 代码解读

复制代码

`const arrayList: ArrayList<string> = new ArrayList(); arrayList.insert("a", 0); arrayList.insert("b", 1); arrayList.insert("c", 2); arrayList.insert("b", 3); // 从索引  0 开始，删除到索引 2（索引 2 不删除） arrayList.removeByRange(0, 2); // ["c", "b"]`

*   全部删除 - clear：

csharp

 代码解读

复制代码

`const arrayList: ArrayList<string> = new ArrayList(); arrayList.insert("a", 0); arrayList.clear();`

#### 查询

##### Array

*   查询满足条件的收个元素值 - find：

typescript

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 2, 3, 4, 5); const res = array1.find((value: number) => value > 3); // 4`

*   返回第一个满足条件的元素的索引 - findIndex：

typescript

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 2, 3, 2, 5); const res = array1.findIndex((value: number) => value === 2); // 1`

*   查询符合条件的所有元素 - filter：

typescript

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 2, 3, 4, 5); const filteredArray = array1.filter((value : number) => value < 3); // 返回[1, 2]`

*   获取元素首次出现的索引 - indexOf：

ini

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 1, 3, 4, 5); const res = array1.indexOf(1); // 0`

*   是否包含 - includes：

ini

 代码解读

复制代码

`const array1 = new collections.Array<number>(1, 2, 3, 4, 5); const res = array1.includes(1); // true 从索引 0 开始查找是否包含元素1 const res1 = array1.includes(1, 2) // false 从索引 2 开始查找是否包含元素1`

##### ArrayList

*   获取元素第一次出现时的索引 - getIndexOf：

csharp

 代码解读

复制代码

`const arrayList: ArrayList<string> = new ArrayList(); arrayList.add("a"); arrayList.add("b"); arrayList.add("c"); arrayList.add("a"); const firstIndex = arrayList.getIndexOf("a"); // 0 const lastIndex = arrayList.getLastIndexOf("a") // 3 const has = arrayList.has("c") // true`

*   获取元素最后一次出现时的索引 - getLastIndexOf：

arduino

 代码解读

复制代码

`const lastIndex = arrayList.getLastIndexOf("a") // 3`

*   是否包含 - has：

ini

 代码解读

复制代码

`const has = arrayList.has("c") // true`