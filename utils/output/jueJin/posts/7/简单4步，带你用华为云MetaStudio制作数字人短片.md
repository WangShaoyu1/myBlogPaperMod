---
author: "华为云开发者联盟"
title: "简单4步，带你用华为云MetaStudio制作数字人短片"
date: 2024-06-05
description: "教大家如何用华为云MetaStudio数字内容生产线制作数字人视频，主要包括两种制作数字人视频的方式，一种直接在console上操作，另一种用API制作。"
tags: ["人工智能","API","AIGC中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:3,views:745,"
---
本文分享自华为云社区《[使用MetaStudio生产线四步制作数字人视频](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428390%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428390?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： yd\_298097624。

随着AIGC新技术尤其是大模型技术的发展，音视频行业、数字内容生产行业正在经历这从生产方式和生产效率上的一个巨大变化。预测到2030年由AI大模型生成的数字内容比例将高达90%，包括通过AIGC来生成数字人，数字人视频等，本博文就来教大家如何用华为云MetaStudio数字内容生产线制作数字人视频。本文介绍了两种制作数字人视频的方式，一种直接在console上操作，另一种用API制作。

1 开通MetaStudio服务
----------------

进入【数字内容生产线MetaStudio】，在搜索框中输入MetaStudio，点击进入服务。

![image](/images/jueJin/130f69b7ab5849e.png)

![image](/images/jueJin/4738e8bd167244b.png)

点击【分身数字人视频制作】的【开通】按钮。

![image](/images/jueJin/708d6077bf2049e.png)

![image](/images/jueJin/7a7cbba6039648b.png)

![image](/images/jueJin/42ac6b541c4f48e.png)

点击【前往MetaStudio工作台】。

![image](/images/jueJin/a066e538815d4de.png)

2 工作台制作视频
---------

### 2.1 进入分身视频制作

点击【分身视频制作】的【开始创建】按钮，进入工作台。

![image](/images/jueJin/a1dff440dcd04e9.png)

### 2.2 选择数字人模型

点击【角色】按钮，可以查看所有系统内置的数字人模型，选择一个用来制作视频。

![image](/images/jueJin/f43ae257d31b496.png)

### 2.3 选择视频背景

点击【背景】按钮，可以查看所有系统内置的背景图片，选择一个用来制作视频。

![image](/images/jueJin/3c5e95ea96694b3.png)

### 2.4 选择音色和输入视频文案内容

点击【亲切女声】按钮，可以查看所有系统内置的音色，选择一个用来制作视频。  
将下列文本拷贝到文本输入框中。

MetaStudio数字内容生产线依托自研的图形引擎MetaEngine、国产昇腾AI云服务器算力；提供3D IP型数字人、2D分身数字人快速生成及定制服务；AI重塑数字内容生产，使能视频制作、直播、交互应用。

![image](/images/jueJin/a1966e60b1644e1.png)

### 2.5 合成视频

点击【合成视频】按钮，输入合成视频的文件名，点击【确认】按钮开始合成。

![image](/images/jueJin/79d6829963b9436.png)

![image](/images/jueJin/4d111e9d9cc24bd.png)

可以通过刷新按钮查看合成进度。

![image](/images/jueJin/d72060d3b4754b9.png)

![image](/images/jueJin/de6bb8daf27d460.png)

视频制作完成后，点击封面，可以查看视频内容。

![image](/images/jueJin/379e89df1cb6407.png)

3 API制作数字人视频
------------

### 3.1 进入API Explorer

通过下面URL进入API Explorer。  
[console.huaweicloud.com/apiexplorer…](https://link.juejin.cn?target=https%3A%2F%2Fconsole.huaweicloud.com%2Fapiexplorer%2F%23%2Fopenapi%2FMetaStudio%2Fdoc "https://console.huaweicloud.com/apiexplorer/#/openapi/MetaStudio/doc")

产品选择【数字内容生产线】

区域选择【华北-北京4】

![image](/images/jueJin/203d2cee5d1d473.png)

### 3.2 查找数字人模型

通过【查询资产列表】接口查询模型资产。

参数设置：

asset\_type：HUMAN\_MODEL\_2D

asset\_source：SYSTEM

请求成功后，在响应体里选择一个模型的资产id，记录下来。

![image](/images/jueJin/1ff3e4d98eb945d.png)

### 3.3 查找视频背景

通过【查询资产列表】接口查询背景资产。

参数设置：

asset\_type：IMAGE

asset\_sourc：SYSTEM

system\_property：BACKGROUND\_IMG:Yes

请求成功后，在响应体里选择一个背景资产的download\_url，记录下来。

注意：可以将limit设置成1，这样响应体不会过大。

![image](/images/jueJin/e27d77c9d01042d.png)

### 3.4 查询音色

通过【查询资产列表】接口查询音色资产。

参数设置：

asset\_type：VOICE\_MODEL

asset\_source：SYSTEM

请求成功后，在响应体里选择一个音色的资产id，记录下来。

![image](/images/jueJin/dfabe2bbeebc41f.png)

### 3.5 创建视频制作任务

通过【创建分身数字人视频制作任务】接口创建任务。

此接口参数较多，先开启【填写默认值】。

参数设置：

```css
video_making_type：MODELmodel_asset_id：填写3.2步骤里请求的数字人模型资产idvoice_config.voice_asset_id:填写3.4步骤里请求的音色资产idvideo_config.codec:H264video_config.bitrate:40video_config.width:1920video_config.height:1080shoot_scripts.shoot_script.text_config.text:视频文案shoot_scripts.shoot_script.background_config:IMAGEshoot_scripts.shoot_script.background_config:填写3.3步骤里请求的背景图片下载地址layer_config：设置为空数组output_asset_config.asset_name:输出视频文件名callback_config.callback_url:空字符串{“video_making_type”: “MODEL”,“model_asset_id”: “d02595480275db780375185ead1cc3da”,“voice_config”: {“voice_asset_id”: “c20e1b59495d3186ef72226fb1e6701b”,“speed”: 100,“pitch”: 100,“volume”: 140},“video_config”: {“clip_mode”: “RESIZE”,“codec”: “H264”,“bitrate”: 40,“width”: 1920,“height”: 1080,“frame_rate”: “25”,“is_subtitle_enable”: false,“subtitle_config”: {“font_name”: “HarmonyOS_Sans_SC_Black”,“font_size”: 16}},“shoot_scripts”: [{“shoot_script”: {“script_type”: “TEXT”,“text_config”: {“text”: “这是一个数字人视频”},“background_config”: [{“background_type”: “IMAGE”,“background_config”: “https://metastudio.obs.cn-north-4.myhuaweicloud.com:443/SYSTEM/d6e7dde03cab4ce06f2c3cbb19f2682c/9fd37af847980ae086c98d282570bd72.png?AWSAccessKeyId=V4JN2MVQB83TCU121H6L&Expires=1714180482&response-content-disposition=attachment%3B+filename*%3Dutf-8’’%E6%96%87%E6%97%85%E9%A3%8E3.png&x-amz-security-token=ggpjbi1ub3J0aC00TX97ImFjY2VzcyI6IlY0Sk4yTVZRQjgzVENVMTIxSDZMIiwibWV0aG9kcyI6WyJ0b2tlbiJdLCJyb2xlIjpbXSwicm9sZXRhZ2VzIjpbXSwidGltZW91dF9hdCI6MTcxNDE4NDUyOTAzMSwidXNlciI6eyJPUy1GRURFUkFUSU9OIjp7Imdyb3VwcyI6W3siaWQiOiIyMjZkYTBmNzQyZDc0MjEzOTAwNjFkZDA1YmUyMGYwZCIsIm5hbWUiOiJjc21zLW9pZGMifV0sImlkZW50aXR5X3Byb3ZpZGVyIjp7ImlkIjoib2lkYy1vcC1NU1MifSwicHJvdG9jb2wiOnsiaWQiOiJvaWRjIn19LCJkb21haW4iOnsiaWQiOiIyZGQwYjdlMTI0MWY0ZDNmOWVlNGE3NjZiMmI1MTAxMSIsIm5hbWUiOiJvcF9zdmNfTWV0YVN0dWRpb19jb250YWluZXIwIn0sImlkIjoiNGJVNzd4SklNMU1Ya1RXWlVtcUc2S2ZZWkNCMkZjM2QiLCJuYW1lIjoiRmVkZXJhdGlvblVzZXIiLCJwYXNzd29yZF9leHBpcmVzX2F0IjoiIiwidXNlcl90eXBlIjo0OH19RWjKsVx3tBB9rC9epefZhRbuWZ5quEBfoMuJWu66lk5-UVSfeQqJ4QA9GH6OzoEfhOS0cUGCYtanfHaUlXyVOZ_-jZ8vaLJuVkjL9fmZWnnsAivrmok0bXud5_EmY9BEg96U1wC4vM-SpZlX7xxQO76EHrXjzSYpN3VCZzBF68kZ6rb8HOx8LjWrt__KwYWBxzTMnnLIht0xw0zo6mdaRJBiWOU1QZ1tJeX-cHuE4j88USL8KY08a8ZtvRl4OOs_9sy2bGO4kySItQhtUJBn_EZG3iC5k0imb7LEhAAMN_yHrb_VJz5nGGEuP0tbVBlJacEQSsVx1qJzFbYkYdwuBw%3D%3D&Signature=sn5CCeq4rXdQBd76p6R8Wu6185I%3D”,“background_color_config”: “#FFFFFF”}],“emotion_config”: [{“emotion”: “HAPPY”}],“layer_config”: []}}],“output_asset_config”: {“asset_name”: “output”,“is_preview_video”: false},“background_music_config”: {“volume”: 100},“callback_config”: {“callback_url”: " ",“auth_type”: “NONE”}}请求成功后，在响应体里返回任务id。
```

![image](/images/jueJin/44b686499d69448.png)

### 3.6 查询任务进度

通过【查询分身数字人视频制作任务详情】接口查询任务进度

参数设置：

job\_id：填写步骤3.5里返回的任务id

当前状态：

WAITING：等待服务器调度

PRCOCESSING：正在制作

FAILED：制作失败，可以在error\_info里查看失败原因

SUCCESS：制作成功

![image](/images/jueJin/7290b23ba3d3468.png)

制作成功后，记录下响应体里返回的视频资产id

![image](/images/jueJin/9fc97638f56a416.png)

### 3.7 查看输出视频

通过【查询资产详情】接口查看输出视频。

参数设置：

asset\_id：填写步骤3.6里记录的视频资产id

请求成功后，在响应体里查看视频的download\_url。

将download\_url复制后，在浏览器中打开，就可以下载到本地了。

![image](/images/jueJin/8aeceb897bce479.png)

文末给大家放一个小福利，仅需19.9元即可制作60分钟的数字人视频啦！[activity.huaweicloud.com/metastudio-…](https://link.juejin.cn?target=https%3A%2F%2Factivity.huaweicloud.com%2Fmetastudio-szr.html "https://activity.huaweicloud.com/metastudio-szr.html")

![cke_28553.png](/images/jueJin/dc584da06a214f2.png)

### HDC 2024，6月21日-23日，东莞松山湖，期待与您相见！

更多详情请关注官网：

中文：[developer.huawei.com/home/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fhdc "https://developer.huawei.com/home/hdc")

英文：[developer.huawei.com/home/en/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fen%2Fhdc "https://developer.huawei.com/home/en/hdc")

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")