---
author: "王宇"
title: "虚拟人智能交互屏Android应用多版本管理"
date: 六月13,2024
description: "2024~~六月份"
tags: ["2024~~六月份"]
ShowReadingTime: "12s"
weight: 81
---
*   1[1\. 现状](#id-虚拟人智能交互屏Android应用多版本管理-现状)
    *   1.1[1.1. 接口信息](#id-虚拟人智能交互屏Android应用多版本管理-接口信息)
*   2[2\. 改进方案](#id-虚拟人智能交互屏Android应用多版本管理-改进方案)
*   3[3\. 生产环境推送自动升级流程配置](#id-虚拟人智能交互屏Android应用多版本管理-生产环境推送自动升级流程配置)
*   4[4\. 开发测试阶段Debug包灵活切换](#id-虚拟人智能交互屏Android应用多版本管理-开发测试阶段Debug包灵活切换)

目前，随着智能交互屏产品业务场景的拓展，以及场景的差异化，同一个产品很难同时满足所有的场景要求，这就要求产品能够灵活配置，定向升级。

1\. 现状
======

*   Android APP：一个APP git仓库，通过多个git分支来打不同的APK包，通过现场安装或者自动升级的方式  装在不同场景下的智能交互屏上；采取自动升级的方式无法区分场景进行对应精准升级；
*   H5：不同的git仓库，对应不同的场景；
*   全局配置项：有的在poc运营中心配置成不同的数据字典，通过字典key取值；有的通过参数配置取值。存在重复配置、漏配置的风险；

1.1. 接口信息
---------

1.  读取基础配置接口：https://api-vdh.\[环境\].yingzi.com/api/config/v1/configRelease/loadConfig/2537?qp-groupCode-eq=\[配置组KEY\]
2.  读取数字字典的接口内容，后续全部统一到，基础配置接口

2\. 改进方案
========

改进型

详情

备注

改进型

详情

备注

**制定内部规则**

*   不同场景分配不同的数字范围、业务英文code代号（可新增）

  

Android APP

统一为一个APP git仓库，统一的分支管理，不同的业务用对应的业务code做区分

  

poc运营中心配置

统一：平台基础服务--参数配置，通过不同的配置组名称（业务code）来区分

  

  

  

  

3\. 生产环境推送自动升级流程配置
==================

POC运营中心配置

选择应用---  
虚拟人智能交互屏Android应用

设置APP版本号---  
按照场景分配不同的范围，例如1.x.x是展会场景，2.x.x是总部展厅，等等

读取配置

Android    APP

读取，版本号、下载链接

内部规则  
（暂时wiki维护）

1、不同的业务场景，分配不同的APP版本号“网段”  
2、不同的业务场景，对应不同的业务code  
3、不同的场景下的设备的mac地址，和业务code对应

（云）APP版本号----业务code  

（本地）mac地址----业务code  

云端和本地端，匹配上才会执行执行下载链接，手动安装

APP版本升级

1、内部规则1、2在运营中心配置  

2、保留内部规则3的字段

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-edd519cd-fba2-4a88-ba7f-e667196c31ac'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%76%31%32/123665636?revision=3'; readerOpts.imageUrl = '' + '/download/attachments/123665636/v12-50e1e4962f088f36589e8e3041a91fde9753775a.png' + '?version=3&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123665636&owningPageId=123665636&diagramName=%76%31%32&revision=3'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%76%31%32'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = 'quHWhRENztnWAJWrdWvo'; readerOpts.ceoName = '虚拟人智能交互屏Android应用多版本管理'; readerOpts.attVer = '3'; readerOpts.attId = '123665736'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-06-13 20:43:11.344'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

4\. 开发测试阶段Debug包灵活切换
====================

        APP右下角全局配置按钮增加一个全局参数切换：业务场景code。切换完，自动重启应用

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)