---
author: "王宇"
title: "高阶Observable"
date: 八月12,2024
description: "rxjs"
tags: ["rxjs"]
ShowReadingTime: "12s"
weight: 541
---
高阶的Observable像是多维的概念

mergeAll
========

  

2000

2000  

1000

1000

1000

1000

Text

1000

1000

1000

1000

0:0

0:1

0:2

1:0

0:3

1:1

1:2

1:3

interval(2000).pipe(

  take(2),

  map(x\=>interval(1000).pipe(

    map(y\=>\`${x}: ${y}\`),

    take(4)

  )),

  mergeAll()

)

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-815cdeac-5136-4ba5-8f3c-c2da2d83ad29'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%6D%65%72%67%65%41%6C%6C/129196056?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/129196056/mergeAll.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=129196056&owningPageId=129196056&diagramName=%6D%65%72%67%65%41%6C%6C&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%6D%65%72%67%65%41%6C%6C'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '高阶Observable'; readerOpts.attVer = '1'; readerOpts.attId = '129196079'; readerOpts.lastModifierName = '吴家杰'; readerOpts.lastModified = '2024-08-12 11:38:31.66'; readerOpts.creatorName = '吴家杰'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)