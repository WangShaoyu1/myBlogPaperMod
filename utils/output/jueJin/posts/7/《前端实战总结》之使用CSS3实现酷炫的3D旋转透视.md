---
author: "徐小夕"
title: "《前端实战总结》之使用CSS3实现酷炫的3D旋转透视"
date: 2019-11-21
description: "3D动画效果现在越来越普及，已经被广泛的应用到了各个平台，比如阿里云，华为云，webpack官网等。它可以更接近于真实的展示我们的产品和介绍，带来极强的视觉冲击感。所以说，为了让自己更加优秀，css3 3D动画必不可少。 当为元素定义 perspective 属性时，其子元素会…"
tags: ["CSS","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:60,comments:0,collects:107,views:6627,"
---
3D动画效果现在越来越普及，已经被广泛的应用到了各个平台，比如阿里云，华为云，webpack官网等。它可以更接近于真实的展示我们的产品和介绍，带来极强的视觉冲击感。所以说，为了让自己更加优秀，css3 3D动画必不可少。

### 你将学到

*   CSS3 3D 转换的常用API介绍
*   CSS3 3D 应用场景
*   CSS3 3D 实现一个立方体

### 开始

#### 1.CSS3 3D 转换的常用API介绍

首先先上一张css 3D的坐标系：

![](/images/jueJin/16e89812dcde34c.png)

接下来我们来介绍几个常用的api：

##### 旋转

*   rotateX()
*   rotateY()
*   rotateZ() 以上几个api分别代表绕x，y，z轴旋转，如下例子为绕x轴旋转的例子：

![](/images/jueJin/16e898f5029ddb3.png)

相关代码如下：

```
<style>
    .d3-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 120px auto;
    /* 规定如何在 3D 空间中呈现被嵌套的元素 */
    transform-style: preserve-3d;
    transform: rotateX(0) rotateY(45deg);
    transform-origin: 150px 150px 150px;
}

    .rotateX {
    width: 200px;
    height: 200px;
    background-color: #06c;
    transition: transform 2s;
    animation: rotateX 6s infinite;
}

    @keyframes rotateX {
        0% {
        transform: rotateX(0);
    }
        100% {
        transform: rotateX(360deg);
    }
}
</style>
<div class="d3-wrap">
<div class="rotateX"></div>
</div>
```

##### 位移（Transform）

*   translateX(x) 定义 3D 转化，仅使用用于 X 轴的值
*   translateY(y) 定义 3D 转化，仅使用用于 Y 轴的值
*   translateZ(z) 定义 3D 转化，仅使用用于 Z 轴的值 以上几个api分别代表相对x，y，z轴的位移，如下例子为向z轴位移的例子：

![](/images/jueJin/16e899d50604dff.png)

这里我们需要注意的是为了能看出位移的效果，我们需要在父容器上加如下属性：

```
    .d3-wrap {
    transform-style: preserve-3d;
    perspective: 500;
    /* 设置元素被查看位置的视图 */
    -webkit-perspective: 500;
}
```

当为元素定义 perspective 属性时，其子元素会获得透视效果，而不是元素本身。 代码如下：

```
    .d3-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 120px auto;
    transform-style: preserve-3d;
    perspective: 500;
    -webkit-perspective: 500;
    transform: rotateX(0) rotateY(45deg);
    transform-origin: center center;
}

    .transformZ {
    width: 200px;
    height: 200px;
    background-color: #06c;
    transition: transform 2s;
    animation: transformZ 6s infinite;
}

    @keyframes transformZ {
        0% {
        transform: translateZ(100px);
    }
        100% {
        transform: translateZ(0);
    }
}
```

##### 3D缩放

*   scaleX(x) 给定一个 X 轴的3D 缩放转换值
*   scaleY(x) 给定一个 Y 轴的3D 缩放转换值
*   scaleZ(x) 给定一个 Z 轴的3D 缩放转换值 缩放设置和上面的类似，这里就不做过多介绍了。

理论上说以上三种常见变换已经够用了，值得关注的是我们要想让元素呈现出3D效果，以下不可忽视的API也很重要：

![](/images/jueJin/16e89a8631b9cd1.png)

#### 2.CSS3 3D 应用场景

css 3D主要应用在网站的交互和模型效果上，比如：

*   3D轮播图
*   3D产品介绍
*   室内3D仿真
*   h5 3D活动页面，比较典型的就是某年淘宝的年终总结H5
*   3D数据可视化成图
*   3D模型图 其实如果css 3D用的熟悉了，一些基本的3D模型完全可以用css画出来。

#### 3.CSS3 3D 实现一个立方体

![](/images/jueJin/16e7a0e03d26523.png)

核心思路就是用6个面去拼接，通过设置rotate和translate来调整相互之间的位置，如下：

![](/images/jueJin/16e89b38a782c74.png)

具体代码如下：

```
    .container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 120px auto;
    transform-style: preserve-3d;
    /* 为了让其更有立体效果 */
    transform: rotateX(-30deg) rotateY(45deg);
    transform-origin: 150px 150px 150px;
    animation: rotate 6s infinite;
}
    .container .page {
    position: absolute;
    width: 300px;
    height: 300px;
    text-align: center;
    line-height: 300px;
    color: #fff;
    background-size: cover;
}
    .container .page:first-child {
    background-image: url(./my.jpeg);
    background-color: rgba(0,0,0,.2);
}
    .container .page:nth-child(2) {
    transform: rotateX(90deg);
    transform-origin: 0 0;
    transition: transform 10s;
    background-color: rgba(179, 15, 64, 0.6);
    background-image: url(./my2.jpeg);
}

    .container .page:nth-child(3) {
    transform: translateZ(300px);
    background-color: rgba(22, 160, 137, 0.7);
    background-image: url(./my3.jpeg);
}

    .container .page:nth-child(4) {
    transform: rotateX(-90deg);
    transform-origin: -300px 300px;
    background-color: rgba(210, 212, 56, 0.2);
    background-image: url(./my4.jpeg);
}
    .container .page:nth-child(5) {
    transform: rotateY(-90deg);
    transform-origin: 0 0;
    background-color: rgba(201, 23, 23, 0.6);
    background-image: url(./my5.jpeg);
}
    .container .page:nth-child(6) {
    transform: rotateY(-90deg) translateZ(-300px);
    transform-origin: 0 300px;
    background-color: rgba(16, 149, 182, 0.2);
    background-image: url(./my6.jpeg);
}
```

html结构

```
<div class="container">
<div class="page">A</div>
<div class="page">B</div>
<div class="page">C</div>
<div class="page">D</div>
<div class="page">E</div>
<div class="page">F</div>
</div>
```

### 扩展

我们可以基于上面介绍的，给父元素添加动画或者拖拽效果，这样就可以做成更有交互性的3D方块了，比如**置骰子游戏**，**vr场景**，**3D相册**等等，具体实现我会抽空依次总结出来，记得关注哦～

### 最后

如果想了解更多webpack，node，gulp，css3，javascript，nodeJS，canvas等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")