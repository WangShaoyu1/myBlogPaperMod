---
author: "政采云技术"
title: "浅谈 Canvas 对象识别的方法——射线法"
date: 2024-05-16
description: "在 Web 开发中，Canvas 标签作为一个强大的绘图工具，被广泛应用于图形渲染、游戏开发等领域。"
tags: ["前端","Canvas中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:15,comments:0,collects:19,views:3661,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![作者卡片](/images/jueJin/96506fa77508426.png) 在 Web 开发中，Canvas 标签作为一个强大的绘图工具，被广泛应用于图形渲染、游戏开发等领域。**Echarts** 的底层渲染也是基于 Canvas 实现，然而，与常规的 HTML 元素不同，Canvas 本身并不支持直接的事件监听和触发机制，这给开发者带来了一些挑战。在本文中，我们将探讨如何在 Canvas 中实现事件触发机制。

浅谈 Canvas 对象识别的方法——射线法
----------------------

1\. 前言
======

首先，让我们回顾一下 Canvas 的特性。Canvas 标签提供了一个用于绘制图形的矩形区域，并通过 JavaScript 的绘图 API 来操作其中的图形元素。然而，与 Svg 等矢量图形不同，Canvas 绘制的图形是被视为位图，因此无法直接通过 DOM 元素来触发事件。

1.1 Canvas
----------

**概念：Canvas** 标签，在 JavaScript 创建画布，更偏向于渲染层，能够提供底层图形渲染 API。

**特性：** 在实际业务场景中，Canvas 的**简单操作和高效的渲染能力**是它的优势，但是**它的缺点是不能方便的控制它内部的元素，另外一个缺点是依赖于分辨率。** 主要特性如下：

*   **底层绘图 API**：Canvas 提供了底层的绘图 API，允许开发者直接操作像素进行绘图，相比 Svg，Canvas 的绘图更灵活、更高效。
    
*   **整体视图**：Canvas 绘制的图形在页面上被视为一个整体，无法直接操作图形的各个部分，适合于静态图形展示。
    
*   **像素级控制**： 通过 Canvas，开发者可以直接操作像素进行绘制，实现各种复杂的绘图效果，包括渐变、阴影、图像处理等。
    
*   **动态交互**：Canvas 可以实现动态的图形交互效果，如响应鼠标事件、键盘事件等，使用户可以与图形进行交互。
    
*   **适用性广泛**： 由于 Canvas 提供了底层的绘图 API，因此适用于绘制各种类型的图形，包括游戏图形、数据可视化图表、图像编辑等。 **使用场景:**
    
*   **数据可视化**：Canvas 可以用来创建图表、图形和数据可视化，例如绘制折线图、柱状图、饼图等，以便更直观地展示数据。
    
*   **游戏开发**：Canvas 提供了绘制 2D 和 3D 图形的能力，因此广泛应用于网页游戏和交互式媒体的开发中。开发者可以使用 Canvas 实现动画效果、碰撞检测等游戏功能。
    
*   **图像处理**：Canvas 可以用来对图像进行处理，例如裁剪、旋转、缩放、滤镜效果等。这对于在线图片编辑工具和图像处理应用程序非常有用。
    
*   **绘制工具**：Canvas 可以用来创建在线绘图工具，如画板、涂鸦应用程序等，用户可以通过 Canvas 在网页上绘制图形、写字等。
    

1.2 Echarts
-----------

Canvas 是 HTML5 中的一个重要元素，用于通过 JavaScript 脚本来绘制图形、动画等。而 Echarts 是一个基于 Canvas 或者 Svg 的可视化图表库，能够帮助开发者在 Web 页面中轻松创建各种各样的图表。

**Echarts 的优势：**

*   简单易用：Echarts 提供了简洁的 API，使得创建图表变得非常容易。
    
*   丰富的图表类型： 支持折线图、柱状图、饼图、散点图等各种常见图表类型，以及热力图、地图等特殊类型。
    
*   交互性： 支持丰富的交互功能，如数据筛选、数据缩放、图表联动等。 **Canvas 和 Echarts 结合的场景：**
    
*   自定义图表： 当 Echarts 提供的默认图表类型无法满足需求时，可以借助 Canvas 在 Echarts 图表的基础上进行二次开发，实现更加个性化的效果。
    
*   图表优化： 对于一些需要大量数据处理或者特殊动画效果的场景，可以利用 Canvas 直接操作像素来提升图表的性能和体验。
    
*   复杂交互： 当需要实现复杂的交互功能，如拖拽、放大缩小、自定义动画等时，可以结合 Canvas 和 Echarts 的事件机制来实现。
    

1.3 完整案例
--------

下面案例演示了如何使用 Canvas 绘制一个新的图形，并使用 Echarts API 动态更新图表数据以实现内容更改，以更好的理解Canvas和Echart使用方式以及事件触发机制。

![图片](/images/jueJin/d201f744e57e4e4.png)

```xml
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Change ECharts Content with Canvas</title>
<!-- 引入 ECharts 库 -->
<script src="https://cdn.staticfile.org/echarts/4.8.0/echarts.min.js"></script>
</head>
<body>

<!-- 创建一个 div 作为 ECharts 容器 -->
<div id="main" style="width: 600px; height: 400px;"></div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
    // 初始化 ECharts 实例
    var myChart = echarts.init(document.getElementById('main'));
    
    // 创建一个新的 Canvas 元素并绘制图形
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    // 绘制自定义图形（示例：绘制一个红色的圆）
    ctx.beginPath();
    ctx.arc(300, 200, 100, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
    
    // 将 Canvas 插入到 ECharts 图表中
    var img = new Image();
    img.src = canvas.toDataURL();
    
    // 将 Canvas 图形绘制到 ECharts 图表中
        myChart.setOption({
            graphic: [{
            id: 'canvas',
            type: 'image',
                style: {
                image: img,
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height
            }
            }],
                xAxis: {
                type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
                yAxis: {
                type: 'value'
                },
                    series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }]
                });
                
                // 点击 Canvas 图形时更新 ECharts 图表数据
                    myChart.getZr().on('click', function(params) {
                    var point = [params.offsetX, params.offsetY];
                    var option = myChart.getOption();
                    var xAxisData = option.xAxis[0].data;
                    var yAxisData = option.series[0].data;
                    
                    // 点击了 Canvas 图形内部时，修改图表数据
                        if (ctx.isPointInPath(point[0], point[1])) {
                        // 修改 xAxis 数据
                        xAxisData.push('New Day');
                        // 修改 yAxis 数据
                        yAxisData.push(180);
                        
                        // 更新图表数据
                            myChart.setOption({
                                xAxis: {
                                data: xAxisData
                                },
                                    series: [{
                                    data: yAxisData
                                }]
                                });
                            }
                            });
                            });
                            </script>
                            
                            </body>
                            </html>
```

2.Canvas 对象识别方法
===============

**Echarts** 的底层渲染时基于 Canvas 实现，但是 Canvas 只是一个画布，并不能为画出来的位图添加事件监听，这一点和 Svg 矢量图不同。

针对 Canvas 中事件触发的优化，我们可以采用以下几种方法：

1.  **事件委托：** 通过监听 Canvas 容器的鼠标事件，根据鼠标坐标与绘制图形的位置关系，手动触发相应图形的事件处理函数。这种方法需要在代码中进行坐标计算，较为复杂，但适用于简单的场景。
2.  **碰撞检测：** 在 Canvas 中，可以通过碰撞检测的方式来判断鼠标是否与绘制图形相交，从而触发相应的事件。这种方法适用于需要精确检测图形碰撞的场景，但对于复杂的图形或大规模绘制的情况，性能可能会受到影响。
3.  **虚拟画布：** 将 Canvas 绘制的图形元素以及其位置信息保存在一个虚拟的画布上，并在用户交互时根据鼠标坐标来判断其是否在图形范围内。这种方法可以减少事件触发时的计算量，提高性能，但需要额外的内存空间来存储画布信息。
4.  **第三方库：** 利用一些封装了事件处理逻辑的第三方库，如 Konva.js、Fabric.js 等，来简化事件触发的处理过程。这些库提供了丰富的 API 和功能，可以快速实现复杂的交互效果，但需要额外学习和引入库文件。 因此 Echarts 针对 Canvas 实现了一套事件机制，实现原理采用的是**虚拟画布**的方式，基本的思想是将绘制的元素位置存储起来，当鼠标进入到绘制的图像区域时触发相应的事件。

问题关键在于，如何确定鼠标是否在指定元素区域，因此问题转化成了：**判断一个点是否在一个复杂多边形的内部**

在 GIS 中，判断一个坐标是否在多边形内部是个经常要遇到的问题。乍听起来还挺复杂。根据 W. Randolph Franklin 提出的 PNPoly 算法，只需区区几行代码就解决了这个问题。

2.1 射线法
-------

**射线法**作为判断点是否在多边形内部的一种常用方法，具有简单直观、计算效率高、适用性广泛和易于优化等优点，因此在实际应用中得到了广泛的应用和推广。

![图片](/images/jueJin/ff477e370e5d4a8.png) 射线法就是以判断点开始，向右（或向左）的水平方向作一射线，计算该射线与**多边形每条边的**交点个数，如果交点个数为奇数，则点位于多边形内，偶数则在多边形外。该算法对于复合多边形也能正确判断。

![图片](/images/jueJin/3b6171cedddf4c5.png) 接下来判断由起点出发的射线是否穿过这条边，**问题关键在于判断直线与边的交点是在起点的左边还是右边。** 这个一个十分简单的高中数学问题。

**问: 已知直线 l，直线上两点 p1，p2，和直线外一点 p，求过点 p 的水平直线与直线 l 的交点？**

解题思路也很简单，y=kx+b,利用 p1,p2,求出直线方程，带入纵坐标，求出横坐标，最后与点 p 比较大小即可。

### 2.1.1 判断是否与通过点p的直线相交

```javascript
(p1[1] < p[1] && p2[1] >= p[1]) || (p2[1] < p[1] && p1[1] >= p[1]))
```

假设 p1, p2 分别表示多边形一条边的两个顶点，p 表示当前鼠标的坐标点，表示 L1=（p1，p2），其中 p1=\[x1,y1\]，p2=\[x2,y2\]，通过上述表达式可以判断出通过 p 点的平行线是否有可能与边L1相交，过滤出如下所示的不想交的情况。 ![图片](/images/jueJin/ae49c9f47d77478.png)

### 2.1.2 判断是否与通过点 p 的射线相交

通过第一步的判断，能够保证过点p的平行线能够线段 L1 相交，但是不能保证过点 p 的平行射线与边 L 相交，因此存在以下两种情况，即边 L 在点 p 点的左侧还是右侧，如下图所示。

![图片](/images/jueJin/482566edf45840b.png) 只需根据 p1，p2 两点求出直线方程式，然后带入 p\[0\]，将得到的值与 p\[1\] 比较，如果大于 p\[1\] 则说明在 p 点的右侧，如果小于 p\[1\] 则说明在 p 点的左侧，判断表达式如下：

```javascript
p[0] - p1[0]) / (p2[0] - p1[0]) * (p2[1] - p1[1]) + p1[1] < p[1]
```

我们只需要找出所有在 p 点左侧的坐标点的数量，如果是奇数则说明 p 点在多边形内部，否则在多边形外部。

### 2.1.3 核心代码

核心代码实现如下，该方法通过依次遍历多边形的每一个顶点，来判断当前的鼠标位置是否在多边形内部，通过两层核心的 if 语句来判断射线是否与边相交,入参 arr 标识多边形的每一个顶点坐标，p 表示目前鼠标的所在位置坐标.

```javascript
    function calculate(arr, p) {
    
    let count = arr.length;
    
    let result = false;
    
        for (let i = 0, j = count - 1; i < count; i++) {
        
        let p1 = arr[i];
        
        let p2 = arr[j];
        
            if ((p1[0] < p[0] && p2[0] >= p[0]) || (p2[0] < p[0] && p1[0] >= p[0])) {
            
                if ((p[0] - p1[0]) / (p2[0] - p1[0]) * (p2[1] - p1[1]) + p1[1] < p[1]) {
                
                result = !result;
            }
            
        }
        
        j = i;
        
    }
    
    return result;
    
}
```

2.2 完整案例
--------

下面案例演示了如何使用 Canvas 绘制多个多边形，当鼠标进入某个多边形时，改多边形填充颜色否则不填充，以更好的理解canvas的对象识别方法，射线法。

![图片](/images/jueJin/1eb9e103783c4af.png)

```xml
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>Title</title>

</head>

<style>
    #Canvas {
    
    margin-top: 20px;
    
    background: #639fb9;
    
}
</style>

<body>

<div>

<Canvas id="Canvas" width="600px" height="500px">您的浏览器不支持 Canvas</Canvas>

</div>

</body>

<script>

const arr1 = [[649, 228], [733, 215], [825, 220], [974, 296], [1036, 416], [1015, 512], [968, 562], [898, 574], [874, 518], [794, 478], [717, 478], [713, 378], [680, 306]];

const arr2 = [[393, 404], [401, 353], [507, 256], [650, 229], [713, 378], [715, 476], [576, 447], [449, 481]];

const arr3 = [[424, 663], [546, 637], [679, 669], [647, 723], [575, 753], [472, 747], [427, 665]];

const arr4 = [[392, 407], [338, 504], [347, 557], [335, 590], [387, 665], [423, 664], [546, 638], [543, 585], [484, 516], [449, 482]];

const arr5 = [[450, 483], [544, 587], [547, 637], [679, 668], [811, 660], [888, 613], [898, 575], [873, 520], [794, 481], [716, 477], [577, 447]];

const scale = 0.5; //缩放倍数

    arr1.map((item => {
    
    item[0] *= scale;
    
    item[1] *= scale;
    
    }))
    
        arr2.map((item => {
        
        item[0] *= scale;
        
        item[1] *= scale;
        
        }))
        
            arr3.map((item => {
            
            item[0] *= scale;
            
            item[1] *= scale;
            
            }))
            
                arr4.map((item => {
                
                item[0] *= scale;
                
                item[1] *= scale;
                
                }))
                
                    arr5.map((item => {
                    
                    item[0] *= scale;
                    
                    item[1] *= scale;
                    
                    }))
                    
                    const c = document.getElementById("Canvas");
                    
                    const ctx = c.getContext("2d");
                    
                        function draw() {
                        
                        fillArea(-1);
                        
                    }
                    
                    // 当前阶段为填充其他都不填充
                    
                        function fillArea(areaNumber) {
                        
                        const arr = [arr1, arr2, arr3, arr4, arr5];
                        
                            for (let i = 0; i < arr.length; i++) {
                            
                            ctx.beginPath();
                            
                            ctx.strokeStyle = 'rgb(248,248,248)'
                            
                            ctx.moveTo(arr[i][0], arr[i][1]);
                            
                                for (let point of arr[i]) {
                                
                                ctx.lineTo(point[0], point[1]);
                                
                            }
                            
                            ctx.font = "14px bold 黑体";
                            
                            ctx.fillStyle = 'rgb(0,2,1)';
                            
                            ctx.fillText(i, arr[i][0] + 20, arr[i][1] + 20);
                            
                            ctx.closePath();
                            
                            ctx.stroke();
                            
                            ctx.fillStyle = areaNumber === i + 1 ? 'rgb(14,122,49)' : 'rgb(225,216,216)'; // 红
                            
                            ctx.fill();
                            
                        }
                        
                    }
                    
                    draw()
                    
                    Canvas.addEventListener('mousemove', MoveArea)
                    
                        function MoveArea(e) {
                        
                        let areaNumber = 0;
                        
                        // 判断在区域里面
                        
                        let p = [e.offsetX, e.offsetY];
                        
                            if (calculate(arr1, p)) {
                            
                            areaNumber = 1;
                            
                                } else if (calculate(arr2, p)) {
                                
                                areaNumber = 2;
                                
                                    } else if (calculate(arr3, p)) {
                                    
                                    areaNumber = 3;
                                    
                                        } else if (calculate(arr4, p)) {
                                        
                                        areaNumber = 4;
                                        
                                            } else if (calculate(arr5, p)) {
                                            
                                            areaNumber = 5;
                                            
                                            } else areaNumber = -1;
                                            
                                            // console.log(calculate(arr1, [434, 168]))
                                            
                                            fillArea(areaNumber);
                                            
                                            console.log(areaNumber)
                                            
                                        }
                                        
                                        console.log(arr1)
                                        
                                        // 判断鼠标是否在这个区域里面
                                        
                                            function getMoveArea(p, arr) {
                                            
                                            let result = false;
                                            
                                            let start = arr[arr.length - 1];
                                            
                                                for (let i = 0; i < arr.length; i++) {
                                                
                                                let end = arr[i];
                                                
                                                    if ((start[0] < p[0] && end[0] >= p[0]) || (start[0] > p[0] && end[0] <= p[0])) {
                                                    
                                                    result = !result;
                                                    
                                                }
                                                
                                                start = end;
                                                
                                            }
                                            
                                            return result;
                                            
                                        }
                                        
                                            function calculate(arr, p) {
                                            
                                            let count = arr.length;
                                            
                                            let result = false;
                                            
                                                for (let i = 0, j = count - 1; i < count; i++) {
                                                
                                                let p1 = arr[i];
                                                
                                                let p2 = arr[j];
                                                
                                                    if ((p1[0] < p[0] && p2[0] >= p[0]) || (p2[0] < p[0] && p1[0] >= p[0])) {
                                                    
                                                        if ((p[0] - p1[0]) / (p2[0] - p1[0]) * (p2[1] - p1[1]) + p1[1] < p[1]) {
                                                        
                                                        result = !result;
                                                    }
                                                    
                                                }
                                                
                                                j = i;
                                                
                                            }
                                            
                                            return result;
                                            
                                        }
                                        
                                        </script>
```

3.参考文献
======

1.  [Canvas与svg的比较 - 走看看 (zoukankan.com)](https://link.juejin.cn?target=http%3A%2F%2Ft.zoukankan.com%2Fgyix-p-10121426.html "http://t.zoukankan.com/gyix-p-10121426.html")
2.  [www.cnblogs.com/anningwang/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fanningwang%2Fp%2F7581545.html "https://www.cnblogs.com/anningwang/p/7581545.html")
3.  [blog.csdn.net/libaineu200…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Flibaineu2004%2Farticle%2Fdetails%2F102940607 "https://blog.csdn.net/libaineu2004/article/details/102940607")