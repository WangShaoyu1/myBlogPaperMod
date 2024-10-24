---
author: "Sunshine_Lin"
title: "天天看到有人抵触ref，有人抵触reactive，把我整笑了"
date: 2023-12-11
description: "背景 这几天看到好多文章标题都是类似于： 不用 ref 的 xx 个理由 不用 reactive 的 xx 个理由 历数 ref 的 xx 宗罪 我就很不解，到底是什么原因导致有这两批人： 抵触 re"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:373,comments:0,collects:448,views:27156,"
---
背景
--

这几天看到好多文章标题都是类似于：

*   **不用 ref 的 xx 个理由**
*   **不用 reactive 的 xx 个理由**
*   **历数 ref 的 xx 宗罪**

我就很不解，到底是什么原因导致有这两批人：

*   **抵触 ref 的人**
*   **抵触 reactive 的人**

看了这些文章，我可以总结出他们的想法

### 抵触 reactive 的人

抵触 reactive 的人，他们的想法大概就是：

*   1、**Vue 官方推荐 ref**
*   2、**reactive 有类型限制，ref 没有**
*   3、**reactive 使用不当会丢失响应式，比如解构**
*   4、**reactive 无法修改整个对象的值**

### 抵触 ref 的人

抵触 ref 的人，他们的想法大概就是：

*   1、**ref 的底层其实就是 reactive，用 ref 相当于多了一层，耗费性能**
*   2、**ref 的 .value 用起来很麻烦，增加使用者心里负担**
*   3、**ref 到模板的时候会解掉 value 这一层，这时候也会耗费性能**

把我整笑了~
------

说实话，看到这些文章，有点把我整笑了，其实你要用 ref 或者 reactive 都没错，但是没比必要那么抵触，编程很多时候并不是非黑即白啊。。。

既然 Vue3 推出了 ref 和 reactive，那就说明他们都有存在的必要，在项目中不同的场景去运用他们，我觉得才是最好的，而不是用一个不用另一个，不止这两个，还有很多其他好用的 Vue3 API

我想针对这两批人的想法做一个回应：

### 回应 -> 抵触 reactive 的人

*   1、官方是推荐，不是抵触
*   2、reactive 既然有类型限制，那就在特定时候用 reactive 就行
*   3、使用不当会丢失响应式？那就是开发者对于 Vue3 API 的使用还不熟
*   4、用 Object.assign 就可以修改整个对象的值

### 回应 -> 抵触 ref 的人

*   1、耗费性能的话，这么久了，也没人贴出到底耗费了多少性能？
*   2、.value 不麻烦，我觉得 .value 可以起到辨别响应式和非响应式数据的效果，而且现在编辑器都有插件提供的代码补全了，多个 .value 也花不了多少时间吧？

灵活使用 Vue3 API 才是王道
------------------

其实在平时开发中，我觉得基本数据类型和数组，都可以用 ref 来管理，而对象的话可以使用 reactive 来管理，比如表单对象、状态对象

其实 Vue3 不止有这两个 API ，还有很多其他 API ，也很好用，大家只要去灵活使用它们，能让你的Vue3 项目上一个层次

readonly
--------

顾名思义，就是只读的意思，如果你的数据被这个 API 包裹住的话，那么修改之后并不会触发响应式，并且会提示警告

![](/images/jueJin/22f653e08f294cc.png)

![](/images/jueJin/f74cea75b88942e.png)

readonly 的用途一般用于一些 hooks 暴露出来的变量，不想外界去修改，比如我封装一个 hooks，这样去做的话，那么外界只能用变量，但是不能修改变量，这样大大保护了 hooks 内部的逻辑~

![](/images/jueJin/8416e9553eaf476.png)

shallowRef
----------

shallowRef 用来包住一个基础类型或者引用类型，如果是基础类型那么跟 ref 基本没区别，如果是引用类型的话，那么直接改深层属性是不能触发响应式的，除非直接修改引用地址，如下：

![](/images/jueJin/e7bc6181500b4eb.png)

> 注意：改深层属性能改数据，只是没触发响应式，所以当下一次响应式触发的时候，你修改的深层数据会渲染到页面上~

shallowRef 的用处主要用于一些比较大的但又变化不大的数据，比如我有一个表格数据，通过接口直接获取，并且主要用在前端展示，需要修改一些深层的属性，但是这些属性并不需要立即表现在页面上，比如以下例子，我只需要展示 name、age 字段，至于 isOld 字段并不需要展示，我想要计算 isOld 但是又不想触发响应式更新，所以可以用 shallowRef 包起来，进而减少响应式更新，优化性能

![](/images/jueJin/6f48a34e3bef417.png)

shallowReactive
---------------

shallowReactive 用来包住一个引用类型，被包住后，修改第一层才会触发响应式更新，也就是浅层的属性，修改深层的属性并不会触发响应式更新

> 注意：改深层属性能改数据，只是没触发响应式，所以当下一次响应式触发的时候，你修改的深层数据会渲染到页面上~

![](/images/jueJin/7c126e0793c143f.png)

shallowReactive 用的比较少，shallowReactive 的用处跟 shallowRef 比较像，都是为了让一些比较大的数据能减少响应式更新，进而优化性能

toRef & toRefs
--------------

先说说 toRef 吧，我们平时在使用 reactive 的时候会有一个苦恼，那就是解构，比如看以下例子，我们为了少些一些代码，解构出来了 name 并放到模板里渲染，但是当我们想改原数据的时候，发现 name 并不会更新，这就是解构出来基础类型的苦恼

![](/images/jueJin/2c6ed4907f824ec.png)

![](/images/jueJin/f3dc00e8e6ab45f.png)

这时我们可以使用 toRef，这个时候我们直接修改 name 也会触发原数据的修改，修改原数据也会触发 name 的修改

![](/images/jueJin/05e174dc67c5444.png)

![](/images/jueJin/0176bcba049d4ca.png)

但是如果是属性太多了，我们想一个一个去用 toRef 的话会写很多代码

![](/images/jueJin/cc48ad242cd746b.png)

所以我们可以使用 toRefs 一次性解构

![](/images/jueJin/36a94ca1d188406.png)

toRaw & markRaw & unref
-----------------------

toRaw 可以把一个响应式 reactive 转成普通对象，也就是把响应式对象转成非响应式对象

![](/images/jueJin/c34075f79532418.png)

toRaw 主要用在回调传参中，比如我封装一个 hooks，我想要把 hooks 内维护的响应式变量转成普通数据，当做参数传给回调函数，可以用 toRaw

![](/images/jueJin/e82fea7387d94c3.png)

markRaw 可以用来标记响应式对象里的某个属性不被追踪，如果你的响应式对象里有某个属性数据量比较大，但又不想被追踪，你可以使用 markRaw

![](/images/jueJin/4eb6c70d27e44cd.png)

unref 相当于返回 ref 的 value

![](/images/jueJin/c0b8dec8ae10451.png)

effectScope & onScopeDispose
----------------------------

effectScope 可以有两个作用：

*   收集副作用
*   全局状态管理

### 收集副作用

比如我们封装一个共用的 hooks，为了减少页面隐患，肯定会统一收集副作用，并且在组件销毁的时候去统一消除，比如以下代码：

![](/images/jueJin/2b76ad1206f9497.png)

但是这么收集很麻烦， effectScope 能帮我们做到统一收集，并且通过 stop 方法来进行清除，且 stop 执行的时候会触发 effectScope 内部的 onScopeDispose

![](/images/jueJin/2bc7a0813627438.png)

我们可以利用 effectScope & onScopeDispose 来做一些性能优化，比如下面这个例子，我们封装一个鼠标监听的 hooks

![](/images/jueJin/8b489685e20a48f.png)

但是如果在页面里调用多次的话，那么势必会往 window 身上监听很多多余的事件，造成性能负担，所以解决方案就是，无论页面里调用再多次 useMouse，我们只往 window 身上加一个鼠标监听事件

![](/images/jueJin/c1b96a7da6d942a.png)

### 全局状态管理

现在 Vue3 最火的全局状态管理工具肯定是 Pinia 了，那么你们知道 Pinia 的原理是什么吗？原理就是依赖了 effectScope

![](/images/jueJin/6a932cc5b2ef487.png)

所以我们完全可以自己使用 effectScope 来实现自己的局部状态管理，比如我们封装一个通用组件，这个组件层级比较多，并且需要共享一些数据，那么这个时候肯定不会用 Pinia 这种全局状态管理，而是会自己写一个局部的状态管理，这个时候 effectScope 就可以排上用场了

vueuse 中的 createGlobalState 就是为了这个而生

![](/images/jueJin/fa95cd3912b94d7.png)

![](/images/jueJin/d57ce5f260144eb.png)

provide & inject
----------------

Vue3 用来提供注入的 API，主要是用在组件的封装，比如那种层级较多的组件，且子组件需要依赖父组件甚至爷爷组件的数据，那么可以使用 provide & inject，最典型的例子就是 Form 表单组件，可以去看看各个组件库的源码，表单组件大部分都是用 provide & inject 来实现的，比如 Form、Form-Item、Input这三个需要互相依赖对方的规则、字段名、字段值，所以用 provide & inject 会更好。具体用法看文档吧~[cn.vuejs.org/guide/compo…](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fguide%2Fcomponents%2Fprovide-inject.html "https://cn.vuejs.org/guide/components/provide-inject.html")

![](/images/jueJin/1f39b6eb60384bb.png)

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