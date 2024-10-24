---
author: "徐小夕"
title: "5分钟教你使用consolelog发布公司的招聘信息"
date: 2020-03-19
description: "通过这种方式来帮助公司做招聘，是不是很有创意呢？一方面可以体现出这些公司对人才的渴望，另一方面也可以让开发者们直接接触招聘信息，更加高效的找到对公司感兴趣的求职者。 接下来就让来看看这些是如何实现的吧。 1 基本的文字编排信息输出 我们可以利用这些方式实现更加有创意的控制台信…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:258,comments:40,collects:251,views:14555,"
---
前言
--

我们在打开百度或者知乎等网站查看源代码时，在控制台往往会看到如下图所示的信息： ![](/images/jueJin/170eea1c1c3101b.png)

![](/images/jueJin/170eea33c8d0ad8.png)

通过这种方式来帮助公司做招聘，是不是很有创意呢？一方面可以体现出这些公司对人才的渴望，另一方面也可以让开发者们直接接触招聘信息，更加高效的找到对公司感兴趣的求职者。

接下来就让来看看这些是如何实现的吧。

正文
--

### 1\. 基本的文字编排信息输出

console.log作为javascript的全局方法之一，也支持输出带有格式和样式的字符，比如我们使用/n进行换行，使用css样式为指定文本编写样式，如下：

```js
    if (window.console) {
    console.log('想和我们共同打造世界最大中文互动问答平台吗？\n想让自己的成就在亿万用户面前展现吗？想让世界看得你的光芒吗？\n加入我们，在这里不仅是工作，投入你的时间和热情，滴滴汗水终会汇聚成不平凡的成果。\n期待你的加盟。');
    console.log("公司诚聘前端工程师，%c简历投递地址http://www.badu.toudi.com", "color:blue;font-weight:bold;");
    console.log("请在邮件中注明%c来自:console", "color:red;font-weight:bold;");
}
```

以上%c后面的本将用console.log的第二个参数制定的样式来输出，效果如下： ![](/images/jueJin/170eebe27c3be9a.png) 我们可以利用这些方式实现更加有创意的控制台信息，包括公司的宣传画，招聘贴等。

### 2\. 在控制台打印字符画

正如上文所展示的控制台知乎招聘贴，我们也可以为自己的网站定制招聘宣传贴。关于字符画的编写，我们可以一行行在控制台敲，当然这种方式不建议采用，我们可以使用网站[patorjk.com/](https://link.juejin.cn?target=http%3A%2F%2Fpatorjk.com%2Fsoftware%2Ftaag "http://patorjk.com/software/taag")来生成自己的字符画，然后在通过代码包装输出到控制台。 ![](/images/jueJin/170f032a1a49e1c.png) 以上就是该网站的界面，我们只需要输入想要转化成字符画的英文字符，就可以生成不同样式风格的字符画。以下是**HIRE**的不同风格的字符画： ![](/images/jueJin/170f03434bdb914.png) ![](/images/jueJin/170f034facc66d9.png) ![](/images/jueJin/170f03546bea233.png) ![](/images/jueJin/170f035a93762c9.png) ![](/images/jueJin/170f0360ba0a4d5.png) 当然这只是网站生成的一部分，该网站一共为**HIRE**生成了314中不同风格的字符画，是不是很强大呢？当然我们单纯只复制这些字符是远远不够的，我们还需要用函数包转一下，才能原样输出到控制台。具体实现代码如下：

```js
<script>
    Function.prototype.makeMulti = function () {
    let l = new String(this)
    l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"))
    return l
}

    let string = function () {
    /* 你复制的字符图案 */
}
console.log(string.makeMulti());
console.log(/* 其他信息 */);
</script>
```

我们将上面从网站生成的字符画复制到string函数中，执行代码后效果如下： ![](/images/jueJin/170f03e72086357.png) 当然我们可以继续扩展该函数，支持输出彩色字符画等功能，大家感兴趣可以探索一下。

最后
--

如果想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

更多推荐
----

*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [从零到一教你基于vue开发一个组件库](https://juejin.cn/post/6844904085808742407 "https://juejin.cn/post/6844904085808742407")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [10分钟教你手写8个常用的自定义hooks](https://juejin.cn/post/6844904074433789959 "https://juejin.cn/post/6844904074433789959")
*   [《彻底掌握redux》之开发一个任务管理平台（上）](https://juejin.cn/post/6844904071933984776 "https://juejin.cn/post/6844904071933984776")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")