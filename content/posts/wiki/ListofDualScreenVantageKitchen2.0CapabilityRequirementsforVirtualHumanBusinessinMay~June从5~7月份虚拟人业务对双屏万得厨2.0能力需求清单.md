---
author: "王宇"
title: "ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单"
date: 六月05,2024
description: "5~7月份虚拟人业务对双屏万得厨2.0能力需求清单ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June"
tags: ["5~7月份虚拟人业务对双屏万得厨2.0能力需求清单ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June"]
ShowReadingTime: "12s"
weight: 68
---
*   1[1\. 参考文档 reference document](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-参考文档referencedocument) 
*   2[2\. 交互流程图 Interaction Flowchart  （division of work）](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-交互流程图InteractionFlowchart（divisionofwork）)
*   3[3\. 能力需求详情 Details of capacity needs   （what to do）](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-能力需求详情Detailsofcapacityneeds（whattodo）)
*   4[4\. 协议框架protocol framework](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-协议框架protocolframework)
*   5[5\. 接口列表 Interface List    (what to do)](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-接口列表InterfaceList\(whattodo\))
    *   5.1[5.1. 630 version（A total of 19 instructions）630版本共19条指令](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-630version（Atotalof19instructions）630版本共19条指令)
    *   5.2[5.2. 730 version（A total of 13 instructions）730版本共13条指令](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-730version（Atotalof13instructions）730版本共13条指令)
*   6[6\. 协议参考（基于之前的RK主板的经验）Protocol reference (based on previous RK platform experience)  (how to do)](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-协议参考（基于之前的RK主板的经验）Protocolreference\(basedonpreviousRKplatformexperience\)\(howtodo\))
    *   6.1[6.1. （参考）请求：（reference）request](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-（参考）请求：（reference）request)
        *   6.1.1[6.1.1. 字段说明Field description](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-字段说明Fielddescription)
    *   6.2[6.2. （参考）响应：（reference）reponse](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-（参考）响应：（reference）reponse)
    *   6.3[6.3. （参考）接口详情 （reference）Interface Details](#ListofDualScreenVantageKitchen2.0CapabilityRequirementsforVirtualHumanBusinessinMay~June从5~7月份虚拟人业务对双屏万得厨2.0能力需求清单-（参考）接口详情（reference）InterfaceDetails)

1\. 参考文档 reference document 
============================

虚拟人产品PRD地址：[PDCA项目质量管理 (yingzi.com)](https://pdca.yingzi.com/#/documentMgtView_1716448743215?id=312&type=prd)   
Virtual human product PRD address: PDCA project quality management ([yingzi.com](http://yingzi.com)) 

2\. 交互流程图 Interaction Flowchart  （division of work）
===================================================

*   虚拟人产品包含：语音部分、形象动作。含有UI与指令执行逻辑  
    Virtual human products include: voice part, image action part。Contains UI and command execution logic
*   虚拟人模块作为整个万得厨2.0APP的一个独立的模块，使用QT框架进行开发   
    The virtual human module is an independent module of the entire Wonder Kitchen 2.0 APP and is developed using the QT framework

**职责划分 Responsibilities**  
**HM团队 HM Team**：提供语音指令 控制类接口（包含设备控制和页面控制） Provide voice command control interface(Including device control and page control)  
**虚拟人团队 Avatar Team**：调用接口完成语音交互，展示虚拟人相关的UI Call interface and  replay resposne to user according avatar action and vioce,Display UI related to virtual digital human

万得厨 APP  
wandechu 2.0 APP

User

Voice

Natural Language Text  
文本

ASR--Automatic Speech Recognition  
自动语音识别

Voice services provided by voice company  
语音公司提供语音服务

Voice SDK

provided by Avatar company  
虚拟人公司提供语义理解服务

Avatar SDK

NLP

Local Device Control Command  
本地设备控制指令

行业知识问答  
Industry knowledge Q&A

LLM  
大模型

Cloud

Request

Response

Avatar action and Voice

Voice

Natural Language Text  
文本

NLP

行业知识问答  
Industry knowledge Q&A

Voice

Natural Language Text  
文本

NLP  
自然语言理解

行业知识问答  
Industry knowledge Q&A

Avatar Module

Avatar Module

develop by Avatar team

**Responsibilities**  
**HM Team**: provideinstruction interface   
**Avatar Team**：call interface and  replay resposne to user according avatar action and vioce

**core task****s：**  
1、Sort out how many interfaces there are according to the scenario and PRD 2、According to the interface protocol，HM team develop them according to the specified time，and debug toggther  

Device

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-48025bd2-98f9-4538-a6d8-0536266f5f29'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%78%78%32/123660441?revision=5'; readerOpts.imageUrl = '' + '/download/attachments/123660441/xx2-2d8d8b3d579581afb760afa9a17583180e2f2e23.png' + '?version=5&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123660441&owningPageId=123660441&diagramName=%78%78%32&revision=5'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1200'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%78%78%32'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = 'iYp2zM6YAqKcZjtrqyJX'; readerOpts.ceoName = 'List of Dual Screen Vantage Kitchen 2.0 Capability Requirements for Virtual Human Business in May~June从 5~7月份虚拟人业务对双屏万得厨2.0能力需求清单'; readerOpts.attVer = '5'; readerOpts.attId = '123660727'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-06-05 15:28:58.981'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

3\. 能力需求详情 Details of capacity needs   （what to do）
===================================================

**630版本 ：主要实现炉端基础功能交互，**虚拟人联网绑定引导、烹饪控制（定温加热、手动加热、智能烹饪）、页面通用控制（返回上一页、返回主页）、天气查询、闲聊、FAQ  
Version 630 : Mainly realize the interaction of the basic functions of the stove, the virtual human network binding guidance, cooking control (fixed temperature heating, manual heating, intelligent cooking), general control of the page (back to the previous page, back to the home page), weather query, chat, FAQ  
  
**730版本 ：主要实现炉端内容交互，虚拟人互动性和趣味性增强，实现虚拟人**菜谱搜索、菜谱相关页面交互，人机触屏互动、A+动画资源接入，系统设置相关控制（亮度、音量、童锁等设置）  
Version 730: Mainly realize stove-end content interaction, virtual human interactivity and fun enhancement, realize virtual human recipe search, recipe-related page interaction, human-computer touch-screen interaction, A+ animation resource access, and system setting-related control (brightness, volume, child lock, etc. settings)  
  
  

序号  
serial number

产品需求  
product demand  
  

版本  
versions

涉及页面  
Pages involved

产品能力需求  
Product Capability Requirements

需协同的技术接口  
Technical interfaces to be synergized

虚拟人团队提供  
Provided by the virtual human team

开发者  
developers

**1**

通过虚拟人实现新手教程引导  
Newbie tutorial guidance through avatars

**630**

**P0**

联网引导页  
Networking guide page

![](/download/thumbnails/123660441/image2024-5-24_9-54-51.png?version=1&modificationDate=1716889961227&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_10-17-36.png?version=1&modificationDate=1716889961208&api=v2)

1.虚拟人GIF动图循环播放  
1\. Cyclic playback of virtual human GIF motion pictures

2.实时展示联网引导文案，按顺序展示不消失  
2\. Real-time display of networking guide text, in order to display does not disappear  
  

3.支持打断，点击大屏幕则停止语音播报，立即显示当前页全量对话框。  
3\. Support interruptions, click on the big screen to stop voice broadcasting, immediately display the current page of the full amount of dialog boxes.

4.支持联网引导页和绑定页面切换，切换后仅展示全量文案，无需播报和虚拟人GIF

4\. Support networking guide page and binding page switching, after switching only show full amount of text, no need to broadcast and avatar GIFs

  

**虚拟人模块：  
Virtual human applications:  
**

1、提供按语句的多组GIF动图（通过录制的虚拟人动作口型视频，转化为gif，可以通过wps会员“视频转gif”功能实现）

1, to provide a statement by the multi-group GIF motion picture (through the recorded virtual human action mouth video, converted to gif, can be realized through the wps member “video to gif” function)

2、对应文本的发音人的录音。  
2\. A recording of the speaker of the corresponding text.  
  

**注意**两个指标：gif长度、录音长度要一一对应。  
Note that the two metrics: gif length, and recording length should correspond to each other.

  

**2**

**630**

**  
P0  
**

绑定引导页面  
Binding guide page  

![](/download/thumbnails/123660441/image2024-5-24_9-59-24.png?version=1&modificationDate=1716889961215&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_10-18-30.png?version=1&modificationDate=1716889961202&api=v2)

1.虚拟人GIF动图循环播放  
1\. Cyclic playback of virtual human GIF motion pictures

2.实时展示绑定引导文案，按顺序展示不消失  
2\. Real-time display of the binding guide text, in order to display does not disappear  
  

3.支持打断，点击大屏幕则停止语音播报，立即显示当前页全量对话框。  
3\. Support interruptions, click on the big screen to stop voice broadcasting, immediately display the current page of the full amount of dialog boxes.

4.支持联网引导页和绑定页面切换，切换后仅展示全量文案，无需播报和虚拟人GIF

4\. Support networking guide page and binding page switching, after switching only show full amount of text, no need to broadcast and avatar GIFs

  

**虚拟人模块：**

1、提供按语句的多组GIF动图（通过录制的虚拟人动作口型视频，转化为gif，可以通过wps会员“视频转gif”功能实现）

1, to provide a statement by the multi-group GIF motion picture (through the recorded virtual human action mouth video, converted to gif, can be realized through the wps member “video to gif” function)

2、对应文本的发音人的录音。

2\. A recording of the speaker of the corresponding text.

**注意**两个指标：gif长度、录音长度要一一对应。

Note that the two metrics: gif length, and recording length should correspond to each other.

  

**3**

通过虚拟人实现大小屏首页控制  
Large and small screen homepage control through avatars

**730  
P1  
**

大屏首页  
Big Screen Home  
![](/download/thumbnails/123660441/image2024-5-24_10-25-37.png?version=1&modificationDate=1716889961189&api=v2)

1.获取大屏内容，实现页面元素操控

天气、菜谱等查看

1\. Get large screen content and realize page element manipulation

Weather, recipes and other views

2.语音标签展示  
2\. Voice tag display

3.对话框 实时asr、tts展示  
3\. dialog box Real-time asr, tts display

1、万得厨应用支持接入虚拟人模块接入（语音组件~~对话框、语音标签）  
1、WandeKitchen application supports access to avatar applications (voice components ~~ dialog boxes, voice labels)

  

  

**4**

**630  
P0  
**

大屏非首页-天气结果播报  
Large screen non-homepage-weather results broadcast  
![](/download/thumbnails/123660441/image2024-5-27_8-57-33.png?version=1&modificationDate=1716889960854&api=v2)

1.语音播报天气  
1\. Voice broadcasting weather

2.展示播报内容  
2\. Displaying the content of the broadcast

1、万得厨应用支持接入虚拟人模块接入  
1、Wantech Kitchen application supports access to virtual human applications

  

  

**5**

**630**

**P0**

小屏首页  
Small Screen Home![](/download/thumbnails/123660441/image2024-5-24_10-24-15.png?version=1&modificationDate=1716889961196&api=v2)

1.打开和关闭定温加热、手动加热和设置页面  
1\. Open and close the constant temperature heating, manual heating and setting pages

2.打开智能烹饪，启动智能烹饪检测  
2\. Turn on smart cooking and activate smart cooking detection

1、传参（页面标识）实现页面跳转（“定温加热”页面、“手动加热”页面、“智能烹饪”页面）  
1\. Pass the reference (page identification) to realize the page jump (“fixed temperature heating” page, “manual heating” page, “intelligent cooking” page)  

  

HM Team

**6**

1.  通过虚拟人实现人机触屏互动  
    Human-computer touch-screen interaction through avatars

**730**

**P1**

虚拟人互动-滑动虚拟人  
Virtual Man Interactive - Sliding Virtual Man  
![](/download/thumbnails/123660441/image2024-5-28_15-4-59.png?version=1&modificationDate=1716889960803&api=v2)

1.用户首次滑动虚拟人，虚拟人手势滑动动画提示用户左右滑动查看虚拟人3D形象  
1\. The first time the user clicks on the avatar, the avatar sliding animation prompts the user to swipe left and right to view the 3D image of the avatar

2.用户点击后提示手势消失  
2\. Prompt gesture disappears when user clicks on it  
  
  

  

**虚拟人模块：  
Virtual man application:  
**

1、虚拟人点击后回调  
1, virtual man click after the callback

  

**7**

**730**

**P1**

虚拟人互动-点击虚拟人  
Avatar Interactive - Click on the avatar![](/download/thumbnails/123660441/image2024-5-28_15-4-17.png?version=1&modificationDate=1716889960810&api=v2)

1.用户第二次点击虚拟人，手势点击动画提示用户点击虚拟人身体部位进行交互  
1\. The user clicks on the avatar for the second time, and the avatar click animation prompts the user to click on the avatar's body parts to interact with it.

  
2.用户点击后提示手势消失  
2\. Prompt gesture disappears when user clicks on it

  

**虚拟人模块：  
Virtual man application:  
**

1、虚拟人点击后回调  
1, virtual man click after the callback

  

**8**

**730**

**P1**

虚拟人互动-长按虚拟人切换角色引导  
Avatar Interaction - Long press the avatar to switch the character guide![](/download/thumbnails/123660441/image2024-5-28_15-4-17.png?version=1&modificationDate=1716889960810&api=v2)

![](/download/thumbnails/123660441/image2024-5-28_15-41-3.png?version=1&modificationDate=1716889960787&api=v2)

1.切换角色气泡提示，长按手势提示用户交互  
1\. Switching character bubble prompts, the first time the user long presses the dummy 2.5s

2.用户长按或点击后提示手势消失  
2\. Prompt gesture disappears when user clicks on it  
  
3.用户长按2.5s虚拟人切换弹窗上屏  
3.User long press 2.5s avatar switch pop-up window on screen

  

  

**虚拟人模块：**

1、虚拟人长按后回调

  

**9**

**730**

**P1**

语音切换虚拟人  
Voice switching avatars![](/download/thumbnails/123660441/image2024-5-28_15-34-30.png?version=1&modificationDate=1716889960795&api=v2)

1.打开虚拟人切换页面  
1\. Open the avatar switching page

2.切换具体虚拟人形象  
2\. Switch specific avatar image  
  

3.支持虚拟人形象序号选择  
3\. Support the virtual man image serial number selection

4.用户选择具体形象后加载到大屏

4\. User selects a specific image to load to the big screen

  

  
  

  

  

**虚拟人模块：  
Virtual man application:  
**

1、虚拟人长按后回调  
1, virtual man long press callback

设置按钮对应的页面，有两个选择：  
The page corresponding to the Settings button has two options:

*   一个新的页面  
    A new page
*   万得厨应用的设置页面  
    Settings page for the Vantec Kitchen app

（待定）(TBD)

  

**10**

通过虚拟人实现烹饪操控：

Cooking control through avatars:

*   智能烹饪
*   定温加热
*   手动加热

过程控制

  

*   Intelligent Cooking
*   Fixed temperature heating
*   Manual heating
*   Process control

  

  
  
  
  
  

**630**  
  
  

**P0**

智能烹饪-启动页面  
Smart Cooking- Setup Page 

![](/download/thumbnails/123660441/image2024-5-24_11-6-15.png?version=1&modificationDate=1716889961098&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_10-43-18.png?version=1&modificationDate=1716889961154&api=v2)

1.启动烹饪  
1.Start cooking

2.智能烹饪方案检测结果提醒  
Intelligent Cooking Program Test Result Alert

3.炉门开关检测结果提醒  
2\. Oven door open/close detection result reminder

4.空烧检测结果提醒  
Empty burn test result reminder

  

1、“启动烹饪”指令接口  
1、“Start Cooking” Command Interface  

2  炉门关闭状态、空烧状态、检测内容上报  
2. Report of closed furnace door status, empty burning status, and detection content  

  

**虚拟人模块：**

1、根据不同的（炉门关闭后）的检测结果，播报文本；  
1、Broadcast text according to different furnace door test results;

HM Team

**11**

**630**

**P0**

智能烹饪-多步骤展示页  
Smart Cooking - Multi-Step Showcase Page

![](/download/thumbnails/123660441/image2024-5-24_11-0-51.png?version=1&modificationDate=1716889961110&api=v2)

1.步骤切换（上一步、下一步、第N步）  
1\. Step switching (Previous, Next, Step N)

1、当前页面，第一步、下一步、第N步，UI联动控制  
1、Current page, first step, next step, nth step, UI linkage control  

2、当前屏幕页面标识查询  
2、Current screen page logo query  

  

HM Team

**12**

**630**

**P0**

定温加热页面  
Fixed-temperature heating page![](/download/thumbnails/123660441/image2024-5-24_10-37-13.png?version=1&modificationDate=1716889961164&api=v2)

1.定温加热温度设置（微热、解冻、中温、中高温、高温）  
1\. Fixed heating temperature setting (micro-heat, defrost, medium temperature, medium-high temperature, high temperature)

2.烹饪时间设置  
2.Cooking time setting

3.启动烹饪  
3.Start cooking

1、烹饪状态查询  
1、Cooking status query  

2、当前屏幕页面标识查询  
2, the current screen page identity q  

3、传参（页面标识）实现页面跳转  
3、Page jump is realized by passing parameter (page identification).  

4、“启动烹饪”指令接口  
4、“Start cooking” command interface  

**定温加热：  
Fixed temperature heating:  
**

5、烹饪模式设置与UI联动（中温、中高温、高温）  
5、Cooking mode setting and UI linkage (medium temperature, medium-high temperature, high temperature)  

6、时长设置与UI联动  
6、Duration setting and UI linkage  
  

7、“微热”、“解冻”指令接口；  
7、“Micro-heat”、"Defrost ”command interface;  

**手动加热：  
Manual heating:  
**

8、烹饪模式设置与UI联动（低火、解冻 、中火 、中高火、高火）  
8, cooking mode settings and UI linkage (low heat, defrosting, medium heat, medium-high heat, high heat)  

9、时长设置与UI联动  
9、Duration setting and UI linkage.  

  

HM Team

**13**

**630**

**P0**

手动加热页面  
Manual heating page

![](/download/thumbnails/123660441/image2024-5-24_10-40-45.png?version=1&modificationDate=1716889961159&api=v2)

1.手动加热火力设置（微热、解冻、中火、中高火、高火）  
1\. Manual heating heat setting (micro-heat, defrost, medium heat, medium-high heat, high heat)

2.烹饪时间设置  
2.Cooking time setting

3.启动烹饪

3.Start cooking

  

  

**14**

**630**

**P0**

烹饪中页面  
Pages in Cooking

![](/download/thumbnails/123660441/image2024-5-24_11-19-11.png?version=1&modificationDate=1716889961080&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_11-19-45.png?version=1&modificationDate=1716889961075&api=v2)

1.暂停烹饪  
1.Pause cooking

2.终止烹饪  
2.Terminate cooking

3.烹饪剩余时长查询  
3.Check the remaining cooking time

1、“暂停烹饪”、“终止烹饪”、“烹饪剩余时长查询”，三个指令接口  
1、“Pause Cooking”、“Terminate Cooking”、“Remaining Cooking Time Query”，three command interfaces.

  

HM Team

**15**

**630**

**P0**

暂停烹饪  
Pause Cooking

![](/download/thumbnails/123660441/image2024-5-24_11-22-34.png?version=1&modificationDate=1716889961063&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_11-21-22.png?version=1&modificationDate=1716889961069&api=v2)

1.继续烹饪  
1.Continue cooking

2.终止烹饪  
2.Stop cooking

3.烹饪剩余时长查询

3.Check the remaining cooking time

  

  

同序号17

“继续烹饪“指令  
Same as serial number 17.

  

HM Team

**16**

**630**

**P0**

空烧检测  
Empty burning test

![](/download/thumbnails/123660441/image2024-5-24_11-24-11.png?version=1&modificationDate=1716889961052&api=v2)

![](/download/thumbnails/123660441/image2024-5-24_11-23-50.png?version=1&modificationDate=1716889961058&api=v2)

1.空烧提示大屏展示，提示用户小屏点击确认  
1\. Empty burn prompts large screen display, prompting the user to click on the small screen to confirm

1、空烧检测 能力接口  
1\. Empty burn detection Capability interface

  

HM Team

**17**

通过虚拟人实现：  
Realized through avatars:

*   搜索食谱、推荐食谱  
    Searching for recipes, recommending recipes
*   选择某个食谱  
    Selecting a recipe
*   操作食谱页面  
    Manipulate the recipe page
*   加载烹饪方案  
    Loading cooking programs

  
  

**730**

**P1**

食谱搜索结果页  
Recipe Search Results Page  

![](/download/thumbnails/123660441/image2024-5-24_11-25-43.png?version=1&modificationDate=1716889961045&api=v2)

1.展示搜索结果列表（列表、空页面）  
1\. Display a list of search results (list, empty page)

2.选择菜谱序号  
2\. Select the recipe number

3.打开食谱详情页  
3\. Open the recipe details page  
  

  

  

  

1、大屏上展示搜索结构弹框  
1、Display the search structure pop-up box on the big screen

**虚拟人模块：  
Virtual Man Application:  
**

1、选择序号 

1\. Select serial number

  

HM Team

**18**

**730**

**P1**

食谱推荐页面  
Recipe Recommendation Page

![](/download/thumbnails/123660441/image2024-5-24_11-25-43.png?version=1&modificationDate=1716889961045&api=v2)

1.展示推荐结果列表（列表、空页面）  
1\. Display the list of recommended results (list, empty page)

2.选择菜谱序号  
2\. Select the recipe number

3.打开食谱搜索界面  
3\. Open the recipe search interface

  

  

HM Team

**19**

**730**

**P1**

食谱详情页  
Recipe details page  
![](/download/thumbnails/123660441/image2024-5-24_11-27-42.png?version=1&modificationDate=1716889961039&api=v2)  

1.页面滑动  
1.Page slide

2.步骤切换（上一步、下一步、第N部）  
2\. Step switching (Previous, Next, Part N)

3.视频播放、暂停控制  
3\. Video play, pause control

4.查看食材、查看步骤  
4.View ingredients、View steps

5.加载烹饪方案  
5.Load cooking program

  

  

1、通过锚点值进行页面滚动  
1、Page scrolling by anchor value

2、（当前页面）视频播放、暂停

2、(current page) video play, pause

3、上滑页面、下滑页面  
3, slide up the page, slide down the page

4、播放页面文字（暂停、停止）  
4, play page text (pause, stop)

6、查看步骤、查看食材  
6、View steps, view ingredients

  

HM Team

**20**

返回上一页、主页  
Back to previous page, home page  

**630**

**P0**

任意页面  
Any page

  

1、返回上一页

1、Return to previous page

  
2、返回主页  
2、Return to home page  

  

HM Team

**21**

熄屏、亮屏  
Screen off/on

**730**

**  
P1  
**

任意页面  
Any page

  

1、熄屏/亮屏  
1、Screen off/on  

  

HM Team

  
**22**  
  
  

**  
通过虚拟人针对系统设置进行控制  
Control of system settings via avatars  
**  
  
  
  
  
  
  
  

**730**

**  
P1  
**

设置页  
settings page![](/download/thumbnails/123660441/image2024-5-28_16-14-26.png?version=1&modificationDate=1716889960782&api=v2)

1.打开设置页  
Open the settings page

  

  

HM Team

**23**

**730**

**P1**

网络设置页  
Network settings page![](/download/thumbnails/123660441/image2024-5-24_13-48-34.png?version=1&modificationDate=1716889960928&api=v2)

1.打开网络设置页  
1\. Open the network settings page

1、传参（页面标识）实现页面跳转（网络设置页面）  
1、Pass the parameter (page identification) to realize the page jump (network settings page)  

  

HM Team

**24**

**730**

**P1**

音量设置  
Volume settings![](/download/thumbnails/123660441/image2024-5-28_16-15-57.png?version=1&modificationDate=1716889960776&api=v2)  
  

1.音量调节结果播报和文本展示  
1\. Volume adjustment result broadcast and text display

1、音量调整  
Volume Adjustment

1.  按步长调整（调大、调小）  
    Adjust by step (turn up, turn down)
2.  按具体值调整（调整到x%音量）  
    
    Adjustment by specific value (adjust to x% volume)
    

  

HM Team

**25**

**730**

**P1**

亮度设置  
brightness setting![](/download/thumbnails/123660441/image2024-5-28_16-17-0.png?version=1&modificationDate=1716889960768&api=v2)  
  

1.亮度调节结果播报和文本展示  
1\. Brightness adjustment result broadcast and text display

1、亮度调整  
1、Brightness adjustment

1.  按步长调整（调大、调小）  
    Adjust by step (turn up, turn down)
2.  按具体值调整（调整到x%亮度）  
    Adjust by specific value (adjust to x% brightness)

  

HM Team

**26**

**730**

**P1**

休眠  
hibernation

**![](/download/thumbnails/123660441/image2024-5-24_13-51-14.png?version=1&modificationDate=1716889960894&api=v2)**

1.参数设置不完整页面跳转

1\. Incomplete parameter settings page jumps

2.参数设置完整不跳转，自动设置  
2\. Parameter setting is complete without jumping, automatic setting

1、休眠时间设置  
Sleep time setting

**虚拟人模块：**

VM application:

1、非页面上时间，就近取值

1\. off-page time, near value

HM Team

**27**

**730**

**P1**

设备信息页  
Device Information Page

![](/download/thumbnails/123660441/image2024-5-24_13-53-38.png?version=1&modificationDate=1716889960869&api=v2)

1.跳转设备信息页  
1\. Jump to the device information page  

  

1、传参（页面标识）实现页面跳转（“设备信息”页面）  
1、Pass the parameter (page identification) to realize the page jump (“equipment information” page)  

  

  

HM Team

**28**

**730**

**P1**

童锁  
Child lock  
![](/download/thumbnails/123660441/image2024-5-28_16-24-7.png?version=1&modificationDate=1716889960760&api=v2)

1.童锁调节结果播报和文本展示  
1\. Child lock adjustment result broadcast and text display  
  
  

1、启用儿童锁，并跳转页面；

1、Enable child lock and jump the page;

2、解除童锁；  
2、Release the child lock;

3、判断童锁状态（是否开启、解锁）  
3、To determine the state of child lock (whether to open, unlock)  

  

HM Team

**29**

**730**

**P1**

关门检测  
Door closure detection   
![](/download/thumbnails/123660441/image2024-5-28_16-24-59.png?version=1&modificationDate=1716889960349&api=v2)

1.关门检测调节结果播报和文本展示  
1\. Shutdown detection and adjustment results broadcast and text display

1、关门检测 能力接口  
1\. Shutdown detection Capability interface

  

HM Team

**30**

**730**

**P1**

虚拟人说明书查看  
Virtual Man Manual View

![](/download/thumbnails/123660441/image2024-5-28_16-39-8.png?version=1&modificationDate=1716889960309&api=v2)

1.播报回复同时展示虚拟人说明书  
1\. Broadcast replies while displaying dummy instructions

  

  

HM Team

**31**

**730**

**P1**

语言切换  
Language switching  
![image2024-5-29_17-5-52.png](https://wiki.yingzi.com/download/thumbnails/123658843/image2024-5-29_17-5-52.png?version=1&modificationDate=1716973552815&api=v2)

1.跳转语言选择页面  
1\. Jump to language selection page

  

  

HM Team

**32**

设备信息  
Equipment Information

**630**

**P0**

设备信息  
Equipment Information

1、页面标识查询  
1、Page identification query  

2、传参进行页面跳转  
2、Page jump by passing parameters  

3、当前机型、MAC地址、用户信息（用户名、token等）查询  

3、Current model, MAC address, user information (user name, token, etc.) query

  

  

HM Team

4\. 协议框架protocol framework
==========================

虚拟人模块作为客户端，设备模块作为服务端，采用zmq进程间通信方式。

The virtual human module serves as the client and the device module serves as the server, using zmq inter-process communication.

参考案例：

Reference case

1.  [DW222设备与算法ZMQ通信协议](/pages/viewpage.action?pageId=123635558)
2.  [（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）The virtual human instruction module calls the furnace control interface (based on RK3568 chip)](/pages/viewpage.action?pageId=109729904) 【主要参考】【Main references】

5\. 接口列表 Interface List    (what to do)
=======================================

5.1. **630 version（A total of 19 instructions）630版本共19条指令**
-----------------------------------------------------------

**630 version（A total of 19 instructions）**

版本version

能力分类Interface Ability Classify

（接口）能力详情 Interface Ability detail

备注Remark

630

虚拟人模块接入到双屏万得厨2.0应用

The virtual human module is connected to the dual-screen WonderChef 2.0 application

1、提供git仓库，划分好目录结构，avatar作为一个独立模块，授权开发者权限

1\. Provide a git repository, divide the directory structure, use avatar as an independent module, and enable authorized developer permissions

添加开发者权限给到虚拟人团队的开发者

Add developer permissions to developers in the virtual human team

630

基础能力  
Basic abilities

1、通过传参实现页面直接跳转  
1\. Direct page jump through parameter passing

2、当前页面标识查询  
2、Query the current page identification

3、当前机型、Mac地址、用户信息（用户名、token、头像等）查询  
3、Query the current device model, Mac address, user information (user name, token, avatar, etc.)

4、返回上一页、返回主页  
4\. Return to the previous page, return to the home page

5、熄屏、亮屏  
5、Screen off, screen on

  

630

烹饪相关  
Cooking related

**烹饪过程操作控制类：  
Cooking process operation control category:  
**

6、“启动烹饪”、7、“暂停烹饪”、8、“继续烹饪”、9、“终止烹饪”、10、“微热”、11、“解冻”  
6、"Start cooking",7、 "Pause cooking",8、 "Continue cooking",9、 "Stop cooking",10、"Micro heat",11、 "Defrost",  

**烹饪过程查询类：  
Cooking process query category:  
**

12、“烹饪剩余时长查询”  
12、“Query remaining cooking time”  

**烹饪参数设置类：  
Cooking parameter setting category:  
**

13、定温加热：烹饪模式设置与UI联动（中温、中高温、高温）、

13、Constant temperature heating: cooking mode setting is linked with UI (medium temperature, medium-high temperature, high temperature),

14、时长设置与UI联动  

14、Duration setting is linked with UI

15、手动加热：烹饪模式设置与UI联动（低火、解冻 、中火 、中高火、高火）

15、Manual heating: cooking mode settings are linked with the UI (low heat, defrost, medium heat, medium high heat, high heat),

16、时长设置与UI联动

16、Duration setting and UI linkage

  

630

设备状态上报  
Device status reporting

17、空烧检测结果上报  
17、Reporting of empty burn test results

18、设备开关门状态检测结果上报  
18. Reporting of equipment door opening and closing status detection results

19、检测结果上报（智能烹饪）  
19\. Reporting of test results (intelligent cooking)

  

630

补充 supplement

20、获取窗口ID（首页窗口ID）  
20、Get window ID（Home Page window ID）

  

5.2. **730 version（A total of 13 instructions）730版本共13条指令**
-----------------------------------------------------------

**730 version（A total of 13 instructions）**

版本version

能力分类Interface Ability Classify

（接口）能力详情 Interface Ability detail

备注Remark

730

食谱搜索结果页  
Recipe search results page

1、接口调用实现：大屏上展示/隐藏搜索结构弹框  
1\. Interface call implementation: display/hide the search structure pop-up box on the large screen

  

730

食谱详情页  
Recipe details page

1.页面滑动（上滑一点、下滑一点）  
1.Page slide（(Slide up a little, slide down a little)）

2.步骤切换（上一步、下一步、第N步）  
2\. Step switching (Previous, Next, Step N)

3.视频播放、暂停控制  
3\. Video play, pause control

4.查看食材、查看步骤  
4.View ingredients、View Steps

5.加载烹饪方案  
5.Load cooking program

  

730

系统设置类  
System Settings

  

6、音量调整，按步长调整（调大、调小）  
6、Volume Adjustment，Adjust by step (turn up, turn down)

7、按具体值调整（调整到x%音量）  
7、Volume Adjustment，Adjustment by specific value (adjust to x% volume)

8、亮度调整，按步长调整（调大、调小）  
8、Brightness adjustment，Adjust by step (turn up, turn down)

9、亮度调整，按具体值调整（调整到x%亮度）  
9、Brightness adjustment，Adjust by specific value (adjust to x% brightness)

10、休眠时间设置  
10、Sleep time setting

11、启用儿童锁，并跳转页面；  
11、Enable child lock and jump the page;

12、判断童锁状态（是否开启、解锁）  
12、To determine the state of child lock (whether to open, unlock)

  

  

  

  

  

  

6\. 协议参考（基于之前的RK主板的经验）Protocol reference (based on previous RK platform experience)  (how to do)
================================================================================================

本章节表达的内容，是基于之前做过的基于RK3568主板平台的内容，虚拟人模块与万得厨2.0之间的通信协议，可以作为目前最新的基于英伟达平台进行研发的参考案例。基于最新的会有一些细节调整，以最新的接口协议为准。  
The content expressed in this chapter is based on the previous content based on the RK3568 motherboard platform. The communication protocol between the virtual human module and Wandechu 2.0 can be used as the latest reference case for research and development based on the NVIDIA platform. There will be some details adjusted based on the latest, and the latest interface protocol shall prevail.

6.1. （参考）请求：（reference）request
------------------------------

请求参数协议格式如下:  
The format of the request parameter protocol is as follows

[?]()

`{`

    `"msgType"``:` `"oven.action.execute"``,`

    `"payload"``: {`

        `"data"``: {`

            `"actionCode"``:` `"get_volume_info"``,`

            `"msgId"``:` `"AQSrThoDZRUA5egu"``,`

            `"pid"``:` `"SYSTEM-010"``,`

            `"inputParams"``: {},`

            `"source"``:` `"avatar"``,`

            `"time"``:` `1700703060027`

        `}`

    `}`

`}`

  

### 6.1.1. 字段说明  
Field description

msgType 表示当前请求类型，（必须）

Indicates the current request type (mandatory)

1.   oven.action.execute表示（动作），Indicates (action).
2.   oven.property.set 表示属性 Indicates attribute
3.   oven.event.trigger 表示事件。Indicates event

字段 field

是否必须  
required?

描述description

备注remark

字段 field

是否必须  
required?

描述description

备注remark

pid

yes

动作标识（请求类型是动作时才有，其他无）

  

actionCode

yes

动作标识（请求类型是动作时才有，其他无）Indicates which function is currently being used

  

time

yes

当前时间戳（必须）Current timestamp

  

msgId

yes

随机16字符串（必须）Random 16-character string

  

inputParams

no

参数列表（可有可无）Parameter lis

  

  

  

  

  

其他参数请求固定。Other parameters requested are fixed

6.2. （参考）响应：（reference）reponse
------------------------------

返回数据格式如下。The format of the returned data is as follows:

[?](#)

`{`

    `"msgType"``:` `"oven.action.execute.response"``,`

    `"payload"``: {`

        `"code"``:` `0``,`

        `"data"``: {`

            `"actionCode"``:` `"get_volume_info"``,`

            `"msgId"``:` `"AQSrThoDZRUA5egu"``,`

            `"pid"``:` `"SYSTEM-010"``,`

            `"outputParams"``: {},`

            `"source"``:` `"avatar"``,`

            `"time"``:` `1700703060027`

        `}`

    `}`

`}`

  

code：0 成功，非0 异常 code: 0 for success, non-zero for exception

字段说明：Field description:

**msgType：**

1.  **oven.action.execute.response 动作回复 Action reply**
2.  **oven.property.report.response 属性回复 Attribute reply**

如果是动作类型，返回数据在outputParams中。

If it is of action type, the returned data is in the outputParams

因为每次请求参数中，参数格式参照上面。下面列出的请求参数中，只显示了请求中有不一样的参数字段。同一样的参数不重复列举(如msgId,time等字段)

Because every request parameter follows the format mentioned above. The following list of request parameters only displays the parameter fields that are different from the ones in the request. The same parameters are not repeatedly listed (e.g. msgId, time, etc.)

6.3. （参考）接口详情 （reference）Interface Details
------------------------------------------

一级功能  
Primary Function

功能点  
Feature Point

类型（动作、属性、事件）  
Type (Action, Attribute, Event)

标识符  
Identifier

 请求参数  
Request Parameters

返回响应  
Return Response

一级功能  
Primary Function

功能点  
Feature Point

类型（动作、属性、事件）  
Type (Action, Attribute, Event)

标识符  
Identifier

 请求参数  
Request Parameters

返回响应  
Return Response

音量控制能力  
Volume Control Capability  
SYSTEM-010

获取音量信息  
Get Volume Information

动作  
Action

get\_volume\_info

"msgType":"oven.action.execute",

"actionCode":"get\_volume\_info",

"pid":"SYSTEM-010",

  

{"msgType":"oven.action.execute.response",

"payload":{"code":0,"data":{"actionCode":"get\_volume\_info",

"msgId":"AQSrThoDZRUA5egu","pid":"SYSTEM-010",

"source":"avatar","time":1700703060027,"outputParams":{"volume\_val":"xxx",}}

  

音量调节  
Adjust Volume

属性  
Attribute

volume\_val

"inputParams":{“volume\_val":xxx}

{"msgType":"oven.property.set.response",

"payload":{"code":0,"}}

  

增大音量  
Increase Volume

动作  
Action

volume\_up

"msgType":"oven.action.execute",

"actionCode":"volume\_up",

"pid":"SYSTEM-010",

  

outputParams":{"volume\_val":"xxx",}

  

降低音量  
Decrease Volume

动作  
action

volume\_down

"actionCode":"volume\_down",

"outputParams":{"volume\_val":"xxx",}}

  

调节音量至最大  
Set Volume to Maximum

动作  
action

volume\_max

"actionCode":"volume\_max",

"outputParams":{"volume\_val":"xxx",}}

  

静音调节  
Mute Adjustment

属性  
Attribute

mute\_state

"inputParams":{“mute\_state":xxx}//0:关 1:开

{"msgType":"oven.property.set.response",

"payload":{"code":0,"}}

显示控制能力  
Display Control Capability  
SYSTEM-020

获取屏幕显示信息  
Get Screen Display Information

动作  
action

get\_screen\_info

"msgType":"oven.action.execute",

"actionCode":"get\_screen\_info",

"pid":"SYSTEM-020",

"outputParams":{"screen\_bright\_val":"xxx",

"screen\_off\_timeout":xxx，"screen\_state:"xxx}}

参数说明：

1、屏幕亮度值  
2、屏幕休眠时长  
3、亮灭屏状态

Parameter Description:

1.  Screen brightness value
2.  Screen sleep duration
3.  Screen on/off state

  

屏幕亮度调节  
Adjust Screen Brightness

属性  
Attribute

screen\_bright\_val

"inputParams":{“screen\_bright\_val":xxx}

  

  

设置屏幕休眠时间  
Set Screen Sleep Time

属性  
Attribute

screen\_off\_timeout

"inputParams":{“screen\_off\_timeout":xxx}

  

  

亮灭屏控制  
Screen On/Off Control

属性  
Attribute

screen\_state

"inputParams":{“screen\_state":xxx}

  

  

增大亮度  
Increase Brightness

动作  
action

screen\_bright\_up

"actionCode":"screen\_bright\_up",

"outputParams":{"screen\_bright\_val":"xxx",}

  

降低亮度  
Decrease Brightness

动作  
action

screen\_bright\_down

"actionCode":"screen\_bright\_down",

"outputParams":{"screen\_bright\_val":"xxx",}

  

调节亮度至最大  
Adjust Brightness to Maximum

动作  
action

screen\_bright\_max

"actionCode":"screen\_bright\_max",

"outputParams":{"screen\_bright\_val":"xxx",}

  

调节亮度至最小  
Adjust Brightness to Minimum

动作  
action

screen\_bright\_min

"actionCode":"screen\_bright\_min",

"outputParams":{"screen\_bright\_val":"xxx",}

儿童锁能力  
Child Lock Capability  
SYSTEM-030

童锁开关设置  
Child Lock Switch Setting

  

child\_lock\_switch\_state

  

  

  

  

  

  

  

  

主题控制能力  
Theme control capability  
SYSTEM-040

当前系统设置主题信息  
Current system setting theme information

动作  
action

get\_theme\_info

  

"outputParams":{"theme\_val":"xxx",

“avatar\_character”:"xxx","xiaowan\_show\_state":}

参数说明

theme\_val 主题："default",默认，"avatar"带虚拟人

avatar\_character：虚拟人。"wandemei",万的美，"wandean"：万得安

avatar\_show\_state：虚拟人显示开关

  

虚拟人显示角色  
Virtual Human Display Role

属性  
Attribute

avatar\_character

"inputParams":{“avatar\_character":xxx}

参数说明："wandemei",万的美

"wandean"：万得安

  

  

小万精灵显示开关  
Xiaowen Assistant Display Switch

属性  
Attribute

avatar\_show\_state

"inputParams":{“avatar\_show\_state":xxx}

0:关 1：开

  

系统升级能力  
System Upgrade Capability  
SYSTEM-050

获取当前系统固件版本  
Retrieve the current system firmware version

属性  
Attribute

system\_firmware\_info

  

  

页面操作能力  
Page Operation Capability  
SYSTEM-060

返回上一页  
Return to the previous page

动作  
action

back\_previous\_page

  

  

  

回到首页  
Go back to the homepage

动作  
action

back\_home\_page

  

  

  

设备当前页面  
Current Page of the Device

属性  
Attribute

curr\_page

  

  

  

选择序号  
Select an ID/Number

动作  
action

select\_list\_id

"inputParams":{“select\_list\_id":xxx}

  

  

进入对应烹饪设置页面  
Enter the corresponding cooking setting page

动作  
action

enter\_cooking\_settings\_page

  

1、one\_key\_cook\_set  
2、smart\_cook\_set  
3、recipe\_detail  
4、diy\_cook\_set  
5、scan\_result

字段说明

1、不需要参数（一键烹饪设置）  
2、不需要参数（智能烹饪设置）  
3、\[食谱id\]\[recipeId\]\[long\]\[不可空\]、\[标题\]\[title\]\[string\]\[可空\]（食谱详情）  
4、不需要参数（DIY烹饪设置）  
5、\[方案码\]\[schemeCode\]\[string\]\[不可空\]（商品详情页（扫码结果页））

Field Explanation

1.  No parameter required (One-click cooking setting)
2.  No parameter required (Smart cooking setting)
3.  \[Recipe ID\]\[recipeId\]\[long\]\[mandatory\], \[Title\]\[title\]\[string\]\[optional\] (Recipe details)
4.  No parameter required (DIY cooking setting)
5.  \[Scheme Code\]\[schemeCode\]\[string\]\[mandatory\] (Product details page (scan result page))

  

设备信息提供能力  
Device Information Provision Capability  
SYSTEM-070

设备信息  
Device Information

属性  
Attribute

device\_info

  

  

  

用户信息  
User Information

属性  
Attribute

user\_info

  

  

  

网络环境  
Network Environment

属性  
Attribute

network\_env

  

1、开发环境(dev)  
2、测试环境(debug)  
3、预生产环境(stage)  
4、生产环境(pro)  

1.  Development environment (dev)
2.  Testing environment (debug)
3.  Staging environment (stage)
4.  Production environment (pro)

烹饪控制能力  
Cooking Control Capability  
COOKING-010

烹饪状态  
Cooking Status

属性  
Attribute

cooking\_state

  

1、"standby"  
2、"start"  
3、"pause"  
4、"resume"  
5、"stop"

  

烹饪启停控制  
Cooking Start/Stop Control

动作  
action

cooking\_control

  

  

  

查询烹饪剩余时长  
Query the remaining cooking time

动作  
action

cooking\_remain\_time

  

  

  

腔内空载状态  
Empty cavity status

属性  
Attribute

non\_load\_state

  

  

一键烹饪设置页面控制  
One-key cooking setting page control  
COOKING-020

烹饪模式选择  
Cooking mode selection

动作  
action

one\_key\_cooking\_mode\_ctrl

  

"inputParams":{“cooking\_mode":xxx}

枚举型:  
低火：low\_fire  
解冻：unfreeze  
中火：med\_fire  
中高火：med\_high\_fire  
高火：high\_fire  
Enumerated type:  
Low heat: low\_fire  
Defrost: unfreeze  
Medium heat: med\_fire  
Medium-high heat: med\_high\_fire  
High heat: high\_fire

  

  

烹饪时长控制  
Cooking duration control

动作  
Action

one\_key\_cooking\_duration\_ctrl

"cooking\_duration":{“cooking\_mode":xxx}

  

智能烹饪设置页面控制  
Smart cooking setting page control  
COOKING-030

智能烹饪参数设置  
Smart cooking parameters setting

动作  
Action

smart\_cooking\_param\_ctrl

"inputParams":{“cooking\_param":xxx}

枚举型:  
1、中温:med  
2、中高温:med\_high  
3、高温:high

Enum Type:  
1、med  
2、med\_high  
3、high

  

  

智能烹饪时长设置  
Smart cooking duration setting

动作  
Action

smart\_cooking\_duration\_ctrl

"inputParams":{“cooking\_duration":xxx}

  

DIY烹饪设置页面控制能力  
Ability to control DIY cooking settings page  
COOKING-040

创建DIY烹饪  
Create DIY cooking

动作  
Action

  

  

  

  

增加烹饪阶段  
Add cooking stage

动作  
Action

add\_cooking\_stage

"inputParams":{“power":xxx，"duration":xxx}

  

  

删除指定阶段  
Delete specified stage

动作  
Action

remove\_cooking\_stage

"inputParams":{“index":xxx}

  

智能烹饪控制  
Smart cooking control  
COOKING-050

启动智能加热  
Start smart heating

动作  
Action

smart\_cooking\_control

"inputParams":{“cooking\_mode":xxx}

枚举型:  
1、解冻:unfreeze  
2、复热:reheat  
3、微热:mild

Enum-type:

1.  :unfreeze
2.  reheat
3.  mild

  

食谱详情页面控制能力  
Recipe details page control capability  
RECIPES-010

食谱视频播放控制  
Recipe video playback control

动作  
Action

recipe\_video\_control

"inputParams":{“play\_state":xxx}

枚举型:  
1、"播放"："play"  
2、"暂停"："pause"  
3、"重播"："replay"  
Enum-type:  
1、"play"  
2、"pause"  
3、"replay"

  

  

查看食材信息  
View ingredient information

动作  
Action

view\_recipe\_cooking\_food\_info

  

  

  

查看烹饪步骤  
View cooking steps

动作  
Action

view\_recipe\_cooking\_step\_info

"inputParams":{“cooking\_step":xxx}

  

  

上一步做法  
Previous step

动作  
Action

view\_recipe\_cooking\_previous\_step

  

  

  

下一步做法  
Next step

动作  
Action

view\_recipe\_cooking\_next\_step

  

  

  

页面滑动控制  
Page slide control

动作  
Action

view\_recipe\_cooking\_page\_operate

"inputParams":{“operate\_param":xxx}

枚举型:  
1、上滑：slide\_up  
2、下滑：slide\_down  
3、回到顶部：slide\_top  
4、滑到底部：slide\_bottom

Enum-type:

1.  slide\_up
2.  slide\_down
3.  slide\_top
4.   slide\_bottom

  

食谱列表页面控制能力  
RECIPES-040

展示下一页  
Show next page

动作  
Action

page\_set\_next

  

  

  

回到上一页  
Return to previous page

动作  
Action

page\_set\_previous

  

  

  

前往指定页  
Navigate to specified page.

动作  
Action

page\_set\_id

"inputParams":{“page\_id\_control":xxx}

  

首页显示虚拟人播放文本  
Display virtual person playback text on the homepage  
SYSTEM-080

虚拟人播报时显示文本  
Display text when virtual person broadcasts

动作  
Action

show\_play\_text

"inputParams":{“text":xxx}

  

  

虚拟人播报时 的状态  
Status of virtual person playback

动作  
Action

show\_play\_state

"inputParams":{“play\_state":xxx}

（1监听状态，2 播报完成状态）  
(1. Listening status, 2. Playback completion status)

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)