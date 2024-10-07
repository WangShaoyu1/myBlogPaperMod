---
author: "白哥学前端"
title: "vue3admin保姆教学指南｜项目规范集成教程，看完秒懂项目中各种奇怪的文件和配置"
date: 2023-02-01
description: "一个项目要有统一的规范，需要使用eslint+stylelint+prettier来对我们代码质量做检测和修复，需要使用husky来做commit拦截，需要使用commitlint来统一提交规范，需要"
tags: ["前端","Vue.js","ESLint"]
ShowReadingTime: "阅读10分钟"
weight: 103
---
今天来带大家从0开始搭建一个vue3版本的后台管理系统。

一个项目要有统一的规范，需要使用eslint+stylelint+prettier来对我们的代码质量做检测和修复，需要使用husky来做commit拦截，需要使用commitlint来统一提交规范，需要使用preinstall来统一包管理工具。

下面我们就用这一套规范来初始化我们的项目，集成一个规范的模版。

环境准备
----

*   node v16.17.0
*   pnpm 7.11.0

项目初始化
-----

本项目使用vite进行构建，vite官方中文文档参考：[cn.vitejs.dev/guide/](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2F "https://cn.vitejs.dev/guide/")

项目初始化命令

lua

 代码解读

复制代码

`pnpm create vite`

我们这里选择使用vue+typescript的方式进行初始化。

Project name命名为`guigu-sph-mall-admin`,意为`尚品汇商城管理系统`。

初始化完成以后进入`guiug-sph-mall`目录，安装依赖`pnpm install`,然后运行项目`pnpm run dev`，在浏览器打开`http://localhost:5173/`，即可看到预览效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91a121a0e5bc448f9421f3a13ec6ad1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

配置[eslint](https://link.juejin.cn?target=https%3A%2F%2Feslint.bootcss.com%2Fdocs%2Frules%2F "https://eslint.bootcss.com/docs/rules/")
-------------------------------------------------------------------------------------------------------------------------------------

`eslint`**用来验证代码是否符合定义的规范**

首先安装eslint

css

 代码解读

复制代码

`pnpm i -D eslint`

生成配置文件

csharp

 代码解读

复制代码

`// 生成配置文件，.eslintrc.js npx eslint --init` 

配置项如下图所示

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c0c99dc1ae2478dbc085ab1ba1b9f5a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后安装下面的依赖来支持vue3环境的代码校验

perl

 代码解读

复制代码

`# 让所有与prettier规则存在冲突的Eslint rules失效，并使用prettier进行代码检查 "eslint-config-prettier": "^8.6.0", "eslint-plugin-import": "^2.27.5", "eslint-plugin-node": "^11.1.0", # 运行更漂亮的Eslint，使prettier规则优先级更高，Eslint优先级低 "eslint-plugin-prettier": "^4.2.1", # vue.js的Eslint插件（查找vue语法错误，发现错误指令，查找违规风格指南 "eslint-plugin-vue": "^9.9.0", # 该解析器允许使用Eslint校验所有babel code "@babel/eslint-parser": "^7.19.1",`

使用pnpm安装依赖

arduino

 代码解读

复制代码

`pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser`

修改配置文件`.eslintrc.cjs`：

arduino

 代码解读

复制代码

`// @see https://eslint.bootcss.com/docs/rules/ module.exports = {   env: {     browser: true,     es2021: true,     node: true,     jest: true,   },   /* 指定如何解析语法 */   parser: 'vue-eslint-parser',   /** 优先级低于 parse 的语法解析配置 */   parserOptions: {     ecmaVersion: 'latest',     sourceType: 'module',     parser: '@typescript-eslint/parser',     jsxPragma: 'React',     ecmaFeatures: {       jsx: true,     },   },   /* 继承已有的规则 */   extends: [     'eslint:recommended',     'plugin:vue/vue3-essential',     'plugin:@typescript-eslint/recommended',     'plugin:prettier/recommended',   ],   plugins: ['vue', '@typescript-eslint'],   /*    * "off" 或 0    ==>  关闭规则    * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）    * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）    */   rules: {     // eslint（https://eslint.bootcss.com/docs/rules/）     'no-var': 'error', // 要求使用 let 或 const 而不是 var     'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',     'no-unexpected-multiline': 'error', // 禁止空余的多行     'no-useless-escape': 'off', // 禁止不必要的转义字符     // typeScript (https://typescript-eslint.io/rules)     '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量     '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore     '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型     '@typescript-eslint/no-non-null-assertion': 'off',     '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。     '@typescript-eslint/semi': 'off',     // eslint-plugin-vue (https://eslint.vuejs.org/rules/)     'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词     'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用     'vue/no-mutating-props': 'off', // 不允许组件 prop的改变     'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式   }, }`

配置.eslintignore, 防止校验打包的产物

arduino

 代码解读

复制代码

`// .eslintignore 配置, 防止校验打包的产物 dist node_modules`

在package.json 中添加运行脚本

json

 代码解读

复制代码

`"scripts": {     "lint": "eslint src",     "fix": "eslint src --fix", }`

配置**prettier**
--------------

有了eslint，为什么还要有prettier？

eslint针对的是javascript，他是一个检测工具，包含js语法以及少部分格式问题，在eslint看来，语法对了就能

保证代码正常允许，格式问题属于其次；

而prettier属于格式化工具，它看不惯格式不统一，所以它就把eslint没干好的事接着干，另外，prettier支持

包含js在内的多种语言。

总结起来，**eslint和prettier这俩兄弟一个保证js代码质量，一个保证代码美观。**

首先安装包

arduino

 代码解读

复制代码

`pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier`

在`.prettierrc.json`添加如下规则：

json

 代码解读

复制代码

`{   "singleQuote": true,   "semi": false,   "bracketSpacing": true,   "htmlWhitespaceSensitivity": "ignore",   "endOfLine": "auto",   "trailingComma": "all",   "tabWidth": 2 }`

添加`.prettierignore`

bash

 代码解读

复制代码

`/dist/* /html/* .local /node_modules/** **/*.svg **/*.sh /public/*`

现在我们来测试一下代码检查是否生效了，我们在main.ts中修改成如下内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0ffe7d4d954d1bbb7d175fc72109ae~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到代码已经红了，然后运行`npm run lint`来检查一下代码不规范原因

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ae1ab99960f430a9f96cdda853bfc1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到这里有两处错误，运行`npm run fix`修改这个错误

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba50ff24ba8e4a26b1310915c042f5fe~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这样就符合我们定义的代码规范了。

到此，我们的eslint和prettier配置完毕。

如果出现下面报错，卸载vetur插件，安装TypeScript Vue Plugin (Volar)、Vue Language Features (Volar)插件即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/008fc82d68524bee89f2e4f00905e412~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

配置stylelint
-----------

[stylelint](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2F "https://stylelint.io/")为css的lint工具。可格式化css代码，检查css语法错误与不合理的写法，指定css书写顺序等。

**安装依赖**

我们的项目中使用scss作为预处理器，安装以下依赖：

arduino

 代码解读

复制代码

`pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order -D`

**增加**`.stylelintrc.cjs`**配置文件**

java

 代码解读

复制代码

`// @see https://stylelint.bootcss.com/ module.exports = {   extends: [     'stylelint-config-standard', // 配置stylelint拓展插件     'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化     'stylelint-config-standard-scss', // 配置stylelint scss插件     'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化     'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,     'stylelint-config-prettier', // 配置stylelint和prettier兼容   ],   overrides: [     {       files: ['**/*.(scss|css|vue|html)'],       customSyntax: 'postcss-scss',     },     {       files: ['**/*.(html|vue)'],       customSyntax: 'postcss-html',     },   ],   ignoreFiles: [     '**/*.js',     '**/*.jsx',     '**/*.tsx',     '**/*.ts',     '**/*.json',     '**/*.md',     '**/*.yaml',   ],   /**    * null  => 关闭该规则    * always => 必须    */   rules: {     'value-keyword-case': null, // 在 css 中使用 v-bind，不报错     'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器     'function-url-quotes': 'always', // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"     'no-empty-source': null, // 关闭禁止空源码     'selector-class-pattern': null, // 关闭强制选择器类名的格式     'property-no-unknown': null, // 禁止未知的属性(true 为不允许)     'block-opening-brace-space-before': 'always', // 要求在块的开大括号之前必须有一个空格或不能有空白符     'value-no-vendor-prefix': null, // 关闭 属性值前缀 --webkit-box     'property-no-vendor-prefix': null, // 关闭 属性前缀 -webkit-mask     'selector-pseudo-class-no-unknown': [       // 不允许未知的选择器       true,       {         ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略属性，修改element默认样式的时候能使用到       },     ],   }, }`

添加`.stylelintignore`

bash

 代码解读

复制代码

`/node_modules/* /dist/* /html/* /public/*`

配置命令

css

 代码解读

复制代码

`"scripts": { 	"lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix" }`

最后配置统一的prettier来格式化我们的js和css，html代码

css

 代码解读

复制代码

 `"scripts": {     "dev": "vite",     "build": "vue-tsc && vite build",     "preview": "vite preview",     "lint": "eslint src",     "fix": "eslint src --fix",     "format": "prettier --write "./**/*.{html,vue,ts,js,json,md}"",     "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",     "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"   },`

当我们运行`pnpm format`的时候，会把代码直接格式化

配置保存代码自动修复
----------

实现每次保存代码时，自动执行lint命令来修复代码的错误。这个操作需要依赖eslint插件来完成，需要提前在vscode插件市场安装好eslint。然后有两种方式可以配置：

第一种：

直接在项目的跟路径创建.vscode/settings.json文件，然后在其中加入以下配置。

json

 代码解读

复制代码

`{     // 开启自动修复     "editor.codeActionsOnSave": {         "source.fixAll": false,         "source.fixAll.eslint": true     } }`

第二种：

用shift+cmd+p,打开搜索命令框，输入`settings`，选择下面这个

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ee9f1339e5d4f1fad8f1a10f0abe682~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这个文件是vscode的系统配置文件，直接把

json

 代码解读

复制代码

`// 开启自动修复     "editor.codeActionsOnSave": {         "source.fixAll": false,         "source.fixAll.eslint": true     }`

这段代码复制进去，任何项目打开，都会自动保存文件了。

这里为了让别的人也能方便的使用，我们的项目中直接采用第一种方式。

下面是完整的配置：

json

 代码解读

复制代码

`{   // 开启自动修复   "editor.codeActionsOnSave": {     "source.fixAll": false,     "source.fixAll.eslint": true,     "source.fixAll.stylelint": true   },   // 保存的时候自动格式化   "editor.formatOnSave": true,   // 默认格式化工具选择prettier   "editor.defaultFormatter": "esbenp.prettier-vscode",   // 配置该项，新建文件时默认就是space：2   "editor.tabSize": 2,   // stylelint校验的文件格式   "stylelint.validate": ["css", "scss", "vue", "html"] }`

配置husky
-------

在上面我们已经集成好了我们代码校验工具，但是需要每次手动的去执行命令才会格式化我们的代码。如果有人没有格式化就提交了，那这个规范就没什么用。所以我们需要强制让开发人员按照代码规范来提交。

要做到这件事情，就需要利用husky在代码提交之前出发git hook，然后执行`pnpm format`来自动的格式化我们的代码。

安装`husky`

 代码解读

复制代码

`pnpm install -D husky`

执行

csharp

 代码解读

复制代码

`npx husky-init`

会在根目录下生成个一个.husky目录，在这个目录下面会有一个pre-commit文件，这个文件里面的命令在我们执行commit的时候就会执行

安装`lint-staged`

 代码解读

复制代码

`pnpm install -D lint-staged`  

在`package.json`中配置如下命令

json

 代码解读

复制代码

`{   "scripts": {     "lint-staged": "lint-staged"   },   "lint-staged": {     "**/*.{js,jsx,ts,tsx,vue}": [       "eslint --fix",       "stylelint --fix",       "prettier --write",       "git add"     ],     "*.{scss,less,styl,html}": [       "stylelint --fix",       "prettier --write"     ]   }, }`

在`.husky/pre-commit`文件添加如下命令：

bash

 代码解读

复制代码

`#!/usr/bin/env sh . "$(dirname -- "$0")/_/husky.sh" pnpm lint-staged`

当我们对代码进行commit操作的时候，就会执行命令，对代码进行格式化，然后再提交。

配置commitlint
------------

对于我们的commit信息，也是有统一规范的，不能随便写，比如下面这样的规范：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75b671199fef4ccda7a4363b58deee15~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

要让每个人都按照统一的标准来执行，我们可以利用**commitlint**来实现。

安装包

sql

 代码解读

复制代码

`pnpm add @commitlint/config-conventional @commitlint/cli -D`

添加配置文件，新建`commitlint.config.cjs`(注意是cjs)，然后添加下面的代码：

java

 代码解读

复制代码

`module.exports = {   extends: ['@commitlint/config-conventional'],   // 校验规则   rules: {     'type-enum': [       2,       'always',       [         'feat',         'fix',         'docs',         'style',         'refactor',         'perf',         'test',         'chore',         'revert',         'build',       ],     ],     'type-case': [0],     'type-empty': [0],     'scope-empty': [0],     'scope-case': [0],     'subject-full-stop': [0, 'never'],     'subject-case': [0, 'never'],     'header-max-length': [0, 'always', 72],   }, }`

在`package.json`中配置scripts命令：

bash

 代码解读

复制代码

`# 在scrips中添加下面的代码 { "scripts": {     "commitlint": "commitlint --config commitlint.config.cjs -e -V"   }, }`

配置结束，现在当我们填写`commit`信息的时候，前面就需要带着下面的`subject`

arduino

 代码解读

复制代码

`'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build',`

配置husky

sql

 代码解读

复制代码

`npx husky add .husky/commit-msg` 

在生成的commit-msg文件中添加下面的命令

bash

 代码解读

复制代码

`#!/usr/bin/env sh . "$(dirname -- "$0")/_/husky.sh" pnpm commitlint`

当我们 commit 提交信息时，就不能再随意写了，必须是 git commit -m 'fix: xxx' 符合类型的才可以，需要注意的是类型的后面需要用英文的 :，并且冒号后面是需要空一格的，这个是不能省略的。不然就会像下面这样报错了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca4def79b776429a945dbe06a952b664~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

提交成功

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02f66b04a6348f6b41cc68b60ab3612~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

强制使用pnpm下载包
-----------

为了统一我们的包管理工具，我们需要强制让用户使用pnpm来安装依赖包。

在根目录创建`scritps/preinstall.js`文件，添加下面的内容

javascript

 代码解读

复制代码

``if (!/pnpm/.test(process.env.npm_execpath || '')) {   console.warn(     `\u001b[33mThis repository must using pnpm as the package manager ` +     ` for scripts to work properly.\u001b[39m\n`,   )   process.exit(1) }``

配置命令

json

 代码解读

复制代码

`"scripts": { 	"preinstall": "node ./scripts/preinstall.js" }`

当我们使用npm或者yarn来安装包的时候，就会报错了。原理就是在install的时候会触发preinstall（npm提供的生命周期钩子）这个命令。

至此，我们的项目规范就集成完毕，这套规范也适用于vue3其他的仓库，比如开发一个utils包，开发一个UI组件库等等，都可以这么来配置。

源码地址
----

[gitee.com/guigu-fe/gu…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fguigu-fe%2Fguigu-sph-mall-admin "https://gitee.com/guigu-fe/guigu-sph-mall-admin")

下一节我们来集成pinia，router等等。

文章教程系列
------

*   [vue3 admin 保姆教学指南 ｜ 项目规范集成教程，看完秒懂项目中各种奇怪的文件和配置](https://juejin.cn/post/7195080019394166842 "https://juejin.cn/post/7195080019394166842")
*   [vue3 admin 保姆教学指南 ｜ 一文让你彻底上手 vue3 全家桶，集成 pinia+element-plus+vue-router@4](https://juejin.cn/post/7196852501190082616 "https://juejin.cn/post/7196852501190082616")
*   [vue3 admin 保姆教学指南｜关于使用 typescript 二次封装 Axios 的特别说明](https://juejin.cn/post/7214146630467305530 "https://juejin.cn/post/7214146630467305530")
*   [vue3 admin 保姆教学指南｜关于 pinia 的使用](https://juejin.cn/post/7214342319348138041 "https://juejin.cn/post/7214342319348138041")
*   [vue3 admin 保姆教学指南｜登录和菜单权限的实现](https://juejin.cn/post/7215035912186413115 "https://juejin.cn/post/7215035912186413115")
*   [vue3 admin 保姆教学指南｜后台管理系统的 Layout 实现](https://juejin.cn/post/7215125397347680314 "https://juejin.cn/post/7215125397347680314")
*   [vue3 admin 保姆教学指南｜ element-plus 如何实现主题切换和暗黑模式](https://juejin.cn/post/7215485221830852665 "https://juejin.cn/post/7215485221830852665")
*   [vue3 admin 开发中的奇淫巧技｜在 vue 中如何刷新当前页面](https://juejin.cn/post/7216130963276644407 "https://juejin.cn/post/7216130963276644407")