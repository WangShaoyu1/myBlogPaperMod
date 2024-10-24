---
author: "徐小夕"
title: "《前端实战总结》如何在不刷新页面的情况下改变URL"
date: 2019-10-31
description: "由于公司最近有个需求是想让我们的get请求的参数都直接显示在浏览器url上，这样我们就可以直接通过复制url来显示对应的界面数据了。 由于我们常用的http请求一般是基于XHR对象的实现或者fetch实现，这种请求操作并不会触发浏览器url的变化，这样虽然也能正常请求数据并渲染…"
tags: ["JavaScript","浏览器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:167,comments:17,collects:195,views:17643,"
---
由于公司最近有个需求是想让我们的get请求的参数都直接显示在浏览器url上，这样我们就可以直接通过复制url来显示对应的界面数据了。

### 背景介绍

由于我们常用的http请求一般是基于XHR对象的实现或者fetch实现，这种请求操作并不会触发浏览器url的变化，这样虽然也能正常请求数据并渲染到页面，但是如果用户在当前页面操作了某个get请求并得到了某条数据，想通过链接将当前看到的界面分享给其他人时，那么此时浏览器url并不会变化，通过链接只能访问到初始化的数据界面，此时并不能达到理想的效果。如下图所示：

![](/images/jueJin/16e1d66a9748d0b.png)

（单纯使用ajax或者fetch实现get请求时） 当我们在该页面将列表切换到第二页时，浏览器url并没有变化，所以将链接复制给其他人打开并不会将列表结果切换到第二页，而是重新初始化。

### 实现过程

通过以上的背景和问题，我们可以想想可以怎么实现呢？我的第一个反应就是使用location API来实现，我们可以使用location.search来读写浏览器query参数：

```
location.search = '?page=2';
```

这段代码虽然可以改变浏览器url，如下图所示：

![](/images/jueJin/16e1d7118335cd8.png)

但会出现一个性能问题，就是当我们执行了以上代码后，整个浏览器都会刷新，导致我们不想刷新的部分也刷新了，那我们有办法可以让它局部刷新吗？ 答案是必须有。

这里就要引出我们本文的重点：**history API**。

#### history API

> Window.history是一个只读属性，用来获取History 对象的引用，History 对象提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口。HTML5引入了 history.pushState() 和 history.replaceState() 方法，它们分别可以添加和修改历史记录条目。

使用 history.pushState() 可以改变referrer，它在用户发送 XMLHttpRequest 请求时在HTTP头部使用，改变state后创建的 XMLHttpRequest 对象的referrer都会被改变。因为referrer是标识创建 XMLHttpRequest 对象时 this 所代表的window对象中document的URL。

那么我们就可以使用pushState来实现我们的更新浏览器url功能了。

#### pushState() 方法

pushState() 需要三个参数: 一个状态对象, 一个标题 (目前已忽略), 和 (可选的) 一个URL：

*   **状态对象** — 状态对象state是一个JavaScript对象，通过pushState () 创建新的历史记录条目。无论什么时候用户导航到新的状态，popstate事件就会被触发，且该事件的state属性包含该历史记录条目状态对象的副本
*   **标题** — Firefox 目前忽略这个参数，但未来可能会用到。在此处传一个空字符串应该可以安全的防范未来这个方法的更改。或者，你可以为跳转的state传递一个短标题
*   **URL** — 该参数定义了新的历史URL记录。注意，调用 pushState() 后浏览器并不会立即加载这个URL，但可能会在稍后某些情况下加载这个URL，比如在用户重新打开浏览器时。新URL不必须为绝对路径。如果新URL是相对路径，那么它将被作为相对于当前URL处理。新URL必须与当前URL同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前URL

#### 实现

```
/**
* 设置浏览器url
*  params：queryObj（参数对象）
*/
    function setBrowserUrl(queryObj){
    // stringify是queryString的一个api，具体可以查看node官网，也可以自己实现
    var url = `${location.pathname}?${stringify(queryObj)}`
    history.pushState({url: url}, '', url)
}
```

这样我们就可以在请求的同时，调用setBrowserUrl方法来改变浏览器url了。 接下来我们就可以监听浏览器url的变化，如果浏览器url有需要的请求参数，那么我们就根据请求参数来请求数据，没有就初始化页面，这样当我们查看某条记录或者某个小秘密时，想把该数据保存下来并分享给被人，是不是就可以实现了呢？

### 总结

基于H5 history可以实现很多优雅使用的工具，比如路由，缓存控件等等。 如果想了解更多webpack，gulp，css3，javascript，nodeJS，canvas等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [前端组件/库打包利器rollup使用与配置实战](https://juejin.cn/post/6844903970469576718 "https://juejin.cn/post/6844903970469576718")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [快速掌握es6+新特性及es6核心语法盘点](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [基于nodeJS从0到1实现一个CMS全栈项目的服务端启动细节](https://juejin.cn/post/6844903955143786510 "https://juejin.cn/post/6844903955143786510")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [《javascript高级程序设计》核心知识总结](https://juejin.cn/post/6844903953671389191 "https://juejin.cn/post/6844903953671389191")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")