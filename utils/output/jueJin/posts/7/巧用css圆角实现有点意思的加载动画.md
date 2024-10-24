---
author: "徐小夕"
title: "巧用css圆角实现有点意思的加载动画"
date: 2020-12-23
description: "作为一名前端工程师, 需要对css技巧有充分的研究和了解, 接下来笔者将会带大家一起掌握如何用css的圆角属性来实现有点意思的加载动画 以上是设置一个边的border-color的样子和设置四个边的border-color的样子, 所以说实现饼图用css就够用了 代码如下…"
tags: ["CSS","动效中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:124,comments:0,collects:113,views:9875,"
---
作为一名前端工程师, 需要对`css`技巧有充分的研究和了解, 接下来笔者将会带大家一起掌握如何用`css`的圆角属性来实现有点意思的**加载动画**.

如果想学习更多`css`实用技巧, 可以参考笔者以下的文章:

[![](/images/jueJin/bc6059f8767e48f.png)手撸一个在线css三角形生成器](https://juejin.cn/post/6903083072661487624 "https://juejin.cn/post/6903083072661487624") [![](/images/jueJin/a0c54cde8b2d4b3.png)轻松使用纯css3打造有点意思的故障艺术](https://juejin.cn/post/6854573212513075208 "https://juejin.cn/post/6854573212513075208") [![](/images/jueJin/9cf239ce21944ad.png)如何使用css3实现一个类在线直播的队列动画](https://juejin.cn/post/6844904192591527944 "https://juejin.cn/post/6844904192591527944")

css的border属性和border-radius属性
----------------------------

笔者在前面的文章中也分享过了如何利用`border`来实现不同的形状, 比如三角形, 如下为原理图: ![](/images/jueJin/6a66e653d71b4d0.png) 利用这个原理我们只要把元素的`border-radius` 设置为圆形(比如50%), 我们是不是就能实现一个饼图了呢? 我们来看看效果: ![](/images/jueJin/3854cfcd209a4e0.png) 以上是设置一个边的`border-color`的样子和设置四个边的`border-color`的样子, 所以说实现饼图用`css`就够用了. 代码如下:

```css
    .rotate-animate {
    border:100px solid #f3f3f3;
    border-radius:50%;
    border-top:100px solid #2842d8;
}
```

如果你想实现不同比例的饼图, 其实只要合理计算好`border-width`即可, 有了以上知识, 我们结合`animation`动画是不是可以实现下面的加载动画了? ![](/images/jueJin/2169725a31da443.png)

`css`代码如下:

```css
    .rotate-animate {
    border:100px solid #f3f3f3;
    border-radius:50%;
    border-top:100px solid #2842d8;
    animation:rotate 2s linear infinite;
}
    @keyframes rotate{
        0%{
        transform: rotate(0deg);
    }
        100%{
        transform:rotate(360deg);
    }
}
```

我们在做`css3`动画时经常会用到`transform` 和 `animation`, 所以建议大家把这两个属性掌握.

> 补充:如果要实现扇形, 是不是也很简单了?

实现更优雅的圆环加载动画
------------

有了以上的`css`知识, 我们再来思考一下, 如何用最简短的代码实现一个圆环呢? 其实也很简单, 我们在上面用到了圆角和`border`来做圆形和饼图, 如果我们设置一个元素的宽度`width`和高度`height`, 并且背景透明(transparent), 会怎么样呢, 我们来看看: ![](/images/jueJin/c82238c8a793437.png)

代码如下:

```css
    .rotate-animate {
    border:16px solid #f3f3f3;
    border-radius:50%;
    border-top:16px solid #2842d8;
    width:100px;
    height:100px;
}
```

那么我们做圆环加载动画, 就非常简单了, 利用上面写的旋转动画, 我们来看看效果: ![](/images/jueJin/504a5024bf9041d.png)

圆环加载动画的整代码如下:

```html
<style>
    .rotate-animate {
    border:16px solid #f3f3f3;
    border-radius:50%;
    border-top:16px solid #2842d8;
    width:100px;
    height:100px;
    animation:rotate 2s linear infinite;
}
    .rotate-animate.fill-color {
    margin-left: 20px;
    border-color: #2842d8 #d1b516 #cf4928 #27c965;
}
    @keyframes rotate{
        0%{
        transform: rotate(0deg);
    }
        100%{
        transform:rotate(360deg);
    }
}
</style>
<!-- html -->
<div class="rotate-animate"></div>
<div class="rotate-animate fill-color"></div>
```

我们利用此特性还可以实现更多有意思的图案和加载动画, 大家可以细细品尝. 笔者这里推荐2篇比较使用的`css`文章:

[![](/images/jueJin/42b0d4bdfd204b8.png)《css大法》之使用伪元素实现超实用的图标库（附源码）](https://juejin.cn/post/6844903962500399118 "https://juejin.cn/post/6844903962500399118") [![](/images/jueJin/a1a9fbbe86254ce.png)用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")

还有一些偏底层的css文章可以参考我之前的文章.

开源项目更新日志
--------

目前`H5-Dooring`可视化搭建平台还在持续更新, 主要更新如下:

*   添加地图组件, 可自定义地理位置信息和标注
*   修复图片库不显示问题
*   添加日历组件
*   优化拖拽下载代码功能

[![](/images/jueJin/43e5aa93261b4b9.png)(H5编辑器)H5-Dooring | 积木式搭建H5页面](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

往期推荐
----

[复盘node项目中遇到的13+常见问题和解决方案](https://juejin.cn/post/6906125459352715272 "https://juejin.cn/post/6906125459352715272")

[如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")

[手撸一个在线css三角形生成器](https://juejin.cn/post/6903083072661487624 "https://juejin.cn/post/6903083072661487624")

[前端高效开发必备的 js 库梳理](https://juejin.cn/post/6898962197335490573 "https://juejin.cn/post/6898962197335490573")

> 觉得有用 ？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！微信搜 “趣谈前端”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.