---
author: "徐小夕"
title: "轻松教你使用纯css实现H5-Doorin编辑器中的水波动画"
date: 2021-02-08
description: "css3给我们前端开发带来了很便利, 我们可以使用css3 的新特性实现各种形状和动效, 接下来笔者就来带大家介绍如何用css3实现 H5-Dooring编辑器 中的水波动画 由于生成gif的工具比较弱(在线求好用的mac版gif录频生成工具), 我不得不上传个原图, …"
tags: ["CSS","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:11,comments:0,collects:15,views:2550,"
---
`css3`给我们前端开发带来了很便利, 我们可以使用`css3` 的新特性实现各种形状和动效, 接下来笔者就来带大家介绍如何用`css3`实现 [H5-Dooring编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring") 中的水波动画.

![](/images/jueJin/4621e405575a4cd.png)

由于生成`gif`的工具比较弱(在线求好用的**mac**版**gif**录频生成工具...), 我不得不上传个原图, 大家自行脑补.![](/images/jueJin/4ebafb370fc84c9.png)

接下来我们来研究实现原理和实现方式.

### 动画拆解

要想用纯`css`实现曲线, 我们第一反应就是用`border-radius`这个属性, 比如说实现一个圆, 我们只需要如下设置:

```css
    .circle {
    border-radius: 50%;
}
```

实现椭圆,扇形, 半椭圆这些, 只需要设置不同边的圆角即可, 如下:

```css
    .circle {
    border-radius: 50% 100% 40% 60%;
}
```

以上的代码效果如下: ![](/images/jueJin/6f0a20565f774f5.png)

我们再发挥一下想象, 如果是闭合曲线, 是不是也能用同样的方法实现呢? ![](/images/jueJin/87e619bb92e1451.png) 我们只需要将`background`换成`border`, 调整`border-radius`参数即可. 接下来给大家看一下我用css画的一个图形, 各位可以参考学习一下: ![](/images/jueJin/6953b2eddc364d3.png)

当然使用相同的原理我们可以实现更多有意思的图案, 笔者这里就不一一举例了.

回归正题, 我们来看看水波动画的实现原理. 首先不规则动画我们实现了, 剩下的工作就是如何实现**波浪**和**波浪动画**, 参考上面不规则图形的实现方案, 波浪线的制作可以采用类似裁切来实现, 如下: ![](/images/jueJin/5cfcebc2c85d456.png) 由上图可以看出, 我们使用`css`的`border-radius`做一个矩形和一个圆角矩形, 使用`transform`来设置偏移和旋转, 就可以实现底部裁切后的**曲面**. 最后我们使用`animation`动画让其运动来看看效果:

![](/images/jueJin/2ef91b57f3fe4d3.png)

我们只需要优化上面的动画, 让背景更柔和, 比如说圆形, 容器溢出隐藏, 这样就可以实现[H5-Dooring编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring") 中的水波动画了, `css`源码如下:

```css
    .dragPay {
    position: absolute;
    z-index: 99999;
    left: 414px;
    top: 156px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid #20c961;
    background: #ffffff;
    overflow: hidden;
    padding: 5px;
    box-sizing: border-box;
}
    .dragPay .wave {
    position: relative;
    left: -8px;
    width: 60px;
    height: 60px;
    background-image: linear-gradient(-180deg, #8dec8a 13%, #70cf23 91%);
    border-radius: 50%;
    line-height: 60px;
    text-align: center;
    font-size: 32px;
    cursor: pointer;
}
    .dragPay .waveMask {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 0;
    left: 50%;
    border-radius: 40%;
    background-color: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -82%) rotate(0);
    animation: toRotate 10s linear -5s infinite;
    z-index: 20;
    pointer-events: none;
}
    @keyframes toRotate {
        50% {
        transform: translate(-50%, -70%) rotate(180deg);
    }
        100% {
        transform: translate(-50%, -70%) rotate(360deg);
    }
}
```

`html`结构如下:

```html
<div class="dragPay">
<div class="wave">
<span>⛽️</span>
</div>
<div class="waveMask"></div>
</div>
```

当然我们可以使用伪元素来优化`dom`结构. 大家可以亲自感受一下.

### 更多css3案例/学习技巧

*   [巧用css圆角实现有点意思的加载动画](https://juejin.cn/post/6909281076368293902 "https://juejin.cn/post/6909281076368293902")
*   [手撸一个在线css三角形生成器](https://juejin.cn/post/6903083072661487624 "https://juejin.cn/post/6903083072661487624")
*   [如何使用css3实现一个类在线直播的队列动画](https://juejin.cn/post/6844904192591527944 "https://juejin.cn/post/6844904192591527944")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《css大法》之使用伪元素实现超实用的图标库（附源码）](https://juejin.cn/post/6844903962500399118 "https://juejin.cn/post/6844903962500399118")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")

### 最后

目前**H5-Dooring**还在飞速迭代,

*   github地址: [github.com/MrXujiang/h…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")
*   ℹ️ issue地址： [github.com/MrXujiang/h…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring%2Fissues "https://github.com/MrXujiang/h5-Dooring/issues")
*   [官方文档](https://link.juejin.cn?target=http%3A%2Fh5.dooring.cn%2Fdoc "http:/h5.dooring.cn/doc")

dooring更新日志

1.  图片库支持自定义图片上传
2.  修复预览页面方法隐藏bug
3.  dooring文档添加部署和二次开发文档，具体包括： 1. dooring开发文档迭代 2. 表单组件支持布局概念 3. 支持表单数据批量导入，删除 4. 图标组件支持自定义上传

近期规划

1.  完善api接口文档
2.  pc端页面编辑器
3.  beta版初版