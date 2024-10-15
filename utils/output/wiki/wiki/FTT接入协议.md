---
author: "王宇"
title: "FTT接入协议"
date: 八月21,2024
description: "五、系统架构设计"
tags: ["五、系统架构设计"]
ShowReadingTime: "12s"
weight: 113
---
1、支持自定义参数传输

2、支持路由转发

客户端支持传参。HaiSDK.InstancePlayCloudBehavior接口新加2个参数String args，stream，bool args。由客户端设置。args长度4000个字符。同时，把这个参数传给后端的接口。由后端的接口接收，进行业务处理。

http和SSE（Server-Send Events）

### 请求说明

#### 基本信息

**请求地址：** `https://域名/bfv/v1/chat`

**域名**`：api-vdh.[环境].yingzi.com`

**请求方式：** POST

#### Header参数

名称

值

名称

值

Content-Type

application/json

  

#### Query参数

名称

类型

必填

描述

名称

类型

必填

描述

  

  

  

  

#### Body参数

名称

类型

必填

描述

stream

bool

否

是否以流式接口的形式返回数据，默认false

uuid

string

是

客户端唯一id，推荐mac地址、用户唯一信息

message

string

是

当前请求的信息

args

string

是

客户端传什么，透传即可

1.  //影子  
    YINGZI("1"),
2.  //讯飞星火认知大模型  
    SPARK\_CHAT("2"),
3.  //讯飞文档问答  
    SPARK\_DOCCHAT("3"),
4.  //影子文档问答  
    YINGZI\_DOCCHAT("4"),
5.  //aiui  
    SPARK\_AIUI("5");
6.  //阿里通义千问qwen-plus  
    ALI\_QWEN\_PLUS("6");
7.  万得厨双屏2.0对话服务（新）WDC\_CHAT\_V2("9")

#### 请求示例

[?](#)

`{`

    `"stream"``:` `false``,`

    `"uuid"``:``"08:fb:ea:b3:bf:96"``,`

    `"message"``: “广州天气”,`

    `"args"``:` `"{\"channel_id\":\"2\"}"`

`}`

  

### 响应说明

名称

类型

描述

名称

类型

描述

id

string

本轮对话的id

created\_time

int

时间戳

sentence\_id

int

表示当前子句的序号。只有在流式接口模式下会返回该字段

is\_end

bool

表示当前子句是否是最后一句。只有在流式接口模式下会返回该字段

result

string

对话返回结果

#### 响应示例

[?](#)

`HTTP /` `1.1` `200` `OK`

`Date: Thu,` `23` `Mar` `2023` `03``:` `12``:` `03` `GMT`

`Content - Type: application / json;`

`charset = utf -` `8`

`Statement: AI - generated`

`{`

    `"id"``:` `"as-bcmt5ct4iy"``,`

    `"created_time"``:` `1680167072``,`

    `"result"``:` `"helloworld"``,`

    `"sentence_id"``:` `1``,`

    `"is_end"``:` `false`

`}`

#### 响应示例（流式）

[?](#)

`HTTP/``1.1` `200` `OK`

`Date: Mon,` `12` `Apr` `2021` `06``:``27``:``55` `GMT`

`Content-Type: text/event-stream;charset=utf-``8`

`Cache-Control: no-cache`

`Statement: AI-generated`

`{``"id"``:``"as-bcmt5ct4iy"``,``"created_time"``:``1680167072``,``"result"``:``"helloworld1"``,``"sentence_id"``:``1``,``"is_end"``:``false``}`

`{``"id"``:``"as-bcmt5ct4i1"``,``"created_time"``:``1680167072``,``"result"``:``"helloworld2"``,``"sentence_id"``:``2``,``"is_end"``:``false``}`

`{``"id"``:``"as-bcmt5ct4i2"``,``"created_time"``:``1680167072``,``"result"``:``"helloworld3"``,``"sentence_id"``:``3``,``"is_end"``:``true``}`

  

#### 响应示例（万得厨双屏2.0对话服务）

详细参数：[对话接口v3](/pages/viewpage.action?pageId=129200195)

[?](#)

`HTTP /` `1.1` `200` `OK`

`Date: Thu,` `23` `Mar` `2023` `03``:` `12``:` `03` `GMT`

`Content - Type: application / json;`

`charset = utf -` `8`

`Statement: AI - generated`

`{`

    `"id"``:` `"1275847897318256640"``,`

    `"result"``:` `"{\"type\":\"NORMAL\",\"replyContent\":\"当然可以！这是一个关于微波炉的笑话，希望你喜欢：\\n\\n有一天，一个微波炉对冰箱说：“我看你总是一脸冷漠，是不是对我有意见啊？”\\n\\n冰箱回答：“没有啊，我只是天生冷酷而已。”\\n\\n希望这个小笑话能给你带来一丝欢乐！如果你有任何其他问题或需要帮助，随时告诉我哦！\",\"finishReason\":\"STOP\",\"end\":true}"``,`

    `"created_ime"``:` `1724227442828``,`

    `"sentence_id"``:` `1``,`

    `"is_end"``:` `true`

`}`

`{`

  `"id"``:` `"1275849210707550208"``,`

  `"result"``:` `"{\"type\":\"COMMAND\",\"replyContent\":\"{\\\"name\\\":\\\"cooking_unfreeze\\\",\\\"arguments\\\":[{\\\"material\\\":\\\"牛肉丸\\\"}]}\",\"finishReason\":\"TOOL_EXECUTION\",\"end\":true}"``,`

  `"created_ime"``:` `1724227755964``,`

  `"sentence_id"``:` `1``,`

  `"is_end"``:` `true`

`}`

**result json字段说明：**

字段

字段说明

备注

字段

字段说明

备注

type

回复的类型

命中指令：COMAND，普通问答：NORMAL

replyContent

回复的内容

命中指令时回复指令的json字符串，如下所示：

"{\\"name\\":\\"set\_cooking\_temp\\",\\"arguments\\":\[{\\"cooking\_temp\\":100}\]}"

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)