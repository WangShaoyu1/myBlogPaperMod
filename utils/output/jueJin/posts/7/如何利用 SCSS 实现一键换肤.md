---
author: "政采云技术"
title: "如何利用 SCSS 实现一键换肤"
date: 2022-02-09
description: "前言 在项目开发过程中，我们有时候遇到需要更换站点主题色的需求。乃至于 APP 底部的 banner 中的 icon、文案和背景图都是运营线上可配置的。还有的功能比如更换系统字体大小等。 这些本质上都"
tags: ["前端","SCSS","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:280,comments:0,collects:445,views:20560,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![沧澜.png](/images/jueJin/0f8d8fcd650d414.png)

> 这是第 133 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[如何利用 SCSS 实现一键换肤](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Ftheme-scss "https://zoo.team/article/theme-scss")

前言
--

在项目开发过程中，我们有时候遇到需要**更换站点主题色**的需求。乃至于 APP 底部的 banner 中的 icon、文案和背景图都是运营**线上可配置的**。还有的功能比如**更换系统字体大小**等。

这些本质上都是 CSS 的**动态渲染**的需求。如果在开发过程中**写死 CSS 样式**的话在面对这样的需求的时候就会真·痛苦面具了。所以我们需要提前定义**一整套 CSS 的环境变量体系**，在开发过程中就使用这套体系，未雨绸缪才能立于不败之地。

这里我们用到 **SCSS**（Sassy CSS）来实现这套体系。 SASS 是 CSS 的**预处理器**，由 Ruby 编写。一开始并不支持 {} 和这种原生 CSS 的写法，缩进也严格控制，增加了开发者的使用成本。具体的区别可以看下面这张 gif 图。

![](/images/jueJin/86cad8f9d2f64b8.png)

但是由 SASS3 开始引入的 SCSS 语法完全兼容现有的 CSS 语法，能够在生成真正的 CSS 文件之前预处理一些逻辑，比如变量，循环，嵌套，混合，继承，导入等，使其在逻辑上能够拥有部分 JS 的特性。

我们可以在[这个网址](https://link.juejin.cn?target=https%3A%2F%2Fwww.sassmeister.com%2F "https://www.sassmeister.com/")在线查看编译的 SCSS 编译成 CSS 之后的代码。

整体项目效果
------

切换主题色之后，能够按照选择的主题色进行不同的展示。 如下图展示。

![](/images/jueJin/208a4e0c6c22469.png)

项目目录结构
------

```scss
src
├── App.vue
├── main.js
├── router
│   └── index.js
├── store
│   └── index.js
├── style
│   ├── settings
│   │   └── variable.scss  // 样式变量定义文件
│   └── theme
│       ├── default
│       ├── index.scss // 主题入口文件
│       └── old
└── views
├── Home.vue // 主题切换页面
├── List.vue
└── Mine.vue
```

废话不多说。我们直接开干吧。

环境准备
----

首先我们需要安装 scss 解析环境

```less
npm i sass
// 注意 sass-loader 安装需要指定版本 如果安装最新版本会报错 this.getOptions 这个方法未定义
npm i -D sass-loader@10.1.0
// 利用 normalize.css 初始化页面样式
npm i -S normalize.css
```

定义变量
----

我们需要提前把一些常用的主题色，字体大小，以及边距这种与视觉沟通好，然后定义对应的变量。这里我参考资料贴了一套自定义的颜色变量。当然里面的具体颜色可以根据需求动态调整。

### 小技巧

这里讲一个小技巧，定义的时候可以先定义一个**基准变量** base-param 然后其他状态的值可以依赖这个 base-param 进行缩放或放大实现。比如不同大小规模的字体可以采用这种方法。

```scss
// 行高
$line-height-base: 1.5 !default;
$line-height-lg: 2 !default;
$line-height-sm: 1.25 !default;
``````scss
// ./style/settings/variable.scss

// 字体颜色
$info: #17a2b8 !default;
$danger: #dc3545 !default;

// 字体大小 浏览器默认16px
$font-size-base: 1rem !default;
$font-size-lg: $font-size-base * 1.25 !default;
$font-size-slg: $font-size-base * 1.75 !default;

// 字重
$font-weight-normal: 400 !default;
$font-weight-bold: 600 !default;
```

定义主题
----

我们目前接到的需求是适老化改造，目前市场上大多数的项目字体都比较小，对老年人用户不太友好。所以针对老年人用户需要放大系统字体，方便他们查看。你也可以根据自己的需求进行不同的主题定制。

**定义一个入口文件**

```scss
// ./style/theme/index.scss

@import "../settings/variable.scss";

$themes-color: (
default: (
// 全局样式属性
color: $info,
font-weight: $font-weight-normal,
font-size: $font-size-lg,
),
old: (
color: $danger,
font-weight: $font-weight-bold,
font-size: $font-size-slg,
),
);
// ... 可自定义其他主题
```

**vue.config.js 配置项处理**

我们不想每次都引入 CSS 变量，可以里在配置项中利用 CSS 插件自动注入全局变量样式。

```js
// vue.config.js

    module.exports = {
        css: {
            loaderOptions: {
                scss: {
                // 注意: 在 sass-loader v8 中，这个选项是 prependData
                additionalData: `@import "@/style/theme/index.scss";`,
                },
                },
                },
                };
```

主题色切换
-----

主题色定义好之后就需要对他进行切换了。这也是**一键换肤**最核心的逻辑。

*   **在 App.vue 文件下的 mounted 中将 body 添加一个自定义的 data-theme 属性，并将其设置为 default**

```vue
// App.vue mounted() { document .getElementsByTagName("body")[0]
.setAttribute("data-theme", "default"); },
```

*   **利用 webpack 自定义插件遍历主题目录文件，自动生成自定义主题目录数组**

```js
// vue.config.js
const fs = require("fs");
const webpack = require("webpack");

// 获取主题文件名
const themeFiles = fs.readdirSync("./src/style/theme");
let ThemesArr = [];
    themeFiles.forEach(function (item, index) {
    let stat = fs.lstatSync("./src/style/theme/" + item);
        if (stat.isDirectory() === true) {
        ThemesArr.push(item);
    }
    });
    
        module.exports = {
        css: {...},
            configureWebpack: (config) => {
                return {
                    plugins: [
                    // 自定义webpack插件
                        new webpack.DefinePlugin({
                        THEMEARR: JSON.stringify(ThemesArr),
                        }),
                        ],
                        };
                        },
                        };
```

*   **切换 js 逻辑实现**

**初始化页面的时候，获取到默认主题**

```js
// Home.vue
    mounted() {
    this.themeValue = THEMEARR;
    this.currentThemeIndex = this.themeValue.findIndex(
    (theme) => theme === "default"
    );
    this.currentTheme = this.themeValue[this.currentThemeIndex];
    },
    
    
```

**把选择的主题赋值给自定义属性 data-theme**

```js
// Home.vue

// 核心切换逻辑
    methods: {
        onConfirm(currentTheme) {
        this.currentTheme = currentTheme;
        this.showPicker = false;
        this.currentThemeIndex = this.themeValue.findIndex(
        (theme) => theme === currentTheme
        );
        document
    .getElementsByTagName("body")[0]
    .setAttribute("data-theme", THEMEARR[this.currentThemeIndex]);
    },
}

```

### CSS 版本如何实现主题色切换

可能大家不太了解，CSS 也是可以支持自定义属性的，这就为我们定义属性变量提供了基础。他通过在自定义属性之前加上前缀 **\--** 来实现。

```css
    body {
    --foo: #7f583f;
    --bar: #f7efd2;
}
```

首先想到的就是给标签添加自定义主题属性 data-theme,再通过 css 属性选择器+命名空间来找到指定的元素并替换不同的主题色。这里采用的 t-文件名-含义类名来命名，防止样式冲突。

```css
// ./default.scss
// 也可以换成其他的自定义变量颜色
[data-theme="default"] .t-list-title,
[data-theme="default"] .t-list-sub-title,
    [data-theme="default"] .t-list-info {
    color: var(--foo);
    font-weight: 400;
    font-size: 1rem * 1.25;
}

// ./old.scss
// 也可以换成其他的自定义变量颜色
[data-theme="old"] .t-list-title,
[data-theme="old"] .t-list-sub-title,
    [data-theme="old"] .t-list-info {
    color: var();
    font-weight: 600;
    font-size: 1rem * 1.75;
}
``````vue
// ./List.vue
<template>
<div class="home">
<div class="container" v-for="(item, index) in 3" :key="index">
<div class="t-list-title">标题</div>
<div class="t-list-sub-title">副标题</div>
<div class="t-list-info">
这是一段很长的详情信息这是一段很长的详情信息这是一段很长的详情信息这是一段很长的详情信息这是一段很长的详情信息这是一段很长的详情信息这是一段很长的详情信息
</div>
</div>
</div>
</template>
```

### Scss 版本如何实现主题色切换

#### Scss 前置知识

在使用 sass 之前，需要知道一些知识点。

*   使用@each 循环
    
    1.循环一个 list: 类名为 icon-10px 、icon-12px、icon-14px 写他们的字体大小写法就可以如下：
    

![](/images/jueJin/988e776c0c83446.png)

2、循环一个 map：类名为 icon-primary、icon-success、icon-secondary 等，但是他们的值又都是变量，写法如下：

![](/images/jueJin/89edd2eb57d94eb.png)

*   map-get

map-get(map,key) 函数的作用是根据 key 参数，返回 key 在 map 中对应的 value 值。如果 key 不存在 map 中，将返回 null 值。此函数包括两个参数：

map：定义好的 map。 key：需要遍历的 key。

假设要获取 facebook 键值对应的值 #3b5998，我们就可以使用 map-get() 函数来实现：

![](/images/jueJin/70c01074ab404f0.png)

*   使用&嵌套覆盖原有样式

当一个元素的样式在另一个容器中有其他指定的样式时，可以使用嵌套选择器让他们保持在同一个地方。`.no-opacity &`相当于`.no-opacity .foo`。

![](/images/jueJin/105bd1160dbd4a8.png)

*   map-merge

合并两个 map 形成一个新的 map 类型，即将 _map2_ 添加到 _map1_的尾部

```scss
$font-sizes: ("small": 12px, "normal": 18px, "large": 24px)
$font-sizes2: ("x-large": 30px, "xx-large": 36px)
map-merge($font-sizes, $font-sizes2)
结果: "small": 12px, "normal": 18px, "large": 24px,
"x-large": 30px, "xx-large": 36px
```

*   @content

`@content` 用在 `mixin` 里面的，当定义一个 `mixin` 后，并且设置了 `@content`； `@include` 的时候可以传入相应的内容到 `mixin` 里面

![](/images/jueJin/d7369e9cb63e434.png)

#### 综合使用

**定义混合指令,切换主题,并将主题中的所有规则添加到 theme-map 中**

```less
// ./Home.vue

    @mixin themify() {
        @each $theme-name, $map in $themes-color {
        // & 表示父级元素  !global 表示覆盖原来的
            [data-theme="#{$theme-name}"] & {
            $theme-map: () !global;
            // 循环合并键值对
                @each $key, $value in $map {
                $theme-map: map-merge(
                $theme-map,
                (
                $key: $value,
                )
                ) !global;
            }
            // 表示包含 下面函数 themed()
            @content;
        }
    }
}

    @function themed($key) {
    @return map-get($theme-map, $key);
}
.t-list-title,
.t-list-sub-title,
    .t-list-info {
        @include themify() {
        color: themed("color");
        font-weight: themed("font-weight");
        font-size: themed("font-size");
    }
}
```

**整体编译后的样式代码如下图所示**

![](/images/jueJin/66d965691b67499.png)

项目源码地址
------

想要看 demo 源码的可以点击这个连接查看代码。

[点击查看项目源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAshesOfHistory%2Ftest-skin-refresh "https://github.com/AshesOfHistory/test-skin-refresh")

总结

*   了解 SCSS 的基础语法，并综合使用，实现了一键换肤功能。
*   利用 SCSS 强大的函数功能遍历类名统一添加以自定义属性名前缀的命名空间，利用循环自动生成 CSS 样式。
*   了解一键换肤的核心原理。

参考文章
----

[blog.csdn.net/wytraining/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwytraining%2Farticle%2Fdetails%2F109676970 "https://blog.csdn.net/wytraining/article/details/109676970")

推荐阅读
----

[在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261 "https://juejin.cn/post/7026119446162997261")

[浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 60 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)