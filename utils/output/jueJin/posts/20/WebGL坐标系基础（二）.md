---
author: ""
title: "WebGL坐标系基础（二）"
date: 2021-03-09
description: "在上一篇文章：《WebGL 坐标系基础（一）》中，我们介绍了WebGL 中常见的几种坐标系以及他们之间的关系。本期将更加“硬核”一些，从数学的角度，推导上期讲到的各个变换矩阵。 在下面的推导中，我们统一使用列向量来表示一个坐标，所谓列向量就是一个N1 矩阵。例如坐标(x, y…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:37,comments:8,collects:32,views:3203,"
---
> 希沃ENOW大前端
> 
> [公司官网：CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：** ![](/images/jueJin/9494a1b6620a493.png)

前言
==

> 本文假设读者已经对向量、矩阵有一定的了解。对此不了解的读者不妨先看一下这篇文章：[《乘风破浪的WebGL系列-仿射变换数学基础》](https://juejin.cn/post/6934885525497544711 "https://juejin.cn/post/6934885525497544711")

在上一篇文章：[《WebGL 坐标系基础（一）》](https://juejin.cn/post/6890795086054260750 "https://juejin.cn/post/6890795086054260750")中，我们介绍了`WebGL` 中常见的几种坐标系以及他们之间的关系。本期将更加“硬核”一些，从数学的角度，推导上期讲到的各个变换矩阵。

[](https://link.juejin.cn?target=)

基础概念
====

[](https://link.juejin.cn?target=)

列向量
---

在下面的推导中，我们统一使用列向量来表示一个坐标，所谓列向量就是一个`N*1` 矩阵。例如坐标`(x, y, z)` 可以表示为： ![Screen_Shot_2021-03-06_at_23.26.41.png](/images/jueJin/c5f90973572144c.png)

为什么要用这样的 `N1` 矩阵来表示坐标？其实就是因为我们是通过一个个的矩阵来表示各种各样的变换，而把坐标变成 `N1` 矩阵，就能让其与变换矩阵运算，从而变换我们的坐标。

[](https://link.juejin.cn?target=)

齐次坐标
----

上面用 `N*1` 矩阵表示的坐标，我们称之为 `N` 维坐标，如果我们再加一维，变成 `N+1` 维，就称之为齐次坐标，对应的 `N+1` 维矩阵就是齐次矩阵。

为什么要引入齐次坐标的概念？常见的说法是通过齐次坐标新增加的维度来区分点与向量，新增维度的值为`0`则代表向量，不为`0`则代表点。

> 关于为什么新增的维度能用于区分点与向量，可以看一下这篇文章：[齐次坐标理解](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F110503121 "https://zhuanlan.zhihu.com/p/110503121")

不过个人认为，齐次坐标更加巧妙的一点是能够把平移转换变成矩阵相乘的运算。

下面我们会知道，旋转、缩放等变换都是通过矩阵乘法进行的，并且变换的组合（例如先缩放再旋转）也是通过变换矩阵相乘求出。但是唯独平移变换是通过矩阵加法进行。假设一个坐标分别往`x，y，z` 方向平移 `Tx，Ty，Tz`，那么用矩阵加法来表示就是：

![Screen_Shot_2021-03-07_at_00.06.58.png](/images/jueJin/f47e164f579e464.png)

等式的右边就是我们需要获得的平移变换之后的坐标，由于常量 `Tx，Ty，Tz` 的存在，我们显然无法通过简单的矩阵乘法得到这样的坐标，那么我们要如何通过乘法得到一样的坐标呢？只需要加一维即可。

![Screen Shot 2021-03-09 at 10.05.09.png](/images/jueJin/d570f1b12d66464.png)

此外还记得上一期谈到的分量 `w` 吗？他其实就是齐次坐标带来的额外的一维，所以齐次坐标的引入也方便我们模拟透视效果。

总的来说，齐次坐标的引入具有三个作用：

1.  区分向量和点
2.  使平移变换能通过矩阵乘法运算实现
3.  方便模拟透视效果

[](https://link.juejin.cn?target=)

基本变换
====

在齐次坐标下，仿射变换都可以套用以下的形式：

![Screen Shot 2021-03-09 at 10.07.26.png](/images/jueJin/919be95bb3284b7.png) 可见每一个分量都符合仿射变换的定义。

[](https://link.juejin.cn?target=)

平移变换
----

根据平移变换的定义，对一个点`(x, y, z)`平移，即对其三个分量分别加上一个常数：

![Screen_Shot_2021-03-07_at_16.44.29.png](/images/jueJin/dcbcc66674ed470.png) 套入上面提到的矩阵模板，即`a=1，b=0，c=0`，显然平移矩阵可以写成：

![Screen_Shot_2021-03-07_at_16.46.23.png](/images/jueJin/43898d47b74d457.png)[](https://link.juejin.cn?target=)

缩放变换
----

缩放变换意味着一个点的各个分量均为原来的 `S` 倍，以 `x` 轴分量缩放 `Sx` 倍为例：

![Screen_Shot_2021-03-07_at_16.50.35.png](/images/jueJin/cf4ef8b60ab54b5.png) 套入上面的矩阵模版，即`a=Sx，b=0，c=0，Tx=0`，显然缩放矩阵可以写成：

![Screen_Shot_2021-03-07_at_16.52.52.png](/images/jueJin/007e8932fd44457.png)[](https://link.juejin.cn?target=)

旋转变换
----

以上两个矩阵的推导都非常直观，相比起来旋转矩阵的推导就略显复杂。 首先我们定义，这里所说的旋转是指将点`P` 绕坐标原点逆时针旋转 `θ` 度。

![Screen_Shot_2021-03-07_at_16.59.26.png](/images/jueJin/165d2ba8e2a9477.png) 为了推导的方便我们先使用极坐标表示。 在极坐标下，`P`点的坐标为`（r, α）`，`P` 旋转 `θ` 度后的坐标为`（r, α + θ)`。 再将极坐标转回直角坐标，有：

![Screen_Shot_2021-03-07_at_17.07.54.png](/images/jueJin/1890dd358fb346d.png)

把`P`点原来的极坐标与直角坐标的转换关系代入，有：

![Screen_Shot_2021-03-07_at_17.10.03.png](/images/jueJin/c291735ada274c1.png) 上面的推导是二维的，但是我们可以很容易的将上面的旋转等同于在 `xyz` 坐标系中，绕坐标轴 `z` 旋转，因为是绕坐标轴 `z` 旋转，所以旋转前后点 `P` 的 `z` 分量保持不变，`x，y`分量的变化与上面的推导结果一致，因此绕 `z` 轴旋转的结果为：

![Screen_Shot_2021-03-07_at_17.19.26.png](/images/jueJin/4b8648c7086444d.png)

代入我们的矩阵模板，可得绕`z` 轴旋转的旋转矩阵：

![Screen_Shot_2021-03-07_at_17.21.00.png](/images/jueJin/5453dbef7900439.png)

同理可得绕 `x` 轴，`y` 轴的旋转矩阵，这里就不列出来，读者可以自己写一下，答案可以参考：

[LearnOpenGL](https://link.juejin.cn?target=https%3A%2F%2Flearnopengl.com%2FGetting-started%2FTransformations "https://learnopengl.com/Getting-started/Transformations")

需要注意的是，更多时候我们需要绕任意轴旋转，尽管绕任意轴旋转可以通过以上三轴旋转的组合实现，但会出现万向节死锁的问题，一个更好的方式是一步到位，求解出一个绕任意轴旋转的矩阵，但是这个矩阵会比较复杂并且也无法彻底避免万向节死锁问题。

这样的矩阵我先贴出来，由于并非本期重点所以略去了推导过程，有兴趣的童鞋可以看一下这篇：[三维空间绕任意轴旋转矩阵的推导](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F56587491 "https://zhuanlan.zhihu.com/p/56587491")

![Screen_Shot_2021-03-07_at_17.33.09.png](/images/jueJin/e3fb268d1ac542e.png) 其中 (Rx,Ry, Rz) 代表旋转轴的向量。

要完全解决该问题需要使用四元数，有兴趣的读者可以找另外的资料学习，（不妨看看这篇[四元数与三维旋转](https://link.juejin.cn?target=https%3A%2F%2Fkrasjet.github.io%2Fquaternion%2Fquaternion.pdf "https://krasjet.github.io/quaternion/quaternion.pdf")），此处就不再展开了。

[](https://link.juejin.cn?target=)

模型变换矩阵
======

简单回顾一下模型变换：用于将模型坐标系转换到世界坐标系的变换，也就是将我们的小车模型安放在世界坐标系的某一处。

而要实现模型变换，显然一个很好的方式就是借助于矩阵这一强大的数学工具。我们将模型的某一个顶点的坐标用上文提到的列向量来表示，那么只要将我们的模型变换矩阵左乘该列向量，就能得到变换之后的顶点坐标。

模型变换是上文提到的三个基本变换组合而成，我们也知道矩阵乘法不符合交换律，因此基本变换的组合顺序至关重要，具体来说，模型变换有以下公式： ![Screen Shot 2021-03-09 at 10.12.37.png](/images/jueJin/ed5a18b83297466.png) 其中 `T` 是平移变换矩阵，`R` 是旋转变换矩阵，`S`是缩放变换矩阵。之所以有这样的顺序，我们可以从两个角度来理解。

[](https://link.juejin.cn?target=)

定性理解
----

我们在推导旋转矩阵的时候，其实是约定了顶点是绕坐标原点旋转，如果模型的原点与世界坐标原点重合，那么顶点绕模型原点与绕坐标原点旋转是一样的。然而如果我们先平移，让两个原点不重合，那么在应用旋转矩阵的时候，顶点依旧绕坐标原点旋转，但我们一般还是希望顶点能绕模型原点旋转，这就不符合我们的期待。所以需要先进行旋转变换，再平移。缩放变换类似的，同样隐含着以坐标原点为中心的条件，所以也是要先缩放再平移。

至于缩放与旋转的次序，我们在定义缩放矩阵的时候，是针对当前的坐标定义的各个分量的缩放比例，如果此时经过旋转，坐标已经发生了改变，那么再使用之前的缩放比例就会有问题。而旋转则没有类似的问题，因为他定义的是任何一个点需要绕坐标原点旋转某个角度，这样的定义适用于所有坐标，不存在坐标已经改变导致原定义不适用的问题。[](https://link.juejin.cn?target=)

数学理解
----

这里我举平移与旋转，旋转与缩放作为例子。[](https://link.juejin.cn?target=)

### 假如先平移再旋转

> 勘误：此处的矩阵相乘应为点乘

![Screen_Shot_2021-03-07_at_23.02.09.png](/images/jueJin/36d689d33472491.png) 注意变换之后的坐标的后半部分，从结果来看，不再以原来的方向平移，平移的方向也旋转了。

[](https://link.juejin.cn?target=)

### 假如先旋转再缩放

![Screen_Shot_2021-03-08_at_22.12.21.png](/images/jueJin/a4785896bdbb417.png)

从变换后的坐标可见，`Sx` 不仅作用于原来的`x`分量，也作用于原来的 `y` 分量，`Sy` 也有类似的情况。同时我们发现，如果 `Sx，Sy，Sz` 的值一致，那么旋转与缩放的顺序就不再重要，结果都一样。[](https://link.juejin.cn?target=)

视图变换矩阵
======

这个矩阵就是将点从世界坐标系转换到观察（相机）坐标系的矩阵。在上一期我们知道，我们会在世界坐标系中放置一个相机（观察点），并且相机有方向。这就很像我们在模型变换里面将物体放置在世界坐标系中做过的事情。我们先通过平移变换将相机放在某一处，再通过旋转变换将相机朝向某一个方向。设 `P1` 是顶点在观察坐标系中的坐标，`P0` 是在世界坐标系的坐标，那么就有： ![Screen_Shot_2021-03-08_at_19.59.19.png](/images/jueJin/eb38dc945d14443.png)

同时，根据矩阵两条的性质：

1.  矩阵左乘逆矩阵等于单位矩阵
2.  单位矩阵左乘矩阵等于原矩阵

我们很容易就有以下的推导过程：![Screen_Shot_2021-03-08_at_20.13.32.png](/images/jueJin/7920be757cfa4f8.png)

因此只需要求出相机的平移矩阵以及旋转矩阵的逆矩阵，就能组合起视图变换矩阵，将顶点在世界坐标系中的坐标 `P0`，转换成在相机坐标系中的坐标 `P1`。

已知相机的坐标是`（ex, ey, ez）`，那么根据前文的知识，很容易就能得出平移矩阵。而平移矩阵的逆矩阵也很容易就能看出来，这里就不详细推导了。

![Screen_Shot_2021-03-08_at_20.25.48.png](/images/jueJin/80dfaf76f1ad4df.png)

下面我们来推导以下旋转矩阵。

首先定义相机坐标系的三个基向量 `Ux, Uy, Uz`，其中Ux在世界坐标系的三个轴`x, y, z`的分量分别是：`Uxx, Uxy, Uxz`。`Uy`与`Uz`同理。这样，将一个顶点在相机坐标系中的坐标 `P1` 转成世界坐标系的坐标`P0`的变换矩阵 `R` 就能用`Ux，Uy， Uz`的分量表示出来：

![Screen_Shot_2021-03-08_at_22.20.20.png](/images/jueJin/a2241bdd7dc4441.png)

> 关于如何得出这个矩阵，可以回忆一下旋转矩阵，但这一次我们不是旋转顶点，而是先旋转坐标系，再将顶点从在旋转后坐标系中的坐标，转成在旋转前坐标系的坐标。简单起见，可先从二维旋转入手。

我们需要的是这个变换矩阵的逆矩阵，而由于我们旋转之后的相机坐标系的三轴是相互垂直的，所以矩阵是正交矩阵，正交矩阵的逆矩阵等于矩阵的转置矩阵。于是逆矩阵 R-1 即为：

![Screen_Shot_2021-03-08_at_22.23.57.png](/images/jueJin/2ef17f44b8e94d8.png)

将矩阵代入之前的结果

![Screen_Shot_2021-03-08_at_22.31.17.png](/images/jueJin/c34758e2d7484e2.png)

最后的问题就是，我们要如何求出这几个基向量在世界坐标系的分量。

首先我们会通过两个点（均为世界坐标系的点），以及相机头顶的方向向量来定义相机的位置与方向：

1.  相机的位置点 `e (ex, ey, ez)`
2.  相机看向的点 `T (Tx, Ty, Tz)`
3.  摄像机上方方向向量 `u (ux, uy, uz)`

很符合我们的现实世界是不是？

接着我们会定义观察的方向为 Uz，那么根据向量加减法， Uz 显然等于：

![Screen_Shot_2021-03-08_at_22.46.04.png](/images/jueJin/d979e3eb103944a.png) ![Screen_Shot_2021-03-08_at_22.48.40.png](/images/jueJin/35cf74acd62a49a.png) 第二个等式代表需要归一化处理。 有了 Uz 之后再将其与上方方向向量 u 进行叉乘再归一化，得到 Ux。同理，再利用 Uz 与 Ux 叉乘并归一化，得到 Uy。 至此整个视图变换矩阵就得到了。[](https://link.juejin.cn?target=)

投影变换矩阵
======

上期提到，投影分正交投影和透视投影，下面会分别推导。[](https://link.juejin.cn?target=)

正交投影
----

在正交投影中，我们使用一个长方体来定义可视范围：

![1f5f8ecaca6348fc9d931249874d0489_tplv-k3u1fbpfcp-zoom-1.png](/images/jueJin/7d5648fdf69a44c.png)

我们需要把模型中的一个点 P, 投影到近平面中，成为坐标 P'。P' (x', y', z') 坐标具有以下特点：

*   x' 在 -1, 1之间
*   y' 在 -1, 1之间
*   z' 在 -1, 1之间

> 这样意味着经过变换之后一步到位来到来规范化的设备坐标系（NDC）。

根据这一特点，我们以 x 为例，推导 x 与 x' 的关系： ![Screen_Shot_2021-03-09_at_00.26.53.png](/images/jueJin/0a706ce82637443.png)

其中 l 为左平面位置，r 为右平面位置。运用类似的方式也能得出 y' 与 y，z' 与 z 的关系。代入矩阵中即可得到正交变换矩阵：

![Screen_Shot_2021-03-09_at_00.31.32.png](/images/jueJin/3b3c63f6b13f4c8.png)

其中t、b、n、f 分别对应上平面，下平面，近平面，远平面的位置。[](https://link.juejin.cn?target=)

透视投影
----

![8cb3e9827d2a4cb38432cfe7b0ab814b_tplv-k3u1fbpfcp-zoom-1.jpg](/images/jueJin/9e1cb45906bc42e.png)

相比起来透视投影会复杂一些。由于透视投影的可视范围是一个锥体，因此我们会需要用到相似三角形的知识，回忆一下：

![Screen_Shot_2021-03-09_at_00.34.50.png](/images/jueJin/5f059f3d5231469.png)

假设有以上的坐标关系，那么在n上的那个交点 p' 的 x 坐标 x1 可以这么求出：

![Screen_Shot_2021-03-09_at_00.36.33.png](/images/jueJin/4e6a87d5cecd45f.png)

同样的，x', y', z' 均在 -1 到 1之间。接下来我们先推导x，y的值。以 x 为例，近平面上的，x1经过归一化后的值为：

![Screen_Shot_2021-03-09_at_01.03.02.png](/images/jueJin/7c64674a675b459.png)

上面的公式我们在推导正交变换的时候已经见过。但是与正交不同，x并不等于x1，但是我们可以通过相似三角形原理求出：

![Screen_Shot_2021-03-09_at_01.07.58.png](/images/jueJin/81fad42adfde4b1.png) 其中n是近平面的位置。这里的负号是因为投影坐标系和相机坐标系的 z 轴相反。y' 的情况同理。 因此我们有：

![Screen_Shot_2021-03-09_at_01.16.24.png](/images/jueJin/7aaed9bc59684b2.png) 接下来我们求解 z 与 z‘ 的关系。已知当 z 为近平面时，裁剪空间中的 z 为 -1，z 为远平面时则为1。于是有：

![Screen_Shot_2021-03-09_at_01.31.27.png](/images/jueJin/7dc4cfd65a8c440.png)

![Screen_Shot_2021-03-09_at_01.32.12.png](/images/jueJin/279be1b54c39496.png) 所以：

![Screen_Shot_2021-03-09_at_01.34.06.png](/images/jueJin/2c1a2f4721ee429.png)

从上面的关系中可以看到，x' 和 y' 都带来一个与 z 相关的常量，回忆一下上期降到的 w 分量，那个常量即为 w 分量，可见 z 越大，离近平面越远，越小。

结合起来，我们的矩阵可以写成：

![Screen_Shot_2021-03-09_at_01.40.47.png](/images/jueJin/ed6554fce090443.png)

从矩阵也可以看出，经过变换之后原来为1的齐次坐标会变成与z相关的-z。[](https://link.juejin.cn?target=)

总结
==

本期我们推导了经常用到的各种矩阵，本人也是现学现卖，难免会有一些错漏，还请大家在评论区指出。

参考资料

1.  [掘金小册《WebGL 入门与实践》](https://juejin.cn/book/6844733755580481543 "https://juejin.cn/book/6844733755580481543")
2.  [LearnOpenGL](https://link.juejin.cn?target=https%3A%2F%2Flearnopengl.com%2FGetting-started%2FCoordinate-Systems "https://learnopengl.com/Getting-started/Coordinate-Systems")
3.  交互式计算机图形学——基于WEBGL的自顶向下方法（第7版）
4.  [知乎：为什么directX里表示三维坐标要建一个4\*4的矩阵？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F36296104%2Fanswer%2F83199096 "https://www.zhihu.com/question/36296104/answer/83199096")
5.  [OpenGL矩阵变换的数学推导](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1389550 "https://cloud.tencent.com/developer/article/1389550")
6.  [webgl 开发第一道坎：矩阵与坐标变换](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fp%2F1210000011522002%2Fread "https://segmentfault.com/p/1210000011522002/read")
7.  [计算机图形学视图矩阵推导过程](https://link.juejin.cn?target=https%3A%2F%2Fwww.shangmayuan.com%2Fa%2Fe37ffd459ca24cc2bc0ac986.html "https://www.shangmayuan.com/a/e37ffd459ca24cc2bc0ac986.html")