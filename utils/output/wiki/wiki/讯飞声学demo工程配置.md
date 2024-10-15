---
author: "王宇"
title: "讯飞声学demo工程配置"
date: 四月13,2024
description: "黄圆成"
tags: ["黄圆成"]
ShowReadingTime: "12s"
weight: 324
---
*   1[1\. 参数配置](#id-讯飞声学demo工程配置-参数配置)
    *   1.1[1.1. 参数配置：](#id-讯飞声学demo工程配置-参数配置：)
    *   1.2[1.2. 录音设备调试：](#id-讯飞声学demo工程配置-录音设备调试：)
    *   1.3[1.3. 说话后识别效果与预期有较大差距](#id-讯飞声学demo工程配置-说话后识别效果与预期有较大差距)
    *   1.4[1.4. 工程编译](#id-讯飞声学demo工程配置-工程编译)

1\. 参数配置
========

1.1. 参数配置：
----------

1.  请在aiui开放平台注册账号，新建应用后更新aiui.cfg文件中的appid、key、api\_secret参数  
    以及vtn.ini文件中的appid参数  
    可参考链接：[https://www.yuque.com/g/iflyaiui/zzoolv/roc0sr/collaborator/join?token=ER24uppdcojlEroH&source=doc\_collaborator#](https://www.yuque.com/g/iflyaiui/zzoolv/roc0sr/collaborator/join?token=ER24uppdcojlEroH&source=doc_collaborator) 《创建AIUI账号并替换应用appid》
2.  1069版本之后，aiui\_sample支持vtn单麦及多麦唤醒  
    另外需在aiui.cfg中做如下两项配置：  
    1)、speech->wakeup\_mode的取值改为“vtn”, 默认情况下该值为“off”;  
    2)、speech->audio\_captor的取值改为“portaudio”, 默认情况下该值为“off”;
3.   默认唤醒词为 “小飞小飞”， 若要更换唤醒词，需在平台资源制作中下载3.17版，将其中的 res.bin 覆盖掉 AIUI/assets/vtn/res.bin

  

AIUI文档中心：[https://aiui-doc.xf-yun.com/project-1/doc-13/](https://aiui-doc.xf-yun.com/project-1/doc-13/)

/\* AIUI参数配置 \*/

[?](#)

`{`

    `/* 鉴权参数，请填写aiui官网的appid和key，此处为示例。key下载的时候隐式配置了，如果切换appid需要显式配置 */`

    `"login"``:{`

        `"appid"``:` `"e4xxxxa8"``,`

        `/* app对应的授权key，在AIUI开放平台我的应用信用中查看。一般不用配置，若是appid与下载页面所处应用一致则不用配置 */`

        `"key"``:``"xxxxxx3046f936c3594c4baf7a8f5356"``,`

        `/* api密钥，在AIUI开放平台我的应用信用中查看。一般不用配置，若是appid与下载页面所处应用一致则不用配置 */`

        `"api_secret"``:` `"xxxxxx"`

    `},`

    `// 识别（音频输入）参数`

    `"iat"``:{`

        `"sample_rate"``:``"16000"`

    `}`

`}`

  

创建AIUI账号并替换应用appid：[https://www.yuque.com/iflyaiui/zzoolv/roc0sr](https://www.yuque.com/iflyaiui/zzoolv/roc0sr)

更新APPID到sdk的aiui.cfg  
更新KEY到sdk的aiui.cfg 

最新版本 sdk 中 secret 也需要添加进去

  

修改音频设备参数：

AIUI\\cfg\\aiui.cfg

[?](#)

`{`

    `/* 唤醒参数 */`

    `"ivw"``: {`

        `"mic_type"``:` `"line_mic2"``,`

        `"res_path"``:` `"AIUI/assets/vtn/vtn.ini"`

    `},`

    `/* 合成参数 */`

    `"tts"``: {`

        `"engine_type"``:` `"cloud"`

    `},`

    `/* 业务流程相关参数 */`

    `/* 语音业务流程 */`

    `"speech"``: {`

        `"data_source"``:` `"sdk"``,`

        `"wakeup_mode"``:` `"vtn"``,`

        `"interact_mode"``:` `"oneshot"``,`

        `"intent_engine_type"``:` `"cloud"``,`

        `"audio_captor"``:` `"portaudio"`

    `},`

    `/* 音频转换参数 */`

    `"recorder"``: {`

        `"sound_card_name"``:``"NVIDIA Jetson Orin NX APE"``,`

        `"sample_size"``: 2,`

        `"channel_count"``: 4,`

        `"channel_filter"``:` `"0,1,2,2"`

    `}`

`}`

  

  

唤醒词资源更换，自定义唤醒词

修改AIUI\\assets\\vtn\\vtn.ini res\_path为自定义唤醒词资源 

[?](#)

`[ivw]`

`ivw_enable = 1`

`#唤醒资源res`

`res_path=AIUI/assets/vtn/xiaowangxiaowan.bin`

  

1.2. 录音设备调试：
------------

[?](#)

`arecord -l 查看设备，找到对应的设备card x (x:正确录音设备）,将hw:2,0改为hw:1,0`

`arecord -D hw:1,0 --period-size=1024 --buffer-size=4096 -r 16000 -c 4 -f s16_le` `/tmp/test``.wav`

  

1.3. 说话后识别效果与预期有较大差距
--------------------

可以拿原始音频测试看看，  
createagent后调用下这个agent->sendMessage(IAIUIMessage::create(AIUIConstant::CMD\_START\_SAVE, 0, 0, "data\_type=raw\_audio", NULL));  
再开启录音，保存在当前可执行程序的AIUI/audio目录文件夹下 。

  

1.4. 工程编译
---------

[?](#)

`.``/make``.sh aarch64-3308 aarch64-linux-gnu-g++`

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)