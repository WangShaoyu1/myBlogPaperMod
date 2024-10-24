---
author: "徐小夕"
title: "《前端实战总结》之使用pacejs为你的网站添加加载进度条"
date: 2019-11-16
description: "最近做网站体验优化的时候突然发现一个好东西，pacejs(加载进度条插件)，gzip之后只有几kb， 简单好用，特地分享出来，也作为自己的一个学习总结。 pacejs是一个自动加载页面进度栏的小插件,它可以自动监视您的Ajax请求，事件循环滞后，文档就绪状态以及页面上的元素…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:162,comments:0,collects:186,views:8808,"
---
![](/images/jueJin/16e71ccf7791fd9.png)

### 前言

最近做网站体验优化的时候突然发现一个好东西，pace.js(加载进度条插件)，gzip之后只有几kb， 简单好用，特地分享出来，也作为自己的一个学习总结。

### pace.js介绍

pace.js是一个自动加载页面进度栏的小插件,它可以自动监视您的Ajax请求，事件循环滞后，文档就绪状态以及页面上的元素来确定进度。在ajax导航上，它也能进行监听,同时他也可以很方便的集成到Wordpress中,例如:

```
<head>
<script src="/pace/pace.js"></script>
<link href="/pace/themes/pace-theme-barber-shop.css" rel="stylesheet" />
</head>
```

官网地址: [pace.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.hubspot.com%2Fpace%2F "https://github.hubspot.com/pace/")

下面来展示几个pace提供的几个例子,当然我们也可以很方便的基于它去修改成更加定制化的加载进度样式.

![](/images/jueJin/16e71d50327b2eb.png)

![](/images/jueJin/16e71d566b2a6ea.png)

![](/images/jueJin/16e71d5d23ada39.png)

![](/images/jueJin/16e71d6536b690b.png)

![](/images/jueJin/16e71d69dddf7c7.png)

![](/images/jueJin/16e71d706d542ab.png)

由于官网文档是用全英文写的,所以我在接下的介绍中会尽量用自己的额语言来向大家介绍其使用过程.

#### 1.配置介绍

Pace是全自动的，无需进行配置即可上手。

如果我们想进行一些调整，请按以下步骤操作：

我们可以window.paceOptions在导入文件之前进行设置：

```
    paceOptions = {
    // 禁用元素源
    elements: false,
    
    // 只在常规下和ajax导航下展示进度条
    // not every request
    restartOnRequestAfter: false
}
```

您还可以在脚本标签上放置选项：

```
<script data-pace-options='{ "ajax": false }' src='pace.js'></script>
```

如果你使用的是AMD或Browserify，则可以将选项传递给start：

```
    define(['pace'], function(pace){
        pace.start({
        document: false
        });
        });
```

#### 2.主题

Pace包含许多主题 ，可帮助我们入门。只要包括适当的css文件。关于如何修改css样式,我在这里给大家举个例子,其实也很方便,如果我们下载了某个主题的css:

```
    .pace {
    -webkit-pointer-events: none;
    pointer-events: none;
    
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

    .pace-inactive {
    display: none;
}

    .pace .pace-progress {
    background: #29d;
    position: fixed;
    z-index: 2000;
    top: 0;
    right: 100%;
    width: 100%;
    height: 2px;
}

```

我们就可以直接修改它,包括进度条的样式,形状等等.

#### 3.收集器

收集器是收集进度信息的代码位。Pace包括四个默认收集器：

*   ajax 监视页面上的所有ajax请求
*   element 检查页面上是否存在特定元素
*   Document 检查文件readyState
*   Event Lag 检查事件循环滞后信号，表明正在执行javascript

可以通过相同名称的配置选项分别配置或禁用它们。

```
    paceOptions = {
    ajax: false, // disabled
    document: false, // disabled
    eventLag: false, // disabled
        elements: {
    selectors: ['.my-page']
}
};
```

添加自己的类paceOptions.extraSources以添加更多源。每个源都应该具有一个.progress属性，或者.elements是具有.progress属性的对象列表的 属性。Pace将自动处理所有缩放，以使进度更改对用户而言看起来很平滑。

#### 4.元素

呈现到屏幕上的元素是我们确定页面呈现的一种方法。如果我们想使用该信息源（根本不需要），请指定一个或多个选择器。我们可以使用逗号分隔选择器，以正确处理错误状态（进度条应消失在错误状态），但我们寻找的元素可能永远不会出现：

```
    paceOptions = {
        elements: {
    selectors: ['.timeline,.timeline-error', '.user-profile,.profile-error']
}
}
```

当每个选择器匹配某项时，Pace都会认为元素测试成功。对于此示例，当.timeline或.timeline-error存在时以及.user-profile 或.profile-error存在时。

#### 5.重新启动规则

大多数用户希望进度栏在pushState事件发生时自动重新启动（通常表示正在进行ajax导航）。我们可以禁用此功能：

```
    paceOptions = {
    restartOnPushState: false
}
```

我们还可以对持续时间超过x ms的每个ajax请求重新启动步速。如果我们发出用户不需要知道的ajax请求（例如预缓存），则需要禁用此功能：

```
    paceOptions = {
    restartOnRequestAfter: false
}
```

我们随时可以通过以下方式手动触发重新启动

```
Pace.restart()
```

#### 6.API

Pace公开以下方法：

*   Pace.start：显示进度条并开始更新。如果您不使用AMD或CommonJS，则会自动调用。
    
*   Pace.restart：显示进度条（如果已隐藏），然后从头开始报告进度。每当pushState或replaceState默认情况下被自动调用。
    
*   Pace.stop：隐藏进度条并停止对其进行更新。
    
*   Pace.track：明确跟踪一个或多个请求，请参阅下面的跟踪
    
*   Pace.ignore：明确忽略一个或多个请求，请参见下面的跟踪
    

### 在网站中的应用

这里举个我自己使用的例子,比如我们在自己的脚手架中的ejs模板中导入:

```
<% if(context.env === 'production') { %>
<script src="<%= context.config.publicPath %>pace.min.js"></script>
<% } else {%>
<script src="https://cdn.bootcss.com/pace/1.0.2/pace.min.js"></script>
<% } %>
```

然后我们再在项目中引入自己的css,这样我们就能安心的在我们的react/vue项目中使用了.

### 最后

如果想了解更多webpack，node，gulp，css3，javascript，nodeJS，canvas等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")