---
author: "Sunshine_Lin"
title: "如何在Webpack项目中实现代码的规范？"
date: 2022-04-09
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 背景 前面两篇文章，我已经带大家做了这两件事： Vuecli的基本搭建 对搭建后的脚手架进行优化 Es"
tags: ["前端","JavaScript","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:38,comments:0,collects:54,views:2933,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

背景
--

前面两篇文章，我已经带大家做了这两件事：

*   Vuecli的基本搭建
*   对搭建后的脚手架进行优化

Eslint
------

### 是什么

`Eslint`是用来规范`JavaScript`规范的，它更侧重于对于`语法方面`的规范，这对于一个团队的开发来说是非常重要的。

举个例子，开发A使用双等号`==`，而开发B使用三等号`===`，这会造成合并代码后的错误排查产生困难，所以应该统一成`===`，这就是`Eslint`的主要作用

### 配置

之前已经带大家完成了`开发环境(development)`和`生产环境(production)`了，那么`Eslint`应该配置在哪个环境里呢？其实这个应该看你们团队的规范了，这里我就只配置在`开发环境(development)`中，因为我觉得只有开发中才会去规范语法。

首先我们安装一下这些包

*   `eslint`：Eslint的依赖包
*   `eslint-config-airbnb-base`：Eslint的现成方案
*   `eslint-plugin-import`：支持Eslint拓展配置
*   `eslint-webpack-plugin`：将Eslint配置在webpack中的插件

```js
npm i
eslint eslint-config-airbnb-base
eslint-plugin-import eslint-webpack-plugin
```

安装之后，我们需要在根目录下创建两个文件`.eslintrc.js、.eslintignore`

*   `.eslintrc.js`：Eslint的配置就写在这

```js
// .eslintrc.js

    module.exports = {
    // 不往父级查找
    root: true,
    // 环境配置
        env: {
        node: true,
        browser: true,
        es6: true,
        },
        // 拓展规则
        extends: 'airbnb-base',
        // 自定义规则，会覆盖一部分拓展规则
        // 具体这些参数代表什么规则，可以去eslint官网看
            rules: {
            'no-console': 'warn',
            semi: 'off',
            'eol-last': 'off',
            'no-new': 'off',
            'arrow-parens': 'off',
            'import/no-extraneous-dependencies': 'off',
            'comma-danger': 'off',
            'no-useless-escape': 'off'
            },
            // 语言风格
                parserOptions: {
                // 支持import
                sourceType: 'module'
            }
        }
```

*   `.eslintignore`：忽略哪些文件的Eslint检测，写在这

```js
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
```

我们现在只是完成了`Eslint`的自身配置，但是我们的目的是要开发构建时能在终端提示语法错误，所以需要将`Eslint`配置在`webpack.dev.js`中

```js
// webpack.dev.js

// 之前的代码...
const ESLintPlugin = require('eslint-webpack-plugin')

    module.exports = merge(base, {
    // 之前的代码...
        plugins: [
        // 之前的代码...
            new ESLintPlugin({
            // 运行的时候自动帮你修复错误
            fix: true,
            })
        ]
        })
```

这样的话就能在`npm run serve`中提示出你的语法错误了~~~比如我现在随便搞个错误代码

```js
const nn = 2
nn = 1
```

此时终端就会报错了

![](/images/jueJin/957b12c9828c46b.png)

### vscode插件

但是我们发现一个问题，终端是报错了，可是怎么才能开发时，编辑器直接报错呢？就像这样

![](/images/jueJin/13d55032f92b4cb.png)

其实很简单，我们只需要安装一个vsCode的插件`Eslint`就行了，这个插件安装完成后，它会去自动读取我们刚刚的`Eslint配置`，然后进行错误提醒~~~

![](/images/jueJin/e207034dd0494a1.png)

### 配置命令

我们也可以在`package.json`中自己配置命令来进行代码的`Eslint`检测

```js
    "scripts": {
    "eslint": "eslint ./src"
}
```

现在你在终端`npm run eslint`就可以手动进行`Eslint`检测

Prettier
--------

### 是什么

`Prettier`也是规范你`JavaScript`的一个东西，它跟`Eslint`的差别在于：

*   `Eslint`：更侧重于规范JS语法
*   `Prettier`：更侧重于规范JS的编写规范

我举个简单的例子吧：代码加不加分号。这就是归`Prettier`管的，而`Prettier`是归`Eslint`管的，所以说`Prettier`的配置需要配置在`.eslintrc`中

### 配置

那么配置`Prettier`之前我们需要安装这些插件

*   `prettier`：Prettier规范的依赖
*   `eslint-plugin-prettier`：能让`Eslint`配置`Prettier`插件

```js
npm i prettier eslint-plugin-prettier -D
```

然后我们到`.eslintrc`中去配置

```js
// .eslintrc

    module.exports = {
    // 刚才的代码...
    
    // 拓展插件
    plugins: ['prettier'],
    // 自定义规则，会覆盖一部分拓展规则
        rules: {
        // 刚才的代码...
        
        // prettier提示报错
        'prettier/prettier': 'error'
        },
        // 刚才的代码...
    }
    
```

### vscode插件

然后如果想开发中提示的话，可以给vscode安装个`Prettier`这个插件

![](/images/jueJin/b5156246195c491.png)

Stylelint
---------

### 是什么

`Stylelint`就是规定样式的规范的，包括规则、顺序、样式用法等等

### 配置

我们需要安装下面的插件

*   `stylelint`：Stylelint的依赖
*   `stylelint-config-prettier`：拓展Stylelint的规则
*   `stylelint-config-standard`：拓展Stylelint的规则
*   `stylelint-order`：拓展Stylelint样式顺序的插件
*   `stylelint-webpack-plugin`：将Stylelint配置到webpack 的插件

```js
npm i
stylelint
stylelint-config-prettier
stylelint-config-standard
stylelint-order
stylelint-webpack-plugin
-D
```

然后我们在根目录下新建一个`stylelint.config.js`的文件，用来配置`Stylelint`

```js
// stylelint.config.js

    module.exports = {
    root: true,
    // 拓展插件
    plugins: ['stylelint-order'],
    // 拓展stylelint的规则
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
    // 自定义规则
        rules: {
            'selector-pseudo-class-no-unknown': [
            true,
                {
                ignorePseudoClasses: ['global'],
                },
                ],
                    'selector-pseudo-element-no-unknown': [
                    true,
                        {
                        ignorePseudoElements: ['v-deep'],
                        },
                        ],
                            'at-rule-no-unknown': [
                            true,
                                {
                                    ignoreAtRules: [
                                    'tailwind',
                                    'apply',
                                    'variants',
                                    'responsive',
                                    'screen',
                                    'function',
                                    'if',
                                    'each',
                                    'include',
                                    'mixin',
                                    ],
                                    },
                                    ],
                                    'no-empty-source': null,
                                    'named-grid-areas-no-invalid': null,
                                    'unicode-bom': 'never',
                                    'no-descending-specificity': null,
                                    'font-family-no-missing-generic-family-keyword': null,
                                    'declaration-colon-space-after': 'always-single-line',
                                    'declaration-colon-space-before': 'never',
                                    // 'declaration-block-trailing-semicolon': 'always',
                                        'rule-empty-line-before': [
                                        'always',
                                            {
                                            ignore: ['after-comment', 'first-nested'],
                                            },
                                            ],
                                                'unit-no-unknown': [
                                                true,
                                                    {
                                                    ignoreUnits: ['rpx'],
                                                    },
                                                    ],
                                                    // 自定义顺序
                                                        'order/order': [
                                                            [
                                                            'dollar-variables',
                                                            'custom-properties',
                                                            'at-rules',
                                                            'declarations',
                                                                {
                                                                type: 'at-rule',
                                                                name: 'supports',
                                                                },
                                                                    {
                                                                    type: 'at-rule',
                                                                    name: 'media',
                                                                    },
                                                                    'rules',
                                                                    ],
                                                                        {
                                                                        severity: 'warning',
                                                                        },
                                                                        ],
                                                                        // 按照指定顺序排列样式
                                                                            'order/properties-order': [
                                                                            'position',
                                                                            'content',
                                                                            'top',
                                                                            'right',
                                                                            'bottom',
                                                                            'left',
                                                                            'z-index',
                                                                            'display',
                                                                            'float',
                                                                            'width',
                                                                            'height',
                                                                            'max-width',
                                                                            'max-height',
                                                                            'min-width',
                                                                            'min-height',
                                                                            'padding',
                                                                            'padding-top',
                                                                            'padding-right',
                                                                            'padding-bottom',
                                                                            'padding-left',
                                                                            'margin',
                                                                            'margin-top',
                                                                            'margin-right',
                                                                            'margin-bottom',
                                                                            'margin-left',
                                                                            'margin-collapse',
                                                                            'margin-top-collapse',
                                                                            'margin-right-collapse',
                                                                            'margin-bottom-collapse',
                                                                            'margin-left-collapse',
                                                                            'overflow',
                                                                            'overflow-x',
                                                                            'overflow-y',
                                                                            'clip',
                                                                            'clear',
                                                                            'font',
                                                                            'font-family',
                                                                            'font-size',
                                                                            'font-smoothing',
                                                                            'osx-font-smoothing',
                                                                            'font-style',
                                                                            'font-weight',
                                                                            'hyphens',
                                                                            'src',
                                                                            'line-height',
                                                                            'letter-spacing',
                                                                            'word-spacing',
                                                                            'color',
                                                                            'text-align',
                                                                            'text-decoration',
                                                                            'text-indent',
                                                                            'text-overflow',
                                                                            'text-rendering',
                                                                            'text-size-adjust',
                                                                            'text-shadow',
                                                                            'text-transform',
                                                                            'word-break',
                                                                            'word-wrap',
                                                                            'white-space',
                                                                            'vertical-align',
                                                                            'list-style',
                                                                            'list-style-type',
                                                                            'list-style-position',
                                                                            'list-style-image',
                                                                            'pointer-events',
                                                                            'cursor',
                                                                            'background',
                                                                            'background-attachment',
                                                                            'background-color',
                                                                            'background-image',
                                                                            'background-position',
                                                                            'background-repeat',
                                                                            'background-size',
                                                                            'border',
                                                                            'border-collapse',
                                                                            'border-top',
                                                                            'border-right',
                                                                            'border-bottom',
                                                                            'border-left',
                                                                            'border-color',
                                                                            'border-image',
                                                                            'border-top-color',
                                                                            'border-right-color',
                                                                            'border-bottom-color',
                                                                            'border-left-color',
                                                                            'border-spacing',
                                                                            'border-style',
                                                                            'border-top-style',
                                                                            'border-right-style',
                                                                            'border-bottom-style',
                                                                            'border-left-style',
                                                                            'border-width',
                                                                            'border-top-width',
                                                                            'border-right-width',
                                                                            'border-bottom-width',
                                                                            'border-left-width',
                                                                            'border-radius',
                                                                            'border-top-right-radius',
                                                                            'border-bottom-right-radius',
                                                                            'border-bottom-left-radius',
                                                                            'border-top-left-radius',
                                                                            'border-radius-topright',
                                                                            'border-radius-bottomright',
                                                                            'border-radius-bottomleft',
                                                                            'border-radius-topleft',
                                                                            'quotes',
                                                                            'outline',
                                                                            'outline-offset',
                                                                            'opacity',
                                                                            'filter',
                                                                            'visibility',
                                                                            'size',
                                                                            'zoom',
                                                                            'transform',
                                                                            'box-align',
                                                                            'box-flex',
                                                                            'box-orient',
                                                                            'box-pack',
                                                                            'box-shadow',
                                                                            'box-sizing',
                                                                            'table-layout',
                                                                            'animation',
                                                                            'animation-delay',
                                                                            'animation-duration',
                                                                            'animation-iteration-count',
                                                                            'animation-name',
                                                                            'animation-play-state',
                                                                            'animation-timing-function',
                                                                            'animation-fill-mode',
                                                                            'transition',
                                                                            'transition-delay',
                                                                            'transition-duration',
                                                                            'transition-property',
                                                                            'transition-timing-function',
                                                                            'background-clip',
                                                                            'backface-visibility',
                                                                            'resize',
                                                                            'appearance',
                                                                            'user-select',
                                                                            'interpolation-mode',
                                                                            'direction',
                                                                            'marks',
                                                                            'page',
                                                                            'set-link-source',
                                                                            'unicode-bidi',
                                                                            'speak',
                                                                            ],
                                                                            },
                                                                            // 忽视文件
                                                                            ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
                                                                        }
```

之后我们需要把`Stylelint`配置到`webpack.dev.js`中去

```js
// webpack.dev.js

// 之前的代码...

const path = require('path')
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')

    module.exports = merge(base, {
    // 之前的代码...
        plugins: [
        // 之前的代码...
        
            new StylelintWebpackPlugin({
            context: 'src',
            // Stylelint的配置文件读取
            configFile: path.resolve(__dirname, '../stylelint.config.js'),
            // 检查的文件范围
            files: ['**/*.scss'],
            }),
        ]
        })
```

现在`scss`文件出现错误，或者顺序错误，都会报错了

![](/images/jueJin/6b4e6b939f64460.png)

### vscode插件

跟之前两个插件一样，`Stylelint`也可以安装一下vscode的插件`Stylelint`

![](/images/jueJin/92faf5d16d73453.png)

### 配置命令

我们也可以在`package.json`中自己配置命令来进行代码的`Stylelint`检测，加上`--fix`，可以自动帮你修复一些样式错误。

```js
    "scripts": {
    "lint:style": "stylelint src/**/*.scss --fix"
    },
```

现在运行`npm run lint:style`就可以检测样式错误，并自动修复部分错误了

husky
-----

### 是什么

`husky`就是用来规范你的`git提交`的规则的，常用的是对于提交代码`commit`前的`Eslint、Stylelint`检测，确保提交的代码是无错误的。`husky`是利用了`git`的`hook`

### 配置

配置`husky`需要安装下面这些包

*   `husky`：husky所需的依赖
*   `lint-staged`：用来检测提交缓存区的代码的规范，如果不符合规范就阻止git commit
*   `@commitlint/cli`：规定git commit文本规范的依赖
*   `@commitlint/config-conventional`：规定git commit文本规范的拓展规则

```js
npm i
husky
lint-staged
@commitlint/cli
@commitlint/config-conventional
-D
```

然后我们需要在`package.json`中配置命令

```js
    "scripts": {
    "prepare": "husky install"
    },
```

这个命令的作用就是：当你项目初始`npm i`之后，他会自动运行这个`husky install`的命令，然后你的项目中就会出现`.husky文件夹`

![](/images/jueJin/0d0d4960f2604e9.png)

我们在`.husky文件夹`新建以下两个文件

*   `pre-commit`：commit前所要做的事
*   `commit-msg`：commit文本检验的触发文件

![](/images/jueJin/9d453c5426ce419.png)

接下来我们就讲讲这两个文件所有关的事情~~~

### pre-commit

这个文件是用来执行代码`git commit`前所做的事，那commit之前我们应该做什么事呢？我们需要对提交缓存区里的代码进行`Eslint、Stylelint`的检验，如果检验到代码有语法错误，则阻止`git commit`

所以我们需要用到`lint-staged`，先在`package.json`中配置命令

```js
    "scripts": {
    "lint-staged": "lint-staged"
    },
```

然后在根目录下创建文件`.lintstagedrc`，这个文件配置的是你执行`npm run lint-staged`时会做哪些事

```js
// .lintstagedrc

    {
    "*.js": "eslint --fix",
    "*.scss": "stylelint --fix"
}

```

然后我们只需要在`pre-commit`中执行这个`npm run lint-staged`就行了

```js
// .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

现在我们在代码中添加一段错误代码

![](/images/jueJin/81ac5547595e4c5.png)

我们提交代码

```js
git add .
git commit -m 'msg'
```

此时会报错，并且阻止git commit

![](/images/jueJin/53551df86775480.png)

### commit-msg

这是校验git commit文本的文件

我们需要先在根目录下新建一个`commitlint.config.js`，用来配置git commit的文本规范

```js
// commitlint.config.js

    module.exports = {
    // ↓忽略包含init的提交消息
    ignores: [(commit) => commit.includes('init')],
    // ↓按照传统消息格式来验证
    extends: ['@commitlint/config-conventional'],
    // 自定义解析器
        parserPreset: {
        // 解析器配置
            parserOpts: {
            // commit 提交头的规则限制
            headerPattern: /^(\w*|[\u4e00-\u9fa5]*)(?:[\(\（](.*)[\)\）])?[\:\：] (.*)/,
            // 匹配分组
            headerCorrespondence: ['type', 'scope', 'subject'],
            // 引用
                referenceActions: [
                'close',
                'closes',
                'closed',
                'fix',
                'fixes',
                'fixed',
                'resolve',
                'resolves',
                'resolved',
                ],
                // 对应issue要携带#符号
                issuePrefixes: ['#'],
                // 不兼容变更
                noteKeywords: ['BREAKING CHANGE'],
                fieldPattern: /^-(.*?)-$/,
                revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
                revertCorrespondence: ['header', 'hash'],
                // warn () { },
                mergePattern: null,
                mergeCorrespondence: null,
                },
                },
                // ↓自定义提交消息规则
                    rules: {
                    // ↓body以空白行开头
                    'body-leading-blank': [2, 'always'],
                    // ↓footer以空白行开头
                    'footer-leading-blank': [1, 'always'],
                    // ↓header的最大长度
                    'header-max-length': [2, 'always', 108],
                    // ↓subject为空
                    'subject-empty': [2, 'never'],
                    // ↓type为空
                    'type-empty': [2, 'never'],
                    // ↓type的类型
                        'type-enum': [
                        2,
                        'always',
                            [
                            'feat',
                            'fix',
                            'perf',
                            'style',
                            'docs',
                            'test',
                            'refactor',
                            'build',
                            'ci',
                            'chore',
                            'revert',
                            'wip',
                            'workflow',
                            'types',
                            'release',
                            'update',
                            ],
                            ],
                            },
                        }
```

然后我们只需要在`commit-msg`文件中取读取这个规范，并对提交文本进行相对应的规范就行

```js
// commit-msg

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

现在试一下

```js
git add .
git commit -m 'sdsdsdsd'
```

这个提交文本是不符合规范的所以会报错

![](/images/jueJin/a1ade6e4cada4fb.png)

只有符合规范的文本才能完成提交

```js
git add .
git commit -m 'fix: 修改bug'
```

.gitignore
----------

`.gitignore`的作用是可以忽略`git`提交的文件夹，比如`node_modules`

所以我们需要在根目录下新建一个`.gitignore`文件

```js
// .gitignore

node_modules
```

vscode设置
--------

最后分享一下我的`vscode`设置，只需要在根目录下新建`.vscode`文件夹，然后在此文件夹中新建`setting.json`，这个文件夹就是本项目工作区间的vscode设置

```js
// .vscode/setting.json

    {
    //========================================
    //============== 编辑器 ===================
    //========================================
    // 光标的动画样式
    "editor.cursorBlinking": "phase",
    // 光标是否启用平滑插入的动画
    "editor.cursorSmoothCaretAnimation": true,
    // vscode重命名文件或移动文件自动更新导入路径
    "typescript.updateImportsOnFileMove.enabled": "always",
    // 自动替换为当前项目的内置的typescript版本
    "typescript.tsdk": "./node_modeles/typescript/lib",
    // 一个制表符占的空格数(可能会被覆盖)
    "editor.tabSize": 2,
    // 定义一个默认和的格式程序 (prettier)
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    // 取消差异编辑器忽略前空格和尾随空格的更改
    "diffEditor.ignoreTrimWhitespace": false,
    // 定义函数参数括号前的处理方式
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    // 在键入的时候是否启动快速建议
        "editor.quickSuggestions": {
        "other": true,
        "comments": true,
        "strings": true
        },
        //========================================
        //============== Other ===================
        //========================================
        // 启用导航路径
        "breadcrumbs.enabled": true,
        //========================================
        //============== Other ===================
        //========================================
        // 按下Tab键展开缩写 （例如Html的div,在键入的时候按Tab，快捷生成出来）
        "emmet.triggerExpansionOnTab": true,
        // 建议是否缩写 (如Html的<div />)
        "emmet.showAbbreviationSuggestions": true,
        // 建议是否展开 （如Html的 <div></div>）
        "emmet.showExpandedAbbreviation": "always",
        // 为制定语法文件定义当前的语法规则
            "emmet.syntaxProfiles": {
            "vue-html": "html",
            "vue": "html",
                "xml": {
                "arrt_quotes": "single"
            }
            },
            // 在不受支持的语言中添加规则映射
                "emmet.includeLanguages": {
                "jsx-sublime-babel-tags": "javascriptreact"
                },
                //========================================
                //============== Files ==================
                //========================================
                // 删除行位空格
                "files.trimTrailingWhitespace": true,
                // 末尾插入一个新的空格
                "files.insertFinalNewline": true,
                // 删除新行后面的所有新行
                "files.trimFinalNewlines": true,
                // 默认行尾的字符
                "files.eol": "\n",
                // 在查找搜索的时候集成的文件
                    "search.exclude": {
                    "**/node_modules": true,
                    "**/*.log": true,
                    "**/*.log*": true,
                    "**/bower_components": true,
                    "**/dist": true,
                    "**/elehukouben": true,
                    "**/.git": true,
                    "**/.gitignore": true,
                    "**/.svn": true,
                    "**/.DS_Store": true,
                    "**/.idea": true,
                    "**/.vscode": false,
                    "**/yarn.lock": true,
                    "**/tmp": true,
                    "out": true,
                    "dist": true,
                    "node_modules": true,
                    "CHANGELOG.md": true,
                    "examples": true,
                    "res": true,
                    "screenshots": true
                    },
                    // 搜索文件夹时候排外的文件夹
                        "files.exclude": {
                        "**/bower_components": true,
                        "**/.idea": true,
                        "**/tmp": true,
                        "**/.git": true,
                        "**/.svn": true,
                        "**/.hg": true,
                        "**/CVS": true,
                        "**/.DS_Store": true,
                        "**/node_modules": false
                        },
                        // 文件监视器排外的文件 可减少初始化打开项目的占用大量cpu
                            "files.watcherExclude": {
                            "**/.git/objects/**": true,
                            "**/.git/subtree-cache/**": true,
                            "**/.vscode/**": true,
                            "**/node_modules/**": true,
                            "**/tmp/**": true,
                            "**/bower_components/**": true,
                            "**/dist/**": true,
                            "**/yarn.lock": true
                            },
                            "stylelint.enable": true,
                            "stylelint.packageManager": "yarn",
                            //========================================
                            //============== Eslint ==================
                            //========================================
                            // 状态栏显示Eslint的开启状态
                            "eslint.alwaysShowStatus": true,
                            // Eslint的选项
                                "eslint.options": {
                                // 要检查的文件拓展名数组
                            "extensions": [".js", ".jsx", ".ts", ".tsx", ".vue"]
                            },
                            // Eslint校验的
                                "eslint.validate": [
                                "javascript",
                                "typescript",
                                "reacttypescript",
                                "reactjavascript",
                                "html",
                                "vue"
                                ],
                                //========================================
                                //============== Prettier ================
                                //========================================
                                //  使用当前项目的prettier配置文件，如果没有则使用默认的配置
                                "prettier.requireConfig": true,
                                "editor.formatOnSave": true,
                                // 以下程序使用prettier默认进行格式化
                                    "[typescript]": {
                                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                                    },
                                        "[typescriptreact]": {
                                        "editor.defaultFormatter": "esbenp.prettier-vscode"
                                        },
                                            "[javascriptreact]": {
                                            "editor.defaultFormatter": "esbenp.prettier-vscode"
                                            },
                                                "[html]": {
                                                "editor.defaultFormatter": "esbenp.prettier-vscode"
                                                },
                                                    "[css]": {
                                                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                                                    },
                                                        "[less]": {
                                                        "editor.defaultFormatter": "esbenp.prettier-vscode"
                                                        },
                                                            "[scss]": {
                                                            "editor.defaultFormatter": "esbenp.prettier-vscode"
                                                            },
                                                                "[markdown]": {
                                                                "editor.defaultFormatter": "esbenp.prettier-vscode"
                                                                },
                                                                // 保存文件的时候的配置
                                                                    "editor.codeActionsOnSave": {
                                                                    // 使用Eslint格式化代码
                                                                    "source.fixAll.eslint": true,
                                                                    // 使用stylelint格式化代码
                                                                    "source.fixAll.stylelint": true
                                                                    },
                                                                        "[vue]": {
                                                                            "editor.codeActionsOnSave": {
                                                                            // 使用Eslint格式化代码
                                                                            "source.fixAll.eslint": true,
                                                                            // 使用stylelint格式化代码
                                                                            "source.fixAll.stylelint": true
                                                                            },
                                                                            "editor.defaultFormatter": "johnsoncodehk.volar"
                                                                            },
                                                                            "compile-hero.disable-compile-files-on-did-save-code": true,
                                                                        "i18n-ally.localesPaths": ["src/locales", "src/locales/lang"]
                                                                    }
                                                                    
                                                                    
```

整体结构
----

到这里我们就完成我们的脚手架三件套了

*   基本搭建
*   基本优化
*   基本规范

![](/images/jueJin/8e4dc7bf141f451.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/c06312330a7d4f1.png)