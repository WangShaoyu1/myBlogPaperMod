---
author: "王宇"
title: "PTA交互流程"
date: 七月13,2023
description: "99、其他"
tags: ["99、其他"]
ShowReadingTime: "12s"
weight: 103
---
pta端炉端扫码，根据二维码调用getInstSyncQRCodeStatus检查二维码状态虚拟人云服务

用户

切换角色

结果返回

炉端通过token调用getInstSyncQRCode获取二维码

如果status=2表示已同步，点击切换虚拟人。  
1正在同步，如果  
超时，同步失败。如果没超时3s继续查询

3s后调用getInstSyncQRCodeStatus校验二维码的状态通过userid获取pta角色列表getInstListByUserId

结果返回

用户选择角色同步，调用syncInst传递角色id和二维码，同步到炉端

loop

通过sdk定时查询HaiSDK.CheckServerAsset资源有没有更新

有更新就下载

如果为2，表示已同步。就可以点击切换角色。如果为1代表为未同步，如果超过5分钟就超时，不超过5min继续查询

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-dd08aceb-9b16-4045-84bd-9e711d350ac9'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%70%74%61%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91/105262252?revision=6'; readerOpts.imageUrl = '' + '/download/attachments/105262252/pta同步逻辑.png' + '?version=6&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=105262252&owningPageId=105262252&diagramName=%70%74%61%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91&revision=6'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '911'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%70%74%61%E5%90%8C%E6%AD%A5%E9%80%BB%E8%BE%91'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = 'PTA交互流程'; readerOpts.attVer = '6'; readerOpts.attId = '105262305'; readerOpts.lastModifierName = '未知用户 (renpeng)'; readerOpts.lastModified = '2023-07-13 16:50:06.582'; readerOpts.creatorName = '未知用户 (renpeng)'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)