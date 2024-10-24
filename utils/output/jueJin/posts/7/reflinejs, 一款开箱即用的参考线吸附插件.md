---
author: "徐小夕"
title: "reflinejs, 一款开箱即用的参考线吸附插件"
date: 2024-09-30
description: "之前在研究低代码可视化时遇到了参考线吸附的需求, 比如元素直接拖拽时需要显示参考线和吸附, 方便对元素位置进行更精准的控制 也思考了很多技术实现方案, 最近在github上开发一款非常不错的js插件"
tags: ["前端","GitHub","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:26,comments:0,collects:41,views:928,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring")
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep")

之前在研究低代码可视化时遇到了参考线吸附的需求, 比如元素直接拖拽时需要显示参考线和吸附, 方便对元素位置进行更精准的控制. 也思考了很多技术实现方案, 最近在github上开发一款非常不错的js插件, 它可以帮我们轻松实现元素之间的参考线吸附. 我在flwomix/flow中也用了它来实现流程节点的参考线吸附功能, 接下来就来和大家分享一下这个开源插件.

![图片](/images/jueJin/a0fbab84baef439.png)

什么是 Refline.js
--------------

![图片](/images/jueJin/365c71e84950436.png)

`refline.js` 是完全不依赖设计器环境的参考线组件，方便各种设计器快速接入，支持参考线匹配及吸附功能。也就是说我们可以在React或者Vue项目中轻松集成它.

GitHub地址: **[github.com/refline/ref…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frefline%2Frefline.js "https://github.com/refline/refline.js")**

demo演示
------

接下来给大家演示一下使用它可以实现什么样的效果:

![图片](/images/jueJin/bf62d9ba6a4e4ef.png)

从 **demo** 中可以看出, 我们可以使用它实现参考线和吸附能力, 同时也支持缩放画布之后的参考线适配, 并支持设置**自定义的参考点**和**参考线**.

接下来就和大家介绍一下如何使用这个插件.

如何使用 Refline.js
---------------

### 1.安装refline.js

```
npm install refline.js
```

### 2.使用

```php
import { RefLine } from 'refline.js'

    const refLine = new RefLine({
        rects: [{
        key: 'a',
        left: 100,
        top: 100,
        width: 400,
        height: 800
        }],
            points: [{
            x: 300,
            y: 300
            }],
                current: {
                key: 'b',
                left: 100,
                top: 100,
                width: 100,
                height: 100
            }
            })
            
            // 匹配参考线
            const lines = refLine.getAllRefLines()
            
            // 拖拽下参考线吸附
            // mousedown
                const updater = refLine.adsorbCreator({
                pageX: 100,
                pageY: 100,
                })
                // mousemove
                    const {delta} = updater({
                    pageX: 108,
                    pageY: 110,
                    })
```

这样就可以实现元素的参考线吸附了, 当然还有很多可配置的API, 大家可以查看文档学习实践. 官方也提供了一个完整的 **demo** 案例, 方便大家快速上手:

[codesandbox.io/s/reflinejs…](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Freflinejs-7xnsd%3Ffontsize%3D14%26hidenavigation%3D1%26theme%3Ddark "https://codesandbox.io/s/reflinejs-7xnsd?fontsize=14&hidenavigation=1&theme=dark")

使用案例
----

目前我在 **flowmix/flow** 中已经使用了它来实现流程图的参考线吸附能力:

![图片](/images/jueJin/98474d2179de40b.png)

大家可以线上体验一下: [flowmix.turntip.cn/flow](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fflow "http://flowmix.turntip.cn/flow")

更多产品
----

最近**flowmix**系列产品比如 **flowmix/docx** 做了大量的更新, 比如优化了光标定位问题, 支持了电子表格嵌入等能力, 大家可以体验一下:

[![图片](/images/jueJin/5f8e7d2deee544c.png)](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzU2Mzk1NzkwOA%3D%3D%26mid%3D2247500447%26idx%3D1%26sn%3D9bb831a9ca2c975129bf2591892ae398%26chksm%3Dfc50db64cb275272b4e4ca5235a206e9f43ad4976d70d3405faa192f931081045351cb03bb81%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzU2Mzk1NzkwOA==&mid=2247500447&idx=1&sn=9bb831a9ca2c975129bf2591892ae398&chksm=fc50db64cb275272b4e4ca5235a206e9f43ad4976d70d3405faa192f931081045351cb03bb81&scene=21#wechat_redirect")

体验地址: **[flowmix.turntip.cn/docx](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fdocx "http://flowmix.turntip.cn/docx")**

如果你有好的想法和建议, 也欢迎随时**留言区**交流讨论~