---
author: "王宇"
title: "0530HM团队提供的接口协议--虚拟人团队反馈0530InterfaceprotocolprovidedbyHMteam--Feedbackfromvirtualhumanteam"
date: 五月30,2024
description: "虚拟人模块协议对接疑问Protocolsareinterrogated"
tags: ["虚拟人模块协议对接疑问Protocolsareinterrogated"]
ShowReadingTime: "12s"
weight: 187
---
1\. 原接口协议格式 Original interface protocol format
==============================================

1.1. request
------------

[?](#)

1

2

3

4

5

6

7

8

9

10

`{`

    `"route_message_id"``:` `231``,`

    `"command"``:``"voice_cmd_start_cooking_DIY"``,`

    `"cooking_instruction"``:`

    `{`

        `"power"``:<``int``>,`

        `"heating_interval"``:<``int``>`

    `},`

    `"timestamp"``:` `"2024-04-14T07:51:05:000"`

`}`

1.2. reponse
------------

[?](#)

1

2

3

4

5

`{`

    `"route_message_id"``:` `232``,`

    `"status"``:` `0``,`

    `"timestamp"``:` `"2024-04-14T07:51:05:000"`

`}`

2\. 反馈意见 Feedback
=================

序号

request

reponse

序号

request

reponse

1

将字段cooking\_instruction，修改一个一个通用性更强的变量名，例如data、inputParams

Change the field "cooking\_instruction" to a more general variable name, such as "data", "inputParams", or other

**1、增加字段**：

*   data:响应返回的数据
*   mgs:异常情况下给用户的提示语句

Add fields:

data: response data returned  
mgs: Prompt statement given to the user under abnormal circumstances

2

  

**2、枚举status的所有情况**

Enumerate all status conditions

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)