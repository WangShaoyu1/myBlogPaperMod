---
author: "徐小夕"
title: "用css3实现惊艳面试官的背景即背景动画（高级附源码）"
date: 2019-09-22
description: "我们传统的前端更多的是用javascript实现各种复杂动画，自从有了Css3 transition和animation以来,前端开发在动画这一块有了更高的自由度和格局,对动画的开发也越来越容易。这篇文章就让我们汇总一下使用Css3实现的各种特效。这篇文章参考《css揭秘》这本…"
tags: ["CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:538,comments:0,collects:903,views:24912,"
---
我们传统的前端更多的是用javascript实现各种复杂动画，自从有了Css3 transition和animation以来,前端开发在动画这一块有了更高的自由度和格局,对动画的开发也越来越容易。这篇文章就让我们汇总一下使用Css3实现的各种特效。这篇文章参考《css揭秘》这本书，并作出了自己的总结，希望能让大家更有收获，也强烈推荐大家看看这本书，你值得拥有。

### 我们将学到

*   Css3
*   outline
*   radial-gradient
*   linear-gradient
*   box-shadow

* * *

### 程序员必读

> [Css3编码技巧](https://link.juejin.cn?target=https%3A%2F%2Fmrxujiang.github.io%2F2018%2F01%2F30%2Fanimation%2F "https://mrxujiang.github.io/2018/01/30/animation/")

### 1.实现内部虚线边框

> 知识点：outline

![](/images/jueJin/16d57506a310378.png)

核心代码

```
    .dash-border{
    width: 200px;
    height: 100px;
    line-height: 100px;
    outline: 1px dashed #fff;
    outline-offset: -10px;
}
```

### 2.边框内圆角的实现

> 知识点：box-shadow

![](/images/jueJin/16d5752d8319200.png)

核心代码

```
    .radius-border{
    margin-top: 20px;
    width: 180px;
    height: 80px;
    box-shadow: 0 0 0 10px gray;
}
```

3.实现条纹背景与进度条
------------

> 知识点：linear-gradient,repeating-linear-gradient

![](/images/jueJin/16d5753ddd96876.png)

核心代码

```
/* 上 */
background: linear-gradient(to right,#fb3 50%,#58a 0);
background-size: 40px 100%;
box-shadow: inset 0 0 3px #555;

/* 中 */
background: linear-gradient(45deg,#fb3 25%,#58a 0,#58a 50%,#fb3 0,#fb3 75%,#58a 0);
background-size: 40px 40px;

/* 下 (可以实现任意角度的渐变，45°时显示效果最好) */
background: repeating-linear-gradient(60deg,#fb3,#fb3 15px,#58a 0,#58a 30px);
```

4.复杂的背景图案
---------

> 知识点：linear-gradient,repeating-linear-gradient,radial-gradient

![](/images/jueJin/16d57573d75e180.png)

由于第二个图会有复杂的随机动画，建议大家可以亲自尝试看看效果，核心代码

```
<style>
    .bg-grid{
    margin-top: 20px;
    width: 200px;
    height: 200px;
    background-image: linear-gradient(rgba(255,255,255,1) 2px,transparent 0),
    linear-gradient(to right,rgba(255,255,255,1) 2px,transparent 0),
    linear-gradient(rgba(255,255,255,.2) 1px,transparent 0),
    linear-gradient(to right,rgba(255,255,255,.2) 1px,transparent 0);
    background-position: -50px -50px;
    background-size: 100px 100px,100px 100px, 100% 10px, 10px 100%;
}
    .animate-grid{
    animation: move-grid 6s linear infinite;
}
    @keyframes move-grid{
        0%{
        background-position: -50px -50px;
    }
        30%{
        background-position: -100px -100px;
    }
        60%{
        background-position: -100px -150px;
    }
        100%{
        background-position: -50px -50px;
    }
}
</style>
<div class="bg-grid black-theme"></div>
<div class="bg-grid black-theme animate-grid"></div>
```

#### 红绿灯以及红路灯随机运动动画

![](/images/jueJin/16d575ad42bf4cb.png)

利用css3多背景和position实现红绿灯和背景色块移动

核心代码

```
<style>
    .bg-dot{
    margin-top: 20px;
    width: 200px;
    height: 50px;
    background-image: radial-gradient(circle,#0cf 15px,transparent),
    radial-gradient(circle,red 15px,transparent),
    radial-gradient(circle,yellow 15px,transparent),
    radial-gradient(circle,green 15px,transparent);
    background-repeat: no-repeat;
    background-position: 0 0, 50px 0, 100px 0, 150px 0, 200px 0;
    background-size: 50px 50px;
}
    .animate-dot{
    animation: move-dot 8s linear infinite;
}
    .animate-dot2{
    animation: move-dot2 6s linear infinite;
}
    @keyframes move-dot{
        0%{
        background-position: 0 0, 50px 0, 100px 0, 150px 0;
    }
        30%{
        background-position: 50px 0, 0 0, 100px 0, 150px 0;
    }
        60%{
        background-position: 50px 0, 100px 0, 0 0, 150px 0;
    }
        100%{
        background-position: 50px 0, 100px 0, 150px 0, 0 0;
    }
}
    @keyframes move-dot2{
        0%{
        background-image: radial-gradient(circle,#0cf 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent);
    }
        30%{
        background-image: radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,red 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent);
    }
        60%{
        background-image: radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,yellow 15px,transparent),
        radial-gradient(circle,gray 15px,transparent);
    }
        100%{
        background-image: radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,gray 15px,transparent),
        radial-gradient(circle,green 15px,transparent);
    }
}
</style>
<div class="bg-dot black-theme animate-dot"></div>
<div class="bg-dot black-theme animate-dot2"></div>
```

#### 棋盘背景以及棋盘背景随机动画

![](/images/jueJin/16d575c3c7071b7.png)

利用背景渐变实现棋盘图案

核心代码

```
<style>
    .bg-qi{
    margin-top: 20px;
    width: 200px;
    height: 200px;
    background-color: #eee;
    background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),
    linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
    background-position: 0 0, 20px 20px;
    background-size: 40px 40px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4);
}

</style>
<div class="bg-qi black-theme"></div>
```

#### 伪随机背景

![](/images/jueJin/16d575db4315759.png)

利用背景渐变，keyframe动画，实现复杂的伪随机动画

核心代码

```
<style>
    .bg-line-rand{
    margin-top: 20px;
    width: 480px;
    height: 60px;
    background-color: #eee;
    background-image: linear-gradient(90deg,#fb3 11px, transparent 0),
    linear-gradient(90deg,#ab4 23px, transparent 0),
    linear-gradient(90deg,#655 41px, transparent 0);
    background-size: 41px 100%, 61px 100%, 83px 100%;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4);
}
    .bg-dot-rand{
    margin-top: 20px;
    width: 200px;
    height: 200px;
    background-color: #eee;
    background-image: radial-gradient(circle,#fb3 5px, transparent 0),
    radial-gradient(circle,#ab4 13px, transparent 0),
    radial-gradient(circle,#655 31px, transparent 0);
    background-repeat: no-repeat;
    background-size: 101px 203px, 147px 60px, 373px 201px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4);
}
    .animate1{
    animation: move 4s linear infinite;
}
    .animate2{
    animation: move2 4s linear infinite;
}
    @keyframes move{
        0%{
        background-position: 0 0, 0 0, 0 0;
    }
        50%{
        background-position: -10px 0, 20px 0, 30px 0;
    }
        100%{
        background-position: 0 0, 30px 0, 10px 0;
    }
}
    @keyframes move2{
        0%{
        background-position: 0 0, 0 0, 0 0;
    }
        50%{
        background-position: -10px 30px, 20px 0, -40px 80px;
    }
        100%{
        background-position: 0 20px, 60px -20px, 10px 30px;
    }
}
</style>
<div class="bg-line-rand black-theme"></div>
<div class="bg-line-rand black-theme animate1"></div>
<div class="bg-dot-rand black-theme animate2"></div>
```

5.折角效果
------

> 知识点：linear-gradient

![](/images/jueJin/16d575f6ceb5fe7.png)

核心代码

```
<style>
    .fold{
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    width: 200px;
    height: 80px;
    color: #fff;
    line-height: 80px;
    text-align: center;
    background: linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,.5) 0) no-repeat 100% 0 / 2em 2em,
    linear-gradient(-135deg,transparent 1.4em,#06c 0);
}
    .linear{
    background: linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,.5)) no-repeat 100% 0 / 2em 2em,
    linear-gradient(-135deg,transparent 1.4em,#06c);
}
</style>
<div class="fold">折角效果哦</div>
<div class="fold linear">折角效果哦</div>

```

#### 2.内阴影圆折角效果

![](/images/jueJin/16d5760436e89a2.png)

核心代码

```
<style>
    .fold-1{
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    position: relative;
    width: 200px;
    height: 80px;
    border-radius: .5em;
    color: #fff;
    line-height: 80px;
    text-align: center;
    background: linear-gradient(-150deg,transparent 1.5em, #58a 0);
}
    .fold-1::before{
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,.2) 0,rgba(0,0,0,.4)) 100% 0 no-repeat;
    width: 1.73em;
    height: 3em;
    transform: translateY(-1.3em) rotate(-30deg);
    transform-origin: bottom right;
    border-bottom-left-radius: inherit;
    box-shadow: -.2em .2em .3em -.1em rgba(0,0,0,.15);
}

</style>
<div class="fold-1">折角效果哦</div>
```

### 6.自适应文本的条纹背景

> 知识点：linear-gradient,line-height,background-origin

![](/images/jueJin/16d576102d90c03.png)

核心代码

```
<style>
    .stripe-bg{
    padding: .5em;
    line-height: 1.5em;
    background: beige;
    background-size: auto 3em;
    background-origin: content-box;
    background-image: linear-gradient(rgba(0,0,0,.2) 50%, transparent 0);
}
    .stripe-bg > p{
    margin: 0;
}
</style>
<div class="stripe-bg">
<p>hello you</p>
<p>hello you</p>
<p>hello you</p>
<p>hello you</p>
<p>hello you</p>
</div>
```

7.自定义的下划线实现
-----------

> 知识点linear-gridient

![](/images/jueJin/16d57624a43bedf.png)

小伙伴们注意到了吗？默认的下划线会将文字穿过，而上面的不会呦！

核心代码

```
<style>
    .my-line{
    line-height: 1.4em;
    background: linear-gradient(gray,gray) no-repeat;
    background-size: 100% 1px;
    background-position: 0 1.15em;
    text-shadow: .05em 0 #fff, -.05em 0 #fff;
}
</style>
<div class=""><span class="my-line">i have your big apple.you have a too? hi hi hi.</span></div>
```

#### 最后

笔者3天后将推出开源的CMS系统，技术架构：

*   后台Node+Koa+redis+JsonSchema
*   管理后台界面 vue-cli3 + vue + ts + vuex + antd-vue + axios
*   客户端前台 react + antd + react-hooks + axios

后面将推出该系统的设计思想，架构和实现过程，欢迎在公众号《趣谈前端》里查看更详细的介绍。

欢迎大家相互学习交流，一起探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

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