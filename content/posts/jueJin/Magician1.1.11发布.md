---
author: "贝克街的天才"
title: "Magician1.1.11发布"
date: 2021-06-27
description: "本次更新修复了一个小bug，在之前的版本中websocket的报文解析存在一些问题，会导致消息长度超过126个字节后就无法获取了，并且会引发之后发送的所有消息都解析不出来。在1.1.11中这个b"
tags: ["Java","后端"]
ShowReadingTime: "阅读1分钟"
weight: 1066
---
本次更新修复了一个小bug，在之前的版本中websocket的报文解析存在一些问题，会导致消息长度超过126个字节后就无法获取了，并且会引发之后发送的所有消息都解析不出来。 在1.1.11 中 这个bug得到了解决。

除此之外还简化了一点点TCP服务创建的语法，真的只是一点点哦，加了个构造函数，使得在使用默认线程池的时候也可以指定EventRunner的数量了。

### 使用默认线程池时指定EventRunner数量

java

 代码解读

复制代码

`/*   * EventGroup加了个构造函数，可以只指定EventRunner数量  * 以前是两个极端，要么连EventGroup都用默认，要么EventRunner的数量和线程池 全都自定义，不够灵活  */ EventGroup ioEventGroup = new EventGroup(1); EventGroup workerEventGroup = new EventGroup(10); workerEventGroup.setSteal(EventEnum.STEAL.YES); /* 创建TCP服务，默认采用http解码器 */ TCPServer tcpServer = Magician.createTCPServer(ioEventGroup, workerEventGroup)           .soTimeout(3000)           .handler("/", new DemoRequestHandler())           .bind(8080);`

访问官网可以了解更多：[magician-io.com](https://link.juejin.cn?target=http%3A%2F%2Fmagician-io.com "http://magician-io.com")