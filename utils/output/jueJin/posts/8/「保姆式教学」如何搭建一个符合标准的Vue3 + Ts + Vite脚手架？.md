---
author: "Sunshine_Lin"
title: "「保姆式教学」如何搭建一个符合标准的Vue3 + Ts + Vite脚手架？"
date: 2021-12-22
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。今天给大家讲一讲我是怎么搭建一个Vue3 + Ts + Vite的脚手架的吧 vscode插件 Vol"
tags: ["前端","Vue.js","TypeScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:106,comments:0,collects:196,views:7460,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。今天给大家讲一讲我是怎么搭建一个`Vue3 + Ts + Vite`的脚手架的吧

vscode插件
--------

*   `Volar`：Vue3的一款语法提示的插件
*   `Prettier-Code formatter`：prettier的格式化插件
*   `Eslint`：eslint的插件
*   `Stylelint`：样式文件格式化插件
*   `JavaScript and TypeScript Nightly`：起用ts最新语法

项目初始化
-----

使用`Vite`创建项目的命令，初始化项目

```js
npm init vite@latest my-vue-app -- --template vue-ts
```

tsconfig.json配置
---------------

```js
    {
        "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "allowSyntheticDefaultImports": true,
        "strictFunctionTypes": false,
        "jsx": "preserve",
        "baseUrl": ".",
        "allowJs": true,
        "sourceMap": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "experimentalDecorators": true,
        "lib": ["dom", "esnext"],
        "types": ["vite/client"],
        "typeRoots": ["./node_modules/@types/", "./types"],
        "noImplicitAny": false,
        "skipLibCheck": true,
            "paths": {
            "/@/*": ["src/*"],
        "/#/*": ["types/*"]
    }
    },
        "include": [
        "tests/**/*.ts",
        "src/**/*.ts",
        "src/**/*.d.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "types/**/*.d.ts",
        "types/**/*.ts",
        "build/**/*.ts",
        "build/**/*.d.ts",
        "mock/**/*.ts",
        "vite.config.ts",
        "src/settings/dist/theme.js",
        "src/tools.js"
        ],
    "exclude": ["node_modules", "tests/server/**/*.ts", "dist", "**/*.js"]
}

```

vite.config.ts配置
----------------

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// npm i --save-dev @types/node
    function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir)
}

    export default defineConfig({
    plugins: [vue()],
        resolve: {
        // 路径别名
            alias: [
                {
                find: /\/@\//,
                replacement: pathResolve('src') + '/',
                },
                    {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/',
                    },
                    ],
                    },
                    // 支持使用tsx语法
                        esbuild: {
                        jsxFactory: 'h',
                        jsxFragment: 'Fragment',
                        jsxInject: 'import { h } from "vue";',
                        },
                        })
                        
```

支持 Less
-------

直接项目中安装`less`就行，跟`webpack`区别就是，`Webpack`需要安装`less、less-loader`，而`Vite`不需要`less-loader`

```js
npm i less -D
```

vscode设置
--------

主要配置一些`Eslint、Prettier、Stylelint`的使用，以及保存自动调用插件进行格式化，项目新建一个`.vscode`文件夹，文件夹里新建一个`settings.json`

```js
// .vscode/settings.json

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
                                                        "editor.defaultFormatter": "stylelint.vscode-stylelint"
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

Eslint
------

Eslint承担的更多的是代码质量上的一个严格规范，这里安装的包比较多

```js
npm i
eslint eslint-define-config
eslint-plugin-import
eslint-plugin-node
eslint-plugin-promise
eslint-plugin-vue
vue-eslint-parser
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
eslint-config-prettier
eslint-plugin-jest
-D
```

项目中新建两个文件：

*   `.eslintrc.js`：eslint配置文件
*   `.eslintignore`：eslint规范忽略配置

### .eslintrc.js

```js
// .eslintrc.js

// @ts-check
    const {
    defineConfig
    } = require('eslint-define-config')
        module.exports = defineConfig({
        root: true,
            env: {
            browser: true,
            node: true,
            es6: true
            },
            parser: 'vue-eslint-parser',
                parserOptions: {
                parser: '@typescript-eslint/parser',
                ecmaVersion: 2020,
                sourceType: 'module',
                jsxPragma: 'React',
                    ecmaFeatures: {
                    jsx: true
                }
                },
                    extends: [
                    'plugin:vue/vue3-recommended',
                    'plugin:@typescript-eslint/recommended',
                    // 'prettier',
                    'plugin:prettier/recommended',
                    'plugin:jest/recommended'
                    ],
                        rules: {
                        'vue/script-setup-uses-vars': 'error',
                        '@typescript-eslint/ban-ts-ignore': 'off',
                        '@typescript-eslint/explicit-function-return-type': 'off',
                        '@typescript-eslint/no-explicit-any': 'off',
                        '@typescript-eslint/no-var-requires': 'off',
                        '@typescript-eslint/no-empty-function': 'off',
                        'vue/custom-event-name-casing': 'off',
                        'no-use-before-define': 'off',
                        '@typescript-eslint/no-use-before-define': 'off',
                        '@typescript-eslint/ban-ts-comment': 'off',
                        '@typescript-eslint/ban-types': 'off',
                        '@typescript-eslint/no-non-null-assertion': 'off',
                        '@typescript-eslint/explicit-module-boundary-types': 'off',
                            '@typescript-eslint/no-unused-vars': [
                            'error',
                                {
                                argsIgnorePattern: '^_',
                                varsIgnorePattern: '^_'
                            }
                            ],
                                'no-unused-vars': [
                                'error',
                                    {
                                    argsIgnorePattern: '^_',
                                    varsIgnorePattern: '^_'
                                }
                                ],
                                'space-before-function-paren': 'off',
                                
                                'vue/attributes-order': 'off',
                                'vue/one-component-per-file': 'off',
                                'vue/html-closing-bracket-newline': 'off',
                                'vue/max-attributes-per-line': 'off',
                                'vue/multiline-html-element-content-newline': 'off',
                                'vue/singleline-html-element-content-newline': 'off',
                                'vue/attribute-hyphenation': 'off',
                                'vue/require-default-prop': 'off',
                                    'vue/html-self-closing': [
                                    'error',
                                        {
                                            html: {
                                            void: 'always',
                                            normal: 'never',
                                            component: 'always'
                                            },
                                            svg: 'always',
                                            math: 'always'
                                        }
                                    ]
                                }
                                })
                                
                                
```

### .eslintignore

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

Prettier
--------

`Prettier`更多的是对于代码格式的规范，先安装插件

```js
npm i prettier -D
```

然后新建一个`.prettierrc.js`

```js
// .prettierrc.js

    module.exports = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    vueIndentScriptAndStyle: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    trailingComma: 'all',
    jsxSingleQuote: false,
    arrowParens: 'always',
    insertPragma: false,
    requirePragma: false,
    proseWrap: 'never',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'auto',
    };
    
```

Stylelint
---------

`Stylelint`负责对样式的格式化规范，先安装插件

```js
npm i
stylelint
stylelint-config-prettier
stylelint-config-standard
stylelint-order
-D
```

然后新建一个`stylelint.config.js`

```js
// stylelint.config.js

    module.exports = {
    root: true,
    plugins: ['stylelint-order'],
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
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
                                                                        // 按照指定顺序排列
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
                                                                            ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
                                                                        }
                                                                        
```

环境变量文件
------

创建相应文件，可以让项目使用环境变量：

*   .env
*   .env.develoment
*   .env.production

全局types
-------

创建`types`文件夹，存放全局相关的`typescript`

src文件夹
------

在`src`文件夹中创建以下文件夹（当然这个看你自己喜好命名，这里只是我自己的习惯）

*   `api`：存放http请求的接口
*   `assets`：存放一些静态资源，如`icon、图片`
*   `components`：存放通用组件
*   `design`：存放全局样式文件
*   `enums`：存放全局的ts字典
*   `hooks`：存放封装的自定义hook
*   `layouts`：存放布局方案
*   `locales`：存放国际化的语言资料
*   `router`：存放路由相关
*   `settings`：存放一些全局的设置
*   `store`：存放状态管理相关
*   `utils`：存放通用的工具类函数
*   `views`：存放项目的页面

router和pinia
------------

```js
npm i vue-router pinia -D
```

*   `vue-router`：路由
*   `pinia`：状态管理（代替vuex）

husky
-----

`husky`是`git`提交代码的检查，包括`代码是否合格、样式是否合格、commit信息是否合格`等检测

### 插件

```js
npm i pretty-quick husky @commitlint/cli @commitlint/config-conventional -D
```

### package.json

```js
"install:husky": "husky install",
"lint:pretty": "pretty-quick --staged",
"lint:stylelint": "stylelint --fix \"**/*.{tsx,less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
"lint:all": "npm run lint:eslint && npm run lint:stylelint"
```

### husky install

在终端里输入命令`npm run install:husky`，项目会生成`.husky`文件夹：

```js
.husky
_
.gitignore
husky.sh
```

### 完善husky

在`.husky`文件夹中创建三个文件`commit-msg、common.sh、pre-commit`

```js
.husky
_
.gitignore
husky.sh
commit-msg
common.sh
pre-commit
```

#### commit-msg

```js
// .husky/commit-msg

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

#### common.sh

```js

// .husky/common.sh

    command_exists () {
    command -v "$1" >/dev/null 2>&1
}

if command_exists winpty && test -t 1; then
exec < /dev/tty
fi
```

### pre-commit

```js
// .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

[ -n "$CI" ] && exit 0

yarn run lint:pretty

```

### commitlint.config.js

用来规范`git commit -m 'msg'` 的`msg`

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
                warn() {},
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

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/5b035c3b5a28496.png)

参考项目
----

*   vue-vben-admin
*   compass-plan-admin

吉他哥牛逼！！！！！！！