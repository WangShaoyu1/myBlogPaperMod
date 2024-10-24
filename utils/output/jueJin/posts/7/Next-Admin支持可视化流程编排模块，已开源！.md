---
author: "徐小夕"
title: "Next-Admin支持可视化流程编排模块，已开源！"
date: 2024-05-20
description: "hello，大家好，我是徐小夕。之前和大家分享了很多可视化，零代码和前端工程化的最佳实践，今天继续分享一下最近开源的 Next-Admin 项目的最新更新。 Next-Admin 是一款基于 next"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:17,views:1372,"
---
hello，大家好，我是**徐小夕**。之前和大家分享了很多**可视化**，**零代码**和**前端工程化**的最佳实践，今天继续分享一下最近开源的 `Next-Admin` 项目的最新更新。

![](/images/jueJin/1fa9c363a98f4e8.png)

`Next-Admin` 是一款基于 `nextjs` 内核开发的开箱即用的中后台管理系统。

最近对这个项目做了一系列优化，并集成了大家比较关注的`可视化流程编排`模块，感兴趣的可以参考一下。

![graph.gif](/images/jueJin/bf6aa6c66ae0412.png)

*   开源地址：`https://github.com/MrXujiang/next-admin`
*   在线demo：`http://next-admin.com`

目前已支持的功能模块有：

*   Next14.0 + antd5.0 + css module
*   支持国际化
*   支持主题切换
*   内置数据可视化报表
*   内置可视化编排模块
*   内置拖拽模块（多选，参考线，吸附等核心搭建能力）
*   内置AI问答模块
*   开箱即用的业务页面模板
*   支持自定义拖拽看板
*   集成办公白板
*   Next全栈最佳实践
*   支持移动端和PC端自适应
*   内置简单的JWT处理逻辑

### 往期精彩

*   [独立开发（裸辞）100天，我的阶段性复盘](https://juejin.cn/post/7360493040135651366 "https://juejin.cn/post/7360493040135651366")
*   [文档引擎+AI可视化打造下一代文档编辑器](https://juejin.cn/post/7359461815393845275 "https://juejin.cn/post/7359461815393845275")
*   [爆肝1000小时, Dooring零代码搭建平台3.5正式上线](https://juejin.cn/post/7325132202970447881 "https://juejin.cn/post/7325132202970447881")
*   [从零打造一款基于Nextjs+antd5.0的中后台管理系统](https://juejin.cn/post/7351321257755672602 "https://juejin.cn/post/7351321257755672602")

### 流程编排实现

![](/images/jueJin/7d596723e3a647e.png)

前两年比较火的低代码可视化让流程编排进入了很多技术伙伴的视线， 也出现了很多流程图，流程编排的库和产品，所以作为 `Next-Admin` 的最佳实践，流程编排这块也必须安排上，最近研究了几款不错的可视化库，选择了其中一个来实现流程图设计，这里分享给大家，同时也可以在 `github` 上看到所有源码。

流程图引擎我采用的是阿里开源的`butterfly`. 我会基于它来实现一个流程编排模块，如下图所示：

![graph.gif](/images/jueJin/bf6aa6c66ae0412.png)

安装`butterfly` ：

```javascript
// 完全版，内部包含jquery和lodash
import {Canvas, Group, Node, Edge} from 'butterfly-dag';
import 'butterfly-dag/dist/index.css';

// 如果您引用的项目使用了jquery和lodash，为了缩小项目的体积，我们建议：
import {Canvas, Group, Node, Edge} from 'butterfly-dag/pack/index.js';
import 'butterfly-dag/pack/index.css';
```

在项目中使用：

```js
import {Canvas} from 'butterfly-dag';
    let canvas = new Canvas({
    root: dom,              //canvas的根节点(必传)
    zoomable: true,         //可缩放(可传)
    moveable: true,         //可平移(可传)
    draggable: true,        //节点可拖动(可传)
    });
        canvas.draw({
        groups: [],  //分组信息
        nodes: [],  //节点信息
        edges: []  // 连线信息
        })
```

当然要想实现上述我实现的流程图，需要做一些特殊的算法处理和数据`mock`， 比如处理成组的逻辑：

```js
import {Group} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';

    class BaseGroup extends Group {
        draw(obj) {
        let _dom = obj.dom;
            if (!_dom) {
            _dom = $('<div></div>')
            .attr('class', 'test_group')
            .css('top', obj.top)
            .css('left', obj.left)
            .attr('id', obj.id);
        }
        let group = $(_dom);
        this._container = $('<div></div>')
        .attr('class', 'test_container');
        group.append(this._container);
        // 添加文字
            if (_.get(obj, 'options.text')) {
            group.append(`<span class="text">${obj.options.text}</span>`);
        }
        return _dom;
    }
        getWidth() {
        return $(this.dom).width();
    }
        getHeight() {
        return $(this.dom).height();
    }
}
export default BaseGroup;
```

处理边缘计算的逻辑：

```js
// edge逻辑
import {Edge} from 'butterfly-dag';
import $ from 'jquery';

    class BaseEdge extends Edge {
        draw(obj) {
        let path = super.draw(obj);
        $(path).addClass('test-base-link');
        return path;
    }
        drawLabel(texts) {
    }
}

export default BaseEdge;

// 断点计算逻辑
import {Endpoint} from 'butterfly-dag';
import $ from 'jquery';

    class BaseEndpoint extends Endpoint {
        draw(obj) {
        let point = super.draw(obj);
            if (obj.options && obj.options.color === 'system-gray') {
            // 系统灰色锚点
            $(point).addClass('system-gray-point');
                } else if (obj.options && obj.options.color === 'system-green') {
                // 系统锚点绿色
                $(point).addClass('system-green-point');
            }
            return point;
        }
    }
    
    export default BaseEndpoint;
```

这块大家感兴趣建议看看它的文档，有详细的说明：

`https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md`

### 最后

后续会在 `Next-Admin` 中集成更多最佳实践，也欢迎感兴趣的朋友一起交流讨论。

如果你对 `next` 开发或者需要开发一套管理系统， 我相信 `Next-Admin` 会给你开发和学习的灵感。

同时也欢迎和我一起贡献， 让它变得更优秀~

`github`地址：`https://github.com/MrXujiang/next-admin`

演示地址：`http://next-admin.com`

由于服务器在国外， 所以建议大家git到本地体验~

欢迎star + 反馈~