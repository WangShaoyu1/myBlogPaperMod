---
author: "王宇"
title: "Fay数字人项目学习"
date: 十月07,2023
description: "七、测试"
tags: ["七、测试"]
ShowReadingTime: "12s"
weight: 152
---
Fay是什么？
=======

该项目基于浪潮集团的“源1.0”、科大讯飞的 AIUI 以及 OpenAI 的ChatGPT 开发，整个项目主要由 Fay 控制器及数字人模型构成，包含 Python 内核及 UE 数字人模型。

**划重点！** [Gitee 紧跟时代，目前已经支持 AI 模型的托管](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/XC-qT-3HRFj58XXDH-KQVQ)，为广大 AI 开发者提供高速稳定的托管服务。欢迎各位 AI 爱好开发者将 AI 模型托管到 Gitee，更快捷，更放心。

言归正传，对于 Fay 而言，**控制器是其核心组件。**

通过 Fay 控制器，开发者可以驱动不同的模型，如真人照片、二次元模型等；同时还可以设置不同的模式，例如带货模式、测评模式以及助理模式等；该控制器还支持不同的终端平台，如手机、PC、手表等。

![](/download/thumbnails/109717817/image2023-9-26_9-45-13.png?version=1&modificationDate=1695692713903&api=v2)

因此，开发人员可以采用 Fay 控制器搭建各种类型的数字人，如虚拟主播、现场推销、商品导购、语音助理、远程语音助理、数字人互动、数字人面试官及心理测评、贾维斯、Her等。

如何实现？
=====

Fay 的基本理念就是“**把人数字化，以行人的职责**”。

具体来讲是通过技术把**人的特征数字化**，比如进行语音识别、情绪分析，构建人的表情和动作，合成带有情绪的语音并输出，**让这个数字人有“耳朵”“嘴巴”**。

从构成上看，Fay 由多个模块组成，各个模块之间耦合度非常低，包括声音来源、语音识别、情绪分析、NLP 处理、情绪语音合成、语音输出和表情动作输出等模块，每个模块都可根据需要自行替换。下图为 Fay 控制器的核心逻辑。

![](/download/attachments/109717817/image2023-9-26_10-26-20.png?version=1&modificationDate=1695695180443&api=v2)

如何安装？
=====

拉取Fay项目，里面包含安装方法：[https://github.com/TheRamU/Fay/tree/fay-assistant-edition#code-structure](https://github.com/TheRamU/Fay/tree/fay-assistant-edition#code-structure)

本人安装经验：运行Fay控制器驱动虚拟人时不要用PyChaim工具启动，会导致控制器跟虚拟人不能实时进行交互，启动时只能进行一句话交互就会影响录音模块没有办法正常录音。

运行项目
====

项目下的system.conf文件配置好，通过cmd命令窗运行main.py文件，如图  
![](/download/attachments/109717817/image2023-9-26_17-8-24.png?version=3&modificationDate=1696649255841&api=v2)

分析项目
====

先了解每个程序的文件作用，大概知道每个文件的作用的干啥  
![](/download/attachments/109717817/image2023-9-27_14-13-52.png?version=1&modificationDate=1695795232584&api=v2)  
1.从主程序main.py分析入手，主程序导入了各个模块以及包（模块），作用是运行主程序时引用其他类、函数、属性，完成一个初始化和启动程序。  
![](/download/attachments/109717817/image2023-9-27_14-24-3.png?version=1&modificationDate=1695795843536&api=v2)

2.主程序定义了三个函数，举例\_\_clear\_samples函数的作用是判断是否存在samples文件，不存在则创建，若存在则清除名为"samples"的目录中以"sample-"开头的文件，其他两个同理。

3.主程序调用了这三个函数进行目录下的判断和创建文件夹，完成初始化的工作，同时也判断的Fay.db数据库，不存在则连接数据库并创建。同时判断如果asr调用的是ali，则调用函数并启动window窗口

4.启动程序后开启录音进行对话

![](/download/attachments/109717817/image2023-9-27_18-5-25.png?version=1&modificationDate=1695809125984&api=v2)

5.通过日志“聆听中...”搜索打印日志的代码，分析该代码逻辑确认启动后开启录音的逻辑，通过发现打印该日志代码在一个类class Recorder下方法def \_\_record(self):，在确认调用该函数的代码

![](/download/attachments/109717817/image2023-9-27_18-10-54.png?version=1&modificationDate=1695809454604&api=v2)

  

  

分析得出当调用start（）方法时，嵌套调用\_\_record（self）方法，分析\_\_record（self）方法中有一段判断用户是否在说话的逻辑

![](/download/attachments/109717817/image2023-9-27_18-14-49.png?version=1&modificationDate=1695809689177&api=v2)

判断如果当前时间减去最好一次说话时间大于设置的参数值0.75则调用self.\_\_aLiNls.end()方法，并打印相应的日志

![](/download/attachments/109717817/image2023-10-7_10-0-47.png?version=1&modificationDate=1696644047598&api=v2)  
![](/download/attachments/109717817/image2023-10-7_10-0-31.png?version=1&modificationDate=1696644031360&api=v2)  

调用self.\_\_aLiNls.end()，结束asr，判断私有变量\_\_connected为True，进行异常捕获，当没有异常，判断frame元素是字典还是字节，程序暂停400ms，同时把frame字典转换成json格式，遇到异常则打印异常信息e。

![](/download/attachments/109717817/image2023-10-7_11-23-28.png?version=1&modificationDate=1696649008978&api=v2)

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)