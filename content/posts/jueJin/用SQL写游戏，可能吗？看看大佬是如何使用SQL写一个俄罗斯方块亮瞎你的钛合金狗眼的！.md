---
author: "brzhang"
title: "用SQL写游戏，可能吗？看看大佬是如何使用SQL写一个俄罗斯方块亮瞎你的钛合金狗眼的！"
date: 2024-09-07
description: "大家好，今天我要带你们一起来开开眼界。你知道SQL吗？就是那个我们平时用来和数据库打交道的语言——查询数据、插入数据、删除数据，嗯，数据库管理员的必备技能。但你能想象到有人用SQL做了什么吗？他用SQ"
tags: ["SQL"]
ShowReadingTime: "阅读5分钟"
weight: 462
---
大家好，今天我要带你们一起来开开眼界。你知道SQL吗？就是那个我们平时用来和数据库打交道的语言——查询数据、插入数据、删除数据，嗯，数据库管理员的必备技能。但你能想象到有人用SQL做了什么吗？他用SQL做了一款**俄罗斯方块**！对，就是那个曾经风靡全球的经典游戏。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/921bc10f50394b9eb7bbe07045a0158d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgYnJ6aGFuZw==:q75.awebp?rk3s=f64ab15b&x-expires=1728083842&x-signature=8eStDsyNLxN%2BsMQn74dWFw7IIZI%3D "null")

你可能会想，“这怎么可能？SQL不就是查查数据嘛，最多写点复杂的查询语句，能做游戏？”其实我一开始也是这个想法，但看了这个项目后，真的不得不感叹程序员的脑洞太大了！这篇文章就来和你聊聊，这个疯狂的项目到底是怎么实现的，以及为什么这个看似“不务正业”的尝试背后，可能藏着编程世界的一些终极奥秘。

还是先上一下项目地址吧：

[github.com/nuno-faria/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnuno-faria%2Ftetris-sql "https://github.com/nuno-faria/tetris-sql")

#### 1\. Turing完备性，SQL到底有多强大？

首先，让我们聊聊一个稍微专业一点的概念：**图灵完备性（Turing completeness）** 。简单来说，如果一门编程语言是图灵完备的，那它理论上可以实现任何计算。我们平时接触的编程语言，比如Python、Java、C++，都是图灵完备的。但SQL呢？你可能想象不到，SQL也是图灵完备的，这意味着它也具备和其他编程语言一样的能力，只是我们平时大多只用它进行数据库操作。

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/44b79c63597f4785805414f9ea8ef4bf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgYnJ6aGFuZw==:q75.awebp?rk3s=f64ab15b&x-expires=1728083842&x-signature=wUQKki2qG2W1yhasVB2swjf5Yzo%3D "null")

项目的开发者正是看中了SQL的图灵完备性，才想出了用它来实现俄罗斯方块这个创意。虽然SQL天生并不是为游戏设计的，但通过一些巧妙的设计，开发者硬是把这个“不可能的任务”完成了。不得不说，这不仅仅是技术上的一种挑战，更是一种极致的创意和智慧的碰撞。

#### 2\. 用SQL写游戏，可能吗？

接下来，你可能很好奇了，具体怎么实现的呢？其实，开发者在SQL中用了一些非常“刁钻”的技巧。他利用了SQL中的递归查询（Common Table Expressions，简称CTE）和一些复杂的数学操作，来模拟俄罗斯方块的游戏逻辑。

sql

 代码解读

复制代码

`WITH RECURSIVE t(i) AS (     -- non-recursive term     SELECT 1     UNION ALL     -- recursive term     SELECT i + 1 -- takes i of the previous row and adds 1     FROM t -- self-reference that enables recursion     WHERE i < 5 -- when i = 5, the CTE stops ) SELECT * FROM t;  i ----   1   2   3   4   5 (5 rows)`

举个简单的例子，当俄罗斯方块下落时，我们需要判断它是否与底部或其他方块发生碰撞。通常这种逻辑我们会在游戏开发中使用循环来处理，而在SQL中，开发者通过递归查询来实现类似的循环效果。每次查询都相当于让方块“动”一下，并判断它是否碰到边界。

ini

 代码解读

复制代码

`-- without i appended ... ->  Memoize  (loops=999)    ...    Hits: 998  Misses: 1  ...    ->  Function Scan on dblink input (loops=1) -- only called once ... -- with i appended ... ->  Nested Loop  (loops=999)    ->  WorkTable Scan on main main_1  (loops=999)    ->  Function Scan on dblink input  (loops=999) -- called every iteration ...`

虽然说这个过程比传统的编程语言要复杂得多，但实际上，通过SQL，也能够非常清晰地描述出游戏的规则和状态变化。这其实也证明了图灵完备性的一个非常有趣的应用场景——我们可以用SQL来做的不仅仅是数据库操作，甚至是一些我们平时想都不敢想的事情。

#### 3\. 疯狂背后的深思：编程的边界在哪里？

或许你会觉得，用SQL做一个俄罗斯方块游戏纯粹是“哗众取宠”，为了博取眼球，没什么实际意义。但深入思考一下，这个项目实际上揭示了编程的一些非常深刻的哲学问题：**编程的边界在哪里？**

我们习惯性地把SQL、Python、Java等语言分门别类，用它们来解决不同类型的问题。但这个项目提醒我们，编程的真正边界，或许并不是由语言的设计来决定的，而是由开发者的想象力来定义的。一个看似“不合适”的工具，通过创意和技巧，也可以实现出乎意料的结果。这或许也是编程最迷人之处：没有什么是绝对不可能的。

#### 4\. 我们可以从这些疯狂的想法中能学到什么？

看完这个项目，你可能会想，“那我能从中学到什么呢？” 其实，除了技术上的启发之外，这个项目还给我们提供了一些更为重要的思维方式。

**第一点，敢于挑战常规。** 当我们学习编程时，往往会被一些固定的思维框架束缚住，比如SQL只能用于数据库操作，JavaScript才是做前端的。但这个项目告诉我们，有时候打破常规、尝试一些看似不可能的事情，可能会有意外的收获。

**第二点，深入理解工具的本质。** 学习一门编程语言不仅仅是掌握语法和基本操作，更重要的是理解它背后的能力和局限。这个项目通过SQL的图灵完备性展示了它的潜力，这种对工具的深刻理解，往往能帮助我们在关键时刻找到突破口。

**第三点，保持对编程的好奇心。** 编程是一门技术，但同时也是一门艺术。正如这位开发者一样，保持好奇心，不断尝试新东西，能够让我们在编程的世界里走得更远。

#### 5\. 最后，尝试一下吧！

看完了这篇文章，我猜你可能已经对这个项目充满了好奇。那就别犹豫了，去看看GitHub项目，甚至可以自己动手试试。即使你并不是SQL的高手，但通过这个项目，你一定能收获一些不一样的编程灵感。毕竟，编程的世界永远充满了无限可能，而这些可能性，就等待着你去探索和创造。

最后送你一句话：**编程的乐趣，不在于完成任务，而在于不断发现和实现那些看似不可能的创意！**