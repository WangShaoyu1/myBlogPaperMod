---
author: "王宇"
title: "10月份FTT系统测试反馈问题记录"
date: 三月11,2024
description: "七、测试"
tags: ["七、测试"]
ShowReadingTime: "12s"
weight: 134
---
测试系统
====

FTT系统(第三方公司提供)，产品链接：[https://vdh-open.test.yingzi.com/login](https://vdh-open.test.yingzi.com/login)    没有账号？（需找项目经理开通）

验证环境
====

测试环境

测试时间
====

10月抽空完成

问题记录
====

序号

模块

问题描述

复现步骤

缺陷等级

缺陷状态

备注

回归验证

序号

模块

问题描述

复现步骤

缺陷等级

缺陷状态

备注

回归验证

1

预警监控-访问统计

进入访问统计页面，点击分开查看“提问请求”和“播报请求”数，隐藏其中一个维度数据后，再次点击复原该维度时，偶现无法成功展示该维度数据，即点击没有反应

默认展示最近一周的“提问请求”和“播报请求”数据，点击隐藏“提问请求”维度数据，再次点击还原该维度数据时，偶现点击无反应

P3

待解决

![](/download/attachments/109720722/image2023-10-9_10-37-35.png?version=1&modificationDate=1696819055591&api=v2)

通过

2

应用中心-我的应用-运用管理

会话记录通过高级搜索，当结果存在多个，点击快速定位搜索结果按钮，界面就会出现上线抖动，需要强制刷新页面才能恢复正常

使用界面高级搜索，点击快速定位到搜索结果按钮，如图

P3

待解决

视频：[1696835340800.mp4](/download/attachments/109720722/1696835340800.mp4?version=1&modificationDate=1696835403013&api=v2)

![](/download/attachments/109720722/image2023-10-9_15-16-12.png?version=1&modificationDate=1696835772549&api=v2)

通过

3

应用中心-配置虚拟人

编辑回复话术与其他话术同名时，关闭弹窗，再次点击编辑弹窗缓存的话术还是上次的，应该展示原本的话术，此时再勾选或者取消勾选回复话术会报错

配置虚拟人下BML配置，编辑回复话术与其他话术同名，同时再勾选或者取消另外同名的回复话术

P3

待解决

![](/download/attachments/109720722/image2023-10-9_16-49-1.png?version=1&modificationDate=1696841341323&api=v2)

![](/download/attachments/109720722/image2023-10-9_17-1-46.png?version=1&modificationDate=1696842106992&api=v2)

通过

4

应用中心-配置虚拟人

自定义虚拟人时长与文本编辑虚拟时长有误差

新增自定义，编辑富文本，存在两个地方动画时长不一致

P4

待解决

![](/download/attachments/109720722/image2023-10-9_16-39-51.png?version=1&modificationDate=1696840791307&api=v2)![](/download/attachments/109720722/image2023-10-9_16-40-22.png?version=1&modificationDate=1696840822882&api=v2)

通过

5

应用中心-配置虚拟人

优化建议，新增自定义话术时，遇到同名，提示语优化成“已存在”，提升用户体验

BML编辑，新增自定义同名话术

P4

待解决

![](/download/attachments/109720722/image2023-10-9_17-31-0.png?version=1&modificationDate=1696843860342&api=v2)

通过

6

应用中心-配置虚拟人

优化建议，在自定义编辑富文本中，返回上级列表建议定位在“自定义”tab中，其他tab从富文本的返回是已经实现

BML编辑，编辑自定义话术富文本，点击左上角的返回

P4

待解决

![](/download/attachments/109720722/image2023-10-9_17-38-19.png?version=1&modificationDate=1696844299766&api=v2)

通过

7

应用中心-配置虚拟人

可选动画搜索功能异常，当前搜索结果返回为空，前端没有更新列表

BML配置，在可选动画搜索框，搜索一个不存在的动画名，前端列表没有更新

P3

待解决

![](/download/attachments/109720722/image2023-10-9_18-22-32.png?version=1&modificationDate=1696846952522&api=v2)

通过

8

应用中心-我的应用-配置应用

打开新的“更新版本”页签，选择的版本号内容没有清空，会缓存上次选择的版本号

先点击一个可选版本号的更新版本页签进入任选一个版本号，退出再进入另外一个页签会缓存上次选择的版本

P3

待解决

![](/download/attachments/109720722/image2023-10-12_15-1-8.png?version=1&modificationDate=1697094068820&api=v2)![](/download/attachments/109720722/image2023-10-12_15-1-40.png?version=1&modificationDate=1697094101354&api=v2)

通过

9

应用中心-我的应用-配置应用-配置虚拟人 （rrr）

更新虚拟人模板版本时，界面存在【提示：更新版本时，虚拟人已有语种的TTS配置和行为情绪配置将得到保留，不会被目标版本的配置覆盖。】，但是实际更新后tts的配置会发现改变

更新虚拟人模板版本号前，记录tts配置参数，待更新后进行对比

P3

待解决

![](/download/attachments/109720722/image2023-10-12_15-20-19.png?version=1&modificationDate=1697095219701&api=v2)![](/download/attachments/109720722/image2023-10-12_15-21-53.png?version=1&modificationDate=1697095313258&api=v2)

通过

10

应用中心我的应用

列表搜索，页面底部的统计条数错误

输入搜索结果比默认条件搜索结果少时，且搜索结果不为空时，统计条数错误

P3

待解决

![](/download/attachments/109720722/image2023-10-12_15-35-37.png?version=1&modificationDate=1697096137149&api=v2)![](/download/attachments/109720722/image2023-10-12_15-37-24.png?version=1&modificationDate=1697096244242&api=v2)

通过

11

资源母版-虚拟人母版-资源管理 （万得美H5）

谷歌浏览器在界面无任何缩放的场景下，可选动画列表展示不全，样式存在问题

语种设置-角色状态，可选列表样式展示不全

P3

待解决

![](/download/attachments/109720722/image2023-10-13_9-10-58.png?version=1&modificationDate=1697159459355&api=v2)

![](/download/thumbnails/109720722/image2024-3-11_17-25-55.png?version=1&modificationDate=1710149156049&api=v2)

不通过。当前角色管理界面出现了异常。已经反馈虚拟人公司

12

资源母版-虚拟人母版-资源管理

角色状态栏目下搜索框搜索无效，搜索不同的参数列表没有任何变化，前端传参也不变

语种配置-角色状态下进行搜索，搜索结果数据异常

P3

待解决

![](/download/attachments/109720722/image2023-10-13_14-24-7.png?version=1&modificationDate=1697178247822&api=v2)

通过

13

资源母版-虚拟人母版-资源管理 （万得安）

优化建议，进入版本管理，把鼠标悬停在“发布时间”字段上，没有悬浮展示发布时间的全部信息

鼠标悬停在“发布时间”字段的字体上

P4

待解决

![](/download/attachments/109720722/image2023-10-13_16-40-37.png?version=1&modificationDate=1697186438395&api=v2)

通过

14

知识母版FAQ母版

优化建议，编辑FAQ母版与其他已存在的重名时，提示语需要调优，改为“已存在”，与其他列表排重接口提示保持一致

编辑母版名称与其他母版名称一致，点击确认按钮

P4

待解决

![](/download/attachments/109720722/image2023-10-13_15-11-45.png?version=1&modificationDate=1697181106028&api=v2)

通过

15

知识母版-FAQ母版-FAQ编辑 （wanxiaoye）

建议优化，新增和编辑相似问，没有做排重提示，建议加上“已存在”提示文案

新增编辑相似问，保存没有任务提示

P4

待解决

![](/download/attachments/109720722/image2023-10-13_15-31-42.png?version=1&modificationDate=1697182302913&api=v2)![](/download/attachments/109720722/image2023-10-13_15-36-53.png?version=1&modificationDate=1697182613757&api=v2)

通过

16

知识母版-FAQ母版-FAQ编辑 （wanxiaoye）

每次编辑相似问会缓存上次填写信息，希望每次进来清空缓存信息

编辑不同的相似问，填写其中一个问题的相似问后，切换到另外一个问题的相似问

P3

待解决

![](/download/attachments/109720722/image2023-10-13_15-51-33.png?version=1&modificationDate=1697183494061&api=v2)![](/download/attachments/109720722/image2023-10-13_15-52-1.png?version=1&modificationDate=1697183522089&api=v2)

通过

17

知识母版-FAQ母版-FAQ编辑 （wanxiaoye）

编辑分类重名或者输入任意字符串，直接点击“x”，返回列表，列表显示分类名称错误，没有刷新列表数据

编辑分类重名或者输入任意字符串，点击“x”

P3

待解决

![](/download/attachments/109720722/image2023-10-13_16-4-35.png?version=1&modificationDate=1697184275814&api=v2)![](/download/attachments/109720722/image2023-10-13_16-4-52.png?version=1&modificationDate=1697184292644&api=v2)

通过

18

知识母版-FAQ母版

优化建议，FAQ列表字段内容过长，鼠标悬停，没有悬浮展示全部信息，希望保持与指令母版列表一致

鼠标悬停在母版名字过长的字体上

P4

待解决

![](/download/attachments/109720722/image2023-10-13_16-33-55.png?version=1&modificationDate=1697186035845&api=v2)![](/download/attachments/109720722/image2023-10-13_16-34-17.png?version=1&modificationDate=1697186058437&api=v2)

通过

19

知识母版-指令母版

优化建议，文本提示与实际可输入字数不符，要么优化文本为“请输入，建议不超过20字”，要么前后端做字数校验

新增指令母版，指令母版名称输入超过20字点击保存

P4

待解决

![](/download/attachments/109720722/image2023-10-13_16-47-7.png?version=1&modificationDate=1697186827813&api=v2)![](/download/attachments/109720722/image2023-10-13_16-47-50.png?version=1&modificationDate=1697186870803&api=v2)

通过

20

知识母版-指令母版

列表统计总条数错误，当前一直显示0条

进入指令母版，查看列表统计条数

P3

待解决

![](/download/attachments/109720722/image2023-10-13_16-53-46.png?version=1&modificationDate=1697187226422&api=v2)

通过

21

知识母版-指令母版-指令编辑

编辑相似指令，没有做排重处理，导致重名相似指令创建成功（新增相似指令存在排重逻辑）

编辑相似指令重名，点击保存

P3

待解决

![](/download/attachments/109720722/image2023-10-13_17-3-4.png?version=1&modificationDate=1697187785056&api=v2)

通过

22

知识母版-指令母版-指令编辑

编辑母版指令黑名单，输入已经存在的指令名称，点击保存，应该提示“已存在”

编辑母版指令黑名单，输入已经存在的指令名称，点击保存

P4

待解决

![](/download/attachments/109720722/image2023-10-13_17-16-16.png?version=1&modificationDate=1697188577331&api=v2)![](/download/attachments/109720722/image2023-10-13_17-15-46.png?version=1&modificationDate=1697188546648&api=v2)

通过

23

知识母版-指令母版-指令编辑

选择任意词槽，编辑输入描述信息，点击保存时，提示“已存在”，校验逻辑错误，正常应该是编辑成功

编辑词槽，点击保存

P3

待解决

![](/download/attachments/109720722/image2023-10-13_17-27-6.png?version=1&modificationDate=1697189226592&api=v2)

通过

24

知识母版-指令母版-指令编辑

在指令全部分类下搜索，页面底部总条数没有根据搜索结果刷新

在指令全部分类下，进行搜索，页面总条数没有刷新

P3

待解决

![](/download/attachments/109720722/image2023-10-13_17-40-22.png?version=1&modificationDate=1697190022451&api=v2)

通过

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)