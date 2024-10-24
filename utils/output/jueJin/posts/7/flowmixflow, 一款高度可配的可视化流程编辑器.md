---
author: "徐小夕"
title: "flowmixflow, 一款高度可配的可视化流程编辑器"
date: 2024-08-27
description: "最近一直在研究多模态可视化搭建产品, 经历数月的技术探索和产品思考, 我设计了flowmix 多模态产品系列 接下来和大家分享一下最近刚上线的一个产品——flowmixflow"
tags: ["前端","架构","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:18,views:1081,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring")
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep")

最近一直在研究多模态可视化搭建产品, 经历数月的技术探索和产品思考, 我设计了**flowmix** 多模态产品系列. 接下来和大家分享一下最近刚上线的一个产品——**flowmix/flow**.

![图片](/images/jueJin/454d5674cdf7439.png)

****flowmix/flow**** 目前大家看到的是1.0版本,  它致力于提供一套**流程可视化搭建底座**, 来支撑各种工作流场景的可视化设计. 

由于之前的技术架构经验和千万级用户产品的极致打磨, 让我对**性能**格外关注, 所以经历了反复推演和优化, 目前 **flowmix/flow** 的搭建性能和**所见即所得**的UI更新流畅度非常丝滑. 后续还会持续迭代和优化.

![图片](/images/jueJin/43cca57dad464ba.png)

体验地址: **[http://flowmix/turntip.cn/flow](https://link.juejin.cn?target=http%3A%2F%2Fflowmix%2Fturntip.cn%2Fflow "http://flowmix/turntip.cn/flow")**

接下来我就和大家介绍一下这款项目.

一套流程编辑器, 支撑多种图表设计场景
-------------------

我最初设计 **flowmix/flow** 目的是让它实现自动化 **AI Agent** 生成, 后面越研究越发现它可以做的事情还很多, 所以为了让大家更快的感受 **flowmix** 的能力, 我先做了一个流程编辑器, 也就是 **flowmix/flow**, 我自己基于它设计了几个图表编辑场景, 这里给大家分享一下.

### 1\. 产品/技术架构图

![图片](/images/jueJin/4b218679c3ba404.png)

### 2\. 组织结构图

![图片](/images/jueJin/d6b47bdce10941d.png)

### 3\. 思维导图

![图片](/images/jueJin/968b28ec3d0b494.png)

### 4\. 多画布设计

![图片](/images/jueJin/ea2ef71cd5d7422.png)

### 5. 任务管理 + 流程看板

![图片](/images/jueJin/0cf7c6f50cc44e4.png)

当然还有很多场景大家可以一起探索, 目前产品免费使用, 欢迎大家体验反馈~

高性能设计, 支撑上千复杂节点编辑, 异步分片渲染
-------------------------

**flowmix/flow** 的节点内容不是一次性渲染到画布上, 而是一次只渲染**可见区域**的内容, 保证了大量节点也能轻松加载, 同时对于搭建系统的状态管理, 为了支撑大数据量的渲染和状态更新, 我对 **antd form** 组件的更新性能做了进一步优化, 并且采用**zustand** 做为状态管理库.(号称react状态管理性能之王)

![图片](/images/jueJin/93ee630d2a9e40a.png)

支持自定义节点连接线
----------

流程图的连接线是一个很重要的环节, 这里我对连接线也提供了一定的搭建配置能力, 如下图所示:

![图片](/images/jueJin/ac81e993ef58491.png)

后续还会按照我的规划持续优化和迭代它, 来实现真正的业务自动化方案.

另一款栾生产品
-------

也许关注我公众号的朋友已经看过我之前做的另一款产品——**flowmix/docx**, 它是另一款搭建类产品, 类似于飞书和Notion, 可以使用它轻松构建企业下一代知识库产品.

![image.png](/images/jueJin/b16b3f22c39a463.png)

如果大家感兴趣, 也可以在线体验一下.
-------------------

体验地址: **[doc.dooring.vip](https://link.juejin.cn?target=http%3A%2F%2Fdoc.dooring.vip "http://doc.dooring.vip")**
----------------------------------------------------------------------------------------------------------------

后续规划:

*   支持在线电子表格嵌入
    
*   支持Vchart图表嵌入
    
*   支持vue版文档编辑器
    
*   添加AIGC功能模块
    
*   提供完善的开发文档
    
*   支持文档导出为HTML
    

好啦, 接下来两周我要好好研发了, 9月见~

如果你有好的想法和建议, 也欢迎随时**留言区**交流讨论~