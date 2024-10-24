---
author: "徐小夕"
title: "做了N+1个企业项目之后, 我总结了这些React必备插件"
date: 2021-02-02
description: "为了提高大家开发 React 项目的效率, 笔者结合自己的实际工作经验, 汇总如下React项目常用插件 1 状态管理 2 UI组件库 React desktop 基于React的JavaScript库，旨在将本机桌面体验带入网络，其中包含许多macOS Sierra和W…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:628,comments:0,collects:1000,views:15462,"
---
为了提高大家开发 `React` 项目的效率, 笔者结合自己的实际工作经验, 汇总如下`React`项目常用插件.

### 1\. 状态管理

![](/images/jueJin/b459fe583288465.png)

*   **Redux** `JavaScript` 状态容器，提供可预测化的状态管理
*   **MobX** 通过函数响应式编程使得状态管理变得简单和可扩展
*   **Redux Thunk** `Redux`的异步处理中间件
*   **Redux Saga** `Redux`中间件,用于管理应用程序 `Side Effect`(副作用，例如异步获取数据，访问浏览器缓存等)
*   **Dva** 一个基于 `redux` 和 `redux-saga` 的数据流方案

### 2\. UI组件库

![](/images/jueJin/0cd409d9695343c.png)

*   **Ant design** 基于 `Ant Design` 设计体系的 `React UI` 组件库，主要用于研发企业级中后台产品
*   **Ant design mobile** 基于 `Ant Design` 设计体系的 `React UI` 移动端组件库
*   **MaterialUI** 世界最受欢迎的基于质感设计的`React UI`库
*   **React toolbox** 一套使用`CSS`模块功能实现`Google`的`Material Design`规范的`React`组件
*   **React Virtualized** 一个能渲染大型列表和表格的`React`解决方案
*   **Fabric UI** 微软开源的`UX`框架的集合，用于创建共享代码，设计和交互行为的精美的跨平台应用程序
*   **React desktop** 基于`React`的`JavaScript`库，旨在将本机桌面体验带入网络，其中包含许多`macOS Sierra`和`Windows 10`组件。`react-desktop`与`NW.js`和`Electron.js`完美结合，但是可以在任何`JavaScript`驱动的项目中使用
*   **Zent** 有赞 PC 端 `WebUI` 规范的 `React` 实现，提供了一整套基础的 UI 组件以及一些常用的业务组件
*   **react-icons** 基于`React`封装的丰富的图标库

### 3\. 工具类

![](/images/jueJin/e87e13415169482.png)

*   **react-copy-to-clipboard** 基于`React`的复制到剪切板组件
*   **qrcode.react** 基于**React**的生成二维码的组件
*   **nprogress** 适用于`YouTube`，`Medium`等的顶部进度条组件
*   **react-syntax-highlighter** 基于`React`的代码高亮组件
*   **react-contextmenu** 右键菜单组件
*   **emoji-mart** 基于`React`的表情库
*   **react-highlight-words** 基于`React`的关键字高亮

### 4\. 数据可视化

![](/images/jueJin/d19cd7013535472.png)

*   **AntV** 包含 `G2`、`G6`、`F2`、`L7` 以及一套完整的图表使用和设计规范, 提供强大的数据可视化需求
*   **G2Plot** 基于`G2`封装的开箱即用的可视化组件库
*   **recharts** 使用`React`和`D3`构建的自定义的图表库
*   **Viser** 支持多种主流框架的可视化库

### 5\. 动画/动效果

![](/images/jueJin/f14879e2348647a.png)

*   **Halogen** 使用`React`的加载动画集合
*   **react-move** 漂亮的，数据驱动的`React`动画,只需3.5kb（gzip）
*   **react-spring** 一个基于弹簧物理学的动画库
*   **Ant Motion** 提供了单项，组合动画，以及整套动画解决方案
*   **scenejs** 基于`JavaScript`和`CSS`时间轴的动画库
*   **react-text-loop** 文字轮播动画

### 6\. 拖拽/排序

![](/images/jueJin/ebee62766a8a49b.png)

*   **react-beautiful-dnd** 漂亮,可移植性 列表拖拽库
*   **react-dnd** 可帮助我们构建复杂的拖放界面，同时保持组件的分离
*   **react-moveable** 支持自由拖拽, 缩放, 参考线的灵活强大的拖拽库
*   **react-grid-layout** 强大的网格拖拽排序缩放库
*   **mixitup** 强大的列表卡片排序动画库

### 7\. 图像处理

![](/images/jueJin/dc377b710b64451.png)

*   **react-image-crop** 强大的图片裁切库
*   **react-sparklines** 基于数据自动生成趋势线
*   **dom-to-image** 基于`dom`生成图片的`canvas`库
*   **react-img-editor** 图片编辑器

### 8\. 编辑器相关

![](/images/jueJin/bb64214c80f340e.png)

*   **braft-editor** 富文本编辑器
*   **powerNice** markdown/富文本编辑器
*   **GGEditor** 可视化图编辑器
*   **react-codemirror2** 代码编辑器
*   **jsoneditor** json编辑器
*   **h5-dooring** H5页面编辑器

### 9\. 地图相关

![](/images/jueJin/0c7c309377834e0.png)

*   **google-map-react** 谷歌地图插件
*   **react-amap** 高德地图插件
*   **@uiw/react-baidu-map** 百度地图

### 10\. 脚手架

![](/images/jueJin/0c0b473c238e432.png)

*   **Create React App** 初学者必备`React`傻瓜式脚手架
*   **Next.js** 构建服务端渲染的`React`脚手架
*   **umi** 企业级前端应用框架
*   **webpack3\_react** 兼容`IE9+`且提供完整的`React`全家桶解决方案

最后
--

笔者已将文档同步到 github, 地址如下:

*   [React开发之路](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Ffrontend-developer-roadmap%2Fblob%2Fmain%2FReact.md "https://github.com/MrXujiang/frontend-developer-roadmap/blob/main/React.md")
*   [前端高效开发必备的 js 库梳理](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Ffrontend-developer-roadmap "https://github.com/MrXujiang/frontend-developer-roadmap")

目前 [**H5-Dooring**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring") 可视化编辑器也成功更新了开发和部署文档 ,感兴趣的朋友可以感受了解一下.