---
author: "Gaby"
title: "CSS样式之BFC和IFC的用法"
date: 2021-08-08
description: "BFC 1、BFC的布局规则 2、触发BFC的元素 3、BFC的作用和原理 IFC IFC的布局规则 一、BFC Block Formatting Contexts (BFC，块级格式化上下文)"
tags: ["前端","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:2,views:800,"
---
目录
--

### BFC

#### 1、BFC的布局规则

#### 2、触发BFC的元素

#### 3、BFC的作用和原理

### IFC

#### IFC的布局规则

* * *

### 一、BFC

Block Formatting Contexts (BFC，块级格式化上下文)，就是 一个块级元素 的渲染显示规则 （可以把 BFC 理解为一个封闭的大箱子，容器里面的子元素不会影响到外面的元素）。

#### 1、BFC的布局规则

①.内部的盒子会在垂直方向，一个个地放置。  
②.盒子垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的上下margin会发生重叠。

③.每一个元素的左边，与包括的盒子的左边相接触，即使存在浮动也是如此。

④.BFC的区域不会与float重叠。

⑤.BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

⑥.计算BFC的高度时，浮动元素也參与计算。

### 2、触发BFC的元素

**只要元素满足下面任一条件即可触发 BFC 特性**

①.根元素。

②.float的属性不为none。

③.position为absolute或fixed。

④.display为inline-block；table-cell；table-caption；flex。

⑤.overflow不为visible。

### 3、BFC的作用和原理

**①、解决margin重叠问题**  
**②、解决浮动高度塌陷问题**  
**③、解决侵占浮动元素的问题**  
  
首先看看自适应两栏布局  
我们先定义两个div：

`<div class="aside"></div>`

`<div class="main"></div>`

**4、然后定义css：**

`div {\ width:300px;\ }`

`.aside {\ width: 100px;\ height: 150px;\ float: left;\ background: black;\ }`

`.main {\ height:200px;\ background-color:red;\ }`

效果图例如以下：

![](/images/jueJin/5256404beeda434.png)

这正满足了规范的第三条：  
**每一个元素的左边，与包括的盒子的左边相接触。即使存在浮动也是如此。**

所以假设我们须要将黑色区域撑到红色的左边。就须要利用规范的第四条：  
BFC的区域不会与float重叠。

也就是说我们须要创造BFC区域。我们通过将红色区域的overflow设为hidden来触发BFC：

`.main {\ overflow:hidden;\ height:200px;\ background-color:red;\ }`

效果例如以下：

![](/images/jueJin/3bc15c13431642c.png)

**5、接下来看看清除内部浮动  
首先是父div套子div**

```html
<div class="parent">
<div class="child"></div>
</div>
```

**6、然后是css：**

```css
    .child {
    border:1px solid red;
    width:100px;
    height:100px;
    float:left;
}

    .parent {
    border:1px solid black;
    width:300px;
}
```

效果例如以下：

![](/images/jueJin/ab18e3ce637f433.png)

能够看到，父div压根就没有被撑开。  
我们再回想一下BFC规范中的第六条：  
计算BFC的高度时，浮动元素也參与计算。

所以我们须要将父div触发为BFC，也就是将其overflow设为hidden：

```css
    .parent {
    border:1px solid black;
    width:300px;
    overflow:hidden;
}
```

效果例如以下：

![](/images/jueJin/34244c52b569404.png)

能够看到父div已经撑开了。

**7、再谈谈margin重叠问题。**

先定义两个垂直的div：

```html
<div class="p"></div>
<div class="p"></div>
```

然后定义margin:

`.p {\ width:200px;\ height:50px;\ margin:50px 0;\ background-color:red;\ }`

能够看到margin重叠后的效果：

![](/images/jueJin/0bc1723b755e478.png)

我们再看看BFC规范的第二条：

  
盒子垂直方向的距离由margin决定，属于用一个BFC的两个相邻Box的上下margin会发生重叠。

说明两者属于同一个BFC，所以我们须要两个div不属于同一个BFC。

为第二个div套一个父亲div。然后讲其overflow设为hidden来激活一个BFC就能够使margin不再重叠。

```html
<div class="p"></div>

<div class="wrap">

<div class="p"></div>

</div>

    .wrap {
    overflow:hidden;
}
```

效果例如以下：  
![](/images/jueJin/aea1259e97af494.png)

### 二、IFC

\---------------------  
IFC(Inline Formatting Contexts)  
直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)

**水平居中**：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC，通过text-align则可以使其水平居中。

**垂直居中**：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。

#### IFC的布局规则

1.ifc中的元素会在一行中从左到右排列。  
2.在一行上的所有元素会在该区域形成一个行框。

3.行宽的高度为包含框的高度，高度为行框中最高元素的高度。  
4.浮动的元素不会在行框中，并且浮动元素会压缩行框的宽度。

5.行框的宽度容纳不下子元素时，子元素会换到下一行显示，并且会产生新的行框。

6.行框的元素内遵循text-align和vertical-align。

* * *

**文中如有错误，欢迎在评论区指正，如果这篇文章帮到了你，欢迎点赞👍收藏加关注😊，希望点赞多多多多...**