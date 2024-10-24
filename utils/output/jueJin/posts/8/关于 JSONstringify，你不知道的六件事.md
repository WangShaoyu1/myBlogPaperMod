---
author: "Sunshine_Lin"
title: "关于 JSONstringify，你不知道的六件事"
date: 2024-04-07
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ JSONstringify 对于 JSONstringify 这个方法我相信大家都很熟悉了，一般"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:9,comments:6,collects:4,views:362,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

JSON.stringify
--------------

![](/images/jueJin/31293f09e77345c.png)

对于 `JSON.stringify` 这个方法我相信大家都很熟悉了，一般用来将一个对象或者数组转成字符串，也就是一个 `JSON`，然后让接口携带并传到后端

![](/images/jueJin/676ddd8c584d4d2.png)

![](/images/jueJin/7f4414c7e044474.png)

但是你真的很了解 `JSON.stringify` 吗？往下阅读，看你是不是真的了解它~

第二个参数传数组Array
-------------

`JSON.stringify` 的第二个参数传数组时，那么它只会转换数组中的 key，比如下面例子中，只会转换 `name` 属性

![](/images/jueJin/057e3d830bcc401.png)

![](/images/jueJin/ac21fb14020742b.png)

第三个参数传数字Number
--------------

`JSON.stringify` 的第三个参数传数字时，这个数字会被当成 `JSON` 的缩进级别

比如下面例子，分别是2空格、4空格、6空格缩进

![](/images/jueJin/15c7052e641342a.png)

![](/images/jueJin/aff50c06a76b46d.png)

第三个参数传字符串String
---------------

`JSON.stringify` 的第三个参数传字符串时，这个字符串会被当成 `JSON` 的缩进占位符

![](/images/jueJin/45b6d614b45a4e0.png)

![](/images/jueJin/7f39e378320b4e1.png)

toJSON
------

如果被转换的对象中有 `toJSON` 这个方法的话，那么当`JSON.stringify`进行转换后，会获取这个`toJSON`方法的执行返回值

![](/images/jueJin/bcb50688cddb43a.png)

![](/images/jueJin/2c8780b27e5f47d.png)

JSON.stringify 局限性
------------------

很多人使用 `JSON.stringify` 来做深拷贝，但是这是万万不行的，因为它是有局限性的

![](/images/jueJin/665a0cec2eeb498.png)

从下面例子可以看出：

*   undefined、function、symbol 在转换后直接被忽略了
*   正则表达式转换成对象，日期转换成字符串
*   NaN、Infinity 直接变成 null

所以千万不要用 `JSON.stringify` 来做深拷贝！！！得不到满意的结果的！！！

![](/images/jueJin/7e2e2cf62a3c418.png)

环引用报错
-----

对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误

以前旧版的浏览器和Nodejs是会直接报错的，但是貌似现在新版的不会报错了

![](/images/jueJin/c61f71b9720a4e9.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")