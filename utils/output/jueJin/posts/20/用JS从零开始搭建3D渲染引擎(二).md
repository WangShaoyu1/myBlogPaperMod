---
author: ""
title: "用JS从零开始搭建3D渲染引擎(二)"
date: 2021-02-23
description: "为什么要写这个系列呢? 这个问题在本系列的第一篇文章中回答了, 大家可以向上翻看 这系列文章以代码Demo为线索, 从这个demo的搭建过程中去深度理解三维渲染的要素和环节 具有以下特点 一 不使用webgl技术来完成三维渲染, webgl规范帮我们封装了很多底层实现,…"
tags: ["WebGL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:31,comments:0,collects:18,views:2505,"
---
> 希沃ENOW大前端
> 
> 公司官网：[CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：**

![](/images/jueJin/e30349f41129405.png)

背景及目的
-----

为什么要写这个系列呢? 这个问题在本系列的第一篇文章中回答了, 大家可以向上翻看.

这系列文章以代码`Demo`为线索, 从这个`demo`的搭建过程中去深度理解三维渲染的要素和环节. 具有以下特点:

一. 不使用`webgl`技术来完成三维渲染, `webgl`规范帮我们封装了很多底层实现, 因此也屏蔽了一部分重要的细节, 笔者更希望webgl技术只是提供了对接GPU计算的接口, 让我们可以使用`GPU`的力量来提升计算效率, 当然不使用`GPU`仅使用`CPU`也能做到同样的事, 只不过效率低一些, 但是以学习为目的的话足够了, 反而会使我们更清晰, 因此我们会使用纯粹JS代码来进行所有的运算和绘制并且最终实现一个"3D渲染引擎";

二. 我们利用`demo`的搭建过程来理解三维渲染, 因此在这个过程中我们会分为几个小阶段, 每一个阶段有阶段性目标作为驱动, 有时会用比较简易的方法来达到目的, 当阶段性目标变得更复杂, 可能会推掉之前的部分实现来满足更复杂的需求;

三. 既然是以`Demo`为线索和主体, 所有的代码都是可得的, 在这个仓库里([github.com/ShaojieLiu/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FShaojieLiu%2F3dRender "https://github.com/ShaojieLiu/3dRender")), 期望大家可以去下载并运行, 甚至亲自从零开始一起搭建, 相信能有所收获!

最终我们会基于`2D`渲染的`API`来实现三维渲染引擎. 它可以解析并渲染市面上常用的三维模型数据格式, 具有边框渲染/片元渲染/贴图功能/光照阴影等.

![](/images/jueJin/bd4f281ff862425.png)

话接上回
----

这是一个系列的, 所以期望读者可以循序渐进阅读. 这里附上上期链接:

[用JS从零开始搭建3D渲染引擎(一)](https://juejin.cn/post/6888105621372026888 "https://juejin.cn/post/6888105621372026888")

上回我们的demo进展到了实现一个线框渲染器, 它可以将我们特定的模型描述(由8个点, 12个面组成的立方体)的线框的投影图像渲染在canvas上. 并且支持旋转运动和不同的投影透视效果. 直观来看就是这样:

![Screen Recording 2020-10-26 at 12.49.57 AM.gif](/images/jueJin/d47ee65205a0438.png)

线框的表现力确实很差, 我们甚至无法分辨哪些点在前哪些点在后, 无法表现点和面之间的遮挡关系! 因此这一节的主题便是实现片元渲染, 让我们的渲染器`demo`的表现力上一台阶。

片元着色器
=====

"片元"是一个专有名词, 大致是指已经转化为窗口坐标的顶点所连结成的最小图形单元. "片元着色器"也是一个专有名词, 但是着色器不仅处理了片元的颜色填充/片元之间的遮挡关系, 还包括了颜色和纹理的插值处理甚至光照的效果, 这里咱们本节所要实现的其实只是"片元着色器"的一部分功能, 其他功能我们先按下不表. 像咱们`demo1.3`中所示的立方体来说, 每个立方体由两个三角形的面所组成, 一共有12个面, 因此每一个三角形便是一个片元.

简单尝试
----

听起来也不难嘛, 不就是原来只渲染边框, 现在把边框和面的填充色一起渲染了. 查看了下MDN的文档([developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FCanvasRenderingContext2D%2Ffill "https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill")), canvas正好有这样的API, 只要在`beginPath`和`closePath`之间用`lineto`连成一个封闭图形, 再执行`fill`即可完成填色, 是否真就如此简单呢? 说干就干吧.

为了达到需求, 我们将 `1.3/src/render/canvas.js` 的代码作如下修改, 让它在绘制线框的同时也绘制填充色! 这里读者可以打开1.3文件夹里的代码做如下修改并查看效果:

1.  把`drawline`里面的`beginPath`和`closePath`提取到`drawline`外部, 这样方便整个三角形成为一个整体来填色
2.  设置`fillstyle`, 并在`stroke()`调用之后执行`fill()`调用, 填充颜色

具体如何改动我已经标注在下面代码块里了, 如果还不清晰的话, 可以打开`2.1`文件夹来查看.

```javascript
    class Canvas extends GObject {
    // 无改动的方法先忽略
    
        drawline(v1, v2, color) {
        /**
        * 改动开始
        */
        // console.log('drawline', v1, v2)
        const ctx = this.ctx
        // ctx.beginPath()
        ctx.strokeStyle = color.toRgba()
        // ctx.moveTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        // ctx.closePath()
        // ctx.stroke()
        /**
        * 改动结束
        */
    }
    
        drawMesh(mesh, cameraIndex) {
        const { indices, vertices } = mesh
        const { w, h } = this
        
        let { position, target, up } = Camera.new(cameraIndex || 0)
        const view = Matrix.lookAtLH(position, target, up)
        const projection = Matrix.perspectiveFovLH(8, w / h, 0.1, 1)
        
        const rotation = Matrix.rotation(mesh.rotation)
        const translation = Matrix.translation(mesh.position)
        const world = rotation.multiply(translation)
        const transform = world.multiply(view).multiply(projection)
        
        // console.log('transform', transform, world, rotation, translation)
        const ctx = this.ctx
        
        const color = Color.blue()
            indices.forEach(ind => {
                const [v1, v2, v3] = ind.map(i => {
                return this.project(vertices[i], transform).position
                })
                /**
                * 改动开始
                */
                ctx.beginPath()
                ctx.moveTo(v1.x, v1.y)
                this.drawline(v1, v2, color)
                this.drawline(v2, v3, color)
                this.drawline(v3, v1, color)
                ctx.fillStyle = Color.green().toRgba()
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                /**
                * 改动结束
                */
                })
            }
        }
        
```

如果你改对了便会发现, 的确又有蓝色线框, 又有绿色表面, 一切都这么美好!

![](/images/jueJin/7ad25b1fad8e4a4.png)

然而事情没有想象的这么简单, 静态图片岁月静好, 一旦图形旋转起来, 马上就发现事情大条了!

![](/images/jueJin/5849cf03b1e8406.png)

既然可达鸭都发现了, 相信聪明的读者你也发现了. 一旦图形旋转起来, 便会出现奇怪的遮挡现象! (如下图所示) 一些时间里, 某些片元会超出预期地遮挡住其他片元.

那么这是为什么呢?

![Screen-Recording-2021-02-18-at-4.40.12-PM.gif](/images/jueJin/d4d0402d3e744e6.png)

片元遮挡
----

一个立方体有`12`个片元, 每个片元之间的渲染都是独立的, 那么会出现一个现象, 先绘制出来的片元会被后绘制出来的片元所覆盖. 而片元绘制的先后顺序其实是我们人为定义的毫无意义, 因此会出现上图诡异的一幕. 因此我们需要思考真正期望的遮挡需求是什么? 为了帮助大家思考, 我来举一些栗子.

1.  `z`值大的颜色挡住z值小的颜色, 我们采用的是右手坐标系(不清楚的可看上一篇), `z`轴正方向指向纸外, 因此z数值大的点距离摄像头较近, 这个应该好理解, 近处的物品遮挡了远处的物品
2.  有可能`a`片元只遮挡了`b`片元的一部分, 而不是整个片元.
3.  `abc`三个片元有可能互相循环遮挡, 各露出一部分.

假如片元`a`和`b`两者的三个顶点分别为`a1`, `a2`, `a3`和`b1`, `b2`, `b3`, 如果`a`都比`b`的`z`值大, 那么容易处理, 只需要先绘制片元b再绘制片元`a`, 那么`a`就会把`b`给遮挡住.

这很自然, 假如我们先绘制远处的片元再绘制近处的, 这样便可以利用绘制的先后顺序来实现遮挡关系了. 然而事情并不简单, 我们不仅要满足需求1还要满足需求2和3. 需求3有点拗口, 这里我用三张纸片摆了个样子帮大家理解, 如下图.

![](/images/jueJin/a15aaa3d879348f.png)

需求`3`其实是需求`2`的一种特殊情况, 只是为了帮助大家更直观地理解. 你说这种情况下`ab`c三个片元先绘制那个好呢? 无论先绘制哪一个, 都无法满足我们的需求. 因此这个绘制顺序的方案GG. 这个方案GG的本质是什么呢?

我认为绘制顺序的方案无论如何也无法满足需求的关键在于, 遮挡关系的最小单位不是片元而是像素点. 因此无论程序员如何调整代码, 只要他将绘制片元作为一个最小的单元, 那么此题无解. 所以, 我们要寻找的是操纵像素的`API`而不是绘制图形的`API`(绘制图形的`API`都是以图形作为最小单位的).

操纵像素
----

继续翻看MDN文档, canvas也提供了这样底层的API来进行像素级别的操作([developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FCanvasRenderingContext2D%2FputImageData "https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData")).

其中最重要的入参`imageData`的数据格式如文档所示([developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FImageData "https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData")). 另外还可以通过`getImageData`接口来获得`imageData`. 这个新的`API`比较底层比较抽象, 不太常用, 所以我们先来练习一下使用它.

那既然这个`API`这么强大, 那咱们练习的小目标便是使用这个`API`表达出 `256*256*256` 种颜色的渐变过程吧. `RGB`分别有`3`个自由度, 平面`XY`坐标可以覆盖其中两个自由度, 还有一个自由度就用时间来覆盖吧. 读者可以想想如何实现.

```javascript
    const main = () => {
    const c = document.querySelector('#canvas')
    const ctx = c.getContext('2d')
    const w = c.width
    const h = c.height
    let d = new Uint8ClampedArray(w * h * 4)
    
        const getData = t => {
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                d[i * 4 * w + j * 4 + 0] = 255 / w * j
                d[i * 4 * w + j * 4 + 1] = 255 / h * i
                d[i * 4 * w + j * 4 + 2] = Math.abs(t - 255)
                d[i * 4 * w + j * 4 + 3] = 255
            }
        }
        const data = new ImageData(d, w, h)
        return data
    }
    
    let time = 0
        setInterval(() => {
        ctx.putImageData(getData(time), 0, 0)
        time = (time + 1) % 512
        }, 10)
    }
    
    main()
```

寥寥二十几行代码一个美丽的彩色方块便赫然出现, 或许这正是程序的美妙之处吧! 具体代码可以参看`demo2.2.`

不过由于这个图片上每个点的颜色都不一致, 传统的压缩方式会大大降低它的质量, 所以看起来远没有程序运行的好看. (可惜了)

这里借着这个`demo`讲一下`imageData`的数据格式, `ImageData`的构造入参有三个, `data, width, height`. 其中`data`的长度为`width`和`height`乘积的`4`倍, `data`中按顺序存储着从左上到右下每一行像素点的`4`个通道的数值, `RGBA4`个通道值域从`0`到`255`, `2`的`8`次方即是`256`也就是说`canvas`的内部是`RGBA4`通道`8`位深度的.

举例当`width`为`10`, `height`为`10`, 则第一行像素我们命名为点`0`到点`9`, 则`data`数组的前`4`位分别控制着点`0`的`R`值`G`值`B`值`A`值, 前`40`位为`[R0, G0, B0, A0, .... , R9, G9, B9, A9]`.

![n_Recording_2021-02-18_at_6.08.54_PM.gif](/images/jueJin/37dc89987b65466.png)

注意看, 这个方块会变颜色的. 相信从这个demo你可以感受到这个API的强大之处, 试想这样的绘制需求, 如果用之前的drawline的API即使能够实现, 性能也必将大打折扣. 看着这个图不禁想起当年青奥会的吉祥物, 五彩腰子....

![](/images/jueJin/ed2f6fccb98f4ba.png)

深度缓冲
----

既然我们现在拥有了操纵画布上每一个像素的`RGBA`值能力, 再回到我们的需求上面来. 我们在按顺序绘制片元的时候是可以知道片元覆盖了哪些像素点, 也知道这些像素点的颜色值, 除此之外, 我们还需要得到这些像素点的`Z`值, 以便在之后绘制其他片元时如果像素点发生冲突(两个片元的绘制都需要对同一个像素点涂上颜色)可以轻易地判断二者的遮挡关系从而决定保留一方或者以某种算法混色(比如说近处的片元颜色是半透明时).

也即是说我们不能绘制一个片元便马上把它的颜色涂在画布上, 因为说不定之后绘制其他近处片元时这个颜色应该被覆盖, 因此我们需要一个暂存区不仅储存所有点的颜色值和存储该颜色点的Z值, 方便作深度比较. 这种暂存区域我们可以称之为片元绘制缓冲区, 当所有片元绘制结束时该区域可以被应用到画布上, 并清空该变量. 值得一提的是, 一般的三维渲染引擎为了效率和空间, 深度值也是有位数和精度限制的, 当精度不足时, 两个物体深度接近时便会产生深度冲突, 表现就是某些表面若隐若现地闪烁/穿模.[](https://link.juejin.cn?target=)

### 用缓冲区来绘制

我们的实现思路是, 首先不在片元绘制时填充画布, 而是先初始化`dataBuffer`变量和`depthBuffer`变量, 将点的色值推入, 并将该点的`Z`值推入`depthBuffer`变量, 之后推入颜色之前先对比`Z`值, 将Z值大的一方推入`dataBuffer`, 以此类推以确保`buffer`中的像素点都是`Z`值最大的留存下来. 直到所有片元颜色推入完毕, 则将`dataBuffer`应用到`canvas`上.

这里的改动比较大, 我们需要将之前绘制线与面的实现都更改才能满足该需求. 大致如下:

```javascript
    class Canvas extends GObject {
        constructor(canvas) {
        super(canvas)
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        // 初始化加多以下两行
        this.dataBuffer = new Uint8ClampedArray(this.w * this.h * 4)
        this.depthBuffer = new Array(this.w * this.h)
    }
    
    // 不变的方法先忽略
    
        drawline(v1, v2, color) {
        // 这里全要改, 怎么改之后再说
    }
    
        drawMesh(mesh, cameraIndex) {
        // 矩阵运算这些不变, 先不管, 省略
        
            indices.forEach(ind => {
            // 这里全要改, 怎么改之后再说
            })
            
            // 加多这一句
            ctx.putImageData(new ImageData(this.dataBuffer, this.w, this.h), 0, 0)
        }
    }
```

我们先加上`dataBuffer`的初始化, 并且在绘制的最后将`dataBuffer`应用到画布, 如此一来你会发现`canvas`变成空白了, 因为`putImageData`里是一个空的数据, 接下来我们便需要在`drawTriangle/drawLine`的实现里去改变`this.dataBuffer`从而使得模型的图像重回到画布上.

### 重新实现绘制点线面

为了达到上述目的我们重写了`drawPoint`和`drawLine`的实现, 在里面修改`dataBuffer`, 并且在`drawMesh`开始时`initBuffer`, 最后`putImageData`实现绘制.

```javascript
    class Canvas extends GObject {
        constructor(canvas) {
        super(canvas)
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        // 初始化加多以下两行
        this.initBuffer()
    }
    
        initBuffer() {
        this.dataBuffer = new Uint8ClampedArray(this.w * this.h * 4)
        this.depthBuffer = Array.from({ length: this.w * this.h }).map(() => -255535)
    }
    
        drawPoint(v, color) {
        const x = Math.round(v.x)
        const y = Math.round(v.y)
        const index = x + y * this.w
        
            if (v.z > this.depthBuffer[index]) {
            this.depthBuffer[index] = v.z
            this.dataBuffer[index * 4 + 0] = color.r
            this.dataBuffer[index * 4 + 1] = color.g
            this.dataBuffer[index * 4 + 2] = color.b
            this.dataBuffer[index * 4 + 3] = color.a
        }
    }
    
        drawLine(v1, v2, color) {
        const delta = v1.sub(v2)
        const deltaX = Math.abs(delta.x)
        const deltaY = Math.abs(delta.y)
        const len = deltaX > deltaY ? deltaX : deltaY
        
            for (let i = 0; i < len; i++) {
            const p = v1.interpolate(v2, i / len)
            this.drawPoint(p, color)
        }
    }
    
        drawMesh(mesh, cameraIndex) {
        this.initBuffer()
        
        const { indices, vertices } = mesh
        const transform = this.getTransform(mesh, cameraIndex)
        const ctx = this.ctx
        const color = Color.blue()
        
            indices.forEach((ind, i) => {
                const [v1, v2, v3] = ind.map(i => {
                return this.project(vertices[i], transform).position
                })
                
                this.drawLine(v1, v2, color)
                this.drawLine(v2, v3, color)
                this.drawLine(v3, v1, color)
                })
                
                ctx.putImageData(new ImageData(this.dataBuffer, this.w, this.h), 0, 0)
            }
        }
        
```

这里代码改动比较多, 读者可以打开`demo2.3`来查看代码和运行效果. 这里可以看到运行效果几乎和`demo1.3`相差无几, 但是由于我们的需求更复杂了, 因此使用更灵活的方式来进行渲染, 实现方式大不一样. 这个过程中, 笔者希望不是直接抛出最终的解决方案, 而是根据每一个阶段的目标需求, 采用最短的路径来实现, 最终需求升级才会采用更复杂的方案来满足更复杂的需求, 在这个过程中与读者一起探索并完成目标, 毕竟这更贴近于我们日常开发过程.

![Screen Recording 2020-10-26 at 12.49.57 AM (1).gif](/images/jueJin/48583267964945e.png)

### 绘制片元

仅仅绘制线框还是不能体现出采用缓存区绘制方案的优势, 接下来咱们又要开始绘制片元啦! 片元呢, 在我们这里的定义它是个三角形, 现在要做的就是找出三角形内部的所有点, 并调用`drawPoint`将它们都染上色.

这里要找到所有内部点的扫描方式有很多种, 读者也可以进行不同的尝试. 举个栗子, 方法一可以将三角形沿着`y`轴数值切割为多个高`1px`的水平长条, 方法二也可以在`BC`边上取点`D`并连接`AD`线段, 随着`D`在`AB`上的滑动, `AD`便会经过内部所有点完成扫描. 还有哪些扫描切割的方法效率更高的大家可以在评论区讨论哦.

这里我们便采用第一种方法"水平长条切割法".

```javascript
    drawTriangle(v1, v2, v3, color) {
    // 三个顶点根据Y值进行排序
    const [vUp, vMid, vDown] = [v1, v2, v3].sort((a, b) => a.y - b.y)
    // vUp和vDown连线被经过vMid的水平线切割的点, 称为vMag
    const vMag = vUp.interpolate(vDown, (vMid.y - vUp.y) / (vDown.y - vUp.y))
    
        for (let y = vUp.y; y < vDown.y; y++) {
            if (y < vMid.y) {
            // 三角形的上半部分
            const vUpMid = vUp.interpolate(vMid, (y - vUp.y) / (vMid.y - vUp.y))
            const vUpMag = vUp.interpolate(vMag, (y - vUp.y) / (vMag.y - vUp.y))
            this.drawLine(vUpMid, vUpMag, color)
                } else {
                // 三角形的下半部分
                const vDownMid = vDown.interpolate(vMid, (y - vDown.y) / (vMid.y - vDown.y))
                const vDownMag = vDown.interpolate(vMag, (y - vDown.y) / (vMag.y - vDown.y))
                this.drawLine(vDownMid, vDownMag, color)
            }
        }
    }
```

这里的逻辑不复杂, 但是需要一点几何知识, 难以理解的话最好画一个图出来方便理解. 这里三个顶点根据`Y`值进行排序, 依次为`vUp, vMid, vDown`. `vUp`和`vDown`连线被经过`vMid`的水平线切割的点, 称为`vMag`. 因此三角形被分割成两个, 分别是`vUp, vMid, vMag`, 和 `vDown, vMid, vMag`. 我们称为上三角和下三角. 各自用水平线扫描并`drawLine`, 最终完成颜色填充. ![n_Recording_2021-02-19_at_5.06.39_PM.gif](/images/jueJin/5efffef10ebc495.png)

### 深度冲突

这里我们可以看到相比于`demo2.1`, 这里的片元遮挡关系已经是正确的了. 细心地同学会注意到这里有个令人很不舒服的现象, 边框线若隐若现不停闪烁. 为什么会这样呢?

因为在现实中是不存在边框线的, 而且我们绘制边框线的方式实际上是把顶点相连, 这样边框线便会和片元的边缘完全重合, 那完全重合时应该呈现谁的颜色呢? 这就取决于计算的精度, 有的点边框在前, 有的点片元在前, 因此边框线变成了虚线, 一旦旋转起来就会一闪一闪的了.

这里我们的需求其实是期望一同绘制的元素(片元或者边框线)如果z数值相差不大的情况下要么完全被遮挡要么完全不被遮挡, 不希望闪烁或者续断. 因此我做了简单的处理, 在判断z值时提供一个阈值, 使得先绘制的元素不容易被遮挡, 当然这不是最完美的解法, 大家也可以在评论区讨论一下如何更好解决.

```javascript
    drawPoint(v, color) {
    const x = Math.round(v.x)
    const y = Math.round(v.y)
    const index = x + y * this.w
    
    // 这里的魔数便是解决深度冲突的方式之一
        if (v.z > this.depthBuffer[index] + 0.0005) {
        this.depthBuffer[index] = v.z
        this.dataBuffer[index * 4 + 0] = color.r
        this.dataBuffer[index * 4 + 1] = color.g
        this.dataBuffer[index * 4 + 2] = color.b
        this.dataBuffer[index * 4 + 3] = color.a
    }
}
```

最后, 展示一下解决完深度冲突之后的`demo`效果吧. (可以在`github`仓库`2.4demo`查看代码和运行效果)

![n_Recording_2021-02-19_at_5.16.09_PM.gif](/images/jueJin/b6e1cabec1624b0.png)

至此我们完成了片元着色器的简单实现, 这里其实理想化了很多细节, 例如整个片元的颜色都是统一的, 现实情况里主要是用贴图进行填充, 这种情况下便需要取色和颜色插值处理. 因此这还不是一个完整的着色器, 这些我们将在这个系列里接下来的章节去一起探索和学习, 尽情期待吧.

小结
==

总结一下本节, 本节我们基于之前的线框渲染器demo尝试进行片元的颜色填充, 在这个过程中简单的尝试发现了遮挡关系无法正确表达, 思考问题的本质之后找到了操纵像素的API, 并利用缓冲区和深度缓冲进行遮挡关系的处理, 最终完成了片元的简单渲染.

![image.png](/images/jueJin/9fc1e3f273f947b.png)

既然看到这里了, 何不起身打开电脑对着这个github仓库一阵克隆, 将纸上得来变成躬身练习, 相信会有更好的学习效果.

github仓库地址：[github.com/ShaojieLiu/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FShaojieLiu%2F3dRender "https://github.com/ShaojieLiu/3dRender")

由于篇幅的限制, 本节接近尾声了. 其实比我预想中进展的要慢, 接下来还有很多东西要讲, `3D`文件数据格式解析/贴图/光照 等等. 通过上一篇与读者在评论区互动发现之前很多东西讲得不够细致和透彻, 因此这次放慢了节奏, 包括操纵元素也可以花了一个`demo`来进行讲解演示. 期望能对大家有所帮助.

本文是否对你有帮助呢? 无论你是早就知道, 还是一看就透, 亦或是云里雾里还是先马后看, 欢迎点赞收藏关注, 感谢各位父老乡亲. 有不严谨之处欢迎讨论指正, 感谢.