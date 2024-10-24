---
author: "Gaby"
title: "介绍一下CSS中的Grid网格布局?"
date: 2022-06-06
description: "随着网格布局的普及率越来越高，在前端面试中出现的概率也逐年增长，这里只做个引子，这方面的内容还是需要重视起来的，不只是面试中，在日常项目中页可以提高自己的排版布局效率。"
tags: ["JavaScript","面试","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:19,comments:0,collects:41,views:3162,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第7天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

随着网格布局的普及率越来越高，在前端面试中出现的概率也逐年增长，这里只做个引子，这方面的内容还是需要重视起来的，不只是面试中，在日常项目中页可以提高自己的排版布局效率。

### 什么是网格布局

网格布局（Grid）应该是目前最强大的 CSS 布局方案。

它将网页划分成一个个网格，可以任意组合不同的网格，做出各种各样的布局。以前，只能通过复杂的 CSS 框架达到的效果，现在浏览器内置了。

`Grid` 布局即网格布局，是一个二维的布局方式，与 `Flex` 不同的是 Flex 是一维布局，而 Grid 由纵横相交的两组网格线形成的框架性布局结构，能够同时处理行与列，擅长将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。

Grid布局是将容器划分成“行”和“列”，产生单元格，然后指定“项目所在”的单元格。适合固定不需要动态改变的布局方式。

设置`display:grid/inline-grid`的元素就是网格布局容器，这样就能出发浏览器渲染引擎的网格布局算法

### 网格布局的属性

属性的基本概念：

1.  容器（container）——有容器属性
2.  项目（items）——有项目属性
3.  行（row)
4.  列（column）
5.  间距（gap) ——单元格之间的距离
6.  区域（area）—— 自己划分每个单元格占据的区域
7.  内容（content)

容器属性：

1.  grid-template-columns:设置每一列的宽度，可以是具体值，也可以是百分比  
    grid-template-rows:设置每一行的宽度，可以是具体值，也可以是百分比

常见的设置的值

repeat():第一个参数是重复的次数，第二个参数是所要重复的值

auto-fill：有时单元格的大小是固定的，但是容器的大小不确定，这个属性就会自动填充

fr：为了方便表示比例关系，网格布局提供了fr关键字（fraction的缩写，意为片段）

minmax():函数产生一个长度范围，表示长度就在这个范围之中，它接受两个参数，分别为最小值和最大值

auto:表示由浏览器自己决定长度

```js
    .content{
    width: 300px;
    height: 300px;
    margin: auto;
    display: grid;
    /* 中间的宽度由浏览器自己决定 */
    grid-template-columns:  100px auto 100px;
}
```

2.  grid-column-gap  
    grid-row-gap  
    grid-gap(前两个的缩写）  
    表示项目相互之间的距离，新版本grid-前缀已经删除。
    
3.  grid-template-areas  
    一个区域由单个或多个单元格组成，由自己决定（具体使用，需要在项目属性中设置）  
    区域不需要利用时，则使用“.”表示  
    区域的命名会影响到网络线，会自动命名为区域名-start，终止网格线自动命名为-end
    

4.grid-auto-flow:划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是“先行后列”，即先填满第一行，再开始放入第二行（就是子元素的排放顺序）  
grid-auto-flow：row;(先行后列)

5.justify-items（水平方向）/ align-items（垂直方向）  
设置单元格内容的水平和垂直对齐方式。

水平方向上：  
justify-items:start|end|center|stretch;  
justify-items:start; 起始方向对齐

5.  justify-content（水平方向）/ align-content（垂直方向）  
    设置**整个内容区域**的水平和垂直的对齐方式 可以采用 `place-item:center`

详细的属性可以参考 [阮一峰 CSS Grid 网格布局教程](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2019%2F03%2Fgrid-layout-tutorial.html "http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html")

### 网格布局的使用

display 属性 文章开头讲到，在元素上设置display：grid 或 display：inline-grid 来创建一个网格容器

display：grid 则该容器是一个块级元素

display: inline-grid 则容器元素为行内元素

grid-template-columns 属性，grid-template-rows 属性 grid-template-columns 属性设置列宽，grid-template-rows 属性设置行高

### 面试相关的问题

*   说说弹性布局的了解
    
    该题需要需要从整体入手，包含弹性布局的概念、常见属性、使用场景、使用心得体会，答的尽可能全面些，但不一定非常详细。
    
*   元素水平垂直居中
    
    一般情况下如何处理水平垂直居中，在弹性布局下如何处理，都要答出来，以便可以进行对比。
    
*   说下 `Flex` 与 `Grid` 的区别
    
*   如何实现两列或三列布局
    
*   flx都有哪些容器，说说他们的区别及父子关系，列举3个以上？