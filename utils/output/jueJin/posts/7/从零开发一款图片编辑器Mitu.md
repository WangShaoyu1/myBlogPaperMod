---
author: "徐小夕"
title: "从零开发一款图片编辑器Mitu"
date: 2021-08-18
description: "背景介绍 我们知道，为了提高企业研发效能和对客户需求的快速响应，现在很多企业都在着手数字化转型，不仅仅是大厂(阿里，字节，腾讯，百度)在做低代码可视化这一块，很多中小企业也在做，拥有可视化低代码相关技"
tags: ["前端","GitHub","数据可视化中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:123,comments:19,collects:160,views:7169,"
---
> ⚠️ 本文为掘金社区首发签约文章，未获授权禁止转载

### 背景介绍

我们知道，为了提高企业研发效能和对客户需求的快速响应，现在很多企业都在着手数字化转型，不仅仅是大厂(阿里，字节，腾讯，百度)在做低代码可视化这一块，很多中小企业也在做，拥有可视化低代码相关技术背景的程序员也越来受重视。

我最近一直在做数据可视化和`lowcode/nocode`相关的项目，针对我自己的工作经验和对`lowcode/nocode`的探索，也写了一系列**低代码可视化搭建**系列文章，今天我们继续来分享可视化相关的内容——**可视化图片编辑器**。

在分享过程中，我会以最近我写开源的一个项目Mitu为案例，仔细拆解它的实现过程。Mitu主要是辅助H5编辑器 **H5-Dooring** 做图像处理用的，大家也可以轻松基于它进行二次开发和扩展，变成更强大的图片编辑器。

在文章末尾我会附上 **github** 地址 和 **demo** 地址，方便大家学习和体验。接下来我就来带大家介绍和剖析一下这款开源图片编辑器 **Mitu**。

### 项目介绍

![mitu-dooring.gif](/images/jueJin/6146cf2cb06249a.png)

以上是图片编辑器的部分演示效果，我们可以通过拖拽重组的方式快速生成我们想要的图片，也能将图片保存为模版，以便后期复用。在项目开发之前我也设计了一个简单的原型，保证自己的开发方向不会跑偏，大家可以参考一下：

![image.png](/images/jueJin/9a16b40bddf5495.png)

按照我一向的写作风格，我先列一下技术实现的大纲，以便大家有选择且高效率的阅读和学习：

*   可视化编辑器项目搭建和技术选型
*   图形库设计
*   属性编辑器设计
*   自定义图元控制器实现
*   预览功能实现
*   保存图片功能实现
*   模版保存实现
*   导入模版功能实现
*   可视化图片编辑器后期规划

好了，话不多说，接下来开始我们的技术实现。

### 技术实现

![image.png](/images/jueJin/84884643321a4d8.png)

#### 项目搭建和技术选型

编辑器的实现思路和技术栈无关，这里我采用了 `React` 来实现，当然大家如果更喜欢 `Vue` 或者 `sveltejs`，也是没问题的，项目整体技术选型如下：

*   **umi** 可扩展的企业级前端应用框架
*   **React + Typescript**
*   **Antd** 前端组件库
*   **fabric** 一个可以简化 `Canvas` 程序编写的库
*   **localStorage** 本地数据存储

当然在项目的实现过程中还有很多细节和思想，接下来我会一一和大家介绍。如果大家对 **fabric** 这个库不太熟悉也不用担心，我会通过具体功能的实现来带大家熟悉这个库。

在介绍下面的内容之前我们先安装一下 **fabric** ，然后初始化一个画布。

```bash
yarn add fabric
```

初始化一个画布：

```js
import { fabric } from "fabric";
import { nanoid } from 'nanoid';
import { useEffect, useState, useRef } from 'react';

    export default function IndexPage() {
    const canvasRef = useRef<any>(null);
        useEffect(() => {
        canvasRef.current = new fabric.Canvas('canvas');
        // 创建一个文本元素
            const shape = new fabric.IText(nanoid(8), {
            text: 'H5-Dooring',
            width : 60,
            height : 60,
            fill : '#06c',
            left: 30,
            top: 30
            })
            // 将文本元素插入画布
            canvasRef.current.add(shape);
            // 设置画布的背景色
            canvasRef.current.backgroundColor = 'rgba(255,255,255,1)';
            })
            return <canvas id="canvas" width={600} height={400}></canvas>
        }
```

这样我们就创建好了一个画布，并在画布中插入了一段可编辑可拖拽的文本，如下：

![image.png](/images/jueJin/6ef53375b16c438.png)

#### 图形库设计

作为一款图片编辑器，为了提高使用的灵活性我们还需要提供一些基础图形方便我们设计图片，所以我在编辑器里添加了图形库：

![image.png](/images/jueJin/1586d0e99287407.png)

主要有如**文本**，**图片**，**直线**，**矩形**，**圆形**，**三角形**，**箭头**，**马赛克**，当然大家可以根据自己的需求添加更多的基本图元。我们在图片库中点击任意一个元素即可将其插入画布，这块是利用 **fabric** 的 `add` 方法，当然 **fabric** 也内制了很多基本图形，我们可以在文档中参考一下。为了让图形插入更有封装性，我定义了图形的基本 `schema` 结构：

```js
    const baseShapeConfig = {
        IText: {
        text: 'H5-Dooring',
        width : 60,
        height : 60,
        fill : '#06c'
        },
            Triangle: {
            width: 100,
            height: 100,
            fill: '#06c'
            },
                Circle: {
                radius: 50,
                fill: '#06c'
                },
                    Rect: {
                    width : 60,
                    height : 60,
                    fill : '#06c'
                    },
                        Line: {
                        width: 100,
                        height: 1,
                        fill: '#06c'
                        },
                        Arrow: {},
                        Image: {},
                    Mask: {}
                }
```

这样我们插入图形的方法就可以这样写：

```ts
type ElementType = 'IText' | 'Triangle' | 'Circle' | 'Rect' | 'Line' | 'Image' | 'Arrow' | 'Mask'

    const insertShape = (type:ElementType) => {
        shape = new fabric[type]({
        ...baseShapeConfig[type],
        left: size[0] / 3,
        top: size[1] / 3
        })
        canvasRef.current.add(shape);
    }
```

后续我们添加图形时只需要定义 `schema` 即可，但是需要注意的是 **fabric** 创建图形的方式并不都都是统一的，我们需要对特定图片的创建进行特殊判断，比如直线路径：

```js
    if(type === 'Line') {
        shape = new fabric.Path('M 0 0 L 100 0', {
        stroke: '#ccc',
        strokeWidth: 2,
        objectCaching: false,
        left: size[0] / 3,
        top: size[1] / 3
        })
    }
```

当然我们也可以用 `switch` 来对不同情况进行不同处理，这样我们就实现了一个基本图片库。

![chrome-capture (9).gif](/images/jueJin/bd8ccc733653424.png)

#### 属性编辑器设计

属性编辑器主要是用来对图形属性进行配置的，比如**填充颜色**，**描边颜色**，**描边宽度**，目前我主要定义了这3个维度，大家也可以基于此继续扩展更多的可编辑属性，类似于 [H5-Dooring](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus "http://h5.dooring.cn/h5_plus") 的组件属性配置面板。

![chrome-capture (10).gif](/images/jueJin/4d195e1044024b7.png)

我们可以在编辑器右侧的**属性编辑**区控制图形的属性，因为属性目前只有3个，我就直接硬编码写上去了，大家也可以用动态渲染的方式来实现。需要注意的是我们怎么知道我们选中的是那个组件呢? 好在 **fabric** 提供了一系列 **api** 帮助我们更好的控制元素对象，这里我们用 `getActiveObject` 方法拿到当前选中的元素，具体实现代码如下：

```js
// ...
// 定义基础属性
    const [attrs, setAttrs] = useState({
    fill: '#0066cc',
    stroke: '',
    strokeWidth: 0,
    })
    // 更新选中的元素
        const updateAttr = (type: 'fill' | 'stroke' | 'strokeWidth' | 'imgUrl', val:string | number) => {
        setAttrs({...attrs, [type]: val})
        // 获取当前选中元素对象
        const obj = canvasRef.current.getActiveObject()
        // 设置元素属性
        obj.set({...attrs})
        // 重新渲染
        canvasRef.current.renderAll();
    }
```

属性编辑器的样式实现这里我就不一一介绍了，都比较基础，我们来看一下编辑项的基本结构：

```html
<span className={styles.label}>描边宽度: </span>
<InputNumber size="small" min={0} value={attrs.strokeWidth}  onChange={(v) => updateAttr('strokeWidth', v)} />
```

#### 自定义图元控制器实现

因为默认情况下 **fabric** 没有提供删除按钮和逻辑，所以我们需要自己二次扩展，恰好 **fabric** 提供了自定义扩展的方法，接下来我们就一起自定义一个删除按钮并实现删除逻辑。

![image.png](/images/jueJin/478ecdfec88849f.png)

具体实现代码如下：

```js
// 删除按钮
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

// 删除方法
    function deleteObject(eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
}

// 渲染icon
    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size/2, -size/2, size, size);
    ctx.restore();
}

// 全局添加删除按钮
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -32, // 自定义距元素的偏移距离, 也可以定义offsetX
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24
    });
```

这样我们就实现了自定义元素控制，我们也可以按照类似的方法实现自定义的控件。效果如下：

![chrome-capture (11).gif](/images/jueJin/b3b0997c4930473.png)

#### 预览功能实现

预览功能我主要是利用原生 **canvas** 的 `toDataURL` 方法来生成`base64`的数据，然后赋值给 `img` 标签。还有一个细节需要注意的是如果我们在预览之前画布仍然有选中状态的元素，那么控制点也会被截取出来，如下：

![image.png](/images/jueJin/98d3897f90cd410.png)

这样对用户体验非常不好，我们需要在预览时看到一张纯粹的图片，我的方案是在预览前取消画布所有元素的选中状态，可以用 **fabric** 实例的 `discardActiveObject()` 方法取消激活状态，然后更新画布即可，具体实现逻辑如下：

```js
// 1. 取消画布所有元素的选中状态
canvasRef.current.discardActiveObject()
canvasRef.current.renderAll();

// 2. 将当前画布转化为图片的base64地址
const img = document.getElementById("canvas");
const src = (img as HTMLCanvasElement).toDataURL("image/png");

// 3. 设置元素url,显示预览弹窗
setImgUrl(src)
setIsShow(true)
```

预览效果展示：

![chrome-capture (12).gif](/images/jueJin/d98c88828486420.png)

#### 保存图片功能实现

保存图片其实和预览功能很像，唯一不同的是我们需要把图片下载到本地，那么我主要是用纯前端的方式实现图片下载，大家也可以用自己熟悉的前端下载方案，接下来贴一下我的方案实现：

```js
    function download(url:string, filename:string, cb?:Function) {
        return fetch(url).then(res => res.blob().then(blob => {
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        cb && cb()
        }))
    }
```

主要是用的`window` 的 `URL` 对象的 `createObjectURL` 和 `revokeObjectURL` 方法，两年前我也在我的文章中分享过对应的实现，感兴趣的可以参考一下。下载的效果如下：

![image.png](/images/jueJin/2b522f8b8f6040c.png)

#### 模版保存实现

在设计图片编辑器的过程中我们也要考虑保存用户的资产，比如做的比较好的图片可以保存为模版，以便下次复用，所以我在编辑器里还实现的简单的模版保存和使用的功能。我们先看一下效果：

![chrome-capture (13).gif](/images/jueJin/8b62cf12943b44a.png)

我们在演示中可以看到保存为模版之后会自动同步到左侧的模版列表中，我们下次创作时可以直接导入模版进行二次创作。以下是实现的逻辑图：

![image.png](/images/jueJin/7461f643031f430.png)

由上图可以发现我们保存模版不仅仅是保存图片，还需要保存图片对应的 **json schema** 数据，之所以要保存 **json schema** 是为了当用户切换到对应的模版之后可以保证模版的每个元素都可以还原，类似于我们最熟悉的 `PSD` 源文件。**fabric** 提供了序列化画布的方法 `toDatalessJSON()`，我们在保存模版的时候只要把序列化后的 `json` 和图片一起保存即可，这里方便处理我暂时存在 **localStorage** 中，大家也可以使用大容量本地化存储方案 `indexedDB`，我之前也基于 `indexedDB` 封装了开箱即用的缓存库 **xdb**，大家可以直接拿来使用。

*   [xdb | 基于promise封装且支持过期时间的开箱即用的indexedDB缓存库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fxdb "https://github.com/MrXujiang/xdb")

保存模版的具体实现如下：

```js
    const handleSaveTpl = () => {
    const val = tplNameRef.current.state.value
    const json = canvasRef.current.toDatalessJSON()
    const id = nanoid(8)
    // 存json
    const tpls = JSON.parse(localStorage.getItem('tpls') || "{}")
    tpls[id] = {json, t: val};
    localStorage.setItem('tpls', JSON.stringify(tpls))
    // 存图片
    canvasRef.current.discardActiveObject()
    canvasRef.current.renderAll()
    const imgUrl = getImgUrl()
    const tplImgs = JSON.parse(localStorage.getItem('tplImgs') || "{}")
    tplImgs[id] = imgUrl
    localStorage.setItem('tplImgs', JSON.stringify(tplImgs))
    // 更新模版列表
    setTpls((prev:any) => [...prev, {id, t: val}])
    setIsTplShow(false)
}
```

#### 导入模版功能实现

导入模版的本质是反序列化 **Json Schema**，在研究 **fabric** 的过程中发现了其可以直接加载 `json` 渲染图形序列，所以我们可以直接将上文保存的 `json` 直接加载到画布：

```js
// 1.加载前清空画布
canvasRef.current.clear();
// 2.重置画布背景色
canvasRef.current.backgroundColor = 'rgba(255,255,255,1)';
// 3. 渲染json
canvasRef.current.loadFromJSON(tpls[id].json, canvasRef.current.renderAll.bind(canvasRef.current))
```

然后我们就可以根据保存的模版列表，动态切换模版了：

![chrome-capture (14).gif](/images/jueJin/e22a2e7f9fc4425.png)

### 后期规划

这款图片编辑器我已经在 `github` 开源了，大家可以基于次开发更强大的图片编辑器，对于图片编辑器的后期规划，我也评估了几个可行的方向，如果大家感兴趣也可以联系我参与到项目中来。

后期规划如下：

*    撤销重做
*    画布背景设置
*    丰富图形组件库
*    图片滤镜配置
*    模块化界面
*    解析PSD

如果大家对可视化搭建或者低代码/零代码感兴趣，也可以参考我往期的文章或者在评论区交流你的想法和心得，欢迎一起探索前端真正的技术。

> github: [mitu-editor | 轻量级且可扩展的图片/图形编辑器解决方案](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fmitu-editor "https://github.com/H5-Dooring/mitu-editor")  
> 首发：[掘金技术社区](https://juejin.cn "https://juejin.cn")  
> 作者：[徐小夕](https://juejin.cn/user/3808363978429613 "https://juejin.cn/user/3808363978429613")  
> 专栏：[低代码可视化](https://juejin.cn/column/6963455443528056839 "https://juejin.cn/column/6963455443528056839")  
> 公众号: 趣谈前端

往期文章
----

*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")