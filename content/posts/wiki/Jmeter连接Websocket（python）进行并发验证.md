---
author: "王宇"
title: "Jmeter连接Websocket（python）进行并发验证"
date: 十二月29,2023
description: "python语言学习"
tags: ["python语言学习"]
ShowReadingTime: "12s"
weight: 161
---
*   1[1\. 背景](#Jmeter连接Websocket（python）进行并发验证-背景)
*   2[2\. 思考](#Jmeter连接Websocket（python）进行并发验证-思考)
*   3[3\. 工具](#Jmeter连接Websocket（python）进行并发验证-工具)
*   4[4\. 前期准备](#Jmeter连接Websocket（python）进行并发验证-前期准备)
*   5[5\. 操作步骤](#Jmeter连接Websocket（python）进行并发验证-操作步骤)
    *   5.1[5.1. 通过网上查阅相关资料在jmeter中请求websocket需要安装两个jar包，并下载对应包安装](#Jmeter连接Websocket（python）进行并发验证-通过网上查阅相关资料在jmeter中请求websocket需要安装两个jar包，并下载对应包安装)
    *   5.2[5.2. 创建websocket请求](#Jmeter连接Websocket（python）进行并发验证-创建websocket请求)
    *   5.3[5.3. 为了获取加密后的signature，需要自行分析源文件代码（xfDocapi.py），然后梳理出文件加密逻辑运用到jemter上。](#Jmeter连接Websocket（python）进行并发验证-为了获取加密后的signature，需要自行分析源文件代码（），然后梳理出文件加密逻辑运用到jemter上。)
    *   5.4[5.4. 通过调试得到以下代码，得到jmeter中请求参数appId，timestamp，signature](#Jmeter连接Websocket（python）进行并发验证-通过调试得到以下代码，得到jmeter中请求参数appId，timestamp，signature)
    *   5.5[5.5. 调试运行代码，接口已经能顺利调通](#Jmeter连接Websocket（python）进行并发验证-调试运行代码，接口已经能顺利调通)
    *   5.6[5.6. 验证对应的并发数3，观察接口是否存在报错，提示并发量不足](#Jmeter连接Websocket（python）进行并发验证-验证对应的并发数3，观察接口是否存在报错，提示并发量不足)
    *   5.7[5.7. 根据了解业务得知，当前1个账号提供3个免费的并发数量，如果我们有多个账号随机取一个账号进行并发请求那我们的并发数量肯定能上去，较少出现并发数不足的情况。](#Jmeter连接Websocket（python）进行并发验证-根据了解业务得知，当前1个账号提供3个免费的并发数量，如果我们有多个账号随机取一个账号进行并发请求那我们的并发数量肯定能上去，较少出现并发数不足的情况。)
    *   5.8[5.8. 优化代码，随机获取账号信息去请求接口，提高并发数量，降低提示并发数不足的情况。优化后的python代码如下](#Jmeter连接Websocket（python）进行并发验证-优化代码，随机获取账号信息去请求接口，提高并发数量，降低提示并发数不足的情况。优化后的python代码如下)
    *   5.9[5.9. 通过新代码尝试验证并发8个，虽然有一定的概率会遇到并发数不足，但是相对只能并发3个已经有了很大的提升。](#Jmeter连接Websocket（python）进行并发验证-通过新代码尝试验证并发8个，虽然有一定的概率会遇到并发数不足，但是相对只能并发3个已经有了很大的提升。)
    *   5.10[5.10. 最终jmeter脚本](#Jmeter连接Websocket（python）进行并发验证-最终jmeter脚本)
*   6[6\. 结论](#Jmeter连接Websocket（python）进行并发验证-结论)

1\. 背景
======

开发同事在接入科大讯飞文档大模型时，测试经常遇到接口报并发数量不足的错误，沟通了解到当前使用的账号只有免费的3个并发量，但开发偶尔遇到单个请求的时候也会报并发数量不足，于是接到验证第三方接口并发量的需求。

2\. 思考
======

做性能测试当前使用比较多的工具就是Jmeter了，但是这是websocket协议请求，该工具默认不支持该协议请求连接，于是网上简单查阅资料得知可以通过导入第三方jar包就可以支持该协议的传输。同时开发之前写的开发都是通过python脚本写的，自己刚刚好又学习了一段时间的python语言于是便有了很高的兴趣，需要在jmeter上允许python脚本来加密参数请求调接口，另外查阅资料得知jemter上运动pyth脚本也需要安装jar包才能运行，并且只支持运行python2。

3\. 工具
======

jmeter工具执行脚本、pycharm工具调试python脚本

4\. 前期准备
========

阅读python原文件代码，理解代码加密逻辑，自行上网查阅相关资料完成websocket请求和python代码的调试，阅读理解代码的过程，我调试代码的过程都复习巩固了自己之前学习的知识，并应用在实践当中。第三方接口文档说明[https://chatdoc.xfyun.cn/docs#/](https://chatdoc.xfyun.cn/docs#/)  
![](/download/attachments/114677070/image2023-12-29_9-40-31.png?version=1&modificationDate=1703814031570&api=v2)

5\. 操作步骤
========

5.1. 通过网上查阅相关资料在jmeter中请求websocket需要安装两个jar包，并下载对应包安装
-----------------------------------------------------

对应jar包：[JMeterWebSocketSamplers-1.2.8.jar](/download/attachments/114677070/JMeterWebSocketSamplers-1.2.8.jar?version=1&modificationDate=1703814288816&api=v2)，[jmeter-plugins-manager-1.10.jar](/download/attachments/114677070/jmeter-plugins-manager-1.10.jar?version=1&modificationDate=1703814425392&api=v2)，需把这两个jar放到jmeter安装路径下的ext文件夹下（我本地D:\\Program Files\\apache-jmeter-5.2.1\\lib\\ext）  
另外运行python脚本jar包：[jython-standalone-2.7.2.jar](/download/attachments/114677070/jython-standalone-2.7.2.jar?version=1&modificationDate=1703815169058&api=v2)，同理把jar放到jmeter安装路径下的ext文件夹下  
重启jmeter工具，进入主页–选项  
![](/download/attachments/114677070/image2023-12-29_9-49-37.png?version=1&modificationDate=1703814578005&api=v2)  
安装对应的两个包，安装后重启，就能在sample下找到websocket的请求协议了。  
![](/download/attachments/114677070/image2023-12-29_9-50-32.png?version=1&modificationDate=1703814632800&api=v2)

5.2. 创建websocket请求
------------------

![](/download/attachments/114677070/image2023-12-29_9-52-39.png?version=1&modificationDate=1703814759328&api=v2)

![](/download/attachments/114677070/image2023-12-29_9-55-31.png?version=1&modificationDate=1703814931233&api=v2)

我们请求的websocket是多段返回文本的，所以需要创建不创建请求只接收的

![](/download/attachments/114677070/image2023-12-29_9-55-10.png?version=1&modificationDate=1703814910094&api=v2)

![](/download/attachments/114677070/image2023-12-29_9-55-20.png?version=1&modificationDate=1703814920679&api=v2)

5.3. 为了获取加密后的signature，需要自行分析源文件代码（[xfDocapi.py](/download/attachments/114677070/xfDocapi.py?version=1&modificationDate=1703813765027&api=v2)），然后梳理出文件加密逻辑运用到jemter上。
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

![](/download/attachments/114677070/image2023-12-29_9-37-46.png?version=1&modificationDate=1703813866456&api=v2)

5.4. 通过调试得到以下代码，得到jmeter中请求参数appId，timestamp，signature
------------------------------------------------------

[?](#)

`import` `time` 

`import` `hashlib` 

`import` `hmac` 

`import` `base64` 

`appId =` `"a327ed87"`   

`timestamp = str(``int``(time.time()))` 

`apisecret =` `"ZjQ1MDNjYTgzODU5NmI4N2RjYTVkYmFk"`

`fileid =` `"b61e9887f63a4c488b4c37c48bffc46e"`

`def get_signature():`

    `data = (appId + timestamp).encode(``'utf-8'``)  # 使用 .encode(``'utf-8'``) 来直接编码字符串为字节` 

    `checkSum = hashlib.md5(data).hexdigest()  # 使用 .hexdigest() 来直接获取十六进制摘要` 

    `signature = hmac.``new``(apisecret.encode(``'utf-8'``), checkSum.encode(``'utf-8'``), digestmod=hashlib.sha1).digest()` 

    `signature = base64.b64encode(signature).decode(``'utf-8'``)  # 使用 .decode(``'utf-8'``) 来直接解码字节为字符串` 

    `return` `signature` 

`signature = get_signature()` 

`vars.put(``"appId"``, appId)` 

`vars.put(``"timestamp"``, timestamp)`

`vars.put(``"fileid"``, fileid)` 

`vars.put(``"signature"``, signature)`

![](/download/attachments/114677070/image2023-12-29_10-16-45.png?version=1&modificationDate=1703816206026&api=v2)

在jmeter中调用对应的参数  
![](/download/attachments/114677070/image2023-12-29_10-39-48.png?version=1&modificationDate=1703817588940&api=v2)

5.5. 调试运行代码，接口已经能顺利调通
---------------------

![](/download/attachments/114677070/image2023-12-29_10-16-17.png?version=1&modificationDate=1703816177471&api=v2)

5.6. 验证对应的并发数3，观察接口是否存在报错，提示并发量不足
---------------------------------

  
![](/download/attachments/114677070/image2023-12-29_10-18-23.png?version=1&modificationDate=1703816303702&api=v2)  
![](/download/attachments/114677070/image2023-12-29_10-19-5.png?version=1&modificationDate=1703816345257&api=v2)  
以上接口返回均通过，没有报错，同时提示接口数量不足，这是单次并发验证，正常需要循环跑多次，这里因为有免费次数限制没有跑更多的次数。  
另外当选择并发数4个，观察接口是否存在报错，如下  
![](/download/attachments/114677070/image2023-12-29_10-21-42.png?version=1&modificationDate=1703816502140&api=v2)  
![](/download/attachments/114677070/image2023-12-29_10-22-15.png?version=1&modificationDate=1703816535511&api=v2)  
通过以上返回，明显看出当并发4个的时候，必定会存在一个接口请求失败，报了并发量不足的情况。与第三个提供的3个免费的并发量一致。

5.7. 根据了解业务得知，当前1个账号提供3个免费的并发数量，如果我们有多个账号随机取一个账号进行并发请求那我们的并发数量肯定能上去，较少出现并发数不足的情况。
---------------------------------------------------------------------------------

[?](#)

`冬颖：``3``路，``1000``次`

`APPID:bd7464e0`

`APISECRET:MDY2YmY3N2I3NDcwOTcwY2E2YTBmMTZj`

`FILEID:aa31b936c4f6473b8bcae9041a49ab3e`

`黄婷：``3``路，``1000``次`

`APPID:3d387e5f`

`APISECRET:ZWRjMzdjYjBjOWU2OGQ2NWVlMzc3ZTli`

`FILEID:5da5effaf79c4e8990125614da2b35be`

`郑小涵：``3``路，``1000``次`

`APPID:033c34df`

`APISECRET:YjgwMjMwMjRlOTYwZWU2ZDQwNTNjMDI0`

`FILEID:1b51f467015e4db6a4818e2305ebef1a`

`唐玮：``3``路，``1000``次`

`APPID:f6c06130`

`APISECRET:YjE2NDk3NTkzZTQ2YjBlODViNWJiOTlk`

`FILEID:a168550934294eaa9b8828e0fafce848`

`影子：``3``路，``3000``次(预计于近期提额)`

`APPID:a327ed87`

`APISECRET:ZjQ1MDNjYTgzODU5NmI4N2RjYTVkYmFk`

`FILEID:b61e9887f63a4c488b4c37c48bffc46e`

5.8. 优化代码，随机获取账号信息去请求接口，提高并发数量，降低提示并发数不足的情况。优化后的python代码如下
----------------------------------------------------------

[?](#)

`import` `time`

`import` `hashlib`

`import` `hmac`

`import` `base64`

`import` `random`

`timestamp = str(``int``(time.time()))`

`# 字典列表`

`dict_list = [{``'appId'``:` `'a327ed87'``,` `'apisecret'``:` `'ZjQ1MDNjYTgzODU5NmI4N2RjYTVkYmFk'``,``'fileid'``:``'b61e9887f63a4c488b4c37c48bffc46e'``},`

             `{``'appId'``:` `'f6c06130'``,` `'apisecret'``:` `'YjE2NDk3NTkzZTQ2YjBlODViNWJiOTlk'``,``'fileid'``:``'a168550934294eaa9b8828e0fafce848'``},`

             `{``'appId'``:` `'033c34df'``,` `'apisecret'``:` `'YjgwMjMwMjRlOTYwZWU2ZDQwNTNjMDI0'``,``'fileid'``:``'1b51f467015e4db6a4818e2305ebef1a'``},`

             `{``'appId'``:` `'3d387e5f'``,` `'apisecret'``:` `'ZWRjMzdjYjBjOWU2OGQ2NWVlMzc3ZTli'``,``'fileid'``:``'5da5effaf79c4e8990125614da2b35be'``},`

             `{``'appId'``:` `'bd7464e0'``,` `'apisecret'``:` `'MDY2YmY3N2I3NDcwOTcwY2E2YTBmMTZj'``,``'fileid'``:``'aa31b936c4f6473b8bcae9041a49ab3e'``}]`

`# 使用random.choice从列表中随机选择一个字典`

`random_dict = random.choice(dict_list)`

`appId = random_dict[``'appId'``]`

`apisecret = random_dict[``'apisecret'``]`

`fileid = random_dict[``'fileid'``]`

`def get_signature():`

    `data = (appId + timestamp).encode(``'utf-8'``)  # 使用 .encode(``'utf-8'``) 来直接编码字符串为字节`

    `checkSum = hashlib.md5(data).hexdigest()  # 使用 .hexdigest() 来直接获取十六进制摘要`

    `signature = hmac.``new``(apisecret.encode(``'utf-8'``), checkSum.encode(``'utf-8'``), digestmod=hashlib.sha1).digest()`

    `signature = base64.b64encode(signature).decode(``'utf-8'``)  # 使用 .decode(``'utf-8'``) 来直接解码字节为字符串`

    `return` `signature`

`signature = get_signature()`

`vars.put(``"appId"``, appId)`

`vars.put(``"timestamp"``, timestamp)`

`vars.put(``"fileid"``, fileid)`

`vars.put(``"signature"``, signature)`

![](/download/attachments/114677070/image2023-12-29_10-31-56.png?version=1&modificationDate=1703817116381&api=v2)

5.9. 通过新代码尝试验证并发8个，虽然有一定的概率会遇到并发数不足，但是相对只能并发3个已经有了很大的提升。
--------------------------------------------------------

![](/download/attachments/114677070/image2023-12-29_10-35-38.png?version=1&modificationDate=1703817338664&api=v2)  
![](/download/attachments/114677070/image2023-12-29_10-35-28.png?version=1&modificationDate=1703817329382&api=v2)  
通过以上返回数据得知，并发8个没有遇到请求失败的情况，大大的提升了并发数。

5.10. 最终jmeter脚本
----------------

[WebSocket大模型文档问答.jmx](/download/attachments/114677070/WebSocket%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%96%87%E6%A1%A3%E9%97%AE%E7%AD%94.jmx?version=1&modificationDate=1703821353942&api=v2)

6\. 结论
======

通过验证得出，账号提供的免费3个并发数与实际验证的结论一致，另外可以通过多账号来提升并发数。

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)