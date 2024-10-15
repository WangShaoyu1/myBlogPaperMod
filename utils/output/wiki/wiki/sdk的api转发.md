---
author: "王宇"
title: "sdk的api转发"
date: 三月28,2024
description: "nginx"
tags: ["nginx"]
ShowReadingTime: "12s"
weight: 520
---
![](/download/attachments/123636635/image2024-3-28_10-16-39.png?version=1&modificationDate=1711592199410&api=v2)

部署后sdk会域名拼上上面的字符串做请求接口，会有问题，接口都挂在[https://vdh-api.test.yingzi.com](https://vdh-api.test.yingzi.com)  或  [https://vdh-api.yingzi.com](https://vdh-api.yingzi.com)

基于开放闭合原则，不直接修改sdk源码

之前的办法，劫持项目里的fetch

**main.ts**

[?](#)

`window.fetch = (...args) => {`

  `if` `(``typeof` `args[0] ===` `"string"` `&& args[0].includes(``"/haigate/api/v1/"``)) {`

    ``args[0] = args[0].replace(`/haigate`, `${domain}/haigate`);``

  `}`

  `return` `Promise.resolve(oldfetch(...args));`

`};`

后改成，修改nginx配置

**default.conf**

[?](#)

`location /haigate/api/v1/ {`

    `if` `($host ~* (dev\.yingzi\.com|test\.yingzi\.com$|stage\.yingzi\.com$)) {`

        `proxy_pass https:``//vdh-api.test.yingzi.com;`

        `break``;`

    `}`

    `proxy_pass https:``//vdh-api.yingzi.com;`

`}`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)