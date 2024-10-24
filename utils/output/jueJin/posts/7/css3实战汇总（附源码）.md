---
author: "徐小夕"
title: "css3实战汇总（附源码）"
date: 2019-09-23
description: "本文是继上一篇文章用css3实现惊艳面试官的背景即背景动画（高级附源码）的续篇也是本人最后一篇介绍css3技巧的文章，因为css这块知识难点不是很多，更多的在于去熟悉css3的新特性和基础理论知识。所以写这篇文章的目的一方面是对自己工作中一些css高级技巧的总结，另一方面也是希…"
tags: ["CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:76,comments:2,collects:164,views:4685,"
---
本文是继上一篇文章[用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")的续篇也是本人最后一篇介绍css3技巧的文章，因为css这块知识难点不是很多，更多的在于去熟悉css3的新特性和基础理论知识。所以写这篇文章的目的一方面是对自己工作中一些css高级技巧的总结，另一方面也是希望能教大家一些实用的技巧和高效开发css的方式，以提高在工作中的效率。

### 我们将学到

*   box-shadow的高级应用
*   制作自适应的椭圆
*   纯css3实现饼图进度动画
*   用border来实现一个对话框样式
*   css3 filter的简单应用
*   css3伪元素实现自定义复选框
*   在线制作css3动画的利器

### 正文

#### 1.box-shadow的高级应用

利用css3的新特性可以帮助我们实现各种意想不到的特效，接下来的几个案例我们来使用css3的box-shdow来实现，马上开始吧！

##### 实现水波动画

> 知识点：box-shadow

想想我们如果不用css3，是怎么实现水波扩散的动画呢？想必一定是写一大堆的js才能实现如下的效果：

![](/images/jueJin/16d5cf83bfccf48.png)

css3实现核心代码

```
<style>
    .wave {
    margin-left: auto;
    margin-right: auto;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    border: 2px solid #fff;
    text-align: center;
    line-height: 100px;
    color: #fff;
    background: #06c url(http://p3g4ahmhh.bkt.clouddn.com/me.jpg) no-repeat center center;
    background-size: 100%;
    animation: wave 4s linear infinite;
}
    @keyframes wave {
        0% {
        box-shadow: 0 0 0 0 rgba(245, 226, 226, 1), 0 0 0 0 rgba(250, 189, 189, 1);
    }
        50% {
        box-shadow: 0 0 0 20px rgba(245, 226, 226, .5), 0 0 0 0 rgba(250, 189, 189, 1);
    }
        100% {
        box-shadow: 0 0 0 40px rgba(245, 226, 226, 0), 0 0 0 20px rgba(245, 226, 226, 0);
    }
}
</style>
<div class="wave"></div>
```

这里我们主要使用了box-shadow的多级阴影来实现的，动画部分我们使用的@keyframes，是不是感觉还行？

#### 实现加载动画

> 知识点：box-shadow多阴影

加载动画大家想必也不陌生，虽然可以用很多方式实现加载动画，比如用伪元素，用gif，用js，但是更优雅的实现我觉得还是直接上css：

![](/images/jueJin/16d5d001fee0c96.png)

核心代码如下：

```
<style>
    .loading {
    margin-left: auto;
    margin-right: auto;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: transparent;
    animation: load 3s linear infinite;
}
    @keyframes load {
        0% {
        box-shadow: -40px 0 0 rgba(250, 189, 189, 0),
        inset 0 0 0 15px rgba(250, 189, 189, 0),
        40px 0 0 rgba(250, 189, 189, 0);
    }
        30% {
        box-shadow: -40px 0 0 rgba(250, 189, 189, 1),
        inset 0 0 0 15px rgba(250, 189, 189, 0),
        40px 0 0 rgba(250, 189, 189, 0);
    }
        60% {
        box-shadow: -40px 0 0 rgba(250, 189, 189, 0),
        inset 0 0 0 15px rgba(250, 189, 189, 1),
        40px 0 0 rgba(250, 189, 189, 0);
    }
        100% {
        box-shadow: -40px 0 0 rgba(250, 189, 189, 0),
        inset 0 0 0 15px rgba(250, 189, 189, 0),
        40px 0 0 rgba(250, 189, 189, 1);
    }
}
</style>
<div class="loading"></div>
```

我们这里也是采用box-shadow多背景来实现，也是我当时思考的一个方向，至于其他的css方案，欢迎大家和我交流。

#### 实现对话框及对话框的不规则投影

> 知识点： filter和伪元素

这里涉及到css滤镜的知识，不过也很简单，大家在css3官网上看看就理解了，我们直接看效果：

![](/images/jueJin/16d5d05b704b4a9.png)

我们会通过filter的drop-shadow来实现不规则图形的阴影，然后利用伪元素和border来实现头部三角形：

```
<style>
    .odd-shadow{
    margin-left: auto;
    margin-right: auto;
    width: 200px;
    height: 80px;
    border-radius: 8px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 80px;
    background: #06c;
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,.8))
}
    .odd-shadow::before{
    content: '';
    position: absolute;
    display: block;
    margin-left: -20px;
    transform: translateY(20px);
    width:0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #06c;
}
</style>

<div class="odd-shadow">哎呦，猪先森</div>
```

#### 模糊效果

> 知识点： filter

这个比较简单，这里我直接上图和代码：

![](/images/jueJin/16d5d1140e7925e.png)

```
filter: blur(20px);
```

### 2.制作自适应的椭圆

border-radius的出现让我们实现圆角效果提供了极大的便利，我们还可以通过对Border-radius特性的进一步研究来实现各种图形效果，接下来就让我们看看它的威力吧！

> 知识点:border-radius: a / b;    //a,b分别为圆角的水平、垂直半径,**单位若为%,则表示相对于宽度和高度进行解析**

![](/images/jueJin/16d5d163cba4e12.png)

核心代码：

```
<style>
    .br-1{
    width: 200px;
    height: 100px;
    border-radius: 50% /10%;
    background: linear-gradient(45deg,#06f,#f6c,#06c);
}
    .br-2{
    width: 100px;
    border-radius: 20% 50%;
}
    .ani{
    animation: skew 4s infinite;
}
    .ani1{
    animation: skew1 4s infinite 2s;
}
    .ani2{
    animation: skew2 4s infinite 3s;
}
    @keyframes skew{
        to{
        border-radius: 50%;
    }
}
    @keyframes skew1{
        to{
        border-radius: 20px 20px 100%;
    }
}
    @keyframes skew2{
        to{
        transform: rotate(360deg);
    }
}
</style>
<div class="br-1 black-theme"></div>
<div class="br-1 black-theme ani"></div>
<div class="br-1 black-theme ani1"></div>
<div class="br-1 br-2 black-theme ani2"></div>
```

这里我们主要使用了背景渐变来实现华而不实的背景，用border-radius实现各种规格的椭圆图案。

### 3.纯css3实现饼图进度动画

> 知识点：border-radius: a b c d / e f g h; animation多动画属性;

效果如下：

![](/images/jueJin/16d5d1d589f7af9.png)

核心代码：

```
<style>
    .br-31{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(to right,#f6c 50%,#333 0);
}
    .br-31::before{
    content: '';
    display: block;
    margin-left: 50%;
    height: 100%;
    border-radius: 0 100% 100% 0 / 50%;
    background-color: #f6c;
    transform-origin: left;
    animation: skin 4s linear infinite,
    bg 8s step-end infinite;
}
    @keyframes skin{
        to{
        transform: rotate(.5turn);
    }
}
    @keyframes bg{
        50%{
        background: #333;
    }
}
    .br-32::before{
    animation-play-state: paused;
    animation-delay: inherit;
}
</style>
<div class="br-31 black-theme"></div>
<div class="br-31 br-32 black-theme" style="animation-delay:-1s"></div>
```

这块的实现我们主要用了渐变背景，也是实现扇形进度的关键，包括代码中的如何遮挡半圆，如何对半圆做动画，如何改变旋转原点的位置等，这些虽然技巧性很强，但是我们稍微画一画，也可以实现的。

### 4.css3伪元素实现自定义复选框

我们都知道原生的复选框控件样式极难自定义，这对于工程师实现设计稿的难度加大了一大截。css3的出现，增加了:checked选择器，因此我们可以利用:checked和label来实现各式各样的表单选择控件，接下来让我们来看看如何实现吧！

![](/images/jueJin/16d5d2296312c12.png)

我们来看看如何实现上述自定义的复选框：

```
<style>
    .check-wrap{
    text-align: center;
}
    .checkbox{
    position: absolute;
    clip: rect(0,0,0,0);
}
    .checkbox[type="checkbox"]:focus + label::before{
    box-shadow: 0 0 .6em #06c;
}
    .checkbox[type="checkbox"] + label::before{
    content: '\a0'; /* 不换行空格 */
    display: inline-block;
    margin-right: .3em;
    width: 2em;
    height: 2em;
    border-radius: .3em;
    vertical-align: middle;
    line-height: 2em; /* 关键 */
    font-size: 20px;
    text-align: center;
    color: #fff;
    background: gray;
}
    .checkbox[type="checkbox"]:checked + label::before{
    content: '\2713'; /* 对勾 */
    background: black;
}

    label{
    margin-right: 40px;
    font-size: 20px;
}
</style>
<div class="check-wrap">
<input type="checkbox" class="checkbox" id="check-1" />
<label for="check-1">生男孩</label>
<input type="checkbox" class="checkbox" id="check-2" />
<label for="check-2">生女孩</label>
</div>
```

这里为了隐藏原生的checkbox控间，我们用了clip: rect(0,0,0,0)进行截取，然后使用checkbox的伪类:checked来实现交互。

接下来扩展一下，我们来实现自定义开关：

![](/images/jueJin/16d5d266cf97157.png)

这里原理是一样的，只不过样式做了改动，直接上代码：

```
<style>
    .check-wrap{
    margin-bottom: 20px;
    text-align: center;
}
    .switch{
    position: absolute;
    clip: rect(0,0,0,0);
}

    .switch[type="checkbox"] + label{
    width: 6em;
    height: 3em;
    padding: .3em;
    border-radius: .3em;
    border: 1px solid rgba(0,0,0,.2);
    vertical-align: middle;
    line-height: 2em; /* 关键 */
    font-size: 20px;
    text-align: center;
    color: #fff;
    box-shadow: 0 1px white inset;
    background-color: #ccc;
    background-image: linear-gradient(#ddd,#bbb);
}
    .switch[type="checkbox"]:checked + label{
    box-shadow: 0.05em .1em .2em rgba(0,0,0,.6) inset;
    border-color: rgba(0,0,0,.3);
    background: #bbb;
}

    label{
    margin-right: 40px;
    font-size: 14px;
}

    .switch-an{
    position: absolute;
    clip: rect(0,0,0,0);
}

    .switch-an[type="checkbox"] + label{
    position: relative;
    display: inline-block;
    width: 5em;
    height: 2em;
    border-radius: 1em;
    color: #fff;
    background: #06c;
    text-align: left;
}

    .switch-an[type="checkbox"] + label::before{
    content: '';
    width:2em;
    height: 2em;
    position: absolute;
    left: 0;
    border-radius: 100%;
    vertical-align: middle;
    background-color: #fff;
    transition: left .3s;
}
    .switch-an[type="checkbox"] + label::after{
    content: 'OFF';
    margin-left: 2.6em;
}
    .switch-an[type="checkbox"]:checked + label::before{
    transition: left .3s;
    left: 3em;
}
    .switch-an[type="checkbox"]:checked + label::after{
    content: 'NO';
    margin-left: .6em;
}

</style>
<div class="check-wrap">
<input type="checkbox" class="switch" id="switch-1" />
<label for="switch-1">生男孩</label>
<input type="checkbox" class="switch" id="switch-2" />
<label for="switch-2">生女孩</label>
</div>

<div class="check-wrap">
<input type="checkbox" class="switch-an" id="switch-an-1" />
<label for="switch-an-1"></label>
</div>
```

是不是感觉css3提供了更强大的动画和自定义功能呢？其实我们可以实现更酷炫更实用的效果，等待你去尝试。

### 5.在线制作css3动画的利器

最后推荐一个在线制作各种贝塞尔曲线的工具，也是本人在做动画时经常使用的： [cubic-bezier](https://link.juejin.cn?target=https%3A%2F%2Fcubic-bezier.com%2F%23.17%2C.67%2C.83%2C.67 "https://cubic-bezier.com/#.17,.67,.83,.67")。

#### 最后

笔者2天后将推出开源的CMS系统，技术架构：

*   后台Node+Koa+redis+JsonSchema
*   管理后台界面 vue-cli3 + vue + ts + vuex + antd-vue + axios
*   客户端前台 react + antd + react-hooks + axios

后面将推出该系统的设计思想，架构和实现过程，欢迎在公众号《趣谈前端》里查看更详细的介绍。

欢迎大家相互学习交流，一起探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [记一次老项目中的跨页面通信问题和前端实现文件下载功能](https://juejin.cn/post/6844903946121641991 "https://juejin.cn/post/6844903946121641991")
*   [如何优雅的使用javascript递归画一棵结构树](https://juejin.cn/post/6844903942850084878 "https://juejin.cn/post/6844903942850084878")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")
*   [JavaScript 中的二叉树以及二叉搜索树的实现及应用](https://juejin.cn/post/6844903906166718471 "https://juejin.cn/post/6844903906166718471")
*   [用 JavaScript 和 C3 实现一个转盘小游戏](https://juejin.cn/post/6844903895668375566 "https://juejin.cn/post/6844903895668375566")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [基于react/vue生态的前端集成解决方案探索与总结](https://juejin.cn/post/6844903891893485576 "https://juejin.cn/post/6844903891893485576")
*   [9012教你如何使用gulp4开发项目脚手架](https://juejin.cn/post/6844903882124967949 "https://juejin.cn/post/6844903882124967949")
*   [如何用不到200行代码写一款属于自己的js类库)](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")
*   [让你瞬间提高工作效率的常用js函数汇总(持续更新)](https://juejin.cn/post/6844903878362660878 "https://juejin.cn/post/6844903878362660878")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [js基本搜索算法实现与170万条数据下的性能测试](https://juejin.cn/post/6844903866610221064 "https://juejin.cn/post/6844903866610221064")
*   [《前端算法系列》如何让前端代码速度提高60倍](https://juejin.cn/post/6844903865553256461 "https://juejin.cn/post/6844903865553256461")
*   [《前端算法系列》数组去重](https://juejin.cn/post/6844903863674208269 "https://juejin.cn/post/6844903863674208269")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [前端三年，谈谈最值得读的5本书籍](https://juejin.cn/post/6844903824788815879 "https://juejin.cn/post/6844903824788815879")