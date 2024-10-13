---
author: "王宇"
title: "3、Demo技术对接过程中的一些思考"
date: 一月30,2023
description: "2023年1.15Demo冲刺项目计划"
tags: ["2023年1.15Demo冲刺项目计划"]
ShowReadingTime: "12s"
weight: 201
---
*   1[](#id-3、Demo技术对接过程中的一些思考-)
*   2[1、整体架构图](#id-3、Demo技术对接过程中的一些思考-1、整体架构图)
*   3[2、对接过程中体现的问题](#id-3、Demo技术对接过程中的一些思考-2、对接过程中体现的问题)
    *   3.1[2.1、语音模块～～识别率有待提高](#id-3、Demo技术对接过程中的一些思考-2.1、语音模块～～识别率有待提高)
    *   3.2[2.2、万得厨软硬件整体研发端对外公共能力体系完善](#id-3、Demo技术对接过程中的一些思考-2.2、万得厨软硬件整体研发端对外公共能力体系完善)
    *   3.3[2.3、产品化能力提炼需要提升](#id-3、Demo技术对接过程中的一些思考-2.3、产品化能力提炼需要提升)
*   4[3、打造一个用户体验友好的虚拟人产品的未来方向](#id-3、Demo技术对接过程中的一些思考-3、打造一个用户体验友好的虚拟人产品的未来方向)




====================================================================================================================================================================================================================================================================================================================================================================================================================================================================

1、整体架构图
=======

目前虚拟人整体的技术架构如下，其中：

1、左边是科大讯飞提供，包括语音唤醒、语音识别；

2、右边语义理解、内容平台、语音合成是新西兰公司提供能力；

虚拟人

语音唤醒

语音识别

语义理解

内容平台

语音合成

麦克风阵列

声学算法

硬件+算法

降噪算法

语音唤醒

技能

意图

语义理解

嘈杂环境

云端语音识别

方言、口音

上下文

场景

烹饪

厨师

**...**

多种音色

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "Show Comments")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-1b6a286d-b9e9-4462-8679-72deefdd3bf6'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9E%B6%E6%9E%84%E5%9B%BE/91158375?revision=3'; readerOpts.imageUrl = '' + '/download/attachments/91158375/架构图.png' + '?version=3&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=91158375&owningPageId=91158375&diagramName=%E6%9E%B6%E6%9E%84%E5%9B%BE&revision=3'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9E%B6%E6%9E%84%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '3、Demo技术对接过程中的一些思考'; readerOpts.attVer = '3'; readerOpts.attId = '91158525'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2023-01-17 05:58:21.627'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

下面是万得厨“智厨平台”的业务架构：  
1、虚拟数字人作为一个应用接入到万得厨App中；  
2、虚拟数字人技术落地需要使用到稳定的万得厨App 架构提供的接入能力、公共能力；

**智能烹饪应用**  
  
一键烹饪  
自定义烹饪  
我的烹饪  
...

**小万精灵应用**  
  
虚拟厨师  
语音对话  
人机交互  
...

**应用层**

运行的“万得厨炉上应用平台”中的各种业务应用，处于最上层

**大屏专用应用**  
  
烹饪纵览  
任务交互  
...

虚拟人数字相关14个场景...

**接口层**

面向“万得厨炉上应用平台”提供万得厨能力，涉及从硬件到语言交互的所有能力

硬件控制接口  

语音交互接口  
（语音识别等）  

......  

**算法层**

运行万得厨核心算法，提供统一和扁平的算法服务能力

智能烹饪算法服务  

物联网连接服务  

**服务层**

运行万得厨核心服务，面向上次接口提供接入能力，面向下层设备提供管控能力

......  

...

......  

**系统层**

操作系统，底层固件

安卓11  

**硬件层**

万得厨关键设备

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-7c0ce588-8609-4898-ae73-b29e6d839357'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31/91158375?revision=5'; readerOpts.imageUrl = '' + '/download/attachments/91158375/未命名绘图1.png' + '?version=5&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=91158375&owningPageId=91158375&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31&revision=5'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '3、Demo技术对接过程中的一些思考'; readerOpts.attVer = '5'; readerOpts.attId = '91158553'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2023-01-17 06:02:21.557'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

2、对接过程中体现的问题
============

2.1、语音模块～～识别率有待提高
-----------------

       （**备注：目前没有专门去准确统计识别成功、失败的次数，但是体验、使用过程中可感受到唤醒成功率有待提高）**

**问题1：**“小万，小万”，唤醒成功率不太高，同等正常音量情况，讲话方位有很大关系—正对着唤醒成功率明显 高于侧方位、反方向位置；

优化方案，答：  
1、结合软硬件已有能力进行语音唤醒、识别测试、调优，并建立对应的语音唤醒、识别方面的**标准**；  
2、结合主要场景的环境特点，比如说，嘈杂环境下、大角度下模拟这些环境下的语音识别效果，并针对性调优；

**问题2**：语音识别有时候偏差较大，特别是在炉子风扇在工作的情况下；

优化方案，答：  
1、针对性调优，主要是降噪算法与硬件的适配  

**问题3**：间隔一段时间，虚拟人处于静默状态时，再次唤醒需要多次；

优化方案，答：  
1、语音识别服务需要设置为在后台一直运行中（在非活动状态中可保持其最低的活动频次）。如何实现？

2.2、万得厨软硬件整体研发端对外公共能力体系完善
-------------------------

     目前万得厨软硬件整体项目架构涉及的模块很多，包含硬件、安卓系统、万得厨烹饪App、云端等等，虚拟数字人作为一个第三方应用通过插拔式模式接入到万得厨生态（某种程度上也可以反过来讲），这依赖于万得厨“智厨”平台，能够提供：

1.  封装好的公共能力，涵盖原子化的功能、公共技术模块等等；
2.  能够提供应用级别的无耦合接入方式，实现；

2.3、产品化能力提炼需要提升
---------------

     目前对于用户而言，在使用到万得厨的虚拟人产品能力时需要让用户体验到聪明、易用、贴心、快乐，这是虚拟人产品的前进方向；当前的虚拟厨师能力从哪里来？目标场景该如何准确识别、叠加，并结合万得厨各种传感器、算法、用户界面结合起来，通过产品化的形式提供给用户，并和用户画像进行匹配？

3、打造一个用户体验友好的虚拟人产品的未来方向
=======================

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)