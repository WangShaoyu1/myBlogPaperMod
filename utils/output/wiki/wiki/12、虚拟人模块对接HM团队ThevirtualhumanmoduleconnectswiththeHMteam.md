---
author: "王宇"
title: "12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam"
date: 五月07,2024
description: "五、系统架构设计"
tags: ["五、系统架构设计"]
ShowReadingTime: "12s"
weight: 117
---
*   1[1\. 业务流程 Business Process](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-业务流程BusinessProcess)
*   2[2\. 数据流图 Data flow diagram](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-数据流图Dataflowdiagram)
*   3[3\. SDK接入指导 SDK Access Guidance](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-SDK接入指导SDKAccessGuidance)
    *   3.1[3.1. 声学SDK Acoustic SDK access guide](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-声学SDKAcousticSDKaccessguide)
    *   3.2[3.2. 虚拟人SDK接入指导 Virtual Human SDK Access Guide](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-虚拟人SDK接入指导VirtualHumanSDKAccessGuide)
*   4[4\. 创建虚拟人流程 Create a virtual digital human process](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-创建虚拟人流程Createavirtualdigitalhumanprocess)
*   5[5\. 虚拟人接入万得厨2.0（NVIDIA）集成方案v1.0](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-虚拟人接入万得厨2.0（NVIDIA）集成方案v1.0)
    *   5.1[5.1. 设计原则 Design Principles](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-设计原则DesignPrinciples)
        *   5.1.1[5.1.1. 模块拆分原则 Module splitting principle](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-模块拆分原则Modulesplittingprinciple)
        *   5.1.2[5.1.2. 命名规范 Naming convention](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-命名规范Namingconvention)
    *   5.2[5.2. 优势](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-优势)
    *   5.3[5.3. 技术栈 technology stack](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-技术栈technologystack)
    *   5.4[5.4. 分层架构 layered architecture](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-分层架构layeredarchitecture)
        *   5.4.1[5.4.1. 架构一 Architecture 1](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-架构一Architecture1)
        *   5.4.2[5.4.2. 架构二 Architecture 2](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-架构二Architecture2) 
    *   5.5[5.5. 通信机制 Communication mechanism](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-通信机制Communicationmechanism)
        *   5.5.1[5.5.1. 语音模块voiceservic通信 Voice module voiceservic communication](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-语音模块voiceservic通信Voicemodulevoiceserviccommunication)
        *   5.5.2[5.5.2. 虚拟人APP和外部APP通信方式  Communication method between virtual person APP and external APP](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-虚拟人APP和外部APP通信方式CommunicationmethodbetweenvirtualpersonAPPandexternalAPP)
    *   5.6[5.6. 时序图  Sequence diagram](#id-12、虚拟人模块对接HM团队ThevirtualhumanmoduleconnectswiththeHMteam-时序图Sequencediagram)

1\. 业务流程 Business Process
=========================

将虚拟数字人安装在万得厨（之后会有其他设备载体），期望通过语音互动的交互形式，依托背后强大的产业知识数据库及知名第三方厂商的公开知识库，为用户提供设备控制、智能对话等服务

The virtual digital human （VDH）is installed in Wonder Kitchen (there will be other device carriers in the future), and it is expected to provide users with device control and intelligence Conversation and other services through the interactive form of voice interaction, relying on the powerful industrial knowledge database and the public knowledge base of well-known third-party manufacturers

Pool

用户 User

说出语音对话内容  
User speaks voice conversation content

设备端 device

执行指令

Execute instructions  

mic拾音  
mic picking up sound

播放语音

Play voice  

VDH Cloud Skills  NLP（natural language processing）Analyze user intent

影子虚拟人 Yingzi VDH

解析意图调用万得厨指令接口  
Parsing the intention to call the Wonderchu command interface

播放动作

play action  

Acoustic SDK

ASR语音转化为文本  
ASR speech to text

VDH SDK

调用接口  
calling SDK interface

触发回调接口  
Trigger callback interface  
(IPlayChat)

Virtual human operation system

配置虚拟人指令、闲聊库、知识库

Configure virtual human instructions, chat library, and knowledge base  

VDH: virtual digtal human  虚拟数字人

Acoustic SDK

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-6b6525bc-a85d-4100-b25e-bf121efca794'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE/123651584?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/123651584/未命名绘图.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123651584&owningPageId=123651584&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '12、虚拟人模块对接HM团队 The virtual human module connects with the HM team'; readerOpts.attVer = '1'; readerOpts.attId = '123651603'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-06 11:33:46.134'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

**说明 Description：**

**运营人员在杭州虚拟人公司的后台运营系统录入指令库和知识库  
**

**Operators enter the instruction base and knowledge base into the backend operation system of third-party Virtual Human Company**

**1、用户说出语音对话内容，被麦克风拾音**

**The user speaks the voice conversation content and the sound is picked up by the microphone.**

**2、调用科大讯飞sdk asr接口降语音转化为文本**

**Call the IFLYTEK sdk asr interface to convert speech into text.**

**3、将文本传给杭州虚拟人接口AvatarPlayCloudBehavior，接口分析语义、情绪、进行行为推理，回调影子虚拟人接口**

**Pass the text to the third-partyvirtual human interface AvatarPlayCloudBehavior. The interface analyzes semantics, emotions, conducts behavioral inference, and calls back the shadow virtual human interface.**

**4、影子虚拟人接口收到IPlaychat的接口回调，根据意图，调用万得厨或者其他接口。**

**The Yingzi VDH interface receives the interface callback from IPlaychat, and calls Wonder Kitchen or other interfaces based on the intention**

2\. **数据流图 Data flow diagram**
==============================

万得厨 Device

虚拟人应用  
VDH application

mic

Acoustic SDK  
  
(Wake ASR)

VDH sdk

VDH cloud service

虚拟人后台运营应用  
Virtual human backend operation application

audio

技能 skill

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-ce91b1af-b22c-4950-901e-632e6bc8a16b'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31/123651584?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/123651584/未命名绘图1.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123651584&owningPageId=123651584&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '600'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%31'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '12、虚拟人模块对接HM团队 The virtual human module connects with the HM team'; readerOpts.attVer = '1'; readerOpts.attId = '123651609'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-06 11:42:02.77'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

3\. SDK接入指导 SDK Access Guidance
===============================

3.1. 声学SDK Acoustic SDK access guide
------------------------------------

**中文版本 Chinese edition :** 

*    [https://aiui-doc.xf-yun.com/project-1/doc-12/](https://aiui-doc.xf-yun.com/project-1/doc-12/)
*   [https://github.com/zrmei/DemoCode/blob/master/docs/src/index.rst](https://github.com/zrmei/DemoCode/blob/master/docs/src/index.rst)
*   [https://democode.readthedocs.io/zh-cn/latest/src/index.html#sdk](https://democode.readthedocs.io/zh-cn/latest/src/index.html#sdk)

**Demo code：**

*   [std\_mic2&aiui.zip](/download/attachments/123651584/std_mic2%26aiui.zip?version=1&modificationDate=1714989654129&api=v2)

3.2. 虚拟人SDK接入指导 Virtual Human SDK Access Guide
----------------------------------------------

**中文文档 Chinese documentation**

**英文文档  English document**

**中文文档 Chinese documentation**

**英文文档  English document**

 [![](/rest/documentConversion/latest/conversion/thumbnail/123651769/1)](/download/attachments/123651584/HaiSDK_ubuntu%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97.pdf?version=1&modificationDate=1714989721372&api=v2) PDF

 [![](/rest/documentConversion/latest/conversion/thumbnail/123651771/1)](/download/attachments/123651584/HaiSDK_ubuntu%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97_English.pdf?version=1&modificationDate=1714989936467&api=v2) PDF

  

  

  

  

**Demo code：**

*   [nvidia jetson orin.zip](/download/attachments/123651584/nvidia%20jetson%20orin.zip?version=1&modificationDate=1714990789405&api=v2)

4\. 创建虚拟人流程 Create a virtual digital human process
==================================================

序号order

**中文版本 Chinese edition**

**英文版本  English edition**

序号order

**中文版本 Chinese edition**

**英文版本  English edition**

1

【必须】HaiSDK#Init，sdk初始化方法，在回调里面判断是否成功，成功后继续下一步

【Required】 HaiSDK#Init, sdk initialization method, determine whether it is successful in the callback, and continue to the next step if successful.

2

【必须】通过HaiSDK.GetAuthToken()方法获取token，成功后继续下一步

【Required】 Obtain the token through the HaiSDK.GetAuthToken() method and proceed to the next step after success.

3

【必须】获取通过接口虚拟人信息，url=(GPValues.BASE\_URL + "/getInstListByAppId")，添加token到头部信息，addHeader("Cookie","user\_token=$token")

【Required】 Obtain the virtual person information through the interface, url=(GPValues.BASE\_URL + "/getInstListByAppId"), add token to the header information, addHeader("Cookie", "user\_token=$token")

4

【必须】检查资源包：HaiSDK.CheckServerAsset，如果不需要更新，则可跳过第5步

【Required】 Check the resource package: HaiSDK.CheckServerAsset. If you do not need to update, you can skip step 5.

5

【必须】下载资源包方法：HaiSDK.DownloadCheckedServerAsset

【Required】 How to download resource package: HaiSDK.DownloadCheckedServerAsset

6

【可选】如果是pta虚拟人，需要执行这个，下载PTA实例资源：HaiSDK.DownloadPTA，不是pta虚拟人直接跳过这步，进入创建。

【Optional】 If it is a pta virtual person, you need to perform this and download the PTA instance resource: HaiSDK.DownloadPTA. If it is not a pta virtual person, skip this step and enter creation.

7

【可选】创建pta HaiSDK.CreatePTA 失败原因 //1 创建成功  
//-1 未检测到人脸  
//-2 不是正脸  
//-3 戴了眼镜  
//-4 五官被遮挡  
//-5 眼睛异常  
//-6 嘴部异常  
//-7 图片为空

【Optional】 Reason for failure to create pta HaiSDK.CreatePTA //1 Successfully created  
//-1 No face detected  
//-2 is not a positive face  
//-3 Wearing glasses  
//-4 facial features are obscured  
//-5 Eye abnormalities  
//-6 Mouth abnormality  
//-7 The picture is empty

8

【必须】创建虚拟人：HaiSDK.CreateInstance

【Required】Create virtual person: HaiSDK.CreateInstance

9

【可选】装扮接口，HaiSDK.InstanceLoadAsset 例如 HaiSDK.InstanceLoadAsset(avatarInstID, qualityType, parts.getMUplimb());穿上衣

【Optional】 Dressing interface, HaiSDK.InstanceLoadAsset For example, HaiSDK.InstanceLoadAsset(avatarInstID, qualityType, parts.getMUplimb()); put on clothes

  

  

  

5\. 虚拟人接入万得厨2.0（NVIDIA）集成方案v1.0
===============================

5.1. 设计原则 Design Principles
---------------------------

### 5.1.1. 模块拆分原则 Module splitting principle

拆分原则：分层解耦、单一职责、高内聚低耦合、易于维护与扩展

Split principles: layered decoupling, single responsibility, high cohesion and low coupling, easy maintenance and expansion

1.  业务模块：承载具体业务需求，业务模块之间尽可能解耦。  
    Business module: carries specific business needs and is decoupled as much as possible between business modules
2.  通用模块（有的叫功能模块）：包含其他模块经常使用的代码，减少冗余，理论上通用模块不依赖任何业务侧的数据结构。  
    General modules (some are called functional modules): contain codes frequently used by other modules to reduce redundancy. In theory, general modules do not depend on any business-side data structures.

### 5.1.2. 命名规范 Naming convention

1.  命名规范（保证语义与表达的同时，尽量做到简洁，可以使用 core、common、business 等文件夹包括各个层级）

Naming convention (while ensuring semantics and expression, try to be as concise as possible, you can use core, common, business, etc. folders to include various levels)

5.2. 优势
-------

**中文文档 Chinese documentation**

**英文文档  English document**

**中文文档 Chinese documentation**

**英文文档  English document**

1.  虚拟人可以快速移植到其他app。

Virtual humans can be quickly transplanted to other apps.

*   开发减少构建时间。在开发阶段按需编译组件，一次调试中可能有一两个组件参与集成，这样编译时间就会大大降低，提高开发效率。

Develop to reduce build times. Components are compiled on demand during the development phase. One or two components may be integrated during a debugging process, which greatly reduces the compilation time and improves development efficiency.

*   代码解耦，代码责任制，组件之间的交互如果还是直接引用的话，那么组件之间根本没有做到解耦。组件间通信解耦组织直接调用，降低沟通成本。

Code decoupling, code accountability, and if the interactions between components are still directly referenced, then there is no decoupling between components at all. Inter-component communication decoupling organizes direct calls, reducing communication costs.

  

  

5.3. 技术栈 technology stack
-------------------------

*   开发语言programming language：c++
*   界面Front-end interface framework：QT

5.4. 分层架构 layered architecture
------------------------------

为了加快前端集成进度，建议HM团队去按照生态应用（主应用、子应用）的架构（也就是架构1）去集成，虚拟人团队提供声学SDK、虚拟人SDK的接入技术指导。国内虚拟人团队工作重点放在打造场景化人机交互形态上。

In order to speed up the front-end integration progress, it is recommended that the HM team integrate according to the architecture of the ecological application (main application, sub-application) (that is, architecture 1). The domestic virtual human team provides access technical guidance for the acoustic SDK and virtual human SDK. Domestic virtual human teams focus on creating scenario-based human-computer interaction.

### 5.4.1. 架构一 Architecture 1

万得厨界面应用、虚拟人应用，两者之间是独立存在的，通过交互协议双向通信。虚拟人应用作为一个生态应用接入。

Wonder Kitchen Interface Application  and Virtual human application ，The two exist independently and communicate in two directions through an interactive protocol.

The virtual human application is accessed as an ecological application

APP

服务

service

加热服务  
heating service

外部集成  
external integrated

NLP

ASR

其他服务  
other service

万得厨

虚拟人  
Virtual digtal human

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-c6f8061d-24a8-4aef-ba43-9d5f25fff9fc'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65/123651584?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/123651584/layered architecture-b16d28ddda6d9de30bd12cd604bc041fe50121ab.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123651584&owningPageId=123651584&diagramName=%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '800'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = 'kmN2Z7sw7ftHL1OGfhmL'; readerOpts.ceoName = '12、虚拟人模块对接HM团队 The virtual human module connects with the HM team'; readerOpts.attVer = '2'; readerOpts.attId = '123651788'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-06 18:55:48.559'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

1.  绿色代表虚拟人负责的部分。  
    The green color represents the part that the virtual person is responsible for.
2.  黄色代表万得厨负责的部分  
    The yellow color represents the part that Wonder Kitchen is responsible for
3.  虚拟人包含语音和形象展示。主要用来和用户交互，和万得厨进行数据传递，完成对万得厨指令的调用。  
    The virtual person includes voice and image display. It is mainly used to interact with users, transfer data with Wonder Kitchen, and complete the call of Wonder Kitchen instructions.
4.  虚拟人模块主要包含ASR（语音转文字）、TTS（文字转语音）、NLP（自然语言理解处理）和以及动画的封装。  
    The virtual human module mainly includes ASR (speech to text), TTS (text to speech), NLP (natural language understanding processing) and animation encapsulation.

### 5.4.2. 架构二 Architecture 2 

虚拟人应用，作为万得厨界面应用的一个模块，通过SDK的形式，整体集成进去

Virtual human application, as a module of WINDUK interface application，Integrated as a whole through SDK

APP

服务

service

加热服务  
heating service

外部集成  
external integrated

NLP

ASR

其他服务  
other service

万得厨

虚拟人  
Virtual digtal human

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-b2d1d86b-3967-4242-8b6c-a7b029d9a72c'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65/123651584?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/123651584/layered architecture-b16d28ddda6d9de30bd12cd604bc041fe50121ab.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123651584&owningPageId=123651584&diagramName=%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '800'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%6C%61%79%65%72%65%64%20%61%72%63%68%69%74%65%63%74%75%72%65'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = 'kmN2Z7sw7ftHL1OGfhmL'; readerOpts.ceoName = '12、虚拟人模块对接HM团队 The virtual human module connects with the HM team'; readerOpts.attVer = '2'; readerOpts.attId = '123651788'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-06 18:55:48.559'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

5.5. 通信机制 Communication mechanism
---------------------------------

### 5.5.1. 语音模块voiceservic通信 Voice module voiceservic communication

 语音模块voiceservice是一个单独的程序集，嵌入到虚拟人app中。语音模块会初始化讯飞sdk并启动录音，识别用户的声音，当用户唤醒或识别的时候，会把相关结果回调到调用方应用。  
The voice module voiceservice is a separate assembly that is embedded into the virtual human app. The voice module will initialize the iFlytek SDK and start recording, and recognize the user's voice. When the user wakes up or recognizes it, the relevant results will be called back to the calling application.

### 5.5.2. 虚拟人APP和外部APP通信方式  Communication method between virtual person APP and external APP

主要业务场景 Main business scenes:：

虚拟人-->万得厨

主要业务场景 Main business scenes:：

虚拟人-->万得厨

万得厨→虚拟人

指令instruction：

1.  虚拟人APP通过通信发送给万得厨app，万得厨app接收到指令，执行指令逻辑。  
    The virtual human app sends it to the Wonder Kitchen app via communication, and the Wonder Kitchen app receives the instructions and executes the instruction logic.

  

1.  显示虚拟人  Display virtual people
2.  动画（入场、退场等） Animation (admission, exit, etc.)
3.  tts语音播报 TTS voice broadcast

万得厨APP通过通信发送给虚拟人APP具体操作，虚拟人APP接收到操作，执行操作逻辑。

Wonder Kitchen APP sends specific operations to the virtual human APP through communication. The virtual human APP receives the operations and executes the operation logic.

  

  

  

  

5.6. 时序图  Sequence diagram
--------------------------

以开始烹饪为例：  
Take for example starting cooking

虚拟人appVirtual human app执行指令例如开始烹饪

显示虚拟人  
display virtual  
 person

加热服务Heating service

用户 User

asr语音转文字asr speech to text

结果返回  
Result returned

万得厨appWonder Kitchen app

跳转页面  
Jump page

虚拟人云服务Virtual person cloud servicenlp

显示虚拟人  
display virtual  
 person

烹饪结束  
cooking finished

开始烹饪  
Start cooking

通知显示虚拟人  
Notifications show virtual person

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-a38223e4-4426-4ba6-99ac-8175f8eab0de'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%54%69%6D%69%6E%67%20%64%69%61%67%72%61%6D/123651584?revision=1'; readerOpts.imageUrl = '' + '/download/attachments/123651584/Timing diagram.png' + '?version=1&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123651584&owningPageId=123651584&diagramName=%54%69%6D%69%6E%67%20%64%69%61%67%72%61%6D&revision=1'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%54%69%6D%69%6E%67%20%64%69%61%67%72%61%6D'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '12、虚拟人模块对接HM团队 The virtual human module connects with the HM team'; readerOpts.attVer = '1'; readerOpts.attId = '123651797'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-06 19:28:24.107'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)