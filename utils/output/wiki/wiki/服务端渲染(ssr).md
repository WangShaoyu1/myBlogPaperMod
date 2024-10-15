---
author: "王宇"
title: "服务端渲染(ssr)"
date: 四月09,2024
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 569
---
相关学习资料

[https://cn.vuejs.org/guide/scaling-up/ssr](https://cn.vuejs.org/guide/scaling-up/ssr)

[https://cn.vite-plugin-ssr.com/](https://cn.vite-plugin-ssr.com/)

  

文件结构

\- index.html  
\- server.js # main application server  
\- src/  
\- main.js # 导出环境无关的（通用的）应用代码  
\- entry-client.js # 将应用挂载到一个 DOM 元素上  
\- entry-server.js # 使用某框架的 SSR API 渲染该应用

  

  

**package.json**

[?](#)

`{`

    `"scripts"``:{`

       `"start"``:` `"node server"`

    `}`

`}`

  

  

**Dockerfile**

[?](#)

`#构建阶段`

`FROM registry.yingzi.com:``8500``/library/node:``16.14``.``2``-alpine3.``15` `as builder`

`WORKDIR` `'/web_app'`

`COPY` `package``.json .`

`COPY yarn.lock .`

`RUN npm config set` `@yingzi``:registry http:``//maven.yingzi.com:9091/nexus/repository/npmyz/`

`RUN npm config set registry https:``//registry.npmmirror.com`

`RUN npm config set sass_binary_site https:``//npmmirror.com/mirrors/node-sass/`

`RUN yarn`

`# 省略部分...`

`COPY . .`

`# RUN node ./scripts/avatar.js`

`RUN yarn build`

`# 直接启动服务即可`

`CMD [``"yarn"``,` `"start"``]`

注意不是yarn start

`CMD ["yarn", "start"]` 和直接运行 `yarn start` 的区别在于它们运行的环境。  
`CMD ["yarn", "start"]` 是在 Dockerfile 文件中使用的。这会指定在 docker 容器启动时默认执行的命令，也就是说，当你通过 Docker 运行了一个容器实例以后，Docker 就会在这个新的隔离环境中运行 `yarn start`。  
而 `yarn start` 通常是在你的本地开发环境中直接执行的，它会直接在你的本地运行，并可以直接访问你电脑上的文件系统和环境变量。  
所以核心区别在于：`CMD ["yarn", "start"]` 是在 docker 容器这个隔离环境中运行，而 `yarn start` 是在你的本地环境中运行。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)