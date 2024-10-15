---
author: "王宇"
title: "自定义vite插件，打包后替换成注释内容"
date: 三月26,2024
description: "vite"
tags: ["vite"]
ShowReadingTime: "12s"
weight: 549
---
背景
==

希望开发的时候用的资源是mp4格式，方便调试，而打包后生产用的是m3u8，流式的体验比较好。

为什么不都统一m3u8，因为windows的chrome原生不支持打开，需要用插件，懒得装第三方兼容，于是想到在vite打包流程上处理

理想用法
----

![](/download/attachments/123635167/image2024-3-26_15-22-18.png?version=1&modificationDate=1711437738634&api=v2)

  

代码加上
----

原理是暴力修改文件内容

**vite.config.ts**

[?](#)

`const` `replaceJJVideo = (mode) => {`

  `if` `(mode !==` `'dev'``) {`

    `return` `{`

      `async transform(src: string, file: string) {`

        `if` `(file.endsWith(``'.vue'``)) {`

          `const` `lines = src.split(``'\n'``);`

          `for` `(let i =` `0``; i < lines.length; i++) {`

            `const` `match = lines[i].match(/\/\/\s*``@vite``-jj-replace-video:\s*``'(.*)'``/)`

            `if` `(match && i < lines.length -` `1``) {`

              `lines[i +` `1``] = lines[i +` `1```].replace(/video:.*/, `video:`` `'${match[1]}'```,`);``

            `}`

          `}`

          `return` `{`

            `code: lines.join(``'\n'``),`

            `map: { mappings:` `''` `}`

          `}`

        `}`

      `}`

    `}`

  `}`

`}`

`// ...`

`export` `default` `defineConfig(({ mode }) => {`

  `return` `{`

    `plugins: [`

      `// ...`

      `replaceJJVideo(mode),`

      `// ...`

    `],`

`// ...`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)