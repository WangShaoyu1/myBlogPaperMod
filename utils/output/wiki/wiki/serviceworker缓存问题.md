---
author: "王宇"
title: "serviceworker缓存问题"
date: 四月29,2024
description: "pwa"
tags: ["pwa"]
ShowReadingTime: "12s"
weight: 535
---
前言
==

使用service worker的目的就是为了缓存资源，但最恐怖的不是缓存失败，而是该更新的时候取的旧值，这样就很难定位到问题，为了避免使用service worker带来灾难性问题，必须要深入研究一下这个原理

  

* * *

serviceWorker 怎么更新
==================

1.  ### 下载
    
2.  ### 每次进入页面会重新下载 serviceWorker.js
    
3.  ### 每 24 小时必定会下载一次 serviceWorker.js（自定义计时器调 update() 可定期更新）
    
4.  ### 在 service worker 上的一个事件被触发并且过去 24 小时没有被下载会触发新的下载
    
5.  ### 安装更新
    
6.  ### 方法1：注册 path 地址的变更，navigator.serviceWorker.register('./sw.js?v=20190401235959')
    
7.  ### 方法2：下载后按照字节比对两次的 servicework.js，发现不一致就重新安装，修改版本标识更新
    
8.  ### 激活
    
9.  ### 第1次注册 serviceWorker 激活后，页面的请求不会通过 worker，只有在刷新页面后才会通过 serviceWorker 代理请求。
    
10.  ### 安装完毕后如果有旧版 serviceWorker 在运行，会进入 waiting 状态，直到不再有页面使用旧的 serviceWorker 才激活。可以使用 skipWaiting() 跳过等待直接激活。
    
11.  ### 使用 self.clients.claim() 可同步激活全部终端。
    
12.  ### 激活后可根据策略删除旧版缓存
    

![](/download/attachments/123648135/image2024-4-23_9-55-28.png?version=1&modificationDate=1713837328224&api=v2)
===============================================================================================================

  

![](/download/attachments/123648135/image2024-4-23_9-59-46.png?version=1&modificationDate=1713837587139&api=v2)

处理sw.js缓存问题
===========

方法一：
----

**nginx/default.conf**

[?](#)

`location ~ \/sw\.js$ {`

    `add_header Cache-Control no-store;`

    `add_header Pragma no-cache;`

`}`

但部署后404了，不知为啥，暂时没用这个方法

方法二
---

新增sw.register.js脚本，将原本注册内容放里面执行

**main.ts或者index.html**

[?](#)

`if` `(navigator.serviceWorker && !window.location.href.includes(``"local-test"``)) {`

  `// 页面的入口文件`

  `window.addEventListener(``"load"``, () => {`

    `const script = document.createElement(``"script"``);`

    `const firstScript = document.getElementsByTagName(``"script"``)[0];`

    `script.type =` `"text/javascript"``;`

    `script.async =` `true``;`

    ``script.src = `/sw.register.js?v=${Date.now()}`;``

    `if` `(firstScript) {`

      `firstScript.parentNode?.insertBefore(script, firstScript);`

    `}`

  `});`

`}`

**sw.register.js**

[?](#)

``navigator.serviceWorker.register(`/sw.js?v=${process.env.VERSION}`, {``

    `scope:` `'/'`

  `}).then(reg => {`

    `console.log(``'ServiceWorker register success: '``, reg)`

    `if` `(reg.installing) {`

      `console.log(``'Service worker installing'``);`

    `}` `else` `if` `(reg.waiting) {`

      `console.log(``'Service worker installed'``);`

    `}` `else` `if` `(reg.active) {`

      `console.log(``'Service worker active'``);`

    `}`

  `}).``catch``(err => {`

    `console.log(``'ServiceWorker register failed: '``, err)`

  `})`

线上开关
====

如果线上突然出现难以排查问题，又急着使用，只能临时关掉service worker这个功能

[?](#)

`const parentScript = document.getElementsByTagName(``"script"``)[0];`

`const script = document.createElement(``"script"``);`

`script.type =` `'text/javascript'``;`

`script.async =` `true``;`

``script.src = `https:```` //static-cdn.yingzi.com/vdh/screen/scripts/switch.js?v=${Date.now()}` ``

`parentScript.parentNode?.insertBefore(script, parentScript)`

`script.onload = () => {`

  `// 注销`

  `if` `(navigator.serviceWorker) {`

    `if` `(window.SW_FALLBACK) {`

      `console.log(``'service回退'``)`

      `navigator.serviceWorker.getRegistration(``'/'``).then(reg => {`

        `reg?.unregister()`

      `})`

    `}` `else` `{`

      `const script = document.createElement(``"script"``);`

      `const firstScript = document.getElementsByTagName(``"script"``)[0];`

      `script.type =` `"text/javascript"``;`

      `script.async =` `true``;`

      ``script.src = `/sw.register.js?v=${Date.now()}`;``

      `window.VERSION = process.env.VERSION`

      `if` `(firstScript) {`

        `firstScript.parentNode?.insertBefore(script, firstScript);`

      `}`

    `}`

  `}`

`}`

switch.js里面放着变量window.SW\_FALLBACK，true代表注销service worker，就没缓存，false代表注册service worker，通过修改oss上的window.SW\_FALLBACK来实现缓存回退的效果  
![](/download/attachments/123648135/image2024-4-29_9-12-20.png?version=1&modificationDate=1714353140807&api=v2)

  

排除一些不缓存的内容
==========

1.  例如有些图片需要实时性，虽然请求都加上了时间戳，但这样也会缓存旧的图片（虽然没用），白白浪费存储空间，得在fetch里特殊处理
2.  接口请求内容页不缓存，怕出现难以排查的问题

[?](#)

`self.addEventListener(``"fetch"``, (event) => {`

  `const { url, method, destination } = event.request`

  `console.log(``'event'``, event)`

  `// 不缓存`

  `if` `(destination ===` `'image'` `&& url.includes(``'?v='``)) {`

    `return`

  `}`

  `// 不缓存`

  `if` `(event.request.url.includes(``"/haigate/api"``)) {`

    `// event.respondWith(fetch(event.request));`

    `return`

  `}`

`// ...`

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)