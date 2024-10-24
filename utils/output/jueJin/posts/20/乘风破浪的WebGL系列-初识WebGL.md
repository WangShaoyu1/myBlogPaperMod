---
author: ""
title: "乘风破浪的WebGL系列-初识WebGL"
date: 2020-09-22
description: "在前端领域我们可以通过四种方式来绘制图形，包括 HTML+CSS、SVG、Canvas2d 还有 WebGL，其中 WebGL 属于非常少用的一种绘图方式，尽管如此，其却有着无可替代的位置。接下来，让我们从这四种绘图方式开始，来了解下 WebGL 吧。 HTML+CSS 是最常…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:107,comments:0,collects:131,views:9497,"
---
> 希沃ENOW大前端
> 
> 公司官网：CVTE(广州视源股份)
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：** ![](/images/jueJin/f66e10cdf77c499.png)

初识 WebGL
========

在前端领域我们可以通过四种方式来绘制图形，包括 HTML+CSS、SVG、Canvas2d 还有 WebGL，其中 WebGL 属于非常少用的一种绘图方式，尽管如此，其却有着无可替代的位置。接下来，让我们从这四种绘图方式开始，来了解下 WebGL 吧。

[](https://link.juejin.cn?target=)

前端图形绘制的四种方式
-----------

[](https://link.juejin.cn?target=)

### HTML+CSS

HTML+CSS 是最常用的绘制图形方式，其操作简单，一般情况下性能也很好，利用 Dom 事件可以对图形进行事件绑定，然而在处理复杂的、不规则的图形时则没有那么方便。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

[](https://link.juejin.cn?target=)

### SVG

SVG 是一种基于 XML 语法的图像格式，因此具有 HTML 事件绑定的特点。SVG 还提供了丰富的封装，可以很方便地实现矩形、圆形、贝塞尔曲线等图形。同时其内置了多种滤镜特效，相对于 HTML+CSS 的方式，SVG 可以非常方便快捷地实现复杂的不规则形体。同时 SVG 可以随意放大缩小而不会失真。当然 SVG 始终是基于 Dom 节点的，因此节点数量多的话，渲染性能也会降下来。  
![svg-anim-low.gif](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

[](https://link.juejin.cn?target=)

### Canvas2d

Canvas2d 是通过 JavaScript 指令进行动态绘图，因此有非常灵活的逻辑处理能力，可以实现保存、恢复画布状态等操作。同时 Canvas 可以做到像素级操作，因此可以实现更多酷炫的效果，例如各种图片滤镜效果。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
相对于 SVG 需要操作多个 HTML 标签，Canvas2d 只需要操作一个 Canvas 标签，因此在绘制相同的复杂图形时，Canvas2d 性能会更好一点。如下图所示，随着图形面积的增大，Canvas2d 渲染的耗时会变得越来越大，而随着场景中元素的不断增加，Canvas2d 渲染耗时相对于 SVG 增长的没那么明显。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

[](https://link.juejin.cn?target=)

### WebGL

上面三种绘图方式，都是进行 2d 图形处理，在 3d 处理上，最早前只能通过 Flash 或者 SilverLight 等浏览器插件来实现，WebGL 标准的出现使得我们可以通过一种更统一、更标准的方式绘制 3d 图形。简单地说，WebGL 是使用 Javascript 语言的 OpenGL ES，同时它是在 HTML 的 Canvas 元素中绘制图形。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
除了绘制 3d 图形外，WebGL 借助其能够直接调用底层接口，实现硬件加速的特性，WebGL在 2d 图形绘制上相比 Canvas2d 有着更好的性能表现。如下，使用相同算法实现图片溶解出现效果，图一为 Canvas2d 方案，而图二为 WebGL 方案，通过观察 FPS 值可以看到 WebGL 方案相对更加流畅一点。  
![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58) ![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
对于 HTML/CSS、SVG 和 Canvas，我们不需要关心它们具体的底层机制，可直接使用其提供的标签和 API 来绘制图形，比如我们只要理解创建 SVG 元素的绘图声明，学会执行 Canvas 对应的绘图指令，就能够将图形输出。但是 WebGL 只能够绘制点、线段、三角形等基本图元，想要利用 WebGL 完成更复杂任务，需要你提供合适的代码，组合使用点，线和三角形等代替实现。因此要使用 WebGL 绘图，我们必须要深入细节里。换句话说就是，我们必须要和内存、GPU 打交道，真正控制图形输出的每一个细节。  

[](https://link.juejin.cn?target=)

图形基础
----

[](https://link.juejin.cn?target=)

### 图形系统

图形系统主要分为 6 个主要元素，分别是输入设备、CPU、GPU、存储器、帧缓存和输入设备。  
![图形系统组成.jpg](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
其中 CPU 主要负责要负责加载并准备好场景数据、设置材质，纹理，光源属性等渲染状态、渲染基础图形单元，同时负责想 GPU 发送指令。  
GPU 接收 CPU 的指令进行图形的绘制，通过顶点处理和片元处理等操作，生成像素阵列输入到帧缓存。  
帧缓存用于存放像素，正缓存中像素的数目叫做分辨率，帧缓存的深度表示每个像素所用的比特数，其决定了一个系统可以表示多少种颜色，例如深度为 8 比特的帧缓存可以表示 256（2^8）种颜色。  
![framebuffer.jpg](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)[](https://link.juejin.cn?target=)

### 图形绘制流水线

具体到图形的渲染流程，则称为渲染管线，渲染管线主要包括两个功能：一是将物体3D坐标转变为屏幕空间2D坐标，二是为屏幕每个像素点进行着色，渲染管线的一般流程如下图所示。分别是：顶点处理、裁剪和图元组装、光栅化、处理。  
![图形绘制流水线.jpg](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
顶点处理：该过程主要是对顶点进行坐标转换，把对象从其被定义的坐标系下的表示转换成照相机下的坐标系。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
图元组装和裁剪：图元组装是指将顶点组合生成一个个图元（点/线/三角形），裁剪是指将视口之外的对象进行裁剪，裁剪针对的是逐个片元而不是逐个顶点。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
  
光栅化：由裁剪模块得到的图元数据为了生成帧缓存中的像素，还必须做进一步的处理。光栅化其实是一种将几何图元变为二维图像的过程。该过程包含了两部分的工作。第一部分工作：决定窗口坐标中的哪些整型栅格区域被基本图元占用；第二部分工作：分配一个颜色值和一个深度值到各个区域。光栅化过程产生的是片元。  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
片元处理：该阶段主要是通过片元着色器来计算片元的最终颜色和深度值，同时通过深度测试和模板测试来判断当前片元是否可见，如果片元通过测试，那它就可以被直接绘制到帧缓存中了。![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

[](https://link.juejin.cn?target=)

WebGL 程序
--------

一段完整的 WebGL 程序，至少包括 HTML、JavaScript 和 OpenGL 着色器代码（GLSL），其中 HTML 代码主要提供一个 Canvas 画布；JavaScript 用来获取 WebGL 的上下文，对模型顶点的坐标、颜色等信息进行处理，并将这些处理好的数据传递给 GPU ；GLSL 是一种类 C 的着色器编程语言，主要包括两大部分，即顶点着色器和片元着色器。下面我们通过一个绘制三角形的 WebGL 的示例，来了解一下 WebGL 程序吧。  

1.  声明一个 Canvas 画布

```html
<canvas id="webgl" width="500" height="300" style="border: 1px solid;"></canvas>
```

2.  获取 WebGL 上下文

```javascript
// 和 canvas2D 一样，先获取 webgl 上下文
const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");
```

3.  编写顶点着色器代码和片元着色器代码

```javascript
//　着色器源码
const vertexShaderSource = `
// 声明一个属性变量 a
attribute vec3 a;
    void main() {
    // 顶点在作色器处理后的位置信息
    gl_Position = vec4(a, 1.0);
}
`;

const fragmentShaderSource = `
    void main() {
    // 片段颜色
    gl_FragColor = vec4(0.1, 0.7, 0.3, 1.0);
}
`;
```

4.  声明使用着色器代码

```javascript
// 初始化着色器方法
    function initShader(gl, vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // 将着色器源码附加到着色器上
    gl.shaderSource(vertexShader, vertexSource);
    gl.shaderSource(fragmentShader, fragmentSource);
    
    // 编译着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // 创建一个程序对象
    const program = gl.createProgram();
    // 将编译好的着色器附加到程序对象上
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接程序对象
    gl.linkProgram(program);
    // WebGL引擎使用该程序对象
    gl.useProgram(program);
    
    return program;
}

const program = initShader(gl, vertexShaderSource, fragmentShaderSource);
```

5.  传入顶点数据到顶点着色器

```javascript
    function sendDataToSharder(gl, data) {
    // 将顶点数据写入缓存区，并将数据传递给顶点着色器
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    var vertexAttribLocation = gl.getAttribLocation(program, "a");
    gl.vertexAttribPointer(vertexAttribLocation, 3, gl.FLOAT, false, 0, 0);
    // 设置通过顶点着色器将缓冲的输入数据转换为一系列顶点数组
    gl.enableVertexAttribArray(vertexAttribLocation);
}

// 定义顶点数据，这里定义了三角形的三个顶点坐标，以中心点为坐标原点，z 轴为 0
var data = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
sendDataToSharder(gl, data);
```

6.  绘制图形

```javascript
// 绘制缓冲数组
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

最终绘出来的三角形效果如下：  
![image.png](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  
演示地址：[codesandbox.io/s/draw-tria…](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdraw-triangle-for-article-4opcr "https://codesandbox.io/s/draw-triangle-for-article-4opcr")  
  
到此，相信大家对 WebGL 应该有了一个简单的认识了，关于如何写自己的着色器我会在下一篇文章展开讲解，可以期待下！  
  
参考资料：

1.  极客时间《跟月影学可视化》-图形基础篇 [time.geekbang.org/column/intr…](https://link.juejin.cn?target=https%3A%2F%2Ftime.geekbang.org%2Fcolumn%2Fintro%2F320 "https://time.geekbang.org/column/intro/320")
2.  交互式计算机图形学——基于WEBGL的自顶向下方法（第7版）
3.  OpenGL编程指南（第8版）
4.  掘金小册《WebGL 入门与实践》[juejin.cn/book/684473…](https://juejin.cn/book/6844733755580481543 "https://juejin.cn/book/6844733755580481543")