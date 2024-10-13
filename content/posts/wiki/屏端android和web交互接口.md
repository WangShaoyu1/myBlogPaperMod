---
author: "王宇"
title: "屏端android和web交互接口"
date: 四月19,2024
description: "虚拟人屏端接口"
tags: ["虚拟人屏端接口"]
ShowReadingTime: "12s"
weight: 121
---
android与js交互有两种方式，第一种是通过系统提供的@JavascriptInterface注解实现，第二种就是js注入。

**android发送Js数据协议**
-------------------

调用windo.onYzevent方法。方法参数为json字符串

调用js方法示例 webView!!.loadUrl("javascript:if(window.onYzevent){window.onYzevent('$jsonString')}")

jsonString格式为下：

[?](#)

`{`

    `'action'``:` `'事件名称'``,`

    `'data'``: {`

        `'sub'``:` `'nlp'``,`

        `'is_finish'``: True`

    `}`

`}`

其中

action

参数

说明

参数说明

action

参数

说明

参数说明

wakeUp

  

唤醒

  

speechResult

    text

语音识别

语音识别后的字符串

update

  

当前有升级文件

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

js→android

  

**Js端调用App方法**
--------------

android端在web里面注入了一个名为android的对象。JS直接调用android的方法名。就可以回调到android对象里面的方法

其中android端注入的对象JavascriptApi

js端调用android端实例：`function jsCallAndroid() { android.starAsr(); }`

android端 JavascriptApi里面可供js调用的方法说明

方法

说明

参数说明

方法

说明

参数说明

starAsr

开始语音识别

  

stopAsr

结束语音识别

  

install

安装升级

  

play

播放本地视频

{"name":"xxx"} name为 视频名称

pause

暂停播放

  

rePlay

重新播放

  

stop

停止播放

  

jumpWifiSetting

跳转WIFI设置页面

  

      

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)