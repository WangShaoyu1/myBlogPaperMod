---
author: "王宇"
title: "科大讯飞aiuisdk技术"
date: 三月29,2024
description: "声学"
tags: ["声学"]
ShowReadingTime: "12s"
weight: 108
---
1\. 炉端
======

使用离线唤醒+在线识别+在线语音合成，录音数据会先送到本地算法做唤醒和降噪处理后，再把录音数据送到云端识别。

1、先打开录音 CaeOperator录音有关的类 

com.yingzi.yzhci.aiui.caePk.CaeOperator#startRecord

com.yingzi.yzhci.aiui.caePk.CaeOperator#onPcmDataHandler

//把语音送到本地算法识别 唤醒算法和降噪算法

com.yingzi.yzhci.aiui.caePk.CaeCoreHelper#writeAudio 

ICAEListener监听器会监听唤醒和降噪后的音频

[https://www.yuque.com/iflyaiui/zzoolv/vv3yo0](https://www.yuque.com/iflyaiui/zzoolv/vv3yo0)

2、接入科大讯飞，即创建语音配置对象，传一个appid，只有接入后才可以使用MSC的各项服务

3、创建aiui实例，需要传一个设备id作为唯一标识，还有配置文件

4、设置cae回调，就是收音的回调。

![](/download/attachments/109713910/image2023-9-15_11-36-11.png?version=1&modificationDate=1694748995497&api=v2)

主要涉及两个回调 com.yingzi.yzhci.aiui.caePk.CaeOperator#caeListenerEnd和com.yingzi.yzhci.aiui.caePk.CaeCoreHelper#caeOperatorListener

CaeCoreHelper——CaeOperator——CaeManager

先执行的是com.yingzi.yzhci.aiui.caePk.CaeCoreHelper#caeOperatorListener（这个设置的是com.yingzi.yzhci.aiui.caePk.CaeOperator#mOnCaeOperatorListener）

![](/download/attachments/109713910/image2023-9-15_11-37-47.png?version=1&modificationDate=1694749091213&api=v2)

后执行的是com.yingzi.yzhci.aiui.caePk.CaeOperator#mOnCaeOperatorListener

后执行的是CaeManager

5、发送消息启动aiui服务

  

2\. aiui的交互状态
=============

通过消息驱动

[https://aiui-doc.xf-yun.com/project-1/doc-15/](https://aiui-doc.xf-yun.com/project-1/doc-15/)

  

代码走读：

1、com.yingzi.yzhci.aiui.YZAiui#initAIUI

[?](#)

`/**`

 `* 初始化AIUI`

 `*`

 `* @param mode`

 `* @param initResultListener`

 `*/`

`public` `YZAiui initAIUI(``int` `mode, AIUIInitResultListener initResultListener) {`

    `// 1.先要进行CAE鉴权，并开启录音`

    `caeInitAndOpenStartRecord(mode, initResultListener);`

    `// 2.创建语音工具`

    `createSpeechUtility(sApplicationContext);`

    `// 3.创建agent`

    `createAgent(mode);`

    `// 4.初始化CaeEngine`

    `CaeManager.getInstance().initCaeEngine();`

    `// 5.启动AIUI服务`

    `startAIUIService();`

    `return` `this``;`

`}`

唤醒

com.iflytek.iflyos.cae.ICAEListener#onWakeup（）

com.yingzi.yzhci.aiui.listener.OnCaeOperatorListener#onWakeup

com.yingzi.yzhci.aiui.caePk.CaeManager#onWakeup

com.yingzi.yzhci.aiui.YZAiui#onWakeUp

com.yingzi.yzhci.aiui.listener.YzAvatarListener#onWakeup

com.yingzi.consume.aiui.AiuiBizHelper#wakeupForAvatar

YZAiui.getInstance().sendWakeupMessage(0, 0);//给aiui发消息激活拾音

语音识别

com.yingzi.yzhci.aiui.listener.OnCaeOperatorListener#onAudio

com.yingzi.yzhci.aiui.listener.OnCaeOperatorListener#onAudio

com.yingzi.yzhci.aiui.caePk.CaeManager#onAudio

com.yingzi.yzhci.aiui.YZAiui#writeAudio//送给aiui识别

com.iflytek.aiui.AIUIConstant#EVENT\_RESULT //aiui结果回调

2.1. 离线唤醒
---------

唤醒配置vtn.ini

唤醒词资源`res.bin`(唤醒词小飞小飞）拷贝到文件系统中

![](/download/thumbnails/109713910/image2023-9-15_10-49-19.png?version=1&modificationDate=1694746183382&api=v2)

具体配置见[https://aiui-doc.xf-yun.com/project-1/doc-22/](https://aiui-doc.xf-yun.com/project-1/doc-22/)

2.2. aiui配置
-----------

[https://aiui-doc.xf-yun.com/project-1/doc-13/](https://aiui-doc.xf-yun.com/project-1/doc-13/)

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)