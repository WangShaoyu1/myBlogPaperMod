---
author: "徐小夕"
title: "flowmixflow, 一款强大的工作流编辑器(最新更新)"
date: 2024-09-24
description: "最近一直在研究多模态可视化搭建产品, 经历数月的技术探索和产品思考, 我设计了flowmix多模态产品系列 之前和大家分享了flowmixflow 工作流引擎的10版本"
tags: ["前端","JavaScript","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:6,comments:4,collects:16,views:910,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring")
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep")

最近一直在研究多模态可视化搭建产品, 经历数月的技术探索和产品思考, 我设计了**flowmix** 多模态产品系列. 之前和大家分享了 **flowmix/flow 工作流引擎的1.0版本,** 接下来继续和大家分享一下最近我对 **flowmix/flow 工作流引擎 的功能更新.**

![图片](/images/jueJin/3662dcf7c261408.png)

****flowmix/flow**** 致力于提供一套**开箱即用**的**流程可视化搭建底座**, 来支撑各种复杂工作流场景的设计. 同时汲取了市面上主流工作流引擎的设计经验, 并对性能做了极致的优化,  目前 **flowmix/flow** 的搭建性能和**所见即所得**的UI更新流畅度非常丝滑. 后续会持续迭代更多功能, 并进一步提升性能上限.

![图片](/images/jueJin/66e038d9b22e49c.png)

体验地址: **[flowmix.turntip.cn/flow](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fflow "http://flowmix.turntip.cn/flow")**

接下来我就和大家介绍一下 **flowmix/flow** 的最新更新和使用场景.

1\. 支持节点动画配置
------------

![图片](/images/jueJin/3f96495d08fc461.png)

目前整套设计架构支持了多种类型的属性编辑, 比如**样式**, **数据**, **动画**等, 动画目前支持了海量的动画素材, 可以轻松给节点配置不同的动画效果, 并设置动画的时长, 次数等.

2\. 支持参考线吸附
-----------

![图片](/images/jueJin/444124e2ff9f43a.png)

目前流程设计器的每个节点都支持参考线吸附, 大家可以更精准的设计工作流, 后续还会做更多设计辅助的优化, 让拖拽体验达到业内Top.

3\. 节点自动创建和自动连线
---------------

![图片](/images/jueJin/de7ca3bf3b604df.png)

目前我已经实现了单机节点, 可以在节点后面自动创建节点, 同时对整个工作流进行自动连线. 后期会实现点击“+”号, 支持选择不同的节点进行创建.

4\. 边的自动创建和节点自动化布局
------------------

![图片](/images/jueJin/a929836aebcd4bc.png)

我们可以看到,在边上点击也会出现“+”号, 并且可以在两个节点之间创建新节点, 其他节点位置会自动计算, 并布局. 这块也是我写的一个布局算法实现的, 后续还会优化它, 支持更复杂的布局场景.

5\. 可操作的图层管理面板
--------------

![图片](/images/jueJin/cb77ce60af904fc.png)

当画布中的元素很多时, 我们需要快速定位到具体的节点, 这个时候图层管理就非常重要了. 所以我也实现了图层管理面板, 并且支持节点反选图层. 图层面板可以多选组件, 选中的组件会在画布中出现选中状态. 后续会对图层面板实现更多的功能.

体验地址: **[flowmix.turntip.cn/flow](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fflow "http://flowmix.turntip.cn/flow")**

场景案例分享

我最初设计 **flowmix/flow** 目的是让它实现自动化 **AI Agent** 生成, 后面越研究越发现它可以做的事情还很多, 所以为了让大家更快的感受 **flowmix** 的能力, 我先做了一个流程编辑器, 也就是 **flowmix/flow**, 我自己基于它设计了几个图表编辑场景, 这里给大家分享一下.

1\. 产品/技术架构图
------------

![图片](/images/jueJin/fe164cbf88db4c7.png)

2\. 组织结构图
---------

![图片](/images/jueJin/f0de4447c6cb4ba.png)

3\. 思维导图
--------

![图片](/images/jueJin/a3c958de35fd4a4.png)

4\. 多画布设计
---------

![图片](/images/jueJin/79f837c7d4ac42b.png)

5. 任务管理 + 流程看板
--------------

![图片](/images/jueJin/6aa00edae92d4aa.png)

当然还有很多场景大家可以一起探索, 目前产品免费使用, 欢迎大家体验反馈~

高性能设计, 支撑上千复杂节点编辑, 异步分片渲染
-------------------------

**flowmix/flow** 的节点内容不是一次性渲染到画布上, 而是一次只渲染**可见区域**的内容, 保证了大量节点也能轻松加载, 同时对于搭建系统的状态管理, 为了支撑大数据量的渲染和状态更新, 我对 **antd form** 组件的更新性能做了进一步优化, 并且采用**zustand 作**为状态管理库.(号称react状态管理性能之王)

![图片](/images/jueJin/f9e65a67e681445.png)

支持自定义节点连接线
----------

流程图的连接线是一个很重要的环节, 这里我对连接线也提供了一定的搭建配置能力, 如下图所示:

![图片](/images/jueJin/58afc5cd0f8a4a9.png)

后续还会按照我的规划持续优化和迭代它, 来实现真正的业务自动化方案.

另一款栾生产品
-------

也许关注我公众号的朋友已经看过我之前做的另一款产品——**flowmix/docx**, 它是另一款搭建类产品, 类似于飞书和Notion, 可以使用它轻松构建企业下一代知识库产品.

![图片](/images/jueJin/0f820d92c749450.png)

如果大家感兴趣, 也可以在线体验一下.

体验地址: **[flowmix.turntip.cn/docx](https://link.juejin.cn?target=http%3A%2F%2Fflowmix.turntip.cn%2Fdocx "http://flowmix.turntip.cn/docx")**

大家感兴后续我会在 **flowmix** 中持续分享**flowmix**系列产品和规划, 感兴趣的朋友可以关注一下.

好啦, 接下来两周我要好好研发了, 10月见~

如果你有好的想法和建议, 也欢迎随时**留言区**交流讨论~