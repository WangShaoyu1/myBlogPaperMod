---
author: "Gaby"
title: "Ttypescript 与 Javascript 的区别"
date: 2021-08-22
description: "TypeScript是ECMAScript 2015的语法超集，是JavaScript的语法糖。而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。"
tags: ["前端","面试","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:8,views:763,"
---
**这是我参与8月更文挑战的第20天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

* * *

TypeScript是ECMAScript 2015的语法超集，是JavaScript的语法糖。而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。JavaScript程序可以直接移植到TypeScript，TypeScript需要编译（语法转换）生成JavaScript才能被浏览器执行。

### JavaScript

JavaScript是一种基于客户端浏览器的，基于对象、事件驱动式的脚本语言。稍提一下，JavaScript和Java没有任何关系，两者相当于雷峰塔和雷锋的关系。

1.  JavaScript是一种脚本编写语言，无需编译，只要嵌入HTML代码中，就能在浏览器中加载执行。
2.  JavaScript是一种基于对象的语言，可以创建对象同时使用现有对象。但是JavaScript并不支持面向对象语言所承载的继承和重载功能。
3.  JavaScript使用的变量是弱类型。
4.  JavaScript语言较为安全，仅在浏览器端执行，不会访问本地硬盘数据。
5.  JavaScript语言具有动态性。JavaScript是事件驱动的，只根据用户的操作做出相应的反应处理。
6.  JavaScript只依赖于浏览器，与操作系统的因素无关。因此JavaScript是一种跨平台的语言。
7.  JavaScript兼容性极好，能够与其他技术（如XML、REST API等）一起使用

### TypeScript

TypeScript是JavaScript类型的超类，它可以编译成纯JavaScript。TypeScript可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

1.  TypeScript是Microsoft推出的开源语言，使用Apache授权协议
2.  TypeScript增加了静态类型、类、模块、接口和类型注解
3.  TypeScript可用于开发大型的应用
4.  TypeScript易学易于理解

![image.png](/images/jueJin/442a19436c26454.png)

### JavaScript和TypeScript的主要差异

TypeScript可以使用JavaScript中的**所有**代码和编程概念，TypeScript是为了使JavaScript的开发变得更加容易而创建的。

1.  TypeScript从核心语言方面和类概念方面的模塑方面对JavaScript对象模型进行扩展。
2.  JavaScript代码可以在无需任何修改的情况下与TypeScript一同工作，同时可以使用编译器将TypeScript代码转换为JavaScript。
3.  TypeScript通过类型注解提供编译时的静态类型检查。
4.  TypeScript中的数据要求带有明确的类型，JavaScript不要求。
5.  TypeScript提供了缺省参数值。
6.  TypeScript引入了JavaScript中没有的“类”概念。
7.  TypeScript中引入模块的概念，可以把声明、数据、函数和类封装在模块中。

### TypeScript的优势

1.  静态类型化，允许开发人员编写更健壮的代码并对其进行维护。
2.  大型的开发项目，使用TypeScript工具来进行重构更容易、便捷。
3.  类型安全，在编码期间检测错误的功能，而不是在编译项目时检测错误。
4.  干净的ECMAScript6代码，自动完成和动态输入等因素有助于提高开发人员的工作效率。

### JavaScript的优势

1.  JavaScript的开发者社区仍然巨大而活跃，在社区可以很容易找到大量成熟的开发项目和可用资源。
2.  JavaScript语言发展较早，也较为成熟。
3.  TypeScript代码需要被编译（成JavaScript）
4.  不需要注释
5.  JavaScript的灵活性更高

### typescript你都用过哪些类型

*   基本类型
    1.  string、number、boolean三种类型在严格模式下不能设置空值,在非严格模式下可以设置空值,即在tsconfig.json文件中strict或者strictNullChecks的值不能为true
    2.  void:在严格模式下只能是undefined,在非严格模式下还可以存放null
    3.  undefined和null
*   Object类型
    1.  对象类型
    2.  数组类型
*   函数类型、任意类型、接口

### typescript中type和interface的区别

*   相同点
    1.  都可以约束对象和函数
    2.  都允许扩展,两者也可以相互extends
*   不同点
    1.  type和interface的声明、扩展语法不同
    2.  type 可以声明基本类型名,例如string,interface不行
    3.  interface 的同名声明可以合并,而type不可以,会报错:Duplicate identifier ‘person’

* * *