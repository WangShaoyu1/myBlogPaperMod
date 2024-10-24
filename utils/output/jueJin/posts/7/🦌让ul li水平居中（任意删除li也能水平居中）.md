---
author: "Gaby"
title: "🦌让ul li水平居中（任意删除li也能水平居中）"
date: 2021-09-16
description: "日常常用代码记录： html代码： CSS 代码： # 🦌让ul li水平居中（任意删除li也能水平居中）"
tags: ["前端","HTML中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:0,views:768,"
---
日常常用代码记录：

html代码：

```xml
<div class="box">
<ul class="nav">
<li></li>
<li></li>
<li></li>
<li></li>
</ul>
</div>
```

CSS 代码：

```css
    .box{
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    text-align:center;
    width:300px;
    height:200px;
}
    .nav{
    display:inline-block;
    margin: 0;
    padding: 0;
    list-style: none;
}
    .nav>li{
    display: inline-block;
    width:20px;
    height:20px;
    background:red;
    margin:0 5px;
}
```

[\# 🦌让ul li水平居中（任意删除li也能水平居中）](https://link.juejin.cn?target=https%3A%2F%2Fwww.wxlvip.com%2Fblog%2F14875e45bba028a2 "https://www.wxlvip.com/blog/14875e45bba028a2")