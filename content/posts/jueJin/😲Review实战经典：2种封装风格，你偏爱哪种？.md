---
author: "掘金安东尼"
title: "😲Review实战经典：2种封装风格，你偏爱哪种？"
date: 2022-07-25
description: "一直想做一个调研，到底有多少比例的web前端工友工作内容以开发后台管理系统为主？60%？80%？哈哈，欢迎阅读本篇关于后台管理系统实战review~"
tags: ["前端","JavaScript","面试"]
ShowReadingTime: "阅读7分钟"
weight: 213
---
🎆背景交代
------

一直想做一个调研，到底有多少比例的 web 前端工友工作内容以 **开发后台管理系统** 为主。

本瓜虽然以前也做过小程序项目、H5项目，但现实仍是以开发后台管理系统为主，是个不折不扣的“**后管前端er**”。大部分 web 前端工友应该也相似吧，这或许是由市场需求决定的。

所以大家在后台管理系统项目中遇到的很多问题也都是相似的，代码很值得 review，本篇带来一例（真实）~

闲言少叙，开冲！！ヾ(◍°∇°◍)ﾉﾞ

众所周知，在后台管理项目中，这样色的 table 是最常见的：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26c5595835a84753be7d5696d2e63acb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这个 table 中，主题模板有很多状态，比如：**草稿** 状态、**已发布** 状态、**待审核** 状态等等；

点击这些状态又进入到不同的操作页中，比如：草稿对应 **新建** 操作页，已发布对应 **修改** 操作页，待审核对应 **审核** 操作页等等。

在不同的操作页中意味着要请求不同的 **接口**、不同的接口意味着有不同的请求 **参数**。

**你会惊讶的发现 新建页、修改页、审核页 其实都长得差不多！** 大概像下图这样色的（因为它们都会列出 table 的大部分字段，不同的字段存在不同的展现，有些只读、有些可写、有些存在关联项等等）：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f578d49ece244b1a39653d5a8518f53~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

实际项目中的 form 会比上述截图所示复杂得多。比如本瓜所在项目中，这样的操作页，有几十个字段，包括查看、编辑、状态关联等。此处仅做抽象示意处理。

基于上面的背景，我们可以想象：如果每个操作页面都是独立的，新建页有几十个表格字段、编辑页有几十个表格字段、审核页有几十个表格字段……而这些字段大部分类似，只是在部分字段上有区别或定制化的写法，**那肯定不至于：有几个操作页，就复制几个页面吧？！**

这样没有任何复用思维，每当需要增删改字段的时候，都要在多个页面中进行操作，这是“大聪明”做法。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ffcc324d1304a028ef7b8e01de3201c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**于是乎，我们需要复用！！**

（复用！又是复用！写业务代码最牛b的地方就是复用。高耦合、低内聚就是说如何复用。设计模式也是为了合理复用；就连写算法的时候，复用也是最牛b的，如何复用题干条件、或者复用空间来换取时间等等）

手段、方法、途径有很多，这里拎出来单讲的一点复用是：**对请求参数的封装复用。**

🎃代码抽象
------

我们尝试将上一节的背景做伪代码的抽象（也可稍作修改在控制台调试）：

如果不做任何封装，它将会是类似这样的：

go

 代码解读

复制代码

`// 设一个页面的全局表格对象 const ruleForm = {                   type:"fe",                   time:"20200721",                   title:"day day up",                   status:"draft",                   weight:999,                   comment:"great",                   balabala:"我是冗余参数1",                   bilibilib:"我是冗余参数2"                   }`

*   新建操作页参数

typescript

 代码解读

复制代码

`const {type,time,.title,status.weight,comment} = ruleForm // 解构得值 const getCreateParam = function(){       // ...省略一系列操作       return {only: "create"} } const createParam = getCreateParam() // 得到特殊传参 const param = {     // 公共传参     type,     time,     title,     status,     weight,     comment,     // 特殊传参     createParam } createRequest(param).then(res=> ... )`

*   修改操作页参数

javascript

 代码解读

复制代码

`const {type,time,.title,status.weight,comment} = ruleForm const getEditParam1= function(){       // ...       return {only1: "edit1"} } const editParam1 = getEditParam1() const getEditParam2= function(){       // ...       return {only2: "edit2"} } const editParam2 = getEditParam2() const param = {     // 公共传参     type,     time,     title,     status,     weight,     comment,     // 特殊传参     editParam1,     editParam2 } editRequest(param).then(res=> ... )`

*   审核操作页参数

javascript

 代码解读

复制代码

`const {type,time,.title,status.weight,comment} = ruleForm const getReviewParam1= function(){       // ...       return {only1: "review1"} } const reviewParam1= getReviewParam1() const getReviewParam2= function(){       // ...       return {only2: "review2"} } const reviewParam2= getReviewParam2() const getReviewParam3= function(){       // ...       return {only3: "review3"} } const reviewParam3= getReviewParam3() const param = {     // 公共传参     type,     time,     title,     status,     weight,     comment,     // 特殊传参     reviewParam1,     reviewParam2,     reviewParam3 } reviewRequest(param).then(res => ...)`

**试想一下这个参数是 10 个或20 个，甚至30 个呢？**

**实际的业务代码中变量赋值、变形，比这个会复杂的多的多！**

✨1. 面向对象封装
----------

第一种，我们先用面向对象的思路来封装上述过程：

// 获取公共参数

kotlin

 代码解读

复制代码

`class CommonParam {   constructor(){       this.ruleForm = ruleForm   }   get(){     const {type,time,title,status,weight,comment} = this.ruleForm     return{type,time,title,status,weight,comment}   } }`

// 获取创建操作的参数

scala

 代码解读

复制代码

`class CreateParam extends CommonParam {   getCreateParam(){     // ...省略一系列操作     return {only: "create"}   }   get(){       const para = super.get()       return {...para,...this.getCreateParam()}   } } let creatParam = new CreateParam().get() createRequest(creatParam).then(res=> ... )`

// 获取编辑操作的参数

scala

 代码解读

复制代码

`class EditParam extends CommonParam {   getEditParam1(){     return {only1: "edit1"}   }   getEditParam2(){     return {only2: "edit2"}   }   get(){       const para = super.get()       return {...para,...this.getEditParam1(),...this.getEditParam2()}   } } let editParam = new EditParam().get() editRequest(editParam).then(res=> ... )`

// 获取审核操作的参数

javascript

 代码解读

复制代码

`class ReviewParam extends CommonParam {   getReviewParam1(){     return {only1: "review1"}   }   getReviewParam2(){     return {only2: "review2"}   }   getReviewParam3(){     return {only3: "review3"}   }   get(){       const para = super.get()       return {...para,...this.getReviewParam1(),...this.getReviewParam2(),...this.getReviewParam3()}   } } let reviewParam = new ReviewParam().get() reviewRequest(reviewParam).then(res=> ... )`

有工友问，这里继承也就只继承了公共参数，有必要写 class 类吗？

本瓜觉得，如果你的代码都是面向过程的风格，那这里写成这样，多少有点突兀；但如果大量都是用类做了封装的，这里也有必要做封装。

1.  代码风格保持一致；
2.  class 还有一个好处，代码呈现块状，**声明和调用是分开的**，这一点很重要；
3.  当然也利于后续扩展、改造。自上而下的过程式代码写多了，会很难阅读以及 debugger。

✨2. 函数式编程封装
-----------

第二种，我们用函数式编程的思维去封装上述过程：

要借助我们的老朋友， compose 函数进行函数组合~

*   简易版本 compose 函数代码如下：

javascript

 代码解读

复制代码

`export const compose = function(...fns) {   return function composed(result) {     // 拷贝一份保存函数的数组     var list = fns.slice()     while (list.length > 0) {       // 将最后一个函数从列表尾部拿出并执行它       result = list.pop()(result)       if (result === 'breakCompose') { // * 任一步骤 renturn "breakCompose" 可以提前结束流程；         break       }     }     return result   } }`

有一位工友问过 compose 过程中如何 break，以上代码来自本瓜实战项目，就能实现；compose 函数可以做很多改造，可以自己动手试试~

封装本篇实战的请求参数：

scss

 代码解读

复制代码

`/******函数声明部分******/ /* * 公共参数 */ const step_getCommonParam = function(ruleForm){     const {type,time,title,status,weight,comment} = ruleForm     return{type,time,title,status,weight,comment} } /* * 创建步骤函数 */ const step_getCreateParam= function(args){     // ...省略一系列操作     return {...args,only: "create"} } const step_createRequest = function(creatParam){     return createRequest(creatParam).then(res=> ... ) } /* * 编辑步骤函数 */ const getEditParam1= function(args){     // ...     return {...args,only: "edit1"} } const getEditParam2= function(args){     // ...     return {...args,only: "edit2"} } const step_editRequest = function(editParam){     return editRequest(editParam).then(res=> ... ) } /* * 审核步骤函数 */ const getReviewParam1= function(args){     return {...args,only1: "review1"} } const getReviewParam2= function(args){     return {...args,only1: "review2"} } const getReviewParam3= function(args){     return {...args,only1: "review3"} } const step_reviewRequest = function(reviewParam){     return reviewRequest(reviewParam).then(res=> ... ) } /******函数调用部分******/ const handleCreate = (...args) => {// 创建操作   const steps = [step_createRequest, step_getCreateParam, step_getCommonParam] // 步骤从右自左读   compose(...steps)(...args) } handleCreate(ruleForm) const handleEdit = (...args) => {// 编辑操作   const steps = [step_editRequest, step_getEditParam2,step_getEditParam1, step_getCommonParam]   compose(...steps)(...args) } handleEdit(ruleForm) const handleReview = (...args) => {// 审核操作   const steps = [step_reviewRequest,step_getReviewParam3,step_getReviewParam2,step_getReviewParam1,step_getCommonParam]   compose(...steps)(...args) } handleReview(ruleForm)`

如何？老观众有种熟悉的味道吧？和上面的代码对比，可以明显的感受风格的不一样吧？

![giphy.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79c8bee9643d486780666ba8e00410f0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

🍻Review 小结
-----------

本篇带来了后台管理系统常见的接口参数的封装 2 种风格。

最开始的代码，不做任何设计，复制多份，自上而下、**过程式的风格**；

优化1：借助 es6 class，js 可以简单的写出 **面向对象的代码风格**；

优化2：用 compose 函数组合的方式，实现 **函数式编程风格**。

过程式、面向对象、函数式，这种代码风格的学名是什么？

答：编程范式。

编程范式的思路不仅在原生 js 可以用，在 jq 中也可用，在 vue 、react 框架等等都可以用。感受感受，其实有些框架本身的一些设计是偏向不同风格的，js 是多范式语言，jq 偏向操作型过程式、vue 无明显倾向、过程式、面向对象、函数式都行、react 有点偏向函数式……

上述是本瓜项目实战的一点 review 体会。

由于本篇部分代码是伪代码，示意参考，或不尽完善，请各位斧正。

> OK，以上便是本篇分享。点赞关注评论，为好文助力👍
> 
> 我是掘金安东尼 🤠 100 万人气前端技术博主 💥 INFP 写作人格坚持 1000 日更文 ✍ 关注我，安东尼陪你一起度过漫长编程岁月 🌏

我正在参与掘金技术社区创作者签约计划招募活动，[点击链接报名投稿](https://juejin.cn/post/7112770927082864653 "https://juejin.cn/post/7112770927082864653")。