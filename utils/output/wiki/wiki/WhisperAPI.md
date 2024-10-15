---
author: "王宇"
title: "WhisperAPI"
date: 三月07,2023
description: "chatGPT与OpenAI相关学习资料"
tags: ["chatGPT与OpenAI相关学习资料"]
ShowReadingTime: "12s"
weight: 510
---
Whisper API支持对语音文件进行转录和翻译，并支持包括英语、中文、阿拉伯语、日语、德语、西班牙语等几十种语言。

支持格式【'm4a', 'mp3', 'webm', 'mp4', 'mpga', 'wav', 'mpeg'】

  

优点：
---

1.  能获取视频声音

缺点：
---

1.  慢
2.  不支持多语言
3.  只支持上传file类型二进制格式
4.  限制大小为25MB、26MB左右
5.  贵（_每分钟只要0.006美元,人民币约为4分钱_ ）
6.  不同语言的准确率差别不小，Whisper large-v2模型在识别西语、英语、意大利语、德语等语言单词错误率都能控制在5%以内。中文，v1模型的错误率就有19.6%，v2略微提升到14.7%，错误率比英文、西语之类的高很多

实验数据
----

文件

大小

时长（S）

正确率

平均花费时间（S）

文件

大小

时长（S）

正确率

平均花费时间（S）

[![](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/4.1.1/_/download/resources/com.atlassian.confluence.plugins.confluence-view-file-macro:view-file-macro-resources/images/placeholder-small-multimedia.png)xiaofei.wav](/download/attachments/97887600/xiaofei.wav?version=1&modificationDate=1678159672225&api=v2)

249k

7

100%

  

4.83

4.79

9.91

50.03

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)