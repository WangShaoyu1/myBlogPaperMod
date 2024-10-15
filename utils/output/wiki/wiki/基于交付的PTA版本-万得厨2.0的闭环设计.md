---
author: "王宇"
title: "基于交付的PTA版本-万得厨2.0的闭环设计"
date: 七月12,2023
description: "PTA相关"
tags: ["PTA相关"]
ShowReadingTime: "12s"
weight: 115
---
对接影子账号体系

杭州公司账号体系

唯一标识 - userid

利用PTA能力创建虚拟人挂载到当前用户下

杭州公司的同步流程

用户移步到炉端

点击添加虚拟人并生成二维码

用户使用PTA进行扫码弹出角色列表

用户选择对应的角色弹出是否同步到炉端

页面增加同步按钮,用户手动点击同步并弹出用户绑定的在线设备

用户选择设备开始下发角色

手机端

炉端

炉端后台进行PTA角色下载

回到首页自动切换角色

手机端

炉端

炉端下载资源,并每隔3s检查下是否下载完成，完成之后主动播报

用户自己手动进行角色切换

影子设计的逻辑

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-b116f35c-70f7-4daf-973a-33747b16b235'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91/105262266?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/105262266/同步逻辑.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=105262266&owningPageId=105262266&diagramName=%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '400'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '基于交付的PTA版本-万得厨2.0的闭环设计'; readerOpts.attVer = '2'; readerOpts.attId = '105262320'; readerOpts.lastModifierName = '未知用户 (liaozhichuan)'; readerOpts.lastModified = '2023-07-07 11:15:40.936'; readerOpts.creatorName = '未知用户 (liaozhichuan)'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

交付版本的接口交互逻辑: [PTA交互流程](/pages/viewpage.action?pageId=105262252)

现有设计的接口交互逻辑: 待设计 [未知用户 (renpeng)](/display/~renpeng)

注明: 整个逻辑看下来，二维码的作用其实不影响流程，只是交互的一种形式而已。

第一个手机端扫码的时候判断二维码的状态确定是否能打开角色列表，

第二个炉端不断的去循环判断二维码的状态，进而决定播放同步完成的提示。

就是这两个作用，不影响同步逻辑的跑通。

手机端点击同步的时候获取一个二维码存在手机端本地

选择完设备之后,开始同步实例到服务端,把码携带给服务端进行状态更新

手机端

炉端

自动触发同步角色的切换,下载PTA角色资源

回到首页进行角色的切换

炉端角色列表弹窗出现的时候去拉取服务端角色进行展示

目前生成的token信息都是根据手机号来的

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-c6742148-53c4-4e3d-a868-e93d50b25d85'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%96%B0%E8%AE%BE%E8%AE%A1%E9%80%BB%E8%BE%91%E5%9B%BE/105262266?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/105262266/新设计逻辑图.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=105262266&owningPageId=105262266&diagramName=%E6%96%B0%E8%AE%BE%E8%AE%A1%E9%80%BB%E8%BE%91%E5%9B%BE&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '761'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%96%B0%E8%AE%BE%E8%AE%A1%E9%80%BB%E8%BE%91%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '基于交付的PTA版本-万得厨2.0的闭环设计'; readerOpts.attVer = '1'; readerOpts.attId = '105264003'; readerOpts.lastModifierName = '未知用户 (liaozhichuan)'; readerOpts.lastModified = '2023-07-12 15:13:43.571'; readerOpts.creatorName = '未知用户 (liaozhichuan)'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

1、账号的唯一标识userid：建议使用可读性强且唯一的字段(手机号)，直接复用万得厨app的登录能力，通过手机号+密码/手机号+验证码 进行登录，不需要单独注册。

![](/download/thumbnails/105262266/Screenshot_20230710-114915.jpg?version=1&modificationDate=1688961026640&api=v2)![](/download/thumbnails/105262266/Screenshot_20230710-114908.jpg?version=1&modificationDate=1688961026771&api=v2)

手机端只做角色的创建，背后调用的能力还是炉端pta虚拟人的nlp能力，我们还需要补全指令的能力为了适配万得厨2.0。

PTA角色(男)  
avatarId

PTA角色(女)  
avatarId

虚拟人1(男)  
ptaId

虚拟人2(女)  
ptaId  

FTT

用户域

用户A

虚拟人1(男)  
ptaId

虚拟人2(女)  
ptaId  

虚拟人1(男)  
ptaId

虚拟人2(女)  
ptaId  

用户B

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-13fd8e7a-77e3-4876-9083-7b09e9da3766'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E5%85%B3%E7%B3%BB%E5%9B%BE/105262266?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/105262266/关系图.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=105262266&owningPageId=105262266&diagramName=%E5%85%B3%E7%B3%BB%E5%9B%BE&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '671'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E5%85%B3%E7%B3%BB%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '基于交付的PTA版本-万得厨2.0的闭环设计'; readerOpts.attVer = '1'; readerOpts.attId = '105264025'; readerOpts.lastModifierName = '未知用户 (liaozhichuan)'; readerOpts.lastModified = '2023-07-12 15:42:48.804'; readerOpts.creatorName = '未知用户 (liaozhichuan)'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

![](/download/attachments/105262266/image2023-7-10_14-16-33.png?version=1&modificationDate=1688969793813&api=v2)

![](/download/attachments/105262266/image2023-7-11_9-14-53.png?version=1&modificationDate=1689038093430&api=v2)

2、基于交付的PTA版本还需要做一些单独的页面设计，为了提前验证万得厨app同步到万得厨2.0的全流程。

  

![](/download/attachments/105262266/image2023-7-7_11-45-6.png?version=2&modificationDate=1689239335498&api=v2)

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)