---
author: "紫升"
title: "给你的ReactNative库添加Example"
date: 2021-01-31
description: "你为ReactNative制作了一个闪亮的新库，现在该向全世界展示它。但是您需要添加一个示例应用程序，以便人们可以在安装之前进行尝试。有一个示例程序也能让你在开发时测试。这看起来很简单，真的是吗？不幸的是，它不是那么简单，并且可能会非常具有挑战性。我将描述我使用的过程，也许…"
tags: ["ReactNative","Debug"]
ShowReadingTime: "阅读5分钟"
weight: 916
---
> 本文翻译自 [Adding an example app to your React Native library](https://link.juejin.cn?target=https%3A%2F%2Fcallstack.com%2Fblog%2Fadding-an-example-app-to-your-react-native-library%2F "https://callstack.com/blog/adding-an-example-app-to-your-react-native-library/"),也夹杂了一些私货，如有帮助，请不吝点赞。

你为React Native制作了一个闪亮的新库，现在该向全世界展示它。但是您需要添加一个示例应用程序，以便人们可以在安装之前进行尝试。有一个示例程序也能让你在开发时测试。这看起来很简单，真的是吗？

不幸的是，它不是那么简单，并且可能会非常具有挑战性。我将描述我使用的过程，也许会对您有所帮助。请注意，我将仅介绍JS库。如果你的仓库有原生代码，这篇文章仍旧非常有用，但是你需要额外的步骤——将原生代码桥接到 app。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/922b6f418a354847b390186ca16448f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

为什么很难？
------

在探讨解决方案之前，让我们讨论一下为什么如此困难。 React Native使用了一个名为 [Metro Bundler](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fmetro-bundler "https://github.com/facebook/metro-bundler") 的自定义打包器来捆绑您的JavaScript代码和一个名为 [haste](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fjest-haste-map "https://www.npmjs.com/package/jest-haste-map") 的模块解析机制。

Metro 速度非常快，非常适合大型代码库。但是现在它有一些让写一个示例 app 有些困难的限制：

*   我们不能使用 symlinks，因为 Metro Bundler 使用 [watchman](https://link.juejin.cn?target=https%3A%2F%2Ffacebook.github.io%2Fwatchman%2F "https://facebook.github.io/watchman/") 并[不支持](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact-native%2Fissues%2F637 "https://github.com/facebook/react-native/issues/637") symlinks。
*   我们不能导入当前目录外的模块。
*   当遇到两个具有相同名称的模块时，Example 就无法运行。这很容易遇到，因为我们将为开发和示例安装相同的模块。

> 私货：因为 react native 不支持 symlinks，所以 `npm link` 也是不可用的。在 [使用 wml 进行 npm 模块调试真香](https://juejin.cn/post/6847902225356980232 "https://juejin.cn/post/6847902225356980232") 中可以对此问题有更深入了解。

但是你知道吗？实际上，可以配置打包程序，以便我们可以解决示例应用程序的限制。然后配置属性并没有任何文档，而且 Metro Bundler 现在并不是个成熟的工具，除非你足够了解她，否则配置起来十分困难。

> 私货：Metro Bundler 先前负责 tree-shaking 的老哥 [@rafeca](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frafeca "https://github.com/rafeca")、[@mjesun](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmjesun "https://github.com/mjesun") 从 Facebook 离职了，tree-shaking 就成了至今未支持的特性，见 [Tree shaking while bundling](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fmetro%2Fissues%2F227%23issuecomment-583358386 "https://github.com/facebook/metro/issues/227#issuecomment-583358386")，可以想见 Facebook 也缺人，如果哪位大佬可以搞定这些问题，可以试试入职 Facebook。

当下，我们能做什么？
----------

这里，我们假设你使用 Expo 作为 example。为什么是 Expo？因为这对你来说非常容易开发，而且它的导出示例的方式简单到令人难以置信。但是，我还将为那些不想/不能使用Expo的人提供说明（以防你的代码库包含原生代码）。

下面是我的项目的目录结构，也是社区常见的：

sh

 代码解读

复制代码

`. ├── example ├── package.json └── src     └── index.js`

我们的库放在 `src` 文件夹下，example 应用（一个 Expo 应用或 React Native app）放在 `example/` 文件夹下。

接下来，我们可以使用 `exp init example` 或者 `react-native init example` 来初始化项目。（国内的 Expo 服务巨慢，科学上网也慢，不建议使用）。

配置 Babel
--------

我们需要将我们的库添加为 example 的依赖项。我非常幼稚地添加库作为 `file:` 依赖，这是有效的。但是当你修改一些东西，你要每次都记得重新安装，这很蠢不是吗？

此外，`npm@5` 将 `file:` 依赖项作为符号链接安装，前面我们提到，React Native Packager 并不支持符号链接。

如果我们可以像对 Webpack 那样对库起别名该怎么办？答案是 `babel-plugin-module-resolver`！

首先安装插件：

sh

 代码解读

复制代码

`yarn add -D babel-plugin-module-resolver`

然后配置 `babel.config.js`：

js

 代码解读

复制代码

`module.exports = {   ...   plugins: [     [       "module-resolver", {         "alias": {           "name-of-my-library": ".."         }       }     ]   ] }`

这很简单，但是难点是我们还需要接着配置 Metro Bundler

配置 Metro Bundler
----------------

Metro Packager 使用特定的配置文件 `metro.config.js`（老版是 `rn-cli.config.js`）。让我们创建这个文件并复制下面的内容：

js

 代码解读

复制代码

`const path = require('path'); const root = path.resolve(__dirname, '..'); module.exports = {   projectRoot: __dirname,   watchFolders: [root], };`

这告诉打包程序将项目根目录设置为当前目录（example 文件夹）并且监听父目录。这让我们可以从父目录引用模块。

不幸的是，我们无法引入父目录中的 `node_modules` 模块，因此我们不得不在 example 中重复安装模块。

假设我们有 `lodash` 和 `prop-types` 模块作为库的依赖项，我们现在需要将它们安装在 example 文件夹中。

sh

 代码解读

复制代码

`yarn add lodash prop-types`

我们需要配置 `extraNodeModules` resolver 来识别这些库：

js

 代码解读

复制代码

`const path = require('path'); const root = path.resolve(__dirname, '..'); module.exports = {   projectRoot: __dirname,   watchFolders: [root],   resolver: {     extraNodeModules: modules.reduce((acc, name) => {       acc[name] = path.join(__dirname, 'node_modules', name);       return acc;     }, {}),   }, };`

我们还需要将父目录的 `node_modules` 列入黑名单，否则打包程序将抱怨重复的模块。让我们安装 `escape-string-regexp` 软件包，然后更新配置。

sh

 代码解读

复制代码

`yarn add -D escape-string-regexp`

js

 代码解读

复制代码

``// metro.config.js const path = require('path'); const blacklist = require('metro-config/src/defaults/blacklist'); const escape = require('escape-string-regexp'); const pkg = require('../package.json'); const root = path.resolve(__dirname, '..'); const modules = [   // 导致重复包的模块可以加在这里   ...Object.keys({     ...pkg.dependencies,     ...pkg.peerDependencies,   }), ]; module.exports = {   projectRoot: __dirname,   watchFolders: [root],   resolver: {     blacklistRE: blacklist([       new RegExp(`^${escape(path.join(root, 'node_modules'))}\\/.*$`),     ]),     extraNodeModules: modules.reduce((acc, name) => {       acc[name] = path.join(__dirname, 'node_modules', name);       return acc;     }, {}),   }, };``

如果你使用旧版的 Metro（比如 React Native 版本小于 0.55），这个配置文件看起来是这样的：

js

 代码解读

复制代码

``const path = require('path'); const blacklist = require('metro/src/blacklist'); const pkg = require('../package.json'); const modules = [   // 导致重复包的模块可以加在这里   ...Object.keys({     ...pkg.dependencies,     ...pkg.peerDependencies,   }), ]; module.exports = {   getProjectRoots() {     return [__dirname, path.resolve(__dirname, '..')];   },   getProvidesModuleNodeModules() {     return modules;   },   getBlacklistRE() {     return blacklist([       new RegExp(         `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\/.*$`       ),     ]);   }, };``

注意，如果你的项目里有其他的 `node_modules`（比如 `docs` 中的），你可能也要把它填到黑名单中。

如果你使用了 `expo`，添加下面的配置到 `exp.json`：

json

 代码解读

复制代码

`"packagerOpts": {   "config": "./metro.config.js",   // projectRoots 需要设置为空字符串来覆盖 Expo 默认的配置   "projectRoots": "" }`

你可以参考 [react-native-tab-view](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freact-native-community%2Freact-native-tab-view "https://github.com/react-native-community/react-native-tab-view") 和 [tuya-panel-kit](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftuya%2Ftuya-panel-kit "https://github.com/tuya/tuya-panel-kit") 的 example 写法。另外 [react-native-builder-bob](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcallstack%2Freact-native-builder-bob "https://github.com/callstack/react-native-builder-bob") 这个脚手架也是基于相同的原理。感兴趣的可以上手把玩把玩。

> 涂鸦智能大量优质 HC，欢迎大家加入，需要内推加我微信 yang\_jun\_ning，或直接发简历到邮箱 [youngjuning@aliyun.com](https://link.juejin.cn?target=mailto%3Ayoungjuning%40aliyun.com "mailto:youngjuning@aliyun.com")