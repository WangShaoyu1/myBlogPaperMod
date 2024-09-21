---
author: "Spring源码项目进行时"
title: "美团一面：项目中有10000个ifelse如何优化？想了半天，被问懵了"
date: 2024-05-15
description: "最近做Java面试辅导，有个兄弟面试美团，遇到一个特别有意思的问题：我看到这问题都有点懵逼，现实项目中怎么可能会有10000个ifelse的代码，至少我工作10余年没见过样的代码。"
tags: ["后端","面试","Java"]
ShowReadingTime: "阅读7分钟"
weight: 53
---
> 来源：[mp.weixin.qq.com/s/MlGkFx5Ei…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FMlGkFx5EimiLmBa5bckKoA "https://mp.weixin.qq.com/s/MlGkFx5EimiLmBa5bckKoA")
> 
> 作者：Java技术栈（欢迎大家关注）

最近做 Java 面试辅导，有个兄弟面试美团，遇到一个特别有意思的问题：

> **一万个 if else 如何优化，有好的解决方案吗？**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1965d70f3a4546c3bf433641b179ebac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=1951&s=138074&e=jpg&b=f0efef)

我看到这问题都有点懵逼，现实项目中怎么可能会有 10000 个 if else 的代码，至少我工作 10 余年没见过样的代码。

关键要写完这 10000 行的 if else 代码，如果每天写 100 个，是不是意味着也要 100 天才能写完，并且每次请求都要执行几千上万次的判断，**代码难以维护不说，还会严重影响系统性能**。

很显然，面试官考察的不是一般的八股文，这个问题可以看作是一道场景题，**它考察一个程序员在面对复杂逻辑判断时的优化能力，也是在考察一个程序员临场发挥技术能力**。

这兄弟虽然说上了策略模式，但显然不是完美和唯一的解决方案，另外像责任链模式等其他设计模式都会存在这样的问题，所以具体的问题还得具体分析。

所以这题可以这样回答：

*   如果这 1 万个 if else 是在同一个代码块流程里面，这就要考虑这 1 万 if else 存在的意义了，因为这么量极的 if else 会很难维护，也会极其影响性能，需要具体分析然后再去分析如何去分解和优化。
*   如果这 1 万个 if else 分散在同一个项目里面，那么优化 if else 的方式有很多种，包括.……

下面我说说几种方案，欢迎大家拍砖。

if else 优化方案
============

方案1：策略模式
========

这个兄弟也说到了策略模式，策略模式介绍及实战看这篇：

> 别在再满屏的 if/ else 了，试试策略模式，真香！！

使用策略模式确实可以提升代码的优雅性，但也会存在以下问题：

*   如果是大量的 if else 分支，比如这 1 万个，**那就会有 1 万个策略类，此时就会造成类膨胀，并且随着时间的推移逐渐变得更加庞大而复杂**。
*   如果是多层的 if else 嵌套，策略模式可能也无法派上用场了。

策略模式的优点是可以很方便的解耦，适用于有多种不同逻辑和算法的 if 场景，但不适用于大量的 if else 场景。

方案2：策略模式变体
==========

这是策略模式的一种变体：

dart

 代码解读

复制代码

`Map<Integer, Runnable> actionMap = new HashMap<>(); actionMap.put("condition1", () -> { /* 分支1的执行逻辑 */ }); actionMap.put("condition2", () -> { /* 分支2的执行逻辑 */ }); actionMap.put("conditionN", () -> { /* 分支N的执行逻辑 */ }); // 根据条件获取执行逻辑 Runnable action = actionMap.get("condition1"); if (action != null) {     action.run(); }`

这种把业务逻辑代码分离出去了，简化了单个类的代码，也省去了策略实现类，让策略类不会得到膨胀，但如果有大量的条件映射，依然会造成单个类的膨胀和难以维护。

这里使用的是线程异步执行的案例，还可以把要执行的逻辑代码存储在其他类、数据库中，然后再用反射或者动态编译的方式加载进去并执行。

方案3：多级嵌套优化
==========

上面说的两种方案嵌套可能无法解决，如果是这种带层级的判断是可以优化的：

scss

 代码解读

复制代码

`/* * 来源公众号：Java技术栈  */ if(xxxOrder != null){  if(xxxOrder.getXxxShippingInfo() != null){   if(xxxOrder.getXxxShippingInfo().getXxxShipmentDetails() != null){    if(xxxOrder.getXxxShippingInfo().getXxxShipmentDetails().getXxxTrackingInfo() != null){     ...    }   }  } }`

这种 if 嵌套层级太多，极不优雅，怎么优化见我之前写的这篇：

> if else 太多？看我用 Java 8 轻松干掉！

方案4：使用三目运算符
===========

如果判断条件不多，只有 2、3 个的情况下可以使用三目运算符简化 if else 分支。

比如以下代码：

ini

 代码解读

复制代码

`String desc; if (condition1) {     desc = "XX1"; } else if (condition2) {     desc = "XX2"; } else {     desc = "XX3"; }`

使用三目运算符一行搞定：

ini

 代码解读

复制代码

`String desc = condition1 ? "XX1" : (condition2 ? "XX2" : "XX3");`

超过 3 个条件就不建议使用了，不然代码可读性会大大降低。

方案5：使用枚举
========

枚举类型可以用来表示一组固定的值，例如星期几、月份、颜色等，它提供了一种更简洁、可读性更高的方式来表示一组相关的常量。

如以下示例代码：

typescript

 代码解读

复制代码

`/**  * 公众号：Java技术栈  */ public class Test {          public static void main(String[] args) {         Day today = Day.MONDAY;         System.out.println("Today is " + today);         System.out.println("Today is " + today.getChineseName());     }     enum Day {         MONDAY("星期一"),         TUESDAY("星期二"),         WEDNESDAY("星期三"),         THURSDAY("星期四"),         FRIDAY("星期五"),         SATURDAY("星期六"),         SUNDAY("星期日");         private String chineseName;         Day(String chineseName) {             this.chineseName = chineseName;         }         public String getChineseName() {             return chineseName;         }     }      }`

这里我只写了一个字段，我们可以在枚举属性里面定义多个字段，这样就无需大量的 if else 判断，直接通过枚举来获取某个某一组固定的值了。

方案6：使用 Optional
===============

Java 8 提供了一个 Optional 新特性，它是一个可以包含 null 值的容器对象，可以用来代替 xx != null 的判断。

参考我之前写的这篇：

> JDK 8 新特性之 Optional

如果项目中存在大量 xx != null 的判断，可以使用 Optional 来优化。

方案7：尽快返回
========

分析业务，根据 if else 的执行次数按降序排，把执行次数较多的 if 放在最前面，如果符合条件，就使用 return 返回，如下面代码：

kotlin

 代码解读

复制代码

`if (条件1) {     return } if (条件2) {     return } ...`

这样改可能是比较简单的方式，**在很大程度上可以提升系统的性能**，但是还存在以下问题：

*   有的条件不能按执行次数排序，存在先后或者互斥关系。
*   如果新增一个条件，可能无法马上判定它的执行次数，如果放在后面可能也还会影响性能。
*   对类的继续膨胀和代码维护没有任何帮助。

方案8：去除没必要的 if else
==================

比如这种：

kotlin

 代码解读

复制代码

`if (condition) {     ... } else {     return; }`

优化后：

kotlin

 代码解读

复制代码

`if（!condition）{     return; }`

或者是这样：

kotlin

 代码解读

复制代码

`return !condition`

方案9：合并条件
========

考虑这 1 万 if else 是不是真的每个都有必要，是不是可以合并归类，比如是不是可以把几百、几千个相似逻辑的归为一类，这样也能大大简化 if else 数量。

比如以下代码：

csharp

 代码解读

复制代码

`double calculateShipping() {     if (orderAmount > 1000) {         return 0.5;     }     if (customerLoyaltyLevel > 5) {         return 0.5;     }     if (promotionIsActive) {         return 0.5;     } }`

优化后：

csharp

 代码解读

复制代码

`double calculateShipping() {     if (orderAmount > 1000 || customerLoyaltyLevel > 5 || promotionIsActive) {         return 0.5;     } }`

这样就把返回相同值的 if 归为一类了，如果 if 较大就能大大简化代码量。

方案10：规则引擎
=========

对于复杂的业务逻辑，业务规则经常变化，规则制定不依赖于技术团队，需要实现可配置的逻辑处理，此时可以考虑使用规则引擎来处理，比如 Drools。

规则引擎系统可用于执行一组规则，在许多业务应用程序中，业务决策可以通过一系列的逻辑规则来定义，规则引擎允许这些规则在运行时执行，而无需硬编码在应用程序之中。

规则引擎的好处是：

*   业务逻辑可以和程序代码解耦；
*   提高业务逻辑的可管理性；
*   提高系统的灵活性和可扩展性；
*   业务人员可参与决策过程；

总结
==

掌握优化 if else 的方法很重要，有时候面试官可能会换着法子问你，比如我们面试辅导这位兄弟遇到的这个面试官，你可以问清楚这一万个 if else 是在一个代码块中，还是在一个项目中，然后再去解答，如果不了解清楚业务场景，盲目回答又会被面试官绕进去。

本文我也总结了 10 种优化 if else 的方法，其实还不止，根据不同的场景还可以使用多态、责任链模式、模板方法模式等更多方法来消除 if else。

总之，消除 if else 并没有万能的方法，也不可能全部优化掉，在实际开发中需要根据实际场景使用不同的方法，以及多种方法组合使用，这样才是正确的方式。