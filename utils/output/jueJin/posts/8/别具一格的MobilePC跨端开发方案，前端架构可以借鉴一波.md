---
author: "Sunshine_Lin"
title: "别具一格的MobilePC跨端开发方案，前端架构可以借鉴一波"
date: 2022-08-20
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 中后台管理系统如何更优雅的支持移动端？ 随着移动终端的普及和升级换代，大量业务场景都需要Mobile"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:33,comments:0,collects:48,views:4851,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。

![](/images/jueJin/f3afc1b0267548f.png)

中后台管理系统如何更优雅的支持移动端？
-------------------

随着移动终端的普及和升级换代，大量业务场景都需要Mobile端的支持，比如：

*   **管理层**：需要通过手机查看统计数据、审核业务单据
*   **运维人员**：通过手机远程查看服务器状态，并进行调整优化

我们知道，市面上大多数中后台管理系统，都是优先适配 PC 端，然而Mobile端交互体验却不佳，处于**勉强可用，但不好用**的阶段

传统的做法
-----

传统的做法一般而言有两个：

### 1\. 采用css自适应媒体查询

css自适应**媒体查询**：具体而言，就是去采用`@media`语法针对不同尺寸的页面激活不同的css内容，从而达到动态适配样式的目的。比如：

```css
    @media screen and (max-569px) {
        .list-group {
        width: 100%;
    }
}

    @media screen and (min-570px) and (max-879px) {
        .list-group {
        width: 50%;
    }
}

    @media screen and (min-880px) {
        .list-group {
        flex: 1;
    }
}
```

然而，PC端和Mobile端的界面交互体验不同，页面的布局也必然不同。因此，仅仅依靠css的动态响应，只是让PC端的页面在Mobile端可用，但远远达不到**原生Mobile端**的效果

### 2\. 采用两套代码

由于采用**css自适应媒体查询**有很大的局限性，很多项目采用**两套代码**来分别处理**PC端**和**Mobile端**的布局显示。这样虽然解决了问题，但是同样的业务逻辑需要开发两套代码，成本、时间、精力都是加倍

解决之道：pc = mobile + pad自适应布局
---------------------------

✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

*   **方案**：**CabloyJS全栈框架**首创`pc = mobile + pad`自适应布局机制
    
*   **效果**：只需要一套代码，同时兼容Mobile端和PC端，并且Mobile端达到原生交互体验
    
*   **原理**：优先适配Mobile端，然后再把Mobile端的交互体验和开发模式无缝带入PC端。因此，PC端可以看作是许多Mobile尺寸和Pad尺寸页面组件的组合
    

布局管理器
-----

**CabloyJS全栈框架**内置了一套布局管理器，并且提供了一组**Mobile布局组件**和**PC布局组件**。我们开发的**Vue页面组件**可以同时支持在Mobile布局/PC布局中显示和使用

**布局管理器**：根据当前页面尺寸决定采用何种布局：Mobile布局/PC布局

**Mobile布局**：采用底部Tab页签模式，达到原生Mobile的交互效果

**PC布局**：采用中后台管理系统的布局，同时具备更加强大的定制性和扩展性

PC布局效果
------

由于PC端可以看作是许多Mobile尺寸和Pad尺寸页面组件的组合，因此可以实现更加丰富的互动交互体验。在PC布局中，CabloyJS提供了两种页面交互模式：

*   展开式

![640 (1).gif](/images/jueJin/561432c147514dc.png)

*   弹出式

![640 (2).gif](/images/jueJin/ecb6b041837a4f8.png)

Mobile布局效果
----------

![640.gif](/images/jueJin/4329d5ecf8184c3.png)

可以打开F12开发者工具，将页面调整为Mobile尺寸，就可以进入Mobile布局，从而体验原生Mobile的交互效果

演示站点
----

可以直接浏览**CabloyJS全栈框架**的演示站点，增加更直观的感性认知

*   演示站点：`https://test.cabloy.com/`
    
*   演示站点的二维码
    

相关视频
----

为了能更进一步的了解**pc = mobile + pad**自适应布局的实现机制，我们还可以参考以下两个视频课程：

### 1\. 分别在Mobile端/PC端实现博客文章的CRUD和审批工作流：

[www.bilibili.com/video/BV1yZ…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1yZ4y1a7YC%2F "https://www.bilibili.com/video/BV1yZ4y1a7YC/")

### 2\. 学习Mobile布局/PC布局的页面结构与页面打开方式：

[www.bilibili.com/video/BV1d3…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1d34y1J7kS%2F "https://www.bilibili.com/video/BV1d34y1J7kS/")

相关链接
----

*   文档：[cabloy.com](https://link.juejin.cn?target=https%3A%2F%2Fcabloy.com%2F "https://cabloy.com/")
    
*   演示：[test.cabloy.com](https://link.juejin.cn?target=https%3A%2F%2Ftest.cabloy.com%2F "https://test.cabloy.com/")
    
*   GitHub: [github.com/zhennann/ca…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzhennann%2Fcabloy "https://github.com/zhennann/cabloy")
    

后记
--

**CabloyJS**提供的**pc = mobile + pad**自适应布局是开箱即用的功能，同时又具备二次开发接口，便于灵活定制。本文只能管中窥豹，**CabloyJS**作者健哥亲自制作了一套免费视频课程，可以更快速更深入的了解和学习**CabloyJS全栈框架**

CabloyJS全栈框架：从入门到精通

[course.cabloy.com/zh-cn/artic…](https://link.juejin.cn?target=https%3A%2F%2Fcourse.cabloy.com%2Fzh-cn%2Farticles%2FA-001.html "https://course.cabloy.com/zh-cn/articles/A-001.html")