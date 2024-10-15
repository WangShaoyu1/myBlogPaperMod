---
author: "王宇"
title: "STA"
date: 九月07,2023
description: "99、其他"
tags: ["99、其他"]
ShowReadingTime: "12s"
weight: 104
---
****语音动画合成（STA）技术****

系统将用户输入的文本或者是语音，通过网络实时传输到云端，云端接收到以后首先对输入的素材进行整理。如果是语音，系统提供语音识别技术，对语音转文字，然后将最后的文本内容输入STA中。

STA首先采用ETTS技术将文字合成为有感情的语音，或者是调用第三方TTS接口，对音频进行处理，实现语音对虚拟人的口型、唇形以及面部表情、躯体的简单驱动。这种驱动方式需要先将口型、唇形、面部表情、躯体动作等动作列出来，比如人脸的6个基本动作（眯眼与凝视、扬眉与皱眉、点头与摇头），与语音进行合成训练，当碰到某一种语音音调类型时，驱动虚拟人做一些动作、表情等。播报流程及语音交互流程如图1、图2所示。

![](https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2023%2F0805%2F04f795a1j00ryweow000zd200k1008bg00it007s.jpg&thumbnail=660x2147483647&quality=80&type=jpg)

图1 单向的语音播报流程

![](https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2023%2F0805%2F3cce8249j00ryweox000yd200u0007hg00it004o.jpg&thumbnail=660x2147483647&quality=80&type=jpg)

图2 语音交互流程

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)