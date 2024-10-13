---
author: "王宇"
title: "虚拟人模块协议对接疑问Protocolsareinterrogated"
date: 五月30,2024
description: "15.3HM团队对接"
tags: ["15.3HM团队对接"]
ShowReadingTime: "12s"
weight: 187
---
1\. request
===========

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

2\. reponse
===========

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

3\. 分析与疑问
=========

3.1. route\_message\_id生成规则不清晰
------------------------------

route\_message\_id 是怎么生成的？ How it was generated route\_message\_id 

route\_message\_id发送的和回复的为什么不一样？建议保持一致，这样以后如果是出现批量异步处理的话，就能够准确实现请求和响应一一对应上，不会出现请求和响应乱序对应的情况；

Why is it different from what route\_message\_id sends and what you reply?  It is recommended to save consistently, so that if it is processed asynchronously in the future, you will know which request to reply to

3.2. 返回的数据字段缺失
--------------

有些指令接口需要有数据返回

3.3. 状态码定义不全
------------

status=0 正常情况。 

status=0 Normal

status=非0 异常情况，每个异常情况都要有状态码区分 

For abnormal cases, each abnormal situation must be distinguished by a status code

  

状态码除了正常、不正常，还有其他的状态 ，可以根据不同的状态码给用户不同的提示以及执行不同的后续逻辑

3.4. msg字段缺失
------------

根据msg字段给与用户提示

3.5. request入参字段名称通用性不够
-----------------------

如果指令的request有入参，字段cooking\_instruction，名称改为通用字段data

4\. 建议
======

4.1. 确定每个阶段的时间点
---------------

1、项目接入虚拟人模块，虚拟人团队研发人员能够运行项目，完成时间：

2、跑通两个基础指令：开始烹饪、暂停烹饪，验证协议，完成时间：

3、定义剩余指令的协议详情，截至日期：

4、逐个指令调试，截至日期：

  

4.2. request入参增加一个字段source
--------------------------

举例：

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

11

`{`

    `"route_message_id"``:` `231``,`

    `"command"``:``"voice_cmd_start_cooking_DIY"``,`

    `"cooking_instruction"``:`

    `{`

        `"power"``:<``int``>,`

        `"heating_interval"``:<``int``>`

    `},`

    `"timestamp"``:` `"2024-04-14T07:51:05:000"``,`

    `"source"``:` `"avatar"``,`

`}`

`"source"``:` `"avatar"``,表明该指令是由虚拟人模块发送`

4.3. reponse增加字段 data、msg
-------------------------

[?](#)

1

2

3

4

5

6

7

`{`

    `"route_message_id"``:` `232``,`

    `"status"``:` `0``,`

    `"timestamp"``:` `"2024-04-14T07:51:05:000"``,`

    `"data"``:{} or [],`     

   `"msg“:"``xxx",`

`}`

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)