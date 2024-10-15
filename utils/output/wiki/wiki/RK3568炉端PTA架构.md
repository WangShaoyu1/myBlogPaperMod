---
author: "王宇"
title: "RK3568炉端PTA架构"
date: 三月25,2024
description: "4、集成架构"
tags: ["4、集成架构"]
ShowReadingTime: "12s"
weight: 79
---
*   1[1\. 背景](#RK3568炉端PTA架构-背景)
*   2[2\. 主要功能设计](#RK3568炉端PTA架构-主要功能设计)
    *   2.1[2.1. 功能点](#RK3568炉端PTA架构-功能点)
    *   2.2[2.2. 炉端同步](#RK3568炉端PTA架构-炉端同步)
*   3[3\. 数据设计](#RK3568炉端PTA架构-数据设计)
*   4[4\. 接口设计](#RK3568炉端PTA架构-接口设计)
    *   4.1[4.1. 获取虚拟人列表](#RK3568炉端PTA架构-获取虚拟人列表)
    *   4.2[4.2. 虚拟人信息保存、更新](#RK3568炉端PTA架构-虚拟人信息保存、更新)
    *   4.3[4.3. 查询虚拟人单个实例信息](#RK3568炉端PTA架构-查询虚拟人单个实例信息)
    *   4.4[4.4. 删除虚拟人实例](#RK3568炉端PTA架构-删除虚拟人实例)
    *   4.5[4.5. 批量添加虚拟人到用户列表](#RK3568炉端PTA架构-批量添加虚拟人到用户列表)
    *   4.6[4.6. 应用虚拟人](#RK3568炉端PTA架构-应用虚拟人) 
    *   4.7[4.7. 虚拟人同步配置保存、更新](#RK3568炉端PTA架构-虚拟人同步配置保存、更新)
    *   4.8[4.8. 查询虚拟人同步配置信息](#RK3568炉端PTA架构-查询虚拟人同步配置信息)
    *   4.9[4.9. 查询某个虚拟人的同步设备记录](#RK3568炉端PTA架构-查询某个虚拟人的同步设备记录)
    *   4.10[4.10. 删除某台设备上的虚拟人](#RK3568炉端PTA架构-删除某台设备上的虚拟人)
    *   4.11[4.11. 新增某个设备上的虚拟人同步记录](#RK3568炉端PTA架构-新增某个设备上的虚拟人同步记录)
    *   4.12[4.12. 4.12.查询是否是第一次同步（手机端app使用）](#RK3568炉端PTA架构-4.12.查询是否是第一次同步（手机端app使用）)
    *   4.13[4.13. 4.13.新增虚拟人实例映射（手机端app使用）](#RK3568炉端PTA架构-4.13.新增虚拟人实例映射（手机端app使用）)
    *   4.14[4.14. 4.14.查询虚拟人实例映射信息（炉端使用）](#RK3568炉端PTA架构-4.14.查询虚拟人实例映射信息（炉端使用）)
*   5[5\. 附录：](#RK3568炉端PTA架构-附录：)

1\. 背景
======

为了提高虚拟人的交互效果，完成数字克隆人中的形象的克隆。结合虚拟人公司提供的技术，通过pta实现形象克隆。

2\. 主要功能设计
==========

2.1. 功能点
--------

  

实现

  

实现

![](/download/thumbnails/119669834/image2024-1-29_15-54-46.png?version=1&modificationDate=1706514886189&api=v2)

getInstListByUserId

获取当前用户的虚拟人示例

通过avatarType 这个字段来区分 1：pta 2:卡通

![](/download/thumbnails/119669834/image2024-1-29_18-27-18.png?version=1&modificationDate=1706524038443&api=v2)

HaiSDK.CreatePTA创建虚pta

  

![](/download/attachments/119669834/image2024-1-29_18-29-41.png?version=1&modificationDate=1706524181543&api=v2)

需要在自己应用中保存虚拟人实例id和名称之间的关系

  

  

2.2. 炉端同步
---------

手机端装扮

![](/download/thumbnails/119669834/image2024-3-13_17-26-21.png?version=1&modificationDate=1710321982001&api=v2)

点完成需要调用ftt的upsetInstDefault这个接口和陈健开发的/vdhInst保存装扮

点同步按钮的逻辑

![](/download/thumbnails/119669834/image2024-3-13_17-24-17.png?version=1&modificationDate=1710321857107&api=v2)

第二次同步

第一次同步

手机端

getInstSyncQRCodeStatus判断二维码状态

设备端

调用getInstSyncQRCode生成二维码

\[rest\]保存虚拟人同步的设备  POST /vdhDeviceSync

opt

\[iot\]请求获取二维码status == -1，二维码已过期

调用getInstSyncQRCode生成二维码

返回二维码

请求获取二维码status == 1未同步，二维码有效

点击具体的角色，调用syncInst同步

status == 2已同步，二维码失效

调用getInstSyncQRCodeStatus，如果status 为2  
调用getInstListByAppId，可以获取到同步的虚拟人，  
调用创建虚拟人创建

云端\[rest\]保存二维码 POST /vdhSync\[rest\]轮询获取二维码GET ​/vdhSync​/{seqId}\[iot\]下发同步成功通知\[iot\]下发装扮成功通知\[rest\]删除虚拟人同步的设备  DELETE/vdhDeviceSync\[rest\]查询是否是第一次同步\[iot\]下发删除成功通知\[rest\]查询虚拟人装扮信息GET/vdhInst/getByInstId/{instId}\[rest\]保存虚拟人同步的设备

GET /vdhDeviceSync/judgeIfFirstSync

\[rest\]保存手机实例id和设备端实例id的映射关系POST /vdhInstMap

返回设备端的实例id

\[rest\]查询实例id的映射关系GET /vdhInstMap/getOne

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-6ee58292-cad7-44b9-9515-f73f6a8da59a'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%70%74%61%E5%90%8C%E6%AD%A5/119669834?revision=13'; readerOpts.imageUrl = '' + '/download/attachments/119669834/pta同步.png' + '?version=13&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=119669834&owningPageId=119669834&diagramName=%70%74%61%E5%90%8C%E6%AD%A5&revision=13'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%70%74%61%E5%90%8C%E6%AD%A5'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = 'RK3568炉端PTA架构'; readerOpts.attVer = '13'; readerOpts.attId = '119671733'; readerOpts.lastModifierName = '丁健'; readerOpts.lastModified = '2024-04-08 15:55:43.615'; readerOpts.creatorName = '丁健'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

1、炉端要生成一个二维码，在炉端调用getInstSyncQRCode获取

2、手机端获取炉端的二维码，判读二维码状态getInstSyncQRCodeStatus，

status == -1，二维码已过期

status == 1未同步，二维码有效

status == 2已同步，二维码失效

3、手机端选择要同步的角色，获取角色列表通过getInstListByUserId,点击具体的角色，调用syncInst，传递角色实例id和二维码，同步角色。

4、炉端调用getInstSyncQRCodeStatus，如果status 为2，表示炉端已经同步。

5、炉端调用getInstListByAppId，可以获取到同步的虚拟人，调用创建虚拟人创建。

6、调用HaiSDK.DeletePTA(instId）可以删除虚拟人、

  

  

3\. 数据设计
========

![](/download/attachments/119669834/image2024-3-1_14-8-33.png?version=1&modificationDate=1709273314132&api=v2)

类型 1官方2卡通3pta

  

官方和卡通的通过初始化脚本初始化，pta通过照片生成

  

  

4\. 接口设计
========

  

4.1. 获取虚拟人列表
------------

![](/download/thumbnails/119669834/image2024-2-29_10-42-42.png?version=1&modificationDate=1709174562645&api=v2)![](/download/attachments/119669834/image2024-2-29_10-42-56.png?version=1&modificationDate=1709174576601&api=v2)

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/listUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/listUsingGET)

出参增加了

@ApiModelProperty(value = "实例来源：1：安卓 2：IOS")  
private Short instSourceType;

前端通过instType和instSourceType判断显示哪些虚拟人实例

4.2. 虚拟人信息保存、更新
---------------

pta的虚拟人和卡通的虚拟人创建需要调用这个

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/saveOrUpdateVdhInstUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/saveOrUpdateVdhInstUsingPOST)

  

增加入参

@ApiModelProperty(value = "实例来源：1：安卓 2：IOS")  
private Short instSourceType;

4.3. 查询虚拟人单个实例信息
----------------

例如虚拟人的装扮信息 昵称等

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/getOneVdhInstUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/getOneVdhInstUsingGET)

4.4. 删除虚拟人实例
------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/deleteByIdUsingDELETE](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/deleteByIdUsingDELETE)

  

4.5. 批量添加虚拟人到用户列表
-----------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/batchSaveUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/batchSaveUsingPOST)

  

增加入参

@ApiModelProperty(value = "实例来源：1：安卓 2：IOS")  
private Short instSourceType;

4.6. 应用虚拟人 
-----------

\--用户绑定当前虚拟人，状态变成已使用，用户绑定的其他虚拟人实例状态变成已添加未使用

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/useUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B/useUsingPOST)

  

增加入参

Short instSourceType

  

4.7. 虚拟人同步配置保存、更新
-----------------

炉端收到手机端的请求调用该接口保存生成的二维码

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/addOrUpdateVdhSyncUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/addOrUpdateVdhSyncUsingPOST)

4.8. 查询虚拟人同步配置信息
----------------

手机端根据之前生成的业务id查询二维码字符串

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/getOneVdhSyncUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/getOneVdhSyncUsingGET)

4.9. 查询某个虚拟人的同步设备记录
-------------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/getListUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/getListUsingGET)

4.10. 删除某台设备上的虚拟人
-----------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/deleteVdhDeviceSyncUsingDELETE](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/deleteVdhDeviceSyncUsingDELETE)

4.11. 新增某个设备上的虚拟人同步记录
---------------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/addVdhDeviceSyncUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E9%85%8D%E7%BD%AE/addVdhDeviceSyncUsingPOST)

增加入参

String instId    – 手机端的虚拟人实例id

4.12. 4.12.查询是否是第一次同步（手机端app使用）
-------------------------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E8%AE%B0%E5%BD%95/judgeIfFirstSyncUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E8%AE%BE%E5%A4%87%E5%90%8C%E6%AD%A5%E8%AE%B0%E5%BD%95/judgeIfFirstSyncUsingGET)

修改传参

avatarId修改为instId

4.13. 4.13.新增虚拟人实例映射（手机端app使用）
------------------------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B%E6%98%A0%E5%B0%84/addOrUpdateVdhInstMapUsingPOST](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B%E6%98%A0%E5%B0%84/addOrUpdateVdhInstMapUsingPOST)

4.14. 4.14.查询虚拟人实例映射信息（炉端使用）
----------------------------

[https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B%E6%98%A0%E5%B0%84/getOneByPhoneInstIdUsingGET](https://api-mainapp.dev.yingzi.com/api/appservice/vdh/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BA%BA%E5%AE%9E%E4%BE%8B%E6%98%A0%E5%B0%84/getOneByPhoneInstIdUsingGET)

  

5\. 附录：
=======

手机端和炉端交互协议。[万得厨微波炉IOT通迅协议](/pages/viewpage.action?pageId=101823956)

4.2.18是这次涉及的协议。

环境

  

  

  

  

默认头像（不区分环境）

大头像（不区分环境）

开发、测试

App Id：  
6923626558545053  
App Key：  
AZeiMxoZxS5nzW16gl7ObTbc  
App Secret：  
U3YwmSeK2xIPVAkI75LgPf4dxugdXxsW

万得厨APP万得安

AvatarID：  
11200010000785330000000000000000

官方

[https://yz-common-production.oss-cn-shenzhen.aliyuncs.com/vdh/ics/wandean.png](https://yz-common-production.oss-cn-shenzhen.aliyuncs.com/vdh/ics/wandean.png)

[https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1217437298186686464%2F%E5%AE%89%402x.png](https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1217437298186686464%2F%E5%AE%89%402x.png)

万得厨APP万得美

11200020000358530000000000000000

官方

[https://yz-common-production.oss-cn-shenzhen.aliyuncs.com/vdh/ics/wandemei.png](https://yz-common-production.oss-cn-shenzhen.aliyuncs.com/vdh/ics/wandemei.png)

[https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1217437339012235264%2F%E7%BE%8E%402x.png](https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1217437339012235264%2F%E7%BE%8E%402x.png)

翔宝

11200220000939960000000000000000

卡通

[https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1220025907660390400%2F555.png](https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1220025907660390400%2F555.png)

[https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1220025963064758272%2F666.png](https://yz-bizcenter-bsc-production.oss-cn-shenzhen.aliyuncs.com/2248%2F1220025963064758272%2F666.png)

PTA女性

20000000000000000316102602327723

  

  

  

PTA男性

20000000000000000548707525564446

  

  

  

预生产、生产

App Id：  
6923626558545053  
App Key：  
AZeiMxoZxS5nzW16gl7ObTbc  
App Secret：  
U3YwmSeK2xIPVAkI75LgPf4dxugdXxsW

万得厨App万得安

11200010000770180000000000000000

官方

  

  

万得厨App万得美

11200020000005770000000000000000

官方

  

  

翔宝

待创建

卡通

  

  

PTA女性

20000000000000000316102602327723

  

  

  

PTA男性

20000000000000000548707525564446

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)