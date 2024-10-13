---
author: "王宇"
title: "科大讯飞sdk使用说明"
date: 三月22,2023
description: "15.1科大讯飞&鱼亮科技"
tags: ["15.1科大讯飞&鱼亮科技"]
ShowReadingTime: "12s"
weight: 133
---
AiuiUtils：

com.iflytek.vtncaetest

engine：算法引擎  
\---AiuiEngine： 识别，语义，合成引擎  
\---EngineConstants：引擎配置，例如音量增益  
\---WakeupEngine：唤醒引擎  
\---WakeupListener：唤醒回调接口

englishInteract  
\---EnglishInteractActivity： 英语识别，英语回答的demo  
\---MachineTranslation： 文本翻译接口

kugouMusic：酷狗音乐  
\---FucUtil： 工具类  
\---KugouDenmo： 酷狗音乐demo  
\---LoginActivity：账号登陆界面

kuwoMusic：酷我音乐  
\---KuwoDemo： 酷我音乐demo

  
mainFunction： 核心功能，一般都要用  
\---AsrActivity ： 识别  
\---InteractActivity：交互demo，包含唤醒+识别+语义+合成全链路功能  
\---LocalTTSActivity：离线语音合成  
\---TTSActivity: 在线语音合成  
\---WakeupActivity： 唤醒

optionalFunction： 可选功能  
\---DynamicEntityActivity 动态实体功能  
\---InteractCertainTimeActivity 唤醒后定时关闭交互  
\---ReadFileTest\_Asr 读取assets音频识别  
\---ReadFileTest\_DenoiseAndAsr 读取assets音频先降噪+识别  
\---SayWhenSeeingActivity 所见即所说  
\---TextNlpActivity 用文本请求语义结果  
\---TransActivity 翻译demo，只支持中译英或英译中

recorder：录音机  
\---AudioRecorder 录音接口  
\---DoubleAlsaRecorder 多麦alsa录音（回采和mic数据在不同声卡）  
\---RecordListener 录音数据回调接口  
\---SingleAlsaRecorder 多麦alsa录音（回采和mic数据在一个声卡）  
\---SystemRecorder android系统录音机

utils：工具类  
具体查看文件开头说明

  
assets目录  
\-audio  
\---16k16bit-1ch1mic-weather.pcm 测试音频  
\---16k16bit-1ch1mic-xiaofeixiaofei+weather.pcm 测试音频  
\---16k16bit-6ch-4mic-zhaiboshu.pcm 窄波束测试音频  
\---offline.mp3 离线提示音  
\---wakeResponse.mp3 唤醒提示音

\-cfg  
\---aiui.cfg aiui识别+语义+合成的配置文件  
\---aiui\_kugouDemo.cfg 与aiui.cfg只有appid和key不一样，方便测试音乐  
\---aiui\_localtts.cfg 离线合成配置文件，把tts配置部分复制到aiui.cfg即可生效  
\---aiui\_sayWhenSeeing.cfg 所见即所说demo配置  
\---aiui\_translate.cfg 翻译demo配置  
\---vtn.ini 降噪唤醒算法配置（1麦，2麦，4麦，6麦）  
\---vtn-zhaiboshu.ini 线形4麦窄波束算法配置，非窄波束用vtn.ini  
\---xiaofeixiaofei-V317-Deep.bin 唤醒词：小飞小飞，317版本

\-data  
\---data\_contact.txt 动态实体具体词库

localRes  
\---resource1.txt 随机播放资源的示例网址  
\---senselessWord.txt 无意义词库，开发者自己可以不断更新

\-vad  
\---evad\_16k.jet vad算法模型

\-xtts  
\---xtts\_common.jet 离线合成基础模型  
\---xtts\_xiaoyan.jet 离线合成发音人，小燕

\-jnilibs  
\---[libaiui.so](http://libaiui.so) aiui算法库  
\---[libalsa-jni.so](http://libalsa-jni.so) alsa录音库，只有alsarecorder需要此文件，android系统录音不需要此文件  
\---[libcae-jni.so](http://libcae-jni.so) 唤醒引擎的jni实现，不用唤醒功能可以去掉  
\---[libvtn\_xxx.so](http://libvtn_xxx.so) 唤醒算法库  
\---AIUI.jar  
\---AlsaRecorder.jar alsarecorder的jar包，android系统录音不需要此文件  
\---cae.jar 唤醒引擎的jar包，不用唤醒功能可以去掉

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)