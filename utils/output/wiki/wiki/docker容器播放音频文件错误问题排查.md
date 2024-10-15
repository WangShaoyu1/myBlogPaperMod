---
author: "王宇"
title: "docker容器播放音频文件错误问题排查"
date: 六月20,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 254
---
*   1[1\. 查看Linux系统中音频设备的列表的](#docker容器播放音频文件错误问题排查-查看Linux系统中音频设备的列表的)
*   2[2\. aplay (Advanced Linux Sound Architecture)显示了系统上可用的音频播放硬件设备](#docker容器播放音频文件错误问题排查-aplay\(AdvancedLinuxSoundArchitecture\)显示了系统上可用的音频播放硬件设备)
*   3[3\. aplay 播报音频文件](#docker容器播放音频文件错误问题排查-aplay播报音频文件)
*   4[4\. 查看可播放设备](#docker容器播放音频文件错误问题排查-查看可播放设备)

  

1\. 查看Linux系统中音频设备的列表的
======================

  

[?](#)

`cat` `/``poc``/``asound``/``cards`

`0` `[HDA ]: tegra``-``hda` `-` `NVIDIA Jetson Orin NX HDA`

`NVIDIA Jetson Orin NX HDA at` `0x3518000` `irq` `120`

`1` `[APE ]: tegra``-``ape` `-` `NVIDIA Jetson Orin NX APE`

`NVIDIA``-``NVIDIAJetsonOrinNXEngineeringReferenceDeveloperKit``-``NotSpecified``-``Jetson`

  

从输出来看，您的设备上有两个音频卡：

1.  编号为0的音频卡（\[HDA\]）
    *   名称：tegra-hda
    *   描述：NVIDIA Jetson Orin NX HDA
    *   物理地址：位于内存地址0x3518000，中断号为120
2.  编号为1的音频卡（\[APE\]）
    *   名称：tegra-ape
    *   描述：NVIDIA Jetson Orin NX APE
    *   描述中还包括了硬件平台的信息（NVIDIA-NVIDIAJetsonOrinNXEngineeringReferenceDeveloperKit-NotSpecified-Jetson）

  

注意：

*   HDA（High Definition Audio）通常指的是支持高清音频的硬件和驱动程序。
*   APE（Audio Processing Engine）可能是指某种特定的音频处理引擎或硬件加速器，用于处理音频信号

2\. aplay (Advanced Linux Sound Architecture)显示了系统上可用的音频播放硬件设备
==============================================================

是 ALSA (Advanced Linux Sound Architecture) 的一个命令行工具，用于播放音频文件

如果提示"not found" 的错误消息。

以下命令安装

> sudo apt-get update
> 
> sudo apt-get install alsa-utils

输出显示了系统上可用的音频播放硬件设备

[?](#)

`aplay` `-l`

`**** List of PLAYBACK Hardware Devices ****`

`card 0: HDA [NVIDIA Jetson Orin NX HDA], device 3: HDMI 0 [HDMI 0]`

`Subdevices: 1/1`

`Subdevice` `#0: subdevice #0`

`card 0: HDA [NVIDIA Jetson Orin NX HDA], device 7: HDMI 1 [HDMI 1]`

`Subdevices: 1/1`

`Subdevice` `#0: subdevice #0`

`card 0: HDA [NVIDIA Jetson Orin NX HDA], device 8: HDMI 2 [HDMI 2]`

`Subdevices: 1/1`

`Subdevice` `#0: subdevice #0`

`card 0: HDA [NVIDIA Jetson Orin NX HDA], device 9: HDMI 3 [HDMI 3]`

`Subdevices: 1/1`

`Subdevice` `#0: subdevice #0`

`card 1: APE [NVIDIA Jetson Orin NX APE], device 0: tegra``-dlink``-0 XBAR-ADMAIF1-0 []`

`Subdevices: 1/1`

`Subdevice` `#0: subdevice #0`

  

  

信息：

1.  **List of PLAYBACK Hardware Devices**
    
    *   这表示列出了所有可用于音频播放的硬件设备。
2.  **card 0: HDA \[NVIDIA Jetson Orin NX HDA\], device 3: HDMI 0 \[HDMI 0\]**
    
    *   `card 0`: 这是音频卡的编号，通常与 `/proc/asound/cards` 中列出的卡相对应。
    *   `HDA`: 这表示音频卡是基于高清音频（High Definition Audio）的。
    *   `NVIDIA Jetson Orin NX HDA`: 这是音频卡的描述，指出了它是NVIDIA Jetson Orin NX平台的HDA音频卡。
    *   `device 3`: 这是音频卡上的设备编号，用于标识特定的音频输出或输入。
    *   `HDMI 0 [HDMI 0]`: 这表示设备3是一个HDMI音频输出，并且编号为0（可能是系统上的第一个HDMI音频输出）。
3.  **Subdevices: 1/1**
    
    *   这表示该设备有一个子设备，并且当前只有一个子设备是可用的。在大多数情况下，这意味着您只有一个输出或输入通道可以使用。
4.  **Subdevice #0: subdevice #0**
    
    *   这是对子设备的具体描述。在这里，只有一个子设备（编号为0），并且没有额外的信息。
5.  **card 1: APE \[NVIDIA Jetson Orin NX APE\], device 0: tegra-dlink-0 XBAR-ADMAIF1-0 \[\]**
    
    *   这与上面的描述类似，但指向了不同的音频卡和设备。
    *   `APE`: 这可能是某种音频处理引擎或加速器的缩写。
    *   `tegra-dlink-0 XBAR-ADMAIF1-0`: 这是该设备在音频卡上的具体标识和配置。
    *   `[]`: 这里的空方括号可能表示没有为该设备提供额外的描述或名称。

系统上有两个音频卡。第一个（card 0）是HDA音频卡，提供了四个HDMI音频输出（HDMI 0到HDMI 3）。第二个（card 1）是APE音频卡，具有一个名为`tegra-dlink-0 XBAR-ADMAIF1-0`的音频设备。每个设备都只有一个可用的子设备，这通常意味着每个设备都只有一个音频通道。

3\. aplay 播报音频文件
================

> aplay xxx.wav

错误1

> aplay: main:831: audio open error: No such file or directory

如果确定wav文件存在，并且有权限访问，则需要通过-D 参数切换播放设备

命令如下

> aplay -D hw:x,y xxx.wav

4\. 查看可播放设备
===========

在/dev/snd目录下面查看设备，其中pcmC0D8p ，0,8就是hw中x,y需要填写的值

  

[?](#)

1

2

3

4

5

6

`ls`

`by-path pcmC0D8p pcmC1D10p pcmC1D13c pcmC1D15p pcmC1D18c pcmC1D1p pcmC1D4c pcmC1D6p pcmC1D9c`

`controlC0 pcmC0D9p pcmC1D11c pcmC1D13p pcmC1D16c pcmC1D18p pcmC1D2c pcmC1D4p pcmC1D7c pcmC1D9p`

`controlC1 pcmC1D0c pcmC1D11p pcmC1D14c pcmC1D16p pcmC1D19c pcmC1D2p pcmC1D5c pcmC1D7p timer`

`pcmC0D3p pcmC1D0p pcmC1D12c pcmC1D14p pcmC1D17c pcmC1D19p pcmC1D3c pcmC1D5p pcmC1D8c`

`pcmC0D7p pcmC1D10c pcmC1D12p pcmC1D15c pcmC1D17p pcmC1D1c pcmC1D3p pcmC1D6c pcmC1D8p`

  

  

可以一个一个试看哪个能正常播放。或者用aiui里面的函数查找可以用的播放设备

  

  

>  int count = aiui\_pcm\_player\_get\_output\_device\_count();  
>  LOG\_INFO("device size:{}",count);  
>  for(int i=0;i<count;i++){  
>     int r = aiui\_pcm\_player\_init(i);  
>     LOG\_INFO("i:{},deviceName:{}",i,string(aiui\_pcm\_player\_get\_device\_name(i)));  
>     if (r==0){  
>         LOG\_INFO("init success");  
>       break;  
>    }  
>  }

  

如果选择可用的播放设备后

> aplay -D hw:1,0 xxx.wav

继续报错

> aplay: main:831: audio open error: Device or resource busy

![(悲伤)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/sad.svg)![(悲伤)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/sad.svg)![(悲伤)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/sad.svg)

表示当前设备被占用了。输入以下命令查看被谁占用了

  

> fuser -v /dev/snd/pcmC1D0\*

  

如果提示not found。继续安装库

  

> apt install psmisc

继续输入以上查看命令，大概会有如下命令

  

> fuser -v /dev/snd/pcmC1D0\*  
> USER PID ACCESS COMMAND  
> /dev/snd/pcmC1D0c: root 1 F...m yingzi\_vdh  
> /dev/snd/pcmC1D0p: root 1 F...m yingzi\_vdh

玛尼，自己的应用给占用了。查看自己的代码哪里会使用播放设备的

  

比如上述AIUI的代码，初始化成功它就会占着播放设备。

> aiui\_pcm\_player\_init

  

如果不是自己应用。是其他不相干的应用，那就无情的给kill它，-9表示强制终止

  

> kill -9 pid

  

  

OK。继续调用播放文件命令

  

> aplay -D hw:1,0 xxx.wav

如果出现以下信息。恭喜你。播放成功啦![(吐舌头)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/tongue.svg)。

Playing WAVE 'AIUI/audio/test.wav' : Signed 16 bit Little Endian, Rate 48000 Hz, Stereo

如果不是以上信息。或者还是报错不是以上的出现的错误。![(悲伤)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/sad.svg)那就继续解决。并且更新此文档

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)