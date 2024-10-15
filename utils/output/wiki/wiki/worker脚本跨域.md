---
author: "王宇"
title: "worker脚本跨域"
date: 八月15,2024
description: "高端操作"
tags: ["高端操作"]
ShowReadingTime: "12s"
weight: 582
---
背景
--

有时我的worker url指向的文件路径并不想在项目里，有时希望是在线上的其他地方(cdn)，这时Worker构造函数因为跨域了就会报错，

解决方案1
-----

利用data-URI

[?](#)

`const type =` `"application/javascript"``;`

`// 获取 worker 的 js 代码`

`const res = await fetch(originalWorkerUrl);`

`const workerJsCode = await res.text();`

`const resultURL =`

  `` `data:${type},` + encodeURIComponent( workerJsCode); ``

`new` `Worker(resultURL)`

  

解决方案2
-----

利用blog URL

[?](#)

`const type =` `"application/javascript"``;`

`// 获取 worker 的 js 代码`

`const res = await fetch(originalWorkerUrl);`

`const workerJsCode = await res.text();`  

`const resultURL = URL.createObjectURL(`

  `new` `Blob([workerJsCode], { type })`

`);`

`new` `Worker(resultURL)`

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)