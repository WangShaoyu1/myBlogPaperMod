---
author: "网易云音乐技术团队"
title: "Web 端 RTL 适配实践"
date: 2024-03-08
description: "在业务全球化的进程中，我们会面对产品本地化的需求。本文在介绍云音乐出海业务中，Web 项目针对阿拉伯语、希伯来语等 RTL 语言的布局适配实践。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:19,comments:0,collects:25,views:7046,"
---
> 本文作者：杨彩芳

![](/images/jueJin/9681e15aa4544f6.png)

本文在介绍云音乐出海业务中，Web 项目针对阿拉伯语、希伯来语等 RTL 语言的布局适配实践。

前言
==

在业务全球化的进程中，我们会面对产品本地化的需求。在中东地区，许多国家使用阿拉伯语、希伯来语等语言，其书写和阅读习惯是从右向左（简称 RTL），与我们日常使用的中、英文环境中的从左向右（简称 LTR）阅读习惯相反。为了确保我们的产品在 RTL 语言用户中依然能够提供良好的体验，需要进行 RTL 适配。

RTL 布局概述
========

![MATERIAL DESIGN lrt-vs-rtl.png](/images/jueJin/651cc94c169347b.png) 如上图所示，左右两边分别展示了 RTL 和 LTR 的效果图。从图中我们可以直观地看出两者布局的区别：文本的对齐方向、主按钮和辅助按钮的排列方向、进度条的填充方向以及返回图标的方向是相反的，而其他图标则是相同的。具体总结如下：

LTR

RTL

文本

句子从左向右阅读

句子从右向左阅读

时间线

事件序列从左向右进行

事件序列从右向左进行

图像

从左向右的箭头表示向前运动：→

从右向左的箭头表示向前运动：←

了解了 RTL 布局的特点之后，我们可以开始考虑如何低成本地将线上已有场景的 UI 从 LTR 调整为 RTL。在将 UI 从 LTR 调整为 RTL（或反之）时，我们通常称之为镜像。

实现 RTL 的两种方案
============

transfrom
---------

基于 transform 的方案，是利用 CSS 的 transform 属性，通过设置 `transform: scaleX(-1);` 实现页面的水平翻转。

![transform-scalex.png](/images/jueJin/1b8f85c2878c43b.png)

如上图所示，通过翻转解决了布局问题，但文字和图像也被翻转。为了解决这个问题，对于不需要翻转的内容（如文字、非指向性图像），需要进行二次翻转。然而，该方案的缺点在于，首次翻转只需要处理根节点，而二次翻转则需要处理所有不需要翻转的元素，工作量较大。该方案的优点在于开发者无需修改 JS 逻辑。例如，通常情况下，左滑/左向箭头图标的点击事件在 RTL 时会将前进改为后退，右向将后退改为前进。

direction
---------

基于 direction 的方案，是利用 CSS 的 direction 属性，该属性用于设置文本、表格列和水平溢出的方向。通过将 direction 设置为 rtl 可以改变页面布局，在 html 标签上添加 `dir="rtl"` 与设置 direction 效果相同。我们通过一个简单的例子来具体了解设置为 `rtl` 的效果。

![ltr-rtl.png](/images/jueJin/8fdeb0a543f94e7.png)

如上图所示，设置为 `rtl` 之后，我们发现 UI 并没有完全兼容 RTL 场景。我们可以观察到，direction 在设置 `rtl` 之后只对部分属性进行了镜像处理：

*   如果元素没有预先定义过 `text-align`，那么该元素的文本会从向左对齐变成向右对齐，如果设置了 `left/center` 则 direction 的设置不会对其产生影响
    
*   `inline-block`、`flex`、`table`、`grid` 的布局方向被影响，`absolute` / `fixed`、`float`、`margin`、`padding` 无任何变化。
    

为了页面能够在 RTL 布局时正常呈现，我们需要对未被影响的属性调整。目前有以下两种方式可以解决这个问题。

**CSS 逻辑属性与逻辑值**

逻辑属性和逻辑值用抽象术语块向和行向描述其流向。块向尺度（`block`）是指与行内文本流向垂直的方向上的尺度。行向尺度（`inline`）是指与行内文本流向平行的方向上的尺度。LTR 布局时，`block-start` 对应 `top`，`block-end` 对应 `bottom`， `inline-start` 对应 `left`，`inline-end` 对应 `right`，`inline-size` 对应 `width`，`block-size` 对应 `height`。

通过改写为逻辑属性，可以同时适配 LTR 和 RTL 布局，无需专门为 RTL 布局进行适配。例如，将 `margin-left` 改写成 `margin-inline-start`，将 `left: 0;` 改写成 `inline-start: 0;`。我们只需要全局替换需要调整的行向尺度的 CSS 属性即可。然而，使用逻辑属性存在两个问题：一方面是浏览器的兼容性问题（B 端项目可以考虑使用，浏览器兼容性较好），另一方面开发者只能处理本地代码，无法处理 npm 包中的代码。

**CSS 翻转工具**

另一个方案是使用 CSS 转换工具（[rtlcss](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Frtlcss "https://www.npmjs.com/package/rtlcss")、[css-flip](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcss-flip "https://www.npmjs.com/package/css-flip")），按照 RTL 布局对 CSS 代码进行转换，例如将 `margin-left` 改写成 `margin-right`，将 `left: 0;` 改写成 `right: 0;`。我们可以在代码构建过程中使用这类工具，自动将 CSS 代码转换为对应的 RTL 布局代码，这样开发者仍然可以按照 LTR 的布局书写代码。

与 CSS 逻辑属性相比，使用 CSS 转换工具是更好的选择。通过这种方案，可以完美解决布局镜像的问题。然而，direction 还存在另一个缺点，即它仅适用于 CSS，涉及 JS 就无能为力。

方案选择
----

我们希望以较低的成本改造线上已有的 UI 场景，以支持 RTL 布局。大部分业务内容中的文本和图片无需翻转，因此使用 transform 方案逐一适配这部分内容会带来大量工作量，需要编写大量影响业务逻辑的代码。在业务迭代过程中，开发人员需要不断处理二次翻转的问题。相比之下，使用 direction 方案能减少开发者对哪些模块需要翻转的关注，只需对个别组件的 JS 逻辑进行适配。在权衡利弊后，我们选择了基于 direction 的方案。接下来，我们对该方案进行细化和完善。

基于 direction 通用适配方案
===================

direction 设置
------------

首先，我们要基于用户语言，在 html 标签设置属性 dir。语言的获取可以从 `URL` 的 `search` 属性或 `cookie`。我们提供一个工具库进行初始化设置，同时提供了更新方法 `setDirecion`、根据语言判断是否需要 RTL 布局的工具函数 `isRTL`。

```ts
import { Cookie } from '@music/helper';
import { parse } from '@music/mobile-url';

const rtlLngs = ['ar-EG', 'he_IL'];

    export default class RTL {
    private lng: string;
    
        constructor(lng?: string) {
        this.lng = lng || '';
            if (typeof window !== 'undefined') {
            const { location } = (window as Window);
                if (!this.lng) {
                this.lng = (parse(location.search) as any).language || Cookie.get('language') || 'en-US';
            }
            document.documentElement.setAttribute('dir', rtlLngs.includes(this.lng) ? 'rtl' : 'ltr');
        }
    }
    
        setDirecion(lng?: string) {
        this.lng = lng || '';
        document.documentElement.setAttribute('dir', rtlLngs.includes(this.lng) ? 'rtl' : 'ltr');
    }
    
        static isRTL(lng?: string) {
        if (lng) return rtlLngs.includes(lng);
            if (typeof window !== 'undefined') {
            const { location } = (window as Window);
            const l = (parse(location.search) as any).language || Cookie.get('language') || 'en-US';
            return rtlLngs.includes(l);
        }
        return false;
    }
}
```

使用时非常简单，在页面入口文件引入该模块即可。

```js
import RTL from '@music/tl-rtl';
new RTL();
```

SSR 无法从 `document` / `window` 获取 `cookie` / `URL` 的 `search` 属性，所以需要通过 `getInitialData` 获取存储在 store 中，然后通过 Helmet 设置 html 的 dir 属性。

```js
import { createUrl, parse } from '@music/mobile-url';

// 获取 isRTL 并存储 store
    static getInitialData({ req }) {
    const { url, header } = req;
    
    const cookieLng = headers?.cookie
    ?.split(';')
    .map((c) => c?.split('='))
    ?.find((c) => c[0]?.trim() === 'language')?.[1];
    
    const lng = parse(createUrl(url).search).language || cookieLng || 'en-US';
    
    const isRTL = RTL.isRTL(lng);
    ... // 选择合适的 store 方案存储 isRTL 值
}
``````jsx
import { Helmet, HelmetProvider } from 'react-helmet-async';

// 从 store 获取 isRTL 并设置 html dir
    function App ({ isRTL }) {
    return (
    <HelmetProvider>
    <div>
    <Helmet>
    <html dir={isRTL ? 'rtl' : 'ltr'} />
    </Helmet>
    ...
    </div>
    </HelmetProvider>
    );
}
```

PostCSS Plugin 配置
-----------------

接下来就需要转换 CSS 代码适配 RTL。前面我们说到了选用 CSS 转换工具处理 CSS 代码这一步最好在构建过程中完成，[postcss-rtlcss](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Felchininet%2Fpostcss-rtlcss%2Ftree%2Fmaster%3Ftab%3Dreadme-ov-file%23postcss-rtlcss "https://github.com/elchininet/postcss-rtlcss/tree/master?tab=readme-ov-file#postcss-rtlcss")（基于 rtlcss）很好的满足了这一特点，它作为 PostCSS 插件可以在 webpack 构建过程中可以将所有本地代码和 npm 包中的 CSS 文件统一处理。

下面是 postcss-rtlcss 的使用方式，及一些关键参数的解析。

```js
import { postcssRTLCSS } from 'postcss-rtlcss';
import { Mode } from 'postcss-rtlcss/options';

    const defaultOptions = {
    mode: Mode.combined,
    ignorePrefixedRules: true,
    ltrPrefix: '[dir="ltr"]',
    rtlPrefix: '[dir="rtl"]',
    bothPrefix: '[dir]',
    };
        const options = {
        ...defaultOptions,
        safeBothPrefix: true,
        processUrls: true,
        processKeyFrames: true,
        useCalc: true,
        };
        
            export default {
                module: {
                    rules: [
                        {
                        test: /\.css$/,
                            use: [
                            ...
                            { loader: 'css-loader' },
                                {
                                loader: 'postcss-loader',
                                    options: {
                                        postcssOptions: {
                                            plugins: [
                                            postcssRTLCSS(options)
                                        ]
                                    }
                                }
                            }
                            ...
                        ]
                        },
                    ]
                }
            }
```

**mode**

该参数控制了 CSS 的生成方式，三种模式分别输出的 CSS 代码如下所示。

```css
/* input */
    .test1 {
    width: 10px;
    padding: 10px;
}
    .test2 {
    padding-right: 20px;
}

/* output Mode.diff */
    .test1 {
    width: 10px;
    padding: 10px;
}
    .test2 {
    padding-left: 20px;
    padding-right: 0;
}

/* output Mode.override */
    .test1 {
    width: 10px;
    padding: 10px;
}
    .test2 {
    padding-right: 20px;
}
    [dir="rtl"] .test2 {
    padding-left: 20px;
    padding-right: 0;
}

/* output Mode.combined */
    .test1 {
    width: 10px;
    padding: 10px;
}
    [dir="ltr"] .test2 {
    padding-right: 20px;
}
    [dir="rtl"] .test2 {
    padding-left: 20px;
}
```

我们的需求是用一份代码根据语言同时适配 LTR 和 RTL 布局。`Mode.diff` 模式会将 CSS 代码转换为 RTL 布局的代码，无法同时适配两种布局，因此首先排除。另外两种模式 `Mode.override`、`Mode.combined` 则可以生成两种布局的代码。然而，`Mode.override` 模式在样式覆盖的情况下转换处理会出现一些问题。如上所示，在 RTL 布局时 `padding-right`最终生效值是 `0`，与期望的 `10px` 不符。为了符合预期，我们需要给 `.test2` 增加一行代码 `padding-left: 10px;`。而 `Mode.combined` 模式无需额外处理现有代码即可生成符合预期的代码。

因此，我们最终选择 `Mode.combined` 模式，该模式会将需要处理的 CSS 代码生成两份，以便在渲染时对应生效。接下来的 demo 输出的 CSS 都是基于此模式。

**safeBothPrefix**

该参数设置为 `true` 时 CSS 输出结果如下所示，即会给不需要翻转的方向性 CSS 属性类名增加 `bothPrefix`（`[dir]`）。在 `class="test1 test2"` 时，可以按照 CSS 书写顺序使得 `.test2` 的 `padding` 样式能正确覆盖 `.test1` 的。设置为 `false` 时输出的 `.test2` 的规则名保持不变，不会变成 `[dir] .test2` ，按照 CSS 选择器权重会导致最终生效的是 `[dir="ltr"].test1` / `[dir="rtl"].test1` 对应的 `padding` 样式，与期望不符。

```css
/* input */
    .test1 {
    padding: 0 10px 0 20px;
}
    .test2 {
    padding: 0 20px;
}

/* output */
    [dir="ltr"] .test1 {
    padding: 0 10px 0 20px;
}
    [dir="rtl"] .test1 {
    padding: 0 20px 0 10px;
}
    [dir] .test2 {
    padding: 0 20px;
}
```

**processUrls**

该参数控制是否按照字符串映射来翻转更改 URL 中的字符串，例如 `ltr` `left`。当设置为 `false` 不会处理 URL 地址，当设置为 `true` 会翻转处理如下所示。

```css
/* input */
    .test {
    background-image: url("./img/ltr/arrow-left.png");
}

/* output */
    [dir="ltr"] .test {
    background-image: url("./img/ltr/arrow-left.png");
}
    [dir="rtl"] .test {
    background-image: url("./img/rtl/arrow-right.png");
}
```

**ignorePrefixedRules**

该参数值为 `true` 会忽略 CSS 选择器中包含 `rtlPrefix`、`ltrPrefix`、`bothPrefix` 的 CSS 规则，不进行转换。当设置为 `false` 会被转换为如下所示，导致 CSS 选择器无法匹配，从而使样式失效。

```css
/* input */
    [dir="rtl"] .test {
    left: 10px;
}

/* output */
    [dir="ltr"] [dir="rtl"] .test {
    left: 10px;
}
    [dir="rtl"] [dir="rtl"] .test {
    right: 10px;
}
```

前文我们说到，指向性图像需要在 RTL 布局时翻转，而 **ignorePrefixedRules** 和 **processUrls** 恰好可以用来处理这种情况。**processUrls** 适用于本地资源，本地存放 2 份资源图片即可；**ignorePrefixedRules** 可同时作用于远程资源，增加下面的全局样式（该样式不会被转换，且仅在 RTL 布局生效），并给需要翻转的图片增加 `flip-img` 类名即可。

```css
    [dir="rtl"] .filp-img {
    transform: scaleX(-1);
}
```

**useCalc**

该参数控制是否翻转 `background-position-x` 和 `transform-origin` ，当设置为 false 时不处理，当设置 `true` 会被转换为如下所示。

```css
/* input */
    .test {
    background-position-x: 5px;
    transform-origin: 10px 20px;
}

/* output */
    [dir="ltr"] .test {
    background-position-x: 5px;
    transform-origin: 10px 20px;
}
    [dir="rtl"] .test {
    background-position-x: calc(100% - 5px);
    transform-origin: calc(100% - 10px) 20px;
}
```

**processKeyFrames**

该参数控制是否翻转关键帧动画中的样式规则，考虑到动画中也会存在左右移动的情况，设置为 `true`。

更多参数设置可以查看 [options](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Felchininet%2Fpostcss-rtlcss%2Ftree%2Fmaster%3Ftab%3Dreadme-ov-file%23options "https://github.com/elchininet/postcss-rtlcss/tree/master?tab=readme-ov-file#options")了解。

避免内连样式
------

由于 postcss-rtlcss 插件只处理样式文件，所以 CSS 都要书写在样式文件中，如非必要，不要使用如下内联样式，

```jsx
<div style={{ marginLeft: 10 }}>
...
</div>
```

如果必须使用内联样式，比如说需要在 JS 中计算 CSS 属性值，需要业务自行适配 RTL 布局。

第三方库的适配
-------

在业务开发时我们通常会用到一些三方组件，例如 `antd`、`Swiper`，我们需要考虑这些组件如何适配 RTL。

**antd**

`antd` 已经支持了 RTL 布局，需要进行如下配置即可（本文讨论的 `antd` 基于 4.x 版本）。

```jsx
import { ConfigProvider } from 'antd';

export default ({ isRTL }) => (
<ConfigProvider direction={isRTL ? 'rtl' : 'ltr'}>
<App />
</ConfigProvider>
);
```

配置之后我们发现展示结果与期望不符，排查发现是因为 `antd` 已经根据 direction 对组件的类名和 CSS 样式做了镜像处理。

```js
// ltr
<Component className="ant-xxx" />

// rtl
<Component className="ant-xxx ant-xxx-rtl" />
``````css
    .ant-xxx {
    margin: 0 8px 0 0;
}

    .ant-xxx.ant-xxx-rtl {
    margin-left: 8px;
    margin-right: 0;
}
```

在配置 `postcss-rtlcss` 插件之后，CSS 代码会被处理成下面的代码，导致在 RTL 布局时，根据书写顺序和 CSS 选择器优先级最终按照 `[dir="rtl"].ant-xxx.ant-xxx-rtl` 渲染，导致结果错误。

```css
/* output */
    [dir="ltr"] .ant-xxx {
    margin: 0 8px 0 0;
}
    [dir="rtl"] .ant-xxx {
    margin: 0 0 0 8px;
}

    [dir="ltr"] .ant-xxx.ant-xxx-rtl {
    margin-left: 8px;
    margin-right: 0;
}
    [dir="rtl"] .ant-xxx.ant-xxx-rtl {
    margin-right: 8px;
    margin-left: 0;
}
```

所以，在配置 `postcss-rtlcss` 插件时需要将 `antd` 的样式资源 `exclude`，保证其 CSS 资源不被镜像处理。

**Swiper**

`Swiper` 组件也适配了 RTL 布局，只需要在其祖先节点设置 `dir="rtl"` 即可，而我们的方案就是在 html 标签设置 dir，无需要额外处理。

其他涉及 JS 层面需要适配 RTL 的私有组件需要开发者获取 dir 的值，并对组件进行适配改造。

快捷工具
----

在开发调试过程中，我们提供了一个语种快速切换工具，便于预览对应的 LTR 和 RTL 的布局效果。

![rtl-helper.jpg](/images/jueJin/487a7530f8494ad.png)

该工具的具体实现如下：

```jsx
import React, { useCallback } from 'react';
import reactDOM from 'react-dom';
import Select from 'antd/lib/select';
import { parse, stringify } from '@music/mobile-url';
import { Cookie } from '@music/helper';

const rtlLngs = ['ar-EG', 'he_IL'];
    const i18nMap = {
    'zh-CN': '简体中文',
    'en-US': '英文',
    'ar-EG': '阿拉伯语',
    };
    
    // 创建语种切换组件
        const SwitchLng = ({ lngs }) => {
        const lng = parse(window.location.search).language || Cookie.get('language') || 'en-US';
        
            const handleSwitch = useCallback((l) => {
            // cookie 更新语种
            Cookie.set('language', l);
            
            // 替换 url 语种参数并 reload 页面
            const searchStrs = parse(window.location.search) || {};
            searchStrs.language = l;
            const { origin, pathname } = window.location;
            window.location.href = `${origin}${pathname}?${stringify(searchStrs)}`;
            }, []);
            
            return (
            <Select
        style={{ position: 'fixed', bottom: 10, left: 10, width: 140 }}
    defaultValue={lng}
    onChange={handleSwitch}>
    {lngs.map((l) => (
    <Select.Option value={l}>
{i18nMap[l]}
{rtlLngs.includes(l) && (
<span style={{ color: 'red', marginLeft: 5 }}>RTL</span>
)}
</Select.Option>
))}
</Select>
);
};

    class RTLHelper {
        constructor(lngs) {
        const l = (lngs || []).map((e) => e.replace('_', '-'));
        const allLngs = ['en-US', 'ar-EG', 'zh-CN'].concat(l);
        this.supportLngs = [...new Set(allLngs)];
        this.renderDOM();
    }
    
    // 渲染组件到页面中
        renderDOM() {
        const btn = document.createElement('div');
        document.body.appendChild(btn);
        reactDOM.render(<SwitchLng lngs={this.supportLngs} />, btn);
    }
}
export default RTLHelper;
```

使用时在 dev 文件中引用即可。

```js
import RTLHelper from '@music/tl-rtl/helper';
new RTLHelper();
```

总结
==

本文介绍了云音乐出海业务中 Web 项目对 RTL 语言的适配实践，并总结为一套通用高效的方案。该方案使开发者在处理业务需求时无需过多关注样式适配问题，为开发者提供了便捷高效的开发体验。

参考资料
====

*   [MATERIAL DESIGN - Bidirectionality](https://link.juejin.cn?target=https%3A%2F%2Fm2.material.io%2Fdesign%2Fusability%2Fbidirectionality.html%23mirroring-layout "https://m2.material.io/design/usability/bidirectionality.html#mirroring-layout")
*   [CSS direction](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2Fdirection "https://developer.mozilla.org/en-US/docs/Web/CSS/direction")
*   [CSS 逻辑属性](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS%2FCSS_logical_properties_and_values%2FBasic_concepts_of_logical_properties_and_values "https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_logical_properties_and_values/Basic_concepts_of_logical_properties_and_values")
*   [postcss-rtlcss](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Felchininet%2Fpostcss-rtlcss "https://github.com/elchininet/postcss-rtlcss")

最后
==

![image.png](/images/jueJin/9ec484084567403.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")