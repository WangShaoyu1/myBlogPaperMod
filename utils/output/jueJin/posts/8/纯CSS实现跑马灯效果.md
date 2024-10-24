---
author: "Sunshine_Lin"
title: "纯CSS实现跑马灯效果"
date: 2023-10-31
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 最近看一个网站的时候，发现一个效果类似于广告灯的感觉，挺不错的，于是就想用纯CSS来实现这个效果，顺"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:12,comments:1,collects:8,views:2198,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

最近看一个网站的时候，发现一个效果类似于广告灯的感觉，挺不错的，于是就想用纯CSS来实现这个效果，顺便提升一下自己的CSS动画技能

![](/images/jueJin/60847f02c33c418.png)

分析
--

我们先分析怎么做的，这个效果分成两个部分

*   上层：真正动画的层级
*   下层：充当一个底色

然后他们通过绝对定位叠在一起

![](/images/jueJin/852f7a5d4f984dd.png)

可以看到，动画没开始前，页面是这样的，可以理解这是一个底色下层，铺在下面，让每一个圆都有一个轮廓

![](/images/jueJin/5188b419c81b4dd.png)

动画上层开始的时候，下层是不变的，一直保持底色

![](/images/jueJin/5c12976dc5ec489.png)

开始写页面
-----

### 页面

```html
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
<style>
    body {
    background-color: #232b36;
}

    .container {
    position: relative;
}

    .grid {
    display: flex;
    flex-wrap: wrap;
    width: 240px;
}

    .high {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
}

    .low {
    opacity: .1;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
}

    span {
    width: 4px;
    height: 4px;
    margin: 10px;
    border-radius: 50%;
    background-color: #fff;
    opacity: .6;
    display: block;
}
</style>
</head>

<body>
<div class="container">
<div class="grid high">
30个span。。
</div>
<div class="grid low">
30个span。。
</div>
</div>
</body>

</html>
```

现在能看到已经把两层叠在了一起

![](/images/jueJin/1047067d4d9d480.png)

### 动画

接下来让 high 这一层开始动画

```css
    .high span {
    /* 动画名 */
    animation-name: myAnimation;
    /* 动画时长 */
    animation-duration: 1s;
    /* 无限循环 */
    animation-iteration-count: infinite;
    background-color: #AEF731;
}
    @keyframes myAnimation {
        0% {
        transform: scale(0);
        opacity: 0;
    }
    
        100% {
        transform: scale(1);
        opacity: 1;
    }
}
```

现在就有动画效果了

![](/images/jueJin/af93f183d7e5496.png)

但是我们可以看到刚刚我们想要的效果，他是中间先变，四周再变的

![](/images/jueJin/05ec8ac2332d43a.png)

所以我们需要使用到`动画延迟`，也就是

`animation-delay`这个样式属性

```css
    .delay-1 {
    animation-delay: 0.1s;
}
    .delay-2 {
    animation-delay: 0.2s;
}
    .delay-3 {
    animation-delay: 0.3s;
}
    .delay-4 {
    animation-delay: 0.4s;
}
``````html
<div class="grid high">
<span class="delay-4"></span>
<span class="delay-3"></span>
<span class="delay-2"></span>
<span class="delay-1"></span>
<span></span>
<span></span>
<span class="delay-1"></span>
<span class="delay-2"></span>
<span class="delay-3"></span>
<span class="delay-4"></span>
<span class="delay-4"></span>
<span class="delay-3"></span>
<span class="delay-2"></span>
<span class="delay-1"></span>
<span></span>
<span></span>
<span class="delay-1"></span>
<span class="delay-2"></span>
<span class="delay-3"></span>
<span class="delay-4"></span>
<span class="delay-4"></span>
<span class="delay-2"></span>
<span class="delay-2"></span>
<span class="delay-1"></span>
<span></span>
<span></span>
<span class="delay-1"></span>
<span class="delay-2"></span>
<span class="delay-3"></span>
<span class="delay-4"></span>
</div>
```

这就达到了我们想要的效果啦~~~

![](/images/jueJin/1a1d1826e9d8400.png)

### 代码总览

![](/images/jueJin/6cfec55542bb4de.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/305bd8068ded484.png)