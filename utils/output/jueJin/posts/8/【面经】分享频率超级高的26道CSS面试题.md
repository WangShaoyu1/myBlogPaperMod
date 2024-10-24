---
author: "Sunshine_Lin"
title: "【面经】分享频率超级高的26道CSS面试题"
date: 2023-02-15
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 CSS 1、选择器权重 !important：最高权重 内联样式：1000 id"
tags: ["前端","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:45,comments:0,collects:87,views:3289,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。

![](/images/jueJin/8ecd8f450757421.png)

CSS
---

### 1、选择器权重

*   \*\*!important：\*\*最高权重
*   \*\*内联样式：\*\*1000
*   \*\*id选择器：\*\*100
*   \*\*类选择器：\*\*10
*   \*\*属性选择器：\*\*10
*   \*\*伪类选择器：\*\*10
*   \*\*标签选择器：\*\*1
*   \*\*伪元素选择器：\*\*1
*   \*\*相邻兄弟选择器：\*\*0
*   \*\*子选择器：\*\*0
*   \*\*后代选择器：\*\*0
*   \*\*通配符选择器：\*\*0

### 2、可继承和不可继承样式

#### 不可继承

*   display
*   width、height、margin、padding、border
*   background、background-color
*   position、top、right、left、bottom

#### 可继承

*   **font-size、font-weight、font-family**
*   **line-height、text-align、color**
*   **visibility**
*   **cursor**

### block和inline的区别？

*   \*\*block：\*\*独占一行，可设置宽高、margin、padding
*   \*\*inline：\*\*不独占一行，不可设置宽高，可设置水平margin、padding但不能设置垂直方向margin、padding

### 3、隐藏元素的方式

*   **display：none** 直接消失
*   **visibility：hidden** 不可见，但占着位置
*   **opacity：0** 透明不可见，但占着位置
*   **position：absolute** 绝对定位并移出可见范围
*   **z-index：-999** 将层级设置在底部，让他不可见

### 4、link和@import区别

*   link可以加载css、rss；@import只能加载css
*   link在页面载入时同时加载；@import在页面载入后再加载
*   link无兼容问题；@import是新语法，低版本浏览器不兼容
*   link标签可被js操作dom去除；@import不行

### 5、transition和animation的区别

*   \*\*transition：\*\*过度样式，需要被动触发
*   \*\*animation：\*\*动画样式，不需要被动触发，可以自动触发，可结合@keyframe进行多个关键帧的动画

### 6、伪元素和伪类

*   \*\*伪元素：\*\*顾名思义，假的元素，只会显示其内容，但是并不会在dom树中找到他

```js
p::before {content:"林三心";}
p::after {content:"林三心";}
p::first-line {background:red;}
p::first-letter {font-size:30px;}
```

*   \*\*伪类：\*\*将一些效果加到节点上，例如鼠标点击，悬浮等

```js
a:hover {color: #FF00FF}
p:first-child {color: red}
```

### 7、盒模型

*   \*\*标准盒模型：\*\*width、height的计算范围只包含content
*   \*\*IE盒模型：\*\*width、height的计算范围包含content、padding、border

通过`box-sizing`进行设置

*   **box-sizing: content-box**标准盒模型（默认）
*   **box-sizing: border-box**IE盒模型（怪异盒模型）

### 8、CSS3新样式

*   \*\*:not(.cc)：\*\*新增的选择器，标识所有class不是“cc”的节点
*   \*\*border-radius：\*\*边框圆角
*   \*\*box-shadow：\*\*阴影
*   \*\*text-shadow：\*\*文字阴影
*   \*\*text-decoration：\*\*文字样式渲染
*   \*\*gradient：\*\*线性渐变
*   \*\*transform：\*\*可设置变形、放大缩小、旋转、定位
*   \*\*flex：\*\*flex布局

### 9、CSS提升性能方式

*   1、css代码压缩
*   2、link代替@import
*   3、避免多层选择器
*   4、动画CPU加速

### 10、为何使用less、sass

他们是css预处理器，使用他们的变量、继承、运算、函数等功能，大大提高样式编写效率，大多数打包工具最后都会将他们解析为原始css样式代码

### 11、postCss是啥

后置css，将解析后的css样式代码进行处理，提高其在各个浏览器的兼容性，常用做法是为每个浏览器样式添加特有前缀

### 12、单行、多行溢出省略号

*   单行

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

*   多行

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

### 13、自适应布局方式

*   \*\*媒体查询@media：\*\*通过监听不同的窗口宽度，展示不同的效果
*   \*\*rem：\*\*监听不同窗口宽度，为根节点设置对应font-size，并进而使所有使用到rem的样式得到变化（rem的“r”就是“root”）

### 14、CSS工程化

*   **CSS实现模块化**
*   **CSS预处理器**
*   **CSS的postCSS**
*   **CSS代码压缩**

### 15、CSS常见单位

*   \*\*px：\*\*固定像素，无自适应
*   \*\*em：\*\*根据父元素的font-size决定大小
*   \*\*rem：\*\*根据根元素的font-size决定大小

### 16、flex：1代表什么？

flex: 1 1 auto

分别是flex-grow、flex-shrink、flex-basis

### 17、两栏布局

两栏布局指的是，左边固定右边自适应

*   **float浮动**

```css
    .outer {
    height: 100px;
}
    .left {
    float: left;
    width: 200px;
    background: tomato;
}
    .right {
    margin-left: 200px;
    width: auto;
    background: gold;
}
```

*   **flex布局**

```css
    .outer {
    display: flex;
    height: 100px;
}
    .left {
    width: 200px;
    background: tomato;
}
    .right {
    flex: 1;
    background: gold;
}
```

### 18、三栏布局

三栏布局指的是左右固定，中间自适应

直接用flex布局

```css
    .outer {
    display: flex;
    height: 100px;
}
​
    .left {
    width: 100px;
    background: tomato;
}
​
    .right {
    width: 100px;
    background: gold;
}
​
    .center {
    flex: 1;
    background: lightgreen;
}
```

### 19、双飞翼（圣杯）布局

直接用flex布局

```css
    .outer {
    display: flex;
    height: 100px;
}
​
    .left {
    width: 100px;
    background: tomato;
}
​
    .right {
    width: 100px;
    background: gold;
}
​
    .center {
    flex: 1;
    background: lightgreen;
}
```

### 20、水平垂直居中实现？

*   **绝对定位+transform**

```css
    .parent {
    position: relative;
}
    .child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
```

*   **flex布局**

```css
    .parent {
    display: flex;
    justify-content:center;
    align-items:center;
}
```

### 21、清除浮动方式

*   \*\*给父元素定义高度：\*\*不建议，会导致其他布局问题
*   **末尾空div并设置clear：both**不建议，增加无用dom节点
*   **父元素设置overflow：hidden**不建议，会导致部分内容被隐藏
*   **使用伪元素after+clear:both**强烈推荐

### 22、对于BFC的理解？

`BFC(块级格式上下文)`，你可以理解为一个有自己的布局规则的容器，其内部的布局不受外部影响

#### 创建BFC的条件

*   根元素：body
*   元素设置浮动：float
*   元素设置绝对定位：position为absolute、fixed
*   display为：inline-block、table-cell、table-caption、flex等
*   overflow为：hidden、auto、scroll

### BFC容器特点

*   垂直方向上，自上而下排列
*   BFC中两个相邻容器的margin会重叠
*   计算BFC高度时，会把浮动元素也计算（清除浮动方式之一）
*   BFC容器不会和浮动容器发生重叠
*   BFC容器内部元素不会影响外部元素
*   每个元素左margin与容器的左border相接触

### 23、实现一个三角形？

宽度设置0，四个border中，透明掉三个，剩一个显示，就是三角形了

```css
    div {
    width: 0;
    height: 0;
    border: 100px solid transparent;
    border-bottom-color: red;
}
```

### 24、实现扇形

跟三角形差不多，只不过多设置一个`border-radius`

```css
    div{
    border: 100px solid transparent;
    width: 0;
    heigt: 0;
    border-radius: 100px;
    border-top-color: red;
}
```

### 25、如何显示小于12px的文字？

使用`transform: scale()`进行缩小

```css
    span {
    font-size: 12px;
    -webkit-transform: scale(0.8);
    display: block;
}
```

### 26、为什么css选择器是自右往左解析？

链接：[blog.csdn.net/jinboker/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjinboker%2Farticle%2Fdetails%2F52126021 "https://blog.csdn.net/jinboker/article/details/52126021")

参考资料
----

*   [juejin.cn/post/714971…](https://juejin.cn/post/7149716216167268366 "https://juejin.cn/post/7149716216167268366")
*   [blog.csdn.net/jinboker/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjinboker%2Farticle%2Fdetails%2F52126021 "https://blog.csdn.net/jinboker/article/details/52126021")

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个，有5000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/fc3f3d434b7d489.png)