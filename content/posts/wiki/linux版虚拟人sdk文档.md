---
author: "王宇"
title: "linux版虚拟人sdk文档"
date: 四月13,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 253
---
*   1[1\. 初始化方法](#linux版虚拟人sdk文档-初始化方法)
*   2[2\. 检查资源](#linux版虚拟人sdk文档-检查资源)
*   3[3\. 下载资源](#linux版虚拟人sdk文档-下载资源)
*   4[4\. 创建数字虚拟人](#linux版虚拟人sdk文档-创建数字虚拟人)
*   5[5\. 加载身体部件](#linux版虚拟人sdk文档-加载身体部件)
*   6[6\. 添加画布](#linux版虚拟人sdk文档-添加画布)
*   7[7\. 播报](#linux版虚拟人sdk文档-播报)
*   8[8\. 角色基于现有大小缩放至指定的大小](#linux版虚拟人sdk文档-角色基于现有大小缩放至指定的大小)
*   9[9\. 删除画布](#linux版虚拟人sdk文档-删除画布)
*   10[10\. 设置背景颜色](#linux版虚拟人sdk文档-设置背景颜色)
*   11[11\. 删除数字虚拟人](#linux版虚拟人sdk文档-删除数字虚拟人)
*   12[12\. 角色行为状态切换到 Idle 状态](#linux版虚拟人sdk文档-角色行为状态切换到Idle状态)
*   13[13\. 播放本地动画](#linux版虚拟人sdk文档-播放本地动画)

1\. 初始化方法
=========

  

void haisdk\_init(int useInnerAudioFlag,  
const char \*persistPath,  
int animMode,  
const char \*authHost,  
const char \*appKey,  
const char \*appID,  
const char \*appSecret,  
const char \*usrID,  
HAI\_PVOID userData,  
HAI\_FPTR\_INIT\_END\_CALLBACK initEndCallback)

  

参数说明

\* @param useInnerAudioFlag 是否启用内部音频控制器，如果是false，sdk的调用方可以重写sdk抛出的音频处理回调来达到重写音频控制代码。  
\* @param persistPath 需要用户手动设置一个可读写的文件路径给sdk，sdk内部会用这个目录存放存放一些依赖资源。  
\* @param animMode 0表示默认动画方式，1是升级动画方式  
\* @param authHost 这些参数都是和sdk本身的授权有关，这些参数需要向拟仁申请。  
\* @param appKey 这些参数都是和sdk本身的授权有关，这些参数需要向拟仁申请。  
\* @param appID 这些参数都是和sdk本身的授权有关，这些参数需要向拟仁申请。  
\* @param appSecret 这些参数都是和sdk本身的授权有关，这些参数需要向拟仁申请。  
\* @param usrID usrID  
\* @param usrID 所有传递给回调函数的用户数据指针  
\* @param initEndCallback 结束回调接口

  

  

/\*\*  
\* 启用单一surface显示模式，这个模式与MultiSurfaces互斥，只会一个enable  
\* @param surfaceID 绘制表面的句柄id  
\*/  
HAISDK\_CALL void haisdk\_enable\_single\_surfacemode(int surfaceID);

  

2\. 检查资源
========

/\*\*  
\* SDK初始化完毕之后，可以调用这个接口，调用时需要有网络，这个接口主要就是检查服务器资源状态，检查结束会异步返回值。  
\* @param avatarID avatarID  
\* @param resourceType 0表示默认资源包，1表示aplus资源，3表示pbr资源包  
\* @param userData 所有传递给回调函数的用户数据指针  
\* @param checkCallback 资源检查的回调接口。  
\*/  
HAISDK\_CALL int haisdk\_check\_server\_asset(const char \*avatarID,  
int resourceType,  
HAI\_PVOID userData,  
HAI\_FPTR\_CHECK\_RESOURCE\_CALLBACK checkCallback);

  

3\. 下载资源
========

/\*\*  
\* 调用haisdk\_check\_server\_asset之后，理论上可以调用这个接口了，调用时需要有网络，这个接口主要就是下载资源，  
\* 但是这个接口依赖haisdk\_check\_server\_asset的返回状态。  
\* 如果haisdk\_check\_server\_asset返回状态是HAS\_UPDATE\_IGNORABLE或者SHOULD\_UPDATE，调用这个接口就会下载最新资源。  
\* 如果haisdk\_check\_server\_asset返回状态是其他值，调用这个接口其实没有意义。  
\* @param userData 所有传递给回调函数的用户数据指针  
\* @param progressCallback 资源下载的进度回调接口。  
\* @param endCallback 资源下载的结束回调接口。  
\*/  
HAISDK\_CALL int haisdk\_download\_server\_asset(HAI\_PVOID userData,  
HAI\_FPTR\_DOWNLOAD\_RESOURCE\_PROGRESS\_CALLBACK progressCallback,  
HAI\_FPTR\_DOWNLOAD\_RESOURCE\_END\_CALLBACK endCallback);

  

4\. 创建数字虚拟人
===========

  

/\*\*  
\* 创建数字虚拟人接口  
\* @param instId  
\* @param avatarID 表示insId对应的avatarID  
\* @param langID 多语言id，指定虚拟人是按照什么语言交流  
\* cn, en, es, fr, de, it, hi  
\* @param usrData 所有传递给回调函数的用户数据指针  
\* @param fptrStopAudio 音频控制的回调接口，用于API调用层重写音频控制函数，只有Init函数里面useInnerAudioFlag为false的时候，才有可能有回调。  
\* @param fptrPauseAudio 音频控制的回调接口，用于API调用层重写音频控制函数，只有Init函数里面useInnerAudioFlag为false的时候，才有可能有回调。  
\* @param fptrPlayAudioBuff 音频控制的回调接口，用于API调用层重写音频控制函数，只有Init函数里面useInnerAudioFlag为false的时候，才有可能有回调。  
\* @param fptrPlayAudioFile 音频控制的回调接口，用于API调用层重写音频控制函数，只有Init函数里面useInnerAudioFlag为false的时候，才有可能有回调。  
\* @param createAvatarCallback 虚拟人创建是否成功的异步回调。这个回调函数会返回两个参数，一个参数表示Instance是否创建成功，另一个表示创建成功的Instance实例ID。  
\*/  
HAISDK\_CALL void haisdk\_avatar\_create(const char \*insID,  
const char \*avatarID,  
const char \*langID,  
HAI\_PVOID usrData,  
HAI\_FPTR\_STOP\_AUDIO\_CALLBACK fptrStopAudio,  
HAI\_FPTR\_PAUSE\_AUDIO\_CALLBACK fptrPauseAudio,  
HAI\_FPTR\_PLAY\_PCM\_CALLBACK fptrPlayAudioBuff,  
HAI\_FPTR\_PLAY\_AUDIOFILE\_CALLBACK fptrPlayAudioFile,  
HAI\_FPTR\_CREATE\_AVATAR\_CALLBACK createAvatarCallback);

5\. 加载身体部件
==========

/\*\*  
\* 加载或者替换身体部件  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\* @param matType 0=unlit, 1=pbr  
\* @param haiMatID -1:默认值, 0:透明背景版  
\* @param ptrAssetName 新部件的资源名称  
\* @return 返回0为正确  
\*/  
HAISDK\_CALL int haisdk\_avatar\_load\_parts(int avaInstId,  
int matType,  
int haiMatID,  
const char \*ptrAssetName);

6\. 添加画布
========

/\*\*  
\* 添加一个绘制表面  
\* @param surface 绘制表面句柄  
\* @param width 绘制表面对应的像素宽度  
\* @param height 绘制表面对应的像素高度  
\* @return 返回值是默认的surfaceID(为非负值), 其他值表示API执行有错误。  
\*/  
HAISDK\_CALL int haisdk\_add\_draw\_surface(void \*surface,  
int width,  
int height);

  

其他使用高频的方法

7\. 播报
======

/\*\*  
\* 将角色行为状态切换到动态播报状态, 同时输出口型对齐结果和行为情绪分析结果。  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\* @param text 播报的文本，可以是问题文本，也可以是答案文本。 \*如果只是答案文本，请将openNLP设置成false。后面角色播报的时候，只是播报这个输入的文本。\* 如果是问题文本，请将openNLP设置成true。后面角色播报的时候，会播报针对这个问题经过自然语言处理之后的答案文本。  
\* @param openNLP 是否启用自然语言处理。  
\* @param openMotionTag 是否启用行为动作分析处理。  
\* @param inLangID 输入文本的语言id，指定虚拟人是按照什么语言交流  
\* cn, en, es, fr, de, it, hi  
\* @param outLangID 目标播报语言id，指定虚拟人是按照什么语言交流  
\* cn, en, es, fr, de, it, hi  
\* @param tags 可以主动设置一些tag。  
\* @param chatUserData 所有传递给回调函数的用户数据指针  
\* @param chatEndCallback 结束播报的回调函数。  
\* @param chatTagCallback 中间结果，返回的tag回调函数。  
\* @param chatTextCallback 中间结果，返回的文本答案回调函数。  
\* @param chatRichCallback 中间结果，返回的富文本回调函数。  
\* @return 返回值为0时，表示调用接口正确返回。  
\*/  
HAISDK\_CALL int haisdk\_avatar\_anim\_playdynamic(int avaInstId,  
const char \*text,  
int openNLP,  
int openMotionTag,  
const char \*inLangID,  
const char \*outLangID,  
const char \*tags,  
HAI\_PVOID chatUserData,  
HAI\_FPTR\_VOID\_PVOID chatEndCallback,  
HAI\_FPTR\_VOID\_PVOID\_PCHAR chatTagCallback,  
HAI\_FPTR\_VOID\_PVOID\_PCHAR chatTextCallback,  
HAI\_FPTR\_VOID\_PVOID\_PCHAR chatRichCallback);

8\. 角色基于现有大小缩放至指定的大小
====================

/\*\*  
\* 将角色基于现有大小缩放至指定的大小  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\* @param percentage 相对于原始模型大小的缩放系数，当值大于1时，表示放大，否则表示缩小。  
\* @return 返回值为0时，表示调用接口正确返回。  
\*/  
HAISDK\_CALL int haisdk\_avatar\_scale\_to(int avaInstId,  
float percentage);

9\. 删除画布
========

/\*\*  
\* 根据一个绘制表面的句柄id，删除一个绘制表面  
\* @param surfaceID 绘制表面的句柄id  
\*/  
HAISDK\_CALL void haisdk\_remove\_draw\_surface(int surfaceID);

10\. 设置背景颜色
===========

/\*\*  
\* 启用颜色背景，分别传递rgba的值，与SetBackgroundImage互斥，只有一个会显示。  
\* @param r255 0-255整形值  
\* @param g255 0-255整形值  
\* @param b255 0-255整形值  
\* @param a255 0-255整形值  
\* @return 返回值为0时，表示调用接口正确返回。  
\*/  
HAISDK\_CALL int haisdk\_background\_show\_color(int r255,  
int g255,  
int b255,  
int a255);

11\. 删除数字虚拟人
============

/\*\*  
\* 删除数字虚拟人  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\*/  
HAISDK\_CALL void haisdk\_avatar\_destroy(int avaInstId);

12\. 角色行为状态切换到 Idle 状态
======================

/\*\*  
\* 将角色行为状态切换到 Idle 状态  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\* @return 返回值为0时，表示调用接口正确返回。  
\*/  
HAISDK\_CALL int haisdk\_avatar\_do\_standby(int avaInstId);

13\. 播放本地动画
===========

/\*\*  
\* 将角色行为状态切换到播放原子级的分成动画状态  
\* @param avaInstId haisdk\_avatar\_create返回的id值  
\* @param animName 动画名称  
\* @param loop 循环标志位  
\* @param forcePlayClipState true表示中断其他虚拟人状态，直接进入单纯播放motion的状态  
\* @param usrData 所有传递给回调函数的用户数据指针  
\* @param playCallback 通知动画播放结束时间的回调处理函数；原子动画不含音频信息，因此不支持通知开始播放wav音频时间的回调处理函数。如果原子动画设置了循环播放的标志位，结束回调就不会再调用了  
\* @return 返回非负值为当前要播放的动画实例ID，负值表示播放错误  
\*/  
HAISDK\_CALL int haisdk\_avatar\_anim\_playclip(int avaInstId,  
const char \*animName,  
int loop,  
int forcePlayClipState,  
HAI\_PVOID usrData,  
HAI\_FPTR\_VOID\_PVOID\_INT playCallback);

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)