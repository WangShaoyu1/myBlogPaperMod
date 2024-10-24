---
author: "徐小夕"
title: "《精通reactvue组件设计》之5分钟教你实现一个极具创意的加载(Loading)组件"
date: 2020-02-11
description: "本文是笔者写组件设计的第八篇文章, 今天带大家用5分钟实现一个极具创意的加载(loading)组件涉及的核心知识点主要是css3相关特性, 如果大家非常熟悉,可直接跳过介绍直接看正文 通用型组件 比如Button, Icon等 布局型组件 比如Grid, Layout…"
tags: ["React.js","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:33,comments:6,collects:46,views:3200,"
---
前言
--

本文是笔者写组件设计的第八篇文章, 今天带大家用5分钟实现一个极具创意的加载(loading)组件.涉及的核心知识点主要是css3相关特性, 如果大家非常熟悉,可直接跳过介绍直接看正文.

> 时刻问自己：是否具备创造力?

#### \[笔记\]前端组件的一般分类:

*   通用型组件: 比如Button, Icon等.
*   布局型组件: 比如Grid, Layout布局等.
*   导航型组件: 比如面包屑Breadcrumb, 下拉菜单Dropdown, 菜单Menu等.
*   数据录入型组件: 比如form表单, Switch开关, Upload文件上传等.
*   数据展示型组件: 比如Avator头像, Table表格, List列表等.
*   反馈型组件: 比如Progress进度条, Drawer抽屉, Modal对话框等.
*   其他业务类型

所以我们在设计组件系统的时候可以参考如上分类去设计,该分类也是antd, element, zend等主流UI库的分类方式.

如果对于react/vue组件设计原理不熟悉的,可以参考我的之前写的组件设计系列文章:

*   [《精通react/vue组件设计》之实现一个健壮的警告提示(Alert)组件](https://juejin.cn/post/6844904062060593165 "https://juejin.cn/post/6844904062060593165")
*   [《精通react/vue组件设计》之配合React Portals实现一个功能强大的抽屉(Drawer)组件](https://juejin.cn/post/6844904061615996942 "https://juejin.cn/post/6844904061615996942")
*   [《精通react/vue组件设计》之5分钟实现一个Tag(标签)组件和Empty(空状态)组件](https://juejin.cn/post/6844904058231193614 "https://juejin.cn/post/6844904058231193614")
*   [《精通react/vue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件](https://juejin.cn/post/6844904054917693453 "https://juejin.cn/post/6844904054917693453")
*   [《精通react/vue组件设计》之快速实现一个可定制的进度条组件](https://juejin.cn/post/6844904055702028296 "https://juejin.cn/post/6844904055702028296")
*   [《精通react/vue组件设计》之基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.cn/post/6844904053781037064 "https://juejin.cn/post/6844904053781037064")

笔者已经将组件库发布到npm上了, 大家可以通过npm安装的方式体验组件.

正文
--

在开始组件设计之前希望大家对css3和js有一定的基础,并了解基本的react/vue语法.我们先看看实现后的组件效果:

![](/images/jueJin/170334cd20ba4fe.png)

![](/images/jueJin/170334b811f06ac.png)

![](/images/jueJin/170334c274e4cfb.png)

因为动图体积太大,就不给大家传gif了,接下来我们具体分析一下该组件的特点.

### 1\. 组件设计思路

按照之前笔者总结的组件设计原则,我们第一步是要确认需求. 首先我们设计的不是后台管理系统专用的加载动画,而是作为一个C端产品的功用型加载动画.我们都知道加载动画的作用是:**在用户等待网页时能看到有用的信息,比如网站介绍,引导, 公司信息等,缓解用户焦虑**. 作为一名产品经理或者用户体验师, 这种个性化的加载体验效果往往是更好的.

而加载动画一般会分为策略型加载动画和通用加载动画,通用加载动画我就不说了,大家平时做的系统大部分应该都是通用型加载动画. 我这里介绍一下策略型加载动画: 策略型加载动画往往用在C端产品或者系统中,用来为用户提供更多的引导信息, 当用户首次访问系统或者网站时, 由于某种主动型引导(网站在加载时或者切换页面时故意给用户看到的加载信息)或者环境原因(网络,带宽限制导致的加载过慢,此时出现加载动画), 这些加载信息往往带有某种用途,比如对于个人博客网站, 这个加载动画可以是博主的介绍,博主的宣传信息,github地址等, 对于企业来说,可能是某个新功能的介绍, 网站服务信息的介绍,联系方式等.

在了解完以上背景后, 我们来看看组件设计的线框图:

![](/images/jueJin/1703372613ec0b5.png)

对于react选手来说,如果没用typescript,建议大家都用PropTypes, 它是react内置的类型检测工具,我们可以直接在项目中导入. vue有自带的属性检测方式,这里就不一一介绍了.

通过以上需求分析, 其实一个加载动画非常简单, 不会涉及到太多功能, 主要在于css3动画的使用. 具体属性有:

*   加载动画出现时的加载文本
*   控制加载状态的state

接下来我们就来看看具体实现.

### 2\. 基于react实现一个Loading组件

因为该组件不会涉及到太多的js代码,主要是html和css,所以我们直接先构建组件的结构:

```
/**
* 骨架屏组件(SEO)
* @param {isLoading} bool 加载状态
* @param {loadingText} string 加载时的加载文本
*/
    export default function Skeleton(props) {
    let { isLoading = true, loadingText = '正在为您疯狂加载...' } = props
    return isLoading ? <div className={styles.skeletonWrap}>
    <div className={styles.skeletonContent} data-loadingText={loadingText}>
    自定义的引导内容
    </div>
    </div> : null
}
```

自定义的引导内容这里我就不介绍了, 主要根据不同的网站性质灵活配置.我主要介绍加载动画部分, 其实原理也很简单, 我们在skeletonContent元素上使用一个::after伪对象来实现窗帘动画即可.

在实现动画前大家最好对关键帧动画有所了解,我相信大家都比较了解. 这种关窗帘动画一种实现方式就是通过控制元素宽度, 从0到100%, 然后添加适当的要是优化即可. 动画的代码如下:

```
    @keyframes spread {
        0% {
        width: 0;
    }
        100% {
        width: 100%;
    }
}
```

我们只需要在::after里直接这样使用就好了:

```
    &::after {
    animation: spread 18s 3s infinite;
}
```

这样动画已经做完了, 但是为了让动画更完整,我们还要考虑一个事实, 如果窗帘宽度从0慢慢变化的过程中, 加载动画的文字一直保持一个颜色会很生硬, 如下图:

![](/images/jueJin/170338310770140.png)

所以说作为一个好的交互设计来说, 要让交互体验更顺畅,这里提供一种方式,就是加载的文本在窗帘宽度变化的同时,文字的透明度从0变化到1,这样就会柔和很多, 所以动画可以这么改:

```
    &::after {
    color: rgba(255, 255, 255, 0);
    animation: spread 18s infinite;
}
    @keyframes spread {
        0% {
        width: 0;
        color: rgba(255, 255, 255, 0);
    }
        100% {
        width: 100%;
        color: rgba(255, 255, 255, 1);
    }
}
```

效果如下:

![](/images/jueJin/17033864ccaa1c9.png)

最后我们来实现loadingText. 这块也涉及到一个知识点, 因为加载文本其实主要是用来修饰元素的,并没有太多的语义化场景, 所以我们会放在::after伪对象的content里, 但是一般content是在css里写的,那么如何实现动态文本呢? 我们这里就要采用css的属性内容这个api. content不仅仅可以接收一个字符串,还可以接收attr这个关键字,关键字里面的内容是元素的自定义属性, 比如:

```
<div data-tip="loading"></div>
```

那么我们在css里可以通过这种方式直接使用data-tip属性的值:

```
    div::after{
    content: attr(data-tip)
}
```

通过以上的方式我们可以在::after里直接拿到data-tip的内容了, content其实还有更多的功能,比如用纯css实现一个计数器,大家可以研究学习一下.

这样,我们的Loading组件就完成了, 还有一个问题是我代码里的组件命名,为什么叫骨架屏呢?其实我们只要改变内容结构, 它立马就可以变成一个骨架屏,所以命名这块可以按照实际需求来确定.

### 3\. 健壮性支持, 我们采用react提供的propTypes工具:

```
import PropTypes from 'prop-types'
// ...
    Skeleton.propTypes = {
    isLoading: PropTypes.bool,
    loadingText: PropTypes.string
}
```

组件完整css代码如下:

```
    .skeletonWrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0, .6);
        .skeletonContent {
        position: relative;
        margin: 200px auto 0;
        padding: 20px;
        width: 800px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
        background-color: #fff;
            &::after {
            content: '正在为您疯狂加载...';
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 0;
            height: 100%;
            border-right: 2px solid #ccc;
            box-shadow: 0 0 8px #000;
            background: #096;
            color: rgba(255, 255, 255, 0);
            font-size: 24px;
            white-space: nowrap;
            animation: spread 18s 3s infinite;
        }
            @keyframes spread {
                0% {
                width: 0;
                color: rgba(255, 255, 255, 0);
            }
                100% {
                width: 100%;
                color: rgba(255, 255, 255, 1);
            }
        }
        
            .imgBox {
            margin-right: 20px;
            width: 400px;
                .img {
                width: 100%;
                height: 200px;
                background-color: #ccc;
            }
                img {
                width: 100%;
            }
        }
            .rightBox {
            flex: 1;
                .tit {
                margin-top: 8px;
                margin-bottom: 8px;
                font-size: 22px;
            }
                .labelWrap {
                    span {
                    margin: 3px;
                    display: inline-block;
                    font-size: 12px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    color: #fff;
                    background-color: #58bd6b;
                }
            }
                .desc {
                color: rgb(44, 44, 44);
                font-size: 14px;
            }
        }
    }
}
```

关于代码中的css module和classnames的使用大家可以自己去官网学习,非常简单.如果不懂的可以在评论区提问,笔者看到后会第一时间解答.

### 4 使用Skeleton组件

我们可以通过如下方式使用它:

```
<Skeleton loadingText="玩命加载中..." />
```

笔者已经将实现过的组件发布到npm上了,大家如果感兴趣可以直接用npm安装后使用,方式如下:

```
npm i @alex_xu/xui

// 导入xui
    import {
    Button,
    Skeleton,
    Empty,
    Progress,
    Tag,
    Switch,
    Drawer,
    Badge,
    Alert
    } from '@alex_xu/xui'
```

该组件库支持按需导入,我们只需要在项目里配置babel-plugin-import即可,具体配置如下:

```
// .babelrc
    "plugins": [
["import", { "libraryName": "@alex_xu/xui", "style": true }]
]
```

npm库截图如下:

![](/images/jueJin/1702d0ab4c7d10a.png)

最后
--

后续笔者将会继续实现

*   **modal**(模态窗),
*   **badge**(徽标),
*   **table**(表格),
*   **tooltip**(工具提示条),
*   **Skeleton**(骨架屏),
*   **Message**(全局提示),
*   **form**(form表单),
*   **switch**(开关),
*   **日期/日历**,
*   **二维码识别器组件**

等组件, 来复盘笔者多年的组件化之旅.

如果想获取组件设计系列完整源码, 或者想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [2年vue项目实战经验汇总](https://juejin.cn/post/6844904056893243400 "https://juejin.cn/post/6844904056893243400")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")