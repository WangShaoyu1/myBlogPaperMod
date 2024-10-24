---
author: "徐小夕"
title: "flowmix-flow可视化流程引擎, 开源!"
date: 2024-10-08
description: "最近也一直在迭代多模态可视化搭建产品flowmix系列, 其中在做可视化流程引擎 flowmixflow 的时候, 开源了一套工作流编辑器, 它可以轻松创建可视化工作流, 并且可以基于这套开"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:14,views:667,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring")
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep")

最近也一直在迭代多模态可视化搭建产品`flowmix系列`, 其中在做可视化流程引擎 `flowmix/flow` 的时候, 开源了一套工作流编辑器, 它可以轻松创建可视化工作流, 并且可以基于这套开源方案, 轻松定制企业自己的工作流引擎.

![图片](/images/jueJin/97df9ab96e2a407.png)

我们还可以使用它实现类似**dify**等可视化工作流.

![图片](/images/jueJin/aa7b9775366c45c.png)

开源地址: `https://github.com/MrXujiang/flowmix-flow`

线上demo: `http://flowmix.turntip.cn/flow-v0`

国内镜像: `https://gitee.com/lowcode-china/flowmix-flow`

接下来和大家分享一下我开源这套工作流引擎的一些功能亮点和技术实现. 后续也会在 **flowmix视界** 中分享更多可视化产品进展.

flowmix-flow工作流引擎特点
-------------------

*   流程排序
*   节点拖拽
*   自动创建/编辑节点
*   节点连线
*   拖拽参考线/吸附
*   画布模式
*   节点数据存储
*   画布缩略图
*   导出流程JSON

节点创建与编辑
-------

![图片](/images/jueJin/50bfb25f29ba481.png)

我们可以轻松地添加节点, 并通过双击节点来快速编辑节点, 同时编辑模式还能二次扩展.

边的自定义连线
-------

![图片](/images/jueJin/c0b5f9092c964a2.png)

我们可以轻松对不同节点进行自定义连线, 并且点击节点的“+”号之后, 可以自动创建连线节点, 来轻松创建工作流.

节点拖拽参考线
-------

![图片](/images/jueJin/dfcad69d0bc140c.png)

节点拖拽时会显示参考线, 来提高搭建体验, 这块我采用了 `refline` 来实现参考线吸附, 并且封装了一个组件, 这里和大家分享一下具体的实现:

```jsx
import { RefLine } from "./index";
import { Rect, Point } from "./types";

    interface Props {
    current: Rect;
    nodes: Rect[];
    points?: Point[];
    scale?: number;
    offsetX?: number;
    offsetY?: number;
}
    export default function Line({
    nodes,
    points = [],
    current,
    scale = 1,
    offsetX = 0,
    offsetY = 0,
        }: Props) {
        if (!current) return null;
        
            const refline = new RefLine({
            rects: nodes,
            points,
            current
            });
            
            // 获取水平、垂直参考线
            const lines = refline.getAllRefLines();
            
            return (
            <>
                {lines.map((line, i) => {
                return line.type === "vertical" ? (
                <div
            key={i}
            className="line"
                style={{
                position: "absolute",
                left: line.left * scale + offsetX,
                top: line.top * scale + offsetY,
                width: 1,
                height: line.size * scale,
                borderLeft: "1px dashed blue"
            }}
            ></div>
            ) : (
            <div
        key={i}
        className="line"
            style={{
            position: "absolute",
            left: line.left * scale + offsetX,
            top: line.top * scale + offsetY,
            height: 1,
            width: line.size * scale,
            borderTop: "1px dashed blue"
        }}
        ></div>
        );
    })}
    </>
    );
}
```

节点多选
----

![图片](/images/jueJin/6723a96fabe04fe.png)

双向图层面板
------

![图片](/images/jueJin/1293af19e4184b1.png)

我们选择节点之后, 图层面板会对应的激活, 同时支持多选激活. 当我们选择图层面板的节点之后, 画布中的节点也会对应的激活, 来提高操作效率.

数据管理机制
------

![图片](/images/jueJin/52d88583319e499.png)

数据状态管理我采用了轻量且高性能的`zustand`, 这款状态管理库目前已有`47k` star, 很多知名项目都在使用它, 建议大家可以学习一下.

`flowmix/flow` 也采用了它实现整个工作流的状态管理, 大家感兴趣可以线上体验一下.

如何使用和本地启动
---------

由于项目在 `github` 上开源, 大家可以 `clone` 到本地, 然后运行如下命令在本地启动体验:

1.  安装依赖

```
pnpm install
```

2\. 本地运行

```
pnpm dev
```

3\. 打包构建

```
pnpm build
```

这款开源项目可以集成到企业内部系统, 轻松实现媲美大厂的工作流, 后续我也会开发Pro版本, 让它覆盖更多应用场景和领域.

开源地址: `https://github.com/MrXujiang/flowmix-flow`

线上demo: `http://flowmix.turntip.cn/flow-v0`

国内镜像: `https://gitee.com/lowcode-china/flowmix-flow`

最近做的多模态文档产品
-----------

也许关注我公众号的朋友已经看过我之前做的另一款产品——**flowmix/docx**, 它是另一款搭建类产品, 类似于飞书和Notion, 可以使用它轻松构建企业下一代知识库产品.

![图片](/images/jueJin/0a6824e35b7e4a3.png)

如果大家感兴趣, 也可以在线体验一下.

体验地址: **[flowmix.turntip.cn/docx/](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fdocx%2F "http://flowmix.turntip.cn/docx/")**

如果你有好的想法和建议, 也欢迎随时**留言区**交流讨论~