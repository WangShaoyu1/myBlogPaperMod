---
author: "徐小夕"
title: "基于React+Koa实现一个h5页面可视化编辑器－Dooring  🏆 技术专题第三期征文"
date: 2020-08-24
description: "前段时间笔者一直忙于数据可视化方面的工作，比如如何实现拖拽式生成可视化大屏，如何定制可视化图表交互和数据导入方案等，这块需求在B端企业中应用非常大，所以非常有探索价值。 本篇文章并非和数据可视化相关，而是通过抽象技术底层，将其应用于H5页面可视化搭建上，通过技术的手段实现拖拽式…"
tags: ["数据可视化","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:278,comments:54,collects:390,views:17623,"
---
前言
--

前段时间笔者一直忙于**数据可视化**方面的工作，比如如何实现**拖拽式**生成可视化大屏，如何定制可视化图表交互和数据导入方案等，这块需求在B端企业中应用非常大，所以非常有探索价值。

本篇文章并非和数据可视化相关，而是通过抽象技术底层，将其应用于**H5页面可视化**搭建上，通过技术的手段实现**拖拽式生成H5页面**。这块也有非常多的应用场景，比如我们需要开发一个移动端网站，一个H5营销页面，H5活动页面等，如果有这样的傻瓜式拖拽的工具生成H5页面，将会极大的提高我们的工作效率。

接下来笔者将对**h5页面可视化编辑器－Dooring**做详细的项目分析和原理解读，来带大家深入了解h5可视化搭建页面的原理和技术实现。H5编辑器预览如下： ![](/images/jueJin/7a6c5bc0c2c6480.png)

github地址：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

技术栈
---

*   **React** 前端主流框架(react,vue,angular)之一,更适合开发灵活度高且复杂的应用
*   **dva** 主流的react应用状态管理工具，基于redux
*   **less** css预编译语言，轻松编写结构化分明的css
*   **umi** 基于react的前端集成解决方案
*   **antd** 地球人都知道的react组件库
*   **axios** 强大的前端请求库
*   **react-dnd** 基于react的拖拽组件解决方案，具有优秀的设计哲学
*   **qrcode.react** 基于react的二维码生成插件
*   **zarm** 基于react的移动端ui库，轻松实现美观的H5应用
*   **koa** 基于nodejs的上一代开发框架，轻松实现基于nodejs的后端开发
*   **@koa/router** 基于koa2的服务端路由中间件
*   **ramda** 优秀的函数式js工具库

需求分析
----

在思考需求分析之前我们先来看看**Dooring**的使用演示： ![](/images/jueJin/31e07640bd9a458.png) 由上面的gif图我们可以分析出，可视化编辑器主要有以下几部分组成：

*   可拖拽的组件库 draggable components
*   盛放组件的画布 canvas
*   组件编辑器 FormEditor
*   头部工具栏 toolBar

可拖拽组件我们可以用社区比较火的**react-dnd**，**react-draggable**来实现，由于我们的画布是可拖拽可放大缩小的，所以这里需要对画布赋能，具体实现可参考下文。

其次就是H5编辑器部分，这部分是核心功能，后面我们会详细分析。还有就是预览，生成预览链接，保存**json**文件， 保存模版这些功能本质上是对我们**json**文件的操作，可是目前可视化搭建技术的常用手段之一。先来看看这些功能的演示： ![](/images/jueJin/543dcd8339ee487.png)

基础准备
----

我们的**h5页面可视化编辑器**采用**umi**来作为脚手架工具.

> **umi**是可扩展的企业级前端应用框架,以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求.

这样我们不会关注繁琐的工程配置细节, 可以直接在项目中使用 **antd** 和 **less** 这些方案, 并且集成了目前比较流行的**css module**, 可以方便我们在项目里对**css**进行模块化开发. umi创建项目的具体使用流程如下:

```js
// 创建并进入工程目录
mkdir dooring && cd dooring
// 创建umi应用
yarn create @umijs/umi-app
// 安装依赖
yarn    // 或者使用npm install
```

简单的三步走策略就能轻松搭建我们的项目工程, 是不是省去了很多麻烦? (在使用这些方式之前我们首先确保自己本地的**node** 版本是 10.13 或以上)

在项目搭建完成之后我们调整一下目录结构, 具体如下:

```lua
dooring
├─ src
│  ├─ assets
│  │  └─ yay.jpg
│  ├─ components
│  ├─ layouts
│  │  ├─ __tests__
│  │  │  └─ index.test.js
│  │  ├─ index.css
│  │  └─ index.js
│  ├─ models
│  │  └─ editor.js
│  ├─ pages
│  │  ├─ __tests__
│  │  │  └─ index.test.js
│  │  ├─ editor
│  │  │  ├─ components
│  │  │  │  └─ FormEditor
│  │  │  │     ├─ index.js
│  │  │  │     └─ index.less
│  │  │  ├─ container.js
│  │  │  ├─ index.js
│  │  │  └─ index.less
│  │  ├─ index.css
│  │  └─ index.js
│  ├─ service
│  │  └─ editor.js
│  ├─ app.js
│  └─ global.css
├─ package.json
└─ webpack.config.js
```

page目录下的editor使我们的主页面, components存放我们的公共组件, models和service主要负责处理dva的状态管理逻辑, 其他部分大家可以更具需求自由定义.此处仅供学习参考.

在项目创建完之后我们还需要安装可视化方面必备的第三方组件, 笔者调研社区精选组件之后采用了一下方案:

*   **react-dnd** react拖拽组件
*   **react-color** react颜色选择组件,用于H5编辑器的编辑颜色部分
*   **react-draggable** 用于组件或者画布的拖拽移动
*   **react.qrcode** 基于react的二维码生成组件, 能以react组件的方式生成二维码

以上组件在运行项目前大家可以自行安装.

正文
--

在最好项目开发准备之后,我们就来开始设计我们的h5页面可视化编辑器－**Dooring**.

### H5编辑器实现

H5可视化编辑器主要需要4个部分,在文章开头也分析过, 这里用图来巩固一下: ![](/images/jueJin/5dd41aec53134d5.png) 以上是最基本也是最核心的功能展示模型,接下来我们会一一将其拆解并逐个实现.

#### 实现原理

我们都知道, 目前比较流行的页面可视化搭建方案可以有如下几种:

*   在线编辑代码实现
*   在线编辑json实现
*   无代码化拖拽实现(底层基于json配置文件)

笔者做了一下优缺点对比图,如下:

方案

定制化程度

缺点

在线编辑代码

最高

使用成本高,对非技术人员不友好,效率低

在线编辑json

较高

需要熟悉json,有一定使用成本, 对非技术人员不友好,效率一般

无代码化拖拽实现

高

使用成本低, 操作基本无门槛,效率较高

由以上分析来看, 为了开发一个低门槛, 对任何人适用的可视化编辑器, 笔者将采用第三种方案来实现, 目前市面上已有的产品也有很多, 比如说易企秀, 兔展, 百度H5等等. **实现原理其实还是基于json, 我们通过可视化的手段将自己配置的 页面转化为json数据,最后在基于json渲染器来动态生成H5站点**. ![](/images/jueJin/6aafb8a67c08442.png)

#### 数据结构设计

为了提供组件的自定义能力,我们需要定义一套高可用的数据结构, 这样才能实现因组件需求变更而带来的维护性优势.

在开始设计数据结构之前我们先来拆解一下模块: ![](/images/jueJin/de625f318fa247f.png) 不同的组件都对应不同的"编辑区域".我们需要设计一套统一的标准的配置来约定它, 这样对于表单编辑器的设计也非常有利, 具体拆解如下: ![](/images/jueJin/5ff742d89b46484.png)

经过以上分析之后, 笔者设计了类似下面的数据结构:

```js
    "Text": {
        "editData": [
            {
            "key": "text",
            "name": "文字",
            "type": "Text"
            },
                {
                "key": "color",
                "name": "标题颜色",
                "type": "Color"
                },
                    {
                    "key": "fontSize",
                    "name": "字体大小",
                    "type": "Number"
                    },
                        {
                        "key": "align",
                        "name": "对齐方式",
                        "type": "Select",
                            "range": [
                                {
                                "key": "left",
                                "text": "左对齐"
                                },
                                    {
                                    "key": "center",
                                    "text": "居中对齐"
                                    },
                                        {
                                        "key": "right",
                                        "text": "右对齐"
                                    }
                                ]
                                },
                                    {
                                    "key": "lineHeight",
                                    "name": "行高",
                                    "type": "Number"
                                }
                                ],
                                    "config": {
                                    "text": "我是文本",
                                    "color": "rgba(60,60,60,1)",
                                    "fontSize": 18,
                                    "align": "center",
                                    "lineHeight": 2
                                }
                            }
```

通过这种标准化结构设计之后,我们可以很方便的实现我们所需要的编辑页面的功能, 并且后期扩展非常方便, 只需要往editData添加配置即可. 至于动态表单编辑器的实现,方案有很多, 笔者之前也写过相关的文章, 这里就不详细介绍了.

[基于react搭建一个通用的表单管理配置平台（vue同）](https://juejin.cn/post/6844904137390292999 "https://juejin.cn/post/6844904137390292999")

#### 组件库设计

组件库设计考虑的一个重要的问题就是体积和渲染问题, 一旦组件库变的越来越多, 那意味着页面加载会非常慢,所以我们需要实现异步加载组件和代码分割的能力, umi提供了这样的功能,我们可以基于它提供的api去实现自己的额按需组件.

```js
import { dynamic } from 'umi';

    export default dynamic({
        loader: async function() {
        // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
        const { default: HugeA } = await import(/* webpackChunkName: "external_A" */ './HugeA');
        return HugeA;
        },
        });
```

通过以上的方式来定义包裹我们的每一个组件, 这样就能实现按需加载了, 但是最好的建议是不需要每个组件都按需加载和拆包,对于**标题**, **通知栏**,**页头**,**页脚**这些组件, 我们完全可以把它放在一个组里,这样不但对不会影响加载速度, 还能减少一定的http请求.

笔者这里简单举一个组件实现的例子，方便大家理解：

```js
    const Header = memo((props) => {
        const {
        bgColor,
        logo,
        logoText,
        fontSize,
        color
        } = props
        return <header className={styles.header} style={{backgroundColor: bgColor}}>
        <div className={styles.logo}>
        <img src={logo && logo[0].url} alt={logoText} />
        </div>
        <div className={styles.title} style={{fontSize, color}}>{ logoText }</div>
        </header>
        })
```

上面的Header组件的props属性完全是由我们之前设计的json结构来定义的，在用户编辑的过程中将收据收集并传给Header组件。最后一步是将这些组件动态传给**dynamic**组件， 这块在上文也介绍过了，大家可以根据自己的实现来做动态化渲染。

### 实现预览功能

预览功能这块比较简单, 我们只需要将用户生成的json数据丢进H5渲染器中即可, 这里我们需要做一个渲染页面单独用来预览组件. 先来看看几个预览效果: ![](/images/jueJin/582e67cb0a874be.png) ![](/images/jueJin/7c50d89f770f4ae.png) 前面的渲染器原理已经介绍了, 这里就不一一介绍了,感兴趣的可以交流讨论.

### 实现在线下载功能

在线下载这块我们需要用到一个开源库: **file-saver**, 专门解决前端下载文件困难的窘境. 具体使用举例:

```js
var FileSaver = require('file-saver');
var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(blob, "hello world.txt");
```

以上代码可以实现将传入的数据下载为txt文件, 如果是Blob, 是不是还能在线下载图片, html呢? 答案是肯定的, 所以我们的下载任务采用该方案来实现.

### 后端部分实现

后端部分由于涉及的知识点比较多, 不是本文考虑的重点, 所以这里大致提几个点, 大家可以用完全不同的技术来实现后台服务, 比如说**PHP**, **Java**, **Python**或者**Egg**. 笔者这里采用的是**koa**. 主要实现功能如下:

*   保存模板
*   真机原理的数据源存储
*   用户相关功能
*   H5图床和静态文件托管

具体代码可以参考笔者的另一篇全栈开发文章

[基于nodeJS从0到1实现一个CMS全栈项目](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")

模式基本一致.

github地址：[Dooring传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

后期规划
----

后期**Dooring**项目规划如下：

*   添加模版库模块
*   添加在线下载网站代码功能
*   丰富组件库组件，添加可视化组件
*   添加配置交互功能
*   组件细分和代码优化
*   添加typescript支持和单元测试

最新迭代功能
------

*   优化H5编辑器界面
*   添加可视化组件——进度条
*   修复win下预览样式问题，添加移动端访问出现提示页

最后
--

如果想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在《趣谈前端》一起学习讨论，共同探索前端的边界。

[🏆 技术专题第三期 | 数据可视化的那些事......](https://juejin.cn/post/6864072407461101582 "https://juejin.cn/post/6864072407461101582")

更多推荐
----

*   [Typescript核心知识点总结及项目实战案例分析](https://juejin.cn/post/6857123751205535751 "https://juejin.cn/post/6857123751205535751")
*   [快速在你的vue/react应用中实现ssr(服务端渲染)](https://juejin.cn/post/6845166890390667271 "https://juejin.cn/post/6845166890390667271")
*   [微前端架构初探以及我的前端技术盘点](https://juejin.cn/post/6844904113445011469 "https://juejin.cn/post/6844904113445011469")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")