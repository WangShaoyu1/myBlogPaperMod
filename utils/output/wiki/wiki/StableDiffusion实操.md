---
author: "王宇"
title: "StableDiffusion实操"
date: 十一月07,2023
description: "3DAIGC探索"
tags: ["3DAIGC探索"]
ShowReadingTime: "12s"
weight: 727
---
相关背景介绍与准备工作不进行赘述，感兴趣的可以参考[Stable Diffusion从0-1入门教程](https://hirhjymu5h6.feishu.cn/wiki/wikcnVqZbp95hVh6FxCClOXWqzd?table=tblwyCS6YnNRrQD9&view=vewL1wE4bF)及相关教学视频。以下直接介绍相关模型与插件输出情况，及关键提示词与参数。

在[3D AIGC探索](/pages/viewpage.action?pageId=109729702)中，我们提及目前一条3D模型生成的技术路线是在类似SD的2D生成技术与模型基础上开展的，那么，了解SD可实现的能力情况、并依据我们新增形象的需求获得一些相关输出即是本次实操工作的目的。

1、几个关键概念
--------

1.1 SD的模型包含基础模型（checkpoint)、Lora模型、Embedding等，通过不同基础模型与插件模型组合，可以获得不同风格的输出；也可以上传自己的资源，自行训练对应风格的模型；  
1.2 controlNet插件（openpose编辑器等），通过结合插件的使用，有效进行输出控制；

2、文生图参数
-------

![](/download/thumbnails/109731887/00008-2040493799-%28masterpiece%2C%20best%20quality%2C%20absurdres%2C%20foreshortening%29%2C%20photo%20of%20a%20highly%20detailed%2C%28full%20body_1.2%29%2C%20smile%2Ccute%20face%20%2C%20black%20hair.png?version=1&modificationDate=1698915893322&api=v2)

参数：  
<lora:blindbox\_V1Mix:1>(masterpiece, best quality, absurdres, foreshortening), photo of a highly detailed,(full body:1.2), smile,cute face , black hair, chef apron，white shirt, chef hat ,(studio background),(clean background),(blurry background), 1boy, chibi, (beautiful detailed face), (beautiful detailed eyes),standing in kitchen, rendered in blender  
Negative prompt: (low quality:1.3), (worst quality:1.3),pointy ears, animal ears, watermark, logo, text, badhandv4,(naked/nude, )  
Steps: 25, Sampler: DPM++ SDE Karras, CFG scale: 7, Seed: 2040493799, Size: 728x728, Model hash: d725be5d18, Model: revAnimated\_v11, Clip skip: 2, ENSD: 31337, Version: v1.2.1  
  
![](/download/thumbnails/109731887/B0lQf7QiDYNLxQ33k1z8B.png?version=1&modificationDate=1699350847762&api=v2)   使用图生图重绘后：![](/download/thumbnails/109731887/Mo2AwfgA1GTY8RQpwUjcJ.png?version=1&modificationDate=1699351169643&api=v2)  

参数：  
masterpiece, best quality, ultra-detailed, ((full body::1.2), chibi, cute, 1boy, coat, vest, jeans, short hair, evil smile, <lora:blindbox\_v1\_mix:0.600000>, , <lora:chibi-v1:1.000000> Negative prompt: (low quality:1.3), (worst quality:1.3)(worst quality:2), (low quality:2), (normal quality:2), low-res, ((monochrome)), ((grayscale)), bad anatomy, DeepNegative, skin spots, acne, skin blemishes, (fat:1.2), facing away, looking away, tilted head, low-res, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, poorly drawn hands, poorly drawn face, mutation, deformed, extra fingers, extra limbs, extra arms, extra legs, malformed limbs, fused fingers, too many fingers, long neck, cross-eyed, mutated hands, polar low-res, bad body, bad proportions, gross proportions, missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, teethcroppe, signature, watermark, username, blurry, cropped, jpeg artifacts, text, error Steps: 28, Sampler: Euler a, CFG scale: 7.0, Seed: 3911841639, Size: 576x1024, Model: revAnimated\_v122: 539ed169eca1  

3、图生图参数
-------

原始图片：![](/download/thumbnails/109731887/image2023-11-2_17-12-35.png?version=1&modificationDate=1698916355810&api=v2) 生成图片：![](/download/thumbnails/109731887/image2023-11-2_17-10-41.png?version=1&modificationDate=1698916241993&api=v2)

参数：  
simplebackground,photo of a highly detailed,(full body:1.2), pointed ears,cute face , black hair, green chef apron,white shirt, chef hat,1boy, chibi, (beautiful detailed face), (beautiful detailed eyes), rendered in blender, full body <lora:blindbox\_V1Mix:0.8>  
Negative prompt: lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry  
Steps: 25, Sampler: Euler a, CFG scale: 10, Seed: 2787052679, Size: 500x1000, Model hash: 8679b26ff7, Model: disneyPixarCartoonTypeA\_10, Denoising strength: 0.5, Clip skip: 2, ENSD: 31337, Version: v1.2.1

4、ControlNet插件
--------------

4.1 openpose  
原提示词生成图片：![](https://wiki.yingzi.com/download/attachments/109731887/00008-2040493799-%28masterpiece%2C%20best%20quality%2C%20absurdres%2C%20foreshortening%29%2C%20photo%20of%20a%20highly%20detailed%2C%28full%20body_1.2%29%2C%20smile%2Ccute%20face%20%2C%20black%20hair.png?version=1&modificationDate=1698915893322&api=v2)  进行姿势控制后： ![](/download/thumbnails/109731887/image2023-11-7_11-18-10.png?version=1&modificationDate=1699327090977&api=v2) 

使用openpose识别原姿势：  
![](/download/attachments/109731887/image2023-11-7_11-11-47.png?version=1&modificationDate=1699326707918&api=v2)

使用openpose编辑器将姿势编辑为期望输出的形态  
![](/download/thumbnails/109731887/image2023-11-7_11-10-18.png?version=1&modificationDate=1699326619106&api=v2)

将姿势图片传回controlNet，使用2中一致提示词进行生成时，勾选ControlNet，参数设置如下：  
![](/download/attachments/109731887/image2023-11-7_11-16-42.png?version=1&modificationDate=1699327002929&api=v2)

输出：  
![](/download/thumbnails/109731887/image2023-11-7_11-17-59.png?version=1&modificationDate=1699327079489&api=v2)  
凌乱背景可使用局部重绘处理，黯淡的色彩可添加VAE处理，限于GPU配置，这里不继续演示。

  

5、符合风格需求的模型参考
-------------

checkpoint：  
![](/download/attachments/109731887/image2023-11-7_18-10-39.png?version=1&modificationDate=1699351839900&api=v2)

Lora：  
![](/download/attachments/109731887/image2023-11-7_18-12-23.png?version=1&modificationDate=1699351944089&api=v2)

Embedding：  
![](/download/attachments/109731887/image2023-11-7_18-13-42.png?version=1&modificationDate=1699352023078&api=v2)

[Filter table data]()[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)