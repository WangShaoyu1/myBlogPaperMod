---
author: "王宇"
title: "服务端渲染不同虚拟人时token缓存方案"
date: 大约10小时以前
description: "ssr"
tags: ["ssr"]
ShowReadingTime: "12s"
weight: 540
---
先吐槽一下，以为是双token机制，搜了下sdk代码，只用了accessToken，而且时长也达到10几天...

![](/download/attachments/134055634/image2024-9-5_11-52-17.png?version=1&modificationDate=1725508337406&api=v2)

【Token】：accessTime

openid: 001

openid: 002  

Module: AvatarListAvatar1: a0001Avatar2: a0002Avatar3: a0003......Instance

001 +  a001

001 +  a002

002 +  a001

...

  
  
Database

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-a79490a5-0e8a-43d2-b3e4-7af51ee31655'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE/134055634?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/134055634/未命名绘图.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=134055634&owningPageId=134055634&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '服务端渲染不同虚拟人时token缓存方案'; readerOpts.attVer = '1'; readerOpts.attId = '134066293'; readerOpts.lastModifierName = '吴家杰'; readerOpts.lastModified = '2024-10-08 09:40:56.213'; readerOpts.creatorName = '吴家杰'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

将登录过一次（甚至考虑后端帮忙登录）获取到的token，存到服务器，省去每次进入应用的初始化时间（授权，获取资源链接，加载资源），做到直接实例化虚拟人形象

1.一个应用固定一个虚拟人
=============

  

新增一个接口，获取当前虚拟人的token到期时间（accessExpireTime），到48小时内，就重新走接口

  

  

2.一个应用不同用户不同虚拟人（千人千面）
=====================

虚拟人限定只有几个
---------

结合openId和avatarId组成一个唯一Id，服务端判断，定期刷新。

虚拟人无限多个
-------

跟上面一致

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)