---
author: ""
title: "React Native中实现动态导入"
date: 2022-06-30
description: "React Native 虽然提供了拆包的能力，但只能拆为基础包和业务包；无法做精细化的代码分割，更无法提供灵活的按需加载能力。本文将介绍纯前端如何在 React Native 中实现的动态导入。"
tags: ["React Native中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:51,comments:6,collects:93,views:7065,"
---
> 本文作者：ssskkk

背景
--

随着业务的发展，每一个 React Native 应用的代码数量都在不断增加，bundle 体积不断膨胀，对应用性能的负面影响愈发明显。虽然我们可以通过 React Native 官方工具 Metro 进行拆包处理，拆分为一个基础包和一个业务包进行一定程度上的优化，但对日益增长的业务代码也无能为力，我们迫切地需要一套方案来减小我们 React Native 应用的体积。

### 多业务包

第一个想到的就是拆分多业务包，既然拆分为一个业务包不够，那我多拆为几个业务包不就可以了。当一个 React Native 应用拆分为多个业务包之后其实就相当于拆分为多个应用了，只不过代码在同一仓库里。这虽然可以解决单个应用不断膨胀的问题，但是有不少局限性。接下来一一分析：

*   链接替换，不同的应用需要不同的地址，替换成本较高。
*   页面之间通信，之前是个单页应用，不同页面之间可以直接通信；拆分之后是不同应用相互通信需要借助客户端桥接实现。
*   性能损耗，打开每个拆分的业务包都需要单独起一个 React Native 容器，容器初始化、维持都需要消耗内存、占用CPU。
*   粒度不够，最小的维度也是页面，无法继续对页面中的组件进行拆分。
*   重复打包，部分在不同页面之间共享的工具库，每个业务包都会包含。
*   打包效率，每一个业务包的打包过程，都要经过一遍完整的 Metro 打包过程，拆分多个业务包打包时间成倍增加。

### 动态导入

作为一个前端想到的另一方案自然就是动态导入（Dynamic import）了，基于其动态特性对于多业务包的众多缺点，此方案都可避免。此外拥有了动态导入我们就可以实现页面按需加载，组件懒加载等等能力。但是 Metro 官方并不支持动态导入，因此需要对 Metro 进行深度定制，这也是本文即将介绍的在 React Native 中实现动态导入。

Metro 打包原理
----------

在介绍具体方案之前我们先看下 Metro 的打包机制及其构建产物。

### 打包过程

如下图所示Metro打包会经过三个阶段，分别是 Resolution、Transformation、Serialization。 ![image](/images/jueJin/b47209a4157655d.png)

Resolution 的作用是从入口开始构建依赖图；Transformation 是和 Resolution 阶段同时执行的，其目的是将所有 module（一个模块就是一个 module ） 转换为目标平台可识别语言，这里面既有高级 JavaCript 语法的转换（依赖 BaBel），也有对特定平台，比如安卓的特殊 polyfills。这两个阶段主要是生产中间产物 IR 为最后一阶段所消费。

Serialization 则是将所有 module 组合起来生成 bundle，这里需要特别注意 Metro API 文档中 Serializer Options 中的两个配置：

*   签名为 `createModuleIdFactory`， type 为 `() => (path: string) => number`。 这个函数为每个 module 生成一个唯一的 moduleId，默认情况下是自增的数字。所有的依赖关系都依仗此 moduleId。
*   签名为 `processModuleFilter`， type 为 `(module: Array<Module>) => boolean`。这个函数用来过滤模块，决定是否打入 bundle。

### bundle 分析

一个 React Native 典型的 bundle 从上到下可以分为三个部分：

*   第一部分为 polyfills，主要是一些全局变量如 `__DEV__`；以及通过 IIFE 声明的一些重要全局函数，如： `__d`、 `__r` 等；
*   第二部分是各个 module 的定义，以 `__d` 开头，业务代码全部在这一块；
*   第三部分是应用的初始化 `__r(react-native/Libraries/Core/InitializeCore.js moduleId)` 和 `__r(${入口 moduleId})`。 我们看下具体函数的分析

#### \_\_d函数

```yaml
    function define(factory, moduleId, dependencyMap) {
        const mod = {
        dependencyMap,
        factory,
        hasError: false,
        importedAll: EMPTY,
        importedDefault: EMPTY,
        isInitialized: false,
            publicModule: {
        exports: {}
    }
    };
    modules[moduleId] = mod;
}
```

`__d` 其实就是 `define` 函数，可以看到其实现很简单，做的就是声明一个 `mode`，同时 `moduleId` 与 `mode` 做了一层映射，这样通过 `moduleId` 就可以拿到 module 实现。我们看下 `__d` 如何使用：

```ini
    __d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
    var _reactNative = _$$_REQUIRE(_dependencyMap[0], "react-native");
    
    var _reactNavigation = _$$_REQUIRE(_dependencyMap[1], "react-navigation");
    
    var _reactNavigationStack = _$$_REQUIRE(_dependencyMap[2], "react-navigation-stack");
    
    var _routes = _$$_REQUIRE(_dependencyMap[3], "./src/routes");
    
    var _appJson = _$$_REQUIRE(_dependencyMap[4], "./appJson.json");
    
    var AppNavigator = (0, _reactNavigationStack.createStackNavigator)(_routes.RouteConfig, (0, _routes.InitConfig)());
    var AppContiner = (0, _reactNavigation.createAppContainer)(AppNavigator);
    
        _reactNative.AppRegistry.registerComponent(_appJson.name, function () {
        return AppContiner;
        });
        }, 0, [1, 552, 636, 664, 698], "index.android.js");
```

这是 `__d` 的唯一用处，定义一个 module。这里解释下入参，第一个是个函数，就是 module 的工厂函数，所有的业务逻辑都在这里面，其是在 `__r` 之后调用的；第二个是 moduleId，模块的唯一标识；第三部分是其依赖的模块的 moduleId；第四个是此模块的文件名称。

#### \_\_r函数

```javascript
    function metroRequire(moduleId) {
    
    ...
    
    const moduleIdReallyIsNumber = moduleId;
    const module = modules[moduleIdReallyIsNumber];
    return module && module.isInitialized
    ? module.publicModule.exports
    : guardedLoadModule(moduleIdReallyIsNumber, module);
}

    function guardedLoadModule(moduleId, module) {
    
    ...
    
    return loadModuleImplementation(moduleId, module);
}

    function loadModuleImplementation(moduleId, module) {
    
    ...
    
    const moduleObject = module.publicModule;
    moduleObject.id = moduleId;
    factory(
    global,
    metroRequire,
    metroImportDefault,
    metroImportAll,
    moduleObject,
    moduleObject.exports,
    dependencyMap
    );
    return moduleObject.exports;
    
    ...
}
```

`__r` 其实就是 `require` 函数。如上精简后的代码所示，`require` 方法首先判断所要加载的模块是否已经存在并初始化完成，若是则直接返回模块，否则调用 `guardedLoadModule` 方法，最终调用的是 `loadModuleImplementation` 方法。`loadModuleImplementation` 方法获得模块定义时传入的 `factory` 方法并调用，最后返回。

方案设计
----

基于以上对 Metro 工作原理及其产物 bundle 的分析，我们可以大致得出这样一个结论：React Native 启动时，JS 测（即 bundle）会先初始化一些变量，接着通过 IIFE 声明核心方法 `define` 和 `require`；接着通过 `define` 方法定义所有的模块，各个模块的依赖关系通`moduleId` 维系，维系的纽带就是 `require`；最后通过 `require` 应用的注册方法实现启动。

实现动态导入自然需要将目前的 bundle 进行重新拆分和组合，整个方案的关键点在于：分和合，分就是 bundle 如何拆分，什么样的 module 需要拆分出去，什么时候进行拆分，拆分之后的 bundle 存储在哪里（涉及到后续如何获取）；合就是拆出去的 bundle 如何获取，并在获取之后仍在正确的上下文内执行。

### 分

前面有说过 Metro 工作的三个阶段，其中之一就是 Resolution，这一阶段的主要任务是从入口开始构建整个应用依赖图，这里为了方便示意以树来代替。 ![image](/images/jueJin/e85ccf3e8c58ba0.png)

#### 识别入口

如上所示就是一个依赖树，正常情况下会打出一个 bundle，包含模块 A、B、C、D、E、F、G。现在我想对模块 B 和 F 做动态导入。怎么做呢第一步当然是标识，既然叫动态导入自然而然的想到了 JavaScript 语法上的动态导入。 只需要将 `import A from '.A'` 改成 `const A = import('A')` 即可，这就需要引入 Babel 插件（）了，事实上官方 Metro 相关配置包 metro-config 已经集成了此插件。官方做的不仅仅于此，在 Transformation 阶段还对采用动态导入的 module 增加了唯一标识 `Async = true`。

此外在最终产物 bundle 上 Metro 提供了一个名叫 AsyncRequire.js 的文件模版来做动态导入的语法的 polyfill，具体实现如下

```javascript
const dynamicRequire = require;

    module.exports = function(moduleID) {
    return Promise.resolve().then(() => dynamicRequire.importAll(moduleID));
    };
```

总结一下 Metro 默认会如何处理动态导入：在 Transformation 通过 Babel 插件处理动态导入语法，并在中间产物上增加标识 `Async`，在 Serialization 阶段用 Asyncrequire.js 作为模板替换动态导入的语法，即

```javascript
const A = import(A);

变为

    const A = function(moduleID) {
    return Promise.resolve().then(() => dynamicRequire.importAll(moduleID));
    };
```

Asyncrequire.js 不仅关乎我们如何拆分，还和我们最后的合息息相关，留待后续再谈。

#### 树拆分

通过上文我们知道构建过程中会生成一颗依赖树，并对其中使用动态的导入的模块做了标识，接下来就是树如何进行拆分了。对于树的通用处理办法就是 DFS，通过对上图依赖树做 DFS 分析之后可以得到如下做了拆分的树，包含一颗主树和两颗异步树。对于每棵树的依赖进行收集即可得到如下三组 module 集合：A、E、C；B、D、E、G；F、G。

![image](/images/jueJin/b6e70e46768542c.png)

当然在实际场景中，各个模块的依赖远比这个复杂，甚至存在循环依赖的情况，在做 DFS 的过程中需要遵循两个原则：

*   已经在处理过的 module，后续遇到直接退出循环
*   各个异步树依赖的非主树 module 都需要包含进来

#### bundle 生成

通过这三组 module 集合即可得到三个bundle（我们将主树生成的 bundle 称为主 bundle；异步树生成的称为异步 bundle）。至于如何生成，直接借助前文提到的 Metro 中 processBasicModuleFilter 方法即可。Metro 原本在一次构建过程中，只会经过一次 Serialization 阶段生成一个 bundle。现在我们需要对每一组 module 都进行一次 bundle 生成。

这里需要注意几个问题：

*   去重，一种是已经打入主 bundle 的 module 异步 bundle 不需要打入；一种是同时存在于不同异步树内的 module，对于这种 module，我们可以将其标记为动态导入单独打包，见下图 ![image](/images/jueJin/4e00acfc8957348.png)
*   生成顺序，需要先生成异步 bundle，再生成主 bundle。因为需要将异步 bundle 的信息（比如文件名称、地址）与 moduleId 做映射填入主 bundle，这样在真正需要的时候可以通过 moduleId 的映射拿到异步 bundle 的地址信息。
*   缓存控制，为了保证每个异步 bundle 在能够享受缓存机制的同时能够及时更新，需要对异步 bundle 做 content hash 添加到文件名上
*   存储，异步 bundle 如何存储，是和主 bundle 一起，还是单独存储，需要时再去获取呢。这个需要具体分析：对于采用了bundle 预加载的可以将异步 bundle 和主 bundle 放到一起，需要时直接从本地拿即可（所谓预加载就是在客户端启动时就已经将所有 bundle 下载下来了，在用户打开 React Native 页面时无需再去下载 bundle）。对于大部分没有采用预加载技术的则分开存储更合适。

至此我们已经获得了主 bundle 和异步 bundle，大致结构如下：

```javascript
/* 主 bundle */

// moduleId 与 路径映射
var REMOTE_SOURCE_MAP = {${id}: ${path}, ... }

// IIFE __r 之类定义
    (function (global) {
    "use strict";
    global.__r = metroRequire;
    global.__d = define;
    global.__c = clear;
    global.__registerSegment = registerSegment;
    ...
    })(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
    
    //  业务模块
        __d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
        var _reactNative = _$$_REQUIRE(_dependencyMap[0], "react-native");
        var _asyncModule = _$$_REQUIRE(_dependencyMap[4], "metro/src/lib/bundle-modules/asyncRequire")(_dependencyMap[5], "./asyncModule")
        ...
        },0,[1,550,590,673,701,855],"index.ios.js");
        
        ...
        
        // 应用启动
        __r(91);
        __r(0);
        
``````javascript
/* 异步 bundle */

// 业务模块
    __d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
    var _reactNative = _$$_REQUIRE(_dependencyMap[0], "react-native");
    ...
    },855,[956, 1126],"asyncModule.js");
    
```

### 合

大部分工作其实在**分**这一阶段已经做完了，接下来就是如何合了，前面有提到过动态导入的语法在生成的 bundle 中会被 AsyncRequire.js 中的模板所替代。仔细研究下其代码发现其是用 `Promise` 包裹了一层 `require(moduleId)` 来实现。 现在我们直接 `require(moduleId)` 必然是拿不到真正的 module 实现了，因为异步 bundle 还没有获取到，module 还没有定义。但可以对 AsyncRequire.js 做如下改造

```javascript
const dynamicRequire = require;
    module.exports = function (moduleID) {
    return fetch(REMOTE_SOURCE_MAP[moduleID]).then(res => {  // 行1
    new Function(res)();                                 // 行2
    return dynamicRequire.importAll(moduleID)            // 行3
    });
    };
```

接下来一行行进行分析

*   行1将之前 mock 的 Promise 替换为真正的 Promise 请求，先去获取 bundle 资源，`REMOTE_SOURCE_MAP` 是在生成阶段写入主 bundle 的 moduleId 与异步 bundle 资源地址的映射。`fetch` 根据异步 bundle 的存储方式的不同选择不同的方式获取真正的代码资源；
*   行2通过 Function 方法执行获取到的代码，即是模块的声明，这样最后返回 module 的时候就已经是定义过的了；
*   行3 返回真正的模块实现。 这样我们就实现了**合**，异步 bundle 的获取、执行就都在 AsyncRequire.js 内完成了。

总结
--

至此我们就完成了 React Native 动态导入的改造。相对于多业务包，因为其动态特性使得业务方使用的时候所有修改都在同一个 React Native 应用内部闭环完成，外部无感知，多业务包的众多缺陷也就不存在了。与此同时构建时会充分利用第一次的生产的 IR，这样每一个 bundle 不需要再单独走 Metro 的完整构建流程。

当然有一点是必须需要考虑的，那就是我们对 Metro 进行改造之后，对于后续的升级是否有影响，导致只能锁定 React Native 和 Metro 版本。这个其实完全不用担心，从前面的分析可以知道，我们对于整个流程的改造可以分为两部分：构建时、运行时。在构建时我们确实新增了不少能力，比如新的分组算法、代码生成；但是运行时则是完全基于现有版本能力的增强。这就使得动态导入的运行时无兼容性问题，即使升级到新版本依然不会报错，只不过再我们再次改造构建时之前失去了动态导入的能力。

最后真正在生产环境上使用还有一些工程上的改造，比如：构建平台适配、提供快速接入组件等等限于篇幅就不在此详述了。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！