---
author: "天天鸭"
title: "只要用iframe必定遇到过这六种“坑”之一"
date: 2024-09-24
description: "如果你是做web前端，那么不可避免早晚都会用到iframe的。其实博主很久前用过，但最近又要有项目用了，由于年代久远对iframe的注意事项都有点忘记了，然后想着总结一下比较需要注意的几个重点事项。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读3分钟"
weight: 59
---
前言
--

如果你是做`web`前端，那么不可避免早晚都会用到`iframe`的。其实博主很久前用过，但最近又要有项目用了，由于年代久远对`iframe`的注意事项都有点忘记了，然后想着总结一下比较需要注意的几个重点事项，除了便于高效工作还能分享给有需要用到`iframe`的小伙伴。

一、iframe基于父窗口大小自适应宽高
--------------------

**简述：** 这是`iframe`最常见的需求了，有时候我们用`iframe`嵌入一个页面时，不想固定宽高想跟随父系统屏幕大小动态变化，从而大大提高适配性。

**实现思路：** `iframe`标签绑定`:style` 来动态设置宽高，监听父窗口宽高变化时动态获取并且绑定到`:style`，但监听变化需要考虑到初始化和窗口缩放的情况，并且记得移除事件监听器防止内存泄漏。

**完整实现代码如下所示**

xml

 代码解读

复制代码

`<template>   <div class="box" @resize="iframeResize">     <iframe :src="iframeSrc" :style="{ width: '100%', height: frameHeight + 'px' }" ref="myRef"></iframe>   </div> </template> <script setup> import { onMounted, onUnmounted, ref, watchEffect } from 'vue'; const myRef = ref(null); const iframeSrc = 'https:******.com'; const frameHeight = ref(0); // 调整iframe的高度的方法 function initHeight() {   if (myRef.value) {     frameHeight.value = window.innerHeight;   } } // 窗口大小变化触发 function iframeResize() {   initHeight(); } // 移除事件监听器, 防止内存泄漏 onUnmounted(() => {   window.removeEventListener('resize', iframeResize); }); // 在组件挂载时先获取一次iframe高度 onMounted(() => {   initHeight();   window.addEventListener('resize', iframeResize); }); // 时刻监听变化，防止iframeRef没有赋值 watchEffect(() => {   if (myRef.value) {     initHeight();   } }); </script> <style scoped> .box {   position: relative;   width: 100%;   height: 100vh; } </style>`

二、iframe基于内容动态宽高
----------------

**简述：** 例如我们业务需求嵌入的是一个表格而不是一个页面，并且表格高度并不确定时我们不能固定`iframe`的高度，否则只有一条内容或者没有内容的时候会不好看，这里要根据内容的数量去决定`ifram`嵌入窗口的高度。

**实现思路：** 思路是子窗口通信告诉父窗口具体高度，然后父窗口再动态设置高度即可。具体实现是子窗口利用`window.postMessage` 来发送具体高度，然后父窗口用`window.addEventListener('message', 方法)`接收内容，从而根据接收到的内容动态调整`iframe`的高度。

**子窗口（被嵌入页面）代码**

xml

 代码解读

复制代码

`<script setup>     window.onload = function() {         let height = '想要告诉父窗口的高度'         if (window.parent && window.parent.postMessage) {             window.parent.postMessage({height: height}, '*');         }     }; </script>`

**父窗口代码**

xml

 代码解读

复制代码

``<template>   <div>     <iframe :src="iframeSrc" ref="myRef"></iframe>   </div> </template> <script setup> import { onMounted, ref } from 'vue'; const iframeSrc = 'https:******.com'; const myRef = ref(null); onMounted(() => {   window.addEventListener('message', iframeMessage); }); const iframeMessage = (event) => {   // 验证消息来源,确保安全性   if (event.origin !== 'https:******.com') return;   const newHeight = event.data.height;   if (newHeight && myRef.value) {     myRef.value.style.height = `${newHeight}px`;   } }; </script>``

**注意：** `if (event.origin !== 'https:******.com') return` 这行代码记得加上。

三、iframe嵌入页面免登录处理
-----------------

这个小弟有单独写过相关详细文章，并且分析了几种情况的处理方式，移步：[iframe嵌入页面实现免登录](https://juejin.cn/post/7350876924393209894 "https://juejin.cn/post/7350876924393209894")

四、http无法嵌入https
---------------

**简述：** 例如开发环境是`HTTP`，嵌入的环境是生产环境的`HTTPS`，这时就会发现这个问题了。其实是现代浏览器的安全机制，会认为是跨域不同源而禁止。因为`HTTP`协议传输的数据未加密的会有安全风险。

**解决思路：** 网上五花八门的方法，但其实真正靠谱的就两种，（1）将 `HTTP` 转换成 `HTTPS` （2）使用代理服务。

#### 方法一：将 `HTTP` 转换成 `HTTPS`（推荐）

##### 1、获取 SSL 证书并安装

方法不止一种，这里就细说啦。

##### 2、配置服务器（这里以nginx为例）

下面我把核心部分解释放在注释说明，这是简单版本用于说明`HTTP`转`HTTPS`，如果真的上生产其实还有不少其它配置。

perl

 代码解读

复制代码

`server {   listen 80;   // 监听http默认的80端口   return 301 https://$host$request_uri; // 把所有http永久重定向到https   server_name ****.com www.****.com;  // 指定域名,这里视真实情况而定 } server {   listen 443 ssl; // 监听https默认的443端口。   server_name ****.com www.****.com;  // 指定域名,这里视真实情况而定      // 指定 SSL 证书文件路径。   ssl_certificate /etc/lets/live/****.com/fullchain.pem;      // 指定 SSL 私钥文件路径   ssl_certificate_key /etc/lets/live/****.com/privkey.pem;   location / {       index index.html index.htm;       root /var/w/html;   } }`

#### 方法二：使用代理服务

用`nodejs`搭建个简单的代理服务器（这里是用`nodejs`举例，真实业务场景可能是后端那边搞）

要先安装对应的依赖，例如

csharp

 代码解读

复制代码

`npm init -y npm install express http-proxy`

然后再配置对应的代理服务器，主要核心是下面四个模块

> *   `express`：作用是构建 `Web` 应用。
> *   `http`：作用是处理 `HTTP` 请求。
> *   `https`：作用是处理 `HTTPS` 请求。
> *   `httpProxy`：作用是创建代理服务器。

ini

 代码解读

复制代码

``const express = require('express'); const fs = require('fs'); const https = require('https'); const http = require('http'); const httpProxy = require('http-proxy'); const app = express(); const proxy = httpProxy.createProxyServer(); const port = 3000; // 读取对应的SSL证书文件 const options = {   key: fs.readFileSync('/etc/lets/live/proxy.****.com/privkey.pem'),   cert: fs.readFileSync('/etc/lets/live/proxy.****.com/fullchain.pem') }; // 设置路由信息 app.all('/proxy/*', (req, res) => {   const targetUrl = `http://${req.params[0]}`;   proxy.web(req, res, { target: targetUrl }, (error) => {     res.status(500).send('Proxy request failed');   }); }); // 创建HTTPS服务器 const server = https.createServer(options, app); // 启动代理服务器 server.listen(port, () => {   console.log(`HTTPS`); });``

五、跨域问题
------

**简述：** `iframe` 页面的跨域问题是因为涉及到浏览器的安全策略，即同源策略。同源策略限制了一个网页脚本不能读写不同源页面的 `DOM` 与 `Cookie`之类的信息。即如果 `iframe` 中的内容与包含它的页面不在同一个源上，那么这两个页面之间会受到跨域限制。

**解决思路：**

##### 1、使用 window.postMessage 实现跨域通信

父页面代码： 主要用`window.addEventListener`监听消息用`postMessage`发送消息。

**注意**： `@load`加载完成后再监听和`window.removeEventListener`取消监听这两个细节。

xml

 代码解读

复制代码

`<template>   <div>     <iframe :src="iframeSrc" ref="iframeRef" @load="onIframeLoad" style="width: 100%; height: 400px;"></iframe>     <button @click="sendMessage">发送消息</button>   </div> </template> <script setup> import { ref, onMounted } from 'vue'; onMounted(() => {   window.addEventListener('message', handleMessage);   // 在组件卸载时移除事件监听器   return () => {     window.removeEventListener('message', handleMessage);   }; }); const iframeSrc = 'http://***.com'; const iframeRef = ref(null);   // 当 iframe 加载完成后，再设置监听器 const onIframeLoad = () => {   window.addEventListener('message', handleMessage); }; const sendMessage = () => {   const iframe = iframeRef.value;   if (iframe.contentWindow) {     iframe.contentWindow.postMessage('Hello!', 'http://***.com');   } }; const handleMessage = (event) => {   // 确保来自想要的源才处理消息   if (event.origin !== 'http://***.com') return;   console.log( event.data); }; </script>`

子页面代码：和父页面一样，用`window.addEventListener`监听消息用`postMessage`发送消息。

xml

 代码解读

复制代码

`<template>   <div>     <button @click="sendMessage">发送消息到父页面</button>   </div> </template> <script setup> import { ref, onMounted } from 'vue'; onMounted(() => {   window.addEventListener('message', handleMessage);   // 在组件卸载时移除事件监听器   return () => {     window.removeEventListener('message', handleMessage);   }; }); const sendMessage = () => {   const parentWindow = window.parent;   if (parentWindow) {     parentWindow.postMessage('Hello!', 'http://****.com');   } }; const handleMessage = (event) => {   if (event.origin !== 'http://****.com') return;   console.log(event.data); }; </script>`

##### 2、使用 document.domain

`document.domain`用于解决二级域名之间跨域问题的方法，例如：`a.tty.com` 和 `b.tty.com`，它们都属于同一个顶级域名 `tty.com`，这时就适合用`document.domain`来让这两个页面能够相互访问。用法相当于简单，就是分别设置两个页面的`document.domain`。

核心代码在第`10与19`行。

ini

 代码解读

复制代码

`<template>   <div>     <iframe :src="iframeSrc" @load="onIframeLoad" ref="iframeRef"></iframe>   </div> </template> <script setup> import { ref } from 'vue'; document.domain = 'tty.com'; // 设置顶级域名 const iframeRef = ref(null); const iframeSrc = 'http://b.tty.com'; const onIframeLoad = () => {   const iframe = iframeRef.value;   if (iframe.contentWindow) {     //  设置iframe的 document.domain     iframe.contentWindow.document.domain = 'tty.com';   } }; </script>`

##### 3、使用 CORS

这里主要是后端的配置了，通过调整服务器响应头中的 `Access-Control-Allow-Origin` 来控制哪些源是可以安全访问资源。

以为`nginx`为例，\*设置为所有。

ini

 代码解读

复制代码

`http {   server {       listen 80;       server_name yourdomain.com;  # 替换为你的域名       # 代理 iframe 请求并添加 CORS 头部       location /iframe-proxy/ {           # 添加CORS头部           add_header Access-Control-Allow-Origin *;           # 其他配置...       }   } }`

##### 4、nginx配置代理

算是常见解决方案了，思路是通过 `Nginx` 反向代理，将请求重定向到想要请求的目标服务器。

核心就是第`10`行代码，具体可以特意去看看`nginx`。

bash

 代码解读

复制代码

`http {   server {       listen 80;       server_name yourdomain.com;  # 替换为你的域名       # 代理 iframe 请求并添加 CORS 头部       location /iframe-proxy/ {           # 将请求代理到目标           proxy_pass http://tty.com/;             # 其他配置...       }   } }`

六、iframe嵌入后报拒绝连接请求
------------------

不知道你用`iframe`有没有见过这个页面，这通常是目标页面设置了 `X-Frame-Options` 响应头来限制内容被嵌入到其他站点的 `iframe` 中。这个可以找后端看看 `X-Frame-Options` 。 ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f14d46d14ae24b4c947d8e7cc17bf18f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727777954&x-signature=mdiAUhSNH2sxY4rpqPVW14wstBU%3D)

小结
--

都是把遇到的场景总结了一下，感觉都是比较常见的情况。

如果大佬们有什么`iframe`的“坑”也可以分享一下我同步学习一下，还有那里写的不好也可以指出更正鸭