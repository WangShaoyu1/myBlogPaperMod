---
author: "苏武难飞"
title: "css实现长虹玻璃(Fluted)效果"
date: 2024-08-05
description: "起因在网上冲浪时看到了一个非常炫酷得效果，自我学习掌握后又开发出来得长虹玻璃效果，第一时间分享给大家！什么是长虹玻璃效果(Fluted)简单得说就是类似透过磨砂玻璃看物体时得效果，具体表现为垂直"
tags: ["前端","CSS","HTML"]
ShowReadingTime: "阅读6分钟"
weight: 677
---
### 起因

在网上冲浪时看到了一个非常炫酷得效果，自我学习掌握后又开发出来得`长虹玻璃`效果，第一时间分享给大家！

![01.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f034fb99073d4c5ebde3c3c2cd78c358~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=HtSeS%2B7EvODZqsWzCFDnzIompTs%3D)

### 什么是长虹玻璃效果(Fluted)

> “长虹玻璃”效果是一种特殊的玻璃效果，通常具有条纹状的透明或半透明图案，类似于磨砂玻璃，但带有垂直或水平的纹理凹槽。这种玻璃在保持隐私的同时，还允许一定量的光线通过，常用于室内装饰、淋浴房、门窗等场合。

简单得说就是类似透过磨砂玻璃看物体时得效果，具体表现为垂直或水平得纹理凹槽，透过纹理得图像会产生一定程度得偏移！

> 本篇得核心功能是借助于`svg`滤镜效果来实现，如果还没有看过相关得知识可以猛击`Coco`大佬的一篇文章[你所不知道的 CSS 滤镜技巧与细节](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fchokcoco%2FiCSS%2Fissues%2F30 "https://github.com/chokcoco/iCSS/issues/30") ，或者留言讨论！

### 如何实现？

现在我们大概了解了什么是所谓得`长虹玻璃`效果，核心是如何创造一个**垂直**纹理，透过纹理得内容会产生一定程度得偏移。

#### feDisplacementMap

`<feDisplacementMap>`是一个 SVG 滤镜原语，用于在图像上创建形变效果。它通过使用一个位移贴图来移动输入图像中的像素，从而产生扭曲、波纹或其他形变效果。以下是对 `<feDisplacementMap>` 的详细介绍：

_属性_

*   in: 定义输入图像。可以是另一个滤镜原语的结果，也可以是 "SourceGraphic"（原始图像）。
*   in2: 定义位移贴图图像。位移贴图中的颜色值决定了如何移动输入图像中的像素。
*   scale: 定义位移的强度。较高的值会产生更大的位移效果。
*   xChannelSelector: 定义位移贴图的哪个颜色通道用于水平位移。可选值为 "R"（红色）、"G"（绿色）、"B"（蓝色）和 "A"（透明度）。
*   yChannelSelector: 定义位移贴图的哪个颜色通道用于垂直位移。可选值与 xChannelSelector 相同。

如果只看定义得话会发现太抽象了，接下来我们举个实际得栗子！

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

ini

 代码解读

复制代码

`<svg version="1.1" width="128" height="266" xmlns="http://www.w3.org/2000/svg" color-interpolation-filters="sRGB">     <filter             id="filter"             width="128"             height="128"             x="0" y="0" filterUnits="userSpaceOnUse"             color-interpolation-filters="sRGB">         <feImage                 width="128"                 height="128"                 href="../img/09.jpg"/>         <feDisplacementMap                 in="SourceGraphic"                 xChannelSelector="R"                 yChannelSelector="G"                 scale="50"/>     </filter>     <image height="128" width="128" href="../img/04.webp" filter="url(#filter)"/> </svg>`

![02.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/08fbaecb88984c078b7a8b77f8b1ffab~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=r9RStRpss53%2FM%2Bua0QiV7dwxiBg%3D)

可以发现我们两个图片融合后原图产生了明显得形变，具体形变得公式如下:

> P'(x,y) ← P( x + scale \* (XC(x,y) - .5), y + scale \* (YC(x,y) - .5))

看着非常唬人但其实非常容易理解:

*   P′(x,y) 表示结果图像中一个像素的坐标；
*   x 和 y 是未过滤源图像中该像素的坐标；
*   XC 和 YC 是映射图中给定像素的标准化（1/255）RGB颜色值；

代入公式我们再来一个简单得栗子

ini

 代码解读

复制代码

    `<svg version="1.1" width="128" height="128" xmlns="http://www.w3.org/2000/svg" color-interpolation-filters="sRGB">         <filter                 id="filter"                 width="128"                 height="128"                 x="0" y="0" filterUnits="userSpaceOnUse"                 color-interpolation-filters="sRGB">             <feImage                     width="128"                     height="128"                     href="data:image/svg+xml,%3Csvg version='1.1' width='128' height='128' xmlns='http://www.w3.org/2000/svg' color-interpolation-filters='sRGB'%3E%3Crect height='128' width='128' stroke='black'/%3E%3C/svg%3E"/>             <feDisplacementMap                     in="SourceGraphic"                     xChannelSelector="R"                     yChannelSelector="G"                     scale="50"/>         </filter>         <rect height="128" width="128" stroke="red" stroke-width="2px"/>         <rect height="128" width="128" fill="white" filter="url(#filter)"/>     </svg>`

![03.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/816b58776fcd417fab330dc8e5bb19a9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=2sfUW4YtPmyxGWjRoLl82jSCpVY%3D)

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

因为我们得`feImage`是一个**纯黑**得色块，带入公式我们可以算出来原图每一个像素点都会偏移`-25,-25`这里有一些反直觉得是`x轴`小于0是向右移动，`y轴`小于0是向下移动，如果实在不习惯这样我们可以把公式取反来理解~

我们可以多实验几个颜色来验证心中猜想，比如黑色 -> 红色，此时红色得色值是`255,0,0`,此时在`x轴`上就会向左移动!

我们可能也会注意到`feDisplacementMap`得偏移公式是不受**原图**影响得，也就是只受`in2`属性`XC`和`scale`得值影响。即把上面得栗子白色色块换成图片也是一样的效果。

![04.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/49d1e8f6c097441397d119cb7a6fbb79~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=ubG7yCFLdf%2B0RAaeq%2BY0sQKlf9Q%3D)

#### 垂直纹理实现✌

上面得一小节我们已经基本了解了`feDisplacementMap`得使用，接下来我们就要实际动手来实现**长虹玻璃**效果!

根据栗子二和栗子三我们已经学会了使用`feImage`配合`feDisplacementMap`来扭曲偏移原图，栗子四我们知道`feDisplacementMap`需要配合`in2`属性来扭曲偏移图片，接下来我们就来先实现一个垂直纹理偏移效果！

ini

 代码解读

复制代码

`<svg version="1.1" width="40" height="685" xmlns="http://www.w3.org/2000/svg" color-interpolation-filters="sRGB">     <g>         <rect width='40' height='685' fill='black' />         <rect width='40' height='685' fill='url(#red)' style='mix-blend-mode:screen' />         <rect width='40' height='685' fill='url(#green)' style='mix-blend-mode:screen' />         <rect width='40' height='685' fill='url(#yellow)' style='mix-blend-mode:screen' />     </g>     <defs>         <radialGradient id='yellow' cx='0' cy='0' r='1' >             <stop stop-color='yellow' />             <stop stop-color='yellow' offset='1' stop-opacity='0' />         </radialGradient>         <radialGradient id='green' cx='1' cy='0' r='1' >             <stop stop-color='green' />             <stop stop-color='green' offset='1' stop-opacity='0' />         </radialGradient>         <radialGradient id='red' cx='0' cy='1' r='1' >             <stop stop-color='red' />             <stop stop-color='red' offset='1' stop-opacity='0' />         </radialGradient>     </defs> </svg>`

效果如下:

![05.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd4134cf3d98426e9124cb6b40fd68d0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=4s3T7XA8BLAtE71rN9NQobH7q2o%3D)

接下来就是见证魔法得时候，我们使用这个**渐变**去和**原图**混合时会发生什么呢！

ini

 代码解读

复制代码

        `img {             width: 400px;         }         div {             width: 400px;             height: 685px;             display: flex;             filter: url(#fluted);             background-image:url("...svg");             background-size: 40px auto;             background-repeat: repeat-x;         }         <svg ...>                 <filter id="fluted" ...>                         <feImage href="10.webp" />                         <feDisplacementMap                                 scale=".08"                                 xChannelSelector="R"                                 yChannelSelector="G"                                 in="image_0"                                 in2="SourceGraphic"                                 result="displacement_0"/>                 </filter>         </svg>`

这里要注意得是，我们得`in`和`in2`发生了变化，此时`in2`为`SourceGraphic`,因为我们得渐变色现在是**原始图形**了,至于为什么我们后面有解答~

![06.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0a1e1ac6f87a47fdaa9d81253886875c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=8PZ3pQQ6YWCOKBI5PZiffm%2Fx33Y%3D)

wow，现在看起来得效果已经很棒了(๑•̀ㅂ•́)و✧，接下来就是让整个结果动起来！

#### 流光溢彩👍

在做这一步得时候我们先梳理一下现在得代码逻辑。

首先我们使用`background-image`铺满了整个`svg`渐变色

css

 代码解读

复制代码

`div {         width: 400px;         height: 685px;         background-image:url("data:image/svg+xml ...");         background-size: 40px auto;         background-repeat: repeat-x; }`

![07.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/65a2f6d2c10d4d078ff1393c34851d39~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=DhIomQg5xKUTRqPkiytj4V%2BXyU4%3D)

然后通过设置**svg滤镜**，并且在**滤镜**中使用`feImage`引入一个外部图片，并把平铺得`svg`渐变色当作**定义位移贴图图像**

![06.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0a1e1ac6f87a47fdaa9d81253886875c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6IuP5q2m6Zq-6aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727677714&x-signature=8PZ3pQQ6YWCOKBI5PZiffm%2Fx33Y%3D)

此时我们得**svg滤镜**功能其实已经全部结束！我们需要让整个效果动起来，应该考虑改变得是外部**位移贴图图像**也就是我们平铺出来得`svg`渐变色，这也回答了上面得问题，我们为什么要把`in2`设置为`SourceGraphic`，就是因为我们这一步需要做得动画效果！

如何让`background-image`动起来其实已经非常简单了，那就是通过动态改变`background-position`!

css

 代码解读

复制代码

`div {         width: 400px;         height: 685px;         filter: url(#fluted);         animation: shimmer 10s linear infinite;         background-image:url("data:image/svg+xml ...");         background-size: 40px auto;         background-repeat: repeat-x; }  @keyframes shimmer {         0% {             background-position: 0% 0;         }         100% {             background-position: 100% 0;         } }`

### 效果展示

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

### 结语

几人终得鹿，不知终日梦为鱼。

### 参考资料

[CodePen Home Fluted Navbar | Cubiq](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fthecubiq%2Fpen%2FvYwOBaa "https://codepen.io/thecubiq/pen/vYwOBaa")

[A Deep Dive Into The Wonderful World Of SVG Displacement Filtering](https://link.juejin.cn?target=https%3A%2F%2Fwww.smashingmagazine.com%2F2021%2F09%2Fdeep-dive-wonderful-world-svg-displacement-filtering%2F "https://www.smashingmagazine.com/2021/09/deep-dive-wonderful-world-svg-displacement-filtering/")