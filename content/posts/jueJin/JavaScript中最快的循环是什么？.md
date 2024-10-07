---
author: "叶知秋水"
title: "JavaScript中最快的循环是什么？"
date: 2024-10-04
description: "无论使用哪种编程语言，循环都是一种内置功能。JavaScript也不例外，它提供了多种实现循环的方法，偶尔会给开发人员带来困惑：哪一种循环才是最快的？以下是Javascript中可以实现循环的方法"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读3分钟"
weight: 81
---
无论使用哪种编程语言，循环都是一种内置功能。JavaScript 也不例外，它提供了多种实现循环的方法，偶尔会给开发人员带来困惑：哪一种循环才是最快的？

以下是Javascript中可以实现循环的方法：

*   For Loop
*   While Loop
*   Do-While Loop
*   For-In Loop
*   For-Of Loop
*   ForEach Loop
*   Map Loop
*   Filter Loop
*   Reduce Loop
*   Some Loop
*   Every Loop
*   Find Loop

我们将对这些循环方法进行测试，以确定哪种方法最快。

为了比较每个循环的性能，我们将使用 console.time() 和 console.timeEnd() 方法来测量它们的执行时间。

javascript

 代码解读

复制代码

`console.time('My Description'); // Code to measure console.timeEnd('My Description');`

用于测试的任务是：将 5000 万个项目从一个数组转移到另一个数组。

javascript

 代码解读

复制代码

`console.time('Array Creation');    const numbersList = Array.from({ length: 50_000_000 }, () => Math.floor(Math.random() * 100)); console.timeEnd('Array Creation');`

为确保公平比较，我们将异步运行每个循环。

虽然 For-In 的语法与 For-Of 类似，但它不是为数组设计的，因此不在测试之中。 For-In 更适合迭代具有多个属性的对象，因为它迭代的是属性名称（或键）而不是值本身，而与数组一起使用会导致性能问题和意外行为。

scss

 代码解读

复制代码

`(async () => {   await usingForLoop(numbersList);   await usingWhile(numbersList);   await usingDoWhile(numbersList);   await usingForOf(numbersList);   await usingForEach(numbersList);   await usingMap(numbersList);   await usingFilter(numbersList);   await usingReduce(numbersList);   await usingSome(numbersList);   await usingEvery(numbersList);   await usingFind(numbersList); })()`

**ForLoop**

ini

 代码解读

复制代码

`const usingForLoop = async (array) => {   console.time('FOR LOOP');   const newNumbersList = [];   for (let i = 0; i < array.length; i++) {     newNumbersList.push(array[i]);   }   console.timeEnd('FOR LOOP'); }`

**while**

ini

 代码解读

复制代码

`const usingWhile = async (array) => {  console.time('WHILE');  let i = 0;  const newNumbersList = [];  while (i < array.length) {    newNumbersList.push(array[i]);    i++;  }  console.timeEnd('WHILE'); }`

**doWhile**

ini

 代码解读

复制代码

`const usingDoWhile = async (array) => {  console.time('DO WHILE');  let i = 0;  const newNumbersList = [];  do {    newNumbersList.push(array[i]);    i++;  } while (i < array.length);  console.timeEnd('DO WHILE'); }`

ForOf

javascript

 代码解读

复制代码

`const usingForOf = async (array) => {   console.time('FOR OF');   const newNumbersList = [];   for (const item of array) {     newNumbersList.push(item);   }   console.timeEnd('FOR OF'); }`

**ForEach**

javascript

 代码解读

复制代码

`const usingForEach = async (array) => {   console.time('FOR EACH');   const newNumbersList = [];   array.forEach((item) => newNumbersList.push(item));   console.timeEnd('FOR EACH'); }`

**Map**

typescript

 代码解读

复制代码

`const usingMap = async (array) => {  console.time('MAP');  const newNumbersList = array.map((number) => number);  console.timeEnd('MAP'); }`

**Filer**

javascript

 代码解读

复制代码

`const usingFilter = async (array) => {  console.time('FILTER');  const newNumbersList = array.filter((item) => true);  console.timeEnd('FILTER'); }`

**Reduce**

javascript

 代码解读

复制代码

`const usingReduce = async (array) => {  console.time('REDUCE');  const newNumbersList = array.reduce((acc, item) => {    acc.push(item);    return acc;  }, []);  console.timeEnd('REDUCE'); }`

**Some**

javascript

 代码解读

复制代码

`const usingSome = async (array) => {  console.time('SOME');  const newNumbersList = [];  array.some((item) => {    newNumbersList.push(item);    return false;  });  console.timeEnd('SOME') }`

**Every**

javascript

 代码解读

复制代码

`const usingEvery = async (array) => {   console.time('EVERY');   const newNumbersList = [];   array.every((item) => {     newNumbersList.push(item);     return true;   });   console.timeEnd('EVERY') }`

**Find**

javascript

 代码解读

复制代码

`const usingFind = async (array) => {   console.time('FIND');   const newNumbersList= [];   array.find((item) => {     newNumbersList.push(item);     return false;   });   console.timeEnd('FIND') }`

任务运行了五次，显示的测量值是计算得出的平均值。

测试平均结果如下：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/17accfe8551a41d58bc8733ec2001725~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-255-l56eL5rC0:q75.awebp?rk3s=f64ab15b&x-expires=1728655051&x-signature=A4W9FnH3skSr8yix2P%2BtXnaApJY%3D)

从结果可以看出，前5名分别是:

*   1.  Map
*   2.  For Loop
*   3.  While
*   4.  Do While
*   5.  For Each

有趣的是只有Map是一个函数调用，其余的都是循环体。

另外该测试仅针对一项特定任务进行的，不同测试用例可能会有不同的结果，不同的内存或者CPU也会有不一样的表现。从本次测试的结果，我们可以看到Map 和 For Loop 的性能是最好的。令人失望的是For-Of，相对于For Loop，作为新出的一个API竟然效率这么拉跨。

Map每次循环都需要调用回调函数，理论上不应该比For Loop更快。但现代 JavaScript 引擎（如 V8）对高阶函数（如 map、filter 等）进行了高度优化，尤其是对数组的处理。引擎内部可能会针对这些高阶函数应用特定的优化策略，减少不必要的操作，进而提升性能。而且 map 是一个专门用于遍历数组并返回新数组的高阶函数，V8 等引擎能够更好地预测和优化其内部的操作路径。而 for loop 是更通用的控制结构，可能没有这些特定的优化。

结论
--

从测试结果看Map和For Loop的循环效率相差不大，大家可以根据需要做选择。map 无法中途退出，但可以返回一个新的数组。