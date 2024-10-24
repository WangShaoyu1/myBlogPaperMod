---
author: "Gaby"
title: "面试官最喜欢问☞HTML && CSS专题"
date: 2021-08-13
description: "本专题按照以下几个方便进行整理： HTML CSS 适合初次全面复习的同学，查缺补漏，知识面比较全。将最近面试常遇到的面试题又加以整理。"
tags: ["前端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:4,views:220,"
---
**这是我参与8月更文挑战的第11天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

目录
--

*   前言
*   HTML
*   CSS

* * *

前言
--

本专题按照以下几个方便进行整理：

*   HTML
*   CSS

适合初次全面复习的同学，查缺补漏，知识面比较全，复习完成后，再按照本人整理的面试高频题配合复习，使得找工作事半功倍，一定要理解，不要死记硬背，对于一些概念性的和原理的内容要深入理解。

> “你从头读，尽量往下读，直到你一窍不通时，再从头开始，这样坚持往下读，直到你完全读懂为止。”

HTML
----

### DOCTYPE及作用

**概念**

DTD（document type definition，文档类型定义）声明于文档最前面，用来定义XML或（X）HTML的文件类型。浏览器会使用它来判断文档类型，并根据这个判断决定用什么引擎来解析和渲染他们。

**解析引擎的两种模式**

解析引擎有严格模式和混杂模式。严格模式的排版和 JS 运作模式是 以该浏览器支持的最高标准运行。混杂模式，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面。

**DOCTYPE的作用**

DOCTYPE是用来声明文档类型和DTD规范的，其作用一是文件的合法性验证。如果文件代码不合法，那么浏览器解析时会出一些错误。二是浏览器会使用它来判断文档类型，并根据这个判断决定用什么引擎来解析和渲染他们。

### HTML5 新特性、语义化

1.  **概念**：
    
    HTML5的语义化指的是`合理正确的使用语义化的标签来创建页面结构`。【正确的标签做正确的事】
    
2.  **语义化标签**：
    
    header nav main article section aside footer
    
3.  **语义化的优点**:
    
    *   在`没CSS样式的情况下，页面整体也会呈现很好的结构效果`
    *   `代码结构清晰`，易于阅读，
    *   `利于开发和维护` 方便其他设备解析（如屏幕阅读器）根据语义渲染网页。
    *   `有利于搜索引擎优化（SEO）`，搜索引擎爬虫会根据不同的标签来赋予不同的权重

### HTML5新特性有哪些

*   语义化标签
*   音视频处理API(audio,video)
*   canvas / webGL
*   拖拽释放(Drag and drop) API
*   history API
*   requestAnimationFrame
*   地理位置(Geolocation)API
*   webSocket
*   web存储 localStorage、SessionStorage
*   表单控件，calendar、date、time、email、url、search

### 渐进增强与优雅降级的理解及区别

**渐进增强（Progressive Enhancement）：** 一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验。

**优雅降级（Graceful Degradation）：** 一开始就构建站点的完整功能，然后针对浏览器测试和修复。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览。 **两者区别** 1、广义： 其实要定义一个基准线，在此之上的增强叫做渐进增强，在此之下的兼容叫优雅降级 2、狭义： 渐进增强一般说的是使用CSS3技术，在不影响老浏览器的正常显示与使用情形下来增强体验，而优雅降级则是体现html标签的语义，以便在js/css的加载失败/被禁用时，也不影响用户的相应功能。

```css
/* 例子 */
.transition { /*渐进增强写法*/
-webkit-transition: all .5s;
-moz-transition: all .5s;
-o-transition: all .5s;
transition: all .5s;
}
.transition { /*优雅降级写法*/
transition: all .5s;
-o-transition: all .5s;
-moz-transition: all .5s;
-webkit-transition: all .5s;
}

```

### 常见的兼容性问题

1.  不同浏览器的标签默认的margin和padding不一样。\*{margin:0;padding:0;}
    
2.  IE6双边距bug：块属性标签float后，又有横行的margin情况下，在IE6显示margin比设置的大。hack：display:inline;将其转化为行内属性。
    
3.  设置较小高度标签（一般小于10px），在IE6，IE7中高度超出自己设置高度。hack：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。
    
4.  Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。
    
5.  超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}
    

### 行内元素和块级元素

常见的行内元素：span、a、lable、strong、b、br、`img`、`input`、select、textarea等

常见的块级元素：div、p、li、h1~h6、`form`、ul、li、ol、dl、address、hr、menu、table等

在标准文档流里面，块级元素具有以下特点：

```js
① 总是在新行上开始，占据一整行；
② 高度，行高以及外边距和内边距都可控制；
③ 宽带始终是与浏览器宽度一样，与内容无关；
④ 它可以容纳内联元素和其他块元素。
```

行内元素具有以下特点：

```js
① 和其他元素都在一行上；
② 高，行高及外边距和内边距部分可改变；
③ 宽度只与内容有关；
④ 行内元素只能容纳文本或者其他行内元素。
不可以设置宽高，其宽度随着内容增加，高度随字体大小而改变，内联元素可以设置外边界，但是外边界不对上下起作用，只能对左右起作用，也可以设置内边界，但是内边界在ie6中不对上下起作用，只能对左右起作用
```

### DOM、BOM对象

`BOM（Browser Object Model）`是指浏览器对象模型，可以对浏览器窗口进行访问和操作。使用 BOM，开发者可以移动窗口、改变状态栏中的文本以及执行其他与页面内容不直接相关的动作。 使 `JavaScript` 有能力与浏览器"对话"。 `DOM （Document Object Model）`是指文档对象模型，通过它，可以访问`HTML`文档的所有元素。 `DOM` 是 `W3C`（万维网联盟）的标准。`DOM` 定义了访问 `HTML` 和 `XML` 文档的标准： "W3C 文档对象模型（DOM）是中立于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式。" `W3C DOM` 标准被分为 3 个不同的部分：

*   核心 `DOM` - 针对任何结构化文档的标准模型
*   `XML DOM` - 针对 XML 文档的标准模型
*   `HTML DOM` - 针对 HTML 文档的标准模型

什么是 `XML DOM`？ `XML DOM` 定义了所有 XML 元素的对象和属性，以及访问它们的方法。 什么是 HTML DOM？ HTML DOM 定义了所有 HTML 元素的对象和属性，以及访问它们的方法。

CSS
---

### CSS 选择器及优先级

**选择器**

*   id选择器(#myid)
*   类选择器(.myclass)
*   属性选择器(a\[rel="external"\])
*   伪类选择器(a:hover, li:nth-child)
*   标签选择器(div, h1,p)
*   相邻选择器（h1 + p）
*   子选择器(ul > li)
*   后代选择器(li a)
*   通配符选择器(\*)

**优先级：**

*   `!important`
*   内联样式（1000）
*   ID选择器（0100）
*   类选择器/属性选择器/伪类选择器（0010）
*   元素选择器/伪元素选择器（0001）
*   关系选择器/通配符选择器（0000）

带!important 标记的样式属性优先级最高； 样式表的来源相同时：`!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性`

### CSS 盒子模型

CSS 盒模型本质上是一个盒子，它包括：外边距，边框，内边距和实际内容。CSS 中的盒子模型包括 IE 盒子模型和标准的 W3C 盒子模型。在标准的盒子模型中，width 指 content 部分的宽度，在 IE 盒子模型中，width 表示 content+padding+border 这三个部分的宽度，故在计算盒子的宽度时存在差异：

**标准盒模型：** 一个块的总宽度=width+margin(左右)+padding(左右)+border(左右)

**怪异盒模型：** 一个块的总宽度=width+margin（左右）（既 width 已经包含了 padding 和 border 值）

### BFC（块级格式上下文）

**BFC的概念**

`BFC` 是 `Block Formatting Context` 的缩写，即块级格式化上下文。`BFC`是CSS布局的一个概念，是一个独立的渲染区域，规定了内部box如何布局， 并且这个区域的子元素不会影响到外面的元素，其中比较重要的布局规则有内部 box 垂直放置，计算 BFC 的高度的时候，浮动元素也参与计算。

**BFC的原理布局规则**

*   BFC是一个独立容器，容器里面的`子元素不会影响到外面的元素`
*   内部的Box在`垂直方向`挨个排列。Box`垂直方向的距离由margin决定`。处于同一个BFC的两个相邻Box的margin会发生重叠。
*   每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此
*   BFC的区域`不会与float box重叠`，计算BFC的高度时，`浮动元素也参与计算高度`
*   元素的类型和`display属性，决定了这个Box的类型`。不同类型的Box会参与不同的`Formatting Context`。

> 记忆口诀：内外和平不影响，垂直排列高margin，浮动计高不重叠，元素容器两无间。

**如何创建BFC？**

*   根元素，即HTML元素
*   float的值不为none
*   position为absolute或fixed
*   display的值为inline-block、table-cell、table-caption\[display定义元素应该生成的盒子类型。\]
*   overflow的值不为visible\[overflow 属性规定当内容溢出元素框时发生的事情。\]

> 记忆口诀：`根浮定位溢类型`(对应，根元素、浮动float、定位position、溢出overflow、类型display)

**BFC的使用场景**

*   去除垂直外边距重叠问题
*   清除浮动（让父元素的高度包含子浮动元素）
*   避免某元素被浮动元素覆盖
*   避免多列布局由于宽度计算四舍五入而自动换行

> 记忆口诀：垂直重叠清浮动，多列布局避浮盖。(避浮盖是指毕福剑脑瓜子上的天灵盖)

### CSS3新特性

*   过渡

```js
/*所有属性从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒*/
transition：all,.5s
```

*   动画

```js
//animation：动画名称，一个周期花费时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放动画（默认normal），是否暂停动画（默认running）
/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;
```

*   形状转换

```js
//transform:适用于2D或3D转换的元素
//transform-origin：转换元素的位置（围绕那个点进行转换）。默认(x,y,z)：(50%,50%,0)
transform:translate(30px,30px);
transform:rotate(30deg);
transform:scale(.8);
```

*   选择器:nth-of-type()
    
*   阴影 文字阴影: text-shadow: 2px 2px 2px #000;(水平阴影，垂直阴影，模糊距离，阴影颜色) 盒子阴影: box-shadow: 10px 10px 5px #999
    
*   边框 border-image: url(border.png);
    
*   背景
    
*   文字
    
*   渐变
    
*   Filter（滤镜）
    
*   弹性布局、栅格布局、多列布局
    
*   媒体查询
    

### position 属性的值有哪些及其区别

**固定定位 fixed**： 元素的位置相对于浏览器窗口是固定位置，即使窗口是滚动的它也不会移动。Fixed 定 位使元素的位置与文档流无关，因此不占据空间。 Fixed 定位的元素和其他元素重叠。

**相对定位 relative**： 如果对一个元素进行相对定位，它将出现在它所在的位置上。然后，可以通过设置垂直 或水平位置，让这个元素“相对于”它的起点进行移动。 在使用相对定位时，无论是 否进行移动，元素仍然占据原来的空间。因此，移动元素会导致它覆盖其它框。

**绝对定位 absolute**： 绝对定位的元素的位置相对于最近的已定位父元素，如果元素没有已定位的父元素，那 么它的位置相对于。absolute 定位使元素的位置与文档流无关，因此不占据空间。 absolute 定位的元素和其他元素重叠。

**粘性定位 sticky**： 元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定 位，之后为固定定位。

**默认定位 Static**： 默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声 明）。 inherit: 规定应该从父元素继承 position 属性的值。

### box-sizing属性

box-sizing 规定两个并排的带边框的框，语法为 box-sizing：content-box/border-box/inherit

**content-box**：宽度和高度分别应用到元素的内容框，在宽度和高度之外绘制元素的内边距和边框。【标准盒子模型】

**border-box**：为元素设定的宽度和高度决定了元素的边框盒。【IE 盒子模型】

**inherit**：继承父元素的 box-sizing 值。

### 让一个元素水平垂直居中，到底有多少种方案？

*   **水平居中**
    
    *   对于 行内元素 : `text-align: center`;
        
    *   对于确定宽度的块级元素：
        
        （1）width和margin实现。`margin: 0 auto`;
        
        （2）绝对定位和margin-left: -width/2, 前提是父元素position: relative
        
    *   对于宽度未知的块级元素
        
        （1）`table标签配合margin左右auto实现水平居中`。使用table标签（或直接将块级元素设值为 display:table），再通过给该标签添加左右margin为auto。
        
        （2）inline-block实现水平居中方法。display：inline-block和text-align:center实现水平居中。
        
        （3）`绝对定位+transform`，translateX可以移动本身元素的50%。
        
        （4）flex布局使用`justify-content:center`
        
*   **垂直居中**
    
    1.  利用 `line-height` 实现居中，这种方法适合纯文字类
    2.  通过设置父容器 相对定位 ，子级设置 `绝对定位`，标签通过margin实现自适应居中
    3.  弹性布局 flex :父级设置display: flex; 子级设置margin为auto实现自适应居中
    4.  父级设置相对定位，子级设置绝对定位，并且通过位移 transform 实现
    5.  `table 布局`，父级通过转换成表格形式，`然后子级设置 vertical-align 实现`。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）。

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<style rel="stylesheet" type="text/css">
/* 绝对性定位 */
    .div1 {
    position:absolute;
    width:200px;
    height:200px;
    top:0;
    right:0;
    bottom:0;
    left:0;
    margin: auto;
    background: pink;
}
    .div2 {
    position:absolute;
    top:50%;
    left:50%;
    width:200px;
    height: 200px;
    margin: -100px 0 0 -100px;
    background:red;
}
/* 利用`transform` 属性 */
.div3 { position: absolute; /* 相对定位或绝对定位均可 */
width:200px;
height:200px;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
background-color: pink; /* 方便看效果 */
}
/* 利用 flex 布局 */
    .container {
    display: flex;
    align-items: center;/* 垂直居中 */
    justify-content: center; /* 水平居中 */
    height:200px;
}
    .container div {
    width: 100px;
    height: 100px;
    background-color: greenyellow; /*方便看效果 */
}
</style>
<body>
<div class="div1"></div>
<div class="div2"></div>
<div class="div3"></div>
<div class="container">
<div></div>
</div>
</body>
</html>
```

### 页面布局

#### 1.Flex 布局

布局的传统解决方案，基于盒状模型，依赖 display 属性 + position 属性 + float 属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

Flex 是 Flexible Box 的缩写，意为"弹性布局",用来为盒状模型提供最大的灵活性。指定容器 display: flex 即可。 简单的分为容器属性和元素属性。

容器的属性：

*   flex-direction：决定主轴的方向（即子 item 的排列方法）flex-direction: row | row-reverse | column | column-reverse;
*   flex-wrap：决定换行规则 flex-wrap: nowrap | wrap | wrap-reverse;
*   flex-flow： .box { flex-flow: || ; }
*   justify-content：对其方式，水平主轴对齐方式
*   align-items：对齐方式，竖直轴线方向
*   align-content

项目的属性（元素的属性）：

*   order 属性：定义项目的排列顺序，顺序越小，排列越靠前，默认为 0
*   flex-grow 属性：定义项目的放大比例，即使存在空间，也不会放大
*   flex-shrink 属性：定义了项目的缩小比例，当空间不足的情况下会等比例的缩小，如果 定义个 item 的 flow-shrink 为 0，则为不缩小
*   flex-basis 属性：定义了在分配多余的空间，项目占据的空间。
*   flex：是 flex-grow 和 flex-shrink、flex-basis 的简写，默认值为 0 1 auto。
*   align-self：允许单个项目与其他项目不一样的对齐方式，可以覆盖
*   align-items，默认属 性为 auto，表示继承父元素的 align-items 比如说，用 flex 实现圣杯布局

#### 2.Rem 布局

首先 Rem 相对于根(html)的 font-size 大小来计算。简单的说它就是一个相对单例 如:font-size:10px;,那么（1rem = 10px）了解计算原理后首先解决怎么在不同设备上设置 html 的 font-size 大小。其实 rem 布局的本质是等比缩放，一般是基于宽度。

**优点**：可以快速适用移动端布局，字体，图片高度

**缺点**：

①目前 ie 不支持，对 pc 页面来讲使用次数不多；  
②数据量大：所有的图片，盒子都需要我们去给一个准确的值；才能保证不同机型的适配；  
③在响应式布局中，必须通过 js 来动态控制根元素 font-size 的大小。也就是说 css 样式和 js 代码有一定的耦合性。且必须将改变 font-size 的代码放在 css 样式之前。

#### 3.百分比布局

通过百分比单位 " % " 来实现响应式的效果。通过百分比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。 直观的理解，我们可能会认为子元素的百分比完全相对于直接父元素，height 百分比相 对于 height，width 百分比相对于 width。 padding、border、margin 等等不论是垂直方向还是水平方向，都相对于直接父元素的 width。 除了 border-radius 外，还有比如 translate、background-size 等都是相对于自身的。

**缺点**：

（1）计算困难  
（2）各个属性中如果使用百分比，相对父元素的属性并不是唯一的。造成我们使用百分比单位容易使布局问题变得复杂。

#### 4.浮动布局

浮动布局:当元素浮动以后可以向左或向右移动，直到它的外边缘碰到包含它的框或者另外一个浮动元素的边框为止。元素浮动以后会脱离正常的文档流，所以文档的普通流中的框就变的好像浮动元素不存在一样。

**优点**

这样做的优点就是在图文混排的时候可以很好的使文字环绕在图片周围。另外当元素浮动了起来之后，它有着块级元素的一些性质例如可以设置宽高等，但它与inline-block还是有一些区别的，第一个就是关于横向排序的时候，float可以设置方向而inline-block方向是固定的；还有一个就是inline-block在使用时有时会有空白间隙的问题

**缺点**

最明显的缺点就是浮动元素一旦脱离了文档流，就无法撑起父元素，`会造成父级元素高度塌陷`。

### 双飞翼布局和圣杯布局

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<style rel="stylesheet" type="text/css">
    .header,.footer{
    width: 100%;
    height: 60px;
    text-align: center;
    background:green;
}
/* 双飞翼布局
    .container {
    height: 500px;
    overflow: hidden;
    background-color: greenyellow;
}
    .lay{
    float: left;
    overflow: hidden;
}
    .middle{
    width: 100%;
    background: yellow;
}
    .left{
    width: 200px;
    margin-left: -100%;
    background: red;
}
    .right{
    width: 200px;
    margin-left: -200px;
    background: blue;
    }*/
    
    /*圣杯布局*/
        .container {
        height: 500px;
        overflow: hidden;
        padding: 0 200px 0 200px;/*圣杯*/
        background-color: greenyellow;
    }
        .lay{
        position: relative;/*圣杯*/
        float: left;
        overflow: hidden;
    }
        .middle{
        width: 100%;
        background: yellow;
    }
        .left{
        width: 200px;
        left: -200px;/*圣杯*/
        margin-left: -100%;
        background: red;
    }
        .right{
        width: 200px;
        right: -200px;/*圣杯*/
        margin-left: -200px;
        background: blue;
    }
    </style>
    <body>
    <div class="header">header</div>
    <div class="container">
    <div class="lay middle">middlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddle</div>
    <div class="lay left">leftleftleftleftleftleftleftleftleftleftleftleftleft</div>
    <div class="lay right">rightrightrightrightrightrightrightrightrightrightrightrightright</div>
    </div>
    <div class="footer">footer</div>
    </body>
    </html>
```

### 如何使用rem或viewport进行移动端适配

**rem适配原理：**

改变了一个元素在不同设备上占据的css像素的个数

rem适配的优缺点

*   优点：没有破坏完美视口
*   缺点：px值转换rem太过于复杂(下面我们使用less来解决这个问题)

**viewport适配的原理**

viewport适配方案中，每一个元素在不同设备上占据的css像素的个数是一样的。但是css像素和物理像素的比例是不一样的，等比的

viewport适配的优缺点

*   在我们设计图上所量取的大小即为我们可以设置的像素大小，即所量即所设
*   缺点破坏完美视口

### 清除浮动的方式

*   添加额外标签

```html
<div class="parent">
//添加额外标签并且添加clear属性
<div style="clear:both"></div>
//也可以加一个br标签
```

*   父级添加overflow属性，或者设置高度
*   建立伪类选择器清除浮动

```css
//在css中添加:after伪元素
    .parent:after{
    /* 设置添加子元素的内容是空 */
    content: '';
    /* 设置添加子元素为块级元素 */
    display: block;
    /* 设置添加的子元素的高度0 */
    height: 0;
    /* 设置添加子元素看不见 */
    visibility: hidden;
    /* 设置clear：both */
    clear: both;
}
```

### CSS预处理器Sass、Less、Stylus的区别

什么事CSS预处理器?

CSS预处理器是一种语言用来为CSS增加一些变成的特性，无需考虑浏览器兼容问题，例如你可以在CSS中使用变量，简单的程序逻辑、函数等在编程语言中的一些基本技巧，可以让CSS更加简洁，适应性更强，代码更直观等诸多好处 基本语法区别

Sass是以.sass为扩展名，Less是以.less为扩展名，Stylus是以.styl为扩展名 变量的区别

Sass 变量必须是以`$`开头的，然后变量和值之间使用冒号（：）隔开，和css属性是一样的。 Less 变量是以`@`开头的，其余sass都是一样的。 Stylus 对变量是没有任何设定的，可以是以$开头或者任意字符，而且变量之间可以冒号，空格隔开，但是在stylus中不能用@开头 三种预处理器都有：嵌套、运算符、颜色函数、导入、继承、混入。Stylus还有一些高级特性。例如循环、判断等

### 隐藏页面中某个元素的方法

1.`opacity：0`，该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定 一些事件，如click 事件，那么点击该区域，也能触发点击事件的

2.`visibility：hidden`，该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已 经绑定的事件 ，隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

3.`display：none`，把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素。 不显示对应的元素，在文档布局中不再分配空间（回流+重绘）

> 透明可视和类型，零圈隐藏是为none。opacity visibility display

### 用CSS实现三角符号

```css
/*记忆口诀：盒子宽高均为零，三面边框皆透明。 */
    div:after{
    position: absolute;
    width: 0px;
    height: 0px;
    content: " ";
    border-right: 100px solid transparent;
    border-top: 100px solid #ff0;
    border-left: 100px solid transparent;
    border-bottom: 100px solid transparent;
}
```

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**

* * *

往期文章
----

*   [前端面试☞HTTP及网络专题](https://juejin.cn/post/6995404801848639501 "https://juejin.cn/post/6995404801848639501")
*   [2021年前端面试知识点大厂必备](https://juejin.cn/post/6989800620437798919 "https://juejin.cn/post/6989800620437798919")
*   [7月前端高频面试题](https://juejin.cn/post/6992222084382326798 "https://juejin.cn/post/6992222084382326798")
*   [浏览器的工作原理](https://juejin.cn/post/6992597760935460901 "https://juejin.cn/post/6992597760935460901")
*   [深度剖析TCP与UDP的区别](https://juejin.cn/post/6992743999756845087 "https://juejin.cn/post/6992743999756845087")
*   [彻底理解浏览器的缓存机制](https://juejin.cn/post/6992843117963509791 "https://juejin.cn/post/6992843117963509791")
*   [JavaScript是如何影响DOM树构建的](https://juejin.cn/post/6992887065050349605 "https://juejin.cn/post/6992887065050349605")
*   [JavaScript 事件模型](https://juejin.cn/post/6992978598441254925 "https://juejin.cn/post/6992978598441254925")
*   [深入了解现代 Web 浏览器](https://juejin.cn/post/6993095345576083486 "https://juejin.cn/post/6993095345576083486")
*   [在Linux阿里云服务器上部署Nextjs项目](https://juejin.cn/post/6993205190471974925 "https://juejin.cn/post/6993205190471974925")
*   [Snowpack - 更快的前端构建工具](https://juejin.cn/post/6993209659297366024 "https://juejin.cn/post/6993209659297366024")
*   [深入了解 JavaScript 内存泄露](https://juejin.cn/post/6993614323176177695 "https://juejin.cn/post/6993614323176177695")
*   [细说前端路由的hash模式和 history模式](https://juejin.cn/post/6993897542970769421 "https://juejin.cn/post/6993897542970769421")
*   [CSS样式之BFC和IFC的用法](https://juejin.cn/post/6993902300091645965 "https://juejin.cn/post/6993902300091645965")
*   [CSS性能优化](https://juejin.cn/post/6994059570469404686 "https://juejin.cn/post/6994059570469404686")
*   [快速写一个让自己及面试官满意的原型链](https://juejin.cn/post/6994295598958510111 "https://juejin.cn/post/6994295598958510111")
*   [细说JS模块化规范（CommonJS、AMD、CMD、ES6 Module）](https://juejin.cn/post/6994814324548091940 "https://juejin.cn/post/6994814324548091940")
*   [webpack工作原理及loader和plugin的区别](https://juejin.cn/post/6995073296517562376 "https://juejin.cn/post/6995073296517562376")
*   [解读 HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542 "https://juejin.cn/post/6995109407545622542")