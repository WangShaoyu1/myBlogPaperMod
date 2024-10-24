---
author: "政采云技术"
title: "了解 ZRender 和 Echarts"
date: 2023-04-12
description: "前言 ZRender 是二维绘图引擎，是轻量级的 Canvas 类库，它提供 Canvas、SVG、VML 等多种渲染方式，它可以用于绘制各种图形，包括线条、矩形、圆形、多边形等。ZRender 也是"
tags: ["前端","Chart.js","ECharts中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:29,comments:0,collects:25,views:6302,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png)

![予棈.png](/images/jueJin/24552ba337e4457.png)

> 想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[了解ZRender](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2Fblog%2Farticle%2Fzrender "http://zoo.zhengcaiyun.cn/blog/article/zrender")

### 前言

[ZRender](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fecomfe%2Fzrender "https://github.com/ecomfe/zrender") 是二维绘图引擎，是轻量级的 Canvas 类库，它提供 Canvas、SVG、VML 等多种渲染方式，它可以用于绘制各种图形，包括线条、矩形、圆形、多边形等。ZRender 也是 [ECharts](https://link.juejin.cn?target=http%3A%2F%2Fecharts.baidu.com%2F "http://echarts.baidu.com/") 的渲染器。在ZRender的基础上开发的专门用于可视化数据的库，它提供了很多预定义的图表类型，如折线图、柱状图、散点图、饼图等，同时还支持动态更新数据和交互事件。

### 一、ZRender

#### 1\. ZRender 的特性

ZRender 提供了以下主要特性：

0.  轻量级：ZRender 是一个轻量级的绘图库，它的代码大小只有 100KB 左右，可以快速地加载并运行。
1.  高性能：ZRender 可以在大规模数据的情况下保持高性能，能够支持高速绘制大量的图形元素。
2.  易扩展：ZRender 提供了一系列的扩展机制，可以方便地添加新的图形元素、渲染器和事件处理器等。
3.  多种图形元素支持：ZRender 支持多种图形元素，包括线段、矩形、圆形、文本、图片、路径等，可以满足各种绘图需求。
4.  多种渲染器支持：ZRender 支持多种渲染器，包括 Canvas 渲染器、SVG 渲染器和 WebGL 渲染器等。
5.  丰富的事件处理机制：ZRender 提供了丰富的事件处理机制，可以方便地处理用户交互事件，包括鼠标点击、鼠标移动、键盘事件等。

ZRender 的优势 相比于其他绘图库，ZRender 具有以下优势：

0.  性能优越：ZRender 能够快速地绘制大量的图形元素，具有较高的性能，可以满足大规模数据的绘图需求。
1.  扩展性强：ZRender 提供了丰富的扩展机制，可以方便地添加新的图形元素、渲染器和事件处理器等，具有很强的灵活性。
2.  使用方便：ZRender 的 API 简单易懂，使用方便，可以快速上手。
3.  跨平台支持：ZRender 支持多种渲染器，可以在不同的平台上运行，具有很好的跨平台支持性。

#### 2\. 基本用法

##### 2.1 安装 ZRender

```css
npm install zrender --save
```

##### 2.2 创建画布

在这个例子中，我们创建了一个 div 元素，并将其添加到页面中。然后使用 ZRender 的 init 方法初始化画布，将其赋值给变量 zr。

```ini
const canvas = document.createElement('div');
document.body.appendChild(canvas);
​
const zr = zrender.init(canvas);
```

##### 2.3 绘制图形

ZRender 可以绘制各种图形，例如矩形、圆形、文本等。在这个例子中，我们创建了一个矩形对象，设置其坐标、宽度、高度和填充颜色，并通过 zr.add 方法将其添加到画布中。下面是绘制一个矩形的代码示例：

```php
    const rect = new zrender.Rect({
        shape: {
        x: 100,
        y: 100,
        width: 400,
        height:300,
        },
            style: {
            fill: "green",
            stroke: 'black',
            lineWidth:3
        }
        });
        ​
        zr.add(rect);
```

![](/images/jueJin/5880f3d7a50e4bd.png)

##### 2.4 修改图形元素属性

```arduino
    const rect = new zrender.Rect({
        shape: {
        x: 100,
        y: 100,
        width: 400,
        height:300,
        },
            style: {
            fill: "green",
            stroke: 'black',
            lineWidth:5
        }
        });
        ​
        zr.add(rect);
        console.log(rect.shape.width); // 400
            rect.attr('shape', {
            width: 50 // 只更新 width。其余将保持不变。对于组或者整个zrender对象重绘调用dirty()方法触发
            });
```

![](/images/jueJin/8d59ab819ede406.png)

##### 2.5 实现交互效果

ZRender 提供了事件系统，可以方便地实现交互效果。在这个例子中，我们为矩形添加了一个点击事件，在点击矩形时会打印出一条消息。例如，我们可以为矩形添加点击事件：

```php
    const rect = new zrender.Rect({
        shape: {
        x: 100,
        y: 100,
        width: 400,
        height:300,
        },
            style: {
            fill: "green",
            stroke: 'black',
            lineWidth:5
        }
        });
        ​
        ​
        rect.on('click', () => { //.off()取消绑定事件
        console.log('rect clicked');
        });
        ​
        zr.add(rect);
```

![](/images/jueJin/6621ad8e143b472.png)

##### 2.6 绘制柱状图

```ini
const zr = zrender.init(chartRef.current);
​
const rectWidth = 30;
const rectGap = 10;
const rectCount = data.length;
​
const maxData = Math.max(...data);
const rectHeight = 200;
​
    for (let i = 0; i < rectCount; i++) {
        const rect = new zrender.Rect({
            shape: {
            x: i * (rectWidth + rectGap),
            y: rectHeight - data[i] / maxData * rectHeight,
            width: rectWidth,
            height: data[i] / maxData * rectHeight,
            },
                style: {
                fill: '#66ccff',
                stroke: 'black',
                lineWidth:5
                },
                });
                ​
                zr.add(rect);
            }
```

![](/images/jueJin/7588f35a85b8480.png)

在这个例子中，我们创建了一个 柱状图组件，它接收一个数据数组作为 props。在组件中，我们使用 useRef 创建一个 ref，用来保存画布的 DOM 元素。然后在 useEffect 中，我们使用 ZRender 创建画布，并根据传入的数据绘制矩形。最后将画布添加到 DOM 中。在组件的返回值中，我们将 ref 绑定到一个 div 元素上，并设置其宽度和高度。这样就可以在页面中显示出柱状图了。

#### 3\. 使用场景

由于 ZRender 是 ECharts 的底层引擎，因此在使用 ECharts 的时候，ZRender 是自动加载的，用户无需额外操作。不过，有些情况下可能需要直接使用 ZRender 来绘制图形或实现交互功能。

代码示例：

```php
const zr = zrender.init(chartRef.current);
const myChart = echarts.init(zr);
​
    myChart.setOption({
    backgroundColor: 'rgba(0,0,0, .6)',
        xAxis: {
        type: 'category',
        boundaryGap: ['0', '10%'],
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        },
            yAxis: {
            type: 'value',
            boundaryGap: ['0', '10%'],
            axisTick: { show: false },
                axisLine: {
                    lineStyle: {
                    color: 'rgba(255,255,255,.1)'
                }
                },
                },
                    series: [
                        {
                        name: '2021年',
                        type: 'bar',
                        barWidth: '25%',
                            itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                                [
                                    {
                                    offset: 0,
                                    color: 'rgba(207, 102, 114, 1)'
                                    },
                                        {
                                        offset: 1,
                                        color: 'rgba(142, 194, 31, 1)'
                                    }
                                    ],
                                    false
                                    )
                                    },
                                data: [103456, 120056, 123006, 123400, 120450, 103056]
                            }
                        ]
                    )}
                    ​
                    zr.dispose();
```

![](/images/jueJin/85ac1a96f9294af.png)

在这个例子中，我们创建了一个渐变柱状图组件，它接收一个数据数组作为 props。在组件中，我们使用 useRef 创建一个 ref，用来保存画布的 DOM 元素。然后在 useEffect 中，我们使用 ZRender 创建画布，并将画布实例传给 ECharts 的初始化函数，创建一个 ECharts 实例。在 ECharts 实例中，我们使用 setOption 方法来设置图表的配置选项，其中包括 X 轴、Y 轴和柱状图数据等内容。在组件的返回值中，我们将 ref 绑定到一个 div 元素上，并设置其宽度和高度。这样就可以在页面中显示出柱状图。在组件销毁时，我们还需要调用 ECharts 和 ZRender 实例的 dispose 方法，以释放资源。这样可以避免内存泄漏的问题。

以下是一些 ZRender 和 ECharts 交叉使用场景：

0.  高性能的绘图需求
    
    由于 ECharts 负责绘制的图表组件比较多，每个组件都要进行计算和渲染，因此对于某些特别复杂的图表，ECharts 可能会出现性能问题。这时可以使用 ZRender 直接绘制图形，通过优化性能实现更好的效果。
    
1.  自定义图形和交互效果
    
    ECharts 封装了很多图表组件和交互功能，但是某些时候用户可能需要自定义图形或交互效果。这时可以使用 ZRender 直接在 ECharts 图表上添加自定义的图形或交互效果，以实现特定的需求。
    
2.  与其他第三方库的集成
    
    有些时候，用户可能需要将 ECharts 图表嵌入到其他第三方库中，或者在其他第三方库中实现与 ECharts 图表的交互。这时可以使用 ZRender 直接操作图形元素，以实现与其他库的集成。
    

总的来说，ZRender 和 ECharts 可以在很多场景下交叉使用，提供更加丰富和灵活的前端可视化方案。

### 二、Echarts

#### 1\. Echarts的特性

0.  多种图表类型：ECharts支持多种常见的图表类型，包括折线图、柱状图、饼图、散点图、地图等。
1.  强大的交互性：ECharts提供了多种交互方式，包括缩放、拖拽、选取、联动等。
2.  支持多种数据格式：ECharts支持常见的数据格式，包括JSON、数组等。
3.  可定制性：ECharts支持多种样式定制方式，包括全局样式、主题、数据项样式等。
4.  数据视觉化处理：ECharts提供多种数据视觉化处理方式，包括数据映射、渐变色等。
5.  跨平台：ECharts可以运行在各种浏览器、操作系统和移动设备上。
6.  社区活跃：ECharts有一个活跃的社区，用户可以从社区中获取技术支持和资源。

#### 2\. demo图片示例

echarts的官方示例已经很完善，此处暂时只贴一些个人比较感兴趣的练习demo图片示例：

![](/images/jueJin/2785fbef63c44ba.png)

![](/images/jueJin/b81c57a46535420.png)

![](/images/jueJin/312f006e4e6b43c.png)

![](/images/jueJin/63866848563741d.png)

![](/images/jueJin/d3c71f83006f4ce.png)

### 三、参考文档

*   [ZRender](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fecomfe%2Fzrender "https://github.com/ecomfe/zrender")
*   [ECharts](https://link.juejin.cn?target=http%3A%2F%2Fecharts.baidu.com%2F "http://echarts.baidu.com/")

推荐阅读
----

[JavaScript中的 this 指向](https://juejin.cn/post/7212990981700272186 "https://juejin.cn/post/7212990981700272186")

[0基础实现项目自动化部署](https://juejin.cn/post/7207787191623647288 "https://juejin.cn/post/7207787191623647288")

[uni-app 黑魔法探秘 （一）—— 重写内置标签](https://juejin.cn/post/7205216832834584613 "https://juejin.cn/post/7205216832834584613")

[前端 DDD 框架 Remesh 的浅析](https://juejin.cn/post/7200037182927585335 "https://juejin.cn/post/7200037182927585335")

[如何做一个看板搭建系统](https://juejin.cn/post/7197433202171854885 "https://juejin.cn/post/7197433202171854885")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2F "http://zoo.zhengcaiyun.cn/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云技术团队（Zero），包含前端（ZooTeam）、后端、测试、UED 等，Base 在风景如画的杭州，一个富有激情和技术匠心精神的成长型团队。政采云前端，隶属于政采云研发部。团队现有 90 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [ZooTeam@cai-inc.com](https://link.juejin.cn?target=mailto%3AZooTeam%40cai-inc.com "mailto:ZooTeam@cai-inc.com")

![底图-v3.png](/images/jueJin/63372e91db394c6.png)