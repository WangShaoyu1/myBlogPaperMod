---
author: ""
title: "编写可维护的JavaScript—重读红宝书系列"
date: 2020-12-01
description: "随着Web开发的迅速发展，Web开发领域的最新技术和开发工具已经令人目不暇接。其中，JavaScript尤其成为了研究和关注的焦点。今天的应用程序的规模及复杂度变得日渐复杂。这些变化要求开发者把可维护能力放到重要位置上。正如更传统意义上的软件工程师一样，JavaScript开发…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:12,views:1528,"
---
> 希沃ENOW大前端
> 
> 公司官网：[CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：**

![](/images/jueJin/9075c6dff5e4443.png)

前言
--

随着Web开发的迅速发展，Web开发领域的最新技术和开发工具已经令人目不暇接。其中，JavaScript尤其成为了研究和关注的焦点。今天的应用程序的规模及复杂度变得日渐复杂。这些变化要求开发者把可维护能力放到重要位置上。正如更传统意义上的软件工程师一样，JavaScript开发者受雇是要为公司创造价值的。他们不仅要保证产品如期上线，而且要随着时间推移为公司不断积累知识资产。

因此，编写可维护的代码十分重要，因为大多数开发者会花大量时间去维护别人写的代码。实际开发中，从第一行代码开始写起的情况非常少，通常是要在别人的代码之上构建自己的工作。让自己的代码容易维护，可以保证其他开发者更好地完成自己的工作。

本文大部分摘自《JavaScript高级程序设计第四版》，部分精简以节约宝贵时间，与社区朋友一起重读红宝书，普及尽量标准化的JavaScript编码实践。如涉及侵权问题请联系删除。  

1\. 什么是可维护的代码
-------------

*   **容易理解**：无须求助原始开发者，任何人一看代码就知道它是干什么的，以及它是怎么实现的。
*   **符合常识**：代码中的一切都显得顺理成章，无论操作有多么复杂。
*   **容易适配**：即使数据发生变化也不用完全重写。
*   **容易扩展**：代码架构经过认真设计，支持未来扩展核心功能。
*   **容易调试**：出问题时，代码可以给出明确的信息，通过它能直接定位问题。

能够写出可维护的JavaScript代码是一项重要的专业技能。这就是业余爱好者和专业开发人员之间的区别，前者用一个周末就拼凑出一个网站，而后者真正了解自己的技术。如果想了解更加详细的规范可以参考书籍《编写可维护的JavaScript》。

2\. 编码规范
--------

编码规范对JavaScript而言非常重要，因为这门语言实在太灵活了。因此，编写可维护代码的第一步就是认真考虑编码规范。  
专业组织有为开发者建立的编码规范，旨在让人写出更容易维护的代码。  
优秀开源项目有严格的编码规范，可以让社区的所有人容易地理解代码是如何组织的。

**书中讨论的制定编码规范的一些基础知识：  
**

### 2.1 可读性

要想让代码容易维护，首先必须使其可读。一般包括下面几个方面

*   **代码缩进**，一般来说，缩进是4个空格，当然具体多少个可以自己定。
    
*   **代码注释**
    
    在大多数编程语言中，广泛接受的做法是为每个方法都编写注释。因为JavaScript可以在代码中的任何地方创建函数，所以这一点经常被忽视。正因为如此，可能给JavaScript中的每个函数都写注释才更重要。一般来说，以下这些地方应该写注释：
    
    *   **函数和方法**
    
    每个函数和方法都应该有注释来描述其用途、所用的算法、参数及其类型与含义、返回值。
    
    *   **大型代码块**
    
    多行代码但用于完成单一任务的，应该在前面给出注释，把要完成的任务写清楚。  
    
    *   **复杂的算法**
    
    如果使用了独特的方法解决问题，要通过注释解释明白。这样不仅可以帮助别人查看代码，也可以帮助自己今后查看代码。
    
    *   **Hack**
    
    由于浏览器之间的差异，JavaScript代码中通常包含一些**Hack**。不要假设其他人一看就能明白某个黑科技是为了解决某个浏览器的什么问题。如果某个浏览器不能使用正常方式达到目的，那要在注释里把黑科技的用途写出来。这样可以避免别人误以为黑科技没有用而把它“修复”掉，结果你已解决的问题又会出现。
    

### 2.2 变量和函数命名

代码中变量和函数的适当命名对于其可读性和可维护性至关重要。以下是关于命名的通用规则

*   变量名应该是名词，例如`car`或`person`。
*   函数名应该以动词开始，例如`getName()`。返回布尔值的函数通常以`is`开头，比如`isEnabled()`。
*   对变量和函数都使用符合逻辑的名称，不用担心长度。长名字的问题可以通过后处理和压缩解决。
*   变量、函数和方法应该以小写字母开头，使用驼峰大小写（camelCase）形式，如`getName()`和`isPerson`。类名应该首字母大写，如`Person`、`RequestFactory`。常量值应该全部大写并以下划线相接，比如`REQUEST_TIMEOUT`。
*   名称要尽量用描述性和直观的词汇，但不要过于冗长。`getName()`一看就知道会返回名称，而`PersonFactory`一看就知道会产生某个`Person`对象或实体。

### 2.3 变量类型透明化

因为JavaScript是松散类型的语言，所以很容易忘记变量包含的数据类型。适当命名可以在某种程度上解决这个问题，但还不够。有三种方式可以标明变量的数据类型。

*   第一种标明变量类型的方式是通过初始化或者默认值。例如 `let found = false;` _// 布尔值_
    
*   第二种标明变量类型的方式是使用匈牙利表示法。匈牙利表示法指的是在变量名前面前缀一个或多个字符表示数据类型。例如 `let oPerson;` _// 对象_
    
*   第三种标明变量类型的方式是使用`Typescript`或`Flow`,或者使用类型注释。
    

```javascript
// Typescript
let isDone: boolean = false;
// 类型注释
let found  /*:Boolean*/ = false;
```

3\. 松散耦合
--------

只要应用程序的某个部分对另一个部分依赖得过于紧密，代码就会变成紧密耦合，因而难以维护。  

### 3.1 **解耦HTML/JavaScript**

Web开发中最常见的耦合是HTML/JavaScript耦合。在网页中，HTML和JavaScript分别代表不同层面的解决方案。HTML是数据，JavaScript是行为。

### 3.2 **解耦CSS/JavaScript**

Web应用程序的另一层是CSS，主要负责页面显示。JavaScript和CSS紧密相关，它们都建构在HTML之上，因此也经常一起使用。与HTML和JavaScript的情况类似，CSS也可能与JavaScript产生紧密耦合。

### 3.3 **解耦应用程序逻辑/事件处理程序**

每个Web应用程序中都会有大量事件处理程序在监听各种事件。可是，其中很少能真正做到应用程序逻辑与事件处理程序分离。

*   不好的写法

```javascript
    function handleKeyPress(event) {
        if (event.keyCode == 13) {
        let target = event.target;
        let value = 5 * parseInt(target.value);
            if (value > 10) {
            document.getElementById("error-msg").style.display = "block";
        }
    }
}
```

这个事件处理程序除了处理事件，还包含了应用程序逻辑。这样做的问题是双重的。首先，除了事件没有办法触发应用程序逻辑，结果造成调试困难。如果没有产生预期的结果怎么办？是因为没有调用事件处理程序，还是因为应用程序逻辑有错误？其次，如果后续事件也会对应相同的应用程序逻辑，则会导致代码重复，或者把它提取到单独的函数中。无论情况如何，都会导致原本不必要的多余工作。

*   好的做法

```javascript
    function validateValue(value) {
    value = 5 * parseInt(value);
        if (value > 10) {
        document.getElementById("error-msg").style.display = "block";
    }
}

    function handleKeyPress(event) {
        if (event.keyCode == 13) {
        let target = event.target;
        validateValue(target.value);
    }
}
```

  
把应用程序逻辑从事件处理程序中分离出来有很多好处。首先，这可以让我们以最少的工作量轻松地修改触发某些流程的事件。如果原来是通过鼠标单击触发流程，而现在又想增加键盘操作来触发，那么修改起来也很简单。其次，可以在不用添加事件的情况下测试代码，这样创建单元测试或自动化应用程序流都会更简单。

以下是在解耦应用程序逻辑和业务逻辑时应该注意的几点。

*   不要把`event`对象传给其他方法，而是只传递`event`对象中必要的数据。
*   应用程序中每个可能的操作都应该无须事件处理程序就可以执行。
*   事件处理程序应该处理事件，而把后续处理交给应用程序逻辑。

做到上述几点能够给任何代码的可维护性带来巨大的提升，同时也能为将来的测试和开发提供很多可能性。  

4\. 编码惯例
--------

编写可维护的JavaScript不仅仅涉及代码格式和规范，也涉及代码做什么。企业开发Web应用程序通常需要很多人协同工作。这时候就需要保证每个人的浏览器环境都有恒定不变的规则。为此，开发者应该遵守某些编码惯例。

### **4.1 尊重对象所有权**

JavaScript的动态特性意味着几乎可以在任何时候修改任何东西。

在企业项目开发中，非常重要的编码惯例就是尊重对象所有权，这意味着不要修改不属于你的对象。简单来讲，如果你不负责创建和维护某个对象及其构造函数或方法，就不应该对其进行任何修改。更具体一点说，就是如下惯例。

*   不要给实例或原型添加属性。
*   不要给实例或原型添加方法。
*   不要重定义已有的方法。

  
问题在于，开发者会假设浏览器环境以某种方式运行。修改了多个人使用的对象也就意味着会有错误发生。假设有人希望某个函数叫作`stopEvent()`，用于取消某个事件的默认行为。然后，你把它给改了，除了取消事件的默认行为，又添加了其他事件处理程序。

为此，最好的方法是永远不要修改不属于你的对象。只有你自己创建的才是你的对象，包括自定义类型和对象字面量。

### 4.2 **不声明全局变量**

与尊重对象所有权密切相关的是尽可能不声明全局变量和函数。同样，这也关系到创建一致和可维护的脚本运行环境。最多可以创建一个全局变量，作为其他对象和函数的命名空间。

```javascript
// 两个全局变量：不要！
var name = "Nicholas";
    function sayName() {
    console.log(name);
}
```

以上代码声明了两个全局变量：`name`和`sayName()`。可以像下面这样把它们包含在一个对象中：

```javascript
// 一个全局变量：推荐
    var MyApplication = {
    name: "Nicholas",
        sayName: function() {
        console.log(this.name);
    }
    };
```

这个重写后的版本只声明了一个全局对象`MyApplication`。该对象包含了`name`和`sayName()`。这样可以避免之前版本的几个问题。

### 4.3 **不要比较`null`**

JavaScript不会自动做任何类型检查，因此就需要开发者担起这个责任。结果，很多JavaScript代码不会做类型检查。最常见的类型检查是看值是不是`null`。然而，与`null`进行比较的代码太多了，其中很多因为类型检查不够而频繁引发错误。比如下面的例子：

```javascript
    function sortArray(values) {
    if (values != null) {       // 不要这样比较！
    values.sort(comparator);
}
}
```

  
这个函数的目的是使用给定的比较函数对数组进行排序。为保证函数正常执行，`values`参数必须是数组。但是，`if`语句在这里只简单地检查了这个值不是`null`。实际上，字符串、数值还有其他很多值可以通过这里的检查，结果就会导致错误。

可以像下面这样重写那个函数：

```javascript
    function sortArray(values) {
    if (values instanceof Array) { // 推荐
    values.sort(comparator);
}
}
```

### 4.4 **使用常量**

依赖常量的目标是从应用程序逻辑中分离数据，以便修改数据时不会引发错误。显示在用户界面上的字符串就应该以这种方式提取出来，可以方便实现国际化。为此，可以把这些可能会修改的数据提取出来，放在单独定义的常量中，以实现数据与逻辑分离。可以使用以下标准检查哪些数据需要提取：

*   **重复出现的值**：任何使用超过一次的值都应该提取到常量中，这样可以消除一个值改了而另一个值没改造成的错误。这里也包括CSS的类名。
*   **用户界面字符串**：任何会显示给用户的字符串都应该提取出来，以方便实现国际化。
*   **URL**：Web应用程序中资源的地址经常会发生变化，因此建议把所有URL集中放在一个地方管理。
*   **任何可能变化的值**：任何时候，只要在代码中使用字面值，就问问自己这个值将来是否可能会变。如果答案是“是”，那么就应该把它提取到常量中。

  

参考文章
----

*   《JavaScript高级程序设计第四版》