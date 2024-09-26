---
author: "mysteryven"
title: "性能优化之preload、prefetch、preconnect的区别与使用"
date: 2022-08-05
description: "今天讲的三个属性都是在link标签上使用的，使用形式如下：初看起来，这三个属性设置起来比较简单，但是如果使用得当，效果却会非常棒。比如奈飞通过使用prefetch把TTI(Time"
tags: ["前端","性能优化","JavaScript"]
ShowReadingTime: "阅读9分钟"
weight: 897
---
今天讲的三个属性都是在 link 标签上使用的，使用形式如下：

ini

 代码解读

复制代码

`<link rel="preload" as="script" src="./a.js">`

初看起来，这三个属性设置起来比较简单，但是如果使用得当，效果却会非常棒。比如 [奈飞](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fdev-channel%2Fa-netflix-web-performance-case-study-c0bcde26a9d9 "https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9") 通过使用 prefetch 把 TTI ( Time-to-Interactive) 的时间减少了 30 %。

preload、prefetch 都有助于优化 TTI、FCP ( First Content Paint ) 。为了让大家更好的理解 preload、prefetch 的好处，我们简单了解一下这两个指标代表的含义。

为了直观的认识，可以打开一个 Chrome 的控制台，进入 LightHouse 跑跑分，下图就是我跑的 Github 的分数，可以看到，头两个指标就是 FCP（First Contentful Paint） 和 TTI ( Time to Interactive)。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf59a1e12b81477a896f5b71d64959c8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

FCP 也叫做首次内容绘制，指的是从开始加载页面内容到任何部分的内容在屏幕上渲染出来了，这里的内容，可以是一个文本，也可以是一个图片（背景图片也算）。

TTI 也叫做可交互时间，计算规则稍微有一点复杂，它是以 FCP 结束的时间作为起始，也就是有任何内容出现在屏幕上了，这个点就作为 TTI 的时间点。

有了起始点之后，它会寻找一个长度至少是 5 S 的安静窗口（安静窗口是没有耗时超过 50 ms 的任务，并且不超过两个正在处理的请求），找到安静窗口之后，会再往回找，找到离这个安静窗口最近的长任务，这个时间点就是 TTI 的时间点，如果 FCP 后没有任何长任务，那此时 FCP 就会等于 TTI，上面截图也表现了这一点。

举一个例子来说明 TTI：假设 FCP 时间点是 0.8 S，之后在 1 S 时有了一个长度为 100 ms 的长任务，执行后，就来到了 1.1 S，之后就没有任何任务和请求了。过了 5 秒，发现找到了一个安静窗口，会再往前找最近的一个长任务，时间点是 1.1 S，那 TTI 就是 1.1 S。

通过了解了两个常见的性能指标，我们大概对 preload、prefetch 的作用有了更好的理解了，接下来便开始今天的内容。

TL;DR
-----

*   prefetch 用于在浏览器的空闲时间请求资源
*   preload 用于提前加载在页面初始化加载（page load）时用到的资源
*   preconnect 用于提前和一个网站建立起连接

在谈这三个属性之前，我们先对浏览器请求各种资源的优先级顺序有一个大概的认识，在默认情况下，有如下的划分：

1.  第一个级别就是这个页面的主资源，它所包含的当前主页（index.html）、 css 资源、font 资源
2.  第二个级别就是 JS 资源、在视口区域的图片、Fetch API、XHR
3.  第三个级别可以是我们网站的标题的图标 Favicon
4.  第四个级别是 async/defer 标签的 JS 资源、不在视口里的图片、视频这些

> 上面优先级的叙述省略了一些细节，比如 CSS、JS 也是分 early 和 later 的，以至于他们优先级不同，如果想了解完整的内容，可以看 [这篇文章](https://link.juejin.cn?target=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc%2Fedit "https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit")

下面，我们来谈一谈这三个属性的细节。

preload
-------

最基本的使用就像这样子：

bash

 代码解读

复制代码

`<head>   <link rel="preload" as="script" href="foo.js"> </head>`

值得关注的就是 as 属性，preload 的优先级顺序和这个属性指定的资源类型相关。

举一个例子，假如我们指定了 as 的值是 style，也就是把它当做 css 资源，那它的优先级就会变得最高。

但是也有一个例外：虽然 font 的优先级是最高，但把 as 的值指定为 font 并不会把此资源的优先级放到最高，文档专门为 font 的 preload 指定了优先级：位于第二级。目前来说，除了 font，其他都按照和资源优先级相同的规则。

as 属性可以说是必须要设置的，除了上面可以给优先级排级别以外，还有一个原因：如果不设置的话，它会被作为一个 XHR 请求去触发，浏览器可能不能正确的认识到，我们其实已经把资源预加载了，这样子就会加载两次了，完全没有了优化的效果。

不指定 as 浏览器也会有警告：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/150ae5fe8aa046ea95b3aa26e7814a3f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

preload 只会加载，真正执行要等到资源被用到的地方。

接下来再给大家介绍一个它的应用场景。

现在我们的文件是这样的：

css

 代码解读

复制代码

`index.html |--main.js    |--styles.css`

我们有一个 main.js ，它会在 200 ms 后下载完，在它的内部会加载一段 CSS 来控制页面的样式，它也需要下载 200 ms。虽然 style.css 我们肯定会用到，但是浏览器必须要等下载、解析完 main.js 才开始下载 style.css，这就白白浪费了至少 200 ms。这里我们就可以把 style.css 用 preload 优化：把 style.css 标识为 preload 的资源。

也不是所有的资源都适合用 preload，它只适合用于 page load 阶段的资源。毕竟，它的优先级还是很高的，乱用的话，一个是占请求线程，一个是占浏览器的缓存。如果我们 preload 的资源在 load 事件几秒后没有用，控制台还会警告我们。比如我们上面的例子，没有实际引用 style.css，就有下面的警告：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70e6d631af934631a21835f77ed10bcf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果我们想预加载一些资源不那么着急用的，接下来介绍的 prefetch 是更好的选择。

### 在 Webpack 中使用

官网在 [这里](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fmodule-methods%2F%23magic-comments "https://webpack.js.org/api/module-methods/#magic-comments") 有介绍基本的用法。Webpack 的官网对这里的解释延续了它含糊其辞的作风，这一部分依然没法看。所以我专门的介绍一下 preload 在 Webpack 中要怎么使用。

我们想预加载 lodash 这个库。假设有一个入口文件 `index.js`，最直觉的，我们想直接在这个文件里写：

js

 代码解读

复制代码

`import(/* webpackPreload: true */ 'lodash').then(res => {     console.log(res) })`

但是其实不会生效，我们看打包出来的文件并没有加这块内容：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd79401d03854ca487000568612f0449~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

真正的写法是这样的，我们先写一个中间文件，姑且叫做 `a.js`，然后 `index.js` 动态引入 `a.js`，再把上面的内容放到 `a.js`里，最后形式如下：

js

 代码解读

复制代码

`//filename: index.js import("./a.js") // filename: a.js import(/* webpackPreload: true */ 'lodash').then(res => {     console.log(res) })`

最后打包产物也有这部分内容了：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cde2c50df1be4af6baebce91e26bafa2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在页面上也看到了加好的 link 标签：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c00a8155182e4e29aa8d50545f79439b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

总结来说，需要有一个中间的过渡。

### Vite 是如何 polyfill ModulePreload 功能的

ModulePreload 和 preload 的功能一样，不过，前者是针对 module scripts 的，并且支持性不太好，截止目前（2022.08.10），只有 73.33 % 的支持率。

ini

 代码解读

复制代码

`<link rel="modulepreload">`

Vite 有一个特性，自动为它的入口 chunk 和它的直接引用生成 modulepreload。同时，在 vite 的打包配置中，有 [build.polyfillModulePreload](https://link.juejin.cn?target=https%3A%2F%2Fvitejs.dev%2Fconfig%2Fbuild-options.html%23build-polyfillmodulepreload "https://vitejs.dev/config/build-options.html#build-polyfillmodulepreload") 这个配置。开启了它，就会自动给浏览器注入下面一段代码:

arduino

 代码解读

复制代码

`import 'vite/modulepreload-polyfill'`

这段代码就是为了兼容那些不知道 ModulePreload 的浏览器。我们来看一下这段代码怎么写的，通过阅读[这段代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Fblob%2F2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0%2Fpackages%2Fvite%2Fsrc%2Fnode%2Fplugins%2FmodulePreloadPolyfill.ts%23L58 "https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/modulePreloadPolyfill.ts#L58")，来学习如何 polyfill。

简化的伪代码就是：

1.  扫描 DOM，找出所有带有 modulepreload 标识的 link 标签，使用 fetch 去获取资源，fetch 获取资源后就会存在浏览器缓存里，算是得到和 preload 相同的结果；

dart

 代码解读

复制代码

`for (     const link of document.querySelectorAll('link[rel="modulepreload"]')  ) {        fetch(link.href) }`

2.  监听 DOM，以后有了添加的 link 标签带有 modulepreload 标识，也进行下载

javascript

 代码解读

复制代码

`new MutationObserver((mutations: any) => {   for (const mutation of mutations) {     if (mutation.type !== 'childList') {       continue     }     for (const node of mutation.addedNodes) {       if (node.tagName === 'LINK' && node.rel === 'modulepreload')         fetch(node.href)     }   } }).observe(document, { childList: true, subtree: true })`

prefetch
--------

它的使用方法和 preload 非常像。

首先，prefetch 的请求的优先级是在上面几个的最后面。也就是说，在第五个级别。

明白了这一点，我们大概就知道它的应用场景了，一个典型的应用场景就是 prefetch 在未来可能打开的路由页面。举一个例子来说明这个问题，假如有一个搜索页面，点击搜索出来的结果是跳转新的路由，其实如果搜索结果好，一般用户都会点击前几条，所以我们就可以 prefetch 前几条搜索结果对应的路由。

像我们的现在的应用，一般都会有懒加载，我们可以给非首页但是打开频率很高的页面加 prefetch。

它的使用就是直接加一个 link 标签，这样它就会在浏览器空闲的时候下载了：

ini

 代码解读

复制代码

`<link rel="prefetch" as="script" href="a.bundle.js">`

其中 as 的取值有 `document` 、`style`、`script`、`images` ...

如果使用 webpack ，没有使用 preload 那么坑，可以直接在引入的地方加魔法注释：

go

 代码解读

复制代码

`import(/*webpackPrefetch: true */ 'a.bundle.js')`

截止目前（2022-08-05），prefetch的支持性没有特别好，只覆盖了 80 % 的浏览器 。所以我们一般都是需要 polyfill 的，可以使用 XHR 或者 fetch 去模拟，由于上面我们给出来 fetch 的模拟方法，现在给出 XHR 的模拟方法：

arduino

 代码解读

复制代码

`const xhrRequest = new XMLHttpRequest() xhrRequest.open('GET', './bundle.js', true) xhrRequest.send()`

除了直接给资源加 prefetch 标签。还有一个触发 prefetch 的思路，我们可以在入口到达可视窗口的时候，自动 prefetch。[这个库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGoogleChromeLabs%2Fquicklink "https://github.com/GoogleChromeLabs/quicklink") 就实现了这样的功能。它使用了 Intersection API 监听元素到达可视窗口，到达了就进行 prefetch。

prefetch 的内容会被缓存起来，但是也是有有效期的，Chrome 中是 5 分钟。这一点我们使用的时候也可以注意一下。

同时，一般只在用户网络比较好的情况下才预加载，浏览器也有监听网速的 API：

ini

 代码解读

复制代码

`let prefetch = true; const connection = navigator.connection; if (connection) {   if (connection.effectiveType === 'slow-2g') {     prefetch = false;   } }`

preconnect
----------

这是最简单的一个了。

它的作用使用了提前和第三方资源建立连接的。在我们请求一个资源之前，可能会涉及 DNS 寻址、TLS 握手、TCP 握手、重定向等。这期间就花费了很多时间了。如果我们加上 preconnect：

ini

 代码解读

复制代码

`<link rel="preconnect" href="https://example.com">`

浏览器就知道我们将要连接这个网站，跳转也好、请求资源也好，它会做好早期的连接工作。但是浏览器只会保留 10 S，如果 10 S 不用就会浪费了这资源了。

还有一个和它很相似的 dns-prefetch，只不过这个只预解析 DNS ：

ini

 代码解读

复制代码

`<link rel="dns-prefetch" href="https://example.com">.`

不知道你有没有使用过 preconnect，个人感觉，这个其实用起来不是那么舒服，我在工作中只使用到了 preload 和 prefetch。

以上就是关于这三个的讲解，谢谢阅读 :)