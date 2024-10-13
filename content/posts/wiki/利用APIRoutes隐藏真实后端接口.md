---
author: "王宇"
title: "利用APIRoutes隐藏真实后端接口"
date: 八月30,2024
description: "ssr"
tags: ["ssr"]
ShowReadingTime: "12s"
weight: 536
---
背景
==

大模型接口需要在header传一个apikey，属于敏感信息，如果在前端传的话，直接打开控制台就能看到了，危。

有几个方法解决：

1.  后端处理，懒
2.  nginx处理，但要在服务器安装插件，不是熟悉的领域
3.  前端处理

  

其实单纯前端是做不到的，得利用node来做接口转发

  

![](/download/attachments/129204112/image2024-8-30_15-48-13.png?version=1&modificationDate=1725004093346&api=v2)

  

成功将敏感信息隐藏了，甚至从外面看变成了/api/test的GET接口

![](/download/attachments/129204112/image2024-8-30_15-12-20.png?version=1&modificationDate=1725001940640&api=v2)

![](/download/attachments/129204112/image2024-8-30_15-12-44.png?version=1&modificationDate=1725001964313&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)