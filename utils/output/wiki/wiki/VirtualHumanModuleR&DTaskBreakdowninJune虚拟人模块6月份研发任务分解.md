---
author: "王宇"
title: "VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解"
date: 八月06,2024
description: "2024~~六月份"
tags: ["2024~~六月份"]
ShowReadingTime: "12s"
weight: 78
---
*   1[1\. 月度任务项](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-月度任务项)
    *   1.1[1.1. 周任务](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-周任务)
        *   1.1.1[1.1.1. 第一周](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-第一周)
    *   1.2[1.2. 截至6.13任务总结](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-截至6.13任务总结)
*   2[2\. 任务进度](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-任务进度)
    *   2.1[2.1. 接口联调进度 Interface debugging progress](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-接口联调进度Interfacedebuggingprogress)
    *   2.2[2.2. 虚拟人应用非联调任务](#VirtualHumanModuleR&DTaskBreakdowninJune虚拟人模块6月份研发任务分解-虚拟人应用非联调任务)

1\. 月度任务项
=========

月度任务项

时间

周任务完成详情

 **基于英伟达平台双屏万得厨2.0，完成6月份需求研发上线，涵盖核心控制指令，共19条（过程中会有少量变化），达成项目630目标。**

  

**Based on the NVIDIA platform dual-screen Wonder Kitchen 2.0, the required research and development in June was completed and launched, covering a total of 19 core control instructions (there will be a few changes in the process), achieving the project goal of 630.**

第一周  
6.3~6.9

Week 1  
6.3~6.9

1.  开展基于Azure云平台部署架构下，虚拟人模块接入到整体万得厨应用，代码仓分配、整体研发流程串起来； 2024-6-5   
    Based on the Azure cloud platform deployment architecture, the virtual human module is connected to the overall Wonder Kitchen application, and the code warehouse allocation and overall R&D process are linked together;
2.  烹饪指令开始烹饪、暂停烹饪Mock联调完成，测试接口协议框架通； 2024-6-6   
    Cooking instructions start cooking, pause cooking Mock joint debugging is completed, and the test interface protocol framework is passed;
3.  和HM团队确定整体接口文档第一个版本的文档；   
    2024-6-6   
    Determine the first version of the overall interface document with the HM team;

第二周  
6.10~6.16

Week 2  
June 10~June 16

1.  推进完成指令开始烹饪、暂停烹饪真机运行成功； 2024-6-12  
    Advance the completion command to start cooking and pause the cooking. The real machine runs successfully;
2.  跳转页面、获取当前页面信息、设备信息、音量控制、亮度控制、息屏、亮屏，这7个指令调试完毕 2024-6-16   
    Jump to page, get current page information, device information, volume control, brightness control, screen off, screen on, these 7 commands have been debugged

第三周  
6.17~6.23

Week 3  
June 17~June 23

1.  完成 烹饪过程操作控制类指令调试（需要HM团队先完成UI界面研发与内部烹饪控制逻辑通畅）2024-6-18  
    Complete the debugging of cooking process operation control instructions (HM team needs to complete UI interface development and internal cooking control logic first) 

第四周  
6.23~6.30

Week 4  
June 23~June 30

1.  整体虚拟人6月份需求测试、修复缺陷。
2.  查漏补缺、提前完成7月份产品需求评审与研发 2024-6-30   
    Overall virtual human demand testing in June, defect repair.  
    Find out the gaps and complete the product demand review and development in July ahead of schedule

1.1. 周任务
--------

### 1.1.1. 第一周

  

  

备注

周一

  

  

周二

  

  

周三

  

  

周四

  

  

周五

  

  

周六

  

  

1.2. 截至6.13任务总结
---------------

任务项

  

备注

任务项

  

备注

已规划任务项

*   开展基于Azure云平台部署架构下，虚拟人模块接入到整体万得厨应用，代码仓分配、整体研发流程串起来
*   指令协议文档确定
*   指令协议框架联调执行方法确定
*   指令框架demo联调通过
*   基于Azure云架构，avatar渲染成功
*   基于Azure云架构，声学流程软件、硬件打通
*   按照业务产品需求，联调接口，实现交互，共计30条指令

虚拟人云端/本地应用编译、部署总结文档：[编译&部署&设备环境安装](/pages/createpage.action?spaceKey=VDP&title=%E7%BC%96%E8%AF%91%26%E9%83%A8%E7%BD%B2%26%E8%AE%BE%E5%A4%87%E7%8E%AF%E5%A2%83%E5%AE%89%E8%A3%85&linkCreation=true&fromPageId=123662482)

指令协议文档：[0612\_Avatar\_Module\_Message.xlsx](/download/attachments/123662482/0612_Avatar_Module_Message.xlsx?version=1&modificationDate=1718260913039&api=v2)

指令框架调用方法见文档：[Azure IoT Edge](/display/Devopsfile/Azure+IoT+Edge)     2.1

基于Azure云架构，avatar渲染成功，见视频：[Avatar\_20240613 .mp4](/download/attachments/123662482/VID_20240613_153614.mp4?version=1&modificationDate=1718264330451&api=v2)

基于Azure云架构，声学流程软件、硬件打通：

指令联调：调通2条信息收发（其他28条指令的代码实现、执行，依赖HM团队进度）

额外任务项 

*   基于Azure云，编译、打包、部署，流程打通
*   基于Nvidia平台，开启GPU加速
*   Azure云 IOT-Edge模块学习、熟悉使用

学习文档：

未解决任务项

  

  

接下来规划

已有任务前置：虚拟人点击互动模块

  

2\. 任务进度
========

合并了6月、7月既定任务。

HM团队给的接口联调时间参考：The interface joint debugging time reference given by the HM team:

![](/download/attachments/123662482/image2024-6-18_23-41-37.png?version=1&modificationDate=1718725297673&api=v2)

文件地址：file location：[Schedule for Avatar Integration - 15062024.xlsx](/download/attachments/123662482/Schedule%20for%20Avatar%20Integration%20-%2015062024.xlsx?version=1&modificationDate=1718762388061&api=v2)

2.1. 接口联调进度 Interface debugging progress
----------------------------------------

序号  
Order

接口  
Interface Task

是否完成

Is it complete

完成时间complete time

备注

Remark

注意事项

日志

log

序号  
Order

接口  
Interface Task

是否完成

Is it complete

完成时间complete time

备注

Remark

注意事项

日志

log

1

 Direct page jump through parameter passing

2024-7-17

route\_message\_id\_jump\_page 245

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":246,"status":0,"info":{"command":"jump\_to\_avatar"},"timestamp":"2024-04-14T07:51:05:000"}

2

Query the current page identification

2024-7-22

route\_message\_id\_get\_current\_page\_id 247

  

**ForegroundServices module crashes  
  
AvatarModule logs （虚拟人日志）**  
\[2024-07-26 03:04:38.729\]\[info\]\[thread 1\]\[WdcIPC.cpp sendByJson:121\] \[ipc\]-->{"params":{"command":"get\_current\_page\_id"},"route\_message\_id":247,"timestamp":1721963078}  
\[2024-07-26 03:04:38.729\]\[info\]\[thread 1\]\[server\_response\_handler.cpp addCallback:15\] add callback:248,size:3  
\[2024-07-26 03:04:38.729\]\[info\]\[thread 1\]\[wdc\_api.cpp send:58\] send-->{"params":{"command":"get\_current\_page\_id"},"route\_message\_id":247,"timestamp":1721963078}  
\[2024-07-26 03:04:38.729\]\[info\]\[thread 1\]\[wdc\_api.cpp send:65\] deviceId:Avarar\_WDM,moduleName:ForegroundServices  
\[2024-07-26 03:04:38.730\]\[info\]\[thread 1\]\[wdc\_api.cpp send:70\] Module Method called. Waiting for response  
Error: Time:Fri Jul 26 03:05:10 2024 [File:/app/azure-iot-sdk-c/c-utility/adapters/httpapi\_curl.c](http://File/app/azure-iot-sdk-c/c-utility/adapters/httpapi_curl.c) Func:HTTPAPI\_ExecuteRequest Line:816 Failure in HTTP communication: server reply code is 504  
Info: HTTP Response:{"message":"Timed out waiting for device to respond to method request 1f1cefee-2d95-4df2-86b4-f0df3938f86e"}  
Error: Time:Fri Jul 26 03:05:10 2024 [File:/app/azure-iot-sdk-c/iothub\_client/src/iothub\_client\_edge.c](http://File/app/azure-iot-sdk-c/iothub_client/src/iothub_client_edge.c) Func:sendHttpRequestMethod Line:452 Http Failure status code 504.  
Error: Time:Fri Jul 26 03:05:10 2024 [File:/app/azure-iot-sdk-c/iothub\_client/src/iothub\_client\_edge.c](http://File/app/azure-iot-sdk-c/iothub_client/src/iothub_client_edge.c) Func:IoTHubClient\_Edge\_GenericMethodInvoke Line:486 Failure sending HTTP request for device method invoke  
<---ModuleMethodInvokeCallback called  
<---Result = 2, responseStatus = -1604935680, context=(nil)  
<---Response payload: (null)  
\[2024-07-26 03:05:10.570\]\[warning\]\[thread 117\]\[WdcIPC.cpp operator():172\] no reponse  
**  
ForegroundServices logs（ForegroundServices日志）**  
Message after parsing algo module 209Publish Acknowledgement for Recieved message  
Run 1 video restart 1  
Run 1 video restart 1  
Run 1 video restart 1  
Run 1 video restart 1  
terminate called after throwing an instance of 'std::logic\_error'  
what(): basic\_string: construction from null is not valid  
Message after parsing algo module 209Publish Acknowledgement for Recieved messag

3

Query the current device model, Mac address, user information (username, token, avatar, etc.)

2024-7-18

route\_message\_id\_get\_current\_user\_id 249

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"device\_model":"DW220","mac\_id":"fe80::1d3d:ef4b:1a61:8b55","username":"user","userId":"12345","avatar":"avatar\_name"}

4

Return to the previous page, return to the home page

2024-7-17

route\_message\_id\_return\_prev\_home 251

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":252,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

5

Screen off, screen on

2024-7-17

route\_message\_id\_set\_screen\_on\_off 253

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":254,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

6

Start cooking

2024-7-17

route\_message\_id\_start\_cooking 231

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":232,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

7

Pause cooking

2024-7-17

route\_message\_id\_pause\_cooking 233

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":234,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

8

Continue cooking

2024-7-17

route\_message\_id\_resume\_cooking 235

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":236,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

9

Stop Cooking

2024-7-17

route\_message\_id\_stop\_cooking 237

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":238,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

10

Micro heat

  

  

  

  

11

Defrost

  

  

  

  

12

Query remaining cooking time

2024-7-17

route\_message\_id\_cooking\_remain\_time 239

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":240,"status":0,"info":{"remaining\_seconds":"0"},"timestamp":"2024-04-14T07:51:05:000"}

13

Constant temperature heating: cooking mode setting is linked with UI  
(medium temperature, medium-high temperature, high temperature),

2024-7-23

route\_message\_id\_cooking\_temperature\_change 241

For the fixed temperature cooking and manual heating modes, if not on the corresponding cooking parameter setting page, simultaneously send commands to navigate to the cooking page and parameter setting instructions, navigate to the corresponding page, and fill in the parameters.

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":242,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

14

Duration setting is linked with UI

2024-7-23

route\_message\_id\_cooking\_time\_change 243

针对定温烹饪和手动加热模式，如不在对应烹饪参数设置页面，则同时发送跳转烹饪页面和参数设置指令，跳转到对应页面并填参

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":244,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

15

Volume Adjustment，Adjust by step (turn up, turn down)

2024-7-20

route\_message\_id\_volume\_change 255

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":256,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

16

Volume Adjustment，Adjustment by specific value (adjust to x% volume)

2024-7-20

route\_message\_id\_volume\_change 255

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":256,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

17

Brightness adjustment，Adjust by step (turn up, turn down)

2024-7-26

route\_message\_id\_brightness\_change 257

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":258,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

t18

Brightness adjustment，Adjust by specific value (adjust to x% brightness)

2024-7-20

route\_message\_id\_brightness\_change 257

  

**{"command":"brightness\_change","type":"value","value":"30"},"route\_message\_id":257,"timestamp":1721439892}**

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":258,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

19

Sleep time setting

2024-7-20

route\_message\_id\_sleep\_time 259

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":260,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

20

Enable child lock and jump the page;

2024-7-20

route\_message\_id\_child\_lock 261

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":262,"status":0,"timestamp":"2024-04-14T07:51:05:000"}

21

To determine the state of child lock (whether to open, unlock)

2024-7-22

route\_message\_id\_child\_lock\_query 263

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":264,"status":0,"info":{"child\_lock\_status":""},"timestamp":"2024-04-14T07:51:05:000"}

22

Get Window ID

2024-7-17

route\_message\_id\_get\_window\_id 265

  

<---ModuleMethodInvokeCallback called  
<---Result = 0, responseStatus = 200, context=(nil)  
<---Response payload: {"route\_message\_id":266,"status":0,"info":{"qt\_window\_id":"46137350"},"timestamp":"2024-04-14T07:51:05:000"}

23

Show or hide the right part inhome page

  

  

  

  

24

Show/hide home page box

2024-8-6

route\_message\_id\_show\_or\_hide\_home\_page\_box 267

  

  

2.2. 虚拟人应用非联调任务
---------------

序号  
Order

接口  
Interface Task

进度

备注

序号  
Order

接口  
Interface Task

进度

备注

0

需求评审、PRD评审、技术任务分解同步、接口协议文档达成一致

5.25~6.4，主要任务是讲解虚拟人应用产品需求，需要协同的接口，应用框架，接口协议格式

1

 avatar渲染链路 rendering link

  

2

声学链路 acoustic link

*   mic
*    speaker

  

3

互动链路 Interactive Links

包含触屏左右滑动和点击具体部位Contains sliding left and right；clicking specific parts

*   Swipe left and right
*   click specific parts

  

4

Azure云部署链路 Azure cloud deployment link

  

5

接口框架和调用方式链路 Interface framework and calling method link

  

6

食谱UI——列表页Recipe UI—— list page  
食谱UI—详情页Recipe UI—— detail page  
声学控制——acoustic control

*   list page
*   detail page
*   acoustic control

  

7

引导页面——联网引导 Networking guide page  
引导页面——绑定页面 Binding guide page

包含UI和媒体文件的准备——Contains UI and media files

  

  

8

切换虚拟人——switch avatar

包含UI和声学控制——Contains UI and acoustic control

  

9

查看虚拟人使用说明书——View the virtual human user manual

  

  

  

  

  

  

  

  

  

  

  

  

～～～

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)