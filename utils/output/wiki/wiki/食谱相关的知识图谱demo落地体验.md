---
author: "王宇"
title: "食谱相关的知识图谱demo落地体验"
date: 五月12,2023
description: "廖志川"
tags: ["廖志川"]
ShowReadingTime: "12s"
weight: 430
---
#### 注：关于知识图谱的一些概念介绍可以自行学习，还有一些工具(protege\[本体构建工具】,neo4j【图数据库的使用】）的使用可能需要一定的时间成本。

一、知识图谱的核心工作流程
=============

![](/download/attachments/101824322/%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1%E7%9A%84%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png?version=1&modificationDate=1683878635322&api=v2)

**针对结构化问题设计了一套基于KBQA的算法框架。**首先，在接收到线上用户的query输入后，我们会先对其进行领域识别以及意图分类。若query是可以使用KBQA解决，那么我们会对query进行实体识别、query解析和答案生成。这三个主要步骤又可以通过在线和离线两方面进行进一步归类。比如，离线KBQA会进行别名挖掘、新词发现、属性归一、模板挖掘，最终更新知识图谱和图数据库。在线KBQA会进行实体抽取、实体链接、属性识别、约束挂载、模板匹配和长尾模板的语义匹配，最后在图数据中进行知识查询或者根据查询结果进行推理计算。

二、构建一个简单的知识图谱
=============

1.1 定义具体的业务问题。
--------------

我这里定义一些问题:

1、这两种食材放一起可以做什么菜？  
2、这个食材可以做什么菜？

3、这两种食材放一起可以做什么不辣的菜？

1.2 数据的收集&预处理。
--------------

我们的数据集来源于我们万得厨app上所有已经发布的食谱   食谱也有对应的分类维度

1.3 知识图谱的本体设计。
--------------

![](/download/attachments/101824322/image2023-5-12_10-13-53.png?version=1&modificationDate=1683857634599&api=v2)

  

1.4 把数据存入到知识图谱对应的图数据库中,进行可视化展示。
-------------------------------

设计本体之前我们先模拟一个简单的例子 

可以做

可以做

k可以做

土豆

食材

食谱

可以做

可以做

牛腩

土豆烧牛腩(辣的)

红烧牛腩(辣的)

酸辣土豆丝(辣的)

醋溜土豆丝(不辣的)

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "Show Comments") //<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-03b17c64-f104-4785-a839-d0235cfaafe2'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E9%A3%9F%E8%B0%B1%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1/101824322?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/101824322/食谱知识图谱.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=101824322&owningPageId=101824322&diagramName=%E9%A3%9F%E8%B0%B1%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '400'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E9%A3%9F%E8%B0%B1%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '食谱相关的知识图谱demo落地体验'; readerOpts.attVer = '2'; readerOpts.attId = '101825164'; readerOpts.lastModifierName = '未知用户 (liaozhichuan)'; readerOpts.lastModified = '2023-05-12 09:24:32.421'; readerOpts.creatorName = '未知用户 (liaozhichuan)'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

  

根据我们设计的本体导入到图数据库中，其中也定义了实例的数据属性，对象属性，出来的结果也是一样的

![](/download/attachments/101824322/image2023-5-12_10-35-19.png?version=1&modificationDate=1683858919746&api=v2)

  

1.5 上层应用的开发
-----------

现在就是根据有的数据库数据，进行我们应用层面的转化查询

1、有土豆可以做什么菜?

![](/download/attachments/101824322/image2023-5-12_10-58-6.png?version=1&modificationDate=1683860286521&api=v2)

![](/download/attachments/101824322/image2023-5-12_11-53-8.png?version=1&modificationDate=1683863588551&api=v2)

2、有牛腩可以做什么菜？

![](/download/attachments/101824322/image2023-5-12_11-0-38.png?version=1&modificationDate=1683860438574&api=v2)

![](/download/attachments/101824322/image2023-5-12_11-53-25.png?version=1&modificationDate=1683863605146&api=v2)

  

3、我有牛腩可以做什么不辣的菜？

![](/download/attachments/101824322/image2023-5-12_11-56-27.png?version=1&modificationDate=1683863787600&api=v2)

4、土豆和牛腩放一起可以做什么不辣的菜?

![](/download/attachments/101824322/image2023-5-12_15-49-17.png?version=1&modificationDate=1683877757984&api=v2)

  

三、思考与总结
=======

上述从0到1简单体验了一下知识图谱的搭建流程，并进行了一系列的问题模拟，从知识图谱中拿到结果，但是这离我们的真实场景使用还是远远不够的，为什么呢？

我们缺少的很多自动化的算法能力，包括如果我们使用外部的能力怎么去对接打通为我们所用也是需要思考的？

1、对于query的如何进行智能的识别并转化为对应的模板，拿到具体的实体去执行业务逻辑。

2、对于知识图谱的迭代，需要源源不断的从我们的食谱数据源中，进行智能的实体抽取，关系抽取，然后更新到知识图谱中去，这都是需要自动化的过程，需要算法的支持。

更多的可以看一下oppo关于自构建知识图谱的过程

[【OPPO自研大规模知识图谱及其在小布助手中的应用】](https://blog.csdn.net/TgqDT3gGaMdkHasLZv/article/details/128089876?ops_request_misc=&request_id=&biz_id=102&utm_term=oppo%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-128089876.142^v87^insert_down1,239^v2^insert_chatgpt&spm=1018.2226.3001.4187)

最后夸赞以下gpt还是厉害: 搜索很久都没有明确的答案，用它一次就解决问题了。

![](/download/attachments/101824322/image2023-5-12_16-47-54.png?version=1&modificationDate=1683881274849&api=v2)

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)