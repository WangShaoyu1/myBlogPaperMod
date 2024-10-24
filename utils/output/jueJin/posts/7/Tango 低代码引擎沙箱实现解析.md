---
author: "网易云音乐技术团队"
title: "Tango 低代码引擎沙箱实现解析"
date: 2024-03-15
description: "Tango 是一个用于快速构建低代码平台的低代码设计器框架，并以源代码为中心，执行和渲染前端视图，并为用户提供低代码可视化搭建能力，用户的搭建操作会转为对源代码的修改。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:11,comments:1,collects:21,views:6406,"
---
> 本文作者：0xcc

![](/images/jueJin/2bcd9ebefa9844a.png)

Tango 基本介绍
----------

Tango 是一个用于快速构建低代码平台的低代码设计器框架，并以源代码为中心，执行和渲染前端视图，并为用户提供低代码可视化搭建能力，用户的搭建操作会转为对源代码的修改。借助于 Tango 构建的低代码工具或平台，可以实现 源码进，源码出的效果，无缝与企业内部现有的研发体系进行集成。

### 开源进展

目前 Tango 设计器引擎部分已经开源，正在积极推进中，可以通过如下的信息了解到我们的最新进展：

*   开源代码库：[github.com/NetEase/tan…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Ftango "https://github.com/NetEase/tango")
*   文档地址：[netease.github.io/tango-site/](https://link.juejin.cn?target=https%3A%2F%2Fnetease.github.io%2Ftango-site%2F "https://netease.github.io/tango-site/")
*   社区讨论组：[github.com/NetEase/tan…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Ftango%2Fdiscussions "https://github.com/NetEase/tango/discussions")

此外，Tango 的文档现已全面更新，欢迎浏览。

[![](/images/jueJin/d117c29c96144c0.png)](https://link.juejin.cn?target=https%3A%2F%2Fnetease.github.io%2Ftango-site%2F "https://netease.github.io/tango-site/")

欢迎大家加入到我们的社区中来，一起参与到 Tango 低代码引擎的开源建设中。有任何问题都可以通过 [Github Issues](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Ftango%2Fissues "https://github.com/NetEase/tango/issues") 反馈给我们，我们会及时跟进处理。

### 往期系列文章

*   [网易云音乐 RN 低代码体系建设思考与实践](https://juejin.cn/post/7316145034691870754 "https://juejin.cn/post/7316145034691870754")
*   [手把手带你走进Babel的编译世界](https://juejin.cn/post/7078482623387402271 "https://juejin.cn/post/7078482623387402271")
*   [网易云音乐低代码体系建设思考与实践](https://juejin.cn/post/7074842507028856846 "https://juejin.cn/post/7074842507028856846")
*   [云音乐低代码：基于 CodeSandbox 的沙箱性能优化](https://juejin.cn/post/7102243774985666596 "https://juejin.cn/post/7102243774985666596")
*   [云音乐低代码 + ChatGPT 实践方案与思考](https://juejin.cn/post/7239742600550350906 "https://juejin.cn/post/7239742600550350906")
*   [网易云音乐 Tango 低代码引擎实现揭秘](https://juejin.cn/post/7287134477838876707 "https://juejin.cn/post/7287134477838876707")
*   [网易云音乐 Tango 低代码引擎正式开源](https://juejin.cn/post/7273051203562749971 "https://juejin.cn/post/7273051203562749971")
*   [低代码在云音乐数据业务中的落地实践与思考](https://juejin.cn/post/7303360094426546216 "https://juejin.cn/post/7303360094426546216")

* * *

为什么 Tango 需要沙箱
--------------

传统的基于 DSL 的低代码方案通常需要实现一套对应的 DSL 语法与渲染器，在渲染器内渲染给定的组件、绑定事件等。与此不同，Tango 是基于 AST 驱动的面向源码的低代码方案。相较于 DSL 方案，Tango 的写法更加灵活，但也带来了支持源代码实时运行的挑战。此外，为了与团队内已有的物料集成，Tango 支持添加业务组件，因此设计器还需要考虑三方依赖的加载与运行。因此，Tango 需要一个独立的沙箱来运行源码，提供可以媲美本地开发的代码运行时。

在初期，Tango 曾调研了几种方案，如基于 Sea.js 这类 AMD 加载方案。然而，这类方案的问题在于依赖比较固定，需要将依赖预先构建出符合规范的产物（如 UMD 资源），因此不能灵活地添加依赖。至于 SystemJS 和 ViteSandbox 这类 ESM 方案，由于 Tango 期望支持直接使用已有的组件物料，而它们的产物主要以 CommonJS 为主，缺少 ESM 产物。此外，我们后续对沙箱的改造优化大幅减少了沙箱初始化的时间，因此没有采用该方案。

Tango 目前采用的沙箱方案是基于 [CodeSandbox](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcodesandbox%2Fcodesandbox-client "https://github.com/codesandbox/codesandbox-client") 提供的沙箱能力实现的。它的优势在于提供了更完整、接近本地开发的运行时环境，支持直接拉取 npm 包并运行。它借助 Babel 将 ESM 和浏览器不支持的新语法转译为 CommonJS，模拟了 CommonJS 的运行环境，实现了源码在浏览器上直接运行。这样即便依赖没有提供可供浏览器使用的预构建产物，也能在沙箱内实时转译并运行。此外，CodeSandbox 的沙箱运行在一个 iframe 内，可以隔离代码的运行时环境，避免污染设计器的全局变量。

Tango 沙箱的基本结构
-------------

CodeSandbox 是一个在线运行 JavaScript 代码的平台，它的沙箱借助 Babel 与 Web Worker 等能力，在浏览器上实时转译与运行代码。你可以把它的沙箱能力想象成一个在浏览器上运行的 webpack，比如它的转译器 Transpiler 就和 webpack 的 loader 比较接近。。

由于 CodeSandbox 自己实现了各个模板的转译规则，整个转译流程均由自己把控，因此它整体上会比 webpack 轻量些。例如 CodeSandbox 在初始化依赖时能忽略掉绝大多数的 `devDependencies`，从而大幅减少项目的依赖初始化时间与转译时间。

结合 Tango 后的沙箱可以简化为三个部分：

![](/images/jueJin/39eaf6699e3243a.png)

*   沙箱前端组件：一个开箱即用的沙箱组件，只需要传入代码和配置就可以完成应用的渲染
*   在线打包器：提供搭建产物的浏览器端构建能力，类似于一个浏览器版本的 webpack，最终形态是一个独立的 iframe
*   沙箱后端服务：对依赖的资源进行预构建，以及提供资源合并等服务，用来加速沙箱内部的构建打包过程

它的工作流程可以简述如下：

*   代码准备：平台引用沙箱组件，通过 `postMessage` 将代码传递给沙箱
*   依赖初始化：沙箱处理传入的文件，根据 `package.json` 的 `dependencies` 调用 Packager 打包服务获取依赖
*   转译代码：解析代码的依赖关系，将依赖的代码通过对应的 Transpiler 转译
*   执行代码：在沙箱中初始化 html 等，然后从代码的入口文件开始执行转译后的代码
*   上述执行周期内和执行完成后，沙箱会抛出事件让平台感知

Tango 沙箱的工作流程
-------------

> 本部分主要参考了 [CodeSandbox 如何工作? 上篇](https://link.juejin.cn?target=https%3A%2F%2Fbobi.ink%2F2019%2F06%2F20%2Fcodesandbox%2F "https://bobi.ink/2019/06/20/codesandbox/") 的部分内容，并在此基础上进行了修改。如果你对 CodeSandbox 底层的更多细节感兴趣，不妨阅读下这篇文章。

### 依赖的初始化

如前所述，CodeSandbox 在内部实现了核心的转译逻辑（例如 Babel 与 less 转译），整个转译流程都由自己控制，因此在初始化依赖时可以相对轻量一些，只需获取 `dependencies` 里必要的依赖，忽略掉 `devDependencies` 以及 `@types` 开头的只在本地开发时才会用上的依赖。

CodeSandbox 是如何获取依赖的呢？CodeSandbox 实现了两套方案，一套是默认的远程在线打包方案，另一套是从 unpkg/jsdelivr 等 npm 包资源的 CDN 获取依赖的兜底方案。

CodeSandbox 设计了一个 Serverless 服务 [dependency-packager](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcodesandbox%2Fdependency-packager "https://github.com/codesandbox/dependency-packager")，这个服务负责在线拉取依赖，然后一次性返回包括子依赖在内的所有需要的文件。当服务接收到接口请求后，会解析 URL 中的包名与版本号，并在服务端执行 `yarn install` 安装 npm 包，然后从入口文件开始逐一解析依赖的文件以及各个包之间的依赖关系，最后将被依赖的文件一次性返回。由于该服务仅返回被依赖的文件，在减少网络请求的资源大小的同时，沙箱可以避免转译 `.d.ts` 或测试用例这样运行时不需要的文件。

不过由于 packager 返回的文件是从包的入口文件开始计算的被引入的文件，因此在实际使用中，一些未被引入的文件可能也会被项目使用。当项目引入了被排除的资源时，沙箱会在前端请求 unpkg/jsdelivr 作为兜底方案，从而顺利完成转译。当然，缺点就是如果缺失的文件比较多，实时获取的方案会多出很多的网络请求开销。因此 CodeSandbox 还使用了 Service Worker 作资源缓存，减少二次复访的网络请求。

### 转译与构建

当 CodeSandbox 开始转译时，会调用 `compile()` 方法开始转译，整个转译流程大致如下：

![](/images/jueJin/df7159debc0a4ff.png)

传入沙箱的参数除了代码外，还需要传入 `template` 参数，该参数用于指定沙箱转译时需要使用的 Preset。Preset 就像 webpack 的配置文件一样，内部定义了如何预处理依赖、不同的文件该使用哪些 Transpiler、在代码执行前做一些其他的操作等。

Preset 初始化好后，沙箱将初始化一个 Manager 实例，这个 Manager 实例会被 `compile()` 使用，用于控制整个转译流程的生命周期。然后，Manager 会按照上一节提到的方式初始化项目的依赖。如果传入的依赖发生了变更，沙箱会重新初始化一个新的 Manager 实例，避免运行时被旧的 Manager 依赖影响。

依赖准备好后，传入沙箱的代码会被传入 Manager，Manager 会将代码实例化为 TranspiledModule，解析各模块的依赖关系，计算是否被更新或删除等。然后沙箱将从代码的入口模块开始，根据 Preset 里定义的规则，对每一个模块递归调用指定的 Transpiler 转译。这里 Transpiler 就像 webpack 的 loader 一样，负责将文件转译为需要的产物。对于复杂的 Transpiler——例如负责转译 JavaScript 的 BabelTranspiler——还会使用 Web Worker 队列来提升转译效率。

当相关的模块都被转译好后，Manager 会进入代码执行阶段。

### 代码执行

沙箱的运行时模拟了 CommonJS 所需的环境，如 `require`、`module`、`exports`、`global` 等方法与变量。当所有需要的模块都被转译好后，Manager 会进入代码执行阶段。代码执行的核心代码如下：

```ts
    const allGlobals: { [key: string]: any } = {
    require, module, exports, process, global, ...globals,
    };
    
    const allGlobalKeys = Object.keys(allGlobals);
    const globalsCode = allGlobalKeys.length
    ? allGlobalKeys.join(', ') : '';
    const globalsValues = allGlobalKeys.map(k => allGlobals[k]);
    
    const newCode =
    `(function $csb$eval(` + globalsCode + `){` + code + `\n})`;
    // @ts-ignore
    (0, eval)(newCode).apply(allGlobals.global, globalsValues);
    
    return module.exports;
```

沙箱会从入口模块开始执行，执行时会将代码封装为上述的立即执行函数，然后调用 `eval()` 执行并传入上述 CommonJS 的方法与变量。若代码引用了其他文件，执行时调用的 `require()` 方法会按照相同的逻辑递归执行并返回执行后的产物。

经过上述流程后，项目中的代码就会被转译并执行，最终渲染在沙箱里，你就能看到代码的实际效果了。

沙箱的优化改造
-------

在 Tango 上开发的应用是一个完整的项目，并非像 CodeSandbox 网站上那样主要用于承载简单的示例或代码片段。因此用户对沙箱自身的构建性能与加载速度有较高的要求，以满足日常的开发体验。

关于我们对 CodeSandbox 优化的具体细节，可以参考我们之前的这篇 [云音乐低代码：基于 CodeSandbox 的沙箱性能优化](https://juejin.cn/post/7102243774985666596 "https://juejin.cn/post/7102243774985666596") ，修改后的 CodeSandbox 代码也可以在 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Fcodesandbox-client "https://github.com/NetEase/codesandbox-client") 上找到。

接入 Tango 沙箱
-----------

Tango 低代码设计器除了需要让沙箱运行源码、渲染页面以外，还需要实现可视化搭建的拖拽能力，因此设计器需要感知到用户在沙箱内的操作。但是，由于沙箱运行在一个独立的 iframe 内，并且部署在独立的域名下，两者之间是跨域的，因此需要做跨域兼容。通过将设计器平台与沙箱的 `document.domain` 均设为相同的父域名，并针对 [Chrome 的安全策略](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fblog%2Fdocument-domain-setter-deprecation "https://developer.chrome.com/blog/document-domain-setter-deprecation") 在平台与沙箱添加 `Origin-Agent-Cluster: ?0` 的 HTTP 响应头，就能实现平台与沙箱的跨域通信。

为了简化沙箱的使用成本，我们封装了一个 React 组件 `@music163/tango-sandbox` 供设计器使用，相关代码可以在 Tango 的 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Ftango%2Ftree%2Fmain%2Fpackages%2Fsandbox "https://github.com/NetEase/tango/tree/main/packages/sandbox") 仓库里找到。它主要分为如下三个部分：

*   `IFrameProtocol`：负责与沙箱通信。通过监听 `message` 事件接收从沙箱传出的消息，以获取沙箱主动传出的生命周期。通过在 iframe 内部调用 `postMessage()` 方法向沙箱传递事件，从而控制沙箱。
*   `PreviewManager`：负责管理沙箱的基本渲染。其借助上面的 `IFrameProtocol` 与沙箱通信，当代码发生变化时，会向沙箱发送 `compile` 消息，从而触发沙箱的构建与渲染。
*   `Sandbox`：用于渲染沙箱的 React 组件。除了挂载沙箱的 iframe 外，还包括了沙箱配置、注册事件监听函数、消息传递、路由管理等功能。当组件传入的 props 发生变化时，会相应地更新沙箱代码、更新 iframe 路由等。

Tango 低代码引擎通过向 Sandbox 组件传入 `files` 来实现代码的渲染，并传入 `eventHandler` 来监听用户在沙箱内的拖拽操作，最终实现了设计器的组件拖拽搭建能力。

不过，沙箱获取依赖的基本能力主要是 CodeSandbox 提供的 packager 与 JSDelivr、unpkg 提供的，如果需要使用团队内部的私有 registry 就需要将相关服务私有化部署了。限于篇幅就不在此做过多赘述，关于 Tango 沙箱的具体接入文档，以及上述第三方服务私有化部署需要做的修改，可以参考我们提供的 [沙箱接入文档](https://link.juejin.cn?target=https%3A%2F%2Fnetease.github.io%2Ftango-site%2Fdocs%2Fdesigner%2Fdeploy%2Fsandbox%2F "https://netease.github.io/tango-site/docs/designer/deploy/sandbox/")。

总结
--

本文简单介绍了 Tango 低代码引擎的沙箱能力，并分析了 CodeSandbox 的基本结构和工作流程。通过 CodeSandbox 强大的沙箱能力与优化，Tango 低代码引擎实现了可视化预览与搭建能力，为开发者提供了便捷高效的开发体验。

Tango 开源计划
----------

目前我们已经完成了 Tango 核心实现的基本代码库的开源，包括核心引擎内核、沙箱、设置器、应用框架、物料协议等等，并发布了 RC 版本。在今年，我们将持续推进云音乐低代码核心能力的开源，包括基本的服务端能力，前端组件库等，并持续优化和完善开源文档。并且，随着其他能力的稳定和时间的成熟，我们还将会持续向社区开源更多的内部实践。

参考资料
----

*   [CodeSandbox 如何工作? 上篇](https://link.juejin.cn?target=https%3A%2F%2Fbobi.ink%2F2019%2F06%2F20%2Fcodesandbox%2F "https://bobi.ink/2019/06/20/codesandbox/")
*   [云音乐低代码：基于 CodeSandbox 的沙箱性能优化](https://juejin.cn/post/7102243774985666596 "https://juejin.cn/post/7102243774985666596")
*   [搭建一个属于自己的在线 IDE](https://juejin.cn/post/6882541950205952013 "https://juejin.cn/post/6882541950205952013")
*   [网易云音乐 Tango 低代码引擎实现揭秘](https://juejin.cn/post/7287134477838876707 "https://juejin.cn/post/7287134477838876707")

最后
--

![](/images/jueJin/5ea5fa3bc75e4cf.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")