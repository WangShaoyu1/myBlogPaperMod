---
author: "王宇"
title: "使用Nextjs加载虚拟人"
date: 八月30,2024
description: "ssr"
tags: ["ssr"]
ShowReadingTime: "12s"
weight: 541
---
背景
==

想加快虚拟人渲染的速度

吐槽
==

接口如（[https://vdh-api.test.yingzi.com/haigate/api/v1/haiAtxt2Anim](https://vdh-api.test.yingzi.com/haigate/api/v1/haiAtxt2Anim)）原本是POST接口，用了GET方法居然报404，而不是405，搞到排查了挺久

困难
==

1.导入
----

![](/download/attachments/129203456/image2024-8-28_10-6-7.png?version=1&modificationDate=1724810767206&api=v2)

![](/download/attachments/129203456/image2024-8-28_10-7-33.png?version=1&modificationDate=1724810853289&api=v2)

  

![](/download/attachments/129203456/image2024-8-28_10-6-22.png?version=1&modificationDate=1724810782372&api=v2)

  

2.sdk内部资源路径
-----------

![](/download/attachments/129203456/image2024-8-28_10-5-25.png?version=1&modificationDate=1724810725813&api=v2)

明明已经放进public文件夹，为什么还给我拼上了路径

![](/download/attachments/129203456/image2024-8-28_10-9-30.png?version=1&modificationDate=1724810970238&api=v2)

看源码，路径的生成有在这里执行过，看了下，居然在document.currentScript非空？

[currentScript是什么](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript)

  

当 `import('./haihuman.module.js')` 被执行时，Next.js 会生成一个新的 JavaScript 文件，并将其放置在 `/_next/static/chunks/` 目录中。`document.currentScript.src` 会指向这个动态加载的脚本，因此路径中会包含 `/_next/static/chunks/`

  

### 方案1：

魔改sdk，后面写死 = '/'

  

### 方案2：

非入侵sdk，document.currentScript重写，然而这是read-only，失败

  

### 方案3：

将里面需要加载的haicore\_sdk.wasm从public放到.next/static/chunks

![](/download/attachments/129203456/image2024-8-28_14-23-46.png?version=1&modificationDate=1724826226401&api=v2)

3.代码兼容处理
--------

里面有用到localstorage,客户端加载sdk前设置一下

![](/download/attachments/129203456/image2024-8-28_14-6-27.png?version=1&modificationDate=1724825187324&api=v2)

  

4.sdk里接口转发问题
------------

### 本地调试

![](/download/attachments/129203456/image2024-8-29_10-14-24.png?version=1&modificationDate=1724897664633&api=v2)

发现里面接口一直待处理，发现不传body是没问题的（报错但起码通）

排查到是代理问题，如果有用到bodyParse，就需要fixRequestBody

![](/download/attachments/129203456/image2024-8-29_11-35-34.png?version=1&modificationDate=1724902534333&api=v2)

拓展知识：

[https://blog.csdn.net/jiaohuizhuang6019/article/details/133279205](https://blog.csdn.net/jiaohuizhuang6019/article/details/133279205)

### 线上环境

![](/download/attachments/129203456/image2024-8-29_14-0-3.png?version=1&modificationDate=1724911203715&api=v2)

会自动拼上当前域名

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)