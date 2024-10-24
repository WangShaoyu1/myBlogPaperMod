---
author: "徐小夕"
title: "前端推荐!从零开发一套基于React的加载动画库"
date: 2021-11-09
description: "之前在项目开发中经常会遇到需要开发各种各样加载动画的需求, 我们可以使用已有的动画库手动改造实现(比如说基于 loaderscss 手动改造), 也可以自己独立设计, 但是这意味着需要花一定的时间调"
tags: ["前端","JavaScript","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:31,views:4085,"
---
之前在项目开发中经常会遇到需要开发各种各样加载动画的需求, 我们可以使用已有的动画库手动改造实现(比如说基于 `loaders.css` 手动改造), 也可以自己独立设计, 但是这意味着需要花一定的时间调研和开发.

为了减少这部分的时间, 并让加载动画的设计更加简化和易用, 我开发了一款开箱即用的加载动画库 `react-loading`, 内置了多种风格的加载动画, 开发者可以轻松选择自己需要的动画, 并一键安装到自己的项目中, 简单又轻量.

接下来就和大家一起介绍一下这个动画库.

![image.png](/images/jueJin/dc4d03bc7a05463.png)

技术实现
----

`@alex_xu/react-loading` 是基于 `loaders.css` 二次封装的 `React` 加载动画组件库, 帮你轻松的在项目中使用不同风格的加载动画.

![demo.gif](/images/jueJin/4515f5119d764b4.png)

从技术上, 为了让使用者使用的更轻量简单, 我将 `loaders.css` 的每个动画样式和元素拆成了一个个动画组件, 并设计了相对灵活的 `api` 接口, 使得开发者可以更简单高效的使用, 如下:

### 组件设计

该动画组件库采用 `React Hooks` 和 `Typescript` 实现, 分为 `Loader` 容器 和 `Spining` .

`Loader` 容器主要是对加载动画做整体封装, 使得我们对 `Spining` 动画组件的使用更简单, `Spining` 主要提供动画 “骨架” . `Loader` 具体实现如下:

```jsx
import React from 'react';
import { ILoadingProp } from '../type';
import './index.less';

    const Loader: React.FC<ILoadingProp> = ({
    text,
    visible = true,
    textOffset,
    textColor,
    style,
    children,
        }) => {
        return visible ? (
        <div className="react-loader-wrap" style={style}>
    {children}
    {!!text && (
    <div
    className="react-loader-text-tip"
style={{ marginTop: `${textOffset}px`, color: textColor }}
>
{' '}
{text}{' '}
</div>
)}
</div>
) : null;
};

export default Loader;
```

`Spining` 动画组件主要是具体的动画内容, 这里我选取了 10 余种动画进行封装, 我举一个 `BallBeat` 的例子:

```jsx
import React, { memo } from 'react';
import Loader from '../Loader';
import { ILoadingProp } from '../type';
import './style';

export default memo(
    ({ text, style, color, textColor, size, visible }: ILoadingProp) => {
    return (
    <Loader text={text} style={style} visible={visible} textColor={textColor}>
    <div className="ball-scale">
    <div
        style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
    }}
    ></div>
    </div>
    </Loader>
    );
    },
    );
```

在项目中具体使用方式如下:

1.  安装

```bash
yarn add @alex_xu/react-loading
```

2.  使用

```js
import { BallPulse, BallClipRotate, SquareSpin } from '@alex_xu/react-loading';

export default () => <BallClipRotate text="H5-Dooring" />;
```

按需导入配置:

```js
    extraBabelPlugins: [
        [
        'babel-plugin-import',
            {
            libraryName: '@alex_xu/react-loading',
            libraryDirectory: 'es',
            camel2DashComponentName: false,
            style: true,
            },
            ],
            ],
```

后续会持续丰富加载动画库, 包括骨架屏动画等, 欢迎大家使用 并 star 支持~

更多优质项目推荐
--------

name

Description

[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

让 H5 制作像搭积木一样简单, 轻松搭建 H5 页面, H5 网站, PC 端网站, LowCode 平台.

[V6.Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fv6.dooring.public "https://github.com/MrXujiang/v6.dooring.public")

可视化大屏解决方案, 提供一套可视化编辑引擎, 助力个人或企业轻松定制自己的可视化大屏应用.

[dooring-electron-lowcode](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fdooring-electron-lowcode "https://github.com/MrXujiang/dooring-electron-lowcode")

基于 electron 的 H5-Dooring 编辑器桌面端.

[PC-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring")

网格式拖拽搭建 PC 端页面.

[DooringX](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx")

快速高效搭建可视化拖拽平台.