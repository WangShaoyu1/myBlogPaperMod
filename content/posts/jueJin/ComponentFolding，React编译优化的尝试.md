---
author: "putao"
title: "ComponentFolding，React编译优化的尝试"
date: 2021-10-14
description: "开头在react官网中关于hook的设计初衷里，有提到官方一直在使用Prepack来试验componentfolding，Prepack是一款提升js运行性能的工具，看一下官网你就能体验到它的"
tags: ["前端","React.js"]
ShowReadingTime: "阅读4分钟"
weight: 640
---
开头
==

在react官网中关于hook的设计初衷里，有提到官方一直在使用[Prepack](https://link.juejin.cn?target=https%3A%2F%2Fprepack.io%2F "https://prepack.io/") 来试验 [component folding](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fissues%2F7323 "https://github.com/facebook/react/issues/7323")，Prepack是一款提升js运行性能的工具，看一下官网你就能体验到它的强大之处，这里不多说，今天想聊聊component folding这个概念。

什么是Component Folding
====================

`Component Folding`是react核心开发者sebmarkbage(开创性引入react hook)在一个issue中提到的关于编译优化的问题，直译过来就是组件折叠，先把issue中的代码拷贝过来，看下这位大神的想法，首先是优化前的代码：

javascript

 代码解读

复制代码

`function Foo(props) {   if (props.data.type === 'img') {     return <img src={props.data.src} className={props.className} alt={props.alt} />;   }   return <span>{props.data.type}</span>; } Foo.defaultProps = {   alt: "An image of Foo." };`

ini

 代码解读

复制代码

`var CSSClasses = {   bar: 'bar' }; module.exports = CSSClasses;`

ini

 代码解读

复制代码

`var Foo = require('Foo'); var Classes = require('Classes'); function Bar(props) {   return <Foo data={{ type: 'img', src: props.src }} className={Classes.bar} />; }`

优化之后的代码：

javascript

 代码解读

复制代码

`function Bar_optimized(props) {   return <img src={props.src} className="Bar" alt="An image of Foo." />; }`

经过设想的优化后，代码体积大大降低，而且我们的组件性能更好，上面假设的编译优化过程就是Component Folding，把组件折叠更小，获得体积和性能的巨大提升。如果稍微了解点其他框架如vue/solidjs等等，这种概念似曾相识啊，偏编译的框架不都是这样做的么，而且目前已经有不错的实践了，但是react却在编译优化这个方面却没有太大的动作。还需要说的一点是这个issue是2016年提出了，且一直处于open状态，那么这样看来关于component Folding的优化何时能使用真是个未知数，但是不妨我们窥探关于react及其他框架关于编译方面的选择。

编译 vs 运行时
=========

目前主流的前端开发框架都在编译时和运行时之间做选择，react是运行时的代表，solidjs/svelte是编译时的代表，而vue3兼顾两者，保留vnde的同时在编译阶段做了大量的优化，取得了不错的平衡。那么决定一个框架的最终样子就要看它的核心原理了，首先我们针对提到了几个框架逐一说明；

1.svelte/solidjs
----------------

svelte/solidjs这类重编译的框架，是进几年来`None Virtual DOM`的代表，由于没有了Virtual DOM，那么自然就省去了diff，而且可以按需打包框架，最终输出的体积也是一大优势，在知乎上有关于svelte的讨论[如何看待 svelte 这个前端框架？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F53150351 "https://www.zhihu.com/question/53150351")，尤雨溪做了比较详细的分析，这里我就不过多复制粘贴了，当然solidjs思路也是类似的，只是语法更偏向于react。还想说一点的就是Virtual DOM虽然性能不那么理想，但是具有跨平台的特性，可以理解成是与平台无关的数据结构，最后交给特定的渲染器就能实现跨端的目标(如react native)，这也是它的一大优势。

2.vue3
------

前面也说到，vue3在编译和运行时做了一个很好的平衡，即保存了vnode，也会编译优化，因此集合了两者的优势，而且vue3也支持jsx写法，因此在灵活性上也给与了保证，至于vue具体做了哪些优化，推荐看[官方介绍](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1ke411W7WB%2F%3Fspm_id_from%3D333.788.recommend_more_video.15 "https://www.bilibili.com/video/BV1ke411W7WB/?spm_id_from=333.788.recommend_more_video.15")。

3.react
-------

react采用的jsx语法糖，jsx语法再编译成react.createElement(...)/jsx(...)这样一堆js代码，js是一门很灵活的语言，那么基于此想要做其他的编译优化，那么就需要基于静态分析，这也就是react很难迈过去的槛。这里再多说一点，tree sharking也是要基于静态分析才能实现，因此在esm出现之后才逐渐进入了大家的视野，而requirejs之类的社区包管理方案，是js运行时代表，因此不能做到tree sharking。前面也说到vue3支持虚拟DOM，但是vue基于模板语法，模板语法没有jsx灵活，但它相对稳定的结构通过AOT，将虚拟DOM的diff限制在了一个很小的范围内，相比react两棵完整的fiber tree比较，当然会更快。

回到主题
====

文章开头说Component Folding的这个编译优化，在issue里面也有比较有意思的讨论，其中sebmarkbage也提出了react面临的困难：react需要静态分析出组件的所有依赖，首先是目前的构建工具支持不太好，另一方面是js的灵活给静态分析带来了很大的困难，试想在一堆对象中去获取各种属性，然后组合成一个组件，这些关联属性可以被太多地方改变了，如果没有一个更聪明的编译器，是很难去做编译优化的。

参考：

*   [Component Folding issue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fissues%2F7323%23 "https://github.com/facebook/react/issues/7323#")