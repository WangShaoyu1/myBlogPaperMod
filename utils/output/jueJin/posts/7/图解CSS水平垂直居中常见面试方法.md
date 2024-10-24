---
author: "Gaby"
title: "图解CSS水平垂直居中常见面试方法"
date: 2021-09-16
description: "本篇文章总结一些CSS垂直居中的方法，例子用到的各个元素属性不做解释，详情请看MDN文档，非常的详尽，例子在chrome浏览器下完全好使，IE这个渣渣就不测了"
tags: ["前端","HTML","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:68,comments:2,collects:157,views:9629,"
---
说明：本篇文章只是总结一些方法，例子用到的各个元素属性不做解释，详情请看MDN文档，非常的详尽，例子在chrome浏览器下完全好使，IE这个渣渣就不测了， 附上链接：[developer.mozilla.org/zh-CN/](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2F "https://developer.mozilla.org/zh-CN/")

文本垂直居中
------

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
    .text{
    width: 200px;
    height: 200px;
    text-align: center;
    line-height: 200px;
    background: skyblue;
}
</style>
<!-- html 结构 -->
<div class="text">文本垂直居中</div>
```

![image.png](/images/jueJin/afcb97e60c4f4a3.png)

元素垂直居中
------

### 1.绝对性定位 利用 calc 计算偏移量

使用绝对性定位，已知盒子自身宽高，利用 calc 计算偏移量进行定位📌

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
body{margin: 0;padding: 0;}
    .calc{
    position: absolute;
    width: 200px;
    height: 200px;
    left:calc((100% - 200px)/2);
    top:calc((100% - 200px)/2);
    background: yellowgreen;/* 方便看效果 */
}
</style>
<!-- html 结构 -->
<div class="calc">元素垂直居中</div>
```

![image.png](/images/jueJin/86e23e9dfb36495.png)

### 2.绝对定位 利用 margin:auto 属性

使用绝对定位，利用 margin:auto 属性，对已知宽高的盒子进行自动偏移定位📌

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
/* 绝对性定位 */
    .div {
    width:200px;
    height:200px;
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    margin: auto;
    background: skyblue;
}
</style>
<!-- html 结构 -->
<div class="div">margin: auto;元素垂直居中</div>
```

![image.png](/images/jueJin/381342739c4044e.png)

### 3.绝对定位 利用 margin 负值属性

使用绝对定位，利用 margin 负值属性，对已知宽高的盒子进行计算偏移量进行定位📌

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
    .div {
    position:absolute;
    top:50%;
    left:50%;
    width:200px;
    height: 200px;
    margin-top: -100px;
    margin-left: -100px;
    /*margin-left: -100px 0 0 -100px;*/
    background:red;
}
</style>
<!-- html 结构 -->
<div class="div">margin: -100px;元素垂直居中</div>
```

![image.png](/images/jueJin/fdf1b1c30cc844d.png)

### 4.绝对定位 利用 transform 属性

使用绝对定位，利用 transform 属性，对未知宽高的盒子进行自动偏移定位📌

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
    .div {
    position: absolute; /* 相对定位或绝对定位均可 */
    width:200px;
    height:200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: pink;
}
</style>
<!-- html 结构 -->
<div class="div">利用 transform 进行垂直居中</div>
```

![image.png](/images/jueJin/83ced57ffffe474.png)

### 5.Flex布局

使用Flex布局，利用 `align-items: center;` 与 `justify-content: center;` 属性，对未知宽高的盒子进行自动偏移定位，`父元素需要设置高度`📌

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
/* 利用 flex 布局 不需要盒子本身宽高 但需要父级盒子高度*/
    .container {
    display: flex;
    align-items: center;/* 垂直居中 */
    justify-content: center; /* 水平居中 */
    height:100vh; /* 父元素高度需设置 */
}
    .container div {
    width: 200px; /* 宽高可以不设置 */
    height: 200px;
    background-color: greenyellow;
}
</style>
<!-- html 结构 -->
<div class="container">
<div>利用 flex 布局进行水平垂直居中</div>
</div>
```

![image.png](/images/jueJin/9a82aa25499d4bc.png)

### 6.table-cell 布局

使用 table-cell 布局，利用 `display: table-cell;` 、 `vertical-align: middle;` 与 `text-align: center;` 属性，对未知宽高的盒子进行自动偏移定位，`父元素需要设置宽高`📌，适合有父元素元素的定位

```html
<!-- css 样式 -->
<style rel="stylesheet" type="text/css">
/* table-cell 不需要盒子本身宽高*/
    .table-cell {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 500px;
    height: 500px;
    background: pink;
    
}
    .table-cell div{
    width: 200px;
    height: 200px;
    background:skyblue;
    display: inline-block;
    
}
</style>
<!-- html 结构 -->
<div class="table-cell">
<div >利用 table-cell 进行水平垂直居中</div>
</div>
```

![image.png](/images/jueJin/7c2f80adac5048a.png)

总结：
---

以上介绍了元素垂直居中的几种方法，各不相同，具体用什么方法，看个人习惯和工作需要，可以自己动手尝试，加深记忆，希望可以帮助到你!

本文出现的错误，请大佬们及时指正，人非圣贤孰能无过，如有更好的方法，也请留言，我及时更新，哈哈！