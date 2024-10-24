---
author: "JowayYoung"
title: "一键格式化代码带来的快感  你还在为每个项目配置Stylelint和Eslint吗"
date: 2021-02-25
description: "大部分前端项目都配置Stylelint、Eslint、Tslint和Prettier四大前端代码校验工具。代码校验工具以下简称Lint，为了解决代码不严谨，通过预设规则校验代码，检测其是否存在错误漏洞，并对错误漏洞提示修复方案并尽可能依据修复方案格式化出正确代码。该功能称为…"
tags: ["CSS","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:350,comments:0,collects:428,views:17088,"
---
> 作者：[JowayYoung](https://link.juejin.cn?target=)  
> 仓库：[Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung "https://github.com/JowayYoung")、[CodePen](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2FJowayYoung "https://codepen.io/JowayYoung")  
> 博客：[官网](https://link.juejin.cn?target=https%3A%2F%2Fyangzw.vip "https://yangzw.vip")、[掘金](https://juejin.cn/user/2330620350432110 "https://juejin.cn/user/2330620350432110")、[思否](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fblog%2Fjowayyoung "https://segmentfault.com/blog/jowayyoung")、[知乎](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fc_1169597485852360704 "https://zhuanlan.zhihu.com/c_1169597485852360704")  
> 公众号：[IQ前端](https://link.juejin.cn?target=https%3A%2F%2Fp3-juejin.byteimg.com%2Ftos-cn-i-k3u1fbpfcp%2F0e4d8c8fcd994b848e166f5de7119ef3~tplv-k3u1fbpfcp-zoom-1.image "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e4d8c8fcd994b848e166f5de7119ef3~tplv-k3u1fbpfcp-zoom-1.image")  
> 特别声明：原创不易，未经授权不得转载或抄袭，如需转载可联系笔者授权

### 前言

大部分前端项目都配置`Stylelint`、`Eslint`、`Tslint`和`Prettier`四大前端代码校验工具。**代码校验工具**以下简称`Lint`，为了解决代码不严谨，通过预设规则校验代码，检测其是否存在`错误/漏洞`，并对`错误/漏洞`提示修复方案并尽可能依据修复方案格式化出正确代码。该功能称为**格式化代码**，基本上所有编辑器都需配置该功能。

`Lint`其实就是编辑器里运行的一个脚本进程，将代码解析成`抽象语法树`，遍历`抽象语法树`并通过预设规则做一些判断和修改，再将新的`抽象语法树`转换成正确代码。整个校验过程都跟`抽象语法树`相关，若暂未接触过`抽象语法树`，可阅读`babel源码`或`eslint源码`了解其工作原理。

开发过程中启用`Lint`能带来以下好处。

*   可强制规范`团队编码规范`，让新旧组员编码习惯得到一致提升
*   可灵活定制`团队编码风格`，让预设规则符合新旧组员心理预期
*   增加项目代码的`可维护性`和`可接入性`，让新组员能快速适应项目的架构与需求
*   保障项目整体质量，可减少`无用代码`、`重复代码`、`错误代码`和`漏洞代码`的产生几率

> 千万不能自私

有些同学可能一时适应不了`Lint`带来的强制性操作，会在自己编辑器里关闭项目所有校验功能，这种自私行为会带来很严重的后果。

若上传无任何校验痕迹的代码块，当其他组员将该代码块更新合并到原有代码上时，由于编辑器一直配置着`团队编码规范`，导致被拉下来的代码块立马报错甚至产生冲突。

上述情况会让其他组员花费更多时间解决因为你不遵守规矩而带来的问题，还浪费团队为了研究如何让整体编码风格更适合组员的精力。

这种自私行为不可取，若团队无任何编码规范可随意编码，若已认可`团队编码规范`那就努力遵守，不给团队带来麻烦。

### 背景

本文着重讲解**一键格式化代码**的部署，像`Lint`常用配置就不会讲解，毕竟百度谷歌一搜一大堆。这个**一键**当然是`ctrl+s`或`cmd+s`保存文件啦。在保存文件时触发`Lint`自动格式化代码，这个操作当然不能`100%`保证将代码格式化出最正确代码，而是尽可能依据修复方案格式化出正确代码。言下之意就是可能存在部分代码格式化失败，但将鼠标移至红色下划线上会提示修复方案，此时可依据修复方案自行修正代码。

为何写下本文？笔者有着严谨的代码逻辑和优雅的编码风格，所以特别喜欢格式化代码。然而又不想为每个项目配置`Lint`，这些重复无脑的复制粘贴让笔者很反感，所以笔者只想一次配置全局运行`Lint`，这样就无需为每个项目配置`Lint`。在大量百度谷歌都未能搜到一篇相关文章(`搜到的全部文章都是单独为一个项目配置，害`)，笔者就花了半年多时间探讨出本方案，真正做到**一次配置全局运行**。若使用本方案，相信能将所有项目的`Stylelint`、`Eslint`、`Tslint`和`Prettier`相关依赖和配置文件全部移除，使项目目录变得超级简洁，如同下图。

![目录](/images/jueJin/73a726b831e5478.png)

笔者选用`VSCode`作为前端开发的编辑器，其他编辑器不是性能差就是配置麻烦，所以统统放弃，只认`VSCode`。

在此强调两个重要问题，这两个问题影响到后面能否成功部署`VSCode`的**一键格式化代码**。

*   `Tslint`官方已宣布废弃`Tslint`，改用`Eslint`代替其所有校验功能
*   `Eslint`部分配置与`Prettier`部分配置存在冲突且互相影响，为了保证格式化性能就放弃接入`Prettier`

所以部署`VSCode`的**一键格式化代码**只需安装`Stylelint`和`Eslint`两个插件。为了方便表述，统一以下名词。

*   以下提及的**Stylelint**和**Eslint**均为`VSCode插件`
*   以下提及的**stylelint**和**eslint**均为`NPM依赖`

### 步骤

前方高能，两大步骤就能为`VSCode`部署**一键格式化代码**，请认真阅读喔！

> 安装依赖

为了搞清楚两个插件集成哪些`NPM依赖`，以下区分安装`stylelint`和`eslint`及其相关依赖(**看看即可，不要安装，重点在后头**)。笔者有个习惯，就是喜欢将依赖更新到最新版本，在享受新功能的同时也顺便填坑。

```sh
# Stylelint
npm i -D stylelint stylelint-config-standard stylelint-order
``````sh
# Eslint
npm i -D eslint babel-eslint eslint-config-standard eslint-plugin-html eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-react eslint-plugin-standard eslint-plugin-vue vue-eslint-parser
``````sh
# TypeScript Eslint
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript eslint-config-standard-with-typescript
```

安装完成后需配置多份对应配置文件，CSS方面有`css/scss/less/vue`文件，JS方面有`js/ts/jsx/tsx/vue`文件。查看插件文档，发现`Stylelint`只能在`settings.json`上配置，而`Eslint`可配置成多份对应配置文件，并在`settings.json`上通过特定字段指定`Eslint`配置文件路径。

```!
settings.json是VSCode的配置文件，用户可通过插件暴露的字段自定义编辑器功能。
```

由于配置文件太多不好管理，笔者开源了自己平常使用的配置文件集合，详情可查看[vscode-lint](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint "https://github.com/JowayYoung/vscode-lint")。

*   [demo](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Fdemo "https://github.com/JowayYoung/vscode-lint/blob/master/demo")：随便捣鼓几个Demo用于测试格式化代码
*   [eslintrc.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Feslintrc.js "https://github.com/JowayYoung/vscode-lint/blob/master/eslintrc.js")：校验`js文件`
*   [eslintrc.react.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Feslintrc.react.js "https://github.com/JowayYoung/vscode-lint/blob/master/eslintrc.react.js")：校验`jsx文件`
*   [eslintrc.vue.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Feslintrc.vue.js "https://github.com/JowayYoung/vscode-lint/blob/master/eslintrc.vue.js")：校验`vue文件`
*   [tsconfig.json](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Ftsconfig.json "https://github.com/JowayYoung/vscode-lint/blob/master/tsconfig.json")：配置`TypeScript`
*   [tslintrc.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Ftslintrc.js "https://github.com/JowayYoung/vscode-lint/blob/master/tslintrc.js")：校验`ts文件`
*   [tslintrc.react.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Ftslintrc.react.js "https://github.com/JowayYoung/vscode-lint/blob/master/tslintrc.react.js")：校验`tsx文件`
*   [tslintrc.vue.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint%2Fblob%2Fmaster%2Ftslintrc.vue.js "https://github.com/JowayYoung/vscode-lint/blob/master/tslintrc.vue.js")：校验`vue文件`

配置文件里的`rule`可根据自己编码规范适当调整，在此不深入讲解，毕竟简单得来谁都会。建议使用`vscode-lint`，若校验规则不喜欢可自行调整。

*   配置`Stylelint`请戳[这里](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2Fuser-guide%2Frules%2Flist "https://stylelint.io/user-guide/rules/list")
*   配置`Eslint`请戳[这里](https://link.juejin.cn?target=https%3A%2F%2Feslint.org%2Fdocs%2Frules "https://eslint.org/docs/rules")
*   配置`TypeScriptEslint`请戳[这里](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypescript-eslint%2Ftypescript-eslint%2Fblob%2Fmaster%2Fpackages%2Feslint-plugin%2FREADME.md "https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md")
*   配置`VueEslint`请戳[这里](https://link.juejin.cn?target=https%3A%2F%2Feslint.vuejs.org%2Frules "https://eslint.vuejs.org/rules")

以下会基于`vscode-lint`部署`VSCode`的**一键格式化代码**，找个目录通过`git`克隆一份`vscode-lint`，并安装其`NPM依赖`。若使用`vscode-lint`，上述依赖就不要安装了🙅。

```sh
git clone https://github.com/JowayYoung/vscode-lint.git
cd vscode-lint
npm i
```

> 配置插件

*   打开`VSCode`
*   选择左边`工具栏`的`插件`，搜索并安装`Stylelint`和`Eslint`，安装完成后重启`VSCode`
*   选择`文件 → 首选项 → 设置`，`设置`里可选`用户`和`工作区`
    *   **用户**：配置生效后会作用于全局项目(`若大部分项目都是单一的React应用或Vue应用推荐使用全局配置`)
    *   **工作区**：配置生效后只会作用于当前打开项目
*   点击`设置`右上角中间图标`打开设置(json)`，打开的对应文件是`settings.json`(上述有提及)
*   插入以下配置：若在`用户`选项下插入以下配置，遇到其他项目需覆盖配置时在`工作区`选项下插入`eslint.options.configFile`指定`Eslint`配置文件路径
*   重启`VSCode`：为了保障每次修改配置后都能正常格式化代码，必须重启`VSCode`

```json
    {
    "css.validate": false,
        "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.fixAll.stylelint": true
        },
        "eslint.nodePath": "path/vscode-lint/node_modules",
            "eslint.options": {
            "configFile": "path/vscode-lint/eslintrc.js"
            },
            "less.validate": false,
            "scss.validate": false,
            "stylelint.configBasedir": "path/vscode-lint",
                "stylelint.configOverrides": {
                "extends": "stylelint-config-standard",
                    "plugins": [
                    "stylelint-order"
                    ],
                        "rules": {
                        "at-rule-empty-line-before": "never",
                            "at-rule-no-unknown": [
                            true,
                                {
                                    "ignoreAtRules": [
                                    "content",
                                    "each",
                                    "error",
                                    "extend",
                                    "for",
                                    "function",
                                    "if",
                                    "include",
                                    "mixin",
                                    "return",
                                    "while"
                                ]
                            }
                            ],
                            "color-hex-case": "lower",
                            "comment-empty-line-before": "never",
                            "declaration-colon-newline-after": null,
                            "declaration-empty-line-before": "never",
                            "function-linear-gradient-no-nonstandard-direction": null,
                            "indentation": "tab",
                            "no-descending-specificity": null,
                            "no-missing-end-of-source-newline": null,
                            "no-empty-source": null,
                            "number-leading-zero": "never",
                            "rule-empty-line-before": "never",
                                "order/order": [
                                "custom-properties",
                                "declarations"
                                ],
                                    "order/properties-order": [
                                    // 布局属性
                                    "display",
                                    "visibility",
                                    "overflow",
                                    "overflow-x",
                                    "overflow-y",
                                    "overscroll-behavior",
                                    "scroll-behavior",
                                    "scroll-snap-type",
                                    "scroll-snap-align",
                                    // 布局属性：浮动
                                    "float",
                                    "clear",
                                    // 布局属性：定位
                                    "position",
                                    "left",
                                    "right",
                                    "top",
                                    "bottom",
                                    "z-index",
                                    // 布局属性：列表
                                    "list-style",
                                    "list-style-type",
                                    "list-style-position",
                                    "list-style-image",
                                    // 布局属性：表格
                                    "table-layout",
                                    "border-collapse",
                                    "border-spacing",
                                    "caption-side",
                                    "empty-cells",
                                    // 布局属性：弹性
                                    "flex-flow",
                                    "flex-direction",
                                    "flex-wrap",
                                    "justify-content",
                                    "align-content",
                                    "align-items",
                                    "align-self",
                                    "flex",
                                    "flex-grow",
                                    "flex-shrink",
                                    "flex-basis",
                                    "order",
                                    // 布局属性：多列
                                    "columns",
                                    "column-width",
                                    "column-count",
                                    "column-gap",
                                    "column-rule",
                                    "column-rule-width",
                                    "column-rule-style",
                                    "column-rule-color",
                                    "column-span",
                                    "column-fill",
                                    "column-break-before",
                                    "column-break-after",
                                    "column-break-inside",
                                    // 布局属性：格栅
                                    "grid-columns",
                                    "grid-rows",
                                    // 尺寸属性
                                    "box-sizing",
                                    "margin",
                                    "margin-left",
                                    "margin-right",
                                    "margin-top",
                                    "margin-bottom",
                                    "padding",
                                    "padding-left",
                                    "padding-right",
                                    "padding-top",
                                    "padding-bottom",
                                    "border",
                                    "border-width",
                                    "border-style",
                                    "border-color",
                                    "border-colors",
                                    "border-left",
                                    "border-left-width",
                                    "border-left-style",
                                    "border-left-color",
                                    "border-left-colors",
                                    "border-right",
                                    "border-right-width",
                                    "border-right-style",
                                    "border-right-color",
                                    "border-right-colors",
                                    "border-top",
                                    "border-top-width",
                                    "border-top-style",
                                    "border-top-color",
                                    "border-top-colors",
                                    "border-bottom",
                                    "border-bottom-width",
                                    "border-bottom-style",
                                    "border-bottom-color",
                                    "border-bottom-colors",
                                    "border-radius",
                                    "border-top-left-radius",
                                    "border-top-right-radius",
                                    "border-bottom-left-radius",
                                    "border-bottom-right-radius",
                                    "border-image",
                                    "border-image-source",
                                    "border-image-slice",
                                    "border-image-width",
                                    "border-image-outset",
                                    "border-image-repeat",
                                    "width",
                                    "min-width",
                                    "max-width",
                                    "height",
                                    "min-height",
                                    "max-height",
                                    // 界面属性
                                    "appearance",
                                    "outline",
                                    "outline-width",
                                    "outline-style",
                                    "outline-color",
                                    "outline-offset",
                                    "outline-radius",
                                    "outline-radius-topleft",
                                    "outline-radius-topright",
                                    "outline-radius-bottomleft",
                                    "outline-radius-bottomright",
                                    "background",
                                    "background-color",
                                    "background-image",
                                    "background-repeat",
                                    "background-repeat-x",
                                    "background-repeat-y",
                                    "background-position",
                                    "background-position-x",
                                    "background-position-y",
                                    "background-size",
                                    "background-origin",
                                    "background-clip",
                                    "background-attachment",
                                    "bakground-composite",
                                    "mask",
                                    "mask-mode",
                                    "mask-image",
                                    "mask-repeat",
                                    "mask-repeat-x",
                                    "mask-repeat-y",
                                    "mask-position",
                                    "mask-position-x",
                                    "mask-position-y",
                                    "mask-size",
                                    "mask-origin",
                                    "mask-clip",
                                    "mask-attachment",
                                    "mask-composite",
                                    "mask-box-image",
                                    "mask-box-image-source",
                                    "mask-box-image-width",
                                    "mask-box-image-outset",
                                    "mask-box-image-repeat",
                                    "mask-box-image-slice",
                                    "box-shadow",
                                    "box-reflect",
                                    "filter",
                                    "mix-blend-mode",
                                    "opacity",
                                    "object-fit",
                                    "clip",
                                    "clip-path",
                                    "resize",
                                    "zoom",
                                    "cursor",
                                    "pointer-events",
                                    "user-modify",
                                    "user-focus",
                                    "user-input",
                                    "user-select",
                                    "user-drag",
                                    // 文字属性
                                    "line-height",
                                    "line-clamp",
                                    "vertical-align",
                                    "direction",
                                    "unicode-bidi",
                                    "writing-mode",
                                    "ime-mode",
                                    "text-overflow",
                                    "text-decoration",
                                    "text-decoration-line",
                                    "text-decoration-style",
                                    "text-decoration-color",
                                    "text-decoration-skip",
                                    "text-underline-position",
                                    "text-align",
                                    "text-align-last",
                                    "text-justify",
                                    "text-indent",
                                    "text-stroke",
                                    "text-stroke-width",
                                    "text-stroke-color",
                                    "text-shadow",
                                    "text-transform",
                                    "text-size-adjust",
                                    "src",
                                    "font",
                                    "font-family",
                                    "font-style",
                                    "font-stretch",
                                    "font-weight",
                                    "font-variant",
                                    "font-size",
                                    "font-size-adjust",
                                    "color",
                                    // 内容属性
                                    "tab-size",
                                    "overflow-wrap",
                                    "word-wrap",
                                    "word-break",
                                    "word-spacing",
                                    "letter-spacing",
                                    "white-space",
                                    "caret-color",
                                    "quotes",
                                    "content",
                                    "content-visibility",
                                    "counter-reset",
                                    "counter-increment",
                                    "page",
                                    "page-break-before",
                                    "page-break-after",
                                    "page-break-inside",
                                    // 交互属性
                                    "will-change",
                                    "perspective",
                                    "perspective-origin",
                                    "backface-visibility",
                                    "transform",
                                    "transform-origin",
                                    "transform-style",
                                    "transition",
                                    "transition-property",
                                    "transition-duration",
                                    "transition-timing-function",
                                    "transition-delay",
                                    "animation",
                                    "animation-name",
                                    "animation-duration",
                                    "animation-timing-function",
                                    "animation-delay",
                                    "animation-iteration-count",
                                    "animation-direction",
                                    "animation-play-state",
                                    "animation-fill-mode",
                                    // Webkit专有属性
                                    "-webkit-overflow-scrolling",
                                    "-webkit-box-orient",
                                    "-webkit-line-clamp",
                                    "-webkit-text-fill-color",
                                    "-webkit-tap-highlight-color",
                                    "-webkit-touch-callout",
                                    "-webkit-font-smoothing",
                                    "-moz-osx-font-smoothing"
                                ]
                            }
                        }
                    }
```

以上配置的`path`为`vscode-lint`所在的根目录，若刚才的`vscode-lint`克隆到`E:/Github`，那么`path`就是`E:/Github`。

### 示例

上述步骤完成后就可愉快敲代码了。每次保存文件就会自动格式化`CSS代码`或`JS代码`，这个格式化代码不仅会将代码按照规范`整理`和`排序`，甚至尽可能依据修复方案格式化出正确代码。

这样就无需为每个项目配置`Lint`，将所有项目的`Stylelint`、`Eslint`、`Tslint`和`Prettier`相关依赖和配置文件全部移除，使项目目录变得超级简洁。

> css/scss/less/vue文件

![Stylelint](/images/jueJin/25dee5a8140444e.png)

> js/ts/jsx/tsx/vue文件

![Eslint](/images/jueJin/f93f961eec3d4e0.png)

### 疑问

##### 更新eslint到v6+就会失效

很多同学反映`eslint v6+`在`VSCode`上失效，最高版本只能控制在`v5.16.0`。其实这本身就是配置问题，跟版本无关。`vscode-lint`的`eslint`使用`v7`照样能使用`Eslint`，只要配置正确就能正常使用。

上述安装行为使用了`NPM`，那么`settings.json`的`eslint.packageManager`必须配置为`npm`(小写)，但最新版本`Eslint`已默认此项，所以无需配置。若上述安装行为变成`yarn install`，那么必须在`settings.json`里添加以下配置。

```json
    {
    "eslint.packageManager": "yarn"
}
```

这个配置就是解决该问题的关键了。

##### 首次安装Eslint并执行上述配置就会失效

首次安装`Eslint`可能会在`js/ts/jsx/tsx/vue`文件里看到以下警告。

```!
Eslint is disabled since its execution has not been approved or denied yet. Use the light bulb menu to open the approval dialog.
```

说明`Eslint`被禁用了，虽然配置里无明确的禁用字段，但还是被禁用了。此时移步到`VSCode`右下角的工具栏，会看到`禁用图标+ESLINT`的标红按钮，单击它会弹出一个弹框，选择`Allow Everywhere`就能启用`Eslint`所有校验功能。

### 总结

整体过程看似简单，其实笔者这半年填了很多坑才有了`vscode-lint`，中间已省略了很多未记录的问题，这些疑问不重要却影响到很多地方。相信本文能让很多同学体验`VSCode`一键格式化代码所带来的快感，最关键的部分还是无需为每个项目配置`Lint`，这省下多少时间和精力呀！觉得牛逼给[vscode-lint](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fvscode-lint "https://github.com/JowayYoung/vscode-lint")点个**Star**吧！

**回看笔者往期高赞文章，也许能收获更多喔！**

*   [《1.5万字概括ES6全部特性》](https://juejin.cn/post/6844903959283367950 "https://juejin.cn/post/6844903959283367950")：`4200+`点赞量，`15.6w+`阅读量
*   [《灵活运用CSS开发技巧》](https://juejin.cn/post/6844903926110617613 "https://juejin.cn/post/6844903926110617613")：`4300+`点赞量，`13w+`阅读量
*   [《中高级前端必须注意的40条移动端H5坑位指南 | 网易三年实践》](https://juejin.cn/post/6921886428158754829 "https://juejin.cn/post/6921886428158754829")：`3300+`点赞量，`4.5w+`阅读量
*   [《灵活运用JS开发技巧》](https://juejin.cn/post/6844903838449664013 "https://juejin.cn/post/6844903838449664013")：`1600+`点赞量，`5w+`阅读量
*   [《25个你不得不知道的数组reduce高级用法》](https://juejin.cn/post/6844904063729926152 "https://juejin.cn/post/6844904063729926152")：`700+`点赞量，`2.3w+`阅读量
*   [《8个硬核技巧带你迅速提升CSS技术｜掘金直播总结》](https://juejin.cn/post/6908879198933221383 "https://juejin.cn/post/6908879198933221383")：`700+`点赞量，`1.8w+`阅读量
*   [《妙用CSS变量，让你的CSS变得更心动》](https://juejin.cn/post/6844904084936327182 "https://juejin.cn/post/6844904084936327182")：`500+`点赞量，`1.6w+`阅读量

### 结语

**❤️关注+点赞+收藏+评论+转发❤️**，原创不易，鼓励笔者创作更多高质量文章

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

*   关注后回复`资料`免费领取学习资料
*   关注后回复`进群`拉你进技术交流群
*   欢迎关注`IQ前端`，更多**CSS/JS开发技巧**只在公众号推送