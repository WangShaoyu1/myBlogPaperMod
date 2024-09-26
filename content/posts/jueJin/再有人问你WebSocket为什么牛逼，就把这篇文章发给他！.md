---
author: "JavaSouth南哥"
title: "再有人问你WebSocket为什么牛逼，就把这篇文章发给他！"
date: 2024-07-05
description: "2008年6月诞生了一个影响计算机世界的通信协议，原先需要二十台计算机资源才能支撑的业务场景，现在只需要一台，这得帮'抠门'老板们省下多少钱，它就是大名鼎鼎的WebSocket协议。很快在下一年也就是"
tags: ["后端","Java"]
ShowReadingTime: "阅读6分钟"
weight: 595
---
> _点赞再看，Java进阶一大半_

2008年6月诞生了一个影响计算机世界的通信协议，原先需要二十台计算机资源才能支撑的业务场景，现在只需要一台，这得帮"抠门"老板们省下多少钱，它就是大名鼎鼎的WebSocket协议。很快在下一年也就是2009年的12月，Google浏览器就宣布成为第一个支持WebSocket标准的浏览器。

WebSocket的推动者和设计者就是下面的Michael Carter，他设计的WebSocket协议技术现在每天在全地球有**超过20亿**的设备在使用。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0685bd1a584ecc9c18bf840a105b8a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=930&h=676&s=318854&e=jpg&b=191a1c)

大家好，我是南哥。

一个Java学习与进阶的领路人，相信对你通关面试进入心心念念的公司有所帮助。

本文收录在我开源的《Java学习进阶指南》中，涵盖了在大厂工作的Javaer都不会不懂的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫，南哥希望收到大家的 ⭐ Star ⭐支持，这是我创作的最大动力。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaSouth "https://github.com/hdgaadd/JavaSouth")。

1\. WebSocket概念
---------------

### 1.1 为什么会出现WebSocket

> _**面试官：有了解过WebSocket吗？**_

一般的Http请求我们只有主动去请求接口，才能获取到服务器的数据。例如前后端分离的开发场景，自嘲为切图仔实际扮猪吃老虎的前端大佬找你要一个`配置信息`的接口，我们后端开发三下两下开发出一个`RESTful`架构风格的API接口，只有当前端主动请求，后端接口才会响应。

但上文这种基于HTTP的**请求-响应**模式并不能满足**实时数据通信**的场景，例如游戏、聊天室等实时业务场景。现在救世主来了，WebSocket作为一款主动推送技术，可以实现服务端主动推送数据给客户端。大家有没听说过全双工、半双工的概念。

> 全双工通信允许数据同时双向流动，而半双工通信则是数据交替在两个方向上传输，但在任一时刻只能一个方向上有数据流动

HTTP通信协议就是半双工，而数据实时传输需要的是全双工通信机制，WebSocket采用的便是全双工通信。举个微信聊天的例子，企业微信炸锅了，有**成百条消息轰炸**你手机，要实现这个场景，大家要怎么设计？用iframe、Ajax异步交互技术配合以客户端**长轮询**不断请求服务器数据也可以实现，但造成的问题是服务器资源的**无端消耗**，运维大佬直接找到你工位来。显然服务端主动推送数据的WebSocket技术更适合聊天业务场景。

### 1.2 WebSocket优点

> _**面试官：为什么WebSocket可以减少资源消耗？**_

大家先看看传统的Ajax长轮询和WebSocket性能上掰手腕谁厉害。在websocket.org网站提供的`Use Case C`的测试里，客户端轮询频率为10w/s，使用Poling长轮询每秒需要消耗高达665Mbps，而我们的新宠儿WebSocet仅仅只需要花费1.526Mbps，435倍的差距！！

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d91b0b49bb1a439689c4ca9238cedcef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=503&h=360&s=19145&e=jpg&b=fbf9f9)

为什么差距会这么大？南哥告诉你，WebSocket技术设计的目的就是要取代轮询技术和Comet技术。Http消息十分冗长和繁琐，一个Http消息就要包含了起始行、消息头、消息体、空行、换行符，其中**请求头Header**非常冗长，在大量Http请求的场景会占用过多的带宽和服务器资源。

大家看下百度翻译接口的Http请求，拷贝成curl命令是非常冗长的，可用的消息肉眼看过去没多少。

sh

 代码解读

复制代码

`curl ^"https://fanyi.baidu.com/mtpe-individual/multimodal?query=^%^E6^%^B5^%^8B^%^E8^%^AF^%^95&lang=zh2en^" ^   -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" ^   -H "Accept-Language: zh-CN,zh;q=0.9" ^   -H "Cache-Control: max-age=0" ^   -H "Connection: keep-alive" ^   -H ^"Cookie: BAIDUID=C8FA8569F446CB3F684CCD2C2B32721E:FG=1; BAIDUID_BFESS=C8FA8569F446CB3F684CCD2C2B32721E:FG=1; ab_sr=1.0.1_NDhjYWQyZmRjOWIwYjI3NTNjMGFiODExZWFiMWU4NTY4MjA2Y2UzNGQwZjJjZjI1OTdlY2JmOThlNzk1ZDAxMDljMTA2NTMxYmNlM1OTQ1MTE0ZTI3Y2M0NTIzMzdkMmU2MGMzMjc1OTRiM2EwNTJQ==; RT=^\^"z=1&dm=baidu.com&si=b9941642-0feb-4402-ac2b-a913a3eef1&ss=ly866fx&sl=4&tt=38d&bcn=https^%^3A^%^2F^%^2Ffclog.baidu.com^%^2Flog^%^2Fweirwood^%^3Ftype^%^3Dp&ld=ccy&ul=jes^\^"^" ^   -H "Sec-Fetch-Dest: document" ^   -H "Sec-Fetch-Mode: navigate" ^   -H "Sec-Fetch-Site: same-origin" ^   -H "Sec-Fetch-User: ?1" ^   -H "Upgrade-Insecure-Requests: 1" ^   -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" ^   -H ^"sec-ch-ua: ^\^"Not/A)Brand^\^";v=^\^"8^\^", ^\^"Chromium^\^";v=^\^"126^\^", ^\^"Google Chrome^\^";v=^\^"126^\^"^" ^   -H "sec-ch-ua-mobile: ?0" ^   -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" &`

而WebSocket是基于帧传输的，只需要做一次握手动作就可以让客户端和服务端形成一条通信通道，这仅仅只需要2个字节。我搭建了一个SpringBoot集成的WebSocket项目，浏览器拷贝WebSocket的Curl命令十分简洁明了，大家对比下。

sh

 代码解读

复制代码

`curl "ws://localhost:8080/channel/echo" ^   -H "Pragma: no-cache" ^   -H "Origin: http://localhost:8080" ^   -H "Accept-Language: zh-CN,zh;q=0.9" ^   -H "Sec-WebSocket-Key: VoUk/1sA1lGGgMElV/5RPQ==" ^   -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" ^   -H "Upgrade: websocket" ^   -H "Cache-Control: no-cache" ^   -H "Connection: Upgrade" ^   -H "Sec-WebSocket-Version: 13" ^   -H "Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits"`

如果你要区分Http请求或是WebSocket请求很简单，WebSocket请求的请求行前缀都是固定是`ws://`。

2\. WebSocket实践
---------------

### 2.1 集成WebSocket服务器

> _**面试官：有没动手实践过WebSocket？**_

大家要在SpringBoot使用WebSocket的话，可以集成`spring-boot-starter-websocket`，引入南哥下面给的pom依赖。

xml

 代码解读

复制代码

	`<dependencies> 		<dependency> 			<groupId>org.springframework.boot</groupId> 			<artifactId>spring-boot-starter-websocket</artifactId> 		</dependency> 	</dependencies>`

感兴趣点开`spring-boot-starter-websocket`依赖的话，你会发现依赖所引用包名为`package jakarta.websocket`。这代表SpringBoot其实是集成了Java EE开源的websocket项目。这里有个小故事，Oracle当年决定将Java EE移交给Eclipse基金会后，Java EE就进行了改名，现在Java EE更名为Jakarta EE。Jakarta是雅加达的意思，有谁知道有什么寓意吗，评论区告诉我下？

我们的程序导入websocket依赖后，应用程序就可以看成是一台小型的WebSocket服务器。我们通过@ServerEndpoint可以定义WebSocket服务器对客户端暴露的接口。

java

 代码解读

复制代码

`@ServerEndpoint(value = "/channel/echo")`

而WebSocket服务器要推送消息给到客户端，则使用`package jakarta.websocket`下的Session对象，调用`sendText`发送服务端消息。

java

 代码解读

复制代码

    `private Session session;          @OnMessage     public void onMessage(String message) throws IOException{         LOGGER.info("[websocket] 服务端收到客户端{}消息：message={}", this.session.getId(), message);         this.session.getAsyncRemote().sendText("halo, 客户端" + this.session.getId());     }`

看下`getAsyncRemote`方法返回的对象，里面是一个远程端点实例。

java

 代码解读

复制代码

    `RemoteEndpoint.Async getAsyncRemote();`

### 2.2 客户端发送消息

> _**面试官：那客户端怎么发送消息给服务器？**_

客户端发送消息要怎么操作？这点还和Http请求很不一样。后端开发出接口后，我们在Swagger填充参数，点击`Try it out`，Http请求就发过去了。

但WebSocket需要我们在浏览器的控制台上操作，例如现在南哥要给我们的WebSocket服务器发送`Halo，JavaGetOffer`，可以在浏览器的控制台手动执行以下命令。

sh

 代码解读

复制代码

`websocket.send("Halo，JavaGetOffer");`

实践的操作界面如下。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d72eec2b4b4051a05bae032770ba48~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=587&h=189&s=41296&e=jpg&b=fafafa)

[戳这，《JavaSouth》作为一份涵盖Java程序员所需掌握核心知识、面试重点的Java学习进阶指南。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaSouth "https://github.com/hdgaadd/JavaSouth")

![在这里插入图片描述](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ef14a7294b5b4535be45188ff41f43d7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727430689&x-signature=5VwIbpaO0sd4tehOiSoTRyXFroo%3D)

欢迎关注南哥的公众号：Java进阶指南针，公众号里有南哥珍藏整理的大量优秀pdf书籍！

我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️