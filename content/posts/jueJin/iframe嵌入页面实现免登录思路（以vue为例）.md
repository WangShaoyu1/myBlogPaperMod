---
author: "天天鸭"
title: "iframe嵌入页面实现免登录思路（以vue为例）"
date: 2024-03-27
description: "最近实现一个功能需要使用iframe嵌入其它系统内部的一个页面，但嵌入后出现一个问题，就是一打开这个页面就会自动跳转到登录页，原因是被嵌入系统没有登录(没有token)肯定不让访问内部页面的"
tags: ["JavaScript","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 742
---
背景：
---

最近实现一个功能需要使用iframe嵌入其它系统内部的一个页面，但嵌入后出现一个问题，就是一打开这个页面就会自动跳转到登录页，原因是被嵌入系统没有登录(没有token)肯定不让访问内部页面的，本文就是解决这个问题的。

选择的技术方案：
--------

本地系统使用iframe嵌入某个系统内部页面，那就证明被嵌入系统是安全的可使用的，所以可以通过通讯方式带一个token过去实现免登录，我用vue项目作为例子具体如下：

### 方法一通过url传：

javascript

 代码解读

复制代码

``// 发送方（本地系统）： <div>     <iframe :src="url" id="childFrame" importance="high" name="demo" ></iframe> </div> //被嵌入页面进行接收 url = `http://localhost:8080/dudu?mytoken={mytoken}` //   接收方：直接使用window.location.search接收，然后对接收到的进行处理``

**注意：**

*   如果使用这个方法最好把token加密一下，要不然直接显示在url是非常危险的行为，所以我更推荐下面方法二
*   上面接收方要在在APP.vue文件的created生命周期接收，在嵌入页面接收是不行的，这里与VUE的执行流程有关就不多说了

#### 方法二通过iframe的通讯方式传（推荐）：

javascript

 代码解读

复制代码

`// 发送方（本地系统）：  var params = {     type: "setToken",     token: "这是伟过去的token" } window.parent.postMessage(params, "*"); // 接收方（被嵌入系统）：在APP.vue文件的created生命周期接收 window.addEventListener( "message",     (e)=>{          if(e.data.type === 'setToken'){               //这里拿到token,然后放入缓存实在免登录即可          }      }	 false);`

**注意：** 上面接收方要在在APP.vue文件的created生命周期接收，在嵌入页面接收是不行的，这里与VUE的执行流程有关就不多说了

补充：
---

> 看着评论不少疑问，所以我就按我个人的思路去补充回答一下，但不绝对实用，欢迎互相指导

### （1）如果不同源系统怎么办？

正常使用上述方法二进行通迅，但不带token过去因为不同源根本无法通用，直接在被嵌入页面请求token,这个要和后端沟通好怎么获取

javascript

 代码解读

复制代码

`// 接收方（被嵌入系统）：在APP.vue文件的created生命周期接收 window.addEventListener( "message",     (e)=>{          if(e.data.type === 'setToken'){               //这里在被嵌入页面请求接口获取这个系统的token,然后放到缓存中免登录          }      }	 false);`

### （2）如果两个系统保存token字段相当怎么办？

`例如`：主系统本地存储的token叫：access\_token , iframe嵌入的系统采用的token也叫：access\_token

> 这分为两种情况：（1）同源并且token字段相同 （2）不同源并且token字段相当

#### （1）同源并且token字段相同

这种情况同源+token字段相同，根本不会出现需要登录的情况，因为同一个浏览器缓存都能拿到并且又是通用token

#### （2）不同源并且token字段相当

这种情况只有`嵌入系统`和`本地系统`两种情况它们并不会同时出现的，那么只要判断当前是那个情况就行，然后给对应的token

`方案`：请求在拦截器那里判断当前请求来自那个系统的页面，然后给对应的token

`例如`：两个系统都要传my\_token字段给后端，如果都放缓存就会覆盖，所以直接本地系统放到token1缓存，嵌入系统放到token2缓存，拦截器判断后如果本来系统页面 `my_token=token1`，嵌入页面 `my_token=token2`