---
author: "王宇"
title: "虚拟人Androidsdk接入文档"
date: 八月07,2023
description: "虚拟人相关"
tags: ["虚拟人相关"]
ShowReadingTime: "12s"
weight: 110
---
*   1[1\. 接入步骤](#id-虚拟人Androidsdk接入文档-接入步骤)
*   2[2\. 虚拟人sdk方法](#id-虚拟人Androidsdk接入文档-虚拟人sdk方法)
    *   2.1[2.1. 初始化](#id-虚拟人Androidsdk接入文档-初始化)
    *   2.2[2.2. 资源](#id-虚拟人Androidsdk接入文档-资源)
        *   2.2.1[2.2.1. 检测资源](#id-虚拟人Androidsdk接入文档-检测资源)
        *   2.2.2[2.2.2. 下载资源](#id-虚拟人Androidsdk接入文档-下载资源)
        *   2.2.3[2.2.3. 下载pta资源](#id-虚拟人Androidsdk接入文档-下载pta资源)
    *   2.3[2.3. 创建虚拟人](#id-虚拟人Androidsdk接入文档-创建虚拟人)
    *   2.4[2.4. 变换（除了To方法还有By方法,To是直接移动到指定的屏幕坐标位置，By是基于当前显示位置偏移指定的屏幕坐标距离）](#id-虚拟人Androidsdk接入文档-变换（除了To方法还有By方法,To是直接移动到指定的屏幕坐标位置，By是基于当前显示位置偏移指定的屏幕坐标距离）)
        *   2.4.1[2.4.1. 位置](#id-虚拟人Androidsdk接入文档-位置)
        *   2.4.2[2.4.2. 大小](#id-虚拟人Androidsdk接入文档-大小)
        *   2.4.3[2.4.3. 旋转](#id-虚拟人Androidsdk接入文档-旋转)
        *   2.4.4[2.4.4. 获取坐标](#id-虚拟人Androidsdk接入文档-获取坐标)
        *   2.4.5[2.4.5. 获取大小](#id-虚拟人Androidsdk接入文档-获取大小)
        *   2.4.6[2.4.6. 获取旋转角度](#id-虚拟人Androidsdk接入文档-获取旋转角度)
    *   2.5[2.5. 播放](#id-虚拟人Androidsdk接入文档-播放)
        *   2.5.1[2.5.1. 播放普通文本或者nlp](#id-虚拟人Androidsdk接入文档-播放普通文本或者nlp)
        *   2.5.2[2.5.2. 播放A+资源](#id-虚拟人Androidsdk接入文档-播放A+资源)
    *   2.6[2.6. 6.内置动作](#id-虚拟人Androidsdk接入文档-6.内置动作)
        *   2.6.1[2.6.1. 调⽤待机动画，通常⽤于在语⾳交互过程中打断原本正在播报的其他动画，为接收新的⽤户指令做好准备](#id-虚拟人Androidsdk接入文档-调⽤待机动画，通常⽤于在语⾳交互过程中打断原本正在播报的其他动画，为接收新的⽤户指令做好准备)
        *   2.6.2[2.6.2. 将⻆⾊⾏为状态切换到Boring状态](#id-虚拟人Androidsdk接入文档-将⻆⾊⾏为状态切换到Boring状态)
        *   2.6.3[2.6.3. 将⻆⾊⾏为状态切换到Listen状态,聆听用户说话](#id-虚拟人Androidsdk接入文档-将⻆⾊⾏为状态切换到Listen状态,聆听用户说话)
        *   2.6.4[2.6.4. 播放原子动画，ftt平台上内置了几十个动画，用该方法可以播放](#id-虚拟人Androidsdk接入文档-播放原子动画，ftt平台上内置了几十个动画，用该方法可以播放)

  

1\. 接入步骤
========

[参考文档](/download/attachments/105270479/HaiSDK_Android%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97.pdf?version=1&modificationDate=1690774981325&api=v2) 

按照参考文档接入即可，有一点不一样是要调用getInstListByAppId接口获取虚拟人列表

调用顺序：在确认有网的情况下先调用Init,在Init的回调里面访问getInstListByAppId获取虚拟人列表信息，然后调用CheckServerAsset检测资源，没下载则调用DownloadCheckedServerAsset，downloadPTA下载资源，有下载则直接调用CreateInstance去创建虚拟人

![](/download/attachments/105270479/%E8%99%9A%E6%8B%9F%E4%BA%BA%E6%B5%81%E7%A8%8B%E5%9B%BE.png?version=1&modificationDate=1690770501800&api=v2)

2\. 虚拟人sdk方法
============

2.1. 初始化
--------

[?](#)

`Init(``boolean` `useInnerAudio,` `int` `animMode, String defaultPath, String authHost, String appKey,String appID, String appSecret,`

`String usrId, IInitCallback initCallback)`

useInnerAudio是否用sdk的语音播放器，animMode动画类型，默认传0就行，defaultPath app端存放资源的位置，authHost 后台地址，usrId传给后台的唯一标识，IInitCallback初始化完成的回调

2.2. 资源
-------

### 2.2.1. 检测资源

CheckServerAsset(String avatarID, int resourceType, ICheckServerAsset callback)  
avatarID 虚拟人的唯一标识,resourceType资源类型，0为普通资源，1为A+资源，ICheckServerAsset检测资源的回调

### 2.2.2. 下载资源

DownloadCheckedServerAsset(IDownloadCheckedServerAsset callback)

IDownloadCheckedServerAsset下载资源的回调

### 2.2.3. 下载pta资源  

DownloadPTA(String uri, String instID, String avatarID, IPTADownload callback)

uri，instID，avatarID都是getInstListByAppId接口获取,IPTADownload为下载pta资源的回调

2.3. 创建虚拟人  

-------------

CreateInstance(String instID, String avatarID, String langID, IAudioProxy audioProxy, ICreateInstanceCallback onCreateEnd)

 instID为从getInstListByAppId获取到的id,目前和avatarID是一样的值，langID为语言，中文为cn，audioProxy为音频回调，用sdk内部音频则传null，外部音频则在回调里处理。ICreateInstanceCallback为创建成功的回调.   

2.4. 变换**（除了****To****方法还有****By****方法****,To****是直接移动到指定的屏幕坐标位置，****By****是基于当前显示位置偏移指定的屏幕坐标距离）**
--------------------------------------------------------------------------------------------------

### 2.4.1. 位置  

InstanceTranslateTo(int rdInstID, float x, float y)  
rdInstID虚拟人id, x,y为坐标系，以-5到5为横向坐标，要做坐标映射。方法返回值为0时，表示调⽤接⼝正确返回

### 2.4.2. 大小

InstanceScaleTo(int rdInstID, float percentage)

rdInstID虚拟人id, percentage为大小。方法返回值为0时，表示调⽤接⼝正确返回

### 2.4.3. 旋转

InstanceRotateTo(int rdInstID, float angleValue)  
rdInstID虚拟人id, angleValue为角度 。方法返回值为0时，表示调⽤接⼝正确返回  

### 2.4.4. 获取坐标

InstanceGetTranslation(int rdInstID, AxisEnum axis)

rdInstID虚拟人id, axis为x/y/z坐标。方法返回值为0时，表示调⽤接⼝正确返回  

### 2.4.5. 获取大小

InstanceGetScale(int rdInstID, AxisEnum axis)

rdInstID虚拟人id, axis为x/y/z坐标。方法返回值为0时，表示调⽤接⼝正确返回  

### 2.4.6. 获取旋转角度

InstanceGetRotation(int rdInstID, AxisEnum axis)

rdInstID虚拟人id, axis为x/y/z坐标。方法返回值为0时，表示调⽤接⼝正确返回

2.5. 播放
-------

### 2.5.1. 播放普通文本或者nlp

InstancePlayCloudBehavior(int rdInstID, String text, boolean openNLP, boolean openGesture, String inLangID, String outLangID, String tags, IPlayChat callback)  
rdInstID虚拟人id，text为文本，非nlp直接播放出来，nlp则播放nlp文本。openGesture是否使用手势，inLangID，outLangID为语言，中文为cn。tags为扩展的参数，IPlayChat为播放回调  
  
打断多轮对话：当虚拟人处于多轮对话的时候，可以调用 InstancePlayCloudBehavior打断多轮对话，tags参数传{"init\_state": True}，在执行打断操作的时候需要在打断回调方法

onTagTextCallbackEnd （IPlayChat接口）里执行下一步操作  
  

### 2.5.2. 播放A+资源

  

InstancePlayCloudAplus(int rdInstID, String aplusID, boolean openGesture, IPlayChat callback) 播放云端的A+资源

InstancePlayAplus(int rdInstID, String aplusID, IPlayMotion callback)播放本地的A+资源  
  
在调用InstancePlayCloudBehavior的时候，如果匹配到ftt问答，属性，兜底等配置了A+资源的，不会播放声音，需要在onTagTextCallbackEnd（IPlayChat接口）回调中拿到aplusID调用InstancePlayCloudAplus方法去执行。  
如果ftt平台里配置了视频，图片等资源，在调用InstancePlayCloudAplus方法的时候会陆续在onTagTextCallbackEnd（IPlayChat接口）回调视频，图片的链接回来.          

2.6. 6.内置动作
-----------

### 2.6.1. 调⽤待机动画，通常⽤于在语⾳交互过程中打断原本正在播报的其他动画，为接收新的⽤户指令做好准备

InstanceDoIdle(int rdInstID) 。方法返回值为0时，表示调⽤接⼝正确返回  

### 2.6.2. 将⻆⾊⾏为状态切换到Boring状态

InstanceDoBoring(int rdInstID)。方法返回值为0时，表示调⽤接⼝正确返回  
  

### 2.6.3. 将⻆⾊⾏为状态切换到Listen状态,聆听用户说话

InstanceDoListen(int rdInstID)。方法返回值为0时，表示调⽤接⼝正确返回  

### 2.6.4. 播放原子动画，ftt平台上内置了几十个动画，用该方法可以播放

InstancePlayLocalClip(int rdInstID, String name, boolean loop, boolean forcePlayClipState, IPlayMotion callback)

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)