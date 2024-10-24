---
author: "Gaby"
title: "Snowpack - 更快的前端构建工具"
date: 2021-08-06
description: "Snowpack 在开发环境中使用原生 ES 模块代替以往的打包方式，每一个文件只需要构建一次并缓存，当某个文件改变时 Snowpack 只会重新构建这个被改动的文件并通过模块热替换（HMR）技术更新"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:0,views:1267,"
---
最近开发项目，偶然间发现了[Snowpack](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fconcepts%2Fhow-snowpack-works "https://www.snowpack.dev/concepts/how-snowpack-works")这个库，它在开发环境中使用原生 ES 模块标准引入 js 文件，这让我眼前一亮，本身我就对前端标准的发展十分感兴趣，所以就阅读了一下文档。

![image.png](/images/jueJin/f2bfd68655254de.png)

**更快的前端构建工具**

Snowpack 在开发环境中使用原生 ES 模块代替以往的打包方式，每一个文件只需要构建一次并缓存，当某个文件改变时 Snowpack 只会重新构建这个被改动的文件并通过模块热替换（HMR）技术更新变更。

在生产环境打包时，Snowpack 可以集成其他打包工具，比如 Webpack。

**关键功能**

*   更快的开发速度，开发服务器可以在 50ms 以内启动
*   利用模块热替换（HMR）技术，代码的变更可以更快的在浏览器中体现出来
*   在打包生产环境时，可以结合其他类似 Webpack 这样的打包工具使用
*   内置了对 TypeScript，JSX，CSS Module 等功能，开箱即用
*   提供插件的方式提供对类似 Babel，Vue 等第三方库的支持

Snowpack 的工作原理
--------------

### 概括[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fconcepts%2Fhow-snowpack-works%23summary "https://www.snowpack.dev/concepts/how-snowpack-works#summary")

**Snowpack 是一种现代、轻量级的构建工具，用于加快 Web 开发。** 每次保存单个文件时，像 webpack 和 Parcel 这样的传统 JavaScript 构建工具都需要重新构建和重新打包整个应用程序块。这个重新捆绑步骤会在点击保存更改和在浏览器中看到它们之间引入延迟。

**在开发过程中，**  Snowpack 为您的应用程序提供未**捆绑的**服务 **。** 每个文件只需要构建一次，然后永久缓存。当文件更改时，Snowpack 会重建该单个文件。无需浪费时间重新捆绑每个更改，只需在浏览器中进行即时更新（通过[热模块更换 (HMR)](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fconcepts%2Fhot-module-replacement "https://www.snowpack.dev/concepts/hot-module-replacement")速度更快）。您可以在我们的[Snowpack 2.0 发布帖子中](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fposts%2F2020-05-26-snowpack-2-0-release%2F "https://www.snowpack.dev/posts/2020-05-26-snowpack-2-0-release/")阅读有关此方法的更多信息[。](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fposts%2F2020-05-26-snowpack-2-0-release%2F "https://www.snowpack.dev/posts/2020-05-26-snowpack-2-0-release/")

Snowpack 的**非捆绑开发**仍然支持您用于生产的相同**捆绑构建**。当您为生产构建应用程序时，您可以通过 Webpack 或 Rollup（即将推出）的官方 Snowpack 插件插入您最喜欢的捆绑器。由于 Snowpack 已经在处理您的构建，因此不需要复杂的打包器配置。

**Snowpack 为您提供两全其美：** 快速、非捆绑式开发，在捆绑式生产版本中优化性能。

![image.png](/images/jueJin/909e271bef5f4c3.png)

### 非捆绑开发[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fconcepts%2Fhow-snowpack-works%23unbundled-development "https://www.snowpack.dev/concepts/how-snowpack-works#unbundled-development")

**非捆绑开发**是在**开发**过程中将单个文件传送到浏览器的想法。仍然可以使用您喜欢的工具（如 Babel、TypeScript、Sass）构建文件，然后通过 ESM`import`和`export`语法在浏览器中单独加载依赖项。每当您更改文件时，Snowpack 只会重建该文件。

另一种选择是**捆绑开发。** 当今几乎所有流行的 JavaScript 构建工具都专注于捆绑开发。通过捆绑器运行您的整个应用程序会给您的开发工作流程带来额外的工作和复杂性，现在 ESM 得到广泛支持，这些工作是不必要的。每一次更改——每次保存时——都必须与应用程序的其余部分重新绑定，然后您的更改才能反映在浏览器中。

与传统的捆绑开发方法相比，非捆绑开发有几个优点：

*   单文件构建速度很快。
*   单文件构建是确定性的。
*   单文件构建更容易调试。
*   项目大小不会影响开发速度。
*   单个文件缓存更好。

最后一点是关键：**每个文件都是单独构建并无限期缓存。** 您的开发环境永远不会多次构建文件，您的浏览器永远不会下载文件两次（直到它发生变化）。这就是非捆绑开发的真正力量。

### 使用 NPM 依赖[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Fconcepts%2Fhow-snowpack-works%23using-npm-dependencies "https://www.snowpack.dev/concepts/how-snowpack-works#using-npm-dependencies")

NPM 包主要使用模块语法（Common.js 或 CJS）发布，如果没有一些构建处理就无法在 Web 上运行。即使您使用浏览器原生 ESM`import`和`export`直接在浏览器中运行的语句编写应用程序，尝试导入任何一个 npm 包都会迫使您重新进行捆绑开发。

**Snowpack 采取了不同的方法：Snowpack**不是针对这一要求捆绑整个应用程序，而是单独处理您的依赖项。这是它的工作原理：

```js
node_modules/react/**/*     -> http://localhost:3000/web_modules/react.js
node_modules/react-dom/**/* -> http://localhost:3000/web_modules/react-dom.js
```

1.  Snowpack 会扫描您的网站/应用程序以查找所有使用过的 npm 包。
2.  Snowpack 从您的`node_modules`目录中读取这些已安装的依赖项。
3.  Snowpack 将您的所有依赖项单独捆绑到单个 JavaScript 文件中。例如：`react`and`react-dom`分别转换为`react.js`and `react-dom.js`。
4.  每个生成的文件都可以直接在浏览器中运行，并通过 ESM`import`语句导入。
5.  由于您的依赖项很少更改，因此 Snowpack 很少需要重建它们。

在 Snowpack 构建您的依赖项后，任何包都可以导入并直接在浏览器中运行，而无需额外的捆绑或工具。这种在浏览器中本地导入 npm 包的能力（没有捆绑器）是所有非捆绑开发和 Snowpack 其余部分构建的基础。

```html
<!-- This runs directly in the browser with `snowpack dev` -->
<body>
<script type="module">
import React from 'react';
console.log(React);
</script>
</body>
```

快速开始
----

### 安装 Snowpack[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Ftutorials%2Fquick-start%23install-snowpack "https://www.snowpack.dev/tutorials/quick-start#install-snowpack")

```js
# npm:
npm install --save-dev snowpack
# yarn:
yarn add --dev snowpack
# pnpm:
pnpm add --save-dev snowpack
```

### 运行 Snowpack CLI[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Ftutorials%2Fquick-start%23run-the-snowpack-cli "https://www.snowpack.dev/tutorials/quick-start#run-the-snowpack-cli")

```js
npx snowpack [command]
yarn run snowpack [command]
pnpm run snowpack [command]
```

在整个文档中，我们将使用`snowpack [command]`来记录 CLI。要运行您的本地安装积雪的版本，添加`npx`/ `yarn run`/`pnpm run`前缀用于安装积雪了包管理器。

对于长期开发，使用 Snowpack 的最佳方式是使用 package.json 脚本。这减少了您自己记住确切 Snowpack 命令/配置的需要，并让您与团队的其他成员共享一些常用脚本（如果适用）。

```js
// Recommended: package.json scripts
// npm run start (or: "yarn run ...", "pnpm run ...")
    "scripts": {
    "start": "snowpack dev",
    "build": "snowpack build"
}
```

除了 react 模版，Snowpack 还提供了其他模板

[@snowpack/app-template-blank](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-blank "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-blank")

*   [@snowpack/app-template-blank-typescript](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-blank-typescript "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-blank-typescript")
    
*   [@snowpack/app-template-minimal](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-minimal "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-minimal")
    
*   [@snowpack/app-template-react](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-react "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-react")
    
*   [@snowpack/app-template-react-typescript](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-react-typescript "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-react-typescript")
    
*   [@snowpack/app-template-preact](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-preact "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-preact")
    
*   [@snowpack/app-template-svelte](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-svelte "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-svelte")
    
*   [@snowpack/app-template-vue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-vue "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-vue")
    
*   [@snowpack/app-template-lit-element](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-lit-element "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-lit-element")
    
*   [@snowpack/app-template-lit-element-typescript](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-lit-element-typescript "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-lit-element-typescript")
    
*   [@snowpack/app-template-11ty](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fapp-template-11ty "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/app-template-11ty")
    
*   **[See all community templates](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnowpackjs%2Fsnowpack%2Ftree%2Fmaster%2Fcreate-snowpack-app%2Fcli%23featured-community-templates "https://github.com/snowpackjs/snowpack/tree/master/create-snowpack-app/cli#featured-community-templates")**
    

### 在本地为您的项目提供服务[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Ftutorials%2Fquick-start%23serve-your-project-locally "https://www.snowpack.dev/tutorials/quick-start#serve-your-project-locally")

```js
snowpack dev
```

这将启动本地开发服务器进行开发。默认情况下，这会将您当前的工作目录提供给浏览器，并将查找`index.html`要启动的文件。您可以通过[“挂载”](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Freference%2Fconfiguration "https://www.snowpack.dev/reference/configuration")配置自定义要提供服务的目录。

### 构建你的项目[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Ftutorials%2Fquick-start%23build-your-project "https://www.snowpack.dev/tutorials/quick-start#build-your-project")

```js
snowpack build
```

这会将您的项目构建到一个`build/`可以在任何地方部署的静态目录中。您可以通过[配置](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Freference%2Fconfiguration "https://www.snowpack.dev/reference/configuration")自定义您的构建。

### 查看所有命令和选项[#](https://link.juejin.cn?target=https%3A%2F%2Fwww.snowpack.dev%2Ftutorials%2Fquick-start%23see-all-commands--options "https://www.snowpack.dev/tutorials/quick-start#see-all-commands--options")

```js
snowpack --help
```

该`--help`标志将显示有用的输出。

**文中如有错误，欢迎在评论区指正，如果这篇文章帮到了你，欢迎点赞👍收藏加关注😊，希望点赞多多多多...**