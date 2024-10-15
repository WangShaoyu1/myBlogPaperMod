---
author: "王宇"
title: "播放Aplus资源流程"
date: 十月18,2023
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 263
---
### 资源路径位置

  

在HaiSDK初始化的时候，有个参数

HaiSDK.Init(false, 0, path, GPValues.BASE\_URL,  
        GPValues.APP\_KEY, GPValues.APP\_ID,  
        GPValues.APP\_SECRET, deviceId, initCallback)

离线资源路径的在以下目录下

`/sdcard/Android/package_name/path/虚拟人Id/aplus`

  

package\_name为包名

path为HaiSDK初始化方法Init的参数path

对应的资源文件为 aplusID.json

  

调用SDK的HaiSDK.DownloadCheckedServerAsset方法可下载资源文件（下载虚拟人的所有资源）

  

### 播放

播放时调用HaiSDK.InstancePlayAplus(int rdInstID, String aplusID, IPlayMotion callback)

aplusID传入上面的资源名称。

若对应的资源被删除，则会播放滋滋滋的声音

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)