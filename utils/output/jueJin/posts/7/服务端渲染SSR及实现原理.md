---
author: "政采云技术"
title: "服务端渲染SSR及实现原理"
date: 2021-12-29
description: "前言 在日常前端开发中，在需要首屏渲染速度优化的场景下，大家或多或少都听到过服务端渲染( SSR )。本文将结合 Vue 来对 SSR 的实现逻辑来进行解读。通过阅读本文你将了解到 服务端渲染的使用"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:208,comments:0,collects:338,views:23412,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![可橙.png](/images/jueJin/2b5a12de950d492.png)

> 这是第 128 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[服务端渲染SSR及实现原理](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Farticle%2Fweb-ssr "https://www.zoo.team/article/web-ssr")

前言
==

在日常前端开发中，在需要首屏渲染速度优化的场景下，大家或多或少都听到过服务端渲染( SSR )。本文将结合 Vue 来对 SSR 的实现逻辑来进行解读。通过阅读本文你将了解到:

*   服务端渲染的使用场景
*   Vue SSR 的实现原理
*   可开箱即用的 SSR 脚手架

服务端渲染
=====

服务端渲染 SSR (Server-Side Rendering)，是指在服务端完成页面的html 拼接处理， 然后再发送给浏览器，将不具有交互能力的html结构绑定事件和状态，在客户端展示为具有完整交互能力的应用程序。

适用场景
----

以下两种情况 SSR 可以提供很好的场景支持

*   **需更好的支持 SEO** 优势在于**同步**。搜索引擎爬虫是不会等待异步请求数据结束后再抓取信息的，如果 SEO 对应用程序至关重要，但你的页面又是异步请求数据，那 SSR 可以帮助你很好的解决这个问题。
    
*   **需更快的到达时间** 优势在于**慢网络和运行缓慢的设备场景**。传统 SPA 需完整的 JS 下载完成才可执行，而SSR 服务器渲染标记在服务端渲染 html 后即可显示，用户会更快的看到首屏渲染页面。如果首屏渲染时间转化率对应用程序至关重要，那可以使用 SSR 来优化。
    

不适用场景
-----

以下三种场景 SSR 使用需要慎重

*   **同构资源的处理** 劣势在于程序需要具有通用性。结合 Vue 的钩子来说，能在 SSR 中调用的生命周期只有 **beforeCreate** 和 **created**，这就导致在使用三方 API 时必须保证运行不报错。在三方库的引用时需要特殊处理使其支持服务端和客户端都可运行。
    
*   **部署构建配置资源的支持** 劣势在于运行环境单一。程序需处于 **node.js server** 运行环境。
    
*   **服务器更多的缓存准备** 劣势在于高流量场景需采用缓存策略。应用代码需在双端运行解析，cpu 性能消耗更大，负载均衡和多场景缓存处理比 SPA 做更多准备。
    

我们来结合 Vue.js 来看看 Vue 是如何实现 SSR 的。

Vue SSR 的实现原理
=============

先决条件
----

### **组件基于 VNode 来实现渲染**

VNode 本身是 js 对象，**兼容性极强**，不依赖当前的执行的环境，从而可以在服务端渲染及原生渲染。虚拟 DOM 频繁修改，最后比较出真实 DOM 需要更改的地方，可以达到**局部渲染**的目的，**减少性能损耗**。

### **vue-server-renderer**

是一个具有**独立渲染应用程序**能力的包，是 Vue 服务端渲染的核心代码。

本文下面的源码也结合这个包展开，此处不多冗余介绍。

SSR 渲染架构
--------

我们结合**官网图**和**项目架构**两个维度来整体了解一下 SSR 全貌 ![](/images/jueJin/fa8537a57adc413.png)

### 项目架构

```javascript
src
├── components
├── App.vue
├── app.js ----通用 entry
├── entry-client.js ----仅运行于浏览器
└── entry-server.js ----仅运行于服务器
```

**app.js** 导出 createApp 函数工厂，此函数是可以被重复执行的，从根 Vue 实例注入，用于创建router，store 以及应用程序实例。

```javascript
import Vue from 'vue'
import App from './App.vue'
// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
    export function createApp () {
        const app = new Vue({
        render: h => h(App)
        })
    return { app }
}
```

**entry-client.js** 负责创建应用程序，挂载实例 DOM ，仅运行于浏览器。

```javascript
import { createApp } from './app'
const { app } = createApp()
// #app 为根元素，名称可替换
app.$mount('#app')
```

**entry-server.js** 创建返回应用实例，同时还会进行路由匹配和数据的预处理，仅运行于服务器。

```javascript
import { createApp } from './app'
    export default context => {
    const { app } = createApp()
    return app
}
```

### 服务端和客户端代码编写原则

作为同构框架，应用代码编译过程 Vue SSR 提供了两个编译入口，来作为抹平由于环境不同的代码差异。Client entry 和 Server entry 中编写代码逻辑的区分有**两条原则**

1.  通用型代码 可通用性的代码，由于鉴权逻辑和网关配置不同，需要在 webpack resolve.alias 中配置不同的模块环境应用。
    
2.  非通用性代码 Client entry  负责挂载 DOM 节点代码，以及三方包引入和具有兼容性库的加载。 Server entry 只生成 Vue 对象。
    

### 两个编译产物

经过 webpack 打包之后会有两个 bundle 产物

server bundle 用于生成 vue-ssr-server-bundle.json，我们熟悉的 sourceMap 和需要在服务端运行的代码列表都在这个产物中。

```javascript
vue-SSR-server-bundle.json
    {
    "entry": ,
        "files": {
        A：包含了所有要在服务端运行的代码列表
        B：入口文件
    }
}
```

client Bundle 用于生成 vue-SSR-client-manifest.json，包含所有的静态资源，首次渲染需要加载的 script 标签，以及需要在客户端运行的代码。

```javascript
vue-SSR-client-manifest.json
    {
    "publicPath": 公共资源路径文件地址,
    "all": 资源列表
    "initial":输出 html 字符串
    "async": 异步加载组件集合
    "modules": moduleIdentifier 和 all 数组中文件的映射关系
}
```

在**先决条件**中我们提到了一个重要的包 **vue-server-renderer**，那我们来重点看看这个包里面的值得我们学习关注的内容。

### vue-server-renderer

是 Vue SSR 的核心代码，值得我们关注的是**应用初始化**和**应用输出**。两个阶段提供了完整的应用层代码编译和组装逻辑。

#### 应用初始化

在应用初始化过程中，重点展开介绍**实例化流程**和**防止交叉污染。**

首先我们先来看看一个 Vue SSR 的应用是如何被初始化的。

**实例化流程**

1.  生成 Vue 对象

```javascript
const Vue = require('vue')
const app = new Vue()
```

2.  生成 renderer，值得关注的两个对象 render 和 templateRenderer

```javascript
const renderer = require('vue-server-renderer').createRenderer()
// createRenderer 函数中有两个重要的对象： render 和 templateRenderer
    function createRenderer (ref) {
    // render: 渲染 html 组件
    var render = createRenderFunction(modules, directives, isUnaryTag, cache);
    // templateRenderer: 模版渲染，clientManifest 文件
        var templateRenderer = new TemplateRenderer({
        template: template,
        inject: inject,
        shouldPreload: shouldPreload,
        shouldPrefetch: shouldPrefetch,
        clientManifest: clientManifest,
        serializer: serializer
        });
```

经过这个过程的 render 和 templateRenderer 并没有被调用，这两个函数真正的调用是在项目实例化 **createBundleRenderer** 函数的时候，即第三步创建的函数。

3.  创建沙盒vm，实例化 Vue 的入口文件

```javascript
var vm = require('vm');
// 调用 createBundleRunner 函数实例对象，rendererOptions 支持可配置
var run = createBundleRunner(
entry, ----入口文件集合
files, ----打包文件集合
basedir,
rendererOptions.runInNewContext。
);}
```

在 createBundleRunner 方法的源码到其实例了一个叫 compileModule 的一个方法，这个方法做了中有两个函数：**getCompiledScript** 和 **evaluateModule**

```javascript
    function createBundleRunner (entry, files, basedir, runInNewContext) {
    //触发 compileModule 方法，找到 webpack 编译形成的 code
    var evaluate = compileModule(files, basedir, runInNewContext);
}
```

getCompiledScript： 编译 wrapper ，找到入口文件的 files 文件名及 script 脚本的编译执行

```javascript
    function getCompiledScript (filename) {
        if (compiledScripts[filename]) {
    return compiledScripts[filename]
}
// 在入口文件 files 中找到对应的文件名称
var code = files[filename];
var wrapper = NativeModule.wrap(code);
// 在沙盒上下文中执行构建 script 脚本
    var script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
    });
    compiledScripts[filename] = script;
    return script
}
```

evaluateModule： 根据 runInThisContext 中的配置项来决定是在当前上下文执行还是单独上下文执行。

```javascript
    function evaluateModule (filename, sandbox, evaluatedFiles) {
    if ( evaluatedFiles === void 0 ) evaluatedFiles = {};
        if (evaluatedFiles[filename]) {
    return evaluatedFiles[filename]
}
var script = getCompiledScript(filename);
// 用于判断是在当前的那种模式下面执行沙盒上下文，此时存在两个函数的相互调用
var compiledWrapper = runInNewContext === false
? script.runInThisContext()
: script.runInNewContext(sandbox);
// m: 函数导出的 exports 数据
var m = { exports: {}};
// r: 替代原生 require 用来解析 bundle 中通过 require 函数引用的模块
    var r = function (file) {
    ...
    return require(file)
    };
}
```

上述的函数执行完成之后会调用 compiledWrapper.call，传参对应上面的 exports、require、module, 我们就能拿到入口函数。

4.  错误抛出容错和全局错误监听 renderToString: 在没有 cb 函数时做了 promise 的返回，那说明我们在调用次函数的时候可以直接做 try catch的处理，用于全局错误的抛出容错。

```javascript
    renderToString: function (context, cb) {
    var assign;
        if (typeof context === 'function') {
        cb = context;
        context = {};
    }
    var promise;
        if (!cb) {
        ((assign = createPromiseCallback(), promise = assign.promise, cb = assign.cb));
    }
    ...
    return promise
    },
}
```

renderToStream：对抛错做了监听机制, 抛错的钩子函数将在这个方法中触发。

```javascript
    renderToStream: function (context) {
    var res = new PassThrough();
        run(context).catch(function (err) {
        rewriteErrorTrace(err, maps);
        // 此处做了监听器的容错
            process.nextTick(function () {
            res.emit('error', err);
            });
                }).then(function (app) {
                    if (app) {
                    var renderStream = renderer.renderToStream(app, context);
                    ...
                }
            }
        }
```

**防止交叉污染**

Node.js 服务器是一个长期运行的进程，在客户端编写的代码在进入进程时，变量的上下文将会被保留，导致交叉请求状态污染。 因此不可共享一个实例，所以说 createApp 是一个可被重复执行的函数。其实在包内部，变量之间也存在防止交叉污染的能力。

防止交叉污染的能力是由 rendererOptions.runInNewContext 这个配置项来提供的，这个配置支持 true， false，和 once 三种配置项传入。

```javascript
// rendererOptions.runInNewContext 可配置项如下
true:
新上下文模式：创建新上下文并重新评估捆绑包在每个渲染上。
确保每个应用程序的整个应用程序状态都是新的渲染，但会产生额外的评估成本。
false:
直接模式：
每次渲染时，它只调用导出的函数。而不是在上重新评估整个捆绑包
模块评估成本较高，但需要结构化源代码
once:
初始上下文模式
仅用于收集可能的非组件vue样式加载程序注入的样式。
```

特别说明一下 false 和 once 的场景， 为了防止交叉污染，在渲染的过程中对作用域要求很严格，以此来保证在不同的对象彼此之间不会形成污染。

```javascript
    if (!runner) {
    var sandbox = runInNewContext === 'once'
    ? createSandbox()
    : global;
    initialContext = sandbox.__VUE_SSR_CONTEXT__ = {};
    runner = evaluate(entry, sandbox);
    //在后续渲染中，_VUE_SSR_CONTEXT_uu 将不可用
    //防止交叉污染
    delete sandbox.__VUE_SSR_CONTEXT__;
        if (typeof runner !== 'function') {
        throw new Error(
        'bundle export should be a function when using ' +
        '{ runInNewContext: false }.'
        )
    }
}
```

#### 应用输出

在应用输出这个阶段中，SSR 将更多侧重**加载脚本内容**和**模版渲染**，在模版渲染时在代码中是否定义过模版引擎源码将提供不同的 html**拼接结构**。

**加载脚本内容**

此过程会将上个阶段构造的 reader 和 templateRender 方法实现数据绑定。

templateRenderer： 负责 html 封装，其原型上会有如下几个方法， 这些函数的作用如下图。值得一提的是：bindRenderFns 函数是将4个 render 函数绑定到用户上下文的 context 中,用户在拿到这些内容之后就可以做内容的自定义组装和渲染。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

render: 函数会被递归调用按照从父到子的顺序，将组件全部转化为 html。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

```javascript
function createRenderFunction (
modules,
directives,
isUnaryTag,
cache
    ) {
    return function render (
    component,
    write,
    userContext,
    done
        ) {
        warned = Object.create(null);
            var context = new RenderContext({
            activeInstance: component,
            userContext: userContext,
            write: write, done: done, renderNode: renderNode,
            isUnaryTag: isUnaryTag, modules: modules, directives: directives,
            cache: cache
            });
            installSSRHelpers(component);
            normalizeRender(component);
            ​    // 渲染 node 节点，绑定用户作用上下文
                var resolve = function () {
                renderNode(component._render(), true, context);
                };
                // 等待组件 serverPrefetch 执行完成之后，_render 生成子节点的 vnode 进行渲染
                waitForServerPrefetch(component, resolve, done);
            }
        }
        ​
```

在经过上面的编译流程之后，我们已经拿到了 html 字符串，但如果要在浏览器中展示页面还需js, css 等标签与这个 html 组装成一个完整的报文输出到浏览器中， 因此需要模版渲染阶段来将这些元素实现组装。

**模版渲染**

经过应用初始化阶段，代码被编译获取了 html 字符串，context 渲染需要依赖的 templateRenderer.prototype.bindRenderFns 中绑定的 state, script , styles 等资源。

```javascript
    TemplateRenderer.prototype.bindRenderFns = function bindRenderFns (context) {
    var renderer = this
        ;['ResourceHints', 'State', 'Scripts', 'Styles'].forEach(function (type) {
        context[("render" + type)] = renderer[("render" + type)].bind(renderer, context);
        });
        context.getPreloadFiles = r**erer.ge****：**reloadFiles.bind(renderer, context);
        };
```

在具体渲染模版时，会有以下两种情况：

*   未定义模版引擎 渲染结果会被直接返回给 renderToString 的回调函数，而页面所需要的脚本依赖我们通过用户上下文 context 的 renderStyles，renderResourceHints、renderState、renderScripts 这些函数分别获得。
    
*   定义了模版引擎 templateRender 会帮助我们进行 html 组装
    

```javascript
    TemplateRenderer.prototype.render = function render (content, context) {
    // parsedTemplate 用于解析函数得到的包含三个部分的 compile 对象，
    // 按照顺序进行字符串模版的拼接
    var template = this.parsedTemplate;
        if (!template) {
        throw new Error('render cannot be called without a template.')
    }
    context = context || {};
    
        if (typeof template === 'function') {
        return template(content, context)
    }
    
        if (this.inject) {
        return (
        template.head(context) +
        (context.head || '') +
        this.renderResourceHints(context) +
        this.renderStyles(context) +
        template.neck(context) +
        content +
        this.renderState(context) +
        this.renderScripts(context) +
        template.tail(context)
        )
            } else {
            ...
        }
        };
```

至此我们了解了 Vue SSR 的**整体架构逻辑**和 vue-server-renderer 的\*\*核心代码，\*\*当然 SSR 也是有很多开箱即用的脚手架来供我们选择的。

开箱即用的SSR脚手架
===========

目前前端流行的三种技术栈 React, Vue 和 Angula ，已经孵化出对应的服务端渲染框架，开箱即用，感兴趣的同学可以自主学习使用。

*   React: Next.js
*   Vue: Nuxt.js
*   Angula: Nest.js

总结
==

服务端渲染 ( SSR ) 是一个同构程序，是否使用 SSR 取决于**内容到达时间**对应用程序的重要程度。如果对初始加载的几百毫秒可接受，SSR 的使用就有点小题大做了。

对于源码的学习可以帮助更好借鉴优秀的程序写法和激发对日常代码编程架构的思考，如果你更倾向箱即用的解决方案，那可以使用现有的 SSR 脚手架来搭建项目，这些脚手架的模版抽象和额外的功能扩展可以提供平滑的开箱体验。

参考文献
====

*   [Vue SSR 官网](https://link.juejin.cn?target=https%3A%2F%2Fssr.vuejs.org%2Fzh "https://ssr.vuejs.org/zh")
    
*   [Vue 使用指南](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cschool.cn%2Fvuessr%2Fvuessr-jep83epx.html "https://www.w3cschool.cn/vuessr/vuessr-jep83epx.html")
    
*   [Vue SSR 源码解析](https://juejin.cn/post/6844903812700831757 "https://juejin.cn/post/6844903812700831757")
    

号外号外
----

你一票我一票,政采云明天就出道，掘金 2021 年度作者榜单火热打榜中！

请大家动动小小指头，将手中的票投给我们。您的支持就是我们前行的最大动力，

*   web 入口: [点我投票](https://rank.juejin.cn/rank/2021/3456520257288974?utm_campaign=annual_2021&utm_medium=self_web_share&utm_source=%E6%94%BF%E9%87%87%E4%BA%91%E5%89%8D%E7%AB%AF%E5%9B%A2%E9%98%9F "https://rank.juejin.cn/rank/2021/3456520257288974?utm_campaign=annual_2021&utm_medium=self_web_share&utm_source=%E6%94%BF%E9%87%87%E4%BA%91%E5%89%8D%E7%AB%AF%E5%9B%A2%E9%98%9F")
*   app 入口: 请滚动到文章最顶部，然后按下图操作↓

![image.png](/images/jueJin/f2593ef5d2f9442.png)

推荐阅读
----

*   [sketch插件开发指南](https://juejin.cn/post/7033911797279096845 "https://juejin.cn/post/7033911797279096845")
*   [在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261 "https://juejin.cn/post/7026119446162997261")
*   [浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

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