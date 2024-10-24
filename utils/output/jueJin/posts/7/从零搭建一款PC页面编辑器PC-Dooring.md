---
author: "徐小夕"
title: "从零搭建一款PC页面编辑器PC-Dooring"
date: 2021-04-12
description: "之前一直忙着调研lowcode平台和开发以下两个项目H5编辑器H5-Dooring ,可视化大屏编辑器V6Dooring没有太多时间做PC端搭建化项目, 好在搭建平台很多原理都是通用的, 所以早在"
tags: ["数据可视化","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:138,comments:14,collects:175,views:8989,"
---
之前一直忙着调研**lowcode平台**和开发以下两个项目:

*   **H5编辑器**[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring") ,
*   **可视化大屏编辑器**[V6.Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fv6.dooring.public "https://github.com/MrXujiang/v6.dooring.public")

没有太多时间做PC端搭建化项目, 好在搭建平台很多原理都是通用的, 所以早在去年我就开发好了面向PC端的编辑器[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring"), 虽然在设计上还有些不足(在后面的内容中会提到) , 但是基本模型已经实现, 接下来就和大家一起分享一下具体的实现.

为了保证文章整体的逻辑性和条理性, 我将可视化搭建平台的具体的实现划分为了以下几个部分:

*   **PC编辑器效果展示**
*   **整体技术架构**
*   **可视化搭建技术实现方式**
*   **编辑器核心思路**
*   **编辑器架构模型**
*   **如何开发标准物料组件**
*   **编辑器后期规划**

### PC编辑器效果展示

![chrome-capture.gif](/images/jueJin/3bae65784c5a476.png)

在上面的演示中, 组件库方式和[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")类似, 只不过组件库笔者采用了PC端专属的组件库**antd**, 所以我们可以将antd支持的任何组件集成进[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring").

### 整体技术架构

整体技术架构和[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")类非常相似, 也是遵循笔者的产品设计哲学—— 不要让用户思考. 降低一切拖拽复杂度, 采用**智能网格**的交互模式来实现(这种设计方式有一定的局限, 仅供大家参考, 当然也可以使用[V6.Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fv6.dooring.public "https://github.com/MrXujiang/v6.dooring.public")的自由布局模式). 整体架构如下图所示:

![image.png](/images/jueJin/4133f69758584cc.png)

由上图我们可以看出编辑器主要分为如下几个部分:

*   **组件物料**
*   **画布区**
*   **属性编辑区**
*   **功能辅助**
*   **其他**

目前组件物料主要实现了**基础组件**, **可视化组件**和 **媒体组件**, 其他类的组件实现也类似, 技术整体实现我们会在下面介绍.

### 可视化搭建技术实现方式

![image.png](/images/jueJin/7191efdc445947d.png)

前端框架我们还是使用的**React**, 当然大家也可以使用**Vue3.0**, 原理都是相通的, 不同插件之间也提供了多框架的支持. 编辑器核心的一环就是组件拖拽, 这里笔者使用了社区比较强大且稳定的库`react-dnd`, 其拖拽分为两个部分, 一个是从组件区拖拽到画布区, 另一个是画布区内部组件的自由拖拽. 我们可以用原生H5的拖放API来实现第一部分的功能, 本质是将拖动源携带的数据传到画布制定区域, 目标源监听事件拿到携带的数据动态渲染出实际的组件. 过程如下:

![image.png](/images/jueJin/e15983fae1ec4bd.png)

当然深入研究过`react-dnd`的朋友都知道, 以上两个功能通过`react-dnd`都可以实现, 大家可以参考它的官网[react-dnd官网](https://link.juejin.cn?target=https%3A%2F%2Freact-dnd.github.io%2Freact-dnd%2F "https://react-dnd.github.io/react-dnd/")学习研究具体实现流程, 也可以直接参考[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring")源码.

至于组件库, 我们可以采用任何我们熟悉的组件库, 比如`antd`, `element`, `zant`等, 组件物料需要遵循我们约定的`DSL协议`, 这里大家可以参考工业级协议标准[odata规范](https://link.juejin.cn?target=http%3A%2F%2Fdocs.oasis-open.org%2Fodata%2Fnew-in-odata%2Fv4.01%2Fnew-in-odata-v4.01.pdf "http://docs.oasis-open.org/odata/new-in-odata/v4.01/new-in-odata-v4.01.pdf"). 有了一定的规范, 我们就可以包装标准的组件物料从而集成第三方组件库了.

至于功能辅助模块和状态管理, 我们可以采用如`mobx`, `redux`, `dva`等来实现, 最终目的就是让编辑器不同部分能相互关联, 实时更新组件状态, 以及数据回传能力.

### 编辑器核心思路

编辑器核心实现思路笔者之前也分析了几个现有方案, 发现字节魔方的思路很贴切, 这里附上一个原理图:

![image.png](/images/jueJin/b22820250790431.png)

核心就是通过编辑器产生的**有效词法数据**, 让渲染器能解析渲染成可用的HTML页面.

### 编辑器整体架构模型

编辑器整体架构模型主要是为了让大家全局的了解可视化编辑器的实现思路, 以及未来的规划方向, 笔者做了一个基本的草图, 如下:

![image.png](/images/jueJin/d753aaa896984dd.png)

### 如何开发标准物料组件

开发标准组件物料需要遵循我们编辑器内部的数据协议和组件开发规范, 在[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring")中开发组件主要由以下几部分组成:

*   组件代码
*   schema定义
*   template定义

组件代码就是组件内部具体的实现, 如下案例:

```js
import React, { memo } from 'react';
import { ITextConfig } from './schema';
import logo from '@/assets/text.png';
    const Text = memo((props: ITextConfig & { isTpl: boolean }) => {
    const { align, text, fontSize, color, lineHeight, isTpl } = props;
    return (
    <>
    {isTpl ? (
    <div>
    <img src={logo} alt=""></img>
    </div>
    ) : (
    <div style={{ color, textAlign: align, fontSize, lineHeight }}>{text}</div>
)}
</>
);
});
export default Text;
```

schema定义了组件的属性约束, 可编辑项类型以及默认值, 如下:

```js
    import {
    IColorConfigType,
    INumberConfigType,
    ISelectConfigType,
    ITextConfigType,
    TColorDefaultType,
    TNumberDefaultType,
    TSelectDefaultType,
    TTextDefaultType,
    } from '@/components/FormComponents/types';
    
    export type TTextSelectKeyType = 'left' | 'right' | 'center';
    export type TTextEditData = Array<
    ITextConfigType | IColorConfigType | INumberConfigType | ISelectConfigType<TTextSelectKeyType>
    >;
        export interface ITextConfig {
        text: TTextDefaultType;
        color: TColorDefaultType;
        fontSize: TNumberDefaultType;
        align: TSelectDefaultType<TTextSelectKeyType>;
        lineHeight: TNumberDefaultType;
    }
    
        export interface ITextSchema {
        editData: TTextEditData;
        config: ITextConfig;
    }
        const Text: ITextSchema = {
            editData: [
                {
                key: 'text',
                name: '文字',
                type: 'Text',
                },
                    {
                    key: 'color',
                    name: '标题颜色',
                    type: 'Color',
                    },
                        {
                        key: 'fontSize',
                        name: '字体大小',
                        type: 'Number',
                        },
                            {
                            key: 'align',
                            name: '对齐方式',
                            type: 'Select',
                                range: [
                                    {
                                    key: 'left',
                                    text: '左对齐',
                                    },
                                        {
                                        key: 'center',
                                        text: '居中对齐',
                                        },
                                            {
                                            key: 'right',
                                            text: '右对齐',
                                            },
                                            ],
                                            },
                                                {
                                                key: 'lineHeight',
                                                name: '行高',
                                                type: 'Number',
                                                },
                                                ],
                                                    config: {
                                                    text: '我是文本',
                                                    color: 'rgba(60,60,60,1)',
                                                    fontSize: 18,
                                                    align: 'center',
                                                    lineHeight: 2,
                                                    },
                                                    };
                                                    export default Text;
```

template主要规定了组件在画布中展示的基本方式, 如下:

```js
    const template = {
    type: 'Text',
    h: 20,
    displayName: '文本组件',
    };
    export default template;
```

当然大家也可以扩展其定义或者将**schema**和**template**合并. 只要一个组件符合了以上约定, 都可以被我们编辑器所消费.

### 编辑器后期规划

PC编辑器目前仍存在一些问题没有很好的解决, 比如布局方式的局限性导致必须横向扩展很多组件才能满足不同用户的个性化需求, 其次就是组件联动机制, 需要统一数据中心来管理, 后面会在[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring") 中展示具体的实现方式, 大家感兴趣也可以实现一下.

目前[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring")已经在**github**上以**MIT**协议完全开源, 如果大家感兴趣,也可以贡献你的一份力量, 帮助社区解决更多问题.

> 觉得有用 ？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！微信搜 “**趣谈前端**”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.