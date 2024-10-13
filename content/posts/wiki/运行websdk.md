---
author: "王宇"
title: "运行websdk"
date: 四月03,2024
description: "Electron"
tags: ["Electron"]
ShowReadingTime: "12s"
weight: 522
---
[https://cn-evite.netlify.app/](https://cn-evite.netlify.app/)

  

注意node版本

![](/download/attachments/122520255/image2024-3-14_11-26-21.png?version=1&modificationDate=1710386781654&api=v2)

  

  

  

直接import haihuman.module.js，原因里面有fetch，有跨域问题

![](/download/attachments/122520255/image2024-3-18_9-56-21.png?version=1&modificationDate=1710726981958&api=v2)

Some resources are blocked because their origin is not listed in your site's Content Security Policy (CSP). Your site's CSP is allowlist-based, so resources must be listed in the allowlist in order to be accessed.

A site's Content Security Policy is set either via an HTTP header (recommended), or via a meta HTML tag.

To fix this issue do one of the following:

*   (Recommended) If you're using an allowlist for `'script-src'`, consider switching from an allowlist CSP to a strict CSP, because strict CSPs are more robust against XSS . See how to set a strict CSP .
*   Or carefully check that all of the blocked resources are trustworthy; if they are, include their sources in the CSP of your site. ⚠️Never add a source you don't trust to your site's CSP. If you don't trust the source, consider hosting resources on your own site instead.

  

需要注释下**index,html**

![](/download/attachments/122520255/image2024-3-19_10-29-46.png?version=1&modificationDate=1710815386092&api=v2)

  

主进程（main/index.ts）添加代码

[?](#)

`mainWindow.webContents.session.webRequest.onBeforeRequest(`

  `{`

    `urls: [``'[http://localhost](http://localhost):*/haigate/*'``]`

  `},`

  `(details, callback) => {`

    `callback({`

      ``redirectURL: `https:```` //vdh-api.test.yingzi.com/${details.url.replace(details.referrer, '')}` ``

    `})`

  `}`

`)`

  

  

[https://juejin.cn/post/6870482646355738631?searchId=20240320092341AE0F9562FD028406632F](https://juejin.cn/post/6870482646355738631?searchId=20240320092341AE0F9562FD028406632F)

  

  

渲染进程的公共资源放**renderer**文件夹下面，public

![](/download/thumbnails/122520255/image2024-3-19_10-30-37.png?version=1&modificationDate=1710815437444&api=v2)

haihuman.module.js也得放到public

![](/download/attachments/122520255/image2024-3-20_10-55-10.png?version=1&modificationDate=1710903311005&api=v2)

  

将haihuman.module.js里的路径变成相对路径

![](/download/attachments/122520255/image2024-3-20_10-55-51.png?version=1&modificationDate=1710903351706&api=v2)

  

  

  

![](/download/attachments/122520255/image2024-3-19_11-37-15.png?version=1&modificationDate=1710819435086&api=v2)

  

  

要想使用webview标签，记得加配置，不然没效果

![](/download/thumbnails/122520255/image2024-3-20_16-28-53.png?version=1&modificationDate=1710923333859&api=v2)

  

但官方不推荐了

  

![](/download/attachments/122520255/image2024-3-20_16-29-51.png?version=1&modificationDate=1710923391483&api=v2)

  

使用官方推荐的**BrowserView**吧，注意在 `app` 模块 `emitted ready` 事件之前，您不能使用此模块。

[?](#)

`const view =` `new` `BrowserView()`

`mainWindow.setBrowserView(view)`

`view.setBounds({ x: 0, y: 0, width: 300, height: 300 })`

`view.webContents.loadURL(``'[https://electronjs.org](https://electronjs.org)'``)`

  

效果拔群

  

![](/download/attachments/122520255/image2024-4-3_9-55-39.png?version=1&modificationDate=1712109340029&api=v2)

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)