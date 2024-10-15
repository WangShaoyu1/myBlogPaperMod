---
author: "王宇"
title: "linux版虚拟人SDK"
date: 五月29,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 256
---
### 虚拟人渲染异常

可能原因：加载顺序问题

### 加载身体部件的时候注意事项

加载part部分时候

head要在前面加载

haisdk\_avatar\_load\_parts(gSdkRT.hai\_instanceid,  
matID,  
\-1,  
"head001.glb");  
haisdk\_avatar\_load\_parts(gSdkRT.hai\_instanceid,  
matID,  
\-1,  
"shoes001.glb");  
haisdk\_avatar\_load\_parts(gSdkRT.hai\_instanceid,  
matID,  
\-1,  
"suit001.glb");  
haisdk\_avatar\_load\_parts(gSdkRT.hai\_instanceid,  
matID,  
\-1,  
"hair001.glb");

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)