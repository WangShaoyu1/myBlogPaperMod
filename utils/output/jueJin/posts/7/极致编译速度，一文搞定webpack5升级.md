---
author: "网易云音乐技术团队"
title: "极致编译速度，一文搞定webpack5升级"
date: 2022-11-02
description: "作者在升级了webpack5以后，整体的开发体验都有了质的提升，本文主要归纳总结了创作者中心升级webpack5的流程以及分享过程中踩过的一些坑，供大家参考"
tags: ["前端","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:75,comments:0,collects:96,views:4165,"
---
> 本文作者：xiongxiao01

> 在尝试升级 webpack5 之前，建议大家尽量先把[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fmigrate%2F5%2F "https://webpack.js.org/migrate/5/")通读一遍，可以少走很多弯路，本文是在结合具体业务场景后，对官方文档的归纳和补充。

背景
--

music-musician-web-node 是音乐人场景的核心应用，覆盖的页面多，代码量大，在使用 webpack4 的情况下，本地开发的编译效率一直不是很好，以笔者使用的 MacBook Pro M1 为例，音乐人 + 版权总共 45 个页面，启动一次全量构建需要花费 140s 左右 (已经加了诸如 happypack 之类的并行打包策略) ![image.png](/images/jueJin/fb86d6b3387869f.png)

增量构建一般是 4-5s，但是一旦修改引用次数比较多的比如公用的 ts 定义，则增量编译时间一度能达到 80s 以上 ![image.png](/images/jueJin/18fd78d57fdc172.png)

因此，随着业务需求的增多，为了提升需求交付效率，解决开发体验的问题，就变得非常急迫。在解决开发体验方面，升级 webpack 是最快捷且直接能带来巨大收益的手段。

webpack5 带来的提升
--------------

webpack4 到 webpack5 毕竟有很多的 break change，为了让大家能有升级的热情，那么还是必须先展示升级带来的提升。我们就以创作者中心的数据来说明。 在上面的背景里面我们已经讲了原先开发时 webpack 启动和增量构建的时间分别是`140s`和平均`4-5s`，这里我们直接列出升级后的成果

### 启动时间降低

webpack 启动时间缩短到`55s`左右，减少了近**60%** ![image.png](/images/jueJin/4c3551c7e5ac8bd.png)

### 增量时间降低

增量构建时间非常夸张，直接到了`1s`左右，即使是原先可能会导致构建时间达到 80s 以上的 ts 定义修改，也被降低到`3s`左右，平均减少**80%** 以上 ![image.png](/images/jueJin/85b54d6493231a7.png)

### 生产包构建时间

之前在本地大约是 240s 左右，升级后为 200s。  
![image.png](/images/jueJin/04154b372ebd054.png)  
注意：一定要升级 terser-webpack-plugin 到最新版，否则生产包构建时间相较于 webpack4 可能还会降低。

### 包体积变化

因为创作者中心的项目页面非常多，不太好比较 webpack4 和 webpack5 打包结果体积的变化，但是从官方优化策略（这个优化策略还导致了很多 break change，这个在下文会细讲）和很多实践结果看，对包体积都是有优化的。

升级前置准备
------

从这里开始，我们就正式着手 webpack 的升级。在正式升级前，需要先做一些前置工作，这些工作可以帮我们规避之后升级过程中一些奇怪的问题。

*   将 webpack 升级到 v4 的最新版本：如果你当前使用的版本就是 v4，升级应该是无痛的，但如果 webpack 是 v3 甚至更早的版本，请参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fmigrate%2F4%2F "https://webpack.js.org/migrate/4/")先升级到 v4
*   将 webpack-cli 升级到最新版
*   将使用的 loader 和 plugin 都升级到兼容 v4 的最新版本：这里要留意每个 plugin 和 Loader 对于 webpack 版本的要求，因为有些 loader/plugin 的最新版是只兼容 webpack5 的，我们这里还暂时不需要升级到这一步

因为每个项目所使用的 loader 和 plugin 有一些差异，因此这里实在不方便列出所有对应的版本，只能以笔者自身的项目为例，把常见的 plugin 和 loader webpack4 对应的最新版本列出来，其他的请根据自己项目的情况，到 npm 或者 github 查找 readme 或者翻阅 release 记录，几乎所有符合标准的工具库都会给出

*   **terser-webpack-plugin**: webpack4 请升级到 4.x, webpack5 升级到最新
*   **babel-loader**: 无论 v4 或者 v5, 升级到 7.x 或者 8.x 都可以
*   **extract-text-webpack-plugin**: v4 请升级到最新版，v5 之后用 mini-css-extract-plugin 进行替换
*   **optimize-css-assets-webpack-plugin**: v4 升级到最新版，v5 用 css-minimizer-webpack-plugin 替换
*   **ts-loader**: v4 升级到 8.x，v5 升级最新版
*   **less-loader**: 7.x 为兼容 webapck4 的最后版本
*   **sass-loader**: 10.x 为兼容 webpack4 的最后版本
*   **css-loader**: 5.x 为兼容 webpack4 的最后版本
*   **postcss-loader**: 4.x 为兼容 webpack4 的最后版本
*   ...

### 修复 warning 和 errors

做完上述的前置准备以后，不出意外，运行编译流程，会有一些报警甚至是错误，请修复这些问题。

### 更改 v4 版本过时的写法

v4 版本就在告警的过时写法在 v5 版本一般都会直接抛弃，所以我们需要对照官方给出的指引，进行更改，否则升级 webpack5 后 webpack 是无法启动的

*   optimization.hashedModuleIds: true → optimization.moduleIds: 'hashed'
*   optimization.namedChunks: true → optimization.chunkIds: 'named'
*   optimization.namedModules: true → optimization.moduleIds: 'named'
*   NamedModulesPlugin → optimization.moduleIds: 'named'
*   NamedChunksPlugin → optimization.chunkIds: 'named'
*   HashedModuleIdsPlugin → optimization.moduleIds: 'hashed'
*   optimization.noEmitOnErrors: false → optimization.emitOnErrors: true
*   optimization.occurrenceOrder: true → optimization: { chunkIds: 'total-size', moduleIds: 'size' }
*   optimization.splitChunks.cacheGroups.vendors → optimization.splitChunks.cacheGroups.defaultVendors
*   optimization.splitChunks.cacheGroups.test(module, chunks) → optimization.splitChunks.cacheGroups.test(module, { chunkGraph, moduleGraph })
*   Compilation.entries → Compilation.entryDependencies
*   serve → serve is removed in favor of DevServer
*   Rule.query (deprecated since v3) → Rule.options/UseEntry.options

### 测试 webpack5 的兼容性

这一步非常重要，webpack5 相比于 webpack4 一个非常显著的差异，就是 webpack5 为了优化 bundle size，不再默认支持 node polyfill，所以一旦一些 node 与 browser 环境公用的包内部使用了 node 的全局变量，则会引发非常严重的 runtime 阶段的报错，为了尽量提前发现问题，我们需要在去掉 node 全局变量的情况下先测试下代码的运行情况 注意：这里的写法仅用于 webpack4 测试兼容性阶段，在升级 webpack5 之后记得去掉

```js
    module.exports = {
    // ...
        node: {
        Buffer: false,
        process: false,
        },
        };
```

在补充完上述代码后，先运行自己代码看看，是否会遇到页面报错，注意，这些报错是 runtime 阶段的，并不是编译阶段就会出现的，所以得实际运行页面才能看出来。 如果你的代码直接或者间接依赖了 node 的 process 和 Buffer 变量，那么你肯定会遇到下面的报错

```csharp
ReferenceError: Buffer is not defined
```

或者

```arduino
ReferenceError: process is not defined
```

在实际的业务场景中，我们一个工程往往有非常多的页面，且每个页面状态繁多，无法简单的看出是否有 runtime 报错，所以我建议读者直接就当做代码中确实就是有 node 全局变量的引用，然后在升级 webpack5 的时候手动进行 polyfill，这样可以将问题概率降到最低，具体怎么做 polyfill，接下来就会讲到。

开始 webpack5 升级
--------------

在上述前置准备完成后，我们可以开始进行正式的升级了。

### 安装最新 webpack 版本

```css
nenpm install -D webpack@latest
```

### 更改配置

*   移除`optimization.moduleIds`和`optimization.chunkIds`的配置，webpack5 优化了 chunkId 和 moduleId 的默认生成策略，直接用默认的会更高效
*   使用`[hash]`占位符的地方都可以换成`[contenthash]`，后者会更高效
*   `IgnorePlugin`在入参为 regexp 的时候，写法改成`new IgnorePlugin({ resourceRegExp: /regExp/ })`
*   对于 webpack4 中如`node.fs: 'empty'`的写法，在 webpack5 中，node 属性只支持三个字段，`global`,`__dirname`,`__filename`，[参考](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fnode%2F "https://webpack.js.org/configuration/node/")，所以除这三个属性外的 node 属性，需要放到`resolve.fallback`中，因此`node.fs: 'empty'`需要改为`resolve.fallback.fs: false`
*   `url-loader`,`raw-loader`,`file-loader`建议直接用[Assets Module](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fasset-modules%2F "https://webpack.js.org/guides/asset-modules/")替换，虽然不换也暂时不影响，但是在后面的版本，这三个 loader 可能被移除

针对`optimization.splitChunks`，在 v5 版本尽量参考下列配置

*   splitChunks 推荐使用默认配置，或者直接`optimization.splitChunks: { chunks: 'all' }`
*   如果原先有这种写法`optimization.splitChunks.cacheGroups: { default: false, vendors: false }`，需要改成`optimization.splitChunks.cacheGroups: { default: false, defaultVendors: false }`

### 需要更正或者省略的写法

#### /\* webpackChunkName: '...' \*/

之前的代码逻辑中，我们会使用这种注释写法给 code split 的 chunk 命名，但是在 v5 版本，可以不用这么做，当 mode 为 development 的时候，webpack 会自动以文件名来命名 chunk

#### 引用 Json 的变化

原先的这种写法

```javascript
import { version } from './package.json';
console.log(version);
```

需要改成

```javascript
import pkg from './package.json';
console.log(pkg.version);
```

处理升级过程中的错误
----------

一般来说，在升级过程中，会遇到三类问题

### schema 错误

webpack 的配置语法错误，这种错误很好解决，在报错信息中 webpack 会详细标明错误原因和改进方法，按照提示进行修复即可。

### 编译时报错

这类问题也不难解决，最常见的就是因为 webpack5 升级后不再做 node 的 polyfill，会报`module not found`，这里列出官方给出的 webpack4 默认的 polyfill，大家根据业务场景的报错，自行下载对应的 npm 模块，然后添加配置即可（不需要全部加上，根据报错内容按需添加）

```js
    module.exports = {
    //...
        resolve: {
            fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            console: require.resolve('console-browserify'),
            constants: require.resolve('constants-browserify'),
            crypto: require.resolve('crypto-browserify'),
            domain: require.resolve('domain-browser'),
            events: require.resolve('events'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            punycode: require.resolve('punycode'),
            process: require.resolve('process/browser'),
            querystring: require.resolve('querystring-es3'),
            stream: require.resolve('stream-browserify'),
            string_decoder: require.resolve('string_decoder'),
            sys: require.resolve('util'),
            timers: require.resolve('timers-browserify'),
            tty: require.resolve('tty-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
            vm: require.resolve('vm-browserify'),
            zlib: require.resolve('browserify-zlib'),
            },
            },
            };
```

还有一种可能的情况是之前能引用的 npm 包，在升级以后引用不到了，需要变更写法，这种比较少见，但是创作者中心这里遇到过。应用依赖的二方包依赖了 uuid 这个库，之前的写法是

```js
import uuidv4 from 'uuid/dist/v4';

// ...
```

然而升级之后，这种写法在编译时就报错了，需要改成

```js
import { v4 as uuidv4 } from 'uuid';
```

这种错误就很难预料，但好在是编译时的报错，还是有迹可循的，遇到后再 google 其实问题也不大。

### runtime 阶段报错

以创作者中心升级的经验来看，会有两种引发 runtime 阶段报错的原因

#### node 全局变量 polyfill

最常见的也是 node polyfill 的丢失，上面也提到过，node 与 browser 公用的一些包中会使用一些 node 的全局变量 (process,Buffer)，这些变量是直接使用的，并没有 require，因此在编译阶段不会暴露。 为了解决这类问题，需要这么配置

```js
    {
        plugins: [
            new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
            }),
            ],
        }
```

使用 ProvidePlugin 将变量注入到全局，这里注意要下载对应的 buffer 和 process/browser 的包，这里我推荐大家都将 buffer 和 process 的 polyfill 加上，以防万一

#### import 后变量丢失

这个也是升级过程中实际遇到过的。 部分 npm 包导出的写法并不是特别规范，在 webpack4 的版本会自动被兼容掉，但是 webpack5 因为默认支持 tree shaking，对于 npm 包的导出写法会更严格，因此存在一种情况，即

```js
import watermark from 'watermark-dom'
```

这种写法在升级后，引用到的变量是 undefined，同时也没有警告和编译错误 需要改成

```js
import { watermark } from 'watermark-dom';
```

这种 runtime 阶段的报错处理起来就非常棘手，关键在于难以预料，无法防范，上面只是列举了创作者中心升级过程中的 runtime 报错，不同的业务场景可能还会遇到其他的报错，所以千万不要有侥幸心理，唯一稳妥的办法是将升级的影响范围告知 qa，让 qa 做一次完整回归。

部分 loader 的优化
-------------

### 去掉 cache 相关的 loader 和 plugin

webpack5 内部对于 cache 的优化和利用已经非常好了，不需要再使用 webpack4 阶段用来优化缓存的 loader 和 plugin 来提升性能，只会引发未知的问题，建议全部去掉。

### 用 thread-loader 替换 happypack

happypack 的作者本人已经不再维护该模块，而 thread-loader 是官方推出的多线程编译优化方案，性能据说要好不少，推荐在升级完成后进行替换。

### 使用 css-minimizer-webpack-plugin 替换 optimize-css-assets-webpack-plugin

该 loader 用于 css 代码压缩，官方给的建议是升级后进行替换 ![image.png](/images/jueJin/fe7d03a89fdcfaa.png)

### 用 @babel/preset-typescript 替换 ts-loader

推荐尝试，不仅仅在配置上简化很多，一套 babel 配置吃遍所有 js，同时在性能方面，个人体验后感觉确实会快不少。 不过 @babel/preset-typescript 因为没有再走 tsc，所以编译时不会再像 ts-loader 那样将编译错误暴露出来，这里需要单独装一个插件 [fork-ts-checker-webpack-plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTypeStrong%2Ffork-ts-checker-webpack-plugin "https://github.com/TypeStrong/fork-ts-checker-webpack-plugin") 来进行编译过程中的语法校验

后记
--

webpack5 升级最难解决的问题还是 runtime 阶段的异常报错，这些报错都是跟具体的业务场景挂钩，无法枚举。本文的目的也是以当前业务场景的升级经验，将一些问题处理思路提供出来供大家参考。 以上就是本次创作者中心升级 webpack 的总结，希望对大家有所帮助。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe (at) corp.netease.com！