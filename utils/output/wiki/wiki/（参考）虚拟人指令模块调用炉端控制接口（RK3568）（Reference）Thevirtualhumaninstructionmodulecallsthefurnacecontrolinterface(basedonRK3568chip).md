---
author: "王宇"
title: "（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）Thevirtualhumaninstructionmodulecallsthefurnacecontrolinterface(basedonRK3568chip)"
date: 五月27,2024
description: "接口"
tags: ["接口"]
ShowReadingTime: "12s"
weight: 124
---
*   1[1\. 协议参数说明Protocol parameter description](#id-（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）Thevirtualhumaninstructionmodulecallsthefurnacecontrolinterface\(basedonRK3568chip\)-协议参数说明Protocolparameterdescription)
    *   1.1[1.1. 请求：request](#id-（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）Thevirtualhumaninstructionmodulecallsthefurnacecontrolinterface\(basedonRK3568chip\)-请求：request)
        *   1.1.1[1.1.1. 字段说明Field description](#id-（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）Thevirtualhumaninstructionmodulecallsthefurnacecontrolinterface\(basedonRK3568chip\)-字段说明Fielddescription)
*   2[2\. 接口详情Interface Details](#id-（参考）虚拟人指令模块调用炉端控制接口（RK3568）（Reference）Thevirtualhumaninstructionmodulecallsthefurnacecontrolinterface\(basedonRK3568chip\)-接口详情InterfaceDetails)

**Virtual human command module calls the furnace control interface.(RK3568)**

1\. 协议参数说明  
Protocol parameter description
===========================================

1.1. 请求：request
---------------

请求参数协议格式如下:  
The format of the request parameter protocol is as follows

[?](#)

`{`

    `"msgType"``:` `"oven.action.execute"``,`

    `"payload"``: {`

        `"data"``: {`

            `"actionCode"``:` `"get_volume_info"``,`

            `"msgId"``:` `"AQSrThoDZRUA5egu"``,`

            `"pid"``:` `"SYSTEM-010"``,`

            `"inputParams"``: {},`

            `"source"``:` `"avatar"``,`

            `"time"``:` `1700703060027`

        `}`

    `}`

`}`

  

### 1.1.1. 字段说明  
Field description

msgType 表示当前请求类型，（必须）

Indicates the current request type (mandatory)

1.   oven.action.execute表示（动作），Indicates (action).
2.   oven.property.set 表示属性 Indicates attribute
3.   oven.event.trigger 表示事件。Indicates event

字段 field

是否必须  
required?

描述description

备注remark

字段 field

是否必须  
required?

描述description

备注remark

pid

yes

动作标识（请求类型是动作时才有，其他无）

  

actionCode

yes

动作标识（请求类型是动作时才有，其他无）Indicates which function is currently being used

  

time

yes

当前时间戳（必须）Current timestamp

  

msgId

yes

随机16字符串（必须）Random 16-character string

  

inputParams

no

参数列表（可有可无）Parameter lis

  

  

  

  

  

其他参数请求固定。Other parameters requested are fixed

返回数据格式如下。The format of the returned data is as follows:

[?](#)

`{`

    `"msgType"``:` `"oven.action.execute.response"``,`

    `"payload"``: {`

        `"code"``:` `0``,`

        `"data"``: {`

            `"actionCode"``:` `"get_volume_info"``,`

            `"msgId"``:` `"AQSrThoDZRUA5egu"``,`

            `"pid"``:` `"SYSTEM-010"``,`

            `"outputParams"``: {},`

            `"source"``:` `"avatar"``,`

            `"time"``:` `1700703060027`

        `}`

    `}`

`}`

  

code：0 成功，非0 异常 code: 0 for success, non-zero for exception

字段说明：Field description:

**msgType：**

1.  **oven.action.execute.response 动作回复 Action reply**
2.  **oven.property.report.response 属性回复 Attribute reply**

如果是动作类型，返回数据在outputParams中。

If it is of action type, the returned data is in the outputParams

因为每次请求参数中，参数格式参照上面。下面列出的请求参数中，只显示了请求中有不一样的参数字段。同一样的参数不重复列举(如msgId,time等字段)

Because every request parameter follows the format mentioned above. The following list of request parameters only displays the parameter fields that are different from the ones in the request. The same parameters are not repeatedly listed (e.g. msgId, time, etc.)

2\. 接口详情Interface Details
=========================

一级功能  
Primary Function

功能点  
Feature Point

类型（动作、属性、事件）  
Type (Action, Attribute, Event)

标识符  
Identifier

 请求参数  
Request Parameters

返回响应  
Return Response

一级功能  
Primary Function

功能点  
Feature Point

类型（动作、属性、事件）  
Type (Action, Attribute, Event)

标识符  
Identifier

 请求参数  
Request Parameters

返回响应  
Return Response

音量控制能力  
Volume Control Capability  
SYSTEM-010

获取音量信息  
Get Volume Information

动作  
Action

get\_volume\_info

"msgType":"oven.action.execute",

"actionCode":"get\_volume\_info",

"pid":"SYSTEM-010",

  

{"msgType":"oven.action.execute.response",

"payload":{"code":0,"data":{"actionCode":"get\_volume\_info",

"msgId":"AQSrThoDZRUA5egu","pid":"SYSTEM-010",

"source":"avatar","time":1700703060027,"outputParams":{"volume\_val":"xxx",}}

  

音量调节  
Adjust Volume

属性  
Attribute

volume\_val

"inputParams":{“volume\_val":xxx}

{"msgType":"oven.property.set.response",

"payload":{"code":0,"}}

  

增大音量  
Increase Volume

动作  
Action

volume\_up

"msgType":"oven.action.execute",

"actionCode":"volume\_up",

"pid":"SYSTEM-010",

  

outputParams":{"volume\_val":"xxx",}

  

降低音量  
Decrease Volume

动作  
action

volume\_down

"actionCode":"volume\_down",

"outputParams":{"volume\_val":"xxx",}}

  

调节音量至最大  
Set Volume to Maximum

动作  
action

volume\_max

"actionCode":"volume\_max",

"outputParams":{"volume\_val":"xxx",}}

  

静音调节  
Mute Adjustment

属性  
Attribute

mute\_state

"inputParams":{“mute\_state":xxx}//0:关 1:开

{"msgType":"oven.property.set.response",

"payload":{"code":0,"}}

显示控制能力  
Display Control Capability  
SYSTEM-020

获取屏幕显示信息  
Get Screen Display Information

动作  
action

get\_screen\_info

"msgType":"oven.action.execute",

"actionCode":"get\_screen\_info",

"pid":"SYSTEM-020",

"outputParams":{"screen\_bright\_val":"xxx",

"screen\_off\_timeout":xxx，"screen\_state:"xxx}}

参数说明：

1、屏幕亮度值  
2、屏幕休眠时长  
3、亮灭屏状态

Parameter Description:

1.  Screen brightness value
2.  Screen sleep duration
3.  Screen on/off state

  

屏幕亮度调节  
Adjust Screen Brightness

属性  
Attribute

screen\_bright\_val

"inputParams":{“screen\_bright\_val":xxx}

  

  

设置屏幕休眠时间  
Set Screen Sleep Time

属性  
Attribute

screen\_off\_timeout

"inputParams":{“screen\_off\_timeout":xxx}

  

  

亮灭屏控制  
Screen On/Off Control

属性  
Attribute

screen\_state

"inputParams":{“screen\_state":xxx}

  

  

增大亮度  
Increase Brightness

动作  
action

screen\_bright\_up

"actionCode":"screen\_bright\_up",

"outputParams":{"screen\_bright\_val":"xxx",}

  

降低亮度  
Decrease Brightness

动作  
action

screen\_bright\_down

"actionCode":"screen\_bright\_down",

"outputParams":{"screen\_bright\_val":"xxx",}

  

调节亮度至最大  
Adjust Brightness to Maximum

动作  
action

screen\_bright\_max

"actionCode":"screen\_bright\_max",

"outputParams":{"screen\_bright\_val":"xxx",}

  

调节亮度至最小  
Adjust Brightness to Minimum

动作  
action

screen\_bright\_min

"actionCode":"screen\_bright\_min",

"outputParams":{"screen\_bright\_val":"xxx",}

儿童锁能力  
Child Lock Capability  
SYSTEM-030

童锁开关设置  
Child Lock Switch Setting

  

child\_lock\_switch\_state

  

  

  

  

  

  

  

  

主题控制能力  
Theme control capability  
SYSTEM-040

当前系统设置主题信息  
Current system setting theme information

动作  
action

get\_theme\_info

  

"outputParams":{"theme\_val":"xxx",

“avatar\_character”:"xxx","xiaowan\_show\_state":}

参数说明

theme\_val 主题："default",默认，"avatar"带虚拟人

avatar\_character：虚拟人。"wandemei",万的美，"wandean"：万得安

avatar\_show\_state：虚拟人显示开关

  

虚拟人显示角色  
Virtual Human Display Role

属性  
Attribute

avatar\_character

"inputParams":{“avatar\_character":xxx}

参数说明："wandemei",万的美

"wandean"：万得安

  

  

小万精灵显示开关  
Xiaowen Assistant Display Switch

属性  
Attribute

avatar\_show\_state

"inputParams":{“avatar\_show\_state":xxx}

0:关 1：开

  

系统升级能力  
System Upgrade Capability  
SYSTEM-050

获取当前系统固件版本  
Retrieve the current system firmware version

属性  
Attribute

system\_firmware\_info

  

  

页面操作能力  
Page Operation Capability  
SYSTEM-060

返回上一页  
Return to the previous page

动作  
action

back\_previous\_page

  

  

  

回到首页  
Go back to the homepage

动作  
action

back\_home\_page

  

  

  

设备当前页面  
Current Page of the Device

属性  
Attribute

curr\_page

  

  

  

选择序号  
Select an ID/Number

动作  
action

select\_list\_id

"inputParams":{“select\_list\_id":xxx}

  

  

进入对应烹饪设置页面  
Enter the corresponding cooking setting page

动作  
action

enter\_cooking\_settings\_page

  

1、one\_key\_cook\_set  
2、smart\_cook\_set  
3、recipe\_detail  
4、diy\_cook\_set  
5、scan\_result

字段说明

1、不需要参数（一键烹饪设置）  
2、不需要参数（智能烹饪设置）  
3、\[食谱id\]\[recipeId\]\[long\]\[不可空\]、\[标题\]\[title\]\[string\]\[可空\]（食谱详情）  
4、不需要参数（DIY烹饪设置）  
5、\[方案码\]\[schemeCode\]\[string\]\[不可空\]（商品详情页（扫码结果页））

Field Explanation

1.  No parameter required (One-click cooking setting)
2.  No parameter required (Smart cooking setting)
3.  \[Recipe ID\]\[recipeId\]\[long\]\[mandatory\], \[Title\]\[title\]\[string\]\[optional\] (Recipe details)
4.  No parameter required (DIY cooking setting)
5.  \[Scheme Code\]\[schemeCode\]\[string\]\[mandatory\] (Product details page (scan result page))

  

设备信息提供能力  
Device Information Provision Capability  
SYSTEM-070

设备信息  
Device Information

属性  
Attribute

device\_info

  

  

  

用户信息  
User Information

属性  
Attribute

user\_info

  

  

  

网络环境  
Network Environment

属性  
Attribute

network\_env

  

1、开发环境(dev)  
2、测试环境(debug)  
3、预生产环境(stage)  
4、生产环境(pro)  

1.  Development environment (dev)
2.  Testing environment (debug)
3.  Staging environment (stage)
4.  Production environment (pro)

烹饪控制能力  
Cooking Control Capability  
COOKING-010

烹饪状态  
Cooking Status

属性  
Attribute

cooking\_state

  

1、"standby"  
2、"start"  
3、"pause"  
4、"resume"  
5、"stop"

  

烹饪启停控制  
Cooking Start/Stop Control

动作  
action

cooking\_control

  

  

  

查询烹饪剩余时长  
Query the remaining cooking time

动作  
action

cooking\_remain\_time

  

  

  

腔内空载状态  
Empty cavity status

属性  
Attribute

non\_load\_state

  

  

一键烹饪设置页面控制  
One-key cooking setting page control  
COOKING-020

烹饪模式选择  
Cooking mode selection

动作  
action

one\_key\_cooking\_mode\_ctrl

  

"inputParams":{“cooking\_mode":xxx}

枚举型:  
低火：low\_fire  
解冻：unfreeze  
中火：med\_fire  
中高火：med\_high\_fire  
高火：high\_fire  
Enumerated type:  
Low heat: low\_fire  
Defrost: unfreeze  
Medium heat: med\_fire  
Medium-high heat: med\_high\_fire  
High heat: high\_fire

  

  

烹饪时长控制  
Cooking duration control

动作  
Action

one\_key\_cooking\_duration\_ctrl

"cooking\_duration":{“cooking\_mode":xxx}

  

智能烹饪设置页面控制  
Smart cooking setting page control  
COOKING-030

智能烹饪参数设置  
Smart cooking parameters setting

动作  
Action

smart\_cooking\_param\_ctrl

"inputParams":{“cooking\_param":xxx}

枚举型:  
1、中温:med  
2、中高温:med\_high  
3、高温:high

Enum Type:  
1、med  
2、med\_high  
3、high

  

  

智能烹饪时长设置  
Smart cooking duration setting

动作  
Action

smart\_cooking\_duration\_ctrl

"inputParams":{“cooking\_duration":xxx}

  

DIY烹饪设置页面控制能力  
Ability to control DIY cooking settings page  
COOKING-040

创建DIY烹饪  
Create DIY cooking

动作  
Action

  

  

  

  

增加烹饪阶段  
Add cooking stage

动作  
Action

add\_cooking\_stage

"inputParams":{“power":xxx，"duration":xxx}

  

  

删除指定阶段  
Delete specified stage

动作  
Action

remove\_cooking\_stage

"inputParams":{“index":xxx}

  

智能烹饪控制  
Smart cooking control  
COOKING-050

启动智能加热  
Start smart heating

动作  
Action

smart\_cooking\_control

"inputParams":{“cooking\_mode":xxx}

枚举型:  
1、解冻:unfreeze  
2、复热:reheat  
3、微热:mild

Enum-type:

1.  :unfreeze
2.  reheat
3.  mild

  

食谱详情页面控制能力  
Recipe details page control capability  
RECIPES-010

食谱视频播放控制  
Recipe video playback control

动作  
Action

recipe\_video\_control

"inputParams":{“play\_state":xxx}

枚举型:  
1、"播放"："play"  
2、"暂停"："pause"  
3、"重播"："replay"  
Enum-type:  
1、"play"  
2、"pause"  
3、"replay"

  

  

查看食材信息  
View ingredient information

动作  
Action

view\_recipe\_cooking\_food\_info

  

  

  

查看烹饪步骤  
View cooking steps

动作  
Action

view\_recipe\_cooking\_step\_info

"inputParams":{“cooking\_step":xxx}

  

  

上一步做法  
Previous step

动作  
Action

view\_recipe\_cooking\_previous\_step

  

  

  

下一步做法  
Next step

动作  
Action

view\_recipe\_cooking\_next\_step

  

  

  

页面滑动控制  
Page slide control

动作  
Action

view\_recipe\_cooking\_page\_operate

"inputParams":{“operate\_param":xxx}

枚举型:  
1、上滑：slide\_up  
2、下滑：slide\_down  
3、回到顶部：slide\_top  
4、滑到底部：slide\_bottom

Enum-type:

1.  slide\_up
2.  slide\_down
3.  slide\_top
4.   slide\_bottom

  

食谱列表页面控制能力  
RECIPES-040

展示下一页  
Show next page

动作  
Action

page\_set\_next

  

  

  

回到上一页  
Return to previous page

动作  
Action

page\_set\_previous

  

  

  

前往指定页  
Navigate to specified page.

动作  
Action

page\_set\_id

"inputParams":{“page\_id\_control":xxx}

  

首页显示虚拟人播放文本  
Display virtual person playback text on the homepage  
SYSTEM-080

虚拟人播报时显示文本  
Display text when virtual person broadcasts

动作  
Action

show\_play\_text

"inputParams":{“text":xxx}

  

  

虚拟人播报时 的状态  
Status of virtual person playback

动作  
Action

show\_play\_state

"inputParams":{“play\_state":xxx}

（1监听状态，2 播报完成状态）  
(1. Listening status, 2. Playback completion status)

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)